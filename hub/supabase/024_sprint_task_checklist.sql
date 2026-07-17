-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 024: Checklist de documentación de tareas del sprint
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Espejo local (no fuente de verdad) del estado de documentación de cada
-- tarea de Jira del sprint activo — Objetivo/Qué se hizo/Hallazgos/Links,
-- o el checklist propio del tipo de tarea (ej. Escenarios/Documentación/
-- Alineación IA). La página /sprint del hub lee y edita esto directamente;
-- el contenido solo se sube a Jira cuando la persona se lo pide a Claude
-- (mismo principio de confirmación que `bug-jira` y `sprint-reuniones`).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sprint_task_checklist (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  jira_key            TEXT        NOT NULL UNIQUE,
  jira_url            TEXT        NOT NULL,
  person_email        TEXT        NOT NULL,
  summary             TEXT        NOT NULL,
  jira_status         TEXT,
  sprint_label        TEXT,
  -- sections: [{ "name": "Alineación IA", "status": "hecho"|"en_curso"|"pendiente", "notes": "..." }, ...]
  sections            JSONB       NOT NULL DEFAULT '[]',
  links               JSONB       NOT NULL DEFAULT '[]',
  last_synced_to_jira_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sprint_task_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sprint_task_checklist_public_read" ON sprint_task_checklist FOR SELECT USING (true);
CREATE POLICY "sprint_task_checklist_public_upsert" ON sprint_task_checklist FOR INSERT WITH CHECK (true);
CREATE POLICY "sprint_task_checklist_public_update" ON sprint_task_checklist FOR UPDATE USING (true);
CREATE POLICY "sprint_task_checklist_service_all" ON sprint_task_checklist FOR ALL TO service_role USING (true);
