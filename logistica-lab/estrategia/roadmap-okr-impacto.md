# Roadmap por OKR — el mapa de impacto (OKR → KR → proyectos → aporte)

> **El centro del roadmap son los OKR** (decisión Juan, 25-jun). Este es el mapa vivo: cada proyecto
> colgado de su OKR/KR, con su **aporte estimado** al KR. Lo que no cuelga de un OKR no entra al roadmap.
> Modelo de árbol/cadena: `metodologia/arbol-discovery-okr-jira.md`. Categorización por la orden: `proyectos/_categorizacion.md`.
> Dirección/palancas: `direccion-celula-norte-e-impacto.md`. **Fuente:** Jira PRM/Polaris (lectura MCP 25-jun) + `conocimiento/`.

## 0 · Cómo se lee el aporte
- **Aporte** = cuánto mueve el proyecto su KR. Escala: **Alto · Medio · Bajo · Habilitador** (instrumentación que no mueve el KR sola).
- La estimación es **cualitativa con data** (fuga que ataca + fuerza de la palanca). El **número** (pts) se llena cuando corra la baseline.
- **Convención para el campo Jira `Aporte a NSM`** (hoy 0/28): `{Alto/Medio/Bajo/Habilitador} · {sub-métrica} · {pts estim. o "baseline pendiente"}`.

## 1 · Los 3 OKR que toca logística
| OKR | KR (ticket) | Rol de logística |
|-----|-------------|------------------|
| **OKR2 · Consolidar operación multi-país** [PRM-1391] | **KR2.1 · Tasa de entrega ≥70%** [PRM-1396] | **Dueños directos** — el grueso del roadmap |
| **OKR3 · Eficiencia / rentabilidad** | **KR3.1 · Gross margin ≥22%** | Contribuye vía **Tarifas** (monetización del flete) |
| **OKR1 · Escalar volumen** [PRM-1390] | KR1.1 órdenes [PRM-1393] · KR1.2 GMV [PRM-1394] | Contribuye vía **movilización** (más órdenes entran a red) |

## 2 · OKR2 / KR2.1 — Tasa de entrega ≥70% (el centro del trabajo)
> La entrega = **movilización (entra a red) × % entrega (sobre red)**, + lentes COD/devolución y tiempo por fases.

| Proyecto | Ticket | Fuga / sub-métrica | Aporte estimado (con data) | Estado |
|---|---|---|---|---|
| Validación/Normalización de **direcciones** | PRM-91 | ① movilización | **Alto** — validar SHOP = +11.9 pts entra red; 618K sin validar ≈ +90K entregas | EJECUTAR |
| **Movilizaciones 80→90%** | PRM-1497 | ① movilización | **Alto** — movilización es ½ de la NSM; brecha 68→90 | ⚠️ sin discovery (gap) |
| **Reducir devoluciones 10%** | PRM-1523 | ② COD/devolución | **Alto** — devolución 25% COD vs 1.3%; dentro del COD | ⚪ discovery (bajar) |
| Notif. **prevención devoluciones / predicción** | PRM-1512 | ②④ novedad | **Medio-alto** — 1er intento decide; 946K novedades | FINALIZAR |
| **Selección de transportadoras** | PRM-1513 (DROP-17946 72%) | ② entrega/ruta | **Medio** — en red los carriers son parejos (~3-4 pts); gana en costo/tiempo/cobertura | EJECUTAR |
| **ChatePro en transportadoras** | PRM-1515 | ④ contactabilidad | **Medio** — "coordinar entrega" = 280K novedades | backlog |
| Pruebas de **intentos de entrega** (SLA, foto geo) | PRM-1517 | ② evidencia | **Medio** — reduce disputa/devolución; geo aún no medible | backlog |
| Coberturas y distancias / **Same Day** | PRM-1514 (←PRM-1366) | velocidad/cobertura | **Medio** — velocidad + tiempo por fases | EJECUTAR |
| Cierre logístico | PRM-1516 | operativo/SLA | **Bajo-medio** — por levantar | backlog |
| Rediseño **módulo de órdenes** | PRM-1511 | UX base | **Habilitador** — base de gestión | backlog |
| **Normalización de estados** | PRM-1297 | ⬚ medición | **Habilitador** — limpia el lenguaje de estados (insumo de la Torre) | EJECUTAR |
| **Torre de control / tiempo por fases** | _por crear_ | ⬚ instrumentación | **Habilitador** — mide y alerta el tiempo; sirve a las fugas, no las reemplaza | ⚪ discovery |

