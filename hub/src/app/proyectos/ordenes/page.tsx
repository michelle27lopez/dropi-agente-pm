import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import WeeklySelector from "../seguimiento/WeeklySelector";
import RoadmapGantt from "../seguimiento/RoadmapGantt";

// Estructura: Promp/Documento de Seguimiento.md (misma plantilla que Rearquitectura)
// Insumo: Ordenes/Proyectos E2E - Rediseño modulo de Ordenes.md — documento
// aún sin campos propios del proyecto llenos (solo la guía/plantilla base),
// por eso varios campos quedan "Pendiente de definir".

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

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const td: React.CSSProperties = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "top",
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

const metric: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "12px 14px",
};

export default function OrdenesPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Órdenes · Rediseño del módulo de Órdenes"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="ordenes"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        {/* Breadcrumb & title */}
        <div style={{ marginBottom: 20 }}>
          <a
            href="/celula/experience"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver a Célula Experience
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Experience</span>
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Delivery · En definición</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-002</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Rediseño del módulo de Órdenes
          </h1>
        </div>

        {/* 🎯 Objetivos Macro */}
        <Section icon="🎯" title="Objetivos Macro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Target">Dropshippers activos que gestionan órdenes — ~6.000 usuarios activos diarios (Fase 1 · MVP).</Field>
            <Field term="Adopción">{pending}</Field>
            <Field term="Retención">50% de usuarios que reutilizan una nueva funcionalidad del MVP en 30 días (meta Fase 1).</Field>
            <Field term="Satisfacción (NPS/CSAT)">&gt;80% de respuestas "Como esperaba" o mejor (meta Fase 1).</Field>
          </div>
        </Section>

        {/* 📌 Definición del Proyecto */}
        <Section icon="📌" title="Definición del Proyecto">
          <Field term="Descripción">
            Rediseño del módulo de órdenes.
          </Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Enlaces clave</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 260 }}>📄 Documento de Lanzamiento (Kickoff)</td>
                  <td style={td}>
                    <a href="https://docs.google.com/document/d/1SZ72iVSs3uILPSm9XBGH2y96NNxLmNe979A8V_tMMYY/edit?tab=t.jgkvmdz5t5fg#heading=h.i2ccblcxh8ao" target="_blank" rel="noreferrer" style={{ color: "var(--dropi)", fontWeight: 700 }}>
                      Documento de Kickoff
                    </a>
                    {" "}(Proyectos E2E - Rediseño modulo de Ordenes.md, carpeta Ordenes)
                  </td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700 }}>📊 Archivos / Hojas de Cálculo (Excel)</td>
                  <td style={td}>{pending}</td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎫 Tarea principal o Épica en Jira</td>
                  <td style={{ ...td, borderBottom: "none" }}>{pending}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 👥 Equipo del Proyecto */}
        <Section icon="👥" title="Equipo del Proyecto">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 220 }}>Product Manager (PM)</td>
                <td style={td}>Diana Aldana</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>UX/UI Designer</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Frontend Developer</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Tecnología Growth</td>
                <td style={{ ...td, borderBottom: "none" }}>{pending}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 📚 Documentación & Assets UX/UI */}
        <Section icon="📚" title="Documentación & Assets UX/UI">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 260 }}>🔬 Archivos de Research</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>📐 Service Blueprint</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>👤 User Personas</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>🔀 Flujos de usuario (User Flows)</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>🎨 Figma v1.0 (Exploración)</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎨 Figma v2.0 (Handoff / Producción)</td>
                <td style={{ ...td, borderBottom: "none" }}>{pending}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 🗺️ Roadmap */}
        <Section icon="🗺️" title="Roadmap">
          <RoadmapGantt
            axisStart="2026-06"
            axisEnd="2026-12"
            fases={[
              {
                nombre: "Fase 1 · MVP Órdenes 2.0",
                estado: "bloqueada",
                inicio: "2026-06",
                fin: "2026-09",
                detalle: "Importación, exportación, etiquetas y optimización de creación manual de órdenes. Mapeada desde junio 2026, handoff a desarrollo el 2 de julio de 2026; piloto de seguimiento de 12 semanas bloqueado hasta contar con recurso de Tecnología.",
                href: "/proyectos/ordenes/fase-1",
                bloqueo: "Bloqueado hasta contar con recurso de Tecnología",
              },
              {
                nombre: "Fase 2",
                estado: "proxima",
                inicio: "2026-10",
                fin: "2026-11",
                detalle: "Implementación de filtros, tabs de estados y rediseño de las tablas y cards donde se visualizan los pedidos. En definición: consolidando la matriz de hallazgos y oportunidades.",
                href: "/proyectos/ordenes/fase-2",
              },
              {
                nombre: "Fase 3 · Proveedores",
                estado: "proxima",
                inicio: "2026-11",
                fin: "2026-12",
                detalle: "Ajustes de órdenes de proveedores.",
                href: "/proyectos/ordenes/fase-3",
              },
            ]}
            nota="Fechas estimadas a partir del estado reportado en el Weekly Status más reciente (semana del 25 de agosto de 2026). Se ajustan cuando el equipo confirme fechas exactas."
          />
        </Section>

        {/* 🗓️ Weekly Status */}
        <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)">
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <WeeklySelector />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field term="Resumen de la semana">
              Prioridad P1 · Delivery en DEV. Pendiente: pruebas del módulo de etiquetas. Se realizará un research con proveedores para validar las funcionalidades que quieren ver en el módulo de Órdenes.
            </Field>
            <Field term="Retos y Bloqueos">🚨 Bloqueado por falta de asignación de un desarrollador.</Field>
          </div>
        </Section>

        {/* 📊 Métricas de Seguimiento */}
        <Section icon="📊" title="Métricas de Seguimiento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 1</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Pendiente de definir</div>
            </div>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 2</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Pendiente de definir</div>
            </div>
          </div>
          <Field term="Comentarios de rendimiento">{pending}</Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
