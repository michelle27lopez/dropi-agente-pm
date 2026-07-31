-- Migration: Google Product Taxonomy + Dropi Categories + Homologation Mapping
-- CAT-001 · Categorización y Enriquecimiento de Catálogo Dropi
-- Apply via Supabase SQL Editor

-- ─────────────────────────────────────────────
-- 1. Google Product Taxonomy (fuente oficial)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS google_product_taxonomy (
  id                  SERIAL PRIMARY KEY,
  google_category_id  VARCHAR(50) NOT NULL UNIQUE,
  google_category_path TEXT NOT NULL,
  level_1             TEXT,
  level_2             TEXT,
  level_3             TEXT,
  level_4             TEXT,
  level_5             TEXT,
  level_6             TEXT,
  level_7             TEXT,
  depth               INTEGER,
  is_active           BOOLEAN DEFAULT TRUE,
  source_url          TEXT,
  imported_at         TIMESTAMPTZ DEFAULT NOW(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_google_taxonomy_level_1 ON google_product_taxonomy(level_1);
CREATE INDEX IF NOT EXISTS idx_google_taxonomy_depth   ON google_product_taxonomy(depth);

-- ─────────────────────────────────────────────
-- 2. Dropi Categories (taxonomía canónica L1-L4)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dropi_categories (
  id                  SERIAL PRIMARY KEY,
  dropi_category_id   VARCHAR(100) NOT NULL UNIQUE,
  dropi_category_path TEXT NOT NULL,
  level_1             TEXT,
  level_2             TEXT,
  level_3             TEXT,
  level_4             TEXT,
  depth               INTEGER,
  status              VARCHAR(50) DEFAULT 'active',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dropi_categories_level_1 ON dropi_categories(level_1);
CREATE INDEX IF NOT EXISTS idx_dropi_categories_status  ON dropi_categories(status);

-- ─────────────────────────────────────────────
-- 3. Tabla pivote: Dropi ↔ Google Mapping
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dropi_google_category_mapping (
  id                    SERIAL PRIMARY KEY,
  dropi_category_id     VARCHAR(100) NOT NULL,
  dropi_category_path   TEXT NOT NULL,
  google_category_id    VARCHAR(50) NOT NULL,
  google_category_path  TEXT NOT NULL,
  suggestion_rank       INTEGER DEFAULT 1,         -- 1 = mejor sugerencia, hasta 5
  match_type            VARCHAR(50) DEFAULT 'suggested'
                          CHECK (match_type IN ('auto_exact','auto_semantic','auto_fuzzy','manual','rejected')),
  confidence_score      NUMERIC(5,2),
  confidence_label      VARCHAR(50)
                          CHECK (confidence_label IN ('high','medium','low','needs_review')),
  status                VARCHAR(50) DEFAULT 'pending_review'
                          CHECK (status IN ('pending_review','approved','rejected','needs_more_context')),
  reviewed_by           VARCHAR(100),
  reviewed_at           TIMESTAMPTZ,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mapping_dropi_id      ON dropi_google_category_mapping(dropi_category_id);
CREATE INDEX IF NOT EXISTS idx_mapping_status        ON dropi_google_category_mapping(status);
CREATE INDEX IF NOT EXISTS idx_mapping_confidence    ON dropi_google_category_mapping(confidence_label);
CREATE INDEX IF NOT EXISTS idx_mapping_rank          ON dropi_google_category_mapping(suggestion_rank);

-- Constraint: un par dropi+google+rank es único
ALTER TABLE dropi_google_category_mapping
  DROP CONSTRAINT IF EXISTS uq_mapping_dropi_google_rank;
ALTER TABLE dropi_google_category_mapping
  ADD CONSTRAINT uq_mapping_dropi_google_rank
    UNIQUE (dropi_category_id, google_category_id, suggestion_rank);
