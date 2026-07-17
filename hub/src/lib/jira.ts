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
