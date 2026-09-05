-- ═══════════════════════════════════════════════════════════════════════════
-- Tablero de Célula Marcas — 11 datasets entregados por Data (Miguel Gutiérrez)
-- vía POST /api/webhooks/in/informacion-brands. A diferencia del receptor
-- genérico de 057 (que explota cualquier body a filas jsonb en
-- webhooks_entradas), este webhook trae un `dataset` explícito por lote y
-- cada dataset tiene su propia tabla tipada con PK real, para poder hacer
-- upsert idempotente (INSERT ... ON CONFLICT DO UPDATE) en vez de acumular
-- entregas crudas. El registro/autenticación del webhook (token, activo,
-- célula) sigue viviendo en webhooks_registro (057) — este archivo solo
-- agrega las tablas de destino y extiende webhooks_entregas con las columnas
-- que necesita este webhook multi-dataset para el acuse.
--
-- Ver especificación completa: doc «Webhook de Célula Marcas — Especificación
-- Técnica para el Receptor (Vercel)», v1.0, 04-sep-2026.
--
-- RLS: mismo patrón que 057 — habilitada, solo lectura para `authenticated`.
-- Todo write pasa por /api/webhooks/in/informacion-brands con
-- SUPABASE_SERVICE_KEY (bypassa RLS).
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. dim_marcas — dimensión maestra de marcas (activación, integraciones, PII)
create table if not exists dim_marcas (
    country_code                   varchar(2) not null,
    user_id                        bigint not null,
    nombre_marca_blanca            text,
    id_dropshipper_unico           integer,
    categoria_comportamiento       text,
    comportamiento_algoritmico     text,
    name                           text,
    surname                        text,
    email                          text,
    phone                          text,
    fecha_registro                 timestamp,
    fecha_activacion               timestamp,
    dias_para_activacion           bigint,
    rango_activacion               text,
    fecha_activacion_supplier      timestamp,
    dias_para_activacion_supplier  bigint,
    fecha_ttv                      timestamp,
    dias_para_ttv                  bigint,
    fecha_ttv_supplier             timestamp,
    dias_para_ttv_supplier         bigint,
    usa_chatea                     integer,
    usa_shopify                    integer,
    usa_woocommerce                integer,
    usa_tiendanube                 integer,
    usa_integracion_ecommerce      integer,
    mes_primera_conexion_ecommerce date,
    estado_integracion             text,
    usa_fulfillment                integer,
    cantidad_bodegas_distintas     bigint,
    estado_cuenta                  text,
    esta_baneado                   boolean,
    comercial_id                   bigint,
    es_comercial                   boolean,
    community_id                   integer,
    nombre_comunidad               text,
    ingerido_en                    timestamptz not null default now(),
    primary key (country_code, user_id)
);

-- 2. ltv_marcas_usuario — valor de vida del cliente, comisiones y retención
create table if not exists ltv_marcas_usuario (
    user_id                                     bigint primary key,
    email                                       text,
    nombre                                      text,
    categoria_comercial                         text,
    categoria_comportamiento                    text,
    comportamiento_algoritmico                  text,
    primera_orden_entregada                     date,
    ultima_orden_entregada                      date,
    vida_activa_meses                           integer,
    ordenes_entregadas                          bigint,
    ltv_dropi_shipping_increment_amount         numeric(18,2),
    ltv_total_commission_product_supplier       numeric(18,2),
    ltv_overload_applied                        numeric(18,2),
    ltv_overload_base                           numeric(18,2),
    ltv_overload_neto                           numeric(18,2),
    ltv_total_dropi_commission_product_supplier numeric(18,2),
    ltv_total_dropi_commission_product_drops    numeric(18,2),
    ltv_total                                   numeric(18,2),
    ingreso_dropi_mensual                       double precision,
    ingerido_en                                 timestamptz not null default now()
);

-- 3. meta_comercial_marcas — seguimiento mensual de meta comercial
create table if not exists meta_comercial_marcas (
    periodo_mes                date not null,
    supplier_id                integer not null,
    categoria_comercial        text,
    categoria_comportamiento   text,
    comportamiento_algoritmico text,
    ordenes_entregadas         bigint,
    ordenes_devueltas          bigint,
    ordenes_movilizadas        bigint,
    ordenes_pendientes         bigint,
    ordenes_canceladas         bigint,
    ordenes_total              bigint,
    ganancia_entregadas        numeric(18,2),
    ingerido_en                timestamptz not null default now(),
    primary key (supplier_id, periodo_mes)
);

