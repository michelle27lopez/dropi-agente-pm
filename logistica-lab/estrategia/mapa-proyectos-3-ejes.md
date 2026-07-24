# Mapa de proyectos — los 3 ejes (Jira · Maria · Repo)

> **Para qué:** antes de documentar nada, saber **dónde está parado cada proyecto en los tres
> sistemas que lo miran**, porque hoy no coinciden. De aquí salen las fichas, no al revés.
> **Fecha:** 2026-07-22 · **Verificado contra las fuentes vivas ese día** (no contra el cerebro).

## Los tres ejes

| Eje | Qué es | Fuente de verdad |
|---|---|---|
| **① Jira** | El estado operativo real (`Pre Hand off` → `Listo para hand off` → `Hand off hecho` · `En Desarrollo`) | [PRM Polaris](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11505515) |
| **② Maria** | El Delivery Backlog oficial de la célula (`EJECUTAR` / `FINALIZAR`) + el Product Backlog obligatorio | [Confluence PD/1485471746](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1485471746) · última edición **30-jun** |
| **③ Repo** | La documentación (spec-driven): ¿existe `spec.md`? ¿está completo? | `logistica-lab/proyectos/` |

⚠️ **El hallazgo de fondo:** los tres ejes **no coinciden**, y las diferencias no son de forma.
Hay proyectos que Maria da por en ejecución y en Jira están en backlog sin asignar; hay proyectos
con hand-off hecho que el repo describe como pendientes; y hay trabajo real de Juan que **no
aparece en el backlog de Maria en absoluto**. Documentar sin resolver esto propaga el desalineamiento.

---

## 1 · Delivery Backlog de Maria — los 5 oficiales

Son los únicos cinco que Maria considera "aprobados, en ejecución".

