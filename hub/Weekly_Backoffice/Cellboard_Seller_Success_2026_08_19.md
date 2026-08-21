# 📝 Minuta Cellboard — Célula Seller Success (SSC)
**Fecha:** 19 de Agosto, 2026 — 11:01 GMT-05:00
**Presentador principal:** Santiago Herrera (PM)
**Participantes mencionados:** Enrique (Growth/CRM), José (Tech Lead), Aleja (Product Designer), Lady (seguimiento comercial)
**Origen:** Transcripción automática via Whisper del video MP4 (`Cellboard Seller Success - 2026_08_19 11_01 GMT-05_00 - Recording 2.mp4`)
**Duración:** ~34 minutos

---

## 1. Notificaciones Proactivas por WhatsApp y Email (Tema principal)

### Contexto
Santiago presenta la necesidad de empezar a enviar notificaciones proactivas por **WhatsApp** y **Email** para mover activación y retención, sin depender del módulo completo de notificaciones 360° en plataforma (que Aleja está diseñando en paralelo).

### Dos escenarios planteados

| Escenario | Condición | Tipo de notificación | Ejemplo |
|---|---|---|---|
| **A — Transaccional** | Si tecnología entrega API/data de órdenes | Notificaciones con datos específicos del usuario | *"Tienes 10 pedidos pendientes por confirmar"* |
| **B — Call to Action (parche)** | Si no hay acceso a data transaccional | Mensajes generales de valor/recordatorio | *"Recuerda revisar si tienes pedidos por confirmar"*, *"Recuerda comunicar al cliente el tiempo de entrega"* |

### Dos grupos objetivo

1. **Activación:** Dropshippers que necesitan activarse (primera orden / primera orden entregada).
2. **Retención:** Dropshippers activos con caída o anomalías en su volumen de ventas (prevención de churn).

### Trabajo previo de Producto
Santiago menciona que ya existía una tabla de producto con:
- Tipo de notificación
- Evento que la genera
- Métrica que impacta
- Acción esperada
- Copies asociados

Aleja ya estaba trabajando los copies segmentados por **activación** y **retención**.

---

## 2. Integración con CRM de Growth (Intervención de Enrique)

### Hallazgo clave
Enrique informa que el equipo de Growth **ya tiene una conexión funcional** con la data de órdenes por dropshipper:

- Ya pueden consultar **estado actual de órdenes** de cada usuario sin depender de desarrollo.
- Están haciendo esto para **líderes de comunidad** — extrayendo data de dropshippers asociados a cada comunidad.
- Tienen un **onboarding guiado** activo en Argentina para registros orgánicos.
- El CRM ya puede enviar **WhatsApp y correos** con los dominios de Dropi.

### Propuesta de Enrique
Conectar la data que ya extraen de Cronos para hacer automatizaciones y flujos de trabajo sobre:
- Adquisición
- Onboarding
- Activación
- Mantenimiento de la activación

**Ya saben:** quién se registra orgánicamente, quiénes hicieron su primera venta, cuántas se entregaron, cuántas no.

### Dato relevante: Argentina
- ~260,000 – 270,000 registros desde que abrió Argentina (hace ~3-4 meses).
- Se propone como país piloto para experimentación por ser grande en registros pero manejable en complejidad (Colombia es demasiado grande para un primer experimento).

---

## 3. Acuerdos sobre el experimento de notificaciones

### Diseño experimental propuesto por Santiago
- **Grupo de tratamiento:** Dropshippers **huérfanos** (sin comunidad) → reciben notificaciones proactivas.
- **Grupo de control:** Dropshippers **de comunidad** → NO reciben notificaciones.
- **Hipótesis:** Si las notificaciones logran reducir la brecha de activación entre huérfanos y comunidad, se valida el impacto.

### Diferenciación por tipo de dropshipper
- No es conveniente notificar 1-a-1 sobre confirmaciones a dropshippers con operación de cientos de órdenes/día.
- Las notificaciones deben segmentarse por volumen de ventas y nivel de madurez.

### Hitos de activación mencionados (Growth/CRM)
- **10 órdenes:** primer hito de adopción.
- **100 órdenes:** hito que muestra permanencia en la plataforma.

### Tipos de notificaciones identificados por Aleja
- Órdenes pendientes por confirmar
- Novedades de entrega
- Casos/productos (SAC)
- Inicio de sesión (ya existe el email)
- Variación de entidad pendiente

### Próximo paso acordado
Santiago agendará un **espacio la semana siguiente** (semana del 25 agosto) con el equipo de Growth para:
- Revisar cómo tienen la data conectada
- Ver cómo extender la extracción de huérfanos (no solo comunidades)
- Definir protocolo de trabajo para avanzar con los experimentos
- Invitar a Ion y al equipo de José para contextualizar la conexión técnica

---

## 4. Módulo de Notificaciones 360° en plataforma (RPP)

- **Aleja** está diseñando esta semana el **panel de control** (centro de activación/desactivación de notificaciones).
- Incluye compliance y privacidad: cada usuario decide por dónde recibe notificaciones.
- Se debe definir qué notificaciones **no se pueden omitir** por temas operativos.
- El módulo incorporará omnicanalidad (WhatsApp, Email y otros canales).

