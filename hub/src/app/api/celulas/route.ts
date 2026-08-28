import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json([]);

  const { data: celulas, error: celulasError } = await supabase
    .from("celulas")
    .select("*")
    .order("nombre", { ascending: true });

  if (celulasError) return NextResponse.json({ error: celulasError.message }, { status: 500 });

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, nombre, celula_id, is_super_admin");

  if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 });

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select(
      "id, name, project_code, status, type, handoff_status, celula_owner_id, estado_interno, prioridad, updated_at, created_at, fecha_inicio_dev, fecha_entrega_propuesta",
    );

  if (projectsError) return NextResponse.json({ error: projectsError.message }, { status: 500 });

  const { data: updates, error: updatesError } = await supabase
    .from("celula_updates")
    .select("id, celula_id");

  if (updatesError) return NextResponse.json({ error: updatesError.message }, { status: 500 });

  const { data: roadmap, error: roadmapError } = await supabase
    .from("roadmap_items")
    .select("id, celula_id");

  if (roadmapError) return NextResponse.json({ error: roadmapError.message }, { status: 500 });

  const result = (celulas ?? []).map((celula) => ({
    ...celula,
    miembros: (profiles ?? []).filter((p) => p.celula_id === celula.id),
    proyectos: (projects ?? []).filter((p) => p.celula_owner_id === celula.id),
    updates: (updates ?? []).filter((u) => u.celula_id === celula.id),
    roadmap: (roadmap ?? []).filter((r) => r.celula_id === celula.id),
  }));

  return NextResponse.json(result);
}
