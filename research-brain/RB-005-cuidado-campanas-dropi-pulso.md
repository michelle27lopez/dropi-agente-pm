# RB-005 · Cuidado de Campañas — Flujos, Dolores y Oportunidades para Dropi Pulso

## Metadatos

| Campo | Valor |
|---|---|
| **ID** | RB-005 |
| **Fecha de investigación** | 2026-07-21 (2 sesiones: cortada a ~10 min + sesión completa de ~40 min) |
| **Iniciativa relacionada** | PUL-001 · Dropi Pulso · Motor de Matching Catálogo |
| **Segmento investigado** | Equipo interno Cuidado de Campañas y Proveedores · Dropi |
| **Etapa del journey** | Operación diaria (post-activación del proveedor): cuidado, búsqueda de producto, escalación de stock |
| **Fuente** | Sesión 1: work-along parcial (internet interrumpido ~10 min). Sesión 2: reunión complementaria completa (~40 min) con pantallas compartidas |
| **Tipo de fuente** | Entrevistas grupales internas con demostración de herramientas en uso real |
| **Nivel de confianza** | Alto — sesión completa con pantallas compartidas. Flujo de Ronald/Bogotá y agenda con proveedores no completados. |
| **Tags** | cuidado-campanas, pareto, stock, señal, dropi-pulso, nexus, nexo, excel-manual, BI, dias-de-stock, escalacion, product-intelligence, concentracion-riesgo, busqueda-producto, estandarizacion-ids, francesca, ronald-bogota |

---

## Problema investigado

¿Cómo trabaja hoy el equipo de Cuidado de Campañas y el equipo de búsqueda de proveedores para gestionar stock, cuidado de campañas y búsqueda de productos? ¿Dónde Dropi Pulso podría encajar como sistema unificado que elimine el trabajo duplicado y conecte los tres flujos: cuidado de stock, búsqueda de producto y señal al proveedor?

---

## Preguntas de investigación

1. ¿Cómo detecta el equipo cuándo un producto del Pareto está en riesgo de quiebre de stock?
2. ¿Qué herramientas usan hoy para gestionar las solicitudes de búsqueda de producto? ¿Qué falla?
3. ¿Cuál es el flujo entre Luisa/Juliana (solicitan), Franshesca (busca en proveedores) y Ronald/Bogotá (busca físicamente)?
4. ¿Qué datos de producto tienen disponibles, con qué frecuencia y de dónde los obtienen?
5. ¿Cuál es el mayor cuello de botella operativo del equipo hoy?
6. ¿Qué funcionalidades necesitarían en Dropi Pulso para dejar de usar el Excel y Nexus como herramientas paralelas?
7. ¿Qué señales automáticas podrían crearse a partir de la data de producto que ya existe?

---

## Participantes

| Participante | Perfil | Rol en el flujo |
|---|---|---|
| Valentina García Grajales | Lead Cuidado de Campañas | Responsable del análisis de producto, BI, Excel de cuidados |
| Natalia Cuéllar | Coordinadora del equipo | Stakeholder principal, visión unificada de Pulso |
| Luisa María Borrero Piedrahita | Ejecutiva Cuidado de Campañas | Solicita búsquedas de producto, cuidados diarios |
| Juliana Sánchez | Ejecutiva Cuidado de Campañas | Solicita búsquedas de producto, cuidados diarios |
| Franshesca Leal | Proveedora interna (búsqueda de producto) | Recibe solicitudes de Luisa/Juliana, contacta proveedores/Bogotá |
| Jaime Guevara | PM Supplier Success | Entrevistador, propone automatizaciones |
| Ronald | Regional Bogotá (mencionado, no presente) | Ejecuta búsqueda física de producto; sin persona dedicada actualmente |

---

## Hallazgos principales

### 1. El equipo gestiona 535 usuarios del Pareto con 3 herramientas paralelas — 100% manual

El equipo de Cuidado de Campañas trabaja con **535 usuarios del Pareto** (505 base + 30 de la comunidad de Iván Caicedo). La operación diaria usa **tres herramientas en paralelo**:

