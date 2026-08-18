// ─────────────────────────────────────────────────────────────────────────────
// LA COLA DE LOGÍSTICA CON TI
//
// Fuente: hoja "Mejoras e Incidencias Transportadoras" que mantiene el equipo
// de Logística.
// https://docs.google.com/spreadsheets/d/1kK9RJjCKONzkUnZ_uECL7kdCNy8SUVdIwqA7BRgUGzo
//
// POR QUÉ ES UNA COPIA Y NO UNA CONEXIÓN EN VIVO
// El hub compila en Vercel y una lectura en vivo exigiría credenciales de
// Google en el build. Pero la razón de fondo es otra: la hoja se edita a mano
// entre varias personas y su formato no soporta lectura automática —fechas en
// cinco formatos distintos ("6/ago/2026", "17-12-2025", "2027"), la columna de
// prioridad mezcla números con la palabra "Finalizado", y hay un #REF! en el
// resumen—. Una conexión automática sobre eso rompería el tablero en silencio
// el día que alguien inserte una fila.
//
// Así que: copia fechada, se refresca a mano releyendo la hoja. Explícito y
// verificable, en vez de automático y frágil.
//
// QUÉ SE COPIÓ Y QUÉ NO
// Solo las filas con prioridad numérica (0–9): son la cola real. Las de
// prioridad "20" son el montón sin priorizar y las "Finalizado" ya cerraron;
// meterlas aquí convertiría una cola de 12 en una lista de 60 sin orden.
// ─────────────────────────────────────────────────────────────────────────────

export type ItemColaTI = {
  /** Orden de prioridad que Logística declaró ante TI. 0 = primero. */
  prioridad: number;
  nombre: string;
  /** Qué es, en una frase. El detalle largo se queda en la hoja. */
  descripcion?: string;
  /**
   * Fecha de registro en la hoja, en ISO. Es el dato más duro de todos: la
   * antigüedad de una petición dice más del cuello que cualquier estimación.
   * El panel de Servientrega lleva pedido desde enero de 2024.
   */
  pedidoDesde: string;
  /** Transportadora concreta, cuando la petición es de una sola. */
  transportadora?: string;
  /** Slug de la iniciativa del tablero, cuando esta fila ya es un proyecto nuestro. */
  slug?: string;
  /** Lo último que TI o Logística anotó, con su fecha. */
  ultimoEstado?: string;
  /** Quién lo tiene en TI. Vacío = nadie lo tiene asignado, y eso es el hallazgo. */
  desarrollador?: string;
  /** Compromiso de entrega tal como está escrito en la hoja. Varios son solo un año. */
  compromiso?: string;
};

/** "2 años 7 meses". Redondea a la baja: exagerar la espera restaría credibilidad. */
export function tiempoEsperando(desdeISO: string, ahora = new Date()): string {
  const desde = new Date(desdeISO);
  let meses = (ahora.getFullYear() - desde.getFullYear()) * 12 + (ahora.getMonth() - desde.getMonth());
  if (ahora.getDate() < desde.getDate()) meses -= 1;
  if (meses < 1) return "menos de un mes";
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  const resto = meses % 12;
  const a = `${anios} ${anios === 1 ? "año" : "años"}`;
  return resto === 0 ? a : `${a} ${resto} ${resto === 1 ? "mes" : "meses"}`;
}

/** Meses de espera, para ordenar y para decidir cuándo la antigüedad ya es una alarma. */
export function mesesEsperando(desdeISO: string, ahora = new Date()): number {
  const desde = new Date(desdeISO);
  return (ahora.getFullYear() - desde.getFullYear()) * 12 + (ahora.getMonth() - desde.getMonth());
}

export const COLA_TI_FUENTE = {
  url: "https://docs.google.com/spreadsheets/d/1kK9RJjCKONzkUnZ_uECL7kdCNy8SUVdIwqA7BRgUGzo/edit",
  hoja: "Mejoras e Incidencias Transportadoras",
  leidaEl: "12-ago-2026",
};

/** Capacidad declarada en el cronograma: ~1 dev, ~6 semanas por frente, secuencial. */
export const SEMANAS_POR_FRENTE = 6;

