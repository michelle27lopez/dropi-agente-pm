"use client";

import { useCallback, useEffect, useState } from "react";
import type { JiraStatusCategory, Task } from "./utils";

export type ActiveSprint = { id: number; name: string; startDate: string | null; endDate: string | null };

export function useMiDiaData() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [activeSprint, setActiveSprint] = useState<ActiveSprint | null>(null);

  useEffect(() => {
    fetch("/api/sprint")
      .then((res) => res.json())
      .then((data) => {
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

  return { tasks, activeSprint, updateTaskStatus };
}
