-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 013_ttv_segment_keys.sql
-- Célula Supplier Success · Agregar columnas de segmento a las tablas de TTV
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE ttv_userpilot_cohort ADD COLUMN IF NOT EXISTS segment_key text;
ALTER TABLE ttv_crm_opportunities ADD COLUMN IF NOT EXISTS segment_key text;
