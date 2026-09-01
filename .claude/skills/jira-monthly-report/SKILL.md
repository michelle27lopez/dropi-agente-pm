---
name: jira-monthly-report
description: Genera el borrador del reporte mensual de PD-001 (dashboard /proyectos/monthly-update) a partir de Jira (proyecto PROD) — filtra, deduplica y atribuye issues a célula siguiendo la metodología validada por Laura en julio 2026. Úsala cuando Laura pida "arma el reporte mensual de Jira", "genera el monthly update de [mes]", "corre el reporte de Jira del mes", o cuando el cron mensual la dispare. NO publica sola: entrega un borrador de `data/YYYY-MM.ts` + una lista de decisiones pendientes para que Laura confirme.
---

# Reporte mensual PD-001 desde Jira

## Objetivo

Convertir los issues crudos de Jira (proyecto `PROD`) en el `MonthlySnapshot` curado que alimenta `/proyectos/monthly-update`, siguiendo la metodología que se construyó a mano en julio 2026 (ver memoria `project_pd001_monthly_jira_methodology` y `reference_jira_prod_pm001`). El objetivo es que correr el reporte cada mes sea un procedimiento fijo, no una investigación desde cero — pero **la curaduría final sigue siendo de Laura**, esta skill no auto-publica.

## Cuándo usarla

- "arma el reporte mensual de Jira"
- "genera el monthly update de [mes]"
- "corre el reporte de Jira del mes"
- Disparada por un cron mensual (ver sección "Automatización" al final)

## Config fija

- Cloud Jira: `dropi-it.atlassian.net` (cloudId para las tools `mcp__claude_ai_Atlassian_Rovo__*`)
- Proyecto: `PROD`
- Fuente de la app: `hub/src/app/proyectos/monthly-update/` — el snapshot final es un archivo `data/YYYY-MM.ts` que exporta `snapshot: MonthlySnapshot` (tipo en `data/types.ts`)
- Roster PM→célula: `hub/src/app/proyectos/monthly-update/data/pm-celula-map.ts` (`PM_A_CELULA`) — **léelo fresco cada corrida**, no lo copies de una corrida anterior; se actualiza cuando cambia el roster
- Script de apoyo (dedup + stage transitions): `.claude/skills/jira-monthly-report/scripts/build_monthly_report.py`, en esta misma carpeta
- Si existe ya `hub/src/lib/jira-project-grouping.ts` en el repo (viene del PR "Reporte mensual Product Designers", puede no estar mergeado a `main` todavía): las constantes `ROUTINE_KEYWORDS`, `STAGE_TAG_RE` y `normalizeTitle` de ese archivo deben coincidir con las del script Python de esta skill. Si divergen, ese archivo TS es la fuente de verdad para la app — actualiza el script para igualarlo, no al revés.

## Paso 0 — Determinar el mes objetivo

- Si Laura lo dice explícito ("el reporte de julio"), usa ese mes.
- Si no lo dice y hoy es día 1–5 del mes, asume que quiere el **mes calendario anterior completo**.
- Si hoy está a mitad de mes y no se especifica, pregunta si quiere el mes actual (parcial, con advertencia explícita de que está incompleto) o el último mes cerrado — no asumas.
- Verifica si ya existe `hub/src/app/proyectos/monthly-update/data/<mes>.ts`. Si existe, pregunta antes de sobrescribir — nunca lo pises en silencio.

## Paso 1 — Traer los issues crudos de Jira

Usa `mcp__claude_ai_Atlassian_Rovo__searchJiraIssuesUsingJql` (no las rutas `/api/jira/*` del hub — esas requieren sesión de navegador vía `requireUser()` y servidor corriendo; el MCP ya está autenticado y es más directo para esta skill).

JQL (igual rango que usa `/api/jira/monthly-summary` en la app, para que los números sean comparables):
```
project = PROD AND updated >= "<primer día del mes, YYYY-MM-DD>" AND updated < "<primer día del mes siguiente>" ORDER BY updated DESC
```

Pide estos campos: `summary`, `status`, `issuetype`, `assignee`, `created`, `parent`, `issuelinks`. Pagina hasta traer todos los resultados (no te quedes con la primera página).

## Paso 2 — Filtrar y deduplicar con el script

Guarda los issues crudos como JSON (lista de objetos con `key` y los campos del Paso 1) y el roster `PM_A_CELULA` leído en este momento de `pm-celula-map.ts` como JSON. Corre:

```
python3 .claude/skills/jira-monthly-report/scripts/build_monthly_report.py \
  --issues issues.json --roster roster.json --month 2026-07
```

