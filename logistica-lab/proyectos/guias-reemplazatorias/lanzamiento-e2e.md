# Estrategia de Lanzamiento y Following · Guías reemplazatorias en Ecom Scanner

> **Qué es este archivo.** El contenido para llenar las pestañas **🫀 Estrategia de Lanzamiento** y **🫀 Following** del formato oficial *"Proyectos E2E - Formato de documentación"* ([plantilla](https://docs.google.com/document/d/1pw2H33wc4jGrHRFNLdyl6U4M7sXu76FLzkIlhQX9DZg/edit)).
> **Fuente de verdad del proyecto:** [`spec.md`](spec.md) · contexto de la herramienta en [`../ecom-scanner/sintesis.md`](../ecom-scanner/sintesis.md).
> **PM:** Juan Diego Bautista Vásquez · **Corte:** 2026-09-01.

> ### Supuesto de trabajo de este documento
> **Se elabora en paralelo mientras TI cierra los pendientes técnicos** de la épica [TECH-480](https://dropi-it.atlassian.net/browse/TECH-480) y la cobertura de Coordinadora. Todo lo que sigue asume que, al momento de salir, **las tres transportadoras están verificadas en producción y el beta `return_guide` está listo para graduarse**.
> Las fechas se expresan como **T+n semanas** desde que TI confirma cierre técnico (**T0**), para que el plan no dependa de una fecha de calendario que todavía no existe. La lista de dependencias está al final (§5), corta, para saber qué hay que confirmar antes de apretar el botón.

**Cómo leer las cifras:** `[HECHO]` = medida, con fuente y denominador · `[HIPÓTESIS]` = por validar · `[PENDIENTE DW]` = solicitada en 2.4.

---

# 🫀 Estrategia de Lanzamiento

## 0 · Datos generales

| Campo | Respuesta |
|---|---|
| **Nombre del proyecto** | Lectura de guías reemplazatorias en Ecom Scanner |
| **Célula / módulo** | Logistic Success (Ecom) · Módulo **Ecom Scanner → Recepción y Gestión de devoluciones** |
| **PM / PO responsable** | Juan Diego Bautista Vásquez. Comunicación y activación: Laura Torres Ciendúa ([PROD-1045](https://dropi-it.atlassian.net/browse/PROD-1045)). Front: joan.palacio. |
| **Tipo de lanzamiento** | **Mejora** — capacidad nueva sobre una herramienta que ya existe. *(El push de adopción de Ecom Scanner es un lanzamiento distinto: [`../ecom-scanner/lanzamiento-adopcion-e2e.md`](../ecom-scanner/lanzamiento-adopcion-e2e.md).)* |
| **Fecha estimada en producción** | La capacidad ya está en producción detrás del beta **`return_guide`** desde junio-2026 `[HECHO: DROP-25407/25564/25614 resueltas 13–17 jun]`. **Salida a usuarios: T0 + 1 semana**, siendo T0 la confirmación de cierre técnico por parte de TI. |
| **Roles incluidos** | Proveedores (todas las categorías: no verificado, verificado, premium, premium exclusivo), Sellers Proveedores, Marcas propias. |
| **Países incluidos** | **Colombia.** Las tres transportadoras soportadas operan en CO. *(El campo País de las oportunidades PRM está en "Todos"; conviene ajustarlo a Colombia cuando se retome la edición en Jira.)* |
| **Links principales** | Oportunidades: [PRM-745](https://dropi-it.atlassian.net/browse/PRM-745) (Interrapidísimo) · [PRM-1380](https://dropi-it.atlassian.net/browse/PRM-1380) (Coordinadora) · [PRM-1381](https://dropi-it.atlassian.net/browse/PRM-1381) (TCC) · Proyecto madre: [PRM-1288](https://dropi-it.atlassian.net/browse/PRM-1288) · Lanzamiento: [PROD-1045](https://dropi-it.atlassian.net/browse/PROD-1045) · Desarrollo: [DROP-25407](https://dropi-it.atlassian.net/browse/DROP-25407) · [DROP-25564](https://dropi-it.atlassian.net/browse/DROP-25564) · [DROP-25614](https://dropi-it.atlassian.net/browse/DROP-25614) · [DROP-25667](https://dropi-it.atlassian.net/browse/DROP-25667) · [DROP-23090](https://dropi-it.atlassian.net/browse/DROP-23090) · Épica técnica vigente: [TECH-480](https://dropi-it.atlassian.net/browse/TECH-480) · Kickoff PLG Ecom Scanner: [Drive](https://docs.google.com/document/d/1s8dHFxLIZhE8c5fNR2RaXmhfiTvugk-tF1Kt6vt5N_k/edit) · Spec interno: `logistica-lab/proyectos/guias-reemplazatorias/spec.md` · **Tango:** por producir (entregable de PROD-1045) · **Figma:** N/A — sin cambio de UI más allá del ítem de resultado. |

---

## 1 · Estrategia de la funcionalidad

### 1.1 Población y valor para el usuario

| Campo | Respuesta |
|---|---|
| **Usuario principal** | **Proveedores** (todas las categorías), **Sellers Proveedores** y **Marcas propias**: quien recibe físicamente la devolución en su bodega. Identificable en datos como usuario con rol proveedor/marca, en Colombia, con al menos una orden devuelta de Interrapidísimo, Coordinadora o TCC en el periodo. |
| **¿Se aplica para marcas blancas?** | **Sí.** Es una capacidad del módulo de recepción, independiente de la marca del portal: cualquier operación que reciba devoluciones de estas transportadoras la necesita igual. |
| **Usuario adyacente** | **Operario de bodega Dropi y punto PAU.** Es quien ejecuta el escaneo — el kickoff PLG lo describe como quien *"marca la mayoría de los eventos"* — pero **no se le alcanza por redes ni campañas**: hay que llegarle **dentro de la plataforma**, en el momento en que abre el módulo de recepción. Esto define la estrategia de canales del bloque 3. |
| **Quién queda fuera** | **Dropshippers** (no reciben devoluciones físicas; consultan en Dropi web), **líderes de comunidad** y **Admin CAS**. No tienen el problema. |
| **Tamaño del público** | `[PENDIENTE DW — solicitado en 2.4]`. Se pide: proveedores/bodegas activos con ≥1 devolución de INTER/COORD/TCC en los últimos 60 días, y qué proporción de ellos usa hoy Ecom Scanner. Referencia de escala del universo Dropi CO: 97.660 usuarios activos (definición del formato: con al menos una orden entregada). |
| **Problema principal** | Cuando una transportadora gestiona una devolución, **pega una guía reemplazatoria encima de la guía original de Dropi**. El operario no puede escanear: la de abajo es ilegible sin levantar el sticker y la de arriba el sistema no la reconocía. La devolución queda sin registrar o se registra a mano. |
| **Frecuencia del problema** | **Diaria.** En cada jornada de recepción de devoluciones de cualquier bodega que opere con estas tres transportadoras. |
| **Gravedad** | **Alta.** Aplicando el criterio del propio formato —*"Media o alta: bloquea o reduce mucho el valor del producto y no hay una alternativa simple"*— aquí **no hay alternativa simple**: la única salida es digitar el número a mano uno por uno o levantar físicamente el sticker. Bloquea el registro justo en el punto donde Dropi pierde trazabilidad del activo físico. |
| **Alternativa actual** | **Manual y frágil.** (a) Levantar el sticker de la transportadora para leer la guía Dropi — daña la etiqueta y toma tiempo; (b) digitar el número a mano — expuesto a error de tecleo e inviable a escala de bodega; (c) no registrar la recepción, que es lo que la data sugiere que ocurre: `[HECHO]` *"de 412 devoluciones solo 27 registran la recepción — 6 de cada 100"* (`hub/.../normalizacion-estados-data.ts`). |
| **Valor para el usuario** | *"Esta funcionalidad ayuda al **proveedor y al operario de bodega** a **recibir una devolución escaneándola una sola vez**, sin **levantar el sticker de la transportadora ni digitar el número a mano**."* |
| **Acción de valor** | **Escanear una guía reemplazatoria y que el sistema la resuelva a la orden original de Dropi.** No es abrir el módulo, ni ver el banner, ni hacer clic en el tutorial: es la resolución exitosa — el ítem muestra *"Guía reemplazatoria: &lt;número&gt;"* y la orden entra al lote. |
| **Insights importantes u otra información de apoyo** | • El kickoff PLG de Ecom Scanner define tres hipótesis de valor de la herramienta —**Velocidad, Confianza y Claridad**—; esta capacidad ataca directamente **Claridad**: *"Una devolución no sé bien cómo registrarla"* está marcado `[CONFIRMADO]` en ese documento, y es uno de los cuatro dolores levantados.<br>• `[HECHO]` Ecom Scanner mueve **más de 25M de eventos en 60 días** (análisis abril-2026).<br>• `[HECHO]` El retorno ya se captura parcialmente: *Recibido por Dropi* 775K · *Recepción de devoluciones* 345K.<br>• **El dolor no aparece en soporte** y eso es informativo, no contradictorio: en todo el histórico de STID solo 2 tickets mencionan "reemplazatoria", porque la bodega lo resuelve a mano y no abre ticket. Implicación práctica: **el éxito no se puede medir por reducción de tickets** — hay que medirlo por cobertura de lectura (bloque 2.1). |
| **¿Qué tan grande debe ser el lanzamiento?** | Ver bloque 4 · **Tier 1**. |

#### Cómo citar la cifra de gravedad en piezas de comunicación

Para que la campaña no use un número que Operaciones pueda desmentir:

- ✅ **Citar así:** `[HECHO]` *"26,04% de las órdenes movilizadas se devuelven"* (abril-2026, mes cerrado, Power BI, corte 26-jun · `conocimiento/temas/18`), o *"~21% de las creadas"* (`estrategia/primera-medicion-kpis-y-meta.md`). Ambos denominadores son válidos si se declaran.
- ❌ **No citar:** *"el 25% de los pedidos"* sin denominador — sobrestima ~4 puntos frente a nuestro propio baseline. El otro 25% que circula es **COD 25% vs prepago 1,3%**, que es un corte por medio de pago, no la tasa global.
- 🔬 **Pendiente de medir:** qué porcentaje de esas devoluciones llega con guía reemplazatoria. Es la cifra que de verdad dimensiona este problema y **es la pregunta #2 de la solicitud a Data (2.4)**. Hasta tenerla, se comunica el beneficio ("no levantes el sticker") sin porcentaje.

### 1.2 Valor para el negocio

| Campo | Respuesta |
|---|---|
| **Tipo de impacto** | **Defensivo.** No mueve adquisición ni monetización: **evita el deterioro de la trazabilidad de la devolución**, que es el punto donde Dropi pierde control del activo físico y donde cada orden fallida cuesta dos veces (logística + fulfillment). |
| **KPI / OKR relacionado** | OKR2 · KR de **tasa de entrega** (indirecto, vía logística inversa) y **North Star de la célula: ⬆️ movilización + ⬆️ % de entrega**. El indicador que mueve directamente es la **cobertura de recepción de devoluciones registrada en Ecom**. *Trazabilidad completa de la Orden* es el Problema nivel II ya asignado a las tres oportunidades PRM. |
| **Importancia estratégica** | **Media-alta.** El público es acotado —quien recibe devoluciones de tres transportadoras en CO— pero la gravedad es alta y la frecuencia diaria. Su valor estratégico real es **de palanca**: es la prueba tangible de que Ecom Scanner mejoró, y por eso es el gancho del push de adopción de la herramienta, que sí es Tier 2. |
| **Objetivo de la funcionalidad** | Que una devolución con guía reemplazatoria se reciba en Ecom Scanner con un solo escaneo, resolviendo a la orden original de Dropi y sin duplicar el registro. |
| **Hipótesis** | *"Si ofrecemos **la lectura automática de la guía reemplazatoria** a **los proveedores y bodegas que reciben devoluciones de Interrapidísimo, Coordinadora y TCC**, entonces **registrarán en Ecom un mayor porcentaje de las devoluciones que reciben físicamente**, porque **hoy la única alternativa es levantar el sticker o digitar a mano, y ante esa fricción la data sugiere que simplemente no registran (6 de cada 100)**."*<br>**Sabremos que es verdad cuando** la cobertura de recepción registrada suba de forma sostenida en las bodegas activadas frente a las no activadas, en el mismo periodo y con transportadora comparable. |

---

## 2 · Configuración operativa

### 2.1 Fuentes y eventos a instrumentar

> Siguiendo la regla del formato, se describe **la acción**, no el nombre técnico — la nomenclatura la define quien configure el tracking.
> **Referencia interna útil:** el lanzamiento de devoluciones ecom (abril-2026) resolvió esto mismo con `DROP-23033` (definición de métricas), `DROP-23525` (métricas conductuales y TARS), `DROP-23526` (catálogo de eventos) y `DROP-23631` (cierre). Ese es el molde probado a repetir aquí.

| Qué necesitamos saber | Acción o señal | Fuente |
|---|---|---|
| ¿Cuántos entran al módulo de recepción de devoluciones? | El usuario abre Recepción / Gestión de devoluciones en Ecom Scanner | Frontend (`ecom_web`) |
| **¿Se leyó una guía reemplazatoria?** *(evento de adopción)* | El escaneo detecta un número con patrón de reemplazatoria y **se resuelve exitosamente a la guía original** | Backend (`carrier_guide` / `dropi-logistic`) |
| ¿Cuánto falla la lectura? | Intento con patrón detectado que termina en error 4xx/5xx o timeout, **con el carrier como atributo** | Backend |
| ¿Estamos bloqueando guías válidas? *(falso positivo)* | Número que cumple patrón pero no es una reemplazatoria válida y queda bloqueado en el módulo | Backend |
| ¿Sirve la deduplicación? | Intento rechazado porque la orden ya estaba registrada por el otro número | Backend |
| ¿Hay casos que nadie puede resolver? | Recepción abandonada tras intento fallido, o uso de override / registro manual | Frontend + Backend |
| ¿Quién y dónde lo usa? | Cada evento anterior con usuario, rol, bodega/país, **transportadora** y timestamp | Backend |
| Cobertura real y comparación | % de devoluciones recibidas físicamente que quedan registradas en Ecom, con vs. sin la capacidad activa | Data Warehouse |

> **Dos reglas que vienen del MVP de métricas de Ecom Scanner** (`conocimiento/temas/08`) y que aplican sin excepción:
> 1. *"**No medir Ecom por cantidad de escaneos**"* — sube sin mejorar la entrega. Fuera de la lista de éxito: total de escaneos, usuarios creados, cantidad de alertas, manifiestos impresos, pantallas y clics.
> 2. **Todos los eventos llevan la transportadora como atributo.** Sin eso no se puede decidir por carrier, que es exactamente la decisión que este lanzamiento necesita tomar.

### 2.2 Solicitud de tracking en Userpilot

| Campo | Respuesta |
|---|---|
| **Objetivo del tracking** | Saber si las bodegas y proveedores activados **efectivamente escanean guías reemplazatorias**, y con qué tasa de éxito por transportadora. Decisión que permite tomar: ampliar la cohorte, sostener, ajustar el patrón o pausar por carrier. |
| **Audiencia** | Misma audiencia del bloque 1, **con una excepción**: el evento de adopción debe capturarse también para el **operario de bodega Dropi y PAU**, que es quien ejecuta la acción aunque no sea el titular de la cuenta. |
| **Pantalla o URL** | Ecom Scanner → módulos **Recepción** y **Gestión de devoluciones** (microfrontend `ecom_web`). Ruta exacta a confirmar con Front (joan.palacio) al configurar. |
| **Momento del flujo** | Al resolverse el escaneo: cuando el backend responde con la guía original y el ítem se agrega al lote. **No al abrir la pantalla.** |
| **Evento principal de adopción** | Escaneo de guía reemplazatoria **resuelto exitosamente** a la orden original de Dropi. |
| **Eventos secundarios** | Apertura del módulo · error de resolución (con carrier) · falso positivo bloqueado · duplicado evitado · uso de registro manual/override · abandono tras intento fallido. |
| **Elemento de interfaz** | El ítem del lote que muestra **"Guía reemplazatoria: &lt;número&gt;"** (ya implementado, según la descripción de PROD-1045) y el buscador que acepta cualquiera de los dos números. |
| **Soporte visual** | Captura del módulo con el ítem resuelto + el Tango, cuando esté producido. |
| **Cuenta de prueba [Beta]** | Usuario proveedor/bodega en Colombia con el beta **`return_guide`** activo, permisos de recepción sobre la bodega de prueba, y órdenes devueltas reales de las tres transportadoras. |

### 2.3 Solicitud de encuesta en Userpilot

| Campo | Respuesta |
|---|---|
| **Objetivo y decisión** | Entender si **recibir la devolución se volvió efectivamente más fácil** para quien escanea. Si la facilidad percibida no sube, el problema no era leer el código sino el flujo de recepción completo — y eso cambia la siguiente inversión del roadmap. |
| **Audiencia** | Usuarios que dispararon el evento de adopción al menos una vez, en bodegas de la cohorte activada. Incluye al operario adyacente. |
| **Disparador** | Al **cerrar el lote de recepción** en una sesión donde hubo al menos un escaneo de reemplazatoria resuelto. No por cada guía — se satura a quien procesa volumen. |
| **Pantalla / URL** | Ecom Scanner → cierre de Recepción / Gestión de devoluciones. |
| **Pregunta** | **"¿Qué tan fácil fue recibir hoy las devoluciones con guía de la transportadora?"** *(en el lenguaje del operario: no dice "guía reemplazatoria", que es jerga interna).* |
| **Tipo y opciones** | Escala 1 a 5 (1 = muy difícil, 5 = muy fácil). Si ≤3, se abre una **pregunta cerrada** de causa: *no leyó el código / decía que la guía no existe / me tocó digitarla a mano / la orden ya estaba registrada / otra*. Se prioriza respuesta cerrada; "otra" solo como complemento. |
| **Duración** | 4 semanas desde la activación de la cohorte, o hasta alcanzar la muestra mínima, lo que ocurra primero. |
| **Frecuencia** | Máximo **una vez por usuario por semana** — quien recibe devoluciones a diario se fatiga rápido. |
| **Muestra esperada** | Se define con el tamaño de la cohorte activada `[PENDIENTE DW]`. Criterio: mínimo suficiente para **leer resultado por transportadora**, no solo agregado. |

### 2.4 Solicitud a Data Warehouse

> **Petición ya redactada y lista para enviar:** [`../ecom-scanner/peticion-data-adopcion-ecom.md`](../ecom-scanner/peticion-data-adopcion-ecom.md) — los puntos 2 y 3 corresponden a este lanzamiento.
> Destinatarios: **Luis (Data)** (canal de `cerebro/peticion-data-luis-26jul.md`) y/o **Miguel Á. (Data)**, dueño de los exports de la célula según `estrategia/roadmap-q3-logistica.md`.

| Campo | Respuesta |
|---|---|
| **Pregunta a responder** | (1) ¿A cuántos proveedores/bodegas les pasa y con qué frecuencia? (2) **¿Qué porcentaje de las devoluciones llega con guía reemplazatoria, por transportadora?** (3) ¿Cuál es la cobertura actual de registro de recepción de devoluciones en Ecom? |
| **Métricas** | • Proveedores/bodegas activos con ≥1 devolución de INTER/COORD/TCC.<br>• % de esos que hoy registran recepción en Ecom.<br>• **% de devoluciones con guía reemplazatoria, por transportadora** — es la cifra que dimensiona el problema.<br>• Cobertura de recepción registrada: devoluciones con evento de recepción / devoluciones físicas.<br>• Volumen mensual de devoluciones por transportadora, Colombia. |
| **Segmentos y países** | Colombia. Segmentar por **transportadora** (Interrapidísimo, Coordinadora, TCC, y el resto como control), por **tipo de proveedor** (no verificado / verificado / premium / premium exclusivo) y por **bodega**. |
| **Periodo** | Últimos 6 meses cerrados, con corte declarado. **Excluir meses incompletos** — regla propia de la célula (mayo-2026 no es citable por cierre incompleto). |
| **Campos especiales** | ID de usuario, ID de bodega, ID de orden, transportadora, estado de la orden, fecha de devolución, fecha de recepción registrada. Al repo y a Confluence solo van **agregados**, nunca datos personales ni operativos sensibles. |
| **Entrega esperada** | **Consulta o tabla agregada reutilizable**, no un Excel de una sola vez: hay que repetir la medición semana a semana durante el following. |
| **Actualización** | Semanal durante las 12 semanas de following; luego mensual. |
| **Fecha requerida** | **Antes de T0**, para llegar al lanzamiento con línea base y con el tamaño de público resuelto. Es la única dependencia de este documento que no está en manos de TI. |

---

## 3 · Estrategia de lanzamiento

| Campo | Respuesta |
|---|---|
| **Modalidad de salida** | **Por fases, con activación por transportadora y bodega**, partiendo del beta `return_guide` que ya existe. Por fases y no general porque permite **leer el resultado por carrier** — cada transportadora tiene su propio patrón e integración, y un problema en una no debe obligar a apagar las tres. Es también lo que produce la evidencia del following. |
| **Primera audiencia** | Bodegas y proveedores **que ya usan Ecom Scanner** y reciben devoluciones de las transportadoras habilitadas. Criterio de entrada exacto: bodega con ≥1 recepción registrada en Ecom en los últimos 30 días **y** ≥1 devolución de INTER/COORD/TCC en el mismo periodo.<br>**Por qué empezar por quien ya escanea:** aquí se mide **la capacidad**, no la adopción de la herramienta. Mezclar ambas poblaciones hace ilegible el resultado — la adopción se ataca en el lanzamiento hermano. |
| **Orden de apertura** | **Fase 1 · T0 → T0+2 sem** — cohorte acotada de bodegas con instrumentación activa. Entran las transportadoras que TI confirme verificadas en producción; el criterio es *verificada*, no *desarrollada*.<br>**Fase 2 · T0+2 → T0+5 sem** — ampliación a todas las bodegas de esas transportadoras, si la cobertura de lectura se sostiene y los falsos positivos no suben.<br>**Fase 3 · T0+5 → T0+8 sem** — apertura de las transportadoras restantes, cada una tras su verificación.<br>**Fase 4 · T0+8 sem** — general, con la decisión registrada por carrier.<br>*(T0 = confirmación de cierre técnico por parte de TI.)* |
| **Objetivo del lanzamiento** | **Descubrimiento + primera prueba.** Que quien recibe devoluciones se entere de que ya puede escanear la guía de la transportadora, y lo pruebe. No es migrar un flujo ni recuperar uso: es que se conozca una capacidad que ya está ahí. |
| **Mensaje de valor** | **"Ya no tienes que levantar el sticker: escanea la guía de la transportadora y Dropi encuentra tu orden."** Una sola idea. No enumerar transportadoras ni hablar de patrones — eso es jerga interna. |
| **Canales** | **1 · Dentro del producto — canal principal, no secundario.** Banner/tooltip contextual en el módulo de recepción, en el momento en que va a escanear. Es el único canal que alcanza al operario de bodega, que no está en redes.<br>**2 · WhatsApp y correo** al proveedor titular de la cuenta.<br>**3 · Academy** — el paso a paso.<br>**4 · Capacitación existente de Ecom Scanner** (agendamiento por Calendly) — ya existe y tiene demanda: se reutiliza en vez de crear un canal nuevo.<br>**5 · Soporte / SAC** con guion. |
| **Educación necesaria** | **Sí: un paso a paso corto en Tango.** Es entregable declarado de PROD-1045 (*"Comunicarlo a los usuarios según el tipo, video en Tango, beneficios y activar el beta"*). Debe cubrir tres cosas: qué es la etiqueta pegada encima, que se escanea directo, y qué hacer si el sistema no la reconoce. **Prepara:** Laura Torres. **Insumos de contenido:** Juan. |
| **Acompañamiento de Soporte / SAC** | **Dudas esperadas y respuesta:** *"escaneé y me dice que la guía no existe"* → verificar transportadora habilitada en la fase vigente; *"me la bloqueó y la guía es válida"* → posible falso positivo, escalar con el número; *"la orden ya estaba registrada"* → **no es error**, es la deduplicación funcionando.<br>**Cambio de proceso:** el operario deja de levantar el sticker.<br>**Ruta de escalamiento:** soporte identifica primero la transportadora — sin ese dato el caso no es diagnosticable.<br>**Requisito operativo:** tener documentado el **override / registro manual** para desatascar un caso puntual sin frenar la recepción del lote. |

---

## 4 · Launch Tier

**Tier 1 · Mejoras continuas.**

Es una **mejora importante sobre algo que ya existe** (Ecom Scanner) que **necesita descubrimiento y educación** — la definición literal del tier. El público es acotado y no cambia el modelo de trabajo de nadie: cambia un paso dentro de un flujo que ya hacen a diario. Trabajo requerido: generar descubrimiento + tutorial en Academy.

**El lanzamiento hermano sí es Tier 2:** el push de adopción de Ecom Scanner hacia quienes no lo usan mueve otra población, y exige segmentación, experimentos y medición de adopción → [`../ecom-scanner/lanzamiento-adopcion-e2e.md`](../ecom-scanner/lanzamiento-adopcion-e2e.md).

**La estrategia es encadenarlos:** esta capacidad es la prueba concreta de que la herramienta mejoró, y por eso es el mejor argumento de venta del push que viene después. Separarlos no es burocracia: en un solo documento, el Target, el evento de valor y la línea base no cuadran entre sí.

---

# 🫀 Following

## 3.1 TARS simplificado

| Campo | Respuesta |
|---|---|
| **T — Target** | Proveedores y bodegas **activos y elegibles**: con al menos una devolución de las transportadoras habilitadas en la fase vigente, en Colombia, durante el periodo. **Fuente:** Data Warehouse (2.4). **Corte:** el del entregable de DW. `[PENDIENTE DW]` |
| **A — Evento de adopción** | **La primera guía reemplazatoria escaneada y resuelta exitosamente a la orden original.** No es abrir el módulo, ni ver el banner, ni completar el tutorial. |
| **A — Fórmula y meta** | `Bodegas/proveedores elegibles activados que resuelven ≥1 guía reemplazatoria / Bodegas-proveedores elegibles activados × 100`.<br>**Periodo:** 4 semanas desde la activación de cada cohorte. **Línea base: 0%** — la capacidad es nueva para el usuario, nadie la ha usado todavía de forma medida. **Meta:** se fija con la entrega de DW, a partir del tamaño de la cohorte y de la incidencia real de guías reemplazatorias. **No se pone un 30/50/80% por defecto** — la regla del formato lo prohíbe y aquí la meta sale de la línea base, no de la costumbre. |
| **R — Acción recurrente** | La misma: seguir resolviendo guías reemplazatorias en jornadas posteriores. Es la señal de que se incorporó al hábito y no fue una prueba única. |
| **R — Frecuencia natural** | **Diaria.** Una bodega recibe devoluciones todos los días hábiles: la ventana de retención se lee en días y semanas, no en meses. |
| **R — Medición y meta** | % de adoptantes que vuelven a resolver ≥1 guía reemplazatoria en la **segunda** y **tercera semana** tras su primera vez. Meta con la línea base.<br>**Señal a vigilar:** si la recurrencia cae mientras el volumen de devoluciones se mantiene, es indicio de un problema en producción (patrón, carrier o permisos), no de desinterés — y se revisa antes de tocar la comunicación. |
| **S — Pregunta de facilidad** | **"¿Qué tan fácil fue recibir hoy las devoluciones con guía de la transportadora?"** (escala 1–5; detalle en 2.3). |
| **S — Muestra y meta** | Muestra mínima que permita **leer por transportadora**, no solo agregado `[PENDIENTE DW]`. La meta se fija con la primera medición. |

## 3.2 Impacto y protección

| Campo | Respuesta |
|---|---|
| **Métrica de negocio** | **Cobertura de recepción de devoluciones registrada en Ecom**: devoluciones recibidas físicamente que quedan registradas con su evento de recepción, sobre el total de devoluciones de la cohorte. Es lo que conecta esta capacidad con el North Star de la célula. |
| **Línea base** | `[HECHO]` *"de 412 devoluciones solo 27 registran la recepción — 6 de cada 100"* (`hub/.../normalizacion-estados-data.ts`) — **muestra pequeña y sin corte declarado: sirve como orden de magnitud**. La línea base formal se calcula con la entrega de DW antes de activar la primera cohorte. Contexto de volumen: `[HECHO]` 26,04% de las órdenes movilizadas se devuelven (abril-2026, mes cerrado, Power BI). |
| **Meta y plazo** | Se define contra la línea base de DW. **Evaluación a 12 semanas** desde la activación de la primera cohorte: mes 1 seguimiento **semanal**, mes 2 **quincenal**, mes 3 **mensual**. |
| **Métrica de protección** | Tres señales que **no deben empeorar**: (1) **falsos positivos** — guías válidas bloqueadas por cumplir patrón; (2) **errores de resolución** (4xx/5xx/timeout de `dropi-logistic`); (3) **contactos a soporte** por recepción de devoluciones. Las tres están instrumentadas en 2.1. |
| **Regla de decisión** | **Ampliar** si la cobertura de lectura se sostiene por transportadora y las tres métricas de protección quedan planas o mejoran → siguiente fase de apertura.<br>**Sostener y reforzar comunicación** si la adopción es baja pero no hay error técnico → el problema es de descubrimiento: se refuerza el canal in-app antes de ampliar.<br>**Corregir por carrier** si suben falsos positivos o errores en una transportadora → se ajusta esa cobertura, sin tocar las demás.<br>**Pausar por carrier** si la resolución falla de forma sistemática en una → se apaga esa y siguen las otras.<br>**Toda decisión se registra por carrier, con fecha y responsable.** |

## 3.3 Plan de seguimiento de 12 semanas

| Periodo | Cadencia | Foco |
|---|---|---|
| **Mes 1** (sem 1–4) | Semanal | Funnel de la cohorte: cuántos entran al módulo → cuántos escanean una reemplazatoria → cuántos la resuelven. Errores por transportadora. Primeros resultados de la encuesta. ¿El banner in-app está generando primeras pruebas o se ignora? |
| **Mes 2** (sem 5–8) | Quincenal | Recurrencia semana 2 y 3. Comparación de cobertura entre bodegas activadas y no activadas. Falsos positivos y casos escalados a soporte: ¿de qué naturaleza son? Decisión de apertura de fase 3. |
| **Mes 3** (sem 9–12) | Mensual | Impacto en la métrica de negocio vs. línea base. Lectura de la encuesta por transportadora. **Decisión registrada por carrier** y cierre del following con recomendación: ampliar, sostener o iterar el flujo de recepción. |

---

## 5 · Dependencias antes de T0

Lo que hay que tener confirmado para apretar el botón. Las primeras cinco son de TI y ya están en curso; las tres últimas son de Producto y se resuelven en paralelo con este documento.

| # | Dependencia | Responsable |
|---|---|---|
| 1 | Cierre de los pendientes técnicos de [TECH-480](https://dropi-it.atlassian.net/browse/TECH-480): BFF, exportaciones masivas, persistencia desde Devolutions, migración versionada de `guide_replacements` y pruebas de volumen >500 guías | TI |
| 2 | Ejecución del test-plan de [DROP-25614](https://dropi-it.atlassian.net/browse/DROP-25614) (50 casos) | TI |
| 3 | **Verificación en producción de cada transportadora**, una por una — define qué entra en la fase 1 | TI + Ops |
| 4 | Cierre de [STID-6847](https://dropi-it.atlassian.net/browse/STID-6847) (recepción Coordinadora) | TI + Soporte |
| 5 | Override / ruta degradada operativa para desatascar un caso sin frenar el lote | TI + Producto |
| 6 | **Instrumentación de 2.1 y 2.2 activa** — sin esto el following no existe | Producto + Data |
| 7 | **Entrega de DW (2.4)** — da el tamaño de público, la línea base y la cifra citable | Data |
| 8 | **Tango y pieza de comunicación** publicados | Laura Torres (PROD-1045) |

> **Cómo usar esta tabla:** T0 se declara cuando 1–5 estén confirmadas. Las de Producto (6–8) deben estar listas **antes** de T0, no después — son las que permiten demostrar que el lanzamiento funcionó. La #7 es la más adelantada en el tiempo: conviene enviarla ya, porque de ella sale la meta.

---

## 6 · Changelog

- **2026-09-01** — Documento creado para diligenciar la pestaña de Estrategia de Lanzamiento y Following del formato E2E. Plan construido sobre el supuesto de que TI cierra los pendientes técnicos, con fechas relativas a T0 para no depender de una fecha de calendario aún inexistente. Incluye el catálogo de eventos y el TARS que faltaban, la solicitud a DW y el plan de 12 semanas. Cifras de gravedad reencuadradas con su denominador correcto. Jira leído sin escribir, por decisión de Juan para esta iniciativa.
