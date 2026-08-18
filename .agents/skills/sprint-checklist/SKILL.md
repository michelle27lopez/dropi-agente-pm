---
name: sprint-checklist
description: Mantiene el checklist de documentación de una tarea del sprint (hub `/sprint`, tabla `sprint_task_checklist`) sincronizado con su ciclo de vida real en Jira. Úsala cuando Michelle o Jaime cuenten avance/hallazgos de una tarea del sprint, pidan traer/crear el checklist de tareas nuevas del preplanning, digan que empezaron a trabajar en algo, digan que ya terminaron una tarea, o pidan subir/sincronizar la documentación a Jira.
---

# Checklist de sprint ↔ Jira

Diseñado en conversación el 2026-07-16 (ver `project_sprint_documentacion_sistema` en memoria). Cubre el journey completo de una tarea del sprint: preplanning → en curso → documentación mientras se trabaja → cierre y sync a Jira.

## Preplanning ≠ Planning ≠ Documentar (tres cosas distintas, no confundir)

Esta skill cubre **momentos distintos del ciclo de vida de una tarea**, no un solo evento:

- **Paso A ocurre en el preplanning** — la reunión previa entre Product Manager y Product Designer (solo ellos dos), donde se crean las tareas nuevas, se escriben sus descripciones en Jira y esta skill scaffoldea el checklist inicial en Supabase (todo en `pendiente`). Aquí también se crea la tarea "Reuniones" (cubierta por `sprint-reuniones`, no por esta).
- **Pasos B a D (marcar en curso, documentar avances/hallazgos, cerrar) NO están atados al preplanning** — pasan en cualquier momento del sprint, cuando la persona está trabajando activamente en la tarea y quiere dejar registro. La meta es que toda tarea termine con trazabilidad real (qué se hizo, qué se decidió), no que se documente de una sola vez.

Dentro del preplanning mismo hay además otra actividad, aparte de crear tareas (Paso A) y **sin relación con el checklist de documentación**: bajar/clonar al sprint nuevo lo que no se alcanzó del sprint anterior. Esta skill **no la cubre** — no es un paso pendiente de esta skill, es simplemente otro tipo de trabajo que no entra en su alcance.

El **planning** es una reunión distinta y posterior a todo lo anterior: semanal, lunes (o martes si el lunes es festivo), con **toda la célula** (Project Manager, Product Designer, Laura Contreras y Laura Torres). Ahí se revisa lo que salió del preplanning — que las tareas estén bien nombradas, que los tiempos cuadren, y cómo quedó lo pendiente del sprint que termina (ya clonado o bajado, no se decide en el planning). Esta skill **no participa en el planning**; es una herramienta de preparación y de documentación de trabajo, no de la reunión de célula en sí. Ver `project_planning_preplanning_dropi` en memoria.

## Alcance — solo 2 personas

Solo para `michelle.lopez@dropi.co` y `jaime.guevara@dropi.co`. Si la persona es otra, no continuar.

## Identificar la tarea

Buscar en `sprint_task_checklist` (Supabase del proyecto de Jaime, `fwwkesboxlbmimzyoztq` — ver `feedback_supabase_siempre_jaime`) por `jira_key` si lo menciona, o por coincidencia de `summary`/tema si habla del proyecto sin decir el key. Si hay ambigüedad entre varias tareas, preguntar cuál. Cargar/escribir siempre vía REST o script Python usando `hub/.env.local` en tiempo de ejecución — nunca hardcodear ni imprimir `SUPABASE_SERVICE_KEY`.

## Paso A — Preplanning: traer tareas nuevas del sprint

Cuando pidan traer/crear el checklist de las tareas del sprint activo: `searchJiraIssuesUsingJql` (`project = PROD AND assignee = "<email>" AND sprint in openSprints()`). Para cada issue que **no exista aún** en `sprint_task_checklist`:
- Leer su `description` en Jira.
- Derivar las secciones del checklist a partir de los entregables/criterios de aceptación ya escritos ahí — **nunca inventar contenido**, todas las secciones nuevas arrancan en `"pendiente"` (ver `feedback_solo_hechos_confirmados`).
- Upsert en Supabase por `jira_key`: `jira_url`, `person_email`, `summary`, `jira_status`, `sprint_label` (de `customfield_10020`), `priority` (de `priority.name` — Highest/High/Medium/Low/Lowest), `sections`, `links: []`.

La tarea "Reuniones" no entra aquí — la cubre la skill `sprint-reuniones`.

## Paso B — Marcar "En curso" en Jira

La primera vez que la persona hable de estar trabajando activamente en una tarea (en cualquier chat), revisar su `jira_status` guardado en Supabase. Si sigue en un estado de "no iniciado" (Backlog, To Do, Definición, etc.):
- Preguntar una sola vez: "¿la paso a En curso en Jira?"
- Si confirma: `getTransitionsForJiraIssue` para encontrar el id de la transición a "En curso", `transitionJiraIssue` para aplicarla, y actualizar `jira_status` en Supabase.
- No volver a preguntar por esa misma tarea en ese sprint una vez ya quedó en curso.

