# Spec · Reducir devoluciones dentro del COD  ·  RAMA DE MUESTRA (flujo end-to-end)

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo. Fuente: `data:` `jira:` `doc:` `reunion:`.
> ⭐ **Esta es la rama de MUESTRA del flujo completo** (decisión Juan 25-jun): baja una sola fuga de punta a punta
> —árbol → oportunidad → insights → ideas → soluciones → impacto → métricas— para validar el formato y replicarlo.
> Modelo del árbol/cadena: `metodologia/arbol-discovery-okr-jira.md`. Mapa de impacto: `estrategia/roadmap-okr-impacto.md`.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista |
| Proyecto OKR (Jira) | **PRM-1523** "Reducir devoluciones 10%" (Proyecto OKR) |
| Célula | Logistic Success |
| Etapa de la cadena | Desenlace (entrega/devolución) |
| Fuga | ② COD fallido / devolución |
| OKR / KR | OKR2 · **KR2.1 Tasa de entrega ≥70%** (directo) |
| Estado global | ⚪ discovery (borrador 25-jun) |
| Última actualización | 2026-07-09 |

> **🆕 09-jul · logística inversa — token de devoluciones (Veloces)** `[fuente: update de Juan a Maria, 09-jul]`
> Veloces desarrolló un **token para proveedores al momento de entregarles las devoluciones**, para zanjar la
> disputa clásica de la logística inversa: **el proveedor dice que la devolución no le llegó y la transportadora
> dice que sí**. Prueba de entrega verificable de la devolución al proveedor. **Rol de Juan = acompañar / direccionar**
> (no es dueño ni desarrollo propio). Es la pata de **logística inversa** de esta rama: no reduce la devolución,
> pero **cierra la fricción/confianza del tramo de retorno** (evita pérdidas y disputas). Seguir el proceso.

## 0 · El flujo end-to-end (el mapa de esta rama)
```
FUGA ② COD/devolución  (rama del árbol, = PRM-1523)
  └─ OPORTUNIDAD · "El grueso de la devolución es pago/voluntad, no logística"
       ├─ Insight 1 · COD 25% vs prepago 1.3% (pago = palanca dominante)
       ├─ Insight 2 · triaje por motivo: rehúsa 95% devuelve (soltar) · no-encuentra 41-55% (pelear)
       └─ Insight 3 · no hay dueño de la novedad (solved_by_logistic=0, recupero <5%)
     ├─ IDEA A · Red de seguridad de pago DENTRO del COD
     │    └─ Solución A1 · Score de riesgo de pago/devolución por orden (pre-despacho)
     │    └─ Solución A2 · Anticipo / ConfioPagos en órdenes de alto riesgo (con Fintech)
     └─ IDEA B · Dueño + triaje de la novedad
          └─ Solución B1 · Triaje automático por motivo (soltar / pelear) + dueño asignado
  → IMPACTO: Alto (devolución 25% → meta ≤10%; mueve KR2.1 directo)
  → MÉTRICA: tasa de devolución s/red + recuperación de novedades "pelear" + precisión del score
```
> **Principio que NO se viola:** el COD es el valor agregado de Dropi (el cliente paga al recibir). La devolución
> se ataca **dentro del COD** (anticipo, score, contactabilidad), **nunca empujando prepago**. `[doc:CLAUDE.md · Juan]`

## 1 · Árbol de problema (la rama, descompuesta por motivo de devolución)
**Raíz:** la orden entra a la red pero no se entrega y se devuelve, perdiendo el flete de ida y vuelta y el COD. Devolución ~19-25% sobre red. `[data:tema 04]`
Descompuesta por **motivo de novedad** (no es un bloque; cada motivo se ataca distinto): `[data:tema 04 · history_new_orders, captura 24-jun]`
- **A · Pago / voluntad** — "rehúsa recibir" 294K (95% devuelve) + el "no tengo plata" al momento de entrega. Es arrepentimiento o falta de efectivo, no logística. `[data]`
- **B · Contactabilidad / coordinación** — "coordinar la entrega" 281K (79% devuelve) + "no contesta" 37K. `[data]`
- **C · Gestión de la visita (recuperable)** — "no se logra entrega" 84K (41% recupera) + "no encuentra destinatario" 24K (55% recupera). `[data]`
- **D · Dirección** — "no existe/incompleta/no localiza" ~161K (58-82% devuelve). ⛔ **No-objetivo de esta rama:** es la **hermana de prevención/recuperación** → vive en [`direccion-confiable-geo/spec.md`](../direccion-confiable-geo/spec.md). `[⛔ · data]`

## 2 · Oportunidad (problema + data)  — el nodo Polaris
**"El grueso de la devolución es un problema de pago y de gestión, no de la última milla."**
Hoy tratamos la devolución como un bloque y la "gestionamos" cuando ya ocurrió; pero la data dice que la palanca grande es el pago dentro del COD y un triaje honesto por motivo, no más operación física. `[data:tema 04]`

