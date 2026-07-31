-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 022_ascenso_ofertas
-- Célula Supplier Success · IND-001 · Ofertas de ascenso vía magic link
-- Registra el envío y respuesta (aceptar/rechazar) de la oferta de ascenso
-- que se dispara desde /proyectos/indicadores/prospectos por cada supplier
-- que ya cumple el umbral en supplier_ascenso_panel.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ascenso_ofertas (
  id                        uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  token                     text            NOT NULL UNIQUE,
  supplier_id               bigint          NOT NULL,
  supplier_name             text            NOT NULL,
  email                     text,
  nivel_actual              text            NOT NULL,   -- 'Activo' | 'Verificado'
  nivel_objetivo            text            NOT NULL,   -- 'Verificado' | 'Premium'
  ordenes_movilizadas_90d   integer,
  umbral_objetivo           integer         NOT NULL,
  estado                    text            NOT NULL DEFAULT 'enviada', -- 'enviada' | 'aceptada' | 'rechazada'
  motivo_rechazo            text,
  enviada_at                timestamptz     NOT NULL DEFAULT now(),
  respondida_at             timestamptz,
  created_at                timestamptz     NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ascenso_ofertas_supplier
  ON ascenso_ofertas (supplier_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ascenso_ofertas_token
  ON ascenso_ofertas (token);

ALTER TABLE ascenso_ofertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_read_ascenso_ofertas" ON ascenso_ofertas
  FOR SELECT USING (true);

CREATE POLICY "allow_service_all_ascenso_ofertas" ON ascenso_ofertas
  FOR ALL TO service_role USING (true);
