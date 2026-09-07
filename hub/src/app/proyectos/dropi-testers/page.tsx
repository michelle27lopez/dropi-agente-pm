import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import WeeklySelector from "../seguimiento/WeeklySelector";
import RoadmapGantt from "../seguimiento/RoadmapGantt";

// Insumo: Resumen Weekly de Experience — semana del 31 de agosto al 4 de
// septiembre de 2026. Proyecto nuevo, sin documento de kickoff propio aún;
// varios campos quedan "Pendiente de definir" hasta que se defina el
// alcance completo con el equipo.

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

export default function DropiTestersPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Dropi Testers"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="dropi-testers"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/celula/experience"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver a Célula Experience
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Experience</span>
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Delivery · En DEV</span>
            <span style={badgeStyle("#B45309", "#FFFBEB")}>⏸️ Despriorizado</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-006</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Dropi Testers
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            MVP para capturar usuarios interesados en ser testers de Dropi
          </p>
        </div>

        {/* 🎯 Objetivos Macro */}
        <Section icon="🎯" title="Objetivos Macro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Target">Usuarios interesados en ser testers de Dropi, captados en el marco de ExpoWinner.</Field>
            <Field term="Adopción">{pending}</Field>
            <Field term="Retención">{pending}</Field>
            <Field term="Satisfacción (NPS/CSAT)">{pending}</Field>
          </div>
        </Section>

        {/* 📌 Definición del Proyecto */}
        <Section icon="📌" title="Definición del Proyecto">
          <Field term="Descripción">
            Se lanzará una versión MVP para ExpoWinner enfocada únicamente en capturar usuarios interesados en ser
            testers de Dropi — una primera pieza para construir, a futuro, una comunidad propia de testers para
            validar funcionalidades antes de su lanzamiento general.
          </Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Enlaces clave</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 260 }}>📄 Documento de Lanzamiento (Kickoff)</td>
                  <td style={td}>{pending}</td>
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
            axisStart="2026-08"
            axisEnd="2026-12"
            fases={[
              {
                nombre: "MVP captura de testers (ExpoWinner)",
                estado: "bloqueada",
                inicio: "2026-08",
                fin: "2026-09",
                detalle: "Versión MVP enfocada únicamente en capturar usuarios interesados en ser testers de Dropi. Bloqueado hasta contar con un desarrollador asignado.",
                bloqueo: "Bloqueado — sin desarrollador asignado",
              },
            ]}
            nota="Proyecto despriorizado frente a Rearquitectura, Órdenes y Dropi App. Fechas estimadas a partir del Weekly Status más reciente (semana del 31 de agosto al 4 de septiembre de 2026)."
          />
        </Section>

        {/* 🗓️ Weekly Status */}
        <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)">
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <WeeklySelector />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field term="Resumen de la semana">
              Prioridad Despriorizado · Delivery en DEV. Estrategia MVP: se lanzará una versión enfocada únicamente
              en capturar usuarios interesados en ser testers, de cara a ExpoWinner.
            </Field>
            <Field term="Retos y Bloqueos">🚨 Bloqueado por falta de desarrollador asignado.</Field>
          </div>
        </Section>

        {/* 📊 Métricas de Seguimiento */}
        <Section icon="📊" title="Métricas de Seguimiento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 1</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: pendiente → Meta: pendiente</div>
            </div>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 2</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: pendiente → Meta: pendiente</div>
            </div>
          </div>
          <Field term="Comentarios de rendimiento">{pending}</Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
