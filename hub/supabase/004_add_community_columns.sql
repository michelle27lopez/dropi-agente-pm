-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 004_add_community_columns.sql
-- Célula Supplier Success · Análisis de Comportamiento e Integración de Comunidades
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Agregar columnas de referido y comunidades a la tabla principal
ALTER TABLE userpilot_suppliers 
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS belong_to_community text,
  ADD COLUMN IF NOT EXISTS owner_of_community text;

-- Índices para optimizar consultas de cruzado y atribución de comunidades
CREATE INDEX IF NOT EXISTS idx_suppliers_referred_by 
  ON userpilot_suppliers (referred_by);

CREATE INDEX IF NOT EXISTS idx_suppliers_belong_to_community 
  ON userpilot_suppliers (belong_to_community);

CREATE INDEX IF NOT EXISTS idx_suppliers_owner_of_community 
  ON userpilot_suppliers (owner_of_community);
