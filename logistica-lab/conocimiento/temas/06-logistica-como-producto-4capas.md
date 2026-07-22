# 06 · Logística como producto — el modelo de 4 capas

> **Fuente:** `fuentes/conceptualizacion-logistica-como-producto.md` · **Tipo:** conceptual / decisión · **Confianza:** modelo de trabajo

## TL;DR
- El error original: tratar "productos vs features" como 2 frentes planos. La realidad son **4 capas**.
- Same-day y envío normal NO son 2 productos (son velocidad); fulfillment NO es tipo de envío (es profundidad de servicio).
- Decisión que **bloquea** el inventario de productos: **¿quién compra cada producto logístico?**

## Contenido
### Las 4 capas
1. **Dimensiones** (ejes que definen un producto): velocidad/SLA · tipo de carga · profundidad de servicio (dropshipping vs fulfillment) · modelo de cobro (COD/prepago) · geografía. Un "producto" = un punto/bundle sobre estos ejes.
2. **Proceso** (la cadena de la orden, común a todo producto): creación → confirmación → flujo proveedor → novedades → entrega. Lo que cambia entre productos son los **parámetros**, no las etapas.
3. **Features/capacidades** (habilitan etapas). Muchas son **transversales** (Chatea Pro, torre logística, validación de dirección sirven a varias). **Capacidad ≠ interfaz** (una pantalla no es una capacidad).
4. **Beneficios por actor** (dropshipper · proveedor · transportadora · consumidor). Un beneficio siempre es "X para quién".

### Huecos de primer nivel (mercado COD)
- **Logística inversa / devoluciones** como flujo de primer nivel (no nota al margen).
- **Conciliación COD** (transportadora recauda → remite a Dropi → Dropi paga al dropshipper): el producto logístico-financiero más crítico.

### Errores a evitar
Mezclar ejes en "productos" · amarrar features transversales a una etapa · confundir interfaz con capacidad · no definir el actor/comprador.

## Conexión con metodología
- Es el §4.3 de la metodología. Al conceptualizar cualquier producto logístico, ubicarlo en las 4 capas.

## Decisión PENDIENTE (bloquea el siguiente paso)
> **¿Quién es el cliente/comprador de cada producto logístico — dropshipper, proveedor, o
> ambos según el producto?** De eso depende qué cuenta como "producto" y cómo se definen
> los beneficios. (ej: same-day lo vive el consumidor pero lo compra el dropshipper;
> fulfillment ¿a quién se vende?)
