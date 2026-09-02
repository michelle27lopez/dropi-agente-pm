import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Log de cambios de un proyecto (tabla `project_changelog`). Solo lectura —
// las filas las escribe el PATCH de /api/proyectos/[id] con la service key.
// Cualquier usuario autenticado puede consultarlo.

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
    .from("project_changelog")
    .select("id, autor, campo, valor_anterior, valor_nuevo, nota, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
