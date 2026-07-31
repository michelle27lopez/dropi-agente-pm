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

*   **Fase de Ciclo:** **Explore** (Prototipo construido, experimento en preparación. Lanzamiento V1 aprobado).
*   **Comportamiento Específico:** Un dropshipper inactivo o huérfano publica su primera landing page utilizando el creador de páginas de Dropi, vincula su DropiCard y genera su primera orden con ganancia positiva ($Pv - Pp - F - D > 0$) en $\le 14$ días desde su registro.
*   **Integración de IA (Fluxxi):** Se evalúa utilizar **Fluxxi** (IA propia) para la generación de copys/creativos, pero el CEO advirtió que puede no ser fácil de integrar de forma nativa debido a que requeriría redireccionar a los usuarios externos (lo cual no es la idea). Se mantendrán conversaciones con el equipo de Marketing para evaluar alternativas o si se puede integrar internamente.
*   **Business Outcome (Lagging):** Incrementar la tasa de Activación Neta de la cohorte de registrados inactivos.
*   **Product Outcome (Leading):** % de usuarios en el piloto que publican con éxito una landing page y fondean su publicidad mediante la DropiCard.
*   **Baseline & Meta:**
    *   *Baseline:* 0% de activación en la cohorte seleccionada.
    *   *Meta:* $\ge 25\%$ de activación en la ventana de 14 días.
*   **Diagnóstico B=MAP & Sesgo:** **Ability (A)** cognitiva baja. El usuario sufre de *Choice Overload* y parálisis por incertidumbre al tener que redactar copies, crear fletes y fondear pasarelas de pago de forma aislada.
*   **Supuesto más Riesgoso:** El dropshipper huérfano no publica no por falta de herramienta, sino porque carece de capital (fondear anuncios) o conocimiento básico de pauta para arrancar de forma autónoma.
*   **Test de Validación más Barato:** Lanzamiento de un workshop práctico de 1 día (metodología TARS) con los 120 usuarios seleccionados para asistirlos manualmente y medir la tasa de publicación real del embudo.
*   **Bloqueante Actual & Siguiente Paso:** Ninguno. A pesar del bug de generación de landings, se decidió avanzar con el piloto a los 120 usuarios dado que el reembolso es automático. *Próximo Paso:* Habilitar flag de Fluxxi en producción, investigar el alcance de *iconMagic* y realizar handoff/alineación con Marketing. *Acción:* Habilitar flag en producción para los 120 usuarios.

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
*   **Insumo de SAC (Notificaciones):** Las notificaciones push y por WhatsApp de este módulo utilizarán el informe operacional de SAC (`ml_ia.patrones`) para diseñar alertas proactivas en tiempo real ante eventos críticos de fricción (ej. alerta automática de "recarga reflejada", "retiro aprobado y transferido", u orden retenida en estado "generado" sin despacho).
*   **Test de Validación más Barato:** Envío manual y selectivo del prompt de novedad vía WhatsApp Business por parte del Account Manager a 15 sellers activos, midiendo la tasa de confirmación y el tiempo de respuesta.
*   **Bloqueante Actual & Siguiente Paso:** Ninguno. *Acción:* Presentar el prototipo de WhatsApp a María Ossa y al equipo técnico de notificaciones para planificar la API de mensajería interactiva.

---

## 4. Refactor Dropify (PROD-1667)

*   **Fase de Ciclo:** **Make** (Desarrollo activo de paridad).
*   **Comportamiento Específico:** Un dropshipper con tienda en Shopify instala la nueva versión del plugin y sincroniza sus productos y órdenes de forma exitosa sin interrumpir el flujo operativo de su checkout.
*   **Optimizaciones Clave:** 
    *   Sincronización simple y fluida de productos ya creados en Shopify hacia Dropi.
    *   Optimización de la página de descripción del plugin en la Shopify App Store con el equipo de Growth.
    *   Benchmark de nombres comerciales para realizar un **rebranding de la marca Dropify**.
*   **Business Outcome (Lagging):** Reducción a 0 de los tickets de soporte técnico asociados a errores de sincronización de la integración de Shopify.
*   **Product Outcome (Leading):** % de consistencia en sincronización de tokens, inventarios y webhooks en la nueva arquitectura.
*   **Baseline & Meta:**
    *   *Baseline:* N/A (sistema legacy activo).
    *   *Meta:* $99.9\%$ de confiabilidad técnica (Reliability) en el pipeline de sincronización de órdenes.
*   **Diagnóstico B=MAP & Sesgo:** **Status Quo Bias:** El usuario teme migrar a la nueva versión porque "el sistema viejo ya funciona" y teme romper su checkout activo.
*   **Supuesto más Riesgoso:** La nueva arquitectura "Built for Shopify" no causará discrepancias de sincronización en tiendas con alta carga transaccional (100+ órdenes/día).
*   **Test de Validación más Barato:** Pruebas aisladas PT2 de QA (`PROD-580`) con una muestra controlada de 5 tiendas sandbox en desarrollo antes de forzar la migración masiva.
*   **Bloqueante Actual & Siguiente Paso:** QA bloqueado en pruebas PT2 (`PROD-580`). *Acción:* Presionar a Diego Pérez y QA para cerrar testeo de sincronización de tokens y órdenes. Ejecutar benchmark de nombres y alineación de landing con Growth.

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

