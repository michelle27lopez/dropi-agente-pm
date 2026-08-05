# 📦 Especificación de Proyecto: Muestras 1-Clic (`PROD-MUESTRA-SIMP`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-MUESTRA-SIMP`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Explore** (Diseño UX/UI de Formulario Simplificado)
* **Estado Interno:** 🛠️ Re-alinear (Priorizar Stock Privatizado & Checkpoint Kevin)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** El seller siente temor de vender un producto de catálogo sin haberlo probado físicamente o ver la calidad del empaque.
* **Fricción Identificada:** El flujo actual para solicitar una muestra exige re-digitar manualmente la dirección completa, teléfono y datos del destinatario cada vez.
* **Cita del Seller:** *"Quiero pedir el producto a mi casa para grabar videos y probar la transportadora, pero me da pereza llenar todo el formulario otra vez."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Variables `survey_shipping_pref` y datos de perfil en `userpilot_suppliers`.
* **Métrica Factual:** Un seller que prueba físicamente el producto aumenta su conversión a la primera orden neta en un +25%.
* **Baseline vs. Meta:**
  * *Solicitudes de Muestras:* Baseline 0 (no separadas en métricas) $\to$ **Meta +15% de incremento**.
  * *Tiempo de Llenado de Solicitud:* Baseline 3 minutos $\to$ **Meta < 15 segundos**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** MEDIA (Asegurar la calidad del producto antes de pautar).
* **Ability (A) / Fricción:** BAJA (Fricción de re-diligenciamiento y modales innecesarios).
* **Prompt (P):** Botón destacado en la ficha de detalle de producto: *"Pedir Muestra a tu Casa (1-Clic)"*.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Auto-fill inmediato de la dirección del seller. Sin modal nuevo, sin botón "Guardar" (guardado automático en caliente).
* **Insight UX:** El seller conserva la opción de elegir manualmente la transportadora para medir tiempos de entrega reales de paqueteras específicas.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Formulario desplegable en caliente dentro de la misma ficha de producto, pre-llenado con los datos guardados en su perfil.
* **Trilema de Fricción:**
  * **ELIMINAR:** Modales emergentes nuevos, botones "Guardar" y campos duplicados.
  * **PRESERVAR:** La pre-selección manual de transportadoras.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **ALTO** (Desbloquea la confianza para hacer pauta).
* **Usabilidad:** 🟢 **EXTREMO** (Reducción de clics de 8 a 1).
* **Factibilidad:** 🟢 **ALTO** (Reutilización de datos de perfil).
* **Viabilidad:** 🟢 **ALTO** (Incentiva despachos reales).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Los dropshippers prefieren seleccionar su transportadora (para medir tiempos) que confiar en un algoritmo de selección automática."*
  * *Test:* Test A/B in-app (split Userpilot) comparando formulario auto-diligenciado vs tradicional.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de clics en "Pedir Muestra" que se convierten en solicitudes completadas.
* **Lagging Indicator:** Conversión a la primera orden entregada (Activación Neta).
* **Eventos a Instrumentar:**
  * `click_sample_request_start`
  * `sample_form_autofill_success`
  * `sample_carrier_override_select`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-MUESTRA-SIMP`
* **Especificación Madre:** [materializacion_iniciativas.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#L210)
