# HU · Data: Métricas para Pulso Vivo del Catálogo

**Épica:** Supplier Success Graph · Catálogo  
**Solicitante:** Supplier Success (Jaime)  
**Equipo destino:** Data / Analytics  
**Prioridad:** Alta  
**Frecuencia de entrega:** Diaria (snapshot 6:00 AM COT)

---

## Contexto

Estamos construyendo una vista gráfica e interactiva que muestra la **salud general del catálogo de Dropi** en tiempo cuasi-real. No se revisa producto por producto: se analiza el catálogo como un sistema.

La pregunta central que responde esta herramienta es:

> ¿El catálogo está compuesto por productos realmente vendibles, disponibles, demandables y operables — o solo estamos acumulando productos registrados?

La vista tiene **18 nodos** que representan métricas y dimensiones del catálogo. Cada nodo necesita un valor numérico + tendencia, actualizados una vez al día.

---

## Lo que necesitamos

Un proceso diario (cron / dbt model / query programada) que **escriba un registro por nodo en la tabla `catalog_metrics_daily`** en Supabase antes de las 6:00 AM COT.

**Tabla destino:**  
`catalog_metrics_daily` en Supabase (`fwwkesboxlbmimzyoztq.supabase.co`)

**Un registro por nodo por día.** Total: 18 filas diarias.

---

## Los 18 nodos y sus métricas requeridas

### Criterios de clasificación de productos (base de todo)

Antes de los nodos, necesitamos que Data clasifique **cada producto** en una de estas 4 categorías. Esta clasificación es el insumo de la mayoría de nodos.

| Categoría | Criterio |
|---|---|
| `activo_sano` | tiene stock + generó venta en últimos 30d + sin incidentes en 30d + completitud ≥ 80% |
| `activo_riesgo` | generó venta en 30d Y (tiene incidente en 30d O sin stock) |
| `potencial_dormido` | sin venta en 30d + completitud ≥ 60% + tiene stock |
| `ruido` | todo lo que no califica en los anteriores |

---

### Nodo 1: `pulso_catalogo` — Score general del catálogo

| Campo | Descripción |
|---|---|
| `value_num` | Score 0–100 (ponderado) |
| `value_display` | `"67"` |
| `unit` | `"/ 100 · Salud Media"` ← ajustar según score: <40 Crítico, 40-65 Media, 65-80 Buena, >80 Excelente |
| `trend` | `up/down/stable` vs snapshot anterior |
| `trend_value` | `"+3 vs mes ant."` |
| `health` | `critical` <40, `warning` 40-65, `good` >65 |

**Fórmula del score:**
```
score = (completitud_pct × 0.20)
      + (stock_pct × 0.20)
      + (demanda_pct × 0.25)
      + (operacion_pct × 0.20)
      + (min(adopcion_drops / 5, 1) × 100 × 0.15)
```

**`breakdown` JSON esperado:**
```json
{
  "score_componentes": {
    "completitud_score": 12.2,
    "stock_score": 14.8,
    "demanda_score": 9.5,
    "operacion_score": 16.4,
    "adopcion_score": 7.0
  }
}
```

---

### Nodo 2: `completitud` — Calidad de ficha de producto

| Campo | Valor esperado |
|---|---|
| `value_num` | Porcentaje promedio de completitud (0–100) |
| `value_display` | `"61%"` |
| `unit` | `"de completitud promedio"` |
| `trend` / `trend_value` | vs 7 días atrás |

**Cómo calcular completitud de un producto (score 0–100):**

| Campo | Peso |
|---|---|
| Tiene título (≥ 10 chars) | 20 pts |
| Tiene descripción (≥ 50 chars) | 20 pts |
| Tiene ≥ 1 imagen | 20 pts |
| Tiene precio > 0 | 20 pts |
| Tiene categoría asignada | 10 pts |
| Tiene ≥ 1 atributo extra | 10 pts |

Completitud promedio = `AVG(score_individual)` sobre todos los productos activos.

**`breakdown` JSON esperado:**
```json
{
  "productos_completos": 610000,
  "productos_incompletos": 390000,
  "por_categoria": {
    "hogar_pct": 48,
    "electronica_pct": 52,
    "moda_pct": 55
  },
  "campos_faltantes_mas_comunes": ["atributos", "descripcion_larga", "imagenes_secundarias"]
}
```

---

### Nodo 3: `stock` — Disponibilidad de inventario

