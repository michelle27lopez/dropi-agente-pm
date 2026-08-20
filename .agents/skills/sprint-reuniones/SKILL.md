---
name: sprint-reuniones
description: Calcula las horas reales de reuniones del sprint (excluyendo bloques personales y reuniones generales de equipo) y actualiza la tarea "[PRODUCTO] Reuniones" en Jira. Úsala cuando Michelle o Jaime pidan "calcula mis reuniones del sprint", "actualiza la tarea de reuniones", "cuántas horas de reuniones tengo esta semana/este sprint", o algo equivalente al preplanning de un nuevo sprint.
---

# Calcular horas de "Reuniones" del sprint

Diseñado en conversación el 2026-07-15 (ver `project_sprint_documentacion_sistema` y `feedback_reuniones_generales_clasificacion` en memoria). Objetivo: que la tarea "Reuniones" del sprint refleje horas reales de reuniones de equipo, sin contar bloques personales ni reuniones que en realidad son de un proyecto puntual.

## Alcance — solo 2 personas

Esta skill **solo corre para**:
- `michelle.lopez@dropi.co`
- `jaime.guevara@dropi.co`

Antes de hacer nada, confirmar de quién es el calendario conectado (`list_calendars` del conector de Google Calendar — el calendario propio, no el de feriados). Si el email no es uno de los dos de arriba, **no continuar**: explicar que esta skill todavía no está disponible para otras personas/células.

## Paso 1 — Rango de fechas del sprint

Jira sí expone el rango exacto del sprint activo: `getJiraIssue` con `fields: ["customfield_10020"]` sobre cualquier issue de esa persona en el sprint devuelve `startDate`/`endDate` con hora exacta (ej. `startDate: 2026-07-14T10:00:42Z`, `endDate: 2026-07-21T10:00:00Z` en UTC — restar 5h para hora Bogotá). Usar eso en vez de preguntar, pero **con cuidado con la hora, no solo la fecha**:

- El sprint no ocupa el día calendario completo en sus extremos — arranca y termina a una hora específica.
- Si el sprint arranca tarde en el día (ej. porque el día anterior fue festivo y el kickoff fue en la tarde), las reuniones de esa mañana temprano no cuentan — confirmar con la persona si el arranque fue parcial (ya pasó una vez, ver `project_sprint_documentacion_sistema`).
- **Las reuniones agendadas el mismo día calendario en que el sprint termina, pero después de la hora de cierre, son del sprint siguiente, no de este** — excluirlas del conteo aunque caigan dentro del rango de fechas que se ve en el board. Este fue un error real (2026-07-16): se contaron dos reuniones de la tarde del día de cierre como parte del sprint activo, cuando en realidad el sprint ya había cerrado esa madrugada.
- Ante la duda sobre si un evento cae antes o después del cierre real, preguntarle a la persona en vez de asumir.

## Paso 2 — Cargar o construir la whitelist de "reuniones generales" de esa persona

Consultar la tabla `sprint_meeting_whitelist` de Supabase (proyecto de Jaime, `fwwkesboxlbmimzyoztq` — ver `feedback_supabase_siempre_jaime`, nunca uno personal) filtrando por `person_email`. Igual que `bug-jira`, usar `hub/.env.local` (`SUPABASE_URL`/`SUPABASE_SERVICE_KEY`) en runtime vía REST o un script Python — nunca hardcodear ni imprimir la key.

- Si la tabla no existe todavía: pedirle a la persona que corra `hub/supabase/023_sprint_meeting_whitelist.sql` en el SQL Editor de Supabase (no hay acceso directo a DDL).
- Si **ya hay filas** para esa persona: usar esa whitelist tal cual, sin volver a preguntar.
- Si **no hay ninguna fila** (primera vez para esa persona): analizar sus últimas 2-3 semanas de calendario (`list_events`), agrupar por `recurringEventId` para detectar títulos recurrentes, y proponerle la lista de candidatos a "general" (recurrentes = casi siempre rituales de equipo, no de un proyecto). Pedirle que la confirme o ajuste antes de guardar nada. Al confirmar, insertar las filas en `sprint_meeting_whitelist` (`person_email` + `meeting_title` por cada una).
- Para Michelle específicamente, la whitelist ya quedó confirmada en la sesión del 2026-07-15 (ver `feedback_reuniones_generales_clasificacion`) — si la tabla está vacía para ella, se puede sembrar directo corriendo `hub/supabase/seed_sprint_meeting_whitelist.py` en vez de re-derivarla desde cero, y de todas formas mostrársela para que confirme que sigue vigente.

## Paso 3 — Traer eventos del calendario del sprint

`list_events` con `startTime`/`endTime` cubriendo el rango del Paso 1, `orderBy: startTime`, en el calendario primario de la persona (no pasar `calendarId` — usa el default).

## Paso 4 — Clasificar cada evento

Por cada evento, en este orden:
1. **Personal** (`colorId == "4"`) → excluir por completo, no cuenta para nada.
2. **General** (el `summary` del evento hace match, aunque sea parcial/case-insensitive, con algún `meeting_title` de la whitelist de esa persona) → suma a "Reuniones generales".
3. **Sin clasificar** (no es personal, no está en la whitelist) → **no adivinar**. Juntar todos estos en una lista y mostrársela a la persona con nombre, fecha, duración y quién más asistió, preguntando por cada uno: ¿es general (y lo agrego a tu whitelist para la próxima) o es tiempo de un proyecto tuyo? Si es de un proyecto, pedir el ticket de Jira (ej. `PROD-1581`). Si es una reunión de un proyecto ajeno donde la persona solo participa (no es su propio trabajo del sprint) → cuenta como general, no como proyecto (ver regla 4 de `feedback_reuniones_generales_clasificacion`).
4. Si la persona confirma que un evento "sin clasificar" es en realidad general y recurrente, agregarlo a su whitelist en Supabase para que la próxima corrida ya no pregunte por él.

