// De dónde salen los datos del módulo, en un solo lugar.
//
// Dos fuentes, en orden: la base (rec_carga_diaria + rec_bodega) y, si todavía
// no existe la migración 037, el JSON que el pipeline deja en public/. Esa
// segunda vía es la que permite trabajar y probar el módulo completo antes de
// que las tablas existan — no es un parche permanente: el día que la base
// tenga datos, gana ella y el archivo deja de mirarse.
//
// En Vercel el archivo NO está (es data operativa, gitignored), así que allá
// solo funciona la base. Por eso la foto declara su `fuente`: la pantalla tiene
// que poder decir de dónde salió lo que muestra.

import fs from "node:fs";
import path from "node:path";
import { supabase } from "@/lib/supabase";
import { A_ETIQUETA_MAPA, esUbicacionReal, antiguedadMax, EDADES_CERO,
         type Precision, type BodegaConCarga, type Foto, type Edades } from "./index";
import type { ReglasPorTransportadora } from "./tablero";


const VACIA: Foto = {
  fecha: null, fuente: "vacio", bodegas: [],
  totales: { bodegas: 0, guias: 0, preparadas: 0, sin_ubicar_guias: 0 },
};

// El JSON del mapa usa etiquetas cortas; acá se vuelve al vocabulario completo.
const DESDE_ETIQUETA: Record<string, Precision> = Object.fromEntries(
  Object.entries(A_ETIQUETA_MAPA).map(([k, v]) => [v, k as Precision]),
) as Record<string, Precision>;

function totalizar(bodegas: BodegaConCarga[]): Foto["totales"] {
  return {
    bodegas: bodegas.length,
    guias: bodegas.reduce((s, b) => s + b.total, 0),
    preparadas: bodegas.reduce((s, b) => s + b.preparadas, 0),
    sin_ubicar_guias: bodegas
      .filter(b => !esUbicacionReal(b.nivel_precision))
      .reduce((s, b) => s + b.total, 0),
  };
}

async function desdeLaBase(): Promise<Foto | null> {
  if (!supabase) return null;

  const { data: ultima, error } = await supabase
    .from("rec_carga_diaria").select("fecha")
    .order("fecha", { ascending: false }).limit(1).maybeSingle();
  // Sin tablas todavía (PGRST205) o sin filas: que decida el archivo.
  if (error || !ultima) return null;

  const fecha = ultima.fecha as string;

  // Paginado explícito: PostgREST corta en 1.000 y la carga diaria son ~4.100.
  // Sin esto se mostraría una cuarta parte del país sin avisar.
  type FilaCarga = { warehouse_id: string; transportadora: string;
    preparadas: number; guia_generada: number } & Partial<Edades>;
  const carga: FilaCarga[] = [];
  for (let desde = 0; ; desde += 1000) {
    const { data } = await supabase
      .from("rec_carga_diaria")
      .select("warehouse_id, transportadora, preparadas, guia_generada, " +
              "edad_0_1d, edad_2_3d, edad_4_7d, edad_8_15d, edad_15d_mas")
      .eq("fecha", fecha).range(desde, desde + 999);
    if (!data?.length) break;
    // Doble cast: al partir el .select() en dos literales, Supabase pierde la
    // inferencia y tipa el resultado como error genérico. El verificador de
    // hub/scripts/ es el que comprueba que estas columnas existan de verdad,
    // porque acá el compilador ya no puede.
    carga.push(...(data as unknown as FilaCarga[]));
    if (data.length < 1000) break;
  }
  if (!carga.length) return null;

  const info = new Map<string, Omit<BodegaConCarga, "preparadas" | "guia_generada" | "total" | "transportadoras" | "antiguedad_max">>();
  for (let desde = 0; ; desde += 1000) {
    const { data } = await supabase
      .from("rec_bodega")
      .select("warehouse_id, nombre, direccion, municipio, dpto, cod_dane, lat, lng, " +
              "nivel_precision, supplier_id, supplier_nombre, telefono, telefono_proveedor, " +
              "fulfillment_by_dropi")
      .range(desde, desde + 999);
    if (!data?.length) break;
    for (const b of data as never[]) info.set((b as { warehouse_id: string }).warehouse_id, b);
    if (data.length < 1000) break;
  }

  const bodegas = new Map<string, BodegaConCarga>();
  // Las cubetas se acumulan aparte y al final se derivan a `antiguedad_max`,
  // que es lo que consume la regla de elegibilidad.
  const edadesPorBodega = new Map<string, Edades>();

  for (const c of carga) {
    const base = info.get(c.warehouse_id);
    if (!base) continue;
    let b = bodegas.get(c.warehouse_id);
    if (!b) {
      b = { ...base, preparadas: 0, guia_generada: 0, total: 0,
            transportadoras: [], edades: { ...EDADES_CERO }, antiguedad_max: null };
      bodegas.set(c.warehouse_id, b);
      edadesPorBodega.set(c.warehouse_id, { ...EDADES_CERO });
    }
    b.preparadas += c.preparadas;
    b.guia_generada += c.guia_generada;
    b.total += c.preparadas + c.guia_generada;
    b.transportadoras.push([c.transportadora, c.preparadas, c.guia_generada]);

    const acc = edadesPorBodega.get(c.warehouse_id)!;
    for (const k of Object.keys(EDADES_CERO) as Array<keyof Edades>) {
      acc[k] += Number(c[k]) || 0;
    }
  }

  // Hasta el export del 28-jul esto quedaba en null porque no había dato.
  // Ahora sí lo hay, y con eso se activa la regla de antigüedad que ya estaba
  // escrita en elegibilidad.ts pero nunca se cumplía.
  for (const [id, b] of bodegas) {
    const e = edadesPorBodega.get(id) ?? EDADES_CERO;
    b.edades = e;
    b.antiguedad_max = antiguedadMax(e);
  }

  const lista = [...bodegas.values()].sort((a, b) => b.total - a.total);
  return { fecha, fuente: "base", bodegas: lista, totales: totalizar(lista) };
}

