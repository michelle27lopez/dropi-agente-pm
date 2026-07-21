// ─────────────────────────────────────────────────────────────────────────────
// Contenido del tablero — sembrado desde el cerebro de Juan (Logistic Success).
// Home = INDICADORES. Frame propio: cadena de valor de la orden + experimentos.
// Datos fijos por ahora; en Fase 2 se mueve a Supabase.
// ─────────────────────────────────────────────────────────────────────────────

const JIRA = "https://dropi-it.atlassian.net/browse/";
export function jiraUrl(ticket?: string) {
  return ticket ? JIRA + ticket : undefined;
}

// ── North Star (cabecera) ────────────────────────────────────────────────────
export const northStar = {
  metaEntrega: "70%",
  baselineCO: "62,5%",
  brecha: "~8–11 pts",
  metaQ3: "CO 62,5% → 67%",
};

// ── Insight de la semana (protagonista de la home) ───────────────────────────
export type Spotlight = {
  fecha: string;
  fuente: string;
  titulo: string;
  cifra: string;
  cifraLabel: string;
  lectura: string;
  accion: string;
  linkTexto: string;
  linkHref: string;
};

export const spotlight: Spotlight = {
  fecha: "Cell Board · 1 jul 2026",
  fuente: "Primera vez con dato duro",
  titulo: "La confirmación es el cuello #1 del ciclo de la orden",
  cifra: "317K",
  cifraLabel: "órdenes tardan más de 24h en confirmarse (promedio 11,18h)",
  lectura:
    "Hoy la confirmación depende de una acción manual del dropshipper. El 14,37% de las confirmaciones exceden 24h — ahí se va el tiempo y parte de la movilización.",
  accion:
    "Arranca experimento de autoconfirmación por madurez (dropshippers constantes, ≥50 órd/mes) la próxima semana. Ojo: no aplica en zonas rurales, donde la devolución ya es alta.",
  linkTexto: "Ver el experimento →",
  linkHref: "/proyectos/logistica/experimentos",
};

// ── Indicadores (fuente: estrategia/primera-medicion-kpis-y-meta.md) ─────────
export type Indicador = {
  nombre: string;
  icono: string;
  valor: number; // 0–100 (para la barra)
  valorLabel: string;
  meta?: number;
  metaLabel: string;
  tono: "bueno" | "alerta" | "malo";
  delta: string;
  lectura: string;
};

export const indicadores: Indicador[] = [
  {
    nombre: "Movilización",
    icono: "🚚",
    valor: 80,
    valorLabel: "≈ 80%",
    metaLabel: "maximizar ↑",
    tono: "alerta",
    delta: "▼ empeorando",
    lectura:
      "No moviliza ~17–21% = fuga #1. El colador está en la confirmación de integraciones (SHOP). CO abril: 83,1%.",
  },
  {
    nombre: "% Entrega (sobre creadas)",
    icono: "📦",
    valor: 62.5,
    valorLabel: "62,5%",
    meta: 70,
    metaLabel: "meta 70%",
    tono: "malo",
    delta: "brecha ~8–11 pts",
    lectura:
      "Baseline consolidado ~59%. La brecha se cierra por las 2 fugas: no-movilización + devolución.",
  },
  {
    nombre: "Tiempo de entrega (< 24h)",
    icono: "⏱️",
    valor: 90,
    valorLabel: "82–99%",
    metaLabel: "por fase · Dropi",
    tono: "bueno",
    delta: "cuello = carrier",
    lectura:
      "Se mide por FASES (desde creación), como TASA de cumplimiento < 24h — no la mediana. Dropi cumple 82–99%; el cuello es el carrier (primer ofrecimiento 32%, entrega final 21%). ⚠️ Falta el número único creación→handoff (pendiente de Data).",
  },
];

// ── Las 2 fugas que cierran la brecha ────────────────────────────────────────
export type Fuga = {
  nombre: string;
  valor: string;
  barra: number; // 0–100
  tono: "malo" | "alerta";
  desc: string;
};

export const fugas: Fuga[] = [
  {
    nombre: "① No-movilización",
    valor: "~17–21%",
    barra: 20,
    tono: "malo",
    desc: "La orden se crea pero no entra a la red. Colador: la confirmación manual (317K órdenes >24h). Palanca: autoconfirmación por madurez.",
  },
  {
    nombre: "② Devolución",
    valor: "~26%",
    barra: 26,
    tono: "alerta",
    desc: "Concentrada en MX/AR/GT; Colombia más sana. Palanca: mejor carrier × zona.",
  },
];

// ── Etapas de la cadena de valor de la orden (Mapa) ──────────────────────────
export type Etapa = {
  n: number;
  nombre: string;
  sub: string;
  color: string; // acento de la etapa
  fuga?: { label: string; tono: "malo" | "alerta" | "bueno" };
};

export const etapas: Etapa[] = [
  { n: 1, nombre: "Generación", sub: "Se crea la orden y se elige transportadora", color: "#6366f1" },
  { n: 2, nombre: "Confirmación", sub: "Pre-red · el cliente confirma", color: "#f97316", fuga: { label: "Fuga ① · ~17–21% no moviliza", tono: "malo" } },
  { n: 3, nombre: "Despacho", sub: "Preparación y handoff al carrier", color: "#16a34a", fuga: { label: "El foso de Dropi · excelente aquí", tono: "bueno" } },
  { n: 4, nombre: "Tránsito", sub: "En camino · estados y tiempo por fases", color: "#0ea5e9" },
  { n: 5, nombre: "Entrega / Devolución", sub: "Desenlace de la orden", color: "#dc2626", fuga: { label: "Fuga ② · ~26% devuelve", tono: "malo" } },
  { n: 6, nombre: "Novedad / Posventa", sub: "Recuperación y recompra", color: "#a855f7", fuga: { label: "Fuga ④ · novedades sin recuperar", tono: "alerta" } },
];

// ── Proyectos, clavados a su etapa ───────────────────────────────────────────
export type Fase = "Discovery" | "Definición" | "Ejecución" | "Beta" | "Represado";
export type Proyecto = {
  nombre: string;
  slug: string;
  etapa: string;
  fase: Fase;
  ticket?: string;
  destacado?: boolean;
  descripcion: string;
  foco: string;
};

export function proyectoPorSlug(slug: string) {
  return proyectos.find((p) => p.slug === slug);
}

