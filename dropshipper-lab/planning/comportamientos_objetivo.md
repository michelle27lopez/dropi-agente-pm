# 🎯 COMPORTAMIENTOS OBJETIVO INICIALES DE SELLER SUCCESS

Este documento establece la base metodológica para evaluar si una intervención de producto genera progreso real del seller y no solo actividad superficial (engagement theater). Se trabaja por capas, desde la activación temprana hasta la retención, documentando cada comportamiento con el formato: **persona / acción / momento / umbral**.

**Estado:** v0 en construcción. Algunos comportamientos están definidos como hipótesis operativas; su calibración final depende de los datos del beta y del cierre de supuestos críticos.

---

## 1. Estructura de Capas

Los comportamientos se organizan de lo más inmediato (upstream) a lo más tardío (downstream) para evitar optimizar actividad sin impacto en el negocio.

| Capa | Objetivo Conductual | Pregunta que Responde | Señal de Éxito (Ejemplo) |
| :--- | :--- | :--- | :--- |
| **Capa 0** | Activación por publicación sostenida y de calidad. | ¿El seller publica recurrentemente contenido con probabilidad real de conversión? | El 70% de los sellers del beta publican $\ge 4$ productos/semana con fotos y descripción completa. |
| **Capa 1** | Primera orden rentable. | ¿El seller logra una primera señal real de valor económico? | El seller genera una orden donde el ingreso neto es mayor a los costos de producto y envío en su primera semana. |
| **Capa 1.5** | Inversión / hábito post-venta. | ¿El seller entiende sus palancas de control y actúa para repetir el resultado? | El seller cambia el precio de un producto o publica uno similar tras ver que el primero se vendió, demostrando control. |
| **Capa 2** | Recurrencia de órdenes en activos. | ¿El seller sostiene órdenes mensuales mediante inventario competitivo y operación recurrente? | El seller mantiene un promedio de 15 órdenes/mes durante 3 meses consecutivos con stock siempre disponible. |

---

## 2. Comportamientos Objetivo Actuales

| Capa | Persona | Acción | Momento | Umbral | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Capa 0** | Bienvenido | Publicar productos de forma sostenida con calidad mínima de conversión. | Post-identificación de tendencia | $\ge 3$ productos por semana + criterio de calidad a definir | Hipótesis en calibración |
| **Capa 1** | Bienvenido | Generar su primera orden rentable. | Dentro de los primeros 14 días post-registro | Venta − Costo − Flete > 0 | Hipótesis sin calibrar |
| **Capa 1.5** | Explorador | Ajuste proactivo de catálogo o estrategia post-venta. | Después de la primera orden rentable y antes de consolidar recurrencia | Al menos 1 ajuste observable en producto, precio, contenido o inventario en las 48 horas post-venta | Nueva hipótesis |
| **Capa 2** | Explorador | Sostener recurrencia de órdenes mediante mantenimiento de inventario competitivo. | Posterior a la primera orden rentable y al primer ajuste post-venta | Órdenes/mes de sellers activos + inventario competitivo mantenido; umbral a definir con baseline real | Alinear con NSM |

---

## 3. Definiciones Operativas

### Definiciones Cerradas
*   **Orden rentable:** Ingreso de venta menos costo de producto del proveedor menos flete cobrado por la transportadora ($Venta - Costo - Flete > 0$).

### Definiciones en Construcción
*   **Seller Activo:** Seller que publica con una frecuencia suficiente para considerarse en uso sostenido. El umbral final se calibrará contra la distribución real del beta de Page Pilot y contra la realidad comercial observada por país, canal y perfil.
    *   *Cómo se hace:* Construir una cohorte de sellers participantes del beta, calcular publicaciones por semana por seller y comparar esa distribución contra órdenes generadas. No usar un umbral fijo hasta ver la data.
    *   *Ejemplo:* Si el P75 de publicación del beta es 4 productos/semana y ese grupo muestra mejor probabilidad de generar órdenes, el umbral operativo inicial de seller activo puede ser $\ge 4$ productos/semana.
*   **Segmentación de Perfiles:** Comercial definió la segmentación oficial de Dropshippers por órdenes mensuales. Estos niveles son outcomes, no comportamientos: sirven para segmentar la Persona en la fórmula conductual y para evitar asumir que todos los sellers deben moverse con el mismo umbral.

