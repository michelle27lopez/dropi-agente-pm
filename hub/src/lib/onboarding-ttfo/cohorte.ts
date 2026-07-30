import type { EstadoMeta7d, Gatillo, LineaDeTiempoUsuario, ResultadoUsuario } from "./tipos";
import { derivarTodosLosCaminos, fechaEventoCamino } from "./caminos";
import { aplicarExclusiones, type ExclusionManual } from "./pruebas";

// Cohorte, activación y TTFO — el corazón del pipeline. Reglas confirmadas
// con Kate el 29-jul-2026:
//   - Cohorte ACUMULADO desde el 28-jul-2026 — NO el 10-jul del doc original.
//     El 28-jul fue la modificación DEFINITIVA del flujo de onboarding (el
//     mapeo Modal/Tour/Evento de este módulo corresponde a esa versión). Los
//     encuestados entre el 10 y el 27-jul venían de una versión anterior del
//     flujo — mezclarlos con este mapeo compararía flujos distintos.
//   - Sin fuente separada de órdenes reales todavía → primeraOrden es un
//     PROXY: la fecha del evento/modal final "Enviar al cliente" / "Felicidades
//     orden manual creada". Si más adelante existe un archivo real de
//     órdenes ("Base_Marcas"), primeraOrden debe leerse de ahí y esta función
//     deja de ser la fuente de verdad — dejar ese cambio documentado cuando
//     llegue el momento, no reemplazarlo en silencio.
//   - Se aplica la regla de validez temporal: un evento solo cuenta como
//     evidencia de causalidad si es anterior a primeraOrden.

export const CORTE_COHORTE = "2026-07-28"; // modificación definitiva del flujo de onboarding
export const META_DIAS = 7;

function diasEntre(desde: string, hasta: string): number {
  const ms = new Date(hasta).getTime() - new Date(desde).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** primeraOrden (proxy): fecha del par evento/modal final de orden_manual. */
export function calcularPrimeraOrdenProxy(linea: LineaDeTiempoUsuario): string | null {
  return fechaEventoCamino(linea, "orden_manual");
}

/**
 * Censura correcta (esquema_medicion_onboarding_brands.md §4.A): un éxito se
 * confirma de inmediato; un fracaso solo cuando la ventana de 7 días ya
 * cerró contra la fecha de corte de datos disponible; si no, "en observación".
 */
export function calcularEstadoMeta7d(
  signedUp: string | null,
  primeraOrden: string | null,
  fechaCorte: string,
): EstadoMeta7d {
  if (!signedUp) return "sin_signed_up";

  if (primeraOrden) {
    const dias = diasEntre(signedUp, primeraOrden);
    return dias <= META_DIAS ? "exito" : "fracaso";
  }

  const diasDesdeSignedUp = diasEntre(signedUp, fechaCorte);
  return diasDesdeSignedUp >= META_DIAS ? "fracaso" : "en_observacion";
}

/**
 * Gatillo de onboarding (regla cerrada del doc, §4.B), con la regla de
 * validez temporal de §6 aplicada como parte de la condición 3 (no como
 * chequeo aparte): el evento del camino completado debe ser anterior a
 * primeraOrden, y primeraOrden debe ser posterior a Submitted At.
 */
export function calcularGatillo(linea: LineaDeTiempoUsuario, primeraOrden: string | null): Gatillo {
  const submittedAt = linea.encuesta?.submittedAt ?? null;
  if (!primeraOrden || !submittedAt) return "sin_atribucion";

  const ordenPosteriorAEncuesta = primeraOrden > submittedAt;
  const caminosCompletados = derivarTodosLosCaminos(linea).filter(c => c.estado === "Completed");

  if (ordenPosteriorAEncuesta) {
    for (const c of caminosCompletados) {
      const fechaEvento = fechaEventoCamino(linea, c.camino);
      if (fechaEvento && fechaEvento < primeraOrden) return "gatillo_cerrado";
    }
  }

  return caminosCompletados.length > 0 ? "activacion_sin_atribucion_cerrada" : "sin_atribucion";
}

/**
 * Ensambla la fila final. Devuelve null si el usuario no pertenece al
 * cohorte: regla 1 de la metodología — sin fila de encuesta (o con
 * Submitted At anterior al lanzamiento), se trata como usuario ya existente
 * en la plataforma, no como alguien iniciando onboarding — no cuenta para el
 * análisis, aunque aparezca en algún archivo de evento tardío.
 */
export function calcularResultadoUsuario(
  linea: LineaDeTiempoUsuario,
  fechaCorte: string,
  exclusionesManuales: Map<number, ExclusionManual>,
): ResultadoUsuario | null {
  if (!linea.encuesta) return null;
  if (linea.encuesta.submittedAt < CORTE_COHORTE) return null;

  const primeraOrden = calcularPrimeraOrdenProxy(linea);
  const estadoMeta7d = calcularEstadoMeta7d(linea.encuesta.signedUp, primeraOrden, fechaCorte);
  const gatillo = calcularGatillo(linea, primeraOrden);
  const caminos = derivarTodosLosCaminos(linea);
  const { esPrueba, motivo } = aplicarExclusiones(linea.encuesta, exclusionesManuales);

  return {
    userId: linea.userId,
    submittedAt: linea.encuesta.submittedAt,
    signedUp: linea.encuesta.signedUp,
    ventasMesDeclaradas: linea.encuesta.ventasMesDeclaradas,
    segmento: linea.encuesta.segmento,
    esPrueba,
    motivoExclusion: motivo,
    primeraOrden,
    ttfoDias: primeraOrden ? diasEntre(linea.encuesta.signedUp, primeraOrden) : null,
    estadoMeta7d,
    gatillo,
    caminos: caminos.map(c => ({
      camino: c.camino, estado: c.estado,
      lastCompleted: c.lastCompleted, lastDismissed: c.lastDismissed,
    })),
    // Sin fuente separada de órdenes reales todavía (confirmado con Kate,
    // 29-jul-2026) — no se puede distinguir "entregó" de "activo sin
    // entrega" con solo las señales de UserPilot. Placeholder hasta que
    // exista ese archivo.
    ordenesCreadas: null,
    ordenesEntregadas: null,
    etapa: primeraOrden ? "activo_sin_entrega" : "no_activo",
  };
}

export function calcularCohorte(
  lineas: Map<number, LineaDeTiempoUsuario>,
  fechaCorte: string,
  exclusionesManuales: Map<number, ExclusionManual>,
): ResultadoUsuario[] {
  const resultados: ResultadoUsuario[] = [];
  for (const linea of lineas.values()) {
    const resultado = calcularResultadoUsuario(linea, fechaCorte, exclusionesManuales);
    if (resultado) resultados.push(resultado);
  }
  return resultados;
}
