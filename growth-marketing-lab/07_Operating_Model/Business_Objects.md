# Business_Objects

| Campo | Valor |
|-------|-------|
| Documento | Business Objects |
| Área | Product Growth Marketing |
| Módulo | Operating Model |
| Versión | 1.0 |
| Estado | En construcción |
| Responsable | Product Growth Marketing |

---

# 1. Objetivo

Definir los principales objetos del Product Growth Marketing OS.

Cada objeto representa un elemento del negocio que posee información propia, un ciclo de vida, responsables, reglas y relaciones con otros objetos.

Este documento constituye el modelo conceptual sobre el cual se construirán los agentes de inteligencia artificial, dashboards, automatizaciones y procesos del sistema.

---

# 2. ¿Qué es un Business Object?

Un Business Object representa cualquier elemento del negocio que almacena información, evoluciona a través de diferentes estados y participa dentro de uno o varios procesos del Product Growth Marketing OS.

---

# 3. Catálogo de Objetos

## Historia de Usuario

### Descripción 
Documento creado por un Product Manager para solicitar el lanzamiento de una nueva funcionalidad, mejora o iniciativa.
Representa el punto de inicio del proceso de lanzamiento.

### Responsable
Product Manager

### Estado
- Borrador
- En revisión
- Validada
- Devuelta
- Lista para lanzamiento

### Se relaciona con
- Lanzamiento
- Strategy Package
- Marketing Brief
- Userpilot
- Experimentos
  
### Automatización esperada
La Historia de Usuario continuará siendo creada por el Product Manager dentro de Jira.
Una vez creada o actualizada, el Product Growth Marketing OS analizará automáticamente su contenido para:

- Validar que toda la información requerida esté completa.
- Identificar información faltante o inconsistencias.
- Verificar la existencia de recursos obligatorios (Figma, Loom, Tango, KPIs, fechas, segmentación, etc.).
- Clasificar automáticamente el tipo de lanzamiento.
- Detectar riesgos que puedan afectar el lanzamiento.
- Generar recomendaciones para el Product Manager antes de iniciar el proceso.
- Disparar automáticamente la creación del Strategy Package cuando la Historia de Usuario cumpla todos los criterios de validación.

El sistema permitirá revalidar automáticamente la Historia de Usuario cada vez que el Product Manager realice modificaciones, evitando revisiones manuales repetitivas por parte del equipo de OPS.
La automatización de este objeto podrá evolucionar progresivamente conforme el Product Growth Marketing OS incorpore nuevos agentes de inteligencia artificial, integraciones y flujos automatizados.

### Resultado esperado
Contener toda la información necesaria para iniciar un lanzamiento sin reprocesos.


## Lanzamiento

### Descripción
El Lanzamiento representa el proceso integral mediante el cual una funcionalidad, mejora o iniciativa es preparada, coordinada, ejecutada y medida dentro de Dropi.
Es el objeto central del Product Growth Marketing OS, ya que articula el trabajo entre Producto, Product Growth Marketing, Marketing, OPS, Academy, Tecnología, Data y las demás áreas involucradas.
Un lanzamiento no representa únicamente la salida de una funcionalidad a producción; también incluye toda la estrategia de adopción, comunicación, segmentación, experimentación, medición y documentación de aprendizajes.

### Objetivo
Coordinar y gestionar de manera integral todas las actividades necesarias para lograr que una funcionalidad alcance los objetivos de adopción definidos por el negocio.

### Responsable
Product Growth Marketing

### Participantes
- Product Manager
- Product Growth Marketing
- OPS
- Marketing
- Academy
- Tecnología
- Data
- Diseño
- Head de Producto

### Entradas

- Historia de Usuario validada.
- Strategy Package.
- Recursos funcionales (Figma, Loom, Tango).
- KPIs definidos.
- Segmentación.
- Plan de comunicación.
- Estrategia de Userpilot.
- Recursos de Marketing.

## Información que contiene
- Nombre del lanzamiento.
- Funcionalidad asociada.
- Product Manager responsable.
- Product Growth responsable.
- Estado del lanzamiento.
- Prioridad.
- Sprint.
- Fecha estimada.
- Fecha real de lanzamiento.
- Objetivos del lanzamiento.
- KPIs.
- Riesgos.
- Bloqueadores.
- Cronograma.
- Equipos involucrados.
- Recursos asociados.
- Estado de aprobaciones.
- Estado de Marketing.
- Estado de Academy.
- Estado de Userpilot.
- Estado de Analítica.
- Estado general.

