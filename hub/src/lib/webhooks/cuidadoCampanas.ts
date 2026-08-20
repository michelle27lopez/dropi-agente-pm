import { supabase } from "@/lib/supabase";

// Mapeo del contrato en `doc hub/webhook_especificacion.md` (puntos 3 y 4):
// un body trae `ventana` + `registros[]`, cada registro con 28 campos fijos.
// Esta lib es la única que sabe leer ese contrato — la ruta pública y la
// ruta de prueba interna la comparten para no divergir en el mapeo.

export type VentanaDias = Record<string, string>;

export interface VentanaCuidadoCampanas {
  pais: string;
  fecha_corte: string;
  desde: string;
  hasta: string;
  dias: VentanaDias;
}

export interface LoteCuidadoCampanas {
  numero: number;
  total: number;
  filas: number;
  filas_totales: number;
}

export interface AcuseCuidadoCampanas {
  ok: boolean;
  lote: number | null;
  recibidos: number;
  escritos: number;
  errores: string[];
}

const DIAS = ["d8", "d7", "d6", "d5", "d4", "d3", "d2", "d1"] as const;

function numero(valor: unknown, porDefecto = 0): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : porDefecto;
}

function entero(valor: unknown, porDefecto = 0): number {
  return Math.trunc(numero(valor, porDefecto));
}

function texto(valor: unknown): string | null {
  if (valor === undefined || valor === null) return null;
  return String(valor);
}

/** Valida la forma mínima del body. Un body sin `registros` es un 4xx, nunca un 200 vacío. */
export function validarBody(body: any): { valido: true } | { valido: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valido: false, error: "Body vacío o inválido" };
  }
  if (!body.ventana || typeof body.ventana !== "object") {
    return { valido: false, error: "Falta 'ventana'" };
  }
  if (!body.ventana.fecha_corte) {
    return { valido: false, error: "Falta 'ventana.fecha_corte'" };
  }
  if (!Array.isArray(body.registros) || body.registros.length === 0) {
    return { valido: false, error: "Falta 'registros' (array no vacío)" };
  }
  return { valido: true };
}

/** Mapea un registro crudo del payload a una fila de ventas_dropshipper_producto. */
function mapearRegistro(raw: any, ventana: VentanaCuidadoCampanas) {
  const fila: Record<string, unknown> = {
    fecha_corte: ventana.fecha_corte,
    pais: ventana.pais,
    id_dropshipper: entero(raw.id_dropshipper),
    nombre_dropshipper: texto(raw.nombre_dropshipper) ?? "",
    correo_dropshipper: texto(raw.correo_dropshipper),
    id_producto: entero(raw.id_producto),
    nombre_producto: texto(raw.nombre_producto),
    id_proveedor: raw.id_proveedor === null || raw.id_proveedor === undefined ? null : entero(raw.id_proveedor),
    nombre_proveedor: texto(raw.nombre_proveedor),
    correo_proveedor: texto(raw.correo_proveedor),
    total_unidades_8d: numero(raw.total_unidades_8d),
    total_ordenes_8d: entero(raw.total_ordenes_8d),
    prom_unidades_dia: numero(raw.prom_unidades_dia),
    prom_ordenes_dia: numero(raw.prom_ordenes_dia),
    ventana,
    actualizado_en: new Date().toISOString(),
  };

  for (const d of DIAS) {
    fila[`und_${d}`] = numero(raw[`und_${d}`]);
    fila[`ord_${d}`] = entero(raw[`ord_${d}`]);
  }

  return fila;
}

/**
 * Procesa un lote completo: mapea, hace UNA sola sentencia de upsert (punto 7
 * del contrato — nunca un bucle de inserts) y deja el acuse en el log.
 * `fuente` distingue una entrega real del pipeline de una prueba manual
 * disparada desde /integraciones.
 */
