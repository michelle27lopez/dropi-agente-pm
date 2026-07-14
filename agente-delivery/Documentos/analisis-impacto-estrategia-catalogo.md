# Análisis de impacto estratégico · Portafolio de oportunidades
## Supplier Success — Dropi
*Versión final · Junio 2026*

---

# Contexto del negocio

Dropi es una plataforma de dropshipping y logística que conecta suppliers (proveedores de producto) con dropshippers (vendedores online que comercializan sin tener inventario). El modelo funciona así: el dropshipper publica un producto del catálogo de Dropi, recibe el pedido del cliente final, y Dropi gestiona el despacho desde el supplier. El supplier recibe el pago descontando comisiones y logística.

Las dos métricas principales del negocio son:
- **Órdenes:** cantidad de pedidos generados y entregados
- **GMV (Gross Merchandise Value):** valor total de las ventas en pesos colombianos

El objetivo anual (OKR) es llegar a **93,600,000 órdenes por año**.

---

# Estado actual del negocio

| Métrica | Valor | Fuente |
|---------|-------|--------|
| Órdenes actuales | 3,200,000 / mes = 38,400,000 / año | Confirmado Dropi |
| Participación de suppliers | 65–70% de las órdenes | Confirmado Dropi |
| Objetivo OKR anual | 93,600,000 órdenes / año | Definido |
| Gap a cerrar | 55,200,000 órdenes / año adicionales | Calculado |
| Productos vigentes en catálogo | 1,079,982 | Confirmado Dropi |
| Productos vigentes con al menos 1 orden | 536,590 | Confirmado Dropi |
| Productos vigentes SIN ninguna orden | **679,311 (63% del catálogo activo)** | Calculado |
| Productividad promedio — producto activo | **71.6 órdenes / año** | Calculado: 38.4M / 536K |
| Conversión histórica producto → orden | 37.1% | Confirmado Dropi |
| Precio promedio por orden (sweet spot mercado) | $80,000 COP | Referencia mercado Colombia |

**El dato más relevante:** el 63% del catálogo activo — 679,311 productos — nunca ha generado una sola orden. Ahí está el potencial central de este portafolio.

---

# Marco de análisis

Cada oportunidad se analiza con la misma estructura:
1. **La palanca:** qué comportamiento cambia
2. **El universo:** a cuántos productos, suppliers o dropshippers aplica
3. **La estimación:** población afectada × tasa de conversión × productividad
4. **Efecto en órdenes**
5. **Efecto en GMV** (porque no siempre son lo mismo)
6. **Escenarios:** conservador / base / agresivo
7. **Qué valida el número**

**Aclaración importante — Órdenes ≠ GMV:**
- GMV = Órdenes × Precio promedio por orden
- Algunas oportunidades suben órdenes pero bajan el precio unitario (efecto neto en GMV puede ser neutro o negativo)
- Otras pueden subir ambas cosas simultáneamente si se diseñan bien

---

---

# OPORTUNIDAD 1
# DCA-002 · Descuentos para activar y mover catálogo

## Qué es

Una dinámica comercial donde los suppliers pueden aplicar descuentos, promociones o condiciones especiales a sus productos dentro de Dropi. El objetivo es activar productos que hoy no se venden y hacer más competitivos a los que ya venden.

## La palanca

Un descuento hace competitivo un producto que hoy no lo es frente a la competencia. En dropshipping, el dropshipper selecciona qué productos publicar basándose en margen y competitividad. Un producto con descuento tiene mayor probabilidad de ser seleccionado y publicado, lo que genera más órdenes.

Opera sobre dos universos distintos:

---

## Modelo A — Reactivar stock quieto (productos sin ninguna orden)

**Universo:** 679,311 productos vigentes que nunca han generado una orden.

No todos tienen stock disponible hoy. Se estima que el 40% sí tiene stock real (los demás pueden tener problemas de stock, ficha incompleta u otro bloqueo). De esos, un programa de descuentos llegaría a aproximadamente el 15% de los suppliers involucrados. De los que participan, se estima que el 20% convertiría al menos una orden.

