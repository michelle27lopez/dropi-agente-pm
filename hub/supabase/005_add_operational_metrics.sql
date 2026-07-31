-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 005_add_operational_metrics.sql
-- Célula Supplier Success · Integración de Métricas de Operaciones Reales de Dropi (Time-to-Value)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Agregar columnas de métricas de operaciones reales de Dropi
ALTER TABLE userpilot_suppliers 
  ADD COLUMN IF NOT EXISTS fecha_activacion timestamptz,
  ADD COLUMN IF NOT EXISTS dias_en_activarse integer,
  ADD COLUMN IF NOT EXISTS es_activo_30d boolean,
  ADD COLUMN IF NOT EXISTS real_orders_delivered integer,
  ADD COLUMN IF NOT EXISTS real_products_created integer,
  ADD COLUMN IF NOT EXISTS real_dropshipper_clients integer;

-- Índices para optimizar consultas agregadas de TTV y actividad real
CREATE INDEX IF NOT EXISTS idx_suppliers_dias_en_activarse 
  ON userpilot_suppliers (dias_en_activarse) 
  WHERE dias_en_activarse IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_suppliers_es_activo_30d 
  ON userpilot_suppliers (es_activo_30d);
