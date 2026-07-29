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

  // ── Desde el export del 28-jul ─────────────────────────────────────────
  // Antigüedad medida sobre `created_at` de la orden, que NO se refresca.
  // Esta es la diferencia que resolvió la duda del módulo: con `updated_at`
  // el 95,7% de las guías parecía de las últimas 24 h; con `created_at` se ve
  // que el 93,3% lleva más de un día parado. Las dos cosas eran ciertas —
  // `updated_at` se refresca solo, y eso estaba escondiendo stock real.
  edad_0_1d?: number | string;
  edad_2_3d?: number | string;
  edad_4_7d?: number | string;
  edad_8_15d?: number | string;
  edad_15d_mas?: number | string;

  // Quién es y a quién se le llama. Un proveedor puede tener varias bodegas
  // con teléfonos distintos: por eso llegan los dos y no uno solo.
  supplier_id?: string | number;
  supplier_nombre?: string;
  telefono_bodega?: string;
  telefono_proveedor?: string;

  fulfillment_by_dropi?: boolean | string | number;
  bodega_creada_at?: string;
};

/** Las cinco cubetas de antigüedad, sumadas. */
export type Edades = {
  edad_0_1d: number;
  edad_2_3d: number;
  edad_4_7d: number;
  edad_8_15d: number;
  edad_15d_mas: number;
};

export const EDADES_CERO: Edades = {
  edad_0_1d: 0, edad_2_3d: 0, edad_4_7d: 0, edad_8_15d: 0, edad_15d_mas: 0,
};

/**
 * Días representativos de la cubeta más vieja que tenga guías.
 *
 * Devuelve el piso de cada rango, no el techo: si hay guías en 8–15 días, son
 * "al menos 8 días". Redondear para arriba sería afirmar algo que el dato no
 * dice — el export trae cubetas, no la fecha de cada guía.
 *
 * `null` cuando no hay ninguna guía: distinto de 0, que significaría "todas
 * son de hoy". Esa diferencia importa porque `elegibilidad.ts` la usa para
 * decidir, y un 0 inventado haría pasar por fresca una bodega sin dato.
 */
export function antiguedadMax(e: Partial<Edades> | null | undefined): number | null {
  if (!e) return null;
  if (e.edad_15d_mas) return 15;
  if (e.edad_8_15d) return 8;
  if (e.edad_4_7d) return 4;
  if (e.edad_2_3d) return 2;
  if (e.edad_0_1d) return 0;
  return null;
}

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
  /** [transportadora, preparadas, guia_generada] — la forma que ya consumen
   *  el mapa, el tablero y el generador de archivo. Las edades NO van acá
   *  para no romper esos seis puntos de uso: viajan en `cargas`. */
  transportadoras: Array<[string, number, number]>;
  /** El mismo grano que `transportadoras`, con la antigüedad al lado. Es lo
   *  que se escribe en `rec_carga_diaria`, que guarda una fila por
   *  bodega × transportadora × fecha. */
  cargas: Array<{ transportadora: string; preparadas: number; guia_generada: number } & Edades>;
  /** Suma de las cubetas de todas sus transportadoras. */
  edades: Edades;
  ultimo_evento: string;

  // Identidad y contacto. Se toman de la primera fila de la bodega: el export
  // los repite idénticos en cada fila de transportadora.
  supplier_id: string | null;
  supplier_nombre: string | null;
  telefono: string | null;
  telefono_proveedor: string | null;
  fulfillment_by_dropi: boolean | null;
  bodega_creada_at: string | null;
};

const num = (v: unknown) => Number(v) || 0;

/** Texto del export → string limpio o null. "" y "NULL" son ausencia, no valor. */
const txt = (v: unknown): string | null => {
  const s = String(v ?? "").trim();
  return !s || s.toUpperCase() === "NULL" ? null : s;
};

/** El export puede traer el booleano como true/false, "true"/"false" o 1/0. */
const bool = (v: unknown): boolean | null => {
  if (v === true || v === false) return v;
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "true" || s === "1" || s === "t") return true;
  if (s === "false" || s === "0" || s === "f") return false;
  return null;
};

const edadesDe = (f: FilaExport): Edades => ({
  edad_0_1d: num(f.edad_0_1d),
  edad_2_3d: num(f.edad_2_3d),
  edad_4_7d: num(f.edad_4_7d),
  edad_8_15d: num(f.edad_8_15d),
  edad_15d_mas: num(f.edad_15d_mas),
});

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
        cargas: [],
        edades: { ...EDADES_CERO },
        ultimo_evento: "",
        // Identidad: se toma de la primera fila y no se vuelve a tocar. El
        // export la repite igual en cada fila de transportadora, así que la
        // última no aporta nada que la primera no diga.
        supplier_id: txt(f.supplier_id),
        supplier_nombre: txt(f.supplier_nombre),
        telefono: txt(f.telefono_bodega),
        telefono_proveedor: txt(f.telefono_proveedor),
        fulfillment_by_dropi: bool(f.fulfillment_by_dropi),
        bodega_creada_at: txt(f.bodega_creada_at),
      };
      mapa.set(id, b);
    }

    const p = num(f.preparadas), g = num(f.guia_generada);
    b.preparadas += p;
    b.guia_generada += g;
    b.total += p + g;

    const transportadora = f.transportadora || "(sin transportadora)";
    b.transportadoras.push([transportadora, p, g]);

    const e = edadesDe(f);
    b.cargas.push({ transportadora, preparadas: p, guia_generada: g, ...e });
    for (const k of Object.keys(EDADES_CERO) as Array<keyof Edades>) b.edades[k] += e[k];

    const ev = String(f.ultimo_evento ?? "");
    if (ev > b.ultimo_evento) b.ultimo_evento = ev;
  }

  for (const b of mapa.values()) {
    b.transportadoras.sort((x, y) => (y[1] + y[2]) - (x[1] + x[2]));
    b.cargas.sort((x, y) =>
      (y.preparadas + y.guia_generada) - (x.preparadas + x.guia_generada));
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


// ── Tipos de dominio ───────────────────────────────────────────────────────
// Viven acá y no en datos.ts a propósito: datos.ts habla con Supabase y con el
// disco, y la lógica que usa estos tipos no tiene por qué arrastrar esa
// dependencia solo para saber qué forma tiene una bodega.

export type BodegaConCarga = {
  warehouse_id: string;
  nombre: string;
  direccion: string;
  municipio: string;
  dpto: string;
  cod_dane: string;
  lat: number | null;
  lng: number | null;
  nivel_precision: Precision;
  supplier_id: string | null;
  supplier_nombre: string | null;
  telefono: string | null;
  telefono_proveedor: string | null;
  fulfillment_by_dropi: boolean | null;
  preparadas: number;
  guia_generada: number;
  total: number;
  /** [transportadora, preparadas, guia_generada] */
  transportadoras: Array<[string, number, number]>;
  /** Cubetas de antigüedad sumadas. En cero cuando la carga es anterior al
   *  export del 28-jul, que fue el primero en traer el dato. */
  edades: Edades;
  /** Días de la cubeta más vieja con guías. `null` = sin dato, que NO es lo
   *  mismo que 0 (“todas de hoy”). */
  antiguedad_max: number | null;
};

export type Foto = {
  fecha: string | null;
  /** De dónde salió: la pantalla tiene que poder decirlo. */
  fuente: "base" | "archivo" | "vacio";
  bodegas: BodegaConCarga[];
  totales: { bodegas: number; guias: number; preparadas: number; sin_ubicar_guias: number };
};
