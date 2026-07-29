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
## 📋 Estado por Frente de Trabajo

### 1. Integraciones con CMS & Canales (Tienda Nube, Mercado Libre, Astroselling) — En curso
*   **Objetivo:** Resolver los bugs críticos en Tienda Nube (sincronización de variables, fletes y Barrio/Piso) y expandir la robustez de canales multitienda.
*   **Estado:** En curso de desarrollo de bugs (`STID-6598`).
*   **Próximos Pasos (CEO Sinc):**
    1.  Estructurar el soporte de **Tienda Nube para Argentina y México**.
    2.  Realizar un **benchmark de Astroselling** para analizar cómo maneja el stock sincronizado en múltiples plataformas simultáneamente.
    3.  Planificar la integración nativa con **Mercado Libre para Argentina y México**.
    4.  Hacer pruebas manuales del Order Bump en el portal de partners de Tienda Nube.

### 2. Page Pilot — Activación de Huérfanos (PROD-1663 / PRM-1238) — En curso
*   **Objetivo:** Validar el Creador de Páginas como palanca para que el dropshipper logre su primera orden rentable ($Pv - Pp - F - D > 0$) en $\le 14$ días.
*   **Estado (CEO Sinc):** Saldremos a producción con el piloto de 120 usuarios seleccionados de forma controlada, pero con el foco en **monitorear de cerca cómo crece internamente** antes de escalar la pauta o campañas comerciales masivas.
*   **Próximos Pasos:** Habilitar el flag en producción (`PROD-1516`) y coordinar con Miguel Ángel (Data) la auditoría del baseline bajo la nueva fórmula de orden rentable.

### 3. Módulo de Notificaciones y Ayuda Contextual (PROD-1664 / PROD-HELP-MOD) — En curso
*   **Objetivo:** Prompt dispatcher conductual (multicanal 360) para mover a los usuarios a través del B=MAP ante eventos clave en tiempo real.
*   **Alineación (CEO Sinc):** El proyecto de ayuda contextual/guías de usuario por módulo (`PROD-HELP-MOD`) **debe alinearse y unirse directamente con el proyecto de la Biblia de AI / Help Center (SAC)** para que no se traslapen los contenidos ni se duplique la carga cognitiva de widgets flotantes in-app.
*   **Próximos Pasos:** Presentar el prototipo de WhatsApp a María Ossa y estructurar el motor de prompts transversal antes del Q4 (Eje de Retención).

### 4. Refactor Dropify — Cierre de Legado (PROD-1667 / PRM-1239) — En curso
*   **Objetivo:** Reconstrucción de la aplicación de Shopify para paridad funcional bajo arquitectura "Built for Shopify" y migración de WooCommerce a React.
*   **Estado:** WooCommerce en desarrollo (entrega 4-ago). Shopify en QA (`PROD-580`).
*   **Próximos Pasos (CEO Sinc):**
    1.  **Optimizar la página de descripción de Dropify** en la tienda de aplicaciones en conjunto con el equipo de **Growth**.
    2.  Verificar y asegurar que tengamos una funcionalidad simple de **sincronización de productos ya creados en Shopify con Dropi** (importación/mapeo directo facilitado).

### 5. Gestión de Órdenes del Seller (Epic PROD-1729) — Por iniciar
*   **Alcance:** Carga masiva de órdenes compuestas (`PROD-1707`) y evidencias en Torre Logística (`PROD-1706`).
*   **Estado:** En backlog (prioridad Medium, asignado a Santiago Herrera).

---

## 🔬 Experimentos y Descubrimientos Activos

### 6. Experimento de Activación Neta (TTV) (PROD-1478) — En Planificación
*   **Baseline & Metas:** TTV Neto actual = **16.0 días** $\to$ Meta del Piloto = **< 12.0 días**.
*   **Estado:** Bloqueado temporalmente por desalineación de IDs en UserPilot.

