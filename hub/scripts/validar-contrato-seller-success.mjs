// Prueba el contrato de datos del webhook de Seller Success ANTES de conectarlo
// al endpoint. Demuestra el Criterio 2 del DoD: los datos corruptos se rechazan
// con el campo exacto que violó el contrato, y los buenos pasan.
//
//   node scripts/validar-contrato-seller-success.mjs
//
// Por qué transpila a mano: en hub/ no hay runner de tests (solo Playwright con
// un spec de e2e) y Node 20 no sabe ejecutar TypeScript. En vez de sumar tsx o
// vitest solo para esto, usamos el compilador de TypeScript que ya está en
// devDependencies. Cero dependencias nuevas.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const raizHub = path.resolve(import.meta.dirname, "..");
const salida = path.join(raizHub, "node_modules", ".cache", "contratos");

function compilar(rutaRelativa) {
  const origen = path.join(raizHub, rutaRelativa);
  const js = ts.transpileModule(fs.readFileSync(origen, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: origen,
  }).outputText;

  fs.mkdirSync(salida, { recursive: true });
  const destino = path.join(salida, path.basename(rutaRelativa).replace(/\.ts$/, ".mjs"));
  fs.writeFileSync(destino, js);
  return import(pathToFileURL(destino).href);
}

const { validarLoteSellerMetrics, VERSION_CONTRATO_SELLER } = await compilar(
  "src/lib/contracts/seller-metrics-contract.ts"
);
const { hashCanonico, construirEventoFeatureLog } = await compilar(
  "src/lib/contracts/feature-log-contract.ts"
);

// ───────────────────────────────────────────────────────────────────────────

let fallos = 0;
function comprobar(descripcion, condicion, detalle) {
  if (condicion) {
    console.log(`  ✓ ${descripcion}`);
  } else {
    fallos++;
    console.log(`  ✗ ${descripcion}`);
    if (detalle !== undefined) console.log(`      ${JSON.stringify(detalle)}`);
  }
}

const violacionesDe = (registro) => validarLoteSellerMetrics([registro]).violaciones;
const pasa = (registro) => validarLoteSellerMetrics([registro]).ok;
const dato = (registro) => validarLoteSellerMetrics([registro]).registros[0];

// ───────────────────────────────────────────────────────────────────────────
console.log("\n1. El payload que hoy envía data_analyst_webhook_sender.py");
// Copiado literal de dropshipper-lab/data_analyst_webhook_sender.py:57-65.
const payloadRealDeMiguel = {
  user_id: "671121",
  name: "Sandry Rodelo",
  email: "sandryrodelo07@gmail.com",
  pais: "Colombia",
  total_orders: 393,
  nivel_leyendas: "Explorador",
};

const vMiguel = violacionesDe(payloadRealDeMiguel);
comprobar("se rechaza (usa alias que el contrato ya no acepta)", !pasa(payloadRealDeMiguel));
comprobar(
  "dice que 'pais' debe llamarse 'country'",
  vMiguel.some((v) => v.path[0] === "pais" && v.renombrar_a === "country"),
  vMiguel
);
comprobar(
  "dice que 'total_orders' debe llamarse 'real_orders_delivered'",
  vMiguel.some((v) => v.path[0] === "total_orders" && v.renombrar_a === "real_orders_delivered")
);
comprobar(
  "dice que 'nivel_leyendas' debe llamarse 'tipo_proveedor'",
  vMiguel.some((v) => v.path[0] === "nivel_leyendas" && v.renombrar_a === "tipo_proveedor")
);
console.log("      → esta es la lista exacta que hay que cerrar con Miguel antes del PR 4:");
for (const v of vMiguel) console.log(`        ${v.path[0]} → ${v.renombrar_a ?? "(sin canónico)"}`);

// ───────────────────────────────────────────────────────────────────────────
console.log("\n2. El mismo payload con nombres canónicos y todo como string (CSV)");
const payloadCanonico = {
  user_id: "671121",
  name: "Sandry Rodelo",
  email: "sandryrodelo07@gmail.com",
  country: "Colombia",
  real_orders_delivered: "393",
  tipo_proveedor: "Explorador",
  es_activo_30d: "si",
  dias_en_activarse: "14",
};

comprobar("pasa el contrato", pasa(payloadCanonico), violacionesDe(payloadCanonico));
comprobar('"393" se coerciona al número 393', dato(payloadCanonico)?.real_orders_delivered === 393);
comprobar('"si" se coerciona al booleano true', dato(payloadCanonico)?.es_activo_30d === true);
comprobar(
  '"Explorador" se acepta sin enum (taxonomía aún en disputa)',
  dato(payloadCanonico)?.tipo_proveedor === "Explorador"
);

// ───────────────────────────────────────────────────────────────────────────
console.log("\n3. La trampa silenciosa: string vacío NO es cero");
const conVacio = dato({ user_id: "1", real_orders_delivered: "" });
comprobar(
  'real_orders_delivered: "" queda como no informado, no como 0',
  conVacio?.real_orders_delivered === undefined,
  conVacio
);
comprobar(
  "un seller con 0 real sí se guarda como 0",
  dato({ user_id: "1", real_orders_delivered: "0" })?.real_orders_delivered === 0
);

