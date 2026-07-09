export default function HubFooter() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--card)",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>
        Darwin · hub interno de células
      </span>
      <a
        href="/guias"
        style={{
          fontSize: 12, fontWeight: 700,
          color: "var(--dropi)",
          textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        📚 Guías
      </a>
    </footer>
  );
}
