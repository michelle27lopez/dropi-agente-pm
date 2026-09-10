-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Notificación Brands: enganchar el prototipo a BRA-013
-- Prototipo: /proyectos/notificacion-brands
--
-- Experimento de la célula Brands (Cell Board 03-sep-2026, segmento Escalando:
-- "les pesa la reportería y la notificación al cliente"): cargar el export de
-- órdenes de una marca, ver la actividad diaria y avisar al cliente final el
-- estado de su orden por WhatsApp (wa.me con copy por estado).
--
-- No crea un proyecto nuevo: agrega la ruta al `prototype_url` de BRA-013.
-- `prototype_url` admite varias rutas separadas por coma o salto de línea
-- (ver parsePrototypeUrls en celula/[slug]/proyectos/page.tsx), así que esto
-- APENDE la ruta sin pisar lo que ya tenga BRA-013.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

update projects
set prototype_url = case
  when prototype_url is null or btrim(prototype_url) = ''
    then '/proyectos/notificacion-brands'
  when position('/proyectos/notificacion-brands' in prototype_url) > 0
    then prototype_url
  else prototype_url || E'\n' || '/proyectos/notificacion-brands'
end
where project_code = 'BRA-013';

-- Aviso si BRA-013 no existe con ese código exacto
do $$
begin
  if not exists (select 1 from projects where project_code = 'BRA-013') then
    raise notice 'No hay ningún proyecto con project_code = BRA-013 — revisa el código exacto en la tabla projects.';
  end if;
end $$;

-- Verificación
select project_code, name, prototype_url
from projects
where project_code = 'BRA-013';
