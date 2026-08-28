-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Fechas de un Delivery Proyecto: inicio de dev + entrega propuesta
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-08-28, Jaime + agente):
--   - Dos columnas nuevas en `projects`, mismo criterio que `prioridad` /
--     `estado_interno` / `vpv`: son 1:1 con el Delivery Proyecto, no ameritan
--     tabla aparte.
--   - `fecha_inicio_dev`: cuándo el Delivery entró a desarrollo. El PATCH de
--     /api/proyectos/[id] la autollena con la fecha de hoy la primera vez que
--     `estado_interno` pasa a 'en DEV' (si estaba NULL). Queda editable a
--     mano después — no hay trigger en la BD, el autofill vive en la API
--     igual que todo lo demás en Darwin.
--   - `fecha_entrega_propuesta`: la fecha que da desarrollo. Siempre manual.
--   - Sin cambios de RLS: `projects` ya está cerrada a escritura directa
--     (019_darwin_rls.sql), todo update pasa por las API routes con
--     SUPABASE_SERVICE_KEY. Las columnas nuevas se leen con las políticas de
--     SELECT que ya existen.
-- ═══════════════════════════════════════════════════════════════════════════

alter table projects
  add column if not exists fecha_inicio_dev date,
  add column if not exists fecha_entrega_propuesta date;
