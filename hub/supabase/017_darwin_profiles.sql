-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Perfiles, roles y células reales
-- Depende de 016_darwin_core.sql (tabla `celulas` debe existir)
--
-- Decisiones (2026-07-08):
--   - Tres células confirmadas por Jaime: Suppliers, Sellers, Brands.
--   - `Supplier Success` (sembrada en 016) se renombra a `Suppliers` para
--     quedar en el mismo esquema de nombres que Sellers/Brands.
--   - `profiles` conecta auth.users -> célula + rol. `is_super_admin` es hoy
--     una distinción de aplicación, no de RLS (mismo criterio de 016: sin
--     RLS todavía, la app corre con SUPABASE_SERVICE_KEY).
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Alinear nombres de células ──────────────────────────────────────────
update celulas set nombre = 'Suppliers' where nombre = 'Supplier Success';

insert into celulas (nombre, lead, area)
values
  ('Sellers', 'Juan Diego', null),
  ('Brands', 'Kate', null)
on conflict (nombre) do nothing;

-- 2. Perfiles ────────────────────────────────────────────────────────────
create table if not exists profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text unique not null,
  nombre         text,
  celula_id      uuid references celulas(id),
  is_super_admin boolean default false,
  created_at     timestamptz default now()
);

-- Jaime como super admin, célula Suppliers.
insert into profiles (id, email, nombre, celula_id, is_super_admin)
select
  u.id,
  u.email,
  'Jaime Guevara',
  (select id from celulas where nombre = 'Suppliers'),
  true
from auth.users u
where u.email = 'jaime.guevara@dropi.co'
on conflict (id) do update set
  celula_id      = excluded.celula_id,
  is_super_admin = true;
