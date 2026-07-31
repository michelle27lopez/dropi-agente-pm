# Metodología — Discovery y categorización de proyectos (logística como producto + PLG)

> **El playbook del proceso.** Cómo convertir una idea/proyecto de la célula (PRM) en discovery
> accionable: **categorizar → árbol de problemas → rutas → experimentos → data requerida → métrica/PQL**.
> No re-explica los marcos; los **conecta**. Marcos base:
> `product-logistics.md` (filtro de la ORDEN: §2 cadena · §3 NSM · §4.2 fugas con data · §4.4 PLG · §4.5 priorización · §5 DoR · §6 DoD) ·
> `spec-driven.md` (la LEY: estado+fuente) · `conocimiento/temas/05` (H1-H8, palancas, plan) · `13/14/15` (cadena de valor, portfolio, PLG).

## 0 · Por qué este proceso
La unidad de valor es **la ORDEN** y el motor es el **consumidor final**. Dropi es **PLG por diseño**.
Por eso no priorizamos "features": ordenamos el trabajo por **qué etapa de la cadena fortalece, para qué
perfil, qué fuga cierra y qué pilar PLG activa** (filtro `product-logistics §4.5`). Este playbook hace
que **toda idea pase por el mismo embudo** y quede trazable en el repo.

## 1 · Paso 0 — Categorización (las etiquetas de cada proyecto/idea)

> ⭐ **CRITERIO QUE DEFINE EL ROADMAP DE LOGÍSTICA (decisión de Juan, 24-jun):** el roadmap se ordena
> por **la ORDEN — sus beneficios y su impacto. Logística es el dueño de la orden.** Por lo tanto un
> proyecto entra al roadmap de logística **por CONTENIDO** (¿toca el ciclo de la orden? ¿mejora un
> beneficio o el impacto sobre la orden?), **NO por el campo Célula/Dominio de Jira**. Esos campos
> describen, no deciden: una idea etiquetada en Backoffice/Seller/Data que toca la orden **sí es del
> roadmap de logística** (resuelve la decisión abierta del audit; ej. PRM-1082 "Cierre diario").
> **Test:** *¿este proyecto cambia cómo la orden se crea/confirma/prepara/moviliza/entrega, o el valor que captura?* Si sí → es logística.
>
> ⚠️ **Matiz (Juan, 25-jun) — Backoffice NO es error de clasificación:** el criterio "dueño de la orden"
> **no** significa absorber todo lo que toca la orden. **CAS, garantías y lo financiero/conciliaciones son
> operación y SOPORTE legítimos de Backoffice y está bien que vivan ahí.** En particular **CAS = el canal de
> atención/soporte** (de transportadoras hacia usuarios) + mucho trabajo **financiero y de conciliaciones**;
> garantías = posventa operativa. Son *operación de la orden*, no *producto-logística de la orden*. Distinguir:
> **producto** (cambia el diseño/flujo/valor de la orden → roadmap de logística) vs **operación/soporte**
> (atiende casos, concilia plata, gestiona garantías → Backoffice). Por eso PRM-1294 (garantías),
> PRM-1386/1471/1473 (activación CAS), PRM-1268 (métricas CAS), PRM-1283/1209 (conciliaciones/retiros)
> **se quedan en Backoffice**. PRM-1082 (Cierre diario) **también se queda** (decisión de Juan 25-jun),
> aunque por contenido toque SLA. El único reclasificado por no-Backoffice: PRM-597 (ver audit).

