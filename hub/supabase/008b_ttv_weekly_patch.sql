-- ═══════════════════════════════════════════════════════════════════════════
-- PATCH 008b: Completa las semanas faltantes en ttv_weekly_data
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Safe: ON CONFLICT DO NOTHING no rompe filas existentes
-- ═══════════════════════════════════════════════════════════════════════════

-- Verificar estado actual antes de correr
-- SELECT month_number, week_number FROM ttv_weekly_data ORDER BY 1, 2;

INSERT INTO ttv_weekly_data (month_number, week_number, contactos_meta, auditados_meta, listos_meta)
VALUES
  -- Mes 1 (C=294, A=157, L=104)
  (1, 1, 73, 39, 26),
  (1, 2, 74, 39, 26),
  (1, 3, 73, 40, 26),
  (1, 4, 74, 39, 26),
  -- Mes 2 (C=293, A=157, L=103)
  (2, 1, 73, 39, 26),
  (2, 2, 74, 39, 26),
  (2, 3, 73, 40, 26),
  (2, 4, 73, 39, 25),
  -- Mes 3 (C=293, A=157, L=103)
  (3, 1, 73, 39, 26),
  (3, 2, 74, 39, 26),
  (3, 3, 73, 40, 26),
  (3, 4, 73, 39, 25),
  -- Mes 4 (C=294, A=157, L=104)
  (4, 1, 73, 39, 26),
  (4, 2, 74, 39, 26),
  (4, 3, 73, 40, 26),
  (4, 4, 74, 39, 26),
  -- Mes 5 (C=293, A=156, L=103)
  (5, 1, 73, 39, 26),
  (5, 2, 74, 39, 26),
  (5, 3, 73, 39, 26),
  (5, 4, 73, 39, 25),
  -- Mes 6 (C=293, A=156, L=103)
  (6, 1, 73, 39, 26),
  (6, 2, 74, 39, 26),
  (6, 3, 73, 39, 26),
  (6, 4, 73, 39, 25)
ON CONFLICT (month_number, week_number) DO NOTHING;

-- Verificar resultado: debe mostrar 24 filas (6 meses × 4 semanas)
SELECT month_number, week_number, contactos_meta, auditados_meta, listos_meta
FROM ttv_weekly_data
ORDER BY month_number, week_number;
