import type {
  Alertas, Camino, EstadoCamino, Gatillo,
  LineaDeTiempoUsuario, ResultadoUsuario, Segmento, SlotId,
} from "./tipos";
import { REGISTRO_SLOTS } from "./registroSlots";

// Las 4 alertas pedidas por Kate (28/29-jul-2026). Ninguna asume una
// explicación ("diseño distinto por segmento", etc.) — solo reporta el
// número. Cuentas de prueba (esPrueba=true) se excluyen de las 4.

function esFilaConEvidencia(valor: unknown): boolean {
  if (valor === undefined || valor === "no_disparado") return false;
  if (typeof valor === "object" && valor !== null) {
    if ("totalCompleted" in valor) {
      const f = valor as { totalCompleted: number; totalDismissed: number; totalSeen: number };
      return f.totalCompleted > 0 || f.totalDismissed > 0 || f.totalSeen > 0;
    }
    if ("totalOcurrencias" in valor) {
      const f = valor as { totalOcurrencias: number };
      return f.totalOcurrencias > 0;
    }
  }
  return false;
}

/**
 * "Flujo completo" = bodega + producto + (orden_manual O integraciones) —
 * ⑧ es una bifurcación con 2 botones, no un paso que requiera ambos caminos.
 * No usar un conteo fijo (>=3/>=4): con 4 caminos posibles pero solo uno de
 * los 2 finales necesario, un conteo numérico se rompe apenas haya datos
 * reales de integraciones.
 */
function completoElFlujo(r: ResultadoUsuario): boolean {
  const completados = new Set(r.caminos.filter(c => c.estado === "Completed").map(c => c.camino));
  return completados.has("bodega") && completados.has("producto")
    && (completados.has("orden_manual") || completados.has("integraciones"));
}

/** A: consumió el flujo entero (bodega + producto + orden_manual/integraciones) Y creó la orden, atribuible. */
export function alertaA_FlujoCompletoYOrden(resultados: ResultadoUsuario[]): Alertas["flujoCompletoYOrden"] {
  return resultados
    .filter(r => !r.esPrueba && r.primeraOrden !== null && r.gatillo === "gatillo_cerrado" && completoElFlujo(r))
    .map(r => ({ userId: r.userId, segmento: r.segmento }));
}

/** B: disparó el evento de crear orden sin haber completado el flujo, dentro del cohorte. */
export function alertaB_OrdenSinFlujo(resultados: ResultadoUsuario[]): Alertas["ordenSinFlujo"] {
  return resultados
    .filter(r => !r.esPrueba && r.primeraOrden !== null && !completoElFlujo(r))
    .map(r => ({ userId: r.userId, segmento: r.segmento }));
}

/**
 * C: población DEL COHORTE que llega a cada paso, y la caída absoluta/
 * relativa contra el paso anterior.
 *
 * Bug real encontrado al correr contra data real (29-jul-2026): los archivos
 * de evento traen miles de filas de TODA la plataforma (cualquiera que
 * dispare "Guardar bodega"/"Enviar al cliente" en su operación normal, no
 * solo quien está en el tour de onboarding hoy) — exactamente el problema de
 * "usuarios fuera del cohorte" que ya habíamos detectado a mano. Por eso acá
 * se restringe explícitamente a `idsCohorte` (los que sí respondieron la
 * Encuesta y pasaron el filtro de calcularResultadoUsuario), no a todo
 * `lineas` — de lo contrario la población de un evento evergreen se ve
 * inflada muy por encima de la del paso anterior y la caída da negativa/sin
 * sentido.
 */
export function alertaC_MayorCaidaPorPaso(
  lineas: Map<number, LineaDeTiempoUsuario>,
  idsCohorte: Set<number>,
  idsPrueba: Set<number>,
): Alertas["mayorCaidaPorPaso"] {
  const slotsEnOrden = REGISTRO_SLOTS.filter(s => s.id !== "encuesta").map(s => s.id) as Exclude<SlotId, "encuesta">[];

  const poblacionPorSlot = slotsEnOrden.map(slot => {
    let poblacion = 0;
    for (const linea of lineas.values()) {
      if (!idsCohorte.has(linea.userId)) continue;
      if (idsPrueba.has(linea.userId)) continue;
      if (esFilaConEvidencia(linea.pasos[slot])) poblacion += 1;
    }
    return { slot, poblacion };
  });

  return poblacionPorSlot.map((actual, i) => {
    const anterior = i === 0 ? null : poblacionPorSlot[i - 1];
    const caidaAbsoluta = anterior ? anterior.poblacion - actual.poblacion : 0;
    const caidaRelativa = anterior && anterior.poblacion > 0 ? caidaAbsoluta / anterior.poblacion : 0;
    return { slot: actual.slot, poblacion: actual.poblacion, caidaAbsoluta, caidaRelativa };
  });
}