*   **Fase de Ciclo:** **Wonder** (En Discovery inicial, validación de hipótesis).
*   **Comportamiento Específico:** Un dropshipper con órdenes creadas y proveedor principal sin stock o inactivo por 24 horas aprueba el desvío inmediato de esas órdenes a un proveedor de respaldo pre-seleccionado en su catálogo.
*   **Alineación Lógica:** Conectar e integrar este flujo y lógica con la **idea previa de órdenes automatizadas** para reutilizar las capacidades de desvío automático del motor de base de datos.
*   **Business Outcome (Lagging):** Reducir cancelaciones de órdenes Pareto y retener el GMV de los sellers estrella.
*   **Product Outcome (Leading):** % de órdenes de compra exitosamente re-enrutadas y despachadas por un proveedor de respaldo calificado.
*   **Prototipo Interactivo (Emergency & Setup):** [/prototipos/second-best-poc.html](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/hub/public/prototipos/second-best-poc.html).
*   **Baseline & Meta:**
    *   *Baseline:* 0% (proceso 100% manual).
    *   *Meta:* $\ge 75\%$ de órdenes re-enrutadas exitosamente ante stockouts.
*   **Diagnóstico B=MAP & Sesgo:** **Loss Aversion** (miedo a perder reputación con el comprador final) vs **Present Bias** (miedo a pagar un sobrecosto menor hoy).
*   **Supuesto más Riesgoso:** Los dropshippers del Pareto están dispuestos a sacrificar hasta un 10% de su margen neto por orden con tal de salvar la entrega a su cliente final.
*   **Test de Validación más Barato:** Test de guerrilla interactivo utilizando el prototipo mock con 5 dropshippers del Pareto para medir su aceptación del sobrecosto en el prompt de emergencia.
*   **Bloqueante Actual & Siguiente Paso:** Concepto en validación. *Acción:* Alejandra Melo (PD) utilizará el prototipo mock interactivo para hacer pruebas rápidas de guerrilla y validar los supuestos conductuales y de UI con los 5 dropshippers del Pareto antes de formalizar especificaciones.

---

## 12. Dropi Wrapped para Dropshippers (PROD-WRAPPED)

