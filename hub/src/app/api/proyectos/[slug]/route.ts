import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";
import { requireCelulaMember } from "@/lib/require-celula-member";
import { nextProjectCode } from "@/lib/project-code";

const ESTADOS_DISCOVERY = ["Research", "Ideación", "Concepción de experimento", "Activo", "Cerrado"];
const ESTADOS_POC = ["Seguimiento", "En definición", "En priorización"];
const ESTADOS_DELIVERY = ["En definición", "En priorización", "Pendiente Handoff", "en DEV", "Activo", "Cerrado"];
const ESTADOS_FOLLOWING = ["Beta controlada", "Producción", "Cerrado"];

function estadosValidosPara(type: string | null) {
  if (type === "POC") return ESTADOS_POC;
  if (type === "Delivery Proyecto") return ESTADOS_DELIVERY;
  if (type === "Following") return ESTADOS_FOLLOWING;
  return ESTADOS_DISCOVERY;
}

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

  // Hijos de este proyecto: POC y/o Delivery Proyecto si es un Discovery
  // project; Followings (vía related_delivery_id, no parent_project_id) si
  // es un Delivery Proyecto. Un POC o Following no tiene hijos.
  let children: { id: string; name: string; project_code: string | null; type: string | null; estado_interno: string | null; related_poc_id: string | null }[] = [];
  if (project.type !== "POC" && project.type !== "Delivery Proyecto" && project.type !== "Following") {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, type, estado_interno, related_poc_id")
      .eq("parent_project_id", project.id);
    children = data ?? [];
  } else if (project.type === "Delivery Proyecto") {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, type, estado_interno, related_poc_id")
      .eq("related_delivery_id", project.id);
    children = data ?? [];
  }

  // Candidatos a "proyecto padre" para un POC o Delivery Proyecto sin
  // vincular todavía — todos los Discovery projects (type distinto de POC,
  // Delivery Proyecto y Following, incluyendo type sin definir) de la misma
  // célula. Se filtra en JS porque `type` puede ser NULL y `.neq()` en SQL
  // excluye los NULL por lógica de tres valores.
  let discoveryOptions: { id: string; name: string; project_code: string | null }[] = [];
  if ((project.type === "POC" || project.type === "Delivery Proyecto") && !project.parent_project_id) {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, type")
      .eq("celula_owner_id", project.celula_owner_id);
    discoveryOptions = (data ?? []).filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following" && p.id !== project.id);
  }

  // POC relacionado (opcional) de un Delivery Proyecto, y todos los POC de
  // la misma célula entre los que se puede elegir.
  let relatedPoc: { id: string; name: string; project_code: string | null } | null = null;
  let pocOptions: { id: string; name: string; project_code: string | null }[] = [];
  if (project.type === "Delivery Proyecto") {
    if (project.related_poc_id) {
      const { data } = await supabase
        .from("projects")
        .select("id, name, project_code")
        .eq("id", project.related_poc_id)
        .maybeSingle();
      relatedPoc = data ?? null;
    }
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, type")
      .eq("celula_owner_id", project.celula_owner_id);
    pocOptions = (data ?? []).filter((p) => p.type === "POC");
  }

  // Delivery Proyecto del que nace este Following (obligatorio en el flujo
  // normal de creación, pero se deja re-vinculable igual que related_poc_id
  // por si queda huérfano), y todos los Delivery Proyecto de la misma célula
  // entre los que se puede elegir.
  let relatedDelivery: { id: string; name: string; project_code: string | null } | null = null;
  let deliveryOptions: { id: string; name: string; project_code: string | null }[] = [];
  if (project.type === "Following") {
    if (project.related_delivery_id) {
      const { data } = await supabase
        .from("projects")
        .select("id, name, project_code")
        .eq("id", project.related_delivery_id)
        .maybeSingle();
      relatedDelivery = data ?? null;
    }
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_code, type")
      .eq("celula_owner_id", project.celula_owner_id);
    deliveryOptions = (data ?? []).filter((p) => p.type === "Delivery Proyecto");
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

  // Weekly de Producto propio de este proyecto (distinto del weekly a nivel
  // célula en celula_updates) — ver 056_project_updates.sql.
  const { data: updates } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", project.id)
    .order("week_date", { ascending: false });

  return NextResponse.json({
    project,
    parent,
    children,
    discoveryOptions,
    relatedPoc,
    pocOptions,
    relatedDelivery,
    deliveryOptions,
    cycles: mappedCycles,
    decisions,
    updates: updates ?? [],
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
    const estadosValidos = estadosValidosPara(project.type);
    if (!estadosValidos.includes(body.estado_interno)) {
      return NextResponse.json({ error: `estado_interno inválido para type=${project.type}` }, { status: 400 });
    }
    update.estado_interno = body.estado_interno;

    // Autofill de fecha_inicio_dev: la primera vez que un Delivery Proyecto
    // pasa a 'en DEV' y todavía no tiene fecha, se sella con hoy. Editable a
    // mano después (body.fecha_inicio_dev explícito gana). Ver 053_*.sql.
    if (
      body.estado_interno === "en DEV" &&
      !project.fecha_inicio_dev &&
      body.fecha_inicio_dev === undefined
    ) {
      update.fecha_inicio_dev = new Date().toISOString().slice(0, 10);
    }
  }

  // Pipeline de fechas de un Delivery Proyecto ('YYYY-MM-DD' o null). Solo
  // tienen sentido en un Delivery Proyecto pero no se bloquea por type —
  // la UI solo las expone ahí. Ver 055_*.sql.
  const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;
  for (const campo of [
    "fecha_handoff",
    "fecha_inicio_dev",
    "fecha_entrega_qa",
    "fecha_salida_produccion",
  ] as const) {
    if (body[campo] === undefined) continue;
    if (body[campo] === null) {
      update[campo] = null;
    } else if (typeof body[campo] === "string" && FECHA_RE.test(body[campo])) {
      update[campo] = body[campo];
    } else {
      return NextResponse.json({ error: `${campo} debe ser una fecha YYYY-MM-DD o null` }, { status: 400 });
    }
  }

  if (body.prioridad !== undefined) {
    const NIVELES_PRIORIDAD = ["P0", "P1", "P2", "P3", "P4"];
    if (body.prioridad !== null && !NIVELES_PRIORIDAD.includes(body.prioridad)) {
      return NextResponse.json({ error: "prioridad inválida" }, { status: 400 });
    }
    update.prioridad = body.prioridad;
  }

  if (body.vpv !== undefined) {
    const vpv = body.vpv === null ? null : Number(body.vpv);
    if (vpv !== null && Number.isNaN(vpv)) {
      return NextResponse.json({ error: "vpv debe ser numérico" }, { status: 400 });
    }
    update.vpv = vpv;
  }

  // Vincula manualmente este proyecto (debe ser un POC o Delivery Proyecto)
  // a un Discovery project ya existente de la misma célula — para hijos que
  // quedaron huérfanos antes de que existiera esta relación.
  if (body.parent_project_id !== undefined) {
    if (project.type !== "POC" && project.type !== "Delivery Proyecto") {
      return NextResponse.json({ error: "Solo un POC o Delivery Proyecto puede tener parent_project_id" }, { status: 400 });
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
      if (candidate.type === "POC" || candidate.type === "Delivery Proyecto" || candidate.type === "Following") {
        return NextResponse.json({ error: "El padre debe ser un Discovery project" }, { status: 400 });
      }
      if (candidate.id === project.id) {
        return NextResponse.json({ error: "Un proyecto no puede ser padre de sí mismo" }, { status: 400 });
      }
      update.parent_project_id = candidate.id;
    }
  }

  // related_poc_id: solo aplica a Delivery Proyecto, y solo puede apuntar a
  // un POC de la misma célula (no necesariamente el mismo padre — un
  // Delivery Proyecto puede nacer antes de que exista el POC hermano).
  if (body.related_poc_id !== undefined) {
    if (project.type !== "Delivery Proyecto") {
      return NextResponse.json({ error: "Solo un Delivery Proyecto puede tener related_poc_id" }, { status: 400 });
    }
    if (body.related_poc_id === null) {
      update.related_poc_id = null;
    } else {
      const { data: candidate } = await supabase
        .from("projects")
        .select("id, type, celula_owner_id")
        .eq("id", body.related_poc_id)
        .maybeSingle();

      if (!candidate || candidate.celula_owner_id !== project.celula_owner_id || candidate.type !== "POC") {
        return NextResponse.json({ error: "related_poc_id debe ser un POC de la misma célula" }, { status: 400 });
      }
      update.related_poc_id = candidate.id;
    }
  }

  // related_delivery_id: solo aplica a Following, y solo puede apuntar a un
  // Delivery Proyecto de la misma célula — normalmente ya viene fijado al
  // crear el Following desde la card de su Delivery, esto es para
  // re-vincular uno que quedó huérfano.
  if (body.related_delivery_id !== undefined) {
    if (project.type !== "Following") {
      return NextResponse.json({ error: "Solo un Following puede tener related_delivery_id" }, { status: 400 });
    }
    if (body.related_delivery_id === null) {
      update.related_delivery_id = null;
    } else {
      const { data: candidate } = await supabase
        .from("projects")
        .select("id, type, celula_owner_id")
        .eq("id", body.related_delivery_id)
        .maybeSingle();

      if (!candidate || candidate.celula_owner_id !== project.celula_owner_id || candidate.type !== "Delivery Proyecto") {
        return NextResponse.json({ error: "related_delivery_id debe ser un Delivery Proyecto de la misma célula" }, { status: 400 });
      }
      update.related_delivery_id = candidate.id;
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

  // Log de cambios (best-effort — no tumba el PATCH si falla). Una fila por
  // campo "de gestión" que cambió de valor. `nota` es un comentario opcional
  // que el front adjunta a esa edición puntual. Ver 054_darwin_project_changelog.sql.
  const CAMPOS_LOG = [
    "fecha_handoff",
    "fecha_inicio_dev",
    "fecha_entrega_qa",
    "fecha_salida_produccion",
    "estado_interno",
    "prioridad",
  ] as const;
  const nota = typeof body.nota === "string" && body.nota.trim() ? body.nota.trim() : null;
  const filasLog = CAMPOS_LOG.filter((campo) => campo in update && (project as any)[campo] !== (data as any)[campo]).map(
    (campo) => ({
      project_id: project.id,
      autor: (caller as any).email ?? null,
      campo,
      valor_anterior: (project as any)[campo] != null ? String((project as any)[campo]) : null,
      valor_nuevo: (data as any)[campo] != null ? String((data as any)[campo]) : null,
      nota,
    }),
  );
  if (filasLog.length > 0) {
    const { error: logError } = await supabase.from("project_changelog").insert(filasLog);
    if (logError) console.warn("[proyectos PATCH] no se pudo escribir project_changelog:", logError.message);
  }

  return NextResponse.json(data);
}

// Borrado físico — pensado para limpiar basura/duplicados desde el front. La
// confirmación ("escribe ELIMINAR") vive del lado del cliente; acá solo se
// exige ser miembro de la célula dueña. No hay ON DELETE CASCADE en
// parent_project_id/related_poc_id/related_delivery_id (ver migraciones 036/
// 039/043), así que Postgres devuelve 23503 si el proyecto todavía tiene
// POC, Delivery Proyecto o Following asociados — se traduce a un mensaje
// legible en vez de dejar pasar el error crudo.
export async function DELETE(req: NextRequest, context: any) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const { project, error: findError } = await findProject(slug);
  if (findError) return NextResponse.json({ error: findError }, { status: 500 });
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const caller = await requireCelulaMember(project.celula_owner_id);
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { error } = await supabase.from("projects").delete().eq("id", project.id);

  if (error) {
    if (error.code === "23503") {
      return NextResponse.json(
        { error: "Este proyecto todavía tiene POCs, Delivery Proyectos o Followings asociados. Elimínalos o desvincúlalos primero." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Crea un hijo (POC, Delivery Proyecto o Following) de este proyecto.
// `body.type` default "POC" para no romper a los llamadores existentes.
//
// Para POC/Delivery Proyecto, este proyecto (`slug`) debe ser un Discovery
// project — se convierte en el `parent_project_id` directo del nuevo hijo.
//
// Para Following, este proyecto (`slug`) debe ser un Delivery Proyecto — el
// Following nace un nivel más abajo, pero se preserva la invariante de árbol
// plano (parent_project_id SIEMPRE apunta a un Discovery, nunca a un POC/
// Delivery/Following): se sube al abuelo (`parentProject.parent_project_id`)
// y se guarda el Delivery clickeado en `related_delivery_id`, mismo patrón
// que `related_poc_id`. Si el Delivery en sí nació huérfano (sin Discovery
// vinculado — pasa cuando se crea directo, no vía "+ Crear Delivery
// Proyecto" de un Discovery), el Following también nace con
// parent_project_id null: no bloqueamos la creación por eso, porque lo que
// realmente lo hace visible (célula, pills, sección "Followings") es
// related_delivery_id, no el árbol de Discovery.
export async function POST(req: NextRequest, context: any) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const { project: parentProject, error: findError } = await findProject(slug);
  if (findError) return NextResponse.json({ error: findError }, { status: 500 });
  if (!parentProject) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const body = await req.json();
  const type = body.type === "Delivery Proyecto" ? "Delivery Proyecto" : body.type === "Following" ? "Following" : "POC";

  if (type === "Following") {
    if (parentProject.type !== "Delivery Proyecto") {
      return NextResponse.json({ error: "El padre de un Following debe ser un Delivery Proyecto" }, { status: 400 });
    }
  } else if (parentProject.type === "POC" || parentProject.type === "Delivery Proyecto" || parentProject.type === "Following") {
    return NextResponse.json({ error: "El padre debe ser un Discovery project" }, { status: 400 });
  }

  const caller = await requireCelulaMember(parentProject.celula_owner_id);
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";

  if (!name || !summary) {
    return NextResponse.json({ error: "Faltan campos: name, summary" }, { status: 400 });
  }

  // related_poc_id solo tiene sentido para Delivery Proyecto, y debe ser un
  // POC de la misma célula (típicamente hermano, bajo el mismo padre).
  let relatedPocId: string | null = null;
  if (type === "Delivery Proyecto" && body.related_poc_id) {
    const { data: candidate } = await supabase
      .from("projects")
      .select("id, type, celula_owner_id")
      .eq("id", body.related_poc_id)
      .maybeSingle();
    if (!candidate || candidate.celula_owner_id !== parentProject.celula_owner_id || candidate.type !== "POC") {
      return NextResponse.json({ error: "related_poc_id debe ser un POC de la misma célula" }, { status: 400 });
    }
    relatedPocId = candidate.id;
  }

  const realParentId = type === "Following" ? parentProject.parent_project_id : parentProject.id;
  const relatedDeliveryId = type === "Following" ? parentProject.id : null;
  const estadoInicial = type === "Following" ? "Beta controlada" : "En definición";

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
      type,
      handoff_status: "Experimentación",
      estado_interno: estadoInicial,
      celula_owner_id: parentProject.celula_owner_id,
      parent_project_id: realParentId,
      related_poc_id: relatedPocId,
      related_delivery_id: relatedDeliveryId,
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json(created, { status: 201 });
}
