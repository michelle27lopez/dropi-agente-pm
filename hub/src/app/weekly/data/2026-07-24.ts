import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 21–27 jul 2026",
  subtitle: "Plan de choque TTV con Fast Track · Ascensos sin firma formal · DCA-001 meet al 1-ago · 27-jul T0",
  heroBadge: "Semana 21 jul · T-6 al lanzamiento",
  heroTitle: "Plan de choque TTV activo · Ascensos sin contrato formal\n+ DCA-001 meet al 1-ago · Dropi Pulso ajustes con Natalia · 27-jul",
  heroStrip: [
    { label: "T0 medición", value: "27-jul", sub: "Activación + Dropi Pulso · en 6 días" },
    { label: "Plan de choque", value: "Activo", sub: "Fast Track · alto potencial" },
    { label: "DCA-001 meet", value: "1-ago", sub: "Corrido desde 25-jul · sin curaduría" },
    { label: "Meta C1 · TTV", value: "104", sub: "Activos al 31-ago" },
    { label: "Cola dev", value: "🔴 Detenida", sub: "José canceló weekly 2ª semana" },
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "TTV-001 · Plan de choque activo — Fast Track / alto potencial, semana del 28-jul entrevistas",
      descripcion: "El plan de choque fue socializado y la célula lo aprobó. El segmento target no es toda la base sino los suppliers Fast Track o de alto potencial — quienes declararon en la encuesta que pueden mover bastante volumen. La semana del 28-jul, Jaime y Michelle los contactarán para sacar insights: qué están esperando para activarse, qué tipo de proveedor necesitan. Esos insights van directo a Comercial para acelerar o no la auditoría. Mientras tanto: los dejan publicar y el equipo queda pendiente. Si se consiguen órdenes → se prorratea el modelo y se lleva a Lucho/TI como evidencia de valor percibido para agilizar la automatización a escala. Pendiente crítico: validación de Emerson (llegó hoy de licencia de paternidad).",
      proyecto: "TTV-001",
      tipo: "Decisión",
      tipoColor: "#7C3AED",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "IND-001 · Ascensos fast track sin firma — Comercial simplificó el proceso, María valida con Legal",
      descripcion: "El equipo Comercial confirmó que para los ascensos NO es necesario firmar contrato ni DocuSign. El proceso es: supplier acepta el ascenso → se envía un correo a Soporte → Soporte cambia el tipo de cuenta. La plataforma ya está construida y socializada. Sin embargo, María Ossa confirmó que hará una validación con Legal antes de iniciar — el proceso no arranca hasta que ella dé el visto bueno. La mejora de interfaz está aprobada como fasttrack con mensajes WA incluidos.",
      proyecto: "IND-001",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "DCA-001 · Campañas — meet corrido al 1-ago, curaduría eliminada del plan",
      descripcion: "Michelle está ajustando los copies de mensajes para la campaña Cyber Days. La etapa de curaduría fue eliminada del plan original, lo que libera una semana. El meet con proveedores (kick-off) se corre al viernes 1-ago — el timing de esta semana estaba muy ajustado para enviar los mensajes y preparar la convocatoria. Dependencia activa: autorización de Meta para la plantilla de WhatsApp. Fallback si no llega: Jaime envía manual desde su celular (son pocos proveedores, es viable). Mañana en la célula: sesión de alineación del plan para que todos estén al día. Michelle tiene reunión pendiente con Majo.",
      proyecto: "DCA-001",
      tipo: "Dato",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "Dropi Pulso · Reunión con equipo de Cuidado de Campañas — hallazgo: 535 usuarios gestionados manualmente en Excel, señal 'Stock' requerida",
      descripcion: "La reunión con Natalia reveló el workflow real del equipo: Valentina, Luisa y Juliana gestionan el 'cuidado de campañas' de 535 usuarios del Pareto (505 base + 30 de la comunidad de Iván). Meta: 4 campañas por usuario, promedio actual 2. El proceso es 100% manual: revisan el BI a diario, consultan stock en Dropy uno a uno, calculan días de stock restante y priorizan en Excel con colores (🔴 ≤5 días, 🟡 media, 🟢 baja). Valentina pidió agregar 'stock' como tipo de señal en Dropi Pulso para escalar alertas al proveedor cuando el stock es crítico. Blocker de datos: Diego (analítica) intentó automatizar el stock pero los IDs de producto no coinciden en la BD. La reunión se cortó por caída de internet (min ~10) — no se llegó al feedback de interfaz. Jaime hará seguimiento directo con Natalia.",
      proyecto: "Dropi Pulso",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "Cola dev detenida — José canceló el weekly por segunda semana consecutiva",
      descripcion: "José Giraldo canceló el weekly de hoy (21-jul). Combos sigue pausado. Negociaciones sigue pausado. Todo lo que está en cola de desarrollo permanece sin movimiento y sin ETA. Es la segunda semana consecutiva sin comunicación con TI. El bug de auto-login de TTV-001 lleva dos semanas en Jira sin respuesta. NEG-001 tenía prometida la carga masiva para el 21-jul — sin weekly, no hay confirmación de si salió.",
      proyecto: "TI / Cola dev",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-006",
      titulo: "Darwin · Juan Diego activo — faltan Cata, Paula, Francisco, Diana, Kate",
      descripcion: "El onboarding al hub Darwin sigue en curso. Juan Diego ya está activo. Pendientes de incorporar: Cata, Paula Macías, Francisco (no confirmado si usará Darwin), Diana (Dropy Pay — gestionará sus proyectos solo) y Kate (no está usando la versión nueva). Se van a agregar todos al grupo 'Bienvenidos a Darwin' para evitar multiplicar grupos. Laura lidera el seguimiento de quién falta.",
      proyecto: "Darwin",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Bajo",
    },
  ],
  oportunidades: [
    {
      code: "TTV-001",
      name: "Time to Value · Plan de Choque Fast Track",
      status: "🟡 Plan activo · Emerson pendiente · 27-jul T0",
      statusColor: "#F59E0B",
      color: "#10B981",
      mueve: "Primeras órdenes de suppliers Fast Track → modelo de activación a escala",
      hipotesis: "Con seguimiento directo al segmento de alto potencial se generan las primeras órdenes y se valida el modelo antes de automatizarlo",
      gmv: "~105.000 órdenes/año proyectado si el modelo escala",
      avance: "Plan de choque socializado — célula alineada. Segmento target: Fast Track / alto potencial (declararon en encuesta que pueden mover bastante volumen). Semana del 28-jul: Jaime y Michelle los contactan para entrevistas → insights a Comercial para acelerar auditorías. Mientras tanto: los dejan publicar. Objetivo paralelo: si se consiguen órdenes → prorratear el modelo y llevarlo a Lucho/TI como evidencia de valor percibido. Pendiente: validación de Emerson (llegó hoy de licencia).",
      next: "Validar con Emerson esta semana. 27-jul: T0 de medición de activación automática. Semana del 28-jul: contactar Fast Track para entrevistas + insights a Comercial.",
      badge: "🟡 Emerson pendiente · 27-jul T0",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Registrados UP", value: "463+", sub: "Cohorte activa desde 30-jun" },
          { label: "Activos", value: "0", sub: "Sin conversiones aún" },
          { label: "Bug auto-login", value: "En Jira · 2ª sem", sub: "José sin respuesta" },
        ],
        meta: [
          { label: "T0 medición", value: "27-jul", sub: "Activación automática arranca" },
          { label: "Meta C1 · 31-ago", value: "104", sub: "Activos en ~40 días" },
          { label: "Entrevistas Fast Track", value: "Sem. 28-jul", sub: "Jaime + Michelle" },
        ],
        seguimiento: [
          { label: "Validación Emerson", value: "Esta semana", sub: "Llegó hoy de licencia" },
          { label: "José weekly", value: "Cancelado 2ª vez", sub: "Sin update de TI" },
          { label: "Plan de choque", value: "Célula ✅", sub: "Pendiente solo Emerson" },
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
      name: "Campañas · Cyber Days",
      status: "🟡 Ajustando · Meet corrido al 1-ago · Curaduría eliminada",
      statusColor: "#F59E0B",
      color: "#0EA5E9",
      mueve: "GMV incremental por campaña de catálogo curado Cyber Days",
      hipotesis: "149.300–626.000 órdenes/año según escala",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "Michelle ajustando copies de mensajes (curaduría eliminada del plan). Meet con suppliers corrido al viernes 1-ago — timing de esta semana era muy ajustado. Autorización de Meta para plantilla WA pendiente — fallback: envío manual de Jaime. Mañana (22-jul): alineación del plan en la célula. Michelle tiene reunión pendiente con Majo. Lanzamiento 11-ago se mantiene.",
      next: "Mañana (22-jul): alineación célula. Michelle → copies a Enrique. Confirmar autorización plantilla Meta. 1-ago: meet kick-off con suppliers.",
      badge: "🟡 Meet corrido al 1-ago · Lanzamiento 11-ago se mantiene",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Meet suppliers", value: "1-ago", sub: "Corrido desde 25-jul" },
          { label: "Curaduría", value: "Eliminada ✅", sub: "Libera 1 semana" },
          { label: "Plantilla Meta WA", value: "Pendiente auth", sub: "Fallback: envío manual Jaime" },
        ],
        meta: [
          { label: "Lanzamiento", value: "11-ago", sub: "Se mantiene" },
          { label: "Canva + productos", value: "3–9 ago", sub: "Suppliers suben piezas" },
        ],
        seguimiento: [
          { label: "Alineación célula", value: "Mañana 22-jul", sub: "Todos al día con el plan" },
          { label: "Copies → Enrique", value: "Michelle · hoy", sub: "Para poder lanzar CRM" },
          { label: "Reunión con Majo", value: "Pendiente", sub: "Michelle la gestiona" },
        ]
      }
    },
    {
      code: "Dropi Pulso",
      name: "Dropi Pulso · Ajustes con Natalia · 27-jul piloto",
      status: "🟢 Reunión Natalia hoy · UI a Michelle · Piloto 27-jul",
      statusColor: "#10B981",
      color: "#EC4899",
      mueve: "Primer piloto real de matching en vivo con comunidad de Iván",
      hipotesis: "Feedback operativo de Natalia refina el flujo antes del 27-jul",
      gmv: "Piloto: sin proyección confirmada aún",
      avance: "Jaime se reúne hoy con Natalia (quien pasó info sobre Nexus, herramienta comercial interna) para feedback operativo — si el flujo funciona, qué agregaría o quitaría. Es un stakeholder del frente comercial, no solo UX. Después los ajustes pasan a Michelle para UI. El 27-jul es la fecha del piloto con comunidad de Iván. Fallback si Reinoso no entrega endpoint: data manual.",
      next: "Hoy: Jaime con Natalia → ajustes a Michelle. Michelle: UI post-ajustes. 27-jul: lanzamiento piloto comunidad de Iván.",
      badge: "🟢 Reunión Natalia hoy · 27-jul piloto",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Plataforma", value: "Lista ✅", sub: "Flujo completo montado" },
          { label: "CRM WA", value: "Conectado ✅", sub: "Notificaciones activas" },
          { label: "Feedback Natalia", value: "Hoy", sub: "Reunión Jaime → ajustes UI" },
        ],
        meta: [
          { label: "Piloto", value: "27-jul", sub: "Comunidad de Iván" },
          { label: "Endpoint Reinoso", value: "Pendiente BD", sub: "Fallback: data manual" },
        ],
        seguimiento: [
          { label: "UI Michelle", value: "Post-reunión Natalia", sub: "Ajustes de diseño" },
        ]
      }
    },
    {
      code: "NEG / COM / Cola",
      name: "Cola Dev · Bloqueada",
      status: "🔴 José canceló 2ª semana · Sin ETA",
      statusColor: "#EF4444",
      color: "#6B7280",
      mueve: "Negociaciones, Combos, DESC-001 — todos en espera",
      hipotesis: "Sin weekly de TI, sin estimaciones, sin ventana de ejecución",
      gmv: "~120K órdenes estimadas en cola",
      avance: "José canceló el weekly del 21-jul — segunda semana consecutiva. Combos pausado, Negociaciones pausado. NEG-001 tenía prometida la carga masiva para hoy 21-jul — sin confirmación de si salió. Bug auto-login TTV lleva 2 semanas en Jira sin respuesta.",
      next: "Confirmar si la carga masiva de NEG-001 salió hoy (21-jul). Evaluar si escalar la falta de comunicación con TI a María Ossa.",
      badge: "🔴 Sin update TI · 2ª semana",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "NEG-001 carga masiva", value: "21-jul prometido", sub: "Sin confirmación · José sin weekly" },
          { label: "Combos", value: "Pausado", sub: "Dropify sin terminar" },
          { label: "Bug TTV auto-login", value: "Jira · 2ª sem", sub: "Sin respuesta de José" },
        ],
        meta: [
          { label: "Desbloqueo", value: "Sin ETA", sub: "Reorg equipo TI" },
        ],
        seguimiento: [
          { label: "Weekly TI", value: "Cancelado 2ª vez", sub: "José Giraldo" },
        ]
      }
    },
  ],
  documentos: [],
  dolores: [
    {
      frente: "José Giraldo — segunda semana sin weekly y sin respuesta",
      tag: "🔴 Riesgo estructural",
      tagColor: "#EF4444",
      salio: "Segunda semana consecutiva sin weekly de TI. Bug auto-login TTV en Jira sin respuesta. NEG-001 carga masiva prometida para 21-jul sin confirmación. Combos y Negociaciones detenidos indefinidamente.",
      ruta: "Evaluar si escalar con María Ossa — sin canal de comunicación activo con TI, los proyectos en cola no tienen ventana de ejecución",
      rutaColor: "#EF4444",
      metrica: "5+ proyectos en cola sin ETA de desarrollo · bug crítico sin atender 2 semanas",
      decision: "Sin decisión cerrada — definir esta semana si se escala o se espera una semana más"
    }
  ],
  resumen: "Semana 21-jul · Los frentes que controlamos avanzan. En <strong>TTV-001</strong> el plan de choque está activo con el segmento de alto potencial (Fast Track): la célula lo aprobó, la semana del 28-jul Jaime y Michelle los contactan para entrevistas → insights a Comercial. Solo falta que <strong>Emerson</strong> (llegó hoy de licencia de paternidad) lo valide para arrancar formalmente. El <strong>27-jul</strong> sigue siendo el T0 de medición. En <strong>IND-001</strong> la novedad más importante de la semana: Comercial confirmó que los ascensos <strong>no requieren firma formal</strong> — supplier acepta → correo a Soporte → Soporte cambia el tipo. La plataforma ya está; solo falta que María valide con Legal antes de lanzar. En <strong>DCA-001</strong>, el meet con suppliers se corre al <strong>1-ago</strong> — la curaduría se eliminó del plan y el timing de esta semana era muy ajustado; el lanzamiento del 11-ago se mantiene. En <strong>Dropi Pulso</strong>, Jaime se reúne hoy con Natalia (Nexus) para feedback operativo antes del piloto del 27-jul. Del lado de <strong>TI</strong>: José canceló el weekly por segunda semana consecutiva — la cola de desarrollo sigue paralizada y el bug de TTV lleva dos semanas sin respuesta.",
  proximosPasos: [
    {
      titulo: "Esta semana · prioridad",
      color: "#7C3AED",
      items: [
        "27-jul: confirmar que el pipeline GHL corre de punta a punta — T0 de medición activa.",
        "Validar plan de choque TTV con Emerson (llegó hoy de licencia).",
        "Dropi Pulso: Jaime reúne con Natalia hoy → ajustes a Michelle para UI.",
        "DCA-001: Michelle finaliza copies y los pasa a Enrique. Confirmar autorización plantilla Meta.",
        "Mañana 22-jul: sesión de alineación Campañas en la célula — todos al día.",
        "IND-001: esperar confirmación de María sobre validación con Legal.",
        "Evaluar si escalar la falta de respuesta de TI a María Ossa.",
      ]
    },
    {
      titulo: "Semana del 28-jul",
      color: "#6366F1",
      items: [
        "TTV-001: contactar suppliers Fast Track — entrevistas + insights a Comercial.",
        "Resultados día 1 del T0 de medición (activación automática + Dropi Pulso).",
        "DCA-001: meet con proveedores el 1-ago (viernes).",
        "CAT-001: seguimiento a asignación de devs (reunión con Lucho pendiente).",
      ]
    }
  ]
};
