-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Following: cuarto tipo, nace de un Delivery Proyecto
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-08-04, Jaime + agente):
--   - `Following` es un valor más de `type`, mismo patrón que POC y Delivery
--     Proyecto: un registro en `projects` con `parent_project_id` apuntando
--     SIEMPRE a un Discovery project. Esto preserva la invariante de árbol
--     plano de 2 niveles (039_darwin_delivery_proyecto.sql) sin tener que
--     reescribir la lógica de children/breadcrumbs, que hoy asume que el
--     padre siempre es Discovery.
--   - La relación con el Delivery Proyecto que lo originó es un eje distinto
--     del árbol padre/hijo — igual que `related_poc_id` en Delivery Proyecto,
--     se modela con `related_delivery_id`, no reutiliza `parent_project_id`.
--     Al crear un Following desde la card de un Delivery Proyecto, el backend
--     sube un nivel (usa el `parent_project_id` del propio Delivery, que es
--     el Discovery) y guarda `related_delivery_id` = el Delivery clickeado.
--   - Estados propios (estado_interno): Beta controlada → Producción →
--     Cerrado. 'Cerrado' ya existía (reutilizado de Discovery), se agrega
--     'Beta controlada' y 'Producción'.
--   - De paso: Delivery Proyecto gana los estados 'Activo' y 'Cerrado' (ya
--     válidos en el check constraint, agregados originalmente para Discovery)
--     para marcar cuándo un delivery pasa a operar en producción o se cierra.
-- ═══════════════════════════════════════════════════════════════════════════

alter table projects drop constraint if exists projects_type_check;
alter table projects add constraint projects_type_check
  check (type in ('Idea','Oportunidad','POC','Proyecto','Delivery Proyecto','Following'));

alter table projects drop constraint if exists projects_estado_interno_check;
alter table projects add constraint projects_estado_interno_check
  check (estado_interno in (
    'Research','Ideación','Concepción de experimento','Activo','Cerrado',   -- Discovery
    'Seguimiento','En definición','En priorización',      -- POC
    'Pendiente Handoff','en DEV',                          -- Delivery Proyecto (+ Activo/Cerrado/En definición/En priorización de arriba)
    'Beta controlada','Producción'                          -- Following (+ Cerrado de arriba)
  ));

alter table projects
  add column if not exists related_delivery_id uuid references projects(id);
