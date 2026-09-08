import HubFooter from "@/components/HubFooter";
import Breadcrumb from "@/components/Breadcrumb";

type Fila = {
  celula: string;
  slug: string;
  porcentaje: number;
  criterios: [string, boolean][];
  evidencia: string;
  citas: string;
};

// Contenido vivo del proyecto PRO-001 (Service design: Entendimiento 360 del
// ecosistema, célula Product team). Cada fila viene de la auditoría real
// hecha contra Confluence — mismo texto/porcentaje que siembra
// hub/supabase/054_service_design_360.sql. Al documentarse contenido nuevo
// por célula, esta página se actualiza a mano junto con la migración/PATCH
// que mueve el % en el tracker (/proyectos/service-design-360).

const POR_USUARIO: Fila[] = [
  {
    celula: "Sellers", slug: "sellers", porcentaje: 100,
    criterios: [
      ["Segmentos nombrados y diferenciados", true],
      ["Necesidades/dolores documentados por segmento", true],
      ["Evidencia/datos reales citados", true],
      ["Centralizado en una página de referencia", true],
    ],
    evidencia: "6 segmentos con personas reales (S1 Cristhian Salazar/Maribel Torres … S6 David Cifuentes/Sara Macarena Villanueva), base de 825 encuestados + entrevistas, con necesidad dominante y dolor por segmento. Sub-perfiles oficiales (Rebuscador Digital, Empleado Aspirante, Joven Visionario) confirmados aparte.",
    citas: "Journey Map de Dropshippers — Confluence 1530724427; Contexto General y Marco Común — 1484292098",
  },
  {
    celula: "Suppliers", slug: "suppliers", porcentaje: 75,
    criterios: [
      ["Segmentos nombrados y diferenciados", true],
      ["Necesidades/dolores documentados por segmento", true],
      ["Evidencia/datos reales citados", true],
      ["Centralizado en una página de referencia", false],
    ],
    evidencia: "Segmentos Caliente/Tibio/Frío con tasas de activación reales (4–6.1% / 3.4–3.7% / 0.4%) sobre 5.771 suppliers. Nace de un proyecto puntual de activación, no de un mandato de célula ya cerrado — la \"Visión de producto Proveedores\" oficial sigue en \"represado · validar\".",
    citas: "TTV en Activación de Proveedores — 1531052043; Supplier Success 2026·S2 — 1483636739",
  },
  {
    celula: "Brands", slug: "brands", porcentaje: 100,
    criterios: [
      ["Segmentos nombrados y diferenciados", true],
      ["Necesidades/dolores documentados por segmento", true],
      ["Evidencia/datos reales citados", true],
      ["Centralizado en una página de referencia", true],
    ],
    evidencia: "5 segmentos por volumen (Iniciando…Escalando) + sub-perfiles oficiales Emprendedor/Marca + 4 casos reales con dolor citado textualmente. Respaldado por encuesta a 3.794 marcas y CSAT in-app ya en producción.",
    citas: "Clasificación y Segmentación de Marcas — 1532526605; Brands Success 2026·S2 — 1485078530",
  },
  {
    celula: "Logística", slug: "logistica", porcentaje: 0,
    criterios: [
      ["Segmentos nombrados y diferenciados", false],
      ["Necesidades/dolores documentados por segmento", false],
      ["Evidencia/datos reales citados", false],
      ["Centralizado en una página de referencia", false],
    ],
    evidencia: "No encontrado. La propia célula reconoce el gap: la lente \"por perfil\" (qué resuelve la logística para dropshipper/marca/proveedor/transportadora) está listada como pendiente de construir en su Product Backlog — es la célula con más brecha en este frente de todo el ecosistema.",
    citas: "Logistic Success 2026·S2 — 1485471746",
  },
  {
    celula: "Backoffice", slug: "backoffice", porcentaje: 75,
    criterios: [
      ["Segmentos nombrados y diferenciados", true],
      ["Necesidades/dolores documentados por segmento", true],
      ["Evidencia/datos reales citados", true],
      ["Centralizado en una página de referencia", false],
    ],
    evidencia: "Perfiles reales (Dropshipper/Proveedor/Marca/Back Office) con datos duros: 29.754 cuentas en Colombia, solo 0.8% verificadas. Nace del proyecto de Validación de Identidad — no hay una página de perfiles consolidada a nivel de toda la célula.",
    citas: "Validación de identidad — 1533050893; Operaciones/Backoffice 2026·S2 — 1485602819",
  },
  {
    celula: "Growth", slug: "growth", porcentaje: 75,
    criterios: [
      ["Segmentos nombrados y diferenciados", true],
      ["Necesidades/dolores documentados por segmento", true],
      ["Evidencia/datos reales citados", true],
      ["Centralizado en una página de referencia", false],
    ],
    evidencia: "Niveles Leyendas (Bienvenido → Explorador → Master → Experto → Sabio VIP → Leyenda) con necesidad y comportamiento por nivel. El sub-perfil \"líder de comunidad\", que Growth también alimenta, sigue \"por definir\" — no hay ficha de arquetipos propia de Growth en el Dropi Brain.",
    citas: "Jira TECH-147; Intervention Brief Page Pilot — 1510965275; Contexto General y Marco Común — 1484292098",
  },
  {
    celula: "Growth Marketing", slug: "growth-marketing", porcentaje: 0,
    criterios: [
      ["Segmentos nombrados y diferenciados", false],
      ["Necesidades/dolores documentados por segmento", false],
      ["Evidencia/datos reales citados", false],
      ["Centralizado en una página de referencia", false],
    ],
    evidencia: "No encontrado. \"Product Growth Marketing\" figura en el índice de direccionamiento como equipo de Product Ops en estado PENDIENTE, sin territorio de usuario propio — vale confirmar con Laura si esto es un vacío de documentación o una categoría mal planteada antes de tratarlo como pendiente de escribir.",
    citas: "Índice de direccionamiento 2026·S2 — 1484029954",
  },
  {
    celula: "Experience", slug: "experience", porcentaje: 100,
    criterios: [
      ["Segmentos nombrados y diferenciados", true],
      ["Necesidades/dolores documentados por segmento", true],
      ["Evidencia/datos reales citados", true],
      ["Centralizado en una página de referencia", true],
    ],
    evidencia: "5 perfiles diferenciados (Dropshipper, Proveedor, Emprendedor/Marca, Híbrido, Administrador) con madurez y research fechado (sesiones jul–ago 2025, benchmark Shopify/MercadoLibre). Matiz: nace de un solo proyecto (Rediseño Módulo de Órdenes) — a nivel célula, \"entender la demografía de los usuarios\" sigue sin marcar en el direccionamiento oficial.",
    citas: "Rediseño Módulo de Órdenes — 1532362764; Mejora Continua de Experiencia — 1485766685",
  },
  {
    celula: "Fintech", slug: "fintech", porcentaje: 0,
    criterios: [
      ["Segmentos nombrados y diferenciados", false],
      ["Necesidades/dolores documentados por segmento", false],
      ["Evidencia/datos reales citados", false],
      ["Centralizado en una página de referencia", false],
    ],
    evidencia: "No encontrado. Direccionamiento de célula sigue PENDIENTE; el único discovery propio habla de \"usuarios activos de Dropi\" en genérico, sin segmentar.",
    citas: "Jira PROD-507; Índice de direccionamiento 2026·S2 — 1484029954",
  },
];

