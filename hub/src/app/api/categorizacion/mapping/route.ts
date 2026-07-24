import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// GET — fetch mappings (only rank=1, optionally filtered)
// Query params: status, confidence, limit (default 500)
export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json([], { status: 200 });

  const { searchParams } = new URL(req.url);
  const status     = searchParams.get("status");     // pending_review | approved | rejected | needs_more_context
  const confidence = searchParams.get("confidence"); // high | medium | low | needs_review
  const limit      = parseInt(searchParams.get("limit") ?? "500", 10);

  let query = supabase
    .from("dropi_google_category_mapping")
    .select("*")
    .eq("suggestion_rank", 1)
    .order("dropi_category_path", { ascending: true })
    .limit(limit);

  if (status)     query = query.eq("status", status);
  if (confidence) query = query.eq("confidence_label", confidence);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH — approve / reject / override a mapping
// Body: { id, status, reviewed_by?, notes?, google_category_id?, google_category_path? }
export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase)
    return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  const body = await req.json() as {
    id: number;
    status: string;
    reviewed_by?: string;
    notes?: string;
    google_category_id?: string;
    google_category_path?: string;
  };

  if (!body.id || !body.status)
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });

  const updates: Record<string, unknown> = {
    status:      body.status,
    reviewed_at: new Date().toISOString(),
    updated_at:  new Date().toISOString(),
  };

  if (body.reviewed_by)       updates.reviewed_by       = body.reviewed_by;
  if (body.notes !== undefined) updates.notes            = body.notes;

  // If user selected a different Google category (manual override), update it and change match_type
  if (body.google_category_id && body.google_category_path) {
    updates.google_category_id   = body.google_category_id;
    updates.google_category_path = body.google_category_path;
    updates.match_type           = "manual";
  }

  const { data, error } = await supabase
    .from("dropi_google_category_mapping")
    .update(updates)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// GET alternatives for a given dropi_category_id (ranks 2-5)
// Usage: GET /api/categorizacion/mapping?alternatives=true&dropi_id=xxx
// (handled via GET above by adding dropi_id filter)
