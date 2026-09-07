# Petición de data — Adopción de Ecom Scanner y guías reemplazatorias

**Para:** Luis (Data) / Miguel Á. (Data) · **De:** Juan Diego Bautista, PM Logistic Success
**Fecha:** `[por definir al enviar]` · **Corte del documento:** 2026-09-01

Una sola petición para dos lanzamientos que dependen del mismo dato de base: el push de adopción de Ecom Scanner y el lanzamiento de la lectura de guías reemplazatorias. Están ordenados por lo que más desbloquea, no por proyecto: **si solo alcanza para una cosa, que sea la #1**.

| # | Qué | Para qué | Por qué desbloquea |
|---|---|---|---|
| 1 | **Cobertura de captura por proveedor** — % de guías elegibles con ≥1 estado Ecom | Adopción Ecom Scanner | Es la partición "usa / no usa". **Hoy no podemos responder cuántos proveedores usan la herramienta.** Sin esto no hay Target ni línea base y el push sale a ciegas |
| 2 | **% de devoluciones que llegan con guía reemplazatoria, por transportadora** | Guías reemplazatorias | Convierte en hecho (o tumba) la cifra que estamos usando verbalmente para dimensionar el problema. Sin esto no podemos poner una cifra en ninguna comunicación |
| 3 | **Cobertura de recepción de devoluciones** registrada en Ecom | Ambos | Es la métrica de negocio del lanzamiento de guías reemplazatorias. Hoy solo tenemos una muestra chica sin corte (27 de 412) |
| 4 | **Fuga de estado**: guías con estado Ecom sin el siguiente estado esperado | Adopción | Distingue "no captura" de "captura a medias" — son dos problemas distintos con dos soluciones distintas |
| 5 | **Resultado con Ecom vs sin Ecom** (entrega/devolución y tiempo al 1er estado carrier) | Adopción | Es el argumento para pedirle a un proveedor que cambie su rutina. Sin esto solo tenemos una petición, no una razón |

---

## Definiciones que hay que fijar antes de correr nada

Estas tres definiciones son de producto, no de data, y las fijo yo — las escribo aquí para que no queden a interpretación:

- **Guía elegible:** guía que *debería* tener al menos un estado Ecom, porque su ruta física pasa por un punto donde se escanea (despacho de proveedor, bodega Dropi o PAU). Si un flujo no pasa por ningún punto de escaneo, no cuenta en el denominador.
- **Estado Ecom:** cualquiera de los eventos que captura la herramienta — *Preparado para transportadora · Entregado a transportadora (separando origen: proveedor vs bodega Dropi) · Recibido PAU · Recogido Dropi · En bodega Dropi* (`conocimiento/temas/08`).
- **Adopción:** **% de guías elegibles con ≥1 estado Ecom**, por proveedor. **No** es cantidad de escaneos, ni usuarios creados, ni manifiestos impresos — el propio MVP de métricas advierte que el volumen de escaneos *"sube sin mejorar entrega"*.

---

## 1 · Cobertura de captura por proveedor *(la más importante)*

**Pregunta:** ¿quiénes usan Ecom Scanner y quiénes no, y cuánto volumen representa cada grupo?

- **Grano:** proveedor × mes (y, si se puede, proveedor × bodega × mes).
- **Periodo:** últimos 6 meses **cerrados**, con fecha de corte declarada. Excluir meses incompletos — por regla propia de la célula mayo-2026 no es citable.
- **País:** Colombia.
- **Columnas esperadas:** id de proveedor · tipo de proveedor (no verificado / verificado / premium / premium exclusivo) · bodega · guías elegibles · guías con ≥1 estado Ecom · **cobertura %** · órdenes totales del proveedor en el periodo.
- **Cortes adicionales:** por **transportadora** y por **ruta física** (ruta-Dropi vs proveedor-directo). El reparto ruta-Dropi va de 18% a 70% según carrier, así que agregar sin ese corte esconde el patrón.

**Lo que necesito leer de aquí:** la distribución, no el promedio. Cuántos están en 0%, cuántos a medias, cuántos completos — y **cuánto volumen de órdenes hay en cada grupo**, para elegir la cohorte donde el mismo esfuerzo mueve más órdenes.

