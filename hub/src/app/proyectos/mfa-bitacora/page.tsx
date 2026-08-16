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

const TABS = ["Resumen", "S1-2 · Jul 6-20", "Hallazgos", "Próximos Pasos"];

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
    title: "Agujero negro de tracking: Grupo B sin visibilidad",
    body: "De los 16 eventos del modelo TARS, solo 6 están instrumentados (37.5%). Todo el Grupo B (login MFA, setup screen, QR scanned, setup abandoned, sensitive actions) tiene 0 eventos. No podemos medir fricción en el flujo de setup ni en las acciones sensibles post-login. Cualquier decisión sobre UX de MFA se basa en menos del 40% de la foto completa.",
  },
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Embudo de setup incompleto",
    body: "No tenemos visibilidad de cuántos usuarios ven la pantalla de setup, cuántos eligen un método, cuántos escanean el QR y cuántos abandonan antes de completar. Solo vemos el resultado final (2FA activada: 3,555). El embudo completo está ciego desde el inicio hasta el penúltimo paso.",
  },
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Recovery desproporcionado: ratio 40.7%",
    body: "1,446 usuarios iniciaron recovery vs. 3,555 con 2FA activada. Eso es un ratio del 40.7%, muy por encima de la meta de <15%. Indica que casi la mitad de quienes activan 2FA necesitan recuperar acceso, lo cual sugiere fricción grave en el flujo post-activación o pérdida masiva de dispositivos/códigos.",
  },
  {
    severity: "danger" as const,
    icon: "🔴",
    title: "Caída del 97.9% en canales de recovery",
    body: "De 1,446 que inician recovery, solo 16 llegan a email y 15 a SMS. Eso es una caída del 97.9% entre el primer y segundo paso del embudo de recovery. O los usuarios abandonan, o hay un paso intermedio no trackeado, o el flujo tiene un blocker técnico. Los últimos 2 pasos (código verificado y recovery completado) no tienen tracking — no sabemos cuántos realmente recuperan su cuenta.",
  },
  {
    severity: "warning" as const,
    icon: "🟡",
    title: "OTP domina con ratio 2.6:1 sobre Autenticador",
    body: "766 usuarios eligieron OTP vs. 295 Autenticador (ratio 2.6:1). OTP es más fácil de configurar pero menos seguro. Si el objetivo es migrar hacia autenticadores, se necesita una estrategia activa de promoción. La recurrencia de Autenticador (2.25 eventos/usuario) es mayor que OTP (1.66), lo que sugiere que quienes lo adoptan lo usan más consistentemente.",
  },
  {
    severity: "success" as const,
    icon: "🟢",
    title: "2FA con tendencia positiva sostenida",
    body: "2FA activada crece +5.33% en el periodo evaluado, con 3,555 usuarios activos y un promedio de 3.04 eventos por usuario. La adopción avanza, aunque desde una base baja (6.49% de la base total de 54,790). A este ritmo orgánico, alcanzar 95% tomaría más de 2 años sin intervención.",
  },
  {
    severity: "info" as const,
    icon: "🔵",
    title: "Proyección lineal inalcanzable sin enforcement",
    body: "Con 6.49% actual y meta de 95% en 8 semanas, se necesitan ~8,082 activaciones nuevas por semana. El crecimiento orgánico actual no supera las 200 activaciones semanales. Sin un mecanismo de enforcement (MFA obligatorio en login o en acciones sensibles), la meta es matemáticamente inalcanzable. El gap es de 88.5 puntos porcentuales.",
  },
];