1. **Power BI** — fuente de métricas de productos (cuál se mueve, cuánto)
2. **Nexus** — sistema de tickets para solicitudes de búsqueda de producto (lo que ellos llaman "cuidado de campaña" cuando el producto falta o está en riesgo)
3. **Excel interno** — registro adicional que crearon porque Nexus no les muestra la data completa

Meta declarada: **4 campañas por usuario/mes**. Promedio actual: **2 campañas/usuario** — 50% de la meta. La brecha es operativa.

### 2. El workflow de cuidado de campañas tiene 5 pasos — todos manuales

El ciclo diario de Luisa y Juliana:

1. **Abrir el BI** y revisar los 2–4 productos que más mueve cada usuario del Pareto.
2. **Consultar stock manualmente en Dropy** (los IDs de producto no coinciden entre la BD de analítica y la plataforma operativa — bug confirmado con Diego, automatización imposible hoy).
3. **Calcular días de stock restante**: `días = stock disponible ÷ promedio de órdenes diarias`. El promedio es bi-semanal (lo actualiza Diego, no en tiempo real).
4. **Actualizar el Excel** con semáforo de prioridad: 🔴 ≤5 días (escalación urgente) · 🟡 riesgo medio · 🟢 stock seguro.
5. **Escalar cuando es 🔴**: contactar al proveedor. Canal actual: WhatsApp directo (sin trazabilidad). Canal propuesto: señal en Dropi Pulso.

**Meta diaria: 20 cuidados de campaña por persona.**

### 3. La herramienta Nexus tiene fallos estructurales que generan trabajo doble

El equipo usa "Nexus" para solicitudes de búsqueda de producto (cuando el dropshipper necesita un producto que no está en el catálogo o el proveedor existente no tiene stock). Hallazgos críticos:

**Volumen:** 229 solicitudes registradas al momento de la sesión, con **151 pendientes, 68 completadas, 9 en "pendiente de confirmación"** (estado que no pueden cerrar ni rechazar — bug del aplicativo).

**El problema de triplicación:** las 229 solicitudes en realidad representan **~76 solicitudes únicas** — cada solicitud se registra 3 veces (una por categoría: Premium, Verificado, No Verificado). Franshesca solo tiene visibilidad de 2 de las 3 categorías, así que no procesa la tercera.

**Los 4 fallos de comunicación de Nexus:**
1. **Observaciones no sincronizan:** Franshesca deja una nota ("aplazado, buscando otro proveedor") → a Luisa/Juliana no les aparece. Ellas dejan una respuesta → a Franshesca no le aparece.
2. **Franshesca pierde visibilidad del caso** en cuanto le da respuesta: el caso desaparece de su pantalla y ya no puede editarlo ni ver si las chicas necesitan algo más.
3. **No hay opción "seguir buscando":** si Franshesca encontró un proveedor pero no funciona para el dropshipper, las chicas tienen que **cerrar el caso y abrir uno nuevo** desde cero.
4. **El correo del dropshipper no aparece** en la vista de Franshesca: cuando hay una solicitud de privatización, Fran tiene que preguntar por WhatsApp cuál es el dropshipper.

**Consecuencia:** el equipo creó un Excel adicional para registrar internamente lo que ya registran en Nexus — doble trabajo confirmado. Cuando les preguntan por el estado de un producto, no saben qué contestar porque no ven el estado en Nexus.

> "A veces pues por tantas solicitudes puede que lo reportemos aquí en el Nexus, pero en el archivo de búsqueda interna no lo hayamos reportado." — Luisa

> "Yo soy consciente que hay una sola persona en la búsqueda de productos y que a veces se puede demorar." — Luisa

### 4. La búsqueda de producto tiene un flujo en cascada con 3 actores

Cuando un dropshipper necesita un producto que no existe o tiene stock agotado:

