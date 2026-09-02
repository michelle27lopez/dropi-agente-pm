# Research · Novedades y devoluciones — la novedad no dice qué hacer

> Research cuantitativo de Logistic Success. Obedece `metodologia/spec-driven.md`: **cada afirmación lleva estado + fuente**, cero placeholders.
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo. Fuentes: `[data]` export · `[obs]` observado en producción · `[doc]` conocimiento previo.
> Alimenta el spec `novedad-dueno-triaje/spec.md` (PRM-1512) y su hermana `reduccion-devoluciones-cod/spec.md` (PRM-1523).

## Metadatos

| Campo | Valor |
|---|---|
| ID | `RES-LOG-NOV-001` |
| Fecha de investigación | 2026-08-24 |
| Iniciativa relacionada | PRM-1512 (novedades) · PRM-1523 (devoluciones) · PRM-1580 (oportunidad) |
| Segmento investigado | Órdenes con novedad — 10 países, 42 pares país×transportadora |
| Etapa del journey | Movilización → Novedad → Desenlace (entrega o devolución) |
| Fuente | `data (11).xlsx` — export Power BI, filtros `Año = 2026`, `Mes = JUN` · **+ recorrido del módulo de Novedades en producción (2026-08-24, ⚠️ instancia COLOMBIA únicamente)** |
| Tipo de fuente | Cuantitativa agregada (sin nivel orden) + observación directa de producto |
| Nivel de confianza | **Alto** en dimensionamiento y comparación entre motivos (10 países) · **Alto** en el módulo pero **solo para Colombia** · **Bajo** en causalidad (todo es asociación, no A/B) |
| Universo | **911.168 novedades · 154.931 rescatadas (17,0%) · 677.323 devueltas (74,3%)** |
| Tags | novedades, devoluciones, COD, taxonomía, triaje, reprogramación, dirección |

---

## Insights (lo que hay que llevarse de aquí)

**I1 · El top por volumen engaña.** En Colombia las dos etiquetas más grandes tienen casi el mismo volumen y diez veces distinta oportunidad: `DESTINATARIO SE REHUSA A RECIBIR` (127.891, techo **+4.641**) vs `COORDINAR LA ENTREGA` (118.988, techo **+45.503**). Priorizar por volumen lleva al motivo equivocado. `[data]`

**I2 · El carrier no explica el resultado; el país sí.** Fixy rescata 11,0% en Argentina y **43,9% en Paraguay**. Servientrega 16,6% en Ecuador y **45,6% en Panamá**. Mismo operador, hasta 33 puntos de diferencia. Y HL Express, consistente entre sus dos países (3,5 pts), demuestra que la consistencia es posible. `[data]`

**I3 · En 6 de 10 países, arreglar un carrier es arreglar el país.** México 90,3% Quality Post · Panamá 95,1% HL Express · Costa Rica y Guatemala 100% un solo carrier · Chile 78,2% Starken · Argentina 76,5% Fixy. **Quality Post es el peor del dataset en 5 de los 12 motivos y es el 90,3% de México:** punto único de falla. `[data]`

**I4 · No hay un problema, hay tres mezclados.** De **producto** (falta la acción: fecha, ubicación) en Colombia y Argentina · de **proveedor** en México, Guatemala y Ecuador/Servientrega · de **encuadre** (se pelea lo irrecuperable) en Chile y en el 35% global de intención rota. Meterlos en un solo proyecto es el error a evitar.

**I5 · El único consenso mundial: el arrepentimiento no se recupera.** Spread de 7 puntos entre el mejor (9,3%) y el peor (1,9%) de los 10 países, sobre 319.854 novedades/mes. Es la decisión más fácil que Dropi tiene sobre la mesa.

**I6 · Volumen dice dónde está el problema; densidad dice dónde rinde el esfuerzo.** Chile es 8,1% del volumen y **1,6% del techo** (densidad 2,3%): no se trabaja. Argentina es 0,8% del volumen y **33,1% de densidad**: el mejor rendimiento por unidad de esfuerzo del mapa. `[data]`

**I7 · Cinco de las ocho acciones país no son de producto.** Son conversaciones con proveedores o copiar procesos entre países — las más rápidas y baratas. **Lo más barato del research no es construir: es ir a ver** a Ecuador/Gintracom (mejor en 4 de 12 motivos) y a Panamá/HL Express.

---

## Problema investigado

Cuando una orden entra en novedad, **el desenlace por defecto es la devolución**: 3 de cada 4 novedades terminan devueltas y solo 17% se rescatan. `[data]`

La pregunta no era "¿por qué falla la entrega?" sino **"¿por qué la gestión de la novedad no la recupera?"** — que es lo que ya había quedado abierto en `temas/04`: *"resuelta es humo"*, el % resuelta es 70-85% pero la entrega final es baja. `[doc:tema 04]`

---

## Preguntas de investigación

1. ¿Cuál es el universo real de novedades y cómo se reparte por motivo, país y transportadora?
2. ¿Todos los motivos tienen el mismo potencial de recuperación, o hay un triaje objetivo en la data?
3. ¿La tasa de rescate depende de la **causa** de la novedad o de **otra cosa**?
4. ¿Cuánto vale, en entregas/mes, cerrar la brecha?
5. ¿Qué debería ofrecer el módulo de Novedades como acciones de solución?

---

## Cómo se construyeron las métricas (para poder defenderlas)

### `rescate`
`ENTREGADO ÷ CANTIDAD`. **Ambas columnas vienen del export de Power BI — no se calcularon aquí.**

Límites que hay que declarar al presentarlo:
- No está documentado qué significa `ENTREGADO` en el export: ¿entregada *después* de la novedad o *alguna vez*?
- **No suma 100% con devolución:** faltan 78.914 novedades (8,7% global · 46,1% en México). Hay un tercer estado invisible.
- Es una foto a fecha de corte: una novedad del 28 de junio tuvo menos tiempo de resolverse que una del 2. **Sesga el rescate hacia abajo** en las recientes.

→ Sirve para comparar entre sí. **No para publicar como cifra absoluta.**

### `techo` — construcción propia, no es un dato
1. Por cada motivo canónico, todas las celdas país×carrier con **≥300 novedades**
2. Percentil **75** de sus tasas de rescate
3. `techo = (P75 × volumen) − entregas actuales`, con piso en 0

**Decisiones tomadas y por qué:**
- **P75 y no el máximo:** el máximo suele ser una celda chica con suerte. El P75 dice "varios ya lo logran".
- **Umbral de 300:** debajo, los porcentajes son ruido. **Número elegido por el autor** — con 500 o 1.000 los resultados se mueven.
- **P75 global, no por país**, para que los países sean comparables.

**Supuesto débil (el punto de ataque):** asume que la mezcla de casos fáciles y difíciles es comparable entre países dentro del mismo motivo. **Probablemente no lo es.**

> ⛔ **El techo NO es meta, NO es pronóstico y NO es compromiso de KR.** Es un instrumento de priorización: dice qué motivo tiene margen demostrado en algún lado y cuál no. Si alguien lo convierte en meta de OKR, hay que frenarlo.

### `densidad de oportunidad`
`techo ÷ volumen del país`. Responde "¿cuánto de lo que se cae aquí es recuperable?" — el criterio para decidir si un país se trabaja o no.

### Regla de priorización (tres cruces, nunca uno)
1. **Volumen** → dónde está el problema
2. **Brecha contra el P75** → si hay evidencia de que se puede mover
3. **Si alguien ya lo hace mejor** → copiar o construir

Volumen sin brecha es una trampa (ver I1). Brecha sin volumen es irrelevante.

---

## Hallazgos principales

