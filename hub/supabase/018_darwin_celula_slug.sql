-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Slug de célula (para rutas /celula/[slug])
-- ═══════════════════════════════════════════════════════════════════════════

alter table celulas
  add column if not exists slug text unique;

update celulas
set slug = lower(regexp_replace(nombre, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

alter table celulas
  alter column slug set not null;