| Campo | Valor esperado |
|---|---|
| `value_num` | Cantidad absoluta de productos con stock > 0 |
| `value_display` | `"740K"` |
| `unit` | `"productos con stock (74%)"` (incluir porcentaje) |
| `trend` / `trend_value` | vs 7 días atrás |

**Query base:**
```sql
SELECT COUNT(*) AS con_stock
FROM products p
JOIN product_stock ps ON p.id = ps.product_id
WHERE ps.quantity > 0 AND p.status = 'active'
```

**`breakdown` JSON esperado:**
```json
{
  "con_stock": 740000,
  "sin_stock": 260000,
  "sin_stock_breakdown": {
    "agotado_temporal_pct": 61,
    "discontinuado_pct": 24,
    "en_revision_pct": 15
  },
  "quiebre_top1000_pct": 8
}
```

---

### Nodo 4: `demanda` — Productos con ventas activas (30 días)

| Campo | Valor esperado |
|---|---|
| `value_num` | Cantidad de productos distintos con ≥ 1 orden completada en últimos 30d |
| `value_display` | `"380K"` |
| `unit` | `"productos con ventas (38%)"` |

**Query base:**
```sql
SELECT COUNT(DISTINCT product_id) AS con_ventas
FROM orders
WHERE status = 'completed'
  AND created_at >= NOW() - INTERVAL '30 days'
```

**`breakdown` JSON esperado:**
```json
{
  "con_ventas_30d": 380000,
  "sin_ventas_30d": 620000,
  "gmv_concentracion_pct": 97,
  "sin_ventas_con_senal_latente": 124500
}
```

---

### Nodo 5: `operacion` — Salud operativa de las órdenes

| Campo | Valor esperado |
|---|---|
| `value_num` | Porcentaje de órdenes completadas SIN incidente en últimos 30d |
| `value_display` | `"82%"` |
| `unit` | `"sin incidentes operativos"` |

**Query base:**
```sql
SELECT
  ROUND(100.0 * SUM(CASE WHEN NOT has_incident THEN 1 ELSE 0 END) / COUNT(*), 1)
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND status IN ('completed', 'returned', 'cancelled')
```

**`breakdown` JSON esperado:**
```json
{
  "ordenes_sin_incidente_pct": 82,
  "incidentes": {
    "devoluciones_pct": 8,
    "reclamos_calidad_pct": 5,
    "errores_logisticos_pct": 3,
    "garantias_activas_pct": 2
  }
}
```

---

### Nodo 6: `senales_mercado` — Tendencias de mercado activas

| Campo | Valor esperado |
|---|---|
| `value_num` | Conteo de tendencias activas con cobertura en catálogo |
| `value_display` | `"14"` |
| `unit` | `"tendencias activas"` |

**Fuente de datos:** Esta métrica puede venir de Google Trends, búsquedas internas de la plataforma, o manual por el equipo de Marketing/Data. Necesitamos acordar la fuente.

**`breakdown` JSON esperado:**
```json
{
  "tendencias_activas": 14,
  "tendencias_sin_cobertura": 4,
  "top_tendencias": [
    {"nombre": "Belleza natural", "crecimiento_pct": 38},
    {"nombre": "Organización hogar", "crecimiento_pct": 29}
  ]
}
```

---

### Nodo 7: `adopcion_dropshipper` — Adopción promedio por producto

| Campo | Valor esperado |
|---|---|
| `value_num` | Promedio de dropshippers activos por producto (float) |
| `value_display` | `"1.4"` |
| `unit` | `"drops activos / producto"` |

**Query base:**
```sql
SELECT ROUND(AVG(drops_count)::numeric, 1) AS avg_drops
FROM (
  SELECT product_id, COUNT(DISTINCT dropshipper_id) AS drops_count
  FROM product_dropshippers
  WHERE status = 'active'
  GROUP BY product_id
) t
```

**`breakdown` JSON esperado:**
```json
{
  "promedio_general": 1.4,
  "por_segmento": {
    "activos_sanos": 4.2,
    "potencial_dormido": 0.8,
    "ruido": 0.1
  },
  "productos_sin_dropshipper": 420000
}
```

---

### Nodo 8: `suppliers_fuertes` — Suppliers con catálogo sano

| Campo | Valor esperado |
|---|---|
| `value_num` | Cantidad de suppliers con health_score ≥ 70 |
| `value_display` | `"312"` |
| `unit` | `"de X activos (Y%)"` (incluir total y porcentaje) |

**Definición supplier fuerte:** supplier con al menos el 60% de sus productos clasificados como `activo_sano` o `potencial_dormido`, y tasa de incidentes < 15%.