Toda idea/proyecto se etiqueta con estas dimensiones (van al tablero `proyectos/_categorizacion.md` y a la cabecera de su `spec.md`):
| Dimensión | Valores |
|---|---|
| **Tipo (Jira)** | Proyecto · Proyecto OKR · Solución · Oportunidad · Idea · Solicitud · Problem roadmap |
| **Célula** | Logistic Success · Ecom · Supplier · Brands · Seller · Data&AI · Fintech · Backoffice |
| **Dominio** | Ecom scanner · Delivers-Transportadoras · CAS · Productos · Logistic · etc. |
| **Etapa de la cadena** | Selección → Confirmación → Preparación → Movilización → Novedad → Desenlace (`product-logistics §2`) |
| **Fuga que ataca** | ① churn pre-red · ② COD fallido/devolución · ③ stock-out · ④ posventa rota (`§4.2` / `temas/14 §F`) |
| **NSM que mueve** | ⬆️ movilización · ⬆️ % entrega · tiempo por fases (`§3`). Si es habilitador, decirlo (Ley 5). |
| **Loop PLG / Momento Ajá** | Adquisición · Activación · Compromiso · Resurrección (`temas/15`) |
| **Etiqueta color** | 🔵 nuevo/estratégico · 🔴 heredado/finalizar · 🟡 OKR · 🟣 KPI |
| **Estado real** | (Jira) + EJECUTAR/FINALIZAR (Delivery Backlog CPO) |

> **Regla de oro:** si una idea no se puede ubicar en etapa+fuga+NSM, **no se puede medir → no se prioriza** (`§4.5`).

## 2 · Paso 1 — Árbol de problemas (problema raíz, no síntoma)
- **Problema raíz** → ramas (causas) → **oportunidades** (dónde intervenir). Una rama puede salir de un `PROB-xxx` de Jira (Problem roadmap).
- Anclar cada rama a una **fuga** y una **etapa**. Citar **data** que lo respalde (`temas/04`, síntesis §3) — no opinión.
- Vive en `proyectos/<x>/spec.md §1` (y si es grande, sección "árbol de problemas").
- ⭐ **Cómo se traduce a Jira** (cadena OKR→KR→Proyecto OKR→Oportunidad→Insights→Idea→Solución, ejemplo oro de Marcas, el árbol logístico real OKR2/KR2.1, y el modelo multi-país): ver [`arbol-discovery-okr-jira.md`](arbol-discovery-okr-jira.md). Cada **Proyecto OKR = una fuga**; cada **Insight = una hipótesis H1–H8 medida**.

## 3 · Paso 2 — Rutas (hipótesis + palancas)
- Formato hipótesis: **"creemos que [cambio] mueve [NSM] porque [evidencia]"** (`§5 DoR`).
- Cada ruta = una **palanca** sobre una fuga (ver mapa de palancas `temas/05`). Varias rutas compiten → se eligen por impacto×esfuerzo×evidencia.
- Cruzar con **PLG**: ¿qué loop/pilar activa? ¿acerca el Momento Ajá del perfil? (`temas/15`).

## 4 · Paso 3 — Experimentos (priorizados barato→caro)
- Cada ruta se baja a **experimentos** ordenados por costo: medir lo que ya existe → cambio de copy/UX → feature pequeño → build grande. (Ej. catálogo de 6 experimentos en `temas/05`/`11`.)
- Cada experimento: **qué se prueba · métrica · criterio de éxito · esfuerzo · qué fuga/NSM mueve**. Pasa por el **checklist de priorización** (`§4.5` + `temas/15 §K`).
- Preferir **medir el feature vivo** antes de construir (ej. validación de direcciones ya existe → medir, no rehacer).

## 5 · Paso 4 — Data requerida (definición de datos CERRADA antes de UI)
- Por cada hipótesis/experimento: **qué tabla/evento, qué cálculo, línea base, segmentación** (`§5 DoR` · diccionario `temas/10` · modelo `temas/03`).
- Si el dato no existe → primero **instrumentarlo** (ej. motivos de cancelación). "No se rescata lo que no se sabe por qué murió" (`§4.2`).
- Estado del dato: ⚪ por definir · 🟡 definido · 🟢 disponible.

## 6 · Paso 5 — Conversión a métrica / PQL + loop
- Cerrar con: **métrica de éxito atada a NSM**, **PQL por perfil** (`§6 DoD`), y el **loop PLG** que mueve.
- Gate de la compañía: alimenta el **Dropi Score** (Gate 2) — dimensión **Confianza** la nutre este filtro (`estrategia/`).

