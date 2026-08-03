# 📊 DASHBOARD — Célula Seller Success

> Vista consolidada de métricas clave, embudo de conversión y estado de entrega de valor para la célula Seller Success.

---

## 🎯 Tablero de Control OKR & KPI: Meta vs. Realidad Actual (S2 2026)

> **Dato Oficial Confirmado de Activación:** La **Tasa de Activación Neta** se establece en **5.2%** (sellers con $\ge 1$ orden entregada).

### 📊 Contrastación Meta vs. Realidad

| Métrica / Outcome | Realidad Actual | Meta S2 (Q3-Q4) | Brecha / Status | Definición & Fuente |
| :--- | :---: | :---: | :---: | :--- |
| **OKR 1 / KR 1.1 (Compañía)** | **3.351.359 ord/mes** | **7.800.000 ord/mes** | 🔴 **-4.448.641 ord** (42.9% cumpl.) | OKR 1.1 Holding (Confluence Space PD) |
| **NSM (Métrica Estrella Célula)**| **3.351.359 ord/mes** | **3.571.042 ord/mes** | 🟡 **-219.683 ord** (97.5%) | Órdenes mensuales movilizadas (Reporte CPO Jul 29) |
| **Tasa de Activación Neta** | **5.2%** | **8.0%** | 🔴 **-2.8 pp** (Falta +53.8%) | Sellers registrados con $\ge 1$ orden entregada |
| **Tasa de Activación Bruta** | **7.6%** | **12.0%** | 🔴 **-4.4 pp** | Sellers registrados with $\ge 1$ orden creada (TTFO) |
| **Mediana de TTV Neto** | **16.0 días** | **< 12.0 días** | 🔴 **+4.0 días** (+25% latencia) | Días de registro a 1ª orden entregada |
| **Mediana de TTV Bruto** | **7.4 días** | **< 4.0 días** | 🔴 **+3.4 días** | Días de registro a 1ª orden creada |
| **Supervivencia 30d (Retención)** | **69.38%** (69.7%) | **75.0%** | 🟡 **-5.62 pp** (Brecha 7.5%) | % de sellers con actividad pasados 30 días (`es_activo_30d`) |
| **Deflexión Soporte Técnico** | **0.0%** (3.664 pqs) | **40.0%** | 🔴 **-40.0 pp** | Autogestión in-app vía FAQs (`PROD-HELP-MOD`) |

---

## 📈 Métricas de Volumen y Comportamiento Operativo

*   **Sellers Registrados (Histórico):** 397.000 (397k)
*   **Usuarios Identificados en DB Célula:** 46.208 (36.056 Dropshippers puros)
*   **Usuarios Activos Diarios (DAU):** 14.262 usuarios/día (Userpilot UI)
*   **Usuarios Activos Mensuales (MAU):** 81.521 usuarios/mes (Userpilot UI - Tráfico global)
*   **Mediana días a 2ª orden:** 0,8 días (Promedio: 5,0 días)
*   **Órdenes por Activo (Promedio mensual):** 142,9 órdenes (Mediana: 7,0 órdenes)

---

## 🧭 Desglose por Origen y País (Lente de Operación)

### 1. Activación de 1ª orden por Origen
*   **Manual:** Bruta 4,7% · Neta 3,5% (Órdenes por activo: 104,0)
*   **Integración:** Bruta 2,8% · Neta 1,7% (Órdenes por activo: 487,6)
*   **Masivo:** Bruta 0,0% · Neta 0,0% (Órdenes por activo: 496,4)

### 2. Retención (Supervivencia 30d) por País
*   *Guatemala:* 89,4%
*   *Panamá:* 86,4%
*   *Ecuador:* 80,7%
*   *México:* 76,1%
*   *Paraguay:* 67,8%
*   *Colombia:* 67,7%
*   *Chile:* 64,1%
*   *Perú:* 52,0%
*   *Argentina:* 44,4%

### 📦 3. Volumen de Órdenes Movilizadas (1 al 29 de Julio 2026 - Datos Oficiales CPO)
| País | Cierre Junio | del 1 al 29 de JUN | del 1 al 29 de JUL | % Crecimiento | Meta Julio | % Proy. cumplimiento |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🇨🇴 COLOMBIA | 2.537.091 | 2.424.403 | 2.430.474 | +0,25% | 2.664.050 | 97,52% |
| 🇪🇨 ECUADOR | 248.618 | 240.601 | 261.436 | +8,65% | 234.096 | 119,38% |
| 🇨🇱 CHILE | 232.625 | 224.607 | 232.894 | +3,68% | 235.685 | 105,63% |
| 🇲🇽 MÉXICO | 231.459 | 224.206 | 219.393 | -2,14% | 229.163 | 102,33% |
| 🇬🇹 GUATEMALA | 126.010 | 120.992 | 147.391 | +21,81% | 133.829 | 117,72% |
| 🇵🇾 PARAGUAY | 25.862 | 24.902 | 27.718 | +11,30% | 30.412 | 97,42% |
| 🇵🇦 PANAMÁ | 23.400 | 22.352 | 21.875 | -2,13% | 26.826 | 87,16% |
| 🇦🇷 ARGENTINA | 12.091 | 11.775 | 9.934 | -15,63% | 12.682 | 83,73% |
| 🇨🇷 COSTA RICA | 2.803 | 2.699 | 4.011 | +48,61% | 3.290 | 130,32% |
| 🇵🇪 PERÚ | 841 | 811 | 622 | -23,30% | 1.009 | 65,89% |
| **GLOBAL** | **3.435.363** | **3.292.025** | **3.351.359** | **+1,80%** | **3.571.042** | **100,32%** |

---

## 🏃 Sprint Activo (Checklist de Producto)

### 📈 Frente 1: Page Pilot & Activación Neta (TTV)
*   [ ] **Page Pilot (Ajustes):** Configurar ángulo de ventas obligatorio y alineación de selector de fecha. (Lidera Alejandra)
*   [ ] **Habilitación de Beta:** Activar flag de producción (`PROD-1516`) para los 120 comercios de cohorte. (Lidera Santiago)

### 🔌 Frente 2: Integraciones (Dropify 2.0 & Tienda Nube)
*   [ ] **Bugs Tienda Nube (STID-6598):** Presionar a Jose Giraldo para asignación de recurso Dev. (Lidera Santiago)
*   [ ] **Shopify 2.0 QA (PROD-580):** Resolver dependencias y ejecutar pruebas aisladas PT2 QA. (Lidera Alejandra)
*   [ ] **Handoff Tienda Nube (DROP-25311):** Consulta pre-handoff de submenú y carga de imágenes con Diego Pérez. (Lidera Alejandra)
*   [ ] **Demo Dropify (Mañana 10:00 AM):** Preparar y presentar flujo completo (Shopify/Woo/Tienda Nube) en 20 mins. (Lidera Santiago)

### 🧪 Frente 3: Mocks & Discovery de Activación
*   [ ] **Módulo de Notificaciones (PROD-1664):** Finalizar y montar prototipo de WhatsApp en RPP (Angular). (Lidera Alejandra)
*   [ ] **Simplificación de Muestras (PROD-MUESTRA-SIMP):** UI de solicitud 1-Clic (autofill, transportadora opcional) y botones. (Lidera Alejandra)
*   [ ] **Dropi Wrapped (PROD-WRAPPED):** Conceptualización visual y de Discovery para reactivación. (Lidera Alejandra)
*   [ ] **Second Best (PROD-SEC-BEST):** Pruebas de guerrilla con 5 comercios Pareto sobre sobrecostos de flete. (Lidera Alejandra)
