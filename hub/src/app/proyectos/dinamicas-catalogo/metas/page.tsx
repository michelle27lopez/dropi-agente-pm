"use client";

import { useIsEmbedded } from "@/lib/use-is-embedded";

export default function MetasPage() {
  const isEmbedded = useIsEmbedded();

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {!isEmbedded && (
        <header style={{
          background: "#161b22", borderBottom: "1px solid #30363d",
          padding: "12px 32px", display: "flex", alignItems: "center",
          gap: "16px", flexShrink: 0,
        }}>
          <a href="/proyectos/dinamicas-catalogo" style={{ fontSize: 13, color: "#8b949e", textDecoration: "none" }}>
            ← Campañas
          </a>
          <span style={{ color: "#30363d" }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>Metas del experimento</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#F77F00",
            background: "rgba(247,127,0,0.12)", border: "1px solid rgba(247,127,0,0.25)",
            padding: "2px 8px", borderRadius: 20,
          }}>
            DCA-001
          </span>
        </header>
      )}
      <iframe
        src="/prototipos/dinamicas-catalogo/metas-experimento.html"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Metas del Experimento — Dinámicas de Catálogo"
      />
    </main>
  );
}
