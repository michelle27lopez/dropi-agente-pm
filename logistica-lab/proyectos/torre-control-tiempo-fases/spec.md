# Spec · Torre de control de la orden / Tiempo de entrega por fases

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.
> Fuente: `figma:` `jira:` `screenshot:` `data:` `reunion:` `doc:` `drive:`.
> Estructura del árbol y cómo cuelga en Jira: `metodologia/arbol-discovery-okr-jira.md`.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista |
| Product Designer | — (por asignar) |
| Célula | Logistics |
| Etapa de la cadena | Transversal (mide F1→F5: Confirmación→Generación→Despacho→Tránsito→Desenlace) |
| Estado global | ⚪ discovery (borrador inicial 25-jun) |
| NSM que mueve | KR2.1 % entrega (indirecto) + **KPI del semestre: tiempo de la orden hasta la transportadora ≤24h** (directo) |
| Última actualización | 2026-06-25 |

## 0 · Resumen y estado global
**Qué es y qué NO es (Juan, 25-jun):** es un proyecto **instrumentación/habilitador bajo KR2.1**, NO el
centro del roadmap (el centro son los OKR). Sirve a las fugas (les dice dónde y cuándo se fuga cada orden);
no las reemplaza. Medir mejor no mueve el KR por sí solo. Hermano de Normalización de estados (PRM-1297).

Proyecto **a crear** que llena un hueco de medición: hoy no existe forma de medir/gestionar el **tiempo de la
orden por fases**, que es el **KPI del semestre**. La idea es un **"reloj de la orden"**: medir cada fase contra
su P50/P90 (con data que ya existe en `q18`) y **actuar antes** de que la orden se caiga (alertas, escalamiento,
ETA). Estado ⚪ discovery: la medición es construible con la data actual, pero falta correr la baseline y homologar los estados intermedios del carrier.

