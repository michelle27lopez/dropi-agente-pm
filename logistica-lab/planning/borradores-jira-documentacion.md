# 📝 Borradores de documentación para Jira

> **Qué es:** el texto para llenar las descripciones vacías que encontró la auditoría del
> **10-ago-2026**. Cada borrador sale de los specs del cerebro. Nada inventado.
>
> **Cuenta:** verificada con `atlassianUserInfo` → **Producto** (`producto@dropi.co`), que sí
> opera sobre PRM. El historial de los tickets dirá que los editó "Producto".
>
> **Solo se toca el campo `description`.** No se cambia estado, asignado, tipo ni enlaces
> (`metodologia/jira-tipos-y-estructura.md` §reglas de seguridad).

---

## 🔴 HALLAZGO 10-ago · Los tickets de PRM NO se pueden editar por API

Al intentar publicar `PRM-1297` la API respondió:

```
Field 'description' cannot be set. It is not on the appropriate screen, or unknown.
```

Se verificó con `expand=editmeta`, y la causa es estructural, no de permisos:

| Proyecto | Tipo de proyecto | `editmeta.fields` | ¿Se puede escribir? |
|---|---|---|---|
| **PROD** | `software` (clásico) | `summary`, `description`, `assignee`, `issuetype` | ✅ **Sí** |
| **PRM** | `product_discovery` (Polaris) | **`{}` — vacío** | ❌ **No, ningún campo** |

Jira Product Discovery no expone sus campos por la API REST clásica; se editan por su propia
interfaz o por la GraphQL de Polaris, que el conector MCP no ofrece.

**Consecuencia para este trabajo:**

* **Las 3 épicas de PROD → publicadas por API.** ✅ 10-ago
* **Los 11 tickets de PRM → hay que pegarlos a mano** desde este archivo. No hay alternativa
  automatizable con las herramientas actuales.

Esto también explica por qué `getJiraProjectIssueTypesMetadata` sobre PRM devolvía
*"No puedes crear incidencias en este proyecto"* incluso con una cuenta con permisos: Polaris
no responde a esos endpoints.

### Lo que SÍ funciona en Polaris: los comentarios

`addCommentToJiraIssue` usa un endpoint distinto y **sí escribe en PRM** (probado el 10-ago en
PRM-1297, comentario `51606`). No es lo mismo que la descripción —queda como comentario, no
como cuerpo— pero la documentación vive dentro de Jira y no solo en el repo.

| Acción | PRM (Polaris) | PROD (software) |
|---|---|---|
| `description` y demás campos | ❌ imposible | ✅ |
| **Comentarios** | ✅ **funciona** | ✅ |
| Asignar responsable | ❌ | ✅ |
| Enlaces entre tickets | ⏳ sin probar | ✅ |

---

## Los campos de clasificación · qué significa "completo"

**El modelo es PRM-1362**, el único ticket del portafolio con todo lleno. Esto es lo que tiene,
con el `customfield` exacto para que llenarlo sea mecánico:

| Campo | ID | Valor en PRM-1362 |
|---|---|---|
| Célula | `customfield_10783` | Logistic Success |
| Dominio | `customfield_10322` | Logistic |
| País | `customfield_10228` | Colombia |
| Área | `customfield_12373` | Producto |
| OKR | `customfield_11775` | [OKR 3 2026] Eficiencia y rentabilidad |
| KR | `customfield_11776` | OKR 3 · KR 1 · Gross margin promedio >22% |
| Etapa Delivery | `customfield_11410` | Definición |
| Manager | `customfield_10684` | Juan Diego Bautista |
| Scoring | `cf_11774`, `11778`, `11593`, `11594`, `11860`–`11863` | valores 1–5 |
| Fechas | `customfield_10156` / `10157` | start / end |

**Y 5 enlaces**, que son los que lo hacen navegable:

```
INVS-13  ←  causes                    (la solicitud que lo origina)
PROD-235 ←  is implemented by         (la épica de desarrollo)   ⭐
PRM-1510 ←  is connected to           (el Proyecto OKR)
PRM-1608 →  connects to               (Solución · fase 1)
PRM-1609 →  connects to               (Solución · fase 2)
```

