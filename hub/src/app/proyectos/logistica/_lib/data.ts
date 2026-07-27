// ─────────────────────────────────────────────────────────────────────────────
// Contenido del tablero — sembrado desde el cerebro de Juan (Logistic Success).
// Home = INDICADORES. Frame propio: cadena de valor de la orden + experimentos.
// Datos fijos por ahora; en Fase 2 se mueve a Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import { RPP_BASE_URL } from "@/lib/rpp";

const JIRA = "https://dropi-it.atlassian.net/browse/";

// Prototipo en el Rapid Prototype (repo dropi-prototypes, Angular). En prod
// resuelve a dropitesters.co; en local al `ng serve` en :4200 — por eso se
// construye con RPP_BASE_URL y no con la URL escrita a mano.
//
// ⚠️ Solo enlazar rutas que estén en `main` de dropi-prototypes: es lo que se
// despliega. Una ruta que vive solo en una rama da 404 en dropitesters.co.
function rpp(ruta: string) {
  return `${RPP_BASE_URL}/${ruta}`;
}
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

// ── Registro único de iniciativas, clavadas a su etapa ───────────────────────
//
// Antes había un solo enum `fase` que mezclaba tres cosas distintas (qué es,
// en qué punto va, y si está bloqueado), y por eso el tablero se contradecía
// con el cronograma y con el weekly. Ahora son TRES ejes explícitos, los
// mismos que ya usa Darwin en Supabase (`projects.type` / `status` /
// `handoff_status`, ver hub/supabase/016_darwin_core.sql y
// 031_darwin_celula_logistica.sql):
//
//   tipo    → QUÉ es (Idea · Oportunidad · Experimento · Proyecto · Lanzamiento)
//   fase    → DÓNDE va dentro de su ciclo
//   handoff → si TI ya puede tomarlo
//   bloqueo → por qué NO avanza (nunca se codifica como si fuera una fase)
//
// `codigo` es el LOG-XXX de Supabase: es la llave para cruzar este tablero con
// /celula/logistica. Si un proyecto no tiene código todavía, es que aún no está
// registrado en Darwin — eso mismo es un pendiente visible.
export type TipoIniciativa = "Idea" | "Oportunidad" | "Experimento" | "Proyecto" | "Lanzamiento";
export type FaseIniciativa =
  | "Backlog"
  | "Research"
  | "Discovery"
  | "Definición"
  | "Diseño"
  | "Listo para handoff"
  | "En desarrollo"
  | "Beta"
  | "Lanzado";
export type Handoff = "No aplica" | "Pendiente" | "Listo para handoff" | "Handoff hecho";

// Un link es un link: Jira, Figma, prototipo, doc E2E, carpeta de Drive. Todo
// lo que exista de una iniciativa cuelga de aquí para que sea alcanzable desde
// cualquier vista (mapa, ficha, registro, experimentos, cronograma).
export type LinkTipo = "jira" | "figma" | "prototipo" | "poc" | "doc" | "drive" | "tablero";
export type LinkRef = { tipo: LinkTipo; label: string; href: string; falta?: boolean };

export const LINK_ICONO: Record<LinkTipo, string> = {
  jira: "🎫", figma: "🎨", prototipo: "🖥️", poc: "🧪", doc: "📄", drive: "📁", tablero: "🧭",
};

export type Proyecto = {
  nombre: string;
  slug: string;
  codigo?: string; // LOG-XXX en Supabase (undefined = no registrado en Darwin)
  etapa: string;
  tipo: TipoIniciativa;
  fase: FaseIniciativa;
  handoff: Handoff;
  bloqueo?: string;
  ticket?: string;
  destacado?: boolean;
  descripcion: string;
  foco: string;
  links?: LinkRef[];
  experimentos?: string[]; // slugs de `experimentos` — relación explícita, no adivinada
  /** Etapas adicionales que el proyecto toca (transversales). Se muestran como
   *  highlight secundario en la cadena de valor de la ficha detalle. */
  etapasRelacionadas?: { etapa: string; rol: string }[];
  /**
   * Estado operativo tal como está HOY en Jira, literal. No es lo mismo que
   * `fase` (nuestra lectura) ni que `handoff`: es lo que ve cualquiera que abra
   * el ticket. Cuando no coincide con `fase`, esa diferencia es el hallazgo —
   * verificado ticket por ticket el 22-jul en
   * logistica-lab/estrategia/mapa-proyectos-3-ejes.md.
   */
  jira?: string;
  /** Estado de la documentación en el repo: ¿hay spec y está completo? */
  doc?: "completo" | "parcial" | "ninguno";
  /**
   * Ruta del entregable propio del proyecto, cuando tiene uno.
   * Si está, la ficha genérica NO se muestra: `proyecto/[slug]` redirige aquí y el
   * entregable lleva el contexto de la ficha en su cabecera. Un proyecto, una URL.
   */
  entregable?: string;
};

export function proyectoPorSlug(slug: string) {
  return proyectos.find((p) => p.slug === slug);
}

// Link de Jira construido desde el ticket — no necesita la API de Jira, solo la
// clave. Se antepone a los links propios de cada iniciativa.
export function linksDe(p: Proyecto): LinkRef[] {
  const jira = p.ticket ? [{ tipo: "jira" as const, label: p.ticket, href: JIRA + p.ticket }] : [];
  return [...jira, ...(p.links ?? [])];
}

