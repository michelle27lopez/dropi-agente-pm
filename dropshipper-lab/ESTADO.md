# 🧭 ESTADO ACTUAL — Célula Darwin / Seller Success (S2 2026)

> Este archivo representa el estado "vivo" de la célula de producto. Se lee al iniciar cada sesión de chat y se actualiza al cerrarla para registrar decisiones, bloqueos y próximos pasos.

**Última actualización:** 2026-07-30 · PM: Santiago Herrera · Designer: Alejandra Melo · **Auditoría de Data 360:** Se completó la validación en producción de los 35 campos de `userpilot_suppliers` (46,208 registros reales) y se actualizó el Mapa 360° en `materializacion_iniciativas.md`.

> [!IMPORTANT]
> 🔥 **Doctrina Core de la Célula:** Obsesión total con los OKRs y KPIs oficiales. Toda iniciativa, experimento, mock, spec o hipótesis de Discovery existe **únicamente** si demuestra una palanca directa para mover el **KR 1.1 de la compañía (7.8M ord/mes)**, la **Activación Neta (5.2% $\to$ 8.0%)**, la velocidad **TTV Neto (16d $\to$ <12d)** o la **Retención 30d (69.4% $\to$ 75.0%)**. No hay lugar para tareas sin impacto medible.

---

## Foco Estratégico & Alignment (S2 2026)
*   **OKR de Compañía que Impacta:** **OKR 1 / KR 1.1 — Alcanzar 7.8M órdenes/mes** (93.6M anuales).
*   **Q3 (Julio–Septiembre):** Activación Bruta/Neta y Time-to-Value (TTV) Bruto/Neto del dropshipper huérfano. *(Meta Activación Neta: 5.2% $\to$ 8.0% | TTV Neto: 16d $\to$ < 12d)*.
*   **Q4 (Octubre–Diciembre):** Retención, Reducción de Churn y Crecimiento de Usuarios *(Visión construida desde las exploraciones de Q3 via Programa 360)*.
*   **Especificación Core Oficial:** [confluence_seller_success_2026_s2.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/confluence_seller_success_2026_s2.md).

---