*   **Fase de Ciclo:** **Wonder** (En Discovery inicial, conceptualización. Unificado con Leyendas).
*   **Comportamiento Específico:** Un dropshipper inactivo en la ventana entre campañas visualiza su resumen Wrapped in-app e inicia una búsqueda o importación de producto en $\le 7$ días.
*   **Unificación Leyendas:** Las métricas, niveles, rachas de permanencia y beneficios mostrados en la retrospectiva Wrapped se alinean 1:1 con el programa oficial de **Leyendas Dropi** (Bienvenido, Explorador, Master, Experto, Sabio VIP, Leyenda) para actuar como disparador del Goal-Gradient Effect.
*   **Business Outcome (Lagging):** Reactivación y reactivación inter-campaña de sellers maduros dormidos.
*   **Product Outcome (Leading):** Tasa de retorno de usuarios inactivos (inicio de sesión y acción en catálogo) en los 7 días posteriores a ver su retrospectiva.
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]`.
    *   *Meta:* $\ge 20\%$ de reactivación de los usuarios inactivos intervenidos.
*   **Diagnóstico B=MAP & Sesgo:** **Loss Aversion** (se enfatiza la racha y lo que se pierde si no vende este ciclo) y **Present Bias** (reactivación inmediata por progreso visualizado).
*   **Supuesto más Riesgoso:** Mostrar el Wrapped personalizado es suficiente incentivo motivacional para que un dropshipper dormido reactive su pauta publicitaria.
*   **Test de Validación más Barato:** Pruebas de usabilidad y diseño del concepto con Alejandra Melo (PD) antes de planear el piloto concierge.
*   **Bloqueante Actual & Siguiente Paso:** Ninguno (en fase conceptual). *Acción:* Alejandra Melo diseñará el concepto UX/UI en Discovery y definirá la propuesta de valor conductual unificada con Leyendas.

---

## 13. Simplificación de Muestras & Rediseño de Botones (PROD-MUESTRA-SIMP)

*   **Fase de Ciclo:** **Explore** (Diseño visual y de interacción).
*   **Comportamiento Específico:** Un dropshipper solicita una muestra a su casa en 1-Clic aprovechando los datos auto-guardados y seleccionando manualmente su transportadora en la ficha de producto simplificada.
*   **Restricciones de Diseño UX/UI (Alejandra Melo):**
    *   **No Drawer, No Modal Nuevo:** La información ya completada se muestra directamente en el formulario nativo, reduciendo y quitando campos innecesarios.
    *   **Sin Botón Guardar:** El guardado y autodiligenciado de la dirección es automático desde el registro o envío anterior, editable en caliente siempre.
    *   **Insight de Transportadora:** Los dropshippers experimentan intencionalmente pidiendo muestras con diferentes transportadoras para medir tiempos de entrega reales. Por ende, **se rechaza la automatización/optimización total del flete**; se mantendrá la opción de elegir (o un set optimizado tipo drop de pre-selección sin ocultar alternativas).
*   **Bloqueo Histórico de Botones de Detalle:**
    *   > [!WARNING]
    *   > **Freno Organizacional:** La modificación de botones en el detalle de producto ha sido revertida o bloqueada sistemáticamente en el pasado. Se requiere **consultar a Kevin** sobre limitaciones técnicas, de dueño o de negocio de esta pantalla antes de iniciar propuestas de diseño.
*   **Business Outcome (Lagging):** Aumento de la tasa de activación neta (Time-to-Value) del dropshipper.
*   **Product Outcome (Leading):** Conversión del paso "Importar Producto" a "Solicitar Muestra".
*   **Baseline & Meta:**
    *   *Baseline:* `[DATO FALTANTE]` (los clics en muestra no están separados por re-digitación).
    *   *Meta:* Incremento del $15\%$ en pedidos de muestras en el primer mes de despliegue.
*   **Diagnóstico B=MAP & Sesgo:** **Ability (A) cognitiva**. La fricción de re-rellenar datos y el *Choice Overload* de botones aglomerados frenan la toma de decisión del seller nuevo.
*   **Supuesto más Riesgoso:** Los dropshippers prefieren seleccionar su transportadora (para medir tiempos de despacho) que confiar en un algoritmo de selección automática.
*   **Test de Validación más Barato:** Test A/B in-app (UserPilot / split de tráfico) comparando el formulario auto-diligenciado contra el tradicional.
*   **Tracking / Eventos a Instrumentar:**
    *   `click_sample_request_start`
    *   `sample_form_autofill_success`
    *   `sample_carrier_override_select`
    *   `click_product_details_primary_action`

---

## 14. RAP / Tarjeta de Activación en Home (PROD-RAP)

*   **Fase de Ciclo:** **Explore** (Planificación de diseño y copies de racha).
*   **Comportamiento Específico:** Un dropshipper ingresa a la Home, visualiza su tarjeta RAP (tasa de entrega y racha actual), y hace clic en el CTA correspondiente para resolver la causa raíz de sus novedades logísticas.
*   **Canal y Formato:** Tarjeta (Card) destacada en el Home (gestionada con Diana/marketing) con componentes de marketing. Debe ser descargable/compartible por el seller.
*   **Lógica de Rachas Conductual:**
    *   *Racha Negativa:* CTA explícito direct-to-novedades (`ver mis novedades` / `revisa tus novedades ahora`) enfocado a resolver causas de fricción operativa.
    *   *Racha Positiva:* Mensaje puramente motivacional e incentivos visuales de estatus.
    *   *Regla de Intervención:* **No sacar al usuario de la plataforma**. Todo se resuelve in-app (incluyendo visualización de tutoriales locales de asistencia sin redireccionar a videos externos).
*   **Business Outcome (Lagging):** Reducción de la tasa de devoluciones y abandono de la plataforma.
*   **Product Outcome (Leading):** % de usuarios en riesgo logístico (racha negativa) que ingresan directamente al módulo de novedades sugerido por el RAP.
*   **Baseline & Meta:**
    *   *Baseline:* 0% (los sellers ingresan a novedades a través de menús profundos).
    *   *Meta:* $\ge 35\%$ de redirecciones exitosas a novedades desde el RAP.
*   **Diagnóstico B=MAP & Sesgo:** **Prompt (P) & Motivación (M)**. Saliencia visual de progreso logístico. Se activa la motivación intrínseca (Mastery) al ver una racha de fletes exitosa y se previene el sesgo de inatención.
*   **Supuesto más Riesgoso:** El dropshipper adoptará el RAP como su panel diario y compartirá/descargará sus logros en redes para marketing de atracción.
*   **Test de Validación más Barato:** Fake Door en Home (tarjeta estática del RAP con métricas simuladas de racha) midiendo el CTR del CTA antes de instrumentar APIs en tiempo real.
*   **Tracking / Eventos a Instrumentar:**
    *   `view_home_rap_card`
    *   `click_rap_action_streak`
    *   `download_rap_report_image`

---

## 15. Ayuda Contextual por Módulo (PROD-HELP-MOD)

*   **Fase de Ciclo:** **Explore** (Definición de rutas UserPilot).
*   **Comportamiento Específico:** Un dropshipper con dudas operativas dentro de un módulo (ej. mis integraciones) expande la ayuda contextual, visualiza un video de < 1 min o califica una FAQ in-app sin salir de la plataforma.
*   **Alineación AI Library:** Esta ayuda y guías de usuario por módulo se unirán con el proyecto global de la **Biblia de AI / Help Center (SAC)** y el de **Biblioteca AI** para centralizar la entrega del contenido y evitar redundancias y sobrecarga cognitiva.
*   **Insumo de SAC (FAQs Contextuales):** Se utilizará el desglose de preguntas del reporte operacional de SAC (`ml_ia.patrones`) para estructurar y redactar las FAQs específicas del widget de cada módulo (ej. FAQ de estado de retiros y recargas en Wallet, FAQ de guías generadas y cancelaciones en Pedidos, FAQ de sincronización en Integraciones, y FAQ de productos/bodegas en Catálogo).
*   **Ubicación Física de la Ayuda:**
    *   **No íconos flotantes:** Para evitar colisiones físicas con el widget de Intercom, la ayuda será una gotica o barrita tenue debajo de la cabecera de cada módulo, oculta por defecto y expandible en hover.
*   **Límites Técnicos de la Arquitectura:**
    *   > [!CAUTION]
    *   > **Restricción Crítica:** La nueva arquitectura de Dropi **no permitirá ayuda contextual ni scripts de UserPilot en los pasos del registro e onboarding inicial**. Esta iniciativa se restringe exclusivamente a los módulos internos post-login (Productos, Mis Pedidos, Mis Integraciones, Garantías, Home).
*   **Business Outcome (Lagging):** Reducción en la tasa de tickets de soporte técnico (SAC) creados por modulo de alto tráfico.
*   **Product Outcome (Leading):** Conversión de resolución in-app (usuario expande ayuda y no crea ticket en las siguientes 24 horas).
*   **Baseline & Meta:**
    *   *Baseline:* 0% de autogestión local por módulo (todo cae al Help Center global o chat).
    *   *Meta:* $\ge 30\%$ de autogestión exitosa en el módulo de integraciones y catálogo.
*   **Diagnóstico B=MAP & Sesgo:** **Ability (A) cognitiva**. Se mitiga el *Ambiguity Effect* al proveer micro-aprendizaje de bajo esfuerzo cognitivo exactamente donde ocurre la fricción.
*   **Supuesto más Riesgoso:** El dropshipper prefiere ver un video local de 45 segundos a chatear directamente con un agente de soporte.
*   **Test de Validación más Barato:** Lanzamiento del widget manual expandible (Intercom/UserPilot) en el módulo de integraciones a una cohorte de 50 sellers midiendo el CTR de consulta.
*   **Tracking / Eventos a Instrumentar:**
    *   `hover_expand_module_help`
    *   `click_module_faq_item`
    *   `play_contextual_video_success`
    *   `rate_help_usefulness`

---

## 16. Solicitud de Funciones / Feedback Interno (PROD-FEEDBACK)

*   **Fase de Ciclo:** **Wonder** (Investigación inicial de canal).
*   **Comportamiento Específico:** Un dropshipper experimentado registra un dolor o propuesta técnica en el buzón interno de Darwin en lugar de quejarse en grupos externos o chats de soporte.
*   **Alineación de Diseño (Experience):** No desarrollar este botón desde cero. Debe integrarse y alinearse directamente con la **iniciativa y el diseño definitivo que ya tiene el equipo de Experience** para desplegarlo de forma transversal en toda la plataforma.
*   **Integración con Sherlock:** Conectar este buzón de co-creación con **Sherlock** para que analice semánticamente las propuestas de los sellers, detecte duplicados, las categorice por área de producto y las asigne automáticamente al PM/célula responsable en Jira.
*   **Mecanismo de Votación y Privacidad:**
    *   **No Público por Competencia:** De acuerdo a directrices de Mario, el roadmap y las ideas no serán públicos externamente para proteger el know-how de competidores.
    *   **Lógica de Votos Ocultos:** Los usuarios pueden votar sobre iniciativas, pero el número total de votos estará oculto para evitar frustración si la idea más votada no es prioritariamente desarrollada por el equipo.
    *   **Disclaimer Requerido:** La interfaz debe aclarar explícitamente que registrar una idea no garantiza su implementación.
*   **Business Outcome (Lagging):** Reducción de reclamos públicos, aumento del Net Promoter Score (NPS) de la plataforma y centralización de la demanda de features.
*   **Product Outcome (Leading):** Tasa de participación y volumen de ideas cualificadas recibidas directamente en la célula Darwin.
*   **Baseline & Meta:**
    *   *Baseline:* 0% de canal de feedback estructurado e interactivo.
    *   *Meta:* $\ge 15\%$ de comercios activos enviando propuestas mensualmente.
*   **Diagnóstico B=MAP & Sesgo:** **Motivación (M) intrínseca**. Se apoya en la *Autonomía* y la co-creación (SDT) dando ownership de la evolución del producto sin alertar a competidores.
*   **Supuesto más Riesgoso:** Los usuarios escribirán propuestas detalladas en lugar de simplemente reportar bugs transaccionales.
*   **Test de Validación más Barato:** Input simple interactivo (tipo buzón GoHighLevel) colocado en un menú secundario para medir volumen y calidad de las peticiones iniciales.
*   **Tracking / Eventos a Instrumentar:**
    *   `open_feedback_form`
    *   `submit_feature_proposal`
    *   `vote_internal_roadmap_item`

---

## 17. Investigación de Integraciones ERP/CMS (PROD-CMS-ERP)

*   **Fase de Ciclo:** **Wonder** (Discovery e investigación).
*   **Comportamiento Específico:** Un dropshipper utiliza integraciones nativas simplificadas con ERPs (Alegra, Siigo) para facturación y ERPs/CMS adicionales (Tienda Nube AR/MX, Mercado Libre AR/MX, Astroselling, Metricool, Apify) para gestión automatizada y sincronización de stock multiplataforma sin discrepancias.
*   **Volumen de Producto Privado:** Se incorpora la métrica de que el **45% de todo el volumen movilizado en Dropi corresponde a productos privados**. Esto sustenta la necesidad de integraciones ERP robustas y protegidas para importadores y marcas.
*   **Business Outcome (Lagging):** Diversificación del volumen transaccionado en canales alternativos (no-Shopify) y retención de grandes marcas/dropshippers.
*   **Product Outcome (Leading):** % de consistencia en sincronización de stock multi-plataforma e integración de facturación sin incidencias de soporte.
*   **Diagnóstico B=MAP & Sesgo:** **Ability (A)**. La integración manual de múltiples tiendas dispersa y aumenta la carga operativa de control de stock y contabilidad.
*   **Test de Validación más Barato:** Benchmark funcional detallado del manejo de stock multiplataforma de *Astroselling* y análisis técnico de APIs de *Alegra* y *Siigo*.

---

## 18. Sherlock & Atención SAC (PROD-SHERLOCK-SAC)

*   **Fase de Ciclo:** **Wonder** (Discovery conceptual).
*   **Comportamiento Específico:** El buzón de co-creación y feedback de los sellers (PROD-FEEDBACK) se conecta con Sherlock, facilitando el procesamiento semántico de ideas, el triaje automático y la asignación inteligente del soporte en los grupos de WhatsApp y canales de soporte liderados por Laura Contreras.
*   **Business Outcome (Lagging):** Reducción del First Response Time (FRT) y aumento de la satisfacción del cliente (CSAT).
*   **Product Outcome (Leading):** % de tickets/mensajes auto-categorizados y ruteados exitosamente por Sherlock sin intervención manual inicial.
*   **Test de Validación más Barato:** Mapeo de flujos de asignación de Laura en WhatsApp y seteo de 10 reglas de triaje simuladas en Sherlock.

---

## 19. Viabilidad de PoolMax en Dropi (PROD-POOLMAX)
*   **Fase de Ciclo:** **Wonder** (Discovery inicial / Viabilidad técnica y de negocio).
*   **Comportamiento Específico:** Un dropshipper utiliza la integración de PoolMax en Dropi para optimizar la escala de sus ventas a través del canal de Shopify (Shopi).
*   **Business Outcome (Lagging):** Diversificación del portafolio transaccional y aumento de volumen movilizado por integraciones de nicho.
*   **Product Outcome (Leading):** Factibilidad y tasa de éxito de la Prueba de Concepto (PoC) sobre Shopi sin introducir regresiones o fugas de sincronización.
*   **Bloqueante Actual & Siguiente Paso:** A la espera de que el founder de PoolMax envíe la descripción del proyecto y requerimientos API/Data. *Acción:* El PM y el equipo técnico evaluarán la factibilidad en cuanto se reciba el documento de PoolMax, según solicitud directa del CEO.

---

## 🧭 Mapa 360° de Conexión de Datos Reales (Data-to-Initiative Mapping)

> **Métrica Norte Confirmada:** La **Tasa de Activación Neta** oficial de la célula se fija en **5.2%** (meta S2: **8.0%**). La columna `real_orders_delivered >= 1` es el indicador técnico asignado para medir este avance en Supabase.

Este mapa consolida **todas** las variables reales disponibles en la tabla `userpilot_suppliers` de Supabase (perfil Userpilot + métricas operativas del backend de Dropi) y las conecta con los OKRs, KPIs y las 19 iniciativas activas de la célula Seller Success.

---

### Catálogo Completo de Variables Disponibles

#### A. Identidad y Contacto

| # | Campo (DB) | Origen | Estado | OKR / KPI que alimenta | Iniciativas que lo consumen | Uso concreto |
|---|---|---|---|---|---|---|
| 1 | `user_id` | Userpilot | ✅ Poblado | Todos | Todas | Llave primaria para cruzar con cualquier sistema (CRM, n8n, GHL). |
| 2 | `name` | Userpilot | ✅ Poblado | — | `PROD-1664` (Notificaciones), `PROD-WRAPPED` | Personalización de mensajes push/WhatsApp y tarjeta Wrapped. |
| 3 | `email` | Userpilot | ✅ Poblado | — | `PROD-1664`, `PROD-1666` (Churn), `PROD-FEEDBACK` | Canal de contacto para campañas de rescate y encuestas NPS. |
| 4 | `phone` | Userpilot | ✅ Poblado | — | `PROD-1664`, `PROD-1478` (TTV), `PROD-1666` | Canal WhatsApp para prompts conductuales y llamadas de rescate comercial. |
| 5 | `country` | Userpilot | ✅ Poblado | Todos (segmentación geográfica) | Todas | Segmentación por país para rollout progresivo (CO → MX → EC → CL). |
| 6 | `role` | Userpilot | ✅ Poblado | Todos (filtro poblacional) | Todas | **Rol del usuario en Dropi.** Producción: `DROPSHIPPER` 78%, `SUPPLIER` 19%, `SELLER` 2%, `ADMIN` 0.05%. Permite aislar la población exacta para cada experimento. |

#### B. Comportamiento Digital (Userpilot Tracking)

| # | Campo (DB) | Origen | Estado | OKR / KPI que alimenta | Iniciativas que lo consumen | Uso concreto |
|---|---|---|---|---|---|---|
| 7 | `signed_up` | Userpilot | ✅ Poblado | **Mediana TTV Neto** | `PROD-1478` (TTV), `PROD-1663` (Page Pilot), `PROD-1546` (Huella 3.0) | Fecha de registro. Punto de inicio para calcular `dias_en_activarse = fecha_activacion - signed_up`. |
| 8 | `first_seen` | Userpilot | ✅ Poblado | **Tasa de Activación** | `PROD-1478`, `PROD-1546` | Primera interacción real con la plataforma. Detecta latencia entre registro y primer login. |
| 9 | `last_seen` | Userpilot | ✅ Poblado | **Supervivencia 30d** | `PROD-1665` (Hábito), `PROD-1666` (Churn), `PROD-RAP` | Última actividad. Si `now() - last_seen > 7d`, el seller entra en cohorte de riesgo de abandono. |
| 10 | `web_sessions` | Userpilot | ✅ Poblado | **Supervivencia 30d**, **Deflexión Soporte** | `PROD-1478` (TTV), `PROD-1665`, `PROD-1666`, `PROD-HELP-MOD`, Sherlock | Frecuencia de uso. Correlacionar con órdenes para medir engagement real vs. visitas vacías. El behavior route define activación como `> 7 sesiones`. |
| 11 | `device_type` | Userpilot | ✅ Poblado | — | `PROD-1546` (Huella 3.0), `PROD-HELP-MOD` | Optimización responsive. Si >60% usa mobile, priorizar diseño mobile-first en onboarding. |
| 12 | `browser` | Userpilot | ✅ Poblado | — | `STID-6598` (Bugs Tienda Nube), `PROD-1667` (Dropify) | Debugging de incompatibilidades de sincronización por navegador (ej. Safari vs. Chrome). |
| 13 | `os` | Userpilot | ✅ Poblado | — | `PROD-1546`, `PROD-HELP-MOD` | Segmentación técnica para guías de ayuda contextual específicas por SO. |
| 14 | `browser_language` | Userpilot | ✅ Poblado | — | `PROD-HELP-MOD`, `PROD-1664` | Localización de notificaciones y FAQs (es-CO vs. es-MX vs. pt-BR). |
| 15 | `verified` | Userpilot | ⚠️ **Inútil (0% true)** | — | — | **0 registros con `true` en producción** (99.13% = `false`). El campo existe pero no se está usando para marcar verificación. No usar en análisis hasta que se instrumente. |

#### C. Encuestas de Onboarding (Userpilot Surveys)

| # | Campo (DB) | Origen | Estado | OKR / KPI que alimenta | Iniciativas que lo consumen | Uso concreto |
|---|---|---|---|---|---|---|
| 16 | `survey_role` | Encuesta UP | ✅ Poblado | **Tasa de Activación** | `PROD-1478`, `PROD-RAP`, `PROD-1663` | Auto-declaración del rol del seller (proveedor / marca). Complementa `role` (#6) con la perspectiva declarada por el usuario. |
| 17 | `survey_stage` | Encuesta UP | ✅ Poblado | **Mediana TTV** | `PROD-1478`, `PROD-1663`, `PROD-MUESTRA-SIMP` | Nivel de experiencia declarado (Principiante/Intermedio/Avanzado). Define la intensidad del scaffolding. |
| 18 | `survey_volume` | Encuesta UP | ✅ Poblado | **NSM (Órdenes despachadas)** | `PROD-1478`, `PROD-SEC-BEST`, `PROD-WRAPPED`, `PROD-1666` (Churn) | Volumen esperado de ventas. Un seller que declaró "Más de 1.000" pero tiene 0 órdenes entregadas es un caso de churn de alto valor. |
| 19 | `survey_purpose` | Encuesta UP | ✅ Poblado | **Mediana TTV** | `PROD-1663`, `PROD-RAP`, `PROD-1546` | Motivación declarada (buscar productos / vender con tienda propia / explorar). Personaliza el Home y el CTA de la tarjeta RAP. |
| 20 | `survey_brand_sales` | Encuesta UP | ✅ Poblado | — | `PROD-CMS-ERP`, `PROD-SEC-BEST` | Indica si el seller vende marca propia o catálogo de terceros. Define la estrategia de enrutamiento dinámico y prioridad ERP. |
| 21 | `survey_shipping_pref` | Encuesta UP | ✅ Poblado | **Tasa de Cancelación** | `PROD-MUESTRA-SIMP`, `PROD-SEC-BEST`, `PROD-1664` | Preferencia logística declarada. Permite pre-seleccionar transportadora en el autofill de muestras. |
| 22 | `survey_sell_pref` | Encuesta UP | ✅ Poblado | **Tasa de Activación** | `STID-6598`, `PROD-1667` (Dropify), `PROD-HELP-MOD`, `PROD-CMS-ERP` | Canal de venta declarado (Shopify / WooCommerce / Tienda Nube / Manual). Segmenta FAQs contextuales y prioriza bugs de integración. |
| 23 | `survey_source` | Etiqueta interna | ✅ Poblado (8.7%) | — | `PROD-1478`, `PROD-1666` | **No es canal de adquisición.** Valores reales: `huerfanos` (2,857), `comunidades` (417), `encuesta_huerfanos_16jul` (747). Clasificación interna de origen de cohorte, no fuente de tráfico. 91.3% NULL. |

#### D. Comunidades y Referidos

| # | Campo (DB) | Origen | Estado | OKR / KPI que alimenta | Iniciativas que lo consumen | Uso concreto |
|---|---|---|---|---|---|---|
| 24 | `owner_of_community` | Userpilot | ✅ Poblado | **Supervivencia 30d** | `PROD-WRAPPED` (Leyendas), `PROD-1665` | Identifica líderes de comunidad. Activa el nivel "Leyenda" en Wrapped y mide su impacto en la retención de miembros. |
| 25 | `belong_to_community` | Userpilot | ✅ Poblado | **Supervivencia 30d**, **Tasa de Activación** | `PROD-1478`, `PROD-WRAPPED`, `PROD-1666`, `PROD-1665` | Sellers con comunidad tienen mayor retención. Segmentar para medir el efecto comunidad vs. huérfanos. |
| 26 | `referred_by` | Userpilot | ✅ Poblado | **Tasa de Activación** | `PROD-1478`, `PROD-1663` | Validar si sellers referidos se activan más rápido que orgánicos (hipótesis de Social Proof). |

#### E. Configuración Financiera

| # | Campo (DB) | Origen | Estado | OKR / KPI que alimenta | Iniciativas que lo consumen | Uso concreto |
|---|---|---|---|---|---|---|
| 27 | `billing_information` | Userpilot | ✅ **Poblado (9.75%)** | **Tasa de Activación** | `PROD-1546` (Huella 3.0), `PROD-1478` | **4,503 sellers (9.75%) tienen datos bancarios configurados.** El evento SÍ funciona en producción. Usar como paso del embudo de onboarding financiero (Registro → Billing → Primera Orden). |

#### F. Métricas Operativas (Backend Dropi cruzado con CSV transaccional)

| # | Campo (DB) | Origen | Estado | OKR / KPI que alimenta | Iniciativas que lo consumen | Uso concreto |
|---|---|---|---|---|---|---|
| 28 | `tipo_proveedor` | Backend CSV + Encuesta | ⚠️ **Datos mixtos** | — | `PROD-CMS-ERP`, `PROD-SEC-BEST` | **Problema de calidad:** la columna mezcla dos taxonomías: (a) tiers de validación (`VERIFICADO` 79, `PREMIUM` 19, `PREMIUM EXCLUSIVO` 10) y (b) categorías de producto de encuesta ("Belleza, salud..." 203, "Catálogo mixto" 137). 98.5% NULL. Requiere limpieza antes de usar analíticamente. |
| 29 | `fecha_activacion` | Backend CSV | ✅ Poblado | **Mediana TTV Neto** | `PROD-1478`, `PROD-1663`, `PROD-WRAPPED` | Timestamp exacto de la primera orden entregada. Ancla del cálculo de TTV. |
| 30 | `dias_en_activarse` | Backend CSV | ✅ Poblado | **Mediana TTV Neto** (=16d) | `PROD-1478`, `PROD-1663`, `PROD-WRAPPED` | Velocidad de activación en días. KPI norte del onboarding (meta <12d). Dato candidato para rachas del Wrapped ("Te activaste en 8 días — más rápido que el 80%"). |
| 31 | `es_activo_30d` | Backend CSV | ✅ Poblado | **Supervivencia 30d** (=69.38%) | `PROD-1665`, `PROD-1666`, `PROD-WRAPPED` | Bandera booleana de retención. Si `false`, seller entra en cohorte de rescate para campañas de reactivación CRM. |
| 32 | `real_orders_delivered` | Backend CSV | ✅ Poblado | **Tasa de Activación Neta** (=5.2%), **NSM** | `PROD-1478`, `PROD-1663`, `PROD-WRAPPED`, `PROD-1666`, `PROD-SEC-BEST`, `PROD-1729` | Volumen neto de órdenes entregadas. Clasifica madurez del seller (0=Huérfano, 1-5=Iniciando, 6-50=Creciendo, 50+=Pareto). |
| 33 | `real_products_created` | Backend CSV | ⚠️ **Snapshot parcial (3.13%)** | **Tasa de Activación** (TTFO) | `PROD-1546`, `PROD-1663`, `PROD-MUESTRA-SIMP` | **1,448 registros poblados** (promedio 18.1 productos), 96.87% NULL. Dato estático del CSV — solo cubre los registros que cruzaron con el archivo operativo. No hay pipeline en tiempo real. |
| 34 | `real_dropshipper_clients` | Backend CSV | ✅ Poblado | **NSM** | `PROD-WRAPPED`, `PROD-1665`, `PROD-1666` (Churn), `PROD-SEC-BEST` | Número de clientes únicos atendidos. Un seller con muchos clientes pero inactivo es un perfil de churn de alto valor. |
| 35 | `created_at` | Supabase auto | ✅ Poblado | — | Auditoría interna | Timestamp de inserción del registro en Supabase. Útil para detectar registros importados tardíamente y auditar la frescura del dato. |

---

### Resumen Ejecutivo (Validado contra producción · 46,208 registros · 2026-07-30)

| Dimensión | Campos Totales | ✅ Poblados | ⚠️ Gaps / Alertas |
|---|---|---|---|
| Identidad y Contacto | 6 | 6 | 0 |
| Comportamiento Digital | 9 | 8 | **1** (`verified` = 0% true) |
| Encuestas Onboarding | 8 | 8 | 0 |
| Comunidades y Referidos | 3 | 3 | 0 |
| Configuración Financiera | 1 | 1 | 0 |
| Métricas Operativas | 8 | 5 | **3** (`tipo_proveedor` mixto, `real_products_created` parcial, `motivo_cancelacion` no existe) |
| **TOTAL** | **35** | **31** | **4** |

### Gaps y Alertas de Calidad de Datos

| Severidad | Campo | Hallazgo de Producción | Acción Requerida |
|---|---|---|---|
| 🔴 Inútil | `verified` | **0 registros con `true`** en 46,208. Campo muerto. | No usar. Investigar si la verificación se hace por otro canal (ej. `tipo_proveedor = VERIFICADO`). |
| 🔴 Taxonomía mixta | `tipo_proveedor` | Mezcla tiers de validación (VERIFICADO/PREMIUM) con categorías de producto (Belleza, Tecnología). 98.5% NULL. | Separar en dos campos o limpiar. No usar en análisis cruzados hasta resolver. |
| 🟡 Snapshot parcial | `real_products_created` | Solo 1,448 de 46,208 registros (3.13%) tienen dato. Snapshot del CSV, no pipeline. | Implementar sincronización continua desde el backend de catálogo. |
| 🟡 Etiqueta interna | `survey_source` | No es canal de adquisición. Valores: `huerfanos`/`comunidades`/`encuesta_*`. 91.3% NULL. | Corregir la descripción en documentación. Si se necesita canal de adquisición real, instrumentar nuevo campo. |
| 🟡 Dato faltante | `motivo_cancelacion` | Campo no existe en el esquema de la tabla. | Solicitar a TI que exponga el motivo de cancelación en la API de órdenes. |

### ⚠️ Campos Pendientes de Validación en Producción

| Campo | Pregunta a resolver | Query de validación |
|---|---|---|
| `survey_source` | ¿Qué valores reales tiene? ¿Es canal de adquisición o clasificación binaria? | `SELECT survey_source, count(*) FROM userpilot_suppliers WHERE survey_source IS NOT NULL GROUP BY survey_source` |
| `real_products_created` | ¿Cuántos registros tienen valor > 0? ¿Es dato confiable? | `SELECT count(*) AS total, count(CASE WHEN real_products_created > 0 THEN 1 END) AS con_productos FROM userpilot_suppliers` |
| `billing_information` | ¿Algún registro tiene `true`? | `SELECT billing_information, count(*) FROM userpilot_suppliers GROUP BY billing_information` |
| `verified` | ¿El valor viene del frontend de Dropi o de Userpilot? | `SELECT verified, count(*) FROM userpilot_suppliers GROUP BY verified` |
