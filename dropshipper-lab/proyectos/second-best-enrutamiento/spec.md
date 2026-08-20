# 🛡️ Especificación de Proyecto: Second Best / Enrutamiento Dinámico (`PROD-SEC-BEST`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-SEC-BEST`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Wonder** (Guerrilla Testing con Mock Interactivo)
* **Estado Interno:** 🛠️ Re-alinear (Probar Sobrecosto con 5 Pareto & Conectar con Órdenes Automatizadas)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** El proveedor principal quiebra stock de un producto ganador y el seller de alto volumen se ve obligado a pausar sus campañas de pauta en Meta Ads, perdiendo margen y dinero acumulado.
* **Fricción Identificada:** Desviar órdenes manualmente a un proveedor de respaldo toma horas y expone al seller a cancelaciones de pedidos ya cobrados.
* **Cita del Seller:** *"Prefiero pagar $1.000 más de flete o costo por unidad con tal de que no me apaguen la pauta ni me dejen mal con los clientes."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Variables `real_orders_delivered` (Pareto 250 sellers) y `survey_brand_sales` en `userpilot_suppliers`.
* **Métrica Factual:** El **45% de todo el volumen movilizado en Dropi proviene de productos privados**, donde los quiebres de stock destruyen el ROAS de las campañas activas.
* **Baseline vs. Meta:**
  * *Órdenes Canceladas por Stockout:* Baseline `[DATO FALTANTE]` $\to$ **Meta Reducción de -50% en Pareto**.
  * *Tasa de Aceptación de Enrutamiento Secundario:* Baseline 0% $\to$ **Meta $\ge 75\%$**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** EXTREMA (*Loss Aversion*: pánico a perder presupuesto publicitario en Meta/TikTok Ads).
* **Ability (A) / Fricción:** BAJA (Contactar a otros proveedores por fuera toma mucho tiempo).
* **Prompt (P):** Alerta emergente en el módulo de pedidos: *"¡Stock agotado en Proveedor A! Proveedor B tiene 500 unidades (Sobrecosto: $800/unid). ¿Desviar 1-Clic?"*
* **Procesamiento Dual:** **Sistema 2 (Evaluación deliberada):** El seller evalúa en 1-Clic si el sobrecosto menor preserva su margen neto positivo antes de autorizar el desvío.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Notificación proactiva y enrutamiento dinámico automático hacia un proveedor secundario pre-calificado. Reutiliza la lógica del motor de órdenes automatizadas.
* **Trilema de Fricción:**
  * **ELIMINAR:** La necesidad de apagar campañas de pauta por falta de stock.
  * **PRESERVAR:** La aprobación explícita del seller si el enrutamiento cambia el costo del producto.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Protege el GMV del Pareto).
* **Usabilidad:** 🟢 **ALTO** (Prompt de emergencia en 1-Clic).
* **Factibilidad:** 🟡 **MEDIO** (Integración con el motor de órdenes automatizadas).
* **Viabilidad:** 🟢 **ALTO** (Preserva el volumen transaccionado).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Los dropshippers del Pareto aceptarán un sobrecosto menor de flete/costo con tal de mantener activa la entrega de sus órdenes."*
  * *Test:* Guerrilla testing con el prototipo interactivo [second-best-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/second-best-poc.html) en 5 sellers Pareto.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de alertas de enrutamiento aceptadas por sellers Pareto.
* **Lagging Indicator:** Volume of GMV rescatado por desvío a proveedores secundarios.
* **Eventos a Instrumentar:**
  * `trigger_stockout_emergency_alert`
  * `accept_second_best_routing`
  * `reject_second_best_routing`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-SEC-BEST`
* **Prototipo Interactivo:** [second-best-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/second-best-poc.html)
