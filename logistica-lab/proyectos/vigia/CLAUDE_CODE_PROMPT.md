# Vigía v4 — Prompt para Claude Code

## Tu rol
Eres un Agentic Software Engineer senior. Vas a refactorizar y evolucionar **Vigía**, una Chrome Extension (Manifest V3) que se inyecta en `app.dropi.co` para dar visibilidad operativa en tiempo real a los usuarios de Dropi (plataforma de dropshipping colombiana, ~3.4M órdenes/mes, 59% tasa de entrega, meta 70%).

## Contexto del proyecto

### Qué es Dropi
Marketplace de dropshipping donde hay dos tipos de usuarios:
- **Dropshipper (seller)**: Crea tiendas, publica productos de proveedores, genera órdenes. Su dashboard está en `https://app.dropi.co/dashboard/orders`
- **Proveedor (supplier)**: Gestiona inventario, confirma órdenes, despacha productos. Su dashboard está en `https://app.dropi.co/dashboard/orders/supplier`

### Stack técnico de Dropi
- Frontend: Angular (clases `ng-star-inserted`, atributos `_ngcontent-*`)
- API: `api.dropi.co` (REST, respuestas JSON)
- Angular destruye y recrea el DOM en cada navegación/filtro — los observers mueren

### Qué es Vigía hoy (v3.2)
Chrome Extension que intercepta respuestas de `api.dropi.co`, calcula SLAs por estado de orden, e inyecta visuals (badges, barra resumen, FAB, CTAs por fila) en la tabla de órdenes. Tiene un popup con dashboard. Solo funciona para el módulo de órdenes.

---

## Arquitectura actual (archivos en ~/Desktop/vigia-extension/)

### manifest.json (v3.0.0)
- `interceptor.js` → corre en `world: "MAIN"` a `document_start` (parcha fetch/XHR)
- `sla-engine.js` + `content.js` → corren a `document_idle` en el content script world
- `background.js` → service worker para badge
- `popup.html` + `popup.js` → popup del action button
- `styles.css` → estilos de los visuals inyectados
- Brand: naranja `#FF6B35`, dark `#11161d`, IBM Plex Sans/Mono

### interceptor.js (MAIN world, document_start)
Parcha `window.fetch` y `XMLHttpRequest` para interceptar toda respuesta de `api.dropi.co`. Envía el JSON completo via `window.postMessage({ type: 'VIGIA_API', url, method, response })`.

### sla-engine.js
Módulo puro exportado como `globalThis.VigiaSLA`. Contiene:
- `SLA_HOURS`: POR CONFIRMAR 12h, PENDIENTE 24h, GUÍA GENERADA 48h, RECOGIDO 24h, EN TRÁNSITO 72h, NOVEDAD 24h
- `LEVELS`: saludable (<50%), atención (50-100%), alerta (100-150%), crítico (150-200%), abandono (>200%)
- `AVG_ORDER_COP`: 108,608
- Funciones: `parseDate`, `hoursAgo`, `formatHours`, `getLevel`, `normalizeStatus`, `computeSLA`, `suggestAction`

### content.js (v3.2, ~600 líneas)
- Escucha `postMessage` del interceptor para `/orders` responses
- `processApiOrders()`: auto-descubre field names del API, computa SLA, guarda en `orderStore` Map
- `scanFromDOM()`: fallback cuando el interceptor no captura (detecta columnas de header, extrae status/fecha de celdas)
- `injectVisuals()`: inyecta badges, row tints, CTAs (WhatsApp, escalar, Intercom) en cada fila
- `insertSummaryBar()`: barra oscura con conteo urgente + $ en riesgo + filtro + export
- `createFAB()`: botón flotante "Vigilar" con badge de urgentes
- Poll cada 2s para re-inyectar si Angular destruyó los visuals
- Guarda stats en `chrome.storage.local` para el popup

### popup.html + popup.js (~310 + 258 líneas)
Dashboard oscuro con 3 tabs: Urgente (hero number, insight, lista de órdenes con CTAs), Resumen (bars + métricas), Config. Lee de `chrome.storage.local`.

---

## Lo que necesitas construir: Vigía v4

### 1. Detección de rol (Dropshipper vs Proveedor)

**Al cargar**, detectar en qué contexto está el usuario:

```
URL contiene "/orders/supplier" → ROL = "proveedor"
URL contiene "/orders" (sin /supplier) → ROL = "dropshipper"  
URL contiene "/products" → ROL = "proveedor" (módulo productos)
```

Guardar el rol detectado en estado y adaptar toda la UI según el rol. El interceptor debe capturar TODOS los endpoints relevantes para ambos roles (no solo `/orders`).

### 2. Módulo Dropshipper (evolución del actual)

