"use client";

import { useState } from "react";

type Nivel = "critico" | "medio" | "operativo";

interface Item {
  n: number;
  nivel: Nivel;
  dolor: string;
  oportunidad: string;
  tipo: string;
  resaltado?: boolean;
  nota?: string;
}

interface Segmento {
  key: string;
  nombre: string;
  icon: string;
  color: string;
  resumen: string;
  items: Item[];
  estrategicas?: string[];
}

const NIVEL_META: Record<Nivel, { label: string; bg: string; fg: string; dot: string }> = {
  critico: { label: "Crítico", bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626" },
  medio: { label: "Medio", bg: "#FEF3C7", fg: "#B45309", dot: "#F59E0B" },
  operativo: { label: "Operativo", bg: "#DBEAFE", fg: "#1D4ED8", dot: "#3B82F6" },
};

const PRIORITY_KEYS = ["dropshippers", "proveedores", "logistica"];

const segmentos: Segmento[] = [
  {
    key: "dropshippers",
    nombre: "Dropshippers",
    icon: "👤",
    color: "#0891B2",
    resumen: "Fricciones críticas en confianza logística, estafas y velocidad de operación.",
    items: [
      { n: 1, nivel: "critico", resaltado: true, dolor: "Sin trazabilidad logística ni evidencias de entrega", oportunidad: "Torre Logística con tracking en tiempo real + evidencias de entrega (foto/firma) en todas las paqueteras, código de verificación de pedido y guías con más información.", tipo: "Logística" },
      { n: 2, nivel: "medio", dolor: "Estafas: venden 'príncipes', entregan 'sapos'", oportunidad: "Validación anti-fraude de landing pages (Dropi PRO) + indicador de confianza visible desde órdenes.", tipo: "Trust & Safety" },
      { n: 3, nivel: "medio", dolor: "Sin notificaciones para reaccionar rápido ante novedades", oportunidad: "Notificaciones push en la APP con estatus en tiempo real.", tipo: "Notificaciones" },
      { n: 4, nivel: "critico", dolor: "Dropi Card con fricciones para el mercado mexicano", oportunidad: "Revisar el flujo de Dropi Card y su compatibilidad con bancos nacionales.", tipo: "Fintech" },
      { n: 5, nivel: "medio", dolor: "Sin validación del sitio web del drop al momento del alta", oportunidad: "Validar que el sitio existe, está activo y corresponde al negocio declarado.", tipo: "Onboarding" },
      { n: 6, nivel: "critico", resaltado: true, dolor: "No puede subir órdenes compuestas de forma masiva", oportunidad: "Carga masiva de órdenes compuestas — hoy afecta facturación y operatividad.", tipo: "Seller Success" },
      { n: 7, nivel: "critico", dolor: "Validación de direcciones difícil — alta tasa de error vs. estructura CO", oportunidad: "Integrar bases de datos de direcciones MEX + historial de entregas para sugerir correcciones.", tipo: "Datos" },
      { n: 8, nivel: "critico", dolor: "Disposición de fondos lenta (necesita acceso en <1h)", oportunidad: "Mejorar el flujo de liberación de fondos para operaciones confirmadas.", tipo: "Fintech" },
      { n: 9, nivel: "medio", dolor: "Sin alertas cuando un producto está por agotarse", oportunidad: "Alertas automáticas de stock crítico en el catálogo del drop.", tipo: "Catálogo" },
      { n: 10, nivel: "operativo", dolor: "Onboarding insuficiente, sin guía para usuarios nuevos", oportunidad: "Onboarding rediseñado con guía interactiva (benchmark con otras plataformas).", tipo: "Onboarding" },
      { n: 11, nivel: "critico", dolor: "Recargas limitadas a bancos no disponibles en México", oportunidad: "Habilitar SPEI, OXXO Pay y bancos locales como métodos de recarga.", tipo: "Pagos" },
    ],
  },
  {
    key: "proveedores",
    nombre: "Proveedores",
    icon: "🏭",
    color: "#7C3AED",
    resumen: "Necesitan control de inventario, visibilidad de ventas y confianza en procesos logísticos.",
    items: [
      { n: 1, nivel: "medio", dolor: "Déficit de capacitación para bodegas externas", oportunidad: "Onboarding + tutoriales in-app para el uso de bodegas externas.", tipo: "Capacitación" },
      { n: 2, nivel: "medio", dolor: "Sin compatibilidad automática bodega ↔ transportadoras", oportunidad: "Integración nativa al configurar el producto, sin pasos manuales.", tipo: "Integración" },
      { n: 3, nivel: "medio", dolor: "Sin certificado de calidad del producto en Dropi", oportunidad: "Certificación in-platform (validación Dropi o por comunidad, con reviews).", tipo: "Trust & Quality" },
      { n: 4, nivel: "critico", dolor: "Sin visibilidad de qué drops venden sus productos ni con qué efectividad", oportunidad: "Dashboard con top drops, efectividad de entrega y volumen de órdenes activas.", tipo: "Analytics" },
      { n: 5, nivel: "medio", resaltado: true, dolor: "Productos 'muertos' sin ventas que el proveedor no detecta", oportunidad: "Alertas de bajo rendimiento + indicadores de salud del producto.", tipo: "Catálogo" },
      { n: 6, nivel: "operativo", dolor: "Sin alertas de stock mínimo — se quedan sin inventario sin anticipación", oportunidad: "Alertas de stock mínimo configurables.", tipo: "Inventario" },
      { n: 7, nivel: "critico", dolor: "Devoluciones sin trazabilidad — no saben si llegaron ni cuándo", oportunidad: "Módulo de devoluciones con estado, ubicación y tiempo estimado de retorno.", tipo: "Logística reversa" },
      { n: 8, nivel: "operativo", dolor: "Canales de comunicación poco efectivos para resolver incidencias", oportunidad: "Comunicación directa in-app con SLA visible.", tipo: "Comunicación" },
      { n: 9, nivel: "critico", resaltado: true, dolor: "Robos o cambios de paquetes sin mecanismo claro de reclamación", oportunidad: "Protocolo de reclamación con evidencias (foto, firma digital) + Torre Logística.", tipo: "Trust", nota: "Pregunta abierta del workshop: ¿qué célula sería responsable de este proceso?" },
      { n: 10, nivel: "medio", dolor: "Sin productos o unidades privatizadas para drops específicos", oportunidad: "Asignación exclusiva de productos a drops o grupos seleccionados.", tipo: "Catálogo" },
    ],
  },
  {
    key: "logistica",
    nombre: "Logística",
    icon: "🚚",
    color: "#0D9488",
    resumen: "Dolores con impacto transversal en todos los segmentos: trazabilidad, cobertura y comunicación con cliente final.",
    items: [
      { n: 1, nivel: "medio", dolor: "Sin trazabilidad en la creación de bodegas externas", oportunidad: "Flujo de aprobación + bitácora de creación de bodegas.", tipo: "Auditoría" },
      { n: 2, nivel: "critico", dolor: "Panel de recolecciones con limitaciones funcionales críticas", oportunidad: "Levantar requerimientos operativos y rediseñar el panel.", tipo: "Rediseño" },
      { n: 3, nivel: "critico", dolor: "Validación insuficiente de códigos postales", oportunidad: "Validación automática de CP + integración con Sepomex.", tipo: "Cobertura" },
      { n: 4, nivel: "critico", dolor: "Sin notificaciones de estatus de guía al cliente final", oportunidad: "Notificaciones automáticas de seguimiento en cada etapa del envío.", tipo: "Notificaciones" },
      { n: 5, nivel: "medio", dolor: "Archivos de transportadoras manuales — generan errores y retrasos", oportunidad: "Automatización de archivos con actualización dinámica.", tipo: "Automatización" },
      { n: 6, nivel: "critico", dolor: "Bodegas externas de ecom generan pedidos duplicados", oportunidad: "Diagnóstico y corrección del flujo ecom con bodegas externas.", tipo: "Bug" },
      { n: 7, nivel: "critico", dolor: "LOGIAPP con fricciones críticas, manuales desactualizados", oportunidad: "Actualizar manuales y guías + matriz en línea con estadísticas e IA.", tipo: "LOGIAPP" },
      { n: 8, nivel: "critico", dolor: "Torre de Control inexistente — sin seguimiento de ciudades ni CP", oportunidad: "Torre de Control: seguimiento de ciudades, efectividad y activación de CP.", tipo: "Torre de Control" },
      { n: 9, nivel: "critico", resaltado: true, dolor: "Sin código de seguridad para validar que el paquete llegó a la persona correcta", oportunidad: "Código de verificación que el destinatario confirma al momento de la entrega.", tipo: "Trust · Entrega" },
      { n: 10, nivel: "critico", dolor: "Guías impresas sin control claro de qué se despacha", oportunidad: "Estandarizar generación e impresión de guías con validaciones previas.", tipo: "Operaciones" },
      { n: 11, nivel: "medio", dolor: "Torre Logística ausente o incompleta para seguimiento end-to-end", oportunidad: "Consolidar Torre Logística como centro de visibilidad de toda la operación.", tipo: "Torre Logística" },
    ],
  },
  {
    key: "marcas",
    nombre: "Marcas y Emprendedores",
    icon: "🛍",
    color: "#F77F00",
    resumen: "Necesitan multicanal, visibilidad y un perfil que comunique su valor.",
    items: [
      { n: 1, nivel: "critico", dolor: "Quieren vender en Amazon/ML y Dropi no lo facilita", oportunidad: "Integración multicanal vía StockPro.", tipo: "Multicanal" },
      { n: 2, nivel: "critico", dolor: "Devoluciones sin control de mercancía — desconfianza de proveedores", oportunidad: "Módulo de devoluciones con trazabilidad.", tipo: "Logística reversa" },
      { n: 3, nivel: "medio", dolor: "Sin perfil de marca en la plataforma", oportunidad: "Perfil de marca público (referencia: Tiendanube).", tipo: "Branding" },
      { n: 4, nivel: "medio", dolor: "Sin canal de comunicación directo marca → drops", oportunidad: "Canal de comunicación con anuncios y novedades de catálogo.", tipo: "Comunicación" },
      { n: 5, nivel: "critico", dolor: "El WMS de Dropi no sincroniza con el inventario físico real", oportunidad: "Sincronización WMS digital ↔ físico en tiempo real.", tipo: "WMS" },
      { n: 6, nivel: "operativo", dolor: "Inventario gestionado en múltiples plataformas sin integración", oportunidad: "Módulo de inventario centralizado o conectores (Shopify, ML, Amazon).", tipo: "Inventario" },
      { n: 7, nivel: "operativo", dolor: "Ingreso de mercancía manual, sin flujo claro", oportunidad: "Flujo guiado de ingreso con validaciones y visibilidad de estado.", tipo: "Flujo de ingreso" },
    ],
    estrategicas: [
      "Análisis de competencia internacional: cómo compite Dropi con marcas internacionales en MEX.",
      "Dropi como hub logístico multicanal: StockPro + bodegas MEX como diferenciador clave en MEX.",
      "Investigación de usuario Marca: cómo navega, dónde se pierde y qué necesita dentro de Dropi.",
    ],
  },
  {
    key: "administrativo",
    nombre: "Administrativo",
    icon: "🏢",
    color: "#6366F1",
    resumen: "El equipo opera con visibilidad limitada, sin herramientas adaptadas al contexto local y sin tropicalización de procesos.",
    items: [
      { n: 1, nivel: "critico", dolor: "Limitantes de permisos y creación de usuarios", oportunidad: "Rediseño del modelo de permisos y roles por perfil y mercado.", tipo: "Admin" },
      { n: 2, nivel: "critico", dolor: "Sin visibilidad de procesos CO ↔ MEX (retiros, clientes)", oportunidad: "Herramienta de management y visibilidad CO ↔ MEX.", tipo: "Visibilidad" },
      { n: 3, nivel: "critico", dolor: "Sin tropicalización: Sell-in ≠ Sell-out en MEX", oportunidad: "Adaptar la lógica de negocio al contexto MEX.", tipo: "Tropicalización" },
      { n: 4, nivel: "medio", dolor: "Limitaciones de visibilidad operativa — el equipo opera 'ciego'", oportunidad: "Dashboard de visibilidad operativa con alertas 360.", tipo: "Dashboard" },
      { n: 5, nivel: "medio", dolor: "Sin comunicación interna estructurada de actualizaciones", oportunidad: "NEWS internos + canal de alertas.", tipo: "Comunicación interna" },
      { n: 6, nivel: "operativo", dolor: "Sin visualización clara de usuarios en la plataforma", oportunidad: "Mejorar visualización: estados, actividad y métricas por perfil.", tipo: "Admin" },
      { n: 7, nivel: "operativo", dolor: "Comunicación al usuario interno sin canales definidos", oportunidad: "Definir canales y flujos de comunicación interna.", tipo: "Comunicación" },
    ],
    estrategicas: [
      "Capacitación interna en herramientas: programa estructurado para que el equipo MEX adopte y enseñe el producto.",
      "Alertas de producto para el equipo: nuevas herramientas, fechas de lanzamiento y tutoriales — MEX debe ser el primero en saber.",
    ],
  },
  {
    key: "procesos",
    nombre: "Procesos con Producto",
    icon: "⚙️",
    color: "#EC4899",
    resumen: "Cómo fluye hoy la comunicación entre el equipo MEX y el equipo de producto CO, y qué cambios estructurales se necesitan.",
    items: [
      { n: 1, nivel: "critico", dolor: "Sin canal ni responsable definido para comunicar necesidades de MEX a CO", oportunidad: "JIRA como canal oficial de solicitudes, documentado y sin depender de contactos directos.", tipo: "JIRA" },
      { n: 2, nivel: "critico", dolor: "Info de lanzamientos no llega actualizada al equipo MEX", oportunidad: "Ritmo mensual de actualización + newsletter interno.", tipo: "Comunicación interna" },
      { n: 3, nivel: "critico", dolor: "JIRA solo pone a MEX en cola, sin visibilidad del proceso", oportunidad: "Mesas trimestral/bimestral MEX ↔ CO para discovery y alineación.", tipo: "Discovery" },
      { n: 4, nivel: "medio", dolor: "Sin visibilidad de qué construye CO ni por qué", oportunidad: "Socialización del roadmap y resultados de following por país.", tipo: "Roadmap" },
      { n: 5, nivel: "medio", dolor: "Comunicaciones internas fragmentadas (Google chats, WA, correo)", oportunidad: "Centralizar en WA + canales definidos.", tipo: "Comunicación" },
      { n: 6, nivel: "operativo", dolor: "LOGIAPP: MEX entra en cola sin claridad ni manuales actualizados", oportunidad: "Publicar manuales + aprovechar IA para automatizar reportes.", tipo: "LOGIAPP" },
      { n: 7, nivel: "operativo", dolor: "Userpilot subutilizado en MEX", oportunidad: "Capacitación en Userpilot para el equipo.", tipo: "Userpilot" },
    ],
  },
];

const ACUERDOS = [
  "Mesa semanal de marketing: espacio recurrente entre MEX y el equipo de producto/marketing CO para alinear novedades, resultados y prioridades.",
  "Sesión mensual de actualización: CO socializa qué cambió, qué se lanzó y qué viene — MEX sale de operar con información desactualizada.",
  "Sesión trimestral/bimestral de discovery: espacio para que MEX comparta insights de mercado, conozca el roadmap y participe en nuevos proyectos.",
  "Socialización de resultados de following por país: MEX recibe los resultados del following de producto CO a nivel país.",
  "2do Workshop con equipo comercial: ampliar la perspectiva de mercado con el equipo comercial de MEX.",
  "Espacio específico con Logística: sesión dedicada entre producto CO y logística MEX para profundizar en los dolores operativos críticos.",
];

const PROXIMOS_PASOS: { accion: string; segmento: string; descripcion: string; prioridad: "inmediata" | "q3"; }[] = [
  { accion: "Torre Logística + evidencias", segmento: "Drop · Prov · Log", descripcion: "Trazabilidad en tiempo real y evidencias de entrega para todas las paqueteras. El más crítico y transversal del workshop.", prioridad: "inmediata" },
  { accion: "Herramienta anti-estafas", segmento: "Dropshipper", descripcion: "Validación de landing page del drop para detectar fraudes al comprador final.", prioridad: "inmediata" },
  { accion: "Notificaciones APP", segmento: "Drop · Marca · Log", descripcion: "Notificaciones push de estatus de órdenes. Impacta todos los segmentos.", prioridad: "inmediata" },
  { accion: "Módulo de devoluciones", segmento: "Prov · Marca", descripcion: "Trazabilidad completa con evidencias. Resuelve desconfianza del proveedor y falta de control de marca.", prioridad: "inmediata" },
  { accion: "Torre de Control Logística", segmento: "Logística", descripcion: "Panel de seguimiento de ciudades, efectividad y activación de CP.", prioridad: "inmediata" },
  { accion: "Código de seguridad de entrega", segmento: "Logística", descripcion: "Verificación de identidad del destinatario al momento de la entrega.", prioridad: "inmediata" },
  { accion: "Canal oficial MEX → CO en JIRA", segmento: "Procesos", descripcion: "Documentar solicitudes de MEX en JIRA con contexto. Elimina dependencia de contactos directos.", prioridad: "inmediata" },
  { accion: "Mesa mensual + trimestral CO ↔ MEX", segmento: "Procesos", descripcion: "Ritmo de actualización mensual + sesión trimestral de discovery y alineación de roadmap.", prioridad: "inmediata" },
  { accion: "Revisión de permisos y roles", segmento: "Administrativo", descripcion: "Modelo de permisos granular por perfil y mercado. Habilita autonomía del equipo MEX.", prioridad: "q3" },
  { accion: "Integración multicanal (StockPro)", segmento: "Marca", descripcion: "Conectar bodegas MEX con Amazon, ML y otros canales. Diferenciador clave para marcas en MEX.", prioridad: "q3" },
  { accion: "Integración Sepomex + cobertura", segmento: "Logística", descripcion: "Validar CP con Sepomex. Abrir nuevas ciudades y CP basado en data de demanda.", prioridad: "q3" },
];

function NivelBadge({ nivel }: { nivel: Nivel }) {
  const meta = NIVEL_META[nivel];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.fg,
      padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot, display: "inline-block" }} />
      {meta.label}
    </span>
  );
}

