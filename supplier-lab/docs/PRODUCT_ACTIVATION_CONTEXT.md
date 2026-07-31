# Contexto Canónico: Proceso de Activación de Producto para Suppliers

Este documento establece la línea base conceptual, la arquitectura y la instrumentación que construimos en el **Supplier Lab** para el proceso de activación de productos. Funciona como el punto de verdad (Single Source of Truth) para iterar, medir y evolucionar este flujo en el futuro.

## Definición General

El **Product Activation Processor** es el proceso mediante el cual un supplier pasa de estar registrado en la plataforma a tener un producto creado dentro de Dropi.

Este proceso incluye los pasos necesarios para que el supplier configure su operación inicial, cree su primera bodega guiada y registre un producto cumpliendo con las validaciones estrictas (stock, imágenes y garantías) requeridas por la plataforma.

El proceso se entiende como una cadena de transformación:

`Supplier nuevo` → `Configuración inicial` → `Bodega creada` → `Producto iniciado` → `Validaciones superadas` → `Producto guardado (creado en plataforma)` → `Validación Externa`

## Entrada del Proceso

El proceso recibe como entrada un supplier que acaba de registrarse o que está iniciando su operación en Dropi.
Sus condiciones iniciales varían (online/offline, con o sin experiencia, con o sin catálogo estructurado).

## Salida Esperada

La salida esperada es un **producto creado y validado** dentro de Dropi, seguido por el inicio de la verificación operativa del proveedor.

Estados posteriores del producto a observar en el laboratorio:
- Producto creado.
- Producto completo (cumple reglas duras de validación).
- Producto privado.
- Producto público solicitado.
- Producto pendiente de validación.
- Producto aprobado.
- Producto visible para dropshippers.
- Producto con primera orden.

## Alcance del Proceso Implementado

El alcance abarcado en el laboratorio incluye:
1. **Creación de Bodega:** Flujo asistido por un tour guiado (tooltips) para asegurar la correcta configuración de datos básicos y formatos de guías por transportadora.
2. **Creación de Producto:** Interfaz en pestañas (General, Stock, Imagen del producto, Recursos Adicionales, Productos privados, Garantías).
3. **Validación Estricta (Gates):** 
   - Stock mínimo de 100 unidades (para productos públicos).
   - Mínimo 3 imágenes cargadas.
   - Configuración obligatoria de 3 garantías clave (Orden incompleta, Mal funcionamiento, Producto roto).
4. **Verificación Externa:** Tras guardar el producto, se detona un modal que invita al supplier a iniciar su validación operativa (redirección a encuesta/formulario externo).

---

## Milestones del Proceso Base

1. **Supplier registrado:** Cuenta creada.
2. **Diagnóstico y Configuración inicial:** Perfil básico y tienda.
3. **Onboarding de Bodega (Tour):** El supplier interactúa con la guía paso a paso de creación de bodega.
4. **Primera bodega creada:** Se guarda la bodega exitosamente.
5. **Módulo de productos abierto:** El supplier navega a la vista de productos.
6. **Selección de tipo de producto:** Elige crear un "Nuevo Producto".
7. **Producto iniciado:** Ingreso al formulario de creación.
8. **Información y Validaciones superadas:** El supplier diligencia datos generales, asigna stock >100, sube >=3 imágenes y marca las garantías obligatorias.
9. **Intento de guardado (Save Attempted):** El sistema verifica las reglas de negocio y muestra feedback en caso de fallos.
10. **Producto guardado:** Confirmación y guardado exitoso.
11. **Inicio de Validación Externa:** El supplier es derivado al formulario de validación de operación (Survey).
12. **Producto visible en el listado:** Aparece en la tabla principal.

---

## Instrumentación y Tracking (PostHog)

El laboratorio cuenta con trazabilidad en cada paso clave.

### Eventos de Bodega (Warehouse Events)
- `bodega_tour_started`
- `bodega_tour_step_completed` (con propiedad `step`)
- `bodega_tour_step_reversed` (con propiedad `from_step`)
- `bodega_tour_completed`
- `bodega_created`

### Eventos de Productos (Product Events)
- `product_add_clicked`
- `product_type_selected` (propiedad: `type: 'nuevo'`)
- `product_creation_started`
- `product_save_attempted`
- `product_save_validation_failed` (con propiedad `reason`: `stock_low`, `images_low`, `warranties_missing`)
- `product_saved`

### Eventos de Validación Externa
- `survey_started` (Redirección al Typeform/Widget externo)

---

## Métricas Base del Proceso

### Conversión entre etapas
- inicio de tour de bodega → `bodega_created`
- `bodega_created` → `product_creation_started`
- `product_creation_started` → `product_save_attempted`
- `product_save_attempted` → `product_saved` (Tasa de éxito vs rechazo por validaciones).
- `product_saved` → `survey_started`

### Volumen y Calidad
- Cantidad de fallos de validación agrupados por `reason` (Qué detiene más a los suppliers: ¿imágenes, stock o garantías?).
- Tiempo promedio para completar la creación de producto.

---

## Conceptos Futuros (Pendientes)

### Product Readiness Score
Una métrica para evaluar qué tan "listo" o completo está un producto dentro del ecosistema, basado en la calidad de la información provista, más allá de las validaciones estrictas iniciales. 

### Sales Potential Score
Una evaluación avanzada sobre la probabilidad comercial de que el producto se venda, cruzando:
- Histórico de ventas similares.
- Demanda y búsquedas de dropshippers.
- Margen, precio y tendencias del catálogo.

*Por ahora, el laboratorio diferencia estrictamente entre "Product Created" (existe en BD), "Product Complete" (cumple validaciones del wizard) y deja estos scores como siguientes fases analíticas.*

---

## Arquitectura Conceptual del Laboratorio

- **Supplier Intake & Setup:** Captura de contexto y perfil básico.
- **Warehouse Setup:** Flujo guiado para estructurar la logística (origen).
- **Product Creation & Completion:** Formulario robusto con "gates" de validación para garantizar calidad de catálogo.
- **Supplier Validation:** Verificación de capacidades operativas y financieras (Survey externa).
- **Product Readiness & Sales Potential:** (Capas futuras de inteligencia).

## Principio de Modelado

Este proceso no es una serie de pantallas. Es una **cadena de valor**:
`Supplier nuevo` → `Operación mínima (Bodega)` → `Producto Creado y Completo (Validado)` → `Evaluación Operativa` → `Generación de Órdenes`

Este documento es la referencia para cualquier experimento, medición o ajuste sobre este flujo.
