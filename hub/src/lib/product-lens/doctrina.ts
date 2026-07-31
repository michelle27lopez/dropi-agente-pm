// Constantes derivadas de docs/doctrina-lente.md (fuente única de verdad).
// Si esto y la doctrina divergen, gana la doctrina y este archivo se corrige.

// --- Fases (vocabulario español canónico, único en schema/UI/prompt) ---
export const PHASES = ["F0", "F1", "F2", "F3", "F4", "F5"] as const;
export type Phase = typeof PHASES[number];

export const FASE_LABEL: Record<Phase, string> = {
  F0: "Detección",
  F1: "Diagnóstico",
  F2: "Intervención",
  F3: "Validar",
  F4: "Build / Spec",
  F5: "Aprendizaje",
};

// Alias de compatibilidad: "Experimento"/"Despliegue" eran los nombres de F3/F4
// antes de este cierre del E2E del lente. Ceban el salto directo a A/B y a
// borrar el spec conductual, respectivamente — ver docs/doctrina-lente.md §4.
export const FASE_LABEL_LEGACY_ALIASES: Record<string, Phase> = { 
  Experimento: "F3", 
  Despliegue: "F4" 
};

export function normalizeFaseLabel(label: string): string {
  return FASE_LABEL_LEGACY_ALIASES[label] ? FASE_LABEL[FASE_LABEL_LEGACY_ALIASES[label]] : label;
}

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

// --- F1: sesgo específico (tras clasificar M o A) — cada uno con su antídoto ---
export const SESGOS = ["present_bias", "choice_overload", "ambiguedad", "status_quo", "loss_aversion"] as const;
export type SesgoType = typeof SESGOS[number];

export const SESGO_LABEL: Record<SesgoType, string> = {
  present_bias: "Present bias (acercar la recompensa)",
  choice_overload: "Choice overload (reducir opciones / default)",
  ambiguedad: "Ambigüedad (mostrar resultado esperado con evidencia)",
  status_quo: "Status quo (hacer del comportamiento nuevo el default)",
  loss_aversion: "Loss aversion (enmarcar en lo que se pierde)",
};

export function normalizeSesgo(v: any): SesgoType | null {
  const s = String(v ?? "").trim().toLowerCase() as SesgoType;
  return SESGOS.includes(s) ? s : null;
}

// --- F3: tipo de supuesto + escalera de validación (§8, más barato primero) ---
export const TIPOS_SUPUESTO = ["deseabilidad", "factibilidad", "viabilidad"] as const;
export type TipoSupuestoType = typeof TIPOS_SUPUESTO[number];

export const TIPO_SUPUESTO_LABEL: Record<TipoSupuestoType, string> = {
  deseabilidad: "Deseabilidad (¿lo quieren?)",
  factibilidad: "Factibilidad (¿se puede construir?)",
  viabilidad: "Viabilidad (¿le conviene al negocio?)",
};

export function normalizeTipoSupuesto(v: any): TipoSupuestoType | null {
  const s = String(v ?? "").trim().toLowerCase() as TipoSupuestoType;
  return TIPOS_SUPUESTO.includes(s) ? s : null;
}

export const TEST_ESCALERA = [
  "pre_mortem", "expert_review", "guerrilla_5u", "wizard_of_oz",
  "concierge", "n1_sced", "fake_door", "ab",
] as const;
export type TestEscaleraType = typeof TEST_ESCALERA[number];

export const TEST_ELEGIDO_LABEL: Record<TestEscaleraType, string> = {
  pre_mortem: "Pre-Mortem",
  expert_review: "Expert Review",
  guerrilla_5u: "Guerrilla (5 usuarios)",
  wizard_of_oz: "Wizard of Oz",
  concierge: "Concierge MVP",
  n1_sced: "N=1 SCED",
  fake_door: "Fake Door",
  ab: "A/B",
};

export const TEST_ELEGIDO_GLOSA: Record<TestEscaleraType, string> = {
  pre_mortem: "imaginas que ya falló y listas por qué",
  expert_review: "un experto revisa antes de gastar en usuarios",
  guerrilla_5u: "5 usuarios reales, rápido y sucio",
  wizard_of_oz: "simulas el mecanismo a mano, el usuario no lo nota",
  concierge: "entregas el valor manualmente, sin construir",
  n1_sced: "un solo usuario, medido antes/después",
  fake_door: "mides demanda con un botón que aún no existe",
  ab: "comparas dos versiones en vivo (solo con la causa ya validada)",
};

export function normalizeTestElegido(v: any): TestEscaleraType | null {
  const s = String(v ?? "").trim().toLowerCase() as TestEscaleraType;
  return TEST_ESCALERA.includes(s) ? s : null;
}

// Nivel mínimo por doctrina para afirmar causalidad de mecanismo (§4.1).
export const UMBRAL_CAUSALIDAD_DEFAULT = "wizard_of_oz";

// true si `test` está en o por encima de `umbral` en la escalera (más barato → más caro).
export function testCumpleUmbral(test: string, umbral: string = UMBRAL_CAUSALIDAD_DEFAULT): boolean {
  const tNorm = normalizeTestElegido(test);
  const uNorm = normalizeTestElegido(umbral) ?? UMBRAL_CAUSALIDAD_DEFAULT;
  if (!tNorm) return false;
  
  const ti = TEST_ESCALERA.indexOf(tNorm);
  const ui = TEST_ESCALERA.indexOf(uNorm);
  return ti >= 0 && ui >= 0 && ti >= ui;
}

// --- F3: decisión post-experimento (distinta de la decisión de cierre F5) ---
export const DECISIONS_F3 = ["avanzar_f4", "re_diagnosticar", "matar"] as const;
export type DecisionF3Type = typeof DECISIONS_F3[number];

export function normalizeDecisionF3(v: any): DecisionF3Type | null {
  const s = String(v ?? "").trim().toLowerCase() as DecisionF3Type;
  return DECISIONS_F3.includes(s) ? s : null;
}
