-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Núcleo de datos compartido multi-célula
-- PROPUESTA PARA VALIDAR — no ejecutar hasta revisión
--
-- Decisiones de diseño (2026-07-08):
--   - `type` (Idea/Oportunidad/POC/Proyecto) y `handoff_status` son campos
--     separados del `status` operativo que ya existe en `projects`.
--   - Ownership por célula: tabla `celulas` real + FK, no texto libre.
--   - Enforcement por convención + code review, NO RLS todavía (la app usa
--     SUPABASE_SERVICE_KEY, que bypassa RLS de cualquier forma). Revisar esta
--     decisión si el número de células/escritores crece.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Células ─────────────────────────────────────────────────────────────
create table if not exists celulas (
  id         uuid primary key default gen_random_uuid(),
  nombre     text unique not null,
  lead       text,
  area       text,
  created_at timestamptz default now()
);

insert into celulas (nombre, lead, area)
values ('Supplier Success', 'Jaime Guevara', 'Catálogo de productos')
on conflict (nombre) do nothing;

-- Cada célula que se sume a Darwin agrega su propia fila aquí.

-- 2. Extender `projects` con tipo, handoff y ownership ──────────────────
alter table projects
  add column if not exists type text
    check (type in ('Idea','Oportunidad','POC','Proyecto')),
  add column if not exists handoff_status text
    check (handoff_status in ('Experimentación','Listo para handoff','Handoff hecho'))
    default 'Experimentación',
  add column if not exists celula_owner_id uuid references celulas(id);

-- Backfill: todo lo existente hoy pertenece a Supplier Success.
update projects
set celula_owner_id = (select id from celulas where nombre = 'Supplier Success')
where celula_owner_id is null;

-- 3. Updates semanales por célula (extender tabla existente) ────────────
alter table celula_updates
  add column if not exists celula_id uuid references celulas(id);

update celula_updates
set celula_id = (select id from celulas where nombre = 'Supplier Success')
where celula_id is null;

-- 4. Roadmap por célula (no existía como tabla — era página estática) ──
create table if not exists roadmap_items (
  id           uuid primary key default gen_random_uuid(),
  celula_id    uuid references celulas(id) not null,
  title        text not null,
  description  text,
  quarter      text, -- ej. 'Q3 2026'
  status       text check (status in ('Planeado','En curso','Hecho','Movido')) default 'Planeado',
  target_date  date,
  created_at   timestamptz default now()
);
