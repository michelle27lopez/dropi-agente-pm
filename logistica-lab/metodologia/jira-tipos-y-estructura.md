# Tipos de issue y estructura en Jira (Dropi) — referencia

> **Para qué:** entender QUÉ es cada tipo, CÓMO se relaciona y NO dañar el trabajo de otros
> al crear/editar/agrupar en Jira. Complementa `jira-formatos.md` (formato de título/cuerpo).
> Origen: Space settings → Types and workflows de **PRM** (screenshot 23-jun-2026) + uso observado.

## Dos mundos que NO se mezclan
- **PRM — [Producto] Product Road map** (Jira **Polaris · product_discovery**) = el **roadmap / discovery**. Tiene tipos propios (abajo). Es donde Juan vive el discovery de logística/Ecom.
- **DROP (Dropi) y PROD (Product Team)** (Jira **software**) = la **entrega / desarrollo**. Tipos: **Epic · Historia · Tarea · Subtarea · Error · Hotfix · No Code · Product**.
- **STID** = soporte plataforma. **PROB** = Product Discovery (Problem roadmap).
> Regla: el **discovery** se modela en PRM (Solución/Oportunidad/…); el **desarrollo** en DROP/PROD (Epic→Historia→Subtarea). Se **enlazan**, no se anidan entre proyectos (ver §Relacionar).

## Tipos de PRM (Polaris) — qué es cada uno
| Tipo | Para qué (uso observado / inferido) | Nivel |
|---|---|---|
| **North Start Metric** | Métrica norte de la célula (NSM). Lo más alto. | Estrategia |
| **OKR** | Objetivo. | Estrategia |
| **KR/KPI** | Resultado clave / indicador del OKR. | Estrategia |
| **Proyecto Okr** | Proyecto ligado a un OKR (iniciativa con resultado). | Iniciativa |
| **Proyecto** | Iniciativa/epopeya de discovery; agrupa Soluciones/Oportunidades. Ej: PRM-1287/1288/1292 (Ecom), PRM-1337 (Combos). | Iniciativa (≈ épica) |
| **Solución** | Una solución concreta a explorar/diseñar. **El más usado por Juan en Ecom** (PRM-110, 116, 555, 1568…). | Discovery |
| **Oportunidad** | Oportunidad detectada, aún sin solución cerrada. Ej: PRM-1467 (lectura combos), PRM-745/1380/1381 (guías reemplazatorias). | Discovery |
| **Idea** | Idea temprana, sin validar. Ej: PRM-401. | Discovery |
| **Problema** | Problema de roadmap (enfoque problem-first). | Discovery |
| **Solicitud** | Petición entrante (de otra área/stakeholder). | Entrada |
| **Operaciones** | Trabajo operativo de la célula. | Trabajo |
| **Validación Transportadora** | Tipo específico de logística (validar carrier). | Trabajo |
> ✅ **CONFIRMADO (24-jun, `getJiraProjectIssueTypesMetadata`):** los **12 tipos de PRM son todos `hierarchyLevel: 0`** → en Polaris **NO hay padre-hijo nativo entre tipos.** La jerarquía NSM→OKR→KR→Proyecto→Solución es **100% por enlaces**, no por anidamiento. Jerarquía real solo dentro de DROP/PROD (Épica→Historia→Subtarea). 12 tipos: Solución(10127) · Proyecto(10327) · Solicitud(10870) · Oportunidad(11089) · Idea(11124) · Operaciones(11167) · OKR(11200) · KR/KPI(11201) · Validación Transportadora(11409) · Proyecto Okr(11442) · North Start Metric(11515) · Problema(11517).

## Tipos de enlace del sitio (confirmados 24-jun, `getIssueLinkTypes`)
| Enlace | id | inward / outward | Uso correcto |
|---|---|---|---|
| Polaris work item link | 10008 | is implemented by / implements | ⭐ discovery PRM → **Épica DROP/PROD** |
| Discovery - Connected | 10012 | is connected to / connects to | Solución/Oportunidad ↔ Proyecto madre |
| Polaris merge | 10009 | merged into / merged from | fusionar duplicados |
| Polaris datapoint | 10010 | added to idea / is idea for | insight/dato → idea |
| Work item split | 10011 | split from / split to | partir un ticket |
| Problem/Incident | 10006 | is caused by / causes | vincular a Solicitud/incidente (INVS) |
| Blocks 10000 · Relates 10003 · Duplicate 10002 · Cloners 10001 | — | genéricos | preferir los Polaris específicos |

## Test de "lógica" de una idea (24-jun)
Una idea de discovery tiene lógica completa si traza **arriba** (connects to un OKR/KR/Proyecto Okr) **y abajo** (is implemented by una Épica DROP/PROD), más su entrada (causes una Solicitud INVS si aplica). Buckets observados en el set logístico → ver `reportes/auditoria-roadmap-lsc.md §Auditoría de lógica`.
**Convención pendiente:** el enlace PRM→Solicitud INVS hoy es mixto (unas `causes`, otras `blocks`) — estandarizar en `causes` (Problem/Incident 10006).

## Tipos de DROP / PROD (entrega)
`Epic` → `Historia` / `Tarea` / `Error` / `Product` / `Hotfix` / `No Code` → `Subtarea`.
(`Product` = tareas de la etapa de diseño/producto. Formato de título/cuerpo en `jira-formatos.md`.)

