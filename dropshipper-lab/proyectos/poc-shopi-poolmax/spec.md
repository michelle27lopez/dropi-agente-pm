# 🚀 Especificación de Proyecto: PoC Shopi / PoolMax (Pauta Centralizada Comunidades)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-POOLMAX`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **Sponsor:** CEO (Lucho) & CPO (María Ossa)
* **Fase JPD:** **Explore** (Diseño de Experimento de Viabilidad)
* **Estado Interno:** 🚀 Double Down (PoC Martes 4-Ago 3:00 PM)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** El 43,1% del volumen de órdenes de Dropi (1,35M órdenes) viene de comunidades (ej. Iván Caicedo 294k ord). Los miembros novatos quiebran por desperdicio de pauta publicitaria en Meta/TikTok Ads o parálisis por falta de capital/experiencia.
* **Fricción Identificada:** Competencia destructiva entre miembros de la misma academia pautando por las mismas audiencias.
* **Cita del Seller:** *"No sé cómo armar campañas en Meta Ads que conviertan, prefiero darle mi presupuesto al mentor que sí sabe pautar."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Tablas `belong_to_community` y `owner_of_community` en `userpilot_suppliers`.
* **Métrica Factual:** **1.357.391 órdenes (43,1% del volumen rastreado)** concentradas en el canal comunidades.
* **Baseline vs. Meta:**
  * *Tasa de Activación en Comunidades:* Baseline 12.4% $\to$ **Meta 35.0%**.
  * *Volumen Mensual Canal Comunidades:* Baseline 1.35M ord/mes $\to$ **Meta 1.80M ord/mes**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Aprovechar el expertise publicitario del líder de comunidad).
* **Ability (A) / Fricción:** BAJA (Montar campañas de Meta Ads requiere alto skill técnico).
* **Prompt (P):** Invitación del mentor en WhatsApp/Comunidad: *"Aporta al PoolMax de pauta y recibe ventas automáticas en tu tienda"*.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** El seller sólo deposita su presupuesto ($1M, $2M); el motor de PoolMax distribuye las ventas generadas por API de forma proporcional hacia su tienda Shopi/Shopify.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Asignación dinámica e inteligente de órdenes de compra desde la campaña centralizada gestionada por el líder hacia las tiendas individuales de los miembros aportantes.
* **Trilema de Fricción:**
  * **ELIMINAR:** La necesidad de que el novato cree Business Manager, pixeles y anuncios en Meta Ads.
  * **PRESERVAR:** Transparencia total en el dashboard con la atribución exacta por % de presupuesto aportado.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Ataca el canal #1 de volumen de la compañía).
* **Usabilidad:** 🟡 **MEDIO** (Requiere interfaz limpia de presupuesto y saldo).
* **Factibilidad:** 🟡 **MEDIO** (Integración de APIs de enrutamiento multitienda).
* **Viabilidad:** 🟢 **ALTO** (Aprobado por CEO/CPO; escala volumen sin incrementar CAC).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Los sellers aportantes aceptarán que el algoritmo distribuya los pedidos por porcentaje exacto de presupuesto sin reclamar sesgo."*
  * *Test:* PoC el 4-Ago 3:00 PM con 1 producto y 5 comercios aportantes.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de presupuesto asignado convertido en órdenes distribuidas por API.
* **Lagging Indicator:** Volumen neto de órdenes entregadas por el canal de comunidades.
* **Eventos a Instrumentar:**
  * `poolmax_budget_deposit`
  * `poolmax_order_allocated_success`
  * `poolmax_order_rejected_stockout`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-POOLMAX`
* **Especificación Madre:** [materializacion_iniciativas.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#L335)
