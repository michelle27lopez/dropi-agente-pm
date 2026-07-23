# Spec · Normalización de estados

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Product Designer | Michel Pino  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Stakeholder | Dirección de Producto — Maria Ossa (CPO)  `[⚪ confirmar · fuente: estrategia/]` |
| Célula | Logistic Success (+EcomScanner) |
| Etapa de la cadena | Tránsito (estados del envío, transversal a toda la cadena) |
| Estado global | ⚪→🟡 discovery levantado con datos reales (Delivery Backlog · EJECUTAR · represado remapeado)  `[fuente: doc:direccionamiento-2026-s2 + doc:CONTEXTO_ESTADOS_DROPI]` |
| NSM que mueve | Habilitador de **tiempo por fases** + medición de **movilización**  `[⚪ · ver nota §2]` |
| Última actualización | 2026-07-12 |

> 📎 **Fuente maestra del discovery:** [`CONTEXTO_ESTADOS_DROPI.md`](CONTEXTO_ESTADOS_DROPI.md) —
> documento autocontenido armado desde la **API real de Dropi** + auditoría de solo-lectura sobre
> **133.555 órdenes y 52.636 guías reales de Colombia (2026-07-12)** + los dos documentos de trabajo
> previos. Fuentes crudas snapshot en `fuentes/` *(bóveda: fuentes/)* (Excel de 576 mapeos + PDF macro-proceso).
> **Cada afirmación de este spec con `[fuente: CONTEXTO §N]` sale de ahí.**
> 📐 **Diseño del catálogo (cómo debería quedar):** [`propuesta-homologacion.md`](propuesta-homologacion.md) —
> borrador v0 con diagnóstico del modelo actual, modelo por capas, catálogo objetivo e investigación
> carrier-by-carrier de las 6 colisiones.

## 0 · Resumen y estado global
Proyecto **represado estratégico (remapeado)**, en **Delivery Backlog · estado EJECUTAR**
`[fuente: doc:direccionamiento-2026-s2]`. Consiste en **normalizar/homologar los estados** del
envío (entre transportadoras y dentro de Dropi) para tener un lenguaje único de en qué punto está
cada orden. **Es un habilitador transversal:** sin estados normalizados no se puede medir bien el
**tiempo de entrega por fases** ni la **movilización** (capas de la cadena).

**Hallazgo estructural que redefine el proyecto** `[fuente: CONTEXTO §1]`: no existe "el estado de
una orden Dropi", existen **tres fuentes distintas** y sólo **dos son homologables**:
- **A · Estado de la ORDEN** (lo emite Dropi — ciclo de vida comercial). ✅ homologable. ~15 en uso.
- **B · Estado de la GUÍA** (lo emite la transportadora — ciclo físico del paquete). ✅ homologable. ~34 en uso, ~500 en catálogo.
- **C · Movimientos del carrier** (`servientrega_movements[]`, texto libre). ❌ **NO homologable** — sólo sirve para narrativa cruda y para fechar eventos.

El PDF de macro-proceso (24 estados, 6 fases) describe **A**; el Excel de 576 mapeos describe **B**.
No se contradicen: **cubren mitades distintas del mismo flujo**. Confundir A/B/C es el error de
diseño más caro.

**🆕 12-jul · discovery levantado con datos reales** `[fuente: CONTEXTO_ESTADOS_DROPI.md]`
- Se auditó la **API real + base de 133.555 órdenes / 52.636 guías (CO)**. Respuestas duras a las 3 preguntas abiertas (ver §9, ya cerradas).
- **El catálogo está inflado ~10×:** publica ~500 estados/país pero en tráfico real circulan **~50**; **46% del catálogo tiene CERO ocurrencias históricas** → homologar **por volumen**, no a mano los 400 que nunca llegaron.
- **Multi-país resuelto sin viajar:** se verificaron catálogos de 7 países vía API — **los estados NO colisionan entre países** (un `PENDIENTE` es lo mismo en CO y MX) → **el modelo NO necesita eje `país`**, un catálogo global alcanza. (Esto responde el correo pidiendo cuentas MX/AR — ya no bloquea.)
- **Sí puede necesitar eje `transportadora`:** hay **6 colisiones reales** donde el mismo estado crudo se clasifica distinto según carrier (ver §5) — decisión de arquitectura abierta.

