-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Jerarquía Discovery project → POC + estados internos editables
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-07-24, Jaime + agente):
--   - Un POC nace SIEMPRE dentro de un Discovery project (proyecto con
--     type != 'POC'). Se modela como un registro nuevo en `projects` con
--     `parent_project_id` apuntando al proyecto padre — no como conversión
--     del registro existente.
--   - `estado_interno` es de libre elección (no secuencial, no es una
--     máquina de estados): el PM puede moverlo a cualquiera de los 3 valores
--     válidos para su `type` en cualquier momento.
--   - `vpv` (Valor Potencial Validado) es un dato manual por ahora — la
--     fórmula de cálculo se define después.
--   - Sin cambios de RLS: `projects` ya quedó cerrada a escritura directa en
--     019_darwin_rls.sql (solo lectura para `authenticated`), todo insert/
--     update sigue pasando por las API routes con SUPABASE_SERVICE_KEY.
-- ═══════════════════════════════════════════════════════════════════════════

alter table projects
  add column if not exists parent_project_id uuid references projects(id),
  add column if not exists estado_interno text
    check (estado_interno in (
      'Research','Ideación','Concepción de experimento',   -- estados de Discovery
      'Seguimiento','En definición','En priorización'       -- estados de POC
    )),
  add column if not exists vpv numeric;
