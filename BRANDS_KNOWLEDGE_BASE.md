# Base de Conocimiento — Proyecto Data_Brands

> Referencia de consulta sobre el ecosistema Marcas/Emprendedores en Dropi. Consolida el framework y las métricas vigentes para que cualquiera del equipo (o un chat nuevo) entienda el negocio sin releer todo el historial de conversación.
>
> **Relación con `CLAUDE.md`:** `CLAUDE.md` es la fuente de reglas obligatorias que el agente debe seguir siempre (anti-alucinación, definiciones exactas, formatos de salida). Este documento es su espejo en modo consulta — mismo contenido de framework y métricas, organizado para lectura humana y onboarding. Si alguna vez se desalinean, **`CLAUDE.md` manda** y este archivo debe corregirse para igualarlo.
>
> Última sincronización con `CLAUDE.md`: 2026-07-20.

---

## Índice

1. [Identidad del rol Marcas](#1-identidad-del-rol-marcas)
2. [Deuda técnica de plataforma](#2-deuda-técnica-de-plataforma)
3. [Comportamiento algorítmico](#3-comportamiento-algorítmico)
4. [Categorías del ecosistema](#4-categorías-del-ecosistema)
5. [Dos lentes de análisis](#5-dos-lentes-de-análisis)
6. [Funnel, palancas y loops](#6-funnel-palancas-y-loops)
7. [Churn y `tipo_activo_churn`](#7-churn-y-tipo_activo_churn)
8. [Madurez operativa](#8-madurez-operativa-jun-2026)
9. [Métricas clave](#9-métricas-clave)
10. [Activación: bruta vs. neta](#10-activación-bruta-vs-neta)
11. [Retención y churn mensual 2026](#11-retención-y-churn-mensual-2026)
12. [Hallazgos de Discovery](#12-hallazgos-de-discovery-encuesta-activación-mar–may-2026)
13. [Grounding técnico](#13-grounding-técnico)
14. [Proyectos activos](#14-proyectos-activos)
15. [Equipo](#15-equipo)
16. [Riesgos activos](#16-riesgos-activos)
17. [Fuentes de datos](#17-fuentes-de-datos)

---

## 1. Identidad del rol Marcas

**Marca = Emprendedor.** Son exactamente lo mismo en Dropi — el nombre varía según contexto comercial o volumen, no la naturaleza. Ambos tienen inventario propio y despachan sus órdenes directamente a clientes finales. Nunca se refiere a este segmento con lenguaje de "Dropshipper".

## 2. Deuda técnica de plataforma

Marcas/Emprendedores y Proveedores (Suppliers) conviven dentro del **mismo rol técnico** — no existe todavía un perfil separado para cada uno (el proyecto "Perfil Marca Independiente" busca resolver esto, ver [§14](#14-proyectos-activos)). Lo que distingue a una Marca de un Supplier no es el rol técnico, es el **comportamiento de sus órdenes**.

- **Supplier puro:** pone su catálogo a disposición de Dropshippers, no genera órdenes propias hacia clientes finales.
- **Marca/Emprendedor:** tiene negocio propio, despacha directo a sus clientes. Puede además abrir su catálogo al dropshipping sin dejar de ser Marca (comportamiento híbrido).

**Grounding técnico:**
- `orders.user_id` = quien vende; `orders.supplier_id` = quien provee. Si `user_id = supplier_id` → operación propia (marca).
- `users.role_id`: Dropshipper(2) / Supplier(3) — **excepción Argentina**: 3=Dropshipper, 4=Supplier.

## 3. Comportamiento algorítmico

Calculado **lifetime** sobre `status='ENTREGADO'`, a partir de `volumen_propio` (`user_id=supplier_id`), `volumen_externo` y `cantidad_drops_distintos`.

| Valor | Definición |
|---|---|
| **Evidente** | Órdenes únicamente desde su usuario Supplier. Sin Dropshippers asociados. Caso más limpio y predecible. |
| **Estándar** | Solo órdenes propias desde su rol Supplier. Puede tener Dropshippers que venden su catálogo, pero su operación principal son sus propias órdenes. |
| **Oculto** | Recibe órdenes de un solo Dropshipper con inventario oculto (`products.privated_product = true` al 100%). Opera simultáneamente como Supplier y Dropshipper para una sola operación real de marca. |
| **Mayoritariamente Dropshipper** | Recibe más órdenes de Dropshippers externos que las que genera por sí mismo. |
| **Mayoritariamente Supplier** | Genera más órdenes propias que las que recibe de Dropshippers externos. |
| **Marcas Dropshippers** | Gestiona sus propias órdenes y además abre su catálogo al dropshipping. |

Cualquier valor que aparezca en un CSV real y **no esté en esta tabla** se reporta como "no documentado" — nunca se fuerza a encajar en una categoría existente.

**Conteo de órdenes por tipo (regla de medición):**
- Evidente / Estándar / May. Supplier / May. Dropshipper → solo `ordenes_mes_propias`.
- Oculto → `ordenes_mes_propias + ordenes_mes_externas` (sus externas son propias reales disfrazadas).
- Marcas Dropshippers → toda su operación se contabiliza como propia, sin separar fuentes.

## 4. Categorías del ecosistema

**Suman con certeza al vertical Marcas:**
1. **Emprendedores evidentes** (`Evidente`) — todo su volumen suma sin ambigüedad.
2. **Marcas Dropshippers** (`Marcas Dropshippers`) — ya mapeadas en el portafolio comercial; toda su operación cuenta como propia.
3. **Marcas corporativas** (`Evidente/Estándar/May.Dropshipper/May.Supplier`) — mayor estructura y volumen; solo las órdenes propias desde el rol Supplier suman al vertical.

**Con identidad de marca pero operación encubierta:**
4. **Emprendedores ocultos** (`Oculto`) — su volumen puede estar contado en el vertical equivocado. El objetivo al identificarlos **no es moverlos de portafolio**, sino medir su volumen donde corresponde.

**Categorías compartidas — comportamiento mixto (pueden sumar a más de un vertical):**
5. **Emprendedores nativos** (todos los tipos) — distintos estadios de evolución, comportamiento emprendedor activo.
6. **Emprendedores mayoritariamente Dropshipper** (`Mayoritariamente Dropshipper`).
7. **Emprendedores mayoritariamente Supplier** (`Mayoritariamente Supplier`).

## 5. Dos lentes de análisis

### Lente 1 — Portafolio comercial de Marcas
*Cumplimiento, gestión comercial, contribución a la meta de 600.000 órdenes mensuales.*

El portafolio se conforma **únicamente** por usuarios asignados a los ID comerciales **71445 o 21553**. `11445` no existe en data (error histórico, no usar). La comunidad BRANDS (ID 410) **ya no es camino alterno de entrada** al portafolio (regla cerrada 2026-07-17) — solo el ID comercial define pertenencia.

Se usa cuando Kate pregunta por: cumplimiento de meta, comportamiento del portafolio, usuarios con comercial asignado, comunidad Brands, gestión comercial.

### Lente 2 — Ecosistema emprendedor completo
*Análisis holístico, mapeo de oportunidades, visión estratégica.*

Incluye todos los usuarios con comportamiento de marca/emprendedor, estén o no gestionados por el equipo de Marcas: portafolio Brands, emprendedores gestionados por otros portafolios, emprendedores ocultos, usuarios híbridos, emprendedores huérfanos. No se trata de disputar gestión comercial, sino de identificar emprendedores sub-acompañados u orgánicos y encontrar oportunidades de crecimiento. La meta de 600K es referencia de dirección, no único criterio.

**Huérfano (regla actualizada 2026-07-17):** usuario que **no está en la unión de comercial_id 71445 o 21553**. La comunidad BRANDS 410 ya no protege de esta categoría. Si además tiene órdenes propias registradas → oportunidad de gestión pendiente de asignar.

Se usa cuando Kate pregunta por: ecosistema general, comportamiento algorítmico, oportunidades no capturadas, usuarios huérfanos, participación real del rol Marcas, visión holística.

**Regla de aplicación:** portafolio/comercial/meta/cumplimiento → Lente 1. Ecosistema/comportamiento/oportunidad/mapeo/visión general → Lente 2. Si no está claro, aplicar ambos y señalar la diferencia. Nunca contaminar Lente 2 con sesgo de cumplimiento de Lente 1.

## 6. Funnel, palancas y loops

Tres preguntas distintas, no intercambiables:

- **Funnel** — "¿dónde está la marca?". Estructura fija ya definida:
  ```
  Adquisición → Activación → Retención → Resurrección
                                      ↑
                            Churn = sale del ciclo
  ```
  La Expansión ocurre dentro de Retención, medida vía progresión entre niveles de madurez (ver [§8](#8-madurez-operativa-jun-2026)).

- **Palancas de crecimiento** — "¿dónde conviene empujar?". NO están predefinidas: se descubren en cada análisis comparando volumen e impacto entre segmentos. Nunca se prescriben de antemano.

- **Growth loops** — "¿qué se repite solo, sin adquirir usuarios nuevos?". Se confirman solo con evidencia de repetición en más de un periodo. Un hallazgo puntual es hipótesis, no loop.

## 7. Churn y `tipo_activo_churn`

Definición vigente de churn (solo nivel mensual): **M0 = 0 órdenes, habiendo tenido M-1 > 0 órdenes** → estado `En riesgo`. El estado `Perdido` (dos meses consecutivos sin ventas) existe en la data pero **no está incorporado a las métricas activas** — no usar como churn sin confirmar con Kate.

| Estado | Definición | Mapeo al funnel |
|---|---|---|
| **Nuevo activado** | Registrado y con ventas durante el mes evaluado | Activación |
| **Recurrente** | Ventas en el mes evaluado y en el anterior | Retención |
| **Antiguo activado** | Registrado antes del mes evaluado, con ventas en este mes | Retención |
| **Reactivado** | Ventas en el mes evaluado, pero no en el anterior | Resurrección |
| **En riesgo** | Sin ventas en el mes evaluado, pero sí en el anterior | Churn mensual (vigente) |
| **Perdido** | Sin ventas en el mes evaluado ni en el anterior | Abandono (pendiente validar con Kate) |

La columna puede referirse a "Dropshippers" por herencia del rol técnico genérico — se interpreta siempre como "usuarios" o "Marcas".

## 8. Madurez operativa (jun 2026)

**Métrica base: `ordenes_mes_propias` únicamente.** Nunca `ordenes_creadas` (propias + externas) — produce niveles inflados. Ortogonal a `categoria_comportamiento`/`comportamiento_algoritmico`. Base: **3.036 usuarios activos del ecosistema completo** (Lente 2).

| Nivel | Rango propias/mes | Usuarios (L2) | Avg propias/u | Qué necesita |
|---|---|---|---|---|
| **Iniciando** | 1–50 | 1.487u | 13 | Acompañamiento y primeros casos de éxito |
| **Creciendo** | 51–300 | 576u | 135 | Apoyo para crecer — todavía no para escalar |
| **Consolidando** | 301–700 | 153u | 444 | No busca crecer — busca no colapsar con el volumen que tiene |
| **Pre-Escalando** | 701–1.000 | 38u | 827 | Confiabilidad y herramientas robustas |
| **Escalando** | 1.001+ | 87u | 2.765 | Conversaciones de API, integraciones empresariales y acuerdos |

⚠️ Umbrales oficiales: Creciendo = 51–300 (no 51–200). Consolidando = 301–700 (no 201–700).

**Muro crítico:** cruzar 300 propias/mes (entrada a Consolidando) — 73% de Creciendo no lo ha cruzado.
**Dato clave:** 87 usuarios Escalando ≈ 55% de las propias del ecosistema. Perder 1 Escalando (avg 2.765/u) ≈ activar ~213 usuarios Iniciando (avg 13/u).

Siempre aclarar si el universo es los 3.036 activos del ecosistema completo (Lente 2) o un subconjunto (ej. portafolio Marcas, Lente 1). "Activo" no equivale automáticamente a `tipo_activo_churn = Activo` sin confirmarlo con Kate.

## 9. Métricas clave

- **NSM del vertical Marcas: `ordenes_mes_propias`** — única métrica que mide el negocio propio de una Marca (`user_id = supplier_id`). No mezclar con `ordenes_creadas` (total) ni `ordenes_mes_externas`.
- Órdenes totales plataforma: **1.798.254**
- Órdenes rol Supplier: **369.281** (~20,5% del total)
- Promedio mensual 2026 del vertical Marcas: no ha superado las **220.000** órdenes
- Baseline de Marcas: pendiente de depurar — puede estar contaminado con órdenes de cuentas híbridas
- Meta: **600.000** órdenes mensuales

## 10. Activación: bruta vs. neta

- **Activación bruta (TTFO):** primera orden generada. Indica que el usuario superó la barrera inicial.
- **Activación neta (TTV):** primera orden entregada con flujo completo. Indica que experimentó el valor real de la plataforma — predice retención.

La brecha bruta/neta es crítica: una marca puede crear una orden (bruta) sin completarla nunca (neta). Siempre distinguir explícitamente ambas.

| Métrica | Promedio 2026 | Mediana 2026 | Meta |
|---|---|---|---|
| **TTFO (bruta)** | 20 días | 11 días | 7 días |
| **TTV (neta)** | 24 días | 15 días | 7 días |

## 11. Retención y churn mensual 2026

| Mes | Retención | Churn |
|---|---|---|
| Enero | 83,8% | 16,2% |
| Febrero | 89,0% | 11,0% |
| Marzo | 88,6% | 11,4% |
| Abril | 86,1% | 13,9% |
| Mayo | 88,3% | 11,7% |
| Junio | 84,0% | 16,0% |

⚠️ El churn de junio volvió al nivel de enero — señal de alerta activa. Cruzar con data de activación.

## 12. Hallazgos de Discovery (encuesta activación mar–may 2026)

Insights válidos, tratar como **hipótesis a profundizar**, no como certezas:

- 88,5% de los registros de marcas nunca generó una orden.
- Solo ~4,4% logró activación neta (3+ órdenes con recurrencia).
- El churn parece ser falla de activación, no de retención — la mediana de órdenes de una marca churneada es casi cero.
- Ninguna marca reportó haber activado usando Academy o soporte oficial — todas mencionaron ayuda de un contacto externo.
- Quienes activan entre días 8–14 generan volumen desproporcionado (ventana ampliada de 7 a 14 días).
- Segmento de mayor palanca aparente: usuarios con experiencia previa y volumen medio.
- Churn acelerado por cohortes: 72 marcas salieron hace 6–12 meses → 106 hace 3–6 meses → 140 en los últimos 3 meses.

## 13. Grounding técnico

- **Pivote `actor_id`:** 9 cuentas operan como marca comprando como dropshipper (`user_id`), no proveyendo:
  ```sql
  CASE WHEN o.user_id IN (101,3674,9825,103785,103655,824542,813339,630237,568948)
       THEN o.user_id ELSE o.supplier_id END AS actor_id
  ```
- **Comunidad Brands:** `public.user_communities`, en CO `community_id = 410` = "Emprendedores comunidad brands".
- **Marca blanca:** `users.white_brand_id` — Dropi = 1 en todos los países excepto **Chile = 4**.
- **Estados de orden para "venta materializada":** `ENTREGADO`, `DEVOLUCION`, `DEVUELTA`, `ENTREGADO A REMITENTE`, `RECIBIDO POR DROPI`, `DEVOLUCION A REMITENTE`. Para éxito financiero/LTV: solo `ENTREGADO`.
- **Nunca usar vistas precalculadas** (`growth.mv_user_master_profile` u otras del esquema `growth`/`master_profile`) — todo perfilamiento se calcula al vuelo sobre `public`.
- `fact_marcas.csv` y `dim_marcas.csv` son la fuente de verdad. Entrega semanal, lectura incremental — nunca asumir que se tiene la última versión.

## 14. Proyectos activos

- **Perfil Marca Independiente:** resolver la deuda técnica de [§2](#2-deuda-técnica-de-plataforma) creando un perfil dedicado para Marcas, separado del perfil Proveedor. 6 módulos: Registro, Home, Dashboard "Mis ventas", Productos, Creación de órdenes, Academy. UX/UI completado, en desarrollo por fases.
- **Pipeline CRM de activación (GHL):** GoHighLevel recibe datos de UserPilot y script Python de Miguel Ángel. Calcula TTV y dispara outreach comercial. Blocker activo: `user_id` backend ≠ `user_id` UserPilot (José Giraldo).
- **Encuesta CSAT in-app:** escala 1–5 por segmento conductual vía UserPilot. Nunca usar la palabra "retención" en el copy — enmarcar como mapeo de producto.
- **Expansión México:** Meta Ads julio–agosto 2026. El funnel de activación debe estar listo antes del lanzamiento.

## 15. Equipo

| Nombre | Rol |
|---|---|
| **Kate** | PM, Célula Brands Success (usuario principal de este agente) |
| **María Ossa** | CPO, aprueba decisiones mayores |
| **Francisco Velandia (Fran)** | Product Designer |
| **Michelle** | UX Research |
| **Miguel Ángel** | Data/Analytics (Power BI, Python) |
| **Enrique (Kique)** | Growth/CRM (GoHighLevel) |
| **José Giraldo** | Tech Lead |
| **Laura Contreras** | Team lead, admin UserPilot |
| **Carol Cortés y Vanessa** | KAM / comercial marcas |
| **Mayra Ramírez** | Comercial segmento alto volumen |

## 16. Riesgos activos

- Un usuario con comportamiento mixto puede sumar a más de un vertical al mismo tiempo — nunca asumir que todo su volumen es de Marcas.
- El Emprendedor Oculto y los híbridos (May. Dropshipper / May. Supplier) pueden estar contados en el vertical equivocado. Identificarlos no los convierte en emprendedores — ya lo son.
- El baseline de Marcas puede estar contaminado con órdenes de otros verticales — no presentar cifras sin verificar la fuente de cada orden.
- La pérdida de una marca de alto volumen no se compensa con nuevos usuarios de bajo volumen.
- Hay marcas/emprendedores operando de forma huérfana — sin gestión comercial. Son oportunidad, no usuarios ajenos.
- Los hallazgos de la encuesta de Discovery son insights, no certezas — deben validarse antes de convertirse en decisiones de producto.
- El churn de junio 2026 volvió al nivel de enero — señal de alerta activa.
- La definición vigente de churn es solo mensual (`En riesgo`). `Perdido` existe en la data pero no está incorporado a las métricas activas.
- Cada orden fallida genera doble pérdida para Dropi: revenue de logística + revenue de fulfillment.
- Ninguna palanca o loop se presenta como confirmado sin evidencia de repetición en más de un periodo.

## 17. Fuentes de datos

- `agente-delivery/Documentos/fact_marcas.csv` — histórico mensual por usuario (fuente de verdad, incluye `tipo_activo_churn`).
- `agente-delivery/Documentos/dim_marcas.csv` — perfil estático por usuario.
- Entrega **semanal**, lectura **incremental** — pedir explícitamente si no están disponibles en la conversación antes de responder algo que dependa de ellos.
- Historial de análisis y entregables generados a partir de estos CSV vive en `agente-delivery/Documentos/*.html` (cell boards, ecosistema, oportunidades, cronogramas, etc.) y no se duplica aquí.
