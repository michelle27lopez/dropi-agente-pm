/**
 * COMPARADOR DE CATÁLOGOS — los 51 estados crudos de orden realmente observados,
 * con su destino bajo cada propuesta de homologación.
 *
 * El objetivo NO es elegir por Juan: es poder ver, sobre el mismo tráfico real, cómo queda
 * el vocabulario bajo cada opción — cuántos estados, qué colapsa en qué, y cómo se ve el
 * recorrido mayoritario. La decisión se toma mirando, no leyendo una recomendación.
 *
 * Conteos: corrida read-only 19-mar → 22-jul 2026 · 47.683 eventos de estado de orden.
 * Ninguna métrica de comparación se escribe a mano: se derivan al final del archivo.
 */

export type PropuestaId = "produccion" | "macroproceso" | "minimo" | "cliente";

export const propuestas: {
  id: PropuestaId;
  nombre: string;
  origen: string;
  intencion: string;
  riesgo: string;
}[] = [
  {
    id: "produccion",
    nombre: "Producción hoy",
    origen: "El mapeo que corre hoy en la base",
    intencion: "Mínimo esfuerzo: nadie toca nada.",
    riesgo: "Todo el transporte cae en un solo balde. No se puede medir dónde se traba la orden.",
  },
  {
    id: "macroproceso",
    nombre: "Macroproceso (PDF)",
    origen: "La propuesta vigente del proyecto · 7 fases",
    intencion: "Modelar el proceso completo, incluidos los tramos que hoy no se registran.",
    riesgo: "Varios estados no tienen crudo que los alimente: hay que derivarlos o pedirlos al carrier.",
  },
  {
    id: "minimo",
    nombre: "Mínimo por evidencia",
    origen: "Solo lo que los datos sostienen",
    intencion: "Cada estado tiene crudo real detrás. Nada que no se pueda medir desde el día uno.",
    riesgo: "Pierde la ventana de recolección y el detalle de novedad que el negocio sí opera.",
  },
  {
    id: "cliente",
    nombre: "Vista cliente",
    origen: "Lo que ve el comprador",
    intencion: "El mínimo que necesita quien espera un paquete.",
    riesgo: "No sirve para operar ni para medir: es la capa de salida, no el catálogo.",
  },
];

/**
 * Un crudo observado y a dónde va bajo cada propuesta.
 * `null` = la propuesta no lo contempla (cae en un default observable).
 */
export type CrudoMapeo = {
  crudo: string;
  eventos: number;
  ordenes: number;
  produccion: string;
  macroproceso: string | null;
  minimo: string;
  cliente: string;
};

