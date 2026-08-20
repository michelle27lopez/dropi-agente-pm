import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Importación del export panel_suppliers_YYYYMMDD.csv desde el navegador —
// reemplaza tener que correr seed_prospectos_ascenso.py a mano cada semana.
//
// Mismo patrón de dos pasos que logistica/recolecciones/importar: sin
// `confirmar` esto es un DRY RUN (preview + delta contra lo que ya hay en
// supplier_ascenso_panel) y no escribe nada. Con `confirmar: "true"` hace
// upsert por supplier_id.
//
// Los proveedores activos que NO vienen en el CSV nuevo se tratan distinto
// según el caso (decisión de Michelle, 29/07/2026 — ver
// [[project_ind001_prospectos_ascenso]]):
//   - Si estaban "Listo" (pct_umbral >= 1) y nadie les había mandado oferta
//     en ascenso_ofertas → se marcan estado_snapshot='perdido' en vez de
//     borrarse ("se le pasó el momento"), para que Comercial los vea en
//     Historial. Si reaparecen en un CSV futuro, se reactivan solos.
//   - El resto (no calificaban, o ya tenían oferta) se borra, igual que
//     hacía el script original.

export const runtime = "nodejs";
export const maxDuration = 60;

const UMBRAL: Record<string, number> = { Activo: 3000, Verificado: 45000 };
const OBJETIVO: Record<string, string> = { Activo: "Verificado", Verificado: "Premium" };
const BATCH_SIZE = 500;
const PAGE = 1000;

const COLUMNAS_REQUERIDAS = [
  "supplier_id", "supplier_name", "nivel_actual", "es_activo_operativo",
  "es_interno_dropi", "pct_umbral_siguiente_nivel", "fecha_extraccion",
];

type FilaCsv = Record<string, unknown>;

type FilaPanel = {
  supplier_id: number; supplier_name: string; email: string | null;
  nivel_actual: string; nivel_objetivo: string;
  ordenes_movilizadas_90d: number | null; umbral_objetivo: number; pct_umbral: number;
  despachos_pct: number | null; despacho_tiempo_h: number | null;
  garantias_recibidas_90d: number | null; garantias_gestion_pct: number | null;
  garantias_tiempo_h: number | null; fecha_extraccion: string;
  estado_snapshot: "activo"; perdido_en: null;
};

type ActivoActual = {
  supplier_id: number; supplier_name: string; nivel_objetivo: string;
  ordenes_movilizadas_90d: number | null; pct_umbral: number;
};

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function esVerdadero(v: unknown): boolean {
  return String(v ?? "").trim().toLowerCase() === "true";
}

// El parser de xlsx detecta valores tipo fecha en el CSV (aunque sea texto
// plano "2026-07-28...") y los convierte a serial de Excel (días desde
// 1899-12-30). Sin esto, fecha_extraccion se guarda como "46230.79..." en
// vez de una fecha legible.
function fechaTexto(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") {
    const ms = Math.round((v - 25569) * 86400 * 1000);
    return new Date(ms).toISOString().slice(0, 10);
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim().slice(0, 10);
}

