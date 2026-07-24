# Prompt · análisis de distribución de estados sobre la base de guías de Dropi

> Pegar completo a un agente/analista con acceso de lectura a la base de órdenes y guías.
> Producido para PRM-1297 (homologación de estados) · 2026-07-22.

---

Sos analista de datos. Tenés acceso de lectura a la base de órdenes y guías de Dropi
(plataforma de dropshipping COD en LATAM). Necesito que caracterices **cómo se distribuyen
los estados en la realidad**, no en el catálogo.

Trabajo sobre el universo completo disponible, no sobre una muestra. Si tenés que limitar
por costo, **decímelo explícitamente y decime qué límite pusiste** — un número sin su alcance
no me sirve.

## Contexto que necesitás para no equivocarte

**Hay tres vocabularios de estado distintos y NO hay que mezclarlos:**

- **A · Estado de la ORDEN** — el ciclo de vida en Dropi (`PENDIENTE CONFIRMACION`, `PENDIENTE`,
  `GUIA_GENERADA`, `ENTREGADO`, `CANCELADO`…). Su línea de tiempo vive en el historial de la orden.
- **B · Estado de la GUÍA** — lo que reporta la transportadora (`EN REPARTO`, `NOVEDAD`,
  `RECLAME EN OFICINA`, `INTENTO DE ENTREGA`…).
- **C · Movimientos del carrier** — texto libre, sin estructura. **Ignoralo por completo para
  este análisis.** No es homologable: un carrier manda `"4"`, otro manda un párrafo de 300
  caracteres. Solo sirve para fechar eventos.

Quiero A y B, **reportados por separado y claramente etiquetados**. Si en la base están
mezclados en una sola columna, decímelo — eso ya es un hallazgo.

**Cinco trampas conocidas. Si caés en alguna, los números salen mal en silencio:**

1. **Casing.** El catálogo publica los estados en Title Case (`Entregado`) pero las órdenes y
   guías reales los traen en MAYÚSCULAS (`ENTREGADO`). **Normalizá antes de agrupar** o el
   mismo estado sale partido en dos filas.
2. **Acentos y variantes.** `DEVOLUCION` y `DEVOLUCIÓN` son el mismo estado. Igual
   `INDEMNIZADA`/`INDEMNIZADO`/`INDEMNIZACION`. Agrupá las variantes y **mostrame qué agrupaste**.
3. **Eventos duplicados.** Los movimientos llegan repetidos, mismo texto con timestamps a
   segundos de distancia. Deduplicá por (estado, timestamp) antes de contar.
4. **Timestamps sin zona horaria.** Vienen naive y están en hora local del país de la instancia,
   no en UTC. No compares entre países sin convertir.
5. **Grano.** Una orden puede tener más de una guía (reexpedición, guía reemplazatoria).
   Decime si contás órdenes o guías — no son lo mismo y los dos están bien, pero hay que saber cuál.

---

## Lo que necesito, en orden de prioridad

### 1 · Frecuencia de estados por transportadora

Cada estado crudo distinto, con:

- conteo de guías (u órdenes) donde aparece **al menos una vez**
- conteo de ocurrencias totales
- % sobre el universo
- abierto por transportadora

Ordenado por volumen descendente. **Marcá el corte donde el acumulado llega al 80%, 95% y 99%.**

> Hipótesis a confirmar o tumbar: el catálogo publica ~900 estados pero **solo ~50 circulan de
> verdad**, y cerca de la mitad del catálogo tiene **cero ocurrencias históricas**. Si es cierto,
> el trabajo real de homologación es ~18× menor de lo que el catálogo sugiere. Necesito el número.

### 2 · Estados con cero ocurrencias

Lista de los estados que existen en el catálogo pero **nunca aparecieron** en tráfico real.
Con eso decido cuáles no vale la pena mapear a mano.

### 3 · Matriz de transiciones

Para cada par ordenado (estado A → estado B) de eventos **consecutivos** en la misma guía:
conteo y %. Abierto por transportadora en los pares más frecuentes.

Esto es lo que valida si el flujo que tenemos modelado se parece a la realidad.
**Señalame las transiciones frecuentes que parezcan imposibles** (ej. volver a un estado
anterior, saltarse fases enteras, o salir de un estado que se supone terminal).

