"use client";

import { Folder, Diamond, Target, ArrowRight, ChevronRight } from "lucide-react";
import { useMiDiaData } from "./useMiDiaData";
import { carpetaLink, pickFoco } from "./utils";

// Continuidad diaria: "¿en qué me quedé?" — junto con "Hoy" (reuniones), es
// lo primero que Michelle busca al abrir el home, por eso va en la fila hero
// — ver [[project_darwin_pd_dashboard]].
export default function RetomandoCard() {
  const { tasks } = useMiDiaData();

  if (tasks === null) {
    return (
      <div className="midia-retomando" style={{ animationDelay: "0ms" }}>
        <div className="midia-skeleton" style={{ width: 120, height: 12, marginBottom: 14 }} />
        <div className="midia-skeleton" style={{ width: "70%", height: 15 }} />
      </div>
    );
  }

  const continuarTask = pickFoco(tasks)[0] ?? null;
  const continuarLink = continuarTask ? carpetaLink(continuarTask) : null;

  if (!continuarTask) {
    return (
      <div className="midia-retomando" style={{ animationDelay: "0ms" }}>
        <div className="midia-retomando-header">
          <span className="midia-panel-icon">
            <Target size={14} />
          </span>
          <span className="midia-panel-label" style={{ color: "var(--dropi)" }}>Retomando</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>No hay tareas en curso ni pendientes ahora mismo.</p>
      </div>
    );
  }

  return (
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
  );
}
