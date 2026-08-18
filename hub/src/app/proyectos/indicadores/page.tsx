"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";
import Breadcrumb from "@/components/Breadcrumb";
import { FASE_LABEL, faseDe } from "@/lib/fase";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

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

const gridStroke = "#E5E7EB";
const axisTick = { fontSize: 11, fill: "#6B7280" };
const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const labelStyle = { fontSize: 10, fill: "#6B7280", fontWeight: 700 };
const MUTED_BAR = "#D1D5DB";

// ─── KPIs reales · UserPilot may–jun 2026 ────────────────────────────────────
const KPIS = [
  { label: "Suppliers Colombia",    value: "3.833",   sub: "Total Dropi DB · jun 2026",                          color: "var(--fg)", bg: "#F8FAFC", note: "Fuente: Dropi DB"   },
  { label: "Usuarios únicos panel", value: "136/sem", sub: "Promedio 13 sem · rango semanas completas 112–159 · semana en curso (31 jul–3 ago, 4 días): 88", color: ACCENT,      bg: ACCENT_BG, note: "Fuente: UserPilot" },
  { label: "Click 'Postularme'",    value: "~25/sem", sub: "Promedio 12 de 13 semanas con datos completos",                 color: "#10B981",   bg: "#ECFDF5", note: "Fuente: UserPilot" },
  { label: "Postulación completa",  value: "~12/sem", sub: "Superaron modal de requisitos",                      color: "#F59E0B",   bg: "#FFFBEB", note: "Fuente: UserPilot" },
  { label: "Retención",             value: "~28%",    sub: "Salto de ~11% a ~45% desde 12 jun · causa sin confirmar · sin dato en semanas 10–16 jul a 31 jul–3 ago (no reproducible vía MCP con la definición histórica, pendiente confirmar con Laura/Miguel Ángel)", color: "#8B5CF6", bg: "#F5F3FF", note: "Fuente: UserPilot" },
];

// ─── Funnel real ──────────────────────────────────────────────────────────────
const FUNNEL = [
  { label: "Vieron tablero",       value: "136/sem", pct: 100, color: ACCENT },
  { label: "Click postularme",     value: "~25",     pct: 18,  color: "#10B981" },
  { label: "Postulación completa", value: "~12",     pct: 9,   color: "#F59E0B" },
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
  { semana: "12–18 jun",    tablero: 141, postulacion: 25,   postuladas: 12,   scanner: 1,    retencion: 41.8 },
  { semana: "19–25 jun",    tablero: 116, postulacion: 14,   postuladas: 7,    scanner: 1,    retencion: 45.7 },
  { semana: "26 jun–2 jul", tablero: 135, postulacion: 28,   postuladas: 14,   scanner: 3,    retencion: 44.6 },
  { semana: "02–09 jul",    tablero: 154, postulacion: 26,   postuladas: 13,   scanner: 2,    retencion: 48.7 },
  { semana: "10–16 jul",    tablero: 149, postulacion: 33,   postuladas: 21,   scanner: 3,    retencion: null },
  { semana: "17–23 jul",    tablero: 143, postulacion: 29,   postuladas: 16,   scanner: 4,    retencion: null },
  { semana: "24–30 jul",    tablero: 157, postulacion: 32,   postuladas: 16,   scanner: 6,    retencion: null },
  { semana: "31 jul–3 ago", tablero: 88,  postulacion: 19,   postuladas: 7,    scanner: 2,    retencion: null },
];

// ─── CSAT dropshippers→proveedor · "CSAT Indicadores Proveedores", activa desde 17 jun ──────
// No es el CSAT de proveedores (pendiente, ver Próximos pasos) — mide cómo califican los
// dropshippers al proveedor en la página de detalle. Semanas antes de 17 jun no tienen dato.
const CSAT_POR_SEMANA: Record<string, { n: number; promedio: number }> = {
  "12–18 jun":    { n: 199, promedio: 4.18 },
  "19–25 jun":    { n: 365, promedio: 4.30 },
  "26 jun–2 jul": { n: 228, promedio: 4.32 },
  "02–09 jul":    { n: 228, promedio: 4.31 },
  "10–16 jul":    { n: 194, promedio: 4.50 },
  "17–23 jul":    { n: 187, promedio: 4.42 },
  "24–30 jul":    { n: 175, promedio: 4.30 },
  "31 jul–3 ago": { n: 37,  promedio: 4.19 },
};

