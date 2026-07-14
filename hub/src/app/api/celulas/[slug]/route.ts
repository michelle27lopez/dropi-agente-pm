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
