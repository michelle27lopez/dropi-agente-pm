import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 21–27 jul 2026",
  subtitle: "27-jul T0 · Kevin activa 10 fast track · DCA-001 frames auto + etiqueta Lucho · ESP-001 validado en célula · Pulso 535 Pareto",
  heroBadge: "Semana 24 jul · Célula · T-3 al 27-jul",
  heroTitle: "T-3 al 27-jul · Kevin activa Fast Track hoy · DCA-001 frames automáticos listos\n+ ESP-001 validado en célula · Pulso 535 Pareto · señal Stock urgente",
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
      titulo: "TTV-001 · Fast Track en movimiento — Kevin activa 10 providers hoy, CRM bug en fix, Jaime + Michelle los contactan esta semana",
      descripcion: "La reunión de célula cerró el loop de activación Fast Track. Kevin Castro (Verificados) confirmó la acción concreta: comparte lista de 10 providers fast track / alto potencial → los activa de forma automática primero → Jaime y Michelle los contactan directamente para entrevistas y acompañamiento. Blocker activo: el CRM tiene un bug donde la plantilla WA se envía pero el mensaje personalizado no llega — Osman (equipo de Kique) está en fix. Una vez resuelto, arranca el contacto. Objetivo del experimento: entender qué están esperando para activarse, qué tipo de proveedor necesitan → insights a Comercial para acelerar o no la auditoría. Si se consiguen órdenes → prorratear el modelo y llevarlo a Lucho/TI como evidencia de valor percibido.",
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
      titulo: "DCA-001 · Michelle mostró el sistema en la célula — link personalizado + frames auto + etiqueta Lucho + popup UserPilot confirmado",
      descripcion: "Michelle presentó el sistema completo en la reunión de célula (24-jul). Flujo: cada proveedor recibe un link personalizado → selecciona hasta 10 productos (stock ≥500, sin ventas últimas 2 semanas) → descarga sus fotos ya con el marco Cyber Days aplicado (ZIP automático) → sube al catálogo Canva → desde el 16-ago cambia foto + keyword en nombre + categoría 'CyberDays'. Dos decisiones clave que salieron de la reunión: (1) Lucho sugirió usar etiquetas en Dropy — aunque el proveedor no actualice la foto, el producto participa via tag + categoría, garantizando participación masiva sin depender de cada proveedor. (2) Laura Catherine (UserPilot) confirmó que sí se puede hacer un popup personalizado en Dropy con el link único de cada proveedor para invitarlos a participar. Majo propuso integrar el flujo al dominio de Dropy (existe landing de campañas de Dropicop que se puede reusar). Las campañas anteriores (Dropicop, Black Days) no se midieron — este sistema cierra ese gap. Meet kick-off: 1-ago. Lanzamiento: 11-ago.",
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
      id: "INS-011",
      titulo: "ESP-001 · Escucha de canales validada en célula — Kate ve valor para TARS, Laura para experimentos, Majo para contenidos semanales",
      descripcion: "La reunión de célula (24-jul) validó ESP-001 con tres usos de negocio distintos: (1) Kate (Cate Salazar) ve valor directo para el proyecto TARS — escuchar en tiempo real qué dicen los usuarios sobre las funcionalidades de la plataforma, complementando data cuantitativa con cualitativa. (2) Laura Contreras propuso usarlo de forma transversal en todas las células: que cada experimento (ej. autoconfirmación) tenga su propio tema de escucha y los insights soporten y escalen los argumentos del experimento. (3) Majo quiere análisis semanales por temática (Cordi, CAS, recolección) para nutrir contenidos en grupos de difusión, canales WA y redes sociales — hasta hacer un resumen mensual de preguntas clave. Michelle explicó que hoy el sistema puede clasificar temas automáticamente (lo que encontró en los grupos) o bajo demanda (que le definamos el tema y traiga los mensajes relacionados). Kevin tiene grupos de providers verificados y puede compartir acceso. Decisión: pedir a todos que compartan links de grupos para ampliar la escucha.",
      proyecto: "ESP-001",
      tipo: "Decisión",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-012",
      titulo: "ESP-001 · Decisión — se necesita WA dedicado para el área · expandir a Facebook y YouTube",
      descripcion: "La escucha de canales actual está corriendo desde el WA de Mit, que se va a llenar de grupos. Decisión de Jaime: solicitar un WhatsApp dedicado para el área. Por ahora solo hay acceso a grupos de WhatsApp; Majo mencionó que Dropi compró los dominios de grupos de Facebook hace ~2 años para controlar información negativa — esos canales también son relevantes para escuchar. Michelle señaló que los comentarios de YouTube y Facebook tienen mucho volumen. Próximo paso: todos comparten links de grupos a Jaime para centralizar el acceso antes de migrar al WA dedicado.",
      proyecto: "ESP-001",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Medio",
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
  resumen: "Semana 24-jul · La <strong>reunión de célula de hoy</strong> cerró tres loops importantes. En <strong>TTV-001</strong>: Kevin Castro activa hoy los 10 providers Fast Track automáticamente — Jaime y Michelle los contactan esta semana para entrevistas. Blocker: bug en el CRM (Osman en fix). En <strong>DCA-001</strong>: Michelle mostró el sistema completo — link personalizado + frames automáticos + Canva. Dos decisiones de la reunión que amplifican el alcance: Lucho propuso usar <strong>etiquetas en Dropy</strong> para que el producto participe aunque el proveedor no actualice la foto, y Laura Catherine confirmó que <strong>UserPilot puede enviar el popup personalizado</strong> a cada proveedor con su link. Meet kick-off: 1-ago. Lanzamiento: 11-ago. <strong>ESP-001</strong> fue validado por toda la célula: Kate lo ve para TARS (escuchar bugs y frictions), Laura para soportar experimentos con data cualitativa, Majo para contenidos semanales y resúmenes mensuales. Decisión: pedir WA dedicado para el área + compartir todos los links de grupos. Estamos a <strong>3 días del 27-jul</strong> — T0 de medición de activación automática y piloto de <strong>Dropi Pulso</strong>. Lo más rico de la semana viene del <strong>RB-005</strong>: 535 usuarios del Pareto gestionados manualmente, meta de campañas al 50%, señal <strong>'Stock'</strong> urgente pedida por Valentina, riesgo de concentración ya colapsó stock real (50 drops → AC sin inventario). Del lado de <strong>TI</strong>: José canceló por segunda semana — escalar con María esta semana.",
  proximosPasos: [
    {
      titulo: "Hoy y mañana · urgente",
      color: "#7C3AED",
      items: [
        "Kevin Castro: lista de 10 fast track → activación automática → confirmación a Jaime para arrancar contacto.",
        "Osman: fix bug CRM (plantilla WA sin personalización) — bloquea contacto directo a Fast Track.",
        "27-jul: confirmar que el pipeline GHL corre de punta a punta — T0 de medición (TTV-001 + Dropi Pulso).",
        "Dropi Pulso: piloto con comunidad de Iván el 27-jul — data manual si Reinoso no entrega endpoint.",
        "Solicitar WA dedicado para el área (ESP-001 — hoy usa el de Mit).",
      ]
    },
    {
      titulo: "Esta semana · campañas y escaladas",
      color: "#0EA5E9",
      items: [
        "DCA-001: Michelle finaliza copies y los pasa a Enrique. Confirmar autorización plantilla Meta WA (fallback: Jaime manual).",
        "DCA-001: explorar con Lucho la implementación de etiquetas en Dropy para participación sin foto actualizada.",
        "DCA-001: activar popup UserPilot personalizado (Laura Catherine confirmó viabilidad).",
        "Escalar con María la falta de respuesta de TI — 2ª semana, DESC-001 tiene deadline 11-ago.",
        "IND-001: esperar confirmación de María sobre Legal para arrancar con los 208 candidatos.",
        "ESP-001: todos comparten links de grupos de WA / Facebook con Jaime para ampliar escucha.",
        "Dropi Pulso: agregar señal 'Stock' al roadmap como prioridad — validar alcance técnico con Reinoso.",
      ]
    },
    {
      titulo: "Semana del 28-jul",
      color: "#6366F1",
      items: [
        "TTV-001: Jaime + Michelle contactan Fast Track — entrevistas + insights a Comercial.",
        "Resultados día 1 del T0 (activación automática + Dropi Pulso).",
        "DCA-001: meet kick-off con suppliers (1-ago, viernes).",
        "Dropi Pulso: sesión con Ronald/Bogotá (flujo físico de búsqueda de producto, no documentado).",
        "Dropi Pulso: sesión con Diego/Miguel Ángel (bug IDs de producto Cronos ≠ Dropy).",
        "CAT-001: conectar caso de Valentina (111K IDs, proyecciones imposibles) para argumentar prioridad de devs con Lucho.",
        "ESP-001: definir con Kate qué tema de TARS empezamos a escuchar primero.",
      ]
    },
  ]
};