**Página**: `https://app.dropi.co/dashboard/orders`

#### 2a. SLA por estado + destinos
- Lo que ya existe: badges de SLA, barra resumen, CTAs, FAB, export CSV
- **Nuevo**: Cruzar estado de la orden con la ciudad/destino. El API probablemente devuelve `city`, `department`, `destination` o similar en el objeto orden.
- En la barra resumen, mostrar breakdown: "N guías en estado X" donde N es cantidad y X el estado.
- Ejemplo: "12 EN TRÁNSITO · 5 NOVEDAD · 3 GUÍA GENERADA"

#### 2b. WhatsApp directo al proveedor
- **Clave**: Cuando una orden NO se ha despachado (estados: POR CONFIRMAR, PENDIENTE), el dropshipper necesita presionar al proveedor.
- El objeto orden del API debe tener datos del proveedor: `supplier_phone`, `supplier_whatsapp`, `provider_phone`, o similar. **Descubrir el field name real loggeando el primer objeto orden**.
- CTA por fila: botón WhatsApp que abre `https://wa.me/57{phone}?text={mensaje}` con el número REAL del proveedor asociado al producto de esa orden.
- Mensaje pre-armado: "Hola, soy [dropshipper]. La orden #{id} del producto {nombre} lleva {Xh} sin confirmar/despachar. ¿Puedes confirmar disponibilidad y tiempo de despacho?"
- Si no hay teléfono del proveedor en el API response, mostrar toast: "Número del proveedor no disponible"

#### 2c. Dashboard por estado (resumen visual)
En la barra resumen y en el popup, mostrar distribución de guías por estado como chips:
```
[EN TRÁNSITO 42] [NOVEDAD 12] [GUÍA GENERADA 8] [PENDIENTE 5] [RECOGIDO 3]
```
Cada chip con el color del nivel SLA predominante de ese grupo.

### 3. Módulo Proveedor (NUEVO)

**Páginas**: 
- `https://app.dropi.co/dashboard/orders/supplier` (órdenes del proveedor)
- `https://app.dropi.co/dashboard/products` (productos del proveedor)

#### 3a. Órdenes del proveedor
- Misma lógica de SLA que el dropshipper pero desde la perspectiva del proveedor
- Los SLAs que el proveedor controla directamente: POR CONFIRMAR (12h), PENDIENTE (24h), GUÍA GENERADA (48h)
- Acciones diferentes: "Confirmar orden", "Generar guía", "Programar recogida"
- Barra resumen adaptada: "X órdenes por confirmar · Y por despachar · $Z en riesgo de devolución"

#### 3b. Monitor de stock (NUEVO — módulo productos)
**Página**: `https://app.dropi.co/dashboard/products`

El interceptor debe capturar también respuestas de `/products` o equivalente. Cada producto tiene stock, posiblemente distribuido en múltiples bodegas.

**Reglas de stock**:
- 🔴 **Crítico**: Stock < 10 unidades (en cualquier bodega)
- 🟠 **Alerta**: Stock < 50 unidades
- 🟡 **Atención**: Stock < 100 unidades  
- 🟢 **Saludable**: Stock >= 100 unidades

**Lo que debe hacer**:
1. Interceptar el API response de productos
2. Para cada producto, sumar stock por bodega y evaluar contra las reglas
3. Inyectar en la tabla de productos: badge de nivel de stock por fila
4. Barra resumen: "X productos en riesgo de stock · Y bodegas con menos de 100 unidades"
5. CTA: "Ver productos críticos" (filtro visual)
6. **El stock se evalúa POR BODEGA**, no total. Si un producto tiene 200 unidades en Bogotá pero 5 en Medellín, Medellín está en rojo.

**Campos del API a descubrir** (auto-discovery como en órdenes):
- Stock: `stock`, `quantity`, `available_quantity`, `inventario`
- Bodega: `warehouse`, `bodega`, `warehouse_name`, `location`
- Producto: `name`, `product_name`, `nombre`
- SKU: `sku`, `reference`, `referencia`

### 4. Navegación entre módulos

Agregar al FAB o a la barra resumen un link/botón contextual:

- **En /orders (dropshipper)**: Link a `/dashboard/products` → "Ver stock de proveedores" (si tiene sentido para el rol)
- **En /orders/supplier (proveedor)**: Link a `/dashboard/products` → "Revisar stock"
- **En /products (proveedor)**: Link a `/dashboard/orders/supplier` → "Ver órdenes"

El FAB debe mostrar un menú contextual con las acciones disponibles según el rol y la página actual.

### 5. Popup adaptativo

El popup debe:
- Detectar el rol del usuario activo
- Mostrar tabs diferentes según rol:
  - **Dropshipper**: Urgente | Por Estado | Config
  - **Proveedor**: Órdenes | Stock | Config