### 1 · La taxonomía de novedades no existe: hay 324 vocabularios, no uno

| Métrica | Valor |
|---|---|
| Etiquetas distintas de `TIPO NOVEDAD` | **324** |
| Etiquetas usadas por **una sola** transportadora | **275 (85%)** — el 69% del volumen |
| Etiquetas compartidas por ≥3 transportadoras | **25** |
| Top-20 motivos | 77% del volumen |

`[data]` **Cada transportadora escribe su propio diccionario y Dropi lo ingiere tal cual.** La misma situación real —"el comprador quiere otra fecha"— aparece como `COORDINAR LA ENTREGA` (Envía), `Reprogramar entrega` (Veloces/HL), `REPROGRAMADO POR EL COMPRADOR` (Fixy), `DESTINATARIO RECIBE EN FECHA U HORARIO ESPECÍFICO` (TCC) y `Cita Previa` (AEX).

**Consecuencia de producto:** no se puede construir una acción de rescate sobre 324 etiquetas. Cualquier automatización, SLA o triaje necesita una **capa de homologación** antes. Esto es la misma deuda que ya está abierta en `proyectos/normalizacion-estados/` pero aplicada a novedades, no a estados. `[doc]`

### 2 · El desenlace no lo decide la causa — lo decide si la etiqueta nombra una acción

Clasifiqué las 324 etiquetas en tres tipos según **qué le dicen al sistema**:

| Tipo de etiqueta | Etiq. | Novedades | % mix | **% rescate** | % devolución |
|---|---:|---:|---:|---:|---:|
| **A · El destinatario pide algo concreto** (solicita cambio de dirección, reprogramar, cita, entrega en punto) | 31 | 68.422 | 7,5% | **33,7%** | 65,2% |
| **B · Solo describe un estado** (coordinar la entrega, no hay quien reciba, dirección no existe) | 248 | 514.720 | 56,5% | **21,5%** | 70,7% |
| **C · La intención de compra se rompió** (rehúsa, rechaza, cancela, no paga) | 45 | 328.026 | 36,0% | **6,4%** | 81,9% |

`[data]`

**El A/B natural más limpio del dataset** — misma situación real, etiquetas distintas:

| Situación | Etiqueta | Novedades | % rescate |
|---|---|---:|---:|
| Hay que coordinar la entrega | **sin acción** (`COORDINAR LA ENTREGA`, `ESPERANDO PROGRAMACIÓN`) | 123.226 | **14,7%** |
| Hay que coordinar la entrega | **con acción** (`Reprogramar entrega`, `solicita fecha`, `Cita Previa`) | 48.940 | **37,9%** |
| El comprador ya no está en esa dirección | **pasivo** (`Destinatario se trasladó`, `CAMBIO DE DOMICILIO`) | 6.064 | **10,5%** |
| El comprador ya no está en esa dirección | **activo** (`SOLICITA CAMBIO DE DIRECCIÓN`) | 6.439 | **38,8%** |

**2,6x y 3,7x de diferencia sobre la misma causa física.** `[data]`

> ⚠️ `[HIPÓTESIS a validar]` Esto es asociación, no causa. Sesgo alternativo posible: una transportadora solo escribe *"solicita cambio de dirección"* cuando ya logró hablar con el comprador — es decir, la etiqueta sería **consecuencia** del contacto exitoso, no causa del rescate. Distinguir las dos lecturas es el experimento crítico (§ Validación).

### 3 · El mismo motivo, la misma transportadora, distinto país: hasta 2,3x de diferencia

`Reprogramar entrega` — etiqueta idéntica, operador idéntico (Veloces):

| País / Carrier | Novedades | % rescate |
|---|---:|---:|
| Ecuador / VELOCES | 2.292 | **60,7%** |
| Costa Rica / HL EXPRESS | 881 | 56,1% |
| Panamá / HL EXPRESS | 5.500 | 51,1% |
| Colombia / VELOCES | 12.138 | 35,3% |
| México / VELOCES | 1.429 | **26,7%** |

`No hay quien reciba`: Ecuador/Servientrega 45,9% ↔ México/Veloces 8,5%. `[data]`

**Si la misma etiqueta con el mismo operador rinde 60% en un país y 27% en otro, la variable no es la causa de la novedad: es el proceso de gestión.** Y un proceso se puede copiar. `[data]`

### 4 · Un solo motivo, en un solo carrier, en un solo país, concentra el 45% del techo

`COORDINAR LA ENTREGA` — exclusiva de **Envía / Colombia**:

- **118.988 novedades en junio = 13,1% de todas las novedades del mundo Dropi**
- **15,1% de rescate · 84,7% de devolución**
- Sus pares con acción explícita rescatan 37,9% — y Ecuador/Veloces llega a 60,7%

Es literalmente una novedad que **se llama "coordinar"** y que en 85 de cada 100 casos **nadie coordina**. `[data]`

Concentración general: **Colombia = 59% de las novedades · Envía sola = 37%.** `[data]`

### 5 · El techo cuantificado: +95.688 entregas/mes

Ejercicio: llevar cada motivo al **P75 de su propio clúster** (el cuartil superior ya observado hoy, en producción, por algún país×carrier — no una meta inventada).

| Clúster | Novedades | Rescate hoy | P75 observado | **Entregas extra/mes** |
|---|---:|---:|---:|---:|
| **Coordinación** | 186.011 | 21,3% | 51,3% | **+55.703** |
| Contacto / ausencia | 178.310 | 30,4% | 39,0% | +15.272 |
| Dirección | 136.789 | 20,7% | 29,1% | +11.458 |
| Otro / operativo | 80.407 | 13,7% | 23,6% | +7.970 |
| Rechazo | 313.984 | 5,9% | 7,4% | +4.412 |
| Pago (COD) | 15.667 | 18,9% | 24,4% | +873 |
| **TOTAL** | | | | **+95.688** |

**El 58% del techo está en Coordinación, y 43.053 de esas entregas están en `COORDINAR LA ENTREGA` sola.** `[data]`

> ⚠️ `[HIPÓTESIS a validar]` El P75 es alcanzable *en promedio*, no orden a orden. Es un techo de referencia para priorizar, no un compromiso de KR.

### 6 · Triaje objetivo: pelear, soltar, rediseñar

| Veredicto | Criterio | Volumen jun-2026 | Qué hacer |
|---|---|---:|---|
| **SOLTAR** | Intención rota, rescate <10% | ~314.000 (34%) | Devolver rápido y barato. Cada día extra en red es costo puro. Ya estaba como no-objetivo en el spec. `[⛔ doc:spec §4]` |
| **REDISEÑAR** | Volumen alto + brecha demostrada vs P75 | ~230.000 (25%) | Aquí vive el techo. `COORDINAR LA ENTREGA`, `DIRECCIÓN NO EXISTE`, `Se visita no se logra`, `FIJA FECHA Y HORA` |
| **PELEAR / escalar** | Ya rescata ≥35% | ~110.000 (12%) | Copiar el proceso a los países que rinden peor |

`[data]`

### 7 · El módulo lo confirma: hay una sola acción, y es un binario

**Observado en producción el 2026-08-24** (`app.dropi.co/dashboard/novelties` + `/dashboard/incidence-history`, sesión de Juan). `[obs]`

> ⚠️ **ALCANCE: COLOMBIA ÚNICAMENTE.** Todo el §7, §8 y §9 describe la instancia colombiana. **No está verificado que el módulo sea idéntico en los otros 9 países** — y esa pregunta no es menor: si el módulo difiere por país, sería una explicación candidata del spread del §3 (mismo carrier, 60,7% en Ecuador vs 26,7% en México). Ver `Recomendaciones para nuevo research`.