**🆕 09-jul · avances de la semana** `[fuente: update de Juan a Maria, 09-jul]`
- Juan **envió correo pidiendo cuentas en los otros países** (MX/AR/…) para revisar **casos reales de guías**. *(⚠️ contexto: el CONTEXTO del 12-jul ya cerró el panorama multi-país vía API — el acceso a cuentas deja de ser bloqueante para decidir el eje `país`.)*
- Está construyendo una **primera versión más interactiva** del mapa/propuesta de estados → alimenta el paso "actualizar el mapa/gráfico de estados (dividido y agrupado)" antes de presentar y abrir mesas de trabajo.

## 1 · Problema raíz
- 🟡 **El estado del envío está fragmentado en 3 fuentes con vocabularios y cadencias distintas**
  (orden / guía / movimientos crudos), sin un lenguaje único. Sin homologar, no se puede medir
  transiciones ni ubicar dónde se fuga el valor.  `[🟡 · fuente: CONTEXTO §1]`
- 🟡 **El catálogo publicado no refleja la realidad:** ~500 estados/país catalogados vs **~50 reales**;
  46% del catálogo nunca ocurrió. Homologar contra el catálogo entero es esfuerzo desperdiciado.  `[🟡 · fuente: CONTEXTO §4.1]`
- 🟡 **La cabecera de la orden se atrasa respecto de su propio historial** (`status` de cabecera ≠
  último `history[]`) → el estado "efectivo" hay que derivarlo del `history[]` con `id` más alto.  `[🟡 · fuente: CONTEXTO §1.1]`
- Conecta con hallazgos previos: tiempo por fases (`metodologia/product-logistics.md §3.1`) y "el
  motivo de cancelación NO está instrumentado".  `[fuente: conocimiento/]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** 🟡 "Homologar los estados a un catálogo único (por volumen real, con implicaciones
  físicas declaradas) permite medir tiempo por fases y movilización con precisión, lo que destraba
  la priorización del resto de proyectos de la célula."  `[🟡 · validar con Maria/Data]`
- **Métrica de éxito + línea base:** candidata → **% de órdenes con transición de estado trazable /
  cobertura de estados mapeados por volumen** (~50 estados cubren ~100% del tráfico). Línea base por
  medir contra la base actual.  `[⚪ · data: por cerrar]`
- **NSM:** indirecto — es **habilitador de medición** de movilización y tiempo por fases (Ley 5).

## 3 · Usuarios / actores
- **Operador logístico / equipo de producto-data** — consumidor del detalle completo (necesita los ~21 estados).  `[🟡 · fuente: CONTEXTO §8.3]`
- **Cliente final (comprador)** — no debería ver 21 estados sino **8** (vista simplificada).  `[🟡 · fuente: CONTEXTO §8.3]`
- **Transportadoras** — origen de los estados crudos (7 carriers, casing inconsistente).  `[🟡 · fuente: CONTEXTO §4.4]`
- **Dropshipper** — ve el estado del envío.  `[🟡]`

