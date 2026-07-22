-- ═══════════════════════════════════════════════════════════════════════════
-- Cerrar políticas de escritura (INSERT/UPDATE/DELETE) públicas
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto fwwkesboxlbmimzyoztq)
--
-- Hallazgo (Security Advisor de Supabase, linter "rls_policy_always_true",
-- 2026-07-22): estas 4 tablas tenían políticas de escritura con
-- USING(true)/WITH CHECK(true) para el rol público — cualquiera podía
-- insertar/actualizar/borrar filas sin pasar por la app ni por ningún login.
--
-- Verificado antes de este cambio: ningún código del repo (ni las rutas
-- TypeScript de hub, ni los scripts seed_*.py) escribe estas tablas usando
-- la anon key — todos los inserts/updates que hace la app pasan por
-- hub/src/lib/supabase.ts (service key), que ignora RLS. Estas políticas
-- públicas no las necesita nada de lo existente.
--
-- No se toca jira_bug_tracking_public_insert: puede ser una integración
-- externa (posible script de Michelle) — pendiente de confirmar con ella
-- antes de cerrarla.
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "sprint_meeting_whitelist_public_delete" ON sprint_meeting_whitelist;
DROP POLICY IF EXISTS "sprint_meeting_whitelist_public_insert" ON sprint_meeting_whitelist;

DROP POLICY IF EXISTS "sprint_periods_public_update" ON sprint_periods;
DROP POLICY IF EXISTS "sprint_periods_public_upsert" ON sprint_periods;

DROP POLICY IF EXISTS "sprint_task_checklist_public_update" ON sprint_task_checklist;
DROP POLICY IF EXISTS "sprint_task_checklist_public_upsert" ON sprint_task_checklist;

DROP POLICY IF EXISTS "category_gap_requests_public_insert" ON category_gap_requests;

-- Función con search_path mutable (linter "function_search_path_mutable").
-- No se toca verify_global_password aquí — está ligada a app_settings, que
-- no aparece en ningún código de este repo; pendiente de identificar antes
-- de tocarla.
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
