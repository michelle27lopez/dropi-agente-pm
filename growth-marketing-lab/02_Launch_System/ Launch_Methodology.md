# Launch Methodology

| Campo | Valor |
|-------|-------|
| Documento | Launch Methodology |
| Área | Product Growth Marketing |
| Módulo | Launch System |
| Versión | 1.0 |
| Estado | En construcción |
| Responsable | Product Growth Marketing |

---

# 1. Objetivo

Definir la metodología oficial mediante la cual Product Growth Marketing diseña, coordina, ejecuta y mide los lanzamientos de funcionalidades dentro de Dropi.

Esta metodología establece las fases, principios y criterios que deberán seguir todos los lanzamientos, garantizando que cada funcionalidad llegue al usuario correcto, mediante el canal adecuado, en el momento oportuno y con una estrategia basada en datos.

---

# 2. Principios de la metodología

Todo lanzamiento deberá cumplir los siguientes principios:

- Basado en datos.
- Centrado en el usuario.
- Orientado a la adopción.
- Medible.
- Experimental.
- Iterativo.
- Colaborativo.
- Escalable.
- Automatizable.

---

# 3. North Star

Incrementar el porcentaje de adopción de funcionalidades por perfil de usuario.
Todo lanzamiento deberá contribuir al crecimiento de este indicador.

---

# 4. Componentes de la metodología

La metodología está compuesta por nueve fases:
1. Definición de la iniciativa
2. Validación
3. Diseño estratégico 
4. Mesa estratégica de lanzamientos
5. Preparación
6. Aprobaciones
7. Ejecución
8. Medición
9. Aprendizajes

Cada fase posee objetivos, entradas, salidas, responsables y criterios de avance.

---

# 5. Fases

## Fase 1 — Definición de la iniciativa

### Objetivo
Formalizar una iniciativa de producto que tenga el potencial de generar valor para el negocio y para los usuarios.

### Objetivo de negocio
Asegurar que toda funcionalidad o mejora que ingrese al proceso de lanzamiento tenga un propósito claro, una necesidad identificada y un impacto esperado sobre los objetivos estratégicos de Dropi.

### Entradas
- Necesidad del negocio.
- Oportunidad identificada.
- Hallazgos de investigación.
- Resultados de experimentos.
- Requerimientos de clientes.
- Objetivos estratégicos.
- Roadmap de Producto.

### Actividades principales
- Identificación de la oportunidad.
- Definición del problema.
- Priorización de la iniciativa.
- Documentación inicial.
- Creación de la Historia de Usuario en Jira.

### Responsable principal
Product Manager

### Participan
- Product Manager
- Product Growth Marketing
- Producto
- Tecnología

### Salidas
- Historia de Usuario creada.
- Objetivos del lanzamiento definidos.
- Alcance preliminar aprobado.

### Criterios de avance
Existe una Historia de Usuario con la información mínima requerida para iniciar el proceso de validación.

- Existe una Historia de Usuario creada.
- Se documentó el objetivo del lanzamiento.
- Se definió el alcance preliminar.
- Se adjuntó la información mínima requerida para iniciar la validación.

### Automatización esperada
El sistema asistirá al Product Manager durante la creación de la Historia de Usuario mediante formularios inteligentes, validaciones automáticas y recomendaciones de información faltante antes de permitir que la iniciativa avance a la siguiente fase.
El objetivo de esta automatización es reducir el tiempo de validación de aproximadamente una semana a menos de un día, permitiendo que OPS dedique su tiempo al análisis estratégico y no a tareas operativas.

## Entregables
Si la iniciativa cumple con los requisitos mínimos
- Historia de Usuario creada en Jira.
- Objetivos del lanzamiento documentados.
- Alcance preliminar definido.
- Recursos iniciales asociados (Figma, documentación, etc.).
- Estado del lanzamiento actualizado como "Pendiente de Validación".

Si la iniciativa requiere ajustes
- Historia de Usuario creada en estado borrador.
- Observaciones registradas.
- Solicitud de ajustes enviada al Product Manager.
- Estado del lanzamiento actualizado como "Pendiente de ajustes".

### Posibles resultados de la fase
Aprobada
- Historia de Usuario creada.
- Estado actualizado a "Pendiente de Validación".
  
Requiere ajustes
- Historia de Usuario devuelta al Product Manager.
- Observaciones registradas.
- Estado actualizado a "Pendiente de ajustes".

### Preguntas de decisión
- ¿Qué problema de negocio o de usuario busca resolver esta iniciativa?
- ¿Por qué esta funcionalidad debe desarrollarse?
- ¿Qué evidencia respalda esta necesidad (datos, investigación, feedback, experimentos, etc.)?
- ¿Qué perfiles de usuario se verán impactados?
- ¿Cuál es el objetivo principal del lanzamiento?
- ¿Cómo contribuirá esta iniciativa a los objetivos del negocio?
- ¿Qué métricas se espera impactar?
- ¿La iniciativa cuenta con la información mínima necesaria para iniciar el proceso de lanzamiento?
- ¿Existen riesgos conocidos que deban considerarse desde el inicio?
- ¿La iniciativa está lista para pasar a la fase de validación?


