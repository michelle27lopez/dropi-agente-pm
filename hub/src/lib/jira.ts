const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

export const jiraConfigured = !!(JIRA_BASE_URL && JIRA_EMAIL && JIRA_API_TOKEN);

function authHeader() {
  const raw = `${JIRA_EMAIL}:${JIRA_API_TOKEN}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

export type JiraIssue = {
  key: string;
  fields: Record<string, unknown>;
};

export type JiraSearchResult = {
  issues: JiraIssue[];
  nextPageToken?: string;
  isLast: boolean;
};

// Jira Cloud REST API v3 — endpoint /search/jql (reemplazó a /search, deprecado en 2025).
// https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-post
export async function searchIssues(jql: string, fields: string[], maxResults = 50, nextPageToken?: string): Promise<JiraSearchResult> {
  if (!jiraConfigured) throw new Error("Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local");

  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/search/jql`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jql, fields, maxResults, ...(nextPageToken ? { nextPageToken } : {}) }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API error ${res.status}: ${body}`);
  }

  return res.json();
}

// Trae todas las páginas de un JQL (usa con cuidado — un board grande puede ser varias llamadas).
export async function searchAllIssues(jql: string, fields: string[], pageSize = 100): Promise<JiraIssue[]> {
  const all: JiraIssue[] = [];
  let nextPageToken: string | undefined;
  do {
    const page = await searchIssues(jql, fields, pageSize, nextPageToken);
    all.push(...page.issues);
    nextPageToken = page.isLast ? undefined : page.nextPageToken;
  } while (nextPageToken);
  return all;
}

// Board del proyecto PROD — mismo id usado en los links directos a Jira (jira-apoyo, monthly-update).
export const JIRA_PROD_BOARD_ID = 1267;

export type JiraActiveSprint = { id: number; name: string; startDate: string | null; endDate: string | null };

// Sprint activo real del board — API Agile, no depende de nada guardado en Supabase.
// Si hay varios sprints "active" (poco común), toma el primero que devuelve Jira.
export async function getActiveSprint(boardId = JIRA_PROD_BOARD_ID): Promise<JiraActiveSprint | null> {
  if (!jiraConfigured) throw new Error("Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local");

  const res = await fetch(`${JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/sprint?state=active`, {
    headers: { Authorization: authHeader(), Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const sprint = data.values?.[0];
  if (!sprint) return null;
  return { id: sprint.id, name: sprint.name, startDate: sprint.startDate ?? null, endDate: sprint.endDate ?? null };
}

export function jiraIssueUrl(key: string): string {
  return `${JIRA_BASE_URL}/browse/${key}`;
}

export type JiraStatusCategory = "new" | "indeterminate" | "done";

export type JiraLiveIssue = {
  key: string;
  summary: string;
  status: string | null;
  statusCategory: JiraStatusCategory | null;
  priority: string | null;
  updated: string | null;
};

// Tareas del sprint activo asignadas a una persona, directo de Jira — no depende
// de que sprint_task_checklist tenga la fila creada (ver [[project_sprint_documentacion_sistema]]).
// Verificado en vivo 2026-08-16: "sprint in openSprints()" + assignee por email
// devuelve exactamente las tareas del board del sprint activo.
export async function getActiveSprintIssues(email: string): Promise<JiraLiveIssue[]> {
  const jql = `project = PROD AND sprint in openSprints() AND assignee = "${email}"`;
  const issues = await searchAllIssues(jql, ["summary", "status", "priority", "updated"]);
  return issues.map((issue) => {
    const f = issue.fields as Record<string, any>;
    return {
      key: issue.key,
      summary: f.summary ?? "",
      status: f.status?.name ?? null,
      statusCategory: (f.status?.statusCategory?.key as JiraStatusCategory | undefined) ?? null,
      priority: f.priority?.name ?? null,
      updated: f.updated ?? null,
    };
  });
}

export type JiraTransition = { id: string; name: string; toName: string; toCategory: JiraStatusCategory | null };

// Transiciones reales disponibles desde el estado actual de un issue — el mismo
// desplegable que Jira muestra nativamente (ver captura de Michelle 2026-08-16:
// "bloqueo"→Dependencia, "cambio prioridad"→Despriorizada, "se ejecutó"→hecho,
// "se canceló"→Cancelado, verificado 1:1 contra la API real).
export async function getIssueTransitions(issueKey: string): Promise<JiraTransition[]> {
  if (!jiraConfigured) throw new Error("Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local");

  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`, {
    headers: { Authorization: authHeader(), Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return (data.transitions ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    toName: t.to?.name ?? "",
    toCategory: (t.to?.statusCategory?.key as JiraStatusCategory | undefined) ?? null,
  }));
}

export async function transitionIssue(issueKey: string, transitionId: string): Promise<void> {
  if (!jiraConfigured) throw new Error("Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local");

  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transition: { id: transitionId } }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API error ${res.status}: ${body}`);
  }
}

export type JiraIssueStatus = { name: string; category: JiraStatusCategory | null };

// Lee el estado confirmado de un issue tras transicionarlo — no confiar en lo
// que mandó el cliente, Jira es la fuente de verdad.
export async function getIssueStatus(issueKey: string): Promise<JiraIssueStatus> {
  if (!jiraConfigured) throw new Error("Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local");

  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}?fields=status`, {
    headers: { Authorization: authHeader(), Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return {
    name: data.fields?.status?.name ?? "",
    category: (data.fields?.status?.statusCategory?.key as JiraStatusCategory | undefined) ?? null,
  };
}