-- 4. fact_marcas_mensual — panel analítico denso mensual (90 métricas)
create table if not exists fact_marcas_mensual (
    country_code                           varchar(2) not null,
    user_id                                integer not null,
    periodo_mes                            date not null,
    categoria_comportamiento               text,
    estado_marca                           text,
    orden_estado_marca                     integer,
    es_fiel                                integer,
    tipo_activacion                        text,
    orden_tipo_activacion                  integer,
    es_activo_este_mes                     integer,
    fue_activo_mes_anterior                integer,
    es_retenido                            integer,
    marcas_con_ganancia                    integer,
    marcas_con_ganancia_supplier           integer,
    estado_marca_supplier                  text,
    orden_estado_marca_supplier            integer,
    es_fiel_supplier                       integer,
    tipo_activacion_supplier               text,
    orden_tipo_activacion_supplier         integer,
    es_activo_este_mes_supplier            integer,
    fue_activo_mes_anterior_supplier       integer,
    es_retenido_supplier                   integer,
    ordenes_mes_propias                    bigint,
    ordenes_mes_externas                   bigint,
    ordenes_creadas                        bigint,
    ordenes_movilizadas                    bigint,
    ordenes_movilizadas_propias            bigint,
    ordenes_movilizadas_externas           bigint,
    ordenes_entregadas                     numeric(38,0),
    ordenes_entregadas_propias             bigint,
    ordenes_entregadas_externas            bigint,
    ordenes_canceladas_rechazadas          numeric(38,0),
    ordenes_canceladas_rechazadas_propias  bigint,
    ordenes_canceladas_rechazadas_externas bigint,
    ordenes_devueltas                      numeric(38,0),
    ordenes_devueltas_propias              bigint,
    ordenes_devueltas_externas             bigint,
    ordenes_con_novedad                    bigint,
    ordenes_con_novedad_propias            bigint,
    ordenes_con_novedad_externas           bigint,
    ordenes_novedad_resuelta               bigint,
    ordenes_novedad_resuelta_propias       bigint,
    ordenes_novedad_resuelta_externas      bigint,
    ordenes_entregadas_sin_novedad         bigint,
    ordenes_entregadas_sin_novedad_propias bigint,
    ordenes_entregadas_sin_novedad_externas bigint,
    ordenes_en_novedad_hoy                 bigint,
    ordenes_en_novedad_hoy_propias         bigint,
    ordenes_en_novedad_hoy_externas        bigint,
    ordenes_pago_anticipado                bigint,
    ordenes_pago_anticipado_propias        bigint,
    ordenes_pago_anticipado_externas       bigint,
    ordenes_pago_contraentrega             bigint,
    ordenes_pago_contraentrega_propias     bigint,
    ordenes_pago_contraentrega_externas    bigint,
    ordenes_pago_sin_clasificar            bigint,
    entregadas_anticipado                  bigint,
    entregadas_anticipado_propias          bigint,
    entregadas_anticipado_externas         bigint,
    devueltas_anticipado                   bigint,
    devueltas_anticipado_propias           bigint,
    devueltas_anticipado_externas          bigint,
    entregadas_contraentrega               bigint,
    entregadas_contraentrega_propias       bigint,
    entregadas_contraentrega_externas      bigint,
    devueltas_contraentrega                bigint,
    devueltas_contraentrega_propias        bigint,
    devueltas_contraentrega_externas       bigint,
    ordenes_creadas_manual                 numeric(38,0),
    ordenes_creadas_manual_propias         bigint,
    ordenes_creadas_manual_externas        bigint,
    ordenes_creadas_integracion            numeric(38,0),
    ordenes_creadas_integracion_propias    bigint,
    ordenes_creadas_integracion_externas   bigint,
    ordenes_creadas_masivas                numeric(38,0),
    ordenes_creadas_masivas_propias        bigint,
    ordenes_creadas_masivas_externas       bigint,
    ordenes_fulfillment                    numeric(38,0),
    ordenes_bodega_propia                  numeric(38,0),
    entregadas_fulfillment                 numeric(38,0),
    devueltas_fulfillment                  numeric(38,0),
    entregadas_bodega_propia               numeric(38,0),
    devueltas_bodega_propia                numeric(38,0),
    ganancia_total_mes                     numeric(38,2),
    ganancia_total_mes_propias             numeric(38,2),
    ganancia_total_mes_externas            numeric(38,2),
    productos_creados_privados             numeric(38,0),
    productos_creados_publicos             numeric(38,0),
    productos_eliminados_privados          numeric(38,0),
    productos_eliminados_publicos          numeric(38,0),
    ingerido_en                            timestamptz not null default now(),
    primary key (country_code, user_id, periodo_mes)
);

