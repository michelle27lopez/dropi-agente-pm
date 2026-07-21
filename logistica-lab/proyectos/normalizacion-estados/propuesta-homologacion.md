# Propuesta de homologación de estados — cómo debería quedar

> **Estado: 🟡 BORRADOR v0 (2026-07-12) — para mesa de trabajo, aún NO aprobado.**
> Reconcilia tres insumos: el **modelo actual** (`Estados_Consolidados.xlsx`, 621 filas / 10 países),
> la **propuesta objetivo** (PDF macro-proceso, 24 estados / 7 fases) y el **CONTEXTO** de datos reales
> ([`CONTEXTO_ESTADOS_DROPI.md`](CONTEXTO_ESTADOS_DROPI.md)). Fuente de verdad interna sigue siendo el
> [`spec.md`](spec.md); esto es el anexo de diseño del catálogo.

---

## 1 · Diagnóstico del modelo ACTUAL (evidencia, no opinión)

El Excel actual homologa con **3 columnas**: `ESTATUS AGRUPADO`, `ESTATUS MOVILIDAD`
(`MOVILIZADOS`/`NO MOVILIZADOS`) y `PROCESO` (`CON`/`SIN CIERRE LOGISTICO` / `NO PROCESADO`).
El eje `TRANSPORTADORA` existe pero **está vacío en las 621 filas**. Problemas medidos:

| # | Problema | Evidencia dura |
|---|----------|----------------|
| **P1** | **La agrupación no discrimina — colapsa todo en un balde.** | **458/621 (74%)** de los estados caen en `EN PROCESAMIENTO`. Todo lo que pasa entre "guía generada" y "entregado" es indistinguible. |
| **P2** | **Etiquetas destino inconsistentes** (mismo concepto, varios nombres). | `DEVOLUCION` vs `DEVOLUCIÓN`; `NO MOVILIZADO` vs `NO MOVILIZADOS` vs `SIN MOVIMIENTOS`; `INDEMNIZADA`/`INDEMNIZADO`/`INDEMNIZACION`/`INDEMNIZADA POR DROPI` (4 etiquetas para lo mismo). |
| **P3** | **El mismo estado crudo se homologa distinto entre países** (error de llenado, no semántica). | `CANCELADO` → `{CANCELADO, NO MOVILIZADO, NO MOVILIZADOS, SIN MOVIMIENTOS}` según país. `PENDIENTE`, `RECHAZADO`, `GUIA_GENERADA` idem. Confirma el hallazgo del CONTEXTO: **no falta eje `país`, falta consistencia.** |
| **P4** | **El flag `MOVILIDAD` tiene errores lógicos.** | `ANULADA`, `ANULADO`, `CANCELADA`, `CANCELADO POR TRANSPORTADORA` aparecen marcados `MOVILIZADOS` en algunas filas — una orden anulada/cancelada no está "movilizada". 7 estados crudos con movilidad contradictoria. |
| **P5** | **"Retiro en oficina/punto" se pierde por completo** (el caso que pediste). | 14 estados crudos de retiro en punto (`RECLAME EN OFICINA`, `EN PUNTO DROOP`, `EN OFICINA`, `DISPONIBLE PARA RETIRO EN OFICINAS DE AEX`, `RETIRO POR SUCURSAL`, `DISPONIBLE EN SUCURSAL`…) **todos → `EN PROCESAMIENTO`**. No se puede saber que el paquete llegó y espera al cliente. |
| **P6** | **`MOVILIDAD` y `PROCESO` están llenados a mano** en vez de derivarse del estado → cada nuevo estado reintroduce P3/P4. |

**Lectura de fondo:** el modelo actual es un *diccionario plano llenado a mano*. La propuesta del
PDF ya es mejor (24 estados, 7 fases), pero es una **taxonomía de display**: nombra, no declara qué
implica cada estado (¿salió de bodega? ¿es terminal? ¿toca stock?). El objetivo junta lo mejor de
los tres y **convierte columnas-de-texto en un modelo por capas con flags derivados**.

---

## 2 · Cómo debería quedar — modelo por CAPAS (no una sola columna)

La homologación no es *una* columna: es un modelo de 4 capas + flags. El estado crudo entra por
abajo y sube; las capas superiores se **derivan**, no se rellenan a mano.

```
NIVEL 0 · ESTADO CRUDO            → lo que emite el carrier/Dropi (≈50 reales, ~900 catálogo)
   │  (mapeo N:1, normalizado por acento/mayúsculas/plurales)
   ▼
NIVEL 1 · ESTADO HOMOLOGADO       → catálogo único operador (~24, base PDF) ← la "verdad" interna
   │  cada uno con FLAGS declarados (no columnas sueltas):
   │     · fase                 (una de las 7)
   │     · movilizado           (bool)         ← reemplaza ESTATUS MOVILIDAD, computado
   │     · cierre_logistico     (enum)         ← reemplaza PROCESO, computado
   │     · terminal             (bool)         ← ¿estado final?
   │     · reversible           (bool)         ← una novedad se resuelve; una entrega no
   │     · salida_fisica_bodega (bool)         ← CONTEXTO §7: decide descuento de inventario
   │     · efecto_stock         (consume|libera|ninguno)
   ▼
NIVEL 2 · FASE                    → las 7 del PDF (Gestión, ECOM, Dropi, Transporte, Novedad, Siniestro, Devolución)
   ▼
NIVEL 3 · VISTA CLIENTE FINAL     → 8 estados (el cliente NO ve 24) — CONTEXTO §8.3
```

