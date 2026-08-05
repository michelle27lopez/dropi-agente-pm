// Tablero de experimentos de Brands Success — mismo concepto que
// proyectos/logistica/experimentos (nombre, hipótesis, métrica, estado,
// impacto, proyecto, aprendizaje), pero self-contained como marcas/page.tsx
// (sin depender de _lib/_components de Logística, que están escopeados a
// su propio design system bajo .log-root).

export const metadata = { title: "Experimentos · Brands Success" };

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const TEAL = "#0D9488";
const GREY = "#64748B";
const RED_BG = "#FEF2F2";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const TEAL_BG = "#F0FDFA";
const GREY_BG = "#F1F5F9";

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

type MetricaNegocio = { label: string; valor: string; nota?: string };
type MetricaSemanal = { semana: number; fechaViernes: string; engagement: string; insight: string };
type InsightDestacado = { label: string; valor: string; nota?: string };

type Experimento = {
  nombre: string;
  hipotesis: string;
  metrica: string;
  estado: EstadoExp;
  impacto: string;
  proyecto: string;
  calendario?: string;
  aprendizaje?: string;
  insightsDestacados?: InsightDestacado[];
  insightsCaveat?: string;
  metricasNegocio?: MetricaNegocio[];
  metricasSemanales?: MetricaSemanal[];
  trackingUrl?: string;
  plantillaWaHibridaReal?: string;
};

const PENDIENTE = "— pendiente —";

