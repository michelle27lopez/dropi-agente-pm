import type { FilaCruda, FilaEncuesta, FilaEvento, FilaModalOTour, Segmento, SlotId } from "./tipos";
import { detectarSlotPorNombre } from "./clasificarArchivo";
import { repararMojibake } from "./texto";

// Parser del export "Raw Data" de la automatización UserPilot → Google
// Sheets ("Plantilla"). A diferencia de los CSV agregados (parseo.ts), acá
// cada fila es UN evento atómico con el JSON completo del webhook en
// `Full Payload` — hay que agrupar por (userId, título) para reconstruir la
// misma forma que ya espera el resto del pipeline (SlotsParaCronologia).
//
// `corteDesde` filtra por fecha (formato ISO comparable) para no duplicar lo
// que ya viene de los CSV históricos — ver activacionHistorica.ts y la
// decisión de Kate (04-ago-2026) de empalmar en el corte de su última
// exportación manual (2026-08-03T17:20:00).

/**
 * Corte de empalme: última exportación manual de Kate antes de que la
 * automatización quedara lista (decisión 04-ago-2026). Todo lo del Raw Data
 * ANTERIOR a este momento ya está cubierto por los CSV históricos —
 * incluirlo de nuevo duplicaría población. Mover esta fecha el día que la
 * automatización reemplace por completo a las cargas manuales.
 */
export const CORTE_EMPALME_RAW_DATA = "2026-08-03T17:20:00";

export function esColumnasRawData(columnas: string[]): boolean {
  const set = new Set(columnas.map(c => c.trim().toLowerCase()));
  return set.has("timestamp") && set.has("event type") && set.has("full payload");
}

/** "3/8/2026, 5:16:20 p. m." → "2026-08-03T17:16:20" (día/mes, hora Colombia asumida). */
function normalizarTimestampRawData(valor: string): string | null {
  const m = valor.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2}):(\d{2})\s*(a\.?\s*m\.?|p\.?\s*m\.?)$/i);
  if (!m) return null;
  const [, dd, mm, yyyy, hh, min, sec, meridiano] = m;
  let hora = Number(hh);
  const esPM = /^p/i.test(meridiano);
  if (esPM && hora !== 12) hora += 12;
  if (!esPM && hora === 12) hora = 0;
  const pad = (n: number | string) => String(n).padStart(2, "0");
  return `${yyyy}-${pad(mm)}-${pad(dd)}T${pad(hora)}:${min}:${sec}`;
}

/**
 * "2026-08-03 22:50:43.000000" → "2026-08-03T17:50:43"
 *
 * Bug real encontrado con el caso de Kate (userId 964991, 04-ago-2026):
 * `user.signed_up`/`created_at` dentro del payload viene en UTC — a
 * diferencia de `Timestamp` (columna del webhook) y de TODOS los demás
 * timestamps de este pipeline (CSV de UserPilot), que ya vienen en hora
 * Colombia (ver parseo.ts normalizarFecha). Comprobado cruzando contra
 * `payload.timestamp` (epoch real, inequívoco) del primer evento del mismo
 * usuario: coinciden a los 17 segundos en UTC, no en hora Colombia. Sin este
 * ajuste, signedUp queda 5 horas adelantado y el evento de activación
 * (mismo día, hora Colombia real) parece haber ocurrido ANTES del registro
 * — de ahí el TTFO de -1 día.
 */
function normalizarSignedUpPayload(valor: string): string {
  const instanteUTC = new Date(`${valor.replace(" ", "T").split(".")[0]}Z`);
  const instanteColombia = new Date(instanteUTC.getTime() - 5 * 60 * 60 * 1000);
  return instanteColombia.toISOString().slice(0, 19);
}

interface RespuestaEncuesta {
  question: string;
  answer: string[];
}

function segmentoDeRespuesta(texto: string | null): Segmento | null {
  if (!texto) return null;
  if (/^marca\s*:/i.test(texto)) return "marca";
  if (/^proveedor\s*:/i.test(texto)) return "proveedor";
  return null;
}

/**
 * Combina dos filas de Encuesta del mismo usuario — usada tanto al deduplicar
 * dentro de un mismo archivo de Raw Data como al empalmar contra la base
 * guardada. Se queda con la fecha/identidad de la fila más reciente, PERO
 * nunca deja que `segmento`/`ventasMesDeclaradas` en null borren un valor ya
 * conocido de la fila más vieja.
 *
 * Bug real encontrado con Kate (userIds 964991 y 965744, 04-ago-2026): la
 * primera carga de Raw Data sacaba el segmento bien ("marca"); una carga
 * posterior del mismo usuario trajo una respuesta de encuesta más reciente
 * sin ese dato reconocible (re-respuesta, formato distinto, etc.) y — por
 * quedarse con "la más reciente" sin más — pisaba el valor bueno con null.
 * El dato de clasificación no debería desaparecer solo porque una carga
 * posterior no lo pudo volver a leer.
 */
