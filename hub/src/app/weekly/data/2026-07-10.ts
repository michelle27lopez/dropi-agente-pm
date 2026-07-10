import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 10 jul 2026",
  subtitle: "TTV brecha operativa · IND-001 prospectos de ascenso · Cola de desarrollo bloqueante",
  heroBadge: "Semana 10 jul · Borrador",
  heroTitle: "Bajo progreso operativo en TTV · 208 suppliers listos para Verificado sin activar\n+ Cola de dev bloquea 4 proyectos listos PM",
  heroStrip: [
    { label: "Objetivo Anual", value: "93.6M", sub: "Órdenes/año meta OKR" },
    { label: "Órdenes Actuales", value: "38.4M", sub: "Órdenes/año base" },
    { label: "Brecha a Cerrar", value: "55.2M", sub: "Adicionales requeridas" },
    { label: "Meta Iniciativas", value: "308.3K", sub: "Proyección sumada" },
    { label: "Hito clave", value: "31-ago", sub: "C1 TTV · 104 activos meta" }
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "TTV-001 brecha operativa: 0 de 104 activos meta C1 — 53 días para el corte de agosto",
      descripcion: "El pipeline GHL lleva 11 días operando (desde 30-jun). Resultado real: 243 registrados en UserPilot, 165 en CRM, 0 'listos para vender'. La meta del primer corte (C1) es 104 suppliers activados al 31-ago. Quedan 53 días. Para llegar a C1 se necesitan ~2 activaciones por día desde hoy. El ritmo actual: 20 llegaron a 'Auditoría confirmada' (el penúltimo paso) — nadie ha cruzado la línea. Además, el bug de post-registro (sin auto-login) está cortando el 46% del tráfico: 111 de 243 nunca llegan al CRM. Sin resolver ese bug, el pipeline opera al 54% de su potencial.",
      proyecto: "TTV-001",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "IND-001 hallazgo: 208 suppliers Activo ya cumplen el umbral para ser Verificados — sin mover",
      descripcion: "El panel de prospectos de ascenso muestra que de 719 suppliers evaluados en la ruta Activo → Verificado, 208 (29%) ya cumplen el umbral de 3.000 órdenes/90d. Están listos para subir de nivel pero nadie los ha contactado ni iniciado el proceso. Adicionalmente, 102 más están entre el 70–99% del umbral (promedio 83%) — están a punto. En total: 310 suppliers con alta probabilidad de ascenso en el corto plazo. Esta es una palanca de activación inmediata sin desarrollo.",
      proyecto: "IND-001",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "IND-001 hallazgo: 29 Verificados listos para Premium + 24 más al 84% del umbral",
      descripcion: "En la ruta Verificado → Premium (281 evaluados): 29 suppliers ya cumplen el umbral de 20.000 órdenes/90d y podrían subir a Premium hoy. 24 más están entre el 70–99% (promedio 84%). En conjunto son 53 Verificados con alta probabilidad de ascenso. Activarlos implica visita comercial personalizada, presencia en lives de Dropi y relacionamiento con comunidades — impacto directo en retención y GMV.",
      proyecto: "IND-001",
      tipo: "Hallazgo",
      tipoColor: "#6366F1",
      impacto: "Alto",
    },
    {
      id: "INS-003c",
      titulo: "IND-001 · Nota para investigar: algunos suppliers no quieren subir de nivel por miedo a los compromisos",
      descripcion: "Señal cualitativa: hay suppliers que conocen su nivel y podrían postularse, pero evitan ascender para no asumir los requisitos que implica (tiempos de despacho, gestión de garantías, etc.). Si esto es representativo, el gap entre 'cumple el umbral' y 'se postula' no es solo de desconocimiento — es una decisión consciente. Eso cambia el enfoque de la intervención: no basta con comunicar que pueden subir; hay que entender qué los frena y si el modelo de requisitos es adecuado. Pendiente: discovery cualitativo con muestra de suppliers que cumplen umbral pero no se han postulado.",
      proyecto: "IND-001",
      tipo: "Para investigar",
      tipoColor: "#F59E0B",
      impacto: "Medio",
    },
    {
      id: "INS-004",
      titulo: "Cola de desarrollo: 4 proyectos con handoff PM listo — bloqueados sin slot en TI",
      descripcion: "Con 1 solo desarrollador disponible a ~6 semanas por proyecto en modo secuencial, la cola de entrega llega hasta febrero 2027 para el último proyecto. NEG-001/NEG-002 arranca ~18-ago, COM-002 ~29-sep, DESC-001 ~10-nov, CAT-001 ~feb 2027. Ninguno tiene fecha confirmada de TI aún — José canceló el weekly del 8-jul. Esto no es solo un problema de velocidad: bloquea la ejecución de iniciativas que ya están documentadas y listas para construirse. Necesitamos una conversación de priorización de capacidad con TI.",
      proyecto: "Cola Dev",
      tipo: "Riesgo",
      tipoColor: "#EF4444",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "Cyber Days · DCA-001 — fechas confirmadas: lanzamiento 11-ago, kickoff con suppliers 24-jul",
      descripcion: "Reunión 10-jul cerró el plan completo de la campaña. Hitos: 24-jul CRM a suppliers + Meet con Comercial; 25–31 jul formulario de postulación; 31 jul–3 ago curaduría Comercial; 3 ago email de instrucciones a suppliers (manual de marco + nombre + reglas); 3–9 ago catálogo Canva (suppliers suben productos); 9 ago cierre catálogo → se envía a dropshippers el 11-ago; 10 ago publicación de productos 'vestidos'; 11 ago lanzamiento. Home con CTA + banner en catálogo (filtro temporal de campaña). Pendiente operativo: Juan David (Soporte) crea categoría temporal post-curaduría.",
      proyecto: "DCA-001",
      tipo: "Decisión",
      tipoColor: "#0EA5E9",
      impacto: "Alto",
    },
    {
      id: "INS-006",
      titulo: "Piloto 3 frentes inició — CAT-001, CAZ-001 y DESC-001 con usuarios reales",
      descripcion: "Las sesiones de prueba con los 10 suppliers reales arrancaron el 8-jul con 2 participantes. Las sesiones incluyen los 3 frentes simultáneamente: árbol de categorías (CAT-001), interfaz de búsqueda (CAZ-001) y prototipo de precio antes/ahora (DESC-001). Los insights de estas sesiones son los que se llevan a la mesa con Jacki y Category Manager para aprobación del árbol.",
      proyecto: "CAT-001 / CAZ-001 / DESC-001",
      tipo: "Dato",
      tipoColor: "#3B82F6",
      impacto: "Medio",
    },
    {
      id: "INS-007",
      titulo: "Cellboard 10-jul · Comercial y TI no asistieron — temas clave no llegaron a quienes pueden ejecutar",
      descripcion: "La reunión de célula del 10-jul tuvo buena participación de producto y marketing, pero los interlocutores de Comercial (equipo completo) y TI estuvieron ausentes. Esto implica que los temas de mayor urgencia operativa — TTV 0 activaciones, cola de desarrollo bloqueada, brecha de ascensos de nivel — no llegaron en vivo a quienes pueden accionarlos. Juan Sebastian (Comercial) participó y llevará los puntos de TTV e IND-001 a su equipo, pero el alineamiento con TI sobre la cola de dev sigue pendiente. Señal a monitorear: si la célula no tiene espacios de conversación con TI, el cuello de botella de desarrollo permanece invisible para ellos.",
      proyecto: "Cellboard",
      tipo: "Riesgo",
      tipoColor: "#F59E0B",
      impacto: "Medio",
    },
    {
      id: "INS-008",
      titulo: "CAZ-001 · 6 entrevistas con suppliers: el concepto gusta a todos, ninguno enganchó de verdad",
      descripcion: "Patrón claro en las 6 sesiones de esta semana: 100% de los suppliers entrevistados dijo que Caza Productos le parece interesante. 0% generó un momento de 'aha' real. Causas identificadas: (1) Matching roto — los providers ven oportunidades de categorías que no corresponden a lo que venden; (2) Sin notificaciones — deben entrar manualmente a revisar, lo que en la práctica nadie hace; (3) Conversación muere — cuando hay postulación, ni provider ni dropshipper responde. El valor real identificado: la AGILIDAD para hacer el primer contacto, no la negociación en sí. Los dropshippers experimentados ya negocian por fuera (WhatsApp, grupos), pero valorarían tener ese primer contacto centralizado. Insight adicional: existe Nexus (herramienta interna de Comercial) que hace un cruce similar — investigar si son duplicados o complementarios.",
      proyecto: "CAZ-001",
      tipo: "Hallazgo",
      tipoColor: "#EC4899",
      impacto: "Alto",
    },
    {
      id: "INS-009",
      titulo: "Insight estratégico (Lucho): el supplier es el principal captador de dropshippers de Dropi",
      descripcion: "Insight compartido por Lucho en la semana: si un supplier está bien atendido en Dropi, recomienda activamente la plataforma a todos sus dropshippers ('véndanme por Dropi, ahí me atienden bien'). El efecto multiplicador es significativo: un supplier contento puede traer múltiples dropshippers a la plataforma. Esto refuerza la lógica de IND-001 y TTV: no es solo un OKR de activación — es una palanca de adquisición de dropshippers sin costo de marketing. Las 2 solicitudes de Premium sin respuesta (identificadas hoy) son una pérdida concreta de este efecto multiplicador.",
      proyecto: "IND-001 / Estrategia",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
  ],
  oportunidades: [
    {
      code: "TTV-001",
      name: "Time to Value · Seguimiento Operativo",
      status: "🔴 Brecha C1 · 0/104 activos · 53 días",
      statusColor: "#EF4444",
      color: "#10B981",
      mueve: "620 nuevos suppliers activos con catálogo visible",
      hipotesis: "North Star: registro → activo en ≤5 días",
      gmv: "~105.000 órdenes/año · USD 1,57M GMV proyectado",
      avance: "11 días de operación. Pipeline real: 243 UP → 165 CRM (111 en limbo por bug post-registro). Del CRM: 20 auditoría confirmada, 42 estancados en Nuevo registro, 0 listos para vender. Meta C1: 104 activos al 31-ago (53 días). A ritmo actual el C1 está en riesgo. Bug de auto-login post-registro: José (10-jul) indicó que se debe reportar a Soporte como bug — no lo tomó como desarrollo directo.",
      next: "Reportar bug post-registro a Soporte con descripción técnica. Reunión seguimiento 15-jul: dashboard tiempos entre etapas (Enrique) + auditoría #1.",
      badge: "🔴 0/104 · C1 en riesgo",
      badgeColor: "#EF4444",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Registrados (UP)", value: "243", sub: "Desde 30-jun", tooltip: "Cohorte activa desde que el pipeline se encendió el 30-jun-2026." },
          { label: "En CRM", value: "165", sub: "67,9% llegan al pipeline" },
          { label: "En el limbo", value: "111", sub: "46% · bug post-registro", tooltip: "Causa: sin auto-login después del registro, el supplier se va antes de llegar al CRM." },
          { label: "Auditoría confirmada", value: "20", sub: "Paso previo al 'activo'" },
        ],
        meta: [
          { label: "Meta C1 · 31-ago", value: "104", sub: "Activos en 53 días" },
          { label: "Ritmo requerido", value: "~2/día", sub: "Para llegar a C1" },
          { label: "Meta total · 31-dic", value: "620", sub: "Suppliers activos" },
          { label: "TTA meta", value: "≤ 5 días", sub: "Registro → activo" },
        ],
        seguimiento: [
          { label: "Listos para vender", value: "0", sub: "Brecha total al C1" },
          { label: "Bug post-registro", value: "Pendiente TI", sub: "Bloquea 46% del flujo" },
          { label: "Auditoría #1", value: "15-jul", sub: "1 proveedor agendado" },
        ]
      }
    },
    {
      code: "IND-001",
      name: "Indicadores · Prospectos de Ascenso",
      status: "🟢 Hallazgo clave · 208 listos Activo→Verificado",
      statusColor: "#10B981",
      color: "#6366F1",
      mueve: "Avance de nivel → retención, GMV y acceso a beneficios",
      hipotesis: "Contactar a los que ya cumplen el umbral activa la palanca más rápida de mejora de tier",
      gmv: "Meta: 88.6% → 20% en Activo · 9.3% → 40% en Verificado",
      avance: "Análisis de 1.000 suppliers en panel de prospectos (Supabase · supplier_ascenso_panel). Resultado: 208 Activos ya cumplen el umbral de 3.000 órdenes/90d para ser Verificados — nadie los ha contactado. 102 más están al 83% del umbral. En la ruta Verificado→Premium: 29 ya cumplen las 20.000 órdenes y 24 están al 84%. Palanca inmediata: campañas de contacto a estos segmentos no requieren desarrollo. ⚠️ Brecha operativa identificada en Cellboard (10-jul): 2 de los 6 suppliers entrevistados hicieron solicitud de Premium hace tiempo y NO han recibido respuesta de Comercial. El proceso de ascenso requiere aprobación manual de Comercial (Juan Sebastian confirmó). Si esto es sistemático, estamos perdiendo el efecto multiplicador: un supplier Premium contento trae sus dropshippers a Dropi.",
      next: "Coordinar con Comercial: (1) revisar solicitudes de Premium represadas, (2) diseñar campaña de contacto a los 208 Activo→Verificado. Juan Sebastian escalará internamente.",
      badge: "🟢 208 listos · sin contactar",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Evaluados", value: "1.000", sub: "Suppliers en panel" },
          { label: "Activo → Verificado", value: "719", sub: "En esa ruta" },
          { label: "Verificado → Premium", value: "281", sub: "En esa ruta" },
        ],
        meta: [
          { label: "Cumple umbral → Verificado", value: "208", sub: "Ya tienen 3.000+ órd/90d" },
          { label: "En camino → Verificado", value: "102", sub: "70–99% · prom. 83%" },
          { label: "Cumple umbral → Premium", value: "29", sub: "Ya tienen 20.000+ órd/90d" },
          { label: "En camino → Premium", value: "24", sub: "70–99% · prom. 84%" },
        ],
        seguimiento: [
          { label: "Campaña contacto A→V", value: "Por arrancar", sub: "208 suppliers objetivo" },
          { label: "Campaña contacto V→P", value: "Por arrancar", sub: "29 suppliers objetivo" },
          { label: "Umbral Verificado", value: "3.000 órd/90d", sub: "Criterio principal" },
          { label: "Umbral Premium", value: "20.000 órd/90d", sub: "Criterio principal" },
        ]
      }
    },
    {
      code: "NEG-001",
      name: "Negociaciones · Supplier↔Comunidad",
      status: "🔴 Bloqueada · Reorganización TI + espera NEG-002",
      statusColor: "#EF4444",
      color: "#10B981",
      mueve: "Negociaciones formalizadas → comisiones acordadas → GMV",
      hipotesis: "Carga masiva de negociaciones habilita el escalado a toda la base",
      gmv: "Fase 1: Transacciones controladas",
      avance: "Doble bloqueo. (1) Reunión de handoff con TI se realizó el lunes 7-jul. Se esperaba estimación esta semana. José confirmó (10-jul) que la estimación queda detenida indefinidamente porque le cambiaron el equipo de TI por una reorganización interna — sin ETA. (2) La carga masiva de negociaciones requiere NEG-002 primero, y NEG-002 tampoco tiene estimación. La funcionalidad base existe y está disponible para todos los suppliers, pero el escalado operativo está bloqueado.",
      next: "Monitorear cuándo se estabiliza el equipo TI de José. Sin ese dato, NEG-001 y toda la cola de dev quedan sin fecha.",
      badge: "🔴 Bloqueada · Reorganización TI",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Estado", value: "Bloqueada", sub: "Reorganización equipo TI" },
          { label: "Handoff", value: "Realizado 7-jul", sub: "Estimación no llegó" },
          { label: "Funcionalidad base", value: "Disponible", sub: "Para todos los suppliers" },
        ],
        meta: [
          { label: "Desbloqueo", value: "Sin ETA", sub: "Depende de reorg TI + NEG-002" },
        ],
        seguimiento: [
          { label: "Estimación NEG-002", value: "Sin fecha", sub: "Equipo TI reorganizado" },
          { label: "Bug Excel", value: "Sin resolver", sub: "Solo exporta 120 productos" },
        ]
      }
    },
    {
      code: "COM-001",
      name: "Combos · Shopify + CAS + ECOM Scanner",
      status: "🔴 Detenido · Dropify sin terminar · Sin fecha",
      statusColor: "#EF4444",
      color: "#7C3AED",
      mueve: "Canal Shopify completo con combos + CAS + ECOM Scanner",
      hipotesis: "Lanzamiento unificado habilita el canal Shopify para suppliers con combos",
      gmv: "Habilita canal completo para suppliers multi-canal",
      avance: "José (10-jul) confirmó que COM-001 queda detenido porque Dropify aún no está terminado. No pudo dar fecha tentativa de reactivación. Todo listo del lado de PM pero sin posibilidad de avanzar hasta que Dropify esté completo en TI.",
      next: "Monitorear estado de Dropify con José. Sin eso, COM-001 no tiene ventana de lanzamiento.",
      badge: "🔴 Detenido · Dropify pendiente",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "Estado PM", value: "Listo", sub: "4 frentes documentados" },
          { label: "Bloqueante", value: "Dropify", sub: "TI aún no lo termina" },
        ],
        meta: [
          { label: "Fecha reactivación", value: "Sin ETA", sub: "José no pudo dar fecha" },
        ],
        seguimiento: [
          { label: "Próximo check", value: "Monitorear", sub: "Cuando Dropify esté listo" },
        ]
      }
    },
    {
      code: "COM-002 / DESC-001 / NEG-002",
      name: "Combos D · Descuentos · Negociaciones S↔D",
      status: "⏳ Cola de dev · Sin fecha TI",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "3 proyectos PM listos esperando slot de desarrollo",
      hipotesis: "Secuencia: NEG-002 → COM-002 → DESC-001 según disponibilidad de dev",
      gmv: "~120K órdenes incrementales combinadas estimadas",
      avance: "Los tres proyectos tienen documentación PM lista. TI recibirá COM-002 y DESC-001 después de completar NEG-002. Sin estimaciones confirmadas. El prototipo de DESC-001 está en prueba con usuarios reales (piloto CAT). NEG-002 espera reunión de contexto con Juan Diego (PM anterior).",
      next: "NEG-002: agendar reunión con Juan Diego. COM-002 y DESC-001: esperar que TI arranque NEG-002 y dé estimaciones.",
      badge: "⏳ En cola · NEG-002 primero",
      badgeColor: "#6366F1",
      metricas: {
        base: [
          { label: "NEG-002 · dev estimado", value: "~18-ago", sub: "Primero en cola" },
          { label: "COM-002 · dev estimado", value: "~29-sep", sub: "Después de NEG-002" },
          { label: "DESC-001 · dev estimado", value: "~10-nov", sub: "Después de COM-002" },
        ],
        meta: [
          { label: "Trigger DESC-001", value: "Cyber Days", sub: "Agosto · en riesgo" },
          { label: "Prototipo DESC-001", value: "En prueba", sub: "Piloto CAT · usuarios reales" },
        ],
        seguimiento: [
          { label: "Estimaciones TI", value: "Pendiente", sub: "Sin fechas confirmadas" },
          { label: "Juan Diego NEG-002", value: "Por agendar", sub: "Contexto histórico" },
        ]
      }
    },
    {
      code: "DCA-001",
      name: "Campañas · Cyber Days",
      status: "🟢 Plan cerrado · Lanzamiento 11-ago",
      statusColor: "#10B981",
      color: "#0EA5E9",
      mueve: "GMV incremental por campañas de catálogo curado",
      hipotesis: "149.300–626.000 órdenes/año según escala de la campaña",
      gmv: "USD 2,24M–9,39M potencial",
      avance: "Plan completo cerrado en reunión 10-jul (Jaime + Michelle). Flujo: CRM a suppliers 24-jul → Meet Comercial 24-jul → Forms postulación 25–31 jul → Curaduría 31 jul–3 ago → Email instrucciones 3 ago (manual de marco + palabra clave + reglas de campaña) → Catálogo Canva 3–9 ago → Cierre catálogo + envío a dropshippers 11-ago → Publicación productos vestidos 10 ago → Lanzamiento 11-ago. Activación en Dropi: pieza home con CTA + banner en catálogo con filtro de campaña (categoría temporal). Pendiente: Juan David (Soporte) crea la categoría temporal post-curaduría.",
      next: "Michelle: subir el plan a la campaña en Darwin. Juan David: crear categoría temporal (después de curaduría, antes del 9-ago). Pendiente go/no-go de DESC-001 para el banner filtrable.",
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
          { label: "Categoría temporal", value: "Juan David", sub: "Post-curaduría · pendiente" },
          { label: "Banner filtrable", value: "Por confirmar", sub: "Depende de desc-001 / soporte" },
          { label: "Plan en Darwin", value: "Michelle · pendiente", sub: "Subir a campaña" },
        ]
      }
    },
    {
      code: "CAT-001 / CAZ-001",
      name: "Categorías · Caza Productos · Piloto + Cellboard",
      status: "🟡 Insights Cellboard + Piloto en curso",
      statusColor: "#3B82F6",
      color: "#3B82F6",
      mueve: "Árbol comercial aprobado → categorización IA + búsqueda semántica activa",
      hipotesis: "Pruebas con usuarios reales entregan insights para aprobación stakeholders",
      gmv: "Habilitador de búsqueda, SEO y campañas",
      avance: "CAT-001: piloto con 10 suppliers en curso desde 8-jul (árbol + IA). Feedback positivo: la IA categoriza bien y reduce el trabajo del proveedor al crear productos. CAZ-001: 6 entrevistas Cellboard revelaron patrón claro — 100% dice que el concepto es interesante, 0% enganchó de verdad. Las 3 causas: matching roto (ven categorías irrelevantes), sin notificaciones (tienen que entrar a buscar manualmente), y conversación muerta (nadie responde postulaciones). El valor real está en la agilidad del primer contacto. Existe Nexus (Comercial) que hace algo similar — investigar superposición. Siguiente experimento propuesto: contacto manual por CRM para validar si el matching activo genera negociaciones. Llevar a Dropi Pulso.",
      next: "CAT: completar sesiones piloto → mesa con Jacki. CAZ: experimento contacto manual + revisar Nexus con Juanse. Llevar CAZ a reunión Dropi Pulso.",
      badge: "🟡 Piloto + Cellboard insights",
      badgeColor: "#3B82F6",
      metricas: {
        base: [
          { label: "Entrevistas CAZ", value: "6", sub: "100% interés · 0% aha moment" },
          { label: "Suppliers en piloto CAT", value: "10", sub: "Usuarios reales" },
          { label: "Sesiones CAT iniciadas", value: "2 de 10", sub: "Desde 8-jul" },
        ],
        meta: [
          { label: "Mesa stakeholders CAT", value: "Post-piloto", sub: "Jacki + Category Manager" },
          { label: "Experimento CAZ", value: "Contacto manual", sub: "CRM → matching activo" },
        ],
        seguimiento: [
          { label: "Nexus (Comercial)", value: "Por revisar", sub: "¿Duplica CAZ?" },
          { label: "Dropi Pulso", value: "11-jul · reunión", sub: "Llevar CAZ ahí" },
          { label: "Bug búsqueda catálogo", value: "Reportado Soporte", sub: "Inconsistencias + semántica" },
          { label: "Beta Dropi", value: "Revisar bien", sub: "José: hay cambios de comportamiento" },
          { label: "Orden resultados", value: "Pendiente negocio", sub: "Aleatorio · priorizar Premium requiere validación" },
          { label: "Nomenclatura Premium Excl.", value: "Evaluar proyecto", sub: "Puede romper código · nombre hardcoded" },
        ]
      }
    },
  ],
  documentos: [],
  dolores: [],
  resumen: "Semana 10-jul · <strong>Borrador — se actualiza mañana con resultados de Cyber Days y piloto</strong>. El frente más crítico es <strong>TTV-001</strong>: 11 días de operación y 0 suppliers activos contra una meta de 104 al 31-ago (53 días). El bug de post-registro sin auto-login corta el 46% del tráfico antes de llegar al CRM. La semana trajo un hallazgo positivo en <strong>IND-001</strong>: 208 suppliers Activos ya cumplen el umbral de 3.000 órdenes para ascender a Verificado — sin que nadie los haya contactado. Y 29 Verificados ya cumplen para subir a Premium. Son palancas de impacto inmediato sin desarrollo. En negativo, la <strong>cola de desarrollo</strong> se consolida como el bloqueo estructural del S2: 4 proyectos con handoff PM listo, sin slot en TI, y el último (CAT-001) no entraría hasta feb 2027. Hoy 10-jul se realizó la reunión de alineación de <strong>Cyber Days</strong> con el equipo para definir productos y arrancar diseños. El piloto de <strong>CAT-001/CAZ-001/DESC-001</strong> con 10 suppliers está en curso.",
  proximosPasos: [
    {
      titulo: "Urgente · esta semana",
      color: "#EF4444",
      items: [
        "TTV-001: reportar bug post-registro a Soporte con descripción técnica (sin auto-login → 111 en el limbo).",
        "IND-001: coordinar con Comercial solicitudes de Premium represadas + campaña contacto a 208 A→V.",
        "CAZ-001: reportar bugs búsqueda catálogo y búsqueda semántica a Soporte. Revisar beta Dropi.",
        "Nomenclatura Premium Exclusivo: evaluar si es proyecto formal (riesgo de hardcoding en código).",
        "Cola dev: escalar con María reorganización de equipo TI — impacta toda la cola S2.",
      ]
    },
    {
      titulo: "Esta semana (hasta 12 jul)",
      color: "#F77F00",
      items: [
        "Cyber Days: cerrar productos elegibles (post-reunión hoy).",
        "Piloto CAT/CAZ/DESC: completar las 10 sesiones y consolidar insights.",
        "Orden de resultados CAZ: llevar a validación de negocio (¿priorizar Premium/Exclusivo?).",
        "NEG-002: agendar reunión de contexto con Juan Diego.",
      ]
    },
    {
      titulo: "Semana 14-jul",
      color: "#6366F1",
      items: [
        "15-jul: segunda reunión de seguimiento TTV-001 — dashboard tiempos entre etapas (Enrique) + auditoría #1.",
        "CAT-001: con insights del piloto → agendar mesa con Jacki y Category Manager.",
        "IND-001: primera respuesta de Comercial sobre campañas de ascenso.",
        "DCA-001: primera versión de diseños Cyber Days.",
      ]
    }
  ]
};
