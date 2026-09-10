"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import ProjectWeekly, { type ProjectUpdate } from "@/components/ProjectWeekly";
import {
  ChevronDown, ChevronUp, FileText, Layers,
  Users, Wrench, GitBranch, DollarSign, AlertTriangle, Rocket,
} from "lucide-react";

/* ── Shared styles (mismos tokens que gro-002 / gro-004 / fin-001 / marcas) ── */
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

type PocChild = { id: string; name: string; project_code: string | null; estado_interno: string | null };

export default function Gro001ProjectPage() {
  const [docOpen, setDocOpen] = useState(true);
  const [tab, setTab] = useState("resumen");
  const [pocs, setPocs] = useState<PocChild[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);

  useEffect(() => {
    fetch("/api/proyectos/gro-001")
      .then((res) => res.json())
      .then((data) => {
        setPocs((data?.children ?? []).filter((c: { type: string }) => c.type === "POC"));
        setUpdates(data?.updates ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="GRO-001 · CRM Líderes de Comunidad"
        subtitle="José Pineda · Growth Product Manager"
        currentSlug="gro-001"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & título ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              ← Volver al Hub
            </a>
            <ProjectWeekly updates={updates} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={badgeStyle("#C2410C", "var(--dropi-light)")}>🌱 Célula Growth</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>📦 Delivery Backlog (más avanzado que Discovery)</span>
                <span style={badgeStyle("#B45309", "#FEF3C7")}>🟡 Pausado — recomendación: avanzar como 2 POCs</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                🤝 CRM Líderes de Comunidad
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 760 }}>
                Subcuenta de CRM (Go High Level) por cada líder de comunidad, conectada a la data transaccional de Cronos — visibilidad en tiempo real de sus estudiantes/afiliados. No arranca desde cero: ya existe propuesta técnica completa, equipo, fases y datos reales validados, construida por Growth Ops.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Sponsor</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Luis Domínguez</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Liderazgo técnico</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Enrique López (Growth Ops)</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Coordinación</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Pineda</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Activación con líder vs. huérfano", value: "~23%", sub: "palanca de activación más fuerte del ecosistema — mayor ROI histórico", color: "var(--dropi)" },
            { label: "Estudiantes sin ninguna orden", value: "52.28%", sub: "validado en el extracto real (394 afiliados / 8 líderes) — coincide con la cifra de la presentación", color: "#B42318" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Prototipo ── */}
        <div style={{ marginBottom: 28 }}>
          <a href="https://crm-lideres-comunidad.vercel.app" target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start", maxWidth: 400 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FBEAF0", color: "#9F2C56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Rocket size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>Presentación completa del proyecto ↗</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 3, lineHeight: 1.5 }}>Problema, arquitectura, pipelines, flujos, dashboard, modelo SaaS, fases y equipo.</div>
            </div>
          </a>
        </div>

        {/* ── POCs de este proyecto ── */}
        {pocs.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              🧩 POCs de este proyecto ({pocs.length})
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {pocs.map((p) => (
                <a
                  key={p.id}
                  href={p.project_code ? `/proyectos/${p.project_code.toLowerCase()}` : "#"}
                  style={{ textDecoration: "none", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px" }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9F2C56" }}>{p.project_code}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 3 }}>{p.estado_interno ?? "Sin definir"}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Alerta principal: CRM vs Webe ── */}
        <Callout tone="warning" title="🟡 CRM vs. Webe — pausa temporal y recomendación de avanzar como 2 POCs (28 ago 2026)">
          Esta semana el equipo se reunió con <strong>Webe</strong> para entender el foco de cada proyecto y buscar complementariedad de cara al servicio del usuario. El jueves 27 de agosto llegó la indicación de pausar las actividades del CRM, para no duplicar esfuerzos con la herramienta que le ayudará al líder de comunidad a dinamizar su comunidad. El CRM ya tiene pipelines y estructura montada en Go High Level — no arranca de cero. <strong>Recomendación de Growth y Producto:</strong> seguir abordando ambos frentes como POC — Frente 1: CRM para Líderes de Comunidad (Go High Level); Frente 2: Webe como sistema de gestión de comunidad — y dejar que sea el usuario, con el uso real de ambos flujos de trabajo, quien indique cómo se complementan. Growth Ops y Producto, junto con Nicolás, ya concluyeron que son dos herramientas distintas que pueden entregarse al usuario en dos etapas diferentes del servicio. <strong>Argumento de continuidad:</strong> todos los recursos para desplegar este POC ya están disponibles a riesgo cero — la licencia de Go High Level ya incluye los usuarios que se le otorgarían a los líderes, los pipelines ya están definidos, y el piloto sería controlado directamente por el equipo de Growth. El equipo insiste en continuar el flujo de trabajo para lanzar el POC del CRM.
        </Callout>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION — CONTEXTO COMPLETO
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #9F2C56", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(159,44,86,0.08)" }}>
          <button
            onClick={() => setDocOpen(!docOpen)}
            style={{ width: "100%", background: docOpen ? "linear-gradient(90deg,#FBEAF0 0%,#FDF3F6 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: docOpen ? "1px solid #F5D6E1" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#9F2C56", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#1E1B4B" }}>Contexto ampliado del proyecto</span>
                  <span style={badgeStyle("#9F2C56", "#FBEAF0")}>Fuente: documento del proyecto, agosto 2026</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Todo lo trabajado hasta ahora: contexto de negocio, equipo/gobernanza, arquitectura, monetización, fases, datos reales, CRM vs. Webe, y riesgos consolidados.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#9F2C56", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #F5D6E1" }}>
                {docOpen ? "Ocultar contexto" : "Ver contexto"}
              </span>
              {docOpen ? <ChevronUp size={20} color="#9F2C56" /> : <ChevronDown size={20} color="#9F2C56" />}
            </div>
          </button>

          {docOpen && (
            <div style={{ padding: 24 }}>
              <div style={{ background: "#FAFAFA", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>

                {/* Tab nav */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { id: "resumen", label: "🧠 0-1. Resumen & Contexto" },
                    { id: "equipo", label: "👥 2. Equipo & gobernanza" },
                    { id: "arquitectura", label: "🛠️ 3. Arquitectura" },
                    { id: "monetizacion", label: "💰 4-5. Monetización & fases" },
                    { id: "datos", label: "📊 6. Datos reales" },
                    { id: "riesgos", label: "🔀 8-10. Webe & riesgos" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#9F2C56" : "#ffffff", color: tab === t.id ? "#ffffff" : "#475569", border: tab === t.id ? "1px solid #9F2C56" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — RESUMEN & CONTEXTO */}
                {tab === "resumen" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🧠 0-1. Resumen ejecutivo & contexto de negocio</span></h3>
                    <p style={pStyle}>
                      Una subcuenta de CRM (Go High Level, marca blanca ya licenciada por Dropi) por cada líder de comunidad, conectada directamente a la data transaccional de Cronos. Le da a cada líder visibilidad en tiempo real de sus estudiantes/afiliados — hoy esa información solo existe en un Excel manual que el equipo de Comunidad/Academy comparte bajo pedido, sin alertas ni tiempo real.
                    </p>

                    <h4 style={subHeadingStyle}>Problema que resuelve</h4>
                    <p style={pStyle}>
                      Los líderes de comunidad enseñan a vender pero no pueden ver el resultado de sus estudiantes: no saben cuánta gente se activa con su link de afiliado, cuánta gente vende realmente, ni qué tan rentable es su comunidad (puede crecer en volumen pero con una tasa de devolución tan alta que en la práctica no sea rentable).
                    </p>

                    <h4 style={subHeadingStyle}>Justificación de negocio</h4>
                    <p style={pStyle}>
                      La activación de un usuario acompañado por un líder de comunidad es <strong>~23%</strong>, muy por encima de un usuario &quot;huérfano&quot; — descrita internamente como &quot;el programa de crecimiento con mayor ROI histórico&quot;. Más herramientas al líder → más estudiantes activos → más órdenes para Dropi.
                    </p>

                    <h4 style={subHeadingStyle}>Dato de diagnóstico</h4>
                    <p style={pStyle}>
                      &quot;El 52% de los estudiantes registrados en Dropi nunca ha generado una orden.&quot; Validado de forma independiente: el extracto real (394 afiliados de 8 líderes) muestra <strong>52.28%</strong> sin fecha de primera orden — coincide casi exacto con la cifra de la presentación.
                    </p>

                    <h4 style={subHeadingStyle}>Antecedentes</h4>
                    <p style={pStyle}>
                      El proyecto lleva cerca de 2 años en el radar, con intentos previos fallidos (nombre en código &quot;Naisipa/Blindaje&quot;) frenados por falta de acceso a datos. Se destrabó cuando Growth Ops consiguió acceso a Cronos.
                    </p>

                    <h4 style={subHeadingStyle}>Estado real al 21 de agosto</h4>
                    <p style={pStyle}>
                      Propuesta técnica completa (arquitectura, 2 pipelines, 11 flujos automáticos, dashboard de 7 módulos), equipo asignado, plan de 5 fases con duraciones y entregables, y un extracto real de datos ya validado. <strong>Está más cerca de Delivery Backlog que de Discovery</strong> en términos de madurez.
                    </p>

                    <h4 style={subHeadingStyle}>Definición del POC (28 ago)</h4>
                    <p style={pStyle}>
                      Experimento que busca validar si otorgarle una licencia de Go High Level al líder de comunidad impacta positivamente el desempeño general de su comunidad y su activación dentro del ecosistema — más usuarios activos se traduce en más órdenes. El POC se considerará exitoso si el líder de comunidad muestra adherencia a la herramienta y percibe impactos positivos dentro del marco del experimento.
                    </p>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>
                      Pendiente: la selección de los líderes de comunidad para el piloto sigue en definición, así como la minuta formal del experimento.
                    </p>

                    <h4 style={subHeadingStyle}>Actualización (10 sept)</h4>
                    <p style={pStyle}>
                      El equipo técnico ya construyó la planimetría del POC con líderes pequeños — de qué se trata y cómo se va a ejecutar.{" "}
                      <a href="https://dropi-crm-lideres.vercel.app/admin" target="_blank" rel="noreferrer" style={{ color: "#9F2C56", fontWeight: 700 }}>Ver demo →</a>
                    </p>
                    <p style={pStyle}>
                      En paralelo, se está refinando con John Cerón un artefacto que permite entender la salud de las comunidades de forma multidimensional (aún en ajuste de detalles).{" "}
                      <a href="https://claude.ai/code/artifact/c5aaf216-f5ca-4009-a4dd-b169e9522393" target="_blank" rel="noreferrer" style={{ color: "#9F2C56", fontWeight: 700 }}>Ver artefacto →</a>
                    </p>
                    <p style={{ ...pStyle, marginBottom: 0 }}>
                      También se están explorando nuevas salidas para el proyecto a través de Marcas.
                    </p>
                  </div>
                )}

                {/* TAB 2 — EQUIPO & GOBERNANZA */}
                {tab === "equipo" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Users size={16} /><span>2. Equipo, gobernanza y estado de ownership</span></h3>

                    <Callout tone="warning" title="⚠️ Estado de gobernanza sin confirmar formalmente">
                      El proyecto tiene un mandato documentado como asignado por la CPO (María Ossa) a Growth, con estado histórico de &quot;backlog 2 años, sin definiciones funcionales&quot;. En la práctica, un equipo de Growth Ops ya tiene una propuesta técnica completa corriendo en paralelo, y el tema de gobernanza formal <strong>no se mencionó ni una sola vez</strong> en ninguna de las dos reuniones registradas (20 y 21 de agosto). José Pineda coordina de facto entre Growth Ops, Webe y Comunidad — no es un mandato formal confirmado.
                    </Callout>

                    <h4 style={subHeadingStyle}>Equipo por persona</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Persona</th><th style={tableHeaderStyle}>Notas</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Liderazgo de la propuesta técnica</td><td style={tableCellStyle}><strong>Enrique Manuel López Sánchez</strong></td><td style={tableCellStyle}>Automatización de Growth Ops</td></tr>
                        <tr><td style={tableCellStyle}>Desarrollo / implementación técnica</td><td style={tableCellStyle}><strong>Diego Forero Garzón</strong> y <strong>Juan Sebastián Maldonado</strong></td><td style={tableCellStyle}>Diego también construyó Gali, la IA de SAC sobre Intercom</td></tr>
                        <tr><td style={tableCellStyle}>Data</td><td style={tableCellStyle}><strong>John Cerón Arboleda</strong></td><td style={tableCellStyle}>Data Specialist</td></tr>
                        <tr><td style={tableCellStyle}>Sponsor</td><td style={tableCellStyle}><strong>Luis Domínguez (&quot;Lucho&quot;)</strong></td><td style={tableCellStyle}>Head of Growth</td></tr>
                        <tr><td style={tableCellStyle}>Customer Success</td><td style={tableCellStyle}><strong>Jose Hurtado</strong></td><td style={tableCellStyle}>Foco en la experiencia del líder y del estudiante</td></tr>
                        <tr><td style={tableCellStyle}>Coordinación de agenda entre frentes</td><td style={tableCellStyle}><strong>Jose Pineda Pitre</strong></td><td style={tableCellStyle}>Growth Ops, Webe y Comunidad</td></tr>
                      </tbody>
                    </table>

                    <Callout tone="warning" title="⚠️ Dos alertas de calidad del transcript">
                      <strong>Identidad sin confirmar:</strong> un asistente registrado como &quot;+57 316...58&quot; participó en ambas reuniones sin que su identidad quedara confirmada.<br /><br />
                      <strong>Posible error de diarización:</strong> varios participantes se dirigen a la persona etiquetada como &quot;Daniel Lombo&quot; llamándola &quot;Gabi&quot;/&quot;Gabriela&quot;, y esa persona usa concordancia femenina al hablar de sí misma. <em>Actualización (28 ago):</em> la convocatoria al ejercicio de service blueprint incluye a Gabriela y a Daniel Lombo como invitados distintos, lo que apunta a que sí son dos personas — pero no se ha confirmado explícitamente, así que se mantiene la cautela al citar decisiones de cualquiera de las dos en documentos oficiales.
                    </Callout>

                    <h4 style={subHeadingStyle}>Líderes piloto — ambigüedad sin resolver</h4>
                    <p style={pStyle}>
                      La presentación nombra 3 líderes piloto (Cristian Angel, Jhonatan Rojas, Cristhian Caicedo), pero el extracto real de datos tiene <strong>8 líderes, no 3</strong> — incluyendo a Juliana von Altrock de Melo (77 afiliados, volumen comparable a los pilotos) que no aparece en la lista declarada. No queda claro si las cifras del piloto son reales o una simulación con nombres reales. <strong>No usar estos números en un reporte oficial sin confirmarlo primero con Growth Ops.</strong>
                    </p>
                  </div>
                )}

                {/* TAB 3 — ARQUITECTURA */}
                {tab === "arquitectura" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Wrench size={16} /><span>3. Arquitectura y solución técnica</span></h3>
                    <p style={pStyle}>
                      Hoy no existe integración directa entre Dropi y Go High Level. Se construye vía <strong>Cronos → PostgreSQL</strong> (almacenamiento organizado por fecha/mes/usuario/líder/cuenta) <strong>→ subcuentas de Go High Level</strong>, sin middleware externo adicional.
                    </p>

                    <h4 style={subHeadingStyle}>2 pipelines que se le entregan a cada líder</h4>
                    <ul style={ulStyle}>
                      <li><strong>Ciclo de vida del estudiante:</strong> Registrado → Primera orden → Dropshipper Activo (+1 orden/mes) → Inactivo (2+ meses sin órdenes) → Reactivado.</li>
                      <li><strong>Radar de rendimiento (mensual):</strong> Creciendo (+20%) / Estable (0–20%) / Decreciendo (-20% o más) / Inactivo / Reactivado — matizado con etiquetas de devolución (🟢 Óptima 0–15% · 🟡 Aceptable 16–30% · 🟠 En Riesgo 31–45% · 🔴 Crítica +45%).</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Otros componentes</h4>
                    <ul style={ulStyle}>
                      <li><strong>Listas inteligentes:</strong> Nuevos esta semana · En riesgo (15–29 días sin órdenes) · Top del mes.</li>
                      <li><strong>11 flujos automáticos, 19 mensajes:</strong> al estudiante (Bienvenida, Activación, Primera Orden, Alerta de Caída, Reactivación, Refuerzo) y al líder (Nuevo Registrado, Primera Orden Lograda, Estudiante Decreciendo/Inactivo/Reactivado). Todos editables por el líder.</li>
                      <li><strong>Dashboard individualizado:</strong> 7 módulos, 35+ KPIs (Resumen, Activación, Retención, Rendimiento, Evolución histórica, Distribución, Tabla de estudiantes y alertas) + cuadro de mando agregado para uso interno.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Ajustes pedidos en la revisión del 20 de agosto</h4>
                    <ul style={ulStyle}>
                      <li>Sumar hitos propios de Growth (10 / 100 / 300 órdenes en el primer mes) — predicen retención y consolidación del dropshipper. Aceptado, pendiente de detalle exacto.</li>
                      <li>Contacto directo desde la tabla de estudiantes — resuelto vía enlace directo al contacto en el CRM, sin mostrar el teléfono suelto.</li>
                      <li><strong>Sin resolver:</strong> cómo distinguir un &quot;estudiante real&quot; del líder vs. alguien que solo usó su link sin ser parte de su comunidad pagada.</li>
                    </ul>
                  </div>
                )}

                {/* TAB 4 — MONETIZACIÓN & FASES */}
                {tab === "monetizacion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><DollarSign size={16} /><span>4. Modelo de monetización — lateral, no es el objetivo central</span></h3>
                    <Callout tone="warning" title="⚠️ Explícitamente aclarado por el propio equipo">
                      &quot;No es el objetivo que esto se convierta en negocio, pero si se puede, interesante.&quot; Es una idea lateral para llevar a Producto, <strong>no una decisión tomada</strong>. No comunicar esto como si ya estuviera aprobado.
                    </Callout>
                    <p style={pStyle}>
                      Go High Level le cobra a Dropi por consumo (WhatsApp, SMS, número, envío masivo); la subcuenta se entregaría gratis al líder, y Dropi cobraría un margen sobre ese consumo. Proyección con 495 líderes: <strong>$281.556 – $1.656.068 USD/año</strong> según 3 escenarios de gasto promedio ($99, $198 y $532/líder/mes).
                    </p>

                    <h3 style={{ ...sectionHeadingStyle, marginTop: 20 }}><Layers size={16} /><span>5. Plan de fases y cronograma</span></h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>Fase</th><th style={tableHeaderStyle}>Duración</th><th style={tableHeaderStyle}>Criterio de avance</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>0</td><td style={tableCellStyle}>Preparación</td><td style={tableCellStyle}>7 días</td><td style={tableCellStyle}>✅ Líderes + infra listos</td></tr>
                        <tr><td style={tableCellStyle}>1</td><td style={tableCellStyle}>Construcción</td><td style={tableCellStyle}>10–20 días</td><td style={tableCellStyle}>✅ Sistema operativo en pruebas</td></tr>
                        <tr><td style={tableCellStyle}>2</td><td style={tableCellStyle}>Carga inicial</td><td style={tableCellStyle}>2 días</td><td style={tableCellStyle}>✅ Datos validados en GHL</td></tr>
                        <tr><td style={tableCellStyle}>3</td><td style={tableCellStyle}>Piloto</td><td style={tableCellStyle}>5–7 días + 60 días piloto</td><td style={tableCellStyle}>✅ Mejora en 2+ KPIs al D60</td></tr>
                        <tr><td style={tableCellStyle}>4</td><td style={tableCellStyle}>Validación</td><td style={tableCellStyle}>Variable</td><td style={tableCellStyle}>Decisión go/no-go documentada</td></tr>
                        <tr><td style={tableCellStyle}>5</td><td style={tableCellStyle}>Escala</td><td style={tableCellStyle}>Variable</td><td style={tableCellStyle}>✅ &gt;70% acceden semana 1, &gt;50% activos al mes 2</td></tr>
                      </tbody>
                    </table>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Criterio de selección de líder piloto: mínimo 50 estudiantes vinculados y disposición activa a participar. Línea base: 4 KPIs medidos en D30/D60 contra los 60 días ANTES del programa (no contra el histórico completo, &quot;para no ensuciar la data&quot;).</p>
                  </div>
                )}

                {/* TAB 5 — DATOS REALES */}
                {tab === "datos" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>📊 6. Diccionario de datos — <code>crm_feed.xlsx</code></span></h3>
                    <p style={pStyle}>
                      Corresponde exactamente a las tablas PostgreSQL <code>crm_feed</code> y <code>crm_actividad_mensual</code> — no es un mockup, es un extracto real ya construido. 3 hojas, 394/59/648 filas de datos.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Hoja</th><th style={tableHeaderStyle}>Grano</th><th style={tableHeaderStyle}>Hallazgo clave</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Perfil 360</strong></td><td style={tableCellStyle}>1 fila por afiliado, <code>id_dropi</code> clave única</td><td style={tableCellStyle}>394 afiliados, 8 líderes, mono-país (100% Colombia). 52.28% sin fecha de primera orden.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Resumen Actividad</strong></td><td style={tableCellStyle}>1 fila por afiliado con actividad reciente</td><td style={tableCellStyle}>Solo 59 de 394 (15% cobertura). Órdenes ingresadas 0–1.013 (mediana 24).</td></tr>
                        <tr><td style={tableCellStyle}><strong>Alertas Validación</strong></td><td style={tableCellStyle}>1 fila por alerta activa</td><td style={tableCellStyle}>343 de 394 afiliados (87%) tienen al menos una alerta. Top: sin login +30 días (235), nunca ha hecho una orden (206).</td></tr>
                      </tbody>
                    </table>
                    <Callout tone="success" title="✅ Integridad referencial perfecta">
                      0 IDs huérfanos en ninguna dirección entre las 3 hojas — <code>id_dropi</code> es la llave universal, &quot;Perfil 360&quot; es la tabla maestra.
                    </Callout>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Nota de calidad: algunos <code>telefono</code> con solo 3 dígitos (placeholder) — vale una regla de validación antes de usarlo para WhatsApp. La suma de estados de orden no siempre coincide con <code>ordenes_ingresadas</code> (diferencia media ~112) — aclarar semántica con Data.</p>
                  </div>
                )}

                {/* TAB 6 — WEBE & RIESGOS */}
                {tab === "riesgos" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><GitBranch size={16} /><span>8-9. CRM vs. Webe & conexión con Leyendas Dropi</span></h3>
                    <p style={pStyle}>
                      Webe ya incluye un CRM propio para el líder y su comunidad, más un &quot;school&quot; de mentorías (Q4 2026), liderado por Laura Sánchez y Luis Domínguez. Caminos propuestos por el equipo de Webe: <strong>(a)</strong> absorber el CRM dentro de Webe, o <strong>(b)</strong> que Webe consuma los datos del CRM vía API. Modelo escalonado planteado en vivo: dar el CRM a líderes pequeños y &quot;saltarlos&quot; a Webe cuando crezcan — contemplado como &quot;aspiracional&quot;, sin decidir formalmente.
                    </p>
                    <p style={pStyle}>
                      <strong>Actualización (28 ago):</strong> tras la pausa del 27 de agosto, Growth y Producto recomiendan no elegir entre las dos herramientas todavía — correrlas como dos POC en paralelo (CRM vía Go High Level y Webe) y dejar que el uso real del usuario indique cómo se complementan en distintas etapas del servicio (ver alerta arriba). Antes del anuncio de la pausa ya estaba agendada una reunión con Laura Contreras, Gabriela y Daniel Lombo para un ejercicio de <em>service blueprint</em> — el equipo insiste en sostenerla para no frenar el flujo hacia el lanzamiento del POC de CRM.
                    </p>
                    <p style={pStyle}>
                      La tesis del equipo es que Webe puede nutrirse de los aprendizajes que genere este POC, y que ambas herramientas pueden convivir en distintas etapas del ciclo de servicio del líder dentro del portafolio que Dropi le expone. El equipo también es consciente de que, eventualmente, uno de los dos proyectos podría absorber al otro — si Webe termina absorbiendo las capacidades del CRM, no representa un problema; el planteamiento es llegar a ese punto con claridad sobre los pros y contras de esta herramienta, respaldada por un experimento ya constituido.
                    </p>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Conexión con Leyendas Dropi: este CRM ya construye exactamente el mapa de afiliación líder–comunidad que Leyendas Dropi necesitaba desde cero para sus 3 Ligas de Líderes — confirmar antes de duplicar esa infraestructura. Mismos referentes de Data (Miguel, John Cerón) en ambos proyectos.</p>

                    <h3 style={{ ...sectionHeadingStyle, marginTop: 20 }}><AlertTriangle size={16} /><span>10. Riesgos y pendientes consolidados</span></h3>
                    <ul style={ulStyle}>
                      <li>🟡 Duplicidad con Webe — actividades del CRM en pausa desde el 27 de agosto; recomendación de Growth y Producto es correr ambos frentes como POC en paralelo (ver alerta arriba), pendiente de decisión formal del sponsor.</li>
                      <li>✅ Ownership del proyecto: Growth y Producto.</li>
                      <li>🔴 Latencia de Cronos al escalar a Marcas/Dropshippers Huérfanos — depende de conversación pendiente con Miguel (Data).</li>
                      <li>🔴 Riesgo de canibalización entre CRM y Webe, nombrado explícitamente en la reunión del 21 de agosto.</li>
                    </ul>
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
