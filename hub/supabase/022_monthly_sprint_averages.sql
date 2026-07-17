-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Promedio de sprints por célula (proyecto "Monthly update", Product
-- Designers)
--
-- No se ata a `celulas` con FK: esta comparativa incluye células que hoy no
-- están dadas de alta en Darwin (Logistics, Backoffice, Experience, Fintech,
-- Estrellas). `celula` queda como texto libre a propósito.
--
-- `source` distingue lo calculado desde Jira de lo que hoy es dato manual
-- (ej. Estrellas) — relevante para cuando se automatice la carga mensual.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists monthly_sprint_averages (
  id             uuid primary key default gen_random_uuid(),
  month          date not null,               -- primer día del mes que reporta, ej. 2026-06-01
  celula         text not null,
  base_calculo   text,
  promedio_sprints numeric not null,
  source         text check (source in ('jira','manual')) default 'jira',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (month, celula)
);

alter table monthly_sprint_averages enable row level security;

create policy "authenticated_read_monthly_sprint_averages" on monthly_sprint_averages
  for select to authenticated using (true);

-- Sin políticas de insert/update/delete a propósito, mismo criterio que el
-- resto de Darwin (019_darwin_rls.sql): solo la service key escribe.
