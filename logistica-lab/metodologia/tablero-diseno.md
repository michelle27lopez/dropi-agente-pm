# Dirección de diseño del tablero — Logistic Success

> Ley de diseño del tablero (`hub/src/app/proyectos/logistica/`). Hereda de `DESIGN.md`
> en la raíz del repo y lo aterriza a este tablero. Cuando este documento y el código
> no coincidan, **manda este documento** y el código se corrige.
>
> Alcance: **solo logística**. Nada de lo que está aquí aplica a Marcas, Backoffice, Gali
> ni al hub global — esos son otros sistemas y se dejan intactos a propósito.
>
> Creado 10-ago-2026 · a raíz de la revisión de información y jerarquía del tablero.

---

## 0 · Por qué existe este documento

El tablero tenía todo el contenido correcto y no se entendía. Medido sobre el código, no sobre impresiones:

| Síntoma | Causa medida |
|---|---|
| Todo pesa igual | `tablero.css` declaraba **30 tamaños de fuente** y **17 radios**. `DESIGN.md` manda 5 y 4. La variación se gastó en estilo, no en jerarquía. |
| Muros de texto | La prosa vivía en el modelo de datos: `foco` de Vigía = **790 caracteres** dentro de una card. Un solo `line-clamp` en todo el tablero. |
| Componentes inconsistentes | **14 definiciones de card**, **8 barras de progreso**, **5 stat tiles**, **4 vocabularios de píldora**, **0 tablas**. Cada pantalla inventó su vocabulario. |
| No hay jerarquía | `/mapa`, `/experimentos` y `/pendientes` no tenían `<h1>`: abrían con un `<div className="eyebrow">`. |
| **El objetivo no estaba en la UI** | `estrategia/arbol-okr-objetivo.md` dice que la columna vertebral es `No-entrega = No-moviliza + Devuelve`, y ninguna iniciativa declaraba qué fuga ataca. |

La conclusión que ordena todo lo demás: **el tablero no es un dashboard operativo, es un tablero de decisión.** No se consulta todo el día para operar; se lee para argumentar y decidir. Eso cambia qué se optimiza: no densidad de widgets, sino que el argumento se siga.

---

## 1 · La estructura: el árbol del objetivo

La navegación estaba organizada por *tipo de artefacto* (Indicadores, Iniciativas, Experimentos, Cronograma). Debe estar organizada por el **objetivo**, que ya estaba escrito en `estrategia/arbol-okr-objetivo.md` y nunca llegó a la pantalla:

```
KR2.1 · Tasa de entrega ≥ 70%              ← el único número que manda
        hoy 62,5% · brecha 8–11 pts

   ├── Fuga 1 · NO MOVILIZA   ~21,4%   (788K órd/mes)
   │       palancas · experimentos corriendo
   │
   └── Fuga 2 · DEVUELVE      ~26%     (823K órd/mes)
           palancas · experimentos corriendo

   Habilitadores (miden, no mueven)     Fuera del centro (KR1.1 · KR3.1)
```

### Regla del árbol
**Toda iniciativa y todo experimento declara qué ataca.** Campo `ataca` en `_lib/data.ts`:

| Valor | Significado |
|---|---|
| `Fuga 1` | Mueve la no-movilización (~21,4%). |
| `Fuga 2` | Mueve la devolución (~26%). |
| `Habilitador` | Instrumenta o mide. **No mueve el KR solo** — el árbol OKR es explícito en esto. |
| `Fuera del centro` | Trabajo real que cuelga de KR1.1 (volumen) o KR3.1 (margen), no de KR2.1. |
| `Sin declarar` | Todavía no se decidió. **Es un hallazgo, no un default cómodo**: se muestra en la UI como pregunta abierta al Cell Board. |

Una iniciativa marcada `Sin declarar` durante dos semanas seguidas es una conversación pendiente, no un problema de tablero.

### Regla de las tres audiencias
El tablero lo leen tres públicos y **no se les sirve con la misma densidad**. Se separan por rol de página:

