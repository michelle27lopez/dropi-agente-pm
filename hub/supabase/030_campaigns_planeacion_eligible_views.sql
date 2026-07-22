-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 030: DCA-001 · Conteo de visitas al link de productos elegibles
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de Jaime, fwwkesboxlbmimzyoztq)
--
-- Kate quiere saber cuántas veces entró cada proveedor a su link de
-- postulación (el de /elegibles/[token]) — se incrementa en cada GET real de
-- esa página pública, no en los fetches internos que hacen otros endpoints
-- (seleccion/checklist/aprobar) al leer la misma fila.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE campaign_planeacion_eligible ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE campaign_planeacion_eligible ADD COLUMN IF NOT EXISTS first_viewed_at TIMESTAMPTZ;
ALTER TABLE campaign_planeacion_eligible ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;
