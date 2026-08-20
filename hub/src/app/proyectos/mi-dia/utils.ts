export type SectionStatus = "pendiente" | "en_curso" | "hecho";
export type Section = { name: string; status: SectionStatus; notes: string; updatedAt?: string };
export type TaskLink = { label: string; url: string };

export type JiraStatusCategory = "new" | "indeterminate" | "done";

export type Task = {
  id: string;
  jira_key: string;
  jira_url: string;
  summary: string;
  jira_status: string | null;
  jira_status_category: JiraStatusCategory | null;
  priority: string | null;
  sections: Section[];
  links: TaskLink[];
  updated_at: string;
  is_meetings_task: boolean;
  hours_estimate: number | null;
  sprint_label: string | null;
};

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

// Fallback cuando Jira no responde: el sprint activo es el que más recientemente
// recibió una tarea sincronizada. Se usa solo si /api/sprint no pudo traer el
// sprint activo real desde el board — ver activeSprint en useMiDiaData.
export function activeSprintLabel(tasks: Task[]): string | null {
  const withLabel = tasks.filter((t) => t.sprint_label);
  if (withLabel.length === 0) return null;
  return [...withLabel].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0].sprint_label;
}

// Estado de una tarea para ordenar el panel del sprint: si tiene checklist
// documentado (sections), usa ese estado; si no, prefiere la categoría real de
// Jira (jira_status_category) y solo cae al regex classifyJiraStatus si esa
// categoría no vino (Jira caído en esa carga).
export function taskBucket(task: Task): SectionStatus {
  if (task.sections.length > 0) {
    if (task.sections.some((s) => s.status === "en_curso")) return "en_curso";
    if (task.sections.some((s) => s.status === "pendiente")) return "pendiente";
    return "hecho";
  }
  if (task.jira_status_category === "indeterminate") return "en_curso";
  if (task.jira_status_category === "done") return "hecho";
  if (task.jira_status_category === "new") return "pendiente";
  return classifyJiraStatus(task.jira_status);
}

const CATEGORY_BADGE_CLASS: Record<JiraStatusCategory, string> = {
  new: "midia-badge--pendiente",
  indeterminate: "midia-badge--activo",
  done: "midia-badge--hecho",
};

const BUCKET_BADGE_CLASS: Record<SectionStatus, string> = {
  en_curso: "midia-badge--activo",
  pendiente: "midia-badge--pendiente",
  hecho: "midia-badge--hecho",
};

const BUCKET_LABEL: Record<SectionStatus, string> = {
  en_curso: "En curso",
  pendiente: "Pendiente",
  hecho: "Hecho",
};

// Estado real de Jira para pintar el badge — nombre y color exactos de Jira
// (ej. "Cancelado" en verde, "Despriorizada" en gris), no nuestros 3 buckets
// genéricos. Cae al bucket documentado/heurístico solo si no hay categoría viva.
export function statusVisual(task: Task): { label: string; className: string } {
  if (task.jira_status_category) {
    return {
      label: task.jira_status ?? BUCKET_LABEL[taskBucket(task)],
      className: CATEGORY_BADGE_CLASS[task.jira_status_category],
    };
  }
  const bucket = taskBucket(task);
  return { label: BUCKET_LABEL[bucket], className: BUCKET_BADGE_CLASS[bucket] };
}

// Todas las tareas del sprint activo (no solo un "foco" recortado), ordenadas
// por relevancia: en curso primero, pendientes después, hechas al final —
// ver [[project_darwin_pd_dashboard]].
export function pickFoco(tasks: Task[]): Task[] {
  const workTasks = tasks.filter((t) => !t.is_meetings_task);
  const byBucket = (bucket: SectionStatus) =>
    workTasks.filter((t) => taskBucket(t) === bucket).sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  return [...byBucket("en_curso"), ...byBucket("pendiente"), ...byBucket("hecho")];
}

export function carpetaLink(task: Task): TaskLink | null {
  return task.links.find((l) => l.label.trim().toLowerCase() === CARPETA_LABEL) ?? null;
}

// Mismo cálculo que taskProgress() en /sprint/page.tsx (pendiente=0,
// en_curso=0.5, hecho=1) — duplicado a propósito en vez de importar desde
// una página, mismo criterio de "fetch duplicado aceptado" del resto de
// mi-dia.
const SECTION_PCT: Record<SectionStatus, number> = { pendiente: 0, en_curso: 0.5, hecho: 1 };

export function taskProgress(sections: Section[]): number {
  if (sections.length === 0) return 0;
  const sum = sections.reduce((acc, s) => acc + SECTION_PCT[s.status], 0);
  return Math.round((sum / sections.length) * 100);
}

export function progressColor(pct: number): string {
  if (pct >= 100) return "var(--success)";
  if (pct >= 40) return "var(--info)";
  return "var(--muted)";
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "justo ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.round(hours / 24);
  return `hace ${days}d`;
}

export function greeting(): string {
  const now = new Date();
  const dia = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" }).format(now);
  return dia.charAt(0).toUpperCase() + dia.slice(1);
}
