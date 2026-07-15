"use client";

import { useState } from "react";

export default function TimeToValuePage() {
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Time to Value</span>
        <a
          href="/proyectos/time-to-value/discovery"
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            background: "var(--dropi, #F77F00)",
            padding: "4px 10px",
            borderRadius: 6,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          🔍 Discovery B=MAP
        </a>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "var(--dropi-light)",
              color: "var(--dropi)", padding: "3px 9px", borderRadius: 20,
            }}>
              TTV-001
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#ECFDF5",
              color: "#10B981", padding: "3px 9px", borderRadius: 20,
            }}>
              Activo
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Time to Value · Activación de Suppliers
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Experimento de activación operativa. Meta: 620 suppliers listos para vender en 6 meses.
            North Star: registro → listo para vender en ≤ 5 días.
          </p>
        </div>

        {/* Recursos del proyecto */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
        }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "14px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>
              Recursos del proyecto
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>
              TTV-001 · Time to Value
            </span>
            <span style={{
              fontSize: 16, color: "var(--muted)", transition: "transform 0.2s",
              display: "inline-block",
              transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}>
              ⌄
            </span>
          </button>

          {docsOpen && (
            <div style={{
              borderTop: "1px solid var(--border)", padding: "16px 20px",
              display: "flex", gap: 12, flexWrap: "wrap",
            }}>
              {[
                {
                  href: "/proyectos/time-to-value/asis",
                  icon: "🔍",
                  title: "Diagnóstico AS-IS",
                  sub: "Embudo real · Activación · Churn · Por país",
                },
                {
                  href: "/proyectos/time-to-value/alcance",
                  icon: "🎯",
                  title: "Alcance / Meta",
                  sub: "TOBE · Pipeline GHL · Hipótesis · KPIs",
                },
                {
                  href: "/proyectos/time-to-value/metricas",
                  icon: "📊",
                  title: "Métricas de seguimiento",
                  sub: "Dashboard · Embudo mensual · TTV",
                },
                {
                  href: "/proyectos/time-to-value/propuesta",
                  icon: "💡",
                  title: "Propuesta: Activar → Vender",
                  sub: "Auditar deja de ser la puerta",
                },
              ].map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#F8FAFC", border: "1px solid var(--border)",
                    borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                    flex: "1 1 200px", minWidth: 200, maxWidth: 260,
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{card.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{card.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Registros esperados", value: "12.000", color: "var(--dropi)" },
            { label: "Listos para vender", value: "620", color: "#10B981" },
            { label: "Promedio activación", value: "≤ 5 días", color: "#3B82F6" },
            { label: "Promedio primera orden", value: "≤ 25 días", color: "#F59E0B" },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--muted)",
                textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10,
              }}>
                {c.label}
              </div>
              <div style={{
                fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em",
                color: "var(--fg)", lineHeight: 1,
              }}>
                {c.value}
              </div>
              <div style={{
                marginTop: 12, height: 4, background: "#F3F4F6",
                borderRadius: 999, overflow: "hidden",
              }}>
                <div style={{ height: "100%", width: "100%", background: c.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/proyectos/time-to-value/metricas"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--dropi)", color: "#fff",
            borderRadius: 10, padding: "12px 20px",
            fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}
        >
          📊 Ver métricas y seguimiento →
        </a>
      </div>
    </main>
  );
}
