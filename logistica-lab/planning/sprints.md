# 🏃 Sprints — estructura y convención

> Board **PROD 1267**. Dos backlogs: Juan Diego y Michel Pino.
> ⚠️ **Jira bloqueado por IP** (ver `fuentes/_index.md`): no se puede leer/escribir desde aquí.
> Este archivo guarda la **estructura/convención**; el contenido real se llena con Jira
> desbloqueado o con screenshots del board.

## Deber semanal (recordatorio)
Solo **llenar la info** de los sprints (mío + Michel Pino) con los **proyectos nuevos** y
las **product tasks / products** que se necesiten. NO crear ni completar sprints.

## 🔄 Ciclo semanal del sprint (llenar → trabajar → cerrar)
> El contenedor del sprint (crear/cerrar el sprint) lo maneja Juan/Pino en la UI. El agente
> **llena** las cards y **mueve su estado** (incluido pasar a Done), pero NO completa el sprint.

**1. Inicio de semana (lunes) — LLENAR:**
- Verificar el **sprint activo** (`project = PROD AND sprint in openSprints()`; el id cambia cada semana).
- Crear las **product tasks** de la semana con la receta de abajo (Story `[PRODUCTO]`, sprint `customfield_10020`, Original Estimate en horas) + la card única **"[PRODUCTO] Reuniones recurrentes"** (~19h).
- Cuadrar capacidad con la **agenda real** (Calendar) — reuniones + tareas ≈ 45h/sem.

**2. Durante la semana — TRABAJAR / mover estado:**
- Flujo de estados PROD (ids verificados 24-jun): **En Ruta (backlog)** → *Inicio* (**id 2**) → **En curso** → *se ejecutó* (**id 7**) → **"hecho" = Done**. Otras desde En curso: *bloqueo* (id 3 → Dependencia), *cambio prioridad* (id 4 → Despriorizada), *se canceló* (id 8 → Cancelado).
- Al arrancar una tarea: moverla a *En curso* (id 2). Al cerrarla: *se ejecutó* (id 7). ⚠️ Los ids pueden variar por workflow/estado → si falla, `getTransitionsForJiraIssue` sobre la card.

**3. Fin de semana / lunes — CERRAR (pasar a Done):** ⭐ *deber recurrente que pidió Juan*
- **Pasar a Done** las tareas terminadas (transicionar card por card; la transición a Done aparece cuando la card está *En curso*/avanzada, no desde backlog).
- Lo **no terminado** → rolarlo (queda en el sprint nuevo o backlog) y dejar nota en `todos.md`.
- Dejar el **reporte de viernes** (WhatsApp) listo para que Juan lo envíe.
> ⚠️ Pasar tareas a Done ≠ "completar el sprint". El cierre del contenedor lo hace Juan en la UI.

## Jerarquía Jira (cómo se organiza)
```
Épica (PROD-xxx)              ← el proyecto (ej. PROD-235 Tarifas)
└── Historia / Product Task   ← entregable de valor para el usuario
    └── Subtarea              ← unidad de trabajo concreta (PM/PD/TI)
```

