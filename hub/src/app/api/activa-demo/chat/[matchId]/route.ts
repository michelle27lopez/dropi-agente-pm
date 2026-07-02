import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ matchId: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { matchId } = await params;
  const { data, error } = await supabase
    .from("activa_demo_messages")
    .select("id, sender_role, content, created_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ matchId: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { matchId } = await params;
  const { content, sender_role } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "content required" }, { status: 400 });

  const { data, error } = await supabase
    .from("activa_demo_messages")
    .insert({ match_id: matchId, sender_role, content: content.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: data });
}