const POR_PROCESO: Fila[] = [
  {
    celula: "Sellers", slug: "sellers", porcentaje: 100,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", true],
    ],
    evidencia: "Journey completo login → catálogo → orden, con fricciones móviles, protocolo de rescate para segmentos en riesgo (5–7 días sin vender), fugas priorizadas P0/P1/P2 y métricas propias por etapa y por segmento.",
    citas: "Journey Map de Dropshippers — 1530724427",
  },
  {
    celula: "Suppliers", slug: "suppliers", porcentaje: 100,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", true],
    ],
    evidencia: "AS-IS (Registro → Bodega → Producto, descrito como \"carrera de obstáculos fragmentada\") y pipeline TO-BE completo. Fugas explícitas (43% omite el diagnóstico inicial) y métricas de funnel + SLA por etapa. Alcance limitado a onboarding/activación — no cubre logística ni posventa del proveedor.",
    citas: "TTV en Activación de Proveedores — 1531052043",
  },
  {
    celula: "Brands", slug: "brands", porcentaje: 50,
    criterios: [
      ["Journey end-to-end documentado", false],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", false],
    ],
    evidencia: "El Mapa de Servicio formal todavía no existe: está agendado en 3 entregas (v0 ago, v1 sep, versión final con blueprint en diciembre 2026). Ya hay, eso sí, un hallazgo cualitativo real y citado: \"el dolor no es de plataforma, es de servicio (Guías/Novedades/Soporte)\".",
    citas: "Jira PROD-1886; Cronograma de Trabajo — 1529610242; EXP-01 — 1533542402",
  },
  {
    celula: "Logística", slug: "logistica", porcentaje: 100,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", true],
    ],
    evidencia: "El journey más completo de todo el ecosistema: creación de orden → confirmación → guía → recolección → cross docking → bodega → transportadora → entrega/devolución, con caso real paso a paso. Fugas explícitas (sin validador de direcciones, recolección reactiva, CAS congestionado) y métricas duras (entrega ≥70%, SLA de 24h en novedades).",
    citas: "Órdenes: el cerebro detrás de las órdenes — 1522761734; Logística: el core de Dropi — 1531379716; Posventa: garantías — 1530658839",
  },
  {
    celula: "Backoffice", slug: "backoffice", porcentaje: 100,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", true],
    ],
    evidencia: "Pipeline TO-BE de 7 etapas con 28 reglas de negocio y meta de funnel (&lt;8% revisión manual). Ojo: la propia célula admite no tener SLAs ni métricas formales a nivel general — esta fortaleza vive solo dentro del proyecto de Validación de Identidad, todavía no es práctica transversal.",
    citas: "Validación de identidad — 1533050893; Panorama general — 1530822715",
  },
  {
    celula: "Growth", slug: "growth", porcentaje: 75,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", false],
    ],
    evidencia: "La cadena de valor de 7 etapas del ecosistema le asigna a Growth Educación (Academy), con un gap explícito en Fidelización y una fuga nombrada directamente: \"Academy hoy no enseña a gestionar una orden\". Sin métricas propias por etapa del journey — solo KPIs de rol (LTV, Retención).",
    citas: "Contexto General y Marco Común — 1484292098; Academy — 1531445251",
  },
  {
    celula: "Growth Marketing", slug: "growth-marketing", porcentaje: 0,
    criterios: [
      ["Journey end-to-end documentado", false],
      ["Touchpoints de experiencia/servicio", false],
      ["Fugas/dolores identificados explícitamente", false],
      ["Métricas ligadas a las etapas", false],
    ],
    evidencia: "No encontrado. Lo más cercano es el marco TARS, pero mide adopción de funcionalidades lanzadas — no es un journey de usuario de esta célula.",
    citas: "Contexto General y Marco Común, §4.7 — 1484292098",
  },
  {
    celula: "Experience", slug: "experience", porcentaje: 100,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", true],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", true],
    ],
    evidencia: "AS-IS/TO-BE del módulo de Órdenes con 5 painpoints documentados y un catálogo de eventos ya definido. Matiz: la sección de medición real todavía está sin diligenciar — los eventos están definidos, pero sin datos reportados todavía.",
    citas: "Rediseño Módulo de Órdenes — 1532362764",
  },
  {
    celula: "Fintech", slug: "fintech", porcentaje: 50,
    criterios: [
      ["Journey end-to-end documentado", true],
      ["Touchpoints de experiencia/servicio", false],
      ["Fugas/dolores identificados explícitamente", true],
      ["Métricas ligadas a las etapas", false],
    ],
    evidencia: "Fricción real documentada: \"Dropipay aparece únicamente al final del flujo de retiro, en un dropdown largo, sin ninguna propuesta de valor\". Sin touchpoints de servicio propios ni métricas por etapa. El journey de pagos más completo (framework HEART, Confío/México) es ownership de Backoffice, no de Fintech — no se cuenta acá para no inflar el número.",
    citas: "Jira PROD-507; (referencia excluida: Confío — Módulo de pagos México, 1531772978, es de Backoffice)",
  },
];

