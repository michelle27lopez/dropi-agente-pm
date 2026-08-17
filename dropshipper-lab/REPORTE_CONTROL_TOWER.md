# 🏰 CONTROL TOWER REPORT — Célula Seller Success (S2 2026)

> Reporte consolidado del estado de la Célula Seller Success. Redactado con estándares de claridad cross-célula para dar visibilidad inmediata a la CPO, al CEO y a los leads de Tecnología, Logística, SAC y Growth.

**Fecha de Actualización:** 2026-08-04  
**Célula:** Seller Success (Dropshipper / E-commerce)  
**Dupla:** Santiago Herrera (PM) · Alejandra Melo (Product Designer)  

---

## 📢 1. EXECUTIVE REPORTER — Métricas Estratégicas y Datos 360°

*   **Aporte al OKR 1.1 Holding:** **3.351.359 órdenes/mes** generadas por sellers activos (42,9% del techo global de 7,8M/mes).
*   **Tasa de Activación Neta (5.2% $\to$ 8.0%):** **5,2%** de novatos logran entregar exitosamente su 1ª orden (Meta Q3: 8,0%).
*   **Time-to-Value Neto (TTV):** Mediana actual de **16,0 días** transcurridos desde el registro hasta la 1ª orden entregada (Meta Q3: < 12,0 días).
*   **Retención a 30 Días:** **69,4%** de recurrencia en la cohorte de vendedores.
*   **Población Identificada:** **46.208 usuarios** en base Supabase (36.056 Dropshippers puros + 8.744 Proveedores).

---

## 🚚 2. FRENTE DE DELIVERY (En Manos de Tecnología / QA / Pre-handoff)

| Proyecto | Estado | Prioridad | ¿Qué resuelve? | Bloqueante / Necesidad con Otra Célula |
| :--- | :---: | :---: | :--- | :--- |
| **1. Bugs Tienda Nube (V1)** `STID-6598` | 🔴 **En DEV** | **P0** | Resuelve 6 fallas críticas de sync de Pasto/ciudades, variantes talla/color, fletes de Order Bump y direcciones sin Barrio/Piso. | **TI:** Falta asignación dev en Jira por **Jose Giraldo**. Pruebas en portal de partners por Santiago/Alejandra. |
| **2. Pre-handoff Tienda Nube V2** `DROP-25311` | 🔵 **Pre-handoff** | **P1** | Re-arquitectura nativa V2 de la integración multitienda. | **Producto ➔ TI:** Sesión de aclaración de submenú e imágenes entre **Alejandra Melo** y **Diego Pérez**. |
| **3. Page Pilot Landings** `PRM-1238-DEL` | 🟡 **En QA** | **P1** | Creador asistido de landings para eliminar la parálisis inicial de maquetación en novatos. | **TI/QA:** Resolver fallas de generación y forzar campo "Ángulo de Venta". **Growth:** Workshop TARS con Catherin Salazar. |
| **4. Dropify Shopify 2.0** `PROD-580` | 🟡 **En QA** | **P2** | App nativa Built for Shopify para automatizar carga de pedidos (+368% ord/activo). | **TI/QA:** Completar matriz de fulfillment de combos con Alejandra. **Growth:** Optimizar Shopify App Store. |
| **5. Dropify WooCommerce** `DROP-17355` | 🟢 **En DEV** | Normal | Migración completa del plugin de WooCommerce a React para paridad con Shopify 2.0. | **TI:** En desarrollo activo por ingeniería (Fecha pactada: 4 de agosto). |

---

## 🔬 3. FRENTE DE DISCOVERY (Mocks, Prototipado, Research y Alineación)

*   **Módulo Notificaciones 360 (`PROD-1664`):** 🎨 **Discovery (Mockup & Recolección de Info)**. Recolectando eventos de Novedades (`PROD-1697`). Se unificará con Help Center.
*   **Dropi Wrapped Leyendas 2026 (`PROD-WRAPPED`):** 🎨 **Discovery (Diseño UX/UI)**. Prototipo v7.0 maquetado. Alineación con Brands para el evento de septiembre.
*   **PoC Shopi / PoolMax (`PROD-POOLMAX`):** 🤝 **Discovery (Alineación API)**. Sesión inicial de arquitectura realizada el 4-Ago. Solicitud de control financiero enviada a Mónica González y Nicolás Martínez.
*   **Solicitud de Muestras 1-Clic (`PROD-MUESTRA-SIMP`):** 🔬 **Discovery (Prototipo listo)**. Validando logística de stock privatizado.
*   **Second Best Enrutamiento Fletes (`PROD-SEC-BEST`):** 🔬 **Discovery (Guerrilla Testing)**. Prototipo interactivo navegable listo. Testeo en marcha con 5 sellers Pareto.
*   **Discovery SAC & Biblia AI / Help Center (`PROD-HELP`):** 🔬 **Discovery (Benchmark & Triaje)**. Análisis de 3.664 tickets de SAC completado. Trabajo conjunto con Laura Contreras (SAC) y José Pineda (Tech).
*   **Bifurcación Onboarding & TTV (`PROD-1478`):** 🔬 **Discovery (UserPilot)**. Alineando IDs de UserPilot con Laura Torres.
*   **Experimento Concierge Wpp Novatos (`PROD-EXP-WPP`):** 🧪 **Discovery Causal (Falsificación Ex-Ante)**. Spec completo y prototipo UI navegable.
