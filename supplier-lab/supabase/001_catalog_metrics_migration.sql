-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: catalog_metrics_daily
-- Supplier Success Graph · Pulso Vivo del Catálogo
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS catalog_metrics_daily (
  id              uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date   date            NOT NULL,
  node_id         text            NOT NULL,
  -- Valor numérico crudo (para comparaciones y cálculos)
  value_num       numeric,
  -- Valor formateado para mostrar en el graph (ej: "61%", "740K", "67")
  value_display   text,
  -- Unidad / etiqueta debajo del valor (ej: "de completitud promedio")
  unit            text,
  -- Dirección de tendencia respecto al período anterior
  trend           text            CHECK (trend IN ('up', 'down', 'stable')),
  -- Texto de tendencia (ej: "+5pp", "-4%", "→ estable")
  trend_value     text,
  -- Estado de salud del nodo
  health          text            CHECK (health IN ('good', 'warning', 'critical', 'neutral')),
  -- Total del catálogo en ese snapshot (denominador base)
  total_catalog   integer         DEFAULT 1000000,
  -- Desglose adicional para el panel lateral del graph (JSON libre)
  breakdown       jsonb,
  created_at      timestamptz     DEFAULT now(),

  UNIQUE (snapshot_date, node_id)
);

-- Índice para consultas por fecha
CREATE INDEX IF NOT EXISTS idx_catalog_metrics_date
  ON catalog_metrics_daily (snapshot_date DESC);

-- RLS: habilitar y permitir lectura pública (la app usa anon key)
ALTER TABLE catalog_metrics_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read" ON catalog_metrics_daily
  FOR SELECT USING (true);

-- Solo service role puede insertar/actualizar (el job diario)
CREATE POLICY "allow_service_write" ON catalog_metrics_daily
  FOR ALL USING (auth.role() = 'service_role');
