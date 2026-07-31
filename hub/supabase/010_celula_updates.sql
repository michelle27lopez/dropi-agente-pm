-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Updates Semanales de Célula · Supplier Success
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS celula_updates (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  week_date   date        NOT NULL,
  title       text        NOT NULL,
  content     text        NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (week_date)
);
