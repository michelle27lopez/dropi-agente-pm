import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Estructura: Promp/Documento de Seguimiento.md (plantilla de seguimiento de proyecto)
// Insumo: Rearquitectura/Proyectos E2E - Re-arquitectura.md

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

export default function RearquitecturaPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Rearquitectura · Reorganización de Navegación y Pantallas Dropi"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="rearquitectura"
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
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Delivery · Activo</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>DROP-25312</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Rearquitectura
          </h1>
        </div>

        {/* 🎯 Objetivos Macro */}
        <Section icon="🎯" title="Objetivos Macro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Target">Usuarios Dropi Core (Dropshippers, Proveedores, Marcas) — todos los países, incluye Marcas Blancas.</Field>
            <Field term="Adopción">{pending}</Field>
            <Field term="Retención">{pending}</Field>
            <Field term="Satisfacción (NPS/CSAT)">&gt;80% CSAT/SUS en encuestas post-implementación.</Field>
          </div>
        </Section>

        {/* 📌 Definición del Proyecto */}
        <Section icon="📌" title="Definición del Proyecto">
          <Field term="Descripción">
            Ubicar cada pantalla dentro del módulo correspondiente para maximizar la descubribilidad y usabilidad de la plataforma, optimizando la navegación global para reducir fricción y carga cognitiva — sin alterar la lógica de negocio subyacente, y conservando rigurosamente el sistema de diseño v2.0.
          </Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Enlaces clave</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 260 }}>📄 Documento de Lanzamiento (Kickoff)</td>
                  <td style={td}>Proyectos E2E - Re-arquitectura.md (carpeta Rearquitectura)</td>
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
                <td style={td}>{pending} — rol Product Design (PD) referenciado en el doc fuente, sin nombre.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Frontend Developer</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Tecnología Growth</td>
                <td style={{ ...td, borderBottom: "none" }}>{pending} — rol Tecnología (TI) referenciado genéricamente en el doc fuente.</td>
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
                <td style={td}>{pending} — pruebas de usabilidad planeadas, sin archivos aún.</td>
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
                <td style={td}>Guía de equivalencias de navegación (matriz de mapeo de pantallas viejas vs. nuevas) — mencionada, archivo {pending}.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>🎨 Figma v1.0 (Exploración)</td>
                <td style={td}>{pending}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎨 Figma v2.0 (Handoff / Producción)</td>
                <td style={{ ...td, borderBottom: "none" }}>Prototipos navegables de alta fidelidad (mencionados en el doc), link {pending}.</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 🗺️ Roadmap */}
        <Section icon="🗺️" title="Roadmap">
          <Field term="Fase 1 (MVP / Q1)">Duplicación segura de pantallas actuales, reorganización modular por afinidad funcional, exploración de tabs alineados al UI Kit v2.0.</Field>
          <Field term="Fase 2 (Escala / Q2)">Telemetría de comportamiento de usuario, pruebas de usabilidad con prototipos de alta fidelidad, arquitectura C4 N2-4 y diagrama PERT.</Field>
          <Field term="Próximos pasos inmediatos">Definir la Estrategia de Comunicación con Marketing (hoy marcada N/A en el doc fuente).</Field>
        </Section>

        {/* 🗓️ Weekly Status */}
        <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <Field term="Semana del">{pending}</Field>
            <Field term="Estado general">{pending}</Field>
          </div>
          <Field term="Resumen de la semana">{pending} — sin registros todavía.</Field>
          <Field term="Retos y Bloqueos">Estrategia de Comunicación (Marketing) sin definir.</Field>
        </Section>

        {/* 📊 Métricas de Seguimiento */}
        <Section icon="📊" title="Métricas de Seguimiento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 1 · Time-on-task</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: pendiente → Meta: reducción</div>
            </div>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 2 · CSAT / SUS</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: pendiente → Meta: &gt;80%</div>
            </div>
          </div>
          <Field term="Comentarios de rendimiento">
            Criterio adicional de éxito: cero regresiones en lógica de negocio o errores críticos de navegación (QA, smoke tests, monitoreo en producción).
          </Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
