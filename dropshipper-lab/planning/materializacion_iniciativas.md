# 📐 MATERIALIZACIÓN CONDUCTUAL DE INICIATIVAS — CÉLULA DARWIN

Este documento traduce los objetivos subjetivos y las intenciones del portafolio de la célula Darwin / Seller Success en especificaciones conductuales rigurosas, delimitando fases de ciclo, diagnósticos conductuales, supuestos, bloqueantes y planes de validación.

---

## 1. Bugs Tienda Nube (STID-6598)

*   **Fase de Ciclo:** **Make** (Specs y alcance definidos, en espera de desarrollo).
*   **Comportamiento Específico:** Un dropshipper con checkout en Tienda Nube completa el proceso de sincronización y despacho de una orden COD sin errores en variables (talla/color), fletes o datos de dirección (Barrio/Piso).
*   **Business Outcome (Lagging):** Reducir la tasa de devoluciones y órdenes canceladas en la integración de Tienda Nube.
*   **Product Outcome (Leading):** % de órdenes sincronizadas exitosamente al backend de Dropi sin campos erróneos o faltantes.
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]` (requiere normalización de logs de webhooks).
    *   *Meta:* $\ge 98\%$ de éxito en sincronización de primer intento.
*   **Diagnóstico B=MAP & Sesgo:** Foco puro en **Ability (A)** técnica. El usuario quiere vender pero el canal de sincronización falla silenciosamente.
*   **Supuesto más Riesgoso:** Las APIs de Tienda Nube no envían datos estructurados de campos específicos colombianos (ej. barrio, piso) de forma homologable con las paqueteras asociadas a Dropi.
*   **Test de Validación más Barato:** Prueba de Order Bump en el portal de partners de Tienda Nube con 5 comercios seleccionados para validar la discrepancia física del cobro de flete antes de cambiar código core.
*   **Bloqueante Actual & Siguiente Paso:** Falta de asignación de recurso dev. *Acción:* Reunión de sincronización con Jose Giraldo (Tech Lead) hoy para asignar el ticket.

---

## 2. Page Pilot — Activación de Huérfanos (PROD-1663)

*   **Fase de Ciclo:** **Explore** (Prototipo construido, experimento en preparación).
*   **Comportamiento Específico:** Un dropshipper inactivo o huérfano publica su primera landing page utilizando el creador de páginas de Dropi, vincula su DropiCard y genera su primera orden con ganancia positiva ($Pv - Pp - F - D > 0$) en $\le 14$ días desde su registro.
*   **Business Outcome (Lagging):** Incrementar la tasa de Activación Neta de la cohorte de registrados inactivos.
*   **Product Outcome (Leading):** % de usuarios en el piloto que publican con éxito una landing page y fondean su publicidad mediante la DropiCard.
*   **Baseline & Meta:**
    *   *Baseline:* 0% de activación en la cohorte seleccionada.
    *   *Meta:* $\ge 25\%$ de activación en la ventana de 14 días.
*   **Diagnóstico B=MAP & Sesgo:** **Ability (A)** cognitiva baja. El usuario sufre de *Choice Overload* y parálisis por incertidumbre al tener que redactar copies, crear fletes y fondear pasarelas de pago de forma aislada.
*   **Supuesto más Riesgoso:** El dropshipper huérfano no publica no por falta de herramienta, sino porque carece de capital (fondear anuncios) o conocimiento básico de pauta para arrancar de forma autónoma.
*   **Test de Validación más Barato:** Lanzamiento de un workshop práctico de 1 día (metodología TARS) con los 100 usuarios seleccionados para asistirlos manualmente y medir la tasa de publicación real del embudo.
*   **Bloqueante Actual & Siguiente Paso:** Falta DropiCard virtual definitiva (`PROD-1515`) y bloqueo de QA (`PROD-1376`). *Acción:* Monitorear respuesta de Tesorería al correo de solicitud y resolver tickets de QA en Figma.

---

## 3. Módulo de Notificaciones (PROD-1664)

*   **Fase de Ciclo:** **Explore** (Prototipo finalizado).
*   **Comportamiento Específico:** Un dropshipper que tiene una novedad logística abierta en sus despachos responde al prompt in-app o notificación de WhatsApp, autorizando el reintento de entrega en $\le 24$ horas.
*   **Business Outcome (Lagging):** Reducir el porcentaje total de devoluciones de la plataforma.
*   **Product Outcome (Leading):** % de novedades logísticas gestionadas con éxito por el seller en menos de 24 horas del reporte.
*   **Prototipo Interactivo (WhatsApp QuickActions):** [/prototipos/wa-dropi-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/wa-dropi-poc.html).
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]` (las novedades no se miden por tiempo de respuesta in-app).
    *   *Meta:* $\ge 60\%$ de novedades resueltas por autogestión en la primera ventana de 24h.
