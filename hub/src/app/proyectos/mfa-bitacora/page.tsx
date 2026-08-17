"use client";

import { useState } from "react";
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

const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.6,
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
const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const labelStyle = { fontSize: 10, fill: "#6B7280", fontWeight: 700 };

const TABS = ["Resumen", "S1-2 · Jul 6-20", "S3-4 · Jul 21 - Ago 5", "Comparativo", "Hallazgos", "Próximos Pasos"];

const TRACKED_EVENTS = [
  "OTP_2fa",
  "Codigo autenticador_2fa",
  "2FA activada_2fa",
  "Configurar nuevamente 2fa",
  "Correo electronico_2fa",
  "Mensaje de texto_2fa",
];

const MISSING_EVENTS = [
  "mfa_login_attempt",
  "mfa_setup_screen_shown",
  "mfa_method_selected",
  "mfa_qr_scanned",
  "mfa_setup_abandoned",
  "sensitive_action_attempted",
  "mfa_modal_shown_sensitive",
  "sensitive_action_completed",
  "mfa_recovery_code_sent",
  "mfa_recovery_completed",
];

/* ── S1-2 data (Jul 6-20) ── */
const RAW_DATA = [
  { evento: "OTP_2fa", usuarios: 766, pctBase: "1.40%", eventos: 1273, tendencia: "+5.33%", avgUser: "1.66" },
  { evento: "Codigo autenticador_2fa", usuarios: 295, pctBase: "0.54%", eventos: 665, tendencia: "+3.87%", avgUser: "2.25" },
  { evento: "2FA activada_2fa", usuarios: 3555, pctBase: "6.49%", eventos: 10818, tendencia: "+5.33%", avgUser: "3.04" },
  { evento: "Configurar nuevamente 2fa", usuarios: 1446, pctBase: "2.64%", eventos: 2944, tendencia: "-4.66%", avgUser: "2.04" },
  { evento: "Correo electronico_2fa", usuarios: 16, pctBase: "0.03%", eventos: 18, tendencia: "-91%", avgUser: "1.13" },
  { evento: "Mensaje de texto_2fa", usuarios: 15, pctBase: "0.03%", eventos: 17, tendencia: "-91%", avgUser: "1.13" },
];

const EVENT_CHART_DATA = [
  { name: "2FA activada", eventos: 10818, fill: "var(--dropi)" },
  { name: "Configurar nuevam.", eventos: 2944, fill: "var(--warning)" },
  { name: "OTP", eventos: 1273, fill: "var(--info)" },
  { name: "Cod. autenticador", eventos: 665, fill: "var(--success)" },
  { name: "Correo electrónico", eventos: 18, fill: "var(--danger)" },
  { name: "Mensaje de texto", eventos: 17, fill: "var(--muted)" },
];

const METHODS_CHART = [
  { name: "OTP", usuarios: 766, eventos: 1273 },
  { name: "Autenticador", usuarios: 295, eventos: 665 },
  { name: "2FA Total", usuarios: 3555, eventos: 10818 },
];

const RECOVERY_FUNNEL = [
  { step: "Recovery iniciado", value: 1446, pct: "100%", drop: "" },
  { step: "Correo electrónico", value: 16, pct: "1.1%", drop: "-98.9%" },
  { step: "Mensaje de texto", value: 15, pct: "1.0%", drop: "-6.3%" },
];

const RECOVERY_DETAIL = [
  { step: "1. Recovery iniciado", value: 1446, pct: "100%", status: "tracked" },
  { step: "2. Código enviado (email)", value: 16, pct: "1.1%", status: "tracked" },
  { step: "3. Código enviado (SMS)", value: 15, pct: "1.0%", status: "tracked" },
  { step: "4. Código verificado", value: null as number | null, pct: "?", status: "missing" },
  { step: "5. Recovery completado", value: null as number | null, pct: "?", status: "missing" },
];

/* ── S3-4 data (Jul 21 - Ago 5) ── */
const RAW_DATA_S34 = [
  { evento: "2FA activada_2fa", usuarios: 3814, pctBase: "6.69%", eventos: 11542, tendencia: "+6.7%", avgUser: "3.03" },
  { evento: "Configurar nuevamente 2fa", usuarios: 1931, pctBase: "3.39%", eventos: 5099, tendencia: "+44.0%", avgUser: "2.64" },
  { evento: "OTP_2fa", usuarios: 828, pctBase: "1.45%", eventos: 1392, tendencia: "+9.3%", avgUser: "1.68" },
  { evento: "Codigo autenticador_2fa", usuarios: 343, pctBase: "0.60%", eventos: 1077, tendencia: "+62.0%", avgUser: "3.14" },
  { evento: "Correo electronico_2fa", usuarios: 36, pctBase: "0.06%", eventos: 49, tendencia: "+113%", avgUser: "1.36" },
  { evento: "Mensaje de texto_2fa", usuarios: 23, pctBase: "0.04%", eventos: 27, tendencia: "+22.7%", avgUser: "1.17" },
];

