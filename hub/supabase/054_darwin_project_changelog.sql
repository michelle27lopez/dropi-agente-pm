-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Log de cambios de un proyecto (project_changelog)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-08-31, Jaime + agente):
--   - Auditoría append-only de los campos "de gestión" de un proyecto que se
--     editan desde el hub: por ahora fecha_inicio_dev, fecha_entrega_propuesta,
--     estado_interno y prioridad. Una fila por campo que cambia.
--   - `autor` = email de quien hizo el cambio (resuelto server-side en el
--     PATCH de /api/proyectos/[id], nunca viene del body).
--   - `nota` es un comentario opcional que acompaña a ese cambio puntual
--     (distinto de project_comments, que es un hilo de conversación libre).
--   - La escritura la hace SOLO el PATCH con SUPABASE_SERVICE_KEY, best-effort:
--     si el insert del log falla, el PATCH igual responde OK.
--   - RLS igual que el resto de Darwin (019_darwin_rls.sql): lectura para
--     `authenticated`, ninguna política de escritura (solo service key).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists project_changelog (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id),
  autor           text,
  campo           text not null,
  valor_anterior  text,
  valor_nuevo     text,
  nota            text,
  created_at      timestamptz default now()
);

create index if not exists project_changelog_project_id_idx
  on project_changelog (project_id, created_at desc);

alter table project_changelog enable row level security;

create policy "authenticated_read_project_changelog" on project_changelog
  for select to authenticated using (true);
