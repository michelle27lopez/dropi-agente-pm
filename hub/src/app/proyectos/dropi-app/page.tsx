import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import WeeklySelector from "../seguimiento/WeeklySelector";
import RoadmapGantt from "../seguimiento/RoadmapGantt";

// Estructura: Promp/Documento de Seguimiento.md (plantilla de seguimiento de proyecto)
// Insumo: Dropi App/Plan Estrategico_ Dropi App (2).md — 20 mayo 2026

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

export default function DropiAppPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Dropi App · Plan Estratégico"
        subtitle="Célula Design Ops · PO: Diana Aldana"
        currentSlug="dropi-app"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        {/* Breadcrumb & title */}
        <div style={{ marginBottom: 20 }}>
          <a
            href="/celula/design-ops"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver a Célula Design Ops
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Design Ops</span>
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Delivery · En definición</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>DROP-25313</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            De Vitrina a Herramienta de Gestión de Negocio
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>Plan Estratégico · Dropi App — 20 mayo 2026</p>
        </div>

        {/* 🎯 Objetivos Macro */}
        <Section icon="🎯" title="Objetivos Macro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Target">Usuarios de la Dropi App (Dropshippers, Marcas/Emprendedores en móvil).</Field>
            <Field term="Adopción">Descargas iOS 22,486 · Android 73,686 (baseline corte 19 may 2026).</Field>
            <Field term="Retención">Ratio DAU/Descargas actual ~3.6% (problema severo) — meta numérica {pending}.</Field>
            <Field term="Satisfacción (NPS/CSAT)">{pending}</Field>
          </div>
        </Section>

        {/* 📌 Definición del Proyecto */}
        <Section icon="📌" title="Definición del Proyecto">
          <Field term="Descripción">
            La Dropi App no es una copia de la plataforma web — debe convertirse en la herramienta para gestionar el negocio desde el bolsillo (modelo Shopify Mobile), enfocada en métricas de ventas, notificaciones push inteligentes, búsqueda de productos y gestión de órdenes, para resolver el problema severo de retención actual.
          </Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Enlaces clave</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 260 }}>📄 Documento de Lanzamiento (Kick-off)</td>
                  <td style={td}>
                    Para consultar el detalle completo de la visión y alcance inicial, accede al{" "}
                    <a href="https://docs.google.com/document/d/1IBNlQN3widRjmeB77ri6aUDXh46BbRpX05ht_zSveYY/edit?usp=sharing" target="_blank" rel="noreferrer" style={{ color: "var(--dropi)", fontWeight: 700 }}>
                      Documento de Kick-off
                    </a>.
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
                <td style={td}>Kevin Paternina</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Frontend Developer</td>
                <td style={td}>Martin Gonzales</td>
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
        <Section icon="🗺️" title="Roadmap del Proyecto">
          <RoadmapGantt
            axisStart="2025-11"
            axisEnd="2026-12"
            fases={[
              {
                nombre: "Fase 1: Gestión de Novedades",
                estado: "completada",
                inicio: "2025-11",
                fin: "2025-11",
                detalle: "Implementación y centralización de la gestión de novedades para optimizar la operativa inicial. Entregada en noviembre de 2025.",
              },
              {
                nombre: "Fase 2: Búsqueda Avanzada",
                estado: "proxima",
                inicio: "2026-10",
                fin: "2026-11",
                detalle: "Motor de búsqueda clásica (texto/palabras clave), búsqueda por ID para acceso directo, y búsqueda potenciada con Inteligencia Artificial para mejorar la relevancia de los resultados.",
              },
              {
                nombre: "Fase 3: Escalamiento y Feed",
                estado: "proxima",
                inicio: "2026-11",
                fin: "2026-12",
                detalle: "Soporte e infraestructura para arquitectura Multipaís, y diseño e implementación del nuevo Feed de experiencia.",
              },
            ]}
            nota="Fase 1 entregada en noviembre de 2025 (confirmado). Fases 2 y 3: fechas estimadas a partir del Weekly Status más reciente (semana del 25 de agosto de 2026) — se ajustan cuando el equipo confirme fechas exactas."
          />
        </Section>

        {/* 🗓️ Weekly Status */}
        <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)">
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <WeeklySelector />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field term="Resumen de la semana">
              Prioridad P2 · Delivery en QA. Pruebas activas por el equipo de Tecnología, pruebas en curso con Coordinadora (última fase para liberación) y pruebas internas habilitadas en TestFlight.
            </Field>
            <Field term="Retos y Bloqueos">{pending}</Field>
          </div>
        </Section>

        {/* 📊 Métricas de Seguimiento */}
        <Section icon="📊" title="Métricas de Seguimiento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 1 · Ratio DAU/Descargas</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: ~3.6% → Meta: pendiente</div>
            </div>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 2 · DAU total</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: ~3,443 → Meta: pendiente</div>
            </div>
          </div>
          <Field term="Comentarios de rendimiento">
            De cada 100 usuarios que descargan la app, solo ~4 regresan diariamente — evidencia un problema severo de retención que la Fase 2 busca resolver.
          </Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