---

## 5. Fake Door — Catálogo WhatsApp Business

### Contexto
Santiago presenta el concepto de vincular productos de Dropi al **catálogo de WhatsApp Business** con un solo clic, para dropshippers que venden exclusivamente por WhatsApp (sin Shopify/Woo/página web).

### Estrategia de validación
- **No se va a construir la funcionalidad completa** todavía.
- Se montará un **fake door** en User Pilot: un botón "Agregar a catálogo de WhatsApp".
- Si el usuario hace clic, se le presenta una **lista de espera** (prioridad para beta) + **2 preguntas** sobre:
  - Uso de WhatsApp para vender
  - Volúmenes de venta
  - Productos que más vende

### Gobernanza con Chatea Pro
- La funcionalidad **no debe invadir** el territorio de Chatea Pro (integración de mensajería/cierre de venta).
- Está pensado para negocios que solo usan **WhatsApp Business app** (no API masiva).
- Se busca explotar capacidades gratuitas que no afecten el revenue de Chatea Pro.
- Pendiente reunión con Chatea Pro para alinear límites.

### Conexión con Argentina (Enrique)
- El onboarding de Argentina incluye una clase de **vender de forma orgánica por WhatsApp** (estados, catálogos).
- El catálogo WhatsApp encaja directamente con ese flujo.

### Capacidades futuras exploradas (no para ahora)
- Quick replies / atajos de respuesta rápida con info del producto
- Compartir imagen + descripción + link para iniciar chat
- Estructura de venta del producto (nombre, garantías, todo pre-cargado)

### Dato pendiente
**Nadie en la sesión tenía a la mano** la cifra de cuántos dropshippers usan WhatsApp como herramienta principal de venta. Se exploraría vía los que instalan el "agente de ventas por WhatsApp" en Chatea Pro como proxy.

---

## 6. Solicitar Muestra — Discovery sobre motivaciones

### Problema
No hay respaldo claro de que el problema de "Solicitar Muestra" sea que tiene muchos pasos — **no son demasiados**. El motivo real por el que no se utiliza más es **desconocido**.

### Hipótesis de uso identificadas

| Hipótesis | Descripción |
|---|---|
| **Uso personal** | Compra más barata que en otras páginas (tipo Mercado Libre) |
| **Testeo de transportadoras** | Pedir mismo producto por 3 transportadoras diferentes para comparar tiempos |
| **Garantía de producto** | Verificar calidad/defectos antes de vender (ej. exprimidor con fallas) |
| **Tiempos de entrega** | Validar cuánto tarda la entrega real |

### Segmentos para la investigación

Santiago plantea montar un flujo de identificación cruzando:
1. **Pidieron muestras + no vendieron nada** → Hipótesis: uso personal / "Mercado Libre barato".
2. **Pidieron muestras + venden bastante + piden muchas muestras** → Uso operativo activo.
3. **Pidieron muestras + venden poco + no vendieron ese producto** → Testeo/exploración.

### Oportunidad de producto
Si las muestras se piden para testear transportadoras, se podría agregar:
- Más detalle/información sobre tiempos de entrega en la misma orden
- Un score o ficha propia para anotar puntuaciones sobre transportadoras y productos

### Acción esta semana
Montar el flujo de investigación vía User Pilot para los segmentos identificados. Aleja estaba diseñando las preguntas.

---

## 7. Cierre

Santiago cierra agradeciendo al equipo y confirmando que agendará el espacio con Growth para la integración de notificaciones la semana siguiente.

> *"Espero que las cosas sigan mejorando. Ya les voy a visitar el espacio con el equipo de Growth para ver todo el tema de la integración que podemos hacer para notificaciones."*

---

## Acciones y Compromisos

| Quién | Acción | Plazo |
|---|---|---|
| **Santiago** | Agendar espacio con Growth (Enrique, José, Ion) para integración CRM + notificaciones | Semana del 25 agosto |
| **Aleja** | Diseñar panel de control de notificaciones 360° (RPP) | Esta semana (19-23 ago) |
| **Aleja** | Diseñar flujo fake door catálogo WhatsApp para Product Ops | Esta semana (19-23 ago) |
| **Aleja** | Diseñar flujo User Pilot de investigación "Solicitar Muestra" | Esta semana (19-23 ago) |
| **Santiago** | Buscar espacio con Chatea Pro para alinear gobernanza WhatsApp | Pendiente |
| **Enrique/José** | Preparar demo de extracción de data de órdenes por dropshipper | Para la reunión de la semana siguiente |
| **Santiago** | Mostrar herramientas internas Darwin + webhooks + prototipos al equipo de Growth | Para la reunión de la semana siguiente |

---

**Nota:** Documento generado automáticamente por Darwin (Agente PM) a partir de transcripción Whisper del archivo MP4 del Cellboard. Las líneas 613-621 del audio contenían ruido repetitivo post-cierre y fueron descartadas.
