-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: catalog_metrics_daily · Mock data para 18 nodos
-- Supplier Success Graph · Pulso Vivo del Catálogo
-- Catálogo simulado: 1,000,000 productos · Fecha: 2026-05-14
--
-- INSTRUCCIONES:
--   1. Ejecutar primero 001_catalog_metrics_migration.sql
--   2. Cambiar '2026-05-14' por la fecha real si es necesario
--   3. Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO catalog_metrics_daily
  (snapshot_date, node_id, value_num, value_display, unit, trend, trend_value, health, total_catalog, breakdown)
VALUES

-- ── NODO CENTRAL ─────────────────────────────────────────────────────────────
(
  '2026-05-14', 'pulso_catalogo',
  67, '67', '/ 100 · Salud Media',
  'up', '+3 vs mes ant.', 'warning', 1000000,
  '{
    "score_componentes": {
      "completitud_score": 12.2,
      "stock_score": 14.8,
      "demanda_score": 9.5,
      "operacion_score": 16.4,
      "adopcion_score": 7.0,
      "categorias_score": 7.1
    },
    "pesos": {
      "completitud": 0.20,
      "stock": 0.20,
      "demanda": 0.25,
      "operacion": 0.20,
      "adopcion": 0.15
    },
    "interpretacion": "El catálogo tiene salud media. La mitad (500K) es ruido sin valor real. El potencial dormido (248K) es la mayor oportunidad inmediata."
  }'::jsonb
),

-- ── DIMENSIONES DEL SCORE (inputs izquierda) ──────────────────────────────────
(
  '2026-05-14', 'completitud',
  61.0, '61%', 'de completitud promedio',
  'up', '+5pp', 'warning', 1000000,
  '{
    "productos_completos": 610000,
    "productos_incompletos": 390000,
    "por_categoria": {
      "hogar_pct": 48,
      "electronica_pct": 52,
      "moda_pct": 55,
      "belleza_pct": 71,
      "deportes_pct": 68
    },
    "campos_faltantes_mas_comunes": ["atributos", "descripcion_larga", "imagenes_secundarias"],
    "interpretacion": "El 39% del catálogo tiene fichas incompletas. Completar estas fichas puede mover ~156K productos al estado activo."
  }'::jsonb
),
(
  '2026-05-14', 'stock',
  740000, '740K', 'productos con stock (74%)',
  'stable', '→ estable', 'good', 1000000,
  '{
    "con_stock": 740000,
    "sin_stock": 260000,
    "sin_stock_breakdown": {
      "agotado_temporal_pct": 61,
      "discontinuado_pct": 24,
      "en_revision_pct": 15
    },
    "quiebre_top1000_pct": 8,
    "interpretacion": "740K productos disponibles. El 26% sin stock es mayoritariamente agotado temporal — oportunidad de recuperación rápida."
  }'::jsonb
),
(
  '2026-05-14', 'demanda',
  380000, '380K', 'productos con ventas (38%)',
  'up', '+6pp', 'warning', 1000000,
  '{
    "con_ventas_30d": 380000,
    "sin_ventas_30d": 620000,
    "gmv_concentracion_pct": 97,
    "sin_ventas_con_senal_latente": 124500,
    "interpretacion": "Solo el 38% generó ventas en 30 días. Los 380K activos concentran el 97% del GMV. 124K del 62% sin ventas tienen señales latentes."
  }'::jsonb
),
(
  '2026-05-14', 'operacion',
  82.0, '82%', 'sin incidentes operativos',
  'up', '+2pp', 'good', 1000000,
  '{
    "ordenes_sin_incidente_pct": 82,
    "incidentes": {
      "devoluciones_pct": 8,
      "reclamos_calidad_pct": 5,
      "errores_logisticos_pct": 3,
      "garantias_activas_pct": 2
    },
    "interpretacion": "82% de las órdenes sin fricción. Reclamos de calidad (5%) y devoluciones (8%) son las principales causas de fricción."
  }'::jsonb
),
(
  '2026-05-14', 'senales_mercado',
  14, '14', 'tendencias activas',
  'up', '+4 nuevas', 'good', 1000000,
  '{
    "tendencias_activas": 14,
    "tendencias_sin_cobertura": 4,
    "top_tendencias": [
      {"nombre": "Belleza natural", "crecimiento_pct": 38, "cobertura_catalogo": true},
      {"nombre": "Organización hogar", "crecimiento_pct": 29, "cobertura_catalogo": true},
      {"nombre": "Fitness en casa", "crecimiento_pct": 24, "cobertura_catalogo": true},
      {"nombre": "Eco-friendly", "crecimiento_pct": 21, "cobertura_catalogo": true},
      {"nombre": "Pet care premium", "crecimiento_pct": 18, "cobertura_catalogo": false}
    ],
    "interpretacion": "14 tendencias activas. 4 sin representación sólida en catálogo — oportunidad de sourcing para suppliers."
  }'::jsonb
),

