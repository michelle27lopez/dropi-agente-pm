# Spec · Dirección confiable con geolocalización del usuario  ·  RAMA DE MUESTRA (flujo end-to-end)

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo. Fuente: `data:` `jira:` `doc:`.
> ⭐ **Rama de MUESTRA del flujo completo** (Juan 25-jun). **Dos hermanas bajo una causa común (la dirección):**
> una **previene** la novedad, la otra **recupera** antes de la devolución. Pensada desde el **comprador final**.
> Modelo del árbol: `metodologia/arbol-discovery-okr-jira.md`. Hermana económica: `proyectos/reduccion-devoluciones-cod/spec.md`.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista (**lidera**; coordina con Katerine/Supplier por solape con PRM-91) |
| Célula | Logistic Success (entra por contenido: toca el ciclo de la orden) |
| Etapa de la cadena | Confirmación → Movilización → Desenlace |
| Fuga | ① churn pre-red (prevención) + ② COD/devolución (recuperación) |
| OKR / KR | OKR2 · **KR2.1 Tasa de entrega ≥70%** |
| Estado global | ⚪ discovery (borrador 25-jun) |
| Última actualización | 2026-06-25 |

## 0 · El flujo end-to-end (causa común, dos hermanas)
```
CAUSA · La dirección textual es ambigua y falta la COORDENADA → el repartidor no encuentra al comprador
        (~161K órdenes/mes con novedad de dirección, devolviendo 58-82%)

├─ HERMANA 1 · PREVENCIÓN (aguas arriba — evitar la novedad)            [fuga ① · movilización]
│    Oportunidad · "La orden se cae porque el repartidor no encuentra una dirección mal escrita"
│    Idea · Capturar la ubicación real del comprador y blindar las direcciones de alto riesgo
│      ├ Sol P1 · Pedir ubicación por WhatsApp/ChatePro en órdenes de dirección riesgosa
│      ├ Sol P2 · Pin en mapa en el flujo de confirmación (el comprador fija dónde está)
│      └ Sol P3 · Score de riesgo de dirección (histórico de "no encontrada" por zona) → dispara P1/P2 solo donde hace falta
│
└─ HERMANA 2 · RECUPERACIÓN (aguas abajo — la novedad ya cayó, antes de devolver)   [fuga ② · devolución]
     Oportunidad · "Cuando cae 'dirección no encontrada' hoy se devuelve a ciegas en vez de reintentar bien"
     Idea · Pedir la ubicación al comprador para un reintento que SÍ llega
       ├ Sol R1 · Al detectar novedad-dirección, disparar petición de ubicación + reprogramar la visita
       └ Sol R2 · Triaje: pelear "no encuentra destinatario" (55% recupera), soltar lo perdido

→ IMPACTO: Alto (161K órdenes, 58-82% devuelven; mueve movilización Y entrega)
→ MÉTRICA: % novedad-dirección · % órdenes con geo capturada · entrega con-geo vs sin-geo · % devolución-dirección
```
> **Lente de usuario (Trust Agent):** en la voz del comprador — *"escribí mi dirección como pude, el repartidor no me
> encontró, y mi pedido se devolvió."* Lo que necesita no es escribir mejor, es decir **dónde está**. Este es el
> primer producto que toca directo al **consumidor final** (el eje "ver más allá"). `[doc:tema 13]`

## 1 · Árbol de problema (la causa, descompuesta)
**Causa raíz:** la dirección de la orden es texto ambiguo y **no hay coordenada**, así que el repartidor no ubica al comprador y la orden se devuelve. `[data:tema 04]`
Motivos de novedad que la componen (history_new_orders, captura 24-jun):
- **Dirección no existe** — 82K, **82% devuelve** 📍 `[data]`
- **No se localiza dirección** — 41K, **58% devuelve** 📍 `[data]`
- **Dirección incompleta** — 39K, **79% devuelve** 📍 `[data]`
- **No encuentra destinatario** — 24K, **55% recupera** (mixto dirección + contactabilidad) → recuperable. `[data]`
> Total causa-dirección **~161K órdenes**. Es prevenible en captura, no gestionable después. `[data:tema 04]`

## 2 · Oportunidades + los 3 Insights (lo que se pega en Polaris)
**Prevención:** "La orden se cae por una dirección que el comprador escribió mal — se previene capturando dónde está, no validando texto."
**Recuperación:** "Cuando ya cayó en novedad de dirección, hoy se devuelve a ciegas en vez de pedir la ubicación y reintentar."

### Insights (compartidos por las dos hermanas)
1. **Dimensionado:** ~161K órdenes con novedad de dirección, **58-82% devuelven** → la causa prevenible más grande. `[data:tema 04]`
2. **El dato que falta es la coordenada, no el validador:** la validación de direcciones **ya existe** (escudo verde, log) pero **geo no es medible** (116 de 7.9M con coordenadas). `[data:tema 11 · H5]`
3. **El primer intento decide:** 72-99% al 1er intento → 10-40% al 2º. Hay que **blindar antes del despacho**; reintentar a ciegas no recupera. `[data:tema 04]`

