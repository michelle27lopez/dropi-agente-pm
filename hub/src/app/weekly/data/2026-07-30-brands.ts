import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 27 jul–02 ago 2026",
  subtitle: "Weekly Células Brands | Seller PL-PO-PM · Emprendedores Plus pasa a bloqueado por sourcing de usuarios de prueba · Perfil de Marcas confirma alcance de migración y estrategia de beta por fases",
  heroBadge: "Weekly Brands · Semana 30 jul",
  heroTitle: "Emprendedores Plus bloqueado: sin usuarios operacionales para validar el tarifario\n+ Perfil de Marcas confirma alcance: 4.892 marcas viables, 2.288 en portafolio comercial, ~1.900 usuarios híbridos fuera de alcance",
  heroStrip: [
    { label: "Emprendedores Plus", value: "🔴 Bloqueado", sub: "Sin usuarios operacionales para pruebas complejas del tarifario" },
    { label: "Usuario de prueba (Isabela)", value: "Error 500/2FA", sub: "Accedió con credenciales, falla al configurar el perfil" },
    { label: "Marcas viables", value: "4.892", sub: "Solo con órdenes propias" },
    { label: "En portafolio comercial", value: "2.288", sub: "De las 4.892 marcas viables" },
    { label: "Usuarios híbridos", value: "~1.900", sub: "Proveedor + Marca simultáneo, fuera de alcance actual" },
    { label: "Beta / Producción Perfil Marcas", value: "8-sep / 22-sep", sub: "Se mantienen · falta estrategia de migración en producción" }
  ],
  insights: [
    {
      id: "ins-2026-07-30-01",
      titulo: "Producto técnicamente listo, pero usuario de prueba se topa con error 500/2FA",
      descripcion: "Emprendedores Plus está \"10 de 10\" a nivel técnico según el equipo, pero la usuaria de prueba (Isabela) logró acceder con credenciales y presenta error 500/2FA al intentar configurar el perfil — un bloqueante nuevo que contrasta con la omisión de 2FA que José Giraldo había confirmado viable la semana anterior.",
      proyecto: "EMP-PLUS",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-30-02",
      titulo: "Bloqueante crítico: no hay usuarios operacionales dispuestos a pruebas complejas de tarifario",
      descripcion: "Validar el tarifario requiere comparación de tarifas, integraciones y validación de credenciales de transportadora — pruebas extensas que ningún usuario normal está dispuesto a dedicar tiempo a ejecutar. Francisco Velandia no ha logrado coordinar sesiones presenciales con Laura Sánchez para avanzar.",
      proyecto: "EMP-PLUS",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-30-03",
      titulo: "Decisión pendiente: continuar con Laura Sánchez o escalar a QA con credenciales compartidas",
      descripcion: "Kate debe definir antes de fin de semana si el proyecto continúa dependiendo de la disponibilidad de Laura Sánchez o si se escala a una estrategia alternativa de QA con credenciales compartidas.",
      proyecto: "EMP-PLUS",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-30-04",
      titulo: "Alcance de migración confirmado: 4.892 marcas viables, 2.288 en portafolio comercial",
      descripcion: "El alcance de la migración al nuevo Perfil de Marcas queda definido en 4.892 marcas viables (solo con órdenes propias). De éstas, 2.288 están en portafolio comercial.",
      proyecto: "PRM-1331",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-30-05",
      titulo: "~1.900 usuarios híbridos (proveedor + marca) quedan fuera de alcance, candidatos futuros",
      descripcion: "Se identificaron ~1.900 cuentas que operan como proveedor y marca simultáneamente. Quedan fuera del alcance actual de migración pero son candidatos futuros. Además existe un segmento que crea dos perfiles distintos (proveedor + dropshipper) para operar como marca (\"dropshippean\"), cuya viabilidad técnica de migración aún no está mapeada.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-30-06",
      titulo: "Sigue pendiente la estrategia técnica de migración en producción",
      descripcion: "José Giraldo debe definir y explicar antes del próximo weekly cómo se ejecutará la prueba de migración en producción sin riesgo operacional: mecanismo de rollback, aislamiento de datos, timeline por usuario y procedimiento de reversión.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    }
  ],
  oportunidades: [
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus · Piloto y validación",
      status: "🔴 Bloqueado · sourcing de usuarios de prueba",
      statusColor: "#DC2626",
      color: "#DC2626",
      mueve: "Validar el programa Emprendedor Plus con una marca real antes de escalar",
      hipotesis: "Primera usuaria piloto: nicho ropa, nunca ha estado en Dropi, contrato activo con Coordinadora",
      gmv: "Beta y Producción: sin fecha definida — bloqueante crítico es la falta de usuarios operacionales para pruebas complejas del tarifario",
      avance: "El producto quedó técnicamente \"10 de 10\" y listo para producción. Sin embargo, la usuaria de prueba (Isabela) logró acceder con credenciales pero presenta error 500/2FA al intentar configurar el perfil. El bloqueante crítico de la semana es que no hay usuarios operacionales dispuestos a hacer las pruebas complejas del tarifario (comparación de tarifas, integraciones, validación de credenciales de transportadoras) — la complejidad hace inviable pedirle a un usuario normal que dedique el tiempo necesario. Francisco Velandia no ha logrado coordinar sesiones presenciales con Laura Sánchez para avanzar.",
      next: "José Giraldo valida si el error 500/2FA fue resuelto en el usuario de prueba y confirma estado esta semana. Francisco Velandia se coordina hoy con Laura Sánchez (presencial si es posible) para definir el siguiente paso, valida si la usuaria tiene todas las credenciales requeridas de transportadora, y es responsable de la validación técnica. Kate explora alternativas de sourcing de usuarios de prueba y define antes de fin de semana si se continúa con Laura Sánchez o se escala a estrategia alternativa (QA team con credenciales compartidas).",
      badge: "🔴 Bloqueante crítico: sourcing de usuarios de prueba",
      badgeColor: "#DC2626",
      metricas: {
        base: [
          { label: "Estado del producto", value: "10 de 10", sub: "Técnicamente listo para producción" },
          { label: "Usuario de prueba", value: "Error 500/2FA", sub: "Isabela accedió con credenciales, falla al configurar perfil" }
        ],
        meta: [
          { label: "Fecha Beta", value: "No definido", sub: "Bloqueado por sourcing de usuarios de prueba" },
          { label: "Fecha Producción", value: "No definido", sub: "Bloqueado por sourcing de usuarios de prueba" }
        ],
        seguimiento: [
          { label: "Error 500/2FA", value: "Por confirmar", sub: "José Giraldo valida esta semana" },
          { label: "Sesión con Laura Sánchez", value: "Pendiente", sub: "Francisco Velandia coordina hoy, presencial si es posible" },
          { label: "Estrategia sourcing", value: "Por decidir", sub: "Kate define antes de fin de semana: Laura Sánchez vs. QA compartido" }
        ]
      }
    },
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🟡 En planificación de migración y pruebas",
      statusColor: "#D97706",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Migración segmentada por madurez operativa, empezando por un piloto de bajo riesgo y bajo volumen antes de escalar",
      gmv: "Beta 8-sep-2026 y Producción 22-sep-2026 (se mantienen) — pendiente saber cómo ejecutará José la estrategia de migración para definir la comunicación",
      avance: "Se completó la reunión con todos los stakeholders, con cambios menores de copy en login (sin impacto de diseño) y alineación confirmada con Marketing sobre el redireccionamiento al home de marca. El alcance de migración quedó definido en 4.892 marcas viables (solo con órdenes propias), de las cuales 2.288 están en portafolio comercial. Se identificaron ~1.900 usuarios mixtos/híbridos que operan como proveedor y marca simultáneamente (fuera de alcance actual, candidatos futuros), además de un segmento que crea dos perfiles distintos (proveedor + dropshipper) para operar como marca, cuya viabilidad técnica aún no está mapeada. Quedó establecida la estrategia de beta controlada: Fase 1 con 5 usuarios \"creciendo\" (50–300 órdenes, con integraciones activas, en portafolio) y Fase 2 de contingencia con 14 candidatos alternativos si los primeros 5 no participan. Criterios de selección: uso de Chatea, integraciones e-commerce, y solo órdenes propias (sin operación mixta/híbrida).",
      next: "José Giraldo define y explica antes del próximo weekly cómo se ejecutará la prueba de migración en producción sin riesgo operacional: mecanismo de rollback, aislamiento de datos, timeline de prueba por usuario y procedimiento si el usuario requiere revertir; se coordina con los líderes técnicos del equipo. Francisco Velandia avanza en el análisis y definición de features \"ganadoras\" para marcas (diferenciadores vs. rol proveedor), clave para persuadir a usuarios mixtos a migrar en el futuro. Kate comienza la gestión de los 5 usuarios piloto de \"creciendo\" para obtener consentimiento de participación, sin alertar al ecosistema completo aún — queda a la espera de la estrategia de migración de José.",
      badge: "🟡 Estrategia técnica de migración en producción pendiente",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Marcas viables", value: "4.892", sub: "Solo con órdenes propias" },
          { label: "En portafolio comercial", value: "2.288", sub: "De las 4.892 marcas viables" }
        ],
        meta: [
          { label: "Fecha Beta", value: "8-sep-2026", sub: "Se mantiene" },
          { label: "Fecha Producción", value: "22-sep-2026", sub: "Se mantiene" }
        ],
        seguimiento: [
          { label: "Usuarios híbridos/mixtos", value: "~1.900", sub: "Proveedor + Marca, fuera de alcance actual" },
          { label: "Beta Fase 1 / Fase 2", value: "5 / 14", sub: "Usuarios \"creciendo\" (50–300 órdenes) · contingencia" },
          { label: "Estrategia técnica de migración", value: "Pendiente", sub: "José Giraldo: rollback, aislamiento de datos, timeline, reversión" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Emprendedores Plus — Error 500/2FA al configurar el perfil",
      tag: "🔴 Bloqueante",
      tagColor: "#DC2626",
      salio: "La usuaria de prueba (Isabela) logró acceder con credenciales, pero presenta error 500/2FA al intentar configurar el perfil",
      ruta: "José Giraldo valida si fue resuelto y confirma estado esta semana",
      rutaColor: "#DC2626",
      metrica: "Fecha Beta y Producción sin definir mientras continúe el bloqueo",
      decision: "Sin decisión cerrada — pendiente confirmación técnica"
    },
    {
      frente: "Emprendedores Plus — Sourcing de usuarios de prueba",
      tag: "🔴 Bloqueante crítico",
      tagColor: "#DC2626",
      salio: "No hay usuarios operacionales dispuestos a dedicar el tiempo necesario para pruebas complejas del tarifario (tarifas, integraciones, credenciales de transportadora)",
      ruta: "Kate explora alternativas de sourcing; define antes de fin de semana si se continúa con Laura Sánchez o se escala a QA con credenciales compartidas",
      rutaColor: "#D97706",
      metrica: "Dependencia de un único usuario de prueba para validar un feature complejo",
      decision: "Sin decisión cerrada — en evaluación"
    },
    {
      frente: "Perfil de Marcas — Riesgo operacional de la migración en producción",
      tag: "🟡 Bloqueante",
      tagColor: "#D97706",
      salio: "La migración se ejecutará en producción (datos reales), pero no existe aún mecanismo probado de rollback ni de aislamiento de datos si un usuario requiere revertir",
      ruta: "José Giraldo define la estrategia técnica antes del próximo weekly, coordinado con líderes técnicos",
      rutaColor: "#D97706",
      metrica: "0 usuarios piloto contactados mientras no exista estrategia de rollback definida",
      decision: "Sin decisión cerrada — pendiente de la estrategia técnica de José Giraldo"
    }
  ],
  resumen: "Esta semana <strong>Emprendedores Plus</strong> pasó a estado bloqueado: el producto está técnicamente \"10 de 10\" y listo para producción, pero la usuaria de prueba (Isabela) logró acceder con credenciales y presenta un nuevo error 500/2FA al configurar el perfil. El bloqueante crítico, sin embargo, es de sourcing: no hay usuarios operacionales dispuestos a dedicar el tiempo que exigen las pruebas complejas del tarifario (comparación de tarifas, integraciones, validación de credenciales de transportadora), y Francisco Velandia no ha logrado coordinar sesiones presenciales con Laura Sánchez. Kate debe decidir antes de fin de semana si se continúa dependiendo de Laura Sánchez o se escala a un equipo QA con credenciales compartidas. En <strong>Perfil de Marcas</strong> se confirmó el alcance de la migración: 4.892 marcas viables (solo con órdenes propias), de las cuales 2.288 están en portafolio comercial; se identificaron además ~1.900 usuarios híbridos proveedor+marca que quedan fuera de alcance por ahora, y un segmento que \"dropshippea\" creando dos perfiles cuya viabilidad de migración aún no está mapeada. Quedó definida la estrategia de beta por fases (5 usuarios \"creciendo\" + 14 de contingencia), pero la fecha de producción (22-sep, se mantiene) sigue dependiendo de que José Giraldo explique antes del próximo weekly el mecanismo de rollback, aislamiento de datos y reversión para migrar en producción sin riesgo operacional.",
  proximosPasos: [
    {
      titulo: "Esta semana (27 jul–02 ago 2026)",
      color: "#DC2626",
      items: [
        "José Giraldo: validar si el error 500/2FA fue resuelto en el usuario de prueba de Emprendedores Plus; confirmar estado esta semana.",
        "Francisco Velandia: coordinarse hoy con Laura Sánchez (presencial si es posible) para definir el siguiente paso de Emprendedores Plus; validar credenciales de transportadora de la usuaria; responsable de la validación técnica.",
        "Kate: explorar alternativas de sourcing de usuarios de prueba para Emprendedores Plus; definir antes de fin de semana si se continúa con Laura Sánchez o se escala a QA con credenciales compartidas.",
        "José Giraldo: definir y explicar antes del próximo weekly la estrategia de migración de Perfil de Marcas en producción (rollback, aislamiento de datos, timeline, reversión); coordinarse con líderes técnicos.",
        "Francisco Velandia: análisis y definición de features \"ganadoras\" para marcas, diferenciadores frente al rol proveedor.",
        "Kate: iniciar gestión de los 5 usuarios piloto \"creciendo\" de Perfil de Marcas para obtener consentimiento, sin alertar al ecosistema completo — a la espera de la estrategia de migración de José."
      ]
    },
    {
      titulo: "Próximos pasos críticos (por prioridad)",
      color: "#6366F1",
      items: [
        "1. José Giraldo → explicar estrategia de migración en producción de Perfil de Marcas: rollback, protección de datos, timeline, reversión.",
        "2. Francisco Velandia → resolver bloqueante de Emprendedores Plus coordinando con Laura Sánchez; definir features ganadoras para marcas.",
        "3. Kate Pencue → explorar alternativas de sourcing para Emprendedores Plus; iniciar outreach a los 5 usuarios piloto de Perfil de Marcas cuando José defina la estrategia."
      ]
    }
  ]
};
