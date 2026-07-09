import { NextRequest, NextResponse } from "next/server";
import { campaignsSupabase as supabase } from "@/lib/supabase-campaigns";
import { localGetCampaign, localUpdateCampaign } from "@/lib/local-store-planeacion";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (supabase) {
    const { data, error } = await supabase
      .from("campaigns_planeacion")
      .select("*")
      .eq("id", id)
      .single();
    if (!error) return NextResponse.json(data);
  }

  return NextResponse.json(await localGetCampaign(id));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (supabase) {
    const { data, error } = await supabase
      .from("campaigns_planeacion")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (!error) return NextResponse.json(data);
  }

  const updated = await localUpdateCampaign(id, body);
  if (!updated) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}