**7.1 · El motivo de la novedad no es un campo de primera clase.**
En la bandeja va embebido dentro de un blob de texto en la columna *Datos* (`Novedad: COORDINAR LA ENTREGA`). En el **Historial de Novedades** la columna *Novedad* muestra **un número sin etiqueta** — `32`, `7`, `38`, `42`, `4`, `33`, `30`, `29`. `[obs]`

**7.2 · No existe filtro por tipo de novedad.**
Filtros disponibles en la bandeja: Dropshipper · Supplier · Bodega · Departamento · Ciudad · Tienda · Guía/Orden ID/Celular · rango de fechas · **Transportadora**. En el Historial: Dropshipper · Proveedor · Tienda · Estado · Departamento · Ciudad. `[obs]`

> **Ninguno filtra por motivo.** El triaje pelear/soltar/rediseñar del §6 es hoy **inoperable en la interfaz**: no hay forma de aislar las 314K de "soltar" ni las 119K de `COORDINAR LA ENTREGA`. Esto convierte a O1 (homologación) en pre-requisito duro, no en mejora.

**7.3 · CORREGIDO — `Sí` abre un segundo paso, y el formulario cambia por tipo de novedad.**

> ⚠️ **Corrección de un error propio (2026-08-24).** En la primera versión afirmé que el módulo ofrecía *"una sola acción para las 324 etiquetas: un binario Sí/NO"*. **Es falso.** Generalicé desde un solo modal que nunca llegué a avanzar. Al pulsar `Si` aparece un formulario con campos y un botón `GUARDAR SOLUCION`. Juan lo detectó y aportó las capturas.

El binario no es la acción: es un **gate**. `Si` = *"lo validé, reofrezcamos"* → despliega formulario. `NO` = devolver. El commit real es `GUARDAR SOLUCION`, no `Si`.

**Lo que se despliega, por caso observado:**

| Novedad · carrier | Campos tras pulsar `Si` | Fuente |
|---|---|---|
| `COORDINAR LA ENTREGA` · **Envía** | **Solución · Nombre · Dirección entrega · Celular** — los 4 vacíos, los 4 `<input type="text">` planos **sin `formcontrolname`, sin `<select>`, sin `<datalist>`** | ✅ verificado por DOM (Juan Bautista) |
| `Reprogramar entrega` · **JAMV-DRIVE** | **Solución · Nombre · Celular · Dirección** (los tres últimos **prellenados**) + **`Specify Address`** + **`View Map`** | captura de Juan |
| `Pedido cancelado` · **Coordinadora** | **Solo `Solución`.** Sin nombre, dirección ni celular. Desplegable mostró 1 valor: *"Devolución total del despacho"* | captura de Juan |
| `No se entrega, el destinatario no cancela el valor a recaudar. RCE` · **Coordinadora** | **Solo `Solución`.** Desplegable mostró 2 valores: *"Autorización tercer intento de entrega"* · *"Devolución total del despacho"* | captura de Juan |

**Qué se sostiene y qué se cae de lo que dije antes:**

- ❌ **Se cae:** "hay una sola acción para todas las novedades". Falso.
- ❌ **Se cae:** "no existe cambiar dirección / actualizar teléfono / autorizar a un tercero". **A03, A06 y A08 sí existen** en al menos dos de los cuatro casos.
- ❌ **Se cae parcialmente:** "no hay pedir ubicación". **JAMV-DRIVE expone `View Map` y `Specify Address`** — hay algo de A04, al menos en ese carrier.
- ✅ **Se sostiene y se refuerza:** **no hay campo de FECHA en ninguno de los cuatro** — ni siquiera en la novedad literalmente llamada `Reprogramar entrega`. **A01 y A02 siguen sin existir.** Y A01 es el motivo N01: 170.720 novedades/mes y +54.906 de techo. El hallazgo central del research no solo sobrevive: queda mejor delimitado — el problema no es que no haya formulario, es que **el formulario no deja hacer lo único que el motivo pide**.
- ✅ **Se sostiene y se agrava:** `GUARDAR SOLUCION` existe. **La UI para registrar la solución está construida** y aun así la columna `Solución` del Historial sale vacía. Ya no es "falta el campo": es que **el flujo no se completa**.
- ✅ **Se sostiene:** el formulario de Envía —el carrier con 37% del volumen y el motivo más grande— es el más pobre de los cuatro: cuatro campos vacíos de texto libre, sin mapa y sin catálogo.

**Pregunta abierta crítica — sin resolver:** ¿el desplegable de `Solución` es un **catálogo de la aplicación** o el **autocompletado de Chrome**? En el caso de Envía verifiqué que el input es texto libre plano sin `<select>` ni `<datalist>`, lo que apunta a autofill del navegador. Pero los valores de Coordinadora (*"Autorización tercer intento de entrega"*) parecen códigos oficiales del carrier. **Si es autofill, `Solución` es texto libre y por eso el Historial es inagregable.** Perdí el acceso al navegador antes de confirmarlo. Es lo primero que hay que resolver.


**7.3 bis · El modelo real (9 fichas, 2026-08-25): la estructura la define el carrier, el catálogo la etiqueta.**

Coexisten **dos arquitecturas de solución distintas** dentro del mismo módulo. `[obs]`

| Carrier | Etiqueta | Motivo | Arquitectura | Opciones de `Solución` | Mapa |
|---|---|---|---|---|---|
| **Coordinadora** | `No se localiza dirección del destinatario` | N03 | `<select>` cerrado | Devolución total · **Entrega en punto droop** · **Entregar en nueva dirección** · **Completar / Corregir dirección** | no |
| **Coordinadora** | `Direccion incompleta` | **N03** | `<select>` cerrado | Autorización tercer intento · Devolución total | no |
| **Coordinadora** | `Contactar a Destinatario / Inconveniente` | N04 | `<select>` cerrado | Devolución total · Ofrecer parcial · Unidades físicas inferiores · Guía con valor RCE correcto | no |
| **Coordinadora** | `Se visita, no se logra entrega` | N05 | `<select>` cerrado | Autorización tercer intento · Devolución total | no |
| **Coordinadora** | `Destinatario no cancela el recaudo, **solicita la entrega en una fecha posterior**` | N11 | `<select>` cerrado | **Devolución total del despacho — única opción** | no |
| **Coordinadora** | `Pedido cancelado` | N08 | `<select>` cerrado | Devolución total · Entrega en punto · Nueva dirección · **Volver a ofrecer** | no |
| **Envía** | `COORDINAR LA ENTREGA` | N01 | **texto libre** (Solución · Nombre · Dirección · Celular) | sin catálogo | no |
| **Veloces** | `Novedad atribuible al orden publico` | N12 | **texto libre** (5 campos) | sin catálogo | **sí** |
| **JAMV Drive** | `Reprogramar entrega` | N01 | **texto libre** prellenado | sin catálogo | **sí** |

**Las cuatro conclusiones:**

**a) `Solución` sí es un catálogo cerrado — pero solo en algunos carriers.** Queda resuelta la pregunta abierta: en Coordinadora es un `<select>` real con `<option>`s de la aplicación; en Envía, Veloces y JAMV es texto libre (lo que se veía como desplegable ahí era autofill de Chrome). **Envía es el 62,5% del volumen de Colombia y usa texto libre: por eso la columna `Solución` del Historial es inagregable.** `[obs]`

**b) El catálogo se asigna por etiqueta, no por causa — y está mal asignado.** Dos etiquetas del **mismo motivo canónico N03**, mismo carrier, catálogos distintos: `No se localiza dirección` ofrece **corregir la dirección**; `Direccion incompleta` **no lo ofrece** — solo reintentar a ciegas o devolver. Es literalmente el motivo que pide completar una dirección y es el que no deja completarla. `[obs]`

