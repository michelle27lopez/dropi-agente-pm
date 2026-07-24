# 🗂️ Backlogs y priorización única — Logistic Success

> **Vista única y de fácil acceso** de lo que la célula **investiga** (Product Backlog) y lo
> que **ejecuta** (Delivery Backlog), con **una sola priorización**. Maria pidió **énfasis en el
> Product Backlog** (lo que estamos investigando) → va primero y con más detalle.
> **Fuente de verdad de los tableros:** Jira PRM/Polaris (links abajo). Este doc es la **síntesis
> viva** del cerebro; ante duda gana el tablero. Última actualización: 2026-07-10.

**Cómo se lee (mismo orden que los updates de célula):**
**① Indicador principal** (¿se movió?) → **② Product Backlog** (lo que investigamos) → **③ Delivery Backlog** (lo que ejecutamos).

**Tableros Jira (Polaris):**
[Product Backlog](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11525502) ·
[Repositorio de ideas](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11525526) ·
[Delivery Backlog](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11505515).

---

## ① Indicador principal — ¿se movió?
**NSM de la célula:** ⬆️ Movilización + ⬆️ % de entrega (s/ órdenes **creadas**). **KPI Q3/Q4:** tiempo de la orden hasta la transportadora (< 24h), por fases.
- **Baseline (abril, mes cerrado):** entrega **~59% consolidado · CO 62,5%** = ~7,5–8 pts debajo de la meta ≥70%. Movilización = fuga #1 (no-mov ~21%); devolución ~26%.
- ⚠️ **La medición fina está pendiente del export de Data** (ver §Validación). Detalle: [`primera-medicion-kpis-y-meta.md`](primera-medicion-kpis-y-meta.md).

---

