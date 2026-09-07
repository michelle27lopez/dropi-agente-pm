import { NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) return NextResponse.json({ user: null, profile: null });

  if (!supabase) return NextResponse.json({ user, profile: null });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, nombre, is_super_admin, is_stakeholder, celula_id, celulas(nombre, slug, ve_hub_completo)")
    .eq("id", user.id)
    .maybeSingle();

  // Células donde este perfil tiene permiso de edición ADICIONAL, sin ser su
  // celula_id primario — ver 055_celula_editores_transversales.sql. El front
  // (esCelulaPropia/canCreate en /celula/[slug]) lo usa para no depender
  // solo de la igualdad simple con celula_id.
  let celulasEditor: string[] = [];
  if (profile) {
    const { data: editorRows } = await supabase
      .from("celula_editores")
      .select("celula_id")
      .eq("profile_id", profile.id);
    celulasEditor = (editorRows ?? []).map((r) => r.celula_id);
  }

  return NextResponse.json({ user: { id: user.id, email: user.email }, profile, celulasEditor });
}
