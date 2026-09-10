/**
 * SOBRE DEL FEATURE LOG — cómo se arma una fila de `marketplace_feature_log`.
 *
 * Ver hub/supabase/056_marketplace_feature_store.sql.
 *
 * La pieza crítica de este archivo es `hashCanonico`. De él depende el
 * Criterio 5 del DoD (idempotencia): si el script de Data o Dagster reintenta
 * un lote, el mismo contenido tiene que producir exactamente el mismo hash
 * para que la unique de la tabla lo absorba con ON CONFLICT DO NOTHING.
 *
 * Por eso el hash NO se calcula sobre `JSON.stringify(payload)` a secas: ese
 * resultado depende del orden en que se insertaron las claves, y el orden
 * cambia entre un CSV y otro. Serializamos con las claves ordenadas y sin los
 * `undefined`, de modo que {a:1,b:2} y {b:2,a:1} den el mismo hash.
 *
 * Esta función es también el contrato con el lado offline: DuckDB/R tienen que
 * poder recalcular el mismo hash sobre el mismo payload. Cualquier cambio acá
 * es un cambio de `contract_version`, no un refactor silencioso.
 */

import { createHash } from "crypto";

export const TIPOS_ENTIDAD = ["dropshipper", "supplier", "product"] as const;
export type TipoEntidad = (typeof TIPOS_ENTIDAD)[number];

export type EventoFeatureLog = {
  entity_id: string;
  entity_type: TipoEntidad;
  payload: Record<string, unknown>;
  event_timestamp: string;
  event_hash: string;
  source: string;
  contract_version: string;
};

/**
 * Serializa de forma determinista: claves ordenadas en todos los niveles y
 * sin propiedades `undefined`. Los arreglos conservan su orden (ahí el orden
 * sí es información).
 */
export function serializarCanonico(valor: unknown): string {
  if (valor === null || typeof valor !== "object") {
    return JSON.stringify(valor ?? null);
  }

  if (Array.isArray(valor)) {
    return `[${valor.map(serializarCanonico).join(",")}]`;
  }

  const entradas = Object.entries(valor as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${serializarCanonico(v)}`);

  return `{${entradas.join(",")}}`;
}

/** SHA-256 del payload canónico. Es la llave de deduplicación. */
export function hashCanonico(payload: unknown): string {
  return createHash("sha256").update(serializarCanonico(payload)).digest("hex");
}

/**
 * Arma la fila lista para insertar.
 *
 * `event_timestamp` sale de `corte_timestamp` cuando Data lo envía. Cuando no
 * viene, se usa `ingestadoEn` y se deja constancia en el propio payload
 * (`_timestamp_suplido: true`), porque un corte inventado que no se puede
 * distinguir de uno declarado es precisamente la fuga temporal que el feature
 * store existe para evitar. La marca queda dentro del payload hasheado a
 * propósito: así una fila suplida y una declarada nunca colisionan en la
 * unique aunque el resto del contenido sea idéntico.
 */
export function construirEventoFeatureLog(
  payload: Record<string, unknown>,
  opciones: {
    entityId: string;
    entityType: TipoEntidad;
    contractVersion: string;
    source?: string;
    corteTimestamp?: string;
    ingestadoEn?: Date;
  }
): EventoFeatureLog {
  const ingestadoEn = opciones.ingestadoEn ?? new Date();
  const timestampSuplido = !opciones.corteTimestamp;

  const eventTimestamp = timestampSuplido
    ? ingestadoEn.toISOString()
    : new Date(opciones.corteTimestamp as string).toISOString();

  const payloadFinal: Record<string, unknown> = timestampSuplido
    ? { ...payload, _timestamp_suplido: true }
    : { ...payload };

  return {
    entity_id: opciones.entityId,
    entity_type: opciones.entityType,
    payload: payloadFinal,
    event_timestamp: eventTimestamp,
    event_hash: hashCanonico(payloadFinal),
    source: opciones.source ?? "seller-success-webhook",
    contract_version: opciones.contractVersion,
  };
}
