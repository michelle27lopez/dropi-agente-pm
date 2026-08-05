"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  Search, ChevronDown, ChevronUp, Copy, Check, FileText,
  AlertTriangle, Layers, Target, Clock, Users, Database,
  RefreshCw, ShieldCheck, ShieldAlert, Rocket,
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

const pendingBoxStyle: React.CSSProperties = {
  background: "#FFFBEB",
  border: "1px dashed #FDE68A",
  borderRadius: 10,
  padding: 14,
  fontSize: 12.5,
  color: "#92400E",
  lineHeight: 1.6,
};

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Bac002ProjectPage() {
  const [docAccordionOpen, setDocAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("kickoff");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (sectionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="BAC-002 · Facturación Electrónica Argentina"
        subtitle="Célula Backoffice · PO: Paula Macias"
        currentSlug="bac-002"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & title ── */}
        <div style={{ marginBottom: 20 }}>
          <a href="/celula/backoffice" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver a Célula Backoffice
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Backoffice</span>
                <span style={badgeStyle("#EA580C", "#FFEDD5")}>🚨 Prioridad alta · Alerta bancaria</span>
                <span style={badgeStyle("#0284C7", "#E0F2FE")}>🧪 Idea · Experimentación</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Facturación Electrónica Argentina
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0" }}>
                Registro de datos de facturación por parte de dropshippers/proveedores en Argentina y panel de aprobación para el equipo financiero, replicando el modelo de Ecuador y Chile con las particularidades tributarias de AFIP/ARCA.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>PO Responsable</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Paula Macias</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Tech Lead / PD</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Jose Giraldo · Michel D. Pino</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Apetencia (tiempo asignado)", value: "2 meses", sub: "Discovery + diseño + hand-off a desarrollo", color: "#EF4444" },
            { label: "Meta cumplimiento fiscal", value: "≥ 70%", sub: "Usuarios AR con facturación aprobada al mes 3", color: "#10B981" },
            { label: "Usuarios activos estimados", value: "~1.000", sub: "Dropshippers/proveedores activos en Argentina", color: "#3B82F6" },
            { label: "SLA de revisión recomendado", value: "48h hábiles", sub: "Desde envío del formulario hasta aprobación/reporte", color: "#8B5CF6" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
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
                  <span style={badgeStyle("#4338CA", "#E0E7FF")}>Fuente de Verdad</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Formato de documentación completo del proyecto BAC-002 (Kick-off → Hallazgos following)
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
                {/* Search bar */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #CBD5E1", borderRadius: 10, padding: "8px 14px", flex: "1 1 280px" }}>
                    <Search size={16} color="#64748B" />
                    <input type="text" placeholder="Buscar en la documentación (ej. CUIT, AFIP, Sumsub, Fixia...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: "none", outline: "none", width: "100%", fontSize: 13, color: "#0F172A", background: "transparent" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
                    Fuente: &quot;Facturación Argentina - Formato de documentación&quot; · Omite Guía de documentación E2E y Estrategia de comunicación
                  </div>
                </div>

                {/* Tab nav */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { id: "kickoff", label: "🧠 1. Kick-off" },
                    { id: "discovery", label: "🫀 2. Discovery" },
                    { id: "definicion", label: "🫀 3. Definición" },
                    { id: "following", label: "🚀 4. Following y lanzamiento" },
                    { id: "handoff", label: "🧠 5. Hand off - DEV & Stakeholders" },
                    { id: "hallazgos", label: "📈 6. Hallazgos following" },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? "#6366F1" : "#ffffff", color: activeTab === tab.id ? "#ffffff" : "#475569", border: activeTab === tab.id ? "1px solid #6366F1" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ══════════════ TAB 1 — KICK-OFF ══════════════ */}
                {activeTab === "kickoff" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={sectionHeadingStyle}><span>🧠 Kick-off de Producto &amp; Documento de Alineación</span></h3>
                      <button onClick={() => handleCopy("kickoff", "BAC-002 Kick-off")} style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {copiedSection === "kickoff" ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        {copiedSection === "kickoff" ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>

                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 10px 0" }}>1.1 Información General &amp; Equipo del Proyecto</h4>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Responsable</th></tr></thead>
                        <tbody>
                          <tr><td style={tableCellStyle}><strong>Célula</strong></td><td style={tableCellStyle}>Backoffice</td></tr>
                          <tr><td style={tableCellStyle}><strong>PM / Owner</strong></td><td style={tableCellStyle}>Paula Macias</td></tr>
                          <tr><td style={tableCellStyle}><strong>Tech Lead</strong></td><td style={tableCellStyle}>Jose Giraldo</td></tr>
                          <tr><td style={tableCellStyle}><strong>Product Designer</strong></td><td style={tableCellStyle}>Michel David Pino Aguilar</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.2 Introducción y Contexto</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 10 }}>
                      Dropi opera en Argentina desde noviembre de 2025, recibiendo pagos de transportadoras a través de una cuenta bancaria local. La plataforma solo genera un informe con el email del usuario y el valor a facturar, sin los datos tributarios (nombre, tipo y número de documento, dirección, teléfono) necesarios para emitir facturas electrónicas válidas ante el fisco argentino.
                    </p>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 10 }}>
                      Esta ausencia derivó en meses sin emitir ninguna factura, generando una <strong>alerta bancaria</strong> por incapacidad de justificar ingresos, con riesgo de cierre de cuenta. Ante el ultimátum del banco, el equipo administrativo emitió de forma consolidada la facturación acumulada de 6 meses, agrupando múltiples períodos en una sola factura por usuario — solo posible con usuarios argentinos identificados que autorizaron facturar bajo su documento. Los usuarios extranjeros (principalmente brasileros) quedaron excluidos, sin validación contable/legal definida.
                    </p>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 16 }}>
                      La facturación electrónica no es opcional: su incumplimiento continuo impide justificar ingresos, genera pérdidas fiscales y puede derivar en disolución de la empresa. Adicionalmente, <strong>Fixia</strong> (transportadora clave) aún retiene fondos pendientes de transferencia por falta de trazabilidad fiscal.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#991B1B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={16} /> Riesgo activo</strong>
                        <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>Alerta bancaria formal por ingresos sin justificación fiscal. Fixia retiene fondos desde nov. 2025 por falta de trazabilidad.</p>
                      </div>
                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#1E40AF", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Rocket size={16} /> Solución propuesta</strong>
                        <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}>Registro de datos de facturación por dropshippers + panel de aprobación financiero, replicando y adaptando el modelo de Ecuador y Chile a las particularidades tributarias de Argentina.</p>
                      </div>
                    </div>

                    <div style={{ background: "#F8FAFC", padding: 14, borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>Apetencia, épica y research</h4>
                      <ul style={{ fontSize: 12.5, color: "#334155", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                        <li><strong>Apetencia:</strong> 2 meses desde inicio de discovery y diseño hasta hand-off a desarrollo.</li>
                        <li><strong>Épica:</strong> DROP-23210 (Jira).</li>
                        <li><strong>Figma Kick-off:</strong> Módulo de datos de facturación (Cuenta V2.0) y Módulo de revisión de datos (Facturación Admin).</li>
                        <li><strong>Research como punto de partida:</strong> comparación de lo que existe como proyecto de facturación vs. lo solicitado para Argentina (board de Figma dedicado).</li>
                      </ul>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.3 Definición del Problema, Impacto y Painpoints</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 10 }}>
                      Dropi actúa como intermediario entre usuarios y transportadoras: las transportadoras liquidan a Dropi por servicios logísticos, y Dropi debe facturar electrónicamente a cada usuario por esos servicios. Sin ingreso registrado, Dropi opera en pérdida fiscal, lo que en Argentina puede derivar en disolución si se mantiene por períodos consecutivos.
                    </p>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 16 }}>
                      A partir de <strong>abril de 2026</strong> Dropi debe retomar la facturación mensual correcta, con plazo hasta mayo para facturar abril — ventana muy corta para implementar la recolección y validación de datos de ~1.000 usuarios activos en Argentina.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>Painpoints</h4>
                        <ul style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                          <li>Ausencia de un módulo de registro de datos de facturación en Argentina desde el día 1.</li>
                          <li>Informe de facturación incompleto (solo email + valor a facturar).</li>
                          <li>Falta de definición legal para usuarios extranjeros (principalmente brasileños).</li>
                          <li>Ausencia de T&amp;C actualizados por país para compartir datos con proveedores de facturación.</li>
                        </ul>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>Impacto</h4>
                        <ul style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                          <li>Riesgo de cierre de cuenta bancaria en Argentina.</li>
                          <li>Fondos retenidos por Fixia desde noviembre de 2025.</li>
                          <li>Proceso manual de emergencia insostenible (2-3 días/persona, no cubre extranjeros).</li>
                          <li>Carga operativa desproporcionada sobre el equipo financiero.</li>
                          <li>El bloqueo de retiro de wallet es el principal motor de registro (validado en Chile/Ecuador).</li>
                        </ul>
                      </div>
                    </div>

                    <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", padding: 16, borderRadius: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#5B21B6", margin: "0 0 8px 0" }}>Objetivos y alineación estratégica</h4>
                      <ul style={{ fontSize: 12.5, color: "#4C1D95", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                        <li><strong>Objetivo de negocio:</strong> implementar el módulo de registro y aprobación de datos de facturación en Argentina, cumpliendo la obligación tributaria y eliminando el riesgo de cierre de cuenta bancaria.</li>
                        <li><strong>Objetivos UX:</strong> registro de datos por el usuario argentino; bloqueo de retiro de wallet para forzar actualización; panel de aprobación con trazabilidad de historial y motivos de rechazo.</li>
                        <li><strong>OKR:</strong> Consolidar operación multi-país · <strong>KR:</strong> OKR 2 – KR1 – 14 países operando al cierre 1016.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* ══════════════ TAB 2 — DISCOVERY ══════════════ */}
                {activeTab === "discovery" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 Discovery del Proyecto (por Áreas, Usuarios, AS-IS, Hipótesis y Requerimientos)</span></h3>

                    <div style={pendingBoxStyle}>
                      ⚠️ En el documento fuente, el numeral 2 (Discovery) quedó como <strong>plantilla sin diligenciar</strong> para este proyecto — los apartados 2.1 a 2.6 conservan los textos guía entre corchetes, sin datos específicos de Argentina cargados aún. Se muestran a continuación tal como están, para que el equipo los complete.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "16px 0" }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2.1 Usuarios Implicados &amp; Estado de Madurez</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, fontStyle: "italic" }}>Perfil Principal / Perfil Secundario y su estado de madurez — pendiente de diligenciar.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2.2 El &quot;AS-IS&quot; (Soluciones Actuales y Limitaciones)</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, fontStyle: "italic" }}>Soluciones actuales y por qué no escalan — pendiente de diligenciar.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2.3 Discovery por Áreas, Bench e Investigación</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, fontStyle: "italic" }}>Hallazgo principal de research, fuentes de datos y benchmark — pendiente de diligenciar.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2.4 Gestión de Riesgos de Producto</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, fontStyle: "italic" }}>Riesgo de valor, usabilidad, factibilidad, viabilidad empresarial y riesgo legal — pendiente de diligenciar.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2.5 Hipótesis, Validaciones y Preguntas Abiertas</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, fontStyle: "italic" }}>Preguntas clave e hipótesis a validar — pendiente de diligenciar.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2.6 Requerimientos Generales, Compatibilidad y Performance</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, fontStyle: "italic" }}>Descripción de la solución, dispositivos, restricciones y performance — pendiente de diligenciar.</p>
                      </div>
                    </div>

                    <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1E40AF", margin: "0 0 8px 0" }}>Nota de contexto (cruce con Kick-off)</h4>
                      <p style={{ fontSize: 12.5, color: "#1E3A8A", margin: 0, lineHeight: 1.6 }}>
                        Aunque el numeral 2 no fue diligenciado como tal, el AS-IS real está descrito en el numeral 1 (Kick-off): el proceso manual de emergencia (consolidación de 6 meses de facturación, exclusión de usuarios extranjeros, alerta bancaria, fondos retenidos por Fixia) funciona como el diagnóstico de partida de este discovery.
                      </p>
                    </div>
                  </div>
                )}

                {/* ══════════════ TAB 3 — DEFINICIÓN ══════════════ */}
                {activeTab === "definicion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 Definición (Propuestas, Alcance, Estimaciones y Próximos Pasos)</span></h3>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.1 Escenarios (mapeo del flujo de usuario y del sistema)</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      {[
                        { color: "#10B981", bg: "#ECFDF5", title: "Flujo feliz", desc: "El usuario, bloqueado al intentar retirar, carga su documento (DNI/CUIT/CUIL), diligencia los campos tributarios; el equipo financiero valida y aprueba; el bloqueo se levanta y los datos quedan disponibles para la facturación." },
                        { color: "#F59E0B", bg: "#FFFBEB", title: "Datos inconsistentes", desc: "El usuario ingresa datos que no coinciden con el documento cargado; el equipo financiero reporta el campo y motivo; el usuario corrige y vuelve a la cola de revisión; el bloqueo de wallet permanece activo hasta aprobación." },
                        { color: "#EF4444", bg: "#FEF2F2", title: "Usuario extranjero sin flujo definido", desc: "Un usuario extranjero (ppalmente brasilero) no tiene documento argentino válido; si el flujo diferenciado no está definido al lanzamiento, queda bloqueado sin ruta clara — replica la exclusión de la solución de emergencia." },
                        { color: "#EF4444", bg: "#FEF2F2", title: "Avalancha de registros al activar el bloqueo", desc: "Pico esperado similar al de Chile (&gt;1.000 solicitudes en los primeros días); sin plan de contingencia con apoyo de otros países, se genera represamiento masivo y alta carga de soporte." },
                        { color: "#F59E0B", bg: "#FFFBEB", title: "Usuarios sin registro aprobado al cierre de facturación", desc: "Al llegar la fecha de emisión de abril, un % de usuarios no habrá completado/aprobado su registro; sin protocolo definido, el equipo debe volver a gestión manual o dejar usuarios sin facturar." },
                        { color: "#64748B", bg: "#F8FAFC", title: "Cambio normativo de AFIP", desc: "El fisco actualiza campos/documentos requeridos; si el módulo no permite ajustes ágiles por país, cualquier cambio implica un nuevo ciclo de desarrollo y un período de desajuste." },
                      ].map((esc, i) => (
                        <div key={i} style={{ borderLeft: `4px solid ${esc.color}`, background: esc.bg, padding: 14, borderRadius: "0 8px 8px 0" }}>
                          <strong style={{ fontSize: 13, color: esc.color }}>{esc.title}</strong>
                          <p style={{ fontSize: 12, color: "#334155", margin: "4px 0 0 0", lineHeight: 1.5 }}>{esc.desc}</p>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>3.2 Fases del Proyecto y Alcance</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                      {[
                        { color: "#3B82F6", bg: "#EFF6FF", title: "FASE 1 (MVP)", desc: "Formulario de datos de facturación para registro de información de usuarios + módulo de revisión de datos por parte de admin.", badge: "Alcance actual", badgeColor: "#1E40AF", badgeBg: "#DBEAFE" },
                        { color: "#8B5CF6", bg: "#F5F3FF", title: "FASE 2 (Evolutivo)", desc: "Validación de datos de facturación con Sumsub." },
                        { color: "#64748B", bg: "#F8FAFC", title: "FASE 3 (Optimización)", desc: "Pulido de UX fina, automatizaciones avanzadas y escalabilidad técnica (sin detalle diligenciado aún)." },
                      ].map((fase, i) => (
                        <div key={i} style={{ borderLeft: `4px solid ${fase.color}`, background: fase.bg, padding: 14, borderRadius: "0 8px 8px 0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: 14, color: fase.color }}>{fase.title}</strong>
                            {fase.badge && <span style={badgeStyle(fase.badgeColor!, fase.badgeBg!)}>{fase.badge}</span>}
                          </div>
                          <p style={{ fontSize: 12, color: "#334155", margin: "6px 0 0 0", lineHeight: 1.5 }}>{fase.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, border: "1px solid #E2E8F0" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>3.3 Estimación de Recursos y Esfuerzo</h4>
                        <ul style={{ fontSize: 12.5, color: "#334155", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                          <li><strong>Esfuerzo técnico:</strong> Medio</li>
                          <li><strong>Tiempo de desarrollo:</strong> 1 sprint</li>
                        </ul>
                      </div>
                      <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, border: "1px solid #E2E8F0" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>3.5 Entregables</h4>
                        <ul style={{ fontSize: 12.5, color: "#334155", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                          <li>Figma final</li>
                          <li>TANGO (guías paso a paso)</li>
                          <li>Loom</li>
                        </ul>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic", marginTop: 12 }}>3.4 Próximos Pasos (plan de trabajo inicial y calendario de reuniones de seguimiento) — pendiente de diligenciar en el documento fuente.</p>
                  </div>
                )}

                {/* ══════════════ TAB 4 — FOLLOWING Y LANZAMIENTO ══════════════ */}
                {activeTab === "following" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🚀 Estrategia de Following y Lanzamiento — Facturación Electrónica Argentina</span></h3>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 16px 0" }}>
                      Anexos: documento inicial de Michel David Pino Aguilar · Flujos de diseño (Figma) por Persona Jurídica, Persona Humana, Persona Extranjera y Alertas por fases (Cuenta V2.0).
                    </p>

                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>1. Contexto y Objetivo de Medición</h4>
                      <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6, margin: "0 0 8px 0" }}>
                        Objetivo del feature: permitir que los usuarios de Argentina configuren de forma autónoma sus datos de facturación electrónica (CUIT/CUIL/Pasaporte, condición IVA, razón social, domicilio fiscal) desde <strong>Configuraciones &gt; Datos Personales &gt; Facturación electrónica</strong>, diferenciando Persona Jurídica, Humana y Extranjera.
                      </p>
                      <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6, margin: 0 }}>
                        <strong>Alcance:</strong> todos los usuarios activos operando en Argentina, segmentados por tipo de persona. Incluye onboarding guiado vía Userpilot (Tour Guide) y sistema progresivo de alertas (Fase 1 informativas → Fase 2 bloqueantes).
                      </p>
                    </div>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>2. Métricas de Impacto (Negocio · Data Warehouse)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Métrica</th><th style={tableHeaderStyle}>Fórmula</th><th style={tableHeaderStyle}>Criterio de éxito</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Tasa de Cumplimiento Fiscal</strong></td><td style={tableCellStyle}>Usuarios AR con facturación aprobada / total activos AR × 100</td><td style={tableCellStyle}>≥ 70% al cierre del mes 3</td></tr>
                        <tr><td style={tableCellStyle}><strong>Retención Post-Configuración</strong></td><td style={tableCellStyle}>Activos en mes N+1 que completaron en mes N / completaron en mes N × 100</td><td style={tableCellStyle}>≥ 85%</td></tr>
                        <tr><td style={tableCellStyle}><strong>Reducción de Tickets de Facturación</strong></td><td style={tableCellStyle}>Tickets tag &quot;facturación AR&quot; mes N / mes N-1 × 100</td><td style={tableCellStyle}>Reducción ≥ 40% al cierre mes 3</td></tr>
                      </tbody>
                    </table>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>3. Métricas de Comportamiento (UX · Userpilot/Analytics)</h4>
                    <ul style={{ fontSize: 12.5, color: "#334155", paddingLeft: 18, lineHeight: 1.7, marginBottom: 20 }}>
                      <li><strong>Target:</strong> dropshippers activos AR sin configuración de facturación (≥1 orden en 60 días, estado &quot;Pendiente&quot; o inexistente).</li>
                      <li><strong>Adopción:</strong> <code>billing_form_submitted_success</code> / <code>billing_tab_viewed</code> × 100 → meta &gt; 50%.</li>
                      <li><strong>Retención:</strong> configuración única con actualizaciones esporádicas; meta ≥ 10% de retorno en el segundo período.</li>
                      <li><strong>Satisfacción:</strong> ≥ 80% responde &quot;Como esperaba&quot; o &quot;Mucho más fácil&quot; a la pregunta de facilidad de configuración.</li>
                    </ul>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>4. Metodología de Validación (Micro-surveys SEQ)</h4>
                    <ul style={{ fontSize: 12.5, color: "#334155", paddingLeft: 18, lineHeight: 1.7, marginBottom: 20 }}>
                      <li><strong>Encuesta 1:</strong> tras <code>billing_form_submitted_success</code> — &quot;¿Qué tan fácil fue completar tus datos de facturación electrónica?&quot; (escala 1-5, repetir a 90 días si actualiza datos).</li>
                      <li><strong>Encuesta 2:</strong> al cerrar un modal bloqueante (Fase 2) — &quot;¿Qué tan clara fue la información sobre por qué necesitas completar tu facturación?&quot; (máx. 1 vez por módulo).</li>
                    </ul>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>5. Esquema de Seguimiento (Piloto de 12 semanas)</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 12, borderRadius: 10 }}>
                        <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Mes 1 (semanal)</strong>
                        <p style={{ fontSize: 11.5, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.5 }}>Adopción inicial, errores de validación, comparación por tipo de persona, tickets, Userpilot Tour.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 12, borderRadius: 10 }}>
                        <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Mes 2 (quincenal)</strong>
                        <p style={{ fontSize: 11.5, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.5 }}>Activación Fase 2 (bloqueantes), primera ronda SEQ, rechazo de datos por revisión, retención temprana.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 12, borderRadius: 10 }}>
                        <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Mes 3 (mensual)</strong>
                        <p style={{ fontSize: 11.5, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.5 }}>Impacto final vs. metas (70% / -40%), retención post-configuración, reporte ejecutivo de cierre de piloto.</p>
                      </div>
                    </div>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>6. Lanzamiento y Kick-off a Marketing</h4>
                    <ul style={{ fontSize: 12.5, color: "#334155", paddingLeft: 18, lineHeight: 1.7, marginBottom: 20 }}>
                      <li><strong>Fase 1 (semanas 1-4):</strong> liberación al 100%, banners informativos no bloqueantes en Home/Historial de Cartera/Cuentas Bancarias/Retiro de Saldo, Tour Userpilot desde Home.</li>
                      <li><strong>Fase 2 (semanas 5+):</strong> alertas bloqueantes en Transferencia entre wallets, Retiro de saldo y funcionalidades financieras críticas.</li>
                      <li><strong>Canales:</strong> Tour Userpilot (~12 pasos), banners contextuales, email transaccional (semana 2 y 4), push, TANGO (guías de uso).</li>
                    </ul>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>7. Esquema de Eventos Userpilot</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Evento</th><th style={tableHeaderStyle}>Trigger</th></tr></thead>
                      <tbody>
                        {[
                          ["billing_tab_viewed", "Carga de la vista de facturación"],
                          ["billing_tutorial_clicked", "Clic en enlace de tutorial"],
                          ["billing_person_type_selected", "Selección en dropdown \"Tipo de persona\""],
                          ["billing_document_uploaded", "Upload exitoso en la zona de drag & drop"],
                          ["billing_form_submitted_success", "Respuesta exitosa del endpoint \"Guardar facturación\""],
                          ["billing_form_submitted_error", "Respuesta de error del endpoint"],
                          ["billing_alert_banner_clicked", "Clic en el CTA del banner (Fase 1)"],
                          ["billing_alert_modal_shown", "Render del modal de bloqueo (Fase 2)"],
                          ["billing_alert_modal_cta_clicked", "Clic en \"Completar datos\" del modal"],
                          ["billing_userpilot_tour_started / _completed / _dismissed", "Inicio / fin / cierre del Tour Guide"],
                          ["billing_terms_accepted", "Check en el checkbox de T&C"],
                          ["billing_status_changed", "Cambio de estado en backend (Pendiente → En revisión → Aprobado/Rechazado)"],
                        ].map(([ev, tr]) => (
                          <tr key={ev}><td style={tableCellStyle}><code>{ev}</code></td><td style={tableCellStyle}>{tr}</td></tr>
                        ))}
                      </tbody>
                    </table>

                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>8. Resumen de Flujos Entregados a T.I.</h4>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px 0" }}>Formulario en Configuraciones &gt; Datos Personales &gt; tab &quot;Facturación electrónica&quot;:</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Sección</th><th style={tableHeaderStyle}>P. Jurídica</th><th style={tableHeaderStyle}>P. Humana</th><th style={tableHeaderStyle}>P. Extranjera</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Tipo documento</td><td style={tableCellStyle}>CUIT/CUIL</td><td style={tableCellStyle}>CUIT/CUIL/DNI</td><td style={tableCellStyle}>Pasaporte</td></tr>
                        <tr><td style={tableCellStyle}>Condición IVA</td><td style={tableCellStyle}>Dropdown completo</td><td style={tableCellStyle}>Dropdown completo</td><td style={tableCellStyle}>Consumidor Final (fijo)</td></tr>
                        <tr><td style={tableCellStyle}>Upload documento fiscal</td><td style={tableCellStyle}>No</td><td style={tableCellStyle}>Sí (JPG/PDF/JPEG/PNG ≤10MB)</td><td style={tableCellStyle}>Sí (Pasaporte/ID extranjera)</td></tr>
                        <tr><td style={tableCellStyle}>Consentimientos</td><td style={tableCellStyle}>T&amp;C Dropi AR</td><td style={tableCellStyle}>T&amp;C + Política datos personales</td><td style={tableCellStyle}>T&amp;C + Política de privacidad</td></tr>
                      </tbody>
                    </table>

                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 14 }}>
                      <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.6 }}>
                        Sistema de alertas progresivas: <strong>Fase 1</strong> — banners informativos en Home, Historial de Cartera, Cuentas Bancarias y Retiro de Saldo. <strong>Fase 2</strong> — modal obligatorio bloqueante en Transferencia entre wallets, Retiro de saldo, Historial de Cartera y Cuentas Bancarias.
                      </p>
                    </div>
                  </div>
                )}

                {/* ══════════════ TAB 5 — HAND OFF DEV & STAKEHOLDERS ══════════════ */}
                {activeTab === "handoff" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🧠 Hand-off to DEV y Stakeholders</span></h3>
                    <span style={badgeStyle("#7C3AED", "#F3E8FF")}>Segmento: Backoffice</span>

                    <div style={{ background: "#FAF5FF", border: "1px solid #E9D5FF", padding: 16, borderRadius: 10, margin: "16px 0" }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#6B21A8", margin: "0 0 8px 0" }}>Job To Be Done</h4>
                      <p style={{ fontSize: 12.5, color: "#581C87", margin: 0, lineHeight: 1.6 }}>
                        Cuando yo, como dropshipper o proveedor activo en Argentina, intento retirar mis fondos de la wallet, quiero poder registrar mis datos tributarios (tipo de persona, condición frente al IVA, documento, dirección y documentos de respaldo) directamente en la plataforma, para que Dropi pueda emitirme una factura electrónica válida ante el fisco argentino, desbloquear mis movimientos financieros y operar con normalidad.
                      </p>
                    </div>

                    {/* Módulo A */}
                    <h4 style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}><Layers size={16} color="#6366F1" /> Módulo A: Formulario de Datos de Facturación Electrónica</h4>
                    <p style={{ fontSize: 11.5, color: "#64748B", margin: "4px 0 14px 0" }}>
                      Figma · Matriz de datos de facturación Argentina · Prototipo en dropitesters (Configuraciones &gt; Datos personales, login Google, Antigua Arquitectura &gt; Dropshipper).
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      {[
                        { t: "Estructura y visualización del formulario", d: "3 escenarios: vista inicial con 3 bloques (Contacto/Empresa/Documento Legal, Design System v2.0, responsive y accesible); usuario sin datos → estado \"Pendiente\" y módulos financieros inhabilitados; usuario con datos previos → formulario precargado con estado visible (En revisión/Aprobado/Con errores)." },
                        { t: "Lógica dinámica y condicional", d: "Provincia/Ciudad se vuelven dropdown si país = Argentina y texto libre si no. Tipo de persona: 2 opciones (Humana/Jurídica) si país = Argentina, o \"Extranjero\" fijo si no. Condición IVA depende del tipo de persona (Humana: Consumidor Final/Resp. Inscripto/Monotributo; Jurídica: Resp. Inscripto/Exento; Extranjero: solo Consumidor Final) y se limpia al cambiar el tipo de persona." },
                        { t: "Tipo de documento según combinación", d: "AR+Humana+Consumidor Final → DNI/CUIT/CUIL. AR+Humana+Resp. Inscripto o Monotributo → solo CUIT. AR+Jurídica (cualquier condición IVA) → solo CUIT. País≠AR+Extranjero → Pasaporte/Identificación extranjera." },
                        { t: "Validaciones del número de documento", d: "CUIT/CUIL: 11 dígitos numéricos (limpia guiones/puntos). DNI: 7-8 dígitos (limpia puntos/espacios). Pasaporte: 6-15 caracteres alfanuméricos, sin limpieza. Identificación extranjera: alfanumérico variable, limpia espacios. Botón Guardar deshabilitado si no cumple el patrón." },
                        { t: "Carga de documentos por combinación fiscal", d: "Humana+Consumidor Final: 1 archivo (DNI frente/dorso). Humana+Resp. Inscripto: 2 archivos (DNI + constancia ARCA Resp. Inscripto). Humana+Monotributo: 2 archivos (DNI + constancia Monotributo A-K). Jurídica+Resp. Inscripto: 2 archivos (constancia ARCA/IIBB + estatuto/contrato social IGJ). Jurídica+Exento: 2 archivos (constancia ARCA + certificado de exención). Extranjero: 1 archivo (pasaporte o constancia tributaria de origen)." },
                        { t: "Validaciones de archivo", d: "Formatos permitidos: JPG, JPEG, PNG, PDF. Tamaño máximo: 10MB. Mensajes de error específicos por formato/tamaño/fallo de subida; reintento sin perder el resto del formulario." },
                        { t: "Visualización de documentos cargados", d: "PDF se abre en nueva pestaña (con descarga/impresión); imagen abre modal centrado en alta resolución con botón de cierre." },
                        { t: "Habilitación del botón Guardar", d: "Requiere campos completos + ambos checkboxes (Aviso de privacidad y T&C) + validación OTP de 2FA (6 dígitos) antes de persistir el cambio." },
                        { t: "Estados del formulario y transiciones", d: "Guardado exitoso → \"En revisión\" (campos bloqueados, módulos financieros bloqueados, auditoría). Aprobación → \"Aprobado\" (has_access_to_money_modules=true, notificación única). Reporte de errores → \"Con errores reportados\" (campo marcado, notificación por correo, formulario editable). Cualquier edición tras \"Aprobado\" vuelve a \"En revisión\"." },
                        { t: "Fases del sistema de alertas y bloqueo", d: "Fase 1 (al salir a producción): alertas según estado del formulario (En revisión / Con errores) en Home, Historial de Cartera, Transferencia entre wallets, Cuentas bancarias y Retiro de saldo. Fase 2 (días después): alertas por datos personales/facturación incompletos con banner persistente y botón \"Completar\". Debe quedar configurable vía switch en BDA para activar el bloqueo sin deploy." },
                        { t: "Bloqueo de módulos financieros por estado fiscal", d: "fiscal_status ≠ \"aprobado\" → backend inhabilita transferencias entre wallets y retiros; frontend muestra la alerta correspondiente. fiscal_status = \"aprobado\" → operación normal en todos los endpoints." },
                        { t: "Auditoría y logs", d: "Todo cambio en datos fiscales registra: campo modificado, valor anterior, valor nuevo, usuario que editó, fecha, hora, IP/dispositivo." },
                      ].map((f, i) => (
                        <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14 }}>
                          <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{f.t}</strong>
                          <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.6 }}>{f.d}</p>
                        </div>
                      ))}
                    </div>

                    {/* Módulo B */}
                    <h4 style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}><ShieldCheck size={16} color="#0EA5E9" /> Módulo B: Panel de Revisión de Datos de Facturación (Admin)</h4>
                    <p style={{ fontSize: 11.5, color: "#64748B", margin: "4px 0 10px 0" }}>Figma · Ruta: Menú Usuarios &gt; Revisión de facturación · Acceso exclusivo administradores Dropi (marcas blancas no lo ven).</p>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Estado</th><th style={tableHeaderStyle}>Acciones disponibles para el admin</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><span style={badgeStyle("#475569", "#F1F5F9")}>Pendiente</span></td><td style={tableCellStyle}>Sin datos fiscales; botones Aprobar/Reportar deshabilitados u ocultos; historial vacío.</td></tr>
                        <tr><td style={tableCellStyle}><span style={badgeStyle("#B45309", "#FEF3C7")}>En revisión</span></td><td style={tableCellStyle}>Datos completos visibles; &quot;Aprobar usuario&quot; y &quot;Reportar usuario&quot; habilitados; acceso al historial.</td></tr>
                        <tr><td style={tableCellStyle}><span style={badgeStyle("#B91C1C", "#FEE2E2")}>Reportado</span></td><td style={tableCellStyle}>Solo puede seguir reportando otros campos; no aprobable hasta que el usuario edite.</td></tr>
                        <tr><td style={tableCellStyle}><span style={badgeStyle("#047857", "#D1FAE5")}>Aprobado</span></td><td style={tableCellStyle}>Solo puede reportar si detecta un nuevo error; al reportar, vuelve a &quot;Reportado&quot;.</td></tr>
                      </tbody>
                    </table>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                      {[
                        { t: "Vista principal — listado de usuarios", d: "Tabs con contadores dinámicos: Todos | En revisión | Aprobados | Reportados | Pendientes. Columnas: ID User, Estado (badge: amarillo/verde/rojo/gris), Tipo de Usuario, Nombre, Correo, Nacionalidad, Marca Blanca, Acciones. Empty state por tab sin resultados." },
                        { t: "Orden y filtros combinados", d: "Orden por defecto: más recientes (ORDER BY created_at DESC), opción \"más antiguos\". Filtros combinables: Nacionalidad, Marca Blanca (solo AR), Tipo de usuario (Dropshipper/Proveedor), búsqueda por ID/correo. GET /usuarios/facturacion aplica todos los filtros con AND." },
                        { t: "Modal de datos de facturación", d: "Comportamiento de botones Aprobar/Reportar según estado (ver tabla arriba); visor de documentos con navegación entre archivos, zoom, cambio de página y descarga." },
                        { t: "Tab Historial", d: "Listado cronológico descendente (fecha, acción, revisado por, campo reportado, comentario ≤200 caracteres). GET /usuarios/{id}/facturacion/historial. Filtros: rango de fechas, campo reportado, búsqueda por revisor/comentario (AND combinable), ordenamiento recientes/antiguos. Empty states diferenciados sin historial vs. sin coincidencias de filtro." },
                        { t: "Acción de Aprobación", d: "Modal de confirmación (Volver/Aprobar); al aprobar cambia a \"Aprobado\", habilita has_access_to_money_modules, envía email de notificación, registra log. Error del backend → mantiene estado anterior y permite reintentar." },
                        { t: "Acción de Reporte de errores", d: "Selector múltiple de campos (checkboxes, sin límite) + textarea de comentario (máx. 200 caracteres) → botón \"Reportar\" solo se habilita con ambos completos. GET /catalogs/campos-tributarios entrega el catálogo. Cada campo reportado genera un registro independiente; el estado cambia a \"Reportado\" una sola vez; campos ya reportados quedan deshabilitados hasta que el usuario corrija." },
                        { t: "Exportación de datos de facturación", d: "Excel con patrón USUARIOS-DATOS-FACTURACION-MM-YYYY.xlsx; exporta todo el tab activo, filas seleccionadas, o respeta filtros aplicados (solo el tab \"Todos\" exporta todos los estados). 17 columnas estándar (ID, Nombre, Correo, Marca Blanca, Estado, Nombre/Razón social, País, Provincia, Ciudad, Dirección, Email facturación, Teléfono, Tipo persona, Condición IVA, Tipo documento, Número documento, Documento cargado). Exportación individual disponible desde el modal del usuario." },
                        { t: "Reporte Excel desde Órdenes", d: "Descarga desde el módulo Órdenes (\"Facturación Dropshippers\"/\"Facturación Suppliers autofill\") con 19 columnas, añadiendo los mismos campos fiscales a las columnas ya existentes del reporte (comisión, flete, fulfillment, etc.), sin alterar su comportamiento previo." },
                      ].map((f, i) => (
                        <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14 }}>
                          <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{f.t}</strong>
                          <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.6 }}>{f.d}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recomendaciones / Riesgos */}
                    <h4 style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", marginTop: 24 }}>Recomendaciones / Comentarios / Consideraciones</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12 }}>
                      <div style={{ background: "#F0FDFB", border: "1px solid #99F6E4", borderRadius: 10, padding: 14 }}>
                        <strong style={{ fontSize: 12.5, color: "#0F766E", display: "flex", alignItems: "center", gap: 6 }}><RefreshCw size={14} /> Técnicas</strong>
                        <ul style={{ fontSize: 11.5, color: "#134E4A", margin: "6px 0 0 0", paddingLeft: 16, lineHeight: 1.6 }}>
                          <li>Reutilizar el módulo de Ecuador/Chile como base.</li>
                          <li>Catálogos (persona, IVA, documento) configurables en BD, no hardcodeados.</li>
                          <li>Documentos en bucket privado con URLs firmadas temporales.</li>
                          <li>Control de acceso por rol validado en backend en cada request.</li>
                          <li>Auditoría completa de cambios en datos fiscales.</li>
                          <li>Estado fiscal como fuente única de verdad para módulos financieros.</li>
                          <li>Envío de correos con reintentos (máx. 2) y logging.</li>
                        </ul>
                      </div>
                      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 14 }}>
                        <strong style={{ fontSize: 12.5, color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}><Target size={14} /> Negocio</strong>
                        <ul style={{ fontSize: 11.5, color: "#78350F", margin: "6px 0 0 0", paddingLeft: 16, lineHeight: 1.6 }}>
                          <li>El bloqueo de wallet es el gatillo de activación más poderoso.</li>
                          <li>Comunicar el proceso (email + push) antes del bloqueo, no después.</li>
                          <li>Definir y publicar SLA de revisión desde el día 1 (48h hábiles recomendado).</li>
                          <li>Planificar apoyo de otros países para el pico inicial de registros.</li>
                          <li>Actualizar T&amp;C y política de privacidad AR antes del go-live.</li>
                        </ul>
                      </div>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: 14 }}>
                        <strong style={{ fontSize: 12.5, color: "#991B1B", display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} /> Riesgos</strong>
                        <ul style={{ fontSize: 11.5, color: "#7F1D1D", margin: "6px 0 0 0", paddingLeft: 16, lineHeight: 1.6 }}>
                          <li>Represamiento del panel admin sin capacidad de revisión suficiente.</li>
                          <li>Documentos mal cargados → alto volumen de reportes y re-trabajo.</li>
                          <li>Cambios normativos de AFIP/ARCA sin catálogos configurables.</li>
                          <li>Desincronización de estado fiscal entre módulos financieros.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════════ TAB 6 — HALLAZGOS FOLLOWING ══════════════ */}
                {activeTab === "hallazgos" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>📈 Hallazgos Following (Monitoreo Post-Lanzamiento)</span></h3>
                    <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
                      Propósito: monitorear el comportamiento real de los usuarios, validar las hipótesis del discovery y registrar iteraciones o errores detectados en producción.
                    </p>

                    <div style={pendingBoxStyle}>
                      ⚠️ El proyecto aún no ha salido a producción — este numeral quedó como <strong>plantilla sin diligenciar</strong> en el documento fuente. Se deja la estructura a llenar una vez arranque el following.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "16px 0" }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}><Database size={14} /> Fuentes de Información y Control</h4>
                        <ul style={{ fontSize: 12, color: "#94A3B8", margin: "6px 0 0 0", paddingLeft: 18, lineHeight: 1.6, fontStyle: "italic" }}>
                          <li>Link de dashboard (Mixpanel/Looker/Amplitude) — pendiente.</li>
                          <li>Link de bitácora de bugs/feedback/despliegues — pendiente.</li>
                        </ul>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /> Ciclo de Seguimiento Actual</h4>
                        <ul style={{ fontSize: 12, color: "#94A3B8", margin: "6px 0 0 0", paddingLeft: 18, lineHeight: 1.6, fontStyle: "italic" }}>
                          <li>Fecha de inicio following — pendiente.</li>
                          <li>Fecha de review — pendiente.</li>
                          <li>Países en implementación vs. en following — pendiente.</li>
                        </ul>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}><ShieldAlert size={14} /> Resumen Semanal</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", margin: "6px 0 0 0", lineHeight: 1.6, fontStyle: "italic" }}>Espacio para sintetizar KPI norte, adopción y salud del producto en los últimos 7 días — pendiente hasta el lanzamiento.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}><Users size={14} /> Comentarios, Conclusiones y Próximos Pasos</h4>
                        <p style={{ fontSize: 12, color: "#94A3B8", margin: "6px 0 0 0", lineHeight: 1.6, fontStyle: "italic" }}>Notas del equipo (PM/PD/Dev) y acciones inmediatas — pendiente hasta el lanzamiento.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
