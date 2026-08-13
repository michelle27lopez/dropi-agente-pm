import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Estructura: Promp/Prompmaestro.md (plantilla estándar de detalle de proyecto)
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
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="dropi-app"
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
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>DROP-25313</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            De Vitrina a Herramienta de Gestión de Negocio
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>Plan Estratégico · Dropi App — 20 mayo 2026</p>
        </div>

        {/* 1. Definición del Proyecto */}
        <Section icon="🎯" title="1. Definición del Proyecto">
          <Field term="Nombre del proyecto">Plan Estratégico · Dropi App — De Vitrina a Herramienta de Gestión de Negocio</Field>
          <Field term="Objetivo principal">
            La Dropi App no es una copia de la plataforma web — debe convertirse en la herramienta para gestionar el negocio desde el bolsillo (modelo Shopify Mobile), enfocada en métricas de ventas, notificaciones push inteligentes, búsqueda de productos y gestión de órdenes, para resolver el problema severo de retención actual.
          </Field>

          <div style={{ marginBottom: 14 }}>
            <div style={label}>Estado actual (baseline · corte 19 may 2026)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              <div style={metric}><div style={{ fontSize: 11, color: "var(--muted)" }}>Descargas iOS</div><div style={{ fontSize: 18, fontWeight: 800 }}>22,486</div></div>
              <div style={metric}><div style={{ fontSize: 11, color: "var(--muted)" }}>Descargas Android</div><div style={{ fontSize: 18, fontWeight: 800 }}>73,686</div></div>
              <div style={metric}><div style={{ fontSize: 11, color: "var(--muted)" }}>DAU total</div><div style={{ fontSize: 18, fontWeight: 800 }}>~3,443</div></div>
              <div style={metric}><div style={{ fontSize: 11, color: "var(--muted)" }}>Ratio DAU/Descargas</div><div style={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>~3.6%</div></div>
            </div>
          </div>

          <Field term="Métricas de éxito / KPIs">
            <p style={{ margin: "0 0 8px" }}>
              El documento fuente no define una meta numérica explícita — el KPI implícito es <strong>subir el ratio DAU/Descargas por encima del 3.6% actual</strong> (hoy solo ~4 de cada 100 usuarios que descargan la app regresan diariamente).
            </p>
            <span style={badgeStyle("#B45309", "#FFFBEB")}>Meta numérica objetivo: pendiente de definir</span>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field term="Dentro del alcance (in-scope)">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>📊 Métricas de ventas</li>
                <li>🔔 Notificaciones push inteligentes con sonido</li>
                <li>🔍 Búsqueda de productos para todos los usuarios</li>
                <li>✏️ Gestión de órdenes</li>
              </ul>
            </Field>
            <Field term="Fuera del alcance (out-of-scope)">
              <span style={badgeStyle("#B45309", "#FFFBEB")}>No definido en el documento fuente</span>
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
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin asignar</span></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Stakeholders / clientes clave</td>
                <td style={{ ...td, borderBottom: "none" }}>Usuarios de la Dropi App (Dropshippers, Marcas/Emprendedores en móvil).</td>
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
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente</span></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Gestión de tareas</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente</span></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Código / repositorio</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente</span> — app móvil Dropi (iOS/Android)</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Documentación técnica</td>
                <td style={td}>Plan Estratégico · Dropi App (carpeta "Dropi App")</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Archivos adjuntos</td>
                <td style={{ ...td, borderBottom: "none" }}>Plan Estrategico_ Dropi App (2).md</td>
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
                <td style={{ ...td, borderBottom: "none" }}>Fase 2 · Rediseño hacia gestión de negocio (novedades)</td>
                <td style={{ ...td, borderBottom: "none" }}>Si la app muestra métricas de ventas, permite gestionar órdenes y envía alertas de novedades, el usuario la necesitará todo el día, todos los días.</td>
                <td style={{ ...td, borderBottom: "none" }}>Subir el ratio DAU/Descargas por encima del 3.6% actual</td>
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
                <td style={td}>Fase 1 · Descubrimiento de productos (video)</td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin fecha exacta</span></td>
                <td style={td}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin asignar</span></td>
                <td style={td}><span style={badgeStyle("#16A34A", "#F0FDF4")}>Completado</span></td>
                <td style={td}>App como vitrina de descubrimiento vía feed de video</td>
              </tr>
              <tr>
                <td style={{ ...td, borderBottom: "none" }}>Fase 2 · Gestión de negocio (novedades)</td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin fecha exacta</span></td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin asignar</span></td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#1458A8", "#EFF6FF")}>En desarrollo</span></td>
                <td style={{ ...td, borderBottom: "none" }}>Métricas de ventas, push, búsqueda, gestión de órdenes</td>
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
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Fecha</th>
                <th style={th}>Decisión tomada</th>
                <th style={th}>Contexto / por qué</th>
                <th style={th}>Aprobado por</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, borderBottom: "none", whiteSpace: "nowrap" }}>20 mayo 2026</td>
                <td style={{ ...td, borderBottom: "none" }}>Adoptar nueva visión estratégica: pivotar de "vitrina de contenido" (feed de video) a herramienta de gestión de negocio (modelo Shopify Mobile).</td>
                <td style={{ ...td, borderBottom: "none" }}>Ratio DAU/Descargas de solo ~3.6% evidencia un problema severo de retención — la app no genera necesidad de uso operativo diario.</td>
                <td style={{ ...td, borderBottom: "none" }}><span style={badgeStyle("#B45309", "#FFFBEB")}>Sin especificar</span></td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Pendientes por Clarificar */}
        <Section icon="⚠️" title="Pendientes por Clarificar">
          <ul style={{ ...body, margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 4 }}>Tech/Dev Lead y Diseñador Lead sin nombre asignado.</li>
            <li style={{ marginBottom: 4 }}>Meta numérica objetivo del ratio DAU/Descargas no definida.</li>
            <li style={{ marginBottom: 4 }}>Fechas específicas de la Fase 2 no definidas en el documento fuente.</li>
            <li style={{ marginBottom: 4 }}>Alcance "fuera de scope" no definido en el documento fuente.</li>
            <li style={{ marginBottom: 4 }}>Links de diseño, repositorio y gestión de tareas pendientes.</li>
            <li>Aprobador de la decisión de pivote estratégico (20 mayo 2026) sin especificar.</li>
          </ul>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
