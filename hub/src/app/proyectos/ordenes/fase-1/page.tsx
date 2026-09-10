import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Insumo: MVP Ordenes E2E - Fase 1 (2).md — "Estrategia de Following y
// Lanzamiento" del MVP Órdenes 2.0 (Importación, Exportación, Etiquetas y
// Optimización de Creación Manual de Órdenes).

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

const metric: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "14px 16px",
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

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ ...body, margin: 0, paddingLeft: 18 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}

function MetricaCard({ nombre, accion, formula, criterio, segmentacion }: { nombre: string; accion: string; formula: string; criterio: string; segmentacion: string }) {
  return (
    <div style={metric}>
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>{nombre}</div>
      <Field term="Acción clave">{accion}</Field>
      <Field term="Fórmula">{formula}</Field>
      <Field term="Criterio de éxito">{criterio}</Field>
      <Field term="Segmentación técnica">{segmentacion}</Field>
    </div>
  );
}

export default function OrdenesFase1Page() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Órdenes · Fase 1 (MVP E2E)"
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
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Fase 1 · MVP E2E</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-002</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            MVP Órdenes 2.0
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            Importación, Exportación, Etiquetas y Optimización de Creación Manual de Órdenes — MVP Ordenes E2E - Fase 1 (carpeta Ordenes)
          </p>
        </div>

        {/* 📌 Contexto y Objetivo */}
        <Section icon="📌" title="Contexto y Objetivo de Medición">
          <Field term="Contexto del problema">
            El módulo de órdenes presenta fricciones operativas que impactan la eficiencia de los usuarios al gestionar sus pedidos: dificultad para realizar cargas masivas de órdenes, falta de herramientas de organización mediante etiquetas, pasos repetitivos en la creación manual de órdenes y mensajes de cobertura poco comprensibles. Además, la interfaz actual quedó rezagada frente a la evolución visual y de experiencia de otros módulos de Dropi.
          </Field>
          <Field term="Objetivo del feature">
            Optimizar la gestión de órdenes mediante mejoras en los procesos de importación y exportación, creación manual de órdenes y organización de pedidos con etiquetas, reduciendo fricción operativa y dependencia del soporte.
          </Field>
          <Field term="Propuesta de valor">
            Permitir que los usuarios gestionen sus órdenes de forma más rápida, organizada y autónoma, disminuyendo tareas repetitivas y facilitando la administración de grandes volúmenes de pedidos.
          </Field>
          <Field term="Impacto esperado en la experiencia">
            <List items={[
              "Reduce pasos innecesarios durante la creación manual de órdenes.",
              "Facilita la carga y descarga masiva de información.",
              "Mejora la organización de órdenes mediante etiquetas personalizadas.",
              "Disminuye la confusión generada por mensajes técnicos de cobertura.",
              "Incrementa la eficiencia operativa en tareas recurrentes.",
            ]} />
          </Field>
        </Section>

        {/* 🎯 Alcance */}
        <Section icon="🎯" title="Alcance">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Segmento impactado">Dropshippers.</Field>
            <Field term="Países impactados">Todos los países donde opera Dropi.</Field>
            <Field term="Usuarios impactados">Aproximadamente 6.000 usuarios diarios del módulo de órdenes.</Field>
          </div>
        </Section>

        {/* 📊 Métricas de Impacto (Negocio) */}
        <Section icon="📊" title="Métricas de Impacto (Negocio · Data Warehouse)">
          <p style={{ ...body, marginBottom: 16 }}>Framework HEART, calculadas cruzando tablas de la base de datos. Responsable: <strong>Miguel Ángel Gutiérrez</strong>.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            <MetricaCard
              nombre="Adopción de Importación de Órdenes"
              accion="Validar que los usuarios utilicen el nuevo flujo de importación masiva."
              formula="Órdenes creadas por importación / Total órdenes creadas."
              criterio="Incrementar el uso de importación masiva respecto al flujo actual."
              segmentacion="Dropshippers."
            />
            <MetricaCard
              nombre="Adopción de Etiquetas"
              accion="Validar que las etiquetas son utilizadas como mecanismo de organización."
              formula="Órdenes etiquetadas / Total órdenes creadas."
              criterio="Incrementar progresivamente el porcentaje de órdenes etiquetadas."
              segmentacion="Dropshippers activos."
            />
          </div>
        </Section>

        {/* 👤 Métricas de Comportamiento (UX) */}
        <Section icon="👤" title="Métricas de Comportamiento (UX)">
          <p style={{ ...body, marginBottom: 16 }}>Responsable: <strong>Diana Aldana</strong>.</p>
          <Field term="Target (población objetivo)">
            Dropshippers activos que gestionan órdenes desde el módulo de órdenes y requieren herramientas para organizar, importar, exportar y crear pedidos manualmente. Universo: ~6.000 usuarios activos diarios.
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 16 }}>
            <MetricaCard
              nombre="M1 · Adopción de Importación Masiva"
              accion="Usuario completa exitosamente una importación de órdenes y estas quedan procesadas por el sistema."
              formula="Usuarios que completan al menos una importación exitosa / Usuarios que ingresan al flujo de importación."
              criterio="40% de los usuarios que ingresan al flujo completan una importación exitosa."
              segmentacion="Evento: order_import_processed_success · Rol: Dropshipper · País: Todos."
            />
            <MetricaCard
              nombre="M2 · Adopción de Gestión de Etiquetas"
              accion="Usuario crea o asigna una etiqueta a una orden."
              formula="Usuarios que crean o asignan al menos una etiqueta / Usuarios que abren el módulo de etiquetas."
              criterio="50% de adopción."
              segmentacion="Eventos: tag_created, tag_assigned · Rol: Dropshipper."
            />
            <MetricaCard
              nombre="M3 · Adopción de Creación Manual Optimizada"
              accion="Usuario completa exitosamente una orden manual."
              formula="Usuarios que crean una orden manual exitosamente / Usuarios que inician el flujo de creación manual."
              criterio="70% de finalización del flujo."
              segmentacion="Eventos: manual_order_started, manual_order_created · Rol: Dropshipper."
            />
            <MetricaCard
              nombre="M4 · Adopción de Exportación de Órdenes"
              accion="Usuario completa una exportación de órdenes."
              formula="Usuarios que completan una exportación / Usuarios que abren el modal de exportación."
              criterio="60% de finalización."
              segmentacion="Eventos: export_modal_opened, orders_exported · Rol: Dropshipper."
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 16 }}>
            <div style={metric}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Retención</div>
              <Field term="Indicador">% de usuarios que vuelven a usar alguna nueva funcionalidad del módulo de órdenes dentro de los siguientes 30 días.</Field>
              <Field term="Fórmula">Usuarios que utilizaron nuevamente una funcionalidad del MVP en los siguientes 30 días / Usuarios que la utilizaron por primera vez.</Field>
              <Field term="Meta sugerida">50%.</Field>
            </div>
            <div style={metric}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Satisfacción</div>
              <Field term="Pregunta">¿Qué tan fácil fue para ti crear, organizar o gestionar tus órdenes hoy?</Field>
              <Field term="Meta">&gt;80% de respuestas entre "Como esperaba" y "Mucho más fácil de lo esperado".</Field>
              <Field term="Momento de disparo">Al importar, crear manual, añadir etiquetas o exportar órdenes exitosamente.</Field>
            </div>
          </div>
        </Section>

        {/* 🗓️ Esquema de Seguimiento */}
        <Section icon="🗓️" title="Esquema de Seguimiento (Piloto de 12 Semanas)">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 220 }}>Mes 1 (semanas 1–4) · Semanal</td>
                <td style={td}>Monitoreo de adopción inicial, detección de bugs, primeras señales de uso.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Mes 2 (semanas 5–8) · Quincenal</td>
                <td style={td}>Análisis de uso repetitivo, primeras encuestas SEQ, ajustes menores.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Mes 3 (semanas 9–12) · Mensual</td>
                <td style={{ ...td, borderBottom: "none" }}>Evaluación de impacto final en métricas de negocio, decisión de evolutivos.</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 🚀 Propuesta de Lanzamiento */}
        <Section icon="🚀" title="Propuesta de Lanzamiento">
          <Field term="Nombre del feature">MVP Órdenes 2.0 — Importación, Exportación, Etiquetas y Optimización de Creación Manual de Órdenes.</Field>
          <Field term="Tipo de lanzamiento">Actualización de funcionalidad existente.</Field>
          <Field term="Descripción">
            Evolución del módulo de órdenes mediante mejoras de experiencia de usuario, incorporación de herramientas de organización (etiquetas), optimización de procesos masivos y modernización visual alineada con la evolución de Dropi.
          </Field>
          <Field term="Handoff a desarrollo">2 de julio de 2026.</Field>
          <Field term="Fecha esperada en producción">Pendiente de definición por el equipo de TI y planificación de release — bloqueada hasta contar con recurso de Tecnología asignado.</Field>
          <Field term="Roles y países">Dropshipper — todos los países donde actualmente opera Dropi.</Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Documentación del lanzamiento</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 220 }}>🎨 Figma</td>
                  <td style={td}><a href="https://www.figma.com/design/AmrwKdJLJQHbvN0n1ImznU/MVP-%C3%93rdenes-2.0-Dropshipper?node-id=1-264" target="_blank" rel="noreferrer" style={{ color: "var(--dropi)" }}>MVP Órdenes 2.0 — Dropshipper</a></td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700 }}>🎬 Tango / Loom</td>
                  <td style={td}>Referenciados en el documento fuente — enlace pendiente de adjuntar.</td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🆘 Soporte / SAC</td>
                  <td style={{ ...td, borderBottom: "none" }}>Sí requiere acompañamiento — nuevas funcionalidades y cambios en flujos existentes.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Field term="Dudas frecuentes esperadas">
            <List items={[
              "Creación y uso de etiquetas.",
              "Diferencia entre añadir etiquetas individualmente o de forma masiva.",
              "Proceso de importación de órdenes y diligenciamiento de la plantilla.",
              "Funcionamiento de la exportación de órdenes.",
              "Nuevo comportamiento de los mensajes de cobertura de transportadoras.",
            ]} />
          </Field>

          <Field term="Cambios en los procesos actuales">
            <List items={[
              "Se incorpora la gestión de etiquetas dentro del módulo de órdenes.",
              "Se actualizan los flujos de importación y exportación.",
              "Se optimiza la creación manual conservando la ciudad seleccionada cuando aplique.",
              "Se homologan los mensajes de falta de cobertura de transportadoras.",
              "Se moderniza la interfaz visual del módulo de órdenes.",
            ]} />
          </Field>

          <Field term="Errores esperados a comunicar a Soporte">
            <List items={[
              "Archivos de importación con errores de formato o estructura.",
              "Órdenes que no puedan procesarse durante la importación.",
              "Ciudades que pierden cobertura al cambiar el tipo de envío.",
              "Etiquetas eliminadas que ya no estarán disponibles para futuras asignaciones.",
              "Escenarios donde una transportadora no tenga cobertura (estado \"Sin cobertura\").",
            ]} />
          </Field>

          <Field term="Escalamiento">
            <strong>Producto:</strong> dudas sobre comportamiento esperado, necesidades recurrentes de mejora, oportunidades de evolución.<br />
            <strong>Tecnología:</strong> errores de procesamiento de importaciones, fallas en etiquetas, problemas de exportación, inconsistencias de datos.
          </Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
