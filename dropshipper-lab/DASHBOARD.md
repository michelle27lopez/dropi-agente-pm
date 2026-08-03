# 📊 DASHBOARD — Célula Seller Success

> Vista consolidada de métricas clave, embudo de conversión y estado de entrega de valor para la célula Seller Success.

---

## 🎯 Tablero de Control OKR & KPI: Meta vs. Realidad Actual (S2 2026)

> **Dato Oficial Confirmado de Activación:** La **Tasa de Activación Neta** se establece en **5.2%** (sellers con $\ge 1$ orden entregada).

### 📊 Contrastación Meta vs. Realidad

| Métrica / Outcome | Realidad Actual (Cierre JUL) | Meta S2 (Q3-Q4) | Brecha / Status | Definición & Fuente |
| :--- | :---: | :---: | :---: | :--- |
| **OKR 1 / KR 1.1 (Compañía)** | **3.687.786 ord/mes** | **7.800.000 ord/mes** | 🔴 **-4.112.214 ord** (47.3% cumpl.) | OKR 1.1 Holding (Confluence Space PD) |
| **NSM (Métrica Estrella Célula)**| **3.687.786 ord/mes** | **3.571.042 ord/mes** | 🟢 **+116.744 ord** (103.3%) | Órdenes mensuales movilizadas (Cierre Oficial CPO Julio 2026) |
| **Tasa de Activación Neta** | **5.2%** | **8.0%** | 🔴 **-2.8 pp** (Falta +53.8%) | Sellers registrados con $\ge 1$ orden entregada |
| **Tasa de Activación Bruta** | **7.6%** | **12.0%** | 🔴 **-4.4 pp** | Sellers registrados con $\ge 1$ orden creada (TTFO) |
| **Mediana de TTV Neto** | **16.0 días** | **< 12.0 días** | 🔴 **+4.0 días** (+25% latencia) | Días de registro a 1ª orden entregada |
| **Mediana de TTV Bruto** | **7.4 días** | **< 4.0 días** | 🔴 **+3.4 días** | Días de registro a 1ª orden creada |
| **Supervivencia 30d (Retención)** | **69.38%** (69.7%) | **75.0%** | 🟡 **-5.62 pp** (Brecha 7.5%) | % de sellers con actividad pasados 30 días (`es_activo_30d`) |
| **Deflexión Soporte Técnico** | **0.0%** (3.664 pqs) | **40.0%** | 🔴 **-40.0 pp** | Autogestión in-app vía FAQs (`PROD-HELP-MOD`) |

---

## 📈 Métricas de Volumen y Comportamiento Operativo

*   **Sellers Registrados (Histórico):** 397.000 (397k)
*   **Usuarios Identificados en DB Célula (UserPilot Sync):** 31.952 registrados únicos sincronizados
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

### 📦 3. Volumen de Órdenes Movilizadas (Comparativa: Corte 29-Jul vs. Cierre Definitivo Julio 2026)
| País | Cierre JUN | Corte 29-JUL *(Foto Congelada)* | Cierre Definitivo JUL | Remate Final (Delta) | % Crec. MoM | Meta Julio | % Cumplimiento | Status vs Meta |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 🇨🇴 COLOMBIA | 2.537.148 | 2.430.474 *(97,52%)* | **2.671.864** | **+241.390** | +5,30% | 2.664.050 | **100,29%** | 🟢 Superó Meta (+7.814) |
| 🇪🇨 ECUADOR | 248.618 | 261.436 *(119,38%)* | **286.380** | **+24.944** | +15,18% | 234.096 | **122,33%** | 🟢 Superó Meta (+52.284) |
| 🇨🇱 CHILE | 232.626 | 232.894 *(105,63%)* | **254.878** | **+21.984** | +9,56% | 235.685 | **108,14%** | 🟢 Superó Meta (+19.193) |
| 🇲🇽 MÉXICO | 231.484 | 219.393 *(102,33%)* | **243.053** | **+23.660** | +4,99% | 229.163 | **106,06%** | 🟢 Superó Meta (+13.890) |
| 🇬🇹 GUATEMALA | 126.014 | 147.391 *(117,72%)* | **161.217** | **+13.826** | +27,93% | 133.829 | **120,46%** | 🟢 Superó Meta (+27.388) |
| 🇵🇾 PARAGUAY | 25.861 | 27.718 *(97,42%)* | **30.293** | **+2.575** | +17,13% | 30.412 | **99,60%** | 🟨 Cerca (Faltan 119) |
| 🇵🇦 PANAMÁ | 23.400 | 21.875 *(87,16%)* | **23.730** | **+1.855** | +1,41% | 26.826 | **88,45%** | 🔴 Bajo Meta (-3.096) |
| 🇦🇷 ARGENTINA | 12.091 | 9.934 *(83,73%)* | **11.201** | **+1.267** | -7,36% | 12.682 | **88,32%** | 🔴 Bajo Meta (-1.481) |
| 🇨🇷 COSTA RICA | 2.803 | 4.011 *(130,32%)* | **4.442** | **+431** | +58,47% | 3.290 | **135,01%** | 🟢 Superó Meta (+1.152) |
| 🇵🇪 PERÚ | 841 | 622 *(65,89%)* | **728** | **+106** | -13,43% | 1.009 | **72,15%** | 🔴 Bajo Meta (-281) |
| **GLOBAL** | **3.440.886** | **3.351.359 *(100,32%)*** | **3.687.786** | **+336.427** | **+7,17%** | **3.571.042** | **103,26%** | 🟢 **Meta Superada (+116.744)** |

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
