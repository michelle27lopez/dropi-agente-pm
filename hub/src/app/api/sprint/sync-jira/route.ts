import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { viewableSprintEmails } from "@/lib/sprint-access";
import { supabase } from "@/lib/supabase";
import { jiraConfigured, searchAllIssues } from "@/lib/jira";

// Sync a demanda (botón "Actualizar" en /sprint y en "mi día"), nunca automático
// en cada carga — ver [[project_darwin_jira_sync_decision]]. Solo toca los campos
// estructurales que vienen de Jira (summary/status/priority); nunca `sections`
// ni `links`, que son contenido documentado a mano.
export async function POST(request: NextRequest) {
  const user = await requireUser();
  const viewable = viewableSprintEmails(user?.email);
  if (viewable.length === 0) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  if (!jiraConfigured) {
    return NextResponse.json(
      { error: "Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local" },
      { status: 500 }
    );
  }

  const requested = request.nextUrl.searchParams.get("person")?.toLowerCase();
  const personEmail = requested && viewable.includes(requested) ? requested : viewable[0];

  const { data: rows, error: readError } = await supabase
    .from("sprint_task_checklist")
    .select("id, jira_key")
    .eq("person_email", personEmail);

  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 });
  if (!rows || rows.length === 0) {
    return NextResponse.json({ updated: 0, synced_at: new Date().toISOString() });
  }

  const jql = `key in (${rows.map((r) => `"${r.jira_key}"`).join(",")})`;

  let issues;
  try {
    issues = await searchAllIssues(jql, ["summary", "status", "priority"]);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }

  const now = new Date().toISOString();
  let updated = 0;

  for (const issue of issues) {
    const f = issue.fields as Record<string, any>;
    const { error: updateError } = await supabase
      .from("sprint_task_checklist")
      .update({
        summary: f.summary ?? undefined,
        jira_status: f.status?.name ?? null,
        priority: f.priority?.name ?? null,
        last_synced_to_jira_at: now,
        updated_at: now,
      })
      .eq("jira_key", issue.key)
      .eq("person_email", personEmail);

    if (!updateError) updated += 1;
  }

  return NextResponse.json({ updated, synced_at: now });
}
