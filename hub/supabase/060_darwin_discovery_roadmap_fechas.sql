-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Fechas objetivo de un proyecto en Discovery (Product Roadmap)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-09-08, Head de Producto + agente):
--   - Un Delivery Proyecto ya tiene un pipeline de 4 fechas (053/055_*.sql)
--     y el Roadmap/Gantt de /delivery las dibuja. Un proyecto en Discovery
--     (type Idea/Oportunidad/Proyecto/POC, estado_interno Research/Ideación/
--     Concepción de experimento/Seguimiento/…) NO tenía ninguna fecha, así
--     que no había forma de armar un Product Roadmap con horizonte temporal.
--   - Se agregan 2 fechas objetivo, 1:1 con el proyecto (mismo criterio que
--     el pipeline de delivery — columnas en `projects`, no tabla aparte):
--       * fecha_objetivo_experimento — cuándo se espera tener corriendo el
--         experimento / validación del supuesto más riesgoso.
--       * fecha_objetivo_decision    — cuándo se espera decidir
--         escalar / matar / iterar (fin del ciclo de discovery).
--   - `fechas_discovery_confirmadas` (bool, default false): mientras esté en
--     false son fechas TENTATIVAS puestas por la célula; se marca true
--     cuando el equipo las da por firmes. El Product Roadmap las pinta
--     distinto (tentativa vs confirmada), igual que el Delivery Roadmap
--     distingue el hito ◆ de handoff tentativo de la barra de dev.
--   - Edición: PATCH /api/proyectos/[slug] (requireCelulaMember) — se suman
--     al set de campos permitidos y al `project_changelog` (auditoría, una
--     fila por campo que cambia), igual que las fechas de delivery.
--   - Sin cambios de RLS: `projects` está cerrada a escritura directa
--     (019_darwin_rls.sql), todo update pasa por las API routes.
-- ═══════════════════════════════════════════════════════════════════════════

alter table projects
  add column if not exists fecha_objetivo_experimento   date,
  add column if not exists fecha_objetivo_decision       date,
  add column if not exists fechas_discovery_confirmadas  boolean not null default false;
