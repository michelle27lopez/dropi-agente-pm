-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Alta de la célula Logistic Success (Logística)
--
-- Depende de: 016_darwin_core.sql (celulas, projects.type/handoff_status/celula_owner_id)
--             017_darwin_profiles.sql (profiles)
--             018_darwin_celula_slug.sql (celulas.slug)
--
-- Contexto: Juan Diego Bautista (@JuanBautista0209) ya figura en
-- .github/ownership.json como célula `logistica`, pero la célula no existía en
-- la base — las migraciones previas solo sembraron Suppliers, Sellers y Brands.
--
-- Todo es idempotente (`on conflict do nothing` / `where not exists`): correrlo
-- dos veces no duplica nada.
--
-- Fuente de verdad de los proyectos: logistica-lab/proyectos/_index.md y el
-- spec.md de cada carpeta. Esta tabla es el ESPEJO, no el original — si algo
-- diverge, manda el archivo.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. La célula ───────────────────────────────────────────────────────────────
-- Ojo: `slug` es UNIQUE (018) y la célula YA EXISTE en producción como
-- 'Logística' (verificado en /celula/logistica el 21-jul, con lead Juan Diego).
-- El conflicto se resuelve por SLUG, no por nombre: con `on conflict (nombre)`
-- un nombre distinto pero el mismo slug reventaba el unique y abortaba toda la
-- migración — sin cargar ningún proyecto.
insert into celulas (nombre, lead, area, slug)
values ('Logística', 'Juan Diego Bautista', 'Logística', 'logistica')
on conflict (slug) do nothing;

-- 2. Perfil del PM ───────────────────────────────────────────────────────────
-- Copia la fila de auth.users, así que el correo debe coincidir exactamente con
-- el de la cuenta con la que Juan entra a Darwin. Si esa cuenta todavía no
-- existe en auth.users, el select devuelve 0 filas: el insert no hace nada y
-- **no lanza error**, y /celula/logistica no lo reconocerá como miembro.
insert into profiles (id, email, nombre, celula_id, is_super_admin)
select
  u.id,
  u.email,
  'Juan Diego Bautista',
  (select id from celulas where slug = 'logistica'),
  false
from auth.users u
where u.email = 'juan.bautista@dropi.co'
on conflict (id) do update set
  celula_id = excluded.celula_id;

-- 3. Proyectos de la célula ──────────────────────────────────────────────────
-- Códigos LOG-XXX ordenados por etapa de la cadena de valor de la orden
-- (confirmación → selección → despacho → tránsito → novedad → devolución →
-- transversal), siguiendo la convención de Darwin (DCA-001, TTFO-001…).
--
-- Homologación de estados (emoji del _index.md → enum de `projects`):
--   ⚪ discovery                      → Discovery   · Oportunidad · Experimentación
--   🟡 discovery levantado            → Discovery   · Proyecto    · Experimentación
--   🟡 pre-handoff (POC, gate CPO)    → In Progress · POC         · Listo para handoff
--   🟢 dev beta / V1 construido       → In Progress · Proyecto    · Handoff hecho
--   bloqueado por dependencia externa → Blocked     · Proyecto    · Experimentación
--
-- NO incluido a propósito: "Combos (Fase 2)" — el propio _index.md lo marca
-- como proyecto de Supplier Success/Catálogo, no de logística. Registrarlo aquí
-- lo pondría bajo el ownership equivocado.
--
-- Sin carpeta/spec todavía (quedan fuera hasta tenerla): Parametrización de
-- fulfillment · Ecom Scanner · Notificaciones Prevención de Devoluciones (PRM-1512)
-- · Data (transversal).

insert into projects (name, project_code, status, type, handoff_status, business_area, owner, team, summary, celula_owner_id)
select v.name, v.project_code, v.status, v.type, v.handoff_status, v.business_area, v.owner, v.team, v.summary,
       (select id from celulas where slug = 'logistica')
