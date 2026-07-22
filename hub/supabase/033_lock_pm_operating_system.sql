-- ═══════════════════════════════════════════════════════════════════════════
-- Cerrar el PM Operating System (agente-delivery) — mismo proyecto Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto fwwkesboxlbmimzyoztq,
-- el mismo de hub y supplier-lab)
--
-- Hallazgo (equipo de seguridad, 2026-07-22): estas tablas (definidas en
-- agente-delivery/schema/supabase_schema.sql) nunca tuvieron RLS — quedó
-- pendiente desde 019_darwin_rls.sql, que ya lo advertía explícitamente.
-- Contienen data interna sensible: transcripts de reuniones, decisiones,
-- riesgos, insights — abierta a cualquiera con la anon key pública de hub o
-- supplier-lab (comparten el mismo proyecto).
--
-- Verificado antes de este cambio: ningún código de hub ni supplier-lab hace
-- .from(<tabla>) sobre ninguna de estas 16 tablas — solo las tocan los
-- scripts Python de agente-delivery (.agents/skills/canon-keeper,
-- pm-bootstrap), y todos usan exclusivamente SUPABASE_SERVICE_KEY (nunca
-- anon). La service key siempre ignora RLS, así que cerrar esto no rompe
-- nada existente.
--
-- No incluye "projects" (ya cubierta en 019_darwin_rls.sql) ni
-- "research_documents" (ya cubierta en supplier-lab/004_lock_public_policies,
-- mismo proyecto).
--
-- Igual que 032: cada tabla se valida con to_regclass antes de tocarla, por
-- si el schema real difiere del archivo del repo.
-- ═══════════════════════════════════════════════════════════════════════════

do $$
declare
  t text;
  tables text[] := array[
    'teams',
    'meetings',
    'transcripts',
    'draft_insights',
    'approved_context',
    'okrs',
    'capabilities',
    'features',
    'user_stories',
    'decisions',
    'risks',
    'followups',
    'milestones',
    'epics',
    'subtasks',
    'drive_sync_log'
  ];
begin
  foreach t in array tables loop
    if to_regclass('public.' || t) is null then
      raise notice 'Tabla % no existe, se saltó.', t;
      continue;
    end if;

    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for select to authenticated using (true)',
      'authenticated_read_' || t, t
    );
  end loop;
end $$;