### Los 3 Insights (= la evidencia que se pega como tarjetas en Polaris)
1. **El pago manda:** COD devuelve **25%** vs prepago **1.3%** (H2, hallazgo #1). Como el COD es el valor, se ataca dentro de él. `[data:tema 05]`
2. **Triaje por motivo:** "rehúsa recibir" (294K, **95% devuelve**) → soltar, no pelear; "no se logra/no encuentra" (**41-55% recupera**) → pelear. "Resuelta" es humo: el % resuelta es alto pero la entrega final no sube → la gestión administra el fracaso. `[data:tema 04]`
3. **Sin dueño:** `solved_by_logistic = 0` siempre; recuperación real **<5%**. Nadie es responsable de la novedad. `[data:tema 04]`

## 3 · Ideas (las palancas)
- **Idea A · Red de seguridad de pago dentro del COD** — reducir la devolución por pago/voluntad sin tocar la promesa de contraentrega (anticipo parcial, score de riesgo, recordatorio de "ten el efectivo"). Ataca el motivo A. `[⚪]`
- **Idea B · Dueño + triaje de la novedad** — poner un responsable Dropi y triar por motivo: soltar lo perdido (rehúsa), pelear lo recuperable (no se logra/no encuentra), con gate pre-despacho. Ataca B y C. `[⚪ · data:tema 05 plan frente 2/3]`

## 4 · Soluciones (experimentos, barato → caro)
- **A1 · Score de riesgo de pago/devolución por orden** — marcar antes del despacho las órdenes con alta probabilidad de devolver (huella histórica del comprador). Engancha con PRM-1512 (IA predicción) y PRM-1211 (huella digital). Barato-medio; usa data existente. `[⚪ · jira:PRM-1512/1211]`
- **B1 · Triaje automático de novedad por motivo + dueño** — soltar "rehúsa", escalar "no se logra/no encuentra", con responsable asignado. Barato; cambia proceso, no construye motor de reintentos (el 1er intento decide). `[⚪]`
- **A2 · Anticipo / ConfioPagos en órdenes de alto riesgo** — red de seguridad de pago dentro del COD, sólo donde el score lo amerite. Más caro; requiere **coordinación con Fintech**. `[⚪ · pregunta abierta §9]`
> No-objetivo (⛔): motor de re-despacho/reintentos (el 1er intento decide); empujar prepago (rompe el valor COD). `[⛔ · data:tema 04]`

## 5 · Impacto (aporte al KR)
**Alto.** Devolución hoy ~25% s/red → objetivo del Proyecto OKR **≤10%** (PRM-1523). Cada devolución cuesta flete ida+vuelta + producto inmovilizado + COD no recaudado. Atacar el motivo A (294K "rehúsa") y rescatar el C (recuperables 41-55%) sube la tasa de entrega (KR2.1) directamente. `[data:tema 04/05]`
> `Aporte a NSM` (cuando se cargue): **Alto · % entrega/devolución · baseline pendiente** (la cifra exacta sale de la 1ª medición).

## 6 · Métricas (de éxito + cómo se mide)
- **Métrica de éxito:** tasa de devolución sobre red. Base ~**19-25%** (±2-3%), meta **≤10%** o −10% relativo sostenido. `[data:tema 04]`
- **Sub-métricas:** % devolución **por motivo** · % recuperación de las novedades "pelear" · precisión del score (de las marcadas alto-riesgo, cuántas devuelven). `[🟡]`
- **Segmentación / PQL:** por canal (SHOP/MANUAL), por motivo, por carrier, por país. `[🟡]`
- **Cómo se mide (datos):** `history_new_orders` (`novedad`, `solution`, `solved_by_user_logistic`) · `Order` (`rate_type`=COD, `status`, `distribution_company_id`) · `Historyorder`. Devolución es ±2-3% confiable; las novedades ya las tenemos por captura. `[data:tema 10]`

## 7 · Multi-país
Rama común; **CO primero** (data madura) → **MX después**, con baseline y umbrales de score por país. El score y el triaje se parametrizan por país/carrier; el KR se mide por país. `[🟡 · metodologia/arbol-discovery-okr-jira §6]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| OKR / KR | OKR2 [PRM-1391] → KR2.1 [PRM-1396] |
| Proyecto OKR | PRM-1523 (ya con OKR Ppal + KR entrega, 25-jun) |
| Oportunidad / Idea / Solución | **por crear** (cuando se valide el flujo y se decida espejar) |
| Engancha con | PRM-1512 (IA predicción devoluciones) · PRM-1211 (huella digital) · PRM-91 (direcciones = motivo D, otra rama) |

## 9 · Preguntas abiertas
- [ ] **Frente de pago dentro del COD (A2):** ¿lo asume logística o se coordina con Fintech (ConfioPagos/anticipo)? — Juan + Fintech `[doc:estrategia/ decisión abierta COD]`
- [ ] **Baseline de devolución por motivo y por país** — correr con `history_new_orders`. — Juan + Data
- [ ] **Umbral del score** (precisión vs cobertura) — se fija con la 1ª corrida.
- [ ] **¿Cuánto del "rehúsa" (294K) es realmente "no tengo plata"?** — abrir el motivo, hoy agregado. — Data

## 10 · Changelog
- 2026-06-25 — Rama de muestra creada end-to-end (árbol→oportunidad→3 insights→2 ideas→3 soluciones→impacto→métricas). Pendiente: validar el formato con Juan y, si sirve, replicarlo en las demás fugas; luego (último) cronograma + espejar a Jira.