const EVENT_CHART_DATA_S34 = [
  { name: "2FA activada", eventos: 11542, fill: "var(--dropi)" },
  { name: "Configurar nuevam.", eventos: 5099, fill: "var(--warning)" },
  { name: "OTP", eventos: 1392, fill: "var(--info)" },
  { name: "Cod. autenticador", eventos: 1077, fill: "var(--success)" },
  { name: "Correo electrónico", eventos: 49, fill: "var(--danger)" },
  { name: "Mensaje de texto", eventos: 27, fill: "var(--muted)" },
];

const METHODS_CHART_S34 = [
  { name: "OTP", usuarios: 828, eventos: 1392 },
  { name: "Autenticador", usuarios: 343, eventos: 1077 },
  { name: "2FA Total", usuarios: 3814, eventos: 11542 },
];

const RECOVERY_FUNNEL_S34 = [
  { step: "Recovery iniciado", value: 1931, pct: "100%", drop: "" },
  { step: "Correo electrónico", value: 36, pct: "1.9%", drop: "-98.1%" },
  { step: "Mensaje de texto", value: 23, pct: "1.2%", drop: "-36.1%" },
];

const RECOVERY_DETAIL_S34 = [
  { step: "1. Recovery iniciado", value: 1931, pct: "100%", status: "tracked" },
  { step: "2. Código enviado (email)", value: 36, pct: "1.9%", status: "tracked" },
  { step: "3. Código enviado (SMS)", value: 23, pct: "1.2%", status: "tracked" },
  { step: "4. Código verificado", value: null as number | null, pct: "?", status: "missing" },
  { step: "5. Recovery completado", value: null as number | null, pct: "?", status: "missing" },
];

/* ── Comparativo data ── */
const COMPARATIVO_DATA = [
  { metric: "Base usuarios activos", s12: "54,790", s34: "56,984", delta: "+4.0%", severity: "neutral" as const },
  { metric: "Cobertura MFA", s12: "6.49%", s34: "6.7%", delta: "+0.21pp", severity: "warning" as const },
  { metric: "2FA Activada (usuarios)", s12: "3,555", s34: "3,814", delta: "+7.3%", severity: "success" as const },
  { metric: "Recovery iniciado", s12: "1,446", s34: "1,931", delta: "+33.5%", severity: "danger" as const },
  { metric: "Recovery / 2FA ratio", s12: "40.7%", s34: "50.6%", delta: "+9.9pp", severity: "danger" as const },
  { metric: "OTP (usuarios)", s12: "766", s34: "828", delta: "+8.1%", severity: "success" as const },
  { metric: "Autenticador (usuarios)", s12: "295", s34: "343", delta: "+16.3%", severity: "success" as const },
  { metric: "Contactos recovery", s12: "31", s34: "59", delta: "+90.3%", severity: "warning" as const },
  { metric: "OTP / Auth ratio", s12: "2.6:1", s34: "2.41:1", delta: "Mejora", severity: "success" as const },
  { metric: "Recurrencia", s12: "204%", s34: "202.7%", delta: "-0.6%", severity: "neutral" as const },
  { metric: "Recovery completion", s12: "2.1%", s34: "3.1%", delta: "+1.0pp", severity: "warning" as const },
];