## Fase 2 — Validación

### Objetivo
Verificar que la iniciativa cuente con toda la información funcional, técnica y estratégica necesaria para iniciar el diseño del lanzamiento.

### Objetivo de negocio
Reducir reprocesos, retrasos y devoluciones, garantizando que todas las áreas trabajen sobre información completa, consistente y validada.

### Entradas
- Historia de Usuario creada.
- Recursos asociados (Figma, Loom, Tango, documentación, etc.).
- Objetivos del lanzamiento.
- KPIs definidos.
- Segmentación inicial (si aplica).

### Actividades principales
- Revisar la Historia de Usuario.
- Validar que todos los campos obligatorios estén completos.
- Verificar la existencia de la documentación requerida.
- Identificar información faltante o inconsistencias.
- Solicitar ajustes al Product Manager cuando sea necesario.
- Aprobar la Historia de Usuario para pasar a la fase estratégica.

### Responsable principal
OPS

### Participan
- OPS
- Product Manager
- Product Growth Marketing

### Salidas
- Historia de Usuario validada.
- Observaciones registradas (si aplica).
- Solicitudes de ajuste enviadas al PM (si aplica).

### Entregables
- Historia de Usuario aprobada para continuar.
- Checklist de validación completado.

### Criterios de avance
- Todos los campos obligatorios están completos.
- Existe la documentación requerida.
- No existen bloqueadores para continuar.
- La Historia de Usuario fue aprobada por OPS.

### Automatización esperada
El sistema realizará una validación automática de la Historia de Usuario verificando:

- Campos obligatorios.
- Documentación requerida.
- Fechas.
- Recursos asociados.
- Inconsistencias.
- Información faltante.

Si encuentra errores, notificará automáticamente al Product Manager para realizar las correcciones antes de continuar.
El objetivo de esta automatización es reducir el tiempo de validación de aproximadamente una semana a menos de un día, permitiendo que OPS dedique su tiempo al análisis estratégico y no a tareas operativas.

### Preguntas que deben responderse
- ¿La Historia de Usuario está completa?
- ¿Existe toda la documentación requerida?
- ¿Falta algún recurso para el lanzamiento?
- ¿Existen bloqueadores?
- ¿La iniciativa está lista para diseñar la estrategia de adopción?

### Entregables
Validación aprobada
- Historia de Usuario validada.
- Checklist de validación diligenciado y aprobada
- Observaciones y comentarios registrados (si aplica).
- Solicitud de ajustes al Product Manager (si aplica).
- Estado del lanzamiento actualizado.
- Aprobación para iniciar el Diseño Estratégico.
- Inicio de la Fase 3 (Diseño Estratégico).

Si la HA no cumple con los criterios: 
- Historia de Usuario devuelta al Product Manager.
- Observaciones documentadas y registradas. 
- Lista de ajustes requeridos.
- Notificación automática al Product Manager.
- Estado del lanzamiento actualizado como "Pendiente de ajustes".

### Preguntas de decisión
Aprobada
- Historia de Usuario creada.
- Estado actualizado a "Pendiente de Validación".
  
Requiere ajustes
- Historia de Usuario devuelta al Product Manager.
- Observaciones registradas.
- Estado actualizado a "Pendiente de ajustes".


## Fase 3 — Diseño Estratégico

### Objetivo
Diseñar la estrategia de adopción que permitirá maximizar el uso de la funcionalidad por parte de los usuarios objetivo.

### Objetivo de negocio
Definir una estrategia basada en datos que garantice que cada lanzamiento llegue al usuario correcto, mediante el canal adecuado y con el mensaje más efectivo.

### Entradas
- Historia de Usuario validada.
- Objetivos del lanzamiento.
- KPIs.
- Recursos funcionales.
- Información de negocio.
- Datos de usuarios.
- Insights de producto.

### Actividades principales
- Analizar la funcionalidad.
- Definir la segmentación.
- Definir la estrategia de adopción.
- Definir objetivos de comunicación.
- Definir canales.
- Diseñar la estrategia de Userpilot.
- Definir experimentos.
- Definir KPIs.
- Construir el Strategy Package.

### Responsable principal
Product Growth Marketing

### Participan
- Product Growth Marketing
- Product Manager
- Marketing
- OPS
- Data
- Academy (si aplica)

### Salidas
- Strategy Package.
- Estrategia de adopción definida.

### Posibles resultados de la fase

Aprobada
- Strategy Package aprobado.
- Inicio de la Mesa Estratégica.