> **Lectura:** los tres "Alto" (direcciones · movilización · devoluciones) **no pesan igual** — se desempatan por **tamaño de fuga × costo de la palanca** en §8. Adelanto: **movilización pre-red es la más grande y la más barata; direcciones es un subconjunto y es recuperación → baja.** Transportadoras/ChatePro/Same Day son Medio. Torre y Normalización son **instrumentación** (no suman pts solos). Guías reemplazatorias (PRM-745/1380/1381) ya ✅ ordenado.

## 3 · OKR3 / KR3.1 — Gross margin ≥22%
| Proyecto | Ticket | Aporte estimado | Estado |
|---|---|---|---|
| **Parametrización de tarifas** | PRM-1362 · 1446 (→1510) | **Alto** — monetización del flete (sobreflete, reglas de pricing) | EJECUTAR (Juan) |

## 4 · OKR1 / KR1.1-1.2 — Volumen / GMV
| Aporte de logística | Vía | Nota |
|---|---|---|
| Indirecto | **Movilización** (PRM-1497, PRM-91) | más órdenes que entran a red = más volumen efectivo entregado; el resto de OKR1 es de otras células (activación, CAC) |

## 5 · Gaps que impiden dirigir por números (del audit)
1. 🔴 **`Aporte a NSM` 0/28** + `OKR Ppal` vacío en ~15 + `Cronograma` 0/28 → el roadmap no tiene impacto ni línea de tiempo. **Poblarlos con la convención §0.**
2. 🔴 **Movilización** no tiene proyecto que la posea como objetivo (PRM-1497 sin discovery) — siendo ½ de la NSM y lo más barato.
3. 🔴 **COD / recaudo** disperso en Backoffice (PRM-1283/1209), sin dueño logístico — y COD = el valor.
4. 🔴 **Tiempo por fases** sin baseline → la Torre no se activa de verdad hasta correrlo.

## 6 · Próximos pasos
- [ ] **Poblar `Aporte a NSM` + `OKR Ppal` + `Cronograma`** en los proyectos activos (con OK por cambio en Jira).
- [x] **Bajar las apuestas a cadena end-to-end** → 4 ramas del árbol en `proyectos/` (movilización · dirección+geo · devoluciones · novedad).
- [ ] **Reconectar** las 22 ideas de PRM-1550 a su Proyecto OKR (§2).
- [ ] Correr **baseline de tiempo por fases** → llena los pts estimados de este mapa.

## 7 · Secuencia de ejecución (cronograma relativo)
> Principio: **instrumentar antes de construir** · barato→caro · **WIP cap 2-3 apuestas activas** · empezar por lo que
> no depende de terceros. Las fechas duras salen del Delivery Backlog / Cell Board (no inventadas aquí).
> Las 4 ramas viven en `proyectos/` (cada `spec.md` con su árbol→solución→impacto→métrica).

| Fase | Qué se hace | Rama · solución | Por qué primero | Bloqueos |
|---|---|---|---|---|
| **0 · Instrumentar** | Catálogo de motivos de cancelación **obligatorio** + correr baselines por motivo/zona | Movilización A1 · (baselines de las 4) | Lo más barato, **desbloquea** todo; "no se rescata lo que no se sabe por qué murió" | ninguno (las novedades/cancelaciones **no** dependen de accesos especiales) |
| **1 · Quick wins** | Nudge de validación SHOP · ubicación por ChatePro en dirección riesgosa · triaje de novedad + dueño | Movilización B1 · Dirección P1 · Novedad A1 | Alto impacto, bajo costo, UX/proceso; mueven movilización y entrega ya | — |
| **2 · Construcción media** | Score de riesgo (dirección/pago) · pin en mapa · auto-confirmación WhatsApp · sub-estados VELOCES | Dirección P2/P3 · Devoluciones A1 · Movilización B2 · Novedad B1 | Requieren build/data; se priorizan con el resultado de la Fase 0 | sub-estados dependen del **carrier** |
| **3 · Apuestas caras / terceros** | Anticipo/ConfioPagos dentro del COD · posventa recompra/garantía | Devoluciones A2 · Novedad C1 | Mayor costo y coordinación externa | **Fintech** (A2) · **Backoffice** (C1) |

