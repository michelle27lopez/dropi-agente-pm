-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 040: Calendario de proyectos (reemplaza la sección "Documentación"
-- del menú, que quedó como placeholder sin uso)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Registra hitos importantes de los proyectos del hub: lanzamientos, handoffs
-- y otros hitos que el equipo quiera dejar marcados en una fecha concreta.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS calendar_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  event_type   TEXT        NOT NULL CHECK (event_type IN ('lanzamiento', 'handoff', 'otro')),
  event_date   DATE        NOT NULL,
  project_code TEXT,
  project_name TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON calendar_events (event_date);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calendar_events_public_read" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "calendar_events_service_all" ON calendar_events FOR ALL TO service_role USING (true);
