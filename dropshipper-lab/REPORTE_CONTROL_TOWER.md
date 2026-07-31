# 🏰 CONTROL TOWER REPORT — Célula Seller Success

> Reporte consolidado del estado de la célula utilizando el framework de agentes del PM Operating System.

**Fecha:** 2026-07-23  
**Célula:** Seller Success (Dropshipper / E-commerce)  
**Dupla:** Santiago Herrera (PM) · Alejandra Melo (Designer)

---

## 📢 EXECUTIVE REPORTER — Estado de KPIs y Métricas Base

### KPIs de Activación y Retención (Power BI)
*   **Sellers Registrados (Histórico):** **397.000** (397k).
*   **Dropshippers Activos (Totales):** **43.000** (43k).
*   **Tasa de Activación Bruta:** **7,6%** (Sellers con $\ge 1$ orden creada).
*   **Tasa de Activación Neta:** **5,2%** (Sellers con $\ge 1$ orden entregada - *TTV bruto 7,4d, neto 16d*).
*   **Supervivencia 30d (Retención):** **69,7%** (Promedio mensual de cohorte).

---

## 🟢 EN CURSO — Lo que estamos haciendo hoy

### 1. Bugs Tienda Nube (STID-6598) — Urgente
*   *Objetivo:* Corregir 6 fallas críticas (bloquean onboarding, flete de Order Bump, tallas/colores de marcas, webhook COD y direcciones sin Barrio/Piso).
*   *Estado:* En curso.
*   *Acción:* Presionar asignación de dev con Jose Giraldo y testear fletes en partners portal.

### 2. Page Pilot — Activación Huérfanos (PROD-1663 / PRM-1238)
*   *Objetivo:* Validar creador de páginas para lograr la 1ª orden rentable.
*   *Estado:* En curso.
*   *Acción:* Reunión con Miguel Ángel para auditar baseline de ganancias (PROD-1341), mapear funnel AS-IS (PROD-1351) y coordinar el flag de desarrollo (la DropiCard PROD-1515 fue resuelta por Tesorería).

### 3. Módulo de Notificaciones (PROD-1664 / PRM-1305)
*   *Objetivo:* Reducir TTV e incentivar la primera orden manual mediante prompts.
*   *Estado:* En curso.
*   *Acción:* Discovery de Novedades (PROD-1697) y track operativo (PROD-1692) liderados por Santiago y Alejandra.

### 4. Refactor Dropify — Cierre de Legado (PRM-1239)
*   *Objetivo:* Modernizar el plugin y app Shopify 2.0.
*   *Estado:* En curso.
*   *Acción:* Monitorear desarrollo Shopify (Diego Pérez) y specs Tienda Nube (Alejandra).

### 5. Personalización UserPilot (PROD-PILOT)
*   *Objetivo:* Encuesta y tour de onboarding segmentado para huérfanos.
*   *Estado:* En curso.
*   *Acción:* Sincronización de data y experiencias con Laura Torres.

---

## 🟡 PARKING LOT — Proyectos por iniciar / Backlog

### 6. Proyecto Help Center (PROD-HELP)
*   *Objetivo:* Exposición del catálogo de FAQs en Home, Botón Flotante y Website.
*   *Estado:* Por iniciar (Planificado).
*   *Acción:* Alinear flujos de widget con José Pineda.

### 7. Prototipo Lovable de Activación (PROD-BUDDY)
*   *Objetivo:* Integrar el `profile-buddy` Lovable al journey.
*   *Estado:* Por iniciar (Prototipo finalizado).
*   *Acción:* Revisión de viabilidad técnica con Jose Giraldo.

### 8. Dropy Academy (PROD-ACADEMY)
*   *Objetivo:* Curso "Tu primera venta en 7 días" integrado al CRM.
*   *Estado:* Por iniciar (Operativo).
*   *Acción:* Auditoría de contenido del curso.

### 9. Experimento: Pide tu Muestra (PROD-MUESTRA)
*   *Objetivo:* Fomentar la 1ª orden manual de prueba del propio dropshipper.
*   *Estado:* Por iniciar (Planificado).
*   *Acción:* Diseñar funnel de conversión de muestra y configurar lógica de checkout.

### 10. Loop de Hábito y Diagnóstico de Churn (PROD-1400 / PROD-1401)
*   *Objetivo:* Estrategia de retención Q4.
*   *Estado:* Por iniciar (Planificado).
*   *Acción:* Diagnóstico de abandono vía SDT y loop de hábito post-venta.