**c) El caso más grave del research.** La etiqueta dice *"**solicita la entrega en una fecha posterior**"* — el comprador pidió explícitamente una fecha — y **la única opción del sistema es `Devolución total del despacho`**. No hay ni siquiera reintento. `[obs]`

**d) El catálogo está invertido respecto de la data.** `Pedido cancelado` (intención rota, **7,4% de rescate**) tiene **4 opciones**, incluida "Volver a ofrecer". `Solicita entrega en fecha posterior` (**34,5% de rescate**, intención viva) tiene **1**: devolver. **El motivo que menos se recupera es el que más caminos de rescate ofrece.** `[data + obs]`

> **Y sobre las 9 fichas: ninguna tiene campo de fecha.** Ni la que se llama `Reprogramar entrega`, ni la que dice `solicita la entrega en una fecha posterior`. **A01 no existe en ninguna arquitectura.** `[obs]`



**7.3 ter · Barrido de Envía (2026-08-25): un solo formulario genérico para todo.**

Con el filtro de Transportadora —que **sí funciona**; el intento anterior falló porque la selección no se registró— se barrieron los 5 motivos más grandes de Envía. `[obs]`

| Etiqueta | Motivo | Volumen/mes | Rescate | Formulario tras `Si` |
|---|---|---:|---:|---|
| `DESTINATARIO SE REHUSA A RECIBIR` | N08 | 127.891 | 2,4% | Solución · Nombre · Dirección entrega · Celular |
| `COORDINAR LA ENTREGA` | N01 | 118.988 | 15,1% | **idéntico** |
| `DIRECCION DESTINATARIO NO EXISTE` | N03 | 34.179 | 14,3% | **idéntico** |
| `DESTINATARIO FIJA FECHA Y HORA DE RECIBO MAYOR AL DIA SIGUIENTE` | N01 | 12.676 | 21,8% | **idéntico** |
| `NO CONOCEN DESTINATARIO EN DIRECCION DESTINO` | N06 | 7.880 | 13,4% | **idéntico** |

Los cinco: **4 campos de texto libre, los 4 vacíos, sin catálogo, sin mapa, sin fecha.**

**En Envía el formulario NO cambia por motivo. Hay uno solo para todo.** Es exactamente lo contrario de Coordinadora, que tiene un catálogo distinto por etiqueta.

**El remate:** la etiqueta `DESTINATARIO FIJA FECHA Y HORA DE RECIBO MAYOR AL DIA SIGUIENTE` dice que el comprador **fijó fecha y hora**. El formulario no tiene ni campo de fecha ni campo de hora. Son 12.676 novedades/mes en las que el comprador ya dijo cuándo quiere su pedido y **no hay dónde escribirlo**. `[obs]`

Y el mismo formulario genérico atiende a la vez a alguien que **rechazó el pedido** (N08) y a alguien cuya **dirección no existe** (N03) — situaciones que no tienen nada en común.

### Cobertura del barrido a la fecha

| | |
|---|---|
| Fichas capturadas | **13** |
| Volumen de Colombia cubierto | **375.554 de 541.083 = 69,4%** |
| Volumen global cubierto | **41,2%** |
| Motivos canónicos cubiertos | **8 de 13** (N01, N03, N04, N05, N06, N08, N11, N12) |
| Envía | **89,3%** de su volumen |

Faltan: N02, N07, N09, N10, N99 · los otros carriers de Colombia (TCC, Derocha, Domina, Wiilog, 99Minutos) · y los 9 países restantes.



**7.3 quater · Bogotá (2026-08-25): tres arquitecturas confirmadas, ninguna con fecha.**

Filtrando `Departamento = CUNDINAMARCA` + `Ciudad = BOGOTA`. `[obs]`

**La ficha que faltaba — Veloces · `Reprogramar entrega` (Colombia):**

| Campo | Estado |
|---|---|
| `Solución` | texto libre, vacío — **sin catálogo** |
| `Nombre` · `Celular` · `Dirección` | **prellenados** |
| `Specify Address` | vacío |
| **`View Map`** | **presente** |
| **Campo de fecha** | **no existe** |

Idéntico a JAMV Drive. Con esto quedan **tres arquitecturas** confirmadas en Colombia:

| | Carrier | Estructura | Catálogo | Mapa | Fecha |
|---|---|---|---|---|---|
| **A** | Coordinadora | `<select>` cerrado | **sí, por etiqueta** | no | **no** |
| **B** | **Envía** (62,5% del volumen CO) | 4 campos de texto libre, vacíos | no | no | **no** |
| **C** | Veloces · JAMV Drive | texto libre **prellenado** | no | **sí** | **no** |

> **Ninguna de las tres tiene campo de fecha.** 15 fichas capturadas, cero campos de fecha. `[obs]`

**Por qué esta ficha importa más que las otras:** Veloces·`Reprogramar entrega` rescata **35,3% en Colombia y 60,7% en Ecuador** — mismo carrier, mismo motivo, misma plataforma. Ahora existe la línea base colombiana capturada al detalle. **Si el formulario ecuatoriano resulta idéntico a éste, los 25 puntos de diferencia no son producto: son proceso operativo** — y se copian sin desarrollo. Es el test decisivo que queda pendiente.

**Tres hallazgos secundarios del maestro de datos** `[obs]`:
- **El filtro de `Ciudad` no devuelve nada si no se elige `Departamento` primero, y no lo advierte.** Buscar "BOGOTA" en Ciudad responde *"No items found"*.
- **Bogotá no es departamento propio:** vive bajo `CUNDINAMARCA`.
- **`LA GUAJIRA` y `GUAJIRA` existen como dos departamentos separados** en el desplegable. Duplicado en el maestro — cualquier análisis por departamento parte roto.



**7.5 · ECUADOR — el test decisivo: el formulario es IDÉNTICO y el rescate es el doble.** `[obs 2026-08-25]`

Ecuador vive en otro dominio (`app.dropi.ec`), no en un selector de país dentro de `app.dropi.co`.

### El contraste que ordena todo el research

`Reprogramar entrega` · **Veloces** · mismo motivo, mismo carrier, dos países:

| Campo | **Colombia** | **Ecuador** |
|---|---|---|
| `Solución` | texto libre, vacío | texto libre, vacío |
| `Nombre` | **prellenado** | **prellenado** |
| `Celular` | **prellenado** | **prellenado** |
| `Direccion` | **prellenada** | **prellenada** |
| `Specify Address` | vacío | vacío |
| `View Map` | **presente** | **presente** |
| **Campo de fecha** | **no existe** | **no existe** |
| Catálogo de `Solución` | ninguno | ninguno |
| **Rescate observado** | **35,3%** | **60,7%** |

**Campo por campo idénticos. 25 puntos de diferencia.** `[obs + data]`

> ## El producto no explica la diferencia. **Es proceso operativo.**
>
> Con **este mismo formulario, tal como está hoy**, alguien en Ecuador rescata **60,7%** — por encima del P75 del motivo (53,3%) y muy por encima del 35,3% colombiano.
>
> **Consecuencia directa para el roadmap:** el techo de N01 —el motivo más grande del dataset, 170.720 novedades/mes y +54.906 de techo— **es alcanzable, al menos en parte, sin construir nada.** Antes de pedir el campo de fecha hay que ir a Ecuador a ver cómo lo gestionan. Eso invierte el orden que traíamos.
>
> ⚠️ `[HIPÓTESIS a validar]` Queda abierta la explicación alternativa: que los casos ecuatorianos sean estructuralmente más fáciles (geografía, densidad urbana, cultura de pago). El formulario descarta la explicación de producto, **no** descarta la de composición de casos. Eso se cierra con la auditoría de proceso, no con más pantallazos.

