"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { REGISTRY, SEMANAS, CURRENT } from "./data/index";
import type { MetricGroup, Oportunidad, Dolor, ProximoPaso, HeroChip } from "./data/types";

// ─── Componente principal ──────────────────────────────────────────────────────
export default function WeeklyPage() {
  const [selectedDate, setSelectedDate] = useState(CURRENT);
  const [ttvData, setTtvData] = useState<Record<string, string>>({});

  const data = REGISTRY[selectedDate] ?? REGISTRY[CURRENT];
  const isCurrentWeek = selectedDate === CURRENT;

  useEffect(() => {
    if (!isCurrentWeek) { setTtvData({}); return; }
    fetch("/api/metrics/behavior?country=ALL")
      .then((r) => r.json())
      .then((d) => {
        const stats = d?.stats || {};
        const funnel: { count: number }[] = d?.funnel || [];
        const total = stats.totalSuppliers ?? funnel[0]?.count ?? 0;
        const conOrden = funnel[2]?.count ?? 0;
        const activationRate = total > 0 ? ((conOrden / total) * 100).toFixed(1) : "–";
        setTtvData({
          registrados: total.toLocaleString("es-CO"),
          activacion: `${activationRate}%`,
          sesiones: stats.avgSessions != null ? stats.avgSessions.toFixed(1) : "–",
          churnSesiones: stats.churnRate != null ? `${stats.churnRate}%` : "–",
          churnActivacion: stats.activationChurnRate != null ? `${stats.activationChurnRate}%` : "–",
        });
      })
      .catch(() => {});
  }, [isCurrentWeek]);

  // Inyectar datos live en TTV si es la semana actual
  const proyectos: Oportunidad[] = data.oportunidades.map((op) => {
    if (!op.ttvLive || !isCurrentWeek || Object.keys(ttvData).length === 0) return op;
    return {
      ...op,
      metricas: {
        ...op.metricas,
        base: [
          { label: "Registrados (Userpilot)", value: ttvData.registrados, sub: "Total en plataforma", tooltip: op.metricas.base[0]?.tooltip },
          { label: "Tasa de activación", value: ttvData.activacion, sub: "% con ≥1 orden", tooltip: op.metricas.base[1]?.tooltip },
          { label: "Churn sesiones", value: ttvData.churnSesiones, sub: "Sin actividad 15+ días", tooltip: op.metricas.base[2]?.tooltip },
          { label: "Churn activación", value: ttvData.churnActivacion, sub: "Sin orden consolidada", tooltip: op.metricas.base[3]?.tooltip },
        ],
      },
    };
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 16mm 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          header { display: none !important; }
          main { background: #fff !important; }
          .no-print { display: none !important; }
          h1 { font-size: 24px !important; }
          h2 { font-size: 15px !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Weekly · Supplier Success</span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {SEMANAS.length > 1 && (
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                fontSize: 12, fontWeight: 600, color: "var(--fg)",
                border: "1px solid var(--border)", borderRadius: 8,
                padding: "5px 10px", background: "#fff", cursor: "pointer",
              }}
            >
              {SEMANAS.map((s) => (
                <option key={s.date} value={s.date}>{s.label}</option>
              ))}
            </select>
          )}
          <span style={{
            fontSize: 11, fontWeight: 700,
            background: isCurrentWeek ? "#FFF3E0" : "#F3F4F6",
            color: isCurrentWeek ? "#C05600" : "#6B7280",
            padding: "4px 10px", borderRadius: 999,
          }}>
            {isCurrentWeek ? "✦ Esta semana" : "Archivo"} · {data.week}
          </span>
          <button
            onClick={() => window.print()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 700,
              background: "#111827", color: "#fff",
              border: "none", borderRadius: 8,
              padding: "7px 14px", cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar PDF
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #111827 0%, #1f2937 55%, #c2410c 100%)",
          borderRadius: 20, padding: "40px", marginBottom: 28, color: "#fff",
        }}>
          <div style={{
            display: "inline-flex", background: "rgba(255,255,255,0.12)",
            borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 700, marginBottom: 16,
          }}>
            {data.heroBadge}
          </div>
          <h1 style={{
            fontSize: "clamp(26px,4vw,42px)", fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 14px",
            whiteSpace: "pre-line",
          }}>
            {data.heroTitle}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, margin: 0 }}>{data.subtitle}</p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12, marginTop: 28,
          }}>
            {data.heroStrip.map((m: HeroChip) => (
              <div key={m.label} style={{
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.10)",
                borderRadius: 14, padding: "14px 16px",
              }}>
                <span style={{ display: "block", color: "rgba(255,255,255,0.68)", fontSize: 11, fontWeight: 800 }}>{m.label}</span>
                <strong style={{ display: "block", fontSize: 26, letterSpacing: "-0.04em", marginTop: 4 }}>{m.value}</strong>
                <small style={{ display: "block", color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 700, marginTop: 2 }}>{m.sub}</small>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sección 1: Proyectos ── */}
        <Section title="1. Proyectos activos · avances y métricas" badge="Gerencial"
          sub="Estado, avance semanal y métricas base / objetivo / seguimiento por proyecto.">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {proyectos.map((op) => (
              <ProyectoCard key={op.code} op={op} />
            ))}
          </div>
        </Section>

        {/* ── Sección 2: Dolores ── */}
        {data.dolores && data.dolores.length > 0 && (
          <Section title="2. Dolores de Comercial · indexados y cerrados" badge="Clasificados"
            sub="Cada dolor queda indexado a un proyecto existente o a una ruta concreta.">
            <DoloresTable dolores={data.dolores} />
          </Section>
        )}

        {/* ── Sección 3: Resumen ejecutivo ── */}
        <Section title="3. Resumen ejecutivo" badge="Cierre">
          <div style={{
            borderLeft: "4px solid var(--dropi)", background: "#FFFBF5",
            borderRadius: "0 14px 14px 0", padding: "20px 24px",
            fontSize: 14, color: "#374151", lineHeight: 1.7,
          }} dangerouslySetInnerHTML={{ __html: data.resumen }} />
        </Section>

        {/* ── Sección 4: Próximos pasos ── */}
        <Section title="4. Próximos pasos" badge="Secuencia">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {data.proximosPasos.map((p: ProximoPaso) => (
              <div key={p.titulo} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderTop: `4px solid ${p.color}`, borderRadius: 14, padding: 18,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>{p.titulo}</h3>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {p.items.map((it) => (
                    <li key={it} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, lineHeight: 1.4 }}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 32 }}>
          Dropi · Supplier Success · {data.week}
        </p>
      </div>
    </main>
  );
}

// ─── ProyectoCard ─────────────────────────────────────────────────────────────
function ProyectoCard({ op }: { op: Oportunidad }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderLeft: `4px solid ${op.color}`, borderRadius: 14,
    }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16, padding: "18px 20px", alignItems: "start",
      }}>
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, background: `${op.color}18`, color: op.color, padding: "3px 9px", borderRadius: 999 }}>{op.code}</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: `${op.badgeColor}18`, color: op.badgeColor, padding: "2px 7px", borderRadius: 999 }}>{op.badge}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6, lineHeight: 1.3 }}>{op.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{op.status}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Avance esta semana</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, marginBottom: 10 }}>{op.avance}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ l: "Mueve", v: op.mueve }, { l: "Hipótesis", v: op.hipotesis }].map(m => (
              <div key={m.l} style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", flex: "1 1 120px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.l}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)", marginTop: 3, lineHeight: 1.3 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: `${op.color}0d`, border: `1px solid ${op.color}30`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: op.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Siguiente paso</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{op.next}</div>
        </div>
      </div>

      {/* Franja de métricas */}
      <div style={{
        borderTop: "1px solid var(--border)", background: "#FAFBFC",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        borderRadius: "0 0 14px 14px", overflow: "hidden",
      }}>
        {[
          { grupo: "Base · AS-IS hoy", items: op.metricas.base, color: "#6B7280", bg: "#F3F4F6" },
          { grupo: "Meta · Objetivo", items: op.metricas.meta, color: op.color, bg: `${op.color}0a` },
          { grupo: "Seguimiento · Qué medimos", items: op.metricas.seguimiento, color: "#374151", bg: "#fff" },
        ].map((g, gi) => (
          <div key={g.grupo} style={{ padding: "14px 16px", borderLeft: gi > 0 ? "1px solid var(--border)" : "none", background: g.bg, overflow: "visible" }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: g.color, marginBottom: 10 }}>{g.grupo}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {g.items.map((m: MetricGroup) => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#6B7280", flexShrink: 0, display: "flex", alignItems: "center" }}>
                    {m.label}
                    {m.tooltip && <MetricTooltip text={m.tooltip} />}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: gi === 1 ? g.color : "var(--fg)" }}>{m.value}</span>
                    {m.sub && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{m.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DoloresTable ─────────────────────────────────────────────────────────────
function DoloresTable({ dolores }: { dolores: Dolor[] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 14 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: 800 }}>
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {["Frente / dolor", "Qué salió", "Ruta definida", "Métrica", "Decisión"].map((h) => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid var(--border)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dolores.map((d, i) => (
            <tr key={i} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
              <td style={{ padding: "14px", verticalAlign: "top", minWidth: 160 }}>
                <strong style={{ fontSize: 13, color: "var(--fg)", display: "block", marginBottom: 6 }}>{d.frente}</strong>
                <span style={{ fontSize: 10, fontWeight: 800, background: `${d.tagColor}15`, color: d.tagColor, padding: "3px 8px", borderRadius: 999 }}>{d.tag}</span>
              </td>
              <td style={{ padding: "14px", fontSize: 12, color: "var(--muted)", verticalAlign: "top", minWidth: 180 }}>{d.salio}</td>
              <td style={{ padding: "14px", verticalAlign: "top", minWidth: 160 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: `${d.rutaColor}15`, color: d.rutaColor, padding: "4px 9px", borderRadius: 999, display: "inline-block" }}>{d.ruta}</span>
              </td>
              <td style={{ padding: "14px", fontSize: 12, color: "var(--muted)", verticalAlign: "top", minWidth: 160 }}>{d.metrica}</td>
              <td style={{ padding: "14px", fontSize: 12, color: "var(--fg)", fontWeight: 600, verticalAlign: "top", minWidth: 160 }}>{d.decision}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── MetricTooltip ────────────────────────────────────────────────────────────
function MetricTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, above: true });
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const above = r.top > 220;
      setPos({
        top: above ? r.top - 8 : r.bottom + 8,
        left: Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160),
        above,
      });
    }
    setOpen(true);
  };

  const tooltip = open && typeof document !== "undefined" ? createPortal(
    <div style={{
      position: "fixed", top: pos.top, left: pos.left,
      transform: pos.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
      background: "#1F2937", color: "#F9FAFB",
      borderRadius: 12, padding: "12px 16px",
      fontSize: 11.5, lineHeight: 1.7, width: 300, zIndex: 9999,
      boxShadow: "0 12px 32px rgba(0,0,0,0.4)", whiteSpace: "pre-wrap", pointerEvents: "none",
    }}>
      {text}
      <div style={{
        position: "absolute",
        ...(pos.above ? { top: "100%", borderTop: "7px solid #1F2937" } : { bottom: "100%", borderBottom: "7px solid #1F2937" }),
        left: "50%", transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
      }} />
    </div>,
    document.body
  ) : null;

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4 }}
      onMouseEnter={handleEnter} onMouseLeave={() => setOpen(false)}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 14, height: 14, borderRadius: "50%",
        background: "#E5E7EB", color: "#6B7280",
        fontSize: 9, fontWeight: 800, cursor: "help", flexShrink: 0,
      }}>i</span>
      {tooltip}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ title, badge, sub, children }: {
  title: string; badge?: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 18, padding: 24, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{title}</h2>
          {sub && <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{sub}</p>}
        </div>
        {badge && (
          <span style={{ fontSize: 11, fontWeight: 700, background: "#FFF3E0", color: "#C05600", padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}
