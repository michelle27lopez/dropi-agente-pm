import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import WeeklySelector from "../seguimiento/WeeklySelector";
import RoadmapGantt from "../seguimiento/RoadmapGantt";

// Insumos: Lanzamiento Dashboard Indicadores.md (carpeta Experience) —
// "Estrategia de Following y Lanzamiento Nuevo Dashboard v2.0" — y
// Pitch dashboard.md (carpeta Dashboard de indicadores) — pitch formato
// Shape Up: Problema / Apetencia / Solución / Consideraciones adicionales.

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

const pending = <span style={badgeStyle("#B45309", "#FFFBEB")}>Pendiente de definir</span>;
const linkStyle: React.CSSProperties = { color: "var(--dropi)", fontWeight: 700 };

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

export default function DashboardIndicadoresPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Dashboard de Indicadores · Following y Lanzamiento"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="exp-004"
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
            <span style={badgeStyle("#1458A8", "#EFF6FF")}>🚚 Following · Beta controlada</span>
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>EXP-004</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            Nuevo Dashboard Operativo Dropi (v2.0)
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
            Estrategia de Following y Lanzamiento — Lanzamiento Dashboard Indicadores.md (carpeta Experience)
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            En piloto beta desde noviembre de 2025 · Posible fecha de lanzamiento general: 8 de septiembre de 2026 (sujeta a confirmación).
          </p>
        </div>

        {/* 🎯 Objetivos Macro */}
        <Section icon="🎯" title="Objetivos Macro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Target">Proveedores, Marcas y Marcas Blancas activas en Colombia.</Field>
            <Field term="Adopción">Tasa de adopción diaria del Dashboard (Page View en <code>*/dashboard</code>) — línea base {pending}.</Field>
            <Field term="Retención">Curva de retención (Día 0 vs. Día N, Retention Charts de Userpilot) estabilizada por encima del 50% en días consecutivos.</Field>
            <Field term="Satisfacción (NPS/CSAT)">Encuesta in-app: "Como esperaba" o "Mucho más fácil de lo esperado" = Satisfecho — meta numérica {pending}.</Field>
          </div>
        </Section>

        {/* 📌 Definición del Proyecto */}
        <Section icon="📌" title="Definición del Proyecto">
          <Field term="¿Qué problema estamos resolviendo?">
            Los proveedores, marcas y marcas blancas en Dropi no tienen visibilidad centralizada de su operación. Hoy, para entender cómo van sus ventas, el estado de sus órdenes o su tendencia de crecimiento, deben navegar entre múltiples módulos, exportar datos manualmente y armar sus propias métricas. No existe un punto de entrada que les diga, de un vistazo, "así va tu negocio en Dropi".
          </Field>
          <Field term="¿Por qué es importante?">
            <List items={[
              "Pérdida de tiempo operativo: los proveedores invierten tiempo diario buscando información dispersa entre módulos de órdenes, reportes y configuraciones.",
              "Decisiones a ciegas: sin indicadores consolidados (recaudo, efectividad, tendencia de ventas), no pueden identificar problemas a tiempo — como un aumento en órdenes con novedad o una caída en despachos.",
              "Baja adopción de reportes existentes: si no encuentran fácilmente sus métricas clave, no usan las herramientas avanzadas (Panel de Desempeño, Torre Logística, ROAX). El dashboard es la puerta de entrada a todo el ecosistema de datos.",
              "Competencia: plataformas similares ya ofrecen dashboards con KPIs en tiempo real — no tenerlo es un gap competitivo.",
            ]} />
          </Field>
          <Field term="¿Cómo se resuelve hoy?">
            <List items={[
              "Los usuarios acceden al módulo de Órdenes y filtran manualmente por estado para contar cuántas tienen pendientes, en tránsito, etc.",
              "Para ver ventas, deben ir a Reportes > Panel de desempeño o exportar datos a Excel.",
              "No existe comparación de periodos (hoy vs. ayer, este mes vs. mes anterior) en ningún lugar de la plataforma.",
              "La página de \"Inicio/Dashboard\" actual es estática y no muestra métricas de negocio.",
            ]} />
          </Field>
          <Field term="Objetivo del feature">
            Centralizar en una sola vista las métricas clave de la operación (recaudo, volumen, efectividad y tendencia) adaptadas a los perfiles de Proveedor, Marca y Marca Blanca, como un centro de mando al iniciar sesión.
          </Field>
          <Field term="Propuesta de valor">
            Entender el estado general del negocio en segundos, con datos ya procesados, sin fricciones operativas y con accesos directos a analítica profunda.
          </Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Enlaces clave</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 260 }}>📄 Documento de Lanzamiento (Kickoff)</td>
                  <td style={td}>Lanzamiento Dashboard Indicadores.md (carpeta Experience)</td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700 }}>📝 Pitch (Shape Up)</td>
                  <td style={td}>Pitch dashboard.md (carpeta Dashboard de indicadores)</td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700 }}>📊 Archivos / Hojas de Cálculo (Excel)</td>
                  <td style={td}>{pending}</td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎫 Tarea principal o Épica en Jira</td>
                  <td style={{ ...td, borderBottom: "none" }}>
                    <a href="https://dropi-it.atlassian.net/browse/DROP-10451" target="_blank" rel="noreferrer" style={linkStyle}>DROP-10451 — Épica Dashboard de indicadores</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* ⚠️ Apetencia (Restricciones) */}
        <Section icon="⏳" title="Apetencia (Restricciones del Pitch)">
          <Field term="Caché obligatorio de 2 horas">Los datos no son en tiempo real; se refrescan cada 2 horas. Decisión deliberada para no sobrecargar la base de datos.</Field>
          <Field term="3 roles, 1 diseño base">Aunque son 3 roles (Proveedor, Marca, Marca Blanca), el layout es el mismo con variaciones de tema visual y branding. Esto reduce la complejidad.</Field>
          <Field term="Sin rango de fechas personalizado">El filtro solo permite opciones predefinidas (Ayer, Hoy, 7 días, 30 días, Este mes). No hay date picker libre.</Field>
        </Section>

        {/* 💡 Solución Propuesta */}
        <Section icon="💡" title="Solución Propuesta">
          <p style={{ ...body, marginBottom: 16 }}>
            Dashboard de indicadores como página principal al ingresar a Dropi, compuesto por 4 secciones:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 16 }}>
            <div style={metric}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>1. Card Principal (Hero Card)</div>
              <List items={[
                "Card visual con degradado (naranja para Proveedor/Marca, azul oscuro para Marca Blanca).",
                "Muestra: logo, nombre, badge, monto de recaudo, cantidad de órdenes, tacómetro de % efectividad.",
                "Filtro de periodo (Ayer, Hoy, 7 días, 30 días, Este mes).",
                "Botón de descarga como imagen PNG/JPG para compartir en redes o WhatsApp.",
              ]} />
            </div>
            <div style={metric}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>2. Tus Órdenes (Indicadores de Estado)</div>
              <List items={[
                "Grilla de 6 tarjetas con conteo de órdenes por estado: Pendientes, Guías generadas, Guías no impresas, Prep. para transportadora, En tránsito, Entregadas.",
                "Calculadas sobre toda la historia (sin límite de fecha), usando solo el último estado de cada orden.",
                "Clic en tarjeta navega al módulo de Órdenes con el filtro pre-aplicado.",
                "Panel lateral \"Más información\" con descripción de cada estado.",
              ]} />
            </div>
            <div style={metric}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>3. Tendencia de Ventas (Gráfica Comparativa)</div>
              <List items={[
                "Gráfico de líneas dual: periodo actual (naranja) vs. periodo anterior (azul).",
                "Dos ejes Y: órdenes (izquierda) y ganancias COP (derecha).",
                "Datos basados en fecha de creación de la orden (no estado actual).",
                "Líneas acumulativas y ascendentes, con tooltip de detalle por punto.",
              ]} />
            </div>
            <div style={metric}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>4. Tus Reportes (Accesos Directos)</div>
              <p style={{ ...body, margin: 0 }}>Botones que enlazan a módulos de reporte externos según el rol.</p>
            </div>
          </div>
          <Field term="Variación para rol Marca">
            Se agregan tabs "Proveeduría" (idéntico a Proveedor) y "Mis Ventas" (vista Dropshipper con métricas desglosadas por tipo de estado: Entregados, Por confirmar, Pendientes, En curso, En Novedad, Devolución).
          </Field>
        </Section>

        {/* ✅ Beneficios Esperados */}
        <Section icon="✅" title="Beneficios Esperados">
          <List items={[
            "Visibilidad inmediata: en menos de 5 segundos, el proveedor sabe cuánto ha vendido, cuántas órdenes tiene pendientes y cuál es su tendencia.",
            "Reducción de fricción: elimina la necesidad de navegar entre 3-4 módulos para obtener información que debería estar en un solo lugar.",
            "Puerta de entrada a reportes avanzados: los botones de \"Tus Reportes\" aumentarán el uso de Panel de Desempeño, Torre Logística y ROAX.",
            "Retención y engagement: un dashboard útil es lo primero que ven al entrar — si les da valor, vuelven más.",
            "Compartibilidad: la descarga de la card como imagen permite que los proveedores compartan su desempeño (marketing orgánico).",
          ]} />
        </Section>

        {/* ⚠️ Riesgos */}
        <Section icon="⚠️" title="Riesgos">
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...td, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Riesgo</th>
                <th style={{ ...td, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Probabilidad</th>
                <th style={{ ...td, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Impacto</th>
                <th style={{ ...td, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>Mitigación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>Performance con datos históricos completos (sección "Tus Órdenes")</td>
                <td style={td}>Media</td>
                <td style={td}>Alto</td>
                <td style={td}>Materializar conteos en caché. Índices optimizados por último estado.</td>
              </tr>
              <tr>
                <td style={td}>Confusión entre "efectividad" del proveedor vs. dropshipper</td>
                <td style={td}>Baja</td>
                <td style={td}>Medio</td>
                <td style={td}>Definir claramente los labels según el rol (ver documento de UI).</td>
              </tr>
              <tr>
                <td style={{ ...td, borderBottom: "none" }}>Homologación de estados incompleta</td>
                <td style={{ ...td, borderBottom: "none" }}>Media</td>
                <td style={{ ...td, borderBottom: "none" }}>Alto</td>
                <td style={{ ...td, borderBottom: "none" }}>Validar tabla <code>order_master_status</code> antes de comenzar desarrollo.</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* ❓ Consideraciones Adicionales */}
        <Section icon="❓" title="Consideraciones Adicionales">
          <Field term="Preguntas abiertas">{pending} — el pitch fuente deja esta pregunta sin diligenciar.</Field>
          <Field term="Responsable del proyecto">{pending} — el pitch fuente deja este campo sin diligenciar (ver Equipo del Proyecto para los responsables ya asignados por frente).</Field>
        </Section>

        {/* 👥 Equipo del Proyecto */}
        <Section icon="👥" title="Equipo del Proyecto">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 260 }}>Product Manager (PM)</td>
                <td style={td}>Diana Aldana</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>UX / Comportamiento</td>
                <td style={td}>Catalina Giraldo</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Data / Analytics (eventos, Data Warehouse)</td>
                <td style={td}>Miguel Ángel Gutiérrez</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Comunicación / Userpilot (validación, encuestas)</td>
                <td style={td}>Laura Catherine Torres Ciendua</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Frontend Developer</td>
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
                <td style={{ ...td, fontWeight: 700, width: 260 }}>🎨 Figma Dashboard v2.0</td>
                <td style={td}>
                  <a href="https://dropi-it.atlassian.net/browse/DROP-10451" target="_blank" rel="noreferrer" style={linkStyle}>Ver enlace</a>
                  {" "}— el documento fuente enlaza esta pieza a la misma URL de la épica de Jira, no a un archivo de Figma; validar el link correcto con el equipo de diseño.
                </td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>🎬 Guía Tango — Dashboard Proveedores</td>
                <td style={td}>
                  <a href="https://app.tango.us/app/workflow/Dashboard---Proveedores-fbc1f73e1ce24511bc15721431a3474f" target="_blank" rel="noreferrer" style={linkStyle}>Abrir guía interactiva</a>
                </td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎬 Guía Tango — Dashboard Dropshippers</td>
                <td style={{ ...td, borderBottom: "none" }}>
                  <a href="https://app.tango.us/app/workflow/Dashboard---Dropshippers-ad5b1eeff79c41f5875208cdef60614b" target="_blank" rel="noreferrer" style={linkStyle}>Abrir guía interactiva</a>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 🧭 Fuentes de datos y responsables */}
        <Section icon="🧭" title="Fuentes de Datos y Eventos a Instrumentar">
          <p style={{ ...body, marginBottom: 16 }}>
            Medir el impacto no se logra solo con eventos de comportamiento en Userpilot — se necesitan tres tipos de información:
          </p>
          <Field term="Eventos de backend">
            Cálculos de métricas de negocio (monto de recaudo, cantidad de órdenes, % de efectividad logística), actualizaciones de estado de las órdenes y actualización de la caché de 2 horas.
          </Field>
          <Field term="Eventos de frontend (Userpilot)">
            Interacciones del usuario en la interfaz: clics en los filtros de tiempo, descargas de la card de rendimiento como PNG/JPG, clics en las 6 tarjetas de "Tus Órdenes" y accesos a "Tus Reportes".
          </Field>
          <Field term="Data transaccional (Data Warehouse)">
            Información histórica de retención, acceso recurrente a la plataforma, y cruce de datos sobre el volumen de ventas vs. el uso de los reportes avanzados (Torre Logística, ROAX, etc.).
          </Field>
          <Field term="Responsables">
            Flujos de comunicación (CSAT, NPS, microsurveys) → <strong>Laura Torres</strong>. Eventos de Userpilot, eventos de backend y data transaccional → <strong>Miguel Ángel Gutiérrez</strong>.
          </Field>
        </Section>

        {/* 📊 Métricas de Impacto (Negocio) */}
        <Section icon="📊" title="Métricas de Impacto (Negocio · Data Warehouse)">
          <p style={{ ...body, marginBottom: 16 }}>Responsable: <strong>Miguel Ángel Gutiérrez</strong>.</p>
          <Field term="Objetivo de la solicitud">
            Medir cómo la visualización del nuevo Dashboard v2.0 incrementa la retención de usuarios activos diarios y aumenta el tráfico hacia los módulos especializados de reportes (Torre Logística, ROAX, etc.).
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 12 }}>
            <Field term="País(es)">Colombia.</Field>
            <Field term="Rol / segmento">Proveedor, Marca y Marca Blanca.</Field>
            <Field term="Periodo de tiempo">Últimos 3 meses (límite de consulta para órdenes).</Field>
          </div>
          <Field term="Eventos a analizar">
            Frecuencia de acceso a la pantalla principal, clics en accesos directos de "Tus Reportes", clics en las 6 tarjetas interactivas de "Tus Órdenes".
          </Field>
          <Field term="Características especiales">
            Reglas globales de negocio estrictas: excluir estados Cancelado, Rechazado y Guía anulada; calcular indicadores con la regla del "último estado".
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Formato de entrega">Dashboard interactivo en Power BI.</Field>
            <Field term="Frecuencia de actualización">Dinámica (con aprobación previa según políticas internas).</Field>
          </div>
          <Field term="Métricas requeridas">
            <List items={[
              "Tasa de adopción diaria.",
              "Porcentaje de redirección exitosa desde el Dashboard a reportes secundarios.",
              "Incremento comparativo en el tiempo invertido leyendo la \"Tendencia de Ventas\".",
            ]} />
          </Field>
        </Section>

        {/* 👤 Métricas de Comportamiento (UX) */}
        <Section icon="👤" title="Métricas de Comportamiento (UX)">
          <p style={{ ...body, marginBottom: 16 }}>Responsable: <strong>Catalina Giraldo</strong> / <strong>Diana Aldana</strong>.</p>

          <div style={metric}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>A. Target (población objetivo)</div>
            <Field term="Segmentación por metadata">
              Propiedades enviadas a Userpilot al iniciar sesión: <code>role</code> = Proveedor o Marca Blanca (el dashboard exclusivo para "Marcas" quedó pendiente por entregar), <code>country</code> = Colombia.
            </Field>
            <Field term="Métrica de ingreso (Page View)">Regla de "Page View" donde la URL sea exactamente la ruta del dashboard (ej. <code>*/dashboard</code>).</Field>
            <Field term="Frecuencia (activos semanales)">Usuarios con evento de Page View en el dashboard al menos 1 vez en los últimos 7 días.</Field>
          </div>

          <div style={{ ...metric, marginTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>B. Adopción de nuevas funcionalidades (Engagement)</div>
            <Field term="Denominador">Usuarios del Target con Page View en <code>*/dashboard</code>.</Field>
            <Field term="Numerador — Feature Tags">
              <List items={[
                "Evento Clic 1 (Filtro de fecha): clic sobre el selector de rango de tiempo (\"Últimos 30 días\") en la tarjeta de rendimiento superior.",
                "Evento Clic 2 (Descarga): clic sobre el ícono de descarga de la tarjeta de rendimiento.",
              ]} />
            </Field>
            <Field term="Cálculo">Usuarios únicos del Target que hicieron clic en cualquiera de los dos Feature Tags al menos una vez / total de usuarios únicos que visitaron el dashboard en 15 días.</Field>
          </div>

          <div style={{ ...metric, marginTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>C. Retención</div>
            <Field term="Evento de inicio (Día 0)">Page View en <code>*/dashboard</code>.</Field>
            <Field term="Evento de retorno (Día N)">El mismo usuario vuelve a hacer Page View en <code>*/dashboard</code>.</Field>
            <Field term="Meta">Curva estabilizada por encima del 50% en días consecutivos, segmentada a Proveedores y Marcas Blancas.</Field>
          </div>

          <div style={{ ...metric, marginTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>D. Satisfacción</div>
            <Field term="Pregunta">¿Qué tan fácil fue entender las métricas principales de tu operación hoy?</Field>
            <Field term="Opciones de respuesta">
              <List items={[
                "Mucho más difícil de lo esperado → Insatisfecho.",
                "Como esperaba → Satisfecho.",
                "Mucho más fácil de lo esperado → Satisfecho.",
              ]} />
            </Field>
            <Field term="Trigger de activación">
              Solo en <code>*/dashboard</code>, después de 30 segundos en la página o inmediatamente tras clic en una tarjeta de estado operativo ("Pendientes", "En curso", "Entregadas", etc.) o en "Más información".
            </Field>
            <Field term="Frecuencia">Una vez por usuario cada 15–30 días.</Field>
          </div>
        </Section>

        {/* 🧪 Metodología de Validación */}
        <Section icon="🧪" title="Metodología de Validación (Eventos y Comunicaciones · Userpilot)">
          <p style={{ ...body, marginBottom: 16 }}>Responsable: <strong>Laura Catherine Torres Ciendua</strong>.</p>
          <Field term="Objetivo de medición">
            Validar la usabilidad de las tarjetas de estado de órdenes y comprender si la gráfica de "Tendencia de Ventas" aporta claridad inmediata al usuario.
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 12 }}>
            <Field term="Tipo de rol">Proveedor, Marca, Marca Blanca.</Field>
            <Field term="Países">Colombia.</Field>
            <Field term="Segmento específico">Usuarios con al menos 10 órdenes generadas en el periodo actual.</Field>
          </div>
          <Field term="Módulo / pantalla">Página de inicio (Dashboard).</Field>
          <Field term="Flujo específico">Después de que el usuario interactúe con el enlace "Más información" en la sección de "Tus Órdenes".</Field>
          <Field term="Acción puntual a trackear">Clic en "Más información", clic en botón "Descargar imagen", clics en la fila de "Tus Reportes".</Field>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Duración de la encuesta">14 días post-lanzamiento.</Field>
            <Field term="Frecuencia">Una sola vez por usuario.</Field>
          </div>
        </Section>

        {/* 🗺️ Roadmap */}
        <Section icon="🗺️" title="Roadmap">
          <RoadmapGantt
            axisStart="2025-11"
            axisEnd="2026-10"
            fases={[
              {
                nombre: "Piloto Beta (usuarios seleccionados)",
                estado: "en-curso",
                inicio: "2025-11",
                fin: "2026-08",
                detalle: "Dashboard v2.0 en beta controlada con usuarios seleccionados de Proveedor, Marca y Marca Blanca desde noviembre de 2025.",
              },
              {
                nombre: "Lanzamiento General",
                estado: "proxima",
                inicio: "2026-09",
                fin: "2026-09",
                detalle: "Lanzamiento general a todos los perfiles activos (Proveedor, Marca, Marca Blanca) en Colombia. Fecha posible: 8 de septiembre de 2026.",
              },
            ]}
            nota="Piloto beta confirmado desde noviembre de 2025. Fecha de lanzamiento general (8 de septiembre de 2026) es posible, sujeta a confirmación del equipo."
          />
        </Section>

        {/* 🗓️ Esquema de Seguimiento */}
        <Section icon="🗓️" title="Esquema de Seguimiento (Piloto de 12 Semanas)">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 220 }}>Mes 1 (semanas 1–4) · Semanal</td>
                <td style={td}>Monitoreo de la adopción de la Hero Card, validación técnica de la correcta ejecución de la caché de 2 horas (para mitigar reclamos de datos) y revisión de las exclusiones globales de estados.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Mes 2 (semanas 5–8) · Quincenal</td>
                <td style={td}>Análisis de retención, evaluación de respuestas de la encuesta SEQ y detección de cuellos de botella en la navegación entre el tab "Mis Ventas" y "Proveeduría" en el rol Marca.</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Mes 3 (semanas 9–12) · Mensual</td>
                <td style={{ ...td, borderBottom: "none" }}>Medición final de impacto en reportes avanzados y cierre de la fase de pruebas para planear iteraciones futuras sobre el filtro de fechas personalizado (actualmente fuera de alcance).</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* 🚀 Propuesta de Lanzamiento */}
        <Section icon="🚀" title="Propuesta de Lanzamiento">
          <Field term="Nombre del feature">Nuevo Dashboard Operativo Dropi.</Field>
          <Field term="Tipo de lanzamiento">Lanzamiento Nuevo Feature.</Field>
          <Field term="Objetivo del lanzamiento">
            Informar a los usuarios sobre su nuevo centro de mando, educarlos en cómo leer la métrica del tacómetro (% de efectividad) y motivarlos a descargar sus resultados para generar prueba social.
          </Field>
          <Field term="Fecha esperada en producción">8 de septiembre de 2026 — fecha posible, sujeta a confirmación (el documento fuente la marcaba como "por confirmar").</Field>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Roles a los que aplica">Proveedor, Marca, Marca Blanca.</Field>
            <Field term="Países donde aplica">Colombia.</Field>
          </div>
          <Field term="Segmentación específica">Lanzamiento general a todos los perfiles activos mencionados.</Field>
          <Field term="Documentación requerida para el lanzamiento">
            <List items={[
              "Diseños de Figma.",
              "Guías interactivas Tango (Dashboard – Proveedores y Dashboard – Dropshippers / Marcas).",
              "Loom explicativo de las reglas de cálculo.",
            ]} />
          </Field>
          <Field term="¿Dudas frecuentes esperadas?">
            Sí. Es vital capacitar al equipo sobre la regla de exclusión global (cancelados, rechazados, anulados no suman) y la caché de 2 horas, ya que los usuarios podrían reportar falsos positivos pensando que sus órdenes en tiempo real no están subiendo.
          </Field>
          <Field term="¿Cambios en procesos actuales?">
            Sí — el ingreso a la plataforma mostrará inmediatamente las métricas sin necesidad de extraer reportes.
          </Field>
          <Field term="¿Capacitación previa?">
            Obligatoria para SAC. Se debe entender la homologación de los estados y de dónde surge el % del tacómetro.
          </Field>
          <Field term="Guion o respuesta sugerida">
            Crear un artículo en el Centro de Ayuda explicando "Por qué mis datos del Dashboard tienen un leve retraso (2h)" y "Cómo leer mi efectividad logística".
          </Field>
        </Section>

        {/* 🗓️ Weekly Status */}
        <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)">
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <WeeklySelector />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field term="Resumen de la semana">Sin novedades de seguimiento en el periodo. Pendiente sesión de trabajo para conciliar y acordar la atención de los ajustes reportados en QA.</Field>
            <Field term="Retos y Bloqueos">Fecha de lanzamiento a producción sin confirmar; pendiente sesión de trabajo para acordar los ajustes de QA reportados.</Field>
          </div>
        </Section>

        {/* 📊 Métricas de Seguimiento */}
        <Section icon="📊" title="Métricas de Seguimiento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 1 · Tasa de adopción diaria (Page View)</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: pendiente → Meta: pendiente</div>
            </div>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 2 · % Redirección a reportes secundarios</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Línea base: pendiente → Meta: pendiente</div>
            </div>
          </div>
          <Field term="Comentarios de rendimiento">
            Seguimiento en piloto de 12 semanas. Responsables: Miguel Ángel Gutiérrez (data / eventos backend), Laura Torres (comunicación / Userpilot) y Catalina Giraldo (comportamiento UX).
          </Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
