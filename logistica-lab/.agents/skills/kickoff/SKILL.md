---
name: kickoff
description: Usar cuando Juan pide armar el Kick-off de un proyecto/épica de Dropi. Se dispara con "crea el kickoff de", "prepara el kick-off de", "arma el arranque de [iniciativa]".
---

# Crear Kick-off de Producto (formato E2E de Juan)

## Objetivo
Generar la sección **Kick-off** del documento E2E. Es una de las dos secciones que **Juan (PM) redacta** (la otra es Hand-off — ver `metodologia/requisitos-doc-e2e.md` y `e2e-doc-roles`).

## Instrucciones
1. **Estructura oficial:** `agente-delivery/canon/dropi_methodology.md` §Documento de Kickoff y `agente-delivery/canon/e2e_methodology.md` §1 (Kick-off de Producto) — única fuente de las secciones. Lee además `metodologia/handoff-ti.md` §1 y `metodologia/requisitos-doc-e2e.md` para las reglas de contenido propias de logística (qué redacta el PM, qué no se saca).
2. Lee `proyectos/<x>/spec.md` como fuente (respeta estado+fuente; no contradigas el spec).
3. Genera el Kick-off con sus apartados:
   - **1.1 Información general & equipo** — nombre, célula, owner/PM, PD, stakeholder, fecha, estado
   - **1.2 Introducción y contexto** — el **POR QUÉ ahora** (cambio externo/interno, costo de no hacerlo)
   - **1.3 Problema, impacto y painpoints** — el **QUÉ**: frecuencia, importancia, segmento/target/size, ≥2 painpoints, objetivos de negocio/UX, **OKR/KR/Data**
   - **1.4 Enlaces** — Jira épica + solicitud, Figma, research (**enlaces reales**; NO prototipos no finales/HTML/maquetas)
   - **1.5 Dudas e incógnitas** — solo de negocio/funcional
4. **Respuestas, no preguntas**: lo no resuelto va a riesgos/pendientes, no como preguntas sueltas (`requisitos-doc-e2e.md`).
5. **No recortar contenido real** (regla base de `requisitos-doc-e2e.md`): "básico/límpialo" = quitar placeholders genéricos, NO borrar info real. Ante la duda, preservar y preguntar.
6. Presenta como borrador para confirmar.

## Restricciones
- NO va en Kick-off: esfuerzo técnico, tiempos de dev, stack, performance.
- No inventar nombres/fechas/OKR → `[por definir]`. Campo que no aplica → `N/A`.
- Español, tono ejecutivo.