function combinarFilaEncuesta(existente: FilaEncuesta | undefined, candidato: FilaEncuesta): FilaEncuesta {
  if (!existente) return candidato;
  const masReciente = candidato.submittedAt >= existente.submittedAt ? candidato : existente;
  const masVieja = masReciente === candidato ? existente : candidato;
  return {
    ...masReciente,
    segmento: masReciente.segmento ?? masVieja.segmento,
    ventasMesDeclaradas: masReciente.ventasMesDeclaradas ?? masVieja.ventasMesDeclaradas,
  };
}

export interface ResultadoRawData {
  encuesta: FilaEncuesta[];
  modalOTour: Partial<Record<Exclude<SlotId, "encuesta">, FilaModalOTour[]>>;
  evento: Partial<Record<Exclude<SlotId, "encuesta">, FilaEvento[]>>;
  filasIgnoradas: { sinFecha: number; deTest: number; sinSlot: number };
}

/** `corteDesde` vacío = sin filtro (usado por la carga incremental, que ya empalma contra una base guardada y tolera solape). */
export function parsearRawDataUserPilot(filas: FilaCruda[], corteDesde: string = ""): ResultadoRawData {
  const encuestaPorUsuario = new Map<number, FilaEncuesta>();
  const modalOTour = new Map<Exclude<SlotId, "encuesta">, Map<number, FilaModalOTour>>();
  const evento = new Map<Exclude<SlotId, "encuesta">, Map<number, FilaEvento>>();
  const filasIgnoradas = { sinFecha: 0, deTest: 0, sinSlot: 0 };

  for (const fila of filas) {
    const timestamp = normalizarTimestampRawData(String(fila["Timestamp"] ?? ""));
    if (!timestamp || timestamp < corteDesde) { filasIgnoradas.sinFecha += 1; continue; }

    let payload: { data?: Record<string, unknown>; is_test?: boolean };
    try {
      payload = JSON.parse(String(fila["Full Payload"] ?? ""));
    } catch {
      filasIgnoradas.sinFecha += 1;
      continue;
    }
    if (payload.is_test) { filasIgnoradas.deTest += 1; continue; }

    const data = payload.data as {
      type?: string; action?: string; title?: string;
      user?: { user_id?: string; email?: string; full_name?: string; signed_up?: string };
      answers?: RespuestaEncuesta[];
    } | undefined;
    const userIdCrudo = data?.user?.user_id;
    if (!data || !userIdCrudo) { filasIgnoradas.sinSlot += 1; continue; }
    const userId = Number(userIdCrudo);
    if (!Number.isFinite(userId)) { filasIgnoradas.sinSlot += 1; continue; }

    const tipo = data.type;
    const accion = data.action;
    const titulo = String(data.title ?? "");
    const signedUp = data.user?.signed_up ? normalizarSignedUpPayload(data.user.signed_up) : timestamp;

    if (tipo === "survey" && accion === "completed") {
      const respuestas = data.answers ?? [];
      const respuestaUso = respuestas.find(r => /c[oó]mo quieres usar dropi/i.test(r.question));
      const respuestaVolumen = respuestas.find(r => /mes/i.test(r.question) && /(pedidos|ventas)/i.test(r.question));
      const candidato: FilaEncuesta = {
        userId,
        nombre: repararMojibake(data.user?.full_name ?? ""),
        submittedAt: timestamp,
        signedUp,
        segmento: segmentoDeRespuesta(respuestaUso?.answer?.[0] ?? null),
        ventasMesDeclaradas: repararMojibake(respuestaVolumen?.answer?.[0] ?? null),
        email: data.user?.email ?? null,
      };
      encuestaPorUsuario.set(userId, combinarFilaEncuesta(encuestaPorUsuario.get(userId), candidato));
      continue;
    }

    if (tipo === "flow") {
      const slotDetectado = detectarSlotPorNombre(titulo, "modal_o_tour");
      if (!slotDetectado || slotDetectado === "encuesta") { filasIgnoradas.sinSlot += 1; continue; }
      const slot = slotDetectado;
      if (!modalOTour.has(slot)) modalOTour.set(slot, new Map());
      const mapa = modalOTour.get(slot)!;
      const actual = mapa.get(userId) ?? { userId, totalSeen: 0, totalDismissed: 0, totalCompleted: 0, lastCompleted: null, lastDismissed: null };
      if (accion === "seen") actual.totalSeen += 1;
      if (accion === "dismissed") {
        actual.totalDismissed += 1;
        if (!actual.lastDismissed || timestamp > actual.lastDismissed) actual.lastDismissed = timestamp;
      }
      if (accion === "completed") {
        actual.totalCompleted += 1;
        if (!actual.lastCompleted || timestamp > actual.lastCompleted) actual.lastCompleted = timestamp;
      }
      mapa.set(userId, actual);
      continue;
    }

    if (tipo === "labeled_event" && accion === "occurred") {
      const slotDetectado = detectarSlotPorNombre(titulo, "evento");
      if (!slotDetectado || slotDetectado === "encuesta") { filasIgnoradas.sinSlot += 1; continue; }
      const slot = slotDetectado;
      if (!evento.has(slot)) evento.set(slot, new Map());
      const mapa = evento.get(slot)!;
      const actual = mapa.get(userId) ?? { userId, totalOcurrencias: 0, firstOccurred: null, lastOccurred: null };
      actual.totalOcurrencias += 1;
      if (!actual.firstOccurred || timestamp < actual.firstOccurred) actual.firstOccurred = timestamp;
      if (!actual.lastOccurred || timestamp > actual.lastOccurred) actual.lastOccurred = timestamp;
      mapa.set(userId, actual);
      continue;
    }

    filasIgnoradas.sinSlot += 1;
  }

  const modalOTourArrays: ResultadoRawData["modalOTour"] = {};
  for (const [slot, mapa] of modalOTour) modalOTourArrays[slot] = [...mapa.values()];
  const eventoArrays: ResultadoRawData["evento"] = {};
  for (const [slot, mapa] of evento) eventoArrays[slot] = [...mapa.values()];

  return { encuesta: [...encuestaPorUsuario.values()], modalOTour: modalOTourArrays, evento: eventoArrays, filasIgnoradas };
}

