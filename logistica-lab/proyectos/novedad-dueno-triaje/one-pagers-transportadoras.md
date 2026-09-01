# One-pagers por transportadora — insumo para conversación comercial

> Logistic Success · Juan Bautista · 2026-08-25 · Datos: export Power BI jun-2026 (911.168 novedades, 10 países)
> Evidencia completa: `research-novedades-jun2026.md`

> ⚠️ **Nunca se han visto los contratos vigentes con las transportadoras.** No se sabe qué se pactó sobre
> reintentos, plazos ni quién paga el flete de retorno. **Todo lo de abajo son propuestas de negociación
> basadas solo en la operación observada** — hay que contrastarlas contra lo firmado antes de llevarlas a una mesa.

---

## 1 · SERVIENTREGA — Ecuador

| | |
|---|---|
| Peso en su país | **44,6%** de Ecuador (Gintracom es 47,7%) |
| Rescate global del carrier | **16,6%** — contra **30,1%** de Gintracom en el mismo país |
| El problema | `DEVUELTO DE`: **30.383 novedades/mes · 31% de todo Ecuador · 5,6% de rescate** |

**El argumento en una frase:** `DEVUELTO DE` **no es una causa, es un movimiento.** Es la transportadora informando que ya devolvió — no que hay una novedad que gestionar. Cuando esa etiqueta entra al sistema, **la decisión ya está tomada del lado del carrier.**

**Lo que lo confirma:** su formulario de solución tiene tres campos —`Solución`, `Nombre`, `Celular`— **sin dirección.** Para un envío que ya va de vuelta, el sistema deja cambiarle el nombre al destinatario. `[obs 2026-08-25]`

**El pedido:**
1. Eliminar `DEVUELTO DE` como motivo de novedad y reemplazarlo por **la causa real** tipificada.
2. **Evidencia de intentos** antes de poder marcar un envío en devolución.
3. Notificación previa: no cerrar en devolución sin avisar.

**La palanca:** Ecuador está repartido casi 50/50 con Gintracom, que **rescata casi el doble**. Hay con quién comparar y a quién mover volumen. Ese número solo es la conversación.

**Techo en juego:** +9.413 entregas/mes (motivo N12 · incidente de carrier en Ecuador).

---

## 2 · QUALITY POST — México

| | |
|---|---|
| Peso en su país | **90,3%** de México |
| Rescate global del carrier | 15,9% |
| El problema | **Es el peor del dataset en 5 de los 12 motivos canónicos** |

**Dónde es el peor de los 10 países:**

| Motivo | Quality Post | El mejor del mundo Dropi |
|---|---:|---|
| Cambio de dirección | **4,5%** | 64,0% · Gintracom EC |
| Dirección insuficiente | **6,4%** | 52,6% · TCC CO |
| No reconoce la compra | **3,0%** | 41,4% · Gintracom EC |
| Desconocido en la dirección | **10,5%** | 37,0% · Servientrega EC |
| Disconformidad con el producto | **2,3%** | 11,9% · Coordinadora CO |

**El argumento incómodo:** con **90,3% de concentración no hay palanca.** Esto no es un proveedor negociable: es un **punto único de falla**. Cualquier conversación desde esta posición es pedir un favor.

**Por eso el pedido real no es a Quality Post — es interno:** abrir un segundo carrier en México para crear competencia. Sin eso, la negociación no tiene con qué apoyarse.

> ⛔ **Antes de sentarse a cualquier mesa:** las **68.480 novedades sin explicar (46,1% del país)** son de aquí. No se lleva a una negociación una cifra que no cierra. Ver pedido a Data.

**Techo en juego:** +12.708 entregas/mes — el segundo del mundo Dropi.

---

## 3 · ENVÍA — Colombia

| | |
|---|---|
| Peso en su país | **62,5%** de Colombia · **37% del volumen global de Dropi** |
| Rescate global del carrier | **10,5%** — el más bajo entre los carriers grandes |
| El problema | `COORDINAR LA ENTREGA`: **118.988 novedades/mes · 15,1% de rescate · 84,7% devuelve** |

**El argumento:** una novedad que **se llama "coordinar"** y en la que 85 de cada 100 veces nadie coordina. En el mismo país, Veloces rescata **35,3%** en el motivo equivalente; en Ecuador, **60,7%** — con un formulario idéntico.

**Lo que lo agrava:** Envía tiene **el formulario más pobre de las cinco arquitecturas observadas** — cuatro casillas de texto libre vacías, sin catálogo, sin mapa, sin fecha. Y **es el mismo formulario para los cinco motivos más grandes**: el que atiende a quien rechazó el pedido es el mismo que atiende a quien tiene la dirección mal. `[obs 2026-08-25]`

Y la etiqueta `DESTINATARIO FIJA FECHA Y HORA DE RECIBO MAYOR AL DÍA SIGUIENTE` — **12.676/mes** — dice que el comprador ya fijó cuándo, y **no hay campo de fecha donde escribirlo.**

**El pedido:**
1. **API de reprogramación** (fecha + franja). Es lo que habilita el campo que hoy no existe en ninguna arquitectura.
2. **Motivo tipificado** en vez de texto libre.
3. **Tope de reintentos a ciegas** — el primer intento decide (72-99% vs 10-40% en el segundo). `[doc:tema 04]`

**La palanca:** 62,5% es concentración alta, pero hay **9 carriers más en Colombia** y es el mercado grande. Hay más margen que en México.

**Techo en juego:** +45.503 entregas/mes solo en `COORDINAR LA ENTREGA`.

---

## 4 · El acuerdo transversal — quién paga el retorno

**El hecho observado** (orden #80542212, Coordinadora): envío $21.189 · **tres visitas** · **55 días** · y **cero registro de qué se hizo en cada una.** La validación de dirección había respondido `Validación fallida` el día 0.

**El dato que lo sostiene:** el primer intento decide — **72-99% de las entregas ocurren ahí, contra 10-40% en el segundo.** `[doc:tema 04]` Los reintentos a ciegas casi no recuperan, pero sí consumen días y costo.

**La propuesta:** atar el cobro del flete de retorno a **evidencia de gestión** — intentos registrados, contacto documentado, motivo tipificado. Hoy la transportadora cobra el retorno igual haya intentado bien o no.

> ⚠️ `[HIPÓTESIS comercial · sin validar]` Depende enteramente del contrato vigente. Puede que ya esté cubierto o que sea irrenegociable. **Necesita que alguien de comercial mire el contrato antes de llevarlo a la mesa.**

---

## Resumen para priorizar

| Carrier | País | Techo/mes | Palanca | Tipo de conversación |
|---|---|---:|---|---|
| **Envía** | Colombia | **+45.503** | media (9 carriers más) | Producto + API |
| **Quality Post** | México | +12.708 | **ninguna (90,3%)** | **Interna: abrir 2º carrier** |
| **Servientrega** | Ecuador | +9.413 | **alta (Gintracom rescata 2×)** | Comercial pura |

## Changelog
- 2026-08-25 — Creado. Insumo para las conversaciones con transportadoras; no sustituye la revisión de contratos.