-- 5. fact_integraciones_mensual — métricas por tipo de integración de tienda
create table if not exists fact_integraciones_mensual (
    country_code            varchar(2) not null,
    user_id                 integer not null,
    periodo_mes             date not null,
    shop_type               text not null,
    grupo_integracion       text,
    orden_grupo_integracion integer,
    created_from            text not null default 'UNKNOWN',
    ordenes_creadas         bigint,
    ordenes_entregadas      bigint,
    ordenes_devueltas       bigint,
    ordenes_movilizadas     bigint,
    ganancia                numeric(38,2),
    ingerido_en             timestamptz not null default now(),
    primary key (country_code, user_id, periodo_mes, shop_type, created_from)
);

-- 6. fact_prepost_integracion — comparativa antes/después de conectar tienda
create table if not exists fact_prepost_integracion (
    user_id             integer primary key,
    mes_conexion        date,
    tipo_primera_tienda text,
    meses_antes         integer,
    meses_despues       integer,
    ordenes_antes       bigint,
    ordenes_despues     bigint,
    ordenes_delta       bigint,
    entregadas_antes    bigint,
    entregadas_despues  bigint,
    entregadas_delta    bigint,
    ganancia_antes      numeric(38,2),
    ganancia_despues    numeric(38,2),
    ganancia_delta      numeric(38,2),
    ingerido_en         timestamptz not null default now()
);

-- 7. fact_ecosistema_mensual — resumen mensual del ecosistema CO
create table if not exists fact_ecosistema_mensual (
    country_code                  varchar(2) not null,
    periodo_mes                   date not null,
    es_comercial                  boolean not null,
    ordenes_creadas               bigint,
    ordenes_movilizadas           bigint,
    ordenes_entregadas            bigint,
    ordenes_canceladas_rechazadas bigint,
    ordenes_devueltas             bigint,
    ordenes_con_novedad           bigint,
    ordenes_novedad_resuelta      bigint,
    ordenes_en_novedad_hoy        bigint,
    ordenes_propias               bigint,
    ordenes_externas              bigint,
    ordenes_pago_contraentrega    bigint,
    ordenes_pago_anticipado       bigint,
    ordenes_pago_sin_clasificar   bigint,
    ordenes_creadas_manual        bigint,
    ordenes_creadas_integracion   bigint,
    ordenes_creadas_masivas       bigint,
    actores_activos               bigint,
    actores_con_entrega           bigint,
    gmv_entregado                 numeric(38,2),
    ingerido_en                   timestamptz not null default now(),
    primary key (country_code, periodo_mes, es_comercial)
);

-- 8. fact_roles_ecosistema — agregados por rol (Marca, Proveedor, Dropshipper...)
create table if not exists fact_roles_ecosistema (
    country_code        varchar(2) not null,
    periodo_mes          date not null,
    rol                  text not null,
    origen_flujo         text not null default '',
    destino_flujo        text not null default '',
    ordenes              bigint,
    ordenes_entregadas   bigint,
    usuarios_activos     bigint,
    usuarios_exclusivos  bigint,
    gmv_entregado        numeric(38,2),
    ingerido_en          timestamptz not null default now(),
    primary key (country_code, periodo_mes, rol, origen_flujo, destino_flujo)
);

-- 9. fact_usuarios_ecosistema — total de personas distintas activas por mes
create table if not exists fact_usuarios_ecosistema (
    country_code     varchar(2) not null,
    periodo_mes      date not null,
    usuarios_activos bigint,
    ingerido_en      timestamptz not null default now(),
    primary key (country_code, periodo_mes)
);

-- 10. distribucion_sankey — flujo de órdenes entre nodos logísticos (tipo 1)
create table if not exists distribucion_sankey (
    periodo_mes    date not null,
    supplier_id    integer not null,
    source_node    text not null,
    target_node    text not null,
    total_ordenes  numeric(38,0),
    ganancia_total numeric(38,2),
    ingerido_en    timestamptz not null default now(),
    primary key (periodo_mes, supplier_id, source_node, target_node)
);

