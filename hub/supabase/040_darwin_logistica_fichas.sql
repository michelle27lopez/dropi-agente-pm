-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Logística: completar las fichas del roadmap (16 iniciativas)
--
-- Escrito el 2026-07-29 y corrido a mano en el SQL Editor ese mismo día. Este
-- archivo se versiona después para que el repo no mienta sobre el estado de la
-- base: sin él, nadie puede saber de dónde salieron LOG-012..016.
-- Nació como 039; se renumeró a 040 porque 039 la tomó
-- 039_darwin_delivery_proyecto.sql (Jaime, mismo día).
--
-- Depende de: 031_darwin_celula_logistica.sql (la célula y LOG-001..011)
--             036_discovery_poc_estados.sql (estado_interno, vpv, parent_project_id)
-- Convive con: 039_darwin_delivery_proyecto.sql — su check de `type` y de
--             `estado_interno` acepta todos los valores que usa este archivo.
--
-- Qué hace, en orden:
--   1. Crea las 5 fichas que faltaban (LOG-012..016) — las que hoy salen en
--      /celula/logistica como "También en esta etapa · sin ficha en Darwin".
--   2. Refresca name / summary / business_area / status / type / handoff_status
--      de las 11 existentes, cuyo texto venía del seed del 21-jul.
--   3. Pone `estado_interno` donde el enum de discovery aplica, y `prototype_url`
--      en las 6 iniciativas que ya tienen pantalla dentro de Darwin.
--
-- Fuente de verdad del contenido: hub/src/app/proyectos/logistica/_lib/data.ts
-- (28-jul, el tablero que se presenta en el weekly) + los spec.md del cerebro de
-- logística. Esta tabla es el ESPEJO, no el original — si algo diverge, manda
-- el archivo. Misma regla que declaró la migración 031.
--
-- Todo es idempotente: correrlo dos veces no duplica ni pisa nada distinto.
--
-- ⚠️ Deuda conocida que este SQL NO resuelve (a propósito, ver fichas-darwin.md):
--   · `estado_interno` solo tiene valores de discovery. LOG-006, LOG-009 y
--     LOG-014 ya salieron de discovery: se dejan sin definir y su estado lo
--     cuenta `handoff_status`. Forzar un valor sería mentir en el tablero.
--   · LOG-004 es type='POC' sin `parent_project_id`. Falta decidir de qué
--     proyecto cuelga (o cambiarle el type a 'Proyecto').
--   · `vpv` queda en NULL: la fórmula del Valor Potencial Validado todavía no
--     está definida en Darwin y no se inventa un número aquí.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Las 5 fichas que faltaban ───────────────────────────────────────────────
-- Códigos correlativos siguiendo la convención de `nextProjectCode` (max + 1),
-- ordenados por etapa de la cadena de valor: despacho → tránsito → entrega.

insert into projects (name, project_code, status, type, handoff_status, business_area, owner, team, summary, estado_interno, prototype_url, celula_owner_id)
select v.name, v.project_code, v.status, v.type, v.handoff_status, v.business_area, v.owner, v.team, v.summary, v.estado_interno, v.prototype_url,
       (select id from celulas where slug = 'logistica')
