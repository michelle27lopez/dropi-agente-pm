import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 26 ago–01 sep 2026",
  subtitle:
    "Weekly Célula Brands | PL-PM (Jose Giraldo, Kate) · Perfil de Marcas confirma retraso: Leonardo Fuentes es el mismo recurso de Rearquitectura (lanzamiento prioritario) y no alcanza el 15-sep con margen de pruebas — nueva fecha la entrega Jose Giraldo jue/vie · La Fase 1 deja de ser beta y sale directo a producción · Emprendedores Plus se desbloquea: Jose Giraldo entregó credenciales de prueba y Producto arranca el ciclo · Combos mantiene 8-sep pero sin validación directa con el desarrollador",
  heroBadge: "Weekly Brands · Semana 01 sep",
  heroTitle:
    "Perfil de Marcas confirma retraso — recurso único compartido con Rearquitectura; nueva fecha la entrega Jose Giraldo jueves o viernes\n+ La Fase 1 de Perfil de Marcas deja de manejarse como beta: sale directo a producción con la migración de 3 fases ya aprobada\n+ Emprendedores Plus desbloqueado: credenciales de prueba entregadas, Producto inicia el ciclo · Combos mantiene 8-sep sin seguimiento directo al desarrollador",
  heroStrip: [
    { label: "Perfil de Marcas", value: "🔴 Retraso confirmado", sub: "Recurso único compartido con Rearquitectura (Leonardo Fuentes)" },
    { label: "Perfil de Marcas · Fase 1", value: "Sin beta", sub: "Sale directo a producción; nueva fecha sin definir (jue/vie la da Jose Giraldo)" },
    { label: "Plan original", value: "dev 15-sep → salida 29-sep", sub: "Ya no aplica; pruebas de producto de 2 semanas" },
    { label: "Migración", value: "3 fases aprobadas", sub: "Fase 1 = 20 usuarios de 5 en 5, escalonados por madurez" },
    { label: "Emprendedores Plus", value: "🟢 En pruebas", sub: "Credenciales entregadas; sin fechas de beta/producción aún" },
    { label: "Combos · Producción", value: "8-sep (sin validar)", sub: "Jose Giraldo no ha hecho seguimiento directo al desarrollador" }
  ],
  insights: [
    {
      id: "ins-2026-09-01-01",
      titulo: "Perfil de Marcas confirma retraso: el recurso de Tecnología es el mismo de Rearquitectura",
      descripcion:
        "Leonardo Fuentes es el recurso asignado tanto a Rearquitectura como a Perfil de Marcas. Está enfocado en resolver los puntos reportados de Rearquitectura (lanzamiento prioritario), por lo que no alcanza a cerrar el 15 de septiembre con margen de pruebas. Perfil de Marcas ya tiene avance significativo en desarrollo, pero Tecnología pide holgura adicional para pruebas. La nueva fecha de desarrollo y salida la entrega Jose Giraldo entre jueves y viernes de esta semana.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-09-01-02",
      titulo: "La Fase 1 de Perfil de Marcas deja de manejarse como beta y sale directo a producción",
      descripcion:
        "Decisión: no hay fecha de beta. La Fase 1 sale directo a producción. El plan original —entrega de desarrollo 15-sep, pruebas de producto desde el 16-sep durante 2 semanas y salida el 29-sep— cambia; la nueva fecha aún no está definida.",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Alto"
    },
    {
      id: "ins-2026-09-01-03",
      titulo: "Estrategia de migración de Perfil de Marcas en 3 fases: alineada y aprobada con todo el equipo",
      descripcion:
        "Fase 1: 20 usuarios segmentados por madurez, migrados de 5 en 5 y de forma escalonada (Creciendo → Consolidando → Preescalando → Escalando), en línea con Tecnología y Comercial. Fase 2: tras el go de Fase 1, migración del 50–80% de marcas viables (las que manejan logística propia o venden producto propio). Fase 3: liberación al público.",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Alto"
    },
    {
      id: "ins-2026-09-01-04",
      titulo: "La Fase 1 corre en producción real: se necesita canal de reporte y respuesta en vivo",
      descripcion:
        "La Fase 1 no corre en un ambiente controlado. Un error impacta directamente la operación de marcas activas, por lo que se creará un grupo de Google Chat (Producto + Tecnología + Comercial) para la atención inmediata de errores, apoyado en una estrategia de WhatsApp.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Medio"
    },
    {
      id: "ins-2026-09-01-05",
      titulo: "ATOM debe salir con el Perfil de Marcas",
      descripcion:
        "Compromiso de Jose Giraldo: ATOM sale junto con el Perfil de Marcas. Marketing (Maria Jose Calderon) ya tiene el material —tango y video del perfil— y la alineación de que Marcas tendrá un home propio que redireccionará a un WordPress/espacio dedicado, para apoyar con el contenido de la salida de Fase 1.",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Medio"
    },
    {
      id: "ins-2026-09-01-06",
      titulo: "Dropi Academy para Marcas depende de insumos de Esteban, sin fecha comprometida",
      descripcion:
        "Esteban Solano y Francisco Velandia tienen pendiente definir el redireccionamiento de recursos de Dropi Academy para que apunte a Marcas y no a Dropshipper/Proveedores. Francisco Velandia no puede enviar los recursos por correo a Tecnología hasta recibir los insumos de Esteban, que no tienen fecha comprometida.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Bajo"
    },
    {
      id: "ins-2026-09-01-07",
      titulo: "Emprendedores Plus se desbloquea: Jose Giraldo entregó las credenciales de prueba",
      descripcion:
        "Jose Giraldo entregó las credenciales de prueba (respuesta por correo + archivo en Drive con permisos de lectura controlados para Laura Sánchez, Francisco Velandia, María y Jaime). El acceso es deliberadamente restringido por confidencialidad. Producto inicia el ciclo de pruebas con esas credenciales. No hay fechas de beta ni producción; deben establecerse una vez cierre el ciclo de pruebas.",
      proyecto: "EMP-PLUS",
      tipo: "Hallazgo",
      tipoColor: "#94A3B8",
      impacto: "Medio"
    },
    {
      id: "ins-2026-09-01-08",
      titulo: "Combos mantiene el 8-sep, pero sin validación directa con el desarrollador",
      descripcion:
        "Jose Giraldo confirmó que el desarrollador está trabajando esta semana y que la fecha del 8 de septiembre sigue en pie, pero reconoció que no ha hecho seguimiento directo al desarrollador; queda pendiente verificar. La entrega es hacia la célula de Proveedores (Jaime y Michel), no a Brands, pero Marcas se ve impactada vía Facundo, lo que justifica el monitoreo.",
      proyecto: "COM-001",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Medio"
    }
  ],
  oportunidades: [
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🔴 En desarrollo — retraso confirmado (dependencia con Rearquitectura)",
      statusColor: "#DC2626",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Migrar primero a usuarios existentes en fases escalonadas por madurez (de 5 en 5, empezando por Creciendo) reduce el riesgo frente a abrir de una a todo el público, aunque la Fase 1 corra directamente en producción",
      gmv: "Fecha Beta: no aplica — la Fase 1 sale directo a producción. Fecha de producción de la Fase 1: cambia; nueva fecha sin definir, la entrega Jose Giraldo jueves o viernes de esta semana. Plan original descartado: entrega de desarrollo 15-sep → pruebas de producto 16-sep (2 semanas) → salida 29-sep",
      avance:
        "Retraso confirmado por Tecnología: Leonardo Fuentes es el mismo recurso asignado a Rearquitectura (lanzamiento prioritario) y a Perfil de Marcas, y está enfocado en resolver los puntos reportados de Rearquitectura, por lo que no alcanza a cerrar el 15 de septiembre con margen de pruebas. Perfil de Marcas ya tiene avance significativo en desarrollo, pero Tecnología pide holgura adicional para pruebas. Alineación completa con Comercial, Marketing, Comunicaciones y Growth; estrategia de comunicación entregada. Marketing (Maria Jose Calderon) ya tiene el tango y el video del perfil y la alineación de que Marcas tendrá un home propio que redireccionará a un WordPress/espacio dedicado. En Dropi Academy, Esteban Solano y Francisco Velandia tienen pendiente definir el redireccionamiento de recursos para que apunte a Marcas y no a Dropshipper/Proveedores. Decisión aprobada: estrategia de migración en 3 fases (Fase 1: 20 usuarios segmentados por madurez, de 5 en 5 y escalonados —Creciendo → Consolidando → Preescalando → Escalando—; Fase 2: 50–80% de marcas viables tras el go de Fase 1; Fase 3: liberación al público).",
      next:
        "Jose Giraldo entrega la nueva fecha de desarrollo y salida entre jueves y viernes de esta semana, y confirma que ATOM sale con el Perfil de Marcas. Kate hace push por la fecha jueves y viernes y actualiza el cronograma y las fases una vez llegue. Esteban Solano y Francisco Velandia entregan los insumos de redireccionamiento de Dropi Academy; Francisco Velandia los envía por correo a Tecnología (bloqueado hasta recibirlos). María Ossa / Marketing tienen listos los recursos del home de Marcas para el lanzamiento. Francisco Velandia, Jose Giraldo, Mayra Ramírez, Juan Camilo Reina Soto y Miguel Perdomo crean el grupo de Google Chat (Producto + Tecnología + Comercial) para la atención inmediata de errores en Fase 1.",
      badge: "🔴 Recurso único compartido con Rearquitectura — fecha de Marcas es derivada",
      badgeColor: "#DC2626",
      metricas: {
        base: [
          { label: "Fecha Beta", value: "No aplica", sub: "La Fase 1 sale directo a producción" },
          { label: "Fecha producción Fase 1", value: "Sin definir", sub: "La entrega Jose Giraldo jueves o viernes de esta semana" }
        ],
        meta: [
          { label: "Plan original (descartado)", value: "salida 29-sep", sub: "dev 15-sep → pruebas producto 16-sep (2 semanas)" },
          { label: "Fase 1", value: "20 usuarios", sub: "De 5 en 5, escalonados: Creciendo → Consolidando → Preescalando → Escalando" },
          { label: "Fase 2", value: "50–80% marcas viables", sub: "Tras el go de Fase 1 · logística propia o producto propio" },
          { label: "Fase 3", value: "Liberación al público", sub: "" }
        ],
        seguimiento: [
          { label: "Bloqueante", value: "Recurso compartido", sub: "Leonardo Fuentes — Rearquitectura tiene prioridad de lanzamiento" },
          { label: "Riesgo de operación", value: "Fase 1 en producción real", sub: "Un error impacta marcas activas → grupo de Google Chat + WhatsApp" },
          { label: "ATOM", value: "Sale con el Perfil de Marcas", sub: "Compromiso de Jose Giraldo" },
          { label: "Dropi Academy", value: "Sin fecha", sub: "Insumos de Esteban sin compromiso; bloquea el envío a Tecnología" }
        ]
      }
    },
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus",
      status: "🟢 En pruebas (Producto) — desbloqueado",
      statusColor: "#16A34A",
      color: "#16A34A",
      mueve: "Dejar la herramienta funcional y probada para iniciar el ciclo de pruebas de Producto",
      hipotesis: "Con las credenciales de prueba entregadas por Tecnología, Producto puede ejecutar el ciclo de pruebas sin depender de accesos externos",
      gmv: "No hay fechas de beta ni producción definidas; deben establecerse una vez cierre el ciclo de pruebas",
      avance:
        "Bloqueante resuelto: Jose Giraldo entregó las credenciales de prueba (respuesta por correo + archivo en Drive con permisos de lectura controlados para Laura Sánchez, Francisco Velandia, María y Jaime). El acceso a las credenciales es deliberadamente restringido por confidencialidad, no abierto a todo el equipo. Producto inicia el ciclo de pruebas con esas credenciales.",
      next:
        "Francisco Velandia (con Producto) inicia las pruebas con las credenciales entregadas y reporta avances y hallazgos a Tecnología. Una vez cierre el ciclo de pruebas se definen las fechas de beta y producción.",
      badge: "🟢 Desbloqueado — ciclo de pruebas en marcha",
      badgeColor: "#16A34A",
      metricas: {
        base: [
          { label: "Bloqueante", value: "Resuelto", sub: "Credenciales de prueba entregadas por Jose Giraldo" },
          { label: "Acceso", value: "Permisos controlados", sub: "Laura Sánchez, Francisco Velandia, María, Jaime — por confidencialidad" }
        ],
        meta: [
          { label: "Fecha Beta", value: "Sin definir", sub: "Se establece al cerrar el ciclo de pruebas" },
          { label: "Fecha producción", value: "Sin definir", sub: "Se establece al cerrar el ciclo de pruebas" }
        ],
        seguimiento: [
          { label: "Ciclo de pruebas", value: "En marcha", sub: "Francisco Velandia con Producto" },
          { label: "Reporte", value: "A Tecnología", sub: "Avances y hallazgos" }
        ]
      }
    },
    {
      code: "COM-001",
      name: "Combos (Proveedores — seguimiento desde Marcas)",
      status: "🟡 En desarrollo — fecha en verificación (fuera de la célula Brands)",
      statusColor: "#D97706",
      color: "#D97706",
      mueve: "Sacar Combos a producción el 8 de septiembre; Marcas hace seguimiento por dependencia",
      hipotesis: "El desarrollador está trabajando esta semana y la fecha del 8-sep se sostiene, pero falta validación de primera mano",
      gmv: "Fecha de producción 8 de septiembre — se mantiene, sujeta a confirmación de Jose Giraldo. La entrega es hacia la célula de Proveedores (Jaime y Michel), no a Brands",
      avance:
        "Jose Giraldo confirmó que el desarrollador está trabajando esta semana y que la fecha del 8 de septiembre sigue en pie, pero reconoció que no ha hecho seguimiento directo al desarrollador; queda pendiente verificar. La entrega es hacia la célula de Proveedores, no a Brands, pero Marcas se ve impactada por Combos vía Facundo, lo que justifica el monitoreo desde esta célula.",
      next:
        "Jose Giraldo verifica el estado real del desarrollo y confirma si el 8 de septiembre se sostiene. Kate mantiene el seguimiento de la entrega y su impacto en Marcas.",
      badge: "🟡 Fecha sin validación directa con el desarrollador",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Fecha producción", value: "8-sep-2026", sub: "Se mantiene, sujeta a confirmación de Jose Giraldo" },
          { label: "Entrega a", value: "Célula de Proveedores", sub: "Jaime y Michel — no a Brands" }
        ],
        meta: [
          { label: "Verificación con el desarrollador", value: "Pendiente", sub: "Jose Giraldo no ha hecho seguimiento directo" }
        ],
        seguimiento: [
          { label: "Riesgo", value: "Retraso no detectado", sub: "Fecha sin validación directa al momento del weekly" },
          { label: "Dependencia con Marcas", value: "Vía Facundo", sub: "Justifica el monitoreo desde la célula" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Perfil de Marcas — Recurso único de Tecnología compartido con Rearquitectura",
      tag: "🔴 Bloqueante / dependencia",
      tagColor: "#DC2626",
      salio:
        "Leonardo Fuentes es el mismo recurso en Rearquitectura y en Perfil de Marcas. Rearquitectura tiene prioridad de lanzamiento, así que cualquier nuevo hallazgo ahí impacta directo la fecha de Marcas y no se alcanza el 15-sep con margen de pruebas",
      ruta:
        "Jose Giraldo entrega la nueva fecha de desarrollo y salida entre jueves y viernes; Kate hace push por esa fecha y actualiza el cronograma y las fases cuando llegue",
      rutaColor: "#DC2626",
      metrica: "Fecha de Perfil de Marcas es derivada de Rearquitectura, no propia",
      decision: "La Fase 1 deja de manejarse como beta y sale directo a producción"
    },
    {
      frente: "Perfil de Marcas — Fase 1 corre en producción real",
      tag: "🟡 Riesgo de operación",
      tagColor: "#D97706",
      salio:
        "La Fase 1 no corre en un ambiente controlado. Un error impacta directamente la operación de marcas activas",
      ruta:
        "Crear un grupo de Google Chat (Producto + Tecnología + Comercial) para la atención inmediata de errores, apoyado en una estrategia de WhatsApp — Francisco Velandia, Jose Giraldo, Mayra Ramírez, Juan Camilo Reina Soto, Miguel Perdomo",
      rutaColor: "#D97706",
      metrica: "0 ambiente de pruebas para la Fase 1",
      decision: "Canal de reporte y respuesta en vivo antes de arrancar la migración"
    },
    {
      frente: "Perfil de Marcas — Dropi Academy sin fecha comprometida",
      tag: "⏳ Dependencia externa",
      tagColor: "#D97706",
      salio:
        "El redireccionamiento de recursos de Dropi Academy a Marcas depende de insumos de Esteban Solano que no tienen fecha. Francisco Velandia no puede enviar los recursos a Tecnología hasta recibirlos",
      ruta:
        "Esteban Solano y Francisco Velandia entregan los insumos de redireccionamiento; luego Francisco los envía por correo a Tecnología para que el desarrollador ejecute el redireccionamiento",
      rutaColor: "#D97706",
      metrica: "Redireccionamiento de Academy bloqueado sin fecha de insumos",
      decision: "El envío a Tecnología queda condicionado a recibir los insumos de Esteban"
    },
    {
      frente: "Combos — Fecha del 8-sep sin validación directa con el desarrollador",
      tag: "🟡 Riesgo de cronograma",
      tagColor: "#D97706",
      salio:
        "Jose Giraldo sostiene la fecha del 8 de septiembre pero no ha hecho seguimiento directo al desarrollador; hay riesgo de un retraso no detectado. La entrega es a la célula de Proveedores, aunque impacta a Marcas vía Facundo",
      ruta:
        "Jose Giraldo verifica el estado real del desarrollo y confirma si el 8-sep se sostiene; Kate mantiene el seguimiento del impacto en Marcas",
      rutaColor: "#D97706",
      metrica: "1 fecha crítica (8-sep) sin confirmación de primera mano",
      decision: "Marcas monitorea por dependencia aunque la entrega no sea de esta célula"
    }
  ],
  resumen:
    "Weekly Célula Brands | PL-PM con Jose Giraldo y Kate. <strong>Perfil de Marcas</strong> confirma retraso: Leonardo Fuentes es el mismo recurso de Tecnología asignado a Rearquitectura (lanzamiento prioritario) y a Perfil de Marcas, y está enfocado en resolver los puntos reportados de Rearquitectura, por lo que no alcanza a cerrar el 15 de septiembre con margen de pruebas. El proyecto ya tiene avance significativo en desarrollo, pero Tecnología pide holgura para pruebas. Cambia el enfoque de salida: <strong>la Fase 1 deja de manejarse como beta y sale directo a producción</strong>; el plan original (entrega de desarrollo 15-sep, pruebas de producto 16-sep durante 2 semanas, salida 29-sep) se descarta y la nueva fecha la entrega Jose Giraldo entre jueves y viernes de esta semana. Está alineada y aprobada la <strong>estrategia de migración en 3 fases</strong> (Fase 1: 20 usuarios segmentados por madurez, de 5 en 5 y escalonados por nivel; Fase 2: 50–80% de marcas viables tras el go; Fase 3: liberación al público). Como la Fase 1 corre en producción real, se creará un grupo de Google Chat (Producto + Tecnología + Comercial) para atención de errores en vivo. <strong>ATOM sale con el Perfil de Marcas</strong> (compromiso de Jose Giraldo); Marketing ya tiene el tango y el video y la alineación del home propio de Marcas en WordPress; Dropi Academy queda pendiente de insumos de Esteban, sin fecha. <strong>Emprendedores Plus</strong> se desbloquea: Jose Giraldo entregó las credenciales de prueba (Drive con permisos controlados por confidencialidad) y Producto inicia el ciclo de pruebas; no hay fechas de beta ni producción todavía. En <strong>Combos</strong> (seguimiento desde Marcas), la fecha del 8 de septiembre se mantiene pero Jose Giraldo no ha hecho seguimiento directo al desarrollador —riesgo de retraso no detectado—; la entrega es a la célula de Proveedores y Marcas la monitorea por dependencia vía Facundo.",
  proximosPasos: [
    {
      titulo: "Semana del 26 ago–01 sep 2026",
      color: "#DC2626",
      items: [
        "Jose Giraldo: entregar la nueva fecha de desarrollo y salida de Perfil de Marcas (jueves/viernes de esta semana).",
        "Jose Giraldo: asegurar que ATOM salga con el Perfil de Marcas.",
        "Kate: hacer push por la fecha jueves y viernes.",
        "Kate: actualizar el cronograma y las fases una vez llegue la nueva fecha.",
        "Esteban Solano y Francisco Velandia: entregar los insumos de redireccionamiento de Dropi Academy.",
        "Francisco Velandia: enviar por correo los recursos de Dropi Academy a Tecnología para el redireccionamiento (bloqueado hasta recibir los insumos de Esteban).",
        "María Ossa / Marketing: tener listos los recursos del home de Marcas para el lanzamiento.",
        "Francisco Velandia, Jose Giraldo, Mayra Ramírez, Juan Camilo Reina Soto y Miguel Perdomo: crear el grupo de Google Chat (Producto + Tecnología + Comercial) para la atención de errores en Fase 1.",
        "Francisco Velandia (con Producto): iniciar las pruebas de Emprendedores Plus con las credenciales entregadas y reportar avances/hallazgos a Tecnología.",
        "Jose Giraldo: verificar el estado real del desarrollo de Combos y confirmar si el 8 de septiembre se sostiene.",
        "Kate: mantener el seguimiento de la entrega de Combos y su impacto en Marcas."
      ]
    },
    {
      titulo: "Próximos pasos críticos (por prioridad)",
      color: "#6366F1",
      items: [
        "1. Jose Giraldo → nueva fecha de desarrollo y salida de Perfil de Marcas; de ella dependen el cronograma y las fases.",
        "2. Perfil de Marcas → dejar operativo el canal de reporte en vivo (grupo de Google Chat) antes de arrancar la migración de la Fase 1.",
        "3. Emprendedores Plus → cerrar el ciclo de pruebas de Producto para poder definir fechas de beta y producción.",
        "4. Combos → confirmación de primera mano de la fecha del 8 de septiembre con el desarrollador."
      ]
    }
  ]
};
