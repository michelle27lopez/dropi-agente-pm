import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { isSprintAllowed } from "@/lib/sprint-access";
import { supabase } from "@/lib/supabase";
import { getIssueStatus, getIssueTransitions, jiraConfigured, transitionIssue } from "@/lib/jira";

// Cambiar el estado de una tarea directo desde Darwin, igual que el desplegable
// nativo de Jira (ver [[project_darwin_pd_dashboard]]) — GET trae las transiciones
// reales disponibles desde el estado actual, POST aplica una.
export async function GET(request: NextRequest) {
  const user = await requireUser();
  if (!isSprintAllowed(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!jiraConfigured) {
    return NextResponse.json(
      { error: "Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local" },
      { status: 500 }
    );
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Falta el parámetro key" }, { status: 400 });

  try {
    const transitions = await getIssueTransitions(key);
    return NextResponse.json({ transitions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!isSprintAllowed(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!jiraConfigured) {
    return NextResponse.json(
      { error: "Jira no configurado — faltan JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en .env.local" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const jiraKey: string | undefined = body?.jira_key;
  const transitionId: string | undefined = body?.transition_id;
  if (!jiraKey || !transitionId) {
    return NextResponse.json({ error: "Faltan jira_key o transition_id" }, { status: 400 });
  }

  try {
    await transitionIssue(jiraKey, transitionId);
    const status = await getIssueStatus(jiraKey);

    // Best effort: si la tarea ya tiene checklist en Supabase, refrescar su estado
    // guardado. No bloquea la respuesta si falla — Jira ya quedó actualizado.
    if (supabase) {
      await supabase
        .from("sprint_task_checklist")
        .update({ jira_status: status.name, last_synced_to_jira_at: new Date().toISOString() })
        .eq("jira_key", jiraKey);
    }

    return NextResponse.json({ status: status.name, statusCategory: status.category });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
