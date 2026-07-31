# Proyecto Combos — Definición TOBE por Nodo
**Versión:** 0.1 — Exploración  
**Fecha:** 2026-05-13  
**Origen:** Reunión técnica de estado — equipo Producto + TI  
**Propósito:** Definir el estado deseado (TOBE) del proyecto Combos por cada nodo del ecosistema Dropi, para que Producto pueda prototipar cada punto y TI pueda hacer una estimación de **esfuerzo** (no de tiempo) por fase.

> **Nota sobre esfuerzo vs tiempo:** El esfuerzo estimado por TI es independiente del calendario. Un nodo que requiere X puntos de esfuerzo puede ejecutarse en 2 semanas con dedicación completa o en 3 meses con dedicación parcial. El objetivo de este documento es tener la claridad suficiente para que esa estimación sea posible.

---

## 1. Definición técnica acordada: ¿Qué es un Combo?

Un combo **no es una orden con múltiples productos**. Es un **tipo de producto** con las siguientes propiedades:

| Propiedad | Descripción |
|---|---|
| Tipo | `combo` (junto a `simple` y `variable`) |
| Composición | Agrupa 2 o más productos (simples o con variantes) bajo un único identificador |
| Precio | Costo unificado definido por el dropshipper — no es la suma de los individuales |
| Stock | Dependiente: al venderse el combo, reduce el stock de cada producto componente |
| Reverso | Una devolución del combo debe revertir el stock de todos los componentes |
| Dispersión | Los costos y márgenes del combo se distribuyen de forma diferente a los productos individuales |

**Implicación arquitectural:** Combos modifica entidades base del sistema. Cada nodo que hoy opera con el concepto de "producto" necesita ser revisado para entender cómo se comporta cuando ese producto es de tipo `combo`.

---

## 2. Nodos del ecosistema — AS-IS y TO-BE

Cada nodo incluye:
- **AS-IS:** qué existe hoy
- **TO-BE:** qué debe existir (a definir/prototipar desde Producto)
- **Requerimientos para estimación de esfuerzo:** lo que TI necesita saber para estimar

---

### Nodo 1: Dropi Core — Creación y gestión de combos

**AS-IS**
- Combos existen como funcionalidad construida sobre el core por Kevin/MG
- La lógica actual crea una asociación entre productos y genera un producto unificado internamente
- Funciona para creación manual; creación masiva en revisión
- Únicamente accesible para quien conoce el core

**TO-BE (a prototipar)**
- Flujo de creación de combo desde la interfaz: selección de productos componentes, definición de precio unificado, validación de stock disponible por componente
- Reglas de stock: al crear un combo, calcular cuántas unidades de combo son posibles dado el stock actual de cada componente
- Regla de bloqueo: si existe una orden activa sobre un combo, no se puede desactivar ni modificar la composición
- Flujo de desactivación controlada con validación de órdenes activas
- Visualización del combo en el catálogo del dropshipper (diferenciado visualmente de productos simples y variables)

**Requerimientos para estimación de esfuerzo**
- Diagrama de la arquitectura actual de combos en el core (Kevin/MG)
- Definir si la refactorización del core es necesaria o si se puede extender sin tocar la base
- Confirmar si creación masiva ya funciona o requiere desarrollo adicional
- Prototipo de UI del flujo de creación (Producto)

---

### Nodo 2: Integración Shopify

**AS-IS**
- Se logró importar un combo como producto simple a Shopify
- La importación falla cuando el combo incluye productos con variantes
- El flujo inverso (orden desde Shopify → Dropi) no ha sido probado con combos
- Shopify cambió su API de variantes desde enero de este año

**TO-BE (a prototipar)**
- Exportación del combo a Shopify como un único producto, con configuración de precio unificado
- Soporte para combos que incluyen productos con variantes (no solo simples)
- Recepción de una orden de Shopify donde el producto sea un combo: Dropi debe identificarlo, buscar la tabla de relación del combo y procesar correctamente los dos componentes
- Validación de stock en ambas direcciones al momento de la orden
- Manejo de errores cuando el stock de algún componente es insuficiente al recibir la orden

**Requerimientos para estimación de esfuerzo**
- Revisar documentación actualizada de la API de Shopify post-enero para variantes y productos compuestos
- Prueba de concepto del flujo inverso (orden Shopify → Dropi) con producto combo simple
- Confirmar si Dropify (plugin) soporta el tipo `combo` en su versión actual o requiere cambios
- Definir cómo Shopify identifica que una orden corresponde a un combo (metafield, SKU especial, otro)

