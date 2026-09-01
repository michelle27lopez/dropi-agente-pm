-- Proyecto "Service design: Entendimiento 360 del ecosistema" (célula Product
-- team / product-designers, código PRO-001). Trackea, por célula, el % de
-- entendimiento documentado en dos frentes:
--   - "arquetipos"  → arquetipos/user personas del segmento (el "por usuario")
--   - "procesos"    → journeys 360 de experiencia y servicio (el "por proceso")
-- La documentación final vive en /guias — esta tabla es el semáforo de avance.
--
-- El % NO es un campo libre: es una columna generada a partir de 4 criterios
-- objetivos (25% cada uno), auditados contra la documentación real que hoy
-- existe en Confluence — así el número es interpretable/auditable, no una
-- cifra inventada. Criterios (mismo peso en ambas dimensiones, contenido
-- distinto — ver hub/src/app/proyectos/service-design-360/page.tsx para el
-- texto exacto de cada uno):
--   arquetipos: 1) segmentos nombrados y diferenciados, 2) necesidades/dolores
--     documentados por arquetipo, 3) evidencia/datos reales citados (no solo
--     intuición), 4) centralizado en una página de referencia findable.
--   procesos: 1) journey end-to-end documentado, 2) touchpoints de
--     experiencia/servicio (no solo el flujo transaccional), 3) fugas/dolores
--     identificados explícitamente, 4) métricas ligadas a las etapas.
--
-- Nota manual: este archivo debe correrse en Supabase Dashboard → SQL Editor.
-- Este repo no tiene acceso a psql/DDL directo desde el agente (mismo patrón
-- que 044_google_oauth_tokens.sql / 051_expertos_sessions_calendar.sql).

CREATE TABLE IF NOT EXISTS service_design_360_progress (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  celula_id   UUID        NOT NULL REFERENCES celulas(id) ON DELETE CASCADE,
  dimension   TEXT        NOT NULL CHECK (dimension IN ('arquetipos', 'procesos')),
  criterio_1  BOOLEAN     NOT NULL DEFAULT FALSE,
  criterio_2  BOOLEAN     NOT NULL DEFAULT FALSE,
  criterio_3  BOOLEAN     NOT NULL DEFAULT FALSE,
  criterio_4  BOOLEAN     NOT NULL DEFAULT FALSE,
  porcentaje  SMALLINT    GENERATED ALWAYS AS (
                (criterio_1::int + criterio_2::int + criterio_3::int + criterio_4::int) * 25
              ) STORED,
  notas       TEXT,
  guia_url    TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (celula_id, dimension)
);