| Nivel | Nombre | Órdenes/mes | Uso Metodológico |
| :--- | :--- | :--- | :--- |
| **1** | Bienvenido | 0 – 100 | Activación, primera señal de valor y reducción de fricción inicial. |
| **2** | Explorador | 101 – 1.000 | Primeras ventas sostenidas, aprendizaje operativo y construcción de recurrencia. |
| **3** | Master | 1.001 – 2.500 | Operación estable; optimización de catálogo, margen e inventario competitivo. |
| **4** | Experto | 2.501 – 5.000 | Alto volumen; eficiencia operativa, control y escalabilidad. |
| **5** | Sabio VIP | 5.001 – 20.000 | Seller consolidado; foco en apalancamiento, predictibilidad y protección de volumen. |
| **6** | Leyenda | 20.001+ | Élite del ecosistema; necesidades avanzadas de operación, eficiencia y soporte. |

*   **Calidad de Publicación:** Criterio guardrail para evitar optimizar cantidad de publicaciones sin probabilidad de conversión.
    *   *Cómo se hace:* Definir un checklist mínimo por publicación y calcular qué porcentaje de publicaciones del seller lo cumple.
    *   *Ejemplo:* Una publicación es de calidad si tiene más de 3 fotos, descripción superior a 100 caracteres, precio con margen positivo, producto con stock disponible y proveedor con calificación mayor a 4.0.
*   **Inversión / Hábito Post-Venta:** Señal intermedia (Capa 1.5) entre primera orden y retención. Valida que el seller interprete el resultado, ajuste sus palancas de control y aumente la probabilidad de repetir órdenes.
    *   *Cómo se hace:* Instrumentar eventos posteriores a la primera orden rentable y medir si el seller realiza un ajuste observable en una ventana de 48 horas. Eventos: `product_update`, `price_change`, `stock_check`, `description_update`, `new_product_publish`.
*   **Inventario Competitivo:** Conjunto de productos activos que el seller mantiene con condiciones suficientes para sostener recurrencia (disponibilidad, precio, margen, contenido y logística).

---

## 4. Dependencias Críticas

| Dependencia | Tipo de Barrera | Qué Habilita | Impacto si no se Resuelve |
| :--- | :--- | :--- | :--- |
| **Baseline de publicación del beta** | Ability / medición | Calibrar el umbral de Capa 0, definir “Seller activo” con data real y separar actividad de publicación con calidad. | Capa 0 queda como hipótesis no confirmada y se corre el riesgo de optimizar engagement theater. |
| **Validación del Supuesto 0** | Ability / outcome | Confirmar si publicar más y mejor $\to$ más órdenes (Supuesto: publicar más y mejor $\to$ más órdenes). | Puede obligar a replantear Capa 0 como comportamiento objetivo o a mover el foco hacia catálogo o logística. |
| **Data de primera venta rentable** | Ability / medición | Calibrar ventana temporal y umbral observable de Capa 1. | Capa 1 queda definida solo a nivel de hipótesis conceptual sin distinguir valor real de actividad superficial. |
| **Eventos de ajuste post-venta** | Prompt / Ability | Medir Capa 1.5 observando ajustes de precio, catálogo o inventario en las 48h posteriores a la primera venta. | No se puede validar si el seller aprendió sus palancas de control o si la primera venta fue suerte. |
| **Definición de inventario competitivo** | Ability / depend. | Alinear Capa 2 con la NSM de Seller Success: órdenes/mes de sellers activos. | La retención queda desacoplada de la recurrencia e inventario competitivo mantenido. |

---

## 5. Lectura Actual

Hoy la mejor señal disponible está en Capa 0, porque el beta de Page Pilot permite observar comportamiento real de publicación. Sin embargo, no basta con medir publicación; se debe diferenciar publicación sostenida, con calidad mínima, y que efectivamente anteceda órdenes.

La Capa 1.5 se incorpora como señal de aprendizaje e inversión, y la Capa 2 se alinea con la NSM de Seller Success: **órdenes/mes de sellers activos**.

> [!IMPORTANT]
> Publicar más productos no debe asumirse como éxito final hasta confirmar el Supuesto 0. Si el análisis retrospectivo muestra que mayor publicación no mueve órdenes, el comportamiento objetivo de activación deberá replantearse de inmediato.