export default function OportunidadesPaisesPage() {
  const [selected, setSelected] = useState<string>("todos");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [contextOpen, setContextOpen] = useState(false);

  const visibles = selected === "todos" ? segmentos : segmentos.filter((s) => s.key === selected);
  const prioritarios = visibles.filter((s) => PRIORITY_KEYS.includes(s.key));

  const totalItems = segmentos.reduce((acc, s) => acc + s.items.length, 0);
  const totalResaltados = segmentos.reduce((acc, s) => acc + s.items.filter((i) => i.resaltado).length, 0);
  const totalInmediatas = PROXIMOS_PASOS.filter((p) => p.prioridad === "inmediata").length;

  function toggle(key: string) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Oportunidades Países</span>
      </header>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#059669", padding: "3px 9px", borderRadius: 20 }}>
              OP-001
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#F0FDF4", color: "#15803D", padding: "3px 9px", borderRadius: 20 }}>
              Insights consolidados
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Oportunidades Países · Workshop MX 🚀
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, maxWidth: 720, marginBottom: 10 }}>
            Workshop Dropi MEX × Equipo de Producto: dolores y oportunidades por segmento. La prioridad se define
            por los resaltados en rojo/rosado que el equipo dejó en el documento original, no por la columna de texto.
          </p>
          <a
            href="https://docs.google.com/document/d/1nI-Sxs4m0sKiDh9j6qXvSTPcV3BXLB7ok1TL6VyAuxs/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12.5, fontWeight: 600, color: "var(--dropi)", textDecoration: "none",
            }}
          >
            📄 Ver documento original del workshop ↗
          </a>
        </div>

        {/* Contexto del workshop */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 24, overflow: "hidden" }}>
          <button
            onClick={() => setContextOpen(!contextOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Contexto del workshop</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>3 jun 2026 · MEX × CO</span>
            <span style={{
              fontSize: 16, color: "var(--muted)", display: "inline-block",
              transform: contextOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
            }}>⌄</span>
          </button>
          {contextOpen && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {[
                  { label: "Fecha", value: "Miércoles 3 de junio · 10:00–11:30am" },
                  { label: "Participantes", value: "Sebastian Hernandez (MEX) · Laura Contreras, PDL (Producto CO)" },
                  { label: "Segmentos documentados", value: "Dropshippers · Proveedores · Marcas · Logística · Administrativo · Procesos" },
                  { label: "Estado", value: "Insights consolidados, listos para revisión y priorización" },
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                      {f.label}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.4 }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Agenda
                </div>
                <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--fg)", lineHeight: 1.8 }}>
                  <li>Presentémonos — 5 min</li>
                  <li>Bloque A · El producto digital — 20 min: dolores y oportunidades del producto por usuario</li>
                  <li>Bloque B · Los procesos con el área de producto — 30 min: dolores y oportunidades del proceso</li>
                  <li>Conclusiones y cierre — 15 min</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Segmentos mapeados", value: "6", color: "var(--dropi)" },
            { label: "Painpoints totales", value: String(totalItems), color: "#3B82F6" },
            { label: "Resaltados a mapear ya", value: String(totalResaltados), color: "#DC2626" },
            { label: "Acciones inmediatas", value: String(totalInmediatas), color: "#15803D" },
          ].map((c) => (
            <div key={c.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>{c.value}</div>
              <div style={{ marginTop: 10, height: 4, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", background: c.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Filtros por segmento */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {[{ key: "todos", nombre: "Todos", icon: "🗂️" }, ...segmentos.map((s) => ({ key: s.key, nombre: s.nombre, icon: s.icon }))].map((f) => {
            const active = selected === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setSelected(f.key)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  padding: "7px 13px", borderRadius: 20,
                  border: active ? "1px solid var(--dropi)" : "1px solid var(--border)",
                  background: active ? "var(--dropi-light)" : "#fff",
                  color: active ? "var(--dropi)" : "var(--muted)",
                }}
              >
                <span>{f.icon}</span>{f.nombre}
              </button>
            );
          })}
        </div>

        {/* SECCIÓN A — Prioridad: resaltados en rojo en el doc original */}
        {prioritarios.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>🎯 Prioridad — mapear primero con las células</h2>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18, maxWidth: 680 }}>
              Painpoints que el equipo resaltó en rojo/rosado directamente en el Google Doc del workshop, dentro de
              Dropshippers, Proveedores y Logística. Este resaltado manual es el criterio de prioridad — no siempre
              coincide con el texto de la columna &quot;Criticidad&quot; de la tabla, que quedó como referencia secundaria.
            </p>

            {prioritarios.map((s) => {
              const resaltados = s.items.filter((i) => i.resaltado);
              if (resaltados.length === 0) return null;
              return (
                <div key={s.key} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.nombre}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>· {resaltados.length} resaltados</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                    {resaltados.map((item) => (
                      <div key={item.n} style={{
                        background: "#fff", border: "1px solid #FCA5A5",
                        borderLeft: "3px solid #DC2626",
                        borderRadius: 12, padding: "14px 16px",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#B91C1C",
                            padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
                          }}>
                            🔴 Resaltado
                          </span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", background: "#F3F4F6", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
                            {item.tipo}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 6, lineHeight: 1.4 }}>
                          {item.dolor}
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
                          → {item.oportunidad}
                        </div>
                        {item.nota && (
                          <div style={{ fontSize: 11.5, color: "#B45309", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 10px", marginTop: 8, lineHeight: 1.4 }}>
                            💬 {item.nota}
                          </div>
                        )}
                        <div style={{ marginTop: 8 }}>
                          <NivelBadge nivel={item.nivel} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SECCIÓN B — Resto de painpoints */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>📋 Resto de painpoints por segmento</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16, maxWidth: 680 }}>
            Registro completo de los 6 segmentos para consulta — incluye lo que no quedó resaltado en Dropshippers,
            Proveedores y Logística, y los tres segmentos que aún no se priorizan para mapeo inmediato (Marcas,
            Administrativo, Procesos). La columna de nivel (Crítico/Medio/Operativo) queda como referencia del texto original.
          </p>

          {visibles.map((s) => {
            const items = PRIORITY_KEYS.includes(s.key) ? s.items.filter((i) => !i.resaltado) : s.items;
            const isOpen = open[s.key] ?? false;
            return (
              <div key={s.key} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                <button
                  onClick={() => toggle(s.key)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{s.nombre}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", flex: 1 }}>{s.resumen}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", background: "#F3F4F6", padding: "2px 8px", borderRadius: 20 }}>
                    {items.length}
                  </span>
                  <span style={{ fontSize: 16, color: "var(--muted)", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>⌄</span>
                </button>
                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    {items.map((item, idx) => (
                      <div key={item.n} style={{
                        display: "flex", gap: 12, alignItems: "flex-start",
                        padding: "10px 16px", borderTop: idx === 0 ? "none" : "1px solid #F3F4F6",
                      }}>
                        <NivelBadge nivel={item.nivel} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", lineHeight: 1.4 }}>{item.dolor}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4, marginTop: 2 }}>→ {item.oportunidad}</div>
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", background: "#F8FAFC", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
                          {item.tipo}
                        </span>
                      </div>
                    ))}
                    {s.estrategicas && (
                      <div style={{ padding: "12px 16px", background: "#F8FAFC", borderTop: "1px solid #F3F4F6" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                          Oportunidades estratégicas
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--fg)", lineHeight: 1.6 }}>
                          {s.estrategicas.map((e) => <li key={e}>{e}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SECCIÓN C — Conclusiones */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>🤝 Acuerdos del workshop</h2>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "6px 20px" }}>
            {ACUERDOS.map((a, idx) => (
              <div key={a} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: idx === 0 ? "none" : "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--dropi)", flexShrink: 0 }}>{idx + 1}.</span>
                <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN D — Próximos pasos */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>🚀 Próximos pasos — plan consolidado</h2>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {PROXIMOS_PASOS.map((p, idx) => (
              <div key={p.accion} style={{
                display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 20px",
                borderTop: idx === 0 ? "none" : "1px solid #F3F4F6",
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", padding: "3px 9px", borderRadius: 20,
                  background: p.prioridad === "inmediata" ? "#FEE2E2" : "#FEF3C7",
                  color: p.prioridad === "inmediata" ? "#B91C1C" : "#B45309",
                }}>
                  {p.prioridad === "inmediata" ? "🔴 Inmediata" : "🟡 Q3 2025"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{p.accion}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>{p.descripcion}</div>
                </div>
                <span style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0 }}>{p.segmento}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
          Documento generado a partir del Workshop MEX × Producto — Dropi · Junio 2026
        </p>
      </div>
    </main>
  );
}
