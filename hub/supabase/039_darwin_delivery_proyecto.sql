-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Delivery Proyecto: tercer tipo bajo Discovery project
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-07-29, Jaime + agente):
--   - `Delivery Proyecto` es un valor más de `type`, mismo patrón que POC:
--     un registro en `projects` con `parent_project_id` apuntando SIEMPRE a
--     un Discovery project (type != 'POC' y != 'Delivery Proyecto').
--   - La relación con un POC es opcional y es un eje distinto del árbol
--     padre/hijo — se modela con `related_poc_id`, no reutiliza
--     `parent_project_id` (que ya está tomado por la relación obligatoria
--     con el Discovery project).
--   - Estados propios (estado_interno): En definición → En priorización →
--     Pendiente Handoff → en DEV. 'En definición' y 'En priorización' ya
--     existían para POC (036_discovery_poc_estados.sql) — se reutilizan,
--     no se duplican en el check constraint.
--   - Libre elección igual que estado_interno de Discovery/POC: no es una
--     máquina de estados secuencial obligatoria.
-- ═══════════════════════════════════════════════════════════════════════════

alter table projects drop constraint if exists projects_type_check;
alter table projects add constraint projects_type_check
  check (type in ('Idea','Oportunidad','POC','Proyecto','Delivery Proyecto'));

alter table projects drop constraint if exists projects_estado_interno_check;
alter table projects add constraint projects_estado_interno_check
  check (estado_interno in (
    'Research','Ideación','Concepción de experimento','Activo','Cerrado',   -- Discovery
    'Seguimiento','En definición','En priorización',      -- POC
    'Pendiente Handoff','en DEV'                          -- Delivery Proyecto (+ En definición/En priorización de arriba)
  ));

alter table projects
  add column if not exists related_poc_id uuid references projects(id);
