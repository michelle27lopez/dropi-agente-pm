---
name: project-data-sellers
description: Contexto estratégico, operativo y portafolio de la Célula Seller Success para S2 2026. PM: Santiago Herrera. Actualizado el 23 de julio de 2026.
metadata:
  type: project
---

# Portafolio Seller Success — S2 2026

Este documento centraliza el direccionamiento estratégico, los objetivos, los KPIs y el portafolio exclusivo de proyectos de la célula **Seller Success** (Dropshipper / E-commerce) para el segundo semestre de 2026 (Q3 + Q4), liderada por Santiago Herrera (PM) y Alejandra Melo (Product Designer).

---

## 1. Direccionamiento Estratégico

*   **Propósito:** Impulsar las ventas de los dropshippers para apalancar el crecimiento de órdenes en Dropi.
*   **Norte:** Que cada dropshipper gane dinero vendiendo en la plataforma.
    *   *Activación:* Primera orden rentable.
    *   *Retención:* Ganancia sostenida o creciente.
*   **NSM de la célula:** Órdenes/mes de sellers activos (palanca al OKR 1.1 de la compañía: alcanzar 7.8M órdenes/mes).
*   **Población objetivo:** Dropshippers (sub-perfiles: Rebuscador Digital, Empleado Aspirante, Joven Visionario).

### Enfoques por Trimestre
*   **Q3 — Activación y Time-to-Value (TTV):** Reducir fricción y aumentar el nivel cognitivo del usuario mediante herramientas self-service. Foco en la activación neta y bruta.
*   **Q4 — Escalamiento de usuarios y evitar churn:** Crecimiento de usuarios activos y reducción de abandonos a partir de la activación de Q3.

---

## 2. Diferenciación: Huérfano vs Comunidad

*   **Huérfanos (Foco estratégico de activación):**
    *   *Contexto:* Entran directo sin formación ni comunidad. Desconocen el e-commerce/dropshipping. Tasa de activación neta actual: **2.9%**.
    *   *Comportamiento:* Inician con órdenes manuales. Su barrera es entender el modelo logístico y encontrar productos.
    *   *Implicación:* Requieren onboarding auto-guiado, tour guiado, y reducción de fricción inicial.
*   **Comunidades:**
    *   *Contexto:* Vienen pre-formados por líderes. Tasa de activación neta actual: **23%**.
    *   *Comportamiento:* Conectan integraciones (Shopify/Woo) de inmediato.
    *   *Implicación:* El onboarding debe articularse con la formación del líder para acelerar su ruta.

---

## 3. Definiciones y Fórmulas de Negocio

### Orden Rentable
Fórmula de referencia (trabajo con Predizer.ai, dic 2025). El seller efectivamente gana dinero cuando:

$$\text{Ganancia} > 0$$

*   **Si la orden es entregada:** $\text{Ganancia} = Pv - Pp - F - D$
*   **Si la orden es devuelta:** $\text{Ganancia} = -F$ (pérdida del costo del flete)

Donde:
*   **Pv (Precio de Venta):** Lo que paga el comprador final.
*   **Pp (Precio de Producto):** El costo del proveedor.
*   **F (Flete):** Costo del transporte/envío.
*   **D (Fee de Dropi):** Comisión cobrada por la plataforma.

---

## 4. Portafolio de Proyectos S2

### 1. Simplificación del Flujo de Registro (Transversal)
*   **Descripción:** Rediseño y simplificación del onboarding para reducir la fricción en el registro inicial (con Paola y Diana).
*   **Problema:** UX bloqueado por exceso de popups y pasos al ingresar.
*   **Principio conductual:** La validación de identidad no es obligatoria para la primera orden. Se pospone hasta que el usuario realice movimientos en la wallet.
*   **Estado:** Investigación avanzada / flujos conceptuales existentes / pendiente de priorización.

### 2. Prototipo "Lovable" de Activación
*   **Descripción:** Prototipo finalizado (`dropi-profile-buddy.lovable.app` con Daniela) para transformar la experiencia de descubrimiento.
*   **Objetivo:** Reducir la fricción cognitiva del dropshipper al descubrir, evaluar y guardar productos.
*   **Estado:** Prototipo finalizado / pendiente de revisión técnica para implementación y adopción.

### 3. Personalización vía User Pilot
*   **Descripción:** Encuesta de nivel de conciencia + tour guiado específico para huérfanos.
*   **Acción clave:** Sincronización con Laura Torres para auditar experiencias activas y datos capturados.
*   **Estado:** En curso.

### 4. Dropy Academy: "Tu primera venta en 7 días"
*   **Descripción:** Flujo educativo asociado al CRM para acompañar a los nuevos dropshippers.
*   **Estado:** Operativo / pendiente de auditoría de contenido.

### 5. Experimento: "Pide tu Muestra"
*   **Descripción:** Incentivar que el dropshipper cree una primera orden manual para sí mismo como prueba logística ("sé tu primer cliente").
*   **Hipótesis:** Comprar su propio producto reduce el miedo, enseña el flujo logístico y valida la entrega física.
*   **Métrica:** Conversión de Registro a Primera Orden Manual.
*   **Estado:** Planificado.

### 6. Biblia de AI (Colaboración SAC)
*   **Descripción:** Integración de herramientas de IA para soporte self-service y reducción de tickets.
*   **Colaborador:** José Pineda Pitre.
*   **Estado:** Planificado.

---

## 5. Mantenimiento y Soporte (Bugs Integración)

### Bugs Tienda Nube (STID-6598)
*   **Descripción:** 6 fallas críticas de integración en Tienda Nube: importación masiva rota, mapeo de ciudades (ej. Pasto), pérdida de variables (tallas/colores) en perfiles de marca, sincronización inestable de webhooks, descuentos (Order Bump) no leídos y direcciones incompletas.
*   **Estado:** Tareas por hacer (High, sin asignar en Jira).

---

## 6. Métricas de Éxito (KPIs)

*   **Activación Neta (Huérfanos):** Incrementar del 2.9% al `[Meta]%`.
*   **Retención Prematura:** $\ge 70\%$ de recurrencia tras la primera orden entregada.
*   **Adopción de Integraciones:** Transición de órdenes manuales a automatizadas (Shopify/WooCommerce).
