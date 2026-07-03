import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// POST — crear una solicitud de enriquecimiento (supplier no encontró categoría adecuada)
// Body: { product_name, requested_category, source, ai_top_suggestions? }
// La cola de revisión vive en el hub (proyecto Categorización → Recursos → Solicitudes de Enriquecimiento),
// que lee de la misma tabla category_gap_requests.
export async function POST(req: NextRequest) {
  if (!supabaseAdmin)
    return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  const body = await req.json() as {
    product_name?: string;
    requested_category?: string;
    source?: string;
    ai_top_suggestions?: unknown;
  };

  if (!body.product_name?.trim() || !body.requested_category?.trim() || !body.source) {
    return NextResponse.json(
      { error: "product_name, requested_category and source are required" },
      { status: 400 }
    );
  }

  if (!["ai_no_match", "manual_no_match"].includes(body.source)) {
    return NextResponse.json({ error: "invalid source" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("category_gap_requests")
    .insert({
      product_name: body.product_name.trim(),
      requested_category: body.requested_category.trim(),
      source: body.source,
      ai_top_suggestions: body.ai_top_suggestions ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
