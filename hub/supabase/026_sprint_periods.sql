-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 026: Fechas del sprint activo + festivos, para el indicador de avance esperado
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Una fila por sprint (compartida entre Michelle y Jaime, es el mismo sprint
-- de equipo). Guarda el rango de fechas (traído de Jira, customfield_10020)
-- y los festivos colombianos dentro de ese rango (traídos del calendario
-- "Días feriados en Colombia"), para calcular "deberías ir en X% hoy" en
-- días hábiles reales, sin fines de semana ni festivos.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sprint_periods (
  sprint_label    TEXT        PRIMARY KEY,
  start_date      DATE        NOT NULL,
  end_date        DATE        NOT NULL,
  -- holiday_dates: ["2026-07-20", ...] — festivos colombianos dentro del rango
  holiday_dates   JSONB       NOT NULL DEFAULT '[]',
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sprint_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sprint_periods_public_read" ON sprint_periods FOR SELECT USING (true);
CREATE POLICY "sprint_periods_public_upsert" ON sprint_periods FOR INSERT WITH CHECK (true);
CREATE POLICY "sprint_periods_public_update" ON sprint_periods FOR UPDATE USING (true);
CREATE POLICY "sprint_periods_service_all" ON sprint_periods FOR ALL TO service_role USING (true);
