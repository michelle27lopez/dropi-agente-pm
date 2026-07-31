-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 006_add_tipo_proveedor.sql
-- Célula Supplier Success · Agregar tipo de proveedor para análisis de validación
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Agregar columna de tipo de proveedor a la tabla principal
ALTER TABLE userpilot_suppliers 
  ADD COLUMN IF NOT EXISTS tipo_proveedor text;

-- Índice para optimizar consultas agregadas por tipo de proveedor
CREATE INDEX IF NOT EXISTS idx_suppliers_tipo_proveedor 
  ON userpilot_suppliers (tipo_proveedor)
  WHERE tipo_proveedor IS NOT NULL;