from (values
  ('Autogeneración de guías', 'LOG-012', 'Discovery', 'Oportunidad', 'Experimentación',
   'Despacho', 'Juan Diego Bautista', 'Logistic Success',
   'Al confirmar la orden, generar la guía automáticamente para que el alistamiento no espere una acción manual más. PRM-1469. Hermano de autoconfirmación: ataca la fase "Generación de guía" (10,37h promedio). No es una pantalla aparte — es una pestaña de la MISMA configuración de tienda, pero vista desde el perfil PROVEEDOR. Listo para probar; beneficia a proveedores de alto volumen.',
   'Research', null),

  ('Recolección proactiva', 'LOG-013', 'Discovery', 'Oportunidad', 'Experimentación',
   'Despacho', 'Juan Diego Bautista', 'Logistic Success',
   'Que Dropi programe la recolección a la transportadora en vez de esperarla: saber qué está listo, quién recoge y quién no recogió. Conecta con la fase "Recogido por Dropi" (8,28h, cumplimiento 80,64% — el peor de la ruta Dropi). Ya hay prototipo: mapa de guías preparadas sin recoger por territorio DANE, con datos mock; falta la respuesta de Data sobre cobertura por municipio. Sin ticket en Jira.',
   'Research', '/proyectos/logistica/recolecciones'),

  ('Parametrización de fulfillment', 'LOG-014', 'Blocked', 'Proyecto', 'Listo para handoff',
   'Despacho / fulfillment', 'Juan Diego Bautista', 'Logistic Success',
   'Parametrizar el cobro de fulfillment con sus dos esquemas (mensual y diario). PRM-1446, listo para hand off desde el 14-jul. Bodegas 2PL en Bogotá, Cali y Medellín = 92.000 órdenes/mes; el cobro se activa solo al llegar a Entregado, así que 20-25% de las órdenes preparadas y despachadas nunca se cobran. Servicios prestados y no cobrados: almacenamiento, etiquetado manual, armado de kits y combos, multi-unidad. Prototipo RPP construido (PROD-648). Bloqueado por capacidad de TI y por la negociación de la mesa logística.',
   null, null),

  ('Vigía — control operativo en tiempo real', 'LOG-015', 'Discovery', 'Oportunidad', 'Experimentación',
   'Transversal (Confirmación → Novedad)', 'Michel Pino', 'Logistic Success',
   'Extensión de Chrome que intercepta el API de Dropi, calcula SLAs por estado de orden e inyecta alertas accionables en el dashboard, para Dropshipper y Proveedor. Actúa ANTES del desenlace: muestra qué órdenes están en riesgo para corregir antes de que se caigan. Única iniciativa transversal a toda la cadena: POR CONFIRMAR 12h, PENDIENTE 24h, GUÍA GENERADA 48h, RECOGIDO 24h, EN TRÁNSITO 72h, NOVEDAD 24h. Diseño en curso, sin desarrollo técnico. No existe en Jira: el día que entre a desarrollo necesita ticket, métrica y spec o se construye a ciegas.',
   'Concepción de experimento', '/proyectos/logistica/experimentos/vigia'),

  ('Pruebas de entrega (POD)', 'LOG-016', 'Discovery', 'Proyecto', 'Experimentación',
   'Entrega / Devolución', 'Juan Diego Bautista', 'Logistic Success',
   'Evidencia de los intentos de entrega (SLAs, foto con geolocalización), con una solución por transportadora. No es un ticket sino 8: paraguas PRM-1517 (conectado a KR2.1) + solicitudes PRM-1364 y PRM-1361 + soluciones por carrier PRM-1462 ENVIA, PRM-1455 Interrapidísimo, PRM-1610 Domina, PRM-1611 TIUI, PRM-618 Coordinadora. Dato enterrado en PRM-618: el 80% de las solicitudes del equipo de logística a las transportadoras son pruebas de entrega, la solicitud más común. Bloqueado: el paraguas no tiene dueño y dos soluciones están en Impedimentos.',
   'Ideación', null)
) as v(name, project_code, status, type, handoff_status, business_area, owner, team, summary, estado_interno, prototype_url)
where not exists (
  select 1 from projects p where p.project_code = v.project_code
);

-- 2. Refresco de las 11 fichas existentes ────────────────────────────────────
-- El seed 031 las creó con el texto del _index.md del 21-jul. Estos textos salen
-- del tablero del 28-jul: mismo proyecto, lenguaje llano y datos actualizados.
-- Los nombres se homologan a los del tablero, que es lo que se presenta.

update projects p set
  name           = v.name,
  summary        = v.summary,
  business_area  = v.business_area,
  status         = v.status,
  type           = v.type,
  handoff_status = v.handoff_status,
  estado_interno = coalesce(v.estado_interno, p.estado_interno),
  prototype_url  = coalesce(v.prototype_url, p.prototype_url)
