import type { Camino, EstadoCamino, FilaEvento, FilaModalOTour, LineaDeTiempoUsuario, SlotId } from "./tipos";
import { derivarEstadoModalOTour } from "./cronologia";

// Dobla los pasos reales (Modal + Tour, y para "producto"/"orden_manual"
// también su modal de felicitación) al estado terminal Completed/Dismissed
// que espera brands_ttfo_caminos. La tabla solo admite esos dos valores (ver
// el CHECK de 024_brands_ttfo.sql) — si ninguna señal llega a Completed/
// Dismissed, no se escribe fila para ese usuario+camino, igual que
// "ausencia = no lo usó" en esquema_medicion_onboarding_brands.md.
//
// Los 4 caminos no tienen la misma forma real: "bodega" no tiene una modal de
// felicitación propia (solo Crea bodega + Tour); "producto" sí la tiene;
// "orden_manual" e "integraciones" se disparan ambos desde un botón dentro de
// ⑧ "Felicidades producto creado" y solo tienen Tour + Modal de felicitación
// (sin modal de "creación" propia). Por eso la lista de señales por camino es
// explícita, no generalizada.

const SENALES_POR_CAMINO: Record<Camino, Exclude<SlotId, "encuesta">[]> = {
  bodega: ["modal_crea_bodega", "tour_bodegas"], // sin modal de felicitación propia
  producto: ["modal_sube_producto", "tour_productos", "modal_felicidades_producto"],
  orden_manual: ["tour_orden_manual", "modal_felicidades_orden_manual"],
  integraciones: ["tour_integraciones", "modal_felicidades_integracion"],
};

const EVENTO_POR_CAMINO: Record<Camino, Exclude<SlotId, "encuesta">> = {
  bodega: "evento_guardar_bodega",
  producto: "evento_guardar_producto",
  orden_manual: "evento_enviar_cliente",
  integraciones: "evento_crear_integraciones",
};

/** Caminos donde ya validamos con datos reales que evento↔modal final son paralelos (ver fechaEventoCamino). */
const CAMINOS_CON_PARALELISMO_VALIDADO: Camino[] = ["orden_manual"];

/**
 * Caminos donde se ASUME el mismo paralelismo por analogía estructural
 * (mismo patrón Tour → Evento → Modal, sin modal de creación propia), pero
 * sin datos reales todavía para confirmarlo — mapeado el 29-jul-2026, antes
 * de que llegara ningún archivo de integraciones.
 *
 * "bodega" y "producto" se agregaron el 04-ago-2026 a pedido de Kate: para
 * Raw Data (automatización) el evento (`Ev_`) quedó apagado a propósito —
 * "no obligatorio... la data raw omite el tema del evento" — y el modal ya
 * es prueba suficiente de que el paso ocurrió, sin depender del evento.
 */
const CAMINOS_CON_PARALELISMO_ASUMIDO: Camino[] = ["integraciones", "bodega", "producto"];

function esFilaModalOTour(valor: unknown): valor is FilaModalOTour {
  return typeof valor === "object" && valor !== null && "totalCompleted" in valor;
}

function esFilaEvento(valor: unknown): valor is FilaEvento {
  return typeof valor === "object" && valor !== null && "totalOcurrencias" in valor;
}

export interface CaminoDerivado {
  camino: Camino;
  estado: EstadoCamino;
  lastCompleted: string | null;
  lastDismissed: string | null;
}

/** Prioridad Completed > Dismissed > (nada), aplicada sobre todas las señales del camino. */
export function derivarCaminoEstado(linea: LineaDeTiempoUsuario, camino: Camino): CaminoDerivado | null {
  const filas = SENALES_POR_CAMINO[camino]
    .map(slot => linea.pasos[slot])
    .filter(esFilaModalOTour);

  if (filas.length === 0) return null;

  const completada = filas.find(f => derivarEstadoModalOTour(f) === "Completed");
  if (completada) {
    return { camino, estado: "Completed", lastCompleted: completada.lastCompleted, lastDismissed: null };
  }
  const descartada = filas.find(f => derivarEstadoModalOTour(f) === "Dismissed");
  if (descartada) {
    return { camino, estado: "Dismissed", lastCompleted: null, lastDismissed: descartada.lastDismissed };
  }
  return null; // solo "Seen"/"no_disparado" → no escribe fila, igual que "no lo usó"
}

export function derivarTodosLosCaminos(linea: LineaDeTiempoUsuario): CaminoDerivado[] {
  return (Object.keys(SENALES_POR_CAMINO) as Camino[])
    .map(camino => derivarCaminoEstado(linea, camino))
    .filter((c): c is CaminoDerivado => c !== null);
}

/**
 * Modal final de cada camino — el último paso de SENALES_POR_CAMINO, usado
 * como respaldo cuando no hay evento. "bodega" no tiene modal de
 * felicitación propia (ver SENALES_POR_CAMINO) — su último paso real es el
 * Tour, así que ese es el que hace de "final" acá.
 */
const MODAL_FINAL_POR_CAMINO: Partial<Record<Camino, Exclude<SlotId, "encuesta">>> = {
  orden_manual: "modal_felicidades_orden_manual",
  integraciones: "modal_felicidades_integracion",
  producto: "modal_felicidades_producto",
  bodega: "tour_bodegas",
};

/**
 * Fecha del evento correspondiente a un camino, con la regla de paralelismo
 * evento↔modal: la modal de felicidades únicamente puede dispararse si el
 * evento ya ocurrió, así que su sola presencia (con su propio lastCompleted)
 * es prueba de que el evento pasó, aunque no tenga fila propia en el archivo
 * del evento — típicamente un hueco de exportación de UserPilot, no una
 * ausencia real.
 *
 * Confirmado con datos reales solo para "orden_manual" (28-jul-2026). Para
 * "integraciones" se aplica igual, pero es un supuesto por analogía
 * estructural, sin validar todavía — ver CAMINOS_CON_PARALELISMO_ASUMIDO. Si
 * al llegar los primeros archivos reales de integraciones el patrón no se
 * sostiene, hay que sacarlo de esa lista, no ajustar la fecha en silencio.
 */
export function fechaEventoCamino(linea: LineaDeTiempoUsuario, camino: Camino): string | null {
  const evento = linea.pasos[EVENTO_POR_CAMINO[camino]];
  if (esFilaEvento(evento) && evento.firstOccurred) return evento.firstOccurred;

  const aplicaParalelismo = CAMINOS_CON_PARALELISMO_VALIDADO.includes(camino)
    || CAMINOS_CON_PARALELISMO_ASUMIDO.includes(camino);
  const slotModalFinal = MODAL_FINAL_POR_CAMINO[camino];

  if (aplicaParalelismo && slotModalFinal) {
    const modalFinal = linea.pasos[slotModalFinal];
    if (esFilaModalOTour(modalFinal) && derivarEstadoModalOTour(modalFinal) === "Completed" && modalFinal.lastCompleted) {
      return modalFinal.lastCompleted; // inferido vía la regla de paralelismo, no fila directa
    }
  }

  return null;
}
