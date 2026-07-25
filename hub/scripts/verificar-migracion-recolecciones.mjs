// Verifica que la migración 033 quedó bien aplicada.
//
//   cd hub && node --env-file=.env.local scripts/verificar-migracion-recolecciones.mjs
//
// Correrlo DESPUÉS de pegar el SQL en el editor de Supabase. Comprueba que
// existan las 7 tablas, que las columnas clave estén, que la semilla haya
// entrado y que RLS esté activo. Un "Success. No rows returned" en el editor
// no garantiza nada de eso: el editor corta en el primer error y deja la base
// a medio crear sin que se note.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error("Faltan SUPABASE_URL / SUPABASE_SERVICE_KEY.");
  console.error("Correr desde hub/ con: node --env-file=.env.local scripts/…");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

// Columnas que el código consulta de verdad: si falta una, algo falló.
const ESPERADO = {
  rec_transportadora:   ["id", "nombre", "canal_preferido", "min_paquetes", "formato_archivo"],
  rec_bodega:           ["warehouse_id", "nombre", "direccion", "cod_dane", "supplier_id",
                         "supplier_nombre", "telefono", "telefono_proveedor",
                         "fulfillment_by_dropi", "lat", "lng", "nivel_precision"],
  rec_carga_diaria:     ["fecha", "warehouse_id", "transportadora", "preparadas",
                         "guia_generada", "edad_15d_mas", "ultimo_evento"],
  rec_solicitud:        ["id", "fecha", "transportadora_id", "estado", "canal", "paquetes"],
  rec_solicitud_bodega: ["id", "solicitud_id", "warehouse_id", "paquetes", "incluida_por", "recogido"],
  rec_gestion:          ["id", "tipo", "destinatario_tipo", "canal", "resultado", "warehouse_id"],
  rec_importacion:      ["id", "archivo", "fecha_datos", "bodegas", "guias", "usuario"],
};

let fallas = 0;
const fallo = m => { console.log("  ✗ " + m); fallas++; };

console.log("TABLAS Y COLUMNAS\n");
for (const [tabla, columnas] of Object.entries(ESPERADO)) {
  // Pedir explícitamente las columnas: si alguna no existe, PostgREST responde 400
  // con el nombre exacto. Un select("*") pasaría aunque falten columnas.
  const { error } = await db.from(tabla).select(columnas.join(", ")).limit(1);
  if (error) {
    fallo(`${tabla}: ${error.message}`);
  } else {
    const { count } = await db.from(tabla).select("*", { count: "exact", head: true });
    console.log(`  ✓ ${tabla.padEnd(22)} ${columnas.length} columnas · ${count ?? 0} filas`);
  }
}

console.log("\nSEMILLA DE TRANSPORTADORAS\n");
const { data: transportadoras, error: eT } = await db
  .from("rec_transportadora")
  .select("id, canal_preferido, min_paquetes")
  .order("id");

if (eT) fallo(`no se pudo leer rec_transportadora: ${eT.message}`);
else if (!transportadoras?.length) fallo("la semilla no entró: rec_transportadora está vacía");
else {
  console.log(`  ✓ ${transportadoras.length} transportadoras`);
  const sinMinimo = transportadoras.filter(t => t.min_paquetes !== 10);
  if (sinMinimo.length) {
    console.log(`  · ${sinMinimo.length} con min_paquetes distinto de 10 (ok si ya se ajustó a mano)`);
  }
  const esperadas = ["ENVIA", "INTERRAPIDISIMO", "COORDINADORA"];
  const faltan = esperadas.filter(e => !transportadoras.some(t => t.id === e));
  if (faltan.length) fallo(`faltan transportadoras en la semilla: ${faltan.join(", ")}`);
}

console.log("\nRLS (debe estar activo en todas)\n");
// La anon key ve solo lo que RLS permita. Si con anon se pueden leer filas de
// una tabla, esa tabla quedó abierta al público — acá hay teléfonos y
// direcciones operativas.
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!anon) {
  console.log("  · sin NEXT_PUBLIC_SUPABASE_ANON_KEY: no se pudo comprobar");
} else {
  const publico = createClient(url, anon, { auth: { persistSession: false } });
  for (const tabla of Object.keys(ESPERADO)) {
    const { data, error } = await publico.from(tabla).select("*").limit(1);
    // PGRST205 = la tabla no existe. Eso NO es "está protegida": es que no está.
    // Reportarlo como ✓ daría por buena una seguridad que nadie configuró.
    if (error?.code === "PGRST205") console.log(`  ? ${tabla.padEnd(22)} no existe — nada que comprobar`);
    else if (error) console.log(`  ✓ ${tabla.padEnd(22)} cerrada a anon`);
    else if (!data?.length) console.log(`  ✓ ${tabla.padEnd(22)} sin filas visibles para anon`);
    else fallo(`${tabla} ES LEGIBLE con la anon key — RLS no quedó aplicado`);
  }
}

console.log("\n" + "═".repeat(58));
if (fallas) {
  console.log(`${fallas} problema(s). La migración NO quedó completa.`);
  console.log("Revisá el SQL Editor: probablemente cortó en el primer error.");
  process.exit(1);
}
console.log("Migración aplicada correctamente.");
console.log("\nSiguiente paso — cargar los datos:");
console.log("  node --env-file=.env.local public/logistica/recolecciones/pipeline/seed-supabase.js");
