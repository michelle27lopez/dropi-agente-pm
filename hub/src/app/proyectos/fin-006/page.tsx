"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  ChevronDown, ChevronUp, Copy, Check, FileText,
  Layers, Clock, Wallet, ShieldAlert, FlaskConical, ListChecks, Target, Compass,
} from "lucide-react";

/* ── Shared styles (mismo patrón que FIN-003 / FIN-005) ── */
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

const subHeadingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0F172A",
  marginTop: 20,
  marginBottom: 8,
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
  padding: "10px 14px",
  fontSize: 12.5,
  borderBottom: "1px solid #E2E8F0",
  color: "#1E293B",
  verticalAlign: "top",
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

function Callout({ tone, title, children }: { tone: "warn" | "info" | "pending" | "ok"; title: string; children: React.ReactNode }) {
  const palette = {
    warn: { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E" },
    info: { bg: "#EFF6FF", border: "#93C5FD", color: "#1E3A8A" },
    pending: { bg: "#FAF5FF", border: "#E9D5FF", color: "#6B21A8" },
    ok: { bg: "#ECFDF5", border: "#6EE7B7", color: "#065F46" },
  }[tone];
  return (
    <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
      <strong style={{ fontSize: 12.5, color: palette.color }}>{title}</strong>
      <div style={{ fontSize: 12, color: palette.color, margin: "6px 0 0 0", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

const hipotesisTagStyle: React.CSSProperties = {
  display: "inline-block", fontSize: 10, fontWeight: 800, color: "#92400E", background: "#FFFBEB",
  border: "1px solid #FDE68A", borderRadius: 6, padding: "2px 6px",
};

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Fin006ProjectPage() {
  const [docAccordionOpen, setDocAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("contexto");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (sectionId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="FIN-006 · Bolsillos dropiPay — Primer acercamiento"
        subtitle="Célula Fintech · Discovery preliminar · Autor: Nicolás Vargas"
        currentSlug="fin-006"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & title ── */}
        <div style={{ marginBottom: 20 }}>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver al Hub
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={badgeStyle("#0369A1", "#E0F2FE")}>🏦 Célula Fintech</span>
                <span style={badgeStyle("#B45309", "#FEF3C7")}>🔎 Discovery preliminar</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>👛 Loop de compromiso — no activación</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Bolsillos dropiPay — Primer acercamiento
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 820 }}>
                Un usuario de dropiPay puede operar más de una unidad de negocio bajo una sola identidad legal (importación, venta directa, proveeduría local) y hoy no tiene forma de segregar el dinero, los cobros ni la trazabilidad de cada unidad. Este documento reformula el síntoma reportado por los stakeholders en un problema accionable y deja el terreno preparado para el kickoff formal.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Fecha</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Septiembre 2026</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Pendiente kickoff con</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Equipo técnico/backend y Legal</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 28 }}>
          <KPI label="Hipótesis planteadas" value="4" sub="H1–H4 · 1 validada (naming), 3 pendientes" color="#8B5CF6" icon={<FlaskConical size={18} />} />
          <KPI label="Riesgos y dependencias abiertas" value="6" sub="R1–R6 · sin dueño confirmado en la mayoría" color="#EF4444" icon={<ShieldAlert size={18} />} />
          <KPI label="Límite de bolsillos por wallet" value="10" sub="Estándar de mercado (Bancolombia, Nu) · ajustable al alza" color="#3B82F6" icon={<Wallet size={18} />} />
          <KPI label="Rentabilidad estimada" value="~7%" sub="Atada a stable coin propia — timing sin confirmar (R2)" color="#F59E0B" icon={<Target size={18} />} />
          <KPI label="Apps de benchmark" value="6" sub="Nequi, Bancolombia, Lulo, RappiPay, Wise, Relay" color="#10B981" icon={<Layers size={18} />} />
          <KPI label="TARS medido" value="0/4" sub="Mapa cualitativo hecho — faltan Target, Adopción, Retención, Satisfacción" color="#0EA5E9" icon={<Compass size={18} />} />
          <KPI label="Pendientes antes del kickoff" value="9" sub="Ver tab 7 — ninguno resuelto aún" color="#64748B" icon={<ListChecks size={18} />} />
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
                  <span style={badgeStyle("#4338CA", "#E0E7FF")}>Fuente: Bolsillos_dropiPay_Primer_Acercamiento.md</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Contexto, definición de problema, hipótesis, decisiones ya tomadas, benchmark de mercado, riesgos, mapeo TARS (Catherine) y pendientes antes del kickoff formal.
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
                    { id: "contexto", label: "🧠 1. Contexto & Problema" },
                    { id: "hipotesis", label: "💡 2. Hipótesis & Decisiones" },
                    { id: "benchmark", label: "🏦 3. Benchmark de Mercado" },
                    { id: "riesgos", label: "⚠️ 4. Riesgos & Dependencias" },
                    { id: "metricas", label: "🎯 5. Objetivos & Métricas" },
                    { id: "tars", label: "🧭 6. Metodología TARS" },
                    { id: "pendientes", label: "✅ 7. Pendientes & Próximos Pasos" },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? "#6366F1" : "#ffffff", color: activeTab === tab.id ? "#ffffff" : "#475569", border: activeTab === tab.id ? "1px solid #6366F1" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — CONTEXTO Y PROBLEMA */}
                {activeTab === "contexto" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={sectionHeadingStyle}><span>🧠 1. Contexto y Definición del Problema</span></h3>
                      <button onClick={() => handleCopy("contexto", "FIN-006 Contexto")} style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {copiedSection === "contexto" ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        {copiedSection === "contexto" ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>

                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>
                      Los stakeholders de dropiPay (Harry Hernández — CEO, y Laura Bermúdez — área financiera) identificaron que los usuarios necesitan una forma más ordenada de gestionar el dinero destinado a los distintos pagos de su operación como dropshippers.
                    </p>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>
                      La solución actual del usuario es un workaround: crear múltiples wallets de la misma moneda con nombres personalizados. Esto ordena parcialmente, pero genera un problema nuevo — listados largos de wallets repetidas por moneda, con scroll extenso para ubicar la correcta.
                    </p>

                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #E2E8F0" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr><th style={tableHeaderStyle}>Stakeholders del proyecto</th><th style={tableHeaderStyle}>Rol</th></tr></thead>
                        <tbody>
                          <tr><td style={tableCellStyle}>Harry Hernández</td><td style={tableCellStyle}>CEO dropiPay</td></tr>
                          <tr><td style={tableCellStyle}>Nicolás Vargas</td><td style={tableCellStyle}>Product Designer</td></tr>
                          <tr><td style={tableCellStyle}>Laura Bermúdez</td><td style={tableCellStyle}>Financiera</td></tr>
                        </tbody>
                      </table>
                      <p style={{ fontSize: 11.5, color: "#94A3B8", margin: "8px 0 0 0" }}>
                        Fuentes: conversación con Harry Hernández (02/09/2026) + research de mercado (Nequi, Bancolombia, Lulo, RappiPay) + Taller TARS (Catherine).
                      </p>
                    </div>

                    <h4 style={subHeadingStyle}>Del síntoma al problema</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#991B1B", fontSize: 13 }}>Enunciado inicial (stakeholder)</strong>
                        <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>&quot;Los usuarios utilizan la plata de forma desorganizada.&quot; Es un síntoma, no un problema accionable.</p>
                      </div>
                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#1E40AF", fontSize: 13 }}>Enunciado reformulado (discovery)</strong>
                        <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}>Un usuario puede operar +1 unidad de negocio bajo una sola identidad legal y no tiene forma de segregar dinero, cobros ni trazabilidad de cada una. El caso ancla: un usuario pidió wallets separadas por negocio y no pudo, porque su documento de identidad es el mismo para las tres operaciones.</p>
                      </div>
                    </div>

                    <Callout tone="info" title="💡 Distinción clave de diseño">
                      Esto es distinto de &quot;categorización de gastos&quot; (tipo Bancolombia: arriendo, mercado): aquí la unidad de segregación es el <strong>negocio</strong>, no la categoría de consumo. Bolsillos como unidades de negocio son pocos, permanentes y con identidad propia (llave, QR, extracto); bolsillos como categorías de gasto son muchos, efímeros y sin necesidad de recepción externa.
                    </Callout>

                    <h4 style={subHeadingStyle}>Problema secundario (sin explorar aún)</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>
                      Extractos de cuenta no se exportan de forma ordenada para las necesidades contables del dropshipper. Queda como línea de investigación abierta, no resuelta en esta conversación (ver R4 en la tab de Riesgos).
                    </p>

                    <h4 style={subHeadingStyle}>Tipo de usuario</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo</th><th style={tableHeaderStyle}>Contenido</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Segmento primario</strong></td><td style={tableCellStyle}>Dropshipper con experiencia (perfil &quot;Estratega&quot;, según segmentación de loops/perfiles de Catherine) que gestiona múltiples pagos mensuales y/o más de una línea de negocio.</td></tr>
                        <tr><td style={tableCellStyle}><strong>No es</strong></td><td style={tableCellStyle}>El usuario nuevo en fase de activación. Este feature vive en el <strong>loop de compromiso (loop 03)</strong>, no en activación — no reduce time-to-value ni impacta adquisición.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Evidencia actual</strong></td><td style={tableCellStyle}>Un caso ancla (N=1) documentado por Harry, más un MVP ya construido para ese usuario. Sin dimensionamiento de volumen todavía (ver R5).</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 2 — HIPÓTESIS Y DECISIONES */}
                {activeTab === "hipotesis" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>💡 2. Hipótesis y Decisiones Clave</span></h3>

                    <h4 style={subHeadingStyle}>Hipótesis</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>Hipótesis</th><th style={tableHeaderStyle}>Tipo</th><th style={tableHeaderStyle}>Validación</th></tr></thead>
                      <tbody>
                        <tr>
                          <td style={tableCellStyle}>H1</td>
                          <td style={tableCellStyle}><span style={hipotesisTagStyle}>HIPÓTESIS</span><div style={{ marginTop: 6 }}>Existe una cantidad significativa de usuarios con wallets duplicadas de la misma moneda, usadas como workaround de segregación de negocio.</div></td>
                          <td style={tableCellStyle}>Negocio/producto</td>
                          <td style={tableCellStyle}>⏳ Pendiente — consulta BigQuery</td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>H2</td>
                          <td style={tableCellStyle}><span style={hipotesisTagStyle}>HIPÓTESIS</span><div style={{ marginTop: 6 }}>El dinero asignado a un propósito específico (bolsillo) permanece más tiempo en dropiPay que el dinero en saldo general.</div></td>
                          <td style={tableCellStyle}>Negocio</td>
                          <td style={tableCellStyle}>⏳ Pendiente — se mide post-lanzamiento con métrica de permanencia</td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>H3</td>
                          <td style={tableCellStyle}><span style={hipotesisTagStyle}>HIPÓTESIS</span><div style={{ marginTop: 6 }}>Recibir pagos ya clasificados (vía llave/QR de bolsillo) reduce la fricción de reconciliación manual del dropshipper.</div></td>
                          <td style={tableCellStyle}>Producto</td>
                          <td style={tableCellStyle}>🟡 Parcialmente respaldada por el caso ancla; falta validar con más usuarios</td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>H4</td>
                          <td style={tableCellStyle}><div>El término &quot;Bolsillos&quot; es reconocible y no requiere educación adicional, dado su uso extendido en Nequi, Bancolombia, Lulo y RappiPay.</div></td>
                          <td style={tableCellStyle}>Naming</td>
                          <td style={tableCellStyle}>✅ Validada por research de mercado (ver tab Benchmark)</td>
                        </tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Decisiones ya definidas</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>Decisión</th><th style={tableHeaderStyle}>Detalle</th><th style={tableHeaderStyle}>Fuente</th></tr></thead>
                      <tbody>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Naming</td><td style={tableCellStyle}>&quot;Bolsillos&quot; — término de categoría en Colombia, no exclusivo de una marca</td><td style={tableCellStyle}>Validado</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Rentabilidad</td><td style={tableCellStyle}>Bolsillos rentarán (~7% para el usuario), atado al desarrollo de una stable coin propia con sociedad y fideicomiso nuevos, que renta ~9% y de la cual dropiPay devuelve ~7%</td><td style={tableCellStyle}>Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Ocultar del saldo total</td><td style={tableCellStyle}>Toggle personalizable por bolsillo: el usuario decide si el saldo del bolsillo suma o no al total visible de la wallet en esa moneda. No oculta el bolsillo en sí, solo su aporte a la suma.</td><td style={tableCellStyle}>Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Personalización</td><td style={tableCellStyle}>Nombre editable, ícono identificador, meta/límite de ingreso mensual (nivel similar a Bancolombia)</td><td style={tableCellStyle}>Discovery</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Pagos</td><td style={tableCellStyle}>Se puede pagar directamente desde un bolsillo, sin necesidad de descargar el dinero al disponible general de la wallet primero</td><td style={tableCellStyle}>Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Llave por bolsillo</td><td style={tableCellStyle}>Cada bolsillo tiene su propia llave de recepción (ej. <code>@importaciones</code>), sin costo adicional con el proveedor del servicio</td><td style={tableCellStyle}>Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>QR por bolsillo</td><td style={tableCellStyle}>Cada bolsillo puede generar su propio QR de cobro, compartible o mostrable en pantalla</td><td style={tableCellStyle}>Harry — señalado como diferenciador: &quot;eso no lo tiene ningún otro operador&quot;</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Extractos</td><td style={tableCellStyle}>Extracto individual por bolsillo + extracto consolidado por wallet (todos los bolsillos)</td><td style={tableCellStyle}>Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Límite de bolsillos por wallet</td><td style={tableCellStyle}><strong>10</strong>, estándar de mercado (Bancolombia, Nu). Ajustable al alza si los datos muestran usuarios topando el límite. Se prioriza así porque expandir un límite es reversible; rediseñar una lista saturada no lo es.</td><td style={tableCellStyle}>Discovery — revierte el &quot;ilimitado&quot; acordado inicialmente con Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Fuera de alcance v1</td><td style={tableCellStyle}>Pagos programados / pago de facturas automatizado — planeado para inicio del año siguiente (enero, tentativo)</td><td style={tableCellStyle}>Harry</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>MCP / consulta conversacional de gastos</td><td style={tableCellStyle}><strong>Fuera de alcance de este documento.</strong> Es una herramienta externa a la app, de otro equipo/oficina — no se diseña ni se dimensiona aquí.</td><td style={tableCellStyle}>Aclaración de Nicolás</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 3 — BENCHMARK DE MERCADO */}
                {activeTab === "benchmark" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🏦 3. Benchmark de Mercado</span></h3>
                    <p style={{ fontSize: 12.5, color: "#475569", marginBottom: 12 }}>
                      Research sobre el término &quot;Bolsillos&quot; y equivalentes en fintech, enfocado en Colombia y variantes regionales.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>App</th><th style={tableHeaderStyle}>Término</th><th style={tableHeaderStyle}>Rentabilidad</th><th style={tableHeaderStyle}>Naturaleza</th><th style={tableHeaderStyle}>Nota relevante</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Nequi</td><td style={tableCellStyle}>Bolsillos</td><td style={tableCellStyle}>Sí</td><td style={tableCellStyle}>Ahorro/meta personal</td><td style={tableCellStyle}>Primer jugador en popularizar el término en Colombia</td></tr>
                        <tr><td style={tableCellStyle}>Bancolombia</td><td style={tableCellStyle}>Bolsillos</td><td style={tableCellStyle}>No (foco en orden)</td><td style={tableCellStyle}>Flexible — ahorro y gasto recurrente (arriendo, mercado)</td><td style={tableCellStyle}>Hasta 10 bolsillos sin costo</td></tr>
                        <tr><td style={tableCellStyle}>Lulo Bank</td><td style={tableCellStyle}>Bolsillos (Flex / Programado)</td><td style={tableCellStyle}>Sí (10–13% E.A.)</td><td style={tableCellStyle}>Ahorro con incentivo de tasa</td><td style={tableCellStyle}>Hasta 10 bolsillos</td></tr>
                        <tr><td style={tableCellStyle}>RappiPay</td><td style={tableCellStyle}>Bolsillos / Bóvedas</td><td style={tableCellStyle}>Sí (9% Bolsillos, hasta 10.8% Bóvedas)</td><td style={tableCellStyle}>Ahorro con incentivo de tasa</td><td style={tableCellStyle}>Hasta 50 bolsillos; sin bolsillo no rentas más de 0.1%</td></tr>
                        <tr><td style={tableCellStyle}>Wise (business)</td><td style={tableCellStyle}>Groups / Jars</td><td style={tableCellStyle}>No</td><td style={tableCellStyle}>Operativo — presupuesto de equipo, no ahorro</td><td style={tableCellStyle}>Referente más cercano a la naturaleza operativa de dropiPay</td></tr>
                        <tr><td style={tableCellStyle}>Relay Financial</td><td style={tableCellStyle}>Sub-accounts</td><td style={tableCellStyle}>No</td><td style={tableCellStyle}>Operativo — cada cuenta con balance, tarjeta e historial propios</td><td style={tableCellStyle}>Sin metáfora de contenedor; lenguaje contable</td></tr>
                      </tbody>
                    </table>

                    <Callout tone="ok" title="✅ Conclusión del benchmark">
                      &quot;Bolsillos&quot; es lenguaje de categoría en Colombia, no propiedad de una marca — validado el naming. El diferencial real de dropiPay no está en el nombre sino en dos capacidades que <strong>ninguna de las cuatro apps colombianas ofrece</strong>: (1) llave de recepción propia por bolsillo, para que terceros paguen directo a un bolsillo específico, y (2) QR de cobro por bolsillo. Estas dos son más cercanas al modelo operativo de Wise/Relay que al modelo de ahorro de Nequi/Lulo/RappiPay.
                    </Callout>

                    <Callout tone="warn" title="⚠️ Riesgo de expectativa (mitigado)">
                      Dado que las cuatro apps de referencia atan &quot;Bolsillo&quot; a rentabilidad como argumento central, existía riesgo de incumplir expectativa si dropiPay no rentaba. Mitigado al confirmarse que sí habrá rentabilidad (~7%), aunque <strong>queda pendiente confirmar el timing de lanzamiento respecto a la disponibilidad de la stable coin</strong> (ver R2 en la tab de Riesgos).
                    </Callout>
                  </div>
                )}

                {/* TAB 4 — RIESGOS Y DEPENDENCIAS */}
                {activeTab === "riesgos" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>⚠️ 4. Riesgos y Dependencias Abiertas</span></h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { n: "R1", title: "Origen de fondos para débitos automáticos de Dropi", impacto: "Fallas de cobro o descuadre de contabilidad del usuario en el bolsillo equivocado", dueno: "Pendiente de identificar — este riesgo aún no se ha llevado a nadie del equipo técnico/backend. Propuesta preliminar de Nicolás: bolsillo designado por el usuario como origen de cobros de Dropi, definido al crear el primer bolsillo y editable después", desc: "Si el disponible general está en cero porque todo el saldo está distribuido en bolsillos, no está definido de dónde sale un cobro automático (flete, comisión, recaudo). La llave no resuelve esto — es un identificador de recepción, no de origen de cobro." },
                        { n: "R2", title: "Timing de la rentabilidad vs. lanzamiento", impacto: "Si lanza sin rentabilidad, resurge el riesgo de expectativa incumplida frente al benchmark de mercado", dueno: "Harry / Legal", desc: "La rentabilidad depende de una stable coin con sociedad y fideicomiso nuevos — tiempo regulatorio, no de producto. No está confirmado si Bolsillos lanza con o sin rentabilidad activa desde el día uno." },
                        { n: "R3", title: "Tratamiento del GMF (4x1000)", impacto: "Transacciones rechazadas sin explicación clara, tickets de soporte", dueno: "Finanzas/Legal", desc: "En pagos directos desde bolsillo y en movimientos entre bolsillos. Lulo, como referencia, alerta al usuario si una transacción va a generar el gravamen." },
                        { n: "R4", title: "Extractos", impacto: "Se podría construir la solución equivocada al problema de extractos si no se investiga el AS-IS", dueno: "Nicolás — pendiente de investigar", desc: "El problema de fondo (exportación desordenada) no se ha explorado en profundidad; solo se definió que habrá extracto por bolsillo y por wallet." },
                        { n: "R5", title: "Validación de volumen", impacto: "Priorizar y diseñar para un problema de tamaño desconocido", dueno: "Nicolás / Miguel Ángel Gutiérrez (BigQuery)", desc: "El problema se sostiene hoy en un caso ancla (N=1) + un MVP puntual, sin dimensionamiento de cuántos usuarios lo necesitan." },
                        { n: "R6", title: "Legal/compliance sin participar aún", impacto: "Riesgo regulatorio no evaluado en decisiones ya tomadas", dueno: "Legal — debe sumarse al kickoff formal", desc: "Legal/compliance no ha participado en la definición de rentabilidad, llaves múltiples ni tratamiento fiscal." },
                      ].map((r) => (
                        <div key={r.n} style={{ display: "flex", gap: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14 }}>
                          <div style={{ width: 34, height: 26, borderRadius: 8, background: "#EF4444", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{r.n}</div>
                          <div>
                            <strong style={{ fontSize: 13, color: "#0F172A" }}>{r.title}</strong>
                            <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0 0", lineHeight: 1.5 }}>{r.desc}</p>
                            <p style={{ fontSize: 11.5, color: "#991B1B", margin: "6px 0 0 0" }}><strong>Impacto si no se resuelve:</strong> {r.impacto}</p>
                            <p style={{ fontSize: 11.5, color: "#64748B", margin: "2px 0 0 0" }}><strong>Dueño sugerido:</strong> {r.dueno}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5 — OBJETIVOS Y MÉTRICAS */}
                {activeTab === "metricas" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🎯 5. Objetivos y Métricas</span></h3>

                    <Callout tone="pending" title="⏳ Nota de método">
                      Este feature vive en el loop de compromiso, no en activación. No se fijan umbrales numéricos todavía — salen de la línea base que entregue la consulta a BigQuery (R5). Se documenta la estructura de medición, no las metas.
                    </Callout>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                      <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#1E40AF", fontSize: 13 }}>Métrica primaria — negocio</strong>
                        <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}><strong>Permanencia de saldo:</strong> % del dinero que entra a dropiPay que permanece a los 30 días, comparando usuarios con bolsillos activos vs. sin bolsillos. Traduce la hipótesis de negocio implícita (H2): dinero con propósito asignado no se retira.</p>
                      </div>
                      <div style={{ background: "#F3E8FF", border: "1px solid #D8B4FE", padding: 14, borderRadius: 10 }}>
                        <strong style={{ color: "#6B21A8", fontSize: 13 }}>Métrica primaria — producto</strong>
                        <p style={{ fontSize: 12, color: "#581C87", margin: "6px 0 0 0", lineHeight: 1.5 }}><strong>Tasa de ingresos clasificados en origen:</strong> % del dinero recibido que entra vía llave o QR de un bolsillo específico, en vez de caer al disponible general de la wallet. Es la métrica del valor diferencial del feature — lo que ninguna app de benchmark ofrece hoy.</p>
                      </div>
                    </div>

                    <h4 style={subHeadingStyle}>Métricas secundarias</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Métrica</th><th style={tableHeaderStyle}>Qué valida</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Activación real: % de usuarios que crean un bolsillo <strong>y le asignan dinero</strong> en 14 días</td><td style={tableCellStyle}>Distingue creación de adopción real</td></tr>
                        <tr><td style={tableCellStyle}>Bolsillos vivos: % de bolsillos con ≥1 movimiento en 30 días</td><td style={tableCellStyle}>Detecta bolsillos abandonados</td></tr>
                        <tr><td style={tableCellStyle}>Bolsillos por usuario (mediana y P95)</td><td style={tableCellStyle}>Insumo para revisar el límite de 10</td></tr>
                        <tr><td style={tableCellStyle}>Descargas de extracto por bolsillo</td><td style={tableCellStyle}>Valida (o no) el problema de extractos (R4)</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Guardarraíles (no deben empeorar)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Guardarraíl</th><th style={tableHeaderStyle}>Riesgo que vigila</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Tasa de fallo en débitos automáticos por saldo insuficiente</td><td style={tableCellStyle}>R1</td></tr>
                        <tr><td style={tableCellStyle}>Tickets de soporte tipo &quot;no encuentro mi plata&quot; / &quot;mi saldo bajó&quot;</td><td style={tableCellStyle}>Confusión por el toggle de ocultar del saldo total</td></tr>
                        <tr><td style={tableCellStyle}>Tiempo para completar un envío de dinero</td><td style={tableCellStyle}>El selector de bolsillo origen no debe encarecer el flujo principal</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Contra-métrica</h4>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>
                      <strong>Proporción de bolsillos operativos vs. bolsillos de ahorro puro.</strong> Si la mayoría de bolsillos se llenan y quedan quietos, el producto real construido es de ahorro, no la capa de tesorería operativa que motiva este feature. No es necesariamente un fracaso (el float es negocio), pero es una desviación del producto diseñado que hay que detectar temprano.
                    </p>
                  </div>
                )}

                {/* TAB 6 — METODOLOGÍA TARS */}
                {activeTab === "tars" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🧭 6. Metodología TARS (Catherine) — mapeo y brechas</span></h3>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      TARS = <strong>T</strong>arget (población objetivo) → <strong>A</strong>dopción → <strong>R</strong>etención → <strong>S</strong>atisfacción.
                    </p>
                    <Callout tone="info" title="✏️ Nota de corrección">
                      En conversaciones previas se especuló que &quot;TARS&quot; era una herramienta de tracking separada, mencionada en el UX_Kit como &quot;Seguimiento de TARS proyecto&quot;. Con el material de Catherine confirmado, queda claro que esa frase se refiere al seguimiento de estas cuatro métricas a lo largo del proyecto — no es una herramienta distinta.
                    </Callout>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 20 }}>
                      El método pide, en orden: (1) un mapa cualitativo antes de cualquier número, (2) los cuatro porcentajes en cascada T→A→R→S, (3) una calculadora que identifica el cuello de botella (la etapa con menor proporción, como punto de partida de investigación, no como causalidad), y (4) una matriz final S/T vs. importancia estratégica. Todo esto corre sobre eventos técnicos definidos previamente — sin eventos, no hay calculadora.
                    </p>

                    <h4 style={subHeadingStyle}>6.1 Mapa cualitativo</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Elemento</th><th style={tableHeaderStyle}>Qué pide TARS</th><th style={tableHeaderStyle}>Estado en Bolsillos</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Usuarios principales / adyacentes / no adyacentes</td><td style={tableCellStyle}>Segmentación en tres niveles</td><td style={tableCellStyle}>Solo definido el principal (dropshipper con varias líneas de negocio, segmento Estratega). Faltan adyacentes y no adyacentes</td></tr>
                        <tr><td style={tableCellStyle}>Tamaño objetivo</td><td style={tableCellStyle}>% de usuarios <strong>activos</strong> (no de la base total)</td><td style={tableCellStyle}>No calculado — depende de la consulta BigQuery de wallets duplicadas (mismo dato de R5/H1), pero aún no se ha planteado la consulta en términos de &quot;% de activos&quot;</td></tr>
                        <tr><td style={tableCellStyle}>Frecuencia natural del problema</td><td style={tableCellStyle}>Diaria / semanal / mensual / ocasional</td><td style={tableCellStyle}>No preguntada — nunca se indagó cada cuánto un dropshipper recibe pagos que necesita clasificar por negocio</td></tr>
                        <tr><td style={tableCellStyle}>Gravedad (&quot;¿qué pasa si esto no existe?&quot;)</td><td style={tableCellStyle}>Clasificación baja/media/alta con justificación</td><td style={tableCellStyle}>Implícita en el caso ancla de Harry, pero no formalizada como clasificación</td></tr>
                        <tr><td style={tableCellStyle}>Ofensiva vs. defensiva</td><td style={tableCellStyle}>Una clasificación + qué KPI impulsa (si ofensiva) o qué requisito mínimo cubre (si defensiva)</td><td style={tableCellStyle}><strong>No decidido, y probablemente sea mixto:</strong> cerrar la brecha frente a Nequi/Bancolombia/Lulo/RappiPay (que ya tienen bolsillos) es defensivo — paridad de mercado. La llave y el QR por bolsillo, que ningún competidor ofrece, apuntan a retención — eso es ofensivo. El material no contempla explícitamente la mezcla; vale la pena llevarla así al kickoff en vez de forzar una sola etiqueta</td></tr>
                        <tr><td style={tableCellStyle}>Importancia estratégica</td><td style={tableCellStyle}>Input para la matriz final</td><td style={tableCellStyle}>No evaluada</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>6.2 T-A-R-S numérico</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Etapa</th><th style={tableHeaderStyle}>Qué pide TARS</th><th style={tableHeaderStyle}>Estado en Bolsillos</th></tr></thead>
                      <tbody>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Target</td><td style={tableCellStyle}>% de usuarios activos en el segmento objetivo</td><td style={tableCellStyle}>Pendiente — depende de BigQuery</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Adopción</td><td style={tableCellStyle}>Evento técnico en snake_case (ej. <code>bolsillo_creado</code>) + métrica de negocio en lenguaje humano</td><td style={tableCellStyle}>Tenemos la métrica de negocio (tab Métricas: &quot;tasa de ingresos clasificados en origen&quot;, &quot;activación real&quot;), <strong>pero no el evento técnico</strong> — es trabajo pendiente (ver tab Pendientes)</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Retención</td><td style={tableCellStyle}>Una única <strong>acción principal</strong> + su frecuencia natural, graficada en curva</td><td style={tableCellStyle}>Tenemos varias señales candidatas (permanencia de saldo, bolsillos vivos) pero no elegimos cuál de ellas <em>es</em> la acción principal que pide el método — hay que decidir una, no sumarlas todas</td></tr>
                        <tr><td style={{ ...tableCellStyle, fontWeight: 700 }}>Satisfacción</td><td style={tableCellStyle}>Pregunta de Customer Effort Score (CES) adaptada a la funcionalidad</td><td style={tableCellStyle}><strong>Ausente por completo</strong> — nunca se discutió esfuerzo percibido en esta conversación</td></tr>
                      </tbody>
                    </table>

                    <Callout tone="pending" title="⏳ 6.3 Lo que todavía no se puede correr">
                      La calculadora y la matriz S/T vs. importancia estratégica requieren los cuatro números reales de arriba. Hoy no tenemos ninguno — todo lo trabajado hasta ahora es estructura e hipótesis, no medición. Esto es el orden correcto del método (mapa cualitativo y eventos van antes que la calculadora), no una falla del discovery.
                    </Callout>

                    <h4 style={subHeadingStyle}>6.4 Acciones concretas que se desprenden de este mapeo</h4>
                    <ol style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, paddingLeft: 20 }}>
                      <li>Elegir la acción principal única de Retención (candidata: tasa de ingresos clasificados en origen, por ser la que mide el valor diferencial real del feature).</li>
                      <li>Redactar la pregunta CES de Satisfacción.</li>
                      <li>Resolver con Harry la clasificación ofensiva/defensiva (posiblemente mixta).</li>
                      <li>Traducir la métrica de adopción a evento técnico en snake_case y llevarlo a revisión con Analista de Datos y TL/Desarrollador — este es un Evento de Feature, por lo que corresponde solicitarlo desde este mismo documento, según el proceso del Acto 7 del taller.</li>
                    </ol>
                  </div>
                )}

                {/* TAB 7 — PENDIENTES Y PRÓXIMOS PASOS */}
                {activeTab === "pendientes" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>✅ 7. Pendientes antes del kickoff formal</span></h3>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.9, paddingLeft: 20, marginBottom: 24 }}>
                      <li>Consulta BigQuery: usuarios con más de una wallet de la misma moneda, y nombres asignados (dimensiona R5 y valida el enunciado del problema, y alimenta el Tamaño objetivo de TARS)</li>
                      <li style={{ fontWeight: 700, color: "#991B1B" }}>Identificar quién del equipo técnico/backend responde por R1 (origen de fondos para débitos automáticos) — no asignado todavía a ninguna persona</li>
                      <li>Confirmar con Harry/Legal el timing de rentabilidad vs. lanzamiento (R2)</li>
                      <li>Validar tratamiento del GMF con Finanzas/Legal (R3)</li>
                      <li>Investigar AS-IS del problema de extractos (R4) — con Laura Bermúdez, que fue quien lo mencionó originalmente</li>
                      <li>Convocar kickoff formal con el equipo técnico/backend y Legal — esta conversación con Harry cubrió alcance y producto, no compliance ni factibilidad técnica</li>
                      <li>Definir umbrales numéricos de las métricas una vez exista línea base</li>
                      <li>Definir eventos de Feature en snake_case para Adopción (ver tab Metodología TARS) y llevarlos a revisión con Analista de Datos y TL/Desarrollador</li>
                      <li>Escribir la pregunta CES de Satisfacción (ver tab Metodología TARS) y elegir la acción principal única de Retención</li>
                    </ul>

                    <h3 style={sectionHeadingStyle}><span>🚦 Próximos pasos</span></h3>
                    <ol style={{ fontSize: 13, color: "#334155", lineHeight: 1.9, paddingLeft: 20, marginBottom: 12 }}>
                      <li>Correr consulta BigQuery de wallets duplicadas (Miguel Ángel Gutiérrez)</li>
                      <li>Con esos datos, dimensionar el problema en el documento de kickoff formal</li>
                      <li>Identificar al responsable técnico/backend y agendar con esa persona la reunión de factibilidad para R1</li>
                      <li>Escalar a Legal el paquete de decisiones con implicación regulatoria (R2, R3, R6)</li>
                      <li>Una vez cerrados los pendientes críticos, avanzar a definición de flujos en Figma</li>
                    </ol>

                    <Callout tone="pending" title="⏳ Estado de handoff (Discovery → Delivery)">
                      Este documento es apenas el primer acercamiento de Discovery: hay un problema reformulado, hipótesis y decisiones de producto, pero falta validar volumen (R5), identificar dueño técnico (R1), compliance (R2, R3, R6), y cerrar el mapeo TARS (tab 6). <strong>No está listo para Pre-Flight de Handoff hacia Delivery</strong> — todavía falta el kickoff formal y cerrar los 9 pendientes de esta lista.
                    </Callout>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ── Fuente ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>
          <Layers size={14} />
          <span>Contenido cargado desde Bolsillos_dropiPay_Primer_Acercamiento.md · Última sincronización: <Clock size={12} style={{ verticalAlign: "middle" }} /> 03/09/2026</span>
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
