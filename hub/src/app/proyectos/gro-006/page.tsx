"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import ProjectWeekly, { type ProjectUpdate } from "@/components/ProjectWeekly";
import {
  ChevronDown, ChevronUp, FileText, Layers,
  Users, GitBranch, Map, Sparkles,
} from "lucide-react";

/* ── Shared styles (mismos tokens que gro-001 / gro-002 / gro-004) ── */
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

export default function Gro006ProjectPage() {
  const [docOpen, setDocOpen] = useState(true);
  const [tab, setTab] = useState("resumen");
  const [pocs, setPocs] = useState<PocChild[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);

  useEffect(() => {
    fetch("/api/proyectos/gro-006")
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
        title="GRO-006 · Perfil de Líderes de Comunidad"
        subtitle="José Pineda · Growth Product Manager"
        currentSlug="gro-006"
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
                <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🤝 Complementario a Webe</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                Perfil de Líderes de Comunidad
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 760 }}>
                Una experiencia dedicada dentro de Dropi para que el líder de comunidad opere y entienda el comportamiento de su comunidad, con un toggle para alternar entre su cuenta de Dropshipper y su cuenta de Líder.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Growth Product Manager</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Pineda</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Equipo comercial</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Gabriela y Daniel Lombo</div>
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
            { label: "Fase actual", value: "Levantamiento", sub: "recopilando experiencia del líder con el equipo comercial", color: "#0E7C74" },
            { label: "Compromiso con comercial", value: "9 sept 2026", sub: "entrega de prototipos de fidelidad media", color: "var(--dropi)" },
            { label: "Segmento", value: "Líder de comunidad", sub: "usuario con cuenta de Dropshipper y rol de Líder simultáneo", color: "#7C3AED" },
            { label: "Complementario a", value: "Webe", sub: "Webe dinamiza la comunidad; este proyecto mide su performance de dropshipping", color: "#C2410C" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
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

        {/* ── Estado narrativo ── */}
        <Callout tone="info" title="📌 Arranque del proyecto (28 ago 2026)">
          Esta semana el equipo hizo un levantamiento de necesidades con el equipo comercial (<strong>Gabriela</strong> y <strong>Daniel Lombo</strong>) para entender la experiencia que hoy vive el líder de comunidad. Con ese insumo definimos la estrategia de abordaje: recopilar información, prototipar en baja fidelidad, validar y priorizar con el usuario. El compromiso adquirido con el equipo comercial es tener prototipos de fidelidad media listos el <strong>9 de septiembre</strong>.
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
                  <span style={badgeStyle("#0E7C74", "#E3F3F0")}>Fuente: levantamiento con equipo comercial, agosto 2026</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Objetivo, alcance de features, relación con Webe y con el CRM de Líderes (GRO-001), y la estrategia de abordaje.
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
                    { id: "resumen", label: "🧠 Resumen & objetivo" },
                    { id: "alcance", label: "🧩 Alcance & features" },
                    { id: "relacion", label: "🔗 Relación con Webe y GRO-001" },
                    { id: "estrategia", label: "🗺️ Estrategia & próximos pasos" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#0E7C74" : "#ffffff", color: tab === t.id ? "#ffffff" : "#475569", border: tab === t.id ? "1px solid #0E7C74" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — RESUMEN & OBJETIVO */}
                {tab === "resumen" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Sparkles size={16} /><span>Resumen ejecutivo</span></h3>
                    <p style={pStyle}>
                      El proyecto busca darle al líder de comunidad una experiencia diseñada a su medida dentro de Dropi, tanto para operar su día a día como para analizar el comportamiento de su comunidad. Nace de una necesidad concreta: hoy el equipo comercial (Gabriela) construye manualmente los dashboards que le entrega al líder, sin que exista una experiencia propia dentro de la plataforma.
                    </p>

                    <h4 style={subHeadingStyle}>Por qué existe</h4>
                    <p style={pStyle}>
                      El líder de comunidad convive hoy con dos identidades dentro de Dropi: su propia operación como Dropshipper y su rol como cabeza de una comunidad de afiliados. La plataforma no distingue entre ambas — no hay una vista que le muestre cómo le está yendo a su comunidad en términos de comportamiento de dropshipping (activación, recurrencia, volumen de órdenes de sus afiliados), que es información alineada al core transaccional de Dropi en comercio electrónico.
                    </p>

                    <h4 style={subHeadingStyle}>Propósito</h4>
                    <p style={pStyle}>
                      Habilitarle al líder información de valor sobre el desempeño de su comunidad, inspirada en los dashboards que hoy construye manualmente el equipo comercial, pero nativa de la plataforma y sostenible en el tiempo.
                    </p>

                    <h4 style={subHeadingStyle}>Origen</h4>
                    <p style={pStyle}>
                      Esta semana el equipo realizó un levantamiento de necesidades con el equipo comercial (Gabriela y Daniel Lombo) para entender la experiencia que hoy vive el líder y qué información le resulta valiosa.
                    </p>
                  </div>
                )}

                {/* TAB 2 — ALCANCE & FEATURES */}
                {tab === "alcance" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Layers size={16} /><span>Features contempladas</span></h3>
                    <p style={pStyle}>
                      El proyecto aborda distintos frentes de la experiencia del líder, todavía por detallar en el prototipo de baja fidelidad:
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                      <thead><tr><th style={tableHeaderStyle}>Frente</th><th style={tableHeaderStyle}>Qué cubre</th></tr></thead>
                      <tbody>
                        <tr><td style={tableCellStyle}><strong>Home</strong></td><td style={tableCellStyle}>Punto de entrada a la experiencia de líder — por definir en el prototipo.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Dashboard</strong></td><td style={tableCellStyle}>Comportamiento de la comunidad a nivel de dropshipping, inspirado en los dashboards que hoy arma el equipo comercial.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Referidos</strong></td><td style={tableCellStyle}>Gestión y visibilidad de la red de afiliados/referidos del líder.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Wallet</strong></td><td style={tableCellStyle}>Visibilidad financiera asociada a la operación de la comunidad.</td></tr>
                        <tr><td style={tableCellStyle}><strong>Entre otros</strong></td><td style={tableCellStyle}>Alcance abierto — se termina de definir con el levantamiento de necesidades y el prototipo de baja fidelidad.</td></tr>
                      </tbody>
                    </table>

                    <h4 style={subHeadingStyle}>Toggle Dropshipper / Líder de comunidad</h4>
                    <p style={pStyle}>
                      El usuario podrá alternar, dentro de la misma cuenta, entre su vista como Dropshipper (su propia operación) y su vista como Líder de comunidad (el desempeño de su comunidad). Es la pieza de navegación central del proyecto: reconoce que ambas identidades conviven en la misma persona y las separa sin obligar a manejar dos cuentas distintas.
                    </p>

                    <h4 style={subHeadingStyle}>POC — Perfil de Líder de Comunidad</h4>
                    <p style={pStyle}>
                      Portal donde el líder de comunidad puede ver la información de su comunidad organizada, con claridad sobre la caracterización y el desempeño de los dropshippers asociados a ella. El POC busca otorgarle al líder un perfil alterno, y mediremos si su performance presenta variación frente al de líderes que no cuentan con este tipo de vistas. Se activará una vez que la arquitectura de información y la experiencia del líder queden definidas en conjunto con el equipo comercial.
                    </p>
                    <p style={{ ...pStyle, fontSize: 12, color: "#64748B" }}>
                      Desde Producto y Growth planteamos que este POC puede validar si este tipo de vistas genera un impacto positivo en los indicadores de negocio de activación y generación de órdenes.
                    </p>
                  </div>
                )}

                {/* TAB 3 — RELACIÓN CON WEBE Y GRO-001 */}
                {tab === "relacion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><GitBranch size={16} /><span>Complementario a Webe, no un competidor</span></h3>
                    <p style={pStyle}>
                      Webe es la herramienta que ayuda al líder a dinamizar y gestionar su comunidad como sistema de community management. Este proyecto no reemplaza esa función: mantiene dentro del ecosistema Dropi, exclusivamente, el <strong>performance de la comunidad a nivel de comportamiento de dropshipping</strong> — la información de negocio que hoy solo vive en dashboards manuales del equipo comercial.
                    </p>

                    <h4 style={subHeadingStyle}>Distinción con GRO-001 (CRM de Líderes de Comunidad)</h4>
                    <p style={pStyle}>
                      GRO-001 es una herramienta de CRM (Go High Level) para que el líder gestione su relación con cada afiliado individual, hoy en pausa mientras se resuelve su complementariedad con Webe. Este proyecto (GRO-006) es distinto: es la experiencia de perfil y analítica que el propio líder consume dentro de Dropi, no una herramienta de gestión de relación con sus afiliados. Ambos proyectos comparten segmento de usuario (el líder de comunidad) y, esta semana, los mismos interlocutores comerciales (Gabriela y Daniel Lombo).
                    </p>

                    <Callout tone="warning" title="❓ Pregunta abierta — a confirmar con el equipo">
                      GRO-001 documenta una reunión de service blueprint con Laura Contreras, Gabriela y Daniel Lombo. El levantamiento de necesidades de esta semana para GRO-006 involucra a los mismos dos últimos. Falta confirmar si se trata del mismo espacio de trabajo visto desde dos ángulos, o de dos levantamientos independientes — para no duplicar esfuerzo con el equipo comercial.
                    </Callout>
                  </div>
                )}

                {/* TAB 4 — ESTRATEGIA & PRÓXIMOS PASOS */}
                {tab === "estrategia" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Map size={16} /><span>Estrategia de abordaje — 3 pasos</span></h3>
                    <ul style={ulStyle}>
                      <li><strong>1. Recopilar información</strong> — levantar la experiencia del cliente líder junto con el equipo comercial.</li>
                      <li><strong>2. Prototipar en baja fidelidad</strong> — aterrizar la experiencia para validarla con el equipo comercial y definir un estilo de prueba que se pueda mostrar directamente a los líderes.</li>
                      <li><strong>3. Validar y priorizar con el usuario</strong> — confirmar con el líder y priorizar junto a él para poder fasear el proyecto.</li>
                    </ul>

                    <h4 style={subHeadingStyle}>Compromiso con el equipo comercial</h4>
                    <p style={pStyle}>
                      Fecha comprometida: <strong>9 de septiembre de 2026</strong>, con prototipos de fidelidad media listos para mostrar.
                    </p>

                    <h3 style={{ ...sectionHeadingStyle, marginTop: 20 }}><Users size={16} /><span>Pendientes</span></h3>
                    <ul style={ulStyle}>
                      <li>Cerrar el levantamiento de necesidades con Gabriela y Daniel Lombo.</li>
                      <li>Confirmar si el levantamiento de esta semana es el mismo espacio de trabajo que el service blueprint documentado en GRO-001, o uno independiente.</li>
                      <li>Asignar Product Designer al proyecto.</li>
                      <li>Definir el alcance final de features más allá de Home, Dashboard y Referidos.</li>
                      <li>Construir el prototipo de baja fidelidad (paso 2 de la estrategia).</li>
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
