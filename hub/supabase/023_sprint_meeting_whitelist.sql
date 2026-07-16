-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 023: Whitelist de reuniones generales por persona (sprint)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- La skill `sprint-reuniones` la usa para saber qué eventos del calendario
-- de cada persona son reuniones "generales" (recurrentes de equipo) y cuáles
-- podrían ser tiempo de un proyecto específico. Es por persona porque las
-- reuniones recurrentes de Jaime no son las mismas que las de Michelle.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sprint_meeting_whitelist (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  person_email   TEXT        NOT NULL,
  meeting_title  TEXT        NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (person_email, meeting_title)
);

ALTER TABLE sprint_meeting_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sprint_meeting_whitelist_public_read" ON sprint_meeting_whitelist FOR SELECT USING (true);
CREATE POLICY "sprint_meeting_whitelist_public_insert" ON sprint_meeting_whitelist FOR INSERT WITH CHECK (true);
CREATE POLICY "sprint_meeting_whitelist_public_delete" ON sprint_meeting_whitelist FOR DELETE USING (true);
CREATE POLICY "sprint_meeting_whitelist_service_all" ON sprint_meeting_whitelist FOR ALL TO service_role USING (true);
