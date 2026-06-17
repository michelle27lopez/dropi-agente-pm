# Reporte de Proyectos y Memorias — Célula Supplier Success
Este reporte consolida la información activa en Supabase (proyectos, OKRs, compromisos, riesgos, decisiones y estado de memorias) para planificar los avances de la semana.

## Resumen de Proyectos

| Proyecto | Estado | Owner | Resumen |
|---|---|---|---|
| **Inteligencia / Data de Catálogo** | `Discovery` | Jaime Guevara | Investigación manual de los 67 suppliers de mayor rendimiento en Dropi. Objetivo: identificar patrones de catálogo que expliquen la productividad (órdenes/producto). Metodología: pantallazos de perfil + catálogo + detalle producto a producto. Avance: 5 investigados, 1 excluido (marca). Hallazgos iniciales: especialización > tamaño, operación confiable compensa ficha débil, catálogo privado puede ser gap crítico, JSON roto es issue de plataforma (HTML→texto plano). Ángulo de producto validado con jefe: no mostrar top sellers (canibaliza mercado) — encontrar productos ganadores sin movimiento con señal de mercado. |
| **Cellboard** | `Discovery` | Jaime Guevara | Visión de producto para organizar la conversación de la célula Supplier Success alrededor de activación de suppliers, salud de catálogo, catálogo trend, combos y métricas reales de crecimiento. |
| **Supplier Data & Dashboard** | `Discovery` | Jaime Guevara | Levantamiento de data estructurada de suppliers (cuantitativa y cualitativa) para construir un dashboard centralizado que facilite la toma de decisiones basada en puntos de dolor. |
| **Outcome Signal** | `Discovery` | Jaime Guevara | Módulo de medición de efectividad de proyectos implementados. Conecta fuentes de comportamiento de usuario como (UserPilot) para evaluar si los proyectos lograron adopción, conversión y los outcomes esperados. |
| **Dinámicas de Catálogo** | `Discovery` | Jaime Guevara | Macroproyecto que agrupa las dinámicas comerciales del catálogo Dropi. Objetivo: pasar de un catálogo estático a uno accionable donde suppliers y dropshippers participen en dinámicas como combos, campañas, descuentos y negociaciones para mover más ventas. Sub-proyectos: Combos (COM-001, ya en proceso), Catálogo Preseleccionado (DCA-001), Dinámicas de Descuentos (DCA-002), Negociaciones Supplier-Dropshipper (DCA-003). |
| **Supplier Journey Mapping & Activation Lab** | `Discovery` | Jaime Guevara | Levantar, documentar y analizar en profundidad el journey real que vive un supplier dentro de Dropi, desde su registro inicial hasta su activación operativa y comercial dentro de la plataforma. |
| **Dinámicas de Descuentos** | `Discovery` | Jaime Guevara | Discovery para entender cómo deben funcionar descuentos, promociones y reglas comerciales en Dropi. Casos: remates, descuentos por volumen, liquidación, campañas, Black Friday, mover stock quieto. Sub-proyecto de DCA-000 Dinámicas de Catálogo. |
| **Chip del Proveedor** | `In Progress` | Jaime Guevara | Mejora del perfil del proveedor: nuevos campos y enriquecimiento de datos para dar más contexto a dropshippers. Handoff de diseño completado con Alejandra. Pendiente: levantar campos adicionales y entregar historias a tech para pasar a desarrollo. |
| **Catálogo Preseleccionado** | `Discovery` | Jaime Guevara | Discovery y AS-IS completados (2026-05-26). Pendiente: entrevistas con suppliers para cerrar investigación. Una vez cerradas, presentar a la célula para co-construcción. Producto ya tiene propuesta inicial — se busca complementar y validar con el equipo antes de definir alcance. |
| **Panel de indicadores / métricas de proveedores** | `In Progress` | Jaime Guevara | Dashboard centralizado de métricas de proveedores en estabilización. Adopción en declive; se enviará experimento desde UserPilot para motivar a proveedores a revisar su panel y postularse para ascenso. |
| **Negociaciones Supplier-Dropshipper** | `Discovery` | Jaime Guevara | Discovery completo para entender si Dropi debe habilitar una dinámica de negociación entre suppliers y dropshippers. Esta semana se inició trabajo con Michelle en la contextualización y flujo end-to-end, con meta de pasar a desarrollo la próxima semana. |
| **Negociaciones** | `Lanzamiento` | Jaime Guevara | Liberado a producción. Bug crítico: no visible para proveedores (redirecciona a Home y desaparece). La líder de comunidades requiere data puntual de negociaciones para arqueos (se extraerá a Excel vía Miguel/José temporalmente para evitar desarrollo). José canceló seguimiento de hoy. |
| **Combos** | `In Progress` | Jaime Guevara | José Giraldo no asistió a la sync; nueva fecha estimada al 30 de junio de 2026, con alta incertidumbre por falta de respuestas. El MVP incluye CAS y ECOM. |
| **Time to Value** | `In Progress` | Jaime Guevara | TOBE completo definido. Foco: maximizar tiempos de registro/activación. Comercial y Operaciones presentaron plan de implementación de pipeline (estimado 1 semana para arrancar y medir). |
| **Conexión Chateapro** | `Discovery` | Jaime Guevara | Integración entre Dropi y Chateapro (app del holding para vender productos por WhatsApp vía agentes IA). Fase 1: token de autenticación para validar proveedores de forma segura + sincronización de stock por ID de producto Dropi. Fase futura: coronita azul en catálogo Dropi para productos con prompt optimizado en Chateapro. |
| **Combos Dropshipper** | `Discovery` | Jaime Guevara | Habilitar que el dropshipper pueda crear sus propios combos. Esta semana se inició trabajo con Michelle en la contextualización y flujo end-to-end, con meta de pasar a desarrollo la próxima semana. |
| **Facturación Dropshipper - Suppliers** | `Terminado` | Jaime Guevara | Entregado. José informó que el proyecto ya se entregó. Se marca como terminado y sale de actualizaciones activas. |

---

## Inteligencia / Data de Catálogo (Estado: `Discovery`) 
*Investigación manual de los 67 suppliers de mayor rendimiento en Dropi. Objetivo: identificar patrones de catálogo que expliquen la productividad (órdenes/producto). Metodología: pantallazos de perfil + catálogo + detalle producto a producto. Avance: 5 investigados, 1 excluido (marca). Hallazgos iniciales: especialización > tamaño, operación confiable compensa ficha débil, catálogo privado puede ser gap crítico, JSON roto es issue de plataforma (HTML→texto plano). Ángulo de producto validado con jefe: no mostrar top sellers (canibaliza mercado) — encontrar productos ganadores sin movimiento con señal de mercado.*

