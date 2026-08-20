"use client";

import { useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// Fuente: Promp/Documento de Seguimiento.md — tablero consolidado de los
// 6 proyectos de la Célula Experience (Rearquitectura, Órdenes, Dropi App,
// Búsqueda semántica, Dashboard de indicadores, TARS).

const PENDING = "Pendiente de definir";

type Proyecto = {
  slug: string;
  nombre: string;
  code: string | null;
  detailHref: string | null;
  objetivosMacro: { target: string; adopcion: string; retencion: string; satisfaccion: string };
  definicion: { descripcion: string; kickoff: string; excel: string; jira: string };
  equipo: { pm: string; ux: string; frontend: string; growth: string };
  documentacion: { research: string; blueprint: string; personas: string; flows: string; figmaV1: string; figmaV2: string };
  roadmap: { fase1: string; fase2: string; proximos: string };
  weekly: { semana: string; estado: string; resumen: string; retos: string };
  metricas: { metrica1: string; metrica2: string; comentarios: string };
};

const PROYECTOS: Proyecto[] = [
  {
    slug: "rearquitectura",
    nombre: "Rearquitectura",
    code: "DROP-25312",
    detailHref: "/proyectos/rearquitectura",
    objetivosMacro: {
      target: "Usuarios Dropi Core (Dropshippers, Proveedores, Marcas) — todos los países, incluye Marcas Blancas.",
      adopcion: PENDING,
      retencion: PENDING,
      satisfaccion: ">80% CSAT/SUS en encuestas post-implementación.",
    },
    definicion: {
      descripcion: "Ubicar cada pantalla dentro del módulo correspondiente para maximizar la descubribilidad y usabilidad de la plataforma, optimizando la navegación global sin alterar la lógica de negocio.",
      kickoff: "Proyectos E2E - Re-arquitectura.md",
      excel: PENDING,
      jira: PENDING,
    },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: {
      research: PENDING,
      blueprint: PENDING,
      personas: PENDING,
      flows: "Matriz de mapeo de pantallas viejas vs. nuevas (mencionada, archivo pendiente)",
      figmaV1: PENDING,
      figmaV2: "Prototipos navegables de alta fidelidad (mencionados, link pendiente)",
    },
    roadmap: {
      fase1: "Duplicación segura de pantallas, reorganización modular, tabs UI Kit v2.0.",
      fase2: "Telemetría, pruebas de usabilidad, arquitectura C4 N2-4 y PERT.",
      proximos: "Definir Estrategia de Comunicación con Marketing (hoy N/A).",
    },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: "Estrategia de Comunicación sin definir." },
    metricas: {
      metrica1: "Time-on-task — línea base pendiente vs. meta: reducción",
      metrica2: "CSAT/SUS — línea base pendiente vs. meta: >80%",
      comentarios: "Cero regresiones en producción (QA, smoke tests) como criterio adicional.",
    },
  },
  {
    slug: "dropi-app",
    nombre: "Dropi App",
    code: "DROP-25313",
    detailHref: "/proyectos/dropi-app",
    objetivosMacro: {
      target: "Usuarios de la Dropi App (Dropshippers, Marcas/Emprendedores en móvil).",
      adopcion: "Descargas iOS 22,486 · Android 73,686 (baseline 19 may 2026).",
      retencion: "Ratio DAU/Descargas ~3.6% (problema severo) — meta numérica pendiente.",
      satisfaccion: PENDING,
    },
    definicion: {
      descripcion: "De vitrina de descubrimiento (feed de video) a herramienta de gestión de negocio (modelo Shopify Mobile): métricas de ventas, push, búsqueda, gestión de órdenes.",
      kickoff: "Plan Estrategico_ Dropi App (2).md",
      excel: PENDING,
      jira: PENDING,
    },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: {
      fase1: "Descubrimiento de productos vía feed de video — completado.",
      fase2: "Novedades / gestión de negocio (ventas, push, búsqueda, órdenes) — en desarrollo.",
      proximos: "Definir fecha de cierre de Fase 2 y meta numérica del ratio DAU/Descargas.",
    },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: PENDING },
    metricas: {
      metrica1: "Ratio DAU/Descargas — línea base ~3.6% vs. meta pendiente",
      metrica2: "DAU total — línea base ~3,443 vs. meta pendiente",
      comentarios: "Solo ~4 de cada 100 usuarios que descargan regresan diariamente.",
    },
  },
  {
    slug: "ordenes",
    nombre: "Órdenes",
    code: "EXP-002",
    detailHref: "/proyectos/exp-002",
    objetivosMacro: { target: PENDING, adopcion: PENDING, retencion: PENDING, satisfaccion: PENDING },
    definicion: { descripcion: "Rediseño del módulo de órdenes.", kickoff: PENDING, excel: PENDING, jira: PENDING },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: { fase1: PENDING, fase2: PENDING, proximos: PENDING },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: PENDING },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
  {
    slug: "busqueda-semantica",
    nombre: "Búsqueda semántica",
    code: "EXP-003",
    detailHref: "/proyectos/exp-003",
    objetivosMacro: { target: PENDING, adopcion: PENDING, retencion: PENDING, satisfaccion: PENDING },
    definicion: { descripcion: PENDING, kickoff: PENDING, excel: PENDING, jira: PENDING },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: { fase1: PENDING, fase2: PENDING, proximos: PENDING },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: PENDING },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
  {
    slug: "dashboard-indicadores",
    nombre: "Dashboard de indicadores",
    code: "EXP-004",
    detailHref: "/proyectos/exp-004",
    objetivosMacro: { target: PENDING, adopcion: PENDING, retencion: PENDING, satisfaccion: PENDING },
    definicion: { descripcion: "Dashboard de datos / indicadores.", kickoff: PENDING, excel: PENDING, jira: PENDING },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: { fase1: PENDING, fase2: PENDING, proximos: PENDING },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: PENDING },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
  {
    slug: "tars",
    nombre: "TARS",
    code: null,
    detailHref: null,
    objetivosMacro: { target: PENDING, adopcion: PENDING, retencion: PENDING, satisfaccion: PENDING },
    definicion: { descripcion: PENDING, kickoff: PENDING, excel: PENDING, jira: PENDING },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: { fase1: PENDING, fase2: PENDING, proximos: PENDING },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: PENDING },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
];

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

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "22px 24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  marginBottom: 20,
};

