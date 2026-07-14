-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 011_ttv_crm_opportunities.sql
-- Célula Supplier Success · Integración de Oportunidades del CRM GHL desde CSV
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ttv_crm_opportunities (
  id                          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id              text UNIQUE,
  contact_id                  text,
  contact_name                text,
  opportunity_name            text,
  phone                       text,
  email                       text,
  stage_name                  text,
  status                      text, -- open, won, lost, abandoned
  date_created                timestamptz,
  date_updated                timestamptz,
  tags                        text[],
  assigned_to                 text,
  sequence                    text,
  is_manual                   boolean DEFAULT false,
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now()
);

-- Índices para optimizar cruces y filtros por fecha
CREATE INDEX IF NOT EXISTS idx_ttv_crm_opps_email ON ttv_crm_opportunities (email);
CREATE INDEX IF NOT EXISTS idx_ttv_crm_opps_created ON ttv_crm_opportunities (date_created DESC);

-- Habilitar RLS
ALTER TABLE ttv_crm_opportunities ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de los registros
CREATE POLICY "ttv_crm_opportunities_public_read" ON ttv_crm_opportunities
  FOR SELECT USING (true);

-- Permitir todas las operaciones a la service_role (para el script de importación)
CREATE POLICY "ttv_crm_opportunities_service_all" ON ttv_crm_opportunities
  FOR ALL TO service_role USING (true);
