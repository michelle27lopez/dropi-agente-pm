-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 043: DCA-001 · Tab "Seguimiento" comercial (clic/asistencia al
-- Meet + órdenes generadas por producto)
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de Jaime, fwwkesboxlbmimzyoztq)
--
-- Michelle pidió un panel de seguimiento por campaña para el equipo comercial:
-- quién hizo clic, cuántas veces, si asistió al Meet, si ya postuló, qué
-- productos eligió y cuántas órdenes generó cada uno. Las columnas de clic/
-- postulación/productos ya existían en campaign_planeacion_eligible (029) —
-- esta migración agrega solo lo que faltaba: asistencia al Meet y órdenes
-- por producto (mismo patrón jsonb/RLS que 029).
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE campaign_planeacion_eligible
  ADD COLUMN IF NOT EXISTS meet_click_count      INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meet_first_clicked_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meet_last_clicked_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meet_attended          BOOLEAN     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS meet_attended_marked_at TIMESTAMPTZ;

-- Órdenes generadas por producto dentro de una campaña. `source` distingue
-- una carga manual (un número a la vez) de un import de CSV (reemplaza el
-- valor completo) — no cambia cómo se lee, solo ayuda a auditar de dónde
-- salió el último número si alguien pregunta.
CREATE TABLE IF NOT EXISTS campaign_planeacion_product_orders (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   UUID        NOT NULL REFERENCES campaigns_planeacion(id) ON DELETE CASCADE,
  product_id    TEXT        NOT NULL,
  product_name  TEXT,
  orders_count  INTEGER     NOT NULL DEFAULT 0,
  source        TEXT        NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'import')),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_planeacion_product_orders_campaign_id ON campaign_planeacion_product_orders(campaign_id);

ALTER TABLE campaign_planeacion_product_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaign_planeacion_product_orders_service_all" ON campaign_planeacion_product_orders FOR ALL TO service_role USING (true);
