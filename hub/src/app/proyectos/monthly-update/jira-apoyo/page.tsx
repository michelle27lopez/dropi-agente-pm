"use client";

import { useEffect, useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";

const ACCENT = "#F77F00";
const JIRA_BASE_URL = "https://dropi-it.atlassian.net";

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
  padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "var(--fg)",
  display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
};

const dotStyle: React.CSSProperties = {
  width: 8, height: 8, borderRadius: "50%", background: ACCENT, display: "inline-block",
};

type CelulaAgg = { celula: string; total: number; cerrados: number; enCurso: number; backlog: number };
type PmAmbiguo = { assignee: string; posibles: string[]; total: number; cerrados: number; enCurso: number; backlog: number };
type SinClasificar = { assignee: string; total: number; cerrados: number };

type Summary = {
  month: string;
  totalIssues: number;
  porCelula: CelulaAgg[];
  porPmAmbiguo: PmAmbiguo[];
  sinClasificarPorAssignee: SinClasificar[];
  nota: string;
};

type ProjectCandidate = {
  normalizedTitle: string;
  representativeTitle: string;
  keys: string[];
  count: number;
  stageTag: string | null;
  statusCounts: { done: number; enCurso: number; toDo: number };
};

type Candidates = {
  month: string;
  totalIssuesCrudos: number;
  totalTopLevel: number;
  totalRutina: number;
  porCelula: Record<string, ProjectCandidate[]>;
  ambiguos: { assignee: string; posibles: string[]; count: number }[];
  sinClasificar: { assignee: string; count: number }[];
  nota: string;
};

const STAGE_COLORS: Record<string, string> = {
  DISCOVERY: "#10B981",
  "DEFINICIÓN": "#3B82F6",
  DELIVERY: "#8B5CF6",
  CIERRE: "#EA5024",
  "EXPERIMENTACIÓN": "#A855F7",
  QA: "#F59E0B",
  HANDOFF: "#0EA5E9",
};

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function JiraApoyoPage() {
  const isEmbedded = useIsEmbedded();
  const [month, setMonth] = useState(currentMonth());
  const [data, setData] = useState<Summary | null>(null);
  const [candidates, setCandidates] = useState<Candidates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/jira/monthly-summary?month=${month}`).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Error al consultar Jira");
        return json;
      }),
      fetch(`/api/jira/project-candidates?month=${month}`).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Error al consultar Jira");
        return json;
      }),
    ])
      .then(([summary, cand]) => {
        setData(summary);
        setCandidates(cand);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [month]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <a href="/proyectos/monthly-update" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            ← Monthly update
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Apoyo Jira</span>
        </header>
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Apoyo para armar el reporte — actividad cruda de Jira
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
            Esto <strong>no reemplaza</strong> el monthly update: cuenta issues de Jira (Stories + Tasks + Sub-tasks) por PM,
            no &quot;proyectos&quot; deduplicados. Úsalo como punto de partida para armar los números curados de{" "}
            <a href="/proyectos/monthly-update" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}>monthly-update/data</a>,
            no los copies directo.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Mes:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
          />
        </div>

        {loading && <div style={{ fontSize: 13, color: "var(--muted)" }}>Consultando Jira…</div>}
        {error && (
          <div style={{ ...card, borderColor: "#FCA5A5", background: "#FEF2F2", color: "#B91C1C", fontSize: 13 }}>
            {error}
          </div>
        )}

        {candidates && !loading && (
          <>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {candidates.totalIssuesCrudos} issues crudos → {candidates.totalTopLevel} sin sub-tasks → {candidates.totalRutina} filtrados por operativos (reuniones, dailies, planning) → candidatos a proyecto abajo.
            </div>

            <div>
              <div style={sectionTitle}><span style={dotStyle} />Candidatos a proyecto por célula</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Object.entries(candidates.porCelula).map(([celula, items]) => (
                  <CelulaCandidatos key={celula} celula={celula} items={items} />
                ))}
              </div>
            </div>
          </>
        )}

        {data && !loading && (
          <>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {data.totalIssues} issues actualizados en {data.month} · {data.nota}
            </div>

            <div style={card}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>
                Por célula (PM inequívoco)
              </h3>
              <TablaAgg rows={data.porCelula.map((c) => ({ label: c.celula, ...c }))} />
            </div>

            {data.porPmAmbiguo.length > 0 && (
              <div style={{ ...card, borderColor: "#FDE68A", background: "#FFFBEB" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>
                  ⚠️ PMs con más de una célula — requieren tu criterio
                </h3>
                <p style={{ fontSize: 12, color: "#78350F", marginBottom: 14 }}>
                  Estos issues no se pueden asignar automáticamente porque el PM cubre 2 células. Decide tú cuánto es de cada una.
                </p>
                <TablaAgg rows={data.porPmAmbiguo.map((p) => ({ label: `${p.assignee} (${p.posibles.join(" / ")})`, ...p }))} />
              </div>
            )}

            {data.sinClasificarPorAssignee.length > 0 && (
              <div style={card}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                  Sin clasificar (assignee fuera del mapeo PM→célula)
                </h3>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
                  Devs, QA u otros roles — normalmente no cuentan como &quot;proyecto de la célula&quot;, pero revisa si falta agregar algún PM nuevo a{" "}
                  <code style={{ fontSize: 11, background: "#F3F4F6", padding: "1px 5px", borderRadius: 4 }}>pm-celula-map.ts</code>.
                </p>
                <TablaAgg rows={data.sinClasificarPorAssignee.map((s) => ({ label: s.assignee, total: s.total, cerrados: s.cerrados, enCurso: 0, backlog: 0 }))} soloTotalCerrados />
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <a
                href={`${JIRA_BASE_URL}/jira/software/c/projects/PROD/boards/1267`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: ACCENT, fontWeight: 600, textDecoration: "none" }}
              >
                Ver tablero PROD en Jira ↗
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function CelulaCandidatos({ celula, items }: { celula: string; items: ProjectCandidate[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{celula}</span>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{items.length} candidatos {open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div>
          {items.map((it) => (
            <div key={it.normalizedTitle} style={{ padding: "10px 18px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>{it.representativeTitle}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {it.keys.map((k) => (
                    <a key={k} href={`${JIRA_BASE_URL}/browse/${k}`} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>{k}</a>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                {it.stageTag && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, color: "#fff", background: STAGE_COLORS[it.stageTag] ?? "#6B7280" }}>
                    {it.stageTag}
                  </span>
                )}
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {it.count} ticket{it.count !== 1 ? "s" : ""} · {it.statusCounts.done} hecho · {it.statusCounts.enCurso} en curso · {it.statusCounts.toDo} backlog
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TablaAgg({ rows, soloTotalCerrados }: { rows: { label: string; total: number; cerrados: number; enCurso: number; backlog: number }[]; soloTotalCerrados?: boolean }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>PM / Célula</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Cerrados</th>
            {!soloTotalCerrados && <th style={{ ...thStyle, textAlign: "right" }}>En curso</th>}
            {!soloTotalCerrados && <th style={{ ...thStyle, textAlign: "right" }}>Backlog</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{r.label}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>{r.total}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>{r.cerrados}</td>
              {!soloTotalCerrados && <td style={{ ...tdStyle, textAlign: "right" }}>{r.enCurso}</td>}
              {!soloTotalCerrados && <td style={{ ...tdStyle, textAlign: "right" }}>{r.backlog}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "8px 10px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 10px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--fg)",
};
