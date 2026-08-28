-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Logística: tipar como Delivery lo que ya está en delivery, y
-- resolver el duplicado de tarifas.
--
-- Por qué: /celula/logistica mostraba en "Discovery projects" dos proyectos que
-- llevan semanas entregados a TI. Al dejar de agrupar por etapa (PR #134) la
-- contradicción quedó a la vista. El tablero ya lo decía:
--
--   LOG-006 Parametrización de tarifas
--     tablero: fase "Listo para handoff" · handoff "Listo para handoff"
--     jira:    "Hand off hecho (14-jul) — pero el E2E aún necesita ajuste"
--
--   LOG-014 Parametrización de fulfillment
--     tablero: fase "Listo para handoff" · handoff "Listo para handoff"
--     jira:    "Workflow: Listo para hand off; comentario 50931 documenta el
--              gate transversal bloqueado"
--
-- Los dos ya tienen `handoff_status = 'Listo para handoff'` en esta misma
-- tabla. Lo único que faltaba era el `type`, que no se puede corregir desde la
-- interfaz: el PATCH de /api/proyectos/[slug] acepta estado_interno, vpv,
-- parent_project_id, related_poc_id y related_delivery_id — pero no `type`.
-- Por eso esto es SQL y no un clic.
--
-- Depende de: 039_darwin_delivery_proyecto.sql (el check de `type`)
--             043_darwin_following.sql (estados 'Activo'/'Cerrado' en Delivery)
--
-- Idempotente: correrlo dos veces no cambia nada la segunda vez.
--
-- ⚠️ NO incluye LOG-016 Pruebas de entrega (POD), aunque se pidió junto con
--    los otros dos. El tablero lo pone en fase "Discovery" con handoff
--    "Pendiente", y su nota de Jira dice: "⚠️ Paraguas En Ruta y SIN ASIGNAR ·
--    PRM-1361 y PRM-1455 en Impedimentos". Tiparlo como Delivery declararía en
--    entrega un frente cuyo ticket paraguas no tiene siquiera dueño. Si de
--    verdad pasó a delivery, primero hay que actualizar el tablero — y este
--    archivo se amplía después, con las dos fuentes diciendo lo mismo.
-- ═══════════════════════════════════════════════════════════════════════════


-- PASO 1 — LOG-006 y LOG-014 pasan a Delivery Proyecto ───────────────────────
--
-- `estado_interno` se mueve junto con el type y no por prolijidad: los estados
-- válidos dependen del tipo (estadosValidosPara en la API y el check de la
-- 043). LOG-006 está hoy en 'Concepción de experimento', que es un estado de
-- Discovery: si cambia el type sin tocarlo, el <select> de la tarjeta muestra
-- un valor que la propia API rechazaría al guardar.
--
-- 'Pendiente Handoff' es el estado de Delivery que corresponde a lo que ambos
-- son: el trabajo está listo y espera del otro lado.

update projects p set
  type = 'Delivery Proyecto',
  estado_interno = 'Pendiente Handoff'
where p.project_code in ('LOG-006', 'LOG-014')
  and p.celula_owner_id = (select id from celulas where slug = 'logistica')
  and p.type is distinct from 'Delivery Proyecto';


-- PASO 1b — LOG-009 también, y por una razón más fuerte ──────────────────────
--
-- LOG-009 (Guías reemplazatorias · Ecom Scanner) es el ÚNICO proyecto de
-- logística con `handoff_status = 'Handoff hecho'`, y aun así salía en
-- "Discovery projects". Su propio resumen lo desmiente: "Ya no es discovery:
-- está en lanzamiento, operativo en Interrapidísimo, Coordinadora y TCC.
-- Monitoreo de 3 semanas antes del despliegue global."
--
-- Su `estado_interno` ya es 'Activo', que la 043 hizo válido para Delivery, así
-- que no hay que moverlo. Solo el type estaba mal.

update projects p set type = 'Delivery Proyecto'
where p.project_code = 'LOG-009'
  and p.celula_owner_id = (select id from celulas where slug = 'logistica')
  and p.type is distinct from 'Delivery Proyecto';


-- PASO 2 — LOG-017 duplica a LOG-006 ─────────────────────────────────────────
--
-- LOG-017 'Parametrizar Tarifas' se creó desde la UI el 30-jul como POC hijo de
-- LOG-006, y describe lo mismo que su padre: el panel de tarifas por carrier y
-- trayecto con simulador. En la home aparecían las dos tarjetas contando la
-- misma historia.
--
-- Además, el paso 1 lo deja inválido: en este modelo un POC cuelga siempre de
-- un Discovery project (lo valida el PATCH de la API), y su padre acaba de
-- dejar de serlo.
--
-- Verificado antes de borrar: ninguna fila lo referencia por
-- parent_project_id, related_poc_id ni related_delivery_id, y no tiene ciclos
-- en discovery_cycles. Su contenido no se pierde: los tres prototipos RPP de
-- tarifas ya están enlazados desde LOG-006 en el tablero.
--
-- Si se prefiere conservarlo, comentar este bloque y en su lugar re-vincularlo
-- a otro Discovery project — pero entonces hay que decidir a cuál, porque el
-- frente de tarifas ya no tiene uno.

delete from projects
where project_code = 'LOG-017'
  and celula_owner_id = (select id from celulas where slug = 'logistica')
  and type = 'POC'
  and not exists (
    select 1 from projects h
    where h.parent_project_id = projects.id
       or h.related_poc_id = projects.id
       or h.related_delivery_id = projects.id
  );


-- PASO 3 — El primer Following de logística ──────────────────────────────────
--
-- El monitoreo de 3 semanas de Ecom Scanner ES un following: se dejó de
-- construir y se empezó a medir. Estaba ocurriendo en la realidad pero no
-- existía como registro, porque hasta el paso 1b su Delivery ni siquiera
-- estaba tipado como tal.
--
-- `parent_project_id` queda NULL a propósito: LOG-009 es un Delivery huérfano,
-- y el PR #124 hizo explícito que ese caso es válido (BAC-006 y BAC-007 de
-- backoffice son iguales). El vínculo real va por `related_delivery_id`.
--
-- El código LOG-017 se reutiliza: quedó libre al borrar el duplicado del paso
-- 2, y es el siguiente por la regla de `nextProjectCode` (prefijo de la célula,
-- max + 1). Se verificó que nada apuntaba al viejo LOG-017 antes de borrarlo,
-- así que no hay referencias colgando — pero conviene saberlo al leer el
-- historial: son dos proyectos distintos con el mismo código en el tiempo.

