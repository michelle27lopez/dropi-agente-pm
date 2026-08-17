-- Alinea LOG-012 con la clasificación gobernada por Jira y la decisión de
-- producto del 16-jul-2026. No crea tablas ni filas paralelas.
--
-- Jira usa el tipo "Solicitud", que no existe en el enum de Darwin. El mapeo
-- menos engañoso es Proyecto: Maria pidió ubicarlo como proyecto en definición,
-- mientras la hipótesis/POC futuro vive dentro del proyecto.

update projects
set
  name = 'Autogeneración de guías',
  status = 'Discovery',
  type = 'Proyecto',
  handoff_status = 'Experimentación',
  business_area = 'Despacho',
  summary = 'Proyecto/solicitud en discovery para generar en lote guías de despacho a proveedores de alto volumen. PRM-1469 → INVS-67. Concepto existente; pendientes contraevidencia Kevin/Lucho, baseline segmentado, lotes/impresión, fallback carrier, idempotencia y prueba propia.',
  estado_interno = 'Ideación'
where project_code = 'LOG-012';

select project_code, name, status, type, handoff_status, estado_interno, summary
from projects
where project_code = 'LOG-012';
