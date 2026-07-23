import { NextRequest, NextResponse } from "next/server";
import { campaignsSupabase as supabase } from "@/lib/supabase-campaigns";
import { localListCampaigns, localCreateCampaign } from "@/lib/local-store-planeacion";
import { requireUser } from "@/lib/require-auth";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (supabase) {
    const { data, error } = await supabase
      .from("campaigns_planeacion")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) return NextResponse.json(data ?? []);
  }
  return NextResponse.json(await localListCampaigns());
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();

  if (supabase) {
    const { data, error } = await supabase
      .from("campaigns_planeacion")
      .insert({ name: body.name, status: "draft", current_node: 0 })
      .select()
      .single();
    if (!error) return NextResponse.json(data);
  }

  return NextResponse.json(await localCreateCampaign(body.name));
}
