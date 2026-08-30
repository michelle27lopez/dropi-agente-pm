# Launch Process AS-IS

| Campo | Valor |
|-------|-------|
| Documento | Launch Process AS-IS |
| Área | Product Growth Marketing |
| Módulo | Launch System |
| Versión | 1.0 |
| Estado | En construcción |
| Responsable | Product Growth Marketing |

---

# 1. Objetivo
Documentar el proceso actual mediante el cual se gestionan los lanzamientos de funcionalidades dentro de Dropi.
Este documento busca identificar el flujo operativo existente, los responsables, herramientas utilizadas, tiempos de ejecución, cuellos de botella, reprocesos y oportunidades de automatización que servirán como base para el diseño del nuevo modelo operativo.+

---

# 2. Alcance
Este documento comprende el proceso actual desde que un Product Manager crea una Historia de Usuario para un lanzamiento hasta que la funcionalidad es comunicada, ejecutada y medida.
Incluye la interacción entre Producto, OPS, Marketing, Academy, Tecnología y Product Growth Marketing.

---

# 3. Objetivo del análisis

El análisis AS-IS tiene como finalidad:
- Comprender el proceso actual.
- Identificar actividades manuales.
- Detectar cuellos de botella.
- Identificar reprocesos.
- Detectar duplicidad de información.
- Identificar dependencias entre equipos.
- Identificar oportunidades de automatización.
- Servir como base para el diseño del proceso TO-BE.

---

# Mapa del proceso actual

| # | Etapa | Actividad | Responsable Actual | Herramienta Actual | Tiempo Actual | Entregable | Problema Identificado | Potencial de Automatización |
|---|--------|-----------|--------------------|--------------------|---------------|------------|------------------------|-----------------------------|
| 1 | Definición de la iniciativa | El Product Manager identifica una necesidad de negocio y crea la Historia de Usuario de lanzamiento. | Product Manager | Jira | 30 min | Historia de Usuario creada | La información suele llegar incompleta o inconsistente. | ✅ Alto |
| 2 | Espera de validación | La Historia de Usuario queda pendiente de revisión por parte de OPS durante el siguiente Sprint. | OPS | Jira | 1 Sprint (1 semana) | Historia de Usuario en espera | Cuello de botella por capacidad operativa. | ✅ Alto |
| 3 | Validación documental | OPS revisa manualmente la Historia de Usuario y verifica que toda la información requerida esté completa. | OPS | Jira | 1 hora | Historia de Usuario validada | Revisión completamente manual y repetitiva. | ✅ Alto |
| 4 | Correcciones | Si la Historia de Usuario presenta información incompleta, se devuelve al Product Manager para realizar ajustes. | Product Manager / OPS | Jira | Variable | Historia de Usuario corregida | Muchas iteraciones y reprocesos. | ✅ Alto |
| 5 | Construcción del Brief | OPS analiza la información y construye manualmente el Brief para Marketing. | OPS | Word / Google Docs | 1 hora | Marketing Brief | Duplica información existente en la Historia de Usuario. | ✅ Alto |
| 6 | Coordinación operativa | OPS coordina el lanzamiento entre Producto, Marketing y las demás áreas involucradas. | OPS | WhatsApp / Reuniones | Variable | Lanzamiento coordinado | Gran dependencia de comunicación manual. | ✅ Alto |
| 7 | Entrega a Marketing | OPS comparte el Brief con Marketing para iniciar la planeación del lanzamiento. | OPS | WhatsApp | 5 min | Brief entregado | No existe trazabilidad ni control de versiones. | ✅ Alto |
| 8 | Planeación de la comunicación | Marketing analiza el Brief, define la estrategia de comunicación y crea las tareas correspondientes. | Marketing | Notion | Variable | Plan de comunicación | La estrategia depende principalmente de la experiencia del equipo y no de una metodología basada en datos. | 🟡 Medio |
| 9 | Producción de recursos | Marketing, Diseño y Academy crean piezas gráficas, tutoriales, manuales, videos y demás recursos necesarios. | Marketing / Academy | Notion + Google Drive | Variable | Recursos del lanzamiento | Seguimiento distribuido entre múltiples herramientas. | 🟡 Medio |
|10 | Consolidación del lanzamiento | Marketing organiza todos los recursos dentro de la carpeta oficial del lanzamiento y los comparte con OPS. | Marketing | Google Drive | Variable | Carpeta del lanzamiento | No existe validación automática de entregables. | 🟡 Medio |
|11 | Revisión y aprobación | OPS revisa los recursos, los comparte con el Product Manager y posteriormente se realiza la aprobación final del Head. | OPS / PM / Head | Google Drive | Variable | Recursos aprobados | Seguimiento manual y múltiples iteraciones de aprobación. | 🟡 Medio |
|12 | Ejecución del lanzamiento | Se publica la funcionalidad y se ejecuta la estrategia de comunicación mediante Userpilot y los demás canales. | Marketing | Userpilot + Canales propios | Variable | Lanzamiento ejecutado | La ejecución está distribuida entre diferentes herramientas sin una vista centralizada. | 🟡 Medio |
|13 | Medición y cierre | Product Growth Marketing y Data analizan los resultados, documentan aprendizajes y realizan el cierre del lanzamiento. | Product Growth Marketing + Data | Power BI + Userpilot + Word / Excel | Variable | Informe de resultados y lecciones aprendidas | No existe una base de conocimiento centralizada ni reutilización estructurada de aprendizajes. | ✅ Alto |


