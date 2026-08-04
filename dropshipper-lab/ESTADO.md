# 🧭 ESTADO ACTUAL — Célula Darwin / Seller Success (S2 2026)

> Este archivo representa el estado "vivo" de la Célula Seller Success. Ha sido auditado y redactado por el **Agente de Claridad Cross-Célula** para garantizar que cualquier miembro de Dropi (Tecnología, Logística, SAC, Growth, Brands o C-Level) entienda el 100% de nuestras iniciativas en 3 minutos sin jerga interna.

**Última actualización:** 2026-08-04 · **PM:** Santiago Herrera · **Designer:** Alejandra Melo

> [!IMPORTANT]
> 🔥 **MANTRA OFICIAL DE LA CÉLULA SELLER SUCCESS:**  
> *"Habilitar, acelerar y retener al Dropshipper (Seller) para que construya un negocio de e-commerce recurrente y rentable en Dropi, eliminando la parálisis operativa inicial y maximizando el volumen de órdenes netas generadas y entregadas."*  
>  
> **Aporte Directo a la Holding:** Impactar el **OKR 1 / KR 1.1 (7.8M ord/mes)** acelerando la **Activación Neta (5.2% $\to$ 8.0%)**, reduciendo la latencia del **Time-to-Value (16d $\to$ <12d)** y aumentando la **Retención a 30 días (69.4% $\to$ 75.0%)**.

---

## 🚚 PARTE I: DELIVERY PROYECTOS (En Manos de Tecnología / QA / Pre-handoff)

Son las **únicas 5 iniciativas** que han superado Discovery y están en el flujo de entrega de ingeniería o pruebas:

### 1. 🔴 Bugs Tienda Nube V1 (`STID-6598`)
* **¿Qué es y qué problema resuelve?:** Mantenimiento correctivo urgente sobre la integración actual en producción. Corrige 6 fallas críticas que hoy provocan fallos de despacho, errores de flete y devoluciones en comercios de Colombia y Argentina.
* **¿Qué cambia en la plataforma?:** Sincronización limpia de variables talla/color, corrección de ubicaciones (ej. Pasto), cobro fiel de fletes en promociones Order Bump, importación masiva estable y captura de Barrio/Piso para transportadoras.
* **Estado Actual:** 🔴 **En DEV (P0 - Urgente / Sin asignación dev)**.
* **Alineación con Otras Células (Bloqueante TI):** **Bloqueante P0:** Aún no hay asignación de recurso de desarrollo por parte de Jose Giraldo (Tech Lead). Se requiere priorización inmediata. Luego Santiago y Alejandra realizarán pruebas de fletes en el portal de partners.

### 2. 🔵 Pre-handoff Tienda Nube V2 (`DROP-25311`)
* **¿Qué es y qué problema resuelve?:** Re-arquitectura completa del plugin V2 de Tienda Nube para alinearlo a la nueva arquitectura API multitienda de Dropify 2.0.
* **¿Qué cambia en la plataforma?:** Experiencia de instalación nativa de 1-clic con navegación simplificada por submenú y carga masiva de imágenes optimizada.
* **Estado Actual:** 🔵 **Pendiente Handoff (Pre-handoff Activo - P1)**.
* **Alineación con Otras Células (Producto ➔ TI):** **Alejandra Melo (PD)** está en sesión de aclaración técnica con **Diego Pérez (Dev)** resolviendo dos dudas de diseño antes de entregar el paquete final a desarrollo: la jerarquía del submenú y el flujo de carga de imágenes.

### 3. 🟡 Page Pilot — Creador de Landings (`PRM-1238-DEL` / `PROD-1814`)
* **¿Qué es y qué problema resuelve?:** Creador asistido de páginas de venta (landings) para novatos. Elimina la barrera técnica de diseñar tiendas complejas desde cero.
* **¿Qué cambia en la plataforma?:** El seller selecciona un producto del catálogo y genera su página de aterrizaje en minutos con un ángulo de venta prescriptivo.
* **Estado Actual:** 🟡 **En QA (P1)** — Piloto controlado con 120 comercios seleccionados.
* **Alineación con Otras Células (TI / Growth):** Handoff a QA realizado por PD. **Pendiente de TI/QA:** Solucionar errores persistentes al generar landings y forzar que el campo "Ángulo de Venta" sea obligatorio. **Con Growth (Catherin Salazar):** Workshop TARS de lanzamiento comercial.

