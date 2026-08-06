-- Alinea únicamente la presentación de LOG-010 con Jira y la auditoría de fuentes.
-- No crea ni relaciona issues, no declara rollout y no contiene datos del piloto.

update projects
set
  name = 'Reducir devoluciones COD / logística inversa',
  status = 'Discovery',
  type = 'Proyecto',
  handoff_status = 'Experimentación',
  business_area = 'Entrega',
  summary = 'PRM-1523 y PRM-1580 siguen en backlog. El token Veloces es un piloto de conciliación del retorno al proveedor, distinto del código de entrega y de archivos de carriers. Falta informe anonimizado, owners, contrato de datos, vigencia de antecedentes Ecom Scanner y decisión de expansión.',
  estado_interno = 'Research'
where project_code = 'LOG-010';

select project_code, name, status, type, handoff_status, estado_interno, summary
from projects
where project_code = 'LOG-010';
