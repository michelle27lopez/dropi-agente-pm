-- ═══════════════════════════════════════════════════════════════════════════
-- Cerrar acceso público (anon key) — catalog_metrics_daily + research_*
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Hallazgo (equipo de seguridad, 2026-07-22): estas tablas quedaron con
-- "allow_public_read ... USING (true)" — cualquiera con la anon key (pública,
-- embebida en el bundle del navegador) podía leer estos datos directo por la
-- API REST de Supabase.
--
-- Verificado antes de este cambio:
--   - catalog_metrics_daily: solo la lee src/app/api/catalog/metrics/route.ts,
--     un endpoint server-side. Se migró ese endpoint a supabaseAdmin (service
--     key) en el mismo commit que esta migración — la service key siempre
--     ignora RLS, así que sigue funcionando igual sin necesitar política.
--   - research_documents/chunks/insights/sources/related_items: ningún código
--     de la app las consulta hoy (la política pública quedó de una migración
--     preparada para una feature que aún no se conectó).
--
-- Resultado: sin políticas de lectura/escritura para anon ni authenticated.
-- Solo la service key (server-side) puede leer o escribir estas tablas.
-- ═══════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "allow_public_read"  ON catalog_metrics_daily;
DROP POLICY IF EXISTS "allow_service_write" ON catalog_metrics_daily;

DROP POLICY IF EXISTS "allow_public_read"  ON research_documents;
DROP POLICY IF EXISTS "allow_service_write" ON research_documents;

DROP POLICY IF EXISTS "allow_public_read"  ON research_chunks;
DROP POLICY IF EXISTS "allow_service_write" ON research_chunks;

DROP POLICY IF EXISTS "allow_public_read"  ON research_insights;
DROP POLICY IF EXISTS "allow_service_write" ON research_insights;

DROP POLICY IF EXISTS "allow_public_read"  ON research_sources;
DROP POLICY IF EXISTS "allow_service_write" ON research_sources;

DROP POLICY IF EXISTS "allow_public_read"  ON research_related_items;
DROP POLICY IF EXISTS "allow_service_write" ON research_related_items;

-- Las 6 tablas ya tienen RLS habilitado desde 001/003 — al quedar sin
-- políticas, el acceso vía anon/authenticated queda denegado por defecto.

-- lab_simulation_runs: "Allow anonymous inserts" — la usaba
-- src/app/api/simulate/batch/route.ts con el cliente anon. Se migró ese
-- endpoint a supabaseAdmin en el mismo commit; ya no necesita la política.
DROP POLICY IF EXISTS "Allow anonymous inserts" ON lab_simulation_runs;