| Capa | Páginas | Densidad | Para quién |
|---|---|---|---|
| **Narrativa** | Home, ficha de fuga | Baja. Un número grande, aire, un argumento por bloque. | Liderazgo (CPO/CEO) y Cell Board semanal |
| **Densa** | Iniciativas, Experimentos, Pendientes | Alta. Tabla, escaneable, comparable. | La célula, día a día |
| **Handoff** | Ficha de proyecto, Info logística | Estructura fija y completa. | Quien recibe el proyecto (TI, diseño, data) |

Si una pantalla intenta servir a las tres a la vez, gana el ruido. Esa era la home.

### Navegación por pregunta
El sidebar se ordena por la pregunta que responde cada pantalla, no por el objeto que contiene:

| Pregunta | Pantalla |
|---|---|
| ¿Vamos bien? | Indicadores (home) |
| ¿Dónde se rompe? | Mapa de la orden |
| ¿Qué estamos empujando? | Iniciativas |
| ¿Qué estamos probando? | Experimentos |
| ¿Qué pasó esta semana? | Updates |
| Referencia | Info logística · Cronograma · Pendientes |

---

## 2 · Reglas de texto

**Regla base: en una lista o una card, nadie lee más de dos líneas.** Lo que pase de ahí va a la ficha, a un `Disclosure`, o al `spec.md` del proyecto — que es donde alguien lo busca cuando de verdad lo necesita.

### Presupuestos

| Campo | Presupuesto | Formato obligado |
|---|---|---|
| `descripcion` | ≤ 90 car. | Qué hace, voz activa. Sin siglas sin traducir. |
| `queEs` | ≤ 90 car. | Qué es, en una frase. Reemplaza la apertura de `foco`. |
| `porQue` | ≤ 120 car. | Por qué importa, atado a la fuga que ataca. |
| `proximoPaso` | ≤ 80 car. | La siguiente acción concreta, con dueño si aplica. |
| `owner` | ≤ 30 car. | Nombre. Vacío = hallazgo, no se rellena con "por definir". |
| `bloqueo` | ≤ 100 car. | **Una sola** causa + quién la destraba. |
| `hipotesis` | ≤ 140 car. | `Si [acción], entonces [resultado medible], porque [evidencia].` |
| `aprendizaje` | ≤ 140 car. | Qué aprendimos + qué decide. |
| `lectura` (KPI) | ≤ 120 car. | Una frase. Las advertencias van como badge, no como prosa. |

El campo `foco` **se elimina**: era un cajón donde cabía todo y por eso llegó a 790 caracteres. Se parte en `owner` / `queEs` / `porQue` / `proximoPaso`, que además son las columnas de la tabla de iniciativas — un campo que no alimenta una vista concreta no debería existir.

### Ejemplo — Vigía

Antes (790 caracteres, un solo bloque dentro de una card):

> "Dueño: Michel Pino. Diseño en curso, sin desarrollo técnico (confirmado 22-jul). Es la única iniciativa transversal a toda la cadena de valor: monitorea desde Confirmación (POR CONFIRMAR 12h, PENDIENTE 24h) hasta Novedad (24h), pasando por Despacho (GUÍA GENERADA 48h, RECOGIDO 24h) y Tránsito (EN TRÁNSITO 72h). Cruza directamente las fugas 2 (devolución ~26%) y 3 (novedad) porque su valor es anticipar el problema, no reaccionar después. Para el Dropshipper: SLA por orden, WhatsApp directo al proveedor…"

Después:

```ts
owner:       "Michel Pino"
queEs:       "Avisa que una orden se va a caer antes de que se caiga."
porQue:      "Ataca la fuga 2 anticipando en vez de reaccionar. Es la única iniciativa que cruza toda la cadena."
proximoPaso: "Cerrar diseño y conseguir dev — hoy no tiene."
ataca:       "Fuga 2"
```

