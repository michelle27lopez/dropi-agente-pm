"use client";

import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// Panel de Soporte DROPI (Intercom) — versión con la línea gráfica de Darwin.
// Datos reales tal cual venían en el artifact que compartió Diana (sin
// inventar ni redondear de más); solo cambia la presentación: recharts +
// tokens de Darwin en vez del HTML/CSS/SVG a mano del artifact original.
// La versión estática original sigue en /panel-soporte-dropi.html (link
// "Ver HTML original" al fondo) por si se necesita copiar/exportar tal cual.

const CRITICAL = "#DC2626";
const SERIOUS = "#EA580C";
const WARNING = "#CA8A04";
const GOOD = "#15803D";
const ACCENT = "#2563EB";
const MUTED = "#6B7280";
const ACCENT_PURPLE = "#7C3AED";

const DATA = {
  kpis: {
    total_conv: 31618, clientes_unicos: 12935, pct_mismo_dia: 54.1,
    mediana_horas: 2.9, avg_horas: 4.8, csat_avg: 3.29, tasa_calificacion: 16.5,
    pct_primer_contacto: 37.3, frt_mediana_min: 2.9, respuestas_avg: 2.9,
    n_paises: 10, n_agentes: 29, pct_closed: 98.2, open_count: 411, snoozed_count: 146,
  },
  weekly: [
    { week: "29 jun", conversaciones: 3158, pct_mismo_dia: 65.0, csat: 3.17, horas: 3.4 },
    { week: "6 jul", conversaciones: 4711, pct_mismo_dia: 61.8, csat: 3.06, horas: 3.8 },
    { week: "13 jul", conversaciones: 4266, pct_mismo_dia: 61.7, csat: 3.19, horas: 3.9 },
    { week: "20 jul", conversaciones: 4650, pct_mismo_dia: 60.8, csat: 3.31, horas: 3.7 },
    { week: "27 jul", conversaciones: 4592, pct_mismo_dia: 59.6, csat: 3.56, horas: 3.6 },
    { week: "3 ago", conversaciones: 4660, pct_mismo_dia: 43.2, csat: 3.29, horas: 7.4 },
    { week: "10 ago", conversaciones: 4627, pct_mismo_dia: 34.1, csat: 3.4, horas: 7.0 },
    { week: "17 ago", conversaciones: 954, pct_mismo_dia: 38.2, csat: 3.77, horas: 2.7 },
  ],
  franja: [
    { label: "00–08h", conversaciones: 1769 },
    { label: "08–16h", conversaciones: 21719 },
    { label: "16–24h", conversaciones: 8130 },
  ],
  diasem: [
    { label: "Lun", conversaciones: 4738 }, { label: "Mar", conversaciones: 6047 },
    { label: "Mié", conversaciones: 6183 }, { label: "Jue", conversaciones: 5799 },
    { label: "Vie", conversaciones: 4901 }, { label: "Sáb", conversaciones: 2899 },
    { label: "Dom", conversaciones: 1051 },
  ],
  paises: [
    { pais: "Colombia", conversaciones: 22553, csat: 3.35, pct_mismo_dia: 58.4 },
    { pais: "Ecuador", conversaciones: 2929, csat: 3.35, pct_mismo_dia: 46.1 },
    { pais: "México", conversaciones: 2345, csat: 2.48, pct_mismo_dia: 45.4 },
    { pais: "Chile", conversaciones: 1469, csat: 2.93, pct_mismo_dia: 31.1 },
    { pais: "Paraguay", conversaciones: 977, csat: 3.72, pct_mismo_dia: 56.1 },
    { pais: "Argentina", conversaciones: 562, csat: 3.41, pct_mismo_dia: 46.6 },
    { pais: "Guatemala", conversaciones: 462, csat: 3.16, pct_mismo_dia: 33.5 },
    { pais: "Perú", conversaciones: 160, csat: 2.67, pct_mismo_dia: 21.9 },
    { pais: "Panamá", conversaciones: 121, csat: 3.73, pct_mismo_dia: 43.0 },
    { pais: "Costa Rica", conversaciones: 40, csat: 2.5, pct_mismo_dia: 22.5 },
  ],
  teams: [
    { team: "Anulaciones", conversaciones: 14452, csat: 3.69 },
    { team: "Triage General", conversaciones: 6716, csat: 3.26 },
    { team: "Línea general Col", conversaciones: 2861, csat: 2.76 },
    { team: "Actualización de Estatus", conversaciones: 1818, csat: 3.12 },
    { team: "Guías sin movimiento", conversaciones: 848, csat: 3.4 },
    { team: "SAC Tier 1 Dropshippers", conversaciones: 808, csat: 3.76 },
    { team: "Devoluciones injustificadas", conversaciones: 770, csat: 2.09 },
    { team: "Recolecciones", conversaciones: 736, csat: 3.33 },
  ],
  topics: [
    { topic: "Anulaciones", count: 10325 }, { topic: "Órdenes", count: 5995 },
    { topic: "Guía", count: 4037 }, { topic: "Transportadoras", count: 3939 },
    { topic: "CAS", count: 1893 }, { topic: "Anulación de guías", count: 1619 },
    { topic: "Cobertura", count: 491 }, { topic: "Retiros", count: 475 },
    { topic: "Billetera", count: 376 }, { topic: "Integraciones", count: 320 },
  ],
  agentes: [
    { agente: "Karen Parra", conversaciones: 7911, csat: 3.58, horas: 3.1, tasa: 14.7 },
    { agente: "Nathali Quinto Ortiz", conversaciones: 3659, csat: 3.1, horas: 2.9, tasa: 21.1 },
    { agente: "Luisa Buitrago", conversaciones: 2630, csat: 3.37, horas: 5.8, tasa: 16.4 },
    { agente: "Ashley Erazo", conversaciones: 2116, csat: 3.02, horas: 5.7, tasa: 23.3 },
    { agente: "Valentina Buitrago García", conversaciones: 2062, csat: 2.94, horas: 7.9, tasa: 15.7 },
    { agente: "Danna Trujillo", conversaciones: 2000, csat: 3.28, horas: 4.5, tasa: 15.2 },
    { agente: "Santiago Navia", conversaciones: 1931, csat: 3.47, horas: 8.1, tasa: 11.1 },
    { agente: "Dennis Martinez", conversaciones: 1890, csat: 2.89, horas: 5.6, tasa: 15.1 },
    { agente: "Yulisa Ibarguen", conversaciones: 1707, csat: 3.72, horas: 5.6, tasa: 22.5 },
    { agente: "Sara Mejía", conversaciones: 1642, csat: 4.12, horas: 6.2, tasa: 12.9 },
    { agente: "Angela Ramirez", conversaciones: 1546, csat: 2.1, horas: 5.1, tasa: 16.0 },
    { agente: "Laura Rengifo", conversaciones: 627, csat: 3.13, horas: 5.6, tasa: 12.6 },
  ],
  csatDist: [
    { rating: "1★", count: 1357 }, { rating: "2★", count: 435 }, { rating: "3★", count: 542 },
    { rating: "4★", count: 1133 }, { rating: "5★", count: 1757 },
  ],
};