export async function procesarLoteCuidadoCampanas(
  body: any,
  fuente: "externo" | "test"
): Promise<{ status: number; acuse: AcuseCuidadoCampanas }> {
  const validacion = validarBody(body);
  if (!validacion.valido) {
    await registrarLog({ ok: false, lote_numero: body?.lote?.numero ?? null, lote_total: body?.lote?.total ?? null, recibidos: 0, escritos: 0, errores: [validacion.error], fuente });
    return {
      status: 400,
      acuse: { ok: false, lote: body?.lote?.numero ?? null, recibidos: 0, escritos: 0, errores: [validacion.error] },
    };
  }

  const ventana: VentanaCuidadoCampanas = body.ventana;
  const lote: Partial<LoteCuidadoCampanas> = body.lote ?? {};
  const registros: any[] = body.registros;
  const recibidos = registros.length;

  const filas = registros.map((r) => mapearRegistro(r, ventana));

  if (!supabase) {
    const errores = ["Supabase no configurado"];
    await registrarLog({ ok: false, lote_numero: lote.numero ?? null, lote_total: lote.total ?? null, recibidos, escritos: 0, errores, fuente });
    return { status: 500, acuse: { ok: false, lote: lote.numero ?? null, recibidos, escritos: 0, errores } };
  }

  const { data, error } = await supabase
    .from("ventas_dropshipper_producto")
    .upsert(filas, { onConflict: "fecha_corte,id_dropshipper,id_producto" })
    .select("id_dropshipper");

  const escritos = error ? 0 : (data?.length ?? filas.length);
  const errores = error ? [error.message] : [];
  const ok = !error && escritos === recibidos;

  await registrarLog({ ok, lote_numero: lote.numero ?? null, lote_total: lote.total ?? null, recibidos, escritos, errores, fuente });

  return {
    status: error ? 500 : 200,
    acuse: { ok, lote: lote.numero ?? null, recibidos, escritos, errores },
  };
}

async function registrarLog(args: {
  ok: boolean;
  lote_numero: number | null;
  lote_total: number | null;
  recibidos: number;
  escritos: number;
  errores: string[];
  fuente: "externo" | "test";
}) {
  if (!supabase) return;
  const { error } = await supabase.from("cuidado_campanas_webhook_logs").insert({
    ok: args.ok,
    lote_numero: args.lote_numero,
    lote_total: args.lote_total,
    recibidos: args.recibidos,
    escritos: args.escritos,
    errores: args.errores,
    fuente: args.fuente,
    mensaje: args.errores[0] ?? null,
  });
  if (error) console.error("[cuidado-de-campanas] no se pudo escribir el log:", error.message);
}

/** Payload de ejemplo — el mismo del punto 4.4 del contrato — para el botón "Probar" de /integraciones. */
export function payloadDePrueba(): any {
  const hoy = new Date();
  const fechaCorte = hoy.toISOString().slice(0, 10);
  return {
    origen: "cuidado-de-campanas",
    version: 1,
    ventana: {
      pais: "CO",
      fecha_corte: fechaCorte,
      desde: fechaCorte,
      hasta: fechaCorte,
      dias: { d8: fechaCorte, d7: fechaCorte, d6: fechaCorte, d5: fechaCorte, d4: fechaCorte, d3: fechaCorte, d2: fechaCorte, d1: fechaCorte },
    },
    lote: { numero: 1, total: 1, filas: 1, filas_totales: 1 },
    registros: [
      {
        id_dropshipper: 999999,
        nombre_dropshipper: "Prueba Integraciones",
        correo_dropshipper: "prueba@dropi.co",
        id_producto: 999999,
        nombre_producto: "Producto de prueba",
        id_proveedor: 999998,
        nombre_proveedor: "Proveedor de prueba",
        correo_proveedor: "proveedor-prueba@dropi.co",
        und_d8: 0, und_d7: 1, und_d6: 0, und_d5: 2, und_d4: 0, und_d3: 1, und_d2: 0, und_d1: 1,
        ord_d8: 0, ord_d7: 1, ord_d6: 0, ord_d5: 1, ord_d4: 0, ord_d3: 1, ord_d2: 0, ord_d1: 1,
        total_unidades_8d: 5,
        total_ordenes_8d: 4,
        prom_unidades_dia: 0.63,
        prom_ordenes_dia: 0.5,
      },
    ],
  };
}
