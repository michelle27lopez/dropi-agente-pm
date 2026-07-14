// Contexto de research que fundamenta las recomendaciones de Gali en el paso de Espionaje.
// Síntesis de research-brain/RB-001 (comportamiento de dropshippers en creativos y ventas)
// y research-brain/RB-003 (reglas de selección de proveedor y stock de seguridad).

export const ESPIONAJE_RESEARCH_CONTEXT = `
## Metodología de espionaje validada (RB-001, 5 entrevistas a dropshippers colombianos)

Flujo de decisión de un dropshipper exitoso: Exploración/validación de producto → Definición de ángulo
de venta → Creación de creativo → Testeo con presupuesto mínimo → Escala (si convierte) o Descarte.

- Los dropshippers **novatos** copian el anuncio ganador sin entender por qué funcionó (segmentación,
  oferta, garantías) y por eso fallan al replicarlo.
- Los **avanzados** (ej. Cesar Ortegón, método de volumen y espionaje) parten del ángulo de venta y el
  dolor del cliente, no solo de la métrica del anuncio. Antes de copiar, preguntan: ¿qué dolor resuelve
  este anuncio y puedo comunicarlo igual de bien en mi landing?
- Error más común: incoherencia entre el ángulo del creativo y la oferta de la landing page (el
  anuncio promete una cosa, la página ofrece otra) — rompe el embudo aunque el anuncio "ganador" sea bueno.

## Umbrales de métricas (citados por los dropshippers entrevistados)

- **Hook Rate**: la señal más importante en video. >60% indica que el gancho retiene audiencia y vale
  la pena replicar el ángulo.
- **CTR**: valida si el creativo atrae tráfico, independiente de si convierte.
- **CPM**: relevante para decidir barato-para-testear cuando aún no hay conversiones.
- **CPA**: ideal $3.000–$4.000 COP, máximo aceptable $6.000 COP (mercado colombiano, productos
  $59.000–$89.000 COP). Si el CPA real supera 3x el calculado, hay riesgo de pérdida.
- **Umbral de apagado ("kill")**: si un creativo gasta $30.000–$40.000 COP sin generar ventas, se apaga
  y se prueba otro ángulo.
- **Días activo**: un anuncio con muchos días activo sin apagarse es señal de que está validado, no solo
  viral momentáneamente.

## Riesgo de saturación

Productos con demasiado volumen viral y mucha copia ("quemados") ya no convierten como al inicio — señal
de alerta cuando un anuncio lleva mucho tiempo replicado en la biblioteca sin variación de ángulo.

## Selección de proveedor (RB-003 — reglas que ya aplica el catálogo de Dropi)

- **Premium Exclusivo / Premium**: máxima prioridad, stock verificado, despacho <24h, riesgo de novedad
  <10%. Recomendado para presupuestos altos y escalar rápido.
- **Verificado**: riesgo medio (10–25% novedad), requiere confirmación activa por WhatsApp antes de
  despachar. Solo recomendable con presupuestos bajos y como advertencia visible.
- **Estándar**: excluido siempre — sin verificación física o mala reputación de despacho, riesgo >25%.
- El stock mínimo seguro escala con el presupuesto diario de pauta (a más presupuesto, más pedidos/día,
  más riesgo de quiebre de stock durante el lead time de reabastecimiento del proveedor, 5–15 días).

## Cómo debe razonar Gali con esto

Al evaluar un anuncio ganador espiado, Gali debe combinar: (1) qué tan fuerte es la señal del anuncio
(Hook Rate, CTR, CPM, días activo) con (2) si el ángulo de venta es replicable de forma coherente en una
landing propia, y (3) si el proveedor detrás del producto puede sostener la escala (tier de proveedor y
stock disponible). Un anuncio con métricas excelentes pero proveedor Estándar o sin stock real es una
mala recomendación.
`.trim();
