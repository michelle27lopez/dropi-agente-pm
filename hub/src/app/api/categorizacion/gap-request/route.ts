import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// GET — listar solicitudes de enriquecimiento de categoría (para cola de revisión)
// Query params: status (default: pending), limit (default: 200)
export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json([], { status: 200 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "200", 10);

  let query = supabase
    .from("category_gap_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — crear una solicitud de enriquecimiento (supplier no encontró categoría adecuada)
// Body: { product_name, requested_category, source, ai_top_suggestions? }
export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase)
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

  const { data, error } = await supabase
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

// PATCH — marcar solicitud como agregada / descartada
// Body: { id, status, reviewed_by?, notes? }
export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase)
    return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  const body = await req.json() as {
    id?: string;
    status?: string;
    reviewed_by?: string;
    notes?: string;
  };

  if (!body.id || !body.status)
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });

  if (!["pending", "added", "rejected"].includes(body.status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    status: body.status,
    resolved_at: new Date().toISOString(),
  };
  if (body.reviewed_by) updates.reviewed_by = body.reviewed_by;
  if (body.notes !== undefined) updates.notes = body.notes;

  const { data, error } = await supabase
    .from("category_gap_requests")
    .update(updates)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