- En el tab de Stock (proveedor): lista de productos con stock bajo, agrupados por nivel de riesgo
- Mantener el diseño dark actual (es muy bueno)

---

## Reglas de implementación

### Arquitectura (NO negociable)
1. **interceptor.js es sagrado**: Solo parcha fetch/XHR en MAIN world. No le metas lógica de negocio.
2. **sla-engine.js es el motor de cálculos**: Extiéndelo con funciones de stock (`computeStockLevel`, etc.) pero mantén su naturaleza de módulo puro.
3. **content.js es el orquestador**: Escucha interceptor, procesa datos, inyecta visuals. Usa una clase o módulo por rol si crece mucho.
4. **API-first con DOM fallback**: Siempre preferir datos del API interceptado. Solo leer DOM como fallback cuando el interceptor no capturó.
5. **DOM es write-only**: Nunca leer datos de negocio del DOM. Solo escribir badges/tints/CTAs.
6. **Polling para resiliencia**: Angular destruye el DOM. Poll cada 2s y re-inyectar si faltan visuals.

### Auto-discovery de campos del API
Los field names del API de Dropi son desconocidos. Usa el patrón de auto-discovery:
```javascript
function discoverFields(obj, candidates) {
  // candidates = { fieldName: ['possible_key_1', 'possible_key_2', ...] }
  // Retorna { fieldName: 'actual_key_found' }
  // Log en consola para debugging: [Vigía] API keys: ...
}
```

### Debugging obligatorio
- `console.log('[Vigía]', ...)` para TODA operación significativa
- Al recibir el PRIMER objeto de un nuevo endpoint, loggear TODOS los keys y un sample truncado
- Log del rol detectado al arrancar
- Log de cada inyección visual con conteos

### Testing manual
Después de cada cambio significativo:
1. `node -c content.js` para validar sintaxis
2. Explicar qué recargar (extensión en chrome://extensions, luego la página)
3. Qué buscar en la consola para confirmar que funciona

### Estilo visual
- Brand Dropi: naranja `#FF6B35`, dark `#11161d`
- Tipografía: IBM Plex Sans (UI), IBM Plex Mono (datos/números)
- Badges con bordes redondeados, colores semánticos de LEVELS
- Todo el CSS en `styles.css`, no inline (excepto colores dinámicos de nivel)

---

## Orden de ejecución sugerido

### Fase 1: Estabilizar lo actual
1. Asegurar que el interceptor captura en MAIN world a document_start (ya está)
2. Asegurar que el DOM fallback funciona cuando el interceptor no captura
3. Validar con `node -c` todos los archivos

### Fase 2: Detección de rol + refactor
1. Añadir detección de URL → rol
2. Extender el interceptor listener para capturar `/products` además de `/orders`
3. Crear funciones separadas: `handleDropshipperOrders()`, `handleSupplierOrders()`, `handleProducts()`

### Fase 3: Módulo Dropshipper mejorado
1. Breakdown por estado en barra resumen
2. WhatsApp al proveedor con número real del API
3. Cruce estado × destino

### Fase 4: Módulo Proveedor
1. Adaptar SLA para perspectiva proveedor
2. Monitor de stock por producto y bodega
3. Badges de stock en tabla de productos

### Fase 5: Popup adaptativo + navegación
1. Popup con tabs por rol
2. Tab de stock para proveedor
3. FAB con menú contextual y links entre módulos

---

## Archivos del proyecto

```
~/Desktop/vigia-extension/
├── manifest.json          # Manifest V3, content scripts + interceptor
├── interceptor.js         # MAIN world, parcha fetch/XHR, postMessage
├── sla-engine.js          # Motor de cálculos SLA (globalThis.VigiaSLA)
├── content.js             # Orquestador: escucha API, procesa, inyecta visuals
├── styles.css             # Estilos de todos los visuals inyectados
├── background.js          # Service worker para badge del action button
├── popup.html             # Popup UI (dark theme, 3 tabs)
├── popup.js               # Lógica del popup (lee chrome.storage.local)
└── icons/                 # icon-16, icon-48, icon-128.png + icon.svg
```

## Instrucción final

Lee TODOS los archivos del proyecto antes de hacer cualquier cambio. Entiende la arquitectura completa. Haz cambios quirúrgicos — no reescribas archivos enteros a menos que sea estrictamente necesario. Valida sintaxis después de cada cambio. Explica qué hace cada cambio y cómo probarlo.

El objetivo final: **Vigía es el centro de toma de decisiones operativas para ambos tipos de usuario en Dropi, dándoles sensación de control total sobre sus órdenes y stock en tiempo real.**