## 3 · Ideas (las palancas)
- **Idea PREVENCIÓN · Capturar la ubicación del comprador y blindar el alto riesgo** — pin en mapa o ubicación por WhatsApp, adjuntada como coordenada; pedirla solo donde el riesgo lo amerita (sin fricción a todos). `[⚪]`
- **Idea RECUPERACIÓN · Pedir ubicación para un reintento que sí llega** — al caer la novedad de dirección, contactar al comprador por su ubicación y reprogramar, en vez de devolver. `[⚪]`

## 4 · Soluciones (experimentos, barato → caro)
- **P1 · Ubicación por ChatePro (WhatsApp)** en órdenes de dirección riesgosa → adjuntar coordenada. Barato, canal existente. Engancha PRM-1515. `[⚪ · jira:PRM-1515]`
- **P2 · Pin en mapa en confirmación** — el comprador fija su ubicación en el flujo. Medio (UX). `[⚪]`
- **P3 · Score de riesgo de dirección** (histórico de "no encontrada" por zona/dirección) → dispara P1/P2 solo donde hace falta. Engancha PRM-1216 (zonas de riesgo). `[⚪ · jira:PRM-1216]`
- **R1 · Disparo de ubicación al caer la novedad** + reprogramar visita. Barato; cambia el flujo de novedad. `[⚪]`
- **R2 · Triaje de la novedad-dirección** (pelear "no encuentra" 55%, soltar lo perdido) con dueño. `[⚪ · data:tema 05]`
> No-objetivos (⛔): reconstruir el validador de texto (ya existe → forzar/medir, no rehacer); pedir ubicación a TODOS (fricción innecesaria). `[⛔ · data:tema 11]`

## 5 · Impacto (aporte al KR)
**Alto.** 161K órdenes con novedad de dirección, 58-82% devuelven. Prevenir + recuperar parte sube la tasa de entrega (KR2.1) y baja devolución; toca **movilización Y entrega** a la vez. `[data:tema 04]`
> `Aporte a NSM` (al cargar): **Alto · movilización + % entrega · baseline pendiente** (sale de la 1ª medición).

## 6 · Métricas (de éxito + cómo se mide)
- **Éxito:** % de novedad por dirección (base de ~161K) ↓ · % de esas órdenes que terminan en devolución ↓. `[data:tema 04]`
- **Adopción/producto:** % de órdenes (de riesgo) con geo capturada · entrega de órdenes **con geo vs sin geo** (la prueba de causa). `[🟡]`
- **Recuperación:** % de novedades-dirección "peleadas" que terminan entregadas. `[🟡]`
- **Datos:** `history_new_orders` (motivos dirección, `solution`) · `Order` (`is_validated`, `validation_date`, coordenadas, `distribution_company_id`) · `cities` (`trajectory_type`, `delivery_code`). Las novedades ya las tenemos por captura. `[data:tema 10]`

## 7 · Multi-país
La geo es universal. **CO primero**; ChatePro y mapas aplican igual a **MX**. El score de riesgo y los umbrales se parametrizan por país/zona; el KR se mide por país. `[🟡 · arbol-discovery-okr-jira §6]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| OKR / KR | OKR2 [PRM-1391] → KR2.1 [PRM-1396] |
| Proyecto(s) OKR que cruza | Movilización [PRM-1497] (prevención) · Novedades [PRM-1512] · Devoluciones [PRM-1523] (recuperación) |
| Relates / coordinar | **PRM-91** Validador (Supplier/Katerine — coordinar) · PRM-1117/194/1217 validadores · PRM-1216 zonas de riesgo · PRM-1515 ChatePro |
| Oportunidad/Idea/Solución Polaris | **por crear** (cuando se valide el flujo) |

## 9 · Preguntas abiertas
- [ ] **Coordinación con Katerine/Supplier** por el solape con PRM-91 (lideramos nosotros, pero hay que alinear). — Juan + Katerine
- [ ] **¿Cómo se pide la ubicación?** ChatePro/WhatsApp vs pin en app; ¿en confirmación o al despachar? — Juan + Michel Pino
- [ ] **Score de riesgo de dirección:** ¿con qué histórico (zona, dirección repetida, carrier)? — Data
- [ ] **Incentivo/UX del comprador** para compartir ubicación (mensaje, momento, fricción). — Laura Torres
- [ ] **Baseline de novedad-dirección por zona y país** — corrible con `history_new_orders`. — Juan + Data

## 10 · Changelog
- 2026-06-25 — Rama de muestra creada end-to-end como **dos hermanas (prevención + recuperación)** bajo la causa "dirección/geo", centrada en el comprador final. Reemplaza a devoluciones como muestra principal (devoluciones-COD queda como hermana económica). Pendiente: validar formato → replicar; coordinar PRM-91 con Katerine. Cronograma + espejar a Jira = último paso.
