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

type Experimento = {
  nombre: string;
  hipotesis: string;
  metrica: string;
  estado: EstadoExp;
  impacto: string;
  proyecto: string;
  calendario?: string;
  aprendizaje?: string;
  metricasNegocio?: MetricaNegocio[];
  metricasSemanales?: MetricaSemanal[];
  trackingUrl?: string;
  plantillaWaConNovedad?: string;
  plantillaWaSinNovedad?: string;
};

const PENDIENTE = "— pendiente —";

const experimentos: Experimento[] = [
  {
    nombre: "Retención Proactiva — Escalando/Pre-Escalando (Lente 1)",
    hipotesis:
      "Creemos que si le devolvemos a la marca su propia información semanal (guías, en tránsito, novedades, devoluciones, entregadas) y le hacemos una pregunta puntual cuando esos números muestran alerta — sin comprometernos a gestionar o resolver, solo a entender qué está pasando — la marca va a sentir que Dropi le entrega valor real y la escucha, y eso la hace quedarse. De paso, recogemos insight real de qué le está pasando detrás de esas alertas. Fundamento: BAU Competitivo (entrevistas + CSAT) ya identificó la gestión de novedades/devoluciones como uno de los dolores más grandes, y los tiempos de respuesta como lentos.",
    metrica:
      "% ENGAGEMENT (respondió Sí/No a la pregunta) · bitácora cualitativa de qué está pasando (insight, no se promedia) · CSAT promedio (meta 4.5) · % retención mes vs mes (meta 56–58%)",
    estado: "Diseñado",
    impacto:
      "FASE PILOTO: arranca con 5 marcas (3 Escalando + 2 Pre-Escalando) = 8,881 órdenes propias/mes (5.1% del universo). Si valida, escala a las 64 marcas completas = 174,286 órdenes/mes · 60.1% del portafolio comercial L1 · 29% de la meta NSM 600K · baseline retención 53.1% (jun vs may).",
    proyecto: "Brands Success · Retención L1 (Escalando/Pre-Escalando)",
    calendario: "Piloto (5 marcas): semana 1 lun 27 jul – vie 31 jul · escala a 64 marcas si valida · cierre operativo: vie 21 ago 2026",
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
      { semana: 1, fechaViernes: "31 jul 2026", engagement: PENDIENTE, insight: PENDIENTE },
      { semana: 2, fechaViernes: "7 ago 2026", engagement: PENDIENTE, insight: PENDIENTE },
      { semana: 3, fechaViernes: "14 ago 2026", engagement: PENDIENTE, insight: PENDIENTE },
      { semana: 4, fechaViernes: "21 ago 2026", engagement: PENDIENTE, insight: PENDIENTE },
    ],
    plantillaWaConNovedad:
      "Hola Distribuidora XYZ 👋\n\nAsí va tu negocio con Dropi ahora mismo:\n\n📈 Guías generadas: 342 órdenes\n📦 En tránsito: 218 órdenes\n⚠️ Con novedades: 14 órdenes\n↩️ Con devolución: 9 órdenes\n✅ Entregadas: 289 órdenes\n\nVimos que tienes 14 novedades y 9 devoluciones esta semana.\nCuéntanos qué está pasando — nos ayuda a entender mejor tu operación.\n\n👉 wa.me/57NUMERO?text=Hola,%20quiero%20contarles...\n\nSeguimos aquí, contigo,\nBrands Success 🚀",
    plantillaWaSinNovedad:
      "Hola Marca Emprendedora 👋\n\nAsí va tu negocio con Dropi ahora mismo:\n\n📈 Guías generadas: 156 órdenes\n📦 En tránsito: 98 órdenes\n✅ Entregadas: 142 órdenes\n\n¡Todo limpio por aquí! 🎉 Sin novedades ni devoluciones que reportar.\n\nSeguimos aquí, contigo,\nBrands Success 🚀",
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

                {(e.plantillaWaConNovedad || e.plantillaWaSinNovedad) && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginTop: 16, marginBottom: 8 }}>
                      💬 Plantilla de WhatsApp (ejemplo ilustrativo)
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {e.plantillaWaConNovedad && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: AMBER, marginBottom: 5 }}>CON novedad/devolución</div>
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
                              {e.plantillaWaConNovedad}
                            </div>
                          </div>
                        </div>
                      )}
                      {e.plantillaWaSinNovedad && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, marginBottom: 5 }}>SIN novedad/devolución</div>
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
                              {e.plantillaWaSinNovedad}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>
                      Nombre y números son de ejemplo — no es un envío real.
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
