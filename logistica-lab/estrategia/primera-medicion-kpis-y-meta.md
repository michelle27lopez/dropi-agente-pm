# 📏 Primera medición de KPIs + meta propuesta — Logistic Success

> **Qué es:** cierra el ítem #1 del Product Backlog de la CPO (*"Primera medición de KPIs y definición de meta"*, etapa *wonder*) → [direccionamiento §4](direccionamiento-logistic-success-2026-s2.md).
> Toma los **2 KPIs de la célula**, los mide con la data que ya tenemos, y **propone la meta** para cerrarla con Dirección de Producto.
>
> **Disciplina (ley spec-driven):** **[DATO]** = medido/reconciliado con fuente · **[SÍNTESIS]** = lectura propia sobre datos · **[PROPUESTA·validar]** = meta/decisión que **falta validar con Maria/Dir. Producto**.
> **Base:** abril = mes cerrado (reconciliado, tema 18); movilización/entrega por país = **captura "última data" 01-jul**; tiempos = **Q8 medianas (mayo)**. Mayo es incompleto en desenlace → no se lee su %entrega/%dev (§5). Fuentes: [tema 18](../conocimiento/temas/18-metricas-operacion-2026-04-05.md) · `Data/` *(bóveda: ../conocimiento/Data/)* · Q8 Funnel_Tiempos · dossier. **Actualización CPO (29-jul):** Se incorporaron los datos oficiales de órdenes movilizadas del 1 al 29 de julio de 2026 (ver [DASHBOARD.md](../../dropshipper-lab/DASHBOARD.md#3-volumen-de-órdenes-movilizadas-1-al-29-de-julio-2026---datos-oficiales-cpo) para el desglose por país).

---

## Los 2 KPIs de la célula (según el direccionamiento §5)
| # | KPI | Definición | Meta de compañía |
|---|-----|-----------|-------------------|
| **1** | **Tasa de entrega exitosa** | **Entregadas / CREADAS** ✅ (confirmado Juan) | **≥ 70%** · OKR2 · **KR2.1** ✅ — dueños directos |
| **2** | **% de órdenes que llegan a la transportadora en < 24h** | **Tasa** de cumplimiento (% bajo el umbral), NO promedio ni mediana | **< 24h** ✅ (menos de 24h) |

---

## 1 · KPI 1 — Tasa de entrega · BASELINE

### 1.1 El número que importa: entrega sobre CREADAS
> ⚠️ **Corrección clave (Juan, 01-jul): el ≥70% del KR se mide sobre órdenes CREADAS, no sobre movilizadas.** Son dos cortes distintos — no confundirlos:

| Corte | Valor | ¿Es el KR? |
|---|---|---|
| Entrega **s/movilizadas** | ~72–75% | ❌ no — esconde la fuga de no-movilización |
| **Entrega s/CREADAS** | **~59% consolidado · CO ~62%** | ✅ **este es el ≥70%** |

> **[SÍNTESIS] Esto invierte el mensaje.** Medido bien (s/creadas), **NO estás sobre la meta — estás ~8–11 pts DEBAJO** (59–62% vs 70%). El "72%" que se venía citando es s/movilizadas, otro corte. **Cerrar esa brecha ES el mandato de la célula**, y las dos fugas (no-movilización + devolución) son exactamente lo que la explica. Esto además es coherente con que haya trabajo real y difícil por delante.

### 1.2 Por país — entrega s/creadas vs meta 70% `[DATO: captura movilización 01-jul]`
*(s/creadas = movilización × entrega s/movilizadas)*

| País | Mov | Ent s/mov | **Ent s/creadas** | Gap a 70% | Volumen |
|---|---|---|---|---|---|
| **Colombia** | 83,3% | 75,0% | **62,5%** | **−7,5** | grande (71% part.) |
| Guatemala | 86,6% | 72,4% | 62,7% | −7,3 | chico |
| Ecuador | 80,0% | 72,3% | 57,8% | −12 | medio |
| Panamá | 80,6% | 68,2% | 55,0% | −15 | chico |
| Chile | 77,2% | 69,6% | 53,7% | −16 | medio |
| Paraguay | 75,2% | 70,7% | 53,2% | −17 | chico |
| **México** | 79,0% | 54,9% | **43,4%** | −27 | medio |
| Perú | 64,8% | 64,9% | 42,1% | −28 | marginal |
| Argentina | 87,9% | 45,9% | 40,3% | −30 | marginal |

> **[SÍNTESIS]** Nadie llega al 70% s/creadas. **Colombia es el más cerca (62,5%, −7,5 pts)** y es el grueso del volumen → **es donde la meta se pelea y se gana.** Para CO, cerrar 7,5 pts se ataca por las dos vías: subir movilización (hoy pierde 16,7%) **y** bajar devolución. MX/AR arrastran fuerte pero pesan poco + MX "mide mal" (homologación rota) → medir bien antes de prometer (PRM-1297).

### 1.3 De qué se compone la brecha — las 2 fugas `[DATO: tema 18 + mapa de fugas]`
Sobre **órdenes creadas** (misma base que el KR):
| Desenlace | % de creadas | Órdenes/mes aprox. |
|---|---|---|
| **No moviliza (fuga ①)** | **~17–18%** | ~700K |
| **Moviliza y se devuelve (fuga ②)** | **~21%** | ~823K |
| **Entrega neta = EL KR** | **~59%** | ~2,3M |

> **[SÍNTESIS]** El 59% neto **es** el KR. Para llegar a 70% hay que recuperar ~11 pts, y sólo hay dos sitios de dónde sacarlos: **no-movilización (~18%)** y **devolución (~21%)** — en base pareja pesan casi igual (esto corrige el viejo "movilización = fuga #1", que era sesgo de comparar mayo con abril).

---

## 2 · KPI 2 — Tiempo de la orden hasta la transportadora · BASELINE

### 2.1 Se mide como TASA de cumplimiento, no como mediana `[DATO: Monitor Operativo, JUNIO · base 3.332.018 órdenes]`
> ⚠️ **Método (Juan):** "< 24h" es umbral → **% de órdenes por debajo** (tasa). La mediana no dice *cuántas* cumplen; el "cuánto" son los **críticos > 24h** del Monitor. Distribución sesgada a la derecha (prom 11,4h vs mediana ~2h): mayoría rápida, cola lenta.

| Fase Dropi (creación → handoff) | % < 24h | **Críticos > 24h** | Volumen |
|---|---|---|---|
| Confirmación de orden | 85,5% | **314.126** | 2,16M |
| Generación de guía | 90,1% | 324.089 | 3,27M |
| Preparación de la guía | 89,9% | 207.043 | 2,05M |
| Recogido por Dropi | 81,7% | 90.480 | 495K |
| En bodega Dropi | 98,6% | 10.667 | 755K |
| Entregado a transportadora (handoff) | 99,4% | 6.123 | 953K |

> **[SÍNTESIS]** En el tramo Dropi los que se pasan de 24h se concentran en **Confirmación (314K, 14,5%)** y **Recogido (90K, 18,3%)** — esa es la "cantidad". El resto cumple 90–99%. ⚠️ **Pero esto es por fase; el KPI es el acumulado creación→handoff** y NO se puede sumar (los volúmenes por fase difieren — no toda orden pasa por todas, es un diamante). **Falta un solo número:** % de órdenes con (handoff − creación) < 24h. Misma fuente, otra agregación → pedirlo a Data.

### 2.2 El cuello real está en el carrier `[DATO: Monitor, junio]`
| Fase (post-handoff) | % < 24h | **Críticos > 24h** |
|---|---|---|
| **Primer ofrecimiento** | **31,1%** | **569.671** 🔴 |
| **Entrega final** | **20,3%** | 479.949 🔴 |
| Devolución | 0,03% | 115.032 |
| Recolectado sin preparado *(posible artefacto de homologación)* | 69,3% | 283.376 |

> **[SÍNTESIS]** Después del handoff el cumplimiento se desploma: primer ofrecimiento 31% (**570K críticos**), entrega final 20% (**480K**). Eso es tiempo del **carrier** — el KPI de Dropi corta en el handoff. Palanca: Selección de Transportadoras (PRM-1513) + triaje de novedad (PRM-1512). "Recolectado sin preparado" (283K) huele a artefacto de homologación (fuera de secuencia) → revisar con Data, no asumir problema operativo.

---

## 3 · Meta propuesta `[PROPUESTA·validar con Dir. Producto]`

| KPI | Baseline | Meta propuesta Q3 | Cómo se mide | Confianza |
|---|---|---|---|---|
| **Entrega s/creadas = EL KR (≥70%)** | ~59% consol. · **CO 62,5%** | **CO +4–5 pts (→ ~67%), rumbo a 70%** | entregadas / creadas, mes cerrado | Media |
| ↳ vía **movilización (fuga ①)** | CO pierde 16,7% | subir 2–3 pts | movilizadas / creadas | Media |
| ↳ vía **devolución (fuga ②)** | ~25% s/mov CO | bajar 2–3 pts (carrier×zona) | devueltas / movilizadas | Media |
| **Tiempo a transportadora (< 24h)** | por fase 82–99% cumple; **acumulado por pedir** | **≥ 90% de órdenes en < 24h** | % de órdenes con creación→handoff < 24h (tasa) | Media — falta acumulado |
| **Tiempo del carrier** *(monitorear)* | primer ofrec. 32% · entrega final 21% | instrumentar y reportar | % < 24h por fase carrier | — |

> **[SÍNTESIS] Mensaje de PM para la reunión:** *"El KR (entrega s/creadas) está en 59% consolidado, CO 62,5% — debajo del 70%. La brecha se cierra por las dos fugas: movilización y devolución. Propongo +4–5 pts en Colombia en Q3. El KPI de tiempo se mide como % de órdenes en < 24h; en el tramo Dropi cumple 82–99% por fase, el cuello es el carrier."*

## 3.1 · Todo tiene métrica (base + meta + fuente)
> Regla (Juan, 01-jul): ninguna etapa ni palanca entra sin su métrica.

| Etapa / palanca | Métrica | Base | Meta | Fuente |
|---|---|---|---|---|
| Creación | % validadas (SHOP) | val. entra red 68,9% vs sin val. 57% | subir cobertura de validación | dossier §18 |
| **Confirmación** (palanca #1) | % que muere aquí · % con motivo | SHOP 18% cancela · 53% sin motivo | catalogar 100%; bajar cancelación | tema 18 §4 |
| Alistamiento | tiempo guía→preparado | 3,4h (sano) | sostener | Q8 |
| Handoff | % < 24h a transportadora | 99,5% por fase | sostener | Monitor |
| **Reparto/entrega** (palanca #2) | % devolución s/mov | 26% (CO 25%) | −2–3 pts | tema 18 |
| ↳ carrier×zona | Δ entrega entre carriers, misma zona | 20–27 pts | cerrar la mitad | tema 18 §10.7 |
| **Novedad** (palanca #3) | % recuperación real | <5% | subir en recuperables (visita 41% · no-encuentra 55%) | dossier §17 |

---

## 4 · Decisiones — CERRADAS con Juan (01-jul)
- [x] **Denominador del KR:** entrega sobre **CREADAS**. ✅ → baseline 59% (no 72%).
- [x] **Numeración del KR:** **KR2.1**. ✅
- [x] **Umbral de tiempo:** **< 24h** (menos de 24h), medido como **% de órdenes bajo el umbral** (tasa, no promedio ni mediana). ✅

> Ya no son TBD. En el 12:30 se confirman con Maria solo para dejarlo por escrito para toda la célula.

---

## 5 · Cómo se midió · caveats (leer antes de citar) `[DATO]`
- **Entrega/devolución se leen sobre abril (mes cerrado).** Mayo está inmaduro en desenlace (23,5% de guías sin cierre) → su %entrega (63%) está sesgado. No se lee. `[tema 18 §5·§9]`
- **Tiempos en MEDIANA, no promedio:** el promedio lo infla la cola de órdenes atascadas; la mediana es la orden típica. `[Q8]`
- **Riesgo de homologación:** la homologación oficial marca `SIN MOVIMIENTOS` como *movilizado* (dossier §09) → la movilización podría estar **algo sobreestimada**. **Confirmar con Data** antes de fijar la meta de movilización.
- **Q8 es de mayo (parcial):** las transiciones tardías del carrier (reclame oficina, re-despacho) pueden inflarse en mes abierto → pedir corte de **abril** para el baseline duro de tiempos. Las transiciones tempranas (lado Dropi) son estables aun en mes abierto.
- **México "mide mal":** ~13% de brecha de medición aun cerrado → su 43% s/creadas mezcla entrega real baja + homologación rota.

## 6 · Qué desbloquea
Cerrar esta medición + meta desbloquea el ítem #2 (**cronograma Q3**, ya secuenciado en [roadmap-okr-impacto §7](roadmap-okr-impacto.md)) y da el número contra el cual se mide cada apuesta del roadmap.

## 7 · Trazabilidad
| Pieza | Fuente |
|---|---|
| KPI 1 baseline | [tema 18](../conocimiento/temas/18-metricas-operacion-2026-04-05.md) · `Data/` *(bóveda: ../conocimiento/Data/)* · captura movilización 01-jul |
| KPI 2 baseline | Q8 Funnel_Tiempos (medianas) · dossier §15 |
| Las 2 fugas | [roadmap-okr-impacto §8](roadmap-okr-impacto.md) |
| Etapas de la orden | [mapa-etapas-orden.md](mapa-etapas-orden.md) |
| KPIs y metas de la célula | [direccionamiento §5](direccionamiento-logistic-success-2026-s2.md) (Confluence 1485471746) |

## 8 · Changelog
- **2026-07-01 · v3** — **Cerradas las 3 decisiones (Juan):** KR = s/creadas · **KR2.1** · umbral **< 24h**. **KPI de tiempo reescrito como TASA de cumplimiento** (% de órdenes < 24h), no mediana — la mediana no dice *cuántas* cumplen; la distribución está sesgada a la derecha (prom 10,5h vs mediana 2h). Añadida §3.1 "todo tiene métrica".
- **2026-07-01 · v2** — **Corregido (Juan):** (1) el KR es entrega **s/creadas** (~59%), no s/movilizadas (72%) → estamos ~11 pts **debajo** de 70%, no encima; recomputado por país. (2) Tiempos en **mediana** (orden típica ~14h a transportadora, cumple; el cuello es carrier: transporte 28,4h, reclame oficina 212h). Meta reescrita como cerrar la brecha del KR vía las 2 fugas.
- **2026-07-01 · v1** — Primera medición + meta sobre abril. *(Tenía el KR como s/movilizadas — corregido en v2.)*