### Las otras dos fichas de Ecuador

| Carrier | Etiqueta | Estructura | Catálogo |
|---|---|---|---|
| **Servientrega** | `DEVUELTO DE` — 30.383/mes, **5,6% de rescate** | 3 campos de texto libre vacíos: `Solución` · `Nombre` · `Celular` — **ni siquiera dirección** | ninguno |
| **Gintracom** | `FUERA DE COBERTURA, NO COINCIDE LA CIUDAD` | `<select>` | **Efectuar devolución · Volver a ofrecer · Ajustar recaudo** |
| **Gintracom** | `DESTINATARIO INDICA QUE YA NO DESEA EL PRODUCTO` | `<select>` | **las mismas tres** |

**Gintracom tiene catálogo fijo por carrier, no por motivo** — lo contrario de Coordinadora. A "la ciudad de destino no coincide" le ofrece *"Ajustar recaudo"*, y **no le ofrece corregir la ciudad**.

Y `DEVUELTO DE` —el 31% de las novedades de Ecuador, con 5,6% de rescate— solo deja cambiar **nombre y celular** de un envío que ya va de vuelta.

### El modelo completo: cinco arquitecturas

| | Carrier · país | Estructura | Catálogo | Mapa | Fecha |
|---|---|---|---|---|---|
| **A** | Coordinadora · CO | `<select>` | **por etiqueta** (1–4 opciones) | no | **no** |
| **B** | **Envía · CO** (62,5% del volumen CO) | 4 campos libres vacíos | ninguno | no | **no** |
| **C** | **Veloces · JAMV — CO y EC** | texto libre **prellenado** | ninguno | **sí** | **no** |
| **D** | Servientrega · EC | 3 campos libres vacíos | ninguno | no | **no** |
| **E** | Gintracom · EC | `<select>` | **fijo por carrier** (3 opciones) | no | **no** |

> **19 fichas en dos países y cinco arquitecturas. Cero campos de fecha.** `[obs]`


**7.4 · La carga de la validación está en el dropshipper, no en Dropi.**
El copy asume que el dropshipper ya habló con el comprador (*"si ya validó la información con el cliente"*). El producto **no le da ninguna herramienta para hacerlo** y no registra si ocurrió. `[obs]`

**7.5 · La devolución es el default, y está escrita en el copy.**
*"de lo contrario, será devuelto al remitente."* No hacer nada = devolver. `[obs]` Es la traducción literal del 74,3% del §Metadatos.

**7.6 · `Solución`, `Fecha Solución` y `Usuario Solución` están vacías en el 100% de las filas observadas** (~11 filas, ventana 17–24 ago), **incluidas las que tienen `Estado: NOVEDAD SOLUCIONADA`** y una con `Estado: ENTREGADO`. `[obs]`

> El campo **existe en el modelo** — el Historial hasta ofrece el radio *"Filtrar por Fecha de Solución"* — pero **nunca se llena**. Es la confirmación en producto de `solved_by_logistic = 0` y de *"resuelta es humo"*, que hasta hoy solo teníamos por extracto de data. `[obs + doc:tema 04]`

**7.7 · No hay antigüedad, ni dueño, ni SLA.**
La bandeja mostraba el 24-ago novedades con `Fecha de Novedad` del **26–27 de julio**: ~4 semanas abiertas. No hay columna de antigüedad, ni de responsable, ni de estado de gestión. `[obs]`

**7.8 · La observación rica de la transportadora se pierde.**
El modal traía: *"El destinatario vive en un batallón de alta montaña alejado del pueblo y no responde las llamadas"*. Texto libre, valioso, que no alimenta ningún campo, ninguna regla y ninguna métrica. `[obs]`

### 8 · Inventario exhaustivo del módulo — Colombia (segundo recorrido, 2026-08-24)

| Superficie | Todo lo que existe | `[obs]` |
|---|---|---|
| **Filtros de la bandeja** | 7 desplegables (dropshipper · supplier · bodega · departamento · ciudad · tienda · transportadora) + 3 radios (guía / orden ID / celular) + rango de fechas + búsqueda libre. **Ninguno por tipo de novedad. Sin paginador ni conteo total.** | ✅ verificado por DOM |
| **Menú "Acciones"** | Un solo ítem: `Descargar Novedades`. **No hay acciones masivas.** | ✅ |
| **Acciones por fila** | `Solucionar` + `Información de la Orden`. Nada más. | ✅ |
| **Modal `Solucionar`** | **Estado inicial:** `Si`, `NO`, `Cerrar`, cero campos. **Tras pulsar `Si`:** formulario variable por motivo/carrier + `GUARDAR SOLUCION` (ver §7.3). **En ningún caso observado hay campo de fecha.** | ✅ ambos estados verificados |
| **Lupa `Información de la Orden`** | Solo lectura: economía, historial de estados, movimientos, validación de dirección, cartera, garantías. Único botón: `Cerrar` | ✅ |

> **`Si` no es el commit.** Pulsarlo despliega el formulario en cliente; el commit es `GUARDAR SOLUCION`, que **nunca se pulsó** sobre ninguna orden real. Falta confirmar con TI si `Si` dispara alguna llamada por sí solo.

### 9 · Caso de estudio — orden #80542212 (Colombia · Coordinadora)

La primera orden de la bandeja. Contiene sola casi todos los hallazgos. `[obs]`

| Fecha | Evento |
|---|---|
| 30/06 10:05 | Orden creada |
| **30/06 15:05** | **Validación automática de dirección → `Validación fallida`** — y se despacha igual |
| 30/06 19:24 | Entregada a la transportadora (**Dropi tardó 9 horas**) |
| 03/07 · 09/07 | En reparto — intentos 1 y 2 |
| **13/07** | "Se visita, no se logra entrega" — **el hecho real ocurre aquí** |
| 21/07 | Vuelve a terminal destino |
| 25/07 | En reparto — intento 3 |
| **26/07** | **Se registra la NOVEDAD — 13 días después del hecho** |
| **24/08** | Sigue abierta. `Solución`, `Observación`, `Fecha de Solución`, `Solucionado Por`: **vacías** |

Contexto: Coordinadora · CON RECAUDO · $99.900 · el vendedor gana $25.711 si se entrega. La dirección es un batallón militar en zona rural; el comentario del repartidor lo dice completo: *"vive en un batallón de alta montaña alejado del pueblo y no responde las llamadas"*.

> **El gate pre-despacho no hay que justificarlo con una hipótesis: la señal ya existe, ya se calcula y ya se guarda.** Simplemente no detiene nada. Es la evidencia más fuerte encontrada para la Idea A del `spec.md`. `[obs]`

**Lo que demuestra:** validación que no bloquea · reintento a ciegas (3 visitas sin cambiar la causa) · la novedad se registra tarde · sin dueño ni SLA (29 días abierta) · la solución no se registra · y Dropi no es el cuello (9h al handoff, los 55 días vienen después) — consistente con `[doc:tema 04]`.

### 10 · El top real: 50 etiquetas = 85% del volumen y 96% del premio

De las 324 etiquetas, **50 concentran el 85,1% del volumen y +99.599 de las +103.807 entregas en juego**. Las otras 274 se reparten el 15% restante. `[data]`

Detalle en `scratch/novedades/top50-etiquetas.csv` (con motivo canónico, país, carrier, rescate, techo y brecha por fila).

**Implicación de priorización:** homologar no exige tocar 324 etiquetas de entrada. **Mapear 50 cubre el 96% del beneficio**; el resto puede entrar por revisión trimestral (N99).

