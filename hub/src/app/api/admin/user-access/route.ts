import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

// Apps conocidas hoy. Agregar una nueva es una línea acá y en el checkbox
// del frontend — no toca esquema (app_name es texto libre en la tabla).
export const APPS = ["darwin", "inidiana"] as const;
export type AppName = (typeof APPS)[number];

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

// GET — listar todas las filas (email × app_name). El frontend agrupa por email.
export async function GET() {
  const caller = await requireSuperAdmin();
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { data, error } = await supabase
    .from("user_access")
    .select("email, app_name, created_at")
    .order("email", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — otorgar/ajustar acceso. Body: { email, apps: string[] }.
// Reemplaza el conjunto de apps de ese email por el enviado: agrega las que
// falten y quita las que ya no estén marcadas — así "editar" y "crear" son
// la misma operación desde el frontend.
export async function POST(req: NextRequest) {
  const caller = await requireSuperAdmin();
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const apps = Array.isArray(body.apps) ? body.apps.filter((a: unknown): a is AppName =>
    typeof a === "string" && (APPS as readonly string[]).includes(a)
  ) : [];

  if (!email) return NextResponse.json({ error: "email requerido" }, { status: 400 });

  const { data: actuales, error: errLeer } = await supabase
    .from("user_access")
    .select("app_name")
    .eq("email", email);
  if (errLeer) return NextResponse.json({ error: errLeer.message }, { status: 500 });

  const actualesSet = new Set((actuales ?? []).map((r) => r.app_name));
  const nuevoSet = new Set(apps);

  const aAgregar = apps.filter((a: string) => !actualesSet.has(a));
  const aQuitar = [...actualesSet].filter((a) => !nuevoSet.has(a));

  if (aAgregar.length > 0) {
    const { error } = await supabase
      .from("user_access")
      .insert(aAgregar.map((app_name: string) => ({ email, app_name })));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (aQuitar.length > 0) {
    const { error } = await supabase
      .from("user_access")
      .delete()
      .eq("email", email)
      .in("app_name", aQuitar);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email, apps: [...nuevoSet] });
}

// DELETE — revocar. Body: { email } quita todas sus filas; { email, app_name }
// quita solo esa app.
export async function DELETE(req: NextRequest) {
  const caller = await requireSuperAdmin();
  if (!caller) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return NextResponse.json({ error: "email requerido" }, { status: 400 });

  let query = supabase.from("user_access").delete().eq("email", email);
  if (typeof body.app_name === "string") {
    query = query.eq("app_name", body.app_name);
  }

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