### Compromisos Pendientes (Followups)
- `[Open]` **Mapear data disponible del catálogo** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Entrega de Dataset de 3 Insights Iniciales (Miguel)** — Responsable: *Miguel* (Límite: 2026-06-05T18:00:00+00:00)
- `[Open]` **Agregar paso de contacto a supplier a la metodología** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Pedir top productos vendidos por semana a Miguel** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Recibir transcripciones de entrevistas de dropshippers (Maria)** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Agregar catálogo privado al data request** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Evaluar proyecto de categorización de productos Dropi** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Data del catálogo dispersa o no estructurada** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Comenzar mapeando qué data existe, dónde está y qué calidad tiene antes de analizar
- `[Open]` **Contaminación de categorías por sobreclasificación** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Revisar API de clasificación sugerida por Juandi o definir reglas de limpieza de categorías.

### Decisiones Oficiales
- **Priorización de 3 Insights Iniciales para Data Intelligence (Pulso Vivo)**: Se seleccionan 3 insights prioritarios de los 20 definidos para la primera entrega de datos: (1) Públicos vs Privados, (2) Categorías, (3) Alto Movimiento / Bajo Stock. Se excluyen marcas, se filtra por país y se segmenta por dropshippers de comunidad vs huérfanos. — *Razón:* Empezar pequeño, validar valor comercial de forma ágil y luego escalar a más insights.

### Estado de Memoria y Contexto
**Contexto Aprobado (3 items):**
- `[Aprobado]` **Contexto — Inteligencia / Data de Catálogo** (Business Context) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Estado deseado — Inteligencia / Data de Catálogo** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Qué analizar — Inteligencia / Data de Catálogo** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

---

## Cellboard (Estado: `Discovery`) 
*Visión de producto para organizar la conversación de la célula Supplier Success alrededor de activación de suppliers, salud de catálogo, catálogo trend, combos y métricas reales de crecimiento.*

### Compromisos Pendientes (Followups)
- `[Open]` **Documentar necesidades de relación célula-tecnología (Carta a Eduardo Pachón)** — Responsable: *Jaime Guevara* (Límite: 2026-05-25T00:00:00+00:00)

### Decisiones Oficiales
- **Definición de Ownerships de Catálogo (Suppliers) y Orden (Logistics)**: Se estableció que la Célula de Suppliers (Jaime) es dueña absoluta del Producto y del Catálogo (combos, búsquedas, recomendaciones), y la Célula de Logistics (Juan Diego) es dueña de la Orden (devoluciones, fletes, novedades). — *Razón:* Evitar duplicidades y reprocesos entre células al delimitar la responsabilidad del producto vs la orden.
- **Separación de espacios estratégico y operativo en células**: Se acuerda separar el seguimiento semanal de tareas de desarrollo del espacio de la célula. La célula será para negocio y oportunidades, y el seguimiento técnico irá en reuniones operativas separadas de 10-15 minutos. — *Razón:* Mejorar la dinamización de stakeholders no técnicos y enfocar las células en la estrategia de OKRs.

### Estado de Memoria y Contexto
- *No hay contexto aprobado oficial aún.*

---

## Supplier Data & Dashboard (Estado: `Discovery`) 
*Levantamiento de data estructurada de suppliers (cuantitativa y cualitativa) para construir un dashboard centralizado que facilite la toma de decisiones basada en puntos de dolor.*

### Estado de Memoria y Contexto
- *No hay contexto aprobado oficial aún.*

**Borradores / Memorias en Progreso (1 items):**
- `[Draft]` **AS-IS v1 — Dominio supplier: activación, dimensiones estratégicas y vacíos de datos (María/Jaime 2026-05-06)** (ASIS)

---

## Outcome Signal (Estado: `Discovery`) 
*Módulo de medición de efectividad de proyectos implementados. Conecta fuentes de comportamiento de usuario como (UserPilot) para evaluar si los proyectos lograron adopción, conversión y los outcomes esperados.*

### Estado de Memoria y Contexto
**Contexto Aprobado (1 items):**
- `[Aprobado]` **AS-IS v1 — Proceso de medición de efectividad de features (Michelle/Jaime)** (ASIS) — Versión: 1, Actualizado: 2026-05-06T14:48:52+00:00

**Borradores / Memorias en Progreso (2 items):**
- `[Draft]` **AS-IS v1 — Proceso actual de medición de efectividad (Michelle/Jaime 2026-05-06)** (ASIS)
- `[Draft]` **AS-IS v2 — Detalle completo proceso medición efectividad (Michelle/Jaime 2026-05-06)** (ASIS)

---

## Dinámicas de Catálogo (Estado: `Discovery`) 
*Macroproyecto que agrupa las dinámicas comerciales del catálogo Dropi. Objetivo: pasar de un catálogo estático a uno accionable donde suppliers y dropshippers participen en dinámicas como combos, campañas, descuentos y negociaciones para mover más ventas. Sub-proyectos: Combos (COM-001, ya en proceso), Catálogo Preseleccionado (DCA-001), Dinámicas de Descuentos (DCA-002), Negociaciones Supplier-Dropshipper (DCA-003).*

### Compromisos Pendientes (Followups)
- `[Open]` **Priorizar Combos como primer sub-proyecto activo del macroproyecto** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Juan Diego — recuperar métricas del ejercicio Black Week** — Responsable: *Juan Diego Bautista Vasquez* (Límite: Sin fecha)

### Estado de Memoria y Contexto
**Contexto Aprobado (2 items):**
- `[Aprobado]` **Contexto — Dinámicas de Catálogo** (Business Context) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Estado deseado — Dinámicas de Catálogo** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

---

## Supplier Journey Mapping & Activation Lab (Estado: `Discovery`) 
*Levantar, documentar y analizar en profundidad el journey real que vive un supplier dentro de Dropi, desde su registro inicial hasta su activación operativa y comercial dentro de la plataforma.*

### Estado de Memoria y Contexto
**Contexto Aprobado (1 items):**
- `[Aprobado]` **Contexto Inicial: Supplier Journey** (Definition) — Versión: 1, Actualizado: 2026-05-08T14:32:19.176022+00:00

---

## Dinámicas de Descuentos (Estado: `Discovery`) 
*Discovery para entender cómo deben funcionar descuentos, promociones y reglas comerciales en Dropi. Casos: remates, descuentos por volumen, liquidación, campañas, Black Friday, mover stock quieto. Sub-proyecto de DCA-000 Dinámicas de Catálogo.*

