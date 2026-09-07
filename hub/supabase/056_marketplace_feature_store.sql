-- ═══════════════════════════════════════════════════════════════════════════
-- MARKETPLACE FEATURE STORE — log append-only para el Algoritmo de Oportunidades
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Qué NO toca esta migración (importante):
--   - No modifica `userpilot_suppliers` ni ninguna tabla existente.
--   - No cambia RLS de nada que ya esté en producción.
--   - Crea una tabla nueva y una vista nueva. Aplicarla no cambia el
--     comportamiento de ningún endpoint actual: mientras el webhook no la
--     escriba (PR 3), queda vacía y sin lectores.
--
-- Decisiones de diseño (2026-09-03, Santiago + agente) — ver
-- ARQUITECTURA_DATA_ALGORITMO_OPORTUNIDADES.md §4.2:
--
--   1. APPEND-ONLY DE VERDAD (Criterio 1 del DoD).
--      El problema que resolvemos es que el webhook actual hace
--      `upsert({ onConflict: 'user_id' })` y destruye la serie de tiempo.
--      RLS NO alcanza para impedirlo: todo el hub escribe con
--      SUPABASE_SERVICE_KEY (rol `service_role`), que bypasea RLS. Por eso
--      la garantía va en un TRIGGER que aborta cualquier UPDATE o DELETE,
--      venga de donde venga. Corregir un dato = insertar un evento nuevo
--      posterior, nunca editar el pasado.
--
--   2. IDEMPOTENCIA POR HASH (Criterio 5 del DoD).
--      El DDL del documento no traía llave de deduplicación: si el script de
--      Miguel o Dagster reintenta un lote, los eventos se duplicaban y las
--      series quedaban infladas. La unique (entity_id, event_timestamp,
--      event_hash) permite que la API inserte con `ON CONFLICT DO NOTHING`:
--      reenviar el mismo lote es un no-op, no un error.
--      El hash lo calcula la API sobre el payload canónico
--      (hub/src/lib/contracts/feature-log-contract.ts) — no se calcula acá
--      para que sea idéntico al que usa el lado offline en DuckDB/R.
--
--   3. `contract_version` explícito.
--      El contrato Zod va a evolucionar (hoy no sabemos qué taxonomía usa
--      `nivel` — ver el Diccionario de Features). Guardar la versión del
--      contrato con la que entró cada fila es lo que permite reprocesar el
--      histórico sin adivinar cómo estaba tipado en su momento.
--
--   4. `event_timestamp` ≠ `ingested_at`.
--      `event_timestamp` = el corte al que se refiere la métrica (lo declara
--      Data). `ingested_at` = cuándo llegó a Supabase. El point-in-time join
--      del entrenamiento usa `event_timestamp`; `ingested_at` sirve para
--      auditar retrasos del pipeline. Confundirlos es exactamente la fuga
--      temporal que queremos evitar.
--
--   5. La vista `v_online_seller_features` va acá y no en una migración
--      aparte (el plan la tenía en el PR 5) porque las migraciones de este
--      repo se aplican A MANO en el SQL Editor: separarla obligaba a un
--      segundo viaje sin ganar nada. Es una vista sobre una tabla nueva y
--      vacía — riesgo cero. Lo que sí queda para el PR 5 es MEDIR el SLA.
--
--   6. `security_invoker = true` en la vista.
--      Sin eso una vista en Postgres corre con los privilegios de su dueño y
--      se salta la RLS de la tabla base — o sea, sería una puerta trasera de
--      lectura para `anon`. Gali-experiment usa la anon key contra este mismo
--      proyecto de Supabase, así que el riesgo no es teórico.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- 1. Tabla: registro inmutable de eventos
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists marketplace_feature_log (
  id                uuid         default gen_random_uuid() primary key,

  -- Quién. `entity_id` es texto a propósito: hoy llega el user_id de Dropi
  -- como string desde el CSV de Data, y mañana entran product_id y otros.
  entity_id         text         not null,
  entity_type       text         not null
                                 check (entity_type in ('dropshipper', 'supplier', 'product')),

  -- Qué. El payload ya validado por el contrato Zod de la frontera.
  payload           jsonb        not null,

  -- Cuándo (el corte de la métrica, NO la hora de llegada).
  event_timestamp   timestamptz  not null,

  -- Trazabilidad e idempotencia.
  event_hash        text         not null,
  source            text         not null default 'seller-success-webhook',
  contract_version  text         not null default 'v1',
  ingested_at       timestamptz  not null default now(),

  constraint marketplace_feature_log_idempotencia
    unique (entity_id, event_timestamp, event_hash)
);

comment on table marketplace_feature_log is
  'Feature store append-only del Algoritmo de Oportunidades. Nunca se hace UPDATE ni DELETE (trigger lo bloquea). Corregir = insertar un evento posterior.';

