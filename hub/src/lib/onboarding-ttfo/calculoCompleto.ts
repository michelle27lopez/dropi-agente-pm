import type { ExclusionManual } from "./pruebas";
import type { SlotsParaCronologia } from "./cronologia";
import { construirLineaDeTiempo } from "./cronologia";
import { calcularCohorte, CORTE_COHORTE } from "./cohorte";
import { calcularAlertas } from "./alertas";
import { calcularComparacionOnboarding } from "./activacionHistorica";

// Cálculo compartido entre las dos rutas de importación (CSV histórico y
// Raw Data incremental) — ambas terminan con las mismas fuentes ya
// combinadas (SlotsParaCronologia) y necesitan exactamente el mismo
// resultado (cohorte, alertas, comparación, resumen). Antes vivía duplicado
// dentro de /importar; separado acá para que las dos rutas no diverjan.

export type FuentesAcumuladas = SlotsParaCronologia;

export function calcularResultadoCompleto(
  fuentes: FuentesAcumuladas,
  exclusionesManuales: Map<number, ExclusionManual>,
  fechaCorte: string,
) {
  const lineas = construirLineaDeTiempo(fuentes);
  const resultados = calcularCohorte(lineas, fechaCorte, exclusionesManuales);
  const alertas = calcularAlertas(resultados, lineas);

  // Usa la Encuesta COMPLETA (sin filtrar al cohorte desde CORTE_COHORTE),
  // porque necesita también a los encuestados de antes del 28-jul, que
  // calcularCohorte descarta a propósito.
  const comparacionOnboarding = calcularComparacionOnboarding(
    fuentes.encuesta,
    fuentes.evento.evento_enviar_cliente ?? [],
    fuentes.modalOTour.modal_felicidades_orden_manual ?? [],
    exclusionesManuales,
    CORTE_COHORTE,
  );

  const resumen = {
    poblacion: resultados.length,
    activadas: resultados.filter(r => r.primeraOrden !== null).length,
    exito: resultados.filter(r => r.estadoMeta7d === "exito").length,
    fracaso: resultados.filter(r => r.estadoMeta7d === "fracaso").length,
    enObservacion: resultados.filter(r => r.estadoMeta7d === "en_observacion").length,
    cuentasDePrueba: resultados.filter(r => r.esPrueba).length,
  };

  // Casos a revisar a mano: el modal final se disparó sin fila directa en el
  // evento correspondiente (resuelto por la regla de paralelismo, pero no lo
  // escondemos — se marca como inferido).
  const inferidosPorParalelismo = resultados
    .filter(r => r.primeraOrden !== null && r.caminos.some(c => c.camino === "orden_manual"))
    .map(r => r.userId)
    .filter(userId => {
      const evento = lineas.get(userId)?.pasos.evento_enviar_cliente;
      return !(evento && typeof evento === "object" && "totalOcurrencias" in evento);
    });

  return { lineas, resultados, alertas, comparacionOnboarding, resumen, inferidosPorParalelismo };
}
