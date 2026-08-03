# 🔬 Framework de Product Discovery & Matriz de Experimentos (S2 2026)
## Célula Seller Success — Dropi

> **Propósito:** Cerrar el brecha metodológica definiendo el **Problema Concreto Resuelto**, la **Hipótesis Falsable**, el **Experimento de Validación** y los **Criterios Go/No-Go** para cada iniciativa del portafolio, usando el marco *Opportunity Solution Tree (OST)* de Teresa Torres y el lente de producto de *Test & Learn*.

---

## 🌳 1. Opportunity Solution Tree (OST Framework)

```
[OUTCOME PRINCIPAL] -> Aumentar Órdenes Mensuales a 7,8M (OKR 1.1) & Elevar Activación Neta de 5,2% a 8,0%
   |
   +-- [OPORTUNIDAD 1: Churn Pareto] "Si se agota el stock de mi producto estrella, pierdo $20M/día y mi negocio se detiene."
   |      |
   |      +-- [Solución 1.1] Privatización de Catálogo 1-Clic
   |      +-- [Solución 1.2] Dropi Wrapped & Retención Leyendas (Niveles 1 a 6)
   |
   +-- [OPORTUNIDAD 2: Fricción Onboarding Experto] "Ya vendo >300 ord/mes pero el registro me obliga a pasar por flujos de novato."
   |      |
   |      +-- [Solución 2.1] Bifurcación Onboarding Express (Page Pilot)
   |      +-- [Solución 2.2] Dropify 2.0 (Shopify/WooCommerce/Tienda Nube API)
   |
   +-- [OPORTUNIDAD 3: Fricción Onboarding Novato] "No sé qué producto vender ni cómo crear mi landing sin perder dinero."
   |      |
   |      +-- [Solución 3.1] Page Pilot (Landings + Ángulo de Ventas Obligatorio)
   |      +-- [Solución 3.2] Solicitud de Muestras 1-Clic
   |
   +-- [OPORTUNIDAD 4: Deflexión de Soporte (0% Actual)] "Tengo dudas de mis saldos y fletes y debo esperar un ticket de soporte."
          |
          +-- [Solución 4.1] SAC Research (Triaje 3.664 Tickets + Widget Flotante Help Center)
          +-- [Solución 4.2] Second Best (Notificación in-app sobrecosto flete vs cancelación)
```

---

## 🧪 2. Matriz de Hipótesis, Experimentos y Criterios Go / No-Go

### 1. `Dropify 2.0` (Shopify / WooCommerce / Tienda Nube API)
* **Problema Concreto Resuelto:**  
  Los sellers de mediano/alto volumen pierden hasta 4 horas diarias digitando órdenes manualmente, generando errores en direcciones y latencia de despacho.
* **Hipótesis Falsable:**  
  `SI` habilitamos la sincronización bidireccional automática de productos y pedidos vía API,  
  `ENTONCES` el volumen de órdenes promedio por seller activo aumentará de 104 a >400 ord/mes,  
  `MEDIDO POR` la tasa de órdenes por activo integrado en Supabase,  
  `PORQUE` elimina el trabajo operativo manual y permite escalar campañas de pauta.
* **Experimento de Validación:** Beta cerrada con 120 comercios cohorte (`PROD-1516` y `PROD-580`).
* **Criterios Go / No-Go:**  
  * 🟩 **Go (Lanzamiento General):** Tasa de error en sincronización de webhooks < 0,5% y >300 ord/activo en los primeros 14 días.  
  * 🔴 **No-Go:** Falla repetida en mapeo de variantes o latencia de syncing > 5 minutos.

---

### 2. `Dropi Wrapped Leyendas 2026` (`PROD-WRAPPED`)
* **Problema Concreto Resuelto:**  
  Falta de sentido de pertenencia y reconocimiento del seller con la marca Dropi, lo que genera fuga silenciosa (churn) hacia plataformas competidoras.
* **Hipótesis Falsable:**  
  `SI` presentamos la retrospectiva gamificada del seller conectada con la escala oficial de 6 Niveles de Leyendas y su estatus de drops acumulados,  
  `ENTONCES` la tasa de retención a 30 días (`es_activo_30d`) aumentará del 69,38% al 75,0%,  
  `MEDIDO POR` el % de sellers Nivel 1 que cruzan el umbral de 100 órdenes (donde el churn cae 82%),  
  `PORQUE` el reconocimiento público y los beneficios por nivel incentivan la lealtad y el volumen sostenido.