### 4 · 🔴 ¿Qué significa `INTENTO DE ENTREGA`? — resolver por datos

Este estado es una ambigüedad crítica: **un carrier lo usa como "salió a reparto" y otro como
"intento fallido"**. Son cosas opuestas y hoy está sin resolver.

Se puede inferir de qué pasa después. Para cada transportadora que lo reporte, dame:

- **distribución del siguiente evento** después de `INTENTO DE ENTREGA` (en %)
- lo mismo para `EN REPARTO`, como grupo de control

**Lectura:** si a `INTENTO DE ENTREGA` le sigue mayoritariamente `ENTREGADO`, significa
"salió a reparto". Si le sigue `NOVEDAD` o `DEVOLUCION`, significa "intento fallido".
Si el patrón **difiere entre transportadoras**, entonces la colisión es semántica real y el
modelo necesita un eje por transportadora — que es la decisión de arquitectura más cara del
proyecto. Decime cuál de los tres casos es.

### 5 · 🔴 ¿Cuándo `Entregado` es de verdad terminal? — resolver por datos

`ENTREGADO` **no siempre es final**: se ven secuencias `ENTREGADO → EN REPARTO → ENTREGADO`.
Necesito definir cuántas horas sin movimiento confirman el cierre. Dame:

- **qué % de las guías que llegan a `ENTREGADO` registran algún evento posterior**
- de esas, la **distribución del tiempo** entre el `ENTREGADO` y el siguiente evento:
  mediana, p90, **p95, p99 y máximo**
- **qué estados** aparecen después de `ENTREGADO`, por frecuencia
- todo abierto por transportadora

**Para qué:** el p99 me da el umbral. Si el 99% de los rebotes ocurre dentro de las N horas,
entonces "N horas sin movimiento" define `Entregado confirmado` con riesgo conocido.

Hacé lo mismo para los otros estados que deberían ser terminales: `CANCELADO`, `RECHAZADO`,
`DEVOLUCION`, `INDEMNIZADO`. **Quiero saber cuáles rebotan y cuánto.**

### 6 · Colisiones entre transportadoras

Estados crudos con el **mismo texto** que aparecen en más de una transportadora, donde el
**comportamiento posterior difiere** (transición siguiente distinta). Ordenados por volumen.

Son los casos donde un catálogo global se rompe. Ya tengo 6 sospechosos:
`PENDIENTE`, `RECHAZADO`, `INTENTO DE ENTREGA`, `MERCANCIA RECOGIDA`, `REEMPLAZADA`,
`RECOGIDA FALLIDA`. Confirmalos o descartalos, y **decime si hay otros que no tenía**.

### 7 · Longitud de las trazas

Distribución de cuántos eventos tiene una guía de punta a punta: mediana, p90, p99, máximo.
Y el desglose de las más largas — quiero ver si son ciclos de novedad-reintento o ruido.

---

## Cómo quiero la respuesta

- **Tablas planas** (CSV o markdown) con **conteos crudos además de porcentajes**. Los % los
  recalculo; los crudos no los puedo reconstruir.
- Al principio, declaración explícita de: **universo** (cuántas guías/órdenes),
  **ventana temporal**, **países**, **exclusiones** (garantías, pruebas, marca blanca) y
  **grano** (orden vs guía).
- Cada normalización que hayas aplicado (casing, acentos, agrupaciones), **listada**.
- Separá siempre **hecho medido** de **interpretación tuya**. Si algo no se puede responder con
  los datos disponibles, **decilo en vez de estimarlo**. Prefiero un hueco declarado a un número
  inventado.

## Chequeo de sanidad

Antes de entregar, verificá que la suma de los conteos por transportadora dé el total del
universo. Si no cuadra, hay guías sin transportadora asignada — **quiero verlas**, son un caso
que el modelo no contempla.

---

## Para qué se va a usar

Cerrar el catálogo de homologación de estados de Dropi antes del hand-off a desarrollo.
Los puntos **4 y 5** son los dos gates críticos del proyecto: hoy están esperando respuesta de
dos transportadoras, y creo que los datos pueden responderlos antes y mejor.