Requiere ajustes
- Ajustes solicitados al Strategy Package.
- Observaciones documentadas.

### Criterios de avance
- Segmentación definida.
- KPIs definidos.
- Estrategia de comunicación definida.
- Estrategia de Userpilot definida.
- Strategy Package aprobado.

### Automatización esperada
El sistema generará un primer borrador del Strategy Package a partir de la Historia de Usuario y propondrá segmentaciones, canales, experimentos y KPIs para ser revisados por Product Growth Marketing.

### Preguntas de decisión
- ¿Qué problema resuelve la funcionalidad?
- ¿Quién debe utilizarla?
- ¿Qué segmentos deben recibirla?
- ¿Qué usuarios no deben recibirla?
- ¿Qué comportamiento esperamos generar?
- ¿Cómo mediremos el éxito?
- ¿Qué experimentos realizaremos?


## Fase 4 — Mesa Estratégica de Lanzamientos

### Objetivo
Validar y construir conjuntamente la estrategia definitiva del lanzamiento entre Product Growth Marketing, Marketing y las áreas involucradas.

### Objetivo de negocio
Alinear a todas las áreas antes de iniciar la producción de recursos, garantizando que todas las decisiones estén fundamentadas en datos y objetivos comunes.

### Entradas
- Strategy Package.
- Historia de Usuario.
- KPIs.
- Recursos disponibles.

### Actividades principales
- Revisar la estrategia.
- Validar segmentación.
- Definir canales.
- Definir mensajes.
- Definir piezas.
- Definir recursos de Academy.
- Definir Userpilot.
- Aprobar cronograma.

### Responsable principal
Product Growth Marketing

### Participan
- Product Growth Marketing
- Marketing
- Product Manager
- OPS
- Academy
- Data
- Diseño

### Salidas
- Estrategia aprobada.
- Plan de ejecución aprobado.

### Posibles resultados de la fase
Aprobada
- Marketing inicia producción.

Requiere ajustes
- Ajustes documentados.
- Nueva sesión de revisión.

### Criterios de avance
- Estrategia aprobada.
- Canales definidos.
- Segmentación aprobada.
- Recursos identificados.

### Automatización esperada
El sistema consolidará automáticamente toda la información del Strategy Package y generará un resumen ejecutivo para facilitar la toma de decisiones durante la Mesa Estratégica.

### Preguntas de decisión
- ¿La estrategia responde al objetivo del lanzamiento?
- ¿Los segmentos son correctos?
- ¿Los canales son adecuados?
- ¿Qué riesgos existen?


## Fase 5 — Preparación

### Objetivo
Construir todos los recursos necesarios para ejecutar el lanzamiento.

### Objetivo de negocio
Garantizar que el lanzamiento cuente con todos los recursos antes de salir a producción.

### Entradas
- Strategy Package aprobado.
- Plan de comunicación.
- Recursos de diseño.

### Actividades principales
- Crear piezas.
- Crear tutoriales.
- Crear Academy.
- Configurar Userpilot.
- Preparar campañas.
- Organizar Drive.

### Responsable principal
Marketing

### Participan
- Marketing
- Academy
- Diseño
- Product Growth Marketing
- OPS

### Salidas
- Recursos listos.

### Posibles resultados de la fase
Aprobada
- Recursos aprobados.

Requiere ajustes
- Ajustes solicitados.
- Recursos en corrección.

### Criterios de avance
- Todos los recursos creados.
- Recursos aprobados.
- Userpilot configurado.

### Automatización esperada
El sistema generará automáticamente checklists, tareas y seguimiento del estado de cada recurso.

### Preguntas de decisión
- ¿Todos los recursos están listos?
- ¿Existe contenido suficiente?
- ¿Academy está preparado?


## Fase 6 — Aprobaciones

### Objetivo
Obtener la aprobación final antes del lanzamiento.

### Objetivo de negocio
Garantizar que el lanzamiento cumple los estándares definidos por la organización.

### Entradas
- Recursos finalizados.
- Campañas listas.
- Userpilot configurado.

### Actividades principales
- Revisión del PM.
- Revisión de Product Growth.
- Revisión del Head.
- Aprobación final.

### Responsable principal
Product Growth Marketing

### Participan
- Product Manager
- Product Growth Marketing
- Head de Producto

### Salidas
- Lanzamiento aprobado.

### Posibles resultados de la fase
Aprobada
- Autorización para ejecutar.

Requiere ajustes
- Ajustes solicitados.

### Criterios de avance
- Todas las aprobaciones obtenidas.

### Automatización esperada
El sistema notificará automáticamente a los responsables y registrará las aprobaciones del lanzamiento.

### Preguntas de decisión
- ¿El lanzamiento está listo?
- ¿Existen riesgos pendientes?


## Fase 7 — Ejecución