### 4. 🟡 Dropify Shopify 2.0 — App Nativa (`PROD-580`)
* **¿Qué es y qué problema resuelve?:** Re-arquitectura nativa "Built for Shopify" para eliminar las 4 horas diarias que sellers de alto volumen pierden digitando pedidos a mano.
* **¿Qué cambia en la plataforma?:** Conexión OAuth transparente de 1-clic, sincronización bidireccional automática de inventario y pedidos, y mapeo de productos preexistentes.
* **Estado Actual:** 🟡 **En QA (P2)** — Pruebas aisladas en ambiente PT2 Sandbox.
* **Alineación con Otras Células (Producto ➔ TI):** Pendiente completar la matriz de pruebas de fulfillment de combos y variantes complejas junto a Alejandra Melo. Optimización de la descripción en Shopify App Store coordinada con **Growth**.

### 5. 🔴 Dropify WooCommerce — Plugin React (`DROP-17355`)
* **¿Qué es y qué problema resuelve?:** Migración completa del plugin de WooCommerce a React para eliminar la deuda técnica del código legado y ofrecer paridad funcional con Shopify 2.0.
* **¿Qué cambia en la plataforma?:** Interfaz moderna de administración del plugin dentro de WooCommerce con sincronización estable de tokens y órdenes.
* **Estado Actual:** 🔴 **En DEV (P0 - Incumplido por TI)**.
* **Alineación con Otras Células (TI):** **Entrega pactada para el 4 de agosto INCUMPLIDA por TI** (el 3-Ago comunicaron que no la tenían lista). Aún no hay fecha oficial de entrega reprogramada por Jose Giraldo.

---

## 🔬 PARTE II: DISCOVERY PROJECTS (Fase de Investigación, Mocks, Prototipado y Alineación)

Son las iniciativas que **aún NO están en desarrollo técnico** y se encuentran en diseño de solución o validación con usuarios:

### 6. 🟢 PoC Shopi / PoolMax — Pauta Centralizada (`PROD-POOLMAX`)
* **¿Qué es?:** Reparto automático vía API de órdenes e inversión publicitaria desde campañas centrales (Meta/TikTok) hacia tiendas asociadas a comunidades.
* **Estado:** 🟢 **Avanzado / Listo para inicio esta semana**. Conversaciones adelantadas con Financiero, Legal y reunión técnica realizada con Esteban y Arlex. Grupo de WhatsApp activo para comunicación directa.
* **Alineación Cross-Célula:** Control financiero y legal cerrado. Canal de comunicación WhatsApp en marcha.

### 7. 🎨 Módulo de Notificaciones 360 (`PROD-1664` / `PRM-1305`)
* **¿Qué es?:** Motor conductual de prompts y notificaciones multicanal (In-App y WhatsApp) para guiar al seller ante eventos clave del journey.
* **Estado:** 🎨 **Discovery (Mockup & Recolección de Info)**. Apenas en maquetación de pantallas y recolección de eventos de Novedades (`PROD-1697`).
* **Alineación Cross-Célula:** Se unificará con la **Biblia de AI / Help Center (SAC)** para centralizar los contenidos y no duplicar widgets flotantes.

### 7. 🎨 Dropi Wrapped Leyendas 2026 (`PROD-WRAPPED` / `GRO-002`)
* **¿Qué es?:** Retrospectiva interactiva gamificada que celebra las ventas del seller y lo ubica en uno of los 6 niveles de *Leyendas Dropi* para acelerar la retención post-campaña.
* **Estado:** 🎨 **Discovery (Fase de Diseño UX/UI)**. Prototipo interactivo v7.0 maquetado ([dropi-wrapped-sellers.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropi-wrapped-sellers.html)).
* **Alineación Cross-Célula:** Alinear con el equipo de **Brands / Marketing** para el evento comercial de septiembre.

### 8. 🤝 PoC Shopi / PoolMax — Pauta Centralizada (`PROD-POOLMAX`)
* **¿Qué es?:** Reparto automático vía API de órdenes e inversión publicitaria desde campañas centrales (Meta/TikTok) hacia tiendas asociadas a comunidades.
* **Estado:** 🤝 **Discovery (Alineación de Arquitectura)**. Hoy (4-Ago) se realizó la reunión inicial de entendimiento técnico entre el equipo PoolMax y Shopi.
* **Alineación Cross-Célula:** Solicitud de control financiero enviada a **Mónica González (Financial Manager)** y **Nicolás Martínez**.

