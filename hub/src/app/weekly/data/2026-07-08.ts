import type { WeeklySnapshot, Documento } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 08 jul 2026",
  subtitle: "TTV primera reunión real · Bug crítico 111 suppliers · Handoffs cerrados · Piloto CAT ampliado",
  heroBadge: "Semana 08 jul · Primera cohorte real",
  heroTitle: "Primera semana de seguimiento TTV-001\n+ Bug crítico: 111 suppliers en el limbo · Handoffs COM-002 y DESC-001 cerrados",
  heroStrip: [
    { label: "Objetivo Anual", value: "93.6M", sub: "Órdenes/año meta OKR" },
    { label: "Órdenes Actuales", value: "38.4M", sub: "Órdenes/año base" },
    { label: "Brecha a Cerrar", value: "55.2M", sub: "Adicionales requeridas" },
    { label: "Meta Iniciativas", value: "308.3K", sub: "Proyección sumada" },
    { label: "Hito clave", value: "15-jul", sub: "Primera auditoría confirmada TTV" }
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "TTV-001 bug crítico: 111 suppliers registrados en UserPilot no llegan al CRM (46% en el limbo)",
      descripcion: "En la primera reunión de seguimiento (martes 8-jul), Enrique mostró que de los 243 suppliers registrados desde el 30-jun, solo 132 llegaron al CRM GHL. Los otros 111 (46%) se registraron correctamente en UserPilot pero nunca aparecieron en el pipeline. El registro en la web de Dropi los expulsa pidiéndoles que inicien sesión en vez de ingresarlos directamente al CRM. Es el cuello de botella principal del embudo: casi la mitad de los prospects se pierde antes de que el equipo comercial pueda contactarlos. Pendiente de pregunta a José (TI).",
      proyecto: "TTV-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "NEG-001 y COM-001 lanzados esta semana — ambas en operación desde el 6 y 7 de julio",
      descripcion: "La semana arrancó con dos lanzamientos: el 6-jul se ejecutó la comunicación masiva de NEG-001 (Negociaciones, abierta a todos los suppliers sin restricción). El 7-jul se lanzó COM-001 (Combos con Shopify, CAS y ECOM Scanner), cerrando el bloque de entregables que se venía construyendo desde mayo. Ambos están en operación.",
      proyecto: "NEG-001 / COM-001",
      tipo: "Decisión",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "COM-002 y DESC-001 con handoff cerrado a TI — ambos en cola de estimación",
      descripcion: "Esta semana se cerraron los handoffs formales de COM-002 (Combos desde Dropshipper) y DESC-001 (Precio Antes/Ahora) con José Giraldo. Michelle subió el prototipo interactivo de DESC-001 (Vista Proveedor + Vista Dropshipper) el 6-jul para acompañar la documentación E2E. Los dos proyectos entran a la cola de estimación de TI. La validación del impacto en wallet de DESC-001 sigue siendo el Go/No-go para confirmar si llega a Cyber Days.",
      proyecto: "COM-002 / DESC-001",
      tipo: "Decisión",
      tipoColor: "#6366F1",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "CAT-001: pruebas piloto ampliadas a 3 frentes con los mismos 10 suppliers",
      descripcion: "En vez de correr pruebas solo del árbol de categorías, se decidió aprovechar las sesiones con los 10 suppliers para validar también CAZ-001 (interfaz de búsqueda semántica) y DESC-001 (prototipo de precio antes/ahora). Tres frentes en las mismas sesiones. Falta definir agenda, guion y quién lidera cada parte de la sesión.",
      proyecto: "CAT-001 / CAZ-001 / DESC-001",
      tipo: "Decisión",
      tipoColor: "#3B82F6",
      impacto: "Medio",
    },
    {
      id: "INS-005",
      titulo: "TTV-001: estado real del pipeline — 20 en auditoría confirmada, 42 estancados en 'Nuevo registro'",
      descripcion: "Del CRM: 50 en 'Potencial identificado', 42 en 'Nuevo registro' (no avanzaron), 30 en 'Auditoría solicitada', 23 en 'En activación', 20 en 'Auditoría confirmada'. 0 han llegado a 'Listo para vender' o 'Primera Orden'. El cuello de botella secundario es 'Nuevo registro': 42 suppliers que llegaron al CRM pero no han llenado el formulario. 1 proveedor tiene auditoría agendada para el 15-jul. Enrique preparará un dashboard de tiempos entre etapas para la próxima reunión.",
      proyecto: "TTV-001",
      tipo: "Hallazgo",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-006",
      titulo: "Campañas Cyber Days: reunión de alineación el jueves con Natalia, Kevin y Michelle",
      descripcion: "Se agendó una reunión este jueves con Natalia, Kevin y Michelle para alinear la campaña Cyber Days (DCA-001). El hito técnico crítico sigue siendo la validación del impacto en wallet de DESC-001 — define si el precio antes/ahora llega a tiempo para la campaña.",
      proyecto: "DCA-001",
      tipo: "Dato",
      tipoColor: "#0EA5E9",
      impacto: "Medio",
    },
    {
      id: "INS-007",
      titulo: "CAZ-001: bug de WhatsApp sin resolver — bloquea adopción y seguimiento de órdenes",
      descripcion: "El bug de WhatsApp (0.22% CTR, 2 clics de 882 intentos) sigue sin reproducir internamente. Las sesiones de piloto con los 10 suppliers de CAT-001 son ahora la oportunidad principal para explorar el flujo de interfaz de Caza Productos en paralelo, mientras el bug de integración con TI no se desbloquea.",
      proyecto: "CAZ-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-008",
      titulo: "Reporte de experiencia · 2 bugs críticos en búsqueda de catálogo — hablar con José",
      descripcion: "Hallazgos propios al usar la plataforma como dropshipper/supplier. Bug 1: la búsqueda por palabra clave devuelve resultados diferentes en cada ejecución con la misma query — no hay consistencia en el ranking. Tampoco trae todos los resultados al llegar al final del scroll, y los filtros de ordenamiento muestran distintos productos de forma no determinista. Bug 2: la búsqueda semántica por IA no retorna todos los productos relevantes — hay una brecha importante de recall que limita el descubrimiento de productos por fuera de la búsqueda exacta.",
      proyecto: "Catálogo · Búsqueda",
      tipo: "Hallazgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-009",
      titulo: "Reporte de experiencia · 2 mejoras de UX urgentes — hablar con José",
      descripcion: "Mejora 1 (ordenamiento): cuando se muestran resultados de búsqueda, el orden esperado por el usuario es: primero exclusivos, luego premium, luego verificados — hoy ese orden no se garantiza. Mejora 2 (nomenclatura): la etiqueta 'Premium Exclusivo' debería renombrarse a 'Exclusivos Dropi' para consistencia de marca y claridad para el usuario.",
      proyecto: "Catálogo · Búsqueda",
      tipo: "Hallazgo",
      tipoColor: "#F59E0B",
      impacto: "Medio",
    },
    {
      id: "INS-010",
      titulo: "Reporte de experiencia · 2 ideas para catálogo: favoritos en carpetas y comparador de productos",
      descripcion: "Idea 1 (Favoritos/Catálogos): hoy el sistema de favoritos es una lista plana que se llena y desordena rápido. Lo que el usuario necesita es guardar productos en carpetas o catálogos personalizados para hacer preselecciones temáticas sin que todo se mezcle. Idea 2 (Comparador): un mecanismo para marcar productos durante la navegación y luego compararlos lado a lado — especialmente útil para decidir entre variantes similares de distintos proveedores. Ambas son candidatas a entrar al Setboard como Ideas.",
      proyecto: "Catálogo · Experiencia",
      tipo: "Dato",
      tipoColor: "#6366F1",
      impacto: "Medio",
    },
  ],
  oportunidades: [
    {
      code: "TTV-001",
      name: "Time to Value · Seguimiento Operativo",
      status: "🔴 Bug crítico · 111 suppliers en el limbo",
      statusColor: "#EF4444",
      color: "#10B981",
      mueve: "620 nuevos suppliers activos con catálogo visible",
      hipotesis: "North Star: registro → activo en ≤5 días",
      gmv: "~105.000 órdenes/año · USD 1,57M GMV proyectado",
      avance: "Primera reunión de seguimiento celebrada el 8-jul. Enrique presentó los datos reales del pipeline: 243 registrados en UserPilot desde el 30-jun, pero solo 132 llegaron al CRM (111 en el limbo — 46%). El flujo de registro los expulsa pidiéndoles iniciar sesión en vez de ingresarlos directamente al pipeline. Del CRM: 20 en Auditoría confirmada, 42 estancados en Nuevo registro, 0 en Listo para vender. La primera auditoría está agendada para el 15-jul. Enrique preparará dashboard de tiempos entre etapas para la próxima reunión (15-jul). Capacitación al equipo comercial de Erika hoy (8-jul).",
      next: "🔴 Pendiente TI (José): ¿por qué el registro expulsa al usuario y le pide iniciar sesión en vez de ingresarlo directamente al CRM? · Próxima reunión 15-jul: dashboard tiempos entre etapas (Enrique) + resultado auditoría #1.",
      badge: "🔴 Bug crítico · 111 en el limbo",
      badgeColor: "#EF4444",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Registrados (UserPilot)", value: "243", sub: "Desde 30-jun · cohorte activa", tooltip: "Suppliers que se registraron en Dropi desde que se encendió el pipeline el 30-jun-2026.\n\nFuente: tabla ttv_userpilot_cohort en Supabase." },
          { label: "En CRM (GHL)", value: "165", sub: "Llegaron al pipeline" },
          { label: "En el limbo", value: "111", sub: "UP → sin CRM · bug crítico", tooltip: "Suppliers que completaron registro en UserPilot pero nunca aparecieron en el CRM de GHL.\n\nCausa probable: el flujo de registro los expulsa y pide inicio de sesión en vez de ingresar al pipeline directamente." },
          { label: "Auditoría confirmada", value: "20", sub: "12,1% de contactados" }
        ],
        meta: [
          { label: "Suppliers meta", value: "620", sub: "Meta de activación total" },
          { label: "TTA meta", value: "≤ 5 días", sub: "Registro → activo público" },
          { label: "Primera orden", value: "≤ 25 días", sub: "Desde registro" },
          { label: "C1 · agosto", value: "104", sub: "Corte 31-ago" },
        ],
        seguimiento: [
          { label: "Listo para vender", value: "0", sub: "0 de 165 en CRM" },
          { label: "Nuevo registro", value: "42", sub: "Estancados · sin avanzar" },
          { label: "Primera auditoría", value: "15-jul", sub: "1 proveedor agendado" },
          { label: "Dashboard tiempos", value: "15-jul", sub: "Enrique lo prepara" }
        ]
      }
    },
    {
      code: "NEG-001",
      name: "Negociaciones · Piloto con Comunidades",
      status: "🔴 Detenida · TI pausó carga masiva hasta NEG-002",
      statusColor: "#EF4444",
      color: "#10B981",
      mueve: "Negociaciones formalizadas → comisiones acordadas → GMV",
      hipotesis: "Piloto: 1 líder de comunidad con 5 negociaciones",
      gmv: "Fase 1: Transacciones controladas",
      avance: "TI (José) detuvo la carga masiva de negociaciones. La funcionalidad de carga masiva solo se ejecutará cuando el proyecto NEG-002 arranque, y allí se le dará prioridad. Mientras tanto, NEG-001 queda en estado detenido — no se puede escalar hasta que NEG-002 esté en sprint y entregue la carga masiva. Sin estimación de NEG-002 aún.",
      next: "⏳ Bloqueado por NEG-002: sin estimación de TI, NEG-001 no puede escalar. Seguimiento a José para fecha de arranque de NEG-002.",
      badge: "🔴 Detenida · Espera NEG-002",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Estado", value: "Detenida", sub: "TI pausó carga masiva" },
          { label: "Causa", value: "NEG-002", sub: "Carga masiva va en ese proyecto" }
        ],
        meta: [
          { label: "Desbloqueo", value: "Cuando NEG-002 arranque", sub: "Sin estimación aún" }
        ],
        seguimiento: [
          { label: "Estimación NEG-002", value: "Pendiente TI", sub: "Bloquea NEG-001" },
          { label: "Bug descarga Excel", value: "Sin resolver", sub: "Solo exporta 120 productos" }
        ]
      }
    },
    {
      code: "COM-001",
      name: "Combos · Integración Shopify + CAS + ECOM Scanner",
      status: "🔴 Pendiente fecha · José canceló weekly",
      statusColor: "#EF4444",
      color: "#7C3AED",
      mueve: "Canal Shopify completo con combos + CAS + ECOM Scanner",
      hipotesis: "Lanzamiento dependiente de confirmación de José (TI)",
      gmv: "Habilita Shopify completo para suppliers con combos",
      avance: "Aún no lanzado. Dependemos de la fecha de lanzamiento que nos dé José desde TI. José canceló el weekly de hoy 8-jul, por lo que seguimos sin fecha confirmada.",
      next: "😢 Bloqueado: José canceló el weekly — sin fecha de lanzamiento. Reagendar con José para obtener fecha de salida.",
      badge: "🔴 Sin fecha · Weekly cancelado",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Estado", value: "Pendiente", sub: "Sin fecha de TI" },
          { label: "Frentes listos", value: "4 de 4", sub: "Shopify, CAS, Ecom, Icom" }
        ],
        meta: [
          { label: "Fecha lanzamiento", value: "Pendiente José", sub: "Weekly cancelado 8-jul" }
        ],
        seguimiento: [
          { label: "Respuesta TI", value: "Sin fecha", sub: "Reagendar con José" }
        ]
      }
    },
    {
      code: "COM-002",
      name: "Combos · Desde Dropshipper",
      status: "⏳ En espera · Entra después de NEG-002",
      statusColor: "#7C3AED",
      color: "#7C3AED",
      mueve: "Dropshippers crean y gestionan sus propios combos → más importaciones",
      hipotesis: "Dar control al dropshipper de crear combos aumenta el ticket promedio",
      gmv: "Incremento en valor por orden — módulo habilitador",
      avance: "Sin handoff ni estimación aún. TI no puede recibir COM-002 hasta que NEG-002 arranque y se complete. Dependemos del arranque de NEG-002 para poder hacer handoff y entrar a estimación.",
      next: "⏳ Bloqueado por NEG-002: sin estimación de TI, sin fecha de entrada a sprint. PM listo cuando TI esté disponible.",
      badge: "⏳ Bloqueado · Espera NEG-002",
      badgeColor: "#7C3AED",
      metricas: {
        base: [
          { label: "HUs listas", value: "10", sub: "CD-01 a CD-10 · PM completo" },
          { label: "Handoff TI", value: "Sin fecha", sub: "Espera NEG-002" }
        ],
        meta: [
          { label: "Inicio dev estimado", value: "~18-ago", sub: "Roadmap S2 — condicional" }
        ],
        seguimiento: [
          { label: "Desbloqueo", value: "Post NEG-002", sub: "Sin estimación aún" }
        ]
      }
    },
    {
      code: "DESC-001",
      name: "Descuentos · Precio Antes/Ahora",
      status: "⏳ En espera · Entra después de NEG-002",
      statusColor: "#F59E0B",
      color: "#F59E0B",
      mueve: "Tasa de importación en campañas · GMV incremental Cyber Days",
      hipotesis: "El descuento visible aumenta la importación de productos de campaña vs. sin precio tachado",
      gmv: "Enabler de Cyber Days y todas las campañas DCA",
      avance: "Prototipo interactivo listo (Michelle 6-jul: Vista Proveedor + Vista Dropshipper), ya disponible para el piloto CAT. Sin handoff ni estimación de TI — TI no puede recibir DESC-001 hasta que NEG-002 arranque y se complete. El prototipo se está probando con suppliers reales en el piloto de hoy.",
      next: "⏳ Bloqueado por NEG-002 para arranque TI. En paralelo: probar con suppliers en piloto hoy (8-jul) y mañana.",
      badge: "⏳ Piloto activo · Espera NEG-002 para dev",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Prototipo", value: "Listo", sub: "Michelle 6-jul · probando hoy" },
          { label: "Canales cubiertos", value: "6", sub: "Dropi · Shopify · WooC · TN · CAS · Scanner" }
        ],
        meta: [
          { label: "Trigger", value: "Cyber Days", sub: "Agosto — en riesgo" },
          { label: "Handoff TI", value: "Sin fecha", sub: "Espera NEG-002" }
        ],
        seguimiento: [
          { label: "Prueba suppliers", value: "Hoy 8-jul + mañana", sub: "Piloto CAT · 3 frentes" },
          { label: "Desbloqueo dev", value: "Post NEG-002", sub: "Sin estimación aún" }
        ]
      }
    },
    {
      code: "DCA-001 + DCA-002",
      name: "Campañas de catálogo · Cyber Days",
      status: "🚀 Experimento activo · Reunión Cyber Days jueves",
      statusColor: "#0EA5E9",
      color: "#0EA5E9",
      mueve: "Órdenes + GMV por curaduría de catálogo y descuentos",
      hipotesis: "149.300–626.000 órdenes/año (base según fase)",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "🚀 Reunión HOY 8-jul con el equipo para definir productos elegibles, revisar lo que ya está configurado y arrancar diseños y campaña. El experimento manual de campañas (DCA-001) ya lleva semanas acumulando insights. Habilitador técnico DESC-001 en piloto hoy con suppliers reales — en espera de resolución de bloqueo con TI para su desarrollo.",
      next: "Hoy 8-jul: definir productos Cyber Days + kick-off diseños con el equipo. Confirmar fecha exacta de la campaña. Seguimiento a bloqueo DESC-001 con José.",
      badge: "🚀 Reunión Cyber Days · HOY 8-jul",
      badgeColor: "#0EA5E9",
      metricas: {
        base: [
          { label: "Reunión equipo", value: "Hoy 8-jul", sub: "Productos + configuración + diseños" },
          { label: "Hipótesis base", value: "149.300", sub: "Órdenes/año DCA-001" }
        ],
        meta: [
          { label: "Fecha campaña", value: "Por confirmar", sub: "Se define hoy" },
          { label: "GMV potencial", value: "USD 2,24M", sub: "Escenario estándar" }
        ],
        seguimiento: [
          { label: "Habilitador técnico", value: "DESC-001", sub: "Go/No-go wallet esta semana" },
          { label: "TOBE listo", value: "~oct 31", sub: "Según roadmap S2" }
        ]
      }
    },
    {
      code: "CAZ-001",
      name: "Caza Productos · Canal de demanda",
      status: "🔴 Bug sin resolver · Prueba en piloto CAT esta semana",
      statusColor: "#EF4444",
      color: "#EF4444",
      mueve: "Demanda real → productos activados → órdenes",
      hipotesis: "Maximizar respuestas de suppliers genera más negociaciones cerradas",
      gmv: "54.000 órdenes/año con semántica activa",
      avance: "El bug de WhatsApp (0.22% CTR) sigue sin reproducir con TI. Las sesiones de piloto CAT-001 (10 suppliers reales) ahora incluyen también la interfaz de Caza Productos para explorar el flujo de usuario directamente. Si se detecta algo, el desarrollador puede conectarse.",
      next: "Ejecutar sesiones piloto con 10 suppliers (frente CAZ-001: interfaz y búsqueda). Si se reproduce el bug → conectar desarrollador de TI en el momento.",
      badge: "🔴 Bug pendiente · piloto esta semana",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "WhatsApp CTR", value: "0.22%", sub: "2 clics de 882 intentos" },
          { label: "Proveedores activos", value: "56", sub: "Caída del -68% desde 174" }
        ],
        meta: [
          { label: "Órdenes/año base", value: "54.000", sub: "Con semántica activa" },
          { label: "Apertura países", value: "~15-ago", sub: "Según roadmap S2" }
        ],
        seguimiento: [
          { label: "Bug WhatsApp", value: "Sin reproducir", sub: "Prueba en piloto CAT" },
          { label: "Interfaz suppliers", value: "Piloto esta semana", sub: "10 suppliers reales" }
        ]
      }
    },
    {
      code: "CAT-001",
      name: "Categorización y enriquecimiento del catálogo",
      status: "🟡 Piloto con 10 suppliers · 3 frentes simultáneos",
      statusColor: "#3B82F6",
      color: "#3B82F6",
      mueve: "Habilita búsquedas, campañas y SEO",
      hipotesis: "Árbol comercial aprobado → categorización técnica con IA",
      gmv: "Estructura del catálogo de Dropi",
      avance: "Piloto iniciado hoy 8-jul con 2 suppliers. Los 3 frentes en las mismas sesiones: árbol CAT-001 + interfaz CAZ-001 + prototipo DESC-001 (precio antes/ahora). Mañana 9-jul continúan las sesiones con el resto de suppliers. Los insights de las sesiones son los que se llevan a la mesa con stakeholders (Jacki + Category Manager).",
      next: "Mañana 9-jul: continuar sesiones piloto con el resto de los suppliers. Con insights completos: agendar mesa con Jacki y Category Manager.",
      badge: "🟡 Piloto activo · 2 hoy + resto mañana",
      badgeColor: "#3B82F6",
      metricas: {
        base: [
          { label: "Categorías duplicadas", value: "42", sub: "Ej. Belleza y Salud vs Salud y Belleza" },
          { label: "Categorías con typos", value: "18", sub: "Ej. Tecnolojia, Hogar y decoracion" },
          { label: "Productos en 'Otros'", value: "~35%", sub: "Clasificación errónea" }
        ],
        meta: [
          { label: "Suppliers piloto", value: "10", sub: "Usuarios reales esta semana" },
          { label: "Frentes en piloto", value: "3", sub: "CAT + CAZ + DESC" },
          { label: "Mesa stakeholders", value: "Post-piloto", sub: "Con insights reales" }
        ],
        seguimiento: [
          { label: "Agenda sesiones", value: "Por definir", sub: "Guion + liderazgo por frente" },
          { label: "Handoff a dev", value: "~28-jul", sub: "Según roadmap S2" }
        ]
      }
    },
    {
      code: "NEG-002",
      name: "Negociaciones · Supplier↔Dropshipper",
      status: "⏳ Listo PM · Esperando estimación TI",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Negociaciones directas supplier↔dropshipper → GMV incremental",
      hipotesis: "Habilitar negociación directa aumenta conversión de catálogo a orden",
      gmv: "Oportunidad confirmada por María — dimensionamiento en discovery",
      avance: "Handoff a José cerrado el 3-jul. Feedback recibido incorporado — documentación PM actualizada y lista para que TI estime. Pendiente respuesta de José con la estimación del proyecto.",
      next: "⏳ Pendiente TI (José): ¿cuándo viene la estimación de NEG-002? Todo listo de parte de PM.",
      badge: "⏳ Estimación pendiente TI",
      badgeColor: "#6366F1",
      metricas: {
        base: [
          { label: "Handoff TI", value: "3-jul", sub: "Cerrado · feedback incorporado" },
          { label: "Confirmación María", value: "22-jun", sub: "Oportunidad aprobada" }
        ],
        meta: [
          { label: "Estimación TI", value: "Pendiente José", sub: "PM listo con feedback" }
        ],
        seguimiento: [
          { label: "HUs técnicas", value: "Pendiente estimación", sub: "Post-respuesta José" },
          { label: "Reunión Juan Diego", value: "Pendiente", sub: "Contexto histórico PM" }
        ]
      }
    },
  ],
  documentos: [
    {
      code: "DESC-001",
      nombre: "Precio Antes / Precio Ahora — Documentación E2E",
      descripcion: "5 entregables completos: Kick-off, Discovery (AS-IS + benchmark 5 plataformas), Definición (3 fases), Following (métricas HEART + SEQ), Hand-off a TI (JTBD, C4, glosario, 8 reglas de negocio, 4 módulos Gherkin). Prototipo interactivo Vista Proveedor + Vista Dropshipper (Michelle, 6-jul).",
      tipo: "E2E",
      color: "#F59E0B",
      href: "/desc001-precio-antes-ahora-e2e.html",
      proyecto: "DCA-001 / DCA-002 · Campañas de catálogo",
      fecha: "06-jul-2026",
    } as Documento,
  ],
  dolores: [],
  resumen: "Actualizado al 8-jul: la primera semana de seguimiento de <strong>TTV-001</strong> dejó un hallazgo crítico — <strong>111 de los 243 suppliers registrados en UserPilot desde el 30-jun nunca llegaron al CRM</strong> (46% en el limbo). El flujo de registro los expulsa pidiéndoles que inicien sesión en vez de ingresarlos directamente al pipeline. Queda como pendiente urgente para <strong>José (TI): ¿por qué el registro expulsa al usuario y le pide iniciar sesión en vez de ingresarlo directamente al CRM?</strong> Del pipeline real: 20 en Auditoría confirmada, 42 estancados en Nuevo registro, 0 Listos para vender. Primera auditoría agendada para el 15-jul. En positivo, la semana cerró con dos lanzamientos: <strong>NEG-001</strong> con comunicación masiva el 6-jul y <strong>COM-001</strong> (Combos Shopify + CAS + ECOM Scanner) el 7-jul. Los handoffs de <strong>COM-002</strong> y <strong>DESC-001</strong> con José quedaron cerrados — ambos entran a la cola de estimación de TI. Las pruebas piloto de <strong>CAT-001</strong> se ampliaron a 3 frentes simultáneos (árbol categorías + interfaz CAZ-001 + prototipo DESC-001) con los mismos 10 suppliers reales. <strong>CAZ-001</strong> sigue con el bug de WhatsApp sin resolver. Adicionalmente, se levantaron <strong>6 hallazgos de experiencia propia en el catálogo</strong> para llevar a José: 2 bugs críticos de búsqueda (resultados inconsistentes + semántica IA incompleta), 2 mejoras urgentes de UX (ordenamiento exclusivos→premium→verificados + renombrar 'Premium Exclusivo' a 'Exclusivos Dropi'), y 2 ideas nuevas (favoritos en carpetas/catálogos + comparador de productos) candidatas al Setboard. El jueves 10-jul hay reunión de alineación de <strong>Cyber Days</strong> con Natalia, Kevin y Michelle.",
  proximosPasos: [
    {
      titulo: "Esta semana (hasta 11 jul 2026)",
      color: "#F77F00",
      items: [
        "🔴 TTV-001: preguntar a José (TI) por qué el registro expulsa al usuario en vez de ingresarlo al CRM directamente.",
        "📋 Llevar a José los 6 reportes de experiencia de catálogo: 2 bugs críticos de búsqueda (inconsistencia + semántica IA), 2 mejoras urgentes UX (orden exclusivos→premium→verificados + renombrar 'Premium Exclusivo' → 'Exclusivos Dropi'), 2 ideas Setboard (favoritos en carpetas + comparador de productos).",
        "Ejecutar sesiones piloto con 10 suppliers reales (3 frentes: CAT árbol + CAZ interfaz + DESC prototipo) — definir agenda, guion y liderazgo.",
        "Jueves 10-jul: reunión Cyber Days con Natalia, Kevin y Michelle — confirmar fecha y productos elegibles.",
        "DESC-001: Go/No-go técnico de wallet con José — si verde → entra a sprint para Cyber Days.",
        "CAZ-001: aprovechar piloto CAT para explorar flujo con suppliers reales; si surge el bug → conectar desarrollador.",
        "TTV-001: capacitación al equipo comercial (Erika) hoy 8-jul."
      ]
    },
    {
      titulo: "Semana 14-jul",
      color: "#7C3AED",
      items: [
        "15-jul: segunda reunión de seguimiento TTV-001 — dashboard tiempos entre etapas (Enrique) + resultado auditoría #1.",
        "CAT-001: con los insights del piloto, agendar la mesa con Jacki y Category Manager.",
        "NEG-002: reunión de contexto con Juan Diego (PM anterior) para contexto histórico del proyecto.",
        "CAZ-001: siguiendo resultado del piloto, decidir si la apertura de países avanza o espera el bug.",
        "DCA-001: seguimiento del experimento manual de campañas — primeros insights."
      ]
    },
    {
      titulo: "Hitos de julio",
      color: "#10B981",
      items: [
        "TTV-001: primera auditoría completada (15-jul) · cuello de botella identificado (Nuevo registro).",
        "Cyber Days (agosto): DESC-001 Fase 1 + DCA campañas activas — depende del Go/No-go wallet.",
        "CAT-001: pruebas piloto con usuarios reales → aprobación árbol por stakeholders.",
        "CAZ-001 (~28-jul): handoff a dev si piloto confirma árbol/interfaz.",
        "NEG-001: métricas de adopción post-comunicación masiva del 6-jul."
      ]
    }
  ]
};