-- 11. distribucion_sankey_tipo2 — flujo alternativo entre nodos (tipo 2)
create table if not exists distribucion_sankey_tipo2 (
    periodo_mes    date not null,
    supplier_id    integer not null,
    source_node    text not null,
    target_node    text not null,
    total_ordenes  numeric(38,0),
    ganancia_total numeric(38,2),
    ingerido_en    timestamptz not null default now(),
    primary key (periodo_mes, supplier_id, source_node, target_node)
);

alter table dim_marcas enable row level security;
alter table ltv_marcas_usuario enable row level security;
alter table meta_comercial_marcas enable row level security;
alter table fact_marcas_mensual enable row level security;
alter table fact_integraciones_mensual enable row level security;
alter table fact_prepost_integracion enable row level security;
alter table fact_ecosistema_mensual enable row level security;
alter table fact_roles_ecosistema enable row level security;
alter table fact_usuarios_ecosistema enable row level security;
alter table distribucion_sankey enable row level security;
alter table distribucion_sankey_tipo2 enable row level security;

drop policy if exists "authenticated_read_dim_marcas" on dim_marcas;
create policy "authenticated_read_dim_marcas" on dim_marcas for select to authenticated using (true);

drop policy if exists "authenticated_read_ltv_marcas_usuario" on ltv_marcas_usuario;
create policy "authenticated_read_ltv_marcas_usuario" on ltv_marcas_usuario for select to authenticated using (true);

drop policy if exists "authenticated_read_meta_comercial_marcas" on meta_comercial_marcas;
create policy "authenticated_read_meta_comercial_marcas" on meta_comercial_marcas for select to authenticated using (true);

drop policy if exists "authenticated_read_fact_marcas_mensual" on fact_marcas_mensual;
create policy "authenticated_read_fact_marcas_mensual" on fact_marcas_mensual for select to authenticated using (true);

drop policy if exists "authenticated_read_fact_integraciones_mensual" on fact_integraciones_mensual;
create policy "authenticated_read_fact_integraciones_mensual" on fact_integraciones_mensual for select to authenticated using (true);

drop policy if exists "authenticated_read_fact_prepost_integracion" on fact_prepost_integracion;
create policy "authenticated_read_fact_prepost_integracion" on fact_prepost_integracion for select to authenticated using (true);

drop policy if exists "authenticated_read_fact_ecosistema_mensual" on fact_ecosistema_mensual;
create policy "authenticated_read_fact_ecosistema_mensual" on fact_ecosistema_mensual for select to authenticated using (true);

drop policy if exists "authenticated_read_fact_roles_ecosistema" on fact_roles_ecosistema;
create policy "authenticated_read_fact_roles_ecosistema" on fact_roles_ecosistema for select to authenticated using (true);

drop policy if exists "authenticated_read_fact_usuarios_ecosistema" on fact_usuarios_ecosistema;
create policy "authenticated_read_fact_usuarios_ecosistema" on fact_usuarios_ecosistema for select to authenticated using (true);

drop policy if exists "authenticated_read_distribucion_sankey" on distribucion_sankey;
create policy "authenticated_read_distribucion_sankey" on distribucion_sankey for select to authenticated using (true);

drop policy if exists "authenticated_read_distribucion_sankey_tipo2" on distribucion_sankey_tipo2;
create policy "authenticated_read_distribucion_sankey_tipo2" on distribucion_sankey_tipo2 for select to authenticated using (true);

-- Sin políticas de insert/update/delete a propósito: todo write pasa por
-- /api/webhooks/in/informacion-brands con SUPABASE_SERVICE_KEY (bypassa RLS).

-- webhooks_entregas (057) gana columnas para poder loguear el acuse de un
-- webhook multi-dataset sin perder el detalle de qué dataset/lote fue.
alter table webhooks_entregas add column if not exists dataset text;
alter table webhooks_entregas add column if not exists lote_numero integer;
alter table webhooks_entregas add column if not exists lote_total integer;
alter table webhooks_entregas add column if not exists idempotency_key text;

create index if not exists ix_webhooks_entregas_dataset on webhooks_entregas (dataset, recibido_en desc);
