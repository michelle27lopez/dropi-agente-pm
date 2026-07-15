import { NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

async function requireSuperAdmin() {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user || !supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.is_super_admin ? user : null;
}

// Solo deja crear proyectos a alguien de la propia célula (o super admin) —
// el celula_id sale siempre del perfil autenticado, nunca del body.
async function requireCelulaMember(celulaId: string) {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user || !supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, celula_id, is_super_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  return profile.is_super_admin || profile.celula_id === celulaId ? profile : null;
}

// Reusa el prefijo que la célula ya tenga en uso (el de mayor número, si hay
// varios) e incrementa; si no tiene ninguno todavía, deriva uno de su slug.
function nextProjectCode(slug: string, existentes: { project_code: string | null }[]): string {
  const maxByPrefix = new Map<string, number>();
  for (const { project_code } of existentes) {
    if (!project_code) continue;
    const [prefix, numStr] = project_code.split("-");
    const num = parseInt(numStr, 10);
    if (!prefix || Number.isNaN(num)) continue;
    maxByPrefix.set(prefix, Math.max(maxByPrefix.get(prefix) ?? 0, num));
  }

  if (maxByPrefix.size > 0) {
    const [prefix, max] = [...maxByPrefix.entries()].sort((a, b) => b[1] - a[1])[0];
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }

  const prefix = slug.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "PRJ";
  return `${prefix}-001`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await params;

  const { data: celula, error: celulaError } = await supabase
    .from("celulas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (celulaError) return NextResponse.json({ error: celulaError.message }, { status: 500 });
  if (!celula) return NextResponse.json({ error: "Célula no encontrada" }, { status: 404 });

  const [{ data: miembros }, { data: proyectos }, { data: updates }, { data: roadmap }] = await Promise.all([
    supabase.from("profiles").select("id, email, nombre, is_super_admin").eq("celula_id", celula.id),
    supabase.from("projects").select("id, name, project_code, status, type, handoff_status, summary, business_area, prototype_url").eq("celula_owner_id", celula.id),
    supabase.from("celula_updates").select("*").eq("celula_id", celula.id).order("week_date", { ascending: false }),
    supabase.from("roadmap_items").select("*").eq("celula_id", celula.id).order("target_date", { ascending: true }),
  ]);

  return NextResponse.json({
    ...celula,
    miembros: miembros ?? [],
    proyectos: proyectos ?? [],
    updates: updates ?? [],
    roadmap: roadmap ?? [],
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { slug } = await params;

  const { data: celula, error: celulaError } = await supabase
    .from("celulas")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (celulaError) return NextResponse.json({ error: celulaError.message }, { status: 500 });
  if (!celula) return NextResponse.json({ error: "Célula no encontrada" }, { status: 404 });

  const caller = await requireCelulaMember(celula.id);
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";

  if (!name || !summary) {
    return NextResponse.json({ error: "Faltan campos: name, summary" }, { status: 400 });
  }

  const { data: existentes, error: existentesError } = await supabase
    .from("projects")
    .select("project_code")
    .eq("celula_owner_id", celula.id);

  if (existentesError) return NextResponse.json({ error: existentesError.message }, { status: 500 });

  const { data: created, error: insertError } = await supabase
    .from("projects")
    .insert({
      name,
      summary,
      project_code: nextProjectCode(celula.slug, existentes ?? []),
      status: "in_progress",
      type: "Idea",
      handoff_status: "Experimentación",
      celula_owner_id: celula.id,
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const caller = await requireSuperAdmin();
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { slug } = await params;
  const body = await req.json();

  if (typeof body.ve_hub_completo !== "boolean") {
    return NextResponse.json({ error: "Falta ve_hub_completo (boolean)" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("celulas")
    .update({ ve_hub_completo: body.ve_hub_completo })
    .eq("slug", slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
