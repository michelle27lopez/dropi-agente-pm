"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsEmbedded } from "@/lib/use-is-embedded";
import { snapshot } from "./data/2026-06";
import type { CelulaDetail, ComparativoRow } from "./data/types";

const JIRA_BOARD_URL = "https://dropi-it.atlassian.net/jira/software/c/projects/PROD/boards/1267";

const ACCENT = "#F77F00"; // var(--dropi)
const ACCENT_BG = "#FFF3E0";

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
  padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});

const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "var(--fg)",
  display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
};

const dotStyle: React.CSSProperties = {
  width: 8, height: 8, borderRadius: "50%", background: ACCENT, display: "inline-block",
};

type Tab = "resumen" | "comp" | "updates";

export default function MonthlyUpdatePage() {
  const isEmbedded = useIsEmbedded();
  const [tab, setTab] = useState<Tab>("resumen");

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            ← Dropi PM Tools
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Monthly update</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={tag(ACCENT, ACCENT_BG)}>PD-001</span>
            <span style={tag("#6366F1", "#EEF2FF")}>{snapshot.monthLabel}</span>
            <a href="/proyectos/monthly-update/jira-apoyo" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>
              Apoyo Jira →
            </a>
          </div>
        </header>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginBottom: 4, letterSpacing: "-0.02em" }}>
            Dashboard Product Design
          </h1>
          <p style={{ fontSize: 14, color: ACCENT, fontWeight: 600 }}>
            Reporte de Cierre — {snapshot.monthLabel}
          </p>
        </div>

        <Tabs tab={tab} setTab={setTab} />

        {tab === "resumen" && <ResumenTab />}
        {tab === "comp" && <ComparativoTab />}
        {tab === "updates" && <UpdatesTab />}

        <div style={{ textAlign: "center", padding: "20px 0 4px", borderTop: "1px solid var(--border)", marginTop: 8 }}>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>
            {snapshot.fuente} · Tablero{" "}
            <a href={JIRA_BOARD_URL} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}>
              PROD en Jira ↗
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

function Tabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "resumen", label: "Resumen Junio" },
    { id: "comp", label: "Histórico" },
    { id: "updates", label: "Actualizaciones del Equipo" },
  ];
  return (
    <div style={{
      display: "flex", gap: 4, background: "#F3F4F6", border: "1px solid var(--border)",
      borderRadius: 12, padding: 4, width: "fit-content",
    }}>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => setTab(it.id)}
          style={{
            padding: "9px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "none",
            background: tab === it.id ? ACCENT : "transparent",
            color: tab === it.id ? "#fff" : "var(--muted)",
            boxShadow: tab === it.id ? "0 4px 12px rgba(247,127,0,.28)" : "none",
            transition: "all .15s",
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

// ─── Tab: Resumen ─────────────────────────────────────────────────────────────

function ResumenTab() {
  const { kpis, cicloCompletoNota, cicloCompletoItems, cicloCompletoPromedio, experimentacion, statusDistribution, handoffsPorCelula, celulasDetail, mejorasMetodologia } = snapshot;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ ...card, padding: 18, borderColor: k.accent ? ACCENT : "var(--border)" }}>
            <div style={{ fontSize: 20, marginBottom: 10, color: k.accent ? ACCENT : "var(--fg)" }}>{k.icon}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.accent ? ACCENT : "var(--fg)" }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{k.sub}</div>
            {k.subExtra && <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600, marginTop: 2 }}>{k.subExtra}</div>}
          </div>
        ))}
      </div>

      {/* Cycle time callout */}
      <div style={{ ...card, borderLeft: `3px solid ${ACCENT}`, padding: "14px 18px", fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
        ℹ️ <strong style={{ color: "var(--fg)" }}>Ciclo completo:</strong> {cicloCompletoNota}
        <br />
        {cicloCompletoItems.map((item) => (
          <span key={item.proyecto}>
            • {item.proyecto}: {item.dias} días ({item.fechas}) · <strong style={{ color: "var(--fg)" }}>{item.sprints.toFixed(1)} sprints</strong>
            <br />
          </span>
        ))}
        {cicloCompletoPromedio}
      </div>

      {/* Experiment callout */}
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 18, background: "#FAF5FF", borderColor: "#E9D5FF" }}>
        <div style={{ fontSize: 26 }}>🧪</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A855F7" }}>
            Experimentación Activa
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: "3px 0" }}>{experimentacion.titulo}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{experimentacion.desc}</div>
        </div>
        <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#A855F7" }}>{experimentacion.numExperimentos}</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Experimentos</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#A855F7" }}>{experimentacion.numCelulas}</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Células</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>Distribución Global por Estado</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusDistribution.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} proyectos`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            {statusDistribution.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted)" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>Hand-offs por Célula</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={handoffsPorCelula}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="celula" tick={{ fontSize: 10, fill: "var(--muted)" }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted)" }} />
                <Tooltip formatter={(value) => [`${value} handoffs`, ""]} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {handoffsPorCelula.map((h, i) => <Cell key={i} fill={h.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Célula cards */}
      <div>
        <div style={sectionTitle}><span style={dotStyle} />Detalle por Célula</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {celulasDetail.map((c) => <CelulaCard key={c.celula} celula={c} />)}
        </div>
      </div>

      {/* Mejoras metodología */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: ACCENT, fontSize: 16 }}>⚠️</span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>Por mejorar de la metodología</h3>
        </div>
        {mejorasMetodologia.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < mejorasMetodologia.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: ACCENT, flexShrink: 0, marginTop: 4 }} />
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{m}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CelulaCard({ celula: c }: { celula: CelulaDetail }) {
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden", borderTop: `4px solid ${c.color}` }}>
      <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.celula}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{c.pm}</div>
      </div>
      <div style={{ padding: "10px 18px" }}>
        {c.rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < c.rows.length - 1 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 18px 6px" }}>
        <div style={{ ...tag(c.badgeColor, c.badgeBg), fontSize: 10, padding: "6px 12px", borderRadius: 8, display: "block", textAlign: "center" }}>
          {c.badge}
        </div>
      </div>
      {c.experimentos && (
        <div style={{ padding: "0 18px 14px" }}>
          <span style={tag("#A855F7", "rgba(168,85,247,.1)")}>{c.experimentos}</span>
        </div>
      )}
      {c.dedupNote && (
        <div style={{ padding: "0 18px 12px", fontSize: 10, color: "var(--muted)" }}>{c.dedupNote}</div>
      )}
    </div>
  );
}