**Por qué así:**
- **Elimina P2/P3/P4 de raíz:** `movilizado` y `cierre_logistico` se **calculan** desde el estado
  homologado. Si `ENTREGADO.movilizado = true` se define una vez, ningún país lo puede contradecir.
- **Resuelve P1/P5:** el Nivel 1 tiene granularidad real (incluye "Disponible para retiro", "En
  reparto", los 3 niveles de novedad) → deja de existir el balde `EN PROCESAMIENTO`.
- **Separa operador vs cliente** (Nivel 1 vs Nivel 3): el operador ve los 24; el cliente ve 8.

---

## 3 · Catálogo objetivo — Nivel 1 (los ~24 + el nuevo de retiro)

Base = los 24 del PDF. **En negrita los cambios/adiciones respecto del PDF** (para trazar la decisión).

| Fase | Estado homologado (operador) | movilizado | salida bodega | terminal | Vista cliente (Nivel 3) |
|------|------------------------------|:---------:|:-------------:|:--------:|-------------------------|
| **1 · Gestión** | Por confirmar | no | no | no | En preparación |
| | Pendiente | no | no | no | En preparación |
| | Guía generada | no | no | no | En preparación |
| | Cancelado | no | no | **sí** | Cancelado |
| | Rechazado | no | no | **sí** | Cancelado |
| **2 · ECOM** *(si proveedor usa ECOM)* | Preparado para transportadora | no | no | no | En preparación |
| | Entregado a transportadora | **sí** ⚠️ | **sí** ⚠️ | no | En camino |
| **3 · Dropi** *(si usa recolección Dropi)* | Recogido por Dropi | sí | sí | no | En camino |
| | En bodega Dropi | sí | sí | no | En camino |
| **4 · Transporte** | Recogido | sí | sí | no | En camino |
| | En tránsito | sí | sí | no | En camino |
| | En bodega destino | sí | sí | no | En camino |
| | En reparto | sí | sí | no | En reparto |
| | **Disponible para retiro en punto/oficina** 🆕 | sí | sí | no | **Disponible para retiro** 🆕 |
| | Entregado | sí | sí | **sí** | Entregado |
| **5 · Novedad** | Novedad 1 / 2 / 3 | sí | sí | no (reversible) | Novedad en tu pedido |
| | Reintento 1 / 2 | sí | sí | no | En reparto |
| | Novedad solucionada | sí | sí | no | En camino |
| **6 · Siniestro** | Siniestro | sí | sí | no | Novedad en tu pedido |
| | Indemnizado | sí | sí | **sí** | Proceso finalizado |
| **7 · Devolución** | En devolución | sí | sí | no | En devolución |
| | Devuelto | sí | sí | no | En devolución |
| | Devolución confirmada por bodega | sí | libera stock | **sí** | Proceso finalizado |

> ⚠️ **`Entregado a transportadora`** es la trampa del CONTEXTO §7: el nombre suena a "preparación"
> pero el paquete **ya salió de bodega** → `salida_fisica_bodega = sí`. Si se marca como "adentro",
> el inventario nunca se descuenta. Cada celda ⚠️/negrita de "salida bodega" es una decisión contable.

**Vista cliente final (Nivel 3) — 8 + 1:** En preparación · En camino · En reparto ·
**Disponible para retiro** 🆕 · Novedad en tu pedido · Entregado · En devolución · Cancelado
(+ Proceso finalizado para casos cerrados). El cliente nunca ve "Recogido por Dropi", "En bodega
destino" ni "Siniestro" — no significan nada para quien compró.

---

## 4 · El caso que pediste, resuelto: "retiro en oficina" → trazable

Hoy (P5) los 14 estados crudos de retiro-en-punto se pierden en `EN PROCESAMIENTO`. Propuesta:

| Estado crudo (varios países) | Hoy | **Debería mapear a** |
|------------------------------|-----|----------------------|
| `RECLAME EN OFICINA` (CO), `EN PUNTO DROOP` (CO), `EN OFICINA` (PY), `DISPONIBLE PARA RETIRO EN OFICINAS DE AEX` (PY), `EN OFICINAS DE AEX` (PY), `DISPONIBLE EN SUCURSAL` (CL), `EN ESPERA EN OFICINA` (CL), `ADMITIDA EN SUCURSAL` (CL), `RETIRO POR SUCURSAL` (AR), `ASIGNADO A SUCURSAL DESTINO` (CO)… | `EN PROCESAMIENTO` (indistinguible) | **`Disponible para retiro en punto/oficina`** (Fase 4, `movilizado=sí`, `salida_bodega=sí`, cliente = **"Disponible para retiro"**) |

**Por qué importa para el negocio (no es cosmético):** un paquete "disponible para retiro" está
**a un paso de entregado** — la logística ya cumplió, falta que el cliente vaya. Es una **palanca de
movilización y de % de entrega**: se puede notificar al cliente, medir cuánto tarda el retiro, y
separar "no entregado por Dropi" de "no retirado por el cliente". Enterrado en `EN PROCESAMIENTO` no
se puede hacer nada de eso. Es el ejemplo canónico de por qué la granularidad del Nivel 1 paga.

---

## 5 · Reglas de mapeo (Nivel 0 → Nivel 1)

1. **Normalizar el crudo antes de mapear:** upper-case + quitar acentos + colapsar plurales/guiones
   (`DEVOLUCIÓN`=`DEVOLUCION`, `NO MOVILIZADO`=`NO MOVILIZADOS`). Elimina P2 y la mitad de P3.
2. **Mapear por volumen real** (CONTEXTO §4): los ~50 estados que circulan cubren ~100% del tráfico;
   los ~400 con cero ocurrencias caen en el default.
3. **Default observable:** todo crudo no mapeado → `Sin clasificar` (visible, con alerta), nunca a
   `EN PROCESAMIENTO` silencioso. Alguien lo revisa y lo promueve.
4. **`movilizado`, `cierre_logistico`, `terminal`, `salida_bodega`, `efecto_stock` se derivan del
   Nivel 1**, no se llenan por fila. Un estado nuevo hereda los flags de su homologación.
5. **Estado efectivo de la orden = último `history[]` por `id`**, no la cabecera (CONTEXTO §1.1).

---

## 6 · Investigación de las 6 colisiones (carrier-by-carrier) — datos reales

Extraído del Excel de campo (`Homologacion_Estados_Final.xlsx`, hoja "1. Base de Datos", 576 mapeos
por transportadora). **Son exactamente 6** — el mismo estado crudo recibió propuesta distinta según
carrier. Mi lectura clasifica cada una en *llenado* (mismo evento, nombre distinto → se resuelve con
regla global) vs *semántica real* (el evento significa distinto → exige eje transportadora):

| # | Estado crudo | Qué propuso cada carrier | Veredicto | Recomendación | Confirmar con Ops |
|---|--------------|--------------------------|-----------|---------------|-------------------|
| 1 | **PENDIENTE** | ENVIA→*Por confirmar* · INTERRAPIDISIMO/VELOCES→*En preparación* | 🟢 **Llenado** | Global → **En preparación** (ninguno emite un "por confirmar" de carrier; eso es estado de orden Dropi, no de guía) | — |
| 2 | **RECHAZADO** | ENVIA/VELOCES→*Devolución* · INTERRAPIDISIMO→*Rechazado* | 🟢 **Llenado / modelado** | Global → **Rechazado** como estado propio que *transiciona a* devolución (no colapsar los dos) | — |
| 3 | **MERCANCIA RECOGIDA** | ENVIA→*Recibido transportadora* · TCC→*En tránsito* | 🟢 **Llenado (granularidad)** | Global → **Recibido transportadora** (evento = carrier ya tiene el paquete; "en tránsito" es el paso siguiente) | — |
| 4 | **REEMPLAZADA** | ENVIA/INTERRAPIDISIMO/VELOCES→*Cancelado* · TCC→*Excepción* | 🟢 **Llenado** (3 vs 1) | Global → **Cancelado/Reemplazada** (TCC usa "Excepción" como cajón de sastre). Cruza con Guías Reemplazatorias (PRM-745) | ⚠️ ligero — validar con TCC |
| 5 | **RECOGIDA FALLIDA** | ENVIA→*En preparación* · INTERRAPIDISIMO→*Novedad* | 🟡 **Probable llenado** | Global → **Novedad (de recolección)** — una recogida fallida ES una novedad; "En preparación" sub-clasifica | ⚠️ validar con ENVIA |
| 6 | **INTENTO DE ENTREGA** | INTERRAPIDISIMO→*En reparto* · VELOCES→*Novedad* | 🔴 **Posible semántica REAL** | **Depende del momento en que cada carrier lo emite:** ¿al salir a repartir (=En reparto) o tras fallar el intento (=Novedad)? Único caso que podría exigir el eje transportadora | 🔴 **confirmar con INTERRAPIDISIMO y VELOCES** |

**Conclusión de la investigación:** **5 de 6 son inconsistencias de llenado** → se resuelven con un
**catálogo global** + regla de normalización. **Solo `INTENTO DE ENTREGA` (1) es candidata a colisión
semántica real.** 

**Recomendación de arquitectura (a validar):** clave **global `estado_crudo`** como base, con la
**capacidad de override `(transportadora, estado_crudo)` reservada solo para excepciones confirmadas**
(hoy: máximo 1, `INTENTO DE ENTREGA`). Así el 99% del modelo es simple y no se paga el costo del eje
carrier salvo donde hay evidencia de que el evento realmente difiere. **No** llenar el eje a mano para
todo (eso reintroduce el problema P6).

## 7 · Decisiones abiertas (para la mesa de trabajo)

- [ ] 🔴 **Confirmar `INTENTO DE ENTREGA`** con INTERRAPIDISIMO y VELOCES: ¿lo emiten al salir a
      reparto o tras fallar? Decide si se activa el override por transportadora. **Es el único gate real.**
- [ ] 🟡 Validar las 2 dudas ligeras (`REEMPLAZADA`/TCC, `RECOGIDA FALLIDA`/ENVIA).
- [ ] 🟡 ¿La vista cliente suma "Disponible para retiro" (9 estados) o se mantiene en 8? (recomiendo sumarlo).
- [ ] 🟡 Validar los flags contables (`salida_bodega`, `efecto_stock`) con quien maneja inventario —
      especialmente `Entregado a transportadora`, `Despachada`, `Novedad`, `Devolución`.
- [ ] 🟡 ¿Se conservan los 3 niveles de novedad + reintentos del PDF, o se colapsan? (el Excel hoy los colapsa).
- [ ] ⚪ Recalcular el diff contra la base actual (~900 estados), no contra el Excel viejo (CONTEXTO §9).

## 8 · Catálogo destino real — volúmenes de mapeo (Excel de campo)

Los 21 estados propuestos en el trabajo de campo, con **cuántos estados crudos** mapea cada uno
(576 mapeos, 7 carriers). Confirma la regla "priorizar por volumen": **`Novedad` sola concentra 346
mapeos (60%)** — ahí está toda la complejidad; el resto es cola larga.

| Estado destino | Mapeos | | Estado destino | Mapeos |
|----------------|-------:|---|----------------|-------:|
| Novedad | 346 | | Recibido transportadora | 11 |
| En tránsito | 55 | | Proceso finalizado | 8 |
| En preparación | 26 | | Indemnizado | 6 |
| Devolución | 20 | | **Reclamo en oficina** 🎯 | 5 |
| En reparto | 19 | | Excepción | 4 |
| Cancelado | 17 | | Novedad solucionada | 4 |
| Entregado | 15 | | Incautado | 3 |
| Devolución en proceso | 15 | | En proceso de indemnización | 2 |
| Recolectado por Dropi | 12 | | Por confirmar / Rechazado / Siniestro | 2/1/1 |

> 🎯 **Ojo:** "Reclamo en oficina" ya existía en el campo con **solo 5 mapeos** — está infra-usado.
> El diagnóstico del Excel *actual* (§1, P5) muestra por qué: 14 estados crudos que deberían caer ahí
> siguen yendo a `EN PROCESAMIENTO`. Es exactamente el estado a robustecer.
> ⚠️ 346 mapeos a `Novedad` sin subdividir contradice los 3 niveles novedad/reintento del PDF → decisión abierta §7.

## 9 · Casos de guías reales — 14 trazas de punta a punta

De la hoja "4. Guías de Prueba" (Excel de campo): 14 guías reales de 7 carriers con su secuencia
homologada completa. **Es el mejor insumo para revisar la ruta y los estados finales** — muestran qué
pasa de verdad, no en teoría.

| Guía (carrier) | Ruta homologada (resumida) | Final |
|---|---|---|
| Interrapidísimo 240028493814 | Pend.conf → Pend → Guía gen → Recibido transp → *En tránsito ×5* → En reparto → Novedad → **Devolución** | Devolución |
| Coordinadora 36393180723 | … Recibido transp → En tránsito → En reparto → **Novedad → En reparto → Novedad → …solucionada → En reparto → Entregado** | ✅ Entregado |
| ENVIA 114014276600 | … En reparto → **Novedad→solucionada ×3** → En tránsito → En reparto → Devolución | Devolución |
| 99minutos 3864790571 | Pend → Guía gen → En prep → Recolectado Dropi → **En bodega Dropi** → Recibido transp → … → Devolución en proceso → Devolución | Devolución |
| Veloces V4001043459 | … Recibido transp → En tránsito ×3 → **Entregado → En reparto → Entregado** | ✅ Entregado |
| Domina 85910403203823 | … En bodega Dropi → Recibido transp → En tránsito → En reparto → Novedad → En reparto → **Entregado → Entregado** | ✅ Entregado |

*(Las 14 completas se regeneran del Excel; ruta típica = Pend.conf → Pend → Guía gen → [Recolectado Dropi → En bodega Dropi] → Recibido transp → En tránsito → En reparto → {Entregado | Novedad… | Devolución}.)*

### 9.1 · Tres hallazgos que obligan a revisar el catálogo

**① Tu lista de 22 tiene huecos — 4 estados que las rutas reales SÍ usan y no están en la lista:**

| Estado usado en rutas | Veces | En tu lista de 22 |
|---|---:|---|
| `Pendiente` | 14 | ❌ (tienes "Por confirmar"/"En preparación") |
| `Guía generada` | 14 | ❌ |
| `Pendiente confirmación` | 11 | ❌ |
| `En bodega Dropi` | 5 | ❌ |

→ El catálogo y la homologación aplicada **no coinciden**: el campo usó estados más granulares que la
lista canónica. **Confirma tu intuición ("pueden ser más").** Faltan además, del PDF: `Recogido`,
`En bodega destino`, `Preparado/Entregado a transportadora` (fase ECOM). El catálogo real es **~26–28**, no 22.

**② Los estados "finales" NO son terminales en los datos crudos (crítico):**

| Violación real | Guía |
|---|---|
| `Entregado → En reparto → Entregado` | Veloces V4001043459 |
| `Proceso finalizado → Cancelado → Devolución` | Interrapidísimo 240028451950 |
| `Entregado → Entregado`, `Devolución → Devolución` (rebotes/duplicados) | Domina, Interrapidísimo |

→ Una guía **entregada vuelve a reparto**; una "finalizada" sigue moviéndose. **No se puede confiar en
el último evento crudo como estado final.** El modelo necesita: (a) la regla *estado efectivo = último
`history[]` por `id`* (CONTEXTO §1.1), (b) distinguir **estado observado** vs **estado final confirmado**
(un `Entregado` se confirma tras N horas sin rebote), (c) declarar qué estados son reversibles.

**③ En 14 guías reales solo aparecen 2 estados finales: `Devolución` (11) y `Entregado` (3).**
Los otros finales propuestos (`Rechazado`, `Indemnizado`, `Proceso finalizado`, `Siniestro`, `Incautado`,
`Excepción`) y también `Por confirmar`/`Reclamo en oficina` **no aparecen** → son cola larga rara. Hay
que tenerlos, pero **priorizar el modelado del par Entregado/Devolución y del ciclo de novedades**, que
es el 90% del tráfico.

## 10 · Ruta propuesta (máquina de estados) y estados finales

**Camino feliz + ramas** (derivado de las 14 rutas reales, no inventado):

```
Por confirmar → Pendiente → Guía generada
     │                          │
     │            (si ECOM) Preparado transp. → Entregado a transp.
     │            (si Dropi) Recolectado Dropi → En bodega Dropi
     ▼                          ▼
  Recibido transportadora → En tránsito ⇄ En reparto
                                   │           │
                                   │           ├─► Disponible para retiro 🆕 ─► Entregado ✅
                                   │           ├─► Entregado ✅
                                   │           └─► Novedad ⇄ (reintento) ─► Novedad solucionada ─► En reparto
                                   │                    └─(agota reintentos)─► Devolución en proceso ─► Devolución ↩
                                   └─► [Siniestro → En proceso indemnización → Indemnizado]  (rama rara)
```

**Estados finales — revisión (con su regla de cierre):**

| Estado final | ¿Terminal real? | Regla propuesta |
|---|---|---|
| **Entregado** | ⚠️ rebota en crudo | Terminal **solo tras confirmación** (N h sin nuevo evento). Libera nada; cierra la orden. |
| **Devolución** (confirmada por bodega) | ⚠️ se repite | Terminal cuando bodega confirma recepción; **libera stock**. |
| **Cancelado** | sí | Terminal. Pre-movilización. |
| **Rechazado** | sí | Terminal; transiciona a devolución física si el paquete ya salió. |
| **Indemnizado** | sí | Terminal (rama siniestro). |
| **Proceso finalizado** | ❌ **no confiable** | En datos crudos NO es terminal → **revisar si debe existir o es ruido**. Decisión abierta. |

## 10.A · Recorrido DETALLADO del macro-proceso (escenarios, condiciones y responsables)

> Transcrito del PDF "Macro proceso Logística" caja por caja. **Aquí está la lógica fina que el
> resumen aplastó:** cuándo se va a un lado, cuándo al otro, quién es responsable y qué estados crudos
> de carrier alimentan cada estado homologado. Es el insumo directo para el hand-off a TI.

### Entrada — 3 rutas según ECOM/Dropi (regla dura: *si usa Dropi → DEBE usar ECOM*)

| Caso | Condición | Ruta tras `Guía generada` |
|---|---|---|
| **1 · Directo** | Proveedor **NO** usa ECOM | `Guía generada` ───────────────► `Recogido` *(salta ECOM y Dropi)* |
| **2 · ECOM sin Dropi** | Usa ECOM, entrega directa a transportadora | `Guía generada → Preparado transp.[ECOM] → Entregado a transp.[ECOM] → Recogido` |
| **3 · ECOM + Dropi** | Usa ECOM **y** recolección Dropi | `Guía generada → Preparado[ECOM] → Recogido Dropi → En bodega Dropi → Entregado transp.[ECOM] → Recogido` |

### Fase 1 · Gestión de orden *(estados de la ORDEN Dropi)*
`Por confirmar → Pendiente → Guía generada`. Al generar guía, **responsable = Proveedor** (debe imprimir
guía y preparar el pedido); desde ahí salen los 3 casos. **Dos salidas terminales:**
- **CANCELADO** vía *Proveedor rechazó la orden* (razones: sin inventario · producto descontinuado · zona no cubierta).
- **CANCELADO** vía *Dropshipper canceló* — puede cancelar desde **Por confirmar, Pendiente, Guía generada o Preparado** (si la transportadora aún no lo tiene).

### Fases 2·3 · ECOM y Dropi *(opcionales, responsable = Dropi/Proveedor)*
`Preparado para transportadora → [Recogido Dropi → En bodega Dropi] → Entregado a transportadora`.
En **Caso 3**, Dropi recoge el paquete del proveedor (`Recogido Dropi → En bodega Dropi`) **antes** de
"Entregado a transportadora". Solo si usa Dropi (ECOM obligatorio).

### Fase 4 · Transporte y entrega *(responsable = Transportadora)* — con los crudos que alimentan cada estado
| Estado homologado | Estados crudos de carrier que lo alimentan | Condición de llegada |
|---|---|---|
| **Recogido** | `Admitida`, `En bodega origen`, `Recogido` | Directo desde Guía (sin ECOM) **o** desde Entregado transp. (ECOM) |
| **En tránsito** | `En tránsito nacional`, `En tránsito intermunicipal`, `Despachado` | Viajando hacia la ciudad del cliente |
| **En bodega destino** | `En bodega destino`, `Llegó a destino` | Llegó a la ciudad, listo para asignar reparto |
| **En reparto** | `Última milla`, `En distribución`, `Con mensajero` | ⚠️ En bodega destino → En reparto **solo la PRIMERA VEZ / intento 1** |
| **Entregado** ⏹ | `Entregado`, `Entrega exitosa` | Cliente recibió — Estado FINAL |

### Fase 5 · Novedades y reintentos — **el ciclo de hasta 3 intentos** (esto es lo que más me faltó)
```
En reparto ──► NOVEDAD 1 (intento 1 de 3)
                 │  solucionable: cliente ausente · dirección incorrecta · zona difícil acceso
                 │  NO solucionable: Rechazado ──► Devolución
                 ▼
             REINTENTO 1 ──► éxito int.1 ──► ENTREGADO ✅
                 └── falla int.2 ──► NOVEDAD 2 (paquete en bodega destino, preparando intento 2)
                                        ▼
                                    REINTENTO 2 ──► éxito int.3 ──► ENTREGADO ✅
                                        └── falla int.3 ──► NOVEDAD 3 (preparando intento 3, último)
                                                              ├── éxito ──► ENTREGADO ✅
                                                              └── intentos agotados ──► DEVOLUCIÓN
```
**Clave:** el reintento vuelve a "En reparto"; se agotan **3 intentos** antes de devolución; un
`Rechazo` (no solucionable) salta a devolución desde cualquier novedad. El Excel de campo **colapsa
todo esto en `Novedad`/`Novedad solucionada`** (346 mapeos) → perdía el nivel de intento. **Recuperarlo
(Novedad 1/2/3 + Reintento 1/2) es necesario para medir la efectividad de reintentos.**

### Fase 6 · Siniestro *(transversal — puede ocurrir en CUALQUIER estado de transporte)*
`Siniestro → Indemnizado` ⏹. Novedad **NO** solucionable: `Dañado/Perdido`, `Incautado/Robado`,
`Excepción/Destruido`. La transportadora paga la indemnización (Estado FINAL).

### Fase 7 · Devolución
`En devolución → Devuelto → Devolución confirmada por bodega` ⏹.
- **Devuelto**: paquete regresando al proveedor. ⚠️ **algunas transportadoras NO reportan este estado**.
- **Devolución confirmada por bodega**: el estado final **lo marca el PROVEEDOR, no la transportadora**
  ("Proveedor confirma recepción"). Ojo para el modelo de datos: la señal de cierre no viene del carrier.

### Estados finales del macro-proceso (5)
`Cancelado` · `Rechazado` · `Entregado` · `Indemnizado` · `Devolución confirmada por bodega`.

## 10.B · Ajuste de modelo: la ENTRADA al transporte y la RECOLECCIÓN (feedback 12-jul)

Dos correcciones de Juan al catálogo, ambas válidas:

### ① Reponer `Pendiente de recolección` (para el Caso 1: sin ECOM ni Dropi)
Yo lo había propuesto **quitar** (porque la categoría DB `PENDIENTE_RECOLECCION` se eliminó y tenía 0
mapeos en el Excel de campo). **Estaba mal:** tiene un rol semántico real. Cuando el proveedor **no**
usa ECOM ni Dropi, entre `Guía generada` y `Recibido transportadora` hay una ventana donde **el paquete
espera a que el carrier lo recoja** — ese es `Pendiente de recolección`. Sin él, el Caso 1 "salta" de
guía generada a recibido y **no se puede medir cuánto tarda la transportadora en recoger** (que es una
fuga de tiempo real). La entrada al transporte queda así, según el caso:

```
Guía generada
  ├─ Caso 1 (sin ECOM/Dropi):  Pendiente de recolección → [Recolección fallida → reintento] → Recibido transportadora
  ├─ Caso 2 (ECOM, sin Dropi):  Preparado transp. → Entregado a transp. → Recibido transportadora
  └─ Caso 3 (ECOM + Dropi):     Preparado → Pendiente de recolección (Dropi) → [Recogida fallida → reintento] → Recogido Dropi → En bodega Dropi → Entregado transp. → Recibido transportadora
```
→ `Pendiente de recolección` aplica al **Caso 1 (recoge el carrier)** y al **Caso 3 (recoge Dropi)**.
El Caso 2 no lo tiene porque ECOM ya rastrea el handoff.

### ② Quitar `En bodega destino` — **DECISIÓN: fuera del todo** (12-jul)
Se **colapsa en `En tránsito`** y no se usa ni siquiera como hito de aviso (decisión de Juan). Un
estado menos que gestionar.

### ③ HUECO GRANDE que esto destapa: **la recolección también tiene reintentos**
El PDF modela reintentos **solo en la entrega** — pero los datos crudos muestran un ciclo igual en la
**recolección**: `DISPONIBLE PARA RECOLECTAR`, `EN CAMINO A LA RECOGIDA`, `RECOLECCIÓN NO EXITOSA`,
`SEGUNDA RECOLECCIÓN NO EXITOSA`, `SEGUNDO/TERCER INTENTO DE RECOLECCIÓN PENDIENTE`, `RECOGIDA FALLIDA`.
Es decir, **la recogida puede fallar y reintentarse hasta 3 veces**, igual que la entrega. El PDF y el
catálogo de 26 **no lo modelan** → hay que añadir un mini-ciclo de novedad/reintento de recolección
(análogo al de entrega). **Esto es lo más importante que falta.**

## 11 · Catálogo homologado DEFINITIVO (v0.1) — solo estados homologados

Reconcilia: tu lista de 22 (Excel) + los 4 que faltaban (rutas reales) + los del PDF. **26 estados
operador** en 7 fases + 1 centinela. `mov`=movilizado · `bod`=salió de bodega · `T`=terminal ·
`rev`=reversible. **Origen:** 📋 Excel · 📄 PDF · 🆕 nuevo · 🔁 rescatado de rutas reales.

| # | Fase | Estado homologado (operador) | mov | bod | T | Vista cliente | Origen |
|---|------|------------------------------|:---:|:---:|:-:|---------------|:------:|
| 1 | **1·Gestión** | Por confirmar *(= Pendiente confirmación)* | · | · | · | En preparación | 📋🔁 |
| 2 | | Pendiente | · | · | · | En preparación | 🔁 |
| 3 | | Guía generada | · | · | · | En preparación | 🔁 |
| 4 | | Cancelado | · | · | ✔ | Cancelado | 📋 |
| 5 | | Rechazado | · | · | ✔ | Cancelado | 📋 |
| 6 | **2·ECOM** *(opc.)* | Preparado para transportadora | · | · | · | En preparación | 📄 |
| 7 | | Entregado a transportadora | ✔ | ⚠✔ | · | En camino | 📄 |
| 8 | **3·Dropi** *(opc.)* | Recolectado por Dropi | ✔ | ✔ | · | En camino | 📋 |
| 9 | | En bodega Dropi | ✔ | ✔ | · | En camino | 🔁📄 |
| 9b | **3b·Recolección** *(Caso 1 y 3)* | **Pendiente de recolección** *(pre-movilización)* | · | · | · | En preparación | 🆕🔁 |
| 9c | | **Recolección fallida** *(niv. 1/2/3)* | · | · | · rev | En preparación | 🆕 |
| 9d | | **Reintento de recolección** | · | · | · | En preparación | 🆕 |
| 10 | **4·Transporte** | Recibido transportadora *(=recolección exitosa)* | ✔ | ✔ | · | En camino | 📋 |
| 11 | | En tránsito *(absorbe "En bodega destino")* | ✔ | ✔ | · | En camino | 📋 |
| 12 | | En reparto | ✔ | ✔ | · | En reparto | 📋 |
| 13 | | **Disponible para retiro en punto/oficina** *(ex "Reclamo en oficina")* | ✔ | ✔ | · | **Disponible para retiro** | 🆕📋 |
| 14 | | Entregado | ✔ | ✔ | ✔* | Entregado | 📋 |
| 15 | **5·Novedad** | Novedad *(nivel 1/2/3)* | ✔ | ✔ | · rev | Novedad en tu pedido | 📋📄 |
| 16 | | Reintento *(nivel 1/2)* | ✔ | ✔ | · | En reparto | 📄 |
| 17 | | Novedad solucionada | ✔ | ✔ | · | En camino | 📋 |
| 18 | **6·Siniestro** *(raro)* | Siniestro | ✔ | ✔ | · | Novedad en tu pedido | 📋 |
| 19 | | En proceso de indemnización | ✔ | ✔ | · | Novedad en tu pedido | 📋 |
| 20 | | Indemnizado | ✔ | ✔ | ✔ | Proceso finalizado | 📋 |
| 21 | | Incautado | ✔ | ✔ | · | Novedad en tu pedido | 📋 |
| 22 | | Excepción | ✔ | ? | · | Novedad en tu pedido | 📋 |
| 23 | **7·Devolución** | En devolución *(/ Devolución en proceso)* | ✔ | ✔ | · | En devolución | 📋 |
| 24 | | Devuelto | ✔ | ✔ | · | En devolución | 📄 |
| 25 | | Devolución confirmada por bodega | ✔ | libera stock | ✔ | Proceso finalizado | 📄 |
| — | *default* | ⚠ **Por clasificar / SIN MAPEO** (centinela observable) | ? | ? | · | En camino | 📋 |

> `*` **Entregado es terminal SOLO tras confirmación** (N h sin nuevo evento) — en crudo rebota (§9.1②).
> ⚠ **`Entregado a transportadora`**: `bod=✔` pese a sonar a preparación (trampa contable, §7).

**Cambios vs tu lista de 22:**
- ➕ **Añadidos:** Pendiente, Guía generada (🔁 rutas), Preparado transportadora, Reintento, Devuelto,
  Devolución confirmada por bodega (📄 PDF). En bodega Dropi (🔁).
- ✏️ **Renombrado:** "Reclamo en oficina" → **"Disponible para retiro en punto/oficina"** (tu caso).
- 🗑️ **Propuesto retirar:** `Pendiente recoleccion` (CONTEXTO §8.4: 0 mapeos, en desuso) y **revisar
  `Proceso finalizado`** (no es terminal en crudo, apareció 1 vez en 14 guías — §9.1②).
- 📌 **Novedad/Reintento con nivel** (1/2/3) en vez de 5 estados sueltos — más limpio, decisión abierta.

### 11.A · Dónde quedan los VIEJOS (Estado Actual DB → homologado nuevo)

De la hoja "Config" + "2. Resumen". El modelo viejo tenía **~11 estados en DB**; el nuevo expande a 26.
Así queda cada viejo (⚠️ = eliminado en abril-2026 según CONTEXTO §9 — su volumen se redistribuye):

| Viejo (DB) | → Nuevo homologado | Movimiento de volumen |
|---|---|---|
| `CANCELADO` | Cancelado | 11 → 17 (recibe 6) |
| `DEVOLUCION` | Devolución | 21 → 20 |
| `DEVOLUCION_EN_PROCESO` | Devolución en proceso | 14 → 15 |
| `ENTREGADO` | Entregado | 15 → 15 (sin cambio) |
| `EN_TRANSITO` | En tránsito | 70 → 55 (se reparte a reparto/otros) |
| `EN_REPARTO` ⚠️ | En reparto | 16 → 19 |
| `NOVEDAD` | Novedad | 326 → 346 |
| `EXCEPCION` | Excepción | **36 → 4** (32 se reclasifican a Novedad/otros) |
| `INCAUTADO` | Incautado | 1 → 3 |
| `RECIBIDO_TRANSPORTADORA` ⚠️ | Recibido transportadora | 15 → 11 |
| `PENDIENTE_RECOLECCION` ⚠️ | *(se disuelve)* | **51 → 0** → se reparte a En preparación / Recibido transportadora |

**Nuevos que NO existían en DB** (nacen de la homologación): Por confirmar, En preparación,
Recolectado por Dropi, En bodega Dropi, Novedad solucionada, Reclamo en oficina→**Disponible para
retiro**, En proceso de indemnización, Indemnizado, Proceso finalizado, Siniestro, Rechazado.

> 🔴 **Ojo (CONTEXTO §9):** esta columna "Estado Actual DB" usa 3 categorías **ya eliminadas**
> (`PENDIENTE_RECOLECCION`, `RECIBIDO_TRANSPORTADORA`, `EN_REPARTO`). El *sentido* del mapeo sirve,
> pero el diff de volúmenes (los 145 cambios) hay que **recalcularlo contra la base actual**.

### 11.B · Naming: "Por confirmar" = "Pendiente confirmación" de Dropi (vocabulario de ORDEN)

Los estados de **Fase 1 (Gestión)** NO son estados de carrier — son los **estados de la orden Dropi**
(vocabulario A, CONTEXTO §1). La equivalencia que pediste:

| Homologado (canónico) | = Estado de orden Dropi (crudo) |
|---|---|
| **Por confirmar** | `PENDIENTE CONFIRMACION` |
| **Pendiente** | `PENDIENTE` |
| **Guía generada** | `GUIA_GENERADA` |
| **Cancelado** | `CANCELADO` |
| **Rechazado** | `RECHAZADO` |

→ Uso **"Por confirmar"** como nombre canónico (más claro para UI) pero **mapea 1:1 a
`PENDIENTE CONFIRMACION`**. Estos 5 se llenan desde `order.history[]`, no desde la guía.

### 11.C · Los 3 casos de ruteo — ECOM y Dropi NO se ignoran (pueden saltarse)

El PDF modela que ECOM (Fase 2) y Dropi (Fase 3) son **opcionales** — el paquete puede ir **directo a
la transportadora**. Hay que soportar los 3 caminos, no asumir uno:

| Caso | Cuándo | Ruta (tras Guía generada) |
|---|---|---|
| **1 · Directo** | Proveedor **no** usa ECOM | Guía generada → **Recibido transportadora** → … *(salta Fase 2 y 3)* |
| **2 · ECOM directo** | Usa ECOM, sin recolección Dropi | Guía generada → Preparado transp. → Entregado a transp. → **Recibido transportadora** → … |
| **3 · ECOM + Dropi** | Usa ECOM **y** recolección Dropi (ECOM obligatorio) | Guía generada → Preparado → Entregado transp. → **Recolectado Dropi → En bodega Dropi** → Recibido transportadora → … |

**Regla:** las fases 2 y 3 son opcionales pero **no se borran del catálogo** — un paquete que pasó por
ECOM debe poder mostrar "Entregado a transportadora"; uno directo nunca lo tendrá. El modelo las
incluye siempre; el ruteo decide cuáles aplican por orden.

### 11.D · Vista usuario / notificaciones e-commerce — "va en camino", "va llegando"

Lo que ve el **cliente final** son 8 estados (Config, columna Vista Usuario). Cada transición a un
estado cliente **dispara una notificación** — es la parte e-commerce que pediste:

| Estado cliente | Estados operador que agrupa | 🔔 Aviso al cliente |
|---|---|---|
| **En preparación** | Por confirmar, Pendiente, Guía generada, Preparado transp., Recolectado Dropi, En bodega Dropi | "Estamos preparando tu pedido" |
| **En camino** 🚚 | Entregado a transp., Recibido transportadora, En tránsito, Novedad solucionada | **"Tu pedido va en camino"** |
| **En reparto** 📍 | En reparto, Reintento | **"Tu pedido va llegando — sale hoy a entrega"** |
| **Disponible para retiro** 🆕 | Disponible para retiro en punto/oficina | **"Tu pedido te espera en {punto}. Recógelo antes de {fecha}"** |
| **Novedad en tu pedido** ⚠️ | Novedad, Siniestro, En proceso indemnización, Incautado, Excepción | "Hubo una novedad, la estamos resolviendo" |
| **Entregado** ✅ | Entregado *(confirmado)* | "¡Entregado! ✅" |
| **En devolución** ↩ | En devolución, Devuelto, Devolución en proceso | "Tu pedido va en devolución" |
| **Proceso finalizado / Cancelado** | Indemnizado, Devolución confirmada, Cancelado, Rechazado | según caso |

> **La granularidad operador→cliente es la que habilita el aviso.** Hoy, con todo en `EN PROCESAMIENTO`,
> no se puede distinguir "va en camino" de "va llegando" ni disparar el aviso de retiro. Con el Nivel 1
> separado de la vista cliente, cada salto (En tránsito→En reparto→Disponible retiro→Entregado) es un
> gatillo de notificación distinto. **Este es el valor e-commerce directo de la homologación.**

## 12 · Próximo paso — validar el mapeo crudo → homologado contra el `history[]` real
Este catálogo es la capa homologada. **Falta** (lo que pediste dejar para después): mapear los ~50
estados **crudos reales** (los que ocurren en el `history[]` de Dropi) a estos 26, y verificar que la
**línea de eventos de guías reales cuadre** con el listado (que no haya crudos sin casilla ni saltos
imposibles). Insumo: las 14 guías de §9 + el endpoint de detalle (`history[]`, CONTEXTO §3.4).

## 13 · Changelog
- 2026-07-12 — Borrador v0. Reconcilia modelo actual (Estados_Consolidados.xlsx, 621 filas) + PDF
  (24 estados/7 fases) + Excel de campo (576 mapeos/7 carriers + 14 guías de prueba) + CONTEXTO.
  Diagnóstico con evidencia (6 problemas), modelo por capas, catálogo objetivo, caso retiro-en-oficina,
  investigación carrier-by-carrier de las 6 colisiones (5 llenado / 1 posible real), **14 casos de
  guías reales, ruta propuesta (máquina de estados) y revisión de estados finales** (hallazgo: los
  "finales" rebotan en crudo; catálogo real ~26–28, no 22).
- 2026-07-12 — Añadido §10.A: recorrido detallado del macro-proceso leído caja por caja del PDF
  (3 rutas ECOM/Dropi, condiciones de salto, responsables, estados crudos de carrier por estado
  homologado, ciclo completo de novedades/reintentos de 3 intentos, siniestro transversal, cierre
  de devolución por el proveedor). Corrige el exceso de resumen previo.