## 6.1 · Seguimiento y métricas (Following) — ejecución con PD + Data
> El **PM define QUÉ medir**; la **instrumentación y el seguimiento los ejecutan los Product Designers
> (Michel Pino · Laura Torres) + Data**. Es la fase **"Following y lanzamiento"** del doc E2E. ⚠️ El **cómo
> operativo se alinea con Michel Pino** (qué se instrumenta por feature + plantilla de seguimiento).

**3 tipos de evento a instrumentar (antes de definir métricas):**
- **Backend** (servidor; ej. orden que cambia de estado) → Data (Miguel Ángel Gutiérrez).
- **Frontend / Userpilot** (clics, flujos completados, uso de una función) → Laura Torres (instrumentación conductual).
- **Data transaccional / Data Warehouse** (retención, recurrencia, cruces de tablas) → Data.

**Marco de métricas = HEART** (Happiness · Engagement · Adoption · Retention · Task success), cruzando tablas del DW + Userpilot. Cada métrica: fuente · responsable · fórmula · criterio de éxito · segmentación.

**Validación cualitativa = micro-surveys SEQ** (Single Ease Question, escala 1-5) + CSAT/NPS (flujos de comunicación → Laura Torres).

**KPIs de producto (siempre):** TTV · Adopción de features · Churn de producto (`product-logistics §4.4`; metas concretas, ej. transportadoras: adopción ≥20% en 4 sem, TTV ≤5 min, churn ≤15%).

**Plan de seguimiento (piloto 12 semanas):** Mes 1 **semanal** (adopción inicial, bugs) · Mes 2 **quincenal** (uso repetido, 1ª SEQ, ajustes) · Mes 3 **mensual** (impacto en negocio, decisión de evolutivos).

**Quién hace qué:**
| Rol | Responsabilidad en Following |
|---|---|
| **PM (Juan)** | define qué medir, métricas de éxito, criterios, lee resultados |
| **PD · UX (Michel Pino)** | que el diseño sea **instrumentable**; ajustes de UX por hallazgos |
| **PD · Rollout (Laura Torres)** | **Userpilot**, onboarding, micro-surveys, estrategia de apertura |
| **Data (Miguel Á. Gutiérrez / Jaime)** | eventos backend + data transaccional + cálculo |

> **Pendiente con Michel Pino:** definir el **cómo ejecutar el seguimiento** (instrumentación por feature + plantilla reusable de métricas/eventos). → product task.

## 7 · Dónde vive cada cosa (arquitectura)
- **Tablero de categorización** (todas las ideas/proyectos con sus etiquetas) → `proyectos/_categorizacion.md`.
- **Discovery por proyecto** (árbol · rutas · experimentos · data) → secciones del `proyectos/<x>/spec.md` (§1 problema, §2 hipótesis/métrica, §4 alcance, §7 datos, + "experimentos").
- **Hallazgos transversales / data** → `conocimiento/` (temas + síntesis).
- **El doc E2E de Drive se genera DESDE el spec** (`spec-driven.md`).

## 8 · Gates (no saltarse)
- **Definition of Ready** (`§5`) antes de UI/dev · **Definition of Done** (`§6`) post-lanzamiento · **estado+fuente** en cada afirmación (`spec-driven.md`) · **no enterrar inconsistencias** (`requisitos-doc-e2e.md`).

## 9 · Flujo resumido (de idea a backlog priorizado)
```
Idea/Proyecto PRM
  → Categorizar (etapa·fuga·NSM·loop·tipo·célula·dominio)
  → Árbol de problemas (raíz + data)
  → Rutas (hipótesis + palanca)
  → Experimentos (barato→caro, filtro §4.5)
  → Data requerida (definición cerrada)
  → Métrica/PQL + loop PLG  → Dropi Score (Gate 2) → Delivery
  → Seguimiento/Following (PD+Data: Userpilot · HEART · SEQ · plan 12 sem)  → iterar
```
