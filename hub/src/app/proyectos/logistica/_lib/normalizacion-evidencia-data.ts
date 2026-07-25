/**
 * EVIDENCIA MEDIDA — corrida de análisis del 22-jul-2026 sobre réplica interna de datos Dropi.
 *
 * Separada a propósito de `normalizacion-estados-data.ts`, que contiene la PROPUESTA
 * (catálogo de 26, mapa, trazas). Esto es lo que los datos dicen; aquello es lo que
 * proponemos. Mezclarlos sería el mismo error de capas que el proyecto denuncia.
 *
 * Fuente: corrida read-only sobre réplica interna (scripts fuera de este repo).
 * Ventana: 2026-03-19 → 2026-07-22 · Colombia.
 *
 * ⚠️ Los tres runs NO miran el mismo vocabulario. Ver `vocabularios` abajo.
 */

export const evidenciaMeta = {
  fecha: "22-jul-2026",
  fuente: "Réplica interna de datos Dropi (read-only)",
  ventana: "19-mar → 22-jul 2026",
  advertencia: "125.232 órdenes · 1,88M eventos · Colombia. Alcance suficiente para medir transiciones y rebotes, no para proyectar volumen anual.",
};

/**
 * Las dos capas de vocabulario que la corrida midió por separado.
 * `CONTEXTO_ESTADOS_DROPI.md §3.5` advierte que el vocabulario C es texto libre y
 * NO homologable uno a uno — la corrida lo confirma (9.415 valores) y a la vez muestra
 * que es tratable por volumen (80% del tráfico son 16 estados).
 */
export const vocabularios = [
  {
    id: "A",
    nombre: "Estado de ORDEN",
    fuente: "dropi_order_history",
    eventos: 47_683,
    estadosDistintos: 51,
    sinClasificar: 1,
    sinClasificarDetalle: "ASIGNADO (27 ocurrencias)",
    cortes: [
      { pct: "80%", estados: 9 },
      { pct: "95%", estados: 21 },
      { pct: "99%", estados: 32 },
    ],
    lectura:
      "Confirma la hipótesis del discovery: el catálogo publica ~900 estados y solo ~50 circulan. La homologación de la capa orden está prácticamente hecha.",
    tono: "bueno" as const,
  },
  {
    id: "C",
    nombre: "Movimientos del carrier",
    fuente: "raw_data.servientrega_movements",
    eventos: 1_883_560,
    estadosDistintos: 9_415,
    sinClasificar: 12,
    sinClasificarDetalle: "códigos numéricos de Veloces y textos libres de +60 caracteres",
    cortes: [
      { pct: "80%", estados: 16 },
      { pct: "95%", estados: 70 },
      { pct: "99%", estados: 624 },
    ],
    lectura:
      "Texto libre del transportador. No se homologa uno a uno, pero sí por volumen: 16 estados cubren el 80% del tráfico. Es narrativa, no máquina de estados.",
    tono: "cuidado" as const,
  },
];

/** Top de estados realmente observados, por vocabulario. */
export const topEstadosOrden = [
  { estado: "PENDIENTE", n: 9258, pct: 19.42, cum: 19.42 },
  { estado: "PENDIENTE CONFIRMACION", n: 7852, pct: 16.47, cum: 35.88 },
  { estado: "GUIA_GENERADA", n: 7065, pct: 14.82, cum: 50.7 },
  { estado: "PREPARADO PARA TRANSPORTADORA", n: 4799, pct: 10.06, cum: 60.76 },
  { estado: "RECOGIDO POR DROPI", n: 3096, pct: 6.49, cum: 67.26 },
  { estado: "EN REPARTO", n: 2182, pct: 4.58, cum: 71.83 },
  { estado: "ENTREGADO", n: 1871, pct: 3.92, cum: 75.76 },
  { estado: "EN BODEGA ORIGEN", n: 1220, pct: 2.56, cum: 78.32 },
  { estado: "DESPACHADA", n: 1124, pct: 2.36, cum: 80.67 },
];

export const topEstadosCarrier = [
  { estado: "RECLAME EN OFICINA", n: 417_630, pct: 22.17, cum: 22.17 },
  { estado: "TRANSITO NACIONAL", n: 221_450, pct: 11.76, cum: 33.93 },
  { estado: "CENTRO ACOPIO", n: 214_363, pct: 11.38, cum: 45.31 },
  { estado: "INTENTO DE ENTREGA", n: 145_733, pct: 7.74, cum: 53.05 },
  { estado: "TRANSITO REGIONAL", n: 92_284, pct: 4.9, cum: 57.95 },
  { estado: "EN REPARTO", n: 89_625, pct: 4.76, cum: 62.7 },
  { estado: "EN BODEGA ORIGEN", n: 49_030, pct: 2.6, cum: 65.31 },
  { estado: "REPARTO", n: 43_328, pct: 2.3, cum: 67.61 },
  { estado: "ENTREGADA DIGITALIZADA", n: 38_720, pct: 2.06, cum: 69.66 },
  { estado: "ENTREGADA", n: 33_979, pct: 1.8, cum: 71.47 },
];