// Orden = prioridad de trabajo, derivada del roadmap Q3 (estrategia/roadmap-q3-logistica.md):
// Fase 0 enabler → Fase 1 apuestas activas → Fase 2 construcción → Fase 3 terceros → casi cerrados.
// NO es orden por cadena de valor (ese es el eje del mapa /mapa). Ajustar aquí si cambia la prioridad.
export const proyectos: Proyecto[] = [
  {
    nombre: "Movilización: rescatar confirmación (SHOP)",
    slug: "movilizacion",
    etapa: "Confirmación", fase: "Discovery", ticket: "PRM-1497", destacado: true,
    descripcion: "Rescatar las órdenes que se crean pero no entran a la red por fallar la confirmación en integraciones.",
    foco: "Fuga #1 (apuesta 2, Fase 1). 317K órdenes >24h en confirmar (prom. 11,18h). Experimento: autoconfirmación por madurez + instrumentar motivo de cancelación.",
  },
  {
    nombre: "Dirección confiable + geo",
    slug: "direccion-geo",
    etapa: "Confirmación", fase: "Discovery", ticket: "PRM-91", destacado: true,
    descripcion: "Capturar y validar la dirección/ubicación del comprador para prevenir y recuperar novedades.",
    foco: "Fase 1 (forzar validación en SHOP). Dos hermanas: prevención (capturar ubicación) + recuperación (reintento con ubicación).",
  },
  {
    nombre: "Dueño y triaje de la novedad",
    slug: "novedad-triaje",
    etapa: "Novedad / Posventa", fase: "Discovery", ticket: "PRM-1512",
    descripcion: "Dar dueño, SLA y triaje por motivo a las novedades para recuperar la orden.",
    foco: "Apuesta 4 (Fase 1, PRM-1512 a finalizar). Fuga ④. Capa transversal + posventa (recompra/garantía).",
  },
  {
    nombre: "Torre de control / Tiempo por fases",
    slug: "torre-control",
    etapa: "Tránsito", fase: "Discovery",
    descripcion: "Medir el tiempo de la orden por fases (F1→F5) para ver dónde se estanca.",
    foco: "Fase 0 · enabler que desbloquea medir todo. Habilitador del KPI de tiempo. Detecta órdenes estancadas y da ETA.",
  },
  {
    nombre: "Selección inteligente de transportadoras",
    slug: "seleccion-transportadoras",
    etapa: "Generación", fase: "Ejecución", ticket: "PRM-1513",
    descripcion: "Elegir automáticamente la mejor transportadora por zona para bajar la devolución y mejorar la entrega.",
    foco: "Apuesta 3 (Fase 2). Ranking carrier × zona (POC 72%, gate Maria Ossa). Juan = Carrier Ops.",
  },
  {
    nombre: "Normalización de estados",
    slug: "normalizacion-estados",
    etapa: "Tránsito", fase: "Represado", ticket: "PRM-1297",
    descripcion: "Homologar los estados del carrier para poder medir bien (sin-cierre, tiempo por fases).",
    foco: "Apuesta 5 (Fase 2, habilita medir MX). Represado. Pre-requisito de medición.",
  },
  {
    nombre: "Reducir devoluciones (COD)",
    slug: "devoluciones-cod",
    etapa: "Entrega / Devolución", fase: "Discovery", ticket: "PRM-1523",
    descripcion: "Reducir la devolución atacándola DENTRO del COD (pago/gestión), nunca empujando prepago.",
    foco: "Fuga ②. Score de riesgo + triaje por motivo + anticipo/ConfioPagos.",
  },
  {
    nombre: "Same Day",
    slug: "same-day",
    etapa: "Despacho", fase: "Ejecución", ticket: "PRM-1366", destacado: true,
    descripcion: "Entrega el mismo día para bodegas propias y Veloces.",
    foco: "Fase 3 (terceros). MVP: flag SD + hora de corte + validación geo + selección guiada. Épica PROD-1127.",
  },
  {
    nombre: "Parametrización de tarifas",
    slug: "tarifas",
    etapa: "Generación", fase: "Definición",
    descripcion: "Parametrizar el costo por orden (fletes) de forma clara y automática.",
    foco: "Discovery completo, doc E2E rehecho. BLOQUEADA tras la prioridad de Venezuela en TI.",
  },
  {
    nombre: "Guías reemplazatorias (Ecom Scanner)",
    slug: "guias-reemplazatorias",
    etapa: "Novedad / Posventa", fase: "Beta", ticket: "PRM-745",
    descripcion: "Generar guías cuando el carrier no lee el código de barras (Ecom Scanner).",
    foco: "Casi cerrado · en beta: Interrap, Coordinadora y TCC.",
  },
  {
    nombre: "Notificaciones prevención de devoluciones",
    slug: "notificaciones-devoluciones",
    etapa: "Novedad / Posventa", fase: "Ejecución", ticket: "PRM-1512",
    descripcion: "Avisar al comprador para prevenir la devolución antes de que ocurra.",
    foco: "Por finalizar, alinear con Seller Success.",
  },
];

// ── Experimentos / hipótesis ─────────────────────────────────────────────────
export type EstadoExp = "Idea" | "Diseñado" | "Corriendo" | "Validado" | "Descartado";
export type Experimento = {
  nombre: string;
  hipotesis: string;
  metrica: string;
  estado: EstadoExp;
  impacto: string;
  proyecto: string;
  aprendizaje?: string;
  demoHref?: string;
};

export const experimentos: Experimento[] = [
  {
    nombre: "Autoconfirmación por madurez del dropshipper",
    hipotesis:
      "Autoconfirmar a dropshippers maduros (constantes, ≥50 órd/mes) baja el tiempo de confirmación y sube movilización, sin subir devolución.",
    metrica: "Tiempo de confirmación (h) + % movilización + % devolución (A/B sobre la muestra)",
    estado: "Diseñado",
    impacto: "317K órdenes >24h · confirmación promedio 11,18h · 14,37% exceden 24h",
    proyecto: "Movilización · Confirmación (Cell Board 1-jul)",
    demoHref: "/proyectos/logistica/experimentos/autoconfirmacion",
    aprendizaje:
      "Ojo: en zonas rurales (veredas/fincas) la devolución ya es alta, así que ahí no se autoconfirma sin revisar. Hoy tampoco distinguimos confirmación manual de automática (salvo Chatea) — el experimento deja esa trazabilidad.",
  },
  {
    nombre: "Activar validación de dirección en SHOP",
    hipotesis: "Forzar la validación de dirección en integraciones sube la movilización.",
    metrica: "% de movilización / entregas netas (A/B sobre is_validated)",
    estado: "Diseñado",
    impacto: "618K sin validar · +11,9 pts entra red · ~90K entregas en juego",
    proyecto: "Movilización · Dirección+geo",
  },
  {
    nombre: "Catálogo de motivos de cancelación (Colombia)",
    hipotesis: "Instrumentar el motivo revela la mitad ciega del no-mov (53%).",
    metrica: "% de no-movilización con causa registrada",
    estado: "Idea",
    impacto: "Barato · desbloquea la fuga #1",
    proyecto: "Movilización",
  },
  {
    nombre: "Ruteo por mejor carrier × zona",
    hipotesis: "Enrutar por el mejor carrier según zona baja la devolución.",
    metrica: "% de devolución por zona (post-ranking)",
    estado: "Corriendo",
    impacto: "Δ 20–27 pp entre carriers en la misma zona · POC 72%",
    proyecto: "Selección de transportadoras (PRM-1513)",
  },
  {
    nombre: "Encuesta: ¿por qué no validan la dirección?",
    hipotesis: "El seller no valida por fricción/desconocimiento, no por falta de valor.",
    metrica: "Respuestas + motivos (Userpilot)",
    estado: "Diseñado",
    impacto: "Falta solo la URL/pantalla + Figma para lanzar (PROD-1086)",
    proyecto: "Dirección confiable + geo",
  },
  {
    nombre: "Vigía — extensión Chrome sobre el módulo de órdenes",
    hipotesis:
      "Una extensión que lee las guías del módulo de órdenes y le anticipa al usuario el resultado probable (qué revisar, qué tener en cuenta) le permite corregir antes de que la orden se caiga y mejorar su operación.",
    metrica: "[por definir con datos] — candidatas: % de guías corregidas tras la alerta · efecto en devolución/novedad de quien la usa",
    estado: "Idea",
    impacto: "Herramienta predictiva/advisory sobre la orden creada. Actúa antes del desenlace, así que cruza las fugas ② devolución y ④ novedad.",
    proyecto: "Dueño y triaje de la novedad",
  },
];