// ─── Hallazgo puntual de cada semana · grounded en la data de WEEKLY y CSAT_POR_SEMANA ───────
const WEEK_HALLAZGOS: Record<string, string> = {
  "07–14 may": "Semana de referencia: el nivel más alto de tráfico al panel en las 9 semanas (159) y retención baja (12.0%) — consistente con el resto de mayo.",
  "14–21 may": "Tablero baja levemente a 153. Postulación completa sube a 10. Retención similar a la semana anterior (11.5%).",
  "22–28 may": "Tablero sigue bajando (132), tercera semana consecutiva de caída. Retención cae al mínimo del periodo (10.2%).",
  "29 may–4 jun": "Tablero se estabiliza en 130 tras 3 semanas de caída. Postulación completa sube a 12 (máximo hasta ahora). Retención se recupera levemente (10.8%).",
  "05–11 jun": "Solo tenemos 'vieron tablero' (112, el mínimo de las 9 semanas) — click postularme, postulación completa, scanner y retención no se exportaron esta semana. Pendiente completar con Laura.",
  "12–18 jun": "Primera semana con retención alta: salta a 41.8% desde ~11% (~4x) sin causa confirmada — pregunta abierta. Tablero se recupera de 112 a 141. También arranca en esta semana (17 jun) la encuesta CSAT de dropshippers→proveedor: 199 respuestas parciales (solo 2 días), promedio 4.18/5.",
  "19–25 jun": "Tablero vuelve a bajar a 116 pese a que la retención se mantiene alta (45.7%) — ambos movimientos no parecen correlacionados de forma obvia. CSAT: 365 respuestas, promedio 4.30/5.",
  "26 jun–2 jul": "Tablero se recupera a 135, retención estable en 44.6%. Mejor semana de postulación completa del periodo (14). CSAT: 228 respuestas, promedio 4.32/5.",
  "02–09 jul": "Tablero alcanza 154 — el nivel más alto desde la semana inicial (159). Retención en su punto más alto del periodo (48.7%). CSAT: 228 respuestas, promedio 4.31/5, estable.",
  "10–16 jul": "Tablero baja levemente a 149 (-5 vs semana anterior, -3.2%), pero se mantiene por encima del promedio de las 9 semanas previas (137). Click postularme sube a 33 (+7, +26.9%) — el valor más alto registrado hasta ahora. Postulación completa sube a 21 (+8, +61.5%) — también el máximo del periodo. Scanner en 3, dentro del rango histórico (1–4). Retención: sin dato — no se pudo reproducir vía MCP UserPilot con la misma definición usada en semanas anteriores (pendiente confirmar metodología con Laura/Miguel Ángel). CSAT: sin dato (el reporte de CSAT no forma parte del dashboard 52 consultado vía MCP).",
  "17–23 jul": "Tablero baja a 143 (-6 vs semana anterior, -4.0%), se mantiene por encima del promedio de las 9 semanas previas (137). Click postularme baja a 29 (-4, -12.1%), aún por encima del promedio previo (~24). Postulación completa baja a 16 (-5, -23.8%), aún por encima del promedio previo (~11). Scanner sube a 4, el máximo previamente visto en el periodo may–jul. Retención y CSAT: sin dato (misma razón que la semana anterior).",
  "24–30 jul": "Tablero sube a 157 (+14 vs semana anterior, +9.8%) — el nivel más alto desde la semana inicial (159, 07–14 may). Click postularme sube a 32 (+3, +10.3%), cerca del máximo del periodo (33). Postulación completa se mantiene en 16 (= vs semana anterior). Scanner sube a 6 — supera por primera vez el rango histórico de 1–4 usos/semana visto en las 9 semanas previas. Retención y CSAT: sin dato (misma razón).",
  "31 jul–3 ago": "Semana parcial: 4 de 7 días (corte al 3 de agosto, fecha actual). Tablero: 88, Click postularme: 19, Postulación completa: 7, Scanner: 2 — cifras crudas de una semana en curso, no comparables directamente contra semanas completas de 7 días. Retención y CSAT: sin dato (misma razón que semanas anteriores).",
};

