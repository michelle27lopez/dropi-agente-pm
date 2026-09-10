import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Fase 3 · Proveedores — ajustes de órdenes de proveedores. Aún no hay un
// documento de especificaciones cargado; esta página queda lista con la
// estructura para completarse en cuanto se defina el alcance detallado.

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

const FASE_COLOR: Record<string, [string, string]> = {
  "Fase 1": ["#B91C1C", "#FEE2E2"],
  "Fase 2": ["#C2570A", "#FFEDD5"],
  "Fase 3": ["#A16207", "#FEF9C3"],
};

function FaseTag({ fase }: { fase: string }) {
  const [color, bg] = FASE_COLOR[fase] ?? ["#374151", "#F3F4F6"];
  return <span style={{ ...badgeStyle(color, bg), marginRight: 4 }}>{fase}</span>;
}

const BACKLOG: { proyecto: string; fases: string[]; implementado: string }[] = [
  { proyecto: "Panel de órdenes vista Tabla", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Panel de órdenes vista Card", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Importar órdenes (Refactor)", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Exportar orden por fila (refactor)", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Crear pedido", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Rango de Fecha (Date picker)", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Filtros avanzados", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Guardar Filtros", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Buscador y pin llave", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Notificaciones en Órdenes", fases: ["Fase 1", "Fase 2"], implementado: "Not Started" },
  { proyecto: "Etiquetas", fases: ["Fase 2"], implementado: "Not Started" },
  { proyecto: "Detalle de la orden", fases: ["Fase 2"], implementado: "Not Started" },
  { proyecto: "Ordenar por", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Selección masiva", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Filtro Proveeduría y orden propia", fases: ["Fase 1"], implementado: "Not Started" },
  { proyecto: "Impresión masiva de guías (Mejora)", fases: ["Fase 2"], implementado: "Not Started" },
  { proyecto: "Diferenciación bodega fulfillment y propia", fases: ["Fase 3"], implementado: "Not Started" },
  { proyecto: "Tiempo de entrega y tiempo de gestión", fases: ["Fase 1"], implementado: "Not Started" },
];

export default function OrdenesFase3Page() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Órdenes · Fase 3 (Proveedores)"
        subtitle="Célula Design Ops · PO: Diana Aldana"
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
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Design Ops</span>
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Fase 3 · Proveedores</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-002</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Fase 3 · Proveedores
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            Ajustes de órdenes de proveedores
          </p>
        </div>

        <Section icon="📌" title="Objetivo de la Fase">
          <Field term="Descripción">
            Ajustes en el módulo de órdenes enfocados en el flujo de proveedores. {pending} — especificar el problema puntual a resolver y el resultado esperado.
          </Field>
        </Section>

        <Section icon="🎯" title="Alcance">
          <Field term="Incluye">{pending}</Field>
          <Field term="No incluye">{pending}</Field>
        </Section>

        <Section icon="📋" title="Backlog de Funcionalidades por Fase">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid var(--border)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Proyecto</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid var(--border)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Fase</th>
                  <th style={{ textAlign: "left", padding: "10px", borderBottom: "2px solid var(--border)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Implementado</th>
                </tr>
              </thead>
              <tbody>
                {BACKLOG.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>{row.proyecto}</td>
                    <td style={{ padding: "10px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                      {row.fases.map((f) => <FaseTag key={f} fase={f} />)}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid var(--border)" }}>
                      <span style={badgeStyle("#4B5563", "#F3F4F6")}>{row.implementado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon="📚" title="Documentación">
          <Field term="Documento fuente">{pending} — aún no hay un documento de especificaciones cargado para esta fase.</Field>
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