---

### Nodo 3: Integración WooCommerce

**AS-IS**
- Plugin en rediseño / nueva arquitectura (versión 2.0 en desarrollo)
- No se han hecho pruebas de combos sobre el plugin actual

**TO-BE (a prototipar)**
- Mismo comportamiento que Shopify: exportar combo como producto único, recibir orden como combo, validar stock de componentes
- Debe planificarse sobre la nueva arquitectura del plugin (v2.0), no sobre la actual

**Requerimientos para estimación de esfuerzo**
- Estado actual y fecha estimada de entrega del plugin 2.0
- Confirmar si el plugin 2.0 tendrá una capa de abstracción que facilite añadir el tipo `combo` sin reescribir lógica de órdenes
- Decisión: ¿se implementa combos en WooCommerce sobre v1 o se espera v2?

---

### Nodo 4: Integración Tienda Nube

**AS-IS**
- Aplicación existe pero está en rediseño
- No se han hecho pruebas de combos

**TO-BE (a prototipar)**
- Mismo patrón que Shopify y WooCommerce: exportar combo, recibir orden, validar stock
- Investigar restricciones propias de la API de Tienda Nube para productos compuestos

**Requerimientos para estimación de esfuerzo**
- Estado del rediseño de la app de Tienda Nube
- Revisar documentación de la API de Tienda Nube para productos compuestos o kits
- Decisión: ¿se implementa sobre la app actual o se espera la nueva versión?

---

### Nodo 5: CAS (Atención al Cliente)

**AS-IS**
- CAS no tiene contexto de combos; cuando un agente consulta un producto tipo combo, no puede interpretar la composición ni el precio
- No está definido cómo se ve una garantía, devolución o consulta de una orden de combo en CAS

**TO-BE (a prototipar)**
- Vista de producto en CAS que muestre la composición del combo (componentes, precios individuales, precio combo, stock de cada componente)
- Vista de orden en CAS que identifique que es una orden de combo y muestre el estado de cada componente
- Flujo de garantía/devolución en CAS que entienda que el reverso afecta múltiples productos
- Prototipo de pantalla CAS con estos estados (Producto)

**Requerimientos para estimación de esfuerzo**
- Confirmar qué datos de producto ya expone la API interna que consume CAS
- Definir si el cambio es solo de UI/consulta o si requiere nuevos endpoints
- Prototipo de pantallas (Producto) antes de iniciar estimación

---

### Nodo 6: Icon Scanner

**AS-IS**
- Icon Scanner funciona para productos simples y variables
- Con combos, el escáner no sabe interpretar que el código escaneado corresponde a un conjunto de productos
- Si se escana un combo y no está correctamente registrado, genera error de producto no encontrado o producto errado

**TO-BE (a prototipar)**
- Al escanear el código de un combo, Icon Scanner debe:
  - Identificar que es un combo
  - Mostrar los componentes del combo
  - Validar que todos los componentes tienen stock disponible antes de confirmar
  - Registrar el movimiento de stock de todos los componentes al confirmar el escaneo
- Flujo de devolución escaneada: revertir stock de todos los componentes del combo

**Requerimientos para estimación de esfuerzo**
- Confirmar cómo Icon Scanner consulta hoy el producto por código (tabla, endpoint)
- Definir si el código de escaneo del combo es un código propio o el de uno de los componentes
- Prototipo del flujo de escaneo con combos (Producto)

---

### Nodo 7: Stock Pro (WMS)

**AS-IS**
- Stock Pro gestiona inventario físico de productos simples y variables
- No hay lógica de combo en Stock Pro; los movimientos de inventario no consideran la dependencia entre componentes de un combo

**TO-BE (a prototipar)**
- Cuando se procesa una orden de combo en bodega, Stock Pro debe descontar el stock de cada componente por separado
- Reportes de inventario deben poder mostrar "combos disponibles" como métrica calculada a partir del stock mínimo de sus componentes
- Alertas de stock bajo deben considerar el impacto en los combos activos que usan ese componente