## 4 · Alcance
**Entra (por estado):**
- 🟡 **Catálogo único de estados homologados** (separando vocabulario A=orden y B=guía desde el modelo de datos, no desde la UI — el catálogo ya los distingue con la propiedad `company`).  `[🟡 · fuente: CONTEXTO §10]`
- 🟡 **Mapeo estado_crudo → estado homologado**, priorizado **por volumen real**, con default observable para desconocidos ("por clasificar").  `[🟡 · fuente: CONTEXTO §4.1, §10]`
- 🟡 **Declaración de implicaciones físicas por estado** (¿salió de bodega? ¿orden cerrada? ¿terminal/reversible? ¿efecto en stock?) — sin esto es una lista, no una homologación.  `[🟡 · fuente: CONTEXTO §7]`
- 🟡 **Dos capas de vista:** operador (~21) vs cliente final (8).  `[🟡 · fuente: CONTEXTO §8.3]`
- 🟡 **Modelar reintentos (3 intentos → devolución) y rama de siniestro/indemnización** (están en el PDF, en ningún otro lado).  `[🟡 · fuente: CONTEXTO §8.1, §8.4]`

**No-objetivos (⛔ — explícito):**
- ⛔ **Homologar `servientrega_movements[]` / `nom_mov`** — es texto libre del carrier, no es estado.  `[⛔ · fuente: CONTEXTO §3.5]`
- ⛔ **Eje `país` en el modelo** — los estados no colisionan entre países, un catálogo global alcanza.  `[⛔ · fuente: CONTEXTO §3.1]`
- ⛔ Homologar a mano los ~400 estados de catálogo con cero ocurrencias.  `[⛔ · fuente: CONTEXTO §4.1]`

## 5 · Reglas de negocio
- 🟡 **Estado efectivo = entrada de `history[]` con `id` más alto** (ids monótonos), no el `status` de cabecera; salvo que la cabecera no aparezca en el historial (entonces vale la cabecera — historial incompleto).  `[🟡 · fuente: CONTEXTO §1.1]`
- 🟡 **A y B avanzan a ritmos distintos** — la UI fusiona las dos líneas de tiempo, no elige una.  `[🟡 · fuente: CONTEXTO §1]`
- 🟡 **Las 6 colisiones — INVESTIGADAS (12-jul):** carrier-by-carrier con el Excel de campo → **5 de 6 son errores de llenado** (se resuelven con catálogo global + normalización); **solo `INTENTO DE ENTREGA` es candidata a colisión semántica real** (¿sale a reparto o falló?). **Recomendación:** clave global `estado_crudo` + override `(transportadora, estado_crudo)` reservado solo a excepciones confirmadas (hoy máx. 1). Detalle y veredicto por estado en [`propuesta-homologacion.md §6`](propuesta-homologacion.md). Gate real: confirmar `INTENTO DE ENTREGA` con INTERRAPIDISIMO/VELOCES.  `[🟡 · fuente: propuesta §6 + Excel de campo]`
- 🟡 **Normalizar el casing de transportadora en ambos lados** (catálogo=Title Case, órdenes=MAYÚSCULAS) o el match falla en silencio.  `[🟡 · fuente: CONTEXTO §4.4]`

## 6 · Criterios de aceptación (Gherkin)
- N/A — se redactan en el Hand-off a TI (doc E2E §4.5). Insumo listo: checklist de construcción en `CONTEXTO §10`.