### Compromisos Pendientes (Followups)
- `[Open]` **Iniciar discovery de Dinámicas de Descuentos** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Devaluación del catálogo por descuentos mal diseñados** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Definir en el discovery las reglas de negocio y quién absorbe el descuento antes de construir

### Estado de Memoria y Contexto
**Contexto Aprobado (6 items):**
- `[Aprobado]` **Estado deseado — Dinámicas de Descuentos** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Contexto — Dinámicas de Descuentos** (Business Context) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Preguntas de discovery — Dinámicas de Descuentos** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 1 — AS-IS · HUs DD-01 a DD-03** (ASIS) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 2 — Discovery · HUs DD-04 a DD-08** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 3 — TOBE · HUs DD-09 a DD-12** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

---

## Chip del Proveedor (Estado: `In Progress`) 
*Mejora del perfil del proveedor: nuevos campos y enriquecimiento de datos para dar más contexto a dropshippers. Handoff de diseño completado con Alejandra. Pendiente: levantar campos adicionales y entregar historias a tech para pasar a desarrollo.*

### Estado de Memoria y Contexto
- *No hay contexto aprobado oficial aún.*

---

## Catálogo Preseleccionado (Estado: `Discovery`) 
*Discovery y AS-IS completados (2026-05-26). Pendiente: entrevistas con suppliers para cerrar investigación. Una vez cerradas, presentar a la célula para co-construcción. Producto ya tiene propuesta inicial — se busca complementar y validar con el equipo antes de definir alcance.*

### Compromisos Pendientes (Followups)
- `[Open]` **Iniciar discovery de Catálogo Preseleccionado** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Proceso de curación no escalable** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Definir en el discovery quién es el dueño del proceso y qué puede automatizarse

### Estado de Memoria y Contexto
**Contexto Aprobado (6 items):**
- `[Aprobado]` **Preguntas de discovery — Catálogo Preseleccionado** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Contexto — Catálogo Preseleccionado** (Business Context) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Estado deseado — Catálogo Preseleccionado** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 1 — AS-IS · HUs CP-01 a CP-03** (ASIS) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 2 — Discovery · HUs CP-04 a CP-07** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 3 — TOBE · HUs CP-08 a CP-11** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

**Borradores / Memorias en Progreso (7 items):**
- `[Approved Candidate]` **Épica DCA-001-EXP — Experimento lean de catálogo preseleccionado antes de desarrollar** (Epica)
- `[Approved Candidate]` **CEX-01 — Definición del experimento de catálogo preseleccionado** (HU)
- `[Approved Candidate]` **CEX-02 — Semana 0: arranque y lanzamiento de la primera campaña** (HU)
- `[Approved Candidate]` **CEX-03 — Campaña 1: ejecución + primera revisión de resultados** (HU)
- `[Approved Candidate]` **CEX-04 — Campaña 2: iteración con base en resultados de campaña 1** (HU)
- `[Approved Candidate]` **CEX-05 — Campaña 3: evaluación de tracción del experimento** (HU)
- `[Approved Candidate]` **CEX-06 — Cierre y decisión de escala del experimento** (HU)

---

## Panel de indicadores / métricas de proveedores (Estado: `In Progress`) 
*Dashboard centralizado de métricas de proveedores en estabilización. **La adopción del panel ha ido en declive**, por lo cual se implementará un experimento desde UserPilot para motivar a los proveedores a revisar su desempeño y postularse para subir de nivel (ascenso a verificado). Datos de postulaciones en CRM: 178 total, 132 nuevas, 38 negadas, 8 aprobadas.*

### Compromisos Pendientes (Followups)
- `[Open]` **Solicitar y obtener acceso al CRM** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Validar datos de postulaciones en CRM** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Documentar diferencia entre tipos de verificación y categoría** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Validar confiabilidad entre CRM, UserPilot y dashboard** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Revisar adopción real del panel** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Validar segmentación por país en el panel** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Confirmar estado de solución precalculada para badge en detalle de producto** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Definir cierre o continuidad del proyecto** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Performance en badge por producto** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Confirmar con el equipo técnico si el cálculo nocturno fue implementado. Si no, crear historia para construirlo antes de reactivar el componente.
- `[Open]` **Inconsistencia entre fuentes de datos** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Mapear qué mide cada herramienta para los mismos eventos. Documentar diferencias y definir fuente única de verdad por métrica.

### Decisiones Oficiales
- **Solución de performance para badge en detalle de producto: cálculo nocturno**: Se decidió reemplazar el cálculo en tiempo real de la métrica/badge del proveedor en el detalle de producto por un proceso nocturno o precalculado. La razón es que el enfoque original generaba una consulta de métricas por cada carga de producto, lo que con el volumen de Dropi representa un riesgo real de degradación o caída del servicio en producción. Beta no replica el volumen de producción, por lo que este tipo de problemas puede no detectarse hasta el lanzamiento. La decisión es construir o validar un job nocturno que precalcule las métricas del proveedor y las almacene para ser consultadas sin costo computacional adicional. — *Razón:* Decisión identificada durante análisis de contexto del proyecto IND-001 — aprobada por Jaime Guevara el 2026-05-11.
- **Los tres conceptos de clasificación de proveedores son distintos y no deben mezclarse**: Se identifica que en reportes y conversaciones se mezclan tres conceptos con significados distintos: (1) Verificación para operar/publicar: requisito base para que un proveedor esté activo en la plataforma. (2) Proveedor verificado con insignia: distinción visible para dropshippers que implica postulación y aprobación; es la insignia de confianza. (3) Proveedor premium: categoría superior con criterios y flujo propios. Mezclar estos conceptos en métricas o reportes genera confusión y decisiones incorrectas. Se debe documentar formalmente en Jira y asegurarse de que cada herramienta (CRM, dashboard, UserPilot) los identifique por separado. — *Razón:* Decisión identificada durante análisis de contexto del proyecto IND-001 — aprobada por Jaime Guevara el 2026-05-11.

### Estado de Memoria y Contexto
**Contexto Aprobado (9 items):**
- `[Aprobado]` **Contexto de negocio — Panel de indicadores** (Business Context) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Estado actual — Panel de indicadores** (ASIS) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Estado deseado — Panel de indicadores** (TOBE) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Solución de performance para badge en detalle de producto: cálculo nocturno** (Decision) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Los tres conceptos de clasificación de proveedores son distintos y no deben mezclarse** (Decision) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿El cálculo nocturno para el badge fue implementado o está pendiente?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿CRM, UserPilot y dashboard miden los mismos eventos con los mismos criterios?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Los datos de postulaciones del CRM son globales o solo de Colombia?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Resumen ejecutivo — Panel de indicadores (estado al 2026-05-11)** (Summary) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00

