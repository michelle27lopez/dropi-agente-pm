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

-- ── 2. LOG-018 deja de estar huérfano ─────────────────────────────────────
--
-- "POC · Ruteo por mejor carrier × zona" nació sin padre porque su padre
-- natural (PRM-1513 · Selección inteligente de transportadoras) está tipado
-- 'Delivery Proyecto', y la 048 solo vinculaba contra padres Discovery.
--
-- related_delivery_id es justamente la columna para eso (043_darwin_following)
-- y es la que ya usa LOG-017 → LOG-009. Su prototype_url ya apuntaba a la
-- ficha de selección de transportadoras: el vínculo estaba implícito, ahora
-- queda explícito.

update projects
   set related_delivery_id = (
         select id from projects
          where project_code = 'PRM-1513'
          limit 1
       )
 where project_code = 'LOG-018'
   and related_delivery_id is null
   and exists (select 1 from projects where project_code = 'PRM-1513');

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

-- ── Verificación ──────────────────────────────────────────────────────────
-- select project_code, name, type, estado_interno, related_delivery_id
--   from projects
--  where project_code in ('LOG-003','LOG-010','LOG-011','LOG-018','LOG-021')
--  order by project_code;