## Paso 1 — Definición de la iniciativa

### Responsable
Product Manager

### Herramienta
Jira

### Descripción
El Product Manager identifica una necesidad de negocio, una oportunidad o una nueva funcionalidad y crea la Historia de Usuario de lanzamiento, documentando el contexto, objetivos, alcance y recursos necesarios.

### Tiempo estimado
30 minutos.

### Problemas identificados
- La información suele llegar incompleta.
- No existe un estándar para documentar la información.
- Se omiten recursos importantes (Figma, Loom, Tango, métricas, etc.).

### Oportunidades de automatización
- Formularios inteligentes.
- Validación de campos obligatorios.
- Checklists automáticos.
- Estandarización de la información.


## Paso 2 — Espera de validación

### Responsable
OPS

### Herramienta
Jira

### Descripción
La Historia de Usuario queda pendiente de revisión por parte del equipo de OPS hasta que exista disponibilidad dentro del Sprint.

### Tiempo estimado
1 Sprint (1 semana).

### Problemas identificados
- Cuello de botella operativo.
- Alto tiempo de espera.
- Retrasos en los lanzamientos.

### Oportunidades de automatización
- Priorización automática.
- Alertas de SLA.
- Gestión automática de la cola de revisión.


## Paso 3 — Validación documental

### Responsable
OPS

### Herramienta
Jira

### Descripción
OPS revisa manualmente la Historia de Usuario para validar que toda la información requerida para el lanzamiento se encuentre completa.

### Tiempo estimado
1 hora.

### Problemas identificados
- Revisión completamente manual.
- Alto consumo de tiempo.
- Validaciones repetitivas.

### Oportunidades de automatización
- Validación automática.
- Detección de información faltante.
- Checklists inteligentes.


## Paso 4 — Correcciones

### Responsable
Product Manager / OPS

### Herramienta
Jira

### Descripción
Cuando la Historia de Usuario presenta inconsistencias o información faltante, se devuelve al Product Manager para realizar las correcciones necesarias.

### Tiempo estimado
Variable.

### Problemas identificados
- Múltiples iteraciones.
- Reprocesos.
- Retrasos en el inicio del lanzamiento.

### Oportunidades de automatización
- Retroalimentación automática.
- Solicitudes de ajuste estructuradas.
- Validación previa al envío.


## Paso 5 — Construcción del Brief

### Responsable
OPS

### Herramienta
Word / Google Docs

### Descripción
OPS revisa nuevamente la Historia de Usuario y construye manualmente el Brief que será entregado al equipo de Marketing.

