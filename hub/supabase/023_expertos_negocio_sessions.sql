-- ═══════════════════════════════════════════════════════════════════════════
-- EXP-001 — Expertos en el Negocio: sesiones de capacitación (roadmap + backlog)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists expertos_sessions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  track         text,        -- Célula / E-commerce / Chatea Pro / Shopi / Estados / ROAX / ATOM / Fennix / Otro
  facilitator   text,
  description   text,
  status        text check (status in ('Backlog','Programada','Hecha','Documentada')) default 'Backlog',
  source        text check (source in ('Programa','Comunidad')) default 'Programa',
  session_date  date,        -- null hasta que se agenda
  proposed_by   text,
  doc_url       text,        -- liga a la ficha resultante en Confluence (cerebro de negocio)
  recording_url text,
  notes         text,        -- aprendizaje clave / resumen post-sesión
  sort_order    integer default 0,
  created_at    timestamptz default now()
);

-- Backlog oficial ya definido — se agenda progresivamente desde la página.
-- Guardado contra doble-inserción si la migración se corre más de una vez.
insert into expertos_sessions (title, track, facilitator, source, status, sort_order)
select v.title, v.track, v.facilitator, 'Programa', 'Backlog', v.sort_order
from (values
  ('Intensivo células', 'Célula', null, 1),
  ('Capacitación de e-commerce', 'E-commerce', 'María Ossa', 2),
  ('Chatea Pro: socialicemos el modelo de chateo y las posibilidades', 'Chatea Pro', null, 3),
  ('Conozcamos Shopi', 'Shopi', null, 4),
  ('Estados a profundidad', 'Estados', null, 5),
  ('Conozcamos ROAX', 'ROAX', null, 6),
  ('Conozcamos ATOM', 'ATOM', null, 7),
  ('Conozcamos Fennix', 'Fennix', null, 8)
) as v(title, track, facilitator, sort_order)
where not exists (
  select 1 from expertos_sessions s where s.title = v.title and s.source = 'Programa'
);
