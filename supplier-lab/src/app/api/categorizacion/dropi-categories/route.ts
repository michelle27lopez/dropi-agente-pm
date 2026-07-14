import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET — árbol completo de categorías Dropi (hojas L4) para el explorador manual del cliente
export async function GET() {
  if (!supabaseAdmin) return NextResponse.json([], { status: 200 });

  const { data, error } = await supabaseAdmin
    .from("dropi_categories")
    .select("dropi_category_id,dropi_category_path,level_1,level_2,level_3,level_4")
    .eq("status", "active")
    .order("dropi_category_path", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
