---
name: epic-creator
description: Use this skill when the user asks to create, draft or describe a Dropi epic. Triggered by phrases like "dame la descripción de la siguiente épica", "crea la épica de", "describe la épica para".
---

# Epic Creator

## Objetivo

Generar la descripción completa de una épica siguiendo la metodología oficial de Dropi, extrayendo la mayor cantidad de información posible de documentos ya existentes.

## Cuándo usarlo

- Cuando el usuario pide crear o redactar una épica
- Cuando el usuario dice "dame la descripción de la siguiente épica"
- Cuando el usuario necesita estructurar una iniciativa como épica de Jira

## Instrucciones

### Paso 1 — Buscar información existente (antes de preguntar nada)

1. **Revisar `docs-sync/`** para documentos sincronizados de Drive relacionados con la iniciativa:
   - Kickoffs → extraer contexto, problema, equipo, fases
   - Research → extraer dolores, usuarios afectados, datos de respaldo
   - Planning → extraer fases, cronograma
   - Pitches → extraer problema, apetencia, solución propuesta
2. **Revisar `approved_context`** en Supabase para contexto ya aprobado del proyecto.
3. **Revisar `research-brain/`** para investigaciones relevantes.

### Paso 2 — Completar con lo que falta

Solo después de haber revisado las fuentes anteriores, verificar qué campos faltan.

**Campos obligatorios** (preguntar SOLO si no se pudieron inferir):
- Sigla del producto (DROPI / DROPI APP / ADMIN / CAS)
- Nombre de la iniciativa

**Campos con default inteligente** (NO preguntar, usar default):
- País → si no se menciona, usar `Colombia` (mercado principal)
- Usuarios afectados → inferir del documento fuente o usar `Todos los usuarios`
- Métricas → usar `[Métricas por definir con el equipo de datos]`
- Links de documentación → usar `[Por agregar]` como placeholder

### Paso 3 — Generar la épica

Leer `canon/dropi_methodology.md` y generar con TODAS las secciones:
- **Título** (formato: `[Sigla]: [Nombre]_[País]_[Usuarios]`)
- **Contexto y descripción del problema** — extraído del kickoff/research/pitch
- **¿Qué buscamos?** — extraído del kickoff o inferido del problema
- **Fases del proceso** — extraídas del planning o propuestas basadas en el contexto
- **Criterios de éxito y métricas** — del kickoff si existen, o `[por definir]`
- **Público objetivo** — inferido de los documentos
- **Documentación** — links a los documentos sincronizados

### Paso 4 — Presentar y publicar

1. Presenta como borrador para aprobación del usuario.
2. Si el usuario aprueba:
   - Usar `canon-keeper` para guardarlo en `approved_context`
   - Ofrecer: "¿Quieres que la publique en JIRA?" → usar `/publish-to-jira`

## Restricciones

- Nunca inventar métricas o datos; usar placeholders claros.
- No crear la épica sin al menos el contexto del problema (de un documento o del usuario).
- El título debe seguir EXACTAMENTE el formato oficial.
- **Priorizar extraer información de documentos existentes** antes de preguntar al usuario.

## Salida esperada

Una épica lista para copiar en Jira, en el formato completo de Dropi.
