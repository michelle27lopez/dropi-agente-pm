---
name: project-data-marcas
description: Contexto del proyecto Data_Brands — análisis ecosistema Marcas/Emprendedores en Dropi. PM: Kate (Célula Brands Success). Contexto actualizado con dos lentes de análisis.
metadata:
  type: project
---

## Identidad del rol Marcas en Dropi

Marca = Emprendedor. Son exactamente lo mismo. El nombre varía por contexto comercial o volumen. Tienen inventario propio y despachan sus órdenes directamente a clientes finales. NO son categorías distintas.

Dropi tiene deuda técnica: Marcas y Suppliers conviven en el mismo rol técnico. Lo que diferencia a una Marca de un Supplier es el comportamiento de sus órdenes, no el rol técnico.

## Comportamiento algorítmico — definiciones validadas

- **Evidente**: órdenes solo desde su usuario Supplier. Caso más limpio.
- **Estándar**: órdenes propias desde rol Supplier. Puede tener Dropshippers en su catálogo.
- **Oculto**: recibe órdenes de UN SOLO Dropshipper con inventario oculto. Usa Supplier + Dropshipper para una sola operación real de marca. Son invisibles hasta identificarse.
- **Mayoritariamente Dropshipper**: recibe más órdenes de Dropshippers externos que las que genera él mismo.
- **Mayoritariamente Supplier**: genera más órdenes propias que las que recibe de Dropshippers.

## Categorías de comportamiento

**Suman con certeza al vertical Marcas:**
1. Emprendedores evidentes (alg: Evidente)
2. Marcas Dropshippers (alg: Marcas Dropshippers) — solo órdenes propias
3. Marcas corporativas (alg: Evidente/Estándar/May.Drop/May.Sup) — solo órdenes propias

**Identidad Marca con operación encubierta:**
4. Emprendedores ocultos (alg: Oculto) — su volumen puede estar contado en vertical equivocado

**Comportamiento mixto (pueden sumar a más de un vertical):**
5. Emprendedores nativos (alg: todos los tipos) — impactados por cualquier iniciativa de producto
6. Emprendedores mayoritariamente Dropshipper (alg: May. Dropshipper)
7. Emprendedores mayoritariamente Supplier (alg: May. Supplier)

## DOS LENTES DE ANÁLISIS — regla de aplicación

### Lente 1 — Portafolio Comercial de Marcas
Para: cumplimiento de meta, gestión comercial, retención, activación, churn del portafolio.
Activa cuando Kate mencione: portafolio, comercial, meta, cumplimiento.

**Filtro del portafolio (el comercial_id PREVALECE sobre la comunidad):**
- Usuarios con comercial_id **71445** o **21553** → SIEMPRE en portafolio
- PLUS: usuarios de comunidad BRANDS ID 410 SIN esos dos comerciales → también en portafolio
- Usuarios de comunidad 410 con OTRO comercial diferente → también en portafolio (pueden venir de períodos anteriores)

✅ Confirmado por Kate: el ID correcto es 71445 (no 11445).

### Lente 2 — Ecosistema Emprendedor Completo
Para: oportunidades no capturadas, comportamiento algorítmico, visión holística, huérfanos.
Activa cuando Kate mencione: ecosistema, comportamiento, oportunidad, mapeo, visión general.

Incluye TODO el universo con comportamiento de Marca: portafolio + otros portafolios + ocultos + huérfanos.

**PRINCIPIO CLAVE**: no quitar usuarios de otros portafolios — identificar emprendedores sub-acompañados y encontrar oportunidades para que crezcan.

## Métricas clave (referencias del contexto de Kate)

- Meta NSM: 600.000 órdenes/mes
- Promedio mensual 2026 vertical Marcas: no ha superado 220.000 (según contexto Kate)
- Total órdenes plataforma: 1.798.254
- Órdenes rol Supplier: 369.281 (~20.5%)
- TTFO: promedio 20 días, mediana 11 días (contexto Kate) — dato CSV: mediana 13 días
- TTV: promedio 24 días, mediana 15 días (contexto Kate) — dato CSV: mediana 18 días
- 88.5% de registros de Marcas nunca generó una orden

## Retención mensual 2026 (del contexto Kate)

| Mes | Retención | Churn |
|---|---|---|
| Enero | 83.8% | 16.2% |
| Febrero | 89.0% | 11.0% |
| Marzo | 88.6% | 11.4% |
| Abril | 86.1% | 13.9% |
| Mayo | 88.3% | 11.7% |
| Junio | — | — |

Nota: análisis de junio no realizado aún. No incluir junio en métricas ni hallazgos.

## Segmentación operativa

- Iniciando: 0–50 órdenes/mes
- Consolidando: 51–1.000 órdenes/mes
- Escalando: 1.000+ órdenes/mes

## Proyectos activos

- **Perfil Marca Independiente**: 6 módulos, UX/UI listo, en desarrollo.
- **Pipeline CRM GHL**: bloqueado por mismatch user_id backend ≠ UserPilot (José Giraldo).
- **Encuesta CSAT in-app**: UserPilot, escala 1–5. No usar "retención" en copy.
- **Expansión México**: Meta Ads jul–ago 2026. Funnel de activación debe estar listo antes.

## Riesgos activos

- Usuarios mixtos pueden sumar a más de un vertical simultáneamente.
- Emprendedores Ocultos e híbridos pueden estar contados en el vertical equivocado.
- Baseline Marcas puede estar contaminado — no presentar sin verificar fuente.
- Pérdida de Marca alto volumen no se compensa con nuevos usuarios de bajo volumen.
- Churn junio 2026 en alerta activa.
- Definiciones de estados y churn → validar con columna tipo_activo_churn del CSV.
- Cada orden fallida = doble pérdida (logística + fulfillment).

## Equipo

Kate (PM), María Ossa (CPO), Fran (Design), Michelle (UX Research), Miguel Ángel (Data/Power BI/Python), Kike (Growth/CRM/GHL), José Giraldo (Tech Lead — blocker GHL), Laura Contreras (UserPilot), Carol Cortés y Vanessa (KAM), Mayra Ramírez (alto volumen).

## Fuente de datos

CSV locales en `agente-delivery/Documentos/`. Entrega semanal incremental.
- dim_marcas.csv: perfil estático por usuario
- fact_marcas.csv: histórico mensual por usuario

tipo_activo_churn en fact_marcas es la FUENTE DE VERDAD para estados de actividad y churn.