### 7. Huella Digital 3.0 (PROD-1546) — En Planificación
*   **Fuga en Embudo:** Registro a Onboarding = 11.9% (tienda) y 0% (wallet).
*   **Estado:** En planificación. Alejandra Melo diseña flujos simplificados de wallet en Figma.

### 8. Simplificación de Muestras & Rediseño de Botones (PROD-MUESTRA-SIMP) — En curso
*   **Objetivo:** Autofill de dirección 1-clic y jerarquización de botones de ficha de producto.
*   **Estado:** En diseño de UI por Alejandra Melo.

### 9. Enrutamiento Dinámico (Second Best - PROD-SEC-BEST) — En Discovery
*   **Objetivo:** Redirección a proveedor de respaldo ante stockouts para retener margen y GMV.
*   **Alineación (CEO Sinc):** Conectar la investigación y el flujo del prototipo de guerrilla con la **idea previa de órdenes automatizadas** para reutilizar la lógica de desvío automático.
*   **Estado:** Alejandra Melo realiza guerrilla testing con 5 dropshippers del Pareto usando el mock interactivo.

### 10. Buzón Feedback Darwin (PROD-FEEDBACK) — En Discovery
*   **Objetivo:** Captura transversal de feedback en todos los módulos (checkout, catálogo, wallet) para alimentar las decisiones estratégicas de Darwin.
*   **Alineación (CEO Sinc):** No desarrollar este buzón desde cero. **Debe alinearse con la iniciativa que ya está haciendo el equipo de Experience** (ya se tenía un proyecto anterior y existe un diseño definitivo para este botón). El objetivo es integrarlo y desplegarlo de forma transversal en toda la plataforma.
*   **Estado:** En backlog conceptual.

### 11. Biblia de AI / Proyecto Help Center (SAC) — Planificado
*   **Alineación:** Integrar con la ayuda contextual (`PROD-HELP-MOD`) para centralizar la entrega de guías automatizadas de soporte técnico.

---

## 📋 Proyectos Nuevos y Oportunidades (CEO Sinc - Julio 2026)

### 12. Proyecto Affiliated / Seller Success
*   **Alcance:** Consolidar el stack de captación y herramientas de afiliados.
*   **Estado:** Contamos con las integraciones de **Shopify** y **Minea** activas.
*   **En cola de desarrollo:** Integraciones de **Meta** y **TikTok**.

### 13. Investigación de Nuevas Oportunidades & Competencia
*   **Alineaciones clave:**
    1.  **Herramienta Comercial:** Unificar las herramientas de discovery e insights de producto con la herramienta del equipo comercial general de Dropi.
    2.  **Seguimiento de Competencia:** Implementar dashboards de benchmarking y competitor tracking estructurados.
    3.  **Proyecto Sherlock:** Unificar el módulo Sherlock (asistente de novedades) con la gestión de atención en grupos de WhatsApp de **Laura Contreras**, definiendo claramente a quién se asigna la operación y el dueño del canal.

### 14. Programa Leyendas Dropi (Eje Transversal)
*   **Objetivo:** Mapear y coordinar cómo se une Leyendas con todas las verticales de Darwin (onboarding, Dropify, Page Pilot y notificaciones) para que actúe como el eje unificado de retención, gamificación y fidelización de sellers y líderes de comunidad.
*   **Documento de referencia:** [contexto_leyendas_dropi.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/agente-delivery/context/approved/contexto_leyendas_dropi.md).

---

## 📋 Proyectos del Roadmap (Por iniciar)

### 15. [RETENCIÓN] Instrumentar Capa 1.5: inversión y hábito post-venta (Epic PROD-1665) — Planificado
### 16. [DISCOVERY Q4] Diagnóstico de churn y palancas de retención (Epic PROD-1666) — Planificado
### 17. Solicitud de Funciones / Feedback Interno (PROD-FEEDBACK) — Planificado (Q4)
*   **Objetivo:** Buzón interactivo privado e integrado in-app para capturar dolores de los usuarios de forma segura sin revelar información a la competencia.
*   **Próximos Pasos:** Alejandra Melo conceptualiza el diseño de interacción para Darwin.