### Estados
- Planeación
- Validación
- Diseño Estratégico
- Preparación
- Aprobación
- Listo para lanzamiento
- Lanzado
- Medición
- Cerrado
- Cancelado
- Aplazado

### Reglas de negocio
- Todo lanzamiento debe estar asociado a una Historia de Usuario.
- Todo lanzamiento debe contar con un Product Manager responsable.
- Todo lanzamiento debe tener un Strategy Package aprobado.
- Ningún lanzamiento podrá iniciar ejecución sin la aprobación del PM y del Head.
- Todo lanzamiento deberá contar con KPIs definidos antes de su ejecución.
- Todo lanzamiento deberá registrar sus aprendizajes al finalizar.

### Se relaciona con
- Historia de Usuario
- Strategy Package
- Marketing Brief
- Campaña de Comunicación
- Userpilot Flow
- Dashboard
- Experimentos
- Recursos del Lanzamiento
- Cronograma
- KPIs

### Automatización esperada
El Product Growth Marketing OS gestionará automáticamente el ciclo de vida completo del lanzamiento.
El sistema será responsable de:

- Crear automáticamente el registro del lanzamiento una vez la Historia de Usuario sea validada.
- Asociar todos los objetos relacionados (Strategy Package, Marketing Brief, Userpilot, Dashboard, Recursos, etc.).
- Actualizar automáticamente el estado del lanzamiento conforme avancen las diferentes áreas.
- Identificar bloqueadores y retrasos durante el proceso.
- Generar alertas cuando una actividad supere los tiempos definidos.
- Consolidar el estado general del lanzamiento para el Dashboard Ejecutivo.
- Registrar automáticamente las fechas clave del proceso.
- Calcular tiempos de ejecución por etapa.
- Mantener la trazabilidad completa del lanzamiento desde su creación hasta su cierre.
- Generar el reporte ejecutivo del lanzamiento al finalizar.

La automatización de este objeto evolucionará progresivamente conforme el Product Growth Marketing OS incorpore nuevos agentes de inteligencia artificial e integraciones con Jira, Userpilot, Google Workspace y otras herramientas de la compañía.

### Resultado esperado
Contar con un proceso de lanzamiento completamente trazable, medible y coordinado entre todas las áreas de la organización, reduciendo tiempos operativos, mejorando la comunicación transversal y aumentando la adopción de funcionalidades dentro de Dropi.


## Strategy Package

### Descripción 
Documento estratégico generado por el área de Product Growth Marketing que transforma una Historia de Usuario en un plan integral de adopción listo para ser ejecutado por las diferentes áreas de la compañía. El Strategy Package consolida toda la información estratégica necesaria para que Marketing, OPS, Academy, Userpilot, Analítica y los demás equipos involucrados ejecuten un lanzamiento de manera alineada, consistente y basada en datos.

### Responsable
Product Growth Marketing

### Objetivo
Convertir la información funcional entregada por el Product Manager en una estrategia integral de lanzamiento orientada a maximizar la adopción de la funcionalidad.

### Contenido
El Strategy Package podrá incluir, entre otros:

- Resumen ejecutivo del lanzamiento.
- Objetivo de negocio.
- Objetivo de adopción.
- Problema que resuelve.
- Usuarios objetivo.
- Segmentación.
- Hipótesis.
- Estrategia de comunicación.
- Canales.
- Estrategia de Userpilot.
- Estrategia de Academy.
- Estrategia de experimentación.
- KPIs.
- Riesgos.
- Cronograma.
- Responsables.

### Estado
- Borrador
- En construcción
- En revisión
- Aprobado
- Ejecutado

### Se relaciona con
- Historia de Usuario
- Lanzamiento
- Marketing Brief
- Userpilot Flow
- Dashboard
- Experimentos

### Automatización esperada
El Strategy Package será generado automáticamente por el Product Growth Marketing OS a partir de la información validada de la Historia de Usuario.
El sistema propondrá una primera versión estratégica que incluirá:

- Objetivos de adopción.
- Usuarios objetivo.
- Segmentación inicial.
- Hipótesis.
- Estrategia de comunicación.
- Recomendaciones de canales.
- Estrategia de Userpilot.
- Propuesta de experimentación.
- KPIs sugeridos.
- Riesgos identificados.

Posteriormente, Product Growth Marketing revisará, ajustará y aprobará el documento durante la Mesa Estratégica de Lanzamientos.
Una vez aprobado, el Strategy Package se convertirá en la fuente oficial de información para Marketing, Academy, Userpilot, Data y los demás equipos involucrados.
La automatización de este objeto podrá evolucionar progresivamente conforme el Product Growth Marketing OS incorpore nuevos agentes de inteligencia artificial, integraciones y flujos automatizados.

