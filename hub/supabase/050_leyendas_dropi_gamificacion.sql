-- ════════════════════════════════════════════════════════════════════════
-- 050_leyendas_dropi_gamificacion.sql
-- Célula: Growth | Proyecto: GRO-LEY-001 Leyendas Dropi
-- Fecha: 2026-08-19
-- Descripción: Esquema de gamificación — Consulta de Nivel, OTP y Wrapped
-- ════════════════════════════════════════════════════════════════════════

-- ─── Tipos enumerados ────────────────────────────────────────────────────

do $$ begin
  create type tier_name as enum (
    'Bienvenido','Aprendiz','Explorador','Master',
    'Experto','Sabio VIP','Leyenda'
  );
exception when duplicate_object then null; end $$;

-- ─── Tiers (niveles) ─────────────────────────────────────────────────────

create table if not exists tiers (
  id            smallint    primary key,
  name          tier_name   not null unique,
  eyebrow       varchar(2)  not null,          -- "01".."07"
  min_orders    integer     not null check (min_orders >= 0),
  max_orders    integer,                        -- null = rango abierto
  created_at    timestamptz not null default now()
);

-- ─── Sub-niveles ─────────────────────────────────────────────────────────

create table if not exists sub_levels (
  id           uuid        primary key default gen_random_uuid(),
  tier_id      smallint    not null references tiers(id) on delete cascade,
  code         varchar(10) not null,            -- 'I' | 'II' | 'III' | 'unica'
  label        varchar(60) not null,
  min_orders   integer     not null check (min_orders >= 0),
  max_orders   integer,
  badge_url    text,                            -- null = medalla pendiente de diseño
  sort_order   smallint    not null,
  unique (tier_id, code)
);

-- ─── Sellers (vendedores) ─────────────────────────────────────────────────

create table if not exists sellers (
  id            uuid        primary key default gen_random_uuid(),
  email         varchar(255) not null unique,
  display_name  varchar(120) not null,
  country       varchar(2)  not null default 'CO',
  created_at    timestamptz not null default now()
);

-- ─── OTP Challenges ──────────────────────────────────────────────────────
-- Regla de negocio:
--   · expires_at = now() + 10 minutos
--   · attempts_left máximo 5 (se descuenta en cada intento fallido)
--   · consumed_at se marca cuando el código es validado exitosamente
--   · Al solicitar nuevo OTP, se invalida el challenge previo del mismo email

