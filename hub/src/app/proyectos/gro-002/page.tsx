"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  ChevronDown, ChevronUp, FileText, AlertTriangle, Rocket, Layers,
  Clock, Users, Trophy, ExternalLink, Wrench, GitBranch, ShieldAlert,
} from "lucide-react";

/* ── Shared styles (mismos tokens que otras fichas de proyecto: fin-001, marcas) ── */
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
  fontSize: 15,
  fontWeight: 800,
  color: "#0F172A",
  margin: "0 0 10px 0",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const subHeadingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0F172A",
  margin: "18px 0 8px 0",
};

const pStyle: React.CSSProperties = { fontSize: 13, color: "#334155", lineHeight: 1.65, marginBottom: 10 };
const ulStyle: React.CSSProperties = { fontSize: 13, color: "#334155", lineHeight: 1.65, paddingLeft: 20, marginBottom: 12 };

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
  fontSize: 13,
  borderBottom: "1px solid #E2E8F0",
  color: "#1E293B",
  verticalAlign: "top",
};

function Callout({ tone, title, children }: { tone: "warning" | "info" | "danger" | "success"; title: string; children: React.ReactNode }) {
  const map = {
    warning: { bg: "#FFFBEB", border: "#FDE68A", fg: "#92400E" },
    info: { bg: "#EFF6FF", border: "#93C5FD", fg: "#1E40AF" },
    danger: { bg: "#FEF2F2", border: "#FCA5A5", fg: "#991B1B" },
    success: { bg: "#F0FDF4", border: "#86EFAC", fg: "#166534" },
  }[tone];
  return (
    <div style={{ background: map.bg, border: `1px solid ${map.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <strong style={{ color: map.fg, fontSize: 13 }}>{title}</strong>
      <div style={{ fontSize: 12.5, color: map.fg, marginTop: 6, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

const links = [
  { label: "Demo pública (Vercel)", href: "https://leyendas-dropi-share.vercel.app", icon: Rocket, desc: "Prototipo standalone, sin login de Darwin — código simulado 000000 para pitch interno." },
  { label: "Beta conectada en Darwin", href: "/proyectos/leyendas-dropi", icon: Layers, desc: "Misma experiencia, con OTP real por correo y datos de Supabase (5 vendedores de prueba)." },
  { label: "Documento completo del proyecto", href: "https://claude.ai/code/artifact/a88d5dab-6d09-4db9-ac3a-08b8abb7bfbd", icon: FileText, desc: "16 secciones: kick-off, discovery, hand-off técnico, diccionario de datos, 11 HU, naming, cronograma." },
];

export default function Gro002ProjectPage() {
  const [docOpen, setDocOpen] = useState(true);
  const [tab, setTab] = useState("resumen");

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="GRO-002 · Leyendas Dropi y Gamification"
        subtitle="Célula Growth · PM: José Pineda"
        currentSlug="gro-002"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & título ── */}
        <div style={{ marginBottom: 20 }}>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver al Hub
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={badgeStyle("#C2410C", "var(--dropi-light)")}>🌱 Célula Growth</span>
                <span style={badgeStyle("#166534", "#DCFCE7")}>🟢 Activo — beta técnica funcionando</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧭 Definición → Shaping</span>
                <span style={badgeStyle("#B45309", "#FEF3C7")}>📅 Fecha dura: ExpoWinners, 12 sept 2026</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Leyendas Dropi — Programa de Gamificación y Fidelización
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 760 }}>
                Progresión visible por niveles (dropshippers) y reconocimiento por ejes de comunidad (líderes) — evolución de Dropi Turbo. Este es el punto único de contexto: qué se decidió, qué se construyó y qué sigue pendiente antes de pasar a desarrollo pleno.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>PM / Owner</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Pineda</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Líder de programa</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Laura Sánchez</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Sponsor / Tech Lead</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Giraldo</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Reducción de churn al cruzar 100 órdenes/mes", value: "82%", sub: "Insight ancla de todo el diseño del programa", color: "#DC2626" },
            { label: "Nivel Explorador (101–1.000 órdenes/mes)", value: "44%", sub: "de las órdenes activas de la plataforma (mar 2026) — mayor apalancamiento", color: "var(--dropi)" },
            { label: "Historias de usuario redactadas", value: "11", sub: "Hito 1 · con Gherkin, DoD, supuestos y pendientes", color: "#7C3AED" },
            { label: "VPV estimado", value: "$60M", sub: "Valor potencial de venta (COP) — campo Darwin", color: "#0EA5E9" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Prototipos y documentos ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 28 }}>
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start", transition: "border-color 0.15s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--dropi-light)", color: "var(--dropi)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: 6 }}>
                    {l.label} <ExternalLink size={12} color="#94A3B8" />
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 3, lineHeight: 1.5 }}>{l.desc}</div>
                </div>
              </a>
            );
          })}
        </div>

        {/* ── Alerta de decisión reciente ── */}
        <Callout tone="warning" title="⚠️ Resolución de alcance con Tech Lead (20 ago 2026)">
          José Giraldo (Tech Lead) no había sido consultado sobre el job batch diario ni la integración de login que se venían asumiendo. Su capacidad está comprometida con el MVP del 12 de septiembre (evento presencial ExpoWinners: operarios buscan por nombre/correo/ID y ven el nivel del usuario, sin sesión). <strong>Decisión:</strong> no tocar la plataforma de Dropi ni pedirle desarrollo. Growth sigue en paralelo — la consulta de nivel vive solo en la landing, la data se trae por consulta directa coordinada con Miguel Ángel (Data), y se avisa al usuario que los datos pueden no ser en tiempo real. La pregunta de login (¿landing aparte o embebida en Dropi?) queda pospuesta.
        </Callout>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION — CONTEXTO COMPLETO
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid var(--dropi)", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(255,97,2,0.08)" }}>
          <button
            onClick={() => setDocOpen(!docOpen)}
            style={{ width: "100%", background: docOpen ? "linear-gradient(90deg,#FFF3E0 0%,#FFF8F0 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: docOpen ? "1px solid #FFE0B2" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--dropi)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#1E1B4B" }}>Contexto ampliado del proyecto</span>
                  <span style={badgeStyle("#C2410C", "var(--dropi-light)")}>Fuente: PRD v7, hand-off técnico y sesión de definición con José</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Todo lo trabajado hasta ahora: problema, solución del Hito 1, beta técnica construida en agosto, decisiones tomadas, pendientes y equipo.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #FFE0B2" }}>
                {docOpen ? "Ocultar contexto" : "Ver contexto"}
              </span>
              {docOpen ? <ChevronUp size={20} color="var(--dropi)" /> : <ChevronDown size={20} color="var(--dropi)" />}
            </div>
          </button>

          {docOpen && (
            <div style={{ padding: 24 }}>
              <div style={{ background: "#FAFAFA", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>

                {/* Tab nav */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { id: "resumen", label: "🧠 1. Resumen & Problema" },
                    { id: "solucion", label: "🎮 2. Solución (Hito 1)" },
                    { id: "beta", label: "🛠️ 3. Beta técnica (agosto)" },
                    { id: "decisiones", label: "🔀 4. Decisiones y pendientes" },
                    { id: "equipo", label: "👥 5. Equipo & fuentes" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "var(--dropi)" : "#ffffff", color: tab === t.id ? "#ffffff" : "#475569", border: tab === t.id ? "1px solid var(--dropi)" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — RESUMEN & PROBLEMA */}
                {tab === "resumen" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🧠 1. Resumen ejecutivo</span></h3>
                    <p style={pStyle}>
                      Leyendas Dropi es el programa de gamificación y fidelización transversal del ecosistema Dropi que acompaña a dropshippers y líderes de comunidad desde su primer día en la plataforma hasta convertirse en operadores consolidados, mediante niveles, insignias y reconocimientos basados en el volumen de órdenes entregadas. Es la evolución de Dropi Turbo.
                    </p>

                    <h4 style={subHeadingStyle}>El problema</h4>
                    <ul style={ulStyle}>
                      <li><strong>Comportamiento que queremos cambiar:</strong> que el dropshipper cruce y sostenga el umbral de 100 órdenes mensuales (el punto de no-churn), y que el líder de comunidad active y haga crecer su red de afiliados de forma sostenida.</li>
                      <li><strong>Por qué no ocurre hoy:</strong> la plataforma no tiene una experiencia de progreso visible que muestre en qué etapa de madurez está el usuario ni qué necesita para avanzar. <span style={{ color: "#B45309", fontWeight: 600 }}>[HIPÓTESIS a validar]</span> — inferencia razonable a partir de los principios del PRD v7, no un diagnóstico explícito documentado; pendiente de validar con Growth.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Evidencia</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Hallazgo</th><th style={tableHeaderStyle}>Dato</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Reducción de churn al alcanzar 100 órdenes/mes (~$10M COP en ventas)</td><td style={tableCellStyle}><strong>82%</strong> — insight ancla de todo el diseño del programa</td></tr>
                        <tr><td style={tableCellStyle}>Peso del nivel Explorador (101–1.000 órdenes/mes) sobre el total de órdenes activas</td><td style={tableCellStyle}><strong>44%</strong> (marzo 2026) — segmento más grande y de mayor apalancamiento</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Usuario objetivo</h4>
                    <ul style={ulStyle}>
                      <li><strong>Dropshipper (vendedor individual):</strong> progresa por 7 niveles según volumen de órdenes del mes en curso (no acumulado histórico) — ver tabla completa en la pestaña Solución.</li>
                      <li><strong>Líder de comunidad (gestor de red de afiliados):</strong> se evalúa en 3 ejes independientes y no jerárquicos — Efectividad, Popularidad e Impacto Económico. Puede destacar en uno, dos o los tres simultáneamente.</li>
                      <li>Un mismo usuario puede ser <strong>dropshipper y líder de comunidad al mismo tiempo</strong> — la Card de Leyendas en Home refleja ambos roles con un toggle.</li>
                      <li>El programa opera con <strong>independencia por país</strong>: umbrales, niveles y beneficios se calibran según la capacidad operativa local, multipaís desde el diseño.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Hipótesis de impacto</h4>
                    <p style={pStyle}>
                      Creemos que mostrar progreso visible y reconocimiento mensual recurrente (Wrapped, insignia persistente, niveles con metas claras) generará mayor retención y mayor volumen de órdenes mensuales por dropshipper, y mayor activación de redes de afiliados por parte de los líderes de comunidad, <strong>porque</strong> cruzar el umbral de 100 órdenes reduce el churn en 82%, y la &quot;progresión visible&quot; es uno de los principios fundacionales sobre los que se diseñó todo el sistema.
                    </p>

                    <h4 style={subHeadingStyle}>Métrica de éxito (North Star propuesto)</h4>
                    <p style={pStyle}>
                      <strong>% de dropshippers que cruzan el umbral de 100 órdenes/mes</strong> (punto de no-churn). Baseline y meta: <em>pendientes de definir con Growth/Data</em> — no están cuantificados en la documentación fuente todavía.
                    </p>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>
                      Métricas secundarias sugeridas (no confirmadas por negocio): retención mes a mes por nivel, % que abre el Wrapped en su primera sesión del día, líderes activos en al menos un eje, conversión Bienvenido → Aprendiz.
                    </p>
                  </div>
                )}

                {/* TAB 2 — SOLUCIÓN */}
                {tab === "solucion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🎮 2. Solución propuesta — MVP Hito 1</span></h3>
                    <ul style={ulStyle}>
                      <li><strong>Modal Wrapped:</strong> resumen animado del mes cerrado (Mes N-1), insignia asignada, brecha al siguiente nivel, descarga de imagen PNG vertical (9:16) para compartir.</li>
                      <li><strong>Insignia persistente en Header:</strong> muestra nivel/rango vigente, tooltip al hover, reabre el Wrapped al clic.</li>
                      <li><strong>Card de Leyendas en Home</strong> (contraída y expandida): 3 casos — usuario nuevo (0% activado), usuario con experiencia (histórico de logros), y dropshipper+líder (toggle entre vistas).</li>
                      <li><strong>Landing pública — Dropshippers:</strong> testimonios de leyendas actuales, mecánica del programa, cards de los 7 niveles, y OnePage por nivel (mindset, rangos, meta, 4 recursos, navegación siguiente/anterior).</li>
                      <li><strong>Landing pública — Líderes de Comunidad:</strong> Ranking de Comunidades (filtrado por país, buscador), Ficha de Comunidad (modal con demografía y métricas), Ligas informativas (Efectividad, Popularidad, Impacto Económico).</li>
                      <li><strong>Footer transversal:</strong> Términos y Condiciones y Preguntas Frecuentes — ambos contenido nuevo, específico del programa.</li>
                      <li>Sistema de niveles basado <strong>100% en órdenes entregadas</strong> — sin ningún concepto de puntaje o Dropicoins expuesto en la UI de este hito.</li>
                    </ul>

                    <Callout tone="danger" title="🚫 Explícitamente fuera del MVP (Hito 1)">
                      Redención de Dropicoins (falta definir tasa de conversión drops→DC) · Card Resumen en Dashboard · micro-barras de progreso por rango · umbrales numéricos de la Liga Popularidad · bloque de Premios y Reconocimientos (Release 2) · Grupo empresarial (arquitectura a diseñar, no a lanzar) · puntos por calidad operativa (v2) · acumulación global entre países · perfiles de proveedor.
                    </Callout>

                    <h4 style={subHeadingStyle}>Anexo B — Niveles de Dropshipper (referencia completa)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>Nivel</th><th style={tableHeaderStyle}>Órdenes/mes</th><th style={tableHeaderStyle}>Perfil</th></tr></thead>
                      <tbody>
                        {[
                          ["1", "Bienvenido", "0", "Usuario sin ventas aún; en proceso de activación."],
                          ["2", "Aprendiz", "1 – 100", "Primeros pasos. Meta: cruzar el punto de no-churn (100 órdenes)."],
                          ["3", "Explorador", "101 – 1.000", "Ya cruzó el umbral de no-churn. Segmento más grande (44% de órdenes activas, mar 2026)."],
                          ["4", "Maestro", "1.001 – 2.500", "Desempeño aceptable, aprendiendo a escalar el negocio."],
                          ["5", "Experto", "2.501 – 5.000", "Alto potencial de escala; foco en optimización operativa."],
                          ["6", "Sabio VIP", "5.001 – 20.000", "Aliado estratégico de alto rendimiento."],
                          ["7", "Leyenda", "20.001+", "Máxima distinción del ecosistema Dropi."],
                        ].map((row) => (
                          <tr key={row[0]}><td style={tableCellStyle}>{row[0]}</td><td style={tableCellStyle}><strong>{row[1]}</strong></td><td style={tableCellStyle}>{row[2]}</td><td style={tableCellStyle}>{row[3]}</td></tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>
                      El naming &quot;Aprendiz&quot; (nivel 2) coincide con &quot;Aprendiz&quot; de la Dimensión 2 del Programa de Iniciación Dropshipping del PRD v7 — dos taxonomías distintas que comparten término; revisar si genera confusión en copy.
                    </p>

                    <h4 style={subHeadingStyle}>Anexo C — Reconocimientos de Líderes de Comunidad</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead><tr><th style={tableHeaderStyle}>Eje</th><th style={tableHeaderStyle}>Niveles / umbrales</th><th style={tableHeaderStyle}>Medición</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Efectividad</strong></td><td style={tableCellStyle}>Maestro (+10.000 órdenes acumuladas), Elite (+50.000), Leyenda (+100.000)</td><td style={tableCellStyle}>Permanente — solo suma, nunca baja.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Popularidad</strong></td><td style={tableCellStyle}>Umbrales retirados del alcance de Hito 1 (pendientes de negocio)</td><td style={tableCellStyle}>Mensual — afiliados activos (≥1 orden en últimos 90 días).</td></tr>
                        <tr><td style={tableCellStyle}><strong>Impacto Económico</strong></td><td style={tableCellStyle}>Formador de Millonarios (≥ USD 1.000.000 GMV/mes)</td><td style={tableCellStyle}>Mensual — no acumulativo, se gana cada mes.</td></tr>
                      </tbody>
                    </table>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Reconocimiento físico flagship (fuera de Hito 1): cinturones de campeonato por categoría, entregados en eventos especiales, lead time de producción de 60 días.</p>
                  </div>
                )}

                {/* TAB 3 — BETA TÉCNICA */}
                {tab === "beta" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Wrench size={16} /><span>3. Beta técnica construida (agosto 2026)</span></h3>

                    <h4 style={subHeadingStyle}>Artefactos generados</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Archivo</th><th style={tableHeaderStyle}>Propósito</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><code>proyectos/leyendas-dropi/types.ts</code></td><td style={tableCellStyle}>Tipos TypeScript: Tier, SubLevel, UserLevelSummary, OtpChallenge</td></tr>
                        <tr><td style={tableCellStyle}><code>proyectos/leyendas-dropi/mock/tiers.ts</code></td><td style={tableCellStyle}>Definición canónica de los 7 tiers y sus subniveles</td></tr>
                        <tr><td style={tableCellStyle}><code>proyectos/leyendas-dropi/mock/user.ts</code></td><td style={tableCellStyle}>Perfiles de prueba con snapshots de 3 meses</td></tr>
                        <tr><td style={tableCellStyle}><code>api/nivel/otp/request · verify</code></td><td style={tableCellStyle}>Endpoints reales de OTP (10 min, 5 intentos) sobre store compartido</td></tr>
                        <tr><td style={tableCellStyle}><code>supabase/050_leyendas_dropi_gamificacion.sql</code></td><td style={tableCellStyle}>DDL + seed: tiers, sub_levels, sellers, otp_challenges, seller_month_snapshots</td></tr>
                        <tr><td style={tableCellStyle}><code>public/leyendas-dropi-standalone.html</code></td><td style={tableCellStyle}>Prototipo pixel-exacto al diseño de Claude Design, servido vía iframe</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Reglas de negocio implementadas</h4>
                    <ul style={ulStyle}>
                      <li>Nivel calculado sobre órdenes entregadas del <strong>mes en curso</strong> (no acumulado).</li>
                      <li><code>badge_url = null</code> → estado &quot;🎨 Medalla pendiente&quot; — nunca se sustituye por otra insignia.</li>
                      <li>OTP: expira a los 10 minutos, máximo 5 intentos, cooldown de 30 segundos para reenvío. Un nuevo OTP invalida el challenge previo del mismo correo.</li>
                      <li><code>points = orders_delivered × 1.8</code> (fórmula provisional; catálogo de canje pendiente).</li>
                      <li>Histórico siempre muestra 3 tarjetas (meses sin snapshot = estado vacío, sin datos inventados).</li>
                      <li>API con fallback a mock — funciona sin conexión Supabase en local. Dev bypass: código <code>000000</code> + cualquier correo del mock.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Rediseño con el sistema visual de Claude Design (19 ago)</h4>
                    <p style={pStyle}>
                      El landing &quot;Elige tu sueño&quot; existía como diseño en Claude Design pero nunca se había portado al código. Se decodificó el bundle del artifact manualmente y se extrajeron sus tokens exactos: fondo <code>#0b0b0b</code>/<code>#101010</code>/<code>#141414</code>, acento en dos tonos <code>#FF8500</code>/<code>#FF4800</code>, tipografía <strong>Chakra Petch</strong>, botones con esquina cortada (clip-path angular). Se construyó <code>DreamCalculator.tsx</code>: 10 metas con costo y plazo que calculan cuántas órdenes/mes hacen falta y a qué nivel del programa corresponde ese ritmo.
                    </p>
                    <p style={pStyle}>
                      <strong>Segundo pase el mismo día</strong> — apareció el archivo fuente real (<code>Design System Leyendas - Standalone.html</code>, mismo formato bundle). Se extrajo el componente original completo (~3.000 líneas) y se implementó <code>TierExplorer.tsx</code> (explorador interactivo de los 7 niveles) y <code>PremiosGallery.tsx</code> (galería de premios físicos). José pidió fidelidad visual exacta al standalone — se abandonó la reinterpretación en React y se sirve el HTML decodificado directo vía iframe.
                    </p>

                    <Callout tone="info" title="Fuera de alcance incluso después de este pase">
                      El motion avanzado del <code>#camino</code> original (piso 3D, anillos girando, tooltips por métrica) no se replicó 1:1. Las 7 páginas narrativas de onboarding (PAGES) tienen el copy extraído pero no la UI. Los testimonios en video (LEYENDAS) y el selector de país (PAISES) siguen sin contenido real — el fuente mismo dice &quot;Testimonio pendiente de grabación&quot;. El Ranking de comunidades sigue como placeholder — no hay fuente de datos conectada.
                    </Callout>

                    <h4 style={subHeadingStyle}>Assets de diseño (19 ago)</h4>
                    <p style={pStyle}>
                      17 assets ya copiados a <code>hub/public/</code>: 9 medallas de sub-nivel en <code>badges/</code> (coinciden exactamente con los <code>badgeUrl</code> que el código ya esperaba) y 8 ilustraciones &quot;hero&quot; por nivel en <code>leyendas/heroes/</code>, sin wirear todavía — candidatas naturales para el Wrapped o el OnePage por nivel. Bienvenido, Explorador y Sabio VIP II siguen sin medalla asignada.
                    </p>

                    <h4 style={subHeadingStyle}>Flujo de autenticación OTP</h4>
                    <pre style={{ background: "#0F172A", color: "#E2E8F0", fontSize: 12, padding: 16, borderRadius: 10, overflowX: "auto", lineHeight: 1.6, marginBottom: 16 }}>
{`Usuario ingresa email
    → POST /api/nivel/otp/request
    → Genera código 6 dígitos, expira 10 min, 5 intentos

Usuario ingresa código
    → POST /api/nivel/otp/verify
    → Valida code, expiresAt, attemptsLeft → marca consumed_at
    → Retorna UserLevelSummary (Supabase → fallback mock)
    → UI muestra Wrapped → Session Summary`}
                    </pre>

                    <h4 style={subHeadingStyle}>Documento del proyecto integrado a Darwin (21 ago)</h4>
                    <p style={pStyle}>
                      José entregó el hand-off técnico completo (16 secciones: kick-off, discovery, definición, diccionario de datos, 11 HU con hallazgos de QA, incentivos, inventario de recursos, equipo, pendientes críticos, 6 esquemas de naming en conflicto, cronograma a ExpoWinners, estrategia de comunicación). Se publicó como documento navegable y se conectó a esta misma ficha de proyecto.
                    </p>
                  </div>
                )}

                {/* TAB 4 — DECISIONES Y PENDIENTES */}
                {tab === "decisiones" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><GitBranch size={16} /><span>4. Decisiones tomadas, preguntas abiertas y riesgos</span></h3>

                    <h4 style={subHeadingStyle}>✅ Decisiones tomadas (no reabrir sin validación)</h4>
                    <ul style={ulStyle}>
                      <li>Estructura de 7 niveles de dropshipper con umbrales exactos (ver tabla en Solución).</li>
                      <li>El Wrapped y la insignia de Header siempre reflejan el <strong>mes cerrado</strong> (Mes N-1); nunca el mes en curso.</li>
                      <li>Actualización de datos: <strong>batch diario</strong>, no tiempo real — dato del día anterior.</li>
                      <li>En Hito 1, el rango dentro de cada nivel se muestra solo como texto, sin barra de progreso funcional.</li>
                      <li>La Card Resumen del Dashboard (6 fondos por nivel) queda fuera del alcance de Hito 1.</li>
                      <li>El toggle &quot;Como dropshipper / Como líder de comunidad&quot; solo aparece si el usuario lidera una comunidad propia.</li>
                      <li>Hito 1 no incluye ningún concepto de puntaje/Dropicoins en la UI — único driver visible: &quot;órdenes entregadas&quot;.</li>
                      <li>Liga Impacto Económico tiene un único nivel: &quot;Formador de Millonarios&quot; (≥ USD 1M GMV/mes) — nombre validado por Laura Sánchez.</li>
                      <li><strong>Naming &quot;Master vs. Maestro&quot; resuelto a nivel técnico:</strong> el enum SQL <code>tier_name</code> y los archivos de medalla ya usan &quot;Master&quot;. La documentación de negocio (PRD v7) sigue usando &quot;Maestro&quot; — pendiente alinear copy de negocio antes de que se propague más.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>❓ Preguntas abiertas</h4>
                    <ul style={ulStyle}>
                      <li>Naming definitivo de rango (¿Lite/Plus/Max? ¿esquema metal + numeral tipo &quot;Plata III&quot;?).</li>
                      <li>¿Los umbrales de la Liga Efectividad (líderes) ya están validados de forma definitiva por comercial, o siguen sujetos a cambio?</li>
                      <li>Tasa de conversión drops → Dropicoins y valor monetario de 1 Dropicoin (bloquea redención post-MVP, no bloquea Hito 1).</li>
                      <li>Ventana de tolerancia para considerar los datos del batch diario &quot;consolidados&quot; antes de disparar el Wrapped.</li>
                      <li>Definición técnica exacta y cierre formal de &quot;orden completada&quot; (Data + Producto) — estado validado con ~20 días de espera, no evento en tiempo real.</li>
                      <li>Contenido legal definitivo de Términos y Condiciones y contenido de Preguntas Frecuentes — ambos pendientes de redacción, no solo de desarrollo.</li>
                      <li>Diseño de arquitectura de &quot;Grupo empresarial&quot; — sesión técnica recomendada con Fabian Castro antes de desarrollo del MVP, aunque no se lance en este hito.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>⚠️ Riesgos</h4>
                    <ul style={ulStyle}>
                      <li>Generación client-side de imagen PNG del Wrapped: posible latencia o fallo en navegadores móviles.</li>
                      <li>Consistencia de datos: posible desfase entre plataforma transaccional in-app y tabla de ranking pública de comunidades.</li>
                      <li>Contenido faltante que puede bloquear release: Términos y Condiciones (Legal) y FAQ (Producto/Growth) no existen aún.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Pendiente — conexión a datos reales de Dropi</h4>
                    <p style={pStyle}>
                      El flujo OTP funciona de punta a punta (correo real vía SMTP, verificación, tablas en Supabase), pero viven en el proyecto de Supabase propio del prototipo, sembradas con solo 5 vendedores de prueba — no es la base de datos real de Dropi. Un vendedor real que entra con su correo real hoy ve &quot;Bienvenido · 0 órdenes&quot; (fallback), no su data real. Conectar contra <code>orders</code>/<code>users</code> de producción requiere alinear con Data/Producto antes de tocar producción — <strong>decisión de José: posponer, foco ahora en ajustes de UX.</strong>
                    </p>
                  </div>
                )}

                {/* TAB 5 — EQUIPO & FUENTES */}
                {tab === "equipo" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Users size={16} /><span>5. Equipo y fuentes</span></h3>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                      <thead><tr><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Nombre</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Líder de programa — Growth</td><td style={tableCellStyle}>Laura Sánchez</td></tr>
                        <tr><td style={tableCellStyle}>Sponsor ejecutivo</td><td style={tableCellStyle}>José Giraldo</td></tr>
                        <tr><td style={tableCellStyle}>Líder técnico / Producto</td><td style={tableCellStyle}>Fabian Castro Peralta</td></tr>
                        <tr><td style={tableCellStyle}>Tech Lead asignado (hand-off Hito 1)</td><td style={tableCellStyle}>José Giraldo</td></tr>
                        <tr><td style={tableCellStyle}>Embajadores del programa</td><td style={tableCellStyle}>Diwer Martínez / Laura Mira</td></tr>
                        <tr><td style={tableCellStyle}>Alineación comercial (umbrales)</td><td style={tableCellStyle}>Por confirmar</td></tr>
                      </tbody>
                    </table>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>
                      &quot;José Giraldo&quot; aparece como Sponsor ejecutivo en el PRD v7 y como Tech Lead asignado en el hand-off — se transcribe tal cual figura en ambos documentos fuente, sin resolver si es la misma asignación o una inconsistencia entre documentos.
                    </p>

                    <h4 style={subHeadingStyle}>Fuentes</h4>
                    <ul style={ulStyle}>
                      <li><code>E2E Leyendas Dropi.md</code> — Borrador funcional, especificación funcional y hand-off a DEV y stakeholders (Hito 1), Tech Lead José Giraldo, 05/08/2026.</li>
                      <li><code>Dropi_Leyendas_v7.docx.md</code> — PRD &quot;Leyendas Dropi&quot; v7.0, Growth Dropi, junio 2026, lanzamiento MVP estimado septiembre 2026.</li>
                      <li>Prototipos de baja fidelidad (Figma/mockups): testimonio de leyenda, ficha de comunidad, ranking, landing del programa, card expandida, card contraída, wrapped, one page nivel.</li>
                      <li><code>leyendas-dropi-handoff-darwin.md</code> — documento completo del proyecto, agosto 2026 (ver enlace al artifact arriba).</li>
                    </ul>

                    <Callout tone="success" title="📌 Anexo D — Backlog de Historias de Usuario (Hito 1)">
                      <strong>Célula Plataforma (In-App):</strong> US-PLAT-01 Insignia en Header · US-PLAT-02 Wrapped Dropi · US-PLAT-03 Card Leyenda (Contraída) · US-PLAT-04 Card Leyenda (Expandida).<br /><br />
                      <strong>Célula Web External (Landings):</strong> US-LND-01 Landing Dropshippers · US-LND-02 Landing Líderes · US-LND-03 OnePage de Nivel · US-LND-04 Ranking de Comunidades · US-LND-05 Ficha de Comunidad · US-LND-06 Términos y Condiciones · US-LND-07 Preguntas Frecuentes.<br /><br />
                      Detalle completo (Contexto, Criterios de Aceptación, Gherkin, DoD) en <code>Leyendas_Dropi_Historias_Usuario_Hito1.docx</code>.
                    </Callout>
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
