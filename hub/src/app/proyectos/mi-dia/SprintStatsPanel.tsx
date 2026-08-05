"use client";

import { useState } from "react";
import { Zap, CheckCircle2, CircleDot, Hourglass, Calendar, Loader2, ChevronRight } from "lucide-react";
import { useMiDiaData } from "./useMiDiaData";
import { activeSprintLabel, classifyJiraStatus } from "./utils";

function StatRow({
  icon,
  variant,
  label,
  value,
}: {
  icon: React.ReactNode;
  variant: "success" | "info" | "pending" | "meetings";
  label: string;
  value: string | number;
}) {
  return (
    <div className="midia-stat-row">
      <div className="midia-stat-left">
        <span className={`midia-stat-icon midia-stat-icon--${variant}`}>{icon}</span>
        <span className="midia-stat-label">{label}</span>
      </div>
      <span className="midia-stat-value">{value}</span>
    </div>
  );
}

// Contexto del sprint activo, en la franja lateral persistente del home
// (antes vivía escondido en un acordeón al fondo de la página) — ver
// [[project_darwin_pd_dashboard]].
export default function SprintStatsPanel() {
  const { tasks } = useMiDiaData();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  if (tasks === null) return null;

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

  const sprintLabel = activeSprintLabel(tasks);
  const currentSprintTasks = sprintLabel ? tasks.filter((t) => t.sprint_label === sprintLabel) : tasks;
  const workTasks = currentSprintTasks.filter((t) => !t.is_meetings_task);
  const meetingsTask = currentSprintTasks.find((t) => t.is_meetings_task) ?? null;

  const hecho = workTasks.filter((t) => classifyJiraStatus(t.jira_status) === "hecho").length;
  const enCurso = workTasks.filter((t) => classifyJiraStatus(t.jira_status) === "en_curso").length;
  const pendiente = workTasks.length - hecho - enCurso;

  return (
    <div className="midia-panel" style={{ animationDelay: "0ms" }}>
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
      <div>
        <StatRow icon={<CheckCircle2 size={14} />} variant="success" label="Hechas" value={hecho} />
        <StatRow icon={<CircleDot size={14} />} variant="info" label="En curso" value={enCurso} />
        <StatRow icon={<Hourglass size={14} />} variant="pending" label="Pendientes" value={pendiente} />
        <StatRow
          icon={<Calendar size={14} />}
          variant="meetings"
          label="Reuniones"
          value={`${meetingsTask?.hours_estimate ?? "—"}h`}
        />
      </div>
      <a
        href="/sprint"
        className="midia-panel-link"
        style={{ display: "inline-flex", margin: "14px 20px 16px" }}
      >
        Ver sprint completo
        <ChevronRight size={14} />
      </a>
    </div>
  );
}