const sectionHeading: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "var(--fg)",
  marginBottom: 14,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 6,
};

const body: React.CSSProperties = { fontSize: 13, lineHeight: 1.6, color: "var(--fg)" };

const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };

const td: React.CSSProperties = { textAlign: "left", padding: "10px", borderBottom: "1px solid var(--border)", verticalAlign: "top" };

const metric: React.CSSProperties = { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" };

function isPending(v: string) {
  return v === PENDING;
}

function Val({ children }: { children: string }) {
  return isPending(children) ? <span style={badgeStyle("#B45309", "#FFFBEB")}>{children}</span> : <>{children}</>;
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <div style={sectionHeading}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ term, children }: { term: string; children: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={label}>{term}</div>
      <div style={body}><Val>{children}</Val></div>
    </div>
  );
}

export default function SeguimientoPage() {
  const [activeSlug, setActiveSlug] = useState(PROYECTOS[0].slug);
  const p = PROYECTOS.find((x) => x.slug === activeSlug)!;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Seguimiento de Proyectos · Célula Experience"
        subtitle="Rearquitectura · Órdenes · Dropi App · Búsqueda semántica · Dashboard de indicadores · TARS"
        currentSlug="seguimiento"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/celula/experience"
            style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}
          >
            ← Volver a Célula Experience
          </a>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            🚀 Seguimiento de Proyectos
          </h1>
        </div>

        {/* Selector de proyecto */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {PROYECTOS.map((proj) => (
            <button
              key={proj.slug}
              onClick={() => setActiveSlug(proj.slug)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: 999,
                cursor: "pointer",
                border: proj.slug === activeSlug ? "1px solid var(--dropi)" : "1px solid var(--border)",
                background: proj.slug === activeSlug ? "var(--dropi)" : "#fff",
                color: proj.slug === activeSlug ? "#fff" : "var(--fg)",
              }}
            >
              {proj.nombre}
            </button>
          ))}
        </div>

        {/* Cabecera del proyecto activo */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Experience</span>
          {p.code ? (
            <span style={badgeStyle("#EA580C", "#FFEDD5")}>{p.code}</span>
          ) : (
            <span style={badgeStyle("#6B7280", "#F3F4F6")}>Aún no creado en Darwin</span>
          )}
          {p.detailHref && (
            <a href={p.detailHref} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
              Ver ficha completa del proyecto →
            </a>
          )}
        </div>

        <Section icon="🎯" title="Objetivos Macro">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field term="Target">{p.objetivosMacro.target}</Field>
            <Field term="Adopción">{p.objetivosMacro.adopcion}</Field>
            <Field term="Retención">{p.objetivosMacro.retencion}</Field>
            <Field term="Satisfacción (NPS/CSAT)">{p.objetivosMacro.satisfaccion}</Field>
          </div>
        </Section>

        <Section icon="📌" title="Definición del Proyecto">
          <Field term="Descripción">{p.definicion.descripcion}</Field>
          <div style={{ marginBottom: 6 }}>
            <div style={label}>Enlaces clave</div>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={{ ...td, fontWeight: 700, width: 260 }}>📄 Documento de Lanzamiento (Kickoff)</td>
                  <td style={td}><Val>{p.definicion.kickoff}</Val></td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700 }}>📊 Archivos / Hojas de Cálculo (Excel)</td>
                  <td style={td}><Val>{p.definicion.excel}</Val></td>
                </tr>
                <tr>
                  <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎫 Tarea principal o Épica en Jira</td>
                  <td style={{ ...td, borderBottom: "none" }}><Val>{p.definicion.jira}</Val></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon="👥" title="Equipo del Proyecto">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 220 }}>Product Manager (PM)</td>
                <td style={td}><Val>{p.equipo.pm}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>UX/UI Designer</td>
                <td style={td}><Val>{p.equipo.ux}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Frontend Developer</td>
                <td style={td}><Val>{p.equipo.frontend}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>Tecnología Growth</td>
                <td style={{ ...td, borderBottom: "none" }}><Val>{p.equipo.growth}</Val></td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section icon="📚" title="Documentación & Assets UX/UI">
          <table style={table}>
            <tbody>
              <tr>
                <td style={{ ...td, fontWeight: 700, width: 260 }}>🔬 Archivos de Research</td>
                <td style={td}><Val>{p.documentacion.research}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>📐 Service Blueprint</td>
                <td style={td}><Val>{p.documentacion.blueprint}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>👤 User Personas</td>
                <td style={td}><Val>{p.documentacion.personas}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>🔀 Flujos de usuario (User Flows)</td>
                <td style={td}><Val>{p.documentacion.flows}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>🎨 Figma v1.0 (Exploración)</td>
                <td style={td}><Val>{p.documentacion.figmaV1}</Val></td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderBottom: "none" }}>🎨 Figma v2.0 (Handoff / Producción)</td>
                <td style={{ ...td, borderBottom: "none" }}><Val>{p.documentacion.figmaV2}</Val></td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section icon="🗺️" title="Roadmap">
          <Field term="Fase 1 (MVP / Q1)">{p.roadmap.fase1}</Field>
          <Field term="Fase 2 (Escala / Q2)">{p.roadmap.fase2}</Field>
          <Field term="Próximos pasos inmediatos">{p.roadmap.proximos}</Field>
        </Section>

        <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <Field term="Semana del">{p.weekly.semana}</Field>
            <Field term="Estado general">{p.weekly.estado}</Field>
          </div>
          <Field term="Resumen de la semana">{p.weekly.resumen}</Field>
          <Field term="Retos y Bloqueos">{p.weekly.retos}</Field>
        </Section>

        <Section icon="📊" title="Métricas de Seguimiento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 1</div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}><Val>{p.metricas.metrica1}</Val></div>
            </div>
            <div style={metric}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Métrica 2</div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}><Val>{p.metricas.metrica2}</Val></div>
            </div>
          </div>
          <Field term="Comentarios de rendimiento">{p.metricas.comentarios}</Field>
        </Section>
      </main>

      <HubFooter />
    </div>
  );
}
