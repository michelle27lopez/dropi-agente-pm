import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { validateGraphUpdate, type GraphData } from "@/lib/graph-validator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const proposed: Partial<GraphData> = body.proposed ?? body;

    // Read current graph from disk
    const graphPath = join(process.cwd(), "src/data/supplier-success-graph.json");
    const rawCurrent = readFileSync(graphPath, "utf-8");
    const current: GraphData = JSON.parse(rawCurrent);

    const report = validateGraphUpdate(current, proposed);
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
