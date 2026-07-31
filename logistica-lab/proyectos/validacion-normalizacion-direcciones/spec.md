# Spec · Validación y normalización de direcciones

> Fuente de verdad INTERNA del proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.
> Fuente: `figma:` `jira:` `screenshot:` `data:` `reunion:` `doc:` `drive:`.

> 🆕 **Sembrado 24-jun.** El discovery se produce en el **taller de validación y normalización de
> direcciones** (por agendar). La narrativa visual viva está en el **Figma board Logística**.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista (Logistic Success) |
| Stakeholders | Operaciones (William Morales) · Transportadoras (Carlos Peralta) · Ecom Scanner |
| Etapa de la cadena | **Selección/Confirmación** (pre-red) |
| Estado global | ⚪ discovery (pendiente el taller) |
| NSM que mueve | ⬆️ **Movilización** + ⬆️ **% de entrega** (ataca la fuga pre-red) |
| Última actualización | 2026-06-24 |

## 0 · Resumen y estado global
Mejorar la **calidad de la dirección** antes de que la orden entre a la red, mediante **validación**
(que la dirección sea entregable) y **normalización** (estandarizar formato/estructura). Hoy la mayor
sangría de la cadena está **antes de la red** (canal SHOP entra 66% vs MANUAL 93%); la **validación ya
existe** (`is_validated`, +12 pts) pero falta forzarla/normalizar. El discovery se cierra en el **taller**.

## 0.1 · Discovery — Cell Board 24-jun (1ª sesión del taller)  `[reunion: Cell Board 24-jun · notas Gemini drive:1OocZr_a_QWWn_or0WPBkHK2i6tyObFUVV707GEx5tVY]`
Primera sesión de ideación. Se trabajó **separando checkout (SHOP) vs. orden manual**. El equipo
acordó **consolidar las ideas en 3 categorías** para pasar a prototipar flujos en la próxima sesión:

1. **GPS y mapas.** Pop-up que captura la ubicación actual y valida si la dirección es un edificio/vivienda
   existente (no un lote) para evitar errores de *encoding*; **QR en la guía** con la ubicación de Google Maps
   para el conductor (sin app extra); **Relaisit** (app de Shopify) + Google Maps para normalizar la dirección.
2. **Flujos de CRM / notificaciones.** **Map-picker por WhatsApp**: enlace al consumidor final para que
   confirme/ajuste la dirección **antes de que la transportadora consuma la info**; viable conectar **webhooks
   al CRM** (lo confirmó Juan Camilo Rojas) si se definen campos y *triggers*.
3. **Reclamo en oficina / cobertura.** Hacer **visible la cobertura y el reclamo en oficina** en el landing del
   checkout; **API de cobertura** (Carlos Peralta) para sustituir el Excel manual y resolver oficinas que cambian.

**Restricciones reconocidas:** los **checkouts externos** (Shopify/Wix/Tienda Nube) limitan modificar su
formulario → la estrategia debe alinearse a esos socios `[Jose Giraldo]`. Direcciones por **número de manzana**
en Cartagena/Armenia/Ibagué exigen validación más flexible. El **historial de compra** del cliente sirve para validar.

**Propuestas de Juan en la sesión:** permitir **cambiar la dirección dentro de ~500 m o la misma ciudad** para no
perder envíos; permitir cambiar nombre/dirección **siempre que el recaudo (COD) quede garantizado**.

**Decisión clave:** **reevaluar/reformular el proyecto de "validación de direcciones"** — la validación **ya existe
en la nueva versión de la herramienta** (ver [[plataforma-modulos]]); decidir si se **reformula** o se trata como
**nueva iniciativa**. (Coincide con el reencuadre "medir el feature vivo, no construir de cero".)

> **Otro tema del Cell Board (no es direcciones):** Carlos Peralta presentó la **estandarización del proceso de
> integración de transportadoras en 8 fases** (captura/prefiltro → viabilidades financiera/jurídica/TI → contractual
> → montaje Dropi Score → desarrollo → pruebas logísticas/tarifas → **habilitación de marketing [Juan, fase 6]** →
> capacitación comercial + arranque), con **matriz RASI + SLA por área + POE**. Se comparte por el grupo de la célula
> para validación de las cabezas de área. → registrado en pendientes; toca al frente de **integraciones/transportadoras**.

