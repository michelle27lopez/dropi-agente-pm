import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

export async function requireSuperAdmin() {
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

// Solo deja actuar sobre proyectos de la propia célula (o super admin) — el
// celula_id sale siempre del perfil autenticado, nunca del body.
//
// "Propia célula" ya no es solo `profile.celula_id === celulaId`: desde
// `055_celula_editores_transversales.sql` un perfil puede tener permiso de
// edición ADICIONAL sobre otras células (proyectos transversales, ej. Diana
// Aldana en Product team sin dejar de ser de Experience) vía la tabla
// `celula_editores` — no le mueve el `celula_id` primario a nadie.
export async function requireCelulaMember(celulaId: string) {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user || !supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, celula_id, is_super_admin, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  if (profile.is_super_admin || profile.celula_id === celulaId) return profile;

  const { data: editor } = await supabase
    .from("celula_editores")
    .select("celula_id")
    .eq("profile_id", profile.id)
    .eq("celula_id", celulaId)
    .maybeSingle();

  return editor ? profile : null;
}
