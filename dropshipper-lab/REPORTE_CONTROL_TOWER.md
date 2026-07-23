# 🏰 CONTROL TOWER REPORT — Célula Seller Success

> Reporte consolidado del estado de la célula utilizando el framework de agentes del PM Operating System.

**Fecha:** 2026-07-23  
**Célula:** Seller Success (Dropshipper / E-commerce)  
**Dupla:** Santiago Herrera (PM) · Alejandra Melo (Designer)

---

## 📢 EXECUTIVE REPORTER — Estado General y KPIs
El foco estratégico de Q3 está en **Activación y TTV (Time-to-Value)** del dropshipper huérfano para mover el OKR 1.1 (aumentar cantidad de órdenes en la plataforma).

### Métricas y Embudo Base
*   **Activación Neta (Huérfanos):** **2.9%** (Sellers huérfanos con $\ge 1$ orden entregada). *Meta Q3: TBD*.
*   **Tasa de Activación Bruta:** **11.5%** ($\ge 1$ orden creada).
*   **Tasa de Rebote (Bounce):** **74.3%** ($\le 1$ sesión web).
*   **Sellers Activos (30d):** **1.487**.

---

## 🔍 DISCOVERY ANALYST — Estado de validación (F0 - F1)
Foco en entender las barreras cognitivas y conductuales del dropshipper huérfano.

### 1. Page Pilot (PROD-1663) — En curso
*   **Comportamiento Objetivo:** El dropshipper huérfano publica su primer producto y crea una orden rentable en su primer viaje ($\le 14$ días).
*   **Fórmula de Orden Rentable (Predizer.ai):**
    *   *Entregada:* $Pv - Pp - F - D > 0$
    *   *Devuelta:* $-F$
*   **Pendiente de Discovery:** Mapear funnel AS-IS (PROD-1351) y agendar sesión con Miguel Ángel (Data) para auditar el baseline de ganancias bajo esta fórmula (PROD-1341).

### 2. Módulo de Notificaciones / Novedades (PROD-1664) — En curso
*   **Comportamiento Objetivo:** El seller resuelve una novedad logística o confirma una orden pendiente de forma autónoma en $\le 24$h.
*   **Hipótesis Conductual:** La fricción en novedades genera desconfianza y abandono. Notificaciones proactivas y claras aumentan la habilidad (A) y la acción (P).
*   **Pendiente de Discovery:**
    *   *PROD-1698:* Benchmark de novedades en 3 competidores (CJ, Zendrop, Spocket) + Shopify + Meli.
    *   *PROD-1721:* Mapeo B=MAP y entrevistas a 5–8 dropshippers con novedades abiertas.

---

## 🛠️ DELIVERY CONTROLLER — Estado de Desarrollo y Bloqueos
Seguimiento de la calidad de entrega, dependencias técnicas y riesgos.

### 1. Refactor Dropify (Shopify, WooCommerce, Tienda Nube) — En curso
*   **Shopify 2.0 (DROP-17354):** 11/18 historias listas. Backend de sincronización y frontend en curso por Diego Pérez.
*   **WooCommerce (DROP-17355):** Migración a React finalizada. En estado *Handoff* (esperando inicio de dev).
*   **Tienda Nube (DROP-25311):** Discovery de producto activo (PROD-1519) por Alejandra Melo (Sprint 27-28). Bloqueado hasta que Shopify 2.0 esté estable en producción.

### 2. Bugs Tienda Nube (STID-6598) — En curso (Urgente)
*   **Riesgo:** 6 fallas críticas activas que bloquean el onboarding y control de inventario de marcas.
*   **Bloqueante:** Pendiente asignación de desarrollador en Jira. Santiago debe alinear con Jose Giraldo.

### 3. Bloqueantes de Page Pilot (Beta Controlada 100 usuarios)
*   **Financiero (PROD-1515):** Bloqueado por emisión de la DropiCard y límites.
*   **Desarrollo (PROD-1516):** Pendiente habilitar flag en producción para cohorte beta.
*   **QA (PROD-1376):** Pendiente testeo de actualizaciones del Creador de Páginas.

---

## 🧭 PM SYSTEMS ARCHITECT — Próximos pasos e Iniciativas de Roadmap
Prioridades y planeación de iniciativas del roadmap de activación de huérfanos.

### Próximos Pasos (Semana 21-27 jul 2026)
1.  **Alineación de Dev (STID-6598):** Asignar recurso a los bugs de Tienda Nube con Jose Giraldo.
2.  **Auditoría de Baseline (PROD-1341):** Reunión con Miguel Ángel para medir ganancias reales de sellers.
3.  **Destrabe Financiero (PROD-1515):** Gestionar tarjeta virtual para Page Pilot.
4.  **Discovery conductual:** Benchmark de novedades (PROD-1698) y entrevistas B=MAP (PROD-1721).

### Iniciativas del Roadmap de Activación (Por iniciar)
*   **Personalización UserPilot:** Sincronizar experiencias y encuestas activas (con Laura Torres).
*   **Dropy Academy:** Auditar curso "Primera venta en 7 días".
*   **Experimento "Pide tu Muestra":** Definir el viaje de compra manual del seller para sí mismo.
*   **Biblia de AI:** Planificación de soporte self-service con José Pineda.
