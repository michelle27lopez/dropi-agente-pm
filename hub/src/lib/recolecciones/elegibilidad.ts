// Qué bodegas entran hoy en la solicitud de cada transportadora, y por qué.
//
// Principio: **ninguna regla borra, todas explican.** Cada bodega sale con su
// veredicto y su motivo, y el motivo se muestra en pantalla. El operador tiene
// que poder discutirle a la regla — si no puede ver por qué algo quedó fuera,
// va a dejar de confiar en la lista y a armarla por su cuenta en Excel, que es
// exactamente de donde estamos tratando de salir.

import type { Precision } from "./index";
import { esUbicacionReal } from "./index";

export type CandidataEntrada = {
  warehouse_id: string;
  nombre: string;
  municipio: string;
  cod_dane: string;
  transportadora: string;
  paquetes: number;                 // preparadas + guia_generada del día
  preparadas: number;
  nivel_precision: Precision | null;
  fulfillment_by_dropi: boolean | null;
  telefono: string | null;
  /** Antigüedad en días del lote más viejo. null = todavía no la tenemos. */
  antiguedad_max: number | null;
  /** Ya pedida hoy en otra solicitud. */
  ya_solicitada: boolean;
};

export type ReglasTransportadora = {
  min_paquetes: number;
  /** cod_dane → min_paquetes propio. Vacío = sin restricción de cobertura. */
  cobertura?: Map<string, number | null>;
};

export type Veredicto =
  | "elegible"
  | "excluida_fulfillment_dropi"
  | "excluida_sin_cobertura"
  | "excluida_bajo_minimo"
  | "excluida_ya_solicitada";

export type Candidata = CandidataEntrada & {
  veredicto: Veredicto;
  elegible: boolean;
  motivo: string;
  /** Se marca, NO excluye: entra al archivo con la dirección de texto. */
  ubicacion_confiable: boolean;
  prioridad: number;
};

/**
 * Evalúa una bodega contra las reglas de su transportadora.
 *
 * El orden importa: primero lo que hace que la solicitud sea *incorrecta*
 * (fulfillment propio, sin cobertura), después lo que la hace *ineficiente*
 * (bajo el mínimo). Así el motivo que se muestra es el más importante, no el
 * primero que casualmente se evaluó.
 */
export function evaluar(b: CandidataEntrada, reglas: ReglasTransportadora): Candidata {
  const ubicacion_confiable = esUbicacionReal(b.nivel_precision);
  const base = { ...b, ubicacion_confiable, prioridad: prioridad(b) };

  // Fulfillment propio: la carga la movemos nosotros. Pedírsela a la
  // transportadora es pedirle que vaya por algo que no le toca.
  if (b.fulfillment_by_dropi === true) {
    return { ...base, veredicto: "excluida_fulfillment_dropi", elegible: false,
      motivo: "Fulfillment by Dropi — la recolección es nuestra, no de la transportadora" };
  }

  if (b.ya_solicitada) {
    return { ...base, veredicto: "excluida_ya_solicitada", elegible: false,
      motivo: "Ya está en otra solicitud de hoy" };
  }

  // Cobertura: si hay lista cargada y el municipio no está, esa transportadora
  // no opera ahí. Si la lista está vacía todavía no sabemos, y no inventamos:
  // se deja pasar y el operador decide.
  const cobertura = reglas.cobertura;
  const tieneCobertura = cobertura && cobertura.size > 0;
  if (tieneCobertura && !cobertura!.has(b.cod_dane)) {
    return { ...base, veredicto: "excluida_sin_cobertura", elegible: false,
      motivo: `${b.transportadora} no tiene cobertura registrada en ${b.municipio}` };
  }

  const minimo = (tieneCobertura ? cobertura!.get(b.cod_dane) : null) ?? reglas.min_paquetes;
  if (b.paquetes < minimo) {
    return { ...base, veredicto: "excluida_bajo_minimo", elegible: false,
      motivo: `${b.paquetes} paquetes, por debajo del mínimo de ${minimo}` };
  }

  return { ...base, veredicto: "elegible", elegible: true,
    motivo: ubicacion_confiable
      ? `${b.paquetes} paquetes`
      : `${b.paquetes} paquetes · ubicación sin verificar, va con la dirección de texto` };
}

/**
 * Orden de la cola. La antigüedad manda cuando la tenemos —una bodega con carga
 * de hace dos semanas urge más que una con el doble de paquetes de esta mañana—
 * y mientras no llegue de Data, ordena el volumen.
 */
function prioridad(b: CandidataEntrada): number {
  const edad = b.antiguedad_max ?? 0;
  return b.paquetes * (1 + Math.min(edad, 30) / 5);
}

export type ResumenElegibilidad = {
  transportadora: string;
  elegibles: Candidata[];
  excluidas: Candidata[];
  paquetes_elegibles: number;
  /** Cuántas entran sin ubicación confiable: hay que verlo antes de mandar. */
  sin_ubicacion: number;
  por_motivo: Record<string, number>;
};

export function evaluarLote(
  bodegas: CandidataEntrada[],
  reglas: ReglasTransportadora,
  transportadora: string,
): ResumenElegibilidad {
  const evaluadas = bodegas.map(b => evaluar(b, reglas));
  const elegibles = evaluadas.filter(c => c.elegible).sort((a, b) => b.prioridad - a.prioridad);
  const excluidas = evaluadas.filter(c => !c.elegible).sort((a, b) => b.paquetes - a.paquetes);

  const por_motivo: Record<string, number> = {};
  for (const c of excluidas) por_motivo[c.veredicto] = (por_motivo[c.veredicto] ?? 0) + 1;

  return {
    transportadora,
    elegibles,
    excluidas,
    paquetes_elegibles: elegibles.reduce((s, c) => s + c.paquetes, 0),
    sin_ubicacion: elegibles.filter(c => !c.ubicacion_confiable).length,
    por_motivo,
  };
}

export const ETIQUETA_VEREDICTO: Record<Veredicto, string> = {
  elegible: "Elegible",
  excluida_fulfillment_dropi: "Recolección Dropi",
  excluida_sin_cobertura: "Sin cobertura",
  excluida_bajo_minimo: "Bajo el mínimo",
  excluida_ya_solicitada: "Ya solicitada",
};
