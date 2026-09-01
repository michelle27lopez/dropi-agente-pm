-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 046: DCA-001 · Proveedor de pruebas fijo de Cyber Days
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de Jaime, fwwkesboxlbmimzyoztq)
-- Requiere haber corrido antes 045_campaign_planeacion_meet_rsvp.sql.
--
-- Hasta ahora, para hacer QA del panel público /c/[token] había que usar el
-- link de un proveedor real y, cuando quedaba con estado sucio, resetearlo —
-- lo que cambia el token y obliga a copiar un link nuevo cada vez.
-- Esta fila es un proveedor de QA con token fijo y legible (`qa-cyberdays`),
-- que se limpia con el botón "Reiniciar prueba" de Seguimiento (endpoint
-- /elegibles/[token]/reset-estado) sin perder el link.
--
-- Idempotente: correrla dos veces no duplica ni pisa el estado actual.
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO campaign_planeacion_eligible (token, campaign_id, supplier_id, supplier_name, products)
SELECT
  'qa-cyberdays',
  e.campaign_id,
  'qa',
  'QA — Proveedor de pruebas',
  e.products
FROM campaign_planeacion_eligible e
JOIN campaigns_planeacion c ON c.id = e.campaign_id
-- Toma el catálogo de un proveedor real de la campaña, para probar con datos
-- realistas en vez de inventar productos.
WHERE c.name ILIKE '%cyber%'
  AND jsonb_array_length(e.products) > 0
ORDER BY jsonb_array_length(e.products) DESC
LIMIT 1
ON CONFLICT (token) DO NOTHING;

-- Verificación:
-- SELECT token, supplier_name, jsonb_array_length(products) AS productos
-- FROM campaign_planeacion_eligible WHERE token = 'qa-cyberdays';