1. **Luisa o Juliana** primero buscan dentro de Dropy (por nombre, por imagen).
2. Si no lo encuentran → **suben solicitud a Nexus**.
3. **Franshesca** recibe la solicitud → contacta a proveedores conocidos o escala a **Ronald/Bogotá** (búsqueda física).
4. Ronald/Bogotá tiene el producto → confirma → Franshesca responde en Nexus → Luisa/Juliana notifican al dropshipper.

**El cuello de botella:** Ronald en Bogotá no tiene una persona dedicada a esto. Su equipo mantiene el movimiento físico del centro y no tiene tiempo de buscar producto durante el día. Por eso muchas veces no le responden a Fran por WhatsApp.

Natalia mencionó que acaba de entrar una compañera llamada **Liana** que hará captación de proveedores con un proceso más macro, y que se necesita una persona en Bogotá exclusivamente para este flujo.

### 5. La data de producto de Diego es el insumo central — pero es frágil

Valentina trabaja con una base de datos que **Diego de analítica extrae de Cronos bajo demanda**:

**Campos disponibles:** correo del dropshipper · ID del producto · nombre del producto · correo del proveedor · órdenes ingresadas · unidades vendidas · órdenes movilizadas.

**Problema:** Diego la genera cuando Valentina la pide. Si no la pide, no la tiene. La base de enero–julio tenía **111,000 IDs de producto** — el Excel se saturó. Valentina tuvo que filtrar a solo productos con 800+ unidades para poder trabajarla.

> "Dependo totalmente de esa base de datos que me pase Diego de datos." — Valentina

> "Si no me la pasa, no tengo insumo." — Valentina

### 6. El problema de estandarización de producto: 1 producto = 10 IDs diferentes

El hallazgo más crítico para el futuro de Dropi Pulso: el mismo producto puede existir con **10+ IDs distintos** en el catálogo porque cada proveedor lo carga con su propio nombre y genera su propio ID.

Ejemplo real mencionado en sesión: "Bellaskin Solo" aparece como:
- "Bellaskin solo"
- "Bellaskin solo 60ml"
- "Aceite Bellaskin"
- "Bellaskin + obsequio"
- … y más variantes

> "Tengo 111,000 IDs de producto y pues ya el pobre Excel me dijo 'No más, no más.'" — Valentina

> "Intenté agruparlos por nombres, pero digamos miremos un solo producto: uno se llama Bellaskin solo, el otro Bellaskin solo 60 ml, otro Bellaskin solo, bueno, ese es combo, pero el otro le ponga Aceite Bellaskin." — Valentina

**Consecuencia:** Valentina no pudo hacer proyecciones por producto real — tuvo que hacerlas por ID, lo que significa que el mismo producto aparece en varias filas. Sin estandarización, no se puede saber cuál es la demanda agregada real de un producto.

### 7. El riesgo de concentración de dropshippers: caso de los aires acondicionados

En la revisión del 1 al 15 de julio, Valentina identificó el patrón más peligroso para el ecosistema:

- **52 dropshippers** vendiendo el mismo "estimulante de barba Apolo"
- **50 dropshippers** vendiendo el mismo aire acondicionado
- **45 dropshippers** vendiendo la misma almohada ortopédica cervical

**Lo que pasó con el aire acondicionado:** los 50 dropshippers crearon tal volumen de órdenes que los proveedores se quedaron sin stock. Resultado: campaña colapsada, dropshippers con campañas activas sin inventario.

> "Los proveedores se quedaron sin stock. Y qué tenemos en este momento, un déficit para que ellos sigan escalando esas campañas porque no hay stock de aires acondicionados." — Valentina

Este patrón es prevenible con alertas automáticas de concentración de dropshippers por producto.

### 8. El análisis de producto de enero a junio: insights de Valentina

Valentina construyó un análisis manual de la base de datos de Diego (enero–junio 2026) con las siguientes métricas:

- **111,000 IDs de producto** movidos en ese período
- **29,000 productos** superaron las 1,000 órdenes en el año
- **69,000 productos** no tuvieron órdenes en junio (¿stock agotado? ¿producto quemado? desconocido)
- **10,017 productos nuevos** se movieron en junio
- **885 productos** decrecieron en junio
- **316 productos** se mantienen consistentemente en el tiempo
- **En julio (1–15):** 30,009 productos activos, 2,413 proveedores activos