*   **Diagnóstico B=MAP & Sesgo:** Falta de **Prompt (P)** efectivo. El usuario sufre de *Inattention bias* / saliencia baja: los prompts actuales se pierden en el dashboard o se envían de forma duplicada/molesta, rompiendo la atención.
*   **Supuesto más Riesgoso:** El dropshipper ignorará los prompts automáticos si no van acompañados de una sugerencia de acción clara y un clic de resolución directa.
*   **Test de Validación más Barato:** Envío manual y selectivo del prompt de novedad vía WhatsApp Business por parte del Account Manager a 15 sellers activos, midiendo la tasa de confirmación y el tiempo de respuesta.
*   **Bloqueante Actual & Siguiente Paso:** Ninguno. *Acción:* Presentar el prototipo de WhatsApp a María Ossa y al equipo técnico de notificaciones para planificar la API de mensajería interactiva.

---

## 4. Refactor Dropify (PROD-1667)

*   **Fase de Ciclo:** **Make** (Desarrollo activo de paridad).
*   **Comportamiento Específico:** Un dropshipper con tienda en Shopify instala la nueva versión del plugin y sincroniza sus productos y órdenes de forma exitosa sin interrumpir el flujo operativo de su checkout.
*   **Business Outcome (Lagging):** Reducción a 0 de los tickets de soporte técnico asociados a errores de sincronización de la integración de Shopify.
*   **Product Outcome (Leading):** % de consistencia en sincronización de tokens, inventarios y webhooks en la nueva arquitectura.
*   **Baseline & Meta:**
    *   *Baseline:* N/A (sistema legacy activo).
    *   *Meta:* $99.9\%$ de confiabilidad técnica (Reliability) en el pipeline de sincronización de órdenes.
*   **Diagnóstico B=MAP & Sesgo:** **Status Quo Bias:** El usuario teme migrar a la nueva versión porque "el sistema viejo ya funciona" y teme romper su checkout activo.
*   **Supuesto más Riesgoso:** La nueva arquitectura "Built for Shopify" no causará discrepancias de sincronización en tiendas con alta carga transaccional (100+ órdenes/día).
*   **Test de Validación más Barato:** Pruebas aisladas PT2 de QA (`PROD-580`) con una muestra controlada de 5 tiendas sandbox en desarrollo antes de forzar la migración masiva.
*   **Bloqueante Actual & Siguiente Paso:** QA bloqueado en pruebas PT2 (`PROD-580`). *Acción:* Presionar a Diego Pérez y QA para cerrar testeo de sincronización de tokens y órdenes.

---

## 5. Gestión de Órdenes del Seller (PROD-1729)

