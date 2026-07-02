import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  await supabase.from("activa_demo_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("activa_demo_matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("activa_demo_attendees").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  return NextResponse.json({ ok: true });
}
