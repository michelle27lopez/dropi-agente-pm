import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { requireAppAccess } from "@/lib/app-access";
import {
  agruparPorBodega, resumir, validarColumnas, ubicar, fechaDelExport,
  type CoordCache, type FilaExport, type Precision,
} from "@/lib/recolecciones";

// Importación del export de Chronos desde el navegador — el botón "Actualizar
// datos" del módulo. Reemplaza tener que correr un script local.
//
// Dos pasos, como en ascenso-ofertas: sin `confirmar` esto es un DRY RUN que
// devuelve el preview y el delta contra la última importación, y NO escribe nada.
// Recién con `confirmar: "true"` toca la base. Un archivo equivocado (el export
// viejo, otro reporte, un CSV a medio bajar) se ve en el preview antes de que
// pise la data buena.

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await requireAppAccess("inidiana");
  if (!user) return NextResponse.json({ error: "Sin acceso a Control de Recolecciones" }, { status: 403 });
  if (!supabase) return NextResponse.json({ error: "Sin cliente de Supabase" }, { status: 500 });

  const form = await req.formData().catch(() => null);
  const archivo = form?.get("archivo");
  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo (campo 'archivo')." }, { status: 400 });
  }
  const confirmar = form?.get("confirmar") === "true";

  // ── Parseo ───────────────────────────────────────────────────────────────
  let filas: FilaExport[];
  try {
    const libro = XLSX.read(await archivo.arrayBuffer(), { type: "array" });
    const hoja = libro.Sheets[libro.SheetNames[0]];
    filas = XLSX.utils.sheet_to_json<FilaExport>(hoja, { defval: null });
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el archivo. Debe ser .xlsx o .csv." }, { status: 400 });
  }

  const problema = validarColumnas(filas);
  if (problema) return NextResponse.json({ error: problema }, { status: 400 });

  const bodegas = agruparPorBodega(filas);
  const resumen = resumir(filas, bodegas);
  const fecha = fechaDelExport(resumen);

  // ── Delta contra lo que ya hay ───────────────────────────────────────────
  // Sin esto el preview no dice nada útil: "2.055 bodegas" solo significa algo
  // comparado con las que había.
  const { data: ultima } = await supabase
    .from("rec_importacion")
    .select("fecha_datos, bodegas, guias, created_at, usuario")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const delta = ultima
    ? {
        bodegas: resumen.bodegas - (ultima.bodegas ?? 0),
        guias: resumen.guias - (ultima.guias ?? 0),
        anterior: ultima,
      }
    : null;

  const yaExiste = await supabase
    .from("rec_carga_diaria")
    .select("fecha", { count: "exact", head: true })
    .eq("fecha", fecha);

  // ── ¿El export viene cortado? ────────────────────────────────────────────
  // Pasó con el del 28-jul: 4.000 filas exactas, ordenado por volumen
  // descendente y con menos bodegas que el anterior pese a una ventana 15x
  // más amplia. Era un tope del exportador, no el fin de los datos.
  //
  // Un archivo truncado entra sin error y se ve normal — por eso hay que
  // decirlo acá. La señal es la combinación: total redondo Y orden
  // descendente Y última fila en el mínimo. Cualquiera de las tres sola es
  // coincidencia; las tres juntas, no.
  const vol = filas.map(f => Number(f.preparadas ?? 0) + Number(f.guia_generada ?? 0));
  const desc = vol.every((v, i) => i === 0 || vol[i - 1] >= v);
  const redondo = filas.length >= 1000 && filas.length % 1000 === 0;
  const truncado = redondo && desc && vol[vol.length - 1] <= Math.min(...vol);

  const conTelefono = bodegas.filter(b => b.telefono || b.telefono_proveedor).length;
  const conEdades = bodegas.filter(b =>
    Object.values(b.edades).some(v => v > 0)).length;

  const preview = {
    archivo: archivo.name,
    fecha_datos: fecha,
    resumen,
    delta,
    // Reimportar el mismo día no rompe (es upsert), pero conviene saberlo.
    pisa_carga_del_dia: (yaExiste.count ?? 0) > 0,
    // Qué trae de nuevo: si el export es de los viejos, estos van en 0 y se
    // ve de una que no aporta contacto ni antigüedad.
    columnas_nuevas: {
      con_telefono: conTelefono,
      con_antiguedad: conEdades,
    },
    aviso: truncado
      ? `El archivo tiene exactamente ${filas.length.toLocaleString("es-CO")} filas, ` +
        `viene ordenado de mayor a menor y la última es la más chica. ` +
        `Probablemente esté cortado por un tope del exportador y falte la cola ` +
        `de bodegas con pocas guías. Se puede cargar igual —los totales serán un ` +
        `piso, no la foto completa— y volver a subir el archivo completo encima.`
      : null,
  };

  if (!confirmar) {
    return NextResponse.json({
      dryRun: true,
      ...preview,
      mensaje: "Nada escrito todavía. Confirmá para guardar.",
    });
  }

  // ── Escritura ────────────────────────────────────────────────────────────
  // Las coordenadas ya resueltas se conservan: la importación NO re-geocodifica ni
  // pisa una ubicación verificada a mano. Solo cambia si la dirección cambió.
  const ids = bodegas.map(b => b.warehouse_id);
  const cache = new Map<string, CoordCache>();
  for (let i = 0; i < ids.length; i += 1000) {
    const { data } = await supabase
      .from("rec_bodega")
      .select("warehouse_id, lat, lng, nivel_precision, fuente, direccion_geocodificada")
      .in("warehouse_id", ids.slice(i, i + 1000));
    for (const r of data ?? []) {
      cache.set(r.warehouse_id, {
        lat: r.lat, lng: r.lng,
        nivel_precision: r.nivel_precision as Precision,
        fuente: r.fuente,
        direccion_geocodificada: r.direccion_geocodificada,
      });
    }
  }

  const ahora = new Date().toISOString();
  const filasBodega = bodegas.map(b => {
    const previo = cache.get(b.warehouse_id);
    const u = ubicar(b, previo);
    const conserva = previo && u.nivel_precision === previo.nivel_precision && u.lat === previo.lat;
    const fila: Record<string, unknown> = {
      warehouse_id: b.warehouse_id,
      nombre: b.nombre, direccion: b.direccion,
      municipio: b.municipio, dpto: b.dpto, cod_dane: b.cod_dane,
      lat: u.lat, lng: u.lng,
      nivel_precision: u.nivel_precision,
      fuente: u.fuente,
      direccion_geocodificada: conserva ? previo?.direccion_geocodificada : null,
      updated_at: ahora,
    };

    // Contacto e identidad: solo se escriben si el export los trae.
    //
    // Un export que no incluya la columna —el del 25-jul, por ejemplo— no
    // puede borrar un teléfono que ya está bien, ni menos uno corregido a
    // mano. Por eso se omite la clave en vez de mandar null: PostgREST solo
    // actualiza las columnas presentes en el objeto, así que lo ausente
    // queda intacto.
    if (b.supplier_id !== null) fila.supplier_id = b.supplier_id;
    if (b.supplier_nombre !== null) fila.supplier_nombre = b.supplier_nombre;
    if (b.telefono !== null) fila.telefono = b.telefono;
    if (b.telefono_proveedor !== null) fila.telefono_proveedor = b.telefono_proveedor;
    if (b.fulfillment_by_dropi !== null) fila.fulfillment_by_dropi = b.fulfillment_by_dropi;
    if (b.bodega_creada_at !== null) {
      fila.bodega_creada_at = b.bodega_creada_at.replace(" ", "T") + "Z";
    }
    return fila;
  });

  const filasCarga = bodegas.flatMap(b =>
    b.cargas.map(c => ({
      fecha,
      warehouse_id: b.warehouse_id,
      transportadora: c.transportadora,
      preparadas: c.preparadas,
      guia_generada: c.guia_generada,
      // Las cubetas de antigüedad, al grano de la transportadora. Hasta el
      // export del 28-jul esto quedaba en NULL a propósito: no teníamos el
      // dato y un 0 habría dicho "todo es de hoy", que era falso.
      edad_0_1d: c.edad_0_1d,
      edad_2_3d: c.edad_2_3d,
      edad_4_7d: c.edad_4_7d,
      edad_8_15d: c.edad_8_15d,
      edad_15d_mas: c.edad_15d_mas,
      ultimo_evento: b.ultimo_evento ? b.ultimo_evento.replace(" ", "T") + "Z" : null,
    })),
  );

  try {
    for (let i = 0; i < filasBodega.length; i += 500) {
      const { error } = await supabase
        .from("rec_bodega")
        .upsert(filasBodega.slice(i, i + 500), { onConflict: "warehouse_id" });
      if (error) throw new Error(`rec_bodega: ${error.message}`);
    }
    for (let i = 0; i < filasCarga.length; i += 500) {
      const { error } = await supabase
        .from("rec_carga_diaria")
        .upsert(filasCarga.slice(i, i + 500), { onConflict: "fecha,warehouse_id,transportadora" });
      if (error) throw new Error(`rec_carga_diaria: ${error.message}`);
    }
    await supabase.from("rec_importacion").insert({
      archivo: archivo.name,
      fecha_datos: fecha,
      filas: filasCarga.length,
      bodegas: bodegas.length,
      guias: resumen.guias,
      usuario: user.email ?? user.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error escribiendo en Supabase" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, ...preview });
}