### 11 · El top por país — el perfil cambia por completo (Fase 2.2 del plan)

Hasta ahora solo existía el top global y el de Colombia. Con los 10 países desagregados, la conclusión más importante es que **no hay un problema de novedades: hay diez problemas distintos.** `[data]`

| País | Novedades | Rescate | Devolución | Sin explicar | Etiq. | Motivo dominante | % | **Techo/mes** |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| **Colombia** | 541.083 | 15,6% | 83,4% | 1,1% | 114 | Rechazo—arrepentimiento | 32,6% | **+75.399** |
| México | 148.596 | 16,2% | 37,7% | **⚠️ 46,1%** | 110 | Rechazo—arrepentimiento | 37,1% | +12.708 |
| **Ecuador** | 103.628 | 24,3% | 75,5% | 0,1% | 80 | **Incidente carrier** | 31,1% | **+12.032** |
| Chile | 73.833 | 13,3% | 81,3% | 5,4% | 30 | **Rechazo—arrepentimiento** | **74,7%** | +1.662 |
| Panamá | 16.859 | **30,8%** | 69,0% | 0,2% | 25 | Reprogramación | 32,6% | +1.126 |
| Paraguay | 15.035 | 28,9% | 70,3% | 0,8% | 50 | No contactable | 41,0% | +827 |
| **Argentina** | 7.167 | **12,1%** | 87,4% | 0,4% | 15 | **Reprogramación** | **55,8%** | **+2.375** |
| Costa Rica | 2.381 | **33,6%** | 57,6% | 8,8% | 22 | Reprogramación | 37,0% | +105 |
| Guatemala | 1.950 | 16,1% | 83,9% | 0,0% | 20 | No contactable | 34,8% | +263 |
| Perú | 636 | 23,9% | 58,3% | 17,8% | 34 | Ausente en la visita | 29,9% | +50 |

*Techo = P75 global del motivo canónico aplicado al volumen del país. Se usa el P75 global (no el del país) para que los países sean comparables entre sí.*

**Lo que sale de aquí:**

1. **Colombia es el 73% del techo total** (+75.399 de +103.807). Cualquier cosa que se construya se construye para Colombia primero, no por sesgo sino por aritmética. Y dentro de Colombia el techo no está en su motivo dominante: N08 rechazo es el 32,6% del volumen pero solo +4.534 de techo, mientras **N01 reprogramación aporta +51.926**. `[data]`

2. **Chile es un país de soltar, no de pelear.** El 74,7% de sus novedades son rechazo puro y su techo entero es +1.662 sobre 73.833 novedades — **2,3% de su volumen**. Solo 30 etiquetas, el vocabulario más limpio del dataset. **Invertir en recuperación en Chile no paga**; lo que paga es devolver rápido y barato. Es la conclusión más contraintuitiva del research y la más fácil de ejecutar. `[data]`

3. **Ecuador es un caso aparte: 31,1% de sus novedades son incidentes operativos del carrier** (N12), casi todo `DEVUELTO DE` de Servientrega — 30.383 novedades con **5,6% de rescate**. No es un problema de comprador ni de dirección: es la transportadora. Ese frente no se arregla con producto, se arregla con el carrier, y vale +9.413 entregas. `[data]`

4. **Argentina tiene el mejor rendimiento relativo del dataset.** 55,8% de reprogramación con **12,1% de rescate — el peor del mundo Dropi** — y un techo de +2.375 sobre solo 7.167 novedades: **33% de su volumen es recuperable**. Es el país donde el mismo arreglo (N01) rinde más por unidad de esfuerzo. `[data]`

5. **Panamá y Costa Rica ya lo hacen bien** (30,8% y 33,6% de rescate, ambos con reprogramación dominante). Son los candidatos naturales a auditar como fuente del playbook, junto con Ecuador/Veloces.

6. **La dispersión de vocabulario no se explica por el tamaño:** Chile mueve 73.833 novedades con 30 etiquetas y Paraguay 15.035 con 50. Colombia tiene 114 y México 110. **La deuda de taxonomía es una decisión de cada operación, no una consecuencia del volumen.** `[data]`

> ⚠️ **México queda fuera de toda comparación** hasta que Data explique las 68.480 novedades (46,1%) que no son ni entrega ni devolución. Perú (17,8%) y Costa Rica (8,8%) tienen el mismo problema en menor escala; sus cifras se leen con reserva. `[data]`

Detalle completo por país —perfil de motivos y top de etiquetas hasta el 80%— en `scratch/novedades/tops-por-pais.txt`; resumen en `scratch/novedades/resumen-paises.csv`.

---

## Dolores detectados

| # | Dolor | Intensidad | Afectado | Evidencia |
|---|---|---|---|---|
| 1 | La novedad llega como texto libre de la transportadora; el sistema no sabe qué acción ofrecer | **Crítico** | Dropshipper / Marca, comprador final | 324 etiquetas, 275 de un solo carrier `[data]` |
| 2 | 118.988 órdenes/mes esperan una coordinación que no ocurre | **Crítico** | Comprador final | `COORDINAR LA ENTREGA` 15,1% rescate `[data]` |
| 3 | El comprador que ya se mudó pierde el pedido aunque diga dónde está | **Alto** | Comprador final | pasivo 10,5% vs activo 38,8% `[data]` |
| 4 | "Resuelta" no significa entregada — la gestión administra el fracaso | **Alto** | Dropi (costo) | % resuelta 70-85% vs entrega final baja `[doc:tema 04]` |
| 5 | Cancelación se trata como final; nunca se ofrece alternativa | **Medio** | Dropshipper | `Pedido cancelado` 44.658, 5,7% rescate `[data]` |
| 6 | El mismo proceso rinde 2,3x distinto entre países sin que nadie lo copie | **Alto** | Dropi (operación) | Veloces EC 60,7% vs MX 26,7% `[data]` |
| 7 | **El formulario de solución no deja poner fecha — ni en la novedad llamada `Reprogramar entrega`** | **Crítico** | Comprador final | 4 casos observados, ninguno con campo de fecha `[obs §7.3]` |
| 7b | **El formulario de Envía (37% del volumen) es el más pobre:** 4 campos de texto libre, sin mapa, sin catálogo | **Crítico** | Dropshipper / Marca | `[obs §7.3]` |
| 8 | **No se puede filtrar por tipo de novedad** en ninguna de las dos vistas | **Crítico** | Operación Dropi | Filtros observados: carrier, ciudad, tienda, fechas — ninguno por motivo `[obs]` |
| 9 | **`Solución` y `Usuario Solución` nunca se llenan**, ni en órdenes marcadas SOLUCIONADA | **Crítico** | Dropi (ceguera) | 100% de filas vacías en la ventana observada `[obs]` |
| 10 | Novedades de hace 4 semanas siguen en la bandeja, sin antigüedad ni dueño visible | **Alto** | Comprador final | Fecha de novedad 26–27/07 vista el 24/08 `[obs]` |
| 11 | La validación con el cliente se le exige al dropshipper sin darle herramienta | **Alto** | Dropshipper / Marca | *"Si ya validó la información con el cliente…"* `[obs]` |

---

## Oportunidades identificadas

