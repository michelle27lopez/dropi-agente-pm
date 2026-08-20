-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 044: Refresh token de Google Calendar para el sync en vivo del
-- panel "Hoy" (today_meetings, ver 039_today_meetings.sql)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Reemplaza el sync "por conversación": /api/meetings/sync usa el
-- refresh_token guardado acá para llamar a la Calendar API directo desde el
-- servidor, sin pasar por un agente — ver [[project_darwin_pd_dashboard]].
-- Tabla secreta: sin policy de lectura pública, solo service_role.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS google_oauth_tokens (
  person_email  TEXT        PRIMARY KEY,
  refresh_token TEXT        NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE google_oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "google_oauth_tokens_service_all" ON google_oauth_tokens FOR ALL TO service_role USING (true);
