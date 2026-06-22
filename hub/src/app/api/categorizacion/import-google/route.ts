import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const TAXONOMY_URL =
  "https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt";

interface TaxonomyRecord {
  google_category_id: string;
  google_category_path: string;
  level_1: string | null;
  level_2: string | null;
  level_3: string | null;
  level_4: string | null;
  level_5: string | null;
  level_6: string | null;
  level_7: string | null;
  depth: number;
  source_url: string;
  imported_at: string;
}

function parseLine(line: string): TaxonomyRecord | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const dashIdx = trimmed.indexOf(" - ");
  if (dashIdx === -1) return null;

  const google_category_id = trimmed.slice(0, dashIdx).trim();
  const google_category_path = trimmed.slice(dashIdx + 3).trim();
  if (!google_category_id || !google_category_path) return null;

  const levels = google_category_path.split(" > ");

  return {
    google_category_id,
    google_category_path,
    level_1: levels[0] ?? null,
    level_2: levels[1] ?? null,
    level_3: levels[2] ?? null,
    level_4: levels[3] ?? null,
    level_5: levels[4] ?? null,
    level_6: levels[5] ?? null,
    level_7: levels[6] ?? null,
    depth: levels.length,
    source_url: TAXONOMY_URL,
    imported_at: new Date().toISOString(),
  };
}

// GET — check how many categories are already imported
export async function GET() {
  if (!supabase) return NextResponse.json({ count: 0 });

  const { count, error } = await supabase
    .from("google_product_taxonomy")
    .select("*", { count: "exact", head: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: count ?? 0 });
}

// POST — fetch from Google, parse, upsert to Supabase
export async function POST() {
  if (!supabase)
    return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  try {
    const res = await fetch(TAXONOMY_URL, { next: { revalidate: 0 } });
    if (!res.ok)
      throw new Error(`Google taxonomy fetch failed: ${res.status} ${res.statusText}`);

    const text = await res.text();
    const lines = text.split("\n");

    const records = lines
      .map(parseLine)
      .filter((r): r is TaxonomyRecord => r !== null);

    if (records.length === 0)
      return NextResponse.json({ error: "No records parsed" }, { status: 422 });

    // Upsert in chunks of 500 to avoid payload limits
    const CHUNK = 500;
    let imported = 0;

    for (let i = 0; i < records.length; i += CHUNK) {
      const chunk = records.slice(i, i + CHUNK);
      const { error } = await supabase
        .from("google_product_taxonomy")
        .upsert(chunk, { onConflict: "google_category_id" });

      if (error) throw new Error(`Upsert chunk ${i} failed: ${error.message}`);
      imported += chunk.length;
    }

    return NextResponse.json({
      success: true,
      imported,
      total: records.length,
      source: TAXONOMY_URL,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
