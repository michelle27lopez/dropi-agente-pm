export type SectionStatus = "pendiente" | "en_curso" | "hecho";
export type Section = { name: string; status: SectionStatus; notes: string; updatedAt?: string };
export type TaskLink = { label: string; url: string };

export type Task = {
  id: string;
  jira_key: string;
  jira_url: string;
  summary: string;
  jira_status: string | null;
  sections: Section[];
  links: TaskLink[];
  updated_at: string;
  is_meetings_task: boolean;
  hours_estimate: number | null;
  sprint_label: string | null;
};

export type Nota = { id: string; titulo: string; contenido: string; updated_at: string };

export const CARPETA_LABEL = "carpeta del proyecto";

export function truncate(text: string, max: number): string {
  const clean = text.trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
}

export function classifyJiraStatus(status: string | null): SectionStatus {
  const s = (status ?? "").toLowerCase();
  if (/(resuelt|cerrad|hecho|complet|done)/.test(s)) return "hecho";
  if (/(progreso|revisi[oó]n|curso|review|doing)/.test(s)) return "en_curso";
  return "pendiente";
}

// El sprint activo es el que más recientemente recibió una tarea sincronizada
// (preplanning trae las tareas del sprint abierto primero) — evita mostrar
// tareas de sprints cerrados en el home sin tener que borrarlas de Supabase.
export function activeSprintLabel(tasks: Task[]): string | null {
  const withLabel = tasks.filter((t) => t.sprint_label);
  if (withLabel.length === 0) return null;
  return [...withLabel].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0].sprint_label;
}

// "Foco de hoy": derivado solo de datos que ya están sincronizados, sin
// pedirle nada nuevo a Michelle cada mañana. En curso primero, pendiente
// como relleno, máximo 3 — ver [[project_darwin_pd_dashboard]].
export function pickFoco(tasks: Task[]): Task[] {
  const workTasks = tasks.filter((t) => !t.is_meetings_task);
  const enCurso = workTasks
    .filter((t) => t.sections.some((s) => s.status === "en_curso"))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  if (enCurso.length >= 3) return enCurso.slice(0, 3);

  const pendiente = workTasks
    .filter((t) => !enCurso.includes(t) && t.sections.some((s) => s.status === "pendiente"))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  return [...enCurso, ...pendiente].slice(0, 3);
}

export function carpetaLink(task: Task): TaskLink | null {
  return task.links.find((l) => l.label.trim().toLowerCase() === CARPETA_LABEL) ?? null;
}

export function greeting(): string {
  const now = new Date();
  const dia = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" }).format(now);
  return dia.charAt(0).toUpperCase() + dia.slice(1);
}