Los SLA por estado (12h / 24h / 48h / 72h) no son prosa: **son una tabla de 4 filas** en la ficha. Lo que ve el Dropshipper vs. el Proveedor son dos listas de 3 bullets. El stack técnico se queda en `logistica-lab/proyectos/vigia/`.

### Ejemplo — el KPI de tiempo

Antes: *"Se mide por FASES (desde creación), como TASA de cumplimiento < 24h — no la mediana. Dropi cumple 82–99%; el cuello es el carrier (primer ofrecimiento 32%, entrega final 21%). ⚠️ Falta el número único creación→handoff (pendiente de Data)."*

Después, partido en tres sitios distintos según quién lo necesita:
- `lectura`: "Dropi cumple 82–99%. El cuello es el carrier: 32% en primer ofrecimiento."
- La advertencia → badge `Dato incompleto` con tooltip. Un warning en prosa se lee como relleno; como badge se lee como estado.
- El "se mide por fases, no mediana" → nota metodológica en Info logística, que es donde alguien va a buscarla.

### Reglas de redacción
- **Números con su denominador.** "26%" solo no dice nada; "~26% de las movilizadas (823K/mes)" sí.
- **Sin siglas sin traducir** en capa narrativa. POD, RPP, PAU y E2E viven en la capa handoff.
- **Nada de "por definir", "TBD", "pendiente".** Un campo vacío se renderiza `—` y eso *es* la información.
- **El título dice la conclusión, no el tema.** "Autoconfirmación se entiende, pero no deja claro el impacto económico" > "Resultados de la prueba de autoconfirmación".

---

## 3 · Qué va en tabla

**Una tabla sirve para comparar N cosas sobre los mismos ejes. Su superpoder es que una celda vacía es un hallazgo.**

Los experimentos eran cards con 5 bloques de prosa cada una: imposible compararlos, imposible ver qué falta. Las iniciativas ya eran filas densas (bien resuelto), pero las columnas no respondían ninguna pregunta.

### Iniciativas — *"¿qué empujamos y qué está atascado?"*

| Iniciativa | Ataca | Fase | Handoff | Owner | Qué lo detiene | Próximo paso |
|---|---|---|---|---|---|---|
| Autoconfirmación `LOG-001` | Fuga 1 | Research | Pendiente | Juan | — | Corregir T4 y cerrar gate ChateaPro |
| Selección de transportadoras `LOG-004` | Fuga 2 | Definición | Pendiente | Juan | Sin acceso a Chronos | Juan Felipe coordina accesos |
| Normalización de estados `LOG-007` | Habilitador | Definición | Pendiente | — | — | — |

Las tres celdas vacías de la última fila **son el hallazgo**. Antes eso estaba invisible dentro de un párrafo de 300 caracteres.

### Experimentos — *"¿qué probamos y qué decide?"*

| Experimento | Ataca | Hipótesis | Métrica | Estado | Resultado | Qué decide |
|---|---|---|---|---|---|---|

Regla dura: **si la columna *Qué decide* no se puede llenar, el experimento no está diseñado.** La tabla lo hace evidente en un vistazo; la card lo escondía.

### Fugas por dimensión — en la ficha de cada fuga
El árbol OKR dice que las dimensiones que cortan las fugas son país, zona × carrier, seller y producto. Eso es literalmente una tabla y hoy es prosa.

### Lo que NO va en tabla
- **Los 3 indicadores**: son tres números grandes. Una tabla los apagaría.
- **El mapa de la orden**: es una secuencia, no una comparación.
- **El insight de la semana**: es un argumento, y un argumento no se tabula.

---

## 4 · El sistema visual

### Lo que se aplica (ya estaba en `DESIGN.md`, nadie lo cumplía)