* **Experimento de Validación:** Prototipo en vivo ([http://localhost:3000/dropi-wrapped-sellers.html](http://localhost:3000/dropi-wrapped-sellers.html)) probado con 10 Sellers TOP y despliegue masivo en evento de septiembre.
* **Criterios Go / No-Go:**  
  * 🟩 **Go:** >40% de tasa de compartición (virallity) en redes y 0% reclamos sobre imprecisión en conteo de drops.

---

### 3. `Bifurcación de Onboarding` (Page Pilot Express vs. Guiado)
* **Problema Concreto Resuelto:**  
  Tasa de abandono en los primeros 7 días por tratar a los sellers novatos (34%) e hiper-experimentados (22,8%) con el mismo flujo plano de registro.
* **Hipótesis Falsable:**  
  `SI` bifurcamos el flujo de onboarding según la declaración de volumen inicial en UserPilot,  
  `ENTONCES` la tasa de Activación Bruta (TTFO) aumentará del 7,6% al 12,0% y la Mediana de TTV Bruto bajará de 7,4 a <4,0 días,  
  `MEDIDO POR` el tiempo promedio en días desde `signed_up` hasta la primera orden creada,  
  `PORQUE` reducimos la fricción inicial dando la herramienta exacta que cada perfil necesita.
* **Experimento de Validación:** Test A/B en registro sobre 500 nuevos usuarios en UserPilot.
* **Criterios Go / No-Go:**  
  * 🟩 **Go:** Reducción de TTV Bruto en al menos 2,5 días en el grupo B.

---

### 4. `Solicitud de Muestras 1-Clic` (`PROD-MUESTRA-SIMP`)
* **Problema Concreto Resuelto:**  
  El seller novato no se atreve a vender un producto porque no conoce su calidad física, y el proceso tradicional de pedir muestras tarda días.
* **Hipótesis Falsable:**  
  `SI` permitimos solicitar una muestra física del producto en 1-Clic con dirección pre-diligenciada y priorizamos productos con stock privatizado/verificado,  
  `ENTONCES` la tasa de conversión de consulta a primera orden creada aumentará un +25%,  
  `MEDIDO POR` el % de sellers que piden muestra y crean su primera orden en <10 días,  
  `PORQUE` la validación física del producto genera la confianza necesaria para invertir en pauta.
* **Experimento de Validación:** UI simplificada en ficha de producto (checkpoint Kevin / Alejandra Melo).
* **Criterios Go / No-Go:**  
  * 🟩 **Go:** >15% de conversión de solicitud de muestra a campaña activa.

---

### 5. `PoC Shopi / PoolMax` (Distribuidor Automático de Pauta Centralizada)
* **Problema Concreto Resuelto:**  
  Comunidades y grupos de media buyers pierden tiempo duplicando campañas y repartiendo manualmente pedidos entre sus tiendas de dropshipping.
* **Hipótesis Falsable:**  
  `SI` permitimos correr una campaña centralizada y distribuir automáticamente los pedidos por API a las tiendas participantes en proporción a su presupuesto,  
  `ENTONCES` el volumen movilizado por comunidad participante crecerá un +35% MoM,  
  `MEDIDO POR` el total de órdenes procesadas vía API desde la campaña central,  
  `PORQUE` maximiza la eficiencia del presupuesto publicitario y escala productos validados.
* **Experimento de Validación:** PoC en entorno controlado con 1 producto validado y 5 tiendas Shopi/Shopify (reunión 4-Ago 3:00 PM).
* **Criterios Go / No-Go:**  
  * 🟩 **Go:** 100% de precisión en la distribución proporcional de órdenes por API sin duplicidad de pedidos.

---

### 6. `SAC Research & Deflexión Help Center` (`PROD-SAC-RESEARCH` / `PROD-HELP-MOD`)
* **Problema Concreto Resuelto:**  
  Deflexión de soporte actual en 0,0% con 3.664 tickets de PQs abiertos por dudas repetitivas de saldo, retenciones de flete y estados de despacho.
* **Hipótesis Falsable:**  
  `SI` desplegamos la biblioteca contextual de FAQs in-app y el widget flotante con triaje inteligente en los módulos de mayor fricción,  
  `ENTONCES` la tasa de deflexión de soporte alcanzará el 40,0%,  
  `MEDIDO POR` el ratio de (consultas resueltas in-app) / (tickets abiertos en SAC),  
  `PORQUE` el seller resuelve su duda en segundos sin interrumpir su operación.
* **Experimento de Validación:** Clasificación del dataset `ml_ia.patrones` y prueba piloto del widget contextual en el módulo de Wallet.
* **Criterios Go / No-Go:**  
  * 🟩 **Go:** Reducción comprobada del 20% en tickets entrantes de Wallet en las primeras 3 semanas.
