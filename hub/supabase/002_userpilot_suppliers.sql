-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: userpilot_suppliers
-- Célula Supplier Success · Análisis de Comportamiento
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS userpilot_suppliers (
  user_id             text PRIMARY KEY,
  name                text,
  email               text,
  first_seen          timestamptz,
  signed_up           timestamptz,
  last_seen           timestamptz,
  web_sessions        integer,
  country             text,
  device_type         text,
  browser_language    text,
  browser             text,
  os                  text,
  role                text,
  phone               text,
  verified            boolean,
  billing_information boolean,
  created_at          timestamptz DEFAULT now()
);

-- Índices para optimizar consultas de comportamiento
CREATE INDEX IF NOT EXISTS idx_suppliers_signed_up 
  ON userpilot_suppliers (signed_up DESC);

CREATE INDEX IF NOT EXISTS idx_suppliers_country 
  ON userpilot_suppliers (country);

-- Habilitar RLS
ALTER TABLE userpilot_suppliers ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de los registros
CREATE POLICY "allow_public_read_suppliers" ON userpilot_suppliers
  FOR SELECT USING (true);

-- Permitir todas las operaciones a la service_role (para el script de importación)
CREATE POLICY "allow_service_all_suppliers" ON userpilot_suppliers
  FOR ALL TO service_role USING (true);