| Regla | Valor |
|---|---|
| Tamaños de fuente | **5**: 32 / 22 / 16 / 13 / 11 px. Antes: 30. ✅ Cumplido: cero px sueltos, todo por token. |
| Radios | **4**: 8 / 12 / 20 / 999 px. Antes: 17. ✅ Cumplido. |
| Acento | **1**: naranja `#F77F00`, un solo elemento por vista. |
| Color con significado | **4**: verde / ámbar / rojo / azul. Nada de morado, índigo ni cian. |
| Elevación | **Plana en reposo.** Sombra solo en `:hover` / `:focus-visible` y solo si el elemento es accionable. |
| Ancho de texto | **≤ 70ch** en cualquier bloque de prosa. |

**El color no es un dato.** Los hex de etapa que vivían en `_lib/data.ts` (`#6366f1` índigo, `#a855f7` morado) salen del modelo de datos: hacían imposible cambiar el tema sin editar el dataset, y dos de ellos violaban la regla de los cuatro estados.

### Primitivos
Seis componentes en `_components/ui/` reemplazan las 14 + 8 + 5 + 4 variantes previas. **Regla: ninguna pantalla nueva define su propia card, píldora o barra.** Si un primitivo no alcanza, se extiende el primitivo — no se inventa una clase local.

| Primitivo | Reemplaza |
|---|---|
| `Card` | `.kpi .leak .navcard .exp .info-panel .wk-ind-card .cr-kpi` … |
| `Pill` | `.pill`, `.estado.e-*`, `.wk-estado.est-*`, `.pri.p-*` |
| `Table` | `InfoTable` local, tablas inline de Vigía, `.rec-tabla` |
| `Stat` | `.stat-box .mini-stat .info-kpi-card .reg-hueco .rec-kpi` |
| `Bar` | las 8 barras de progreso |
| `Disclosure` | los 3 `<details>` estilizados distinto |

Más `PageHeader`, que fuerza un `<h1>` real en cada pantalla.

### Lo que se conserva porque ya estaba bien
- `ds-tokens.generated.css` — tokens del Design System real, sincronizados desde Figma. **No se editan a mano.**
- La rampa `--tint-* / --edge-* / --on-*` de `registro.css`: resuelve contraste de texto sobre fondo teñido a 11px, que es un problema real.
- El bloque `.ne-*` de normalización de estados: el único sitio donde el sistema estaba bien aplicado. Sirve de patrón de referencia.
- El patrón `.ini-list` de filas con hairline por `gap` sobre fondo de borde: densidad correcta para 16 filas.

---

## 5 · Referencias

### Lo que NO sirve de referencia
Los dashboards de Dribbble y Pinterest con glassmorphism, gradientes y widgets de relleno son **dashboards operativos**: muchos indicadores pequeños, datos en vivo, decoración. Este tablero es otro género. Copiar esa retícula suma cajas y resta argumento. Además el glassmorphism, los gradientes decorativos y los kickers en mayúscula están prohibidos por nombre en `DESIGN.md` — es el "look genérico de IA" que el proyecto rechaza explícitamente.

Lo que **sí** vale de ese material: un solo número grande por tile (nunca dos compitiendo), la separación clara entre bloque héroe y retícula de apoyo, y el color reducido a estado.

### Referentes del género correcto
- **Linear · Project updates / Insights** — el estándar de "estado de un proyecto en una línea": una sola pill, cero párrafos.
- **Stripe Dashboard** — la mejor jerarquía numérica en producción: número grande, delta, una línea de contexto, nada más.
- **Basecamp · Hill Charts** — comunicar "en qué punto va" sin porcentajes falsos.
- **Amplitude / Mixpanel · Notebooks** — cómo se ve un análisis que argumenta en vez de mostrar.
- **Edward Tufte · small multiples** — comparar dimensiones (país, zona, carrier) sin inventar seis colores.
- **Financial Times / Reuters Graphics** — jerarquía tipográfica con datos densos y sin decoración.

### Si aun así se barre Pinterest
Términos que devuelven este género (en inglés, que es donde está el material):
`internal tool dashboard minimal` · `data table UI dense` · `analytics report layout typography` · `okr tree visualization` · `weekly business review deck` · `status board minimal ui` · `editorial data layout` · `product metrics one pager`

