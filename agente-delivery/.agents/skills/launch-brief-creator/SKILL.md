---
name: launch-brief-creator
description: Use this skill when the user asks to create a launch brief for a Dropi feature or product. Triggered by "crea el brief de lanzamiento de", "prepara el brief de", "dame el brief para comunicaciones de".
---

# Launch Brief Creator

## Objetivo

Generar el brief de lanzamiento de una funcionalidad o producto de Dropi, extrayendo la mayor cantidad de información de documentos ya existentes.

## Cuándo usarlo

- "crea el brief de lanzamiento de [funcionalidad / épica]"
- "prepara el brief de [nombre]"
- "dame el brief para comunicaciones de [producto]"

## Instrucciones

### Paso 1 — Buscar información existente

1. **Revisar `docs-sync/`** y `approved_context`:
   - Épicas → nombre, descripción, usuarios afectados
   - Kickoffs → contexto, equipo responsable
   - Historias de usuario → funcionalidades específicas
   - Research → datos de respaldo, valor para el usuario
2. **Extraer automáticamente:**
   - Qué es y para quién (de la épica)
   - Beneficios (del kickoff/research)
   - Funcionalidades clave (de las historias)

### Paso 2 — Solo preguntar lo mínimo

**Preguntar solo si NO se encontró:**
- Nombre oficial del producto o funcionalidad
- Fecha o ventana de lanzamiento

**Usar defaults para:**
- Persona de producto responsable → `[por confirmar]`
- Recursos disponibles → tabla con `[por crear]` en enlaces
- Mensaje clave → proponer uno basado en el contexto

### Paso 3 — Generar el brief

Las secciones y su orden oficial viven en `canon/dropi_methodology.md` → "Brief de Lanzamiento" (no redefinir esta lista aquí; si cambia, se actualiza solo ahí):

1. Título del Proyecto
2. Descripción General (qué es, para quién)
3. Beneficios Clave (principal + hasta 5 secundarios)
4. Objetivo del Lanzamiento (meta, fechas, estrategia de producto)
5. Mensajes y Ángulos de Comunicación (mensaje clave + puntos de apoyo)
6. Recursos Disponibles (tabla)
7. Contacto Principal

### Paso 4 — Presentar y publicar

1. Presenta como borrador.
2. Si el usuario aprueba → ofrecer: "¿Quieres publicarlo en Confluence?" → `/publish-to-confluence`

## Restricciones

- Lenguaje claro, no técnico (para el equipo de comunicaciones).
- No inventar fechas ni enlaces; usar `[por definir]`.
- Mensaje clave = una sola frase concisa.
- Máximo 5 beneficios secundarios.
- **Extraer de documentos existentes primero.**

## Salida esperada

Brief de lanzamiento completo listo para el equipo de comunicaciones.
