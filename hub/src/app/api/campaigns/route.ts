import { NextRequest, NextResponse } from "next/server";
import { campaignsSupabase as supabase } from "@/lib/supabase-campaigns";

const PROJECT_ID = "d64b428a-3c99-412f-8100-53e07bd20ed8"; // DCA-001

export async function GET() {
  if (!supabase) return NextResponse.json([]);
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("project_id", PROJECT_ID)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const body = await req.json();
  const { data, error } = await supabase
    .from("campaigns")
    .insert({ project_id: PROJECT_ID, name: body.name, status: "draft", current_node: 0 })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
