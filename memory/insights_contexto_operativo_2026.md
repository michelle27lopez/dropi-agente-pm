# 🧠 Memoria Estratégica: Contexto Operativo, Logística & Tendencias (2026)

> **Insumo de Inteligencia:** Análisis cuantitativo de los datasets operativos cargados (Transportadoras CO, Semáforo de Entregas por Ciudad, Trayectos Especiales, Peso Volumétrico y Radar de Tendencias).

---

## 🚚 1. Radiografía Operativa de Transportadoras en Colombia

### 📍 Cobertura y Topes de Recaudo COD (Pago Contra Entrega):
* **TCC:** Lidera en cobertura geográfica con **1.710 municipios** (Tope recaudo: $2.000.000 COP).
* **Coordinadora:** **1.442 municipios** (Tope recaudo: $2.000.000 COP).
* **Envía:** **1.423 municipios** (Tope recaudo: $2.000.000 COP).
* **Interrapidísimo:** **1.104 municipios**, pero lidera en **Tope de Recaudo de $3.000.000 COP** por guía.
* **Carriers Urbanos (Jamv Drive, Wiilog, Domína):** Cobertura concentrada en 17–195 municipios principales, con recaudo rápido de 24-48h.

### 💳 Métodos de Pago Digital en la Entrega (Fricción #1 de Devoluciones):
* **El Problema:** El **30%+ de las devoluciones COD ocurren porque el comprador no tiene efectivo exacto** en el momento en que llega el transportador.
* **Aceptación Digital:**
  * `Coordinadora`: Acepta pago con Tarjeta Débito y Crédito vía **WOMPI** en puerta.
  * `Interrapidísimo`: Acepta pago digital vía **Código QR (Nequi / Daviplata)**.
  * `Jamv Drive`, `Wiilog`, `Veloces`: Aceptan Tarjeta, PSE, Nequi y Daviplata.
  * ⚠️ `Envía` & `Domína`: **Solo aceptan efectivo**. Recomendar desviar compras de alto valor hacia carriers con QR/WOMPI para reducir devoluciones.

### ⚠️ Intentos de Entrega & Novedades:
* `Envía`, `TCC`, `Domína`, `Wiilog`: Otorgan **3 intentos de entrega**.
* `Interrapidísimo`, `Coordinadora`, `Veloces`: Otorgan **2 intentos de entrega** antes de marcar devolución.
* ⚠️ `Interrapidísimo` **no gestiona novedades dentro de la plataforma Dropi** (requiere portal externo). Esto genera ceguera operativa y ataca la latencia de la Torre Logística.

---

## 🚦 2. Semáforo de Entregas por Ciudad & Brecha Regional

| Ciudad / Región | Efectividad Promedio | Mejor Carrier | Peor Carrier / Fricción | Decisión de Producto |
| :--- | :---: | :---: | :---: | :--- |
| **Bogotá** | 70,5% – 77,5% | Carrier #4 (77,5%) | Carrier #7 (62,8%) | Asignar Carrier #4 por defecto en Bogotá. |
| **Medellín** | 70,2% – 82,4% | Carrier #2 (82,4%) | Carrier #3 (70,2%) | Promover Carrier #2 para campañas masivas. |
| **Cali** | 70,4% – 80,7% | Carrier #6 (80,7%) | Carrier #3 (70,4%) | Utilizar Carrier #6 en Valle del Cauca. |
| **Barranquilla (Costa)**| 52,1% – 76,3% | Carrier #1 (76,3%) | 🔴 Carrier #5 (**52,1%**) | Alerta en Dashboard: evitar Carrier #5 en Costa. |
| **Cartagena (Costa)** | 57,0% – 71,1% | Carrier #1 (71,1%) | 🔴 Carrier #2 (**57,0%**) | Fricción por direcciones rurales/hoteleras. |
| **Ciudades Élite (>80%)**| **81,5% – 84,4%** | Ibagué (83.8%), Pereira (84.4%), Bucaramanga (81.5%), Neiva (83.0%) | — | Excelentes plazas para escalar pauta sin riesgo de flete devuelto. |

---

## 🗺️ 3. Trayectos Especiales & Sobrecostos de Flete

* **1.169 Destinos** en Colombia clasificados como **Trayecto Especial / Difícil Acceso** (ej: Abejorral Antioquia, Chimá Córdoba, Acandí Chocó).
* **Impacto en Margen:** Pautar sin saber que el destino es "Trayecto Especial" incrementa el flete entre **+$8.000 y +$18.000 COP**, destruyendo el margen de la orden.
* **Aplicación Directa:** Sustento para el motor de `PROD-SEC-BEST` (Second Best Fletes): alertar al seller in-app cuando la orden tenga destino de trayecto especial para ajustar precio o confirmar disponibilidad.

---

## 📐 4. Peso Volumétrico & Fricción de Novatos

* **Fórmula Oficial:** $V = \frac{\text{Largo} \times \text{Ancho} \times \text{Alto}}{5000}$.
* **Fuga de Margen:** Dropshippers novatos pautan artículos livianos pero voluminosos (almohadas, organizadores, juguetes) asumiendo un peso de 1 kg. Al despachar, el peso volumétrico resulta en 4-6 kg, cobrando sobrecostos de flete que consumen toda la ganancia.
* **Solución In-App:** Calculadora volumétrica obligatoria en la ficha de producto de Page Pilot y catálogo.

---

## 🔭 5. Radar de Tendencias Estratégicas (59 Macro-Tendencias)

1. **Social Commerce & WhatsApp QuickActions:** Transicionar la confirmación y venta del carrito web hacia WhatsApp directo.
2. **Pagos Digitales en la Entrega (QR / Tap to Pay):** Reducir la tasa de rechazo por falta de efectivo.
3. **Privatización de Catálogo & Stock Reservado:** Blindar a sellers Pareto contra desabastecimiento.
4. **AI Help Center Contextual:** Autogestión de rastreo de guías y retiros in-app para atajar los 3.6K tickets mensuales de SAC.

---

## 💾 6. Registro de Sincronización en Supabase

* **Memoria Guardada:** `insights_contexto_operativo_2026.md`.
* **Proyectos Impactados:** `PROD-SEC-BEST` (Second Best Fletes), `PROD-1706` (Torre Logística Evidencias), `PROD-HELP-MOD` (Help Center SAC), `PROD-1664` (Notificaciones WhatsApp).