Filtro: si tiene gradiente, cristal o números inventados de relleno, no sirve.

---

## 6 · La escalera: de lo general a lo particular

El tablero tiene **tres niveles y ninguna pantalla hace el trabajo de otra**. Es la regla que evita que cada pantalla intente "tenerlo todo" — que es exactamente como llegó a no entenderse.

| Nivel | Pantalla | La pregunta | Qué muestra | Qué NO muestra |
|---|---|---|---|---|
| **1 · General** | Indicadores (home) | ¿Vamos bien? | El número que manda, la brecha, las 2 fugas, el insight de la semana. | Nada de proyectos individuales. |
| **2 · Intermedio** | Mapa de la orden | ¿Dónde se rompe y quién lo ataca? | Las 6 etapas, la salud de cada una, y qué iniciativas cuelgan de cada una. | Links, tickets, hipótesis, prosa. |
| **3 · Particular** | Ficha del proyecto | ¿Qué es esto y en qué va? | Todo: spec, links, experimentos, gates, bloqueo, trazabilidad. | — |

**Regla de la escalera:** si un dato se puede ver un nivel más abajo, no sube. La tentación de "que se vea todo aquí" es la que produjo el tablero que no se entendía.

---

## 7 · Mapa de la orden — spec funcional

Nivel 2 de la escalera. Diagrama de carriles: 6 etapas fijas, iniciativas como nodos. **No es un editor**: nada se arrastra, no hay canvas libre ni zoom.

### El nodo
Lleva **cinco cosas y ninguna más**:

1. Nombre de la iniciativa (2 líneas máx., el resto trunca con `title`)
2. Código `LOG-XXX`
3. **A qué fuga ataca** — chip. Es el dato que conecta con el objetivo y hoy no se ve sin hacer clic.
4. Fase — píldora
5. **Punto de salud** — el único color fuerte del nodo

**El color del nodo es salud, no fase.** En el mockup las 12 píldoras de "Discovery / Research / Definición / Diseño" son todas azules, así que el color no informa nada y los nodos se ven idénticos. La fase no es un estado de salud: un proyecto puede llevar 4 meses en Discovery y estar perfecto, u otro estar en Diseño y llevar 3 semanas bloqueado.

| Punto | Significa |
|---|---|
| 🔴 Rojo | Bloqueado — hay un `bloqueo` declarado |
| 🟡 Ámbar | Sin owner, o sin próximo paso |
| 🟢 Verde | Avanzando: tiene owner, tiene próximo paso, sin bloqueo |
| ⚪ Gris | Parqueado a propósito (ej. Same Day por WIP=1) |

Con eso, la pregunta del Cell Board — *"¿qué está atascado?"* — se responde escaneando, sin leer.

### La cabecera de etapa
Nombre + número + etiqueta de fuga (cuando la hay) + **conteo**: `4 iniciativas · 1 bloqueada`. El conteo es lo que hace la etapa comparable con las otras de un vistazo.

### Las líneas
**Solo para iniciativas transversales, y solo en hover/foco.** En reposo no hay ninguna línea.

En el mockup las líneas conectan tarjetas contiguas en orden de lectura, insinuando dependencias que no existen (LOG-004 no alimenta a LOG-001). Una línea que no representa una relación real es peor que ninguna línea: se lee como información y es ruido. Al pasar el mouse sobre un nodo transversal (hoy solo Vigía), se resaltan sus otras apariciones y se dibuja la línea que las une.

### Priorización
Se expresa por **orden dentro del carril** (lo prioritario arriba) y un marcador para el WIP activo. **No se inventa un ranking numérico**: hoy el único dato real de prioridad es `destacado` y el WIP=1 de Normalización de estados. Un ranking inventado se lee como verdad.

### Botones y navegación
- **Todo el nodo es clicable** → va a la ficha del proyecto (nivel 3). Un solo destino, sin ambigüedad.
- **Los links (Jira, Figma, prototipo) NO van en el nodo.** 4 iconos × 16 nodos = 64 elementos clicables compitiendo con el que importa. Viven en la ficha.
- **Filtros arriba**, que es lo que de verdad reemplaza densidad: `Fuga 1 · Fuga 2 · Bloqueadas · Sin owner · Todo`. Un filtro elimina 50 datos de pantalla sin perder ninguno.

