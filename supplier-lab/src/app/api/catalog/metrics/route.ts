import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export interface CatalogMetricRow {
  node_id: string;
  snapshot_date: string;
  value_num: number | null;
  value_display: string | null;
  unit: string | null;
  trend: "up" | "down" | "stable" | null;
  trend_value: string | null;
  health: "good" | "warning" | "critical" | "neutral" | null;
  total_catalog: number | null;
  breakdown: Record<string, unknown> | null;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured", metrics: [] },
      { status: 503 }
    );
  }

  // Buscar el snapshot más reciente disponible
  const { data: latestDate } = await supabase
    .from("catalog_metrics_daily")
    .select("snapshot_date")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();

  if (!latestDate) {
    return NextResponse.json({ metrics: [], snapshot_date: null });
  }

  const { data, error } = await supabase
    .from("catalog_metrics_daily")
    .select(
      "node_id, snapshot_date, value_num, value_display, unit, trend, trend_value, health, total_catalog, breakdown"
    )
    .eq("snapshot_date", latestDate.snapshot_date)
    .order("node_id");

  if (error) {
    return NextResponse.json({ error: error.message, metrics: [] }, { status: 500 });
  }

  return NextResponse.json({
    metrics: data as CatalogMetricRow[],
    snapshot_date: latestDate.snapshot_date,
    total_catalog: data?.[0]?.total_catalog ?? null,
  });
}
