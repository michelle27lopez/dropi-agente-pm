-- ════════════════════════════════════════════════════════════════════════
-- 052_leyendas_simulador_leads.sql
-- Célula: Growth | Proyecto: GRO-LEY-001 Leyendas Dropi — SimulaDrop
-- Fecha: 2026-08-25
-- Descripción: captura del correo previo al simulador (juego ExpoWinners
-- embebido) en la landing pública sin login "leyendas-dropi-simulador".
-- El wrapped individual ya NO se muestra dentro de la app — se envía por
-- correo vía GoHighLevel usando los datos que caigan en esta tabla.
--
-- NOTA: esta migración no ha sido aplicada todavía. El agente no tiene
-- credenciales de administración de base de datos (CLI de Supabase ni
-- conexión Postgres directa) para ejecutar DDL en este proyecto — debe
-- aplicarse manualmente desde el SQL Editor de Supabase.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.leyendas_simulador_leads (
  id bigint generated always as identity primary key,
  email text not null,
  source text default 'leyendas-dropi-simulador',
  created_at timestamptz not null default now()
);

comment on table public.leyendas_simulador_leads is
  'Correos capturados en el botón "Simula la experiencia Dropi" antes de mostrar el simulador (SimulaDrop). Consumida por el equipo de CRM (Kique) para disparar el envío del wrapped individual vía GoHighLevel.';

alter table public.leyendas_simulador_leads enable row level security;

-- El formulario público inserta directamente con la clave publicable
-- (anon). No se permite leer, actualizar ni borrar desde el cliente.
create policy "anon puede insertar su correo"
  on public.leyendas_simulador_leads
  for insert
  to anon
  with check (true);