-- ── ACTORES / CONTEXTO (top, bidireccionales) ─────────────────────────────────
(
  '2026-05-14', 'adopcion_dropshipper',
  1.4, '1.4', 'drops activos / producto',
  'up', '+0.2', 'warning', 1000000,
  '{
    "promedio_general": 1.4,
    "por_segmento": {
      "activos_sanos": 4.2,
      "activos_riesgo": 2.1,
      "potencial_dormido": 0.8,
      "ruido": 0.1
    },
    "productos_sin_dropshipper": 420000,
    "interpretacion": "Los activos sanos tienen 4.2x más adopción. Aumentar adopción en potencial dormido (0.8) es la palanca más directa para activar 248K productos."
  }'::jsonb
),
(
  '2026-05-14', 'suppliers_fuertes',
  312, '312', 'de 1,847 activos (17%)',
  'stable', '→ estable', 'warning', 1000000,
  '{
    "suppliers_activos_total": 1847,
    "suppliers_fuertes": 312,
    "suppliers_fuertes_pct": 17,
    "gmv_concentracion_pct": 64,
    "suppliers_con_debilidades": {
      "stock_bajo_pct": 52,
      "contenido_incompleto_pct": 38,
      "alta_tasa_reclamos_pct": 10
    },
    "umbral_health_score": 70,
    "interpretacion": "312 suppliers (17%) concentran el 64% del GMV. Fortalecer los 1.5K restantes es la apuesta de largo plazo."
  }'::jsonb
),
(
  '2026-05-14', 'categorias_fuertes',
  7, '7', 'de 23 categorías',
  'up', '+1', 'good', 1000000,
  '{
    "categorias_total": 23,
    "categorias_fuertes": 7,
    "categorias_en_alerta": 4,
    "categorias_debiles": 12,
    "top_categorias": [
      "Belleza & Cuidado", "Hogar & Deco", "Deportes",
      "Tecnología Básica", "Moda Mujer", "Bebé", "Mascotas"
    ],
    "ventas_concentracion_pct": 71,
    "interpretacion": "7 categorías concentran el 71% de las ventas. 4 en alerta por alto porcentaje de ruido de catálogo."
  }'::jsonb
),

