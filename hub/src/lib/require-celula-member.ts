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
export async function requireCelulaMember(celulaId: string) {
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
