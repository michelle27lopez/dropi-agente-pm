# 🛍️ Especificación de Proyecto: Vitrina WhatsApp Business (`PROD-WPP-BIZ`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-WPP-BIZ`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **UX Lead:** Alejandra Melo
* **Fase JPD:** **Explore** (Prototipo HTML/JS Listo e Interactivo)
* **Estado Interno:** 🚀 Prioridad Media-Alta
* **Research Base:** [RB-009: Fricción Técnica en Ecosistema Meta Commerce API](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/research-brain/published/RB-009-vitrina-whatsapp-business.md)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Los dropshippers quieren vender por WhatsApp automatizado con catálogos, pero se bloquean ante la complejidad técnica de Meta Commerce Manager.
* **Fricción Identificada:** La configuración de catálogos nativos de Meta requiere verificación de negocio, ruteo de webhooks y gestión de inventario doble (Dropi + Meta).
* **Cita del Seller:** *"No sé cómo enlazar mi catálogo de Dropi a WhatsApp, me pide Meta Business y termino rindiéndome."*

---

## 🧠 3. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Quieren abrir un nuevo canal de ventas automatizado).
* **Ability (A) / Fricción:** EXTREMA (Requiere conocimientos de Sistema 2 para configurar Business Portfolio y Commerce Manager).
* **Procesamiento Dual:** Dropi debe actuar como un "BSP Invisible" (Sistema 1 para el usuario). El esfuerzo tecnológico ocurre en el backend. 

---

## 🛠️ 4. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Una interfaz de vinculación "1-Clic" (Meta Embedded Signup) que sincroniza el catálogo de productos seleccionados de Dropi directo al WABA del seller.
* **Trilema de Fricción:**
  * **ELIMINAR:** La gestión doble de stock/catálogo.
  * **PRESERVAR:** La revisión de políticas comerciales de Meta (el seller debe aceptar los T&Cs de Meta).
  * **INVERTIR:** Esperar la verificación de Meta (gestión de expectativas).

---

## 🔬 5. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **ALTO** (Desbloquea el canal WhatsApp para vendedores no-técnicos).
* **Usabilidad:** 🟢 **ALTO** (Flujo Embedded Signup simplifica la UI).
* **Factibilidad:** 🟡 **MEDIO** (Dependencia fuerte de la API de Meta y las verificaciones manuales).
* **Viabilidad:** 🟢 **ALTO** (Aumenta NSM: órdenes generadas por WhatsApp).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Si abstraemos la complejidad de Meta API, el seller logrará generar órdenes en WhatsApp."*

---

## 🔗 6. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-WPP-BIZ`
* **Prototipos Interactivos:** 
  * [dropi-vitrina-wpp-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/dropi-vitrina-wpp-poc.html)
  * [exportador-wpp-catalogo-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/exportador-wpp-catalogo-poc.html)
  * [meta-embedded-signup-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/meta-embedded-signup-poc.html)
