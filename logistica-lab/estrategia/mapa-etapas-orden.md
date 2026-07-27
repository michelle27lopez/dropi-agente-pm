# 🗺️ La orden por etapas — dónde se pierde el valor (con data)

> **Qué es:** la **visión de producto logística vista por las etapas de la orden** — el eje que dio Maria (*"eres el dueño de la orden, organiza por sus etapas"*). Para cada etapa: qué pasa, cuánto se pierde ahí (data), qué pieza de producto la cubre, y cuál es la palanca. Es el **complemento operativo** de la [visión por 3 lentes](vision-producto-logistico.md) (perfil · madurez · etapa-pieza) y del [mapa de impacto OKR](roadmap-okr-impacto.md).
>
> **Para qué sirve:** es el mapa que ordena el caos de "muchos temas". Todo proyecto de la célula cae en **una** de estas 6 etapas. Y la data dice en cuáles hay sangría y en cuáles no → **prioriza solo**.
>
> **Disciplina:** **[DATO]** = medido (abril cerrado salvo nota) · **[SÍNTESIS]** = lectura propia. Fuentes: [tema 18](../conocimiento/temas/18-metricas-operacion-2026-04-05.md) · [tema 04](../conocimiento/temas/04-hallazgos-data.md) · dossier de hallazgos · Monitor Operativo de Tiempos (30-jun).

---

## El mapa en una tabla (léelo primero)
De cada 100 órdenes creadas, dónde llegan y dónde mueren `[DATO: dossier funnel + tema 18, abril]`:

| # | Etapa de la orden | Dueño | ¿Se pierde valor aquí? | Tamaño de la fuga | Salud |
|---|---|---|---|---|---|
| 1 | **Creación** | Dropshipper | Entra "basura" que muere después (SHOP sin validar) | alimenta la fuga de confirmación | 🟡 origen del problema |
| 2 | **Confirmación** | Dropshipper/Dropi | **SÍ — fuga pre-red** | **~840K/mes mueren; 53% sin saber por qué** | 🔴 **fuga** |
| 3 | **Preparación** (guía, picking) | Proveedor | Casi no | ~13K (mínimo) | 🟢 sano |
| 4 | **Handoff / Movilización** | Dropi | Casi no | ~1K (mínimo) · ~10h | 🟢 sano (el foso) |
| 5 | **Entrega** (red + novedad) | Transportadora | **SÍ — fuga post-red** | **26% de lo movilizado se devuelve** | 🔴 **fuga** |
| 6 | **Postventa / Devolución** | Carrier/Dropi | Sin dueño, sin recuperación | recuperación real <5% | 🔴 **hueco** |

> **[SÍNTESIS] El titular:** de 6 etapas, Dropi ya es **excelente en 2** (preparación y handoff — el foso operativo, ~10h). La sangría está concentrada en **2 etapas: Confirmación (antes de la red) y Entrega/Devolución (después)**. La Creación no es fuga en sí, pero **alimenta** la de confirmación. Postventa es un hueco de dueño, no de volumen. → El roadmap se ordena solo: **ataca confirmación y entrega; no toques prep/handoff.**

---

## Etapa 1 · Creación
- **Qué pasa:** nace la orden — manual, masivo (Excel) o integración (Shopify/Woo). `[DATO: dossier §05]`
- **Dato clave:** el canal **SHOP entra a red 66% vs MANUAL 93%** — la integración automática trae datos sin validar. `[DATO: dossier §18]`
- **Pieza:** Core (módulo de órdenes) · integraciones ecom.
- **Palanca:** validación/normalización en captura (PRM-91). **Ojo:** la validación **ya existe** (`is_validated`, +12 pts a red en SHOP) → **forzarla/medirla, no construirla.** `[DATO: dossier §18]`
- **Veredicto [SÍNTESIS]:** no es una fuga propia, es **la fuente de la basura** que muere en la etapa 2. Se arregla aguas arriba.

## Etapa 2 · Confirmación · 🔴 FUGA PRE-RED
- **Qué pasa:** la orden pasa de `PENDIENTE CONFIRMACION → PENDIENTE` (se valida dirección, teléfono, producto). `[DATO: dossier §05]`
- **Datos clave:**
  - **~840K órdenes SHOP mueren aquí** (18% de las que entran a confirmación cancela). MANUAL solo 5,6%. `[DATO: dossier §22]`
  - **El 53% del "por qué murió" es ciego:** 428K con motivo "otros"/"sin nota". `[DATO: tema 18 §4]`
  - Es **binario, no de velocidad:** confirmar en 2h o en 48h da ~96% de guía; **no confirmar = 0% guía, 51% cancela.** `[DATO: dossier §20, H7]`
- **Pieza:** Core (confirmación) · ChateaPro (auto-confirmación WhatsApp).
- **Palanca:** **instrumentar el motivo** (catálogo cerrado y obligatorio) — no se rescata lo que no se sabe por qué murió → luego auto-confirmar SHOP. `[proyecto: PRM-1497 / movilización]`
- **Veredicto [SÍNTESIS]:** la fuga **más barata de atacar** (Userpilot/flujo) y la que **desbloquea** la medición del resto. Candidata #1 de discovery.

## Etapa 3 · Preparación · 🟢 SANO
- **Qué pasa:** guía, impresión, picking, packing. `[DATO]`
- **Dato:** pierde ~13K órdenes (mínimo). Guía→preparado ~3,5h. `[DATO: dossier §13·§15]`
- **Pieza:** StockPro (WMS) · EcomScanner (picking).
- **Veredicto:** no tocar — funciona.