> **Respetando el WIP (2-3):** arrancar Fase 0 (instrumentar) + las 2-3 de Fase 1; nada de Fase 3 hasta cerrar dependencias.
> **Recién cuando esta secuencia se valide** → cargar `Cronograma inicio/fin` en Jira y **espejar las cadenas** (Oportunidad/Idea/Solución) con OK por cambio.

## 8 · Mapa vivo de fugas (HECHOS medidos) — el hilo conductor
> Disciplina (memoria [[feedback-razonamiento-datos-fugas]]): aquí **solo hechos** (medido·homologado·reconciliado); las **inferencias** van marcadas `[INF]`. Cada dato nuevo se cuelga aquí, no en una narrativa nueva. Fuente: data store `conocimiento/Data/` + [tema 18](../conocimiento/temas/18-metricas-operacion-2026-04-05.md). Mes de referencia para entrega/devolución = **cerrado (abr)**, NO mayo. La no-entrega del KR2.1 = **no-moviliza (①) + devuelve (②)**; dirección/novedad/tiempo NO son fugas propias, son causas/instrumentación dentro de éstas.

### Fuga ① · No-movilización — KR1.1 (volumen) + alimenta KR2.1
- **Tamaño [HECHO]:** 788K/mes no entran a red = **21,4%** (YTD: 18,9M creadas → 15,28M mov). ~541K es CO.
- **Apertura [HECHO parcial]:** causas solo CO (motivos de cancelación): Otros 183K · Cliente cancela 160K · sin nota 158K · duplicado 67K · datos incompletos 52K. **53% es ciego** ("Otros"/"sin nota"/"Autorizado por gerencia").
- **Palanca:** instrumentar el motivo (catálogo cerrado) = habilitador que **vuelve visible** el 53% ciego; recién ahí se ve qué es rescatable. → Idea A1.
- **Prioridad:** Alta por tamaño; palanca directa **aún no determinable** hasta cerrar el ciego. **Falta:** período de la captura de motivos · ¿rechazo es pre o post-mov?

### Fuga ② · Devolución — KR2.1 (entrega)
- **Tamaño [HECHO]:** 823K/mes (abril) = **26%** de las movilizadas. Estable ene–abr.
- **Apertura por zona [HECHO]:** concentrada — top 10 dptos = **51%**; 3 grandes (Cundinamarca·Antioquia·Valle) = 31% del volumen-dev. Alta tasa: Metrop. Santiago 34% · Bolívar 30% · Nariño 30%.
- **Apertura por carrier×zona [HECHO]:** dentro de la misma zona, Δ20–27pp entre carriers (Antioquia: ENVIA 16% vs INTER 43%; Valle: ENVIA 15% vs INTER 37%).
- **Palanca:** **carrier correcto por zona** (= habilitador Selección de Transportadoras PRM-1513). `[INF]` techo ≈ 121K dev/mes (15%) si cada zona igualara su mejor carrier — **hipótesis, asume carrier=causa**.
- **Prioridad:** Alta; palanca clara y medible. **Falta para confirmar causa (no inferir):** `Estados_cierre_Transportadora` (motivo de cierre, Tabla A) + `seller×zona×carrier` → separar si el carrier es causa o le toca peor segmento.

### Dimensiones (cortan las fugas, NO son fugas)
País · zona/dpto/ciudad · carrier · seller (concentrado: 564 whales = 47% vol) · producto. Se usan para **focalizar** ① y ②, no como ejes propios.

### Hilo abierto (lo que cierra el mapa)
1. Motivo de cierre de la devolución (Tabla A) → causa real, reemplaza a novedades (inusables).
2. Cerrar el 53% ciego del no-mov (catálogo) + confirmar período.
3. `seller×zona×carrier` → separar efecto-seller de efecto-zona.
