---
name: intake-transcripcion
description: Usar cuando Juan pega una transcripción de reunión y quiere clasificarla, extraer señales y dejar un borrador estructurado vinculado a un proyecto — sin contaminar la memoria oficial.
---

# Intake de transcripción

## Objetivo
Convertir una transcripción cruda en insumos estructurados de trabajo, **sin tocar specs ni docs oficiales**.

## Instrucciones
1. Identifica **proyecto, fecha, participantes y tipo de reunión**.
2. Detecta el foco: AS-IS, TO-BE, seguimiento, riesgo o decisión.
3. Extrae señales: objetivos · stakeholders · dolores · expectativas · decisiones · riesgos · bloqueos · compromisos · fechas clave.
4. Redacta una **síntesis en borrador** y guárdala donde corresponda según tu sistema:
   - Acta → `reuniones/<fecha>-<tema>.md`
   - Pendientes/compromisos → añadir a `planning/todos.md`
   - Señales de proyecto → nota en `proyectos/<x>/` (borrador, NO en `spec.md`)
   - Si la transcripción es una fuente externa, regístrala en el `fuentes/_index.md` del repo bóveda (`cerebro-logistica-dropi` — no migró a Darwin). Apuntar al original, nunca copiarlo: `CLAUDE.md`, capa de datos.
5. **Conserva el origen** como evidencia: cita fuente + fecha; el original es la fuente de verdad.
6. Marca lo que sea decisión/dato con su **estado + fuente** (`spec-driven.md`).

## Restricciones
- No promover a `spec.md` ni a docs oficiales (eso es `/promover-spec`, con aprobación).
- No mezclar borradores con decisiones ya oficiales.
- Español, conciso.