## ② PRODUCT BACKLOG — lo que investigamos (discovery) ⭐
> Oportunidades en discovery. Avanzan **Wander → Explore → Make → Impact**. Antes de explorar, revisar el
> [Repositorio de ideas](https://dropi-it.atlassian.net/jira/polaris/projects/PRM/ideas/view/11525526).
> Gradúan a Delivery al pasar **Gate 2 (Dropi Score)**. Cap **2–3 oportunidades activas**.

### 2.a Los 3 ítems que pide el direccionamiento de la CPO
| # | Ítem | Etapa | Estado hoy | Qué falta |
|---|------|-------|-----------|-----------|
| 1 | **Primera medición de KPIs + meta** | Wander | En curso · **bloqueado por datos** | Export de Data completo → correr baseline creación→handoff (<24h) y proponer meta a Maria |
| 2 | **Cronograma de ejecución Q3 (Jul–Sep)** | Arranque | 🔴 En construcción, ~1 sem. corrido | Cerrar fases→fechas→dueños y citar a Maria; extender a Q4 |
| 3 | **Visión de producto logístico** | Represado · validar | v1 ensamblada | Validar Lente 2 (madurez×logística) + definir deliverable/fecha con Maria |

Detalle: [`primera-medicion-kpis-y-meta.md`](primera-medicion-kpis-y-meta.md) · [`roadmap-q3-logistica.md`](roadmap-q3-logistica.md) · [`vision-producto-logistico.md`](vision-producto-logistico.md).

### 2.b Oportunidades / experimentos en discovery (las 4 fugas + habilitador)
> 🆕 **16-jul · reclasificación de Juan** → [`planning/cronograma-pruebas-poc.md`](../planning/cronograma-pruebas-poc.md).
> Autoconfirmación y Autogeneración dejan de ser *"experimentos a la espera de personas"* y pasan a
> **prueba con usuarios** y **proyecto de discovery**. Selección de transportadoras entra aquí como
> **discovery/pruebas de usuarios**. Objetivo de todas: **entender la funcionalidad**, no medir impacto aún.

> 🔴 **16-jul · WIP = 1 en Product — falta decidir CUÁL es la una.** Juan pidió *"de a una"* pero el mismo
> día entraron **4 ítems** a este roadmap → **3 están en cola, no en curso.**
>
> **Recomendación: la una = Autoconfirmación.** Por qué:
> 1. **Es la fuga #1** (movilización, ~840K órd/mes) y la palanca más barata del árbol.
> 2. **Está más avanzada** (prototipo funcional) → el ciclo de aprendizaje es el más corto.
> 3. **Tiene una pregunta que puede matarla** (¿el flujo de ChateaPro tolera esperar el gate?). Lo que
>    puede morir barato se prueba **primero**, no último.
> 4. **Selección de transportadoras NO debería gastar el único slot: no es proyecto de Juan** (PM = Kate
>    Pencue; Juan = Carrier Ops). Su aporte ahí (**catálogo con Paula**) es **una dependencia que debe**,
>    no su foco de discovery. Se paga la dependencia y se sigue — no ocupa el WIP.
>
> → **Decisión pendiente de Juan.** Mientras no se decida, este roadmap tiene 4 cosas y un WIP declarado de 1.

| Oportunidad | Fuga | Estado | Experimento / validación que falta | Ticket · spec |
|-------------|------|--------|-------------------------------------|---------------|
| **Autoconfirmación por madurez** ⭐ | ① movilización | 🆕 **Prueba con usuarios** (16-jul) · prototipo funcional (localhost) | **Sesión con ChateaPro** (su flujo se dispara al entrar la orden → ¿tolera esperar la decisión de autoconfirmar?) + **entrevistas a dropshippers** (¿qué variables usan?) + segmentar por volumen/categoría | PRM-1497 · [spec](../proyectos/movilizacion-confirmacion/spec.md) |
| **Autogeneración de guías** | ① movilización | 🆕 **Proyecto de discovery** (16-jul) | **Levantar el discovery** — no tiene spec ni DoR (problema raíz, hipótesis, métrica, datos) | — · _spec por crear_ |
| **Selección de transportadoras** 🆕 | ② devolución | 🆕 **Discovery · pruebas de usuarios ≥20** (16-jul) | Catálogo caracterizado (Juan + Paula) + protocolo con Kate. Titular = preguntas Kickoff §10, **no** la distribución | PRM-1513 · [protocolo](../proyectos/sistema-inteligente-transportadoras/prueba-fase0-20-usuarios.md) |
| **Notificación de optimización** 🆕 | _por definir_ | 🆕 **Iniciativa de producto nuestra** (16-jul) · ⚠️ **sin definir qué es** | Que Juan aclare el alcance — no está en ningún doc | — |
| **Dirección confiable + geo** | ①+② | Discovery (flujo E2E) | Reconciliar tensión: árbol v2 bajó dirección a ~1% → ángulo vivo = validación→movilización en SHOP | PRM-91/1497/1512/1523 · [spec](../proyectos/direccion-confiable-geo/spec.md) |
| **Reducir devoluciones (COD)** | ② devolución | Discovery (rama E2E) | Export **"motivo de cierre"** confirma causa (carrier vs peor segmento) | PRM-1523 · [spec](../proyectos/reduccion-devoluciones-cod/spec.md) |
| **Dueño y triaje de la novedad (+posventa)** | ④ novedad | Discovery | Homologar sub-estados (VELOCES); coordinar Backoffice PRM-1294 | PRM-1512 · [spec](../proyectos/novedad-dueno-triaje/spec.md) |
| **Torre de control / tiempo por fases** 🟣 | Transversal (habilitador) | Discovery (borrador) | Baseline F1–F5 (pendiente del export de Data) | _por crear_ · [spec](../proyectos/torre-control-tiempo-fases/spec.md) |

### 2.c Ideas nuevas (repositorio, aún sin priorizar)
- **Recolección proactiva** — que Dropi programe recolecciones a las transportadoras (qué está listo / quién recoge / agrupar rutas por cercanía). Conecta con la fase "Recogido por Dropi". *(Juan, 10-jul)*
- **Dropi Academy** — cursos de buena gestión de órdenes + explicar los estados a los usuarios. Conecta con Normalización. *(Juan, 10-jul)*

---

## ③ DELIVERY BACKLOG — lo que ejecutamos (aprobado)
> Proyectos aprobados, en ejecución. Etiqueta de tipo (heredado · junta OKR · represado) dentro del backlog.
> 🆕 **16-jul · WIP = 1.** El foco es **Normalización de estados** *(decisión de Juan)*. El resto **queda en cola**.

### 🎯 EL UNO — Normalización de estados
| Proyecto | Tipo | Estado | Semáforo | Ticket · spec |
|----------|------|--------|----------|---------------|
| **Normalización de estados** ⭐ | Represado | 🆕 **EL FOCO** (16-jul) · terminar la propuesta · **traslapar con diseño** | 🟡 esperando cuentas MX/AR | [PRM-1297](https://dropi-it.atlassian.net/browse/PRM-1297) · [spec](../proyectos/normalizacion-estados/spec.md) · [propuesta](../proyectos/normalizacion-estados/propuesta-homologacion.md) |

**Traslape con diseño — cómo hacerlo sin recoger vidrios después:**
El precedente es Selección de transportadoras (§8.1 de su spec): *"Producto avanza diseño en paralelo sin
esperar resultados"* — y ahí funcionó **porque la viabilidad ya estaba aprobada**. Aquí **el catálogo mismo
sigue abierto**: `INTENTO DE ENTREGA` (colisión posible real), `Proceso finalizado` (no terminal en crudo)
y los flags contables **son decisiones de negocio sin cerrar**. Si el diseño arranca sobre esas, es retrabajo.
> **Regla:** traslapar diseño **sobre lo cerrado** — la **vista cliente (8 estados)** y los avisos
> ("va en camino" / "va llegando" / "disponible para retiro"), que ya están definidos y son lo que ve el
> usuario. **NO** sobre el mapeo crudo→homologado ni sobre los 3 puntos en disputa. Diseño avanza en la capa
> de arriba mientras la de abajo se cierra.

### ⏸️ EN COLA (no en curso — nombrarlo así en los updates)
| Proyecto | Tipo | Estado | Semáforo | Ticket · spec |
|----------|------|--------|----------|---------------|
| **Selección de transportadoras** | Junta (OKR) | ⏸️ en cola · dev 72% (**no es de Juan** — PM Kate) | 🟡 blocker permisos Cronos | [PRM-1513](https://dropi-it.atlassian.net/browse/PRM-1513) · [spec](../proyectos/sistema-inteligente-transportadoras/spec.md) |
| **Same Day** (proveedores/marcas/fulfillment) | Junta (OKR) | ⏸️ en cola | 🔴 **riesgo vivo: falsos SD en prod** — ver aviso ⬇️ | [PRM-1366](https://dropi-it.atlassian.net/browse/PRM-1366) · [spec](../proyectos/same-day/spec.md) |
| **Notif. Prevención de Devoluciones** (predicción IA) | Junta (OKR) | ⏸️ en cola · **FINALIZAR** | 🟡 alinear con Seller Success | [PRM-1512](https://dropi-it.atlassian.net/browse/PRM-1512) |
| **Validación de direcciones (países)** | Represado | ⏸️ en cola | 🟡 coordinar con Supplier (PRM-91) | [PRM-91](https://dropi-it.atlassian.net/browse/PRM-91) · [spec](../proyectos/validacion-normalizacion-direcciones/spec.md) |
| **Fulfillment** | — | ✅ **TERMINADO** listo hand-off TI | 🟢 +$380M COP/mes si sale en CO | — |

> 🔴 **Un riesgo NO se pone en cola — se acepta o se mitiga.** Same Day tiene **falsos SD circulando en
> producción hoy** (Cali→Santa Marta sale same-day sin validación geo) = promesas incumplidas a clientes
> reales. Con WIP=1 no se trabaja, pero **eso no lo apaga**. → **Escalarlo explícitamente a Maria/Carlos
> como riesgo aceptado**, con dueño (Veloces/Carlos Peralta), no dejarlo en silencio en una fila. Es la
> diferencia entre "priorizamos" y "se nos olvidó".

**Fuera del Delivery Backlog de la célula pero activos de Juan:** Tarifas (OKR3 compañía, doc E2E hecho, no tocar más) · Guías reemplazatorias (Ecom, dev beta) · Combos (Supplier Success, apoyo).

---

## Priorización única — cómo se decide
Un flujo, un criterio. **No hay dos colas**: Product y Delivery son **dos estados** del mismo pipeline.

```
Ideas → Gate 1 (preselección, Producto) → PRODUCT BACKLOG (discovery)
      → Gate 2 (Dropi Score) → DELIVERY BACKLOG (ejecución)
```

- **Dropi Score = (Impacto OKR × Confianza) / Complejidad × 20.** Override legal ≥4 → 999.
- **Impacto** se lee contra el árbol de fugas: mueve la aguja de KR2.1 (entrega ≥70%) o del KPI de tiempo.
- 🆕 **WIP = 1 + 1** *(Juan, 16-jul — reemplaza el cap de 2–3)*: **una** cosa activa en Product y **una** en
  Delivery. De a una. Todo lo demás **está en cola, no en curso** — y hay que nombrarlo así en los updates.
  Lo que no cuelga de un OKR/KR no entra al roadmap.
  > **Mentor:** esto es más estricto que la propia metodología (que decía WIP 2–3) y va en la dirección
  > correcta — pero **solo sirve si se sostiene el costo**: con WIP=1, lo que queda en cola **se frena de
  > verdad**. Un WIP=1 declarado con 5 cosas avanzando en paralelo es peor que un WIP=3 honesto, porque
  > además miente en el update.
- Mapa de impacto proyecto→KR→aporte: [`roadmap-okr-impacto.md`](roadmap-okr-impacto.md). Árbol de fugas: [`arbol-okr-objetivo.md`](arbol-okr-objetivo.md).

## Qué falta para avanzar (validación de experimentos y datos)
> El cuello transversal para priorizar y validar. Se le pide a Data / stakeholders.
- 🔴 **Export de Data completo** (CSV sin cap, estados vivos + timestamps de recogida/bodega/handoff/entrega). Hoy el archivo está capado (1.048.575 filas) y sesgado a órdenes muertas pre-guía → **no publicable a Maria**. Bloquea baseline de KPIs **y** tiempo por fases.
- 🔴 **Personas para correr el experimento de autoconfirmación** (movilización) y **con quién correr** la autogeneración de guías.
- 🟡 **Export "motivo de cierre"** (`Estados_cierre_Transportadora` × dpto × carrier × mes) → confirma la causa de la devolución.
- 🟡 **Export `seller × zona × carrier`** → separa efecto-seller de efecto-zona.
- 🟡 **Cuentas en otros países (MX/AR…)** → revisar casos reales de guías para la normalización de estados multi-país.

> La **carta a Maria** con esto por proyecto (frenado · pendiente · lanzado-pero-falla · prometido-no-salió · qué necesito · qué validación) vive en `reportes/para-maria-carta-al-nino-dios.md` *(bóveda: ../reportes/para-maria-carta-al-nino-dios.md)*.