**Requerimientos para estimación de esfuerzo**
- Nivel de adopción actual de Stock Pro (bajo según reunión — confirmar métricas)
- Cómo Stock Pro recibe hoy las órdenes desde Dropi (integración, webhooks, batch)
- Si la lógica de combo puede añadirse como capa sobre la integración actual o requiere cambios en Stock Pro

---

### Nodo 8: Chatea Pro

**AS-IS**
- Chatea Pro opera sobre productos individuales
- No hay contexto de combos en las conversaciones o automatizaciones

**TO-BE (a prototipar)**
- Cuando un cliente consulta por un combo, Chatea Pro debe poder responder con la información del combo (componentes, precio, disponibilidad)
- Las automatizaciones de seguimiento de orden deben reconocer órdenes de combo y no tratarlas como múltiples órdenes independientes

**Requerimientos para estimación de esfuerzo**
- Cómo Chatea Pro consulta hoy información de productos y órdenes
- Si la integración es vía API de Dropi o base de datos directa
- Prototipo de conversación/automatización para combos (Producto)

---

### Nodo 9: Page Pilot

**AS-IS**
- Page Pilot genera landing pages de productos
- Si el usuario clona una página de un producto que es combo, la página resultante no sabe mostrar la composición ni el precio diferenciado

**TO-BE (a prototipar)**
- Template de página para producto tipo `combo` que muestre los componentes visualmente
- Al generar la página desde un combo, los componentes deben poder visualizarse (imágenes, descripciones individuales)
- El precio mostrado en la página debe ser el precio del combo, no la suma de componentes

**Requerimientos para estimación de esfuerzo**
- Cómo Page Pilot obtiene hoy los datos del producto para generar la página
- Si ya existe un template configurable o si la generación es por código fijo
- Prototipo del template de página para combos (Producto + Diseño)

---

### Nodo 10: Dropi App (móvil)

**AS-IS**
- La app móvil no tiene visualización específica para combos
- Si un dropshipper tiene un combo en su catálogo, la app lo muestra como producto genérico sin indicar la composición

**TO-BE (a prototipar)**
- En el catálogo del dropshipper, los combos deben tener un indicador visual diferenciado
- Al abrir un combo, debe mostrar los componentes, precio unificado y stock disponible (calculado sobre el mínimo de componentes)
- El flujo de creación de orden desde la app debe soportar combos

**Requerimientos para estimación de esfuerzo**
- Si la app consume el mismo endpoint de productos que la web o tiene uno propio
- Plataforma de la app (React Native, nativo) para estimar esfuerzo de cambios de UI
- Prototipo de pantalla de combo en app (Producto + Diseño)

---

### Nodo 11: Marcas Blancas

**AS-IS**
- Las marcas blancas hoy crean productos codificando manualmente la relación de dos productos bajo un solo SKU
- No tienen acceso al flujo formal de combos

**TO-BE (a prototipar)**
- Las marcas blancas deben poder crear combos desde su propio panel con el mismo flujo que los dropshippers
- Los combos de marcas blancas deben ser visibles en el catálogo con diferenciación de origen (marca blanca vs proveedor)
- Definir si las marcas blancas pueden configurar el precio del combo o si lo hereda de los componentes

**Requerimientos para estimación de esfuerzo**
- Confirmar si el panel de marcas blancas tiene acceso a las mismas APIs de creación de productos
- Definir reglas de negocio: ¿una marca blanca puede combinar productos de diferentes proveedores?
- Prototipo del flujo de creación de combo para marca blanca (Producto)

---

### Nodo 12: Garantías

**AS-IS**
- ~5,000 garantías mensuales en Colombia; sistema diseñado para productos individuales
- No hay lógica para garantías de combos: si un componente falla, no está claro si la garantía aplica al combo entero o al componente individual

**TO-BE (a prototipar)**
- Definir la política de garantía para combos (¿se garantiza el combo o cada componente por separado?)
- El flujo de apertura de garantía debe reconocer órdenes de combo y preguntar cuál componente es el afectado
- La devolución/reverso asociado a la garantía debe aplicar al componente o al combo según la política definida
- Reportes de garantías deben poder segmentar por tipo de producto (simple, variable, combo)

**Requerimientos para estimación de esfuerzo**
- Decisión de negocio sobre la política de garantía para combos (previa al desarrollo)
- Cómo el sistema de garantías identifica hoy el producto de una orden
- Si el cambio requiere modificar el flujo de apertura de garantía o solo agregar una condición

