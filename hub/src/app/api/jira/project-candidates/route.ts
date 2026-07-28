import { NextRequest, NextResponse } from "next/server";
import { jiraConfigured, searchAllIssues } from "@/lib/jira";
import { groupIntoProjectCandidates } from "@/lib/jira-project-grouping";
import { requireUser } from "@/lib/require-auth";

// Candidatos a "proyecto" para el cierre mensual: filtra tickets operativos/recurrentes
// (reuniones, dailies, planning), agrupa series (Pt.1/Pt.2, Fase 2/3, clones) por título
// normalizado, y clasifica por célula vía el roster PM→célula. Es apoyo para curar el
// reporte a mano, no un reemplazo — ver nota en la respuesta.

const FIELDS = ["summary", "status", "issuetype", "assignee"];

function monthRange(month: string): { start: string; end: string } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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

  try {
    const issues = await searchAllIssues(jql, FIELDS, 100);
    const result = groupIntoProjectCandidates(issues);
    return NextResponse.json({
      month,
      totalIssuesCrudos: issues.length,
      ...result,
      nota: "Candidatos a proyecto tras filtrar tickets operativos (reuniones, dailies, planning) y agrupar series por título. Revisa cada grupo: algunos pueden seguir sin ser 'proyecto' real, y la etapa (stageTag) solo está presente quien la escribió en el título — si falta, usa el desglose de estados como referencia.",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