## Cómo relacionar y agrupar — convención REAL de Dropi (confirmada)
> Verificada en **PRM-116** y **PRM-845** (24-jun). Un PRM **sí** debe tener su DROP/PROD relacionado. Los enlaces correctos son los específicos de Polaris, NO "Relates" genérico.

**La cadena canónica:**
```
North Star Metric → OKR → KR/KPI            (estrategia, PRM)
        │
   Proyecto (PRM)                            (iniciativa)
        │  ⟵ "Discovery - Connected" (id 10012, connects to / is connected to)
   Solución / Oportunidad (PRM)              (discovery)
        │  ⟵ "Polaris work item link" (id 10008, implements / is implemented by)  ⭐
   Épica (DROP/PROD)                         (desarrollo)
        └ Historia → Subtarea               (jerarquía real dentro de DROP/PROD)
```

- **Solución/Oportunidad (PRM) → Épica (DROP/PROD):** enlace **"Polaris work item link"** (`id 10008`): la solución *implements*-↔-*is implemented by* la épica. ⭐ Es el **puente discovery→desarrollo**. Ej real: **PRM-116** *is implemented by* **DROP-3462** (Epic); **PRM-845** *is implemented by* **DROP-13776** (Epic).
- **Solución/Oportunidad (PRM) ↔ Proyecto (PRM):** enlace **"Discovery - Connected"** (`id 10012`). Conecta el item de discovery con su **Proyecto** (iniciativa) madre. ⚠️ NO es padre-hijo: en PRM/Polaris la agrupación Proyecto↔Solución es por **conexión**, no jerarquía. Ej: PRM-116 *connected to* PRM-1247 y PRM-1337 (Proyectos).
- **Dentro de DROP/PROD:** sí hay jerarquía real Épica → Historia → Subtarea.
- **Unificar duplicados PRM:** **"Polaris merge work item link"** (`id 10009`, merged from/into) fusiona ideas/soluciones repetidas (mejor que cerrarlas a mano).
- **"Relates"** (`id 10003`) = genérico; **preferir** los específicos de Polaris de arriba.

> Para agrupar trabajo que cruza dueños/proyectos: enlazar con el tipo correcto; **no re-parentear** lo ajeno. `createIssueLink` con el `id` del tipo correspondiente.

## Reglas de seguridad — NO dañar el trabajo de otros (IMPORTANTE)
1. **Antes de tocar un ticket:** revisar **tipo, estado, asignado, reporter, padre, enlaces** y en qué **vista/sprint/reporte** aparece. Entender antes de cambiar.
2. **No re-parentear ni cambiar el estado** de tickets de otras personas (ej. joan.palacio, Nodus IA, Laura) sin acordarlo → rompe sus sprints/reportes. Para agrupar trabajo ajeno → **enlazar**, no mover.
3. Crear/editar/transicionar sale a nombre de la **cuenta conectada** (hoy = **Michel Pino**; ver memoria). Michel **NO crea en PRM** (sí en DROP/PROD); editar/transicionar PRM por verificar.
4. **No duplicar:** antes de crear, buscar si ya existe (mismo concepto puede estar como Oportunidad PRM + Historia DROP + Tarea PROD).
5. Preferir **enlaces** sobre re-parenteo cuando cruza dueños o proyectos.
6. **Campos estructurados de Polaris alimentan vistas/reportes** → en PRM no basta la descripción; llenar los *pinned fields* (Célula, Etapa Delivery, Dominio, Feature, OKR/KR, Manager, Diseñador…). Inspeccionar con `getJiraIssue` (`expand:"editmeta"`, `fields:["*all"]`). El campo **Manager** (`cf_10684`) **sí acepta a Jaime Guevara** aunque no sea asignable como *Assignee*. (Ver memoria `jira-polaris-campos`.)

## Caso aplicado (ejemplo) — Guías reemplazatorias en Ecom Scanner
Mismo concepto repartido en 3 proyectos (ver inventario en chat 23-jun):
- **Discovery (PRM, Juan):** Oportunidades por transportadora — PRM-745 (Interrap.), PRM-1380 (Coord.), PRM-1381 (TCC). Desactualizadas.
- **Entrega (DROP, joan.palacio/Nodus IA):** ✅ Finalizado — DROP-25407 (Historia con subtareas 25499/25516/25557), DROP-25564, DROP-25614, DROP-25667, DROP-23090.
- **Lanzamiento (PROD, Laura):** Tareas PROD-1045 (lanzamiento), PROD-1044 (re-lanzamiento Servientrega), PROD-1049 (marketing).
- **Recomendación (con la convención correcta):** cada Oportunidad PRM (745/1380/1381) → **"is implemented by"** (Polaris work item link 10008) la Épica/Historia DROP que la construyó (DROP-25407/25564/25614) y → **"Discovery - Connected"** (10012) a su Proyecto Ecom (PRM-1287/1288); las 3 oportunidades por transportadora se pueden **fusionar** (Polaris merge 10009) en 1 "multi-transportadora" solo con acuerdo. PROD-1045 (lanzamiento) → enlazar y documentar para Laura. **No re-parentear** lo de joan/Laura.
> Nota: **PRM-1568** (Combos CAS, creada hoy) quedó con *Relates* a PROD-471/PRM-1467 — cuando exista su épica de desarrollo, enlazar con **Polaris work item link (10008)** en vez de Relates.