function Seccion({ titulo, detalle, filas }: { titulo: string; detalle: string; filas: Fila[]; }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{titulo}</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>{detalle}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filas.map((f) => (
          <div key={f.slug} id={`${titulo === "Por usuario" ? "usuario" : "proceso"}-${f.slug}`} style={{
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, scrollMarginTop: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{f.celula}</h3>
              <span style={{ fontSize: 12, fontWeight: 700, color: f.porcentaje >= 75 ? "#047857" : f.porcentaje >= 50 ? "#B45309" : f.porcentaje > 0 ? "#B91C1C" : "var(--muted)" }}>
                {f.porcentaje}% documentado
              </span>
            </div>

            <ul style={{ margin: "0 0 10px", paddingLeft: 18, fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
              {f.criterios.map(([texto, cumplido]) => (
                <li key={texto} style={{ color: cumplido ? "var(--fg)" : "var(--muted)" }}>
                  {cumplido ? "✅" : "⬜"} {texto}
                </li>
              ))}
            </ul>

            <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: "0 0 8px" }} dangerouslySetInnerHTML={{ __html: f.evidencia }} />
            <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0, fontStyle: "italic" }}>Fuente: {f.citas}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Entendimiento360GuiaPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "20px 32px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <Breadcrumb items={[{ label: "Guías", href: "/guias" }, { label: "Entendimiento 360 del ecosistema" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                🧭 Entendimiento 360 del ecosistema
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Qué sabemos hoy de cada célula — por usuario y por proceso. Proyecto{" "}
                <a href="/proyectos/service-design-360" style={{ color: "var(--dropi)" }}>PRO-001</a>, Product team.
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 18, marginBottom: 32, fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}>
            El % de cada célula sale de 4 criterios objetivos por frente (25% c/u) auditados contra la documentación real en
            Confluence al 2026-09-01 — no es una cifra a ojo. A medida que una célula documente lo que falta, esta página y el
            tracker se actualizan juntos.
          </div>

          <Seccion
            titulo="Por usuario"
            detalle="Arquetipos / user personas del segmento — ¿sabemos quién es el usuario de esta célula y qué necesita?"
            filas={POR_USUARIO}
          />
          <Seccion
            titulo="Por proceso"
            detalle="Journeys 360 de experiencia y servicio — ¿sabemos por dónde pasa ese usuario y dónde se rompe la experiencia?"
            filas={POR_PROCESO}
          />
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
