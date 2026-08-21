// Proyecto aparte — antes vivía como tarjeta dentro de
// proyectos/marcas/experimentos (mismo concepto de tablero, hipótesis →
// métrica → estado → aprendizaje). Kate pidió sacarlo de ahí y darle su
// propio proyecto/enlace, así que queda self-contained igual que
// bau-competitivo-marcas y onboarding-ttfo.
//
// Fuente: agente-delivery/Documentos/experimento-descubrimiento-marcas-14ago2026.html
// Fuente: agente-delivery/Documentos/Experimento_canales_descubrimiento_marcas/
//   (artefactos del piloto, matriz de seguimiento, research y guía de prioridades)

import Breadcrumb from "@/components/Breadcrumb";

export const metadata = { title: "Leads Clasificados · Brands Success" };

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const TEAL = "#0D9488";
const GREY = "#64748B";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const TEAL_BG = "#F0FDFA";
const GREY_BG = "#F1F5F9";
const RED_BG = "#FEF2F2";

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

type EstadoExp = "Idea" | "Diseñado" | "Corriendo" | "Validado" | "Descartado";

const ESTADO_STYLE: Record<EstadoExp, { color: string; bg: string }> = {
  Idea: { color: GREY, bg: GREY_BG },
  Diseñado: { color: BLUE, bg: BLU_BG },
  Corriendo: { color: AMBER, bg: AMB_BG },
  Validado: { color: TEAL, bg: TEAL_BG },
  Descartado: { color: RED, bg: RED_BG },
};

type Accionable = { accion: string; owner: string; timeline: string; detalles: string };
type Frente = { nombre: string; estado: EstadoExp; resumen: string };

const estado: EstadoExp = "Corriendo";
const est = ESTADO_STYLE[estado];

const frentes: Frente[] = [
  {
    nombre: "Frente 1 — Escucha Directa",
    estado: "Corriendo",
    resumen: "Outreach 1:1 a las 17 marcas por su canal real (email, LinkedIn o WhatsApp según el caso), una sola pregunta abierta, sin pitch comercial. Plan ya compartido con la célula; outreach en ejecución.",
  },
  {
    nombre: "Frente 2 — Discovery sin Contacto",
    estado: "Corriendo",
    resumen: "Auditoría pública (tienda, catálogo, operación) ya completa sobre las 17 marcas — alimenta la síntesis de producto y ventas mientras el Frente 1 sigue en curso.",
  },
];

const accionables: Accionable[] = [
  {
    accion: "Crear plan de outreach (canales, mensajes, beneficios)",
    owner: "Majo + Kate",
    timeline: "Esta semana",
    detalles: "Personalizado por marca; gancho = \"ya te conocemos\" + research previo",
  },
  {
    accion: "Ejecutar outreach en Instagram/Email a 17 marcas",
    owner: "Majo + Kate",
    timeline: "Esta semana",
    detalles: "Meta: >15% respuesta + feedback útil",
  },
  {
    accion: "Diseñar piloto comercial post-feedback",
    owner: "Juan Camilo",
    timeline: "Sábado máximo",
    detalles: "Propuesta clara de beneficio (ej: X envíos gratis) sin vender Dropi aún",
  },
  {
    accion: "Sintetizar insights + recomendaciones de producto",
    owner: "Fran + Kate",
    timeline: "Próxima semana",
    detalles: "Síntesis a partir del research previo y de lo que traiga el outreach, para ajustes de producto",
  },
];