### Tooltips
Regla: **el tooltip amplía, nunca es la única fuente.** No funciona en móvil ni en proyector, así que nada crítico vive solo ahí.

| Dónde | Qué dice |
|---|---|
| Etiqueta de fuga en la cabecera | El número con su denominador: "~26% de las movilizadas · 823K/mes" |
| Punto de salud | Por qué está en ese color: "Bloqueado: sin acceso a Chronos" |
| Nombre truncado | El nombre completo |
| Chip de fuga en el nodo | Qué es esa fuga, en una frase |

### Detalle
Al hacer clic se abre la ficha. **No un panel al pie del diagrama**: en el mockup, hacer clic en un nodo del carril 4 obliga a bajar la vista hasta el fondo de la pantalla y perder de vista el nodo. Si en algún momento hace falta previsualizar sin salir, va como panel lateral derecho a la altura del nodo, nunca abajo.

---

## 8 · Vocabulario controlado

Auditado el 10-ago sobre las pantallas ya migradas: **el mismo concepto se decía de hasta ocho maneras distintas**. Es el mismo fallo que el CSS con 30 tamaños de fuente, pero en las palabras — y más caro, porque el lector cree que son cosas diferentes.

**Regla: un concepto, un término.** Si hace falta un matiz nuevo, se añade aquí; no se improvisa en la pantalla.

| Concepto | Término | Sustituye a |
|---|---|---|
| A qué objetivo contribuye | **Aporta a** | "Ataca", "Para qué sirve", "Atacan la fuga N" |
| Persona responsable | **Responsable** | "Quién lo lleva", "dueño", "Sin dueño" |
| Lo que impide avanzar | **Bloqueo** | "Qué lo detiene", "Qué falta para que avance" |
| La siguiente acción | **Próximo paso** | — |
| Columna que fusiona las dos anteriores | **Bloqueo o próximo paso** | "Qué falta para que avance" |
| Falta una decisión que ya debería estar tomada | **Sin definir** | "Sin declarar", "Sin estimar", "Sin línea base" |
| Falta un dato que legítimamente aún no existe | **Pendiente de medición** | — |
| Etapa sin trabajo asociado | **Sin iniciativas asignadas** | "Nadie la está atacando" |

### La distinción que más importa
**`Sin definir` ≠ `Pendiente de medición`.** La primera es deuda —alguien tenía que decidirlo y no lo hizo— y va en **ámbar**. La segunda es el estado *correcto* de un experimento que aún corre, y va en **gris**. Confundirlas hace que el tablero grite por cosas que están bien, y cuando todo grita nadie distingue lo que pide acción.

### Estados de salud — tres, un nombre cada uno

| Punto | Término | Definición (va en el tooltip, no en la etiqueta) |
|---|---|---|
| 🔴 | **Bloqueado** | Hay un bloqueo declarado |
| 🟡 | **Información incompleta** | Falta responsable o falta próximo paso |
| 🟢 | **En avance** | Tiene responsable y próximo paso, sin bloqueo |

### Registro gerencial: la jerga no sube al nivel 1 ni al 2

El tablero lo lee dirección. Una sigla sin traducir obliga a preguntar, y quien lee un tablero no pregunta: se salta la línea. **La jerga vive en la capa de handoff** —el campo `foco`, el estado literal de Jira, los `spec.md`— y no en `descripcion`, `porQue`, `proximoPaso`, `bloqueo`, `hipotesis`, `metrica`, `decide`, `impacto`, `aprendizaje` ni `lectura`.

