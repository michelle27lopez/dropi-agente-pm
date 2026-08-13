import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Estructura: Promp/Prompmaestro.md (plantilla estándar de detalle de proyecto)
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

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid var(--border)",
  color: "var(--muted)",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const td: React.CSSProperties = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "top",
};

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

        {/* 1. Definición del Proyecto */}
        <Section icon="🎯" title="1. Definición del Proyecto">
          <Field term="Nombre del proyecto">Reorganización de Navegación y Pantallas Dropi</Field>
          <Field term="Objetivo principal">
            Ubicar cada pantalla dentro del módulo correspondiente para maximizar la descubribilidad y usabilidad de la plataforma, optimizando la navegación global para reducir fricción y carga cognitiva — sin alterar la lógica de negocio subyacente, y conservando rigurosamente el sistema de diseño v2.0.
          </Field>
          <Field term="Métricas de éxito / KPIs">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Reducción de fricción navegacional y menor tasa de abandono de tareas (pruebas de usabilidad, mapa de calor).</li>
              <li>Reducción del tiempo promedio para encontrar funcionalidades clave (time-on-task).</li>
              <li>&gt;80% CSAT/SUS en encuestas post-implementación.</li>
              <li>Cero regresiones en lógica de negocio o errores críticos de navegación (QA, smoke tests, monitoreo en producción).</li>
            </ul>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field term="Dentro del alcance (in-scope)">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Duplicación segura de pantallas actuales (sin afectar producción).</li>
                <li>Reorganización modular por afinidad funcional.</li>
                <li>Telemetría de comportamiento de usuario.</li>
                <li>Pruebas de usabilidad con prototipos de alta fidelidad.</li>
                <li>Exploración de tabs alineados al UI Kit v2.0.</li>
              </ul>
            </Field>
            <Field term="Fuera del alcance (out-of-scope)">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Modificación de la configuración interna de tiendas en esta fase.</li>
                <li>Cambios en la lógica de pedidos, inventario o pasarelas de pago.</li>
              </ul>
            </Field>
          </div>
        </Section>

        {/* 2. Equipo y Responsabilidades */}
        <Section icon="👥" title="2. Equipo y Responsabilidades">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 220 }}>Product Manager / Líder</td>
                <td style={td}>Diana Aldana</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Tech / Dev Lead</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin asignar</span></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Diseñador Lead</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin asignar</span> — rol Product Design (PD) referenciado en el doc fuente, sin nombre.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Stakeholders / clientes clave</td>
                <td style={{ ...td, borderBottom: "none" }}>Dropshippers, Proveedores, Marcas (usuarios core); equipo de Marketing (comunicación).</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 3. Recursos, Archivos y Enlaces */}
        <Section icon="🔗" title="3. Recursos, Archivos y Enlaces">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 220 }}>Diseños & UX</td>
                <td style={td}>Prototipos navegables de alta fidelidad en Figma (mencionados en el doc, link <span style={badgeStyle("#B45309", "#FFFBEB")}>pendiente</span>).</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Gestión de tareas</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente</span></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Código / repositorio</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente</span> — impacta Plataforma Dropi Core y subsistemas de Marcas Blancas.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Documentación técnica</td>
                <td style={td}>Documento E2E de Iniciativa — fuente de verdad del proyecto (carpeta Rearquitectura).</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Archivos adjuntos</td>
                <td style={{ ...td, borderBottom: "none" }}>Proyectos E2E - Re-arquitectura.md</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 4. Experimentos e Hipótesis */}
        <Section icon="🧪" title="4. Experimentos e Hipótesis">
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Experimento / prueba</th>
                <th style={th}>Hipótesis</th>
                <th style={th}>Criterio de éxito</th>
                <th style={th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, borderBottom: "none", fontWeight: 700 }}>EXP-1</td>
                <td style={{ ...td, borderBottom: "none" }}>Pruebas de usabilidad con prototipo de alta fidelidad</td>
                <td style={{ ...td, borderBottom: "none" }}>Si reorganizamos las pantallas por módulo (con tabs), mejora la tasa de éxito de tareas y baja el tiempo de búsqueda.</td>
                <td style={{ ...td, borderBottom: "none" }}>CSAT/SUS &gt;80%, reducción de time-on-task</td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#1458A8", "#EFF6FF")}>En curso</span></td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 5. Roadmap y Línea de Tiempo */}
        <Section icon="🗺️" title="5. Roadmap y Línea de Tiempo">
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Fase / hito</th>
                <th style={th}>Fecha estimada</th>
                <th style={th}>Responsable</th>
                <th style={th}>Estado</th>
                <th style={th}>Entregable principal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>Kick-off y Alcance</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin fecha</span></td>
                <td style={td}>Producto (PM/PO)</td>
                <td style={td}><span style={badgeStyle("#16A34A", "#F0FDF4")}>Completado</span></td>
                <td style={td}>Documento de Kick-off</td>
              </tr>
              <tr>
                <td style={td}>Prototipo de alta fidelidad</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin fecha</span></td>
                <td style={td}>Product Design (PD)</td>
                <td style={td}><span style={badgeStyle("#1458A8", "#EFF6FF")}>En curso</span></td>
                <td style={td}>Prototipo navegable en Figma</td>
              </tr>
              <tr>
                <td style={td}>Estrategia de Comunicación</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin fecha</span></td>
                <td style={td}>Marketing</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente</span></td>
                <td style={td}>Plan de comunicación a usuarios</td>
              </tr>
              <tr>
                <td style={{ ...td, borderBottom: "none" }}>Arquitectura C4 N2-4 y PERT</td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin fecha</span></td>
                <td style={{ ...td, borderBottom: "none" }}>Tecnología (TI)</td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#1458A8", "#EFF6FF")}>En curso</span></td>
                <td style={{ ...td, borderBottom: "none" }}>Diagramas C4 + PERT</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 6. Seguimiento Semanal */}
        <Section icon="📅" title="6. Seguimiento Semanal (Weekly Status)">
          <p style={{ ...body, color: "var(--muted)", fontStyle: "italic" }}>
            Sin registros todavía — esta sección se actualiza semana a semana por el equipo del proyecto.
          </p>
        </Section>

        {/* 7. Bitácora de Decisiones Clave */}
        <Section icon="📓" title="7. Bitácora de Decisiones Clave (Decision Log)">
          <p style={{ ...body, color: "var(--muted)", fontStyle: "italic" }}>
            Sin decisiones registradas todavía en el documento fuente.
          </p>
        </Section>

        {/* Pendientes por Clarificar */}
        <Section icon="⚠️" title="Pendientes por Clarificar">
          <ul style={{ ...body, margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 4 }}>Tech/Dev Lead y Diseñador Lead sin nombre asignado.</li>
            <li style={{ marginBottom: 4 }}>Fechas del roadmap no definidas en el documento fuente.</li>
            <li style={{ marginBottom: 4 }}>Links de Figma, gestión de tareas y repositorio pendientes.</li>
            <li style={{ marginBottom: 4 }}>Estrategia de Comunicación (Marketing) aún sin definir — marcada N/A en el doc fuente.</li>
            <li>Hallazgos Following pendientes de recolección post-lanzamiento.</li>
          </ul>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
