# Spec · Dueño y triaje de la novedad (+ posventa)  ·  flujo end-to-end

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo. Fuente: `data:` `jira:` `doc:`.
> Replica el molde de muestra. **Es la capa que las otras ramas usan:** provee el motor de dueño+triaje de la
> novedad (transversal a todos los motivos) + la posventa. Modelo: `metodologia/arbol-discovery-okr-jira.md`.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista |
| Proyecto OKR (Jira) | **PRM-1512** "Herramientas preventivas/predictivas de novedades" (+ novedades PRM-1361/1365) |
| Célula | Logistic Success (posventa/garantías = coordinar con Backoffice) |
| Etapa de la cadena | Novedad → Desenlace → Posventa |
| Fuga | ④ posventa rota |
| OKR / KR | OKR2 · **KR2.1 Tasa de entrega ≥70%** |
| Estado global | ⚪ discovery (borrador 25-jun) |
| Última actualización | 2026-06-25 |

## 0 · El flujo end-to-end
```
FUGA ④ · La novedad no tiene dueño y se "gestiona" sin recuperar; la posventa está rota   (= PRM-1512)
  └─ OPORTUNIDAD · "Nadie responde por la novedad: se administra el fracaso, no se recupera"
       ├─ Insight 1 · solved_by_logistic = 0 siempre · recuperación real <5% (sin dueño)
       ├─ Insight 2 · "resuelta" es humo: % resuelta 70-85% pero entrega final baja → suele acabar en DEVOLVER
       └─ Insight 3 · el triaje está en la data: rehúsa 294K (95% devuelve = soltar) vs no-encuentra 55% (pelear)
     ├─ IDEA A · Poner DUEÑO Dropi de la novedad (responsable + SLA, gate pre-despacho)
     │    └─ Sol A1 · Triaje automático por motivo + dueño/SLA asignado   ← frente #3, barato
     ├─ IDEA B · Sub-estados de devolución homologados (interceptar para reofrecer)
     │    └─ Sol B1 · Homologar sub-estados (empezar VELOCES, ya en 4 pasos) → reofrecer antes de devolver
     └─ IDEA C · Posventa: convertir la devolución en recompra/garantía fluida (logística inversa)
          └─ Sol C1 · Flujo de recompra/garantía tras devolución (coordinar Backoffice)
  → IMPACTO: Alto-medio (recuperación hoy <5%; dueño+triaje sube entrega y baja devolución)
  → MÉTRICA: % recuperación de novedad · % novedades con dueño/SLA · "pelear" entregadas vs "soltar" · tiempo de resolución
```
> **Lente de usuario:** la novedad sin dueño deja al **comprador** sin su pedido y al **dropshipper** sin venta.
> Un responsable que **pelea lo recuperable y suelta lo perdido** rescata a ambos sin gastar en lo que ya está perdido. `[doc:tema 13/16]`

## 1 · Árbol de problema
**Raíz:** cuando la orden entra en novedad, nadie en Dropi es dueño; se "gestiona" pero no se recupera, y la posventa (devolución→recompra/garantía) está rota. `[data:tema 04]`
- **A · Sin dueño** — `solved_by_logistic = 0`: nadie responde por la novedad; recuperación real <5%. `[data]`
- **B · Sin triaje** — se trata todo igual; "resuelta" es humo (alto % resuelta, baja entrega final). Rehúsa (soltar) y recuperable (pelear) se mezclan. `[data]`
- **C · Posventa rota** — tras la devolución no hay recompra/garantía/logística inversa fluida; sub-estados no homologados. `[data:tema 04 · tema 10 warranties]`

## 2 · Oportunidad + los 3 Insights
**"La novedad no tiene dueño y se administra el fracaso en vez de recuperarlo."**
### Insights
1. **Sin dueño:** `solved_by_logistic = 0` siempre; recuperación real **<5%**. `[data:tema 04]`
2. **"Resuelta" es humo:** % resuelta 70-85% pero entrega final baja → la gestión administra el fracaso; cuando hay solución suele ser "DEVOLVER AL REMITENTE". `[data:tema 04]`
3. **El triaje está en la data:** "rehúsa recibir" 294K (**95% devuelve** → soltar) vs "no se logra / no encuentra" (**41-55% recupera** → pelear). Pelear lo correcto, soltar lo perdido. `[data:tema 04]`

