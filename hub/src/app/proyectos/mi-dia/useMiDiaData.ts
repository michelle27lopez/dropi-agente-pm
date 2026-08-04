"use client";

import { useEffect, useState } from "react";
import type { Task, Nota } from "./utils";

export function useMiDiaData() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [notas, setNotas] = useState<Nota[] | null>(null);

  useEffect(() => {
    fetch("/api/sprint")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks ?? []))
      .catch(() => setTasks([]));

    fetch("/api/notas")
      .then((res) => res.json())
      .then((data) => setNotas(Array.isArray(data) ? data : []))
      .catch(() => setNotas([]));
  }, []);

  return { tasks, notas };
}
