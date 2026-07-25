// Cómo se arma el tablero del día. Lógica pura: no sabe de Supabase ni de
// archivos, así que se puede probar con datos de verdad sin levantar nada.
// El acceso a datos vive aparte, en datos.ts.

import { evaluarLote, type CandidataEntrada, type ResumenElegibilidad } from "./elegibilidad";
import type { Foto } from "./index";

export type ReglasPorTransportadora = Map<string, { min_paquetes: number }>;
export type FilaTablero = ResumenElegibilidad & {
  /** Todo lo que esa transportadora tiene hoy, elegible o no. */
  candidatas: number;
  guias_totales: number;
  min_paquetes: number;
};

/**
 * Arma el tablero: una fila por transportadora, con lo que hoy se le podría
 * pedir y lo que queda fuera (y por qué).
 *
 * Las bodegas de fulfillment propio se separan aparte: no se le piden a nadie,
 * las movemos nosotros. Mezclarlas haría que la transportadora reciba bodegas
 * que no le tocan.
 */
export function armarTablero(
  foto: Foto,
  reglas: ReglasPorTransportadora,
  minimoPorDefecto = 10,
): { filas: FilaTablero[]; dropi: { bodegas: number; paquetes: number } } {
  const porTransportadora = new Map<string, CandidataEntrada[]>();
  const dropi = { bodegas: 0, paquetes: 0 };

  for (const b of foto.bodegas) {
    if (b.fulfillment_by_dropi === true) {
      dropi.bodegas += 1;
      dropi.paquetes += b.total;
      continue;
    }
    // ?? [] a propósito: la carga viene de un archivo o de la base y una bodega
    // sin desglose no debe tumbar el tablero entero.
    for (const [t, prep, gg] of b.transportadoras ?? []) {
      if (!porTransportadora.has(t)) porTransportadora.set(t, []);
      porTransportadora.get(t)!.push({
        warehouse_id: b.warehouse_id,
        nombre: b.nombre,
        municipio: b.municipio,
        cod_dane: b.cod_dane,
        transportadora: t,
        paquetes: prep + gg,
        preparadas: prep,
        nivel_precision: b.nivel_precision,
        fulfillment_by_dropi: b.fulfillment_by_dropi,
        telefono: b.telefono ?? b.telefono_proveedor,
        antiguedad_max: b.antiguedad_max,
        ya_solicitada: false,
      });
    }
  }

  const filas: FilaTablero[] = [];
  for (const [transportadora, candidatas] of porTransportadora) {
    const min = reglas.get(transportadora)?.min_paquetes ?? minimoPorDefecto;
    const resumen = evaluarLote(candidatas, { min_paquetes: min }, transportadora);
    filas.push({
      ...resumen,
      candidatas: candidatas.length,
      guias_totales: candidatas.reduce((s, c) => s + c.paquetes, 0),
      min_paquetes: min,
    });
  }

  filas.sort((a, b) => b.guias_totales - a.guias_totales);
  return { filas, dropi };
}

