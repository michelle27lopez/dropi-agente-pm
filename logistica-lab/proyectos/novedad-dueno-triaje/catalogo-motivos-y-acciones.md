# Catálogo canónico de novedades y acciones de solución

> Borrador de definición · Logistic Success · 2026-08-24 · Obedece `metodologia/spec-driven.md` (estado + fuente, cero placeholders).
> Habilitante de `spec.md` (PRM-1512). Evidencia en `research-novedades-jun2026.md`.
> Estados: ⚪ propuesto · 🟡 definido · 🟢 construido · ⛔ no-objetivo. Fuentes: `[data]` `[obs]` `[doc]`.

## Por qué existe este documento

Hoy el módulo de Novedades ofrece **una sola acción para 324 etiquetas distintas**: un binario *Sí / NO*
(reofrecer o devolver al remitente). `[obs 2026-08-24]` ⚠️ **Verificado en la instancia de Colombia; los otros 9 países no se han revisado.** No hay filtro por motivo, el motivo no es un
campo consultable, y `Solución` / `Usuario Solución` nunca se llenan. `[obs]`

Sin un catálogo cerrado no se puede triar, ni asignar dueño, ni medir recuperación. Este documento
define **las dos tablas que faltan**: los motivos canónicos y las acciones que cada uno habilita.

---

## Parte 1 · Los 12 motivos canónicos

Homologación de las **324 etiquetas** de junio 2026 (10 países, 42 pares país×carrier).
Cobertura: **99,5% del volumen**. Mapa completo etiqueta→motivo: `scratch/novedades/mapa-homologacion.csv`. `[data]`

| ID | Motivo canónico | Etiq. | Novedades | % mix | Rescate hoy | Techo (P75) | Entregas/mes en juego | Triaje |
|---|---|---:|---:|---:|---:|---:|---:|---|
| **N01** | Reprogramación — el destinatario pide otra fecha | 18 | 170.720 | 18,7% | 21,1% | 53,3% | **+54.906** | 🔴 REDISEÑAR |
| **N02** | Cambio de dirección | 9 | 10.111 | 1,1% | 29,3% | 32,1% | +277 | 🟢 PELEAR |
| **N03** | Dirección insuficiente o errada | 35 | 122.256 | 13,4% | 20,6% | 28,8% | **+10.052** | 🔴 REDISEÑAR |
| **N04** | Destinatario no contactable | 10 | 62.728 | 6,9% | 28,6% | 36,2% | +4.729 | 🟡 MEJORAR |
| **N05** | Destinatario ausente en la visita | 22 | 115.255 | 12,6% | 33,3% | 45,7% | **+14.298** | 🟢 PELEAR |
| **N06** | Destinatario desconocido en la dirección | 10 | 25.008 | 2,7% | 14,7% | 21,2% | +1.617 | 🟡 MEJORAR |
| **N07** | Entrega condicionada por acceso o punto | 15 | 11.474 | 1,3% | 22,3% | 30,6% | +955 | 🟡 MEJORAR |
| **N08** | Rechazo — arrepentimiento | 35 | 298.570 | 32,8% | 4,6% | 6,0% | +4.127 | ⚫ SOLTAR |
| **N09** | Rechazo — no reconoce la compra | 10 | 9.230 | 1,0% | 7,9% | — | 0 | ⚫ SOLTAR |
| **N10** | Rechazo — disconformidad con el producto | 13 | 12.054 | 1,3% | 5,9% | 7,6% | +205 | ⚫ SOLTAR |
| **N11** | No paga — recaudo COD | 11 | 31.322 | 3,4% | 27,4% | 35,2% | +2.443 | 🟡 MEJORAR |
| **N12** | Incidente operativo del carrier | 47 | 38.336 | 4,2% | 8,8% | 35,4% | **+10.198** | 🔴 REDISEÑAR |
| N99 | Sin homologar (cola larga) | 89 | 4.104 | 0,5% | 25,1% | — | — | revisar trimestral |
| | **TOTAL** | **324** | **911.168** | 100% | **17,0%** | | **+103.807** | |

`[data]` **Techo (P75)** = el cuartil superior que algún país×carrier ya alcanza hoy, en producción, dentro de ese mismo motivo. No es meta inventada.

