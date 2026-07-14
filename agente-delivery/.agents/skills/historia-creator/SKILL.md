---
name: historia-creator
description: Use this skill when the user asks to create user stories for Dropi. Triggered by phrases like "dame las historias de UX de", "dame las historias de UI de", "crea las historias de frontend/backend/DBA/QA/legal/lanzamiento de".
---

# Historia Creator

## Objetivo

Generar historias de usuario en el formato oficial de Dropi, extrayendo la mayor cantidad de información posible de documentos ya existentes.

## Cuándo usarlo

- "dame las historias de UX de [épica]"
- "dame las historias de UI/frontend/backend/DBA/QA/legal/lanzamiento de [épica]"
- "crea las historias para [nombre de épica]"

## Instrucciones

### Paso 1 — Buscar información existente (antes de preguntar nada)

1. **Buscar la épica padre** en `docs-sync/`, `approved_context`, o por referencia del usuario.
2. **Buscar documentos relacionados** en `docs-sync/`:
   - Kickoffs → contexto general, fases, equipo
   - Research → dolores, flujos actuales, hallazgos
   - Planning → tareas definidas, sprint scope
   - User flows → pasos del proceso ya documentados
3. **Extraer del documento fuente:**
   - Tipos de usuario mencionados
   - Flujos descritos
   - Reglas de negocio
   - Componentes o pantallas mencionadas

### Paso 2 — Identificar tipo y completar lo mínimo

Identifica el tipo de historia (UX, UI, Frontend, Backend, DBA, QA, Legal, Lanzamiento).

**Solo preguntar si no se puede inferir:**
- El tipo de etiqueta (si el usuario no lo dijo)
- La épica padre (si no es obvia del contexto)

### Paso 3 — Generar historias

Leer `canon/dropi_methodology.md` y por cada historia generar:

**Título:** `[Etiqueta] [Sigla del producto]: [Nombre descriptivo]`

**Historia:**
```
Como [tipo de usuario],
Puedo [acción],
Para [resultado].
```

**Descripción del proceso:** extraída de kickoff/research/flow o redactada.

**Flujo del usuario:** paso a paso, inferido de documentos existentes si hay.

**Criterios de aceptación (Gherkin):** al menos 2-3 escenarios.
```
Escenario: [nombre]
  Dado que [precondición]
  Cuando [acción]
  Entonces [resultado esperado]
```

**Condiciones adicionales:** versión design system, nuevo/rediseño, resoluciones.
- Default: Design System 2.0, nuevo, Desktop + responsive

**Definición de Hecho (DoD):** resultados esperados concretos.

### Paso 4 — Secciones por tipo

- **UX:** flujos de interacción, wireframes esperados, benchmark
- **UI:** resoluciones, versión del design system, handoff
- **Frontend:** componentes, APIs/endpoints
- **Backend:** APIs, esquema de datos, procesos automáticos
- **DBA:** estructura de tablas, validaciones, restricciones
- **QA:** flujos a validar, regresiones relevantes
- **Legal:** requerimientos normativos, cambios a T&C
- **Lanzamiento:** beneficios por usuario, video Tango

### Paso 5 — Presentar y ofrecer publicación

1. Presenta como borrador para revisión.
2. Si el usuario aprueba → ofrecer: "¿Quieres publicarlas en JIRA?" → usar `/publish-to-jira`

## Restricciones

- El formato Gherkin es obligatorio para criterios de aceptación.
- El título debe seguir exactamente `[Etiqueta] [Sigla]: Nombre`.
- No mezclar tipos de etiqueta en la misma historia.
- No inventar datos técnicos sin base en el contexto dado.
- **Extraer primero de documentos existentes** antes de preguntar.

## Salida esperada

Una o varias historias listas para copiar en Jira, en el formato completo de Dropi.
