# 🔌 Especificación de Proyecto: Dropify 2.0 (APIs Shopify, WooCommerce, Tienda Nube)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-580` (Shopify PT2), `DROP-17355` (WooCommerce), `STID-6598` (Tienda Nube)
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **Tech Lead:** Jose Giraldo
* **Fase JPD:** **Make** (Desarrollo y QA de Paridad Funcional)
* **Estado Interno:** 🚀 Double Down (Prioridad 1)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Sellers de medio y alto volumen pierden hasta 4 horas diarias digitando pedidos de forma manual desde sus tiendas online hacia Dropi.
* **Fricción Identificada:** Fallas silenciosas en la sincronización de inventario, errores al mapear variantes complejas (talla/color) y discrepancias en los fletes de Tienda Nube.
* **Cita del Seller:** *"Si tengo que pasar 200 pedidos a mano todos los días, me paso a otra plataforma que se conecte directo."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Campo `survey_sell_pref` en `userpilot_suppliers` (Shopify, WooCommerce, Tienda Nube).
* **Métrica Factual:** Sellers integrados por API producen **487,6 ord/activo/mes** vs **104,0 ord/activo/mes** de sellers manuales (+368.8% de productividad).
* **Baseline vs. Meta:**
  * *Confiabilidad de Sync (Reliability):* Baseline 94.2% $\to$ **Meta 99.9%**.
  * *Tickets de Soporte Integración:* Baseline 117 tickets/mes $\to$ **Meta 0 tickets por fallas de sync**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** EXTREMA (Escalar volumen sin contratar personal administrativo).
* **Ability (A) / Fricción:** BAJA (Fricción técnica alta por mapeo manual de credenciales y tokens).
* **Prompt (P):** Banner en el módulo de integraciones: *"Conecta tu tienda en 1-Clic y automatiza tus despachos"*.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Instalación OAuth transparente en 1-Clic. El seller no configura webhooks manualmente; el sistema se encarga en segundo plano.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Re-arquitectura nativa "Built for Shopify" y migración a React de WooCommerce. Sincronización automática de productos preexistentes e importación fluida.
* **Trilema de Fricción:**
  * **ELIMINAR:** Digitación manual de pedidos y mapeo repetitivo de variantes.
  * **PRESERVAR:** Confirmación explícita de credenciales iniciales (guardarraíl de seguridad).

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Retiene sellers de alto volumen).
* **Usabilidad:** 🟢 **ALTO** (OAuth estándar de 1 clic).
* **Factibilidad:** 🟡 **MEDIO-ALTO** (QA de variantes complejas en PT2).
* **Viabilidad:** 🟢 **EXTREMO** (Mayor GMV movilizado sin soporte manual).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Los webhooks soportarán picos de 500 ord/minuto durante eventos masivos sin desincronizar stock."*
  * *Test:* Pruebas de carga aisladas en ambiente PT2 sandbox con 5 tiendas simulación.

---

## 📈 7. Eventos de Tracking & Métricas de Outcome
* **Leading Indicator:** % de consistencia de tokens e inventario sincronizado.
* **Lagging Indicator:** Volumen mensual de órdenes despachadas vía API (KR 1.1).
* **Eventos a Instrumentar:**
  * `click_install_cms_plugin`
  * `oauth_connection_success`
  * `webhook_order_sync_attempt`
  * `webhook_order_sync_failure`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-580` / `DROP-17355`
* **Especificación Madre:** [DISCOVERY_FRAMEWORK.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/DISCOVERY_FRAMEWORK.md#L29)
