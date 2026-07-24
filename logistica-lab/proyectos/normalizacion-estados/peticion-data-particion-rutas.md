# Petición de datos — partición de rutas y vocabulario real de estados (PRM-1297)

> **Para:** quien pueda consultar el modelo semántico de Power BI (o la DB detrás).
> **De:** Juan Bautista · célula Logistic Success · 2026-07-22
> **Por qué:** el catálogo de homologación se está validando hoy contra **52.636 guías**
> (una ventana), pero Dropi mueve millones. Antes de entregar a TI necesito saber **cuánto pesa
> de verdad cada ruta y cada estado**, sobre el universo completo.

---

## Contexto mínimo

El catálogo propuesto modela **3 rutas operativas** entre "Guía generada" y "Recibido por
transportadora". Hoy no sé cuánto pesa cada una, y el entregable las presenta como equivalentes.

| Ruta | Cómo se reconoce |
|---|---|
| **Directo** | el proveedor entrega al carrier; no pasa por ECOM ni por Dropi |
| **ECOM** | pasa por preparación ECOM, pero lo recoge el carrier |
| **ECOM + Dropi** | lo recoge Dropi, pasa por bodega Dropi y luego al carrier |

En el modelo, la tabla **Recolecciones** ya tiene las medidas de fase construidas
(`Recibido_PAU` → `Preparado_para_Tte` → `Recogido_Dropi` → `Entregado_a_Tte`), que es
justamente la señal que separa las tres rutas.

⚠️ **Los nombres de columna de abajo salen de mis notas del esquema, no de la fuente.**
Si no coinciden, usá el equivalente y decime cuál era — no adivines la semántica.

---

## Lo que necesito

### 1 · Partición de rutas (la pregunta principal)

Al **grano de guía** (o de orden si no hay guía), sobre el universo completo:

| Ruta | Regla propuesta |
|---|---|
| ECOM + Dropi | tiene `Recogido_Dropi` con valor |
| ECOM | tiene `Preparado_para_Tte`, **sin** `Recogido_Dropi` |
| Directo | no tiene ninguno de los dos |

Devolver: **conteo y % por ruta**, y el **total del universo**.

> Si la regla no es válida (ej. una guía puede tener `Recogido_Dropi` sin pasar por ECOM),
> **decímelo** — eso solo ya corrige el modelo.

### 2 · Lo mismo, abierto por transportadora

Ruta × `transportadora`. Quiero ver si el mix cambia entre carriers — sospecho que Veloces y
99minutos son mucho más "Dropi" que Envía o Interrapidísimo, pero no lo tengo medido.

### 3 · Vocabulario real de estados, por transportadora

Para dimensionar la homologación de verdad:

- Cada **estado crudo** distinto (el texto tal cual llega), con su **conteo de guías**,
  abierto por `transportadora`.
- Ordenado por volumen descendente.
- Marcar cuáles tienen **0 ocurrencias** en el periodo (el catálogo publica ~900 y sospecho
  que la mayoría nunca circula).

Esto es lo que decide **cuántos estados hay que homologar de verdad** — no los 900 del catálogo.

### 4 · Desenlace final

Distribución de `estado_orden` / `Estados_cierre_Transportadora` al cierre, en %, sobre el
universo completo y abierto por transportadora. Quiero contrastar contra la ventana que ya
tengo: Entregado 54,7% · Cancelado 14,1% · Devolución 7,9%.

### 5 · Un ejemplo real por ruta

**Una guía real de cada ruta**, con su secuencia completa de estados en orden cronológico
(estado + timestamp). Solo el ID de guía y los estados — **sin datos del comprador**
(nombre, teléfono, dirección). Es para ilustrar el recorrido, no para operar.

---

## Definiciones que necesito que queden explícitas

Sin esto los números no son comparables con nada:

1. **Ventana temporal** usada, y por qué eje: ¿fecha de creación o fecha de cambio de estado?
2. **Países** incluidos. Si es solo Colombia, decilo — necesito saberlo, no asumirlo.
3. **Grano**: ¿una fila por orden o por guía? Una orden puede tener más de una guía
   (reexpediciones, guías reemplazatorias) y eso infla los conteos.
4. **Exclusiones** aplicadas: garantías, órdenes de prueba, marca blanca.
5. **Casing**: los estados llegan en MAYÚSCULAS en órdenes/guías pero en Title Case en el
   catálogo. Normalizar antes de agrupar o el mismo estado sale partido en dos filas.

## Chequeos de sanidad

- Los conteos de las 3 rutas deben **sumar el total** del universo. Si no suman, hay guías sin
  clasificar → quiero verlas, son un caso que el modelo no contempla.
- El total de guías debe **cuadrar con el panel mensual** de operación. Si no cuadra, prefiero
  saberlo antes que después.

## Formato

CSV o tabla plana, una fila por combinación, con los conteos crudos **además** de los
porcentajes. Los % los recalculo yo; los crudos son los que no puedo reconstruir.

---

## Para qué se va a usar

Cerrar el catálogo de homologación de estados (PRM-1297) antes del hand-off a TI. Hoy el
entregable se apoya en 14 guías de muestra que **sobre-representan la devolución ~10× y la
ruta Dropi ~50×** respecto de esa ventana. Con estos números, el mapa puede mostrar el peso
real de cada ruta en vez de presentarlas como equivalentes.
