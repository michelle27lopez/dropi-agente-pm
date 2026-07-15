// Phase gate engine (TypeScript version).
import { Phase } from "./doctrina";

export const PHASES: Phase[] = ["F0", "F1", "F2", "F3", "F4", "F5"];

interface Requirement {
  key: string;
  message: string;
  isMet: (cycle: any) => boolean;
}

const GATE_REQUIREMENTS: Record<Phase, Requirement[]> = {
  F0: [
    { key: "behaviorStatement", message: "Falta el comportamiento objetivo.", isMet: hasBehaviorStatement },
    { key: "quantitativeSignal", message: "Falta la señal cuantitativa.", isMet: hasQuantitativeSignal },
    { key: "segment", message: "Falta el segmento (cohorte conductual, ej. 'inactivos 30d').", isMet: hasSegment },
  ],
  F1: [
    { key: "sources", message: "Faltan al menos 2 fuentes de evidencia.", isMet: hasAtLeastTwoSources },
    { key: "bmapCause", message: "Falta confirmar la causa B=MAP (Motivación, Ability o Prompt) — la sugerida por la IA no basta.", isMet: hasBmapCause },
  ],
  F2: [
    { key: "intervention", message: "Falta la intervención.", isMet: hasIntervention },
    { key: "falsifiableHypothesis", message: "Falta la hipótesis falsable.", isMet: hasFalsifiableHypothesis },
  ],
  F3: [
    { key: "metric", message: "Falta la métrica de éxito.", isMet: hasMetric },
    { key: "outcomeMetric", message: "Marca la métrica primaria como outcome (no actividad) — el éxito no es adopción.", isMet: hasOutcomeMetric },
    { key: "sizeAndDuration", message: "Falta tamaño de muestra / duración.", isMet: hasSizeAndDuration },
    { key: "stopCriteria", message: "Falta el criterio de stop.", isMet: hasStopCriteria },
  ],
  F4: [{ key: "trackingConfirmed", message: "Falta confirmar el tracking.", isMet: hasTrackingConfirmed }],
  F5: [
    { key: "decision", message: "Falta la decisión de cierre.", isMet: hasDecision },
    { key: "namedPattern", message: "Falta nombrar el patrón.", isMet: hasNamedPattern },
  ],
};

export function getCurrentPhase(cycle: any): Phase {
  const phase = cycle.fase_actual ?? cycle.currentPhase ?? cycle.activePhase ?? cycle.phase;
  return isPhase(phase) ? phase : "F0";
}

export function canClosePhase(cycle: any, phase: Phase): boolean {
  return getMissingGateRequirements(cycle, phase).length === 0;
}

export function getMissingGateRequirements(cycle: any, phase: Phase) {
  assertPhase(phase);
  return GATE_REQUIREMENTS[phase]
    .filter((req) => !req.isMet(cycle))
    .map((req) => ({ key: req.key, message: req.message }));
}

export function getGateRequirements(cycle: any, phase: Phase) {
  assertPhase(phase);
  return GATE_REQUIREMENTS[phase].map((req) => ({ key: req.key, message: req.message, met: req.isMet(cycle) }));
}

export function acceptRisk(cycle: any, phase: Phase, riskText: string, actor: any = {}) {
  assertPhase(phase);
  if (!String(riskText ?? "").trim()) throw new Error("Risk text is required.");
  const risk = {
    id: `${phase}-risk-${(cycle.risks ?? []).length + 1}`,
    phase,
    text: String(riskText).trim(),
    acceptedBy: actor,
    acceptedAt: new Date().toISOString(),
  };
  return { ...cycle, risks: [...(cycle.risks ?? []), risk] };
}

const briefField = (cycle: any, name: string) => cycle.brief?.[name];
const briefHasValue = (cycle: any, name: string) => hasText(briefField(cycle, name)?.value);

function hasBehaviorStatement(cycle: any): boolean {
  return hasText(cycle.behaviorStatement) || hasText(cycle.behavior?.statement) || briefHasValue(cycle, "behavior_statement");
}

function hasQuantitativeSignal(cycle: any): boolean {
  return hasText(cycle.quantitativeSignal) || hasText(cycle.quantSignal) || briefHasValue(cycle, "senal_cuantitativa");
}

function hasSegment(cycle: any): boolean {
  return hasText(cycle.segment) || hasText(cycle.segmento_objetivo);
}

function hasAtLeastTwoSources(cycle: any): boolean {
  const generic = cycle.sources ?? cycle.evidence?.sources;
  if (Array.isArray(generic) && generic.filter(Boolean).length >= 2) return true;
  const confirmed = (name: string) => {
    const f = cycle.brief?.[name];
    return !!(f && hasText(f.value) && f.confirmed);
  };
  return confirmed("evidencia_primaria") && confirmed("segunda_fuente");
}

function hasBmapCause(cycle: any): boolean {
  const generic = cycle.cause ?? cycle.diagnosis?.cause ?? cycle.bmapCause;
  if (["Motivation", "Ability", "Prompt"].includes(String(generic ?? ""))) return true;
  const isBmap = ["M", "A", "P"].includes(String(cycle.causa ?? ""));
  const confirmed = cycle.causa_source === "pm_confirmed" || cycle.brief?.causa?.confirmed === true;
  return isBmap && confirmed;
}

function hasIntervention(cycle: any): boolean {
  return hasText(cycle.intervention) || briefHasValue(cycle, "intervencion");
}

function hasFalsifiableHypothesis(cycle: any): boolean {
  return hasText(cycle.falsifiableHypothesis) || briefHasValue(cycle, "hipotesis");
}

function hasMetric(cycle: any): boolean {
  return hasText(cycle.metric) || briefHasValue(cycle, "senal_cuantitativa") || hasText(cycle.experiment?.metrica_primaria?.value);
}

function hasSizeAndDuration(cycle: any): boolean {
  if (hasText(cycle.sizeAndDuration) || (hasText(cycle.size) && hasText(cycle.duration))) return true;
  return hasText(cycle.experiment?.tamano_muestra?.value) && hasText(cycle.experiment?.duracion?.value);
}

function hasOutcomeMetric(cycle: any): boolean {
  return cycle.experiment?.metrica_tipo === "outcome" || cycle.metricType === "outcome";
}

function hasStopCriteria(cycle: any): boolean {
  return hasText(cycle.stopCriteria) || hasText(cycle.experiment?.criterio_stop?.value);
}

function hasTrackingConfirmed(cycle: any): boolean {
  if (cycle.trackingConfirmed === true) return true;
  const t = cycle.experiment?.tracking_eventos;
  return Array.isArray(t) ? t.length > 0 : hasText(t?.value);
}

function hasDecision(cycle: any): boolean {
  return hasText(cycle.decision) || hasText(cycle.resultado_cierre) || hasText(cycle.cierre?.decision);
}

function hasNamedPattern(cycle: any): boolean {
  return hasText(cycle.namedPattern) || hasText(cycle.patternName) || hasText(cycle.cierre?.pattern_id);
}

function hasText(value: any): boolean {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function isPhase(value: any): value is Phase {
  return typeof value === "string" && PHASES.includes(value as Phase);
}

function assertPhase(value: any): asserts value is Phase {
  if (!isPhase(value)) throw new Error(`Unknown phase: ${String(value)}.`);
}