### Tiempo estimado
1 hora.

### Problemas identificados
- Duplicidad de información.
- Trabajo manual.
- Riesgo de inconsistencias entre documentos.

### Oportunidades de automatización
- Generación automática del Brief.
- Reutilización de información.
- Plantillas inteligentes.


## Paso 6 — Coordinación operativa

### Responsable
OPS

### Herramienta
WhatsApp / Reuniones

### Descripción
OPS coordina el lanzamiento entre Producto, Marketing y las demás áreas involucradas, resolviendo dudas y realizando seguimiento operativo.

### Tiempo estimado
Variable.

### Problemas identificados
- Comunicación distribuida.
- Poca trazabilidad.
- Seguimiento manual.

### Oportunidades de automatización
- Gestión centralizada del lanzamiento.
- Notificaciones automáticas.
- Seguimiento de estados.


## Paso 7 — Entrega a Marketing

### Responsable
OPS

### Herramienta
WhatsApp

### Descripción
OPS comparte el Brief con Marketing para iniciar la planeación y producción de los recursos del lanzamiento.

### Tiempo estimado
5 minutos.

### Problemas identificados
- Uso de WhatsApp como canal operativo.
- No existe control de versiones.
- Información difícil de rastrear.

### Oportunidades de automatización
- Flujo centralizado.
- Cambio automático de estado.
- Notificaciones automáticas.


## Paso 8 — Planeación de la comunicación

### Responsable
Marketing

### Herramienta
Notion

### Descripción
Marketing analiza el Brief, define la estrategia de comunicación y crea las tareas necesarias para Diseño, Copy, Academy y demás equipos.

### Tiempo estimado
Variable.

### Problemas identificados
- Estrategia basada principalmente en experiencia.
- No existe una metodología estandarizada.
- Planeación manual.

### Oportunidades de automatización
- Plantillas estratégicas.
- Creación automática de tareas.
- Checklists de comunicación.


## Paso 9 — Producción de recursos

### Responsable
Marketing / Academy

### Herramienta
Notion + Google Drive

### Descripción
Los diferentes equipos producen piezas gráficas, tutoriales, videos, manuales y demás recursos necesarios para el lanzamiento.

### Tiempo estimado
Variable.

### Problemas identificados
- Producción distribuida.
- Difícil seguimiento.
- Múltiples herramientas.

### Oportunidades de automatización
- Seguimiento centralizado.
- Validación de entregables.
- Dashboard de producción.


## Paso 10 — Consolidación del lanzamiento

### Responsable
Marketing

### Herramienta
Google Drive

### Descripción
Marketing consolida todos los recursos en la carpeta oficial del lanzamiento y los comparte con OPS.

### Tiempo estimado
Variable.

### Problemas identificados
- Validación manual.
- Recursos incompletos.
- Falta de control sobre entregables.

### Oportunidades de automatización
- Checklists automáticos.
- Validación de archivos.
- Control de versiones.


## Paso 11 — Revisión y aprobación

### Responsable
OPS / Product Manager / Head

### Herramienta
Google Drive

### Descripción
OPS revisa los recursos creados, el Product Manager realiza la validación funcional y posteriormente el Head aprueba el lanzamiento.

### Tiempo estimado
Variable.

### Problemas identificados
- Muchas iteraciones.
- Seguimiento manual.
- Aprobaciones distribuidas.

### Oportunidades de automatización
- Flujos de aprobación.
- Registro automático de comentarios.
- Estados automáticos.


## Paso 12 — Ejecución del lanzamiento

### Responsable
Marketing

### Herramienta
Userpilot + Canales propios

### Descripción
Se publica la funcionalidad y se ejecuta la estrategia de comunicación definida para el lanzamiento.

### Tiempo estimado
Variable.

### Problemas identificados
- Ejecución distribuida.
- Seguimiento manual.
- Baja visibilidad del estado del lanzamiento.

### Oportunidades de automatización
- Dashboard operativo.
- Monitoreo centralizado.
- Alertas automáticas. 


## Paso 13 — Medición y cierre

