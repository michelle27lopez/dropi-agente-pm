"use client";

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13,
};
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };

const ACCENT = "#EC4899";
const ACCENT_BG = "#FDF2F8";

// ─── Datos reales · Bitácora UX · 8 abr – 28 may 2026 ───────────────────────
const KPIS = [
  { label: "Dropi base plataforma", value: "6.234", sub: "Total activos · abr–may 2026",          color: "var(--fg)", bg: "#F8FAFC", note: "Fuente: Dropi DB"         },
  { label: "Prov. activos · mayo",  value: "56",    sub: "↓ −68% desde abril (era 174)",          color: "#EF4444",   bg: "#FEF2F2", note: "Caída crítica"           },
  { label: "Conversión dropi",      value: "17%",   sub: "Q1 mayo · mínimo histórico (S1: 28.5%)", color: "#EF4444",  bg: "#FEF2F2", note: "Fuente: UserPilot"      },
  { label: "Abandono sostenido",    value: "~73%",  sub: "8+ semanas sin excepción",               color: "#F59E0B",   bg: "#FFFBEB", note: "Cuali + cuanti"         },
  { label: "Acuerdos exitosos máx", value: "26.6%", sub: "Post-Live S3 · encuesta directa",        color: "#10B981",   bg: "#ECFDF5", note: "Fuente: CSAT"           },
  { label: "Clics WhatsApp Q1",     value: "2",     sub: "Solo 2 de 882 intentos registrados",     color: "#8B5CF6",   bg: "#F5F3FF", note: "Bug parcial activo"     },
];

// ─── Funnel Q1 (más reciente · 14–28 mayo 2026) ──────────────────────────────
const FUNNEL_DROPI = [
  { label: "Intentaron crear",  value: "882",  pct: 100,  color: ACCENT },
  { label: "Publicaron",        value: "150",  pct: 17,   color: "#F59E0B" },
  { label: "Clic WhatsApp",     value: "2",    pct: 0.3,  color: "#EF4444" },
  { label: "Acuerdo registrado", value: "1",   pct: 0.1,  color: "#9CA3AF" },
];

const FUNNEL_PROV = [
  { label: "Vieron detalle",  value: "110", pct: 100,  color: "#10B981" },
  { label: "Crearon oferta",  value: "14",  pct: 12.7, color: "#3B82F6" },
  { label: "Enviaron oferta", value: "11",  pct: 10,   color: "#6366F1" },
];

// ─── Evolución por período ────────────────────────────────────────────────────
type Periodo = {
  periodo: string; fechas: string;
  dropiCrearon: number; dropiPublicaron: number; conv: number;
  provEnviaron: number | null; recurrencia: number | null;
  nota: string; notaColor: string;
};

const PERIODOS: Periodo[] = [
  { periodo: "S1", fechas: "8–15 abr",    dropiCrearon: 368, dropiPublicaron: 105, conv: 28.5, provEnviaron: 28,   recurrencia: 45,   nota: "Bug WhatsApp 0 clics", notaColor: "#EF4444" },
  { periodo: "S2", fechas: "15–22 abr",   dropiCrearon: 436, dropiPublicaron: 113, conv: 25.9, provEnviaron: null, recurrencia: 81.4, nota: "PMF en nicho detectado", notaColor: "#10B981" },
  { periodo: "S3", fechas: "22–29 abr",   dropiCrearon: 430, dropiPublicaron: 113, conv: 26.3, provEnviaron: 25,   recurrencia: 96,   nota: "Live event · 26.6% acuerdos", notaColor: "#10B981" },
  { periodo: "S4", fechas: "29 abr–12 may", dropiCrearon: 402, dropiPublicaron: 106, conv: 26.4, provEnviaron: null, recurrencia: 50.9, nota: "Post-live decay", notaColor: "#F59E0B" },
  { periodo: "Q1", fechas: "14–28 may",   dropiCrearon: 882, dropiPublicaron: 150, conv: 17,   provEnviaron: 11,   recurrencia: null, nota: "Discovery · mínimo histórico", notaColor: "#EF4444" },
];

