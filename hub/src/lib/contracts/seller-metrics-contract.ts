/**
 * CONTRATO DE DATOS — Webhook Seller Success (v1)
 *
 * Este archivo es la frontera entre el equipo de Data (Miguel Ángel) y el hub.
 * Reemplaza al `ALIAS_MAP` de src/app/api/webhooks/seller-success/route.ts, que
 * adivinaba nombres de columnas y dejaba entrar basura en silencio.
 *
 * ── Por qué el contrato coerciona en vez de exigir tipos puros ──────────────
 * El emisor real (dropshipper-lab/data_analyst_webhook_sender.py) lee el CSV
 * con `csv.DictReader`, así que TODO llega como string: `"393"`, no `393`. Un
 * `z.number()` puro devolvería 422 a cada fila y dejaría la ingesta en cero.
 * Coercionamos, pero seguimos siendo falla-cerrada: `"abc"` produce NaN y se
 * rechaza, `"1.234"` (separador de miles) produce NaN y se rechaza, y el
 * string vacío NO se convierte en 0 — se trata como "no informado".
 * Ese último caso es la trampa silenciosa que más daño hace: en JavaScript
 * `Number("") === 0`, y un cero falso en `real_orders_delivered` convierte a
 * un seller activo en un huérfano a los ojos del modelo.
 *
 * ── Por qué el objeto es estricto ──────────────────────────────────────────
 * `z.strictObject` rechaza cualquier clave que no esté declarada acá. Eso es
 * el Criterio 2 del DoD: una columna mal nombrada es un error ruidoso, no un
 * dato que se pierde. Los alias viejos siguen listados abajo, pero SOLO para
 * poder devolver un mensaje de error útil ("recibí `pais`, el contrato espera
 * `country`") — nunca para traducirlos por debajo.
 *
 * ── Lo que este contrato todavía NO cubre ──────────────────────────────────
 * ARQUITECTURA_DATA_ALGORITMO_OPORTUNIDADES.md §4.1 propone features de ML
 * (`tasa_entrega_30d`, `tiempo_promedio_despacho_horas`, `saturacion`...) que
 * hoy Data NO produce ni envía. Están especificadas en el Diccionario de
 * Features como pendientes, no acá: declarar un campo que nadie manda solo
 * genera falsa sensación de cobertura.
 */

import { z } from "zod";

export const VERSION_CONTRATO_SELLER = "v1" as const;

// ───────────────────────────────────────────────────────────────────────────
// Helpers de coerción
// ───────────────────────────────────────────────────────────────────────────

/**
 * Normaliza los "vacíos" que produce un CSV a `undefined`, para que un campo
 * no informado no se convierta en 0, en false ni en la string "null".
 */
function vacioAUndefined(valor: unknown): unknown {
  if (valor === null || valor === undefined) return undefined;
  if (typeof valor === "string") {
    const limpio = valor.trim();
    if (limpio === "" || limpio.toLowerCase() === "null" || limpio === "-" || limpio === "N/A") {
      return undefined;
    }
    return limpio;
  }
  return valor;
}

/** Texto libre opcional, ya recortado. */
const texto = z.preprocess(vacioAUndefined, z.string().min(1).optional());

/** Entero >= 0. Acepta "393" pero no "abc", no "1.234" y no "". */
const enteroNoNegativo = z.preprocess(
  vacioAUndefined,
  z.coerce.number().int().nonnegative().optional()
);

/** Número >= 0 con decimales. */
const decimalNoNegativo = z.preprocess(
  vacioAUndefined,
  z.coerce.number().nonnegative().optional()
);

/**
 * Booleano tolerante con las formas en que un CSV escribe la verdad, pero
 * cerrado: cualquier otra cosa es un error, no un `false` por descarte.
 */
const VERDADEROS = new Set(["true", "1", "si", "sí", "yes", "t", "y"]);
const FALSOS = new Set(["false", "0", "no", "f", "n"]);

const booleano = z.preprocess((valor) => {
  const v = vacioAUndefined(valor);
  if (v === undefined) return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") {
    if (v === 1) return true;
    if (v === 0) return false;
    return v; // deja que Zod lo rechace
  }
  if (typeof v === "string") {
    const s = v.toLowerCase();
    if (VERDADEROS.has(s)) return true;
    if (FALSOS.has(s)) return false;
  }
  return v; // deja que Zod lo rechace
}, z.boolean().optional());

