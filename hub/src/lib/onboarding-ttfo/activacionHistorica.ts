import type { FilaEncuesta, FilaEvento, FilaModalOTour, Segmento } from "./tipos";
import { aplicarExclusiones, type ExclusionManual } from "./pruebas";

// Comparación TTFO: con onboarding guiado vs. sin él — la pregunta central
// del proyecto TTFO-001. ¿El onboarding guiado (vigente desde el 28-jul-2026)
// realmente baja los días hasta la primera orden, comparado con quienes se
// activaron antes de que existiera ese flujo? Se parte de la MISMA Encuesta
// histórica (desde marzo o la fecha que traiga el archivo) — el corte que
// separa los dos grupos es `Submitted At`, no una carga aparte. Se muestra
// como sección de referencia en el dashboard principal
// (/proyectos/onboarding-ttfo), alimentada por la misma carga de ahí — no es
// una página ni un upload separado.
//
// Cada grupo (con/sin onboarding) trae además su propio desglose Marca vs.
// Proveedor — nunca se reporta un solo número agregado que los mezcle.

function diasEntreFechas(desde: string, hasta: string): number {
  const ms = new Date(hasta).getTime() - new Date(desde).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function mediana(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const ordenado = [...valores].sort((a, b) => a - b);
  const medio = Math.floor(ordenado.length / 2);
  return ordenado.length % 2 !== 0
    ? ordenado[medio]
    : (ordenado[medio - 1] + ordenado[medio]) / 2;
}

function promedio(valores: number[]): number | null {
  if (valores.length === 0) return null;
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

export interface ResumenTTFO {
  poblacion: number;
  activados: number;
  pctActivados: number;
  ttfoMedianaDias: number | null;
  ttfoPromedioDias: number | null;
  ttfoDias: number[]; // valores individuales, por si se quiere graficar la distribución
}

export interface ResumenGrupoOnboarding extends ResumenTTFO {
  marca: ResumenTTFO;
  proveedor: ResumenTTFO;
}

export interface ComparacionOnboarding {
  corteOnboarding: string; // fecha desde la que se considera "con onboarding"
  desdeFecha: string; // piso del grupo "sin onboarding" — no todo el histórico de la Encuesta
  conOnboarding: ResumenGrupoOnboarding;
  sinOnboarding: ResumenGrupoOnboarding;
  cuentasDePrueba: number;
}

/**
 * Fecha de activación (proxy) de un usuario — MISMA regla de paralelismo que
 * `fechaEventoCamino` en caminos.ts (corrección 30-jul-2026, a pedido de
 * Kate: este módulo tenía su propia variante — tomaba el mínimo entre evento
 * y modal cuando ambos existían — que podía divergir de la pizarra
 * principal). Prioridad: el evento "Enviar al cliente" manda si existe; el
 * modal "Felicidades orden manual creada" solo se usa como respaldo cuando
 * NO hay fila directa del evento, porque ese modal solo puede dispararse si
 * el evento ya ocurrió (su sola presencia es prueba del evento, aunque falte
 * la fila propia — típicamente un hueco de exportación de UserPilot).
 */
function fechaActivacionDe(
  userId: number,
  eventosPorUsuario: Map<number, FilaEvento>,
  modalesPorUsuario: Map<number, FilaModalOTour>,
): string | null {
  const evento = eventosPorUsuario.get(userId);
  if (evento && evento.totalOcurrencias > 0 && evento.firstOccurred) return evento.firstOccurred;

  const modal = modalesPorUsuario.get(userId);
  if (modal && modal.totalCompleted > 0 && modal.lastCompleted) return modal.lastCompleted;

  return null;
}

function resumenTTFO(
  filas: FilaEncuesta[],
  eventosPorUsuario: Map<number, FilaEvento>,
  modalesPorUsuario: Map<number, FilaModalOTour>,
): ResumenTTFO {
  const ttfoDias: number[] = [];
  let activados = 0;
  for (const fila of filas) {
    const fechaActivacion = fechaActivacionDe(fila.userId, eventosPorUsuario, modalesPorUsuario);
    if (!fechaActivacion) continue;
    activados += 1;
    ttfoDias.push(diasEntreFechas(fila.signedUp, fechaActivacion));
  }
  return {
    poblacion: filas.length,
    activados,
    pctActivados: filas.length > 0 ? activados / filas.length : 0,
    ttfoMedianaDias: mediana(ttfoDias),
    ttfoPromedioDias: promedio(ttfoDias),
    ttfoDias,
  };
}

function resumenGrupoConSegmentos(
  filas: FilaEncuesta[],
  eventosPorUsuario: Map<number, FilaEvento>,
  modalesPorUsuario: Map<number, FilaModalOTour>,
): ResumenGrupoOnboarding {
  const porSegmento = (segmento: Segmento) =>
    resumenTTFO(filas.filter(f => f.segmento === segmento), eventosPorUsuario, modalesPorUsuario);

  return {
    ...resumenTTFO(filas, eventosPorUsuario, modalesPorUsuario),
    marca: porSegmento("marca"),
    proveedor: porSegmento("proveedor"),
  };
}

/**
 * Piso del grupo "sin onboarding" — a pedido de Kate (30-jul-2026), para no
 * arrastrar todo el histórico de la Encuesta (podía traer usuarios de hace
 * más de un año, sin relación real con el flujo que se está comparando).
 * Corrección de Kate (30-jul-2026): la Encuesta arrancó el 17-mar-2026 — no
 * el 1-mar. Usar la fecha exacta de lanzamiento, no una aproximación de
 * inicio de mes, para no dejar (ni parecer que se deja) una ventana abierta
 * a filas previas al lanzamiento real.
 */
export const INICIO_SIN_ONBOARDING = "2026-03-17";

export function calcularComparacionOnboarding(
  encuesta: FilaEncuesta[],
  eventosCrearOrden: FilaEvento[],
  modalesFelicidadesOrdenManual: FilaModalOTour[],
  exclusionesManuales: Map<number, ExclusionManual>,
  corteOnboarding: string,
  desdeFecha: string = INICIO_SIN_ONBOARDING,
): ComparacionOnboarding {
  const eventosPorUsuario = new Map(eventosCrearOrden.map(e => [e.userId, e]));
  const modalesPorUsuario = new Map(modalesFelicidadesOrdenManual.map(m => [m.userId, m]));

  let cuentasDePrueba = 0;
  const encuestaValida = encuesta.filter(e => {
    const { esPrueba } = aplicarExclusiones(e, exclusionesManuales);
    if (esPrueba) cuentasDePrueba += 1;
    return !esPrueba;
  });

  const conOnboarding = encuestaValida.filter(e => e.submittedAt >= corteOnboarding);
  const sinOnboarding = encuestaValida.filter(e => e.submittedAt >= desdeFecha && e.submittedAt < corteOnboarding);

  return {
    corteOnboarding,
    desdeFecha,
    conOnboarding: resumenGrupoConSegmentos(conOnboarding, eventosPorUsuario, modalesPorUsuario),
    sinOnboarding: resumenGrupoConSegmentos(sinOnboarding, eventosPorUsuario, modalesPorUsuario),
    cuentasDePrueba,
  };
}
