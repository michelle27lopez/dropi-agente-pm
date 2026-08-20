# 📐 Medición de movilización y entrega — agenda de trabajo

> **Qué es:** el frente de medición que dictó Juan el **6-ago-2026**, cruzado contra lo que el
> cerebro ya tiene. La mitad no es nueva: son los **2 KPIs de la célula** que ya están
> definidos y medidos. Lo que sí es nuevo está marcado como tal.
>
> **Disciplina (ley spec-driven):** **[DATO]** = medido con fuente · **[SÍNTESIS]** = lectura
> propia · **[PROPUESTA·validar]** = falta validar con Maria / Dirección de Producto.
>
> **Por qué existe este archivo:** para no volver a levantar desde cero lo que ya está
> levantado, y para que lo genuinamente pendiente tenga dueño y no se pierda en un chat.

---

## 1 · Lo que YA está definido — no reabrirlo

Las dos "métricas generales" que planteaste **son los 2 KPIs oficiales de la célula**, y ya
están definidos y con baseline en
[primera-medicion-kpis-y-meta.md](primera-medicion-kpis-y-meta.md):

| Tu enunciado | KPI oficial | Estado |
|---|---|---|
| "Entrega a la transportadora en 24 horas" | **KPI 2 · % de órdenes que llegan a la transportadora en < 24h** | Definido. Se mide como **tasa** (% bajo el umbral), **no** promedio ni mediana |
| "% de entrega" | **KPI 1 · Tasa de entrega exitosa = Entregadas / CREADAS** | Definido. Meta **≥ 70%** (OKR2 · KR2.1) |

**[DATO] Y hay un hallazgo que conviene tener presente antes de seguir midiendo:** medido
bien —sobre **creadas**, no sobre movilizadas— el KPI 1 está en **~59% consolidado y CO ~62%**,
o sea **8 a 11 puntos POR DEBAJO** de la meta. El "72–75%" que se venía citando es sobre
movilizadas, otro corte, y esconde la fuga de no-movilización.

### Tus submétricas ya tienen enabler

"Tiempo de confirmación · tiempo de recolección · tiempo de entregado a transportadora" es
exactamente el **KPI de tiempo por fases**, y su habilitador es **LOG-011 · Torre de control /
Tiempo por fases** — que hoy está en Discovery, **sin ticket de Jira**, y descrito como
*"enabler transversal: habilita el KPI de tiempo y a Normalización de estados. Hoy vive como
medición, no como producto construido."*

**[SÍNTESIS] No hace falta definir las submétricas: hace falta que LOG-011 tenga dueño y
ticket.** Sin él, cada corte por fase se calcula a mano cada vez.

### Y la conceptualización que pides también existe

| Lo que pediste | Dónde está |
|---|---|
| "Conceptualización de producto logística" | [tema 06 · Logística como producto, modelo de 4 capas](../conocimiento/temas/06-logistica-como-producto-4capas.md) |
| "Portafolio de productos logísticos y cómo se relacionan" | [tema 02 · Cadena de valor y portafolio](../conocimiento/temas/02-cadena-de-valor-y-portafolio.md) + [tema 14 · Portfolio Dropi: cobertura, monetización y fugas](../conocimiento/temas/14-portfolio-dropi-cobertura-monetizacion-fugas.md) |
| "Entender el ecosistema para verlo bien" | [tema 01 · Ecosistema y actores](../conocimiento/temas/01-ecosistema-y-actores.md) |
| Contra entrega (COD) | **LOG-010 · Reducir devoluciones (COD)** |
| Fulfillment | **LOG-014 · Parametrización de fulfillment** |

---

## 2 · Lo que SÍ es nuevo — cuatro frentes

### 2.1 · Desglose de novedades 🆕

El KPI 1 mide el resultado, no el mecanismo. Falta abrir la novedad como embudo propio:

- % de órdenes que **entran** a novedad
- de esas, % que se **solucionan**
- % de órdenes en novedad que **terminan entregadas**