*   **Fase de Ciclo:** **Wonder** (Backlog e investigación).
*   **Comportamiento Específico:** Un dropshipper de alto volumen carga un archivo de Excel para órdenes compuestas sin errores de formato, o consulta la Torre Logística en busca de evidencias físicas de entrega (foto/firma) en lugar de contactar a soporte.
*   **Business Outcome (Lagging):** Reducción de costos de servicio y soporte comercial (SAC) de nivel 1.
*   **Product Outcome (Leading):** % de cargas masivas de órdenes completadas exitosamente en el primer intento y autogestión de evidencias logísticas.
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]` (Jira no cruza tickets de soporte con volumen de carga de Excel).
    *   *Meta:* $\ge 95\%$ de cargas masivas exitosas sin ticket de soporte asociado.
*   **Diagnóstico B=MAP & Sesgo:** Foco en **Ability (A)**. La estructura de la plantilla de carga actual es compleja e induce al error humano al registrar múltiples variantes.
*   **Supuesto más Riesgoso:** Los dropshippers de alto volumen adoptarán el Excel masivo compuesto en lugar de seguir fragmentando pedidos en cargas manuales de una sola pieza.
*   **Test de Validación más Barato:** Prototipo de Excel interactivo con validadores de macros internos probado con 3 dropshippers del Pareto para medir la tasa de errores de llenado.
*   **Bloqueante Actual & Siguiente Paso:** Prioridad Medium en backlog. *Acción:* Alejandra Melo inicia la conceptualización del Excel masivo y Torre Logística.

---

## 6. Experimento de Activación Neta / TTV (PROD-1478)

*   **Fase de Ciclo:** **Explore** (Diseño de experimento cerrado).
*   **Comportamiento Específico:** Un seller nuevo que acaba de crear su primera orden (activación bruta) realiza el seguimiento y las acciones necesarias para asegurar que la transportadora entregue físicamente esa orden (activación neta) con éxito.
*   **Business Outcome (Lagging):** Incrementar la retención y supervivencia de sellers a los 30 días del registro.
*   **Product Outcome (Leading):** Mediana de días transcurridos desde el registro hasta la primera orden entregada con éxito (Time-to-Value Neto).
*   **Baseline & Meta:**
    *   *Baseline:* **16.0 días** de TTV Neto.
    *   *Meta:* **< 12.0 días** de TTV Neto.
*   **Diagnóstico B=MAP & Sesgo:** **Ambiguity Effect:** El seller nuevo se enfría tras crear la orden porque el tramo logístico de entrega es una "caja negra" donde asume que no tiene control operativo.
*   **Supuesto más Riesgoso:** Guiar al seller paso a paso por WhatsApp/In-app en el tramo logística reduce la tasa de cancelación prematura de órdenes COD.
*   **Test de Validación más Barato:** Canalización de alertas y soporte guiado manual en 3 pasos clave por WhatsApp para la cohorte piloto de agosto, comparada contra un grupo de control sin alertas.
*   **Bloqueante Actual & Siguiente Paso:** Desajuste de IDs de UserPilot en backend. *Acción:* Jose Giraldo debe resolver desajuste; de lo contrario, exportar CSV de Supabase manualmente para arrancar el piloto en agosto.

---

## 7. Biblia de AI / Proyecto Help Center (SAC)

*   **Fase de Ciclo:** **Wonder** (Investigación inicial).
*   **Comportamiento Específico:** Un dropshipper con dudas sobre tarifas de flete o facturación in-app escribe su duda en el buscador del widget flotante de la página de inicio y resuelve su consulta leyendo el artículo sugerido, sin abrir un ticket de soporte de nivel 1.
*   **Business Outcome (Lagging):** Reducción del volumen de tickets mensuales de soporte técnico y comercial.
*   **Product Outcome (Leading):** % de búsquedas en el buscador autogestionado con resolución exitosa (sin tickets generados en las siguientes 24 horas).
*   **Baseline & Meta:**
    *   *Baseline:* 0% de autogestión (el usuario es redirigido directamente al chat).
    *   *Meta:* $\ge 40\%$ de auto-resolución en consultas recurrentes.
*   **Diagnóstico B=MAP & Sesgo:** **Friction:** Chatear con un humano requiere menor esfuerzo cognitivo inmediato que buscar y leer un tutorial.
*   **Supuesto más Riesgoso:** Los dropshippers usarán un buscador in-app de texto si la respuesta es predictiva y resguarda el contexto de su wallet.
*   **Test de Validación más Barato:** Fake Door en el dashboard (buscador destacado con aviso de IA auto-asistida) para medir el CTR y volumen de consultas reales antes de conectar APIs conversacionales complejas.
*   **Bloqueante Actual & Siguiente Paso:** Definición inicial de APIs del buscador. *Acción:* Alinear con José Pineda flujos de indexación de FAQ y widget flotante.

---

## 8. Huella Digital 3.0 (PROD-1546)

*   **Fase de Ciclo:** **Explore** (Diseño de especificación y flujo).
*   **Comportamiento Específico:** Un seller registrado completa el nombre de su tienda y vincula sus datos bancarios para retiros (wallet) en la primera sesión de onboarding in-app.
*   **Business Outcome (Lagging):** Tasa de conversión agregada de registro a primera orden entregada.
*   **Product Outcome (Leading):** % de usuarios registrados que finalizan el flujo de configuración de checkout y datos de cobro.
*   **Baseline & Meta:**
    *   *Baseline:* **11.9%** de usuarios ingresan nombre de tienda y **0%** de datos bancarios trackeados.
    *   *Meta:* $\ge 40\%$ en nombre de tienda y $\ge 25\%$ en configuración de wallet.
*   **Diagnóstico B=MAP & Sesgo:** **Choice Overload:** Solicitar prematuramente la configuración de wallet y logo sin haber demostrado valor de venta genera fricción de seguridad y abandono masivo.
*   **Supuesto más Riesgoso:** Simplificar y postergar los pasos de flete y banco hasta después de la primera orden creada incrementa la tasa de registro exitoso en un 20%.
*   **Test de Validación más Barato:** Test de guerrilla moderado con un prototipo de Figma interactivo con 5 comercios para identificar el punto exacto de abandono del flujo visual.
*   **Bloqueante Actual & Siguiente Paso:** Cierre de DoD de diseño. *Acción:* Alejandra Melo inicia co-diseño de interfaces simplificadas del Onboarding en Figma.

---

## 9. Capa 1.5 - Hábito Post-Venta (PROD-1665)

*   **Fase de Ciclo:** **Wonder** (Estructuración de eventos).
*   **Comportamiento Específico:** Un dropshipper que acaba de entregar su primera orden realiza una actualización de su catálogo (`product_update`) o una consulta de inventario (`stock_check`) en las siguientes 48 horas.
*   **Business Outcome (Lagging):** Retención y supervivencia de la cohorte a los 30 días.
*   **Product Outcome (Leading):** % de sellers que ejecutan eventos post-venta clave en $\le 48$h tras su primera orden entregada.
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]` (requiere instrumentación de eventos post-venta).
    *   *Meta:* $\ge 60\%$ de sellers con hábito post-venta activo en la primera semana.
