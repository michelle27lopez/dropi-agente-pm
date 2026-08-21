// ─────────────────────────────────────────────────────────────────────────────
// Read model de PRESENTACIÓN del tablero Logistic Success.
// Jira gobierna clasificación/estado/ownership y Darwin (Supabase) el portafolio
// compartido. Este archivo conserva solo narrativa, navegación y metadatos
// específicos de la experiencia logística, unidos a Darwin por `codigo` ↔
// `projects.project_code`. No es una segunda fuente maestra.
// ─────────────────────────────────────────────────────────────────────────────

import { RPP_BASE_URL } from "@/lib/rpp";

const JIRA = "https://dropi-it.atlassian.net/browse/";

// Prototipo en el Rapid Prototype (repo dropi-prototypes, Angular). En prod
// resuelve a dropitesters.co; en local al `ng serve` en :4200 — por eso se
// construye con RPP_BASE_URL y no con la URL escrita a mano.
//
// ⚠️ Solo enlazar rutas que estén en `main` de dropi-prototypes: es lo que se
// despliega. Una ruta que vive solo en una rama da 404 en dropitesters.co.
//
// El `perfil` NO es opcional por capricho. El RPP protege sus rutas con
// `profileGuard` (src/app/guards/profile.guard.ts): si la URL no trae
// `?profile=`, y el navegador no tiene un perfil guardado de una visita
// anterior, redirige a la pantalla de selección de perfil. Es decir, quien abre
// el link por primera vez NO llega al prototipo — llega a un selector.
//
// El perfil válido de cada prototipo está declarado en su `meta.json` dentro
// del repo de prototipos; no se adivina. Valores posibles: dropshipper,
// proveedor, admin. Verificado el 5-ago contra origin/main.
type PerfilRpp = "dropshipper" | "proveedor" | "admin";
function rpp(ruta: string, perfil: PerfilRpp) {
  return `${RPP_BASE_URL}/${ruta}?profile=${perfil}`;
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
  fecha: "Pruebas moderadas · 18–25 jul 2026",
  fuente: "Resultados con 6 usuarios",
  titulo: "Autoconfirmación se entiende, pero no deja claro el impacto económico",
  cifra: "17%",
  cifraLabel: "interpretó correctamente ganancia/pérdida en la tarea crítica T4",
  lectura:
    "La aceptación conceptual llegó a 81/100, pero 5 de 6 usuarios pidieron visibilidad de ganancia o pérdida. Es evidencia de usabilidad, no de mejora en movilización.",
  accion:
    "Corregir T4, cerrar el gate técnico con ChateaPro e instrumentar quién confirma antes de diseñar la prueba de impacto.",
  linkTexto: "Ver resultados →",
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
    metaLabel: "cuanto más alto, mejor",
    tono: "alerta",
    delta: "bajando",
    lectura:
      "Entre el 17% y el 21% de las órdenes no entra a la red. El cuello está en la confirmación de las integraciones.",
  },
  {
    nombre: "Órdenes entregadas",
    icono: "📦",
    valor: 62.5,
    valorLabel: "62,5%",
    meta: 70,
    metaLabel: "meta 70%",
    tono: "malo",
    delta: "faltan 8–11 puntos",
    lectura:
      "Baseline consolidado ~59%. La brecha se cierra moviendo dos cosas: movilización y devolución.",
  },
  {
    nombre: "Entregas en menos de 24h",
    icono: "⏱️",
    valor: 90,
    valorLabel: "82–99%",
    metaLabel: "medido por tramo",
    tono: "bueno",
    delta: "el cuello es la transportadora",
    lectura:
      "Se mide por FASES (desde creación), como TASA de cumplimiento < 24h — no la mediana. Dropi cumple 82–99%; el cuello es el carrier (primer ofrecimiento 32%, entrega final 21%). ⚠️ Falta el número único creación→handoff (pendiente de Data).",
  },
];

// ── Movilización y devolución ────────────────────────────────────────
//
// El número va como DATO (`n`), no dentro del string. Antes se escribía con los
// glifos circulados de Unicode, que dependen de la fuente instalada y se veían
// distintos —y mal— en cada sistema. Además, tenerlo en el texto hacía que
// renumerar fuera buscar y reemplazar prosa.
//
// Renumeradas 1-2-3 el 29-jul: la de Novedad era la 4 y la 3 no existía en
// ninguna parte del tablero, así que la numeración tenía un hueco que hacía
// buscar una perdida inexistente.
export type Perdida = {
  n: number;
  nombre: string;
  valor: string;
  barra: number; // 0–100
  tono: "malo" | "alerta";
  desc: string;
  /** Llave para cruzar con `proyecto.aportaA` y colgar las palancas de su fuga. */
  aportaA: AportaA;
  /** Tamaño medido, con su denominador. Un % sin denominador no dice nada. */
  ordenes: string;
  /** Ticket que representa la perdida en Jira, según el árbol OKR. */
  ticket?: string;
};

export const perdidas: Perdida[] = [
  {
    n: 1,
    nombre: "Movilización",
    valor: "~21%",
    barra: 21,
    tono: "malo",
    aportaA: "Movilización",
    ordenes: "788K órdenes al mes no entran a la red",
    ticket: "PRM-1497",
    desc: "La orden se crea pero no entra a la red. El colador es la confirmación manual: 317K órdenes esperan más de 24h.",
  },
  {
    n: 2,
    nombre: "Devolución",
    valor: "~26%",
    barra: 26,
    tono: "alerta",
    aportaA: "Devolución",
    ordenes: "823K órdenes al mes vuelven",
    ticket: "PRM-1523",
    desc: "Dentro de la misma zona, el carrier cambia la devolución 20–27 puntos. Colombia es el 71% del volumen.",
  },
];

// ── Etapas de la cadena de valor de la orden (Mapa) ──────────────────────────
export type Etapa = {
  n: number;
  nombre: string;
  sub: string;
  color: string; // acento de la etapa
  /**
   * `n` es el número de la perdida (1–3), no el de la etapa. Va aparte del `label`
   * para que la UI lo pinte como badge y el texto quede corto — con el prefijo
   * "Movilización / Devolución · " dentro del string, la etiqueta envolvía en tres líneas en las
   * columnas del mapa. Las etapas sanas no llevan `n`.
   */
  perdida?: { n?: number; label: string; tono: "malo" | "alerta" | "bueno" };
};