| Jerga | En el tablero se escribe |
|---|---|
| SHOP | las integraciones |
| RPP | prototipo |
| POC | prueba de concepto |
| E2E / doc E2E | documento funcional |
| COD | pago contra entrega |
| 2PL | bodegas de terceros |
| carrier | transportadora |
| SLA | plazo · fuera de plazo |
| WIP = 1 | se trabaja un frente a la vez |
| baseline | línea base |
| outcome | impacto real |
| owner | responsable |
| slot de desarrollo | cupo de desarrollo |
| gate | requisito · condición |
| T4 | la tarea de comprensión económica |
| handoff | entrega a desarrollo (el estado del eje sí se llama Handoff) |

**Números en formato de lectura:** `317K` → **317.000**; `~26%` → **26%**; `Δ 20–27 pp` → **entre 20 y 27 puntos**; `3.4M` → **3,4 millones**. La notación compacta es de análisis, no de presentación.

**El detalle técnico se elimina, no se traduce.** "Interceptor fetch/XHR en MAIN world", "Manifest V3", "polling 2s" y los umbrales por estado no tienen versión gerencial: pertenecen al `spec.md` del proyecto. Traducirlos solo alargaría la frase sin hacerla útil.

**Excepción: las actas fechadas.** Los `weeklies` registran lo que se dijo un día concreto. No se reescriben —eso sería falsear un registro—, aunque contengan jerga.

### Las fugas se llaman por su nombre, no por su número

`Fuga 1` y `Fuga 2` obligaban a conocer el árbol OKR para decodificarlas — el mismo problema que una sigla, en el eje más importante del tablero.

| Antes | Ahora |
|---|---|
| `Fuga 1` | **Movilización** |
| `Fuga 2` | **Devolución** |

**Por qué "Devolución" y no "Entrega":** la tasa de entrega **es el KR**, el objetivo que las dos fugas afectan. Nombrar "Entrega" a una de sus causas la haría colisionar con el North Star.

**El beneficio que cierra el círculo:** el campo `impactoEsperado.indicador` de los experimentos ya usaba literalmente esas dos palabras. Ahora el indicador que mueve un experimento y la fuga de la que cuelga su proyecto **son la misma palabra** — se acabó la traducción mental entre pantallas.

La palabra *fuga* se conserva en prosa ("las 2 fugas que cierran la brecha"): es lenguaje del árbol OKR y es correcta. Lo que desaparece es el número como etiqueta.

### Decisiones de copy, con su porqué
- **"Aporta a" en vez de "Ataca".** El árbol OKR dice "cuelga de" y "alimenta"; "ataca" fue una acuñación posterior y como cabecera de columna suena beligerante en un tablero que lee dirección.
- **"Línea base" en vez de "en juego" o "tamaño".** Término estándar de experimentación, y ya aparece literal en los datos ("Baseline: 317K órdenes >24h"). Completa la tríada **línea base → objetivo → resultado**.
- **"Experimentos" en vez de "apuestas".** Algo que tiene línea base, indicador y métrica no se presenta a dirección como una apuesta.
- **El nombre del campo en código sigue al término de pantalla.** Cuando "ataca" pasó a "Aporta a", el campo `ataca` pasó a `aportaA`. Si divergen, el siguiente que lea el código escribirá la palabra vieja en una pantalla nueva.

---

## 9 · Checklist antes de dar una pantalla por terminada

- [ ] Tiene un `<h1>` real, no un eyebrow haciendo de título.
- [ ] Se ve de qué fuga u objetivo cuelga lo que muestra.
- [ ] Ningún texto de lista o card pasa de dos líneas.
- [ ] Ningún campo supera su presupuesto de caracteres.
- [ ] Usa los primitivos. No define cards, píldoras ni barras propias.
- [ ] Solo tamaños de 32/22/16/13/11 y radios de 8/12/20/999.
- [ ] Un solo elemento naranja.
- [ ] Nada tiene sombra en reposo.
- [ ] Los campos vacíos se ven como `—` y se leen como hallazgo, no como error.
- [ ] Alguien de fuera de la célula entiende en 30 segundos cuál es la meta, cuánto falta y qué está atascado.
