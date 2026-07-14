-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 003_add_survey_columns.sql
-- Célula Supplier Success · Cruzar Encuestas y Comportamiento
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE userpilot_suppliers 
  ADD COLUMN IF NOT EXISTS survey_role text,
  ADD COLUMN IF NOT EXISTS survey_stage text,
  ADD COLUMN IF NOT EXISTS survey_volume text,
  ADD COLUMN IF NOT EXISTS survey_purpose text,
  ADD COLUMN IF NOT EXISTS survey_brand_sales text,
  ADD COLUMN IF NOT EXISTS survey_shipping_pref text,
  ADD COLUMN IF NOT EXISTS survey_sell_pref text,
  ADD COLUMN IF NOT EXISTS survey_source text;

-- Índices para optimizar filtros y búsquedas por campos de la encuesta
CREATE INDEX IF NOT EXISTS idx_suppliers_survey_role ON userpilot_suppliers (survey_role);
CREATE INDEX IF NOT EXISTS idx_suppliers_survey_source ON userpilot_suppliers (survey_source);
CREATE INDEX IF NOT EXISTS idx_suppliers_survey_volume ON userpilot_suppliers (survey_volume);
