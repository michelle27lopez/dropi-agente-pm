-- ═══════════════════════════════════════════════════════════════════════════
-- BORRADOR — NO EJECUTAR todavía
-- Hipótesis del esquema de `projects` / `campaigns` / `campaign_nodes`,
-- inferida leyendo cómo el código los usa (src/app/api/campaigns/*,
-- src/app/api/proyectos/proyecto/route.ts, [id]/nodes.ts). Sigue el mismo
-- patrón que 016_campaigns_planeacion.sql (proyecto → campañas → nodos con
-- data jsonb).
--
-- Antes de correr esto: pedirle a Jaime que corra
-- 017_campaigns_schema_export_READONLY.sql en su Supabase y comparar su
-- resultado contra este archivo. Ajustar lo que no coincida (tipos de
-- columna, constraints, políticas RLS) antes de ejecutar en el Supabase
-- donde vaya a operarse la campaña real.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS projects (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code  TEXT,
  name          TEXT        NOT NULL,
  status        TEXT,
  summary       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fila del proyecto DCA-001 — el id es el mismo que usan las rutas de la API,
-- hardcodeado en el código (PROJECT_ID en src/app/api/campaigns/route.ts).
INSERT INTO projects (id, project_code, name, status, summary)
VALUES (
  'd64b428a-3c99-412f-8100-53e07bd20ed8',
  'DCA-001',
  'Dinámicas de Catálogo',
  'in_progress',
  'Campañas curadas para activar catálogo quieto y suppliers sin órdenes.'
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS campaigns (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID        NOT NULL REFERENCES projects(id),
  name          TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  current_node  INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_nodes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID        NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  node_index   INTEGER     NOT NULL,
  node_key     TEXT        NOT NULL,
  data         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  completed    BOOLEAN     NOT NULL DEFAULT false,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, node_index)
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_service_all" ON projects FOR ALL TO service_role USING (true);
CREATE POLICY "campaigns_service_all" ON campaigns FOR ALL TO service_role USING (true);
CREATE POLICY "campaign_nodes_service_all" ON campaign_nodes FOR ALL TO service_role USING (true);
