export default function MetasPage() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{
        background: "#161b22", borderBottom: "1px solid #30363d",
        padding: "12px 24px", display: "flex", alignItems: "center",
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
      <iframe
        src="/prototipos/dinamicas-catalogo/metas-experimento.html"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Metas del Experimento — Dinámicas de Catálogo"
      />
    </main>
  );
}