from (values
  ('Movilización: rescatar confirmación (SHOP)', 'LOG-001', 'Discovery', 'Oportunidad', 'Experimentación',
   'Confirmación (pre-red)', 'Juan Diego Bautista', 'Logistic Success',
   'Fuga #1 del embudo: órdenes que no entran a la red por confirmación manual del dropshipper. PRM-1497 (OKR2/KR entrega). Experimento de autoconfirmación por madurez.'),

  ('Validación y normalización de direcciones', 'LOG-002', 'Discovery', 'Proyecto', 'Experimentación',
   'Selección / Confirmación (pre-red)', 'Juan Diego Bautista', 'Logistic Success',
   'PRM-91 · Delivery Backlog EJECUTAR. Discovery del taller 24-jun. Experimento: activar validación en SHOP.'),

  ('Dirección confiable + geo', 'LOG-003', 'Discovery', 'Oportunidad', 'Experimentación',
   'Confirmación → Desenlace', 'Juan Diego Bautista', 'Logistic Success',
   'Rama muestra (usuario). Cruza PRM-1497 / PRM-1512 / PRM-1523; coordina con PRM-91. Cubre fugas 1 y 2.'),

  ('Sistema Inteligente de Transportadoras', 'LOG-004', 'In Progress', 'POC', 'Listo para handoff',
   'Generación / selección de transportadora', 'Kate Pencue', 'Logistic Success',
   'PRM-1513 · épica DROP-17946 · Delivery Backlog EJECUTAR. POC listo, pendiente gate de la CPO. Juan actúa como Carrier Ops, la PM es Kate Pencue.'),

  ('Same Day (proveedores, marcas y fulfillment)', 'LOG-005', 'In Progress', 'Proyecto', 'Experimentación',
   'Despacho / tránsito', 'Juan Diego Bautista', 'Logistic Success',
   'PRM-1366 · épica PROD-1127 · Delivery Backlog EJECUTAR. Discovery completo (board Figma de Michelle López). MVP: flag SD + hora de corte + validación geo. Riesgo activo: hoy salen guías same day sin lógica de geografía.'),

  ('Parametrización de tarifas', 'LOG-006', 'Blocked', 'Proyecto', 'Experimentación',
   'Costo por orden / tarifas', 'Juan Diego Bautista', 'Logistic Success',
   'OKR 3 de compañía. Discovery completado, doc E2E en review de José Giraldo. BLOQUEADO: TI priorizó el cambio de moneda de Venezuela.'),

  ('Normalización / Homologación de estados', 'LOG-007', 'Discovery', 'Proyecto', 'Experimentación',
   'Tránsito / estados', 'Juan Diego Bautista', 'Logistic Success',
   'PRM-1297 · Delivery Backlog EJECUTAR. Discovery levantado con datos reales (133.555 órdenes / 52.636 guías CO). Propuesta de catálogo v0.1: modelo por capas crudo→homologado(26)→fase→vista cliente(8).'),

  ('Dueño y triaje de la novedad (+posventa)', 'LOG-008', 'Discovery', 'Oportunidad', 'Experimentación',
   'Novedad → Posventa', 'Juan Diego Bautista', 'Logistic Success',
   'PRM-1512 (OKR2/KR entrega) · coordina PRM-1294. Fuga 4, capa transversal.'),

  ('Guías reemplazatorias (Ecom Scanner)', 'LOG-009', 'In Progress', 'Proyecto', 'Handoff hecho',
   'Novedad / devolución', 'Juan Diego Bautista', 'Logistic Success',
   'PRM-745 · PRM-1380 · PRM-1381. Versión beta en desarrollo, operativas en Interrapidísimo / Coordinadora / TCC. Monitoreo de 3 semanas antes del despliegue global.'),

  ('Reducir devoluciones (COD)', 'LOG-010', 'Discovery', 'Oportunidad', 'Experimentación',
   'Desenlace / devolución', 'Juan Diego Bautista', 'Logistic Success',
   'PRM-1523 (OKR2/KR entrega). Fuga 2, hermana económica de la de movilización.'),

  ('Torre de control / Tiempo por fases', 'LOG-011', 'Discovery', 'Oportunidad', 'Experimentación',
   'Transversal (mide F1→F5)', 'Juan Diego Bautista', 'Logistic Success',
   'Habilitador del KPI norte de tiempo (OKR2/KR2.1). Mide el tiempo de entrega POR FASES desde generación/confirmación. Habilita PRM-1297.')
) as v(name, project_code, status, type, handoff_status, business_area, owner, team, summary)
where not exists (
  select 1 from projects p where p.project_code = v.project_code
);

-- 4. Update de célula — NO se inserta. Motivo, para que quede documentado:
--
-- `celula_updates` declara `UNIQUE (week_date)` (010_celula_updates.sql:12), un
-- único GLOBAL y no por célula. En la práctica eso significa que **solo una
-- célula en todo Darwin puede publicar update en una fecha dada**: el 2026-07-17
-- ya lo ocupa Brands, el 16 Sellers, el 15 Suppliers.
--
-- Registrar aquí el weekly de logística le quitaría la fecha a otra célula, así
-- que se deja fuera a propósito. El arreglo de fondo sería mover la restricción
-- a `UNIQUE (celula_id, week_date)`, pero eso es esquema compartido y no
-- corresponde cambiarlo desde la migración de una célula.
--
-- Mientras tanto el weekly de logística vive en /proyectos/logistica/updates y
-- se llega a él desde la cabecera del tablero.
