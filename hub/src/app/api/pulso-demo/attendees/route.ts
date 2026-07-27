import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// GET la usa tanto el dashboard público en vivo (solo necesita el conteo por
// rol) como el panel de admin (necesita el registro completo para
// gestionar/borrar asistentes). Sin sesión solo se devuelven columnas sin
// PII — nunca email, whatsapp ni el token de aceptación.
const PUBLIC_COLUMNS = "id, name, role, accepted_at, created_at";

export async function GET() {
  if (!supabase) return NextResponse.json([]);
  const user = await requireUser();
  const { data, error } = await supabase
    .from("pulso_demo_attendees")
    .select(user ? "*" : PUBLIC_COLUMNS)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// Solo la usa el panel de admin (alta manual de asistentes). El registro
// público de un asistente real pasa por /api/pulso-demo/register.
export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { name, email, whatsapp } = await req.json();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const { data, error } = await supabase
    .from("pulso_demo_attendees")
    .insert({ name, email: email || null, whatsapp: whatsapp || null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { id } = await req.json();
  const { error } = await supabase
    .from("pulso_demo_attendees")
    .delete()
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