create table if not exists otp_challenges (
  id            uuid        primary key default gen_random_uuid(),
  email         varchar(255) not null,
  code          varchar(6)  not null,
  expires_at    timestamptz not null,
  attempts_left smallint    not null default 5 check (attempts_left >= 0),
  consumed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_otp_email_created
  on otp_challenges(email, created_at desc);

-- ─── Seller Month Snapshots ───────────────────────────────────────────────
-- Foto congelada del nivel/subnivel/órdenes de un seller en un mes específico.
-- Regla: un único snapshot por seller por mes (unique constraint).
-- points = orders_delivered * 1.8 (cálculo provisional; catálogo de canje pendiente)

create table if not exists seller_month_snapshots (
  id              uuid        primary key default gen_random_uuid(),
  seller_id       uuid        not null references sellers(id) on delete cascade,
  month_date      date        not null,          -- primer día del mes (YYYY-MM-01)
  tier_id         smallint    not null references tiers(id),
  sub_level_code  varchar(10) not null,
  orders_delivered integer    not null check (orders_delivered >= 0),
  leveled_up      boolean     not null default false,
  points          integer     not null default 0 check (points >= 0),
  created_at      timestamptz not null default now(),
  unique (seller_id, month_date)
);

create index if not exists idx_snapshot_seller_month
  on seller_month_snapshots(seller_id, month_date desc);

-- ─── RLS (Row Level Security) ─────────────────────────────────────────────
-- Las tablas de gamificación son de lectura pública (el nivel es público para
-- el seller autenticado vía OTP). Escritura solo desde el service role.

alter table tiers enable row level security;
alter table sub_levels enable row level security;
alter table sellers enable row level security;
alter table otp_challenges enable row level security;
alter table seller_month_snapshots enable row level security;

-- Lectura pública de la estructura de niveles (catálogo estático)
create policy if not exists "tiers_public_read" on tiers
  for select using (true);

create policy if not exists "sub_levels_public_read" on sub_levels
  for select using (true);

-- OTP challenges: solo service role escribe, nadie lee desde cliente
create policy if not exists "otp_service_only" on otp_challenges
  for all using (false);

-- Sellers: solo service role
create policy if not exists "sellers_service_only" on sellers
  for all using (false);

-- Snapshots: solo service role
create policy if not exists "snapshots_service_only" on seller_month_snapshots
  for all using (false);

-- ─── Seed: Tiers ─────────────────────────────────────────────────────────

insert into tiers (id, name, eyebrow, min_orders, max_orders) values
  (0, 'Bienvenido', '01',     0,     0),
  (1, 'Aprendiz',   '02',     1,   100),
  (2, 'Explorador', '03',   100,  1000),
  (3, 'Master',     '04',  1001,  2500),
  (4, 'Experto',    '05',  2501,  5000),
  (5, 'Sabio VIP',  '06',  5001, 20000),
  (6, 'Leyenda',    '07', 20001,  null)
on conflict (id) do nothing;

-- ─── Seed: Sub-niveles ───────────────────────────────────────────────────

insert into sub_levels (tier_id, code, label, min_orders, max_orders, badge_url, sort_order) values
  -- Bienvenido
  (0, 'unica', 'Categoría de entrada',    0,    0, null,                       1),
  -- Aprendiz
  (1, 'I',     'Subnivel I',              1,    9, '/badges/aprendiz-1.png',  1),
  (1, 'II',    'Subnivel II',            10,   50, '/badges/aprendiz-2.png',  2),
  (1, 'III',   'Subnivel III',           51,  100, '/badges/aprendiz-3.png',  3),
  -- Explorador
  (2, 'I',     'Subnivel I',            100,  299, null,                       1),
  (2, 'II',    'Subnivel II',           300,  599, null,                       2),
  (2, 'III',   'Subnivel III',          600, 1000, null,                       3),
  -- Master
  (3, 'I',     'Subnivel I',           1001, 1500, '/badges/master-1.png',    1),
  (3, 'II',    'Subnivel II',          1501, 2500, '/badges/master-2.png',    2),
  -- Experto
  (4, 'I',     'Subnivel I',           2501, 3500, '/badges/experto-1.png',   1),
  (4, 'II',    'Subnivel II',          3501, 5000, '/badges/experto-2.png',   2),
  -- Sabio VIP
  (5, 'I',     'Subnivel I',           5001, 9999, '/badges/sabio-1.png',     1),
  (5, 'II',    'Subnivel II',         10000,20000, null,                       2),
  -- Leyenda
  (6, 'unica', 'Rango único',         20001,  null, '/badges/leyenda.png',    1)
on conflict (tier_id, code) do nothing;

-- ─── Seed: Sellers ───────────────────────────────────────────────────────

insert into sellers (email, display_name, country) values
  ('oscar.galeano@dropi.co', 'oscar galeano', 'CO'),
  ('maria.ruiz@dropi.co',    'maria ruiz',    'CO'),
  ('juan.perez@dropi.co',    'juan perez',    'MX'),
  ('lucia.gomez@dropi.co',   'lucia gomez',   'CO'),
  ('carlos.vera@dropi.co',   'carlos vera',   'PE')
on conflict (email) do nothing;

-- ─── Seed: Snapshots (últimos 3 meses) ───────────────────────────────────
-- points = orders_delivered * 1.8 (redondeado)

insert into seller_month_snapshots
  (seller_id, month_date, tier_id, sub_level_code, orders_delivered, leveled_up, points)
select id, '2026-06-01'::date, 2, 'III',  780, false, 1404 from sellers where email = 'oscar.galeano@dropi.co' union all
select id, '2026-07-01'::date, 3, 'I',   1005, true,  1809 from sellers where email = 'oscar.galeano@dropi.co' union all
select id, '2026-08-01'::date, 3, 'I',   1180, false, 2124 from sellers where email = 'oscar.galeano@dropi.co' union all

select id, '2026-06-01'::date, 3, 'II',  2100, false, 3780 from sellers where email = 'maria.ruiz@dropi.co' union all
select id, '2026-07-01'::date, 4, 'I',   2650, true,  4770 from sellers where email = 'maria.ruiz@dropi.co' union all
select id, '2026-08-01'::date, 4, 'I',   2900, false, 5220 from sellers where email = 'maria.ruiz@dropi.co' union all

select id, '2026-06-01'::date, 1, 'I',      6, false,   11 from sellers where email = 'juan.perez@dropi.co' union all
select id, '2026-07-01'::date, 1, 'II',    28, false,   50 from sellers where email = 'juan.perez@dropi.co' union all
select id, '2026-08-01'::date, 1, 'II',    32, false,   58 from sellers where email = 'juan.perez@dropi.co' union all

select id, '2026-06-01'::date, 6, 'unica',21800, false, 39240 from sellers where email = 'lucia.gomez@dropi.co' union all
select id, '2026-07-01'::date, 6, 'unica',23000, false, 41400 from sellers where email = 'lucia.gomez@dropi.co' union all
select id, '2026-08-01'::date, 6, 'unica',24500, false, 44100 from sellers where email = 'lucia.gomez@dropi.co'
-- carlos.vera: sin snapshots (nivel Bienvenido, 0 órdenes)
on conflict (seller_id, month_date) do nothing;
