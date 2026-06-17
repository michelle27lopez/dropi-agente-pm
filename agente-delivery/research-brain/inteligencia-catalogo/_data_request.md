# Solicitud de Data — Inteligencia de Catálogo
**Proyecto:** DAT-001
**Para:** Equipo de Datos / BI / Backend
**Aplica a:** Todos los 67 suppliers del universo de investigación
[← Volver al índice](_index.md)

---

## Separación clara: qué vimos vs qué necesitamos

### Lo que SÍ podemos ver en pantalla (Dropi UI)
- Productos visibles en perfil
- Categoría visible del producto
- Precio proveedor y precio sugerido
- Stock público visible
- Stock privado visible (aparece como 0 en todos los revisados)
- Imágenes del producto
- Descripción visible (contenido, extensión, tipo)
- Tiempo de despacho general del supplier
- Bodega
- Calificación general (últimos 30 días)
- Etiqueta del supplier (Premium / Verificado / Estándar)
- Número de dropshippers del supplier
- Órdenes históricas totales del supplier (no por producto)

### Lo que NO podemos ver en pantalla y necesitamos de Datos/BI

| Data faltante | Por qué importa |
|---------------|----------------|
| Órdenes por producto | Saber qué productos realmente venden dentro del catálogo |
| GMV por producto | Entender valor generado, no solo cantidad de órdenes |
| Productos con 0 órdenes | Identificar catálogo cargado pero no productivo |
| Fecha de creación del producto | Medir antigüedad y tiempo a primera orden |
| Fecha de última actualización | Saber si el catálogo está vivo o abandonado |
| Fecha de primera orden | Calcular activación por producto |
| Stock histórico | Saber si el producto ha tenido quiebres de stock |
| Rotación de inventario | Entender velocidad de salida del producto |
| Cancelaciones por producto | Detectar problemas de cumplimiento o calidad |
| Devoluciones / reclamos por producto | Medir riesgo operativo y satisfacción |
| Tiempo real de despacho por producto | El perfil muestra despacho general, no por producto |
| Productos privados totales | No podemos ver el catálogo privado completo |
| Motivo de producto privado | Saber si es privado por estrategia, exclusividad o configuración |
| Visitas / clics al producto | Medir interés aunque no haya venta |
| Favoritos / guardados por dropshippers | Señal temprana de intención comercial |
| Productos enviados a cliente | No sabemos si el botón se usa o convierte |
| Muestras solicitadas | Señal de interés de dropshippers |
| Uso de informe / recursos adicionales | Saber si el contenido se consulta |
| Categoría real del producto | La categoría visible puede estar mal agrupada |
| Subcategoría | Necesaria para análisis más fino |
| Marca del producto | No siempre está estructurada |
| País / mercado de venta | Puede afectar lectura por supplier |
| Costo logístico / flete real | El margen visible no incluye toda la economía |
| Comisión o take rate Dropi | Para estimar rentabilidad real |
| Margen real del dropshipper | Solo vemos precio proveedor y sugerido |
| Productos duplicados | No se puede confirmar solo visualmente |
| Estado de aprobación del producto | No sabemos si todos están aprobados / activos |
| Performance por canal | No sabemos si vende por catálogo, pauta, comunidad, etc. |

---

## Granularidad mínima requerida

Para que la data sea útil necesitamos que venga **por producto**, no solo por supplier. Idealmente:

```
supplier_id | product_id | nombre_producto | categoria_real | subcategoria | marca |
ordenes_totales | gmv_total | ordenes_con_0 | fecha_creacion | fecha_ultima_actualizacion |
fecha_primera_orden | stock_historico_promedio | cancelaciones | devoluciones |
tiempo_despacho_real | es_privado | motivo_privado | visitas | favoritos |
canal_venta_principal | pais_mercado | margen_dropshipper
```

---

## Estado de la solicitud

| Campo | Valor |
|-------|-------|
| Fecha de creación | 2026-05-27 |
| Responsable de solicitar | Jaime |
| Dirigida a | Miguel (equipo Datos) |
| Estado | Pendiente de enviar |
| Prioridad | Alta — bloquea completitud del análisis de los 67 suppliers |