**Lo que Valentina quería construir pero no pudo:** proyecciones por producto para los meses de temporada (julio–diciembre) que permitieran decirle al equipo de proveedores: "de este producto vamos a necesitar X unidades en agosto".

### 9. La visión de Natalia: todo dentro de Pulso, sin Excels paralelos

Natalia articuló claramente adónde debería llegar Dropi Pulso como herramienta del equipo:

> "Me gustaría que pudiéramos tener, desde el área de proveedores, esa visual. Eso solamente lo tiene el área de droppers, pero para nosotros también es valioso tener esa información." — Natalia

> "Lo que menos quiero es generar doble trabajo. Que ellas no tengan otro drive aparte — que ellas puedan tener toda la información dentro del mismo Pulso." — Natalia

**Requerimientos concretos de Natalia:**
- Poder filtrar y descargar por mes (revisiones trimestrales)
- Tiempos de respuesta medibles
- Fran tenga visibilidad de las 3 categorías (Premium, Verificado, No Verificado)
- Que las solicitudes de adquisiciones también pasen a Fran directamente (sin que Luisa/Juliana las gestionen)
- Que Ronald/Bogotá también pueda usar la herramienta

### 10. Jaime propone: auto-creación de señales a partir del Excel

En la sesión, Jaime propuso la automatización más concreta:

> "¿Qué te parece si cuando suben la data y hay un riesgo alto, un riesgo medio, de una vez se cree la señal automática en Pulso, sin que las chicas tengan que ir a crear la señal allá?" — Jaime

Valentina respondió: **"Pues sería buenísimo."**

Además, Jaime mencionó que el **18 de agosto** habrá una API disponible para consultar el catálogo completo desde Pulso — lo que podría agilizar la búsqueda de producto que hoy hacen manualmente en Dropy.

---

## Dolores detectados

| # | Dolor | Intensidad | Segmento afectado | Evidencia |
|---|---|---|---|---|
| D1 | Stock consultado manualmente en Dropy — bug de IDs impide automatización | Crítico | Luisa / Juliana | Diego intentó automatizar; cruces de IDs fallan sistemáticamente |
| D2 | No hay canal formal de escalación al proveedor cuando stock cae a ≤5 días | Alto | Equipo completo | Escalación hoy = WhatsApp directo sin trazabilidad |
| D3 | Datos de producto dependen de que Diego exporte el CSV manualmente | Alto | Valentina | "Si no me la pasa, no tengo insumo" |
| D4 | Meta de 4 campañas/usuario al 50% (2 real) — brecha operativa | Alto | Equipo / Dropi | 535 usuarios × 2 campañas actuales vs. meta de 4 |
| D5 | Las observaciones en Nexus no sincronizan entre Fran y Luisa/Juliana | Alto | Franshesca · Luisa · Juliana | "A ellas no les aparece lo que dejo." / "Cuando ella me responde, yo no lo veo" |
| D6 | Fran pierde visibilidad del caso en cuanto da respuesta | Alto | Franshesca | "Ya yo no puedo abrir ni editar" el caso tras responder |
| D7 | 229 solicitudes en Nexus son en realidad ~76 — triplicadas por categoría | Alto | Franshesca · Luisa · Juliana | Las 229 = misma solicitud repetida para premium/verificado/no verificado |
| D8 | Si la respuesta de Fran no sirve, hay que cerrar el caso y abrir uno nuevo | Alto | Luisa · Juliana | "De toca subir otra vez la solicitud" sin poder continuar el hilo |
| D9 | Trabajo doble: se registra en Nexus Y en el Excel interno | Alto | Equipo completo | "A veces lo reportamos en Nexus pero no en la búsqueda interna" |
| D10 | El mismo producto existe con 10+ IDs distintos — imposible agregar demanda real | Crítico | Valentina · Franshesca | 111,000 IDs, múltiples proveedores con nombres distintos para el mismo producto |
| D11 | Riesgo de concentración no visible: 50+ dropshippers en mismo producto → stock colapsa | Crítico | Equipo · Proveedor · Dropshipper | Caso AC: 50 drops → stock agotado → campaña colapsada |
| D12 | Proyecciones de temporada imposibles de hacer por la desagregación de IDs | Alto | Valentina | "No encontré la manera de agrupar por producto real" |
| D13 | El promedio de órdenes diarias es bi-semanal — cálculo de días de stock puede estar desactualizado | Medio | Luisa · Juliana | Diego actualiza cada dos semanas |
| D14 | Sin métricas de efectividad del proceso de búsqueda (tasa de éxito, tiempo de respuesta) | Medio | Natalia · Valentina | "Si no tenemos cómo medir, no vamos a saber qué ajustar" |
| D15 | Ronald/Bogotá no tiene persona dedicada a búsqueda de producto — cuello de botella físico | Alto | Franshesca | "Él no tiene chance de buscar producto en todo el día" |