const MAPPING_TABLE = [
  { userPilot: "OTP_2fa", tars: "mfa_method_selected (OTP)", status: "parcial" },
  { userPilot: "Codigo autenticador_2fa", tars: "mfa_method_selected (Auth)", status: "parcial" },
  { userPilot: "2FA activada_2fa", tars: "mfa_setup_completed", status: "parcial" },
  { userPilot: "Configurar nuevamente 2fa", tars: "mfa_recovery_initiated", status: "parcial" },
  { userPilot: "Correo electronico_2fa", tars: "mfa_recovery_code_sent (email)", status: "parcial" },
  { userPilot: "Mensaje de texto_2fa", tars: "mfa_recovery_code_sent (SMS)", status: "parcial" },
  { userPilot: "—", tars: "mfa_login_attempt", status: "sin tracking" },
  { userPilot: "—", tars: "mfa_setup_screen_shown", status: "sin tracking" },
  { userPilot: "—", tars: "mfa_qr_scanned", status: "sin tracking" },
  { userPilot: "—", tars: "mfa_setup_abandoned", status: "sin tracking" },
  { userPilot: "—", tars: "sensitive_action_attempted", status: "sin tracking" },
  { userPilot: "—", tars: "mfa_modal_shown_sensitive", status: "sin tracking" },
  { userPilot: "—", tars: "sensitive_action_completed", status: "sin tracking" },
  { userPilot: "—", tars: "mfa_recovery_completed", status: "sin tracking" },
];

const INSIGHTS = [
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Crisis de recovery: ratio sube a 50.6% (3.4x sobre umbral)",
    body: "El ratio recovery/2FA pasó de 40.7% (S1-2) a 50.6% (S3-4), 3.4 veces por encima de la meta de <15%. 1,931 usuarios necesitaron recuperar acceso sobre 3,814 con 2FA activa. El crecimiento de recovery (+33.5%) duplica al de adopción (+7.3%), lo que indica que el problema empeora en proporción. Si no se interviene, podría convertirse en el principal blocker de adopción.",
  },
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Cobertura estancada: 6.49% → 6.7% en 2 semanas",
    body: "La cobertura MFA avanzó solo 0.21 puntos porcentuales en 2 semanas (6.49% → 6.7%). A este ritmo, alcanzar 95% tomaría más de 3 años. El gap con la meta es de 88.3pp. Sin enforcement, la adopción orgánica es insuficiente — se necesitan ~8,000 activaciones/semana vs. las ~130 actuales.",
  },
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Agujero negro de tracking: Grupo B sin visibilidad",
    body: "De los 16 eventos del modelo TARS, solo 6 están instrumentados (37.5%). Todo el Grupo B (login MFA, setup screen, QR scanned, setup abandoned, sensitive actions) tiene 0 eventos. No podemos medir fricción en el flujo de setup ni en las acciones sensibles post-login. Cualquier decisión sobre UX de MFA se basa en menos del 40% de la foto completa.",
  },
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Caída del 98% en canales de recovery (acumulado)",
    body: "En S3-4: de 1,931 que inician recovery, solo 36 llegan a email y 23 a SMS. La caída del 98.1% entre paso 1 y paso 2 se mantiene desde S1-2. Los últimos 2 pasos del embudo (código verificado y recovery completado) siguen sin tracking. Sin embargo, los contactos absolutos crecieron 90.3% (31 → 59), lo que sugiere que el volumen de recovery está escalando con la adopción.",
  },
  {
    severity: "warning" as const,
    icon: "🟡",
    title: "Autenticador crece 2x más rápido que OTP",
    body: "Autenticador creció +62.0% vs OTP +9.3% en S3-4. El ratio OTP/Auth mejoró de 2.6:1 a 2.41:1. La recurrencia de Autenticador (3.14 eventos/usuario) supera ampliamente a OTP (1.68). Si la tendencia se mantiene, Autenticador podría alcanzar paridad con OTP en ~4 meses. Esto abre la puerta a evaluar deprecación progresiva de OTP a favor de métodos más seguros.",
  },
  {
    severity: "success" as const,
    icon: "🟢",
    title: "2FA con tendencia positiva acelerada",
    body: "2FA activada crece +6.7% en S3-4 (vs +5.33% en S1-2), acelerando la tendencia. 3,814 usuarios activos con promedio de 3.03 eventos/usuario. La adopción avanza desde una base baja (6.7% de 56,984), pero la aceleración es una señal positiva que sugiere adopción orgánica creciente.",
  },
  {
    severity: "info" as const,
    icon: "🔵",
    title: "Proyección lineal inalcanzable sin enforcement",
    body: "Con 6.7% actual y meta de 95%, se necesitan ~8,000 activaciones nuevas por semana. El crecimiento orgánico actual no supera las 260 activaciones semanales (mejora vs S1-2 pero aún insuficiente). Sin enforcement (MFA obligatorio en login o en acciones sensibles), la meta es matemáticamente inalcanzable. El gap es de 88.3 puntos porcentuales.",
  },
];

