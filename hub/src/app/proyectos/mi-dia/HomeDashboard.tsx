"use client";

import { Folder, Diamond, ListChecks, StickyNote, Target, ArrowRight, ChevronRight } from "lucide-react";
import { useMiDiaData } from "./useMiDiaData";
import { carpetaLink, greeting, pickFoco, truncate } from "./utils";
import type { Task } from "./utils";

function pendingSection(task: Task) {
  return (
    task.sections.find((s) => s.status === "en_curso") ??
    task.sections.find((s) => s.status === "pendiente") ??
    null
  );
}

function SkeletonPanel({ rows, delay }: { rows: number; delay: number }) {
  return (
    <div className="midia-panel" style={{ animationDelay: `${delay}ms` }}>
      <div className="midia-panel-header">
        <div className="midia-skeleton" style={{ width: 120, height: 12 }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
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

// Feed principal de "mi día": Retomando, Foco de hoy, Notas de ayer. El
// contexto del sprint y las reuniones de hoy viven en la franja lateral
// (ver SprintStatsPanel / HoyPanel) — ver [[project_darwin_pd_dashboard]].
export default function HomeDashboard() {
  const { tasks, notas } = useMiDiaData();

  if (tasks === null || notas === null) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>
            Hola Michelle
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{greeting()}</p>
        </div>
        <SkeletonPanel rows={1} delay={0} />
        <SkeletonPanel rows={3} delay={60} />
        <SkeletonPanel rows={3} delay={120} />
      </div>
    );
  }

  const foco = pickFoco(tasks);
  const continuarTask = foco[0] ?? null;
  const continuarLink = continuarTask ? carpetaLink(continuarTask) : null;
  const notasRecientes = notas.slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>
          Hola Michelle
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{greeting()}</p>
      </div>

      {continuarTask && (
        <div className="midia-retomando" style={{ animationDelay: "0ms" }}>
          <div className="midia-retomando-header">
            <span className="midia-panel-icon">
              <Target size={14} />
            </span>
            <span className="midia-panel-label" style={{ color: "var(--dropi)" }}>Retomando</span>
          </div>
          <p className="midia-retomando-title">{continuarTask.summary}</p>

          <div className="midia-retomando-footer">
            <div className="midia-retomando-meta">
              {continuarLink && (
                <span>
                  <Folder size={13} />
                  {continuarLink.label}
                </span>
              )}
              <span>
                <Diamond size={13} />
                {continuarTask.jira_key}
              </span>
            </div>
            {continuarLink ? (
              <a href={continuarLink.url} target="_blank" rel="noreferrer" className="midia-btn-primary">
                Abrir carpeta del proyecto
                <ArrowRight size={14} />
              </a>
            ) : (
              <a href="/sprint" className="midia-panel-link">
                Agregar link &quot;Carpeta del proyecto&quot; en /sprint
                <ChevronRight size={14} />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="midia-panel" style={{ animationDelay: "60ms" }}>
        <div className="midia-panel-header">
          <div className="midia-panel-header-left">
            <span className="midia-panel-icon">
              <ListChecks size={14} />
            </span>
            <span className="midia-panel-label">Foco de hoy</span>
          </div>
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
            const activo = section?.status === "en_curso";
            return (
              <div key={t.id} className="midia-row">
                <span className={`midia-row-status${activo ? " midia-row-status--activo" : ""}`}>
                  <Target size={16} />
                </span>
                <div className="midia-row-body">
                  <a href={primaryUrl} target="_blank" rel="noreferrer">
                    <p className="midia-row-title">{t.summary}</p>
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
                  </div>
                </div>
                <span className={`midia-badge${activo ? " midia-badge--activo" : " midia-badge--pendiente"}`}>
                  {activo ? "En curso" : "Pendiente"}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="midia-panel" style={{ animationDelay: "120ms" }}>
        <div className="midia-panel-header">
          <div className="midia-panel-header-left">
            <span className="midia-panel-icon">
              <StickyNote size={14} />
            </span>
            <span className="midia-panel-label">Notas de ayer</span>
          </div>
        </div>
        {notasRecientes.length === 0 ? (
          <div className="midia-row">
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No hay notas recientes.</p>
          </div>
        ) : (
          notasRecientes.map((n) => (
            <a key={n.id} href="/notas" className="midia-row">
              <div className="midia-row-body">
                <p className="midia-row-title">{n.titulo}</p>
                {n.contenido && (
                  <p className="midia-row-meta" style={{ WebkitLineClamp: "unset" }}>
                    {truncate(n.contenido, 90)}
                  </p>
                )}
              </div>
              <ChevronRight size={16} color="var(--muted)" />
            </a>
          ))
        )}
        <div className="midia-panel-footer">
          <a href="/notas" className="midia-panel-link">
            Ver todas las notas
            <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
