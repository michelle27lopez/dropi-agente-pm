import Breadcrumb from "@/components/Breadcrumb";

export default function Informe11Junio2026Page() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexShrink: 0,
      }}>
        <Breadcrumb items={[{ label: "Informes" }, { label: "1:1 · Junio 2026" }]} />
        <span style={{
          marginLeft: "auto", fontSize: 11, fontWeight: 600,
          color: "#7C3AED", background: "#7C3AED15",
          padding: "3px 10px", borderRadius: 20,
        }}>
          Personal · Confidencial
        </span>
      </header>

      {/* Iframe */}
      <iframe
        src="/informes/1-1-junio-2026.html"
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Un mes en el radar — Informe 1:1 Michelle, Junio 2026"
      />
    </main>
  );
}
