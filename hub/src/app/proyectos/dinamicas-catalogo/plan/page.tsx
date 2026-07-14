export default function PlanPage() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "12px 24px", display: "flex", alignItems: "center",
        gap: "16px", flexShrink: 0,
      }}>
        <a href="/proyectos/dinamicas-catalogo" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Campañas
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Plan de campañas</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: "var(--dropi)",
          background: "var(--dropi-l)", border: "1px solid rgba(247,127,0,.2)",
          padding: "2px 8px", borderRadius: 20,
        }}>
          9 campañas · 6 meses
        </span>
      </header>
      <iframe
        src="/prototipos/dinamicas-catalogo/plan-campanas.html"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Plan de Campañas — Dinámicas de Catálogo"
      />
    </main>
  );
}