## Etapa 4 · Handoff / Movilización · 🟢 SANO (el foso)
- **Qué pasa:** el paquete entra de verdad a la red del carrier (salto capa 3→4). `[DATO: tema 03]`
- **Dato:** pierde ~968 órdenes (casi nada). Total operativo Dropi guía→handoff **~10h**; entregado a transportadora cumple 24h el **99,5%**. `[DATO: dossier §15 + Monitor]`
- **Pieza:** EcomScanner · StockPro.
- **Veredicto [SÍNTESIS]:** **este es el foso de Dropi** — rápido y confiable. El KPI de "tiempo hasta transportadora" se cumple aquí. No es zona de roadmap; es la fortaleza a defender.

## Etapa 5 · Entrega (red + novedad) · 🔴 FUGA POST-RED
- **Qué pasa:** el carrier mueve, reparte, gestiona novedades. `[DATO]`
- **Datos clave:**
  - **26% de lo movilizado se devuelve** (abril); concentrado en MX/AR/GT; CO más sano. `[DATO: tema 18 §2.3]`
  - **El primer intento decide:** 72–99% al 1er intento → 10–42% al reintentar. Reintentar gestiona el fracaso, no recupera. `[DATO: dossier §16]`
  - **Dentro de la misma zona, el carrier cambia la devolución 20–27 pts** (Antioquia: ENVIA 16% vs INTER 43%). `[DATO: tema 18 §10.7]`
  - Tiempo: primer ofrecimiento 46,8h, entrega final 65,2h — el **cuello real** (carrier, no Dropi). `[DATO: Monitor]`
- **Pieza:** CAS (contacto) · ChateaPro · Veloces (última milla propia).
- **Palanca:** **carrier correcto por zona** (Selección de Transportadoras PRM-1513) + blindar el 1er intento. `[proyecto: PRM-1513, PRM-1523]`
- **Veredicto [SÍNTESIS]:** fuga grande pero **más cara** (depende de carriers y build). ⚠️ Falta el export de **motivo de cierre** para confirmar si el carrier es *causa* o le toca *peor zona* (hoy es inferencia).

## Etapa 6 · Postventa / Devolución · 🔴 HUECO DE DUEÑO
- **Qué pasa:** la novedad se "resuelve" (casi siempre hacia devolución); recompra/garantía. `[DATO]`
- **Datos clave:**
  - **`solved_by_logistic = 0`** siempre — **nadie de Dropi toca la novedad.** `[DATO: dossier §17]`
  - "Solucionado" es humo: recuperación real **<5%**; la "solución" más común es *devolver al remitente*. `[DATO: dossier §17]`
  - Triaje posible: "rehúsa recibir" (95% devuelve → soltar) vs "no encuentra destinatario" (55% recupera → pelear). `[DATO: tema 04]`
- **Pieza:** CAS · garantías · EcomScanner (recepción devolución) · Atom (auditoría).
- **Palanca:** poner **dueño Dropi + triaje** a la novedad (PRM-1512, a FINALIZAR). `[proyecto: PRM-1512]`
- **Veredicto [SÍNTESIS]:** no es fuga de volumen — es **hueco de gestión**. Barato de encuadrar (proceso + dueño), alto retorno en las recuperables.

---

## Síntesis — cómo se prioriza con este mapa `[SÍNTESIS]`
> **El KR = entrega sobre CREADAS ≥70%** (Juan, 01-jul). Hoy la entrega neta s/creadas es **~59%** (≈ este mapa: 100% − no-mov − devolución). O sea el KR está **~11 pts debajo**, y esos 11 pts sólo salen de las dos etapas rojas. Baseline y meta en [primera-medicion-kpis-y-meta.md](primera-medicion-kpis-y-meta.md).

1. **Defiende el foso** (etapas 3–4): Dropi ya es rápido y confiable ahí. No invertir roadmap.
2. **Arranca por Confirmación** (etapa 2): la fuga más grande antes de la red, la más barata, no depende de carriers. Instrumentar el motivo → desbloquea todo.
3. **En paralelo, Entrega** (etapa 5): carrier×zona (PRM-1513, ya en Delivery Backlog EJECUTAR) — mayor palanca de devolución, pero pide el export de motivo de cierre para confirmar causa.
4. **Encuadra Postventa** (etapa 6): dueño + triaje de novedad (PRM-1512, FINALIZAR) — barato, alto retorno.
5. **Creación** (etapa 1) se resuelve aguas arriba de la 2 (forzar validación en SHOP).

> **La frase para Maria:** *"De las 6 etapas de la orden, Dropi ya es excelente en preparación y handoff. La sangría está en confirmación (antes de la red) y en entrega/devolución (después). Arranco por confirmación —lo más grande y barato, hoy ciego— y en paralelo empujo carrier×zona, que ya está en el Delivery Backlog."*

## Trazabilidad
| Capa | Doc |
|---|---|
| Este mapa (etapas × data) | este archivo |
| Visión por perfil · madurez · pieza | [vision-producto-logistico.md](vision-producto-logistico.md) |
| OKR → proyecto → aporte | [roadmap-okr-impacto.md](roadmap-okr-impacto.md) |
| Fugas medidas (solo hechos) | [roadmap-okr-impacto §8](roadmap-okr-impacto.md) |
| Baseline de los KPIs + meta | [primera-medicion-kpis-y-meta.md](primera-medicion-kpis-y-meta.md) |

## Changelog
- **2026-07-01** — v1. Mapa de las 6 etapas de la orden con tamaño de fuga por etapa (data abril) + veredicto de salud + palanca. Complementa la visión por 3 lentes.