export const crudos: CrudoMapeo[] = [
  { crudo: "PENDIENTE", eventos: 9258, ordenes: 9244, produccion: "PENDIENTE", macroproceso: "Pendiente", minimo: "Pendiente", cliente: "En preparación" },
  { crudo: "PENDIENTE CONFIRMACION", eventos: 7852, ordenes: 7852, produccion: "PENDIENTE", macroproceso: "Por confirmar", minimo: "Por confirmar", cliente: "En preparación" },
  { crudo: "GUIA_GENERADA", eventos: 7065, ordenes: 7001, produccion: "GUIA_GENERADA", macroproceso: "Guía generada", minimo: "Guía generada", cliente: "En preparación" },
  { crudo: "PREPARADO PARA TRANSPORTADORA", eventos: 4799, ordenes: 4799, produccion: "EN_TRANSITO", macroproceso: "Preparado para transportadora", minimo: "Preparado para transportadora", cliente: "En preparación" },
  { crudo: "RECOGIDO POR DROPI", eventos: 3096, ordenes: 3096, produccion: "EN_TRANSITO", macroproceso: "Recolectado por Dropi", minimo: "Recolectado por Dropi", cliente: "En camino" },
  { crudo: "EN REPARTO", eventos: 2182, ordenes: 1666, produccion: "EN_TRANSITO", macroproceso: "En reparto", minimo: "En reparto", cliente: "En reparto" },
  { crudo: "ENTREGADO", eventos: 1871, ordenes: 1868, produccion: "ENTREGADO", macroproceso: "Entregado", minimo: "Entregado", cliente: "Entregado" },
  { crudo: "EN BODEGA ORIGEN", eventos: 1220, ordenes: 1220, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "DESPACHADA", eventos: 1124, ordenes: 979, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN PROCESAMIENTO", eventos: 980, ordenes: 591, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "NOVEDAD", eventos: 898, ordenes: 503, produccion: "EXCEPCION", macroproceso: "Novedad", minimo: "Novedad", cliente: "Novedad en tu pedido" },
  { crudo: "EN BODEGA TRANSPORTADORA", eventos: 822, ordenes: 510, produccion: "EN_TRANSITO", macroproceso: "Recibido por transportadora", minimo: "Recibido por transportadora", cliente: "En camino" },
  { crudo: "EN BODEGA DROPI", eventos: 718, ordenes: 718, produccion: "EN_TRANSITO", macroproceso: "En bodega Dropi", minimo: "En bodega Dropi", cliente: "En camino" },
  { crudo: "ENTREGADO A TRANSPORTADORA", eventos: 714, ordenes: 714, produccion: "EN_TRANSITO", macroproceso: "Entregado a transportadora", minimo: "Recibido por transportadora", cliente: "En camino" },
  { crudo: "NOVEDAD SOLUCIONADA", eventos: 556, ordenes: 208, produccion: "EXCEPCION", macroproceso: "Novedad solucionada", minimo: "Novedad solucionada", cliente: "En camino" },
  { crudo: "EN BODEGA DESTINO", eventos: 489, ordenes: 372, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "DEVOLUCION", eventos: 412, ordenes: 412, produccion: "DEVOLUCION", macroproceso: "En devolución", minimo: "En devolución", cliente: "En devolución" },
  { crudo: "EN TERMINAL DESTINO", eventos: 373, ordenes: 277, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN TERMINAL ORIGEN", eventos: 354, ordenes: 341, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN DISTRIBUCION", eventos: 269, ordenes: 151, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN DESPACHO", eventos: 263, ordenes: 251, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN RUTA", eventos: 248, ordenes: 183, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "BODEGA DESTINO", eventos: 247, ordenes: 183, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN CAMINO", eventos: 238, ordenes: 180, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "RECLAME EN OFICINA", eventos: 184, ordenes: 184, produccion: "EN_TRANSITO", macroproceso: "Disponible para retiro", minimo: "Disponible para retiro", cliente: "Disponible para retiro" },
  { crudo: "EN TRANSITO", eventos: 179, ordenes: 178, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "INTENTO DE ENTREGA", eventos: 174, ordenes: 152, produccion: "EN_TRANSITO", macroproceso: "Novedad", minimo: "Novedad", cliente: "Novedad en tu pedido" },
  { crudo: "EN TRANSPORTE", eventos: 144, ordenes: 144, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "MERCANCIA RECOGIDA", eventos: 131, ordenes: 131, produccion: "EN_TRANSITO", macroproceso: "Recibido por transportadora", minimo: "Recibido por transportadora", cliente: "En camino" },
  { crudo: "ADMITIDA", eventos: 129, ordenes: 129, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN ESPERA DE RUTA DOMESTICA", eventos: 120, ordenes: 120, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "TELEMERCADEO", eventos: 89, ordenes: 84, produccion: "EN_TRANSITO", macroproceso: "Novedad", minimo: "Novedad", cliente: "Novedad en tu pedido" },
  { crudo: "GUIA_ANULADA", eventos: 67, ordenes: 67, produccion: "CANCELADO", macroproceso: "Cancelado", minimo: "Cancelado", cliente: "Cancelado" },
  { crudo: "EN TRASLADO NACIONAL", eventos: 62, ordenes: 62, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "CANCELADO", eventos: 60, ordenes: 60, produccion: "CANCELADO", macroproceso: "Cancelado", minimo: "Cancelado", cliente: "Cancelado" },
  { crudo: "REENVÍO", eventos: 57, ordenes: 44, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "RECHAZADO", eventos: 49, ordenes: 49, produccion: "RECHAZADO", macroproceso: "Rechazado", minimo: "Rechazado", cliente: "Cancelado" },
  { crudo: "EN REEXPEDICION", eventos: 29, ordenes: 23, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN PROCESO DE DEVOLUCION", eventos: 28, ordenes: 28, produccion: "DEVOLUCION_EN_PROCESO", macroproceso: "En devolución", minimo: "En devolución", cliente: "En devolución" },
  { crudo: "DEVOLUCION EN BODEGA", eventos: 27, ordenes: 27, produccion: "DEVOLUCION", macroproceso: "Devolución confirmada", minimo: "Devolución confirmada", cliente: "Proceso finalizado" },
  { crudo: "ASIGNADO", eventos: 27, ordenes: 24, produccion: "DESCONOCIDO", macroproceso: null, minimo: "En tránsito", cliente: "En camino" },
  { crudo: "ENTREGADA A CONEXIONES", eventos: 23, ordenes: 23, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "TRANSITO A DEVOLUCION PROVEEDOR", eventos: 20, ordenes: 20, produccion: "DEVOLUCION_EN_PROCESO", macroproceso: "En devolución", minimo: "En devolución", cliente: "En devolución" },
  { crudo: "EN PUNTO DROOP", eventos: 15, ordenes: 15, produccion: "EN_TRANSITO", macroproceso: "Disponible para retiro", minimo: "Disponible para retiro", cliente: "Disponible para retiro" },
  { crudo: "SIN MOVIMIENTOS", eventos: 13, ordenes: 13, produccion: "EN_TRANSITO", macroproceso: null, minimo: "Guía generada", cliente: "En preparación" },
  { crudo: "EN ESPERA DE RX", eventos: 3, ordenes: 3, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "DEVOLUCION EN RUTA", eventos: 1, ordenes: 1, produccion: "DEVOLUCION_EN_PROCESO", macroproceso: "En devolución", minimo: "En devolución", cliente: "En devolución" },
  { crudo: "RECEPCION BODEGA", eventos: 1, ordenes: 1, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "ASIGNADO A ZONA", eventos: 1, ordenes: 1, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
  { crudo: "EN PROCESO DE INDEMNIZACION", eventos: 1, ordenes: 1, produccion: "EXCEPCION", macroproceso: "Indemnizado", minimo: "Novedad", cliente: "Novedad en tu pedido" },
  { crudo: "ASIGNADO A SUCURSAL DESTINO", eventos: 1, ordenes: 1, produccion: "EN_TRANSITO", macroproceso: "En tránsito", minimo: "En tránsito", cliente: "En camino" },
];

/**
 * Estados que una propuesta define pero que NINGÚN crudo alimenta.
 * No es un defecto por sí solo — varios existen para poder medir una ventana de tiempo que
 * hoy no se registra. Pero hay que derivarlos por regla o pedírselos al carrier: no llegan solos.
 */
export const estadosSinCrudo: Record<PropuestaId, { estado: string; porQue: string }[]> = {
  produccion: [],
  macroproceso: [
    { estado: "Pendiente de recolección", porQue: "Derivable: guía generada y todavía sin recibir. Sin él no se mide cuánto tarda la recogida." },
    { estado: "Recolección fallida", porQue: "Existe en el vocabulario del carrier, no en el de orden. Hay que subirlo o perderlo." },
    { estado: "Reintento de recolección", porQue: "El ciclo de reintento de recogida no se registra como evento propio." },
    { estado: "Reintento de entrega", porQue: "Las trazas vuelven directo a «En reparto». O sobra el estado, o falta el evento." },
    { estado: "Siniestro", porQue: "Sin crudo observado en la ventana." },
  ],
  minimo: [],
  cliente: [],
};

export const flujoModal = {
  titulo: "El recorrido que sigue la mayoría",
  nota: "Derivado de las transiciones más frecuentes. El tramo de tránsito es el que cambia entre propuestas.",
  pasos: [
    { crudo: "PENDIENTE CONFIRMACION", n: 7805 },
    { crudo: "PENDIENTE", n: 6983 },
    { crudo: "GUIA_GENERADA", n: 4749 },
    { crudo: "PREPARADO PARA TRANSPORTADORA", n: 2629 },
    { crudo: "RECOGIDO POR DROPI", n: 707 },
    { crudo: "EN BODEGA DROPI", n: 711 },
    { crudo: "ENTREGADO A TRANSPORTADORA", n: 343 },
    { crudo: "EN BODEGA ORIGEN", n: 791 },
    { crudo: "DESPACHADA", n: 662 },
    { crudo: "EN REPARTO", n: 1267 },
    { crudo: "ENTREGADO", n: 0 },
  ],
};

// ── Métricas derivadas ────────────────────────────────────────────────────────
// Nada de esto se transcribe: si cambia un mapeo arriba, los números de abajo cambian solos.

export const totalEventos = crudos.reduce((sum, row) => sum + row.eventos, 0);

export function destinoDe(row: CrudoMapeo, propuesta: PropuestaId): string | null {
  return propuesta === "macroproceso" ? row.macroproceso : row[propuesta];
}

export type ResumenPropuesta = {
  id: PropuestaId;
  estados: number;
  sinCrudo: number;
  baldeMayor: { estado: string; crudos: number; pct: number };
  grupos: { estado: string; crudos: number; eventos: number; pct: number }[];
  crudosSinDestino: number;
};

export function resumirPropuesta(id: PropuestaId): ResumenPropuesta {
  const mapa = new Map<string, { crudos: number; eventos: number }>();
  let crudosSinDestino = 0;

  for (const row of crudos) {
    const destino = destinoDe(row, id);
    if (!destino) {
      crudosSinDestino += 1;
      continue;
    }
    const actual = mapa.get(destino) ?? { crudos: 0, eventos: 0 };
    mapa.set(destino, { crudos: actual.crudos + 1, eventos: actual.eventos + row.eventos });
  }

  const grupos = [...mapa.entries()]
    .map(([estado, valor]) => ({
      estado,
      crudos: valor.crudos,
      eventos: valor.eventos,
      pct: Number(((valor.eventos / totalEventos) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.eventos - a.eventos);

  const porCrudos = [...grupos].sort((a, b) => b.crudos - a.crudos)[0];
  const sinCrudo = estadosSinCrudo[id].length;

  return {
    id,
    estados: grupos.length + sinCrudo,
    sinCrudo,
    baldeMayor: { estado: porCrudos.estado, crudos: porCrudos.crudos, pct: porCrudos.pct },
    grupos,
    crudosSinDestino,
  };
}

export const resumenes = propuestas.map((p) => resumirPropuesta(p.id));
