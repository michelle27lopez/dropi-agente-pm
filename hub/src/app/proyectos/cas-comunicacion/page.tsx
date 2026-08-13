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

/* ======================= S11-12 DATA ======================= */
const FUNNEL_S11_12 = [
  { step: "Detalle producto", usuarios: 27338, eventos: 637957, recurrencia: 23.34, dropOff: "100%", tendencia: "-0.14%" },
  { step: "Contactar", usuarios: 3972, eventos: 7368, recurrencia: 1.85, dropOff: "-85.5%", tendencia: "-2.53%" },
  { step: "Iniciar conversacion", usuarios: 4560, eventos: 22421, recurrencia: 4.92, dropOff: "+14.8%", tendencia: "+3.33%", anomaly: true },
  { step: "Abrir ticket", usuarios: 2593, eventos: 20264, recurrencia: 7.81, dropOff: "-43.1%", tendencia: "-4.02%" },
  { step: "Resuelto", usuarios: 1455, eventos: 3583, recurrencia: 2.46, dropOff: "-43.9%", tendencia: "-4.45%" },
];

const RECURRENCE_S11_12 = [
  { step: "Detalle producto", value: 23.34 },
  { step: "Contactar", value: 1.85 },
  { step: "Iniciar conv.", value: 4.92 },
  { step: "Abrir ticket", value: 7.81 },
  { step: "Resuelto", value: 2.46 },
];

const PIE_S11_12 = [
  { name: "Resueltos", value: 3583, color: "var(--success)" },
  { name: "En limbo", value: 16681, color: "var(--danger)" },
];

/* ======================= S13-14 DATA ======================= */
const FUNNEL_S13_14 = [
  { step: "Detalle producto", usuarios: 28672, eventos: 688878, recurrencia: 24.03, dropOff: "100%", tendencia: "+8.0%" },
  { step: "Contactar", usuarios: 4171, eventos: 8026, recurrencia: 1.92, dropOff: "-85.5%", tendencia: "+8.9%" },
  { step: "Iniciar conversacion", usuarios: 4939, eventos: 26506, recurrencia: 5.37, dropOff: "+18.4%", tendencia: "+18.2%", anomaly: true },
  { step: "Abrir ticket", usuarios: 2887, eventos: 27155, recurrencia: 9.41, dropOff: "-41.5%", tendencia: "+34.0%" },
  { step: "Resuelto", usuarios: 1697, eventos: 4697, recurrencia: 2.77, dropOff: "-41.2%", tendencia: "+31.1%" },
];

const RECURRENCE_S13_14 = [
  { step: "Detalle producto", value: 24.03 },
  { step: "Contactar", value: 1.92 },
  { step: "Iniciar conv.", value: 5.37 },
  { step: "Abrir ticket", value: 9.41 },
  { step: "Resuelto", value: 2.77 },
];

const PIE_S13_14 = [
  { name: "Resueltos", value: 4697, color: "var(--success)" },
  { name: "En limbo", value: 22458, color: "var(--danger)" },
];

const PIE_COLORS = ["#10B981", "#EF4444"];

/* ======================= COMPARATIVO DATA ======================= */
const COMPARATIVO_FUNNEL = [
  { step: "Detalle producto", usersS11: 27338, usersS13: 28672, deltaUsers: "+4.9%", eventsS11: 637957, eventsS13: 688878, deltaEvents: "+8.0%" },
  { step: "Contactar", usersS11: 3972, usersS13: 4171, deltaUsers: "+5.0%", eventsS11: 7368, eventsS13: 8026, deltaEvents: "+8.9%" },
  { step: "Iniciar conversacion", usersS11: 4560, usersS13: 4939, deltaUsers: "+8.3%", eventsS11: 22421, eventsS13: 26506, deltaEvents: "+18.2%" },
  { step: "Abrir ticket", usersS11: 2593, usersS13: 2887, deltaUsers: "+11.3%", eventsS11: 20264, eventsS13: 27155, deltaEvents: "+34.0%" },
  { step: "Resuelto", usersS11: 1455, usersS13: 1697, deltaUsers: "+16.6%", eventsS11: 3583, eventsS13: 4697, deltaEvents: "+31.1%" },
];

const COMPARATIVO_RESOLUCION = [
  { metric: "Tasa resolucion (tickets)", s11: "17.7%", s13: "17.3%", delta: "-0.4pp", status: "warning" as const },
  { metric: "Tasa resolucion (usuarios)", s11: "56.1%", s13: "58.8%", delta: "+2.7pp", status: "success" as const },
  { metric: "Tickets en limbo", s11: "16,681", s13: "22,458", delta: "+34.6%", status: "danger" as const },
  { metric: "Eventos muertos", s11: "5", s13: "6", delta: "+1", status: "danger" as const },
  { metric: "Inversion funnel (gap)", s11: "588", s13: "768", delta: "+30.6%", status: "warning" as const },
];

/* ======================= NORTH STAR ======================= */
const NORTH_STAR_S11_12 = [
  { metric: "Tasa resolucion tickets", actual: "17.7%", target: ">50%", gap: "-32.3pp", status: "danger" as const },
  { metric: "Tasa resolucion usuarios", actual: "56.1%", target: ">70%", gap: "-13.9pp", status: "warning" as const },
  { metric: "Eventos motivos de consulta", actual: "0", target: ">0", gap: "Sin datos", status: "danger" as const },
  { metric: "Filtros funcionales (de 10)", actual: "6/10", target: "10/10", gap: "-4 filtros muertos", status: "danger" as const },
];

const NORTH_STAR_S13_14 = [
  { metric: "Tasa resolucion tickets", actual: "17.3%", target: ">50%", gap: "-32.7pp", status: "danger" as const },
  { metric: "Tasa resolucion usuarios", actual: "58.8%", target: "60%", gap: "-1.2pp", status: "warning" as const },
  { metric: "Eventos motivos de consulta", actual: "0", target: ">0", gap: "Sin datos (28 dias)", status: "danger" as const },
  { metric: "Filtros funcionales (de 10)", actual: "5/10", target: "10/10", gap: "-5 filtros muertos", status: "danger" as const },
];