/** D: Marca vs Proveedor, siempre los dos números lado a lado — nunca un solo agregado. */
export function alertaD_SegmentoConMasCaida(resultados: ResultadoUsuario[]): Alertas["segmentoConMasCaida"] {
  const porSegmento = (segmento: Segmento) => {
    const delSegmento = resultados.filter(r => !r.esPrueba && r.segmento === segmento);
    const avanzan = delSegmento.filter(r => r.caminos.length > 0).length;
    return {
      poblacion: delSegmento.length,
      avanzan,
      pct: delSegmento.length > 0 ? avanzan / delSegmento.length : 0,
    };
  };
  return { marca: porSegmento("marca"), proveedor: porSegmento("proveedor") };
}

export function calcularAlertas(
  resultados: ResultadoUsuario[],
  lineas: Map<number, LineaDeTiempoUsuario>,
): Alertas {
  const idsPrueba = new Set(resultados.filter(r => r.esPrueba).map(r => r.userId));
  const idsCohorte = new Set(resultados.map(r => r.userId));
  return {
    flujoCompletoYOrden: alertaA_FlujoCompletoYOrden(resultados),
    ordenSinFlujo: alertaB_OrdenSinFlujo(resultados),
    mayorCaidaPorPaso: alertaC_MayorCaidaPorPaso(lineas, idsCohorte, idsPrueba),
    segmentoConMasCaida: alertaD_SegmentoConMasCaida(resultados),
  };
}

// ── Reconstrucción de A/B/D desde filas ya persistidas (ruta de lectura) ────
// La Alerta C (caída por paso) NO se puede reconstruir desde brands_ttfo_
// marcas/caminos — esas tablas solo guardan el estado terminal por camino,
// no el detalle de los 11 pasos. Se calcula solo en el momento de la carga y
// se guarda como snapshot en brands_ttfo_importacion.resumen_pasos; la ruta
// de lectura debe leerla de ahí, no de esta función.

interface FilaMarcaDB {
  user_id: number;
  primera_orden: string | null;
  gatillo: Gatillo;
  segmento: Segmento | null;
  es_prueba: boolean;
}
interface FilaCaminoDB {
  user_id: number;
  camino: Camino;
  estado: EstadoCamino;
}

export function calcularAlertasDesdeMarcas(
  marcas: FilaMarcaDB[],
  caminosFilas: FilaCaminoDB[],
): Pick<Alertas, "flujoCompletoYOrden" | "ordenSinFlujo" | "segmentoConMasCaida"> {
  const caminosPorUsuario = new Map<number, FilaCaminoDB[]>();
  for (const c of caminosFilas) {
    caminosPorUsuario.set(c.user_id, [...(caminosPorUsuario.get(c.user_id) ?? []), c]);
  }
  // Mismo criterio que completoElFlujo() en el pipeline de carga: ⑧ es una
  // bifurcación (orden_manual O integraciones), no exige los 4 caminos.
  const completoElFlujoDe = (userId: number) => {
    const completados = new Set(
      (caminosPorUsuario.get(userId) ?? []).filter(c => c.estado === "Completed").map(c => c.camino),
    );
    return completados.has("bodega") && completados.has("producto")
      && (completados.has("orden_manual") || completados.has("integraciones"));
  };

  const flujoCompletoYOrden = marcas
    .filter(m => !m.es_prueba && m.primera_orden !== null && m.gatillo === "gatillo_cerrado" && completoElFlujoDe(m.user_id))
    .map(m => ({ userId: m.user_id, segmento: m.segmento }));

  const ordenSinFlujo = marcas
    .filter(m => !m.es_prueba && m.primera_orden !== null && !completoElFlujoDe(m.user_id))
    .map(m => ({ userId: m.user_id, segmento: m.segmento }));

  const porSegmento = (segmento: Segmento) => {
    const delSegmento = marcas.filter(m => !m.es_prueba && m.segmento === segmento);
    const avanzan = delSegmento.filter(m => (caminosPorUsuario.get(m.user_id) ?? []).length > 0).length;
    return { poblacion: delSegmento.length, avanzan, pct: delSegmento.length > 0 ? avanzan / delSegmento.length : 0 };
  };

  return {
    flujoCompletoYOrden,
    ordenSinFlujo,
    segmentoConMasCaida: { marca: porSegmento("marca"), proveedor: porSegmento("proveedor") },
  };
}