**Borradores / Memorias en Progreso (9 items):**
- `[Approved Candidate]` **Estado actual — Panel de indicadores** (ASIS)
- `[Approved Candidate]` **Estado deseado — Panel de indicadores** (TOBE)
- `[Approved Candidate]` **Solución de performance para badge en detalle de producto: cálculo nocturno** (Decision)
- `[Approved Candidate]` **Los tres conceptos de clasificación de proveedores son distintos y no deben mezclarse** (Decision)
- `[Approved Candidate]` **¿El cálculo nocturno para el badge fue implementado o está pendiente?** (Open Question)
- `[Approved Candidate]` **¿CRM, UserPilot y dashboard miden los mismos eventos con los mismos criterios?** (Open Question)
- `[Approved Candidate]` **¿Los datos de postulaciones del CRM son globales o solo de Colombia?** (Open Question)
- `[Approved Candidate]` **Resumen ejecutivo — Panel de indicadores (estado al 2026-05-11)** (Summary)
- `[Approved Candidate]` **Contexto de negocio — Panel de indicadores** (Business Context)

---

## Negociaciones Supplier-Dropshipper (Estado: `Discovery`) 
*Discovery completo para entender si Dropi debe habilitar una dinámica de negociación directa entre suppliers y dropshippers. **Esta semana iniciamos trabajo con Michelle en la contextualización y flujo end-to-end**, con la meta de finalizar la definición para pasar a desarrollo la próxima semana.*

### Compromisos Pendientes (Followups)
- `[Open]` **Iniciar discovery completo de Negociaciones Supplier-Dropshipper** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Inequidad entre dropshippers por negociaciones privadas** (Impacto: `High`, Probabilidad: `High`) — *Mitigación:* Definir en el discovery si las condiciones son públicas o privadas y cómo se auditan

### Estado de Memoria y Contexto
**Contexto Aprobado (6 items):**
- `[Aprobado]` **Contexto — Negociaciones Supplier-Dropshipper** (Business Context) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Estado deseado — Negociaciones Supplier-Dropshipper** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Preguntas de discovery — Negociaciones Supplier-Dropshipper** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 1 — AS-IS · HUs NS-01 a NS-03** (ASIS) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 2 — Discovery · HUs NS-04 a NS-09** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica 3 — TOBE · HUs NS-10 a NS-13** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

**Borradores / Memorias en Progreso (3 items):**
- `[Approved Candidate]` **Épica DCA-003-E1 — Negociaciones entre suppliers y dropshippers para habilitar condiciones comerciales diferenciadas** (Epica)
- `[Approved Candidate]` **NS-01 — Discovery / AS-IS: cómo ocurren hoy las negociaciones entre suppliers y dropshippers** (HU)
- `[Approved Candidate]` **NS-02 — TOBE: diseño de la dinámica de negociación supplier-dropshipper** (HU)

---

## Negociaciones (Estado: `Lanzamiento`) 
*Liberado a producción el 2026-05-27. **Alerta de bug crítico:** Actualmente el módulo no se está visualizando correctamente para proveedores (al hacer clic redirige a Home y desaparece del menú). Adicionalmente, tras reunión con la líder de comunidades, se identificó la necesidad de contar con data de las negociaciones para hacer arqueos y seguimiento con los líderes. Se trabajará en conjunto con Miguel y José para extraer esta data a un Excel de forma temporal y evitar desarrollo. **José canceló la reunión de seguimiento de hoy.***

### Compromisos Pendientes (Followups)
- `[Open]` **Preparar comunicación de lanzamiento** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Reactivar lanzamiento del módulo** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Revisar dashboard y métricas post-lanzamiento** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Validar impacto funcional y técnico del ajuste de diseño** — Responsable: *Jaime Guevara + Tech* (Límite: Sin fecha)
- `[Open]` **Documentar ajuste final en Jira cuando esté definido el alcance** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

<details><summary><b>Compromisos Completados/Cancelados (11)</b></summary>

- `[Done]` **Obtener fecha compromiso de Legal** — Responsable: *Jaime Guevara*
- `[Done]` **Confirmar nombre exacto del documento requerido** — Responsable: *Jaime Guevara*
- `[Done]` **Escalar si Legal no responde en 48h** — Responsable: *Jaime Guevara*
- `[Done]` **Recibir documento final de T&Cs de Legal** — Responsable: *Jaime Guevara*
- `[Done]` **Validar que T&Cs queden correctamente cargados** — Responsable: *Jaime Guevara*
- `[Done]` **Escribir a Legal (Angélica) por el documento de T&Cs** — Responsable: *Jaime Guevara*
- `[Done]` **Revisar documento de T&Cs para identificar impactos en textos, reglas o validaciones** — Responsable: *Jaime Guevara*
- `[Done]` **Crear historia [Frontend] DROPI: Incorporar texto T&Cs en modal de aprobación de negociación** — Responsable: *Jaime Guevara*
- `[Done]` **Coordinar con Aleja ajuste mínimo en diseño para aceptación del líder de comunidad** — Responsable: *Jaime Guevara + Aleja*
- `[Done]` **Crear historia [Backend] DROPI: Registrar aceptación de T&Cs por líder de comunidad al aprobar negociación** — Responsable: *Jaime Guevara*
- `[Done]` **Jaime pasa documento TYC a José — esperar confirmación para despliegue** — Responsable: *Jaime Guevara*

</details>

### Riesgos Activos
- `[Open]` **Bloqueo legal prolongado sin fecha compromiso** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Contactar a Angélica con urgencia, confirmar nombre del documento y obtener fecha compromiso. Si no hay respuesta en 48h, escalar con el responsable del área legal.
- `[Mitigated]` **Reproceso en diseño por ajuste de aceptación del líder de comunidad** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Coordinar con Aleja la solución más liviana posible (modal adicional, validación inline, etc.) para no rehacer el flujo completo. Definir alcance antes de comprometer tiempo de diseño.

