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
| **Tarjeta RAP (`PROD-RAP`)** | Fake Door (Home) | Muestra de sellers activos | CTR del CTA en RAP $\ge 35\%$ | **En Planificación** (Santiago con Diana/marketing) |
| **Simplificación Muestra (`PROD-MUESTRA-SIMP`)** | Test A/B (split-traffic) | Sellers nuevos registrados | Incremento de $15\%$ en conversión de muestras | **En Diseño de UI** (Alejandra Melo) |
| **Ayuda Contextual Módulos (`PROD-HELP-MOD`)** | Piloto Concierge/UserPilot | 50 sellers en integraciones/catálogo | Tasa de autogestión local $\ge 30\%$ | **En Definición** (Alejandra Melo) |
| **Buzón Feedback Darwin (`PROD-FEEDBACK`)** | Input interactivo (buzón) | Sellers activos (menú secundario) | Tasa de participación $\ge 15\%$ | **En Backlog** (Fase Wonder) |
| **Experimento TTV (`PROD-1478`)** | Alertas guiadas 3 pasos | Registrados en agosto con $\ge 1$ orden creada | Reducir TTV neto a < 12 días | **Bloqueado** (IDs UserPilot desalineados) |
| **Second Best (`PROD-SEC-BEST`)** | Guerrilla Test (Prototipo Mock) | 5 dropshippers del Pareto de base 360 | Tasa de aceptación del prompt $\ge 80\%$ | **En Discovery** (Alejandra Melo validando supuestos) |
| **Dropi Wrapped (`PROD-WRAPPED`)** | Piloto Concierge (WhatsApp) | Por definir en Discovery | Tasa de retorno $\ge 20\%$ en 7 días | **En Discovery** (Alejandra Melo trabaja en diseño conceptual) |
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
    *   Beta controlada con 120 usuarios (20 de cada uno de los 6 tipos de dropshippers) con más de 3 meses de actividad.
    *   Implementación y medición de la fórmula de "Orden Rentable" ($Pv - Pp - F - D > 0$).
*   **Estado:** En curso (Alineando data y funnel. DropiCard resuelta).
*   **Bloqueantes:**
    1.  *Desarrollo (PROD-1516):* Pendiente habilitar el flag en producción para los 120 usuarios seleccionados.
*   **Próximos Pasos (Santiago/Alejandra):**
    1.  Reunión con el Data Analyst (Miguel Ángel) para auditar el baseline de ganancias de sellers bajo la nueva fórmula (PROD-1341) y definir la parametrización de monedas y fletes (PROD-1348).
    2.  Mapear el funnel AS-IS de registro → publicación → orden entregada (PROD-1351).
    3.  Ajustes de UI: Asegurar ángulo de ventas obligatorio y alineación del selector de fecha (Alejandra).

### 3. Módulo de Notificaciones (PROD-1664) — En curso
*   **Objetivo:** Reducir el tiempo al primer valor (TTV) e incentivar la activación mediante prompts de confirmación de órdenes y rescate de novedades por WhatsApp.
*   **Estado:** En curso (Alejandra arma el prototipo y lo monta en RPP para presentación en la célula).
*   **Próximos Pasos:**
    1.  Presentar el prototipo de notificaciones de valor a María Ossa y al equipo técnico de notificaciones.

### 4. Refactor Dropify — Cierre de Legado (PROD-1667 / PRM-1239) — En curso
*   **Objetivo:** Reconstrucción integral de la aplicación de Shopify para paridad funcional con la versión anterior bajo arquitectura escalable "Built for Shopify".
*   **Alcance:**
    *   *Shopify 2.0 (DROP-17354):* Frontend (React) y backend nuevos (APIs, webhooks, reintentos). 11 de 18 historias completadas.
    *   *WooCommerce (DROP-17355):* Plugin WooCommerce migrado a React. En desarrollo por TI desde el 2 de julio, con fecha de entrega programada para el 4 de agosto.
    *   *Tienda Nube (DROP-25311):* Extensión del plugin, actualmente en fase de especificación (Alejandra Melo).
*   **Estado:** En curso (Shopify y WooCommerce), Backlog (Tienda Nube).
*   **Bloqueantes:** 
    1.  La Fase de Tienda Nube depende directamente de que la 2.0 de Shopify sea estable en producción.
    2.  **PROD-580 [CRÍTICO]:** Pruebas aisladas PT2 QA (Tokens, Sync Productos/Órdenes, Dashboard, Reglas) en estado: Bloqueado (Dependencia).
