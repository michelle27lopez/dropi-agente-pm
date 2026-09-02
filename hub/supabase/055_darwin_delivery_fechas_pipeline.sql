-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Pipeline de fechas de un Delivery Proyecto
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-09-01, Jaime + agente):
--   - El ciclo de un Delivery Proyecto pasa por 4 fechas, todas 1:1 con el
--     proyecto (mismo criterio que 053_*.sql — columnas en `projects`, no
--     tabla aparte):
--       1. fecha_handoff          — cuándo Ingeniería recibe el proyecto.
--                                   Tentativa al principio, se confirma /
--                                   mueve. Marca el hito ◆ del Roadmap
--                                   mientras está en 'Pendiente Handoff'.
--       2. fecha_inicio_dev       — inicio real de desarrollo (ya existía).
--                                   Puede ser distinta del handoff.
--       3. fecha_entrega_qa       — entrega a QA / arranque de QA.
--       4. fecha_salida_produccion — salida a producción = entrega real del
--                                   proyecto. Fin de la barra del Roadmap.
--   - `fecha_entrega_propuesta` (053_*.sql) se RENOMBRA a
--     `fecha_salida_produccion`: era "la fecha que da desarrollo", ahora es
--     explícitamente la fecha de entrega/producción. El rename preserva los
--     valores que ya había.
--   - Todas se editan desde el hub y quedan en `project_changelog` (una fila
--     por campo que cambia) — ver el PATCH de /api/proyectos/[slug].
--   - El PATCH sigue autollenando `fecha_inicio_dev` con hoy la primera vez
--     que `estado_interno` pasa a 'en DEV' sin fecha; además el hub abre un
--     modal en el paso 'Pendiente Handoff' → 'en DEV' para capturar
--     inicio_dev / entrega_qa / salida_produccion de una sola vez.
--   - Sin cambios de RLS: `projects` está cerrada a escritura directa
--     (019_darwin_rls.sql), todo update pasa por las API routes.
-- ═══════════════════════════════════════════════════════════════════════════

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'fecha_entrega_propuesta'
  ) and not exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'fecha_salida_produccion'
  ) then
    alter table projects rename column fecha_entrega_propuesta to fecha_salida_produccion;
  end if;
end $$;

alter table projects
  add column if not exists fecha_handoff date,
  add column if not exists fecha_inicio_dev date,
  add column if not exists fecha_entrega_qa date,
  add column if not exists fecha_salida_produccion date;
