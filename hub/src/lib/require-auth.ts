import { createClient as createServerSupabase } from "@/lib/supabase-server";

export async function requireUser() {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  return user;
}