*   **Próximos Pasos (Santiago/Alejandra):**
    1.  Monitorear desarrollo de Diego Pérez en backend de sincronización y frontend de Shopify 2.0.
    2.  Validar el avance de WooCommerce en el weekly de desarrollo de los martes (entrega fijada para el 4-ago).
    3.  Alejandra finaliza las especificaciones de Tienda Nube (PROD-1519) en el sprint activo (27-28).
    4.  Realizar el QA respectivo sobre Shopify (Dropify 2.0).
    5.  Consultar aclaración a Diego Pérez sobre el pre-handoff (submenú y carga de imágenes al importar producto en Tienda Nube).

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

### 8. Simplificación de Muestras & Rediseño de Botones (PROD-MUESTRA-SIMP) — En curso
*   **Especificación Conductual:** Ver [Materialización de Simplificación de Muestras](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#13-simplificación-de-muestras--rediseño-de-botones-prod-muestra-simp).
*   **Objetivo:** Reducir la fricción de re-digitación del formulario (autofill, Temu-like), mantener la selección de transportadoras para experimentación y jerarquizar los botones en la ficha de producto (con validación previa de Kevin).
*   **Próximos Pasos:** Alejandra Melo lidera el diseño limpio de inputs en la ficha de producto (sin modal nuevo ni drawer).


---

## 📋 Proyectos del Roadmap (Por iniciar)

### 11. Biblia de AI / Proyecto Help Center (SAC) — Planificado
*   **Especificación Conductual:** Ver [Materialización de Help Center SAC](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#7-biblia-de-ai--proyecto-help-center-sac).
*   **Alcance:** Widget flotante buscador de soporte técnico con respuestas automatizadas auto-asistidas.
*   **Próximos Pasos:** Alinear con José Pineda los flujos de APIs disponibles y realizar Fake Door de clicks.

### 12. [RETENCIÓN] Instrumentar Capa 1.5: inversión y hábito post-venta (Epic PROD-1665) — Planificado (Q4 / Prep en Q3)
*   **Especificación Conductual:** Ver [Materialización de Capa 1.5](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#9-capa-15---hábito-post-venta-prod-1665).
*   **Objetivo:** Tracking de eventos `product_update` y `stock_check` en una ventana de 48h tras la primera entrega para forjar hábito.

### 13. [DISCOVERY Q4] Diagnóstico de churn y palancas de retención (Epic PROD-1666) — Planificado (Q4 / Prep en Q3)
*   **Especificación Conductual:** Ver [Materialización de Diagnóstico de Churn](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#10-diagnóstico-de-churn-prod-1666).
*   **Evidencia Comercial:** Según el [Análisis Comercial 360](file:///Users/santiago.herrera/.gemini/antigravity-ide/brain/da212732-6979-40ef-b40c-449412d5e18d/analysis_comercial_360.md), el 28% de la base prioritaria del Pareto se encuentra inactiva por fallas de stock o logística.

### 14. [DISCOVERY Q4] Enrutamiento dinámico (Second Best) — Planificado (En Discovery)
*   **Especificación Conductual:** Ver [Materialización de Second Best](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#11-enrutamiento-dinámico-second-best---prod-sec-best).
*   **Documento de Trabajo:** [Opportunity Brief - Second Best](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/opportunity_brief_second_best.md).
*   **Las Dos Líneas de Defensa:** Redirección automática a respaldo pre-seleccionado (Second Best) y subasta in-app de despacho urgente (Pulso).
*   **Enfoque actual:** En Discovery inicial. El prototipo es un mock para validar con los dropshippers del Pareto si prefieren asumir el sobrecosto versus cancelar la orden.
*   **Próximos Pasos:** Alejandra Melo (PD) correrá pruebas rápidas de guerrilla utilizando el mock interactivo con 5 dropshippers de la base 360 antes de cerrar el diseño final.

### 15. [DISCOVERY Q4] Dropi Wrapped para Dropshippers — Planificado (En Discovery)
*   **Especificación Conductual:** Ver [Materialización de Dropi Wrapped](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#12-dropi-wrapped-para-dropshippers-prod-wrapped).
*   **Documentos de Trabajo:** [Opportunity Brief - Wrapped](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/opportunity_brief_wrapped.md) y [Plan de Ejecución Concierge](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/wrapped_concierge_plan.md).
*   **Enfoque actual:** Era un mock inicial. Se trabajará en la definición conceptual y de Discovery.
*   **Próximos Pasos:** Alejandra Melo (PD) definirá el diseño UX/UI y el alcance en Discovery para darle más forma a la experiencia antes de planear el piloto.

### 16. Solicitud de Funciones / Feedback Interno (PROD-FEEDBACK) — Planificado (Q4)
*   **Especificación Conductual:** Ver [Materialización de Feedback Interno](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#16-solicitud-de-funciones--feedback-interno-prod-feedback).
*   **Objetivo:** Buzón interactivo privado e integrado in-app para capturar dolores de los usuarios de forma segura sin revelar información a la competencia.
*   **Próximos Pasos:** Alejandra Melo conceptualiza el diseño de interacción para Darwin.
