"use client";

import { useEffect, useState } from "react";

type SectionStatus = "pendiente" | "en_curso" | "hecho";
type Section = { name: string; status: SectionStatus; notes: string; updatedAt?: string };
type Link = { label: string; url: string };

type Task = {
  id: string;
  jira_key: string;
  jira_url: string;
  summary: string;
  jira_status: string | null;
  sections: Section[];
  links: Link[];
  updated_at: string;
  is_meetings_task: boolean;
  hours_estimate: number | null;
};

type Nota = { id: string; titulo: string; contenido: string; updated_at: string };

const CARPETA_LABEL = "carpeta del proyecto";

function truncate(text: string, max: number): string {
  const clean = text.trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
}

function classifyJiraStatus(status: string | null): SectionStatus {
  const s = (status ?? "").toLowerCase();
  if (/(resuelt|cerrad|hecho|complet|done)/.test(s)) return "hecho";
  if (/(progreso|revisi[oó]n|curso|review|doing)/.test(s)) return "en_curso";
  return "pendiente";
}

// "Foco de hoy": derivado solo de datos que ya están sincronizados, sin
// pedirle nada nuevo a Michelle cada mañana. En curso primero, pendiente
// como relleno, máximo 3 — ver [[project_darwin_pd_dashboard]].
function pickFoco(tasks: Task[]): Task[] {
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

function carpetaLink(task: Task): Link | null {
  return task.links.find((l) => l.label.trim().toLowerCase() === CARPETA_LABEL) ?? null;
}

function greeting(): string {
  const now = new Date();
  const dia = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" }).format(now);
  return dia.charAt(0).toUpperCase() + dia.slice(1);
}

const cardStyle: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20,
};

const gridStyle: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12,
};

export default function HomeDashboard() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [notas, setNotas] = useState<Nota[] | null>(null);
  const [showContexto, setShowContexto] = useState(false);

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

  if (tasks === null || notas === null) {
    return <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando tu día…</p>;
  }

  const workTasks = tasks.filter((t) => !t.is_meetings_task);
  const meetingsTask = tasks.find((t) => t.is_meetings_task) ?? null;
  const foco = pickFoco(tasks);
  const continuarTask = foco[0] ?? null;
  const continuarLink = continuarTask ? carpetaLink(continuarTask) : null;

  const hecho = workTasks.filter((t) => classifyJiraStatus(t.jira_status) === "hecho").length;
  const enCurso = workTasks.filter((t) => classifyJiraStatus(t.jira_status) === "en_curso").length;
  const pendiente = workTasks.length - hecho - enCurso;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>
          Hola Michelle
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{greeting()}</p>
      </div>

      {continuarTask && (
        <div style={{ ...cardStyle, borderColor: "var(--dropi)", background: "var(--dropi-light)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 8px" }}>
            Retomando
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>{continuarTask.summary}</p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 14px" }}>{continuarTask.jira_key}</p>
          {continuarLink ? (
            <a
              href={continuarLink.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block", fontSize: 13, fontWeight: 700, color: "#fff",
                background: "var(--dropi)", borderRadius: 8, padding: "8px 16px", textDecoration: "none",
              }}
            >
              Abrir carpeta del proyecto →
            </a>
          ) : (
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
              Agrega un link con label &quot;Carpeta del proyecto&quot; a esta tarea en{" "}
              <a href="/sprint" style={{ color: "var(--dropi)" }}>/sprint</a> para acceso directo.
            </p>
          )}
        </div>
      )}

      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 12px" }}>
          Notas de ayer
        </p>
        {notas.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>No hay notas recientes.</p>
        ) : (
          <div style={gridStyle}>
            {notas.slice(0, 3).map((n) => (
              <div key={n.id} style={cardStyle}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>{n.titulo}</p>
                {n.contenido && (
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{truncate(n.contenido, 140)}</p>
                )}
              </div>
            ))}
          </div>
        )}
        <a href="/notas" style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none", display: "inline-block", marginTop: 10 }}>
          Ver todas las notas →
        </a>
      </div>

      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 12px" }}>
          Foco de hoy
        </p>
        {foco.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>No hay tareas en curso ni pendientes ahora mismo.</p>
        ) : (
          <div style={gridStyle}>
            {foco.map((t) => {
              const carpeta = carpetaLink(t);
              const primaryUrl = carpeta?.url ?? t.jira_url;
              const chips = [
                ...t.links.filter((l) => l !== carpeta),
                { label: "Jira", url: t.jira_url },
              ];
              return (
                <div key={t.id} style={cardStyle}>
                  <a
                    href={primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>{t.summary}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
                      {t.jira_key} · {t.sections.filter((s) => s.status !== "hecho").map((s) => s.name).join(", ") || "Sin secciones pendientes"}
                    </p>
                  </a>
                  {chips.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {chips.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: 11, color: "var(--fg)", background: "#F3F4F6", borderRadius: 999,
                            padding: "3px 9px", textDecoration: "none", fontWeight: 600,
                          }}
                        >
                          🔗 {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowContexto((v) => !v)}
          style={{
            fontSize: 12, fontWeight: 700, color: "var(--muted)", background: "none",
            border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", cursor: "pointer",
          }}
        >
          {showContexto ? "▾" : "▸"} Contexto del sprint
        </button>
        {showContexto && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            <div style={cardStyle}>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 6px" }}>Hechas</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--success)", margin: 0 }}>{hecho}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 6px" }}>En curso</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--info)", margin: 0 }}>{enCurso}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 6px" }}>Pendientes</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: 0 }}>{pendiente}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 6px" }}>Reuniones</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
                {meetingsTask?.hours_estimate ?? "—"}h
              </p>
            </div>
            <a
              href="/sprint"
              style={{
                gridColumn: "1 / -1", fontSize: 12, fontWeight: 700, color: "var(--dropi)",
                textDecoration: "none", marginTop: 4,
              }}
            >
              Ver ritmo y detalle completo del sprint →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
