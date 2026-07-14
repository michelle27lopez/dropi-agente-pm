-- ═══════════════════════════════════════════════════════════════
-- RESET: Limpiar campañas antiguas y resembrar con flujo v2
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Borrar nodos y campañas existentes del proyecto DCA-001
DELETE FROM campaign_nodes
WHERE campaign_id IN (
  SELECT id FROM campaigns
  WHERE project_id = 'd64b428a-3c99-412f-8100-53e07bd20ed8'
);

DELETE FROM campaigns
WHERE project_id = 'd64b428a-3c99-412f-8100-53e07bd20ed8';