### Decisiones Oficiales
- **Se requiere aceptación de T&Cs por parte del líder de comunidad, además del supplier**: Durante la reunión con Legal del 2026-05-12 se identificó que el flujo de aceptación de Términos y Condiciones no aplica solo al proveedor/supplier. También debe incluirse una validación de aceptación por parte del líder de comunidad que participa en la negociación. Este ajuste no estaba contemplado en el diseño actual, que ya está desarrollado, por lo que puede generar reproceso. La decisión es incorporar esta validación de la forma más liviana posible para no rehacer el flujo completo. La definición del ajuste mínimo se coordina con Aleja (diseño). — *Razón:* Identificado en reunión con Legal del 2026-05-12. El flujo original solo contemplaba aceptación del supplier. Legal confirmó que también se requiere aceptación del líder de comunidad.
- **Aceptación de T&Cs incorporada en modales de aprobación existentes — sin nuevo paso en el flujo**: El ajuste de diseño para la aceptación de Términos y Condiciones fue resuelto de forma minimalista: el texto de aceptación se incorpora dentro de las modales de aprobación de la negociación que ya existen en el flujo actual. No se crea una nueva pantalla ni un paso adicional. Las modales pueden abrirse desde dos puntos: (1) desde la card de la negociación y (2) desde el detalle de la negociación. El texto definido es: 'Puedes cancelarla más adelante si es necesario. Al hacer click en aprobar estás aceptando los términos y condiciones.' Esta solución cubre el requisito legal sin rediseñar el flujo ni generar reproceso significativo. — *Razón:* Solución minimalista validada con Aleja (diseño). Evita reproceso al reutilizar modales existentes.
- **El módulo fue retirado temporalmente hasta resolver el pendiente legal de T&Cs**: Se tomó la decisión de retirar o desactivar el módulo de Negociaciones después de una semana visible en la plataforma al identificar que faltaba el documento legal de Términos y Condiciones. La razón es que lanzar sin ese documento representa un riesgo legal para Dropi. El módulo permanece técnicamente completo pero inactivo hasta que Legal entregue el documento, sea cargado correctamente, y se confirme que el lanzamiento puede proceder sin riesgo. — *Razón:* Riesgo legal para Dropi si se lanza sin T&Cs aprobados. Se prioriza cumplimiento legal sobre velocidad de lanzamiento.
- **Reactivación del módulo de Negociaciones tras integración de T&Cs**: El módulo de Negociaciones puede reactivarse formalmente en producción ya que el documento final de Términos y Condiciones fue recibido e integrado en el flujo de manera exitosa. — *Razón:* El área de Legal entregó el documento de Términos y Condiciones y este fue cargado y validado en la plataforma por Jaime y José.

### Estado de Memoria y Contexto
**Contexto Aprobado (14 items):**
- `[Aprobado]` **Contexto de negocio — Negociaciones** (Business Context) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Estado actual — Negociaciones** (ASIS) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Estado deseado — Negociaciones** (TOBE) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Cuál es el nombre exacto del documento que debe entregar Legal?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Cuál es la fecha compromiso de Legal para entregar el documento de T&Cs?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Resumen ejecutivo — Negociaciones (estado al 2026-05-11)** (Summary) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Cuál es el ajuste mínimo de diseño para incluir la aceptación del líder de comunidad?** (Open Question) — Versión: 2, Actualizado: 2026-05-12T20:00:00+00:00
- `[Aprobado]` **¿El documento de T&Cs genera impactos en textos, reglas o validaciones del flujo actual?** (Open Question) — Versión: 2, Actualizado: 2026-05-12T20:00:00+00:00
- `[Aprobado]` **Update Negociaciones — reunión con Legal 2026-05-12** (Summary) — Versión: 2, Actualizado: 2026-05-12T20:00:00+00:00
- `[Aprobado]` **Update Negociaciones — diseño de ajuste T&Cs entregado (2026-05-12)** (Summary) — Versión: 3, Actualizado: 2026-05-12T00:00:00+00:00
- `[Aprobado]` **Aceptación de T&Cs incorporada en modales de aprobación existentes — sin nuevo paso en el flujo** (Decision) — Versión: 3, Actualizado: 2026-05-12T00:00:00+00:00
- `[Aprobado]` **El módulo fue retirado temporalmente hasta resolver el pendiente legal de T&Cs** (Decision) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Se requiere aceptación de T&Cs por parte del líder de comunidad, además del supplier** (Decision) — Versión: 2, Actualizado: 2026-05-12T20:00:00+00:00
- `[Aprobado]` **Reactivación del módulo de Negociaciones tras integración de T&Cs** (Decision) — Versión: 4, Actualizado: 2026-06-05T16:21:21+00:00

**Borradores / Memorias en Progreso (13 items):**
- `[Approved Candidate]` **Contexto de negocio — Negociaciones** (Business Context)
- `[Approved Candidate]` **Estado actual — Negociaciones** (ASIS)
- `[Approved Candidate]` **Estado deseado — Negociaciones** (TOBE)
- `[Approved Candidate]` **El módulo fue retirado temporalmente hasta resolver el pendiente legal de T&Cs** (Decision)
- `[Approved Candidate]` **¿Cuál es el nombre exacto del documento que debe entregar Legal?** (Open Question)
- `[Approved Candidate]` **¿Cuál es la fecha compromiso de Legal para entregar el documento de T&Cs?** (Open Question)
- `[Approved Candidate]` **Resumen ejecutivo — Negociaciones (estado al 2026-05-11)** (Summary)
- `[Approved Candidate]` **Se requiere aceptación de T&Cs por parte del líder de comunidad, además del supplier** (Decision)
- `[Approved Candidate]` **¿Cuál es el ajuste mínimo de diseño para incluir la aceptación del líder de comunidad?** (Open Question)
- `[Approved Candidate]` **¿El documento de T&Cs genera impactos en textos, reglas o validaciones del flujo actual?** (Open Question)
- `[Approved Candidate]` **Update Negociaciones — reunión con Legal 2026-05-12** (Summary)
- `[Approved Candidate]` **Aceptación de T&Cs incorporada en modales de aprobación existentes — sin nuevo paso en el flujo** (Decision)
- `[Approved Candidate]` **Update Negociaciones — diseño de ajuste T&Cs entregado (2026-05-12)** (Summary)

---

## Combos (Estado: `In Progress`) 
*José Giraldo no ingresó a la sesión de seguimiento y no ha dado respuesta. La fecha estimada de entrega se mantiene para el **30 de junio de 2026**, sin embargo, existe alta incertidumbre y falta de visibilidad técnica. El MVP incluye CAS y ECOM.*

