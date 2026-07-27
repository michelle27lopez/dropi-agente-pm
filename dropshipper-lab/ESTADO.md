# 🧭 ESTADO ACTUAL — Célula Darwin / Seller Success (S2 2026)

> Este archivo representa el estado "vivo" de la célula de producto. Se lee al iniciar cada sesión de chat y se actualiza al cerrarla para registrar decisiones, bloqueos y próximos pasos.

**Última actualización:** 2026-07-27 · PM: Santiago Herrera · Designer: Alejandra Melo

---

## Foco Estratégico (S2 2026)
*   **Q3 (Julio–Septiembre):** Activación y Time-to-Value (TTV) del dropshipper huérfano (Subir activación neta de 2.9% a meta objetivo).
*   **Q4 (Octubre–Diciembre):** Crecimiento y reducción de Churn (Retención).

---

## 🎯 Matriz Global de Outcomes (Laddering de Métricas)

*   **NSM (Métrica Estrella):** Órdenes mensuales despachadas por active dropshippers.

| Product Outcome (Indicador Líder) | Baseline | Meta (S2) | Iniciativas Darwin Responsables |
| :--- | :--- | :--- | :--- |
| **Tasa de Activación Neta** (% registrados con $\ge 1$ orden entregada) | **5.2%** | **8.0%** | `PROD-1478` (TTV) · `PROD-1663` (Page Pilot) · `PROD-1546` (Huella 3.0) · `STID-6598` (Tienda Nube) |
| **Mediana de TTV Neto** (Tiempo de registro a 1ª entrega exitosa) | **16.0 días** | **< 12.0 días** | `PROD-1478` (Experimento TTV) · `PROD-1663` (Page Pilot) |
| **Supervivencia 30d (Retención)** (% activos con $\ge 1$ orden en 30d) | **69.38%** | **75.0%** | `PROD-1665` (Capa 1.5) · `PROD-1666` (Churn) · `PROD-WRAPPED` (Wrapped) |
| **Tasa de Cancelación / Desviación** (% órdenes perdidas por stockout) | `[DATO FALTANTE]` | **-50% en Pareto** | `PROD-SEC-BEST` (Second Best) · `PROD-1729` (Gestión de Órdenes) |
| **Deflexión de Soporte Técnico** (% de tickets SAC auto-resueltos) | **0%** | **40%** | Help Center SAC · `PROD-1664` (Notificaciones/Novedades) |

---

## 📡 Radar de Experimentos Semanales (Semana del 2026-07-27)

| Experimento (ID Jira) | Método / Test | Cohorte / Target | Métrica de Éxito Decl. | Estado / Bloqueante |
| :--- | :--- | :--- | :--- | :--- |
| **Dropi Wrapped (`PROD-WRAPPED`)** | Piloto Concierge (WhatsApp) | 60 sellers inactivos (30 piloto / 30 control) | Tasa de retorno $\ge 20\%$ en 7 días | **Listo para lanzar** (esperando cohorte Supabase) |
| **Experimento TTV (`PROD-1478`)** | Alertas guiadas 3 pasos | Registrados en agosto con $\ge 1$ orden creada | Reducir TTV neto a < 12 días | **Bloqueado** (IDs UserPilot desalineados) |
| **Second Best (`PROD-SEC-BEST`)** | Guerrilla Test (Figma) | 5 dropshippers del Pareto de base 360 | Tasa de aceptación del prompt $\ge 80\%$ | **En Diseño de UI** (Alejandra Melo) |
| **Huella Digital 3.0 (`PROD-1546`)** | Usabilidad (Figma) | 5 comercios ajenos a la app | Identificar >80% de bloqueos en wallet | **En Backlog** (Diseño de especificaciones) |

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

### 2. Page Pilot — Activación de Huérfanos (PROD-1663 / PRM-1238) — En curso
*   **Objetivo:** Validar el Creador de Páginas como palanca para que el dropshipper logre su primera orden rentable en $\le 14$ días.
*   **Alcance:**
    *   Beta controlada con 100 usuarios con más de 3 meses de actividad.
    *   Implementación y medición de la fórmula de "Orden Rentable" ($Pv - Pp - F - D > 0$).