const NEXT_STEPS = {
  urgente: [
    {
      title: "Implementar los 10 eventos faltantes del Grupo B",
      body: "Instrumentar mfa_login_attempt, mfa_setup_screen_shown, mfa_method_selected, mfa_qr_scanned, mfa_setup_abandoned, sensitive_action_attempted, mfa_modal_shown_sensitive, sensitive_action_completed, mfa_recovery_code_sent y mfa_recovery_completed. Sin estos eventos, toda decisión sobre flujo MFA se basa en menos del 40% de la información.",
    },
    {
      title: "Investigar la caída del 97.9% en el embudo de recovery",
      body: "Determinar si la caída entre recovery iniciado (1,446) y email/SMS (16/15) se debe a abandono del usuario, un paso intermedio no trackeado, o un blocker técnico. Revisar logs de backend y validar con el equipo de desarrollo si hay pasos entre “Configurar nuevamente” y el envío de código.",
    },
    {
      title: "Verificar estado real del enforcement de MFA",
      body: "Confirmar con el equipo técnico si MFA es realmente obligatorio, en qué flujos se exige (login, acciones sensibles, ambos), y si existe algún bypass. Los datos sugieren que no hay enforcement real: solo 6.49% de adopción es inconsistente con un MFA obligatorio.",
    },
  ],
  corto: [
    {
      title: "Analizar la dominancia de OTP sobre Autenticador",
      body: "Investigar si la preferencia 2.6:1 por OTP es por diseño (se muestra primero, es el default), por facilidad (menos pasos), o por desconocimiento del autenticador. Evaluar si la mayor recurrencia del autenticador (2.25 vs 1.66 eventos/usuario) justifica promoverlo activamente.",
    },
    {
      title: "Implementar micro-surveys post-activación de 2FA",
      body: "Encuesta in-app (1-2 preguntas) tras activar 2FA para entender: facilidad percibida del proceso, método preferido y por qué, y si encontraron algún problema. Esto complementa los datos cuantitativos con contexto cualitativo.",
    },
    {
      title: "Dashboard BI de retención post-MFA",
      body: "Crear un dashboard que cruce activación de 2FA con retención de usuarios a 30/60/90 días. Responder: ¿los usuarios que activan 2FA retienen más que los que no? ¿El método elegido (OTP vs Autenticador) afecta la retención?",
    },
  ],
  mediano: [
    {
      title: "Evaluar onboarding de recovery codes",
      body: "Diseñar un flujo donde al activar 2FA se generen códigos de recovery descargables/imprimibles. Si el ratio recovery/2FA baja de 40.7% a <15%, se confirma que la fricción es por pérdida de acceso al método, no por problemas del flujo en sí.",
    },
    {
      title: "Planificar rollout de MFA forzado por cohortes",
      body: "Diseñar un plan de enforcement gradual: primero usuarios de alto valor, luego usuarios nuevos al registrarse, finalmente base existente. Cada cohorte debe tener métricas de conversión, abandono y soporte para calibrar antes de escalar.",
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
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>MFA Obligatorio &mdash; Bitácora UX</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px" }}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
            MFA Obligatorio &mdash; Bitácora UX
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
            Jul 6 al Jul 20, 2026 &middot; Actualizado: 23/07/2026
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <span style={tag("var(--fg)", "#F3F4F6")}>Usuarios activos base: 54,790</span>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>2FA Activada: 3,555 (6.49%)</span>
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
        {activeTab === 2 && <PanelHallazgos />}
        {activeTab === 3 && <PanelProximosPasos />}
      </div>

      <footer style={{
        textAlign: "center", padding: "32px 24px 40px", fontSize: 12,
        color: "var(--muted)", borderTop: "1px solid var(--border)",
      }}>
        Backoffice &middot; MFA Obligatorio &middot; Bitácora UX &middot; Jul 23, 2026 &middot; Autor: Michel Pino
      </footer>
    </div>
  );
}

function PanelResumen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, var(--danger) 0%, #DC2626 100%)",
        borderRadius: 14, padding: "18px 22px", color: "#fff",
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Alerta crítica de cobertura de tracking</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
          Solo 6 de 16 eventos trackeados (37.5%). Todo el Grupo B (login MFA, setup screen, QR scanned, setup abandoned, acciones sensibles) tiene <strong>0 eventos</strong>. Las decisiones sobre UX de MFA se basan en menos del 40% de la información disponible.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <KPICard label="Cobertura MFA" value="6.49%" sub="3,555 / 54,790 usuarios" color="var(--dropi)" bg="var(--dropi-light)" />
        <KPICard label="2FA Activada" value="3,555" sub="↑ 5.33% vs periodo anterior" color="var(--success)" bg="var(--success-tint)" />
        <KPICard label="Recovery iniciado" value="1,446" sub="↓ 4.66% vs periodo anterior" color="var(--warning)" bg="var(--warning-tint)" />
        <KPICard label="Contactos recovery" value="31" sub="↓ 91% vs periodo anterior" color="var(--danger)" bg="var(--danger-tint)" />
      </div>

      <div style={card}>
        <div style={sectionTitle}>North Star: ≥95% cobertura MFA en 8 semanas</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Actual: 6.49% &middot; Meta: 95% &middot; Gap: 88.5pp &middot; Ritmo necesario: ~8,082 activaciones/semana
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: 8, height: 28, position: "relative", overflow: "hidden" }}>
          <div style={{
            background: "var(--dropi)", height: "100%", width: "6.49%",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#fff", minWidth: 40,
          }}>
            6.49%
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
        <div style={sectionTitle}>Métodos de verificación: comparativa</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          OTP: 766 usuarios / 1,273 eventos &middot; Autenticador: 295 usuarios / 665 eventos &middot; 2FA total: 3,555 / 10,818
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={METHODS_CHART} layout="horizontal" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
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
        <div style={sectionTitle}>Embudo de recovery</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Recovery iniciado 1,446 &rarr; Email 16 &rarr; SMS 15. Caída del 97.9% entre paso 1 y paso 2.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECOVERY_FUNNEL.map((r) => (
            <div key={r.step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 160, fontSize: 13, color: "var(--fg)", fontWeight: 500, flexShrink: 0 }}>{r.step}</div>
              <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 6, height: 24, position: "relative", overflow: "hidden" }}>
                <div style={{
                  background: r.value === 1446 ? "var(--dropi)" : "var(--danger)",
                  height: "100%",
                  width: `${Math.max((r.value / 1446) * 100, 3)}%`,
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
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%", background: "var(--dropi)",
            marginTop: 4, flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Jul 6 - Jul 20, 2026</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
              Primera evaluación de la bitácora MFA. Se identificaron 6 eventos activos de 16 del modelo TARS. Cobertura MFA en 6.49% con tendencia positiva pero ritmo insuficiente para alcanzar meta de 95% en 8 semanas.
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

function PanelSprint() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={card}>
        <div style={sectionTitle}>Cobertura de tracking: 6 de 16 eventos activos</div>
        <div style={{ ...sectionSub, marginBottom: 14 }}>
          Solo los eventos del Grupo A (UserPilot) están instrumentados. Todo el Grupo B (TARS) está sin tracking.
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
        <div style={sectionTitle}>Data cruda: 6 eventos activos</div>
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
        <div style={sectionTitle}>Volumen de eventos por tipo</div>
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
        <div style={sectionTitle}>Embudo de recovery: detalle por paso</div>
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
        <div style={sectionTitle}>Métricas derivadas</div>
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
  const bgMap = {
    danger: "var(--danger-tint)",
    warning: "var(--warning-tint)",
    success: "var(--success-tint)",
    info: "var(--info-tint)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <div style={sectionTitle}>7 hallazgos clave del periodo</div>
        <div style={sectionSub}>Ordenados por severidad: críticos, advertencias, positivos y proyecciones.</div>
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
        icon="🔴"
        title="Urgente"
        color="var(--danger)"
        bg="var(--danger-tint)"
        items={NEXT_STEPS.urgente}
      />
      <StepSection
        icon="🟡"
        title="Corto plazo"
        color="var(--warning)"
        bg="var(--warning-tint)"
        items={NEXT_STEPS.corto}
      />
      <StepSection
        icon="🔵"
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
