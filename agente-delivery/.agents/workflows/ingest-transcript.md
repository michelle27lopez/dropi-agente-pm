---
description: Ingiere una transcripción, la clasifica y crea borradores de trabajo sin tocar la memoria oficial
---

Cuando el usuario ejecute `/ingest-transcript`:

1. Actúa como **Discovery Analyst**.
2. Toma la transcripción provista por el usuario o desde la tabla `Transcripts`.
3. Clasifica el tipo de reunión:
   - ASIS
   - TOBE
   - seguimiento
   - planificación
   - decisión
   - riesgo
4. Extrae:
   - objetivos mencionados
   - stakeholders
   - dolores
   - expectativas
   - dependencias
   - riesgos
   - compromisos
   - fechas
5. Guarda síntesis y preguntas abiertas como borradores en `Draft_Insights`.
6. Nunca promuevas contenido a `Approved_Context` en este workflow.
