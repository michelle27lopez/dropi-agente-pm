import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 04–11 ago 2026",
  subtitle: "Weekly Células Brands | Seller PL-PO-PM · Emprendedores Plus deprioritizado a la espera de Laura Sánchez (usuario de prueba) · Perfil de Marcas confirma piloto y corre su beta 8 días · Se abre frente nuevo: fricción de tracking en UserPilot",
  heroBadge: "Weekly Brands · Semana 11 ago",
  heroTitle: "Emprendedores Plus resuelve el error 2FA pero sigue bloqueado por falta de un usuario de prueba real\n+ Perfil de Marcas corre su beta 8 días (8→16 sep) y arranca la selección del piloto de 5 usuarios\n+ Nuevo hallazgo: UserPilot reporta falsos positivos por eventos sin validar en backend",
  heroStrip: [
    { label: "Emprendedores Plus", value: "🟡 Bloqueado", sub: "Error 500/2FA resuelto; bloqueante ahora es sourcing de usuario de prueba" },
    { label: "Laura Sánchez", value: "10–14 ago", sub: "Regresa a Colombia; se retoma conversación de pruebas" },
    { label: "Perfil de Marcas · Beta", value: "16-sep", sub: "Se corrió 8 días desde 8-sep por contingencia energía/internet" },
    { label: "Perfil de Marcas · Producción", value: "29-sep", sub: "Estimado, sujeto a progreso de la beta" },
    { label: "Piloto Fase 1", value: "5 usuarios", sub: "Segmento Creciendo (50–300 órdenes/mes), selección en curso" },
    { label: "Tracking UserPilot", value: "Falsos positivos", sub: "Evento se registra antes de la validación back-end" }
  ],
  insights: [
    {
      id: "ins-2026-08-11-01",
      titulo: "El error 500/2FA que bloqueaba a Emprendedores Plus quedó resuelto",
      descripcion: "José Giraldo resolvió la semana anterior el error 500 y la validación de 2FA que impedían a la usuaria de prueba configurar su perfil. El producto queda técnicamente listo para producción, pero sigue sin validarse con un usuario real operando.",
      proyecto: "EMP-PLUS",
      tipo: "Hallazgo",
      tipoColor: "#94A3B8",
      impacto: "Medio"
    },
    {
      id: "ins-2026-08-11-02",
      titulo: "El bloqueante real ya no es técnico: es conseguir un usuario de prueba operacional",
      descripcion: "Laura Sánchez, el único contacto identificado con credenciales reales de transportadora, está fuera del país hasta el 10–14 de agosto. El proyecto quedó deprioritizado este sprint mientras se resuelve su disponibilidad.",
      proyecto: "EMP-PLUS",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-08-11-03",
      titulo: "Si Laura Sánchez no confirma esta semana, se activa un Plan B comercial",
      descripcion: "El plan alternativo es lanzar comunicación estratégica y ofrecer directamente a usuarios en producción 3–4 meses gratis como prueba. Requiere antes una reunión con el equipo de Marcas y Lucho para segmentar el público objetivo y definir el cobro de licenciamiento.",
      proyecto: "EMP-PLUS",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Alto"
    },
    {
      id: "ins-2026-08-11-04",
      titulo: "Beta de Perfil de Marcas se corre 8 días por contingencia de energía/internet",
      descripcion: "La fecha beta se movió de 8 a 16 de septiembre después de que una contingencia de energía/internet en Bogotá afectara al equipo técnico la semana pasada. Fin de desarrollo queda en 15-sep y producción se mantiene en 29-sep, sujeta a cómo avance la beta.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Medio"
    },
    {
      id: "ins-2026-08-11-05",
      titulo: "Arranca la selección de los 5 usuarios piloto del segmento Creciendo",
      descripcion: "El piloto de Perfil de Marcas corre completamente en producción, sin ambiente de pruebas: Kate, Francisco Velandia, Mayra Ramírez y Vanessa Garay seleccionan esta semana a los 5 primeros usuarios (50–300 órdenes/mes, integraciones activas, sin Atom) para migrar con las mismas credenciales.",
      proyecto: "PRM-1331",
      tipo: "Hallazgo",
      tipoColor: "#94A3B8",
      impacto: "Alto"
    },
    {
      id: "ins-2026-08-11-06",
      titulo: "UserPilot está registrando falsos positivos de activación en onboarding",
      descripcion: "Los eventos se disparan en el front-end antes de que llegue la validación del back-end: un usuario ve \"completado\" y luego otro modal dice \"faltan datos\", pero UserPilot ya contabilizó el evento como exitoso. Esto sesga los datos de activación real vs. intentos fallidos.",
      proyecto: "UTP-001",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    }
  ],
  oportunidades: [
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus · Piloto y validación",
      status: "🟡 Bloqueado · a la espera de usuario de prueba operacional",
      statusColor: "#D97706",
      color: "#D97706",
      mueve: "Validar el programa Emprendedor Plus con una marca real antes de escalar",
      hipotesis: "Un usuario operacional con contrato directo de transportadora es indispensable para validar el tarifario — ningún ambiente de prueba lo reemplaza",
      gmv: "Ya en producción — sin fecha de beta formal (proyecto heredado); el bloqueante crítico sigue siendo conseguir un usuario real que valide el tarifario",
      avance: "José Giraldo resolvió el error 500 y la validación de 2FA que bloqueaban a la usuaria de prueba la semana anterior — el producto queda técnicamente listo, pero aún sin validación en producción con un usuario real. Laura Sánchez, el único contacto con credenciales reales de transportadora, está fuera del país hasta el 10–14 de agosto, así que el proyecto quedó deprioritizado este sprint. Si no confirma esta semana o la próxima, se activa un Plan B: comunicación estratégica y oferta directa a usuarios en producción (3–4 meses gratis de prueba), que requiere antes una reunión con el equipo de Marcas y Lucho para segmentar el público y definir el cobro de licenciamiento.",
      next: "Laura Sánchez confirma esta semana/viernes si puede ayudar con el usuario de prueba; si no, se escala el bloqueante. Francisco Velandia coordina con ella la sesión de prueba (virtual o presencial) en cuanto esté disponible. Laura Catherine Torres Ciendua y Francisco Velandia preparan en paralelo la estrategia de comunicación del Plan B (segmentación, canales, oferta de prueba gratuita) por si Laura Sánchez no entrega el usuario.",
      badge: "🟡 Deprioritizado este sprint — depende de Laura Sánchez",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Estado del producto", value: "Listo", sub: "Error 500/2FA resuelto por José Giraldo" },
          { label: "Usuario de prueba real", value: "0", sub: "Sin validación en producción con usuario operacional" }
        ],
        meta: [
          { label: "Fecha Beta", value: "No definido", sub: "Proyecto heredado, sin beta formal" },
          { label: "Fecha Producción", value: "Ya en producción", sub: "Pendiente validar con usuario real" }
        ],
        seguimiento: [
          { label: "Disponibilidad Laura Sánchez", value: "10–14 ago", sub: "Regresa a Colombia; retoma conversación de pruebas" },
          { label: "Plan B", value: "En preparación", sub: "Comunicación + oferta 3–4 meses gratis si no hay usuario esta semana" }
        ]
      }
    },
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🔄 En desarrollo — migración y rearquitectura UI coordinadas",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Migrar primero a usuarios existentes de mayor feedback (segmento Creciendo) reduce el riesgo frente a arrancar con marcas nuevas",
      gmv: "Fin de desarrollo 15-sep · Beta 16-sep (se corrió de 8-sep) · Producción 29-sep (estimado, sujeto al progreso de la beta)",
      avance: "Quedó definida la estrategia de migración: usuarios \"totalmente marca\" (con órdenes propias, no híbridos) se migran con el mismo email y credenciales — cierran sesión, se re-autentican y ven el nuevo rol Marcas con dashboard y copy ajustados. El enfoque es por fases: arrancar con 5 usuarios \"creciendo\" (50–300 órdenes/mes, integraciones activas, uso recurrente) y expandir a Consolidando, Pre-Escalando y Escalando en 1–1.5 meses — todo el proceso corre en producción, sin ambiente de pruebas. La rearquitectura UI se lanza en simultáneo, con switch para revertir temporalmente al diseño anterior. El registro de nuevas marcas se habilita solo después de completar 50–80% de las migraciones, y se decidió priorizar usuarios existentes (más feedback) sobre nuevos registros (menos riesgo operativo). La beta se corrió de 8 a 16 de septiembre por una contingencia de energía/internet en Bogotá que afectó al equipo técnico la semana pasada; se aplicó un buffer de 1–2 semanas.",
      next: "José Giraldo valida si el módulo Atom es viable para este lanzamiento o queda en roadmap post-lanzamiento. Kate, Francisco Velandia, Mayra Ramírez y Vanessa Garay seleccionan esta semana los 5 usuarios \"creciendo\" de la fase 1 (ya mapeados, con integraciones activas y uso frecuente, sin Atom). Francisco Velandia valida que la transición de UI no genere fricción y prepara la comunicación split (usuarios migrando vs. lanzamiento a nuevas marcas). Laura Catherine Torres Ciendua elabora la estrategia de comunicación para usuarios migrando y mapea el timing de apertura de registro para nuevas marcas.",
      badge: "🟡 Beta corrida 8 días por contingencia externa",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Fin de desarrollo", value: "15-sep-2026", sub: "Nueva fecha" },
          { label: "Piloto Fase 1", value: "5 usuarios", sub: "Segmento Creciendo (50–300 órdenes/mes)" }
        ],
        meta: [
          { label: "Fecha Beta", value: "16-sep-2026", sub: "Se corrió de 8-sep por contingencia energía/internet" },
          { label: "Fecha Producción", value: "29-sep-2026", sub: "Estimado, sujeto al progreso de la beta" }
        ],
        seguimiento: [
          { label: "Selección piloto Fase 1", value: "En curso", sub: "Kate, Francisco Velandia, Mayra Ramírez, Vanessa Garay" },
          { label: "Módulo Atom", value: "Por decidir", sub: "José Giraldo valida complejidad; fuera de scope si es alto" },
          { label: "Registro nuevas marcas", value: "Pausado", sub: "Se habilita tras 50–80% de migraciones completas" }
        ]
      }
    },
    {
      code: "UTP-001",
      name: "Eventos y Tracking UserPilot (Onboarding)",
      status: "🟡 En análisis — fricción identificada en tracking",
      statusColor: "#D97706",
      color: "#DC2626",
      mueve: "Confiar en los datos de UserPilot para medir activación real, no solo intentos",
      hipotesis: "Reactivar la integración UserPilot-backend, para que el evento se confirme solo tras la validación real, cierra la brecha entre activación bruta reportada y activación real",
      gmv: "Sin fecha de beta ni producción — depende de definir esta semana qué eventos críticos necesitan validación back-end",
      avance: "Se completó el mapeo de eventos clave para onboarding (creación de producto → bodega → orden). Se identificó una fricción sistémica: los modales de validación post-evento generan falsos positivos — por ejemplo, el usuario hace clic en \"Guardar\", un modal dice \"completado\", pero luego aparece otro modal de \"Faltan datos\", y UserPilot ya reportó el evento como exitoso. La causa raíz es que los eventos se disparan en el front-end antes de que lleguen las validaciones del back-end, sin que UserPilot se actualice después. Esto sesga los datos sobre activación real vs. intentos fallidos. Se decidió reactivar la integración de UserPilot con el backend para capturar las validaciones correctamente.",
      next: "José Giraldo coordina esta semana una sesión con Laura Catherine Torres Ciendua y el equipo para definir qué eventos críticos necesitan validación back-end, y nombra un propietario técnico para retomar la integración UserPilot-backend. Laura Catherine Torres Ciendua documenta los casos específicos de fricción (bodega pendiente, datos faltantes), agenda la sesión con José Giraldo incluyendo a Kate y Francisco Velandia, y lista exactamente qué eventos/momentos necesitan validación satisfactoria.",
      badge: "🔴 Datos de activación en UserPilot sesgados",
      badgeColor: "#DC2626",
      metricas: {
        base: [
          { label: "Mapeo de eventos", value: "Completo", sub: "Creación producto → bodega → orden" },
          { label: "Falsos positivos", value: "Detectados", sub: "Modal \"completado\" antes de validación back-end" }
        ],
        meta: [
          { label: "Fecha Beta", value: "No definido", sub: "Depende de definir eventos críticos primero" },
          { label: "Fecha Producción", value: "No definido", sub: "Depende de definir eventos críticos primero" }
        ],
        seguimiento: [
          { label: "Sesión eventos críticos", value: "Esta semana", sub: "José Giraldo + Laura Catherine Torres Ciendua" },
          { label: "Propietario técnico", value: "Por nombrar", sub: "Retoma integración UserPilot-backend" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Emprendedores Plus — Sourcing de usuario de prueba operacional",
      tag: "🟡 Bloqueado",
      tagColor: "#D97706",
      salio: "Laura Sánchez (único contacto de test users) está fuera del país hasta el 10–14 de agosto; el feature quedó deprioritizado este sprint mientras regresa",
      ruta: "Laura Sánchez confirma esta semana/viernes si ayuda; si no, se escala Plan B (comunicación + oferta 3–4 meses gratis a usuarios en producción)",
      rutaColor: "#D97706",
      metrica: "0 usuarios reales validando el tarifario en producción esta semana",
      decision: "Sin decisión cerrada — depende de la respuesta de Laura Sánchez esta semana/viernes"
    },
    {
      frente: "Perfil de Marcas — Beta se corre una semana por contingencia externa",
      tag: "🟡 Riesgo de cronograma",
      tagColor: "#D97706",
      salio: "Beta se movió de 8-sep a 16-sep por una contingencia de energía/internet en Bogotá que afectó al equipo técnico la semana pasada",
      ruta: "Buffer de 1–2 semanas ya aplicado; fin de desarrollo 15-sep y producción 29-sep se mantienen, sujetos al progreso de la beta",
      rutaColor: "#D97706",
      metrica: "Fecha beta corrida 8 días (8-sep → 16-sep)",
      decision: "Fechas actualizadas y comunicadas; toda la migración corre en producción, sin ambiente de pruebas"
    },
    {
      frente: "Tracking UserPilot — Falsos positivos en eventos de onboarding",
      tag: "🔴 Dato sesgado",
      tagColor: "#DC2626",
      salio: "Los eventos se disparan en el front-end antes de la validación back-end; un usuario puede ver \"completado\" y luego \"faltan datos\", y UserPilot ya registró el evento como exitoso",
      ruta: "José Giraldo coordina esta semana sesión con Laura Catherine Torres Ciendua para definir eventos críticos que necesitan validación back-end y nombrar propietario técnico",
      rutaColor: "#DC2626",
      metrica: "Datos de activación en UserPilot sesgados — pendiente cuantificar cuántos eventos son falsos positivos",
      decision: "Decisión tomada: reactivar integración UserPilot-backend; alcance y propietario pendientes esta semana"
    }
  ],
  resumen: "Reunión con Francisco Velandia, José Giraldo, Juan Sebastián Maldonado, Kate y Laura Catherine Torres Ciendua. En <strong>Emprendedores Plus</strong>, José Giraldo resolvió el error 500 y la validación de 2FA que bloqueaban a la usuaria de prueba — el producto queda técnicamente listo, pero sigue sin validarse en producción con un usuario real. El bloqueante ahora es puramente de sourcing: Laura Sánchez, único contacto con credenciales reales de transportadora, está fuera del país hasta el 10–14 de agosto, y el proyecto quedó deprioritizado este sprint. Si no confirma esta semana, se activa un Plan B de comunicación estratégica ofreciendo 3–4 meses gratis a usuarios en producción. En <strong>Perfil de Marcas</strong> quedó cerrada la estrategia de migración (usuarios \"totalmente marca\", mismo email/credenciales, por fases empezando con 5 usuarios del segmento Creciendo) y arranca esta semana la selección de esos 5 pilotos — todo el proceso corre en producción, sin ambiente de pruebas. La beta se corrió de 8 a 16 de septiembre por una contingencia de energía/internet en Bogotá; producción se mantiene en 29-sep sujeta al avance de la beta. Se abrió un frente nuevo: el <strong>tracking de eventos en UserPilot</strong> muestra falsos positivos de activación porque los eventos se disparan en el front-end antes de que llegue la validación del back-end — José Giraldo coordina esta semana con Laura Catherine Torres Ciendua para definir qué eventos necesitan validarse y reactivar la integración con el backend.",
  proximosPasos: [
    {
      titulo: "Esta semana (04–11 ago 2026)",
      color: "#DC2626",
      items: [
        "Laura Sánchez: confirmar esta semana/viernes si puede ayudar con usuario de prueba de Emprendedores Plus; si no, se escala el bloqueante.",
        "Francisco Velandia: coordinar con Laura Sánchez la sesión de prueba de Emprendedores Plus (virtual o presencial) en cuanto esté disponible.",
        "Laura Catherine Torres Ciendua y Francisco Velandia: preparar la estrategia de comunicación del Plan B de Emprendedores Plus (segmentación, canales, oferta de prueba gratuita) por si Laura Sánchez no entrega usuario.",
        "José Giraldo: validar la complejidad de incluir el módulo Atom en el lanzamiento de Perfil de Marcas; si es muy complejo, dejarlo en roadmap post-lanzamiento.",
        "Kate, Francisco Velandia, Mayra Ramírez y Vanessa Garay: seleccionar los 5 usuarios \"creciendo\" de la fase 1 del piloto de Perfil de Marcas.",
        "José Giraldo: coordinar esta semana la sesión con Laura Catherine Torres Ciendua para definir los eventos críticos de UserPilot que necesitan validación back-end, y nombrar propietario técnico.",
        "Laura Catherine Torres Ciendua: documentar los casos de fricción del tracking de UserPilot y listar los eventos/momentos que necesitan validación satisfactoria."
      ]
    },
    {
      titulo: "Próximos pasos críticos (por prioridad)",
      color: "#6366F1",
      items: [
        "1. Laura Sánchez → confirmar disponibilidad para usuario de prueba de Emprendedores Plus; define si el proyecto sigue con ella o escala a Plan B.",
        "2. José Giraldo → definir propietario técnico y eventos críticos de la integración UserPilot-backend.",
        "3. Kate, Francisco Velandia, Mayra Ramírez, Vanessa Garay → cerrar selección de los 5 usuarios piloto de Perfil de Marcas para iniciar migración en producción."
      ]
    }
  ]
};
