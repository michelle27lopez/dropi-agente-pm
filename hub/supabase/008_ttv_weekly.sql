-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 008: TTV-001 · Seguimiento semanal por mes (S1–S4)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ttv_weekly_data (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  month_number   INT         NOT NULL CHECK (month_number BETWEEN 1 AND 6),
  week_number    INT         NOT NULL CHECK (week_number  BETWEEN 1 AND 4),
  contactos_meta INT         NOT NULL DEFAULT 0,
  contactos_real INT,
  auditados_meta INT         NOT NULL DEFAULT 0,
  auditados_real INT,
  listos_meta    INT         NOT NULL DEFAULT 0,
  listos_real    INT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (month_number, week_number)
);

ALTER TABLE ttv_weekly_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ttv_weekly_data_public_read" ON ttv_weekly_data FOR SELECT USING (true);
CREATE POLICY "ttv_weekly_data_service_all" ON ttv_weekly_data FOR ALL TO service_role USING (true);

-- ─── SEED: metas semanales (mensual ÷ 4) ────────────────────────────────────
-- Mes 1: C=294, A=157, L=104
-- Mes 2: C=293, A=157, L=103
-- Mes 3: C=293, A=157, L=103
-- Mes 4: C=294, A=157, L=104
-- Mes 5: C=293, A=156, L=103
-- Mes 6: C=293, A=156, L=103
INSERT INTO ttv_weekly_data (month_number, week_number, contactos_meta, auditados_meta, listos_meta) VALUES
  (1, 1, 73, 39, 26), (1, 2, 74, 39, 26), (1, 3, 73, 40, 26), (1, 4, 74, 39, 26),
  (2, 1, 73, 39, 26), (2, 2, 74, 39, 26), (2, 3, 73, 40, 26), (2, 4, 73, 39, 25),
  (3, 1, 73, 39, 26), (3, 2, 74, 39, 26), (3, 3, 73, 40, 26), (3, 4, 73, 39, 25),
  (4, 1, 73, 39, 26), (4, 2, 74, 39, 26), (4, 3, 73, 40, 26), (4, 4, 74, 39, 26),
  (5, 1, 73, 39, 26), (5, 2, 74, 39, 26), (5, 3, 73, 39, 26), (5, 4, 73, 39, 25),
  (6, 1, 73, 39, 26), (6, 2, 74, 39, 26), (6, 3, 73, 39, 26), (6, 4, 73, 39, 25)
ON CONFLICT (month_number, week_number) DO NOTHING;
