import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 17 jul 2026",
  subtitle: "Reinoso desbloqueó 4 frentes · Ascensos = regulador contractual · TTV primeras auditorías",
  heroBadge: "Semana 17 jul · En progreso",
  heroTitle: "Jaime Reinoso desbloqueó 4 frentes en 1 reunión\n+ Ascensos reencuadrados como regulador contractual · TTV: 15 auditorías arrancaron",
  heroStrip: [
    { label: "Objetivo Anual", value: "93.6M", sub: "Órdenes/año meta OKR" },
    { label: "Órdenes Actuales", value: "38.4M", sub: "Órdenes/año base" },
    { label: "Brecha a Cerrar", value: "55.2M", sub: "Adicionales requeridas" },
    { label: "Meta C1 · TTV", value: "104", sub: "Activos al 31-ago" },
    { label: "Próximo hito", value: "24-jul", sub: "Kick-off suppliers Cyber Days" }
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "Jaime Reinoso (IA y BD) · nuevo interlocutor TI — 4 frentes desbloqueados en 1 reunión",
      descripcion: "Esta semana se estableció contacto con Jaime Reinoso, el nuevo encargado de IA y Base de Datos en Dropi. En una sola reunión desbloqueó 4 iniciativas que estaban detenidas o sin dueño técnico: (1) Dropi Pulso: puede construir el endpoint de data — en espera de que termine el mantenimiento de BD. (2) CAT-001: Lucho vio la demo improvisada; los devs se desbloquean los jueves según María. (3) IND-001 ascensos: endpoint de aprobación automática es viable técnicamente. (4) TTV bug auto-login: se resuelve con un cronjob simple que él mismo puede implementar. María validó y apoyó los 4 frentes. Contrasta directamente con el bloqueo estructural que venía de José desde la reorganización.",
      proyecto: "Estrategia / TI",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "TTV bug auto-login · subido a Jira a José — esperando respuesta · weekly cancelado esta semana",
      descripcion: "El bug que cortaba el 46% del tráfico post-registro (el sistema pedía login en vez de activar al usuario directo) fue subido a Jira a José, quien indicó ese canal. José canceló el weekly de esta semana, por lo que no hay update de TI sobre el estado del bug. La HU está documentada y en su tablero. Sin respuesta de José, el 46% del tráfico sigue sin llegar al CRM.",
      proyecto: "TTV-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "TTV-001 · 15 auditorías planificadas para 16-jul — ninguna se ejecutó, sin movimiento en CRM",
      descripcion: "Al 14-jul: 463 suppliers registrados en UserPilot desde el arranque del pipeline (30-jun). Las 15 auditorías que estaban agendadas para el 16-jul no se ejecutaron. No hubo movimiento en el CRM esta semana. El funnel sigue en 0 activos. José canceló el weekly, por lo que tampoco hay update de TI. La meta C1 (104 activos al 31-ago) acumula semanas sin conversiones — el ritmo requerido sube con cada semana sin activaciones.",
      proyecto: "TTV-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "IND-001 · Ascensos reencuadrados por María: regulador contractual, no badge",
      descripcion: "Dirección de María Ossa (16-jul): los cambios de nivel (No Verificado → Verificado → Premium → Exclusivo) no son gamificación. Son un contrato regulatorio: el proveedor se compromete con acuerdos de servicio específicos y Dropi le otorga mayor visibilidad a cambio. Este reencuadre define el orden de ejecución del proyecto: (1) Legal diseña el instrumento contractual (tienen DocuSign); (2) Comercial mapea beneficios y obligaciones por nivel; (3) Reinoso construye el endpoint de aprobación automática; (4) lanzamiento con la plataforma ya construida + CRM WA activo.",
      proyecto: "IND-001",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "IND-001 · Plataforma de ascensos lista + CRM conectando WA esta semana",
      descripcion: "La plataforma de postulaciones para ascensos ya está construida. Esta semana (16-17 jul) se conecta el CRM para enviar mensajes por WhatsApp a suppliers candidatos a ascender. Lo que falta: reunión con Legal (DocuSign + contrato por nivel) y reunión con Comercial (beneficios y compromisos). Después de esas dos reuniones, Reinoso implementa el endpoint de aprobación. Con esas piezas el flujo queda completo: WA → plataforma → firma DocuSign → endpoint actualiza nivel → confirmación automática.",
      proyecto: "IND-001",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-006",
      titulo: "CAT-001 · Demo improvisada con Lucho, Fer y Yeniey — tracción política confirmada",
      descripcion: "Lucho convocó una demo improvisada de CAT-001 esta semana. Se mostró la herramienta (taxonomía 4 niveles, IA GPT-4o mini, 225 categorías) a Lucho, Fer, Yeniey y otros. Recepción positiva. María confirmó en paralelo que los devs para integrar CAT-001 a la plataforma real se desbloquean en las reuniones del jueves. El blocker ya no es político — es de agenda técnica. Siguiente paso: estar en la reunión del jueves con material listo.",
      proyecto: "CAT-001",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-007",
      titulo: "Dropi Pulso · plataforma lista + CRM WA conectado — solo falta la data para activar",
      descripcion: "La plataforma de Dropi Pulso está construida y el CRM para envío de WA ya está conectado. El flujo completo existe: proveedor activa Pulso → dropshippers reciben notificación WA + email → confirman unidades → proveedor acepta → dropshippers reciben kit de campaña. Lo único que falta es el endpoint de data real (catálogo, stock, proveedores) que construirá Reinoso una vez termine el mantenimiento de BD. Con la data disponible, Pulso se puede activar de inmediato — no hay más blocker de producto. Próxima semana: refinar proceso con Comercial.",
      proyecto: "Dropi Pulso",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-008",
      titulo: "Activación = velocidad + regulación — María pide plan de seguimiento a nuevos (pendiente crear)",
      descripcion: "María amplió el scope de TTV-001: activar no es solo reducir el tiempo. Incluye (1) revisión de políticas de productos antes de activar (calidad de contenido del catálogo) y (2) lineamientos anti-fraude en el proceso de registro y activación. Además pidió explícitamente crear un plan de seguimiento estructurado a nuevos suppliers. El documento debe cubrir tres dimensiones: velocidad (TTA ≤5 días) + calidad (políticas de productos) + cumplimiento (anti-fraude). Pendiente de crear esta semana.",
      proyecto: "TTV-001",
      tipo: "Decisión",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
  ],
  oportunidades: [
    {
      code: "TTV-001",
      name: "Time to Value · Seguimiento Operativo",
      status: "🔴 0 activos · Auditorías no ejecutadas · Bug en Jira · José sin weekly",
      statusColor: "#EF4444",
      color: "#10B981",
      mueve: "620 nuevos suppliers activos con catálogo visible",
      hipotesis: "North Star: registro → activo en ≤5 días",
      gmv: "~105.000 órdenes/año · USD 1,57M GMV proyectado",
      avance: "463 registrados en UserPilot desde 30-jun (al 14-jul). 15 auditorías planificadas para el 16-jul no se ejecutaron — sin movimiento en el CRM esta semana. Bug de auto-login (46% rebote) subido a Jira a José según su indicación — esperando respuesta. José canceló el weekly de esta semana, sin update de TI. María amplió el scope: activación = velocidad + políticas de productos + anti-fraude. Plan de seguimiento estructurado a nuevos suppliers pendiente de crear.",
      next: "Seguimiento al bug en Jira — José debe responder. Reagendar weekly con José. Iniciar borrador del plan de seguimiento a nuevos (3 dimensiones). Confirmar con equipo comercial por qué las auditorías del 16-jul no se ejecutaron.",
      badge: "🔴 0 activos · Sin movimiento",
      badgeColor: "#EF4444",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Registrados (UP)", value: "463", sub: "Cohorte desde 30-jun", tooltip: "Al 14-jul. Cohorte activa desde que el pipeline se encendió el 30-jun-2026." },
          { label: "Auditorías planificadas", value: "15", sub: "16-jul · ninguna ejecutada" },
          { label: "Bug auto-login", value: "En Jira · esperando", sub: "José indicó subirlo ahí", tooltip: "46% de los registros rebotaban post-registro. HU enviada a Jira a José." },
        ],
        meta: [
          { label: "Meta C1 · 31-ago", value: "104", sub: "Activos en ~45 días" },
          { label: "Meta total · 31-dic", value: "620", sub: "Suppliers activos" },
          { label: "TTA meta", value: "≤ 5 días", sub: "Registro → activo" },
        ],
        seguimiento: [
          { label: "Listos para vender", value: "0", sub: "Sin conversiones esta semana" },
          { label: "José weekly", value: "Cancelado", sub: "Sin update de TI esta semana" },
          { label: "Plan seguimiento nuevos", value: "Pendiente crear", sub: "3 dimensiones · María lo pidió" },
        ]
      }
    },
    {
      code: "IND-001",
      name: "Indicadores · Ascensos como Regulador",
      status: "🟢 Plataforma lista · CRM WA · Pendiente Legal + Comercial",
      statusColor: "#10B981",
      color: "#6366F1",
      mueve: "Ascensos regulados → retención, GMV y ecosistema más robusto",
      hipotesis: "Un ascenso con contrato y beneficios reales genera más compromiso del proveedor que un cambio de nombre",
      gmv: "208 Activo→Verificado listos · 29 Verificado→Premium listos · sin contactar aún",
      avance: "Reencuadre estratégico (María 16-jul): los ascensos son un regulador contractual — el proveedor se compromete con acuerdos de servicio y Dropi le da más visibilidad a cambio. La plataforma de postulaciones ya está construida. CRM conectando para WA esta semana (16-17 jul). Endpoint de aprobación automática confirmado viable por Reinoso — se implementa después de definir el contrato con Legal y Comercial.",
      next: "Reunión con Legal: instrumento contractual + DocuSign. Reunión con Comercial: beneficios y compromisos por nivel. Conectar CRM WA esta semana. Endpoint con Reinoso: post-definiciones.",
      badge: "🟢 Plataforma lista · Legal + Comercial pendientes",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Plataforma postulaciones", value: "Lista ✅", sub: "Construida por PM" },
          { label: "CRM WA", value: "Esta semana", sub: "16-17 jul · conectando" },
          { label: "Endpoint aprobación", value: "Confirmado viable", sub: "Reinoso · post-contrato" },
        ],
        meta: [
          { label: "Cumple umbral → Verificado", value: "208", sub: "Ya tienen 3.000+ órd/90d" },
          { label: "Cumple umbral → Premium", value: "29", sub: "Ya tienen 20.000+ órd/90d" },
        ],
        seguimiento: [
          { label: "Reunión Legal", value: "Pendiente agendar", sub: "DocuSign · contrato por nivel" },
          { label: "Reunión Comercial", value: "Pendiente agendar", sub: "Beneficios y compromisos" },
          { label: "Endpoint Reinoso", value: "Post-Legal + Comercial", sub: "Diseño depende del contrato" },
        ]
      }
    },
    {
      code: "DCA-001",
      name: "Campañas · Cyber Days",
      status: "🟢 En rumbo · Kick-off suppliers 24-jul",
      statusColor: "#10B981",
      color: "#0EA5E9",
      mueve: "GMV incremental por campañas de catálogo curado",
      hipotesis: "149.300–626.000 órdenes/año según escala de la campaña",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "Plan completo cerrado (reunión 10-jul). Próximo hito: 24-jul kick-off con suppliers vía CRM + Meet Comercial. Flujo: CRM 24-jul → Forms 25–31 jul → Curaduría 31 jul–3 ago → Email instrucciones 3 ago → Catálogo Canva 3–9 ago → Cierre 9 ago → Publicación 10 ago → Lanzamiento 11 ago. Activación en Dropi: pieza home CTA + banner con filtro de campaña. Pendiente: Juan David (Soporte) crea categoría temporal post-curaduría.",
      next: "Preparar convocatoria CRM para 24-jul. Confirmar quién lidera la convocatoria. Michelle: subir plan a Darwin. Juan David: solicitar categoría temporal en Soporte.",
      badge: "🟢 Lanzamiento 11-ago",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Kick-off suppliers", value: "24-jul", sub: "CRM + Meet Comercial" },
          { label: "Forms postulación", value: "25–31 jul", sub: "Confirmación participación" },
          { label: "Curaduría", value: "31 jul–3 ago", sub: "Equipo Comercial" },
        ],
        meta: [
          { label: "Catálogo Canva", value: "3–9 ago", sub: "Suppliers suben productos" },
          { label: "Publicación vestida", value: "10 ago", sub: "Marco + palabra clave activos" },
          { label: "Lanzamiento", value: "11 ago", sub: "Marketing → dropshippers" },
        ],
        seguimiento: [
          { label: "Categoría temporal", value: "Juan David · pendiente", sub: "Post-curaduría" },
          { label: "Plan en Darwin", value: "Michelle · pendiente", sub: "Subir a campaña" },
          { label: "Convocatoria CRM", value: "Preparar esta semana", sub: "Para el 24-jul" },
        ]
      }
    },
    {
      code: "Dropi Pulso",
      name: "Dropi Pulso · Motor de Matching de Catálogo",
      status: "🟢 Plataforma lista · CRM WA conectado · Solo falta la data",
      statusColor: "#10B981",
      color: "#EC4899",
      mueve: "Campañas en vivo supplier↔dropshipper sin intermediación comercial manual",
      hipotesis: "El matching activo de demanda→catálogo reduce el tiempo de primera campaña y activa proveedores sin gestión manual",
      gmv: "Piloto: comunidad de Iván (proveeduría puente) · sin proyección confirmada aún",
      avance: "Plataforma construida con flujo completo. CRM para envío de WA ya conectado. Con la data disponible (endpoint de Reinoso), Pulso se puede activar de inmediato — no hay más blocker de producto. Reinoso construirá el endpoint de datos (catálogo, stock, proveedores) una vez termine el mantenimiento de BD. Próxima semana: refinar proceso con Comercial. Piloto previsto: comunidad de Iván (proveeduría puente). Riesgo activo: stock fantasma — validar antes de activar.",
      next: "Follow-up a Reinoso sobre ventana de mantenimiento BD. Reunión de refinamiento con Comercial (próxima semana). Preparar guión de piloto con comunidad de Iván.",
      badge: "🟢 Lista para activar · Esperando data",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Plataforma", value: "Lista ✅", sub: "Flujo completo montado" },
          { label: "CRM WA", value: "Conectado ✅", sub: "Notificaciones activas" },
          { label: "Endpoint de data", value: "Reinoso · post-BD", sub: "Único blocker restante" },
        ],
        meta: [
          { label: "Medición", value: "Día 1, 15 y 30", sub: "Desde el primer piloto" },
          { label: "Riesgo crítico", value: "Stock fantasma", sub: "Validar antes de activar" },
        ],
        seguimiento: [
          { label: "Follow-up Reinoso", value: "Próximos días", sub: "¿Cuándo termina mantenimiento BD?" },
          { label: "Refinamiento Comercial", value: "Próxima semana", sub: "Juan Guillermo + equipo Emerson" },
        ]
      }
    },
    {
      code: "CAT-001 / CAZ-001",
      name: "Categorías · Caza Productos",
      status: "🟢 Tracción con Lucho · Devs disponibles jueves",
      statusColor: "#10B981",
      color: "#3B82F6",
      mueve: "Árbol comercial aprobado → categorización IA + búsqueda semántica activa",
      hipotesis: "Con devs asignados la integración a Dropi puede arrancar antes del Q4",
      gmv: "Habilitador de búsqueda, SEO y campañas de catálogo",
      avance: "CAT-001: demo improvisada con Lucho, Fer y Yeniey esta semana — recepción positiva. María confirmó que los devs se desbloquean en la reunión del jueves. La herramienta ya está en producción (225 categorías L4, IA GPT-4o mini). CAZ-001: patrón claro en 6 entrevistas — 100% interés, 0% aha moment. Causas: matching roto, sin notificaciones, conversación muerta. Valor real: agilidad del primer contacto. Experimento propuesto: contacto manual vía CRM para validar matching activo.",
      next: "CAT-001: asistir reunión del jueves con María — llevar demo lista para desbloqueo de devs. CAZ-001: experimento de contacto manual vía CRM + revisar Nexus (herramienta Comercial). Completar sesiones piloto restantes con 10 suppliers.",
      badge: "🟢 Lucho vio la demo · Devs jueves",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Demo CAT-001", value: "Realizada ✅", sub: "Con Lucho, Fer, Yeniey" },
          { label: "Devs", value: "Reunión del jueves", sub: "Canal confirmado con María" },
          { label: "Entrevistas CAZ", value: "6 realizadas", sub: "100% interés · 0% aha moment" },
        ],
        meta: [
          { label: "Integración a Dropi", value: "Post-jueves", sub: "Depende de asignación devs" },
          { label: "Experimento CAZ", value: "Contacto manual CRM", sub: "Matching activo" },
        ],
        seguimiento: [
          { label: "Reunión del jueves", value: "¿Asiste Jaime?", sub: "CAT-001 debe estar presente" },
          { label: "Nexus (Comercial)", value: "Por revisar", sub: "¿Duplica a CAZ-001?" },
          { label: "Piloto 10 suppliers", value: "En curso", sub: "Sesiones restantes por completar" },
        ]
      }
    },
    {
      code: "NEG-001",
      name: "Negociaciones · Supplier↔Comunidad",
      status: "🔴 Bloqueada · Reorganización TI sin ETA",
      statusColor: "#EF4444",
      color: "#10B981",
      mueve: "Negociaciones formalizadas → comisiones acordadas → GMV",
      hipotesis: "Carga masiva habilita escalado a toda la base",
      gmv: "Fase 1: Transacciones controladas",
      avance: "Funcionalidad base disponible y activa para todos los suppliers. Handoff con TI realizado el 7-jul. La estimación de desarrollo está detenida indefinidamente por la reorganización del equipo de José. NEG-002 también sin estimación. Doble bloqueo sin fecha de resolución.",
      next: "Monitorear estabilización del equipo TI de José. Sin esa señal, NEG-001 no tiene ventana de ejecución.",
      badge: "🔴 Bloqueada · Reorganización TI",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Funcionalidad base", value: "Disponible ✅", sub: "Activa para todos los suppliers" },
          { label: "Handoff TI", value: "Realizado 7-jul", sub: "Estimación nunca llegó" },
        ],
        meta: [
          { label: "Desbloqueo", value: "Sin ETA", sub: "Reorg TI · equipo José" },
        ],
        seguimiento: [
          { label: "Estimación NEG-001", value: "Detenida indefinidamente", sub: "Reorganización equipo TI" },
          { label: "NEG-002", value: "Sin estimación", sub: "Precede a NEG-001 en cola" },
        ]
      }
    },
    {
      code: "COM-001",
      name: "Combos · Shopify + CAS + ECOM Scanner",
      status: "🔴 Detenido · Dropify sin terminar",
      statusColor: "#EF4444",
      color: "#7C3AED",
      mueve: "Canal Shopify completo con combos + CAS + ECOM Scanner",
      hipotesis: "Lanzamiento unificado habilita el canal Shopify para suppliers con combos",
      gmv: "Habilita canal completo multi-canal",
      avance: "José confirmó el 10-jul: COM-001 detenido porque Dropify no está terminado. Sin fecha tentativa de reactivación. Todo listo del lado de PM.",
      next: "Monitorear estado de Dropify con José. Sin Dropify completo, COM-001 no tiene ventana.",
      badge: "🔴 Detenido · Dropify pendiente",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Estado PM", value: "Listo ✅", sub: "4 frentes documentados" },
          { label: "Bloqueante", value: "Dropify", sub: "Sin fecha de completitud en TI" },
        ],
        meta: [
          { label: "Fecha reactivación", value: "Sin ETA", sub: "Depende de Dropify" },
        ],
        seguimiento: [
          { label: "Próximo check", value: "Cuando Dropify esté listo", sub: "Monitorear con José" },
        ]
      }
    },
    {
      code: "COM-002 / DESC-001 / NEG-002",
      name: "Cola Dev · Combos D + Descuentos + Negociaciones S↔D",
      status: "⏳ Cola de dev · Sin fecha TI",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "3 proyectos PM listos esperando slot de desarrollo",
      hipotesis: "Secuencia: NEG-002 → COM-002 → DESC-001 según disponibilidad de dev",
      gmv: "~120K órdenes incrementales combinadas estimadas",
      avance: "Los tres proyectos tienen documentación PM lista. DESC-001: prototipo en pruebas con usuarios reales (piloto CAT) + ya conectado a RPP de Michelle. NEG-002: discovery pendiente, espera reunión con Juan Diego (contexto PM anterior). COM-002: en espera de que TI arranque NEG-002. La reorganización del equipo TI pone en riesgo toda la cola.",
      next: "NEG-002: agendar reunión con Juan Diego para contexto histórico. Monitorear estabilización del equipo TI para retomar estimaciones.",
      badge: "⏳ En cola · NEG-002 primero",
      badgeColor: "#6366F1",
      metricas: {
        base: [
          { label: "NEG-002 · estimado", value: "~18-ago", sub: "Si TI se estabiliza" },
          { label: "COM-002 · estimado", value: "~29-sep", sub: "Después de NEG-002" },
          { label: "DESC-001 · estimado", value: "~10-nov", sub: "Después de COM-002" },
        ],
        meta: [
          { label: "Trigger DESC-001", value: "Cyber Days 11-ago", sub: "En riesgo por cola TI" },
          { label: "Prototipo DESC-001", value: "En prueba", sub: "Usuarios reales · RPP activo" },
        ],
        seguimiento: [
          { label: "Estimaciones TI", value: "Suspendidas", sub: "Reorg equipo José" },
          { label: "Juan Diego NEG-002", value: "Por agendar", sub: "Contexto histórico PM anterior" },
        ]
      }
    },
  ],
  documentos: [],
  dolores: [],
  resumen: "Semana 17-jul · El cambio más significativo fue establecer contacto con <strong>Jaime Reinoso</strong> (IA y Base de Datos), quien en una sola reunión desbloqueó 4 iniciativas: endpoint para Dropi Pulso, tracción técnica para CAT-001, endpoint de aprobación de ascensos IND-001, e identificó la solución técnica al bug de TTV (cronjob). María Ossa validó y amplió: los ascensos de nivel son ahora <strong>reguladores contractuales</strong> — el proveedor firma compromisos de servicio y Dropi le da visibilidad a cambio. Legal (DocuSign) y Comercial (beneficios por nivel) definen los términos antes de que Reinoso construya el endpoint. En <strong>TTV-001</strong>, la semana fue negativa: las 15 auditorías planificadas para el 16-jul no se ejecutaron, no hubo movimiento en el CRM, y José canceló el weekly — sin update de TI. El bug de auto-login está en Jira esperando respuesta. <strong>Dropi Pulso</strong> avanzó: plataforma lista + CRM WA conectado — con la data de Reinoso se puede activar de inmediato. En <strong>CAT-001</strong>, demo con Lucho confirmó tracción política y los devs se desbloquean el jueves. En <strong>DCA-001</strong>, kick-off con suppliers el 24-jul.",
  proximosPasos: [
    {
      titulo: "Esta semana · urgente",
      color: "#EF4444",
      items: [
        "TTV-001: hacer seguimiento al bug en Jira — José debe responder. Reagendar weekly con José.",
        "TTV-001: confirmar con equipo comercial por qué las auditorías del 16-jul no se ejecutaron.",
        "IND-001: conectar CRM para envío WA a candidatos a ascenso (16-17 jul).",
        "IND-001: agendar reunión con Legal — DocuSign + instrumento contractual por nivel.",
        "IND-001: agendar reunión con Comercial — beneficios y compromisos por nivel.",
        "CAT-001: asistir reunión del jueves con María — llevar demo lista para desbloqueo de devs.",
      ]
    },
    {
      titulo: "Esta semana · seguimiento",
      color: "#F77F00",
      items: [
        "TTV-001: reunión de seguimiento semanal con equipo (martes).",
        "TTV-001: iniciar borrador del plan de seguimiento a nuevos suppliers (velocidad + calidad + anti-fraude).",
        "Dropi Pulso: follow-up a Reinoso en 3-5 días sobre ventana de mantenimiento BD.",
        "DCA-001: preparar convocatoria CRM para kick-off suppliers 24-jul.",
      ]
    },
    {
      titulo: "Próxima semana · 24-jul",
      color: "#6366F1",
      items: [
        "DCA-001: kick-off con suppliers vía CRM + Meet con Comercial (24-jul).",
        "IND-001: primera reunión con Legal sobre instrumento contractual.",
        "TTV: primera activación esperada si las auditorías del 16-jul avanzan bien.",
        "CAT-001: si devs se asignan el jueves 17-jul, arrancar planeación técnica de integración.",
        "NEG-002: agendar reunión con Juan Diego (contexto PM anterior).",
      ]
    }
  ]
};