// ── Weekly Product (la página /updates = el weekly presentable) ──────────────
// Estructura: indicadores hoy → tiempo por fases (1ª lectura) → hallazgos →
// proyectos por sección. Fuente de tiempo:
// estrategia/primera-medicion-kpis-y-meta.md (Monitor Operativo junio + Q8).

// Indicador "hoy" (los 3 números de la primera lectura).
export type IndicadorHoy = {
  nombre: string;
  valor: string;
  meta?: string;
  tono: "bueno" | "alerta" | "malo";
  estado: string; // etiqueta corta del estado
  nota: string;
};

// Brecha de entrega (para la barra visual).
export type BrechaEntrega = {
  actual: number; actualLabel: string;
  meta: number; metaLabel: string;
  gap: string; metaQ3: string;
  paisFoco: string;
  lectura: string;
  fugas: { label: string; valor: string; sub: string; tono: "rojo" | "ambar" | "verde" }[];
};

// Tiempo por fases.
export type FaseTiempo = {
  fase: string;
  horas: number;
  metaHoras: number;
  unidad?: string;
  nota?: string;
  responsable?: string; // dueño de la fase (se muestra adelante)
  palanca?: string;
  volumen?: string;
  cumplimiento?: number;
  criticos?: string;
  base?: string;
};

// Hallazgo (aprendizaje simple de la semana).
export type Hallazgo = {
  tono: "confirmacion" | "carrier" | "zona";
  titulo: string;
  detalle: string;
  // comparación visual opcional (para el carrier×zona)
  compara?: { etiqueta: string; a: { label: string; pct: number }; b: { label: string; pct: number } };
};

// Proyecto dentro de una sección.
export type ProyectoLite = {
  nombre: string;
  ticket?: string;
  estado: string;
  estadoTono: "verde" | "ambar" | "rojo" | "azul" | "gris";
  nota: string;
  impacto?: string; // dato de impacto/negocio destacado (ej. ingreso adicional)
};
export type SeccionProyectos = { titulo: string; nota: string; proyectos: ProyectoLite[] };

export type ComparacionMensual = {
  titulo: string;
  alcance: string;
  lectura: string;
  entregaNota: string;
  filas: {
    metrica: string;
    abril: string;
    mayo: string;
    junio: string;
    delta: string;
    tono: "bueno" | "alerta" | "malo";
  }[];
};

export type Weekly = {
  id: string;
  fecha: string;
  semana: string;
  foco: string;
  indicadores: IndicadorHoy[];
  brecha: BrechaEntrega;
  tiempo: { lectura: string; dropi: FaseTiempo[]; carrier: FaseTiempo[]; proximosPasos: string[] };
  hallazgos: Hallazgo[];
  secciones: SeccionProyectos[];
  comparacionMensual?: ComparacionMensual;
  avanceInvestigacion?: {
    titulo: string;
    descripcion: string;
    pasos: { nombre: string; detalle: string; estado: "listo" | "activo" | "siguiente" }[];
  };
  focoSiguienteSemana?: string[];
};

