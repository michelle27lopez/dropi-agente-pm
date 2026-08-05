import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

/**
 * Autoriza una app interna usando la tabla compartida `user_access`.
 *
 * Falla cerrado: estar autenticado en el Hub no concede acceso automático a
 * datos operativos sensibles. Los superadministradores conservan acceso para
 * poder administrar y diagnosticar la aplicación.
 */
export async function requireAppAccess(appName: string) {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user || !user.email || !supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.is_super_admin) return user;

  const { data: access, error } = await supabase
    .from("user_access")
    .select("app_name")
    .eq("email", user.email.trim().toLowerCase())
    .eq("app_name", appName)
    .maybeSingle();

  if (error || !access) return null;
  return user;
}
