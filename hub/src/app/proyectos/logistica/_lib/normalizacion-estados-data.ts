export type EvidenceLevel = "real" | "catalogo" | "pendiente";

export const normalizacionSummary = [
  { label: "Países con catálogo", value: "9", note: "API verificada · 11-jul" },
  { label: "Mapeos carrier", value: "576", note: "7 carriers · Excel de campo" },
  { label: "Guías de ejemplo", value: "14", note: "Trazas completas reales" },
  { label: "Catálogo objetivo", value: "26+", note: "7 fases · niveles por cerrar" },
];

export const countries = [
  { name: "Colombia", states: 500, display: "~500", evidence: "real" as EvidenceLevel, note: "Catálogo + 133.555 órdenes y 52.636 guías auditadas" },
  { name: "México", states: 193, display: "193", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta traza transaccional equivalente" },
  { name: "Paraguay", states: 99, display: "99", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
  { name: "Ecuador", states: 94, display: "94", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
  { name: "Chile", states: 73, display: "73", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
  { name: "Perú", states: 65, display: "65", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
  { name: "Panamá", states: 55, display: "55", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
  { name: "Guatemala", states: 21, display: "21", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
  { name: "Argentina", states: 19, display: "19", evidence: "catalogo" as EvidenceLevel, note: "Catálogo API; falta ejemplo de guía" },
];

export const carriers = [
  { name: "ENVIA", mappings: 165 },
  { name: "TCC", mappings: 106 },
  { name: "COORDINADORA", mappings: 98 },
  { name: "INTERRAPIDISIMO", mappings: 84 },
  { name: "VELOCES", mappings: 66 },
  { name: "DOMINA", mappings: 56 },
  { name: "JAMV-DRIVE", mappings: 1 },
];

export type RouteMode = "directo" | "ecom" | "dropi";

export type FlowNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone: "order" | "ecom" | "dropi" | "carrier" | "warning" | "danger" | "return" | "success";
  kind: "main" | "optional" | "exception" | "terminal";
  modes: RouteMode[];
  phase: string;
  actor: string;
  client: string;
  detail: string;
  flags: string[];
};

export type FlowEdge = {
  id: string;
  path: string;
  tone: "main" | "optional" | "warning" | "danger" | "return";
  kind: "main" | "exception";
  modes: RouteMode[];
};

const allRoutes: RouteMode[] = ["directo", "ecom", "dropi"];

export const flowNodes: FlowNode[] = [
  { id: "confirm", label: "Por confirmar", x: 30, y: 70, tone: "order", kind: "main", modes: allRoutes, phase: "Gestión", actor: "Dropshipper", client: "En preparación", detail: "La orden existe y espera confirmación.", flags: ["No movilizado", "Reversible"] },
  { id: "pending", label: "Pendiente", x: 190, y: 70, tone: "order", kind: "main", modes: allRoutes, phase: "Gestión", actor: "Proveedor", client: "En preparación", detail: "La orden fue confirmada y puede generar guía.", flags: ["No movilizado", "Reserva stock"] },
  { id: "guide", label: "Guía generada", x: 350, y: 70, tone: "order", kind: "main", modes: allRoutes, phase: "Gestión", actor: "Proveedor", client: "En preparación", detail: "Existe intención logística, pero el paquete todavía no está en red.", flags: ["No movilizado", "No salió de bodega"] },
  { id: "pickup-pending", label: "Pendiente de recolección", x: 540, y: 70, tone: "warning", kind: "main", modes: ["directo", "dropi"], phase: "Recolección", actor: "Carrier o Dropi", client: "En preparación", detail: "Permite medir cuánto tarda la recogida antes del handoff.", flags: ["No movilizado", "Reintento posible"] },
  { id: "received", label: "Recibido por transportadora", x: 780, y: 70, tone: "carrier", kind: "main", modes: allRoutes, phase: "Transporte", actor: "Transportadora", client: "En camino", detail: "Frontera de movilización: el carrier ya tiene el paquete.", flags: ["Movilizado", "Salió de bodega"] },
  { id: "transit", label: "En tránsito", x: 960, y: 70, tone: "carrier", kind: "main", modes: allRoutes, phase: "Transporte", actor: "Transportadora", client: "En camino", detail: "El paquete avanza entre origen y destino.", flags: ["Movilizado", "No terminal"] },
  { id: "delivery", label: "En reparto", x: 1130, y: 70, tone: "carrier", kind: "main", modes: allRoutes, phase: "Última milla", actor: "Transportadora", client: "En reparto", detail: "El paquete salió a intento de entrega.", flags: ["Movilizado", "Reintento posible"] },
  { id: "delivered", label: "Entregado", x: 1310, y: 70, tone: "success", kind: "terminal", modes: allRoutes, phase: "Desenlace", actor: "Transportadora", client: "Entregado", detail: "Terminal solo después de una ventana sin rebote.", flags: ["Movilizado", "Terminal por confirmar"] },

  { id: "prepared", label: "Preparado para transportadora", x: 450, y: 205, tone: "ecom", kind: "optional", modes: ["ecom", "dropi"], phase: "ECOM", actor: "Proveedor", client: "En preparación", detail: "ECOM registra que el pedido está listo para salir.", flags: ["No movilizado", "En bodega"] },
  { id: "ecom-handoff", label: "Entregado a transportadora", x: 630, y: 205, tone: "ecom", kind: "optional", modes: ["ecom", "dropi"], phase: "ECOM", actor: "Proveedor / ECOM", client: "En camino", detail: "El nombre suena a preparación, pero implica salida física de bodega.", flags: ["Salida de bodega", "Flag contable crítico"] },
  { id: "dropi-pickup", label: "Recolectado por Dropi", x: 570, y: 335, tone: "dropi", kind: "optional", modes: ["dropi"], phase: "Dropi", actor: "Operación Dropi", client: "En camino", detail: "Dropi recoge el paquete antes de entregarlo al carrier.", flags: ["Movilizado interno", "Salió de bodega"] },
  { id: "dropi-warehouse", label: "En bodega Dropi", x: 750, y: 335, tone: "dropi", kind: "optional", modes: ["dropi"], phase: "Dropi", actor: "Bodega Dropi", client: "En camino", detail: "Paso físico intermedio antes del handoff al carrier.", flags: ["Movilizado interno", "Stock fuera proveedor"] },

  { id: "pickup-failed", label: "Recolección fallida", x: 500, y: 485, tone: "warning", kind: "exception", modes: ["directo", "dropi"], phase: "Recolección", actor: "Carrier o Dropi", client: "En preparación", detail: "La recogida no ocurrió; el paquete sigue fuera de red.", flags: ["No movilizado", "Reversible"] },
  { id: "pickup-retry", label: "Reintento de recolección", x: 680, y: 485, tone: "warning", kind: "exception", modes: ["directo", "dropi"], phase: "Recolección", actor: "Operación", client: "En preparación", detail: "Nuevo intento antes de declarar la orden sin movilización.", flags: ["No movilizado", "Contador por cerrar"] },
  { id: "office", label: "Disponible para retiro", x: 1110, y: 205, tone: "warning", kind: "exception", modes: allRoutes, phase: "Retiro en punto", actor: "Transportadora", client: "Disponible para retiro", detail: "El paquete espera al cliente en oficina o punto físico.", flags: ["Movilizado", "Aviso + fecha límite"] },
  { id: "novelty", label: "Novedad", x: 1010, y: 335, tone: "warning", kind: "exception", modes: allRoutes, phase: "Novedad", actor: "Transportadora / operación", client: "Novedad en tu pedido", detail: "Un intento falló o apareció una incidencia recuperable.", flags: ["Movilizado", "Reversible"] },
  { id: "retry", label: "Reintento de entrega", x: 1190, y: 335, tone: "warning", kind: "exception", modes: allRoutes, phase: "Novedad", actor: "Transportadora", client: "En reparto", detail: "La guía vuelve a reparto después de resolver la novedad.", flags: ["Movilizado", "Máximo por cerrar"] },
  { id: "solved", label: "Novedad solucionada", x: 1360, y: 335, tone: "success", kind: "exception", modes: allRoutes, phase: "Novedad", actor: "Operación", client: "En camino", detail: "La incidencia se resolvió y la guía puede reingresar al flujo.", flags: ["Movilizado", "Reversible"] },
  { id: "sinister", label: "Siniestro", x: 850, y: 500, tone: "danger", kind: "exception", modes: allRoutes, phase: "Siniestro", actor: "Transportadora / legal", client: "Novedad en tu pedido", detail: "Rama transversal por pérdida, daño o incautación.", flags: ["Movilizado", "Excepción"] },
  { id: "indemnified", label: "Indemnizado", x: 1020, y: 500, tone: "danger", kind: "terminal", modes: allRoutes, phase: "Siniestro", actor: "Legal / financiero", client: "Proceso finalizado", detail: "Cierre del siniestro después del proceso de indemnización.", flags: ["Terminal", "Cierre financiero"] },
  { id: "returning", label: "En devolución", x: 1190, y: 500, tone: "return", kind: "exception", modes: allRoutes, phase: "Devolución", actor: "Transportadora", client: "En devolución", detail: "El paquete retorna hacia la bodega o proveedor.", flags: ["Movilizado", "No terminal"] },
  { id: "returned", label: "Devolución confirmada", x: 1360, y: 500, tone: "return", kind: "terminal", modes: allRoutes, phase: "Devolución", actor: "Bodega / proveedor", client: "Proceso finalizado", detail: "El cierre ocurre cuando bodega confirma la recepción física.", flags: ["Terminal", "Libera stock"] },
  { id: "rejected", label: "Rechazado", x: 190, y: 500, tone: "danger", kind: "terminal", modes: allRoutes, phase: "Gestión", actor: "Proveedor", client: "Cancelado", detail: "La orden no entra al flujo logístico.", flags: ["No movilizado", "Terminal"] },
  { id: "cancelled", label: "Cancelado", x: 350, y: 500, tone: "danger", kind: "terminal", modes: allRoutes, phase: "Gestión", actor: "Dropshipper / sistema", client: "Cancelado", detail: "La orden se cierra antes del handoff.", flags: ["No movilizado", "Terminal"] },
];

export const flowEdges: FlowEdge[] = [
  { id: "confirm-pending", path: "M170 102 L190 102", tone: "main", kind: "main", modes: allRoutes },
  { id: "pending-guide", path: "M330 102 L350 102", tone: "main", kind: "main", modes: allRoutes },
  { id: "guide-direct", path: "M490 102 L540 102", tone: "main", kind: "main", modes: ["directo"] },
  { id: "direct-received", path: "M680 102 C715 102 735 102 780 102", tone: "main", kind: "main", modes: ["directo"] },
  { id: "guide-ecom", path: "M420 134 C420 165 450 165 450 205", tone: "optional", kind: "main", modes: ["ecom", "dropi"] },
  { id: "prepared-handoff", path: "M590 237 L630 237", tone: "optional", kind: "main", modes: ["ecom", "dropi"] },
  { id: "ecom-received", path: "M770 237 C800 237 745 135 780 102", tone: "optional", kind: "main", modes: ["ecom"] },
  { id: "handoff-dropi", path: "M700 269 C700 305 640 300 640 335", tone: "optional", kind: "main", modes: ["dropi"] },
  { id: "dropi-warehouse", path: "M710 367 L750 367", tone: "optional", kind: "main", modes: ["dropi"] },
  { id: "warehouse-pending", path: "M820 335 C820 245 610 245 610 134", tone: "optional", kind: "main", modes: ["dropi"] },
  { id: "pending-received-dropi", path: "M680 102 C715 102 735 102 780 102", tone: "main", kind: "main", modes: ["dropi"] },
  { id: "received-transit", path: "M920 102 L960 102", tone: "main", kind: "main", modes: allRoutes },
  { id: "transit-delivery", path: "M1100 102 L1130 102", tone: "main", kind: "main", modes: allRoutes },
  { id: "delivery-delivered", path: "M1270 102 L1310 102", tone: "main", kind: "main", modes: allRoutes },
  { id: "pickup-failed", path: "M610 134 C610 260 570 390 570 485", tone: "warning", kind: "exception", modes: ["directo", "dropi"] },
  { id: "failed-retry", path: "M640 517 L680 517", tone: "warning", kind: "exception", modes: ["directo", "dropi"] },
  { id: "retry-pickup", path: "M750 485 C750 390 640 250 610 134", tone: "warning", kind: "exception", modes: ["directo", "dropi"] },
  { id: "transit-office", path: "M1030 134 C1030 180 1110 170 1110 205", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "office-delivered", path: "M1250 237 C1350 237 1380 170 1380 134", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "delivery-novelty", path: "M1200 134 C1200 240 1080 245 1080 335", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "novelty-retry", path: "M1150 367 L1190 367", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "retry-delivery", path: "M1260 335 C1260 270 1200 215 1200 134", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "novelty-solved", path: "M1150 385 C1220 430 1360 430 1430 399", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "solved-delivery", path: "M1430 335 C1430 230 1200 240 1200 134", tone: "warning", kind: "exception", modes: allRoutes },
  { id: "transit-sinister", path: "M1030 134 C1030 310 920 360 920 500", tone: "danger", kind: "exception", modes: allRoutes },
  { id: "sinister-indemnified", path: "M990 532 L1020 532", tone: "danger", kind: "exception", modes: allRoutes },
  { id: "novelty-return", path: "M1080 399 C1080 465 1190 450 1190 500", tone: "return", kind: "exception", modes: allRoutes },
  { id: "return-returned", path: "M1330 532 L1360 532", tone: "return", kind: "exception", modes: allRoutes },
  { id: "pending-rejected", path: "M260 134 L260 500", tone: "danger", kind: "exception", modes: allRoutes },
  { id: "guide-cancelled", path: "M420 134 L420 500", tone: "danger", kind: "exception", modes: allRoutes },
];

export const phases = [
  {
    id: "gestion",
    number: "01",
    name: "Gestión de orden",
    owner: "Dropshipper / proveedor",
    modes: ["directo", "ecom", "dropi"] as RouteMode[],
    states: ["Por confirmar", "Pendiente", "Guía generada", "Cancelado", "Rechazado"],
  },
  {
    id: "ecom",
    number: "02",
    name: "ECOM",
    owner: "Proveedor",
    modes: ["ecom", "dropi"] as RouteMode[],
    states: ["Preparado para transportadora", "Entregado a transportadora"],
  },
  {
    id: "dropi",
    number: "03",
    name: "Recolección Dropi",
    owner: "Dropi",
    modes: ["dropi"] as RouteMode[],
    states: ["Pendiente de recolección", "Recolección fallida", "Reintento", "Recolectado por Dropi", "En bodega Dropi"],
  },
  {
    id: "transporte",
    number: "04",
    name: "Transporte y entrega",
    owner: "Transportadora",
    modes: ["directo", "ecom", "dropi"] as RouteMode[],
    states: ["Recibido transportadora", "En tránsito", "En reparto", "Disponible para retiro", "Entregado"],
  },
  {
    id: "novedad",
    number: "05",
    name: "Novedad y reintentos",
    owner: "Transportadora / operación",
    modes: ["directo", "ecom", "dropi"] as RouteMode[],
    states: ["Novedad 1/2/3", "Reintento 1/2", "Novedad solucionada"],
  },
  {
    id: "siniestro",
    number: "06",
    name: "Siniestro",
    owner: "Transportadora / legal",
    modes: ["directo", "ecom", "dropi"] as RouteMode[],
    states: ["Siniestro", "En indemnización", "Indemnizado", "Incautado", "Excepción"],
  },
  {
    id: "devolucion",
    number: "07",
    name: "Devolución",
    owner: "Transportadora / bodega",
    modes: ["directo", "ecom", "dropi"] as RouteMode[],
    states: ["En devolución", "Devuelto", "Confirmado por bodega"],
  },
];

export const clientStates = [
  { name: "En preparación", tone: "prep", detail: "Orden, guía, ECOM y pre-recolección" },
  { name: "En camino", tone: "route", detail: "Carrier recibió o está en tránsito" },
  { name: "En reparto", tone: "last", detail: "Sale hoy a entrega" },
  { name: "Disponible para retiro", tone: "pickup", detail: "Nuevo estado propuesto" },
  { name: "Novedad en tu pedido", tone: "issue", detail: "Incidencia activa" },
  { name: "Entregado", tone: "done", detail: "Terminal tras confirmación" },
  { name: "En devolución", tone: "return", detail: "Retorno en curso" },
  { name: "Proceso finalizado", tone: "closed", detail: "Indemnización o devolución cerrada" },
  { name: "Cancelado", tone: "cancel", detail: "Orden no continúa" },
];

/**
 * Un paso de traza. `node` es el id de un `FlowNode` del mapa — nunca una etiqueta suelta:
 * si el paso no se puede homologar a un nodo, `node` es `null` y queda visible como tal.
 * `raw` guarda el texto original de la hoja de campo cuando difiere del nombre del nodo.
 * La vista cliente NO se escribe aquí: se deriva del nodo (capa 3 del modelo).
 */
export type GuideStep = {
  node: string | null;
  raw?: string;
  clientRaw?: string; // solo para pasos sin nodo: qué veía el cliente en ese momento
};

export type GuideExample = {
  id: string;
  carrier: string;
  outcome: "Entregado" | "Devolución";
  highlight: string;
  steps: GuideStep[];
};

const s = (node: string, raw?: string): GuideStep => ({ node, raw });
/** Paso crudo que hoy no tiene nodo homologado. Es un hallazgo, no un error de dibujo. */
const unmapped = (raw: string, clientRaw: string): GuideStep => ({ node: null, raw, clientRaw });

export const guideExamples: GuideExample[] = [
  { id: "240028451950", carrier: "INTERRAPIDISIMO", outcome: "Devolución", highlight: "Proceso finalizado no fue terminal", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), unmapped("Proceso finalizado", "Proceso finalizado"), s("cancelled"), s("returning", "Devolución")] },
  { id: "240028493814", carrier: "INTERRAPIDISIMO", outcome: "Devolución", highlight: "Novedad termina en devolución", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("returning", "Devolución")] },
  { id: "36393180723", carrier: "COORDINADORA", outcome: "Entregado", highlight: "Novedades y reintentos recuperan la entrega", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("delivery"), s("solved"), s("delivery"), s("delivered")] },
  { id: "36393170971", carrier: "COORDINADORA", outcome: "Devolución", highlight: "Usa recolección Dropi", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("dropi-pickup"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("returning", "Devolución")] },
  { id: "36393170001", carrier: "COORDINADORA", outcome: "Devolución", highlight: "Dos novedades solucionadas no evitaron devolución", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("solved"), s("delivery"), s("novelty"), s("solved"), s("returning", "Devolución")] },
  { id: "114014276600", carrier: "ENVIA", outcome: "Devolución", highlight: "Tres ciclos novedad-solución", steps: [s("pending"), s("guide", "Guía generada"), s("prepared", "En preparación"), s("transit"), s("delivery"), s("novelty"), s("solved"), s("delivery"), s("novelty"), s("solved"), s("novelty"), s("solved"), s("returning", "Devolución")] },
  { id: "024029789992", carrier: "ENVIA", outcome: "Devolución", highlight: "Dropi + carrier + novedad", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("dropi-pickup"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("solved"), s("returning", "Devolución")] },
  { id: "3864790571", carrier: "99MINUTOS", outcome: "Devolución", highlight: "Ruta ECOM + Dropi completa", steps: [s("pending"), s("guide", "Guía generada"), s("prepared", "En preparación"), s("dropi-pickup"), s("dropi-warehouse"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("returning", "Devolución en proceso"), s("returning", "Devolución")] },
  { id: "1222059299", carrier: "99MINUTOS", outcome: "Devolución", highlight: "Dos intentos antes de devolución", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("prepared", "En preparación"), s("dropi-pickup"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("delivery"), s("novelty"), s("returning", "Devolución")] },
  { id: "V4001044476", carrier: "VELOCES", outcome: "Devolución", highlight: "Tres novedades antes del retorno", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("dropi-pickup"), s("dropi-warehouse"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("delivery"), s("novelty"), s("novelty"), s("returning", "Devolución en proceso"), s("returning", "Devolución")] },
  { id: "V4001043459", carrier: "VELOCES", outcome: "Entregado", highlight: "Entregado rebotó a reparto", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("dropi-pickup"), s("dropi-warehouse"), s("received", "Recibido transportadora"), s("transit"), s("delivered"), s("delivery"), s("delivered")] },
  { id: "40546381", carrier: "DOMINA", outcome: "Devolución", highlight: "Orden irregular entre carrier y Dropi", steps: [s("pending"), s("guide", "Guía generada"), s("prepared", "En preparación"), s("received", "Recibido transportadora"), s("dropi-pickup"), s("dropi-warehouse"), s("delivery"), s("novelty"), s("solved"), s("returning", "Devolución")] },
  { id: "85910403203823", carrier: "DOMINA", outcome: "Entregado", highlight: "Novedad recuperada", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("prepared", "En preparación"), s("dropi-warehouse"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("novelty"), s("delivery"), s("delivered")] },
  { id: "9641616116781858", carrier: "FUTURA", outcome: "Devolución", highlight: "Reparto y tránsito alternan varias veces", steps: [s("confirm", "Pendiente confirmación"), s("pending"), s("guide", "Guía generada"), s("dropi-pickup"), s("received", "Recibido transportadora"), s("transit"), s("delivery"), s("transit"), s("delivery"), s("transit"), s("returning", "Devolución")] },
];

export const nodeById = new Map(flowNodes.map((node) => [node.id, node]));

/** Nodos que al menos una guía de la muestra recorre. El resto está propuesto, no validado. */
export const exercisedNodeIds = new Set(
  guideExamples.flatMap((guide) => guide.steps.map((step) => step.node).filter((id): id is string => Boolean(id))),
);

export const unexercisedNodes = flowNodes.filter((node) => !exercisedNodeIds.has(node.id));

/**
 * Numera los rebotes: cada vez que la traza vuelve a un nodo ya visitado, ese par de pasos
 * queda marcado con el número de ciclo. Es lo que hace visible "Entregado → En reparto → Entregado".
 */
export function traceCycles(steps: GuideStep[]): (number | undefined)[] {
  const seen = new Map<string, number>();
  return steps.map((step, index) => {
    if (!step.node) return undefined;
    // Un paso consecutivo al mismo nodo NO es rebote: son dos etiquetas crudas
    // distintas para el mismo estado homologado (problema P2 del catálogo).
    if (steps[index - 1]?.node === step.node) return undefined;
    const count = (seen.get(step.node) ?? 0) + 1;
    seen.set(step.node, count);
    return count > 1 ? count : undefined;
  });
}

/** Incoherencias de vocabulario que la normalización de trazas dejó a la vista. */
export const traceFindings = [
  { level: "critico", title: "2 pasos eran de la capa cliente", detail: "«En preparación» y «Proceso finalizado» venían escritos como estados de operador. El primero se reclasificó a «Preparado para transportadora»; el segundo no tiene nodo — es el mismo hallazgo del gate: no es terminal en crudo." },
  { level: "alto", title: "4 etiquetas no existían como nodo", detail: "«Pendiente confirmación» → Por confirmar · «Recibido transportadora» → Recibido por transportadora · «Devolución» → Devolución confirmada · «Devolución en proceso» → En devolución." },
  { level: "critico", title: "Ninguna guía llega al cierre real de la devolución", detail: "El crudo «Devolución» se mapea a «En devolución», no a «Devolución confirmada»: ese estado final lo marca el PROVEEDOR cuando bodega recibe el paquete, y una traza de carrier no puede contenerlo. Resultado: las 11 devoluciones de la muestra terminan con el paquete en retorno y ninguna prueba de recepción física. El cierre de la fase 7 no está validado por ningún dato." },
  { level: "alto", title: "Dos crudos para el mismo estado", detail: "«Devolución» y «Devolución en proceso» caen ambos en «En devolución» (problema P2 del catálogo: etiquetas destino inconsistentes). En 2 guías aparecen seguidos, así que se ven repetidos — no es un rebote." },
  { level: "medio", title: "El nodo «Reintento de entrega» no aparece nunca", detail: "Las trazas reales vuelven directo a «En reparto» después de la novedad. O el nodo sobra, o el reintento no se está registrando como evento propio." },
];

export const decisions = [
  { level: "resuelto", title: "INTENTO DE ENTREGA", question: "¿Significa salida a reparto o intento fallido?", action: "RESUELTO con datos (22-jul): es término propio de Interrapidísimo (99,2% de 145.733 ocurrencias) y ahí significa intento fallido (92,08% → falla). No hay colisión entre carriers → el modelo NO necesita eje por transportadora. Queda validarlo con Interrapidísimo, ya con el número en la mano." },
  { level: "critico", title: "Terminalidad de Entregado", question: "¿Qué capa define el cierre: estado de orden o eventos del carrier?", action: "Ya no falta dato, falta decisión. En estado de orden rebota 0,11% y el máximo es 31h; en eventos de carrier el p99 va de 153h a 495h. Para la vista del cliente manda el estado de orden → umbral del orden de 24–48h." },
  { level: "critico", title: "Re-mapear INTENTO DE ENTREGA", question: "Hoy está clasificado como EN_TRANSITO; los datos dicen NOVEDAD.", action: "145.733 eventos (7,74% del tráfico) contados como tránsito normal en vez de novedad. Corregir el mapeo antes del hand-off: hoy la medición esconde el problema." },
  { level: "alto", title: "Catálogo 26+", question: "¿Reintentos son estados o nivel/contador?", action: "Cerrar el modelo para recolección, entrega y devolución sin inflar la taxonomía." },
  { level: "alto", title: "Vista cliente 8+1", question: "¿Disponible para retiro es un noveno estado?", action: "Recomendación: sí; habilita aviso y fecha límite de recogida." },
  { level: "alto", title: "Implicaciones físicas", question: "¿Cada estado mueve stock, cierre y movilización correctamente?", action: "Completar salida de bodega, reversible, terminal y efecto stock antes de TI." },
  { level: "medio", title: "Cobertura multinacional", question: "¿El catálogo global aguanta tráfico real fuera de Colombia?", action: "Tomar al menos una guía por país y registrar crudos sin mapeo." },
  { level: "medio", title: "Diff de implementación", question: "¿Qué cambia contra la DB vigente?", action: "Recalcular contra la base actual; el plan de 145 ajustes está desactualizado." },
];

/**
 * `peso` = participación MEDIDA de cada ruta sobre las 7.001 órdenes que generaron guía
 * en la ventana mar–jul 2026. Señal usada: presencia del estado que marca cada tramo.
 *   ECOM  → PREPARADO PARA TRANSPORTADORA = 4.799 órdenes (68,5%)
 *   Dropi → RECOGIDO POR DROPI            = 3.096 órdenes (44,2%)
 * Las rutas NO son excluyentes: una orden con Dropi pasó antes por ECOM, por eso no suman 100.
 * Directo = las que no registran ninguna de las dos señales.
 *
 * ⚠️ Corrige una estimación previa (98/0,8/1,2) que era falsa: dividía conteos de un universo
 * por el total de otro. La cifra de acá sí sale del mismo denominador.
 */
export const routeLabels: Record<RouteMode, { label: string; detail: string; peso: string }> = {
  directo: { label: "Directo", detail: "Proveedor entrega al carrier; salta ECOM y Dropi", peso: "~31%" },
  ecom: { label: "ECOM", detail: "Preparación ECOM y entrega directa al carrier", peso: "68,5%" },
  dropi: { label: "ECOM + Dropi", detail: "ECOM obligatorio y recolección operada por Dropi", peso: "44,2%" },
};
