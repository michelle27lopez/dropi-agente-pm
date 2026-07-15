import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 14–20 jul 2026",
  subtitle: "Weekly Células Brands | Seller PL-PO-PM · Emprendedores Plus bloqueado · Perfil de Marcas sin atraso",
  heroBadge: "Weekly Brands · Semana 14 jul",
  heroTitle: "Emprendedores Plus bloqueado por acceso de la usuaria piloto\n+ Perfil de Marcas confirma fechas sin atraso, identifica usuarios híbridos",
  heroStrip: [
    { label: "Emprendedores Plus", value: "Bloqueado", sub: "Pendiente acceso de la usuaria piloto" },
    { label: "Beta Perfil Marcas", value: "8-sep", sub: "Se mantiene, sin atraso" },
    { label: "Producción Perfil Marcas", value: "22-sep", sub: "Se mantiene" },
    { label: "Usuarios híbridos identificados", value: "~6-9", sub: "Marca + dropshipper/proveedor" },
    { label: "Transportadora Emp. Plus", value: "Coordinadora", sub: "Credenciales ya confirmadas" }
  ],
  insights: [
    {
      id: "ins-2026-07-15-01",
      titulo: "Riesgo de retraso por acceso de la usuaria piloto",
      descripcion: "Si la usuaria no entrega credenciales a tiempo, las pruebas de Emprendedores Plus se retrasan. Está en evaluación una alternativa con correo de prueba autorizado (sujeto a autorización previa) para mitigar el bloqueo sin depender del viaje de la usuaria.",
      proyecto: "EMP-PLUS",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-15-02",
      titulo: "Usuarios híbridos pueden generar fricción en la migración",
      descripcion: "Se identificaron ~6-9 usuarios híbridos (marca + dropshipper/proveedor) que generan complejidad para la métrica y podrían generar fricción si mantienen ambos comportamientos durante la migración. El área comercial debe estar al tanto.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-15-03",
      titulo: "Confirmado: sin atraso en tiempos de Perfil de Marcas",
      descripcion: "Diana confirmó con José que las 4 fases del proyecto (rearquitectura) ya estaban contempladas dentro de las 10 semanas originales. No hay ningún incremento ni atraso en tiempos a la fecha.",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#15803D",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-15-04",
      titulo: "Comunicación de la migración depende de la definición técnica",
      descripcion: "La estrategia de comunicación hacia usuarios sobre la migración a Perfil de Marcas no puede avanzar hasta que se defina primero el esquema técnico de migración (mismo correo vs. correos distintos).",
      proyecto: "PRM-1331",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-15-05",
      titulo: "Sin fecha para reunión con Product Designer",
      descripcion: "Francisco no estuvo presente en este weekly, por lo que no se cuenta con fecha exacta para la reunión de contexto y estrategia de comunicación de la migración.",
      proyecto: "PRM-1331",
      tipo: "Dato",
      tipoColor: "#94A3B8",
      impacto: "Bajo"
    }
  ],
  oportunidades: [
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus · Cierre y hand-off",
      status: "🔴 Bloqueado · pendiente acceso usuaria",
      statusColor: "#DC2626",
      color: "#DC2626",
      mueve: "Hand-off del programa Emprendedor Plus al equipo de Marcas",
      hipotesis: "Primera usuaria piloto: nicho ropa, nunca ha estado en Dropi, contrato activo con Coordinadora",
      gmv: "Beta y Producción: sin fecha definida mientras continúe el bloqueo de acceso",
      avance: "Tecnología creó el usuario Isabella@dellaterra.co con rol Emprendedor Plus. Queda pendiente que la usuaria ingrese, asigne credenciales y habilite el acceso para iniciar pruebas (intermediaria: Laura Sánchez). Transportadora confirmada: Coordinadora, ya con las credenciales necesarias para la conexión. Las pruebas se están retrasando porque la usuaria se encuentra de viaje y no ha podido entregar el acceso. Como alternativa, Laura Sánchez propuso realizar las pruebas con otro correo de prueba (sujeto a autorización previa) para no bloquear el avance. Se acordó con José Giraldo incluir a QA en las pruebas para validar el flujo en conjunto; queda pendiente que José asigne el QA para probar en paralelo Producto con TI.",
      next: "José Giraldo asigna y convoca a QA para la sesión de pruebas en paralelo con TI. Katerine da seguimiento a la usuaria para obtener el acceso a la plataforma de Dropi. Katerine gestiona autorización previa para habilitar un correo de prueba alterno, en caso de que el acceso de la usuaria siga retrasado.",
      badge: "🔴 Bloqueado · acceso usuaria",
      badgeColor: "#DC2626",
      metricas: {
        base: [
          { label: "Usuario creado", value: "1", sub: "Isabella@dellaterra.co · rol Emprendedor Plus" },
          { label: "Transportadora", value: "Coordinadora", sub: "Credenciales confirmadas" }
        ],
        meta: [
          { label: "Fecha Beta", value: "No definido", sub: "Bloqueado por acceso" },
          { label: "Fecha Producción", value: "No definido", sub: "Bloqueado por acceso" }
        ],
        seguimiento: [
          { label: "Acceso usuaria piloto", value: "Pendiente", sub: "Usuaria de viaje, sin entregar credenciales" },
          { label: "QA asignado", value: "Pendiente", sub: "José Giraldo debe asignarlo" },
          { label: "Correo de prueba alterno", value: "En evaluación", sub: "Sujeto a autorización previa" }
        ]
      }
    },
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🔄 En desarrollo · Beta 8-sep",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Cobertura LATAM con lanzamiento escalonado: Colombia (piloto) → México → Ecuador → Chile",
      gmv: "Beta 8-sep · Producción 22-sep — se mantienen, sin atraso",
      avance: "Diana confirmó con José que las 4 fases del proyecto (rearquitectura) ya estaban contempladas dentro de las 10 semanas originales; no hay cambio en tiempos. Fase 1: Foundation de pantallas principales. Fase 2: flujo interno con actualización de Foundation (no se modifica el flujo, solo Foundation → no afecta tiempos). Fases 3 y 4: variaciones de información (reportes, configuración), mismo diseño, principalmente cambios de data, no de UI. Kate construyó la data de usuarios de marcas bajo dos criterios: (1) usuarios con órdenes propias en todo el ecosistema, (2) usuarios ya mapeados en el portafolio de marcas. Se identificaron ~6-9 usuarios híbridos (marca + dropshipper/proveedor) que generan complejidad para la métrica y podrían generar fricción en la migración — data ya entregada y socializada a nivel de célula. José aún no tiene avance sobre el esquema de migración (mismo correo vs. correos distintos); dedicará espacio esta semana para revisarlo. Se realizará una reunión con todos los involucrados para dar contexto sobre el perfil de marcas y recoger ideas sobre la estrategia de comunicación de la migración, entendiendo que esta depende de la migración técnica.",
      next: "José Giraldo define el esquema de migración (mismo correo o correos distintos) esta semana. Katerine organiza reunión con los involucrados para alinear contexto y estrategia de comunicación de la migración.",
      badge: "🟡 Esquema de migración pendiente",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Fases confirmadas", value: "4/4", sub: "Contempladas en las 10 semanas originales" },
          { label: "Usuarios híbridos identificados", value: "~6-9", sub: "Marca + dropshipper/proveedor" }
        ],
        meta: [
          { label: "Beta", value: "8-sep", sub: "Sin atraso" },
          { label: "Producción", value: "22-sep", sub: "Sin atraso" }
        ],
        seguimiento: [
          { label: "Esquema de migración (correo)", value: "Pendiente", sub: "José lo revisa esta semana" },
          { label: "Reunión de contexto/comunicación", value: "Por agendar", sub: "Katerine organiza con los involucrados" },
          { label: "Reunión con Product Designer", value: "Sin fecha", sub: "Francisco no estuvo en este weekly" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Emprendedores Plus — Acceso de la usuaria piloto",
      tag: "🔴 Bloqueante",
      tagColor: "#DC2626",
      salio: "La usuaria piloto está de viaje y no ha entregado credenciales para habilitar el acceso, retrasando el inicio de pruebas",
      ruta: "Alternativa en evaluación: correo de prueba alterno (sujeto a autorización previa) para no bloquear el avance",
      rutaColor: "#D97706",
      metrica: "Fecha Beta y Producción sin definir mientras continúe el bloqueo",
      decision: "Katerine da seguimiento a la usuaria y gestiona en paralelo la autorización del correo alterno"
    },
    {
      frente: "Perfil de Marcas — Usuarios híbridos",
      tag: "🟡 Riesgo",
      tagColor: "#D97706",
      salio: "Se identificaron ~6-9 usuarios híbridos (marca + dropshipper/proveedor) que generan complejidad para la métrica y podrían generar fricción en la migración",
      ruta: "Área comercial debe estar al tanto; se aborda en la próxima reunión de contexto y estrategia de comunicación",
      rutaColor: "#D97706",
      metrica: "~6-9 usuarios híbridos identificados",
      decision: "Sin decisión cerrada — depende de que se defina primero la migración técnica"
    }
  ],
  resumen: "Esta semana <strong>Emprendedores Plus</strong> quedó bloqueado: tecnología ya creó el usuario piloto (Isabella@dellaterra.co) y la transportadora Coordinadora está confirmada con credenciales, pero la usuaria está de viaje y no ha entregado el acceso para iniciar pruebas — como alternativa se evalúa un correo de prueba autorizado, y se acordó incluir a QA en la sesión en paralelo con TI. En <strong>Perfil de Marcas</strong> no hay atraso: Diana confirmó con José que las 4 fases de la rearquitectura ya estaban contempladas dentro de las 10 semanas originales, manteniendo Beta el 8 de septiembre y Producción el 22 de septiembre. Kate entregó y socializó la data de usuarios de marcas, identificando ~6-9 usuarios híbridos (marca + dropshipper/proveedor) que podrían generar fricción en la migración. José dedicará esta semana a definir el esquema de migración (mismo correo vs. correos distintos), y Katerine organizará una reunión con los involucrados para alinear contexto y estrategia de comunicación.",
  proximosPasos: [
    {
      titulo: "Esta semana (14–20 jul 2026)",
      color: "#6366F1",
      items: [
        "José Giraldo: asignar y convocar a QA para la sesión de pruebas de Emprendedores Plus en paralelo con TI.",
        "Katerine: dar seguimiento a la usuaria piloto de Emprendedores Plus para obtener el acceso a la plataforma.",
        "Katerine: gestionar autorización previa para habilitar un correo de prueba alterno si el acceso sigue retrasado.",
        "José Giraldo: definir el esquema de migración de Perfil de Marcas (mismo correo o correos distintos).",
        "Katerine: organizar reunión con los involucrados para alinear contexto y estrategia de comunicación de la migración."
      ]
    }
  ]
};