Qué hace el script (ver comentarios en el archivo para el detalle exacto):
1. Descarta Sub-task y todo lo que no sea `issuetype = Story` — regla de Laura: "proyectos solo cuentan como el story type".
2. Descarta tickets rutinarios (reuniones, dailies, plannings, retros — mismo `ROUTINE_KEYWORDS` que `jira-project-grouping.ts`).
3. Agrupa por célula usando el roster. PMs con 0 célulass → "sin clasificar". PMs con 2+ célulass (hoy: Michel Pino, Catalina Giraldo Aguirre) → van a un balde "ambiguo", **nunca se reparten automáticamente**.
4. Dentro de cada célula, deduplica candidatos a "proyecto" con union-find: mismo `parent` (Epic), mismo link `Cloners`, o mismo título normalizado (quitando tags de etapa, "Fase N", "Pt.N", sufijos "-N", "CLONE").
5. Detecta tags de etapa `[DISCOVERY] [POC] [DELIVERY] [FOLLOWING]` en el título y, cuando un proyecto tiene 2+ etapas tagueadas, calcula el delta en días entre las fechas de creación del primer ticket de cada etapa — output siempre con `n` (cuántos tickets sustentan esa etapa) explícito, nunca lo omitas.
6. Cualquier tag de etapa que sea de la taxonomía vieja (`DEFINICIÓN`, `CIERRE`, `EXPERIMENTACIÓN`, `QA`, `HANDOFF`) sale marcado como `tag_legado` — el script **no** lo mapea solo a Discovery/POC/Delivery/Following. Esa decisión es manual (ver Paso 3).

## Paso 3 — Revisar con Laura antes de escribir nada

El script deja una lista de **decisiones abiertas** — no sigas al Paso 4 sin pasarlas por Laura:
- PMs ambiguos: cuántos tickets, y a qué célula(s) van este mes.
- Clusters con `tag_legado`: ¿esa etapa vieja equivale a Discovery, POC, Delivery o Following este mes, o se excluye (como pasó en julio con un `[CIERRE]` que casi se contó como "Following" con 0 días)?
- Tickets "sin clasificar" (assignee fuera del roster): ¿falta agregar ese PM a `pm-celula-map.ts`?
- Cualquier célula con **0 datos** de tiempo por etapa ese mes — repórtalo tal cual, no lo llenes con supuestos.
- Cualquier valor de campo que no encaje en lo esperado (issuetype nuevo, status nuevo) → repórtalo como "no documentado", no lo fuerces.

No fabriques una `conclusionEjecutiva` ni `reflexiones` — esas son narrativa de equipo (qué se adoptó, qué cambió el proceso ese mes) y solo Laura las conoce. Pregúntale qué pasó ese mes en el equipo antes de redactarlas, igual que julio 2026.

## Paso 4 — Armar el borrador

Con las decisiones ya confirmadas por Laura, escribe `hub/src/app/proyectos/monthly-update/data/<mes>.ts` siguiendo exactamente la forma de `MonthlySnapshot` (`data/types.ts`) — usa `data/2026-07.ts` como plantilla de formato y de tono de las notas inline (los comentarios explicando limitaciones de la data son parte del estándar, no decoración).

**No lo conectes todavía** al `page.tsx` (el import de `snapshot`) ni actualices `comparativoMeses`/`comparativoGlobal` del histórico — muéstraselo a Laura como preview primero (mismo flujo que ya validamos: "preview para revisar" antes de tocar el dashboard en vivo).

## Paso 5 — Entregar

Resume en el chat: total de proyectos por célula, principales cambios vs. el mes anterior, y la lista de decisiones del Paso 3 que Laura ya resolvió (para que quede trazable qué se decidió y por qué). Espera su ok antes de tocar `page.tsx`.

## Restricciones

- Nunca cuentes `ordenes_creadas`-style totales sin excluir Sub-task/Task — solo Story.
- Nunca repartas automáticamente los tickets de un PM ambiguo entre sus célulass.
- Nunca promedies una transición de etapa con `n=1` como si fuera representativa — repórtala como caso único.
- Nunca sobrescribas un archivo `data/<mes>.ts` existente sin confirmar con Laura.
- Nunca conectes el snapshot nuevo a `page.tsx` sin que Laura haya visto y aprobado el preview.
- Nunca inventes `conclusionEjecutiva` ni `reflexiones` — son narrativa real del mes, pregúntale a Laura.
- Si `JIRA_BASE_URL`/`JIRA_EMAIL`/`JIRA_API_TOKEN` hicieran falta en algún flujo alterno (no en esta skill, que usa el MCP) — no los pidas ni los inventes, señala que faltan.

## Automatización (cron mensual)

Cuando la metodología del Paso 2–3 esté suficientemente pulida y Laura lo confirme, se puede programar un `CronCreate` que dispare esta skill el día 1 de cada mes (temprano) contra el mes recién cerrado. El cron debe dejar el borrador (`data/<mes>.ts` fuera del import activo, o en un archivo `.draft.ts`) y una notificación con el resumen del Paso 5 — **nunca debe autoaprobar ni publicar**, porque el Paso 3 tiene decisiones que hoy solo Laura puede tomar (PMs ambiguos, tags legados, narrativa del mes). Todavía no se ha creado este cron — es el siguiente paso una vez validemos 1–2 corridas manuales.
