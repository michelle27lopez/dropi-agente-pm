-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Research Brain
-- Cerebro de research de producto para Supplier Success / Dropi
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Prerequisito: habilitar extensión pgvector en Extensions del dashboard
-- ═══════════════════════════════════════════════════════════════════════════

-- pgvector: necesario para búsqueda semántica con embeddings
-- Si falla, habilitarlo primero en: Supabase Dashboard → Database → Extensions → vector
CREATE EXTENSION IF NOT EXISTS vector;

-- ─────────────────────────────────────────────────────────────────────────────
-- research_documents: entrada principal de cada research
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research_documents (
  id                    uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  code                  text          UNIQUE NOT NULL,          -- ej: "RB-001"
  title                 text          NOT NULL,
  research_date         date,
  initiative_related    text,                                   -- texto libre, ej: "Creativos para Vendors"
  user_segment          text,                                   -- ej: "Dropshippers avanzados"
  journey_stage         text,                                   -- ej: "Activación → Crecimiento"
  problem_investigated  text,
  research_questions    text[],
  methodology           text,                                   -- cómo se recopiló (entrevistas, benchmark, etc.)
  raw_source_type       text          CHECK (raw_source_type IN
                          ('transcripcion', 'resumen', 'notas', 'figjam', 'documento', 'otro')),
  confidence_level      text          CHECK (confidence_level IN
                          ('alto', 'medio', 'bajo', 'exploratorio'))
                          DEFAULT 'medio',
  tags                  text[],
  created_at            timestamptz   DEFAULT now(),
  updated_at            timestamptz   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_docs_tags
  ON research_documents USING gin (tags);

CREATE INDEX IF NOT EXISTS idx_research_docs_date
  ON research_documents (research_date DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- research_chunks: fragmentos de texto para búsqueda semántica
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research_chunks (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id   uuid          NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,
  chunk_index   integer       NOT NULL,
  content       text          NOT NULL,
  embedding     vector(1536),                                   -- OpenAI text-embedding-3-small
  metadata      jsonb,                                          -- ej: {section: "dolores", source_person: "Juan Felipe"}
  created_at    timestamptz   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_chunks_doc
  ON research_chunks (document_id);

-- Índice hnsw para búsqueda aproximada por coseno (se activa cuando haya datos)
-- CREATE INDEX ON research_chunks USING hnsw (embedding vector_cosine_ops);

-- ─────────────────────────────────────────────────────────────────────────────
-- research_insights: insights estructurados por tipo
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research_insights (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id     uuid          NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,
  insight_type    text          NOT NULL CHECK (insight_type IN (
                    'dolor',
                    'oportunidad',
                    'hipotesis_validada',
                    'hipotesis_descartada',
                    'evidencia',
                    'cita',
                    'metrica',
                    'hallazgo_principal'
                  )),
  content         text          NOT NULL,
  source_person   text,                                         -- quién lo dijo (si es entrevista)
  confidence      text          CHECK (confidence IN ('alta', 'media', 'baja')),
  tags            text[],
  created_at      timestamptz   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_insights_doc
  ON research_insights (document_id);

CREATE INDEX IF NOT EXISTS idx_research_insights_type
  ON research_insights (insight_type);

CREATE INDEX IF NOT EXISTS idx_research_insights_tags
  ON research_insights USING gin (tags);

-- ─────────────────────────────────────────────────────────────────────────────
-- research_sources: links, referencias, documentos externos
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research_sources (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id   uuid          NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,
  source_type   text          CHECK (source_type IN
                  ('entrevista', 'benchmark', 'documento', 'link', 'nota_interna', 'otro')),
  label         text,
  url           text,
  notes         text,
  created_at    timestamptz   DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- research_related_items: vínculos con iniciativas, features, hipótesis, nodos
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research_related_items (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id     uuid          NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,
  item_type       text          NOT NULL CHECK (item_type IN (
                    'iniciativa', 'feature', 'hipotesis', 'proyecto',
                    'journey_node', 'hu', 'oportunidad_setboard'
                  )),
  item_code       text,                                         -- ej: "C-01", "negociaciones"
  item_name       text,
  relation_note   text,
  created_at      timestamptz   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_related_doc
  ON research_related_items (document_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS: lectura pública, escritura por service role
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE research_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_chunks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_insights      ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sources       ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_related_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read" ON research_documents     FOR SELECT USING (true);
CREATE POLICY "allow_public_read" ON research_chunks        FOR SELECT USING (true);
CREATE POLICY "allow_public_read" ON research_insights      FOR SELECT USING (true);
CREATE POLICY "allow_public_read" ON research_sources       FOR SELECT USING (true);
CREATE POLICY "allow_public_read" ON research_related_items FOR SELECT USING (true);

CREATE POLICY "allow_service_write" ON research_documents     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "allow_service_write" ON research_chunks        FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "allow_service_write" ON research_insights      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "allow_service_write" ON research_sources       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "allow_service_write" ON research_related_items FOR ALL USING (auth.role() = 'service_role');