const TM = {
  dist: [
    { rating: "1★", count: 3611, pct: 48.1 }, { rating: "2★", count: 958, pct: 12.8 },
    { rating: "3★", count: 711, pct: 9.5 }, { rating: "4★", count: 793, pct: 10.6 },
    { rating: "5★", count: 1434, pct: 19.1 },
  ],
  monthly: [
    { mes: "Abr", rating: 2.40 }, { mes: "May", rating: 2.39 }, { mes: "Jun", rating: 2.45 },
    { mes: "Jul", rating: 2.45 }, { mes: "Ago", rating: 2.31 },
  ],
  dolores: [
    { label: "Reclamo de fondo (logística/dinero)", count: 1754, pct: 33.2 },
    { label: "No resuelven", count: 913, pct: 17.3 },
    { label: "Incumplimiento de SLA", count: 572, pct: 10.8 },
    { label: "Juicio global negativo", count: 422, pct: 8.0 },
    { label: "No responden", count: 257, pct: 4.9 },
    { label: "Cierre prematuro del chat", count: 234, pct: 4.4 },
    { label: "No entienden la consulta", count: 84, pct: 1.6 },
    { label: "Respuesta plantilla / bot", count: 55, pct: 1.0 },
  ],
  terminosDetractores: [
    { term: "solución", count: 583 }, { term: "respuesta", count: 577 }, { term: "cliente", count: 371 },
    { term: "guía", count: 246 }, { term: "proveedor", count: 220 }, { term: "conversación", count: 218 },
    { term: "servicio", count: 216 }, { term: "transportadora", count: 202 }, { term: "necesito", count: 195 },
    { term: "pedido", count: 189 }, { term: "tiempo", count: 184 }, { term: "estoy", count: 174 },
    { term: "pésimo", count: 158 }, { term: "devolución", count: 158 },
  ],
  terminosPromotores: [
    { term: "gracias", count: 1043 }, { term: "muchas", count: 350 }, { term: "excelente", count: 268 },
    { term: "bien", count: 141 }, { term: "atención", count: 124 }, { term: "buena", count: 95 },
    { term: "respuesta", count: 77 }, { term: "servicio", count: 67 }, { term: "rápido", count: 54 },
    { term: "rápida", count: 49 }, { term: "ayuda", count: 48 }, { term: "súper", count: 43 },
    { term: "solución", count: 40 }, { term: "buen", count: 36 },
  ],
  metricasPorRating: [
    { rating: "1★", primerContacto: 56.1, reabierta: 13.8 },
    { rating: "2★", primerContacto: 56.7, reabierta: 14.3 },
    { rating: "3★", primerContacto: 56.7, reabierta: 13.4 },
    { rating: "4★", primerContacto: 58.6, reabierta: 12.9 },
    { rating: "5★", primerContacto: 53.0, reabierta: 14.2 },
  ],
  equipos: [
    { team: "Anulaciones", rating: 3.09, n: 912 },
    { team: "Compliance", rating: 2.90, n: 738 },
    { team: "Actualización de Estatus", rating: 2.80, n: 199 },
    { team: "Triage General", rating: 2.62, n: 1122 },
    { team: "Recolecciones", rating: 2.47, n: 97 },
    { team: "Garantías Dropshipper", rating: 2.47, n: 859 },
    { team: "Integraciones", rating: 2.45, n: 144 },
    { team: "Órdenes Sin Despacho", rating: 2.18, n: 686 },
    { team: "PQR - CAS", rating: 2.16, n: 206 },
    { team: "Guías sin movimiento", rating: 2.13, n: 84 },
    { team: "Otras consultas financiero", rating: 2.01, n: 213 },
    { team: "Retiros", rating: 1.82, n: 833 },
    { team: "Pruebas de entrega", rating: 1.78, n: 125 },
    { team: "Devoluciones injustificadas", rating: 1.41, n: 672 },
  ].sort((a, b) => b.rating - a.rating),
  avgRating: 2.40,
  limitaciones: [
    "Sesgo de no respuesta. Solo califica una fracción de los usuarios atendidos, y quien queda satisfecho responde menos. El 60.9% de detractores describe la composición de quienes comentaron, no la tasa de insatisfacción del canal.",
    "Los dolores se detectan mediante expresiones regulares sobre el texto. El método es auditable y reproducible, pero no captura ironía ni quejas sin marcador léxico explícito. Los porcentajes son un piso, no un techo.",
    "El campo de equipo indica quién atendió el caso, no dónde se originó la falla. Esta es la causa directa de la atribución incorrecta descrita en el insight principal.",
    "Los dolores no son mutuamente excluyentes: un comentario puede clasificarse en varios, por lo que los porcentajes suman más de 100%.",
    "El análisis cubre únicamente Colombia. No es extrapolable a las demás operaciones sin repetir el procesamiento.",
    "Sin identificador de agente en esta extracción no es posible distinguir el efecto del agente del efecto de la cola de atención.",
  ],
  recomendaciones: [
    { accion: "Verificar cómo se captura «resuelto al primer contacto»", objetivo: "Determinar si el indicador es inválido o mal registrado", responsable: "Ops Intercom" },
    { accion: "Etiquetar tickets no resolubles por el agente", objetivo: "Separar la evaluación de SAC de fallas de otras áreas", responsable: "Gerencia SAC" },
    { accion: "Revisar la política de cobro de devoluciones injustificadas", objetivo: "Atacar el peor resultado de la operación (1.41)", responsable: "Comercial + Logística" },
    { accion: "Condicionar la pregunta abierta a la calificación", objetivo: "Recuperar información hoy perdida en los agradecimientos", responsable: "Ops Intercom" },
    { accion: "Auditar el margen de decisión del agente en Retiros", objetivo: "Entender si «no resuelven» es falta de facultades", responsable: "Financiero + SAC" },
    { accion: "Incorporar identificador de agente a la extracción", objetivo: "Separar efecto del agente del efecto de la cola", responsable: "Analítica" },
  ],
};

