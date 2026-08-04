-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 039: Reuniones del día para el panel "Hoy" del home
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Sincronizado por conversación (mismo patrón que sprint_task_checklist):
-- no hay integración en vivo con Google Calendar en el hub. Cuando Michelle
-- pide "trae mis reuniones de hoy", el agente usa su conector de Calendar y
-- hace upsert acá — ver [[project_darwin_pd_dashboard]].
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS today_meetings (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  person_email TEXT        NOT NULL,
  event_date   DATE        NOT NULL,
  start_time   TIMESTAMPTZ NOT NULL,
  end_time     TIMESTAMPTZ NOT NULL,
  title        TEXT        NOT NULL,
  join_url     TEXT,
  is_personal  BOOLEAN     NOT NULL DEFAULT false,
  synced_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS today_meetings_person_date_idx ON today_meetings (person_email, event_date);

ALTER TABLE today_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "today_meetings_public_read" ON today_meetings FOR SELECT USING (true);
CREATE POLICY "today_meetings_service_all" ON today_meetings FOR ALL TO service_role USING (true);
