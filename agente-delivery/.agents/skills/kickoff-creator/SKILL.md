---
name: kickoff-creator
description: Use this skill when the user asks to create a kickoff document for a Dropi epic or project. Triggered by "crea un documento de kickoff para", "prepara el kickoff de".
---

# Kickoff Creator

## Objetivo

Generar el documento de kickoff de una épica o proyecto en Dropi, extrayendo información de documentos existentes antes de preguntar.

## Cuándo usarlo

- "crea un documento de kickoff para [épica / proyecto]"
- "prepara el kickoff de [iniciativa]"

## Instrucciones

### Paso 1 — Buscar información existente (antes de preguntar nada)

1. **Revisar `docs-sync/`** para documentos relacionados:
   - Pitches → problema, apetencia, solución propuesta
   - Research → datos de respaldo, dolores, usuarios
   - Planning → fases, equipo, cronograma
   - Épicas previas → contexto heredado
2. **Revisar `approved_context`** para contexto oficial del proyecto.
3. **Extraer automáticamente:**
   - Problema y por qué es importante
   - Usuarios afectados
   - Soluciones actuales y sus limitaciones
   - Equipo involucrado (si se menciona)

### Paso 2 — Solo preguntar lo mínimo faltante

**Preguntar solo si NO se encontró en ningún documento:**
- Título del proyecto (si no hay pitch aprobado)
- Tiempo y recursos asignados (apetencia)

**Usar defaults para el resto:**
- Riesgos de producto → tabla con `[por evaluar]` en nivel y mitigación
- Equipo → tabla con `[por confirmar]` si no hay información
- Próximos pasos → generar 3-5 pasos lógicos según la fase del proyecto

### Paso 3 — Generar el documento con TODAS las secciones

Las secciones y su orden oficial viven en `canon/dropi_methodology.md` → "Documento de Kickoff" (no redefinir esta lista aquí; si cambia, se actualiza solo ahí):

1. Título del Proyecto
2. Introducción (contexto, objetivos, apetencia)
3. Problema (descripción, impacto, soluciones actuales)
4. Riesgos de producto (tabla obligatoria: valor, usabilidad, factibilidad, viabilidad, legal)
5. Preguntas abiertas e hipótesis
6. Escenarios
7. Primeras ideas
8. Equipo del proyecto
9. Próximos pasos
10. Apéndices (links a research, wireframes, etc.)

### Paso 4 — Presentar y publicar

1. Presenta como borrador para aprobación.
2. Si el usuario aprueba → ofrecer:
   - "¿Quieres publicarlo en Confluence?" → usar `/publish-to-confluence`
   - "¿Quieres crear la épica a partir de este kickoff?" → usar `epic-creator`

## Restricciones

- No inventar nombres, fechas o niveles de riesgo; usar `[por definir]`.
- La tabla de riesgos es obligatoria.
- Tono ejecutivo y directo.
- **Priorizar extracción de documentos existentes** sobre preguntas al usuario.

## Salida esperada

Documento de kickoff completo en el formato oficial de Dropi.
