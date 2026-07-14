-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: pm_supplier_metrics
-- Célula Supplier Success · Framework de Métricas PM
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pm_supplier_metrics (
  id              uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date     date            NOT NULL,
  country         text            NOT NULL, -- 'CO', 'EC', 'MX', 'ALL'
  metric_level    integer         NOT NULL, -- 1, 2, 3, 4 (Niveles de la pirámide)
  metric_key      text            NOT NULL, -- ej: 'gmv', 'orders', 'activation_rate'
  metric_name     text            NOT NULL, -- ej: 'GMV', 'Volumen de Órdenes'
  value_num       numeric         NOT NULL, -- Valor numérico crudo
  value_display   text            NOT NULL, -- Valor formateado para UI (ej: "$12,400", "74%")
  unit            text,                     -- Unidad (ej: "USD", "órdenes", "%")
  trend           text            CHECK (trend IN ('up', 'down', 'stable')),
  trend_value     text,                     -- Diferencia (ej: "+4%", "-2pp")
  health          text            CHECK (health IN ('good', 'warning', 'critical', 'neutral')),
  created_at      timestamptz     DEFAULT now(),

  UNIQUE (metric_date, country, metric_key)
);

-- Índice para consultas rápidas por fecha y país
CREATE INDEX IF NOT EXISTS idx_pm_metrics_date_country
  ON pm_supplier_metrics (metric_date DESC, country);

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE pm_supplier_metrics ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de las métricas
CREATE POLICY "allow_public_read_pm_metrics" ON pm_supplier_metrics
  FOR SELECT USING (true);

-- Permitir todas las operaciones a la service_role (seeder o pipelines de datos)
CREATE POLICY "allow_service_all_pm_metrics" ON pm_supplier_metrics
  FOR ALL TO service_role USING (true);
