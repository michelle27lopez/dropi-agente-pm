import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { token, committed_units } = await req.json();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const { data: attendee, error: findError } = await supabase
    .from("pulso_demo_attendees")
    .select("id, name, accepted_at")
    .eq("token", token)
    .single();

  if (findError || !attendee) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (attendee.accepted_at) {
    return NextResponse.json({ ok: true, already: true, name: attendee.name });
  }

  // Intentar con committed_units; si falla la columna no existe aún
  const updatePayload: Record<string, unknown> = {
    accepted_at: new Date().toISOString(),
  };
  if (committed_units != null) updatePayload.committed_units = committed_units;

  const { error: updateError } = await supabase
    .from("pulso_demo_attendees")
    .update(updatePayload)
    .eq("token", token);

  // Si falla por columna inexistente, reintentar sin committed_units
  if (updateError) {
    const { error: retryError } = await supabase
      .from("pulso_demo_attendees")
      .update({ accepted_at: new Date().toISOString() })
      .eq("token", token);

    if (retryError) {
      return NextResponse.json({ error: retryError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, name: attendee.name });
}
