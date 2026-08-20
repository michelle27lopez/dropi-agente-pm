import type { ArchivoClasificado, FamiliaArchivo, FilaCruda, ResultadoClasificacion, SlotId } from "./tipos";
import { REGISTRO_SLOTS } from "./registroSlots";

// Clasifica un lote de archivos subidos contra el registro de slots — nunca
// al revés (nunca se fuerza un archivo a encajar). Un archivo que no calza
// ninguna firma de columnas conocida se reporta como "no reconocido" con sus
// columnas crudas, para que quien sube el archivo vea si es el equivocado.

function normalizarColumnas(filas: FilaCruda[]): string[] {
  if (filas.length === 0) return [];
  return Object.keys(filas[0]).map(c => c.trim());
}

/** Firma de columnas → familia. Ver esquema_medicion_onboarding_brands.md §10.2. */
export function detectarFamiliaPorColumnas(columnas: string[]): FamiliaArchivo | null {
  const set = new Set(columnas.map(c => c.toLowerCase()));
  const tiene = (nombre: string) => set.has(nombre.toLowerCase());

  if (tiene("Submitted At") && columnas.some(c => /^\d+\./.test(c))) return "encuesta";
  if (tiene("Total Seen") && tiene("Total Dismissed") && tiene("Total Completed")) return "modal_o_tour";
  if (tiene("Total Occurrences") && tiene("First Occurred")) return "evento";
  return null;
}

const RANGO_DIACRITICOS = new RegExp("[\\u0300-\\u036f]", "g");

function normalizarNombre(nombre: string): string {
  return nombre
    .normalize("NFD").replace(RANGO_DIACRITICOS, "") // quita tildes
    .toLowerCase()
    .trim();
}

export function detectarSlotPorNombre(nombreArchivo: string, familia: FamiliaArchivo): SlotId | null {
  const nombre = normalizarNombre(nombreArchivo);
  const candidatos = REGISTRO_SLOTS.filter(s => s.familiaEsperada === familia);
  for (const slot of candidatos) {
    if (slot.patronesNombre.some(patron => patron.test(nombre))) return slot.id;
  }
  return null;
}

/**
 * Huella de timestamps de un archivo — para detectar el mismo export subido
 * dos veces (huella idéntica) vs. un conflicto real (huella distinta pero
 * mismo slot). Se usa el campo de fecha más específico disponible por fila,
 * ordenado, para que el orden de filas no cambie la huella.
 */
export function calcularHuella(filas: FilaCruda[]): string {
  const campoFecha = ["Last Completed", "Last Occurred", "Last Dismissed", "Submitted At"]
    .find(c => filas[0] && c in filas[0]);
  if (!campoFecha) return `sin-fecha:${filas.length}`;
  const valores = filas.map(f => String(f[campoFecha] ?? "")).sort();
  return `${campoFecha}:${valores.join("|")}`;
}

export interface ArchivoEntrada {
  nombreArchivo: string;
  filas: FilaCruda[];
}

export function clasificarLote(archivos: ArchivoEntrada[]): ResultadoClasificacion {
  const mapeados: ArchivoClasificado[] = [];
  const noReconocidos: ArchivoClasificado[] = [];
  const porSlot = new Map<SlotId, ArchivoClasificado[]>();

  for (const archivo of archivos) {
    const columnas = normalizarColumnas(archivo.filas);
    const familia = detectarFamiliaPorColumnas(columnas);

    if (!familia) {
      noReconocidos.push({
        nombreArchivo: archivo.nombreArchivo,
        slot: null,
        familiaDetectada: null,
        filas: archivo.filas.length,
        columnasCrudas: columnas,
      });
      continue;
    }

    const slot = familia === "encuesta" ? "encuesta" : detectarSlotPorNombre(archivo.nombreArchivo, familia);
    if (!slot) {
      noReconocidos.push({
        nombreArchivo: archivo.nombreArchivo,
        slot: null,
        familiaDetectada: familia,
        filas: archivo.filas.length,
        columnasCrudas: columnas,
      });
      continue;
    }

    const clasificado: ArchivoClasificado = {
      nombreArchivo: archivo.nombreArchivo,
      slot,
      familiaDetectada: familia,
      filas: archivo.filas.length,
      huella: calcularHuella(archivo.filas),
    };
    mapeados.push(clasificado);
    porSlot.set(slot, [...(porSlot.get(slot) ?? []), clasificado]);
  }

  const duplicados: ResultadoClasificacion["duplicados"] = [];
  const conflictos: ResultadoClasificacion["conflictos"] = [];
  for (const [slot, lista] of porSlot) {
    if (lista.length < 2) continue;
    const huellas = new Set(lista.map(a => a.huella));
    if (huellas.size === 1) {
      duplicados.push({ slot, archivos: lista.map(a => a.nombreArchivo) });
    } else {
      conflictos.push({ slot, archivos: lista.map(a => a.nombreArchivo) });
    }
  }

  const slotsPresentes = new Set(mapeados.map(a => a.slot));
  const faltantes = REGISTRO_SLOTS.map(s => s.id).filter(id => !slotsPresentes.has(id));

  return { mapeados, noReconocidos, duplicados, conflictos, faltantes };
}
