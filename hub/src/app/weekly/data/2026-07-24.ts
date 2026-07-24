import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 21–27 jul 2026",
  subtitle: "27-jul T0 en 3 días · Pulso: 535 Pareto, señal Stock, auto-señal · DCA-001 meet 1-ago · Cyber Days imágenes listas",
  heroBadge: "Semana 24 jul · T-3 al lanzamiento",
  heroTitle: "T-3 al 27-jul · Activación + Dropi Pulso arrancan\n+ Pulso: 535 Pareto, señal Stock requerida · DCA-001 meet 1-ago",
  heroStrip: [
    { label: "T0 medición", value: "27-jul", sub: "Activación + Dropi Pulso · en 3 días" },
    { label: "Pareto Pulso", value: "535", sub: "Usuarios gestionados · 4→2 campañas/u" },
    { label: "DCA-001 meet", value: "1-ago", sub: "Kick-off suppliers · lanzamiento 11-ago" },
    { label: "Meta C1 · TTV", value: "104", sub: "Activos al 31-ago" },
    { label: "Cola dev", value: "🔴 Detenida", sub: "José canceló weekly 2ª semana" },
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "TTV-001 · Plan de choque activo — Fast Track / alto potencial, semana del 28-jul entrevistas",
      descripcion: "El plan de choque fue socializado y la célula lo aprobó. El segmento target no es toda la base sino los suppliers Fast Track o de alto potencial — quienes declararon en la encuesta que pueden mover bastante volumen. La semana del 28-jul, Jaime y Michelle los contactarán para sacar insights: qué están esperando para activarse, qué tipo de proveedor necesitan. Esos insights van directo a Comercial para acelerar o no la auditoría. Mientras tanto: los dejan publicar y el equipo queda pendiente. Si se consiguen órdenes → se proratea el modelo y se lleva a Lucho/TI como evidencia de valor percibido para agilizar la automatización a escala. Pendiente crítico: validación de Emerson (llegó el lunes de licencia de paternidad).",
      proyecto: "TTV-001",
      tipo: "Decisión",
      tipoColor: "#7C3AED",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "IND-001 · Ascensos fast track sin firma — Comercial simplificó el proceso, María valida con Legal",
      descripcion: "El equipo Comercial confirmó que para los ascensos NO es necesario firmar contrato ni DocuSign. El proceso es: supplier acepta el ascenso → se envía un correo a Soporte → Soporte cambia el tipo de cuenta. La plataforma ya está construida y socializada. María Ossa confirmó que hará una validación con Legal antes de iniciar — el proceso no arranca hasta que ella dé el visto bueno. La mejora de interfaz está aprobada como fasttrack con mensajes WA incluidos.",
      proyecto: "IND-001",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "DCA-001 · Cyber Days — meet corrido al 1-ago, curaduría eliminada, imágenes de productos listas",
      descripcion: "El meet con proveedores (kick-off) se corrió al viernes 1-ago — el timing de la semana pasada era muy ajustado. La etapa de curaduría fue eliminada del plan original, lo que libera una semana. Imágenes de productos para Cyber Days ya están recopiladas y listas en Desktop (formato para Canva). Dependencia activa: autorización de Meta para la plantilla de WhatsApp — fallback: Jaime envía manual desde su celular (son pocos proveedores, es viable). Michelle finaliza copies esta semana para pasarlos a Enrique. El lanzamiento del 11-ago se mantiene.",
      proyecto: "DCA-001",
      tipo: "Dato",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "Dropi Pulso · RB-005 · El equipo de Cuidado de Campañas gestiona 535 usuarios del Pareto con 3 herramientas paralelas — todo manual",
      descripcion: "Research RB-005 con equipo de Cuidado de Campañas (Natalia, Valentina, Luisa, Juliana, Franshesca — 21-jul, 2 sesiones). El equipo trabaja con 535 usuarios del Pareto (505 base + 30 de la comunidad de Iván Caicedo). Meta: 4 campañas/usuario/mes. Promedio actual: 2 — 50% de la meta. La brecha es operativa, no de motivación. Las 3 herramientas en paralelo: Power BI (métricas) + Nexus (tickets) + Excel (semáforo propio con 111K IDs de producto). Valentina: 'Esto está hecho con las uñas.' Natalia: 'Lo que menos quiero es generar doble trabajo.' El ciclo diario: revisar BI → consultar stock en Dropy uno a uno → calcular días de stock → actualizar Excel → escalar si es 🔴 (≤5 días) por WhatsApp. 20 cuidados de campaña/persona/día es la meta.",
      proyecto: "Dropi Pulso",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "Dropi Pulso · Valentina pidió explícitamente agregar señal 'Stock' a Pulso — es la funcionalidad más urgente",
      descripcion: "Hallazgo clave de la sesión: Valentina García (Lead Cuidado de Campañas) pidió de forma explícita agregar 'Stock' como tipo de señal en Dropi Pulso. Hoy cuando un producto cae a ≤5 días de stock, la escalación al proveedor es por WhatsApp directo — sin trazabilidad, sin confirmación de recibido, sin historial. La propuesta de auto-señal (Excel con datos de riesgo → Pulso detecta 🔴 → crea señal automáticamente) también obtuvo respuesta positiva: 'Sería buenísimo.' El bug de IDs de producto (Cronos ≠ Dropy) impide hoy la automatización — Diego intentó y falló. Valentina: 'Necesitamos la señal de Stock — cuando un producto del Pareto cae a 5 días o menos, tenemos que escalarle al proveedor y hoy no tenemos un canal para eso.'",
      proyecto: "Dropi Pulso",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-006",
      titulo: "Dropi Pulso · Riesgo de concentración confirmado — 50+ dropshippers en un mismo producto colapsó stock de aires acondicionados",
      descripcion: "Valentina reveló el patrón de riesgo más crítico para el ecosistema de campañas: 52 dropshippers vendiendo el mismo estimulante de barba Apolo, 50 dropshippers en el mismo aire acondicionado. Resultado del AC: los proveedores se quedaron sin stock y 50 dropshippers quedaron con campañas activas sin inventario. 'Los proveedores se quedaron sin stock. ¿Y qué tenemos en este momento? Un déficit para que ellos sigan escalando esas campañas.' Este patrón es prevenible con alertas automáticas de concentración. Umbral a definir con el equipo: ¿20 drops? ¿30 drops? La alerta debe ir al proveedor y al equipo de Cuidado de Campañas simultáneamente.",
      proyecto: "Dropi Pulso",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-007",
      titulo: "Nexus (herramienta de solicitudes) tiene 4 fallas estructurales — genera doble registro y trabajo perdido",
      descripcion: "El equipo usa Nexus para gestionar solicitudes de búsqueda de producto. Volumen: 229 solicitudes registradas, de las cuales ≈76 son únicas — el resto son triplicaciones porque cada solicitud se registra 3 veces (una por nivel: Premium, Verificado, No Verificado). Los 4 fallos: (1) Observaciones no sincronizan — Franshesca anota algo, las chicas no lo ven; ellas responden, Fran no lo ve. (2) Fran pierde visibilidad del caso en cuanto le da respuesta — ya no puede editar ni ver si las chicas necesitan algo más. (3) No hay opción 'seguir buscando' — si la primera respuesta no funciona, hay que cerrar el caso y abrir uno nuevo desde cero. (4) El correo del dropshipper no aparece en la vista de Fran. Consecuencia: crearon un Excel adicional para registrar lo que ya registran en Nexus. Franshesca: 'Me gustaría que las observaciones quedaran como un tipo WhatsApp, que cuando yo le responda aparezca acá.'",
      proyecto: "Dropi Pulso / CAZ-001",
      tipo: "Hallazgo",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-008",
      titulo: "Dropi Pulso · 1 producto = 10+ IDs distintos — proyecciones de temporada imposibles sin estandarización",
      descripcion: "El hallazgo técnico más importante del research: el mismo producto puede existir con 10+ IDs distintos porque cada proveedor lo carga con su propio nombre y genera su propio ID. Ejemplo: 'Bellaskin Solo', 'Bellaskin solo 60ml', 'Aceite Bellaskin', 'Bellaskin + obsequio' — todos son el mismo producto. Valentina manejó una base de 111,000 IDs de producto y no pudo hacer proyecciones por producto real — tuvo que hacerlas por ID. Valentina: 'Tengo 111,000 IDs de producto y pues ya el pobre Excel me dijo No más, no más.' Relación directa con CAT-001: si la categorización unifica IDs, desbloquea las proyecciones de Valentina, el cálculo de días de stock y las alertas de concentración de Pulso.",
      proyecto: "Dropi Pulso / CAT-001",
      tipo: "Hallazgo",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-009",
      titulo: "Cola dev detenida — José canceló el weekly por segunda semana consecutiva · escalar a María",
      descripcion: "José Giraldo canceló el weekly del 21-jul — segunda semana consecutiva. Combos sigue pausado. Negociaciones sigue pausado. Todo lo que está en cola de desarrollo permanece sin movimiento y sin ETA. El bug de auto-login de TTV-001 lleva dos semanas en Jira sin respuesta. NEG-001 tenía prometida la carga masiva para el 21-jul — sin confirmación de si salió. El Pendientes TI del 22-jul documenta 5+ proyectos en cola sin ETA de desarrollo y dos proyectos de corrección de facturación (Chile y Ecuador) con 2+ semanas en QA sin resolución. Es momento de escalar con María.",
      proyecto: "TI / Cola dev",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-010",
      titulo: "ESP-001 · Escucha de canales (espionaje comercial) — nuevo proyecto iniciado esta semana",
      descripcion: "Se creó e inició el proyecto ESP-001 Escucha de canales. El objetivo es capturar inteligencia comercial de canales externos (competencia, comunidades, redes) para informar la estrategia de catálogo y campañas. La plataforma base y el research HTML ya están construidos y subidos al hub. Es un proyecto en exploración — no tiene ETA de lanzamiento, pero el research ya aporta contexto para DCA-001 y CAZ-001.",
      proyecto: "ESP-001",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Medio",
    },
  ],
  oportunidades: [
    {
      code: "TTV-001",
      name: "Time to Value · Plan de Choque Fast Track",
      status: "🟡 Plan activo · 27-jul T0 en 3 días · Emerson pendiente",
      statusColor: "#F59E0B",
      color: "#10B981",
      mueve: "Primeras órdenes de suppliers Fast Track → modelo de activación a escala",
      hipotesis: "Con seguimiento directo al segmento de alto potencial se generan las primeras órdenes y se valida el modelo antes de automatizarlo",
      gmv: "~105.000 órdenes/año proyectado si el modelo escala",
      avance: "Plan de choque socializado — célula alineada. Segmento target: Fast Track / alto potencial (declararon en encuesta que pueden mover bastante volumen). El 27-jul es el T0 de medición — el pipeline GHL y el onboarding tour están operativos. Semana del 28-jul: Jaime y Michelle contactan Fast Track para entrevistas → insights a Comercial para acelerar auditorías. Pendiente: validación de Emerson (llegó el 21-jul de licencia). Bug de auto-login sigue en Jira sin respuesta de José — 2ª semana.",
      next: "Confirmar T0 27-jul: pipeline GHL corre de punta a punta. Validar plan con Emerson esta semana. Semana 28-jul: contactar Fast Track + entrevistas + insights a Comercial. Seguimiento al bug en Jira.",
      badge: "🟡 T0 27-jul · Emerson pendiente",
      badgeColor: "#F59E0B",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Registrados UP", value: "463+", sub: "Cohorte activa desde 30-jun", tooltip: "Cohorte activa desde que el pipeline se encendió el 30-jun-2026." },
          { label: "Activos", value: "0", sub: "Sin conversiones aún" },
          { label: "Bug auto-login", value: "En Jira · 2ª sem", sub: "José sin respuesta" },
        ],
        meta: [
          { label: "T0 medición", value: "27-jul", sub: "En 3 días" },
          { label: "Meta C1 · 31-ago", value: "104", sub: "Activos en ~35 días" },
          { label: "Meta total · 31-dic", value: "620", sub: "Suppliers activos" },
        ],
        seguimiento: [
          { label: "Validación Emerson", value: "Esta semana", sub: "Llegó 21-jul de licencia" },
          { label: "Entrevistas Fast Track", value: "Sem. 28-jul", sub: "Jaime + Michelle" },
          { label: "José weekly", value: "Cancelado 2ª vez", sub: "Sin update de TI" },
        ]
      }
    },
    {
      code: "IND-001",
      name: "Indicadores · Ascensos Fast Track",
      status: "🟡 Proceso simplificado · Pendiente validación Legal de María",
      statusColor: "#F59E0B",
      color: "#6366F1",
      mueve: "Suppliers que ya cumplen umbrales ascienden sin fricción — más visibilidad y retención",
      hipotesis: "Sin contrato formal el proceso de ascenso se acelera y la tasa de aceptación sube",
      gmv: "208 candidatos a Verificado · 29 a Premium — sin contactar aún",
      avance: "Comercial confirmó: no se necesita firma ni DocuSign. Proceso: supplier acepta → correo a Soporte → Soporte cambia el tipo. Plataforma ya construida y socializada con el equipo. María valida con Legal antes de arrancar. Mejora de interfaz aprobada como fasttrack con mensajes WA incluidos.",
      next: "Esperar confirmación de María post-Legal. Una vez confirmada: contactar los 208 candidatos a Verificado via WhatsApp desde la plataforma.",
      badge: "🟡 Pendiente validación Legal · María",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Plataforma", value: "Lista ✅", sub: "Construida y socializada" },
          { label: "Proceso", value: "Simplificado", sub: "Email a Soporte · sin firma" },
          { label: "Mejora interfaz", value: "Fast track ✅", sub: "Incluye mensajes WA" },
        ],
        meta: [
          { label: "Candidatos Verificado", value: "208", sub: "Cumplen umbral · sin contactar" },
          { label: "Candidatos Premium", value: "29", sub: "Cumplen umbral · sin contactar" },
        ],
        seguimiento: [
          { label: "Validación Legal", value: "Pendiente María", sub: "Blocker para arrancar" },
        ]
      }
    },
    {
      code: "DCA-001",
      name: "Campañas · Cyber Days 11-ago",
      status: "🟢 En rumbo · Meet 1-ago · Imágenes listas",
      statusColor: "#10B981",
      color: "#0EA5E9",
      mueve: "GMV incremental por campaña de catálogo curado Cyber Days",
      hipotesis: "149.300–626.000 órdenes/año según escala",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "Curaduría eliminada del plan (libera 1 semana). Imágenes de productos Cyber Days recopiladas y listas. Meet kick-off con suppliers corrido al viernes 1-ago — timing de esta semana muy ajustado. Michelle finaliza copies esta semana → Enrique. Autorización plantilla Meta WA pendiente — fallback: Jaime envía manual. Lanzamiento 11-ago se mantiene.",
      next: "Michelle → copies a Enrique esta semana. Confirmar autorización plantilla Meta. 1-ago: meet kick-off con suppliers. 3-ago: email instrucciones + Canva. 9-ago: cierre. 10-ago: publicación vestida. 11-ago: lanzamiento.",
      badge: "🟢 Meet 1-ago · Lanzamiento 11-ago",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Imágenes productos", value: "Listas ✅", sub: "Desktop · formato Canva" },
          { label: "Meet suppliers", value: "1-ago", sub: "Corrido desde 25-jul" },
          { label: "Plantilla Meta WA", value: "Pendiente auth", sub: "Fallback: envío manual Jaime" },
        ],
        meta: [
          { label: "Email instrucciones", value: "3-ago", sub: "Post kick-off" },
          { label: "Canva + productos", value: "3–9 ago", sub: "Suppliers suben piezas" },
          { label: "Lanzamiento", value: "11-ago", sub: "Se mantiene" },
        ],
        seguimiento: [
          { label: "Copies → Enrique", value: "Michelle · esta semana", sub: "Para lanzar CRM" },
          { label: "Curaduría", value: "Eliminada ✅", sub: "Libera 1 semana del cronograma" },
        ]
      }
    },
    {
      code: "Dropi Pulso",
      name: "Dropi Pulso · Señal Stock + 535 Pareto · 27-jul piloto",
      status: "🟡 RB-005 completo · Señal Stock prioritaria · Piloto 27-jul",
      statusColor: "#F59E0B",
      color: "#EC4899",
      mueve: "Señal Stock + auto-señal + panel unificado para equipo de Cuidado de Campañas",
      hipotesis: "Si el equipo de Cuidado de Campañas adopta Pulso como canal único, duplica cobertura de campañas sin agregar personas",
      gmv: "535 usuarios Pareto × brecha de 2 campañas/u = 1.070 campañas adicionales potenciales por mes",
      avance: "RB-005 completado (21-jul). Hallazgos clave: (1) Equipo gestiona 535 usuarios Pareto manualmente con 3 herramientas. Meta: 4 campañas/u, promedio actual: 2. (2) Valentina pidió señal 'Stock' explícitamente — escalación hoy es por WA sin trazabilidad. (3) Nexus tiene 4 fallas estructurales que generan doble trabajo. (4) Concentración: 50+ drops en mismo producto → stock colapsó (caso AC). (5) 1 producto = 10+ IDs → proyecciones imposibles (conecta con CAT-001). Plataforma + CRM WA listos. Piloto 27-jul con comunidad de Iván. Endpoint de Reinoso: pendiente mantenimiento BD.",
      next: "27-jul: piloto con comunidad de Iván (data manual si Reinoso no entrega). Agregar señal 'Stock' al roadmap de Pulso como prioridad. Definir umbral de alerta de concentración de drops. Sesión pendiente con Ronald/Bogotá (flujo de búsqueda física). Sesión con Diego/Miguel Ángel para bug de IDs.",
      badge: "🟡 Piloto 27-jul · Señal Stock requerida",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Pareto gestionados", value: "535", sub: "505 base + 30 comunidad Iván" },
          { label: "Meta campañas/u", value: "4 → actual 2", sub: "50% de la meta operativa" },
          { label: "Nexus solicitudes", value: "229 → ≈76 reales", sub: "Triplicadas por categoría" },
        ],
        meta: [
          { label: "Señal Stock", value: "Prioridad 1", sub: "Pedido explícito Valentina" },
          { label: "Alerta concentración", value: "Umbral por definir", sub: "¿20 o 30 drops/producto?" },
          { label: "Panel unificado", value: "Visión Natalia", sub: "Reemplazar Nexus + Excel" },
        ],
        seguimiento: [
          { label: "Piloto · T0", value: "27-jul", sub: "Comunidad de Iván" },
          { label: "Endpoint Reinoso", value: "Pendiente BD", sub: "Fallback: data manual" },
          { label: "Research pendiente", value: "Ronald / Diego", sub: "Flujo físico + bug IDs" },
        ]
      }
    },
    {
      code: "CAT-001 / CAZ-001",
      name: "Categorías · Caza Productos",
      status: "🟡 CAT-001 conecta con Pulso · CAZ-001 experimento CRM",
      statusColor: "#F59E0B",
      color: "#3B82F6",
      mueve: "Árbol comercial aprobado → categorización IA + búsqueda semántica + datos de stock para Pulso",
      hipotesis: "Unificar IDs de producto (CAT-001) desbloquea proyecciones de Valentina y alertas de concentración de Pulso",
      gmv: "Habilitador de búsqueda, SEO, campañas de catálogo y proyecciones de temporada",
      avance: "CAT-001: reunión del jueves con María el canal para desbloquear devs. CAZ-001: 6 entrevistas — 100% interés, 0% aha moment. Causas: matching roto, sin notificaciones, conversación muerta. Hallazgo de Pulso (RB-005) confirma que el problema de los 111,000 IDs sin estandarizar es el mismo que bloquea a CAT-001 — las dos iniciativas comparten el mismo cuello de botella técnico.",
      next: "CAT-001: seguimiento a asignación de devs post-reunión jueves. CAZ-001: experimento contacto manual vía CRM. Conectar explícitamente CAT-001 con el caso de uso de Valentina (proyecciones de temporada por producto).",
      badge: "🟡 CAT conecta con Pulso · CAZ experimento CRM",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Entrevistas CAZ", value: "6 realizadas", sub: "100% interés · 0% aha moment" },
          { label: "IDs de producto", value: "111.000", sub: "Sin estandarizar · caso Valentina" },
          { label: "Conexión con Pulso", value: "Confirmada", sub: "RB-005: mismo cuello de botella" },
        ],
        meta: [
          { label: "Devs CAT-001", value: "Reunión jueves", sub: "María como canal" },
          { label: "Experimento CAZ", value: "Contacto manual CRM", sub: "Matching activo" },
        ],
        seguimiento: [
          { label: "Reunión del jueves", value: "Seguimiento devs", sub: "CAT-001 debe estar presente" },
          { label: "Conexión CAT-Pulso", value: "Presentar caso Valentina", sub: "Argumento para priorizar devs" },
        ]
      }
    },
    {
      code: "NEG / COM / Cola",
      name: "Cola Dev · Bloqueada",
      status: "🔴 José canceló 2ª semana · Escalar a María",
      statusColor: "#EF4444",
      color: "#6B7280",
      mueve: "Negociaciones, Combos, DESC-001 — todos en espera",
      hipotesis: "Sin weekly de TI, sin estimaciones, sin ventana de ejecución",
      gmv: "~120K órdenes estimadas en cola",
      avance: "José canceló el weekly del 21-jul — segunda semana consecutiva. Combos pausado. Negociaciones pausado. NEG-001 tenía prometida carga masiva para el 21-jul — sin confirmación. Bug auto-login TTV lleva 2 semanas en Jira sin respuesta. DESC-001 crítico para Cyber Days 11-ago — en cola sin slot. El Pendientes TI del 22-jul documenta la situación completa: facturación Chile y Ecuador en QA 2+ semanas sin resolución, Sumsub sin compromiso de TI. Impacto: riesgo de incumplimiento del delivery backlog obligatorio de Q3.",
      next: "Escalar con María Ossa — la falta de comunicación con TI pone en riesgo el Dropi Score y los compromisos de Q3. Confirmar si NEG-001 carga masiva salió el 21-jul. Priorizar DESC-001 para Cyber Days 11-ago.",
      badge: "🔴 Sin update TI · 2ª semana · Escalar",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "NEG-001 carga masiva", value: "21-jul · sin confirmar", sub: "José sin weekly" },
          { label: "Combos", value: "Pausado", sub: "Dropify sin terminar" },
          { label: "Bug TTV auto-login", value: "Jira · 2ª sem", sub: "Sin respuesta de José" },
        ],
        meta: [
          { label: "DESC-001 · Cyber Days", value: "Crítico 11-ago", sub: "Sin slot en TI" },
          { label: "Facturación CL / EC", value: "2+ sem en QA", sub: "Sin resolución" },
        ],
        seguimiento: [
          { label: "Escalar a María", value: "Esta semana", sub: "Frente completo bloqueado" },
          { label: "Weekly TI", value: "Cancelado 2ª vez", sub: "José Giraldo" },
        ]
      }
    },
  ],
  documentos: [],
  dolores: [
    {
      frente: "José Giraldo — segunda semana sin weekly y sin respuesta · 5+ proyectos en riesgo",
      tag: "🔴 Riesgo estructural",
      tagColor: "#EF4444",
      salio: "Segunda semana consecutiva sin weekly de TI. Bug auto-login TTV en Jira sin respuesta. NEG-001 carga masiva prometida para 21-jul sin confirmación. Combos y Negociaciones detenidos indefinidamente. DESC-001 sin slot para Cyber Days 11-ago. Facturación Chile y Ecuador en QA 2+ semanas.",
      ruta: "Escalar con María Ossa esta semana — sin canal de comunicación activo con TI, los compromisos de Q3 (Dropi Score) están en riesgo",
      rutaColor: "#EF4444",
      metrica: "5+ proyectos en cola sin ETA · bug crítico 2 semanas · DESC-001 con deadline externo 11-ago",
      decision: "Escalar con María esta semana — ya no es opcional"
    },
    {
      frente: "Dropi Pulso · Equipo de Cuidado de Campañas opera con 3 herramientas paralelas — doble trabajo confirmado",
      tag: "🟡 Oportunidad operativa",
      tagColor: "#F59E0B",
      salio: "535 usuarios Pareto gestionados manualmente. Meta 4 campañas/u → actual 2. Nexus tiene 4 fallas estructurales que generan trabajo doble. Bug de IDs de producto bloquea automatización. El mismo proveedor gestiona 10+ IDs del mismo producto — proyecciones imposibles.",
      ruta: "Señal 'Stock' en Pulso como primera entrega de valor para el equipo. Luego: threading tipo WA en solicitudes. Largo plazo: panel unificado que reemplaza Nexus + Excel.",
      rutaColor: "#F59E0B",
      metrica: "Meta operativa: pasar de 2 a 4 campañas/usuario/mes con el mismo equipo",
      decision: "Señal Stock entra al roadmap de Pulso como prioridad — validar alcance técnico con Reinoso"
    },
  ],
  resumen: "Semana 24-jul · Estamos a <strong>3 días del 27-jul</strong> — el T0 de medición de activación automática y del piloto de <strong>Dropi Pulso</strong>. En <strong>TTV-001</strong> el plan de choque con el segmento Fast Track está activo; solo falta la validación de Emerson y que el pipeline GHL corra de punta a punta antes del domingo. La semana del 28-jul arranca el contacto directo con los suppliers de alto potencial. En <strong>IND-001</strong> el proceso se simplificó — sin firma ni DocuSign — y solo espera el visto bueno de María con Legal. En <strong>DCA-001</strong> las imágenes de productos Cyber Days ya están listas, el meet con suppliers se corre al <strong>1-ago</strong> y el lanzamiento del 11-ago se mantiene. Lo más rico de la semana viene del <strong>research RB-005 (Dropi Pulso)</strong>: el equipo de Cuidado de Campañas gestiona 535 usuarios del Pareto con 3 herramientas paralelas, lleva la meta de campañas al 50%, y Valentina pidió explícitamente agregar la señal <strong>'Stock'</strong> a Pulso — es la funcionalidad más urgente. El riesgo de concentración de dropshippers ya causó un colapso de stock real (50 drops → aires acondicionados sin inventario). El bug de IDs de producto (111K sin estandarizar) es el mismo cuello de botella de <strong>CAT-001</strong>. Del lado de <strong>TI</strong>: José canceló por segunda semana — es momento de escalar con María.",
  proximosPasos: [
    {
      titulo: "Esta semana · prioridad absoluta",
      color: "#7C3AED",
      items: [
        "27-jul: confirmar que el pipeline GHL corre de punta a punta — T0 de medición activa (TTV-001 + Dropi Pulso).",
        "Dropi Pulso: piloto con comunidad de Iván el 27-jul — data manual si Reinoso no entrega endpoint.",
        "Validar plan de choque TTV con Emerson esta semana.",
        "IND-001: esperar confirmación de María sobre validación con Legal.",
        "Escalar con María la falta de respuesta de TI — ya lleva 2 semanas. DESC-001 tiene deadline externo 11-ago.",
      ]
    },
    {
      titulo: "Esta semana · campañas",
      color: "#0EA5E9",
      items: [
        "DCA-001: Michelle finaliza copies y los pasa a Enrique para CRM.",
        "Confirmar autorización plantilla Meta WA — fallback: Jaime envía manual.",
        "Dropi Pulso: agregar señal 'Stock' al roadmap como prioridad — validar con Reinoso alcance técnico.",
        "Definir umbral de alerta de concentración de dropshippers (¿20 o 30 drops/producto?).",
      ]
    },
    {
      titulo: "Semana del 28-jul",
      color: "#6366F1",
      items: [
        "TTV-001: contactar suppliers Fast Track — entrevistas + insights a Comercial.",
        "Resultados día 1 del T0 de medición (activación automática + Dropi Pulso).",
        "DCA-001: meet kick-off con suppliers (1-ago, viernes).",
        "Dropi Pulso: agendar sesión con Ronald/Bogotá (flujo de búsqueda física no documentado).",
        "Dropi Pulso: agendar sesión con Diego/Miguel Ángel (bug de IDs de producto Cronos ≠ Dropy).",
        "CAT-001: conectar explícitamente el caso de Valentina (proyecciones por producto) para argumentar prioridad de devs con Lucho.",
      ]
    },
  ]
};
