import type { MonthlySnapshot } from "./types";

export const snapshot: MonthlySnapshot = {
  month: "2026-06",
  monthLabel: "Junio 2026",

  // Junio no tenía todavía la lectura ejecutiva de adopción — ese framing arrancó en julio.
  conclusionEjecutiva: {
    mensaje: "",
    submensaje: "",
    pilares: [],
    meses: [],
  },

  kpis: [
    { icon: "📁", label: "Total Proyectos Trabajados", value: "48", sub: "5 células activas · Junio 2026" },
    { icon: "✅", label: "Total Cierres del Mes", value: "11", sub: "Proyectos en etapa de cierre/QA" },
    { icon: "🚀", label: "Hand-offs a TI", value: "5", sub: "Proyectos transferidos a desarrollo" },
    { icon: "⏱", label: "Cycle Time Promedio", value: "7.2d", sub: "días por handoff · ≈ 1.0 sprints" },
    { icon: "🔄", label: "Tiempo prom. ciclo completo", value: "~26 días", sub: "de primera creación a handoff", subExtra: "~3.7 sprints", accent: true },
  ],

  cicloCompletoNota:
    "El ciclo completo se mide desde la primera versión del proyecto hasta el handoff a TI. Los 3 proyectos que completaron handoff en junio todos iniciaron el 19 de mayo, con los siguientes tiempos reales:",
  cicloCompletoItems: [
    { proyecto: "Facturación Argentina", fechas: "19 may → 9 jun", dias: 21, sprints: 3.0 },
    { proyecto: "Panel parametrización tarifas", fechas: "19 may → 11 jun", dias: 23, sprints: 3.3 },
    { proyecto: "Dropify Tiendanube V2.2", fechas: "19 may → 22 jun", dias: 34, sprints: 4.9 },
  ],
  cicloCompletoPromedio:
    "Promedio: 26 días (~3.7 sprints). Nota: proyectos con múltiples fases se cuentan desde la primera iteración.",

  experimentacion: {
    titulo: "Nuevo Onboarding Marcas · Buscador Semántico IA (Paraguay)",
    desc: "Dos experimentos activos resultado del following continuo. Onboarding Marcas con perfilamiento y tour guiado en ejecución. Buscador semántico IA en seguimiento con métricas de Paraguay vs Colombia.",
    numExperimentos: 2,
    numCelulas: 2,
  },

  statusDistribution: [
    { label: "En Discovery", value: 13, color: "#10B981" },
    { label: "En Definición", value: 39, color: "#3B82F6" },
    { label: "En Cierre/QA", value: 11, color: "#F77F00" },
    { label: "Hand-offs", value: 5, color: "#A855F7" },
  ],

  handoffsPorCelula: [
    { celula: "Brands", value: 1, color: "#A3E635" },
    { celula: "Backoffice", value: 2, color: "#8B5CF6" },
    { celula: "Experience", value: 0, color: "#F97316" },
    { celula: "Sellers", value: 0, color: "#D946EF" },
    { celula: "Suppliers", value: 0, color: "#EA5024" },
    { celula: "Logistics", value: 0, color: "#3B82F6" },
    { celula: "Fintech", value: 0, color: "#06B6D4" },
    { celula: "Estrellas", value: 1, color: "#EAB308" },
  ],

  // Taxonomía [DISCOVERY][POC][DELIVERY][FOLLOWING] se adoptó en julio — junio no tiene datos.
  tiempoPorEtapa: [],

  celulasDetail: [
    {
      celula: "Sellers Success",
      pm: "@alejandra.melo · @santiago.herrera",
      color: "#D946EF",
      rows: [
        { label: "En Discovery", value: "0", color: "#10B981" },
        { label: "En Definición", value: "2", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "1", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
        { label: "Promedio Sprints", value: "—", color: "#F59E0B" },
      ],
      badge: "3 proyectos totales",
      badgeColor: "#D946EF",
      badgeBg: "rgba(217,70,239,.1)",
      experimentos: "🧪 1 experimento",
    },
    {
      celula: "Brands Success",
      pm: "@francisco.velandia · @katerine.pencue",
      color: "#A3E635",
      rows: [
        { label: "En Discovery", value: "1", color: "#10B981" },
        { label: "En Definición", value: "4", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "1", color: "#EA5024" },
        { label: "Hand-off a TI", value: "1 ✓", color: "#10B981" },
        { label: "Promedio Sprints", value: "0.5", color: "#F59E0B" },
      ],
      badge: "7 proyectos únicos · 1 proyecto con handoff",
      badgeColor: "#84A81E",
      badgeBg: "rgba(163,230,53,.15)",
      experimentos: "🧪 2 experimentos",
      dedupNote:
        'Dedup: fases Pt.1–Pt.4, Fase 2–3, serial "Discovery funnel Marcas" → 1 proyecto. Story + Sub-task detectados. "Marketplace Estrellas" excluido del conteo de Brands (era de @omar.saldarriaga, movido a Estrellas en el roster de julio).',
    },
    {
      celula: "Suppliers Success",
      pm: "@michelle.lopez · @jaime.guevara",
      color: "#EA5024",
      rows: [
        { label: "En Discovery", value: "2", color: "#10B981" },
        { label: "En Definición", value: "2", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "0", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
        { label: "Promedio Sprints", value: "—", color: "#F59E0B" },
      ],
      badge: "4 proyectos totales",
      badgeColor: "#EA5024",
      badgeBg: "rgba(234,80,36,.1)",
      experimentos: "🧪 1 experimento",
    },
    {
      celula: "Logistics Success",
      pm: "@michel.pino · @juan.bautista",
      color: "#3B82F6",
      rows: [
        { label: "En Discovery / Exp.", value: "7", color: "#10B981" },
        { label: "En Definición", value: "6", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "2", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
        { label: "Promedio Sprints", value: "—", color: "#F59E0B" },
      ],
      badge: "15 proyectos · mayor discovery del mes",
      badgeColor: "#3B82F6",
      badgeBg: "rgba(59,130,246,.1)",
      experimentos: "🧪 1 experimento",
    },
    {
      celula: "Backoffice",
      pm: "@michel.pino · @catalina.giraldo · @paula.macias",
      color: "#8B5CF6",
      rows: [
        { label: "Total proyectos únicos", value: "14", color: "#111827" },
        { label: "Cerrados en junio", value: "6", color: "#EA5024" },
        { label: "Handoffs a TI", value: "2 ✅", color: "#10B981" },
        { label: "En Ruta / Pend. TI", value: "3", color: "#3B82F6" },
        { label: "Experimentos", value: "0", color: "#F59E0B" },
      ],
      badge: "14 proyectos · 2 handoffs",
      badgeColor: "#8B5CF6",
      badgeBg: "rgba(139,92,246,.1)",
    },
    {
      celula: "Experience",
      pm: "@kevin.paternina · @catalina.giraldo · @diana.aldana",
      color: "#F97316",
      rows: [
        { label: "Total proyectos únicos", value: "18", color: "#111827" },
        { label: "Cerrados / QA", value: "7", color: "#EA5024" },
        { label: "Handoffs a TI", value: "0", color: "#9CA3AF" },
        { label: "En Discovery", value: "1", color: "#10B981" },
        { label: "En Definición / En curso", value: "9", color: "#3B82F6" },
      ],
      badge: "18 proyectos · 2 experimentos",
      badgeColor: "#F97316",
      badgeBg: "rgba(249,115,22,.1)",
      experimentos: "🧪 2 experimentos — Following experimento Paraguay ×2",
    },
    {
      celula: "Fintech — dropiPay · MIWA",
      pm: "@nicolas.vargas",
      color: "#06B6D4",
      rows: [
        { label: "En Definición", value: "2", color: "#3B82F6" },
        { label: "Cierre / Completado", value: "5", color: "#10B981" },
        { label: "Discovery", value: "1", color: "#F59E0B" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
        { label: "En curso", value: "2", color: "#EA5024" },
      ],
      badge: "8 proyectos únicos · dropiPay (7) · MIWA (1)",
      badgeColor: "#06B6D4",
      badgeBg: "rgba(6,182,212,.1)",
      experimentos: "🧪 4 experimentos",
    },
    {
      celula: "Estrellas",
      pm: "@omar.saldarriaga · @lina.jimenez (dato manual)",
      color: "#EAB308",
      rows: [
        { label: "En Desarrollo", value: "2", color: "#3B82F6" },
        { label: "En Discovery", value: "1", color: "#10B981" },
        { label: "En Cierre", value: "1", color: "#EA5024" },
        { label: "Hand-off a TI", value: "1 ✓", color: "#A855F7" },
        { label: "Pausados", value: "2", color: "#9CA3AF" },
      ],
      badge: "7 proyectos · 1 handoff · prom. 1–2 sprints",
      badgeColor: "#B8860B",
      badgeBg: "rgba(234,179,8,.15)",
    },
  ],

  mejorasMetodologia: [
    'Implementar detección automática de clones para evitar doble conteo entre sprints. Actualmente se identifican manualmente por nombre similar (ej: sufijos -2, -3, -4 o prefijo "CLONE -"). La deduplicación también aplica a series "Pt.1"/"Pt.2", "Fase 2"/"Fase 3", "V2.1"/"V2.2" y partes seriales de "Discovery funnel Marcas".',
    "Estandarizar el uso de etiquetas de etapa en los Stories ([DISCOVERY], [DEFINICION], [CIERRE]) para automatizar clasificación en futuros reportes.",
    "Experimentos detectados a nivel Story Y Sub-task. Total junio: 11 experimentos en 6 células. Estandarizar tipo de issue para experimentos para facilitar detección automática futura.",
  ],

  reflexiones: [
    {
      titulo: "✅ ¿Qué ya hacemos bien?",
      color: "#16A34A",
      items: [
        "Entendimos que hay que alinearnos y comunicarnos. Tenemos horas en reuniones pero son horas en trabajo de construcción en dupla.",
        "Planeamos y estimamos desde el PD. El planning se facilita y viene como propuesta del PD.",
        "Documentamos y proponemos sobre la definición de los proyectos.",
      ],
    },
    {
      titulo: "🔄 ¿Qué seguimos trabajando?",
      color: "#D97706",
      items: [
        "Estamos aprendiendo a experimentar y hacemos parte de la definición.",
        "Estamos hablando de resultados, tanto de following como de experimentación.",
        "Proponemos siguientes pasos basados en insights de la célula.",
      ],
    },
    {
      titulo: "🚀 ¿Qué sigue?",
      color: "#4F46E5",
      items: [
        "Necesitamos integrar y optimizar nuestro tiempo con las herramientas de IA que tenemos a la mano. En adopción herramientas como RPP. Creemos el ambiente de definición de producto IA.",
        "Eliminar procesos manuales o que nos cuesten mucho tiempo.",
        "Ser los owners de la documentación CORE para Confluence una vez nos entreguen la información en el product lab.",
      ],
    },
  ],

  comparativoMeses: ["Abril", "Mayo", "Junio"],

  comparativoGlobal: [
    { metrica: "Total proyectos trabajados", nota: "Proyectos activos en células durante el mes", valores: ["29", "21", "48"], delta: "↑ +27", direction: "up" },
    { metrica: "Cierres / En cierre", nota: "Proyectos en etapa de cierre o QA", valores: ["6", "7", "11"], delta: "↑ +4", direction: "up" },
    { metrica: "Hand-offs a TI", nota: "Proyectos formalmente transferidos a desarrollo", valores: ["—", "6", "5"], delta: "↓ −1", direction: "down" },
    { metrica: "Células activas", valores: ["4", "5", "5"], delta: "= igual", direction: "flat" },
    { metrica: "Experimentos activos", nota: "Story + Sub-task level — 6 células", valores: ["—", "2", "11"], delta: "↑ +9", direction: "up" },
    { metrica: "Cycle time handoff", nota: "Tiempo desde apertura de sprint hasta handoff", valores: ["—", "5.3 sprints", "3.7 sprints"], delta: "↓ −1.6 🎯", direction: "up" },
    { metrica: "Ciclo completo prom.", nota: "Primera versión → handoff a TI", valores: ["—", "—", "~26 días"], delta: "nuevo", direction: "flat" },
    { metrica: "En Discovery", valores: ["—", "—", "13"], delta: "nuevo", direction: "flat" },
  ],

  comparativoCelulas: [
    {
      celula: "Sellers Success",
      color: "#D946EF",
      rows: [
        { metrica: "Total proyectos", valores: ["6", "3", "3"] },
        { metrica: "Cierres", valores: ["0", "1", "1"] },
        { metrica: "Handoffs TI", valores: ["—", "1", "0"] },
      ],
    },
    {
      celula: "Brands Success",
      color: "#A3E635",
      rows: [
        { metrica: "Total proyectos", valores: ["10", "3", "7 únicos"] },
        { metrica: "Cierres", valores: ["2", "1", "1"] },
        { metrica: "Handoffs TI", valores: ["—", "1", "1 ✓"] },
      ],
    },
    {
      celula: "Suppliers Success",
      color: "#EA5024",
      rows: [
        { metrica: "Total proyectos", valores: ["4", "3", "4"] },
        { metrica: "Cierres", valores: ["2", "2", "0"] },
        { metrica: "Handoffs TI", valores: ["—", "2", "0"] },
      ],
    },
    {
      celula: "Logistics",
      color: "#3B82F6",
      rows: [
        { metrica: "Total proyectos", valores: ["9", "5", "15"] },
        { metrica: "Cierres", valores: ["2", "2", "2"] },
        { metrica: "Handoffs TI", valores: ["—", "2", "0"] },
      ],
    },
    {
      celula: "Backoffice",
      color: "#8B5CF6",
      rows: [
        { metrica: "Total proyectos", valores: ["—", "—", "14"] },
        { metrica: "Cierres", valores: ["—", "—", "6"] },
        { metrica: "Handoffs TI", valores: ["—", "—", "2 ✓"] },
      ],
    },
    {
      celula: "Experience",
      color: "#F97316",
      rows: [
        { metrica: "Total proyectos", valores: ["—", "—", "13"] },
        { metrica: "Cierres", valores: ["—", "—", "3"] },
        { metrica: "Handoffs TI", valores: ["—", "—", "0"] },
      ],
    },
  ],

  novedades: [
    { color: "#10B981", text: "Cycle time de handoffs cayó de 5.3 sprints → 3.7 sprints: el equipo cierra proyectos más rápido una vez llegan a la fase de entrega." },
    { color: "#3B82F6", text: "Logistics entra fuerte en discovery: 7 iniciativas de investigación activas (fulfilment, sameday, CAS Combos, Brasil) — mayor foco de discovery del equipo." },
    { color: "#06B6D4", text: "Backoffice lidera en cierres: 6 proyectos cerrados y 2 handoffs a TI. Experience suma 3 proyectos en cierre/QA con registro y login en ruta — mayor volumen conjunto de entrega del mes." },
    { color: "#84A81E", text: 'Brands consolida su proceso: 1 handoff formal (HU Pendientes Dropi). Deduplicación aplicada: 12 stories raw → 7 proyectos únicos.' },
    { color: "#EA5024", text: "Total proyectos +129% vs mayo (48 vs 21), reflejo de expansión del equipo y mejor cobertura en Jira de todas las actividades." },
    { color: "#06B6D4", text: "Fintech integrado por primera vez: 8 proyectos únicos (dropiPay + MIWA), 5 cerrados, 4 experimentos detectados a nivel sub-task." },
    { color: "#B8860B", text: "Estrellas integrada manualmente: 7 proyectos, 1 handoff (Rebranding VIBE Etapa 1), 2 pausados. Prom. 1–2 sprints para cierre." },
  ],

  fuente: "Dashboard generado para Dropi — Product Design Team · Junio 2026 · Datos extraídos de JIRA (proyecto PROD)",
};