### Compromisos Pendientes (Followups)
- `[Open]` **Agendar sesión de validación end-to-end de Combos (60 min)** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Definir modelo técnico del combo: producto nuevo, agrupador virtual u orden compuesta** — Responsable: *Producto + Tech* (Límite: Sin fecha)
- `[Open]` **Actualizar blueprint con todos los actores y sistemas impactados** — Responsable: *Diseño + Producto* (Límite: Sin fecha)
- `[Open]` **Validar compatibilidad de combos con Shopify, Tienda Nube y Dropify** — Responsable: *Tech + Integraciones* (Límite: Sin fecha)
- `[Open]` **Completar historias de usuario para todos los actores** — Responsable: *Producto + PO* (Límite: Sin fecha)
- `[Open]` **Cerrar matriz de reglas de negocio del combo** — Responsable: *Producto + Negocio* (Límite: Sin fecha)
- `[Open]` **Definir plan de medición desde el primer release** — Responsable: *Producto + Data* (Límite: Sin fecha)
- `[In Progress]` **José revisa épicas y devuelve estimación técnica de Combos** — Responsable: *Jose Giraldo* (Límite: Sin fecha)
- `[In Progress]` **Aleja — prototipos rápidos combo en Shopify + detalle de orden** — Responsable: *Alejandra Melo* (Límite: Sin fecha)
- `[Open]` **Estimación de esfuerzo técnico de Combos Fase 2 (José Giraldo)** — Responsable: *José Giraldo* (Límite: Sin fecha)
- `[Open]` **Estimación de esfuerzo técnico de Combos Fase 2 (Juan Diego)** — Responsable: *Juan Diego* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Construir solo interfaz sin resolver la cadena operativa** (Impacto: `High`, Probabilidad: `High`) — *Mitigación:* Completar la definición end-to-end antes de escribir cualquier historia de desarrollo. Validar con sesión multidisciplinaria.
- `[Open]` **Romper integraciones con canales externos (Shopify, Tienda Nube, Dropify)** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Validar compatibilidad técnica con el equipo de Integraciones antes del desarrollo. Definir explícitamente qué canales son soportados en MVP.
- `[Open]` **Garantías no modeladas para productos agrupados en combo** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Definir explícitamente el modelo de garantía para MVP (recomendado: garantía por producto componente). Validar con Soporte, Legal y Producto.
- `[Open]` **Inconsistencia de stock: combo visible con componentes agotados** (Impacto: `High`, Probabilidad: `High`) — *Mitigación:* Definir y validar con Tech la lógica de stock del combo: disponibilidad = mínimo entre stocks de componentes. Implementar desactivación automática si un componente llega a cero.
- `[Open]` **Confusión del proveedor al recibir una orden con combo** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Definir antes de desarrollo cómo se representa una orden con combo en la vista del proveedor. Incluir historia de usuario explícita para el proveedor.
- `[Open]` **Mala medición: no se valida si combos realmente aumentan ticket promedio** (Impacto: `Medium`, Probabilidad: `Medium`) — *Mitigación:* Definir plan de medición antes del lanzamiento: GMV por combos, ticket promedio con/sin combo, conversión, tasa de reclamos. Configurar eventos desde el primer release.
- `[Open]` **Sincronización con Shopify bloqueada** (Impacto: `High`, Probabilidad: `High`) — *Mitigación:* José Giraldo se llevó las épicas para revisión. Estimación técnica pendiente. No lanzar Combos a usuarios hasta que este flujo esté validado.
- `[Open]` **Gestión masiva por CSV no disponible** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Incluir como parte de la estimación técnica con José. Definir si entra en Fase 1 o Fase 2.

### Decisiones Oficiales
- **El proyecto Combos no debe iniciar desarrollo hasta completar validación end-to-end**: El review de readiness concluye que el proyecto no está listo para desarrollo. La razón es que la definición actual solo cubre la experiencia del dropshipper pero no resuelve el comportamiento del combo en la cadena operativa completa: catálogo, proveedor, stock, precio, garantías, integraciones, órdenes, fulfillment y soporte. Pasar a desarrollo con esta definición incompleta genera riesgo de construir una interfaz funcional que falla en producción o que genera problemas operativos no contemplados. El estado correcto es mantenerlo en Definición hasta cerrar las preguntas críticas con una sesión de validación end-to-end. — *Razón:* Identificada en review de readiness del 2026-05-11. Aprobada por Jaime Guevara.
- **MVP de Combos: solo productos del mismo proveedor, sin multiproveedor**: Para el MVP se recomienda restricción explícita: un combo solo puede contener productos del mismo proveedor. Esto elimina la complejidad de: múltiples proveedores en una orden, múltiples guías de despacho, coordinación de stock entre proveedores distintos, y reglas de garantía cruzadas. Esta restricción reduce significativamente el riesgo operativo y técnico del primer release y permite validar el comportamiento del combo antes de ampliar a casos más complejos. — *Razón:* Identificada en review de readiness del 2026-05-11. Aprobada por Jaime Guevara.
- **Garantía del combo: debe heredarse por producto componente (no por combo completo)**: Para el MVP, la garantía de un combo debe asociarse a cada producto componente individualmente, no al combo como unidad. Esto permite gestionar reclamos, devoluciones o garantías parciales sin crear un nuevo modelo de garantía. Es el enfoque más simple y operativamente seguro para el primer release. Si se requiere una garantía especial por combo (por ejemplo, combos oficiales del proveedor), debe planificarse como una iteración posterior con validación específica de negocio, soporte y legal. — *Razón:* Identificada en review de readiness del 2026-05-11. Aprobada por Jaime Guevara.

### Estado de Memoria y Contexto
**Contexto Aprobado (17 items):**
- `[Aprobado]` **¿Cómo recibe el proveedor una orden con combo y cómo la despacha?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Contexto de negocio — Combos** (Business Context) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Estado actual — Combos** (ASIS) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Estado deseado — Combos** (TOBE) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **El proyecto Combos no debe iniciar desarrollo hasta completar validación end-to-end** (Decision) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **MVP de Combos: solo productos del mismo proveedor, sin multiproveedor** (Decision) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Garantía del combo: debe heredarse por producto componente (no por combo completo)** (Decision) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Un combo es un producto nuevo, un agrupador virtual o una orden compuesta?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Quién puede crear combos: proveedor, dropshipper o ambos?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Cómo se calcula el stock del combo y qué pasa cuando un componente se agota?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Cómo se publica y sincroniza el combo en Shopify, Tienda Nube y Dropify?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Quién define el precio del combo y quién asume el descuento?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **¿Cómo se gestionan devoluciones, cancelaciones parciales y soporte en órdenes con combo?** (Open Question) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Resumen ejecutivo — Review de readiness Combos (2026-05-11)** (Summary) — Versión: 1, Actualizado: 2026-05-11T20:00:00+00:00
- `[Aprobado]` **Definition · Proyecto Combos** (Definition) — Versión: 1, Actualizado: 2026-05-15T15:31:53.243848+00:00
- `[Aprobado]` **Épica Diseño — Dropify · HUs CD-01 a CD-04** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Épica Diseño — Carga Masiva · HUs CM-01 a CM-04** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

