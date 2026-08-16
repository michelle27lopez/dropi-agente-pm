"use client";

import { useState } from "react";
import {
  Zap, CheckCircle2, CircleDot, Hourglass, Calendar, Loader2, ChevronRight,
  Target, Diamond, Link2, ExternalLink, ChevronDown,
} from "lucide-react";
import { useMiDiaData } from "./useMiDiaData";
import {
  activeSprintLabel, carpetaLink, classifyJiraStatus, pickFoco,
  progressColor, statusVisual, taskBucket, taskProgress, timeAgo, truncate,
} from "./utils";
import type { JiraStatusCategory, Task } from "./utils";
import { PriorityBadge } from "@/components/PriorityBadge";

function StatStripItem({
  icon,
  variant,
  value,
  label,
}: {
  icon: React.ReactNode;
  variant: "success" | "info" | "pending" | "meetings";
  value: string | number;
  label: string;
}) {
  return (
    <div className="midia-stat-strip-item">
      <span className={`midia-stat-icon midia-stat-icon--${variant}`}>{icon}</span>
      <div>
        <p className="midia-stat-strip-value">{value}</p>
        <p className="midia-stat-strip-label">{label}</p>
      </div>
    </div>
  );
}

function pendingSection(task: Task) {
  return (
    task.sections.find((s) => s.status === "en_curso") ??
    task.sections.find((s) => s.status === "pendiente") ??
    null
  );
}

// Menú de links de la tarea (Carpeta del proyecto, Prototipo, E2E, lo que se
// haya guardado en /sprint) — <details> nativo, sin estado propio.
function LinksMenu({ task }: { task: Task }) {
  if (task.links.length === 0) return null;
  return (
    <details className="midia-links-details">
      <summary className="midia-links-summary">
        <Link2 size={12} />
        Links
      </summary>
      <div className="midia-links-menu">
        {task.links.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="midia-links-menu-item">
            <ExternalLink size={12} />
            {l.label}
          </a>
        ))}
      </div>
    </details>
  );
}

type JiraTransition = { id: string; name: string; toName: string; toCategory: JiraStatusCategory | null };

