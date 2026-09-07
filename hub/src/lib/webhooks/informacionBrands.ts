// Catálogo de los 11 datasets del webhook «Tablero de Célula Marcas»
// (POST /api/webhooks/in/informacion-brands). Cada entrada declara la tabla
// de destino, sus columnas (mismo orden que la migración 058) y las columnas
// que forman la PK — usadas como `onConflict` en el upsert. Las columnas
// aquí deben ser un subconjunto exacto de las de la tabla: se generaron a
// partir de la migración 058_webhooks_informacion_brands.sql para que no se
// desincronicen.
//
// `ingerido_en` no aparece en `columnas`: se pone explícitamente en cada fila
// al momento de escribir (ver route.ts), tanto en insert como en update.

export interface DatasetSpec {
  tabla: string;
  columnas: readonly string[];
  conflictoEn: readonly string[];
}

export const DATASETS: Record<string, DatasetSpec> = {
  dim_marcas: {
    tabla: "dim_marcas",
    conflictoEn: ["country_code", "user_id"],
    columnas: [
      "country_code", "user_id", "nombre_marca_blanca", "id_dropshipper_unico",
      "categoria_comportamiento", "comportamiento_algoritmico", "name", "surname",
      "email", "phone", "fecha_registro", "fecha_activacion", "dias_para_activacion",
      "rango_activacion", "fecha_activacion_supplier", "dias_para_activacion_supplier",
      "fecha_ttv", "dias_para_ttv", "fecha_ttv_supplier", "dias_para_ttv_supplier",
      "usa_chatea", "usa_shopify", "usa_woocommerce", "usa_tiendanube",
      "usa_integracion_ecommerce", "mes_primera_conexion_ecommerce", "estado_integracion",
      "usa_fulfillment", "cantidad_bodegas_distintas", "estado_cuenta", "esta_baneado",
      "comercial_id", "es_comercial", "community_id", "nombre_comunidad",
    ],
  },
  ltv_marcas_usuario: {
    tabla: "ltv_marcas_usuario",
    conflictoEn: ["user_id"],
    columnas: [
      "user_id", "email", "nombre", "categoria_comercial", "categoria_comportamiento",
      "comportamiento_algoritmico", "primera_orden_entregada", "ultima_orden_entregada",
      "vida_activa_meses", "ordenes_entregadas", "ltv_dropi_shipping_increment_amount",
      "ltv_total_commission_product_supplier", "ltv_overload_applied", "ltv_overload_base",
      "ltv_overload_neto", "ltv_total_dropi_commission_product_supplier",
      "ltv_total_dropi_commission_product_drops", "ltv_total", "ingreso_dropi_mensual",
    ],
  },
  meta_comercial_marcas: {
    tabla: "meta_comercial_marcas",
    conflictoEn: ["supplier_id", "periodo_mes"],
    columnas: [
      "periodo_mes", "supplier_id", "categoria_comercial", "categoria_comportamiento",
      "comportamiento_algoritmico", "ordenes_entregadas", "ordenes_devueltas",
      "ordenes_movilizadas", "ordenes_pendientes", "ordenes_canceladas", "ordenes_total",
      "ganancia_entregadas",
    ],
  },
  fact_marcas_mensual: {
    tabla: "fact_marcas_mensual",
    conflictoEn: ["country_code", "user_id", "periodo_mes"],
    columnas: [
      "country_code", "user_id", "periodo_mes", "categoria_comportamiento", "estado_marca",
      "orden_estado_marca", "es_fiel", "tipo_activacion", "orden_tipo_activacion",
      "es_activo_este_mes", "fue_activo_mes_anterior", "es_retenido", "marcas_con_ganancia",
      "marcas_con_ganancia_supplier", "estado_marca_supplier", "orden_estado_marca_supplier",
      "es_fiel_supplier", "tipo_activacion_supplier", "orden_tipo_activacion_supplier",
      "es_activo_este_mes_supplier", "fue_activo_mes_anterior_supplier", "es_retenido_supplier",
      "ordenes_mes_propias", "ordenes_mes_externas", "ordenes_creadas", "ordenes_movilizadas",
      "ordenes_movilizadas_propias", "ordenes_movilizadas_externas", "ordenes_entregadas",
      "ordenes_entregadas_propias", "ordenes_entregadas_externas", "ordenes_canceladas_rechazadas",
      "ordenes_canceladas_rechazadas_propias", "ordenes_canceladas_rechazadas_externas",
      "ordenes_devueltas", "ordenes_devueltas_propias", "ordenes_devueltas_externas",
      "ordenes_con_novedad", "ordenes_con_novedad_propias", "ordenes_con_novedad_externas",
      "ordenes_novedad_resuelta", "ordenes_novedad_resuelta_propias",
      "ordenes_novedad_resuelta_externas", "ordenes_entregadas_sin_novedad",
      "ordenes_entregadas_sin_novedad_propias", "ordenes_entregadas_sin_novedad_externas",
      "ordenes_en_novedad_hoy", "ordenes_en_novedad_hoy_propias", "ordenes_en_novedad_hoy_externas",
      "ordenes_pago_anticipado", "ordenes_pago_anticipado_propias",
      "ordenes_pago_anticipado_externas", "ordenes_pago_contraentrega",
      "ordenes_pago_contraentrega_propias", "ordenes_pago_contraentrega_externas",
      "ordenes_pago_sin_clasificar", "entregadas_anticipado", "entregadas_anticipado_propias",
      "entregadas_anticipado_externas", "devueltas_anticipado", "devueltas_anticipado_propias",
      "devueltas_anticipado_externas", "entregadas_contraentrega",
      "entregadas_contraentrega_propias", "entregadas_contraentrega_externas",
      "devueltas_contraentrega", "devueltas_contraentrega_propias",
      "devueltas_contraentrega_externas", "ordenes_creadas_manual",
      "ordenes_creadas_manual_propias", "ordenes_creadas_manual_externas",
      "ordenes_creadas_integracion", "ordenes_creadas_integracion_propias",
      "ordenes_creadas_integracion_externas", "ordenes_creadas_masivas",
      "ordenes_creadas_masivas_propias", "ordenes_creadas_masivas_externas",
      "ordenes_fulfillment", "ordenes_bodega_propia", "entregadas_fulfillment",
      "devueltas_fulfillment", "entregadas_bodega_propia", "devueltas_bodega_propia",
      "ganancia_total_mes", "ganancia_total_mes_propias", "ganancia_total_mes_externas",
      "productos_creados_privados", "productos_creados_publicos",
      "productos_eliminados_privados", "productos_eliminados_publicos",
    ],
  },
  fact_integraciones_mensual: {
    tabla: "fact_integraciones_mensual",
    conflictoEn: ["country_code", "user_id", "periodo_mes", "shop_type", "created_from"],
    columnas: [
      "country_code", "user_id", "periodo_mes", "shop_type", "grupo_integracion",
      "orden_grupo_integracion", "created_from", "ordenes_creadas", "ordenes_entregadas",
      "ordenes_devueltas", "ordenes_movilizadas", "ganancia",
    ],
  },
  fact_prepost_integracion: {
    tabla: "fact_prepost_integracion",
    conflictoEn: ["user_id"],
    columnas: [
      "user_id", "mes_conexion", "tipo_primera_tienda", "meses_antes", "meses_despues",
      "ordenes_antes", "ordenes_despues", "ordenes_delta", "entregadas_antes",
      "entregadas_despues", "entregadas_delta", "ganancia_antes", "ganancia_despues",
      "ganancia_delta",
    ],
  },
  fact_ecosistema_mensual: {
    tabla: "fact_ecosistema_mensual",
    conflictoEn: ["country_code", "periodo_mes", "es_comercial"],
    columnas: [
      "country_code", "periodo_mes", "es_comercial", "ordenes_creadas", "ordenes_movilizadas",
      "ordenes_entregadas", "ordenes_canceladas_rechazadas", "ordenes_devueltas",
      "ordenes_con_novedad", "ordenes_novedad_resuelta", "ordenes_en_novedad_hoy",
      "ordenes_propias", "ordenes_externas", "ordenes_pago_contraentrega",
      "ordenes_pago_anticipado", "ordenes_pago_sin_clasificar", "ordenes_creadas_manual",
      "ordenes_creadas_integracion", "ordenes_creadas_masivas", "actores_activos",
      "actores_con_entrega", "gmv_entregado",
    ],
  },
  fact_roles_ecosistema: {
    tabla: "fact_roles_ecosistema",
    conflictoEn: ["country_code", "periodo_mes", "rol", "origen_flujo", "destino_flujo"],
    columnas: [
      "country_code", "periodo_mes", "rol", "origen_flujo", "destino_flujo", "ordenes",
      "ordenes_entregadas", "usuarios_activos", "usuarios_exclusivos", "gmv_entregado",
    ],
  },
  fact_usuarios_ecosistema: {
    tabla: "fact_usuarios_ecosistema",
    conflictoEn: ["country_code", "periodo_mes"],
    columnas: ["country_code", "periodo_mes", "usuarios_activos"],
  },
  distribucion_sankey: {
    tabla: "distribucion_sankey",
    conflictoEn: ["periodo_mes", "supplier_id", "source_node", "target_node"],
    columnas: [
      "periodo_mes", "supplier_id", "source_node", "target_node", "total_ordenes",
      "ganancia_total",
    ],
  },
  distribucion_sankey_tipo2: {
    tabla: "distribucion_sankey_tipo2",
    conflictoEn: ["periodo_mes", "supplier_id", "source_node", "target_node"],
    columnas: [
      "periodo_mes", "supplier_id", "source_node", "target_node", "total_ordenes",
      "ganancia_total",
    ],
  },
};

/** Deja solo las columnas conocidas de un registro (ignora props extra del payload). */
export function filtrarColumnas(registro: unknown, spec: DatasetSpec): Record<string, unknown> | null {
  if (!registro || typeof registro !== "object" || Array.isArray(registro)) return null;
  const fuente = registro as Record<string, unknown>;
  const fila: Record<string, unknown> = {};
  for (const col of spec.columnas) {
    if (col in fuente) fila[col] = fuente[col];
  }
  fila.ingerido_en = new Date().toISOString();
  return fila;
}
