# 🔀 Especificación de Proyecto: Bifurcación Onboarding (Express vs Guiado)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-1478` / UserPilot Sync
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **Growth Lead:** UserPilot Sync Team
* **Fase JPD:** **Explore** (Configuración de Flujos Segmentados)
* **Estado Interno:** 🚀 Double Down (Reglas en UserPilot)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** El onboarding tradicional es unívoco y trata por igual al 34,0% de novatos (0 órdenes) que al 22,8% de sellers VIP (>300 órdenes/mes). El experto sufre fricción aburrida y abandona; el novato sufre sobrecarga cognitiva (*Choice Overload*).
* **Fricción Identificada:** TTV Neto estancado en **16.0 días** (latencia alta entre registro y primera orden entregada).
* **Cita del Seller:** *"Ya vendo 500 pedidos en Shopify, no quiero que me enseñen qué es dropshipping, solo quiero conectar la API."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Variables `survey_volume` y `survey_sell_pref` en `userpilot_suppliers`.
* **Métrica Factual:** El **22,8% de los registrados entra vendiendo >300 ord/mes** en otros canales; el **34,0% entra en 0 órdenes**.
* **Baseline vs. Meta:**
  * *Mediana de TTV Neto:* Baseline **16.0 días** $\to$ **Meta < 12.0 días**.
  * *Activación Neta Colectiva:* Baseline **5.2%** $\to$ **Meta 8.0%**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** Diversa (Experto busca velocidad operativa; Novato busca confianza y guía).
* **Ability (A) / Fricción:** Desalineada en el flujo AS-IS (demasiada fricción para el experto; poca ayuda para el novato).
* **Prompt (P):** Encuesta inicial de 1 pregunta en UserPilot: *"¿Cuál es tu volumen mensual de ventas actual?"*
* **Procesamiento Dual:**
  * **Ruta Express (VIP / >300 ord):** *Sistema 1 puro.* Redirección inmediata a integración de API / Dropify 2.0. Cero tutoriales básicos.
  * *Ruta Guiada (Novato / 0 ord):* *Sistema 2 asistido.* Creador de landings Page Pilot con ángulo de venta obligatorio + muestras 1-clic.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Segmentación del flujo de bienvenida en la primera pantalla tras el login.
* **Trilema de Fricción:**
  * **ELIMINAR:** Pasos de configuración básica y tours interactivos para el seller experimentado.
  * **PRESERVAR:** Scaffolding (andamiaje gradual) para el novato.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Ataca la latencia directa del Time-to-Value).
* **Usabilidad:** 🟢 **ALTO** (Segmentación desde la primera pantalla).
* **Factibilidad:** 🟢 **ALTO** (UserPilot ya captura la variable `survey_volume`).
* **Viabilidad:** 🟢 **EXTREMO** (Baja el TTV de 16d a <12d).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"El seller declara con veracidad su volumen real durante el onboarding sin inflar sus números."*
  * *Test:* Validación cruzada entre `survey_volume` declarado y `real_orders_delivered` a los 14 días.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de usuarios que completan el flujo segmentado asignado.
* **Lagging Indicator:** Mediana de TTV Neto por cohorte (Express vs Guiada).
* **Eventos a Instrumentar:**
  * `onboarding_survey_volume_selected`
  * `redirect_route_express_start`
  * `redirect_route_guided_start`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-1478`
* **Especificación Madre:** [DISCOVERY_FRAMEWORK.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/DISCOVERY_FRAMEWORK.md#L33)
