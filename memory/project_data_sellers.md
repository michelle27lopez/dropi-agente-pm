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
    *   *Contexto:* Entran directo sin formación ni comunidad. Desconocen el e-commerce/dropshipping. Tasa de activación neta actual: **5.2%**.
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

## 📊 Requerimiento de Data e Instrumentación (PROD-1341)

Especificaciones enviadas a Miguel Ángel (Data Analyst) para auditar el baseline y preparar la sesión con Finanzas:

### 1. Métricas Solicitadas y Rangos de Fechas Calculados
*   **Activación bruta:** % de sellers registrados que crean su 1ª orden.
    *   *Rango 90 días:* **24 de abril de 2026 a 23 de julio de 2026**.
    *   *Rango histórico (6 meses):* **1 de enero de 2026 a 30 de junio de 2026** (meses cerrados) + Julio 2026 (en curso).
*   **Activación neta:** % de sellers registrados cuya 1ª orden llega a "entregada".
    *   *Rango 90 días:* **24 de abril de 2026 a 23 de julio de 2026**.
    *   *Rango histórico (6 meses):* **1 de enero de 2026 a 30 de junio de 2026** (meses cerrados) + Julio 2026 (en curso).
*   **TTV bruto:** Mediana de días entre registro y 1ª orden creada (Rango 90 días: **24 de abril a 23 de julio de 2026**).
*   **TTV neto:** Mediana de días entre registro y 1ª orden entregada (Rango 90 días: **24 de abril a 23 de julio de 2026**).
*   **Cohorte de supervivencia post 1ª orden:** % de dropshippers con $\ge 1$ orden adicional en los 30 días posteriores a la primera (Cohortes de los últimos 3 meses cerrados: **Abril 2026, Mayo 2026 y Junio 2026**).
*   **Órdenes por dropshipper activo:** Promedio mensual de sellers con $\ge 1$ orden en el mes (Últimos 3 meses cerrados: **Abril 2026, Mayo 2026 y Junio 2026**).

### 2. Desagregaciones Requeridas
*   Total acumulado y por país.
*   Origen de la orden (Manual vs. Integración).

### 3. Checklist de Cobertura de Eventos a Confirmar
*   `[ ]` Registro completado.
*   `[ ]` Configuración de tienda (nombre, logo, datos bancarios).
*   `[ ]` Primer producto publicado (importado o manual).
*   `[ ]` Primera orden creada.
*   `[ ]` Primera orden pagada por comprador.
*   `[ ]` Primera orden despachada.
*   `[ ]` Primera orden entregada.
*   `[ ]` Primera orden con ganancia positiva (Orden Rentable).

### 4. Data de Orden Rentable (Para sesión con Finanzas)
*   Ingreso por orden desglosado por país y moneda.
*   Fee de Dropi por orden.
*   Costo de flete por orden.
*   Canal de venta (verificar existencia en BD o instrumentar).

---

## 4. Portafolio de Proyectos S2

### 1. Simplificación del Flujo de Registro (Transversal)
*   **Descripción:** Rediseño y simplificación del onboarding para reducir la fricción en el registro inicial (con Paola y Diana).
*   **Problema:** UX bloqueado por exceso de popups y pasos al ingresar.
*   **Principio conductual:** La validación de identidad no es obligatoria para la primera orden. Se pospone hasta que el usuario realice movimientos en la wallet.
*   **Estado:** Investigación avanzada / flujos conceptuales existentes / pendiente de priorización.

### 2. Prototipo "Lovable" de Activación & Lanzamiento Page Pilot (PROD-1663)
*   **Descripción:** Prototipo finalizado (`dropi-profile-buddy.lovable.app` con Daniela) para transformar la experiencia de descubrimiento y simplificar la creación de tiendas.
*   **Objetivo:** Reducir la fricción cognitiva del dropshipper al descubrir, evaluar y guardar productos.
*   **Acciones de Lanzamiento:** 
    *   **PROD-1814 — Workshop lanzamiento Page Pilot:** Planificar el lanzamiento a producción de la funcionalidad Page Pilot bajo la metodología TARS. Incluye reuniones con el equipo de sellers, Figma con workshop de ideación y visualización de data, y documentación en Confluence y Darwin. Liderado por Catherin Salazar.
