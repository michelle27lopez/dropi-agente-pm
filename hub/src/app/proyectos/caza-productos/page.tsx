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

// ─── Datos reales · Bitácora UX · 8 abr – 11 jun 2026 ───────────────────────
const KPIS = [
  { label: "Dropi base plataforma", value: "6.234", sub: "Total activos · abr–jun 2026",            color: "var(--fg)", bg: "#F8FAFC", note: "Fuente: Dropi DB"        },
  { label: "Prov. activos",         value: "56",    sub: "Estable vs mayo · era 174 en abril",       color: "#F59E0B",   bg: "#FFFBEB", note: "Crítico: ratio 1:30"    },
  { label: "Conversión dropi",      value: "34.1%", sub: "Q2 jun · máximo histórico (Q1: 17%)",      color: "#10B981",   bg: "#ECFDF5", note: "Fuente: UserPilot"      },
  { label: "CSAT «no avanzó»",      value: "42.9%", sub: "Q2 · bajó de 66.7% en Q1",                color: "#10B981",   bg: "#ECFDF5", note: "Mejora sostenida"       },
  { label: "Acordó precio Q2 🆕",   value: "21.4%", sub: "Primera vez en todo el período",           color: "#10B981",   bg: "#ECFDF5", note: "Señal PMF"              },
  { label: "Clics WhatsApp Q2",     value: "6",     sub: "↑ ×3 vs Q1 (eran 2) · KPI real",          color: "#8B5CF6",   bg: "#F5F3FF", note: "Tendencia positiva"     },
];

// ─── Funnel Q2 (más reciente · 28 may–11 jun 2026) ───────────────────────────
const FUNNEL_DROPI = [
  { label: "Intentaron crear",   value: "700", pct: 100,  color: ACCENT },
  { label: "Publicaron",         value: "239", pct: 34.1, color: "#10B981" },
  { label: "Clic WhatsApp",      value: "6",   pct: 0.86, color: "#8B5CF6" },
  { label: "Acuerdo registrado", value: "1",   pct: 0.1,  color: "#9CA3AF" },
];

const FUNNEL_PROV = [
  { label: "Vieron detalle",  value: "172", pct: 100,  color: "#10B981" },
  { label: "Crearon oferta",  value: "13",  pct: 7.6,  color: "#3B82F6" },
  { label: "Enviaron oferta", value: "8",   pct: 4.7,  color: "#6366F1" },
];

// ─── Evolución por período ────────────────────────────────────────────────────
type Periodo = {
  periodo: string; fechas: string;
  dropiCrearon: number; dropiPublicaron: number; conv: number;
  provEnviaron: number | null; recurrencia: number | null;
  nota: string; notaColor: string;
};

const PERIODOS: Periodo[] = [
  { periodo: "S1", fechas: "8–15 abr",      dropiCrearon: 368, dropiPublicaron: 105, conv: 28.5, provEnviaron: 28,   recurrencia: 45,   nota: "Bug WhatsApp 0 clics",        notaColor: "#EF4444" },
  { periodo: "S2", fechas: "15–22 abr",     dropiCrearon: 436, dropiPublicaron: 113, conv: 25.9, provEnviaron: null, recurrencia: 81.4, nota: "PMF en nicho detectado",        notaColor: "#10B981" },
  { periodo: "S3", fechas: "22–29 abr",     dropiCrearon: 430, dropiPublicaron: 113, conv: 26.3, provEnviaron: 25,   recurrencia: 96,   nota: "Live event · 26.6% acuerdos",  notaColor: "#10B981" },
  { periodo: "S4", fechas: "29 abr–12 may", dropiCrearon: 402, dropiPublicaron: 106, conv: 26.4, provEnviaron: null, recurrencia: 50.9, nota: "Post-live decay",               notaColor: "#F59E0B" },
  { periodo: "Q1", fechas: "14–28 may",     dropiCrearon: 882, dropiPublicaron: 150, conv: 17,   provEnviaron: 11,   recurrencia: null, nota: "Discovery · mínimo histórico", notaColor: "#EF4444" },
  { periodo: "Q2", fechas: "28 may–11 jun", dropiCrearon: 700, dropiPublicaron: 239, conv: 34.1, provEnviaron: 8,    recurrencia: null, nota: "Máximo histórico · Clarity",    notaColor: "#10B981" },
];

