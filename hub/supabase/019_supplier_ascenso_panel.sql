-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 019_supplier_ascenso_panel
-- Célula Supplier Success · IND-001 · Prospectos de ascenso de nivel
-- Snapshot de proveedores operativos evaluados contra el umbral de órdenes
-- movilizadas/90d para avanzar de nivel (Activo→Verificado, Verificado→Premium).
-- Se reemplaza por completo en cada corrida de seed_prospectos_ascenso.py
-- (upsert + limpieza de filas que ya no vienen en el CSV más reciente).
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS supplier_ascenso_panel (
  supplier_id               bigint          PRIMARY KEY,
  supplier_name             text            NOT NULL,
  email                     text,
  nivel_actual              text            NOT NULL,   -- 'Activo' | 'Verificado'
  nivel_objetivo            text            NOT NULL,   -- 'Verificado' | 'Premium'
  ordenes_movilizadas_90d   integer,
  umbral_objetivo           integer         NOT NULL,   -- 3000 | 20000
  pct_umbral                numeric(8,4)    NOT NULL,   -- ordenes_movilizadas_90d / umbral_objetivo
  despachos_pct             numeric(6,4),
  despacho_tiempo_h         numeric(8,2),
  garantias_recibidas_90d   integer,
  garantias_gestion_pct     numeric(6,4),
  garantias_tiempo_h        numeric(8,2),
  fecha_extraccion          date            NOT NULL,
  updated_at                timestamptz     DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ascenso_panel_pct_umbral
  ON supplier_ascenso_panel (nivel_objetivo, pct_umbral DESC);

CREATE INDEX IF NOT EXISTS idx_ascenso_panel_fecha
  ON supplier_ascenso_panel (fecha_extraccion);

ALTER TABLE supplier_ascenso_panel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read_ascenso_panel" ON supplier_ascenso_panel
  FOR SELECT USING (true);

CREATE POLICY "allow_service_all_ascenso_panel" ON supplier_ascenso_panel
  FOR ALL TO service_role USING (true);
