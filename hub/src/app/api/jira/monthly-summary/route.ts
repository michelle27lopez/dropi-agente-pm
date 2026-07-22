import { NextRequest, NextResponse } from "next/server";
import { jiraConfigured, searchAllIssues, type JiraIssue } from "@/lib/jira";
import { celulasDeAssignee } from "@/app/proyectos/monthly-update/data/pm-celula-map";

// Resumen mensual agregado por célula, usando el mapeo PM→célula como sustituto
// del campo "Celula" de Jira (vacío en todos los tickets — ver pm-celula-map.ts).
//
// LO QUE SÍ CALCULA: cuántos issues tocó cada célula en el mes, y cuántos cerraron
// (status category "Done"), agrupados por PM inequívoco.
//
// LO QUE NO CALCULA (requiere revisión manual, igual que en el reporte de junio):
// - Etapa Discovery/Definición/Cierre/Handoff — Jira no tiene esos estados, solo
//   To Do / In Progress / Done.
// - Deduplicación de clones y series (Pt.1/Pt.2, Fase 2/3, sufijos -2/-3, etc.).
// - Cycle time / sprints por proyecto — necesita fecha real de handoff, que no
//   está en un campo estructurado.
// - Experimentos.

const FIELDS = ["summary", "status", "issuetype", "assignee", "created", "updated", "resolutiondate"];

type CelulaAgg = {
  celula: string;
  total: number;
  cerrados: number;
  enCurso: number;
  backlog: number;
};

function monthRange(month: string): { start: string; end: string } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

export async function GET(req: NextRequest) {
  if (!jiraConfigured) {
    return NextResponse.json(
      { error: "Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const { start, end } = monthRange(month);
  const jql = `project = PROD AND updated >= "${start}" AND updated < "${end}" ORDER BY updated DESC`;

  let issues: JiraIssue[];
  try {
    issues = await searchAllIssues(jql, FIELDS, 100);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }

  type PmAgg = { assignee: string; posibles: string[]; total: number; cerrados: number; enCurso: number; backlog: number };

  const porCelula = new Map<string, CelulaAgg>();
  const porPmAmbiguo = new Map<string, PmAgg>();
  const sinClasificar = new Map<string, { assignee: string; total: number; cerrados: number }>();

  const bumpCelula = (celula: string, statusCategory: string) => {
    const agg = porCelula.get(celula) ?? { celula, total: 0, cerrados: 0, enCurso: 0, backlog: 0 };
    agg.total += 1;
    if (statusCategory === "Done") agg.cerrados += 1;
    else if (statusCategory === "In Progress") agg.enCurso += 1;
    else agg.backlog += 1;
    porCelula.set(celula, agg);
  };

  const bumpPm = (assignee: string, posibles: string[], statusCategory: string) => {
    const agg = porPmAmbiguo.get(assignee) ?? { assignee, posibles, total: 0, cerrados: 0, enCurso: 0, backlog: 0 };
    agg.total += 1;
    if (statusCategory === "Done") agg.cerrados += 1;
    else if (statusCategory === "In Progress") agg.enCurso += 1;
    else agg.backlog += 1;
    porPmAmbiguo.set(assignee, agg);
  };

  for (const issue of issues) {
    const f = issue.fields as Record<string, any>;
    const assigneeName: string | null = f.assignee?.displayName ?? null;
    const statusCategory: string = f.status?.statusCategory?.name ?? "To Do";
    const celulas = celulasDeAssignee(assigneeName);

    if (celulas.length === 0) {
      const key = assigneeName ?? "Sin asignar";
      const agg = sinClasificar.get(key) ?? { assignee: key, total: 0, cerrados: 0 };
      agg.total += 1;
      if (statusCategory === "Done") agg.cerrados += 1;
      sinClasificar.set(key, agg);
    } else if (celulas.length === 1) {
      bumpCelula(celulas[0], statusCategory);
    } else {
      bumpPm(assigneeName!, celulas, statusCategory);
    }
  }

  return NextResponse.json({
    month,
    totalIssues: issues.length,
    porCelula: Array.from(porCelula.values()).sort((a, b) => b.total - a.total),
    porPmAmbiguo: Array.from(porPmAmbiguo.values()).sort((a, b) => b.total - a.total),
    sinClasificarPorAssignee: Array.from(sinClasificar.values()).sort((a, b) => b.total - a.total),
    nota: "Vista de apoyo — no reemplaza el reporte curado. Cuenta issues de Jira (Stories + Tasks + Sub-tasks), no 'proyectos' deduplicados. Un proyecto real puede ser varios issues (fases, clones, sub-tasks). No incluye etapa (Discovery/Definición/Cierre/Handoff) ni cycle time, porque Jira no los tiene como campos.",
  });
}
