// De dónde salen los datos del módulo, en un solo lugar.
//
// Única fuente: Supabase (`rec_carga_diaria` + `rec_bodega`). Los snapshots
// operativos no pueden vivir en `public/` ni funcionar como respaldo: además
// de quedar viejos, eludirían el control de acceso específico de Indiana.
import { supabase } from "@/lib/supabase";
import { esUbicacionReal, antiguedadMax, EDADES_CERO,
         type BodegaConCarga, type Foto, type Edades } from "./index";
import type { ReglasPorTransportadora } from "./tablero";


const VACIA: Foto = {
  fecha: null, fuente: "vacio", bodegas: [],
  totales: { bodegas: 0, guias: 0, preparadas: 0, sin_ubicar_guias: 0 },
};

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
  // Sin tablas todavía (PGRST205) o sin filas: estado vacío explícito.
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

/** La foto vigente. Sin base o sin filas, falla a un estado vacío explícito. */
export async function cargarFoto(): Promise<Foto> {
  return (await desdeLaBase()) ?? VACIA;
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