| Proyecto | Ticket | ① Jira | ② Maria | ③ Repo | Desalineamiento |
|---|---|---|---|---|---|
| Normalización de estados | [PRM-1297](https://dropi-it.atlassian.net/browse/PRM-1297) | Inv. y definición | **EJECUTAR** | ✅✅ el mejor documentado (spec + CONTEXTO + propuesta + vista interactiva) | — · pendiente: **7 gates de decisión**, 2 críticos y externos |
| Same Day | [PRM-1366](https://dropi-it.atlassian.net/browse/PRM-1366) | Inv. y definición | **EJECUTAR** | 🟡 spec levantado | falta data + fase 1/tarifa |
| Optimización selección transportadoras | [PRM-1513](https://dropi-it.atlassian.net/browse/PRM-1513) | ⚠️ En Ruta (backlog), **sin asignar** | **EJECUTAR** | ✅ spec | **Maria lo da en ejecución; Jira lo tiene en backlog sin dueño.** PM es Kate Pencue, Juan = Carrier Ops |
| Herramienta preventiva de novedades | [PRM-1512](https://dropi-it.atlassian.net/browse/PRM-1512) | ⚠️ En Ruta (backlog), **sin asignar** | **FINALIZAR** | ✅ spec (`novedad-dueno-triaje`) | **Maria pide finalizarlo y en Jira nadie lo tiene.** Alinear con Seller Success |
| Validación de direcciones | [PRM-91](https://dropi-it.atlassian.net/browse/PRM-91) | En Ruta (backlog) | **EJECUTAR** | ✅ spec | ⚠️ **en Jira el dueño es Katerine Pencue, no Juan** — conflicto de ownership a resolver con Maria |

**Lectura:** 3 de los 5 que Maria da por en ejecución están en Jira **en backlog y sin asignar**.
Eso no se arregla documentando: se arregla moviendo estado y asignando dueño en Jira.

## 2 · Trabajo real de Juan que NO está en el Delivery Backlog de Maria

Estos tres son los que motivaron este mapa. Todos son trabajo legítimo —José confirmó el 30-jun el
roadmap **Tarifas → Selección transportadoras → Fulfillment**— pero **ninguno aparece en la página de Maria.**

### 2.1 · Parametrización de tarifas — [PRM-1362](https://dropi-it.atlassian.net/browse/PRM-1362)
- **① Jira: `Hand off hecho`** (14-jul). **No es "listo para hand-off": ya pasó.**
- **② Maria:** fuera del Delivery Backlog **a propósito** — vive en el **OKR 3 de compañía** (margen), no en el OKR 2 de la célula.
- **③ Repo:** ✅✅ el único con documentación completa (7 archivos: spec, doc E2E, pulido kickoff/handoff, feature UI, revisión).
- **Estado real:** bloqueado en TI por la prioridad de **Venezuela** (cambio de moneda). Doc en review de José.
- **Acción:** ninguna de documentación. Solo **seguimiento del desbloqueo**. No re-documentar.

### 2.2 · Parametrización de Fulfillment — [PRM-1446](https://dropi-it.atlassian.net/browse/PRM-1446)
- **① Jira: `Listo para hand off`** (14-jul), asignado a Juan. ✅ el único de los tres que sí está donde creías.
- **② Maria:** no aparece. **Pero se solapa con el checklist obligatorio "Visión de producto logístico"** (fulfillment + bodegas + EcomScanner) del Product Backlog → conviene tratarlos juntos.
- **③ Repo:** ❌ **nada.** Aparece en `proyectos/_index.md` sin ticket y con síntesis *"por crear"*.
- **Sustancia que ya existe (en la descripción del ticket, sin destilar al repo):**
  - Bodegas propias 2PL en **Bogotá, Cali y Medellín** · **92.000 órdenes/mes** combinadas.
  - El cobro se activa solo al llegar a `Entregado` → **20–25% de las órdenes preparadas y despachadas nunca se cobran** (devoluciones, pérdidas, cancelaciones post-despacho).
  - **Servicios ya prestados y no cobrados:** almacenamiento, etiquetado manual de productos sin código de barras, armado de kits y combos, órdenes multi-unidad.
- **Acción:** 🔴 **es el hueco de documentación #1.** Levantar `spec.md` desde el ticket + Drive.

### 2.3 · Pruebas de entrega — **no es un ticket, son ocho**
No hay duplicado: hay un **Proyecto OKR paraguas** con dos solicitudes y **una solución por transportadora**
—el esquema "proyecto por transportadora" que definió José el 30-jun—.

| Ticket | Tipo | ① Jira | Dueño |
|---|---|---|---|
| **[PRM-1517](https://dropi-it.atlassian.net/browse/PRM-1517)** · Pruebas de intentos de entrega (SLAs, foto con geolocalización) | **Proyecto OKR ☂️** | En Ruta (backlog) | ⚠️ **sin asignar** |
| [PRM-1364](https://dropi-it.atlassian.net/browse/PRM-1364) · Pruebas de entrega | Solicitud | Próximo | Juan |
| [PRM-1361](https://dropi-it.atlassian.net/browse/PRM-1361) · Evidencia de novedad como georreferenciación | Solicitud | ⛔ **Impedimentos** | Juan |
| [PRM-1462](https://dropi-it.atlassian.net/browse/PRM-1462) · **ENVIA** | Solución | Inv. y definición | sin asignar |
| [PRM-1455](https://dropi-it.atlassian.net/browse/PRM-1455) · Interrapidísimo | Solución | ⛔ **Impedimentos** | sin asignar |
| [PRM-1610](https://dropi-it.atlassian.net/browse/PRM-1610) · Domina | Solución | En Ruta | sin asignar |
| [PRM-1611](https://dropi-it.atlassian.net/browse/PRM-1611) · TIUI | Solución | En Ruta | sin asignar |
| [PRM-618](https://dropi-it.atlassian.net/browse/PRM-618) · Coordinadora (integraciones) | Idea | En Ruta | Juan |

- **② Maria:** no aparece en el Delivery Backlog. Pero **PRM-1517 sí está conectado a [KR2.1 tasa de entrega ≥70%](https://dropi-it.atlassian.net/browse/PRM-1396) y al OKR 2** → tiene derecho de piso, solo no está declarado en su página.
- **③ Repo:** ❌ **nada.** No está ni en `proyectos/_index.md`. Solo existe el kickoff `reportes/2026-07-06-kickoff-pruebas-de-entrega-POD.pdf`, **en la bóveda y sin versionar**.
- 💎 **Justificación de negocio enterrada** en la descripción de PRM-618, sin recoger en ningún documento:
  > "Actualmente Coordinadora tiene un API para enviar las pruebas de entrega. **El 80% de las solicitudes del equipo de logística a las transportadoras son las pruebas de entrega. Y es la solicitud más común.**"
- **Acción:** 🔴 hueco de documentación #2. Antes de escribir el spec: **asignar el paraguas PRM-1517**, y destrabar los dos en `Impedimentos` (PRM-1361 y PRM-1455) o declararlos fuera de alcance.

## 3 · Discovery propio (el árbol de las fugas) — documentado, sin ticket formal en varios casos

| Proyecto | Ticket | ③ Repo | Nota |
|---|---|---|---|
| Movilización: rescatar confirmación | [PRM-1497](https://dropi-it.atlassian.net/browse/PRM-1497) | ✅ spec | fuga #1 · de aquí cuelga el experimento de **autoconfirmación** |
| Reducir devoluciones (COD) | [PRM-1523](https://dropi-it.atlassian.net/browse/PRM-1523) | ✅ spec | fuga ② |
| Dirección confiable + geo | cruza PRM-91/1497/1512/1523 | ✅ spec | rama muestra |
| Torre de control / tiempo por fases | ⚠️ **sin ticket** | ✅ spec | habilitador del KPI de tiempo · **falta crear el Proyecto OKR** |
| Guías reemplazatorias | [PRM-745](https://dropi-it.atlassian.net/browse/PRM-745) · [1380](https://dropi-it.atlassian.net/browse/PRM-1380) · [1381](https://dropi-it.atlassian.net/browse/PRM-1381) | ✅ spec | 🟢 **en beta real** con Interrapidísimo, Coordinadora y TCC |
| Combos | [PRM-555](https://dropi-it.atlassian.net/browse/PRM-555) · [1372](https://dropi-it.atlassian.net/browse/PRM-1372) | ✅ spec | ⛔ **es de Supplier Success**, no de logística |

## 4 · Lo que estaba fuera del radar (a nombre de Juan, sin doc ni mención)

Salió de barrer Jira por estado. **Nada de esto está en el cerebro ni en el tablero.**

| Ticket | ① Jira | Desde | Qué hacer |
|---|---|---|---|
| [PRM-407](https://dropi-it.atlassian.net/browse/PRM-407) · [Ecom] QR de recolección Veloces a proveedores | `Listo para hand off` | **01-jun** | 7 semanas parado: documentar y sacarlo, o bajar de estado |
| [PRM-796](https://dropi-it.atlassian.net/browse/PRM-796) · Embebido de imágenes | `Listo para hand off` | **01-jun** | idem |
| [PRM-118](https://dropi-it.atlassian.net/browse/PRM-118) · Garantías: de recolección a entrega | `Pre Hand off` | 01-jun | confirmar si sigue vivo |
| [PRM-1431](https://dropi-it.atlassian.net/browse/PRM-1431) · Suppli CO | `En Desarrollo` | 22-jun | validación transportadora |
| [PRM-1265](https://dropi-it.atlassian.net/browse/PRM-1265) · Optimización velocidad/calidad de integración de transportadoras | `En Desarrollo` | 05-jun | — |
| [PRM-1067](https://dropi-it.atlassian.net/browse/PRM-1067) · Reportes dashboard fase 1 | `En Desarrollo` | 11-jun | — |

**Tu columna de `Listo para hand off` está inflada:** de 3 proyectos tuyos ahí, solo **1 (fulfillment)** es real y reciente.

## 5 · Experimentos — NO son proyectos

| Experimento | Dueño | Estado real | Ticket |
|---|---|---|---|
| **Vigía** — extensión Chrome sobre el módulo de órdenes | **Michel Pino** | 🎨 **diseño en curso**, sin desarrollo técnico *(confirmado por Juan, 22-jul)* | ⚠️ **no existe en Jira** · métrica "[por definir con datos]" |
| **Autoconfirmación por madurez** | Juan | por arrancar (dropshippers ≥50 órd/mes; no aplica en zona rural) | sin ticket propio · cuelga de PRM-1497 |

⚠️ **Vigía no existe en ningún sistema.** Mientras sea diseño está bien; **el día que entre a desarrollo
necesita ticket, métrica y spec o se construye a ciegas.** Ese es el gate.

## 6 · Product Backlog de Maria (checklist **obligatorio**) — los 3 están cerrados

⚠️ *`ESTADO.md` todavía dice que el cronograma y la visión están "DIFERIDOS". **Está desactualizado**:
los tres entregables existen en `estrategia/`. Corregir esa línea del ESTADO.*

| Ítem | Estado | Entregable |
|---|---|---|
| Primera medición de KPIs y meta *(wonder)* | ✅ cerrado | [`primera-medicion-kpis-y-meta.md`](primera-medicion-kpis-y-meta.md) |
| Cronograma de ejecución Q3 *(arranque)* | ✅ cerrado | [`roadmap-q3-logistica.md`](roadmap-q3-logistica.md) — 5 fases con dueño y métrica |
| Visión de producto logístico | ✅ cerrado | [`vision-producto-logistico.md`](vision-producto-logistico.md) — los 3 lentes (v1, 30-jun) |

**Matiz honesto sobre el cronograma:** Maria pidió *"responsables **y fechas**"*. El roadmap Q3 entrega
**fases con dueño, métrica y secuencia**, pero declara explícitamente que las fechas duras salen del
Cell Board / Delivery y **no se inventan**. Si Maria espera fechas calendario, ese es el único delta
—y ahora sí se puede cerrar, porque este mapa da el estado real de cada proyecto para fecharlo.

**Solapamiento a aprovechar:** la visión ya cubre *fulfillment + bodegas + EcomScanner* por los 3 lentes.
El spec de Fulfillment (§2.2) debe **colgar de ella**, no reabrirla.

---

## 7 · Prioridad que sale del mapa

1. 🔴 **Arreglar Jira antes de documentar.** Asignar el paraguas PRM-1517 · mover PRM-1513 y PRM-1512 fuera de "En Ruta" (Maria los da en ejecución/finalizar) · resolver el ownership de PRM-91 con Maria. *Documentar sobre estados falsos es documentar mal.*
2. 🔴 **Spec de Fulfillment (PRM-1446)** — es el único en `Listo para hand off` con hueco total de documentación, y arrastra la "Visión de producto logístico" que Maria espera.
3. 🔴 **Consolidar Pruebas de entrega** (el árbol de 8) en un solo spec, recogiendo el dato del 80%.
4. 🟡 **Limpiar la columna de hand-off**: PRM-407 y PRM-796 llevan 7 semanas.
5. 🟡 **Fechar el roadmap Q3** con Maria (único delta del Product Backlog: pidió fechas, hay fases) + **corregir la línea del `ESTADO.md`** que da esos ítems por diferidos.

## Fuentes
- Jira PRM, consultado **22-jul-2026** (estados y asignaciones verificados uno por uno).
- Confluence [PD/1485471746](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1485471746), autora Maria Ossa, **última edición 30-jun-2026** — la síntesis del repo en [`direccionamiento-logistic-success-2026-s2.md`](direccionamiento-logistic-success-2026-s2.md) **la refleja fiel, no está desactualizada**.
- `logistica-lab/proyectos/` y `proyectos/_index.md`.
- Roadmap de José (30-jun, vía `ESTADO.md`): Tarifas → Selección transportadoras → Fulfillment.