// ─── Meta estratégica ────────────────────────────────────────────────────────
const META = [
  { tier: "No verificado (Activo)", actual: 88.6, meta: 20, actualN: 3396, metaN: 767,  gap: -2629, color: "#9CA3AF" },
  { tier: "Verificado",             actual: 9.3,  meta: 40, actualN: 358,  metaN: 1533, gap: -1175, color: "#3B82F6" },
  { tier: "Premium + P. Exclusivo", actual: 2.1,  meta: 40, actualN: 79,   metaN: 1533, gap: -1454, color: "#8B5CF6" },
];

// ─── KPI de una semana, con delta vs semana anterior ─────────────────────────
function weekDelta(curr: number | null, prev: number | null): string {
  if (curr == null) return "Sin datos esta semana";
  if (prev == null) return "Sin dato de la semana anterior";
  const d = curr - prev;
  if (d === 0) return "= vs. semana anterior";
  return `${d > 0 ? "↑" : "↓"} ${Math.abs(d)} vs. semana anterior`;
}

function TrendBarChart({
  data, dataKey, activeSemana, color, title, unit = "",
}: {
  data: WeekRow[];
  dataKey: "tablero" | "retencion";
  activeSemana?: string;
  color: string;
  title: string;
  unit?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>{title}</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={gridStroke} />
          <XAxis dataKey="semana" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} interval={0} />
          <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
          <Bar dataKey={dataKey} name={title} radius={[4, 4, 0, 0]} maxBarSize={40}>
            <LabelList dataKey={dataKey} position="top" style={labelStyle} formatter={(v: string | number | boolean | null | undefined) => (v != null ? `${v}${unit}` : "")} />
            {data.map(d => (
              <Cell key={d.semana} fill={!activeSemana || d.semana === activeSemana ? color : MUTED_BAR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WeekPanel({ week, prev }: { week: WeekRow; prev: WeekRow | null }) {
  const conv = week.postuladas != null && week.tablero != null ? (week.postuladas / week.tablero) * 100 : null;
  const items = [
    { label: "Vieron tablero",       value: week.tablero,     color: ACCENT,      bg: ACCENT_BG,  delta: weekDelta(week.tablero, prev?.tablero ?? null) },
    { label: "Click postularme",     value: week.postulacion, color: "#10B981",   bg: "#ECFDF5",  delta: weekDelta(week.postulacion, prev?.postulacion ?? null) },
    { label: "Postulación completa", value: week.postuladas,  color: "#F59E0B",   bg: "#FFFBEB",  delta: weekDelta(week.postuladas, prev?.postuladas ?? null) },
    { label: "Ecom Scanner",         value: week.scanner,     color: "#6B7280",   bg: "#F3F4F6",  delta: weekDelta(week.scanner, prev?.scanner ?? null) },
  ];
  const hallazgo = WEEK_HALLAZGOS[week.semana];
  const csat = CSAT_POR_SEMANA[week.semana];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={tag(ACCENT, ACCENT_BG)}>{week.semana}</span>
        {week.tablero == null && <span style={tag("#F59E0B", "#FFFBEB")}>Sin datos exportados</span>}
        {csat && <span style={tag("#8B5CF6", "#F5F3FF")}>CSAT dropshippers: {csat.promedio}/5 ({csat.n} resp.)</span>}
      </div>

      {hallazgo && (
        <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: ACCENT_BG, borderRadius: 10, border: "1px solid #C7D2FE" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔎</span>
          <div style={{ fontSize: 13, color: "#3730A3", lineHeight: 1.5 }}>{hallazgo}</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        {items.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}`, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: k.color, lineHeight: 1 }}>
              {k.value ?? "—"}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ marginBottom: 14 }}>
          <div style={sectionTitle}>Esta semana en el contexto de las 13 semanas</div>
          <div style={sectionSub}>{week.semana} resaltada en naranja/morado · el resto en gris para comparar.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <TrendBarChart data={WEEKLY} dataKey="tablero" activeSemana={week.semana} color={ACCENT} title="Vieron tablero" />
          <TrendBarChart data={WEEKLY} dataKey="retencion" activeSemana={week.semana} color="#8B5CF6" title="Retención" unit="%" />
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={sectionTitle}>Retención y conversión</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>Retención</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#8B5CF6", letterSpacing: "-0.03em" }}>
              {week.retencion != null ? `${week.retencion}%` : "—"}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{weekDelta(week.retencion, prev?.retencion ?? null)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>Conv. tablero → postulación</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#F59E0B", letterSpacing: "-0.03em" }}>
              {conv != null ? `${conv.toFixed(1)}%` : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IndicadoresPage() {
  const isEmbedded = useIsEmbedded();
  const [docsOpen, setDocsOpen] = useState(true);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [tabId, setTabId] = useState("resumen");

  const tabs = [{ id: "resumen", label: "Resumen" }, ...WEEKLY.map(w => ({ id: w.semana, label: w.semana }))];
  const activeWeekIndex = WEEKLY.findIndex(w => w.semana === tabId);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      {!isEmbedded && (
        <header style={{ background: "#fff", padding: "14px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Breadcrumb
              items={[
                { label: "Proyectos", href: "/proyectos" },
                { label: FASE_LABEL[faseDe("Proyecto")] },
                { label: "Indicadores · Postulaciones" },
              ]}
            />
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={tag(ACCENT, ACCENT_BG)}>IND-001</span>
              <span style={tag("#10B981", "#ECFDF5")}>In Progress</span>
              <span style={tag("#6366F1", "#EEF2FF")}>UserPilot · may–ago 2026</span>
            </div>
          </div>
        </header>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title block */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Panel de Indicadores · Tablero de Desempeño
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Cuántos suppliers ven su tablero de desempeño y cuántos se postulan para avanzar de nivel.
            Datos reales de <strong>UserPilot</strong> — 13 semanas de seguimiento (07 mayo – 03 agosto 2026).
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
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>13 semanas de seguimiento en UserPilot (may–ago 2026). Embudo, retención y tendencia semanal.</div>
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

                {/* Card: Prospectos de Ascenso (navega a página propia) */}
                <a
                  href="/proyectos/indicadores/prospectos"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textDecoration: "none" }}
                >
                  <span style={{ fontSize: 22, marginTop: 2 }}>🎯</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Prospectos de Ascenso</span>
                      <span style={tag("#10B981", "#ECFDF5")}>Data real</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>Ranking de proveedores según cumplimiento del umbral de órdenes para ascender a Verificado o Premium. →</div>
                  </div>
                </a>

                {/* Card: Webhook n8n · doc para Enrique (link a HTML estático) */}
                <a
                  href="/docs/webhook-ascenso-enrique.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textDecoration: "none" }}
                >
                  <span style={{ fontSize: 22, marginTop: 2 }}>🔗</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Webhook n8n · doc para Enrique</span>
                      <span style={tag("#F59E0B", "#FFFBEB")}>Borrador</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>Contrato del payload pulso_suppliers (tipo ascenso) + plantillas de WhatsApp para Meta. →</div>
                  </div>
                </a>
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
                          { label: "Usuarios únicos panel", value: "136/sem", sub: "Promedio 13 semanas", color: ACCENT },
                          { label: "Click postularme",       value: "~25/sem", sub: "Promedio 12 sem",    color: "#10B981" },
                          { label: "Postulación completa",   value: "~12/sem", sub: "Modal superado",     color: "#F59E0B" },
                          { label: "Conversión global",      value: "8.2%",    sub: "Panel → postulación", color: "#6366F1" },
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
                        Dashboard UserPilot: <strong style={{ color: "var(--fg)" }}>run.userpilot.io/dashboards/52</strong> · Datos extraídos vía MCP UserPilot directamente sobre el dashboard 52 (antes: solicitar a Laura cada lunes).
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
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#6366F1", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#6366F1" }}>Mensaje de descubrimiento del panel</div>
                        </div>
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
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#10B981", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#10B981" }}>Mensaje de postulación segmentado</div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, marginLeft: 36 }}>Principios de julio · Solo a quienes cumplen requisito de órdenes movilizadas · Solicitar data a Miguel</div>
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
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#F59E0B", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B" }}>Reunión de seguimiento con quienes se postularon</div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, marginLeft: 36 }}>Insumo: data de UserPilot/CRM de proveedores que hicieron clic en "Postularme" en el Paso 2</div>
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

        {/* Tab bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "var(--card)", paddingTop: 4, paddingBottom: 4 }}>
          <div style={{
            display: "inline-flex", gap: 2, padding: 4, background: "#F3F4F6",
            borderRadius: 12, maxWidth: "100%", overflowX: "auto",
          }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTabId(t.id)}
                style={{
                  padding: "8px 16px", fontSize: 13, fontWeight: 700, border: "none", borderRadius: 9,
                  background: tabId === t.id ? "#fff" : "transparent",
                  color: tabId === t.id ? ACCENT : "var(--muted)",
                  boxShadow: tabId === t.id ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeWeekIndex >= 0 && (
          <WeekPanel week={WEEKLY[activeWeekIndex]} prev={activeWeekIndex > 0 ? WEEKLY[activeWeekIndex - 1] : null} />
        )}

        {tabId === "resumen" && (
        <>
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
            <div style={sectionTitle}>Hallazgos · Bitácora may–jul 2026</div>
            <div style={sectionSub}>13 semanas de seguimiento en UserPilot (07 may – 03 ago 2026).</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "📉", titulo: "Caída y recuperación sin explicar", desc: "Usuarios únicos en panel cayeron -30% (159 → 112) entre 07 may y 11 jun, luego se recuperaron a 154 para el 9 jul — nivel similar al inicial. No hay causa confirmada para ninguno de los dos movimientos (pregunta abierta)." },
              { icon: "🚧", titulo: "Fricción dura en el modal", desc: "52% de drop entre click en banner (~25/sem) y postulación completada (~12/sem), promedio de 12 de las 13 semanas con datos completos. Los requisitos del modal frenan la conversión antes de que el supplier pueda avanzar." },
              { icon: "📈", titulo: "Salto de retención sin causa confirmada", desc: "Retención pasó de ~11% (07 may–4 jun) a ~42–49% sostenido desde el 12 jun hasta el 9 jul, un salto de ~4x. No se identificó campaña, cambio de widget o de definición de métrica que lo explique (pregunta abierta). Sin dato para las semanas 10 jul–3 ago — no se pudo reproducir con la misma definición vía MCP." },
              { icon: "📋", titulo: "CSAT de proveedores sin activar", desc: "13 semanas de experimento sin encuesta de satisfacción del proveedor sobre su propio tablero/postulación. No tenemos señal de por qué no completan la postulación ni cómo mejorar el módulo." },
              { icon: "⭐", titulo: "CSAT dropshippers→proveedor: alto y estable", desc: "Encuesta \"CSAT Indicadores Proveedores\" (dropshippers calificando la página de detalle del proveedor), activa desde 17 jun: 1.132 respuestas, promedio 4.31/5, estable semana a semana (4.18 → 4.56) hasta el 9 jul. Mide la percepción del dropshipper sobre el proveedor — no resuelve el CSAT de proveedores pendiente. Fricción más mencionada: falta de detalle sobre tiempos de despacho (33) y opiniones de otros dropshippers (20); lo que más pesa en la decisión es la cantidad de despachos (151) y la calificación general (99). Sin dato nuevo para semanas 10 jul–3 ago — el reporte de CSAT no forma parte del dashboard 52 consultado vía MCP." },
              { icon: "🔍", titulo: "Ecom Scanner invisible",    desc: "1–6 usos por semana en toda la plataforma en las 13 semanas (máximo previo 4, superado en la semana 24–30 jul con 6). El módulo sigue sin ser descubierto o sin generar valor percibido por los suppliers, pese al leve repunte." },
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
                <div style={sectionSub}>Conversión desde primera vista del tablero hasta postulación enviada. Promedio 12 de 13 semanas con datos completos.</div>
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
              <strong>52% de drop</strong> entre click en banner y postulación completa — el modal de requisitos filtra agresivamente.
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

        {/* Evolución semanal (gráficas) */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Evolución semanal · 13 semanas</div>
            <div style={sectionSub}>Vista completa del periodo — abre la tab de una semana específica para verla resaltada en el contexto de las demás.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <TrendBarChart data={WEEKLY} dataKey="tablero" color={ACCENT} title="Vieron tablero" />
            <TrendBarChart data={WEEKLY} dataKey="retencion" color="#8B5CF6" title="Retención" unit="%" />
          </div>
        </div>

        {/* Tabla semanal */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Tendencia semanal · 13 semanas · may–ago 2026</div>
              <div style={sectionSub}>Fuente: UserPilot · Bitácora Indicadores. Semana 05–11 jun sin datos de postulación (banner/modal) — pendiente exportar. Semanas 10 jul–3 ago sin dato de retención (no reproducible vía MCP con la definición histórica) — pendiente confirmar metodología con Laura/Miguel Ángel. Semana 31 jul–3 ago es parcial (4 de 7 días). *Promedio de retención del pie de tabla calculado solo sobre las 8 semanas con dato disponible.</div>
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
                  <td style={{ ...tdStyle, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>13 semanas</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: ACCENT }}>1.769</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>302</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#10B981" }}>145</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>34</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#8B5CF6" }}>~28.2%*</td>
                  <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>8.2%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Próximos pasos */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Próximos pasos</div>
            <div style={sectionSub}>Acciones definidas a partir del análisis de 13 semanas.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { paso: "Activar CSAT de proveedores en UserPilot — 1 pregunta al ver el tablero: \"¿Qué te motivó a revisar tu tablero hoy?\" (pista sobre la causa del salto de retención)", owner: "Laura", status: "Pendiente" },
              { paso: "Enviar mensaje segmentado por CRM a proveedores que ya cumplen el requisito de órdenes movilizadas (Paso 2 del experimento) — pendiente data de Miguel y confirmar flujo con Enrique", owner: "Comercial", status: "Pendiente" },
              { paso: "Definir meta de conversión esperada para ese mensaje CRM antes de enviarlo, y medirla después con Prospectos de Ascenso", owner: "Michelle + Jaime", status: "Pendiente" },
              { paso: "Experimento de visibilidad del módulo — descubrimiento del tablero (Paso 1)", owner: "Diseño", status: "Pendiente" },
              { paso: "Aplicar el mismo experimento de descubrimiento al Ecom Scanner — mismo problema de invisibilidad (1–4 usos/semana)", owner: "Diseño", status: "Pendiente" },
              { paso: "Reducir fricción del modal — mostrar beneficios antes de requisitos", owner: "Diseño + TI", status: "Pendiente" },
              { paso: "Confirmar causa del salto de retención (11% → 45% desde 12 jun) y de la recuperación de usuarios únicos (112 → 154) — sin explicación confirmada aún", owner: "Jaime", status: "En curso" },
              { paso: "Obtener datos de semana 05–11 jun para postulación banner y modal", owner: "Laura", status: "Pendiente" },
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
              { q: "¿Por qué la retención se multiplicó por ~4 desde el 12 jun (11% → ~45%)? ¿Cambió la definición de la métrica, el widget, o hubo una campaña de reactivación?", owner: "Jaime + TI", urgencia: "Alta" },
              { q: "¿Por qué 'vieron tablero' se recuperó de 112 (05–11 jun) a 154 (2–9 jul) tras la caída inicial?", owner: "Jaime + TI", urgencia: "Media" },
              { q: "¿Por qué el modal filtra al 55% de los interesados? ¿Requisitos muy altos o UX del modal confusa?", owner: "Diseño", urgencia: "Alta" },
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
        </>
        )}

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
              { icon: "📋", titulo: "CSAT · satisfacción",       desc: "CSAT de proveedores (sobre su propio tablero/postulación) pendiente activar — solicitar a Laura. CSAT dropshippers→proveedor ya activo desde 17 jun (ver Hallazgos)." },
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
