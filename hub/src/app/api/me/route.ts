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

  return NextResponse.json({ user: { id: user.id, email: user.email }, profile });
}
