-- ═══════════════════════════════════════════════════════════════════════════
-- Registro genérico de webhooks entrantes — reemplaza el webhook único y
-- hardcodeado «cuidado de campañas» (049) por un registro self-serve.
--
-- Idea: cualquiera logueado en el hub crea un webhook desde /integraciones,
-- le pone nombre y célula, y el hub le devuelve UNA vez un token. Ese token se
-- le pasa a quien vaya a enviar la data (p.ej. Miguel de Data) y cada sistema
-- externo hace POST a /api/webhooks/in/<slug> con `Authorization: Bearer <token>`.
-- Cada célula consume después su propia data como quiera — el hub solo la recibe
-- y la deja disponible.
--
-- webhooks_registro: un webhook = una fila. El token NO se guarda en claro,
--   solo su SHA-256 (`token_sha256`) y un prefijo visible (`token_prefix`,
--   p.ej. `whk_a1b2c3`) para reconocerlo en la UI. Regenerar el token cambia
--   ambos y el anterior deja de servir.
--
-- webhooks_entregas: un POST del sistema externo = una fila (el «acuse», mismo
--   principio que el punto 5 del contrato viejo — «un 200 no es un acuse»).
--   Guarda cuántos registros llegaron vs. cuántos se escribieron, el subset de
--   headers, los bytes y el `lote_id` que agrupa la entrega.
--
-- webhooks_entradas: un registro = una fila. Si el body es un arreglo (o trae
--   `{ registros: [...] }`), se explota a una fila por elemento — así una tabla
--   grande no queda como un blob jsonb inmanejable y cada célula consulta filas.
--   `payload` es el elemento tal cual llegó; `lote_id` + `lote_seq` permiten
--   reconstruir la entrega completa y su orden.
--
-- RLS: mismo patrón que 049/037 — habilitada, solo lectura para `authenticated`,
-- sin políticas de insert/update/delete porque todo write pasa por rutas con
-- SUPABASE_SERVICE_KEY (que bypassa RLS). `token_sha256` nunca se expone al
-- browser: las rutas BFF seleccionan columnas explícitas y lo omiten.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists webhooks_registro (
  id                uuid          primary key default gen_random_uuid(),
  nombre            text          not null,
  slug              text          not null unique,
  descripcion       text,
  celula_id         uuid          references celulas(id) on delete set null,
  token_sha256      text          not null,
  token_prefix      text          not null,
  activo            boolean       not null default true,
  creado_por        text,
  creado_en         timestamptz   not null default now(),
  token_rotado_en   timestamptz,
  ultima_entrega_en timestamptz
);

create index if not exists ix_webhooks_registro_celula on webhooks_registro (celula_id);

create table if not exists webhooks_entregas (
  id                 uuid          primary key default gen_random_uuid(),
  webhook_id         uuid          not null references webhooks_registro(id) on delete cascade,
  recibido_en        timestamptz   not null default now(),
  fuente             text          not null default 'externo',  -- 'externo' | 'prueba'
  ok                 boolean       not null,
  registros_recibidos integer      not null default 0,
  registros_escritos  integer      not null default 0,
  bytes              integer       not null default 0,
  lote_id            uuid,
  headers            jsonb         not null default '{}'::jsonb,
  mensaje            text
);

create index if not exists ix_webhooks_entregas_webhook on webhooks_entregas (webhook_id, recibido_en desc);

create table if not exists webhooks_entradas (
  id           uuid          primary key default gen_random_uuid(),
  webhook_id   uuid          not null references webhooks_registro(id) on delete cascade,
  lote_id      uuid          not null,
  lote_seq     integer       not null default 0,
  recibido_en  timestamptz   not null default now(),
  payload      jsonb,  -- nullable: un arreglo puede traer elementos null
  lote_meta    jsonb         not null default '{}'::jsonb
);

create index if not exists ix_webhooks_entradas_webhook on webhooks_entradas (webhook_id, recibido_en desc);
create index if not exists ix_webhooks_entradas_lote on webhooks_entradas (lote_id);

alter table webhooks_registro enable row level security;
alter table webhooks_entregas enable row level security;
alter table webhooks_entradas enable row level security;

drop policy if exists "authenticated_read_webhooks_registro" on webhooks_registro;
create policy "authenticated_read_webhooks_registro" on webhooks_registro
  for select to authenticated using (true);

drop policy if exists "authenticated_read_webhooks_entregas" on webhooks_entregas;
create policy "authenticated_read_webhooks_entregas" on webhooks_entregas
  for select to authenticated using (true);

drop policy if exists "authenticated_read_webhooks_entradas" on webhooks_entradas;
create policy "authenticated_read_webhooks_entradas" on webhooks_entradas
  for select to authenticated using (true);

-- Sin políticas de insert/update/delete a propósito: todo write pasa por
-- /api/webhooks/in/<slug> y /api/integraciones/webhooks/* con SUPABASE_SERVICE_KEY.
