---
name: pitch-creator
description: Use this skill when the user asks to create a pitch for a Dropi epic or initiative. Triggered by "crea un pitch para", "prepara el pitch de", "dame el pitch de".
---

# Pitch Creator

## Objetivo

Generar un pitch ejecutivo para una épica o iniciativa de Dropi, extrayendo información de documentos existentes antes de preguntar.

## Cuándo usarlo

- "crea un pitch para [épica / iniciativa]"
- "prepara el pitch de [nombre]"
- "dame el pitch de [idea]"

## Instrucciones

### Paso 1 — Buscar información existente

1. **Revisar `docs-sync/`** para documentos relacionados:
   - Research → datos, dolores, usuarios afectados
   - Kickoffs → contexto, equipo, apetencia
   - MoSCoW → priorización de features
2. **Revisar `approved_context`** para contexto oficial.
3. **Extraer automáticamente:**
   - El problema (de research o kickoff)
   - Usuarios afectados (de research)
   - Datos de respaldo (de research)

### Paso 2 — Solo preguntar lo esencial

**Preguntar solo si NO se encontró:**
- ¿Qué problema estamos resolviendo? (si no hay research ni kickoff)
- ¿Cuánto tiempo estamos dispuestos a invertir?

**Todo lo demás → inferir o marcar como `[por confirmar]`.**

### Paso 3 — Generar el pitch

Las secciones y su orden oficial viven en `canon/dropi_methodology.md` → "Pitch" (no redefinir esta lista aquí; si cambia, se actualiza solo ahí):

**Título del Pitch** — breve y descriptivo.

**1. Problema**
- Qué problema, por qué es importante, cómo se resuelve hoy.

**2. Apetencia**
- Tiempo máximo, restricciones.

**3. Solución** *(Opcional — generar si hay suficiente contexto)*

**4. Consideraciones Adicionales** *(Opcional)*

### Paso 4 — Presentar y publicar

1. Presenta como borrador.
2. Si el usuario aprueba → ofrecer: "¿Quieres publicarlo en Confluence?" → `/publish-to-confluence`

## Restricciones

- Secciones 3 y 4 son opcionales; no forzar sin información.
- No inventar datos; usar `[dato por confirmar]`.
- Tono directo y ejecutivo.
- **Extraer de documentos existentes primero.**

## Salida esperada

Un pitch completo listo para presentar a stakeholders.
