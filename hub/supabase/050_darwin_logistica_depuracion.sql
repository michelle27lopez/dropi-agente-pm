-- 050 · Depuración del portafolio de Logistic Success (19-ago-2026)
--
-- Tres cambios que vienen de la decisión de Juan de enfocar el tablero, más el
-- POC de Indiana que faltaba registrar.
--
-- Se corre a mano en el SQL Editor de Supabase: RLS deja las tablas en solo
-- lectura y toda escritura pasa por service key (ver 019_darwin_rls.sql).
--
-- El espejo de este cambio en el tablero va en
-- hub/src/app/proyectos/logistica/_lib/data.ts — los dos lados se editan a
-- mano porque no hay job de sincronización; la llave es project_code.

-- ── 1. Cerrar, NO borrar ──────────────────────────────────────────────────
--
-- DELETE perdería el histórico y dejaría colgando los related_poc_id /
-- related_delivery_id de otras filas. Cerrar conserva la trazabilidad y los
-- saca de las vistas activas, que es lo que se pidió.
--
--   LOG-011 · Torre de control / Tiempo por fases
--     No era un proyecto: es la métrica central de la célula, y ya vive en el
--     panel de KPIs de "Mi día". ⚠️ Con esto las submétricas del KPI de 24h
--     quedan como transcripción manual — lo advierte
--     logistica-lab/estrategia/medicion-movilizacion-y-entrega.md.
--   LOG-003 · Dirección confiable + geo
--     Decisión de foco. Sus dos experimentos pasaron a LOG-002 en el tablero.
--   LOG-010 · Reducir devoluciones en pago contra entrega
--     Decisión de foco.

update projects
   set estado_interno = 'Cerrado'
 where project_code in ('LOG-011', 'LOG-003', 'LOG-010');

-- ── 2. LOG-018 y LOG-020 dejan de estar huérfanos ─────────────────────────
--
-- Los dos nacieron sin padre por la misma razón: sus padres naturales
-- (PRM-1513 · Selección de transportadoras y PRM-1366 · Same Day) están
-- tipados 'Delivery Proyecto', y la 048 solo vinculaba contra padres Discovery.
-- Verificado contra la base el 19-ago: los dos siguen sin padre, y son los dos
-- únicos POCs huérfanos que quedan (LOG-019 sí tiene, porque LOG-001 es
-- Oportunidad).
--
-- related_delivery_id es justamente la columna para esto (043_darwin_following)
-- y es la que ya usa LOG-017 → LOG-009. En ambos casos el prototype_url ya
-- apuntaba a la ficha del padre: el vínculo estaba implícito, ahora es
-- explícito y navegable desde la ficha.

update projects p
   set related_delivery_id = padre.id
  from (values
         ('LOG-018', 'PRM-1513'),
         ('LOG-020', 'PRM-1366')
       ) as v(hijo, padre_code)
  join projects padre on padre.project_code = v.padre_code
 where p.project_code = v.hijo
   and p.related_delivery_id is null;

-- ── 3. POC de Indiana bajo Recolección proactiva ──────────────────────────
--
-- Indiana nació como módulo del hub y se separó a su propio repo. Hasta hoy
-- figuraba solo como link "prototipo" dentro de LOG-013; ahora tiene ficha.

insert into projects (
  name, project_code, status, type, handoff_status,
  business_area, owner, team,
  summary, estado_interno, prototype_url,
  celula_owner_id, related_delivery_id
)
select v.name, v.project_code, 'in_progress', 'POC', 'Experimentación',
       'Logística', 'Juan Diego Bautista', 'Logistic Success',
       v.summary, v.estado_interno, v.prototype_url,
       (select id from celulas where slug = 'logistica'),
       (select id from projects p where p.project_code = v.padre limit 1)
from (values

  ('POC · Indiana — mapa de recolecciones', 'LOG-021', 'Seguimiento',
   'https://indiana-map.vercel.app/mapa', 'LOG-013',
   'Mapa operativo de recolecciones: 998 bodegas con filtros por transportadora y por red, puntos de entrega y medición por guías o por empacadas. Nació como módulo del hub y se separó a su propio repo. ⚠️ Lo publicado es el deploy del 28-jul: hay 28 commits sin publicar porque Vercel bloquea los despliegues del proyecto, que vive en una cuenta personal. Antes de darle visibilidad conviene destrabar eso.')

) as v(name, project_code, estado_interno, prototype_url, padre, summary)
where not exists (
  select 1 from projects p where p.project_code = v.project_code
);

-- ── 4. Las cinco con código de Jira: cerrar la contradicción ──────────────
--
-- Decisión de Juan (19-ago) sobre lo que deuda-datos-darwin.md §2 dejó abierto:
-- "o se corrige el type en la base, o se corrige la fase en el tablero".
-- Resolución: SON Delivery — el Delivery Backlog del direccionamiento de María
-- (Confluence PD/1485471746) las lista a las cinco como aprobadas y en
-- ejecución. El `type` se queda como está.
--
-- Lo que sí estaba mal es `estado_interno`. Las cinco decían 'en DEV' mientras
-- su propio `handoff_status` decía 'Experimentación' en cuatro de ellas: no se
-- puede estar en desarrollo sin que el handoff haya ocurrido. El 'en DEV' era
-- un valor puesto en bloque que la columna de al lado desmiente.
--
-- Se alinea al handoff real, que es el dato que sí tiene respaldo:
--   · handoff 'Experimentación'     → 'En definición'
--   · handoff 'Listo para handoff'  → 'Pendiente Handoff'  (solo PRM-1513)
--
-- Ambos son estados válidos de Delivery Proyecto según el check de la 043.

update projects
   set estado_interno = 'En definición'
 where project_code in ('PRM-1297', 'PRM-1366', 'PRM-1512', 'PRM-91')
   and type = 'Delivery Proyecto'
   and handoff_status = 'Experimentación';

update projects
   set estado_interno = 'Pendiente Handoff'
 where project_code = 'PRM-1513'
   and type = 'Delivery Proyecto'
   and handoff_status = 'Listo para handoff';

-- ── Verificación ──────────────────────────────────────────────────────────
-- select project_code, name, type, estado_interno, related_delivery_id
--   from projects
--  where project_code in ('LOG-003','LOG-010','LOG-011','LOG-018','LOG-020',
--                          'LOG-021','PRM-91','PRM-1297','PRM-1366','PRM-1512','PRM-1513')
--  order by project_code;
