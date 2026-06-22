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

const ACCENT = "#6366F1";
const ACCENT_BG = "#EEF2FF";

// ─── KPIs reales · UserPilot may–jun 2026 ────────────────────────────────────
const KPIS = [
  { label: "Suppliers Colombia",    value: "3.833",   sub: "Total Dropi DB · jun 2026",           color: "var(--fg)", bg: "#F8FAFC", note: "Fuente: Dropi DB"   },
  { label: "Usuarios únicos panel", value: "137/sem", sub: "Promedio 5 sem · pico 159 (7 may)",   color: ACCENT,      bg: ACCENT_BG, note: "Fuente: UserPilot" },
  { label: "Click 'Postularme'",    value: "~24/sem", sub: "Promedio 4 sem con datos completos",  color: "#10B981",   bg: "#ECFDF5", note: "Fuente: UserPilot" },
  { label: "Postulación completa",  value: "~10/sem", sub: "Superaron modal de requisitos",       color: "#F59E0B",   bg: "#FFFBEB", note: "Fuente: UserPilot" },
  { label: "Retención",             value: "~11%",    sub: "Suppliers que regresan en la semana", color: "#8B5CF6",   bg: "#F5F3FF", note: "Fuente: UserPilot" },
];

// ─── Funnel real ──────────────────────────────────────────────────────────────
const FUNNEL = [
  { label: "Vieron tablero",       value: "137/sem", pct: 100, color: ACCENT },
  { label: "Click postularme",     value: "~24",     pct: 17,  color: "#10B981" },
  { label: "Postulación completa", value: "~10",     pct: 7,   color: "#F59E0B" },
];

// ─── Distribución real · Dropi DB · Colombia · jun 2026 ──────────────────────
const TIPO_CON_ACTIVO = [
  { tipo: "Activo (base)",     count: 3396, pct: 88.6, color: "#9CA3AF", bg: "#F3F4F6" },
  { tipo: "Verificado",        count: 358,  pct: 9.3,  color: "#3B82F6", bg: "#EFF6FF" },
  { tipo: "Premium",           count: 50,   pct: 1.3,  color: ACCENT,    bg: ACCENT_BG },
  { tipo: "Premium Exclusivo", count: 29,   pct: 0.8,  color: "#8B5CF6", bg: "#F5F3FF" },
];

const TIPO_SIN_ACTIVO = [
  { tipo: "Verificado",        count: 358, pct: 81.9, color: "#3B82F6", bg: "#EFF6FF" },
  { tipo: "Premium",           count: 50,  pct: 11.4, color: ACCENT,    bg: ACCENT_BG },
  { tipo: "Premium Exclusivo", count: 29,  pct: 6.6,  color: "#8B5CF6", bg: "#F5F3FF" },
];

// ─── Tendencia semanal · Bitácora may–jun 2026 ───────────────────────────────
type WeekRow = {
  semana: string;
  tablero: number | null;
  postulacion: number | null;
  postuladas: number | null;
  scanner: number | null;
  retencion: number | null;
};

const WEEKLY: WeekRow[] = [
  { semana: "07–14 may",    tablero: 159, postulacion: 24,   postuladas: 9,    scanner: 4,    retencion: 12.0 },
  { semana: "14–21 may",    tablero: 153, postulacion: 27,   postuladas: 10,   scanner: 2,    retencion: 11.5 },
  { semana: "22–28 may",    tablero: 132, postulacion: 22,   postuladas: 8,    scanner: 3,    retencion: 10.2 },
  { semana: "29 may–4 jun", tablero: 130, postulacion: 23,   postuladas: 12,   scanner: 3,    retencion: 10.8 },
  { semana: "05–11 jun",    tablero: 112, postulacion: null, postuladas: null, scanner: null, retencion: null },
];

