-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 012_ttv_userpilot_cohort.sql
-- Célula Supplier Success · Tabla para la cohorte aislada de Userpilot desde CSV
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ttv_userpilot_cohort (
  user_id                     text PRIMARY KEY,
  name                        text,
  email                       text,
  signed_up                   timestamptz,
  phone                       text,
  country                     text,
  created_at                  timestamptz DEFAULT now()
);

-- Índices para optimizar cruces y filtros por fecha
CREATE INDEX IF NOT EXISTS idx_ttv_up_cohort_email ON ttv_userpilot_cohort (email);
CREATE INDEX IF NOT EXISTS idx_ttv_up_cohort_signed ON ttv_userpilot_cohort (signed_up DESC);

-- Habilitar RLS
ALTER TABLE ttv_userpilot_cohort ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de los registros
CREATE POLICY "ttv_userpilot_cohort_public_read" ON ttv_userpilot_cohort
  FOR SELECT USING (true);

-- Permitir todas las operaciones a la service_role (para el script de importación)
CREATE POLICY "ttv_userpilot_cohort_service_all" ON ttv_userpilot_cohort
  FOR ALL TO service_role USING (true);