// Cada semana es una entrada. La primera del array es la más reciente (la que se
// muestra por defecto). NO borrar semanas viejas: el switch de /updates las conserva.
export const weeklies: Weekly[] = [
  // ── Semana 13 – 17 jul 2026 (actual) ────────────────────────────────────────
  {
    id: "2026-w29",
    fecha: "Viernes 17 de julio de 2026",
    semana: "Semana 13 – 17 jul",
    foco:
      "El North Star no se movió en movilización: el experimento todavía no corre. La prioridad de Delivery cambia a Normalización de estados y el cronograma para Maria vence hoy.",

    comparacionMensual: {
      titulo: "Cierre junio vs. mayo",
      alcance: "Consolidado de 9 países, ponderado por volumen.",
      lectura:
        "Lectura honesta: la movilización quedó plana. Es coherente con el estado de las palancas: la fuga #1 sigue abierta y autoconfirmación todavía no está corriendo.",
      entregaNota:
        "% entrega aún no es comparable: junio sigue madurando y los paquetes en tránsito subestiman el cierre. El comparativo limpio por cohorte queda pendiente del export de Data. En cohortes cerradas sí mejoran Chile (+2,4 pts), Argentina (+5,6 pts) y Guatemala (+1,7 pts).",
      filas: [
        { metrica: "Movilización", abril: "81,9%", mayo: "82,3%", junio: "82,3%", delta: "≈ 0 · plano", tono: "alerta" },
        { metrica: "No movilizado", abril: "700.281", mayo: "716.957", junio: "737.865", delta: "+20.908", tono: "malo" },
        { metrica: "Órdenes", abril: "3,86M", mayo: "4,04M", junio: "4,17M", delta: "+3,3%", tono: "bueno" },
      ],
    },

    avanceInvestigacion: {
      titulo: "Investigación de oportunidades por fase",
      descripcion: "Avanzamos fase por fase para conectar las oportunidades que explican las ~44,9h hasta la transportadora.",
      pasos: [
        { nombre: "Confirmación", detalle: "Oportunidades levantadas", estado: "listo" },
        { nombre: "Generación de guía", detalle: "Oportunidades levantadas", estado: "listo" },
        { nombre: "Recogido por Dropi", detalle: "Investigación de hoy", estado: "activo" },
        { nombre: "Conectar el flujo", detalle: "Siguiente paso", estado: "siguiente" },
      ],
    },

    focoSiguienteSemana: [
      "Cerrar los hallazgos de recolecciones Dropi con Growth Ops.",
      "Impulsar el POC de selección de transportadoras — Responsable: Juan Diego.",
      "Autoconfirmación: afinar con Chatea Pro, validar las pruebas y cerrar el posible impacto la siguiente semana — Responsable: Michel Pino.",
      "Normalización de estados: cerrar la propuesta la siguiente semana — Responsable: Juan Diego.",
    ],

    indicadores: [
      {
        nombre: "Movilización consolidada",
        valor: "82,3%",
        tono: "alerta",
        estado: "Plano",
        nota: "Sin cambio vs. mayo. Colombia, 73% del negocio, pasa de 83,3% a 83,0%.",
      },
      {
        nombre: "Órdenes no movilizadas",
        valor: "737.865",
        tono: "malo",
        estado: "+20.908",
        nota: "El volumen total creció 3,3%, pero también aumentó la fuga absoluta antes de entrar a red.",
      },
      {
        nombre: "% entrega",
        valor: "Pendiente",
        tono: "alerta",
        estado: "Cohorte inmadura",
        nota: "No usar el crudo de junio para concluir caída. Falta el export de Data por cohorte comparable.",
      },
    ] as IndicadorHoy[],

    // El formato ejecutivo del 17-jul usa la comparación mensual y las secciones
    // de abajo. Estos campos se conservan por compatibilidad con semanas históricas.
    brecha: {
      actual: 73.5, actualLabel: "73,5% crudo CO",
      meta: 70, metaLabel: "70%",
      gap: "No comparable", metaQ3: "Pendiente cohorte",
      paisFoco: "Colombia representa 73% del negocio.",
      lectura: "Junio sigue madurando; no se usa esta cifra para evaluar el KR.",
      fugas: [],
    },
    tiempo: {
      lectura: "La investigación de reducción de tiempos sigue sobre una ruta de referencia de ~44,9h hasta la transportadora.",
      dropi: [
        { fase: "Ruta Dropi hasta transportadora", horas: 44.9, metaHoras: 24, responsable: "Célula", palanca: "medición fase por fase" },
      ],
      carrier: [
        { fase: "Maduración de entrega", horas: 24, metaHoras: 24, palanca: "comparar cohortes cerradas" },
      ],
      proximosPasos: ["Obtener el export de Data por cohorte para cerrar el comparativo de entrega."],
    },
    hallazgos: [],

    secciones: [
      {
        titulo: "Product Road map · investigación",
        nota: "Medir impacto antes de desarrollar.",
        proyectos: [
          {
            nombre: "Reducción de tiempos por fase",
            estado: "Investigación en curso",
            estadoTono: "ambar",
            nota: "Estamos investigando oportunidades para recortar el tiempo fase por fase. Ya trabajamos Confirmación y Generación de guía; hoy avanzamos en Recogido por Dropi para conectar el flujo hasta la transportadora.",
          },
          {
            nombre: "POC selección de transportadoras",
            ticket: "PRM-1513",
            estado: "POC definido",
            estadoTono: "verde",
            nota: "20 usuarios de alto tráfico. Fake doors para medir intención y luego POC para probar servicios.",
          },
          {
            nombre: "Normalización de estados",
            ticket: "PRM-1297",
            estado: "Prioridad #1",
            estadoTono: "azul",
            nota: "Homologa los estados de orden y guía en un catálogo común para mejorar la trazabilidad, la medición y la experiencia del usuario.",
          },
        ],
      },
      {
        titulo: "Experimentos",
        nota: "Validar la palanca y su impacto antes de escalar desarrollo.",
        proyectos: [
          {
            nombre: "Autoconfirmación de órdenes",
            ticket: "PRM-1497",
            estado: "En trabajo",
            estadoTono: "ambar",
            nota: "Se está afinando el experimento con Chatea Pro. El siguiente hito es validar las pruebas y cerrar una estimación de impacto la próxima semana.",
          },
        ],
      },
      {
        titulo: "Delivery Road map · WIP = 1",
        nota: "Una iniciativa activa; el resto conserva su posición explícita.",
        proyectos: [
          {
            nombre: "Normalización de estados",
            ticket: "PRM-1297",
            estado: "Activo",
            estadoTono: "verde",
            nota: "Discovery y definición del catálogo en curso. Busca convertir los estados crudos en una lectura consistente para operación y cliente.",
          },
          {
            nombre: "Same Day",
            ticket: "PRM-1366",
            estado: "Parqueado",
            estadoTono: "gris",
            nota: "Permanece en la cola; no compite con el WIP activo.",
          },
          {
            nombre: "Fulfillment",
            estado: "Bloqueado",
            estadoTono: "rojo",
            nota: "Diseño validado. Está bloqueado en la negociación de la mesa logística; no está terminado.",
          },
        ],
      },
      {
        titulo: "Oportunidades de la semana",
        nota: "Palancas nuevas conectadas con el tramo de ~44h.",
        proyectos: [
          {
            nombre: "Growth Ops + Recolecciones",
            estado: "Oportunidad prioritaria",
            estadoTono: "verde",
            nota: "Se investigó de punta a punta el proceso de recolecciones para entender cómo se mide el volumen, qué ocurre cuando no se alcanza el mínimo y dónde faltan alertas preventivas. Los hallazgos se conectan con el tramo de tiempo hasta la transportadora.",
          },
          {
            nombre: "POC selección de transportadoras",
            ticket: "PRM-1513",
            estado: "Próxima prueba",
            estadoTono: "azul",
            nota: "Usar el POC para probar los servicios antes de comprometer desarrollo.",
          },
        ],
      },
      {
        titulo: "Cerrado esta semana y fecha dura",
        nota: "Cierres verificables; el cronograma sigue abierto y vence hoy.",
        proyectos: [
          {
            nombre: "Token de devolución · Veloces",
            estado: "Cerrado",
            estadoTono: "verde",
            nota: "7 bodegas activas.",
          },
          {
            nombre: "Prueba de entrega · Envía",
            ticket: "PRM-1364",
            estado: "Diseño definido",
            estadoTono: "ambar",
            nota: "Definido url_evidence y mínimo legal. Falta enviar el correo a las transportadoras.",
          },
          {
            nombre: "Cronograma de proyectos",
            estado: "Entrega hoy",
            estadoTono: "rojo",
            nota: "Cronograma ajustado con tres vistas, WIP = 1 y ciclos de 1–2 semanas. Fecha de entrega: hoy.",
          },
        ],
      },
    ] as SeccionProyectos[],
  },

  // ── Semana 7 – 11 jul 2026 ──────────────────────────────────────────────────
  {
    id: "2026-w28",
    fecha: "Viernes 10 de julio de 2026",
    semana: "Semana 7 – 11 jul",
    foco:
      "Primera semana de experimentos en marcha: ya se presentó el prototipo de autoconfirmación + autogeneración de guías, y fulfillment queda listo para hand off. El norte sigue igual: entregar más y en menos de 24h.",

    indicadores: [
      {
        nombre: "Movilización",
        valor: "~82%",
        tono: "alerta",
        estado: "Pierde ~17–18%",
        nota: "De cada 100 órdenes creadas, ~18 no entran a la red (~700K/mes). El colador sigue en la confirmación.",
      },
      {
        nombre: "Entrega (sobre creadas)",
        valor: "~59%",
        meta: "70%",
        tono: "malo",
        estado: "Brecha ~11 pts",
        nota: "Todos los países. Es el KR2.1. La brecha se explica por no-movilización + devolución.",
      },
      {
        nombre: "Tiempo a la transportadora (<24h)",
        valor: "~44,5h",
        tono: "alerta",
        estado: "Ruta por etapas",
        nota: "Ruta Dropi 1→6 ≈ 44,5h (número conciliado). Meta <24h. El Cell Board repartió el recorte por dueño de fase.",
      },
    ] as IndicadorHoy[],

    brecha: {
      actual: 59, actualLabel: "~59%",
      meta: 70, metaLabel: "70%",
      gap: "~11 pts", metaQ3: "+4–5 pts en Q3",
      paisFoco:
        "Colombia, el mayor volumen de la operación, va en 62,5% — a 7,5 pts de la meta. México y Argentina arrastran el consolidado.",
      lectura:
        "Tasa de entrega de todos los países (sobre órdenes creadas). La brecha se cierra por dos caminos — mover más órdenes y que se devuelvan menos. Ningún proyecto la cierra solo.",
      fugas: [
        { label: "No moviliza", valor: "~18%", sub: "~700K/mes", tono: "rojo" },
        { label: "Se devuelve", valor: "~21%", sub: "~823K/mes", tono: "ambar" },
        { label: "Entrega neta (el KR)", valor: "~59%", sub: "~2,3M/mes", tono: "verde" },
      ],
    } as BrechaEntrega,

    tiempo: {
      lectura:
        "La ruta Dropi hasta transportadora sigue ~44,5h. Esta semana el Cell Board repartió la medición por dueño de fase: Confirmación (nosotros), Generación de guía (José) y Recolección (William). El recorte se ataca fase por fase, empezando por la confirmación con el experimento.",
      dropi: [
        { fase: "Confirmación de orden", horas: 11.8, metaHoras: 6, unidad: "h", nota: "monitoring", responsable: "Producto", palanca: "autoconfirmación", volumen: "2,11M", cumplimiento: 84.91, criticos: "318K" },
        { fase: "Generación de guía", horas: 10.37, metaHoras: 4, unidad: "h", nota: "healthy", responsable: "José", palanca: "autogeneración", volumen: "3,20M", cumplimiento: 89.84, criticos: "325K" },
        { fase: "Preparación de la guía", horas: 9.86, metaHoras: 4, unidad: "h", nota: "healthy", responsable: "Bodega", palanca: "SLA bodega + picking", volumen: "2,04M", cumplimiento: 89.54, criticos: "214K" },
        { fase: "Recogido por Dropi", horas: 8.28, metaHoras: 4, unidad: "h", nota: "monitoring", responsable: "William", palanca: "recolección", volumen: "497K", cumplimiento: 80.64, criticos: "96K" },
        { fase: "En bodega Dropi", horas: 2.61, metaHoras: 2, unidad: "h", nota: "healthy", responsable: "Bodega", palanca: "sostener", volumen: "761K", cumplimiento: 98.54, criticos: "11K" },
        { fase: "Entregado a transportadora", horas: 1.96, metaHoras: 2, unidad: "h", nota: "healthy", responsable: "Operación", palanca: "handoff", volumen: "973K", cumplimiento: 99.37, criticos: "6K" },
      ] as FaseTiempo[],
      carrier: [
        { fase: "Recolección transportadora", horas: 5.57, metaHoras: 6, unidad: "h", nota: "healthy", palanca: "sostener SLA carrier", volumen: "533K", cumplimiento: 97.41, criticos: "14K" },
        { fase: "Primer ofrecimiento", horas: 49.93, metaHoras: 24, unidad: "h", nota: "critical", palanca: "carrier correcto por zona", volumen: "826K", cumplimiento: 31.45, criticos: "566K" },
        { fase: "Entrega final", horas: 69.31, metaHoras: 48, unidad: "h", nota: "critical", palanca: "primer intento + novedades", volumen: "602K", cumplimiento: 20.57, criticos: "478K" },
      ] as FaseTiempo[],
      proximosPasos: [
        "Traer avance por fase la primera semana: Confirmación (Juan), Generación de guía (José) y Recolección (William).",
        "Segmentar la confirmación por volumen y categoría de dropshipper — el promedio ~11h oculta segmentos (a quién sí autoconfirmar).",
        "Pedir a Data el acumulado creación→handoff al grano orden: % <24h como número único.",
      ],
    },

    hallazgos: [
      {
        tono: "confirmacion",
        titulo: "Ya tenemos el prototipo de autoconfirmación",
        detalle:
          "Tenemos un prototipo funcional de autoconfirmación + autogeneración de guías. La apuesta: validar con un POC antes de construir. Ya socializado con el equipo; a la espera de usuarios para probarlo.",
      },
      {
        tono: "zona",
        titulo: "El promedio de confirmación esconde segmentos",
        detalle:
          "El ~11h de confirmación mezcla dropshippers de alto volumen con poco especializados. Hay que segmentar por volumen y categoría para decidir a quién se autoconfirma sin subir la devolución.",
      },
      {
        tono: "carrier",
        titulo: "Hoy el «same day» sale sin lógica",
        detalle:
          "Con Veloces, la guía same-day se asigna a ciertos proveedores sin validar tipo de envío ni geografía (Cali→Santa Marta sale same day). Es la evidencia de por qué el MVP necesita flag SD + validación geográfica.",
      },
    ] as Hallazgo[],

    secciones: [
      {
        titulo: "Listo para hand off",
        nota: "Terminado esta semana, pasa a TI.",
        proyectos: [
          {
            nombre: "Parametrización de fulfillment",
            estado: "Listo para hand off",
            estadoTono: "verde",
            nota: "Documento terminado y contrastado con diseño y prototipo. Queda listo para entrega a TI.",
            impacto: "Si sale en Colombia como está, desde el mes siguiente la compañía percibiría +$380M COP mensuales.",
          },
        ],
      },
      {
        titulo: "Experimentos en marcha",
        nota: "POC antes de construir.",
        proyectos: [
          {
            nombre: "Autoconfirmación de la orden",
            ticket: "PRM-1497",
            estado: "Prototipo",
            estadoTono: "ambar",
            nota: "Prototipo funcional presentado en el Cell Board. Socializado con Santiago; a la espera de las personas para probarlo. Guardarraíl: no autoconfirmar en zona rural.",
          },
          {
            nombre: "Autogeneración de guías",
            estado: "Listo para probar",
            estadoTono: "ambar",
            nota: "Al confirmar, genera la guía automáticamente para acelerar el alistamiento. Listo para probar; beneficia a proveedores de alto volumen.",
          },
        ],
      },
      {
        titulo: "Discovery (metodología completa)",
        nota: "En exploración/definición antes de pasar a dev.",
        proyectos: [
          {
            nombre: "Normalización de estados",
            ticket: "PRM-1297",
            estado: "En preparación",
            estadoTono: "ambar",
            nota: "V interactiva del mapa de estados (se comparte esta semana) + cuentas otros países (MX/AR) para casos reales. Próximo: hacer la cadena (oportunidad→idea→solución) + presentar + mesas de trabajo.",
          },
          {
            nombre: "Same Day",
            ticket: "PRM-1366",
            estado: "Exploración → Definición",
            estadoTono: "ambar",
            nota: "Arrancó exploración + definición. MVP = flag SD + validación geo (hoy con Veloces sale sin lógica). Épica PROD-1127.",
          },
        ],
      },
      {
        titulo: "Pruebas / Lanzamientos",
        nota: "Ya funcionando en producción.",
        proyectos: [
          {
            nombre: "DropiGo",
            estado: "Lanzado ✓",
            estadoTono: "verde",
            nota: "Ya lanzado con éxito. Sigue integrando nuevas transportadoras.",
          },
          {
            nombre: "Guías reemplazatorias (Ecom Scanner)",
            ticket: "PRM-745",
            estado: "Lanzamiento",
            estadoTono: "verde",
            nota: "En lanzamiento con Laura (comunicación). Funcionando con Interrapidísimo, Coordinadora y TCC.",
          },
          {
            nombre: "Oficinas de Interrapidísimo en orden manual",
            estado: "En pruebas",
            estadoTono: "verde",
            nota: "Al crear una orden manual con «recoger en oficina», el sistema muestra la oficina de Interrapidísimo que corresponde.",
          },
        ],
      },
      {
        titulo: "Cola de desarrollo",
        nota: "El dev está en Venezuela/Binance (cierra jul); estos esperan slot (1 dev · secuencial).",
        proyectos: [
          {
            nombre: "Selección de transportadoras (IA)",
            ticket: "PRM-1219",
            estado: "Cola de dev",
            estadoTono: "azul",
            nota: "Listo PM. Arranca al cerrar Venezuela. Ranking carrier×zona (épica DROP-17946).",
          },
          {
            nombre: "Parametrización de tarifas",
            ticket: "PRM-1362",
            estado: "Cola de dev",
            estadoTono: "azul",
            nota: "Listo PM; se desbloquea al cerrar el cambio de moneda de Venezuela.",
          },
          {
            nombre: "Pruebas de entrega (POD)",
            ticket: "PRM-1364",
            estado: "Cola de dev · despriorizado",
            estadoTono: "gris",
            nota: "Despriorizado pero listo para hand off. Doble verificación EcomScanner + transportadora.",
          },
        ],
      },
    ] as SeccionProyectos[],
  },

  // ── Semana 30 jun – 4 jul 2026 ──────────────────────────────────────────────
  {
    id: "2026-w27",
    fecha: "Viernes 3 de julio de 2026",
    semana: "Semana 30 jun – 4 jul",
    foco: "Ya tenemos la primera lectura de los tiempos de la orden por fase. El norte sigue igual: entregar más y en menos de 24h.",

  // Los 3 indicadores, como están hoy.
  indicadores: [
    {
      nombre: "Movilización",
      valor: "~82%",
      tono: "alerta",
      estado: "Pierde ~17–18%",
      nota: "De cada 100 órdenes creadas, ~18 no entran a la red. Son ~700K al mes.",
    },
    {
      nombre: "Entrega (sobre creadas)",
      valor: "~59%",
      meta: "70%",
      tono: "malo",
      estado: "Brecha ~11 pts",
      nota: "Todos los países. Es el KR2.1. La brecha se explica por no-movilización + devolución.",
    },
    {
      nombre: "Tiempo a la transportadora (<24h)",
      valor: "~44,9h*",
      tono: "alerta",
      estado: "Ruta por etapas",
      nota: "La ruta Dropi 1→6 suma ~44,9h. El recorte debe enfocarse en las etapas que más consumen tiempo antes del handoff.",
    },
  ] as IndicadorHoy[],

  brecha: {
    actual: 59, actualLabel: "~59%",
    meta: 70, metaLabel: "70%",
    gap: "~11 pts", metaQ3: "+4–5 pts en Q3",
    paisFoco:
      "Colombia, el mayor volumen de la operación, va en 62,5% — a 7,5 pts de la meta. México y Argentina arrastran el consolidado.",
    lectura:
      "Tasa de entrega de todos los países (sobre órdenes creadas). La brecha se cierra por dos caminos — mover más órdenes y que se devuelvan menos. Ningún proyecto la cierra solo.",
    fugas: [
      { label: "No moviliza", valor: "~18%", sub: "~700K/mes", tono: "rojo" },
      { label: "Se devuelve", valor: "~21%", sub: "~823K/mes", tono: "ambar" },
      { label: "Entrega neta (el KR)", valor: "~59%", sub: "~2,3M/mes", tono: "verde" },
    ],
  } as BrechaEntrega,

  // KPI 2 · Tiempo por fases — la primera lectura de la semana.
  tiempo: {
    lectura:
      "La ruta Dropi hasta transportadora suma ~44,9h en la primera lectura por etapas. Para llegar al objetivo <24h, el recorte debe concentrarse en confirmación, generación de guía, preparación y recogida.",
    dropi: [
      { fase: "Confirmación de orden", horas: 11.8, metaHoras: 6, unidad: "h", nota: "monitoring", palanca: "autoconfirmación + madurez", volumen: "2,11M", cumplimiento: 84.91, criticos: "318K" },
      { fase: "Generación de guía", horas: 10.37, metaHoras: 4, unidad: "h", nota: "healthy", palanca: "automatizar/limpiar espera", volumen: "3,20M", cumplimiento: 89.84, criticos: "325K" },
      { fase: "Preparación de la guía", horas: 9.86, metaHoras: 4, unidad: "h", nota: "healthy", palanca: "SLA bodega + picking", volumen: "2,04M", cumplimiento: 89.54, criticos: "214K" },
      { fase: "Recogido por Dropi", horas: 8.28, metaHoras: 4, unidad: "h", nota: "monitoring", palanca: "recolección / cutoffs", volumen: "497K", cumplimiento: 80.64, criticos: "96K" },
      { fase: "En bodega Dropi", horas: 2.61, metaHoras: 2, unidad: "h", nota: "healthy", palanca: "sostener", volumen: "761K", cumplimiento: 98.54, criticos: "11K" },
      { fase: "Entregado a transportadora", horas: 1.96, metaHoras: 2, unidad: "h", nota: "healthy", palanca: "handoff", volumen: "973K", cumplimiento: 99.37, criticos: "6K" },
    ] as FaseTiempo[],
    carrier: [
      { fase: "Recolección transportadora", horas: 5.57, metaHoras: 6, unidad: "h", nota: "healthy", palanca: "sostener SLA carrier", volumen: "533K", cumplimiento: 97.41, criticos: "14K" },
      { fase: "Primer ofrecimiento", horas: 49.93, metaHoras: 24, unidad: "h", nota: "critical", palanca: "carrier correcto por zona", volumen: "826K", cumplimiento: 31.45, criticos: "566K" },
      { fase: "Entrega final", horas: 69.31, metaHoras: 48, unidad: "h", nota: "critical", palanca: "primer intento + novedades", volumen: "602K", cumplimiento: 20.57, criticos: "478K" },
    ] as FaseTiempo[],
    proximosPasos: [
      "Pedir a Data el acumulado creación→handoff al grano orden: promedio, p50/p90 y % <24h.",
      "Abrir la misma métrica por rangos horarios: 0–6h, 6–12h, 12–24h y >24h.",
      "Separar reducción por etapa: confirmación, generación, preparación y recogida. Ahí está el recorte real antes de carrier.",
    ],
  },

  // Hallazgos de la semana — 3, simples.
  hallazgos: [
    {
      tono: "confirmacion",
      titulo: "La confirmación es el primer cuello de la orden",
      detalle:
        "317K órdenes tardan más de 24h solo en confirmarse (11h en promedio). Hoy se hace a mano. Por eso arranca el experimento de autoconfirmación para los dropshippers más constantes.",
    },
    {
      tono: "carrier",
      titulo: "El tiempo se dispara cuando la orden pasa al carrier",
      detalle:
        "Después del handoff, el carrier abre otra escala de tiempo: primer ofrecimiento 49,93h y entrega final 69,31h. Esa palanca ya no se arregla solo con flujo interno.",
    },
    {
      tono: "zona",
      titulo: "Elegir mejor la transportadora por zona baja la devolución",
      detalle:
        "En una misma zona, un carrier puede devolver el doble que otro. Es la palanca más rápida y la razón de Selección de Transportadoras.",
      compara: {
        etiqueta: "Devolución en Antioquia — misma zona, dos carriers",
        a: { label: "Mejor carrier", pct: 16 },
        b: { label: "Peor carrier", pct: 43 },
      },
    },
  ] as Hallazgo[],

  // Proyectos, agrupados por estado.
  secciones: [
    {
      titulo: "En pruebas",
      nota: "Ya funcionando, validándose antes de abrir a todos.",
      proyectos: [
        {
          nombre: "Guías reemplazatorias (Ecom Scanner)",
          ticket: "PRM-745",
          estado: "En pruebas",
          estadoTono: "verde",
          nota: "Funcionando con Interrapidísimo, Coordinadora y TCC. Se abre de forma gradual.",
        },
        {
          nombre: "DropiGo",
          estado: "En pruebas",
          estadoTono: "verde",
          nota: "Integrando nuevas transportadoras.",
        },
        {
          nombre: "Oficinas de Interrapidísimo en orden manual",
          estado: "En pruebas",
          estadoTono: "verde",
          nota: "Al crear una orden manual con «recoger en oficina», el sistema consulta y muestra la oficina de Interrapidísimo que corresponde.",
        },
      ],
    },
    {
      titulo: "En desarrollo",
      nota: "Se está construyendo. Orden: fulfillment primero.",
      proyectos: [
        {
          nombre: "Parametrización de fulfillment",
          estado: "En diseño",
          estadoTono: "azul",
          nota: "Dos esquemas de cobro (mensual y diario). Va primero en la cola de desarrollo.",
        },
        {
          nombre: "Parametrización de tarifas",
          estado: "En desarrollo",
          estadoTono: "azul",
          nota: "Documento entregado a José para revisión. TI lo retoma al cerrar el cambio de moneda de Venezuela.",
        },
        {
          nombre: "Pruebas de entrega",
          estado: "En desarrollo",
          estadoTono: "azul",
          nota: "Se aprovechó un ajuste de ENVIA para incluirlo. ETA: la próxima semana.",
        },
      ],
    },
    {
      titulo: "Próximos desarrollos",
      nota: "En cola, arrancan al liberar lo de arriba.",
      proyectos: [
        {
          nombre: "Normalización de estados",
          ticket: "PRM-1297",
          estado: "Priorizado",
          estadoTono: "ambar",
          nota: "Homologar los estados del carrier para poder medir bien (habilita el tiempo por fase). Pasos: 1) revisar la propuesta final; 2) actualizar el mapa de estados agrupados; 3) presentar la propuesta y abrir mesas de trabajo.",
        },
        {
          nombre: "Selección de transportadoras (IA)",
          ticket: "PRM-1513",
          estado: "Por desarrollar",
          estadoTono: "gris",
          nota: "Ranking de carrier por zona ya definido. Pendiente de desarrollo; luego lanzamiento controlado por fases.",
        },
        {
          nombre: "Autoconfirmación de la orden",
          ticket: "PRM-1497",
          estado: "Experimento",
          estadoTono: "ambar",
          nota: "Arranca la próxima semana con los dropshippers más constantes (≥50 órd/mes). Reglas de madurez el martes con Michel. No aplica en zonas rurales, donde la devolución ya es alta.",
        },
        {
          nombre: "Same Day",
          ticket: "PRM-1366",
          estado: "En cola",
          estadoTono: "gris",
          nota: "Épica creada (PROD-1127). Inicia al liberar los proyectos en curso.",
        },
        {
          nombre: "Módulo de novedades — Forza (Guatemala)",
          estado: "En evaluación",
          estadoTono: "gris",
          nota: "Forza no tiene un proceso de novedades documentado. Se revisa con mejora continua antes de decidir si se construye.",
        },
      ],
    },
    ] as SeccionProyectos[],
  },
];