// Cambiar el estado de una tarea directo desde Darwin, igual que el desplegable
// nativo de Jira (pedido explícito de Michelle 2026-08-16, verificado 1:1 contra
// las transiciones reales de Jira). <details> nativo, transiciones se cargan
// perezosamente al abrir (una llamada por tarea, no en la carga inicial).
function StatusMenu({ task, onChanged }: { task: Task; onChanged: (jiraKey: string, status: string, category: JiraStatusCategory | null) => void }) {
  const [transitions, setTransitions] = useState<JiraTransition[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    if (!e.currentTarget.open || transitions !== null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sprint/status?key=${encodeURIComponent(task.jira_key)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setTransitions(data.transitions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function applyTransition(t: JiraTransition, details: HTMLDetailsElement | null) {
    setApplyingId(t.id);
    setError(null);
    try {
      const res = await fetch("/api/sprint/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jira_key: task.jira_key, transition_id: t.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      onChanged(task.jira_key, data.status, data.statusCategory ?? null);
      setTransitions(null);
      if (details) details.open = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setApplyingId(null);
    }
  }

  const visual = statusVisual(task);

  return (
    <details className="midia-status-details" onToggle={handleToggle}>
      <summary className={`midia-badge midia-status-summary ${visual.className}`}>
        {visual.label}
        <ChevronDown size={11} />
      </summary>
      <div className="midia-links-menu midia-status-menu">
        {loading && <p className="midia-status-hint">Cargando…</p>}
        {error && <p className="midia-status-error">{error}</p>}
        {!loading && !error && transitions?.length === 0 && (
          <p className="midia-status-hint">Sin transiciones disponibles</p>
        )}
        {transitions?.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={applyingId !== null}
            onClick={(e) => applyTransition(t, e.currentTarget.closest("details"))}
            className="midia-links-menu-item midia-status-menu-item"
          >
            {applyingId === t.id ? <Loader2 size={12} className="midia-spin" /> : null}
            {t.name} → {t.toName}
          </button>
        ))}
      </div>
    </details>
  );
}

// Sprint actual + tareas activas fusionados en un solo panel (2026-08-07,
// pedido explícito de Michelle: "Foco de hoy" era redundante con "lo que
// tengo en curso en el sprint") — stats arriba, lista de tareas del sprint
// con progreso/estado/links debajo. Ver [[project_darwin_pd_dashboard]].
export default function SprintPanel() {
  const { tasks, activeSprint, updateTaskStatus } = useMiDiaData();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  if (tasks === null) {
    return (
      <div className="midia-panel" style={{ animationDelay: "60ms" }}>
        <div className="midia-panel-header">
          <div className="midia-skeleton" style={{ width: 140, height: 12 }} />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="midia-row" style={{ alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div className="midia-skeleton" style={{ width: "60%", height: 13, marginBottom: 8 }} />
              <div className="midia-skeleton" style={{ width: "35%", height: 11 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  async function handleActualizar() {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/sprint/sync-jira", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      window.location.reload();
    } catch (err) {
      setSyncing(false);
      setSyncError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  // Nombre del sprint: siempre el activo real en Jira. Solo si esa llamada falló
  // (activeSprint null) caemos al último sprint_label visto en Supabase.
  const sprintLabel = activeSprint?.name ?? activeSprintLabel(tasks);
  const currentSprintTasks = sprintLabel ? tasks.filter((t) => t.sprint_label === sprintLabel) : tasks;
  const workTasks = currentSprintTasks.filter((t) => !t.is_meetings_task);
  const meetingsTask = currentSprintTasks.find((t) => t.is_meetings_task) ?? null;

  const jiraCategoryBucket = (t: Task) =>
    t.jira_status_category === "indeterminate" ? "en_curso" :
    t.jira_status_category === "done" ? "hecho" :
    t.jira_status_category === "new" ? "pendiente" :
    classifyJiraStatus(t.jira_status);

  const hecho = workTasks.filter((t) => jiraCategoryBucket(t) === "hecho").length;
  const enCurso = workTasks.filter((t) => jiraCategoryBucket(t) === "en_curso").length;
  const pendiente = workTasks.length - hecho - enCurso;

  const foco = pickFoco(currentSprintTasks);

  return (
    <div className="midia-panel midia-panel--overflow-visible" style={{ animationDelay: "60ms" }}>
      <div className="midia-panel-header">
        <div className="midia-panel-header-left">
          <span className="midia-panel-icon">
            <Zap size={14} />
          </span>
          <span className="midia-panel-label">
            Sprint actual{sprintLabel ? ` · ${sprintLabel}` : ""}
          </span>
        </div>
        <button type="button" onClick={handleActualizar} disabled={syncing} className="midia-sync-btn">
          {syncing ? <Loader2 size={12} className="midia-spin" /> : null}
          {syncing ? "Actualizando…" : "Actualizar"}
        </button>
      </div>
      {syncError && (
        <p style={{ fontSize: 11, color: "var(--danger)", margin: "0 20px 8px" }}>{syncError}</p>
      )}

      <div className="midia-stat-strip">
        <StatStripItem icon={<CheckCircle2 size={14} />} variant="success" value={hecho} label="Hechas" />
        <StatStripItem icon={<CircleDot size={14} />} variant="info" value={enCurso} label="En curso" />
        <StatStripItem icon={<Hourglass size={14} />} variant="pending" value={pendiente} label="Pendientes" />
        <StatStripItem
          icon={<Calendar size={14} />}
          variant="meetings"
          value={`${meetingsTask?.hours_estimate ?? "—"}h`}
          label="Reuniones"
        />
        <div className="midia-stat-strip-spacer" />
        <a href="/sprint" className="midia-panel-link">
          Ver sprint completo
          <ChevronRight size={14} />
        </a>
      </div>

      {foco.length === 0 ? (
        <div className="midia-row">
          <p style={{ fontSize: 13, color: "var(--muted)" }}>No hay tareas en curso ni pendientes ahora mismo.</p>
        </div>
      ) : (
        foco.map((t) => {
          const carpeta = carpetaLink(t);
          const primaryUrl = carpeta?.url ?? t.jira_url;
          const section = pendingSection(t);
          const bucket = taskBucket(t);
          const pct = taskProgress(t.sections);
          return (
            <div key={t.id} className="midia-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <span className={`midia-row-status${bucket === "en_curso" ? " midia-row-status--activo" : ""}`}>
                  <Target size={16} />
                </span>
                <div className="midia-row-body">
                  <a href={primaryUrl} target="_blank" rel="noreferrer" className="midia-row-title-link">
                    <p className="midia-row-title">
                      {t.summary}
                      <ExternalLink size={11} className="midia-row-title-icon" />
                    </p>
                  </a>
                  <div className="midia-row-meta">
                    {section && (
                      <>
                        <span>{section.name}</span>
                        {section.notes && (
                          <>
                            <span className="midia-row-meta-sep">·</span>
                            <span>{truncate(section.notes, 40)}</span>
                          </>
                        )}
                        <span className="midia-row-meta-sep">·</span>
                      </>
                    )}
                    <Diamond size={11} />
                    <span>{t.jira_key}</span>
                    {t.priority && (
                      <>
                        <span className="midia-row-meta-sep">·</span>
                        <PriorityBadge priority={t.priority} />
                      </>
                    )}
                  </div>
                </div>
                <StatusMenu task={t} onChanged={updateTaskStatus} />
              </div>

              <div className="midia-task-meta-row">
                <div className="midia-progress-track">
                  <div
                    className="midia-progress-fill"
                    style={{ background: progressColor(pct), transform: `scaleX(${Math.max(pct, 0) / 100})` }}
                  />
                </div>
                <span className="midia-progress-pct">{pct}%</span>
                <span className="midia-task-updated">Actualizado {timeAgo(t.updated_at)}</span>
                <LinksMenu task={t} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