> ⚠️ `[HIPÓTESIS a validar]` El P75 es alcanzable en promedio, no orden a orden. Sirve para priorizar, no como compromiso de KR.

---

## Parte 2 · El inventario completo de acciones

Todas las opciones que puede ofrecer una novedad. Hoy existen **dos** (A13 y A14). `[obs]`

### Acciones que resuelven (el comprador o el vendedor cambian algo)

| ID | Acción | Quién la ejecuta | Qué necesita para existir |
|---|---|---|---|
| **A01** | Reprogramar fecha de entrega | Comprador | Calendario de fechas hábiles del carrier + API de reprogramación |
| **A02** | Elegir franja horaria | Comprador | Franjas disponibles por ciudad/carrier |
| **A03** | Cambiar dirección de entrega | Comprador | Validación de cobertura + regla de re-tarifa |
| **A04** | Compartir ubicación (pin o WhatsApp) | Comprador | Campo de coordenada en la orden — **hoy no existe medible** `[doc:tema 11 H5]` |
| **A05** | Completar datos de dirección (interior, piso, referencia) | Comprador | Campos estructurados, no texto libre |
| **A06** | Autorizar a un tercero a recibir | Comprador | Registro de autorizado + evidencia |
| **A07** | Redirigir a punto de retiro / oficina del carrier | Comprador | Red de puntos por carrier + plazo de custodia |
| **A08** | Actualizar teléfono de contacto | Comprador o dropshipper | Reintento de contacto automático tras el cambio |
| **A09** | Re-confirmar la compra | Comprador | Prompt explícito; hoy se asume `[obs]` |
| **A10** | Cambiar el pago (link, anticipo parcial) | Comprador | Pasarela + regla de qué pasa con el COD |
| **A11** | Reofrecer con descuento o cambio de producto | Dropshipper / Marca | Regla comercial + quién asume el diferencial |
| **A12** | Autorizar apertura/verificación antes de pagar | Dropshipper / Marca | Política por producto + evidencia del repartidor |

### Acciones que cierran

| ID | Acción | Quién | Nota |
|---|---|---|---|
| **A13** | Reintentar sin cambios | Dropshipper | **Existe hoy** = botón *Sí*. Sin cambio en la causa, el 2º intento rinde 10-40% `[doc:tema 04]` |
| **A14** | Devolver al remitente | Dropshipper (o por omisión) | **Existe hoy** = botón *NO*, y también es el default si nadie hace nada `[obs]` |
| **A15** | Devolución express (soltar rápido) | Sistema | ⚪ nueva — para N08/N09/N10, sin esperar gestión |

### Capacidades de sistema (no son acciones del usuario, pero sin ellas nada funciona)

| ID | Capacidad | Por qué |
|---|---|---|
| **S01** | Motivo canónico como campo consultable (columna + filtro + agrupación) | Hoy es un blob de texto en bandeja y **un número pelado** en el Historial `[obs]` |
| **S02** | Registro obligatorio de solución (`Solución` + `Usuario` + `Fecha`) para cerrar | Hoy vacías en el 100% de filas observadas, incluso en `NOVEDAD SOLUCIONADA` `[obs]` |
| **S03** | Dueño + SLA + antigüedad visible | Novedades de hace 4 semanas seguían abiertas `[obs]` |
| **S04** | Canal de contacto al comprador desde la novedad | El WhatsApp del modal escribe al área de Dropi, no al destinatario `[obs]` |

---

## Parte 3 · La matriz motivo × acción

Qué debe ofrecer cada motivo. Esta es la tabla que TI implementa.

