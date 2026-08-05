-- Corrige únicamente la síntesis de presentación de LOG-009. No cambia Jira,
-- workflow, owner, relaciones ni crea una fila paralela.
--
-- No se aplica automáticamente: primero debe aprobarse y después releerse la
-- fila. La síntesis evita afirmar rollout global cuando la evidencia de julio
-- todavía contiene un bloqueo/hotfix sin reconciliar.

update projects
set
  name = 'Guías reemplazatorias (Ecom Scanner)',
  status = 'In Progress',
  type = 'Proyecto',
  handoff_status = 'Handoff hecho',
  business_area = 'Novedad / devolución',
  summary = 'Capacidad construida; PRM-745/1380/1381 en Versión Beta. Junio reportó piloto en tres carriers; la mesa operativa del 27-jul reportó un bloqueo/hotfix y el 31-jul se volvió a reportar buen desempeño. PROD-1045 sigue en backlog. Pendientes: reconciliar ticket y piloto, instrumentar adopción/errores, comunicación y evidencia de rollout global.',
  estado_interno = null
where project_code = 'LOG-009';

select project_code, name, status, type, handoff_status, estado_interno, summary
from projects
where project_code = 'LOG-009';