// Orden = prioridad de trabajo, derivada del roadmap Q3 (estrategia/roadmap-q3-logistica.md):
// Fase 0 enabler → Fase 1 apuestas activas → Fase 2 construcción → Fase 3 terceros → casi cerrados.
// NO es orden por cadena de valor (ese es el eje del mapa /mapa). Ajustar aquí si cambia la prioridad.
export const proyectos: Proyecto[] = [
  {
    nombre: "Autoconfirmación de órdenes (movilización)",
    slug: "movilizacion",
    codigo: "LOG-001",
    etapa: "Confirmación", tipo: "Experimento", fase: "Research", handoff: "Pendiente",
    ticket: "PRM-1497", destacado: true,
    descripcion:
      "Confirmar automáticamente las órdenes de los dropshippers maduros, para que dejen de quedarse fuera de la red esperando una acción manual.",
    foco: "Fuga #1. 317K órdenes >24h en confirmar (prom. 11,18h). Se valida con experimento antes de comprometer desarrollo; el handoff a TI es condicional al resultado.",
    links: [
      { tipo: "prototipo", label: "Simulador de reglas (aquí en el tablero)", href: "/proyectos/logistica/experimentos/autoconfirmacion" },
      // El prototipo RPP existe (old/configuraciones/configuracion-de-tienda,
      // commit 8d2bd14) pero vive SOLO en la rama
      // wireframe/DROP-configuracion-pedidos-autoconfirmacion. Hasta que se
      // mergee a main no está en dropitesters.co, así que enlazarlo daría 404.
      { tipo: "prototipo", label: "RPP · Configuración de tienda (falta merge a main)", href: "", falta: true },
    ],
    experimentos: ["autoconfirmacion"],
  },
  {
    nombre: "Autogeneración de guías",
    slug: "autogeneracion-guias",
    etapa: "Despacho", tipo: "Experimento", fase: "Research", handoff: "Pendiente",
    ticket: "PRM-1469",
    descripcion:
      "Al confirmar la orden, generar la guía automáticamente para que el alistamiento no espere una acción manual más.",
    foco: "Hermano de autoconfirmación: ataca la fase 'Generación de guía' (10,37h prom.). No es una pantalla aparte — es una pestaña de la MISMA configuración, pero vista desde el PERFIL PROVEEDOR (el de autoconfirmación es el del dropshipper). Listo para probar; beneficia a proveedores de alto volumen. NO registrado todavía en Darwin (sin código LOG).",
    links: [
      // Misma pantalla que autoconfirmación (old/configuraciones/configuracion-de-tienda),
      // otra pestaña y otro perfil. Igual que aquella, espera el merge a main.
      { tipo: "prototipo", label: "RPP · Config. de tienda · perfil proveedor (falta merge a main)", href: "", falta: true },
    ],
    experimentos: ["autogeneracion-guias"],
  },
  {
    nombre: "Vigía — control operativo en tiempo real",
    slug: "vigia",
    etapa: "Tránsito", tipo: "Experimento", fase: "Diseño", handoff: "No aplica",
    jira: "⚠️ No existe en Jira",
    doc: "parcial",
    destacado: true,
    descripcion:
      "Extensión de Chrome (Manifest V3) que intercepta el API de Dropi, calcula SLAs automáticamente por estado de orden e inyecta alertas accionables directamente en el dashboard — para ambos roles (Dropshipper y Proveedor). Actúa ANTES del desenlace: da visibilidad sobre qué órdenes están en riesgo para que el usuario corrija antes de que se caigan.",
    foco: "Dueño: Michel Pino. Diseño en curso, sin desarrollo técnico (confirmado 22-jul). Es la única iniciativa transversal a toda la cadena de valor: monitorea desde Confirmación (POR CONFIRMAR 12h, PENDIENTE 24h) hasta Novedad (24h), pasando por Despacho (GUÍA GENERADA 48h, RECOGIDO 24h) y Tránsito (EN TRÁNSITO 72h). Cruza directamente las fugas ② devolución (~26%) y ④ novedad porque su valor es anticipar el problema, no reaccionar después. Para el Dropshipper: SLA por orden, WhatsApp directo al proveedor con número real del API, breakdown por estado, $ en riesgo. Para el Proveedor: SLA sobre lo que controla (confirmar, despachar, generar guía) + monitor de stock por bodega con alertas de quiebre. Stack: interceptor fetch/XHR en MAIN world → motor SLA puro → inyección visual Angular-resilient con polling 2s. GATE: mientras sea diseño está bien, pero el día que entre a desarrollo necesita ticket, métrica y spec o se construye a ciegas.",
    etapasRelacionadas: [
      { etapa: "Confirmación", rol: "POR CONFIRMAR (12h) · PENDIENTE (24h) — el proveedor no confirma o no despacha" },
      { etapa: "Despacho", rol: "GUÍA GENERADA (48h) · RECOGIDO (24h) — alerta si la guía no se recoge a tiempo" },
      { etapa: "Tránsito", rol: "EN TRÁNSITO (72h) — monitoreo activo del paquete en la red del carrier" },
      { etapa: "Entrega / Devolución", rol: "Prevención: el usuario ve el riesgo ANTES del desenlace y puede actuar" },
      { etapa: "Novedad / Posventa", rol: "NOVEDAD (24h) — escalamiento inmediato al carrier o al líder" },
    ],
    links: [
      { tipo: "prototipo", label: "Conceptualización interactiva", href: "/proyectos/logistica/experimentos/vigia" },
      { tipo: "doc", label: "Arquitectura v4 (Claude Code prompt)", href: "", falta: true },
    ],
    experimentos: ["vigia"],
  },
  {
    nombre: "Recolección proactiva",
    slug: "recoleccion-proactiva",
    etapa: "Despacho", tipo: "Experimento", fase: "Research", handoff: "No aplica",
    descripcion:
      "Que Dropi programe la recolección a la transportadora en vez de esperarla: saber qué está listo, quién recoge y quién no recogió.",
    foco: "Conecta con la fase 'Recogido por Dropi' (8,28h, cumplimiento 80,64% — el peor de la ruta Dropi). Ya hay prototipo: mapa de guías preparadas sin recoger por territorio DANE, con datos mock (falta la respuesta de Data sobre cobertura por municipio). Sin ticket ni código LOG.",
    links: [
      { tipo: "prototipo", label: "Control de recolecciones", href: "/proyectos/logistica/recolecciones" },
      { tipo: "doc", label: "Hallazgos de recolecciones (Growth Ops)", href: "", falta: true },
    ],
    experimentos: ["recoleccion-proactiva"],
  },
  {
    nombre: "Selección inteligente de transportadoras",
    slug: "seleccion-transportadoras",
    codigo: "LOG-004",
    etapa: "Generación", tipo: "Experimento", fase: "Research", handoff: "Pendiente",
    ticket: "PRM-1513",
    jira: "⚠️ En Ruta (backlog), SIN ASIGNAR — aunque el Delivery Backlog lo da en ejecución",
    doc: "completo",
    bloqueo:
      "Sin acceso a Chronos para crear las tablas que faltan → el PoC no se puede volver a levantar en la cuenta de AWS de IA. Juan Felipe Cubillos coordina los accesos con Jaime.",
    descripcion: "Elegir automáticamente la mejor transportadora por zona para bajar la devolución y mejorar la entrega.",
    foco: "Ranking carrier × zona (POC 72%). PM: Kate Pencue; Juan actúa como Carrier Ops. Épica dev DROP-17946. Δ 20–27 pp de devolución entre carriers en la misma zona. Es el único con documentación completa.",
    links: [
      { tipo: "poc", label: "PoC en AWS (cuenta de IA)", href: "", falta: true },
      { tipo: "figma", label: "Diseño en Figma", href: "", falta: true },
      { tipo: "doc", label: "Documentación completa", href: "", falta: true },
    ],
    experimentos: ["ruteo-carrier-zona"],
  },
  {
    nombre: "Normalización de estados",
    slug: "normalizacion-estados",
    codigo: "LOG-007",
    etapa: "Tránsito", tipo: "Proyecto", fase: "Definición", handoff: "Pendiente",
    ticket: "PRM-1297", destacado: true,
    jira: "Investigación y definición",
    doc: "completo",
    entregable: "/proyectos/logistica/normalizacion-estados",
    descripcion: "Homologar los estados del carrier para poder medir bien (sin-cierre, tiempo por fases).",
    foco: "Prioridad #1 del Delivery Roadmap (WIP = 1). El mejor documentado de la célula (spec + CONTEXTO + propuesta + vista interactiva). Catálogo v0.1: crudo → homologado(26) → fase → vista cliente(8). Pendiente: 7 gates de decisión, 2 críticos y externos.",
    links: [{ tipo: "tablero", label: "Mapa de estados interactivo", href: "/proyectos/logistica/normalizacion-estados" }],
  },
  {
    nombre: "Parametrización de tarifas",
    slug: "tarifas",
    codigo: "LOG-006",
    etapa: "Generación", tipo: "Proyecto", fase: "Listo para handoff", handoff: "Listo para handoff",
    ticket: "PRM-1362",
    // Ojo: en Jira el ticket figura como `Hand off hecho` desde el 14-jul, pero
    // el estado que manda para la célula es "Listo para hand off" (decisión de
    // Juan, 22-jul): el E2E todavía necesita ajuste, así que no está entregado.
    jira: "Hand off hecho (14-jul) — pero el E2E aún necesita ajuste",
    doc: "completo",
    bloqueo: "Capacidad de TI: el dev está en el cambio de moneda de Venezuela (cierra jul). No es un bloqueo de producto.",
    descripcion: "Parametrizar el costo por orden (fletes) de forma clara y automática.",
    foco: "OKR 3 de compañía. Prototipo RPP construido (3 vistas). ⚠️ El doc E2E todavía necesita ajuste — no está listo para entregar tal cual. Espera slot de desarrollo.",
    links: [
      { tipo: "prototipo", label: "RPP · Parametrizar tarifas", href: rpp("old/parametrizar-tarifas") },
      { tipo: "prototipo", label: "RPP · Tarifas industrial", href: rpp("old/parametrizar-tarifas-industrial") },
      { tipo: "doc", label: "RPP · Docs de tarifas", href: rpp("old/parametrizar-tarifas-docs") },
      { tipo: "figma", label: "Diseño en Figma", href: "", falta: true },
      { tipo: "doc", label: "Doc E2E (falta ajustar)", href: "", falta: true },
    ],
  },
  {
    nombre: "Parametrización de fulfillment",
    slug: "fulfillment",
    etapa: "Despacho", tipo: "Proyecto", fase: "Listo para handoff", handoff: "Listo para handoff",
    ticket: "PRM-1446", destacado: true,
    jira: "Listo para hand off (14-jul), asignado a Juan",
    doc: "ninguno",
    bloqueo: "Capacidad de TI (cola de dev) + negociación de la mesa logística.",
    descripcion: "Parametrizar el cobro de fulfillment con sus dos esquemas (mensual y diario).",
    foco: "🔴 HUECO DE DOCUMENTACIÓN #1: es el único en 'Listo para hand off' sin nada en el repo. Bodegas 2PL en Bogotá, Cali y Medellín = 92.000 órdenes/mes; el cobro se activa solo al llegar a Entregado, así que 20–25% de las órdenes preparadas y despachadas nunca se cobran. Servicios prestados y no cobrados: almacenamiento, etiquetado manual, armado de kits y combos, multi-unidad. Prototipo RPP construido (PROD-648). NO registrado en Darwin pese a estar listo.",
    links: [
      { tipo: "prototipo", label: "RPP · Parametrizar fulfillment", href: rpp("old/fulfillment/parametrizar") },
      { tipo: "figma", label: "Diseño en Figma", href: "", falta: true },
      { tipo: "doc", label: "Doc E2E (falta ajustar)", href: "", falta: true },
    ],
  },
  {
    nombre: "Same Day",
    slug: "same-day",
    codigo: "LOG-005",
    etapa: "Despacho", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-1366",
    bloqueo: "Parqueado por WIP = 1 (Normalización de estados es la iniciativa activa). La ventana del cronograma es tentativa.",
    descripcion: "Entrega el mismo día para bodegas propias y Veloces.",
    foco: "MVP: flag SD + hora de corte + validación geo + selección guiada. Épica PROD-1127. Riesgo vivo: hoy con Veloces salen guías same day sin validación geográfica (Cali→Santa Marta).",
    links: [{ tipo: "figma", label: "Board de discovery (Michelle López)", href: "", falta: true }],
  },
  {
    nombre: "Guías reemplazatorias (Ecom Scanner)",
    slug: "guias-reemplazatorias",
    codigo: "LOG-009",
    etapa: "Novedad / Posventa", tipo: "Lanzamiento", fase: "Beta", handoff: "Handoff hecho",
    ticket: "PRM-745",
    descripcion: "Generar guías cuando el carrier no lee el código de barras (Ecom Scanner).",
    foco: "Ya no es discovery: está en lanzamiento con Laura (comunicación), operativo en Interrapidísimo, Coordinadora y TCC. Monitoreo de 3 semanas antes del despliegue global.",
  },
  {
    nombre: "Pruebas de entrega (POD)",
    slug: "pruebas-entrega",
    etapa: "Entrega / Devolución", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-1517",
    jira: "⚠️ Paraguas En Ruta y SIN ASIGNAR · PRM-1361 y PRM-1455 en Impedimentos",
    doc: "ninguno",
    bloqueo: "El proyecto paraguas (PRM-1517) no tiene dueño, y dos de las soluciones por transportadora están en Impedimentos. No se puede escribir el spec sobre eso.",
    descripcion: "Evidencia de los intentos de entrega (SLAs, foto con geolocalización), con una solución por transportadora.",
    foco: "🔴 HUECO DE DOCUMENTACIÓN #2. No es un ticket: son 8 — paraguas PRM-1517 (conectado a KR2.1) + solicitudes PRM-1364/1361 + soluciones por carrier PRM-1462 ENVIA, PRM-1455 Interrapidísimo, PRM-1610 Domina, PRM-1611 TIUI, PRM-618 Coordinadora. 💎 Dato enterrado en PRM-618: el 80% de las solicitudes del equipo de logística a las transportadoras son pruebas de entrega — es la solicitud más común.",
    links: [{ tipo: "doc", label: "Kickoff POD (PDF sin versionar)", href: "", falta: true }],
  },
  {
    nombre: "Validación y normalización de direcciones",
    slug: "validacion-direcciones",
    codigo: "LOG-002",
    etapa: "Confirmación", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-91",
    jira: "En Ruta (backlog) · ⚠️ el dueño en Jira es Katerine Pencue, no Juan",
    doc: "completo",
    bloqueo: "Conflicto de ownership: el Delivery Backlog lo pone a EJECUTAR en la célula, pero en Jira el dueño es Katerine Pencue. Resolver con Maria antes de trabajarlo.",
    descripcion: "Normalizar y validar la dirección en el momento de crearla, a nivel de plataforma.",
    foco: "Discovery del taller 24-jun. Está registrado en Darwin (LOG-002) pero no aparecía en este tablero.",
  },
  {
    nombre: "Dirección confiable + geo",
    slug: "direccion-geo",
    codigo: "LOG-003",
    etapa: "Confirmación", tipo: "Oportunidad", fase: "Discovery", handoff: "No aplica",
    descripcion: "Capturar y validar la ubicación del comprador para prevenir y recuperar novedades.",
    foco: "Todavía es oportunidad, no proyecto: no tiene alcance ni ticket propio. Cruza PRM-1497 / PRM-1512 / PRM-1523 y coordina con PRM-91. Experimento asociado: activar la validación en SHOP.",
    experimentos: ["validacion-shop", "encuesta-direccion"],
  },
  {
    nombre: "Herramienta preventiva de novedades (dueño y triaje)",
    slug: "novedad-triaje",
    codigo: "LOG-008",
    etapa: "Novedad / Posventa", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-1512",
    jira: "⚠️ En Ruta (backlog), SIN ASIGNAR — aunque el Delivery Backlog pide FINALIZARLO",
    doc: "completo",
    bloqueo: "Nadie lo tiene asignado en Jira. Alinear con Seller Success.",
    descripcion: "Dar dueño, SLA y triaje por motivo a las novedades para recuperar la orden, y avisar al comprador antes de que la devolución ocurra.",
    foco: "Absorbe lo que antes figuraba aparte como 'Notificaciones prevención de devoluciones': era el mismo PRM-1512 duplicado en dos fichas. Fuga ④, capa transversal + posventa.",
  },
  {
    nombre: "Reducir devoluciones (COD)",
    slug: "devoluciones-cod",
    codigo: "LOG-010",
    etapa: "Entrega / Devolución", tipo: "Idea", fase: "Backlog", handoff: "No aplica",
    ticket: "PRM-1523",
    descripcion: "Reducir la devolución atacándola DENTRO del COD (pago/gestión), nunca empujando prepago.",
    foco: "Backlog: no hay trabajo hecho todavía. Fuga ②. Direcciones a explorar: score de riesgo, triaje por motivo, anticipo/ConfioPagos.",
  },
  {
    nombre: "Torre de control / Tiempo por fases",
    slug: "torre-control",
    codigo: "LOG-011",
    etapa: "Tránsito", tipo: "Oportunidad", fase: "Discovery", handoff: "No aplica",
    descripcion: "Medir el tiempo de la orden por fases (F1→F5) para ver dónde se estanca.",
    jira: "⚠️ Sin ticket — falta crear el Proyecto OKR",
    doc: "completo",
    foco: "Enabler transversal: habilita el KPI de tiempo y a Normalización de estados. Hoy vive como medición, no como producto construido.",
    links: [{ tipo: "tablero", label: "Tiempo por fases (weekly)", href: "/proyectos/logistica/updates" }],
  },

  // ── Fuera del radar ────────────────────────────────────────────────────────
  // Salieron de barrer Jira por estado el 22-jul. Están a nombre de Juan, sin
  // documentación ni mención en ningún tablero. Se registran aquí justamente
  // para que dejen de ser invisibles: dos llevan 7 semanas en "Listo para hand
  // off" sin moverse, y eso es lo que infla esa columna.
  {
    nombre: "QR de recolección Veloces a proveedores",
    slug: "qr-recoleccion-veloces",
    etapa: "Despacho", tipo: "Proyecto", fase: "Listo para handoff", handoff: "Listo para handoff",
    ticket: "PRM-407",
    jira: "Listo para hand off desde el 01-jun",
    doc: "ninguno",
    bloqueo: "7 semanas parado sin moverse. Decisión pendiente: documentarlo y sacarlo, o bajarlo de estado.",
    descripcion: "QR de recolección de Veloces para los proveedores (Ecom).",
    foco: "Salió del barrido de Jira del 22-jul. Es uno de los dos que inflan la columna de hand-off.",
  },
  {
    nombre: "Embebido de imágenes",
    slug: "embebido-imagenes",
    etapa: "Generación", tipo: "Proyecto", fase: "Listo para handoff", handoff: "Listo para handoff",
    ticket: "PRM-796",
    jira: "Listo para hand off desde el 01-jun",
    doc: "ninguno",
    bloqueo: "7 semanas parado sin moverse. Misma decisión que PRM-407: sacarlo o bajarlo de estado.",
    descripcion: "Embebido de imágenes.",
    foco: "Salió del barrido de Jira del 22-jul. Sin contexto documentado — hay que abrir el ticket para saber de qué se trata.",
  },
  {
    nombre: "Garantías: de recolección a entrega",
    slug: "garantias-recoleccion-entrega",
    etapa: "Novedad / Posventa", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-118",
    jira: "Pre Hand off desde el 01-jun",
    doc: "ninguno",
    bloqueo: "Sin confirmar si sigue vivo.",
    descripcion: "Cubrir el tramo de garantías desde la recolección hasta la entrega.",
    foco: "Salió del barrido de Jira del 22-jul.",
  },
  {
    nombre: "Suppli CO · validación de transportadora",
    slug: "suppli-co",
    etapa: "Generación", tipo: "Proyecto", fase: "En desarrollo", handoff: "Handoff hecho",
    ticket: "PRM-1431",
    jira: "En Desarrollo desde el 22-jun",
    doc: "ninguno",
    descripcion: "Validación de transportadora para Suppli en Colombia.",
    foco: "Ya está en desarrollo y no figuraba en ningún tablero de la célula.",
  },
  {
    nombre: "Velocidad y calidad de integración de transportadoras",
    slug: "integracion-transportadoras",
    etapa: "Tránsito", tipo: "Proyecto", fase: "En desarrollo", handoff: "Handoff hecho",
    ticket: "PRM-1265",
    jira: "En Desarrollo desde el 05-jun",
    doc: "ninguno",
    descripcion: "Optimizar la velocidad y la calidad con que se integran nuevas transportadoras.",
    foco: "Ya está en desarrollo y no figuraba en ningún tablero de la célula.",
  },
  {
    nombre: "Reportes dashboard · fase 1",
    slug: "reportes-dashboard",
    etapa: "Tránsito", tipo: "Proyecto", fase: "En desarrollo", handoff: "Handoff hecho",
    ticket: "PRM-1067",
    jira: "En Desarrollo desde el 11-jun",
    doc: "ninguno",
    descripcion: "Primera fase de los reportes del dashboard.",
    foco: "Ya está en desarrollo y no figuraba en ningún tablero de la célula.",
  },
];

