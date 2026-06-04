import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const [monthly, segments6m, monthlySegments, pipelineMetrics, timeMetrics, weeklyData] = await Promise.all([
    supabase.from("ttv_monthly_data").select("*").order("month_number"),
    supabase.from("ttv_segments_6m").select("*").order("sort_order"),
    supabase.from("ttv_monthly_segments").select("*").order("month_number").order("sort_order"),
    supabase.from("ttv_pipeline_metrics").select("*").order("sort_order"),
    supabase.from("ttv_time_metrics").select("*").order("scope"),
    supabase.from("ttv_weekly_data").select("*").order("month_number").order("week_number"),
  ]);

  return NextResponse.json({
    monthly: monthly.data ?? [],
    segments6m: segments6m.data ?? [],
    monthlySegments: monthlySegments.data ?? [],
    pipelineMetrics: pipelineMetrics.data ?? [],
    timeMetrics: timeMetrics.data ?? [],
    weeklyData: weeklyData.data ?? [],
  });
}

const ALLOWED_TABLES = [
  "ttv_monthly_data",
  "ttv_segments_6m",
  "ttv_monthly_segments",
  "ttv_pipeline_metrics",
  "ttv_time_metrics",
  "ttv_weekly_data",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

export async function PATCH(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const body = await req.json();
  const { table, id, updates } = body as { table: AllowedTable; id: string; updates: Record<string, unknown> };

  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const { error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
