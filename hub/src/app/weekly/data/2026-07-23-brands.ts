import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 21–27 jul 2026",
  subtitle: "Weekly Células Brands | Seller PL-PO-PM · Emprendedores Plus en espera por disponibilidad de marca y pricing · Perfil de Marcas confirma segmentación y candidatos de migración",
  heroBadge: "Weekly Brands · Semana 23 jul",
  heroTitle: "Emprendedores Plus en espera por disponibilidad de marca y pricing\n+ Perfil de Marcas confirma segmentación: 4.892 usuarios \"Totalmente Marca\" y 221 candidatos al piloto",
  heroStrip: [
    { label: "Emprendedores Plus", value: "En espera", sub: "Disponibilidad de marca + pricing pendiente" },
    { label: "2FA Emprendedores Plus", value: "Resuelto", sub: "Omisión viable confirmada por José Giraldo" },
    { label: "Usuarios \"Totalmente Marca\"", value: "4.892 (40%)", sub: "De 12.280 usuarios totales segmentados" },
    { label: "Candidatos al piloto", value: "221", sub: "Creciendo + portafolio comercial (51–300 órdenes/mes)" },
    { label: "Usuarios para iniciar", value: "5", sub: "Prioridad 1 · bajo riesgo, bajo volumen" },
    { label: "Beta Perfil Marcas", value: "22-sep", sub: "Se mantiene · Producción aún no definida" }
  ],
  insights: [
    {
      id: "ins-2026-07-23-01",
      titulo: "QA con un solo usuario piloto es insuficiente para Emprendedores Plus",
      descripcion: "La validación de tarificación y las múltiples reglas de negocio de Coordinadora requieren ejecución extensa y repetitiva. Un usuario interesado no dedicará el tiempo necesario para cubrir todos los escenarios. Se evalúa escalar a un equipo QA con credenciales compartidas para acelerar la cobertura.",
      proyecto: "EMP-PLUS",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-23-02",
      titulo: "Decisión técnica validada: omitir 2FA para pruebas de ficción",
      descripcion: "José Giraldo confirmó que es posible omitir 2FA para generar ficción en ambiente de pruebas de Emprendedores Plus, descartando el bloqueante técnico previo. El bloqueante actual pasa a ser la disponibilidad de la marca piloto.",
      proyecto: "EMP-PLUS",
      tipo: "Decisión",
      tipoColor: "#15803D",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-23-03",
      titulo: "Segmentación confirmada: 4.892 usuarios (40%) son \"Totalmente Marca\"",
      descripcion: "De 12.280 usuarios totales analizados, 4.892 (40%) clasifican como \"Totalmente Marca\" y son quienes migrarían al nuevo Perfil de Marcas.",
      proyecto: "PRM-1331",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-23-04",
      titulo: "Piloto de migración definido: 221 candidatos, 19 priorizados",
      descripcion: "Cruce de usuarios en madurez Creciendo (51–300 órdenes/mes) + portafolio comercial: 221 usuarios totales, de los cuales se seleccionaron 5 de Prioridad 1 y 14 de Prioridad 2 por ser bajo riesgo y bajo volumen.",
      proyecto: "PRM-1331",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-23-05",
      titulo: "Preguntas técnicas sobre usuarios híbridos/mixtos siguen abiertas",
      descripcion: "Viabilidad de migrar usuarios mixtos (>1 orden propia) y usuarios bi-rol futuro (Marca + Dropshipper) — quedan ocultas para la fase 1 de migración hasta que José Giraldo las resuelva con Kate en sesión técnica.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-23-06",
      titulo: "Beta controlada descartada: migración directa a producción",
      descripcion: "Al ser un perfil y rol completamente nuevo con módulos inéditos, no aplica validación previa en ambiente aislado. La migración será unitaria, segmentada por madurez operativa, con pausa ante errores críticos (detalle en DROP-26383).",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#15803D",
      impacto: "Medio"
    }
  ],
  oportunidades: [
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus · Piloto y validación",
      status: "🟡 En espera · disponibilidad de marca + pricing",
      statusColor: "#D97706",
      color: "#D97706",
      mueve: "Validar el programa Emprendedor Plus con una marca real antes de escalar",
      hipotesis: "Primera usuaria piloto: nicho ropa, nunca ha estado en Dropi, contrato activo con Coordinadora",
      gmv: "Beta y Producción: sin fecha definida mientras continúen los bloqueantes de disponibilidad y pricing",
      avance: "José Giraldo confirmó que es posible omitir el 2FA para generar ficción en ambiente de pruebas, descartando el bloqueante técnico previo. El bloqueante actual pasó a ser la disponibilidad de la marca piloto para ejecutar las pruebas funcionales. Queda pendiente que el área comercial defina el pricing del feature para que la usuaria conozca el costo y confirme si continúa — la usuaria mantiene interés en participar en la validación. Se identificó además que el QA con un solo usuario piloto es complejo: la validación de tarificación y las múltiples reglas de negocio de Coordinadora requieren ejecución extensa y repetitiva que un usuario interesado no dedicará el tiempo suficiente para cubrir; se está evaluando escalar a un equipo QA con credenciales compartidas para acelerar la cobertura.",
      next: "José Giraldo activa el acceso de prueba (2FA omitido) una vez se confirme la disponibilidad de la marca. Mayra Ramírez define y comunica el pricing del feature a la usuaria para validar continuidad. Kate coordina con Laura Sánchez la disponibilidad de la marca Coordinadora para QA.",
      badge: "🟡 Disponibilidad de marca pendiente",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "2FA", value: "Resuelto", sub: "Omisión viable confirmada por José Giraldo" },
          { label: "Interés usuaria", value: "Activo", sub: "Mantiene interés en participar" }
        ],
        meta: [
          { label: "Fecha Beta", value: "No definido", sub: "Bloqueado por disponibilidad + pricing" },
          { label: "Fecha Producción", value: "No definido", sub: "Bloqueado por disponibilidad + pricing" }
        ],
        seguimiento: [
          { label: "Disponibilidad marca piloto", value: "Pendiente", sub: "Bloqueante actual" },
          { label: "Pricing del feature", value: "Pendiente", sub: "Mayra Ramírez define y comunica" },
          { label: "Escalar a equipo QA", value: "En evaluación", sub: "Por complejidad de cobertura con un solo usuario" }
        ]
      }
    },
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🔄 En desarrollo · Pendiente estrategia técnica de migración",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Migración segmentada por madurez operativa, empezando por un piloto de bajo riesgo y bajo volumen antes de escalar",
      gmv: "Beta 22-sep-2026 (se mantiene) · fecha de Producción aún no definida",
      avance: "Se confirmaron los datos de segmentación: de 12.280 usuarios totales, 4.892 (40%) clasifican como \"Totalmente Marca\" y migrarían al nuevo Perfil. Se identificaron los candidatos al piloto de migración: 221 usuarios en el cruce de madurez Creciendo (51–300 órdenes/mes) + portafolio comercial, de los cuales se seleccionaron 5 de Prioridad 1 y 14 de Prioridad 2 por ser bajo riesgo y bajo volumen. La estrategia de migración quedará segmentada por madurez operativa, con migración unitaria y pausa ante errores críticos (detalle en DROP-26383). Se descartó una beta controlada: al ser un perfil y rol completamente nuevo con módulos inéditos, no aplica validación previa en ambiente aislado — la migración será directa a producción. Quedan preguntas técnicas abiertas para José Giraldo, ocultas para la fase 1 de migración: (1) usuarios mixtos con más de una orden propia — viabilidad y complejidad técnica de duplicidad de roles, emails y permisos; (2) usuarios bi-rol futuro (Marca + Dropshipper) — si pueden migrar al Perfil Marca o requieren cuenta/email separado, y si es viable soportar ambos roles simultáneamente en una sola cuenta.",
      next: "José Giraldo define la estrategia técnica de migración (mismo email o email separado). Mayra Ramírez contacta a los 5 usuarios de Prioridad 1 para confirmar participación en el piloto. José Giraldo y Kate agendan sesión técnica para resolver las preguntas abiertas de usuarios híbridos/mixtos.",
      badge: "🟡 Estrategia técnica de migración pendiente",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Usuarios totales segmentados", value: "12.280", sub: "Base del análisis de segmentación" },
          { label: "\"Totalmente Marca\"", value: "4.892 (40%)", sub: "Migran al nuevo Perfil" }
        ],
        meta: [
          { label: "Candidatos piloto", value: "221", sub: "Creciendo + portafolio comercial" },
          { label: "Prioridad 1 / Prioridad 2", value: "5 / 14", sub: "Bajo riesgo, bajo volumen (51–300 órdenes/mes)" }
        ],
        seguimiento: [
          { label: "Estrategia técnica de migración", value: "Pendiente", sub: "José Giraldo: mismo email vs. email separado" },
          { label: "Contacto Prioridad 1", value: "Pendiente", sub: "Mayra Ramírez" },
          { label: "Sesión técnica híbridos/mixtos", value: "Por agendar", sub: "José Giraldo + Kate" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Emprendedores Plus — Disponibilidad de marca piloto",
      tag: "🟡 Bloqueante",
      tagColor: "#D97706",
      salio: "La marca piloto aún no está disponible para ejecutar las pruebas funcionales; el bloqueo técnico de 2FA ya se resolvió",
      ruta: "Kate coordina con Laura Sánchez la disponibilidad de la marca Coordinadora",
      rutaColor: "#D97706",
      metrica: "Fecha Beta y Producción sin definir mientras continúe el bloqueo",
      decision: "Sin decisión cerrada — depende de disponibilidad de marca y definición de pricing"
    },
    {
      frente: "Emprendedores Plus — QA con usuario único",
      tag: "🟡 Riesgo",
      tagColor: "#D97706",
      salio: "La validación de tarificación y las reglas de negocio de Coordinadora requieren ejecución extensa que un solo usuario piloto no cubrirá",
      ruta: "Se evalúa escalar a equipo QA con credenciales compartidas",
      rutaColor: "#6366F1",
      metrica: "Cobertura de escenarios de prueba insuficiente con 1 usuario",
      decision: "Sin decisión cerrada — en evaluación"
    },
    {
      frente: "Perfil de Marcas — Usuarios híbridos/mixtos",
      tag: "🔴 Bloqueante fase 1",
      tagColor: "#DC2626",
      salio: "Persisten preguntas técnicas sin resolver sobre usuarios mixtos (>1 orden propia) y bi-rol futuro (Marca + Dropshipper)",
      ruta: "José Giraldo y Kate agendan sesión técnica dedicada",
      rutaColor: "#D97706",
      metrica: "2 preguntas técnicas abiertas, ambas ocultas para la fase 1 de migración",
      decision: "Sin decisión cerrada — pendiente de sesión técnica"
    }
  ],
  resumen: "Esta semana <strong>Emprendedores Plus</strong> quedó en espera: José Giraldo confirmó que la omisión de 2FA es viable para generar ficción en ambiente de pruebas, descartando el bloqueante técnico previo, pero el avance ahora depende de la disponibilidad de la marca piloto y de que el área comercial defina el pricing del feature para que la usuaria confirme si continúa. Se identificó además que validar con un solo usuario piloto es insuficiente por la complejidad de las reglas de tarificación de Coordinadora, por lo que se evalúa escalar a un equipo QA con credenciales compartidas. En <strong>Perfil de Marcas</strong> se confirmaron los datos de segmentación: de 12.280 usuarios totales, 4.892 (40%) clasifican como \"Totalmente Marca\" y migrarían al nuevo Perfil; se definieron 221 candidatos al piloto (madurez Creciendo + portafolio comercial), con 5 de Prioridad 1 y 14 de Prioridad 2. Se descartó una beta controlada — la migración será directa a producción, unitaria y segmentada por madurez, con pausa ante errores críticos. Quedan abiertas dos preguntas técnicas clave sobre usuarios híbridos/mixtos, que José Giraldo resolverá con Kate en una sesión técnica dedicada antes de escalar la migración más allá de la fase 1.",
  proximosPasos: [
    {
      titulo: "Esta semana (21–27 jul 2026)",
      color: "#6366F1",
      items: [
        "Kate: confirmar disponibilidad de la marca Coordinadora para QA de Emprendedores Plus.",
        "Mayra Ramírez: definir y comunicar el pricing del feature a la usuaria piloto de Emprendedores Plus.",
        "José Giraldo: activar el acceso de prueba (2FA omitido) una vez confirmada la disponibilidad de la marca.",
        "José Giraldo: definir la estrategia técnica de migración de Perfil de Marcas (mismo email o email separado).",
        "Mayra Ramírez: contactar a los 5 usuarios de Prioridad 1 para confirmar participación en el piloto.",
        "José Giraldo + Kate: sesión técnica para resolver las preguntas abiertas de usuarios híbridos/mixtos."
      ]
    }
  ]
};
