export default function Prototipo1Page() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "12px 32px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexShrink: 0,
      }}>
        <a href="/proyectos/dinamicas-catalogo" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dinámicas de Catálogo
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Prototipo 1</span>
        <span style={{
          marginLeft: "auto", fontSize: 11, fontWeight: 600,
          color: "#0EA5E9", background: "#0EA5E915",
          padding: "3px 10px", borderRadius: 20,
        }}>
          Experimento MVP
        </span>
      </header>

      {/* Iframe */}
      <iframe
        src="/prototipos/dinamicas-catalogo/prototipo-1.html"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Prototipo 1 — Dinámicas de Catálogo"
      />
    </main>
  );
}