-- ───────────────────────────────────────────────────────────────────────────
-- 2. Índices
--    El primero es el que sostiene el SLA de lectura online: sirve tanto al
--    lookup puntual (where entity_id = $1 order by event_timestamp desc
--    limit 1) como al point-in-time join del entrenamiento
--    (where entity_id = $1 and event_timestamp <= $2).
-- ───────────────────────────────────────────────────────────────────────────

create index if not exists idx_feature_log_entity_time
  on marketplace_feature_log (entity_id, event_timestamp desc);

create index if not exists idx_feature_log_type_time
  on marketplace_feature_log (entity_type, event_timestamp desc);

-- ───────────────────────────────────────────────────────────────────────────
-- 3. Inmutabilidad forzada a nivel de motor (Criterio 1)
--    Esto también protege del error honesto: alguien copia el patrón de
--    upsert que hay en los otros webhooks y lo aplica acá. Falla en seco.
-- ───────────────────────────────────────────────────────────────────────────

create or replace function marketplace_feature_log_bloquear_mutacion()
returns trigger
language plpgsql
as $$
begin
  raise exception
    'marketplace_feature_log es append-only: % bloqueado. Para corregir un dato inserta un evento nuevo con event_timestamp posterior, no edites el pasado.',
    tg_op;
end;
$$;

drop trigger if exists trg_feature_log_append_only on marketplace_feature_log;
create trigger trg_feature_log_append_only
  before update or delete on marketplace_feature_log
  for each row execute function marketplace_feature_log_bloquear_mutacion();

-- ───────────────────────────────────────────────────────────────────────────
-- 4. RLS (Criterio 6 — zero-trust)
--    - `anon` no lee ni escribe: revoke explícito, porque Supabase concede
--      privilegios por defecto a anon/authenticated sobre el schema public.
--    - `authenticated` solo lee.
--    - La escritura entra únicamente por SUPABASE_SERVICE_KEY desde el
--      backend: `service_role` bypasea RLS, y NO creamos policy de insert
--      para nadie más.
-- ───────────────────────────────────────────────────────────────────────────

alter table marketplace_feature_log enable row level security;

revoke all on marketplace_feature_log from anon;
grant select on marketplace_feature_log to authenticated;

drop policy if exists "feature_log_select_authenticated" on marketplace_feature_log;
create policy "feature_log_select_authenticated"
  on marketplace_feature_log
  for select
  to authenticated
  using (true);

-- ───────────────────────────────────────────────────────────────────────────
-- 5. Lectura online: última foto conocida por entidad
--    OJO con el SLA: esta vista SIN filtro recorre todo el log (es un
--    distinct on sobre la tabla entera). El presupuesto de <15 ms aplica al
--    lookup puntual — `where entity_id = '671121'` — que sí baja al índice
--    idx_feature_log_entity_time. Medirlo así en el PR 5, no con un
--    `select * from v_online_seller_features` pelado.
-- ───────────────────────────────────────────────────────────────────────────

create or replace view v_online_seller_features
with (security_invoker = true)
as
select distinct on (entity_id)
  entity_id,
  entity_type,
  payload,
  event_timestamp,
  contract_version
from marketplace_feature_log
where entity_type = 'dropshipper'
order by entity_id, event_timestamp desc;

revoke all on v_online_seller_features from anon;
grant select on v_online_seller_features to authenticated;

comment on view v_online_seller_features is
  'Última foto conocida por dropshipper. Consultar SIEMPRE filtrando por entity_id para usar el índice; sin filtro hace scan completo del log.';

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN — correr después de aplicar, en el mismo SQL Editor.
-- Como acá las migraciones se aplican a mano, esto es el reemplazo del test.
--
--   -- a) La tabla existe y está vacía
--   select count(*) from marketplace_feature_log;                  --> 0
--
--   -- b) El trigger de inmutabilidad muerde de verdad
--   insert into marketplace_feature_log
--     (entity_id, entity_type, payload, event_timestamp, event_hash)
--   values ('__prueba__', 'dropshipper', '{"x":1}'::jsonb, now(), 'hash-prueba');
--
--   update marketplace_feature_log set entity_id = 'otro'
--     where entity_id = '__prueba__';                              --> ERROR esperado
--   delete from marketplace_feature_log
--     where entity_id = '__prueba__';                              --> ERROR esperado
--
--   -- c) La idempotencia rechaza el reenvío idéntico
--   insert into marketplace_feature_log
--     (entity_id, entity_type, payload, event_timestamp, event_hash)
--   select entity_id, entity_type, payload, event_timestamp, event_hash
--   from marketplace_feature_log where entity_id = '__prueba__';   --> ERROR unique esperado
--
--   -- d) Limpiar la fila de prueba (requiere apagar el trigger un momento)
--   alter table marketplace_feature_log disable trigger trg_feature_log_append_only;
--   delete from marketplace_feature_log where entity_id = '__prueba__';
--   alter table marketplace_feature_log enable trigger trg_feature_log_append_only;
-- ═══════════════════════════════════════════════════════════════════════════
