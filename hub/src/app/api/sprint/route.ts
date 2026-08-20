import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { viewableSprintEmails } from "@/lib/sprint-access";
import { supabase } from "@/lib/supabase";
import { getActiveSprint, getActiveSprintIssues, jiraConfigured, jiraIssueUrl } from "@/lib/jira";

export async function GET(request: NextRequest) {
  const user = await requireUser();
  const viewable = viewableSprintEmails(user?.email);
  if (viewable.length === 0) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabase) return NextResponse.json([]);

  const requested = request.nextUrl.searchParams.get("person")?.toLowerCase();
  const personEmail = requested && viewable.includes(requested) ? requested : viewable[0];

  const { data, error } = await supabase
    .from("sprint_task_checklist")
    .select("*")
    .eq("person_email", personEmail)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sprintLabels = Array.from(
    new Set((data ?? []).map((t) => t.sprint_label).filter((l): l is string => !!l))
  );

  let periods: Record<string, { start_date: string; end_date: string; holiday_dates: string[] }> = {};
  if (sprintLabels.length > 0) {
    const { data: periodRows } = await supabase
      .from("sprint_periods")
      .select("sprint_label, start_date, end_date, holiday_dates")
      .in("sprint_label", sprintLabels);
    periods = Object.fromEntries((periodRows ?? []).map((p) => [p.sprint_label, p]));
  }

  // Sprint activo en vivo desde Jira — el nombre mostrado en el hub nunca depende de que
  // alguien haya corrido sprint-checklist para el sprint nuevo. Si Jira falla, no rompe la
  // página: el front cae de vuelta al sprint_label más reciente guardado en Supabase.
  let activeSprint = null;
  if (jiraConfigured) {
    try {
      activeSprint = await getActiveSprint();
    } catch {
      activeSprint = null;
    }
  }

  // Tareas del sprint activo asignadas a la persona, directo de Jira. Sirven para dos cosas:
  // 1) completar las que aún no tienen fila en sprint_task_checklist (nadie corrió
  //    sprint-checklist todavía) — se agregan igual, sin secciones/links.
  // 2) refrescar el estado/prioridad/categoría de las que sí tienen fila, para que el color
  //    del badge y la prioridad mostrados nunca dependan de que alguien apriete "Actualizar".
  // Esto es solo para lo que se muestra — no se escribe nada en Supabase acá, eso lo sigue
  // haciendo el botón "Actualizar" (sync-jira) como hasta ahora.
  // Mismo criterio de resiliencia que activeSprint: si Jira falla, no se agrega/enriquece nada.
  const liveByKey = new Map<string, Awaited<ReturnType<typeof getActiveSprintIssues>>[number]>();
  if (jiraConfigured && activeSprint) {
    try {
      const liveIssues = await getActiveSprintIssues(personEmail);
      for (const issue of liveIssues) liveByKey.set(issue.key.toUpperCase(), issue);
    } catch {
      // liveByKey queda vacío, tasks se devuelve tal cual vino de Supabase
    }
  }

  const enrichedData = (data ?? []).map((row) => {
    const live = row.jira_key ? liveByKey.get(row.jira_key.toUpperCase()) : undefined;
    if (!live) return { ...row, jira_status_category: null };
    return {
      ...row,
      jira_status: live.status,
      priority: live.priority,
      jira_status_category: live.statusCategory,
    };
  });

  const existingKeys = new Set((data ?? []).map((t) => t.jira_key?.toUpperCase()));
  const now = new Date().toISOString();
  const liveOnlyTasks = Array.from(liveByKey.values())
    .filter((issue) => !existingKeys.has(issue.key.toUpperCase()))
    .map((issue) => ({
      id: `jira-${issue.key}`,
      jira_key: issue.key,
      jira_url: jiraIssueUrl(issue.key),
      summary: issue.summary,
      jira_status: issue.status,
      jira_status_category: issue.statusCategory,
      priority: issue.priority,
      sections: [],
      links: [],
      updated_at: issue.updated ?? now,
      is_meetings_task: false,
      hours_estimate: null,
      sprint_label: activeSprint?.name ?? null,
      last_synced_to_jira_at: null,
    }));

  return NextResponse.json({
    tasks: [...enrichedData, ...liveOnlyTasks],
    periods,
    viewable,
    viewing: personEmail,
    activeSprint,
  });
}
