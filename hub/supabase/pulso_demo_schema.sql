-- =============================================
-- Dropi Pulso Demo — Schema Supabase
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Asistentes al demo
create table if not exists pulso_demo_attendees (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text,
  whatsapp   text,
  token      text unique not null default replace(gen_random_uuid()::text, '-', ''),
  accepted_at timestamptz,
  created_at  timestamptz default now()
);

-- Producto del demo (tabla de configuración — una sola fila activa)
create table if not exists pulso_demo_product (
  id              uuid default gen_random_uuid() primary key,
  name            text not null default 'Yoga Mat Premium Antideslizante',
  description     text default 'Mat de yoga profesional, superficie antideslizante, grosor 6mm, incluye correa de transporte.',
  category        text not null default 'Fitness & Bienestar',
  price_cost      integer not null default 52000,
  price_suggested integer not null default 89900,
  margin_pct      integer not null default 42,
  stock           integer not null default 820,
  supplier_name   text not null default 'Sports Supply Colombia',
  supplier_city   text not null default 'Medellín',
  image_url       text default '',
  active          boolean default true,
  created_at      timestamptz default now()
);

-- Sesiones del demo (cada vez que Jaime activa el Pulso)
create table if not exists pulso_demo_sessions (
  id           uuid default gen_random_uuid() primary key,
  triggered_at timestamptz default now(),
  triggered_by text default 'admin',
  total_sent   integer default 0,
  active       boolean default true
);

-- Insertar producto default
insert into pulso_demo_product (id)
values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- Agregar compromiso de unidades (ejecutar si la tabla ya existe)
alter table pulso_demo_attendees add column if not exists committed_units integer default null;

-- Habilitar Realtime en asistentes (ejecutar también esto)
-- En Supabase dashboard: Database → Replication → habilitar pulso_demo_attendees
alter publication supabase_realtime add table pulso_demo_attendees;
alter publication supabase_realtime add table pulso_demo_sessions;
