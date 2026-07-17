-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 025: Horas de reuniones en el dashboard de sprint
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Permite que la fila de la tarea "Reuniones" (la que calcula la skill
-- sprint-reuniones) se muestre en el mismo dashboard /sprint que las tareas
-- de documentación, en vez de vivir en un sistema aparte.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE sprint_task_checklist ADD COLUMN IF NOT EXISTS is_meetings_task BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE sprint_task_checklist ADD COLUMN IF NOT EXISTS hours_estimate NUMERIC;
-- hours_breakdown: [{ "title": "Weekly suppliers", "hours": 1 }, ...]
ALTER TABLE sprint_task_checklist ADD COLUMN IF NOT EXISTS hours_breakdown JSONB NOT NULL DEFAULT '[]';
