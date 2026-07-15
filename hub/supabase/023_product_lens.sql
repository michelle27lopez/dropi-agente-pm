-- ═══════════════════════════════════════════════════════════════════════════
-- PRODUCT LENS — Tablas para Discovery (Metodología B=MAP)
-- ═══════════════════════════════════════════════════════════════════════════

-- Limpieza preventiva de tablas creadas a medias
DROP TABLE IF EXISTS discovery_decisions;
DROP TABLE IF EXISTS discovery_patterns;
DROP TABLE IF EXISTS discovery_cycles;

-- 1. Cycles (Ciclos de Discovery) ───────────────────────────────────────────
CREATE TABLE discovery_cycles (
  id           TEXT PRIMARY KEY,
  project_id   TEXT, -- Asocia el ciclo con un proyecto específico del Hub
  title        TEXT NOT NULL,
  estado       TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'cerrado')),
  fase_actual  TEXT DEFAULT 'F0' CHECK (fase_actual IN ('F0', 'F1', 'F2', 'F3', 'F4', 'F5')),
  causa        TEXT CHECK (causa IN ('M', 'A', 'P', NULL)),
  sub_perfil   TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now(),
  created_at   TIMESTAMPTZ DEFAULT now(),
  data         JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_discovery_cycles_project_id ON discovery_cycles(project_id);
CREATE INDEX IF NOT EXISTS idx_discovery_cycles_estado ON discovery_cycles(estado);

-- 2. Patterns (Biblioteca de Patrones) ──────────────────────────────────────
CREATE TABLE discovery_patterns (
  id         TEXT PRIMARY KEY,
  tipo       TEXT CHECK (tipo IN ('patron', 'anti_patron')),
  causa      TEXT CHECK (causa IN ('M', 'A', 'P')),
  sub_perfil TEXT,
  transicion TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  data       JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_discovery_patterns_causa_sub ON discovery_patterns(causa, sub_perfil);

-- 3. Decisions (Ledger Durable de Decisiones) ───────────────────────────────
CREATE TABLE discovery_decisions (
  id         TEXT PRIMARY KEY,
  cycle_id   TEXT REFERENCES discovery_cycles(id) ON DELETE SET NULL,
  fecha      TIMESTAMPTZ DEFAULT now(),
  tipo       TEXT NOT NULL, -- ej. 'aprendizaje', 'cierre'
  causa      TEXT,
  sub_perfil TEXT,
  texto      TEXT NOT NULL,
  actor      TEXT, -- Correo del PM que registró la decisión
  data       JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_discovery_decisions_cycle_id ON discovery_decisions(cycle_id);
