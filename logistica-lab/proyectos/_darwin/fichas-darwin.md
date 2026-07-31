# 🧬 Cargar el roadmap de logística en Darwin — qué acepta una ficha y qué falta

> **Qué es esto.** Darwin (`darwin-qd7c.vercel.app`) es el Product Lab interno. Vive en el repo
> [`jaimeguevara-dropi/dropi-agente-pm`](https://github.com/jaimeguevara-dropi/dropi-agente-pm),
> carpeta `hub/` (Next.js + Supabase). La pantalla `/celula/logistica` no inventa nada: cruza
> **dos fuentes** y muestra el hueco entre ellas.
> **Estado (29-jul, tarde):** el SQL **ya se corrió en Supabase** (dicho por Juan; no verificado
> desde aquí, sin credenciales). ⚠️ Por confirmar si corrieron los dos bloques o solo el refresco de
> las 11. Lo que sigue pendiente está en la sección 6. Revisado contra el código el 2026-07-29.

## 1. Cómo está armado (lo que leí en el código)

La torre de `/celula/logistica` cruza por la llave `LOG-XXX` ([`_lib/logistica-torre.ts`](https://github.com/jaimeguevara-dropi/dropi-agente-pm/blob/main/hub/src/app/celula/%5Bslug%5D/_lib/logistica-torre.ts)):

| Fuente | Dónde vive | Qué aporta |
|---|---|---|
| **La ficha** | tabla `projects` en Supabase | lo que Darwin sabe: `summary`, `estado_interno` editable, `vpv`, permisos |
| **El tablero** | `hub/src/app/proyectos/logistica/_lib/data.ts` | las 16 iniciativas con etapa de la cadena, tipo, fase, handoff, bloqueo, links, doc |

Si una iniciativa del tablero no tiene `codigo`, la torre **no la esconde**: la muestra como chip
gris *"También en esta etapa · sin ficha en Darwin"*. Ese hueco es el hallazgo, y está puesto a
propósito.

### Los campos que acepta una ficha (`projects`)

Del esquema real (`016_darwin_core.sql`, `036_discovery_poc_estados.sql`) y del componente
`ProjectCard.tsx`:

| Campo | Valores aceptados | Se edita desde |
|---|---|---|
| `name` | texto | SQL |
| `project_code` | `LOG-XXX` (correlativo por célula) | SQL / lo genera el botón de POC |
| `summary` | texto libre — **la card corta a 160 caracteres**, el detalle lo muestra completo | SQL |
| `business_area` | texto (aquí = etapa de la cadena de valor) | SQL |
| `owner`, `team` | texto | SQL |
| `status` | `Discovery` · `In Progress` · `Blocked` (convención del seed 031) | SQL |
| `type` | `Idea` · `Oportunidad` · `POC` · `Proyecto` — **enum cerrado** | SQL |
| `handoff_status` | `Experimentación` · `Listo para handoff` · `Handoff hecho` | SQL |
| `estado_interno` | discovery: `Research` · `Ideación` · `Concepción de experimento` · POC: `Seguimiento` · `En definición` · `En priorización` | **UI (el select de la card)** |
| `vpv` | número — Valor Potencial Validado, **solo se ve en POCs** | **UI** |
| `parent_project_id` | un POC cuelga de un proyecto de discovery | UI (botón "+ Crear POC") |
| `prototype_url` | URL | SQL |

Dos reglas del código que conviene tener claras:

- **Escritura cerrada.** `projects` tiene RLS de solo lectura (`019_darwin_rls.sql`); todo insert o
  update pasa por las API routes con `SUPABASE_SERVICE_KEY`. Desde la UI un PM solo puede cambiar
  `estado_interno`, `vpv` y crear POCs. Lo demás se carga por migración SQL.
- **Un POC nace dentro de un proyecto**, nunca convierte al padre: es una fila nueva en `projects`
  con `parent_project_id`, código propio y estados propios (`036_discovery_poc_estados.sql`).

### La tercera capa: el discovery de verdad

`projects` es la carátula. El contenido de un proyecto vive en `discovery_cycles` +
`discovery_decisions` (`023_product_lens.sql`), metodología **B=MAP**, con gates duros por fase
(`src/lib/product-lens/phaseEngine.ts`):

| Fase | No cierra sin |
|---|---|
| **F0** | comportamiento objetivo · señal cuantitativa · segmento (cohorte conductual) |
| **F1** | ≥2 fuentes de evidencia · causa B=MAP **confirmada por el PM** (no basta la sugerida por IA) · sesgo nombrado |
| **F2** | intervención · hipótesis falsable · checks SDT (autonomía, mastery, relatedness) |
| **F3** | supuesto más riesgoso · test de la escalera de validación · umbral de causalidad · si es A/B: métrica **outcome**, muestra, duración, criterio de stop |
| **F4** | spec conductual (comportamiento, loop trigger→action→reward→investment, criterio de éxito, anti-patrones) · tracking confirmado |
| **F5** | decisión de cierre · patrón nombrado |

Es, básicamente, nuestro Definition of Ready escrito en código. **Hoy logística no tiene ni un
ciclo cargado** (la API los busca por `project_code` y vuelve vacía).

## 2. Diagnóstico — por qué las fichas se ven a medias

1. **`estado_interno` está en NULL en las 11 fichas** → todas muestran "Sin definir" en el select.
   Es lo único que se arregla en la UI, con un clic por ficha.
2. **El `summary` viene del seed del 21-jul** (`031_darwin_celula_logistica.sql`) y ya quedó viejo:
   dice cosas como *"Delivery Backlog EJECUTAR"* mientras el tablero, actualizado el 28-jul, tiene
   textos mejores y datos nuevos. La ficha de LOG-007 en Darwin no cuenta lo del catálogo v0.1.
3. **5 de 16 iniciativas no tienen ficha**: Autogeneración de guías · Recolección proactiva ·
   Parametrización de fulfillment · Vigía · Pruebas de entrega (POD). El seed las dejó fuera a
   propósito ("sin carpeta/spec todavía"), pero dos de ellas son los **huecos de documentación #1 y
   #2** del tablero: están listas para hand off y no existen en Darwin.
4. **`vpv` vacío en el único POC** (LOG-004) y ese POC no tiene padre — el API ya prevé el caso
   (`discoveryOptions`), falta decidir de qué proyecto cuelga.
5. **Ningún prototipo enlazado** (`prototype_url` vacío) aunque hay 6 pantallas construidas dentro
   del propio Darwin.

## 3. Qué propongo cargar

### Paso 1 — Las 5 fichas que faltan (LOG-012 … LOG-016)

| Código | Ficha | Etapa | type / status / handoff | Por qué entra |
|---|---|---|---|---|
| LOG-012 | Autogeneración de guías | Despacho | Oportunidad · Discovery · Experimentación | PRM-1469. Hermano de autoconfirmación: ataca los 10,37h de "generación de guía" |
| LOG-013 | Recolección proactiva | Despacho | Oportunidad · Discovery · Experimentación | Fase "Recogido por Dropi" = el peor cumplimiento de la ruta Dropi (80,64%). Prototipo vivo |
| LOG-014 | Parametrización de fulfillment | Despacho | Proyecto · Blocked · **Listo para handoff** | PRM-1446. 92.000 órdenes/mes en 2PL; 20–25% nunca se cobran. Hueco de doc #1 |
| LOG-015 | Vigía | Tránsito (transversal) | Oportunidad · Discovery · Experimentación | Dueño Michel Pino. Único frente transversal a las 5 etapas. No existe en Jira |
| LOG-016 | Pruebas de entrega (POD) | Entrega / Devolución | Proyecto · Discovery · Experimentación | PRM-1517 + 7 tickets. Hueco de doc #2. El 80% de las solicitudes a carriers son POD |

### Paso 2 — Refrescar el `summary` de las 11 existentes

Desde `data.ts` (28-jul), que es la versión viva. Texto completo de cada una en
[`040_darwin_logistica_fichas.sql`](../../../hub/supabase/040_darwin_logistica_fichas.sql).

### Paso 3 — `estado_interno` ficha por ficha

Mapeo propuesto entre la `fase` del tablero y el enum de Darwin:

| Fase en el tablero | `estado_interno` |
|---|---|
| Backlog · Research | `Research` |
| Discovery | `Ideación` |
| Definición · Diseño | `Concepción de experimento` |
| Listo para handoff · En desarrollo · Beta · Lanzado | **ninguno encaja** — ver abajo |

⚠️ **Límite del modelo, no error de datos:** el enum de `estado_interno` solo cubre discovery. Para
lo que ya salió de discovery (LOG-006 tarifas, LOG-009 guías reemplazatorias, LOG-014 fulfillment) no
hay valor correcto y forzar uno miente. Propuesta: dejarlos sin definir y que su estado lo cuente
`handoff_status`, que para eso está. Si molesta ver "Sin definir", la conversación es con Jaime
(agregar un estado de delivery al enum), no un parche por SQL.

| Ficha | Fase hoy | `estado_interno` propuesto |
|---|---|---|
| LOG-001 Autoconfirmación | Research | Research |
| LOG-002 Validación de direcciones | Discovery | Ideación |
| LOG-003 Dirección confiable + geo | Discovery | Ideación |
| LOG-004 Selección de transportadoras (POC) | POC con gate CPO | En priorización |
| LOG-005 Same Day | Discovery | Ideación |
| LOG-006 Tarifas | Listo para handoff | — (manda `handoff_status`) |
| LOG-007 Normalización de estados | Definición | Concepción de experimento |
| LOG-008 Novedad: dueño y triaje | Discovery | Ideación |
| LOG-009 Guías reemplazatorias | Beta | — (Handoff hecho) |
| LOG-010 Reducir devoluciones COD | Backlog | Research |
| LOG-011 Torre de control | Discovery | Ideación |
| LOG-012 Autogeneración de guías | Research | Research |
| LOG-013 Recolección proactiva | Research | Research |
| LOG-014 Fulfillment | Listo para handoff | — (Listo para handoff) |
| LOG-015 Vigía | Diseño | Concepción de experimento |
| LOG-016 Pruebas de entrega | Discovery | Ideación |

### Paso 4 — Los POCs

Los "Experimentos" del tablero no son un `type` válido en Darwin: su lugar es **POC colgando de su
proyecto**. Quedarían así (se crean con el botón "+ Crear POC", pide nombre y de qué se trata):

| POC | Cuelga de | Estado |
|---|---|---|
| Autoconfirmación por madurez | LOG-001 | corriendo — pendiente de personas para la muestra |
| Autogeneración de guías (perfil proveedor) | LOG-012 | listo para probar |
| Control de recolecciones (mapa DANE) | LOG-013 | prototipo con datos mock |
| Vigía (extensión Chrome) | LOG-015 | diseño, sin desarrollo |
| Activar validación en SHOP | LOG-002 | diseñado |
| Ruteo carrier × zona | **ya existe como LOG-004** | falta vincularlo a un padre |

Cada POC pide **VPV** (Valor Potencial Validado). Hoy no tenemos el número calculado para ninguno
salvo fulfillment (+$380M COP/mes si sale en Colombia, dato del 09-jul) — y ese no es POC. La
fórmula de VPV en Darwin todavía es manual y sin definir; no me lo invento.

### Paso 5 — El ciclo de discovery (lo que de verdad llena una ficha)

Propongo arrancar con **uno solo: LOG-007 Normalización de estados**, que es el único con discovery
levantado y datos reales. Cargarlo obliga a responder los gates F0–F1 y ahí se ve si el DoR
aguanta. Si funciona, siguen LOG-001 y LOG-004. Cargar 16 ciclos vacíos solo mueve el problema de
sitio.

## 4. Cómo se aplica

El SQL está en [`040_darwin_logistica_fichas.sql`](../../../hub/supabase/040_darwin_logistica_fichas.sql), idempotente y con
el mismo patrón del seed 031. Dos caminos:

1. **PR al repo de Jaime** — es lo limpio y deja la migración versionada. Ojo:
   `hub/supabase/` está declarado **core_path** en `.github/ownership.json`, así que el workflow
   comentará el PR avisando que se tocó zona núcleo (informa, no bloquea). Igual conviene avisarle
   a Jaime antes.
2. **Pegarlo en el SQL Editor de Supabase** — más rápido, pero el repo queda sin el registro y la
   próxima persona no entiende de dónde salieron las fichas. Si se hace así, el archivo igual debería
   subirse después.

`data.ts` necesita el parche gemelo: agregar `codigo: "LOG-0XX"` a las 5 iniciativas nuevas, o los
chips "sin ficha en Darwin" seguirán ahí aunque las fichas ya existan. Ese archivo está bajo
`hub/src/app/proyectos/`, que ownership.json todavía atribuye a **suppliers** — vale la pena pedirle
a Jaime que registre `logistica` con su carpeta.

## 5. Decisiones que faltan (tuyas, no las tomo yo)

1. **¿PR o SQL Editor?** (y si es PR, ¿lo abro yo desde una rama o lo pasas tú a Jaime?).
2. **LOG-014 y LOG-016 no tienen spec en el cerebro** — son justo los dos huecos de documentación.
   ¿Se registran igual en Darwin (visibilidad ahora, spec después) o primero el spec?
3. **LOG-004 es un POC sin padre.** ¿De qué proyecto de discovery cuelga? Hoy no hay ficha padre
   para selección de transportadoras; la alternativa es cambiarle el `type` a Proyecto.
4. **VPV:** ¿lo dejamos vacío hasta que Jaime defina la fórmula, o cargamos una estimación propia
   marcada como tal?
5. **Nombres:** cuatro fichas se llaman distinto en Supabase y en el tablero (ej. *"Movilización:
   rescatar confirmación (SHOP)"* vs *"Autoconfirmación de órdenes (movilización)"*). Propongo que
   mande el tablero, que es lo que se presenta en el weekly.

## 6. Pendiente después de correr el SQL (29-jul)

1. **`data.ts` — el parche de códigos.** Sin esto, LOG-012 a LOG-016 existen en la base pero la torre
   los sigue mostrando como chips "sin ficha en Darwin", porque el cruce es por `codigo`. Parche
   listo en [`data.ts-codigos.patch`](data.ts-codigos.patch) (5 líneas). Falta abrirlo como PR.
2. **Verificar en la base:** el `select` del bloque 3 del SQL debe devolver **16 filas**. Si devuelve
   11, faltó correr el bloque 1 (los inserts).
3. **Versionar la migración:** si se pegó en el SQL Editor, subir el archivo como
   `hub/supabase/040_darwin_logistica_fichas.sql` en el mismo PR. Si no, la próxima persona no
   entiende de dónde salieron las fichas y el repo miente sobre el estado de la base.
4. **Los 6 POCs** (sección paso 4) — se crean con el botón "+ Crear POC", uno por uno, desde
   `/celula/logistica`. Y **LOG-004**, que es POC sin padre: decidir de qué proyecto cuelga.
5. **Los 3 sin `estado_interno`** (LOG-006, LOG-009, LOG-014): hablar con Jaime sobre agregar un
   estado de delivery al enum, o aceptar que se lean por `handoff_status`.
6. **El discovery de LOG-007** en `discovery_cycles` — la única carga que de verdad llena una ficha.
   Es la que sigue en valor y la que va a doler, porque los gates F0–F1 piden segmento conductual y
   causa B=MAP confirmada.
7. **Specs que faltan en el cerebro:** LOG-014 fulfillment y LOG-016 POD siguen sin `spec.md` — ahora
   con más razón, porque ya tienen ficha pública en Darwin.
8. **Ownership:** pedirle a Jaime registrar `logistica` en `celula_paths` de
   `.github/ownership.json` (hoy `hub/src/app/proyectos/` figura como carpeta de suppliers).

---
*Fuentes: repo `jaimeguevara-dropi/dropi-agente-pm` @ main (leído 29-jul-2026) — `hub/supabase/016·019·023·031·036`,
`hub/src/components/ProjectCard.tsx`, `hub/src/app/api/proyectos/[slug]/route.ts`,
`hub/src/app/celula/[slug]/_lib/logistica-torre.ts`, `hub/src/app/proyectos/logistica/_lib/data.ts`.
Contenido de las fichas: `proyectos/*/spec.md` y `proyectos/_categorizacion.md` de este cerebro + `ESTADO.md`.*
