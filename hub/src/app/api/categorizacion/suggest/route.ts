import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// ─── Synonym dictionary: Spanish keyword → English keywords ───────────────────
const SYNONYMS: Record<string, string[]> = {
  mascotas:    ["animal", "pet", "pets"],
  perros:      ["dog", "dogs", "canine"],
  gatos:       ["cat", "cats", "feline"],
  hogar:       ["home", "household", "house"],
  cocina:      ["kitchen", "cookware", "cooking"],
  muebles:     ["furniture"],
  jardin:      ["garden", "gardening", "outdoor", "yard"],
  limpieza:    ["cleaning", "laundry", "housekeeping"],
  decoracion:  ["decor", "decoration", "decorative"],
  tecnologia:  ["electronics", "technology", "tech"],
  electronica: ["electronics", "electronic"],
  celulares:   ["phone", "phones", "mobile", "cell"],
  computacion: ["computers", "computing", "laptop", "pc"],
  audio:       ["audio", "sound", "speaker"],
  videojuegos: ["games", "gaming", "video game", "console"],
  belleza:     ["beauty", "cosmetics"],
  maquillaje:  ["makeup", "cosmetics", "beauty"],
  cuidado:     ["care"],
  capilar:     ["hair"],
  corporal:    ["body", "skin"],
  perfumeria:  ["fragrance", "perfume", "perfumery"],
  salud:       ["health", "healthcare", "medical"],
  bienestar:   ["wellness", "health", "wellbeing"],
  suplementos: ["supplement", "supplements", "vitamin", "dietary"],
  nutricion:   ["nutrition", "nutritional", "dietary"],
  deportes:    ["sporting", "sports", "athletic", "sport"],
  fitness:     ["fitness", "exercise", "gym", "workout"],
  camping:     ["camping", "outdoor", "hiking"],
  juguetes:    ["toys", "toy"],
  bebes:       ["baby", "babies", "infant", "toddler"],
  ninos:       ["kids", "children", "child"],
  infantil:    ["kids", "children", "infant"],
  moda:        ["apparel", "clothing", "fashion"],
  ropa:        ["apparel", "clothing", "wear"],
  calzado:     ["footwear", "shoes", "shoe"],
  bolsos:      ["bags", "handbags", "purse"],
  bisuteria:   ["jewelry", "jewellery"],
  joyeria:     ["jewelry", "jewellery"],
  relojes:     ["watches", "watch", "clocks"],
  ferreteria:  ["hardware", "building materials"],
  herramientas:["tools", "tool"],
  automotriz:  ["automotive", "vehicle", "car", "auto"],
  vehiculos:   ["vehicles", "automotive", "car", "auto"],
  adultos:     ["adult", "adults", "mature"],
  papeleria:   ["office", "stationery", "paper"],
  accesorios:  ["accessories", "accessory"],
  iluminacion: ["lighting", "lights", "lamps"],
  bano:        ["bath", "bathroom"],
  fajas:       ["shapewear", "body shaper"],
  optica:      ["eyewear", "glasses", "optical"],
  suplemento:  ["supplement", "vitamin", "dietary"],
  encapsulados:["supplement", "capsule", "pill"],
  lactancia:   ["nursing", "breastfeeding", "baby feeding"],
  ciclismo:    ["cycling", "bicycle", "bike"],
  pesca:       ["fishing"],
  motos:       ["motorcycle", "motor", "moto"],
  construccion:["construction", "building"],
  ferretero:   ["hardware"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[()\/\\,]/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordsOf(str: string): Set<string> {
  const STOP = new Set(["y", "de", "del", "la", "el", "los", "las", "en", "con", "para", "por", "and", "the", "of", "for", "in", "with"]);
  return new Set(
    normalize(str)
      .split(" ")
      .filter(w => w.length > 2 && !STOP.has(w))
  );
}

function expandWithSynonyms(words: Set<string>): Set<string> {
  const expanded = new Set<string>(words);
  for (const w of words) {
    const syns = SYNONYMS[w];
    if (syns) {
      for (const s of syns) {
        for (const sw of s.split(" ")) {
          if (sw.length > 2) expanded.add(sw);
        }
      }
    }
  }
  return expanded;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

interface DropiCategory {
  dropi_category_id: string;
  dropi_category_path: string;
  level_1: string;
  level_4: string;
}

interface GoogleCategory {
  google_category_id: string;
  google_category_path: string;
}

function scoreMatch(dropi: DropiCategory, google: GoogleCategory): number {
  const dropiLevels = dropi.dropi_category_path.split(" > ");
  const googleLevels = google.google_category_path.split(" > ");

  // Expand dropi words with synonyms
  const dropiLeafExpanded  = expandWithSynonyms(wordsOf(dropiLevels.at(-1) ?? ""));
  const dropiPathExpanded  = expandWithSynonyms(wordsOf(dropi.dropi_category_path));
  const dropiL1Expanded    = expandWithSynonyms(wordsOf(dropiLevels[0] ?? ""));

  const googleLeafWords    = wordsOf(googleLevels.at(-1) ?? "");
  const googlePathWords    = wordsOf(google.google_category_path);
  const googleL1Words      = wordsOf(googleLevels[0] ?? "");

  const leafScore  = jaccard(dropiLeafExpanded, googleLeafWords);   // 40%
  const pathScore  = jaccard(dropiPathExpanded, googlePathWords);    // 25%
  const l1Score    = jaccard(dropiL1Expanded, googleL1Words);        // 25%
  const dropiDepth = dropiLevels.length;
  const googleDepth = googleLevels.length;
  const depthScore = 1 - Math.abs(dropiDepth - googleDepth) / Math.max(dropiDepth, googleDepth, 1); // 10%

  const raw = leafScore * 0.40 + pathScore * 0.25 + l1Score * 0.25 + depthScore * 0.10;
  return Math.round(raw * 10000) / 100; // 0-100 with 2 decimals
}

function confidenceLabel(score: number): string {
  if (score >= 90) return "high";
  if (score >= 70) return "medium";
  if (score >= 50) return "low";
  return "needs_review";
}

// Paginate all records from a Supabase table
async function fetchAll<T>(table: string, select: string): Promise<T[]> {
  if (!supabase) return [];
  const PAGE = 1000;
  const all: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`fetchAll ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...(data as T[]));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

// POST — generate top-5 suggestions for all (or specified) Dropi categories
export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase)
    return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  try {
    const [dropiCats, googleCats] = await Promise.all([
      fetchAll<DropiCategory>("dropi_categories", "dropi_category_id,dropi_category_path,level_1,level_4"),
      fetchAll<GoogleCategory>("google_product_taxonomy", "google_category_id,google_category_path"),
    ]);

    if (dropiCats.length === 0)
      return NextResponse.json({ error: "No Dropi categories. Run /seed-dropi first." }, { status: 422 });
    if (googleCats.length === 0)
      return NextResponse.json({ error: "No Google categories. Run /import-google first." }, { status: 422 });

    // For each Dropi category, score against all Google categories and take top 5
    const mappingRows: {
      dropi_category_id: string;
      dropi_category_path: string;
      google_category_id: string;
      google_category_path: string;
      suggestion_rank: number;
      match_type: string;
      confidence_score: number;
      confidence_label: string;
      status: string;
    }[] = [];

    for (const dropi of dropiCats) {
      const scored = googleCats
        .map(g => ({ g, score: scoreMatch(dropi, g) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      scored.forEach(({ g, score }, idx) => {
        mappingRows.push({
          dropi_category_id:   dropi.dropi_category_id,
          dropi_category_path: dropi.dropi_category_path,
          google_category_id:  g.google_category_id,
          google_category_path: g.google_category_path,
          suggestion_rank:     idx + 1,
          match_type:          "auto_semantic",
          confidence_score:    score,
          confidence_label:    confidenceLabel(score),
          status:              "pending_review",
        });
      });
    }

    // Upsert in chunks
    const CHUNK = 200;
    let saved = 0;
    for (let i = 0; i < mappingRows.length; i += CHUNK) {
      const chunk = mappingRows.slice(i, i + CHUNK);
      const { error } = await supabase
        .from("dropi_google_category_mapping")
        .upsert(chunk, { onConflict: "dropi_category_id,google_category_id,suggestion_rank" });
      if (error) throw new Error(`Upsert mappings chunk ${i}: ${error.message}`);
      saved += chunk.length;
    }

    const highCount  = mappingRows.filter(r => r.suggestion_rank === 1 && r.confidence_label === "high").length;
    const medCount   = mappingRows.filter(r => r.suggestion_rank === 1 && r.confidence_label === "medium").length;
    const lowCount   = mappingRows.filter(r => r.suggestion_rank === 1 && r.confidence_label === "low").length;
    const reviewCount = mappingRows.filter(r => r.suggestion_rank === 1 && r.confidence_label === "needs_review").length;

    return NextResponse.json({
      success: true,
      dropi_categories: dropiCats.length,
      google_categories: googleCats.length,
      mapping_rows_saved: saved,
      rank1_summary: { high: highCount, medium: medCount, low: lowCount, needs_review: reviewCount },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