*   **Estado:** En curso (Alineando data, funnel y DropiCard).
*   **Bloqueantes:**
    1.  *Financiero (PROD-1515):* Sin tarjeta virtual (DropiCard) definitiva. Correo de solicitud de tarjeta independiente enviado el 2026-07-27 a Tesorería; en espera de confirmación de viabilidad para proceder.
    2.  *Desarrollo (PROD-1516):* Pendiente habilitar el flag en producción para los 100 usuarios seleccionados.
    3.  *QA (PROD-1376) [CRÍTICO]:* Realizar QA a las actualizaciones del Creador de Páginas. Estado: Bloqueado. Recurso de feedback en [Figma](https://www.figma.com/board/s0WAgpiKvufhkb8uSvMzvL/Formato-de-feedback--Beta---Producci%C3%B3n-?node-id=2936-27182&t=AGStSHMDOVoKsUgW-4).
*   **Próximos Pasos (Santiago):**
    1.  Reunión con el Data Analyst (Miguel Ángel) para auditar el baseline de ganancias de sellers bajo la nueva fórmula (PROD-1341) y definir la parametrización de monedas y fletes (PROD-1348).
    2.  Mapear el funnel AS-IS de registro → publicación → orden entregada (PROD-1351).
    3.  Monitorear la respuesta de Tesorería por la DropiCard (`PROD-1515`) y presionar viabilidad.
    4.  Cerrar entregables de la fase Diagnose del Q3:
        *   **PROD-1357:** Confirmar causa raíz (B=MAP) del gap de activación con data cuanti y cuali.
        *   **PROD-1360:** Identificar patrones comunes de sellers con TTV bajo (muestra $\ge 20$).
        *   **PROD-1353:** Ejecutar sesión de alineación del journey de activación multipaís (Semana 4 de julio).
    5.  Coordinar con Catherin Salazar el lanzamiento comercial del workshop de Page Pilot (`PROD-1814`) bajo metodología TARS.

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

### 4. Refactor Dropify — Cierre de Legado (PROD-1667 / PRM-1239) — En curso
*   **Objetivo:** Reconstrucción integral de la aplicación de Shopify para paridad funcional con la versión anterior bajo arquitectura escalable "Built for Shopify".
*   **Alcance:**
    *   *Shopify 2.0 (DROP-17354):* Frontend (React) y backend nuevos (APIs, webhooks, reintentos). 11 de 18 historias completadas.
    *   *WooCommerce (DROP-17355):* Plugin WooCommerce migrado a React. Listo en estado Handoff.
    *   *Tienda Nube (DROP-25311):* Extensión del plugin, actualmente en fase de especificación (Alejandra Melo).
*   **Estado:** En curso (Shopify), Handoff (WooCommerce), Backlog (Tienda Nube).
*   **Bloqueantes:** 
    1.  La Fase de Tienda Nube depende directamente de que la 2.0 de Shopify sea estable en producción.
    2.  **PROD-580 [CRÍTICO]:** Pruebas aisladas PT2 QA (Tokens, Sync Productos/Órdenes, Dashboard, Reglas) en estado: Bloqueado (Dependencia).
*   **Próximos Pasos (Santiago/Alejandra):**
    1.  Monitorear desarrollo de Diego Pérez en backend de sincronización y frontend de Shopify 2.0.
    2.  Alejandra finaliza las especificaciones de Tienda Nube (PROD-1519) en el sprint activo (27-28).

### 5. Gestión de Órdenes del Seller (Epic PROD-1729) — Por iniciar
*   **Especificación Conductual:** Ver [Materialización de Gestión de Órdenes](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#5-gestión-de-órdenes-del-seller-prod-1729).
*   **Alcance:** Carga masiva de órdenes compuestas (`PROD-1707`) y evidencias en Torre Logística (`PROD-1706`).
*   **Estado:** En backlog (prioridad Medium, asignado a Santiago Herrera).

---

## 🔬 Experimentos y Descubrimientos Activos

### 6. Experimento de Activación Neta (TTV) (PROD-1478) — En Planificación
*   **Especificación Conductual:** Ver [Materialización de Experimento TTV](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#6-experimento-de-activación-neta--ttv-prod-1478).
*   **Documento de Trabajo:** [Intervention Brief - TTV](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/intervention_brief_ttv.md).
*   **Baseline & Metas:** TTV Neto actual = **16.0 días** $\to$ Meta del Piloto = **< 12.0 días**.
*   **Plan de Acción:** Piloto con cohorte de agosto mediante canalización in-app en 3 pasos para reintento/despacho guiado.

### 7. Huella Digital 3.0 (PROD-1546) — En Planificación
*   **Especificación Conductual:** Ver [Materialización de Huella Digital 3.0](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#8-huella-digital-30-prod-1546).
*   **Documento de Trabajo:** [Opportunity Brief - Huella Digital 3.0](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/opportunity_brief_huella_3.md).
*   **Fuga en Embudo:** Registro a Onboarding = **11.9%** (nombre de tienda) y **0%** (datos bancarios cargados).
*   **Validación de Guerrilla:** Prueba de usabilidad con Figma con 5 comercios por parte de Alejandra Melo antes de codificar.

---

## 📋 Proyectos del Roadmap (Por iniciar)

### 8. Biblia de AI / Proyecto Help Center (SAC) — Planificado
*   **Especificación Conductual:** Ver [Materialización de Help Center SAC](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#7-biblia-de-ai--proyecto-help-center-sac).
*   **Alcance:** Widget flotante buscador de soporte técnico con respuestas automatizadas auto-asistidas.
*   **Próximos Pasos:** Alinear con José Pineda los flujos de APIs disponibles y realizar Fake Door de clicks.

### 9. [RETENCIÓN] Instrumentar Capa 1.5: inversión y hábito post-venta (Epic PROD-1665) — Planificado (Q4 / Prep en Q3)
*   **Especificación Conductual:** Ver [Materialización de Capa 1.5](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#9-capa-15---hábito-post-venta-prod-1665).
*   **Objetivo:** Tracking de eventos `product_update` y `stock_check` en una ventana de 48h tras la primera entrega para forjar hábito.

### 10. [DISCOVERY Q4] Diagnóstico de churn y palancas de retención (Epic PROD-1666) — Planificado (Q4 / Prep en Q3)
*   **Especificación Conductual:** Ver [Materialización de Diagnóstico de Churn](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#10-diagnóstico-de-churn-prod-1666).
*   **Evidencia Comercial:** Según el [Análisis Comercial 360](file:///Users/santiago.herrera/.gemini/antigravity-ide/brain/da212732-6979-40ef-b40c-449412d5e18d/analysis_comercial_360.md), el 28% de la base prioritaria del Pareto se encuentra inactiva por fallas de stock o logística.

### 11. [DISCOVERY Q4] Enrutamiento dinámico (Second Best) — Planificado
*   **Especificación Conductual:** Ver [Materialización de Second Best](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#11-enrutamiento-dinámico-second-best---prod-sec-best).
*   **Documento de Trabajo:** [Opportunity Brief - Second Best](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/opportunity_brief_second_best.md).
*   **Las Dos Líneas de Defensa:** Redirección automática a respaldo pre-seleccionado (Second Best) y subasta in-app de despacho urgente (Pulso).

### 12. [DISCOVERY Q4] Dropi Wrapped para Dropshippers — Planificado
*   **Especificación Conductual:** Ver [Materialización de Dropi Wrapped](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#12-dropi-wrapped-para-dropshippers-prod-wrapped).
*   **Documentos de Trabajo:** [Opportunity Brief - Wrapped](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/opportunity_brief_wrapped.md) y [Plan de Ejecución Concierge](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/wrapped_concierge_plan.md).
*   **Piloto Concierge:** Resumen personalizado Wrapped enviado vía WhatsApp a 30 sellers (piloto) contra 30 (control) para medir retorno.
*   **Próximos Pasos:** Ejecutar queries de selección en Supabase y lanzar el contacto comercial del piloto.
