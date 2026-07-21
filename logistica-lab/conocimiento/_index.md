# 🧩 Base de conocimiento — Logística como Producto (Dropi)

> Capa de **conocimiento base**: el saber consolidado sobre logística como producto en
> Dropi (data + marcos conceptuales + PLG). Alimenta `metodologia/product-logistics.md`.
> **3 niveles de lectura:** (1) `sintesis-logistica-producto.md` = ejecutivo · (2) `temas/`
> = notas temáticas estandarizadas · (3) `fuentes/` = originales completos (fuente de verdad).

## 📐 Plantilla estándar (toda nota de `temas/` la sigue)
```
# NN · Título
> Fuente(s) · Tipo · Confianza
## TL;DR            (3-5 bullets)
## Contenido        (estructurado)
## Conexión con metodología / cadena de valor
## Preguntas abiertas / pendientes
```

## 🗂️ Notas temáticas (`temas/`)
| # | Nota | Cubre | Origen |
|---|------|-------|--------|
| 01 | **Ecosistema y actores** (Capítulo 1 / mapa fundacional) | territorios↔células, perfiles, niveles de conciencia, "ecosistema con reglas" | ecosistema...txt + artifact Día 2 |
| 02 | Cadena de valor y portafolio | 7 actividades, fases de la orden, 10 productos, fugas, revenue | Donde-esta-el-valor + maestro |
| 03 | Modelo de datos y estados | tablas, 7 capas, homologación, diamante, reglas de medición | maestro + detalle |
| 04 | Hallazgos de data | funnel, carriers, tiempos, reintentos, novedades, canal/GMV | hallazgos + detalle |
| 05 | **Hipótesis, palancas y plan** ⭐ | H1-H8, mapa de palancas, plan 3 frentes, experimentos, correcciones | dossier |
| 06 | Logística como producto (4 capas) | dimensiones/proceso/features/actor + decisión pendiente | conceptualización.md |
| 07 | PLG | 5 pilares, loops, Momento Ajá, PQL | Donde-esta-el-valor + PDF |
| 08 | MVP Ecom Scanner (métricas) | qué medir de Ecom, 5 familias de métricas | docx |
| 09 | MVP Dashboard interno | flujo normalizado, rutas, vistas, métricas V0 | docx |
| 11 | **Plataforma — módulos y funciones** | inventario de módulos del sidebar + anatomía orden/pedidos + hallazgos UI (validación de dirección ya existe) | capturas 24-jun |
| 12 | **Marca, comunidad y cognición distribuida** (Día 1) | 4 perfiles, 3 niveles de conciencia, colectivos de consumo, cerebro colectivo, 4 loops de growth, mimetismo cultural + propuesta IA-driven | Estudio antropologico.pdf (Nomádica, jul-2025) |
| 13 | **Día 2 — El motor: cadena de valor y consumidor final** ⭐ | consumidor final = motor, COD = confianza, Dropi Trust Agent, 7 actividades (Porter), producto = combustible, la orden = motor (5 fases) | Artifact Claude "Día 2" (capturas 24-jun) |
| 14 | **Portfolio Dropi: cobertura, monetización y fugas** ⭐ (referencia dura) | cobertura por etapa/perfil, los 10 productos (+dominios), heatmap producto×perfil, 4 flujos de revenue, 4 fugas, modelo mental | Artifact Claude "Día 2" detalle (capturas 24-jun) |
| 15 | **Día 2 — PLG: Dropi product-led por diseño (PGL)** ⭐ | regla de priorización (etapa×perfil×fuga), Sales/Marketing/Product-Led, producto+comunicación=megáfono, frame PGL, 4 razones, 5 pilares PLG | Artifact Claude "Día 2" PLG (capturas 24-jun) |
| 16 | **Perfiles a profundidad — sub-perfiles y personas** | los 4 perfiles a fondo: Dropshipper (Rebuscador·Empleado Aspirante·Joven Visionario), Marcas (Emprendedor·Marca), Proveedor (sub-tipos), Líder; motivación, fricción, Momento Ajá, métrica, product cues | Artifact Claude profundización (capturas 24-jun) |
| 17 | **Tiempo de ciclo — implementaciones por fase** | catálogo de implementaciones por fase del ciclo de la orden (ETA, detector de estancadas, carrier scoring); data q18 + Order.date_* | sesión tiempo de ciclo (25-jun) |
| 18 | **Métricas de operación — ene–may 2026** ⭐ (sizing de fugas) | panel mensual por país + acumulado YTD (18,9M), entrega estable ~73% (mayo = artefacto de mes incompleto), devolución ~26% (foco MX/AR/GT), movilización (788K no-mov 21,4%, INTER+ENVIA 60,6%), cierre log 23,5% vs ene 0,21% (=madurez), geografía por departamento (núcleo andino ~80% vs periferia ~64%), motivos cancelación/rechazo (Colombia, ~415K ciegos) | capturas Power BI + export Excel (Juan, 26-jun) |

## 📄 Originales (`fuentes/`) — 12 documentos
contexto_maestro · hallazgos_logistica · detalle_logistica · **dossier_completo** (registro
exhaustivo) · conceptualizacion-4capas.md · Metricas_Ecom_Scanner.docx · proceso_mvp.docx ·
Donde-esta-el-valor.txt · ecosistema-perfiles-niveles-conciencia.txt · portada.txt · PLG_LinkedIn.pdf ·
**Estudio antropologico.pdf** (consultoría de marca Nomádica, jul-2025).

## 🔗 Entregables externos relacionados (registrados en `fuentes/_index.md`)
- **Board de Figma** (id `LJbbDMU7…`) — narrativa visual viva (matriz de productos, modelo operativo, ciclo PLG, palancas H1-H8, flujo Ecom, plan 3 frentes).
- **Data_logistica.xlsx** — 13 pestañas con la data cruda + estado de hipótesis (fuente actualizable).
- **queries_*.sql/.txt** — queries de reproducibilidad.

## Notas de uso
- Data base = **abril 2026** (mes cerrado). Re-validar contra data fresca antes de decidir. Corte fresco abr/may 2026 en [`temas/18`](temas/18-metricas-operacion-2026-04-05.md) — ⚠️ **mayo es mes incompleto** (no leer su entrega como caída).
- Esta capa es **referencia de fondo**, no fuente operativa (esa es Jira/Drive/data viva).
- Todo destilado a fondo ✅. Pendiente menor: conseguir URL/IDs exactos del Figma y el xlsx para enlazarlos.
