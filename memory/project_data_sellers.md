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

### 6. Biblia de AI / Proyecto Help Center (Colaboración SAC)
*   **Descripción:** Integración de herramientas de IA y exposición de la librería de preguntas frecuentes (FAQs) para incentivar la autogestión de dudas técnicas dentro del ecosistema y reducir la carga de tickets en la mesa de ayuda.
*   **Colaborador:** José Pineda Pitre.
*   **Superficies de Impacto:**
    *   *Home:* Acceso directo y contextual a guías de ayuda.
    *   *Botón Flotante:* Rediseño estilo widget interactivo (tipo Intercom) con barra de búsqueda de artículos de ayuda y pestañas organizadas (*Inicio, Mensajes, Help/Ayuda, News, Tasks*).
    *   *Website:* Reutilización y rediseño de las FAQs que hoy están aisladas en la sección de blog.
*   **Problema Actual:** El usuario solo entra al botón flotante para hablar con la mesa de ayuda (sin capa intermedia de autogestión). El blog del website recoge FAQs de manera desarticulada del flujo de la app.
*   **Benchmarks de Referencia:**
    *   [Shopify Help Center](https://help.shopify.com/en)
    *   [MercadoLibre Ayuda](https://www.mercadolibre.com.co/ayuda)
    *   [Alibaba HelpCenter](https://helpcenter.alibaba.com/s/ggs)
    *   [Amazon Servicio al Cliente](https://www.amazon.com/-/es/gp/help/customer/display.html?nodeId=GSD587LKW72HKU2V)
*   **Estado:** Planificado (Fase inicial de definición / Benchmark).

---

## 🧭 Alineación de Iniciativas con el Direccionamiento de la Holding

Toda la planeación de la célula se estructura para que cada iniciativa responda de forma directa a las dimensiones del Universo Dropi:

| Proyecto / Iniciativa | Territorio Principal | Nivel de Madurez | Etapa Cadena de Valor | Lente Cognitivo (Métrica) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Simplificación de Registro** | E-commerce | A. Iniciando | 1. Educación / Registro | Reptiliano (Bounce) |
| **2. Prototipo Lovable (Buddy)** | E-commerce | A. Iniciando | 2. Producto (Descubrimiento) | Reptiliano (Time-to-Value) |
| **3. Personalización UserPilot** | E-commerce | A. Iniciando | 1. Educación / Onboarding | Reptiliano (Registro $\to$ 1ª orden) |
| **4. Dropy Academy (7 días)** | E-commerce | A. Iniciando | 1. Educación (Ventas) | Límbico (Hábito de venta) |
| **5. Experimento Pide tu Muestra**| Logística | A. Iniciando | 4. Logística (Orden manual) | Reptiliano (Seguridad operativa) |
| **6. Proyecto Help Center (SAC)** | Logística / Finanzas| A. Iniciando / B. Consolidando | 5. Posventa (Autogestión) | Reptiliano (Reducción tickets) |
| **7. Refactor Dropify (CMS 2.0)**| Tecnología | B. Consolidando | 4. Logística / 3. Mercadeo | Límbico (Automatización/Hábito) |
| **8. Bugs Tienda Nube** | Logística | B. Consolidando | 4. Logística (Stock/Webhook) | Reptiliano (Corrección fallas) |
| **9. Loop Hábito / Churn** | E-commerce | B. Consolidando | 6. Fidelización (CRM/Recompra) | Límbico (Retención 30d) |

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