---

## Oportunidades identificadas

| # | Oportunidad | Quién la señaló | Pains | Prioridad |
|---|---|---|---|---|
| O1 | Señal "Stock" en Dropi Pulso para escalar cuando producto cae a ≤5 días | Valentina (pedido explícito) | D1, D2 | Alta |
| O2 | Auto-creación de señal en Pulso al subir el Excel con datos de riesgo | Jaime (Valentina aprobó) | D2, D13 | Alta |
| O3 | Reemplazar el Excel interno + Nexus con un panel unificado en Pulso | Natalia (visión declarada) | D5, D6, D7, D8, D9 | Alta |
| O4 | Threading tipo WhatsApp en Nexus/Pulso para comunicación bidireccional | Franshesca · Luisa | D5, D6, D8 | Alta |
| O5 | Eliminar la triplicación de solicitudes por categoría (1 solicitud = 1 caso) | Natalia | D7 | Alta |
| O6 | Alerta de concentración de dropshippers: cuando N drops están en mismo producto → alertar | Inferido del caso AC | D11 | Alta |
| O7 | Estandarización/deduplicación de IDs de producto (mismo producto, diferente proveedor = mismo ID) | Valentina (problema identificado) | D10, D12 | Media |
| O8 | Dashboard de producto para el área de proveedores (hoy solo lo tiene área de dropshippers) | Natalia | D3, D14 | Media |
| O9 | API de catálogo desde Pulso para búsqueda de producto en tiempo real (confirmada para 18 ago) | Jaime | D1, D3 | Media |
| O10 | Métricas de búsqueda: solicitudes exitosas / no exitosas, tiempo de respuesta, producto más pedido | Valentina · Natalia | D14 | Media |
| O11 | Proyecciones de temporada por producto (julio–diciembre) — hoy imposible por el problema de IDs | Valentina | D12 | Media |
| O12 | Incorporar a Ronald/Bogotá en Pulso con su propia vista (búsqueda física) | Natalia | D15 | Media |
| O13 | Visibilidad del correo del dropshipper en la vista de Fran (hoy tiene que pedirlo por WA) | Franshesca | D5 | Baja |
| O14 | Que los casos tengan historia descargable por mes/trimestre | Natalia | D14 | Baja |

---

## Hipótesis

### Hipótesis de trabajo (no validadas aún)

**H1 — Señal de stock reduce tiempo de escalación:** Si se agrega la señal "Stock" en Dropi Pulso, el equipo de Cuidado de Campañas la adoptará como canal preferido sobre WhatsApp directo.
- Evidencia parcial: Valentina la pidió explícitamente.
- Pendiente: medir tiempo actual de escalación por WhatsApp vs. respuesta esperada por Pulso.

**H2 — Auto-señal reduce carga operativa:** Si el Excel de cuidados alimenta directamente a Pulso para crear señales automáticas cuando detecta 🔴, se eliminan los pasos manuales de ir a crear la señal.
- Evidencia parcial: Valentina dijo "sería buenísimo" ante la propuesta de Jaime.
- Pendiente: proof of concept técnico (leer CSV → detectar días ≤5 → crear señal automática).

