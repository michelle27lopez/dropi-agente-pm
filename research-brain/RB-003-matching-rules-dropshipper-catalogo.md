# RB-003 — Reglas de Negocio: Selección de Proveedores y Fórmulas de Seguridad de Stock

---

## Metadatos

| Campo | Valor |
|---|---|
| **ID** | RB-003 |
| **Fecha de creación** | 2026-06-23 |
| **Iniciativa relacionada** | Selección de Producto, Evaluación de Proveedores, Automatización de Campañas (Roax/ADA Spy) |
| **Segmento investigado** | Dropshippers Latinoamericanos (Cuidado del Presupuesto y Mitigación de Quiebres de Stock) |
| **Fuente** | Consolidación de metodologías de escala (RB-001) + Análisis logístico de devolución/COD (RB-002) |
| **Nivel de confianza** | **Alto** — Construido sobre el análisis cuantitativo de tiempos de reposición de inventario y CPA promedio en Colombia |
| **Tags** | catálogo, proveedores, stock-seguridad, presupuesto, CPA, premium, verificado, fórmulas |

---

## Introducción y Contexto

El modelo de dropshipping de pago contra entrega (COD) en Latinoamérica castiga fuertemente la falta de stock y la lentitud de despacho. De acuerdo con el research cualitativo (`RB-001`), un dropshipper en escala puede quemar rápidamente su presupuesto publicitario si el proveedor se queda sin inventario o no procesa las novedades logísticas a tiempo.

Este documento establece las reglas formales de asignación y recomendación inteligente que el agente Gali utiliza al guiar a un dropshipper en la selección de su producto, garantizando:
1. **Calidad del proveedor:** Priorizando bodegas con historial óptimo de despacho.
2. **Seguridad de stock:** Exigiendo un inventario mínimo directamente proporcional a su presupuesto diario de pauta.

---

## 1. Niveles de Verificación de Proveedores

Para reducir el riesgo de devoluciones por retrasos o empaques de mala calidad, los proveedores se clasifican en cuatro categorías. El agente ADA Spy filtra el catálogo excluyendo los niveles inferiores y priorizando los superiores:

```
[ Premium Exclusivo / Premium ]  -->  1ª Prioridad (Máxima confianza, stock real verificado y envíos en <24h)
       [ Verificado ]           -->  2ª Prioridad (Riesgo medio, requiere confirmación activa de WhatsApp)
       [ Estándar ]            -->  EXCLUIDOS (Falta de documentación, demoras operativas frecuentes)
```

### Tabla de Niveles de Proveedor

| Nivel de Proveedor | Criterio de Selección | Riesgo Asociado | Acciones Recomendadas |
|---|---|---|---|
| **Premium Exclusivo** | Stock físico en bodega de Dropi. Despacho automatizado <12h. Material de marketing en HD verificado. | **Muy Bajo (<5% novedad)** | Recomendado para presupuestos altos y escala rápida. |
| **Premium** | Proveedor con alta calificación, despacho <24h. Historial de más de 500 despachos mensuales. | **Bajo (5-10% novedad)** | Excelente opción para testeo y consolidación. |
| **Verificado** | Proveedor registrado con documentos al día, pero con menor volumen de despachos o stock fluctuante. | **Medio (10-25% novedad)** | Permitido solo con presupuestos bajos y con advertencia visual de confirmación por WhatsApp (Chatea Pro). |
| **Estándar** | Sin verificación física, datos incompletos o mala reputación de despacho. | **Alto (>25% novedad)** | **Bloqueado por el Agente**. No se recomienda al dropshipper bajo ninguna circunstancia. |

---

## 2. Fórmula Matemática de Stock de Seguridad

Cuando un dropshipper incrementa su presupuesto diario, el número de pedidos diarios promedio aumenta. Si el stock disponible es bajo, el producto se agotará antes de que el proveedor logre reabastecerse (proceso que toma de 5 a 15 días en importaciones o distribución local).

Para mitigar esto, se define la siguiente **Fórmula de Cobertura de Stock de Seguridad ($Stock_{min}$)**:

$$Stock_{min} = \max\left(Stock_{floor}, \frac{\text{Presupuesto Diario}}{\text{CPA Promedio}} \times T_{reabastecimiento} \times F_{escala}\right)$$

### Parámetros de la Fórmula:
- **$\text{CPA Promedio}$**: $\$15,000\text{ COP}$. Es el costo de adquisición de cliente promedio en el mercado colombiano para productos de precio masivo ($59,000$ a $89,000$ COP).
- **$T_{reabastecimiento}$**: $15$ días. Tiempo de lead time promedio requerido por un proveedor para reponer inventario en su bodega local o despachar un lote mayor.
- **$F_{escala}$**: $3$. Factor multiplicador que asegura cobertura en caso de que la campaña sea exitosa y el usuario decida duplicar o triplicar el presupuesto de pauta inmediatamente para escalar el primer día.
- **$Stock_{floor}$**: $100$ unidades. El inventario mínimo absoluto necesario para iniciar cualquier testeo publicitario, previniendo quiebres tempranos (ver validación en `RB-001`).

### Tiers de Presupuesto Aplicados:

| Presupuesto Diario ($B$) | Pedidos/Día Est. | Stock Mínimo Calculado | Regla Práctica del Agente |
|---|---|---|---|
| **Bajo** ($< \$50K$ COP) | 2 - 3 | 100 - 150 unidades | **Min. 100 unidades** (Floor). Seguro para testeo inicial. |
| **Medio** ($\$50K - \$100K$ COP) | 3 - 6 | 150 - 300 unidades | **Min. 300 unidades**. Requiere consistencia en la bodega. |
| **Alto** ($&gt; \$100K$ COP) | 6 - 13+ | 300 - 600+ unidades | **Min. 500 unidades**. Requiere proveedor Premium/Exclusivo. |

---

## 3. Lógica de Consulta y Query del Agente

Para realizar recomendaciones acertadas, el chatbot Gali traduce las respuestas del dropshipper en parámetros estructurados para consultar la base de datos de productos (incluso simulando catálogos de 1 millón de ítems):

1. **Paso 1 (Nicho):** Filtra por la propiedad `categoria` de los productos.
2. **Paso 2 (Presupuesto):** Ejecuta la fórmula de Stock de Seguridad para definir la cota inferior:
   `MIN_STOCK = calculateMinStock(UserDailyBudget)`.
   Solo se consideran productos con `stock &gt;= MIN_STOCK`.
3. **Paso 3 (Proveedor):** Genera la condición:
   `proveedor_tier IN ('Premium Exclusivo', 'Premium', 'Verificado')` (excluyendo 'Estándar').
   Si el catálogo contiene opciones mixtas, se ordena con prioridad descendente por `proveedor_tier` y luego por `ada_score`.
4. **Paso 4 (Advertencias):** Si el producto seleccionado tiene `proveedor_tier === 'Verificado'`, se activa una regla de recomendación logística en la pauta: *Activar confirmación obligatoria por WhatsApp con Chatea Pro para disminuir el riesgo de novedades.*