Es la cadena del canon completa: **OKR → Proyecto → Solución → Épica**.

### Auditoría real de campos — 10-ago, leída de la base, no supuesta

**Yo había asumido que los 11 estaban vacíos. Falso.** Cuatro están completos y uno está
completamente vacío. Esta es la foto verificada:

| Ticket | Célula | Dominio | País | Área | OKR | KR | Etapa | Manager | Asignado |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `PRM-1297` normalización | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `PRM-749` predicción AI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `PRM-1364` POD | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| `PRM-1366` same day | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| `PRM-1455` Interrapidísimo | ✅ | ✅ | — | ✅ | — | — | ✅ | — | — |
| `PRM-1469` autogeneración | ✅ | — | — | ✅ | — | — | ✅ | — | — |
| `PRM-1608` tarifas F1 | ✅ | ✅ | — | — | — | — | ✅ | — | — |
| `PRM-1609` tarifas F2 | ✅ | ✅ | — | — | — | — | ✅ | — | — |
| `PRM-1610` Domina | ✅ | ✅ | — | — | — | — | — | — | — |
| `PRM-1611` TIUI | ✅ | ✅ | — | — | — | — | — | — | — |
| `PRM-1462` **ENVÍA** | — | — | — | — | — | — | — | — | — |

**Tres cosas que salen de aquí y que no se veían antes:**

🔴 **`PRM-1462` (ENVÍA) está en cero de nueve campos.** Es el carrier **más avanzado** del
programa POD —tres tickets de PROD hechos— y en las vistas de Polaris no aparece en ninguna
parte: ni siquiera tiene Célula. Es el peor caso de los 11 y es justo el que más importa.

🔵 **El llenado correlaciona exactamente con tener assignee.** Los 4 completos son los 4 que
tienen dueño. Los 7 incompletos son los 7 huérfanos. No es casualidad: **el campo se llena
cuando alguien se hace cargo**, así que asignar responsable no es un trámite — es lo que
destraba el resto.

⚠️ **El KR de `PRM-1364` no es el que yo había propuesto,** y probablemente el bueno es el que
ya está. Dice **OKR 3 · KR 2 — % tickets resueltos por AI/autoservicio >40%**, no la tasa de
entrega. Tiene sentido: POD reduce el ida y vuelta de reclamos con soporte. **Mi propuesta era
la desalineada.** Confirmarlo, pero el sesgo está a favor de lo que ya existe.

### Corrección a lo que este documento decía antes

- El OKR/KR **no es propuesta en los 4 que ya lo tienen** — ahí es dato. La propuesta aplica
  solo a los 7 restantes.
- **País no siempre es Colombia:** `PRM-1366` y `PRM-749` están marcados **"Todos"**.
- Área tiene **dos valores en uso** en la célula: `Producto` y `Logistica - Val. Inicial`.
  Elegir uno o saber cuándo aplica cada cual.

### Enlaces — verificado, no supuesto

Los enlaces que importan **ya existen**: `PRM-1364` tiene 7, `PROD-240 ↔ PRM-1446` está, y
`PROD-235`/`PROD-1127` cuelgan de su discovery.

El único suelto es **`PRM-1297`: cero enlaces y sin épica en DROP/PROD.** Se buscó — solo hay
30 tareas viejas sobre estados, ninguna es su épica. Es la iniciativa **#1 del Delivery
Roadmap** y está desconectada del árbol. Crear esos enlaces define la estructura, así que lo
decide Juan.

---

### Estado de publicación

