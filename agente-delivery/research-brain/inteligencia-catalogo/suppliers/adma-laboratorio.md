# ADMA LABORATORIO
**Fecha revisión:** 2026-05-28
**Revisado por:** Jaime
**Rank:** #3 de 67
[← Volver al índice](../_index.md)

**Datos completos:** [adma-datos.md](adma-laboratorio-data/adma-datos.md) · CSVs en `adma-laboratorio-data/`
**Excel original:** `agente-delivery/Documentos/dropi researc/inteligencia_catalogo_adma_research_v8_detalle_productos.xlsx`

> **⚠️ Nota de datos:** El índice del proyecto registra 529,837 órdenes y 1,461 productos vigentes para ADMA LABORATORIO (dato de BI). El perfil visible en Dropi UI muestra 28,881 órdenes históricas y 3,086 productos. La discrepancia supera el rango observado en GOLDBOX y TIENDA OSHOP (1.5–2x). Puede indicar que el perfil investigado corresponde a una entidad ADMA distinta. Pendiente de confirmar con equipo Datos.

---

## 1. Datos base

| Variable | Dato |
|----------|------|
| Productos visibles en perfil | 3,086 |
| Productos en base inicial | 3,086 |
| Órdenes históricas (perfil) | 28,881 |
| Órdenes históricas (índice BI) | 529,837 |
| Dropshippers | 857 |
| Tiempo de despacho | 5 h |
| Bodegas | Bogotá / Cali / Los Patios / Medellín |
| Calificación últimos 30 días | Óptima |
| Estado | Premium |
| En Dropi desde | 25/05/2020 |

---

## 2. Composición del catálogo

| Categoría | Presencia visible | % muestra (116 productos) |
|-----------|------------------|--------------------------|
| Hogar | Alta | 24% |
| Bienestar | Alta | 15% |
| Cocina | Alta | 14% |
| Belleza | Media | 10% |
| Vehículos | Media | 10% |
| Tecnología | Media | 6% |
| Juguetería | Baja / media | 4% |
| Deportes | Baja | 3% |
| Bebé / Mascotas / Herramientas / Moda / Otro | Puntual | <3% c/u |

**Categorías distintas visibles en muestra:** 14
**Categoría dominante:** Hogar / Bienestar / Cocina
**Tipo de catálogo:** Generalista multicategoría — sin vertical dominante clara

---

## 3. Muestra de productos

Revisados 16 productos en detalle. Muestra de catálogo: 116 productos de 5 pantallazos.

---

## 4. Calidad de contenido

| Variable | Observación |
|----------|-------------|
| Cantidad de imágenes | Mayoría con 3-4 imágenes visibles |
| Descripción específica | Alta — 15 de 16 productos tienen descripción |
| Descripción extensa | Presente en varios; varios exceden el pantallazo |
| Texto genérico repetido | **0 de 16 productos** |
| Beneficios visibles | Sí, en mayoría de productos |
| Especificaciones visibles | Presente en muchos — características técnicas, medidas, materiales |
| Modo de uso | Visible en algunos |
| Garantías | Presente en algunos (pestaña visible, no abierta en mayoría) |
| Recursos adicionales | Pestaña visible, no confirmada |
| Contenido mal renderizado | **1 caso** — Mascarilla De Colágeno X5 muestra texto tipo JSON crudo visible en pantalla |
| Productos sin descripción | **1 de 16** — Tablero De Juego X2 |

---

## 5. Stock y precios

| Variable | Observación |
|----------|-------------|
| Stock público | 14 de 16 con stock disponible |
| Productos agotados | **2 de 16** — Tablero De Juego X2, Par De Guantes Para Artritis L |
| Stock privado | 0 en todos los productos de la muestra |
| Productos con stock ≤ 5 | **3 de 16** — Fuente Mascotas (1), Tijera Clever (2), Guante Calor (5) |
| Precio proveedor promedio | ~$28,514 |
| Precio sugerido promedio | ~$67,225 |
| Diferencial promedio | ~$38,711 (~189%) |
| Productos tipo Variable | 3 de 16 — Termo Inteligente, Cepillo Dental, Mini Rizador |

> El diferencial de precio (~189%) es significativamente mayor que GOLDBOX (~88%) y TIENDA OSHOP (~30%). Los productos de bienestar/belleza tienen precios proveedor muy bajos ($10,000–$20,000) y precios sugeridos altos ($49,900–$59,900).

---

## 6. Lectura PM

**Primera lectura de productividad**

| Supplier | Productos | Órdenes | Dropshippers | Órdenes/producto | Órdenes/dropshipper |
|----------|-----------|---------|--------------|-----------------|---------------------|
| GOLDBOX | 620 | 668,159 | 4,683 | 1,078 | 143 |
| TIENDA OSHOP | 672 | 401,005 | 4,769 | 597 | 84 |
| ADMA | 3,086 | 28,881 | 857 | 9 | 34 |

> ADMA tiene casi 5x más productos que GOLDBOX y TIENDA OSHOP, pero muchas menos órdenes históricas y menos dropshippers asociados. Esto lo convierte en un caso clave para investigar si un catálogo masivo puede tener baja productividad relativa.

**Señales positivas**