## 1 · Problema raíz
**La orden viaja a ciegas: nadie ve ni actúa sobre el tiempo por fase, así que solo se reacciona cuando la novedad ya ocurrió.**
- El **tiempo muerto es invisible**: 266K órdenes "confirmó sin guía" + cola de entrega P90 133-190h (5-8 días) sin que nadie las toque (atado a `solved_by_logistic=0`).  `[data:tema 04]`
- **No hay baseline de tiempo por fase** → el KPI del semestre (≤24h a transportadora) no se puede dirigir.  `[data:tema 03 · queries listos]`
- El tiempo **gestionable por Dropi** (~10h interno) y el **del carrier** (P50 48-73h, el cuello) están mezclados; no se gestionan distinto.  `[data:tema 04]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** "creemos que **hacer visible y accionable el tiempo por fase** (alertar/escalar al superar su P50/P90) reduce el tiempo a handoff y acorta la cola de entrega, porque hoy las órdenes se estancan sin que nadie intervenga (`solved_by_logistic=0`)".  `[data:tema 04]`
- **Métrica de éxito + línea base:** tiempo por fase F1–F5 · % de órdenes sobre SLA · correlación tiempo×devolución · base = **pendiente de la 1ª corrida**.  `[data:tema 03/10]`
- **NSM:** KPI del semestre **≤24h a transportadora** (directo); KR2.1 % entrega (indirecto, vía acortar la cola y prevenir novedad).

## 3 · Usuarios / actores
- **Dropshipper / marca** — ve el ETA y el estado real de su orden.  `[⚪]`
- **Operación de bodega** — recibe alerta de SLA en riesgo (handoff >24h).  `[⚪]`
- **Carrier Ops (Juan)** — escala outliers sobre el P90 de la ruta.  `[⚪]`
- **Comprador final** — recibe ETA (eje *Trust Agent*).  `[⚪ · tema 13]`

## 4 · Alcance
**Entra (por estado):**
- Medición de tiempo por fase F1–F5 con `q18` + `Order.date_*` + `Historyorder`.  `[🟡 · data:tema 10]`
- Reglas de alerta por umbral (P50/P90 por fase/ruta).  `[⚪]`
- ETA predictivo por orden (a partir de tiempos por transición de `q18`).  `[⚪]`
- Detección de órdenes estancadas (confirmó-sin-guía, cola larga).  `[⚪]`

**No-objetivos (⛔ — explícito):**
- Construir el motor de re-despacho / reintentos (el 1er intento decide; reintentar gestiona el fracaso).  `[⛔ · data:tema 04]`
- Cambiar la operación física del carrier (es su cuello, no el de Dropi).  `[⛔]`

## 5 · Reglas de negocio
- **R1 · Separar reloj Dropi vs reloj carrier:** el SLA interno (≤24h a handoff) se mide y alerta aparte del tiempo en red.  `[🟡 · data:tema 04]`
- **R2 · Umbrales por país/ruta (multi-país):** P50/P90 se **parametrizan** por país y ruta; el KR se reporta por país. El reloj es uno solo.  `[🟡 · metodologia/arbol-discovery-okr-jira §6]`
- **R3 · Acción, no solo dashboard:** cada umbral superado dispara una acción (alerta/escala/nudge), no solo una métrica.  `[⚪]`

## 6 · Criterios de aceptación (Gherkin)
**Módulo: SLA interno**
- **Dado** una orden con guía generada **Cuando** pasan >24h sin handoff a transportadora **Entonces** se alerta a la bodega responsable.
**Módulo: outlier en red**
- **Dado** una orden en red **Cuando** supera el P90 de tiempo de su ruta/carrier **Entonces** se marca para escalamiento a Carrier Ops.

## 7 · Datos (diccionario)
- `q18` (transportadora, estado_anterior→estado_destino, promedio/mediana horas) — **tiempos por transición = núcleo del reloj**.  `[data:tema 10]`
- `Order.date_guia_generada / date_recibido_transportadora / date_en_reparto / date_entregado_o_devuelto / date_pendiente` — fases F1–F5.  `[data:tema 10]`
- `Historyorder` (`status_master_id`, `created_at`) — transiciones reales, no promedios.  `[data:tema 03]`
- **Vacío:** estados intermedios del carrier (F4/F5) sin homologar (`non_homologate_status`, Servientrega).  `[⚪]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| OKR / KR Polaris | OKR2 [PRM-1391] → KR2.1 [PRM-1396] (+ KPI del semestre) |
| Proyecto OKR Polaris | **por crear · NUEVO** (decisión Juan 25-jun: es el general basado en OKR2/KR2.1, no se absorbe en Normalización) |
| Dependencia | **PRM-1297 Normalización de estados** — habilitador/insumo (limpia el lenguaje de estados que la Torre consume); se conecta, no se fusiona |
| Idea/Solución Polaris | por crear (cadena Oportunidad→Idea→Solución de este spec) |
| Proyectos hermanos (cuelgan del tiempo) | ETA · detector de estancadas · carrier scoring por ruta (ver `conocimiento/temas/17`) |
| Código/Repo | — |

## 9 · Preguntas abiertas
- [ ] **Baseline de tiempo por fase** — correr queries F1–F5. responsable: Juan + Data  `[data:tema 03]`
- [ ] **Homologar estados intermedios del carrier** (F4/F5) — responsable: Data + carriers  `[⚪]`
- [ ] **¿El comprador final ve el ETA?** (alcance Trust Agent) — responsable: Juan + Maria Ossa  `[⚪ · tema 13]`
- [ ] **Umbral del KPI:** ≤24h vs ≥24h (el insumo original se contradice) — responsable: Dir. Producto  `[doc:estrategia/]`
- [x] ~~¿Proyecto OKR nuevo o se absorbe en Normalización (PRM-1297)?~~ → **NUEVO** (Juan, 25-jun): es el general basado en el OKR; PRM-1297 queda como dependencia/insumo.

## 10 · Changelog
- 2026-06-25 — Borrador inicial. Cadena Oportunidad→3 Insights→Idea→Solución bajada desde el ángulo "tiempo de ciclo de la orden". Pendiente: aprobar y espejar a Polaris (crear Proyecto OKR + Oportunidad/Idea/Solución).
