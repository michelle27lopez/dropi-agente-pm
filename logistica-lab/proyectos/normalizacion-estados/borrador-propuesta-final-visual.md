# Borrador · propuesta final visual de normalización de estados

> **Estado: 🟡 borrador de trabajo · 2026-07-17. No promovido al spec.**
> Vista interactiva: `hub/src/app/proyectos/logistica/normalizacion-estados/`
> → ruta `/proyectos/logistica/normalizacion-estados` *(ruta actualizada tras la migración a Darwin
> del 21-jul; antes vivía en `tablero/app/normalizacion-estados/`)*.

## 1 · Objetivo del entregable

Convertir la propuesta técnica existente en una pieza revisable que permita cerrar:

1. el recorrido homologado por las tres rutas operativas;
2. la cobertura de países y transportadoras;
3. los ejemplos reales que prueban el comportamiento del catálogo;
4. la traducción operador → cliente final;
5. las decisiones necesarias antes del hand-off a TI.

## 2 · Evidencia disponible

| Capa | Cobertura | Estado | Fuente |
|---|---:|---|---|
| Catálogo por país | 9 países | 🟡 verificado vía API | `CONTEXTO_ESTADOS_DROPI.md §3.1` · 2026-07-11 |
| Tráfico real | 133.555 órdenes / 52.636 guías | 🟡 Colombia | `CONTEXTO_ESTADOS_DROPI.md §4` · 2026-07-12 |
| Mapeo crudo → destino | 576 mapeos / 7 carriers | 🟡 trabajo de campo | `fuentes/Homologacion_Estados_Final.xlsx` |
| Casos de punta a punta | 14 guías / 7 carriers | 🟡 muestra real | Excel, hoja `4. Guías de Prueba` |
| Macroproceso | 7 fases / 3 rutas | 🟡 propuesta de proceso | `fuentes/Macro-proceso-Logistica-Homologacion-estados.pdf` |

### Límite que debe quedar visible

⚠️ Los 9 países tienen catálogo publicado, pero la validación transaccional profunda solo está
documentada para Colombia. Por tanto, **no se puede afirmar todavía que la cobertura real esté cerrada
en todos los países**. El cierre mínimo es tomar al menos una guía real por país y registrar los estados
crudos que caigan en `Por clasificar`.

## 3 · Inconsistencias que la visualización no debe esconder

- 🟡 **26 estados base vs. ciclos parametrizados:** recolección y entrega agregan niveles/reintentos;
  falta decidir si son estados independientes o `estado + contador`.
- 🟡 **8 estados cliente vs. retiro en punto:** `Disponible para retiro` agrega una novena lectura.
  Recomendación: conservarla porque habilita aviso, punto y fecha límite.
- 🔴 **Entregado no siempre es terminal:** existe `Entregado → En reparto → Entregado`.
- 🔴 **Proceso finalizado no siempre finaliza:** existe `Proceso finalizado → Cancelado → Devolución`.
- 🟡 **Las muestras de carriers no coinciden:** el mapeo incluye TCC/JAMV-Drive; las guías incluyen
  99minutos/Futura. La validación final debe cruzar ambas listas.
- 🔴 **El diff de 145 ajustes está desactualizado:** usa estados DB retirados; debe recalcularse.

### 3.1 Incoherencia del propio entregable — corregida el 22-jul

Las trazas de las 14 guías vivían como chips de texto libre, con vocabulario propio, sin tocar el mapa.
**Es el error de capas que el proyecto denuncia, cometido dentro del entregable.** Corregido: cada paso
es ahora un `id` de nodo del mapa y la vista cliente se **deriva** del nodo, no se escribe a mano.

Lo que la normalización dejó a la vista:

