import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
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
    .select("id, name, project_code, status, type, handoff_status, celula_owner_id");

  if (projectsError) return NextResponse.json({ error: projectsError.message }, { status: 500 });

  const result = (celulas ?? []).map((celula) => ({
    ...celula,
    miembros: (profiles ?? []).filter((p) => p.celula_id === celula.id),
    proyectos: (projects ?? []).filter((p) => p.celula_owner_id === celula.id),
  }));

  return NextResponse.json(result);
}
