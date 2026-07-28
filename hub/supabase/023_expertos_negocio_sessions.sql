-- ═══════════════════════════════════════════════════════════════════════════
-- EXP-001 — Expertos en el Negocio: calendario de capacitaciones
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists expertos_sessions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,                 -- tema
  facilitator   text,                           -- moderador
  track         text,                           -- Célula / E-commerce / Chatea Pro / Shopi / Estados / ROAX / ATOM / Fennix / Otro
  description   text,                           -- descripción / preguntas esenciales
  session_date  date,                           -- null = sin programar todavía (backlog)
  duration      text,                           -- ej. "30 min", "1 hora", "1.5 horas"
  status        text check (status in ('Backlog','Programada','Hecha','Documentada')) default 'Backlog',
  resources     jsonb not null default '[]'::jsonb, -- [{label, url}] — grabación, transcripción, material previo
  notes         text,                           -- aprendizaje clave / resumen post-sesión
  proposed_by   text,
  source        text check (source in ('Programa','Comunidad')) default 'Programa',
  sort_order    integer default 0,
  created_at    timestamptz default now()
);

-- Backlog oficial ya definido — se agenda progresivamente desde el calendario.
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