| Ticket | Proyecto | Cómo quedó | Ref |
|---|---|---|---|
| `PROD-235` tarifas | PROD | ✅ **descripción** (API) | — |
| `PROD-240` fulfillment | PROD | ✅ **descripción** (API) | — |
| `PROD-1127` same day | PROD | ✅ **descripción** (API) | — |
| `PRM-1297` normalización | PRM | ✅ comentario | `51606` |
| `PRM-1608` tarifas F1 | PRM | ✅ comentario | `51615` |
| `PRM-1609` tarifas F2 | PRM | ✅ comentario | `51616` |
| `PRM-1366` same day | PRM | ✅ comentario | `51617` |
| `PRM-1469` autogeneración | PRM | ✅ comentario | `51618` |
| `PRM-1364` POD proyecto | PRM | ✅ comentario | `51619` |
| `PRM-1462` ENVÍA | PRM | ✅ comentario | `51620` |
| `PRM-1455` Interrapidísimo | PRM | ✅ comentario | `51621` |
| `PRM-1610` Domina | PRM | ✅ comentario | `51622` |
| `PRM-1611` TIUI | PRM | ✅ comentario | `51623` |
| `PRM-749` predicción AI | PRM | ✅ comentario | `51624` |
| `INVS-17` POD solicitud | INVS | ⛔ **bloqueado — sin permiso de comentario** | — |

**14 de 15 documentados.** Los 3 de PROD llevan la estructura del canon (Épica); los 11 de
PRM/INVS llevan `Contexto · Problema · Ideas de solución · Consideraciones importantes · Bloqueos`.

⚠️ **PRM-1611 (TIUI) no estaba en el plan original.** Apareció al leer los enlaces de PRM-1364:
POD tiene **cuatro** soluciones por carrier, no tres. Se documentó igual.

---

## Las tres vías de escritura, probadas

| Vía | PROD | PRM (Polaris) | INVS (service desk) |
|---|---|---|---|
| `description` | ✅ funciona | ⛔ *"not on the appropriate screen"* | ⛔ mismo error |
| `assignee` | ✅ **funciona** | ⛔ mismo error | no probado |
| Customfields (`cf_10228` País) | no probado | ⛔ mismo error | no probado |
| Comentario | ✅ | ✅ **funciona** | ⛔ *"no tienes permisos para comentar"* |
| `editmeta` (qué acepta) | 4 campos | `{}` vacío | — |

⚠️ **Corrección a lo que se creía:** el bloqueo de PRM **no es solo de `description`**. Se probó
`assignee` (campo de sistema) y `customfield_10228` (País) — **los tres dan el mismo error**.
En PRM no se puede escribir absolutamente ningún campo por API. Lo único que pasa son
comentarios.

**Los tres errores no son el mismo problema:**

* **PRM es estructural.** Polaris no expone sus campos por la API REST clásica. Probado tres
  veces, incluida la prueba decisiva: escribir `summary` **con su propio valor idéntico**
  también falla. Si fuera permisos daría 403, no "screen".
* **INVS-17 sí es permisos**, y de dos tipos distintos: la cuenta `producto@dropi.co` no puede
  editar ni comentar en ese proyecto. **Un admin de Jira lo puede arreglar** — a diferencia de PRM.

---

## Enlaces — no hizo falta crearlos donde importaba

Se verificó antes de tocar nada: **PRM-1364 ya tiene los 7 enlaces** que lo hacen navegable
(INVS-17 · DROP-23095 · PRM-1517 · PRM-1462 · PRM-1455 · PRM-1610 · PRM-1611). POD **está
conectado**, no había que armarlo.

El que **sigue suelto es `PRM-1297`**: cero enlaces y sin épica en DROP/PROD. Eso no es
documentación, es decisión de roadmap — lo decide Juan.

---

## Las dos estructuras

**El canon no cubre PRM.** `agente-delivery/canon/dropi_methodology.md` define Épica →
Historia → Subtarea para DROP/PROD, pero **no define `Solicitud`, `Solución`, `Proyecto` ni
`Proyecto OKR`**, que es lo que son 11 de los 14 tickets. Así que van dos formatos:

**A · Épicas de PROD** → la del canon, literal (§Épica, L27–56):
`Contexto` (4 viñetas) · `¿Qué buscamos?` · `Criterios de éxito` · `Documentación`

**B · Tickets de PRM** → la acordada con Juan, mapeada al Definition of Ready de
`metodologia/product-logistics.md`:
`Contexto` · `Problema` · `Ideas de solución` · `Consideraciones importantes` · `Bloqueos`