### Resultado esperado
Convertirse en la única fuente de verdad para la ejecución estratégica del lanzamiento.


## Marketing Brief

### Descripción
Documento operativo utilizado actualmente para entregar al equipo de Marketing la información necesaria para la ejecución de un lanzamiento.
En el modelo operativo actual, el Brief resume la información funcional de la Historia de Usuario y sirve como punto de partida para la creación de piezas, campañas y recursos de comunicación.
Dentro del Product Growth Marketing OS, este documento evolucionará progresivamente hasta ser reemplazado por el Strategy Package, reduciendo reprocesos y duplicidad de información.

### Responsable
OPS

### Objetivo
Centralizar la información necesaria para que Marketing pueda producir los recursos del lanzamiento.

### Estado
- Pendiente
- En elaboración
- Enviado
- Aprobado

### Se relaciona con
- Historia de Usuario
- Strategy Package
- Campaña de Comunicación
- Recursos del Lanzamiento

### Automatización esperada
Durante la transición hacia el Product Growth Marketing OS, el Marketing Brief será generado automáticamente a partir del Strategy Package.
La información será completada sin necesidad de diligenciar un nuevo documento manualmente.
En versiones futuras del sistema, el Marketing Brief dejará de existir como documento independiente y será reemplazado completamente por el Strategy Package, evitando duplicidad de información y reduciendo reprocesos entre OPS y Marketing.
La automatización de este objeto podrá evolucionar progresivamente conforme el Product Growth Marketing OS incorpore nuevos agentes de inteligencia artificial, integraciones y flujos automatizados.

### Resultado esperado
Facilitar la producción de contenidos mientras se realiza la transición hacia el nuevo modelo operativo.


## Campaña de comunicación

### Descripción
Conjunto de acciones de comunicación definidas para promover la adopción de una funcionalidad dentro de Dropi.
La campaña se diseña durante la Mesa Estratégica de Lanzamientos y puede combinar diferentes canales, formatos y mensajes según el segmento de usuarios definido.

### Responsable
Marketing

### Objetivo
Comunicar la funcionalidad adecuada, al usuario adecuado, por el canal adecuado y en el momento adecuado.

### Componentes
Medios propios y orgánicos
- Mensajes.
- Canales.
- Piezas.
- Tutoriales.
- Videos.
- Emails.
- WhatsApp.
- Userpilot.
- Academy.

### Estado
- Planeada
- En producción
- Lista
- Publicada
- Finalizada

### Se relaciona con
- Strategy Package
- Recursos del Lanzamiento
- Dashboard
- Userpilot Flow

### Automatización esperada
Una vez aprobada la estrategia de lanzamiento, el Product Growth Marketing OS generará automáticamente el plan inicial de campaña.
El sistema podrá:

- Sugerir canales de comunicación según el segmento objetivo.
- Recomendar mensajes clave.
- Proponer secuencias de comunicación.
- Identificar experiencias que deben implementarse en Userpilot.
- Generar el checklist operativo para Marketing.
- Crear automáticamente las tareas necesarias para la producción de piezas y contenidos.

El equipo de Marketing será responsable de validar, enriquecer y ejecutar la estrategia definida.
La automatización de este objeto podrá evolucionar progresivamente conforme el Product Growth Marketing OS incorpore nuevos agentes de inteligencia artificial, integraciones y flujos automatizados.

### Resultado esperado
Incrementar la adopción de la funcionalidad mediante una estrategia de comunicación alineada con los objetivos del lanzamiento.

---

# 4. Resumen de Objetos del Product Growth Marketing OS

| Objeto | Tipo | Responsable | Estado Actual | Evolución Esperada |
|---------|------|-------------|---------------|--------------------|
| Historia de Usuario | Core | Product Manager | Existe | Optimizada |
| Lanzamiento | Core | Product Growth Marketing | Existe | Orquestador central |
| Strategy Package | Core | Product Growth Marketing | Nuevo | Automatizado |
| Marketing Brief | Operativo | OPS | Existe | Reemplazado por Strategy Package |
| Campaña de Comunicación | Operativo | Marketing | Existe | Optimizada |

---

# 5. Relaciones entre Objetos

Historia de Usuario
        │
        ▼
Strategy Package
        │
        ▼
Lanzamiento
        │
        ├────────► Campaña de Comunicación
        │
        ├────────► Userpilot Flow
        │
        ├────────► Dashboard
        │
        └────────► Experimentos