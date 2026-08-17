-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Logística: registrar los POC que ya existían pero nadie veía
--
-- La sección "Pruebas de concepto" de /celula/logistica salía vacía —"Aún no
-- hay POCs cargadas para esta célula"— mientras el tablero listaba 8
-- experimentos, dos de ellos CORRIENDO. Las dos fuentes modelan lo mismo con
-- nombres distintos: el tablero los llama `experimentos`, Darwin los llama
-- `type = 'POC'`. Nada los cruzaba.
--
-- Esto registra en Darwin los tres que tienen un artefacto real y verificable.
-- No inventa ninguno: cada uno sale de un experimento del tablero o de un
-- prototipo desplegado en el hub.
--
-- Depende de: 036_discovery_poc_estados.sql (estado_interno, vpv, parent)
--             047_darwin_logistica_delivery_y_duplicado.sql (los códigos LOG-017+)
--
-- Idempotente: correrlo dos veces no duplica nada.
--
-- ⚠️ Dos quedan SIN `parent_project_id`, y no es un descuido. Un POC solo puede
--    colgar de un Discovery project. Sus padres naturales —PRM-1513 (selección
--    de transportadoras) y PRM-1366 (Same Day)— están tipados
--    'Delivery Proyecto', así que no pueden serlo. Forzar un padre inválido es
--    lo que dejó roto a LOG-017 y obligó a borrarlo en la 047.
--
--    La contradicción de fondo sigue abierta: un proyecto con POC corriendo no
--    se está entregando, se está validando. El tablero pone a PRM-1513 en fase
--    Definición y a PRM-1366 en Discovery — y el propio código de la página de
--    Same Day dice "el proyecto sigue en discovery y la definición de datos no
--    está cerrada". Cuando se decida pasarlos a Discovery, se les cuelga el POC.
--
-- ⚠️ `vpv` queda NULL en los tres. Es el campo que justifica que un POC exista
--    y no se inventa un número acá. LOG-018 es el que más lo pide: hay entre 20
--    y 27 puntos de diferencia en devolución entre carriers en la misma zona, y
--    eso se puede traducir a órdenes.
-- ═══════════════════════════════════════════════════════════════════════════

insert into projects (
  name, project_code, status, type, handoff_status, business_area, owner, team,
  summary, estado_interno, prototype_url, celula_owner_id, parent_project_id
)
select v.name, v.project_code, 'in_progress', 'POC', 'Experimentación',
       'Logística', 'Juan Diego Bautista', 'Logistic Success',
       v.summary, v.estado_interno, v.prototype_url,
       (select id from celulas where slug = 'logistica'),
       (select id from projects p
         where p.project_code = v.padre
           and p.type not in ('POC', 'Delivery Proyecto', 'Following'))
from (values

  -- Experimento "ruteo-carrier-zona" del tablero · estado CORRIENDO.
  -- Padre natural: PRM-1513, hoy tipado Delivery → queda sin vincular.
  ('POC · Ruteo por mejor carrier × zona', 'LOG-018', 'Seguimiento',
   '/proyectos/logistica/proyecto/seleccion-transportadoras', 'PRM-1513',
   'Ranking de transportadora por zona con el histórico de entrega y devolución. 72% de acierto medido; hay entre 20 y 27 puntos de diferencia en devolución entre carriers en la misma zona. Bloqueado: sin acceso a Chronos no se pueden crear las tablas que faltan y el POC no se puede volver a levantar en la cuenta de AWS de IA.'),

  -- Experimento "autoconfirmacion" del tablero · estado CORRIENDO.
  -- Único de los tres con padre válido: LOG-001 es Oportunidad.
  ('POC · Autoconfirmación por madurez del dropshipper', 'LOG-019', 'Seguimiento',
   '/proyectos/logistica/experimentos/autoconfirmacion', 'LOG-001',
   'Autoconfirmar órdenes de dropshippers maduros (constantes, ≥50 órd/mes) para bajar el tiempo de confirmación y subir movilización sin subir devolución. Prueba moderada 18-25 jul con 6 usuarios: aceptación 81/100 y comprensión económica T4 del 17%. Valida usabilidad, no impacto — la prueba de outcome sigue pendiente. Guardarraíl acordado en el Cell Board: no autoconfirmar zonas rurales ni órdenes con variantes.'),

  -- No viene de un experimento: viene del prototipo desplegado en el hub.
  -- Padre natural: PRM-1366, hoy tipado Delivery → queda sin vincular.
  ('POC · Same Day · densidad de demanda', 'LOG-020', 'En definición',
   '/proyectos/logistica/same-day', 'PRM-1366',
   'Mapa de densidad con 427.294 órdenes reales de Bogotá, Medellín y Cali, ubicadas por cruce de nomenclatura contra OpenStreetMap, para medir cuánta demanda captura un centro de operación según su radio. La definición de datos no está cerrada: faltan origen, timestamps, transportadora y estado final.')

) as v(name, project_code, estado_interno, prototype_url, padre, summary)
where not exists (
  select 1 from projects p where p.project_code = v.project_code
);


-- ── Verificación ─────────────────────────────────────────────────────────────
-- Esperado: 3 POC, con LOG-019 colgando de LOG-001 y los otros dos sin padre.
--
--   select project_code, name, type, estado_interno, vpv, parent_project_id
--   from projects
--   where celula_owner_id = (select id from celulas where slug = 'logistica')
--     and type = 'POC'
--   order by project_code;
--
-- Estado alcanzado en /celula/logistica (corrida vía API el 6-ago-2026):
--
--   Discovery projects   8
--   Pruebas de concepto  3   ← antes 0
--   Delivery Proyectos   8
--   Followings           1
