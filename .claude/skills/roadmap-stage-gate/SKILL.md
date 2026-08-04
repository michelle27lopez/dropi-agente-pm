---
name: roadmap-stage-gate
description: Use this skill when Laura wants to (re)build the cross-célula project roadmap as a Discovery/POC/Delivery/Following Kanban for business/leadership visibility. Triggered by "actualiza el roadmap stage gate", "refresca el roadmap de producto", "vuelve a armar el kanban de proyectos", "muéstrame el roadmap para el negocio".
---

# Roadmap Stage Gate

## Objetivo

Cruzar (1) el documento de necesidades por célula y (2) el estado real de los proyectos ya activos en el código de Darwin, para producir un Kanban de negocio con 4 columnas — Discovery, POC, Delivery, Following — listo para mostrar a liderazgo. Formato validado por Laura el 31-jul-2026 — ver `template.html` en esta misma carpeta.

## Cuándo usarlo

- "actualiza el roadmap stage gate"
- "refresca el roadmap de producto"
- "vuelve a armar el kanban de proyectos"
- "muéstrame el roadmap para el negocio"

## Definición de etapas (fija — no la reinventes)

- **Discovery**: Research, Ideación o conceptualización de experimento.
- **POC**: En seguimiento o en priorización.
- **Delivery**: Pendiente hand-off o en dev. Dentro de "en dev" puede existir un substate **QA**.
- **Following**: Beta o producción.

## Insumos

1. **Doc de necesidades por célula** (Google Docs) — ver memoria `reference-celula-needs-doc` para el id conocido más reciente. Confirma con Laura si sigue siendo la versión vigente antes de asumir que no cambió.
2. **Código de Darwin en `main`** — no asumas que la rama de trabajo actual (`git branch --show-current`) es main. Trae explícitamente `origin/main`:
   - `git ls-tree -r main --name-only -- hub/src/app/proyectos` para el inventario de prototipos ya construidos.
   - `git show main:hub/src/app/roadmap-s2-2026/page.tsx` (si existe) suele traer datos ya estructurados de fechas/estado de Supplier Success — no los reconstruyas a mano si ya están ahí.
   - Grep dirigido por palabras clave de estado (`Beta`, `producci[oó]n`, `handoff`, `hand-off`, `POC`, `experimento`, `research`, `priorizaci[oó]n`, `seguimiento`, `QA`, `discovery`, `piloto`) dentro de cada `page.tsx` de primer nivel, para no tener que leer archivos completos de cientos de líneas cuando no hace falta.

## Instrucciones

### Paso 1 — Levantar el inventario
Lista todos los proyectos mencionados en el doc de necesidades, célula por célula. Luego lista las carpetas de `hub/src/app/proyectos/` en `main` que no aparezcan ya en el doc.

### Paso 2 — Clasificar con evidencia, nunca a ojo
Cada proyecto va a una etapa solo si hay una señal textual real que lo respalde (una palabra o frase de la fuente, no una suposición sobre lo que "probablemente" es). Si no hay señal suficiente, el proyecto va a una sección aparte de "sin clasificar / confirmar con Laura" — nunca lo fuerces a una etapa para completar el tablero.

### Paso 3 — Revisar el modelo de estados real de Darwin antes de publicar
Darwin ya tiene un campo `estado_interno` (migración `036_discovery_poc_estados.sql`, ver memoria `darwin-hub-system`) con su propia jerarquía Discovery↔POC. **No es lo mismo** que esta clasificación de negocio (que además tiene Delivery/Following, algo que `estado_interno` no cubre). Si un proyecto tiene valor en `estado_interno`, compáralo con la etapa que le asignaste aquí — si no coinciden, no elijas uno arbitrariamente: repórtalo como una discrepancia a resolver con Laura o Jaime, igual que se hizo la primera vez (31-jul-2026).

### Paso 4 — Resumen ejecutivo con el hallazgo real
Cuenta cuántos proyectos hay por etapa y qué porcentaje representa cada una. Si una etapa concentra visiblemente más que las demás (ej. Delivery represado esperando TI), dilo explícitamente como hallazgo — es el tipo de insight que este roadmap existe para mostrar.

### Paso 5 — Bloqueadores transversales
Separa los accesos/APIs que varios proyectos piden a la vez (no son proyectos en sí) en su propia sección al final — no los mezcles como tarjetas del Kanban.

### Paso 6 — Construir y publicar
Copia `template.html` de esta carpeta (mismo sistema de columnas, colores por célula/etapa, filtro por célula) y reemplaza el array de datos. Publica con Artifact, favicon 🗺️.

## Notas
- Ver memoria `feedback-business-facing-artifacts`: esto es siempre un artifact diseñado, nunca una lista en markdown.
- Ver memoria `project-laura-focos-2026` si alguno de los 3 focos propios de Laura (EXP-001, OP-001, Darwin) aparece en el roadmap — ya tienes contexto de su estado sin necesidad de re-investigar desde cero.
