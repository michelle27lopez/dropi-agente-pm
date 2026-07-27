# 10 · Diccionario de datos (acceso real)

> **Fuente:** `fuentes/PowerBI_tablas_y_campos.xlsx` (Power BI) · **Tipo:** referencia técnica · **Confianza:** esquema real al que Juan tiene acceso. Base: `dropi_colombia` (PostgreSQL).

## TL;DR
- 25 tablas accesibles para discovery. La **orden** (`Order`, 128 campos) es el centro; `Historyorder` es el log de estados; `history_new_orders` las novedades ricas.
- Hay una tabla pre-calculada **`q18`** (transportadora, estado_anterior→estado_destino, num_ordenes, promedio/mediana horas) = **tiempos por transición** → insumo directo del KPI de tiempo por fases.
- Campos clave para los NSM ya existen: `is_validated`, `status_master_id`, `rate_type` (COD), `date_*` de fases, `created_from` (canal).

## Tablas y campos clave (mapeados a la cadena)
| Tabla | Campos | Para qué (etapa) |
|-------|--------|------------------|
| **Order** (128) | `status`, `created_from`, `rate_type`, `is_validated`, `validation_date`, `distribution_company_id`, `warehouse_id`, `payment_method_id`, `total_order`, `amount_earned_dropi`, `fulfillment_by_dropi`, `date_guia_generada`, `date_recibido_transportadora`, `date_en_reparto`, `date_entregado_o_devuelto`, `date_pendiente`, `type_service`, `tracking_number` | toda la cadena; canal, validación, COD, fases de tiempo |
| **Historyorder** (14) | `status`, `status_master_id`, `non_homologate_status`, `created_at`, `date_change_status_notif`, `shipping_guide` | log de estados (movilización real = capa 4+) |
| **history_new_orders** (27) | `novedad`, `solution`, `date_solution`, `solved_by_user`, `solved_by_user_logistic`, `id_problema`, `solution_list` | novedades + dueño/triaje |
| **q18** (6) | `transportadora`, `estado_anterior`, `estado_destino`, `num_ordenes`, `promedio_horas`, `mediana_horas` | ⏱️ **tiempos por transición → KPI tiempo por fases** |
| **logistic_management** + **history_logistic_management** + **types_logistic_management** | tipo de evento, bodega, carrier, usuario, fecha | pierna física Ecom (capa 3) |
| **distribution_companies** (24) | `name`, `is_veloces`, `pricing_rules`, `incidence_solution_method`, `porcentaje_tasa_sobreflete*`, `insurance`, `iva_percentage` | carriers + **tarifas/sobreflete** (proyecto tarifas) |
| **colombia_shipping_orders** (16) | `base_shipping`, `overload_base`, `shipping_amount`, `devolution_shipping_base`, `collect_cod_value_in_devolution`, `insurance`, `base_profit` | **costos de envío / tarifas / devolución** |
| **cities** (11) | `rate_type`, `trajectory_type`, `cod_dane`, `delivery_code` | cobertura geográfica / trayectos |
| **pick_ups** (24) | `pick_up_time`, `status`, `distribution_company_id`, `warehouse_id` | recolección |
| **warehouses** (22) | `fulfillment_by_dropi`, `commission_fulfillment`, `charge_fulfillment_in_devolution` | fulfillment / bodegas |
| **order_details** (37) | precios, comisiones (dropi/dropshipper/supplier), `quantity_set_returned` | económico por línea |
| **warranties** (20) | `warranty_type`, `status`, `return_type` | posventa / garantías |
| products · variations · attribute_* · warehouse_product* | catálogo e inventario | producto/stock |
| users (116) · roles · white_brands (49) | actores, perfiles, marcas blancas | segmentación |
| servientrega_movements (11) | `nom_mov`, `nom_conc`, `des_mov` | feed crudo Servientrega (sin homologar) |

## Conexión con metodología
- Habilita el **discovery con datos** (foco de Juan): los NSM (movilización, % entrega), el KPI de tiempo por fases (`q18` + `date_*` de `Order`), y el plan de 3 frentes (motivo de cancelación, novedad, sub-estados de devolución) son medibles con estas tablas.
- Para tiempos por fase usar `Order.date_*` + `Historyorder` (timestamps completos), no promedios. Ver reglas de medición en `temas/03`.

## Pendientes / límites
- Margen (`amount_earned_dropi`) null hasta cierre. Coordenadas casi vacías. Servientrega sin homologar. Motivo de cancelación en texto libre.