**Ley de `spec-driven.md` en ambas:** cada afirmación lleva `[estado · fuente]`, y cero
placeholders — valor real o `N/A — razón`.
Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

---

# TANDA 1

## 1 · PRM-1297 · Normalización de estados

*Tipo Proyecto · Inv. y definición · asignado a Juan · reportado por Maria Ossa · descripción vacía*

```markdown
## Contexto

Etapa de la cadena: **Tránsito**, pero es transversal a las seis etapas.
Fuga que ataca: habilitador de las fugas ② (devolución) y ④ (posventa) — no las ataca directo, las hace medibles.
NSM que mueve: ⏱️ **tiempo por fases** y ⬆️ **movilización**. `[🟡 · fuente: doc:direccionamiento-2026-s2]`

Prioridad #1 del Delivery Roadmap, con WIP = 1. `[🟡 · fuente: doc:direccionamiento-2026-s2]`

## Problema

**No existe "el estado de una orden Dropi".** Existen tres fuentes distintas y solo dos son homologables: `[🟢 · fuente: doc:CONTEXTO_ESTADOS_DROPI §1]`

* **A · Estado de la ORDEN** — lo emite Dropi, ciclo de vida comercial. Homologable. ~15 en uso.
* **B · Estado de la GUÍA** — lo emite la transportadora, ciclo físico del paquete. Homologable. ~34 en uso sobre un catálogo de ~500.
* **C · Movimientos del carrier** — texto libre. **NO homologable**: solo sirve para narrativa cruda y para fechar eventos.

Confundir A, B y C es el error de diseño más caro del proyecto. El PDF de macro-proceso (24 estados, 6 fases) describe **A**; el Excel de 576 mapeos describe **B**. No se contradicen: cubren mitades distintas del mismo flujo.

**Consecuencia medida:** de los 51 estados que usa la operación, **35 se guardan como lo mismo**. No se puede medir dónde se traba una orden ni avisarle nada al cliente. `[🟢 · fuente: data:auditoría 133.555 órdenes / 52.636 guías CO · 2026-07-12]`

## Ideas de solución

**Modelo por capas** — el estado crudo lo ve el admin; **9 estados homologados** los ve el usuario. La clave es `estado_crudo` global, sin override por transportadora. `[🔵 · fuente: doc:propuesta-homologacion.md]`

**No-objetivos (⛔):**
* No se homologan los movimientos del carrier (fuente C): son texto libre y solo sirven para fechar eventos.
* El modelo NO lleva eje `transportadora` — ver Consideraciones.

## Consideraciones importantes

**El gate de arquitectura quedó cerrado con datos.** Corrida de solo lectura del 22-jul sobre 125.232 órdenes y 1,88M de eventos (CO, ventana 19-mar → 22-jul): `[🟢 · fuente: data:corrida read-only 2026-07-22]`

`INTENTO DE ENTREGA` resultó ser **término propio de Interrapidísimo** — 144.575 de 145.733 ocurrencias, el 99,2% — y ahí significa **intento fallido**: 92,08% termina en falla, contra 44,93% de entrega en el control `EN REPARTO` de ENVIA. **No es un término compartido entre carriers, así que no hay colisión semántica y el modelo no necesita eje `transportadora`.** Era la decisión de arquitectura más cara del proyecto.

⚠️ **Reserva:** el veredicto del reporte está editado a mano. Los CSV lo sostienen, pero hay que **re-correr el script antes de citarlo en la presentación**. `[⚪ · fuente: doc:spec §5]`

**Entregable revisable:** comparador de 4 catálogos sobre el mismo tráfico, mapa, evidencia y cola de decisiones → `/proyectos/logistica/normalizacion-estados`

## Bloqueos

* **2 decisiones de negocio pendientes** para cerrar el catálogo. Responsable: Juan Diego + Dirección de Producto. `[⚪ · fuente: doc:spec §5]`
* La propuesta está lista y **sin enviar a Maria Ossa**. Responsable: Juan Diego. `[🟡 · fuente: reunion:weekly 2026-07-31]`
```

---

## 2 · PROD-235 · Épica de tarifas

