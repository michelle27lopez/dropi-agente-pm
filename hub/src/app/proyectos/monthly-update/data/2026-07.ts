import type { MonthlySnapshot } from "./types";

// Corte al 29 de julio 2026. Metodología distinta a junio: solo issues tipo
// Story/Epic cuentan como proyecto (Tasks excluidos), deduplicado por épica real
// de Jira + link "Cloners" (clones formales) + revisión manual donde no hay
// señal estructural. Sellers Success, Backoffice y Experience todavía tienen
// números pendientes de confirmación final — ver badge de cada tarjeta.
export const snapshot: MonthlySnapshot = {
  month: "2026-07",
  monthLabel: "Julio 2026",

  conclusionEjecutiva: {
    mensaje: "Julio no fue un mes de medir tiempos — fue el mes en que construimos cómo vamos a medirlos.",
    submensaje: "Adoptamos 3 piezas de infraestructura al mismo tiempo. Cada una individualmente resetea el reloj de qué tan comparables son los datos de tiempo del equipo — juntas, necesitan un mínimo de 2 meses de historia limpia (agosto y septiembre) antes de que hablar de \"cuánto nos demoramos\" vuelva a tener sentido estadístico.",
    pilares: [
      { nombre: "Darwin", icon: "🐺", estado: "Socializado — meta 100% adopción a fin de agosto" },
      { nombre: "RPP", icon: "🧪", estado: "Adoptado por todos los PD, incluidos Fintech y Estrellas" },
      { nombre: "Taxonomía [DISCOVERY][POC][DELIVERY][FOLLOWING]", icon: "🗂️", estado: "Definida — adopción real todavía dispareja por célula" },
    ],
    meses: [
      { mes: "Julio", rol: "Adopción de herramientas y taxonomía", activo: true },
      { mes: "Agosto", rol: "Primer mes completo con la nueva taxonomía — acumulando historia", activo: false },
      { mes: "Septiembre", rol: "Segundo mes — suficiente muestra para promedios reales", activo: false },
      { mes: "Octubre", rol: "Primera lectura confiable de tiempos del equipo", activo: false },
    ],
  },

  // "Total Cierres del Mes" se retiró del reporte — no es una métrica confiable
  // todavía (mezcla proyectos genuinamente cerrados con proyectos que solo llegaron
  // a Cierre/QA sin handoff confirmado). Ver fila "En Cierre / QA" por célula si
  // hace falta el detalle de etapa.
  kpis: [
    { icon: "📁", label: "Total Proyectos Trabajados", value: "107", sub: "8 células activas · Julio 2026" },
    { icon: "🚀", label: "Hand-offs a TI", value: "1", sub: "Confirmado vía subtask \"Handoff\" en DONE" },
    { icon: "🧪", label: "Experimentos Activos", value: "9", sub: "En 3 células: Suppliers, Brands, Sellers" },
  ],

  cicloCompletoNota:
    "A diferencia de junio (3 handoffs), julio solo tiene 1 handoff confirmado hasta el momento — no alcanza para un promedio representativo:",
  cicloCompletoItems: [
    { proyecto: "Seguridad Retiros dropiPay (Fintech)", fechas: "22 jun → 6 jul", dias: 14, sprints: 2.0 },
  ],
  cicloCompletoPromedio:
    "Con un solo caso no se puede promediar. Falta confirmar cuáles de los 65 proyectos en Cierre/QA ya hicieron handoff real — Jira solo lo detecta si existe una subtask con \"Handoff\" en el título y estado DONE, convención que casi nadie usa todavía.",

  experimentacion: {
    titulo: "TTV Postulaciones Suppliers · Garantías Usuario Emprendedor · Dropi Pulso",
    desc: "9 proyectos con tag [EXPERIMENTACIÓN] activo en 3 células. Suppliers concentra la mayor parte (5): TTV Postulaciones, knowledge base, Dinámica de Catálogo, Campañas Fase 2, Dropi Pulso. Brands suma 3 (Garantías usuario emprendedor, Onboarding guiado, Retención Proactiva) y Sellers 1 (Módulo de notificaciones).",
    numExperimentos: 9,
    numCelulas: 3,
  },

  statusDistribution: [
    { label: "En Discovery", value: 33, color: "#10B981" },
    { label: "En Definición", value: 8, color: "#3B82F6" },
    { label: "En Cierre/QA", value: 65, color: "#F77F00" },
    { label: "Hand-offs", value: 1, color: "#A855F7" },
  ],

  // Primer mes con la taxonomía [DISCOVERY][POC][DELIVERY][FOLLOWING]. Calculado con
  // fecha de creación del primer ticket taggeado de cada etapa dentro de un mismo
  // proyecto — solo aplica a proyectos que ya tienen 2+ etapas distintas tagueadas,
  // por eso la mayoría de células no tienen dato todavía y las que sí, tienen n=1.
  // (Excluido: 1 transición "Discovery → Following" de Sellers con 0 días — el tag
  // que la generó era [CIERRE], de la metodología vieja, no un "Following" real.)
  tiempoPorEtapa: [
    { celula: "Sellers Success", color: "#D946EF", transiciones: [
      { transicion: "Discovery → POC", dias: 6, n: 1 },
    ] },
    { celula: "Brands Success", color: "#A3E635", transiciones: [
      { transicion: "Discovery → POC", dias: 13, n: 1 },
    ] },
    { celula: "Suppliers Success", color: "#EA5024", transiciones: [
      { transicion: "Discovery → POC", dias: 13, n: 1 },
      { transicion: "POC → Delivery", dias: 7, n: 1 },
    ] },
    { celula: "Logistics Success", color: "#3B82F6", transiciones: [] },
    { celula: "Backoffice", color: "#8B5CF6", transiciones: [] },
    { celula: "Experience", color: "#F97316", transiciones: [] },
    { celula: "Fintech", color: "#06B6D4", transiciones: [] },
    { celula: "Estrellas", color: "#EAB308", transiciones: [] },
  ],

  handoffsPorCelula: [
    { celula: "Brands", value: 0, color: "#A3E635" },
    { celula: "Backoffice", value: 0, color: "#8B5CF6" },
    { celula: "Experience", value: 0, color: "#F97316" },
    { celula: "Sellers", value: 0, color: "#D946EF" },
    { celula: "Suppliers", value: 0, color: "#EA5024" },
    { celula: "Logistics", value: 0, color: "#3B82F6" },
    { celula: "Fintech", value: 1, color: "#06B6D4" },
    { celula: "Estrellas", value: 0, color: "#EAB308" },
  ],

  celulasDetail: [
    {
      celula: "Sellers Success",
      pm: "@alejandra.melo · @santiago.herrera",
      color: "#D946EF",
      rows: [
        { label: "En Discovery", value: "10", color: "#10B981" },
        { label: "En Definición", value: "0", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "18", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "28 proyectos · 9 confirmados por épica, 19 pendientes de revisión",
      badgeColor: "#B91C8C",
      badgeBg: "rgba(217,70,239,.1)",
      experimentos: "🧪 1 experimento",
      dedupNote: "Aún en revisión contigo — los 19 proyectos sueltos (sin épica ni clon) pueden bajar más tras confirmar fusiones.",
    },
    {
      celula: "Brands Success",
      pm: "@francisco.velandia · @katerine.pencue",
      color: "#A3E635",
      rows: [
        { label: "En Discovery", value: "5", color: "#10B981" },
        { label: "En Definición", value: "1", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "1", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "7 proyectos totales",
      badgeColor: "#84A81E",
      badgeBg: "rgba(163,230,53,.15)",
      experimentos: "🧪 3 experimentos",
    },
    {
      celula: "Suppliers Success",
      pm: "@michelle.lopez · @jaime.guevara",
      color: "#EA5024",
      rows: [
        { label: "En Discovery", value: "7", color: "#10B981" },
        { label: "En Definición", value: "4", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "2", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "13 proyectos totales",
      badgeColor: "#EA5024",
      badgeBg: "rgba(234,80,36,.1)",
      experimentos: "🧪 5 experimentos",
    },
    {
      celula: "Logistics Success",
      pm: "@michel.pino · @juan.bautista",
      color: "#3B82F6",
      rows: [
        { label: "En Discovery", value: "2", color: "#10B981" },
        { label: "En Definición", value: "0", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "18", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "20 proyectos · pendiente de revisión de fusiones",
      badgeColor: "#3B82F6",
      badgeBg: "rgba(59,130,246,.1)",
      dedupNote: "Logistics no usa épicas ni clones en Jira — el conteo depende de dedup manual por título, sin confirmar contigo todavía.",
    },
    {
      celula: "Backoffice",
      pm: "@michel.pino · @catalina.giraldo · @paula.macias",
      color: "#8B5CF6",
      rows: [
        { label: "En Discovery", value: "1", color: "#10B981" },
        { label: "En Definición", value: "0", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "5", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "6 proyectos · bajó de 22 al filtrar Tasks que no son proyecto real",
      badgeColor: "#8B5CF6",
      badgeBg: "rgba(139,92,246,.1)",
      dedupNote: "17 de los 22 candidatos originales eran tipo Task (coordinación/discusión), no Story — se excluyeron del conteo.",
    },
    {
      celula: "Experience",
      pm: "@kevin.paternina · @catalina.giraldo · @diana.aldana",
      color: "#F97316",
      rows: [
        { label: "En Discovery", value: "3", color: "#10B981" },
        { label: "En Definición", value: "0", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "4", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "7 proyectos · misma corrección de filtro que Backoffice",
      badgeColor: "#F97316",
      badgeBg: "rgba(249,115,22,.1)",
    },
    {
      celula: "Fintech",
      pm: "@nicolas.vargas",
      color: "#06B6D4",
      rows: [
        { label: "En Discovery", value: "2", color: "#10B981" },
        { label: "En Definición", value: "3", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "0", color: "#EA5024" },
        { label: "Hand-off a TI", value: "1 ✓", color: "#10B981" },
      ],
      badge: "6 proyectos · único handoff confirmado del mes",
      badgeColor: "#06B6D4",
      badgeBg: "rgba(6,182,212,.1)",
    },
    {
      celula: "Estrellas",
      pm: "@omar.saldarriaga · @lina.jimenez (dato manual)",
      color: "#EAB308",
      rows: [
        { label: "En Discovery", value: "3", color: "#10B981" },
        { label: "En Definición", value: "0", color: "#3B82F6" },
        { label: "En Cierre / QA", value: "17", color: "#EA5024" },
        { label: "Hand-off a TI", value: "0", color: "#111827" },
      ],
      badge: "20 proyectos · pendiente de revisión de fusiones",
      badgeColor: "#B8860B",
      badgeBg: "rgba(234,179,8,.15)",
      dedupNote: "Estrellas no usa épicas ni clones en Jira — mismo caso que Logistics, sin confirmar contigo todavía.",
    },
  ],

  mejorasMetodologia: [
    'Solo issues tipo Story o Epic cuentan como proyecto — los Tasks (343 en julio) son coordinación o ejecución, no iniciativas propias. Este único filtro bajó Backoffice de 22 a 6 proyectos y Experience de 14 a 7.',
    'La deduplicación por épica real de Jira y por link "Cloners" (clones formales) es mucho más confiable que adivinar por texto — pero Backoffice, Logistics y Estrellas no usan ninguna de las dos, así que su conteo sigue dependiendo de revisión manual sin confirmar.',
    'Hand-off a TI solo se puede confirmar si existe una subtask con "Handoff" en el título y estado DONE. Casi nadie usa esa convención (1 solo caso en todo julio) — probablemente hay más handoffs reales que Jira no está registrando así.',
  ],

  reflexiones: [
    {
      titulo: "🗂️ Nueva metodología de estados",
      color: "#16A34A",
      items: [
        "Definimos nuevos estados de proyecto según la metodología de Discovery continuo, con foco en innovación de bajo costo y alto impacto: [DISCOVERY] [POC] [DELIVERY] [FOLLOWING].",
        "Definimos subestados dentro de cada uno para mapear bien las etapas del discovery continuo.",
        "Volvimos a las épicas en Jira, para que Darwin pueda a futuro automatizar trabajos manuales que hoy hacemos ahí.",
      ],
    },
    {
      titulo: "🐺 Darwin — adopción",
      color: "#0891B2",
      items: [
        "Socializamos Darwin a todo el equipo para empezar a medir su adopción. Meta: 100% de adopción al cierre del próximo mes.",
        "Los nuevos estados y subestados se centralizan y actualizan con visibilidad directa en Darwin.",
      ],
    },
    {
      titulo: "🎓 Business Experts",
      color: "#7C3AED",
      items: [
        "Alineación de la evolución del programa \"Business Experts\" para incrementar el ownership y el conocimiento de los responsables de producto en cada business unit.",
      ],
    },
    {
      titulo: "🧪 RPP",
      color: "#D97706",
      items: [
        "Adopción de la herramienta RPP para todos los PDs, incluidos Fintech y Estrellas — para revisar la viabilidad de sus implementaciones de ese lado.",
      ],
    },
  ],

  comparativoMeses: ["Abril", "Mayo", "Junio", "Julio"],

  comparativoGlobal: [
    { metrica: "Total proyectos trabajados", nota: "Metodología cambió en julio (solo Story/Epic) — no 100% comparable con meses anteriores", valores: ["29", "21", "48", "107"], delta: "↑ +59", direction: "up" },
    { metrica: "Hand-offs a TI", nota: "Solo cuenta lo confirmado vía subtask \"Handoff\" en DONE desde julio", valores: ["—", "6", "5", "1"], delta: "↓ −4", direction: "down" },
    { metrica: "Células activas", valores: ["4", "5", "5", "8"], delta: "↑ +3", direction: "flat" },
    { metrica: "Experimentos activos", valores: ["—", "2", "11", "9"], delta: "↓ −2", direction: "down" },
    { metrica: "Cycle time handoff", nota: "Julio: n=1, no es promedio confiable", valores: ["—", "5.3 sprints", "3.7 sprints", "2.0 sprints (n=1)"], delta: "⚠️ dato insuficiente", direction: "flat" },
    { metrica: "Ciclo completo prom.", nota: "Primera versión → handoff a TI", valores: ["—", "—", "~26 días", "~14 días (n=1)"], delta: "⚠️ dato insuficiente", direction: "flat" },
    { metrica: "En Discovery", valores: ["—", "—", "13", "33"], delta: "↑ +20", direction: "up" },
  ],

  comparativoCelulas: [
    {
      celula: "Sellers Success",
      color: "#D946EF",
      rows: [
        { metrica: "Total proyectos", valores: ["6", "3", "3", "28"] },
        { metrica: "Handoffs TI", valores: ["—", "1", "0", "0"] },
      ],
    },
    {
      celula: "Brands Success",
      color: "#A3E635",
      rows: [
        { metrica: "Total proyectos", valores: ["10", "3", "7 únicos", "7"] },
        { metrica: "Handoffs TI", valores: ["—", "1", "1 ✓", "0"] },
      ],
    },
    {
      celula: "Suppliers Success",
      color: "#EA5024",
      rows: [
        { metrica: "Total proyectos", valores: ["4", "3", "4", "13"] },
        { metrica: "Handoffs TI", valores: ["—", "2", "0", "0"] },
      ],
    },
    {
      celula: "Logistics",
      color: "#3B82F6",
      rows: [
        { metrica: "Total proyectos", valores: ["9", "5", "15", "20"] },
        { metrica: "Handoffs TI", valores: ["—", "2", "0", "0"] },
      ],
    },
    {
      celula: "Backoffice",
      color: "#8B5CF6",
      rows: [
        { metrica: "Total proyectos", valores: ["—", "—", "14", "6"] },
        { metrica: "Handoffs TI", valores: ["—", "—", "2 ✓", "0"] },
      ],
    },
    {
      celula: "Experience",
      color: "#F97316",
      rows: [
        { metrica: "Total proyectos", valores: ["—", "—", "13", "7"] },
        { metrica: "Handoffs TI", valores: ["—", "—", "0", "0"] },
      ],
    },
    {
      celula: "Fintech",
      color: "#06B6D4",
      rows: [
        { metrica: "Total proyectos", valores: ["—", "—", "8", "6"] },
        { metrica: "Handoffs TI", valores: ["—", "—", "0", "1 ✓"] },
      ],
    },
    {
      celula: "Estrellas",
      color: "#EAB308",
      rows: [
        { metrica: "Total proyectos", valores: ["—", "—", "7", "20"] },
        { metrica: "Handoffs TI", valores: ["—", "—", "1 ✓", "0"] },
      ],
    },
  ],

  novedades: [
    { color: "#8B5CF6", text: "Backoffice y Experience bajaron drásticamente al filtrar por tipo de issue: Backoffice 22→6 proyectos, Experience 14→7 — la mayoría de lo que parecía \"proyecto\" eran Tasks de coordinación, no Stories." },
    { color: "#06B6D4", text: "Fintech es la única célula con handoff confirmado en julio: Seguridad Retiros dropiPay, 2.0 sprints (22 jun → 6 jul), detectado vía subtask \"Handoff\" en DONE." },
    { color: "#D946EF", text: "Sellers Success sigue siendo la célula más grande (28 proyectos) — 9 confirmadas por épica real de Jira, pero 19 sueltas sin fusión aún pendientes de revisión contigo." },
    { color: "#EA5024", text: "Suppliers Success concentra la mayor actividad de experimentación: 5 de los 9 experimentos activos del mes." },
    { color: "#F77F00", text: "Solo 1 de 65 proyectos en Cierre/QA tiene handoff confirmado — la convención de subtask \"Handoff\" casi no se usa, probablemente hay más handoffs reales sin registrar así." },
  ],

  fuente: "Dashboard generado para Dropi — Product Design Team · Julio 2026 (corte 29 jul, mes sin cerrar) · Datos extraídos de JIRA (proyecto PROD) · Sellers Success, Backoffice, Logistics y Estrellas aún pendientes de confirmación final contigo.",
};