function csatColor(rating: string): string {
  const n = parseInt(rating);
  if (n <= 1) return CRITICAL;
  if (n === 2) return SERIOUS;
  if (n === 3) return MUTED;
  if (n === 4) return "#0D9488";
  return GOOD;
}

const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14,
  padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20,
};
const sectionHeading: React.CSSProperties = {
  fontSize: 16, fontWeight: 800, color: "var(--fg)", marginBottom: 4,
  display: "flex", alignItems: "center", gap: 8,
};
const sectionNote: React.CSSProperties = { fontSize: 12, color: "var(--muted)", marginBottom: 14 };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 };
const kpiGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 12.5 };
const th: React.CSSProperties = { textAlign: "left", padding: "0 8px 8px", fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid var(--border)" };
const td: React.CSSProperties = { padding: "8px 8px", borderBottom: "1px solid var(--border)" };

function Section({ icon, title, note, children }: { icon: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <div style={sectionHeading}><span>{icon}</span><span>{title}</span></div>
      {note && <div style={sectionNote}>{note}</div>}
      {children}
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "good" | "critical" }) {
  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: tone === "critical" ? CRITICAL : tone === "good" ? GOOD : "var(--muted)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function tooltipStyle() {
  return { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };
}

function pillColor(v: number, goodMin: number, warnMin: number) {
  if (v >= goodMin) return { color: GOOD, bg: "#F0FDF4" };
  if (v >= warnMin) return { color: WARNING, bg: "#FFFBEB" };
  return { color: CRITICAL, bg: "#FEF2F2" };
}

function Pill({ value, goodMin, warnMin, format }: { value: number; goodMin: number; warnMin: number; format: (v: number) => string }) {
  const p = pillColor(value, goodMin, warnMin);
  return <span style={{ fontSize: 11.5, fontWeight: 700, color: p.color, background: p.bg, borderRadius: 999, padding: "2px 9px" }}>{format(value)}</span>;
}

export default function PanelSoporteDropiPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Panel de Soporte DROPI"
        subtitle="Célula Experience · Fuente: Intercom · Growth Ops"
        currentSlug="panel-soporte-dropi"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a href="/celula/experience/data" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver a Data
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: ACCENT, background: "#EFF6FF" }}>🎧 Intercom · Soporte al cliente</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "var(--muted)", background: "var(--bg)" }}>Período: 30 jun – 18 ago 2026</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            DROPI — Panel de Soporte
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, maxWidth: 640 }}>
            Volumen, tiempos de cierre y satisfacción de las conversaciones de soporte, por país, equipo, agente y tema. 31,618 conversaciones · 10 países.
          </p>
        </div>

        {/* KPIs */}
        <Section icon="📊" title="Estado general">
          <div style={kpiGrid}>
            <Kpi label="Conversaciones totales" value={DATA.kpis.total_conv.toLocaleString("es-CO")} sub={`≈632/día · ${DATA.kpis.clientes_unicos.toLocaleString("es-CO")} clientes únicos`} />
            <Kpi label="Cerradas el mismo día" value={`${DATA.kpis.pct_mismo_dia}%`} sub="↓ de 65% a 34–38% desde ago." tone="critical" />
            <Kpi label="Horas hábiles a cierre" value={`${DATA.kpis.mediana_horas}h`} sub={`Promedio ${DATA.kpis.avg_horas}h (colas largas)`} />
            <Kpi label="Resueltas en 1er contacto" value={`${DATA.kpis.pct_primer_contacto}%`} sub={`${DATA.kpis.respuestas_avg} respuestas promedio`} />
            <Kpi label="Satisfacción (CSAT)" value={`${DATA.kpis.csat_avg}/5`} sub={`Solo ${DATA.kpis.tasa_calificacion}% calificados`} />
            <Kpi label="Tiempo 1ª respuesta" value={`${DATA.kpis.frt_mediana_min} min`} sub="mediana, horario hábil" />
            <Kpi label="Estado actual" value={`${DATA.kpis.pct_closed}%`} sub={`cerradas · ${DATA.kpis.open_count} abiertas · ${DATA.kpis.snoozed_count} pospuestas`} />
            <Kpi label="Cobertura" value={`${DATA.kpis.n_agentes} agentes`} sub={`${DATA.kpis.n_paises} países`} />
          </div>
        </Section>

        {/* Tendencia operativa */}
        <Section icon="📈" title="Tendencia operativa" note="Por semana, desde el 29 de junio">
          <div style={grid2}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Conversaciones por semana</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={DATA.weekly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [v.toLocaleString("es-CO"), "Conversaciones"]) as never} />
                  <Bar dataKey="conversaciones" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>% cerradas el mismo día</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={DATA.weekly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} domain={[0, 75]} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [`${v}%`, "Mismo día"]) as never} />
                  <Line type="monotone" dataKey="pct_mismo_dia" stroke={CRITICAL} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: 14, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#78350F" }}>
            <strong>El cierre en el mismo día cayó de 65% a 34–38%</strong> en las semanas del 3 y 10 de agosto, justo cuando las horas hábiles promedio a cierre subieron de ~3.6h a ~7.4h — el volumen entrante se mantuvo estable, así que el atraso parece venir de capacidad de atención, no de un pico de demanda.
          </div>
        </Section>

        {/* Patrones horarios */}
        <Section icon="🕐" title="Patrones horarios" note="Cuándo llegan los casos">
          <div style={grid2}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2 }}>Por franja horaria</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8 }}>68.7% de los casos llegan en horario 08–16</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={DATA.franja} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [v.toLocaleString("es-CO"), "Conversaciones"]) as never} />
                  <Bar dataKey="conversaciones" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2 }}>Por día de la semana</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8 }}>Miércoles y martes concentran más volumen</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={DATA.diasem} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [v.toLocaleString("es-CO"), "Conversaciones"]) as never} />
                  <Bar dataKey="conversaciones" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>

        {/* Países */}
        <Section icon="🌎" title="Por país" note="Colombia concentra 71% del volumen">
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead><tr><th style={th}>#</th><th style={th}>País</th><th style={{ ...th, textAlign: "right" }}>Conversaciones</th><th style={{ ...th, textAlign: "right" }}>% mismo día</th><th style={{ ...th, textAlign: "right" }}>CSAT</th></tr></thead>
              <tbody>
                {DATA.paises.map((p, i) => (
                  <tr key={p.pais}>
                    <td style={{ ...td, color: "var(--muted)" }}>{i + 1}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{p.pais}</td>
                    <td style={{ ...td, textAlign: "right" }}>{p.conversaciones.toLocaleString("es-CO")}</td>
                    <td style={{ ...td, textAlign: "right" }}><Pill value={p.pct_mismo_dia} goodMin={55} warnMin={40} format={(v) => `${v}%`} /></td>
                    <td style={{ ...td, textAlign: "right" }}><Pill value={p.csat} goodMin={3.4} warnMin={2.8} format={(v) => v.toFixed(2)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Equipos y temas */}
        <Section icon="🗂️" title="Equipos y temas" note="A qué se dedica el volumen de soporte">
          <div style={grid2}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Conversaciones por equipo (top 8 de 23)</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA.teams} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="team" width={150} tick={{ fontSize: 10.5, fill: "var(--fg)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number, n: unknown, p: any) => [`${v.toLocaleString("es-CO")} · CSAT ${p.payload.csat}`, "Conversaciones"]) as never} />
                  <Bar dataKey="conversaciones" fill={ACCENT} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Temas más frecuentes (top 10)</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA.topics} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="topic" width={130} tick={{ fontSize: 10.5, fill: "var(--fg)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [v.toLocaleString("es-CO"), "Menciones"]) as never} />
                  <Bar dataKey="count" fill={ACCENT_PURPLE} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>

        {/* Agentes */}
        <Section icon="🧑‍💻" title="Agentes" note="Top 12 de 29 agentes activos, por volumen">
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead><tr><th style={th}>#</th><th style={th}>Agente</th><th style={{ ...th, textAlign: "right" }}>Conversaciones</th><th style={{ ...th, textAlign: "right" }}>CSAT</th><th style={{ ...th, textAlign: "right" }}>Horas hábiles</th><th style={{ ...th, textAlign: "right" }}>Tasa calif.</th></tr></thead>
              <tbody>
                {DATA.agentes.map((a, i) => (
                  <tr key={a.agente}>
                    <td style={{ ...td, color: "var(--muted)" }}>{i + 1}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{a.agente}</td>
                    <td style={{ ...td, textAlign: "right" }}>{a.conversaciones.toLocaleString("es-CO")}</td>
                    <td style={{ ...td, textAlign: "right" }}><Pill value={a.csat} goodMin={3.4} warnMin={2.8} format={(v) => v.toFixed(2)} /></td>
                    <td style={{ ...td, textAlign: "right" }}>{a.horas}h</td>
                    <td style={{ ...td, textAlign: "right" }}>{a.tasa}%</td>
                  </tr>
                ))}
                <tr><td style={td}></td><td style={{ ...td, color: "var(--muted)" }}>+ 18 agentes más</td><td style={{ ...td, textAlign: "right", color: "var(--muted)" }}>1,897</td><td style={td}></td><td style={td}></td><td style={td}></td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* CSAT distribution */}
        <Section icon="⭐" title="Satisfacción del cliente" note="Distribución de calificaciones 1–5, marcadamente polarizada">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DATA.csatDist} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="rating" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [`${v.toLocaleString("es-CO")} (${(v / 5224 * 100).toFixed(0)}%)`, "Calificaciones"]) as never} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {DATA.csatDist.map((d) => <Cell key={d.rating} fill={csatColor(d.rating)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
            Solo el <strong style={{ color: "var(--fg)" }}>16.5%</strong> de las conversaciones recibe calificación (5,224 de 31,618), así que el CSAT promedio de <strong style={{ color: "var(--fg)" }}>3.29/5</strong> describe a los clientes que sí califican, no a la totalidad de la base atendida.
          </div>
        </Section>

        {/* ═══ PART 2: Text mining ═══ */}
        <div style={{ margin: "40px 0 20px", paddingTop: 24, borderTop: "2px solid var(--border)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT_PURPLE, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Minería de texto · Encuesta CSAT (Intercom)
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Qué reclaman y qué agradecen los usuarios — Colombia
          </h2>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
            <div><strong style={{ color: "var(--fg)" }}>Período:</strong> 1 abr – 24 ago 2026 (5 meses)</div>
            <div><strong style={{ color: "var(--fg)" }}>Base:</strong> 7,507 comentarios · sin muestreo</div>
            <div><strong style={{ color: "var(--fg)" }}>Área:</strong> Growth Ops — Analítica de Datos</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", marginTop: 12, maxWidth: 760 }}>
            Este análisis procesa los comentarios de texto de la encuesta de calificación, solo para Colombia y con un período más amplio (abr–ago) que el panel operativo de arriba. Por eso el rating promedio aquí (2.40/5) no coincide con el CSAT del panel operativo (3.29/5): son universos distintos dentro del mismo canal.
          </div>
        </div>

        <Section icon="📊" title="Composición general">
          <div style={kpiGrid}>
            <Kpi label="Rating promedio" value="2.40/5" sub="Sin mejora en 5 meses (±0.14)" tone="critical" />
            <Kpi label="Detractores (1–2★)" value="60.9%" sub="Promotores (4–5★): 29.7%" />
            <Kpi label="Reclamo de fondo" value="33.2%" sub="de negativos: logística/pagos, no atención" />
            <Kpi label="Correl. 1er contacto ↔ rating" value="−0.014" sub="indistinguible de cero" />
            <Kpi label="Palabras por comentario" value="15.5 vs 4.7" sub="detractor vs. promotor" />
            <Kpi label="Brecha entre equipos" value="1.7 pts" sub="Devol. Inj. 1.41 vs. Anulaciones 3.09" />
          </div>
          <div style={{ marginTop: 14, background: "linear-gradient(180deg, var(--card) 0%, var(--bg) 100%)", border: "1px solid var(--border)", borderLeft: `3px solid ${ACCENT_PURPLE}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: ACCENT_PURPLE, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Insight principal</div>
            <p style={{ fontSize: 13, color: "var(--fg)", margin: 0, lineHeight: 1.6 }}>
              El sistema de calificación mide la <strong>experiencia global del dropshipper con Dropi</strong>, no la calidad de la atención del agente. Un tercio de las calificaciones bajas describe fallas de logística, pagos y proveedores que el agente no puede resolver desde el chat. Evaluar al área de SAC con este indicador le atribuye responsabilidades que pertenecen a otros procesos, y explica por qué el promedio permanece estancado pese a las acciones sobre el canal.
            </p>
          </div>
        </Section>

        <Section icon="📈" title="Composición y evolución" note="7,507 calificaciones con comentario">
          <div style={grid2}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Distribución de calificaciones (48.1% son 1★)</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={TM.dist} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="rating" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number, n: unknown, p: any) => [`${v.toLocaleString("es-CO")} (${p.payload.pct}%)`, "Comentarios"]) as never} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {TM.dist.map((d) => <Cell key={d.rating} fill={csatColor(d.rating)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Rating promedio mensual (oscilación máx. 0.14 pts)</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={TM.monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} domain={[0, 5]} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [v.toFixed(2), "Rating"]) as never} />
                  <Line type="monotone" dataKey="rating" stroke={CRITICAL} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: 14, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#7F1D1D" }}>
            <strong>Cinco meses sin movimiento:</strong> el promedio va de 2.40 en abril a 2.31 en agosto. No hay tendencia de mejora ni de deterioro — el indicador está plano.
          </div>
        </Section>

        <Section icon="😞" title="Qué dicen los detractores" note="Comentarios 1–2★, n=4,569 — vocabulario concreto y transaccional">
          <TermRows data={TM.terminosDetractores} color={CRITICAL} />
        </Section>

        <Section icon="🩹" title="Dolores identificados" note="Comentarios de 1 a 3★, n=5,280 · un comentario puede tener varios">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TM.dolores} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={210} tick={{ fontSize: 10.5, fill: "var(--fg)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle()} formatter={((v: number, n: unknown, p: any) => [`${v.toLocaleString("es-CO")} (${p.payload.pct}%)`, "Menciones"]) as never} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {TM.dolores.map((d, i) => <Cell key={d.label} fill={i === 0 ? CRITICAL : SERIOUS} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={grid2}>
            <div style={{ marginTop: 14, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "var(--fg)" }}>
              <strong>«No resuelven» y «no responden» piden acciones opuestas:</strong> «no responden» (4.9%) es capacidad — nadie contestó. «No resuelven» (17.3%) es atribuciones — el agente contestó pero no tiene facultades. Tres a uno a favor del segundo: el cuello de botella no es disponibilidad, sino margen de decisión.
            </div>
            <div style={{ marginTop: 14, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "var(--muted)" }}>
              <strong style={{ color: "var(--fg)" }}>Nota sobre «Cierre prematuro» (4.4%):</strong> informes anteriores estimaron este dolor en 7% sobre una muestra reducida. La cifra correcta sobre la base completa es 4.4% (234 casos).
            </div>
          </div>
        </Section>

        <Section icon="🙌" title="Qué dicen los promotores" note="Comentarios 4–5★, n=2,229">
          <div style={grid2}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Términos más frecuentes (41% es solo agradecimiento)</div>
              <TermRows data={TM.terminosPromotores} color={GOOD} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Extensión promedio del comentario</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={[{ label: "Detractores (1–2★)", value: 15.5 }, { label: "Promotores (4–5★)", value: 4.7 }]} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 10.5, fill: "var(--fg)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle()} formatter={((v: number) => [`${v} palabras`, "Promedio"]) as never} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    <Cell fill={CRITICAL} /><Cell fill={GOOD} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: 14, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#14532D" }}>
            <strong>La asimetría de información es el mayor problema de medición:</strong> el 57.6% de los comentarios positivos tiene dos palabras o menos, frente al 8.2% de los negativos. Hay un catálogo detallado de fallas y casi ningún registro de aciertos.
          </div>
          <div style={{ marginTop: 10, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#1E40AF" }}>
            <strong>Recomendación de instrumentación:</strong> condicionar la pregunta abierta al valor de la calificación — ante un 4★ o 5★, preguntar «¿qué fue lo que más te sirvió?». Cambio de configuración en Intercom, sin costo de desarrollo.
          </div>
        </Section>

        <Section icon="🔬" title="Los indicadores operativos no predicen la satisfacción" note="% resuelto 1er contacto y % reabierta, por calificación — ambas se mantienen planas entre 1★ y 5★">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TM.metricasPorRating} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="rating" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} domain={[0, 70]} />
              <Tooltip contentStyle={tooltipStyle()} />
              <Bar dataKey="primerContacto" name="% resuelto 1er contacto" fill={ACCENT} radius={[4, 4, 0, 0]} />
              <Bar dataKey="reabierta" name="% conversación reabierta" fill={SERIOUS} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: ACCENT, display: "inline-block" }} />% resuelto 1er contacto</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: SERIOUS, display: "inline-block" }} />% conversación reabierta</span>
          </div>
          <div style={{ marginTop: 14, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#7F1D1D" }}>
            <strong>«Resuelto al primer contacto» no mide lo que se cree que mide:</strong> la correlación con la calificación es de −0.014 sobre 7,507 registros. Los casos con 5★ registran <em>menor</em> resolución al primer contacto (53.0%) que los de 1★ (56.1%).
          </div>
        </Section>

        <Section icon="👥" title="Desempeño por equipo" note="Equipos con al menos 80 comentarios · línea de referencia = promedio general (2.40)">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={TM.equipos} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="team" width={190} tick={{ fontSize: 10.5, fill: "var(--fg)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle()} formatter={((v: number, n: unknown, p: any) => [`${v.toFixed(2)} (n=${p.payload.n})`, "Rating"]) as never} />
              <Bar dataKey="rating" radius={[0, 4, 4, 0]}>
                {TM.equipos.map((d) => <Cell key={d.team} fill={d.rating >= TM.avgRating ? GOOD : CRITICAL} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={grid2}>
            <div style={{ marginTop: 14, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "var(--fg)" }}>
              <strong>El ranking ordena por dependencia externa, no por calidad del agente:</strong> los cuatro peor evaluados —Devoluciones Injustificadas, Pruebas de Entrega, Retiros y Otras consultas financiero— comparten un caso que depende de un tercero. Antes de intervenir en capacitación, verificar qué proporción de cada cola es resoluble por el agente.
            </div>
            <div style={{ marginTop: 14, background: "#FEF2F2", border: "1px solid #FECACA", borderLeft: `3px solid ${CRITICAL}`, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: CRITICAL, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Caso crítico — Devoluciones Injustificadas</div>
              <div style={{ fontSize: 12.5, color: "#7F1D1D" }}>Con 672 comentarios y 89.4% de detractores, es el peor resultado de la operación. El usuario asume un costo por una falla que no cometió. <strong>Es una decisión de política comercial, no de servicio al cliente.</strong></div>
            </div>
          </div>
        </Section>

        <Section icon="⚠️" title="Limitaciones" note="Restricciones que deben acompañar cualquier decisión tomada sobre este análisis">
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TM.limitaciones.map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < TM.limitaciones.length - 1 ? "1px solid var(--border)" : "none", fontSize: 12.5, color: "var(--fg)", lineHeight: 1.55 }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, color: "var(--muted)" }}>{i + 1}</span>
                <span>{txt}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section icon="🚀" title="Siguientes pasos" note="Acciones recomendadas por Growth Ops">
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead><tr><th style={th}>Acción</th><th style={th}>Objetivo</th><th style={th}>Responsable sugerido</th></tr></thead>
              <tbody>
                {TM.recomendaciones.map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.accion}</td>
                    <td style={{ ...td, color: "var(--muted)" }}>{r.objetivo}</td>
                    <td style={td}>{r.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>
          Fuentes: exportación de Intercom (dashboard_final.pbix) · Informe de minería de texto sobre comentarios CSAT — Colombia, Growth Ops (Informe_Dolores_SAC_Colombia_2026).{" "}
          <a href="/panel-soporte-dropi.html" target="_blank" rel="noreferrer" style={{ color: "var(--dropi)" }}>Ver HTML original ↗</a>
        </div>
      </main>

      <HubFooter />
    </div>
  );
}

function TermRows({ data, color }: { data: { term: string; count: number }[]; color: string }) {
  const maxV = Math.max(...data.map((d) => d.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {data.map((d) => (
        <div key={d.term} style={{ display: "grid", gridTemplateColumns: "100px 1fr 44px", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, color: "var(--fg)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.term}</div>
          <div style={{ height: 12, background: "var(--bg)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(d.count / maxV) * 100}%`, background: color, borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "right" }}>{d.count.toLocaleString("es-CO")}</div>
        </div>
      ))}
    </div>
  );
}
