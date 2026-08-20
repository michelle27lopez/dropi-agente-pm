# 📝 Minuta Pre-Planning Célula Seller Success (SSC)
**Fecha:** 18 de Agosto, 2026 — 15:00 GMT-05:00  
**Participantes:** Santiago Herrera Acosta (PM) & Alejandra (Aleja) Melo (UX/UI Lead)  
**Frecuencia:** Semanal (Fijado todos los martes)  

---

## 1. 🤝 Contexto de Equipo & Contingencia Regional (Terremoto Cali/Valle)
- **Afectación Operativa:** Tras el fuerte sismo en Cali y el Valle del Cauca, el equipo dedicó esfuerzo y logística en apoyo humanitario (donaciones a la escuela del deporte, donación de sangre e insumos a través de Dropi). La carga de trabajo pendiente del sprint anterior se consolidó en la planificación de esta semana.
- **Estado del Equipo:** Santiago y Aleja confirman que sus familias se encuentran a salvo y las actividades se reanudan con normalidad operativa.

---

## 2. 🚀 Definiciones Estratégicas y de Producto

### A. Catálogo WhatsApp (Integración Meta API & Vinculación a 1-Clic)
- **Demostración de PoC:** Santiago presentó la prueba de concepto funcional conectada con el API de Meta Commerce Manager.
- **Alcance Actual:** Permite vincular productos de Dropi al catálogo de WhatsApp Business generando un enlace/botón directo que el dropshipper asocia en su cuenta de Meta Business Manager.
- **Acción Pendiente:** Estudiar si se puede implementar Meta Embedded Signup (OAuth 1-clic) una vez se tenga el API habilitado por tecnología/Jaime.
- **Objetivo de Negocio:** Facilitar que dropshippers novatos que venden por WhatsApp sin tienda web (Shopify/Tienda Nube) puedan mostrar su catálogo sincronizado y cerrar ventas con menor fricción.

### B. Notificaciones Proactivas (WhatsApp & Email) vs. Módulo de Notificaciones 360° RPP
- **Clarificación de Enfoque:** 
  - El **Módulo Canónico de Notificaciones (RPP 360)** incluye la interfaz gráfica de la campanita, contador de no leídas y el centro de control para prender/apagar notificaciones (Handoff UI finalizado por Aleja).
  - Como el desarrollo técnico del módulo 360 tomará tiempo, se lanza en paralelo la iniciativa de **Notificaciones Proactivas (WhatsApp & Email)** para mover los KPIs inmediatos de **Activación** y **Retención**.
- **Canales de Disparo:** Se utilizarán mensajes masivos/tamizados vía WhatsApp e Email (vía GoHighLevel o webhook n8n).
- **Segmentación de Audiencia:**
  - *Sellers en Churn / Caída de Ventas*: Notificaciones orientadas a **Retención** (recordatorios de revisión de novedades, confirmación de pedidos, alerta de productos agotados).
  - *Sellers Novatos / Sin Ventas*: Notificaciones orientadas a **Activación** (recordatorios de actualización de datos bancarios, guía de primera orden, ayuda contextual).
- **Acción Aleja:** Estandarizar el catálogo de mensajes y copys para cada canal.

### C. Experimento "Solicitar Muestra" (Muestras a 1-Clic)
- **Insight de Negocio:** Probar la muestra física del producto es el catalizador #1 para que un dropshipper novato pierda el miedo a la calidad y logre su primera venta entregada.
- **Optimizaciones UX/UI:**
  - Limpiar la arquitectura visual del RPP para que el botón de solicitud de muestra sea altamente prominente e intuitivo.
  - Clasificar el comportamiento del usuario: diferenciar a los dropshippers que solicitan muestras y escalan ventas de aquellos que solicitan muestras sin registrar órdenes.
  - Implementar formulario simplificado desplegable en caliente (<15 segundos sin redirecciones).

---

## 3. 🎯 Decisiones y Acuerdos de Priorización

1. 🔴 **Notificaciones Proactivas (WhatsApp & Email):** Estandarización de mensajes y estructuración de la campaña de activación/retención.
2. 🟡 **Centro de Control de Notificaciones (RPP 360):** Entrega de diseño final de 1 sola vista por Aleja para documentación e integración en Delivery.
3. 🟡 **Fake Door & PoC Catálogo WhatsApp:** Continuar vinculación con Meta API para exportar productos a WhatsApp Business.
4. 🟢 **Solicitud Muestra 1-Clic:** Ajustar arquitectura de botones en RPP y flujo simplificado.

---
**Nota de Gobernanza:** Documento generado automáticamente por Darwin (Agente PM) a partir de la transcripción oficial de Teams/Meet.
