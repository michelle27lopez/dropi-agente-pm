# 🧾 Deuda de datos — Darwin (`projects`)

> Lista viva de lo que está **inconsistente en la base**, no en el código. Todo lo de acá se
> verificó con consultas de solo lectura a Supabase el **4-ago-2026** — no hay nada inferido
> ni recordado. Prioridad: 🔴 alta · 🟡 media · 🟢 baja.
>
> Nació al alinear `/celula/logistica` con la estructura de las demás células. Varias de estas
> cosas se descubrieron porque la home dejó de esconderlas: agrupar por etapa tapaba los
> huecos que la rejilla común deja a la vista.
>
> **Ninguno de estos puntos se arregla desde este documento.** Cada uno necesita una decisión
> de su dueño antes de tocar nada.

---

## 🔴 1. Cinco fichas de logística usan el ticket de Jira como `project_code`

| En la base | Debería ser | Iniciativa |
|---|---|---|
| `PRM-91` | LOG-002 | Validación y normalización de direcciones |
| `PRM-1513` | LOG-004 | Selección inteligente de transportadoras |
| `PRM-1366` | LOG-005 | Same Day |
| `PRM-1297` | LOG-007 | Normalización de estados |
| `PRM-1512` | LOG-008 | Herramienta preventiva de novedades |

El cruce entre el tablero (`hub/src/app/proyectos/logistica/_lib/data.ts`) y Darwin es por
`project_code`. Con el código de Jira ahí, la ficha existe pero es invisible para el cruce, y
las cinco salían marcadas como "sin ficha en Darwin" aunque están desde el 21-jul.

Las guardas `where not exists (... where p.project_code = v.project_code)` de las migraciones
031 y 040 comparan por código: como `PRM-91 ≠ LOG-002`, ninguna de las dos las reconoció.

**Estado:** resuelto *en la UI* declarando `codigoDarwin` en el tablero — cero UPDATE a
`projects`. La base sigue con dos convenciones.

**Decisión pendiente (Juan):** ¿se normalizan los códigos o se deja declarado? Ojo antes de
normalizar: `project_code` **no tiene UNIQUE** y se usa como llave de texto sin FK en
`discovery_cycles.project_id`. Renombrar puede huerfanar filas — para estas cinco se verificó
que hoy no afecta a ninguna, pero la regla general es que renombrar códigos es peligroso.
Además sellers usa claves de Jira (`PROD-*`, `PRM-*`) como `project_code` **a propósito**:
`FALLBACK_CYCLES` en `hub/src/app/proyectos/[slug]/page.tsx` está indexado por ellas.

---

## 🔴 2. Esas mismas cinco están tipadas `Delivery Proyecto` y el tablero dice otra cosa

En Supabase las cinco tienen `type = 'Delivery Proyecto'`. En el tablero, ninguna está en
delivery: `LOG-002` y `LOG-005` están en Discovery, `LOG-004` y `LOG-007` en Definición,
`LOG-008` en Discovery. `PRM-1297` figura como "prioridad #1 del Delivery Roadmap" pero su
fase es Definición.

Las dos fuentes dicen cosas distintas sobre los mismos cinco proyectos. Desde que logística
usa la estructura común, salen bajo "Delivery Proyectos" — no se tapa, es el hallazgo.

**Decisión pendiente (Juan):** o se corrige el `type` en la base, o se corrige la fase en el
tablero. Lo que no puede quedar es una versión distinta en cada lado.

### Lo que sí se corrigió el 5-ago (migración `047`)

Tres proyectos iban al revés que estos cinco: estaban tipados `Proyecto` cuando ya habían
salido de discovery. En esos, las dos fuentes **sí coincidían** — solo faltaba el `type`:

