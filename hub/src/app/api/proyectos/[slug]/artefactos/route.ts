import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Artefactos (links a páginas/prototipos publicados) de un proyecto — tabla
// `project_artifacts`: project_id, nombre, url, descripcion, creado_por,
// created_at. Mismo patrón que comentarios/route.ts: la tabla está cerrada a
// escritura directa por RLS, todo pasa por acá con SUPABASE_SERVICE_KEY.
// Existe para proyectos como GRO-003 que van a acumular varios artefactos
// distintos (uno por lanzamiento/workshop) y no caben en el único campo
// `prototype_url` de `projects`.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function resolveProjectId(slug: string): Promise<string | null> {
  if (!supabase) return null;
  if (UUID_RE.test(slug)) return slug;
  const { data } = await supabase
    .from("projects")
    .select("id")
    .ilike("project_code", slug)
    .maybeSingle();
  return data?.id ?? null;
}

export async function GET(_req: NextRequest, context: any) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const projectId = await resolveProjectId(slug);
  if (!projectId) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const { data, error } = await supabase
    .from("project_artifacts")
    .select("id, nombre, url, descripcion, creado_por, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, context: any) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const projectId = await resolveProjectId(slug);
  if (!projectId) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const descripcion = typeof body?.descripcion === "string" ? body.descripcion.trim() : null;
  if (!nombre) return NextResponse.json({ error: "Falta el nombre del artefacto" }, { status: 400 });
  if (!url || !(url.startsWith("http://") || url.startsWith("https://"))) {
    return NextResponse.json({ error: "El link debe empezar con http:// o https://" }, { status: 400 });
  }

  const creado_por = user.email ?? "desconocido";

  const { data, error } = await supabase
    .from("project_artifacts")
    .insert({ project_id: projectId, nombre, url, descripcion, creado_por })
    .select("id, nombre, url, descripcion, creado_por, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest, context: any) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await context.params;
  const projectId = await resolveProjectId(slug);
  if (!projectId) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

  const artifactId = req.nextUrl.searchParams.get("id");
  if (!artifactId) return NextResponse.json({ error: "Falta el id del artefacto" }, { status: 400 });

  const { error } = await supabase
    .from("project_artifacts")
    .delete()
    .eq("id", artifactId)
    .eq("project_id", projectId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