### Responsable
Product Growth Marketing + Data

### Herramienta
Power BI + Userpilot + Word / Excel

### Descripción
Se analizan los resultados del lanzamiento, se documentan los aprendizajes obtenidos y se realiza el cierre formal del proyecto.

### Tiempo estimado
Variable.

### Problemas identificados
- Información distribuida.
- Aprendizajes no reutilizados.
- Reportes manuales.

### Oportunidades de automatización
- Dashboard ejecutivo.
- Reportes automáticos.
- Base de conocimiento.
- Repositorio de aprendizajes.

---

# 5. Análisis del proceso actual - Métricas(KPIs)

| Indicador | Estado Actual |
|-----------|---------------|
| Tiempo total del proceso | Aproximadamente 2 semanas |
| Tiempo de espera | 1 Sprint (1 semana) |
| Tiempo de revisión de OPS | 1 hora por lanzamiento |
| Tiempo de creación del Brief | 1 hora |
| Tiempo mínimo de configuración en Userpilot | 5 horas |
| Número de herramientas involucradas | Jira, WhatsApp, Word, Notion, Google Drive, Userpilot, Power BI, Excel |
| Número de documentos principales | 3 (Historia de Usuario, Brief y Matriz de Lanzamientos) |
| Principal cuello de botella | Validación manual de OPS |
| Principal reproceso | Correcciones de Historias de Usuario incompletas |
| Principal problema de comunicación | Uso de WhatsApp como canal operativo |
| Nivel de automatización | Bajo |

## Tiempo total
2 semanas.

## Tiempo de espera
1 semana.

## Tiempo operativo
- 1 hora revisión OPS.
- 1 hora creación Brief.
- 5 horas Userpilot.
- Variables Marketing.

## Herramientas involucradas
- Jira
- WhatsApp
- Word
- Excel
- Notion
- Google Drive
- Userpilot
- Power BI

---

# 6. Principales problemas identificados (Cuellos de botella) 

## Problema 1
Duplicidad de información.

## Problema 2
Revisión manual de Historias de Usuario.

## Problema 3
Dependencia de WhatsApp.

## Problema 4
Creación manual del Brief.

## Problema 5
Falta de trazabilidad.

## Problema 6
Ausencia de estrategia basada en datos.

## Problema 7
No existe segmentación estratégica.

## Problema 8
No existe automatización del proceso.

---

# 7. Actividades manuales

Actualmente el proceso de lanzamientos depende en gran medida de actividades manuales realizadas por diferentes equipos, especialmente por OPS y Marketing. Estas actividades incrementan los tiempos de ejecución, generan reprocesos y dificultan la escalabilidad del proceso.

Las principales actividades manuales identificadas son:

- Revisión manual de Historias de Usuario.
- Validación manual de documentación.
- Solicitud manual de correcciones al Product Manager.
- Construcción manual del Marketing Brief.
- Envío del Brief mediante WhatsApp.
- Seguimiento manual del estado de los lanzamientos.
- Coordinación entre Producto, Marketing, Academy y demás equipos.
- Creación manual de tareas en Notion.
- Validación manual de recursos entregados.
- Seguimiento manual de aprobaciones.
- Consolidación manual de la carpeta del lanzamiento.
- Elaboración manual de reportes de seguimiento.
- Documentación manual de aprendizajes.
  
---

# 8. Problemas identificados

A partir del análisis del proceso actual se identificaron los siguientes problemas:

## Operativos
- Alto volumen de trabajo manual para el equipo de OPS.
- Duplicidad de información entre la Historia de Usuario y el Brief.
- Exceso de documentos para un mismo lanzamiento.
- Dependencia de múltiples herramientas sin integración.

## Comunicación
- Uso de WhatsApp como canal operativo.
- Baja trazabilidad de las solicitudes.
- Riesgo de pérdida de información.
- Comunicación descentralizada entre áreas.

## Estratégicos
- La estrategia de comunicación depende principalmente de la experiencia del equipo.
- No existe una metodología estandarizada para definir la adopción de funcionalidades.
- La segmentación de usuarios no siempre está basada en datos.
- No existe una mesa formal para definir la estrategia del lanzamiento.