const NEXT_STEPS = {
  urgente: [
    {
      title: "Implementar los 10 eventos faltantes del Grupo B",
      body: "Instrumentar mfa_login_attempt, mfa_setup_screen_shown, mfa_method_selected, mfa_qr_scanned, mfa_setup_abandoned, sensitive_action_attempted, mfa_modal_shown_sensitive, sensitive_action_completed, mfa_recovery_code_sent y mfa_recovery_completed. Sin estos eventos, toda decisión sobre flujo MFA se basa en menos del 40% de la información.",
    },
    {
      title: "Diagnosticar crisis de recovery: ratio 50.6%",
      body: "El ratio recovery/2FA subió de 40.7% a 50.6% en 2 semanas — 3.4x sobre el umbral de <15%. Determinar si la caída del 98% entre recovery iniciado (1,931) y contactos (59) se debe a abandono, pasos no trackeados, o blockers técnicos. Priorizar: (1) revisar logs de backend entre “Configurar nuevamente” y envío de código, (2) validar que el flujo funciona end-to-end, (3) implementar tracking de los pasos faltantes.",
    },
    {
      title: "Confirmar estado real del enforcement de MFA",
      body: "Los datos muestran que solo 6.7% de la base tiene 2FA activa. Eso es inconsistente con un MFA obligatorio. Confirmar con el equipo técnico: ¿en qué flujos se exige (login, acciones sensibles, ambos)? ¿Existe algún bypass? ¿Cuál es el plan y timeline de enforcement?",
    },
  ],
  corto: [
    {
      title: "Diseñar pantalla de códigos de respaldo",
      body: "Al activar 2FA, generar códigos de recovery descargables/imprimibles. Si el ratio recovery/2FA baja de 50.6% a <15%, se confirma que la fricción es por pérdida de acceso al método. Esto ataca directamente la crisis de recovery identificada en S3-4.",
    },
    {
      title: "Implementar micro-surveys post-activación de 2FA",
      body: "Encuesta in-app (1-2 preguntas) tras activar 2FA para entender: facilidad percibida del proceso, método preferido y por qué, y si encontraron algún problema. Esto complementa los datos cuantitativos con contexto cualitativo.",
    },
    {
      title: "Evaluar deprecación progresiva de OTP",
      body: "Con Autenticador creciendo 2x más rápido que OTP (+62% vs +9.3%) y mostrando mayor recurrencia (3.14 vs 1.68 eventos/usuario), evaluar si OTP debe dejar de ser el método por defecto. Analizar si presentar Autenticador primero en el flujo de setup cambia las proporciones.",
    },
  ],
  mediano: [
    {
      title: "Dashboard BI de retención post-MFA",
      body: "Crear un dashboard que cruce activación de 2FA con retención de usuarios a 30/60/90 días. Responder: ¿los usuarios que activan 2FA retienen más que los que no? ¿El método elegido (OTP vs Autenticador) afecta la retención? Incluir tracking del ratio recovery/2FA por cohorte.",
    },
    {
      title: "Planificar rollout de MFA forzado escalonado",
      body: "Diseñar un plan de enforcement gradual: primero usuarios de alto valor, luego usuarios nuevos al registrarse, finalmente base existente. Cada cohorte debe tener métricas de conversión, abandono, recovery y soporte para calibrar antes de escalar. Prerequisito: resolver crisis de recovery antes de forzar.",
    },
  ],
};

export default function MFABitacoraPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/celula/backoffice" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          &larr; Backoffice
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>MFA Obligatorio &mdash; Bit&aacute;cora UX</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px" }}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
            MFA Obligatorio &mdash; Bit&aacute;cora UX
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
            Jul 6 al Ago 5, 2026 &middot; Actualizado: 06/08/2026
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <span style={tag("var(--fg)", "#F3F4F6")}>Usuarios activos base: 56,984</span>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>2FA Activada: 3,814 (6.7%)</span>
          <span style={tag("var(--danger)", "var(--danger-tint)")}>Eventos trackeados: 6/16</span>
          <span style={tag("var(--info)", "var(--info-tint)")}>North Star (8 sem): 95%</span>
        </div>

        <div style={{
          display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--border)",
          paddingBottom: 0, overflowX: "auto",
        }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: activeTab === i ? 700 : 500,
                color: activeTab === i ? "var(--dropi)" : "var(--muted)",
                background: "transparent", border: "none", cursor: "pointer",
                borderBottom: activeTab === i ? "2px solid var(--dropi)" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 0 && <PanelResumen />}
        {activeTab === 1 && <PanelSprint />}
        {activeTab === 2 && <PanelS34 />}
        {activeTab === 3 && <PanelComparativo />}
        {activeTab === 4 && <PanelHallazgos />}
        {activeTab === 5 && <PanelProximosPasos />}
      </div>

      <footer style={{
        textAlign: "center", padding: "32px 24px 40px", fontSize: 12,
        color: "var(--muted)", borderTop: "1px solid var(--border)",
      }}>
        Backoffice &middot; MFA Obligatorio &middot; Bit&aacute;cora UX &middot; Ago 6, 2026 &middot; Autor: Michel Pino
      </footer>
    </div>
  );
}