// ─── Meta estratégica ────────────────────────────────────────────────────────
const META = [
  { tier: "No verificado (Activo)", actual: 88.6, meta: 20, actualN: 3396, metaN: 767,  gap: -2629, color: "#9CA3AF" },
  { tier: "Verificado",             actual: 9.3,  meta: 40, actualN: 358,  metaN: 1533, gap: -1175, color: "#3B82F6" },
  { tier: "Premium + P. Exclusivo", actual: 2.1,  meta: 40, actualN: 79,   metaN: 1533, gap: -1454, color: "#8B5CF6" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IndicadoresPage() {
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
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Indicadores · Postulaciones</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag(ACCENT, ACCENT_BG)}>IND-001</span>
          <span style={tag("#10B981", "#ECFDF5")}>In Progress</span>
          <span style={tag("#6366F1", "#EEF2FF")}>UserPilot · may–jun 2026</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title block */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Panel de Indicadores · Tablero de Desempeño
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Cuántos suppliers ven su tablero de desempeño y cuántos se postulan para avanzar de nivel.
            Datos reales de <strong>UserPilot</strong> — 5 semanas de seguimiento (07 mayo – 11 junio 2026).
          </p>
        </div>

        {/* KPI grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 12 }}>
          {KPIS.map(k => (
            <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
                {k.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: k.color, lineHeight: 1 }}>
                {k.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{k.sub}</div>
              <div style={{ marginTop: 6, fontSize: 11, background: k.bg, color: k.color, padding: "2px 7px", borderRadius: 20, display: "inline-block", fontWeight: 600 }}>
                {k.note}
              </div>
            </div>
          ))}
        </div>

        {/* Hallazgos */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Hallazgos · Bitácora may–jun 2026</div>
            <div style={sectionSub}>5 semanas de seguimiento en UserPilot (07 may – 11 jun 2026).</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "📉", titulo: "Tendencia descendente",    desc: "Usuarios únicos en panel cayeron -30% en 5 semanas (159 → 112). Sin comunicación activa ni intervención, el módulo pierde tracción semana a semana." },
              { icon: "🚧", titulo: "Fricción dura en el modal", desc: "58% de drop entre click en banner (~24) y postulación completada (~10). Los requisitos del modal frenan la conversión antes de que el supplier pueda avanzar." },
              { icon: "📋", titulo: "CSAT sin activar",          desc: "5 semanas de experimento sin encuesta de satisfacción. No tenemos señal de por qué los suppliers no completan la postulación ni cómo mejorar el módulo." },
              { icon: "🔍", titulo: "Ecom Scanner invisible",    desc: "Solo 2–4 usos por semana en toda la plataforma. El módulo no está siendo descubierto o no genera valor percibido por los suppliers." },
            ].map(h => (
              <div key={h.titulo} style={{ display: "flex", gap: 10, padding: "12px", background: "#F8FAFC", borderRadius: 10, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{h.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel + Distribución */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Funnel */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>Embudo · tablero → postulación</div>
                <div style={sectionSub}>Conversión desde primera vista del tablero hasta postulación enviada. Promedio 4 semanas con datos completos.</div>
              </div>
              <span style={tag(ACCENT, ACCENT_BG)}>Funnel</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FUNNEL.map((step, i) => (
                <div key={step.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                      {i + 1}. {step.label}
                    </span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: step.color }}>{step.value}</span>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{step.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${step.pct}%`, background: step.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "10px 12px", background: "#FEF3C7", borderRadius: 8, fontSize: 12, color: "#78350F", border: "1px solid #FDE68A", lineHeight: 1.4 }}>
              <strong>58% de drop</strong> entre click en banner y postulación completa — el modal de requisitos filtra agresivamente.
            </div>
          </div>

          {/* Distribución por tipo */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={sectionTitle}>Distribución por tipo de proveedor</div>
                <div style={sectionSub}>Colombia · Dropi DB · jun 2026 · total: 3.833 suppliers</div>
              </div>
              <span style={tag("#10B981", "#ECFDF5")}>Data real</span>
            </div>

            {/* Con ACTIVO */}
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "16px 0 10px" }}>
              Incluyendo Activos · total 3.833
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TIPO_CON_ACTIVO.map(t => (
                <div key={t.tipo}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{t.tipo}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.count.toLocaleString("es-CO")}</span>
                      <span style={{ fontSize: 11, color: "var(--muted)", width: 36, textAlign: "right" }}>{t.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Sin ACTIVO */}
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "20px 0 10px" }}>
              Solo proveedores con nivel · total 437
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TIPO_SIN_ACTIVO.map(t => (
                <div key={t.tipo}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{t.tipo}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.count.toLocaleString("es-CO")}</span>
                      <span style={{ fontSize: 11, color: "var(--muted)", width: 36, textAlign: "right" }}>{t.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Meta estratégica vs Estado actual */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Meta estratégica vs Estado actual</div>
              <div style={sectionSub}>Plan estratégico: 40% Verificados · 20% No verificado · 40% Premium + Premium Exclusivo. Colombia · 3.833 suppliers.</div>
            </div>
            <span style={tag("#EF4444", "#FEF2F2")}>Gap crítico</span>
          </div>

          <div style={{ padding: "12px 16px", background: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA", marginBottom: 20, fontSize: 13, color: "#7F1D1D", lineHeight: 1.5 }}>
            Hoy el <strong>88.6% está en base sin verificar</strong>. La meta es que solo el 20% quede ahí — hay que mover <strong>2.629 suppliers</strong> hacia niveles superiores. Con el ritmo actual (10 postulaciones/semana), el gap no se cierra sin intervención estructural.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {META.map(m => (
              <div key={m.tier}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{m.tier}</span>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Actual: <strong style={{ color: m.color }}>{m.actual}% ({m.actualN.toLocaleString("es-CO")})</strong></span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Meta: <strong style={{ color: "var(--fg)" }}>{m.meta}% ({m.metaN.toLocaleString("es-CO")})</strong></span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }}>Gap: {m.gap.toLocaleString("es-CO")}</span>
                  </div>
                </div>
                <div style={{ position: "relative", height: 12, background: "#F3F4F6", borderRadius: 999, overflow: "visible" }}>
                  <div style={{ height: "100%", width: `${Math.min(m.actual, 100)}%`, background: m.color, borderRadius: 999, opacity: 0.85 }} />
                  <div style={{
                    position: "absolute", top: -2, bottom: -2,
                    left: `${m.meta}%`, width: 3,
                    background: "#1F2937", borderRadius: 999,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span style={{ fontSize: 10, color: m.color, fontWeight: 700 }}>Actual {m.actual}%</span>
                  <span style={{ fontSize: 10, color: "#1F2937", fontWeight: 700 }}>Meta {m.meta}% ↑</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24 }}>
            <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "14px", textAlign: "center", border: "1px solid #FECACA" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#EF4444", letterSpacing: "-0.03em" }}>2.629</div>
              <div style={{ fontSize: 11, color: "#7F1D1D", marginTop: 4, fontWeight: 600 }}>Activos a mover hacia arriba</div>
            </div>
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "14px", textAlign: "center", border: "1px solid #BFDBFE" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#3B82F6", letterSpacing: "-0.03em" }}>1.175</div>
              <div style={{ fontSize: 11, color: "#1E40AF", marginTop: 4, fontWeight: 600 }}>Verificados faltantes</div>
            </div>
            <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "14px", textAlign: "center", border: "1px solid #DDD6FE" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#8B5CF6", letterSpacing: "-0.03em" }}>1.454</div>
              <div style={{ fontSize: 11, color: "#5B21B6", marginTop: 4, fontWeight: 600 }}>Premium faltantes</div>
            </div>
          </div>
        </div>

        {/* Tabla semanal */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Tendencia semanal · 5 semanas · may–jun 2026</div>
              <div style={sectionSub}>Fuente: UserPilot · Bitácora Indicadores. Semana 5 sin datos de postulación — pendiente exportar.</div>
            </div>
            <span style={tag("var(--muted)", "#F3F4F6")}>Semana a semana</span>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Semana</th>
                  <th style={thR}>Vieron tablero</th>
                  <th style={thR}>Click postularme</th>
                  <th style={thR}>Postulación completa</th>
                  <th style={thR}>Scanner</th>
                  <th style={thR}>Retención</th>
                  <th style={thR}>Conv. tablero→post.</th>
                </tr>
              </thead>
              <tbody>
                {WEEKLY.map((w, i) => (
                  <tr key={w.semana} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{w.semana}</td>
                    <td style={{ ...tdR, color: ACCENT, fontWeight: 700 }}>{w.tablero ?? "—"}</td>
                    <td style={tdR}>{w.postulacion ?? "—"}</td>
                    <td style={{ ...tdR, color: "#10B981", fontWeight: 700 }}>{w.postuladas ?? "—"}</td>
                    <td style={tdR}>{w.scanner ?? "—"}</td>
                    <td style={{ ...tdR, color: "#8B5CF6", fontWeight: 600 }}>{w.retencion != null ? `${w.retencion}%` : "—"}</td>
                    <td style={tdR}>
                      {w.postuladas != null && w.tablero != null
                        ? `${((w.postuladas / w.tablero) * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>5 semanas</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: ACCENT }}>686</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>96</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#10B981" }}>39</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>12</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#8B5CF6" }}>~11.1%</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>5.7%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Próximos pasos */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Próximos pasos</div>
            <div style={sectionSub}>Acciones definidas a partir del análisis de 5 semanas.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { paso: "Activar CSAT en UserPilot — 5 semanas sin satisfacción medida", owner: "Laura", status: "Pendiente" },
              { paso: "Experimento de visibilidad del módulo — descubrimiento del tablero", owner: "Diseño", status: "Pendiente" },
              { paso: "Reducir fricción del modal — mostrar beneficios antes de requisitos", owner: "Diseño + TI", status: "Pendiente" },
              { paso: "Investigar caída -30% en usuarios únicos del panel (159 → 112)", owner: "Jaime", status: "En curso" },
              { paso: "Obtener datos de semana 5 (05–11 jun) para postulación banner y modal", owner: "Laura", status: "Pendiente" },
            ].map((p, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: "10px 14px", borderRadius: 10,
                background: i % 2 === 0 ? "#F8FAFC" : "#fff",
                border: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 14, color: "var(--muted)", flexShrink: 0 }}>→</span>
                <div style={{ flex: 1, fontSize: 13, color: "var(--fg)" }}>{p.paso}</div>
                <span style={tag(ACCENT, ACCENT_BG)}>{p.owner}</span>
                <span style={tag(
                  p.status === "En curso" ? "#10B981" : "#F59E0B",
                  p.status === "En curso" ? "#ECFDF5" : "#FFFBEB",
                )}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preguntas abiertas */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Preguntas abiertas</div>
            <div style={sectionSub}>Hipótesis pendientes de validar con el equipo.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { q: "¿Por qué cayeron los usuarios únicos del panel -30% en 5 semanas? ¿Menos suppliers activos o menos visibilidad del módulo?", owner: "Jaime + TI", urgencia: "Alta" },
              { q: "¿Por qué el modal filtra al 58% de los interesados? ¿Requisitos muy altos o UX del modal confusa?", owner: "Diseño", urgencia: "Alta" },
              { q: "¿El tablero distingue por tipo de proveedor? ¿Qué ven Verificados vs No Verificados?", owner: "TI", urgencia: "Media" },
              { q: "¿El Ecom Scanner tiene visibilidad suficiente o está oculto en el flujo?", owner: "Diseño", urgencia: "Media" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 14px", borderRadius: 10,
                background: i % 2 === 0 ? "#F8FAFC" : "#fff",
                border: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, flexShrink: 0, paddingTop: 1 }}>{i + 1}.</span>
                <div style={{ flex: 1, fontSize: 13, color: "var(--fg)", lineHeight: 1.4 }}>{item.q}</div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <span style={tag(ACCENT, ACCENT_BG)}>{item.owner}</span>
                  <span style={tag(
                    item.urgencia === "Alta" ? "#EF4444" : "#F59E0B",
                    item.urgencia === "Alta" ? "#FEF2F2" : "#FFFBEB",
                  )}>{item.urgencia}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota de fuente */}
        <div style={{ ...card, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
            Fuente de datos · Cómo actualizar
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "📊", titulo: "Eventos de comportamiento", desc: "UserPilot Dashboard → Events. Dashboard de seguimiento: run.userpilot.io/dashboards/52. Exportar CSV o pedir a Laura los números directamente." },
              { icon: "🗄️", titulo: "Distribución por tipo",    desc: "Query Dropi DB: SELECT tipo_proveedor, COUNT(*) FROM proveedores WHERE pais = 'CO' GROUP BY tipo_proveedor. Datos actualizados jun 2026." },
              { icon: "📈", titulo: "Tendencia semanal",         desc: "UserPilot → Segments → Export semanal. Actualizar array WEEKLY en este archivo con los valores de cada semana." },
              { icon: "📋", titulo: "CSAT · satisfacción",       desc: "Pendiente activar en UserPilot. Solicitar a Laura activar la encuesta de satisfacción para el módulo de indicadores." },
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
