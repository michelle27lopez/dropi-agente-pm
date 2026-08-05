# 📊 Especificación de Proyecto: Fórmula Orden Rentable & Audit Baseline (`PROD-1341` / `PROD-1348`)
## Célula Seller Success · Dropi S2 2026

---

## 📌 1. Tarjeta Ejecutiva del Proyecto
* **ID Jira:** `PROD-1341` / `PROD-1348`
* **Célula:** Seller Success (Darwin)
* **PM / Lead:** Santiago Herrera | **Data Lead:** Miguel Ángel / Finanzas
* **Fase JPD:** **Explore** (Audit Baseline Concluido & Parametrización por País)
* **Estado Interno:** 🟢 Persevere (Alineación con Finanzas)

---

## 🎯 2. Problema de Origen & Voz del Seller
* **Pain Point:** Sellers novatos e intermedios fijan precios de venta en su tienda a ciegas sin calcular el impacto del costo del producto, fletes de ida/regreso, fee de plataforma y tasa de devolución estimada por país.
* **Fricción Identificada:** Vender miles de dólares pero cerrar el mes con saldo negativo en la Wallet de Dropi (*ilusión de ingresos*).
* **Cita del Seller:** *"Hice 300 ventas este mes pero mi saldo en Wallet está en cero, no entiendo en qué se me fue la ganancia."*

---

## 📊 3. Grounding de Datos 360° & Supabase
* **Base de Datos Supabase:** Tabla `billing_information` y registros de transacciones en `userpilot_suppliers`.
* **Métrica Factual:** La utilidad real de una orden COD se rige por la ecuación formal:  
  $$\text{Ganancia Neta} = (P_v \times \text{Efectividad}) - P_p - F_{ida} - (F_{dev} \times (1 - \text{Efectividad})) - \text{Fee} - \text{CAC}$$
* **Baseline vs. Meta:**
  * *Sellers con Margen Neto Positivo:* Baseline `[DATO FALTANTE]` $\to$ **Meta 90% de los activos**.
  * *Precisión de Cálculo Financiero:* Baseline Estimado $\to$ **Meta 100% conciliado con Wallet**.

---

## 🧠 4. Diagnóstico Conductual B=MAP & Dual Process
* **Motivación (M):** ALTA (Saber exactamente cuánto dinero limpio ingresa al bolsillo).
* **Ability (A) / Fricción:** BAJA (Hacer el cálculo dinámico de fletes y devoluciones en Excel es propenso a errores).
* **Prompt (P):** Indicador destacado en el checkout / resumen de pedido: *"Ganancia Estimada por Orden: $18.500 COP"*.
* **Procesamiento Dual:** **Sistema 1 (Fluidez):** Cálculo automático transparente de la utilidad estimada antes de enviar la orden al proveedor.

---

## 🛠️ 5. Intervención de Producto & Trilema de Fricción
* **Qué cambia en el producto:** Calculador dinámico de Orden Rentable parametrizado por país (CO, MX, AR, CL, EC), fee de plataforma y tasa histórica de entrega del producto/ciudad.
* **Trilema de Fricción:**
  * **ELIMINAR:** La ceguera financiera sobre los sobrecostos de flete y devolución.
  * **PRESERVAR:** La flexibilidad del seller para ajustar su presupuesto estimado de pauta publicitaria (CAC).

---

## 🔬 6. Matriz de los 4 Riesgos (Cagan) & Test RAT
* **Valor:** 🟢 **EXTREMO** (Garantiza la sostenibilidad del seller).
* **Usabilidad:** 🟢 **ALTO** (Desglose transparente sin tecnicismos contables).
* **Factibilidad:** 🟢 **ALTO** (Integración de tablas de fletes y fees).
* **Viabilidad:** 🟢 **ALTO** (Mantiene con vida a los sellers rentables).
* **Riskiest Assumption Test (RAT):**
  * *Supuesto:* *"Ver la utilidad neta real estimada motivará al seller a subir su precio de venta o cambiar de transportadora en lugar de abandonar."*
  * *Test:* Auditoría de baseline con Miguel Ángel (Data) y test de usabilidad del desglosador financiero en 10 comercios.

---

## 📈 7. Eventos de Tracking & Métricas of Outcome
* **Leading Indicator:** % de órdenes creadas con margen estimado positivo ($>0$).
* **Lagging Indicator:** Tasa de supervivencia de sellers a los 60 días del primer despacho.
* **Eventos a Instrumentar:**
  * `view_profitable_order_calculator`
  * `adjust_product_selling_price_profit`
  * `wallet_settlement_reconciled_success`

---

## 🔗 8. Traza Discovery ➔ Delivery
* **Epic Jira:** `PROD-1341` / `PROD-1348`
* **Especificación Madre:** [DISCOVERY_FRAMEWORK.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/DISCOVERY_FRAMEWORK.md#L61)
