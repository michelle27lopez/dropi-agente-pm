import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const MAX_NAME_LENGTH = 80;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`pulso-demo-register:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Demasiadas solicitudes, intenta de nuevo en un minuto" }, { status: 429 });
  }

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { name, email, whatsapp, role } = await req.json();
  const trimmedName = name?.trim() ?? "";
  if (!trimmedName) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (trimmedName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer` }, { status: 400 });
  }
  if (/[<>]/.test(trimmedName)) {
    return NextResponse.json({ error: "name contains invalid characters" }, { status: 400 });
  }
  const validRole = role === "supplier" ? "supplier" : "dropshipper";

  const { data, error } = await supabase
    .from("pulso_demo_attendees")
    .insert({
      name: trimmedName,
      email: email?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      role: validRole,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, token: data.token, name: data.name, role: validRole });
}