| Variable | Valor | Tipo |
|----------|-------|------|
| Productos vigentes sin órdenes | 679,311 | Confirmado |
| Con stock real disponible (40%) | 271,724 | Estimado — pendiente validar con data |
| Suppliers que activarían un descuento (15%) | 40,759 | Estimado conservador |
| Productos que convertirían a ≥1 orden (20%) | **8,152** | Estimado conservador |
| Productividad año 1 — factor maduración 25% del promedio | **17.9 órdenes / año** | Basado en dato real |
| **Resultado** | **~146,000 órdenes / año** | |

**Por qué 25% de productividad en año 1:** un producto que recién entra al flujo comercial tarda en madurar. Los dropshippers lo descubren gradualmente, el algoritmo de la plataforma lo posiciona con el tiempo. El dato histórico de Dropi muestra 71.6 órdenes/año para productos activos maduros — un producto nuevo en año 1 alcanza entre el 20% y el 35% de eso.

---

## Modelo B — Lift en productos ya activos

**Universo:** 536,590 productos activos que ya generan órdenes.

Si un producto ya vende y además tiene un descuento, se vuelve más competitivo frente a productos similares → más dropshippers lo seleccionan → más órdenes. Se estima que un 10% del catálogo activo participaría en algún esquema de descuento, y que el efecto sería un incremento del 25% en sus órdenes.

| Variable | Valor | Tipo |
|----------|-------|------|
| Productos activos | 536,590 | Confirmado |
| Que entrarían en esquema de descuento (10%) | 53,659 | Estimado |
| Lift promedio en órdenes (+25%) | 25% | Estimado conservador |
| Productividad base | 71.6 órdenes / año | Confirmado |
| **Resultado** | **~960,000 órdenes / año** | |

> Nota: si el descuento es solo por campaña (8–10 semanas al año), este resultado baja proporcionalmente a ~480,000 órdenes/año. Si el esquema es estructural y permanente, aplica el número completo.

---

## Efecto sobre GMV — Por qué DCA-002 NO es palanca de GMV

Esta es la distinción más importante de esta oportunidad.

Un descuento baja el precio por unidad. Aunque genera más órdenes, el GMV total puede quedarse igual o bajar si el incremento de volumen no supera el porcentaje de descuento.

| Escenario | Precio por orden | Órdenes | GMV total |
|-----------|-----------------|---------|-----------|
| Sin descuento | $80,000 COP | 100 | $8,000,000 COP |
| Descuento -20%, volumen +25% | $64,000 COP | 125 | $8,000,000 COP (igual) |
| Descuento -20%, volumen +40% | $64,000 COP | 140 | $8,960,000 COP (+12%) |
| Descuento -20%, volumen +15% | $64,000 COP | 115 | $7,360,000 COP (-8%) |

**Conclusión GMV:** para que los descuentos incrementen el GMV, el aumento de volumen tiene que superar el porcentaje de descuento aplicado. En condiciones normales, DCA-002 es una **palanca de órdenes y activación de catálogo**, no una palanca de GMV.

---

## Potencial standalone DCA-002

| Escenario | A — Stock quieto | B — Lift activos | Total órdenes / año |
|-----------|-----------------|-----------------|---------------------|
| Conservador | 73,000 | 240,000 | **313,000** |
| **Base** | **146,000** | **480,000** | **626,000** |
| Agresivo | 280,000 | 960,000 | **1,240,000** |

**GMV incremental estimado (escenario base):**
- 626,000 órdenes × $64,000 COP (precio con descuento) = **$40,064M COP / año**
- GMV puede ser neutro vs. el escenario sin descuento porque el precio baja

**Qué valida el número:** la tasa de adopción de descuento por parte de suppliers. El experimento manual ya en curso (campañas manuales Junio 2026) produce el dato clave: ¿qué % de productos con descuento incrementaron órdenes y en cuánto?

---

---

# OPORTUNIDAD 2
# DCA-001 · Catálogos preseleccionados para activación comercial

## Qué es

Una dinámica donde Dropi crea campañas curadas — grupos de productos seleccionados por temporada, categoría o criterio comercial — que se presentan de forma destacada a los dropshippers. El dropshipper, en vez de navegar 1,079,982 productos, recibe una selección de 3,000–5,000 recomendados para publicar.

**Ejemplos de campañas:** Black Friday, Día del Padre, Amor y Amistad, Remates de Stock, Productos Ganadores del Mes, Catálogo de Alta Rotación, Campañas por País.

**Plan de ejecución:** 9 campañas en los primeros 6 meses.

## La palanca

