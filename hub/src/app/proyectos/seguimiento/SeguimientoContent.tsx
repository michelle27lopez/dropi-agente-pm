"use client";

import { useState } from "react";
import WeeklySelector from "./WeeklySelector";
import RoadmapGantt, { type GanttFase } from "./RoadmapGantt";

// Fuente: Promp/Documento de Seguimiento.md — tablero consolidado de los
// 6 proyectos de la Célula Design Ops (Rearquitectura, Órdenes, Dropi App,
// Búsqueda semántica, Dashboard de indicadores, TARS).
//
// Componente compartido: lo usa tanto proyectos/seguimiento/page.tsx (página
// standalone) como celula/[slug]/page.tsx (home de la célula Design Ops) —
// así el archivo protegido por CODEOWNERS solo necesita un import + un if.

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
  ganttFases?: GanttFase[];
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
    ganttFases: [
      { nombre: "Fase 1 (MVP / Q1)", estado: "completada", inicio: "2026-07", fin: "2026-07", detalle: "Duplicación segura de pantallas, reorganización modular, tabs UI Kit v2.0." },
      { nombre: "Fase 2 (Escala / Q2)", estado: "en-curso", inicio: "2026-08", fin: "2026-09", detalle: "Telemetría, pruebas de usabilidad, arquitectura C4 N2-4 y PERT. En curso: QA en integración con proveedores." },
      { nombre: "Próximos pasos inmediatos", estado: "bloqueada", inicio: "2026-09", fin: "2026-10", detalle: "Definir Estrategia de Comunicación con Marketing.", bloqueo: "Estrategia de Comunicación sin definir" },
    ],
    weekly: { semana: PENDING, estado: PENDING, resumen: "Prioridad P0 · Delivery en QA. Métricas de bugs — Frente 1: 66 corregidos / 9 pendientes (1 crítico); Frente 2: 64 corregidos / 7 pendientes (1 crítico); total consolidado: 130 corregidos / 16 pendientes (solo 2 críticos). Próximos pasos: la próxima semana se espera ejecutar la fase de pruebas.", retos: "2 bugs críticos pendientes (1 por frente) antes de poder cerrar QA. Estrategia de Comunicación sin definir." },
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
    equipo: { pm: "Diana Aldana", ux: "Kevin Paternina", frontend: "Martin Gonzales", growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: {
      fase1: "Gestión de Novedades: implementación y centralización de la gestión de novedades para optimizar la operativa inicial.",
      fase2: "Búsqueda Avanzada: motor de búsqueda clásica (texto/palabras clave), búsqueda por ID para acceso directo, y búsqueda potenciada con Inteligencia Artificial para mejorar la relevancia de los resultados.",
      proximos: "Fase 3 — Escalamiento y Feed: soporte e infraestructura para arquitectura Multipaís, y diseño e implementación del nuevo Feed de experiencia.",
    },
    ganttFases: [
      { nombre: "Fase 1: Gestión de Novedades", estado: "completada", inicio: "2025-11", fin: "2025-11", detalle: "Implementación y centralización de la gestión de novedades. Entregada en noviembre de 2025." },
      { nombre: "Fase 2: Búsqueda Avanzada", estado: "proxima", inicio: "2026-10", fin: "2026-11", detalle: "Motor de búsqueda clásica, búsqueda por ID y búsqueda potenciada con IA." },
      { nombre: "Fase 3: Escalamiento y Feed", estado: "proxima", inicio: "2026-11", fin: "2026-12", detalle: "Arquitectura Multipaís y nuevo Feed de experiencia." },
    ],
    weekly: { semana: PENDING, estado: PENDING, resumen: "Prioridad P2 · Delivery en QA. Pruebas activas por el equipo de Tecnología, pruebas en curso con Coordinadora (última fase para liberación) y pruebas internas habilitadas en TestFlight.", retos: PENDING },
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
    detailHref: "/proyectos/ordenes",
    objetivosMacro: { target: PENDING, adopcion: PENDING, retencion: PENDING, satisfaccion: PENDING },
    definicion: { descripcion: "Rediseño del módulo de órdenes.", kickoff: PENDING, excel: PENDING, jira: PENDING },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: {
      fase1: "MVP Órdenes 2.0: importación, exportación, etiquetas y optimización de creación manual de órdenes (ver detalle completo en la ficha del proyecto).",
      fase2: "Implementación de filtros, tabs de estados y rediseño de las tablas y cards donde se visualizan los pedidos.",
      proximos: "Fase 3 — Proveedores: ajustes de órdenes de proveedores (ver detalle completo en la ficha del proyecto).",
    },
    ganttFases: [
      { nombre: "Fase 1 · MVP Órdenes 2.0", estado: "bloqueada", inicio: "2026-06", fin: "2026-09", detalle: "Importación, exportación, etiquetas y creación manual de órdenes. Mapeada desde junio 2026, handoff a desarrollo el 2 de julio de 2026; piloto de seguimiento de 12 semanas bloqueado hasta contar con recurso de Tecnología.", href: "/proyectos/ordenes/fase-1", bloqueo: "Bloqueado hasta contar con recurso de Tecnología" },
      { nombre: "Fase 2", estado: "proxima", inicio: "2026-10", fin: "2026-11", detalle: "Filtros, tabs de estados y rediseño de tablas y cards de pedidos. En definición.", href: "/proyectos/ordenes/fase-2" },
      { nombre: "Fase 3 · Proveedores", estado: "proxima", inicio: "2026-11", fin: "2026-12", detalle: "Ajustes de órdenes de proveedores.", href: "/proyectos/ordenes/fase-3" },
    ],
    weekly: { semana: PENDING, estado: PENDING, resumen: "Prioridad P1 · Delivery en DEV. Pendiente: pruebas del módulo de etiquetas. Se realizará un research con proveedores para validar las funcionalidades que quieren ver en el módulo de Órdenes.", retos: "🚨 Bloqueado por falta de asignación de un desarrollador." },
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
    weekly: { semana: PENDING, estado: PENDING, resumen: "Sin novedades de seguimiento en el periodo. Se programará una reunión para presentar el informe de estado y definir la hoja de ruta de las siguientes fases.", retos: PENDING },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
  {
    slug: "dashboard-indicadores",
    nombre: "Dashboard de indicadores",
    code: "EXP-004",
    detailHref: "/proyectos/exp-004",
    objetivosMacro: {
      target: "Proveedores, Marcas y Marcas Blancas activas en Colombia.",
      adopcion: "Tasa de adopción diaria (Page View en */dashboard) — línea base pendiente.",
      retencion: "Curva de retención (Día 0 vs. Día N) estabilizada por encima del 50% en días consecutivos.",
      satisfaccion: "Encuesta in-app: \"Como esperaba\" o mejor = Satisfecho — meta numérica pendiente.",
    },
    definicion: {
      descripcion: "Centralizar en una sola vista las métricas clave de la operación (recaudo, volumen, efectividad y tendencia) para Proveedor, Marca y Marca Blanca, como centro de mando al iniciar sesión.",
      kickoff: "Lanzamiento Dashboard Indicadores.md / Pitch dashboard.md (carpeta Experience)",
      excel: PENDING,
      jira: "DROP-10451",
    },
    equipo: { pm: "Diana Aldana", ux: "Catalina Giraldo", frontend: PENDING, growth: "Miguel Ángel Gutiérrez (Data) · Laura Torres (Comunicación)" },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: {
      fase1: "Piloto Beta con usuarios seleccionados, en curso desde noviembre de 2025.",
      fase2: PENDING,
      proximos: "Lanzamiento general — fecha posible: 8 de septiembre de 2026 (sujeta a confirmación).",
    },
    ganttFases: [
      { nombre: "Piloto Beta (usuarios seleccionados)", estado: "en-curso", inicio: "2025-11", fin: "2026-08", detalle: "Dashboard v2.0 en beta controlada con usuarios seleccionados de Proveedor, Marca y Marca Blanca desde noviembre de 2025.", href: "/proyectos/exp-004" },
      { nombre: "Lanzamiento General", estado: "proxima", inicio: "2026-09", fin: "2026-09", detalle: "Lanzamiento general a todos los perfiles activos en Colombia. Fecha posible: 8 de septiembre de 2026.", href: "/proyectos/exp-004" },
    ],
    weekly: { semana: PENDING, estado: PENDING, resumen: "Sin novedades de seguimiento en el periodo. Pendiente sesión de trabajo para conciliar y acordar la atención de los ajustes reportados en QA.", retos: "Fecha de lanzamiento a producción sin confirmar; pendiente sesión de trabajo para acordar los ajustes de QA reportados." },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
  {
    slug: "tars",
    nombre: "TARS",
    code: null,
    detailHref: "http://localhost:8081/tars_dashboard/index.html",
    objetivosMacro: { target: PENDING, adopcion: PENDING, retencion: PENDING, satisfaccion: PENDING },
    definicion: { descripcion: PENDING, kickoff: PENDING, excel: PENDING, jira: PENDING },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: { fase1: PENDING, fase2: PENDING, proximos: PENDING },
    weekly: { semana: PENDING, estado: PENDING, resumen: PENDING, retos: PENDING },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
  {
    slug: "dropi-testers",
    nombre: "Dropi Testers",
    code: "EXP-006",
    detailHref: "/proyectos/dropi-testers",
    objetivosMacro: {
      target: "Usuarios interesados en ser testers de Dropi, captados en el marco de ExpoWinner.",
      adopcion: PENDING,
      retencion: PENDING,
      satisfaccion: PENDING,
    },
    definicion: {
      descripcion: "MVP enfocado únicamente en capturar usuarios interesados en ser testers de Dropi, de cara a ExpoWinner.",
      kickoff: PENDING,
      excel: PENDING,
      jira: PENDING,
    },
    equipo: { pm: "Diana Aldana", ux: PENDING, frontend: PENDING, growth: PENDING },
    documentacion: { research: PENDING, blueprint: PENDING, personas: PENDING, flows: PENDING, figmaV1: PENDING, figmaV2: PENDING },
    roadmap: {
      fase1: PENDING,
      fase2: PENDING,
      proximos: "MVP captura de testers (ExpoWinner) — bloqueado por falta de desarrollador asignado.",
    },
    ganttFases: [
      { nombre: "MVP captura de testers (ExpoWinner)", estado: "bloqueada", inicio: "2026-08", fin: "2026-09", detalle: "Versión MVP enfocada únicamente en capturar usuarios interesados en ser testers de Dropi. Bloqueado hasta contar con un desarrollador asignado.", href: "/proyectos/dropi-testers", bloqueo: "Bloqueado — sin desarrollador asignado" },
    ],
    weekly: { semana: PENDING, estado: PENDING, resumen: "Prioridad Despriorizado · Delivery en DEV. Estrategia MVP: se lanzará una versión enfocada únicamente en capturar usuarios interesados en ser testers, de cara a ExpoWinner.", retos: "🚨 Bloqueado por falta de desarrollador asignado." },
    metricas: { metrica1: PENDING, metrica2: PENDING, comentarios: PENDING },
  },
];

// ── Sistema visual ──────────────────────────────────────────────────────────
// Cada sección tiene un tono de color propio (acento + chip de icono) para
// que el ojo pueda escanear "qué tipo de información es esto" antes de leer
// el texto. Los tonos son sobrios (fondos muy claros, texto saturado) para
// no competir entre secciones ni con el naranja de marca (Roadmap).

type Tone = { accent: string; bg: string; fg: string };
const TONES = {
  violet: { accent: "#7C3AED", bg: "#F5F3FF", fg: "#6D28D9" },
  blue: { accent: "#2563EB", bg: "#EFF6FF", fg: "#1D4ED8" },
  slate: { accent: "#475569", bg: "#F1F5F9", fg: "#334155" },
  pink: { accent: "#DB2777", bg: "#FDF2F8", fg: "#BE185D" },
  dropi: { accent: "#F77F00", bg: "#FFF7ED", fg: "#C2570A" },
  teal: { accent: "#0D9488", bg: "#F0FDFA", fg: "#0F766E" },
  green: { accent: "#16A34A", bg: "#F0FDF4", fg: "#15803D" },
} satisfies Record<string, Tone>;

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

const card = (tone: Tone): React.CSSProperties => ({
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderLeft: `3px solid ${tone.accent}`,
  borderRadius: 14,
  padding: "22px 24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  marginBottom: 18,
});

const iconChip = (tone: Tone): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: 9,
  background: tone.bg,
  fontSize: 15,
  flexShrink: 0,
});