| Hallazgo | Detalle |
|---|---|
| 🔴 2 pasos eran de la capa cliente | `En preparación` → reclasificado a `Preparado para transportadora`. `Proceso finalizado` **no tiene nodo** y se muestra así: es el mismo gate abierto (no es terminal en crudo). |
| 🟡 4 etiquetas no existían como nodo | `Pendiente confirmación`→`Por confirmar` · `Recibido transportadora`→`Recibido por transportadora` · `Devolución`→`En devolución` · `Devolución en proceso`→`En devolución` |
| 🔴 **Ninguna guía llega al cierre de la devolución** | Corregido el 22-jul (lo detectó Juan): el crudo `Devolución` **no** es `Devolución confirmada por bodega`. Ese estado **lo marca el PROVEEDOR** cuando bodega recibe físicamente (§10.A, fase 7), así que una traza de carrier no puede contenerlo. Las 11 devoluciones de la muestra terminan con el paquete **en retorno**, sin prueba de recepción. **El cierre de la fase 7 no está validado por ningún dato.** |
| 🟡 Dos crudos para el mismo estado | `Devolución` y `Devolución en proceso` caen ambos en `En devolución` — es el problema **P2** del catálogo (etiquetas destino inconsistentes), ahora visible en las trazas. |
| 🟡 El nodo `Reintento de entrega` no aparece nunca | Las trazas reales vuelven directo a `En reparto`. O el nodo sobra, o el reintento no se registra como evento propio. |

### 3.2 Cobertura real del catálogo: 14 de 24 nodos

Las 14 guías recorren **14 nodos**. Los otros **10 están en el catálogo porque el macroproceso los define,
no porque la muestra los pruebe**: `Pendiente de recolección` · `Entregado a transportadora` (todo el tramo
ECOM sin Dropi) · `Recolección fallida` · `Reintento de recolección` · `Disponible para retiro` ·
`Reintento de entrega` · `Siniestro` · `Indemnizado` · `Rechazado` · **`Devolución confirmada`**.

⚠️ El más grave es el último: **el desenlace más frecuente de la muestra (11 de 14 guías) no tiene su
estado de cierre validado.** Sabemos que el paquete vuelve; no tenemos un solo dato de que alguien
confirme que llegó.

La vista los lista aparte, en la pestaña **Ejemplos**, bajo «Cobertura de la muestra». Entran a TI como
propuesta, no como comportamiento observado — y eso debe decirse en la presentación.

> ⚠️ **«Validado» se usa con tres criterios distintos y no significan lo mismo** (corregido 28-jul).
> Conviene nombrarlos separados o la mesa los confunde:
> 1. **Respaldo en el tráfico** — lo que colorea el mapa: cuántos eventos reales caen en ese estado
>    (`observado` ≥ 0,5% · `raro` < 0,5% · `propuesto` = ningún crudo lo alimenta).
> 2. **Cobertura de la muestra** — los 10 nodos de esta sección: si alguna de las 14 guías los recorre.
> 3. **Sin crudo que lo alimente** — pestaña Homologación: la propuesta define el estado pero
>    ninguna fuente lo produce. El más estricto de los tres.
>
> Un estado puede pasar uno y fallar otro: `Disponible para retiro` tiene 184 eventos reales
> (criterio 1 ✅) y ninguna guía de la muestra lo toca (criterio 2 ❌).

## 4 · Gates para declarar la propuesta final

1. 🔴 Confirmar `INTENTO DE ENTREGA` con Interrapidísimo y Veloces.
2. 🔴 Definir cuándo `Entregado` pasa de observado a confirmado (N horas sin rebote).
3. 🟡 Cerrar reintentos como estados o como contador para recolección, entrega y devolución.
4. 🟡 Aprobar `Disponible para retiro` como estado cliente adicional.
5. 🟡 Completar por estado: movilizado, salida de bodega, terminal, reversible y efecto en stock.
6. 🟡 Validar al menos una guía por país contra el catálogo global.
7. ⚪ Recalcular el plan de implementación contra la DB vigente.

## 5 · Estructura visual implementada

- **Mapa objetivo:** selector Directo / ECOM / ECOM + Dropi y siete fases.
- **Países:** tamaño del catálogo y nivel de evidencia por país.
- **Carriers:** volumen de mapeos, concentración en Novedad y colisiones.
- **Ejemplos reales:** 14 trazas filtrables por carrier y desenlace.
- **Decisiones:** cola priorizada de gates con siguiente acción.

## 6 · Próxima iteración

La próxima iteración no debe agregar más diseño hasta resolver los dos gates críticos. Después:

1. incorporar ejemplos multinacionales;
2. cerrar el catálogo v1 con flags físicos;
3. reemplazar el borrador visual por la versión aprobada;
4. promover al spec únicamente con aprobación explícita de Juan.