/** GATE 1 · ¿qué significa INTENTO DE ENTREGA? — resuelto por datos. */
export const gateIntento = {
  estado: "resuelto" as const,
  titular: "Es término propio de Interrapidísimo y significa INTENTO FALLIDO",
  ocurrenciasTotales: 145_733,
  ocurrenciasInter: 144_575,
  concentracion: 99.2,
  filas: [
    { carrier: "INTERRAPIDISIMO", termino: "INTENTO DE ENTREGA", n: 144_575, entregado: 2.61, falla: 92.08, lectura: "Intento fallido" },
    { carrier: "ENVIA", termino: "EN REPARTO (control)", n: 75_052, entregado: 44.93, falla: 8.66, lectura: "Salió a reparto" },
    { carrier: "COORDINADORA", termino: "EN REPARTO (control)", n: 12_888, entregado: 44.2, falla: 9.23, lectura: "Salió a reparto" },
  ],
  consecuencia:
    "No es un término compartido entre transportadoras → no hay colisión semántica → el modelo NO necesita eje por transportadora. Era la decisión de arquitectura más cara del proyecto.",
  reserva:
    "El veredicto del reporte está editado a mano; los CSV lo sostienen, pero conviene volver a correr el script antes de citarlo en la presentación.",
};

/** Hallazgo colateral del gate 1: el estado está hoy mal clasificado. */
export const hallazgoMapeo = {
  estado: "INTENTO DE ENTREGA",
  mapeoActual: "EN_TRANSITO",
  mapeoCorrecto: "NOVEDAD",
  ocurrencias: 145_733,
  pctTrafico: 7.74,
  impacto:
    "Novedades contadas como tránsito normal. Es la dirección que más duele: el problema queda invisible en la medición.",
};

/**
 * GATE 2 · terminalidad de Entregado. Los dos vocabularios NO coinciden,
 * y no es contradicción: responden preguntas distintas. Cuál gobierna es una
 * DECISIÓN de producto, no un dato.
 */
export const gateTerminalidad = {
  estado: "abierto" as const,
  titular: "Los dos vocabularios dan umbrales muy distintos",
  pregunta: "¿Qué capa define «Entregado» para el cliente: el estado de la orden o los eventos del carrier?",
  lecturas: [
    {
      vocab: "A · estado de orden",
      pregunta: "¿Se reabre la orden en Dropi?",
      alcanzado: 1868,
      rebota: 2,
      rebotePct: 0.11,
      p99h: 30.77,
      maxh: 30.94,
      conclusion: "31 horas cubren el 100% de la muestra. Los 2 rebotes fueron a NOVEDAD.",
      reserva: "Universo chico (1.868 entregas). Con 2 casos, la diferencia entre 0,11% y 1,5% es ruido.",
    },
    {
      vocab: "C · eventos del carrier",
      pregunta: "¿El carrier sigue emitiendo eventos?",
      alcanzado: 71_899,
      rebota: 2265,
      rebotePct: 3.15,
      p99h: 495.44,
      maxh: 526.13,
      conclusion: "El p99 va de 153h (TCC) a 495h (Coordinadora). Un umbral único sería de ~3 semanas.",
      reserva: "Incluye eventos administrativos posteriores a la entrega, que no reabren la orden.",
    },
  ],
  recomendacion:
    "Para decidir cuándo mostrar «Entregado» al cliente manda el vocabulario A. El umbral está en el orden de 24–48h, no de 3 semanas. Confirmar sobre más volumen antes de fijarlo en el spec.",
};

/** Rebote por estado terminal y transportadora (vocabulario C). */
export const reboteTerminales = [
  { carrier: "COORDINADORA", terminal: "PEDIDO CANCELADO", alcanzado: 984, rebota: 980, pct: 99.59, p50h: 0.05, p99h: 8.66, alerta: true },
  { carrier: "ENVIA", terminal: "DEVUELTA", alcanzado: 4571, rebota: 2183, pct: 47.76, p50h: 77.05, p99h: 377.33, alerta: true },
  { carrier: "INTERRAPIDISIMO", terminal: "DEVOLUCION RATIFICADA", alcanzado: 7551, rebota: 1502, pct: 19.89, p50h: 131.84, p99h: 353.66, alerta: true },
  { carrier: "INTERRAPIDISIMO", terminal: "ENTREGADA", alcanzado: 26_514, rebota: 1513, pct: 5.71, p50h: 16.11, p99h: 181.72, alerta: false },
  { carrier: "ENVIA", terminal: "ENTREGADA DIGITALIZADA", alcanzado: 38_720, rebota: 641, pct: 1.66, p50h: 66.58, p99h: 477.82, alerta: false },
  { carrier: "COORDINADORA", terminal: "ENTREGADA", alcanzado: 6564, rebota: 96, pct: 1.46, p50h: 1.31, p99h: 495.44, alerta: false },
  { carrier: "TCC", terminal: "ENVIO ENTREGADO AL DESTINATARIO", alcanzado: 9101, rebota: 15, pct: 0.16, p50h: 19.48, p99h: 153.54, alerta: false },
];

/** Órdenes por transportadora en la ventana medida. */
export const ordenesPorCarrier = [
  { carrier: "ENVIA", ordenes: 52_513 },
  { carrier: "INTERRAPIDISIMO", ordenes: 41_957 },
  { carrier: "TCC", ordenes: 17_612 },
  { carrier: "COORDINADORA", ordenes: 10_558 },
  { carrier: "VELOCES", ordenes: 2245 },
  { carrier: "JAMV-DRIVE", ordenes: 116 },
  { carrier: "SUPPLI-EXPRESS", ordenes: 112 },
  { carrier: "DOMINA", ordenes: 74 },
  { carrier: "DEROCHA-EXPRESS", ordenes: 42 },
  { carrier: "QUVI", ordenes: 3 },
];

/** Longitud de traza (vocabulario C). */
export const longitudTraza = { ordenes: 125_232, eventos: 1_883_560, mediana: 8, p90: 34, p99: 115, max: 543 };
