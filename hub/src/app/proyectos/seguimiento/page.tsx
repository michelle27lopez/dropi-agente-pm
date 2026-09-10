import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import SeguimientoContent from "./SeguimientoContent";

export default function SeguimientoPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Seguimiento de Proyectos · Célula Design Ops"
        subtitle="Rearquitectura · Órdenes · Dropi App · Búsqueda semántica · Dashboard de indicadores · TARS"
        currentSlug="seguimiento"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/celula/design-ops"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver a Célula Design Ops
          </a>
        </div>

        <SeguimientoContent />
      </main>

      <HubFooter />
    </div>
  );
}
