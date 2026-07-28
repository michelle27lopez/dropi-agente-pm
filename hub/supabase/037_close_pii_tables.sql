-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Cerrar exposición de PII vía anon key
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Hallazgo (auditoría 2026-07-27): con la anon key pública (embebida en el
-- bundle del navegador, extraíble por cualquiera con devtools) se podía leer
-- SIN LOGIN:
--   - userpilot_suppliers (46.208 filas: nombre, email, teléfono, billing_information)
--   - ttv_crm_opportunities (725 filas: nombre de contacto, teléfono, email)
--   - projects / celulas / celula_updates: legibles pese a que
--     019_darwin_rls.sql ya las declaraba solo-`authenticated` — señal de que
--     RLS quedó deshabilitada en algún momento posterior fuera de una
--     migración versionada (`profiles`, cubierta en el mismo archivo 019,
--     sí seguía protegida — devuelve 0 filas a anon, como se espera).
--
-- Esta migración:
--   (a) reafirma RLS habilitada + recrea la política authenticated-only en
--       projects/celulas/celula_updates (por si la policy quedó corrupta o
--       coexistiendo con una más permisiva),
--   (b) cierra por primera vez userpilot_suppliers y ttv_crm_opportunities
--       con el mismo patrón ya usado en el resto del proyecto.
--
-- Verificado antes de este cambio: todo insert/update/delete de estas tablas
-- pasa por API routes con SUPABASE_SERVICE_KEY (que bypassa RLS de cualquier
-- forma); ningún componente cliente hace `.from()` directo contra ellas
-- (solo lectura server-side). Cerrar esto no rompe nada existente.
--
-- Relacionado (fix de código, no de esta migración): `/api/metrics/sellers`
-- no tenía guard de `requireUser()` — cualquiera podía pegarle sin login y
-- recibir la misma PII por esa puerta, sin depender de la anon key. Ya se
-- corrigió en el mismo commit que esta migración.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Reafirmar projects / celulas / celula_updates ──────────────────────────
alter table projects       enable row level security;
alter table celulas        enable row level security;
alter table celula_updates enable row level security;

drop policy if exists "authenticated_read_projects" on projects;
create policy "authenticated_read_projects" on projects
  for select to authenticated using (true);

drop policy if exists "authenticated_read_celulas" on celulas;
create policy "authenticated_read_celulas" on celulas
  for select to authenticated using (true);

drop policy if exists "authenticated_read_celula_updates" on celula_updates;
create policy "authenticated_read_celula_updates" on celula_updates
  for select to authenticated using (true);

-- 2. Cerrar userpilot_suppliers y ttv_crm_opportunities por primera vez ─────
alter table userpilot_suppliers   enable row level security;
alter table ttv_crm_opportunities enable row level security;

drop policy if exists "authenticated_read_userpilot_suppliers" on userpilot_suppliers;
create policy "authenticated_read_userpilot_suppliers" on userpilot_suppliers
  for select to authenticated using (true);

drop policy if exists "authenticated_read_ttv_crm_opportunities" on ttv_crm_opportunities;
create policy "authenticated_read_ttv_crm_opportunities" on ttv_crm_opportunities
  for select to authenticated using (true);

-- Sin políticas de insert/update/delete a propósito, igual que el resto del
-- proyecto: todo write pasa por API routes con la service key.
