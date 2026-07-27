-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 038_ttv_piloto_fase0_nombre.sql
-- Agrega columna nombre a ttv_piloto_fase0 (se me olvidó en 037)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE ttv_piloto_fase0 ADD COLUMN IF NOT EXISTS nombre text;