---

### Nodo 13: Negociaciones

**AS-IS**
- El módulo de negociaciones opera sobre productos individuales
- Si un producto está en una negociación y se vende dentro de un combo, no hay lógica para calcular la dispersión correcta del margen

**TO-BE (a prototipar)**
- Definir la regla de negocio: ¿un combo hereda las negociaciones de sus componentes o tiene su propia negociación?
- Si hereda: definir cómo se dispersa el margen del combo entre los componentes con negociación
- Mensaje temporal en la UI mientras no está implementado: "Los productos de tipo combo no participan en negociaciones activas" (validado en reunión)
- Prototipo del flujo de negociación para combos (Producto + Juan Diego)

**Requerimientos para estimación de esfuerzo**
- Decisión de negocio sobre la regla de dispersión (previa al desarrollo)
- Cómo el módulo de negociaciones calcula hoy el margen de un producto en una orden
- Qué tan acoplado está este módulo al tipo de producto

---

### Nodo 14: Bodega / Empacado (línea de empacado)

**AS-IS**
- La bodega recibe órdenes de productos individuales y sigue un proceso de empacado estándar
- No hay instrucciones diferenciadas para órdenes de combo (que requieren empacar dos productos juntos bajo una sola orden)

**TO-BE (a prototipar)**
- Las órdenes de combo deben tener un indicador visual en el sistema de bodega que advierta que son un combo
- El proceso de empacado debe mostrar los componentes del combo juntos para facilitar el picking
- Si uno de los componentes no tiene stock en bodega, el sistema debe alertar antes de que la orden llegue a la línea de empacado

**Requerimientos para estimación de esfuerzo**
- Qué sistema usa la bodega hoy para ver las órdenes (Stock Pro, interfaz interna, impresión)
- Si el cambio requiere modificación del sistema de bodega o solo del formato de impresión/visualización de órdenes

---

## 3. Fases de implementación propuestas

Las fases están organizadas por dependencia funcional, no por prioridad final (esa la define el negocio con TI).

| Fase | Nodos incluidos | Condición de entrada |
|---|---|---|
| **Fase 1 — Base** | Dropi Core + Shopify | Prototipo aprobado de creación y flujo Shopify |
| **Fase 2 — Operación** | Icon Scanner + CAS | Fase 1 funcionando en beta |
| **Fase 3 — Otras integraciones** | WooCommerce + Tienda Nube | Plugin v2.0 disponible |
| **Fase 4 — Ecosistema completo** | Stock Pro + Chatea Pro + Page Pilot + Dropi App | Fases 1 y 2 estables |
| **Fase 5 — Negocio** | Marcas Blancas + Garantías + Negociaciones + Bodega | Decisiones de negocio tomadas para cada nodo |

> Las fases **no son secuenciales obligatoriamente**. Nodos de fases distintas pueden desarrollarse en paralelo si el equipo tiene capacidad. El objetivo de la tabla es mostrar dependencias, no un roadmap fijo.

---

## 4. Insumos que Producto debe entregar antes de cada estimación

Para que TI pueda estimar el esfuerzo de cada nodo, Producto debe entregar:

- [ ] Prototipo o wireframe del flujo en ese nodo (Figma o equivalente)
- [ ] Reglas de negocio escritas (especialmente para garantías, negociaciones y dispersión de costos)
- [ ] Casos de uso explícitos: flujo feliz + al menos 2 casos de error
- [ ] Definición de qué datos necesita mostrar/recibir cada nodo
- [ ] Para nodos con decisiones pendientes: decisión tomada y documentada antes de iniciar estimación

---

## 5. Decisiones pendientes de negocio (bloquean estimación)

| Decisión | Responsable | Impacto |
|---|---|---|
| Política de garantía para combos (¿combo entero o componente?) | María / equipo de garantías | Nodo 12 |
| Regla de dispersión de márgenes en negociaciones con combos | Lucho / Juan Diego | Nodo 13 |
| ¿Las marcas blancas pueden combinar productos de diferentes proveedores? | María / Lucho | Nodo 11 |
| ¿Combos en WooCommerce y Tienda Nube sobre versión actual o esperar v2? | Jose Giraldo / TI | Nodos 3, 4 |
| Código de escaneo de un combo: ¿código propio o el de un componente? | TI + Operaciones | Nodo 6 |
