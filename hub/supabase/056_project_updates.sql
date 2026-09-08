-- ═══════════════════════════════════════════════════════════════════════════
-- Historial de "Weekly de Producto" a nivel de proyecto individual.
-- Pedido de José (Growth, 4-sep-2026): la weekly de célula (celula_updates)
-- agrupa todos los proyectos en un solo texto semanal, pero cada ficha
-- (/proyectos/gro-0XX) también necesita su propio histórico independiente,
-- consultable con su propio botón "Weekly de Producto" en la ficha.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists project_updates (
  id          uuid        default gen_random_uuid() primary key,
  project_id  uuid        not null references projects(id) on delete cascade,
  week_date   date        not null,
  title       text        not null,
  content     text        not null,
  created_at  timestamptz default now(),
  unique (project_id, week_date)
);

create index if not exists project_updates_project_id_idx on project_updates(project_id);
