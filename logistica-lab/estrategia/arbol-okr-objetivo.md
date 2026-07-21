# 🌳 Árbol objetivo — Logistic Success · REAJUSTADO POR DATOS (v2, 28-jun)

> **Reajuste con datos** (data store `conocimiento/Data/` + [tema 18](../conocimiento/temas/18-metricas-operacion-2026-04-05.md) + mapa de fugas [roadmap-okr-impacto §8](roadmap-okr-impacto.md)).
> Aplica el lente [[feedback-razonamiento-datos-fugas]]: **[HECHO]** = medido/homologado/reconciliado · **[HIP]** = hipótesis (con el dato que la confirmaría). Reemplaza el diseño previo (5 ramas hipotéticas) por **2 fugas duras + dimensiones + habilitadores**.
> ⚠️ **NO tocado en Jira aún** (requiere OK por cambio, memoria [[feedback-confirmar-cada-cambio-jira]]). Lo que cambiaría en Jira está en §Cambios.

## Principio (reanclado a los hechos)
La no-entrega del KR2.1 se descompone, medido, en **dos fugas**:
> **No-entrega = NO-MOVILIZA (①, 21%) + DEVUELVE (②, 26%).**

Todo lo demás **no es una fuga**: dirección, novedad y tiempo eran hipótesis o instrumentación; país/zona/carrier/seller/producto son **dimensiones** que cortan las fugas. Una idea no entra al árbol si no cuelga de una de las 2 fugas con un hecho que la dimensione.

---

## OKR 2 · KR2.1 — Tasa de entrega ≥70% (PRM-1396) · el centro

### Fuga ② · DEVOLUCIÓN (PRM-1523)
- **[HECHO] Tamaño:** 823K/mes (abril cerrado) = **26%** de las movilizadas. Estable ene–abr. **CO = 71%** del volumen de devolución (581K).
- **[HECHO] Cómo se mueve:** geográfica (top 10 dptos = 51%) y, dentro de la misma zona, **el carrier cambia la devolución 20–27pp** (Antioquia: ENVIA 16% vs INTER 43%).
- **[HIP] de valor:** *"asignar el carrier correcto por zona reduce la devolución, porque dentro de la misma zona hay 20–27pp entre el mejor y el peor carrier."* Techo `[INF]` ≈ 121K/mes (15%). **Confirmar antes de afirmar:** `Estados_cierre_Transportadora` (Tabla A) → ¿el carrier es causa o le toca el peor segmento?
- **Palanca → Idea:** asignación inteligente de carrier por zona = **Selección de Transportadoras (PRM-1513/203)** — **SUBE de "habilitador" a palanca Alta** de la fuga ②.
- **[HIP previa, a re-confirmar]:** "devolución = problema de pago/COD" (hallazgo #1 del cerebro) — esta data **no** lo prueba ni lo niega; depende del motivo de cierre. Queda como segunda hipótesis, no como base.

### Fuga ① · NO-MOVILIZACIÓN (PRM-1497/1574) — alimenta KR2.1 y KR1.1
- **[HECHO] Tamaño:** 788K/mes = **21,4%** no entran a red (~541K CO).
- **[HECHO parcial] Apertura** (cancelación CO, ⚠️ período sin confirmar, NO reconcilia con el no-mov): ciego **53%** · demanda/cliente cancela 26% · limpieza/duplicado 10% · **rescatable logístico solo 11%**.
- **[HIP]:** "lo rescatable por logística es chico; el grueso es demanda + ruido" — **no priorizable hasta cerrar el 53% ciego.**
- **Palanca → Idea A1:** instrumentar el motivo (catálogo cerrado) = **discovery/habilitador** que vuelve visible el ciego; NO es aún una solución de impacto.
- **Confirmar:** reconciliar motivos con el no-mov (mismo período) · ¿"rechazo" es pre o post-movilización?

### Habilitadores (instrumentación — NO mueven el KR solos)
- **Motivo de cierre + Homologación de estados** (PRM-1297 = tabla `Homologacion Estados` del modelo): confirma la causa de ② y arregla la medición (MX "mide mal", 23,5% sin-cierre = madurez).
- **Tiempo por fases / Torre** (Oportunidad nueva): **las medidas YA existen en Power BI** (`Recibido_PAU → Preparado → Recogido → Entregado_a_Tte`) → desbloqueado, ya no espera datos externos.

---

## OKR 1 · KR1.1 — Volumen (PRM-1393)
La **fuga ① (movilización)** alimenta también el volumen: más órdenes que entran a red = más volumen entregado.

## OKR 3 · KR3.1 — Gross margin ≥22%
**Tarifas (PRM-1362).** Sin data en este análisis (solo existe `suma_fletes` en Tabla A, sin trabajar). No se toca (decisión de Juan). Roadmap de margen = pendiente aparte, no parte de este reajuste.

---

## Dimensiones (cortan las fugas, NO son ramas)
- **País:** KR2.1 se mide por país; **CO = 71%** del volumen y de la devolución → se ataca en CO.
- **Zona/dpto/ciudad · Carrier:** el cruce zona×carrier es la palanca de ②.
- **Seller:** concentrado (564 whales = 47% del volumen); focaliza el ataque, no es fuga. `[falta seller×zona×carrier para separar efecto-seller de efecto-zona]`.
- **Producto:** `ordenes_devolucion/tipo_producto` (Tabla G) — pendiente de export.

## Qué SALE del árbol previo (con el dato que lo justifica)
| Rama previa | Veredicto | Dato |
|---|---|---|
| **B · Dirección + geo** | ❌ no es fuga; sale del centro | dirección ≈1% de novedades vs 62% rechazo (y ese 62% resultó artefacto). Era la hipótesis que disparó esta revisión. |
| **D · Novedad / dueño-triaje** | ❌ reabsorbida en ② | el dato de novedades es **inusable** (modal, etiquetas sin homologar). El desenlace real = devolución. |
| **E · Tiempo por fases** | → habilitador, no fuga | mide, no mueve. (Medidas ya existen.) |

## Cambios vs Jira (propuestos — NO ejecutados, requieren OK por cambio)
- **PRM-1513 (Selección de Transportadoras):** subir de habilitador → **palanca Alta de la fuga ②** (carrier por zona).
- **PRM-1523 (Devoluciones):** reencuadrar el ángulo a **"carrier por zona"** (hipótesis pago = secundaria, a re-confirmar).
- **PRM-1577/1578/1579 (Dirección+geo):** bajar de rama a **sub-causa / hipótesis no sostenida** (archivar el ángulo geo como base).
- **PRM-1583/1584/1585 (Novedad):** **reabsorber** en la fuga ② (no rama propia).
- **PRM-1574/1575/1576 (Movilización):** mantener como **discovery/instrumentación** (catálogo de motivos), no como solución de impacto hasta cerrar el 53% ciego.
- Movilización → colgar de **KR1.1** (volumen) + alimentar KR2.1.

> **Antes de cualquier cambio en Jira:** validar este reajuste con Juan. El árbol viejo ya está espejado (PRM-1574…1602); reajustarlo es mover/reconectar, con OK por cambio.
