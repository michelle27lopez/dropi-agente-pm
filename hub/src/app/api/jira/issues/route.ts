import { NextRequest, NextResponse } from "next/server";
import { jiraConfigured, searchIssues } from "@/lib/jira";
import { requireUser } from "@/lib/require-auth";

// Endpoint de prueba: trae issues crudos del proyecto PROD para inspeccionar qué campos
// trae Jira realmente (célula, estado, fechas, tipo) antes de automatizar el cálculo del
// monthly update. Borrar o restringir una vez definidas las reglas de clasificación.
const DEFAULT_JQL = 'project = PROD ORDER BY updated DESC';
const DEFAULT_FIELDS = ["summary", "status", "issuetype", "created", "updated", "resolutiondate", "labels", "components", "assignee"];

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!jiraConfigured) {
    return NextResponse.json(
      { error: "Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local" },
      { status: 500 }
    );
  }

  // El jql ya no lo controla el request — cualquier usuario logueado podía
  // consultar issues de proyectos fuera de su alcance. Fijo al proyecto PROD;
  // si se necesita un filtro distinto, se agrega como parámetro validado
  // contra una lista blanca, no como JQL crudo.
  const jql = DEFAULT_JQL;
  const { searchParams } = new URL(req.url);
  const maxResults = Number(searchParams.get("maxResults") ?? "20");

  try {
    const result = await searchIssues(jql, DEFAULT_FIELDS, maxResults);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
