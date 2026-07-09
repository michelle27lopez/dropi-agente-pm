"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";

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
  const isEmbedded = useIsEmbedded();
  const [docsOpen, setDocsOpen] = useState(true);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      {!isEmbedded && (
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
      )}

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

        {/* Recursos de Investigación y Documentación */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => { setDocsOpen(!docsOpen); if (docsOpen) setActiveDoc(null); }}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}
          >
            <span style={{ fontSize: 18 }}>📂</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Recursos de Investigación y Documentación</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginRight: 12 }}>IND-001 · Indicadores y Postulaciones</span>
            <span style={{ fontSize: 11, color: "var(--muted)", display: "inline-block", transition: "transform 0.2s", transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>

          {docsOpen && (
            <div style={{ borderTop: "1px solid var(--border)", background: "#FAFBFC" }}>
              {/* Cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 20 }}>

                {/* Card: Métricas */}
                <div
                  onClick={() => setActiveDoc(activeDoc === "metricas" ? null : "metricas")}
                  style={{ background: "var(--card)", border: `1px solid ${activeDoc === "metricas" ? ACCENT : "var(--border)"}`, borderRadius: 14, padding: 16, display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <span style={{ fontSize: 22, marginTop: 2 }}>📊</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Métricas del proyecto</span>
                      {activeDoc === "metricas" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>5 semanas de seguimiento en UserPilot (may–jun 2026). Embudo, retención y tendencia semanal.</div>
                  </div>
                </div>

                {/* Card: Experimento */}
                <div
                  onClick={() => setActiveDoc(activeDoc === "experimento" ? null : "experimento")}
                  style={{ background: "var(--card)", border: `1px solid ${activeDoc === "experimento" ? "#6366F1" : "var(--border)"}`, borderRadius: 14, padding: 16, display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <span style={{ fontSize: 22, marginTop: 2 }}>🧪</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Experimento · Activación del panel</span>
                      {activeDoc === "experimento" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", display: "inline-block" }} />}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>3 pasos para activar el descubrimiento del panel y motivar la postulación al siguiente nivel.</div>
                  </div>
                </div>

                {/* Card: Criterios de Avance */}
                <div
                  onClick={() => setActiveDoc(activeDoc === "criterios" ? null : "criterios")}
                  style={{ background: "var(--card)", border: `1px solid ${activeDoc === "criterios" ? "#F59E0B" : "var(--border)"}`, borderRadius: 14, padding: 16, display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <span style={{ fontSize: 22, marginTop: 2 }}>🏅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Criterios de Avance por Nivel</span>
                      {activeDoc === "criterios" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>Variables que definen el paso de Activo → Verificado → Premium → Exclusivo. Requisitos operativos oficiales.</div>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {activeDoc && (
                <div style={{ borderTop: "1px solid var(--border)", padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      {activeDoc === "metricas" && "📊 Métricas del proyecto · IND-001"}
                      {activeDoc === "experimento" && "🧪 Experimento · Panel de desempeño y postulación"}
                      {activeDoc === "criterios" && "🏅 Criterios de Avance · Verificado / Premium / Exclusivo"}
                    </div>
                    <button onClick={() => setActiveDoc(null)} style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
                      Cerrar ✕
                    </button>
                  </div>

                  {/* ── MÉTRICAS ── */}
                  {activeDoc === "metricas" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                        {[
                          { label: "Usuarios únicos panel", value: "137/sem", sub: "Promedio 5 semanas", color: ACCENT },
                          { label: "Click postularme",       value: "~24/sem", sub: "Promedio 4 sem",    color: "#10B981" },
                          { label: "Postulación completa",   value: "~10/sem", sub: "Modal superado",     color: "#F59E0B" },
                          { label: "Conversión global",      value: "5.7%",    sub: "Panel → postulación", color: "#6366F1" },
                        ].map(k => (
                          <div key={k.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, border: "1px solid var(--border)", textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, letterSpacing: "-0.03em" }}>{k.value}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg)", marginTop: 4 }}>{k.label}</div>
                            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{k.sub}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th style={thStyle}>Semana</th>
                              <th style={thR}>Vieron panel</th>
                              <th style={thR}>Click postularme</th>
                              <th style={thR}>Postulación completa</th>
                              <th style={thR}>Scanner</th>
                              <th style={thR}>Retención</th>
                              <th style={thR}>Conv.</th>
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
                                <td style={{ ...tdR, color: "#8B5CF6" }}>{w.retencion != null ? `${w.retencion}%` : "—"}</td>
                                <td style={tdR}>{w.postuladas != null && w.tablero != null ? `${((w.postuladas / w.tablero) * 100).toFixed(1)}%` : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", background: "#F8FAFC", borderRadius: 8, padding: "8px 14px", border: "1px solid var(--border)" }}>
                        Dashboard UserPilot: <strong style={{ color: "var(--fg)" }}>run.userpilot.io/dashboards/52</strong> · Solicitar a Laura los eventos de la semana actual cada lunes.
                      </div>
                    </div>
                  )}

                  {/* ── EXPERIMENTO ── */}
                  {activeDoc === "experimento" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                      {/* Resumen 3 pasos */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { n: "1", titulo: "Descubrimiento del panel", desc: "Mensaje a todos los proveedores con link directo al panel. Envío a cargo de Comercial.", cuando: "Inmediato", color: "#6366F1" },
                          { n: "2", titulo: "Postulación segmentada", desc: "Solo a quienes cumplen requisito de órdenes movilizadas. Copy diferenciado por nivel.", cuando: "Principios julio", color: "#10B981" },
                          { n: "3", titulo: "Reunión de seguimiento", desc: "Meet con muestra de proveedores que se postularon. Preguntas preparadas.", cuando: "Post-paso 2", color: "#F59E0B" },
                        ].map(s => (
                          <div key={s.n} style={{ background: "#F8FAFC", borderRadius: 12, padding: 14, border: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>{s.titulo}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5, marginBottom: 8 }}>{s.desc}</div>
                            <span style={tag(s.color, `${s.color}18`)}>{s.cuando}</span>
                          </div>
                        ))}
                      </div>

                      {/* Paso 1 */}
                      <div style={{ borderLeft: "3px solid #6366F1", paddingLeft: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#6366F1", marginBottom: 12 }}>Paso 1 · Mensaje de descubrimiento del panel</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Objetivo e hipótesis</div>
                            <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.5, marginBottom: 8 }}>Validar si una comunicación directa activa el descubrimiento del panel sin cambios en el producto.</div>
                            <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>Solo 112–159 proveedores consultan el panel semanalmente. Hipótesis: la mayoría <strong>no sabe que existe</strong>.</div>
                          </div>
                          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Segmento · Métricas de éxito</div>
                            <div style={{ fontSize: 12, color: "var(--fg)", marginBottom: 6 }}>Todos los proveedores activos (Colombia)</div>
                            {["↑ Usuarios únicos en el panel la semana post-envío vs semanas sin campaña", "% proveedores que hicieron clic en el link (UTM)", "Retención: ¿cuántos vuelven la semana siguiente?"].map((m, i) => (
                              <div key={i} style={{ fontSize: 11, color: "var(--muted)", display: "flex", gap: 6, marginBottom: 4 }}>
                                <span style={{ color: "#6366F1", flexShrink: 0 }}>·</span><span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ background: "#EEF2FF", borderRadius: 12, padding: "14px 16px", border: "1px solid #C7D2FE", marginBottom: 12 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#6366F1", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Copy del mensaje</div>
                          <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, marginBottom: 10, fontStyle: "italic" }}>
                            "Hola [Nombre], los dropshippers revisan tu historial de despachos y cumplimiento antes de trabajar contigo.<br /><br />¿Quieres ver cómo vas?"
                          </div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6366F1", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>
                            Ver mi desempeño →
                          </div>
                          <div style={{ fontSize: 10, color: "#6366F1", marginTop: 8, opacity: 0.75 }}>Link con UTM · Canal: CRM con botón interactivo · Responsable envío: Comercial</div>
                        </div>
                      </div>

                      {/* Paso 2 */}
                      <div style={{ borderLeft: "3px solid #10B981", paddingLeft: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#10B981", marginBottom: 4 }}>Paso 2 · Mensaje de postulación segmentado</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>Principios de julio · Solo a quienes cumplen requisito de órdenes movilizadas · Solicitar data a Miguel</div>
                        <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "10px 14px", border: "1px solid #FDE68A", marginBottom: 14, fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
                          <strong>Contexto:</strong> Requisito principal: 3.000+ órdenes movilizadas en los últimos 3 meses. Hay solicitudes represadas (130 Activo→Verificado · 30 Verificado→Premium). Enviar solo a quienes cumplen el requisito para no sobrecargar Comercial.
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                          {[
                            { seg: "Segmento 1 · No verificados con 3.000+ órdenes", destino: "→ Verificado", color: "#3B82F6", colorBg: "#EFF6FF", beneficios: "Aprobación automática de productos · Acceso a Caza Productos · Banner destacado en catálogo" },
                            { seg: "Segmento 2 · Verificados que cumplen requisito",  destino: "→ Premium",    color: ACCENT,    colorBg: ACCENT_BG, beneficios: "Visita comercial personalizada · Presencia en lives de Dropi · Relacionamiento con comunidades" },
                            { seg: "Segmento 3 · Premium que cumplen requisito",       destino: "→ Exclusivo", color: "#8B5CF6",  colorBg: "#F5F3FF", beneficios: "Video corporativo · Stands gratuitos en eventos · Préstamos para importación · WMS de inventario" },
                          ].map(s => (
                            <div key={s.seg} style={{ background: s.colorBg, borderRadius: 10, padding: "12px 14px", border: `1px solid ${s.color}30` }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.seg}</span>
                                <span style={tag(s.color, `${s.color}20`)}>{s.destino}</span>
                              </div>
                              <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.5, marginBottom: 6, fontStyle: "italic" }}>
                                "Hola [Nombre], ¿Sabías que como proveedor {s.destino.replace("→ ", "")} tendrías acceso a: {s.beneficios.split("·")[0].trim()}...? ¿Quieres postularte?"
                              </div>
                              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>{s.beneficios}</div>
                              <div style={{ display: "inline-flex", alignItems: "center", background: s.color, color: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700 }}>
                                Postularme {s.destino} →
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div style={{ fontSize: 11, color: "var(--muted)", background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)", lineHeight: 1.6 }}>
                            <strong style={{ color: "var(--fg)" }}>Pendientes antes de ejecutar</strong><br />
                            · Pedir a Miguel data segmentada por nivel y cumplimiento de órdenes movilizadas<br />
                            · Confirmar con Enrique que el flujo del CRM esté funcionando
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)", background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)", lineHeight: 1.6 }}>
                            <strong style={{ color: "var(--fg)" }}>Métricas de éxito</strong><br />
                            · Formularios completados en la semana post-envío<br />
                            · Tasa de conversión por segmento<br />
                            · Tiempo de procesamiento por Comercial
                          </div>
                        </div>
                      </div>

                      {/* Paso 3 */}
                      <div style={{ borderLeft: "3px solid #F59E0B", paddingLeft: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B", marginBottom: 4 }}>Paso 3 · Reunión de seguimiento con quienes se postularon</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>Insumo: data de UserPilot/CRM de proveedores que hicieron clic en "Postularme" en el Paso 2</div>
                        <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "10px 14px", border: "1px solid #FDE68A", marginBottom: 14, fontSize: 12, color: "var(--fg)", lineHeight: 1.5 }}>
                          Organizar meet con muestra de proveedores que se postularon. Objetivo: entender el comportamiento e intención real, detectar fricciones en el proceso de postulación desde su propia experiencia.
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Preguntas preparadas</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {[
                            "¿Qué te motivó a postularte al siguiente nivel?",
                            "¿Conocías los beneficios del nuevo nivel antes de recibir el mensaje, o fue la primera vez que los veías?",
                            "¿Tuviste alguna dificultad o duda al momento de completar el formulario de postulación?",
                            "¿Has recibido alguna respuesta o seguimiento después de postularte? ¿Cuánto tiempo ha pasado?",
                            "¿Sabías que necesitabas cumplir ciertos requisitos (como un número mínimo de órdenes movilizadas) antes de postularte?",
                            "¿Qué esperarías recibir o saber durante el proceso de espera de tu postulación?",
                          ].map((q, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--fg)", background: "#F8FAFC", borderRadius: 8, padding: "8px 12px", border: "1px solid var(--border)", lineHeight: 1.4 }}>
                              <span style={{ color: "#F59E0B", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                              <span>{q}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 12, fontSize: 11, color: "var(--muted)", background: "#F8FAFC", borderRadius: 8, padding: "8px 12px", border: "1px solid var(--border)" }}>
                          <strong style={{ color: "var(--fg)" }}>Responsables:</strong> Extracción datos → Producto · Preparación preguntas → Producto · Reclutamiento y ejecución → Producto
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ── CRITERIOS DE AVANCE ── */}
                  {activeDoc === "criterios" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                      {/* Niveles resumen */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                        {[
                          { nivel: "Activo", desc: "Sin validación. Sube productos libremente.", color: "#9CA3AF", bg: "#F9FAFB" },
                          { nivel: "Verificado", desc: "3.000 órdenes/trim. Cumple operación base.", color: "#3B82F6", bg: "#EFF6FF" },
                          { nivel: "Premium", desc: "20.000 órdenes/trim. Máxima operación.", color: "#F59E0B", bg: "#FFFBEB" },
                          { nivel: "Exclusivo", desc: "Igual que Premium. Trabaja solo con Dropi.", color: "#8B5CF6", bg: "#F5F3FF" },
                        ].map(n => (
                          <div key={n.nivel} style={{ background: n.bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${n.color}30`, textAlign: "center" }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: n.color, marginBottom: 6 }}>{n.nivel}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{n.desc}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tabla de criterios */}
                      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 12 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead>
                            <tr style={{ background: "#F8FAFC" }}>
                              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", width: "40%" }}>Variable a evaluar</th>
                              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#3B82F6", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>Verificado</th>
                              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#F59E0B", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>Premium</th>
                              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700, color: "#8B5CF6", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>Exclusivo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { variable: "Órdenes movilizadas por trimestre", v: "3.000", p: "20.000", e: "20.000", highlight: true },
                              { variable: "Utilización de EcomScanner",         v: "100%",  p: "100%",  e: "100%" },
                              { variable: "Envío de manifiestos",               v: "Diario", p: "Diario", e: "Diario" },
                              { variable: "Gestión de garantías",               v: "100%",  p: "100%",  e: "100%" },
                              { variable: "Tiempos en garantías",               v: "48 h",  p: "24 h",  e: "24 h",  highlight: true },
                              { variable: "% de despachos",                     v: "100%",  p: "100%",  e: "100%" },
                              { variable: "Tiempo de despachos",                v: "48 h",  p: "24 h",  e: "24 h",  highlight: true },
                              { variable: "Comunicación con área",              v: "Efectiva", p: "Efectiva", e: "Efectiva" },
                              { variable: "Exclusividad con Dropi",             v: "—",    p: "—",    e: "Sí ✓", highlight: true },
                            ].map((row, i) => (
                              <tr key={row.variable} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff", borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "9px 14px", fontWeight: row.highlight ? 700 : 500, color: "var(--fg)" }}>{row.variable}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 700, color: "#3B82F6", borderLeft: "1px solid var(--border)", background: "#EFF6FF30" }}>{row.v}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 700, color: "#F59E0B", borderLeft: "1px solid var(--border)", background: "#FFFBEB30" }}>{row.p}</td>
                                <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: 700, color: "#8B5CF6", borderLeft: "1px solid var(--border)", background: "#F5F3FF30" }}>{row.e}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Nota Exclusivo */}
                      <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 16px", border: "1px solid #DDD6FE", fontSize: 12, color: "#5B21B6", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                        <div>
                          <strong>Exclusivo = Premium + trabajar solo con Dropi.</strong> Todos los requisitos operativos son idénticos al nivel Premium. La diferencia es el compromiso de exclusividad: el proveedor no puede operar en otras plataformas de dropshipping simultáneamente.
                        </div>
                      </div>

                      {/* Solicitud de data */}
                      <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "12px 16px", border: "1px solid #FED7AA", fontSize: 12, color: "#9A3412", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>📋</span>
                        <div>
                          <strong>Datos requeridos a Miguel (semanal):</strong> Para evaluar avance de proveedores, necesitamos extraer semanalmente — órdenes movilizadas por trimestre, uso de EcomScanner, frecuencia de manifiestos, % despachos y tiempos, tasa de garantías — agrupados por proveedor y nivel actual.
                          <div style={{ marginTop: 6, fontSize: 11, color: "#C2410C" }}>Ver solicitud formal de data → <em>solicitud-data-indicadores.html</em></div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
