import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { localListNodes, localUpsertNode } from "@/lib/local-store-planeacion";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (supabase) {
    const { data, error } = await supabase
      .from("campaign_planeacion_nodes")
      .select("*")
      .eq("campaign_id", id)
      .order("node_index", { ascending: true });
    if (!error) return NextResponse.json(data ?? []);
  }

  return NextResponse.json(await localListNodes(id));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (supabase) {
    const { data: existing } = await supabase
      .from("campaign_planeacion_nodes")
      .select("id")
      .eq("campaign_id", id)
      .eq("node_index", body.node_index)
      .single();

    if (existing?.id) {
      const { data, error } = await supabase
        .from("campaign_planeacion_nodes")
        .update({ data: body.data, completed: body.completed ?? true, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (!error) return NextResponse.json(data);
    } else {
      const { data, error } = await supabase
        .from("campaign_planeacion_nodes")
        .insert({
          campaign_id: id,
          node_index: body.node_index,
          node_key: body.node_key,
          data: body.data,
          completed: body.completed ?? true,
        })
        .select()
        .single();
      if (!error) return NextResponse.json(data);
    }
  }

  return NextResponse.json(await localUpsertNode(id, body));
}
