"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  Search, ChevronDown, ChevronUp, Copy, Check, FileText,
  User, ShieldCheck, Cpu, Rocket, AlertTriangle, Layers, Target, Clock,
  BarChart2, TrendingUp, TrendingDown, Activity, ShieldAlert, Users,
  RefreshCw, Database, AlertCircle,
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

/* ── Mini components ── */
function HBar({ label, value, max, color, suffix = "%" }: {
  label: string; value: number; max: number; color: string; suffix?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#334155", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{value.toLocaleString()}{suffix}</span>
      </div>
      <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function KPI({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon?: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${color}20`, borderRadius: 12, padding: "14px 18px", borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        {icon && <div style={{ color, opacity: 0.7 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DashSection({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "1.5px solid #E2E8F0" }}>
        <div style={{ color: "#0EA5E9" }}>{icon}</div>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Bac001ProjectPage() {
  const [docAccordionOpen, setDocAccordionOpen] = useState(true);
  const [dashAccordionOpen, setDashAccordionOpen] = useState(false);
  const [sumsubAccordionOpen, setSumsubAccordionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("kickoff");
  const [activeDashTab, setActiveDashTab] = useState<string>("overview");
  const [activeSumsubTab, setActiveSumsubTab] = useState<string>("resumen");
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
        title="BAC-001 · Validación de Identidad Países"
        subtitle="Célula Backoffice · PO: Paula Macias"
        currentSlug="bac-001"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "32px", flex: 1 }}>

        {/* ── Breadcrumb & title ── */}
        <div style={{ marginBottom: 20 }}>
          <a href="/celula/backoffice" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver a Célula Backoffice
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Backoffice</span>
                <span style={badgeStyle("#EA580C", "#FFEDD5")}>🚨 Prioridad P0</span>
                <span style={badgeStyle("#0284C7", "#E0F2FE")}>🧪 Phase 0 - Discovery / Definición</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Validación de Identidad Países (KYC / KYB / KYT)
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0" }}>
                Unificación global de verificación de identidad de Dropshippers, Proveedores y CriptoWallets en los 12 países de LATAM.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>PO Responsable</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Paula Macias</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Product Designer</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Catalina Giraldo</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Prototipo ── */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <strong style={{ fontSize: 13, display: "block", color: "#0F172A" }}>🧪 Prototipo — Flujo de validación (perfil Dropshipper)</strong>
            <span style={{ fontSize: 12, color: "#64748B" }}>Demo interactiva Fase 5 en dropitesters.co, controlador con perfil dropshipper</span>
          </div>
          <a
            href="https://www.dropitesters.co/new/fase5-demo/controlador?profile=dropshipper"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12.5, fontWeight: 750, color: "#fff", background: "#6366F1", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            Ver Prototipo <span style={{ fontSize: 11 }}>➔</span>
          </a>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Validación Manual CO (AS-IS)", value: "~40%", sub: "3.000–4.000 casos manuales/mes", color: "#EF4444" },
            { label: "Meta Validación Manual", value: "< 8%", sub: "Automatización con SumSub + Truora", color: "#10B981" },
            { label: "Alcance Geográfico", value: "12 Países", sub: "Colombia, México, Brasil, Chile...", color: "#3B82F6" },
            { label: "Respuesta Promedio", value: "20 seg", sub: "92% conversión auto en Colombia", color: "#8B5CF6" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION 1 — DOCUMENTACIÓN
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #6366F1", borderRadius: 16, marginBottom: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(99,102,241,0.08)" }}>
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
                  Especificaciones completas de Producto, TI, UX y Gobierno para el proyecto BAC-001
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
                    <input type="text" placeholder="Buscar en la documentación (ej. Sumsub, Truora, KYB, C4...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: "none", outline: "none", width: "100%", fontSize: 13, color: "#0F172A", background: "transparent" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Documento de hand-off unificado · PO: Paula Macias</div>
                </div>

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

                {/* TAB 1 */}
                {activeTab === "kickoff" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={sectionHeadingStyle}><span>🧠 1. Kick-off &amp; Contexto General</span></h3>
                      <button onClick={() => handleCopy("kickoff", "BAC-001 Kick-off")} style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {copiedSection === "kickoff" ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        {copiedSection === "kickoff" ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 10px 0" }}>1.1 Equipo del Proyecto</h4>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Responsable</th><th style={tableHeaderStyle}>Detalle</th></tr></thead>
                        <tbody>
                          <tr><td style={tableCellStyle}><strong>Owner / PM</strong></td><td style={tableCellStyle}>Paula Macias</td><td style={tableCellStyle}>Definición de producto &amp; alcance funcional</td></tr>
                          <tr><td style={tableCellStyle}><strong>Product Designer</strong></td><td style={tableCellStyle}>Catalina Giraldo</td><td style={tableCellStyle}>Flujo unificado UX &amp; diseño visual</td></tr>
                          <tr><td style={tableCellStyle}><strong>Stakeholders</strong></td><td style={tableCellStyle}>Legal, Financiero y Tesorería</td><td style={tableCellStyle}>Cumplimiento KYC / KYB / KYT</td></tr>
                          <tr><td style={tableCellStyle}><strong>Célula</strong></td><td style={tableCellStyle}>Backoffice</td><td style={tableCellStyle}>Prioridad P0 (Transversal)</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.2 ¿Por qué AHORA?</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>Dropi opera en 12 países de LATAM sin un sistema de validación de identidad unificado. El <strong>40% de las validaciones en Colombia requieren intervención manual</strong>.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#991B1B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={16} /> Riesgo Legal Activo</strong>
                        <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>Retiros en Tether sin screening (KYT). PJ con 0% KYB. Falsos positivos en extranjeros por búsqueda por nombre.</p>
                      </div>
                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#1E40AF", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Rocket size={16} /> Oportunidad Sumsub (Mayo 2026)</strong>
                        <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}>KYC+KYB+KYT en una sola plataforma, 240+ países, <strong>92% conversión automática</strong> y 20 segundos de respuesta promedio.</p>
                      </div>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>1.3 Objetivos</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20 }}>
                      <li><strong>Cumplimiento Regulatorio:</strong> KYC en PN, KYB en PJ (países P0) y KYT para retiros cripto.</li>
                      <li><strong>Eficiencia Operativa:</strong> Reducir validación manual del 40% a menos del 8%.</li>
                      <li><strong>UX Unificada:</strong> Completar validación y datos de facturación en un único momento.</li>
                    </ul>
                  </div>
                )}

                {/* TAB 2 */}
                {activeTab === "discovery" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 2. Discovery &amp; Diagnóstico AS-IS</span></h3>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: 16, borderRadius: 10, marginBottom: 20 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: "#92400E", margin: "0 0 8px 0" }}>Diagnóstico del Proceso Actual (Truora)</h4>
                      <ul style={{ fontSize: 13, color: "#78350F", margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                        <li><strong>40% Validación Manual:</strong> 3.000–4.000 casos/mes requieren revisión manual por Back Office.</li>
                        <li><strong>Falla en Apple:</strong> Truora no funciona adecuadamente en iOS ni MacBook.</li>
                        <li><strong>Falsos Positivos en Extranjeros:</strong> Búsqueda por nombre genera homónimos.</li>
                        <li><strong>Fragmentación de Flujo:</strong> El usuario ingresa datos hasta 3 veces (Registro, Validación, Facturación).</li>
                      </ul>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>Dropshippers &amp; Proveedores</h4>
                        <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>Fricción en el primer retiro. Fotos borrosas sin reintento. Sin KYB para empresas.</p>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>Cripto / Wallet (Tether USDT)</h4>
                        <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>Cero screening de wallets (KYT). Sin cruce con OFAC/ONU → riesgo de sanciones regulatorias.</p>
                      </div>
                    </div>

                    {/* ── 2.2 AS-IS Facturación — Chile & Ecuador ── */}
                    <div style={{ marginTop: 28, paddingTop: 20, borderTop: "2px dashed #E2E8F0" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                        <Layers size={16} color="#6366F1" /> 2.2 AS-IS Facturación — Chile &amp; Ecuador
                      </h4>
                      <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 16px 0" }}>
                        Fuente: reuniones &quot;Hablemos de la revisión de facturación&quot; · Chile (Luna Espejo, Matías Yañez) y Ecuador (Nataly Moreno Bernal) · 2026-07-22
                      </p>

                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                        <h5 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Flujo AS-IS común (ambos países)</h5>
                        <ol style={{ fontSize: 12, color: "#334155", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                          <li><strong>Recepción:</strong> el dropshipper carga (o no) sus datos de facturación/identificación en Dropi.</li>
                          <li><strong>Revisión visual manual:</strong> el analista compara la imagen del documento vs. los datos digitados.</li>
                          <li><strong>Corrección manual:</strong> si algo es corregible, el analista edita el registro para que coincida con el documento, dejando marca de edición manual.</li>
                          <li><strong>Aprobación o rechazo</strong> según coincidencia de datos.</li>
                          <li><strong>Búsqueda manual de datos faltantes:</strong> para usuarios sin datos cargados, el analista los busca uno a uno en &quot;datos personales&quot; dentro de Dropi.</li>
                          <li><strong>Validación matemática (solo Chile):</strong> &quot;validador módulo 11&quot; en Excel para reducir falsos RUT — no da certeza 100%.</li>
                        </ol>
                      </div>

                      <h5 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Diferencias clave</h5>
                      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                        <thead><tr><th style={tableHeaderStyle}>Aspecto</th><th style={tableHeaderStyle}>🇨🇱 Chile</th><th style={tableHeaderStyle}>🇪🇨 Ecuador</th></tr></thead>
                        <tbody>
                          <tr><td style={tableCellStyle}><strong>Responsable en operación</strong></td><td style={tableCellStyle}>Matías Yañez (auxiliar) + Luna Espejo (lead)</td><td style={tableCellStyle}>José (analista) + Nataly Moreno (soporte/gestión)</td></tr>
                          <tr><td style={tableCellStyle}><strong>Paso extra al aprobar</strong></td><td style={tableCellStyle}>No aplica</td><td style={tableCellStyle}><strong>Descongelar wallet manual</strong> en 2do portal — bug: la aprobación debería descongelar automático y no lo hace</td></tr>
                          <tr><td style={tableCellStyle}><strong>Validación matemática</strong></td><td style={tableCellStyle}>Sí — módulo 11 (dígito verificador)</td><td style={tableCellStyle}>No — solo comparación visual</td></tr>
                          <tr><td style={tableCellStyle}><strong>Reedición tras aprobar</strong></td><td style={tableCellStyle}>No mencionada explícitamente</td><td style={tableCellStyle}>Bloqueada; usuario pide por botón flotante y el analista &quot;rechaza&quot; para reabrir edición</td></tr>
                          <tr><td style={tableCellStyle}><strong>Canal de soporte facturación</strong></td><td style={tableCellStyle}>No existe en Intercom — llega por WhatsApp</td><td style={tableCellStyle}>No existe canal directo — llega por botón flotante genérico → triage → cola</td></tr>
                          <tr><td style={tableCellStyle}><strong>Bug de plataforma principal</strong></td><td style={tableCellStyle}>No permite seleccionar tipo de documento &quot;RUT&quot; en algunos casos → error &quot;documento no válido&quot;</td><td style={tableCellStyle}>Aprobación no descongela wallet automáticamente desde el último bloqueo del fin de semana</td></tr>
                        </tbody>
                      </table>

                      <h5 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Métricas — Chile</h5>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
                        <KPI label="Volumen entrante" value="100–200/día" sub="180–230 en ventana 4:30pm–8am · 300–400 tras fin de semana" color="#EF4444" icon={<TrendingUp size={16} />} />
                        <KPI label="Rendimiento por analista" value="100–150/día" sub="Validaciones completas por persona" color="#3B82F6" icon={<Users size={16} />} />
                        <KPI label="Tiempo por caso" value="1:10–3:30 min" sub="Simple vs. con corrección de pasaporte/cédula extranjera" color="#8B5CF6" icon={<Clock size={16} />} />
                        <KPI label="Búsqueda manual pendiente" value="~600 registros" sub="Consume 1–3 días hábiles según carga" color="#F59E0B" icon={<Database size={16} />} />
                        <KPI label="Meta operativa diaria" value="0–60 pendientes" sub="Cierre de día objetivo" color="#10B981" icon={<Target size={16} />} />
                        <KPI label="Reducción de carga vs. antes del módulo" value="~50%" sub="De ≥1 semana a ~3 días; de ~100 a 400–500 registros/mes gestionados" color="#0EA5E9" icon={<Activity size={16} />} />
                      </div>

                      <h5 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Métricas — Ecuador</h5>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
                        <KPI label="Volumen entrante normal" value="20–28/día" sub="Rango 5–30/día, operación con 1 sola persona (José)" color="#EF4444" icon={<TrendingUp size={16} />} />
                        <KPI label="Equipo" value="1 + refuerzo" sub="+2 personas turno noche durante bloqueo actual" color="#3B82F6" icon={<Users size={16} />} />
                        <KPI label="Backlog al 2026-07-22" value="111 pendientes" sub="De revisión/aprobación de facturación" color="#F59E0B" icon={<Database size={16} />} />
                        <KPI label="Wallets descongeladas" value="207" sub="Manualmente, desde que inició el archivo de control" color="#8B5CF6" icon={<RefreshCw size={16} />} />
                        <KPI label="SLA" value="Mismo día" sub="3 cortes de revisión al día · nunca &gt;2–3 días sin gestionar" color="#10B981" icon={<Clock size={16} />} />
                        <KPI label="Solicitudes de reedición" value="3–5/día" sub="Usuarios ya aprobados que piden cambiar datos" color="#0EA5E9" icon={<Activity size={16} />} />
                      </div>

                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 16 }}>
                        <h5 style={{ fontSize: 13, fontWeight: 800, color: "#1E40AF", margin: "0 0 10px 0" }}>Insights transversales para el nuevo país (Argentina)</h5>
                        <ul style={{ fontSize: 12, color: "#1E3A8A", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
                          <li><strong>Causa raíz compartida:</strong> el trabajo manual existe porque los dropshippers no completan sus datos en la plataforma — no es un problema de eficiencia del analista.</li>
                          <li><strong>Bugs de plataforma generan trabajo manual adicional</strong> como parche, no como parte natural del proceso (selección de RUT en Chile, descongelamiento de wallet en Ecuador, límite de 5MB en adjuntos).</li>
                          <li><strong>No existe canal de soporte dedicado a facturación en Intercom</strong> en Chile ni Ecuador (Colombia sí lo tiene) — acordado implementarlo primero en Chile (ETA viernes) y luego extender.</li>
                          <li><strong>Decisión de diseño pendiente:</strong> ¿bloquear datos de facturación tras aprobación o permitir edición libre? Percepción de Ecuador: mejor mantenerlo bloqueado para evitar ciclo interminable de re-revisiones.</li>
                          <li><strong>Enforcement inconsistente:</strong> el bloqueo de retiros por falta de datos de facturación no se aplica parejo — usuarios VIP a veces quedan exentos.</li>
                          <li><strong>Automatización futura (solo mencionada en Chile):</strong> proyecto de OCR (&quot;Sonso&quot;) para validar que el documento exista realmente, aún en etapa temprana de planeación legal.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3 */}
                {activeTab === "definicion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 3. Definición de Fases del Proyecto</span></h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { color: "#3B82F6", bg: "#EFF6FF", title: "FASE 0 — Validación Asistida sin desarrollo en Core", desc: "Captura vía UserPilot + webhook API intermedia. Valida con Sumsub sin cambios en el monolito.", badge: "Fase Actual", badgeColor: "#1E40AF", badgeBg: "#DBEAFE" },
                        { color: "#8B5CF6", bg: "#F5F3FF", title: "FASE 1 — Bloqueo Cruzado de Usuarios Baneados", desc: "Cruce inmediato de listas de bloqueo entre países. Bloqueo en CO → replica en todos los países." },
                        { color: "#10B981", bg: "#ECFDF5", title: "FASE 2 — Integración Nativa (Colombia Primero)", desc: "Flujo unificado: Formulario + Truora KYC PN + Sumsub KYB PJ. Autocompletado de facturación." },
                        { color: "#F59E0B", bg: "#FFFBEB", title: "FASE 3 — KYT (Screening de Cripto &amp; Retiros)", desc: "Análisis de riesgo de wallets Tether USDT antes de autorizar desembolso." },
                        { color: "#64748B", bg: "#F8FAFC", title: "FASE 4 — Réplica Multipaís", desc: "Despliegue a México, Panamá, Guatemala, Chile, Ecuador, Brasil y el resto de 12 países LATAM." },
                      ].map((fase, i) => (
                        <div key={i} style={{ borderLeft: `4px solid ${fase.color}`, background: fase.bg, padding: 14, borderRadius: "0 8px 8px 0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: 14, color: fase.color }} dangerouslySetInnerHTML={{ __html: fase.title }} />
                            {fase.badge && <span style={badgeStyle(fase.badgeColor!, fase.badgeBg!)}>{fase.badge}</span>}
                          </div>
                          <p style={{ fontSize: 12, color: "#334155", margin: "6px 0 0 0", lineHeight: 1.5 }}>{fase.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4 */}
                {activeTab === "following" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 4. Following, Métricas &amp; Plan de Medición</span></h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, border: "1px solid #E2E8F0" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Métricas de Impacto (Data Warehouse)</h4>
                        <ul style={{ fontSize: 12, color: "#334155", paddingLeft: 18, lineHeight: 1.6, margin: 0 }}>
                          <li><strong>Tasa aprobación automatizada:</strong> Objetivo &gt; 92%</li>
                          <li><strong>Casos a revisión manual:</strong> Objetivo &lt; 8%</li>
                          <li><strong>SLA promedio:</strong> &lt; 30 segundos</li>
                          <li><strong>Reducción tickets soporte:</strong> -60%</li>
                        </ul>
                      </div>
                      <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, border: "1px solid #E2E8F0" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Métricas de Comportamiento UX</h4>
                        <ul style={{ fontSize: 12, color: "#334155", paddingLeft: 18, lineHeight: 1.6, margin: 0 }}>
                          <li><strong>Tasa abandono flujo:</strong> &lt; 5%</li>
                          <li><strong>Score SEQ:</strong> &gt; 6.2 / 7</li>
                          <li><strong>Reintentos foto borrosa:</strong> Automático en mismo flujo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5 */}
                {activeTab === "handoff_ti" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>💻 5. Hand-off a TI (Arquitectura C4 &amp; JTBD)</span></h3>
                    <div style={{ background: "#F1F5F9", padding: 16, borderRadius: 10, marginBottom: 20 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>C4 Nivel 1 — Contexto de Sistema</h4>
                      <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, margin: 0 }}>
                        El módulo de Validación actúa como servicio transversal: <strong>Dropi Core Auth/User</strong>, <strong>Billing &amp; Facturación Engine</strong>, <strong>Wallet &amp; Dispersión Engine</strong>, <strong>Sumsub WebSDK/API</strong> y <strong>Truora API</strong>.
                      </p>
                    </div>
                    <div style={{ background: "#FAF5FF", border: "1px solid #E9D5FF", padding: 16, borderRadius: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#6B21A8", margin: "0 0 8px 0" }}>JTBD &amp; Criterios de Aceptación</h4>
                      <div style={{ fontSize: 12, color: "#581C87", lineHeight: 1.6 }}>
                        <p style={{ margin: "0 0 6px 0" }}><strong>Dado que</strong> un usuario nuevo (PN o PJ) desea realizar un retiro,</p>
                        <p style={{ margin: "0 0 6px 0" }}><strong>Cuando</strong> inicia el proceso de validación,</p>
                        <p style={{ margin: 0 }}><strong>Entonces</strong> el sistema determina automáticamente la herramienta (Truora KYC / Sumsub KYB), procesa y precarga el formulario de facturación sin duplicar información.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6 */}
                {activeTab === "handoff_stakeholders" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>⭐️ 6. Hand-off a Stakeholders &amp; RACI</span></h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>Rol / Área</th><th style={tableHeaderStyle}>RACI</th><th style={tableHeaderStyle}>Entregable</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Producto (Paula Macias)</strong></td><td style={tableCellStyle}><span style={badgeStyle("#B91C1C", "#FEE2E2")}>Accountable (A)</span></td><td style={tableCellStyle}>Definición de requerimientos y priorización</td></tr>
                        <tr><td style={tableCellStyle}><strong>UX (Catalina Giraldo)</strong></td><td style={tableCellStyle}><span style={badgeStyle("#1D4ED8", "#DBEAFE")}>Responsible (R)</span></td><td style={tableCellStyle}>Flujos Figma &amp; prototipo de pantalla unificada</td></tr>
                        <tr><td style={tableCellStyle}><strong>TI / Tech Lead</strong></td><td style={tableCellStyle}><span style={badgeStyle("#1D4ED8", "#DBEAFE")}>Responsible (R)</span></td><td style={tableCellStyle}>Arquitectura C4 (2-4), estimación PERT y código</td></tr>
                        <tr><td style={tableCellStyle}><strong>Legal &amp; Compliance</strong></td><td style={tableCellStyle}><span style={badgeStyle("#047857", "#D1FAE5")}>Consulted (C)</span></td><td style={tableCellStyle}>Validación de contratos y reglas KYC/KYT</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 7 */}
                {activeTab === "gobierno" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>📈 7. Gobierno &amp; Ejecución (TDL / TPL)</span></h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>DORA Metrics Objetivo</h4>
                        <ul style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                          <li>Deployment Frequency: Semanal</li>
                          <li>Lead Time for Changes: &lt; 3 días</li>
                          <li>Change Failure Rate: &lt; 2%</li>
                        </ul>
                      </div>
                      <div style={{ border: "1px solid #E2E8F0", padding: 16, borderRadius: 10 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>Traffic Light Semanal</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#10B981" }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>VERDE · En tiempo según cronograma Fase 0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION 2 — DATA DASHBOARD (28 CSVs análisis)
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #0EA5E9", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(14,165,233,0.10)" }}>
          <button
            onClick={() => setDashAccordionOpen(!dashAccordionOpen)}
            style={{ width: "100%", background: dashAccordionOpen ? "linear-gradient(90deg,#E0F2FE 0%,#F0FDFB 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: dashAccordionOpen ? "1px solid #BAE6FD" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#0EA5E9,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <BarChart2 size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#0C4A6E" }}>Dashboard de Datos</span>
                  <span style={badgeStyle("#0369A1", "#E0F2FE")}>Análisis CO · base_usuarios + Truora</span>
                  <span style={badgeStyle("#0F766E", "#CCFBF1")}>28 CSVs procesados</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Análisis exploratorio del estado actual de validación de identidad en Colombia — datos reales extraídos de Val_ID_CVS
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5E9", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #BAE6FD" }}>
                {dashAccordionOpen ? "Ocultar Dashboard" : "Ver Dashboard"}
              </span>
              {dashAccordionOpen ? <ChevronUp size={20} color="#0EA5E9" /> : <ChevronDown size={20} color="#0EA5E9" />}
            </div>
          </button>

          {dashAccordionOpen && (
            <div style={{ padding: 24 }}>
              {/* Dashboard tab nav */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
                {[
                  { id: "overview", label: "📊 Resumen Ejecutivo" },
                  { id: "validacion", label: "✅ Tasa de Validación" },
                  { id: "truora", label: "🔍 Análisis Truora" },
                  { id: "riesgo", label: "🚨 Riesgos & Alertas" },
                  { id: "datos", label: "📋 Integridad de Datos" },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveDashTab(tab.id)} style={{ background: activeDashTab === tab.id ? "#0EA5E9" : "#F8FAFC", color: activeDashTab === tab.id ? "#fff" : "#475569", border: activeDashTab === tab.id ? "1px solid #0EA5E9" : "1px solid #E2E8F0", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ─ TAB: RESUMEN EJECUTIVO ─ */}
              {activeDashTab === "overview" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 28 }}>
                    <KPI label="Total procesos Truora" value="12.402" sub="7.796 documentos únicos" color="#0EA5E9" icon={<RefreshCw size={18} />} />
                    <KPI label="No validados activos" value="29.328" sub="Operan sin KYC aprobado" color="#EF4444" icon={<ShieldAlert size={18} />} />
                    <KPI label="Desfase de sincronización" value="3.369" sub="Truora exitoso, base NO aprobado" color="#EAB308" icon={<Database size={18} />} />
                    <KPI label="Baneados que pasaron KYC" value="78" sub="Truora exitoso ≠ no fraude" color="#F59E0B" icon={<AlertCircle size={18} />} />
                    <KPI label="Fallidos con órdenes 90d" value="103" sub="Riesgo operativo real" color="#DC2626" icon={<TrendingDown size={18} />} />
                    <KPI label="Nunca exitosos en Truora" value="227" sub="De 7.796 documentos" color="#7C3AED" icon={<ShieldAlert size={18} />} />
                    <KPI label="Suplantación potencial" value="20" sub="Mismo doc, nombres distintos" color="#EA580C" icon={<AlertTriangle size={18} />} />
                    <KPI label="Quick win: saldo por sincronizar" value="416" sub="$1.602M COP ya validados en Truora" color="#10B981" icon={<RefreshCw size={18} />} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>Tasa de Validación por Rol</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Suppliers validan ~5× más que Dropshippers</div>
                      <HBar label="Suppliers — Tasa aprobación" value={11.36} max={15} color="#10B981" />
                      <HBar label="Dropshippers — Tasa aprobación" value={2.39} max={15} color="#EF4444" />
                      <div style={{ marginTop: 12, background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 8, padding: "8px 12px" }}>
                        <span style={{ fontSize: 11, color: "#065F46", fontWeight: 700 }}>💡 Las 229 aprobaciones de "identidad verificada" son EXCLUSIVAMENTE de Suppliers</span>
                      </div>
                    </div>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>Validación por Tipo de Persona (facturación)</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Persona Jurídica valida ~3.3× más que Persona Natural</div>
                      <HBar label="Persona Natural — 12.662 usuarios" value={5.1} max={20} color="#3B82F6" />
                      <HBar label="Persona Jurídica — 1.356 usuarios" value={16.59} max={20} color="#8B5CF6" />
                      <HBar label="Sin dato de tipo_persona — 1.626 usuarios (ref.)" value={17.65} max={20} color="#9CA3AF" />
                      <div style={{ marginTop: 12, background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "8px 12px" }}>
                        <span style={{ fontSize: 11, color: "#991B1B", fontWeight: 700 }}>🚨 Aun así, el 83,4% de Persona Jurídica sigue sin validar → no existe un flujo KYB dedicado, dependen del mismo proceso KYC individual</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 8, fontStyle: "italic" }}>Universo: 15.644 usuarios con tipo_persona registrado · Fuente: TasaValidacion_TipoPersona.csv</div>
                    </div>
                  </div>
                  <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#9A3412", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertTriangle size={16} /> Hallazgos Críticos del Análisis de Datos
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
                      {[
                        { icon: "🔴", text: "3.369 usuarios ya tienen Truora EXITOSO pero la base los sigue marcando como NO aprobados — desfase de sincronización entre sistemas" },
                        { icon: "🔴", text: "103 usuarios con Truora FALLIDO siguen generando órdenes en los últimos 90 días" },
                        { icon: "🟠", text: "78 usuarios con Truora EXITOSO están baneados — KYC solo no previene fraude" },
                        { icon: "🟡", text: "227 de 7.796 documentos NUNCA lograron éxito en Truora tras múltiples intentos" },
                        { icon: "🔴", text: "20 documentos asociados a nombres distintos — posible suplantación de identidad" },
                        { icon: "🟠", text: "2 usuarios menores de edad tienen cuentas activas con órdenes en los últimos 90 días" },
                        { icon: "🟡", text: "1.307 usuarios NO validados y activos (90d) con facturación incompleta, vs. solo 9 validados en la misma situación" },
                        { icon: "🟢", text: "416 usuarios ya tienen Truora exitoso pero figuran como no validados — quick win de $1.602M COP en saldo positivo por sincronizar" },
                      ].map((item, i) => (
                        <div key={i} style={{ background: "#fff", border: "1px solid #FED7AA", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 16 }}>{item.icon}</span>
                          <span style={{ fontSize: 12, color: "#7C2D12", lineHeight: 1.5 }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─ TAB: TASA DE VALIDACIÓN ─ */}
              {activeDashTab === "validacion" && (
                <div>
                  <DashSection title="Tasa de Validación por Rol (Dropshipper vs. Supplier)" icon={<Users size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Comparativo de Tasas</div>
                        <HBar label="Suppliers — Aprobado" value={11.36} max={15} color="#10B981" />
                        <HBar label="Dropshippers — Aprobado" value={2.39} max={15} color="#3B82F6" />
                        <HBar label="Suppliers — Identidad verificada (229 usuarios)" value={229} max={300} color="#059669" suffix=" usuarios" />
                        <HBar label="Dropshippers — Identidad verificada" value={0} max={300} color="#9CA3AF" suffix=" usuarios" />
                        <div style={{ marginTop: 10, fontSize: 11, color: "#475569", fontStyle: "italic" }}>Fuente: TasaValidacion_por_Rol.csv</div>
                      </div>
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Tasa por Tipo de Persona (facturación)</div>
                        <HBar label="Persona Natural — 12.662 usuarios" value={5.1} max={20} color="#8B5CF6" />
                        <HBar label="Persona Jurídica — 1.356 usuarios" value={16.59} max={20} color="#3B82F6" />
                        <HBar label="Sin dato — 1.626 usuarios (ref.)" value={17.65} max={20} color="#9CA3AF" />
                        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: "10px 14px", borderRadius: 8, marginTop: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B" }}>⚠️ PJ valida ~3.3× más que PN, pero igual el 83,4% de PJ sigue sin validar</div>
                          <div style={{ fontSize: 11, color: "#7F1D1D", marginTop: 4 }}>No existe un flujo KYB dedicado para empresas: usan el mismo proceso KYC individual.</div>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 11, color: "#475569", fontStyle: "italic" }}>Universo: 15.644 usuarios · Fuente: TasaValidacion_TipoPersona.csv</div>
                      </div>
                    </div>
                  </DashSection>

                  <DashSection title="Tasa de Éxito por Tipo de Documento (12.402 procesos Truora)" icon={<Database size={18} />}>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                      <HBar label="Cédula nacional (national-id) — 8.706 procesos" value={81.54} max={100} color="#10B981" />
                      <HBar label="CNH / Brasil — 233 procesos" value={75.97} max={100} color="#8B5CF6" />
                      <HBar label="Registro general (general-registration) — 258 procesos" value={61.63} max={100} color="#3B82F6" />
                      <HBar label="Pasaporte — 255 procesos" value={49.02} max={100} color="#F59E0B" />
                      <HBar label="PPT (Permiso de Protección Temporal) — 9 procesos" value={44.44} max={100} color="#F97316" />
                      <HBar label="Sin dato de documento — 2.940 procesos" value={22.38} max={100} color="#9CA3AF" />
                      <div style={{ marginTop: 10, fontSize: 11, color: "#475569", fontStyle: "italic" }}>Fuente: TasaExito_TipoDocumento.csv · Pasaporte tiene ~40% menos tasa de éxito que cédula nacional; "Sin dato" son procesos probablemente abandonados antes de subir documento</div>
                    </div>
                  </DashSection>

                  <DashSection title="Top 5 No-Validados por Volumen (de 29.328 usuarios activos sin KYC)" icon={<TrendingUp size={18} />}>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: "#92400E", fontWeight: 700 }}>📊 Priorización: mayor volumen de entregas = mayor urgencia de KYC forzado en Fase 0</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>ID</th><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Estado Val.</th><th style={tableHeaderStyle}>Entregadas Lifetime</th><th style={tableHeaderStyle}>Órdenes 90d</th><th style={tableHeaderStyle}>Multi-país</th></tr></thead>
                      <tbody>
                        {[
                          { rank: 1, id: "405636", rol: "Supplier", estado: "Pendiente (sin documento)", lifetime: "533.771", ord90: "141.606", ban: false, multi: true },
                          { rank: 2, id: "206810", rol: "Supplier", estado: "En revisión (doc. cargado)", lifetime: "266.892", ord90: "54.856", ban: false, multi: false },
                          { rank: 3, id: "111", rol: "Supplier", estado: "Sin proceso de validación", lifetime: "266.633", ord90: "36.328", ban: false, multi: true },
                          { rank: 4, id: "1361", rol: "Dropshipper", estado: "En revisión (doc. cargado)", lifetime: "217.526", ord90: "49.050", ban: false, multi: true },
                          { rank: 5, id: "44666", rol: "Supplier", estado: "En revisión (doc. cargado)", lifetime: "206.029", ord90: "51.306", ban: false, multi: false },
                        ].map((row) => (
                          <tr key={row.rank}>
                            <td style={tableCellStyle}><strong>#{row.rank}</strong></td>
                            <td style={tableCellStyle}>{row.id}</td>
                            <td style={tableCellStyle}><span style={badgeStyle(row.rol === "Supplier" ? "#7C3AED" : "#0369A1", row.rol === "Supplier" ? "#F3E8FF" : "#E0F2FE")}>{row.rol}</span></td>
                            <td style={tableCellStyle}><span style={{ fontSize: 12, color: "#92400E" }}>{row.estado}</span></td>
                            <td style={{ ...tableCellStyle, fontWeight: 700 }}>{row.lifetime}</td>
                            <td style={tableCellStyle}>{row.ord90}</td>
                            <td style={tableCellStyle}>{row.multi ? <span style={badgeStyle("#0369A1", "#DBEAFE")}>✓ Sí</span> : <span style={{ fontSize: 12, color: "#64748B" }}>—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>Fuente: Top_Volumen_NoValidados.csv · Los top 5 son todos Suppliers/Dropshippers de alto volumen — ninguno banneado hoy, pero operan sin KYC</div>
                  </DashSection>

                  <DashSection title="Validación Multi-País (opera en 2+ países)" icon={<Users size={18} />}>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                      <HBar label="Opera en 2+ países — 1.674 usuarios (112 validados)" value={6.69} max={10} color="#10B981" />
                      <HBar label="Opera en 1 solo país — 28.880 usuarios (1.114 validados)" value={3.86} max={10} color="#3B82F6" />
                      <div style={{ marginTop: 10, fontSize: 11, color: "#475569", fontStyle: "italic" }}>Fuente: Multipais_vs_Validacion.csv · Los usuarios multi-país validan casi el doble, pero siguen siendo minoría — la Fase 1 (bloqueo cruzado) es la palanca real para este segmento</div>
                    </div>
                  </DashSection>
                </div>
              )}

              {/* ─ TAB: ANÁLISIS TRUORA ─ */}
              {activeDashTab === "truora" && (
                <div>
                  <DashSection title="Reintentos de Validación Truora (7.796 documentos únicos · 9.262 procesos)" icon={<RefreshCw size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
                      <KPI label="Nunca exitosos (ROJO)" value="227" sub="Bloqueados permanentes" color="#EF4444" />
                      <KPI label="Exitosos en 3+ intentos" value="138" sub="Alta fricción o evasión" color="#F59E0B" />
                      <KPI label="Máx. intentos registrados" value="13" sub="Un mismo documento" color="#DC2626" />
                      <KPI label="Expirados/abandonados" value="84" sub="55 usuarios únicos" color="#8B5CF6" />
                    </div>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Distribución por Categoría de Reintento</div>
                      <HBar label="Logrado en 1er intento" value={7431} max={7796} color="#10B981" suffix=" docs" />
                      <HBar label="Logrado en 3+ intentos (fricción alta)" value={138} max={7796} color="#F59E0B" suffix=" docs" />
                      <HBar label="NUNCA exitoso" value={227} max={7796} color="#EF4444" suffix=" docs" />
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 10, fontStyle: "italic" }}>Fuente: Truora_Reintentos.csv</div>
                    </div>
                  </DashSection>

                  <DashSection title="Motivos de Rechazo Truora (633 procesos rechazados · 424 usuarios únicos)" icon={<AlertCircle size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Top Motivos de Rechazo</div>
                        <HBar label="risk_signal_detected" value={139} max={145} color="#EF4444" suffix="" />
                        <HBar label="similarity_threshold_not_passed" value={112} max={145} color="#F97316" suffix="" />
                        <HBar label="document_is_a_photo_of_photo" value={91} max={145} color="#EAB308" suffix="" />
                        <HBar label="invalid_issue_date" value={39} max={145} color="#3B82F6" suffix="" />
                        <HBar label="government_database_unavailable" value={35} max={145} color="#8B5CF6" suffix="" />
                        <HBar label="no_face_detected" value={32} max={145} color="#A78BFA" suffix="" />
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 8, fontStyle: "italic" }}>Fuente: Truora_Rechazados_Motivo.csv · Top 6 de 15+ motivos registrados</div>
                      </div>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#991B1B", marginBottom: 10 }}>🚨 Señales de Fraude</div>
                        {[
                          { label: "Señal de riesgo detectada (risk_signal_detected)", count: 139, color: "#EF4444" },
                          { label: "Rostro coincide con base de fraudes (fraudster_face_match)", count: 28, color: "#DC2626" },
                          { label: "Mismo doc, nombres distintos (Truora_MismoDoc)", count: 20, color: "#F97316" },
                          { label: "Usuarios rechazados que además están baneados en CO", count: 55, color: "#B91C1C" },
                        ].map((item, i) => (
                          <div key={i} style={{ background: "#fff", border: `1px solid ${item.color}30`, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                            <div style={{ fontSize: 12, color: item.color, fontWeight: 700 }}>{item.count} casos</div>
                            <div style={{ fontSize: 11, color: "#7F1D1D", marginTop: 2 }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DashSection>

                  <DashSection title="Expirados & Abandonados (84 procesos · 55 usuarios)" icon={<Clock size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 14 }}>
                      <KPI label="Reintentaron y tuvieron éxito" value="42" sub="76% eventual recuperación" color="#10B981" />
                      <KPI label="Reintentaron y fallaron" value="35" sub="Sin validación definitiva" color="#EF4444" />
                      <KPI label="Nunca reintentaron" value="7" sub="Abandonados permanentes" color="#94A3B8" />
                    </div>
                    <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: 14 }}>
                      <span style={{ fontSize: 12, color: "#166534", fontWeight: 600 }}>💡 El 76% de los que expiraron luego lograron validarse → problema de UX (abandono/tiempo) no de elegibilidad. Un recordatorio automático capturaría estos usuarios. Fuente: Truora_Expirados_Abandonados.csv</span>
                    </div>
                  </DashSection>

                  <DashSection title="Cruce Truora vs. Estado de Aprobación en Plataforma (3.533 usuarios cruzados)" icon={<Activity size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 14 }}>
                      <KPI label="Base NO Aprobado, Truora exitoso" value="3.369" sub="Desfase de sincronización crítico" color="#EAB308" />
                      <KPI label="Base NO Aprobado, Truora fallido" value="113" sub="Consistente, sin acción" color="#94A3B8" />
                      <KPI label="Base Aprobado, Truora NO exitoso" value="6" sub="Aprobado sin soporte vigente" color="#DC2626" />
                      <KPI label="Documentos únicos cruzados" value="3.026" sub="De 3.533 usuarios" color="#0EA5E9" />
                    </div>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16 }}>
                      <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6, margin: 0 }}>
                        <strong>Hallazgo crítico:</strong> 3.369 usuarios ya tienen un proceso <strong>exitoso en Truora</strong> pero su <code>estado_validacion</code> en base_usuarios sigue como NO Aprobado (mayormente &quot;Pendiente sin documento&quot;) → desfase de sincronización entre sistemas, no un problema de KYC en sí. En el sentido inverso, 6 casos están Aprobados en base sin que el proceso Truora más reciente haya sido exitoso — requieren revisión de por qué se aprobaron sin soporte vigente.
                        Fuente: <em>Cruce_Truora_EstadoAprobacion.csv · Inconsistencia_Estados.csv</em>
                      </p>
                    </div>
                  </DashSection>
                </div>
              )}

              {/* ─ TAB: RIESGOS & ALERTAS ─ */}
              {activeDashTab === "riesgo" && (
                <div>
                  <DashSection title="Usuarios con Truora EXITOSO pero Baneados (78 usuarios)" icon={<ShieldAlert size={18} />}>
                    <div style={{ background: "#FEF2F2", border: "1.5px solid #EF4444", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#991B1B", marginBottom: 8 }}>🔴 El KYC por sí solo NO está previniendo el fraude</div>
                      <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
                        78 usuarios completaron exitosamente Truora y luego fueron baneados en CO. Confirma que <strong>pasar biometría no es suficiente</strong> → se requiere KYT y monitoreo post-validación continuo.
                        Fuente: <em>Truora_Exitoso_Pero_Baneado.csv</em>
                      </p>
                    </div>
                  </DashSection>

                  <DashSection title="Usuarios con Truora FALLIDO que Tienen Órdenes Activas (103 usuarios)" icon={<AlertTriangle size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#9A3412", marginBottom: 8 }}>🟠 Riesgo Operativo Inmediato</div>
                        <p style={{ fontSize: 12, color: "#7C2D12", lineHeight: 1.5, margin: 0 }}>103 usuarios cuyo último proceso Truora fue FALLIDO siguen generando y entregando pedidos. Están en el sistema sin validación activa vigente.</p>
                      </div>
                      <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#166534", marginBottom: 8 }}>✅ Acción Recomendada</div>
                        <p style={{ fontSize: 12, color: "#14532D", lineHeight: 1.5, margin: 0 }}>Priorizar estos 103 para re-validación forzada en Fase 0. Alto impacto, operación activa.</p>
                      </div>
                    </div>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
                      <HBar label="Supplier con volumen alto (9.000+ órdenes, 1 caso: 9.337)" value={1} max={103} color="#DC2626" suffix=" usuario" />
                      <HBar label="Volumen medio (100–999 órdenes)" value={15} max={103} color="#F97316" suffix=" usuarios" />
                      <HBar label="Volumen bajo (1–99 órdenes)" value={87} max={103} color="#EAB308" suffix=" usuarios" />
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 8, fontStyle: "italic" }}>Fuente: Truora_Fallidos_ConOrdenes90d.csv · Por rol: 95 Dropshipper, 8 Supplier</div>
                    </div>
                  </DashSection>

                  <DashSection title="Aprobados en Base sin Soporte Truora Vigente (6 casos)" icon={<ShieldAlert size={18} />}>
                    <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: 16 }}>
                      <p style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
                        6 usuarios figuran como <strong>&quot;Aprobado&quot;</strong> en base_usuarios, pero el proceso Truora más reciente asociado a su documento <strong>NO fue exitoso</strong> (ej. usuario 20208 y 104605, mismo DNI 1017204030, proceso rechazado por <em>document_is_a_photo_of_photo</em> y además baneados en CO). Hay que revisar caso a caso por qué se otorgó la aprobación sin un soporte Truora vigente.
                      </p>
                      <div style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>Fuente: Inconsistencia_Estados.csv (tipo ROJO)</div>
                    </div>
                  </DashSection>

                  <DashSection title="Alertas de Edad — Menores & Edades Implausibles (3 casos)" icon={<AlertCircle size={18} />}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>ID Usuario</th><th style={tableHeaderStyle}>Motivo Rechazo</th><th style={tableHeaderStyle}>Edad Calculada</th><th style={tableHeaderStyle}>Órdenes 90d</th><th style={tableHeaderStyle}>Estado</th></tr></thead>
                      <tbody>
                        {[
                          { id: "895528", motivo: "underage", edad: "17.3 años", ord: "2", estado: "Cuenta activa" },
                          { id: "873659", motivo: "age_above_threshold", edad: "120.6 años", ord: "53", estado: "Cuenta activa" },
                          { id: "Sin cuenta", motivo: "underage", edad: "3.4 años", ord: "—", estado: "Sin cuenta Dropi" },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td style={tableCellStyle}>{row.id}</td>
                            <td style={tableCellStyle}>{row.motivo}</td>
                            <td style={tableCellStyle}><strong style={{ color: "#DC2626" }}>{row.edad}</strong></td>
                            <td style={tableCellStyle}>{row.ord}</td>
                            <td style={tableCellStyle}><span style={badgeStyle(row.estado === "Cuenta activa" ? "#B91C1C" : "#78350F", row.estado === "Cuenta activa" ? "#FEE2E2" : "#FEF3C7")}>{row.estado}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize: 11, color: "#7F1D1D", marginTop: 8, fontStyle: "italic" }}>Fuente: Truora_ValidacionMenoresEdad.csv · 2 de 3 tienen cuenta activa con órdenes reales</div>
                  </DashSection>

                  <DashSection title="Mismo Documento con Nombres Distintos (20 documentos)" icon={<ShieldAlert size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#9A3412", marginBottom: 8 }}>Qué significa</div>
                        <p style={{ fontSize: 12, color: "#7C2D12", lineHeight: 1.5, margin: 0 }}>Un mismo número de documento aparece en Truora asociado a 2+ identidades genuinamente distintas. Pueden ser errores de OCR o casos reales de suplantación. Fuente: <em>Truora_MismoDoc_NombresDist.csv</em></p>
                      </div>
                      <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#166534", marginBottom: 8 }}>Acción Recomendada</div>
                        <p style={{ fontSize: 12, color: "#14532D", lineHeight: 1.5, margin: 0 }}>Revisión manual caso a caso. Si se confirma suplantación → bloqueo inmediato de ambas cuentas y escalamiento a Legal/Compliance.</p>
                      </div>
                    </div>
                  </DashSection>
                </div>
              )}

              {/* ─ TAB: INTEGRIDAD DE DATOS ─ */}
              {activeDashTab === "datos" && (
                <div>
                  <DashSection title="Validados Activos sin Facturación Completa (9 usuarios)" icon={<AlertCircle size={18} />}>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                      <span style={{ fontSize: 12, color: "#92400E", fontWeight: 700 }}>⚠️ 9 usuarios APROBADOS en KYC, activos con órdenes, pero con 5+ campos clave de facturación vacíos → confirma fragmentación del flujo de datos.</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>ID Usuario</th><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Estado Val. ID</th><th style={tableHeaderStyle}>Órdenes 90d</th><th style={tableHeaderStyle}>Campos vacíos (de 9)</th></tr></thead>
                      <tbody>
                        {[
                          { id: "634593", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 1, vac: 7 },
                          { id: "4270", rol: "Supplier", val: "Aprobado (identidad verificada)", ord: 1, vac: 7 },
                          { id: "13780", rol: "Supplier", val: "Aprobado (identidad verificada)", ord: 56, vac: 6 },
                          { id: "72268", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 1, vac: 6 },
                          { id: "144079", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 3, vac: 6 },
                          { id: "192837", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 6, vac: 6 },
                          { id: "145532", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 4, vac: 5 },
                          { id: "172198", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 1, vac: 5 },
                          { id: "224200", rol: "Dropshipper", val: "Aprobado (docs revisados)", ord: 3, vac: 5 },
                        ].map((row) => (
                          <tr key={row.id}>
                            <td style={tableCellStyle}>{row.id}</td>
                            <td style={tableCellStyle}><span style={badgeStyle(row.rol === "Supplier" ? "#7C3AED" : "#0369A1", row.rol === "Supplier" ? "#F3E8FF" : "#E0F2FE")}>{row.rol}</span></td>
                            <td style={tableCellStyle}><span style={{ fontSize: 11 }}>{row.val}</span></td>
                            <td style={{ ...tableCellStyle, fontWeight: 700 }}>{row.ord}</td>
                            <td style={tableCellStyle}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${(row.vac / 9) * 100}%`, background: row.vac >= 7 ? "#EF4444" : row.vac >= 6 ? "#F97316" : "#EAB308", borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700, color: row.vac >= 7 ? "#EF4444" : row.vac >= 6 ? "#F97316" : "#EAB308" }}>{row.vac}/9</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>Fuente: Validados_Activos_SinFact.csv</div>
                  </DashSection>

                  <DashSection title="NO Validados y Activos sin Facturación Completa (1.307 usuarios)" icon={<AlertCircle size={18} />}>
                    <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: 14 }}>
                      <span style={{ fontSize: 12, color: "#991B1B", fontWeight: 700 }}>🔴 A diferencia de los 9 validados sin facturación, aquí hay 1.307 usuarios que NI están validados NI tienen facturación completa (≥2 de 9 campos vacíos), pero ya están activos con órdenes en los últimos 90 días.</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>Fuente: NoValidados_Activos_SinFact.csv</div>
                  </DashSection>

                  <DashSection title="Cambios en Datos de Facturación & Inestabilidad" icon={<Database size={18} />}>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18, marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>Consolidado de Cambios por Campo (2025)</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Base: 20.396 usuarios con 2+ periodos · 3.306 (16,2%) cambiaron al menos un campo</div>
                      <HBar label="Nombre Facturación" value={1490} max={1500} color="#EF4444" suffix=" usuarios" />
                      <HBar label="Teléfono Facturación" value={1403} max={1500} color="#F97316" suffix=" usuarios" />
                      <HBar label="Tipo Doc. Facturación" value={1225} max={1500} color="#EAB308" suffix=" usuarios" />
                      <HBar label="Dirección Facturación" value={1217} max={1500} color="#3B82F6" suffix=" usuarios" />
                      <HBar label="Email Facturación" value={534} max={1500} color="#8B5CF6" suffix=" usuarios" />
                      <HBar label="Tipo Persona" value={425} max={1500} color="#A78BFA" suffix=" usuarios" />
                      <HBar label="Municipio Facturación" value={56} max={1500} color="#9CA3AF" suffix=" usuarios" />
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 8, fontStyle: "italic" }}>DNI, Teléfono Cuenta y País Facturación no registran cambios (0 usuarios) · Fuente: Consolidado_Cambios_Campo.csv</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>Cambios vs. Baneo — hipótesis NO confirmada</div>
                        <p style={{ fontSize: 11, color: "#14532D", lineHeight: 1.5, margin: "0 0 8px" }}>Los baneados en CO cambian sus datos de facturación <strong>menos</strong>, no más: 4,09% de los 685 baneados con registro de wallet cambió algo, vs. 6,47% de los 14.959 no baneados.</p>
                        <div style={{ fontSize: 10, color: "#64748B", fontStyle: "italic" }}>Fuente: Cambios_vs_Baneo.csv</div>
                      </div>
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Inestabilidad vs. Tasa de Éxito Truora — hipótesis NO confirmada</div>
                        <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, margin: "0 0 8px" }}>Sobre 174 usuarios que cruzan ambos archivos, la tasa de éxito se mantiene alta (92%–100%) sin importar cuántas veces cambiaron su facturación: 0 cambios 93,55%, 1 cambio 100%, 2-3 cambios 92,31%, 4+ cambios 94,74%.</p>
                        <div style={{ fontSize: 10, color: "#64748B", fontStyle: "italic" }}>Fuente: Inestabilidad_vs_TasaExito.csv</div>
                      </div>
                    </div>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginTop: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Nombre Truora vs. Facturación (590 usuarios cruzados a 3 bandas)</div>
                      <HBar label="Coincide" value={299} max={590} color="#10B981" suffix=" usuarios (50,7%)" />
                      <HBar label="NO Coincide" value={214} max={590} color="#EF4444" suffix=" usuarios (36,3%)" />
                      <HBar label="Sin dato suficiente" value={77} max={590} color="#9CA3AF" suffix=" usuarios (13,1%)" />
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 8, fontStyle: "italic" }}>36,3% de discrepancia entre nombre validado en Truora y nombre de facturación → problema real de data governance. Fuente: Nombre_Truora_vs_Facturacion.csv</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Ranking maestro completo de los 3.306 usuarios con cambios: Ranking_Inestabilidad_Datos.csv (ej. usuario 481653: 18 cambios en 6 campos distintos en 4 periodos, aún Pendiente de validación, 4.864 órdenes en 90d, no baneado)</div>
                  </DashSection>

                  <DashSection title="Saldos & No Validados con Actividad Financiera" icon={<Activity size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 16 }}>
                      <KPI label="Quick win: saldo positivo por sincronizar" value="416" sub="$1.602.292.641 COP · ya exitosos en Truora" color="#10B981" />
                      <KPI label="Usuarios con saldo negativo" value="30.808" sub="Solo 1.542 cruzan con activos-90d" color="#EF4444" />
                      <KPI label="Usuarios con saldo positivo" value="60.010" sub="Solo 13.321 cruzan con activos-90d" color="#0EA5E9" />
                      <KPI label="No validados, entregas + saldo negativo" value="927" sub="Deuda activa sin KYC" color="#DC2626" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>Mayor deuda individual</div>
                        <p style={{ fontSize: 12, color: "#7F1D1D", margin: 0 }}>Usuario 500765 · saldo final <strong>-$75.667.486 COP</strong> (sin match en activos-90d)</p>
                        <div style={{ fontSize: 10, color: "#64748B", fontStyle: "italic", marginTop: 6 }}>Fuente: Top_Deuda_SaldoNegativo.csv</div>
                      </div>
                      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>Mayor saldo positivo sin KYC</div>
                        <p style={{ fontSize: 12, color: "#78350F", margin: 0 }}>Usuario 111 &quot;shopi pauta provedor&quot; · <strong>$3.675.791.574 COP</strong> · Sin proceso de validación, activo, 36.328 órdenes en 90d</p>
                        <div style={{ fontSize: 10, color: "#64748B", fontStyle: "italic", marginTop: 6 }}>Fuente: Top_Saldo_Positivo.csv</div>
                      </div>
                    </div>

                    <DashSection title="Extranjeros con Pasaporte & Usuarios Multi-País" icon={<TrendingUp size={18} />}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#1E40AF", marginBottom: 8 }}>Extranjeros con Pasaporte (282 procesos Truora)</div>
                          <p style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.5, margin: 0 }}>51 procesos cruzan con cuenta en base_usuarios, 231 no tienen cuenta activa en CO. Resultado: 152 exitoso, 130 fallido (49,02% éxito, ~32 pts por debajo de cédula nacional) → Truora busca por nombre en listas negras, generando falsos positivos por homónimos en extranjeros. Fuente: <em>Extranjeros_Pasaporte.csv</em></p>
                        </div>
                        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#166534", marginBottom: 8 }}>Usuarios Multi-País (1.674 usuarios)</div>
                          <p style={{ fontSize: 12, color: "#14532D", lineHeight: 1.5, margin: 0 }}>Validan al 6,69% vs. 3,86% de quienes operan en 1 solo país. Si se bloquean en un país, pueden continuar en otro: la <strong>Fase 1 (bloqueo cruzado)</strong> resuelve este gap directamente. Fuente: <em>Multipais_vs_Validacion.csv</em></p>
                        </div>
                      </div>
                    </DashSection>
                  </DashSection>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION 3 — VERIFICACIÓN SUMSUB (Resumen Técnico + Mapeo API)
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #7C3AED", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(124,58,237,0.10)" }}>
          <button
            onClick={() => setSumsubAccordionOpen(!sumsubAccordionOpen)}
            style={{ width: "100%", background: sumsubAccordionOpen ? "linear-gradient(90deg,#F5F3FF 0%,#FAF5FF 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: sumsubAccordionOpen ? "1px solid #E9D5FF" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#A855F7)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#4C1D95" }}>Verificación Sumsub</span>
                  <span style={badgeStyle("#6D28D9", "#EDE9FE")}>Resumen técnico + Mapeo API</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Cómo funciona la API de Sumsub (auth, webhooks, resultados) y el mapeo campo por campo hacia los formularios de Datos Personales y Datos de Facturación
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #DDD6FE" }}>
                {sumsubAccordionOpen ? "Ocultar" : "Ver detalle"}
              </span>
              {sumsubAccordionOpen ? <ChevronUp size={20} color="#7C3AED" /> : <ChevronDown size={20} color="#7C3AED" />}
            </div>
          </button>

          {sumsubAccordionOpen && (
            <div style={{ padding: 24 }}>
              {/* Sumsub tab nav */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
                {[
                  { id: "resumen", label: "🧠 Resumen Técnico Sumsub" },
                  { id: "mapeo", label: "🗂️ Mapeo API · Formularios" },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveSumsubTab(tab.id)} style={{ background: activeSumsubTab === tab.id ? "#7C3AED" : "#F8FAFC", color: activeSumsubTab === tab.id ? "#fff" : "#475569", border: activeSumsubTab === tab.id ? "1px solid #7C3AED" : "1px solid #E2E8F0", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ─ TAB: RESUMEN TÉCNICO SUMSUB ─ */}
              {activeSumsubTab === "resumen" && (
                <div>
                  <DashSection title="Autenticación & Seguridad" icon={<Cpu size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>Firma de requests a la API</div>
                        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, margin: "0 0 8px 0" }}>Cada request va firmado — no es un API key simple. Se generan <strong>App Token</strong> (identifica la app) y <strong>Secret Key</strong> (privada, solo se muestra una vez).</p>
                        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, margin: 0 }}>Headers: <code>X-App-Token</code>, <code>X-App-Access-Ts</code> (timestamp Unix) y <code>X-App-Access-Sig</code> = HMAC-SHA256 de <em>timestamp + método HTTP + URI + body</em>. El timestamp debe estar a menos de 1 min del reloj del servidor.</p>
                      </div>
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>Firma de webhooks entrantes</div>
                        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, margin: "0 0 8px 0" }}>Cada webhook trae <code>X-Payload-Digest</code> (HMAC del body) y <code>X-Payload-Digest-Alg</code> (<strong>HMAC_SHA256_HEX</strong> por defecto). El endpoint receptor debe recalcular y comparar antes de procesar — si no coincide, descartar.</p>
                        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, margin: 0 }}>El payload de los webhooks <strong>no trae datos personales</strong> — solo IDs y estado. Para datos reales siempre hay que hacer <code>GET applicant data</code>.</p>
                      </div>
                    </div>
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>⏱️ Política de reintentos de webhooks</div>
                      <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6, margin: 0 }}>Si el endpoint no responde en <strong>5 seg</strong> o devuelve HTTP 500, Sumsub reintenta hasta <strong>4 veces</strong>. Applicant Actions: 30s, 30s, 1min, 5min. Resto de eventos: 5min, 1h, 5h, 18h. El handler debe ser <strong>idempotente</strong>.</p>
                    </div>
                  </DashSection>

                  <DashSection title="Conceptos clave del modelo de datos" icon={<Layers size={18} />}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>Concepto</th><th style={tableHeaderStyle}>Qué es</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Applicant</strong></td><td style={tableCellStyle}>Entidad central — persona o empresa que se está verificando. Todo gira en torno a crearlo, adjuntarle documentos y consultar su estado.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Verification Level</strong></td><td style={tableCellStyle}>Perfil configurado en el Dashboard de Sumsub que define qué pasos/documentos debe completar un applicant. Se configura sin código.</td></tr>
                        <tr><td style={tableCellStyle}><strong>fixedInfo vs. info</strong></td><td style={tableCellStyle}><code>fixedInfo</code> = lo que el usuario declaró (no verificado). <code>info</code> = lo que Sumsub extrajo y validó del documento (OCR). Sumsub compara ambos internamente para detectar <em>dataMismatch</em>.</td></tr>
                        <tr><td style={tableCellStyle}><strong>idDocs[]</strong></td><td style={tableCellStyle}>Array de documentos de identidad presentados (tipo, país, número, vigencia, imágenes). Para empresas, tipo <code>COMPANY_DOC</code>.</td></tr>
                        <tr><td style={tableCellStyle}><strong>questionnaires</strong></td><td style={tableCellStyle}>Datos capturados por formulario dentro del WebSDK que NO son extraíbles por OCR (ej. régimen fiscal, email/teléfono de facturación). Estructura: <code>sections → items → id/value</code>.</td></tr>
                        <tr><td style={tableCellStyle}><strong>review / reviewStatus</strong></td><td style={tableCellStyle}>Estado del ciclo de revisión: <code>init → pending → queued/onHold → completed</code>.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Applicant Action</strong></td><td style={tableCellStyle}>Verificación puntual sobre un applicant ya existente (ej. pedir datos de facturación adicionales) sin repetir la verificación de identidad completa.</td></tr>
                      </tbody>
                    </table>
                  </DashSection>

                  <DashSection title="Ciclo de vida — Webhooks principales" icon={<RefreshCw size={18} />}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>Webhook</th><th style={tableHeaderStyle}>Se dispara cuando...</th><th style={tableHeaderStyle}>reviewStatus</th></tr></thead>
                      <tbody>
                        {[
                          { n: 1, ev: "applicantCreated", desc: "Se crea el applicant", st: "init" },
                          { n: 2, ev: "applicantPending", desc: "Se cargaron los documentos requeridos y se solicitó el check", st: "pending" },
                          { n: 3, ev: "applicantPrechecked", desc: "Termina el procesamiento primario de datos (interno)", st: "queued" },
                          { n: 4, ev: "applicantOnHold", desc: "Verificación pausada (ej. revisión manual adicional)", st: "onHold" },
                          { n: 5, ev: "applicantReviewed", desc: "La verificación finalizó con decisión final (GREEN/RED)", st: "completed" },
                          { n: 6, ev: "applicantActionPending / applicantActionReviewed", desc: "Verificación puntual post-onboarding (ej. facturación) sobre un applicant existente", st: "pending / completed" },
                          { n: 7, ev: "applicantReset", desc: "Perfil vuelve a init; documentos marcados inactivos", st: "init" },
                          { n: 8, ev: "applicantPersonalInfoChanged", desc: "Datos o documentos se modificaron después de completada la revisión", st: "—" },
                        ].map((row) => (
                          <tr key={row.n}>
                            <td style={tableCellStyle}>{row.n}</td>
                            <td style={tableCellStyle}><code>{row.ev}</code></td>
                            <td style={tableCellStyle}>{row.desc}</td>
                            <td style={tableCellStyle}><span style={badgeStyle("#0369A1", "#E0F2FE")}>{row.st}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>El orden y existencia de los pasos puede variar según la configuración del nivel de verificación. Fuente: docs.sumsub.com/docs/user-verification-webhooks</div>
                  </DashSection>

                  <DashSection title="Resultado de la revisión (reviewResult)" icon={<ShieldCheck size={18} />}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                      <div style={{ background: "#F0FDF4", border: "1.5px solid #6EE7B7", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#065F46", marginBottom: 8 }}>🟢 GREEN</div>
                        <p style={{ fontSize: 12, color: "#14532D", lineHeight: 1.6, margin: 0 }}>Verificación aprobada. <code>reviewAnswer: &quot;GREEN&quot;</code>.</p>
                      </div>
                      <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E", marginBottom: 8 }}>🟡 RED · RETRY</div>
                        <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6, margin: 0 }}>Rechazo corregible (ej. foto borrosa, falta un dato). El usuario puede reenviar. Trae <code>rejectLabels</code>, <code>moderationComment</code> y <code>buttonIds</code>.</p>
                      </div>
                      <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#991B1B", marginBottom: 8 }}>🔴 RED · FINAL</div>
                        <p style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>Rechazo definitivo (ej. fraude, PEP/sanciones). No hay reintento.</p>
                      </div>
                    </div>
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14, marginTop: 14 }}>
                      <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, margin: 0 }}><code>moderationComment</code> = único texto seguro para mostrar al usuario final. <code>clientComment</code> = uso interno, no exponer en frontend. <code>buttonIds</code> = identificador exacto de qué falló (ej. <code>dataMismatch_fullName</code>), consultable en detalle vía <code>GET clarify-rejection-reason</code>.</p>
                    </div>
                  </DashSection>

                  <DashSection title="Reenvío de documentos cuando rejectType = RETRY" icon={<RefreshCw size={18} />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { color: "#3B82F6", bg: "#EFF6FF", step: "1", title: "Identificar qué falló", desc: "GET clarify-rejection-reason → devuelve los buttonId exactos (ej. \"Damaged ID\", \"Another side\")." },
                        { color: "#8B5CF6", bg: "#F5F3FF", step: "2", title: "Reenviar solo lo problemático", desc: "POST add-verification-documents — solo el/los documentos con problema, mismo applicantId. No hay que resubir todo." },
                        { color: "#F59E0B", bg: "#FFFBEB", step: "3", title: "Re-disparar el check", desc: "POST /resources/applicants/{applicantId}/status/pending — falla si ya está en pending/queued/prechecked." },
                        { color: "#10B981", bg: "#ECFDF5", step: "4", title: "Esperar resultado", desc: "Nuevo webhook applicantReviewed con el resultado actualizado." },
                      ].map((s) => (
                        <div key={s.step} style={{ borderLeft: `4px solid ${s.color}`, background: s.bg, padding: 12, borderRadius: "0 8px 8px 0", display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color: s.color, minWidth: 18 }}>{s.step}</span>
                          <div><strong style={{ fontSize: 13, color: s.color }}>{s.title}</strong><p style={{ fontSize: 12, color: "#334155", margin: "4px 0 0 0", lineHeight: 1.5 }}>{s.desc}</p></div>
                        </div>
                      ))}
                    </div>
                  </DashSection>

                  <DashSection title="Consideraciones para una verificación exitosa" icon={<Target size={18} />}>
                    <ul style={{ fontSize: 12, color: "#334155", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                      <li>Un solo tipo de verificación por step dentro de un nivel (2-4 documentos de identidad adicionales permitidos).</li>
                      <li>Mínimo un campo obligatorio configurado en la sección de datos del solicitante.</li>
                      <li>Documentos con dos lados requieren ambas imágenes — falta de una cara es motivo de RETRY.</li>
                      <li>Consistencia de datos: lo declarado (<code>fixedInfo</code>) debe coincidir con lo extraído (<code>info</code>) — mismatch dispara <code>rejectLabels</code>.</li>
                      <li>Cobertura de documentos/países configurada en el nivel debe validarse contra la base real de usuarios de backoffice.</li>
                      <li>Vigencias de documentos (ej. Cámara de Comercio, Personería Jurídica) no se revalidan automáticamente — requiere chequeo periódico contra <code>idDocs[].validUntil</code>.</li>
                    </ul>
                  </DashSection>
                </div>
              )}

              {/* ─ TAB: MAPEO API · FORMULARIOS ─ */}
              {activeSumsubTab === "mapeo" && (
                <div>
                  <DashSection title="Datos Personales (KYC) — Colombia / CR-GT-AR-VE-PY / CL-PE-EC-PA-MX" icon={<User size={18} />}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo del formulario</th><th style={tableHeaderStyle}>Objeto/campo API Sumsub</th><th style={tableHeaderStyle}>Estado</th></tr></thead>
                      <tbody>
                        {[
                          { campo: "Primer nombre", api: "info.firstName", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Segundo nombre", api: "info.middleName", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Primer apellido", api: "info.lastName", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Segundo apellido", api: "Sin campo propio — parte de info.lastName", estado: "Abierto", color: "#F59E0B", bg: "#FFFBEB" },
                          { campo: "Fecha de nacimiento", api: "info.dob", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Nacionalidad", api: "info.nationality", estado: "Declarado + conciliado", color: "#3B82F6", bg: "#EFF6FF" },
                          { campo: "Tipo de documento", api: "idDocs[].idDocType + ocrDocType", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Número de documento (\"Documento\" en Colombia)", api: "idDocs[].number", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Foto frontal del documento", api: "idDocs[] (imagen, add-verification-documents)", estado: "OCR", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Correo de contacto", api: "email (nivel applicant)", estado: "Verificado por código", color: "#10B981", bg: "#ECFDF5" },
                          { campo: "Código de país + Teléfono celular", api: "phone (nivel applicant)", estado: "Abierto (formato E.164)", color: "#F59E0B", bg: "#FFFBEB" },
                          { campo: "Dirección", api: "fixedInfo.addresses", estado: "Autodeclarado, no OCR", color: "#EF4444", bg: "#FEF2F2" },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td style={tableCellStyle}>{row.campo}</td>
                            <td style={tableCellStyle}><code>{row.api}</code></td>
                            <td style={tableCellStyle}><span style={badgeStyle(row.color, row.bg)}>{row.estado}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Solo hay un campo de carga (&quot;Foto frontal del documento&quot;) — no hay captura de reverso en este formulario ni upload de comprobante de domicilio (por eso Dirección es autodeclarada).</div>
                  </DashSection>

                  <DashSection title="Datos de Facturación (Natural / Jurídica) — 9 países LATAM" icon={<Database size={18} />}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo del formulario</th><th style={tableHeaderStyle}>Persona Natural</th><th style={tableHeaderStyle}>Persona Jurídica</th><th style={tableHeaderStyle}>Objeto API</th></tr></thead>
                      <tbody>
                        {[
                          { campo: "Nombre Completo / Razón Social", nat: "info.firstName + lastName", jur: "info.companyInfo.companyName", obj: "info (OCR)" },
                          { campo: "Número doc. identidad", nat: "idDocs[].number", jur: "—", obj: "info.idDocs (OCR)" },
                          { campo: "Número doc. tributario (RUC/NIT/CUIT/RFC)", nat: "idDocs[].number o companyInfo.taxId", jur: "companyInfo.taxId / registrationNumber", obj: "info — a definir con TI" },
                          { campo: "Tipo de documento", nat: "idDocs[].idDocType + ocrDocType", jur: "companyInfo.type", obj: "info (OCR)" },
                          { campo: "Documentos a subir (RUC, RUT, Cámara Comercio...)", nat: "idDocs[]", jur: "idDocType: COMPANY_DOC", obj: "info.idDocs (OCR)" },
                          { campo: "Dirección / Localidad", nat: "addresses[].town/state", jur: "companyInfo.address", obj: "info (OCR) — riesgo de formato vs. taxonomía fiscal local" },
                          { campo: "Email para facturación (obligatorio)", nat: "Respuesta del cuestionario WebSDK", jur: "Respuesta del cuestionario WebSDK", obj: "questionnaires" },
                          { campo: "Número de teléfono", nat: "Respuesta del cuestionario WebSDK", jur: "Respuesta del cuestionario WebSDK", obj: "questionnaires" },
                          { campo: "Régimen Fiscal", nat: "Respuesta del cuestionario WebSDK", jur: "Respuesta del cuestionario WebSDK", obj: "questionnaires" },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td style={tableCellStyle}>{row.campo}</td>
                            <td style={{ ...tableCellStyle, fontSize: 12 }}><code>{row.nat}</code></td>
                            <td style={{ ...tableCellStyle, fontSize: 12 }}><code>{row.jur}</code></td>
                            <td style={{ ...tableCellStyle, fontSize: 12 }}>{row.obj}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 6 }}>📌 Todo pasa por el WebSDK de Sumsub (Flujo 2)</div>
                      <p style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.6, margin: 0 }}>Los campos no extraíbles por OCR (Email facturación, Teléfono, Régimen Fiscal) se capturan como <strong>cuestionario</strong> dentro del mismo WebSDK — no en un formulario aparte de Dropi. Se leen de <code>questionnaires</code> vía <code>GET applicant data</code>, no del webhook. <strong>Pendiente con TI:</strong> fijar un <code>id</code> estable por pregunta para no depender de texto/posición.</p>
                    </div>

                    <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#6D28D9", marginBottom: 6 }}>♻️ Caso: facturación = mismos datos personales (persona natural)</div>
                      <p style={{ fontSize: 12, color: "#4C1D95", lineHeight: 1.6, margin: 0 }}>No se resuben documentos — el usuario solo llena los campos adicionales del cuestionario. Encaja con el mecanismo nativo de <strong>Applicant Action</strong> sobre el mismo <code>applicantId</code> del KYC: se mantiene <code>externalUserId</code>/<code>applicantId</code>, los datos de identidad se leen del applicant original, y solo el cuestionario de facturación llega atado a un <code>applicantActionId</code> nuevo. <strong>Pendiente confirmar con TI.</strong></p>
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "20px 0 10px 0" }}>Documentos a subir por país (configuración de idDocType en el nivel)</div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Persona</th><th style={tableHeaderStyle}>Documentos a subir</th></tr></thead>
                      <tbody>
                        {[
                          { pais: "🇵🇾 Paraguay", nat: "RUC, Cédula (frente+dorso, mismo archivo)", jur: "Constancia de RUC" },
                          { pais: "🇦🇷 Argentina", nat: "Constancia ARCA, DNI (frente+dorso)", jur: "Constancia ARCA + Estatuto/Contrato Social (IGJ)" },
                          { pais: "🇨🇴 Colombia", nat: "Cédula, RUT actualizado (PDF)", jur: "RUT completo + Cámara de Comercio (<90 días)" },
                          { pais: "🇵🇪 Perú", nat: "DNI, Ficha RUC (SUNAT)", jur: "Ficha RUC (\"Activo\"/\"Habido\") + Partida Registral (Sunarp)" },
                          { pais: "🇬🇹 Guatemala", nat: "Constancia RTU (SAT), DPI", jur: "Constancia RTU + Nombramiento de Representante" },
                          { pais: "🇨🇷 Costa Rica", nat: "Cédula (ambos lados) + RUT (opcional)", jur: "Personería Jurídica (<1 mes) + Constancia Tributaria" },
                          { pais: "🇲🇽 México", nat: "Constancia de Situación Fiscal (CSF)", jur: "Constancia de Situación Fiscal (CSF)" },
                          { pais: "🇪🇨 Ecuador", nat: "Cédula + RUC (PDF SRI, si aplica)", jur: "RUC (SRI) + Cédula del Representante Legal" },
                          { pais: "🇨🇱 Chile", nat: "Cédula (ambos lados)", jur: "E-RUT (SII) + Constitución de Sociedad (opcional)" },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td style={tableCellStyle}><strong>{row.pais}</strong></td>
                            <td style={{ ...tableCellStyle, fontSize: 12 }}>{row.nat}</td>
                            <td style={{ ...tableCellStyle, fontSize: 12 }}>{row.jur}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>KYB (persona jurídica) tiene campos específicos por país → requiere formulario/cuestionario dinámico por país, no un esquema fijo de columnas.</div>
                  </DashSection>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
      <HubFooter />
    </div>
  );
}
