// Constantes derivadas de docs/doctrina-lente.md (fuente única de verdad).
// Si esto y la doctrina divergen, gana la doctrina y este archivo se corrige.

// --- Fases (vocabulario español canónico, único en schema/UI/prompt) ---
export const PHASES = ["F0", "F1", "F2", "F3", "F4", "F5"] as const;
export type Phase = typeof PHASES[number];

export const FASE_LABEL: Record<Phase, string> = {
  F0: "Detección",
  F1: "Diagnóstico",
  F2: "Intervención",
  F3: "Experimento",
  F4: "Despliegue",
  F5: "Aprendizaje",
};

// --- B=MAP (causa primaria) ---
export const CAUSA = ["M", "A", "P"] as const;
export type CausaType = typeof CAUSA[number];

export const CAUSA_LABEL: Record<CausaType, string> = { M: "Motivación", A: "Ability", P: "Prompt" };
export const CAUSA_COLOR: Record<CausaType, string> = { M: "#8B5CF6", A: "#3B82F6", P: "#14B8A6" };

// Sub-causa secundaria (opcional, lista cerrada 3×3; NO maneja el filtro).
export const SUB_CAUSA: Record<CausaType, string[]> = {
  M: ["motivacion", "confianza", "incentivo"],
  A: ["claridad", "capacidad", "friccion"],
  P: ["timing", "visibilidad", "ausencia"],
};

export const SUB_CAUSA_LABEL: Record<string, string> = {
  motivacion: "Motivación (no ve el valor)",
  confianza: "Confianza (no se fía)",
  incentivo: "Incentivo (no compensa)",
  claridad: "Claridad (no entiende qué/cómo)",
  capacidad: "Capacidad (no tiene skill/recurso)",
  friccion: "Fricción (el flujo cuesta)",
  timing: "Timing (momento equivocado)",
  visibilidad: "Visibilidad (no lo nota)",
  ausencia: "Ausencia (no hay trigger)",
};

// Normaliza una sub-causa validando que pertenezca al bucket de la causa dada.
export function normalizeSubCausa(value: any, causa: any): string | null {
  const c = normalizeCausa(causa);
  if (!c) return null;
  const v = String(value ?? "").trim().toLowerCase();
  return (SUB_CAUSA[c] ?? []).includes(v) ? v : null;
}

// --- Escala cognitiva (5 niveles) + transiciones válidas (pares adyacentes) ---
export const COGNITIVE_LEVELS = ["setup", "aha", "habit", "engaged", "principalidad"] as const;
export type CognitiveLevel = typeof COGNITIVE_LEVELS[number];

export const COGNITIVE_LABEL: Record<CognitiveLevel, string> = {
  setup: "Setup",
  aha: "Aha",
  habit: "Habit",
  engaged: "Engaged",
  principalidad: "Principalidad",
};
export const TRANSITIONS = ["setup_aha", "aha_habit", "habit_engaged", "engaged_principalidad"] as const;

// --- Sub-perfiles: Niveles de dropshipper (nombres oficiales de Comercial, §3.1) ---
export const SUB_PERFILES = ["bienvenido", "explorador", "master", "experto", "sabio_vip", "leyenda", "sin_clasificar"] as const;
export type SubPerfil = typeof SUB_PERFILES[number];

export const SUB_PERFIL_LABEL: Record<SubPerfil, string> = {
  bienvenido: "Bienvenido",
  explorador: "Explorador",
  master: "Master",
  experto: "Experto",
  sabio_vip: "Sabio VIP",
  leyenda: "Leyenda",
  sin_clasificar: "Sin clasificar",
};
export const SUB_PERFIL_ORDERS: Record<SubPerfil, string> = {
  bienvenido: "0 – 100",
  explorador: "101 – 1.000",
  master: "1.001 – 2.500",
  experto: "2.501 – 5.000",
  sabio_vip: "5.001 – 20.000",
  leyenda: "20.001+",
  sin_clasificar: "N/A",
};
export const SUB_PERFIL_DESC: Record<SubPerfil, string> = {
  bienvenido: "Nuevo en la plataforma, en proceso de activación.",
  explorador: "Primeras ventas sostenidas, aprendiendo operación.",
  master: "Operador establecido, flujo de ventas estable.",
  experto: "Alto volumen, empieza a optimizar procesos.",
  sabio_vip: "Vendedor consolidado, referente del ecosistema.",
  leyenda: "Élite del ecosistema Dropi.",
  sin_clasificar: "Sin clasificar o no analizado.",
};

// --- Decisión de cierre (F5) → tipo de patrón derivado ---
export const DECISIONS = ["escalar", "matar", "iterar"] as const;
export type DecisionType = typeof DECISIONS[number];

export function patternTypeFromDecision(decision: DecisionType | string): string | null {
  if (decision === "matar") return "anti_patron";
  if (decision === "escalar") return "patron";
  return null;
}

// Helpers de normalización (devuelven la key canónica o null).
const slug = (v: any) => String(v ?? "")
  .trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[\s→>-]+/g, "_");

const TRANSITION_ALIASES: Record<string, string> = {
  setup_aha: "setup_aha",
  aha_habit: "aha_habit",
  aha_habito: "aha_habit",
  habit_engaged: "habit_engaged",
  habito_engaged: "habit_engaged",
  engaged_principalidad: "engaged_principalidad",
};

export function normalizeSubPerfil(v: any): SubPerfil | null {
  const s = slug(v) as SubPerfil;
  return SUB_PERFILES.includes(s) ? s : null;
}
export function normalizeTransition(v: any): string | null {
  return TRANSITION_ALIASES[slug(v)] ?? null;
}
export function normalizeCausa(v: any): CausaType | null {
  const s = String(v ?? "").trim().toUpperCase() as CausaType;
  return CAUSA.includes(s) ? s : null;
}

// Labels de display: "setup_aha" → "Setup → Aha".
export function transitionLabel(t: string): string {
  const key = TRANSITION_ALIASES[slug(t)];
  if (!key) return t ?? "";
  const cut = key.indexOf("_");
  const from = key.slice(0, cut) as CognitiveLevel;
  const to = key.slice(cut + 1) as CognitiveLevel;
  return `${COGNITIVE_LABEL[from] ?? from} → ${COGNITIVE_LABEL[to] ?? to}`;
}
export function subPerfilLabel(sp: string): string {
  const norm = normalizeSubPerfil(sp);
  return norm ? SUB_PERFIL_LABEL[norm] : (sp ?? "");
}
