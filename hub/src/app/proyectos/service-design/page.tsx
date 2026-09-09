import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import RoadmapGantt from "../seguimiento/RoadmapGantt";

// Estructura calcada de la ficha de proyectos de Célula Design Ops
// (proyectos/rearquitectura/page.tsx) — a pedido de Diana, mismo nivel de
// detalle (Section cards + RoadmapGantt) para el proyecto EXP-008 de la
// célula Experience (EXP-008 · Discovery).

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

export default function ServiceDesignPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Service Design"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="service-design"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/proyectos/exp-008"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Experience</span>
            <span style={badgeStyle("#0D9488", "#F0FDFA")}>🔍 Discovery · En Progreso</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-008</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Service Design
          </h1>
        </div>

        <Section icon="📌" title="Enfoque del Semestre">
          <Field term="Prioridad">
            Durante este período, la prioridad absoluta de la célula es profundizar en el entendimiento holístico
            del usuario para identificar con precisión en qué puntos exactos del viaje (Customer Journey) se genera
            fricción y detracción que impactan negativamente la nota del NPS.
          </Field>
          <Field term="Cómo">
            Esto implica conectar el comportamiento de la interfaz (front-stage) con la eficiencia de los procesos
            operativos e internos de la organización (back-stage).
          </Field>
        </Section>

        <Section icon="🗺️" title="Hoja de Ruta: Estrategia de Service Design (Por Fases)">
          <RoadmapGantt
            axisStart="2026-08"
            axisEnd="2026-12"
            fases={[
              {
                nombre: "Fase 1 · Sensibilización e Introducción",
                estado: "completada",
                inicio: "2026-08",
                fin: "2026-08",
                detalle: "Presentación e inducción a las distintas áreas sobre qué es Service Design, su impacto en el negocio y por qué la experiencia del usuario depende de la sincronización de toda la cadena de servicio.",
              },
              {
                nombre: "Fase 2 · Mapeo de Flujos y Entendimiento del Usuario",
                estado: "en-curso",
                inicio: "2026-09",
                fin: "2026-10",
                detalle: "Entendimiento de flujos (front-stage): mapeo de pantallas, acciones y recorridos en las secciones principales de la plataforma. Investigación cualitativa: entrevistas a profundidad segmentadas por lealtad NPS (Detractores <6, Pasivos, Promotores) y nivel de experiencia (Novatos vs. VIPs).",
              },
              {
                nombre: "Fase 3 · Mapeo de Procesos Internos y Agendamiento Interáreas",
                estado: "en-curso",
                inicio: "2026-09",
                fin: "2026-10",
                detalle: "Sesiones de alineación (back-stage): mesas de trabajo con SAC, Operaciones/G-Ops, Producto, Tecnología, Growth y Comunicaciones. Levantamiento operativo: reglas de negocio, integraciones técnicas o tiempos de respuesta interna que afectan la respuesta recibida por el usuario.",
              },
              {
                nombre: "Fase 4 · Integración con Ecosistema Sherlock y Diagnóstico Global",
                estado: "proxima",
                inicio: "2026-10",
                fin: "2026-11",
                detalle: "Cruce de la información visual del Service Blueprint con la data cualitativa y cuantitativa procesada en Sherlock (Intercom, cajas in-app, WhatsApp, Facebook, redes sociales). Matriz de fricción crítica: nodos del blueprint donde coinciden picos de quejas con bajas calificaciones de NPS.",
              },
              {
                nombre: "Fase 5 · Priorización e Intervención de Backlog",
                estado: "proxima",
                inicio: "2026-11",
                fin: "2026-12",
                detalle: "Mesa operativa de trabajo: presentación de hallazgos en la mesa de seguimiento semanal para transformar los puntos de dolor del blueprint en Épicas e Historias de Usuario priorizadas por impacto en el NPS.",
              },
            ]}
            nota="Fechas estimadas — Diana no dio fechas exactas por fase, solo el estado (Fase 1 completada; Fases 2 y 3 en curso en paralelo; Fases 4 y 5 próximas). Se ajustan cuando se confirmen fechas reales."
          />
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