| # | Oportunidad | Relacionada con dolor | Estado |
|---|---|---|---|
| O1 | **Homologar los 324 motivos a un catálogo cerrado** de ~12 causas canónicas, cada una con acciones permitidas | 1, 4 | ⚪ nueva — extiende `normalizacion-estados` a novedades |
| O2 | **Catálogo de acciones por novedad**: que cada motivo canónico exponga qué puede hacer el comprador/dropshipper, no solo qué pasó | 1, 2, 3, 5 | ⚪ nueva — es el corazón de este research |
| O3 | **Reprogramación asistida** para el clúster Coordinación (empezando por Envía/CO) | 2 | ⚪ nueva — 43K entregas de techo |
| O4 | **Cambio de dirección en novedad** (pedir ubicación, no texto) | 3 | 🟡 ya existe: `direccion-confiable-geo` Sol R1 |
| O5 | **Triaje automático pelear/soltar/rediseñar** con dueño + SLA | 4, 6 | 🟡 ya existe: `novedad-dueno-triaje` Sol A1 |
| O6 | **Playbook por país**: copiar el proceso del P75 a los países que rinden peor | 6 | ⚪ nueva — barata, sin desarrollo |
| O7 | **Rescate en cancelación**: ofrecer nueva dirección/fecha antes de consumir la devolución | 5 | 🟡 parcial: `spec` Idea B (sub-estados) |
| O8 | **Motivo de novedad como campo de primera clase**: columna, filtro y agrupación en bandeja e historial | 8 | ⚪ nueva — habilitante del triaje, barata |
| O9 | **Forzar el registro de solución** (`Solución` + `Usuario` obligatorios para cerrar) | 9 | ⚪ nueva — sin esto no hay baseline de recuperación medible |
| O10 | **Antigüedad + dueño + SLA visibles** en la bandeja | 10 | 🟡 es la Idea A del spec, ahora con evidencia de UI |

---

## Hipótesis

### A validar (ninguna está confirmada)

**H-N1 · La acción, no la causa** — *Creemos que exponer una acción concreta al comprador cuando cae la novedad subirá el rescate del clúster Coordinación de 21,3% a ≥35%, porque los motivos que ya nombran una acción rescatan 37,9% vs 14,7% de los que solo describen.* Falsable: A/B sobre Envía/CO. `[data]`

**H-N2 · El proceso es copiable** — *Creemos que el diferencial 60,7% (EC) vs 26,7% (MX) sobre la misma etiqueta y el mismo carrier es proceso operativo replicable, no característica del mercado.* Falsable: auditar el proceso de Ecuador/Veloces y replicarlo en México. Costo ≈ 0 en desarrollo. `[data]`

**H-N3 · Soltar rápido es rentable** — *Creemos que devolver en <24h el clúster Rechazo (314K/mes, 5,9% rescate) libera capacidad y baja costo sin perder entregas materiales.* Falsable: medir costo/día en red del segmento. `[data]`

### Descartadas por esta data

**❌ "Hay que priorizar por transportadora"** — ya venía descartado en `temas/04` (en red todos cierran 72-77%). Esta data lo refuerza desde otro ángulo: el spread grande no está *entre* carriers sino *dentro* del mismo carrier entre países. `[data + doc:tema 04]`

**❌ "El problema es que no se reintenta"** — el clúster Rechazo (36% del volumen) tiene 6,4% de rescate; reintentar ahí es gasto. Consistente con "el primer intento decide". `[data + doc:tema 04]`

---

## Respuesta directa a las preguntas de producto planteadas

| Pregunta | Qué dice la data | Recomendación |
|---|---|---|
| *"COORDINAR LA ENTREGA debería mostrar fecha y dirección, ¿no?"* | 118.988/mes, 15,1% rescate. Los motivos que sí ofrecen fecha rescatan 37,9%; el mejor observado, 60,7% | **Sí, y es el mayor palanca única del dataset.** Fecha + franja + confirmación. Techo 43K entregas/mes |
| *"Destinatario se trasladó / cambio de ubicación"* | Pasivo 10,5% ↔ activo 38,8% sobre volumen casi idéntico (6.064 vs 6.439) | Convertir el motivo pasivo en acción: pedir **ubicación** (pin/WhatsApp), no dirección escrita. Engancha `direccion-confiable-geo` R1 |
| *"Pedido cancelado, ¿y si le pongo otra dirección?"* | 44.658/mes, 5,7% rescate, 91,6% devolución | **Cuidado:** cancelado cae en el clúster de intención rota. La data **no** respalda rescatarlo masivamente. Sí vale probar *antes* de consumir la devolución, como sub-estado — pero como experimento acotado, no como default |
| *"No se localiza dirección → ¿un validador de dirección?"* | 18.556/mes, 28,0% rescate — ya por encima del P75 de su clúster (29,0%) | El validador **ya existe** (`is_validated`, escudo verde). El gap no es construirlo: es **cobertura** y es **coordenada**, no texto. `[doc:tema 11 H5]` No abrir proyecto nuevo |
| *"Si la novedad es 'no lo contacté', ¿qué pasó y cómo quedó?"* | **No queda registro.** `Solución`, `Fecha Solución` y `Usuario Solución` están vacías incluso en órdenes marcadas `NOVEDAD SOLUCIONADA` | Hacer obligatorio el registro de solución (O9). Sin eso no hay baseline de recuperación ni forma de auditar qué funcionó |
| *"¿Qué posibilidades de solución tiene hoy una novedad?"* | **Una: un binario Sí/NO** (reofrecer o devolver), igual para las 324 etiquetas | Construir el catálogo de acciones por motivo canónico (O2). Es el corazón de este research |
| *"¿Cuáles son las quejas?"* | **No hay data de quejas en este dataset** | Ver Vacíos. Es el research que falta |

---

## Métricas mencionadas

| Métrica | Qué mide | Umbral / referencia | Quién la usa |
|---|---|---|---|
| % rescate de novedad | novedades que terminan entregadas | **17,0%** hoy (global, jun-2026) | Logistic Success |
| % devolución de novedad | novedades que terminan devueltas | **74,3%** hoy | Logistic Success |
| Tasa de entrega | KR2.1 | ≥70% | OKR2 · PRM-1396 |
| Entregas recuperables/mes | techo P75 por clúster | **+95.688** | este research |
| Etiquetas de novedad activas | deuda de taxonomía | **324** → meta: catálogo cerrado | O1 |

---

## Relación con iniciativas Dropi

| Iniciativa | Conexión |
|---|---|
| `novedad-dueno-triaje` (PRM-1512) | Este research **le pone números al triaje**: soltar 314K, rediseñar 230K, pelear 110K |
| `reduccion-devoluciones-cod` (PRM-1523/1580) | Confirma que Pago es solo 15.667 novedades (1,7%) *dentro del módulo de novedades* — el COD pesa por otra vía, no por motivo de novedad |
| `direccion-confiable-geo` | O4 le aporta el motivo activo/pasivo; refuerza "la coordenada, no el validador" |
| `normalizacion-estados` | O1 es la misma deuda aplicada a novedades |
| PRM-1515 ChateaPro | Canal natural para la reprogramación asistida (O3) |

---

## Vacíos de información

- **Sin voz del usuario.** Cero entrevistas, cero tickets, cero quejas. Todo lo conductual aquí es inferencia sobre agregados. **La pregunta "¿cuáles son las quejas?" no se puede responder con esta data.**
- **Sin nivel orden.** El export es agregado país×carrier×motivo. No se puede medir tiempo hasta resolución, número de intentos ni secuencia de la novedad.
- **Un solo mes** (junio 2026). Sin serie, no se distingue estacional de estructural. Los % del P75 podrían moverse.
- **Los porcentajes no cierran a 100.** Ej. México: 16,2% entregado + 37,7% devuelto = 54%. El 46% restante no está identificado en el export (¿en tránsito al corte? ¿otro estado?). **Hay que resolverlo antes de publicar cualquier cifra a negocio.**
- **El recorrido del módulo fue exploratorio, no exhaustivo.** Se observó la bandeja, el modal `Solucionar` y el Historial (~11 filas, ventana 17–24 ago) desde la cuenta de Juan. No se recorrió el menú `Acciones` masivas, ni el detalle (lupa), ni la vista de otros roles/países. **No se ejecutó ninguna acción** sobre órdenes reales.
- **El módulo solo se verificó en Colombia.** Los 9 países restantes no se revisaron. Todo lo del §7–§9 (filtros, acciones, binario Sí/NO, campos vacíos) debe leerse como *"así es en CO"*, no como *"así es en Dropi"*.
- **La observación de `Solución` vacía es de una muestra pequeña**, no de una query. Hay que confirmarla contra `history_new_orders` antes de darla por universal.
- **Todo es correlación.** Ningún hallazgo aquí prueba causa.

