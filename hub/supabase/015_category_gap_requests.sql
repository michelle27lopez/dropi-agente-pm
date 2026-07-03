-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 015: CAT-001 · Solicitudes de enriquecimiento de categoría
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Captura los casos donde un supplier no encontró categoría adecuada ni con
-- IA ni buscando manualmente en el árbol, para que soporte la revise y
-- decida si se agrega al árbol de dropi_categories.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS category_gap_requests (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name        TEXT        NOT NULL,
  requested_category  TEXT        NOT NULL,
  source              TEXT        NOT NULL CHECK (source IN ('ai_no_match', 'manual_no_match')),
  ai_top_suggestions  JSONB,
  status              TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'added', 'rejected')),
  reviewed_by         TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

ALTER TABLE category_gap_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "category_gap_requests_public_read" ON category_gap_requests FOR SELECT USING (true);
CREATE POLICY "category_gap_requests_public_insert" ON category_gap_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "category_gap_requests_service_all" ON category_gap_requests FOR ALL TO service_role USING (true);