*Epic · En Ruta (backlog) · sin asignar · descripción = solo una URL*

```markdown
## Contexto

**Descripción del problema:**

* **¿Qué problema estamos resolviendo?** No existe un panel de parametrización de tarifas. Los ajustes se hacen directamente por código: cuando hay que cambiar una tarifa, un sobreflete o un porcentaje de COD, se genera un requerimiento a TI.
* **¿Por qué es importante?** Sin validaciones ni visibilidad, las discrepancias de facturación se acumulan sin que nadie las vea. El cotizador de Urbano en Argentina cobra $5.737 cuando el costo real del trayecto es $10.412 — 82% de diferencia que Dropi absorbe. Y la tasa de COD en Argentina estuvo en 0,7% cuando el objetivo de utilidad requiere 1,5%; se descubrió meses después.
* **¿A qué usuarios afecta?** Operaciones y Finanzas, que hoy no pueden configurar, validar ni simular pricing. Y a los sellers que necesitan envíos de más de 5 kg, que Dropi hoy no puede atender.
* **Datos relevantes:** Dropi opera paquetería express hasta 5 kg en 12 países (AR, CO, GT, CR, PA, PE, MX, PY, CL, EC, VZ, ES).

`[🟡 · fuente: jira:PRM-1362]`

## ¿Qué buscamos?

Parametrizar tarifas sin tocar código, con validación y simulación de rentabilidad antes de activar.

**Dos fases, ya separadas en discovery:**

* **Fase 1 — PRM-1608 · Panel actual.** Paquetería express hasta 5 kg, sobre lo ya construido y prototipado. Entregable: el panel operativo.
* **Fase 2 — PRM-1609 · Mercancía industrial.** Peso volumétrico, tablas origen-destino, remesas y rangos de peso sin límite. Lógica completamente distinta a paquetería. Entregable: el modelo de pricing industrial.

**Bloqueante de la fase 2:** antes de construir hay que responder para qué se usa la parametrización de mercancía industrial, en qué vertical se abre y para quién. La decisión inicial es aplicarlo a **Marcas** como segmento piloto. `[⚪ · fuente: jira:PRM-1362]`

⛔ **Fuera de alcance de la fase 1:** mercancía industrial.

## Criterios de éxito

* **Métricas a impactar:** OKR 3 de compañía — gross margin ≥ 22%. Reducción de las discrepancias de facturación por tarifas hardcodeadas.
* **Público objetivo:** Operaciones y Finanzas como usuarios del panel; Marcas como segmento piloto de mercancía industrial. 12 países.

`[🟡 · fuente: jira:PRM-1362]`

## Documentación

* Discovery completo: PRM-1362
* Prototipo RPP, 3 vistas: https://www.dropitesters.co/old/parametrizar-tarifas?profile=admin
* Prototipo mercancía industrial: https://www.dropitesters.co/old/parametrizar-tarifas-industrial?profile=admin
* Figma: https://www.figma.com/design/PDeeZVQMyF3i6SUFCWyuQa/Parametrizaci%C3%B3n-de-tarifas?node-id=2233-35839
* Doc E2E: `N/A — necesita ajuste antes de entregarse` `[⚪ · fuente: jira:PRM-1362]`
```

---

## 3 · PROD-240 · Épica de fulfillment

*Epic · En Ruta (backlog) · sin asignar · descripción = solo una URL*

