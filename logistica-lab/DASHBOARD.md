# 🧠 Dashboard — Juan Diego Bautista · Logistic Success (Dropi)

> Punto de entrada del cerebro (mapa estable). **Para el estado vivo / continuar en un
> chat nuevo, leer primero [`ESTADO.md`](ESTADO.md).**
> Última actualización: 2026-06-22

## Acceso rápido (lo que más pide Maria)
- 🗂️ **Backlogs + priorización única** → [`estrategia/backlogs-y-priorizacion.md`](estrategia/backlogs-y-priorizacion.md) — Product Backlog (discovery) + Delivery Backlog (ejecución) en una sola vista.
- 🎄 **Carta a Maria (estado por proyecto)** → `reportes/para-maria-carta-al-nino-dios.md` *(bóveda: reportes/para-maria-carta-al-nino-dios.md)* — frenado / pendiente / falla / prometido-no-salió / qué necesito. Insumo del **estratégico de los jueves** (de Maria, con Luis Ramos).

## Cómo está organizado esto
- `estrategia/` — **la BASE: alineación estratégica de la CPO (Maria Ossa) 2026·S2.** Marco Común (universo, metodología, OKRs de compañía) + direccionamiento de la célula. **Todo proyecto parte de aquí.** Índice: `estrategia/_index.md`.
- `metodologia/product-logistics.md` — cómo pensamos los proyectos (el filtro "duro"). `metodologia/handoff-ti.md` — plantilla de entrega a TI.
- `metodologia/spec-driven.md` — **la LEY** (estado+fuente, cero-placeholder, gate de realidad). Cada proyecto = un `spec.md` (plantilla `proyectos/_PLANTILLA-spec.md`). Piloto: `proyectos/parametrizacion-tarifas/spec.md`.
- `metodologia/frontera-cerebro-rovo.md` — **la FRONTERA:** el cerebro piensa, Rovo ejecuta. Qué se delega a un agente de Atlassian y qué no. Regla: **Rovo nunca es dueño de una definición** (un solo origen = este repo).
- `metodologia/discovery-y-categorizacion.md` — **el PLAYBOOK del proceso:** cómo convertir una idea/proyecto de PRM en discovery (categorizar → árbol de problemas → rutas → experimentos → data → métrica/PQL), con PLG + cadena de valor. Tablero de categorización en `proyectos/_categorizacion.md`.
- `conocimiento/` — base de conocimiento (logística como producto + data + PLG). Síntesis: `conocimiento/sintesis-logistica-producto.md`. Diccionario de datos: `conocimiento/temas/10`. **Marco de marca + estrategia:** `temas/12` (Día 1: perfiles, niveles de conciencia, comunidad) y `temas/13` (Día 2: cadena de valor, la orden como motor, **Dropi Trust Agent**).
- `planning/semana.md` — reuniones recurrentes + deberes semana a semana. `equipo/_index.md` — stakeholders (Morales, Peralta, Escobar).
- `proyectos/_index.md` — todos los proyectos + estado. Cada proyecto tiene su carpeta.
- `planning/todos.md` — TODOs activos (manuales + generados). **La lista viva.**
- `planning/daily/` — cierres de día (un archivo por día).
- `reuniones/` — actas por sesión (fechadas). `reuniones/recurrentes/` — **fichas estables** de las 3 reuniones del sistema (prep · acta · ruteo): Cell Board, Weekly TI, Weekly Producto.
- `reportes/` — reportes a stakeholders. Principal: **estado semanal de viernes (mensaje de WhatsApp)** — `reportes/_index.md`.

## Foco de la célula
**Logistic Success · core = LA ORDEN.** Valor agregado de Dropi = **contraentrega (COD)**.
**North Star Metrics:** ⬆️ **Movilización** + ⬆️ **% de entrega**. KPI de tiempo:
**tiempo de entrega POR FASES** (desde que se genera la orden y se confirma). TTV (primera
orden entregada) = lente de activación/PLG. Detalle en `metodologia/product-logistics.md` §3.
Foco de trabajo: **discovery con datos y métricas** (diccionario en `conocimiento/temas/10`).

## Dónde vive todo
- **Documentación de proyectos** → Drive "7. Logistic Success" ([carpeta](https://drive.google.com/drive/folders/1H_q-rVZG_ktDoLiDT3iYDQWbiVSYFmkF)).
- **Tablero principal logística** → Jira PRM Polaris ([vista principal](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11505515)).
- **Mi sprint** → PROD board 1267 ([backlog Juan Diego](https://dropi-it.atlassian.net/jira/software/c/projects/PROD/boards/1267/backlog?assignee=712020%3Aec737502-a59a-4338-8f2a-fc43c529d51c)).
- Mapa completo de fuentes → `fuentes/_index.md`.

## Estado rápido
| Área | Estado |
|------|--------|
| Proyectos activos | 7 carpetas reales en Drive — ver `proyectos/_index.md` |
| TODOs abiertos | Ver `planning/todos.md` |
| Próxima reunión clave | Weekly Ecom/Logística — mar 23 jun 2pm · Logistics Daily — vie 26 jun 8:45am |
| Última reunión documentada | All Hands 22 jun *(bóveda: reuniones/2026-06-22-all-hands.md)* |

## Rituales (lo que le pido al agente)
- **"Arranquemos el día"** → leer dashboard + TODOs + reuniones de hoy en Calendar → proponer foco.
- **"Cierre del día"** → revisar qué se movió, actualizar TODOs, crear archivo en `planning/daily/`, listar pendientes para mañana.
- **"Estado de [proyecto]"** → leer su carpeta + Jira, dar avance + bloqueos + preguntas abiertas.
- **"Sé duro con [proyecto]"** → aplicar el filtro de `metodologia/product-logistics.md`.
- **"prep [cell board / weekly ti / weekly producto]"** → guion de la reunión (ver `reuniones/recurrentes/`).
- **"procesa la reunión [link Gemini]"** → acta fechada + ruteo de salidas (vía `/intake-transcripcion`).
- **"arma el reporte semanal"** → mensaje de WhatsApp listo para enviar (vía `/control-entrega`).

## Skills (comandos `/`) — generadores cableados a la ley
Invocables desde cualquier chat. Todos leen la metodología y el `spec.md` del proyecto,
respetan estado+fuente y entregan **borrador** para confirmar. Formato Jira: `metodologia/jira-formatos.md`.
| Comando | Qué hace |
|---|---|
| `/epica` | Épica en formato oficial (título `[Sigla]: Nombre_País_Usuarios`) |
| `/historia` | HU por etiqueta (UX/UI/FE/BE/DBA/QA/Legal/Lanzamiento) con Gherkin |
| `/flujo` | User flow paso a paso + diagrama Mermaid + casos de error |
| `/pitch` | Pitch ejecutivo para aprobar shaping |
| `/kickoff` | Sección Kick-off del doc E2E (según `handoff-ti.md` §1) |
| `/brief-lanzamiento` | Brief para comunicaciones/marketing |
| `/discovery` | Iterar AS-IS / TO-BE / capacidades / riesgos en borrador |
| `/intake-transcripcion` | Transcripción cruda → señales + acta + TODOs (sin tocar oficial) |
| `/control-entrega` | Avance real vs. OKRs/hitos/North Star; audita Definition of Ready/Done |
| `/promover-spec` | Promover un borrador APROBADO a `spec.md`/canon (versiona, no borra) |
