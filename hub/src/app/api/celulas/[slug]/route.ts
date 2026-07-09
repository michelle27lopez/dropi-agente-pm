import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    supabase.from("projects").select("id, name, project_code, status, type, handoff_status").eq("celula_owner_id", celula.id),
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