**Borradores / Memorias en Progreso (15 items):**
- `[Approved Candidate]` **Contexto de negocio — Combos** (Business Context)
- `[Approved Candidate]` **Estado deseado — Combos** (TOBE)
- `[Approved Candidate]` **El proyecto Combos no debe iniciar desarrollo hasta completar validación end-to-end** (Decision)
- `[Approved Candidate]` **MVP de Combos: solo productos del mismo proveedor, sin multiproveedor** (Decision)
- `[Approved Candidate]` **Garantía del combo: debe heredarse por producto componente (no por combo completo)** (Decision)
- `[Approved Candidate]` **¿Un combo es un producto nuevo, un agrupador virtual o una orden compuesta?** (Open Question)
- `[Approved Candidate]` **¿Quién puede crear combos: proveedor, dropshipper o ambos?** (Open Question)
- `[Approved Candidate]` **¿Cómo se calcula el stock del combo y qué pasa cuando un componente se agota?** (Open Question)
- `[Approved Candidate]` **¿Cómo se publica y sincroniza el combo en Shopify, Tienda Nube y Dropify?** (Open Question)
- `[Approved Candidate]` **¿Quién define el precio del combo y quién asume el descuento?** (Open Question)
- `[Approved Candidate]` **Estado actual — Combos** (ASIS)
- `[Approved Candidate]` **¿Cómo recibe el proveedor una orden con combo y cómo la despacha?** (Open Question)
- `[Approved Candidate]` **¿Cómo se gestionan devoluciones, cancelaciones parciales y soporte en órdenes con combo?** (Open Question)
- `[Approved Candidate]` **Resumen ejecutivo — Review de readiness Combos (2026-05-11)** (Summary)
- `[Draft]` **AS-IS Combos · Flujo de creación supplier** (ASIS)

---

## Time to Value (Estado: `In Progress`) 
*TOBE completo definido (2026-05-27). Foco: maximizar operación de tiempos de registro y activación. North Star: suppliers activos en ≤ 5 días. Outcome: primera orden en ≤ 20 días. 3 hipótesis: (H1) fast-track a auditoría para potenciales, (H2) catálogo público con stock real genera órdenes, (H3) validación operativa protege GMV. Escenario base: 620 suppliers → 31.000 productos → 80.544 órdenes/año (factor maduración 35%). Integración UserPilot→GHL pendiente (Laura+Enrique, sin fecha). Backlog de ya-registrados: responsabilidad de Comercial. Calidad de catálogo: proyecto separado.*

### Compromisos Pendientes (Followups)
- `[Open]` **Levantar data de suppliers represados con Growth y Comercial** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Definir flujo CRM para proveedores con Marlon y Emerson** — Responsable: *Emerson Diaz* (Límite: Sin fecha)
- `[Open]` **Documentar flujo de activación de proveedores** — Responsable: *Emerson Diaz* (Límite: 2026-05-25T00:00:00+00:00)
- `[Open]` **Alinear integración CRM con Enrique** — Responsable: *Jaime Guevara* (Límite: 2026-05-27T00:00:00+00:00)
- `[Open]` **Diseñar persistencia del checklist en UI** — Responsable: *Michelle Lopez Obregon* (Límite: 2026-05-28T00:00:00+00:00)
- `[Open]` **Extraer embudo de inactividad de UserPilot** — Responsable: *Laura Catherine Torres Ciendua* (Límite: 2026-05-26T00:00:00+00:00)
- `[Open]` **Agendar sesión de alineación con Juan Sebastián (G-Ops)** — Responsable: *Jaime Guevara* (Límite: 2026-05-29T00:00:00+00:00)

### Riesgos Activos
- `[Open]` **Invertir en producto sin validar impacto económico** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Lineamiento claro: primero análisis con Growth y Comercial, luego decisión de solución
- `[Open]` **Data de suppliers represados no disponible** (Impacto: `Medium`, Probabilidad: `Medium`) — *Mitigación:* Involucrar a Data desde el inicio para identificar fuentes disponibles
- `[Open]` **CRM de proveedores sin flujo definido** (Impacto: `High`, Probabilidad: `High`) — *Mitigación:* Marlon confirmó que retomará la configuración del CRM para proveedores. Coordinar con Emerson y Kevin para definir el flujo antes de arrancar acciones de activación.

### Decisiones Oficiales
- **Involucramiento de Growth Ops para gobernanza operativa**: Se aprobó por parte de María incorporar al equipo de Growth Ops (liderado por Juan Sebastián) para documentar el proceso de activación y supervisar el cumplimiento de la operación. — *Razón:* Jaime Guevara gestiona la conexión técnica del formulario inicial con el CRM.

### Estado de Memoria y Contexto
**Contexto Aprobado (4 items):**
- `[Aprobado]` **Contexto — Time to Value** (Business Context) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Estado deseado — Time to Value** (TOBE) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Información a levantar — Time to Value** (Open Question) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00
- `[Aprobado]` **Lineamiento: no invertir en desarrollo sin validar impacto económico** (Decision) — Versión: 1, Actualizado: 2026-05-20T00:00:00+00:00

**Borradores / Memorias en Progreso (7 items):**
- `[Approved Candidate]` **TEX-02 — Semana 0: arranque operativo del experimento** (HU)
- `[Approved Candidate]` **TEX-03 — Mes 1: ejecución + primera revisión de resultados** (HU)
- `[Approved Candidate]` **TEX-04 — Mes 2: iteración con base en resultados del mes 1** (HU)
- `[Approved Candidate]` **TEX-05 — Mes 3: evaluación de tracción** (HU)
- `[Approved Candidate]` **TEX-06 — Cierre y decisión de escala del experimento** (HU)
- `[Approved Candidate]` **TEX-01 — Definición del experimento de activación** (HU)
- `[Approved Candidate]` **Épica TTV-EXP — Experimento operativo de activación de suppliers sin desarrollo** (Epica)

---

## Conexión Chateapro (Estado: `Discovery`) 
*Integración entre Dropi y Chateapro (app del holding para vender productos por WhatsApp vía agentes IA). Fase 1: token de autenticación para validar proveedores de forma segura + sincronización de stock por ID de producto Dropi. Fase futura: coronita azul en catálogo Dropi para productos con prompt optimizado en Chateapro.*

### Compromisos Pendientes (Followups)
- `[Open]` **Redactar requerimiento técnico del token para reunión de tecnología** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Definir métrica de éxito del proyecto** — Responsable: *Jaime Guevara* (Límite: Sin fecha)
- `[Open]` **Revisar iniciativa interna de generación de prompts para ver si aplica a Chateapro** — Responsable: *Jaime Guevara* (Límite: Sin fecha)

