# Spec · Same Day (proveedores, marcas y fulfillment)

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Product Designer | Michel Pino  `[🟡 · fuente: doc:direccionamiento-2026-s2]` |
| Stakeholder | Dirección de Producto — Maria Ossa (CPO)  `[⚪ confirmar · fuente: estrategia/]` |
| Célula | Logistic Success (+EcomScanner) |
| Etapa de la cadena | Despacho / Tránsito (coberturas y distancias) |
| Estado global | 🟡 discovery levantado (borrador desde Jira · Delivery Backlog · EJECUTAR)  `[fuente: doc:direccionamiento-2026-s2 + jira:PRM-1366]` |
| NSM que mueve | % de entrega + tiempo por fases (entrega same-day)  `[⚪ · validar magnitud]` |
| Última actualización | 2026-06-24 |

## 0 · Resumen y estado global
Proyecto **heredado de junta directiva (enfoque OKR)**, en **Delivery Backlog · estado EJECUTAR**
`[fuente: doc:direccionamiento-2026-s2]`. Busca **formalizar la entrega same-day como producto** de la
plataforma (hoy es manual). Cuelga del **Proyecto OKR [PRM-1514](https://dropi-it.atlassian.net/browse/PRM-1514)**
"Optimización coberturas y distancias". PRM-1366 no tiene descripción, pero su **red de conexiones Polaris**
levanta el discovery (problema, sub-oportunidades y la idea de solución) — destilado abajo.  `[🟡 · fuente: jira:PRM-1366 issuelinks, 24-jun]`
**🆕 30-jun: discovery COMPLETO encontrado en Figma** (board "Research same-day", PD **Michelle López**) → destilado en §0.1. **Corrige el estado:** el discovery no estaba pendiente, estaba hecho fuera del cerebro.
**🆕 09-jul · revisión corta con Veloces (riesgo vivo en producción):** hoy Veloces le saca guía **"same day" a ciertos dropshippers/proveedores SIN ninguna lógica detrás** — no valida tipo de envío ni geografía (ej. **Cali→Santa Marta igual sale como same day**). Confirma **en producción** el dolor del §0.1 ("falsos SD y promesas incumplidas"): el SD se asigna a dedo, no por regla. **No hay construcción nueva** (sigue ⚪ discovery). → es **evidencia dura** de que el MVP debe empezar por **① flag SD + ④ validación geográfica** (misma ciudad/municipio elegible) para cortar los falsos SD. `[fuente: update de Juan a Maria, 09-jul]`

## 0.1 · Discovery destilado — board Figma "Research same-day" `[fuente: figma:uZeHBc0bilrBIXgYWyxeow · PD Michelle López · destilado 30-jun]`

### Hallazgos por área
- **Bodega/Fulfillment** (Jorge Escobar · Óscar Gómez): cortes cada 2h (7AM–4PM), picking batch por transportadora. **La identificación SD es 100% manual** (listado de Comercial). El WMS nuevo (**Stock Pro**) puede clasificar SD pero **no recibe el input de Dropi**. Dolor: un pedido Veloces que entra 8PM se clasifica como SD del día siguiente → **falsos SD y promesas incumplidas**.
- **Veloces/Transportadora** (Urley Ospina): entregan el mismo día como **"valor agregado" sin costo adicional ni marcación formal**; corte 11AM para bodegas Dropi. Su TMS puede marcar SD pero **Dropi no le envía la señal**. Dolor: sin diferenciación, no puede **medir cumplimiento ni monetizar**.
- **Producto** (Katerine · Michelle · Alejandro · Juan Diego): SD se ofrece comercialmente a Marcas, pero **no hay identificador tecnológico nativo** en Dropi que hable con WMS/transportadora. Flujo informal: **voz a voz → Excel → coordinación**. Alcance acordado: **Bodegas Dropi + Veloces + Envíos Urbanos**; tarifa pendiente con Carlos Peralta.

### Flujo AS-IS (12 pasos) — el SD vive de un Excel manual
Catálogo → Generación de orden → **③ Identificación manual SD** (Comercial Mayra/Vanessa → bodega vía WhatsApp/Excel; **sin este paso la bodega no sabe qué es SD** 🚩) → Generación de guía (Dropi) → Carga al WMS (Copérnico, manual) → **⑥ Primer corte/picking 7–9AM** (prioriza por transportadora, **NO por flag SD**) → Picking (2 pickers, ~100 ped/ciclo) → Packing → Cross docking (Veloces primero) → Entrega física a Veloces 9:30–11AM → Distribución Veloces (georreferenciación) → Entrega cliente final (tarde, mismo día). **Dropi nunca marca "SD" ni "entregado SD" → medición imposible.**

### SLAs operativos `[fuente: Óscar/bodega]`
Hora de corte SD ~7–11AM · entrega a Veloces 11AM · Veloces llega 9:30–10AM · cortes de picking 7/9/11AM·2·4PM · capacidad ~100 ped/ciclo (2 pickers) · volumen full-fill Bogotá ~2.500 órd/día · recepción inventario 24–72h.

### Elegibilidad geográfica (Veloces)
✅ **Bogotá–Bogotá** (core) · **Medellín–Medellín** (+Bello/Itagüí/Sabaneta) · **Cali–Cali** (+Jamundí). ⚠️ Parcial: Bogotá–Chía/Mosquera/Funza · Medellín–Tagüí/Bello (Veloces no despacha). ❌ Palmira (desde Cali) · intercity Bogotá–Cali (solo aéreo, costo prohibitivo).

### Requisitos del MVP
**Técnicos:** ① **Flag SD en la orden** al crearla (validación hora de corte en tiempo real) · ② **Validación de hora de corte** (post-corte → bloquea/advierte y redirige a ND) · ③ **Validación geográfica** (origen=destino misma ciudad/municipio elegible) · ④ **Propagación del flag al WMS** (Dropi→Stock Pro, campo `tipo_envio = SD/ND/Express` → ola de picking prioritaria) · ⑤ **Señal SD al TMS de Veloces** (priorización en distribución).
**Operativos:** cobertura SD formal (municipios, con Veloces + Carlos Peralta) · tarifa diferencial (con Carlos Peralta) · SLA publicado en plataforma · **alcance MVP = bodegas propias Dropi [Bogotá/Medellín/Cali] + Veloces; EXCLUIR bodegas externas de marcas en fase 1** · reunión cross-funcional (Bodega Jorge/Óscar · Veloces Urley · Comercial Vanessa · TI Fernando · Producto) antes de dev.

### Matriz de priorización (11 gaps) — define el MVP
| Prioridad | Gaps |
|---|---|
| **MVP** | ① flag SD (UX+BE) · ② hora de corte (UX) · ③ propagación WMS (Integración) · ④ validación geo (BE+UX) · ⑥ selección transportadora guiada en UI (UX) · ⑦ marcación para medir cumplimiento (Data) — **todos Alto impacto** |
| **Post-MVP** | ⑤ notificación SD al cliente final (UX) · ⑧ **tarifa diferencial (Negocio, requiere negociación externa)** · ⑩ dashboard monitoreo SD (UX interno) |
| **Fase 2** | ⑨ bodegas externas de marcas (Operativo) · ⑪ otras transportadoras Inter/TCC (Operativo) |

## 1 · Problema raíz
- **El same-day NO existe como producto dentro de la plataforma: es un proceso manual, sin cobro ni
  medición.**  `[🟡 · fuente: jira:PROB-247 (Problem roadmap conectado)]`
- Consecuencia: no es escalable, no monetiza el flete premium y no se puede medir su impacto en entrega.  `[🟡 · inferido del problema]`
- Encaje estratégico: palanca del **OKR 2 · KR2.1 (tasa de entrega ≥70%)** vía "coberturas y distancias".  `[⚪ · fuente: doc:marco-comun-2026-s2 §5]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** "si formalizamos el same-day como producto en plataforma (**flag en orden, validaciones,
  integración WMS y tarifa**), se vuelve **cobrable, medible y escalable**, y sube la entrega rápida."  `[🟡 · fuente: jira:PRM-1316 (idea de solución)]`
- **Métrica de éxito + línea base:** adopción (# órdenes same-day), **% entrega same-day en SLA**, tiempo
  de la orden, e **ingreso por tarifa**. Línea base N/A — depende de la "Primera medición de KPIs".  `[⚪ · base por cerrar]`
- **NSM:** % de entrega + tiempo por fases.  `[⚪ · validar magnitud]`

## 3 · Usuarios / actores
- **Proveedores · Marcas · Fulfillment** (operación) — generan la orden same-day.  `[🟡 · fuente: doc:direccionamiento-2026-s2]`
- **Bodegas Dropi / Veloces** (infraestructura propia) y **transportadoras externas** (escalar cobertura).  `[🟡 · fuente: jira:PRM-1156 / PRM-1225]`
- **Consumidor final** (recibe el mismo día).  `[⚪]`

## 4 · Alcance
**Entra — tres frentes (sub-oportunidades conectadas):**
- **Producto formal del flujo same-day:** flag en orden, validaciones, integración WMS y **tarifa**.  `[🟡 · fuente: jira:PRM-1316]`
- **Infraestructura propia:** Same Day sobre **Veloces + Bodegas Dropi**.  `[🟡 · fuente: jira:PRM-1156]`
- **Escalar a infraestructura externa** (otras transportadoras / bodegas) sin perder control operativo.  `[🟡 · fuente: jira:PRM-1225]`
- **Coberturas y distancias** (qué ciudades/zonas habilitan same-day).  `[⚪ · fuente: PRM-1514]`

**No-objetivos (⛔ — por confirmar en Definición):**
- ⚪ Delimitar fase 1 (¿solo infra propia? ¿qué ciudades?) — se fija al cerrar discovery.

## 5 · Reglas de negocio
- N/A — por levantar en discovery/hand-off.

## 6 · Criterios de aceptación (Gherkin)
- N/A — se redactan en el Hand-off a TI (doc E2E §4.5).

## 7 · Datos (diccionario)
- ⚪ Por definir: tiempos de despacho/recolección y cobertura geográfica.
  Candidatos: `Order.date_*` + `Historyorder` (ver `conocimiento/temas/10`).  `[⚪ · data: por cerrar]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Oportunidad Polaris (ancla) | [PRM-1366](https://dropi-it.atlassian.net/browse/PRM-1366) "Same day proveedores, marcas y fulfillment" |
| **Proyecto OKR madre** | [PRM-1514](https://dropi-it.atlassian.net/browse/PRM-1514) Optimización coberturas y distancias |
| **Problema raíz** | [PROB-247](https://dropi-it.atlassian.net/browse/PROB-247) "no existe como producto, manual sin cobro ni medición" |
| Idea de solución | [PRM-1316](https://dropi-it.atlassian.net/browse/PRM-1316) flujo completo (flag, validaciones, WMS, tarifa) |
| Sub-oportunidades | [PRM-1156](https://dropi-it.atlassian.net/browse/PRM-1156) infra propia · [PRM-1225](https://dropi-it.atlassian.net/browse/PRM-1225) infra externa · [PRM-785](https://dropi-it.atlassian.net/browse/PRM-785) proveedores |
| **Épica dev (PROD)** | [PROD-1127](https://dropi-it.atlassian.net/browse/PROD-1127) "[Dropi] Same day proveedores, marcas y fullfilment" — creada 30-jun, *implements* PRM-1366. ⚠️ **vacía** (descripción = solo link a PRM-1366; sin subtareas) `[verificado jira 30-jun]` |
| Doc E2E (Drive) | [Proyectos E2E - Same Day](https://docs.google.com/document/d/1NO9fbjklz2XvMVrMc_os6AuUjsF5ZkmDw3kX5XmwNtA/edit) — ⚠️ **es la plantilla maestra EN BLANCO** (único archivo en la carpeta; sin contenido propio) `[verificado drive 30-jun]` |
| Carpeta Drive | [Same Day](https://drive.google.com/drive/folders/13266oMrDh97OIKEF8nKeSembRD__BMYf) |
| **Figma — Research** ⭐ | [Research same-day](https://www.figma.com/board/uZeHBc0bilrBIXgYWyxeow/Research-same-day?node-id=1-2) (board, PD Michelle López) — ✅ **destilado 30-jun en §0.1** (AS-IS · blueprint · SLAs · cobertura · requisitos MVP · matriz de 11 gaps). Fuente de verdad del discovery. |

## 9 · Preguntas abiertas
> Varias **resueltas** con el discovery del Figma (30-jun):
- [x] **Fase 1 — RESUELTA:** MVP solo **bodegas propias Dropi (Bogotá/Medellín/Cali) + Veloces**; excluir bodegas externas de marcas (→ Fase 2). `[figma]`
- [x] **Tarifa — RESUELTA (de fase):** es **Post-MVP** (gap #8, requiere negociación externa con **Carlos Peralta**). No bloquea el MVP. `[figma]`
- [x] **WMS — DEFINIDO:** integración **Dropi → Stock Pro** con campo `tipo_envio = SD/ND/Express` → ola de picking prioritaria. `[figma]`
- [x] **Fusión sub-oportunidades — HECHA en Jira:** PRM-1156/1225/785/1316 están **merged** en PRM-1366 (verificado 30-jun). `[jira]`
- [ ] ⚠️ **Línea base — REPLANTEADA:** "¿cuántas SD hoy y a qué % cumplimiento?" **NO es medible hoy** (gap #7: sin marcación automática). → **El MVP (flag + marcación) es prerequisito de la propia baseline.** La baseline se mide *después* de instrumentar, no antes.
- [ ] **Reunión cross-funcional** (Bodega · Veloces · Comercial · TI · Producto) antes de iniciar dev — pendiente de agendar. `[figma · requisito operativo]`

## 10 · Changelog
- 2026-06-30 — **Verificación en vivo + épica creada.** Juan creó la **épica dev [PROD-1127](https://dropi-it.atlassian.net/browse/PROD-1127)** (anclada a PRM-1366, aún vacía). Confirmada en Jira toda la estructura (PROB-247 problema · PRM-1514 OKR · PRM-1316 idea · PRM-1156/1225/785 sub-opps merged) — sin descripciones, contenido en los títulos. **Hallazgos:** Drive sigue con la **plantilla E2E en blanco** (no hay research en Drive); existe **board Figma "Research same-day"** (PD Michelle López). **Juan pasó el board** → **discovery COMPLETO destilado en §0.1** (AS-IS 12 pasos · blueprint · SLAs · cobertura geo · requisitos MVP · matriz de 11 gaps). Resueltas las preguntas de fase 1/tarifa/WMS/fusión (§9). **Corrección honesta:** el discovery NO estaba delgado, estaba completo fuera del cerebro. **Próximo:** estructurar PROD-1127 con el alcance MVP real + 1ª historia de Michel = **diseñar el flujo de creación de orden SD** (flag + hora de corte + geo + selección guiada). ⚠️ Pendiente: ¿**Michelle López** (autora del research) vs **Michel Pino** (PD asignado en el direccionamiento) — misma persona o dos diseñadoras? Aclarar con Juan. Recordatorio de prioridad: Same Day = "Medium" (roadmap §2), prioridad de la CPO.
- 2026-06-24 — **Discovery levantado desde las conexiones de PRM-1366** (PROB-247 problema raíz, PRM-1514 OKR madre, PRM-1316 idea, PRM-1156/1225/785 sub-oportunidades). Problema/hipótesis/métrica/actores/alcance poblados. PRM-1366 sin descripción → el detalle fino (data, entrevistas) queda para la carpeta Drive.
- 2026-06-23 — Creado el spec + carpeta Drive + doc E2E base. Origen: direccionamiento de la célula (CPO). Discovery pendiente (Jira bloqueado por IP / por leer PRM-1366).