/** Combina un slot de dos fuentes (CSV histórico + Raw Data post-corte) sin duplicar por userId. */
function combinarModalOTour(a: FilaModalOTour[] = [], b: FilaModalOTour[] = []): FilaModalOTour[] {
  const mapa = new Map<number, FilaModalOTour>();
  for (const fila of a) mapa.set(fila.userId, fila);
  for (const fila of b) {
    const existente = mapa.get(fila.userId);
    if (!existente) { mapa.set(fila.userId, fila); continue; }
    mapa.set(fila.userId, {
      userId: fila.userId,
      totalSeen: Math.max(existente.totalSeen, fila.totalSeen),
      totalDismissed: Math.max(existente.totalDismissed, fila.totalDismissed),
      totalCompleted: Math.max(existente.totalCompleted, fila.totalCompleted),
      lastCompleted: [existente.lastCompleted, fila.lastCompleted].filter(Boolean).sort().pop() ?? null,
      lastDismissed: [existente.lastDismissed, fila.lastDismissed].filter(Boolean).sort().pop() ?? null,
    });
  }
  return [...mapa.values()];
}

function combinarEvento(a: FilaEvento[] = [], b: FilaEvento[] = []): FilaEvento[] {
  const mapa = new Map<number, FilaEvento>();
  for (const fila of a) mapa.set(fila.userId, fila);
  for (const fila of b) {
    const existente = mapa.get(fila.userId);
    if (!existente) { mapa.set(fila.userId, fila); continue; }
    mapa.set(fila.userId, {
      userId: fila.userId,
      totalOcurrencias: Math.max(existente.totalOcurrencias, fila.totalOcurrencias),
      firstOccurred: [existente.firstOccurred, fila.firstOccurred].filter(Boolean).sort().shift() ?? null,
      lastOccurred: [existente.lastOccurred, fila.lastOccurred].filter(Boolean).sort().pop() ?? null,
    });
  }
  return [...mapa.values()];
}

export function empalmarConRawData(
  historico: { encuesta: FilaEncuesta[]; modalOTour: Record<string, FilaModalOTour[] | undefined>; evento: Record<string, FilaEvento[] | undefined> },
  rawData: ResultadoRawData,
): { encuesta: FilaEncuesta[]; modalOTour: Record<string, FilaModalOTour[]>; evento: Record<string, FilaEvento[]> } {
  const encuestaPorUsuario = new Map<number, FilaEncuesta>();
  for (const fila of historico.encuesta) encuestaPorUsuario.set(fila.userId, fila);
  for (const fila of rawData.encuesta) {
    encuestaPorUsuario.set(fila.userId, combinarFilaEncuesta(encuestaPorUsuario.get(fila.userId), fila));
  }

  const slots = new Set([...Object.keys(historico.modalOTour), ...Object.keys(rawData.modalOTour), ...Object.keys(historico.evento), ...Object.keys(rawData.evento)]);
  const modalOTour: Record<string, FilaModalOTour[]> = {};
  const evento: Record<string, FilaEvento[]> = {};
  for (const slot of slots) {
    const m = combinarModalOTour(historico.modalOTour[slot], (rawData.modalOTour as Record<string, FilaModalOTour[]>)[slot]);
    if (m.length) modalOTour[slot] = m;
    const e = combinarEvento(historico.evento[slot], (rawData.evento as Record<string, FilaEvento[]>)[slot]);
    if (e.length) evento[slot] = e;
  }

  return { encuesta: [...encuestaPorUsuario.values()], modalOTour, evento };
}