export default function LeadsClasificadosPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "Leads Clasificados" }]} />
      </div>

      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            Experimento de Descubrimiento — Leads Clasificados
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
            17 leads Shopify de +700 órdenes/mes, ICP calificado — dos frentes corriendo antes de vender.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, color: est.color, background: est.bg, whiteSpace: "nowrap" }}>
              {estado}
            </span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600, textAlign: "right" }}>Brands Success · Leads Clasificados</span>
          </div>

          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: RED, marginBottom: 2 }}>Problema</b>
            No sabemos qué necesitan las marcas de +700 órdenes/mes (leads Shopify calificados ICP) → riesgo alto de adquirir sin producto listo.
          </div>
          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: TEAL, marginBottom: 2 }}>Solución</b>
            Dos frentes corriendo en paralelo, sin vender Dropi todavía: investigación pública de las 17 marcas + outreach personalizado para escuchar directo.
          </div>
          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>Métrica</b>
            Sabemos que la escucha directa está funcionando si, de las 17 marcas contactadas, 6 o más responden con una razón real y concreta (35%) — no un simple "no gracias" — y al menos 4 aceptan profundizar en una entrevista corta de 15 a 20 minutos. Esas entrevistas son las que terminan armando el mapa de dolores y expectativas que decide si vale la pena seguir explorando esta oportunidad.
          </div>
          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>Impacto</b>
            17 de 410 marcas nuevas calificadas (4% en cantidad) ≈ 59.228 de 413.351 órdenes/mes estimadas — 14% del volumen total con solo 4% de las marcas. Si el modelo valida, se replica sobre las 393 restantes (≈354.123 órdenes/mes estimadas).
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginTop: 16, marginBottom: 8 }}>
            🧭 Frentes del experimento
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
            {frentes.map((f, i) => {
              const fest = ESTADO_STYLE[f.estado];
              return (
                <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 5 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: NAVY }}>{f.nombre}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: fest.color, background: fest.bg, whiteSpace: "nowrap" }}>{f.estado}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#39415a", lineHeight: 1.45 }}>{f.resumen}</div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: BLUE, marginTop: 16, marginBottom: 8 }}>
            ✅ Plan compartido con la célula
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.7fr 1.4fr", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "6px 10px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)", gap: 6 }}>
              <div>Accionable</div>
              <div>Owner</div>
              <div>Timeline</div>
              <div>Detalles</div>
            </div>
            {accionables.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 0.9fr 0.7fr 1.4fr",
                  padding: "8px 10px",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--muted)",
                  borderBottom: i < accionables.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ fontWeight: 700, color: NAVY }}>{a.accion}</div>
                <div>{a.owner}</div>
                <div>{a.timeline}</div>
                <div>{a.detalles}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic", marginTop: 6 }}>
            Canal tal como se compartió a la célula: Instagram/Email. La asignación de canal confirmada por marca usa Email, LinkedIn o WhatsApp como canal 1 real según el caso — Instagram solo aparece como canal 2 de respaldo en algunas marcas, nunca como canal 1.
          </div>

          <div style={{ fontSize: 13, color: "#39415a", margin: "16px 0 8px", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>📚 Aprendizaje</b>
            Investigación (Frente 2) ya completa — 17 marcas auditadas con evidencia clasificada por certeza (comprobado / inferencia / hipótesis / no identificado). 3 hallazgos con evidencia dura: ninguna de las 17 tiene tracking propio confiable, 6 de 17 dependen de una sola transportadora, y los quiebres de inventario tienen cifra exacta (46,8% agotado en Health Company).
          </div>

          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5, background: TEAL_BG, border: "1px solid #99F6E4", borderRadius: 8, padding: "10px 12px" }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "#0F766E", marginBottom: 2 }}>
              🧭 Guía de prioridades de Dropi (según la investigación)
            </b>
            Conclusión de la investigación: las marcas no necesitan otra plataforma — necesitan entregar más pedidos, cobrar mejor el contraentrega, evitar ventas sin inventario y reducir el trabajo manual. Prioridad de producto en orden: (1) conexión profunda con Shopify, (2) tracking de marca, (3) elección automática de transportadora, (4) COD inteligente y recaudo claro, (5) control de inventario y bodegas, (6) novedades, cambios y devoluciones. Decisión estratégica de entrada: elegir uno de dos problemas — &quot;más pedidos entregados y cobrados&quot; (Revenue &amp; Delivery) o &quot;menos desorden de inventario y pedidos&quot; (Operations Control) — y crecer dentro de la cuenta después de demostrar valor ahí.
          </div>

          <a
            href="https://drive.google.com/drive/u/2/folders/1NpVNaI6Fu7tjTyrNkx7uVEMBJ2WrgSii"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 16,
              fontSize: 12.5,
              fontWeight: 700,
              color: TEAL,
              textDecoration: "none",
            }}
          >
            📁 Ver documentación completa en Drive →
          </a>
        </div>

        <div style={{ marginTop: 30, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          Fuente: agente-delivery/Documentos/Experimento_canales_descubrimiento_marcas/ · Uso interno Célula Brands Success
        </div>
      </div>
    </main>
  );
}