## Seguimiento
- No existe un tablero centralizado para visualizar el estado de los lanzamientos.
- El seguimiento depende de Excel y reportes manuales.
- Es difícil identificar bloqueadores oportunamente.

## Medición
- La información se encuentra distribuida en diferentes plataformas.
- No existe un repositorio centralizado de aprendizajes.
- Los resultados de los lanzamientos no siempre retroalimentan futuros proyectos.
  
---

# 9. Oportunidades de mejora
El análisis del proceso actual evidencia una oportunidad para transformar el modelo operativo de lanzamientos mediante la implementación del Product Growth Marketing OS.
Las principales oportunidades identificadas son:

## Estandarización
- Diseñar una metodología única para todos los lanzamientos.
- Unificar criterios de validación.
- Estandarizar la estrategia de adopción.

## Automatización
- Automatizar la validación de Historias de Usuario.
- Automatizar la generación del Strategy Package.
- Eliminar la construcción manual del Brief.
- Automatizar el seguimiento del estado de los lanzamientos.
- Automatizar reportes ejecutivos.

## Centralización
- Centralizar toda la información del lanzamiento en un único sistema.
- Eliminar el uso de WhatsApp como herramienta operativa.
- Centralizar aprobaciones, comentarios y recursos.

## Estrategia
- Diseñar los lanzamientos bajo una metodología basada en datos.
- Incorporar segmentación inteligente de usuarios.
- Implementar experimentación continua.
- Definir KPIs desde el inicio del lanzamiento.

## Medición
- Construir dashboards ejecutivos en tiempo real.
- Unificar métricas provenientes de Userpilot, Power BI y otras fuentes.
- Crear una base de conocimiento reutilizable con aprendizajes de todos los lanzamientos.

## Evolución organizacional
- Transformar el rol de OPS desde un enfoque operativo hacia un rol de coordinación estratégica.
- Fortalecer la articulación entre Producto, Marketing y Growth.
- Reducir los tiempos del proceso de lanzamiento mediante automatización e inteligencia artificial.

---

# 10. Conclusiones del análisis AS-IS

El análisis del proceso actual permitió identificar que el modelo operativo de lanzamientos dentro de Dropi presenta una alta dependencia de actividades manuales, múltiples herramientas y procesos descentralizados, lo que incrementa los tiempos de ejecución y dificulta la escalabilidad.

Los principales hallazgos identificados son:
- El proceso depende en gran medida de actividades manuales realizadas por OPS.
- Existe duplicidad de información entre la Historia de Usuario y el Marketing Brief.
- WhatsApp se utiliza como canal operativo para coordinar lanzamientos, limitando la trazabilidad del proceso.
- La estrategia de comunicación no sigue una metodología estandarizada basada en datos.
- La información del lanzamiento se encuentra distribuida entre Jira, Notion, Google Drive, WhatsApp, Userpilot, Power BI y otros documentos.
- El seguimiento del estado de los lanzamientos es manual y requiere múltiples consultas entre equipos.
- No existe un tablero centralizado que permita visualizar el estado integral de cada lanzamiento.
- Los aprendizajes obtenidos al finalizar los proyectos no se consolidan en una base de conocimiento reutilizable.
- El mayor cuello de botella identificado corresponde al proceso de validación documental realizado por OPS.
- El tiempo total del proceso se incrementa debido a esperas, reprocesos y actividades administrativas de bajo valor.

Como resultado de este análisis, se concluye que existe una oportunidad significativa para rediseñar el proceso de lanzamientos mediante una metodología basada en Product Growth Marketing, automatización inteligente y una mejor articulación entre Producto, Marketing, Growth y Operaciones.

Los hallazgos documentados en este análisis servirán como punto de partida para el diseño del proceso futuro (Launch Process TO-BE), cuyo objetivo será reducir tiempos operativos, mejorar la coordinación entre equipos e incrementar la adopción de funcionalidades dentro de Dropi.