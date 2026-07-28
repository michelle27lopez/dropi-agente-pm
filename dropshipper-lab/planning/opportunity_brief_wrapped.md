# 🎁 OPPORTUNITY BRIEF & PITCH: Dropi Wrapped (PROD-WRAPPED)

* **Célula:** Seller Success
* **PM:** Santiago Herrera Acosta
* **Fecha:** 2026-07-27
* **Prioridad:** Medium
* **Apetencia:** 2 semanas de diseño y preparación del test concierge en agosto 2026.

---

## 1. El Problema (Problem)

### Descripción del problema
Los dropshippers activos experimentan periodos intermitentes de venta. Tras finalizar una campaña publicitaria exitosa o entre picos comerciales, tienden a desconectarse de la plataforma y dejan de iniciar sesión. El progreso histórico de su negocio permanece invisible ("caja negra" in-app), lo que enfría su motivación, rompe la consistencia operativa y dilata el inicio de nuevos testeos de pauta.

### Comportamiento actual
El seller vende, el pico comercial termina, y el usuario entra en un estado de inactividad temporal (in-app churn). No percibe su progreso consolidado de rentabilidad y volumen acumulado, por lo que no tiene un disparador claro para volver a encender campañas.

### Comportamiento objetivo
El dropshipper abre su retrospectiva de fin de ciclo, valida de forma visual su progreso e identidad de éxito, identifica la ruta logística y el producto que ya le funcionan con menor fricción, y reactiva sus ventas (genera $\ge 1$ orden) en un periodo $\le 7$ días.

---

## 2. Propósito y Outcomes

Toda la intervención se diseña para reactivar el ciclo de ventas del dropshipper, evitando tratar el feature como un simple reporte informativo estático.

| Tipo de Métrica | Nombre del Indicador | Baseline | Meta del Experimento |
| :--- | :--- | :--- | :--- |
| **Business Outcome** *(Lagging)* | Órdenes mensuales de sellers activos (NSM de la célula). | Promedio actual de la base. | Palanca de incremento en volumen. |
| **Product Outcome** *(Leading)* | % de sellers inactivos temporales que registran $\ge 1$ orden en $\le 7$ días. | Tasa de reactivación espontánea. | **$\ge 20\%$ de incremento** en cohorte piloto vs. control. |
| **Actividad** *(Métricas UX)* | Tasa de completitud del Wrapped (Slide 0 a 9). | N/A | $\ge 75\%$ de usuarios que inician. |
| **Actividad** *(Métricas UX)* | Clics en el botón "Compartir mi Wrapped" (Investment). | N/A | $\ge 30\%$ de los finalistas. |

---

## 3. Diagnóstico Conductual (B=MAP)

### Causa raíz
* **Motivation (M) — Baja en periodos valle:** El esfuerzo y los logros acumulados del seller son invisibles. El Wrapped ataca esto aplicando el principio de *"Show what motivates"*, convirtiendo métricas transaccionales frías en validadores emocionales (GMV movilizado, percentiles de éxito y arquetipos).
* **Ability (A) — Fricción de decisión:** Ante la pregunta "¿qué vendo ahora o dónde pauto?", el Wrapped expone de forma directa su producto estrella y su "ruta campeona" (menor índice de novedades), reduciendo la fricción cognitiva de la siguiente decisión logística.
* **Prompt (P) — Gatillo ausente:** No existen estímulos in-app contextuales que disparen el retorno en periodos de inactividad. El Wrapped actúa como un trigger de urgencia e identidad.

### Dinámicas conductuales aplicadas

```
   TRIGGER (Wrapped) → ACCIÓN (Slide show) → RECOMPENSA (Percentil/Arquetipo) → INVERSIÓN (Compartir/Meta)
```

1. **Loss Aversion (Racha - Slide 6):** Enmarca la inactividad como una pérdida inminente de su consistencia lograda ("18 semanas seguidas, no rompas tu racha esta semana").
2. **Goal-Gradient Effect (Slide 9):** La cercanía a la meta de ascenso de categoría (meta de 1.000 órdenes, faltan 180) acelera el empuje final del seller gracias a la visibilidad del beneficio asociado (comisiones preferentes).
3. **Comparación Social Positiva (Slide 7):** Posicionamiento en el percentil superior (Top 7%) para construir identidad de competencia y Mastery ( relatedness en SDT), excluyendo dinámicas de humillación o leaderboards negativos (anti-roadmap).
4. **Identidad Compartible (Slide 8):** El arquetipo lúdico ("La Escaladora Nocturna") actúa como un elemento socialmente compartible que promueve la adquisición orgánica de nuevos dropshippers.

---

## 4. Plan de Validación (Piloto Concierge)

### El supuesto más riesgoso
> "Visualizar el progreso consolidado y la meta de volumen acumulado de forma interactiva estimula al dropshipper inactivo a reactivar sus pautas y generar órdenes en los siguientes 7 días."

Si este supuesto es falso, el Wrapped se convierte en una visualización costosa de desarrollo sin impacto en el NSM de la célula.

### Diseño del Experimento Barato (Concierge)
Para validar la hipótesis sin comprometer desarrollo core de frontend/backend, ejecutaremos un test controlado en agosto:

1. **Selección de la Muestra:** Identificar **60 dropshippers** que cumplan con:
   * Historial de $\ge 20$ ventas entregadas en Dropi.
   * Inactividad de ventas de entre 10 y 20 días en la plataforma.
2. **Segmentación:** Dividir aleatoriamente en:
   * **Grupo Piloto (30 sellers):** Recibirán su Wrapped personalizado.
   * **Grupo Control (30 sellers):** No recibirán ninguna comunicación o recibirán el correo genérico de reactivación.
3. **Ejecución Concierge:** El equipo generará la data histórica real desde Supabase para los 30 de la cohorte piloto y les enviará el prototipo HTML personalizado vía correo o mensaje directo.
4. **Medición (Septiembre):** Comparar la tasa de reactivación de ventas y volumen de órdenes de ambos grupos en la ventana de 7 días.

---

## 5. Limitaciones y Gaps de Conocimiento

* `[DATO FALTANTE]` Fórmulas exactas para agrupar variables temporales y definir arquetipos lúdicos automáticos en la base de datos real.
* `[CONFIRMAR]` Tasa de conversión y retención del canal de referidos al compartir el arquetipo (hipótesis de adquisición orgánica).
* `[HIPÓTESIS]` Canal óptimo de entrega del trigger de Wrapped (Email transaccional vs. Notificación push in-app).

---

## 🏁 Criterios de Aceptación (DoD) para PROD-WRAPPED

El ticket de Jira `PROD-WRAPPED` se considerará cerrado cuando se cumpla lo siguiente:
* [ ] **Data de cohorte piloto extraída** y segmentada (30 Grupo Piloto / 30 Grupo Control).
* [ ] **Prototipos HTML personalizados enviados** a los 30 dropshippers del piloto de forma directa.
* [ ] **Métricas de retorno y órdenes de compra cruzadas** en Supabase a los 7 días de envío.
* [ ] **Documento de decisión (Escalar / Iterar / Matar) firmado** por el Product Trio con base en el impacto de conversión del piloto.