// ── Experimentos / hipótesis ─────────────────────────────────────────────────
export type EstadoExp = "Idea" | "Diseñado" | "Corriendo" | "Validado" | "Descartado";
export type Experimento = {
  slug: string;
  nombre: string;
  hipotesis: string;
  metrica: string;
  estado: EstadoExp;
  impacto: string;
  proyecto: string;
  proyectoSlug?: string; // relación explícita con `proyectos` (antes se adivinaba por texto)
  aprendizaje?: string;
  demoHref?: string;
  links?: LinkRef[];
};

export function experimentoPorSlug(slug: string) {
  return experimentos.find((e) => e.slug === slug);
}

export const experimentos: Experimento[] = [
  {
    slug: "autoconfirmacion",
    proyectoSlug: "movilizacion",
    links: [{ tipo: "figma", label: "Prototipo funcional", href: "", falta: true }],
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
    slug: "autogeneracion-guias",
    proyectoSlug: "autogeneracion-guias",
    nombre: "Autogeneración de guías al confirmar",
    hipotesis:
      "Generar la guía automáticamente al confirmar la orden recorta la fase de generación (10,37h prom.) sin degradar el alistamiento en bodega.",
    metrica: "Horas de la fase 'Generación de guía' + % de cumplimiento <24h (A/B sobre proveedores de alto volumen)",
    estado: "Diseñado",
    impacto: "3,20M órdenes pasan por esta fase · 325K críticas · cumplimiento 89,84%",
    proyecto: "Autogeneración de guías (PRM-1469)",
    aprendizaje:
      "Prototipo listo para probar; falta conseguir con quién correrlo. También impacta a brands, no solo a dropshippers (nota de Maria).",
    links: [{ tipo: "figma", label: "Prototipo funcional", href: "", falta: true }],
  },
  {
    slug: "recoleccion-proactiva",
    proyectoSlug: "recoleccion-proactiva",
    nombre: "Recolección proactiva a la transportadora",
    hipotesis:
      "Si Dropi programa la recolección en vez de esperarla —sabiendo qué está listo, quién recoge y quién no— baja el tiempo de la fase 'Recogido por Dropi' y se mueven más paquetes por ruta.",
    metrica:
      "[por cerrar con Growth Ops] — candidatas: horas de la fase Recogido por Dropi · % de recolecciones cumplidas · paquetes por ruta",
    estado: "Idea",
    impacto:
      "Fase 'Recogido por Dropi': 8,28h prom. y 80,64% de cumplimiento — el peor tramo de la ruta Dropi. 96K órdenes críticas.",
    proyecto: "Recolección proactiva",
    aprendizaje:
      "Tres palancas identificadas por Juan (10-jul): que Dropi programe la recolección; ir por el proveedor con muchos paquetes aunque no llegue al mínimo; agrupar proveedores cercanos en una ruta. Investigación E2E hecha con Growth Ops, falta cerrar hallazgos.",
    links: [{ tipo: "doc", label: "Hallazgos de recolecciones (Growth Ops)", href: "", falta: true }],
  },
  {
    slug: "validacion-shop",
    proyectoSlug: "direccion-geo",
    nombre: "Activar validación de dirección en SHOP",
    hipotesis: "Forzar la validación de dirección en integraciones sube la movilización.",
    metrica: "% de movilización / entregas netas (A/B sobre is_validated)",
    estado: "Diseñado",
    impacto: "618K sin validar · +11,9 pts entra red · ~90K entregas en juego",
    proyecto: "Movilización · Dirección+geo",
  },
  {
    slug: "motivos-cancelacion",
    proyectoSlug: "movilizacion",
    nombre: "Catálogo de motivos de cancelación (Colombia)",
    hipotesis: "Instrumentar el motivo revela la mitad ciega del no-mov (53%).",
    metrica: "% de no-movilización con causa registrada",
    estado: "Idea",
    impacto: "Barato · desbloquea la fuga #1",
    proyecto: "Movilización",
  },
  {
    slug: "ruteo-carrier-zona",
    proyectoSlug: "seleccion-transportadoras",
    nombre: "Ruteo por mejor carrier × zona",
    hipotesis: "Enrutar por el mejor carrier según zona baja la devolución.",
    metrica: "% de devolución por zona (post-ranking)",
    estado: "Corriendo",
    impacto: "Δ 20–27 pp entre carriers en la misma zona · POC 72%",
    proyecto: "Selección de transportadoras (PRM-1513)",
  },
  {
    slug: "encuesta-direccion",
    proyectoSlug: "direccion-geo",
    nombre: "Encuesta: ¿por qué no validan la dirección?",
    hipotesis: "El seller no valida por fricción/desconocimiento, no por falta de valor.",
    metrica: "Respuestas + motivos (Userpilot)",
    estado: "Diseñado",
    impacto: "Falta solo la URL/pantalla + Figma para lanzar (PROD-1086)",
    proyecto: "Dirección confiable + geo",
  },
  {
    slug: "vigia",
    proyectoSlug: "vigia",
    links: [{ tipo: "prototipo", label: "Conceptualización interactiva", href: "/proyectos/logistica/experimentos/vigia" }],
    nombre: "Vigía — control operativo en tiempo real para Dropi",
    demoHref: "/proyectos/logistica/experimentos/vigia",
    hipotesis:
      "Si el usuario (dropshipper o proveedor) puede ver en tiempo real qué órdenes están fuera de SLA, con acciones de un click (WhatsApp al proveedor/carrier, escalar, exportar), corrige antes de que la orden se caiga — reduciendo devoluciones y novedades sin recuperar.",
    metrica: "Candidatas: % de órdenes intervenidas que se recuperan vs. control · reducción de tiempo de reacción ante novedades (h) · efecto en tasa de devolución de usuarios con la extensión vs. sin ella",
    estado: "Diseñado",
    impacto: "Transversal a 5 de 6 etapas de la orden. Hoy el 59% se entrega (meta 70%). La fuga ② (devolución ~26%) y la fuga ④ (novedades sin recuperar) son las dos que Vigía ataca directamente porque actúa ANTES del desenlace. Con 3.4M órdenes/mes, cada punto porcentual de recuperación = ~34K órdenes. Los 6 umbrales SLA (12h–72h) cubren: POR CONFIRMAR, PENDIENTE, GUÍA GENERADA, RECOGIDO, EN TRÁNSITO, NOVEDAD. Para proveedores además incluye monitor de stock por bodega (rojo <10, naranja <50, amarillo <100 uds).",
    proyecto: "Vigía (sin ticket todavía)",
    aprendizaje:
      "La conceptualización v4 define dos módulos completos (Dropshipper + Proveedor) con auto-discovery de campos del API. El interceptor fetch/XHR en MAIN world ya funciona en la v3.2 actual. El riesgo principal es que Angular destruye el DOM — resuelto con polling 2s. El valor no es solo la alerta: es que el WhatsApp sale con el número REAL del proveedor, pre-armado con el contexto de la orden. Sin eso, el dropshipper tiene que buscar el contacto manualmente.",
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
  // ── Semana 21 – 25 jul 2026 (actual) ────────────────────────────────────────
  {
    id: "2026-w30",
    fecha: "Jueves 24 de julio de 2026",
    semana: "Semana 21 – 25 jul",
    foco:
      "Semana de discovery y validación en campo: se revisó Recolecciones, arrancaron las entrevistas de Autoconfirmación (6 hechas) y se lanzó la prueba de Recolección proactiva (2.000 guías nuevas). El indicador mensual no tiene cierre nuevo desde junio; el avance de la semana fue definir el dashboard de indicadores con Diana.",

    comparacionMensual: {
      titulo: "Cierre junio — sin cierre nuevo esta semana",
      alcance: "Consolidado de 9 países, ponderado por volumen. Junio sigue siendo el último mes cerrado.",
      lectura:
        "No hay dato mensual nuevo: el cierre de julio aún no madura. El movimiento del indicador esta semana fue de gobierno, no de cifra — se trabajó con Diana la definición del dashboard de indicadores (qué entra, quién lo alimenta y con qué cadencia). La movilización de junio sigue plana; las palancas para moverla (Autoconfirmación, Recolección proactiva) están justo en validación.",
      entregaNota:
        "% entrega sigue sin ser comparable hasta tener el export por cohorte de Data. Sin novedad frente al 17-jul.",
      filas: [
        { metrica: "Movilización", abril: "81,9%", mayo: "82,3%", junio: "82,3%", delta: "≈ 0 · plano", tono: "alerta" },
        { metrica: "No movilizado", abril: "700.281", mayo: "716.957", junio: "737.865", delta: "+20.908", tono: "malo" },
        { metrica: "Órdenes", abril: "3,86M", mayo: "4,04M", junio: "4,17M", delta: "+3,3%", tono: "bueno" },
      ],
    },

    avanceInvestigacion: {
      titulo: "Investigación de oportunidades por fase",
      descripcion: "La fase 'Recogido por Dropi' pasa de mapeo a validación en campo: Recolecciones (control de guías sin recoger) + la prueba de Recolección proactiva.",
      pasos: [
        { nombre: "Confirmación", detalle: "Oportunidades levantadas + entrevistas Autoconfirmación (6)", estado: "listo" },
        { nombre: "Generación de guía", detalle: "Oportunidades levantadas", estado: "listo" },
        { nombre: "Recogido por Dropi", detalle: "Recolecciones revisado + prueba proactiva (2.000 guías)", estado: "activo" },
        { nombre: "Conectar el flujo", detalle: "Siguiente paso", estado: "siguiente" },
      ],
    },

    focoSiguienteSemana: [
      "Autoconfirmación: sintetizar las 6 entrevistas (ChateaPro, Mauricio Corzo, líderes de comunidad, dropshipper grande) en aprendizajes y guardarraíles — Responsable: Juan Diego.",
      "Recolección proactiva: leer el resultado de las 2.000 guías enviadas y decidir si escala — Responsable: Juan Diego / William.",
      "POC Selección de transportadoras: cerrar el siguiente paso tras el análisis técnico con TI (Francisco Ramírez) — Responsable: Juan (Carrier Ops) / Kate (PM).",
      "Normalización de estados: cerrar la propuesta tras la reunión de homologación — Responsable: Juan Diego.",
    ],

    indicadores: [
      {
        nombre: "Movilización consolidada",
        valor: "82,3%",
        tono: "alerta",
        estado: "Plano",
        nota: "Sin cierre nuevo desde junio. Se mantiene el último dato consolidado.",
      },
      {
        nombre: "Órdenes no movilizadas",
        valor: "737.865",
        tono: "malo",
        estado: "+20.908",
        nota: "Dato de junio. Las palancas para moverlo (Autoconfirmación, Recolección proactiva) están en validación esta semana.",
      },
      {
        nombre: "Dashboard de indicadores",
        valor: "En definición",
        tono: "alerta",
        estado: "Acuerdos con Diana",
        nota: "Se trabajó qué indicadores entran, quién los alimenta y con qué cadencia. [confirmar detalle con Juan]",
      },
    ] as IndicadorHoy[],

    // Formato ejecutivo: usa comparación mensual + secciones. Estos campos se
    // conservan por compatibilidad con el render de semanas históricas.
    brecha: {
      actual: 73.5, actualLabel: "73,5% crudo CO",
      meta: 70, metaLabel: "70%",
      gap: "No comparable", metaQ3: "Pendiente cohorte",
      paisFoco: "Colombia representa 73% del negocio.",
      lectura: "Junio sigue madurando; no se usa esta cifra para evaluar el KR.",
      fugas: [],
    },
    tiempo: {
      lectura: "La investigación de reducción de tiempos avanza en la fase 'Recogido por Dropi' con Recolecciones y la prueba de Recolección proactiva.",
      dropi: [
        { fase: "Ruta Dropi hasta transportadora", horas: 44.9, metaHoras: 24, responsable: "Célula", palanca: "validación en campo de la fase de recolección" },
      ],
      carrier: [
        { fase: "Maduración de entrega", horas: 24, metaHoras: 24, palanca: "comparar cohortes cerradas" },
      ],
      proximosPasos: ["Leer el resultado de la prueba de Recolección proactiva (2.000 guías) y del control de Recolecciones."],
    },
    hallazgos: [],

    secciones: [
      {
        titulo: "Product Road map · investigación",
        nota: "Discovery con datos antes de comprometer desarrollo.",
        proyectos: [
          {
            nombre: "Recolecciones",
            estado: "Revisado esta semana",
            estadoTono: "verde",
            nota: "Se revisó el control de recolecciones (guías preparadas sin recoger por territorio DANE: 1.604 bodegas, 61.106 guías). Conecta con la fase 'Recogido por Dropi', el cumplimiento más bajo de la ruta Dropi. El prototipo ya carga con datos reales en el tablero.",
          },
          {
            nombre: "POC selección de transportadoras",
            ticket: "PRM-1513",
            estado: "Análisis técnico con TI",
            estadoTono: "ambar",
            nota: "Reunión con Katerine (PM) sobre el POC + análisis técnico-conceptual con TI (Francisco Ramírez, Cubillos, Reinoso). Jira sigue En Ruta / backlog, sin asignar. [confirmar conclusión del análisis técnico con Juan]",
          },
          {
            nombre: "Normalización de estados",
            ticket: "PRM-1297",
            estado: "Inv. y definición",
            estadoTono: "azul",
            nota: "Reunión de homologación de estados esta semana. Homologa estados de orden y guía en un catálogo común para mejorar trazabilidad, medición y experiencia. [confirmar si la propuesta quedó cerrada]",
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
            estado: "Entrevistas en curso (6)",
            estadoTono: "ambar",
            nota: "Se hicieron 6 entrevistas para entender cómo confirman hoy: ChateaPro, Mauricio Corzo, líderes de comunidad y 1 dropshipper grande. Alimentan las reglas de madurez y los guardarraíles del experimento. Siguiente hito: sintetizar aprendizajes.",
          },
          {
            nombre: "Recolección proactiva",
            estado: "Prueba lanzada",
            estadoTono: "verde",
            nota: "Se enviaron 2.000 guías nuevas como prueba de recolección proactiva. Ataca la fase 'Recogido por Dropi'. Pendiente: leer el resultado y decidir si escala.",
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
            nota: "Prioridad #1 del Delivery. Discovery y definición del catálogo en curso.",
          },
          {
            nombre: "Same Day",
            ticket: "PRM-1366",
            estado: "Inv. y definición",
            estadoTono: "gris",
            nota: "En cola; no compite con el WIP activo.",
          },
          {
            nombre: "Fulfillment",
            ticket: "PRM-1446",
            estado: "Listo para hand off",
            estadoTono: "ambar",
            nota: "Diseño validado, en 'Listo para hand off' pero sin documentación en el repo (hueco #1). Bodegas 2PL Bogotá/Cali/Medellín, 92.000 órdenes/mes; 20–25% se despacha y nunca se cobra.",
          },
        ],
      },
    ] as SeccionProyectos[],
  },

  // ── Semana 13 – 17 jul 2026 ─────────────────────────────────────────────────
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
  proyecto: string; ticket?: string; slug?: string;
  fases: FrenteFase[];
  handoffMes?: number; // hand off = 1 punto
  nota?: string;
  // `tentativa` = la ventana está planeada pero el frente NO está activo hoy
  // (p. ej. parqueado por WIP = 1). Se dibuja punteada para no leerse como
  // trabajo en curso — que era justo la contradicción con el weekly.
  tentativa?: boolean;
  estadoHoy?: string;
};
export type ExperimentoCrono = {
  proyecto: string; ticket?: string; slug?: string;
  researchInicio: number; researchFin: number;
  expInicio: number; expFin: number; handoff: string; nota?: string;
  tentativa?: boolean;
  bloqueo?: string;
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
    { proyecto: "Selección de transportadoras (IA)", ticket: "PRM-1219", listoLabel: "Listo · jul", listoMes: 0, devInicio: 1, devFin: 2.5, hito: "√ ~sep", estado: "Bloqueado · accesos", tono: "rojo", kr: "KR2.1 · baja devolución por zona", nota: "⚠️ El bloqueo real NO es Venezuela: falta acceso a Chronos para crear las tablas y volver a levantar el PoC en la cuenta de AWS de IA (Juan Felipe Cubillos ↔ Jaime). Ranking carrier×zona. Épica dev DROP-17946." },
    { proyecto: "Parametrización de fulfillment", ticket: "PRM-1446", listoLabel: "Listo · 9-jul", listoMes: 0, devInicio: 2.5, devFin: 4, hito: "√ ~nov", estado: "En cola de dev", tono: "azul", kr: "+$380M COP/mes (Colombia)", nota: "Listo YA. Alto impacto (+$380M/mes) — candidato a adelantar si se libera el dev." },
    { proyecto: "Parametrización de tarifas", ticket: "PRM-1362", listoLabel: "Listo · jul", listoMes: 0, devInicio: 4, devFin: 5.5, hito: "√ ~dic", estado: "En cola de dev", tono: "azul", kr: "KR3.1 · margen del flete", nota: "Listo PM; se desbloquea al cerrar el cambio de moneda de Venezuela." },
    { proyecto: "Pruebas de entrega (POD)", ticket: "PRM-1364", listoLabel: "Listo · jul", listoMes: 0, devInicio: 5.5, devFin: 7, hito: "√ ~feb", estado: "Despriorizado · listo", tono: "gris", kr: "evidencia en reclamos", nota: "Despriorizado pero listo para hand off. Doble verificación EcomScanner + carrier." },
  ] as ColaItem[],

  // Frentes de discovery — fases diferenciadas (definición → diseño → hand off • → desarrollo → países).
  // Discovery corre 2 en paralelo (WIP 2): al cerrar Same Day arranca Notif. de optimización.
  frentes: [
    { proyecto: "Same Day", ticket: "PRM-1366", slug: "same-day", handoffMes: 3.4, tentativa: true, estadoHoy: "Parqueado · WIP = 1", fases: [
      { label: "Exploración", inicio: 0, fin: 1.3, tono: "explora" },
      { label: "Definición", inicio: 1.3, fin: 2.6, tono: "define" },
      { label: "Diseño", inicio: 2.6, fin: 3.4, tono: "disena" },
    ], nota: "Ventana TENTATIVA: hoy está parqueado porque el WIP activo es Normalización de estados. Se conserva la planeación, pero no está corriendo." },
    { proyecto: "Normalización de estados", ticket: "PRM-1297", slug: "normalizacion-estados", estadoHoy: "Activo · prioridad #1", handoffMes: 2, fases: [
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
    { proyecto: "Autoconfirmación", ticket: "PRM-1497", slug: "movilizacion", researchInicio: 0, researchFin: 0.4, expInicio: 0.4, expFin: 2, handoff: "Handoff TI ? · ~sep", nota: "Prototipo en pruebas; guardarraíl zona rural." },
    { proyecto: "Autogeneración de guías", ticket: "PRM-1469", slug: "autogeneracion-guias", researchInicio: 0.3, researchFin: 0.7, expInicio: 0.7, expFin: 2.3, handoff: "Handoff TI ? · ~sep", nota: "Listo para probar; proveedores de alto volumen." },
    { proyecto: "Selección de transportadoras", ticket: "PRM-1513", slug: "seleccion-transportadoras", researchInicio: 0, researchFin: 0.6, expInicio: 0.6, expFin: 2.2, handoff: "Handoff TI ? · ~sep", tentativa: true, bloqueo: "Sin acceso a Chronos", nota: "El PoC existe pero no se puede levantar: faltan accesos a Chronos para crear las tablas en la cuenta de AWS de IA (Juan Felipe ↔ Jaime). La ventana es tentativa hasta que se resuelvan los accesos." },
    { proyecto: "Vigía (extensión de órdenes)", slug: "vigia", researchInicio: 0.5, researchFin: 1.5, expInicio: 1.5, expFin: 3, handoff: "Handoff TI ? · ~oct", tentativa: true, nota: "Nuevo. Research primero: falta definir la métrica y conseguir el prototipo. Sin ticket todavía." },
    { proyecto: "Recolección proactiva", slug: "recoleccion-proactiva", researchInicio: 0.4, researchFin: 1.6, expInicio: 1.6, expFin: 3.2, handoff: "Handoff TI ? · ~oct", tentativa: true, nota: "Nuevo. Research E2E hecho con Growth Ops; falta cerrar hallazgos y definir la métrica. Sin ticket todavía." },
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
