import { normalizeTransition, normalizeCausa, normalizeSubCausa } from "./doctrina";

export function deepMerge(target: any, source: any): any {
  if (source === null || typeof source !== "object" || Array.isArray(source)) return source;
  const out = { ...(target && typeof target === "object" && !Array.isArray(target) ? target : {}) };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      out[key] = deepMerge(out[key], sv);
    } else {
      out[key] = sv;
    }
  }
  return out;
}

export const FEATURE_TERMS = [
  "construir", "crear", "agregar", "añadir", "implementar", "desarrollar", "lanzar",
  "botón", "boton", "pantalla", "wizard", "modal", "banner", "popup", "feature",
  "funcionalidad", "onboarding", "dashboard", "notificación", "notificacion",
  "rediseñar", "rediseno", "integrar", "flujo nuevo", "nueva sección", "nueva seccion",
];

export function looksLikeFeature(title: string): boolean {
  const t = String(title || "").toLowerCase();
  return FEATURE_TERMS.some((term) => t.includes(term));
}

export const BRIEF_FIELD_KEYS = ["behavior_statement", "evidencia_primaria", "segunda_fuente", "intervencion", "hipotesis", "senal_cuantitativa"];
export const CYCLE_TOP_KEYS = ["transicion", "causa", "segmento_objetivo"];

const TOP_KEY_NORMALIZERS: Record<string, (v: any) => any> = {
  transicion: normalizeTransition,
  causa: normalizeCausa,
};

export function applyBriefUpdates(cycle: any, updates: any) {
  if (!updates || typeof updates !== "object") return { cycle, changed: [] as string[] };
  const brief = { ...(cycle.brief ?? {}) };
  const changed: string[] = [];
  
  for (const key of BRIEF_FIELD_KEYS) {
    const val = updates[key];
    if (typeof val !== "string" || !val.trim()) continue;
    if (brief[key]?.confirmed) continue;
    brief[key] = { value: val.trim(), confirmed: false, source: "llm_suggested" };
    changed.push(`brief.${key}`);
  }
  
  const patch: any = { brief };
  for (const key of CYCLE_TOP_KEYS) {
    const raw = updates[key];
    if (typeof raw !== "string" || !raw.trim()) continue;
    if (cycle[key]) continue;
    const val = TOP_KEY_NORMALIZERS[key] ? TOP_KEY_NORMALIZERS[key](raw) : raw.trim();
    if (!val) continue;
    patch[key] = val;
    if (key === "causa") patch.causa_source = "llm_suggested";
    changed.push(key);
  }
  
  if (typeof updates.sub_causa === "string" && updates.sub_causa.trim() && !cycle.sub_causa) {
    const sc = normalizeSubCausa(updates.sub_causa, patch.causa ?? cycle.causa);
    if (sc) {
      patch.sub_causa = sc;
      changed.push("sub_causa");
    }
  }
  
  return { cycle: { ...cycle, ...patch }, changed };
}

export function resolveRisk(cycle: any, riskId: string, actor: any = {}, now = new Date().toISOString()) {
  const risks: any[] = cycle.risks ?? [];
  const found = risks.some((r) => r.id === riskId);
  if (!found) return { cycle, found: false };
  const updatedRisks = risks.map((r) => r.id === riskId
    ? { ...r, resolvedAt: now, resolvedBy: actor }
    : r);
  const riskAccepted = updatedRisks.some((r) => !r.resolvedAt);
  return { cycle: { ...cycle, risks: updatedRisks, riskAccepted }, found: true };
}
