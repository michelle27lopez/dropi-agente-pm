# 🚚 Especificación de Proyecto: Torre Logística & Evidencias (`PROD-1706` / `PROD-1665`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-1706` / `PROD-1665` (Capa 1.5 de Hábito)
* **Célula:** Seller Success (Darwin) & Logistic Success
* **PM / Lead:** Santiago Herrera | **Logistic PM:** Juan Bautista
* **Fase JPD:** **Wonder** (Estructuración de Eventos de Trazabilidad)
* **Estado Interno:** 🚀 Alta Prioridad (Planificar Q4 & Retención)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** El seller carece de visibilidad sobre el estado de entrega física de sus paquetes. Cuando un comprador afirma no haber recibido la orden, el seller no tiene pruebas para refutar el reclamo ante la transportadora.
* **Fricción Identificada:** Tasa de devoluciones alta por falta de autogestión oportuna en las primeras 24 horas de la novedad.
* **Cita del Seller:** *"La transportadora dice que la guía fue entregada, pero mi cliente dice que no. Necesito la foto de la firma para saber quién miente."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Variables `real_orders_delivered` y `es_activo_30d` en `userpilot_suppliers`.
* **Métrica Factual:** Resolver la novedad en $\le 24$ horas incrementa la tasa de entrega neta en **+18 pp**.
* **Baseline vs. Meta:**
  * *Tasa de Devoluciones Plataforma:* Baseline ~20% $\to$ **Meta Reducción de -15% (relativo)**.
  * *Autogestión de Novedades en 24h:* Baseline `[DATO FALTANTE]` $\to$ **Meta $\ge 60\%$**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Asegurar el recaudo de la venta COD).
* **Ability (A) / Fricción:** BAJA (Consultar guías individualmente en webs de transportadoras es inviable para un seller con 50 pedidos/día).
* **Prompt (P):** Notificación in-app / WhatsApp (interactivo): *"Novedad en Guía #1234: Dirección no encontrada. Haz clic para enviar ubicación GPS a la transportadora"*.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Visualización directa de fotos de prueba de entrega (POD - Proof of Delivery) y firmas digitalizadas en el mismo panel de pedidos.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Módulo de Torre Logística con trazabilidad por fases (Generada $\to$ Despachada $\to$ En Tránsito $\to$ Novedad $\to$ Entregada) y repositorio de evidencias físicas.
* **Trilema de Fricción:**
  * **ELIMINAR:** La incertidumbre del estado del envío y las consultas manuales a SAC.
  * **PRESERVAR:** La libertad del seller de decidir si autoriza el cobro del reintento de flete.

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Impacta directamente el margen del seller).
* **Usabilidad:** 🟢 **ALTO** (Panel unificado de evidencias).
* **Factibilidad:** 🟡 **MEDIO** (Sincronización de evidencias por API con paqueteras TCC, Interrapidisimo, Servientrega).
* **Viabilidad:** 🟢 **EXTREMO** (Disminuye devoluciones).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Exponer la evidencia física (foto/firma) reduce las disputas de clientes y permite al seller autorizar reintentos más rápido."*
  * *Test:* Mockup navegable probado con 10 sellers de alto volumen para validar la velocidad de gestión.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de novedades logísticas resueltas en la ventana de 24h.
* **Lagging Indicator:** Tasa global de devoluciones en envíos COD.
* **Eventos a Instrumentar:**
  * `view_logistics_evidence_photo`
  * `resolve_novedad_in_app_click`
  * `habit_stock_check_post_delivery`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-1706` / `PROD-1665`
* **Especificación Madre:** [DISCOVERY_FRAMEWORK.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/DISCOVERY_FRAMEWORK.md#L86)