const experimentos: Experimento[] = [
  {
    nombre: "Retención Proactiva — Escalando/Pre-Escalando (Lente 1)",
    hipotesis:
      "Creemos que si le devolvemos a la marca su propia información semanal (guías, en tránsito, novedades, devoluciones, entregadas) y le hacemos una pregunta puntual cuando esos números muestran alerta — sin comprometernos a gestionar o resolver, solo a entender qué está pasando — la marca va a sentir que Dropi le entrega valor real y la escucha, y eso la hace quedarse. De paso, recogemos insight real de qué le está pasando detrás de esas alertas. Fundamento: BAU Competitivo (entrevistas + CSAT) ya identificó la gestión de novedades/devoluciones como uno de los dolores más grandes, y los tiempos de respuesta como lentos.",
    metrica:
      "% ENGAGEMENT (respondió Sí/No a la pregunta) · bitácora cualitativa de qué está pasando (insight, no se promedia) · CSAT promedio (meta 4.5) · % retención mes vs mes (meta 56–58%)",
    estado: "Corriendo",
    impacto:
      "FASE PILOTO: arranca con 5 marcas (3 Escalando + 2 Pre-Escalando) = 8,881 órdenes propias/mes (5.1% del universo). Si valida, escala a las 64 marcas completas = 174,286 órdenes/mes · 60.1% del portafolio comercial L1 · 29% de la meta NSM 600K · baseline retención 53.1% (jun vs may).",
    proyecto: "Brands Success · Retención L1 (Escalando/Pre-Escalando)",
    calendario: "Piloto (5 marcas): semana 1 planeada lun 27 jul – vie 31 jul, envío real ejecutado miér 29 jul · escala a 64 marcas si valida · cierre operativo: vie 21 ago 2026",
    aprendizaje:
      "Piloto confirmado (29-jul): 628707 Dilan Pacheco, 91797 Arley Cubillos, 653912 Maria Paula Arrechea (Escalando) + 12795 WLDER VELASCO, 668649 MICHAEL BENAVIDES (Pre-Escalando) — reemplaza la lista de ejemplo del prompt original. Envío 100% vía WhatsApp propio del equipo, sin número de Back Office separado ni link de redirección — la marca responde en el mismo hilo. Pendiente de confirmar con Miguel: la columna 'con novedades' llegó en 0 para las 5 marcas — posible que mida solo novedades abiertas en tiempo real, no el acumulado del mes; generó un caso híbrido (0 novedades + devolución activa) no contemplado en las 2 ramas de plantilla originales, repetido en los 5 envíos de semana 1.",
    insightsDestacados: [
      {
        label: "Dolor principal detectado",
        valor: "Gestión de la transportadora",
        nota: "Las 3 marcas que respondieron coinciden en lo mismo: no se ejecutan intentos reales de entrega ni contacto antes de marcar novedad o devolución. No es un problema de producto — es de última milla.",
      },
      {
        label: "Transportadora más mencionada",
        valor: "Interrapidísimo",
        nota: "Nombrada explícitamente en 2 de 3 respuestas. WLDER VELASCO (12795) reporta 7 marcas más del Centro de Cali con el mismo problema — señal de patrón, no caso aislado.",
      },
      {
        label: "Valor entregado — respuesta inmediata",
        valor: "60% respondió el mismo día",
        nota: "3 de 5 marcas piloto respondieron el día del envío, ya por encima de la meta semanal (40%+) que normalmente se mide hasta el viernes.",
      },
      {
        label: "Inconformismo, no rechazo al mensaje",
        valor: "Se quejan de la transportadora, no del reporte",
        nota: "Responden con detalle y cifras propias — MICHAEL BENAVIDES (668649) cuantifica que ~60% de sus 216 novedades son atribuibles a la transportadora. Señal de que sienten que Dropi realmente quiere escuchar: valida la hipótesis del experimento.",
      },
    ],
    insightsCaveat: "Lectura de día 1 (n=3) — se trata como señal inicial, se confirma como patrón si se repite en las próximas semanas.",
    trackingUrl: "https://docs.google.com/spreadsheets/d/1mBLpjqRzEEe_tkV256j7r2RX1ytOr6zSuN0SISeIFnM/edit?gid=1294240361#gid=1294240361",
    metricasNegocio: [
      {
        label: "Fase piloto — arranque real",
        valor: "5 marcas = 8,881 órdenes propias/mes",
        nota: "3 Escalando + 2 Pre-Escalando · 5.1% del universo de 64 · valida el mecanismo (plantilla, tono, CSAT) antes de escalar",
      },
      { label: "Retención baseline (jun vs may)", valor: "53.1% · 34/64 marcas", nota: "meta final si el piloto valida y se escala a las 64" },
      { label: "Meta del experimento (si escala)", valor: "56–58% · 36–37/64 marcas", nota: "+2 a +3 marcas que hoy declinan deben pasar a mantener/crecer" },
      { label: "Órdenes en riesgo hoy (universo 64)", valor: "70,341 órdenes/mes", nota: "40.3% de las 174,286 órdenes/mes de las 64 marcas — pertenecen a las 30 que ya están declinando jun vs may" },
      {
        label: "Techo real de la meta (universo 64)",
        valor: "+3,602 a +4,681 órdenes/mes",
        nota: "si se estabilizan las 3 Escalando con mayor caída (488584: −1,980 · 739956: −1,622 · 205515: −1,079) — más que toda la meta agregada del experimento",
      },
    ],
    metricasSemanales: [
      { semana: 1, fechaViernes: "31 jul 2026", engagement: "60% (3/5) — lectura día 1, no cierre de viernes", insight: "Transportadora (Interrapidísimo) — ver insight destacado ↑" },
      { semana: 2, fechaViernes: "7 ago 2026", engagement: PENDIENTE, insight: PENDIENTE },
      { semana: 3, fechaViernes: "14 ago 2026", engagement: PENDIENTE, insight: PENDIENTE },
      { semana: 4, fechaViernes: "21 ago 2026", engagement: PENDIENTE, insight: PENDIENTE },
    ],
    plantillaWaHibridaReal:
      "Hola, Maria Paula! 👋 Soy Katerine de Dropi.\n\nFuiste seleccionado(a) para un grupo reducido de Marcas con quienes compartiremos un reporte semanal del comportamiento de tus órdenes.\n\nReporte del 1 al 27 de Julio de 2026\n\n📦 2.981 órdenes creadas\n🚚 758 en tránsito\n✅ 963 entregadas\n⚠️ 0 con novedades\n↩️ 374 en devolución\n\nLas 0 con novedades y las 374 en devolución. Cuéntanos qué está pasando nos ayuda a entender mejor tu operación.🧡",
  },
];