**`breakdown` JSON esperado:**
```json
{
  "suppliers_activos_total": 1847,
  "suppliers_fuertes": 312,
  "suppliers_fuertes_pct": 17,
  "gmv_concentracion_pct": 64,
  "debilidades_mas_comunes": {
    "stock_bajo_pct": 52,
    "contenido_incompleto_pct": 38,
    "alta_tasa_reclamos_pct": 10
  }
}
```

---

### Nodo 9: `categorias_fuertes` — Categorías con catálogo sano

| Campo | Valor esperado |
|---|---|
| `value_num` | Cantidad de categorías donde ≥ 40% de productos son `activo_sano` |
| `value_display` | `"7"` |
| `unit` | `"de 23 categorías"` |

**`breakdown` JSON esperado:**
```json
{
  "categorias_total": 23,
  "categorias_fuertes": 7,
  "categorias_en_alerta": 4,
  "top_categorias": ["Belleza & Cuidado", "Hogar & Deco", "Deportes"],
  "ventas_concentracion_pct": 71
}
```

---

### Nodos 10–13: Clasificación del catálogo (los 4 estados)

Estos 4 nodos usan la clasificación definida al inicio del documento.

| node_id | value_num | value_display | unit |
|---|---|---|---|
| `activos_sanos` | COUNT donde label = 'activo_sano' | `"183K"` | `"productos (X%)"` |
| `activos_riesgo` | COUNT donde label = 'activo_riesgo' | `"68K"` | `"productos (X%)"` |
| `potencial_dormido` | COUNT donde label = 'potencial_dormido' | `"248K"` | `"productos (X%)"` |
| `ruido_catalogo` | COUNT donde label = 'ruido' | `"500K"` | `"productos (X%)"` |

**Health de cada nodo:**
- `activos_sanos`: `good` si > 15%, `warning` si 8-15%, `critical` si < 8%
- `activos_riesgo`: `good` si < 5%, `warning` si 5-10%, `critical` si > 10%
- `potencial_dormido`: `good` siempre (es oportunidad)
- `ruido_catalogo`: `good` si < 30%, `warning` si 30-50%, `critical` si > 50%

**`breakdown` para `activos_sanos`:**
```json
{
  "count": 183200,
  "porcentaje": 18.3,
  "meta_trimestre": 220000,
  "gap_meta": 36800
}
```

**`breakdown` para `ruido_catalogo`:**
```json
{
  "count": 500000,
  "porcentaje": 50.1,
  "causas": {
    "sin_stock_activo_pct": 38,
    "contenido_incompleto_pct": 29,
    "sin_ventas_historicas_pct": 22,
    "duplicados_mal_config_pct": 11
  }
}
```

---

### Nodo 14: `disponibilidad` — Productos disponibles ahora mismo

| Campo | Valor esperado |
|---|---|
| `value_num` | Porcentaje de productos disponibles (stock + precio activo + sin bloqueo) |
| `value_display` | `"74%"` |
| `unit` | `"· 740K disponibles hoy"` |

**Diferencia con `stock`:** `stock` mide si tiene inventario, `disponibilidad` mide si puede recibir órdenes ahora (stock + precio activo + status no bloqueado).

---

### Nodo 15: `orden_sana` — Tasa de órdenes sin incidente

| Campo | Valor esperado |
|---|---|
| `value_num` | Porcentaje de órdenes completadas sin devolución, reclamo ni error logístico (30d) |
| `value_display` | `"76%"` |
| `unit` | `"sin incidente (30d)"` |

**Diferencia con `operacion`:** `operacion` se calcula sobre todos los productos del catálogo. `orden_sana` se calcula sobre las órdenes generadas. Son métricas relacionadas pero con denominadores distintos.

---

### Nodo 16: `atractivo_comercial` — Score comercial del catálogo

| Campo | Valor esperado |
|---|---|
| `value_num` | Score 0–10 (compuesto) |
| `value_display` | `"5.8"` |
| `unit` | `"/ 10 · score comercial"` |

**Fórmula:**
```
score = (margen_promedio_pct / 10) × 0.40
      + (competitividad_precio / 10) × 0.30
      + (tasa_conversion_pct / 5) × 0.30
```

**`breakdown` esperado:**
```json
{
  "margen_promedio_pct": 34,
  "competitividad_precio": 6.2,
  "visibilidad_busqueda": 5.1,
  "tasa_conversion_pct": 3.2
}
```

---