-- Semilla = auditoría real hecha 2026-09-01 (2 agentes de investigación sobre
-- Confluence en vivo, ~85 tool calls totales, page IDs citados en cada nota).
-- ON CONFLICT DO NOTHING: si esto se re-corre después de que el equipo ya
-- haya editado criterios a mano en la UI, NO pisa ese trabajo — la migración
-- es de una sola vez, las actualizaciones posteriores van por PATCH.
INSERT INTO service_design_360_progress (celula_id, dimension, criterio_1, criterio_2, criterio_3, criterio_4, notas)
SELECT c.id, v.dimension, v.c1, v.c2, v.c3, v.c4, v.notas
FROM celulas c
JOIN (VALUES
  ('sellers', 'arquetipos', true, true, true, true,
    '6 segmentos con personas reales + entrevistas (825 encuestados) — Journey Map de Dropshippers, Confluence 1530724427. Sub-perfiles oficiales (Rebuscador Digital/Empleado Aspirante/Joven Visionario) en 1484292098.'),
  ('sellers', 'procesos', true, true, true, true,
    'Journey end-to-end login→catálogo→orden con fricciones móviles, protocolo de rescate 5-7 días, fugas priorizadas P0/P1/P2 y métricas por etapa — 1530724427.'),

  ('suppliers', 'arquetipos', true, true, true, false,
    'Segmentos Caliente/Tibio/Frío con tasas de activación reales (4-6.1%/3.4-3.7%/0.4%), base 5.771 suppliers — 1531052043. No es referencia célula-wide: la "Visión de producto Proveedores" sigue en estado "represado·validar" (1483636739).'),
  ('suppliers', 'procesos', true, true, true, true,
    'Journey AS-IS (Registro→Bodega→Producto) y pipeline TO-BE, fugas explícitas (43% omite diagnóstico), métricas de funnel y SLA por etapa — 1531052043. Alcance limitado a onboarding/activación, no cubre logística/posventa del proveedor.'),

  ('brands', 'arquetipos', true, true, true, true,
    '5 segmentos por volumen + sub-perfiles oficiales Emprendedor/Marca + 4 marcas reales con dolor citado textualmente — 1532526605, 1485078530. Encuesta 3.794 respuestas + CSAT in-app en producción.'),
  ('brands', 'procesos', false, true, true, false,
    'El Mapa de Servicio formal AÚN NO EXISTE — PROD-1886 lo fecha para diciembre 2026 (hoy, 1-sep-2026, solo hay v0). Sí hay hallazgo cualitativo real y citado: "el dolor no es de plataforma, es de servicio (Guías/Novedades/Soporte)" — 1529610242, 1533542402.'),

  ('logistica', 'arquetipos', false, false, false, false,
    'No encontrado. La propia célula marca la lente "por perfil" (dropshipper/marca/proveedor/transportadora) como pendiente de construir en su Product Backlog — 1485471746.'),
  ('logistica', 'procesos', true, true, true, true,
    'El más completo del ecosistema: flujo end-to-end de la orden (creación→confirmación→guía→recolección→cross docking→entrega/devolución) con caso real, fugas explícitas y métricas (entrega ≥70%, SLA 24h) — 1522761734, 1531379716, 1530658839.'),

  ('backoffice', 'arquetipos', true, true, true, false,
    'Perfiles reales vía el proyecto de Validación de Identidad (Dropshipper/Proveedor/Marca/Back Office) con datos duros (29.754 cuentas CO, 0.8% verificadas) — 1533050893. No es referencia célula-wide: sin página de perfiles consolidada a nivel de toda la célula — 1485602819.'),
  ('backoffice', 'procesos', true, true, true, true,
    'Pipeline TO-BE de 7 etapas + 28 reglas de negocio + métricas de funnel (meta <8% revisión manual) — 1533050893. La célula admite no tener SLAs/métricas formales a nivel general (1530822715) — esta fortaleza vive solo en ese proyecto puntual, no es práctica transversal todavía.'),

  ('growth', 'arquetipos', true, true, true, false,
    'Niveles Leyendas (Bienvenido→Explorador→Master→Experto→Sabio VIP→Leyenda) con necesidad/comportamiento por nivel — Jira TECH-147, Confluence 1510965275. "Líder de comunidad" sigue "por definir" (1484292098) y no existe ficha de arquetipos propia de Growth en el Dropi Brain.'),
  ('growth', 'procesos', true, true, true, false,
    'La cadena de valor de 7 etapas le asigna a Growth Educación (Academy) + un gap explícito en Fidelización, con fugas nombradas ("Academy hoy no enseña a gestionar una orden") — 1484292098, 1531445251. Sin métricas propias por etapa del journey, solo KPIs de rol (LTV, Retención).'),

  ('growth-marketing', 'arquetipos', false, false, false, false,
    'No encontrado. "Product Growth Marketing" figura como equipo de Product Ops en estado PENDIENTE (1484029954), sin territorio de usuario propio ni página de arquetipos.'),
  ('growth-marketing', 'procesos', false, false, false, false,
    'No encontrado. Lo más cercano es el marco TARS (1484292098 §4.7), pero mide adopción de features lanzadas — no es un journey de usuario de esta célula.'),

  ('experience', 'arquetipos', true, true, true, true,
    '5 perfiles diferenciados (Dropshipper/Proveedor/Emprendedor-Marca/Híbrido/Administrador) con madurez y research fechado (sesiones jul-ago 2025, benchmark Shopify/MercadoLibre) — 1532362764. Matiz: es la segmentación de UN proyecto (Órdenes); a nivel célula, "entender la demografía de los usuarios" sigue "represado·validar" (1485766685).'),
  ('experience', 'procesos', true, true, true, true,
    'AS-IS/TO-BE del módulo de Órdenes con 5 painpoints documentados y catálogo de eventos definido — 1532362764. Matiz: la sección de medición real ("Following y lanzamiento") sigue sin diligenciar — eventos definidos, todavía sin datos reportados.'),

  ('fintech', 'arquetipos', false, false, false, false,
    'No encontrado. Direccionamiento de célula sigue PENDIENTE (1484029954); el único discovery propio (Jira PROD-507) habla de "usuarios activos de Dropi" en genérico, sin segmentos nombrados.'),
  ('fintech', 'procesos', true, false, true, false,
    'Fricción real documentada: "Dropipay aparece únicamente al final del flujo de retiro, en un dropdown largo, sin ninguna propuesta de valor" (PROD-507). Sin touchpoints de servicio propios ni métricas por etapa. El journey de pagos más completo y maduro (framework HEART, 1531772978) es ownership de Backoffice, no de Fintech — no se contabiliza aquí para no inflar el % artificialmente.')
) AS v(slug, dimension, c1, c2, c3, c4, notas)
  ON v.slug = c.slug
ON CONFLICT (celula_id, dimension) DO NOTHING;