La fricción de selección del dropshipper es el problema. Un dropshipper que no sabe qué vender no publica nada. Una campaña curada reduce esa fricción, dirige la atención a productos específicos y aumenta la probabilidad de que un producto sea publicado y genere órdenes.

Opera sobre dos efectos:

---

## Modelo A — Nuevos productos activados desde stock quieto

De los ~679K productos sin órdenes, una campaña puede darles visibilidad que nunca tuvieron. Algunos de esos productos son buenos — simplemente nadie los encontró.

| Variable | Valor | Tipo |
|----------|-------|------|
| Campañas en los primeros 6 meses | 9 | Plan operativo confirmado |
| Productos por campaña (mix activos + quietos) | 4,000 | Estimado operativo |
| Productos únicos expuestos en 6 meses | ~25,000 | Calculado (con rotación) |
| De esos, sin órdenes previas (60%) | 15,000 | Estimado |
| Conversión a ≥1 orden por efecto campaña (25%) | **3,750 nuevos productos activados** | Estimado conservador |
| Productividad año 1 — factor 30% del promedio | 21.5 órdenes / año | Basado en dato real |
| **Resultado anualizado** | **~80,600 órdenes / año** | |

---

## Modelo B — Lift en productos activos durante campaña

Los productos activos que entran a una campaña reciben más visibilidad temporal → más dropshippers los publican durante el período → más órdenes en ese período.

| Variable | Valor | Tipo |
|----------|-------|------|
| Productos activos únicos en campaña durante el período | 10,000 | Estimado |
| Tiempo promedio de cada producto en campaña | 4.5 semanas / 26 sem = 17% del período | Calculado |
| Lift en órdenes durante campaña | +35% | Estimado conservador |
| Productividad base | 71.6 órdenes / año | Confirmado |
| **Resultado anualizado** | **~43,700 órdenes / año** | |

---

## Modelo C — Retención post-campaña

Algunos dropshippers que descubren un producto durante una campaña lo mantienen en su tienda después de que la campaña termina. Ese es un efecto permanente.

| Variable | Valor | Tipo |
|----------|-------|------|
| Dropshippers que mantienen el producto post-campaña (15%) | 15% de los impactados | Estimado |
| Impacto permanente en órdenes | **~25,000 órdenes / año** | Estimado conservador |

---

## Efecto sobre GMV — Por qué DCA-001 SÍ puede mover GMV

Esta es la diferencia clave con DCA-002. En campañas, el equipo controla **qué productos entran** a la campaña. Si se curan productos de ticket más alto, el GMV sube sin necesidad de más órdenes.

**Escenario campaña estándar (sin optimización de ticket):**
- Precio promedio producto en campaña: $80,000 COP
- Órdenes adicionales año 1: 149,300
- GMV adicional: **$11,944M COP / año**

**Escenario campaña optimizada para ticket alto (electrónica, hogar, belleza premium):**
- Precio promedio producto en campaña curada: $130,000 COP (+63%)
- Órdenes adicionales año 1: 149,300 (las mismas)
- GMV adicional: **$19,409M COP / año**

La diferencia es **$7,465M COP adicionales al año** sin generar una sola orden más. Solo eligiendo mejor qué productos entran a campaña.

**Referencia de ticket por categoría:**

| Categoría | Precio promedio estimado | Efecto vs. promedio general |
|-----------|--------------------------|----------------------------|
| Electrónica / accesorios tech | $150,000–$250,000 COP | +88% a +213% |
| Hogar / decoración | $100,000–$180,000 COP | +25% a +125% |
| Belleza premium | $90,000–$120,000 COP | +13% a +50% |
| Fitness | $80,000–$150,000 COP | Neutro a +88% |
| Accesorios moda y ropa | $40,000–$70,000 COP | -13% a -50% |

---

## Potencial standalone DCA-001

| Escenario | A — Nuevos activados | B — Lift temporario | C — Retención | Total órdenes / año |
|-----------|---------------------|--------------------|--------------|--------------------|
| Conservador | 45,000 | 22,000 | 12,000 | **79,000** |
| **Base** | **80,600** | **43,700** | **25,000** | **149,300** |
| Agresivo | 200,000 | 90,000 | 55,000 | **345,000** |

**GMV incremental estimado (escenario base, campaña optimizada):**
- 149,300 órdenes × $130,000 COP = **$19,409M COP / año**