function transformar(filas: FilaCsv[]): { rows: FilaPanel[]; fechaExtraccion: string | null } {
  const rows: FilaPanel[] = [];
  let fechaExtraccion: string | null = null;

  for (const r of filas) {
    const nivel = String(r["nivel_actual"] ?? "");
    if (!(nivel in UMBRAL)) continue;
    if (!esVerdadero(r["es_activo_operativo"])) continue;
    if (esVerdadero(r["es_interno_dropi"])) continue;
    const pu = num(r["pct_umbral_siguiente_nivel"]);
    if (pu === null) continue;

    const fecha = fechaTexto(r["fecha_extraccion"]);
    if (fecha) fechaExtraccion = fecha;

    rows.push({
      supplier_id: num(r["supplier_id"]) as number,
      supplier_name: String(r["supplier_name"] ?? ""),
      email: r["email"] ? String(r["email"]) : null,
      nivel_actual: nivel,
      nivel_objetivo: OBJETIVO[nivel],
      ordenes_movilizadas_90d: num(r["ordenes_movilizadas_90d"]),
      umbral_objetivo: UMBRAL[nivel],
      pct_umbral: Math.round(pu * 10000) / 10000,
      despachos_pct: num(r["despachos_pct"]),
      despacho_tiempo_h: num(r["despacho_tiempo_promedio_h"]),
      garantias_recibidas_90d: num(r["garantias_recibidas_90d"]),
      garantias_gestion_pct: num(r["garantias_gestion_pct"]),
      garantias_tiempo_h: num(r["garantias_tiempo_promedio_h"]),
      fecha_extraccion: fecha,
      estado_snapshot: "activo",
      perdido_en: null,
    });
  }

  return { rows, fechaExtraccion };
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Sin cliente de Supabase" }, { status: 500 });

  const form = await req.formData().catch(() => null);
  const archivo = form?.get("archivo");
  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo (campo 'archivo')." }, { status: 400 });
  }
  const confirmar = form?.get("confirmar") === "true";

  let filasCsv: FilaCsv[];
  try {
    const libro = XLSX.read(await archivo.arrayBuffer(), { type: "array" });
    const hoja = libro.Sheets[libro.SheetNames[0]];
    filasCsv = XLSX.utils.sheet_to_json<FilaCsv>(hoja, { defval: null });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el archivo. Debe ser .csv o .xlsx." }, { status: 400 });
  }

  const columnasFaltantes = filasCsv.length > 0
    ? COLUMNAS_REQUERIDAS.filter(c => !(c in filasCsv[0]))
    : COLUMNAS_REQUERIDAS;
  if (columnasFaltantes.length > 0) {
    return NextResponse.json(
      { error: `Faltan columnas en el archivo: ${columnasFaltantes.join(", ")}` }, { status: 400 });
  }

  const { rows, fechaExtraccion } = transformar(filasCsv);
  if (rows.length === 0 || !fechaExtraccion) {
    return NextResponse.json({ error: "No se encontraron filas válidas para cargar." }, { status: 400 });
  }
  const idsNuevos = new Set(rows.map(r => r.supplier_id));

  // ── Traer todo lo que hoy está activo, para saber qué se cae de este export ──
  const activosActuales: ActivoActual[] = [];
  {
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("supplier_ascenso_panel")
        .select("supplier_id, supplier_name, nivel_objetivo, ordenes_movilizadas_90d, pct_umbral")
        .eq("estado_snapshot", "activo")
        .range(from, from + PAGE - 1);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (!data || data.length === 0) break;
      activosActuales.push(...(data as ActivoActual[]));
      if (data.length < PAGE) break;
      from += PAGE;
    }
  }

  const activosNoEnCsv = activosActuales.filter(a => !idsNuevos.has(a.supplier_id));
  const idsNoEnCsv = activosNoEnCsv.map(a => a.supplier_id);

  // De los que se caen, cuáles ya tenían oferta enviada (no son "se le pasó
  // el momento", ya se les avisó o se les está avisando).
  const idsConOferta = new Set<number>();
  for (let i = 0; i < idsNoEnCsv.length; i += BATCH_SIZE) {
    const chunk = idsNoEnCsv.slice(i, i + BATCH_SIZE);
    if (chunk.length === 0) continue;
    const { data, error } = await supabase.from("ascenso_ofertas").select("supplier_id").in("supplier_id", chunk);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    (data ?? []).forEach(o => idsConOferta.add(o.supplier_id as number));
  }

  const perdidos = activosNoEnCsv.filter(a => a.pct_umbral >= 1 && !idsConOferta.has(a.supplier_id));
  const aBorrar = activosNoEnCsv.filter(a => !(a.pct_umbral >= 1 && !idsConOferta.has(a.supplier_id)));

  const { count: totalActivoActual } = await supabase
    .from("supplier_ascenso_panel")
    .select("supplier_id", { count: "exact", head: true })
    .eq("estado_snapshot", "activo");

  const { data: ultima } = await supabase
    .from("supplier_ascenso_panel")
    .select("fecha_extraccion")
    .order("fecha_extraccion", { ascending: false })
    .limit(1)
    .maybeSingle();

  const preview = {
    archivo: archivo.name,
    fecha_extraccion: fechaExtraccion,
    filas: rows.length,
    verificado: rows.filter(r => r.nivel_objetivo === "Verificado").length,
    premium: rows.filter(r => r.nivel_objetivo === "Premium").length,
    total_actual: totalActivoActual ?? 0,
    delta: rows.length - (totalActivoActual ?? 0),
    fecha_extraccion_anterior: ultima?.fecha_extraccion ?? null,
    // Reimportar el mismo fecha_extraccion no rompe (es upsert), pero
    // conviene saberlo antes de confirmar.
    ya_cargado_esta_fecha: ultima?.fecha_extraccion === fechaExtraccion,
    nuevos_perdidos: perdidos.length,
    nuevos_perdidos_nombres: perdidos.slice(0, 8).map(p => p.supplier_name),
    a_eliminar: aBorrar.length,
  };

  if (!confirmar) {
    return NextResponse.json({ dryRun: true, ...preview, mensaje: "Nada escrito todavía. Confirmá para guardar." });
  }

  try {
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const { error } = await supabase
        .from("supplier_ascenso_panel")
        .upsert(rows.slice(i, i + BATCH_SIZE), { onConflict: "supplier_id" });
      if (error) throw new Error(error.message);
    }

    if (perdidos.length > 0) {
      const idsPerdidos = perdidos.map(p => p.supplier_id);
      for (let i = 0; i < idsPerdidos.length; i += BATCH_SIZE) {
        const { error } = await supabase
          .from("supplier_ascenso_panel")
          .update({ estado_snapshot: "perdido", perdido_en: fechaExtraccion })
          .in("supplier_id", idsPerdidos.slice(i, i + BATCH_SIZE));
        if (error) throw new Error(error.message);
      }
    }

    if (aBorrar.length > 0) {
      const idsBorrar = aBorrar.map(a => a.supplier_id);
      for (let i = 0; i < idsBorrar.length; i += BATCH_SIZE) {
        const { error } = await supabase
          .from("supplier_ascenso_panel")
          .delete()
          .in("supplier_id", idsBorrar.slice(i, i + BATCH_SIZE));
        if (error) throw new Error(error.message);
      }
    }

    return NextResponse.json({ ok: true, ...preview, eliminados: aBorrar.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error escribiendo en Supabase" }, { status: 500 });
  }
}