### Nodo 17: `demanda_probable` — Productos sin ventas con señal latente

| Campo | Valor esperado |
|---|---|
| `value_num` | COUNT de productos sin ventas en 30d que tienen ≥ 1 señal de demanda activa |
| `value_display` | `"124K"` |
| `unit` | `"con señal latente"` |

**Señales de demanda a considerar:**
- Búsquedas en la plataforma que coinciden con el producto (últimos 14d)
- Producto en wishlist de al menos 1 usuario (últimos 30d)
- Comparación de precio vs. competencia activa
- Pertenece a categoría con tendencia activa

---

### Nodo 18: `oportunidades_crecimiento` — Potencial dormido activable

| Campo | Valor esperado |
|---|---|
| `value_num` | COUNT de productos en `potencial_dormido` con ≥ 1 señal de demanda latente |
| `value_display` | `"248K"` |
| `unit` | `"productos activables"` |

**Nota:** En el estado actual del catálogo, prácticamente todo el potencial dormido con señal es oportunidad. A futuro se puede afinar con un score de probabilidad de conversión.

---

## Schema de la tabla destino

```sql
INSERT INTO catalog_metrics_daily (
  snapshot_date,   -- date · fecha del snapshot (YYYY-MM-DD)
  node_id,         -- text · uno de los 18 IDs definidos arriba
  value_num,       -- numeric · valor numérico crudo
  value_display,   -- text · valor formateado para mostrar ("61%", "740K", "67")
  unit,            -- text · etiqueta debajo del valor
  trend,           -- text · 'up' | 'down' | 'stable'
  trend_value,     -- text · "+5pp", "-4%", "→ estable"
  health,          -- text · 'good' | 'warning' | 'critical' | 'neutral'
  total_catalog,   -- integer · total de productos en catálogo ese día
  breakdown        -- jsonb · desglose adicional (ver specs por nodo)
)
VALUES (...);
```

**Conexión Supabase:**
- URL: `https://fwwkesboxlbmimzyoztq.supabase.co`
- Clave: SERVICE ROLE KEY (en `agente-delivery/.env` como `SUPABASE_SERVICE_KEY`)
- Solo el service role tiene permiso de escritura (INSERT/UPDATE)

---

## Criterios de aceptación

- [ ] Las 18 filas se insertan todos los días antes de las 6:00 AM COT
- [ ] Si el proceso falla, las filas del día anterior permanecen (el graph las muestra como fallback)
- [ ] El campo `total_catalog` refleja el total real de productos en el catálogo ese día
- [ ] La tendencia (`trend` / `trend_value`) se calcula vs. el snapshot de 7 días atrás
- [ ] El `breakdown` JSON incluye los campos especificados por nodo (mínimo)
- [ ] El proceso usa `ON CONFLICT DO UPDATE` para ser idempotente (se puede re-ejecutar sin duplicar)
- [ ] Los valores de `health` siguen los umbrales definidos por nodo en este documento

---

## Entregables esperados de Data

1. **Script / dbt model** que genera las 18 filas usando las queries de producción
2. **Cron configurado** que ejecuta el script diariamente a las 5:30 AM COT
3. **Documentación** de las fuentes de datos usadas para cada nodo (tabla/campo/DB de origen)
4. **Alertas** si el proceso no escribe las 18 filas esperadas

---

## Preguntas abiertas para alinear con Data

| # | Pregunta | Impacto |
|---|---|---|
| 1 | ¿Cuál es el campo exacto que indica "tiene stock disponible para venta" en producción? | Afecta `stock`, `disponibilidad`, clasificación |
| 2 | ¿Hay tabla de incidentes/reclamos de órdenes? ¿Qué tipos de incidentes existen? | Afecta `operacion`, `activos_riesgo`, `orden_sana` |
| 3 | ¿Cómo se registran los dropshippers que activan un producto? ¿Hay relación producto-dropshipper? | Afecta `adopcion_dropshipper` |
| 4 | ¿Existen datos de búsquedas en la plataforma por producto? | Afecta `demanda_probable`, `senales_mercado` |
| 5 | ¿Hay campo de `cost_price` o margen en la tabla de productos? | Afecta `atractivo_comercial` |
| 6 | ¿La clasificación `activo_sano/riesgo/dormido/ruido` ya existe en alguna tabla o es nueva? | Afecta los 4 nodos de clasificación |

---

**Contacto:** Jaime (Supplier Success) — jaime.guevara@dropi.co  
**Herramienta de destino:** Supplier Lab — `/supplier-graph/catalogo`
