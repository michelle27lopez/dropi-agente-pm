-- Aplicada y releída en el proyecto fwwkesboxlbmimzyoztq el 2026-08-03.
-- Alinea únicamente la ficha de presentación LOG-013. No crea proyecto Jira,
-- no altera relaciones y no declara que el experimento reemplace la operación actual.

update projects
set
  name = 'Recolección proactiva',
  status = 'Discovery',
  type = 'Oportunidad',
  handoff_status = 'Experimentación',
  business_area = 'Despacho',
  summary = 'Oportunidad en Discovery. PRM-1468 fue fusionada dentro de PRM-1465, candidata principal; comentario Jira 51003 verificado. Pickups externos, carrier interno/cross-docking y Hub/Indiana deben cerrar el ciclo solicitud-acuse-resultado. PAU es adyacente; Warranties queda excluido. Pendientes: owners, RLS, piloto y outcome.',
  estado_interno = 'Research'
where project_code = 'LOG-013';

select project_code, name, status, type, handoff_status, estado_interno, summary
from projects
where project_code = 'LOG-013';