## 3 · Ideas (las palancas)
- **Idea A · Dueño Dropi de la novedad** — responsable + SLA, con gate pre-despacho (no despachar lo que va a fallar). `[⚪ · data:tema 05 frente #3]`
- **Idea B · Sub-estados de devolución homologados** — interceptar para reofrecer antes de que se consuma la devolución. `[⚪ · data:tema 05]`
- **Idea C · Posventa fluida** — convertir la devolución en recompra/garantía (logística inversa). `[⚪]`

## 4 · Soluciones (experimentos, barato → caro)
- **A1 · Triaje automático por motivo + dueño/SLA** (frente #3 del plan). Barato; cambia proceso. `[⚪ · data:tema 05]`
- **B1 · Homologar sub-estados de devolución** empezando por **VELOCES** (ya los tiene en 4 pasos) → reofrecer. Depende del carrier. `[⚪ · data:tema 05]`
- **C1 · Flujo de recompra/garantía tras devolución** — **coordinar con Backoffice** (garantías PRM-1294). Más caro. `[⚪ · jira:PRM-1294]`
> No-objetivos (⛔): motor de re-despacho/reintentos a ciegas (el 1er intento decide); pelear el "rehúsa" (95% devuelve, soltar). `[⛔ · data:tema 04]`

## 5 · Impacto (aporte al KR)
**Alto-medio.** Recuperación hoy <5%; poner dueño + triar sube la entrega de lo recuperable (41-55%) y evita gastar en lo perdido (rehúsa 95%). Sobre ~946K novedades, el rescate del segmento "pelear" mueve KR2.1. `[data:tema 04]`
> `Aporte a NSM` (al cargar): **Alto-medio · % entrega/devolución · baseline pendiente**.

## 6 · Métricas (de éxito + cómo se mide)
- **Éxito:** % de recuperación de novedad (base <5%) ↑ · % de novedades que terminan en devolución ↓. `[data:tema 04]`
- **Proceso:** % de novedades con dueño/SLA asignado · % de "pelear" entregadas vs % de "soltar" · tiempo de resolución. `[🟡]`
- **Posventa:** % de devoluciones convertidas en recompra/garantía. `[🟡 · tema 10 warranties]`
- **Datos:** `history_new_orders` (`novedad`, `solution`, `solved_by_user_logistic`, `date_solution`) · `warranties` (`warranty_type`, `status`, `return_type`). Medible (novedades por captura). `[data:tema 10]`

## 7 · Multi-país
Los sub-estados dependen del carrier → homologar por país; empezar **VELOCES / CO**. El dueño+triaje aplica a todos. `[🟡 · arbol-discovery-okr-jira §6]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| OKR / KR | OKR2 [PRM-1391] → KR2.1 [PRM-1396] |
| Proyecto OKR | **PRM-1512** (ya con OKR Ppal + KR entrega, 25-jun) · novedades PRM-1361/1365 |
| Relates / coordinar | PRM-1294 garantías (Backoffice) · PRM-1363/1263/1288 logística inversa · hermanas `direccion-confiable-geo` y `reduccion-devoluciones-cod` (le aportan los motivos) |
| Oportunidad/Idea/Solución Polaris | **por crear** |

## 9 · Preguntas abiertas
- [ ] **¿Quién es el dueño de la novedad?** (rol, SLA, herramienta) — Juan + operación `[data:tema 04]`
- [ ] **Sub-estados con VELOCES:** ¿se puede homologar e interceptar? — Juan + carrier
- [ ] **Posventa/garantía:** ¿hasta dónde llega logística y dónde empieza Backoffice (PRM-1294)? — Juan + Backoffice
- [ ] **Baseline de recuperación por motivo** — corrible con `history_new_orders`. — Data

## 10 · Changelog
- 2026-06-25 — Cuarta rama del árbol bajada end-to-end (cierra las 4 fugas). Es la capa de dueño+triaje que usan las hermanas. Pendiente: validar; (último) cronograma + espejar a Jira.