*   **Diagnóstico B=MAP & Sesgo:** **Present Bias:** El seller asume la venta como un evento aislado e ignora la inversión in-app requerida para formar un negocio recurrente.
*   **Supuesto más Riesgoso:** Estimular al seller a auditar stock e inventario en las primeras 48h de su entrega correlaciona con la generación de su segunda orden.
*   **Test de Validación más Barato:** Prompt in-app personalizado en el dashboard de felicitación por primera orden con 3 tareas guiadas para programar su próximo despacho.
*   **Bloqueante Actual & Siguiente Paso:** Falta instrumentación. *Acción:* Definir diccionario de eventos Supabase para que desarrollo los integre en el sprint de instrumentación de Q4.

---

## 10. Diagnóstico de Churn (PROD-1666)

*   **Fase de Ciclo:** **Wonder** (Análisis cuanti de base comercial).
*   **Comportamiento Específico:** Un dropshipper que ha estado inactivo de 5 a 7 días comerciales responde a un estímulo de rescate ingresando a Dropy Academy o solicitando asistencia comercial.
*   **Business Outcome (Lagging):** Reducción de la tasa de abandono mensual (churn).
*   **Product Outcome (Leading):** Tasa de reactivación (sellers inactivos que generan una orden adicional tras la intervención).
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]` (actualmente las comerciales contactan de forma no estructurada).
    *   *Meta:* $\ge 15\%$ de reactivación en la cohorte intervenida.
*   **Diagnóstico B=MAP & Sesgo:** **Loss Aversion:** El dropshipper abandonó la plataforma porque sus primeros despachos generaron pérdidas o novedades complejas (aversión a la pérdida).
*   **Supuesto más Riesgoso:** Existe una ventana óptima de rescate de 5 a 7 días de inactividad antes de que el seller caiga en churn definitivo e irreversible.
*   **Test de Validación más Barato:** Piloto manual de llamadas de rescate por parte de una comercial a 30 usuarios inactivos seleccionados de la base 360, ofreciendo soporte prioritario y diagnóstico de fletes.
*   **Bloqueante Actual & Siguiente Paso:** Segmentación de base de datos activa. *Acción:* Procesar la cohorte Pareto de la base comercial 360 para definir los targets prioritarios.

---

## 11. Enrutamiento Dinámico (Second Best - PROD-SEC-BEST)

*   **Fase de Ciclo:** **Explore** (Diseño de especificaciones de matching).
*   **Comportamiento Específico:** Un dropshipper con órdenes creadas y proveedor principal sin stock o inactivo por 24 horas aprueba el desvío inmediato de esas órdenes a un proveedor de respaldo pre-seleccionado en su catálogo.
*   **Business Outcome (Lagging):** Reducir cancelaciones de órdenes Pareto y retener el GMV de los sellers estrella.
*   **Product Outcome (Leading):** % de órdenes de compra exitosamente re-enrutadas y despachadas por un proveedor de respaldo calificado.
*   **Baseline & Meta:**
    *   *Baseline:* 0% (proceso 100% manual).
    *   *Meta:* $\ge 75\%$ de órdenes re-enrutadas exitosamente ante stockouts.
*   **Diagnóstico B=MAP & Sesgo:** **Loss Aversion** (miedo a perder reputación con el comprador final) vs **Present Bias** (miedo a pagar un sobrecosto menor hoy).
*   **Supuesto más Riesgoso:** Los dropshippers del Pareto están dispuestos a sacrificar hasta un 10% de su margen neto por orden con tal de salvar la entrega a su cliente final.
*   **Test de Validación más Barato:** Test de guerrilla interactivo con Figma con 5 dropshippers del Pareto para medir su aceptación del sobrecosto en el prompt de emergencia.
*   **Bloqueante Actual & Siguiente Paso:** Estructuración de UI. *Acción:* Alejandra Melo inicia el diseño del prompt de emergencia "Un Clic" y la sección de precarga en catálogo.

---

## 12. Dropi Wrapped para Dropshippers (PROD-WRAPPED)

*   **Fase de Ciclo:** **Explore** (POC interactiva en evaluación).
*   **Comportamiento Específico:** Un dropshipper inactivo en la ventana entre campañas visualiza su resumen Wrapped in-app e inicia una búsqueda o importación de producto en $\le 7$ días.
*   **Business Outcome (Lagging):** Reactivación y reactivación inter-campaña de sellers maduros dormidos.
*   **Product Outcome (Leading):** Tasa de retorno de usuarios inactivos (inicio de sesión y acción en catálogo) en los 7 días posteriores a ver su retrospectiva.
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]`.
    *   *Meta:* $\ge 20\%$ de reactivación de los usuarios inactivos intervenidos.
*   **Diagnóstico B=MAP & Sesgo:** **Loss Aversion** (se enfatiza la racha y lo que se pierde si no vende este ciclo) y **Present Bias** (reactivación inmediata por progreso visualizado).
*   **Supuesto más Riesgoso:** Mostrar el Wrapped personalizado es suficiente incentivo motivacional para que un dropshipper dormido reactive su pauta publicitaria.
*   **Test de Validación más Barato:** Envío manual de la retrospectiva Wrapped en formato PDF/Imagen personalizada por WhatsApp a 30 sellers (piloto) y comparar contra 30 de control.
*   **Bloqueante Actual & Siguiente Paso:** Extracción de cohorte en Supabase. *Acción:* Correr las queries de selección (basadas en el plan de concierge) para seleccionar a los 60 comercios de prueba.