## Paso C — Documentar mientras se trabaja (solo Supabase, no toca Jira)

Cuando cuenten avance o hallazgos de una tarea:
- Identificar a qué sección del checklist corresponde (si no es obvio, preguntar cuál).
- Actualizar `status` (`pendiente`/`en_curso`/`hecho`) y `notes` de esa sección en el JSON `sections`.
- Si mencionan un prototipo, documento o link relacionado, agregarlo a `links`.
- Nunca marcar una sección como `hecho` porque "probablemente ya terminó" — solo cuando la persona lo confirma explícitamente.

### Detección proactiva de cierre (evitar perder info entre sesiones)

Esta skill es reactiva por defecto — solo actualiza el checklist cuando la persona cuenta el avance. El riesgo: si el trabajo real (código, diseño, decisiones) pasa en una sesión y la documentación se deja para otra sesión distinta, se pierde contexto que Codex ya no tiene.

Para evitarlo, **en cualquier conversación** (no solo cuando se invoca esta skill explícitamente) — si por el contexto parece que **una tarea completa del sprint llegó a su fin** (ej. la persona confirma que una feature quedó funcionando, se cerró un PR, dice "ya quedó listo/funciona"), preguntar proactivamente: "¿lo documentamos ya en el checklist antes de que se pierda el detalle?" — no esperar a que lo pidan después.

⚠️ Umbral: solo cuando parece que la **tarea completa** terminó, nunca por cada cambio o avance parcial — preguntar en cada paso pequeño sería intrusivo. Ante la duda de si ya terminó todo o es solo un avance, no preguntar todavía.

## Paso D — Cerrar y sincronizar a Jira

Se activa cuando la persona dice que terminó la tarea, o cuando todas las secciones de una tarea quedan en `hecho` y le preguntas si ya la cerró (nunca lo asumas solo). También se re-activa si vuelven a documentar algo en una tarea que ya se había sincronizado antes (un hallazgo cambió, se agregó un link, etc.).

**Un solo comentario por tarea, siempre actualizado — nunca uno nuevo por cada sync, y sin fechas/historial dentro del texto.** El comentario debe reflejar el estado *actual*, no un log. Confirmado con Michelle 2026-07-16: la prioridad es que cualquiera en el equipo lo entienda de un vistazo, no llevar rastro de cómo cambió.

1. Armar el comentario a partir de las `sections` (nombre + estado en texto plano + notas) y `links` acumulados, con este formato — claro y fácil de leer para cualquiera del equipo, no solo para quien lo escribió:
   ```
   📋 Documentación — {resumen corto de una línea del estado general}

   **{Nombre de la sección}** — {Hecho/En curso/Pendiente}
   {notas de esa sección, en lenguaje llano}

   **{Nombre de la siguiente sección}** — {estado}
   {notas}

   🔗 Links
   - {label}: {url}
   ```
   Omitir secciones sin notas si no aportan nada al lector. Nunca incluir fechas de "actualizado el..." — el comentario es la versión vigente, no una bitácora.
2. Mostrárselo tal cual va a quedar y esperar confirmación explícita — esto escribe algo visible en Jira.
3. Si confirma:
   - Si la tarea ya tiene `jira_comment_id` guardado en Supabase: actualizar ESE comentario con `addCommentToJiraIssue` pasando `commentId` (reemplaza el contenido completo, no se acumula nada).
   - Si no tiene `jira_comment_id` todavía: crear el comentario con `addCommentToJiraIssue` (sin `commentId`), y guardar el id que devuelve la respuesta en `jira_comment_id` en Supabase.
   - **Nunca reescribir el campo `description`** de Jira — ya tiene los entregables definidos en preplanning, y el comentario es el lugar correcto para el resultado.
4. Preguntar por separado si también corresponde pasarla a "Hecho" en Jira (puede que quede en revisión y no cierre todavía) — solo transicionar si confirma.
5. Actualizar `last_synced_to_jira_at` en Supabase al momento de escribir/actualizar el comentario.

## Restricciones

- No correr para nadie fuera de las 2 personas del alcance.
- No tocar Jira (comentario o transición) sin mostrar el contenido exacto y recibir confirmación explícita primero.
- No reescribir `description` en Jira — solo comentarios.
- No inventar contenido de checklist, hallazgos o notas — solo lo que la persona contó o lo derivado honestamente de la descripción original de la tarea.
- No preguntar por la transición a "En curso" más de una vez por tarea por sprint.
- No usar un proyecto Supabase distinto al de Jaime, ni hardcodear/imprimir `SUPABASE_SERVICE_KEY`.
