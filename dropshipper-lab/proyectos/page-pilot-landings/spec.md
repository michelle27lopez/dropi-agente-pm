# 📄 Especificación de Proyecto: Page Pilot Landings (`PROD-1663`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-1663` / `PRM-1238`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Make** (Piloto Activo en Producción para 120 Comercios)
* **Estado Interno:** 🟢 Persevere (Feature Flag `PROD-1516` Activo)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Dropshippers huérfanos y novatos sufren parálisis por análisis intentando maquetar tiendas online desde cero, redactar ofertas y configurar pasarelas.
* **Fricción Identificada:** El 34,0% de los registrados abandona la plataforma sin haber publicado una sola página de ventas.
* **Cita del Seller:** *"No sé maquetar Shopify ni escribir textos que vendan, me da miedo gastar tiempo y dinero en una página que no convierte."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Filtro de cohorte huérfana en `userpilot_suppliers` (0 órdenes).
* **Métrica Factual:** Un dropshipper que publica su landing en $\le 14$ días reduce su tiempo a la primera orden neta en un 40%.
* **Baseline vs. Meta:**
  * *Tasa de Activación en Piloto:* Baseline **0.0%** $\to$ **Meta $\ge 25.0\%$**.
  * *Tiempo de Publicación:* Baseline 7+ días $\to$ **Meta < 15 minutos**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** MEDIA (Alta al registrarse, decae rápidamente por parálisis de maquetación).
* **Ability (A) / Fricción:** BAJA (*Choice Overload*: parálisis por exceso de opciones de diseño).
* **Prompt (P):** CTA principal en la pantalla de bienvenida: *"Publica tu Landing en 3 Clics con Ángulo de Venta"*.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Plantillas estructuradas con **Ángulo de Venta Obligatorio** (Problema-Solución, Oferta Limitada). El seller sólo reemplaza imágenes y precio.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Creador de landings integrado in-app que genera la página en segundos y conecta el producto con la Wallet y la pasarela DropiCard.
* **Trilema de Fricción:**
  * **ELIMINAR:** El lienzo en blanco y la necesidad de integrar plugins externos de maquetación.
  * **PRESERVAR:** La elección del producto ganador por parte del seller.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Desbloquea la primera orden del huérfano).
* **Usabilidad:** 🟢 **ALTO** (Asistencia paso a paso).
* **Factibilidad:** 🟡 **MEDIO** (Monitorear crecimiento interno con Fluxxi/iconMagic).
* **Viabilidad:** 🟢 **ALTO** (Costo de adquisición controlado).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"El huérfano no publica no por falta de creador, sino por falta de conocimiento básico de pauta."*
  * *Test:* Workshop de 1 día (metodología TARS) con los 120 comercios del piloto.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de usuarios del piloto que publican una landing page.
* **Lagging Indicator:** Tasa de Activación Neta de la cohorte intervenida.
* **Eventos a Instrumentar:**
  * `page_pilot_start_builder`
  * `page_pilot_select_angle_sales`
  * `page_pilot_publish_success`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-1663`
* **Especificación Madre:** [materializacion_iniciativas.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#L23)