// Compat: la última semana (para importadores que esperan un solo weekly).
export const weekly = weeklies[0];

// ── Cronograma — cola de desarrollo + frentes + experimentos (para Maria) ─────
// Modelo (idea de Juan): el CUELLO es la capacidad de desarrollo — ~1 dev,
// ~6 sem/proyecto, secuencial. Los proyectos "listos PM" esperan slot de dev.
// Aparte: frentes de discovery (metodología completa ~5 sem) y experimentos (POC).
// Meses: 0=Jul'26 … 11=Jun'27. Ventanas estimadas salvo lo ya cerrado; las
// fechas duras salen del Cell Board / Delivery, no se inventan.
export type CronoTono = "verde" | "azul" | "ambar" | "gris" | "morado" | "rojo";

export type ColaItem = {
  proyecto: string; ticket?: string;
  listoLabel: string; listoMes: number; // handoff PM listo
  devInicio: number; devFin: number; // ventana de dev (meses, fraccional)
  hito: string; estado: string; tono: CronoTono;
  kr?: string; nota?: string;
};
export type FaseTono = "explora" | "define" | "disena" | "dev" | "pais";
export type FrenteFase = { label: string; inicio: number; fin: number; tono: FaseTono };
export type FrenteItem = {
  proyecto: string; ticket?: string;
  fases: FrenteFase[];
  handoffMes?: number; // hand off = 1 punto
  nota?: string;
};
export type ExperimentoCrono = {
  proyecto: string; ticket?: string;
  researchInicio: number; researchFin: number;
  expInicio: number; expFin: number; handoff: string; nota?: string;
};

