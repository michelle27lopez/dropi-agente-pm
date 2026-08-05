import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAppAccess } from "@/lib/app-access";
import { A_ETIQUETA_MAPA, esUbicacionReal, type Precision } from "@/lib/recolecciones";
import { resolverContactoBodega } from "@/lib/recolecciones/contacto";

// Sirve la foto vigente al prototipo del mapa.
//
// Devuelve el contrato estable del mapa ({ meta, puntos }) únicamente desde la
// base autorizada. No existe fallback a snapshots bajo `public/`.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FilaCarga = {
  warehouse_id: string;
  transportadora: string;
  preparadas: number;
  guia_generada: number;
  ultimo_evento: string | null;
};

export async function GET() {
  const user = await requireAppAccess("inidiana");
  if (!user) return NextResponse.json({ error: "Sin acceso a Control de Recolecciones" }, { status: 403 });
  if (!supabase) return NextResponse.json({ error: "Sin cliente de Supabase" }, { status: 500 });

  // La foto más reciente. Si mañana entra otra, esta consulta la toma sola.
  const { data: ultima } = await supabase
    .from("rec_carga_diaria")
    .select("fecha")
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!ultima) {
    return NextResponse.json({
      meta: { bodegas: 0, guias: 0, sin_datos: true },
      puntos: [],
      mensaje: "Todavía no se ha importado ningún día. Usá 'Actualizar datos'.",
    });
  }

  const fecha = ultima.fecha as string;

  // Paginado explícito: Supabase corta en 1.000 filas por defecto y el
  // carga diaria son ~4.100. Sin esto el mapa mostraría una cuarta parte del país
  // sin avisar — el peor tipo de bug, porque parece que funciona.
  const carga: FilaCarga[] = [];
  for (let desde = 0; ; desde += 1000) {
    const { data, error } = await supabase
      .from("rec_carga_diaria")
      .select("warehouse_id, transportadora, preparadas, guia_generada, ultimo_evento")
      .eq("fecha", fecha)
      .range(desde, desde + 999);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data?.length) break;
    carga.push(...(data as FilaCarga[]));
    if (data.length < 1000) break;
  }

  // Los dos teléfonos viajan crudos: cuál se usa lo decide resolverContactoBodega
  // (bodega primero, proveedor de respaldo), en un solo lugar. Resolverlo acá, en
  // el SQL, escondería la regla donde nadie la ve.
  type FilaBodega = {
    warehouse_id: string;
    nombre: string; direccion: string; municipio: string; dpto: string;
    cod_dane: string; lat: number | null; lng: number | null;
    nivel_precision: Precision; supplier_id: string | null; supplier_nombre: string | null;
    telefono: string | null; telefono_proveedor: string | null;
    fulfillment_by_dropi: boolean | null;
  };
  const bodegas = new Map<string, FilaBodega>();
  for (let desde = 0; ; desde += 1000) {
    const { data, error } = await supabase
      .from("rec_bodega")
      .select("warehouse_id, nombre, direccion, municipio, dpto, cod_dane, lat, lng, " +
              "nivel_precision, supplier_id, supplier_nombre, telefono, telefono_proveedor, " +
              "fulfillment_by_dropi")
      .range(desde, desde + 999);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data?.length) break;
    for (const b of data as unknown as FilaBodega[]) bodegas.set(b.warehouse_id, b);
    if (data.length < 1000) break;
  }

  // La carga diaria (grano bodega × transportadora) → un punto por bodega, con el
  // desglose en `tr`. El pivote a columnas lo sigue haciendo el frontend.
  const puntos = new Map<string, {
    id: string; b: string; a: string; m: string; dp: string; dane: string; dep: string;
    lat: number; lng: number; geo: string;
    supplier_id: string | null; contacto: string | null; contacto_de: string | null;
    fbd: boolean | null;
    p: number; g: number; t: number; tr: Array<[string, number, number]>; ue: string;
  }>();

  for (const s of carga) {
    const info = bodegas.get(s.warehouse_id);
    if (!info || info.lat == null || info.lng == null) continue;

    let punto = puntos.get(s.warehouse_id);
    if (!punto) {
      const contacto = resolverContactoBodega(info);
      punto = {
        id: s.warehouse_id,
        b: info.nombre ?? "(sin nombre)",
        a: info.direccion ?? "",
        m: info.municipio ?? "",
        dp: info.dpto ?? "",
        dane: info.cod_dane ?? "",
        dep: (info.cod_dane ?? "").slice(0, 2),
        lat: info.lat, lng: info.lng,
        geo: A_ETIQUETA_MAPA[info.nivel_precision] ?? "sin_ubicar",
        supplier_id: info.supplier_id ?? null,
        contacto: contacto.telefono,
        contacto_de: contacto.origen_tipo,
        fbd: info.fulfillment_by_dropi ?? null,
        p: 0, g: 0, t: 0, tr: [], ue: "",
      };
      puntos.set(s.warehouse_id, punto);
    }
    punto.p += s.preparadas;
    punto.g += s.guia_generada;
    punto.t += s.preparadas + s.guia_generada;
    punto.tr.push([s.transportadora, s.preparadas, s.guia_generada]);
    const ev = s.ultimo_evento ?? "";
    if (ev > punto.ue) punto.ue = ev;
  }

  const lista = [...puntos.values()].sort((a, b) => b.t - a.t);
  lista.forEach(p => p.tr.sort((x, y) => (y[1] + y[2]) - (x[1] + x[2])));

  const precision: Record<string, number> = {};
  const guiasPorPrecision = { geocodificado: 0, centroide: 0 };
  for (const p of lista) {
    precision[p.geo] = (precision[p.geo] ?? 0) + 1;
    const info = bodegas.get(p.id)!;
    if (esUbicacionReal(info.nivel_precision)) guiasPorPrecision.geocodificado += p.t;
    else guiasPorPrecision.centroide += p.t;
  }

  const trAgg = new Map<string, { n: string; p: number; g: number; bodegas: number }>();
  for (const p of lista) for (const [n, pp, gg] of p.tr) {
    const a = trAgg.get(n) ?? { n, p: 0, g: 0, bodegas: 0 };
    a.p += pp; a.g += gg; a.bodegas += 1;
    trAgg.set(n, a);
  }

  const { data: importacion } = await supabase
    .from("rec_importacion")
    .select("created_at, usuario, archivo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const total = lista.reduce((s, p) => s + p.t, 0);
  const eventos = lista.map(p => p.ue).filter(Boolean).sort();

  return NextResponse.json({
    meta: {
      generado: fecha,
      fuente: "Supabase · rec_carga_diaria + rec_bodega",
      grano: "bodega × transportadora (agregado a bodega; desglose en `tr`)",
      evento_min: eventos[0] ?? null,
      evento_max: eventos[eventos.length - 1] ?? null,
      bodegas: lista.length,
      guias: total,
      preparadas: lista.reduce((s, p) => s + p.p, 0),
      guia_generada: lista.reduce((s, p) => s + p.g, 0),
      precision,
      guias_por_precision: guiasPorPrecision,
      cobertura_geocodificada: total
        ? +(100 * guiasPorPrecision.geocodificado / total).toFixed(1) : 0,
      transportadoras: [...trAgg.values()]
        .map(a => ({ ...a, t: a.p + a.g }))
        .sort((a, b) => b.t - a.t),
      ultima_importacion: importacion ?? null,
    },
    puntos: lista,
  });
}