**H3 — Panel unificado duplica cobertura de campañas:** Si Pulso reemplaza el triple registro (BI + Nexus + Excel), el equipo puede atender más campañas con el mismo número de personas.
- Sin evidencia cuantitativa aún. El ahorro de tiempo por eliminación de doble registro se estimará cuando se prototipe.

**H4 — Alertas de concentración previenen colapso de stock:** Si el sistema detecta cuando N dropshippers están en el mismo producto y alerta al equipo, se puede coordinar con el proveedor antes de que el stock se agote.
- Evidencia fuerte: el caso del AC (50 drops → colapso) es exactamente lo que esta hipótesis previene.
- Pendiente: definir el umbral N (¿20 drops? ¿30 drops?).

**H5 — Estandarización de IDs desbloquea proyecciones:** Si se construye un índice de equivalencia de IDs de producto (mismo producto = mismo ID canónico), las proyecciones de temporada que Valentina no pudo hacer se vuelven posibles.
- Evidencia: Valentina intentó agrupar por nombre pero los nombres varían demasiado entre proveedores.
- Pendiente: evaluar si CAT-001 (categorización) puede resolver esto o si es un problema diferente.

---

## Evidencia y citas relevantes

> "Necesitamos la señal de Stock — cuando un producto del Pareto cae a 5 días o menos, tenemos que escalarle al proveedor y hoy no tenemos un canal para eso."
> — Valentina García Grajales

> "Pues sería buenísimo." [en respuesta a la propuesta de auto-crear señales en Pulso al subir el Excel]
> — Valentina García Grajales

> "Dependo totalmente de esa base de datos que me pase Diego de datos. Si no me la pasa, no tengo insumo."
> — Valentina García Grajales

> "Yo intenté agruparlos por nombres, eso mejor dicho le intentamos buscar, pero digamos miremos un solo producto: uno se llama Bellaskin solo, el otro Bellaskin solo 60 ml, otro le ponga Aceite Bellaskin. Y así como este caso tenemos muchos."
> — Valentina García Grajales

> "Los proveedores se quedaron sin stock. ¿Y qué tenemos en este momento? Un déficit para que ellos sigan escalando esas campañas porque no hay stock de aires acondicionados."
> — Valentina García Grajales

> "Me gustaría que por las observaciones quedara como un tipo WhatsApp, que cuando yo le responda aparezca acá y cuando ya me responden aparezcan abajo y así sucesivamente."
> — Franshesca Leal

> "Nosotros no teníamos formas de darnos cuenta si ellos llegaban o no a una negociación. Para hacer un seguimiento, para saber si funcionó o no funcionó, qué falló."
> — Natalia Cuéllar

> "Lo que menos quiero es generar doble trabajo. Que ellas no tengan otro drive aparte — que puedan tener toda la información dentro del mismo Pulso."
> — Natalia Cuéllar

> "A veces pues por tantas solicitudes puede que lo reportemos aquí en el Nexus, pero en el archivo de búsqueda interna no lo hayamos reportado."
> — Luisa María Borrero

> "Si no tenemos cómo medir, no vamos a saber qué tenemos que ajustar."
> — Valentina García Grajales

> "Esto está hecho con las uñas."
> — Natalia Cuéllar [sobre el setup actual]

---

## Métricas mencionadas

