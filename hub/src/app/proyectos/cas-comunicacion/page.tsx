"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: 20,
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

const gridStroke = "#E5E7EB";
const axisTick = { fontSize: 11, fill: "#6B7280" };
const tooltipStyle: React.CSSProperties = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const labelStyle = { fontSize: 10, fill: "#6B7280", fontWeight: 700 };

const DROPI = "#F77F00";

const FUNNEL_DATA = [
  { step: "Detalle producto", usuarios: 27338, eventos: 637957, recurrencia: 23.34, dropOff: "100%", tendencia: "-0.14%" },
  { step: "Contactar", usuarios: 3972, eventos: 7368, recurrencia: 1.85, dropOff: "-85.5%", tendencia: "-2.53%" },
  { step: "Iniciar conversación", usuarios: 4560, eventos: 22421, recurrencia: 4.92, dropOff: "+14.8%", tendencia: "+3.33%", anomaly: true },
  { step: "Abrir ticket", usuarios: 2593, eventos: 20264, recurrencia: 7.81, dropOff: "-43.1%", tendencia: "-4.02%" },
  { step: "Resuelto", usuarios: 1455, eventos: 3583, recurrencia: 2.46, dropOff: "-43.9%", tendencia: "-4.45%" },
];

const RECURRENCE_DATA = [
  { step: "Detalle producto", value: 23.34 },
  { step: "Contactar", value: 1.85 },
  { step: "Iniciar conv.", value: 4.92 },
  { step: "Abrir ticket", value: 7.81 },
  { step: "Resuelto", value: 2.46 },
];

const PIE_DATA = [
  { name: "Resueltos", value: 3583, color: "var(--success)" },
  { name: "En limbo", value: 16681, color: "var(--danger)" },
];

const PIE_COLORS = ["#10B981", "#EF4444"];

const NORTH_STAR = [
  { metric: "Tasa resolución tickets", actual: "17.7%", target: ">50%", gap: "-32.3pp", status: "danger" as const },
  { metric: "Tasa resolución usuarios", actual: "56.1%", target: ">70%", gap: "-13.9pp", status: "warning" as const },
  { metric: "Eventos motivos de consulta", actual: "0", target: ">0", gap: "Sin datos", status: "danger" as const },
  { metric: "Filtros funcionales (de 10)", actual: "6/10", target: "10/10", gap: "-4 filtros muertos", status: "danger" as const },
];

const EVENTS_CORE = [
  { name: "Detalle producto", usuarios: 27338, eventos: 637957, trend: "-0.14%", status: "normal" as const },
  { name: "Contactar", usuarios: 3972, eventos: 7368, trend: "-2.53%", status: "normal" as const },
  { name: "Iniciar conversación", usuarios: 4560, eventos: 22421, trend: "+3.33%", status: "warning" as const },
  { name: "Abrir ticket", usuarios: 2593, eventos: 20264, trend: "-4.02%", status: "normal" as const },
  { name: "Resuelto", usuarios: 1455, eventos: 3583, trend: "-4.45%", status: "normal" as const },
];

const EVENTS_RESOLUCION = [
  { name: "Motivos de consulta", usuarios: 0, eventos: 0, trend: "0 EVENTOS", status: "danger" as const },
  { name: "Transportadora", usuarios: 368, eventos: 773, trend: "-0.26%", status: "normal" as const },
];

