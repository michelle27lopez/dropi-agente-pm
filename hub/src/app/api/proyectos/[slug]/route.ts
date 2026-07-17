import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest, context: any) {
  const { slug } = await context.params;
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  // Find the project by project_code (case-insensitive) or by id
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*, celulas(nombre, slug)")
    .or(`project_code.ilike.${slug},id.eq.${slug}`)
    .maybeSingle();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  // Fetch cycles associated with this project. Use either project_code or id as fallback
  const { data: cycles, error: cyclesError } = await supabase
    .from("discovery_cycles")
    .select("*")
    .eq("project_id", project.project_code || project.id);

  if (cyclesError) {
    console.warn("[Project Detail API] Error loading cycles:", cyclesError.message);
  }

  // Fetch decisions linked to the loaded cycles
  let decisions: any[] = [];
  if (cycles && cycles.length > 0) {
    const cycleIds = cycles.map((c) => c.id);
    const { data: decisionsData, error: decisionsError } = await supabase
      .from("discovery_decisions")
      .select("*")
      .in("cycle_id", cycleIds);

    if (decisionsError) {
      console.warn("[Project Detail API] Error loading decisions:", decisionsError.message);
    } else {
      decisions = decisionsData || [];
    }
  }

  return NextResponse.json({
    project,
    cycles: cycles || [],
    decisions,
  });
}
