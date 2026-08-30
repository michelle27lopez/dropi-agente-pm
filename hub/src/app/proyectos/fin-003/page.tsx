"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  ChevronDown, ChevronUp, Copy, Check, FileText,
  AlertTriangle, ShieldAlert, Layers, Clock, TrendingUp, TrendingDown, Users, MousePointerClick, Target,
  ArrowRight, Globe2,
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

function KPI({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon?: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${color}20`, borderRadius: 12, padding: "14px 18px", borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        {icon && <div style={{ color, opacity: 0.7 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 16, fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
      <strong>⏳ Pendiente de enlazar.</strong> {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Fin003ProjectPage() {
  const [docAccordionOpen, setDocAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("contexto");
  const [activeCountry, setActiveCountry] = useState<string>("colombia");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (sectionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="FIN-003 · Masificación Dropipay — Visibilidad de retiros en USDT"
        subtitle="Célula Fintech · PM Dropipay: Harry Hernández · POC: Nicolás Vargas Galindo"
        currentSlug="fin-003"
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
                <span style={badgeStyle("#B45309", "#FEF3C7")}>🟢 Following · M2 Quincenal</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧩 Experimento en módulos transaccionales</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Masificación Dropipay — Visibilidad de retiros en USDT
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0" }}>
                Modal experimental en UserPilot para dar visibilidad a un flujo de retiro USDT que ya existía en Dropi pero era prácticamente invisible en la experiencia. Piloto extendido desde 27-jul, en following quincenal — último corte: 20-ago-2026 (Colombia, Ecuador, Chile).
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Responsable (PD/POC)</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Nicolás Vargas Galindo</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Proveedor operativo</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Miwa Crypto Arbitrage</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 28 }}>
          <KPI label="Expuestos al modal (CO)" value="9.808" sub="Datos Bancarios · corte 20-ago (29 jul → 20 ago)" color="#3B82F6" icon={<Users size={18} />} />
          <KPI label="Clic en CTA (CO)" value="7,67%" sub="752 usuarios agregaron cuenta USDT" color="#8B5CF6" icon={<MousePointerClick size={18} />} />
          <KPI label="Retirantes nuevos (CO)" value="2,12%" sub="21 de 752 con clic · monto atribuible 39.384 USDT" color="#10B981" icon={<TrendingUp size={18} />} />
          <KPI label="Meta de conversión objetivo" value="25%" sub="Estándar interno · no alcanzada" color="#F59E0B" icon={<Target size={18} />} />
          <KPI label="Tasa de dismissed" value="91,8%" sub="Sin banner de refuerzo pasivo activo" color="#DC2626" icon={<ShieldAlert size={18} />} />
          <KPI label="Exposición EC / CL" value="13 / 11" sub="Filtro de 90 días excluye la mayoría de la base" color="#94A3B8" icon={<TrendingDown size={18} />} />
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
                  <span style={badgeStyle("#4338CA", "#E0E7FF")}>Fuentes: POC_Masificacion_USDT.md + Following_Experimento_USDT.md</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Reporte de POC — contexto, discovery, resultados del piloto, decisión de extenderlo y following quincenal por país.
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
                    { id: "contexto", label: "🧠 1. Contexto & Objetivo" },
                    { id: "discovery", label: "🫀 2. Discovery & Decisiones" },
                    { id: "resultados", label: "📊 3. Tráfico & Resultados" },
                    { id: "insights", label: "💡 4. Insights" },
                    { id: "decision", label: "🚦 5. Decisión & Próximos Pasos" },
                    { id: "following", label: "🌎 6. Following por País" },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? "#6366F1" : "#ffffff", color: activeTab === tab.id ? "#ffffff" : "#475569", border: activeTab === tab.id ? "1px solid #6366F1" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — CONTEXTO */}
                {activeTab === "contexto" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={sectionHeadingStyle}><span>🧠 1. Contexto y Problema</span></h3>
                      <button onClick={() => handleCopy("contexto", "FIN-003 Contexto")} style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {copiedSection === "contexto" ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        {copiedSection === "contexto" ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>

                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr><th style={tableHeaderStyle}>Campo</th><th style={tableHeaderStyle}>Contenido</th></tr></thead>
                        <tbody>
                          <tr><td style={tableCellStyle}><strong>Célula</strong></td><td style={tableCellStyle}>Fintech</td></tr>
                          <tr><td style={tableCellStyle}><strong>Estado</strong></td><td style={tableCellStyle}>POC — Extendido, en following quincenal (M2)</td></tr>
                          <tr><td style={tableCellStyle}><strong>Responsable</strong></td><td style={tableCellStyle}>Nicolás Vargas Galindo (Product Designer)</td></tr>
                          <tr><td style={tableCellStyle}><strong>Stakeholders</strong></td><td style={tableCellStyle}>Harry Hernández (PM Dropipay), Diana Aldana (Célula Dropi), Laura Katherine Torres (UserPilot), Laura Contreras (Lead Diseño), Miwa Crypto Arbitrage (proveedor operativo del flujo USDT)</td></tr>
                          <tr><td style={tableCellStyle}><strong>Período del piloto</strong></td><td style={tableCellStyle}>27 de julio, 2026 → en curso. Primer corte: 13 de agosto. Following extendido, último corte: 20 de agosto.</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
                      Dropipay contaba con un bloqueante de liquidez que impedía escalar la base de usuarios. Con la aprobación de un crédito de 1.5M USD, ese bloqueante se resolvió y el equipo recibió luz verde para masificar Dropipay dentro del ecosistema Dropi.
                    </p>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
                      En paralelo, se identificó una funcionalidad activa pero completamente invisible: <strong>Dropi ya permite a sus usuarios retirar su saldo en USDT</strong> a través de Miwa Crypto Arbitrage (vertical que provee el servicio y se lleva el 1,3% del volumen movido), pero ningún punto de la experiencia comunica esta opción. En el flujo original, USDT solo aparece al final del proceso de retiro, dentro de un dropdown largo, sin contexto ni propuesta de valor.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#1E40AF", fontSize: 13 }}>Línea base</strong>
                        <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}>~15 usuarios mensuales usaban el retiro en USDT sobre un ecosistema de ~200.000 usuarios en Dropi. Volumen en crecimiento orgánico mes a mes: abril 523K USDT → julio 1,95M USDT. Meta de negocio: escalar de 2M a 10M USD mensuales.</p>
                      </div>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#991B1B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={16} /> Por qué se priorizó este experimento</strong>
                        <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>A diferencia de la masificación de Dropipay (dependiente de liquidez, timeline ajustado a julio), el flujo USDT no tenía riesgo de liquidez — el retiro tarda ~48 horas en procesarse — lo que lo convirtió en el candidato ideal para priorizar como primer experimento.</p>
                      </div>
                    </div>

                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: 14, borderRadius: 10, marginBottom: 20 }}>
                      <strong style={{ fontSize: 13, color: "#92400E" }}>Nota de alcance</strong>
                      <p style={{ fontSize: 12, color: "#78350F", margin: "6px 0 0 0", lineHeight: 1.5 }}>
                        El experimento se diseñó originalmente con modal + banner, pero el banner presentó problemas de configuración en UserPilot y se descartó de la implementación final. El piloto corrió únicamente con el componente modal. La mayoría de los resultados con volumen suficiente para leerse siguen siendo de <strong>Colombia</strong>; desde el corte del 20 de agosto, Ecuador y Chile también quedaron expuestos al modal, pero con muestras muy pequeñas (13 y 11 usuarios) — insuficientes todavía para sacar conclusiones de conversión.
                      </p>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Objetivo</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      Dar visibilidad a la opción de retirar en USDT dentro de los módulos de Dropi donde el usuario tiene mayor probabilidad de considerarla, sin modificar el desarrollo existente de Dropi ni de Dropipay, usando un experimento no invasivo (modal) montado en UserPilot.
                    </p>
                    <p style={{ fontSize: 12, color: "#64748B" }}>
                      <strong>Fuera de alcance en esta fase:</strong> rediseño de pantallas nativas de Dropi, banners de marketing, intervención en Dropipay app.
                    </p>
                  </div>
                )}

                {/* TAB 2 — DISCOVERY */}
                {activeTab === "discovery" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🫀 2. Discovery y Decisiones Clave</span></h3>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Módulos identificados</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      Se descartó el módulo de Historial de Cartera tras alineación con Diana Aldana. Los dos módulos candidatos, confirmados por research de su célula, fueron:
                    </p>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li><strong>Datos Bancarios</strong> — momento de configuración de métodos de pago, baja fricción para introducir una opción nueva.</li>
                      <li><strong>Retiros de Saldo</strong> — momento de mayor intención transaccional. Solo el 12% de usuarios activos de Dropi llega a este módulo; es el paso con mayor fricción reportada por research previo (retiros lentos, rechazados, sin visibilidad de estado).</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Segmentación</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      Dropshippers y proveedores con cuentas de más de 90 días de antigüedad, para no agregar fricción a la activación inicial de usuarios nuevos. Prioridad de países: Colombia → Ecuador → México → Chile → Perú.
                    </p>
                    <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: 12, marginBottom: 16 }}>
                      <p style={{ fontSize: 12, color: "#166534", margin: 0, lineHeight: 1.5 }}>
                        <strong>Confirmado con el following (corte 20 ago):</strong> el filtro de 90 días sí es la barrera dominante en mercados de apertura reciente, no el mensaje del modal. Ecuador y Chile solo expusieron 13 y 11 usuarios en todo el periodo, frente a cientos de visitas semanales reales a los módulos — la muestra sigue siendo muy pequeña, pero apunta en esa dirección.
                      </p>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Componentes y condicionales</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li><strong>Modal (único componente implementado):</strong> se muestra una sola vez al día por usuario, considerando ambos módulos en conjunto — si el usuario ya vio el modal ese día al entrar a Datos Bancarios, no vuelve a aparecer si entra también a Retiros de Saldo el mismo día (y viceversa). Desaparece esa jornada al completar la acción o cerrarse.</li>
                      <li><strong>Banner:</strong> diseñado como refuerzo pasivo con dos variantes de fondo según el origen del usuario (entrada directa vs. redirección desde el otro módulo), pero presentó problemas de configuración en UserPilot durante el montaje y se descartó de la implementación final. Queda documentado como aprendizaje para una siguiente iteración.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Restricciones técnicas relevantes</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingLeft: 20, marginBottom: 16 }}>
                      <li>UserPilot solo opera en <strong>web desktop</strong>; no hay soporte para mobile ni banners en la app.</li>
                      <li>Cada evento clicable debe definirse manualmente para tracking; los dashboards los construye el diseñador, no UserPilot.</li>
                    </ul>

                    <div style={{ background: "#FAF5FF", border: "1px solid #E9D5FF", padding: 16, borderRadius: 10, marginBottom: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#6B21A8", margin: "0 0 8px 0" }}>Revisión legal</h4>
                      <p style={{ fontSize: 12, color: "#581C87", lineHeight: 1.6, margin: 0 }}>
                        Concepto jurídico obtenido antes de producción: la operación de custodia de USDT debe permanecer exclusivamente en Dropi Pay (MIWA SAS), nunca mezclada con la marca Dropi. Se prohibió usar la palabra &quot;dólares&quot; para referirse al USDT (es un criptoactivo, no una divisa) y se incorporaron advertencias obligatorias sobre fluctuación de valor, ausencia de garantía estatal y posibles obligaciones tributarias en los flujos de agregar cuenta y confirmación de retiro.
                      </p>
                    </div>

                    <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 16 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1E40AF", margin: "0 0 8px 0" }}>Hipótesis del experimento</h4>
                      <p style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.6, margin: "0 0 8px 0" }}>
                        &quot;Si mostramos un modal/banner comunicando la disponibilidad del retiro en USDT en el módulo de Datos Bancarios o Retiros de Saldo, el usuario considerará esta opción porque desconoce que existe, no porque no la quiera — el problema es de descubrimiento, no de intención.&quot;
                      </p>
                      <p style={{ fontSize: 12, color: "#1E3A8A", margin: 0 }}>
                        Métrica de éxito definida (estándar interno sin data previa): <strong>25% de conversión de exposición a acción.</strong> Ni el corte del 13 ni el del 20 de agosto la alcanzan (7,67% de clic en el mejor caso) — el estándar se definió sin data previa y puede necesitar recalibrarse una vez cerrado el embudo completo.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3 — RESULTADOS */}
                {activeTab === "resultados" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>📊 3. Tráfico Real por País y Resultados del Piloto</span></h3>

                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>
                      Datos compartidos por Laura Katherine Torres desde UserPilot. Tráfico total a los módulos de Datos Bancarios y Retiros de Saldo por país, <strong>sin aplicar el filtro de antigüedad de cuenta de 90 días</strong> — referencia del alcance potencial máximo si se ajustara esa restricción.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Usuarios activos (mensual)</th><th style={tableHeaderStyle}>Visitas &quot;Datos Bancarios&quot; (sem. prom.)</th><th style={tableHeaderStyle}>Visitas &quot;Retiros de Saldo&quot; (sem. prom.)</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>🇨🇴 Colombia</td><td style={tableCellStyle}>82.125</td><td style={tableCellStyle}>~3.030</td><td style={tableCellStyle}>~6.618</td></tr>
                        <tr><td style={tableCellStyle}>🇪🇨 Ecuador</td><td style={tableCellStyle}>13.608</td><td style={tableCellStyle}>~588</td><td style={tableCellStyle}>~1.412</td></tr>
                        <tr><td style={tableCellStyle}>🇨🇱 Chile</td><td style={tableCellStyle}>20.630</td><td style={tableCellStyle}>~666</td><td style={tableCellStyle}>~836</td></tr>
                        <tr><td style={tableCellStyle}>🇲🇽 México</td><td style={tableCellStyle}>8.743</td><td style={tableCellStyle}>~299</td><td style={tableCellStyle}>~452</td></tr>
                        <tr><td style={tableCellStyle}>🇵🇪 Perú</td><td style={tableCellStyle}>5.576</td><td style={tableCellStyle}>~98</td><td style={tableCellStyle}>~54</td></tr>
                      </tbody>
                    </table>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>
                      *Promedios calculados sobre las semanas del 29 de junio al 3 de agosto (previas a la última semana parcial del corte).
                    </p>
                    <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 14, marginBottom: 24 }}>
                      <p style={{ fontSize: 12, color: "#1E3A8A", margin: 0, lineHeight: 1.6 }}>
                        <strong>Lectura:</strong> el volumen real de tráfico a ambos módulos en Ecuador, Chile y México es considerablemente mayor al que el experimento logró exponer bajo el filtro de 90 días. El following del 20 de agosto ya lo confirma con datos reales de exposición (no solo tráfico potencial): Ecuador y Chile apenas expusieron 13 y 11 usuarios en todo el periodo. La baja exposición en esos países es un problema de configuración de alcance, no de falta de tráfico ni de mensaje — hay usuarios suficientes, pero la mayoría de sus cuentas no supera aún los 90 días de antigüedad por ser mercados de apertura más reciente.
                      </p>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Corte 1 — Datos Bancarios · Colombia · 18 días (13 de agosto)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                      <thead><tr><th style={tableHeaderStyle}>Etapa</th><th style={tableHeaderStyle}>Usuarios</th><th style={tableHeaderStyle}>% del total</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Expuestos al modal</td><td style={tableCellStyle}>8.060</td><td style={tableCellStyle}>100%</td></tr>
                        <tr><td style={tableCellStyle}>Clic en CTA &quot;Agregar cuenta USDT&quot;</td><td style={tableCellStyle}>528</td><td style={tableCellStyle}>6,55%</td></tr>
                        <tr><td style={tableCellStyle}>Realizaron un retiro en USDT (30 días)</td><td style={tableCellStyle}>21</td><td style={tableCellStyle}>0,26%</td></tr>
                        <tr><td style={tableCellStyle}>Retirantes nuevos (sin uso previo de USDT)</td><td style={tableCellStyle}>7</td><td style={tableCellStyle}>0,09%</td></tr>
                      </tbody>
                    </table>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 20 }}>
                      <li><strong>Volumen atribuible al experimento:</strong> 13.632 USDT de los 7 retirantes nuevos, equivalente al 0,72% del volumen total de retiros USDT del período (1.893.353 USDT).</li>
                      <li><strong>Tasa de dismissed:</strong> 91,8% — consistente con el comportamiento esperado de un componente tipo popup. Al no contar con el banner como refuerzo pasivo, el usuario que cierra el modal sin actuar no recibe ningún recordatorio posterior en su siguiente visita al módulo.</li>
                      <li><strong>Desempeño por rol:</strong> los dropshippers convirtieron mejor (6,92%) que los suppliers (5,56%), y representaron el 73% de los expuestos — hallazgo que contradice la hipótesis inicial de que el proveedor era el usuario objetivo principal del flujo USDT.</li>
                      <li><strong>Contexto regional:</strong> Colombia creció +24% en transacciones y +39% en monto durante el período, pero la variación acumulada de todos los países fue negativa (-38 transacciones), sugiriendo un factor macro ajeno al experimento afectando varios mercados simultáneamente. Chile cayó -63% sin relación aparente al experimento por su baja exposición.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Corte 2 — Embudo acumulado (29 jul → 20 ago) · Colombia</h4>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>
                      Segundo corte con una semana adicional de following. Estos números <strong>reemplazan</strong> a los del corte 1 como lectura del experimento — el corte 1 se conserva arriba como referencia histórica.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                      <thead><tr><th style={tableHeaderStyle}>Etapa</th><th style={tableHeaderStyle}>Usuarios</th><th style={tableHeaderStyle}>%</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Expuestos al modal</td><td style={tableCellStyle}>9.808</td><td style={tableCellStyle}>100%</td></tr>
                        <tr><td style={tableCellStyle}>Clic en CTA</td><td style={tableCellStyle}>752</td><td style={tableCellStyle}>7,67%</td></tr>
                        <tr><td style={tableCellStyle}>Retiraron USDT (30 días)</td><td style={tableCellStyle}>35</td><td style={tableCellStyle}>0,36%</td></tr>
                        <tr><td style={tableCellStyle}>Retirantes nuevos (atribuibles)</td><td style={tableCellStyle}>21</td><td style={tableCellStyle}>0,21%</td></tr>
                      </tbody>
                    </table>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 20 }}>
                      <li><strong>Monto atribuible:</strong> 39.384 USDT de los 21 retirantes nuevos — casi el triple de los 13.632 USDT del corte 1, con solo 7 días más de medición. Equivale al 2,12% del volumen total de retiros USDT del periodo (1.853.544 USDT), frente al 0,72% del corte anterior.</li>
                      <li><strong>Concentración de riesgo:</strong> un solo usuario (Reginaldo Amaral, dropshipper) concentra el 67% del monto atribuible (26.528 USDT) — el hallazgo de crecimiento es real, pero su magnitud depende fuertemente de casos individuales, no de un patrón amplio y distribuido.</li>
                      <li><strong>Desglose por rol de los 21 retirantes nuevos:</strong> 17 dropshippers vs. solo 4 suppliers. El proveedor sigue sin responder de forma significativa pese a ser el público originalmente identificado como objetivo del flujo USDT (pago de importaciones).</li>
                      <li><strong>Tasa de clic:</strong> mejoró levemente de 6,55% a 7,67%, aunque no es posible aislar si es tendencia real o variación esperable con más volumen de usuarios expuestos.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Primer corte — Ecuador y Chile (20 de agosto)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Expuestos</th><th style={tableHeaderStyle}>Clic CTA</th>
                          <th style={tableHeaderStyle}>% Clic</th><th style={tableHeaderStyle}>Retiraron USDT</th><th style={tableHeaderStyle}>Nuevos atribuibles</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>🇨🇴 Colombia</td><td style={tableCellStyle}>9.808</td><td style={tableCellStyle}>752</td><td style={tableCellStyle}>7,67%</td><td style={tableCellStyle}>35</td><td style={tableCellStyle}>21</td></tr>
                        <tr><td style={tableCellStyle}>🇪🇨 Ecuador</td><td style={tableCellStyle}>13</td><td style={tableCellStyle}>2</td><td style={tableCellStyle}>15,38%*</td><td style={tableCellStyle}>0</td><td style={tableCellStyle}>0</td></tr>
                        <tr><td style={tableCellStyle}>🇨🇱 Chile</td><td style={tableCellStyle}>11</td><td style={tableCellStyle}>3</td><td style={tableCellStyle}>27,27%*</td><td style={tableCellStyle}>0</td><td style={tableCellStyle}>0</td></tr>
                      </tbody>
                    </table>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginBottom: 16 }}>
                      *Porcentajes de Ecuador y Chile no son comparables con Colombia por tamaño de muestra — se incluyen solo como referencia, no como señal de desempeño.
                    </p>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20 }}>
                      <li><strong>Ecuador:</strong> 13 expuestos, 2 clic (15,38%), 0% adopción (ninguno retiró en 30 días). Uno de los 2 completers parece ser una cuenta de prueba del equipo (Laura Catherina Torres Ciendua) contabilizada como conversión real — pendiente depurar antes de reportar a stakeholders.</li>
                      <li><strong>Chile:</strong> 11 expuestos, 3 clic (27,27% — la tasa más alta de los tres países, pero no representativa), 0% adopción. Chile tuvo una caída de -63% en transacciones USDT en el periodo anterior por causas ajenas al experimento (baja exposición), pendiente de investigar con stakeholders locales.</li>
                      <li><strong>Ninguno de los usuarios expuestos en Ecuador o Chile completó un retiro en USDT</strong>, pero la muestra (13 y 11 usuarios) es demasiado pequeña para interpretarlo como señal de desempeño del experimento en sí.</li>
                    </ul>
                  </div>
                )}

                {/* TAB 4 — INSIGHTS */}
                {activeTab === "insights" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>💡 4. Insights Clave</span></h3>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                      Actualizados con el following del 20 de agosto — reemplazan la lectura del primer corte (13 ago) donde se solapan.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { n: 1, title: "El tiempo de following era insuficiente en el primer corte.", desc: "El salto de 7 a 21 retirantes nuevos y de 13.632 a 39.384 USDT atribuibles en solo una semana adicional confirma que el ciclo natural de retiro del usuario —especialmente proveedores— necesita más tiempo del que contemplaba el piloto original de 18 días." },
                        { n: 2, title: "La concentración en pocos usuarios es un riesgo para la lectura del resultado.", desc: "Un solo usuario (Reginaldo Amaral) representa el 67% del monto atribuible del corte 2. El hallazgo de crecimiento es real, pero su magnitud depende fuertemente de casos individuales de alto volumen, no de un patrón amplio y distribuido." },
                        { n: 3, title: "El segmento proveedor sigue sin responder de forma significativa.", desc: "Solo 4 de 21 retirantes nuevos son suppliers, y sus montos individuales son bajos comparados con los dropshippers de mayor volumen. El público originalmente identificado como objetivo del flujo USDT (proveedores pagando importaciones) no es el que más convierte." },
                        { n: 4, title: "El modal genera awareness pero no basta para convertir.", desc: "La conversión de clic a retiro efectivo ronda el 4-5% en ambos cortes — existe una ruptura entre \"conocer la opción\" y \"usarla\". El embudo completo (clic → cuenta configurada → retiro) sigue sin cerrarse; falta instrumentar el paso intermedio de configuración de cuenta." },
                        { n: 5, title: "El crecimiento de negocio observado no es enteramente atribuible al experimento.", desc: "El volumen de retiros USDT venía en crecimiento orgánico desde abril; los datos no permiten conectar el crecimiento de Colombia con el experimento de forma causal." },
                        { n: 6, title: "Ecuador y Chile confirman con datos reales la hipótesis del filtro de 90 días.", desc: "Con solo 13 y 11 usuarios expuestos respectivamente en todo el periodo —frente a cientos de visitas semanales reales a los módulos— queda claro que el techo de exposición no es el mensaje ni el diseño del modal, sino la restricción de antigüedad de cuenta. Ninguno de los expuestos en estos dos países completó un retiro en USDT, pero la muestra es demasiado pequeña para interpretarlo como señal de desempeño del experimento." },
                        { n: 7, title: "Persisten dos brechas de medición.", desc: "Falta el dato de cuentas USDT agregadas por primera vez (pendiente autorización de María Ossa para el cruce con Tech) y aún no se ha resuelto la configuración del banner de refuerzo pasivo en UserPilot." },
                        { n: 8, title: "Detectada una posible cuenta de prueba en los datos de Ecuador.", desc: "Laura Catherina Torres Ciendua aparece contabilizada como conversión real. Se recomienda depurar cuentas internas del equipo antes de reportar métricas a stakeholders, para no inflar artificialmente la tasa de adopción en muestras pequeñas donde un solo registro tiene alto peso relativo." },
                        { n: 9, title: "La limitación mobile de UserPilot deja fuera un canal relevante.", desc: "Cualquier estrategia de comunicación masiva (ej. WhatsApp) no puede garantizar que el usuario complete el flujo desde su celular." },
                      ].map((item) => (
                        <div key={item.n} style={{ display: "flex", gap: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 999, background: "#6366F1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{item.n}</div>
                          <div>
                            <strong style={{ fontSize: 13, color: "#0F172A" }}>{item.title}</strong>
                            <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.5 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5 — DECISIÓN */}
                {activeTab === "decision" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🚦 5. Decisión y Próximos Pasos</span></h3>

                    <div style={{ background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                      <strong style={{ fontSize: 13, color: "#065F46" }}>Decisión: Extender el following, no cerrar ni reemplazar.</strong>
                      <p style={{ fontSize: 12, color: "#065F46", margin: "6px 0 0 0", lineHeight: 1.6 }}>
                        El corte del 20 de agosto confirmó que el tiempo de medición original (18 días) era insuficiente: el monto atribuible casi se triplicó con solo una semana más. El following pasa a cadencia quincenal (M2). Siguen sin medirse las cuentas USDT configuradas por primera vez y el cumplimiento completo del ciclo natural de retiro (20 días a 2 meses según ciclos de importación) — ambas pueden seguir cambiando la lectura del resultado.
                      </p>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Ajustar flujo</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 16 }}>
                      <li>Solicitar a Tech —con autorización de María Ossa— el cruce de cuentas USDT agregadas por primera vez entre los 752 usuarios que hicieron clic en Colombia, y luego repetir el cruce en Ecuador/Chile.</li>
                      <li>Ejecutar A/B test combinado: reducir el filtro de antigüedad de cuenta (90d → 30d) + simplificar copy manteniendo disclaimers legales, priorizando Ecuador y Chile, donde el filtro actual deja fuera a la gran mayoría de la base.</li>
                      <li>Resolver la configuración técnica del banner con UserPilot y reincorporarlo como refuerzo pasivo, dado que su ausencia probablemente contribuye al alto ratio de dismissed sin recuperación.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Seguir midiendo</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 16 }}>
                      <li>Mantener el following activo al menos 2-3 semanas adicionales en Colombia para capturar el ciclo completo de retiro de los usuarios expuestos en el corte del 20 de agosto.</li>
                      <li>Esperar mayor volumen de exposición en Ecuador y Chile antes de sacar conclusiones de conversión — la muestra actual (13 y 11 usuarios) es insuficiente.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Otros pendientes</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 20 }}>
                      <li>Depurar cuentas de prueba internas (ej. equipo UserPilot, caso detectado en Ecuador) de los reportes de conversión antes de socializar con stakeholders.</li>
                      <li>Avanzar en la estrategia de lanzamiento ampliada (tutorial embebido, guía rápida, contenido en redes) para atacar el alto dismissed en Colombia.</li>
                      <li>Investigar cualitativamente la mayor conversión de dropshippers frente a suppliers.</li>
                      <li>Recibir el export de UserPilot de México y Perú para completar el consolidado de los 5 países priorizados.</li>
                      <li>Dar seguimiento con la célula de Diana Aldana para evaluar intervención nativa en el flujo de Dropi si los resultados de la fase ampliada son positivos.</li>
                    </ul>

                    <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Recursos del proyecto</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.9, paddingLeft: 20, marginBottom: 12 }}>
                      <li><strong>Kickoff y estrategia de medición</strong> (Datos Bancarios y Retiros de Saldo): <a href="https://docs.google.com/document/d/170gEs71634QxOWcbV4ZPEusLFAxVuCdqHNkn50Zvbec/edit?tab=t.0#heading=h.qwga0y22f9jb" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>ver documento</a></li>
                      <li><strong>Registro del following:</strong> <a href="https://www.figma.com/board/MW0o3WsXkFFifIC6D9halP/Dropipay-UX?node-id=771-2824&t=4PgJUQuwkAIFa3Im-0" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>ver FigJam</a></li>
                      <li><strong>Wireframes y flujos del retiro en USDT:</strong> <a href="https://www.figma.com/design/nJrnwIEaLav6GTLkgRmly0/Dropipay---Wireframes?node-id=2009-7804&p=f&t=G48hyxcaJi73mLC7-0" target="_blank" rel="noreferrer" style={{ color: "#6366F1" }}>ver diseño</a></li>
                    </ul>
                    <PendingNote>
                      Aún faltan por enlazar: dashboards de seguimiento UserPilot, cruce de cuentas USDT agregadas (pendiente autorización de María Ossa) y export de UserPilot de México y Perú.
                    </PendingNote>
                  </div>
                )}

                {/* TAB 6 — FOLLOWING POR PAÍS */}
                {activeTab === "following" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🌎 6. Following del Experimento — Corte 20 de agosto, 2026</span></h3>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                      El following pasó a cadencia <strong>quincenal (M2)</strong>. Colombia tiene un segundo corte con una semana adicional de medición; Ecuador y Chile entran por primera vez con muestras aún pequeñas.
                    </p>

                    {/* Sub-tabs por país */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      {[
                        { id: "colombia", flag: "🇨🇴", label: "Colombia" },
                        { id: "ecuador", flag: "🇪🇨", label: "Ecuador" },
                        { id: "chile", flag: "🇨🇱", label: "Chile" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setActiveCountry(c.id)}
                          style={{
                            background: activeCountry === c.id ? "#0F172A" : "#F8FAFC",
                            color: activeCountry === c.id ? "#fff" : "#475569",
                            border: activeCountry === c.id ? "1px solid #0F172A" : "1px solid #E2E8F0",
                            borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700,
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                          }}
                        >
                          <span>{c.flag}</span> {c.label}
                        </button>
                      ))}
                    </div>

                    {/* Contenido COLOMBIA */}
                    {activeCountry === "colombia" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 16 }}>
                          <KPI label="Expuestos" value="9.808" color="#3B82F6" icon={<Users size={16} />} />
                          <KPI label="Clic CTA" value="7,67%" sub="752 usuarios" color="#8B5CF6" icon={<MousePointerClick size={16} />} />
                          <KPI label="Adopción" value="2,12%" sub="21 retirantes nuevos de 752" color="#10B981" icon={<TrendingUp size={16} />} />
                          <KPI label="Monto atribuible" value="39.384 USDT" sub="2,12% del volumen total del periodo" color="#F59E0B" icon={<TrendingUp size={16} />} />
                        </div>
                        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                          El monto atribuible casi triplicó (13.632 → 39.384 USDT) con solo 7 días más de following, validando que el tiempo de medición original era insuficiente. Un solo usuario (Reginaldo Amaral) concentra el 67% del monto atribuible, lo que hace la métrica sensible a casos individuales. Solo 4 suppliers nuevos frente a 17 dropshippers — el proveedor sigue sin responder de forma significativa.
                        </p>
                        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: "#92400E" }}><strong>Dolor:</strong> alta concentración en pocos usuarios reduce la robustez estadística. Aún falta la métrica de cuentas USDT agregadas para cerrar el embudo completo.</span>
                        </div>
                      </div>
                    )}

                    {/* Contenido ECUADOR */}
                    {activeCountry === "ecuador" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 16 }}>
                          <KPI label="Expuestos" value="13" color="#3B82F6" icon={<Users size={16} />} />
                          <KPI label="Clic CTA" value="15,38%" sub="2 usuarios · muestra no significativa" color="#8B5CF6" icon={<MousePointerClick size={16} />} />
                          <KPI label="Adopción" value="0%" sub="ningún retiro en USDT (30 días)" color="#EF4444" icon={<TrendingDown size={16} />} />
                        </div>
                        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                          Exposición extremadamente baja (13 usuarios en todo el periodo) frente a las ~600-700 visitas semanales reales al módulo. Confirma que el filtro de 90 días excluye a la gran mayoría de la base en mercados de apertura reciente. Uno de los 2 completers parece ser una cuenta de prueba interna (Laura Torres) — a validar antes de reportar.
                        </p>
                        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: "#92400E" }}><strong>Próximo paso:</strong> priorizar Ecuador en el A/B test de reducción de filtro (90d → 30d).</span>
                        </div>
                      </div>
                    )}

                    {/* Contenido CHILE */}
                    {activeCountry === "chile" && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 16 }}>
                          <KPI label="Expuestos" value="11" color="#3B82F6" icon={<Users size={16} />} />
                          <KPI label="Clic CTA" value="27,27%" sub="3 usuarios · muestra no significativa" color="#8B5CF6" icon={<MousePointerClick size={16} />} />
                          <KPI label="Adopción" value="0%" sub="ningún retiro en USDT (30 días)" color="#EF4444" icon={<TrendingDown size={16} />} />
                        </div>
                        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                          Igual que Ecuador: exposición mínima (11 usuarios) frente a ~700-900 visitas semanales reales combinadas. La tasa de clic es la más alta de los tres países, pero no es representativa con solo 11 personas. Chile tuvo una caída de -63% en transacciones USDT en el periodo anterior, por causas ajenas al experimento — pendiente de investigar.
                        </p>
                        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: "#92400E" }}><strong>Próximo paso:</strong> incluir en el A/B test de filtro reducido y dar seguimiento a la caída de transacciones.</span>
                        </div>
                      </div>
                    )}

                    {/* CTA a pantalla completa de following por país */}
                    <a
                      href={`/proyectos/fin-003/following/${activeCountry}`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8,
                        background: "#0F172A", color: "#fff", textDecoration: "none",
                        padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                      }}
                    >
                      <Globe2 size={16} /> Ver following completo de {activeCountry === "colombia" ? "Colombia" : activeCountry === "ecuador" ? "Ecuador" : "Chile"} <ArrowRight size={14} />
                    </a>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ── Fuente ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>
          <Layers size={14} />
          <span>Contenido cargado desde POC_Masificacion_USDT.md y Following_Experimento_USDT.md · Última sincronización: <Clock size={12} style={{ verticalAlign: "middle" }} /> 20/08/2026</span>
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
