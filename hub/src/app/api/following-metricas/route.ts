import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Tablero transversal de Following (todas las células) — ver 056. Los
// proyectos vienen siempre de `projects` (type = 'Following', ya existe);
// las métricas (CES, estándares) vienen de `following_project_metrics`, que
// puede no existir todavía si la 056 no se ha corrido — se degrada igual que
// service-design-360 en vez de tirar un 500.

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { data: proyectos, error: errorProyectos } = await supabase
    .from("projects")
    .select("id, name, project_code, updated_at, celulas(id, nombre, slug)")
    .eq("type", "Following")
    .order("project_code", { ascending: true });

  if (errorProyectos) {
    return NextResponse.json({ error: errorProyectos.message }, { status: 500 });
  }

  const { data: metricas, error: errorMetricas } = await supabase
    .from("following_project_metrics")
    .select("project_id, ces_score, ces_meta, estandar_exito, estandar_fracaso, notas, updated_at");

  // Misma detección que service-design-360: PostgREST vía supabase-js
  // devuelve "PGRST205" si la tabla no existe todavía (migración 056
  // pendiente de aplicar manualmente); Postgres crudo daría "42P01".
  const tablaFalta =
    !!errorMetricas &&
    (errorMetricas.code === "42P01" ||
      errorMetricas.code === "PGRST205" ||
      /does not exist/i.test(errorMetricas.message) ||
      /could not find the table/i.test(errorMetricas.message));

  if (errorMetricas && !tablaFalta) {
    return NextResponse.json({ error: errorMetricas.message }, { status: 500 });
  }

  const metricasPorProyecto = new Map((metricas ?? []).map((m) => [m.project_id, m]));

  const items = (proyectos ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    project_code: p.project_code,
    celula: p.celulas,
    metricas: metricasPorProyecto.get(p.id) ?? null,
  }));

  return NextResponse.json({ items, migracionPendiente: tablaFalta });
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json();
  const projectId = typeof body.project_id === "string" ? body.project_id : "";
  if (!projectId) return NextResponse.json({ error: "Falta project_id" }, { status: 400 });

  const update: Record<string, unknown> = { project_id: projectId, updated_at: new Date().toISOString() };
  for (const campo of ["ces_score", "ces_meta", "estandar_exito", "estandar_fracaso", "notas"] as const) {
    if (body[campo] !== undefined) update[campo] = body[campo];
  }

  const { data, error } = await supabase
    .from("following_project_metrics")
    .upsert(update, { onConflict: "project_id" })
    .select("project_id, ces_score, ces_meta, estandar_exito, estandar_fracaso, notas, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