## 2 · Incidencia de guías reemplazatorias

**Pregunta:** de las devoluciones que llegan físicamente, ¿qué porcentaje trae una guía reemplazatoria pegada encima de la guía original de Dropi?

- **Grano:** transportadora × mes.
- **Transportadoras:** Interrapidísimo, Coordinadora, TCC — **y el resto como control**, para saber si el problema está acotado a esas tres o es general.
- **Patrones de referencia** (por si sirven para identificarlas en data): Interrapidísimo `300` + 10 dígitos · Coordinadora `39` + 9 dígitos · TCC `6` + 8 dígitos.
- **Columnas esperadas:** transportadora · mes · devoluciones totales · devoluciones con guía reemplazatoria identificada · **% incidencia**.

**Por qué la pido explícitamente:** estamos usando de forma verbal una cifra de "la mitad de las devoluciones" que **no está medida en ningún lado**. O la confirmamos con este dato, o la dejamos de usar. No quiero que salga en una comunicación y después no la podamos sostener frente a Operaciones.

## 3 · Cobertura de recepción de devoluciones

**Pregunta:** ¿qué porcentaje de las devoluciones que vuelven queda registrado con su evento de recepción?

- **Grano:** bodega × transportadora × mes.
- **Columnas esperadas:** devoluciones que retornan · devoluciones con evento de recepción registrado · **cobertura %**.
- **Contexto de volumen ya conocido:** 26,04% de las órdenes movilizadas se devuelven (abril-2026, mes cerrado). Lo que falta es qué parte de eso queda registrado.

## 4 · Fuga de estado

**Pregunta:** ¿cuántas guías tienen un estado Ecom pero nunca registran el siguiente estado esperado dentro del SLA?

- **Grano:** proveedor × estado de origen × mes.
- **Por qué importa:** una guía que entra a Ecom y se queda ahí es peor que una que nunca entró — genera la ilusión de trazabilidad. Es la fuga que el MVP de métricas señala como *la clave*.

## 5 · Resultado con Ecom vs sin Ecom

**Pregunta:** ¿las guías capturadas en Ecom terminan mejor que las que no?

- **Métricas:** tasa de entrega, tasa de devolución, tiempo hasta el primer estado de transportadora.
- **Comparación:** guías con ≥1 estado Ecom vs guías elegibles sin ningún estado Ecom.
- ⚠️ **Control obligatorio:** por **proveedor, ciudad, transportadora, producto y periodo**. El propio documento de métricas advierte que comparar sin controlar *"da conclusiones falsas"* — las guías comparadas tienen que parecerse lo más posible. Si no se puede controlar bien, **prefiero no tener el dato a tener uno que nos lleve a la decisión equivocada**.

---

## Formato de entrega

- **Consulta o tabla agregada reutilizable**, no un Excel de una sola vez: necesito repetir la medición **semanalmente durante 12 semanas** de following, y después mensual.
- **Solo agregados.** No copiar al repo ni a Confluence órdenes, guías, usuarios ni cifras de producción con identificadores. Lo que se documenta es la síntesis.
- Si alguna de las cinco no se puede responder con los datos actuales, **prefiero saberlo explícitamente** a recibir una aproximación sin nota — esa aproximación termina convertida en meta de un lanzamiento.

## Qué se desbloquea con cada una

| Dato | Qué destraba |
|---|---|
| #1 | Target y línea base del push de adopción · elección de cohorte piloto · [`lanzamiento-adopcion-e2e.md`](lanzamiento-adopcion-e2e.md) bloques 1.1, 2.4 y TARS |
| #2 | La cifra de gravedad de [`../guias-reemplazatorias/lanzamiento-e2e.md`](../guias-reemplazatorias/lanzamiento-e2e.md) · el mensaje de la campaña |
| #3 | Métrica de negocio y línea base del lanzamiento de guías reemplazatorias |
| #4 | Distingue problema de comunicación vs problema de producto |
| #5 | El argumento comercial del push |

## Changelog

- **2026-09-01** — Petición redactada. Nace de los bloques 2.4 de los dos documentos de lanzamiento. Pendiente: Juan define fecha requerida y destinatario final antes de enviar.