### 9. 🔬 Solicitud de Muestras 1-Clic (`PROD-MUESTRA-SIMP`)
* **¿Qué es?:** Experimento para incentivar que el novato pida una muestra física para sí mismo ("sé tu primer cliente"), perdiendo el miedo y entendiendo la logística.
* **Estado:** 🔬 **Discovery (Prototipo listo / Validando Stock)**. Prototipo navegable finalizado ([solicitud-muestra-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/solicitud-muestra-poc.html)). Validando logística de stock privatizado.

### 10. 🔬 Second Best — Enrutamiento Dinámico de Fletes (`PROD-SEC-BEST`)
* **¿Qué es?:** Sistema de alerta y redirección automática a proveedor secundario cuando el producto principal sufre quiebre de stock (stockout), evitando apagar la pauta.
* **Estado:** 🔬 **Discovery (Guerrilla Testing)**. Prototipo interactivo listo ([second-best-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/second-best-poc.html)). Alejandra realiza guerrilla testing con 5 sellers Pareto.

### 11. 🔬 Discovery SAC & Biblia AI / Help Center (`PROD-HELP` / `PROD-SAC-RESEARCH`)
* **¿Qué es?:** Triaje inteligente de 3.664 tickets de soporte y widget contextual de ayuda para responder el Top 4 de dudas administrativas y logísticas.
* **Estado:** 🔬 **Discovery (Benchmark & Triaje de Data)**. Análisis de 3.664 conversaciones finalizado.
* **Alineación Cross-Célula:** Trabajo conjunto con **Laura Contreras (SAC)** y **José Pineda (Tech)** para conectar el buscador de FAQs con Sherlock.

### 12. 🔬 Bifurcación de Onboarding & TTV (`PROD-1478` / UserPilot)
* **¿Qué es?:** Encuesta de nivel de conciencia que divide el onboarding: *Ruta Express* (para vendedores >300 ord a integraciones) vs *Ruta Page Pilot* (para novatos).
* **Estado:** 🔬 **Discovery (Alineación UserPilot)**. Ajustando IDs en UserPilot con Laura Torres.

### 13. 🧪 Experimento Concierge Wpp Novatos (`PROD-EXP-WPP-NOVATOS`)
* **¿Qué es?:** Experimento Causal para validar si el acompañamiento asistido por WhatsApp logra que 5 novatos alcancen su primera orden rentable en $\le 7$ días.
* **Estado:** 🧪 **Discovery Causal (Falsificación Ex-Ante)**. Spec completo y prototipo UI interactivo ([falsificacion-wpp-novatos-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/falsificacion-wpp-novatos-poc.html)).

---

## 📊 PARTE III: RESUMEN DE DATOS & MAPA DE ALINEACIÓN INTER-CÉLULAS

### 🎯 Matriz de Dependencias Directas con Otras Células

| Célula Aliada | ¿Qué necesitamos de ellos? | Proyectos Involucrados | Puntos de Contacto |
| :--- | :--- | :--- | :--- |
| **Tecnología (TI)** | • Asignación dev para 6 bugs de Tienda Nube.<br>• Resolución de errores de generación en Page Pilot.<br>• Entrega de plugin WooCommerce en React.<br>• QA final de fulfillment en Shopify 2.0. | `STID-6598`<br>`PRM-1238`<br>`DROP-17355`<br>`PROD-580` | **Jose Giraldo** (Tech Lead)<br>**Diego Pérez** (Dev) |
| **Growth / Marketing** | • Workshop TARS de lanzamiento de Page Pilot.<br>• Optimización de copy en Shopify App Store.<br>• Benchmark de rebranding para marca Dropify. | `PRM-1238`<br>`PROD-580`<br>`PROD-1667` | **Catherin Salazar** (Growth)<br>**Diana** (Marketing) |
| **SAC / Soporte** | • Conexión de Sherlock con grupos de WhatsApp.<br>• Integración de guías contextuales con Help Center. | `PROD-HELP`<br>`PROD-HELP-MOD`<br>`PROD-SHERLOCK` | **Laura Contreras** (SAC)<br>**José Pineda** (Tech SAC) |
| **Finanzas** | • Aprobación de control financiero para PoC PoolMax.<br>• Auditoría de baseline de orden rentable por país. | `PROD-POOLMAX`<br>`PROD-1341`<br>`PROD-1348` | **Mónica González** (Finance)<br>**Nicolás Martínez** (Analyst) |