/* ======================= EVENTS DETAIL ======================= */
const EVENTS_CORE_S11_12 = [
  { name: "Detalle producto", usuarios: 27338, eventos: 637957, trend: "-0.14%", status: "normal" as const },
  { name: "Contactar", usuarios: 3972, eventos: 7368, trend: "-2.53%", status: "normal" as const },
  { name: "Iniciar conversacion", usuarios: 4560, eventos: 22421, trend: "+3.33%", status: "warning" as const },
  { name: "Abrir ticket", usuarios: 2593, eventos: 20264, trend: "-4.02%", status: "normal" as const },
  { name: "Resuelto", usuarios: 1455, eventos: 3583, trend: "-4.45%", status: "normal" as const },
];

const EVENTS_CORE_S13_14 = [
  { name: "Detalle producto", usuarios: 28672, eventos: 688878, trend: "+4.9%", status: "success" as const },
  { name: "Contactar", usuarios: 4171, eventos: 8026, trend: "+5.0%", status: "success" as const },
  { name: "Iniciar conversacion", usuarios: 4939, eventos: 26506, trend: "+8.3%", status: "success" as const },
  { name: "Abrir ticket", usuarios: 2887, eventos: 27155, trend: "+11.3%", status: "success" as const },
  { name: "Resuelto", usuarios: 1697, eventos: 4697, trend: "+16.6%", status: "success" as const },
];

const EVENTS_RESOLUCION_S11_12 = [
  { name: "Motivos de consulta", usuarios: 0, eventos: 0, trend: "0 EVENTOS", status: "danger" as const },
  { name: "Transportadora", usuarios: 368, eventos: 773, trend: "-0.26%", status: "normal" as const },
];

const EVENTS_RESOLUCION_S13_14 = [
  { name: "Motivos de consulta", usuarios: 0, eventos: 0, trend: "0 EVENTOS (28 dias)", status: "danger" as const },
  { name: "Transportadora", usuarios: 368, eventos: 773, trend: "estable", status: "normal" as const },
];

