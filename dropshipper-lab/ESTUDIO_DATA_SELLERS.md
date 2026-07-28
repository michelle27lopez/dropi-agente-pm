# 📖 ESTUDIO DE DATA Y METRICAS — Célula Seller Success

> Análisis profundo del comportamiento, embudo de instrumentación y datos financieros de la célula Seller Success basado en las extracciones de datos de Julio 2026.

---

## 📊 1. Resumen Ejecutivo y TTV (Histórico)

El universo total analizado abarca **397.271 sellers registrados** históricamente en el ecosistema.

| Métrica | Valor Histórico | Significado Conductual |
| :--- | :--- | :--- |
| **Activación Bruta** | **7,56%** (30.047) | Vendedores que crearon su primera orden. |
| **Activación Neta** | **5,18%** (20.590) | Vendedores con al menos una orden entregada con éxito. |
| **TTV Bruto (Mediana)** | **7,4 días** | Tiempo medio entre el registro y la primera orden creada. |
| **TTV Neto (Mediana)** | **16,0 días** | Tiempo medio entre el registro y la primera orden entregada. |

---

## 📈 2. Desgloses Estratégicos

### A. Activación por Origen de la Primera Orden
El origen manual muestra una conversión neta significativamente mayor (73,91%), indicando que la venta directa inicial es el camino más natural de activación antes de conectar integraciones automatizadas.

*   **Manual:** 18.702 registros (100% Bruta · **73,91%** Neta)
*   **Integración:** 11.151 registros (100% Bruta · **59,11%** Neta)
*   **Masivo:** 194 registros (100% Bruta · **90,72%** Neta)
*   **Sin orden:** 367.224 registros (0,00% Activación)

### B. Comportamiento por País (Top 5 por Volumen)
Ecuador lidera en eficiencia de conversión neta (8,21%) y tiene el Time-to-Value neto más rápido (13,9 días), mientras que Argentina y Chile registran los TTV netos más lentos y bajas tasas de conversión.

*   **Colombia (CO):** 186.647 registros | **9,39%** Bruta | **6,44%** Neta | TTV Neto: **16,7 días**
*   **Chile (CL):** 72.137 registros | **5,69%** Bruta | **3,10%** Neta | TTV Neto: **18,6 días**
*   **México (MX):** 32.456 registros | **3,64%** Bruta | **2,60%** Neta | TTV Neto: **21,0 días**
*   **Ecuador (EC):** 30.969 registros | **10,26%** Bruta | **8,21%** Neta | TTV Neto: **13,9 días**
*   **Argentina (AR):** 22.330 registros | **3,05%** Bruta | **1,40%** Neta | TTV Neto: **18,1 días**

---

## 🔍 3. Embudo de Cobertura de Instrumentación (Mundial)

El análisis del tracking revela los cuellos de botella del onboarding y destaca un **grave vacío de instrumentación** en los datos bancarios y carga de productos.

```
1. Registro completado                       : 100,0%  (397.271 / 397.271)
2a. Tienda: nombre diligenciado              :  11,9%  (47.166 / 397.271)   <-- Fuga crítica
2c. Tienda: logo cargado                     :   3,2%  (12.789 / 397.271)
2d. Tienda: datos bancarios cargados         :   0,0%  (0 / 397.271)        <-- GAP de Tracking
3. Primer producto publicado                 :   NaN%                       <-- GAP de Tracking
4. Primera orden creada                      :   7,6%  (30.047 / 397.271)
6a. Primera orden despachada (movilizada)    :   6,0%  (23.897 / 397.271)
7a. Primera orden entregada                  :   5,2%  (20.590 / 397.271)
8. Primera orden con ganancia positiva       :   4,9%  (19.496 / 397.271)
```

### Hallazgos de Instrumentación:
1.  **Fuga Crítica de Configuración:** Solo el **11,9%** de los registrados llega a escribir el nombre de su tienda. El **88,1%** de los usuarios se frena inmediatamente tras registrarse.
2.  **Vacío de Datos Bancarios (0%):** Hay cero registros del evento "datos bancarios cargados". Esto indica que el evento no está siendo trackeado al backend o que la interfaz tiene un bloqueo de usabilidad absoluto para vincular la wallet.

---

## 💰 4. Finanzas y Orden Rentable

*   **Órdenes Totales Analizadas:** 8.138.512 órdenes.
*   **Tasa de Órdenes Rentables:** **99,59%** (8.105.144 órdenes con ganancia positiva para el seller, cumpliendo la condición $Pv - Pp - F - D > 0$).
*   **Margen de Flete:** Las tarifas de transportadoras muestran consistencia en el cálculo, pero el margen de devolución representa una pérdida directa del costo del flete ($-F$).

---

## 🔄 5. Supervivencia y Retención (30d)

*   **Cohorte Analizada:** 14.833 sellers.
*   **Supervivencia 30d (Retención):** **69,38%** (dropshippers que generan $\ge 1$ orden adicional en los 30 días posteriores a su primera orden).
*   **Velocidad de Segunda Orden (Mediana):** **0,8 días** (casi inmediato tras romper el hielo con la primera).
