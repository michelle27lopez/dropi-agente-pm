-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 028: Comentario único de documentación por tarea en Jira
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Guarda el id del comentario de Jira donde se publica la documentación de
-- cada tarea, para que la skill sprint-checklist lo actualice en el mismo
-- lugar en vez de crear un comentario nuevo cada vez que se sincroniza.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE sprint_task_checklist ADD COLUMN IF NOT EXISTS jira_comment_id TEXT;