### Riesgos Activos
- `[Open]` **Velocidad de desarrollo lenta en ambos equipos** (Impacto: `High`, Probabilidad: `High`) — *Mitigación:* Jaime debe llevar el requerimiento del token a la próxima reunión de tecnología con un brief claro, y alinearlo como dependencia crítica para la integración con un aliado del holding.
- `[Open]` **Sincronización de stock en tiempo real puede generar problemas de performance** (Impacto: `High`, Probabilidad: `Medium`) — *Mitigación:* Definir si la sync es batch/nocturna desde el inicio. Involucrar al equipo técnico de Dropi antes de diseñar la HU para acordar el mecanismo.
- `[Open]` **Métrica de éxito no definida — riesgo de no poder medir el impacto** (Impacto: `Medium`, Probabilidad: `High`) — *Mitigación:* Agendar sesión de alineación entre Jaime y Miguel Ángel antes de pasar a desarrollo para definir el norte estrella.

### Decisiones Oficiales
- **Foco corto plazo: token de autenticación + sync de stock**: El alcance inmediato de CHP-001 se limita a dos entregables: (1) mecanismo de token/llave dinámica en admin Dropi para que Chateapro valide proveedores de forma segura, (2) sincronización de stock usando el ID de producto Dropi. La generación automática de prompts queda fuera de alcance. — *Razón:* La generación automática de prompts fue intentada por Miguel Ángel Hernandez (PM Chateapro) y resultó en prompts genéricos sin buenos resultados de conversión. El problema de validación es urgente por riesgo de suplantación. Acordado en reunión Jaime Guevara ↔ Miguel Ángel 2026-05-28.
- **Coronita azul incluida como criterio de aceptación en HU del token**: La distinción visual (coronita azul en catálogo Dropi) para productos con prompt optimizado en Chateapro se incluye como criterio de aceptación en la misma HU que implementa el token + sync de stock. No se crea una HU separada. — *Razón:* Si el proveedor ya conectó su cuenta y el producto está listo en Chateapro, la coronita es consecuencia directa. Propuesto por Jaime Guevara, aceptado por Miguel Ángel Hernandez en reunión 2026-05-28.

### Estado de Memoria y Contexto
**Contexto Aprobado (11 items):**
- `[Aprobado]` **Contexto de negocio — Chateapro y la integración con Dropi** (Business Context) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **AS-IS — Estado actual de la integración Dropi ↔ Chateapro** (ASIS) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **TO-BE — Integración segura y validada Dropi ↔ Chateapro** (TOBE) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **Decisión: Foco corto plazo = token de autenticación + sync de stock** (Decision) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **Decisión: Coronita azul incluida en la misma HU del token** (Decision) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **¿Cuál es la métrica de éxito de CHP-001?** (Open Question) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **¿Quién es el dueño técnico del token en Dropi?** (Open Question) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **¿La sincronización de stock es en tiempo real o por batch?** (Open Question) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **Épica CHP-E1 — Conexión de stock con Chateapro para mejorar visibilidad de productos de suppliers** (Epica) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **CHP-01 — Discovery: conexión y sincronización de stock + coronita azul** (HU) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00
- `[Aprobado]` **CHP-02 — TOBE: conexión y sincronización de stock + coronita azul** (HU) — Versión: 1, Actualizado: 2026-05-29T00:00:00+00:00

**Borradores / Memorias en Progreso (11 items):**
- `[Approved Candidate]` **Contexto de negocio — Chateapro y la integración con Dropi** (Business Context)
- `[Approved Candidate]` **Decisión: Foco corto plazo = token de autenticación + sync de stock** (Decision)
- `[Approved Candidate]` **AS-IS — Estado actual de la integración Dropi ↔ Chateapro** (ASIS)
- `[Approved Candidate]` **TO-BE — Integración segura y validada Dropi ↔ Chateapro** (TOBE)
- `[Approved Candidate]` **Decisión: Coronita azul incluida en la misma HU del token** (Decision)
- `[Approved Candidate]` **¿Cuál es la métrica de éxito de la integración Chateapro?** (Open Question)
- `[Approved Candidate]` **¿Quién es el dueño técnico del token en Dropi?** (Open Question)
- `[Approved Candidate]` **¿La sincronización de stock es en tiempo real o por batch?** (Open Question)
- `[Approved Candidate]` **Épica CHP-E1 — Conexión de stock con Chateapro para mejorar visibilidad de productos de suppliers** (Epica)
- `[Approved Candidate]` **CHP-01 — Discovery: conexión y sincronización de stock con Chateapro + coronita azul** (HU)
- `[Approved Candidate]` **CHP-02 — TOBE: conexión y sincronización de stock con Chateapro + coronita azul** (HU)

---

## Combos Dropshipper (Estado: `Discovery`) 
*Habilitar que el dropshipper pueda crear sus propios combos. **Esta semana iniciamos trabajo con Michelle en la contextualización y flujo end-to-end**, con la meta de finalizar la definición para pasar a desarrollo la próxima semana.*

### Estado de Memoria y Contexto
- *No hay contexto aprobado oficial aún.*

**Borradores / Memorias en Progreso (3 items):**
- `[Approved Candidate]` **Épica COM-002-E1 — Combos creados por el dropshipper para aumentar su ticket promedio y diferenciación** (Epica)
- `[Approved Candidate]` **CD-01 — Discovery / AS-IS: cómo vende hoy el dropshipper y qué necesita para crear combos propios** (HU)
- `[Approved Candidate]` **CD-02 — TOBE: diseño de la experiencia del dropshipper para crear y vender combos** (HU)

---

## Facturación Dropshipper - Suppliers (Estado: `Terminado`) 
*Proyecto entregado formalmente. José Giraldo informó la semana pasada que la funcionalidad de reporte de facturación para proveedores cuenta principal fue finalizada e implementada con éxito. Ya no requiere más seguimiento o actualizaciones activas.*

### Decisiones Oficiales
- **Texto del acuerdo legal aprobado por Legal para los 5 países**: El texto del modal de acuerdo de responsabilidad sobre tratamiento de datos personales está aprobado por Legal para Colombia, Chile, México, Ecuador y Argentina. No hay bloqueante legal para el desarrollo ni el lanzamiento. — *Razón:* Confirmado por Jaime Guevara el 2026-06-01.

### Estado de Memoria y Contexto
- *No hay contexto aprobado oficial aún.*

**Borradores / Memorias en Progreso (3 items):**
- `[Approved Candidate]` **Contexto de negocio — Facturación Dropshipper-Suppliers** (Business Context)
- `[Approved Candidate]` **Épica FAC-001-E1 — Reporte de datos de facturación de dropshippers para proveedores** (Epica)
- `[Approved Candidate]` **Decisión: aceptación legal se guarda por usuario y por reporte, no de forma global** (Decision)

---
