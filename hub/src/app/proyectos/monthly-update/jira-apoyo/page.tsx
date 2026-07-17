"use client";

import { useEffect, useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";

const ACCENT = "#F77F00";
const JIRA_BASE_URL = "https://dropi-it.atlassian.net";

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
  padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function JiraApoyoPage() {
  const isEmbedded = useIsEmbedded();
  const [month, setMonth] = useState(currentMonth());
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/jira/monthly-summary?month=${month}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Error al consultar Jira");
        setData(json);
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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
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