const sectionHeading: React.CSSProperties = {
  fontSize: 15.5,
  fontWeight: 800,
  color: "var(--fg)",
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 6,
};

const body: React.CSSProperties = { fontSize: 13.5, lineHeight: 1.65, color: "var(--fg)" };

const metricTile: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "14px 16px",
};

function isPending(v: string) {
  return v === PENDING;
}

function Val({ children }: { children: string }) {
  return isPending(children) ? (
    <span style={{ ...badgeStyle("#B45309", "#FFFBEB"), fontWeight: 600 }}>⏳ {children}</span>
  ) : (
    <>{children}</>
  );
}

function Section({ icon, title, tone, children }: { icon: string; title: string; tone: Tone; children: React.ReactNode }) {
  return (
    <div style={card(tone)}>
      <div style={sectionHeading}>
        <span style={iconChip(tone)}>{icon}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ term, children }: { term: string; children: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={label}>{term}</div>
      <div style={body}><Val>{children}</Val></div>
    </div>
  );
}

// Reemplaza las tablas de label/valor por filas flexibles: en pantallas
// angostas el valor cae debajo del label en vez de comprimirse en una celda
// diminuta, que era el problema real de las <table> anteriores.
function Row({ term, children, last = false }: { term: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 20px",
        padding: "12px 0",
        borderBottom: last ? "none" : "1px solid var(--border)",
      }}
    >
      <div style={{ flex: "0 0 220px", fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{term}</div>
      <div style={{ flex: "1 1 260px", fontSize: 13, color: "var(--fg)", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

export default function SeguimientoContent({ showTitle = true }: { showTitle?: boolean }) {
  const [activeSlug, setActiveSlug] = useState(PROYECTOS[0].slug);
  const p = PROYECTOS.find((x) => x.slug === activeSlug)!;

  return (
    <div>
      {showTitle && (
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          🚀 Seguimiento de Proyectos
        </h2>
      )}

      {/* Selector de proyecto — pastillas con punto de estado (creado en
          Darwin vs. pendiente) para que el estado sea visible sin entrar. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {PROYECTOS.map((proj) => {
          const active = proj.slug === activeSlug;
          return (
            <button
              key={proj.slug}
              onClick={() => setActiveSlug(proj.slug)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
                padding: "9px 16px",
                borderRadius: 999,
                cursor: "pointer",
                border: active ? "1px solid var(--dropi)" : "1px solid var(--border)",
                background: active ? "var(--dropi)" : "var(--card)",
                color: active ? "#fff" : "var(--fg)",
                boxShadow: active ? "0 2px 8px rgba(247,127,0,0.28)" : "none",
                transition: "background 0.15s, box-shadow 0.15s",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: proj.code ? (active ? "#fff" : "#22C55E") : (active ? "rgba(255,255,255,0.6)" : "#CBD5E1"),
                  flexShrink: 0,
                }}
              />
              {proj.nombre}
            </button>
          );
        })}
      </div>

      {/* Hero del proyecto activo */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>🧬 Célula Design Ops</span>
            {p.code ? (
              <span style={badgeStyle("#EA580C", "#FFEDD5")}>{p.code}</span>
            ) : (
              <span style={badgeStyle("#6B7280", "#F3F4F6")}>Aún no creado en Darwin</span>
            )}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
            {p.nombre}
          </h3>
        </div>

        {p.detailHref && (
          <a
            href={p.detailHref}
            target={p.detailHref.startsWith("http") ? "_blank" : undefined}
            rel={p.detailHref.startsWith("http") ? "noreferrer" : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              background: "var(--dropi)",
              textDecoration: "none",
              padding: "9px 16px",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(247,127,0,0.25)",
            }}
          >
            Ver ficha completa →
          </a>
        )}
      </div>

      <Section icon="🎯" title="Objetivos Macro" tone={TONES.violet}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Field term="Target">{p.objetivosMacro.target}</Field>
          <Field term="Adopción">{p.objetivosMacro.adopcion}</Field>
          <Field term="Retención">{p.objetivosMacro.retencion}</Field>
          <Field term="Satisfacción (NPS/CSAT)">{p.objetivosMacro.satisfaccion}</Field>
        </div>
      </Section>

      <Section icon="📌" title="Definición del Proyecto" tone={TONES.blue}>
        <Field term="Descripción">{p.definicion.descripcion}</Field>
        <div style={{ marginTop: 4 }}>
          <div style={label}>Enlaces clave</div>
          <div>
            <Row term="📄 Documento de Lanzamiento (Kickoff)"><Val>{p.definicion.kickoff}</Val></Row>
            <Row term="📊 Archivos / Hojas de Cálculo (Excel)"><Val>{p.definicion.excel}</Val></Row>
            <Row term="🎫 Tarea principal o Épica en Jira" last><Val>{p.definicion.jira}</Val></Row>
          </div>
        </div>
      </Section>

      <Section icon="👥" title="Equipo del Proyecto" tone={TONES.slate}>
        <Row term="Product Manager (PM)"><Val>{p.equipo.pm}</Val></Row>
        <Row term="UX/UI Designer"><Val>{p.equipo.ux}</Val></Row>
        <Row term="Frontend Developer"><Val>{p.equipo.frontend}</Val></Row>
        <Row term="Tecnología Growth" last><Val>{p.equipo.growth}</Val></Row>
      </Section>

      <Section icon="📚" title="Documentación & Assets UX/UI" tone={TONES.pink}>
        <Row term="🔬 Archivos de Research"><Val>{p.documentacion.research}</Val></Row>
        <Row term="📐 Service Blueprint"><Val>{p.documentacion.blueprint}</Val></Row>
        <Row term="👤 User Personas"><Val>{p.documentacion.personas}</Val></Row>
        <Row term="🔀 Flujos de usuario (User Flows)"><Val>{p.documentacion.flows}</Val></Row>
        <Row term="🎨 Figma v1.0 (Exploración)"><Val>{p.documentacion.figmaV1}</Val></Row>
        <Row term="🎨 Figma v2.0 (Handoff / Producción)" last><Val>{p.documentacion.figmaV2}</Val></Row>
      </Section>

      <Section icon="🗺️" title="Roadmap" tone={TONES.dropi}>
        {p.ganttFases ? (
          <RoadmapGantt
            axisStart="2025-11"
            axisEnd="2026-12"
            fases={p.ganttFases}
            nota="Fechas estimadas a partir del estado reportado en el Weekly Status más reciente (semana del 25 de agosto de 2026). Se ajustan cuando el equipo confirme fechas exactas."
          />
        ) : (
          <>
            <Field term="Fase 1 (MVP / Q1)">{p.roadmap.fase1}</Field>
            <Field term="Fase 2 (Escala / Q2)">{p.roadmap.fase2}</Field>
            <Field term="Próximos pasos inmediatos">{p.roadmap.proximos}</Field>
          </>
        )}
      </Section>

      <Section icon="🗓️" title="Weekly Status (Sincronización Semanal)" tone={TONES.teal}>
        <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
          <WeeklySelector />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Field term="Resumen de la semana">{p.weekly.resumen}</Field>
          <Field term="Retos y Bloqueos">{p.weekly.retos}</Field>
        </div>
      </Section>

      <Section icon="📊" title="Métricas de Seguimiento" tone={TONES.green}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 16 }}>
          <div style={metricTile}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Métrica 1</div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}><Val>{p.metricas.metrica1}</Val></div>
          </div>
          <div style={metricTile}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Métrica 2</div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}><Val>{p.metricas.metrica2}</Val></div>
          </div>
        </div>
        <Field term="Comentarios de rendimiento">{p.metricas.comentarios}</Field>
      </Section>
    </div>
  );
}
