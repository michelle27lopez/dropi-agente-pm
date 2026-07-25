// Lógica compartida del módulo de Control de Recolecciones.
//
// Es la misma que tenía el pipeline local (`build.js`), traída acá para que el
// servidor y el script usen UNA sola definición de cómo se agrega el export y
// cómo se ubica una bodega. Dos implementaciones de "qué tan confiable es esta
// coordenada" es exactamente la clase de deuda que este módulo no puede darse.
//
// Los centroides DANE viven versionados (`centroides.json`): son dato público,
// no data interna de Dropi, y el servidor los necesita en producción.

import centroides from "./centroides.json";

// El JSON tipa las coordenadas como number[]; acá se fijan como par [lat, lng].
const { MUN, DEP } = centroides as unknown as {
  MUN: Record<string, [number, number]>;
  DEP: Record<string, [number, number]>;
};

// ── Precisión de la ubicación ──────────────────────────────────────────────
// Ordenada de mejor a peor. Nunca se infiere ni se rellena: si no se pudo
// resolver, queda en centroide y se declara como tal. Un centroide no se
// muestra jamás como si fuera la puerta de la bodega.
export const PRECISION = [
  "manual_verificada",
  "predio",
  "via",
  "barrio",
  "centroide_municipio",
  "centroide_depto",
  "sin_ubicar",
] as const;
export type Precision = (typeof PRECISION)[number];

/** Una ubicación es "real" solo si salió de geocodificar o de verificar a mano. */
export const esUbicacionReal = (p?: string | null) =>
  p === "manual_verificada" || p === "predio" || p === "via" || p === "barrio";

// El JSON que consume el mapa usa etiquetas cortas por peso del archivo.
export const A_ETIQUETA_MAPA: Record<Precision, string> = {
  manual_verificada: "geo_manual",
  predio: "geo_alta",
  via: "geo",
  barrio: "geo_baja",
  centroide_municipio: "municipio",
  centroide_depto: "depto",
  sin_ubicar: "sin_ubicar",
};

// ── Export de Chronos ──────────────────────────────────────────────────────

export type FilaExport = {
  warehouse_id: string | number;
  bodega?: string;
  address?: string;
  municipio?: string;
  dpto?: string;
  cod_dane?: string | number;
  transportadora?: string;
  preparadas?: number | string;
  guia_generada?: number | string;
  ultimo_evento?: string;
};

export const COLUMNAS_REQUERIDAS = [
  "warehouse_id",
  "transportadora",
  "preparadas",
  "guia_generada",
] as const;

export type BodegaAgregada = {
  warehouse_id: string;
  nombre: string;
  direccion: string;
  municipio: string;
  dpto: string;
  cod_dane: string;
  dep: string;
  preparadas: number;
  guia_generada: number;
  total: number;
  transportadoras: Array<[string, number, number]>;
  ultimo_evento: string;
};

const num = (v: unknown) => Number(v) || 0;

/**
 * Valida que el archivo subido sea de verdad el export esperado.
 * Se corre ANTES de tocar la base: un archivo equivocado no debe pisar
 * data buena solo porque alguien se confundió de descarga.
 */
export function validarColumnas(filas: FilaExport[]): string | null {
  if (!filas.length) return "El archivo está vacío.";
  const presentes = new Set(Object.keys(filas[0]));
  const faltan = COLUMNAS_REQUERIDAS.filter(c => !presentes.has(c));
  if (faltan.length) {
    return `Faltan columnas: ${faltan.join(", ")}. ` +
      `¿Es el export de bodega × transportadora? Columnas encontradas: ${[...presentes].join(", ")}`;
  }
  return null;
}