const FILTERS_S11_12 = [
  { name: "Antiguos", usuarios: 40, eventos: 137, trend: "+65%", status: "success" as const },
  { name: "Recientes", usuarios: 13, eventos: 18, trend: "+28.57%", status: "success" as const },
  { name: "Enviadas", usuarios: 8, eventos: 8, trend: "+14.29%", status: "normal" as const },
  { name: "Cerradas", usuarios: 6, eventos: 37, trend: "-43.08%", status: "warning" as const },
  { name: "Ordenar por", usuarios: 6, eventos: 6, trend: "+50%", status: "normal" as const },
  { name: "Activas", usuarios: 1, eventos: 1, trend: "", status: "normal" as const },
  { name: "Todas", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "No leidas", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "All chats", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "Buscador", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
];

const FILTERS_S13_14 = [
  { name: "Antiguos", usuarios: 40, eventos: 137, trend: "estable", status: "success" as const },
  { name: "Recientes", usuarios: 13, eventos: 18, trend: "estable", status: "success" as const },
  { name: "Enviadas", usuarios: 8, eventos: 8, trend: "estable", status: "normal" as const },
  { name: "Cerradas", usuarios: 6, eventos: 37, trend: "estable", status: "warning" as const },
  { name: "Ordenar por", usuarios: 6, eventos: 6, trend: "estable", status: "normal" as const },
  { name: "Activas", usuarios: 0, eventos: 0, trend: "MUERTO", status: "danger" as const },
  { name: "Todas", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "No leidas", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "All chats", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
  { name: "Buscador", usuarios: 0, eventos: 0, trend: "", status: "danger" as const },
];

const FILTERS_CHART_S11_12 = FILTERS_S11_12.map(f => ({
  name: f.name,
  usuarios: f.usuarios,
  fill: f.status === "danger" ? "#EF4444" : f.status === "success" ? "#10B981" : f.status === "warning" ? "#F59E0B" : "#6B7280",
}));

const FILTERS_CHART_S13_14 = FILTERS_S13_14.map(f => ({
  name: f.name,
  usuarios: f.usuarios,
  fill: f.status === "danger" ? "#EF4444" : f.status === "success" ? "#10B981" : f.status === "warning" ? "#F59E0B" : "#6B7280",
}));

/* ======================= INSIGHTS (CUMULATIVE S11-14) ======================= */
const INSIGHTS: { id: number; title: string; code: string; body: string; severity: "danger" | "success" | "warning" | "info" }[] = [
  { id: 1, code: "A5", title: 'Agujero Negro de Tracking', body: '"Motivos de consulta" con 0 eventos en 28 dias consecutivos (S11-14). Este evento deberia segmentar por que contacta cada dropshipper al proveedor (calidad, envio, stock, precio, etc.). Sin este dato, no se puede priorizar mejoras de producto ni medir North Star de satisfaccion. Invalida toda segmentacion de la conversacion CAS. Escalamiento inmediato a ingenieria.', severity: "danger" },
  { id: 2, code: "A6", title: 'Limbo en crecimiento acelerado', body: 'De 27,155 eventos "Abrir ticket" en S13-14, solo 4,697 llegan a "Resuelto" (17.3%). 22,458 tickets en limbo, un aumento de +34.6% vs S11-12 (16,681). El limbo crece mas rapido que los tickets totales. El volumen sin cierre explicito se acumula sprint a sprint.', severity: "danger" },
  { id: 3, code: "A5", title: '6 eventos muertos (era 5)', body: '6 selectores con 0 eventos: "Todas", "No leidas", "All chats", "Buscador", "Motivos de consulta" y ahora "Filtro Activas" (que paso de 1 usuario a 0 en S13-14). Si estos selectores existen en la UI pero nadie los usa, o el tracking no esta activo, son features muertas que ocupan espacio cognitivo. Prioridad: auditar si el tracking existe vs. si el feature esta roto.', severity: "danger" },
  { id: 4, code: "P1", title: 'Todos los eventos core crecen', body: 'Por primera vez todos los eventos del funnel muestran crecimiento positivo simultaneo (S13-14 vs S11-12): usuarios +4.9% a +16.6%, eventos +8.0% a +34.0%. El mayor crecimiento es en resolucion (+16.6% usuarios, +31.1% eventos). La adopcion del CAS se esta acelerando.', severity: "success" },
  { id: 5, code: "P2", title: 'Resolucion usuarios a 1.2pp del North Star', body: 'La tasa de resolucion por usuarios subio de 56.1% (S11-12) a 58.8% (S13-14), a solo 1.2pp del North Star de 60%. Es la metrica con mayor mejora relativa. Si la tendencia se mantiene, el North Star se alcanza en S15-16.', severity: "success" },
  { id: 6, code: "R2", title: 'Hiperactivos confirmados: 840.6% recurrencia', body: '"Abrir ticket" tiene recurrencia de 9.41 eventos/usuario en S13-14 (840.6% sobre la base, vs 681.5% en S11-12). Cada usuario que abre un ticket lo hace casi 10 veces en 14 dias. La recurrencia sube sprint a sprint. Esto confirma necesidad recurrente, no mal uso. Los usuarios del CAS son heavy users consistentes.', severity: "success" },
  { id: 7, code: "E1", title: 'Engagement PDP sigue fuerte', body: 'Tiempo promedio en PDP: 33 segundos/vista (+175% vs periodo anterior). Con 24.03 vistas/usuario en S13-14 (vs 23.34 en S11-12), cada dropshipper pasa ~13.2 minutos explorando producto antes de contactar. Oportunidad para surfacing contextual de CTA "Contactar" basado en tiempo en pagina.', severity: "success" },
  { id: 8, code: "F1", title: 'Funnel invertido persiste y se amplia', body: '"Iniciar conversacion" (4,939 usuarios) supera "Contactar" (4,171 usuarios) en S13-14. El gap se amplio de 588 usuarios (S11-12) a 768 usuarios (S13-14), un aumento del +30.6%. Esto confirma que hay rutas alternas al chat que crecen mas rapido que el boton Contactar del PDP. El patron se consolida como estructural, no como anomalia.', severity: "warning" },
  { id: 9, code: "A3", title: 'Mas trafico, baja conversion PDP a Contactar', body: '688,878 eventos de vista de producto para 28,672 usuarios unicos (24.03 vistas/usuario). Solo 4,171 hacen click en "Contactar" (14.5%, estable vs S11-12). Hay mucha exploracion pero poca conversion a contacto. La barrera PDP a Contactar no mejora a pesar del crecimiento general.', severity: "warning" },
  { id: 10, code: "R4", title: 'Seleccion natural ampliada', body: 'De 56,975 usuarios base, solo 2,887 (5.07%) abren un ticket CAS (era 4.75% en S11-12). La penetracion crece lentamente. Sin embargo, quienes lo usan muestran recurrencia cada vez mayor (9.41 tickets/usuario, +20.5% vs 7.81). La comunicacion DS-Prov sigue siendo un feature de nicho con usuarios cada vez mas comprometidos.', severity: "info" },
];

/* ======================= TIMELINE ======================= */
const TIMELINE = [
  { date: "Abril 2026", text: "DROP-23082 creada. Scope inicial: metricas CAS comunicacion dropshipper - proveedor." },
  { date: "Jun 2026", text: "Instrumentacion UserPilot de 17 eventos. Primera recoleccion de datos activa." },
  { date: "Jul 6-20", text: "Periodo de evaluacion S11-12. 14 dias de datos limpios. 5 eventos con 0 datos." },
  { date: "Jul 23, 2026", text: "Bitacora v1 publicada. 5 eventos muertos identificados como blocker." },
  { date: "Jul 21 - Ago 5", text: "Periodo de evaluacion S13-14. 16 dias de datos. Todos los eventos core crecen. Filtro Activas cae a 0 (sexto evento muerto)." },
  { date: "Ago 6, 2026", text: "Bitacora v2 publicada. S13-14 agregado. Resolucion usuarios a 1.2pp del North Star." },
];

/* ======================= TRENDS (S13-14 vs S11-12) ======================= */
const TRENDS = [
  { label: "Vistas producto", value: "688,878", trend: "+8.0%", down: false },
  { label: "Eventos Contactar", value: "8,026", trend: "+8.9%", down: false },
  { label: "Eventos Iniciar conv.", value: "26,506", trend: "+18.2%", down: false },
  { label: "Eventos Abrir ticket", value: "27,155", trend: "+34.0%", down: false },
  { label: "Eventos Resuelto", value: "4,697", trend: "+31.1%", down: false },
  { label: "Transportadora", value: "773", trend: "estable", down: false },
  { label: "Tiempo PDP", value: "33s/vista", trend: "+175%", down: false },
  { label: "Avg tickets/usuario", value: "9.4", trend: "+20.5%", down: false },
];

const FUNNEL_CHART_S13_14 = [
  { step: "Detalle producto", usuarios: 28672, eventos: 688878 },
  { step: "Contactar", usuarios: 4171, eventos: 8026 },
  { step: "Iniciar conv.", usuarios: 4939, eventos: 26506 },
  { step: "Abrir ticket", usuarios: 2887, eventos: 27155 },
  { step: "Resuelto", usuarios: 1697, eventos: 4697 },
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
    { id: "s13-14", label: "S13-14 · Jul 21 - Ago 5" },
    { id: "comparativo", label: "Comparativo" },
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
            &larr; Backoffice
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>CAS Comunicaci&oacute;n DS&harr;Prov &mdash; Bit&aacute;cora UX</span>
        </header>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8, letterSpacing: "-0.02em" }}>
            CAS Comunicaci&oacute;n Dropshipper&harr;Proveedor
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginBottom: 12 }}>
            Bit&aacute;cora UX de m&eacute;tricas del sistema de comunicaci&oacute;n y atenci&oacute;n CAS entre dropshippers y proveedores.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <span style={tag("var(--fg)", "#F3F4F6")}>Usuarios base: 56,975</span>
            <span style={tag("var(--dropi)", "var(--dropi-light)")}>Eventos trackeados: 17</span>
            <span style={tag("var(--danger)", "var(--danger-tint)")}>Eventos en 0: 6</span>
            <span style={tag("var(--success)", "var(--success-tint)")}>Tasa resoluci&oacute;n (usuarios): 58.8%</span>
            <span style={tag("var(--info)", "var(--info-tint)")}>Jul 6 al Ago 5, 2026</span>
            <span style={tag("var(--muted)", "#F3F4F6")}>Actualizado: Ago 6, 2026</span>
            <span style={tag("var(--info)", "var(--info-tint)")}>Jira: DROP-23082 / DROP-23719 / PRM-68</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 0, overflowX: "auto" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTabId(t.id)}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: tabId === t.id ? 700 : 500,
                color: tabId === t.id ? "var(--dropi)" : "var(--muted)",
                background: "transparent", border: "none", cursor: "pointer",
                borderBottom: tabId === t.id ? "2px solid var(--dropi)" : "2px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ==================== RESUMEN ==================== */}
        {tabId === "resumen" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ ...card, borderLeft: "4px solid var(--danger)", background: "var(--danger-tint)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 4 }}>
                Alerta cr&iacute;tica
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                6 eventos con 0 datos en 28 d&iacute;as: <strong>&quot;Motivos de consulta&quot;</strong>, <strong>&quot;Filtro todas&quot;</strong>, <strong>&quot;Filtro no le&iacute;das&quot;</strong>, <strong>&quot;Filtro all chats&quot;</strong>, <strong>&quot;Filtro buscador&quot;</strong> y ahora <strong>&quot;Filtro activas&quot;</strong> (ca&iacute;da a 0 en S13-14). Sin estos eventos no hay visibilidad sobre la segmentaci&oacute;n de consultas ni la salud de filtros clave de la bandeja CAS.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {[
                { label: "Vieron PDP", value: "28,672", sub: "50.3% de base · +4.9%", color: "var(--info)", bg: "var(--info-tint)" },
                { label: 'Click "Contactar"', value: "4,171", sub: "14.5% del PDP · +5.0%", color: "var(--dropi)", bg: "var(--dropi-light)" },
                { label: "Abrieron ticket", value: "2,887", sub: "5.07% de base · +11.3%", color: "var(--warning)", bg: "var(--warning-tint)" },
                { label: "Resolvieron caso", value: "1,697", sub: "58.8% · +16.6%", color: "var(--success)", bg: "var(--success-tint)" },
              ].map(k => (
                <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color === "var(--dropi)" ? DROPI : ""}`, borderTopColor: k.color }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={sectionTitle}>Funnel de conversi&oacute;n S13-14 (16 d&iacute;as)</div>
              <div style={{ ...sectionSub, marginBottom: 16 }}>Ca&iacute;da progresiva de usuarios &uacute;nicos por paso del flujo CAS. Todos los pasos crecen vs S11-12.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {FUNNEL_S13_14.map((f, i) => {
                  const maxW = 100;
                  const barW = (f.usuarios / 28672) * maxW;
                  return (
                    <div key={f.step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < FUNNEL_S13_14.length - 1 ? "1px solid var(--border)" : "none" }}>
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
                <strong>Anomal&iacute;a persiste:</strong> &quot;Iniciar conversaci&oacute;n&quot; (4,939) supera &quot;Contactar&quot; (4,171). Gap de 768 usuarios (era 588 en S11-12). El patr&oacute;n se consolida.
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Tendencias S13-14 vs S11-12</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Todos los eventos core con crecimiento positivo por primera vez.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                {TRENDS.map(t => (
                  <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "#FAFBFC", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{t.value}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: t.down ? "var(--danger)" : t.trend === "0%" || t.trend === "estable" ? "var(--muted)" : "var(--success)" }}>{t.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Timeline del proyecto</div>
              <div style={{ ...sectionSub, marginBottom: 16 }}>Hitos principales desde la creaci&oacute;n de la HU hasta hoy.</div>
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
              <div style={sectionTitle}>Funnel S13-14 &mdash; Usuarios &uacute;nicos vs Eventos totales</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Escala logar&iacute;tmica para comparar magnitudes dispares.</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={FUNNEL_CHART_S13_14} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
                    <CartesianGrid horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" scale="log" domain={[1, "auto"]} tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                    <YAxis type="category" dataKey="step" width={120} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={((v: string | number) => typeof v === "number" ? fmt(v) : v) as never} />
                    <Bar dataKey="usuarios" name="Usuarios unicos" fill={DROPI} radius={[0, 4, 4, 0]} maxBarSize={18} />
                    <Bar dataKey="eventos" name="Eventos totales" fill="#D1D5DB" radius={[0, 4, 4, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* ==================== S11-12 ==================== */}
        {tabId === "s11-12" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={card}>
              <div style={sectionTitle}>Funnel de adopci&oacute;n (S11-12 &middot; Jul 6&ndash;20)</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>14 d&iacute;as, 54,575 usuarios base.</div>
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
                    {FUNNEL_S11_12.map(f => (
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
              <div style={{ ...sectionSub, marginBottom: 12 }}>Cu&aacute;ntas veces en promedio un usuario ejecuta cada paso en 14 d&iacute;as.</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={RECURRENCE_S11_12} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
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
                { label: "Usuarios con resolucion", value: "56.1%", sub: "1,455 de 2,593 usuarios", color: "var(--success)", bg: "var(--success-tint)" },
                { label: "Tickets en limbo", value: "16,681", sub: "82.3% sin cierre explicito", color: "var(--warning)", bg: "var(--warning-tint)" },
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
              <div style={sectionTitle}>Resoluci&oacute;n de tickets</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Proporci&oacute;n de tickets resueltos vs en limbo (sin cierre expl&iacute;cito).</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
                <div style={{ width: 220, height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_S11_12} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                        {PIE_S11_12.map((_, i) => (
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
              <div style={sectionTitle}>Comparaci&oacute;n vs North Star</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Brechas entre el estado actual y los objetivos de producto.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>M&eacute;trica</th>
                      <th style={thR}>Actual</th>
                      <th style={thR}>Target</th>
                      <th style={thR}>Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NORTH_STAR_S11_12.map(n => (
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
              <div style={sectionTitle}>Detalle de eventos &mdash; Funnel core</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>5 eventos principales del flujo de comunicaci&oacute;n.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {EVENTS_CORE_S11_12.map(e => (
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
              <div style={sectionTitle}>Detalle de eventos &mdash; Resoluci&oacute;n y clasificaci&oacute;n</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>2 eventos de soporte y categorizaci&oacute;n.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {EVENTS_RESOLUCION_S11_12.map(e => (
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
              <div style={sectionTitle}>Detalle de eventos &mdash; Filtros de bandeja CAS</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>10 filtros de la bandeja de comunicaci&oacute;n. 4 con 0 eventos.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                {FILTERS_S11_12.map(f => (
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
              <div style={{ ...sectionSub, marginBottom: 12 }}>Usuarios &uacute;nicos por filtro de bandeja CAS (10 filtros).</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={FILTERS_CHART_S11_12} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
                    <CartesianGrid horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
                    <YAxis type="category" dataKey="name" width={90} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
                    <Bar dataKey="usuarios" name="Usuarios unicos" radius={[0, 4, 4, 0]} maxBarSize={20}>
                      {FILTERS_CHART_S11_12.map((f, i) => (
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
                El filtro &quot;Antiguos&quot; lidera con 40 usuarios &uacute;nicos y 137 eventos (+65% vs periodo anterior). Esto indica que los usuarios priorizan revisar conversaciones antiguas por encima de cualquier otro filtro. Posible necesidad de buscar historial o dar seguimiento a casos previos.
              </div>
            </div>

            <div style={{ ...card, borderLeft: "4px solid var(--warning)", background: "var(--warning-tint)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>Filtro &quot;cerradas&quot; con usuarios compulsivos</div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                El filtro &quot;Cerradas&quot; tiene solo 6 usuarios pero 37 eventos (6.17 eventos/usuario), la mayor recurrencia entre filtros. Son pocos usuarios revisando conversaciones cerradas muchas veces. Posible causa: buscar informaci&oacute;n de casos pasados resueltos, o verificar que un caso se cerr&oacute; correctamente. Tendencia: -43.08%.
              </div>
            </div>

          </div>
        )}

        {/* ==================== S13-14 ==================== */}
        {tabId === "s13-14" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ ...card, borderLeft: "4px solid var(--success)", background: "var(--success-tint)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>
                Se&ntilde;al positiva
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                Todos los eventos core del funnel muestran crecimiento positivo simult&aacute;neo vs S11-12. Mayor crecimiento en resoluci&oacute;n (+16.6% usuarios, +31.1% eventos). Tasa de resoluci&oacute;n por usuarios a 58.8%, a solo 1.2pp del North Star de 60%.
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Funnel de adopci&oacute;n (S13-14 &middot; Jul 21 &ndash; Ago 5)</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>16 d&iacute;as, 56,975 usuarios base. Delta vs S11-12.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Paso</th>
                      <th style={thR}>Usuarios</th>
                      <th style={thR}>vs S11-12</th>
                      <th style={thR}>Eventos</th>
                      <th style={thR}>vs S11-12</th>
                      <th style={thR}>Recurrencia</th>
                      <th style={thR}>Drop-off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FUNNEL_S13_14.map((f, i) => {
                      const prev = FUNNEL_S11_12[i];
                      const deltaU = ((f.usuarios - prev.usuarios) / prev.usuarios * 100).toFixed(1);
                      const deltaE = ((f.eventos - prev.eventos) / prev.eventos * 100).toFixed(1);
                      return (
                        <tr key={f.step} style={{ background: f.anomaly ? "var(--warning-tint)" : "transparent" }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: f.anomaly ? "var(--warning)" : "var(--fg)" }}>
                            {f.step} {f.anomaly && "⚠️"}
                          </td>
                          <td style={tdR}>{fmt(f.usuarios)}</td>
                          <td style={{ ...tdR, fontSize: 11, color: "var(--success)", fontWeight: 600 }}>+{deltaU}%</td>
                          <td style={tdR}>{fmt(f.eventos)}</td>
                          <td style={{ ...tdR, fontSize: 11, color: "var(--success)", fontWeight: 600 }}>+{deltaE}%</td>
                          <td style={tdR}>{f.recurrencia.toFixed(2)}</td>
                          <td style={{ ...tdR, color: f.dropOff.startsWith("-") ? "var(--danger)" : f.dropOff.startsWith("+") ? "var(--warning)" : "var(--muted)", fontWeight: 600 }}>{f.dropOff}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Recurrencia por paso S13-14 (avg eventos/usuario)</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Cu&aacute;ntas veces en promedio un usuario ejecuta cada paso en 16 d&iacute;as.</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={RECURRENCE_S13_14} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
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
                { label: "Tickets resueltos", value: "17.3%", sub: "4,697 de 27,155 eventos", color: "var(--danger)", bg: "var(--danger-tint)" },
                { label: "Usuarios con resolucion", value: "58.8%", sub: "1,697 de 2,887 usuarios", color: "var(--success)", bg: "var(--success-tint)" },
                { label: "Tickets en limbo", value: "22,458", sub: "+34.6% vs S11-12", color: "var(--warning)", bg: "var(--warning-tint)" },
                { label: "Avg resueltos/usuario", value: "2.77", sub: "4,697 / 1,697 usuarios", color: "var(--info)", bg: "var(--info-tint)" },
              ].map(k => (
                <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}` }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={sectionTitle}>Resoluci&oacute;n de tickets S13-14</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Proporci&oacute;n de tickets resueltos vs en limbo. Limbo crece +34.6% vs S11-12.</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
                <div style={{ width: 220, height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_S13_14} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                        {PIE_S13_14.map((_, i) => (
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
                    <span style={{ fontSize: 13, color: "var(--fg)" }}>Resueltos: <strong>4,697</strong> (17.3%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "#EF4444" }} />
                    <span style={{ fontSize: 13, color: "var(--fg)" }}>En limbo: <strong>22,458</strong> (82.7%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Comparaci&oacute;n vs North Star</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Brechas entre el estado actual (S13-14) y los objetivos de producto.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>M&eacute;trica</th>
                      <th style={thR}>Actual</th>
                      <th style={thR}>Target</th>
                      <th style={thR}>Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NORTH_STAR_S13_14.map(n => (
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
              <div style={sectionTitle}>Detalle de eventos &mdash; Funnel core S13-14</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>5 eventos principales. Todos con crecimiento positivo vs S11-12.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {EVENTS_CORE_S13_14.map(e => (
                  <div key={e.name} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${e.status === "success" ? "var(--success)" : e.status === "warning" ? "var(--warning)" : "var(--border)"}`, background: e.status === "success" ? "var(--success-tint)" : e.status === "warning" ? "var(--warning-tint)" : "#FAFBFC" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>{e.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
                      <span>Usuarios: <strong style={{ color: "var(--fg)" }}>{fmt(e.usuarios)}</strong></span>
                      <span>Eventos: <strong style={{ color: "var(--fg)" }}>{fmt(e.eventos)}</strong></span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: e.trend.startsWith("+") ? "var(--success)" : e.trend.startsWith("-") ? "var(--danger)" : "var(--muted)" }}>{e.trend} vs S11-12</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Detalle de eventos &mdash; Resoluci&oacute;n y clasificaci&oacute;n S13-14</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>2 eventos de soporte. Motivos de consulta sigue en 0 tras 28 d&iacute;as.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {EVENTS_RESOLUCION_S13_14.map(e => (
                  <div key={e.name} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${e.status === "danger" ? "var(--danger)" : "var(--border)"}`, background: e.status === "danger" ? "var(--danger-tint)" : "#FAFBFC" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: e.status === "danger" ? "var(--danger)" : "var(--fg)", marginBottom: 6 }}>{e.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
                      <span>Usuarios: <strong style={{ color: e.status === "danger" ? "var(--danger)" : "var(--fg)" }}>{fmt(e.usuarios)}</strong></span>
                      <span>Eventos: <strong style={{ color: e.status === "danger" ? "var(--danger)" : "var(--fg)" }}>{fmt(e.eventos)}</strong></span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: e.status === "danger" ? "var(--danger)" : "var(--muted)" }}>{e.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Detalle de eventos &mdash; Filtros de bandeja CAS (S13-14)</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>10 filtros de la bandeja. 5 con 0 eventos (era 4 en S11-12). Filtro Activas cay&oacute; a 0.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                {FILTERS_S13_14.map(f => (
                  <div key={f.name} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${f.status === "danger" ? "var(--danger)" : f.status === "success" ? "var(--success)" : "var(--border)"}`, background: f.status === "danger" ? "var(--danger-tint)" : f.status === "success" ? "var(--success-tint)" : "#FAFBFC" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: f.status === "danger" ? "var(--danger)" : "var(--fg)", marginBottom: 4 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>U: {fmt(f.usuarios)} / E: {fmt(f.eventos)}</div>
                    {f.trend && <div style={{ fontSize: 10, fontWeight: 600, color: f.status === "danger" ? "var(--danger)" : f.status === "success" ? "var(--success)" : f.trend.startsWith("-") ? "var(--danger)" : "var(--muted)", marginTop: 2 }}>{f.trend}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Mapa de salud de filtros S13-14</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Usuarios &uacute;nicos por filtro. Filtro Activas se sum&oacute; a los muertos.</div>
              <div style={{ overflowX: "auto" }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={FILTERS_CHART_S13_14} layout="vertical" margin={{ top: 8, right: 40, left: 8, bottom: 8 }}>
                    <CartesianGrid horizontal={false} stroke={gridStroke} />
                    <XAxis type="number" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
                    <YAxis type="category" dataKey="name" width={90} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
                    <Bar dataKey="usuarios" name="Usuarios unicos" radius={[0, 4, 4, 0]} maxBarSize={20}>
                      {FILTERS_CHART_S13_14.map((f, i) => (
                        <Cell key={i} fill={f.fill} />
                      ))}
                      <LabelList dataKey="usuarios" position="right" style={labelStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* ==================== COMPARATIVO ==================== */}
        {tabId === "comparativo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ ...card, borderLeft: "4px solid var(--info)", background: "var(--info-tint)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--info)", marginBottom: 4 }}>
                Comparativo S11-12 vs S13-14
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                Todos los eventos core muestran crecimiento. El mayor delta est&aacute; en resoluci&oacute;n (+16.6% usuarios, +31.1% eventos) y en tickets (+11.3% usuarios, +34.0% eventos). La tasa de resoluci&oacute;n por usuarios subi&oacute; de 56.1% a 58.8%, pero el limbo crece m&aacute;s r&aacute;pido (+34.6%).
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Funnel &mdash; Usuarios y eventos por periodo</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>Comparaci&oacute;n directa de cada paso del funnel entre S11-12 y S13-14.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Paso</th>
                      <th style={thR}>Usuarios S11-12</th>
                      <th style={thR}>Usuarios S13-14</th>
                      <th style={thR}>Delta</th>
                      <th style={thR}>Eventos S11-12</th>
                      <th style={thR}>Eventos S13-14</th>
                      <th style={thR}>Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARATIVO_FUNNEL.map(c => (
                      <tr key={c.step}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{c.step}</td>
                        <td style={tdR}>{fmt(c.usersS11)}</td>
                        <td style={{ ...tdR, fontWeight: 700 }}>{fmt(c.usersS13)}</td>
                        <td style={{ ...tdR, color: "var(--success)", fontWeight: 600 }}>{c.deltaUsers}</td>
                        <td style={tdR}>{fmt(c.eventsS11)}</td>
                        <td style={{ ...tdR, fontWeight: 700 }}>{fmt(c.eventsS13)}</td>
                        <td style={{ ...tdR, color: "var(--success)", fontWeight: 600 }}>{c.deltaEvents}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={card}>
              <div style={sectionTitle}>Resoluci&oacute;n y salud del sistema</div>
              <div style={{ ...sectionSub, marginBottom: 12 }}>M&eacute;tricas clave de cierre de tickets y cobertura de eventos.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>M&eacute;trica</th>
                      <th style={thR}>S11-12</th>
                      <th style={thR}>S13-14</th>
                      <th style={thR}>Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARATIVO_RESOLUCION.map(c => (
                      <tr key={c.metric}>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{c.metric}</td>
                        <td style={tdR}>{c.s11}</td>
                        <td style={{ ...tdR, fontWeight: 700 }}>{c.s13}</td>
                        <td style={{ ...tdR, fontWeight: 700, color: c.status === "danger" ? "var(--danger)" : c.status === "success" ? "var(--success)" : "var(--warning)" }}>{c.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={card}>
                <div style={sectionTitle}>Recurrencia S11-12</div>
                <div style={{ ...sectionSub, marginBottom: 12 }}>Avg eventos/usuario por paso.</div>
                <div style={{ overflowX: "auto" }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={RECURRENCE_S11_12} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={gridStroke} />
                      <XAxis dataKey="step" tickLine={false} axisLine={{ stroke: gridStroke }} tick={{ fontSize: 9, fill: "#6B7280" }} interval={0} />
                      <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
                      <Bar dataKey="value" name="Avg" fill="#D1D5DB" radius={[4, 4, 0, 0]} maxBarSize={36}>
                        <LabelList dataKey="value" position="top" style={labelStyle} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={card}>
                <div style={sectionTitle}>Recurrencia S13-14</div>
                <div style={{ ...sectionSub, marginBottom: 12 }}>Avg eventos/usuario por paso.</div>
                <div style={{ overflowX: "auto" }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={RECURRENCE_S13_14} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={gridStroke} />
                      <XAxis dataKey="step" tickLine={false} axisLine={{ stroke: gridStroke }} tick={{ fontSize: 9, fill: "#6B7280" }} interval={0} />
                      <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
                      <Bar dataKey="value" name="Avg" fill={DROPI} radius={[4, 4, 0, 0]} maxBarSize={36}>
                        <LabelList dataKey="value" position="top" style={labelStyle} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={card}>
                <div style={sectionTitle}>Resoluci&oacute;n S11-12</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 180, height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={PIE_S11_12} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                          {PIE_S11_12.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={((v: string | number) => typeof v === "number" ? fmt(v) : v) as never} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Resueltos: 3,583 (17.7%) / Limbo: 16,681</div>
              </div>
              <div style={card}>
                <div style={sectionTitle}>Resoluci&oacute;n S13-14</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 180, height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={PIE_S13_14} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                          {PIE_S13_14.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} formatter={((v: string | number) => typeof v === "number" ? fmt(v) : v) as never} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Resueltos: 4,697 (17.3%) / Limbo: 22,458</div>
              </div>
            </div>

            <div style={{ ...card, borderLeft: "4px solid var(--warning)", background: "var(--warning-tint)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>Inversi&oacute;n del funnel se amplia</div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                El gap entre &quot;Iniciar conversaci&oacute;n&quot; y &quot;Contactar&quot; creci&oacute; de 588 usuarios (S11-12: 4,560 vs 3,972) a 768 usuarios (S13-14: 4,939 vs 4,171), un aumento del +30.6%. El patr&oacute;n se consolida como estructural &mdash; hay rutas alternas al chat que crecen m&aacute;s r&aacute;pido que el bot&oacute;n Contactar del PDP.
              </div>
            </div>

            <div style={{ ...card, borderLeft: "4px solid var(--danger)", background: "var(--danger-tint)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--danger)", marginBottom: 4 }}>Limbo crece m&aacute;s r&aacute;pido que la resoluci&oacute;n</div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                Aunque la tasa de resoluci&oacute;n por usuarios mejor&oacute; (56.1% a 58.8%), el volumen absoluto de tickets en limbo creci&oacute; +34.6% (16,681 a 22,458). La tasa de resoluci&oacute;n por tickets baj&oacute; ligeramente (17.7% a 17.3%). M&aacute;s usuarios resuelven, pero el sistema genera tickets m&aacute;s r&aacute;pido de lo que se cierran.
              </div>
            </div>

          </div>
        )}

        {/* ==================== HALLAZGOS ==================== */}
        {tabId === "hallazgos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ marginBottom: 4 }}>
              <div style={sectionTitle}>10 hallazgos acumulados S11-14 (28 d&iacute;as)</div>
              <div style={sectionSub}>Organizados por severidad: cr&iacute;ticos, positivos y patrones. Actualizados con datos de S13-14.</div>
            </div>

            {INSIGHTS.map(ins => {
              const borderColor = ins.severity === "danger" ? "var(--danger)" : ins.severity === "success" ? "var(--success)" : ins.severity === "warning" ? "var(--warning)" : "var(--info)";
              const bgColor = ins.severity === "danger" ? "var(--danger-tint)" : ins.severity === "success" ? "var(--success-tint)" : ins.severity === "warning" ? "var(--warning-tint)" : "var(--info-tint)";
              const labelColor = ins.severity === "danger" ? "var(--danger)" : ins.severity === "success" ? "var(--success)" : ins.severity === "warning" ? "var(--warning)" : "var(--info)";
              const severityLabel = ins.severity === "danger" ? "Critico" : ins.severity === "success" ? "Positivo" : ins.severity === "warning" ? "Patron" : "Patron";
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
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>&quot;Motivos de consulta&quot; &mdash; 28 d&iacute;as en 0</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}>
                Si este evento pasa de 0 a &gt;0, desbloquea toda la segmentaci&oacute;n North Star: saber por qu&eacute; contacta cada dropshipper (calidad, env&iacute;o, stock, precio) permitir&iacute;a priorizar mejoras de producto, medir satisfacci&oacute;n por categor&iacute;a y reducir tickets repetitivos. Es el evento m&aacute;s bloqueante del sistema CAS. Tras 28 d&iacute;as consecutivos en 0, requiere escalamiento a ingenier&iacute;a.
              </div>
            </div>
          </div>
        )}

        {/* ==================== PROXIMOS PASOS ==================== */}
        {tabId === "proximos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{"🔴"}</span>
                <div style={sectionTitle}>URGENTE (S13-14)</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: 'Escalar "Motivos de consulta" a ingenieria', body: '28 dias consecutivos con 0 eventos. Ya no es solo una auditoria — requiere ticket de ingenieria para verificar: (1) si el evento esta instrumentado en UserPilot, (2) si el selector CSS/XPath apunta al elemento correcto, (3) si el feature existe en la UI. Si el tracking existe pero el feature no se usa, investigar por que. Si el feature no existe, escalar como gap de producto. Bloquea toda segmentacion North Star.' },
                  { title: 'Auditar 6 eventos muertos (era 5)', body: 'Los filtros "Todas", "No leidas", "All chats", "Buscador", "Motivos de consulta" y ahora "Activas" (nueva en S13-14) reportan 0 eventos. Filtro Activas paso de 1 usuario/1 evento a 0/0. Para cada uno: verificar si el tracking esta activo, si el selector CSS/XPath es correcto, y si el feature es visible para los usuarios.' },
                  { title: 'Contener crecimiento del limbo', body: 'El limbo crecio +34.6% en un sprint (16,681 a 22,458 tickets sin cierre). A este ritmo, en S15-16 superara los 30,000. Investigar: hay un boton de "Resuelto" visible? El usuario sabe que debe cerrar el caso? Hay cierre automatico por inactividad? El proveedor cierra o solo el dropshipper puede hacerlo? Resultado esperado: diagnostico del flujo de cierre y propuesta de contencion.' },
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
                  { title: 'Cerrar gap de resolucion usuarios (1.2pp a 60%)', body: 'La tasa de resolucion por usuarios subio de 56.1% a 58.8%. A solo 1.2pp del North Star de 60%. Identificar que cambio entre S11-12 y S13-14 que impulso la mejora. Replicar y acelerar. Si la tendencia se mantiene, el North Star se alcanza en S15-16.' },
                  { title: 'Investigar funnel invertido ampliado', body: '"Iniciar conversacion" (4,939) supera "Contactar" (4,171). El gap crecio de 588 a 768 usuarios (+30.6%). Identificar todas las rutas de acceso al chat: hay un deeplink directo? Se puede iniciar conversacion desde la bandeja sin pasar por PDP? El evento "Contactar" solo se dispara desde el boton del PDP? El patron ya no es anomalia — es estructural.' },
                  { title: 'Capitalizar momentum de crecimiento', body: 'Todos los eventos core crecen simultaneamente por primera vez. Mayor crecimiento: resolucion (+16.6% usuarios) y tickets (+11.3% usuarios). Disenar acciones que amplifiquen esta tendencia: mejorar visibilidad del CTA de cierre, optimizar el flujo de resolucion, reducir friccion en los pasos mas debiles del funnel.' },
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
                <span style={{ fontSize: 16 }}>{"🟢"}</span>
                <div style={sectionTitle}>MEDIANO PLAZO</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: 'Cierre automatico de tickets inactivos', body: 'Con 22,458 tickets en limbo y creciendo +34.6% por sprint, implementar cierre automatico por inactividad (ej. 7 dias sin respuesta). Antes de cerrar, enviar notificacion: "Tu caso fue resuelto?". Si no responde en 48h, cerrar como "resuelto por inactividad". Prerequisito: diagnostico urgente del flujo de cierre actual.' },
                  { title: 'Surfacing contextual CTA', body: 'Con +175% de tiempo en PDP (33s/vista) y 24.03 vistas/usuario, hay oportunidad de mostrar un CTA contextual de "Contactar al proveedor" basado en comportamiento: despues de X segundos en pagina, despues de scroll a cierta seccion, o despues de visitar el mismo producto N veces. Objetivo: mejorar conversion PDP a Contactar (estable en 14.5%).' },
                  { title: 'Consolidar filtros de bandeja CAS', body: 'Con 5 filtros muertos (50% de la UI) y "Antiguos" dominando, la arquitectura de informacion no refleja el comportamiento real. Propuesta: eliminar o consolidar filtros muertos, reordenar por frecuencia de uso, agregar filtro de estado de resolucion (resuelto/en limbo/pendiente). Reducir carga cognitiva de la bandeja.' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid var(--success)", background: "var(--success-tint)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>{i + 1}. {item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <footer style={{ marginTop: 32, padding: "16px 0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            Backoffice &middot; CAS Comunicaci&oacute;n Dropshipper&harr;Proveedor &middot; Bit&aacute;cora UX &middot; Ago 6, 2026 &middot; Autor: Michel Pino (UX) &middot; Datos: UserPilot &middot; Jira: DROP-23082 / DROP-23719 / PRM-68
          </div>
        </footer>

      </div>
    </main>
  );
}
