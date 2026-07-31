import { NextRequest, NextResponse } from "next/server";
import { campaignsSupabase as supabase } from "@/lib/supabase-campaigns";
import { requireUser } from "@/lib/require-auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json([]);
  const { id } = await params;
  const { data, error } = await supabase
    .from("campaign_nodes")
    .select("*")
    .eq("campaign_id", id)
    .order("node_index", { ascending: true });
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { id } = await params;
  const body = await req.json();

  // Upsert node data
  const { data: existing } = await supabase
    .from("campaign_nodes")
    .select("id")
    .eq("campaign_id", id)
    .eq("node_index", body.node_index)
    .single();

  let result;
  if (existing?.id) {
    const { data, error } = await supabase
      .from("campaign_nodes")
      .update({ data: body.data, completed: body.completed ?? true, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    result = data;
  } else {
    const { data, error } = await supabase
      .from("campaign_nodes")
      .insert({
        campaign_id: id,
        node_index: body.node_index,
        node_key: body.node_key,
        data: body.data,
        completed: body.completed ?? true,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    result = data;
  }

  return NextResponse.json(result);
}
