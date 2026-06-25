import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PRODUCT_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  if (!supabase) return NextResponse.json(null);
  const { data, error } = await supabase
    .from("pulso_demo_product")
    .select("*")
    .eq("id", PRODUCT_ID)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const body = await req.json();
  const { data, error } = await supabase
    .from("pulso_demo_product")
    .update(body)
    .eq("id", PRODUCT_ID)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
