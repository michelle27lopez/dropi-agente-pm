import type { JiraIssue } from "@/lib/jira";
import { celulasDeAssignee } from "@/app/proyectos/monthly-update/data/pm-celula-map";

// Convierte issues crudos de Jira en candidatos a "proyecto" agrupados por célula.
// No reemplaza la curaduría manual — reduce el punto de partida (cientos de tickets
// crudos) a una lista de grupos que Laura revisa y confirma. Ver hallazgos del
// 2026-07-17: ~28% de los tickets top-level son operativos/recurrentes (reuniones,
// dailies, planning), y solo ~10% traen tag de etapa en el título.

const ROUTINE_KEYWORDS = [
  "reuni", "daily", "weekly", "planning", "planeaci", "ceremonia",
  "seguimiento de proyectos", "seguimiento proyectos", "product lab", "cell board",
  "cronograma", "prioridades", "retro", "cierre de sprint", "revisemos", "wekly",
];

const STAGE_TAG_RE = /\[(DISCOVERY|DEFINICI[OÓ]N|DELIVERY|CIERRE|EXPERIMENTACI[OÓ]N|QA|DICOVERY|HANDOFF)\]/i;

export function isRoutineTicket(summary: string): boolean {
  const s = summary.toLowerCase();
  return ROUTINE_KEYWORDS.some((kw) => s.includes(kw));
}

export function extractStageTag(summary: string): string | null {
  const m = summary.match(STAGE_TAG_RE);
  if (!m) return null;
  const tag = m[1].toUpperCase();
  if (tag === "DICOVERY") return "DISCOVERY";
  if (tag === "DEFINICION") return "DEFINICIÓN";
  return tag;
}

// Quita tags de etapa, sufijos de serie (Pt.N, Fase N, V N, -N, CLONE) para agrupar
// tickets que son fases distintas del mismo proyecto bajo un solo candidato.
export function normalizeTitle(summary: string): string {
  let s = summary.toLowerCase();
  s = s.replace(/\[[^\]]*\]/g, "");
  s = s.replace(/\b(fase|pt\.?|part|parte)\s*\d+\b/g, "");
  s = s.replace(/\bv\d+(\.\d+)?\b/g, "");
  s = s.replace(/\bclone\b/g, "");
  s = s.replace(/[-–]\s*\d+\b/g, "");
  s = s.replace(/\(\d+\)/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export type ProjectCandidate = {
  normalizedTitle: string;
  representativeTitle: string;
  keys: string[];
  count: number;
  stageTag: string | null;
  statusCounts: { done: number; enCurso: number; toDo: number };
};

export type GroupingResult = {
  porCelula: Record<string, ProjectCandidate[]>;
  ambiguos: { assignee: string; posibles: string[]; count: number }[];
  sinClasificar: { assignee: string; count: number }[];
  totalTopLevel: number;
  totalRutina: number;
};

// Solo agrupa issues que no son Sub-task — un Sub-task es desglose de ejecución de
// otro issue, no un candidato a proyecto por sí mismo.
export function groupIntoProjectCandidates(issues: JiraIssue[]): GroupingResult {
  const topLevel = issues.filter((iss) => (iss.fields as any).issuetype?.name !== "Sub-task");
  const ambiguosMap = new Map<string, { assignee: string; posibles: string[]; count: number }>();
  const sinClasificarMap = new Map<string, number>();
  let totalRutina = 0;

  // celula -> normalizedTitle -> candidato en construcción
  const buckets = new Map<string, Map<string, ProjectCandidate>>();

  for (const issue of topLevel) {
    const f = issue.fields as Record<string, any>;
    const summary: string = f.summary ?? "";

    if (isRoutineTicket(summary)) {
      totalRutina += 1;
      continue;
    }

    const assigneeName: string | null = f.assignee?.displayName ?? null;
    const celulas = celulasDeAssignee(assigneeName);

    if (celulas.length === 0) {
      const key = assigneeName ?? "Sin asignar";
      sinClasificarMap.set(key, (sinClasificarMap.get(key) ?? 0) + 1);
      continue;
    }
    if (celulas.length > 1) {
      const key = assigneeName!;
      const agg = ambiguosMap.get(key) ?? { assignee: key, posibles: celulas, count: 0 };
      agg.count += 1;
      ambiguosMap.set(key, agg);
      continue;
    }

    const celula = celulas[0];
    if (!buckets.has(celula)) buckets.set(celula, new Map());
    const celulaBucket = buckets.get(celula)!;

    const norm = normalizeTitle(summary);
    const statusCategory: string = f.status?.statusCategory?.name ?? "To Do";
    const stageTag = extractStageTag(summary);

    const candidate = celulaBucket.get(norm) ?? {
      normalizedTitle: norm,
      representativeTitle: summary,
      keys: [],
      count: 0,
      stageTag: null,
      statusCounts: { done: 0, enCurso: 0, toDo: 0 },
    };
    candidate.keys.push(issue.key);
    candidate.count += 1;
    if (!candidate.stageTag && stageTag) candidate.stageTag = stageTag;
    if (statusCategory === "Done") candidate.statusCounts.done += 1;
    else if (statusCategory === "In Progress") candidate.statusCounts.enCurso += 1;
    else candidate.statusCounts.toDo += 1;

    celulaBucket.set(norm, candidate);
  }

  const porCelula: Record<string, ProjectCandidate[]> = {};
  for (const [celula, bucket] of buckets) {
    porCelula[celula] = Array.from(bucket.values()).sort((a, b) => b.count - a.count);
  }

  return {
    porCelula,
    ambiguos: Array.from(ambiguosMap.values()).sort((a, b) => b.count - a.count),
    sinClasificar: Array.from(sinClasificarMap.entries()).map(([assignee, count]) => ({ assignee, count })).sort((a, b) => b.count - a.count),
    totalTopLevel: topLevel.length,
    totalRutina,
  };
}
