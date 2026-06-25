import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const sessionRes = await supabase
    .from("pulso_demo_sessions")
    .select("id")
    .eq("active", true)
    .order("triggered_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sessionRes.data?.id) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 400 });
  }

  await supabase
    .from("pulso_demo_sessions")
    .update({ supplier_accepted_at: new Date().toISOString() })
    .eq("id", sessionRes.data.id);

  return NextResponse.json({ ok: true });
}
