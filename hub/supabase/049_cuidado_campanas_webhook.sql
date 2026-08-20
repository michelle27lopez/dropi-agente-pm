-- ═══════════════════════════════════════════════════════════════════════════
-- Webhook «cuidado de campañas» — tablas de destino
--
-- Implementa el contrato de doc hub/webhook_especificacion.md: el pipeline
-- (Dagster) empuja ventas de dropshippers × producto en CO, ventana móvil de
-- 8 días, por lotes de 500 filas, a POST /api/webhooks/cuidado-de-campanas.
--
-- ventas_dropshipper_producto: destino de cada fila (variante A — completa,
--   incluye nombre/correo de dropshipper y proveedor; decisión del dueño del
--   dato, no de esta migración). Clave natural de idempotencia (punto 6 del
--   contrato): (fecha_corte, id_dropshipper, id_producto) — el upsert de la
--   ruta resuelve contra el índice único de abajo.
--
-- Se guardan `und_d1..d8` / `ord_d1..d8` tal cual los emite el pipeline (no se
-- explota en una fila por día — eso cambiaría la clave y el alcance pedido es
-- solo este webhook, no un rediseño). Para no perder el mapeo día→fecha real
-- que el contrato exige (punto 3: "d1 del martes y d1 del jueves son fechas
-- distintas"), `ventana` guarda el bloque completo (`desde`, `hasta`, `dias`)
-- de cada corrida.
--
-- cuidado_campanas_webhook_logs: acuse de cada entrega (punto 5 del
-- contrato — "un 200 no es un acuse"). Cada llamada a la ruta, sea del
-- pipeline real o de la prueba manual desde /integraciones, deja fila acá con
-- cuántas llegaron y cuántas se escribieron de verdad.
--
-- PII: ambas tablas llevan datos personales (nombre/correo) o son operativas
-- de un flujo con PII detrás — mismo patrón que 037_close_pii_tables.sql:
-- RLS habilitada, solo lectura para `authenticated`, sin políticas de
-- insert/update/delete porque todo write pasa por la ruta con
-- SUPABASE_SERVICE_KEY.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists ventas_dropshipper_producto (
  fecha_corte         date            not null,
  pais                text            not null,
  id_dropshipper      bigint          not null,
  nombre_dropshipper  text            not null default '',
  correo_dropshipper  text,
  id_producto         bigint          not null,
  nombre_producto     text,
  id_proveedor        bigint,
  nombre_proveedor    text,
  correo_proveedor    text,

  und_d8              numeric(12,2)   not null default 0,
  und_d7              numeric(12,2)   not null default 0,
  und_d6              numeric(12,2)   not null default 0,
  und_d5              numeric(12,2)   not null default 0,
  und_d4              numeric(12,2)   not null default 0,
  und_d3              numeric(12,2)   not null default 0,
  und_d2              numeric(12,2)   not null default 0,
  und_d1              numeric(12,2)   not null default 0,

  ord_d8              integer         not null default 0,
  ord_d7              integer         not null default 0,
  ord_d6              integer         not null default 0,
  ord_d5              integer         not null default 0,
  ord_d4              integer         not null default 0,
  ord_d3              integer         not null default 0,
  ord_d2              integer         not null default 0,
  ord_d1              integer         not null default 0,

  total_unidades_8d   numeric(12,2)   not null default 0,
  total_ordenes_8d    integer         not null default 0,
  prom_unidades_dia   numeric(12,2)   not null default 0,
  prom_ordenes_dia    numeric(12,2)   not null default 0,

  ventana             jsonb           not null default '{}'::jsonb,
  creado_en           timestamptz     not null default now(),
  actualizado_en      timestamptz     not null default now()
);

create unique index if not exists ux_ventas_dropshipper_producto
  on ventas_dropshipper_producto (fecha_corte, id_dropshipper, id_producto);

create table if not exists cuidado_campanas_webhook_logs (
  id             uuid          primary key default gen_random_uuid(),
  recibido_en    timestamptz   not null default now(),
  fuente         text          not null default 'externo', -- 'externo' | 'test'
  ok             boolean       not null,
  lote_numero    integer,
  lote_total     integer,
  recibidos      integer       not null default 0,
  escritos       integer       not null default 0,
  errores        jsonb         not null default '[]'::jsonb,
  mensaje        text
);

alter table ventas_dropshipper_producto   enable row level security;
alter table cuidado_campanas_webhook_logs enable row level security;

drop policy if exists "authenticated_read_ventas_dropshipper_producto" on ventas_dropshipper_producto;
create policy "authenticated_read_ventas_dropshipper_producto" on ventas_dropshipper_producto
  for select to authenticated using (true);

drop policy if exists "authenticated_read_cuidado_campanas_webhook_logs" on cuidado_campanas_webhook_logs;
create policy "authenticated_read_cuidado_campanas_webhook_logs" on cuidado_campanas_webhook_logs
  for select to authenticated using (true);

-- Sin políticas de insert/update/delete a propósito: todo write pasa por
-- /api/webhooks/cuidado-de-campanas y /api/integraciones/cuidado-de-campanas
-- con SUPABASE_SERVICE_KEY, que bypassa RLS.