**Qué valida el número:** el experimento Dropicup Mundial ya está activo. Al cierre de esa campaña se mide cuántos productos nuevos generaron su primera orden y cuánto fue el lift en los productos activos. Ese dato calibra el modelo directamente y con datos reales de Dropi.

---

---

# OPORTUNIDAD 3
# TTV-001 · Time to Value — Activación de suppliers

## Qué es

Un proceso estructurado para reducir el tiempo entre el registro de un nuevo supplier y el momento en que sus productos son visibles en la plataforma y empiezan a generar órdenes. Hoy ese proceso es lento, manual y sin seguimiento claro.

**North Star operativa:** supplier nuevo activo (con productos visibles) en ≤ 5 días desde el registro.
**Meta comercial:** supplier con primera orden en ≤ 20 días.

## La palanca

El 90.8% de los suppliers que se registran en Dropi nunca genera una orden. Ingresan entre 30 y 40 nuevos registros por día. Hay un cuello de botella entre "se registró" y "tiene productos publicados que generan órdenes". TTV-001 resuelve ese cuello de botella con un pipeline operativo en GHL (CRM) + automatizaciones + auditoría express.

Cada supplier activado trae catálogo nuevo que hoy no existe en la plataforma. Más catálogo = más opciones para dropshippers = más órdenes.

---

## El modelo — Cohorte de 620 suppliers activados

Este es el modelo con más soporte del portafolio: viene del TOBE aprobado, construido con datos reales de Dropi.

**¿Por qué 620 suppliers?** Es la proyección de cuántos suppliers se pueden procesar por el pipeline en un año, con la capacidad operativa actual del equipo de Supplier Success más las automatizaciones de GHL.

| Variable | Valor | Tipo |
|----------|-------|------|
| Suppliers activados en el año | 620 | Del TOBE aprobado |
| Productos públicos generados (promedio 50 / supplier) | 31,000 | Del TOBE aprobado |
| Conversión histórica producto → orden (37.1%) | **11,501 productos con potencial de orden** | Confirmado — dato real Dropi |
| Productividad año 1 — basada en histórico Dropi | **7 órdenes / año por producto** | Del TOBE (19.9 histórico × 35% maduración) |
| **Resultado base** | **~80,500 órdenes / año** | |

**Aclaración sobre la productividad:** el dato de 71.6 órdenes/año es el promedio del catálogo actual (maduro). El dato histórico de Dropi es 19.9 órdenes/año por producto activo (total histórico dividido en años de operación). Para año 1 de un producto nuevo, se aplica un factor de maduración del 35% sobre el histórico = 7 órdenes/año. Es un número conservador e intencionalmente así.

**Potencial maduro de la misma cohorte (año 2–3):** sin activar ningún supplier adicional, los mismos 11,501 productos de esta cohorte, una vez maduros, tienden a la productividad histórica de 19.9 órdenes/año → **~229,000 órdenes / año** en año 3. Eso es el valor futuro del trabajo de activación que se hace hoy.

---

## Priorización de suppliers (por qué no todos valen igual)

El pipeline de GHL prioriza suppliers por volumen declarado:

| Prioridad | Criterio | Acción |
|-----------|---------|--------|
| Alta | +1,000 órdenes/mes declaradas | Fast-track + contacto manual |
| Media | 301–1,000 órdenes/mes | Flujo automático + seguimiento |
| Baja | 51–300 órdenes/mes | Flujo estándar automatizado |

Los 70 suppliers de prioridad alta (del total de 620) generan el 34% de los productos nuevos aunque son solo el 11% del volumen de suppliers.

---

## Efecto sobre GMV

TTV-001 es **neutro-positivo** en GMV. No reduce el ticket promedio (como los descuentos) ni puede optimizarlo activamente (como las campañas). El GMV crece en proporción al volumen de órdenes nuevas.

- 80,500 órdenes adicionales × $80,000 COP = **$6,440M COP / año GMV adicional (base)**
- Si los nuevos suppliers traen categorías de mayor ticket, el número sube proporcionalmente

El factor GMV de TTV-001 depende de qué tipo de suppliers se active: si el equipo de Supplier Success prioriza suppliers con productos de mayor precio, el GMV crece más que las órdenes.

---

## Potencial standalone TTV-001