## Paso 5 — Sumar y mostrar el resultado

Calcular:
- **Horas generales** = suma de duración de eventos "general" (whitelist + los que la persona marcó como general en el Paso 4).
- **Horas por proyecto** = por cada ticket que la persona haya indicado, suma de duración de sus eventos correspondientes.

Mostrar el desglose completo (qué cuenta como general, qué cuenta para cada proyecto, y el total) **antes de tocar Jira**. Esperar confirmación explícita — esto escribe algo visible en Jira, no es reversible con un clic.

## Paso 6 — Encontrar la tarea "Reuniones" y las tareas de proyecto en Jira

Buscar con `searchJiraIssuesUsingJql`, `project = PROD AND summary ~ "Reuniones" AND assignee = "<email de la persona>"`, filtrando por el sprint activo si hay más de un resultado. Si hay ambigüedad, mostrar las opciones y que la persona confirme cuál es.

⚠️ Si la persona pide "actualiza la tarea de reuniones" sin dar el número de issue, y hay más de un sprint activo/reciente en juego (el actual y el siguiente, por ejemplo), **preguntar de entrada por el issue exacto o el rango de sprint** antes de tocar nada — no asumir cuál de las tareas "Reuniones" es. Cada sprint tiene su propia tarea; nunca sirve una para dos sprints (confundido una vez, 2026-07-21, entre PROD-1514 del sprint 26-27 y PROD-1690 del 27-28).

## Paso 7 — Actualizar Jira (solo tras confirmación del Paso 5)

- Tarea "Reuniones": `editJiraIssue` con el campo `timetracking.originalEstimate` (formato Jira, ej. `"11h"`) igual a las horas generales calculadas. ⚠️ Jira NO acepta decimales en este campo — `"8.75h"` se interpreta mal (el punto se pierde y se lee como `"875h"`, dando algo absurdo tipo "21sem 4d 3h", bug confirmado 2026-07-21). Siempre convertir fracciones de hora a formato `"Xh Ym"` (ej. 8.75h → `"8h 45m"`) antes de escribir.
- La tabla de desglose (reunión + tiempo) va en la descripción del issue como **tabla real de Jira, nunca como texto markdown con pipes**. `editJiraIssue` con `contentFormat: "markdown"` NO convierte una tabla GFM (`| Reunión | Tiempo |`) en una tabla ADF real — inserta el texto literal con los `|`, y así se ve roto en la UI de Jira (bug confirmado 2026-07-21, tarea PROD-1514). Construir siempre el documento como ADF manual (nodos `table`/`tableRow`/`tableHeader`/`tableCell`/`paragraph`/`text`) y llamar `editJiraIssue` con `contentFormat: "adf"`.
- **No confiar en la respuesta de `getJiraIssue` (ni en el eco de `editJiraIssue`) para verificar que la tabla quedó bien.** El campo `description` que devuelven estos tools SIEMPRE se aplana a texto con pipes al leerlo, sin importar si lo guardado es una tabla ADF real o texto plano — no es señal confiable de éxito ni de fallo. La única verificación válida es pedirle a la persona que abra el issue en el navegador y confirme visualmente que la tabla se ve como tabla.
- Cada ticket de proyecto con horas asignadas: `addWorklogToJiraIssue` con `timeSpent` (ej. `"1h"`) y un `commentBody` breve indicando que son horas de reunión (ej. "Reunión: viabilidad desarrollos — categorías").

Reportar al final qué se actualizó y los links de cada issue tocado, y pedir confirmación visual de la tabla en Jira.

Además, tras confirmar y escribir en Jira, reflejar el mismo resultado en el dashboard `/sprint` del hub (tabla `sprint_task_checklist`, requiere haber corrido `hub/supabase/025_sprint_checklist_hours.sql`): upsert por `jira_key` de la tarea "Reuniones" con `is_meetings_task: true`, `hours_estimate` = horas generales calculadas, `hours_breakdown` = lista `[{ "title": <nombre del evento o grupo>, "hours": <horas> }]` de lo que compone esas horas generales. No crear una fila aparte para esto — es la misma tarea de Jira, solo con estos campos adicionales llenos.

## Paso 8 — Recalcular durante el sprint

Esto **no se recalcula solo**. La persona vuelve a invocar esta skill cuando quiera actualizar el número (a mitad de semana si agendaron más reuniones, o al cierre del sprint) — cada corrida repite los Pasos 1, 3-7 (el Paso 2 ya no hace falta si la whitelist ya existe).

## Restricciones

- No correr para nadie fuera de las 2 personas del alcance.
- No adivinar la clasificación de un evento "sin clasificar" — siempre preguntar.
- No escribir en Jira (`editJiraIssue`, `addWorklogToJiraIssue`) sin mostrar el desglose completo y recibir confirmación explícita primero.
- No usar un proyecto Supabase distinto al de Jaime (`fwwkesboxlbmimzyoztq`), ni hardcodear ni imprimir `SUPABASE_SERVICE_KEY` en la conversación — cargarla siempre desde `hub/.env.local` en tiempo de ejecución.
- No asumir el rango de fechas del sprint — confirmarlo siempre con la persona.
