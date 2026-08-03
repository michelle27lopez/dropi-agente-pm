import type {
  EstadoModalOTour, FilaEncuesta, FilaEvento, FilaModalOTour,
  LineaDeTiempoUsuario, SlotId,
} from "./tipos";
import { REGISTRO_SLOTS } from "./registroSlots";

// Arma la línea de tiempo por usuario a partir de los slots ya parseados.
//
// Regla crítica (aprendida corrigiendo el ejercicio manual del 28-jul): un
// archivo Tour/Modal con CERO filas para un usuario no significa "lo vio y
// lo descartó" — significa que el paso nunca se le disparó. Por eso cada
// slot tiene tres estados posibles, no dos:
//   - slot no subido este corte  → "sin_dato_este_corte" (dato desconocido)
//   - slot subido, sin fila      → "no_disparado" (señal real: nunca ocurrió)
//   - slot subido, con fila      → se deriva el estado real de la fila

/** Prioridad documentada en esquema_medicion_onboarding_brands.md §10.3. Reusado por caminos.ts. */
export function derivarEstadoModalOTour(fila: FilaModalOTour): EstadoModalOTour {
  if (fila.totalCompleted > 0) return "Completed";
  if (fila.totalDismissed > 0) return "Dismissed";
  if (fila.totalSeen > 0) return "Seen";
  return "no_disparado";
}

export interface SlotsParaCronologia {
  encuesta: FilaEncuesta[];
  /** Solo los slots realmente presentes en esta carga (los demás → sin_dato_este_corte). */
  modalOTour: Partial<Record<Exclude<SlotId, "encuesta">, FilaModalOTour[]>>;
  evento: Partial<Record<Exclude<SlotId, "encuesta">, FilaEvento[]>>;
}

export function construirLineaDeTiempo(datos: SlotsParaCronologia): Map<number, LineaDeTiempoUsuario> {
  const lineas = new Map<number, LineaDeTiempoUsuario>();

  const obtenerLinea = (userId: number): LineaDeTiempoUsuario => {
    let linea = lineas.get(userId);
    if (!linea) {
      linea = { userId, encuesta: null, pasos: {} };
      lineas.set(userId, linea);
    }
    return linea;
  };

  for (const fila of datos.encuesta) {
    obtenerLinea(fila.userId).encuesta = fila;
  }

  const pasosSlots = REGISTRO_SLOTS.filter(s => s.id !== "encuesta").map(s => s.id) as Exclude<SlotId, "encuesta">[];

  for (const slot of pasosSlots) {
    const filasModalOTour = datos.modalOTour[slot];
    const filasEvento = datos.evento[slot];
    const subidoEsteCorte = filasModalOTour !== undefined || filasEvento !== undefined;

    if (!subidoEsteCorte) {
      // No se marca nada explícito: la ausencia de la clave en `pasos` YA
      // representa "sin_dato_este_corte" para quien lea la línea de tiempo,
      // pero lo dejamos explícito para usuarios que sí tienen encuesta, para
      // que quede visible en el preview qué falta por usuario.
      continue;
    }

    if (filasModalOTour) {
      const usuariosConFila = new Set(filasModalOTour.map(f => f.userId));
      for (const fila of filasModalOTour) {
        obtenerLinea(fila.userId).pasos[slot] = fila;
      }
      // Usuarios de la encuesta que no tienen fila en este slot subido = no_disparado.
      for (const encuestado of datos.encuesta) {
        if (!usuariosConFila.has(encuestado.userId)) {
          obtenerLinea(encuestado.userId).pasos[slot] = "no_disparado";
        }
      }
    }

    if (filasEvento) {
      const usuariosConFila = new Set(filasEvento.map(f => f.userId));
      for (const fila of filasEvento) {
        obtenerLinea(fila.userId).pasos[slot] = fila;
      }
      for (const encuestado of datos.encuesta) {
        if (!usuariosConFila.has(encuestado.userId)) {
          obtenerLinea(encuestado.userId).pasos[slot] = "no_disparado";
        }
      }
    }
  }

  return lineas;
}