/** Agrega el export (grano bodega × transportadora) a una fila por bodega. */
export function agruparPorBodega(filas: FilaExport[]): BodegaAgregada[] {
  const mapa = new Map<string, BodegaAgregada>();

  for (const f of filas) {
    const id = String(f.warehouse_id ?? "").trim();
    if (!id) continue;

    const dane8 = String(f.cod_dane ?? "").padStart(8, "0");
    let b = mapa.get(id);
    if (!b) {
      b = {
        warehouse_id: id,
        nombre: f.bodega || "(sin nombre)",
        direccion: f.address || "",
        municipio: f.municipio || "",
        dpto: f.dpto || "",
        cod_dane: dane8.slice(0, 5),
        dep: dane8.slice(0, 2),
        preparadas: 0, guia_generada: 0, total: 0,
        transportadoras: [],
        ultimo_evento: "",
      };
      mapa.set(id, b);
    }

    const p = num(f.preparadas), g = num(f.guia_generada);
    b.preparadas += p;
    b.guia_generada += g;
    b.total += p + g;
    b.transportadoras.push([f.transportadora || "(sin transportadora)", p, g]);

    const ev = String(f.ultimo_evento ?? "");
    if (ev > b.ultimo_evento) b.ultimo_evento = ev;
  }

  for (const b of mapa.values()) {
    b.transportadoras.sort((x, y) => (y[1] + y[2]) - (x[1] + x[2]));
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total);
}

// ── Cascada de ubicación ───────────────────────────────────────────────────

export type CoordCache = {
  lat: number; lng: number;
  nivel_precision: Precision;
  fuente?: string | null;
  direccion_geocodificada?: string | null;
};

const normalizar = (s?: string | null) =>
  String(s ?? "").toUpperCase().replace(/\s+/g, " ").trim();

/**
 * Ubica una bodega: coordenada del cache si la dirección NO cambió, si no
 * centroide del municipio, si no del departamento.
 *
 * La comparación de dirección es la clave: una coordenada solo vale para la
 * dirección con la que se resolvió. Si el export trae otra, la coord anterior
 * ya no corresponde y la bodega vuelve a la cola de geocodificación.
 */
export function ubicar(
  bodega: Pick<BodegaAgregada, "direccion" | "cod_dane" | "dep">,
  cache?: CoordCache | null,
): { lat: number | null; lng: number | null; nivel_precision: Precision; fuente: string } {
  if (cache && esUbicacionReal(cache.nivel_precision) &&
      normalizar(cache.direccion_geocodificada) === normalizar(bodega.direccion)) {
    return {
      lat: cache.lat, lng: cache.lng,
      nivel_precision: cache.nivel_precision,
      fuente: cache.fuente || "cache",
    };
  }

  const mun = MUN[bodega.cod_dane];
  if (mun) return { lat: mun[0], lng: mun[1], nivel_precision: "centroide_municipio", fuente: "centroide" };

  const dep = DEP[bodega.dep];
  if (dep) return { lat: dep[0], lng: dep[1], nivel_precision: "centroide_depto", fuente: "centroide" };

  return { lat: null, lng: null, nivel_precision: "sin_ubicar", fuente: "ninguna" };
}

// ── Resumen para el preview de la importación ──────────────────────────────────

export type ResumenExport = {
  filas: number;
  bodegas: number;
  guias: number;
  preparadas: number;
  guia_generada: number;
  evento_min: string | null;
  evento_max: string | null;
  transportadoras: Array<{ nombre: string; guias: number; bodegas: number }>;
};

export function resumir(filas: FilaExport[], bodegas: BodegaAgregada[]): ResumenExport {
  const eventos = filas.map(f => String(f.ultimo_evento ?? "")).filter(Boolean).sort();
  const porTransportadora = new Map<string, { guias: number; bodegas: number }>();

  for (const b of bodegas) {
    for (const [nombre, p, g] of b.transportadoras) {
      const acc = porTransportadora.get(nombre) ?? { guias: 0, bodegas: 0 };
      acc.guias += p + g;
      acc.bodegas += 1;
      porTransportadora.set(nombre, acc);
    }
  }

  return {
    filas: filas.length,
    bodegas: bodegas.length,
    guias: bodegas.reduce((s, b) => s + b.total, 0),
    preparadas: bodegas.reduce((s, b) => s + b.preparadas, 0),
    guia_generada: bodegas.reduce((s, b) => s + b.guia_generada, 0),
    evento_min: eventos[0] ?? null,
    evento_max: eventos[eventos.length - 1] ?? null,
    transportadoras: [...porTransportadora.entries()]
      .map(([nombre, v]) => ({ nombre, ...v }))
      .sort((a, b) => b.guias - a.guias),
  };
}

/** La fecha de la carga sale del dato, no del reloj del servidor. */
export function fechaDelExport(resumen: ResumenExport): string {
  return (resumen.evento_max ?? new Date().toISOString()).slice(0, 10);
}