function desdeElArchivo(): Foto | null {
  const f = path.join(process.cwd(), "public", "logistica", "recolecciones",
                      "datos-recolecciones.json");
  if (!fs.existsSync(f)) return null;

  try {
    const { meta, puntos } = JSON.parse(fs.readFileSync(f, "utf8"));
    const bodegas: BodegaConCarga[] = puntos.map((p: Record<string, never>) => ({
      warehouse_id: String(p.id),
      nombre: (p.b as string) ?? "(sin nombre)",
      direccion: (p.a as string) ?? "",
      municipio: (p.m as string) ?? "",
      dpto: (p.dp as string) ?? "",
      cod_dane: (p.dane as string) ?? "",
      lat: p.lat as number, lng: p.lng as number,
      nivel_precision: DESDE_ETIQUETA[p.geo as string] ?? "sin_ubicar",
      // El archivo es anterior a la petición a Data: estos campos aún no existen.
      supplier_id: null, supplier_nombre: null,
      telefono: null, telefono_proveedor: null,
      fulfillment_by_dropi: null,
      preparadas: (p.p as number) ?? 0,
      guia_generada: (p.g as number) ?? 0,
      total: (p.t as number) ?? 0,
      transportadoras: (p.tr as unknown as Array<[string, number, number]>) ?? [],
      // El JSON del pipeline es anterior al export con antigüedad.
      edades: { ...EDADES_CERO },
      antiguedad_max: null,
    }));
    return {
      fecha: (meta?.generado as string) ?? null,
      fuente: "archivo",
      bodegas,
      totales: totalizar(bodegas),
    };
  } catch {
    return null;
  }
}

/** La foto vigente. Base primero; el archivo solo si la base no tiene nada. */
export async function cargarFoto(): Promise<Foto> {
  return (await desdeLaBase()) ?? desdeElArchivo() ?? VACIA;
}

/** Reglas por transportadora desde la base; vacío si todavía no hay tablas. */
export async function cargarReglas(): Promise<ReglasPorTransportadora> {
  const reglas: ReglasPorTransportadora = new Map();
  if (!supabase) return reglas;
  const { data } = await supabase.from("rec_transportadora").select("id, min_paquetes");
  for (const t of (data ?? []) as Array<{ id: string; min_paquetes: number }>) {
    reglas.set(t.id, { min_paquetes: t.min_paquetes ?? 10 });
  }
  return reglas;
}