from (values
  ('LOG-001', 'Autoconfirmación de órdenes (movilización)', 'Discovery', 'Oportunidad', 'Experimentación',
   'Confirmación (pre-red)', 'Research', '/proyectos/logistica/experimentos/autoconfirmacion',
   'Confirmar automáticamente las órdenes de los dropshippers maduros, para que dejen de quedarse fuera de la red esperando una acción manual. Fuga #1 del embudo: 317.000 órdenes tardan más de 24h en confirmarse (promedio 11,18h) y el 14,37% excede las 24h. PRM-1497, OKR2/KR de entrega. Se valida con experimento antes de comprometer desarrollo: el handoff a TI es condicional al resultado. Guardarraíl acordado en el Cell Board: no autoconfirmar zonas rurales ni órdenes con variantes.'),

  ('LOG-002', 'Validación y normalización de direcciones', 'Discovery', 'Proyecto', 'Experimentación',
   'Confirmación (pre-red)', 'Ideación', null,
   'Normalizar y validar la dirección en el momento de crearla, a nivel de plataforma. PRM-91, Delivery Backlog EJECUTAR, discovery del taller del 24-jun. Experimento asociado: activar la validación en SHOP (618.000 órdenes sin validar; las validadas entran a la red 11,9 puntos más). Conflicto de ownership abierto: el Delivery Backlog lo pone en la célula pero en Jira el dueño es Katerine Pencue — resolver con Maria antes de trabajarlo.'),

  ('LOG-003', 'Dirección confiable + geo', 'Discovery', 'Oportunidad', 'Experimentación',
   'Confirmación → Desenlace', 'Ideación', null,
   'Capturar y validar la ubicación del comprador para prevenir y recuperar novedades. Todavía es oportunidad, no proyecto: no tiene alcance ni ticket propio. Cruza PRM-1497, PRM-1512 y PRM-1523, y coordina con PRM-91. Cubre las fugas 1 y 2. Tensión abierta: el árbol de discovery v2 bajó "dirección" a ~1% de las novedades, así que el ángulo vivo es validación → movilización, no calidad de la dirección.'),

  ('LOG-004', 'Selección inteligente de transportadoras', 'In Progress', 'POC', 'Listo para handoff',
   'Generación / selección de transportadora', 'En priorización', null,
   'Elegir automáticamente la mejor transportadora por zona para bajar la devolución y mejorar la entrega. Ranking carrier × zona, POC con 72% de acierto. PRM-1513, épica de desarrollo DROP-17946. Hay entre 20 y 27 puntos de diferencia en devolución entre carriers en la misma zona. PM: Kate Pencue; Juan actúa como Carrier Ops. Bloqueado: sin acceso a Chronos no se pueden crear las tablas que faltan y el POC no se puede volver a levantar en la cuenta de AWS de IA.'),

  ('LOG-005', 'Same Day', 'In Progress', 'Proyecto', 'Experimentación',
   'Despacho / tránsito', 'Ideación', '/proyectos/logistica/same-day',
   'Entrega el mismo día para bodegas propias y Veloces. MVP: flag Same Day + validación de hora de corte + validación geográfica + selección guiada. PRM-1366, épica PROD-1127; discovery completo en el board de Michelle López. Riesgo vivo confirmado en producción: hoy con Veloces salen guías same day sin validación geográfica (Cali → Santa Marta sale como same day). Parqueado por WIP = 1 mientras Normalización de estados es la iniciativa activa.'),

  ('LOG-006', 'Parametrización de tarifas', 'Blocked', 'Proyecto', 'Listo para handoff',
   'Costo por orden / tarifas', null, null,
   'Parametrizar el costo por orden (fletes) de forma clara y automática. OKR 3 de compañía (gross margin ≥22%). PRM-1362; prototipo RPP construido, 3 vistas. En Jira figura como hand off hecho desde el 14-jul, pero el estado que manda para la célula es "listo para hand off": el doc E2E todavía necesita ajuste, así que no está entregado. Espera slot de desarrollo — el dev está en el cambio de moneda de Venezuela. Es capacidad de TI, no un bloqueo de producto.'),

  ('LOG-007', 'Normalización de estados', 'Discovery', 'Proyecto', 'Experimentación',
   'Tránsito / estados', 'Concepción de experimento', '/proyectos/logistica/normalizacion-estados',
   'Un lenguaje único de estados para saber dónde está cada orden y poder contárselo al cliente. Prioridad #1 del Delivery Roadmap (WIP = 1), PRM-1297. Hoy 35 de los 51 estados que usa la operación se guardan como lo mismo: no se puede medir dónde se traba una orden ni avisarle nada al cliente. Discovery levantado con datos reales (133.555 órdenes y 52.636 guías de Colombia, 576 mapeos de 7 carriers). El modelo son dos capas: el estado crudo lo ve el admin y 9 estados homologados los ve el usuario. Quedan 2 decisiones de negocio para cerrarlo.'),

  ('LOG-008', 'Herramienta preventiva de novedades (dueño y triaje)', 'Discovery', 'Proyecto', 'Experimentación',
   'Novedad → Posventa', 'Ideación', null,
   'Dar dueño, SLA y triaje por motivo a las novedades para recuperar la orden, y avisar al comprador antes de que la devolución ocurra. PRM-1512, OKR2/KR de entrega; coordina con PRM-1294. Absorbe lo que antes figuraba aparte como "Notificaciones prevención de devoluciones": era el mismo ticket duplicado en dos fichas. Fuga 3, capa transversal más posventa. Nadie lo tiene asignado en Jira aunque el Delivery Backlog pide finalizarlo — alinear con Seller Success.'),

  ('LOG-009', 'Guías reemplazatorias (Ecom Scanner)', 'In Progress', 'Proyecto', 'Handoff hecho',
   'Novedad / devolución', null, null,
   'Generar guías cuando el carrier no lee el código de barras (Ecom Scanner). PRM-745, PRM-1380, PRM-1381. Ya no es discovery: está en lanzamiento con Laura en comunicación, operativo en Interrapidísimo, Coordinadora y TCC. Monitoreo de 3 semanas antes del despliegue global.'),

  ('LOG-010', 'Reducir devoluciones (COD)', 'Discovery', 'Idea', 'Experimentación',
   'Entrega / Devolución', 'Research', null,
   'Reducir la devolución atacándola DENTRO del COD (pago y gestión), nunca empujando prepago — el COD es el valor de Dropi. PRM-1523, OKR2/KR de entrega. Fuga 2 (~26% devuelve, concentrada en MX/AR/GT). Backlog: no hay trabajo hecho todavía. Direcciones a explorar: score de riesgo, triaje por motivo, anticipo/ConfioPagos.'),

  ('LOG-011', 'Torre de control / Tiempo por fases', 'Discovery', 'Oportunidad', 'Experimentación',
   'Transversal (mide F1→F5)', 'Ideación', '/proyectos/logistica/updates',
   'Medir el tiempo de la orden por fases (F1→F5) para ver dónde se estanca. Habilitador del KPI norte de tiempo (OKR2/KR2.1) y de la Normalización de estados. El KPI es tasa de cumplimiento (% de órdenes bajo 24h), no mediana: la distribución está sesgada a la derecha. Por fase, Dropi cumple entre 82% y 99%; el cuello está en el carrier (primer ofrecimiento 32%, entrega final 21%). Hoy vive como medición en el weekly, no como producto construido. Sin ticket: falta crear el Proyecto OKR.')
) as v(project_code, name, status, type, handoff_status, business_area, estado_interno, prototype_url, summary)
where p.project_code = v.project_code
  and p.celula_owner_id = (select id from celulas where slug = 'logistica');

-- 3. Verificación ────────────────────────────────────────────────────────────
-- Debe devolver 16 filas, ninguna con summary del seed viejo.
--
--   select project_code, name, type, status, handoff_status, estado_interno
--   from projects
--   where celula_owner_id = (select id from celulas where slug = 'logistica')
--   order by project_code;

-- 4. Después de esto, en el repo (sin SQL) ───────────────────────────────────
-- Agregar `codigo` a las 5 iniciativas nuevas en
-- hub/src/app/proyectos/logistica/_lib/data.ts, o los chips "sin ficha en
-- Darwin" siguen apareciendo aunque las fichas ya existan:
--
--   autogeneracion-guias   → codigo: "LOG-012"
--   recoleccion-proactiva  → codigo: "LOG-013"
--   fulfillment            → codigo: "LOG-014"
--   vigia                  → codigo: "LOG-015"
--   pruebas-entrega        → codigo: "LOG-016"
