import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const caller = await requireSuperAdmin();
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const { email, password, nombre, celula_id } = body;

  if (!email || !password || !celula_id) {
    return NextResponse.json({ error: "Faltan campos: email, password, celula_id" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: created.user.id,
      email,
      nombre: nombre ?? null,
      celula_id,
      is_super_admin: false,
    })
    .select()
    .single();

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  return NextResponse.json(profile, { status: 201 });
}
