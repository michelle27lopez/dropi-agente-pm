---
name: feedback-no-atomizar-proyectos-darwin
description: No tratar cronograma/visión/KPIs internos como proyectos individuales en Darwin — Kate encontró 6 tarjetas (BRA-VISION, BRA-001, BRA-KPI, BRA-CRONO, BRA-GUIDES, BRA-CHAT) que no reconoce haber creado y las quiere todas eliminadas.
metadata:
  type: feedback
---

Nunca desglosar documentos de planificación interna (cronograma Q3-Q4, visión de producto, definición de metas/KPI, experimentos en concepción) en tarjetas de "proyecto" individuales dentro de Darwin — ni sugerir hacerlo.

**Contexto del incidente (31-jul-2026):** Kate encontró en Darwin 6 tarjetas con formato tipo ticket (BRA-VISION, BRA-001, BRA-KPI, BRA-CRONO, BRA-GUIDES, BRA-CHAT — cada una con "ESTADO INTERNO", botones "+ Crear POC" / "+ Crear Delivery Proyecto") que contienen exactamente los mismos títulos que aparecen como filas de un Gantt en `agente-delivery/Documentos/cronograma-q3-q4-2026.html` (creado 9-jul-2026): "Asegurar plataforma para marcas", "Medición y definición de metas KPI", "Cronograma de ejecución Q3-Q4", "Chatea Pro Freemium (Módulo Mensajería Marcas)", más "Definición de visión de producto Marcas" y "Estrategia de masificación de órdenes". Kate no reconoce haberlas creado ("no la tenía") y pidió eliminarlas todas — para ella esto no son proyectos separados, son ítems de un mismo documento de planificación.

**Por qué:** este agente no tiene ningún conector activo hacia Darwin (se verificó con ToolSearch — no hay tool que la referencie; tampoco hay conector Atlassian/Jira autorizado). No se sabe si Darwin corre sobre Jira Product Discovery — Kate tampoco lo sabe. No se puede editar ni borrar nada ahí desde este entorno; cualquier corrección debe hacerla Kate manualmente en la herramienta.

**Cómo aplicar:**
- No proponer ni generar "tarjetas de proyecto" a partir del cronograma, la visión de producto o las metas de KPI — son documentos de planificación interna de la célula, no iniciativas independientes con vida propia en el backlog.
- Si en el futuro se autoriza un conector de Atlassian/Jira u otra integración con Darwin, confirmar con Kate el alcance exacto antes de crear o modificar cualquier ticket ahí — no asumir que un documento de planificación debe convertirse en entradas separadas del backlog.
- Ver [[project_data_brands_framework]] para el resto de proyectos activos legítimos (Perfil Marca Independiente, Pipeline CRM GHL, Encuesta CSAT, Expansión México).