### Objetivo
Ejecutar el lanzamiento conforme a la estrategia aprobada.

### Objetivo de negocio
Maximizar la adopción de la funcionalidad durante su salida a producción.

### Entradas
- Lanzamiento aprobado.

### Actividades principales
- Publicar la funcionalidad.
- Ejecutar campañas.
- Activar Userpilot.
- Publicar Academy.
- Monitorear incidencias.

### Responsable principal
Product Growth Marketing

### Participan
- Marketing
- Tecnología
- OPS
- Academy

### Salidas
- Funcionalidad lanzada.

### Posibles resultados de la fase
Ejecutado
- Lanzamiento exitoso.

Incidencias
- Activación del protocolo de contingencia.

### Criterios de avance
- Funcionalidad disponible.
- Comunicaciones ejecutadas.

### Automatización esperada
El sistema monitoreará el estado del lanzamiento y notificará incidencias en tiempo real.

### Preguntas de decisión
- ¿Todo salió según lo planeado?
- ¿Existen incidentes?


## Fase 8 — Medición

### Objetivo
Evaluar el impacto del lanzamiento mediante indicadores de negocio y adopción.

### Objetivo de negocio
Determinar si la estrategia logró los resultados esperados.

### Entradas
- Datos de uso.
- KPIs.
- Eventos.
- Métricas.

### Actividades principales
- Medir adopción.
- Analizar KPIs.
- Evaluar experimentos.
- Identificar oportunidades.

### Responsable principal
Product Growth Marketing

### Participan
- Data
- Product Growth Marketing
- Product Manager

### Salidas
- Informe de resultados.

### Posibles resultados de la fase
Objetivos alcanzados
- Inicio de aprendizajes.

Objetivos no alcanzados
- Plan de optimización.

### Criterios de avance
- KPIs medidos.
- Resultados documentados.

### Automatización esperada
El sistema consolidará automáticamente las métricas provenientes de las diferentes fuentes de datos y actualizará los dashboards ejecutivos.

### Preguntas de decisión
- ¿Se alcanzó la adopción esperada?
- ¿Qué segmentos respondieron mejor?
- ¿Qué canal funcionó mejor?


## Fase 9 — Aprendizajes

### Objetivo
Documentar los aprendizajes obtenidos para mejorar futuros lanzamientos.

### Objetivo de negocio
Convertir cada lanzamiento en una fuente de conocimiento para optimizar continuamente el proceso.

### Entradas
- Resultados.
- KPIs.
- Retroalimentación.
- Experimentos.

### Actividades principales
- Documentar aprendizajes.
- Registrar buenas prácticas.
- Registrar oportunidades de mejora.
- Actualizar playbooks.

### Responsable principal
Product Growth Marketing

### Participan
 Product Growth Marketing
- Product Manager
- Marketing
- Data
- OPS

### Salidas
- Informe de aprendizajes.

### Posibles resultados de la fase
Cerrado
- Lanzamiento finalizado.

Mejora continua
- Nuevas iniciativas identificadas.

### Criterios de avance
- Aprendizajes documentados.
- Recomendaciones registradas.

### Automatización esperada
El sistema generará un reporte ejecutivo del lanzamiento y almacenará automáticamente los aprendizajes para reutilizarlos en futuros proyectos.

### Preguntas de decisión
- ¿Qué funcionó?
- ¿Qué no funcionó?
- ¿Qué debemos repetir?
- ¿Qué debemos cambiar?

---

# 6. Roles dentro de la metodología

La metodología de lanzamientos involucra diferentes áreas de la organización, cada una con responsabilidades específicas durante las distintas fases del proceso.

| Rol | Responsabilidad principal |
|------|---------------------------|
| Product Manager | Definir la iniciativa y liderar el producto. |
| Product Growth Marketing | Diseñar la estrategia de adopción y coordinar el lanzamiento. |
| OPS | Validar y coordinar el proceso operativo. |
| Marketing | Ejecutar la estrategia de comunicación. |
| Academy | Crear recursos de formación cuando aplique. |
| Tecnología | Desarrollar y desplegar la funcionalidad. |
| Data | Medir el impacto del lanzamiento. |
| Head de Producto | Aprobar el lanzamiento. |

---

# 7. Resultado esperado

La implementación de esta metodología permitirá que todos los lanzamientos dentro de Dropi sean gestionados bajo un proceso estandarizado, medible y orientado a la adopción.

Se espera que la metodología contribuya a:
- Reducir tiempos operativos.
- Disminuir reprocesos.
- Mejorar la coordinación entre áreas.
- Incrementar la adopción de funcionalidades.
- Estandarizar la toma de decisiones.
- Promover una cultura basada en datos y experimentación.
- Facilitar la automatización progresiva del proceso de lanzamientos mediante el Product Growth Marketing OS.