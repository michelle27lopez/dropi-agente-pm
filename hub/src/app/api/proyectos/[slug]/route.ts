import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";
import { requireCelulaMember } from "@/lib/require-celula-member";
import { nextProjectCode } from "@/lib/project-code";

const ESTADOS_DISCOVERY = ["Research", "Ideación", "Concepción de experimento"];
const ESTADOS_POC = ["Seguimiento", "En definición", "En priorización"];

// Resuelve un proyecto por project_code (case-insensitive) o por id, evitando
// errores de cast cuando el slug no es un UUID válido.
async function findProject(slug: string) {
  if (!supabase) return { project: null, error: "Supabase no configurado" };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);

  let query = supabase.from("projects").select("*, celulas(nombre, slug)");
  query = isUuid ? query.or(`project_code.ilike.${slug},id.eq.${slug}`) : query.ilike("project_code", slug);

  const { data: project, error } = await query.maybeSingle();
  if (error) return { project: null, error: error.message };
  return { project, error: null };
}

export async function GET(req: NextRequest, context: any) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { slug } = await context.params;
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const { project, error: findError } = await findProject(slug);
  if (findError) {
    return NextResponse.json({ error: findError }, { status: 500 });
  }
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  // Proyecto padre (breadcrumb), si este proyecto es un POC hijo.
  let parent: { id: string; name: string; project_code: string | null } | null = null;
  if (project.parent_project_id) {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code")
      .eq("id", project.parent_project_id)
      .maybeSingle();
    parent = data ?? null;
  }

  // POCs hijos de este proyecto, si este proyecto no es él mismo un POC.
  let children: { id: string; name: string; project_code: string | null; estado_interno: string | null }[] = [];
  if (project.type !== "POC") {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, estado_interno")
      .eq("parent_project_id", project.id);
    children = data ?? [];
  }

  // Candidatos a "proyecto padre" para un POC sin vincular todavía — todos
  // los Discovery projects (type != POC, incluyendo type sin definir) de la
  // misma célula. Se filtra en JS porque `type` puede ser NULL y `.neq()` en
  // SQL excluye los NULL por lógica de tres valores.
  let discoveryOptions: { id: string; name: string; project_code: string | null }[] = [];
  if (project.type === "POC" && !project.parent_project_id) {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, type")
      .eq("celula_owner_id", project.celula_owner_id);
    discoveryOptions = (data ?? []).filter((p) => p.type !== "POC" && p.id !== project.id);
  }

  // Fetch cycles associated with this project. Use either project_code or id as fallback
  let { data: cycles, error: cyclesError } = await supabase
    .from("discovery_cycles")
    .select("*")
    .eq("project_id", project.project_code || project.id);

  if (cyclesError) {
    console.warn("[Project Detail API] Error loading cycles:", cyclesError.message);
  }

  // If this is a POC and has no cycles, fetch the parent's cycles
  if ((!cycles || cycles.length === 0) && project.parent_project_id) {
    const { data: parentProj } = await supabase
      .from("projects")
      .select("id, project_code")
      .eq("id", project.parent_project_id)
      .maybeSingle();

    if (parentProj) {
      const { data: parentCycles, error: parentCyclesError } = await supabase
        .from("discovery_cycles")
        .select("*")
        .eq("project_id", parentProj.project_code || parentProj.id);
      
      if (!parentCyclesError && parentCycles && parentCycles.length > 0) {
        cycles = parentCycles;
      }
    }
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

  const mappedCycles = cycles?.map((c: any) => ({
    ...c,
    ...c.data
  })) || [];

  return NextResponse.json({
    project,
    parent,
    children,
    discoveryOptions,
    cycles: mappedCycles,
    decisions,
  });
}

// Cambia el estado_interno y/o el VPV de un proyecto — solo un miembro de la
// célula dueña (o super admin) puede hacerlo.
export async function PATCH(req: NextRequest, context: any) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const { project, error: findError } = await findProject(slug);
  if (findError) return NextResponse.json({ error: findError }, { status: 500 });
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const caller = await requireCelulaMember(project.celula_owner_id);
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const update: Record<string, unknown> = {};

  if (body.estado_interno !== undefined) {
    const estadosValidos = project.type === "POC" ? ESTADOS_POC : ESTADOS_DISCOVERY;
    if (!estadosValidos.includes(body.estado_interno)) {
      return NextResponse.json({ error: `estado_interno inválido para type=${project.type}` }, { status: 400 });
    }
    update.estado_interno = body.estado_interno;
  }

  if (body.vpv !== undefined) {
    const vpv = body.vpv === null ? null : Number(body.vpv);
    if (vpv !== null && Number.isNaN(vpv)) {
      return NextResponse.json({ error: "vpv debe ser numérico" }, { status: 400 });
    }
    update.vpv = vpv;
  }

  // Vincula manualmente este proyecto (debe ser un POC) a un Discovery
  // project ya existente de la misma célula — para POCs que quedaron
  // huérfanos antes de que existiera esta relación.
  if (body.parent_project_id !== undefined) {
    if (project.type !== "POC") {
      return NextResponse.json({ error: "Solo un POC puede tener parent_project_id" }, { status: 400 });
    }
    if (body.parent_project_id === null) {
      update.parent_project_id = null;
    } else {
      const { data: candidate } = await supabase
        .from("projects")
        .select("id, type, celula_owner_id")
        .eq("id", body.parent_project_id)
        .maybeSingle();

      if (!candidate || candidate.celula_owner_id !== project.celula_owner_id) {
        return NextResponse.json({ error: "Proyecto padre inválido" }, { status: 400 });
      }
      if (candidate.type === "POC") {
        return NextResponse.json({ error: "Un POC no puede tener a su vez un POC hijo" }, { status: 400 });
      }
      if (candidate.id === project.id) {
        return NextResponse.json({ error: "Un proyecto no puede ser padre de sí mismo" }, { status: 400 });
      }
      update.parent_project_id = candidate.id;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", project.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Crea un POC hijo de este proyecto (que debe ser un Discovery project, es
// decir type !== "POC"). El POC nace con su propio project_code y URL.
export async function POST(req: NextRequest, context: any) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const { project: parentProject, error: findError } = await findProject(slug);
  if (findError) return NextResponse.json({ error: findError }, { status: 500 });
  if (!parentProject) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  if (parentProject.type === "POC") {
    return NextResponse.json({ error: "Un POC no puede tener a su vez un POC hijo" }, { status: 400 });
  }

  const caller = await requireCelulaMember(parentProject.celula_owner_id);
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";

  if (!name || !summary) {
    return NextResponse.json({ error: "Faltan campos: name, summary" }, { status: 400 });
  }

  const { data: celula } = await supabase
    .from("celulas")
    .select("slug")
    .eq("id", parentProject.celula_owner_id)
    .maybeSingle();

  const { data: existentes, error: existentesError } = await supabase
    .from("projects")
    .select("project_code")
    .eq("celula_owner_id", parentProject.celula_owner_id);

  if (existentesError) return NextResponse.json({ error: existentesError.message }, { status: 500 });

  const { data: created, error: insertError } = await supabase
    .from("projects")
    .insert({
      name,
      summary,
      project_code: nextProjectCode(celula?.slug ?? "poc", existentes ?? []),
      status: "in_progress",
      type: "POC",
      handoff_status: "Experimentación",
      estado_interno: "En definición",
      celula_owner_id: parentProject.celula_owner_id,
      parent_project_id: parentProject.id,
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json(created, { status: 201 });
}