const FILTERS = [
  { name: "Antiguos", usuarios: 40, eventos: 137, trend: "+65%", status: "success" as const },
  { name: "Recientes", usuarios: 13, eventos: 18, trend: "+28.57%", status: "success" as const },
  { name: "Enviadas", usuarios: 8, eventos: 8, trend: "+14.29%", status: "normal" as const },
  { name: "Cerradas", usuarios: 6, eventos: 37, trend: "-43.08%", status: "warning" as const },
  { name: "Ordenar por", usuarios: 6, eventos: 6, trend: "+50%", status: "normal" as const },
  { name: "Activas", usuarios: 1, eventos: 1, trend: "", status: "normal" as const },
  { name: "Todas", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "No leídas", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "All chats", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "Buscador", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
];

const FILTERS_CHART = FILTERS.map(f => ({
  name: f.name,
  usuarios: f.usuarios,
  fill: f.status === "danger" ? "#EF4444" : f.status === "success" ? "#10B981" : f.status === "warning" ? "#F59E0B" : "#6B7280",
}));

const INSIGHTS: { id: number; title: string; code: string; body: string; severity: "danger" | "success" | "warning" | "info" }[] = [
  { id: 1, code: "A5", title: 'Agujero Negro de Tracking', body: '"Motivos de consulta" con 0 eventos en 14 días. Este evento debería segmentar por qué contacta cada dropshipper al proveedor (calidad, envío, stock, precio, etc.). Sin este dato, no se puede priorizar mejoras de producto ni medir North Star de satisfacción. Invalida toda segmentación de la conversación CAS.', severity: "danger" },
  { id: 2, code: "A6", title: 'Agujero Negro de Cierre', body: 'De 20,264 eventos "Abrir ticket", solo 3,583 llegan a "Resuelto" (17.7%). 16,681 tickets quedan en limbo — sin cierre explícito. Esto puede ser cierre implícito (el usuario deja de escribir y no marca resuelto), ausencia de CTA de cierre, o flujo que no incentiva cerrar. El 82.3% de interacciones CAS no tiene cierre medible.', severity: "danger" },
  { id: 3, code: "A5", title: 'Agujero Negro de Tracking', body: '5 filtros de la bandeja CAS con 0 eventos: "Todas", "No leídas", "All chats", "Buscador" y — críticamente — "Motivos de consulta". Si estos selectores existen en la UI pero nadie los usa, o el tracking no está activo, son features muertas que ocupan espacio cognitivo. Prioridad: auditar si el tracking existe vs. si el feature está roto.', severity: "danger" },
  { id: 4, code: "R2", title: 'Necesidad recurrente', body: '"Abrir ticket" tiene recurrencia de 7.81 eventos/usuario (681.5% sobre la base). Cada usuario que abre un ticket lo hace casi 8 veces en 14 días. Esto puede indicar: tickets que no se resuelven en la primera interacción, necesidad de follow-up frecuente, o fricción que obliga a reabrir. Independientemente de la causa, es evidencia de necesidad recurrente — no de mal uso.', severity: "success" },
  { id: 5, code: "E1", title: 'Engagement PDP', body: 'Tiempo promedio en PDP: 33 segundos/vista (+175% vs periodo anterior). Con 23.34 vistas/usuario, cada dropshipper pasa ~12.8 minutos explorando producto antes de contactar. Esto sugiere evaluación profunda del catálogo — oportunidad para surfacing contextual de CTA "Contactar" basado en tiempo en página.', severity: "success" },
  { id: 6, code: "T1", title: '"Iniciar conversación" crece', body: 'Único evento del funnel con tendencia positiva: +3.33% mientras el resto cae. Esto puede indicar que más usuarios están llegando al chat por vías alternas (no por el botón "Contactar"), o que los que llegan interactúan más. La inversion del funnel (4,560 > 3,972) refuerza esta hipótesis.', severity: "success" },
  { id: 7, code: "A3", title: 'Más tráfico, mismo resultado', body: '637,957 eventos de vista de producto para 27,338 usuarios únicos (23.34 vistas/usuario). Solo 3,972 hacen click en "Contactar" (14.5%). Hay mucha exploración pero poca conversión a contacto. El usuario evalúa extensivamente pero no se convierte — posible fricción en el CTA o irrelevancia del proveedor para su necesidad.', severity: "warning" },
  { id: 8, code: "F1", title: 'Funnel invertido', body: '"Iniciar conversación" (4,560 usuarios) supera "Contactar" (3,972 usuarios). Esto rompe la lógica secuencial del funnel. Posibles causas: (a) hay un acceso directo al chat que bypasea el botón "Contactar", (b) el tracking del botón "Contactar" no captura todas las rutas, (c) el evento "Iniciar conversación" se dispara en contextos más amplios que el flujo PDP→Contactar.', severity: "warning" },
  { id: 9, code: "R4", title: 'Selección Natural', body: 'De 54,575 usuarios base, solo 2,593 (4.75%) abren un ticket CAS. La comunicación DS↔Prov es un feature de nicho dentro de la plataforma. Sin embargo, quienes lo usan muestran alta recurrencia (7.81 tickets/usuario). La pregunta no es "por qué tan pocos lo usan" sino "qué necesitan los que lo usan tanto".', severity: "info" },
];

const TIMELINE = [
  { date: "Abril 2026", text: "DROP-23082 creada. Scope inicial: métricas CAS comunicación dropshipper↔proveedor." },
  { date: "Jun 2026", text: "Instrumentación UserPilot de 17 eventos. Primera recolección de datos activa." },
  { date: "Jul 6–20", text: "Periodo de evaluación S11-12. 14 días de datos limpios para análisis." },
  { date: "Jul 23, 2026", text: "Bitácora v1 publicada. 5 eventos con 0 datos identificados como blocker." },
];

const TRENDS = [
  { label: "Vistas producto", value: "637,957", trend: "-0.14%", down: true },
  { label: "Eventos Contactar", value: "7,368", trend: "-2.53%", down: true },
  { label: "Eventos Iniciar conv.", value: "22,421", trend: "+3.33%", down: false },
  { label: "Eventos Abrir ticket", value: "20,264", trend: "-4.02%", down: true },
  { label: "Eventos Resuelto", value: "3,583", trend: "-4.45%", down: true },
  { label: "Transportadora", value: "773", trend: "-0.26%", down: true },
  { label: "Tiempo PDP", value: "33s/vista", trend: "+175%", down: false },
  { label: "Avg tickets/usuario", value: "8", trend: "0%", down: false },
];

const FUNNEL_CHART = [
  { step: "Detalle producto", usuarios: 27338, eventos: 637957 },
  { step: "Contactar", usuarios: 3972, eventos: 7368 },
  { step: "Iniciar conv.", usuarios: 4560, eventos: 22421 },
  { step: "Abrir ticket", usuarios: 2593, eventos: 20264 },
  { step: "Resuelto", usuarios: 1455, eventos: 3583 },
];

function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}

