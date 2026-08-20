"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  ChevronDown, ChevronUp, Copy, Check, FileText,
  AlertTriangle, Rocket, ShieldAlert, Layers, Clock,
} from "lucide-react";

/* ── Shared styles ── */
const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 700,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "var(--fg)",
  marginBottom: 12,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const tableHeaderStyle: React.CSSProperties = {
  background: "#F8FAFC",
  color: "#475569",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  padding: "10px 14px",
  borderBottom: "1px solid #E2E8F0",
  textAlign: "left",
};

const tableCellStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 13,
  borderBottom: "1px solid #E2E8F0",
  color: "#1E293B",
};

function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 16, fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
      <strong>⏳ Pendiente de completar.</strong> {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Fin001ProjectPage() {
  const [docAccordionOpen, setDocAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("kickoff");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (sectionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="FIN-001 · Rediseño Flujo Login y Sign up dropiPay"
        subtitle="Célula Fintech · PM: Harry Hernández"
        currentSlug="fin-001"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & title ── */}
        <div style={{ marginBottom: 20 }}>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver al Hub
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={badgeStyle("#0369A1", "#E0F2FE")}>🏦 Célula Fintech</span>
                <span style={badgeStyle("#15803D", "#DCFCE7")}>✅ Ready for dev</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🎨 Fase 1 (MVP) · Diseño completado</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Rediseño — Flujo Login y Sign up dropiPay
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0" }}>
                Pantalla de acceso unificada (feature tour + login) sobre el Design System v3, como puerta de entrada al rediseño integral de Dropi Pay.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Owner / PM</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Harry Hernández</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Product Designer</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Nicolás Vargas</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Stakeholder principal</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Laura Contreras</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Target size", value: "2.000", sub: "Usuarios dropiPay (Persona Natural - Empresario)", color: "#3B82F6" },
            { label: "Fecha de kick-off", value: "27/07/2026", sub: "Célula Fintech", color: "#8B5CF6" },
            { label: "Feature tour AS-IS → propuesta", value: "7 → 4 slides", sub: "Mensajes anclados en diferenciadores reales", color: "#EA580C" },
            { label: "Países fase 1", value: "5", sub: "Colombia, Brasil, Ecuador, Chile, México", color: "#10B981" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION — DOCUMENTACIÓN
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #6366F1", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(99,102,241,0.08)" }}>
          <button
            onClick={() => setDocAccordionOpen(!docAccordionOpen)}
            style={{ width: "100%", background: docAccordionOpen ? "linear-gradient(90deg,#EEF2FF 0%,#FAF5FF 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: docAccordionOpen ? "1px solid #E0E7FF" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#1E1B4B" }}>Documentación</span>
                  <span style={badgeStyle("#4338CA", "#E0E7FF")}>Fuente: doc de kickoff/discovery/definición del PM</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Especificaciones de Producto para el proyecto FIN-001. Secciones 4 en adelante (Following, Hand-off TI, Hand-off Stakeholders, Gobierno) aún no fueron diligenciadas por el equipo.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #C7D2FE" }}>
                {docAccordionOpen ? "Ocultar Documentación" : "Ver Documentación"}
              </span>
              {docAccordionOpen ? <ChevronUp size={20} color="#6366F1" /> : <ChevronDown size={20} color="#6366F1" />}
            </div>
          </button>

          {docAccordionOpen && (
            <div style={{ padding: 24 }}>
              <div style={{ background: "#FAFAFA", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>

                {/* Tab nav */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { id: "kickoff", label: "🧠 1. Kick-off & Contexto" },
                    { id: "discovery", label: "🫀 2. Discovery & AS-IS" },
                    { id: "definicion", label: "🫀 3. Definición & Alcance" },
                    { id: "following", label: "🫀 4. Following & Métricas" },
                    { id: "handoff_ti", label: "💻 5. Hand-off a TI (C4)" },
                    { id: "handoff_stakeholders", label: "⭐️ 6. Hand-off Stakeholders" },
                    { id: "gobierno", label: "📈 7. Gobierno (TDL/TPL)" },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? "#6366F1" : "#ffffff", color: activeTab === tab.id ? "#ffffff" : "#475569", border: activeTab === tab.id ? "1px solid #6366F1" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — KICKOFF */}
                {activeTab === "kickoff" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={sectionHeadingStyle}><span>🧠 1. Kick-off & Contexto General</span></h3>
                      <button onClick={() => handleCopy("kickoff", "FIN-001 Kick-off")} style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {copiedSection === "kickoff" ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        {copiedSection === "kickoff" ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>

                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 10px 0" }}>1.1 Información General & Equipo</h4>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr><th style={tableHeaderStyle}>Campo</th><th style={tableHeaderStyle}>Contenido</th></tr></thead>
                        <tbody>
                          <tr><td style={tableCellStyle}><strong>Nombre del proyecto</strong></td><td style={tableCellStyle}>Inicio de sesión dropiPay</td></tr>
                          <tr><td style={tableCellStyle}><strong>Célula</strong></td><td style={tableCellStyle}>Fintech</td></tr>
                          <tr><td style={tableCellStyle}><strong>Owner / PM</strong></td><td style={tableCellStyle}>Harry Hernández</td></tr>
                          <tr><td style={tableCellStyle}><strong>Product Designer</strong></td><td style={tableCellStyle}>Nicolás Vargas</td></tr>
                          <tr><td style={tableCellStyle}><strong>Stakeholder principal</strong></td><td style={tableCellStyle}>Laura Contreras</td></tr>
                          <tr><td style={tableCellStyle}><strong>Fecha de kick-off</strong></td><td style={tableCellStyle}>27/07/2026</td></tr>
                          <tr><td style={tableCellStyle}><strong>Estado</strong></td><td style={tableCellStyle}>Ready for dev</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.2 ¿Por qué AHORA?</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      La app actual (v2) tiene una capa de UI desactualizada e inconsistente, construida sobre un Design System v1 con foundations parcialmente aplicadas. El login y las feature views son la primera impresión del usuario y hoy no comunican el valor diferencial de Dropi Pay ni acompañan la conversión.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#991B1B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={16} /> Cambio externo</strong>
                        <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>Referentes LATAM (Nubank, Revolut, ARQ) fusionan feature tour + CTAs de login/registro en una sola experiencia. Dropi Pay mantenía un login estático de 2 CTAs y un onboarding de features separado, visible solo una vez.</p>
                      </div>
                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#1E40AF", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Rocket size={16} /> Cambio interno</strong>
                        <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}>Rediseño integral de Dropi Pay sobre DS v3 en marcha. Front (Laura Ávila) solicitó iniciar por login/sign up por compartir componentes base (inputs, teclados, PIN, validaciones) con el siguiente flujo prioritario (onboarding).</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 16 }}>
                      <strong>Costo de no hacerlo:</strong> cada nuevo flujo rediseñado se construiría sin una puerta de entrada consistente, generando una app con dos estilos visuales pegados, y se mantendría un punto de entrada que no capitaliza el momento de mayor intención del usuario.
                    </p>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.3 Definición del Problema, Impacto y Painpoints</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      El flujo actual separa dos experiencias que deberían convivir: feature views de 7 slides con mensajes largos y genéricos (mostradas una sola vez) y un login estático con 2 CTAs. El valor del producto se comunica una única vez y se pierde. La propuesta unifica ambas en una pantalla de inicio con feature tour de 4 slides (video + título + CTAs) presente en cada acceso, más el flujo completo de login: teléfono + selector de país, validación de número, PIN con manejo de intentos y bloqueo, recuperación vía OTP y creación de nuevo PIN.
                    </p>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>Frecuencia del problema: diaria (cada acceso a la app). Importancia: alta.</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Segmento / Target</th><th style={tableHeaderStyle}>Detalle</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Target</td><td style={tableCellStyle}>Usuarios dropiPay (Persona Natural - Empresario)</td></tr>
                        <tr><td style={tableCellStyle}>País / mercado</td><td style={tableCellStyle}>Multipaís, centralizado hoy en Colombia</td></tr>
                        <tr><td style={tableCellStyle}>Target size</td><td style={tableCellStyle}>2.000 usuarios</td></tr>
                      </tbody>
                    </table>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li><strong>Dolor 1:</strong> el valor diferencial (liquidez inmediata, multi-moneda, multi-país) no se comunica en el punto de entrada; las feature views son largas, genéricas y de una sola exposición.</li>
                      <li><strong>Dolor 2:</strong> la UI del flujo de acceso se percibe desactualizada e inconsistente, erosionando la confianza desde la primera pantalla — crítico en un producto financiero.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Objetivos (PARA QUÉ)</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 12 }}>
                      <li><strong>Negocio:</strong> aumentar la conversión de visitante a registro completado desde la pantalla de inicio.</li>
                      <li><strong>UX:</strong> experiencia de acceso consistente, moderna y confiable, base del DS v2.0/v3 para los siguientes flujos.</li>
                      <li><strong>OKR:</strong> mejorar la activación temprana del usuario en Dropi Pay. <strong>KR:</strong> incremento en conversión a registro completado (línea base a confirmar con Producto).</li>
                      <li><strong>Data a instrumentar:</strong> signup_started, signup_completed, login_success, login_abandoned (por paso), pin_recovery_started, pin_recovery_completed, feature_tour_slide_viewed, account_blocked.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.4 Enlaces</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
                      <li>Épica Delivery: <a href="https://dropi-it.atlassian.net/browse/PROD-1825" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>PROD-1825</a></li>
                      <li>Épica Discovery: <a href="https://dropi-it.atlassian.net/browse/PROD-1938" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>PROD-1938</a></li>
                      <li>Figma FigJam (Kick-off/Wireframes): <a href="https://www.figma.com/board/MW0o3WsXkFFifIC6D9halP/Dropipay-UX?node-id=770-2813" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>ver board</a></li>
                      <li>Wireframes alta fidelidad: <a href="https://www.figma.com/design/VS40YgyFBZUa7lFA2ekFJ9/dropiPay-Design-v2.0?node-id=13-8188" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>ver diseño</a></li>
                      <li>Research / Benchmarking: <a href="https://www.figma.com/board/MW0o3WsXkFFifIC6D9halP/Dropipay-UX?node-id=2-100" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>ver hallazgo</a></li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.5 Dudas e incógnitas iniciales</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20 }}>
                      <li>¿Cuál es la línea base actual de conversión a registro y de abandono en el login? (depende de instrumentación de Producto/analítica)</li>
                      <li>¿El feature tour debe mostrarse siempre en cada acceso, o distinto para usuarios recurrentes vs. nuevos?</li>
                      <li>¿Qué países/monedas deben aparecer priorizados en el selector de país en fase 1?</li>
                      <li>¿En qué punto se genera el churn de usuarios en el flujo de sign up? ¿Está relacionado con la experiencia no adaptada a multipaís?</li>
                    </ul>
                  </div>
                )}

                {/* TAB 2 — DISCOVERY */}
                {activeTab === "discovery" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 2. Discovery & Diagnóstico AS-IS</span></h3>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>2.1 Usuarios implicados & madurez</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li><strong>Perfil principal:</strong> Dropshippers/proveedores/usuarios con empresa del ecosistema Dropi que gestionan liquidez y retiros vía Dropi Pay (flujo de caja activo, pauta, multi-moneda). <strong>Madurez:</strong> en consolidación — producto con tracción (50MM+ dispersados, 337K+ movimientos) sin masificación deliberada por restricciones de liquidez.</li>
                      <li><strong>Perfil secundario:</strong> usuarios nuevos que llegan a la aplicación.</li>
                    </ul>

                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: 16, borderRadius: 10, marginBottom: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: "#92400E", margin: "0 0 8px 0" }}>2.2 AS-IS — Solución actual</h4>
                      <ul style={{ fontSize: 13, color: "#78350F", margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                        <li><strong>Login/acceso:</strong> tour de 7 slides genéricos mostrado solo una vez (renders 3D isométricos, estilo descrito por Harry como &quot;hecho por allá en 2015&quot;) + login estático de 2 CTAs.</li>
                        <li><strong>Registro/onboarding:</strong> solicita documentación por tipo de persona sin adaptar al país — un usuario de Brasil recibe solicitudes de documentación colombiana (cédula), generando abandono. Vinculación solo habilitada hoy para colombianos, PPT y pasaporte.</li>
                        <li><strong>Limitaciones:</strong> la separación tour/login desperdicia el momento de mayor intención del usuario; los 7 slides diluían el impacto con mensajes que &quot;cualquier wallet podría usar&quot;.</li>
                      </ul>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>2.3 Discovery por áreas, bench e investigación</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 12 }}>
                      <li><strong>Hallazgo principal:</strong> el punto de entrada no comunica los 3 diferenciadores reales (liquidez inmediata 30-40s vs. 2-3 días, multi-moneda/multi-país con 9 monedas y tarjetas virtuales, crédito para pauta).</li>
                      <li><strong>Hallazgo secundario <span style={{ color: "#B45309" }}>[dato pendiente de validar en Amplitude]</span>:</strong> churn no cuantificado en registro por ausencia de experiencia multi-país. Research planificado, aún no ejecutado.</li>
                      <li><strong>Hallazgo terciario:</strong> Nubank, Revolut y ARQ fusionan feature tour + CTAs de acceso en una sola pantalla, comunicando valor en cada acceso.</li>
                    </ul>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                      Fuentes: reunión de contexto con Harry Hernández, reunión con Laura Ávila (Front), reunión de socialización con Laura Contreras — transcripciones documentadas. Benchmark realizado sobre ARQ, Nubank y Revolut.
                    </p>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>2.4 Gestión de riesgos de producto</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Tipo</th><th style={tableHeaderStyle}>Nivel</th><th style={tableHeaderStyle}>Detalle</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Valor</td><td style={tableCellStyle}>Bajo</td><td style={tableCellStyle}>Flujo obligatorio — riesgo es que la mejora no mueva conversión. Mitigación: medir antes/después.</td></tr>
                        <tr><td style={tableCellStyle}>Usabilidad</td><td style={tableCellStyle}>Medio</td><td style={tableCellStyle}>Selector de país, validación, PIN con intentos y bloqueo, OTP — fricción inherente en fintech.</td></tr>
                        <tr><td style={tableCellStyle}>Factibilidad</td><td style={tableCellStyle}>Bajo (login) / Medio-alto (registro multi-país)</td><td style={tableCellStyle}>Registro depende de que Backend soporte validación de documentos por nacionalidad — confirmar con Harry/Santiago.</td></tr>
                        <tr><td style={tableCellStyle}>Viabilidad empresarial</td><td style={tableCellStyle}>Bajo</td><td style={tableCellStyle}>No cambia modelo de negocio ni costos operativos.</td></tr>
                        <tr><td style={tableCellStyle}>Legal</td><td style={tableCellStyle}>Por validar</td><td style={tableCellStyle}>Tratamiento de datos solicitados para multipaís — validar con Legal.</td></tr>
                      </tbody>
                    </table>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>2.5 Hipótesis <span style={{ fontWeight: 600, fontSize: 12, color: "#B45309" }}>[HIPÓTESIS a validar]</span></h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li><strong>H1:</strong> un feature tour conciso (4 vs. 7 slides) anclado en los diferenciadores reales, integrado con los CTAs y presente en cada visita, aumentará la conversión a registro respecto al modelo actual.</li>
                      <li><strong>H2:</strong> un registro que adapte campos y documentación al país desde el primer paso reducirá el abandono sospechado en usuarios no colombianos.</li>
                      <li><strong>H3:</strong> la renovación visual (DS v2.0) mejorará la percepción de confianza y modernidad, reduciendo la impresión de &quot;hecho en 2015&quot;.</li>
                    </ul>

                    <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1E40AF", margin: "0 0 8px 0" }}>2.6 Conclusiones del discovery</h4>
                      <p style={{ fontSize: 12, color: "#1E3A8A", margin: "0 0 8px 0", lineHeight: 1.6 }}><strong>Qué aprendimos:</strong> Dropi Pay tiene tracción real (50MM+ dispersados, 337K movimientos) cuyo punto de entrada no comunica su valor. El onboarding no soporta la expansión multi-país en curso (Chile, Ecuador, Guatemala), generando churn no cuantificado en el registro.</p>
                      <p style={{ fontSize: 12, color: "#1E3A8A", margin: "0 0 8px 0", lineHeight: 1.6 }}><strong>Decisiones:</strong> unificar tour y login en una pantalla; reducir de 7 a 4 slides; rediseñar sobre DS v3 (no parchear v2); empezar por login/registro por reuso de componentes con onboarding.</p>
                      <p style={{ fontSize: 12, color: "#1E3A8A", margin: 0, lineHeight: 1.6 }}><strong>Fuera de alcance:</strong> research cuantitativo en Amplitude por nacionalidad (planificado, no ejecutado); instrumentación de eventos de conversión; flujo completo de onboarding/registro multi-tipo (siguiente flujo inmediato).</p>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>2.7 Requerimientos generales, compatibilidad y performance</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      Pantalla de acceso unificada con feature tour de 4 slides (video + título + CTAs), login por teléfono con selector de país, validación de número, PIN con 3 intentos y bloqueo, recuperación vía OTP de 6 dígitos con temporizador, y creación de nuevo PIN con confirmación. Construido sobre DS v3.
                    </p>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20 }}>
                      <li><strong>Dispositivos:</strong> mobile-first, app nativa Flutter (iOS + Android). No responsive web.</li>
                      <li><strong>Performance:</strong> videos del feature tour generados con IA — deben pesar poco (confirmar formato con Front: MP4 comprimido, Lottie o webm). Estados de loading contemplan la espera de validación de número/PIN. Temporizador OTP: 01:30 con opción de reenvío.</li>
                    </ul>
                  </div>
                )}

                {/* TAB 3 — DEFINICIÓN */}
                {activeTab === "definicion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 3. Definición — Propuestas, Alcance y Próximos Pasos</span></h3>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.1 Primeras ideas y propuestas</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      Propuesta central nace del benchmark: unificar feature tour + CTAs en una sola pantalla y reducir a 4 slides anclados en los diferenciadores reales. A nivel visual se validó negro como color de acción principal con acentos naranja (#FF6102), alejándose del estilo anterior. Videos/renders 3D con IA como lenguaje visual — pulido pendiente con Marketing (María José Calderón), especialmente el render de tarjetas virtuales.
                    </p>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Escenarios cubiertos</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li>Happy path: teléfono → país → PIN → acceso exitoso.</li>
                      <li>Número inexistente: validación inline, corrección sin salir del flujo.</li>
                      <li>PIN incorrecto (intentos 1-2): contador de intentos restantes, reintentar o restaurar PIN.</li>
                      <li>PIN incorrecto (intento 3): bloqueo de cuenta, CTAs a &quot;Volver al inicio&quot; y &quot;Contactar soporte&quot;.</li>
                      <li>Recuperación de PIN: OTP de 6 dígitos, temporizador 01:30, creación de nuevo PIN con confirmación.</li>
                      <li>OTP inválido / expirado: feedback inline, reenvío habilitado al expirar.</li>
                      <li>Nuevo PIN igual al anterior: feedback de error, solicita PIN diferente.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.2 Fases del proyecto y alcance</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
                      {[
                        { color: "#10B981", bg: "#ECFDF5", title: "FASE 1 (MVP) — Login + feature tour unificado", badge: "Diseño completado · Ready for dev", badgeColor: "#065F46", badgeBg: "#D1FAE5", desc: "Pantalla de acceso unificada (4 slides), login por teléfono con selector de país, validación de número, PIN con 3 intentos y bloqueo, recuperación vía OTP, nuevo PIN. Todos los estados resueltos. Componentizado en Figma, conectado al DS v2.0, auditado por Kevin (DS lead). Pendiente para cerrar: eventos de medición, alineación de métricas con Harry, alineación de render de tarjetas con Marketing." },
                        { color: "#3B82F6", bg: "#EFF6FF", title: "FASE 2 (Evolutivo) — Registro / onboarding multi-país", badge: "En research previo al diseño", badgeColor: "#1E40AF", badgeBg: "#DBEAFE", desc: "Registro adaptado por país y tipo de persona (natural/jurídica/LLC). Requiere antes: research cuantitativo en Amplitude, validación de KYC por país con Legal, definición de data requerida por país." },
                        { color: "#64748B", bg: "#F8FAFC", title: "FASE 3 (Optimización) — Instrumentación + iteración con data", badge: "Planificado, no iniciado", badgeColor: "#334155", badgeBg: "#E2E8F0", desc: "Dashboard de comportamiento (Amplitude/UserPilot), análisis de funnel completo, iteración de UX fina, A/B testing del feature tour, automatización de recuperación (ej. desbloqueo por biometría)." },
                      ].map((fase, i) => (
                        <div key={i} style={{ borderLeft: `4px solid ${fase.color}`, background: fase.bg, padding: 14, borderRadius: "0 8px 8px 0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <strong style={{ fontSize: 14, color: fase.color }}>{fase.title}</strong>
                            <span style={badgeStyle(fase.badgeColor, fase.badgeBg)}>{fase.badge}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "#334155", margin: "6px 0 0 0", lineHeight: 1.5 }}>{fase.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: 14, marginBottom: 20 }}>
                      <strong style={{ color: "#991B1B", fontSize: 13 }}>Lo que NO entra (no-objetivo)</strong>
                      <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>Rediseño del flujo transaccional (wallet, retiros, recargas): siguiente bloque del Track 2 del roadmap. Razón: dependencia secuencial — primero la puerta de entrada con DS v3, luego los flujos internos.</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>3.3 Estimación de recursos</h4>
                        <ul style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                          <li>Fase 1 (login + tour): 1 sprint de diseño (completado)</li>
                          <li>Fase 2 (registro multi-país): 1 sprint de research (Amplitude + legal) + 1 sprint de diseño estimado — sujeto a lo que revele el research</li>
                        </ul>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>3.4 Segmento y país</h4>
                        <ul style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                          <li>Dropshippers y vendedores e-commerce del ecosistema Dropi que gestionan wallet, liquidez, retiros y pagos</li>
                          <li>Colombia, Brasil, Ecuador, Chile, México · 2.000 usuarios activos</li>
                        </ul>
                      </div>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.5 Supuestos</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li>El usuario tiene un número móvil activo para recibir el OTP.</li>
                      <li>El backend soporta validación de número por país sin cambios (código de país ya procesado).</li>
                      <li>Los videos del feature tour se pueden implementar en Flutter sin impactar el tiempo de carga (confirmar formato con Front).</li>
                      <li>Amplitude y Customer IO siguen disponibles para instrumentar los eventos definidos.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.6 Próximos pasos</h4>
                    <ol style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 16 }}>
                      <li>Definir eventos de medición del login y alinearlos con Harry (solicitado por Laura Contreras en daily del 29/07).</li>
                      <li>Solicitar a Marketing (María José Calderón) el pulido de renders del feature tour, especialmente tarjetas virtuales.</li>
                      <li>Preparar hand-off del flujo a Front (Laura Ávila): prototipo navegable, componentes DS, specs de videos/animaciones.</li>
                      <li>Iniciar research cuantitativo en Amplitude del funnel de registro por nacionalidad; solicitar eventos faltantes si aplica.</li>
                      <li>Validar con Harry y Legal los requisitos KYC por país (Colombia, Ecuador, Chile, Guatemala) antes de diseñar el registro multi-país.</li>
                    </ol>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.7 Entregables</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20 }}>
                      <li>✅ Flujo completo de login en Figma, componentizado y vinculado al DS v2.0</li>
                      <li>✅ Feature tour de 4 slides con videos/renders 3D IA (pendiente pulido de 1 render con Marketing)</li>
                      <li>✅ Documento de kickoff + discovery</li>
                      <li>⏳ Definición de eventos de medición para login/registro</li>
                      <li>⏳ Research cuantitativo en Amplitude: funnel de registro por nacionalidad (prerequisito de fase 2)</li>
                      <li>⏳ Flujo completo de registro/onboarding multi-país multi-tipo (fase 2)</li>
                    </ul>
                  </div>
                )}

                {/* TAB 4 — FOLLOWING */}
                {activeTab === "following" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 4. Following y Lanzamiento</span></h3>
                    <PendingNote>
                      El documento fuente no trae aún el esquema de medición diligenciado para este proyecto (métricas HEART, eventos de Userpilot, encuesta SEQ, plan de 12 semanas). Sí definió, en 3.6, el próximo paso explícito: <strong>&quot;Definir eventos de medición del flujo de login (signup_started, login_success, login_abandoned por paso, pin_recovery, account_blocked, feature_tour_slide_viewed) y alinearlos con Harry&quot;</strong> — solicitado por Laura Contreras. Responsables generales del formato: métricas de negocio → Miguel Ángel Gutiérrez; comportamiento UX → Diana Aldana; eventos/encuestas Userpilot → Laura Torres.
                    </PendingNote>
                  </div>
                )}

                {/* TAB 5 — HANDOFF TI */}
                {activeTab === "handoff_ti" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>💻 5. Hand-off a TI (C4 & JTBD)</span></h3>
                    <PendingNote>
                      Aún no se ha redactado el JTBD formal, el contexto C4 Nivel 1 (actores, sistemas externos, dominios, flujo de datos), el glosario de dominio, las reglas de negocio numeradas ni los criterios de aceptación en Gherkin para este proyecto. El estado &quot;Ready for dev&quot; en 1.1 sugiere que el hand-off a Front (Laura Ávila) está próximo — ver paso 3 de 3.6 Próximos Pasos.
                    </PendingNote>
                    <div style={{ marginTop: 16, background: "#F1F5F9", padding: 16, borderRadius: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>Lo único referido hasta ahora</h4>
                      <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, margin: 0 }}>
                        Plataforma objetivo: app nativa Flutter (iOS + Android), mobile-first. El equipo de Front receptor es liderado por Laura Ávila.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 6 — HANDOFF STAKEHOLDERS */}
                {activeTab === "handoff_stakeholders" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>⭐️ 6. Hand-off a Stakeholders</span></h3>
                    <PendingNote>
                      El documento no trae aún la estrategia de comunicación (título, beneficios clave, mensajes, recursos, contacto) ni el detalle de lanzamiento formal para este proyecto. Stakeholder principal identificado: Laura Contreras.
                    </PendingNote>
                  </div>
                )}

                {/* TAB 7 — GOBIERNO */}
                {activeTab === "gobierno" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>📈 7. Gobierno & Ejecución (TDL / TPL)</span></h3>
                    <PendingNote>
                      No se ha activado aún la fase de gobierno (RACI, DORA Metrics, Risk Heat Map, PERT, Traffic Light) — corresponde al momento del hand-off formal a TI, que según 3.6 está pendiente de preparación.
                    </PendingNote>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ── Fuente ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>
          <Layers size={14} />
          <span>Contenido cargado desde el doc de Kick-off / Discovery / Definición de dropiPay (Google Docs) · Última sincronización: <Clock size={12} style={{ verticalAlign: "middle" }} /> 18/08/2026</span>
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
