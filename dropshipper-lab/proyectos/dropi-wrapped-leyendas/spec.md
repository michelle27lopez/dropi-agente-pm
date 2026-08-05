# 🏆 Especificación de Proyecto: Dropi Wrapped Leyendas 2026 (`PROD-WRAPPED`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-WRAPPED`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Explore** (Prototipo HTML/JS Listo e Interactivo)
* **Estado Interno:** 🚀 Double Down (Lanzamiento en Showcase CPO)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Churn de sellers Pareto por falta de sentido de pertenencia y falta de reconocimiento visual de su progreso transaccional en la plataforma.
* **Fricción Identificada:** Desconexión entre los hitos transaccionales del seller (alcanzar 100, 1.000 o 10.000 órdenes) y su estatus/beneficios in-app.
* **Cita del Seller:** *"Llevo vendiendo millones en Dropi y la plataforma no me da ningún beneficio ni reconocimiento exclusivo."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Variables `real_orders_delivered`, `dias_en_activarse` y `real_dropshipper_clients` en `userpilot_suppliers`.
* **Métrica Factual:** Cruzar la barrera de **100 órdenes entregadas reduce el churn a los 30 días en un 82%**.
* **Baseline vs. Meta:**
  * *Retención a 30 días (Supervivencia):* Baseline **69.38%** $\to$ **Meta 75.0%**.
  * *Insignias Compartidas en Redes (Virallity):* Baseline 0 $\to$ **Meta $\ge 1.000$ compartidos en el evento**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Motivación Intrínseca: Estatus, Orgullo y Estatus social).
* **Ability (A) / Fricción:** EXTREMA (Formato Stories ultra-familiar para el 27,7% móvil).
* **Prompt (P):** Banner emergente in-app y correo exclusivo de revelación de nivel.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Consumo pasivo con animaciones fluidas en formato Instagram Stories. Recompensa variable (Estatus) $\to$ **Inversión (Investment):** El seller descarga y comparte su insignia en Instagram/TikTok/WhatsApp para presumir su estatus de Leyenda.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Retrospectiva gamificada in-app que resume las ventas acumuladas (Billones/Millones COD), efectividad de entrega y nivel oficial en Leyendas (Bienvenido $\to$ Explorador $\to$ Master $\to$ Experto $\to$ Sabio VIP $\to$ Leyenda).
* **Trilema de Fricción:**
  * **ELIMINAR:** La búsqueda manual de métricas consolidadas en reportes de Excel.
  * **PRESERVAR:** La confidencialidad (opción de ocultar la cifra exacta de dinero al compartir en redes).

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **ALTO** (Gamifica la retención y la lealtad).
* **Usabilidad:** 🟢 **EXTREMO** (UX Stories móvil probada en prototipo [dropi-wrapped-sellers.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropi-wrapped-sellers.html)).
* **Factibilidad:** 🟢 **EXTREMO** (Prototipo HTML/JS fully functional).
* **Viabilidad:** 🟢 **ALTO** (Cero costo recurrente de servidor).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"El seller compartirá su insignia en redes sociales (virallity) impulsando la retención y adquisición orgánica."*
  * *Test:* Medición del CTR del botón "Compartir en IG" en el prototipo interactivo con 10 sellers reales.

---

## 📈 7. Eventos de Tracking & Métricas de Outcome
* **Leading Indicator:** % de sellers que completan la visualización del Wrapped.
* **Lagging Indicator:** Tasa de Retención a 30 días de los sellers intervenidos.
* **Eventos a Instrumentar:**
  * `view_wrapped_stories_start`
  * `complete_wrapped_stories_view`
  * `click_share_wrapped_badge_social`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-WRAPPED`
* **Prototipo Interactivo:** [dropi-wrapped-sellers.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropi-wrapped-sellers.html)
