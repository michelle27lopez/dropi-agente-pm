import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

const PAGE = 1000;

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const rows: Record<string, unknown>[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("supplier_ascenso_panel")
      .select("*")
      .order("pct_umbral", { ascending: false })
      .range(from, from + PAGE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  const activos = rows.filter(r => (r.estado_snapshot ?? "activo") === "activo");
  const perdidos = rows.filter(r => r.estado_snapshot === "perdido");

  const fuente = (activos[0]?.fecha_extraccion as string) ?? null;

  return NextResponse.json({
    generadoEn: fuente,
    fuente: "supplier_ascenso_panel (Supabase)",
    total: activos.length,
    prospectos: activos.map(r => ({
      id: String(r.supplier_id),
      nombre: r.supplier_name,
      email: r.email,
      nivelActual: r.nivel_actual,
      nivelObjetivo: r.nivel_objetivo,
      ordenesMovilizadas90d: r.ordenes_movilizadas_90d,
      umbralObjetivo: r.umbral_objetivo,
      pctUmbral: r.pct_umbral,
      despachosPct: r.despachos_pct,
      despachoTiempoH: r.despacho_tiempo_h,
      garantiasRecibidas90d: r.garantias_recibidas_90d,
      garantiasGestionPct: r.garantias_gestion_pct,
      garantiasTiempoH: r.garantias_tiempo_h,
    })),
    // "Se le pasó el momento": estaban Listos, nadie les avisó, y dejaron de
    // calificar en algún import semanal. Se conservan para Historial en vez
    // de borrarse — ver hub/supabase/023_ascenso_panel_perdidos.sql.
    perdidos: perdidos.map(r => ({
      id: String(r.supplier_id),
      nombre: r.supplier_name,
      nivelObjetivo: r.nivel_objetivo,
      ordenesMovilizadas90d: r.ordenes_movilizadas_90d,
      umbralObjetivo: r.umbral_objetivo,
      pctUmbral: r.pct_umbral,
      perdidoEn: r.perdido_en,
    })),
  });
}