insert into projects (
  name, project_code, status, type, handoff_status, business_area, owner, team,
  summary, estado_interno, celula_owner_id, related_delivery_id
)
select
  'Seguimiento de guías reemplazatorias — rollout global',
  'LOG-017', 'in_progress', 'Following', 'Experimentación',
  'Novedad / devolución', 'Juan Diego Bautista', 'Logistic Success',
  'Monitoreo de 3 semanas de Ecom Scanner antes del despliegue global. Operativo en Interrapidísimo, Coordinadora y TCC. PROD-1045 sigue en backlog: faltan ticket/hotfix, medición, comunicación y evidencia de rollout. Nace de LOG-009, que ya tiene el handoff hecho.',
  'Beta controlada',
  (select id from celulas where slug = 'logistica'),
  (select id from projects where project_code = 'LOG-009')
where not exists (
  select 1 from projects f
  where f.type = 'Following'
    and f.related_delivery_id = (select id from projects where project_code = 'LOG-009')
);


-- ── Verificación ─────────────────────────────────────────────────────────────
-- Esperado: LOG-006 y LOG-014 como 'Delivery Proyecto' con estado_interno
-- 'Pendiente Handoff', y ninguna fila LOG-017.
--
--   select project_code, name, type, status, handoff_status, estado_interno
--   from projects
--   where celula_owner_id = (select id from celulas where slug = 'logistica')
--   order by project_code;
--
-- Estado alcanzado (antes: 11 · 1 · 5 · 0). Corrida vía API el 5-ago-2026:
--
--   Discovery projects   8  — LOG-001, 003, 010, 011, 012, 013, 015, 016
--   Pruebas de concepto  0  — LOG-017 (el viejo) era el único
--   Delivery Proyectos   8  — los 5 con código de Jira + LOG-006, LOG-009, LOG-014
--   Followings           1  — LOG-017 (el nuevo), de LOG-009
--
-- Los 8 Delivery ya pueden generar su Following desde el botón de su tarjeta.