| Escenario | Factor maduración | Órdenes / año | GMV adicional estimado |
|-----------|-----------------|---------------|----------------------|
| Conservador | 20% | **46,000** | $3,680M COP |
| **Base** | **35%** | **80,500** | **$6,440M COP** |
| Agresivo | 50% | **115,000** | $9,200M COP |
| Potencial maduro año 2–3 | 100% | **229,000** | $18,320M COP |

**Riesgo principal del modelo:** la integración técnica entre Dropi y GHL (pendiente con el equipo de IT). Sin esa integración, el pipeline se opera manualmente y la capacidad de procesar 620 suppliers baja significativamente.

**Qué valida el número:** los primeros 30 suppliers activados con el nuevo proceso. Si la tasa de conversión producto → orden y los tiempos de activación se alinean con el TOBE, el modelo se sostiene.

---

---

# OPORTUNIDAD 4
# CAZ-001 · Caza Productos + Búsqueda Semántica como motor de demanda

## Qué es

Una oportunidad para integrar dos fuentes de demanda que hoy están desconectadas:

1. **Demanda explícita — Caza Productos:** los dropshippers pueden solicitar productos que necesitan pero no encuentran en el catálogo. El supplier puede ver esas solicitudes y responder. Hoy funciona pero con bajo volumen (10 solicitudes/mes) porque no hay activación activa de su uso.

2. **Demanda implícita — Búsqueda semántica:** cada vez que un dropshipper busca algo en Dropi, esa búsqueda contiene información de demanda. Hoy esa información **no se guarda en ningún lado** (confirmado por el equipo de IT, Junio 2026). No hay tabla en base de datos, no hay evento en UserPilot — el query ocurre y desaparece.

La oportunidad es capturar ambas señales, combinarlas en un score de demanda, y distribuirlas a suppliers relevantes de forma priorizada para que respondan más rápido.

## La palanca

El ciclo que hoy no cierra bien es: dropshipper busca un producto → no lo encuentra o no hay buena oferta → abandona → orden perdida. CAZ-001 convierte ese abandono en una señal accionable para el supplier: "hay demanda real de este producto en este momento".

Adicionalmente, las señales de demanda validan negociaciones: un supplier puede negociar con un dropshipper respaldado por evidencia real de cuántas personas están buscando ese producto.

---

## Contexto de mercado — ¿Cuántas órdenes necesita un dropshipper para ser rentable?

Para modelar el impacto de las negociaciones, primero hay que entender qué espera generar un dropshipper cuando busca un producto específico.

**Estructura de costos del dropshipper en Colombia:**

| Variable | Valor |
|----------|-------|
| Precio de venta promedio (sweet spot) | $80,000 COP |
| Margen bruto del dropshipper (25%) | $20,000 COP por orden |
| Comisión plataforma Dropi (~3%) | -$2,400 COP |
| Ganancia neta por orden entregada | **~$17,600 COP** |
| Tasa de entrega efectiva en Colombia | 70% (con confirmación previa) |

**Piso mínimo de rentabilidad:**

| Perfil del dropshipper | Meta de ingreso / mes | Órdenes entregadas necesarias | Órdenes totales a colocar |
|------------------------|----------------------|------------------------------|--------------------------|
| Punto de quiebre | $1,300,000 COP (= salario mínimo) | ~74 órdenes | **~106 / mes** |
| Negocio viable | $3,000,000 COP | ~170 órdenes | **~243 / mes** |
| Operación escalada | $5,000,000 COP+ | ~284 órdenes | **~406 / mes** |

Un dropshipper que usa Caza Productos activamente no es principiante. Ya opera, ya tiene clientes, y está buscando un producto específico porque sabe que tiene demanda. Ese perfil está en el rango intermedio: **150–200 órdenes/mes totales**.

---

## Modelo — ¿Cuántas órdenes genera un producto negociado?

Cuando un supplier responde a una solicitud de Caza Productos y activa el producto en el catálogo de Dropi, ese producto queda disponible para todos los dropshippers — no solo para el que lo pidió. Eso genera un efecto multiplicador.

| Variable | Valor | Base |
|----------|-------|------|
| Órdenes del producto para el dropshipper que lo pidió | 15–25 / mes | Estimado (10–15% de su portafolio) |
| El producto entra al catálogo general (disponible para todos) | Sí, siempre | Operativo |
| Conversión histórica producto nuevo en Dropi | 37.1% | Confirmado |
| Conversión producto con demanda validada (fue solicitado) | **~55–60%** | Mayor por señal explícita de demanda |
| Productividad año 1 — producto con señal de demanda | **~30 órdenes / año** | vs. 20 promedio producto nuevo |
| Productividad si demanda es alta | **50–80 órdenes / año** | Demanda confirma el mercado |

