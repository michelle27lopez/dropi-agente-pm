import type { WeeklySnapshot, Documento } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 03 jul 2026",
  subtitle: "TTV en operación · Handoffs desacoplados · CAT-001 a pruebas piloto",
  heroBadge: "Semana 03 jul · TTV operativo",
  heroTitle: "TTV encendido en operación plena\n+ NEG-002 handoff hoy · CAT-001 avanza a pruebas piloto con usuarios reales",
  heroStrip: [
    { label: "Objetivo Anual", value: "93.6M", sub: "Órdenes/año meta OKR" },
    { label: "Órdenes Actuales", value: "38.4M", sub: "Órdenes/año base" },
    { label: "Brecha a Cerrar", value: "55.2M", sub: "Adicionales requeridas" },
    { label: "Meta Iniciativas", value: "308.3K", sub: "Proyección sumada" },
    { label: "Hito clave", value: "6-jul", sub: "Apertura masiva NEG-001" }
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "TTV-001 pasa a fase operativa: pipeline encendido, integraciones completas",
      descripcion: "Esta semana se cierra la fase de construcción de TTV-001. El pipeline GHL está activo y recibiendo oportunidades, todas las integraciones completadas (UserPilot → n8n → CRM) y el tablero de métricas operativo. El seguimiento se formalizó como ritual semanal de célula los martes.",
      proyecto: "TTV-001",
      tipo: "Decisión",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "NEG-001 ya abierta a todos — José reconfirma que el 6-jul sigue en pie",
      descripcion: "José confirmó en el weekly del 2-jul que ya removió el switch de beta. Negociaciones está disponible para todos los proveedores sin restricción. La condición no es ser miembro de una comunidad: cualquier proveedor puede proponer una negociación a cualquier líder de comunidad, quien decide si acepta. José reconfirmó el 3-jul que la fecha del 6-jul para la comunicación masiva se mantiene en pie.",
      proyecto: "NEG-001",
      tipo: "Decisión",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "Handoffs se desacoplan del bloque: NEG-002 hoy, COM-002 y DESC-001 pasan a la próxima semana",
      descripcion: "El bloque consolidado de handoffs que teníamos planeado no se sostuvo. José aclaró que cada handoff debe ser una sesión independiente por proyecto. NEG-002 tiene su sesión con José hoy, viernes 3-jul. COM-002 y DESC-001 se movieron a la próxima semana (semana del 6-jul), cada uno en su propia sesión.",
      proyecto: "NEG-002",
      tipo: "Decisión",
      tipoColor: "#6366F1",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "CAZ-001: aún sin sesión de reproducción, pero comercial ya coordina la cita con suppliers",
      descripcion: "TI sigue sin poder reproducir el bug de WhatsApp internamente ni con los usuarios contactados hasta ahora (Peña y otros). La sesión controlada con un supplier real y el desarrollador conectado todavía no se ha hecho. Ya se habló con el equipo comercial para que ayude a citar a los suppliers a una reunión y poder explorarlo en conjunto. Sin esto, el bug sigue sin solución.",
      proyecto: "CAZ-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "NEG-001: bug de descarga de Excel limita el workaround — solo trae 120 productos",
      descripcion: "Se descubrió que cuando un proveedor descarga su catálogo en Excel, el sistema solo exporta los primeros 120 productos (primera página). Para un proveedor con 3.800+ productos en múltiples cuentas esto hace el workaround inviable. TI está evaluando un importador por archivo como solución: el proveedor sube un Excel con ID de producto, tipo de comisión y valor, y el sistema carga todo de una vez.",
      proyecto: "NEG-001",
      tipo: "Hallazgo",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-006",
      titulo: "CAT-001: el plan cambia — pruebas piloto con usuarios reales antes de ir a stakeholders",
      descripcion: "En vez de pasar directo de la validación interna de la célula a la mesa con Jacki y Category Manager, se decidió correr pruebas piloto del árbol de categorías con usuarios reales. Los insights de esas pruebas son los que se llevan a la presentación con stakeholders para buscar la aprobación del árbol y poder seguir con el proyecto.",
      proyecto: "CAT-001",
      tipo: "Decisión",
      tipoColor: "#3B82F6",
      impacto: "Medio",
    },
    {
      id: "INS-007",
      titulo: "Seguimos con POCs activos en exploración, por fuera del backlog formal",
      descripcion: "Además de los proyectos del backlog, se mantienen pruebas de concepto en exploración (ej. Dropi Activa, un portal de activación de suppliers). Siguen en fase de POC — sin mayor detalle por ahora, solo dejarlo registrado como frente abierto.",
      proyecto: "POC",
      tipo: "Dato",
      tipoColor: "#64748B",
      impacto: "Bajo",
    },
    {
      id: "INS-008",
      titulo: "Compré una cafetera como dropshipper y viví en carne propia el vacío de comunicación del supplier",
      descripcion: "Hice una compra real como dropshipper (una cafetera) para sentir la experiencia end-to-end. Desde que pagué, no tuve ninguna comunicación del supplier: ni correo, ni WhatsApp, nada — solo la confianza de que el pedido va a llegar. Eso genera una sensación de miedo, y me queda la pregunta abierta: ¿por qué me da miedo? ¿Es una señal real de un vacío que debemos resolver en la experiencia del dropshipper, o es simplemente el comportamiento normal del comercio online y no un problema de Dropi?",
      proyecto: "Experiencia Dropshipper",
      tipo: "Hallazgo",
      tipoColor: "#F59E0B",
      impacto: "Medio",
    },
  ],
  oportunidades: [
    {
      code: "NEG-001",
      name: "Negociaciones · Piloto con Comunidades",
      status: "🟢 Abierta a todos · Comunicación masiva 6-jul",
      statusColor: "#10B981",
      color: "#10B981",
      mueve: "Negociaciones formalizadas → comisiones acordadas → GMV",
      hipotesis: "Piloto: 1 líder de comunidad con 5 negociaciones",
      gmv: "Fase 1: Transacciones controladas",
      avance: "José confirmó (2-jul) que Negociaciones ya está liberada a todos los usuarios sin restricción beta. La condición es: cualquier proveedor puede proponer una negociación a cualquier comunidad — no tiene que ser miembro. El líder de la comunidad acepta o rechaza. El workaround de carga masiva resultó más complejo de lo esperado: el proveedor piloto tiene hasta 4 cuentas con IDs diferentes y marcas blancas distintas, con miles de productos. Adicionalmente se encontró un bug en la descarga de catálogo: solo exporta los primeros 120 productos. TI evalúa un importador por archivo (Excel con ID + tipo + monto) como solución definitiva. Apertura con comunicación masiva el 6-jul.",
      next: "TI: corregir bug de descarga de Excel (>120 productos). TI: evaluar importador por archivo para carga masiva. Coordinar comunicación masiva del 6-jul con comercial.",
      badge: "🟢 Abierta · Masivo 6-jul",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Acceso", value: "Todos", sub: "Sin restricción beta desde 2-jul" },
          { label: "Líderes en piloto", value: "1", sub: "1 líder de comunidad activo" },
          { label: "Negociaciones piloto", value: "5", sub: "5 acuerdos en curso" }
        ],
        meta: [
          { label: "Comunicación masiva", value: "6-jul", sub: "Campaña formal de lanzamiento" },
          { label: "Importador por archivo", value: "En evaluación", sub: "Solución carga masiva" }
        ],
        seguimiento: [
          { label: "Bug descarga Excel", value: "Sin resolver", sub: "Solo exporta 120 productos" },
          { label: "Negociaciones cerradas", value: "Acumulado", sub: "Métrica clave piloto" }
        ]
      }
    },
    {
      code: "NEG-002",
      name: "Negociaciones · Supplier↔Dropshipper",
      status: "📋 Handoff HOY · viernes 3-jul",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Negociaciones directas supplier↔dropshipper → GMV incremental",
      hipotesis: "Habilitar negociación directa aumenta conversión de catálogo a orden",
      gmv: "Oportunidad confirmada por María — dimensionamiento en discovery",
      avance: "Oportunidad confirmada por María Ossa el 22-jun. E2E documentado y listo para entregar a TI. El handoff formal a José Giraldo se hace hoy, viernes 3-jul, en sesión individual — el bloque consolidado que se había planeado no se sostuvo. Primera reunión de discovery con Juan Diego (PM anterior) pendiente para recoger contexto histórico.",
      next: "Handoff con José hoy 3-jul. Agendar reunión de contexto con Juan Diego.",
      badge: "📋 Handoff hoy",
      badgeColor: "#6366F1",
      metricas: {
        base: [
          { label: "Estado", value: "Discovery", sub: "Inicia con handoff a TI" },
          { label: "Confirmación María", value: "22-jun", sub: "Oportunidad aprobada" }
        ],
        meta: [
          { label: "Handoff TI", value: "3-jul", sub: "Hoy — sesión individual" },
          { label: "Discovery Juan Diego", value: "Pendiente", sub: "Contexto histórico" }
        ],
        seguimiento: [
          { label: "HUs técnicas", value: "Pendiente", sub: "Post-handoff" }
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
      avance: "José confirmó (2-jul) que el concepto de Dropify ya está desarrollado. Las pruebas de Dropify entre Alejandra y Diego están en curso; aún no hay resultado confirmado. CAS e ICOM Scanner siguen en evaluación para confirmar que funcionan bien con combos. El objetivo de lanzamiento para la semana del 6-jul se mantiene condicionado a que pasen ambas pruebas.",
      next: "Confirmar resultado de pruebas Dropify (Alejandra + Diego), CAS e ICOM Scanner. Si pasan → arrancar QA final y definir fecha exacta de lanzamiento.",
      badge: "🧪 Pruebas en curso",
      badgeColor: "#7C3AED",
      metricas: {
        base: [
          { label: "Frentes unificados", value: "4 de 4", sub: "Shopify, CAS, Ecom, Icom" },
          { label: "HUs definidas", value: "17", sub: "C-01 a C-17" }
        ],
        meta: [
          { label: "Lanzamiento", value: "7-jul", sub: "Fecha compromiso" },
          { label: "Weekly TI", value: "4-jul", sub: "Viernes — alineación final" }
        ],
        seguimiento: [
          { label: "Avance QA Shopify", value: "%", sub: "Sincronización de variantes" }
        ]
      }
    },
    {
      code: "COM-002",
      name: "Combos · Desde Dropshipper",
      status: "📋 Handoff próxima semana",
      statusColor: "#7C3AED",
      color: "#7C3AED",
      mueve: "Dropshippers crean y gestionan sus propios combos → más importaciones",
      hipotesis: "Dar control al dropshipper de crear combos aumenta el ticket promedio",
      gmv: "Incremento en valor por orden — módulo habilitador",
      avance: "Discovery y TOBE aprobados en junta. HUs propuestas CD-01 a CD-10 documentadas. El handoff formal a José se movió a la próxima semana (semana del 6-jul), en sesión independiente — ya no es parte de un bloque consolidado con NEG-002 y DESC-001.",
      next: "Handoff a José la próxima semana (semana del 6-jul).",
      badge: "📋 Próxima semana",
      badgeColor: "#7C3AED",
      metricas: {
        base: [
          { label: "HUs propuestas", value: "10", sub: "CD-01 a CD-10" },
          { label: "Discovery", value: "Aprobado", sub: "Junta — TOBE listo" }
        ],
        meta: [
          { label: "Handoff TI", value: "Semana 6-jul", sub: "Sesión independiente" }
        ],
        seguimiento: [
          { label: "HUs técnicas", value: "Pendiente", sub: "Post-handoff" }
        ]
      }
    },
    {
      code: "DESC-001",
      name: "Descuentos · Precio Antes/Ahora",
      status: "📋 Validación técnica próxima semana",
      statusColor: "#F59E0B",
      color: "#F59E0B",
      mueve: "Tasa de importación en campañas · GMV incremental Cyber Days",
      hipotesis: "El descuento visible aumenta la importación de productos de campaña vs. sin precio tachado",
      gmv: "Enabler de Cyber Days y todas las campañas DCA",
      avance: "E2E completo entregado: 3 fases (MVP transversal → filtros y badges → inteligencia), 6 canales (Dropi + Shopify + WooCommerce + Tienda Nube + CAS + ECOM Scanner), 8 reglas de negocio y módulos Gherkin. El handoff a José se movió a la próxima semana (semana del 6-jul): la validación del impacto en wallet sigue siendo la que define el Go/No-go para que Fase 1 entre al sprint y llegue a Cyber Days en agosto.",
      next: "Próxima semana con José: validar wallet → Go/No-go Fase 1. Si verde, entra a sprint inmediatamente.",
      badge: "⚡ Go/No-go próxima semana",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Canales cubiertos", value: "6", sub: "Dropi · Shopify · WooC · TN · CAS · Scanner" },
          { label: "Fases definidas", value: "3", sub: "MVP → Filtros → Inteligencia" },
          { label: "Riesgo principal", value: "Wallet", sub: "Validación próxima semana" }
        ],
        meta: [
          { label: "Trigger", value: "Cyber Days", sub: "Agosto 2026" },
          { label: "Go/No-go", value: "Semana 6-jul", sub: "Define entrada a sprint" }
        ],
        seguimiento: [
          { label: "Validación TI", value: "Semana 6-jul", sub: "Go / No-go Fase 1" },
          { label: "Épica Jira", value: "Pendiente", sub: "Post validación TI" }
        ]
      }
    },
    {
      code: "TTV-001",
      name: "Time to Value · Seguimiento Operativo",
      status: "🚀 Operación plena · Seguimiento martes",
      statusColor: "#10B981",
      color: "#10B981",
      mueve: "620 nuevos suppliers activos con catálogo visible",
      hipotesis: "North Star: registro → activo en ≤5 días",
      gmv: "~105.000 órdenes/año · USD 1,57M GMV proyectado",
      avance: "La fase de construcción cerró esta semana. Pipeline GHL encendido y recibiendo oportunidades. Todas las integraciones completadas: UserPilot → n8n → CRM GHL. Tablero de métricas construido y operativo. El seguimiento semanal se formalizó como ritual de célula los martes. El foco pasa de integración a conversión por etapa.",
      next: "Primer martes de seguimiento: revisar conversión por etapa del pipeline. Identificar etapa con mayor caída.",
      badge: "🚀 Operativo",
      badgeColor: "#10B981",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Registrados (Userpilot)", value: "14.175", sub: "Total registrados en BD", tooltip: "Total de suppliers con cuenta activa en Userpilot.\n\nFuente: tabla userpilot_suppliers en Supabase.\nSe carga en tiempo real cada vez que abres esta página." },
          { label: "Tasa de no activación", value: "98.20%", sub: "13.920 con 0 órdenes", tooltip: "Suppliers que se registraron pero nunca generaron órdenes.\n\nFuente: real_orders_delivered = 0 en userpilot_suppliers." },
          { label: "Churn sesiones", value: "26.71%", sub: "3.786 inactivos >15 días", tooltip: "Porcentaje de suppliers sin actividad de sesión por más de 15 días.\n\nFuente: es_activo_30d = false." },
          { label: "Tasa de activación", value: "1.80%", sub: "255 con ≥1 orden", tooltip: "Porcentaje de suppliers registrados con al menos 1 orden." }
        ],
        meta: [
          { label: "Seguimiento célula", value: "Martes", sub: "Ritual semanal fijo" },
          { label: "Suppliers meta", value: "620", sub: "Meta de activación" },
          { label: "TTA meta", value: "≤ 5 días", sub: "Registro → activo público" },
          { label: "Primera orden", value: "≤ 25 días", sub: "Desde registro" },
          { label: "Órdenes/año base", value: "~105.000", sub: "Escenario base" },
          { label: "GMV año 1", value: "USD 1,57M", sub: "Proyección base" }
        ],
        seguimiento: [
          { label: "TTA real", value: "Días prom.", sub: "Registro → activo" },
          { label: "Pipeline activo", value: "Encendido", sub: "Recibiendo oportunidades" }
        ]
      }
    },
    {
      code: "DCA-001 + DCA-002",
      name: "Campañas de catálogo · Cyber Days",
      status: "🚀 Experimento activo · Alineación Marketing",
      statusColor: "#0EA5E9",
      color: "#0EA5E9",
      mueve: "Órdenes + GMV por curaduría de catálogo y descuentos",
      hipotesis: "149.300–626.000 órdenes/año (base según fase)",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "Reunión de alineación semana del 30-jun realizada para consolidar productos elegibles, T&C y piezas visuales con Marketing. La campaña Cyber Days apunta a finales de julio o inicios de agosto. DESC-001 (precio antes/ahora) es el habilitador técnico clave — su Go/No-go el viernes 4-jul define si llega a tiempo para la campaña.",
      next: "Confirmar fecha exacta de Cyber Days. Piezas visuales con Marketing. Resultado de validación DESC-001 el viernes.",
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
      code: "CAZ-001",
      name: "Caza Productos · Canal de demanda",
      status: "🔴 Bug sin resolver · Coordinando sesión con suppliers",
      statusColor: "#EF4444",
      color: "#EF4444",
      mueve: "Demanda real → productos activados → órdenes",
      hipotesis: "Maximizar respuestas de suppliers genera más negociaciones cerradas",
      gmv: "CTR WhatsApp en mínimo histórico (0.22%)",
      avance: "TI no ha podido reproducir el bug de WhatsApp internamente — intentaron contactar a usuarios (incluyendo Peña y otros) sin éxito. La sesión controlada con un supplier real y el desarrollador conectado todavía no se ha hecho, pero ya se habló con el equipo comercial para que ayude a citar a los suppliers a una reunión y poder explorarlo. En paralelo, el experimento de activación de respuestas sigue bloqueado esperando la data de Miguel.",
      next: "Comercial: coordinar y citar a suppliers para la sesión de reproducción del bug. Miguel: entregar data para activar experimento de respuestas.",
      badge: "🔴 Coordinando sesión",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "WhatsApp CTR", value: "0.22%", sub: "2 clics de 882 intentos" },
          { label: "Solicitudes sin oferta", value: "11 de 17", sub: "65% sin respuesta" },
          { label: "Proveedores activos", value: "56", sub: "Caída del -68% desde 174" }
        ],
        meta: [
          { label: "Métrica objetivo", value: "Respuestas", sub: "Suppliers → negociaciones" },
          { label: "Órdenes/año base", value: "54.000", sub: "Con semántica activa" }
        ],
        seguimiento: [
          { label: "Bug WhatsApp", value: "Sin reproducir", sub: "Comercial coordina cita con suppliers" },
          { label: "Data Miguel", value: "Pendiente", sub: "Desbloquea experimento" }
        ]
      }
    },
    {
      code: "CAT-001",
      name: "Categorización y enriquecimiento del catálogo",
      status: "🟡 Preparando pruebas piloto con usuarios reales",
      statusColor: "#3B82F6",
      color: "#3B82F6",
      mueve: "Habilita búsquedas, campañas y SEO",
      hipotesis: "Árbol comercial aprobado → categorización técnica con IA",
      gmv: "Estructura del catálogo de Dropi",
      avance: "El plan cambió: en vez de pasar directo de la validación interna de la célula a la mesa con stakeholders comerciales (Jacki + Category Manager), se van a correr pruebas piloto del árbol de categorías con usuarios reales. Los insights de esas pruebas son los que se llevan a la presentación con stakeholders para buscar la aprobación del árbol y poder seguir con el proyecto.",
      next: "Diseñar y correr las pruebas piloto con usuarios reales. Con esos insights, agendar la mesa con Jacki y Category Manager.",
      badge: "🟡 Pruebas piloto",
      badgeColor: "#3B82F6",
      metricas: {
        base: [
          { label: "Categorías duplicadas", value: "42", sub: "Ej. Belleza y Salud vs Salud y Belleza" },
          { label: "Categorías con typos", value: "18", sub: "Ej. Tecnolojia, Hogar y decoracion" },
          { label: "Productos en 'Otros'", value: "~35%", sub: "Clasificación errónea" }
        ],
        meta: [
          { label: "Pruebas piloto", value: "En diseño", sub: "Usuarios reales sobre el árbol" },
          { label: "Mesa stakeholders", value: "Post-piloto", sub: "Con insights de usuarios reales" }
        ],
        seguimiento: [
          { label: "Acuerdo de árbol", value: "Pendiente", sub: "Tras pruebas piloto + stakeholders" }
        ]
      }
    },
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
  resumen: "Actualizado al 3-jul: <strong>TTV-001 sigue en operación plena</strong>, con el pipeline GHL encendido y el seguimiento semanal ya instalado como ritual de célula los martes. <strong>NEG-001 se mantiene abierta a todos los usuarios</strong> — José reconfirmó hoy que la comunicación masiva del 6-jul sigue en pie. Los handoffs ya no van en bloque: <strong>NEG-002</strong> tiene su sesión con José hoy mismo, viernes 3-jul; <strong>COM-002</strong> y <strong>DESC-001</strong> se movieron a la próxima semana, cada uno en sesión independiente. En <strong>COM-001</strong>, las pruebas de Dropify entre Alejandra y Diego siguen en curso, sin resultado confirmado aún — el lanzamiento de la semana del 6-jul depende de que CAS e ICOM Scanner también pasen. El rojo más crítico sigue siendo <strong>CAZ-001</strong>: TI aún no puede reproducir el bug de WhatsApp; comercial ya está coordinando una cita con suppliers reales para hacerlo con el desarrollador conectado. <strong>CAT-001</strong> cambia de enfoque: antes de ir a stakeholders, se van a correr pruebas piloto con usuarios reales sobre el árbol de categorías, y esos insights son los que se llevan a la mesa con Jacki. Por fuera del backlog formal seguimos con POCs en exploración (ej. Dropi Activa), aún en fase de prueba de concepto.",
  proximosPasos: [
    {
      titulo: "Esta semana (hasta 04 jul 2026)",
      color: "#F77F00",
      items: [
        "Hoy viernes 3-jul: handoff de NEG-002 con José (sesión individual).",
        "CAZ-001: comercial coordina la cita con suppliers para la sesión de reproducción del bug de WhatsApp.",
        "CAT-001: diseñar las pruebas piloto del árbol de categorías con usuarios reales.",
        "Confirmar agenda de la próxima semana para los handoffs de COM-002 y DESC-001.",
        "COM-001: seguimiento a resultado de pruebas de Dropify, CAS e ICOM Scanner.",
        "Miguel: entregar data para activar el experimento de respuestas en CAZ-001."
      ]
    },
    {
      titulo: "Semana 6-jul",
      color: "#7C3AED",
      items: [
        "6-jul: apertura masiva de NEG-001 con comunicación formal a la base (confirmado por José).",
        "7-jul: lanzamiento unificado de COM-001 (Combos Shopify + CAS + Ecom Scanner), si pasa pruebas.",
        "Handoffs de COM-002 y DESC-001 con José (sesiones independientes).",
        "CAZ-001: sesión de reproducción del bug con suppliers reales, si comercial logra coordinar la cita.",
        "Segundo martes de seguimiento TTV-001: conversión por etapa del pipeline."
      ]
    },
    {
      titulo: "Hitos de julio",
      color: "#10B981",
      items: [
        "Cyber Days (agosto): DESC-001 Fase 1 + campañas DCA activas.",
        "TTV-001: primera cohorte de suppliers activados en ≤5 días.",
        "CAT-001: pruebas piloto con usuarios reales → aprobación del árbol por stakeholders.",
        "NEG-002: discovery completado con Juan Diego + HUs técnicas en Jira."
      ]
    }
  ]
};
