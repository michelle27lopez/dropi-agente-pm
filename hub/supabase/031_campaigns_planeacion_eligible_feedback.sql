-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 031: DCA-001 · Feedback de cierre ("ayúdanos a mejorar")
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de Jaime, fwwkesboxlbmimzyoztq)
--
-- En la pantalla final del wizard (fase "Cierre") el proveedor puede dejar
-- un rating 1-5 y un comentario opcional sobre cómo le fue con la campaña,
-- para tenerlo en cuenta en la siguiente. Una sola fila por proveedor
-- (jsonb, no tabla aparte) — igual patrón que ready_checklist.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE campaign_planeacion_eligible ADD COLUMN IF NOT EXISTS feedback JSONB;
