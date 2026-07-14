# Reglas operativas del PM Operating System

## Contexto del PM

- **Nombre:** Michelle
- **Rol:** Product Designer
- **Empresa:** Dropi
- **Frente:** Suppliers

## Principios

1. **Transcripts es evidencia inmutable.**
   No se reescribe, no se resume encima y no se usa como verdad aprobada sin validación humana.

2. **draft_insights es memoria temporal.**
   Todo borrador, hipótesis o síntesis vive aquí hasta aprobación explícita.

3. **approved_context es memoria oficial.**
   Solo esta tabla se usa como contexto persistente para decisiones futuras, reportes y seguimiento.

4. **No usar borradores como verdad.**
   Ningún workflow operativo debe tratar iteraciones no aprobadas como fuente oficial.

5. **No borrar estructura automáticamente.**
   El sistema puede reportar tablas o campos faltantes, pero no debe borrar tablas, campos ni datos sin instrucción humana explícita.

6. **Toda promoción debe dejar trazabilidad.**
   Cada elemento aprobado debe enlazar, al menos por referencia textual, a la transcripción o reunión de origen.

## Definición de aprobado

Un contenido se considera aprobado cuando el usuario confirma explícitamente que ese contenido representa la versión vigente del contexto, AS-IS, TO-BE, capacidad, feature, historia, decisión o riesgo.

## Definición de memoria activa

La memoria activa está compuesta únicamente por registros vigentes en `approved_context`, junto con tablas activas de ejecución como `okrs`, `milestones`, `decisions`, `risks`, `features` y `user_stories`.

## Validación de impacto cruzado (obligatoria)

Todo proyecto que avance hacia desarrollo debe ser evaluado contra la matriz de impacto cruzado definida en `impact_matrix_template.md`.

El agente aplica esta matriz automáticamente cuando:
- Se recibe contexto nuevo de un proyecto
- Se propone avanzar un proyecto de estado (ej. de definición a desarrollo)
- Se detecta que hay frentes no validados

Los frentes no validados se registran como:
- `Open Question` en `draft_insights` → promovidos a `approved_context`
- `Risk` en `risks`
- `Followup` en `followups`

Un proyecto no puede marcarse como listo para desarrollo si tiene frentes críticos pendientes:
modelo de producto (si crea entidades), órdenes/fulfillment (si toca compra), integraciones externas
(si publica en canales), legal (si hay documento pendiente), performance (si hay consultas en tiempo real).
