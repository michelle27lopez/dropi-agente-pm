"use client";

import { useState } from "react";

const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};

const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
};

const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});

export default function GaliDemoDashboard() {
  const [docsOpen, setDocsOpen] = useState(true);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Gali - Demo</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag("#FF6102", "#FFF7F2")}>GALI-V5</span>
          <span style={tag("#3B82F6", "#EFF6FF")}>Prueba de Concepto</span>
          <span style={tag("#10B981", "#ECFDF5")}>Activa</span>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Gali · Copiloto de Selección de Productos
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Espacio de experimentación y prueba de concepto para Gali v5.
            Diseñado para mejorar la retención de los nuevos dropshippers a través de un onboarding interactivo y personalizado basado en enfoques reales de líderes de la comunidad.
          </p>
        </div>

        {/* Panel de recursos */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, overflow: "hidden",
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
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Recursos del proyecto</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>Gali v5</span>
            <span style={{ fontSize: 16, color: "var(--muted)", transition: "transform 0.2s", display: "inline-block", transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
          </button>

          {docsOpen && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px", display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="/proyectos/gali-demo/v5"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#F8FAFC", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                  flex: "1 1 200px", minWidth: 200, maxWidth: 280,
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>🦊</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>Gali - Demo (v5)</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Prototipo interactivo de Caza Productos con IA</div>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Acerca de Gali v5 card */}
        <div style={card}>
          <h2 style={sectionTitle}>Acerca de esta Prueba de Concepto</h2>
          <p style={{ ...sectionSub, marginBottom: 12 }}>
            Esta demo implementa de manera interactiva el primer paso del embudo del dropshipper:
          </p>
          <ul style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
            <li><strong>Chat Onboarding Guiado:</strong> Simulación de mentores con diálogos en español colombiano específicos para dolores de mercado, tendencias virales y marca de nicho.</li>
            <li><strong>Grilla Dividida (Split Screen):</strong> Motor interactivo de búsqueda sobre base de 400 productos reales simulando 1,000,000 de variantes.</li>
            <li><strong>Análisis Financiero & Pauta:</strong> Comparación de proveedores (tasa de entrega, flete, stock) y presupuesto dinámico para campañas.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
