"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  ChevronDown, ChevronUp, Copy, Check, FileText,
  AlertTriangle, Layers, Clock, Globe, HelpCircle,
} from "lucide-react";

/* ── Shared styles (mismo patrón que FIN-003) ── */
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

function Callout({ tone, title, children }: { tone: "warn" | "info" | "pending"; title: string; children: React.ReactNode }) {
  const palette = {
    warn: { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E" },
    info: { bg: "#EFF6FF", border: "#93C5FD", color: "#1E3A8A" },
    pending: { bg: "#FAF5FF", border: "#E9D5FF", color: "#6B21A8" },
  }[tone];
  return (
    <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
      <strong style={{ fontSize: 12.5, color: palette.color }}>{title}</strong>
      <div style={{ fontSize: 12, color: palette.color, margin: "6px 0 0 0", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

const paisBadge = (pais: string) => {
  const flags: Record<string, string> = {
    Colombia: "🇨🇴", Brasil: "🇧🇷", México: "🇲🇽", Chile: "🇨🇱", Ecuador: "🇪🇨",
  };
  return `${flags[pais] ?? ""} ${pais}`;
};

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Fin005ProjectPage() {
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
        title="FIN-005 · Onboarding multipaís — Homologación de campos dropiPay"
        subtitle="Célula Fintech · Fuente: homologacion-campos-multipais.md"
        currentSlug="fin-005"
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
                <span style={badgeStyle("#B45309", "#FEF3C7")}>🧭 Idea · Concepción de experimento</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🌎 5 países en alcance</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Onboarding multipaís — dropiPay app
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0" }}>
                Hoy el onboarding de dropiPay está centralizado en Colombia. Este documento identifica campo por campo qué debe homologarse (terminología, documentos, formatos) para que la experiencia sea familiar en cada país nuevo.
              </p>
            </div>
          </div>
        </div>

        {/* ── Prototipo multipaís ── */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <strong style={{ fontSize: 13, display: "block", color: "#0F172A" }}>📱 Prototipo — Onboarding por país</strong>
            <span style={{ fontSize: 12, color: "#64748B" }}>Selector de país sobre las 4 pantallas de mayor divergencia (Identificación, Datos personales, Ubicación, Empresa), basado en dropiPay Design v2.0</span>
          </div>
          <a
            href="/prototipos/fin-005-onboarding-paises.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12.5, fontWeight: 750, color: "#fff", background: "#6366F1", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            Ver Prototipo <span style={{ fontSize: 11 }}>➔</span>
          </a>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 28 }}>
          <KPI label="Países en alcance" value="5" sub="Colombia (base) + Brasil, Ecuador, México, Chile" color="#3B82F6" icon={<Globe size={18} />} />
          <KPI label="Secciones de alta prioridad" value="5" sub="Identificación, datos personales, ubicación, empresa, documentación" color="#EF4444" icon={<AlertTriangle size={18} />} />
          <KPI label="Inconsistencias detectadas" value="3" sub="Activas · 1 resuelta (segundo apellido opcional)" color="#F59E0B" icon={<Layers size={18} />} />
          <KPI label="Preguntas abiertas" value="6" sub="Compliance / Legal / Truora" color="#8B5CF6" icon={<HelpCircle size={18} />} />
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
                  <span style={badgeStyle("#4338CA", "#E0E7FF")}>Fuente: homologacion-campos-multipais.md</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Homologación campo por campo del onboarding, por sección del flujo y por tipo de usuario.
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
                    { id: "contexto", label: "🧠 1. Contexto & Alcance" },
                    { id: "homologacion", label: "🌎 2. Homologación por Sección" },
                    { id: "empresa", label: "🏢 3. Empresa Registrada" },
                    { id: "resumen", label: "📋 4. Resumen & Prioridades" },
                    { id: "preguntas", label: "❓ 5. Inconsistencias & Preguntas" },
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
                      <h3 style={sectionHeadingStyle}><span>🧠 1. Contexto y Alcance</span></h3>
                      <button onClick={() => handleCopy("contexto", "FIN-005 Contexto")} style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {copiedSection === "contexto" ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                        {copiedSection === "contexto" ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>

                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 8 }}>
                      <strong>Objetivo:</strong> identificar todos los campos solicitados en el registro por tipo de usuario, y determinar cuáles requieren adaptación por país para que la terminología, los documentos y los formatos sean familiares al usuario local.
                    </p>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, marginBottom: 16 }}>
                      <strong>Países en alcance:</strong> {["Colombia (base actual)", "Brasil", "Ecuador", "México", "Chile"].join(", ")}.
                    </p>

                    <Callout tone="warn" title="⚠️ Nota de validación">
                      Las equivalencias de documentos y nomenclatura de este documento son un punto de partida basado en el estándar de cada país. <strong>Deben validarse con Compliance/Legal y con el proveedor de verificación de identidad (Truora) antes de implementarse</strong>, ya que la lista de documentos aceptados para KYC puede ser más restrictiva que la lista de documentos existentes en cada país.
                    </Callout>

                    <h4 style={subHeadingStyle}>Cómo leer este documento</h4>
                    <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, paddingLeft: 20, marginBottom: 20 }}>
                      <li>🌎 = campo <strong>país-dependiente</strong>, requiere homologación.</li>
                      <li>⚪ = campo universal, sin cambios por país.</li>
                      <li>⚠️ = hallazgo o inconsistencia detectada en el diseño actual.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Estructura común de los tres flujos</h4>
                    <p style={{ fontSize: 12.5, color: "#475569", marginBottom: 10 }}>
                      Los tres tipos de usuario comparten el mismo esqueleto. La divergencia ocurre solo en el bloque de datos.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>Sección</th><th style={tableHeaderStyle}>Persona Natural</th><th style={tableHeaderStyle}>Empresa sin registrar</th><th style={tableHeaderStyle}>Empresa registrada</th></tr></thead>
                      <tbody>
                        {[
                          "Registro (correo o teléfono)", "Selección de tipo de cuenta", "Identificación personal",
                          "Datos de la compañía", "Documentación de empresa", "Datos personales / representante legal",
                          "Ubicación", "Propósito de uso", "OTP", "Creación de PIN", "Verificación de identidad (documento + rostro)",
                        ].map((sec, i) => (
                          <tr key={sec}>
                            <td style={tableCellStyle}>{i + 1}</td>
                            <td style={tableCellStyle}>{sec}</td>
                            <td style={{ ...tableCellStyle, textAlign: "center" }}>✔</td>
                            <td style={{ ...tableCellStyle, textAlign: "center" }}>✔</td>
                            <td style={{ ...tableCellStyle, textAlign: "center" }}>✔</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 2 — HOMOLOGACIÓN POR SECCIÓN */}
                {activeTab === "homologacion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🌎 2. Homologación por Sección (común a todos los flujos)</span></h3>

                    {/* 2.1 Registro inicial */}
                    <h4 style={subHeadingStyle}>2.1 Registro inicial</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo</th><th style={tableHeaderStyle}>Tipo</th><th style={tableHeaderStyle}>País-dep.</th><th style={tableHeaderStyle}>Notas</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Correo electrónico</td><td style={tableCellStyle}>Input</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Formato universal</td></tr>
                        <tr><td style={tableCellStyle}>Número de teléfono</td><td style={tableCellStyle}>Input + selector</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Indicativo, longitud y formato varían</td></tr>
                        <tr><td style={tableCellStyle}>Selector de país</td><td style={tableCellStyle}>Dropdown</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Define el resto de la experiencia</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="warn" title="⚠️ Inconsistencia detectada">
                      El selector de país aparece con dos listas distintas según la pantalla. En algunas muestra los 5 países objetivo; en otras muestra Estados Unidos, Reino Unido, Francia, Italia, Australia. Debe unificarse a los mercados soportados.
                    </Callout>

                    {/* 2.2 Tipo de cuenta */}
                    <h4 style={subHeadingStyle}>2.2 Selección de tipo de cuenta</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Concepto local equivalente a &quot;Cuenta para Empresa&quot;</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>{paisBadge("Colombia")}</td><td style={tableCellStyle}>Persona jurídica / Sociedad</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}>Pessoa Jurídica (PJ)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("México")}</td><td style={tableCellStyle}>Persona Moral</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Chile")}</td><td style={tableCellStyle}>Persona Jurídica</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Ecuador")}</td><td style={tableCellStyle}>Persona Jurídica / Sociedad</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="pending" title="⏳ Pendiente legal">
                      Confirmar si los T&amp;C y la política de tratamiento de datos varían por país (pregunta abierta ya identificada por Diana Aldana).
                    </Callout>

                    {/* 2.3 Identificación personal */}
                    <h4 style={subHeadingStyle}>2.3 Identificación personal (nacionalidad + documento)</h4>
                    <Callout tone="warn" title="⚠️ Hallazgo">
                      En el flujo de Persona Natural la lista de tipos de documento está sin definir (aparece como &quot;Documento 2&quot;, &quot;Documento 3&quot;...), mientras que en Empresa sin registrar sí está completa la lista colombiana. Debe unificarse.
                    </Callout>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Documento principal</th><th style={tableHeaderStyle}>Otros aceptables (validar con Compliance)</th><th style={tableHeaderStyle}>Formato</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>{paisBadge("Colombia")}</td><td style={tableCellStyle}>Cédula de Ciudadanía (CC)</td><td style={tableCellStyle}>Cédula de Extranjería, Pasaporte, PPT, PEP</td><td style={tableCellStyle}>8–10 dígitos</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}>CPF</td><td style={tableCellStyle}>RG, Passaporte, CNH</td><td style={tableCellStyle}>11 dígitos (XXX.XXX.XXX-XX)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("México")}</td><td style={tableCellStyle}>INE / Credencial para Votar</td><td style={tableCellStyle}>CURP, Pasaporte</td><td style={tableCellStyle}>CURP: 18 caracteres alfanuméricos</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Chile")}</td><td style={tableCellStyle}>Cédula de Identidad (RUN)</td><td style={tableCellStyle}>Pasaporte</td><td style={tableCellStyle}>8 dígitos + verificador (XX.XXX.XXX-X)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Ecuador")}</td><td style={tableCellStyle}>Cédula de Identidad</td><td style={tableCellStyle}>Pasaporte</td><td style={tableCellStyle}>10 dígitos</td></tr>
                      </tbody>
                    </table>
                    <ul style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.7, paddingLeft: 20, marginBottom: 16 }}>
                      <li>El <strong>CPF brasileño y el RUN chileno tienen dígito verificador</strong> — se puede validar el formato en el cliente antes de enviarlo al backend.</li>
                      <li>La <strong>CURP mexicana es alfanumérica</strong>, no numérica: el teclado numérico actual del diseño no funciona para México.</li>
                      <li>El campo de número de documento debe cambiar de <strong>máscara y tipo de teclado</strong> según el país seleccionado.</li>
                    </ul>

                    {/* 2.4 Datos personales */}
                    <h4 style={subHeadingStyle}>2.4 Datos personales / Representante legal</h4>
                    <p style={{ fontSize: 12.5, color: "#475569", marginBottom: 10 }}>
                      Aplica a los tres flujos (en Persona Natural es &quot;Cuéntanos quién eres&quot;; en los flujos de empresa es &quot;Datos representante legal&quot;).
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Estructura</th><th style={tableHeaderStyle}>Implicación</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>CO / MX / CL / EC</td><td style={tableCellStyle}>Nombre(s) + apellido paterno + apellido materno</td><td style={tableCellStyle}>Estructura actual sirve</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}>Nome + sobrenome(s) — no hay &quot;segundo apellido&quot; como campo separado</td><td style={{ ...tableCellStyle, color: "#15803D", fontWeight: 700 }}>✅ Resuelto en Figma — &quot;Segundo apellido&quot; ahora es opcional, ya no bloquea el registro</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="info" title="✅ Actualización de diseño (19/08/2026)">
                      Se ajustó en Figma: &quot;Segundo apellido&quot; pasó de obligatorio a opcional. Esto destraba el registro de usuarios brasileños sin necesidad de tocar el resto del flujo. Sigue siendo un campo que estructuralmente no existe en Brasil — un único campo <code>Sobrenome</code> seguiría siendo la solución más limpia a futuro — pero el bloqueo activo ya no existe.
                    </Callout>
                    <p style={{ fontSize: 12.5, color: "#334155", marginBottom: 16 }}>
                      <strong>Formato de fecha:</strong> DD/MM/AAAA en los 5 países — sin divergencia relevante, el formato actual sirve.
                    </p>

                    {/* 2.5 Ubicación */}
                    <h4 style={subHeadingStyle}>2.5 Ubicación</h4>
                    <p style={{ fontSize: 12.5, color: "#475569", marginBottom: 10 }}>
                      Sección con <strong>mayor divergencia entre países</strong> y la que concentra el drop-off histórico ya identificado en el research.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Nivel 1 (hoy &quot;Departamento&quot;)</th><th style={tableHeaderStyle}>Nivel 2 (hoy &quot;Ciudad&quot;)</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>{paisBadge("Colombia")}</td><td style={tableCellStyle}>Departamento</td><td style={tableCellStyle}>Municipio / Ciudad</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}>Estado</td><td style={tableCellStyle}>Município</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("México")}</td><td style={tableCellStyle}>Estado</td><td style={tableCellStyle}>Municipio / Alcaldía (CDMX)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Chile")}</td><td style={tableCellStyle}>Región</td><td style={tableCellStyle}>Comuna</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Ecuador")}</td><td style={tableCellStyle}>Provincia</td><td style={tableCellStyle}>Cantón</td></tr>
                      </tbody>
                    </table>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                      El label del campo debe cambiar dinámicamente según el país. Un usuario chileno que ve &quot;Departamento&quot; no entiende qué se le pide; un mexicano de CDMX busca &quot;Alcaldía&quot;, no &quot;Municipio&quot;.
                    </p>

                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Homologación del código postal — el cambio de mayor impacto</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Nombre local</th><th style={tableHeaderStyle}>¿El usuario lo conoce?</th><th style={tableHeaderStyle}>Recomendación</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>{paisBadge("Colombia")}</td><td style={tableCellStyle}>Código postal</td><td style={tableCellStyle}>❌ Casi nadie</td><td style={tableCellStyle}>Derivar del municipio o hacer opcional (decisión ya en curso)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}><strong>CEP</strong></td><td style={tableCellStyle}>✅ Sí, de uso cotidiano</td><td style={tableCellStyle}><strong>Obligatorio + campo de entrada principal</strong>: autocompleta calle, barrio, ciudad y estado</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("México")}</td><td style={tableCellStyle}>Código Postal (CP)</td><td style={tableCellStyle}>✅ Sí, de uso común</td><td style={tableCellStyle}>Obligatorio; puede derivar estado/municipio/colonia</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Chile")}</td><td style={tableCellStyle}>Código postal</td><td style={tableCellStyle}>❌ Poco usado</td><td style={tableCellStyle}>Opcional</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Ecuador")}</td><td style={tableCellStyle}>Código postal</td><td style={tableCellStyle}>❌ Poco usado</td><td style={tableCellStyle}>Opcional</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="info" title="💡 Insight clave para diseño">
                      El orden del formulario de ubicación <strong>debería invertirse en Brasil y México</strong>. En esos países el código postal es el dato que el usuario sí conoce y que permite autocompletar todo lo demás — exactamente lo contrario a Colombia, donde es el bloqueante principal del flujo.
                    </Callout>

                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Estructura de dirección por país</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Componentes esperados</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>{paisBadge("Colombia")}</td><td style={tableCellStyle}>Vía (Calle/Carrera) + número + complemento</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}>Logradouro + número + complemento + <strong>bairro</strong> (obligatorio)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("México")}</td><td style={tableCellStyle}>Calle + número exterior + número interior + <strong>colonia</strong></td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Chile")}</td><td style={tableCellStyle}>Calle + número + departamento/casa</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Ecuador")}</td><td style={tableCellStyle}>Calle principal + número + calle secundaria (intersección)</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="warn" title="⚠️ Hallazgo">
                      Los campos &quot;bairro&quot; (Brasil) y &quot;colonia&quot; (México) no existen hoy en el formulario y son parte estándar de una dirección válida en esos países.
                    </Callout>

                    {/* 2.6 Propósito de uso */}
                    <h4 style={subHeadingStyle}>2.6 Propósito de uso</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>Tipo de usuario</th><th style={tableHeaderStyle}>Título de la pantalla</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Persona Natural</td><td style={tableCellStyle}>&quot;Cuéntanos sobre tu negocio&quot;</td></tr>
                        <tr><td style={tableCellStyle}>Empresa sin registrar</td><td style={tableCellStyle}>&quot;¿Cómo haces crecer tu negocio?&quot;</td></tr>
                        <tr><td style={tableCellStyle}>Empresa registrada</td><td style={tableCellStyle}>&quot;¿Qué impulsa tu empresa?&quot;</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="pending" title="⏳ Pendiente regulatorio">
                      Las opciones de &quot;Comprar y vender USDT&quot; y &quot;Mover dinero entre países&quot; pueden no estar disponibles o requerir licencias distintas en cada mercado. Confirmar con Compliance antes de mostrarlas indiscriminadamente.
                    </Callout>

                    {/* 2.7 Verificación */}
                    <h4 style={subHeadingStyle}>2.7 Verificación de identidad, OTP y PIN</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo / Elemento</th><th style={tableHeaderStyle}>País-dep.</th><th style={tableHeaderStyle}>Notas</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Código OTP (6 dígitos)</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Sin cambios</td></tr>
                        <tr><td style={tableCellStyle}>Temporizador 01:30</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Sin cambios</td></tr>
                        <tr><td style={tableCellStyle}>Creación y confirmación de PIN</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Sin cambios</td></tr>
                        <tr><td style={tableCellStyle}>Captura frontal del documento</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>El marco/overlay debe ajustarse al formato del documento local</td></tr>
                        <tr><td style={tableCellStyle}>Captura trasera del documento</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Algunos documentos no tienen reverso relevante (ej. pasaporte)</td></tr>
                        <tr><td style={tableCellStyle}>Reconocimiento facial</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Sin cambios</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="info" title="💡 Consideración de diseño">
                      El overlay de captura hoy asume el formato de cédula colombiana. Documentos como el pasaporte (formato libreta) o la INE mexicana tienen proporciones distintas. Validar con Truora qué formatos soporta por país.
                    </Callout>
                  </div>
                )}

                {/* TAB 3 — EMPRESA REGISTRADA */}
                {activeTab === "empresa" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🏢 3. Sección exclusiva: Empresa registrada</span></h3>
                    <p style={{ fontSize: 12.5, color: "#475569", marginBottom: 16 }}>
                      Es el flujo con mayor carga de homologación, porque toda la documentación empresarial es específica de cada jurisdicción.
                    </p>

                    <h4 style={subHeadingStyle}>3.1 Datos de la compañía</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo</th><th style={tableHeaderStyle}>Tipo</th><th style={tableHeaderStyle}>País-dep.</th><th style={tableHeaderStyle}>Notas</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Tipo de compañía *</td><td style={tableCellStyle}>Dropdown</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Requiere lista por país</td></tr>
                        <tr><td style={tableCellStyle}>Nombre comercial *</td><td style={tableCellStyle}>Input</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>—</td></tr>
                        <tr><td style={tableCellStyle}>Nombre legal *</td><td style={tableCellStyle}>Input</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Debe coincidir con documento de registro</td></tr>
                        <tr><td style={tableCellStyle}>Número de identificación tributaria *</td><td style={tableCellStyle}>Input</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Hoy dice &quot;NIT&quot; (solo Colombia)</td></tr>
                        <tr><td style={tableCellStyle}>Entidad legal de registro *</td><td style={tableCellStyle}>Dropdown</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Cambia el organismo por país</td></tr>
                        <tr><td style={tableCellStyle}>Fecha de constitución *</td><td style={tableCellStyle}>Date picker</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>—</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="warn" title="⚠️ Inconsistencia mayor">
                      El selector de &quot;Tipo de compañía&quot; ofrece hoy únicamente &quot;Sociedad Colombiana&quot; y &quot;LLC (United States)&quot;. Estados Unidos no está en la lista de países objetivo, y ninguno de los cuatro mercados nuevos tiene opción. Debe redefinirse.
                    </Callout>

                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Homologación del identificador tributario de empresa</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Identificador</th><th style={tableHeaderStyle}>Formato</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>{paisBadge("Colombia")}</td><td style={tableCellStyle}>NIT</td><td style={tableCellStyle}>9 dígitos + dígito de verificación</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Brasil")}</td><td style={tableCellStyle}><strong>CNPJ</strong></td><td style={tableCellStyle}>14 dígitos (XX.XXX.XXX/XXXX-XX)</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("México")}</td><td style={tableCellStyle}><strong>RFC</strong> (persona moral)</td><td style={tableCellStyle}>12 caracteres alfanuméricos</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Chile")}</td><td style={tableCellStyle}><strong>RUT</strong> de empresa</td><td style={tableCellStyle}>8 dígitos + dígito verificador</td></tr>
                        <tr><td style={tableCellStyle}>{paisBadge("Ecuador")}</td><td style={tableCellStyle}><strong>RUC</strong></td><td style={tableCellStyle}>13 dígitos</td></tr>
                      </tbody>
                    </table>

                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Homologación de entidad de registro</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Organismo de registro mercantil</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Colombia</td><td style={tableCellStyle}>Cámara de Comercio</td></tr>
                        <tr><td style={tableCellStyle}>Brasil</td><td style={tableCellStyle}>Junta Comercial (estadual) / Receita Federal</td></tr>
                        <tr><td style={tableCellStyle}>México</td><td style={tableCellStyle}>Registro Público de Comercio</td></tr>
                        <tr><td style={tableCellStyle}>Chile</td><td style={tableCellStyle}>Registro de Empresas y Sociedades / Conservador de Bienes Raíces</td></tr>
                        <tr><td style={tableCellStyle}>Ecuador</td><td style={tableCellStyle}>Superintendencia de Compañías</td></tr>
                      </tbody>
                    </table>

                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Tipos de sociedad más comunes por país (para el dropdown)</p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Tipos frecuentes</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Colombia</td><td style={tableCellStyle}>S.A.S., S.A., Ltda.</td></tr>
                        <tr><td style={tableCellStyle}>Brasil</td><td style={tableCellStyle}>LTDA, S.A., MEI, EIRELI</td></tr>
                        <tr><td style={tableCellStyle}>México</td><td style={tableCellStyle}>S.A. de C.V., S. de R.L. de C.V.</td></tr>
                        <tr><td style={tableCellStyle}>Chile</td><td style={tableCellStyle}>SpA, Ltda., S.A.</td></tr>
                        <tr><td style={tableCellStyle}>Ecuador</td><td style={tableCellStyle}>Cía. Ltda., S.A., S.A.S.</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>3.2 Documentación de la empresa</h4>
                    <p style={{ fontSize: 12.5, color: "#475569", marginBottom: 10 }}>
                      Hoy se solicitan dos documentos colombianos: <strong>Certificado de Cámara de Comercio</strong> y <strong>RUT</strong>. Ambos requieren equivalente local.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead><tr><th style={tableHeaderStyle}>Documento actual (Colombia)</th><th style={tableHeaderStyle}>Propósito</th><th style={tableHeaderStyle}>Equivalente por país</th></tr></thead>
                      <tbody>
                        <tr>
                          <td style={tableCellStyle}>Certificado de Cámara de Comercio</td>
                          <td style={tableCellStyle}>Acredita existencia y representación legal</td>
                          <td style={tableCellStyle}>Brasil: Contrato Social + Cartão CNPJ · México: Acta Constitutiva · Chile: Escritura de constitución + Certificado de vigencia · Ecuador: Escritura de constitución + Nombramiento de representante legal</td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>RUT (Registro Único Tributario)</td>
                          <td style={tableCellStyle}>Acredita registro tributario</td>
                          <td style={tableCellStyle}>Brasil: Comprovante de Inscrição CNPJ · México: Constancia de Situación Fiscal · Chile: e-RUT (Cédula RUT de empresa) · Ecuador: RUC (certificado)</td>
                        </tr>
                      </tbody>
                    </table>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo / Regla</th><th style={tableHeaderStyle}>País-dep.</th><th style={tableHeaderStyle}>Notas</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Formatos admitidos (PDF, TIFF)</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Sin cambios</td></tr>
                        <tr><td style={tableCellStyle}>Peso máximo (10 MB)</td><td style={tableCellStyle}>⚪</td><td style={tableCellStyle}>Sin cambios</td></tr>
                        <tr><td style={tableCellStyle}>Nombre del documento solicitado</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Debe mostrarse con el nombre local</td></tr>
                        <tr><td style={tableCellStyle}>Cantidad de documentos requeridos</td><td style={tableCellStyle}>🌎</td><td style={tableCellStyle}>Algunos países requieren más de dos</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="warn" title="⚠️ Impacto en diseño">
                      El flujo actual asume exactamente <strong>dos documentos</strong>. Chile y Ecuador podrían requerir tres (constitución + vigencia/nombramiento + tributario). El componente de carga debe soportar una cantidad variable de documentos según el país.
                    </Callout>
                  </div>
                )}

                {/* TAB 4 — RESUMEN Y PRIORIDADES */}
                {activeTab === "resumen" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>📋 4. Resumen: campos que requieren adaptación</span></h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={tableHeaderStyle}>Sección</th><th style={tableHeaderStyle}>Campos a homologar</th><th style={tableHeaderStyle}>Prioridad</th></tr></thead>
                      <tbody>
                        {[
                          ["Identificación personal", "Tipo de documento, formato/máscara del número, teclado", "🔴 Alta"],
                          ["Datos personales", "Estructura de apellidos (crítico para Brasil)", "🔴 Alta"],
                          ["Ubicación", "Nomenclatura territorial, código postal, estructura de dirección", "🔴 Alta"],
                          ["Datos de la compañía", "Identificador tributario, entidad de registro, tipo de sociedad", "🔴 Alta"],
                          ["Documentación de empresa", "Nombre y cantidad de documentos", "🔴 Alta"],
                          ["Tipo de cuenta", "Terminología legal, T&C por jurisdicción", "🟡 Media"],
                          ["Verificación de identidad", "Overlay de captura según formato de documento", "🟡 Media"],
                          ["Propósito de uso", "Disponibilidad regulatoria de opciones (USDT, internacional)", "🟡 Media"],
                          ["Registro inicial", "Unificar lista de países del selector", "🟢 Baja (corrección)"],
                          ["OTP y PIN", "—", "⚪ Sin cambios"],
                        ].map((row) => (
                          <tr key={row[0]}>
                            <td style={{ ...tableCellStyle, fontWeight: 700 }}>{row[0]}</td>
                            <td style={tableCellStyle}>{row[1]}</td>
                            <td style={tableCellStyle}>{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 5 — INCONSISTENCIAS Y PREGUNTAS */}
                {activeTab === "preguntas" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>⚠️ 5. Inconsistencias del diseño actual (independientes de multipaís)</span></h3>
                    <ol style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
                      <li>Lista de tipos de documento sin definir en el flujo de Persona Natural (&quot;Documento 2&quot;, &quot;Documento 3&quot;...).</li>
                      <li>Selector de país con dos listas distintas según la pantalla (mercados objetivo vs. países europeos/EE.UU.).</li>
                      <li>&quot;Tipo de compañía&quot; ofrece LLC de Estados Unidos, país fuera del alcance definido.</li>
                      <li style={{ color: "#94A3B8", textDecoration: "line-through" }}>&quot;Segundo apellido&quot; marcado como obligatorio (*) — problemático incluso en países hispanohablantes, donde no todos tienen dos apellidos. <span style={{ textDecoration: "none", color: "#15803D", fontWeight: 700 }}>✅ Resuelto 19/08/2026 — ahora es opcional en Figma.</span></li>
                    </ol>
                    <p style={{ fontSize: 11.5, color: "#94A3B8", marginBottom: 28 }}>3 inconsistencias activas · 1 resuelta.</p>

                    <h3 style={sectionHeadingStyle}><span>❓ 6. Preguntas abiertas para Compliance / Legal / Truora</span></h3>
                    <ol style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, paddingLeft: 20 }}>
                      <li>¿Qué tipos de documento acepta Truora para verificación de identidad en cada uno de los 5 países?</li>
                      <li>¿Qué documentación empresarial exige el KYC de dropiPay por país, y cuántos documentos son obligatorios?</li>
                      <li>¿El código postal es un requisito regulatorio o un campo heredado? (pregunta ya abierta para Colombia, se extiende a los demás países)</li>
                      <li>¿Los T&amp;C y la política de tratamiento de datos varían por jurisdicción?</li>
                      <li>¿Las funcionalidades de USDT y transferencias internacionales están habilitadas regulatoriamente en los 5 mercados?</li>
                      <li>¿Backend soporta validación de formato de documento por país (dígito verificador de CPF, RUN, CNPJ, RUT)?</li>
                    </ol>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* ── Fuente ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94A3B8", marginBottom: 24 }}>
          <Layers size={14} />
          <span>Contenido cargado desde homologacion-campos-multipais.md · Última sincronización: <Clock size={12} style={{ verticalAlign: "middle" }} /> 19/08/2026</span>
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
