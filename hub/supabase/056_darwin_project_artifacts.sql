-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Artefactos de un proyecto (project_artifacts)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Contexto (2026-09-02, Catherin/Growth Marketing + agente): GRO-003 ("Mesa
-- estratégica Lanzamientos") ya centraliza varios artefactos HTML publicados
-- por lanzamiento (Page Pilot, Rearquitectura...) y hasta ahora solo cabía
-- UNO por proyecto en `projects.prototype_url`. A medida que crecen los
-- lanzamientos, un proyecto necesita listar varios artefactos distinguibles
-- por nombre, no un solo link pisando al anterior.
--
-- Decisiones de diseño (mismo patrón que 054_darwin_project_changelog.sql):
--   - Tabla hija simple: project_id, nombre, url, descripcion opcional.
--   - RLS igual que el resto de Darwin (019_darwin_rls.sql): lectura para
--     `authenticated`, ninguna política de escritura (solo service key desde
--     /api/proyectos/[slug]/artefactos).
--   - No se toca `projects.prototype_url` — sigue existiendo para el botón
--     "Ver Detalle del Proyecto" ya usado en el resto del hub. Esta tabla es
--     ADEMÁS de eso, no en su lugar.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists project_artifacts (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  nombre      text not null,
  url         text not null,
  descripcion text,
  creado_por  text,
  created_at  timestamptz default now()
);

create index if not exists project_artifacts_project_id_idx
  on project_artifacts (project_id, created_at asc);

alter table project_artifacts enable row level security;

create policy "authenticated_read_project_artifacts" on project_artifacts
  for select to authenticated using (true);

-- Siembra: los dos artefactos de GRO-003 que ya existían pisándose en
-- `prototype_url` / `summary` (ver spec.md de cada uno en
-- growth-marketing-lab/Lanzamientos Dropi/). Idempotente por (project_id, url).
insert into project_artifacts (project_id, nombre, url, descripcion)
select p.id, v.nombre, v.url, v.descripcion
from (values
  ('Page Pilot — Documento de Lanzamiento',
   'https://claude.ai/code/artifact/c1e05f11-447e-46a2-a2f5-38d143c12533',
   'Piloto de plantilla HTML para el documento de lanzamiento (Workshop 3, 24-jul-2026).'),
  ('Rearquitectura — Lanzamiento',
   'https://claude.ai/code/artifact/8ca302d6-fba4-44eb-93e8-e0980f17e732',
   'Centro de comando del lanzamiento Tier 3 de la Rearquitectura de Dropi (12-sep-2026).')
) as v(nombre, url, descripcion)
cross join (select id from projects where project_code = 'GRO-003') as p
where not exists (
  select 1 from project_artifacts pa where pa.project_id = p.id and pa.url = v.url
);