/* ── Resumen ── */
function PanelResumen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, var(--danger) 0%, #DC2626 100%)",
        borderRadius: 14, padding: "18px 22px", color: "#fff",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Alerta cr&iacute;tica: crisis de recovery + cobertura estancada</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
          Recovery/2FA ratio subi&oacute; a <strong>50.6%</strong> (3.4x sobre umbral de &lt;15%). La cobertura MFA avanz&oacute; solo 0.21pp en 2 semanas (6.49% &rarr; 6.7%). Solo 6 de 16 eventos trackeados (37.5%). Las decisiones sobre UX de MFA se basan en menos del 40% de la informaci&oacute;n disponible.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <KPICard label="Cobertura MFA" value="6.7%" sub="3,814 / 56,984 usuarios" color="var(--dropi)" bg="var(--dropi-light)" />
        <KPICard label="2FA Activada" value="3,814" sub={"↑ 7.3% vs S1-2"} color="var(--success)" bg="var(--success-tint)" />
        <KPICard label="Recovery iniciado" value="1,931" sub={"↑ 33.5% vs S1-2"} color="var(--warning)" bg="var(--warning-tint)" />
        <KPICard label="Contactos recovery" value="59" sub={"↑ 90.3% vs S1-2"} color="var(--danger)" bg="var(--danger-tint)" />
      </div>

      <div style={card}>
        <div style={sectionTitle}>North Star: &ge;95% cobertura MFA en 8 semanas</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Actual: 6.7% &middot; Meta: 95% &middot; Gap: 88.3pp &middot; Ritmo necesario: ~8,000 activaciones/semana
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: 8, height: 28, position: "relative", overflow: "hidden" }}>
          <div style={{
            background: "var(--dropi)", height: "100%", width: "6.7%",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#fff", minWidth: 40,
          }}>
            6.7%
          </div>
          <div style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            fontSize: 11, fontWeight: 600, color: "var(--muted)",
          }}>
            Meta 95%
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>M&eacute;todos de verificaci&oacute;n: comparativa (S3-4)</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          OTP: 828 usuarios / 1,392 eventos &middot; Autenticador: 343 usuarios / 1,077 eventos &middot; 2FA total: 3,814 / 11,542
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={METHODS_CHART_S34} layout="horizontal" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" tick={axisTick} />
              <YAxis tick={axisTick} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="usuarios" fill="var(--info)" name="Usuarios" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="usuarios" position="top" style={labelStyle} />
              </Bar>
              <Bar dataKey="eventos" fill="var(--dropi)" name="Eventos" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="eventos" position="top" style={labelStyle} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Embudo de recovery (S3-4)</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Recovery iniciado 1,931 &rarr; Email 36 &rarr; SMS 23. Ca&iacute;da del 98.1% entre paso 1 y paso 2.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECOVERY_FUNNEL_S34.map((r) => (
            <div key={r.step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 160, fontSize: 13, color: "var(--fg)", fontWeight: 500, flexShrink: 0 }}>{r.step}</div>
              <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 6, height: 24, position: "relative", overflow: "hidden" }}>
                <div style={{
                  background: r.value === 1931 ? "var(--dropi)" : "var(--danger)",
                  height: "100%",
                  width: `${Math.max((r.value / 1931) * 100, 3)}%`,
                  borderRadius: 6,
                  display: "flex", alignItems: "center", paddingLeft: 8,
                  fontSize: 10, fontWeight: 700, color: "#fff",
                }}>
                  {r.value.toLocaleString()}
                </div>
              </div>
              <div style={{ width: 60, fontSize: 12, color: "var(--muted)", textAlign: "right" }}>{r.pct}</div>
              {r.drop && <div style={{ width: 60, fontSize: 11, color: "var(--danger)", fontWeight: 600, textAlign: "right" }}>{r.drop}</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Timeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%", background: "var(--danger)",
              marginTop: 4, flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Jul 21 - Ago 5, 2026 (S3-4)</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                Crisis de recovery: ratio sube a 50.6% (3.4x sobre umbral). Cobertura estancada en 6.7% (+0.21pp). Autenticador crece 2x m&aacute;s r&aacute;pido que OTP. Contactos de recovery crecen 90.3% pero embudo sigue colapsando al 98%.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%", background: "var(--dropi)",
              marginTop: 4, flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Jul 6 - Jul 20, 2026 (S1-2)</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                Primera evaluaci&oacute;n de la bit&aacute;cora MFA. Se identificaron 6 eventos activos de 16 del modelo TARS. Cobertura MFA en 6.49% con tendencia positiva pero ritmo insuficiente para alcanzar meta de 95% en 8 semanas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div style={{ ...card, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{sub}</div>
    </div>
  );
}

/* ── S1-2 Sprint Panel (unchanged) ── */
function PanelSprint() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={card}>
        <div style={sectionTitle}>Cobertura de tracking: 6 de 16 eventos activos</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Solo los eventos del Grupo A (UserPilot) est&aacute;n instrumentados. Todo el Grupo B (TARS) est&aacute; sin tracking.
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>Eventos activos (Grupo A)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TRACKED_EVENTS.map((e) => (
              <div key={e} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
                {e}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)", marginBottom: 8 }}>Eventos faltantes (Grupo B)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MISSING_EVENTS.map((e) => (
              <div key={e} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--danger)", display: "inline-block" }} />
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Data cruda: 6 eventos activos (S1-2)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Evento</th>
                <th style={thR}>Usuarios</th>
                <th style={thR}>% Base</th>
                <th style={thR}>Eventos</th>
                <th style={thR}>Tendencia</th>
                <th style={thR}>Avg/User</th>
              </tr>
            </thead>
            <tbody>
              {RAW_DATA.map((r) => (
                <tr key={r.evento}>
                  <td style={{ ...tdStyle, fontWeight: 500, fontSize: 12 }}>{r.evento}</td>
                  <td style={tdR}>{r.usuarios.toLocaleString()}</td>
                  <td style={tdR}>{r.pctBase}</td>
                  <td style={tdR}>{r.eventos.toLocaleString()}</td>
                  <td style={{
                    ...tdR,
                    color: r.tendencia.startsWith("+") ? "var(--success)" : "var(--danger)",
                    fontWeight: 600,
                  }}>{r.tendencia}</td>
                  <td style={tdR}>{r.avgUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Volumen de eventos por tipo (S1-2)</div>
        <div style={{ height: 260, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EVENT_CHART_DATA} layout="vertical" margin={{ top: 5, right: 40, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis type="number" tick={axisTick} />
              <YAxis dataKey="name" type="category" tick={axisTick} width={110} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="eventos" radius={[0, 4, 4, 0]}>
                {EVENT_CHART_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
                <LabelList dataKey="eventos" position="right" style={labelStyle} formatter={(v) => typeof v === "number" ? v.toLocaleString() : String(v)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Embudo de recovery: detalle por paso (S1-2)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Paso</th>
                <th style={thR}>Valor</th>
                <th style={thR}>% del total</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {RECOVERY_DETAIL.map((r) => (
                <tr key={r.step}>
                  <td style={{ ...tdStyle, fontWeight: 500, fontSize: 12 }}>{r.step}</td>
                  <td style={tdR}>{r.value !== null ? r.value.toLocaleString() : "—"}</td>
                  <td style={tdR}>{r.pct}</td>
                  <td style={tdStyle}>
                    {r.status === "tracked" ? (
                      <span style={tag("var(--success)", "var(--success-tint)")}>Trackeado</span>
                    ) : (
                      <span style={tag("var(--danger)", "var(--danger-tint)")}>Sin tracking</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>M&eacute;tricas derivadas (S1-2)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 10 }}>
          <DerivedMetric label="Recovery / 2FA ratio" value="40.7%" meta="Meta: <15%" color="var(--danger)" />
          <DerivedMetric label="OTP / Auth ratio" value="2.6:1" meta="766 vs 295 usuarios" color="var(--warning)" />
          <DerivedMetric label="Recurrencia" value="204%" meta="Eventos/usuario promedio" color="var(--info)" />
          <DerivedMetric label="Recovery completion" value="2.1%" meta="31 contactos / 1,446 inicio" color="var(--danger)" />
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Mapeo de eventos: UserPilot vs TARS</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Evento UserPilot</th>
                <th style={thStyle}>Evento TARS</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {MAPPING_TABLE.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontSize: 12, fontFamily: "monospace", color: r.userPilot === "—" ? "var(--muted)" : "var(--fg)" }}>{r.userPilot}</td>
                  <td style={{ ...tdStyle, fontSize: 12, fontFamily: "monospace" }}>{r.tars}</td>
                  <td style={tdStyle}>
                    {r.status === "parcial" ? (
                      <span style={tag("var(--warning)", "var(--warning-tint)")}>Parcial</span>
                    ) : (
                      <span style={tag("var(--danger)", "var(--danger-tint)")}>Sin tracking</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── S3-4 Sprint Panel ── */
function PanelS34() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, var(--danger) 0%, #DC2626 100%)",
        borderRadius: 14, padding: "18px 22px", color: "#fff",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>S3-4: Recovery en crisis &mdash; ratio sube a 50.6%</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
          El crecimiento de recovery (+33.5%) duplica al de adopci&oacute;n (+7.3%). Autenticador crece 2x m&aacute;s r&aacute;pido que OTP. La cobertura subi&oacute; solo 0.21pp en 2 semanas. El tracking sigue al 37.5%.
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Data cruda: 6 eventos activos (S3-4)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Evento</th>
                <th style={thR}>Usuarios</th>
                <th style={thR}>% Base</th>
                <th style={thR}>Eventos</th>
                <th style={thR}>Tendencia</th>
                <th style={thR}>Avg/User</th>
              </tr>
            </thead>
            <tbody>
              {RAW_DATA_S34.map((r) => (
                <tr key={r.evento}>
                  <td style={{ ...tdStyle, fontWeight: 500, fontSize: 12 }}>{r.evento}</td>
                  <td style={tdR}>{r.usuarios.toLocaleString()}</td>
                  <td style={tdR}>{r.pctBase}</td>
                  <td style={tdR}>{r.eventos.toLocaleString()}</td>
                  <td style={{
                    ...tdR,
                    color: r.tendencia.startsWith("+") ? "var(--success)" : "var(--danger)",
                    fontWeight: 600,
                  }}>{r.tendencia}</td>
                  <td style={tdR}>{r.avgUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Volumen de eventos por tipo (S3-4)</div>
        <div style={{ height: 260, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EVENT_CHART_DATA_S34} layout="vertical" margin={{ top: 5, right: 40, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
              <XAxis type="number" tick={axisTick} />
              <YAxis dataKey="name" type="category" tick={axisTick} width={110} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="eventos" radius={[0, 4, 4, 0]}>
                {EVENT_CHART_DATA_S34.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
                <LabelList dataKey="eventos" position="right" style={labelStyle} formatter={(v) => typeof v === "number" ? v.toLocaleString() : String(v)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Embudo de recovery: detalle por paso (S3-4)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Paso</th>
                <th style={thR}>Valor</th>
                <th style={thR}>% del total</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {RECOVERY_DETAIL_S34.map((r) => (
                <tr key={r.step}>
                  <td style={{ ...tdStyle, fontWeight: 500, fontSize: 12 }}>{r.step}</td>
                  <td style={tdR}>{r.value !== null ? r.value.toLocaleString() : "—"}</td>
                  <td style={tdR}>{r.pct}</td>
                  <td style={tdStyle}>
                    {r.status === "tracked" ? (
                      <span style={tag("var(--success)", "var(--success-tint)")}>Trackeado</span>
                    ) : (
                      <span style={tag("var(--danger)", "var(--danger-tint)")}>Sin tracking</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>M&eacute;tricas derivadas (S3-4)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 10 }}>
          <DerivedMetric label="Recovery / 2FA ratio" value="50.6%" meta="Meta: <15% — CRITICAL" color="var(--danger)" />
          <DerivedMetric label="OTP / Auth ratio" value="2.41:1" meta="828 vs 343 usuarios" color="var(--warning)" />
          <DerivedMetric label="Recurrencia" value="202.7%" meta="Eventos/usuario promedio" color="var(--info)" />
          <DerivedMetric label="Recovery completion" value="3.1%" meta="59 contactos / 1,931 inicio" color="var(--danger)" />
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Mapeo de eventos: UserPilot vs TARS</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th style={thStyle}>Evento UserPilot</th>
                <th style={thStyle}>Evento TARS</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {MAPPING_TABLE.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontSize: 12, fontFamily: "monospace", color: r.userPilot === "—" ? "var(--muted)" : "var(--fg)" }}>{r.userPilot}</td>
                  <td style={{ ...tdStyle, fontSize: 12, fontFamily: "monospace" }}>{r.tars}</td>
                  <td style={tdStyle}>
                    {r.status === "parcial" ? (
                      <span style={tag("var(--warning)", "var(--warning-tint)")}>Parcial</span>
                    ) : (
                      <span style={tag("var(--danger)", "var(--danger-tint)")}>Sin tracking</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Comparativo Panel ── */
function PanelComparativo() {
  const severityColor: Record<string, string> = {
    danger: "var(--danger)",
    warning: "var(--warning)",
    success: "var(--success)",
    neutral: "var(--muted)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={card}>
        <div style={sectionTitle}>Comparativo S1-2 vs S3-4</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Evoluci&oacute;n de m&eacute;tricas clave entre periodos. Rojo = empeora, verde = mejora, amarillo = atenci&oacute;n.
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>M&eacute;trica</th>
                <th style={thR}>S1-2 (Jul 6-20)</th>
                <th style={thR}>S3-4 (Jul 21 - Ago 5)</th>
                <th style={thR}>Delta</th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIVO_DATA.map((r) => (
                <tr key={r.metric}>
                  <td style={{ ...tdStyle, fontWeight: 500, fontSize: 12 }}>{r.metric}</td>
                  <td style={tdR}>{r.s12}</td>
                  <td style={tdR}>{r.s34}</td>
                  <td style={{
                    ...tdR,
                    color: severityColor[r.severity],
                    fontWeight: 600,
                  }}>{r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Tendencias clave</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{"🔴"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Recovery crece 4.6x m&aacute;s r&aacute;pido que adopci&oacute;n</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                Recovery: +33.5% vs 2FA activada: +7.3%. El problema empeora m&aacute;s r&aacute;pido de lo que crece la base. Si esta tendencia se mantiene, el ratio podr&iacute;a superar 60% en el pr&oacute;ximo sprint.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{"🟢"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Autenticador gana terreno sobre OTP</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                Autenticador creci&oacute; +16.3% (295 &rarr; 343) vs OTP +8.1% (766 &rarr; 828). El ratio OTP/Auth mejor&oacute; de 2.6:1 a 2.41:1. La recurrencia de Autenticador (3.14) supera a OTP (1.68) por un factor de 1.87x.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{"🟡"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Recovery completion mejora pero sigue cr&iacute;tico</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                Subi&oacute; de 2.1% a 3.1% (+1pp). Contactos de recovery crecieron 90.3% (31 &rarr; 59). Pero el 96.9% de quienes inician recovery siguen sin completarlo a trav&eacute;s de los canales trackeados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DerivedMetric({ label, value, meta, color }: { label: string; value: string; meta: string; color: string }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 10, padding: 14, textAlign: "center",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{meta}</div>
    </div>
  );
}

function PanelHallazgos() {
  const borderColorMap = {
    danger: "var(--danger)",
    warning: "var(--warning)",
    success: "var(--success)",
    info: "var(--info)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <div style={sectionTitle}>{INSIGHTS.length} hallazgos clave del periodo acumulado</div>
        <div style={sectionSub}>Ordenados por severidad: cr&iacute;ticos, advertencias, positivos y proyecciones. Incluye S1-2 y S3-4.</div>
      </div>

      {INSIGHTS.map((insight, i) => (
        <div key={i} style={{
          ...card,
          borderLeft: `4px solid ${borderColorMap[insight.severity]}`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{insight.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                {i + 1}. {insight.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>
                {insight.body}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelProximosPasos() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <StepSection
        icon={"🔴"}
        title="Urgente"
        color="var(--danger)"
        bg="var(--danger-tint)"
        items={NEXT_STEPS.urgente}
      />
      <StepSection
        icon={"🟡"}
        title="Corto plazo"
        color="var(--warning)"
        bg="var(--warning-tint)"
        items={NEXT_STEPS.corto}
      />
      <StepSection
        icon={"🔵"}
        title="Mediano plazo"
        color="var(--info)"
        bg="var(--info-tint)"
        items={NEXT_STEPS.mediano}
      />
    </div>
  );
}

function StepSection({ icon, title, color, bg, items }: {
  icon: string; title: string; color: string; bg: string;
  items: { title: string; body: string }[];
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>{title}</span>
        <span style={tag(color, bg)}>{items.length} items</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            ...card,
            borderLeft: `4px solid ${color}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
              {i + 1}. {item.title}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