/**
 * Fecha ISO 8601. No la convertimos a Date: la guardamos como string para que
 * el payload en JSONB sea byte-idéntico al que se hasheó, y que R y DuckDB
 * lean exactamente lo mismo que guardó Next.js.
 */
const fechaISO = z.preprocess(
  vacioAUndefined,
  z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Fecha no interpretable. Se espera ISO 8601 (ej: 2026-09-03T14:20:00Z)",
    })
    .optional()
);

/** El único campo verdaderamente obligatorio. Acepta 671121 y "671121". */
const idObligatorio = z.preprocess((valor) => {
  const v = vacioAUndefined(valor);
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return v;
}, z.string().min(1, "user_id es obligatorio y no puede venir vacío"));

// ───────────────────────────────────────────────────────────────────────────
// El contrato
//
// Los nombres canónicos son los de las columnas reales de `userpilot_suppliers`
// (hub/supabase/002_userpilot_suppliers.sql y siguientes). No inventamos
// nombres nuevos: lo que se guarda en el feature log tiene que poder cruzarse
// con lo que ya leen /api/metrics/* y /api/ttv sin una capa de traducción.
// ───────────────────────────────────────────────────────────────────────────

export const SellerMetricsPayloadSchema = z.strictObject({
  // ── Identidad ────────────────────────────────────────────────────────────
  user_id: idObligatorio,
  name: texto,
  email: texto, // a propósito sin validar formato: ver Diccionario de Features
  phone: texto,
  country: texto,
  role: texto,

  /**
   * Corte al que se refieren estas métricas. OPCIONAL en v1 porque hoy Data no
   * lo envía; cuando falta, la API usa la hora de ingesta y lo deja marcado.
   * Esa suplencia es una concesión temporal: mientras exista, el point-in-time
   * join no distingue "métrica del 1 de septiembre cargada tarde" de "métrica
   * del 3". Pasa a OBLIGATORIO en v2.
   */
  corte_timestamp: fechaISO,

  // ── Segmentación (taxonomía en disputa — ver Diccionario) ────────────────
  /**
   * Deliberadamente `texto` y no un enum. El documento de arquitectura propone
   * ["Iniciando","Creciendo","Consolidando","Pre-Escalando","Escalando"] (los
   * niveles de MADUREZ OPERATIVA), pero el emisor real manda "Explorador" (un
   * nivel de LEYENDAS) y la columna en base ya trae VERIFICADO / PREMIUM / " ".
   * Son tres taxonomías distintas conviviendo en un solo campo. Congelar un
   * enum ahora rechazaría data legítima; el modo observador del PR 3 registra
   * los valores reales y con esa evidencia se cierra el enum en v2.
   */
  tipo_proveedor: texto,

  // ── Métricas operativas (las que sí alimentan el algoritmo) ──────────────
  real_orders_delivered: enteroNoNegativo,
  real_products_created: enteroNoNegativo,
  real_dropshipper_clients: enteroNoNegativo,
  dias_en_activarse: enteroNoNegativo,
  web_sessions: enteroNoNegativo,
  es_activo_30d: booleano,

  // ── Comunidad y gestión comercial ────────────────────────────────────────
  referred_by: texto,
  belong_to_community: texto,
  owner_of_community: texto,

  // ── Respuestas de encuesta de onboarding ─────────────────────────────────
  survey_brand_sales: texto,
  survey_volume: texto,
  survey_stage: texto,
  survey_source: texto,
  survey_purpose: texto,
  survey_role: texto,
  survey_sell_pref: texto,
  survey_shipping_pref: texto,

  // ── Estado de cuenta ─────────────────────────────────────────────────────
  billing_information: booleano,
  verified: booleano,
  saldo_promedio_fletes: decimalNoNegativo,

  // ── Telemetría de Userpilot ──────────────────────────────────────────────
  device_type: texto,
  os: texto,
  browser: texto,
  browser_language: texto,

  // ── Fechas ───────────────────────────────────────────────────────────────
  fecha_activacion: fechaISO,
  first_seen: fechaISO,
  last_seen: fechaISO,
  signed_up: fechaISO,
  created_at: fechaISO,
});