**[SÍNTESIS]** Es la diferencia entre saber que se pierde y saber **dónde se recupera**. Hoy
sabemos que la fuga 2 es ~26% de devolución, pero no cuánta de esa devolución pasó antes por
una novedad que se pudo haber salvado.

Se conecta directo con **LOG-008 · Herramienta preventiva de novedades (dueño y triaje)**, que
hoy está *"En Ruta (backlog), SIN ASIGNAR"*.

**Pendiente:** definir la fuente. `03-modelo-datos-y-estados` tiene el modelo de estados, pero
hay que confirmar si el paso a novedad y su desenlace son trazables sin normalizar estados
primero (LOG-007).

### 2.2 · Cortar los KPIs por ciudad, zona y cohorte 🆕

Hoy los KPIs se leen por país. Tu planteo es cortarlos más fino y **usar la geografía como
estrategia de expansión**, no solo como reporte:

> *"Va a ser difícil llegar a todo el país. Pero si vemos que en Bogotá disminuye, toca ver
> cómo lo expandimos, a ver cómo se ha movido."*

**[PROPUESTA·validar]** El corte mínimo para que esto sirva: **transportadora × ciudad**, sobre
los dos KPIs, con serie de tiempo. Sin la dimensión transportadora no se puede decidir nada —
la diferencia entre carriers en la misma zona ya está medida en **20 a 27 puntos de devolución**
(ver LOG-004).

Hay antecedente parcial en [tema 18 · Métricas de operación](../conocimiento/temas/18-metricas-operacion-2026-04-05.md).

**Pendiente:** decidir qué es una "zona". Ciudad, territorio DANE, o zona de la transportadora
—que no coinciden entre sí—. `LOG-013` ya usa territorio DANE para el mapa de recolecciones y
`LOG-020` usa cruce contra OpenStreetMap: elegir una y que sea la misma en todo.

### 2.3 · Reglas comerciales de las transportadoras 🆕

Nada de esto está levantado hoy:

- ¿A partir de **cuántas órdenes** una transportadora habilita pago contra entrega?
- ¿Qué **contratos mínimos de envíos** exige cada una?

**[SÍNTESIS]** Esto no es una métrica, es **una restricción del modelo de negocio**. Si el COD
—que es *el* valor de Dropi— depende de un volumen mínimo por transportadora, entonces la
elección de carrier no es solo calidad de entrega: es acceso al COD. Cambia el marco de LOG-004.

### 2.4 · Benchmarking y entrevistas de logística para ecommerce 🆕

> *"Entrevistas logística para ecommerce: qué enseñan o hacen ellos y cómo funciona Dropi."*

Mirar hacia afuera para entender qué es estándar en logística de ecommerce y en qué Dropi es
distinto — a propósito o por omisión.

**Pendiente:** definir a quién se entrevista. Operadores logísticos, otros ecommerce, o los
propios dropshippers que ya usan otras plataformas.

---

## 3 · Cómo se trabaja

**El tablero es el destino, no el punto de partida.** El orden que evita construir sobre arena:

1. **LOG-011 primero.** Sin el tiempo por fases con dueño, las submétricas del KPI 2 se
   calculan a mano cada vez. Hoy no tiene ticket.
2. **LOG-007 (normalización de estados) condiciona 2.1.** Con 35 de 51 estados guardados como
   lo mismo, el embudo de novedades no es trazable. Ya es prioridad #1 del Delivery Roadmap.
3. **Elegir la definición de zona antes de cortar nada** (2.2).
4. **2.3 y 2.4 son investigación, no medición** — corren en paralelo y no dependen de data.

---

## 4 · Preguntas abiertas

- ¿La meta del KPI 2 (<24h) es sobre creadas o sobre confirmadas? El KPI 1 ya tuvo esa
  confusión y cambió el mensaje por completo.
- ¿"Novedad solucionada" significa entregada, o basta con que salga del estado de novedad?
- ¿El corte por zona es para decidir dónde invertir, o para reportar avance? No es lo mismo:
  lo primero necesita potencial, lo segundo solo histórico.

---

*Dictado por Juan el 6-ago-2026. Cruzado contra el cerebro el mismo día — la mitad ya existía.*
