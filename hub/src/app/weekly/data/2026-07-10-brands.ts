import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 07–13 jul 2026",
  subtitle: "Avances de Delivery · Perfil de Marcas y Emprendedores Plus",
  heroBadge: "Avances Delivery · Semana 07 jul",
  heroTitle: "Perfil de Marcas entra a la fase crítica de migración\n+ Emprendedores Plus arranca pruebas piloto",
  heroStrip: [
    { label: "Beta Perfil Marcas", value: "8-sep", sub: "Desarrollo en curso desde 30-jun" },
    { label: "Producción estimada", value: "22-sep", sub: "Cobertura LATAM escalonada" },
    { label: "Cobertura", value: "LATAM", sub: "Se inicia en CO, posterior MX, EC, Chile" },
    { label: "Pruebas Emp. Plus", value: "15-jul", sub: "Primera usuaria piloto confirmada" },
    { label: "Semanas a Beta", value: "~10", sub: "Migración de usuarios aún sin definir técnicamente" }
  ],
  insights: [
    {
      id: "ins-2026-07-10-01",
      titulo: "Feature de Emprendedores Plus no requiere lanzamiento formal",
      descripcion: "Laura Catherine Torres Ciendua confirmó que este feature no requiere Lanzamiento formal — no hay fecha estimada de salida a producción porque depende directamente de los resultados de las pruebas piloto.",
      proyecto: "EMP-PLUS",
      tipo: "Decisión",
      tipoColor: "#15803D",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-10-02",
      titulo: "Error 500 en autenticación de doble factor ya resuelto",
      descripcion: "Tecnología ya solucionó el error 500 en la autenticación de doble factor que afectaba a Emprendedores Plus. Queda pendiente validarlo en la sesión de pruebas con QA.",
      proyecto: "EMP-PLUS",
      tipo: "Hallazgo",
      tipoColor: "#0EA5E9",
      impacto: "Medio"
    },
    {
      id: "ins-2026-07-10-03",
      titulo: "Rearquitectura V1 no impacta el cronograma de Perfil de Marcas",
      descripcion: "El alcance de la Rearquitectura Dropi V1 (login + foundation de pantallas principales) ya estaba contemplado desde el handoff de Marcas. El foundation de flujos internos queda para una V2 posterior al lanzamiento, pendiente de estimación con tecnología.",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#15803D",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-10-04",
      titulo: "Usuarios híbridos no se migran forzosamente",
      descripcion: "Regla definida en la Épica: los usuarios mixtos/híbridos (marca + proveedor) permanecen como proveedor y no se migran forzosamente al nuevo perfil de marcas — la única de las 5 reglas de migración marcada como excepción, y origen del riesgo de fricción identificado en semanas posteriores.",
      proyecto: "PRM-1331",
      tipo: "Hallazgo",
      tipoColor: "#0EA5E9",
      impacto: "Alto"
    },
    {
      id: "ins-2026-07-10-05",
      titulo: "Migración de usuarios sigue sin definición técnica",
      descripcion: "Aunque las 5 reglas de negocio de la migración ya están definidas en la Épica, la ejecución técnica (cómo se migra realmente cada usuario) sigue sin definirse. José Giraldo evalúa el impacto en tiempos; urge resolverlo porque quedan ~10 semanas hasta la fecha de Beta.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    }
  ],
  oportunidades: [
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🔄 En desarrollo · Beta 8-sep",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Cobertura LATAM con lanzamiento escalonado: Colombia (piloto) → México → Ecuador → Chile",
      gmv: "Producción estimada: 22-sep",
      avance: "Desarrollo en curso desde el 30 de junio. La Rearquitectura Dropi V1 no impacta el proyecto: su alcance (login + foundation de pantallas principales) ya estaba contemplado desde el handoff de Marcas. Queda pendiente el foundation de flujos internos (V2, posterior al lanzamiento) — pendiente estimación para evaluar posibles impactos con tecnología. Diana Aldana documenta notas de alineación y coordina con tecnología la estimación de esa V2. El punto crítico sin resolver es la migración de usuarios: las reglas ya están definidas en la Épica (proveedores existentes conservan su perfil; proveedores nuevos ingresan solo como proveedor; marcas/emprendedores existentes migran al nuevo perfil; usuarios híbridos permanecen como proveedor, sin migración forzosa; marcas/emprendedores nuevos ingresan únicamente en el perfil de marcas), pero falta la definición técnica de cómo se ejecuta.",
      next: "José Giraldo evalúa cómo se realiza técnicamente la migración e informa impacto en tiempos — entre más temprano, mejor para activar el push comercial. Katerine consigue y pasa a José el dato de usuarios marcas/emprendedores existentes por país. Francisco pasa a Diana Aldana el link del Figma con el nuevo look and feel. Francisco + Katerine organizan reunión urgente con stakeholders (GrowOps, comercial, tecnología) para presentar el proyecto y definir estrategia de migración — quedan ~10 semanas. Juan Sebastián propone una encuesta previa a usuarios para identificar quiénes quieren migrar voluntariamente, tema a llevar a esa reunión.",
      badge: "🔄 Migración sin definir",
      badgeColor: "#6366F1",
      metricas: {
        base: [
          { label: "Inicio desarrollo", value: "30-jun", sub: "En curso" },
          { label: "Reglas de migración", value: "5/5", sub: "Definidas en la Épica" }
        ],
        meta: [
          { label: "Beta", value: "8-sep", sub: "Fecha objetivo" },
          { label: "Producción", value: "22-sep", sub: "Estimada" },
          { label: "Cobertura", value: "4 países", sub: "CO piloto → MX, EC, CL" }
        ],
        seguimiento: [
          { label: "Definición técnica migración", value: "Pendiente", sub: "José Giraldo evaluando impacto en tiempos" },
          { label: "Reunión stakeholders", value: "Por agendar", sub: "GrowOps, comercial, tecnología — urgente" }
        ]
      }
    },
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus · Cierre y hand-off",
      status: "🟡 Pruebas agendadas · 15-jul",
      statusColor: "#D97706",
      color: "#D97706",
      mueve: "Hand-off del programa Emprendedor Plus al equipo de Marcas",
      hipotesis: "Primera usuaria piloto: nicho ropa, nunca ha estado en Dropi, contrato activo con Coordinadora",
      gmv: "Pruebas piloto: miércoles 15 de julio",
      avance: "Laura Sánchez confirmó una usuaria de su red para el piloto. Flujo de activación acordado: Katerine pasa el correo a José → José crea el usuario desde el backoffice (el rol no se crea desde el registro normal) → pruebas coordinadas con Alejandro Rodríguez (QA). El error 500 en autenticación de doble factor ya fue solucionado por tecnología — pendiente validación en QA durante la sesión de pruebas.",
      next: "Katerine consigue el correo de la usuaria y lo pasa a José hoy o mañana. José crea el usuario desde el backoffice al recibir el correo. Katerine coordina la sesión de pruebas con la usuaria, José y Alejandro (QA) — miércoles 15 de julio. Francisco valida el error 500 en esa misma sesión, junto con los demás puntos del QA.",
      badge: "🟡 QA pendiente",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Usuaria piloto", value: "1", sub: "Confirmada por Laura Sánchez · nicho ropa" }
        ],
        meta: [
          { label: "Sesión de pruebas", value: "15-jul", sub: "Miércoles, con José y Alejandro (QA)" }
        ],
        seguimiento: [
          { label: "Error 500 (2FA)", value: "Resuelto", sub: "Pendiente validar en QA" },
          { label: "Usuario creado en backoffice", value: "Pendiente", sub: "Al recibir el correo de la usuaria" }
        ]
      }
    },
    {
      code: "TTFO-001",
      name: "Onboarding guiado (TTFO)",
      status: "🟠 Pendiente liberación", // TODO Kate: confirmar qué está pendiente de liberar exactamente (¿rollout a más %? ¿pieza técnica?)
      statusColor: "#EA580C",
      color: "#EA580C",
      mueve: "Bajar la activación bruta (TTFO) de 11 días a la meta de 7 días",
      hipotesis: "El tour guiado post-encuesta acelera el tiempo desde que el usuario ingresa hasta que crea su primera orden",
      gmv: "Lanzado como experimento activo el 9 de julio",
      avance: "Flujo: el usuario se registra → completa la encuesta de clasificación como marca (volumen de órdenes, nicho, canales de venta) → se activa el tour guiado hacia su primera orden. TODO Kate: completar qué queda pendiente de liberación esta semana. Bloqueante conocido: no existe conexión automática entre el evento de primera orden creada (backend) y el usuario de UserPilot — el mismo blocker de user_id que afecta al pipeline CRM (GHL). Mientras no se resuelva, el seguimiento del experimento se arma manual vía CSV, cruzando por email o teléfono.",
      next: "TODO Kate: completar próximos pasos según lo que esté pendiente de liberación. Cadencia acordada: exports semanales (encuesta, CRM, y fechas de primera orden creada/entregada de Miguel) para calcular TTFO real por usuario y compararlo contra la meta de 7 días.",
      badge: "🟠 Liberación pendiente",
      badgeColor: "#EA580C",
      metricas: {
        base: [
          { label: "TTFO actual (mediana)", value: "11d", sub: "Baseline 2026 antes del experimento" }
        ],
        meta: [
          { label: "TTFO objetivo", value: "7d", sub: "Meta de activación bruta" }
        ],
        seguimiento: [
          { label: "Conexión evento 1ra orden ↔ UserPilot", value: "No automatizada", sub: "Mismo blocker que bloquea a José en el pipeline GHL" },
          { label: "Tracking del experimento", value: "Manual vía CSV", sub: "Cruce por email/teléfono, cadencia semanal" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Perfil de Marcas — Migración de usuarios",
      tag: "🔴 Bloqueante",
      tagColor: "#DC2626",
      salio: "La migración técnica de usuarios existentes sigue sin definición, aunque las reglas de negocio ya están cerradas en la Épica",
      ruta: "Reunión urgente con stakeholders (GrowOps, comercial, tecnología)",
      rutaColor: "#DC2626",
      metrica: "~10 semanas restantes hasta Beta (8-sep)",
      decision: "Definir la estrategia de migración esta semana — entre más temprano se resuelva, más margen para activar el push comercial antes del lanzamiento"
    }
  ],
  resumen: "Esta semana <strong>Perfil de Marcas</strong> avanza en desarrollo (arrancó 30-jun, Beta 8-sep, Producción 22-sep) con cobertura LATAM escalonada empezando por Colombia. Se confirmó que la Rearquitectura Dropi V1 no impacta el proyecto — su alcance ya estaba contemplado desde el handoff. El punto crítico pendiente es la migración de usuarios: las 5 reglas de negocio están definidas, pero falta la definición técnica de ejecución, que José Giraldo está evaluando. Se necesita con urgencia una reunión con stakeholders (GrowOps, comercial, tecnología) dado que quedan ~10 semanas. En paralelo, <strong>Emprendedores Plus</strong> consigue su primera usuaria piloto (nicho ropa, vía red de Laura Sánchez) y agenda pruebas para el 15 de julio, con el flujo de activación ya acordado y el error 500 de doble factor ya resuelto por tecnología, pendiente de validar en esa sesión de QA.",
  proximosPasos: [
    {
      titulo: "Esta semana (07–13 jul 2026)",
      color: "#6366F1",
      items: [
        "José Giraldo: evaluar la migración técnica de usuarios y comunicar impacto en tiempos (Perfil de Marcas).",
        "Katerine: conseguir y pasar a José el dato de usuarios marcas/emprendedores existentes por país.",
        "Francisco: pasar a Diana Aldana el link del Figma con el nuevo look and feel.",
        "Francisco + Katerine: organizar reunión urgente con stakeholders (GrowOps, comercial, tecnología) para definir estrategia de migración.",
        "Katerine: conseguir el correo de la usuaria piloto de Emprendedores Plus y pasarlo a José hoy o mañana.",
        "José: crear el usuario de Emprendedores Plus desde el backoffice al recibir el correo."
      ]
    },
    {
      titulo: "Miércoles 15 de julio",
      color: "#D97706",
      items: [
        "Sesión de pruebas de Emprendedores Plus: Katerine, José y Alejandro Rodríguez (QA).",
        "Francisco valida el error 500 de doble factor junto con los demás puntos del QA."
      ]
    },
    {
      titulo: "Próximas semanas",
      color: "#DC2626",
      items: [
        "Juan Sebastián: llevar a la reunión de stakeholders la propuesta de encuesta previa para identificar migración voluntaria de usuarios.",
        "Definir estimación de la V2 (foundation de flujos internos) con tecnología, tras la Rearquitectura V1."
      ]
    }
  ]
};
