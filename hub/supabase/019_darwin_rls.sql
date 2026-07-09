-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Cerrar acceso directo vía anon key (RLS)
--
-- Hallazgo (2026-07-08): sin RLS, la anon key pública (embebida en el bundle
-- del navegador) podía leer y en algunos casos escribir estas tablas directo
-- contra la API REST de Supabase, saltándose por completo la app de Next.js
-- y sus chequeos de is_super_admin / ownership por célula.
--
-- Verificado que ningún componente cliente hace `.from(...)` directo contra
-- estas tablas (toda la app lee/escribe vía API routes con SUPABASE_SERVICE_KEY,
-- que siempre ignora RLS) — activar esto no rompe nada existente.
--
-- Política: lectura solo para usuarios logueados (`authenticated`), ninguna
-- escritura directa desde el navegador (ni anon ni authenticated) — todo
-- insert/update/delete sigue pasando por las API routes con la service key.
--
-- Pendiente (fuera de esta migración, mismo hallazgo): el resto de tablas del
-- PM Operating System (draft_insights, decisions, risks, followups,
-- milestones, okrs, capabilities, features, user_stories, teams, meetings,
-- transcripts, epics, subtasks) tienen la misma exposición y no están cubiertas
-- aquí — requieren su propia migración cuando se prioricen.
-- ═══════════════════════════════════════════════════════════════════════════

alter table celulas         enable row level security;
alter table profiles        enable row level security;
alter table roadmap_items   enable row level security;
alter table projects        enable row level security;
alter table celula_updates  enable row level security;

create policy "authenticated_read_celulas" on celulas
  for select to authenticated using (true);

create policy "authenticated_read_profiles" on profiles
  for select to authenticated using (true);

create policy "authenticated_read_roadmap_items" on roadmap_items
  for select to authenticated using (true);

create policy "authenticated_read_projects" on projects
  for select to authenticated using (true);

create policy "authenticated_read_celula_updates" on celula_updates
  for select to authenticated using (true);

-- Sin políticas de insert/update/delete a propósito: quedan bloqueadas para
-- anon y authenticated por igual. Solo la service key (server-side) escribe.
