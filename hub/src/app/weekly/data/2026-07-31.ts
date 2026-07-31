import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 28–31 jul 2026",
  kpiOkrs: [
    {
      etiqueta: "TTV-001 · C1 · Meta 31-ago",
      titulo: "Suppliers con activación neta (≥1 orden entregada)",
      actual: "18 suppliers",
      objetivo: "104 suppliers",
      brecha: "86 pendientes",
      pct: 17,
    },
    {
      etiqueta: "Dropi Pulso · Meta en 2 meses",
      titulo: "Órdenes movilizadas vía Dropi Pulso",
      actual: "0 órdenes",
      objetivo: "40.000 órdenes/mes",
      brecha: "40.000 por activar",
      pct: 0,
      nota: "Aún estamos en proceso de identificar cómo medimos automáticamente las órdenes atribuidas a Pulso. Cifra se actualizará una vez confirmemos la fuente de verdad.",
    },
  ],
  kpis: [
    {
      label: "Activación neta (TTV)",
      value: "18",
      sub: "Suppliers con ≥1 orden entregada al cliente final",
      color: "#10B981",
      icon: "✅",
      progress: 17,
    },
    {
      label: "Activación bruta (TTFO)",
      value: "97",
      sub: "Suppliers con ≥1 orden generada · primer paso",
      color: "#6366F1",
      icon: "⚡",
      progress: Math.round((97 / 620) * 100),
    },
    {
      label: "Fuga bruta→neta",
      value: "79",
      sub: "Generaron una orden pero no la completaron",
      color: "#EF4444",
      icon: "⚠️",
      alert: true,
    },
    {
      label: "Proyección Pulso",
      value: "40K/mes",
      sub: "Órdenes proyectadas solo desde Cuidado de Campañas",
      color: "#EC4899",
      icon: "🚀",
      progress: Math.round((8 / 40) * 100),
    },
    {
      label: "Churn jun-2026",
      value: "16%",
      sub: "Volvió al nivel de enero · señal de alerta activa",
      color: "#F59E0B",
      icon: "📉",
      alert: true,
    },
    {
      label: "Cyber Days",
      value: "T-11",
      sub: "Lanzamiento 11-ago · DESC-001 handoff esta semana",
      color: "#0EA5E9",
      icon: "🛍️",
    },
  ],
  subtitle: "31-jul · Pulso Fase 1 live · TTV pivot agente WA · ESP-001 datos reales · José responde · T-11 Cyber Days",
  heroBadge: "Semana 31 jul · Célula · T-11 al 11-ago",
  heroTitle: "Pulso Fase 1 en producción · TTV pivota a agente WA\nESP-001 primera semana real · DESC-001 handoff · T-11 Cyber Days",
  heroStrip: [
    { label: "Pulso proyección", value: "8K→40K", sub: "Órdenes/mes · solo cuidado campañas" },
    { label: "TTV neta", value: "18", sub: "Suppliers con ≥1 orden entregada" },
    { label: "TTV bruta", value: "97", sub: "Suppliers con ≥1 orden generada" },
    { label: "Cyber Days", value: "T-11", sub: "Lanzamiento 11-ago · DESC-001 handoff" },
    { label: "ESP-001 · msgs en Supabase", value: "693", sub: "21-30 jul · 157 personas · bugs plataforma #1" },
  ],
  insights: [
    {
      id: "INS-001",
      titulo: "TTV-001 · Dashboard entregado por Enrique — 18 neta, 97 bruta · Plan de choque Fast Track no funcionó · Pivot: agente WA de selección",
      descripcion: "Enrique entregó el dashboard formal de seguimiento de activación (Metabase en vivo). Cifras reales: 97 providers con al menos 1 orden generada (activación bruta / TTFO) y 18 con al menos 1 orden entregada (activación neta / TTV real). La brecha 97→18 es el punto exacto de fuga: proveedores que crean una orden pero no la completan. El plan de choque Fast Track (10 llamadas directas a providers del formulario) no rindió como se esperaba: algunos contestaron, algunos agendaron, pero el nivel de interés en recibir apoyo fue bajo. Hallazgo importante: el formulario de entrada no es confiable — muchos proveedores declaran volumen alto que en realidad no tienen, lo que contamina la lista de 'alto potencial'. Decisión: pivotamos. La próxima semana se empieza a implementar un agente de WA que identifique comportamiento real antes de hacer contacto humano — solo los providers que el agente califique con señal real (no lo que declaran) reciben llamada. El agente de WA pasa a ser el filtro de calidad antes del toque humano, no solo automatización de onboarding.",
      proyecto: "TTV-001",
      tipo: "Decisión",
      tipoColor: "#7C3AED",
      impacto: "Alto",
    },
    {
      id: "INS-002",
      titulo: "Dropi Pulso · Fase 1 en producción — Comercial reemplaza Nexus, señales activas, proyección 8K→40K órdenes/mes",
      descripcion: "Dropi Pulso Fase 1 está en ejecución real. Comercial ya recibió la plataforma y está reemplazando Nexus en la operación diaria del equipo de Cuidado de Campañas. El motor de señales está corriendo: 8 tipos activos (tendencia, relacionamiento, temporada, reactivación, privatización, pulso, stock, importación), 6 estados de flujo con alertas en tiempo real para asistencia. La automatización clave: cuando un producto cruza a prioridad Alta (≤5 días de stock) con campaña activa, el sistema crea la señal automáticamente — nadie la transcribe a mano. Un solo update de stock recalcula todos los dropshippers que cuidan ese mismo producto. En reunión con Comercial se estimó que solo con esta automatización de cuidado de campañas podemos pasar de 8.000 a 40.000 órdenes movilizadas al mes. Pendiente de cuantificar: impacto adicional de patinadores en PAU, señales de pulso directas y otras fuentes — la proyección total puede ser significativamente mayor.",
      proyecto: "Dropi Pulso",
      tipo: "Dato",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-003",
      titulo: "Dropi Pulso · Fase 2 próxima semana — automatizaciones + inicio manual con Pareto de Iván y Pareto de dropshippers",
      descripcion: "La Fase 2 de Dropi Pulso arranca la próxima semana con dos frentes en paralelo. Frente 1 — Automatizaciones desde Cuidado de Campañas: cerrar el loop completo entre 'cruzó a prioridad Alta' y 'proveedor enterado' sin ningún paso manual — notificación automática al comercial y al proveedor (WA/email). Frente 2 — Inicio manual con poblaciones reales: (a) Pareto de proveedores de Iván Caicedo (proveeduría puente, 30 proveedores aliados con compromisos previos — primera población controlada), (b) Pareto de dropshippers de todo el equipo Comercial (535 usuarios gestionados). Condición técnica: el endpoint de data de Reinoso es prerequisito para operar Pulso sobre datos reales de la BD de Dropi. Pendiente confirmar esta semana si el mantenimiento de BD ya terminó.",
      proyecto: "Dropi Pulso",
      tipo: "Decisión",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-004",
      titulo: "ESP-001 · 693 mensajes reales en Supabase (21-30 jul) · 2 grupos · 157 personas · Bugs/Plataforma y Transportadoras lideran",
      descripcion: "Cifras reales consultadas desde Supabase al 30-jul-2026: 693 mensajes capturados por el bot en 10 días (21-30 jul). 2 grupos activos: Grupo A (405 msgs, 84 personas únicas) + Grupo B (288 msgs, 100 personas únicas). 157 personas únicas en total. Spam real: mínimo (~12 mensajes). Ranking de temas por análisis de keywords sobre el acumulado completo: #1 Bugs y fricciones de plataforma (102) — duplicación de pedidos, reportes que no cargan, stock que aparece disponible pero no lo está; #2 Transportadoras y logística (79) — devoluciones altas, CAS sin respuesta, 49/50 pedidos con novedad de dirección errada en Bogotá; #3 Proveedores / catálogo / stock (60) — stock fantasma, precios, márgenes; #4 Soporte y atención al cliente (52) — Lucho (CEO, Luis Alberto Ramos Ruiz) es el 3er mayor emisor del Grupo B con 12 mensajes, resolviendo tickets directamente; #5 Garantías y devoluciones (46); #6 Wallet y pagos (28); #7 Shopify / integraciones (9); #8 Facturación / DIAN (5). Pendiente: clasificación manual validada sobre el acumulado para confirmar ranking y detectar citas representativas por tema.",
      proyecto: "ESP-001",
      tipo: "Hallazgo",
      tipoColor: "#10B981",
      impacto: "Alto",
    },
    {
      id: "INS-005",
      titulo: "ESP-001 · Fase 1 implementada — búsqueda por tema funciona · Fase 2: Facebook, YouTube y extensión a otras células",
      descripcion: "Fase 1 de ESP-001 está implementada: bot 'Jaime' en modo solo-escucha en grupos WA, dashboard Radar de Comunidad con tres vistas (Panorama para CEO/CPO, Banco de Trabajo para PM/Designer, Consulta/Búsqueda). La búsqueda por tema ya funciona — palabra clave sobre mensajes del período seleccionado (7/14/30 días), sin IA, sin latencia. Los temas todavía se curan a mano semanalmente. Fase 2 requiere definir: (1) conectar Facebook (Dropi compró grupos de FB hace ~2 años) y YouTube (volumen alto en comentarios), (2) pipeline automático de clasificación de temas — hoy es manual, (3) definir con Brands y Logística qué grupos escucharían y qué vista necesitan (no asumir que quieren lo mismo que Suppliers), (4) conectar el botón 'Escalar a ciclo' al discovery del hub para que un tema escalado genere oportunidad en el backlog automáticamente.",
      proyecto: "ESP-001",
      tipo: "Dato",
      tipoColor: "#10B981",
      impacto: "Medio",
    },
    {
      id: "INS-006",
      titulo: "José Giraldo respondió — DESC-001 handoff esta semana · NEG-001 carga masiva bloqueada hasta nueva versión · CAZ-001 bug vinculado a CAT-001",
      descripcion: "Después de dos semanas sin weekly, José Giraldo respondió por mensaje directo a las preguntas puntuales. Cuatro respuestas: (1) DESC-001 Precio Antes/Ahora: 'Citar handoff esta semana' — hay que agendar hoy. Con T-11 días para Cyber Days, cada día cuenta. (2) NEG-001 Carga masiva: no va a salir como feature suelto — la funcionalidad de carga de negociaciones tiene que salir completa con la nueva versión de negociaciones porque resultó demasiado compleja. Sin fecha, sin recursos asignados. El piloto con GGP Comercializadora (10K+ productos) sigue bloqueado indefinidamente — Emilille y el equipo comercial deben saberlo. (3) COM-001 Combos: en cola, revisarán recursos cuando salgan de Negociaciones. (4) CAZ-001 bug Caza Productos: 'Hay que revisar primero el árbol de categorías para no agrandar el problema' — esto vincula CAZ-001 explícitamente a CAT-001. Desbloquear CAT-001 ahora también destraba el bug de Caza Productos.",
      proyecto: "TI / Cola dev",
      tipo: "Decisión",
      tipoColor: "#F59E0B",
      impacto: "Alto",
    },
    {
      id: "INS-007",
      titulo: "CAT-001 · Argumento de priorización reforzado — desbloquea CAZ-001, Pulso y proyecciones de Valentina · Pitch el jueves con María",
      descripcion: "CAT-001 ganó un argumento de priorización nuevo y concreto esta semana: José confirmó que el bug de Caza Productos no se puede resolver sin revisar primero el árbol de categorías. Esto suma a los dos casos de uso ya documentados — (a) Valentina en Dropi Pulso tiene 111K IDs de producto sin estandarizar y no puede hacer proyecciones de temporada por producto real, (b) el motor de alertas de concentración de Pulso tampoco puede operar sin IDs estandarizados. El pitch del jueves con María (instancia donde ella asigna devs) tiene que conectar los tres casos: CAT-001 desbloquea CAZ-001 (bug), desbloquea las proyecciones de Valentina (Cuidado de Campañas), y desbloquea las alertas de Pulso. Tres impactos con un solo unlock técnico.",
      proyecto: "CAT-001",
      tipo: "Dato",
      tipoColor: "#7C3AED",
      impacto: "Alto",
    },
  ],
  oportunidades: [
    {
      code: "TTV-001",
      name: "Time to Value · Pivot agente WA de selección",
      status: "🟡 Dashboard live · Pivot decidido · Agente WA próxima semana",
      statusColor: "#F59E0B",
      color: "#F77F00",
      mueve: "Identificar providers con potencial real antes de hacer contacto humano",
      hipotesis: "El agente WA filtra por comportamiento (no por declaración), mejora la tasa de conversión del Fast Track y reduce el trabajo del equipo",
      gmv: "18 activaciones netas actuales · meta: 104 al 31-ago",
      avance: "Dashboard Metabase en vivo (Enrique). Cifras reales: 97 con orden generada (bruta), 18 con orden entregada (neta). Plan de choque Fast Track (10 llamadas) no funcionó: bajo interés del supplier en recibir apoyo, formulario de encuesta no confiable — declaran volumen que no tienen. Decisión: agente WA identifica potencial real → solo esos reciben llamada. El agente pasa a ser el filtro de calidad, no solo automatización.",
      next: "Semana del 04-ago: implementar agente WA de selección. Redefinir criterios de scoring (comportamiento real, no declaración). Mantener seguimiento del dashboard Metabase semana a semana.",
      badge: "🟡 Dashboard live · Pivot agente WA",
      badgeColor: "#F59E0B",
      ttvLive: true,
      metricas: {
        base: [
          { label: "Activación neta (TTV)", value: "18", sub: "Orden entregada · valor real", tooltip: "Providers que completaron al menos 1 orden entregada al cliente final." },
          { label: "Activación bruta (TTFO)", value: "97", sub: "Orden generada · primera transacción" },
          { label: "Brecha neta/bruta", value: "79", sub: "Generaron pero no completaron" },
        ],
        meta: [
          { label: "Meta C1 · 31-ago", value: "104", sub: "Activos netos en ~30 días" },
          { label: "Agente WA", value: "Semana 04-ago", sub: "Filtro de calidad antes del toque humano" },
          { label: "Meta total · 31-dic", value: "620", sub: "Suppliers activos" },
        ],
        seguimiento: [
          { label: "Plan de choque", value: "No efectivo", sub: "Formulario no confiable" },
          { label: "Dashboard Metabase", value: "Live ✅", sub: "Enrique · vivo desde esta semana" },
          { label: "Pivot", value: "Decidido", sub: "Agente WA · próxima semana" },
        ]
      }
    },
    {
      code: "Dropi Pulso",
      name: "Dropi Pulso · Fase 1 live · Fase 2 arranca el 04-ago",
      status: "🟢 Fase 1 en producción · 8K→40K órdenes/mes · Fase 2 próxima semana",
      statusColor: "#10B981",
      color: "#EC4899",
      mueve: "Automatizar el cuidado de campañas del Pareto → más campañas/usuario sin más personas",
      hipotesis: "Con señales automáticas de stock + loop de notificación cerrado, el equipo pasa de 2 a 4 campañas/usuario/mes",
      gmv: "Proyección: 8.000 → 40.000 órdenes/mes solo desde cuidado de campañas",
      avance: "Fase 1 en producción desde esta semana. Comercial reemplaza Nexus. Motor activo: señal de stock automática cuando cruza a Alta (≤5 días), recálculo masivo de prioridad en un solo update de stock. En reunión con comercial se estimó el salto de 8K a 40K órdenes movilizadas. Fase 2: (1) cerrar el loop de notificación automática, (2) inicio manual con Pareto de Iván Caicedo (30 proveedores aliados) + Pareto de dropshippers de todo Comercial (535 usuarios).",
      next: "Semana 04-ago: frente 1 — automatizar notificación al proveedor/comercial cuando cruza a Alta. Frente 2 — inicio manual con Pareto de Iván + Pareto de dropshippers. Confirmar esta semana si Reinoso terminó mantenimiento de BD (prerequisito del endpoint de data real).",
      badge: "🟢 Fase 1 live · 8K→40K proyectado",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Estado", value: "Fase 1 live ✅", sub: "Comercial reemplaza Nexus" },
          { label: "Proyección cuidado camp.", value: "8K→40K", sub: "Órdenes/mes estimadas con comercial" },
          { label: "Señal Stock", value: "Automática ✅", sub: "Cruza Alta con campaña activa → señal sola" },
        ],
        meta: [
          { label: "Fase 2 · Frente 1", value: "Notif. automática", sub: "Alta → proveedor enterado sin manual" },
          { label: "Pareto Iván Caicedo", value: "30 providers", sub: "Proveeduría puente · primer piloto real" },
          { label: "Pareto dropshippers", value: "535 usuarios", sub: "Todo el equipo Comercial" },
        ],
        seguimiento: [
          { label: "Endpoint Reinoso", value: "Confirmar esta sem", sub: "Prerequisito para data real de Dropi" },
          { label: "Seguimiento Natalia", value: "Pendiente", sub: "Reunión cortada por internet" },
          { label: "Inicio Fase 2", value: "Semana 04-ago", sub: "Dos frentes en paralelo" },
        ]
      }
    },
    {
      code: "DCA-001 / DESC-001",
      name: "Cyber Days 11-ago · T-11 · DESC-001 handoff esta semana",
      status: "🟡 T-11 · Handoff DESC-001 pendiente · Sistema DCA-001 listo",
      statusColor: "#F59E0B",
      color: "#0EA5E9",
      mueve: "GMV incremental por campaña de catálogo curado Cyber Days",
      hipotesis: "Sistema de frames automáticos + popup UserPilot + etiquetas Lucho multiplica participación de proveedores sin depender de que cada uno actualice manualmente",
      gmv: "149.300–626.000 órdenes/año según escala",
      avance: "Sistema DCA-001 listo: link personalizado por proveedor, frames automáticos ZIP, catálogo Canva, categoría 'CyberDays', etiquetas Lucho, popup UserPilot (confirmado por Laura). DESC-001 (Precio Antes/Ahora): José confirmó handoff esta semana — hay que agendar hoy. Este es el blocker de Cyber Days que más urgía desbloquear. Meet kick-off con suppliers: 1-ago. Majo tiene assets gráficos. Dominio Dropy: pendiente integración. Lanzamiento: 11-ago.",
      next: "Hoy: agendar handoff DESC-001 con José. 1-ago: meet kick-off con suppliers (DCA-001). 3-ago: email instrucciones + Canva. 9-ago: cierre de carga. 10-ago: publicación vestida. 11-ago: lanzamiento. Confirmar con Lucho la integración de etiquetas en Dropy.",
      badge: "🟡 T-11 · Handoff DESC-001 esta semana",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Sistema DCA-001", value: "Listo ✅", sub: "Frames auto + Canva + popup UserPilot" },
          { label: "DESC-001 handoff", value: "Esta semana", sub: "José confirmó · agendar hoy" },
          { label: "Meet suppliers", value: "1-ago", sub: "Viernes · kick-off" },
        ],
        meta: [
          { label: "Email instrucciones", value: "3-ago", sub: "Post kick-off" },
          { label: "Cierre carga", value: "9-ago", sub: "Última ventana para proveedores" },
          { label: "Lanzamiento", value: "11-ago", sub: "T-11 días" },
        ],
        seguimiento: [
          { label: "Dominio Dropy", value: "Pendiente integración", sub: "Majo gestiona" },
          { label: "Etiquetas Lucho", value: "Confirmar con Lucho", sub: "Participación sin actualizar foto" },
          { label: "Assets gráficos", value: "Majo · en progreso", sub: "¿Listos o aún en diseño?" },
        ]
      }
    },
    {
      code: "ESP-001",
      name: "ESP-001 · Radar de Comunidad — Fase 1 entregada",
      status: "🟢 Fase 1 live · Datos reales · Búsqueda funciona · Fase 2 por definir",
      statusColor: "#10B981",
      color: "#10B981",
      mueve: "Convertir mensajes de WhatsApp de grupos en inteligencia de producto accionable sin que nadie lea el chat completo",
      hipotesis: "Escuchar canales externos de forma sistemática genera insights que hoy no tenemos — y permite anticipar fricciones antes de que lleguen a soporte o churn",
      gmv: "Habilitador de discovery continuo para toda la célula y futuras células",
      avance: "Fase 1 implementada: bot 'Jaime' en grupos WA, dashboard con tres vistas (Panorama/Banco/Consulta), búsqueda por tema funcional. Datos reales confirmados desde Supabase al 30-jul: 693 mensajes en 10 días (21-30 jul), 2 grupos, 157 personas únicas. Grupo A: 405 msgs / 84 personas. Grupo B: 288 msgs / 100 personas. Spam real: solo ~12 mensajes. Top temas por análisis de keywords: #1 Bugs/plataforma (102) — pedidos duplicados, stock fantasma, reportes que no cargan. #2 Transportadoras (79) — devoluciones altas, CAS sin respuesta, 49/50 pedidos con dirección errada. Lucho (CEO) es el 3er mayor emisor del Grupo B con 12 mensajes propios resolviendo tickets. La búsqueda por tema funciona: cualquier miembro del equipo puede buscar 'qué dicen sobre X' sin leer el chat.",
      next: "Definir con Kate/Laura/Majo el ritmo de clasificación semanal — quién lo hace, qué día. Definir qué grupos de Facebook/YouTube entran a Fase 2. Hablar con Brands y Logística: qué grupos escucharían. Conectar 'Escalar a ciclo' al hub.",
      badge: "🟢 693 msgs reales · Bugs plataforma #1",
      badgeColor: "#10B981",
      metricas: {
        base: [
          { label: "Mensajes en Supabase", value: "693", sub: "21-30 jul · 2 grupos · 157 personas únicas" },
          { label: "Tema #1", value: "Bugs plataforma", sub: "102 hits · pedidos duplicados · stock fantasma" },
          { label: "Tema #2", value: "Transportadoras", sub: "79 hits · devoluciones · CAS sin respuesta" },
        ],
        meta: [
          { label: "Fase 2 · Canales", value: "Facebook + YouTube", sub: "Grupos FB comprados hace 2 años" },
          { label: "Clasificación auto", value: "Pendiente pipeline", sub: "Hoy es manual semanal" },
          { label: "Otras células", value: "Brands + Logística", sub: "Definir necesidades propias" },
        ],
        seguimiento: [
          { label: "Ritmo clasificación", value: "Definir con equipo", sub: "Kate · Laura · Majo" },
          { label: "Escalar a ciclo", value: "Botón pendiente", sub: "Conectar a discovery del hub" },
          { label: "WA dedicado área", value: "Pendiente solicitar", sub: "Hoy usa el WA de Mit" },
        ]
      }
    },
    {
      code: "CAT-001",
      name: "CAT-001 · Categorías — 3 razones para priorizar esta semana",
      status: "🟡 Pitch el jueves · Desbloquea CAZ-001 + Pulso + proyecciones Valentina",
      statusColor: "#F59E0B",
      color: "#7C3AED",
      mueve: "Árbol de categorías aprobado → destraba bug CAZ-001, IDs Pulso y proyecciones de temporada de Valentina",
      hipotesis: "Estandarizar IDs de producto elimina el cuello de botella que hoy bloquea tres iniciativas distintas",
      gmv: "Habilitador: CAZ-001 bug + Pulso proyecciones + alertas de concentración",
      avance: "CAT-001 tiene 3 casos de uso concretos y urgentes: (1) José confirmó que el bug de Caza Productos no se puede resolver sin revisar el árbol de categorías primero. (2) Valentina tiene 111K IDs de producto sin estandarizar — no puede hacer proyecciones de temporada por producto real. (3) El motor de alertas de concentración de Pulso tampoco puede operar sin IDs estandarizados. Demo positiva con Lucho la semana pasada. María dijo 'esos devs los desbloqueamos los jueves'. El jueves es esta semana.",
      next: "Jueves: pitch de 5 minutos con María — conectar los 3 casos de uso (CAZ-001 bug, proyecciones Valentina, alertas Pulso). Preparar la pregunta concreta: '¿Cuándo y quién puede asignarse a CAT-001?' IND-001: esperar confirmación de María con Legal — en cuanto llegue, activar 208 candidatos a Verificado.",
      badge: "🟡 Jueves · Pitch 3 casos de uso",
      badgeColor: "#F59E0B",
      metricas: {
        base: [
          { label: "Herramienta", value: "En producción ✅", sub: "Vercel · IA GPT-4o mini · 225 nodos L4" },
          { label: "Demo Lucho", value: "Positiva ✅", sub: "Semana pasada · recepción buena" },
          { label: "Blocker CAZ-001", value: "Confirmado por José", sub: "Bug vinculado al árbol" },
        ],
        meta: [
          { label: "Pitch el jueves", value: "3 casos de uso", sub: "CAZ + Pulso + Valentina" },
          { label: "IND-001 · Legal", value: "208 candidatos listos", sub: "Esperando visto bueno de María" },
        ],
        seguimiento: [
          { label: "IDs sin estandarizar", value: "111.000", sub: "Bloquea proyecciones Valentina" },
          { label: "Reunión jueves", value: "Estar presente", sub: "María asigna devs ahí" },
        ]
      }
    },
    {
      code: "NEG-001 / COM-001",
      name: "Cola Dev · NEG-001 sin fecha · COM-001 en espera",
      status: "🔴 NEG-001 carga masiva bloqueada indefinidamente · COM-001 en cola",
      statusColor: "#EF4444",
      color: "#6B7280",
      mueve: "Piloto GGP bloqueado · Combos sin ETA",
      hipotesis: "Sin carga masiva el piloto de negociaciones no puede avanzar a escala",
      gmv: "Piloto GGP: 10K+ productos bloqueados · Combos sin estimación",
      avance: "José respondió: la carga masiva de NEG-001 no va a salir como feature aislado — tiene que salir completa con la nueva versión de negociaciones porque resultó demasiado compleja. Sin recursos, sin fecha. El piloto con GGP Comercializadora (10K+ productos) sigue bloqueado indefinidamente. COM-001 Combos: en cola, revisarán recursos cuando salgan de Negociaciones. Emilille debe ser informada hoy — estaba esperando la carga masiva para mover las comunidades. El workaround manual (ticket STID-6257) sigue siendo la única opción disponible.",
      next: "Comunicar a Emilille hoy: la carga masiva no tiene fecha — el workaround es el ticket de soporte manual. NEG-002 (Negociaciones Supplier↔Dropshipper): agendar reunión con Juan Diego (PM anterior) — prerequisito para el discovery formal. CAZ-001 bug: bloqueado por CAT-001 según José.",
      badge: "🔴 NEG-001 sin fecha · Emilille debe saberlo hoy",
      badgeColor: "#EF4444",
      metricas: {
        base: [
          { label: "NEG-001 carga masiva", value: "⛔ Sin fecha", sub: "Espera nueva versión completa" },
          { label: "COM-001 Combos", value: "En cola", sub: "Después de NEG · sin recursos" },
          { label: "Piloto GGP", value: "Bloqueado", sub: "10K+ productos · workaround STID-6257" },
        ],
        meta: [
          { label: "Emilille", value: "Informar hoy", sub: "Cambio de plan en negociaciones" },
          { label: "NEG-002", value: "Reunión Juan Diego", sub: "Prerequisito discovery" },
        ],
        seguimiento: [
          { label: "Workaround disponible", value: "STID-6257", sub: "Ticket soporte · único camino hoy" },
          { label: "Bug búsqueda semántica", value: "Verificar", sub: "José dice que ajustaron" },
        ]
      }
    },
  ],
  documentos: [],
  dolores: [
    {
      frente: "NEG-001 carga masiva — cambio de alcance no comunicado al equipo comercial",
      tag: "🔴 Comunicación urgente",
      tagColor: "#EF4444",
      salio: "La carga masiva de negociaciones no va a salir como feature aislado — va a esperar la nueva versión completa de Negociaciones (sin fecha). Emilille lleva semanas esperando esa funcionalidad para mover el piloto de negociaciones con las comunidades. GGP Comercializadora (10K+ productos) sigue bloqueado.",
      ruta: "Comunicar a Emilille hoy el cambio de plan. El workaround manual (ticket STID-6257) es la única vía disponible. Evaluar si el piloto puede avanzar con el workaround o si hay que redefinir el alcance del piloto.",
      rutaColor: "#EF4444",
      metrica: "Piloto con 0 de 5 negociaciones activas meta · workaround manual como único camino",
      decision: "Comunicación hoy — no esperar a la próxima semana"
    },
    {
      frente: "TTV-001 — Fast Track plan de choque no efectivo · formulario no confiable",
      tag: "🟡 Pivot necesario",
      tagColor: "#F59E0B",
      salio: "Las 10 llamadas directas a providers del formulario no rindieron: bajo interés en recibir apoyo, volumen declarado no coincide con el real. La lista de 'alto potencial' está contaminada con declaraciones falsas. El scoring actual del pipeline depende de datos de entrada que no son confiables.",
      ruta: "Pivot a agente WA que identifica comportamiento real (no declaración) antes de hacer contacto humano. Redefinir criterios de scoring del pipeline GHL. Solo los providers que el agente califique con señal real reciben llamada del equipo.",
      rutaColor: "#F59E0B",
      metrica: "18 activaciones netas vs. meta 104 al 31-ago · ~30 días para cerrar la brecha con nueva estrategia",
      decision: "Agente WA arranca semana del 04-ago — no esperar más iteraciones del modelo actual"
    },
  ],
  resumen: "Semana 28-31 jul · Tres proyectos entraron a una nueva fase. <strong>Dropi Pulso Fase 1</strong> está en producción real: el equipo Comercial reemplaza Nexus, señales automáticas de stock activas, proyección estimada <strong>8.000 → 40.000 órdenes/mes</strong> solo desde Cuidado de Campañas. <strong>TTV-001</strong> pivota: el plan de choque Fast Track no funcionó — formulario no confiable, bajo interés del supplier. Dashboard en vivo: <strong>18 activaciones netas, 97 brutas</strong>. La próxima semana arranca el <strong>agente WA de selección</strong>. <strong>ESP-001</strong> confirmado desde Supabase: <strong>693 mensajes reales</strong> (21-30 jul), 2 grupos, 157 personas. El tema #1 real (no el de la clasificación manual preliminar) es <strong>Bugs y fricciones de plataforma (102 hits)</strong> — pedidos duplicados, stock fantasma, reportes que no cargan. Transportadoras queda en #2 (79 hits). Hallazgo: Lucho (CEO) es el 3er mayor emisor del Grupo B con 12 mensajes propios resolviendo tickets directamente — cercanía deliberada, no solo fricción. De <strong>José Giraldo</strong>: respondió. DESC-001 handoff esta semana (urgente, T-11 Cyber Days). NEG-001 carga masiva sin fecha — espera nueva versión. COM-001 en cola. Bug CAZ-001 vinculado a CAT-001. <strong>Jueves</strong>: pitch CAT-001 con María — un solo unlock técnico destraba tres iniciativas (CAZ-001 bug, proyecciones Valentina en Pulso, alertas de concentración).",
  proximosPasos: [
    {
      titulo: "Hoy mismo · no puede esperar",
      color: "#EF4444",
      items: [
        "Agendar handoff DESC-001 con José esta semana — T-11 al Cyber Days, cada día cuenta.",
        "Comunicar a Emilille: la carga masiva de NEG-001 no tiene fecha, el workaround es el ticket STID-6257.",
        "Confirmar con Reinoso si el mantenimiento de BD ya terminó — prerequisito para Fase 2 de Pulso.",
        "Verificar bug de búsqueda semántica — José dice que lo ajustaron, alguien del equipo tiene que probarlo.",
      ]
    },
    {
      titulo: "Esta semana · en movimiento",
      color: "#F59E0B",
      items: [
        "DESC-001: ejecutar el handoff con José esta semana (se acordó el lunes).",
        "DCA-001: meet kick-off con suppliers el viernes 1-ago. Confirmar con Lucho etiquetas en Dropy. Confirmar con Majo el estado de assets.",
        "Dropi Pulso Fase 2: confirmar con Reinoso la ventana técnica para el endpoint. Seguimiento con Natalia (reunión cortada por internet).",
        "IND-001: esperar visto bueno de María con Legal — en cuanto llegue, activar 208 candidatos a Verificado por WA.",
        "ESP-001: definir con Kate/Laura/Majo el ritmo de clasificación semanal. Solicitar WA dedicado para el área.",
        "CAT-001: preparar pitch de 5 minutos con los 3 casos de uso para el jueves con María.",
        "NEG-002: agendar reunión con Juan Diego — prerequisito para arrancar discovery.",
      ]
    },
    {
      titulo: "Semana del 04-ago · próxima sprint",
      color: "#7C3AED",
      items: [
        "TTV-001: implementar agente WA de selección — filtro de potencial real antes del contacto humano.",
        "Dropi Pulso Fase 2: inicio manual con Pareto de Iván Caicedo (30 providers) + Pareto de dropshippers de Comercial (535 usuarios). Automatizar notificación al proveedor/comercial cuando cruza a Alta.",
        "DCA-001: email instrucciones + acceso a Canva (3-ago). Ventana de carga de piezas (3-9 ago).",
        "ESP-001 Fase 2: primer acercamiento con Brands y Logística para definir sus necesidades. Explorar conectar grupos de Facebook.",
        "CAT-001: actuar sobre la decisión de devs que salga del jueves con María.",
      ]
    },
  ]
};