## 7 · Datos (diccionario)
- 🟡 **Fuente autoritativa del vocabulario:** endpoint `helpers/getStatusesByCountry` — objetos con propiedad `company` = estado de transportadora (B); sin ella = estado de orden (A).  `[🟡 · fuente: CONTEXTO §3.1]`
- 🟡 **Línea de tiempo de estados:** `order.history[]` (`id`, `status`, `created_at` naive, `user`). ⚠️ **NO viene en el listado** — sólo 1,7% de órdenes lo traen desde `myorders/v2`; hay que pegarle al **detalle orden por orden**. Presupuestar ese costo.  `[🟡 · fuente: CONTEXTO §3.4]`
- 🟡 **Timestamps naive en hora local de cada país** (no UTC) → usar zona IANA por país; Argentina tiene DST, nunca offset fijo.  `[🟡 · fuente: CONTEXTO §5]`
- ⚪ Mapear a tablas internas: `Historyorder`, `q18` (tiempos por transición), `Order.date_*` (ver `conocimiento/temas/10`).  `[⚪ · data: por cerrar contra la base actual]`
- 🔴 **Errata del Excel previo:** su columna "Estado Actual (DB)" usa categorías eliminadas en abril-2026 (`PENDIENTE_RECOLECCION`, `RECIBIDO_TRANSPORTADORA`, `EN_REPARTO`) → el "Plan de Ajustes" (145 cambios) y los totales (dice 576, real ~900) **no son confiables**; el diff hay que recalcularlo. El contenido semántico sí sirve.  `[🔴 · fuente: CONTEXTO §9]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Idea/Proyecto Polaris | [PRM-1297](https://dropi-it.atlassian.net/browse/PRM-1297) |
| Doc E2E (Drive) | [Proyectos E2E - Normalización de estados](https://docs.google.com/document/d/1MdJpIfBWM3dODcMW8big-4-RfOxatUIt1I2CcoGtV-Y/edit) |
| Carpeta Drive | [Normalización de estados](https://drive.google.com/drive/folders/1aI3PxUKGTuM5WVZ753Qv-5JyRaVC_9gw) |
| Figma | N/A — aún no |

## 9 · Preguntas abiertas
**Cerradas por el CONTEXTO (12-jul):**
- [x] ¿Cuántos/cuáles estados crudos hay por transportadora y país? → **~500 catalogados/país, ~50 reales; 46% con cero ocurrencias.** Top real en `CONTEXTO §4.2`. Los estados NO colisionan entre países.  `[CONTEXTO §4, §3.1]`
- [x] ¿El catálogo normalizado existe o se crea de cero? → **Existen 3 propuestas** (PDF 24 estados/6 fases · Excel 21 estados/576 mapeos · vista usuario 8 estados). Se **consolidan**, no se parte de cero. Contradicciones mapeadas en `CONTEXTO §8.4`.  `[CONTEXTO §8]`
- [x] ¿Qué proyectos dependen de esto? → **Tiempo por fases / Torre de control** (habilitador directo), movilización, novedades. Ver §2.

**Abiertas / a decidir:**
- [ ] 🔴 **Las 6 colisiones (§5): ¿errores de llenado o semántica real?** → decide si la clave es `estado_crudo` o `(transportadora, estado_crudo)`. Responsable: Juan + Ops carrier. **Es el gate de arquitectura.**  `[CONTEXTO §6]`
- [ ] 🟡 Validar el catálogo destino consolidado (¿21 operador + 8 cliente? ¿mantener reintentos y siniestro del PDF?) con Michel + Maria.  `[CONTEXTO §8]`
- [ ] 🟡 Declarar implicaciones físicas por estado (salida bodega / cierre / reversible / stock).  `[CONTEXTO §7]`
- [ ] ⚪ Recalcular el diff contra la base actual (~900 estados), no contra el Excel desactualizado.  `[CONTEXTO §9]`
- [ ] ⚪ Mapear los estados homologados a las tablas internas (`Historyorder`, `q18`).

## 10 · Changelog
- **2026-07-12 — Discovery levantado con datos reales.** Se sumó [`CONTEXTO_ESTADOS_DROPI.md`](CONTEXTO_ESTADOS_DROPI.md) (API real + auditoría de 133.555 órdenes / 52.636 guías CO) y fuentes crudas snapshot (`fuentes/` *(bóveda: fuentes/)*: Excel 576 mapeos + PDF macro-proceso). Reescritos §0–§9 con hallazgos: modelo de 3 fuentes (A/B/C), catálogo inflado ~10×, sin eje país, 6 colisiones como gate de arquitectura, implicaciones físicas como requisito. Cerradas las 3 preguntas abiertas. Origen: docs de trabajo de Juan en repo `BodeGo-back`.
- 2026-06-23 — Creado el spec + carpeta Drive + doc E2E base. Origen: direccionamiento de la célula (CPO). Discovery pendiente (por leer PRM-1297).
