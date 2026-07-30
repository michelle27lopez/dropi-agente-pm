// Tipos compartidos del pipeline de Onboarding TTFO.
//
// Modelo confirmado con Kate (Cell Board 29-jul-2026), sobre esquema_medicion_
// onboarding_brands.md (16-jul-2026) + la sesión de refinamiento del 28/29-jul:
//   - Cohorte ACUMULADO desde el lanzamiento (10-jul), no cortes de un día.
//   - No existe todavía una fuente separada de órdenes reales ("Base_Marcas") —
//     se usa el evento/modal "Enviar al cliente" de UserPilot como proxy de
//     "creó su primera orden". Si esa fuente aparece más adelante, primeraOrden
//     debe empezar a leerse de ahí en vez de este proxy — ver cohorte.ts.
//   - Camino "integraciones" se mapeó el 29-jul-2026 (bifurcación desde ⑧
//     "Felicidades producto creado", que tiene 2 botones: uno a orden_manual
//     ya mapeado, otro a integraciones) — todavía sin archivos reales para
//     validar, así que su regla de paralelismo evento↔modal es una
//     extensión por analogía con orden_manual, no confirmada con datos.

export type Segmento = "marca" | "proveedor";

/** Familia detectada por firma de columnas, antes de saber el slot exacto. */
export type FamiliaArchivo = "encuesta" | "modal_o_tour" | "evento";

/** Tres categorías reales del flujo (más finas que el modelo original de 2). */
export type TipoPaso = "modal" | "tour" | "evento";

export type Camino = "bodega" | "producto" | "orden_manual" | "integraciones";

/** Estado terminal por camino, tal como lo espera brands_ttfo_caminos. */
export type EstadoCamino = "Completed" | "Dismissed";

export type EstadoMeta7d = "exito" | "fracaso" | "en_observacion" | "sin_signed_up";
export type Gatillo = "gatillo_cerrado" | "activacion_sin_atribucion_cerrada" | "sin_atribucion";
export type Etapa = "entrego" | "activo_sin_entrega" | "no_activo";

/**
 * Los 15 "slots" esperados: Encuesta + 14 pasos del tour guiado (bodega,
 * producto y orden_manual con Modal+Tour+Evento cada uno, más el video de
 * bienvenida, más integraciones con Tour+Evento+Modal — sin modal de
 * "creación" propia, se dispara desde un botón dentro de ⑧).
 */
export type SlotId =
  | "encuesta"
  | "video_bienvenida"
  | "modal_crea_bodega"
  | "tour_bodegas"
  | "evento_guardar_bodega"
  | "modal_sube_producto"
  | "tour_productos"
  | "evento_guardar_producto"
  | "modal_felicidades_producto"
  | "tour_orden_manual"
  | "evento_enviar_cliente"
  | "modal_felicidades_orden_manual"
  | "tour_integraciones"
  | "evento_crear_integraciones"
  | "modal_felicidades_integracion";

/**
 * Estado de un usuario frente a un slot Modal/Tour — tres casos, no dos.
 * "no_disparado" (archivo presente, usuario sin fila) es un dato real: el
 * paso nunca se le mostró. Nunca se confunde con "lo vio y lo descartó".
 */
export type EstadoModalOTour = "Completed" | "Dismissed" | "Seen" | "no_disparado";

export interface FilaCruda {
  [columna: string]: unknown;
}

export interface ArchivoClasificado {
  nombreArchivo: string;
  slot: SlotId | null;
  familiaDetectada: FamiliaArchivo | null;
  filas: number;
  /** Solo para no reconocidos: columnas crudas encontradas, para diagnóstico. */
  columnasCrudas?: string[];
  /** Huella de timestamps, usada para detectar el mismo export subido 2 veces. */
  huella?: string;
}

export interface ResultadoClasificacion {
  mapeados: ArchivoClasificado[];
  noReconocidos: ArchivoClasificado[];
  duplicados: { slot: SlotId; archivos: string[] }[];
  conflictos: { slot: SlotId; archivos: string[] }[];
  faltantes: SlotId[];
}

/** Fila parseada de un slot tipo Modal o Tour (shown/dismissed/completed). */
export interface FilaModalOTour {
  userId: number;
  totalSeen: number;
  totalDismissed: number;
  totalCompleted: number;
  lastCompleted: string | null;
  lastDismissed: string | null;
}

/** Fila parseada de un slot tipo Evento (occurrence-based). */
export interface FilaEvento {
  userId: number;
  totalOcurrencias: number;
  firstOccurred: string | null;
  lastOccurred: string | null;
}

/** Fila parseada de la Encuesta — una por usuario, ya deduplicada. */
export interface FilaEncuesta {
  userId: number;
  nombre: string;
  submittedAt: string;
  signedUp: string;
  segmento: Segmento | null;
  ventasMesDeclaradas: string | null;
  email: string | null;
}

/**
 * Línea de tiempo completa de un usuario, un slot por clave.
 *
 * Se guarda la fila completa (no solo el estado derivado) para no perder
 * lastCompleted/lastDismissed/firstOccurred — necesarios para la regla de
 * paralelismo evento↔modal y para la validez temporal contra primeraOrden.
 * La ausencia de una clave en `pasos` significa "sin_dato_este_corte" (el
 * archivo de ese slot no se subió en esta carga) — distinto de
 * "no_disparado" (el archivo sí se subió, pero el usuario no tiene fila).
 */
export interface LineaDeTiempoUsuario {
  userId: number;
  encuesta: FilaEncuesta | null;
  pasos: Partial<Record<Exclude<SlotId, "encuesta">, FilaModalOTour | FilaEvento | "no_disparado">>;
}

/** Fila final, con la forma que espera brands_ttfo_marcas. */
export interface ResultadoUsuario {
  userId: number;
  submittedAt: string;
  signedUp: string;
  ventasMesDeclaradas: string | null;
  segmento: Segmento | null;
  esPrueba: boolean;
  motivoExclusion: string | null;
  primeraOrden: string | null;
  ttfoDias: number | null;
  estadoMeta7d: EstadoMeta7d;
  gatillo: Gatillo;
  caminos: { camino: Camino; estado: EstadoCamino; lastCompleted: string | null; lastDismissed: string | null }[];
  ordenesCreadas: number | null;
  ordenesEntregadas: number | null;
  etapa: Etapa;
}

export interface Alertas {
  /** A: consumió el flujo entero Y creó la orden. */
  flujoCompletoYOrden: { userId: number; segmento: Segmento | null }[];
  /** B: disparó el evento de crear orden sin consumir el flujo, dentro del cohorte. */
  ordenSinFlujo: { userId: number; segmento: Segmento | null }[];
  /** C: caída por paso — absoluta y relativa contra el paso anterior. */
  mayorCaidaPorPaso: { slot: SlotId; poblacion: number; caidaAbsoluta: number; caidaRelativa: number }[];
  /** D: comparación Marca vs Proveedor — siempre los dos números, nunca uno solo. */
  segmentoConMasCaida: { marca: { poblacion: number; avanzan: number; pct: number }; proveedor: { poblacion: number; avanzan: number; pct: number } };
}