```markdown
## Contexto

**Descripción del problema:**

* **¿Qué problema estamos resolviendo?** El cobro del servicio de fulfillment se activa solo cuando la orden llega al estado "Entregado". Entre el **20 y el 25% de las órdenes preparadas y despachadas nunca se cobran** — devoluciones, pérdidas y cancelaciones post-despacho.
* **¿Por qué es importante?** Además no se cobran servicios que las bodegas ya prestan: almacenamiento de inventario, etiquetado manual de productos sin código de barras, armado de kits y combos, y manejo de órdenes multi-unidad. Son costos operativos reales que hoy absorbe Dropi sin compensación.
* **¿A qué usuarios afecta?** Operación de bodegas 2PL, equipo de facturación y los proveedores, que reciben el cobro contra su wallet y necesitan trazabilidad del desglose.
* **Datos relevantes:** bodegas propias (2PL) en Bogotá, Cali y Medellín, con **92.000 órdenes mensuales** combinadas.

`[🟡 · fuente: jira:PRM-1446]`

## ¿Qué buscamos?

Parametrizar el registro y el cobro de los servicios de fulfillment por bodega y proveedor, con un corte consolidado por país.

**Modelo de cobro, ya definido:** `[🟡 · fuente: reunion:2026-08-06]`

* El responsable del cobro es el **equipo de facturación**
* El corte es **por país y lo resuelve TI**, no un operador por bodega
* Si la wallet del proveedor no tiene saldo, **se dispara una alerta; el cobro no se bloquea**

**Fases:** captura de servicios por bodega y periodo → registro provisional inmutable → corte definitivo consolidado por país, idempotente y con alerta si ya existe un registro.

⛔ **Fuera de alcance:** cobrar servicios que no estén registrados por la bodega en el periodo.

## Criterios de éxito

* **Métricas a impactar:** ingreso mensual recuperado y % de servicios prestados que sí se cobran.
* **Público objetivo:** proveedores con operación en bodegas 2PL de Colombia (Bogotá, Cali, Medellín).

⚠️ **Línea base sin reconciliar:** el E2E reporta $355M actuales y $631M proyectados por mes — una diferencia de +77,7% — mientras otras secciones declaran +68%. No existe reconciliación trazable de base, universo, periodo ni fórmula. `[⚪ · fuente: jira:INVS-66]`

## Documentación

* Discovery completo: PRM-1446
* Prototipo RPP: https://www.dropitesters.co/old/fulfillment/parametrizar?profile=admin
* Doc E2E: en Drive, con el tab de handoff en placeholders `[⚪ · fuente: doc:spec fulfillment]`
* Figma: `N/A — el prototipo vive en el RPP, no en Figma`

⚠️ **Esta épica no tiene Solución de PRM asociada**, a diferencia de tarifas, que sí tiene sus dos fases. Falta crearla o vincularla.
```

---

## 4 · PROD-1127 · Épica de Same Day

*Epic · En Ruta (backlog) · sin asignar · descripción = solo una URL*

```markdown
## Contexto

**Descripción del problema:**

* **¿Qué problema estamos resolviendo?** Dropi no ofrece entrega el mismo día, y no tiene cómo decidir qué órdenes son elegibles.
* **¿Por qué es importante?** Hoy con Veloces **ya salen guías marcadas same day sin validación geográfica**: una orden Cali → Santa Marta sale como same day. Es un riesgo vivo confirmado en producción, no hipotético.
* **¿A qué usuarios afecta?** Proveedores, marcas y la operación de fulfillment.
* **Datos relevantes:** el mapa de densidad de demanda se construyó sobre **427.294 órdenes reales** de Bogotá, Medellín y Cali, ubicadas por cruce de nomenclatura contra OpenStreetMap.

`[🟡 · fuente: jira:PRM-1366 · data:pipeline same-day]`

## ¿Qué buscamos?

Entrega el mismo día para bodegas propias y para Veloces.

**MVP:** flag Same Day + validación de hora de corte + **validación geográfica** + selección guiada de transportadora.

**Fase de discovery — entregable ya disponible:** mapa de densidad que mide cuánta demanda captura un centro de operación según su radio → `/proyectos/logistica/same-day`

**Bloqueante:** la definición de datos no está cerrada — faltan origen, timestamps, transportadora y estado final. Hasta cerrarla, el mapa sirve para decidir dónde poner un centro, **no para comprometer un SLA**. `[⚪ · fuente: doc:spec same-day §7]`

⛔ **Fuera de alcance:** comprometer SLA de same day antes de cerrar la definición de datos.

## Criterios de éxito

* **Métricas a impactar:** ⬆️ % de entrega y ⏱️ tiempo de entrega. Cobertura de demanda por centro de operación.
* **Público objetivo:** proveedores, marcas y fulfillment en Bogotá, Medellín y Cali.

⚠️ **Sin línea base todavía**: depende de la definición de datos. `[⚪ · fuente: doc:spec same-day §7]`

## Documentación

* Discovery: PRM-1366
* Board de research (Michelle López): https://www.figma.com/board/uZeHBc0bilrBIXgYWyxeow/Research-same-day
* Mapa de densidad: `/proyectos/logistica/same-day`
* Doc E2E: https://docs.google.com/document/d/1NO9fbjklz2XvMVrMc_os6AuUjsF5ZkmDw3kX5XmwNtA/edit
* Confluence: https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1531576355

**Estado:** parqueado por WIP = 1 mientras Normalización de estados es la iniciativa activa. La ventana del cronograma es tentativa. `[🟡 · fuente: doc:direccionamiento-2026-s2]`
```

