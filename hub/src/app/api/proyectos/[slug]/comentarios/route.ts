import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Hilo de comentarios de un proyecto (tabla `project_comments`: project_id,
// autor = email de quien comenta, comentario, created_at). La tabla está
// cerrada a escritura directa por RLS igual que `projects`, así que todo pasa
// por acá con SUPABASE_SERVICE_KEY. Cualquier usuario autenticado de Darwin
// puede leer y comentar — el tablero de Delivery es compartido entre células
// y la atribución queda en `autor`.

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
    .from("project_comments")
    .select("id, autor, comentario, created_at")
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
  const comentario = typeof body?.comentario === "string" ? body.comentario.trim() : "";
  if (!comentario) return NextResponse.json({ error: "El comentario está vacío" }, { status: 400 });

  const autor = user.email ?? "desconocido";

  const { data, error } = await supabase
    .from("project_comments")
    .insert({ project_id: projectId, autor, comentario })
    .select("id, autor, comentario, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