## 📊 Hito Reciente: Alineación Oficial S2 Confluence & Validación Data 360 (2026-07-30)
*   **Alineación Core S2:** Se incorporó el Pliego Oficial de Confluence (Space PD Page 1483833347) estableciendo el **OKR 1 / KR 1.1 (7.8M ord/mes)** como el marco de compañía y formalizando el **Product Backlog de 11 Oportunidades de Discovery** (Wonder $\to$ Explore $\to$ Make $\to$ Impact).
*   **35 Campos Mapeados:** 31 poblados y operativos, 4 con alertas de calidad (`verified` en 0%, `tipo_proveedor` con taxonomía mixta, `real_products_created` estático en 3.13%, `survey_source` como etiqueta interna).
*   **Verificación Real:** `role` (78% Dropshipper, 19% Supplier) y `billing_information` (9.75% true) son totalmente analíticos en producción.
*   **Documentación de Referencia:** [materializacion_iniciativas.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/materializacion_iniciativas.md#L344), [confluence_seller_success_2026_s2.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/dropshipper-lab/planning/confluence_seller_success_2026_s2.md) y [auditoria_mapa_360.md](file:///Users/santiago.herrera/.gemini/antigravity-ide/brain/b9494400-a2ac-4d43-960a-a107b8748b86/auditoria_mapa_360.md).

---

## 📢 Resoluciones del Comité de Producto (2026-07-29 · CEO & CPO)

En el comité con el CEO y la CPO se tomaron decisiones clave sobre el roadmap y la priorización de iniciativas:

*   **Page Pilot V1:** Se aprueba lanzar la versión 1 y monitorizar su crecimiento interno. Para el evento comercial se evalúa utilizar **Fluxxi** (IA propia), pero el CEO advirtió que la integración puede ser compleja porque requeriría redireccionar a los usuarios hacia su plataforma externa, lo cual no es la idea. Debemos coordinar con el equipo de Marketing para verificar qué herramientas tienen ellos o si podemos integrar Page Pilot de forma interna. Se investigará qué es *iconMagic*.
*   **Dropify 2.0 (Shopify App):** Se realizará una optimización de la página de descripción en Shopify App Store con el equipo de Growth. Se requiere garantizar la sincronización fácil de productos preexistentes en Shopify hacia Dropi. Se iniciará un benchmark de nombres comerciales para realizar un **rebranding de la marca Dropify**.
*   **Wrapped & Leyendas:** Se unifica por completo el proyecto *Dropi Wrapped* con el programa *Leyendas Dropi*. Las métricas, niveles y racha del Wrapped se sincronizarán directamente con los 6 niveles y umbrales de *Leyendas* para crear un único ecosistema de gamificación y retención.
*   **WooCommerce y Tienda Nube:** Se reporta que las métricas mostradas para WooCommerce y Tienda Nube no coinciden con las del tablero de Miguel. Se abrirá una investigación inmediata para auditar y conciliar estas discrepancias.
*   **Órdenes en Alerta:** Se integrará este módulo con **Dropi Pulso**. Además, se revisará la lógica del "condicionador" mencionada por María para refinar las alertas.
*   **Sherlock & Soporte:** Se conectará el buzón de co-creación y feedback de los sellers (PROD-FEEDBACK) directamente con Sherlock. La operación de procesamiento de ideas y soporte se integrará con el triaje de atención liderado por Laura Contreras en los grupos de WhatsApp y canales de soporte.
*   **Nuevas Oportunidades & ERPs:** Se investigará la viabilidad de integraciones con Metricool (redes/analytics), Apify (scraping/automatización), Astroselling (gestión de stock multiplataforma) y ERPs líderes en LATAM como Alegra y Siigo. También se planificará la extracción y scraping de datos competitivos.
*   **Buzón de Feedback:** El botón de feedback platform-wide se unificará con el proyecto preexistente y el diseño de la célula de *Experience*. Tendrá votos ocultos para evitar dar visibilidad del roadmap a la competencia.
*   **Biblioteca AI (Guías):** Las guías de usuario de ayuda contextual deben alinearse con el proyecto *Biblioteca AI* para evitar duplicidades de contenido.
*   **Enrutamiento Dinámico:** Se conectará la idea de enrutamiento dinámico (desvío a proveedor secundario ante stockout) con el proyecto preexistente de *órdenes automatizadas*.
*   **Dato Clave de Catálogo:** Se oficializa que **el 45% de todo el volumen movilizado en la plataforma corresponde a productos privados**.
*   **PoolMax en Dropi:** Nueva iniciativa estratégica solicitada por el CEO. Se estudiará su viabilidad técnica y operativa, iniciando con una Prueba de Concepto (PoC) en **Shopi** (Shopify). Actualmente a la espera de recibir la descripción formal del proyecto por el founder de PoolMax para arrancar el análisis de factibilidad.

---

## 🎯 Tablero de Control de OKRs & KPIs: Meta vs. Realidad Actual (S2 2026)

> [!NOTE]
> **Dato Oficial Confirmado:** La **Tasa de Activación Neta** oficial de la célula se fija en **5.2%** (dropshippers registrados que entregan $\ge 1$ orden neta). Se contrasta a continuación cada OKR y KPI estratégico contra su brecha real de ejecución.

### 1. OKRs y Outcomes de Negocio (Meta vs. Realidad)

| Outcome / OKR | Baseline Oficial | Realidad Actual (Julio 2026) | Meta S2 (Q3-Q4) | Brecha / Gap a la Meta | Variable Técnica / Fuente |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **OKR 1 / KR 1.1 (Compañía)** | — | **3.351.359 ord/mes** | **7.800.000 ord/mes** | 🔴 **-4.448.641 ord** (42.9% de meta global) | KR 1.1 Holding (Confluence PD) |
| **NSM (Métrica Estrella Célula)**| 3.435.363 ord/mes | **3.351.359 ord/mes** (1-29 Jul) | **3.571.042 ord/mes** | 🟡 **-219.683 ord** (97,5% cumplimiento) | Reporte CPO (Julio 2026) |
| **Tasa de Activación Neta** | **5.2%** | **5.2%** | **8.0%** | 🔴 **-2.8 pp** (Falta subir +53.8% relativo) | `real_orders_delivered >= 1` |
| **Mediana de TTV Neto** | **16.0 días** | **16.0 días** | **< 12.0 días** | 🔴 **+4.0 días** (Reducir latencia 25%) | `dias_en_activarse` (Backend Dropi) |
| **Supervivencia 30d (Retención)** | 69.38% | **69.38%** (Jun: 69.5%) | **75.0%** | 🟡 **-5.62 pp** (Brecha del 7.5%) | `es_activo_30d = true` / Cohortes |
| **Tasa de Cancelación / Stockout** | `[DATO FALTANTE]` | `[DATO FALTANTE]` | **-50% en Pareto** | ⚠️ Requiere exposición API TI | `motivo_cancelacion = 'stockout'` |
| **Deflexión Soporte Técnico** | 0% (3.664 pqs) | **0%** (3.664 pqs/mes SAC) | **40.0%** | 🔴 **-40.0 pp** (Por iniciar) | Help Center / Sherlock (`PROD-HELP-MOD`) |

---

### 2. Diagnóstico de Población y Calidad de Data (46.208 Registros DB)

| Indicador Conductual | Realidad Actual en Producción | Interpretación Conductual & Uso en Célula |
| :--- | :---: | :--- |
| **Base Total Identificada** | **46.208 usuarios** | Registros sincronizados en `userpilot_suppliers` (Supabase). |
| **Dropshippers Puros (`role`)** | **36.056 usuarios** (**78.0%**) | **Población Objetivo Principal** de las 19 iniciativas de Seller Success. |
| **Proveedores y Marcas (`role`)** | **8.744 usuarios** (**18.9%**) | Universo de oferta de catálogo y marcas propias. |
| **Activos Diarios (DAU Userpilot)** | **14.262 usuarios/día** | **~31% de actividad diaria**. Tráfico masivo operando hoy. |
| **Activos Mensuales (MAU Userpilot)** | **81.521 usuarios/mes** | Tráfico web bruto global (incluye landing, logins y anónimos). |
| **Configuración Financiera (`billing`)**| **9.75%** (4.503 sellers) | Embudo de onboarding financiero (Registro $\to$ Billing $\to$ 1ª Orden). |
| **Catálogo Poblado (`products_created`)**| **3.13%** (1.448 sellers) | Snapshot estático CSV de sellers con catálogo publicado. |
| **Verificación In-App (`verified`)** | **0.0%** (0 de 46.2k) | Alerta de calidad: campo no instrumentado en frontend. |

---

### 3. Core Product Backlog — Oportunidades & Retos de Discovery CPO (S2 2026)

> **Directivas Oficiales CPO (Pliego Confluence 1483833347):** Son los retos estratégicos entregados por la CPO para resolver durante S2. El deliverable final de cada ítem no existe hoy, sino que se irá definiendo en la medida que cada oportunidad avance por **Wonder → Explore → Make → Impact**.

| # | Oportunidad / Reto CPO | Fase Discovery | Estado del Deliverable | Reto Estratégico a Resolver en S2 |
|---|---|---|---|---|
| 1 | **Primera medición KPIs y metas** | **Wonder** | ✅ `[COMPLETADO]` Audit Report | Medición factual en producción (46.2k DB) + metas CPO oficializadas. |
| 2 | **Cronograma ejecución Q3** | **Arranque** | ⚙️ `[EN CURSO]` Master Roadmap | Secuenciar Delivery Backlog + Discovery con Dev/UX y fechas. |
| 3 | **Visión de Producto Seller 360** | **Represado · Validar**| 🔍 `[POR DEFINIR — Reto CPO S2]` | Unir la oferta completa (Catálogo, Wallet, CMS, Roax, Chatea Pro, Leyendas) por nivel de madurez. Definir deliverable y fecha. |
| 4 | **Programa 360 In-App (Retención)**| **Explore** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Mapear palancas comerciales (GMV) y bajarlas in-app a la plataforma para activación/retención. |
| 5 | **Mensajería Gratuita (WhatsApp/SMS)**| **Represado · Validar**| 🔍 `[POR DEFINIR — Reto CPO S2]` | Reemplazo de ChatCenter con Chatea Pro Freemium (masivos + automatización básica) junto a Brands. |
| 6 | **Módulo Marketing & Tools** | **Explore** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Recopilar la suite de herramientas de marketing que saldrán en Home. |
| 7 | **Enfocarse en testeos más rápidos** | **Explore** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Habilitar mecanismos de experimentación y testeo exprés de productos/pautas. |
| 8 | **Primeras ventas más rápido** | **Explore** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Reducir la fricción inicial para acelerar el Time-to-First-Order (TTFO) y TTV neto. |
| 9 | **Alerta Precio Recomendado & Stockout** | **Wonder** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Indicar proactivamente mayor margen de venta y alerta preventiva de agotamiento de stock. |
| 10 | **Automatización CMS ante Stockout** | **Wonder** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Automatizar desvío con CMS a proveedor secundario sin apagar campañas de pauta. |
| 11 | **Comparador de Proveedores** | **Wonder** | 🔍 `[POR DEFINIR — Reto CPO S2]` | Habilitar comparación in-app de costos, tiempos de despacho y reputación del proveedor. |

---

---

## 📡 Radar de Experimentos Semanales (Semana del 2026-07-27)

| Experimento (ID Jira) | Método / Test | Cohorte / Target | Métrica de Éxito Decl. | Estado / Bloqueante |
| :--- | :--- | :--- | :--- | :--- |
| **Tarjeta RAP (`PROD-RAP`)** | Fake Door (Home) | Muestra de sellers activos | CTR del CTA en RAP $\ge 35\%$ | **En Planificación** (Santiago con Diana/marketing) |
## 📋 Estado por Frente de Trabajo

### 1. Integraciones con CMS & Canales (Tienda Nube, Mercado Libre, Astroselling) — En curso
*   **Objetivo:** Resolver los bugs críticos en Tienda Nube (sincronización de variables, fletes y Barrio/Piso) y expandir la robustez de canales multitienda.
*   **Estado:** En curso de desarrollo de bugs (`STID-6598`).
*   **Próximos Pasos (CEO Sinc):**
    1.  Estructurar el soporte de **Tienda Nube para Argentina y México**.
    2.  Realizar un **benchmark de Astroselling** para analizar cómo maneja el stock sincronizado en múltiples plataformas simultáneamente.
    3.  Planificar la integración nativa con **Mercado Libre para Argentina y México**.
    4.  Hacer pruebas manuales del Order Bump en el portal de partners de Tienda Nube.

### 2. Page Pilot — Activación de Huérfanos (PROD-1663 / PRM-1238) — En curso
*   **Objetivo:** Validar el Creador de Páginas como palanca para que el dropshipper logre su primera orden rentable ($Pv - Pp - F - D > 0$) en $\le 14$ días.
*   **Estado (CEO Sinc):** Saldremos a producción con el piloto de 120 usuarios seleccionados de forma controlada, pero con el foco en **monitorear de cerca cómo crece internamente** antes de escalar la pauta o campañas comerciales masivas.
*   **Próximos Pasos:** Habilitar el flag en producción (`PROD-1516`) y coordinar con Miguel Ángel (Data) la auditoría del baseline bajo la nueva fórmula de orden rentable.

### 3. Módulo de Notificaciones y Ayuda Contextual (PROD-1664 / PROD-HELP-MOD) — En curso
*   **Objetivo:** Prompt dispatcher conductual (multicanal 360) para mover a los usuarios a través del B=MAP ante eventos clave en tiempo real.
*   **Alineación (CEO Sinc):** El proyecto de ayuda contextual/guías de usuario por módulo (`PROD-HELP-MOD`) **debe alinearse y unirse directamente con el proyecto de la Biblia de AI / Help Center (SAC)** para que no se traslapen los contenidos ni se duplique la carga cognitiva de widgets flotantes in-app.
*   **Próximos Pasos:** Presentar el prototipo de WhatsApp a María Ossa y estructurar el motor de prompts transversal antes del Q4 (Eje de Retención).

### 4. Refactor Dropify — Cierre de Legado (PROD-1667 / PRM-1239) — En curso
*   **Objetivo:** Reconstrucción de la aplicación de Shopify para paridad funcional bajo arquitectura "Built for Shopify" y migración de WooCommerce a React.
*   **Estado:** WooCommerce en desarrollo (entrega 4-ago). Shopify en QA (`PROD-580`).
*   **Próximos Pasos (CEO Sinc):**
    1.  **Optimizar la página de descripción de Dropify** en la tienda de aplicaciones en conjunto con el equipo de **Growth**.
    2.  Verificar y asegurar que tengamos una funcionalidad simple de **sincronización de productos ya creados en Shopify con Dropi** (importación/mapeo directo facilitado).

### 5. Gestión de Órdenes del Seller (Epic PROD-1729) — Por iniciar
*   **Alcance:** Carga masiva de órdenes compuestas (`PROD-1707`) y evidencias en Torre Logística (`PROD-1706`).
*   **Estado:** En backlog (prioridad Medium, asignado a Santiago Herrera).

---

## 🔬 Experimentos y Descubrimientos Activos

### 6. Experimento de Activación Neta (TTV) (PROD-1478) — En Planificación
*   **Baseline & Metas:** TTV Neto actual = **16.0 días** $\to$ Meta del Piloto = **< 12.0 días**.
*   **Estado:** Bloqueado temporalmente por desalineación de IDs en UserPilot.

### 7. Huella Digital 3.0 (PROD-1546) — En Planificación
*   **Fuga en Embudo:** Registro a Onboarding = 11.9% (tienda) y 0% (wallet).
*   **Estado:** En planificación. Alejandra Melo diseña flujos simplificados de wallet en Figma.

### 8. Simplificación de Muestras & Rediseño de Botones (PROD-MUESTRA-SIMP) — En curso
*   **Objetivo:** Autofill de dirección 1-clic y jerarquización de botones de ficha de producto.
*   **Estado:** En diseño de UI por Alejandra Melo.

### 9. Enrutamiento Dinámico (Second Best - PROD-SEC-BEST) — En Discovery
*   **Objetivo:** Redirección a proveedor de respaldo ante stockouts para retener margen y GMV.
*   **Alineación (CEO Sinc):** Conectar la investigación y el flujo del prototipo de guerrilla con la **idea previa de órdenes automatizadas** para reutilizar la lógica de desvío automático.
*   **Estado:** Alejandra Melo realiza guerrilla testing con 5 dropshippers del Pareto usando el mock interactivo.

### 10. Buzón Feedback Darwin (PROD-FEEDBACK) — En Discovery
*   **Objetivo:** Captura transversal de feedback en todos los módulos (checkout, catálogo, wallet) para alimentar las decisiones estratégicas de Darwin.
*   **Alineación (CEO Sinc):** No desarrollar este buzón desde cero. **Debe alinearse con la iniciativa que ya está haciendo el equipo de Experience** (ya se tenía un proyecto anterior y existe un diseño definitivo para este botón). El objetivo es integrarlo y desplegarlo de forma transversal en toda la plataforma.
*   **Estado:** En backlog conceptual.

### 11. Biblia de AI / Proyecto Help Center (SAC) — Planificado
*   **Alineación:** Integrar con la ayuda contextual (`PROD-HELP-MOD`) para centralizar la entrega de guías automatizadas de soporte técnico.

---

## 📋 Proyectos Nuevos y Oportunidades (CEO Sinc - Julio 2026)

### 12. Proyecto Affiliated / Seller Success
*   **Alcance:** Consolidar el stack de captación y herramientas de afiliados.
*   **Estado:** Contamos con las integraciones de **Shopify** y **Minea** activas.
*   **En cola de desarrollo:** Integraciones de **Meta** y **TikTok**.

### 13. Investigación de Nuevas Oportunidades & Competencia
*   **Alineaciones clave:**
    1.  **Herramienta Comercial:** Unificar las herramientas de discovery e insights de producto con la herramienta del equipo comercial general de Dropi.
    2.  **Seguimiento de Competencia:** Implementar dashboards de benchmarking y competitor tracking estructurados.
    3.  **Proyecto Sherlock:** Unificar el módulo Sherlock (asistente de novedades) con la gestión de atención en grupos de WhatsApp de **Laura Contreras**, definiendo claramente a quién se asigna la operación y el dueño del canal.

### 14. Programa Leyendas Dropi (Eje Transversal)
*   **Objetivo:** Mapear y coordinar cómo se une Leyendas con todas las verticales de Darwin (onboarding, Dropify, Page Pilot y notificaciones) para que actúe como el eje unificado de retención, gamificación y fidelización de sellers y líderes de comunidad.
*   **Documento de referencia:** [contexto_leyendas_dropi.md](file:///Users/santiago.herrera/Downloads/dropi-agente-pm/agente-delivery/context/approved/contexto_leyendas_dropi.md).

---

## 📋 Proyectos del Roadmap (Por iniciar)

### 15. [RETENCIÓN] Instrumentar Capa 1.5: inversión y hábito post-venta (Epic PROD-1665) — Planificado
### 16. [DISCOVERY Q4] Diagnóstico de churn y palancas de retención (Epic PROD-1666) — Planificado
### 17. Solicitud de Funciones / Feedback Interno (PROD-FEEDBACK) — Planificado (Q4)
*   **Objetivo:** Buzón interactivo privado e integrado in-app para capturar dolores de los usuarios de forma segura sin revelar información a la competencia.
*   **Próximos Pasos:** Alejandra Melo conceptualiza el diseño de interacción para Darwin.

---

## 📊 Diagnóstico de Conversaciones de SAC (Julio 2026)

*   **Preguntas analizadas:** **3.664** conversaciones de los últimos 30 días en 10 países.
*   **Fuente de datos:** Reporte operacional `ml_ia.patrones` (Generado 2026-07-15).

### Distribución por Categorías
1.  **Administrativa:** **1.202** preguntas (Consulta sobre estado de retiro: 120, estado de recarga: 120, problemas al intentar recargar wallet: 40).
2.  **Logística:** **1.140** preguntas (Solicitud de anulación de guía: 290, reportar órdenes en estado generado: 156, reportar órdenes sin guía/pendiente: 62).
3.  **Garantías:** **333** preguntas (Preguntas sobre garantías: 70, consulta estado de garantías: 46).
4.  **PQR:** **279** preguntas (Problemas con órdenes y guías: 20, problemas de comunicación con proveedores: 19).
5.  **Comercial:** **203** preguntas (Solicitar información sobre productos y/o proveedores: 70, interés en ofrecer productos: 40).
6.  **Desarrollo:** **117** preguntas (Problemas con plataforma: 20, ayuda de uso: 20, problemas de sincronización Shopify-Dropi: 10).
7.  **Sin Clasificar:** **390** preguntas.

### Hallazgo Principal y Top 4 de Consultas de Mayor Volumen
Las 4 preguntas más frecuentes son variantes del estado transaccional: **"¿En qué estado está mi X?"**
1.  **Solicitud de anulación de guía:** 290 menciones (6 países).
2.  **Reportar órdenes en estado generado:** 156 menciones (5 países).
3.  **Consulta sobre el estado de la recarga:** 120 menciones (5 países).
4.  **Consulta sobre el estado de un retiro:** 120 menciones (4 países).

**Aplicación Estratégica (Discovery & Research):** Este análisis opera como una **Base de Conocimiento (Knowledge Base)** transversal para alimentar y orientar múltiples iniciativas activas y futuras de la célula Darwin. Específicamente, estos hallazgos guiarán el discovery y research en:
1.  **Ayuda Contextual y FAQs por Módulo (PROD-HELP-MOD):** Mapear el Top de consultas específicas de cada categoría (Administrativa, Logística, Garantías, Comercial) para redactar e incorporar las FAQs exactas de resolución dentro de la ayuda contextual in-app de cada módulo de Dropi.
2.  **Alertas y Notificaciones Conductuales (PROD-1664):** Diseñar y refinar las notificaciones push/WhatsApp basadas en eventos clave de estado (recarga reflejada, retiro aprobado, retención de guía en estado generado) para atajar de forma proactiva la duda del seller antes de que vaya al SAC.
3.  **Wallet y Flujos Administrativos (Billetera):** Discovery de mejoras UX/UI en el flujo y estados de recargas y retiros in-app para reducir la incertidumbre del seller.
4.  **Logística:** Optimización de procesos de anulación de guías y flujo de órdenes en estado generado/pendiente.
5.  **Sherlock & Soporte (PROD-SHERLOCK-SAC):** Enriquecimiento de reglas de triaje automático y respuestas predictivas (NLP) para consultas de estado recurrentes.
