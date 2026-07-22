-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 029: DCA-001 · Suppliers y productos elegibles de Planeación
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de Jaime, fwwkesboxlbmimzyoztq)
--
-- Hasta ahora estas dos colecciones vivían solo en un JSON local en disco
-- (hub/.local-data/campaigns-planeacion.json, ver hub/src/lib/local-store-planeacion.ts)
-- porque Michelle no tenía permiso para crear tablas. Ya lo tiene (confirmado
-- corriendo 015_category_gap_requests.sql), así que esta migración completa
-- el esquema de 016_campaigns_planeacion.sql con las dos tablas que faltaban.
-- Mismo patrón: jsonb para lo que no necesita filtrarse por columna propia,
-- RLS + policy de service_role, sin project_id (esta herramienta vive sola).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS campaign_planeacion_suppliers (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   UUID        NOT NULL REFERENCES campaigns_planeacion(id) ON DELETE CASCADE,
  identifier    TEXT        NOT NULL,
  data          JSONB       NOT NULL DEFAULT '{}'::jsonb,
  status        TEXT        NOT NULL DEFAULT 'contactado' CHECK (status IN ('contactado', 'respondio', 'aplico', 'activo')),
  note          TEXT,
  contacts      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, identifier)
);

CREATE TABLE IF NOT EXISTS campaign_planeacion_eligible (
  token                  TEXT        PRIMARY KEY,
  campaign_id            UUID        NOT NULL REFERENCES campaigns_planeacion(id) ON DELETE CASCADE,
  supplier_id             TEXT        NOT NULL,
  supplier_name           TEXT        NOT NULL,
  products                JSONB       NOT NULL DEFAULT '[]'::jsonb,
  selected_product_ids    JSONB,
  submitted_at            TIMESTAMPTZ,
  selection_updated_at    TIMESTAMPTZ,
  approved_at             TIMESTAMPTZ,
  ready_checklist         JSONB,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_planeacion_eligible_campaign_id ON campaign_planeacion_eligible(campaign_id);

ALTER TABLE campaign_planeacion_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_planeacion_eligible ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_planeacion_suppliers_service_all" ON campaign_planeacion_suppliers FOR ALL TO service_role USING (true);
CREATE POLICY "campaign_planeacion_eligible_service_all" ON campaign_planeacion_eligible FOR ALL TO service_role USING (true);
