-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 045: DCA-001 · Clics del botón "Agendarme" en WhatsApp
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de Jaime, fwwkesboxlbmimzyoztq)
--
-- El mensaje de WhatsApp de reprogramación de Cyber Days (Meet del 20/08)
-- trae un botón "Agendarme" que redirige por /c/[token]?meet=1 directo a
-- Google Calendar. Ese clic se cuenta aparte de meet_click_count (043),
-- que es del botón "Agéndate" de adentro del panel — así se puede comparar
-- cuántos agendaron desde cada canal.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE campaign_planeacion_eligible
  ADD COLUMN IF NOT EXISTS meet_rsvp_click_count      INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meet_rsvp_first_clicked_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meet_rsvp_last_clicked_at   TIMESTAMPTZ;