## 🔧 Cómo se crea una product task (patrón REAL, copiado de PROD-1014)
> Molde verificado el **24-jun** leyendo [PROD-1014](https://dropi-it.atlassian.net/browse/PROD-1014)
> "[PRODUCTO] Planeacion semanal" (la card de planeación de Juan). **Toda product task de mi
> sprint se crea idéntica a esta.** En Jira la card mínima es **solo título + sprint**; el detalle
> rico (problema/hipótesis/métrica) vive en el `spec.md` del repo y se baja a la card/subtareas
> cuando el proyecto pasa a definición.

**Campos exactos (createJiraIssue):**
| Campo | Valor |
|---|---|
| `projectKey` | `PROD` (Product Team - Dropi, id 10803, board software 1267) |
| `issueTypeName` | **Story** (id 10001) — PROD no tiene tipo "Product Task"; el equivalente es Story |
| `summary` | Prefijo **`[PRODUCTO]`** + título (ej. `[PRODUCTO] Discovery Same Day`) |
| `assignee` + reporter | Juan `712020:ec737502-a59a-4338-8f2a-fc43c529d51c` (Pino `712020:eb120cd3-552b-4ebe-b7d4-5ecda1bb8a57`) |
| **Sprint** `customfield_10020` | **id del sprint activo** (no el nombre). Ej. 24-jun = **3534** "Product Sprint 23 - 26" (activo, 22–30 jun). ⚠️ Hay 2 campos "Sprint": el bueno es **`customfield_10020`**; `customfield_12303` se ignora. |
| `priority` | Medium (default) |
| `description` | vacía en la card base (el contexto va en el repo) |
| **Estimación** | **Original Estimate en HORAS** vía `timetracking.originalEstimate` (ej. `"8h"`). ⚠️ No sale en `editmeta` pero **sí se setea por API**. Jira lo muestra en días (jornada 8h → "1d"=8h, "2d 3h"=19h). NO usar Story Points (`customfield_10033`) — Juan estima en tiempo (24-jun). |
| Estado inicial | "En Ruta (backlog)" (automático) |

> **Cómo saber el id del sprint activo:** leer cualquier issue del sprint (ej. PROD-1014) con
> `fields:["customfield_10020"]` → trae `{id, name, state:"active", boardId:1267, startDate, endDate}`.
> O JQL `project = PROD AND sprint in openSprints()`. **El id cambia cada sprint** → verificarlo, no hardcodear.
> **NO crear/cerrar el sprint** (regla semanal): solo crear las cards **dentro** del sprint activo.

## Cómo debe verse una HISTORIA (alineada a metodología)
Toda historia/product task debe traer (Definition of Ready, `metodologia/product-logistics.md` §5):
- **Problema raíz** + **hipótesis de valor** ("creemos que [cambio] mejora [NSM] porque [evidencia]").
- **Métrica de éxito** atada a una NSM (movilización / % entrega / tiempo por fases).
- **Etapa de la cadena** y **fuga** que ataca.
- **Definición de datos cerrada** antes de la UI.
- **Criterios de aceptación** (Gherkin) — ver plantilla en `metodologia/handoff-ti.md` §6.

## Cómo deben verse las SUBTAREAS
Descomponer cada historia en subtareas por responsable y entregable concreto, p. ej.:
- 🧠 PM: discovery/datos, definición de reglas de negocio, criterios de aceptación.
- 🎨 PD (Pino): wireframes, prototipo, specs de UI, design final.
- 💻 TI: (no las crea Producto) — se definen en el hand-off.
- Cada subtarea: título accionable (verbo), estimación, y "done" claro.

## Estado real de los sprints — PENDIENTE de cargar
> Llenar con Jira desbloqueado o screenshots. Una fila por historia.

### Sprint actual — Michel Pino (semana 30-jun → · v FINAL 30-jun)
> **Capacidad:** ~32h (4 días). **Sprint-id:** ⏳ TBD (Juan crea/asigna; sesión Jira = Michel). **Foco: Same Day (PRM-1366 / épica PROD-1127).** Direcciones se **descartó** (árbol v2 la bajó a ~1%; la data no la respalda).
> **Cómo medirlo:** por **riesgo retirado** (¿cerró *Usable*? ¿prototipo testeado? ¿subió la Confianza de la oportunidad en el Dropi Score?), NO por pantallas/horas.

| Card `[PRODUCTO]` | Est. | Subtareas PD (🎨) |
|---|---|---|
| **[Same Day] Diseñar el flujo de creación de orden SD (MVP)** — cuelga de [PROD-1127](https://dropi-it.atlassian.net/browse/PROD-1127) | ~20h | **Revisar research de Michelle López (contexto)** 2h · TO-BE sobre AS-IS 3h · wireframe flag SD + estados 4h · validación hora de corte 2h · validación geográfica 2h · selección guiada transportadora 2h · prototipo + test 4h · spec UI/estados para TI 3h |
| Reuniones recurrentes (PD) | ~8h | Cellboard (mié) · dailies · weekly product (vie) · planning |

> **Alcance de diseño (gaps UX del MVP, del research):** ① flag SD · ② validación hora de corte · ④ validación geográfica · ⑥ selección guiada de transportadora. **Fuera:** propagación WMS (#3 TI) · marcación/medición (#7 Data) · notificación cliente (Post-MVP).
> **🧠 PM (Juan) le debe antes de arrancar:** (1) cerrar el **handoff Michelle→Michel** del research; (2) pasar insumos (cobertura por ciudad · tarifa pendiente con Carlos Peralta); (3) framing = **formalizar el SD** (flag+validaciones), NO "arreglar direcciones".
> **Balance:** 20 + 8 = **~28h** de ~32h.

### Sprint pasado — Michel Pino (semana 15–21 jun)
| Historia | Estado | Proyecto/Épica | Subtareas | Notas |
|----------|--------|----------------|-----------|-------|
| _(pendiente)_ | | | | |

### Sprint actual — Juan Diego (semana 30-jun → · v FINAL, contra Calendar + panel [LSC] + transcripciones 30-jun)
> **Reuniones reales ≈ 11h** (Calendar, NO los ~19h del screenshot viejo) + bloque Planning (focus 3h mar). **Sprint-id:** ⏳ TBD (sesión Jira = Michel). Cards Story `[PRODUCTO]` + Original Estimate en horas. **Solo proyectos del panel [LSC] (14) + action items de hoy. Nada de DROP heredado.**
> **Decisión de track estratégico (Juan, 30-jun):** **KPIs+meta ENTRA = prioridad 1 (CPO).** Cronograma Q3 + Visión → **DIFERIDOS a la próxima semana.**
> **Slots:** Weekly Product (vie) = sub-decisiones KPIs con Dir. Producto (Maria declinó el 1:1) · Weekly Proyectos IA (jue) = selección transportadoras · LATAM Carriers (mar) = tarifa/integraciones con Carlos.

| Card `[PRODUCTO]` | Est. | Track / fuente |
|---|---|---|
| **KPIs + meta — definir y proponer** | 6h | 🎯 **Prioridad 1 (CPO).** 2 KPIs (tasa de entrega · tiempo orden→transportadora + fases) · método (queries `temas/03`) · resolver **KR2.1 vs KR2.2** + **umbral ≤/≥24h** con Dir. Producto (Weekly Product) · proponer meta. 🅰️ desbloquear datos/export. *(lo que no necesita datos externos se cierra ya)* |
| Reuniones recurrentes | 11h | Calendar real |
| **Tarifas (PRM-1362) — perseguir feedback de José** | 3h | operativo · #1 panel (bloqueada tras Venezuela) |
| **Pruebas de entrega (PRM-1364) — destrabar campos Vía con Carlos** | 3h | operativo · subió de prioridad hoy |
| **Organizar transportadoras en la célula (Inter 7 pts + Envía)** | 4h | action item de José hoy |
| **Same Day (PRM-1366) — épica [PROD-1127](https://dropi-it.atlassian.net/browse/PROD-1127) + historia Michel** | 5h | operativo · panel |
| **Acta LATAM Carriers + revisar recolecciones** | 3h | action items de Carlos hoy |
| Apoyo metodología Logs Brasil + prep Cell Board (mié) | 2h | Carlos / célula |

> **Balance:** reuniones 11h + tasks 26h = **~37h** de ~45h → ~8h holgura. **Diferidos a la próxima:** Cronograma Q3 · Visión (validar Lente 2). 
> **Ojo Jira (auditoría 30-jun):** ~30 DROP heredados (>1 año, rol viejo: garantías/proveedores/métricas/ecom/Stock Pro/Veloces) distorsionan tu `priority` → **cerrar/desasignar**, SALVO 6 de Inter/refacturación/recolección (DROP-4953/4954/4951/4952/4059/7968) que tocan el trabajo de transportadoras de hoy.

### Sprint pasado — Juan Diego — "Product Sprint 23 - 26" (id 3534, cerró 30-jun)
> ✅ **Composición final del sprint 3534 (24-jun)** — Stories patrón PROD-1014:
> | Card | Cubre | Est. | Cuándo (agenda real) |
> |---|---|---|---|
> | [PROD-1014](https://dropi-it.atlassian.net/browse/PROD-1014) | Planeación semanal (pre-existente) | **2h** (fijas, todas las semanas) | continuo |
> | [PROD-1077](https://dropi-it.atlassian.net/browse/PROD-1077) | **Reuniones recurrentes** (lista de ceremonias dentro) | 19h | toda la semana |
> | [PROD-1073](https://dropi-it.atlassian.net/browse/PROD-1073) | Síntesis taller direcciones (PRM-91) | 8h | mié 24 PM (post Cell Board) |
> | [PROD-1075](https://dropi-it.atlassian.net/browse/PROD-1075) | Discovery Same Day (PRM-1366) | 6h | jue 25 PM |
> | [PROD-1076](https://dropi-it.atlassian.net/browse/PROD-1076) | Discovery Normalización estados (PRM-1297) | 6h | vie 26 PM |
> ~~PROD-1074 Prep Weekly IA~~ → **Juan la borra en UI** (se solapa con la card de reuniones recurrentes; la prep de transportadoras queda trazada en la dependencia PRM-1513 de `todos.md`). El conector no borra issues.
> **Spillover (NO creadas — entran si abre hueco):** Cronograma Q3 · Categorizar PRM · Action items Cell Board · Combos CAS. **KPIs (#2) están pendientes del export de Data.**
> **Capacidad real restante de la semana ≈ 13–14h** (mié PM ~3h + jue ~6h + vie PM ~4.5h); reuniones lun/mar ya pasaron.

> **Backlog completo de referencia (8 ítems)** — capacidad objetivo de semana llena ≈ **1w 5h (~45h)**. Tipo: Story (PM/discovery). Pino ya tiene su sprint cargado; este es solo el mío.
| # | Product Task | Est. | Etapa / fuga · NSM | Entregable |
|---|----|----|----|----|
| 1 | **Taller de validación y normalización de direcciones** (preparar + facilitar + sintetizar) — proyecto **PRM-91** | 8h | Confirmación / churn pre-red (validación SHOP) · ⬆️movilización | acta + AS-IS + hipótesis → [spec](../proyectos/validacion-normalizacion-direcciones/spec.md) + [Figma board](https://www.figma.com/board/LJbbDMU7kozDXq8xak54ko/Logistica?node-id=0-1) |
| 2 | **Correr KPIs de tiempo por fases (F1–F5)** + homologar F4/F5 (`Agrupacion_Estados_Col`) | 8h | Tránsito/desenlace · tiempo por fases | primer resultado + decisiones (universo/topes/zona) — `temas/03` |
| 3 | **Discovery Same Day** (PRM-1366) — problema raíz + hipótesis + métrica | 6h | Movilización · ⬆️movilización | `proyectos/same-day/spec.md` |
| 4 | **Discovery Normalización de estados** (PRM-1297) — levantar spec | 6h | Tránsito/novedad · habilita tiempo por fases | `proyectos/normalizacion-estados/spec.md` |
| 5 | **Cronograma de ejecución Q3** del Delivery Backlog (PRM-1513/1366/1512/1297/91) | 5h | gobierno · — | cronograma con responsables + fechas (depende de #2) |
| 6 | **Categorizar proyectos por etiqueta** (🔵/🔴/🟡/🟣) en PRM | 2h | gobierno · — | board ordenado |
| 7 | **Seguimiento action items Cell Board** (autoconfirmación · reclamo oficina · direcciones) | 4h | varias · — | pendientes movidos + estado |
| 8 | **Combos CAS (apoyo Supplier)** — cerrar alcance con Jaime + métrica con Supplier | 4h | Posventa/soporte · — | decisión de alcance + métrica ([combos/spec.md](../proyectos/combos/spec.md)) |
**Reuniones recurrentes + ceremonias (capacidad consumida ≈ 18–19h/sem)** — fuente: agenda real (screenshot 24-jun) + `planning/semana.md`. ⚠️ El MCP de Google Calendar **devolvió vacío** aunque el calendario SÍ tiene eventos → de momento cargar reuniones por **screenshot/semana.md**. Van en el sprint como tiempo bloqueado:
| Bloque | Día/hora | h |
|---|---|---|
| All hands | Lun 9:00 | 1 |
| Planning semanal (focus) | Lun 10:00 | 2 |
| ECOM – Fulfillment | Lun 11:15 | 0.75 |
| Integrations & Key Issues – LATAM Carriers (presencial) | Lun 14:00 | 1 |
| Planning – Logística (**organiza Juan**) | Lun 15:00 | 0.75 |
| Logistics Success – Daily | Mar–Vie (Vie 8:45) | 2 |
| Marketing Dropi / Servientrega | Mar 9:30 | 0.5 |
| Jaime / Juan Diego (Combos/Supplier) | Mar 10:30 | 0.5 |
| Nuevas condiciones Fulfillment | Mar 11:00 | 1 |
| Weekly Ecom/Logística | Mar 14:00 | 1 |
| Juan Diego / Michel – Cellboard (sprint) | Mar 15:00 | 1 |
| Revisemos Parametrizar Fulfillment | Mié 11:00 | 1 |
| **Cell Board – Logistic Success** (**organiza Juan**) | Mié 14:00 | 1 |
| Weekly Proyectos con IA | Jue 11:00 | 1 |
| Seguimiento de métricas Logística | Jue 15:00 | 1 |
| Product Lab 2.0 – Dropi global | Vie 9:00 | 2 |
| Weekly Product (showcase) | Vie 11:00 | 1.5 |
| Reporte de estado (WhatsApp) | Vie | 0.5 |

> **Balance del sprint ≈ 1w 5h (~45h):** reuniones **~19h** + product tasks **~26h**. → Prioridad firme: tareas **1–4** (taller 8h + KPIs 6h + Same Day 5h + Normalización 5h = **24h**, caben). **5–8 = spillover** (entran si la semana abre hueco).
> Cada Product Task se descompone en subtareas (🧠 PM: discovery/datos/criterios) al crearla; aplicar DoR (`metodologia/product-logistics.md` §5) + filtro de priorización (§4.5).

## Cómo cargar el estado real
1. **Si Jira se desbloquea:** traigo por JQL `project = PROD AND assignee = <accountId>` los sprints actual y pasado, y documento historias + subtareas aquí.
2. **Vía screenshot:** pásame capturas del board (sprint actual y pasado de Pino + el tuyo) y las leo y lleno esta tabla.
3. Con el estado cargado, propongo las **subtareas faltantes** por historia según la convención de arriba.