*   **Estado:** Beta controlada / En curso (bloqueado por dependencias de QA en `PROD-1376` y DropiCard en `PROD-1515`).

### 3. Personalización vía User Pilot & Experimento de Activación Neta (TTV) (PROD-1478)
*   **Descripción:** Encuesta de nivel de conciencia + tour guiado específico para huérfanos.
*   **Experimento de Activación Neta (TTV):** Diseñar y ejecutar en agosto una intervención mínima enfocada en el tramo crítico de "orden creada → orden entregada" (Time-to-Value) para identificar qué frena a los sellers y acelerar su primer retorno. Liderado por Francisco Velandia.
*   **Métricas del Experimento:** Brecha de días entre TTFO (bruto) y TTV (neto), y % de órdenes que pasan a entregadas.
*   **Estado:** En curso (User Pilot) / Planificado (Experimento para agosto).

### 4. Dropy Academy: "Tu primera venta en 7 días"
*   **Descripción:** Flujo educativo asociado al CRM para acompañar a los nuevos dropshippers.
*   **Estado:** Operativo / pendiente de auditoría de contenido.

### 5. Experimento: "Pide tu Muestra" (PROD-MUESTRA)
*   **Descripción:** Incentivar que el dropshipper cree una primera orden manual para sí mismo como prueba logística ("sé tu primer cliente").
*   **Hipótesis:** Comprar su propio producto reduce el miedo, enseña el flujo logístico y valida la entrega física.
*   **Métrica:** Conversión de Registro a Primera Orden Manual.
*   **Prototipo Interactivo (1-Clic & Setup Único):** [/prototipos/solicitud-muestra-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/solicitud-muestra-poc.html).
*   **Estado:** En curso (Prototipo finalizado).