// ─── Tab: Comparativo (Histórico) ──────────────────────────────────────────────

function ComparativoTab() {
  const { comparativoMeses, comparativoGlobal, comparativoCelulas, novedades } = snapshot;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 700 }}>
          {comparativoMeses.map((m, i) => (
            <span key={m} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: i === comparativoMeses.length - 1 ? "var(--fg)" : "var(--muted)" }}>{m}</span>
              {i < comparativoMeses.length - 1 && <span style={{ color: ACCENT, fontSize: 13 }}>→</span>}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", borderLeft: "1px solid var(--border)", paddingLeft: 14 }}>
          Evolución de métricas clave del equipo de Product Design · Q2 2026
        </div>
      </div>

      {/* Global comparativo table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 90px", padding: "10px 18px", background: "#FAFBFC", borderBottom: "1px solid var(--border)" }}>
          {["Métrica", "Abril", "Mayo", "Junio", "Δ May→Jun"].map((h, i) => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", textAlign: i === 0 ? "left" : "center" }}>{h}</span>
          ))}
        </div>
        {comparativoGlobal.map((row, i) => (
          <ComparativoRowView key={row.metrica} row={row} last={i === comparativoGlobal.length - 1} />
        ))}
      </div>

      {/* Per-cell comparison */}
      <div>
        <div style={sectionTitle}><span style={dotStyle} />Células comunes — {comparativoMeses.join(" · ")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {comparativoCelulas.map((cc) => (
            <div key={cc.celula} style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: `2px solid ${cc.color}` }}>
                <span style={{ color: cc.color, fontSize: 13, fontWeight: 700 }}>{cc.celula}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "8px 16px", background: "#FAFBFC", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Métrica</span>
                <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, textAlign: "center" }}>Abr</span>
                <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, textAlign: "center" }}>May</span>
                <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, textAlign: "center" }}>Jun</span>
              </div>
              {cc.rows.map((r, i) => (
                <div key={r.metrica} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "8px 16px", borderBottom: i < cc.rows.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{r.metrica}</span>
                  <span style={{ fontSize: 12, color: "var(--fg)", textAlign: "center" }}>{r.abril}</span>
                  <span style={{ fontSize: 12, color: "var(--fg)", textAlign: "center" }}>{r.mayo}</span>
                  <span style={{ fontSize: 12, color: "var(--fg)", fontWeight: 700, textAlign: "center" }}>{r.junio}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Novedades */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: ACCENT }}>⚡</span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>Novedades de Junio vs Mayo</h3>
        </div>
        {novedades.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < novedades.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparativoRowView({ row, last }: { row: ComparativoRow; last: boolean }) {
  const deltaColor = row.direction === "up" ? "#16A34A" : row.direction === "down" ? "#DC2626" : "var(--muted)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 90px", padding: "12px 18px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 13, color: "var(--fg)" }}>{row.metrica}</div>
        {row.nota && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{row.nota}</div>}
      </div>
      <div style={{ fontSize: 13, textAlign: "center", color: "var(--muted)", alignSelf: "center" }}>{row.abril}</div>
      <div style={{ fontSize: 13, textAlign: "center", color: "var(--muted)", alignSelf: "center" }}>{row.mayo}</div>
      <div style={{ fontSize: 13, textAlign: "center", color: "var(--fg)", fontWeight: 700, alignSelf: "center" }}>{row.junio}</div>
      <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center", color: deltaColor, alignSelf: "center" }}>{row.delta}</div>
    </div>
  );
}

// ─── Tab: Actualizaciones del equipo ───────────────────────────────────────────

function UpdatesTab() {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 14 }}>
        Reflexiones del Equipo — {snapshot.monthLabel}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {snapshot.reflexiones.map((r) => (
          <div key={r.titulo} style={{ ...card, padding: 0, overflow: "hidden", borderTop: `3px solid ${r.color}` }}>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: r.color, marginBottom: 14 }}>{r.titulo}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {r.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: i < r.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ color: r.color, flexShrink: 0, marginTop: 3, fontSize: 8 }}>●</span>
                    <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