export const cronograma = {
  meses: ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  trimestres: [
    { label: "Q3 2026", desde: 0, hasta: 2, clase: "q3" },
    { label: "Q4 2026", desde: 3, hasta: 5, clase: "q4" },
    { label: "Q1 2027", desde: 6, hasta: 8, clase: "q1" },
    { label: "Q2 2027", desde: 9, hasta: 11, clase: "q2" },
  ],
  hoy: 0.3,
  meta: "Meta del camino: Colombia entrega sobre creadas 62,5% → ~67% en Q3, rumbo a 70%.",

  colaAlerta: {
    titulo: "Venezuela/Binance en dev · 4 proyectos con handoff PM listo esperando slot",
    detalle:
      "El dev está hoy en Venezuela/Binance (cierra jul); al liberar arranca Selección de transportadoras (IA) → Fulfillment → Tarifas → Pruebas de entrega. El cuello es la capacidad de desarrollo: ~1 dev · ~6 sem/proyecto · secuencial. Ventanas estimadas, por confirmar en Cell Board / Delivery.",
  },
  cola: [
    { proyecto: "Venezuela · cambio de moneda (Binance)", listoLabel: "En dev · jul", listoMes: 0, devInicio: 0, devFin: 1, hito: "√ ~jul", estado: "En dev", tono: "verde", kr: "desbloquea Tarifas + operación VE", nota: "En desarrollo ahora. Cierra en julio; al liberar arranca Selección de transportadoras (IA)." },
    { proyecto: "Selección de transportadoras (IA)", ticket: "PRM-1219", listoLabel: "Listo · jul", listoMes: 0, devInicio: 1, devFin: 2.5, hito: "√ ~sep", estado: "En cola de dev", tono: "azul", kr: "KR2.1 · baja devolución por zona", nota: "Arranca al cerrar Venezuela. Ranking carrier×zona (IA). Épica dev DROP-17946." },
    { proyecto: "Parametrización de fulfillment", ticket: "PRM-1446", listoLabel: "Listo · 9-jul", listoMes: 0, devInicio: 2.5, devFin: 4, hito: "√ ~nov", estado: "En cola de dev", tono: "azul", kr: "+$380M COP/mes (Colombia)", nota: "Listo YA. Alto impacto (+$380M/mes) — candidato a adelantar si se libera el dev." },
    { proyecto: "Parametrización de tarifas", ticket: "PRM-1362", listoLabel: "Listo · jul", listoMes: 0, devInicio: 4, devFin: 5.5, hito: "√ ~dic", estado: "En cola de dev", tono: "azul", kr: "KR3.1 · margen del flete", nota: "Listo PM; se desbloquea al cerrar el cambio de moneda de Venezuela." },
    { proyecto: "Pruebas de entrega (POD)", ticket: "PRM-1364", listoLabel: "Listo · jul", listoMes: 0, devInicio: 5.5, devFin: 7, hito: "√ ~feb", estado: "Despriorizado · listo", tono: "gris", kr: "evidencia en reclamos", nota: "Despriorizado pero listo para hand off. Doble verificación EcomScanner + carrier." },
  ] as ColaItem[],

  // Frentes de discovery — fases diferenciadas (definición → diseño → hand off • → desarrollo → países).
  // Discovery corre 2 en paralelo (WIP 2): al cerrar Same Day arranca Notif. de optimización.
  frentes: [
    { proyecto: "Same Day", ticket: "PRM-1366", handoffMes: 3.4, fases: [
      { label: "Exploración", inicio: 0, fin: 1.3, tono: "explora" },
      { label: "Definición", inicio: 1.3, fin: 2.6, tono: "define" },
      { label: "Diseño", inicio: 2.6, fin: 3.4, tono: "disena" },
    ], nota: "Metodología completa: exploración → definición → diseño → hand off → desarrollo." },
    { proyecto: "Normalización de estados", ticket: "PRM-1297", handoffMes: 2, fases: [
      { label: "Propuesta / definición", inicio: 0, fin: 1, tono: "define" },
      { label: "Diseño", inicio: 1, fin: 2, tono: "disena" },
      { label: "Desarrollo · Colombia", inicio: 2, fin: 4, tono: "dev" },
      { label: "Países", inicio: 4, fin: 6, tono: "pais" },
    ], nota: "Colombia primero (reajustes), luego expansión a países. Primer paso: hacer la cadena (oportunidad → idea → solución)." },
    { proyecto: "Notif. de optimización (AI)", ticket: "PRM-749", handoffMes: 6, fases: [
      { label: "Definición", inicio: 3, fin: 5, tono: "define" },
      { label: "Diseño", inicio: 5, fin: 6, tono: "disena" },
      { label: "Desarrollo", inicio: 6, fin: 8, tono: "dev" },
    ], nota: "Arranca al terminar Same Day (discovery en paralelo, WIP 2). La definición toma más iteración." },
  ] as FrenteItem[],

  experimentos: [
    { proyecto: "Autoconfirmación", ticket: "PRM-1497", researchInicio: 0, researchFin: 0.4, expInicio: 0.4, expFin: 2, handoff: "Handoff TI ? · ~sep", nota: "Prototipo en pruebas; guardarraíl zona rural." },
    { proyecto: "Autogeneración de guías", ticket: "PRM-1469", researchInicio: 0.3, researchFin: 0.7, expInicio: 0.7, expFin: 2.3, handoff: "Handoff TI ? · ~sep", nota: "Listo para probar; proveedores de alto volumen." },
  ] as ExperimentoCrono[],

  kpiTrimestre: [
    { label: "Q3 · Jul – Sep", clase: "q3", puntos: ["Venezuela/Binance cierra en jul → desbloquea Tarifas", "Selección de transportadoras (IA) entra a desarrollo", "Experimentos Autoconfirmación + Autogeneración en curso", "Entrega Colombia s/creadas 62,5% → ~67%"] },
    { label: "Q4 · Oct – Dic", clase: "q4", puntos: ["Fulfillment (+$380M/mes) + Tarifas entregados", "Same Day MVP · Normalización expande a países", "Notificaciones de optimización (PRM-749) arranca", "Pagos dentro del COD (propuesta)"] },
  ],

  supuestos: [
    "Capacidad de desarrollo: ~1 dev · ~6 sem/proyecto · secuencial → la COLA es el cuello real, no la falta de proyectos.",
    "El dev está hoy en Venezuela/Binance (cierra jul). Listos PM esperando slot: Selección · Fulfillment · Tarifas · Pruebas de entrega.",
    "Discovery con metodología completa (~5 sem: exploración → diseño → iteración → concepto → definición): Same Day · Normalización (países) · Notificaciones de optimización. La definición toma más iteración.",
    "Experimentos (POC): construcción desde producto; handoff a TI condicional a resultados.",
    "Ventanas por mes estimadas; las fechas duras salen del Cell Board / Delivery, no se inventan.",
  ],
};

// ── Pendientes (fuente real: bloque marcado en planning/todos.md) ─────────────
// El array se movió a lib/pendientes.ts (getPendientes), que lee el .md en cada
// build — nada se hardcodea aquí para que no se desincronice del archivo fuente.
export type Prioridad = "Alta" | "Media" | "Baja";
export type Pendiente = { texto: string; prioridad: Prioridad; proyecto: string };