export const etapas: Etapa[] = [
  { n: 1, nombre: "Generación", sub: "Se crea la orden y se elige transportadora", color: "#6366f1" },
  { n: 2, nombre: "Confirmación", sub: "Pre-red · el cliente confirma", color: "#f97316", perdida: { n: 1, label: "~17–21% no moviliza", tono: "malo" } },
  // "El foso de Dropi · excelente aquí" no se entendía sin conocer la metáfora
  // del moat. Se dice en el mismo lenguaje que las otras dos etiquetas.
  { n: 3, nombre: "Despacho", sub: "Preparación y handoff al carrier", color: "#16a34a", perdida: { label: "Sin perdida · el tramo más sano", tono: "bueno" } },
  { n: 4, nombre: "Tránsito", sub: "En camino · estados y tiempo por fases", color: "#0ea5e9" },
  { n: 5, nombre: "Entrega / Devolución", sub: "Desenlace de la orden", color: "#dc2626", perdida: { n: 2, label: "~26% devuelve", tono: "malo" } },
  { n: 6, nombre: "Novedad / Posventa", sub: "Recuperación y recompra", color: "#a855f7", perdida: { n: 3, label: "novedades sin recuperar", tono: "alerta" } },
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

// ── A qué le aporta cada iniciativa ──────────────────────────────────────────
//
// El cuarto eje, y el que faltaba. Los otros tres (tipo/fase/handoff) dicen QUÉ
// es, DÓNDE va y si TI puede tomarlo. Ninguno dice PARA QUÉ SIRVE — y sin eso
// el tablero no podía responder la única pregunta que importa en el Cell Board.
//
// La columna vertebral está en estrategia/arbol-okr-objetivo.md (v2, 28-jun):
//
//     No-entrega (KR2.1) = NO-MOVILIZA (①, 21,4%) + DEVUELVE (②, 26%)
//
// y su regla: "una idea no entra al árbol si no cuelga de una de las 2 perdidas
// con un hecho que la dimensione".
//
// `Sin declarar` NO es un default cómodo: es el hallazgo. El árbol OKR solo
// cubre explícitamente 7 de las 16 iniciativas del registro; las otras 9 nunca
// se conectaron al objetivo, y eso es una conversación pendiente del Cell
// Board, no un hueco de tablero que haya que rellenar adivinando. Por eso aquí
// solo se asigna lo que el árbol dice con todas las letras — incluida la
// degradación de Dirección+geo, que el árbol propone pero deja SIN ejecutar
// ("requiere OK por cambio"), así que se queda en `Sin declarar` hasta que Juan
// la confirme.
export type AportaA = "Movilización" | "Devolución" | "Habilitador" | "Fuera del centro" | "Sin definir";

export const APORTA_GLOSA: Record<AportaA, string> = {
  "Movilización": "Movilización: la orden se crea pero no entra a la red (~21,4% · 788K/mes).",
  "Devolución": "Devolución: la orden se moviliza pero vuelve (~26% · 823K/mes).",
  Habilitador: "Instrumenta o mide. No mueve el KR por sí solo.",
  "Fuera del centro": "Aporta a KR1.1 (volumen) o KR3.1 (margen), no a la tasa de entrega.",
  "Sin definir": "Pendiente de decidir si mueve movilización o devolución. Queda abierto para el Cell Board.",
};

// Un link es un link: Jira, Figma, prototipo, doc E2E, carpeta de Drive. Todo
// lo que exista de una iniciativa cuelga de aquí para que sea alcanzable desde
// cualquier vista (mapa, ficha, registro, experimentos, cronograma).
export type LinkTipo = "jira" | "figma" | "prototipo" | "poc" | "doc" | "drive" | "tablero";
export type LinkRef = { tipo: LinkTipo; label: string; href: string; falta?: boolean };

export const LINK_ICONO: Record<LinkTipo, string> = {
  jira: "🎫", figma: "🎨", prototipo: "🖥️", poc: "🧪", doc: "📄", drive: "📁", tablero: "🧭",
};

export type ProyectoMetadataLogistica = {
  nombre: string;
  /**
   * Nombre para espacios estrechos: los carriles del mapa y el sidebar.
   *
   * "Vigía — control operativo en tiempo real" ocupa tres líneas en una columna
   * de 230px, y al aparecer en cinco etapas convertía a una sola iniciativa en
   * la mitad visual del mapa. El nombre completo se conserva en la ficha, las
   * tablas y el título de la página, que es donde hay sitio para él.
   */
  nombreCorto?: string;
  slug: string;
  codigo?: string; // LOG-XXX en Supabase (undefined = no registrado en Darwin)
  /**
   * El `project_code` REAL con el que la ficha quedó guardada en Supabase,
   * cuando no es el `codigo` de arriba.
   *
   * Cinco iniciativas se registraron con su ticket de Jira como código
   * (PRM-91, PRM-1513, PRM-1366, PRM-1297, PRM-1512). Como el cruce
   * tablero↔Darwin es por `project_code`, salían como "sin ficha en Darwin"
   * aunque la ficha existe desde el 21-jul.
   *
   * Se declara acá en vez de renombrar la fila a propósito: `project_code` no
   * tiene UNIQUE y funciona como llave de texto en otras tablas
   * (`discovery_cycles.project_id`), así que renombrarlo sale más caro que
   * declararlo. El día que se normalicen los códigos, este campo se borra.
   */
  codigoDarwin?: string;
  etapa: string;
  tipo: TipoIniciativa;
  fase: FaseIniciativa;
  handoff: Handoff;
  /** Si mueve movilización o devolución. Obligatorio: `Sin declarar` es una respuesta válida y visible. */
  aportaA: AportaA;
  bloqueo?: string;
  ticket?: string;
  destacado?: boolean;
  descripcion: string;

  // ── Los tres campos que faltaban ───────────────────────────────────────────
  //
  // Estaban escritos, pero enterrados dentro de la prosa de `foco` — un campo
  // que llegó a tener 790 caracteres porque en él cabía todo. Al no ser datos
  // no se podían ni listar en una tabla, ni filtrar, ni usar para pintar salud.
  //
  // Son OPCIONALES a propósito. Que un proyecto no tenga dueño o no tenga
  // próximo paso no es un hueco que haya que rellenar con "por definir": es el
  // hallazgo, y la UI lo pinta como tal (celda "—", punto ámbar en el mapa).

  /** Quién lo lleva. Vacío = nadie lo tiene. ≤30 car. */
  owner?: string;
  /** Por qué importa, atado a la perdida que ataca. ≤120 car. */
  porQue?: string;
  /** La siguiente acción concreta, con dueño si aplica. ≤80 car. */
  proximoPaso?: string;

  /**
   * Contexto largo: trazabilidad, antecedentes, gates, matices verificados
   * ticket por ticket. NO se borra —es trabajo real de investigación— pero deja
   * de ser lo primero que se lee: se renderiza dentro de un plegable, que es
   * donde va lo que hay que poder consultar sin tener que atravesarlo.
   */
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
  /**
   * Pantalla propia de la iniciativa dentro del tablero, si la tiene.
   *
   * Distinto de `entregable`: `entregable` REDIRIGE (la ficha no se ve), `vista`
   * solo declara que existe una pantalla para que el sidebar enlace directo y la
   * ficha la ofrezca. Antes esto se adivinaba leyendo los `links` de tipo
   * prototipo/tablero, y por eso Same Day —que sí tiene página y está en el
   * sidebar— no sabía que su propia vista existía.
   */
  vista?: string;
};

// Nombre histórico conservado para no romper los consumidores del tablero.
export type Proyecto = ProyectoMetadataLogistica;

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
export const metadataProyectosLogistica: ProyectoMetadataLogistica[] = [
  {
    nombre: "Autoconfirmación de órdenes",
    slug: "movilizacion",
    nombreCorto: "Autoconfirmación",
    codigo: "LOG-001",
    // PRM-1497 es el ticket de la perdida ① en el árbol OKR. Asignación explícita.
    aportaA: "Movilización",
    vista: "/proyectos/logistica/experimentos/autoconfirmacion",
    etapa: "Confirmación", tipo: "Experimento", fase: "Research", handoff: "Pendiente",
    ticket: "PRM-1497", destacado: true,
    jira: "En Ruta (backlog), sin assignee. PRM-1574 es antecedente; PRM-1588/1589 son una rama WhatsApp candidata, no equivalencia confirmada.",
    doc: "parcial",
    descripcion:
      "Configurar reglas para confirmar automáticamente órdenes elegibles y evitar que se queden fuera de la red esperando una acción manual.",
    porQue: "Palanca directa de la movilización: 317K órdenes esperan más de 24h por una confirmación manual.",
    proximoPaso: "Corregir la pantalla de impacto económico y cerrar la integración con ChateaPro.",
    foco: "Prueba moderada 18–25 jul: 6 usuarios, aceptación 81/100 y comprensión económica T4 de 17%. Valida usabilidad parcial, no impacto. El handoff sigue condicionado al gate ChateaPro, guardarraíles, trazabilidad manual/automática y prueba outcome.",
    links: [
      { tipo: "prototipo", label: "Simulador de reglas (aquí en el tablero)", href: "/proyectos/logistica/experimentos/autoconfirmacion" },
      { tipo: "doc", label: "Confluence · síntesis y gates LOG-001", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572864001" },
      // Este link estuvo marcado como "falta merge a main" desde el 8-jul,
      // cuando el prototipo vivía solo en la rama
      // wireframe/DROP-configuracion-pedidos-autoconfirmacion (commit 8d2bd14).
      // Ya no: main tiene la pantalla Y un `autoconfirmacion-wizard` posterior
      // — commit aedf743 del 3-ago, "wizard autoconfirmación × ChateaPro, 3
      // pasos con simulador" — que la rama nunca tuvo. Main va adelante, no
      // atrás. Verificado el 5-ago contra origin/main de dropi-prototypes.
      //
      // Perfil dropshipper porque confirmar la orden es su acción: así lo
      // declara sidebar-nav.config.ts, que ofrece esta ruta bajo dropshipper
      // (L62) y bajo proveedor (L165) — ver LOG-012 para la otra vista.
      { tipo: "prototipo", label: "RPP · Configuración de tienda · autoconfirmación", href: rpp("old/configuraciones/configuracion-de-tienda", "dropshipper") },
    ],
    experimentos: ["autoconfirmacion"],
  },
  {
    nombre: "Autogeneración de guías",
    slug: "autogeneracion-guias",
    codigo: "LOG-012",
    // Conectada por Juan el 10-ago: acelera la entrada de la orden a la red.
    aportaA: "Movilización",
    etapa: "Despacho", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-1469",
    jira: "Solicitud · Inv. y definición · sin assignee/description. Causa INVS-67, que está en Backlog y también sin assignee.",
    doc: "completo",
    descripcion:
      "Generar en lote las guías de despacho de órdenes confirmadas para que el proveedor de alto volumen pase directamente a imprimir y alistar.",
    porQue: "3,2M órdenes pasan por esta fase y generar la guía promedia 10,37h.",
    proximoPaso: "Recuperar el análisis de Kevin y Lucho, y segmentar la línea base.",
    foco: "Maria lo clasificó como solicitud/proyecto en definición, no iniciativa propia. Baseline agregado: 10,37h, pero falta consulta segmentada y recuperar la exploración Kevin/Lucho que habría relativizado el problema. Sin prueba propia. Gates: lotes/cola de impresión, fallback bodega–carrier, idempotencia y datos.",
    links: [
      // Misma pantalla que autoconfirmación, vista desde el perfil PROVEEDOR
      // (sidebar-nav.config.ts la ofrece bajo los dos roles). Ya está en main:
      // ver la nota larga en LOG-001.
      { tipo: "prototipo", label: "RPP · Config. de tienda · perfil proveedor", href: rpp("old/configuraciones/configuracion-de-tienda", "proveedor") },
      { tipo: "jira", label: "INVS-67 · solicitud origen", href: JIRA + "INVS-67" },
      { tipo: "doc", label: "Confluence · síntesis y gates LOG-012", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572929537" },
    ],
    experimentos: ["autogeneracion-guias"],
  },
  {
    nombre: "Vigía — control operativo en tiempo real",
    slug: "vigia",
    nombreCorto: "Vigía",
    codigo: "LOG-015",
    // Conectada por Juan el 10-ago, confirmando lo que el proyecto ya afirmaba:
    // anticipa el desenlace antes de que la orden se caiga.
    aportaA: "Devolución",
    vista: "/proyectos/logistica/experimentos/vigia",
    etapa: "Tránsito", tipo: "Experimento", fase: "Diseño", handoff: "No aplica",
    jira: "⚠️ No existe en Jira",
    doc: "parcial",
    destacado: true,
    // El detalle técnico (extensión de Chrome, interceptor del API, umbrales
    // por estado) vive en `foco` y en el spec: es capa de handoff, no de
    // lectura gerencial.
    descripcion:
      "Avisa qué órdenes van a caerse antes de que ocurra, vigilando los plazos de cada estado.",
    owner: "Michel Pino",
    porQue: "Anticipa el problema en vez de reaccionar. Es la única iniciativa que cruza toda la cadena de valor.",
    proximoPaso: "Cerrar diseño y conseguir dev — hoy no tiene ninguno.",
    foco: "Dueño: Michel Pino. Diseño en curso, sin desarrollo técnico (confirmado 22-jul). Es la única iniciativa transversal a toda la cadena de valor: monitorea desde Confirmación (POR CONFIRMAR 12h, PENDIENTE 24h) hasta Novedad (24h), pasando por Despacho (GUÍA GENERADA 48h, RECOGIDO 24h) y Tránsito (EN TRÁNSITO 72h). Cruza directamente la devolución (~26%) y las novedades sin recuperar porque su valor es anticipar el problema, no reaccionar después. Para el Dropshipper: SLA por orden, WhatsApp directo al proveedor con número real del API, breakdown por estado, $ en riesgo. Para el Proveedor: SLA sobre lo que controla (confirmar, despachar, generar guía) + monitor de stock por bodega con alertas de quiebre. Stack: interceptor fetch/XHR en MAIN world → motor SLA puro → inyección visual Angular-resilient con polling 2s. GATE: mientras sea diseño está bien, pero el día que entre a desarrollo necesita ticket, métrica y spec o se construye a ciegas.",
    etapasRelacionadas: [
      { etapa: "Confirmación", rol: "POR CONFIRMAR (12h) · PENDIENTE (24h) — el proveedor no confirma o no despacha" },
      { etapa: "Despacho", rol: "GUÍA GENERADA (48h) · RECOGIDO (24h) — alerta si la guía no se recoge a tiempo" },
      { etapa: "Tránsito", rol: "EN TRÁNSITO (72h) — monitoreo activo del paquete en la red del carrier" },
      { etapa: "Entrega / Devolución", rol: "Prevención: el usuario ve el riesgo ANTES del desenlace y puede actuar" },
      { etapa: "Novedad / Posventa", rol: "NOVEDAD (24h) — escalamiento inmediato al carrier o al líder" },
    ],
    links: [
      { tipo: "prototipo", label: "Conceptualización interactiva", href: "/proyectos/logistica/experimentos/vigia" },
      // El RPP existe y está en main del repo de prototipos: tres rutas
      // (new/vigia, new/vigia/ordenes, new/vigia/orden/:id) con sus componentes
      // bajo pages/new/pedidos/vigia. Verificado el 5-ago contra origin/main.
      { tipo: "prototipo", label: "RPP · Centro Vigía", href: rpp("new/vigia", "dropshipper") },
      { tipo: "prototipo", label: "RPP · Vigía · órdenes", href: rpp("new/vigia/ordenes", "dropshipper") },
      { tipo: "doc", label: "Arquitectura v4 (Claude Code prompt)", href: "", falta: true },
    ],
    experimentos: ["vigia"],
  },
  {
    nombre: "Recolección proactiva",
    slug: "recoleccion-proactiva",
    codigo: "LOG-013",
    // Conectada por Juan el 10-ago: lo confirmado que no se recoge no entra a la red.
    aportaA: "Movilización",
    vista: "/proyectos/logistica/recolecciones",
    etapa: "Despacho", tipo: "Oportunidad", fase: "Discovery", handoff: "No aplica",
    ticket: "PRM-1465",
    jira: "Oportunidad principal candidata en backlog. PRM-1468 fue fusionada dentro de PRM-1465; comentario documental 51003 verificado. Ownership pendiente.",
    doc: "parcial",
    descripcion:
      "Que Dropi programe la recolección a la transportadora en vez de esperarla: saber qué está listo, quién recoge y quién no recogió.",
    porQue: "'Recogido por Dropi' es el peor tramo de la ruta: 8,28h promedio y 80,64% de cumplimiento.",
    proximoPaso: "Definir responsables y correr un piloto acotado con línea base.",
    foco: "PRM-1468 fue fusionada dentro de PRM-1465. La operación combina pickups de carriers externos y carrier interno/cross-docking; Hub/Indiana agrega detección preventiva. PAU es arquitectura adyacente y Warranties otro dominio. Faltan owners, frontera México, RLS y ciclo persistencia → envío → acuse → resultado.",
    links: [
      // Indiana es el producto de verdad: nació como módulo del hub y se separó
      // como app propia (ver su README). Va primero porque la pantalla del hub
      // de abajo es el port anterior, que ya divergió — mismo control, otra
      // versión, y la de Indiana es la que se mantiene.
      { tipo: "prototipo", label: "Indiana · Mapa de recolecciones", href: "https://indiana-map.vercel.app/mapa" },
      { tipo: "prototipo", label: "Control de recolecciones (versión del hub)", href: "/proyectos/logistica/recolecciones" },
    ],
    experimentos: ["recoleccion-proactiva"],
  },
  {
    nombre: "Selección inteligente de transportadoras",
    slug: "seleccion-transportadoras",
    nombreCorto: "Selección de transportadoras",
    codigo: "LOG-004",
    // El árbol OKR la SUBE de habilitador a "palanca alta de la devolución":
    // dentro de la misma zona, el carrier cambia la devolución 20–27 pp.
    aportaA: "Devolución",
    codigoDarwin: "PRM-1513",
    etapa: "Generación", tipo: "Proyecto", fase: "Definición", handoff: "Pendiente",
    ticket: "PRM-1219",
    jira: "Asignado para hand off — PRM-1219; PRM-203 en Diseño; PRM-1513 conserva el gate OKR",
    doc: "parcial",
    bloqueo:
      "Sin acceso a Chronos para crear las tablas que faltan → el PoC no se puede volver a levantar en la cuenta de AWS de IA. Juan Felipe Cubillos coordina los accesos con Jaime.",
    descripcion: "Elegir automáticamente la mejor transportadora por zona para bajar la devolución y mejorar la entrega.",
    // Ownership corregido el 10-ago por Juan: el proyecto es suyo como PM. La
    // versión anterior decía "PM: Kate Pencue; Juan actúa como Carrier Ops",
    // que ya no refleja quién lo lleva.
    owner: "Juan",
    porQue: "Dentro de la misma zona, el carrier cambia la devolución 20–27 puntos. Techo estimado: 121K órdenes/mes.",
    proximoPaso: "Conseguir acceso a Chronos — Juan Felipe coordina con Jaime.",
    foco: "Ranking carrier × zona (POC 72%). PM: Juan. PRM-1150 fue fusionada en PRM-203: el catálogo de carriers es una capacidad del mismo frente, no otro proyecto. V1 con documentos curados; faltan contrato de información, paridad y cierre E2E.",
    links: [
      { tipo: "jira", label: "Jira · PRM-1513", href: JIRA + "PRM-1513" },
      { tipo: "jira", label: "Jira · Épica DROP-17946", href: JIRA + "DROP-17946" },
      { tipo: "jira", label: "Jira · Pendiente handoff PROD-1992", href: JIRA + "PROD-1992" },
      { tipo: "figma", label: "Figma · Selección de transportadoras", href: "https://www.figma.com/design/RxEb9heslhkDA7tMpAvYXJ/Selecci%C3%B3n-de-transportadoras?node-id=4875-296079" },
      // Mismo documento de siempre (id 1oiKOFd…), pero en su forma canónica de
      // Google Docs. La forma `drive.google.com/file/d/…/view` abre el visor y
      // no el documento.
      { tipo: "drive", label: "Drive · Kickoff sistema inteligente", href: "https://docs.google.com/document/d/1oiKOFdQ27P2COPSRQVVu9WlRAh7c5_bq/edit" },
      { tipo: "doc", label: "Confluence · Sistema inteligente", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531936779" },
      { tipo: "doc", label: "Confluence · Análisis de apertura previo", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530593304" },
    ],
    experimentos: ["ruteo-carrier-zona"],
  },
  {
    nombre: "Normalización de estados",
    slug: "normalizacion-estados",
    codigo: "LOG-007",
    // El árbol la lista bajo "Habilitadores (instrumentación — NO mueven el KR
    // solos)": confirma la causa de la perdida ② y arregla la medición.
    aportaA: "Habilitador",
    codigoDarwin: "PRM-1297",
    vista: "/proyectos/logistica/normalizacion-estados",
    etapa: "Tránsito", tipo: "Proyecto", fase: "Definición", handoff: "Pendiente",
    ticket: "PRM-1297", destacado: true,
    jira: "Investigación y definición",
    doc: "completo",
    entregable: "/proyectos/logistica/normalizacion-estados",
    descripcion: "Un lenguaje único de estados para saber dónde está cada orden y poder contárselo al cliente.",
    porQue: "35 de los 51 estados de la operación se guardan como lo mismo: no se puede medir dónde se traba una orden.",
    proximoPaso: "Cerrar las 2 decisiones pendientes y enviarle la propuesta a Maria.",
    foco: "Prioridad #1 del Delivery Roadmap (WIP = 1). Hoy 35 de los 51 estados que usa la operación se guardan como lo mismo: no se puede medir dónde se traba una orden ni avisarle nada al cliente. El modelo son dos capas: el estado crudo lo ve el admin, y 9 estados homologados los ven los usuarios. Pendiente: 2 decisiones para cerrarlo.",
    links: [
      { tipo: "tablero", label: "Mapa de estados interactivo", href: "/proyectos/logistica/normalizacion-estados" },
      { tipo: "drive", label: "E2E · Normalización de estados", href: "https://docs.google.com/document/d/1MdJpIfBWM3dODcMW8big-4-RfOxatUIt1I2CcoGtV-Y/edit" },
      { tipo: "doc", label: "Confluence · Síntesis existente", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530560582" },
    ],
  },
  {
    nombre: "Parametrización de tarifas",
    slug: "tarifas",
    nombreCorto: "Tarifas",
    codigo: "LOG-006",
    // El árbol la ubica en OKR 3 · KR3.1 (gross margin), fuera de KR2.1.
    aportaA: "Fuera del centro",
    etapa: "Generación", tipo: "Proyecto", fase: "Listo para handoff", handoff: "Listo para handoff",
    ticket: "PRM-1362",
    // Ojo: en Jira el ticket figura como `Hand off hecho` desde el 14-jul, pero
    // el estado que manda para la célula es "Listo para hand off" (decisión de
    // Juan, 22-jul): el E2E todavía necesita ajuste, así que no está entregado.
    jira: "Hand off hecho (14-jul) — pero el E2E aún necesita ajuste",
    doc: "completo",
    bloqueo: "Capacidad de TI: el dev está en el cambio de moneda de Venezuela (cierra jul). No es un bloqueo de producto.",
    descripcion: "Parametrizar el costo por orden (fletes) de forma clara y automática.",
    porQue: "OKR 3 de compañía: el costo por orden es margen directo.",
    proximoPaso: "Ajustar el documento funcional y esperar cupo de desarrollo.",
    foco: "OKR 3 de compañía. Prototipo RPP construido (3 vistas). ⚠️ El doc E2E todavía necesita ajuste — no está listo para entregar tal cual. Espera slot de desarrollo.",
    links: [
      { tipo: "prototipo", label: "RPP · Parametrizar tarifas", href: rpp("old/parametrizar-tarifas", "admin") },
      { tipo: "prototipo", label: "RPP · Tarifas industrial", href: rpp("old/parametrizar-tarifas-industrial", "admin") },
      { tipo: "doc", label: "RPP · Docs de tarifas", href: rpp("old/parametrizar-tarifas-docs", "admin") },
      // El E2E no lleva link propio: es el mismo frente que ya cubren el RPP y
      // el Figma de arriba, y su estado ("necesita ajuste, no está listo para
      // entregar") ya se cuenta en el `foco`. Un enlace vacío más solo sumaba
      // ruido a la lista de huecos.
      { tipo: "figma", label: "Figma · Parametrización de tarifas", href: "https://www.figma.com/design/PDeeZVQMyF3i6SUFCWyuQa/Parametrizaci%C3%B3n-de-tarifas?node-id=2233-35839" },
    ],
  },
  {
    nombre: "Parametrización de fulfillment",
    slug: "fulfillment",
    nombreCorto: "Fulfillment",
    codigo: "LOG-014",
    // Conectada por Juan el 10-ago: es economía de la orden (KR3.1), no tasa de entrega.
    aportaA: "Fuera del centro",
    etapa: "Despacho", tipo: "Proyecto", fase: "Listo para handoff", handoff: "Listo para handoff",
    ticket: "PRM-1446", destacado: true,
    jira: "Workflow: Listo para hand off; comentario 50931 documenta el gate transversal bloqueado",
    doc: "parcial",
    bloqueo: "Capacidad de TI (cola de dev) + negociación de la mesa logística.",
    descripcion: "Parametrizar el cobro de fulfillment con sus dos esquemas (mensual y diario).",
    porQue: "92.000 órdenes al mes en bodegas de terceros, y entre el 20% y el 25% de las despachadas no llegan a entregarse.",
    proximoPaso: "Cerrar los gates de economía y elegibilidad; esperar respuesta de TI.",
    foco: "Corte transversal auditado: la cadena PROD-238/648/785/995/1171/1330/1526 prueba iteración de Producto, no desarrollo. PROD-1526 está en Dependencia, PROD-240 sigue en backlog sin assignee e INVS-66 está en curso. Bodegas 2PL Bogotá/Cali/Medellín = 92.000 órdenes/mes; 20–25% de órdenes preparadas/despachadas no llegan a Entregado. Alcance: base, multi-unidad, etiquetado, kits/combos, almacenamiento y recepción. Gates: E2E, +68%/+78%, economía, triggers, elegibilidad, wallet/reversos, actores, países y respuesta TI. Darwin LOG-014, Jira comentario 50931 y Confluence 1572732930 ya coinciden.",
    links: [
      { tipo: "prototipo", label: "RPP · Parametrizar fulfillment", href: rpp("old/fulfillment/parametrizar", "admin") },
      { tipo: "figma", label: "Diseño en Figma", href: "https://www.figma.com/design/iR3wuYGNrfTfaDKpViDf0Y?node-id=2233-35839" },
      { tipo: "drive", label: "Doc E2E · Parametrización de Fulfillment", href: "https://docs.google.com/document/d/1-t3LtPde36OIYE6mDuNWneRn2IL1UPA8paLLiZdbhYI/edit" },
      { tipo: "doc", label: "Confluence · Síntesis auditada", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572732930" },
    ],
  },
  {
    nombre: "Same Day",
    slug: "same-day",
    codigo: "LOG-005",
    // Conectada por Juan el 10-ago: es velocidad de entrega, no tasa de entrega.
    aportaA: "Fuera del centro",
    codigoDarwin: "PRM-1366",
    vista: "/proyectos/logistica/same-day",
    etapa: "Despacho", tipo: "Proyecto", fase: "Definición", handoff: "Pendiente",
    ticket: "PRM-1366",
    bloqueo: "En pausa por la regla de un frente a la vez: el activo es Normalización de estados.",
    descripcion: "Entrega el mismo día para bodegas propias y Veloces.",
    porQue: "Hoy con Veloces salen guías same day sin validación geográfica (Cali→Santa Marta).",
    proximoPaso: "En pausa: se trabaja un frente a la vez. Retomar al cerrar Normalización de estados.",
    foco: "MVP: flag SD + hora de corte + validación geo + selección guiada. Épica PROD-1127. Riesgo vivo: hoy con Veloces salen guías same day sin validación geográfica (Cali→Santa Marta).",
    links: [
      { tipo: "figma", label: "Board de discovery (Michelle López)", href: "https://www.figma.com/board/uZeHBc0bilrBIXgYWyxeow/Research-same-day" },
      { tipo: "drive", label: "E2E · Same Day", href: "https://docs.google.com/document/d/1NO9fbjklz2XvMVrMc_os6AuUjsF5ZkmDw3kX5XmwNtA/edit" },
      { tipo: "doc", label: "Confluence · Síntesis existente", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531576355" },
    ],
  },
  {
    nombre: "Guías reemplazatorias en Ecom Scanner",
    slug: "guias-reemplazatorias",
    nombreCorto: "Guías reemplazatorias",
    codigo: "LOG-009",
    // Conectada por Juan el 10-ago: da trazabilidad de la devolución, no la reduce.
    aportaA: "Habilitador",
    etapa: "Novedad / Posventa", tipo: "Lanzamiento", fase: "Beta", handoff: "Handoff hecho",
    ticket: "PRM-745",
    doc: "completo",
    descripcion: "Leer una guía reemplazatoria en Ecom Scanner, resolverla a la guía original y conservar la trazabilidad de la devolución.",
    porQue: "Conserva la trazabilidad de la devolución cuando el carrier emite una guía nueva.",
    proximoPaso: "Cerrar PROD-1045: medición, comunicación y evidencia de rollout.",
    foco: "Capacidad construida y PRM en Versión Beta. Junio reportó pruebas satisfactorias; la mesa operativa del 27-jul volvió a reportar bloqueos y el 31-jul se declaró lista para ampliar. PROD-1045 sigue en backlog: faltan ticket/hotfix, medición, comunicación y evidencia de rollout global.",
    links: [{ tipo: "jira", label: "PROD-1045 · Lanzamiento Laura", href: JIRA + "PROD-1045" }],
  },
  {
    nombre: "Pruebas de entrega",
    slug: "pruebas-entrega",
    nombreCorto: "Pruebas de entrega",
    codigo: "LOG-016",
    // Conectada por Juan el 10-ago: aporta evidencia. Mide, no mueve.
    aportaA: "Habilitador",
    etapa: "Entrega / Devolución", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-1517",
    jira: "⚠️ Paraguas En Ruta y SIN ASIGNAR · PRM-1361 y PRM-1455 en Impedimentos",
    doc: "parcial",
    bloqueo: "PRM-1517 no tiene owner; PRM-1361 y PRM-1455 están en Impedimentos; el handoff PROD-1525 está en Dependencia. DROP-23095 figura Finalizada, pero sus criterios son de discovery y no prueban producción.",
    descripcion: "Evidencia de los intentos de entrega (SLAs, foto con geolocalización), con una solución por transportadora.",
    porQue: "El 80% de las solicitudes a transportadoras son pruebas de entrega, y no hay línea base trazable.",
    proximoPaso: "Asignar owner a PRM-1517 y desatascar PRM-1361/1455.",
    foco: "No es un ticket: es un árbol por carrier. Cadena de Producto ENVÍA: PROD-836 → 1172 → 1347 hechos; PROD-1525 en Dependencia. DROP-23095 está Finalizada, pero exige verificación de build/API/UI antes de afirmar despliegue. PROD-1072 se excluye: es Print On Demand, no Proof of Delivery. PRM-618 reporta que 80% de solicitudes a carriers son POD, sin baseline trazable. El código al destinatario sigue como capacidad candidata; es distinto del token Veloces de logística inversa y de archivos periódicos de carriers.",
    links: [
      { tipo: "drive", label: "E2E · Prueba de entrega", href: "https://docs.google.com/document/d/16XQ6P1pWrzm3PHaltL5UaMeV4698-rMpgFSpGWd3tas/edit" },
      { tipo: "doc", label: "Confluence · Síntesis POD", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531772949" },
      { tipo: "figma", label: "Figma · Pruebas de entrega", href: "https://www.figma.com/design/72YLEVFhrvdrZgrbPB67IM/Pruebas-de-entrega--POD-?node-id=12-9290" },
    ],
  },
  {
    nombre: "Validación y normalización de direcciones",
    slug: "validacion-direcciones",
    nombreCorto: "Validación de direcciones",
    codigo: "LOG-002",
    // Decidido por Juan el 10-ago: cuelga de la perdida 2. El árbol OKR (28-jun)
    // había propuesto archivar el ángulo geo por falta de evidencia —dirección
    // ≈1% de las novedades—, pero esa propuesta nunca se ejecutó y la decisión
    // vigente es esta: una dirección mal capturada se paga en devolución.
    aportaA: "Devolución",
    codigoDarwin: "PRM-91",
    etapa: "Confirmación", tipo: "Proyecto", fase: "Definición", handoff: "Pendiente",
    ticket: "PRM-91",
    // Ownership resuelto el 10-ago: el proyecto es de Juan. Con eso desaparece
    // el `bloqueo` que tenía —era el conflicto de ownership, no un impedimento
    // de producto—, así que la iniciativa deja de contar como bloqueada.
    //
    // Lo que queda no es un bloqueo sino una diferencia con Jira, y para eso
    // existe el campo `jira`: registra el estado literal del ticket y, cuando
    // no coincide con nuestra lectura, esa diferencia ES el hallazgo.
    jira: "En Ruta (backlog) · ⚠️ el ticket sigue asignado a Katerine Pencue en Jira — actualizar el asignado a Juan.",
    doc: "completo",
    descripcion: "Normalizar y validar la dirección en el momento de crearla, a nivel de plataforma.",
    owner: "Juan",
    porQue: "Una dirección mal capturada se paga después en novedad y en devolución.",
    proximoPaso: "Actualizar el asignado en Jira y arrancar el alcance.",
    foco: "Discovery del taller 24-jun. Está registrado en Darwin (LOG-002) pero no aparecía en este tablero.",
    links: [
      { tipo: "doc", label: "Confluence · Síntesis existente", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530855466" },
    ],
  },
  {
    nombre: "Triaje de novedades",
    slug: "novedad-triaje",
    nombreCorto: "Triaje de novedades",
    codigo: "LOG-008",
    // El árbol reabsorbe la rama de Novedad dentro de la perdida ②: "el dato de
    // novedades es inusable y el desenlace real es la devolución".
    aportaA: "Devolución",
    codigoDarwin: "PRM-1512",
    etapa: "Novedad / Posventa", tipo: "Proyecto", fase: "Definición", handoff: "Pendiente",
    ticket: "PRM-1512",
    jira: "⚠️ En Ruta (backlog), SIN ASIGNAR — aunque el Delivery Backlog pide FINALIZARLO",
    doc: "completo",
    bloqueo: "Nadie lo tiene asignado en Jira. Alinear con Seller Success.",
    descripcion: "Dar responsable y plazo a cada novedad para recuperar la orden antes de que se devuelva.",
    porQue: "Sin responsable ni plazo por motivo, la novedad termina en devolución.",
    proximoPaso: "Conseguir assignee en Jira y alinear con Seller Success.",
    foco: "Absorbe lo que antes figuraba aparte como 'Notificaciones prevención de devoluciones': era el mismo PRM-1512 duplicado en dos fichas. Toca novedad y posventa, de forma transversal.",
    links: [
      { tipo: "drive", label: "Drive · Kickoff prevención de devoluciones", href: "https://drive.google.com/file/d/1joY2mYtgDpgtXpxuvRQToFdIP5x2xNUL/view" },
      { tipo: "doc", label: "Confluence · Síntesis existente", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1530560555" },
    ],
  },

  // ── Depuración 28-jul ──────────────────────────────────────────────────────
  // Se retiró el bloque "Fuera del radar" (6 iniciativas que salieron de barrer
  // Jira el 22-jul). El registro pasó de 22 a 16 y ahora solo contiene el
  // discovery vivo de la célula. Lo retirado y por qué, para no re-agregarlo
  // sin decisión:
  //   · PRM-1431 Suppli CO · PRM-1265 Integración de transportadoras
  //     · PRM-1067 Reportes dashboard → ya en desarrollo, no son discovery.
  //   · PRM-796 Embebido de imágenes · PRM-407 QR de recolección Veloces
  //     → 7 semanas en "Listo para hand off" sin moverse ni documentación.
  //   · PRM-118 Garantías de recolección a entrega → entregado; queda
  //     pendiente actualizar Jira y los documentos E2E (fuera de este tablero).
  //
  // Segunda depuración (19-ago, decisión de Juan): de 16 a 13. Salen tres para
  // enfocar el tablero en lo que la célula está empujando de verdad:
  //   · LOG-011 Torre de control / Tiempo por fases → NO era un proyecto, era
  //     la métrica central. Vive ahora en el panel de KPIs de "Mi día".
  //     ⚠️ Costo asumido: `estrategia/medicion-movilizacion-y-entrega.md` deja
  //     dicho que sin LOG-011 las submétricas del KPI de 24h se calculan a mano
  //     cada vez. El panel queda como transcripción manual hasta que se retome.
  //   · LOG-003 Dirección confiable + geo → decisión de foco. Sus dos
  //     experimentos (validacion-shop y encuesta-direccion) NO se borraron:
  //     pasaron a LOG-002, que es el mismo tema y sí sigue vivo. Cargaban
  //     impacto medido (618K sin validar, ~90K entregas en juego) y perderlo
  //     habría costado más que el proyecto.
  //   · LOG-010 Reducir devoluciones en pago contra entrega → decisión de foco.
  //
  // En Supabase los tres quedan `estado_interno = 'Cerrado'`, no borrados
  // (migración 050): el histórico y los `related_*` de otras filas dependen de
  // que la fila siga existiendo.

  // ── Inyectados weekly 19-ago ──────────────────────────────────────────────
  {
    nombre: "POC Autoconfirmación × ChateaPro",
    nombreCorto: "Autoconf. × ChateaPro",
    slug: "autoconfirmacion-chateapro",
    codigo: "LOG-019",
    aportaA: "Movilización",
    etapa: "Confirmación", tipo: "Experimento", fase: "Diseño", handoff: "Pendiente",
    ticket: "PRM-1497", destacado: true,
    owner: "Michel Pino",
    descripcion:
      "Wizard de 3 pasos que integra autoconfirmación con ChateaPro: reglas con impacto económico en tiempo real, comunicación automática al cliente (mensajes por producto, Confío, verificación IA de dirección), y simulador con acciones ChateaPro por orden.",
    porQue: "Insight de las mesas con ChateaPro: 'si no hay comunicación, la autoconfirmación no sirve'. Sin avisarle al cliente que su orden fue confirmada, se pierde la oportunidad de verificar dirección y ofrecer pago anticipado.",
    proximoPaso: "Resolver el gate abierto: ¿ChateaPro tolera un gate antes de su disparo? Sin eso, no se puede experimentar.",
    foco: "POC del wizard de 3 pasos (reglas → comunicación → simulador). 18 órdenes mock, 4 acciones ChateaPro modeladas (confirmación/verificación/confío/escalamiento). Deployado en RPP (commit aedf743, ruta /old/configuraciones/configuracion-de-tienda). Hallazgos de mesas documentados en artefacto.",
    links: [
      { tipo: "prototipo", label: "RPP · Wizard autoconfirmación × ChateaPro", href: rpp("old/configuraciones/configuracion-de-tienda", "dropshipper") },
      { tipo: "doc", label: "Avance y hallazgos ChateaPro", href: "https://claude.ai/code/artifact/d1e28a0c-90c9-4df0-acc8-9806f6017540" },
    ],
    experimentos: ["autoconfirmacion-chateapro"],
    etapasRelacionadas: [
      { etapa: "Confirmación", rol: "Reglas de autoconfirmación (tope flete, huella, variantes, duplicadas)" },
      { etapa: "Novedad / Posventa", rol: "Confío + verificación dirección IA reducen novedad pre-entrega" },
    ],
  },
  {
    nombre: "Auditoría Servicios en Bodega",
    nombreCorto: "Servicios Bodega",
    slug: "servicios-bodega",
    codigo: "LOG-020",
    aportaA: "Fuera del centro",
    etapa: "Despacho", tipo: "Proyecto", fase: "Discovery", handoff: "Pendiente",
    ticket: "PRM-1446",
    owner: "Michel Pino",
    descripcion:
      "Auditoría y plataforma de cobros para los 5 servicios en bodega que Dropi presta pero no factura: almacenamiento, etiquetado, armado de kits, recepción de mercancía y recargo multi-unidad.",
    porQue: "Revenue leakage de $2.9M–6.4M MXN/mes en 12 países. 4 de 5 servicios no se cobran. Dropi asume el costo operativo sin capturar el valor.",
    proximoPaso: "MVP con 2 servicios (almacenamiento + recepción) que tienen data limpia y fórmula clara. Etiquetado y kits en Fase 2.",
    foco: "Corrección de alcance: la tarifa base por orden ($2,800/orden) NO entra — ya se cobra desde el core de Dropi. Solo los 5 servicios de bodega. Dato real: Excel mayo México, 124 proveedores, $62,000 MXN solo en almacenamiento. Riesgo R1: resistencia del proveedor si no hay contrato firmado. Naming: 'Servicios en Bodega', no 'Fulfillment' — evita confusión con el cobro base. Motor de cálculo del prototipo corregido: se eliminan TARIFA_BASE_ORDEN y fulfillmentBaseOrdenes; calcSubtotal queda con 5 sumandos; IVA parametrizable por país.",
    links: [
      { tipo: "doc", label: "Auditoría completa (artefacto)", href: "https://claude.ai/code/artifact/eb1d84d4-e13c-41a6-acd2-299ae146843b" },
      { tipo: "prototipo", label: "RPP · Parametrizar fulfillment", href: rpp("old/fulfillment/parametrizar", "admin") },
      { tipo: "doc", label: "Confluence · Síntesis auditada", href: "https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572732930" },
    ],
  },
];

// Alias público compatible. Los adaptadores de Darwin y las vistas existentes
// siguen importando `proyectos`, pero el nombre canónico deja claro su alcance.
export const proyectos = metadataProyectosLogistica;

// ── Cruce objetivo ↔ iniciativas ─────────────────────────────────────────────

/** Las iniciativas que cuelgan de una rama del árbol. Es lo que hace navegable el objetivo. */
export function proyectosQueAportanA(aportaA: AportaA) {
  return proyectos.filter((p) => p.aportaA === aportaA);
}

/**
 * Reparto del portafolio entre las ramas del árbol OKR.
 *
 * Se calcula, no se escribe a mano: el día que alguien conecte una iniciativa a
 * una perdida, el conteo se mueve solo. Y mientras `sinDeclarar` sea alto, ese
 * número es el hallazgo más importante de la home — es trabajo real que nadie
 * ha atado al KR que la célula dice estar persiguiendo.
 */
export function repartoPorObjetivo() {
  const cuenta = (a: AportaA) => proyectos.filter((p) => p.aportaA === a).length;
  return {
    movilizacion: cuenta("Movilización"),
    devolucion: cuenta("Devolución"),
    habilitador: cuenta("Habilitador"),
    fueraDelCentro: cuenta("Fuera del centro"),
    sinDeclarar: cuenta("Sin definir"),
    total: proyectos.length,
  };
}

/**
 * Salud operativa de una iniciativa — el semáforo del mapa y del árbol.
 *
 * Deliberadamente NO es la fase: un proyecto puede llevar cuatro meses en
 * Discovery y estar sano, y otro estar en Diseño y llevar tres semanas
 * bloqueado. La fase es una categoría; esto es un estado que pide acción.
 *
 * El orden importa: un proyecto bloqueado es rojo aunque tenga dueño y próximo
 * paso; y uno sin dueño es ámbar aunque nadie haya declarado un bloqueo —
 * precisamente porque sin dueño no hay quien declare bloqueos.
 */
export type Salud = "ok" | "warn" | "risk";

export function saludDe(p: Proyecto): Salud {
  if (p.bloqueo) return "risk";
  if (!p.owner || !p.proximoPaso) return "warn";
  return "ok";
}

/** Por qué está en ese color. Va al tooltip: el semáforo sin explicación obliga a adivinar. */
export function motivoSalud(p: Proyecto): string {
  if (p.bloqueo) return `Bloqueado: ${p.bloqueo}`;
  const faltan = [!p.owner && "dueño", !p.proximoPaso && "próximo paso"].filter(Boolean);
  if (faltan.length) return `Sin ${faltan.join(" ni ")} declarado.`;
  return `Avanzando. ${p.owner} · ${p.proximoPaso}`;
}

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

  // ── El impacto, en tres piezas y no en un párrafo ─────────────────────────
  //
  // El campo `impacto` mezclaba tres cosas con vidas distintas:
  //
  //   indicador + hoy → lo que HAY         (línea base, medida)
  //   objetivo        → lo que ESPERO      (estimación, al diseñar)
  //   impactoReal     → lo que MOVÍ        (medición, solo al concluir)
  //
  // POR QUÉ ESTRUCTURA Y NO TEXTO LIBRE
  // La primera versión de esto era una frase, y con una frase se coló un error
  // que nadie podía ver: se escribió que Recolección proactiva subía "el
  // cumplimiento de Recogido por Dropi" cuando lo que sube es la MOVILIZACIÓN,
  // en 12K guías. Una frase no obliga a nombrar el indicador; tres campos sí.
  // Si no se sabe qué indicador se mueve, la celda queda vacía y se ve.
  //
  // Efecto secundario valioso: el `indicador` ya dice a qué perdida aporta el
  // experimento —Movilización → perdida 1, Devolución → perdida 2—, así que no hace
  // falta declararlo por separado ni puede contradecirse consigo mismo.

  /**
   * El indicador que el experimento espera mover, su valor actual y su meta.
   *
   * `hoy` es la línea base, en la unidad del indicador. `objetivo` puede
   * quedar vacío: significa que nadie ha estimado a dónde se quiere llegar, y
   * ese hueco concreto —"falta el objetivo de horas"— se cierra con una frase.
   * No se rellena a ojo: una estimación fabricada se usa después para
   * priorizar y nadie recuerda que era inventada.
   */
  impactoEsperado?: {
    indicador: string;
    hoy?: string;
    objetivo?: string;
  };

  /**
   * Discovery: el experimento no mueve el KR, hace visible algo que hoy no se
   * ve. Exigirle "movilizar N órdenes" produciría un número inventado, y
   * priorizarlo contra un experimento de impacto es comparar peras con manzanas.
   */
  esDiscovery?: boolean;

  /**
   * Lo que se movió de verdad, medido. Vacío hasta que el experimento concluya
   * — y ese vacío es correcto, no un dato pendiente de cargar.
   *
   * Es lo que cierra el ciclo: se lee contra `impactoEsperado` para saber si la
   * apuesta cumplió, y ese contraste es lo que convierte una lista de
   * experimentos en aprendizaje acumulado.
   */
  impactoReal?: string;
  demoHref?: string;
  links?: LinkRef[];

  /**
   * Qué DECIDE este experimento: la acción concreta que se toma cuando termine.
   *
   * Es la prueba de fuego del diseño experimental. Un experimento cuyo `decide`
   * no se puede escribir no está diseñado — está enunciado: mide algo, pero
   * nadie sabe qué se hará con el resultado, así que su resultado no va a
   * cambiar nada.
   *
   * Opcional a propósito: dejarlo vacío es la única forma de que la falta se
   * vea. Rellenarlo con una frase de compromiso lo escondería, que es
   * exactamente lo que hacía la versión anterior de esta pantalla al
   * enterrarlo dentro de un párrafo de métrica.
   */
  decide?: string;
};

export function experimentoPorSlug(slug: string) {
  return experimentos.find((e) => e.slug === slug);
}

/**
 * A qué perdida aporta un experimento. Se DERIVA del proyecto al que cuelga en vez
 * de duplicarse: si el proyecto cambia de rama del árbol, sus experimentos la
 * cambian con él y no hay forma de que se contradigan.
 */
export function aportaDeExperimento(e: Experimento): AportaA | undefined {
  return e.proyectoSlug ? proyectoPorSlug(e.proyectoSlug)?.aportaA : undefined;
}

/** Un experimento sin `decide` no está diseñado: mide, pero no cambia ninguna decisión. */
export function estaDisenado(e: Experimento) {
  return Boolean(e.decide);
}

/**
 * Se puede priorizar solo si declara cuánto espera mover. Sin ese número, dos
 * apuestas no son comparables y el orden acaba dependiendo de quién habla más
 * fuerte en la reunión.
 */
export function sePuedePriorizar(e: Experimento) {
  return Boolean(e.impactoEsperado);
}

/** Concluido = ya hay medición. Es lo que permite contrastar esperado vs. real. */
export function tieneResultado(e: Experimento) {
  return Boolean(e.impactoReal);
}

export const experimentos: Experimento[] = [
  {
    slug: "autoconfirmacion",
    proyectoSlug: "movilizacion",
    // El prototipo no faltaba: es el wizard de autoconfirmación del RPP
    // (commit aedf743, 3-ago). Estaba sin enlazar porque el tablero lo daba
    // por no mergeado — ver la nota en LOG-001.
    links: [{ tipo: "prototipo", label: "RPP · Wizard de autoconfirmación", href: rpp("old/configuraciones/configuracion-de-tienda", "dropshipper") }],
    nombre: "Autoconfirmación por madurez del dropshipper",
    hipotesis:
      "Autoconfirmar a dropshippers maduros (constantes, ≥50 órd/mes) baja el tiempo de confirmación y sube movilización, sin subir devolución.",
    metrica: "Hoy: éxito por tarea y comprensión del impacto económico. Pendiente medir el impacto real: tiempo de confirmación y % de movilización, con la devolución como guardarraíl.",
    decide: "Si se construye la autoconfirmación o se descarta la palanca.",
    estado: "Corriendo",
    impactoEsperado: { indicador: "Tiempo de confirmación", hoy: "11,18h" },
    impactoReal: "Aceptación 81/100, pero solo el 17% entendió el impacto económico.",
    impacto: "317.000 órdenes esperan más de 24 horas, con un promedio de 11,18h. En las 6 sesiones de usabilidad la aceptación fue 81/100, pero solo el 17% entendió el impacto económico.",
    proyecto: "Movilización · Confirmación (Cell Board 1-jul)",
    demoHref: "/proyectos/logistica/experimentos/autoconfirmacion",
    aprendizaje:
      "La pantalla se entiende a medias: 5 de 6 usuarios no vieron con claridad si ganaban o perdían dinero. Antes de entregar a desarrollo faltan la visibilidad económica, la integración con ChateaPro, el registro de quién confirma y los guardarraíles de duplicidad, ruralidad y variantes. Todavía no hay evidencia de mejora en movilización ni en devolución.",
  },
  {
    slug: "autogeneracion-guias",
    proyectoSlug: "autogeneracion-guias",
    nombre: "Autogeneración de guías al confirmar",
    hipotesis:
      "Generar la guía automáticamente al confirmar la orden recorta la fase de generación (10,37h prom.) sin degradar el alistamiento en bodega.",
    metrica: "Discovery: tiempo activo/espera, tamaño de lote y fallos por segmento. Piloto futuro: confirmación→guía, % válidas, error/anulación/duplicidad y tiempo hasta impresión.",
    decide: "Si el cuello está en generar la guía o en imprimirla y alistarla.",
    estado: "Diseñado",
    impactoEsperado: { indicador: "Tiempo de generación de guía", hoy: "10,37h" },
    impacto: "3,20M órdenes pasan por esta fase · 325K críticas · cumplimiento 89,84%",
    proyecto: "Autogeneración de guías (PRM-1469)",
    aprendizaje:
      "El concepto existe, pero todavía no está listo para medir impacto. Primero hay que recuperar el análisis de Kevin y Lucho, y confirmar con proveedores si el cuello está en generar la guía o en imprimirla y alistarla.",
    // Misma pantalla del RPP que autoconfirmación, vista desde el proveedor:
    // es donde se configura que la guía se genere sola al confirmar.
    links: [{ tipo: "prototipo", label: "RPP · Config. de tienda · perfil proveedor", href: rpp("old/configuraciones/configuracion-de-tienda", "proveedor") }],
  },
  {
    slug: "recoleccion-proactiva",
    proyectoSlug: "recoleccion-proactiva",
    nombre: "Recolección proactiva a la transportadora",
    hipotesis:
      "Si Dropi programa la recolección en vez de esperarla —sabiendo qué está listo, quién recoge y quién no— baja el tiempo de la fase 'Recogido por Dropi' y se mueven más paquetes por ruta.",
    metrica:
      "[por cerrar con Growth Ops] — candidatas: horas de la fase Recogido por Dropi · % de recolecciones cumplidas · paquetes por ruta",
    estado: "Diseñado",
    // Corregido por Juan (10-ago): el indicador NO es el cumplimiento de
    // "Recogido por Dropi" —ese es el síntoma que se observa— sino la
    // MOVILIZACIÓN, y el objetivo son 12K guías. Al ser movilización, este
    // experimento aporta a la perdida 1, no a la 2.
    impactoEsperado: { indicador: "Movilización", objetivo: "+12K guías/mes" },
    impacto:
      "Fase 'Recogido por Dropi': 8,28h prom. y 80,64% de cumplimiento — el peor tramo de la ruta Dropi. 96K órdenes críticas.",
    proyecto: "Recolección proactiva (PRM-1465 candidato principal)",
    aprendizaje:
      "Ya está separado lo que se envía a la transportadora de lo que se detecta antes. El sistema prioriza y prepara el aviso, pero todavía no confirma que la recolección ocurrió. Falta definir responsables y correr un piloto con línea base para poder comparar.",
    links: [{ tipo: "prototipo", label: "Indiana · Mapa de recolecciones", href: "https://indiana-map.vercel.app/mapa" }],
  },
  {
    slug: "validacion-shop",
    proyectoSlug: "validacion-direcciones",
    nombre: "Activar validación de dirección en SHOP",
    hipotesis: "Forzar la validación de dirección en integraciones sube la movilización.",
    metrica: "% de movilización y entregas netas, comparando órdenes con dirección validada contra las que no la tienen.",
    decide: "Si validar la dirección en las integraciones mete más órdenes a la red.",
    estado: "Diseñado",
    impactoEsperado: { indicador: "Movilización", objetivo: "+11,9 pts (~90K entregas)" },
    impacto: "618K sin validar · +11,9 pts entra red · ~90K entregas en juego",
    proyecto: "Movilización · Dirección+geo",
  },
  {
    slug: "motivos-cancelacion",
    proyectoSlug: "movilizacion",
    nombre: "Catálogo de motivos de cancelación (Colombia)",
    hipotesis: "Instrumentar el motivo revela la mitad ciega del no-mov (53%).",
    metrica: "% de no-movilización con causa registrada",
    decide: "Qué hay detrás del 53% de cancelaciones sin causa registrada.",
    estado: "Idea",
    // Discovery: no mueve la tasa de entrega, hace visible el 53% ciego.
    esDiscovery: true,
    impactoEsperado: { indicador: "Cancelaciones con causa registrada", hoy: "47%", objetivo: "100%" },
    impacto: "Barato · destapa el punto ciego de la movilización",
    proyecto: "Movilización",
  },
  {
    slug: "ruteo-carrier-zona",
    proyectoSlug: "seleccion-transportadoras",
    nombre: "Ruteo por mejor carrier × zona",
    hipotesis: "Enrutar por el mejor carrier según zona baja la devolución.",
    metrica: "% de devolución por zona (post-ranking)",
    decide: "Si el carrier es causa de la devolución o solo le toca el peor segmento.",
    estado: "Corriendo",
    // El árbol OKR calcula el techo en ~121K/mes (15%) y lo marca [INF]
    // —inferido—, así que se cita como techo y no como pronóstico.
    impactoEsperado: { indicador: "Devolución", hoy: "~26%", objetivo: "hasta −121K órd/mes (techo ~15%)" },
    impactoReal: "La prueba de concepto acierta el 72% del ranking. Falta medir el efecto en devolución.",
    impacto: "Entre 20 y 27 puntos de diferencia en devolución entre transportadoras de la misma zona. La prueba de concepto acierta el 72%.",
    proyecto: "Selección de transportadoras (PRM-1219)",
  },
  {
    slug: "encuesta-direccion",
    proyectoSlug: "validacion-direcciones",
    nombre: "Encuesta: ¿por qué no validan la dirección?",
    hipotesis: "El seller no valida por fricción/desconocimiento, no por falta de valor.",
    metrica: "Respuestas + motivos (Userpilot)",
    decide: "Por qué los usuarios no validan la dirección.",
    // Discovery: su resultado es información, no movimiento del KR.
    esDiscovery: true,
    impactoEsperado: { indicador: "Respuestas con motivo", hoy: "0" },
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
      "Si el dropshipper y el proveedor ven en tiempo real qué órdenes van fuera de plazo, y pueden actuar desde ahí mismo, corrigen antes de que la orden se caiga y bajan la devolución.",
    metrica: "Candidatas: % de órdenes intervenidas que se recuperan vs. control · reducción de tiempo de reacción ante novedades (h) · efecto en tasa de devolución de usuarios con la extensión vs. sin ella",
    estado: "Diseñado",
    // Falta el rango de puntos: se sabe cuánto vale un punto (~34K órdenes
    // sobre 3,4M/mes) pero no cuántos puntos se espera recuperar.
    impactoEsperado: { indicador: "Órdenes recuperadas antes del desenlace" },
    // Los seis umbrales por estado y el monitor de stock son detalle de
    // implementación: viven en el spec del proyecto, no en la lectura gerencial.
    impacto: "Cubre 5 de las 6 etapas de la orden y actúa antes del desenlace, que es donde se pierde. Con 3,4 millones de órdenes al mes, cada punto de recuperación equivale a unas 34.000 órdenes.",
    proyecto: "Vigía (sin ticket todavía)",
    aprendizaje:
      "El diseño cubre los dos roles, dropshipper y proveedor, y la parte técnica ya está probada. El valor no está solo en la alerta: está en que el mensaje al proveedor sale con su contacto real y con el contexto de la orden ya cargado. Sin eso, el dropshipper tiene que buscar el contacto a mano.",
  },
  {
    slug: "autoconfirmacion-chateapro",
    proyectoSlug: "autoconfirmacion-chateapro",
    nombre: "POC Autoconfirmación × ChateaPro (wizard 3 pasos)",
    hipotesis:
      "Si la autoconfirmación se integra con ChateaPro (mensaje de confirmación + verificación IA de dirección + Confío para pago anticipado), el usuario corrige antes del despacho y la devolución baja sin sacrificar la experiencia.",
    metrica: "Gate: ¿ChateaPro tolera esperar la decisión del autoconfirmador? Si sí → piloto con 18 órdenes reales midiendo: tasa de corrección de dirección, conversión Confío, y reducción de devolución post-confirmación.",
    decide: "Si ChateaPro puede actuar condicionalmente (después de la evaluación de reglas) o solo dispara en bloque.",
    estado: "Diseñado",
    impactoEsperado: { indicador: "Comunicación pre-despacho" },
    impacto: "4 acciones ChateaPro modeladas: confirmación exitosa, verificación IA de dirección, pago anticipado (Confío) y escalamiento a asesor. 18 órdenes mock con costo real de flete, margen y huella del comprador.",
    proyecto: "POC Autoconfirmación × ChateaPro (LOG-019)",
    links: [
      { tipo: "prototipo", label: "RPP · Wizard 3 pasos", href: rpp("old/configuraciones/configuracion-de-tienda", "dropshipper") },
      { tipo: "doc", label: "Hallazgos ChateaPro", href: "https://claude.ai/code/artifact/d1e28a0c-90c9-4df0-acc8-9806f6017540" },
    ],
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
  perdidas: { label: string; valor: string; sub: string; tono: "rojo" | "ambar" | "verde" }[];
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
  // Enlace a una página del tablero (ruta relativa, para que sirva en cualquier
  // dominio del despliegue) o a un recurso externo.
  enlace?: { label: string; href: string };
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
  // ── Semana 27 – 31 jul 2026 (actual) ────────────────────────────────────────
  {
    id: "2026-w31",
    fecha: "Viernes 31 de julio de 2026",
    semana: "Semana 27 – 31 jul",
    foco:
      "Semana de definición operativa, no de cifra: Recolecciones reconstruyó el flujo actual y diseñó un piloto preventivo, todavía sin baseline ni outcome reconciliados. El POC de selección de transportadoras se revivió con prototipo en RPP, Normalización de estados quedó organizada para enviarle a Maria y Autoconfirmación consolidó sus pruebas de usabilidad. El indicador mensual sigue sin cierre nuevo desde junio.",

    comparacionMensual: {
      titulo: "Cierre junio — sin cierre nuevo esta semana",
      alcance: "Consolidado de 9 países, ponderado por volumen. Junio sigue siendo el último mes cerrado.",
      lectura:
        "Segunda semana sin dato mensual nuevo: el cierre de julio aún no madura. El avance fue de preparación — Recolecciones separó la operación saliente de la capa preventiva y dejó el piloto por validar; el POC de transportadoras quedó listo para probarse con usuarios reales. Ninguna de las dos palancas tiene outcome demostrado todavía.",
      entregaNota:
        "% entrega sigue sin ser comparable hasta tener el export por cohorte de Data. Sin novedad frente al 24-jul.",
      filas: [
        { metrica: "Movilización", abril: "81,9%", mayo: "82,3%", junio: "82,3%", delta: "≈ 0 · plano", tono: "alerta" },
        { metrica: "No movilizado", abril: "700.281", mayo: "716.957", junio: "737.865", delta: "+20.908", tono: "malo" },
        { metrica: "Órdenes", abril: "3,86M", mayo: "4,04M", junio: "4,17M", delta: "+3,3%", tono: "bueno" },
      ],
    },

    avanceInvestigacion: {
      titulo: "Investigación de oportunidades por fase",
      descripcion:
        "La fase 'Recogido por Dropi' tiene operación y flujo candidato documentados. Faltan aprobar reglas, owners, acceso y protocolo antes de una prueba de proceso.",
      pasos: [
        { nombre: "Confirmación", detalle: "Oportunidades levantadas + resultados de las pruebas con 6 usuarios", estado: "listo" },
        { nombre: "Generación de guía", detalle: "Oportunidades levantadas", estado: "listo" },
        { nombre: "Recogido por Dropi", detalle: "Operación y paridad documentadas; piloto, owners y outcome pendientes", estado: "activo" },
        { nombre: "Conectar el flujo", detalle: "Siguiente paso", estado: "siguiente" },
      ],
    },

    focoSiguienteSemana: [
      "Recolecciones: completar PRM-1465, owners y protocolo; luego correr un piloto acotado y leer solicitud→acuse→resultado — Driver: Juan Diego.",
      "POC Selección de transportadoras: probar con Shopi y con usuarios de marcas — Responsable: Juan (Carrier Ops) / Kate (PM).",
      "Autoconfirmación: llevar al prototipo los tres hallazgos de mayor frecuencia (impacto en ganancia, precios de flete, alerta de pérdida) — Responsable: Juan Diego / Michel Pino.",
      "Normalización de estados: enviarle la propuesta ya organizada a Maria — Responsable: Juan Diego.",
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
        nota: "Dato de junio. Recolecciones y Autoconfirmación —las dos palancas que lo atacan— entran a prueba la próxima semana.",
      },
      {
        nombre: "Recolecciones · target de movilización",
        valor: "Por definir",
        tono: "alerta",
        estado: "Sin baseline reconciliado",
        nota: "El baseline, denominador y target se calculan en la fuente restringida y solo se publican como agregado aprobado. No inferirlos de la foto operativa.",
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
      perdidas: [],
    },
    tiempo: {
      lectura:
        "La fase 'Recogido por Dropi' queda definida como proceso (auditar → accionar → convertir → prevenir). La medición del impacto llega con las pruebas de la próxima semana.",
      dropi: [
        { fase: "Ruta Dropi hasta transportadora", horas: 44.9, metaHoras: 24, responsable: "Célula", palanca: "pruebas de proceso de recolección" },
      ],
      carrier: [
        { fase: "Maduración de entrega", horas: 24, metaHoras: 24, palanca: "comparar cohortes cerradas" },
      ],
      proximosPasos: ["Correr las pruebas de proceso de Recolecciones y leer el resultado sobre las bodegas en alcance."],
    },
    hallazgos: [],

    secciones: [
      {
        titulo: "Product Road map · investigación",
        nota: "Discovery con datos antes de comprometer desarrollo.",
        proyectos: [
          {
            nombre: "Recolecciones",
            estado: "Flujo y paridad documentados",
            estadoTono: "ambar",
            nota:
              "Se reconstruyó la operación saliente y se separó de la capa preventiva Hub/Indiana. Antes de probar faltan aprobar reglas, owners, acceso y el ciclo solicitud→acuse→resultado. Los volúmenes por bodega permanecen restringidos.",
            impacto:
              "Baseline y target pendientes de reconciliar en la fuente restringida; no hay impacto atribuible demostrado.",
            enlace: { label: "Ver control de recolecciones", href: "/proyectos/logistica/recolecciones" },
          },
          {
            nombre: "POC selección de transportadoras",
            ticket: "PRM-1513",
            estado: "Revivido · prototipo listo",
            estadoTono: "verde",
            nota:
              "El POC se revivió: se ajustó el UI y ya hay prototipo funcionando en RPP, que sirvió para alinear el flujo con TI. La próxima semana se prueba con Shopi y con usuarios de marcas.",
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
            estado: "Investigación con resultados",
            estadoTono: "ambar",
            nota:
              "Pruebas de usabilidad moderadas sobre el prototipo RPP con 6 usuarios (dropshippers y proveedores). Puntajes: Accesibilidad 72, Satisfacción 81 y Claridad 58 — la claridad es la que arrastra. El hallazgo crítico se repitió en 5 de 6: el simulador no muestra cuánto gana o pierde el usuario con cada configuración. Le siguen, en 4 de 6, la falta de precios de flete por transportadora y la ausencia de alerta visual de pérdida potencial. Señal a favor: 5 de 6 lo usarían si ven su ganancia.",
            enlace: { label: "Ver resultados del experimento", href: "/proyectos/logistica/experimentos/autoconfirmacion" },
          },
          {
            nombre: "Vigía",
            estado: "En iteración",
            estadoTono: "gris",
            nota: "En iteración con el módulo y las reglas del rediseño del módulo de órdenes. Falta revisar los estados dentro del módulo de órdenes para incorporarlos.",
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
            estado: "Organizado · pendiente enviar",
            estadoTono: "verde",
            nota: "Prioridad #1 del Delivery. Esta semana se organizó la propuesta; queda pendiente enviársela a Maria.",
          },
          {
            nombre: "Same Day",
            ticket: "PRM-1366",
            estado: "Inv. y definición",
            estadoTono: "gris",
            nota: "Sin cambios esta semana.",
          },
          {
            nombre: "Fulfillment",
            ticket: "PRM-1446",
            estado: "Listo para hand off",
            estadoTono: "ambar",
            nota: "Diseño validado, en 'Listo para hand off'.",
          },
        ],
      },
    ] as SeccionProyectos[],
  },

  // ── Semana 21 – 25 jul 2026 ─────────────────────────────────────────────────
  {
    id: "2026-w30",
    fecha: "Jueves 24 de julio de 2026",
    semana: "Semana 21 – 25 jul",
    foco:
      "Semana de discovery y validación en campo: se revisó Recolecciones, arrancaron las entrevistas de Autoconfirmación y se reportó una gestión de Recolección proactiva. Ese volumen no quedó reconciliado con fuente, denominador ni outcome. El indicador mensual no tiene cierre nuevo desde junio; el avance de la semana fue definir el dashboard de indicadores con Diana.",

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
        { nombre: "Recogido por Dropi", detalle: "Recolecciones revisado + gestión proactiva autodeclarada, pendiente de reconciliación", estado: "activo" },
        { nombre: "Conectar el flujo", detalle: "Siguiente paso", estado: "siguiente" },
      ],
    },

    focoSiguienteSemana: [
      "Autoconfirmación: sintetizar las 6 entrevistas (ChateaPro, Mauricio Corzo, líderes de comunidad, dropshipper grande) en aprendizajes y guardarraíles — Responsable: Juan Diego.",
      "Recolección proactiva: recuperar la fuente del volumen reportado, medir solicitud→acuse→resultado y decidir si escala — Driver: Juan Diego; owner operativo nominal pendiente.",
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
      perdidas: [],
    },
    tiempo: {
      lectura: "La investigación de reducción de tiempos avanza en la fase 'Recogido por Dropi' con Recolecciones y la prueba de Recolección proactiva.",
      dropi: [
        { fase: "Ruta Dropi hasta transportadora", horas: 44.9, metaHoras: 24, responsable: "Célula", palanca: "validación en campo de la fase de recolección" },
      ],
      carrier: [
        { fase: "Maduración de entrega", horas: 24, metaHoras: 24, palanca: "comparar cohortes cerradas" },
      ],
      proximosPasos: ["Reconciliar la gestión reportada de Recolección proactiva y validar el ciclo solicitud→acuse→resultado del control de Recolecciones."],
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
            nota: "Se revisó el control de guías preparadas sin recoger por territorio. Conecta con la fase 'Recogido por Dropi'. El tablero consume una base restringida y no publica snapshots ni volúmenes operativos en la ficha de portafolio.",
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
            estado: "Gestión reportada · resultado pendiente",
            estadoTono: "ambar",
            nota: "Se reportó una gestión de recolección proactiva, pero no hay fuente, denominador, acuse ni resultado reconciliados. Es una señal de campo, no evidencia de impacto ni de escala.",
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
        "Lectura honesta: la movilización quedó plana. Es coherente con el estado de las palancas: la movilización sigue sin moverse y autoconfirmación todavía no está corriendo.",
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
        nota: "El volumen total creció 3,3%, pero también aumentaron las órdenes perdidas antes de entrar a la red.",
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
      perdidas: [],
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
      perdidas: [
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
            nombre: "Guías reemplazatorias en Ecom Scanner",
            ticket: "PRM-745",
            estado: "Beta por reconciliar",
            estadoTono: "amarillo",
            nota: "Dev finalizado y beta reportada en tres carriers. Falta reconciliar el bloqueo operativo del 27-jul, cerrar medición/activación y demostrar rollout global. PROD-1045 permanece como historia canónica de Laura.",
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
            nombre: "Pruebas de entrega",
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
    perdidas: [
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
          nombre: "Guías reemplazatorias en Ecom Scanner",
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

// ── El "hoy" del cronograma se calcula, no se escribe ────────────────────────
//
// Estaba fijo en `hoy: 0.3`, o sea la marca de HOY apuntaba al 10 de julio.
// Un mes después seguía ahí: el Gantt afirmaba que la célula estaba donde había
// estado hace cuatro semanas, y esa es justo la clase de error que nadie revisa
// porque el número parece un detalle de maquetación.
//
// La ventana arranca en julio de 2026 y dura 12 meses. La posición es la
// fracción de mes transcurrida desde ese inicio, y se recorta al rango: si
// alguien mira este tablero en 2028, la línea se queda en el borde en vez de
// salirse del gráfico.
const VENTANA_INICIO = { anio: 2026, mes: 6 }; // mes 6 = julio (base 0)
const VENTANA_MESES = 12;

function posicionDeHoy(ahora = new Date()): number {
  const mesesTranscurridos =
    (ahora.getFullYear() - VENTANA_INICIO.anio) * 12 + (ahora.getMonth() - VENTANA_INICIO.mes);
  const diasDelMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
  const fraccion = (ahora.getDate() - 1) / diasDelMes;
  return Math.max(0, Math.min(VENTANA_MESES, mesesTranscurridos + fraccion));
}

export const cronograma = {
  meses: ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  trimestres: [
    { label: "Q3 2026", desde: 0, hasta: 2, clase: "q3" },
    { label: "Q4 2026", desde: 3, hasta: 5, clase: "q4" },
    { label: "Q1 2027", desde: 6, hasta: 8, clase: "q1" },
    { label: "Q2 2027", desde: 9, hasta: 11, clase: "q2" },
  ],
  hoy: posicionDeHoy(),
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
    { proyecto: "Autogeneración de guías", ticket: "PRM-1469", slug: "autogeneracion-guias", researchInicio: 0.3, researchFin: 0.7, expInicio: 0.7, expFin: 2.3, handoff: "Sin fecha de handoff", tentativa: true, nota: "Proyecto/solicitud en discovery. Antes de probar: análisis Kevin/Lucho, baseline segmentado, lotes/impresión, fallback carrier e idempotencia." },
    { proyecto: "Selección de transportadoras", ticket: "PRM-1219", slug: "seleccion-transportadoras", researchInicio: 0, researchFin: 0.6, expInicio: 0.6, expFin: 2.2, handoff: "Handoff TI ? · ~sep", tentativa: true, bloqueo: "Sin acceso a Chronos", nota: "El PoC existe pero no se puede levantar: faltan accesos a Chronos para crear las tablas en la cuenta de AWS de IA (Juan Felipe ↔ Jaime). PRM-1150 fue absorbida por PRM-203; el catálogo requiere fuente curada y contrato de información. La ventana es tentativa hasta resolver accesos y datos." },
    { proyecto: "Vigía (extensión de órdenes)", slug: "vigia", researchInicio: 0.5, researchFin: 1.5, expInicio: 1.5, expFin: 3, handoff: "Handoff TI ? · ~oct", tentativa: true, nota: "Nuevo. Research primero: falta definir la métrica y conseguir el prototipo. Sin ticket todavía." },
    { proyecto: "Recolección proactiva", ticket: "PRM-1465", slug: "recoleccion-proactiva", researchInicio: 0.4, researchFin: 1.6, expInicio: 1.6, expFin: 3.2, handoff: "Sin fecha de handoff", tentativa: true, nota: "PRM-1468 fue fusionada dentro de PRM-1465; comentario 51003 verificado. Faltan owners, evidencia PROD, RLS, persistencia/acuse/resultado y piloto con outcome." },
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