// ─── CSAT · satisfacción ──────────────────────────────────────────────────────
// Q2: 14 respuestas
const CSAT_ESTADO = [
  { label: "La negociación no avanzó",  pct: 42.9, color: "#EF4444" },
  { label: "Estamos conversando",        pct: 28.6, color: "#F59E0B" },
  { label: "Ya acordamos precio 🆕",    pct: 21.4, color: "#10B981" },
  { label: "Ya estoy vendiendo",         pct: 7.1,  color: "#10B981" },
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
          <span style={tag("#10B981", "#ECFDF5")}>8 abr – 11 jun 2026</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Caza Productos · Adopción y Retención
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Seguimiento del feature de matching dropi↔proveedor. 6 períodos evaluados (S1–S4 + Q1 + Q2).
            Fuente: <strong>UserPilot · Clarity · Bitácora UX</strong> · actualizado 11/06/2026.
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
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Señal de recuperación en Q2 — pero supply sigue crítico</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
            Conversión <strong>34.1% en Q2</strong> (máximo histórico, dobla el 17% de Q1). CSAT "no avanzó" bajó de 66.7% → 42.9%. Nuevo: <strong>21.4% acordó precio</strong> por primera vez. Sin embargo, proveedores activos siguen en <strong>56 — ratio 1 prov por cada 30 publicaciones</strong>. Clarity detectó nuevo bloqueante: <strong>dropis confunden el módulo con un catálogo de búsqueda</strong>.
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
              { icon: "🟢", titulo: "Conversión histórica Q2 — 34.1%",      desc: "Dobla Q1 (17%) y supera el mejor período semanal (28.5%). Con menos intentos (700 vs 882), más dropis publicaron (239 vs 150). Primera señal real de recuperación." },
              { icon: "🟢", titulo: "«Acordamos precio» emerge — 21.4%",     desc: "Categoría nueva en CSAT, nunca antes elegida. 50%+ de encuestados en estado activo (conversando + acordó precio). La señal de PMF más clara de todo el período." },
              { icon: "🟡", titulo: "Clarity — modelo mental equivocado",    desc: "Patrón detectado: catálogo → Caza Productos → intento de búsqueda → salida. Los dropis llegan pensando que es otro catálogo de búsqueda, no un módulo para publicar su necesidad. La mecánica inversa no se explica en ningún punto del flujo." },
              { icon: "🔴", titulo: "Supply sigue en mínimos críticos",       desc: "56 proveedores para 239 publicaciones en Q2. Solo 8 enviaron oferta. La mejora de conversión dropi hace más urgente el problema del lado supply — más publicaciones sin respuesta = más frustración futura." },
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
                <div style={sectionTitle}>Embudo Dropshippers · Q2</div>
                <div style={sectionSub}>28 may–11 jun 2026 · 700 usuarios</div>
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
              <strong>Conversión 34.1%</strong> — máximo histórico. 65.9% aún abandona: el modelo mental equivocado (Clarity) explica parte de ese gap.
            </div>
          </div>

          {/* Funnel Proveedores */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>Embudo Proveedores · Q1</div>
                <div style={sectionSub}>28 may–11 jun 2026 · 172 usuarios</div>
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
                  <td colSpan={2} style={{ ...tdStyle, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>Acumulado S1–Q2</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: ACCENT }}>3.218</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>826</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#10B981" }}>25.7%</td>
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
                <div style={sectionSub}>Q2 · 14 respuestas · 28 may–11 jun 2026</div>
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
              <strong>Mejora sostenida:</strong> "No avanzó" bajó 80% → 66.7% → 42.9%. Primera vez con "Ya acordamos precio" (21.4%) — señal de PMF más clara del período.
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
            <div style={sectionSub}>Plan de acción post Q2 · priorizado por impacto y urgencia · 11/06/2026.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: "1", paso: "Rediseñar onboarding / empty state — explicar en 3 pasos la mecánica inversa antes del formulario. CTA desde catálogo: «¿No lo encuentras? Pídelo a un proveedor». Clarity confirmó que el modelo mental equivocado genera abandono que el formulario no puede recuperar.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
              { n: "2", paso: "Activación urgente de proveedores — «Tráfico de proveedores» ya es queja explícita en CSAT. Contacto directo con prov. premium que abandonaron + plan de reactivación. Meta Q3: >80 prov. activos.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
              { n: "3", paso: "Cerrar bug «No se envió mi oferta» — presente desde S1. En Q2, de 13 que crearon oferta solo 8 la enviaron (38.5% pérdida). Activar CES en Q3 para confirmar si persiste.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
              { n: "4", paso: "Análisis Clarity profundo — identificar los términos que los dropis intentan buscar cuando entran al módulo. Son el insumo directo para el roadmap de categorización y para detectar demanda no satisfecha.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
              { n: "5", paso: "Diseñar prototipo Publicaciones a Ciegas — mostrar solo métricas del dropi (precio, volumen) sin revelar el producto. Testear con 5 dropis exitosos.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
              { n: "6", paso: "Score Dropshipper + Categorización + micro-survey post-WhatsApp — Score visible para proveedores · Filtros por nicho · Survey para capturar cierres reales que hoy son invisibles para el sistema.", urgencia: "Media", color: "#3B82F6", bg: "#EFF6FF" },
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
              { icon: "📊", titulo: "Embudos y retención",   desc: "UserPilot Dashboard → Flows y Cohortes. Bitácora actualizada el 11/06/2026. Próxima actualización: cierre Q3 (segunda quincena junio)." },
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
