# 📝 Minuta Pre-Planning Célula Seller Success (SSC)
**Fecha:** 6 de Agosto, 2026 — 14:35 GMT-05:00  
**Participantes:** Santiago Herrera Acosta (PM) & Alejandra (Aleja) Melo (UX/UI Lead)  
**Frecuencia:** Semanal (Fijado todos los jueves)  

---

## 1. 🗓️ Dinámica Operativa y Disponibilidad
- **Recurrencia:** La reunión de Pre-Planning SSC se realizará de manera fija todos los jueves.
- **Disponibilidad Aleja (Semana 10-14 Agosto):** Aleja estará ausente solo **1 día en la mañana** (estará disponible por la tarde).
- **Alineación RPP con Michel Pino:** Santiago agendará sesión con Michel para entender el alcance técnico del motor RPP.
- **Procesamiento de Tickets & Épicas:** Santiago usará **Darwin** (Agente PM) para extraer insights y redactar el detalle de cada historia de usuario, y a **Robo** para crear/vincular las épicas en Jira según la taxonomía oficial de Laura Contreras.

---

## 2. 🚀 Proyectos y Definiciones Técnicas/UX

### A. Catálogo WhatsApp (Experimento Fake Door)
- **Demo Presentada por Santiago:** Flujo de exportación de catálogo a Meta Commerce Manager para sincronizar productos (título, precio sugerido, imágenes, variantes) a WhatsApp Business.
- **Evolución Futura:** OAuth (Embedded Login de Meta) a 1-clic sin copiar URLs (requiere App Review corporativo).
- **Experimento Próximo Sprint (Fake Door):**
  - **Botonería:** *"Agregar a mi catálogo WhatsApp"* / *"Exportar catálogo WhatsApp"*.
  - **Modal:** Campaña de expectativa + Waitlist + Encuesta de volumen de órdenes por WhatsApp.
  - **Target:** Exclusivo para usuarios sin integraciones activas (sin Shopify ni Tienda Nube).
  - **Estimación UX (Aleja):** 4 horas.

### B. Módulo de Notificaciones RPP & UserPilot
- **Diseño RPP (Nueva Arquitectura):** Finalizado esta semana por Aleja para Jaime y Mitch.
- **Handoff & Evento Bogotá (12-13 Sept):** Para el evento de Bogotá NO se llegará con la nueva arquitectura en producción. El diseño se parqueará en handoff.
- **Centro de Control (UX RPP):** Aleja diseñará la pantalla de personalización de notificaciones (prender/apagar, toasts, campanita desplegable). (**4 horas**).
- **Experimento Notificaciones Proactivas (UserPilot):**
  - Notificaciones generales sin eventos de dev: *"Recuerda revisar tu módulo de novedades"*, *"Recuerda confirmar pedidos pendientes"*, *"Revisa transportadoras en Torre de Control"*.
  - Target: Sellers sin órdenes o con ventas diarias cayendo.
  - **Estimación UX (Aleja):** 4 horas.

### C. Ayuda Contextual (Ticket Laura Torres)
- **Nombre Oficial:** *"Ayuda Contextual"* (se descarta Asistente para evitar confusión con Gali).
- **Acción:** Ticket a Laura Torres para integración en UserPilot. (**15 minutos**).

### D. Solicitud de Muestra Un Click (Pide tu Muestra)
- **Insight de Negocio & Data Supabase (Impulsado por María):**
  - Miedo a la calidad del producto es la barrera #1 de activación en novatos.
  - El seller que prueba físicamente el producto **aumenta la conversión a 1ª orden entregada en un +25%**.
  - Reducir tiempo de pedido de 3 minutos a **<15 segundos** (formulario desplegable en caliente en ficha de producto, sin botón guardar).
- **Acción Aleja (Research / Tour UserPilot):** Tour guiado + Encuesta de propósito del pedido. (**1 día / 8 horas**).

### E. Tienda Nube Dropify V2 (Drop 2.0)
- **Pendientes de Confirmación Técnica con Diego Pérez:**
  1. Viabilidad técnica del menú navegación según propuesta UX.
  2. Importación/subida de imágenes (múltiples vs. una sola).
- **Acción Aleja:** Ajustes finales post-feedback de Diego. (**4 horas**).

---

## 3. 🎯 Priorización Definitiva del Backlog de Aleja (Sprint Next)

1. 🔴 **[HIGH] Experimento Notificaciones UserPilot:** Flujo notificaciones activación/retención (**4h**).
2. 🔴 **[HIGH] Ayuda Contextual:** Ticket a Laura Torres / UserPilot (**15 min**).
3. 🟡 **[MED-HIGH] Fake Door Catálogo WhatsApp:** Diseño modal + encuesta/waitlist (**4h**).
4. 🟡 **[MEDIUM] Notificaciones RPP - Centro de Control:** Diseño UX personalización (**4h**).
5. 🟡 **[MEDIUM] Solicitud de Muestra Un Click:** Research + Tour guiado + encuesta (**8h / 1d**).
6. 🟢 **[LOW] Tienda Nube Dropify 2.0:** Ajustes post-feedback Diego en menú e imágenes (**4h**).
7. ⚪ **[PARKED] Dropify Integraciones:** En espera de dependencias externas.

---
**Capacidad Total Mapeada Aleja:** 10h reuniones + 3d 4h diseño/research.