| Métrica | Qué mide | Umbral/referencia | Quién la usa |
|---|---|---|---|
| Usuarios Pareto gestionados | Universo de trabajo | 535 (505 base + 30 comunidad Iván) | Equipo Cuidado de Campañas |
| Campañas/usuario/mes | Meta de cuidado activo | Meta: 4 · Actual: 2 | Natalia / Valentina |
| Días de stock restante | Riesgo de quiebre de campaña | ≤5 días = 🔴 urgente | Luisa / Juliana |
| Cuidados de campaña diarios | Capacidad operativa por persona | Meta: 20/día/persona | Luisa / Juliana |
| Solicitudes en Nexus (total) | Volumen de búsquedas de producto | 229 totales (≈76 únicas por triplicación) | Franshesca / Luisa / Juliana |
| Solicitudes pendientes / completadas | Estado del backlog de búsqueda | 151 pendientes · 68 completadas · 9 en limbo | Franshesca |
| IDs de producto movidos (ene–jun) | Diversidad de catálogo activo | 111,000 IDs en 6 meses | Valentina (análisis manual) |
| IDs de producto movidos (jul 1–15) | Catálogo activo reciente | 30,009 IDs, 2,413 proveedores | Valentina |
| Productos con >1,000 órdenes/año | Performance alto | 29,000 productos | Valentina |
| Productos sin órdenes en junio | Riesgo de catálogo inactivo | 69,000 productos | Valentina |
| Productos nuevos en junio | Dinamismo del catálogo | 10,017 nuevos | Valentina |
| Concentración de drops/producto | Riesgo de colapso de stock | Aire AC: 50 drops · Barba Apolo: 52 drops | Valentina |
| Promedio de órdenes diarias | Base del cálculo de días de stock | Actualizado bi-semanalmente por Diego | Luisa / Juliana |

---

## Herramientas mencionadas

| Categoría | Herramienta | Uso reportado | Dolor asociado |
|---|---|---|---|
| Analítica | Power BI / BI interno | Revisión diaria de productos más vendidos por usuario del Pareto | Solo la consultan, no pueden editarla ni descargarse el ID del producto fácilmente |
| Catálogo | Dropy (plataforma Dropi) | Búsqueda manual de stock por producto | Los IDs no coinciden con la BD de analítica — bug estructural |
| Solicitudes | Nexus (herramienta interna) | Sistema de tickets para búsqueda de producto: Luisa/Juliana solicitan, Fran responde | 4 fallos críticos: sin sync, sin visibilidad post-respuesta, triplicación, no hay threading |
| Coordinación interna | Excel (semáforo + base de datos) | Priorización diaria de cuidados (🔴🟡🟢) + registro de solicitudes | Doble registro con Nexus; Excel de 111K filas colapsa Google Sheets |
| Datos de producto | CSV de Diego (Cronos) | Base de movimiento de producto: dropshipper · ID · proveedor · unidades · órdenes | Bajo demanda, no en tiempo real, sin estandarización de IDs |
| Comunicación | WhatsApp | Canal actual de escalación a proveedor (stock) y a Ronald/Bogotá | Sin trazabilidad, sin historia, depende de que respondan |
| Señalización (objetivo) | Dropi Pulso | Canal de escalación propuesto para señal "Stock" + panel unificado | Aún falta la señal "Stock" y la integración con el flujo de búsqueda |

---

## Análisis de herramientas — Nexus (diagnóstico técnico)

Nexus es la herramienta actual de gestión de solicitudes de producto. Su arquitectura de estados tiene fallas que generan el 80% del trabajo doble:

| Estado en Nexus | Quién lo ve | Problema |
|---|---|---|
| Sin responder | Fran | OK — es el inbox de Fran |
| Aplazado | Fran (sola) | Las chicas no ven la observación de Fran al aplazar |
| Completado | Chicas (como "completado") | Fran pierde la visibilidad; las chicas no pueden reabrir ni continuar el hilo |
| Pendiente de confirmación | Ninguna puede cerrar | Bug del aplicativo: caso en limbo que nadie puede resolver |

**El flujo ideal (propuesto por Fran):** threading tipo WhatsApp — cada mensaje queda visible para todos, con nombre del remitente, en orden cronológico. El caso solo se cierra cuando ambos lados confirman resolución.

---

## Relación con iniciativas Dropi