-- ── SALIDAS DE SALUD (derecha) ────────────────────────────────────────────────
(
  '2026-05-14', 'activos_sanos',
  183200, '183K', 'productos (18.3%)',
  'up', '+12%', 'good', 1000000,
  '{
    "count": 183200,
    "porcentaje": 18.3,
    "criterios": {
      "tiene_stock": true,
      "tiene_ventas_30d": true,
      "sin_incidentes": true,
      "completitud_min": 80
    },
    "meta_trimestre": 220000,
    "gap_meta": 36800,
    "interpretacion": "Son el motor del GMV. Meta Q2: 220K. Gap de 36.8K que se cubre activando potencial dormido de mayor calidad."
  }'::jsonb
),
(
  '2026-05-14', 'activos_riesgo',
  68400, '68K', 'productos (6.8%)',
  'down', '-4%', 'critical', 1000000,
  '{
    "count": 68400,
    "porcentaje": 6.8,
    "causas": {
      "quiebres_stock_pct": 41,
      "reclamos_calidad_pct": 31,
      "problemas_entrega_pct": 18,
      "garantias_activas_pct": 10
    },
    "tendencia_positiva": true,
    "interpretacion": "68.4K generan ventas pero también fricciones. La tendencia baja (-4%) es positiva. Principal causa: quiebres de stock (41%)."
  }'::jsonb
),
(
  '2026-05-14', 'atractivo_comercial',
  5.8, '5.8', '/ 10 · score comercial',
  'up', '+0.4', 'warning', 1000000,
  '{
    "score_global": 5.8,
    "componentes": {
      "margen_promedio_pct": 34,
      "competitividad_precio": 6.2,
      "visibilidad_busqueda": 5.1,
      "tasa_conversion_pct": 3.2
    },
    "area_mejora_principal": "tasa_conversion",
    "interpretacion": "Margen sano (34%) pero conversión baja (3.2%). Mejorar visibilidad en búsqueda es el leverage más directo."
  }'::jsonb
),
(
  '2026-05-14', 'demanda_probable',
  124500, '124K', 'con señal latente',
  'up', '+11%', 'good', 1000000,
  '{
    "count": 124500,
    "breakdown_senal": {
      "busquedas_plataforma_pct": 48,
      "wishlist_pct": 22,
      "comparacion_precios_pct": 18,
      "tendencia_categoria_pct": 12
    },
    "en_potencial_dormido_pct": 48,
    "conversion_estimada_4s_pct": 22,
    "interpretacion": "124.5K productos sin ventas con señal activa. Si se activan con visibilidad, ~27K (22%) convertirían en 4 semanas."
  }'::jsonb
),
(
  '2026-05-14', 'potencial_dormido',
  248400, '248K', 'productos (24.8%)',
  'stable', '→ sin cambio', 'warning', 1000000,
  '{
    "count": 248400,
    "porcentaje": 24.8,
    "con_stock_pct": 63,
    "con_contenido_completo_pct": 78,
    "drops_promedio": 0.8,
    "top10_activable": 24840,
    "gmv_estimado_activacion_pct": 18,
    "interpretacion": "248.4K listos pero sin activar. El 63% tiene stock y el 78% tiene contenido completo. Activar el top 10% estima +18% de GMV."
  }'::jsonb
),
(
  '2026-05-14', 'ruido_catalogo',
  500000, '500K', 'productos (50.1%)',
  'down', '-8% trim.', 'critical', 1000000,
  '{
    "count": 500000,
    "porcentaje": 50.1,
    "causas": {
      "sin_stock_activo_pct": 38,
      "contenido_incompleto_pct": 29,
      "sin_ventas_historicas_pct": 22,
      "duplicados_mal_config_pct": 11
    },
    "reduccion_20pct_impacto": "Libera capacidad operativa significativa y mejora métricas de catálogo",
    "interpretacion": "500K sin valor real. La tendencia baja (-8%) indica progreso. Reducir un 20% adicional (100K) es la meta del trimestre."
  }'::jsonb
),

-- ── OPORTUNIDAD Y RESULTADO (abajo) ──────────────────────────────────────────
(
  '2026-05-14', 'oportunidades_crecimiento',
  248400, '248K', 'productos activables',
  'up', '↑ alta prioridad', 'good', 1000000,
  '{
    "count": 248400,
    "top10_count": 24840,
    "gmv_incremento_estimado_pct": 18,
    "plazo_estimado": "1 trimestre",
    "palancas": ["visibilidad en búsqueda", "adopción dropshipper", "completitud de ficha"],
    "interpretacion": "Activar el top 10% (24.8K) del potencial dormido estima +18% GMV. Es la iniciativa de mayor ROI para Supplier Success este trimestre."
  }'::jsonb
),
(
  '2026-05-14', 'disponibilidad',
  74.0, '74%', '· 740K disponibles hoy',
  'stable', '→ estable', 'good', 1000000,
  '{
    "disponibles": 740000,
    "no_disponibles": 260000,
    "no_disponibles_breakdown": {
      "sin_stock_pct": 68,
      "precio_inactivo_pct": 18,
      "en_revision_pct": 14
    },
    "interpretacion": "740K disponibles para generar órdenes ahora mismo. El 18% con precio inactivo es recuperable sin intervención de supplier."
  }'::jsonb
),
(
  '2026-05-14', 'orden_sana',
  76.0, '76%', 'sin incidente (30d)',
  'up', '+3pp', 'good', 1000000,
  '{
    "ordenes_sin_incidente_pct": 76,
    "ordenes_con_incidente_pct": 24,
    "incidentes_breakdown": {
      "devoluciones_pct": 10,
      "reclamos_pct": 8,
      "logistica_pct": 6
    },
    "tendencia": "mejorando",
    "interpretacion": "76% de órdenes sin fricción, mejorando +3pp. Los reclamos (8%) tienen la mayor oportunidad de reducción con validación de calidad."
  }'::jsonb
)

ON CONFLICT (snapshot_date, node_id) DO UPDATE SET
  value_num     = EXCLUDED.value_num,
  value_display = EXCLUDED.value_display,
  unit          = EXCLUDED.unit,
  trend         = EXCLUDED.trend,
  trend_value   = EXCLUDED.trend_value,
  health        = EXCLUDED.health,
  total_catalog = EXCLUDED.total_catalog,
  breakdown     = EXCLUDED.breakdown;
