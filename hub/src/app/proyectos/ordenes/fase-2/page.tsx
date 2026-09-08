import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Insumo: Proyectos E2E - Rediseño modulo de Ordenes.md (carpeta Ordenes) —
// a la fecha ese documento solo contiene la guía/plantilla base del formato
// E2E, sin los campos propios de la Fase 2 llenos. El alcance de esta fase
// fue definido directamente por Diana; se documenta aquí para tenerlo
// centralizado en Darwin.

const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 700,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "22px 24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  marginBottom: 20,
};

const sectionHeading: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "var(--fg)",
  marginBottom: 14,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 6,
};

const body: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  color: "var(--fg)",
};

const pending = <span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente de definir</span>;

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <div style={sectionHeading}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={label}>{term}</div>
      <div style={body}>{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ ...body, margin: 0, paddingLeft: 18 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function OrdenesFase2Page() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Órdenes · Fase 2"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="ordenes"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/proyectos/ordenes"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver a Órdenes
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Experience</span>
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Fase 2</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-002</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Fase 2
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            Filtros, tabs de estados y rediseño de tablas y cards de pedidos
          </p>
        </div>

        <Section icon="📌" title="Objetivo de la Fase">
          <Field term="Descripción">
            Mejorar la visualización y navegación de los pedidos dentro del módulo de órdenes, dando a los usuarios formas más rápidas de filtrar, segmentar por estado y leer la información de cada pedido.
          </Field>
        </Section>

        <Section icon="🎯" title="Alcance">
          <Field term="Incluye">
            <List items={[
              "Implementación de filtros para la búsqueda y segmentación de pedidos.",
              "Tabs de estados para navegar los pedidos según su etapa.",
              "Rediseño de las tablas donde se visualizan los pedidos.",
              "Rediseño de las cards donde se visualizan los pedidos.",
            ]} />
          </Field>
          <Field term="No incluye">{pending}</Field>
        </Section>

        <Section icon="📚" title="Documentación">
          <Field term="Documento fuente">Proyectos E2E - Rediseño modulo de Ordenes.md (carpeta Ordenes) — sin campos propios de esta fase llenos todavía.</Field>
          <Field term="Figma / Prototipos">{pending}</Field>
        </Section>

        <Section icon="🗓️" title="Estado">
          <Field term="Estado actual">{pending}</Field>
          <Field term="Próximos pasos">{pending}</Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