export default function CASComunicacionPage() {
  const isEmbedded = useIsEmbedded();
  const [tabId, setTabId] = useState("resumen");

  const tabs = [
    { id: "resumen", label: "Resumen" },
    { id: "s11-12", label: "S11-12 · Jul 6-20" },
    { id: "hallazgos", label: "Hallazgos" },
    { id: "proximos", label: "Próximos Pasos" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
        }}>
          <a href="/celula/backoffice" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            ← Backoffice
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>CAS Comunicación DS↔Prov — Bitácora UX</span>
        </header>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8, letterSpacing: "-0.02em" }}>
            CAS Comunicación Dropshipper↔Proveedor
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginBottom: 12 }}>
            Bitácora UX de métricas del sistema de comunicación y atención CAS entre dropshippers y proveedores.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={tag("var(--fg)", "#F3F4F6")}>Usuarios base: 54,575</span>
            <span style={tag("var(--dropi)", "var(--dropi-light)")}>Eventos trackeados: 17</span>
            <span style={tag("var(--danger)", "var(--danger-tint)")}>Eventos en 0: 5</span>
            <span style={tag("var(--success)", "var(--success-tint)")}>Tasa resolución (usuarios): 56.1%</span>
            <span style={tag("var(--info)", "var(--info-tint)")}>Jul 6 al Jul 20, 2026</span>
            <span style={tag("var(--muted)", "#F3F4F6")}>Actualizado: Jul 23, 2026</span>
            <span style={tag("var(--info)", "var(--info-tint)")}>Jira: DROP-23082 / PRM-68</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTabId(t.id)}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: tabId === t.id ? 700 : 500,
                color: tabId === t.id ? "var(--dropi)" : "var(--muted)",
                background: "transparent", border: "none", cursor: "pointer",
                borderBottom: tabId === t.id ? "2px solid var(--dropi)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tabId === "resumen" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ ...card, borderLeft: "4px solid var(--danger)", background: "var(--danger-tint)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 4 }}>
                Alerta crítica
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                5 eventos con 0 datos en 14 días: <strong>&quot;Motivos de consulta&quot;</strong>, <strong>&quot;Filtro todas&quot;</strong>, <strong>&quot;Filtro no leídas&quot;</strong>, <strong>&quot;Filtro all chats&quot;</strong> y <strong>&quot;Filtro buscador&quot;</strong>. Sin estos eventos no hay visibilidad sobre la segmentación de consultas ni la salud de filtros clave de la bandeja CAS.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {[
                { label: "Vieron PDP", value: "27,338", sub: "50.1% de base", color: "var(--info)", bg: "var(--info-tint)" },
                { label: 'Click "Contactar"', value: "3,972", sub: "14.5% del PDP", color: "var(--dropi)", bg: "var(--dropi-light)" },
                { label: "Abrieron ticket", value: "2,593", sub: "4.75% de base", color: "var(--warning)", bg: "var(--warning-tint)" },
                { label: "Resolvieron caso", value: "1,455", sub: "56.1%", color: "var(--success)", bg: "var(--success-tint)" },
              ].map(k => (
                <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color === "var(--dropi)" ? DROPI : ""}`, borderTopColor: k.color }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={sectionTitle}>Funnel de conversión (14 días)</div>
              <div style={{ ...sectionSub, marginBottom: 16 }}>Caída progresiva de usuarios únicos por paso del flujo CAS.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {FUNNEL_DATA.map((f, i) => {
                  const maxW = 100;
                  const barW = (f.usuarios / 27338) * maxW;
                  return (
                    <div key={f.step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < FUNNEL_DATA.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ width: 160, fontSize: 13, fontWeight: 600, color: f.anomaly ? "var(--warning)" : "var(--fg)", flexShrink: 0 }}>
                        {f.step} {f.anomaly && "⚠️"}
                      </div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 20, width: `${barW}%`, minWidth: 4, background: f.anomaly ? "var(--warning)" : "var(--dropi)", borderRadius: 4, transition: "width 0.3s" }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{fmt(f.usuarios)}</span>
                      </div>
                      <div style={{ width: 70, fontSize: 12, color: f.dropOff.startsWith("-") ? "var(--danger)" : f.dropOff.startsWith("+") ? "var(--warning)" : "var(--muted)", textAlign: "right", fontWeight: 600 }}>
                        {f.dropOff}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "var(--warning-tint)", border: "1px solid var(--warning)", fontSize: 12, color: "var(--fg)", lineHeight: 1.4 }}>
                <strong>Anomalía:</strong> &quot;Iniciar conversación&quot; (4,560) supera &quot;Contactar&quot; (3,972). Hay usuarios entrando al chat sin pasar por el botón Contactar del PDP.
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Tendencias generales</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Variación vs. periodo anterior (S9-10).</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                {TRENDS.map(t => (
                  <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "#FAFBFC", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{t.value}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: t.down ? "var(--danger)" : t.trend === "0%" ? "var(--muted)" : "var(--success)" }}>{t.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Timeline del proyecto</div>
              <div style={{ ...sectionSub, marginBottom: 16 }}>Hitos principales desde la creación de la HU hasta hoy.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", paddingLeft: 20 }}>
                <div style={{ position: "absolute", left: 7, top: 4, bottom: 4, width: 2, background: "var(--border)" }} />
                {TIMELINE.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 16, position: "relative" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 999, background: i === TIMELINE.length - 1 ? DROPI : "var(--border)", border: "2px solid #fff", flexShrink: 0, position: "absolute", left: -18, top: 2 }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", marginBottom: 2 }}>{t.date}</div>
                      <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.4 }}>{t.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Funnel — Usuarios únicos vs Eventos totales</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Escala logarítmica para comparar magnitudes dispares.</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={FUNNEL_CHART} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
                    <CartesianGrid horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" scale="log" domain={[1, "auto"]} tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                    <YAxis type="category" dataKey="step" width={120} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={((v: string | number) => typeof v === "number" ? fmt(v) : v) as never} />
                    <Bar dataKey="usuarios" name="Usuarios únicos" fill={DROPI} radius={[0, 4, 4, 0]} maxBarSize={18} />
                    <Bar dataKey="eventos" name="Eventos totales" fill="#D1D5DB" radius={[0, 4, 4, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {tabId === "s11-12" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={card}>
              <div style={sectionTitle}>Funnel de adopción (S11-12 · Jul 6–20)</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>14 días, 54,575 usuarios base.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Paso</th>
                      <th style={thR}>Usuarios</th>
                      <th style={thR}>Eventos</th>
                      <th style={thR}>Recurrencia</th>
                      <th style={thR}>Drop-off</th>
                      <th style={thR}>Tendencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FUNNEL_DATA.map(f => (
                      <tr key={f.step} style={{ background: f.anomaly ? "var(--warning-tint)" : "transparent" }}>
                        <td style={{ ...tdStyle, fontWeight: 600, color: f.anomaly ? "var(--warning)" : "var(--fg)" }}>
                          {f.step} {f.anomaly && "⚠️"}
                        </td>
                        <td style={tdR}>{fmt(f.usuarios)}</td>
                        <td style={tdR}>{fmt(f.eventos)}</td>
                        <td style={tdR}>{f.recurrencia.toFixed(2)}</td>
                        <td style={{ ...tdR, color: f.dropOff.startsWith("-") ? "var(--danger)" : f.dropOff.startsWith("+") ? "var(--warning)" : "var(--muted)", fontWeight: 600 }}>{f.dropOff}</td>
                        <td style={{ ...tdR, color: f.tendencia.startsWith("+") ? "var(--success)" : f.tendencia.startsWith("-") ? "var(--danger)" : "var(--muted)", fontWeight: 600 }}>{f.tendencia}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Recurrencia por paso (avg eventos/usuario)</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Cuántas veces en promedio un usuario ejecuta cada paso en 14 días.</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={RECURRENCE_DATA} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={gridStroke} />
                    <XAxis dataKey="step" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} interval={0} />
                    <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
                    <Bar dataKey="value" name="Avg eventos/usuario" fill={DROPI} radius={[4, 4, 0, 0]} maxBarSize={48}>
                      <LabelList dataKey="value" position="top" style={labelStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {[
                { label: "Tickets resueltos", value: "17.7%", sub: "3,583 de 20,264 eventos", color: "var(--danger)", bg: "var(--danger-tint)" },
                { label: "Usuarios con resolución", value: "56.1%", sub: "1,455 de 2,593 usuarios", color: "var(--success)", bg: "var(--success-tint)" },
                { label: "Tickets en limbo", value: "16,681", sub: "82.3% sin cierre explícito", color: "var(--warning)", bg: "var(--warning-tint)" },
                { label: "Avg resueltos/usuario", value: "2.5", sub: "3,583 / 1,455 usuarios", color: "var(--info)", bg: "var(--info-tint)" },
              ].map(k => (
                <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}` }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={sectionTitle}>Resolución de tickets</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Proporción de tickets resueltos vs en limbo (sin cierre explícito).</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
                <div style={{ width: 220, height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                        {PIE_DATA.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={((v: string | number) => typeof v === "number" ? fmt(v) : v) as never} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "#10B981" }} />
                    <span style={{ fontSize: 13, color: "var(--fg)" }}>Resueltos: <strong>3,583</strong> (17.7%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "#EF4444" }} />
                    <span style={{ fontSize: 13, color: "var(--fg)" }}>En limbo: <strong>16,681</strong> (82.3%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Comparación vs North Star</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Brechas entre el estado actual y los objetivos de producto.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Métrica</th>
                      <th style={thR}>Actual</th>
                      <th style={thR}>Target</th>
                      <th style={thR}>Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NORTH_STAR.map(n => (
                      <tr key={n.metric}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{n.metric}</td>
                        <td style={{ ...tdR, fontWeight: 700, color: n.status === "danger" ? "var(--danger)" : n.status === "warning" ? "var(--warning)" : "var(--fg)" }}>{n.actual}</td>
                        <td style={tdR}>{n.target}</td>
                        <td style={{ ...tdR, fontWeight: 700, color: n.status === "danger" ? "var(--danger)" : n.status === "warning" ? "var(--warning)" : "var(--muted)" }}>{n.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Detalle de eventos — Funnel core</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>5 eventos principales del flujo de comunicación.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {EVENTS_CORE.map(e => (
                  <div key={e.name} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${e.status === "warning" ? "var(--warning)" : "var(--border)"}`, background: e.status === "warning" ? "var(--warning-tint)" : "#FAFBFC" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>{e.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
                      <span>Usuarios: <strong style={{ color: "var(--fg)" }}>{fmt(e.usuarios)}</strong></span>
                      <span>Eventos: <strong style={{ color: "var(--fg)" }}>{fmt(e.eventos)}</strong></span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: e.trend.startsWith("+") ? "var(--success)" : e.trend.startsWith("-") ? "var(--danger)" : "var(--muted)" }}>{e.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Detalle de eventos — Resolución y clasificación</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>2 eventos de soporte y categorización.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {EVENTS_RESOLUCION.map(e => (
                  <div key={e.name} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${e.status === "danger" ? "var(--danger)" : "var(--border)"}`, background: e.status === "danger" ? "var(--danger-tint)" : "#FAFBFC" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: e.status === "danger" ? "var(--danger)" : "var(--fg)", marginBottom: 6 }}>{e.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
                      <span>Usuarios: <strong style={{ color: e.status === "danger" ? "var(--danger)" : "var(--fg)" }}>{fmt(e.usuarios)}</strong></span>
                      <span>Eventos: <strong style={{ color: e.status === "danger" ? "var(--danger)" : "var(--fg)" }}>{fmt(e.eventos)}</strong></span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: e.status === "danger" ? "var(--danger)" : e.trend.startsWith("-") ? "var(--danger)" : "var(--muted)" }}>{e.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Detalle de eventos — Filtros de bandeja CAS</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>10 filtros de la bandeja de comunicación. 4 con 0 eventos.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                {FILTERS.map(f => (
                  <div key={f.name} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${f.status === "danger" ? "var(--danger)" : f.status === "success" ? "var(--success)" : "var(--border)"}`, background: f.status === "danger" ? "var(--danger-tint)" : f.status === "success" ? "var(--success-tint)" : "#FAFBFC" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: f.status === "danger" ? "var(--danger)" : "var(--fg)", marginBottom: 4 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>U: {fmt(f.usuarios)} / E: {fmt(f.eventos)}</div>
                    {f.trend && <div style={{ fontSize: 10, fontWeight: 600, color: f.status === "danger" ? "var(--danger)" : f.status === "success" ? "var(--success)" : f.trend.startsWith("-") ? "var(--danger)" : "var(--muted)", marginTop: 2 }}>{f.trend}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Mapa de salud de filtros</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Usuarios únicos por filtro de bandeja CAS (10 filtros).</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={FILTERS_CHART} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
                    <CartesianGrid horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
                    <YAxis type="category" dataKey="name" width={90} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
                    <Bar dataKey="usuarios" name="Usuarios únicos" radius={[0, 4, 4, 0]} maxBarSize={20}>
                      {FILTERS_CHART.map((f, i) => (
                        <Cell key={i} fill={f.fill} />
                      ))}
                      <LabelList dataKey="usuarios" position="right" style={labelStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ ...card, borderLeft: "4px solid var(--info)", background: "var(--info-tint)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--info)", marginBottom: 4 }}>Filtro &quot;antiguos&quot; dominante</div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                El filtro &quot;Antiguos&quot; lidera con 40 usuarios únicos y 137 eventos (+65% vs periodo anterior). Esto indica que los usuarios priorizan revisar conversaciones antiguas por encima de cualquier otro filtro. Posible necesidad de buscar historial o dar seguimiento a casos previos.
              </div>
            </div>

            <div style={{ ...card, borderLeft: "4px solid var(--warning)", background: "var(--warning-tint)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>Filtro &quot;cerradas&quot; con usuarios compulsivos</div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                El filtro &quot;Cerradas&quot; tiene solo 6 usuarios pero 37 eventos (6.17 eventos/usuario), la mayor recurrencia entre filtros. Son pocos usuarios revisando conversaciones cerradas muchas veces. Posible causa: buscar información de casos pasados resueltos, o verificar que un caso se cerró correctamente. Tendencia: -43.08%.
              </div>
            </div>

          </div>
        )}

        {tabId === "hallazgos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ marginBottom: 4 }}>
              <div style={sectionTitle}>9 hallazgos de la evaluación S11-12</div>
              <div style={sectionSub}>Organizados por severidad: críticos, positivos y patrones.</div>
            </div>

            {INSIGHTS.map(ins => {
              const borderColor = ins.severity === "danger" ? "var(--danger)" : ins.severity === "success" ? "var(--success)" : ins.severity === "warning" ? "var(--warning)" : "var(--info)";
              const bgColor = ins.severity === "danger" ? "var(--danger-tint)" : ins.severity === "success" ? "var(--success-tint)" : ins.severity === "warning" ? "var(--warning-tint)" : "var(--info-tint)";
              const labelColor = ins.severity === "danger" ? "var(--danger)" : ins.severity === "success" ? "var(--success)" : ins.severity === "warning" ? "var(--warning)" : "var(--info)";
              const severityLabel = ins.severity === "danger" ? "Crítico" : ins.severity === "success" ? "Positivo" : ins.severity === "warning" ? "Patrón" : "Patrón";
              return (
                <div key={ins.id} style={{ ...card, borderLeft: `4px solid ${borderColor}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={tag(labelColor, bgColor)}>{severityLabel}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{ins.code}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>#{ins.id} {ins.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}>{ins.body}</div>
                </div>
              );
            })}

            <div style={{ ...card, borderLeft: `4px solid ${DROPI}`, background: "var(--dropi-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={tag("var(--dropi)", "var(--dropi-light)")}>Foco</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>&quot;Motivos de consulta&quot;</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}>
                Si este evento pasa de 0 a &gt;0, desbloquea toda la segmentación North Star: saber por qué contacta cada dropshipper (calidad, envío, stock, precio) permitiría priorizar mejoras de producto, medir satisfacción por categoría y reducir tickets repetitivos. Es el evento más bloqueante del sistema CAS.
              </div>
            </div>
          </div>
        )}

        {tabId === "proximos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{"🔴"}</span>
                <div style={sectionTitle}>URGENTE</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: 'Auditar "Motivos de consulta"', body: 'Verificar con TI si el evento existe en UserPilot, si está instrumentado correctamente, si el selector CSS/XPath apunta al elemento correcto. Si el tracking existe pero el feature no se usa, investigar por qué. Si el feature no existe, escalar como gap de producto. Bloquea toda segmentación North Star.' },
                  { title: 'Auditar 5 selectores con 0 eventos', body: 'Los filtros "Todas", "No leídas", "All chats", "Buscador" y "Motivos de consulta" reportan 0 eventos en 14 días. Para cada uno: verificar si el tracking está activo, si el selector CSS/XPath es correcto, y si el feature es visible para los usuarios. Resultado esperado: mapa de tracking vs. feature para cada filtro.' },
                  { title: 'Diagnosticar caída de resolución', body: 'Con 82.3% de tickets en limbo (16,681 de 20,264), investigar: ¿hay un botón de "Resuelto" visible? ¿El usuario sabe que debe cerrar el caso? ¿Hay cierre automático por inactividad? ¿El proveedor cierra o solo el dropshipper puede hacerlo? Resultado esperado: diagnóstico del flujo de cierre actual.' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid var(--danger)", background: "var(--danger-tint)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--danger)", marginBottom: 4 }}>{i + 1}. {item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{"🟡"}</span>
                <div style={sectionTitle}>CORTO PLAZO</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: 'Investigar funnel invertido', body: '"Iniciar conversación" (4,560 usuarios) supera "Contactar" (3,972). Identificar todas las rutas de acceso al chat: ¿hay un deeplink directo? ¿Se puede iniciar conversación desde la bandeja sin pasar por PDP? ¿El evento "Contactar" solo se dispara desde el botón del PDP? Resultado esperado: mapa de rutas de acceso al chat con volumetría estimada por ruta.' },
                  { title: 'Rediseñar bandeja CAS', body: 'Con 4 filtros muertos y "Antiguos" dominando (40 usuarios, 137 eventos), la arquitectura de información actual no refleja el comportamiento real. Propuesta: reordenar filtros por frecuencia de uso, eliminar o consolidar filtros muertos, agregar filtro de estado de resolución (resuelto/en limbo/pendiente).' },
                  { title: 'Entrevistar usuarios "Filtro antiguos"', body: '40 usuarios únicos usan "Filtro antiguos" con alta recurrencia (3.4 eventos/usuario). ¿Qué buscan? ¿Historial de conversaciones pasadas? ¿Seguimiento a casos sin resolver? ¿Información de producto que se discutió antes? Investigación cualitativa para entender la necesidad subyacente.' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid var(--warning)", background: "var(--warning-tint)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>{i + 1}. {item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{"🔵"}</span>
                <div style={sectionTitle}>MEDIANO PLAZO</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: 'Cierre automático de tickets inactivos', body: 'Con 16,681 tickets en limbo, implementar cierre automático por inactividad (ej. 7 días sin respuesta). Antes de cerrar, enviar notificación al dropshipper: "¿Tu caso fue resuelto?". Si no responde en 48h, cerrar como "resuelto por inactividad". Esto limpiaría el limbo y mejoraría la tasa de resolución medida. Prerequisito: entender por qué no se cierran hoy (diagnóstico urgente).' },
                  { title: 'Surfacing contextual CTA', body: 'Con +175% de tiempo en PDP (33s/vista) y 23.34 vistas/usuario, hay oportunidad de mostrar un CTA contextual de "Contactar al proveedor" basado en comportamiento: después de X segundos en página, después de scroll a cierta sección, o después de visitar el mismo producto N veces. Objetivo: convertir exploración en contacto, aumentando la tasa de conversión PDP→Contactar (actualmente 14.5%).' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid var(--info)", background: "var(--info-tint)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--info)", marginBottom: 4 }}>{i + 1}. {item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <footer style={{ marginTop: 32, padding: "16px 0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            Backoffice &middot; CAS Comunicaci&oacute;n Dropshipper&harr;Proveedor &middot; Bit&aacute;cora UX &middot; Jul 23, 2026 &middot; Autor: Michel Pino (UX) &middot; Datos: UserPilot
          </div>
        </footer>

      </div>
    </main>
  );
}
