# 17 · Tiempo de ciclo de la orden — qué se puede implementar

> **Para qué:** catálogo de **productos/experimentos que nacen de leer el TIEMPO de la orden**, no de
> features sueltas. El tiempo es la data menos explotada y la que más "ver más allá" da: `q18` y los
> `Order.date_*` ya existen → se puede construir sin instrumentación nueva.
> Fuente: `temas/04` (tiempos por tramo) · `temas/10` (q18, date_*) · `temas/03` (cómo medir). 25-jun-2026.
> Cadena/keystone bajada a spec: `proyectos/torre-control-tiempo-fases/spec.md`.

## TL;DR
- Dropi es **rápido** (~10h interno) y el **carrier es el cuello** (red→entrega P50 48-73h, P90 5-8 días).
- El tiempo muerto es **invisible**: 266K confirmó-sin-guía + cola larga, sin que nadie las toque (`solved_by_logistic=0`).
- Hilo común = un **"reloj de la orden"** que mide cada fase contra su P50/P90 y **actúa antes** de la novedad.

## Catálogo por fase del ciclo
| Fase del ciclo | Tiempo conocido | Implementación candidata | Fuga / NSM | Costo |
|---|---|---|---|---|
| Creación→Confirmación | SHOP sin validar muere pre-red | **Reloj de confirmación**: nudge/auto-confirmación si pasa X h | ① movilización | barato |
| Confirmación→Guía | **266K "confirmó sin guía"** estancadas | **Detector de órdenes estancadas** → auto-guía / alerta | ① movilización | barato-medio |
| Guía→Handoff | Dropi ~10h (meta **≤24h**) | **Torre de control interna**: SLA por bodega, alerta si excede | KPI semestre | medio |
| Handoff→Reparto | carrier cuello (P50 48-73h) | **ETA predictivo** (q18 + ruta) visible a seller **y comprador final** | ② entrega · Trust Agent | medio |
| Reparto→Desenlace | cola P90 5-8 días; 1er intento decide | **Escalamiento de outliers** + gate de no-reintento | ②④ | medio |
| Transversal | q18 = tiempos por transición × carrier | **Carrier scoring por tiempo×ruta** → alimenta selección (PRM-1513) | ② entrega | medio |

> **Ojo (Juan, 25-jun):** la **Torre de control / Tiempo por fases** es **instrumentación/habilitador bajo KR2.1**,
> NO el centro del roadmap (el centro son los OKR). Es la base *técnica* de las demás implementaciones de tiempo,
> pero sirve a las fugas; no es la apuesta principal. Cadena en `proyectos/torre-control-tiempo-fases/spec.md`.

## Por qué esto es "ver más allá"
- **De histórico a forward:** hoy la data es mes-cerrado; el reloj convierte el tiempo en **predicción y acción** (ETA, alertas), no autopsia.
- **Toca el consumidor final:** el ETA visible al comprador es el primer producto del eje *Trust Agent* (tema 13) que hoy no medimos.
- **Multi-país nativo:** los umbrales P50/P90 se **parametrizan por país/ruta** (modelo de `metodologia/arbol-discovery-okr-jira §6`); el KR se mide por país.

## Qué falta para activarlo (data)
- ⏳ **Baseline de tiempo por fase F1–F5** — queries listos, pendientes del export de Data (`temas/03`).
- **Homologar estados intermedios del carrier** (F4/F5; `non_homologate_status`, Servientrega).
- Lo demás (`q18`, `date_*`, `Historyorder`) **ya está disponible**.

## Conexión con metodología
- Cada implementación = una rama del árbol bajo KR2.1 / KPI del semestre (`metodologia/arbol-discovery-okr-jira`).
- Prioridad por Dropi Score, secuencia instrumentar→construir (`estrategia/direccion-celula-norte-e-impacto §5`).
