-- Preparada el 2026-08-03; NO aplicada ni releída en Darwin.
-- Alinea solo el texto de presentación de LOG-004. No cambia estado, tipo,
-- handoff, owner, célula, relaciones ni crea un registro paralelo.

update projects
set summary = 'Proyecto PRM-1219, solución PRM-203 y delivery DROP-17946. El historial confirma que PRM-1150 fue fusionada en PRM-203: los archivos de información de carriers son una capacidad del mismo frente, no un proyecto nuevo. La V1 usa documentos curados en Drive y no parsea la hoja operativa. GP/SOP-101 de integración de nuevos carriers son fuentes adyacentes. Pendientes: data owner, diccionario y sensibilidad, frecuencia/SLA, fuente canónica, paridad, cohortes y retiro controlado.'
where project_code = 'LOG-004';

select project_code, name, status, type, handoff_status, owner, cell, summary
from projects
where project_code = 'LOG-004';