| | Tablero | `handoff_status` | Ahora |
|---|---|---|---|
| `LOG-006` Tarifas | fase "Listo para handoff" | Listo para handoff | Delivery Proyecto |
| `LOG-014` Fulfillment | fase "Listo para handoff" | Listo para handoff | Delivery Proyecto |
| `LOG-009` Guías reemplazatorias | "ya no es discovery, está en lanzamiento" | **Handoff hecho** | Delivery Proyecto |

`LOG-009` era el único proyecto de toda la célula con el handoff hecho, y salía en Discovery.

**No se tocó `LOG-016` (POD)**, aunque se pidió con los otros: el tablero lo pone en fase
Discovery, su paraguas `PRM-1517` está en backlog **sin assignee** y dos de sus tickets en
Impedimentos. Tiparlo como Delivery declararía entregado un frente sin dueño. Sigue abierto.

---

## 🔴 3. No hay forma de corregir `type` desde la interfaz

El `PATCH` de `hub/src/app/api/proyectos/[slug]/route.ts` acepta `estado_interno`, `vpv`,
`parent_project_id`, `related_poc_id` y `related_delivery_id`. **No acepta `type`.**

O sea: el punto 2 no se puede arreglar desde Darwin. Hace falta SQL a mano en el editor de
Supabase, o extender el PATCH.

**Dueño:** quien tome el próximo PR de Darwin.

---

## 🟡 4. Catorce proyectos sin `type`

13 de suppliers y 1 de brands tienen `type = NULL`:

```
DAT-001  COM-001  FAC-001  SUP-001  OUS-001  DCA-000  SUP-002
CHIP-001 CAT-002  DCA-003  DCA-002  CHP-001  NOM-001   (suppliers)
BRA-005  (brands)
```

Caen en "Discovery projects" **por descarte**, no por decisión: el filtro es
`type !== 'POC' && type !== 'Delivery Proyecto' && type !== 'Following'`, y NULL pasa. Lo
mismo hace `estadosValidosPara()` en la API, que trata NULL como Discovery.

No está roto, pero significa que nadie eligió dónde va ese 16% del portafolio.

**Dueño:** Jaime (suppliers) y Kate (brands).

---

## 🟡 5. `status` tiene 9 valores y ningún enum efectivo

| Valor | Filas |
|---|---|
| `in_progress` | 44 |
| `Discovery` | 22 |
| `In Progress` | 10 |
| `Cerrado` | 3 |
| `Backlog` | 3 |
| `Activo` | 3 |
| `Blocked` | 2 |
| `Lanzamiento` | 1 |
| `Done` | 1 |

`in_progress` e `In Progress` son el mismo estado escrito de dos formas: la API escribe el
primero al crear un proyecto, y las migraciones de logística escriben el segundo. El único
CHECK versionado (`agente-delivery/schema/supabase_schema.sql`) ni siquiera permite
`in_progress`, así que en la base real ese constraint no existe.

Nadie lee `status` hoy para decidir nada en la UI — por eso la inconsistencia no se nota. El
día que alguien filtre por él, se va a notar de golpe.

---

## 🟡 6. La taxonomía está duplicada a mano en varios archivos

Los cuatro arrays de estados (`ESTADOS_DISCOVERY`, `ESTADOS_POC`, `ESTADOS_DELIVERY`,
`ESTADOS_FOLLOWING`) están escritos **literalmente dos veces**: en
`hub/src/components/ProjectCard.tsx` (el `<select>` que ofrece los valores) y en
`hub/src/app/api/proyectos/[slug]/route.ts` (la validación que los comprueba). Hay más copias
en `hub/src/app/proyectos/[slug]/page.tsx`.

Además `TYPE_ICON` está en 2 archivos, `HANDOFF_COLOR` en 3, y `TYPE_COLOR` en
`hub/src/app/celulas/page.tsx` **no tiene** `Delivery Proyecto` ni `Following` — así que esos
proyectos salen sin color en el directorio de células.

Si la UI y la API se desincronizan, el usuario elige un estado válido en pantalla y la API se
lo rechaza. Hoy coinciden por suerte, no por diseño.

