-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 027: Prioridad de Jira en el checklist del sprint
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Espeja el campo "priority" de Jira (Highest/High/Medium/Low/Lowest) para
-- poder mostrar el ícono de prioridad y ordenar las tarjetas de /sprint por
-- ese nivel, igual que se ve en el board de Jira.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE sprint_task_checklist ADD COLUMN IF NOT EXISTS priority TEXT;