## 1 · Problema raíz
- Direcciones mal formadas o no validadas → órdenes que no entran a la red o se caen en reparto.  `[🟡 data:conocimiento/temas/04, metodología §4.2]`
- **Canal SHOP = fuga #1** (entra a red 66% vs MANUAL 93%).  `[data: síntesis §3]`
- La validación existe pero **no se fuerza**; no hay **normalización** estandarizada de la dirección.  `[🟡 data: is_validated]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** "si validamos y normalizamos la dirección antes del despacho, **más órdenes entran a la
  red y se entregan al primer intento**." (la validación ya da +12 pts en SHOP).  `[data: is_validated]`
- **Métrica + base:** ⬆️ % de órdenes que entran a red (SHOP 66%→…) · ⬇️ no entregados por dirección errada · ⬆️ entrega 1er intento. Línea base **por confirmar en el taller/data**.  `[⚪ pendiente]`

## 3 · Usuarios / actores
- **Dropshipper / Marca** (crea la orden; ingresa o importa la dirección).  `[⚪]`
- **Operador de punto / bodega** (lee y despacha; Ecom Scanner).  `[⚪]`
- **Transportadora** (recibe la guía; rechaza si la dirección no es ruteable).  `[⚪]`
- **Consumidor final** (recibe; una dirección mala = no entrega).  `[ref: temas/13]`

## 4 · Alcance
**Entra (a validar en el taller):**
- **Validación** de dirección entregable (forzar `is_validated`, sobre todo en SHOP).  `[⚪]`
- **Normalización** (estandarizar estructura: ciudad/depto/vía/complemento; homologar nomenclatura).  `[⚪]`
**No-objetivos (⛔):**
- Normalización de **estados** (es otro proyecto, PRM-1297).  `[⛔ no confundir]`

## 5 · Reglas de negocio
- Por definir en el taller (qué hace entregable una dirección; cuándo se bloquea el despacho).  `[⚪]`

## 6 · Criterios de aceptación (Gherkin)
- Por definir tras el taller.

## 7 · Datos (diccionario)
- `is_validated` — bandera de dirección validada (+12 pts de entrada a red).  `[data: síntesis §3]`
- Tablas/campos de dirección (ciudad, depto, dirección, complemento) — mapear en el taller.  `[⚪]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Figma board (narrativa viva) | [Logística board](https://www.figma.com/board/LJbbDMU7kozDXq8xak54ko/Logistica?node-id=0-1) |
| Carpeta Drive | [Validación de direcciones](https://drive.google.com/drive/folders/17S1qEyxT__QhHEx9Tf27aQ4v0enpBvW1) |
| **Ticket PRM (proyecto)** | [PRM-91](https://dropi-it.atlassian.net/browse/PRM-91) (Represado · EJECUTAR en el Delivery Backlog de la CPO) |
| Feature Jira (existe) | "[Ordenes] Validador de direcciones" / Producto-Feature "Validador de direcciones" |
| Conocimiento | [temas/04 hallazgos](../../conocimiento/temas/04-hallazgos-data.md) · [síntesis §3](../../conocimiento/sintesis-logistica-producto.md) · metodología §4.2 |
| Documentar en PRM-91 | ⏳ campos + descripción + enlaces (Jira caído al 24-jun) |

## 9 · Preguntas abiertas y próximos pasos
**Próximos pasos del Cell Board (24-jun):**
- [ ] **Agendar 2ª sesión** = prototipar flujos iniciales con las 3 categorías (GPS/mapas · CRM/notificaciones · reclamo/cobertura). `[Michel + Juan]`
- [ ] **Definir los momentos exactos** (en qué etapa logística) se disparan las notificaciones de normalización. `[grupo]`
- [ ] **Reevaluar/reformular** el proyecto de validación (¿reformular vs nueva iniciativa?). `[equipo]`
- [ ] Carlos Peralta: investigar **API de cobertura** (sustituir Excel). · Juan Camilo Rojas: validar con **TI** campos personalizados + integración CRM/Shopify.

**Siguen abiertas:**
- [ ] Línea base real (¿cuánto pesa la dirección en la fuga pre-red y en no entregados?).
- [ ] ¿Normalización propia vs externo? — surgió **Relaisit + Google Maps** como opción. `[evaluar]`
- [ ] ¿Dónde se fuerza la validación: creación, confirmación, despacho?
- [ ] Issue de Jira / épica que ancla el proyecto + documentar PRM-91.

## 9.1 · Experimento definido + encuesta — chat "experimentos" (cierre)
> ⚠️ **TENSIÓN A RECONCILIAR (28-jun):** el reajuste del árbol v2 ([estrategia/arbol-okr-objetivo.md](../../estrategia/arbol-okr-objetivo.md)) sacó **dirección+geo** del árbol por pesar **≈1% de las novedades**. PERO el corte **canal × validada** de abajo muestra que **validar mueve +11.9 pts de entrada a red en SHOP** — eso es **movilización (fuga #1)**, no "calidad de dirección". O sea: el ángulo "arreglar direcciones" se bajó, pero "**subir cobertura de validación en SHOP**" sigue vivo como palanca de movilización. **Decidir con Juan/data** si el experimento se mantiene bajo movilización o se archiva.

**Data que sostiene el experimento** `[data: reportes operativos, capturas 24-jun → conocimiento/temas/04]`
- **Novedades por motivo (~946K):** causa-dirección = *no existe* (82K) + *no se localiza* (41K) + *incompleta* (39K) = **~161K órdenes** devolviendo 58-82%. (Ojo: como % de TODAS las novedades es chico — de ahí la tensión.) El grueso es *rehúsa* (294K, 95% dev) = pago/COD, otro frente.
- **Canal × validada:** SHOP validada **68.9%** entra red vs sin validar **57.0%** (**+11.9 pts**) y entrega 76.2% vs 66.6%. **Premio = SHOP sin validar: 618K órdenes / GMV ~66.244M / ~90K entregas en juego.** MANUAL: validar no cambia entrada (~93%) pero sí entrega (+6.3). Es correlación; el A/B prueba causa.

**Experimento — Activar la validación de dirección en SHOP**
- **Hipótesis:** subir la cobertura de validación en SHOP sube % entra red y % entrega.
- **Palanca:** activar `is_validated` en el flujo SHOP donde hoy se salta (618K). No construir — encender.
- **Diseño:** A/B aleatorio sobre órdenes SHOP que hoy salen sin validar (test = pasa validación + acción si falla; control = flujo actual).
- **Acción si la validación falla:** Userpilot (alerta in-app al dropshipper) / CRM (map-picker WhatsApp al cliente final).
- **Métrica:** primaria % entrega s/creadas; secundarias % entra red, % cobertura validación, % devolución. **Meta inicial: +5 de los 14.5 pts ≈ ~30K entregas/periodo.**
- **Dependencias (honestas):** TI activa la validación en SHOP + pasa el flag de "validación fallida" a Userpilot/CRM (un atributo, no un proyecto). Jose lee el outcome del reporte (no DB).
- **No toca:** devolución por rehúsa/COD (294K, 95%) = pago, otro frente.
- **Opción barata sin dev:** nudge de Userpilot en creación de orden (revisar número/barrio/referencia), A/B 50/50, mide novedad-dirección. Techo bajo, aprende rápido.

**Encuesta de discovery — [PROD-1086](https://dropi-it.atlassian.net/browse/PROD-1086)** (asignada a Laura Torres) `[jira: PROD-1086]`
- Detalle completo en el ticket: ficha estándar Userpilot (rol Dropshipper · Colombia · creación de orden · disparador = clic visible · 30 días/300 resp · una vez por usuario · segmento Dropshipper ya existe, sin base de correos) + 4 preguntas **cerradas** (razón principal · frecuencia · apetito de solución · escala esfuerzo).
- **Realidad Userpilot:** NO valida ni se conecta al backend; solo reacciona a clics visibles y a eventos/atributos que Front/Back le envíen. Esta encuesta se dispara por clic → no depende de TI.
- ⚠️ **Pendiente de Juan para dejarla 100% lista:** confirmar **URL/pantalla exacta + anexar Figma/captura**. Lo demás (7/8 campos) ya está.
- Nota de alcance: en SHOP la dirección la escribe el cliente final (checkout externo), no el dropshipper → la encuesta mide percepción/apetito, no el acto de escribir (eso es MANUAL).

## 10 · Changelog
- 2026-06-25 — **Chat "experimentos" cerrado.** Definido el experimento "Activar validación en SHOP" + encuesta PROD-1086 (detalle en §9.1). Documentadas las 2 cortes de data (novedades por motivo + canal×validada) en `conocimiento/temas/04`. ⚠️ Marcada la **tensión con el árbol v2 (28-jun)** que bajó dirección a ~1% — reconciliar: el ángulo vivo es validación→movilización en SHOP, no calidad de dirección.
- 2026-06-24 (PM) — **1ª sesión del taller = Cell Board 24-jun.** Volcada la lluvia de ideas en 3 categorías, restricciones (checkouts externos, manzanas), propuestas de Juan (cambio dirección ≤500m/misma ciudad si COD ok) y la **decisión de reformular** el proyecto de validación. Registrado el tema paralelo de integración 8-fases (Carlos Peralta). Fuente: notas Gemini.
- 2026-06-24 — Sembrado el spec. Discovery se produce en el taller; vinculado al Figma board y a la fuga pre-red (validación SHOP / `is_validated`). Jira pendiente (conector caído).
