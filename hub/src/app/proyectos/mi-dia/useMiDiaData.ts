"use client";

import { useCallback, useEffect, useState } from "react";
import type { JiraStatusCategory, Task } from "./utils";

export type ActiveSprint = { id: number; name: string; startDate: string | null; endDate: string | null };

export function useMiDiaData() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [activeSprint, setActiveSprint] = useState<ActiveSprint | null>(null);
  // false = la API respondió 401 (persona fuera de SPRINT_ALLOWED_EMAILS,
  // sin Jira conectado a este panel todavía) — distingue "sin tareas" de
  // "esto no aplica a mí", para mostrar "Pendiente" en vez de un panel
  // vacío que parece roto.
  const [sprintAllowed, setSprintAllowed] = useState(true);

  useEffect(() => {
    fetch("/api/sprint")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setSprintAllowed(false);
          setTasks([]);
          return;
        }
        setTasks(data.tasks ?? []);
        setActiveSprint(data.activeSprint ?? null);
      })
      .catch(() => setTasks([]));
  }, []);

  // Patch local tras cambiar el estado de una tarea en Jira desde el StatusMenu —
  // evita recargar todo el panel, misma sensación instantánea que el desplegable
  // nativo de Jira.
  const updateTaskStatus = useCallback((jiraKey: string, status: string, category: JiraStatusCategory | null) => {
    setTasks((prev) =>
      prev?.map((t) => (t.jira_key === jiraKey ? { ...t, jira_status: status, jira_status_category: category } : t)) ?? prev
    );
  }, []);

  return { tasks, activeSprint, sprintAllowed, updateTaskStatus };
}