// ───────────────────────────────────────────────────────────────────────────
console.log("\n4. Datos corruptos rechazados con el campo exacto");
const casosCorruptos = [
  ["texto donde va un entero", { user_id: "1", real_orders_delivered: "abc" }, "real_orders_delivered"],
  ["separador de miles", { user_id: "1", real_orders_delivered: "1,234" }, "real_orders_delivered"],
  ["decimal donde va un entero", { user_id: "1", real_orders_delivered: "1.5" }, "real_orders_delivered"],
  ["órdenes negativas", { user_id: "1", real_orders_delivered: -5 }, "real_orders_delivered"],
  ["booleano ambiguo", { user_id: "1", es_activo_30d: "quizá" }, "es_activo_30d"],
  ["fecha basura", { user_id: "1", fecha_activacion: "ayer" }, "fecha_activacion"],
];

for (const [nombre, registro, campoEsperado] of casosCorruptos) {
  const v = violacionesDe(registro);
  comprobar(
    `${nombre} → 422 señalando '${campoEsperado}'`,
    !pasa(registro) && v.some((x) => x.path[0] === campoEsperado),
    v
  );
}

comprobar("sin user_id → rechazado", !pasa({ name: "Sin id" }));
comprobar('user_id vacío ("") → rechazado', !pasa({ user_id: "" }));
comprobar("user_id numérico 671121 → aceptado como string", dato({ user_id: 671121 })?.user_id === "671121");

// ───────────────────────────────────────────────────────────────────────────
console.log("\n5. Features de ML que el documento propone pero Data aún no envía");
const conFeatureFutura = { user_id: "1", tasa_entrega_30d: 0.87 };
comprobar(
  "tasa_entrega_30d se rechaza por no estar declarada (falla ruidosa, no silenciosa)",
  !pasa(conFeatureFutura),
  violacionesDe(conFeatureFutura)
);

// ───────────────────────────────────────────────────────────────────────────
console.log("\n6. Idempotencia: el hash es determinista (Criterio 5)");
comprobar(
  "el orden de las claves no cambia el hash",
  hashCanonico({ a: 1, b: { z: 2, y: 3 } }) === hashCanonico({ b: { y: 3, z: 2 }, a: 1 })
);
comprobar("un valor distinto sí cambia el hash", hashCanonico({ a: 1 }) !== hashCanonico({ a: 2 }));
comprobar(
  "undefined y ausente son el mismo payload",
  hashCanonico({ a: 1, b: undefined }) === hashCanonico({ a: 1 })
);
comprobar(
  "el orden de un arreglo sí importa",
  hashCanonico({ a: [1, 2] }) !== hashCanonico({ a: [2, 1] })
);

// ───────────────────────────────────────────────────────────────────────────
console.log("\n7. Sobre del feature log: corte declarado vs. suplido");
const ingesta = new Date("2026-09-03T12:00:00.000Z");

const sinCorte = construirEventoFeatureLog(
  { user_id: "671121", real_orders_delivered: 393 },
  { entityId: "671121", entityType: "dropshipper", contractVersion: VERSION_CONTRATO_SELLER, ingestadoEn: ingesta }
);
comprobar("sin corte → usa la hora de ingesta", sinCorte.event_timestamp === ingesta.toISOString());
comprobar("sin corte → queda marcado _timestamp_suplido", sinCorte.payload._timestamp_suplido === true);

const conCorte = construirEventoFeatureLog(
  { user_id: "671121", real_orders_delivered: 393 },
  {
    entityId: "671121",
    entityType: "dropshipper",
    contractVersion: VERSION_CONTRATO_SELLER,
    ingestadoEn: ingesta,
    corteTimestamp: "2026-09-01T00:00:00.000Z",
  }
);
comprobar("con corte → usa el corte declarado", conCorte.event_timestamp === "2026-09-01T00:00:00.000Z");
comprobar("con corte → no lleva la marca de suplido", conCorte.payload._timestamp_suplido === undefined);
comprobar(
  "un evento suplido y uno declarado nunca colisionan en la unique",
  sinCorte.event_hash !== conCorte.event_hash
);

const reintento = construirEventoFeatureLog(
  { real_orders_delivered: 393, user_id: "671121" }, // mismas claves, otro orden
  {
    entityId: "671121",
    entityType: "dropshipper",
    contractVersion: VERSION_CONTRATO_SELLER,
    ingestadoEn: new Date("2026-09-03T18:30:00.000Z"), // reintentado horas después
    corteTimestamp: "2026-09-01T00:00:00.000Z",
  }
);
comprobar(
  "reenviar el mismo lote produce la misma llave (entity_id, event_timestamp, event_hash)",
  reintento.entity_id === conCorte.entity_id &&
    reintento.event_timestamp === conCorte.event_timestamp &&
    reintento.event_hash === conCorte.event_hash
);

// ───────────────────────────────────────────────────────────────────────────
console.log("\n8. Lote mixto: se reportan todos los registros malos, no solo el primero");
const lote = validarLoteSellerMetrics([
  { user_id: "1", real_orders_delivered: "10" },
  { user_id: "2", real_orders_delivered: "abc" },
  { user_id: "3", pais: "Colombia" },
]);
comprobar("el lote no pasa", !lote.ok);
comprobar("señala el registro 1 y el 2", lote.violaciones.some((v) => v.registro === 1) && lote.violaciones.some((v) => v.registro === 2));
comprobar("conserva el registro válido para el modo observador", lote.registros.length === 1 && lote.registros[0].user_id === "1");

// ───────────────────────────────────────────────────────────────────────────
console.log(
  fallos === 0
    ? `\n✅ Contrato ${VERSION_CONTRATO_SELLER}: todas las comprobaciones pasaron.\n`
    : `\n❌ ${fallos} comprobación(es) fallaron.\n`
);
process.exit(fallos === 0 ? 0 : 1);