export default function ExperimentosMarcasPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 24px 0" }}>
        <a href="/proyectos/marcas" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Marcas
        </a>
      </div>

      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.4)",
              marginBottom: 8,
            }}
          >
            Brands Success · Dropi
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            Experimentos
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
            Las apuestas de discovery: hipótesis → métrica → estado → aprendizaje.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "grid", gap: 16 }}>
          {experimentos.map((e) => {
            const est = ESTADO_STYLE[e.estado];
            return (
              <div key={e.nombre} style={card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: "5px 11px",
                      borderRadius: 999,
                      color: est.color,
                      background: est.bg,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.estado}
                  </span>
                  <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600, textAlign: "right" }}>{e.proyecto}</span>
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.25, color: NAVY }}>{e.nombre}</h3>

                <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
                  <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>
                    Hipótesis
                  </b>
                  {e.hipotesis}
                </div>
                <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
                  <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>
                    Métrica
                  </b>
                  {e.metrica}
                </div>
                <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
                  <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>
                    Impacto
                  </b>
                  {e.impacto}
                </div>
                {e.calendario && (
                  <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
                    <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>
                      Calendario
                    </b>
                    {e.calendario}
                  </div>
                )}
                {e.aprendizaje && (
                  <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
                    <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--muted)", marginBottom: 2 }}>
                      📚 Aprendizaje
                    </b>
                    {e.aprendizaje}
                  </div>
                )}

                {e.insightsDestacados && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: AMBER, marginTop: 16, marginBottom: 8 }}>
                      🔥 Insight semana 1 — dolor principal
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
                      {e.insightsDestacados.map((ins, i) => (
                        <div key={i} style={{ background: AMB_BG, border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, color: "#92400E", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{ins.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: ins.nota ? 3 : 0 }}>{ins.valor}</div>
                          {ins.nota && <div style={{ fontSize: 10.5, color: "#78350F", lineHeight: 1.4 }}>{ins.nota}</div>}
                        </div>
                      ))}
                    </div>
                    {e.insightsCaveat && (
                      <div style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic", marginBottom: 4 }}>{e.insightsCaveat}</div>
                    )}
                  </>
                )}

                {e.metricasNegocio && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: TEAL, marginTop: 16, marginBottom: 8 }}>
                      📊 Métricas de negocio · ya con base real
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
                      {e.metricasNegocio.map((m, i) => (
                        <div key={i} style={{ background: TEAL_BG, border: "1px solid #99F6E4", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 10, color: "#0F766E", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{m.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: m.nota ? 3 : 0 }}>{m.valor}</div>
                          {m.nota && <div style={{ fontSize: 10.5, color: "#134E4A", lineHeight: 1.4 }}>{m.nota}</div>}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {e.metricasSemanales && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginTop: 16, marginBottom: 8 }}>
                      🗓️ Seguimiento semanal (piloto, 5 marcas) · arranca en cero, se llena viernes a viernes
                    </div>
                    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "6px 10px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)", gap: 6 }}>
                        <div>Semana (viernes)</div>
                        <div>Engagement</div>
                        <div>Insight (bitácora)</div>
                      </div>
                      {e.metricasSemanales.map((s, i) => (
                        <div
                          key={s.semana}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 2fr",
                            padding: "8px 10px",
                            gap: 6,
                            fontSize: 12,
                            color: "var(--muted)",
                            borderBottom: i < e.metricasSemanales!.length - 1 ? "1px solid var(--border)" : "none",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: NAVY }}>S{s.semana} · {s.fechaViernes}</div>
                          <div>{s.engagement}</div>
                          <div>{s.insight}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {e.plantillaWaHibridaReal && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginTop: 16, marginBottom: 8 }}>
                      💬 Plantilla utilizada — envío real semana 1
                    </div>
                    <div style={{ maxWidth: 380 }}>
                      <div
                        style={{
                          background: "#ECE5DD",
                          borderRadius: 10,
                          padding: 10,
                        }}
                      >
                        <div
                          style={{
                            background: "white",
                            borderRadius: 8,
                            borderTopLeftRadius: 2,
                            padding: "9px 11px",
                            fontSize: 12,
                            lineHeight: 1.5,
                            color: "#111",
                            whiteSpace: "pre-wrap",
                            boxShadow: "0 1px 1px rgba(0,0,0,.08)",
                          }}
                        >
                          {e.plantillaWaHibridaReal}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>
                      Envío real a Maria Paula Arrechea (653912), 29-jul-2026 — caso híbrido (novedades en 0, devolución activa).
                    </div>
                  </>
                )}

                {e.trackingUrl && (
                  <a
                    href={e.trackingUrl}
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
                    📄 Ver seguimiento / tracking en Sheet →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 30, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          Fuente: agente-delivery/Documentos/Experimento_retencion _Proactiva/ · Análisis agente Data_Brands · Uso interno Célula Brands Success
        </div>
      </div>
    </main>
  );
}
