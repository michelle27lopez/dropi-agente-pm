import type { WeeklySnapshot, Documento } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 26 jun–02 jul 2026",
  subtitle: "Avances gerenciales · Proyectos activos · Ajustes de usabilidad y alcance",
  heroBadge: "Avances gerenciales · Semana 26 jun",
  heroTitle: "Handoff unificado de Combos\n+ Workaround y Fase 2 de Negociaciones",
  heroStrip: [
    { label: "Objetivo Anual", value: "93.6M", sub: "Órdenes/año meta OKR" },
    { label: "Órdenes Actuales", value: "38.4M", sub: "Órdenes/año base" },
    { label: "Brecha a Cerrar", value: "55.2M", sub: "Adicionales requeridas" },
    { label: "Meta Iniciativas", value: "308.3K", sub: "Proyección sumada" },
    { label: "Lanzamientos", value: "Julio", sub: "Fase 2 NEG + COM + TTV" }
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "Turn de activación: solo el 2% de los suppliers registrados llegan a su primera venta",
      descripcion: "De 14,175 suppliers registrados en ~90 días, solo el 2% (~255) generaron al menos 1 orden. El 98% entra y nunca vuelve. Es la base que justifica todo TTV-001 y la urgencia del onboarding automatizado.",
      proyecto: "TTV-001",
      tipo: "Dato",
      tipoColor: "#D97706",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "NEG-001 live en redes pero solo habilitado para 12 usuarios",
      descripcion: "El módulo ya se está promocionando en redes sociales, pero solo está disponible para 12 usuarios. Si alguien intenta usarlo sin acceso, genera frustración con la marca. Abrir a todos antes del 6-jul es acción crítica.",
      proyecto: "NEG-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "83% del abandono en Caza Productos es por miedo al espionaje comercial, no por UX",
      descripcion: "Los suppliers no participan porque no quieren revelar sus nichos rentables a competidores. El 64.3% califica la herramienta como 'muy fácil' de usar. El problema es de confianza, no de experiencia de usuario.",
      proyecto: "CAZ-001",
      tipo: "Hallazgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "35% de las órdenes caen en la categoría 'Otros' — el catálogo está mal clasificado",
      descripcion: "1 de cada 3 órdenes va a una categoría genérica sin valor analítico. Hay 42 categorías duplicadas y 18 con errores ortográficos. Esto bloquea campañas, búsqueda semántica y cualquier análisis de productos por nicho.",
      proyecto: "CAT-001",
      tipo: "Hallazgo",
      tipoColor: "#3B82F6",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "María propone feature 'precio antes / precio ahora' para Cyber Days",
      descripcion: "Validar con TI esta semana si pueden hacer una funcionalidad básica de precio tachado + precio actual, solo para productos de la campaña. La recomendación es construir features pequeños y graduales que validen el modelo antes de una plataforma completa.",
      proyecto: "DCA-001",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Alto",
    },
  ],
  oportunidades: [
    {
      code: "NEG-001",
      name: "Negociaciones · Piloto con Comunidades",
      status: "🟢 Piloto Activo · Ajuste de Alcance",
      statusColor: "#10B981",
      color: "#10B981",
      mueve: "Negociaciones formalizadas → comisiones acordadas → GMV",
      hipotesis: "Piloto: 1 líder de comunidad con 5 negociaciones",
      gmv: "Fase 1: Transacciones controladas",
      avance: "El abordaje con un usuario real el lunes reveló un grave dolor de usabilidad: no es sencillo ni viable seleccionar productos uno a uno para catálogos grandes. Se resolvió con TI realizar una carga manual temporal (el proveedor envía Excel con IDs de productos y comisiones, y soporte lo carga). El kickoff de la Fase 2 está programado para la próxima semana; este incluirá las mejoras en la UI (filtros de catálogo y botón 'Agregar todos') y las negociaciones directas dropshipper-supplier (NEG-002).",
      next: "Iniciar carga manual de Excel para el piloto comercial de 5 negociaciones. Kickoff de la Fase 2 la próxima semana.",
      badge: "🔥 Ajuste UI",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Líderes en piloto", value: "1", sub: "1 líder de comunidad seleccionado" },
          { label: "Negociaciones piloto", value: "5", sub: "5 negociaciones en curso" },
          { label: "Visualizaciones", value: "182", sub: "Línea base inicial" }
        ],
        meta: [
          { label: "Lanzamiento masivo", value: "6-jul", sub: "Comunicación masiva aprobada" },
          { label: "Carga masiva en UI", value: "Fase 2", sub: "Kickoff la próxima semana" }
        ],
        seguimiento: [
          { label: "Cargas Excel manuales", value: "5", sub: "Acuerdos del piloto" },
          { label: "Errores de usabilidad", value: "Cero", sub: "Post-Fase 2" }
        ]
      }
    },
    {
      code: "COM-001",
      name: "Combos · Integración unificada",
      status: "⚡ En desarrollo · Lanzamiento 7-jul",
      statusColor: "#7C3AED",
      color: "#7C3AED",
      mueve: "Canal Shopify completo con combos + carga masiva + CAS + ECOM Scanner",
      hipotesis: "Fecha unificada de lanzamiento: 7 de julio de 2026",
      gmv: "Habilita Shopify completo para suppliers con combos",
      avance: "Se entregó a Jose Giraldo la documentación E2E unificada con los 4 frentes de la Fase 2 (Shopify sync, CAS, Ecom Scanner, Icom) para la generación de HUs técnicas. Se reprogramó el hito de entrega unificada para la primera semana de julio (7-jul). FUP-005 cerrado.",
      next: "Alinear estimaciones de esfuerzo final con Jose. Pruebas de QA sobre variantes Shopify.",
      badge: "📦 E2E Entregado",
      badgeColor: "#7C3AED",
      metricas: {
        base: [
          { label: "Frentes unificados", value: "4 de 4", sub: "Shopify, CAS, Ecom, Icom" },
          { label: "HUs definidas", value: "17", sub: "C-01 a C-17" }
        ],
        meta: [
          { label: "Lanzamiento", value: "7-jul", sub: "Nueva fecha compromiso" }
        ],
        seguimiento: [
          { label: "Avance QA Shopify", value: "%", sub: "Sincronización de variantes" }
        ]
      }
    },
    {
      code: "TTV-001",
      name: "Time to Value (Beta Onboarding)",
      status: "⏳ Esperando integración CRM",
      statusColor: "#D97706",
      color: "#D97706",
      mueve: "620 nuevos suppliers activos con catálogo visible",
      hipotesis: "Beta target: 30 de junio de 2026",
      gmv: "TTV < 21 días para Fast-track",
      avance: "El pipeline de GHL se actualizó y expandió a 13 etapas para mejorar el control del onboarding. Las bases de Postgres and n8n están listas. Enrique propuso lanzar el piloto la próxima semana, pero está pendiente verificar la integración técnica de los webhooks de UserPilot al CRM.",
      next: "Verificar la integración de webhooks con Enrique. Enrolar a los primeros suppliers en el Beta el 30 de junio.",
      badge: "⏳ Pipeline 13 etapas",
      badgeColor: "#D97706",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Registrados (Userpilot)", value: "14.175", sub: "Total registrados en BD", tooltip: "Total de suppliers con cuenta activa en Userpilot.\n\nFuente: tabla userpilot_suppliers en Supabase.\nSe carga en tiempo real cada vez que abres esta página." },
          { label: "Tasa de no activación", value: "98.20%", sub: "13.920 con 0 órdenes", tooltip: "Suppliers que se registraron pero nunca generaron órdenes.\n\nFuente: real_orders_delivered = 0 en userpilot_suppliers." },
          { label: "Churn sesiones", value: "26.71%", sub: "3.786 inactivos >15 días", tooltip: "Porcentaje de suppliers sin actividad de sesión por más de 15 días.\n\nFuente: es_activo_30d = false." },
          { label: "Tasa de activación", value: "1.80%", sub: "255 con ≥1 orden", tooltip: "Porcentaje de suppliers registrados con al menos 1 orden." }
        ],
        meta: [
          { label: "Beta Onboarding", value: "30-jun", sub: "Inicio de enrolamiento" },
          { label: "Suppliers Beta", value: "620", sub: "Meta de activación" },
          { label: "Auditoría (TTA)", value: "≤ 5 días", sub: "Registro → activo público" },
          { label: "Primera orden", value: "≤ 25 días", sub: "Desde registro" },
          { label: "Órdenes/año base", value: "~105.000", sub: "Escenario base revisado" },
          { label: "GMV año 1", value: "USD 1,57M", sub: "Proyección base" }
        ],
        seguimiento: [
          { label: "TTA real", value: "Días prom.", sub: "Registro → activo" }
        ]
      }
    },
    {
      code: "CAT-001",
      name: "Categorización y enriquecimiento del catálogo",
      status: "🎯 Congelamiento Técnico · Mesa Comercial",
      statusColor: "#3B82F6",
      color: "#3B82F6",
      mueve: "Habilita búsquedas, campañas and SEO",
      hipotesis: "Definición del árbol comercial primero",
      gmv: "Estructura del catálogo de Dropi",
      avance: "Se congeló el desarrollo técnico del categorizador con IA para priorizar la mesa comercial con Jacki y el Category Manager. El análisis del árbol actual muestra un catálogo con 5.595 categorías mapeadas de Google Product Taxonomy, pero con graves deficiencias: se identificaron 42 categorías duplicadas, 18 con errores ortográficos y ~35% de los productos categorizados erróneamente en 'Otros' (nada que ver).",
      next: "Presentar la propuesta de árbol base (9 categorías L1, 225 hojas L4) en la mesa comercial con Jacki antes del 30 de junio.",
      badge: "🛑 Congelado",
      badgeColor: "#3B82F6",
      metricas: {
        base: [
          { label: "Categorías duplicadas", value: "42", sub: "Ej. Belleza y Salud vs Salud y Belleza" },
          { label: "Categorías con typos", value: "18", sub: "Ej. Tecnolojia, Hogar y decoracion" },
          { label: "Productos en 'Otros'", value: "~35%", sub: "Clasificación errónea" }
        ],
        meta: [
          { label: "Mesa comercial", value: "30-jun", sub: "Aprobación del árbol base" }
        ],
        seguimiento: [
          { label: "Acuerdo de árbol", value: "Sí/No", sub: "Hito desbloqueador" }
        ]
      }
    },
    {
      code: "CAZ-001",
      name: "Caza Productos · Canal de demanda",
      status: "🔍 Discovery Completado · Bug de WhatsApp",
      statusColor: "#EF4444",
      color: "#EF4444",
      mueve: "Demanda real → productos activados → órdenes",
      hipotesis: "Crisis activa: caída del -68% en proveedores activos",
      gmv: "CTR WhatsApp en mínimo histórico (0.22%)",
      avance: "El discovery arrojó datos críticos: de una muestra activa de 17 solicitudes en 60 días, 11 no tienen ninguna oferta (65%), 4 tienen ofertas pero no negociación (24%), y 5 tienen negociaciones en curso (29%). No se ha cerrado ninguna negociación en esta muestra (conversión histórica de 17%). Se descubrió un bug técnico crítico en el flujo de WhatsApp (solo 2 clics registrados de 882 intentos, 0.22% CTR). Además, el 83% de los proveedores que abandonan lo hacen por miedo al espionaje comercial de sus nichos rentables.",
      next: "Levantar ticket técnico prioritario para corregir el bug de WhatsApp. Diseñar la propuesta de solicitudes anónimas para mitigar el miedo al espionaje.",
      badge: "🔴 Bug Crítico",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Solicitudes sin oferta", value: "11", sub: "De la muestra activa de 17" },
          { label: "WhatsApp CTR", value: "0.22%", sub: "2 clics de 882 intentos" },
          { label: "Miedo al espionaje", value: "83%", sub: "Causa de abandono de suppliers" },
          { label: "Proveedores activos", value: "56", sub: "Caída del -68% desde 174" }
        ],
        meta: [
          { label: "Resolución bug", value: "Urgente", sub: "Corregir WhatsApp" },
          { label: "Órdenes/año base", value: "54.000", sub: "Con semántica activa" },
          { label: "GMV base", value: "USD 810K", sub: "Escenario conservador" }
        ],
        seguimiento: [
          { label: "Negociaciones cerradas", value: "Acumulado", sub: "Métrica clave" }
        ]
      }
    },
    {
      code: "DCA-001 + DCA-002",
      name: "Campañas de catálogo · Experimento activo",
      status: "🚀 Experimento activo · Fase de decisión",
      statusColor: "#0EA5E9",
      color: "#0EA5E9",
      mueve: "Órdenes + GMV por curaduría de catálogo y descuentos",
      hipotesis: "149.300–626.000 órdenes/año (base según fase)",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "Experimento de campañas manuales activo. Se revisaron antecedentes de Black Week (año anterior) y DropiCup (agosto) como base para proyectar metas (sin métrica histórica de órdenes aún). Se definió la primera campaña 'Cyber Days' para finales de julio o inicios de agosto, con marco visual en imagen del producto, donde el descuento lo asume el proveedor.",
      next: "Reunión de alineación la semana del 30-jun para consolidar productos elegibles, T&C y piezas con Marketing.",
      badge: "🚀 Cyber Days",
      badgeColor: "#0EA5E9",
      metricas: {
        base: [
          { label: "Campañas anteriores", value: "2", sub: "Black Week y DropiCup" },
          { label: "Campañas activas", value: "0", sub: "Experimento iniciando" },
          { label: "Productos en campaña", value: "0", sub: "Sin campañas formales aún" },
          { label: "GMV atribuido", value: "Sin dato", sub: "Sin baseline" }
        ],
        meta: [
          { label: "Primera campaña", value: "Lanzada", sub: "Cyber Days" },
          { label: "Hipótesis base", value: "149.300", sub: "Órdenes/año DCA-001" },
          { label: "GMV potencial", value: "USD 2,24M", sub: "Escenario estándar" }
        ],
        seguimiento: [
          { label: "CTR banner campaña", value: "% clics", sub: "vs. sin campaña" },
          { label: "Importaciones", value: "Por campaña", sub: "Dropshippers que importan" },
          { label: "Órdenes atribuidas", value: "GMV incremental", sub: "Métrica de negocio" }
        ]
      }
    },
    {
      code: "DESC-001",
      name: "Descuentos en Catálogo · Precio Antes/Ahora",
      status: "📋 E2E Documentado · Validación TI pendiente",
      statusColor: "#F59E0B",
      color: "#F59E0B",
      mueve: "Tasa de importación en campañas · GMV incremental Cyber Days",
      hipotesis: "El descuento visible aumenta la importación de productos de campaña vs. sin precio tachado",
      gmv: "Enabler de Cyber Days y todas las campañas DCA",
      avance: "Feature recomendada por María Ossa (weekly 27-jun). E2E completo documentado con 3 fases: Fase 1 descuento básico transversal (Dropi + Shopify + WooCommerce + Tienda Nube + CAS + ECOM Scanner), Fase 2 filtros y badges en catálogo, Fase 3 inteligencia y automatización. Pendiente validación técnica con TI sobre impacto en wallet — es el único bloqueador real para Fase 1.",
      next: "Validar con José Giraldo (TI) si la wallet tiene dependencia del campo de precio. Resultado define si Fase 1 va a Cyber Days (agosto).",
      badge: "📋 E2E Listo",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Canales cubiertos", value: "6", sub: "Dropi · Shopify · WooC · TN · CAS · Scanner" },
          { label: "Fases definidas", value: "3", sub: "MVP → Filtros → Inteligencia" },
          { label: "Riesgo principal", value: "Wallet", sub: "Confirmación pendiente con TI" }
        ],
        meta: [
          { label: "Trigger", value: "Cyber Days", sub: "Agosto 2026" },
          { label: "Alcance", value: "Transversal", sub: "Todas las campañas DCA" },
          { label: "CTR campaña meta", value: "≥ 8%", sub: "Productos en vitrina" }
        ],
        seguimiento: [
          { label: "Validación TI", value: "30-jun", sub: "Go / No-go Fase 1" },
          { label: "Figma diseño", value: "Pendiente", sub: "Michelle López" },
          { label: "Épica Jira", value: "Pendiente", sub: "Post validación TI" }
        ]
      }
    }
  ],
  documentos: [
    {
      code: "DESC-001",
      nombre: "Precio Antes / Precio Ahora — Documentación E2E",
      descripcion: "5 entregables completos: Kick-off, Discovery (AS-IS + benchmark 5 plataformas), Definición (3 fases), Following (métricas HEART + SEQ), Hand-off a TI (JTBD, C4, glosario, 8 reglas de negocio, 4 módulos Gherkin).",
      tipo: "E2E",
      color: "#F59E0B",
      href: "/desc001-precio-antes-ahora-e2e.html",
      proyecto: "DCA-001 / DCA-002 · Campañas de catálogo",
      fecha: "30-jun-2026",
    } as Documento,
  ],
  dolores: [],
  resumen: "Esta semana la célula se enfocó en el ajuste de alcance de <strong>Negociaciones</strong> tras el abordaje con un usuario real el lunes, el cual reveló que el proceso 1 a 1 no escala para catálogos grandes; se resolvió operar temporalmente con carga manual mediante Excel y programar el kickoff de la Fase 2 (con filtros y agregar todo en la UI, más negociaciones dropshipper-supplier) para la próxima semana. <strong>Combos</strong> avanzó con la entrega formal del E2E unificado (Shopify, CAS, Ecom, Icom) a Jose Giraldo y una nueva fecha compromiso de lanzamiento para el 7 de julio. <strong>Time to Value</strong> actualizó su pipeline en GHL a 13 etapas y espera el kickoff propuesto por Enrique para la próxima semana, sujeto a validar la integración de webhooks. <strong>Categorización</strong> congeló su desarrollo técnico de IA para alinearse comercialmente con Jacki antes de fin de mes, identificando 42 categorías duplicadas, 18 con errores tipográficos y un ~35% de productos erróneamente catalogados en 'Otros'. Por último, en <strong>Caza Productos</strong> el discovery evidenció una caída del -68% en proveedores activos y un bug crítico en WhatsApp (0.22% CTR, 2 clics de 882 intentos) que requiere corrección urgente.",
  proximosPasos: [
    {
      titulo: "Esta semana (26 jun – 02 jul 2026)",
      color: "#F77F00",
      items: [
        "Iniciar carga manual de Excel para el piloto de Negociaciones (1 líder, 5 negociaciones).",
        "Laura / Enrique: verificar webhooks UserPilot -> n8n -> CRM GHL (TTV-001).",
        "Jaime: presentar propuesta de árbol base (225 categorías L4) en la mesa comercial con Jacki y Category Manager.",
        "José: levantar ticket técnico urgente para corregir el bug de WhatsApp en Caza Productos.",
        "Michelle: finalizar UI de filtros y botón 'Agregar todos' para el kickoff de la Fase 2 de Negociaciones."
      ]
    },
    {
      titulo: "Próxima célula",
      color: "#7C3AED",
      items: [
        "Kickoff de la Fase 2 de Negociaciones (filtros UI + dropshipper-supplier).",
        "Definición y aprobación final del árbol de categorías comercial con Jacki.",
        "Enrolamiento de primeros 10 suppliers en el Beta de Time to Value.",
        "Revisión de corrección del bug de WhatsApp y propuesta de solicitudes anónimas."
      ]
    },
    {
      titulo: "6 de julio (Hitos clave)",
      color: "#10B981",
      items: [
        "Lanzamiento masivo de Negociaciones con comunicación formal.",
        "Inicio de pruebas de QA finales sobre variantes Shopify (Combos)."
      ]
    }
  ]
};
