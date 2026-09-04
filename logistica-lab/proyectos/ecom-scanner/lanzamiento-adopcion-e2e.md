# Estrategia de Lanzamiento y Following · Push de adopción de Ecom Scanner

> **Qué es este archivo.** Insumo interno para la pestaña **🫀 Estrategia de Lanzamiento** + **🫀 Following** del formato oficial *"Proyectos E2E - Formato de documentación"* ([plantilla](https://docs.google.com/document/d/1pw2H33wc4jGrHRFNLdyl6U4M7sXu76FLzkIlhQX9DZg/edit)), aplicado al **push de adopción** de la herramienta — distinto del lanzamiento de la capacidad de guías reemplazatorias ([`../guias-reemplazatorias/lanzamiento-e2e.md`](../guias-reemplazatorias/lanzamiento-e2e.md)).
> **Base de conocimiento:** [`sintesis.md`](sintesis.md). **Ley:** `metodologia/spec-driven.md`.
> **Restricción de esta iniciativa (Juan, 01-sep-2026):** Jira solo lectura. No se crean, comentan ni vinculan tickets.
> **Corte:** 2026-09-01.

> ### Supuesto de trabajo y secuencia
> Este documento se prepara **en paralelo** al lanzamiento de la capacidad de guías reemplazatorias, para tenerlo listo cuando esa salga. **Se lanza después**, usando la capacidad nueva como gancho: *"la herramienta mejoró, y esto es lo que ahora resuelve"*.
> **La pieza que hay que resolver primero es el baseline.** Hoy la pregunta *"¿cuántos proveedores usan Ecom Scanner?"* no tiene respuesta con dato — la instrumentación no existe todavía (`_fuentes-userpilot-logistica.md` solo registra *"una matriz de eventos preparada para adaptar a Userpilot"*, clasificada como *"antecedente de instrumentación; no outcome"*), y los tres tickets de adopción (`PRM-1272`, `PRM-1342`, `PRM-1344`) siguen en *Inv. y definición*. Por eso **el bloque 2.4 es el primer paso de ejecución de este plan, no un anexo**: de ahí salen el Target, la línea base y la meta.

---

# 🫀 Estrategia de Lanzamiento

## 0 · Datos generales

| Campo | Respuesta |
|---|---|
| **Nombre del proyecto** | Push de adopción de Ecom Scanner |
| **Célula / módulo** | Logistic Success (Ecom) · Ecom Scanner (Salidas, Devoluciones, Inspección de devoluciones dañadas) |
| **PM / PO responsable** | Juan Diego Bautista Vásquez |
| **Tipo de lanzamiento** | **Push de adopción** (la funcionalidad ya existe; lo que falta es uso) |
| **Fecha estimada en producción** | N/A — la herramienta ya está en producción, marcada **Beta** en el sidebar (`conocimiento/temas/11`). La fecha relevante es la del **arranque del push**: **al cierre de la fase 2 del lanzamiento de guías reemplazatorias**, con la entrega de DW (2.4) ya en mano. |
| **Roles incluidos** | Proveedores (todas las categorías), Sellers Proveedores, Marcas propias. Ejecutan además: operarios de bodega Dropi y PAU. |
| **Países incluidos** | Colombia en fase 1. Expansión a otros países solo después de tener lectura de resultado en CO. |
| **Links principales** | [Kickoff PLG Ecom Scanner](https://docs.google.com/document/d/1s8dHFxLIZhE8c5fNR2RaXmhfiTvugk-tF1Kt6vt5N_k/edit) · Síntesis repo: `logistica-lab/proyectos/ecom-scanner/sintesis.md` · Métricas MVP: `conocimiento/temas/08-mvp-ecom-scanner-metricas.md` · Jira (lectura): [PRM-1272](https://dropi-it.atlassian.net/browse/PRM-1272) · [PRM-1342](https://dropi-it.atlassian.net/browse/PRM-1342) · [PRM-1344](https://dropi-it.atlassian.net/browse/PRM-1344) · [PRM-1287](https://dropi-it.atlassian.net/browse/PRM-1287) · Precedente metodológico: [DROP-23525](https://dropi-it.atlassian.net/browse/DROP-23525) · [DROP-23526](https://dropi-it.atlassian.net/browse/DROP-23526) · Carpeta Drive: [Ecom scanner](https://drive.google.com/drive/folders/1SE466V4OR2vSSHw7VOu_RvSbzjNPPA7c) |

---

## 1 · Estrategia de la funcionalidad

### 1.1 Población y valor para el usuario

| Campo | Respuesta |
|---|---|
| **Usuario principal** | **Proveedores, Sellers Proveedores y Marcas propias que hoy NO capturan sus eventos físicos en Ecom Scanner** (o los capturan de forma parcial), pese a ser elegibles. Identificable en datos: usuario con rol proveedor/marca, con órdenes despachadas en el periodo, **con 0 o pocos estados Ecom sobre guías elegibles**. |
| **¿Se aplica para marcas blancas?** | **Sí.** La captura del evento físico es independiente de la marca del portal. |
| **Usuario adyacente** | **Operario de bodega Dropi y PAU.** Ejecuta el escaneo pero no decide adoptarlo; **no se le alcanza por redes ni campañas**. Se le llega dentro de la plataforma, en el momento de trabajo. |
| **Quién queda fuera** | **Dropshippers** (no tocan el paquete; consultan en Dropi web), **líderes de comunidad**, **Admin CAS**. |
| **Tamaño del público** | `[PENDIENTE DW — bloque 2.4]`. Se necesita la partición **"usa / no usa"** que pidió Juan, medida como % de guías elegibles con ≥1 estado Ecom por proveedor (métrica de cobertura del tema 08). **Sin este número no arranca el push.** |
| **Problema principal** | El proveedor no registra el evento físico de sus órdenes en Ecom Scanner, así que **Dropi pierde la trazabilidad de dónde está el paquete** — y el proveedor pierde la evidencia de que sí despachó. |
| **Frecuencia del problema** | **Diaria.** Ocurre en cada jornada de despacho y de recepción. |
| **Gravedad** | **Media-alta.** No bloquea la operación del proveedor (puede despachar sin escanear), pero **degrada todo lo que depende de la trazabilidad**: la orden queda invisible para el dropshipper, la métrica logística no es confiable y el proveedor no tiene con qué defenderse en una disputa. La alternativa existe pero es peor: operar a ciegas. |
| **Alternativa actual** | **No registrar**, o registrar desde Dropi web de forma manual y tardía. `[HECHO]` La huella de esto ya está en la data: *"de 412 devoluciones solo 27 registran la recepción — 6 de cada 100"* (`hub/src/app/proyectos/logistica/_lib/normalizacion-estados-data.ts`) y aparecen *paquetes "sin movimientos"* y *estados con typos* (`[CONFIRMADO]` en el kickoff PLG). |
| **Valor para el usuario** | *"Esta funcionalidad ayuda al **proveedor y a quien opera su bodega** a **dejar registrado lo que despacha y lo que recibe, en el momento en que ocurre**, sin **tener que acordarse después ni justificarlo cuando le reclamen**."* |
| **Acción de valor** | **El primer estado Ecom registrado sobre una guía elegible.** No es crear el usuario, no es entrar al módulo, no es completar la capacitación. |
| **Insights importantes u otra información de apoyo** | • `[HECHO]` Escala: **>25M eventos en 60 días**; dos rutas conviven (**Recogido 14,3M > Bodega 9,6M**); reparto ruta-Dropi **18–70% según carrier** (kickoff PLG, abril-2026).<br>• `[CONFIRMADO]` **"Más escaneos no se asocian a mejor entrega"** — por eso el push **no** se mide en escaneos.<br>• `[HIPÓTESIS del kickoff, a validar]` Las tres razones por las que la herramienta se usaría bien sola: **Velocidad, Confianza, Claridad**. Si el push empuja adopción sin resolver estas tres, se rompe la lógica PLG: *"si se optimiza el número de Dropi a costa de la experiencia del operario, la adopción correcta también se rompe"*.<br>• **Ya existe un canal de capacitación de Ecom Scanner con demanda** (agendamiento por Calendly). Nadie mide si pasar por él cambia la cobertura de captura. |
| **¿Qué tan grande debe ser el lanzamiento?** | Ver bloque 4 · **Tier 2**. |

### 1.2 Valor para el negocio

| Campo | Respuesta |
|---|---|
| **Tipo de impacto** | **Ofensivo en su efecto, defensivo en su origen.** Se declara **ofensivo**: más cobertura de captura habilita decisiones logísticas que hoy no se pueden tomar (ruteo por carrier, tiempos por fase, prevención de novedad), que es donde está el crecimiento del KR de entrega. |
| **KPI / OKR relacionado** | **North Star de la célula: ⬆️ movilización + ⬆️ % de entrega.** Indicador propio: **cobertura de captura** = % de guías elegibles con ≥1 estado Ecom. Es además **habilitador** de la torre de control de tiempos por fases y de la homologación de estados (`PRM-1297`). |
| **Importancia estratégica** | **Alta.** Ecom Scanner es una de las **dos líneas de producto de la célula** — el direccionamiento del semestre nombra a la célula *"Logistic Success (+EcomScanner)"*. Y sin captura confiable, **todas las métricas logísticas de la célula se apoyan en datos incompletos**. Este push no es un feature: es la base sobre la que descansa el resto del roadmap. |
| **Objetivo de la funcionalidad** | Que los proveedores elegibles que hoy no capturan pasen a registrar sus eventos físicos de forma sostenida, sin que eso les cueste tiempo. |
| **Hipótesis** | *"Si le mostramos a **los proveedores y bodegas elegibles que hoy no capturan** que **Ecom Scanner ya resuelve el caso que más les dolía —recibir una devolución sin levantar el sticker—**, entonces **empezarán a registrar sus eventos físicos y sostendrán el hábito**, porque **la herramienta deja de estorbar y les da evidencia de lo que hicieron cuando les reclaman**."*<br>**Sabremos que es verdad cuando** la cobertura de captura de la cohorte impactada suba de forma sostenida frente a una cohorte comparable no impactada, en el mismo periodo, controlando por transportadora y volumen. |

---

## 2 · Configuración operativa

### 2.1 Fuentes y eventos a instrumentar

| Qué necesitamos saber | Acción o señal | Fuente |
|---|---|---|
| ¿Quién es elegible y no captura? | Guía despachada/devuelta **sin ningún estado Ecom** asociado, por proveedor y bodega | Data Warehouse |
| **¿Adoptó?** (evento de valor) | **Primer estado Ecom registrado** sobre una guía elegible, por usuario/bodega | Backend |
| ¿Sostiene el hábito? | Estados Ecom registrados por semana, por bodega | Backend / DW |
| ¿Dónde se traba? | Escaneo con error, reintento, abandono del flujo, tiempo entre pasos | Frontend + Backend |
| ¿Hay fuga de estado? | Guía con estado Ecom **sin el siguiente estado esperado** dentro del SLA *(la fuga clave del tema 08)* | Data Warehouse |
| ¿La captura mejora el resultado? | Tasa de entrega/devolución y tiempo al 1er estado carrier, **con Ecom vs sin Ecom**, controlando por proveedor/ciudad/carrier/producto/periodo | Data Warehouse |
| ¿La capacitación sirve? | Paso por capacitación (Calendly/Academy) cruzado con cobertura antes y después | Userpilot + DW |
| ¿Vieron el mensaje? | Impresión y clic del banner/tooltip in-app en el módulo | Userpilot |

> **Regla dura, del tema 08:** *"**No medir Ecom por cantidad de escaneos**"*. Prohibido como métrica de éxito: total de escaneos, usuarios creados, cantidad de alertas, manifiestos impresos, pantallas/clics.
> ⚠️ **Cuidado de atribución declarado en el mismo documento:** comparar con-Ecom vs sin-Ecom sin controlar variables *"da conclusiones falsas"*. La comparación debe hacerse entre guías lo más similares posible.

### 2.2 Solicitud de tracking en Userpilot

| Campo | Respuesta |
|---|---|
| **Objetivo del tracking** | Saber si el mensaje in-app produce **la primera captura** y si esa captura se sostiene. Decisión que permite: escalar el push a más cohortes, cambiar el mensaje, o concluir que el problema no es de comunicación sino de fricción del flujo. |
| **Audiencia** | Proveedores/bodegas elegibles con cobertura de captura baja o nula, **más el operario** que ejecuta en su bodega. |
| **Pantalla o URL** | Ecom Scanner — módulos Salidas y Devoluciones `[PENDIENTE — rutas exactas con Front]`. Y el **Inicio de la plataforma**, donde ya se listan las capacitaciones (`temas/11`). |
| **Momento del flujo** | Al entrar al módulo con guías elegibles pendientes de captura — no al azar en el home. El mensaje debe llegar **cuando hay algo que escanear**. |
| **Evento principal de adopción** | Primer estado Ecom registrado sobre una guía elegible. |
| **Eventos secundarios** | Impresión y clic del banner · inicio y finalización del tour · agendamiento de capacitación · error de escaneo · abandono tras error. |
| **Elemento de interfaz** | Banner/tooltip contextual en el módulo + entrada a capacitación desde el Inicio. Copys en el bloque 3. |
| **Soporte visual** | `[PENDIENTE]` — requiere Figma o captura del módulo; hoy el inventario de UI del repo solo tiene la vista dropshipper (`temas/11`). |
| **Cuenta de prueba [Beta]** | Usuario proveedor CO con bodega asociada y guías elegibles reales, con permisos de captura. |

### 2.3 Solicitud de encuesta en Userpilot

| Campo | Respuesta |
|---|---|
| **Objetivo y decisión** | Saber si capturar le resulta **rápido y claro** a quien lo hace. Si no lo es, el push está empujando a la gente hacia una herramienta que estorba — y lo correcto sería frenar el push y arreglar el flujo primero (es la advertencia PLG explícita del kickoff). |
| **Audiencia** | Usuarios que registraron al menos un estado Ecom en la semana. |
| **Disparador** | Al cerrar la jornada de captura / cerrar el lote. |
| **Pantalla / URL** | Ecom Scanner, al finalizar Salidas o Devoluciones. |
| **Pregunta** | **"¿Qué tan fácil fue registrar hoy tus paquetes?"** |
| **Tipo y opciones** | Escala 1–5. Si ≤3, pregunta cerrada de causa: *me tomó demasiados pasos / el sistema se demoró / no sabía qué estado marcar / me dio error / otra*. Las tres primeras opciones mapean 1:1 a **Velocidad, Velocidad y Claridad** — así la encuesta valida o tumba las hipótesis de valor del kickoff, no solo mide humor. |
| **Duración** | 6 semanas desde el arranque del push. |
| **Frecuencia** | Máximo una vez por usuario por semana. |
| **Muestra esperada** | `[PENDIENTE DW]` — mínima que permita leer por tipo de proveedor y por bodega. |

### 2.4 Solicitud a Data Warehouse — **el primer paso real del push**

> **Petición ya redactada y lista para enviar:** [`peticion-data-adopcion-ecom.md`](peticion-data-adopcion-ecom.md). El punto #1 (cobertura de captura por proveedor) es el que destraba este lanzamiento.

| Campo | Respuesta |
|---|---|
| **Pregunta a responder** | **¿Quiénes usan Ecom Scanner y quiénes no?** Y de los que no: ¿cuánto volumen representan y en qué se diferencian de los que sí? |
| **Métricas** | • **Cobertura de captura por proveedor** = guías elegibles con ≥1 estado Ecom / guías elegibles × 100 *(la adopción real, definición del tema 08)*.<br>• Partición **usa / no usa / usa parcialmente**, con umbral explícito.<br>• Volumen de órdenes que representa cada grupo.<br>• **Fuga de estado**: guías con estado Ecom sin el siguiente estado esperado.<br>• **Resultado con Ecom vs sin Ecom** (entrega/devolución y tiempo al 1er estado carrier), controlado por proveedor, ciudad, transportadora, producto y periodo.<br>• Paso por capacitación cruzado con cobertura. |
| **Segmentos y países** | Colombia. Segmentar por **tipo de proveedor** (no verificado / verificado / premium / premium exclusivo), por **bodega**, por **transportadora** y por **ruta física** (ruta-Dropi vs proveedor-directo — el eje que el kickoff señala como el que faltaba en el modelo). |
| **Periodo** | Últimos 6 meses cerrados, con corte declarado. **Excluir meses incompletos** (regla de la célula: mayo-2026 no es citable). |
| **Campos especiales** | ID de usuario, ID de bodega, ID de orden, transportadora, tipo de proveedor, estado y timestamps de eventos Ecom. Sin datos personales en el repo: solo agregados. |
| **Entrega esperada** | **Consulta o tabla agregada reutilizable**, no un Excel de una sola vez — se necesita repetir semanalmente durante el following. |
| **Actualización** | Semanal durante las 12 semanas de following; luego mensual. |
| **Fecha requerida** | Antes de arrancar el push. `[PENDIENTE — Juan define al enviar]` Destinatarios: **Luis (Data)** (canal de `cerebro/peticion-data-luis-26jul.md`) y/o **Miguel Á. (Data)**. |

---

## 3 · Estrategia de lanzamiento

| Campo | Respuesta |
|---|---|
| **Modalidad de salida** | **Por fases, con cohortes y grupo de comparación.** No general. Un push a todos a la vez quema el mensaje y deja sin forma de saber si funcionó: sin cohorte comparable, cualquier subida se puede atribuir a estacionalidad. |
| **Primera audiencia** | Proveedores elegibles **con volumen medio-alto y cobertura de captura baja** — donde el mismo esfuerzo mueve más órdenes. Criterio exacto de entrada `[PENDIENTE DW]`: se define al ver la distribución real, no antes. |
| **Orden de apertura** | **Fase 1** — cohorte piloto acotada + cohorte de control comparable, 4 semanas.<br>**Fase 2** — si la cobertura sube y la facilidad percibida no cae, ampliar a los proveedores del mismo perfil.<br>**Fase 3** — proveedores de bajo volumen y bodegas PAU.<br>**Fase 4** — otros países, solo con resultado leído en CO. |
| **Objetivo del lanzamiento** | **Probar por primera vez** y **sostener el hábito**. No es descubrir que la herramienta existe (muchos ya la conocen): es que quien la evita empiece a usarla porque ahora le conviene. |
| **Mensaje de valor** | **"Escanea y queda registrado: si algo pasa con tu paquete, tienes con qué demostrarlo."** El ángulo es **Confianza**, no eficiencia de Dropi — es lo que el proveedor valora según el kickoff PLG. **El gancho de entrada es la capacidad nueva:** *"y ahora también lees las guías que la transportadora pega encima"*. |
| **Canales** | **1. Dentro del producto — principal.** Banner/tooltip contextual en el módulo cuando hay guías elegibles sin capturar; es el único canal que alcanza al operario.<br>**2. WhatsApp y correo** al proveedor titular, que es quien decide.<br>**3. Academy** — paso a paso.<br>**4. Capacitación existente** (Calendly Ecom Scanner) — **ya existe y tiene demanda; se reutiliza y se mide**, no se crea uno nuevo.<br>**5. Soporte/SAC** con guion.<br>**6. Comercial/KAM** para los proveedores de mayor volumen: para ellos una conversación pesa más que un banner. |
| **Educación necesaria** | **Sí.** Un paso a paso corto por módulo (Salidas y Devoluciones) — formato Tango o video breve. Debe responder la pregunta que el kickoff marca como `[CONFIRMADO]`: *"Una devolución no sé bien cómo registrarla"*. Prepara: Producto + Laura/Comunicaciones. |
| **Acompañamiento de Soporte / SAC** | Dudas esperadas: *"¿tengo que escanear todo?"*, *"¿qué pasa si me equivoco de estado?"*, *"¿puedo corregirlo?"*. **La respuesta a "¿puedo corregirlo?" hoy no está clara** — el kickoff registra *"¿Qué tan fácil es darse cuenta de un error y corregirlo?"* como pregunta abierta de discovery. **Hay que responderla antes de empujar adopción**: pedirle a alguien que capture más sin darle forma de corregir es pedirle que asuma un riesgo. |

---

## 4 · Launch Tier

**Tier 2 · Nuevas funcionalidades** — por el **trabajo requerido**, no por la novedad.

La definición del tier lo enmarca por el trabajo que activa: *"mesa estratégica: Workshop · Feature Map · segmentación · experimentos · **medir adopción**"*. Este push necesita exactamente eso: segmentación por tipo de proveedor y volumen, cohortes con grupo de comparación, y medición de adopción que hoy **no existe**.

**Por qué no Tier 1:** Tier 1 se resuelve con *"generar descubrimiento"* y un tutorial en Academy. Aquí el problema no es que la gente no sepa que Ecom Scanner existe — es que **elige no usarlo**, y eso no se resuelve informando. Tratarlo como Tier 1 es la forma más segura de gastar el mensaje sin mover la aguja.

**Por qué no Tier 3:** no es un país nuevo ni un perfil nuevo; es una herramienta existente en un mercado existente.

---

# 🫀 Following

## 3.1 TARS simplificado

| Campo | Respuesta |
|---|---|
| **T — Target** | Proveedores/bodegas **activos y elegibles** en Colombia (con órdenes despachadas o devueltas en el periodo) **cuya cobertura de captura está por debajo del umbral**. Fuente: DW, bloque 2.4. Corte: el del entregable. `[PENDIENTE DW]` |
| **A — Evento de adopción** | **Primer estado Ecom registrado sobre una guía elegible** por un proveedor/bodega que no lo hacía. No es crear usuario, no es entrar al módulo, no es asistir a la capacitación. |
| **A — Fórmula y meta** | `Proveedores objetivo activos que registran ≥1 estado Ecom / Proveedores objetivo activos × 100`. **Periodo:** 4 semanas por cohorte. **Línea base:** `[PENDIENTE DW]` — es la partición "usa / no usa" que aún no existe. **Meta:** se fija contra esa línea base y contra la cohorte de control. **No se usa un 30/50/80% por defecto** — la regla del formato lo prohíbe y aquí no hay baseline ni benchmark. |
| **R — Acción recurrente** | Seguir registrando estados Ecom en semanas sucesivas. **Es la métrica que de verdad importa:** una primera captura empujada por un banner no significa nada si la semana siguiente vuelve a cero. |
| **R — Frecuencia natural** | **Diaria** (despacho y recepción son actividades de todos los días hábiles). La ventana de retención se lee en **semanas**, no en meses. |
| **R — Medición y meta** | % de adoptantes que siguen registrando en la **semana 2** y en la **semana 3**. Meta `[PENDIENTE]`. **Señal de fracaso clara:** si la adopción sube en semana 1 y cae en semana 2, el push funcionó como recordatorio pero **la herramienta no retuvo** → el problema es de producto (Velocidad/Claridad), no de comunicación, y hay que frenar el push. |
| **S — Pregunta de facilidad** | **"¿Qué tan fácil fue registrar hoy tus paquetes?"** (1–5; ver 2.3). |
| **S — Muestra y meta** | `[PENDIENTE DW]` — muestra que permita leer por tipo de proveedor. |

## 3.2 Impacto y protección

| Campo | Respuesta |
|---|---|
| **Métrica de negocio** | **Cobertura de captura**: % de guías elegibles con ≥1 estado Ecom. Y como métrica de resultado: **tasa de entrega y tiempo al primer estado de transportadora, con Ecom vs sin Ecom**, controlada por proveedor, ciudad, carrier, producto y periodo. |
| **Línea base** | `[PENDIENTE DW]`. Lo único documentado hoy como orden de magnitud es la huella de no-captura en devoluciones: `[HECHO]` *"de 412 devoluciones solo 27 registran la recepción — 6 de cada 100"* — muestra pequeña, sin corte declarado, **no es línea base formal**. |
| **Meta y plazo** | `[PENDIENTE]` contra la línea base. Evaluación a **12 semanas**: mes 1 semanal, mes 2 quincenal, mes 3 mensual. |
| **Métrica de protección** | Tres señales que **no deben empeorar**: (1) **facilidad percibida** (SEQ) — si baja, estamos empujando a la gente hacia fricción; (2) **errores de captura y estados con typos** — más volumen de captura con más error no es adopción, es ruido; (3) **contactos a soporte** por uso del scanner. **Y una cuarta, conceptual:** que **la cantidad de escaneos no se convierta en el indicador que el equipo mira** — el tema 08 advierte que sube sin mejorar la entrega. |
| **Regla de decisión** | **Escalar** si la cobertura de la cohorte sube frente al control y la facilidad percibida se mantiene o mejora → siguiente fase.<br>**Ajustar el mensaje** si hay impresión y clic del banner pero no primera captura → el problema es el argumento, no el canal.<br>**Frenar el push y arreglar el producto** si hay primera captura pero no recurrencia, o si la facilidad percibida cae → es la advertencia PLG del kickoff: *"si se optimiza el número de Dropi a costa de la experiencia del operario, la adopción correcta se rompe"*.<br>**Pausar** si suben los errores de captura o los contactos a soporte.<br>Toda decisión se registra con fecha, cohorte y responsable. |

---

## 5 · Ideas de intervención (banco de opciones, no plan aprobado)

> Ordenadas por costo. Ninguna se ejecuta antes de tener baseline. Cada una es falsable — se puede probar en una cohorte y comparar contra control.

| # | Intervención | Ataca | Costo | Cómo se sabe si sirvió |
|---|---|---|---|---|
| 1 | **Banner contextual solo cuando hay guías elegibles sin capturar** — no un anuncio genérico en el home | Descubrimiento en el momento correcto | Bajo | Clic → primera captura en la misma sesión |
| 2 | **Usar guías reemplazatorias como gancho** — *"ahora también lees las guías que la transportadora pega encima"* | Motivación: da una razón nueva para volver a mirar la herramienta | Bajo | Adopción de la cohorte que recibió el gancho vs. la que recibió el mensaje genérico |
| 3 | **Mostrarle al proveedor su propia cobertura** — *"registraste 12 de 80 paquetes esta semana"* | Confianza y conciencia; hoy nadie sabe que está por debajo | Medio | Cambio de cobertura tras la primera exposición |
| 4 | **Medir el efecto de la capacitación que ya existe** (Calendly) antes de crear material nuevo | Educación — y evita gastar en producir lo que ya existe | Muy bajo | Cobertura antes vs. después de asistir |
| 5 | **Conversación comercial/KAM con los proveedores de mayor volumen** | Los pocos que mueven mucho: un banner no les mueve la operación, una conversación sí | Medio | Cobertura de esa lista nominal |
| 6 | **Responder "¿puedo corregir un error?"** y hacerlo visible en el flujo | Confianza — hoy es pregunta abierta del discovery | Medio (requiere producto) | Caída de estados con typos; SEQ |
| 7 | **Quitar pasos del flujo de captura** | Velocidad — la hipótesis de valor menos explorada | Alto | Tiempo por captura; SEQ; recurrencia |

> **La honesta:** las intervenciones 1 a 5 son de comunicación y se pueden hacer ya. Las 6 y 7 son de producto y probablemente sean las que de verdad mueven la aguja — pero **eso es una hipótesis del kickoff que nunca se validó con usuarios**. El discovery del kickoff PLG (Grupo 3: observación y entrevista en bodega) sigue sin hacerse. Empujar adopción sin haberlo hecho es apostar a que el problema es de comunicación.

---

## 6 · Preguntas abiertas y cómo se resuelven

Ninguna bloquea la preparación del documento; todas tienen ya un camino asignado.

| Pregunta abierta | Cómo se resuelve | Cuándo |
|---|---|---|
| ¿Cuánta gente usa hoy Ecom Scanner? | Entrega de DW, punto #1 de la petición (2.4) | Antes de arrancar el push |
| ¿Por qué los que no lo usan no lo usan? | Discovery de campo del kickoff PLG (Grupo 3: observación + entrevista en bodega), que sigue pendiente. Se puede acotar mucho **después** de ver dónde se concentra la baja cobertura en los datos | En paralelo, con la data en mano |
| ¿Sirve la capacitación que ya existe? | Cruzar asistencia (Calendly) contra cobertura antes/después — punto #4 del banco de intervenciones. Es la medición más barata de todas | Primeras 2 semanas |
| ¿El problema es de comunicación o de producto? | La regla de decisión de 3.2 está diseñada exactamente para distinguirlo: primera captura sin recurrencia = producto; sin primera captura = comunicación | Semanas 1–3 del following |
| ¿Se puede corregir un error de captura hoy? | Pregunta de discovery del kickoff (*"¿Qué tan fácil es darse cuenta de un error y corregirlo?"*). **Conviene responderla antes de empujar volumen** — pedirle a alguien que capture más sin darle forma de corregir le traslada el riesgo | Antes de fase 2 |

## 7 · Changelog

- **2026-09-01** — Documento creado. Separa el push de adopción (Tier 2) del lanzamiento de la capacidad de guías reemplazatorias (Tier 1), porque tienen población, evento de valor y baseline distintos. Se apoya en el kickoff PLG (3 hipótesis de valor), en la regla de medición del tema 08 y en la auditoría de Jira del 01-sep (tres tickets de adopción parados en *Inv. y definición*). Jira leído sin escribir, por decisión de Juan para esta iniciativa.