export const colaTI: ItemColaTI[] = [
  {
    prioridad: 0,
    nombre: "Cobro del seguro de devoluciones",
    descripcion: "Que el vendedor active el cobro, y que la transportadora sepa qué envíos llevan seguro y cuáles devolución.",
    pedidoDesde: "2026-08-06",
    transportadora: "Coordinadora",
    ultimoEstado: "12-ago: pendiente de gestión de TI (Francisco Ramírez).",
  },
  {
    prioridad: 1,
    nombre: "Stock Pro en bodegas",
    descripcion: "Terminar la implementación en las bodegas de fulfillment de Colombia.",
    pedidoDesde: "2026-08-06",
    compromiso: "2027",
    desarrollador: "Fabián Castro · Johnatan Amado",
    ultimoEstado: "12-ago: en implementación en Colombia.",
  },
  {
    prioridad: 2,
    nombre: "Mejoras a Ecom Scanner",
    descripcion: "Ver la guía original al leer una de devolución, y dejar trazabilidad de la guía reemplazatoria en base de datos.",
    pedidoDesde: "2026-07-31",
    slug: "guias-reemplazatorias",
    compromiso: "2027",
    desarrollador: "Martín Jiménez · Johan Sebastián Palacio",
    ultimoEstado: "12-ago: Coordinadora ya tiene documentación. TCC desarrolló y espera; Inter en gestión.",
  },
  {
    prioridad: 3,
    nombre: "Dropi Go",
    descripcion: "Puente entre transportadoras y Dropi para integrarlas más rápido. Es un servicio aparte.",
    pedidoDesde: "2026-07-31",
    compromiso: "1-sep-2026",
    ultimoEstado: "12-ago: hubo incidencias de conexión, en solución.",
  },
  {
    prioridad: 4,
    nombre: "Reversar indemnizaciones en masa",
    descripcion: "Hoy solo se pueden reversar una por una.",
    pedidoDesde: "2026-07-31",
    ultimoEstado: "12-ago: Francisco revisará la información que le pasó Juan Diego.",
  },
  {
    prioridad: 4,
    nombre: "Rediseño del módulo de garantías",
    pedidoDesde: "2026-07-31",
  },
  {
    prioridad: 5,
    nombre: "Tarifas de transportadoras",
    descripcion: "Módulo dentro de Dropi para parametrizar las tarifas de cada transportadora.",
    pedidoDesde: "2026-07-31",
    slug: "tarifas",
  },
  {
    prioridad: 5,
    nombre: "Tarifas de fulfillment",
    descripcion: "Módulo dentro de Dropi para parametrizar el cobro de fulfillment.",
    pedidoDesde: "2026-07-31",
    slug: "fulfillment",
  },
  {
    prioridad: 6,
    nombre: "Reportería por área",
    descripcion: "Descargas a la medida de cada área, con acceso a las bases que necesitan.",
    pedidoDesde: "2026-07-31",
  },
  {
    prioridad: 7,
    nombre: "Contacto de devoluciones en la bodega",
    descripcion: "Pedir correo y WhatsApp adicionales al crear la bodega, para gestionar devoluciones.",
    pedidoDesde: "2026-08-03",
  },
  {
    prioridad: 8,
    nombre: "Pruebas de entrega por API",
    descripcion: "Que las pruebas de entrega y devolución se puedan consultar por API.",
    pedidoDesde: "2025-09-24",
    slug: "pruebas-entrega",
    ultimoEstado: "Última nota: pendiente. Sin avance registrado desde enero.",
  },
  {
    prioridad: 9,
    nombre: "Panel de novedades de Servientrega",
    descripcion: "Es la única transportadora que no está integrada correctamente, teniendo API disponible.",
    pedidoDesde: "2024-01-01",
    transportadora: "Servientrega · Panamá",
    ultimoEstado: "Última nota: aún en cola.",
  },
];

/**
 * Proyección de cuándo alcanzaría cada ítem, derivada de la cola y la capacidad.
 *
 * NO es un compromiso ni una fecha acordada con TI: es la consecuencia
 * aritmética de dos cosas que ya están declaradas —el orden de prioridad y
 * "~1 dev, ~6 semanas por frente, secuencial"—. Su valor es responder "si esto
 * sigue así, ¿cuándo llega lo mío?", y la respuesta suele incomodar: el ítem
 * número 9 de la cola no arranca hasta dentro de más de un año.
 *
 * Se marca como proyección en la UI. Un cronograma con fechas inventadas se
 * acaba usando para comprometerse con dirección, y por eso el origen tiene que
 * ir escrito al lado del gráfico.
 */
export function proyeccion(desde = new Date()) {
  let semanas = 0;
  return colaTI.map((item) => {
    const inicio = new Date(desde);
    inicio.setDate(inicio.getDate() + semanas * 7);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + SEMANAS_POR_FRENTE * 7);
    semanas += SEMANAS_POR_FRENTE;
    return { ...item, inicio, fin, semanasDeEspera: semanas - SEMANAS_POR_FRENTE };
  });
}

/** Cuántos de la cola ya son iniciativas del portafolio y cuántos no están en el tablero. */
export function cruceConElTablero() {
  const enElTablero = colaTI.filter((i) => i.slug).length;
  return {
    total: colaTI.length,
    enElTablero,
    fueraDelTablero: colaTI.length - enElTablero,
  };
}