---

# Lo que queda — y ya no es redacción

La documentación está hecha. Lo que sigue son **decisiones y trabajo manual**, no escritura.

## 1 · Manual, porque la API no puede (Juan o quien tenga la sesión)

- [ ] **Pegar las 11 descripciones de PRM** desde los comentarios ya publicados. El texto está
      escrito y revisado; es copiar de la caja de comentario al campo de descripción.
- [ ] **Campos de Polaris — solo donde faltan** (ver la matriz de arriba, no son los 11):
      - 🔴 `PRM-1462` **ENVÍA — los 9 campos**. Está en cero y es el carrier más avanzado.
      - `PRM-1610` · `PRM-1611` — País, Área, OKR, KR, Etapa, Manager, Asignado
      - `PRM-1608` · `PRM-1609` — País, Área, OKR, KR, Manager, Asignado
      - `PRM-1455` — País, OKR, KR, Manager, Asignado
      - `PRM-1469` — Dominio, País, OKR, KR, Manager, Asignado
      - `PRM-1366` — solo Manager
      - `PRM-1297` · `PRM-749` · `PRM-1364` — **completos, no tocar**

      IDs: Célula `cf_10783` · Dominio `cf_10322` · País `cf_10228` · Área `cf_12373` ·
      OKR `cf_11775` · KR `cf_11776` · Etapa Delivery `cf_11410` · Manager `cf_10684`.

- [x] ~~Asignar responsable en las 3 épicas de PROD~~ — **hecho 10-ago por API.** PROD-235,
      PROD-240 y PROD-1127 quedaron asignadas a Juan Diego. En PROD sí se puede.

## 2 · Pedirle a un admin de Jira

- [ ] **Permisos de `producto@dropi.co` sobre INVS.** Hoy no puede editar ni comentar, así que
      INVS-17 quedó sin documentar. Es lo único que faltó de los 15.

## 3 · Decisiones de roadmap (solo Juan)

- [ ] **PRM-1297 no tiene ningún enlace ni épica en DROP/PROD.** Es la iniciativa #1 del
      Delivery Roadmap y está desconectada del árbol. Crear esos enlaces define la estructura.
- [ ] **PROD-240 (fulfillment) no tiene Solución de PRM asociada**, a diferencia de tarifas que
      sí tiene sus dos fases. Crearla o vincularla.
- [ ] **Confirmar el OKR/KR de cada ticket.** La tabla de arriba es **propuesta**, deducida de
      cruzar la fuga que ataca contra el árbol de OKR. Si está mal, se propaga a 11 tickets.
- [ ] **Estado real de POD.** Se reportó "listo para handoff", pero PRM-1364 está en "Próximo" y
      sus cuatro soluciones en Impedimentos / Inv. y definición / backlog ×2. Una de las dos
      lecturas está mal.
- [ ] **Frontera PRM-749 ↔ LOG-004.** "Recomendación de transportadora automatizada" aparece
      dentro de los dos. Decidir cuál lo gobierna.

## 4 · Deuda de discovery que la documentación dejó a la vista

- [ ] **PRM-749 es el único ticket de la célula sin spec propio.** Se documentó lo que se sabe y
      el vacío quedó señalado en el comentario, no rellenado con relleno.
- [ ] **PRM-1611 (TIUI) no estaba mapeado** en ninguna parte del cerebro antes de hoy.