**Por qué la conversión es mayor para productos de Caza Productos:** cuando un dropshipper pide un producto específico, no está explorando — ya sabe que sus clientes lo quieren. Eso eleva la probabilidad de que el producto genere órdenes vs. un producto que entra al catálogo sin señal de demanda.

---

## Escenarios según volumen de señales

| Escenario | Señales / mes | Productos activados / año | Órdenes adicionales / año |
|-----------|--------------|--------------------------|--------------------------|
| Hoy sin cambios | 10 requests/mes | 84 | **~2,500** |
| Caza Productos activado | 80–100 requests/mes | 576–720 | **~18,000–21,600** |
| + Búsqueda semántica instrumentada | 500–1,000 señales/mes | 1,800–3,600 | **~54,000–108,000** |

**La lectura de los escenarios:**
- Con 10 solicitudes/mes el impacto es marginal. Es una prueba de concepto que funciona pero necesita escala.
- Con activación de Caza Productos a 80–100/mes: impacto real pero modesto.
- Con búsqueda semántica instrumentada: el volumen de señales escala exponencialmente porque captura toda la demanda implícita que hoy se pierde.

---

## Efecto sobre GMV — Por qué CAZ-001 puede mover el ticket

Los productos que entran al catálogo por señal de demanda validada tienden a ser de ticket más alto que el promedio. La razón: si un dropshipper busca un producto específico (no genérico), probablemente ya sabe a qué precio lo va a vender y ese precio suele estar por encima del promedio del catálogo.

- Precio promedio catálogo general: $80,000 COP
- Precio estimado productos demanda validada: $100,000–$120,000 COP
- GMV incremental por efecto ticket: **+25–50% vs. producto promedio**

En el escenario base (54,000 órdenes adicionales con señal semántica):
- Sin optimización: 54,000 × $80,000 = $4,320M COP / año
- Con efecto ticket: 54,000 × $110,000 = **$5,940M COP / año**

---

## El rol de CAZ-001 en la estrategia general

CAZ-001 no es solo una palanca de órdenes standalone. Es el sistema de inteligencia que hace que las otras oportunidades tomen mejores decisiones:

- **Alimenta DCA-001:** las señales de búsqueda le dicen al equipo qué productos featured en las próximas campañas tienen demanda real confirmada
- **Prioriza TTV-001:** los suppliers que cubren categorías con alta demanda semántica son los que más rápido deben activarse
- **Fundamenta DCA-003:** las negociaciones entre suppliers y dropshippers tienen más probabilidad de cerrarse cuando hay evidencia de demanda real detrás de la solicitud
- **Enriquece CAT-001:** las búsquedas sin resultado señalan gaps de categorización o productos que no aparecen bien indexados

---

## Potencial standalone CAZ-001

| Escenario | Año 1 | Año 2+ (con búsqueda semántica) |
|-----------|-------|--------------------------------|
| Conservador | 8,000 órdenes/año | 13,000 órdenes/año |
| **Base** | **15,800 órdenes/año** | **54,000 órdenes/año** |
| Agresivo | 30,000 órdenes/año | 108,000 órdenes/año |

**Qué valida el número:** el dato de solicitudes activas en Caza Productos por mes (hoy: 10 — se puede obtener de analytics). Y, una vez instrumentada la búsqueda semántica, el volumen de queries y la tasa de queries sin buen resultado — ese dato es medible desde el día 1 de la instrumentación.

---

---

# Consolidado del portafolio

## Impacto en órdenes por oportunidad

| Oportunidad | Escenario conservador | **Escenario base** | Escenario agresivo |
|-------------|----------------------|-------------------|-------------------|
| DCA-002 · Descuentos | 313,000 | **626,000** | 1,240,000 |
| DCA-001 · Catálogos / Campañas | 79,000 | **149,300** | 345,000 |
| TTV-001 · Activación suppliers | 46,000 | **80,500** | 115,000 |
| CAZ-001 · Caza Productos | 15,800 | **54,000** | 108,000 |
| **TOTAL** | **453,800** | **909,800** | **1,808,000** |