// ─── CSAT · satisfacción ──────────────────────────────────────────────────────
const CSAT_ESTADO = [
  { label: "La negociación no avanzó", pct: 67, color: "#EF4444" },
  { label: "Negociando / conversando", pct: 14, color: "#F59E0B" },
  { label: "Ya está vendiendo",        pct: 14, color: "#10B981" },
  { label: "Ya hizo pedido",           pct: 5,  color: "#10B981" },
];

const CES_PROV = [
  { label: "1 — Bug técnico (muy difícil)", pct: 21.4, color: "#EF4444" },
  { label: "4 — Aceptable",                pct: 14.3, color: "#F59E0B" },
  { label: "5 — Muy fácil (sin problemas)", pct: 64.3, color: "#10B981" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CazaProductosPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Caza Productos</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag(ACCENT, ACCENT_BG)}>CAZ-001</span>
          <span style={tag("#3B82F6", "#EFF6FF")}>Oportunidad · Discovery</span>
          <span style={tag("#EF4444", "#FEF2F2")}>Alerta crítica activa</span>
          <span style={tag("#10B981", "#ECFDF5")}>8 abr – 28 may 2026</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Caza Productos · Adopción y Retención
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Seguimiento del feature de matching dropi↔proveedor. 5 períodos evaluados (S1–S4 + Q1).
            Fuente: <strong>UserPilot · Bitácora UX</strong> · actualizado 29/05/2026.
          </p>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 12 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}`, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
                {k.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: k.color, lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, lineHeight: 1.3 }}>{k.sub}</div>
              <div style={{ marginTop: 6, fontSize: 10, background: "#F8FAFC", color: "var(--muted)", padding: "2px 7px", borderRadius: 20, display: "inline-block", fontWeight: 600 }}>
                {k.note}
              </div>
            </div>
          ))}
        </div>

        {/* Alerta crítica */}
        <div style={{ background: "linear-gradient(135deg, #EF4444, #F87171)", borderRadius: 14, padding: "18px 20px", color: "#fff" }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Alerta crítica activa</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
            Proveedores activos cayeron <strong>−68% (174 → 56)</strong> mientras los dropi que intentan crear subieron <strong>+120% (882 en Q1)</strong>. Conversión en mínimo histórico: <strong>17%</strong>. Bug "No se envió mi oferta" sin resolver desde S1. El problema ya no es UX — es de <strong>modelo de negocio y confianza</strong>.
          </p>
        </div>

        {/* Hallazgos del Discovery */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Hallazgos · Discovery Q1 (mayo 2026)</div>
            <div style={sectionSub}>Cambio de diagnóstico confirmado por entrevistas directas con usuarios.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🔴", titulo: "Trampa circular activa",        desc: "Dropi no reciben respuesta → no cierran → proveedores no ven ROI → abandonan → menos respuestas → más frustración. 174 → 56 proveedores activos en un mes." },
              { icon: "🔴", titulo: "El 83% de abandono no es UX",   desc: "El dropi exitoso no publica porque teme que los proveedores copien o filtren su producto ganador. No es fricción del formulario: es miedo al espionaje comercial." },
              { icon: "🐛", titulo: "Bug sin resolver desde S1",      desc: '"No se envió mi oferta" presente 8 semanas. El proveedor que lo encuentra tiene retención 0% desde el Día 1 — no regresa. Casos: Andrés Rodríguez, John Peña.' },
              { icon: "🔵", titulo: "Éxito oculto — subestimado",     desc: "El CSAT revela que 19% de respondentes ya tiene éxito comercial real. Los cierres ocurren por WhatsApp sin registro en plataforma. La tasa de éxito real es mayor al 17%." },
            ].map(h => (
              <div key={h.titulo} style={{ display: "flex", gap: 10, padding: "12px", background: "#F8FAFC", borderRadius: 10, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{h.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnels Q1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Funnel Dropi */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>Embudo Dropshippers · Q1</div>
                <div style={sectionSub}>14–28 mayo 2026 · 882 usuarios</div>
              </div>
              <span style={tag(ACCENT, ACCENT_BG)}>Dropi</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FUNNEL_DROPI.map((step, i) => (
                <div key={step.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%", background: step.color,
                        color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{step.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: step.color }}>{step.value}</span>
                      <span style={{ fontSize: 11, color: "var(--muted)", width: 38, textAlign: "right" }}>{step.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 7, background: "#F3F4F6", borderRadius: 999, overflow: "hidden", marginLeft: 30 }}>
                    <div style={{ height: "100%", width: `${Math.min(step.pct, 100)}%`, background: step.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#FEF2F2", borderRadius: 8, fontSize: 12, color: "#7F1D1D", border: "1px solid #FECACA", lineHeight: 1.4 }}>
              <strong>83% de abandono</strong> en crear publicación. El clic a WhatsApp (KPI real) bajó a 0.3% por bug parcial.
            </div>
          </div>

          {/* Funnel Proveedores */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>Embudo Proveedores · Q1</div>
                <div style={sectionSub}>14–28 mayo 2026 · 110 usuarios</div>
              </div>
              <span style={tag("#10B981", "#ECFDF5")}>Supplier</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FUNNEL_PROV.map((step, i) => (
                <div key={step.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%", background: step.color,
                        color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{step.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: step.color }}>{step.value}</span>
                      <span style={{ fontSize: 11, color: "var(--muted)", width: 38, textAlign: "right" }}>{step.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 7, background: "#F3F4F6", borderRadius: 999, overflow: "hidden", marginLeft: 30 }}>
                    <div style={{ height: "100%", width: `${step.pct}%`, background: step.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#FEF3C7", borderRadius: 8, fontSize: 12, color: "#78350F", border: "1px solid #FDE68A", lineHeight: 1.4 }}>
              El 92% de publicaciones son <strong>descartadas</strong> porque el proveedor no puede ver el score del dropi — riesgo percibido de comprometer inventario.
            </div>
          </div>
        </div>

        {/* Evolución por período */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Evolución por período · S1 – Q1</div>
              <div style={sectionSub}>5 períodos evaluados · 8 abril – 28 mayo 2026. Fuente: UserPilot.</div>
            </div>
            <span style={tag("var(--muted)", "#F3F4F6")}>5 períodos</span>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Período</th>
                  <th style={thStyle}>Fechas</th>
                  <th style={thR}>Dropi crearon</th>
                  <th style={thR}>Publicaron</th>
                  <th style={thR}>Conversión</th>
                  <th style={thR}>Prov. enviaron</th>
                  <th style={thR}>Recurrencia dropi</th>
                  <th style={thStyle}>Notas</th>
                </tr>
              </thead>
              <tbody>
                {PERIODOS.map((p, i) => (
                  <tr key={p.periodo} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: 800, color: ACCENT }}>{p.periodo}</td>
                    <td style={{ ...tdStyle, color: "var(--muted)", fontSize: 12 }}>{p.fechas}</td>
                    <td style={{ ...tdR, fontWeight: 700 }}>{p.dropiCrearon.toLocaleString("es-CO")}</td>
                    <td style={tdR}>{p.dropiPublicaron}</td>
                    <td style={{ ...tdR, fontWeight: 700, color: p.conv >= 25 ? "#10B981" : "#EF4444" }}>{p.conv}%</td>
                    <td style={{ ...tdR, color: "#6366F1", fontWeight: 600 }}>{p.provEnviaron ?? "—"}</td>
                    <td style={{ ...tdR, color: "#3B82F6", fontWeight: 600 }}>{p.recurrencia != null ? `${p.recurrencia}%` : "—"}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: p.notaColor, fontWeight: 600 }}>{p.nota}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ ...tdStyle, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>Acumulado S1–Q1</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: ACCENT }}>2.518</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>587</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#F59E0B" }}>23.3%</td>
                  <td colSpan={3} style={{ ...tdStyle, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* CSAT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* CSAT estado negociación */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>CSAT Dropi · Estado de la negociación</div>
                <div style={sectionSub}>Q1 · 21 respuestas acumuladas</div>
              </div>
              <span style={tag("#F59E0B", "#FFFBEB")}>CSAT</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CSAT_ESTADO.map(c => (
                <div key={c.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{c.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#ECFDF5", borderRadius: 8, fontSize: 12, color: "#065F46", border: "1px solid #A7F3D0", lineHeight: 1.4 }}>
              <strong>Mejora vs S3:</strong> "No avanzó" bajó de 80% → 67%. Las negociaciones activas ("conversando") aparecen por primera vez como categoría (14%).
            </div>
          </div>

          {/* CES Proveedores */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>CES Proveedores · Facilidad de oferta</div>
                <div style={sectionSub}>Q1 · 14 respuestas · escala 1–5</div>
              </div>
              <span style={tag("#6366F1", "#EEF2FF")}>CES</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CES_PROV.map(c => (
                <div key={c.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{c.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#FEF2F2", borderRadius: 8, fontSize: 12, color: "#7F1D1D", border: "1px solid #FECACA", lineHeight: 1.4 }}>
              Distribución bimodal: 64.3% no tiene problema — 21.4% choca con bug severo. <strong>Un fix recuperaría ese 21.4%.</strong>
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Próximos pasos · priorizado</div>
            <div style={sectionSub}>Plan de acción derivado del Discovery Q1 + análisis de 5 períodos.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: "1", paso: "Resolver bug 'No se envió mi oferta' — presente desde S1. Proveedor que lo encuentra tiene retención 0%. Casos: Andrés Rodríguez, John Peña.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
              { n: "2", paso: "Diseñar y prototipar Publicaciones a Ciegas — mostrar solo métricas del dropi (precio, volumen) sin revelar el producto. Única solución estructural al 83% de abandono.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
              { n: "3", paso: "Frenar la fuga de proveedores activos (56 y bajando). Activación directa de prov premium + comunicación con los que abandonaron en Q1.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
              { n: "4", paso: "Implementar Score del Dropshipper visible para proveedores — volumen de ventas, entregas, CPA. Sin esto el prov descarta el 92% de publicaciones.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
              { n: "5", paso: "Categorización + alertas automáticas — proveedor de tecnología que ve 3 días seguidos peticiones de maquillaje abandona en Día 3. Filtro básico + notificación de nicho.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
              { n: "6", paso: "Instrumentar correctamente el clic a WhatsApp — es el KPI real de éxito. Agregar micro-survey post-clic para capturar el resultado de la negociación.", urgencia: "Media", color: "#3B82F6", bg: "#EFF6FF" },
            ].map(p => (
              <div key={p.n} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "12px 14px", borderRadius: 10,
                background: "#F8FAFC", border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: p.color,
                  color: "#fff", fontSize: 12, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{p.n}</div>
                <div style={{ flex: 1, fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{p.paso}</div>
                <span style={tag(p.color, p.bg)}>{p.urgencia}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fuente de datos */}
        <div style={{ ...card, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
            Fuente de datos · Cómo actualizar
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "📊", titulo: "Embudos y retención",   desc: "UserPilot Dashboard → Flows y Cohortes. Bitácora actualizada el 29/05/2026. Próxima actualización: cierre Q2 (segunda quincena junio)." },
              { icon: "😊", titulo: "CSAT y CES",             desc: "UserPilot → Surveys. CSAT dropi activo desde S3. CES proveedores desde S3. Acumulado Q1: 21 resp. CSAT / 14 resp. CES." },
              { icon: "🗄️", titulo: "Proveedores activos",    desc: "Dropi DB. Total activos plataforma general. Para Caza Productos específico: proveedores que enviaron oferta en el período (datos parciales)." },
              { icon: "💬", titulo: "WhatsApp (KPI real)",    desc: "Clic al botón WhatsApp en plataforma. S1 tuvo bug (0 clics). Fix en S3 (22 clics). Q1 solo 2 clics — bug parcialmente activo. Agregar micro-survey post-clic." },
            ].map(f => (
              <div key={f.titulo} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{f.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
