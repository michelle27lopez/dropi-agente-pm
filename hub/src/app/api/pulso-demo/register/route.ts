import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { name, email, whatsapp, role } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
  const validRole = role === "supplier" ? "supplier" : "dropshipper";

  const { data, error } = await supabase
    .from("pulso_demo_attendees")
    .insert({
      name: name.trim(),
      email: email?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      role: validRole,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, token: data.token, name: data.name, role: validRole });
}
