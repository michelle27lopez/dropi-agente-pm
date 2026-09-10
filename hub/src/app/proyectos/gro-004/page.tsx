"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import ProjectWeekly, { type ProjectUpdate } from "@/components/ProjectWeekly";
import {
  ChevronDown, ChevronUp, FileText, Rocket, Layers,
  Wrench, Sparkles, ExternalLink,
} from "lucide-react";

/* ── Shared styles (mismos tokens que gro-002 / fin-001 / marcas) ── */
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

export default function Gro004ProjectPage() {
  const [docOpen, setDocOpen] = useState(true);
  const [tab, setTab] = useState("resumen");
  const [pocs, setPocs] = useState<PocChild[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);

  useEffect(() => {
    fetch("/api/proyectos/gro-004")
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
        title="GRO-004 · HelpCenter / Biblia IA"
        subtitle="José Pineda · Growth Product Manager"
        currentSlug="gro-004"
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
                <span style={badgeStyle("#0E7C74", "#E3F3F0")}>🔍 Discovery temprano</span>
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🤝 Co-liderado con SAC</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Help Center / &quot;Biblia IA&quot;
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 760 }}>
                Centro de ayuda de autogestión para el ecosistema Dropi — 3 superficies alimentadas por la misma base de conocimiento, con estrategia de optimización para que los motores de IA citen el contenido (GEO/AEO). Nace del equipo de Servicio al Cliente, no es una iniciativa impuesta por Growth.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Growth Product Manager</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Pineda</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Co-responsable</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Laura Núñez (SAC)</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Product Designer</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Francisco Velandia</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "CSAT Chile vs. meta", value: "~0.30–0.40", sub: "meta 0.75 — señal de presión sobre SAC que Help Center busca aliviar", color: "#B42318" },
            { label: "Superficies con base de conocimiento única", value: "3", sub: "Botón flotante · Cards contextuales · Portal tipo Shopify", color: "#0E7C74" },
            { label: "Probabilidad de citación en formato FAQ", value: "81%", sub: "según estudios de la industria GEO/AEO 2026 — el formato que más citan las IAs", color: "#7C3AED" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Documentos ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 28 }}>
          <a href="https://helpcenter-dropi.vercel.app" target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "#FFFBEB", border: "1px dashed #FDE68A", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start", transition: "border-color 0.15s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Rocket size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}>
                Prototipo vibecodeado (superficie WebSite) <ExternalLink size={12} color="#92400E" />
              </div>
              <div style={{ fontSize: 12, color: "#78350F", marginTop: 3, lineHeight: 1.5 }}>Existe y tiene QA completa (7 HU) — publicado en Vercel para revisión.</div>
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
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0E7C74" }}>{p.project_code}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 3 }}>{p.estado_interno ?? "Sin definir"}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Actualización semanal ── */}
        <Callout tone="info" title="📌 Tres frentes convergiendo en la misma base de conocimiento (28 ago 2026)">
          Esta semana se le mostró el proyecto a <strong>Diana Aldana</strong> para que oriente el desarrollo desde las mejores prácticas de experiencia — quedamos a la espera de sus recomendaciones. En paralelo, <strong>José Hurtado</strong> está recopilando varias bases de conocimiento para tener un punto de partida alineado con el experimento que ya está al aire en Argentina. Y todavía tenemos pendiente una reunión con <strong>Kike</strong> para integrar esa base de conocimiento a Intercom. Los tres frentes conducen al mismo lugar: una sola base de conocimiento para las 3 superficies, construida sobre las buenas prácticas de GEO y AEO ya definidas (ver pestaña GEO/AEO).
        </Callout>

        {/* ── Alerta narrativa/marca ── */}
        <Callout tone="warning" title="⚠️ Punto de coherencia narrativa — promesa de marca incumplida en el prototipo">
          El mensaje central del proyecto es &quot;nunca operas solo, aunque no haya un humano al otro lado&quot; — el pilar 3 promete que el sistema &quot;te lleva a lo humano cuando hace falta&quot;. Pero el QA (US-HC-05, CA6) encontró que cuando el usuario responde &quot;No&quot; a &quot;¿te sirvió esta respuesta?&quot;, el sistema solo muestra texto — sin botón ni enlace real a soporte/PQR. Con el mensaje ya adoptado, este deja de ser solo un gap de UX: es una promesa de marca incumplida. Priorizar su arreglo antes de cualquier lanzamiento público de la narrativa.
        </Callout>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION — CONTEXTO COMPLETO
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #0E7C74", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(14,124,116,0.08)" }}>
          <button
            onClick={() => setDocOpen(!docOpen)}
            style={{ width: "100%", background: docOpen ? "linear-gradient(90deg,#E3F3F0 0%,#F0FAF8 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: docOpen ? "1px solid #CDEAE5" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#0E7C74", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#1E1B4B" }}>Contexto ampliado del proyecto</span>
                  <span style={badgeStyle("#0E7C74", "#E3F3F0")}>Fuente: documento del proyecto, agosto 2026</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Todo lo trabajado hasta ahora: problema, las 3 superficies, arquitectura de escala, GEO/AEO, beta técnica con QA, pendientes y equipo.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0E7C74", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #CDEAE5" }}>
                {docOpen ? "Ocultar contexto" : "Ver contexto"}
              </span>
              {docOpen ? <ChevronUp size={20} color="#0E7C74" /> : <ChevronDown size={20} color="#0E7C74" />}
            </div>
          </button>

          {docOpen && (
            <div style={{ padding: 24 }}>
              <div style={{ background: "#FAFAFA", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>

                {/* Tab nav */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { id: "resumen", label: "🧠 1. Resumen & Kick-off" },
                    { id: "superficies", label: "🧩 2-3. Superficies & Arquitectura" },
                    { id: "geo", label: "🔍 4. GEO/AEO" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#0E7C74" : "#ffffff", color: tab === t.id ? "#ffffff" : "#475569", border: tab === t.id ? "1px solid #0E7C74" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — RESUMEN & KICK-OFF */}
                {tab === "resumen" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🧠 0-1. Resumen ejecutivo & Kick-off</span></h3>
                    <p style={pStyle}>
                      Un centro de ayuda de autogestión para el ecosistema Dropi, con 3 superficies distintas (botón flotante contextual, cards proactivas por pantalla, y un portal/biblioteca abierta tipo Shopify), todas alimentadas por <strong>la misma base de conocimiento</strong>. Nace del equipo de Servicio al Cliente (Laura Núñez) — no es una iniciativa impuesta por Growth, es co-liderado.
                    </p>

                    <h4 style={subHeadingStyle}>Por qué existe</h4>
                    <p style={pStyle}>
                      Hoy el usuario tiene que navegar hasta el botón flotante para resolver cualquier duda — no hay canal de autogestión visible antes de llegar ahí. La única aproximación existente es una sección de Blog no estructurada, que mezcla contenido de marketing con contenido de ayuda real. Esto genera presión directa sobre las bandejas de SAC en Intercom: las de mayor volumen/calificación negativa en Colombia (junio 2026) son Devoluciones Injustificadas, Garantías dropshipper, Anulaciones, Retiros y Compliance. El CSAT de Chile está consistentemente por debajo de meta (meta 0.75, resultado real ~0.30–0.40 según el mes).
                    </p>

                    <h4 style={subHeadingStyle}>Propósito</h4>
                    <p style={pStyle}>
                      Exponer a los 3 segmentos de usuario de Dropi — <strong>Sellers, Suppliers y Brands</strong> (no solo dropshippers) — una librería de preguntas frecuentes que incentive la autogestión dentro del ecosistema.
                    </p>

                    <h4 style={subHeadingStyle}>Alcance</h4>
                    <p style={pStyle}>
                      <strong>V1 = exclusivamente Dropi.</strong> Principio de diseño: la arquitectura (esquema de datos, naming, navegación) se piensa desde ya para escalar a todo el holding (ChateaPro, Atom, Roax, Estrellas, EcomScanner y futuros) sin tener que reconstruir.
                    </p>

                    <h4 style={subHeadingStyle}>Equipo y stakeholders</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead><tr><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Nombre</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Growth Product Manager</td><td style={tableCellStyle}>José Pineda</td></tr>
                        <tr><td style={tableCellStyle}>Co-responsable</td><td style={tableCellStyle}><strong>Laura Núñez</strong> — líder de Servicio al Cliente. El proyecto nace de su equipo.</td></tr>
                        <tr><td style={tableCellStyle}>Product Designer</td><td style={tableCellStyle}>Francisco Velandia</td></tr>
                        <tr><td style={tableCellStyle}>Growth Ops / Gali (IA de triage sobre Intercom)</td><td style={tableCellStyle}>Marlon</td></tr>
                        <tr><td style={tableCellStyle}>Userpilot</td><td style={tableCellStyle}>Laura Torres (con Katerin Salazar)</td></tr>
                        <tr><td style={tableCellStyle}>PO de comunicaciones</td><td style={tableCellStyle}>Majo</td></tr>
                        <tr><td style={tableCellStyle}>Academy</td><td style={tableCellStyle}>Esteban</td></tr>
                        <tr><td style={tableCellStyle}>Tecnología</td><td style={tableCellStyle}>José Giraldo</td></tr>
                      </tbody>
                    </table>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Estado: Discovery temprano — kick-off formal con Laura Núñez sin fecha fija todavía (falta Painpoint 2, objetivos/OKR propios, AS-IS completo).</p>
                  </div>
                )}

                {/* TAB 2 — SUPERFICIES & ARQUITECTURA */}
                {tab === "superficies" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Layers size={16} /><span>2. Definición — las 3 superficies</span></h3>
                    <p style={pStyle}>
                      <strong>Principio de producto central:</strong> Help Center no es un repositorio de preguntas sueltas que el usuario busca cuando ya tiene un problema — es un sistema de <strong>acompañamiento proactivo</strong>, no reactivo. Se activa en 3 momentos: cuando existe una duda, cuando el usuario tiene que tomar una decisión, o cuando está planeando algo.
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>#</th><th style={tableHeaderStyle}>Superficie</th><th style={tableHeaderStyle}>Naturaleza</th><th style={tableHeaderStyle}>Detalle</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>1</td><td style={tableCellStyle}><strong>Botón flotante de Intercom</strong></td><td style={tableCellStyle}>Proactivo, contextual</td><td style={tableCellStyle}>Presets por país + nivel de Leyendas Dropi. Dispara Gali o una lista de opciones predeterminadas.</td></tr>
                        <tr><td style={tableCellStyle}>2</td><td style={tableCellStyle}><strong>Cards en nivel 2 de navegación</strong></td><td style={tableCellStyle}>Proactivo, contextual</td><td style={tableCellStyle}>Presets específicos por pantalla (Órdenes, Logística, etc.), personalizados también por nivel de Leyendas Dropi.</td></tr>
                        <tr><td style={tableCellStyle}>3</td><td style={tableCellStyle}><strong>Portal tipo Shopify / biblioteca abierta</strong></td><td style={tableCellStyle}>Reactivo, exhaustivo</td><td style={tableCellStyle}>Cubre todo el eje funcional/sistémico de Dropi, organizado por segmento (Seller/Supplier/Brand). Evoluciona el Blog actual.</td></tr>
                      </tbody>
                    </table>

                    <Callout tone="info" title="Principio no negociable">
                      Las 3 superficies comparten la misma base de conocimiento. No puede existir un set de respuestas para el botón flotante, otro para las cards y un tercero para el website — todas responden desde la misma matriz de contenido (candidata natural: <code>FAQs_por_pais.xlsx</code>, ya en uso por Gali/Intercom).
                    </Callout>

                    <h4 style={subHeadingStyle}>POC HelpCenter Intercom</h4>
                    <p style={pStyle}>
                      Primer alcance de la experiencia de HelpCenter a través del botón flotante en plataforma. Busca que las consultas que el usuario haga por este canal estén estructuradas a partir de la base de conocimiento unificada de Dropi, garantizándole un acceso rápido al conocimiento necesario para avanzar en su ciclo de usabilidad sin depender de asistencia humana. Este POC será exitoso si los usuarios consultan la información y se autogestionan con facilidad, y si su satisfacción aumenta al encontrar respuesta a sus consultas más frecuentes.
                    </p>

                    <h4 style={subHeadingStyle}>POC Website</h4>
                    <p style={pStyle}>
                      Visualizador general del HelpCenter, cuyo objetivo es facilitarle la consulta a cualquier tipo de usuario de Dropi por fuera de la plataforma. Este acceso al conocimiento general, a través de una interfaz conversacional, busca mostrarle al usuario toda la información que requiera para avanzar en su activación dentro del ecosistema, además de resolver proactivamente fricciones relacionadas con logística, órdenes, gestión de productos o cualquier otra tipología de fricción. Este POC será exitoso si aumenta la tasa de activación, si se reduce el acompañamiento en los niveles 1 y 2 de SAC, y si la satisfacción del usuario aumenta.
                    </p>

                    <h4 style={subHeadingStyle}>POC GEO/AEO</h4>
                    <p style={pStyle}>
                      Cuando un usuario haga consultas sobre dropshipping o temas asociados al core estratégico de Dropi, el sistema proyectará respuestas que, además de favorecer la adquisición, faciliten el engagement con Dropi. El usuario podrá consultar cualquier elemento de la base de conocimiento y será guiado hacia el éxito dentro del ecosistema por Gemini, Claude o ChatGPT.
                    </p>

                    <h4 style={subHeadingStyle}>Dos dependencias técnicas críticas, ambas sin resolver</h4>
                    <ul style={ulStyle}>
                      <li><strong>Personalización por nivel de Leyendas Dropi:</strong> los presets de las superficies 1 y 2 deben leer el nivel actual del usuario. Pendiente con Tecnología (José Giraldo) y con Marlon (¿Gali/Intercom puede recibir esto como variable de contexto?).</li>
                      <li><strong>Detección de pantalla/sección:</strong> Dropi ya tiene Userpilot funcionando &quot;full&quot; en la plataforma (Laura Torres, Katerin Salazar) — hipótesis no confirmada: Userpilot resuelve la detección de pantalla, Gali/Intercom resuelve la conversación.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Capa de integraciones con agentes de IA</h4>
                    <p style={pStyle}>
                      Más allá de las 3 superficies, el proyecto contempla una capa de integración con los agentes de IA que ya conviven en la experiencia del cliente: <strong>Gali</strong> (IA de servicio al cliente), <strong>Danna</strong> (IA de Academy) y <strong>Sherlock</strong> (IA de producto que monitorea los grupos de WhatsApp). El objetivo de fondo es que el usuario sienta acompañamiento permanente a lo largo de todo su ciclo de usabilidad en la plataforma, impactando satisfacción, activación y generación de órdenes.
                    </p>

                    <h4 style={subHeadingStyle}>Capa de visualización y consumo</h4>
                    <p style={pStyle}>
                      Por donde el usuario interactúa con la base de conocimiento: el canal de WhatsApp de SAC, el botón flotante de Intercom, el website, los chats de IA (Claude, Gemini, ChatGPT) y un botón de ayuda en cada sección de la experiencia.
                    </p>

                    <h3 style={{ ...sectionHeadingStyle, marginTop: 20 }}><Wrench size={16} /><span>3. Arquitectura pensada para escalar al holding</span></h3>
                    <p style={pStyle}>
                      El <strong>alcance del V1</strong> es exclusivamente Dropi — nada implica pedirle contenido a ChateaPro/Atom/Roax/Estrellas/EcomScanner para el primer lanzamiento. El <strong>principio de diseño organizacional</strong> es que la arquitectura se diseña desde ya pensando en escala del holding, para que sumar un producto nuevo después sea extender, no reconstruir.
                    </p>
                  </div>
                )}

                {/* TAB 3 — GEO/AEO */}
                {tab === "geo" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Sparkles size={16} /><span>4. GEO/AEO — que Help Center alimente lo que recomiendan las IAs</span></h3>
                    <p style={pStyle}>
                      GEO (Generative Engine Optimization, a veces AEO) es la disciplina de optimizar para que un modelo de IA (ChatGPT, Perplexity, Gemini, Claude, Google AI Mode) <strong>mencione o cite la información</strong> dentro de la respuesta que redacta, a diferencia del SEO que optimiza para aparecer en una lista de resultados.
                    </p>
                    <p style={pStyle}>
                      No es un proyecto aparte — es la misma base de conocimiento (§2) construida con más disciplina de formato. El formato FAQ es el que más citan las IAs de todos los formatos de contenido (hasta <strong>81%</strong> de probabilidad de citación en estudios de la industria).
                    </p>

                    <h4 style={subHeadingStyle}>Qué mueve la aguja (2026)</h4>
                    <ul style={ulStyle}>
                      <li>Encabezados en formato de pregunta, respuesta directa de 40-60 palabras al inicio, listas/tablas/pasos numerados (2.5x más citación que párrafos corridos).</li>
                      <li>Autoría visible con credenciales (~60% más citaciones que contenido anónimo).</li>
                      <li>Frescura: contenido no actualizado trimestralmente tiene 3x más probabilidad de perder citaciones ya ganadas.</li>
                      <li>Estadísticas y citas atribuidas dentro del contenido (+30-40% de probabilidad de citación).</li>
                    </ul>
                    <Callout tone="warning" title="Lo que NO hace falta">
                      Google confirmó oficialmente en 2026 que no se necesita markup de schema.org especial ni un archivo <code>llms.txt</code> para aparecer en AI Overviews/AI Mode — lo que importa es HTML semántico bien estructurado. Implementar schema FAQPage/HowTo si es barato, pero no tratarlo como la palanca principal.
                    </Callout>

                    <h4 style={subHeadingStyle}>Plantilla estándar de contenido (un bloque por pregunta/artículo)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
                      <thead><tr><th style={tableHeaderStyle}>Campo</th><th style={tableHeaderStyle}>Regla</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}>Encabezado (H2)</td><td style={tableCellStyle}>La pregunta tal como la escribiría el usuario, en lenguaje natural.</td></tr>
                        <tr><td style={tableCellStyle}>Respuesta directa</td><td style={tableCellStyle}>40-60 palabras, texto plano, inmediatamente debajo del encabezado.</td></tr>
                        <tr><td style={tableCellStyle}>Contenido de soporte</td><td style={tableCellStyle}>Bullets, pasos numerados o tabla. Párrafos de máximo 2-4 líneas.</td></tr>
                        <tr><td style={tableCellStyle}>Autoría</td><td style={tableCellStyle}>Autor/revisor visible con su rol, no &quot;Equipo Dropi&quot; genérico.</td></tr>
                        <tr><td style={tableCellStyle}>Metadata</td><td style={tableCellStyle}>Categoría, País, Producto, Tags — mismo esquema que <code>FAQs_por_pais.xlsx</code>.</td></tr>
                      </tbody>
                    </table>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Cómo medirlo: 20-30 preguntas típicas probadas periódicamente en ChatGPT/Perplexity/Gemini/Claude/Google AI Mode, registrando si Dropi aparece mencionado (&quot;share of model&quot;). Mínimo 4-6 semanas de seguimiento. Dueño propuesto de la cadencia trimestral: Jose Hurtado.</p>
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
