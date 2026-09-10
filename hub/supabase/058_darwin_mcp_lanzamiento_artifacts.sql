-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Artefacto agrupado "MCP - Lanzamiento" en GRO-003
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Contexto (2026-09-07, Catherin/Growth Marketing + agente): GRO-003 ya
-- centraliza varios artefactos por lanzamiento (ver 056_darwin_project_artifacts.sql,
-- Page Pilot y Rearquitectura). Para el lanzamiento de MCP, Catherin quiere que
-- "Brief" y "Workshop" aparezcan como dos botones DENTRO de una misma tarjeta
-- visual "MCP - Lanzamiento", no como dos tarjetas sueltas.
--
-- No se tocó el schema de `project_artifacts` para esto: en vez de agregar una
-- columna de agrupación, se usa una convención de nombre — "Grupo :: Etiqueta"
-- (ver `agruparArtifacts()` en hub/src/app/proyectos/[slug]/page.tsx) — que la
-- UI detecta y agrupa visualmente. Cualquier fila SIN " :: " en el nombre
-- (como Page Pilot y Rearquitectura) se sigue viendo exactamente igual que
-- antes: una tarjeta, un botón.
--
-- El artefacto del Workshop todavía no existe — se siembra con `url = ''`
-- (pasa la restricción `not null` de la columna sin representar un link real).
-- La UI ya sabe mostrar "Por construir" en vez de un botón roto cuando `url`
-- viene vacío. Cuando exista el artefacto real, basta un UPDATE (o editarlo
-- desde el botón ✎ en el propio HUB) para cargar la url — no hace falta
-- tocar código.
--
-- Idempotente por (project_id, nombre): si ya corriste este script, no
-- duplica las filas.
-- ═══════════════════════════════════════════════════════════════════════════

insert into project_artifacts (project_id, nombre, url, descripcion)
select p.id, v.nombre, v.url, v.descripcion
from (values
  ('MCP - Lanzamiento :: Brief',
   'https://claude.ai/code/artifact/f443f3f8-9f9e-4fd6-b417-764a3b53a0f5',
   'Operación: MCP — juego estratégico de preparación (8 misiones) para que la mesa estratégica llegue al taller con una primera jugada construida.'),
  ('MCP - Lanzamiento :: Workshop',
   '',
   'Taller estratégico de lanzamiento de MCP — por construir.')
) as v(nombre, url, descripcion)
cross join (select id from projects where project_code = 'GRO-003') as p
where not exists (
  select 1 from project_artifacts pa where pa.project_id = p.id and pa.nombre = v.nombre
);
