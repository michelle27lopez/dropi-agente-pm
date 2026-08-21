"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  ChevronDown, ChevronUp, FileText, Rocket, Layers,
  Users, ExternalLink, Wrench, GitBranch, Search, Sparkles,
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

function StatusPill({ tone, children }: { tone: "ok" | "warn" | "bad"; children: React.ReactNode }) {
  const map = {
    ok: { fg: "#166534", bg: "#DCFCE7" },
    warn: { fg: "#B45309", bg: "#FEF3C7" },
    bad: { fg: "#B42318", bg: "#FEE4E2" },
  }[tone];
  return <span style={{ ...badgeStyle(map.fg, map.bg), marginRight: 8 }}>{children}</span>;
}

const links = [
  { label: "Documento de referencia técnico", href: "https://claude.ai/code/artifact/e27b2d8c-be66-4e0a-8783-2417e4268b44", icon: FileText, desc: "11 secciones: kick-off, las 3 superficies, arquitectura de escala, GEO/AEO, insumos de datos, narrativa, 7 historias de usuario con QA." },
];

export default function Gro004ProjectPage() {
  const [docOpen, setDocOpen] = useState(true);
  const [tab, setTab] = useState("resumen");

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="GRO-004 · HelpCenter / Biblia IA"
        subtitle="Célula Growth · PM: José Pineda"
        currentSlug="gro-004"
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
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>PM / Owner</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Pineda</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Co-responsable</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Laura Núñez (SAC)</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Product Designer</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Sin asignar</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "CSAT Chile vs. meta", value: "~0.30–0.40", sub: "meta 0.75 — señal de presión sobre SAC que Help Center busca aliviar", color: "#B42318" },
            { label: "Historias de usuario con QA", value: "7", sub: "US-HC-01 a 07, verificadas con navegación interactiva real", color: "var(--dropi)" },
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
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E3F3F0", color: "#0E7C74", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
          <div style={{ background: "#FFFBEB", border: "1px dashed #FDE68A", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", color: "#92400E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Rocket size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>Prototipo vibecodeado (superficie WebSite)</div>
              <div style={{ fontSize: 12, color: "#78350F", marginTop: 3, lineHeight: 1.5 }}>Existe y tiene QA completa (7 HU) — falta que José confirme la URL para enlazarlo aquí.</div>
            </div>
          </div>
        </div>

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
                  <span style={badgeStyle("#0E7C74", "#E3F3F0")}>Fuente: documento de referencia, agosto 2026</span>
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
                    { id: "beta", label: "🛠️ 7. Beta técnica & QA" },
                    { id: "pendientes", label: "🔀 8-9. Pendientes & equipo" },
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
                        <tr><td style={tableCellStyle}>Owner / PM</td><td style={tableCellStyle}>José Pineda (Growth)</td></tr>
                        <tr><td style={tableCellStyle}>Co-responsable</td><td style={tableCellStyle}><strong>Laura Núñez</strong> — líder de Servicio al Cliente. El proyecto nace de su equipo.</td></tr>
                        <tr><td style={tableCellStyle}>Product Designer</td><td style={tableCellStyle}>Sin asignar todavía</td></tr>
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

                    <h4 style={subHeadingStyle}>Dos dependencias técnicas críticas, ambas sin resolver</h4>
                    <ul style={ulStyle}>
                      <li><strong>Personalización por nivel de Leyendas Dropi:</strong> los presets de las superficies 1 y 2 deben leer el nivel actual del usuario. Pendiente con Tecnología (José Giraldo) y con Marlon (¿Gali/Intercom puede recibir esto como variable de contexto?).</li>
                      <li><strong>Detección de pantalla/sección:</strong> Dropi ya tiene Userpilot funcionando &quot;full&quot; en la plataforma (Laura Torres, Katerin Salazar) — hipótesis no confirmada: Userpilot resuelve la detección de pantalla, Gali/Intercom resuelve la conversación.</li>
                    </ul>

                    <h3 style={{ ...sectionHeadingStyle, marginTop: 20 }}><Wrench size={16} /><span>3. Arquitectura pensada para escalar al holding</span></h3>
                    <p style={pStyle}>
                      El <strong>alcance del V1</strong> es exclusivamente Dropi — nada implica pedirle contenido a ChateaPro/Atom/Roax/Estrellas/EcomScanner para el primer lanzamiento. El <strong>principio de diseño organizacional</strong> es que la arquitectura se diseña desde ya pensando en escala del holding, para que sumar un producto nuevo después sea extender, no reconstruir.
                    </p>
                    <h4 style={subHeadingStyle}>5 decisiones a tomar durante el diseño del V1 (costo bajo ahora, alto después)</h4>
                    <ul style={ulStyle}>
                      <li>Esquema de datos con dimensión &quot;Producto&quot; desde el día 1, aunque hoy solo tenga el valor &quot;Dropi&quot;.</li>
                      <li>La segmentación Seller/Supplier/Brand se modela como &quot;roles dentro de Dropi&quot;, no como el modelo general de segmentación.</li>
                      <li>Naming del proyecto y de la superficie WebSite: ¿&quot;Dropi Help Center&quot; o algo neutral a nivel holding?</li>
                      <li>Estructura de navegación: ¿nivel superior &quot;Producto → Segmento&quot; desde ya?</li>
                      <li>Conversación liviana con Marlon (no bloqueante): ¿Intercom/Gali podría enrutar por producto sin rediseño completo?</li>
                    </ul>
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

                {/* TAB 4 — BETA TÉCNICA & QA */}
                {tab === "beta" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Search size={16} /><span>7. Historias de Usuario — reverse-engineered desde el prototipo</span></h3>
                    <p style={pStyle}>
                      El prototipo de la superficie WebSite se construyó primero; estas historias documentan lo que ya hace, verificado con navegación interactiva real (clics reales, no solo lectura estática). Nomenclatura <code>US-HC-XX</code>, para no colisionar con <code>US-LND-XX</code>/<code>US-PLAT-XX</code> de Leyendas Dropi.
                    </p>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Historia</th><th style={tableHeaderStyle}>Estado</th><th style={tableHeaderStyle}>Hallazgo</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>US-HC-01</strong><br />Landing del Centro de Ayuda</td><td style={tableCellStyle}><StatusPill tone="ok">✅ implementado</StatusPill></td><td style={tableCellStyle}>Coincide con el brief. Falta contenido real de producción.</td></tr>
                        <tr><td style={tableCellStyle}><strong>US-HC-02</strong><br />Selector de segmento</td><td style={tableCellStyle}><StatusPill tone="warn">🟡 1 inconsistencia</StatusPill></td><td style={tableCellStyle}>Vendedor (segmento por defecto) no muestra su propia descripción, a diferencia de Proveedor y Marca.</td></tr>
                        <tr><td style={tableCellStyle}><strong>US-HC-03</strong><br />Navegación por categoría</td><td style={tableCellStyle}><StatusPill tone="ok">✅ implementado y probado</StatusPill></td><td style={tableCellStyle}>&quot;Garantías y devoluciones&quot; (13 preguntas) coincide con <code>FAQs_por_pais.xlsx</code>. La parte más sólida.</td></tr>
                        <tr><td style={tableCellStyle}><strong>US-HC-04</strong><br />Conversación con Gali</td><td style={tableCellStyle}><StatusPill tone="bad">🔴 bug confirmado</StatusPill></td><td style={tableCellStyle}>Pregunta libre que no coincide con un acceso rápido devuelve respuesta incorrecta — sin matching semántico real todavía.</td></tr>
                        <tr><td style={tableCellStyle}><strong>US-HC-05</strong><br />Respuesta enriquecida + feedback</td><td style={tableCellStyle}><StatusPill tone="warn">🟡 gap real (CA6)</StatusPill></td><td style={tableCellStyle}>&quot;No&quot; en el feedback muestra solo texto, sin botón/enlace real a soporte — ver alerta narrativa arriba.</td></tr>
                        <tr><td style={tableCellStyle}><strong>US-HC-06</strong><br />Puente artículo → Gali/Academy</td><td style={tableCellStyle}><StatusPill tone="ok">✅ verificado</StatusPill></td><td style={tableCellStyle}>&quot;Profundizar con Gali&quot; funciona de verdad, no es decorativo.</td></tr>
                        <tr><td style={tableCellStyle}><strong>US-HC-07</strong><br />Footer legal/soporte</td><td style={tableCellStyle}><StatusPill tone="bad">🔴 no implementado</StatusPill></td><td style={tableCellStyle}>Los 4 enlaces apuntan al mismo placeholder — depende de contenido de otras áreas (Legal, Academy, Tecnología).</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Bugs/gaps a resolver, en orden de prioridad</h4>
                    <ul style={ulStyle}>
                      <li>🔴 Matching de texto libre en el buscador (US-HC-04) — depende de integración real con Gali.</li>
                      <li>🟡 Feedback negativo sin acción real (US-HC-05) — subido de prioridad por la narrativa de marca.</li>
                      <li>🟡 Segmento &quot;Vendedor&quot; sin descripción (US-HC-02).</li>
                      <li>🔴 Enlaces del footer sin destino real (US-HC-07) — depende de contenido de otras áreas.</li>
                    </ul>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>No tocar, ya funciona bien: landing con buscador y accesos rápidos, selector de segmento con estado &quot;Próximamente&quot;, navegación por categoría con acordeón, respuestas enriquecidas de Gali, puente &quot;Profundizar con Gali&quot;.</p>
                  </div>
                )}

                {/* TAB 5 — PENDIENTES & EQUIPO */}
                {tab === "pendientes" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><GitBranch size={16} /><span>8. Conexión con Leyendas Dropi</span></h3>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>Ambos proyectos son de José, con alcance, stakeholders y objetivos distintos — se documentan por separado, esto registra solo los puntos donde legítimamente se tocan.</p>
                    <ul style={ulStyle}>
                      <li><strong>Matriz de FAQ compartida:</strong> el contenido de FAQ de Leyendas Dropi se piensa como una categoría dentro de la misma matriz que usa Gali/Help Center.</li>
                      <li><strong>Personalización por nivel de Leyendas Dropi:</strong> el botón flotante y las cards deben poder leer el nivel del usuario — dependencia técnica real, no solo conceptual.</li>
                      <li><strong>Misma base de conocimiento:</strong> gobernanza de la matriz — dueño propuesto Jose Hurtado (Customer Success), sin confirmar todavía.</li>
                    </ul>

                    <h3 style={{ ...sectionHeadingStyle, marginTop: 20 }}><Users size={16} /><span>9. Pendientes</span></h3>
                    <ul style={ulStyle}>
                      <li>Kick-off formal del proyecto con Laura Núñez (Painpoint 2, usuarios implicados, AS-IS completo, objetivos/OKR propios) — sin fecha fija.</li>
                      <li>Validar con Marlon: esquema real de ingesta de Gali, vigencia de los insumos, bandeja de triage para Leyendas Dropi, viabilidad de exponer el nivel como variable de personalización.</li>
                      <li>Validar con Tecnología (José Giraldo): viabilidad de que Intercom/Gali (o Userpilot) consuma el nivel de Leyendas Dropi en tiempo real o batch.</li>
                      <li>Hablar con Katerin y Laura Torres: ¿Userpilot puede segmentar por nivel de Leyendas Dropi y país? ¿Se integra con Gali para abrir el chat desde una card?</li>
                      <li>Asignar Product Designer del proyecto.</li>
                      <li>Definir técnicamente cómo se implementa la base de conocimiento compartida entre las 3 superficies.</li>
                      <li>Confirmar con Jose Hurtado si acepta el rol de dueño de mantener vigente la matriz de FAQ.</li>
                      <li>Resolver, en orden de prioridad, los 4 bugs/gaps del prototipo (ver pestaña Beta técnica).</li>
                    </ul>

                    <Callout tone="success" title="📌 Insumos de datos reales recibidos de Laura Núñez (SAC)">
                      <code>FAQs_por_pais.xlsx</code> — matriz real que usa hoy SAC, una hoja por país (Colombia, Chile, Argentina, México, Paraguay, Panamá, Guatemala, Ecuador, Perú) + hoja &quot;Proveedores&quot;. Esquema: Pregunta | Respuesta | Categoría | País | Tags | Variaciones | Intención/Bandeja | Resultado. Calidad no 100% consistente entre hojas — buen indicio de estructura, no plantilla perfecta para copiar tal cual.<br /><br />
                      <code>Intercom_Calificaciones_Negativas_por_Bandejas.xlsx</code> — calificaciones negativas por bandeja/mes/país (abr–jun 2026) + CSAT (Meta vs. Resultado) para Chile. Uso principal: priorización.
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