export type SellerMetricsPayload = z.infer<typeof SellerMetricsPayloadSchema>;

// ───────────────────────────────────────────────────────────────────────────
// Alias deprecados
//
// NO se traducen. Existen para que el 422 diga qué renombrar en vez de un
// "clave desconocida" seco. Esta es la lista que hay que cerrar con Miguel
// antes de activar SELLER_SUCCESS_STRICT_CONTRACT=true (PR 4).
// ───────────────────────────────────────────────────────────────────────────

export const ALIAS_DEPRECADOS: Readonly<Record<string, string>> = Object.freeze({
  id: "user_id",
  userId: "user_id",
  nombre: "name",
  seller_name: "name",
  correo: "email",
  telefono: "phone",
  celular: "phone",
  pais: "country",
  rol: "role",
  total_orders: "real_orders_delivered",
  ordenes_entregadas: "real_orders_delivered",
  ordenes: "real_orders_delivered",
  productos_creados: "real_products_created",
  productos: "real_products_created",
  ttv_dias: "dias_en_activarse",
  dias_activacion: "dias_en_activarse",
  nivel_leyendas: "tipo_proveedor",
  nivel_leyenda: "tipo_proveedor",
  segmento: "tipo_proveedor",
  kam: "referred_by",
  kam_asignado: "referred_by",
  comunidad: "belong_to_community",
  comunidad_nombre: "belong_to_community",
  lider_comunidad: "owner_of_community",
  categoria: "survey_brand_sales",
  categoria_producto: "survey_brand_sales",
  volumen_declarado: "survey_volume",
  etapa_onboarding: "survey_stage",
  origen_registro: "survey_source",
  billing: "billing_information",
  datos_facturacion: "billing_information",
});

// ───────────────────────────────────────────────────────────────────────────
// Validación con error legible
// ───────────────────────────────────────────────────────────────────────────

export type ViolacionContrato = {
  /** Índice del registro dentro del lote. */
  registro: number;
  /** Ruta del campo que falló, ej. ["real_orders_delivered"]. */
  path: (string | number)[];
  error: string;
  /** Presente cuando el campo desconocido tiene un canónico conocido. */
  renombrar_a?: string;
};

export type ResultadoValidacionLote =
  | { ok: true; registros: SellerMetricsPayload[]; violaciones: [] }
  | { ok: false; registros: SellerMetricsPayload[]; violaciones: ViolacionContrato[] };

/**
 * Valida un lote completo. Devuelve SIEMPRE las violaciones encontradas y los
 * registros que sí pasaron, para que el endpoint decida qué hacer según el
 * flag de modo estricto: en modo observador reporta y sigue; en modo estricto
 * responde 422 con el detalle y no escribe nada.
 */
export function validarLoteSellerMetrics(registros: unknown[]): ResultadoValidacionLote {
  const validos: SellerMetricsPayload[] = [];
  const violaciones: ViolacionContrato[] = [];

  registros.forEach((registro, indice) => {
    const resultado = SellerMetricsPayloadSchema.safeParse(registro);

    if (resultado.success) {
      validos.push(resultado.data);
      return;
    }

    for (const issue of resultado.error.issues) {
      // Zod reporta las claves sobrantes de un strictObject sin path útil,
      // así que las sacamos del propio mensaje para poder sugerir el rename.
      const claveSobrante =
        issue.code === "unrecognized_keys" && "keys" in issue
          ? (issue.keys as string[])
          : null;

      if (claveSobrante) {
        for (const clave of claveSobrante) {
          const canonico = ALIAS_DEPRECADOS[clave];
          violaciones.push({
            registro: indice,
            path: [clave],
            error: canonico
              ? `Columna '${clave}' ya no se acepta. El contrato espera '${canonico}'.`
              : `Columna '${clave}' no está en el contrato. Si es un campo nuevo, agrégalo primero al contrato y al Diccionario de Features.`,
            ...(canonico ? { renombrar_a: canonico } : {}),
          });
        }
        continue;
      }

      violaciones.push({
        registro: indice,
        path: issue.path as (string | number)[],
        error: issue.message,
      });
    }
  });

  return violaciones.length === 0
    ? { ok: true, registros: validos, violaciones: [] }
    : { ok: false, registros: validos, violaciones };
}