| Iniciativa / Área | Conexión con este research |
|---|---|
| **PUL-001 · Dropi Pulso** | Caso de uso central: señal "Stock", auto-señal desde Excel, panel unificado para el equipo de Cuidado de Campañas |
| **CAT-001 · Categorización** | El problema de los 111,000 IDs y la estandarización de producto es el mismo problema que CAT-001 intenta resolver desde el ángulo del catálogo |
| **CAZ-001 · Caza Productos** | La búsqueda de proveedores que hace Fran (cascada: Dropy → Nexus → Ronald/Bogotá) es exactamente el flujo que CAZ-001 busca digitalizar |
| **DCA-001 · Dinámicas de Catálogo** | El experimento de campañas manuales (DCA-001 TOBE) es el contexto operativo de este equipo; las señales de Pulso complementan directamente ese experimento |
| **NEG-002 · Negociaciones Directas** | La alerta de concentración de dropshippers y la propuesta de Valentina ("que el proveedor les llegue como una oferta cuando tenemos producto escaso") es un caso de uso de NEG-002 |
| **TTV-001 · Time to Value** | El patrón de pipeline automatizado (data → detección → alerta automática) ya opera en TTV-001 con GHL; puede replicarse para Pulso con los datos de stock |
| **IND-001 · Indicadores de Proveedores** | El bug de IDs de producto entre Cronos/Dropy y la BD de analítica también bloquea los indicadores del lado proveedor |

---

## Vacíos de información

- **Flujo completo de Ronald/Bogotá** no documentado en sesión — Natalia propuso una reunión con Ronald para completarlo.
- **Sin datos cuantitativos del tiempo de escalación actual** (detección de 🔴 en Excel → respuesta del proveedor por WhatsApp).
- **Sin feedback de proveedor:** no se sabe cómo respondería el proveedor si recibiera una señal de "Stock" en Pulso.
- **El bug de IDs de producto** (Cronos ≠ Dropy) no fue profundizado en esta sesión — se necesita una sesión con Diego/Miguel Ángel para entender el alcance exacto.
- **La fecha exacta de disponibilidad de la API de catálogo** (mencionada como 18 de agosto) no fue confirmada con Tech — es una expectativa de Jaime, no un compromiso técnico formal.
- **El umbral de concentración de dropshippers** para activar una alerta no fue definido — ¿a partir de cuántos drops se considera riesgo?

---

## Recomendaciones para nuevo research

1. **Sesión con Ronald/Bogotá:** documentar el flujo de búsqueda física de producto, sus herramientas, su carga de trabajo y qué necesitaría de Pulso para participar.
2. **Sesión con Diego/Miguel Ángel:** entender el bug de IDs de producto entre Cronos y Dropy, y explorar si hay un endpoint de Dropy que exponga el stock por ID de producto como alternativa.
3. **Medir el tiempo de escalación actual:** cuánto tarda un 🔴 en el Excel desde la detección hasta la respuesta del proveedor (hoy por WhatsApp).
4. **Definir el umbral de concentración:** con Valentina y el equipo, establecer a partir de cuántos dropshippers en el mismo producto se debe activar una alerta automática.
5. **Research con proveedores:** cómo reciben hoy las escalaciones de stock y qué harían si llegaran por Pulso vs. WhatsApp.

---

## Fuentes

| Tipo | Descripción |
|---|---|
| Entrevista grupal interna — sesión 1 | Reunión inicial con equipo Cuidado de Campañas · 2026-07-21 · ~10 min (cortada por internet). Natalia, Valentina, Luisa, Juliana, Franshesca. Señal "Stock" fue el hallazgo principal. |
| Entrevista grupal interna — sesión 2 | Reunión complementaria completa · 2026-07-21 · ~40 min con pantallas compartidas. Mismos participantes. Valentina mostró el flujo completo de cuidados, Luisa mostró Nexus, Franshesca mostró su vista. |
| Notas de reunión | Documentadas en `memory/project_dropi_pulso.md` — sección "Actualización 2026-07-21" |
| Captura de Power BI | Dashboard de campañas del Pareto compartido por Valentina en sesión |
| Análisis de datos en vivo | Valentina compartió pantalla de su Google Sheets con base de datos de Diego (111,000 IDs) |