| Frente | Señal |
|--------|-------|
| Operación | Tiempo de despacho 5h, calificación óptima |
| Cobertura logística | 4 bodegas visibles — mayor cobertura geográfica que GOLDBOX y TIENDA OSHOP |
| Antigüedad | En Dropi desde 2020 — el más antiguo de los investigados |
| Tamaño catálogo | 3,086 productos visibles — catálogo más grande de los investigados |
| Precio | Diferencial alto (~189%) — margen potencial visible para dropshippers |
| Contenido | 0 texto genérico — varios productos con descripción técnica extensa |

**Señales de revisión**

| Frente | Señal |
|--------|-------|
| Productividad | 9 órdenes por producto vs 1,078 de GOLDBOX — brecha masiva |
| Adopción | 857 dropshippers — 5x menos que GOLDBOX y TIENDA OSHOP |
| Stock | 2 agotados + 3 con stock ≤5 en muestra de 16 |
| Contenido roto | 1 producto con texto tipo JSON mal renderizado en descripción |
| Catálogo disperso | 14 categorías sin vertical dominante clara — alta fragmentación |
| Naming | Errores ortográficos, nombres incompletos o poco claros |
| Calidad desigual | Hay productos con buena ficha y productos sin descripción |
| Posible ruido | Catálogo grande con posible long tail de baja venta |

---

## 7. Hipótesis

**H1 — Catálogo masivo puede tener baja proporción de productos productivos**
ADMA tiene 3,086 productos pero solo 28,881 órdenes históricas (9 por producto). GOLDBOX tiene 620 productos y 668,159 órdenes (1,078 por producto). La amplitud de catálogo no garantiza productividad.

**H2 — Dispersión de categorías sin foco reduce tracción por vertical**
A diferencia de GOLDBOX (especializado en belleza/salud), ADMA tiene 14 categorías sin una dominante clara. Sin foco, el dropshipper tiene menos señales sobre qué vender y puede no asociar al supplier con ninguna vertical ganadora.

**H3 — Calidad de contenido debe medirse por estructura, no solo por extensión**
ADMA tiene 0 texto genérico y varios productos con descripción larga, pero hay un producto con contenido mal renderizado (JSON visible) y uno sin descripción. La extensión no garantiza utilidad comercial.

**H4 — Buena operación visible no garantiza productividad de catálogo**
ADMA tiene calificación óptima, despacho de 5h y 4 bodegas — señales operativas positivas. Sin embargo, tiene la menor adopción y productividad histórica de los 3 suppliers revisados.

**H5 — Productos agotados y stock bajo generan fricción para el dropshipper**
2 productos agotados y 3 con stock ≤5 en una muestra de 16 sugieren un catálogo con ruido de disponibilidad. Si esto se replica a escala de 3,086 productos, puede estar generando una mala experiencia de selección.

---

## 8. Síntesis documentable

ADMA es un supplier Premium con 3,086 productos visibles, 28,881 órdenes históricas (según perfil), 857 dropshippers y tiempo de despacho de 5 horas. Está en Dropi desde mayo de 2020, es el más antiguo de los suppliers investigados, y cuenta con 4 bodegas visibles (Bogotá, Cali, Los Patios, Medellín). Su catálogo es masivo y multicategoría, con presencia en hogar, bienestar, cocina, belleza, vehículos y tecnología, sin una vertical dominante clara. En la muestra de 16 productos, todos tienen stock privado en 0, 15 tienen descripción específica con 0 texto genérico, pero se observan 2 productos agotados, 3 con stock muy bajo y 1 con contenido mal renderizado. ADMA representa el caso más extremo de baja productividad relativa frente al tamaño del catálogo: 9 órdenes por producto vs 1,078 de GOLDBOX. Esto lo convierte en un caso clave para investigar si el problema es el catálogo, la adopción por dropshippers, la categorización, o una combinación de los tres.

---

## Comparación acumulada — 3 suppliers investigados

| Variable | GOLDBOX (#1) | TIENDA OSHOP (#2) | ADMA (#3) |
|----------|-------------|------------------|-----------|
| Productos visibles | 620 | 672 | 3,086 |
| Órdenes históricas | 668,159 | 401,005 | 28,881 |
| Órdenes / producto | 1,078 | 597 | 9 |
| Dropshippers | 4,683 | 4,769 | 857 |
| Órdenes / dropshipper | 143 | 84 | 34 |
| Tiempo despacho | 5 h | 5 h | 5 h |
| Bodegas | 1 | 2 | 4 |
| Estado | Premium | Exclusivo | Premium |
| En Dropi desde | 04/2024 | 09/2022 | 05/2020 |
| Tipo de catálogo | Especializado | Generalista | Generalista masivo |
| Categorías distintas | ~4 | 18 | 14 |
| Texto genérico | 8/10 | 0/19 | 0/16 |
| Productos agotados (muestra) | 0/10 | 0/19 | 2/16 |
| Stock muy bajo ≤5 (muestra) | 1/10 | 0/19 | 3/16 |
| Precio proveedor prom. | ~$17,111 | ~$39,393* | ~$28,514 |
| Diferencial prom. | ~88% | ~30% | ~189% |

*Precio proveedor de TIENDA OSHOP calculado sobre muestra de 150 productos; el detalle de 19 da ~$50,826.

**Pregunta clave emergente:** ¿La baja productividad de ADMA se explica por el catálogo (muchos productos de baja demanda), por la adopción (pocos dropshippers activos), por la categorización (sin foco claro), o por los datos históricos que estamos usando? Esta es la pregunta que la data de BI debe responder.
