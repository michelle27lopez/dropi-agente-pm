-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 016: DCA-001 · Herramienta de planeación (Track A — experimento)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Tablas propias para el modelo de planeación de campañas rediseñado desde
-- cero (ver hub/src/app/proyectos/dinamicas-catalogo/planeacion/nodes.ts).
-- Deliberadamente separadas de `campaigns` / `campaign_nodes` (el modelo de
-- Jaime) para no interferir con esa reconciliación pendiente: mismo tipo de
-- forma (proyecto → campañas → nodos con data jsonb), pero node_key distinto
-- (identidad, mecanica, elegibilidad, calendario, convocatoria, vitrina,
-- handoff, resultados, decision) y sin project_id porque esta herramienta
-- vive sola, no colgada del sistema de proyectos del hub.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS campaigns_planeacion (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  current_node  INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_planeacion_nodes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID        NOT NULL REFERENCES campaigns_planeacion(id) ON DELETE CASCADE,
  node_index   INTEGER     NOT NULL,
  node_key     TEXT        NOT NULL,
  data         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  completed    BOOLEAN     NOT NULL DEFAULT false,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, node_index)
);

ALTER TABLE campaigns_planeacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_planeacion_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_planeacion_service_all" ON campaigns_planeacion FOR ALL TO service_role USING (true);
CREATE POLICY "campaign_planeacion_nodes_service_all" ON campaign_planeacion_nodes FOR ALL TO service_role USING (true);
