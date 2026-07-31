import { supabase } from "@/lib/supabase";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".local-data");

const FILES: Record<string, string> = {
  cycles: "cycles.json",
  patterns: "patterns.json",
  audit_events: "audit_events.json",
  decisions: "decisions.json",
};

// Map generic collection names to safe database prefixed table names
const TABLE_MAP: Record<string, string> = {
  cycles: "discovery_cycles",
  patterns: "discovery_patterns",
  decisions: "discovery_decisions",
};

// Check if we can write to local JSON files as fallback
async function ensureLocalDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function jsonLoad(name: string): Promise<any[]> {
  await ensureLocalDir();
  try {
    const file = path.join(DATA_DIR, FILES[name]);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.warn(`[Product Lens] No se pudo cargar JSON local de ${name}:`, err.message);
    }
    return [];
  }
}

async function jsonSave(name: string, arr: any[]): Promise<void> {
  await ensureLocalDir();
  const file = path.join(DATA_DIR, FILES[name]);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(arr, null, 2));
  await fs.rename(tmp, file);
}

// Check if Supabase client is initialized and working
function hasSupabase(): boolean {
  return !!supabase;
}

export async function load(name: string): Promise<any[]> {
  if (hasSupabase() && name !== "audit_events") {
    try {
      const tableName = TABLE_MAP[name] || name;
      const { data, error } = await supabase!
        .from(tableName)
        .select("data");

      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        return data.map((row: any) => row.data);
      }
    } catch (err: any) {
      console.warn(`[Product Lens] Fallback a JSON para cargar ${name}:`, err.message);
    }
  }

  // Fallback to local JSON files
  return jsonLoad(name);
}

export async function save(name: string, arr: any[]): Promise<void> {
  if (hasSupabase() && name !== "audit_events") {
    try {
      const tableName = TABLE_MAP[name] || name;

      // For each item in the array, insert/update
      // We will perform an upsert for all items and delete any item that is no longer in the array
      for (const item of arr) {
        let payload: any = {
          id: item.id,
          data: item,
        };

        if (name === "cycles") {
          payload.project_id = item.project_id || item.projectId || null;
          payload.title = item.title;
          payload.estado = item.estado || "activo";
          payload.fase_actual = item.fase_actual || item.activePhase || "F0";
          payload.causa = item.causa || null;
          payload.sub_perfil = item.sub_perfil || null;
          payload.updated_at = item.updatedAt || new Date().toISOString();
        } else if (name === "patterns") {
          payload.tipo = item.tipo || null;
          payload.causa = item.causa || null;
          payload.sub_perfil = item.sub_perfil || null;
          payload.transicion = item.transicion || null;
        } else if (name === "decisions") {
          payload.cycle_id = item.cycleId || null;
          payload.fecha = item.fecha || new Date().toISOString();
          payload.tipo = item.tipo;
          payload.causa = item.causa || null;
          payload.sub_perfil = item.sub_perfil || null;
          payload.texto = item.texto;
          payload.actor = item.actor || null;
        }

        const { error } = await supabase!
          .from(tableName)
          .upsert(payload, { onConflict: "id" });

        if (error) throw error;
      }

      // Delete items that are not in the new array (sync list behavior)
      const ids = arr.map((x) => x.id);
      if (ids.length > 0) {
        const { error } = await supabase!
          .from(tableName)
          .delete()
          .not("id", "in", `(${ids.map(id => `"${id}"`).join(",")})`);
        if (error) throw error;
      } else {
        const { error } = await supabase!
          .from(tableName)
          .delete()
          .neq("id", "");
        if (error) throw error;
      }

      // Save to JSON as backup
      await jsonSave(name, arr);
      return;
    } catch (err: any) {
      console.warn(`[Product Lens] Fallback a JSON para guardar ${name}:`, err.message);
    }
  }

  // Save to local JSON files
  return jsonSave(name, arr);
}

export function backendInfo() {
  return {
    hasSupabase: hasSupabase(),
  };
}