---

## Recomendaciones para nuevo research

1. **Research cualitativo de quejas** — tickets de soporte + WhatsApp de compradores con novedad. Es el vacío #1 y el que el equipo pidió explícitamente.
2. **Recorrer el módulo en Ecuador y México — prioridad máxima.** Mismo carrier (Veloces), rescate 60,7% vs 26,7% en el mismo motivo N01. Si el módulo ecuatoriano ofrece acciones que el colombiano no tiene, la explicación del spread deja de ser "proceso" y pasa a ser **producto** — y eso cambia por completo la Fase 2 del catálogo. Segundo interés: Ecuador/Gintracom es el único carrier del dataset con la etiqueta `SOLICITA CAMBIO DE DIRECCIÓN` (2.517 novedades, **64,0% de rescate**, el mejor del dataset); hay que ver si allá existe una acción de cambio de dirección en pantalla.
3. **Auditoría de proceso Ecuador/Veloces vs México/Veloces** — la explicación del 60,7% vs 26,7%. Barata, sin desarrollo, y valida H-N2.
4. **Recorrido guiado del módulo de Novedades** con el equipo que lo opera: qué acciones existen hoy, cuáles se usan, cuál es el default.
5. **Query a nivel orden** sobre `history_new_orders` para tiempo hasta resolución y secuencia. Ya identificado como pendiente en el spec §9.
6. **Cerrar la brecha del 46% no identificado** en el export de Power BI con Data.

---

## Fuentes

| Tipo | Descripción |
|---|---|
| Data cruda | `data (11).xlsx` — export Power BI, `Año=2026 / Mes=JUN`, 702 filas, 10 países, 42 país×carrier. Original en Downloads del PM; no versionado (regla de bóveda) |
| Scripts de análisis | `scratch/novedades/analisis.py` · `accion_vs_descripcion.py` · `triaje.py` |
| Observación de producto | `app.dropi.co/dashboard/novelties` y `/dashboard/incidence-history` — **instancia Colombia**, recorrido 2026-08-24, sesión Juan Bautista, solo lectura. Screenshots no versionados (contienen PII de compradores) |
| Conocimiento previo | `conocimiento/temas/04-hallazgos-data.md` · `temas/05-hipotesis-palancas-y-plan.md` · `temas/11-plataforma-modulos.md` |
| Specs relacionados | `proyectos/novedad-dueno-triaje/spec.md` · `reduccion-devoluciones-cod/spec.md` · `direccion-confiable-geo/spec.md` |
| Jira | PRM-1512 · PRM-1523 · PRM-1580 · PRM-1396 (KR2.1) |

## Changelog

- 2026-08-25 — **§7.5 — ECUADOR, el test decisivo.** `Reprogramar entrega` de Veloces es **campo por campo idéntico** en Colombia y Ecuador, y rescata 35,3% vs **60,7%**. **El producto no explica la diferencia: es proceso.** El techo de N01 es alcanzable sin construir. Se invierte el orden del roadmap: auditar Ecuador antes de pedir el campo de fecha. Además: Servientrega `DEVUELTO DE` (31% de EC) solo deja cambiar nombre y celular; Gintracom tiene catálogo fijo por carrier. **19 fichas, 5 arquitecturas, cero campos de fecha.**
- 2026-08-25 — **§7.3 quater — Bogotá.** Tres arquitecturas confirmadas (Coordinadora catálogo · Envía texto libre vacío · Veloces/JAMV prellenado con mapa), **ninguna con campo de fecha en 15 fichas**. Capturada la línea base de Veloces·Reprogramar Colombia para el contraste contra Ecuador. Hallazgos de maestro: Ciudad no filtra sin Departamento, Bogotá vive bajo Cundinamarca, y `LA GUAJIRA`/`GUAJIRA` están duplicados.
- 2026-08-25 — **§7.3 ter — barrido de Envía.** Los 5 motivos más grandes de Envía comparten **un único formulario genérico** de 4 campos de texto libre, sin catálogo, sin mapa y sin fecha — incluida `DESTINATARIO FIJA FECHA Y HORA`, donde el comprador ya dijo cuándo. Cobertura del barrido: 13 fichas, 69,4% de Colombia, 41,2% global, 8 de 13 motivos. **Corrección: el filtro de Transportadora sí funciona.**
- 2026-08-25 — **§7.3 bis — el modelo real, 9 fichas.** Coexisten dos arquitecturas: la estructura la define el carrier (Coordinadora = catálogo cerrado; Envía/Veloces/JAMV = texto libre), el catálogo lo define la etiqueta y está mal asignado. Resuelta la pregunta abierta: `Solución` SÍ es catálogo, pero solo en algunos carriers. Hallazgo crítico: `solicita la entrega en una fecha posterior` → única opción `Devolución total`. Ninguna de las 9 fichas tiene campo de fecha.
- 2026-08-25 — Añadidos **Insights (I1–I7)** y **Cómo se construyeron las métricas**: definición de `rescate`, `techo` (P75, umbral 300) y `densidad`, con sus supuestos débiles declarados y la regla de priorización de tres cruces. El techo queda marcado explícitamente como no-meta.
- 2026-08-25 — Añadido §11: top y perfil de motivos de los 10 países (Fase 2.2 del plan). Colombia = 73% del techo · Chile es de soltar (techo 2,3% de su volumen) · Ecuador es un problema de carrier, no de comprador · Argentina tiene el mejor rendimiento relativo. México sigue bloqueado por el 46,1% sin explicar.
- 2026-08-24 — **CORRECCIÓN MAYOR (§7.3):** era falso que el módulo ofreciera solo un binario Sí/NO. `Si` abre un formulario que varía por motivo/carrier. Se caen tres afirmaciones (A03/A06/A08 sí existen; A04 parcial). Se refuerza la central: **no hay campo de fecha en ningún caso, ni en `Reprogramar entrega`** — A01/A02 siguen sin existir sobre 170.720 novedades/mes. Detectado por Juan.
- 2026-08-24 — **Alcance corregido: el recorrido del módulo es Colombia únicamente.** §7–§9 marcados como CO. Nueva recomendación #2: recorrer Ecuador y México para saber si el spread es proceso o producto.
- 2026-08-24 — Añadidos §8 (inventario exhaustivo de filtros y acciones, verificado por DOM), §9 (caso #80542212: la validación de dirección falló el día 0 y se despachó igual) y §10 (top-50 = 85% del volumen, 96% del premio). Pendiente: qué ejecuta el botón `Si`.
- 2026-08-24 — Añadido §7: recorrido del módulo en producción. Confirma en producto la tesis del §2 (la acción no existe) y `solved_by_logistic = 0`. Nuevos dolores 7-11 y oportunidades O8-O10. El vacío "no se leyó el módulo" queda cerrado.
- 2026-08-24 — Research creado. Primer corte de novedades por país×carrier×motivo. Aporta a PRM-1512 el dimensionamiento del triaje y la tesis "acción vs descripción". Pendiente: leer el módulo en producción, cerrar el 46% no identificado, y el research cualitativo de quejas.