**Arreglo:** un `hub/src/lib/proyecto-taxonomia.ts` del que importen todos. Se dejó **fuera**
del PR de la estructura de logística a propósito: esos mismos archivos se acaban de reescribir
para meter Following, y mezclarlo multiplicaba el riesgo del merge.

---

## 🟢 7. `celula_updates` con filas que nadie pinta

| Célula | Filas | La home las muestra |
|---|---|---|
| suppliers | 5 | sí (home raíz `/`) |
| sellers | 4 | no |
| backoffice | 4 | **no** |
| product-designers | 2 | **no** |
| brands | 1 | **no** |
| logistica | 0 | n/a — su weekly vive en el tablero |

La rama clara de `hub/src/app/celula/[slug]/page.tsx` solo renderiza "Updates" cuando
`isLogistica`. Las demás células tienen updates guardados que su propia home nunca ha
mostrado.

**Por qué no se arregló acá:** hacerlo les cambia la página a PM que no lo pidieron.

---

## ✅ 8. `LOG-017` existe en Darwin pero no en el tablero — RESUELTO 5-ago

`LOG-017` ("Parametrizar Tarifas", POC hijo de LOG-006) se creó desde la UI el 30-jul, no
estaba en `data.ts`, y por eso desaparecía al filtrar por etapa.

Se resolvió borrándolo: duplicaba a su propio padre (mismo panel de tarifas con simulador) y
sus tres prototipos RPP ya cuelgan de LOG-006. Migración `047`.

⚠️ El código `LOG-017` quedó reutilizado: ahora lo lleva el Following de LOG-009, que tomó el
siguiente número libre. Son dos proyectos distintos con el mismo código a lo largo del tiempo
— tenerlo presente al leer historial viejo.

---

## 🟢 9. `roadmap_items` está vacía y la API la devuelve igual

`GET /api/celulas/[slug]` devuelve `roadmap: []` en toda llamada. La tabla tiene 0 filas y
ninguna vista la consume. O se usa, o se quita del select.

---

## ✅ 10. Recolecciones en el hub y en Indiana — DECIDIDO 6-ago: son separados

Durante la auditoría se levantó como posible duplicación: el control de recolecciones vive en
`hub/src/app/proyectos/logistica/recolecciones` y también en el repo `inidiana-map`, y las dos
versiones ya habían divergido (987 líneas contra 1.271, y el naranja viejo `#F49A3D` que
Indiana ya corrigió).

**Decisión de Juan: son productos separados, no una duplicación a resolver.** Indiana es el
producto propio —así lo declara su README, "nace como módulo dentro de Darwin y se separa
aquí"— y la vista del hub se queda como lo que es: la del tablero de la célula.

El tablero ya lo refleja: LOG-013 enlaza Indiana primero y la del hub aparece como
*"Control de recolecciones (versión del hub)"*.

---

## 🟡 11. Los POC viven en Darwin y los experimentos en el tablero

`data.ts` modela 8 `experimentos` con estado (Idea · Diseñado · Corriendo · Validado ·
Descartado) y su vínculo al proyecto. Darwin modela `type = 'POC'` con `estado_interno` y
`vpv`. **Son las dos caras de lo mismo y nada las cruza.**

La migración `048` registró en Darwin los tres que tienen artefacto real, pero eso no une los
dos sistemas: si mañana un experimento pasa de Diseñado a Corriendo en el tablero, su POC en
Darwin no se entera.

Decidir cuál manda antes de que diverjan. Mismo patrón que ya pasó con recolecciones.

---

## Cómo reproducir estos números

Las consultas fueron `GET` a la API REST de Supabase con la service key del `.env` del repo,
sobre `projects`, `celulas`, `celula_updates` y `discovery_cycles`. Nada de esto requiere
escritura. Si algún número no cuadra al releerlo, la base cambió — vuelve a consultarla antes
de discutir el punto.
