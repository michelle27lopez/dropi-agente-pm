-- =============================================
-- Dropi Activa Demo — Schema Supabase
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Asistentes al demo (suppliers y dropshippers)
create table if not exists activa_demo_attendees (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  email       text,
  whatsapp    text,
  role        text not null check (role in ('supplier', 'dropshipper')),
  category    text not null,
  token       text unique not null default replace(gen_random_uuid()::text, '-', ''),
  match_id    uuid,
  created_at  timestamptz default now()
);

-- Matches creados por categoría (1 supplier ↔ 1 dropshipper)
create table if not exists activa_demo_matches (
  id                 uuid default gen_random_uuid() primary key,
  category           text not null,
  supplier_token     text,
  dropshipper_token  text,
  status             text default 'pending' check (status in ('pending', 'active')),
  created_at         timestamptz default now()
);

-- Mensajes del chat en tiempo real
create table if not exists activa_demo_messages (
  id           uuid default gen_random_uuid() primary key,
  match_id     uuid not null references activa_demo_matches(id) on delete cascade,
  sender_role  text not null check (sender_role in ('supplier', 'dropshipper', 'ai')),
  content      text not null,
  created_at   timestamptz default now()
);

-- Habilitar Realtime
alter publication supabase_realtime add table activa_demo_attendees;
alter publication supabase_realtime add table activa_demo_messages;
