# 🧭 ESTADO ACTUAL — Célula Seller Success (S2 2026)

> Este archivo representa el estado "vivo" de la célula de producto. Se lee al iniciar cada sesión de chat y se actualiza al cerrarla para registrar decisiones, bloqueos y próximos pasos.

**Última actualización:** 2026-07-23 · PM: Santiago Herrera · Designer: Alejandra Melo

---

## Foco Estratégico (S2 2026)
*   **Q3 (Julio–Septiembre):** Activación y Time-to-Value (TTV) del dropshipper huérfano (Subir activación neta de 2.9% a meta objetivo).
*   **Q4 (Octubre–Diciembre):** Crecimiento y reducción de Churn.

---

## 📋 Estado por Frente de Trabajo

### 1. Bugs Tienda Nube (STID-6598) — En curso
*   **Objetivo:** Resolver 6 errores críticos en la integración con Tienda Nube que bloquean el onboarding, el control de stock de marcas y causan devoluciones para sellers activos.
*   **Alcance:**
    *   Corrección de: Importación masiva, mapeo roto de ciudades/departamentos (ej. Pasto), variables desordenadas (tallas/colores), webhooks de checkout inestables, no lectura de descuentos (Order Bump) y direcciones incompletas (no captura Barrio/Piso).
*   **Estado:** En curso (Presionando asignación de dev con Jose Giraldo).
*   **Bloqueantes:** Falta de asignación de recursos de desarrollo en Jira.
*   **Próximos Pasos (Santiago):**
    1.  Coordinar con Jose Giraldo (Tech Lead) la asignación inmediata del ticket a un desarrollador.
    2.  Hacer pruebas del Order Bump en el portal de partners de Tienda Nube (`partners.tiendanube.com`, clave: `p1.3.1416Drop`) para verificar comportamiento de los fletes cobrados de más.

---

### 2. Page Pilot — Activación de Huérfanos (PROD-1663 / PRM-1238) — En curso
*   **Objetivo:** Validar el Creador de Páginas como palanca para que el dropshipper logre su primera orden rentable en $\le 14$ días.
*   **Alcance:**
    *   Beta controlada con 100 usuarios con más de 3 meses de actividad.
    *   Implementación y medición de la fórmula de "Orden Rentable" ($Pv - Pp - F - D > 0$).
*   **Estado:** En curso (Alineando data, funnel y DropiCard).
*   **Bloqueantes:**
    1.  *Financiero (PROD-1515):* Sin tarjeta virtual (DropiCard) definitiva y límites definidos por Financiero no se puede emitir la tarjeta para pruebas.
    2.  *Desarrollo (PROD-1516):* Pendiente habilitar el flag en producción para los 100 usuarios seleccionados.
    3.  *QA (PROD-1376):* Validar las actualizaciones del Creador de Páginas según diseño Figma.
*   **Próximos Pasos (Santiago):**
    1.  Reunión con el Data Analyst (Miguel Ángel) para auditar el baseline de ganancias de sellers bajo la nueva fórmula (PROD-1341) y definir la parametrización de monedas y fletes (PROD-1348).
    2.  Mapear el funnel AS-IS de registro → publicación → orden entregada (PROD-1351).
    3.  Presionar alineación de DropiCard definitiva con el equipo Financiero para desbloquear el Beta.

---

### 3. Módulo de Notificaciones (PROD-1664 / PRM-1305) — En curso
*   **Objetivo:** Reducir el tiempo al primer valor (TTV) e incentivar la activación mediante prompts accionables y de soporte self-service.
*   **Alcance:**
    *   *Track A (Discovery de Novedades - PROD-1697):* Analizar fallas del módulo de novedades (novedades duplicadas, errores de sincronización) bajo el framework conductual (B=MAP) para resolverlas sin tickets de soporte.
    *   *Track B (Discovery de Notificaciones Operativo - PROD-1692):* Mapear catálogo de eventos actual, benchmark operativo e integraciones IA para notificaciones automáticas (ej. órdenes pendientes de confirmación).
*   **Estado:** En curso (Fase F1 - Diagnóstico y Benchmark).
*   **Bloqueantes:** Ninguno. En fase exploratoria y de análisis inicial.
*   **Próximos Pasos (Santiago/Alejandra):**
    1.  Ejecutar el Benchmark comparativo de novedades contra CJ, Zendrop, Spocket, Shopify y Meli (PROD-1698).
    2.  Realizar exploración B=MAP (PROD-1721) cruzando datos y haciendo 5–8 entrevistas con sellers que tengan novedades abiertas hoy.
    3.  Finalizar benchmark operativo de notificaciones (PROD-1693) por parte de Alejandra.

---

### 4. Refactor Dropify — Cierre de Legado (PROD-1667 / PRM-1239) — En curso
*   **Objetivo:** Reconstrucción integral de la aplicación de Shopify para paridad funcional con la versión anterior bajo arquitectura escalable "Built for Shopify".
*   **Alcance:**
    *   *Shopify 2.0 (DROP-17354):* Frontend (React) y backend nuevos (APIs, webhooks, reintentos). 11 de 18 historias completadas.
    *   *WooCommerce (DROP-17355):* Plugin WooCommerce migrado a React. Listo en estado Handoff.
    *   *Tienda Nube (DROP-25311):* Extensión del plugin, actualmente en fase de especificación (Alejandra Melo).
*   **Estado:** En curso (Shopify), Handoff (WooCommerce), Backlog (Tienda Nube).
*   **Bloqueantes:** La Fase de Tienda Nube depende directamente de que la 2.0 de Shopify sea estable en producción.
*   **Próximos Pasos (Santiago/Alejandra):**
    1.  Monitorear desarrollo de Diego Pérez en backend de sincronización y frontend de Shopify 2.0.
    2.  Alejandra finaliza las especificaciones de Tienda Nube (PROD-1519) en el sprint activo (27-28).

---

## 📋 Proyectos del Roadmap (Por iniciar)

### 5. Biblia de AI / Proyecto Help Center (SAC) — Planificado
*   **Objetivo:** Exponer la librería de preguntas frecuentes para incentivar la autogestión de dudas técnicas y reducir la carga de soporte.
*   **Colaborador:** José Pineda Pitre.
*   **Superficies:** Home, Botón Flotante (widget tipo Intercom con pestañas *Inicio, Mensajes, Ayuda, Novedades, Tareas*) y Website (actual sección blog).
*   **Problema actual:** El usuario debe entrar al botón flotante solo para hablar con Soporte (sin filtro intermedio de FAQs). El blog tiene las FAQs desconectadas de la app.
*   **Benchmarks:** [Shopify Help](https://help.shopify.com/en) · [MercadoLibre Ayuda](https://www.mercadolibre.com.co/ayuda) · [Alibaba Help](https://helpcenter.alibaba.com/s/ggs) · [Amazon Ayuda](https://www.amazon.com/-/es/gp/help/customer/display.html?nodeId=GSD587LKW72HKU2V).
*   **Próximos Pasos:**
    1.  Alinear con José Pineda los flujos del widget de soporte y APIs disponibles para el buscador.
