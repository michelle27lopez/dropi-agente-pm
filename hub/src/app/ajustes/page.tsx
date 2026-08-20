export default function AjustesPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Configuración</h1>

      <a
        href="/celulas"
        className="hub-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 32,
          padding: "16px 20px",
          border: "1px solid var(--border)",
          borderRadius: 12,
          maxWidth: 360,
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: 20 }}>🧬</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>Células</p>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Gestión de células del hub</p>
        </div>
      </a>
    </main>
  );
}