## Impacto en GMV por oportunidad

| Oportunidad | ¿Mueve GMV? | Mecanismo | GMV adicional / año (base) |
|-------------|------------|-----------|--------------------------|
| DCA-002 · Descuentos | Neutral / negativo | Baja precio unitario, sube volumen | Neutral — efecto se cancela |
| DCA-001 · Campañas | **Sí — el más fuerte** | Puede curar productos de ticket alto | $11,944M–$19,409M COP |
| TTV-001 · Activación | Sí — proporcional | Más órdenes al mismo precio | $6,440M COP |
| CAZ-001 · Caza Productos | Sí — ticket mayor | Demanda validada = productos de mayor precio | $5,940M COP |

---

# Conclusión estratégica

## El hallazgo central

El 63% del catálogo activo de Dropi — **679,311 productos** — nunca ha generado una sola orden. Ese es el punto de partida de toda la estrategia. No es un problema de falta de productos: hay más de un millón vigentes. Es un problema de activación, visibilidad y señales comerciales.

## Qué hace cada oportunidad

**DCA-002 · Descuentos** es la palanca de mayor potencial inmediato en órdenes. Un descuento es el mecanismo de selección más directo en dropshipping: el dropshipper elige lo que más margen da. Puede generar hasta 626,000 órdenes adicionales/año en escenario base. No mueve GMV por sí solo — es una palanca de volumen y activación.

**DCA-001 · Campañas** es la palanca más completa del portafolio. Sube órdenes (149,300/año en base) y puede subir GMV simultáneamente si los productos curados son de ticket más alto. Con 9 campañas en 6 meses ya hay un plan de ejecución concreto. El experimento Dropicup Mundial provee la validación empírica del modelo. Es el proyecto con mejor relación entre esfuerzo de implementación e impacto combinado (órdenes + GMV).

**TTV-001 · Activación** es el modelo más sólido del portafolio — tiene un TOBE completo, está aprobado, y sus proyecciones usan datos reales de Dropi. El impacto año 1 es de 80,500 órdenes/año, pero el potencial maduro de la misma cohorte en año 3 es 229,000 órdenes/año sin activar ningún supplier adicional. El cuello de botella es técnico: la integración Dropi → GHL.

**CAZ-001 · Caza Productos** es el motor de inteligencia del portafolio. En año 1 su impacto directo en órdenes es modesto (15,800–54,000/año). Su valor real está en dos cosas: (1) escalar a 100+ solicitudes/mes activa un canal que hoy es marginal; (2) la instrumentación de búsqueda semántica convierte cada búsqueda fallida en una señal accionable — ese dato alimenta y mejora las otras tres oportunidades. Es la apuesta de mediano plazo con mayor potencial multiplicador.

## Por qué no todas son proyectos de desarrollo

Estas son oportunidades en fase de exploración. Ninguna requiere comprometer recursos de desarrollo todavía. Cada una tiene un experimento manual o una fase operativa que puede correr primero:
- DCA-002: campañas de descuento manuales con suppliers seleccionados
- DCA-001: ya está corriendo (Dropicup Mundial, Remates de Junio)
- TTV-001: el proceso puede iniciarse en GHL con configuración operativa, sin integración técnica plena
- CAZ-001: Caza Productos ya existe, la instrumentación de búsqueda puede ser un evento de UserPilot sin desarrollo

Si los experimentos validan las hipótesis, cada oportunidad tiene un camino claro hacia convertirse en un proyecto con desarrollo (pasando por el Dropy Score de Dropi).

## El dato más urgente para afinar los modelos

| Dato | Para qué sirve | Urgencia |
|------|---------------|---------|
| Productos con stock > 0 y 0 órdenes en últimos 90 días | Calibra DCA-002 Modelo A | Alta |
| Solicitudes activas Caza Productos / mes | Define CAZ-001 | Alta |
| Volumen de búsquedas semánticas en Dropi / mes | Define el techo de CAZ-001 | Alta (requiere instrumentación) |
| Métricas del experimento Dropicup Mundial | Calibra todo DCA-001 | Media |
| Suppliers con productos cargados y 0 órdenes | Calibra DCA-002 + TTV-001 | Media |

---

*Análisis preparado por Jaime Guevara · Supplier Success Dropi · Junio 2026*
*Datos base confirmados con data real de la plataforma al 10 de junio de 2026*