| Motivo | Acciones primarias | Acciones secundarias | Cierre | Dueño propuesto | SLA propuesto |
|---|---|---|---|---|---|
| **N01** Reprogramación | **A01 · A02** | A03, A07, A08 | A13 → A14 | Dropi (automático) | 24h para captar fecha |
| **N02** Cambio de dirección | **A03 · A04** | A05, A07 | A13 → A14 | Dropi (automático) | 24h |
| **N03** Dirección insuficiente | **A04 · A05** | A03, A08 | A13 → A14 | Dropi (automático) | 24h |
| **N04** No contactable | **A08 · A04** | A01, A07 | A13 → A14 | Dropshipper (tiene el canal) | 48h |
| **N05** Ausente en la visita | **A01 · A02 · A06** | A07 | A13 → A14 | Dropi (automático) | 24h |
| **N06** Desconocido en la dirección | **A03 · A04** | A08, A06 | A13 → A14 | Dropshipper | 48h |
| **N07** Acceso o punto | **A07 · A06** | A02, A05 | A13 → A14 | Dropi (automático) | 24h |
| **N08** Arrepentimiento | **A11** (única con señal) | A09 | **A15 express** | ⛔ no gestionar | cierre inmediato |
| **N09** No reconoce la compra | **A09** | — | **A15 express** | ⛔ no gestionar · ⚠️ revisar si es fraude o error de captura | cierre inmediato |
| **N10** Disconformidad | **A12 · A11** | — | **A15 express** | Dropshipper (es su producto) | 24h y cerrar |
| **N11** No paga COD | **A10 · A01** | A11 | A13 → A14 | Dropshipper | 48h |
| **N12** Incidente del carrier | ⛔ ninguna del comprador | — | reclamo al carrier | **Dropi / operación** — no es del dropshipper | 72h con el carrier |

> **Regla de oro:** ningún motivo debe cerrarse en A14 sin haber ofrecido al menos una acción primaria — salvo N08/N09/N10, donde A15 es lo correcto y lo barato.

---

## Parte 4 · Qué se construye primero

| Fase | Qué | Por qué en ese orden | Costo |
|---|---|---|---|
| **0** | **S01 + S02** — motivo canónico consultable + registro obligatorio de solución | Sin esto no hay triaje ni baseline. Todo lo demás es inmedible | Bajo — es dato y UI, no flujo |
| **1** | **A15** para N08/N09/N10 (320K novedades, 5% de rescate) | Libera capacidad y baja costo sin perder entregas materiales | Bajo |
| **2** | **A01 + A02** para N01 (170.720 novedades, +54.906 de techo) | Es el 53% de todo el premio | Medio — depende de API del carrier |
| **3** | **A04 + A05** para N03/N02 (132K, +10.329) | Engancha con `direccion-confiable-geo` | Medio |
| **4** | **S03** dueño + SLA + antigüedad | Convierte el catálogo en operación | Medio |
| **5** | N12 al owner correcto (operación, no dropshipper) | +10.198, y hoy se le pide al vendedor resolver algo que no controla | Bajo |

> **No-objetivo (⛔):** construir las 15 acciones a la vez; pelear N08 (95% devuelve); reintentar a ciegas sin cambiar la causa — el 1er intento decide. `[doc:tema 04]`

---

## Preguntas abiertas — para TI y operación

- [ ] **¿Qué carriers exponen API de reprogramación y cambio de dirección?** Sin eso, A01/A02/A03 son teatro. Empezar por Envía (37% del volumen) — Juan + Michel Pino
- [ ] **¿El campo `Solución` tiene catálogo cerrado en backend o es texto libre?** Define si S02 es una migración o solo hacerlo obligatorio — TI
- [ ] **¿Quién es el dueño operativo de N12?** Hoy el incidente del carrier le llega al dropshipper — Juan + operación
- [ ] **¿Qué pasa con la tarifa cuando cambia la dirección (A03)?** Regla comercial pendiente — Juan + comercial
- [ ] **N09 (9.230/mes, "no reconoce la compra"):** ¿es error de captura, es fraude, o es que el comprador olvidó? Cambia por completo qué se hace — Data + Backoffice
- [ ] **Validar la homologación con operación:** los 12 motivos salieron de la data, no de una sesión con quien gestiona novedades — Juan + operación

## Changelog

- 2026-08-24 — Alcance del `[obs]` acotado a Colombia. El inventario de acciones (Parte 2) asume que las otras instancias son iguales — **supuesto sin verificar**.
- 2026-08-24 — Catálogo creado. 324 etiquetas → 12 motivos canónicos (99,5% de cobertura). Inventario de 15 acciones + 4 capacidades de sistema. Matriz motivo×acción con dueño y SLA propuestos. **Borrador: falta validarlo con operación y con TI.**
