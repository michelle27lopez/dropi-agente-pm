import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { data, error } = await supabase
    .from("activa_demo_attendees")
    .select("id, name, role, category, token, match_id, whatsapp, created_at")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function DELETE(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { id } = await req.json();
  const { error } = await supabase.from("activa_demo_attendees").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