### 6. Biblia de AI / Proyecto Help Center (SAC)
*   **Descripción:** Widget flotante buscador de FAQs para incentivar la autogestión de dudas técnicas y reducir tickets de soporte de nivel 1. Ver [Materialización Help Center](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#7-biblia-de-ai--proyecto-help-center-sac).
*   **Estado:** Planificado (Fase inicial de definición / Benchmark).

### 7. Discovery de Mejoras en Gestión de Órdenes del Seller (Epic PROD-1729)
*   **Descripción:** Habilitar carga masiva de órdenes compuestas (`PROD-1707`) y evidencias centralizadas en Torre Logística (`PROD-1706`). Ver [Materialización Gestión de Órdenes](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#5-gestión-de-órdenes-del-seller-prod-1729).
*   **Estado:** En backlog, asignado a Santiago Herrera.

### 8. Huella Digital 3.0 (PROD-1546)
*   **Descripción:** Optimización del checkout in-app y flujo de vinculación bancaria. Ver [Materialización Huella Digital 3.0](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#8-huella-digital-30-prod-1546).
*   **Estado:** En backlog, asignado a Alejandra Melo.

### 9. [RETENCIÓN] Instrumentar Capa 1.5: inversión y hábito post-venta (Epic PROD-1665)
*   **Descripción:** Tracking de eventos `product_update` y `stock_check` en una ventana de 48h tras la primera entrega para consolidar hábito. Ver [Materialización Capa 1.5](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#9-capa-15---hábito-post-venta-prod-1665).
*   **Estado:** Planificado (Q4 / Preparación en Q3).

### 10. [DISCOVERY Q4] Diagnóstico de churn y palancas de retención (Epic PROD-1666)
*   **Descripción:** Segmentación y rescate de la cohorte del Pareto activa. Ver [Materialización Diagnóstico de Churn](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#10-diagnóstico-de-churn-prod-1666).
*   **Estado:** Planificado (Q4 / Preparación en Q3).

### 11. [DISCOVERY Q4] Enrutamiento dinámico y multi-proveedor - Second Best
*   **Descripción:** Redirección automática de órdenes a respaldo pre-seleccionado y subasta in-app de despacho (Pulso). Ver [Materialización Second Best](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#11-enrutamiento-dinámico-second-best---prod-sec-best).
*   **Estado:** Planificado (Q4 / Discovery en Backlog).

### 12. [DISCOVERY Q4] Dropi Wrapped para Dropshippers
*   **Descripción:** Retrospectiva interactiva personalizada de percentiles y racha para reactivación inter-campaña. Ver [Materialización Dropi Wrapped](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#12-dropi-wrapped-para-dropshippers-prod-wrapped).
*   **Estado:** Planificado (Q4 / Discovery en Backlog).

---

## 🧭 Alineación de Iniciativas con el Direccionamiento de la Holding

Toda la planeación de la célula se estructura para que cada iniciativa responda de forma directa a las dimensiones del Universo Dropi:

| Proyecto / Iniciativa | Territorio Principal | Nivel de Madurez | Etapa Cadena de Valor | Lente Cognitivo (Métrica) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Simplificación de Registro** | E-commerce | A. Iniciando | 1. Onboarding / Registro | Reptiliano (Bounce) |
| **2. Prototipo Lovable & Workshop**| E-commerce | A. Iniciando | 2. Producto (Descubrimiento) | Reptiliano (Time-to-Value) |
| **3. Personalización & TTV (PROD-1478)**| E-commerce | A. Iniciando | 1. Onboarding / Activación neta | Reptiliano (Registro → Entrega) |
| **4. Dropy Academy (7 días)** | E-commerce | A. Iniciando | 1. Educación (Ventas) | Límbico (Hábito de venta) |
| **5. Experimento Pide tu Muestra**| Logística | A. Iniciando | 4. Logística (Orden manual) | Reptiliano (Seguridad operativa) |
| **6. Proyecto Help Center (SAC)** | Logística / Finanzas| A. Iniciando / B. Consolidando | 5. Posventa (Autogestión) | Reptiliano (Reducción tickets) |
| **7. Gestión de Órdenes (PROD-1729)**| Logística | B. Consolidando | 4. Logística (Órdenes) | Límbico (Eficiencia operativa) |
| **8. Huella Digital 3.0 (PROD-1546)**| E-commerce | B. Consolidando | 2. Producto (Checkout) | Límbico (Conversión recurrentes) |
| **9. Instrumentación Capa 1.5** | E-commerce | B. Consolidando | 6. Fidelización (Hábito post-venta) | Límbico (Retención/Acciones 48h) |
| **10. Diagnóstico de Churn (PROD-1666)**| E-commerce | B. Consolidando | 6. Fidelización (CRM/Rescate) | Límbico (Supervivencia 30d) |
| **11. Enrutamiento dinámico (Second Best)**| Logística | B. Consolidando | 4. Logística (Stockout) | Límbico (Fiabilidad/Fidelidad) |
| **12. Dropi Wrapped** | E-commerce | B. Consolidando | 6. Fidelización (Wrapped) | Límbico (Progreso/Racha) |
| **13. Refactor Dropify (CMS 2.0)**| Tecnología | B. Consolidando | 4. Logística / 3. Mercadeo | Límbico (Automatización/Hábito) |
| **14. Bugs Tienda Nube** | Logística | B. Consolidando | 4. Logística (Stock/Webhook) | Reptiliano (Corrección fallas) |

---

## 5. Mantenimiento y Soporte (Bugs Integración)

### Bugs Tienda Nube (STID-6598)
*   **Descripción:** 6 fallas críticas de integración en Tienda Nube: importación masiva rota, mapeo de ciudades (ej. Pasto), pérdida de variables (tallas/colores) en perfiles de marca, sincronización inestable de webhooks, descuentos (Order Bump) no leídos y direcciones incompletas.
*   **Estado:** Tareas por hacer (High, sin asignar en Jira).

---

## 6. Métricas de Éxito (KPIs)

*   **Activación Neta (Huérfanos):** Incrementar del 5.2% al `[Meta]%`.
*   **Retención Prematura:** $\ge 70\%$ de recurrencia tras la primera orden entregada (Mediana de cohortes).
*   **Adopción de Integraciones:** Transición de órdenes manuales a automatizadas (Shopify/WooCommerce/Tienda Nube).

