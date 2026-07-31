import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

const PRODUCT_ID = "00000000-0000-0000-0000-000000000001";

const UPDATABLE_FIELDS = [
  "name",
  "description",
  "category",
  "price_cost",
  "price_suggested",
  "margin_pct",
  "stock",
  "supplier_name",
  "supplier_city",
  "image_url",
  "active",
] as const;

function pickUpdatableFields(body: Record<string, unknown>) {
  const clean: Record<string, unknown> = {};
  for (const field of UPDATABLE_FIELDS) {
    if (field in body) clean[field] = body[field];
  }
  return clean;
}

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
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const body = await req.json();
  const { data, error } = await supabase
    .from("pulso_demo_product")
    .update(pickUpdatableFields(body))
    .eq("id", PRODUCT_ID)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
