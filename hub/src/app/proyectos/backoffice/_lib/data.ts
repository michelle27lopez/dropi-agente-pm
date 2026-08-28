// ─────────────────────────────────────────────────────────────────────────────
// Weekly de la Célula Backoffice — una entrada por fecha, transcrita desde los
// .txt de dropi-agente-pm/hub/Weekly_Backoffice/. Cada archivo nuevo que se
// agregue a esa carpeta debe sumarse aquí como una entrada más de este array
// (más reciente primero), no reemplazar la anterior.
// ─────────────────────────────────────────────────────────────────────────────

export type AccionItem = { owner: string; texto: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "callout"; label: string; text: string; tone: "danger" | "warning" | "info" }
  | { type: "list"; label?: string; items: string[] };

export type Tema = {
  titulo: string;
  badge?: string;
  color: string;
  blocks: Block[];
  acciones?: AccionItem[];
};

export type WeeklyBackoffice = {
  id: string;
  fecha: string; // "30 julio 2026"
  fechaISO: string; // "2026-07-30"
  foco: string;
  asistentes?: string;
  temas: Tema[];
};

export const weeklyBackoffice: WeeklyBackoffice[] = [
  {
    id: "2026-07-30",
    fecha: "30 julio 2026",
    fechaISO: "2026-07-30",
    foco: "🎉 Argentina en beta · Giro estratégico Sumsub → Fase 1 por directriz ejecutiva · Confío en espera",
    temas: [
      {
        titulo: "🇦🇷 Facturación Argentina — Beta en producción desde el 29 julio",
        badge: "✅ Beta activo",
        color: "#10B981",
        blocks: [
          {
            type: "p",
            text: "La funcionalidad entró a beta en producción el 29 de julio con 8 usuarios. Todos los bugs identificados en la sesión del 22 de julio fueron corregidos y verificados el 27 de julio. Nataly y Valeria tienen acceso al módulo admin para revisar y aprobar/rechazar datos. Producto hace pruebas con su propio usuario.",
          },
          {
            type: "p",
            text: "Ya quedó montado el video tutorial y los documentos legales de los check quedaron apuntando a los de Argentina correctamente.",
          },
          {
            type: "list",
            label: "📌 Flujo de fases confirmado definitivamente:",
            items: [
              "Beta (ahora): 8 usuarios ven el formulario. Switch activo — herramientas financieras habilitadas aunque no lo llenen.",
              "Fase 1 (requiere nuevo despliegue de frontend): formulario visible para TODOS los usuarios argentinos. Switch activo, sin bloqueos. Va la campaña de comunicación.",
              "Fase 2: switch desactivado → bloqueo de retiros, transferencias y cuentas bancarias para quien no completó datos.",
            ],
          },
        ],
        acciones: [
          { owner: "Gustavo", texto: "corregir los errores reportados por el área de producto antes de habilitar la funcionalidad a todos los usuarios." },
          { owner: "Catalina", texto: "citar a Nataly y Valeria para pruebas del panel administrativo (30 julio)." },
          { owner: "Paula", texto: "coordinar con TI el segundo despliegue de frontend para pasar de beta a Fase 1 (todos los usuarios)." },
        ],
      },
      {
        titulo: "🪪 Sumsub — Directriz ejecutiva: ir directo a Fase 1",
        badge: "🔴 Giro estratégico",
        color: "#EF4444",
        blocks: [
          {
            type: "callout",
            tone: "danger",
            label: "🔴 Directriz corporativa — 30 julio (Laura Sánchez)",
            text: "Lucho instruyó implementación urgente y transversal de Sumsub en TODOS los países. Se va directamente a la Fase 1 (implementación técnica en backend). La Fase Cero manual queda descartada. El lunes hay reunión formal con todos los equipos.",
          },
          {
            type: "p",
            text: "¿Por qué la urgencia? En los últimos 3 meses se detectaron: demandas en algunos países, falsificación de datos de facturación, errores en reportes exógenos a la DIAN, y problemas con entidades tributarias. El costo de no actuar (multas, demandas, bloqueo de wallets a todos los usuarios de un país) es mayor que el riesgo de actuar rápido.",
          },
          {
            type: "list",
            label: "Estructura de flujos por país — Fase 1:",
            items: [
              "Flujo largo (identidad + facturación en un solo paso en Sumsub): Guatemala, Panamá, Paraguay, Perú, México, Venezuela y Costa Rica. Guatemala es el primer piloto.",
              "Flujo corto (solo validación de documento — biometría/liveness): Chile, Ecuador y Argentina — ya tienen módulo de facturación activo. No se toca el formulario existente en esta fase.",
              "Colombia: sigue con Truora para KYC. Se agrega captura de datos de facturación en el flujo de Sumsub sin reemplazar Truora todavía.",
              "Marcas blancas: flujo diferenciado — sin logo de Dropi, canales por fuera de los estándar.",
            ],
          },
          {
            type: "p",
            text: "Acuerdo con TI: TI asigna desarrollador. José, Juan Camilo, Paula y Catalina trabajan en conjunto desde el 30 julio. TI investiga la API de Sumsub en paralelo mientras Producto termina de definir los flujos. José alertó: no unificar el formulario en el front en esta fase — primero el backend y la integración, luego los cambios de front.",
          },
        ],
        acciones: [
          { owner: "Lunes", texto: "reunión formal con todos los equipos (GrowOps, Administrativo, TI y Producto) — Sumsub presenta flujos validados, José presenta estimación de esfuerzo, se define alcance del MVP y orden de países." },
          { owner: "Juan Camilo", texto: "entregar a José ANTES del lunes toda la documentación técnica del proyecto (flujos KYC/KYB por país, blueprint, campos requeridos por tipo de persona)." },
          { owner: "José", texto: "trabajar con equipo de arquitectura para mapear estados de Truora como referencia y estimar la integración con Sumsub. Entregar estimación el lunes." },
          { owner: "José", texto: "confirmar el nombre del desarrollador asignado al proyecto y asegurar que esté en la reunión del lunes." },
          { owner: "Paula", texto: "compartir con José el acceso al sandbox de Sumsub esta semana." },
          { owner: "Jonatan", texto: "coordinar con Sumsub la reunión técnica para definir cómo se hace la migración de usuarios de Guatemala (API, ZIP o traslado directo)." },
        ],
      },
      {
        titulo: "💳 Confío Pagos — México",
        badge: "⚠️ Fecha indefinida · Bloqueado",
        color: "#F59E0B",
        blocks: [
          {
            type: "p",
            text: "La integración sigue bloqueada por la debida diligencia con el proveedor bancario de México — sin avance esta semana. Catalina y Juan Camilo quedan pendientes al seguimiento con Víctor en las semanas del 10 al 24 de agosto. Si hay avance, gestionar lanzamiento y métricas.",
          },
        ],
      },
      {
        titulo: "🔑 CAS — JAMV Drive Colombia y activación CAS Argentina",
        color: "#0EA5E9",
        blocks: [
          { type: "p", text: "JAMV Drive Colombia: la comunicación quedó gestionada en redes sociales, pendiente en plataforma." },
          { type: "p", text: "Nueva solicitud que debe entrar al Dropiscore: la activación CAS Argentina." },
        ],
      },
      {
        titulo: "💬 Alineación SAC — Canal Intercom Facturación Argentina",
        color: "#8B5CF6",
        blocks: [
          {
            type: "p",
            text: "Sesión de alineación con el equipo de soporte (Harry, Osman, Yuliana) para preparar el canal de Intercom de Argentina antes del lanzamiento al público. El flujo es similar al de Chile y Ecuador, pero con diferencias importantes: documentos distintos (DNI, CUIT, constancia AFIP según condición IVA) y tutoriales propios del país.",
          },
          {
            type: "p",
            text: "Estructura del árbol de soporte acordada: el usuario entra al canal y puede elegir entre completar datos de facturación, reportar error en los datos, problemas técnicos (MFA, wallet bloqueada) o solicitar agente. Si reporta un error, recibe una alerta roja con el campo específico fallido, lo corrige y queda en revisión nuevamente. Si tiene problema técnico, envía captura de pantalla al agente para revisión manual. Si no encuentra solución, puede volver al menú o escalar directamente a un agente.",
          },
          {
            type: "callout",
            tone: "warning",
            label: "📌 Ajuste urgente antes del lanzamiento",
            text: "El tiempo de revisión manual de datos (24-48 horas) NO está incluido en los mensajes automáticos de Intercom. Sin ese mensaje, los usuarios esperarán sin saber cuánto tiempo — generando tickets innecesarios. Catalina debe actualizar el copy antes del lanzamiento.",
          },
          {
            type: "p",
            text: "Bug activo en Ecuador — a tener en cuenta para Argentina: cuando los datos son aprobados, la wallet puede quedar bloqueada por un retraso en la sincronización automática. Requiere desbloqueo manual por un administrador. El flujo de Intercom debe informar al usuario que un agente se encargará, en lugar de redirigirlo a una opción que no aplica.",
          },
          {
            type: "p",
            text: "Bloqueos financieros: en Argentina hay una semana de gracia (Fase 1) donde los usuarios pueden mover fondos aunque no hayan completado los datos. El bloqueo solo aplica desde la Fase 2. El equipo SAC debe conocer esta distinción para gestionar correctamente las expectativas.",
          },
        ],
        acciones: [
          { owner: "Catalina", texto: "actualizar los mensajes automáticos de Intercom para Argentina incluyendo el tiempo estimado de revisión de 24-48 horas — antes del lanzamiento." },
          { owner: "Catalina", texto: "obtener el número de usuarios activos en Argentina para calcular el volumen estimado de solicitudes de soporte al lanzamiento." },
          { owner: "Catalina", texto: "compartir con Yuliana los materiales de soporte de Chile y Ecuador (flujo Intercom, tutorial YouTube, manual de uso y Figma) para que adapte lo necesario para Argentina." },
          { owner: "Yuliana", texto: "presentar el flujo de soporte y materiales de facturación a Marlon y Osman para obtener aprobación antes de configurar formalmente el canal en Intercom." },
          { owner: "Sin responsable asignado", texto: "una vez obtenida la aprobación de Marlon y Osman: implementar flujos de respuesta automática y botones de ayuda en Intercom para Argentina." },
        ],
      },
    ],
  },
  {
    id: "2026-07-24",
    fecha: "24 julio 2026",
    fechaISO: "2026-07-24",
    foco: "Argentina beta próxima semana, Sumsub flujos + Guatemala desbloqueado, Confío en espera",
    temas: [
      {
        titulo: "🪪 Sumsub — Flujos avanzados + Guatemala desbloqueándose",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Guatemala — Coloca Payments: entrega esta semana. Jonatan confirmó que Coloca Payments entregará esta semana: (1) la base de datos de usuarios de Guatemala ya validados, y (2) el flujo y parametrización actual de Coloca con Sumsub. Legal destacó que es fundamental entender esa parametrización (qué conductas excluyen, qué documentos exigen, cómo funciona el liveness para dispersión) para que Dropi la replique cuando entre Dropipay con su propio Sumsub." },
          { type: "p", text: "Capacitaciones Sumsub — semana del 28 julio: Sumsub capacita a Jonatan y a la persona contratada para validaciones en el manejo del backoffice y creación de flujos. Después Jonatan capacita internamente. Una vez hecha la primera implementación en vivo con acompañamiento de Sumsub, el equipo podrá gestionar flujos futuros de forma independiente." },
        ],
        acciones: [
          { owner: "Jonatan", texto: "cerrar esta semana la entrega de Coloca Payments (base usuarios Guatemala + flujo y parametrización). Confirmar si hay liveness en ese flujo." },
          { owner: "Jonatan", texto: "compartir con Juan Camilo el documento de criterios de exclusión y tipos de validación por país ya entregado a Sumsub." },
          { owner: "Jonatan", texto: "asistir a las capacitaciones de Sumsub la semana del 28 julio junto con la persona de validaciones." },
          { owner: "Juan Camilo", texto: "reunión 23 julio con Camilo (Sumsub) para validar escenarios y definir modelo final — un flujo con bifurcaciones por país y tipo de persona." },
          { owner: "Paula", texto: "estar presente (o delegar) en la reunión de entrega con Coloca Payments para capturar el detalle técnico del flujo y la parametrización." },
        ],
      },
      {
        titulo: "💬 Árbol de soporte Intercom — Facturación",
        badge: "En construcción",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Catalina presentó el árbol de soporte en construcción para Chile, Ecuador y Argentina. Incluye opciones: quiero completar mis datos, tengo un error reportado, problemas técnicos (MFA, edición de datos, wallet bloqueada), error al diligenciar datos (ej. pasaporte mal ingresado en Chile), tipos de documentos aceptados y botón guardar deshabilitado." },
          { type: "p", text: "Juan Camilo destacó que este árbol también alimenta la base de conocimiento de Gali (IA de soporte en Intercom), potenciando la automatización del canal en todos los países." },
        ],
        acciones: [
          { owner: "Paula + Catalina", texto: "finalizar ajustes del árbol de soporte de Intercom y compartirlo con Juan Camilo para pasarlo a Laura Núñez (SAC)." },
          { owner: "Juan Camilo", texto: "una vez reciba el árbol, pasárselo a Laura Núñez (SAC) para que el equipo de soporte sepa cómo funciona el canal." },
        ],
      },
      {
        titulo: "🇦🇷 Facturación Argentina — Formulario listo, beta desde el 29 julio",
        badge: "✅",
        color: "#10B981",
        blocks: [
          { type: "p", text: "El formulario fue revisado en sesión del 22 de julio. Los bugs son menores y se corrigen rápido. Las decisiones de comportamiento más importantes quedaron totalmente claras." },
          {
            type: "list",
            label: "📌 Aclaración definitiva del switch y las fases:",
            items: [
              "Switch activo = usuario SÍ puede usar funciones financieras sin datos de facturación (sin bloqueo).",
              "Despliegue BETA: usuarios normales no ven nada. Usuarios beta ven el formulario con herramientas financieras habilitadas aunque no lo llenen.",
              "Fase 1 (1 semana después): formulario habilitado para TODOS los usuarios argentinos. Switch activo, sin bloqueos. Va la campaña de comunicación.",
              "Fase 2 (posterior a Fase 1): switch desactivado. Bloqueo de retiros y transferencias para quien no completó los datos.",
            ],
          },
          { type: "p", text: "Decisión sobre edición post-aprobación: formulario bloqueado para edición tras aprobación. Se evalúa con datos reales de soporte de Chile/Ecuador antes de cambiar el comportamiento." },
          {
            type: "list",
            label: "Bugs identificados en sesión (aplican para todos los países):",
            items: [
              "Campo provincia/ciudad no se limpia al cambiar país — comportamiento heredado de Chile, Ecuador y México. Decisión: corregir para todos los países a la vez.",
              "Provincia y ciudad aparecen duplicados en estado 'Reportado' — comportamiento heredado. Se corrige para todos.",
              "Campo tipo de documento no se limpia al cambiar tipo de persona — ya identificado en weekly anterior, pendiente de corrección.",
            ],
          },
        ],
        acciones: [
          { owner: "Gustavo", texto: "corregir los 3 bugs identificados (provincia/ciudad al cambiar país, duplicidad en estado Reportado, limpieza de tipo de documento). Aplican para todos los países." },
          { owner: "Gustavo", texto: "investigar si los links de T&C y Política de Privacidad deben gestionarse a través de la tabla de Daniel de la Pava (arquitectura existente) para no quemarlos en código como en Chile y Ecuador." },
          { owner: "Paula", texto: "pasar a Gustavo los correos de los usuarios administrativos con acceso al panel de revisión Argentina (consulta con equipo de facturación Colombia hoy mismo)." },
          { owner: "Paula", texto: "una vez tenga el link de Política de Privacidad de Argentina (viernes), pasarlo a desarrollo. Provisional: link de Colombia mientras llega el de Argentina." },
          { owner: "Marketing", texto: "entregar el video tutorial de Argentina la semana del 28 julio. Paula lo pasa a Gustavo para configurarlo." },
          { owner: "Catalina", texto: "revisar la grabación de la sesión del 22 julio y reportar si encuentra algún otro detalle a corregir antes del beta." },
          { owner: "Paula", texto: "épica en Jira ya lista con los 8 usuarios de Valeria para el beta controlado." },
        ],
      },
      {
        titulo: "💳 Confío Pagos — México",
        badge: "⚠️ Fecha indefinida",
        color: "#F97316",
        blocks: [
          { type: "p", text: "La integración sigue bloqueada por el proceso de debida diligencia con el proveedor bancario de México. El formulario avanza por pasos — cada uno revela nuevos documentos requeridos. El equipo administrativo de Dropi gestiona con Angélica y Víctor de forma diaria, pero aún no se han aperturado las cuentas ni dado acceso a las APIs de Confío en México." },
        ],
      },
    ],
  },
  {
    id: "2026-07-17",
    fecha: "17 julio 2026",
    fechaISO: "2026-07-17",
    foco: "Sumsub Fase Cero aprobación + TI, Confío bloqueado indefinidamente, datos multipaís",
    temas: [
      {
        titulo: "🔑 CAS — COORDI México y JAMV Drive Colombia",
        color: "#0EA5E9",
        blocks: [
          { type: "p", text: "Épicas ya gestionadas. Ya ambas se le pasaron a José Giraldo para gestión con TI para pronta habilitación." },
        ],
      },
      {
        titulo: "🪪 Sumsub — Blueprint Fase Cero definido",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "El blueprint de Fase Cero está definido y listo para arrancar. La estrategia es 100% no-code y no bloqueante. Guatemala es el primer país piloto para usuarios nuevos. Arranca en cuanto se obtenga la aprobación de María y Diana." },
        ],
        acciones: [
          { owner: "Catalina", texto: "finalizar el blueprint esta semana y compartirlo con el grupo para revisión antes del arranque." },
          { owner: "Catalina", texto: "coordinar con Diana (diseño) la aprobación de usabilidad del flujo antes del despliegue." },
          { owner: "Paula", texto: "asistir a la reunión del 16 julio con Catalina, Juan Camilo, Andrés Herrera y TI para explorar el apoyo de TI en almacenar datos en base de datos desde la Fase Cero." },
        ],
      },
      {
        titulo: "📊 Data de usuarios — Cruce multipaís",
        color: "#8B5CF6",
        blocks: [
          { type: "p", text: "Se cruzó la base de usuarios de Colombia (activos últimos 90 días, con documento) para detectar los mismos usuarios en otros países y baneados que operan en el exterior. Cruce por correo o número de documento (no por nombre, para evitar falsos positivos)." },
          { type: "p", text: "Andrés Herrera aportó que 115.000 usuarios ya están validados en Colombia — muchos de esos mismos están en otros países y no habría que revalidarlos, reduciendo significativamente el costo de Sumsub." },
        ],
        acciones: [
          { owner: "Juan Camilo", texto: "levantar el proceso operativo para la Fase Cero y los requisitos de los usuarios a priorizar, partiendo de Guatemala como primera ola." },
          { owner: "Lina", texto: "revisar los costos de Sumsub y hacer la proyección de impacto financiero por país y volumen estimado de validaciones." },
          { owner: "Lina + Juan Camilo", texto: "sentarse juntos a validar que los campos requeridos por tipo de persona y país coincidan con lo que necesita facturación y exógena." },
        ],
      },
      {
        titulo: "🔀 Flujos KYC y KYB — Avances de Juan Camilo",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Flujos de usuario de Sumsub ya avanzados. Duda clave resuelta: para validar a una persona diferente al dueño de la cuenta (ej. representante legal de empresa), Sumsub genera un link que se envía a esa persona para que complete el proceso. No se requiere un nuevo formulario en Dropi." },
          { type: "p", text: "Lina aclaró: Dropi factura siempre a la persona jurídica (empresa), no al representante legal. La validación del representante es solo para verificar que los datos de la empresa sean legítimos — sus datos personales no se almacenan en Dropi." },
        ],
        acciones: [
          { owner: "Juan Camilo", texto: "terminar los flujos visuales de Sumsub (KYC y KYB por país, incluidas marcas blancas) y pasarlos a Sumsub para validación. Una vez confirmados, citar a José y/o Diego para la reunión técnica de integración." },
          { owner: "Juan Camilo", texto: "levantar el flujo diferenciado para marcas blancas con apoyo de Andrés Herrera (131.975 usuarios activos solo en Colombia)." },
          { owner: "Jonatan", texto: "analizar país por país cómo gestionar aceptación de T&C y privacidad para representantes legales externos. Compartir resultado al grupo." },
          { owner: "Jonatan", texto: "avanzar con la reunión con Coloca Payments (abogado y representante legal) y Sumsub para coordinar la migración formal de usuarios de Guatemala." },
          { owner: "Andrés Herrera", texto: "facilitar acceso o screenshots de flujos de Truora (incluidas marcas blancas) para que Juan Camilo evalúe cuáles reutilizar en Sumsub." },
        ],
      },
      {
        titulo: "💻 Postura de TI frente a Fase Cero (José Giraldo)",
        color: "#EF4444",
        blocks: [
          { type: "callout", tone: "warning", label: "Postura de TI", text: "José propone saltarse la Fase Cero e ir directo a la integración formal (Fase 1). Argumenta que hacer una fase no-code y después el desarrollo \"de verdad\" duplica el esfuerzo. Nadie en TI conoce la plataforma de Sumsub en detalle — no puede dar estimaciones sin antes estudiar la API y arquitectura." },
          { type: "p", text: "Respuesta de Producto: la Fase Cero existe por urgencia legal y para no frenar la operación mientras TI estima tiempos. La Fase 1 completa implica cambios en el onboarding que aún no están diseñados — puede tomar meses. La Fase Cero no es descartable: los usuarios se validan en Sumsub y esa data queda en el backoffice de Sumsub. Lo que se pide a TI es que en paralelo guarden esa data en Dropi para que cuando llegue la Fase 1 la info ya esté lista." },
        ],
        acciones: [
          { owner: "José", texto: "revisar el blueprint de Fase Cero (compartido por Catalina). Si necesita sesión adicional, solicitarla al equipo." },
          { owner: "José", texto: "confirmar si Diego (dev que hizo la integración con Truora) puede participar en la próxima reunión técnica con Sumsub." },
          { owner: "TI", texto: "evaluar en paralelo si puede construir los endpoints para recibir estados de Sumsub y almacenarlos en base de datos de Dropi — facilita la transición a Fase 1." },
        ],
      },
      {
        titulo: "💳 Confío Pagos — México",
        badge: "⚠️ Bloqueado",
        color: "#F97316",
        blocks: [
          { type: "p", text: "La integración de Confío en México sigue bloqueada por un proceso de debida diligencia con el proveedor bancario que continúa sin terminar. El formulario del proveedor es por pasos — cada vez que se avanza aparecen nuevos documentos requeridos. El equipo administrativo de Dropi gestiona diariamente con Angélica y Víctor, pero aún no se han aperturado las cuentas ni se ha dado acceso a las APIs de Confío en México." },
        ],
        acciones: [
          { owner: "Víctor (Confío)", texto: "notificar a Paula o Juan Camilo de inmediato si el proceso de diligencia se desbloquea — sin esperar al siguiente weekly." },
          { owner: "Paula", texto: "actualizar el plan de lanzamiento de Confío México en el Dropi Score y en el roadmap (fecha TBD — bloqueado administrativamente)." },
        ],
      },
    ],
  },
  {
    id: "2026-07-10",
    fecha: "10 julio 2026",
    fechaISO: "2026-07-10",
    foco: "Sumsub Fase Cero, lanzamiento Argentina, Simetrik kickoff y Confío desbloqueado",
    temas: [
      {
        titulo: "🔑 CAS — COORDI México y JAMV Drive Colombia",
        color: "#0EA5E9",
        blocks: [{ type: "p", text: "Épicas ya gestionadas. Pendiente amarrarlas a la solicitud en Dropi Score para pasarlas a TI." }],
      },
      {
        titulo: "🪪 Sumsub — Flujo ajustado y Fase Cero en marcha",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Financiero y Compliance revisaron el flujo enviado por Sumsub. Hay una observación puntual sobre datos de facturación que Camilo (Sumsub) ya está implementando — el flujo ajustado se revisó el 9 de julio. Los datos de usuarios de Guatemala registrados en Coloca Payments ya se está gestionando para que sean migrados hacia Sumsub bajo el dominio de Dropi." },
          { type: "p", text: "El flujo de cuentas bancarias (popup tipo Guatemala/Panamá) puede replicarse en los demás países con el mismo look & feel de Dropi. La ruta ya está diseñada — es el mismo paso a paso, solo cambia la marca." },
          {
            type: "list",
            label: "📌 Fase Cero — estrategia no-code (Catalina):",
            items: [
              "Validación asistida manual para usuarios nuevos y activos, sin integración tecnológica, usando User Pilot, CRM y comunicación activa mientras se completa la integración técnica.",
              "Países piloto: Guatemala, Panamá, Paraguay y Perú (sin módulo de facturación complejo — se implementa el link de Sumsub directamente).",
              "Países con módulo activo (Chile, Ecuador, próximamente Argentina): solo se solicitará a Sumsub un flujo sencillo de validación — sus datos de facturación ya están en el formulario manual.",
              "Incluye: banners informativos en User Pilot para usuarios nuevos (últimos 7 días), popups al intentar retiros/transferencias en usuarios activos, y mensajes por CRM al equipo de proveedores.",
              "Usuarios rechazados por crimen o actividad ilícita: bloqueo simultáneo en todos los países, sin comunicar razón exacta. Coordinación con Andrés Herrera y Legal/Financiero.",
            ],
          },
        ],
        acciones: [
          { owner: "Juan Camilo", texto: "citar a cada área por separado para levantar criterios y procesos operativos de la Fase Cero. Levantar los flujos TOBE que se le van a pasar a Sumsub para que lo programen en el WebSDK." },
        ],
      },
      {
        titulo: "⚠️ Truora — Problema activo de soporte",
        color: "#F97316",
        blocks: [
          { type: "p", text: "El servicio no está dando el valor esperado: se paga por automatización pero más de la mitad de los casos requieren procesamiento manual humano adicional (~4.000 casos/mes de soporte)." },
        ],
      },
      {
        titulo: "🔄 Conciliaciones — Simetrik",
        badge: "✅ Kickoff realizado",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Kickoff de Simetrik ya ocurrió. Hay equipo asignado. Primera reunión de inicio: viernes 11 de julio a las 11 a.m. Implementación estimada: 3 meses." },
          { type: "p", text: "Equipo asignado: Fernando (TI técnico, provisional), Laura Mejía (procesos), Juan Camilo (GrowOps) y Cristian Ruiz (PM). Marlon propone agregar a Paula para evitar el teléfono roto." },
          { type: "p", text: "Alcance de Simetrik: conciliaciones de recargas y retiros para USDT, Payoneer, PayPal y Global66. Además construirá un módulo backoffice con métricas de conciliación nacional. La integración con bancos nacionales sigue siendo de TI (Fernando)." },
        ],
      },
      {
        titulo: "💳 Confío Pagos — México",
        badge: "✅ Desbloqueado",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Confío está desbloqueando sus temas administrativos y tecnológicos. Fecha estimada de entrega de la integración para México: 30 de julio. Se establecieron weeklies de seguimiento con Víctor." },
        ],
        acciones: [
          { owner: "Marlon", texto: "compartir a Paula el listado de volumen de recargas por país antes del próximo weekly con Confío, para que Confío planee la hoja de ruta de expansión en orden de prioridad." },
        ],
      },
      {
        titulo: "📜 T&C — Chile y Ecuador",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "64% de aceptación en Chile y 62% en Ecuador. El ritmo de nuevas aceptaciones disminuyó — ya cubrió a los usuarios más frecuentes; los restantes son menos activos. El Discovery del proyecto tecnológico formal de T&C ya está en curso — la product designer está retomando el flujo para planear la implementación tecnológica." },
        ],
      },
      {
        titulo: "🇦🇷 Facturación Argentina — Segundo weekly técnico + plan de lanzamiento definido",
        badge: "Beta a Producto: 29 julio",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Estado técnico: el formulario está prácticamente listo en ambiente local. Gustavo presentó el flujo en vivo — provincia, ciudad, dirección, razón social y condición frente al IVA (campo nuevo en base de datos, aplica para todos los países pero solo activo para Argentina). El comportamiento de auto-selección funciona correctamente. Error detectado: cuando el usuario cambia el tipo de persona, el campo de tipo de documento no se limpia — Gustavo ya lo tiene identificado." },
          { type: "callout", tone: "info", label: "📌 Aclaración definitiva del switch de bloqueo", text: "El switch NO habilita el formulario — habilita temporalmente las herramientas financieras para usuarios SIN datos de facturación durante la semana de gracia (Fase 1). Los cuatro módulos bloqueados en Fase 2: retiros, transferencias entre wallets, Dropicar y cuentas bancarias." },
          { type: "p", text: "Estrategia de lanzamiento — dos fases + beta controlado: beta previo solo con usuarios de Valeria (los que ya tienen datos de facturación existentes) para detección de errores antes del lanzamiento masivo. Evita repetir la experiencia de México/Chile donde el módulo salió a todos simultáneamente y generó saturación de soporte. Catalina + Laura Torres arman el flujo de User Pilot para el beta basándose en flujos de otros países." },
          { type: "callout", tone: "danger", label: "⚠️ Bloqueante", text: "Comunicaciones aún no ha entregado ningún recurso (manual, tutorial, redes) — solicitud desde el 25 junio. Video tutorial requerido antes del 16-17 julio para que Gustavo lo adjunte al código." },
        ],
      },
      {
        titulo: "🛡️ Panel antifraude y prevención de saldos negativos",
        color: "#8B5CF6",
        blocks: [
          { type: "p", text: "El panel antifraude ya tiene avances con Fernando y Andrés Herrera. El proyecto de prevención y recuperación de saldos negativos requiere revisión — algunas soluciones planteadas pueden estar obsoletas." },
        ],
        acciones: [
          { owner: "Paula", texto: "sentarse con Andrés Herrera y Fernando para recoger el estatus actual del panel antifraude antes de retomarlo formalmente." },
        ],
      },
      {
        titulo: "🇻🇪 Botón flotante Venezuela",
        badge: "✅ Configurado",
        color: "#10B981",
        blocks: [{ type: "p", text: "Configurado y activo. Ya hay más de 60 solicitudes activas." }],
      },
    ],
  },
  {
    id: "2026-07-03",
    fecha: "3 julio 2026",
    fechaISO: "2026-07-03",
    foco: "Sumsub fase cero, Argentina fecha confirmada, Cartera y transición Truora",
    temas: [
      {
        titulo: "🚨 TI — Tercera sesión consecutiva sin conexión",
        color: "#EF4444",
        blocks: [
          { type: "p", text: "Marlon advirtió que si esto continúa, el espacio pierde su propósito. Paula debe escalar directamente con José y/o Eduardo. Sin TI, los proyectos no pueden avanzar formalmente." },
        ],
      },
      {
        titulo: "🪪 Sumsub — Propuesta de flujos y Fase Cero",
        badge: "Desarrollo",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Jonatan confirmó que el formulario de flujos y las condicionales de validación (incluidos delitos y crímenes tipificados por país) ya fueron enviados a Sumsub. El 2 de julio Sumsub presenta la propuesta de flujos con las condicionales ya incorporadas. Jonatan invitó a Catalina, Juan Camilo y Paula." },
          { type: "callout", tone: "info", label: "📌 Fase Cero", text: "Validación asistida: manual, no-code y no bloqueante. El objetivo es incentivar a usuarios a validarse sin restricciones financieras, recogiendo data mientras se completa la integración técnica. Paula convoca mesa con Legal, Financiero, Compliance, GrowOps y Diseño para definir criterios." },
          { type: "p", text: "Usuario activo — criterio acordado: más de 50 órdenes como umbral de priorización, con posibilidad de cruzar también monto en wallet. Las órdenes son el criterio más robusto dado que el monto por ticket varía mucho." },
          { type: "p", text: "Costos de validación: aún pendientes. Jonatan los reiteró en sesión — Lina confirmó que tampoco los tiene. Una vez lleguen, Lina + Financiero hacen la proyección para 4 escenarios: edición libre de datos de facturación, validación de usuarios antiguos por lotes, validaciones automáticas recurrentes (mensual/trimestral/semestral), y ajuste del bloqueo de 6 meses de datos personales." },
        ],
        acciones: [
          { owner: "Jonatan", texto: "obtener detalle de costos por actividad para compartir con Lina." },
          { owner: "Jonatan + Lina", texto: "revisar minuciosamente el Web SDK de Sumsub para corroborar que cumple con las necesidades y lo plasmado en los documentos enviados." },
          { owner: "Paula", texto: "convocar mesa de Fase Cero con Legal, Financiero, Compliance, GrowOps y Diseño para definir criterios de usuarios a priorizar y estrategia no bloqueante." },
          { owner: "Lina", texto: "una vez reciba los costos de Sumsub, hacer el análisis de impacto financiero para los 4 escenarios." },
        ],
      },
      {
        titulo: "🔄 Transición Truora → Sumsub",
        color: "#6366F1",
        blocks: [
          { type: "callout", tone: "info", label: "📌 Decisión acordada", text: "Agotar la bolsa de Truora (renovada hasta el año siguiente) mientras se implementa Sumsub en los otros países. Colombia se migra cuando queden pocos créditos de Truora." },
          { type: "p", text: "Truora en Colombia: no funciona en iOS/Mac, falla con frecuencia y es la segunda causa más alta de tickets de soporte (~3.500 casos/mes en los últimos 3 meses)." },
        ],
        acciones: [
          { owner: "Andrés Herrera", texto: "reunirse con Paula, Catalina y Juan Camilo para compartir cómo nació el flujo con Truora y trasladar el aprendizaje a Sumsub sin repetir errores." },
          { owner: "Andrés Herrera", texto: "participar más activamente en la integración con Sumsub apoyando a Jonatan y Lina con el conocimiento del proceso de Truora." },
        ],
      },
      {
        titulo: "📋 Cambio de datos de facturación",
        badge: "Definición",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Andrés Herrera fue claro: cuando lideró el proceso de validaciones, no se permitía cambiar datos de cuenta ni de facturación libremente — el usuario validado es el dueño de esa cuenta. Jonatan apoya la fricción como mecanismo de control: cambios posibles pero no sencillos." },
          { type: "callout", tone: "warning", label: "Riesgo crítico identificado (Andrés)", text: "Si un usuario factura hoy a nombre de su mamá y mañana a nombre de su tío, es una facturación fragmentada a múltiples terceros — un problema grave para la información exógena." },
        ],
      },
      {
        titulo: "🇦🇷 Facturación Argentina — 28 julio, fin de desarrollo",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "José confirmó a Lina la fecha estimada de fin de desarrollo: 28 de julio de 2026. Posterior a eso, Producto realiza pruebas de calidad y luego se libera al público en el siguiente release. La comunicación de lanzamiento está lista desde el 25 de junio — esperando a que salga el desarrollo para activarla." },
        ],
        acciones: [
          { owner: "Paula", texto: "retomar la semana siguiente la alineación con Comunicaciones para coordinar el lanzamiento (desarrollo termina 28 julio, publicación posterior a pruebas)." },
          { owner: "Juan Camilo + GrowOps", texto: "definir cómo se maneja el canal de Intercom para Argentina antes del lanzamiento público." },
        ],
      },
      {
        titulo: "🇻🇪 Botón flotante Venezuela",
        badge: "✅ Instalación comprobada",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Instalación del botón flotante comprobada en Venezuela. Se informó a Marlon y a Laura Andrea Núñez para el proceso de configuración. Pendiente: definir el atributo de comunidades (verificar si son las mismas de Colombia) para completar la configuración." },
        ],
      },
      {
        titulo: "🔑 CAS — COORDI México y JAMV Drive Colombia",
        color: "#0EA5E9",
        blocks: [
          { type: "p", text: "A la espera de que entren por Dropi Score las solicitudes de activación CAS para Transportadora COORDI México y JAMV Drive Colombia." },
        ],
      },
      {
        titulo: "📋 Flujo Configuración de pedidos — MFA",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Desde TI ya se había detectado esa omisión y se encuentran terminando de aplicar unas observaciones para que lo aprueben y lo desplieguen, ya que hay unos requisitos que debe cumplir para que el líder técnico le dé paso a producción." },
        ],
      },
    ],
  },
  {
    id: "2026-06-26",
    fecha: "26 junio 2026",
    fechaISO: "2026-06-26",
    foco: "Rol estratégico de la célula, Sumsub, lanzamiento Argentina y bloqueo de wallet",
    temas: [
      {
        titulo: "🧭 Visibilidad centralizada — Exógena y proyecto Apolo",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Mónica alertó un cruce de información: el proyecto Exógena estaría \"muy avanzado\" desde TI, pero ese avance no se ha socializado en la célula — segunda sesión consecutiva sin conexión de TI. Se aclaró el rol de la célula: no necesariamente desarrolla aquí, pero todo proyecto de alto riesgo (tributario, legal, financiero, flujo de dinero) debe tener visibilidad centralizada en esta mesa." },
          { type: "p", text: "Se diferenció el proyecto Apolo (automatizaciones internas de procesos, sponsor gerencia) de la célula Back Office: lo que conecta con producto (facturación, exógena, T&C) se trae a esta célula; lo puramente operativo interno se resuelve por Apolo." },
        ],
        acciones: [
          { owner: "Marlon", texto: "agendar sesión con TI para sincronizar los avances de Exógena con la célula." },
          { owner: "José Giraldo", texto: "asistir a la siguiente reunión de seguimiento — su presencia es vital para la alineación con TI. Si no puede, delegar a alguien de TI con contexto." },
        ],
      },
      {
        titulo: "🪪 Sumsub — Flujo Web SDK alineado",
        badge: "✅ Avance técnico",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Buen avance: reunión con Sumsub realizada. El flujo de validación vía Web SDK quedó alineado — el usuario entra directo al WebSDK de Sumsub, evitando errores de digitación. Paula y Juan Camilo presentaron el flujo de los posibles escenarios tras alinearse con María. Sumsub queda a la espera de que Compliance y Financiero terminen de pasar la información (matriz de riesgo y formularios, ya compartidos por Jonatan vía Telegram)." },
          {
            type: "list",
            label: "📌 Decisiones y temas abiertos:",
            items: [
              "Revalidación periódica (mensual/trimestral/semestral) es opcional, configurable según perfil de riesgo — no obligatoria.",
              "Jonatan solicitó a Sumsub el detalle de costos por actividad para proyectar impacto financiero antes de decidir frecuencia.",
              "Dos flujos distintos: usuarios nuevos (validación al registrar) y usuarios antiguos (envío por lotes/segmentos priorizados por volumen de órdenes o wallet).",
            ],
          },
          { type: "p", text: "Debate sobre edición de datos de facturación: cada modificación implica costo de revalidación. Mónica fue enfática: los cambios casi siempre buscan beneficios tributarios o evadir reportes — no puede quedar a libre voluntad del usuario. Jonatan propuso usar la fricción a favor: una capa de validación al cambiar datos, sin eliminar el acceso a la plataforma. Juan Camilo sugirió que el cambio de campos críticos (cédula, correo) genere alerta interna." },
          { type: "p", text: "4 frentes de análisis financiero pendientes: (1) costo de dejar habilitada la edición libre de datos de facturación, (2) costo de validar el segmento de usuarios antiguos, (3) evaluar si los 6 meses de bloqueo de datos personales en Colombia deben ajustarse, (4) revalidación periódica (mensual/trimestral/semestral)." },
        ],
        acciones: [
          { owner: "Jonatan", texto: "recibir de Sumsub el detalle de costos por actividad de validación para proyectar impacto financiero." },
          { owner: "Mónica + equipo financiero", texto: "analizar y compartir costos de edición libre, validación de usuarios antiguos por lotes, y ajuste de los 6 meses de bloqueo de datos personales." },
        ],
      },
      {
        titulo: "🧾 Informes Ecuador y Chile",
        badge: "✅ En QA",
        color: "#10B981",
        blocks: [{ type: "p", text: "Paula sigue haciendo push con John Dairo. Ya está en pruebas (QA) la corrección de los campos faltantes (dirección y teléfono). Se espera salida confirmada." }],
      },
      {
        titulo: "🇦🇷 Facturación Argentina — Decisión de alcance",
        badge: "Desarrollo",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Decisión clave: lanzar Argentina IGUAL que Chile y Ecuador (sin el botón de exportar desde el panel admin), para no alargar el desarrollo con un servicio nuevo que ni siquiera existe en los demás países. Lina confirmó que el reporte actual desde Órdenes, más la corrección de campos en curso, es suficiente para avanzar." },
          { type: "p", text: "El desarrollador está revisando criterios de aceptación. La fecha de entrega dependía de si se incluía o no el botón de exportación — ya descartado." },
        ],
        acciones: [
          { owner: "Paula", texto: "obtener de TI una fecha estimada (con rango) para el lanzamiento de Argentina." },
          { owner: "Marlon", texto: "solicitar que todo proyecto tecnológico entregue estimaciones con rango (ej. \"1 a 2 meses\"), replicando la práctica de la célula de logística." },
        ],
      },
      {
        titulo: "🔒 Bloqueo de wallet — Argentina",
        badge: "⚠️ Riesgo tributario y legal",
        color: "#EF4444",
        blocks: [
          { type: "callout", tone: "danger", label: "🚨 Por qué es grave", text: "Sin datos de facturación, Dropi deja de facturar y de pagar impuestos (IVA, renta) — riesgo tributario, legal y penal. En Chile el tributarista advirtió pérdida fiscal por este motivo; en Argentina hubo dinero bloqueado en el banco por falta de facturas (riesgo de lavado)." },
          { type: "p", text: "DECISIÓN: fase pedagógica corta (1 semana — banners, comunicación) y luego bloqueo para quienes no actualicen. Argentina sale con un switch configurable (mejora respecto a los demás países) que activa o desactiva el bloqueo de wallet, retiros y transferencias. Aplica solo a usuarios existentes — los nuevos se validan desde su primera orden." },
          { type: "p", text: "Mónica aclaró: el bloqueo no le niega el dinero al usuario, solo exige actualizar datos antes de retirar — comparable a actualizar una clave dinámica bancaria." },
          { type: "p", text: "Lección de Ecuador (Lina): cuando se lanzó sin bloqueo activo, muchos usuarios completaron el formulario pero quedaron en zona gris — ni aprobados ni rechazados — sin bloquearse." },
        ],
        acciones: [
          { owner: "Paula", texto: "verificar con el desarrollador que el proceso de aprobación/rechazo de datos de facturación en Argentina funcione correctamente antes de iniciar la campaña de expectativa." },
          { owner: "Marlon", texto: "invitar a Legal (Jonatan) a preparar T&C / políticas ante el riesgo de que un usuario se niegue completamente a dar sus datos." },
        ],
      },
      {
        titulo: "📜 T&C — Ecuador y Chile",
        badge: "✅ Confirmado por Soporte TI",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Soporte TI confirmó que los links de T&C y Política de Privacidad ya redirigen correctamente a las landing de Ecuador y Chile (ya no a Colombia)." },
          { type: "p", text: "Pendiente Argentina: falta el link de Política de Privacidad (el de T&C ya se pasó a tecnología). Jonatan se comprometió a gestionarlo hoy mismo con el equipo de Argentina para evitar el bucle de redirección al home." },
        ],
        acciones: [{ owner: "Jonatan", texto: "gestionar hoy el link de Política de Privacidad de Argentina con el equipo de tecnología." }],
      },
      {
        titulo: "🇻🇪 Botón flotante Venezuela",
        badge: "En curso",
        color: "#F59E0B",
        blocks: [{ type: "p", text: "Código de activación ya entregado. Paula hace seguimiento diario, pendiente de confirmación final por parte de Jhainey." }],
      },
      {
        titulo: "🔑 CAS México",
        badge: "Definición",
        color: "#0EA5E9",
        blocks: [{ type: "p", text: "Ya gestionado, listo para entrar al Dropi Score como épica. Material de marketing ya entregado para ejecutarse." }],
      },
      {
        titulo: "💳 Confío México",
        badge: "Definición",
        color: "#F59E0B",
        blocks: [{ type: "p", text: "Víctor (CEO Confío) aún no confirma la salida. Juan Camilo le compartió la épica; Víctor quedó en validar el avance con su equipo técnico." }],
      },
    ],
  },
  {
    id: "2026-06-19",
    fecha: "19 junio 2026",
    fechaISO: "2026-06-19",
    foco: "Resultados T&C, avance Sumsub, kickoff Argentina y Flujo del Dinero",
    temas: [
      {
        titulo: "📜 T&C — Resultados del popup en Chile y Ecuador",
        badge: "✅ Éxito en <24h",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Bug detectado: el popup quedó con botón de cerrar (X) en ambos países, generando una tasa de descarte alta en Ecuador (37,3% — 1.951 usuarios). User Pilot ya está corrigiendo: se eliminará la opción de cerrar y se volverá a mostrar únicamente a quienes lo cerraron, sin perder el repositorio de quienes ya aceptaron." },
          { type: "p", text: "✅ Ticket montado el 18 junio a Soporte solicitando actualización de links legales en Dropi Chile y Dropi Ecuador." },
        ],
        acciones: [
          { owner: "Paula", texto: "dar seguimiento a User Pilot para corregir el bug del botón de cerrar y volver a mostrar el popup a quienes lo descartaron." },
          { owner: "Paula", texto: "continuar a la espera de respuesta de TI (José) sobre el proceso para actualizar los links internos que aún apuntan a Colombia." },
        ],
      },
      {
        titulo: "🪪 Sumsub — Matriz de riesgo y datos de facturación por país",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Jonatan y Juan Camilo ya verificaron la matriz de riesgo para los filtros de validación por país. Colombia ya está estructurada; se está proyectando para Guatemala, Ecuador, Chile y Argentina según la priorización. Pendiente que Sumsub envíe el formato exacto en el que necesitan recibir la información, para migrar lo ya construido." },
          { type: "p", text: "Financiero (Lina, con apoyo de Juan Camilo) levantó la documentación de datos de facturación requeridos por país: la validación se hace según el país de origen / nacionalidad del usuario, no según el país donde factura. Construido con los equipos tributarios locales." },
          {
            type: "list",
            label: "📌 Decisiones clave de gobernanza de datos:",
            items: [
              "Compliance: migrar a Dropi toda la data que hoy tiene Coloca Payments con Sumsub, para no perder validaciones ya hechas.",
              "Toda la información del usuario quedará tanto en Dropi como en el backoffice de Sumsub (OCR). Contractualmente, los datos no pueden quedar de forma indefinida en Sumsub — al finalizar el contrato la base debe devolverse a Dropi.",
              "Reto pendiente: definir con José qué tan amplia debe ser la base de datos de Dropi para soportar todos los tipos de documento que Sumsub puede traer de cualquier país.",
            ],
          },
        ],
        acciones: [
          { owner: "Equipo", texto: "reunión con Jonatan para alinearnos con respecto a los documentos requeridos por Sumsub." },
          { owner: "Jonatan", texto: "consultar por Telegram a Sumsub el formato exacto requerido y el tiempo estimado para montar flujos y Web SDK." },
          { owner: "Equipo", texto: "una vez enviados los formatos requeridos por Sumsub y obtener los links, montar un popup de cuentas bancarias (ya validado en otros 2 países), antes del flujo completo de KYC/KYB." },
          { owner: "Jonatan", texto: "coordinar por correo fechas y entregables de las nuevas mesas operativas técnicas (Legal + Financiero + Compliance + Producto)." },
          { owner: "Financiero (liderado por Legal)", texto: "iniciar construcción de la política de facturación formal de Dropi." },
        ],
      },
      {
        titulo: "🇦🇷 Facturación Argentina — Primer weekly técnico",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Primera sesión técnica con el equipo de desarrollo (Gustavo, Jordán, Mauricio) liderada por José. Se resolvieron dudas del formulario: el componente \"subir documento\" debe depender de DOS campos (tipo de persona + condición frente al IVA), no solo uno — corrección hecha en vivo sobre el Figma. Paula compartió la matriz exacta de documentos requeridos por combinación de campos." },
          { type: "p", text: "Lanzamiento en dos fases: Fase 1 (sin bloqueos financieros, solo alertas informativas sobre el estado del formulario) → Fase 2, tras una gavela de 8-15 días sin definir aún (bloqueo activo de transferencias entre wallets para quienes no completen datos)." },
        ],
        acciones: [
          { owner: "Equipo técnico (José, Gustavo, Mauricio, Jordán)", texto: "entrar en desarrollo activo." },
          { owner: "Equipo", texto: "definir en el camino el mecanismo técnico final del switch de bloqueo (fecha programable vs. true/false)." },
        ],
      },
      {
        titulo: "💰 Automatización de Conciliaciones — Flujo del Dinero",
        color: "#8B5CF6",
        blocks: [
          { type: "p", text: "Proyecto que arrancó con poca visibilidad — solo Fernando tenía el contexto completo y no había sido transferido a Back Office ni a TI. Está pausado: Fernando se ocupó del tema IAS. Se acordó que Fernando transfiera el conocimiento a Paula (Producto) y a TI." },
          {
            type: "list",
            label: "Tres frentes identificados:",
            items: [
              "Dropi ↔ Billions: ya desarrollado del lado de Dropi — antes de pagar, Billions consulta a Dropi el estado del pago. Pendiente coordinar la conexión técnica final con Billions (documentación, no desarrollo adicional).",
              "Dropi ↔ Cobre: valida que montos y personas correspondan a lo mapeado, una vez Billions paga vía Cobre (bancos nacionales en Colombia).",
              "Plataformas externas (Simetrik): cubre Payoneer, Global66 y PayPal. En etapa de viabilidad — demo ya cumplió requerimientos, decisión de contratación en manos de Mónica y Cristian.",
            ],
          },
          { type: "p", text: "Pendiente de alcance: no está claro si los pagos a bancos nacionales de otros países (ej. Banco Pichincha Ecuador) están dentro del proyecto. Laura Mejía (Tesorería) tiene esa información." },
        ],
        acciones: [
          { owner: "Paula", texto: "consultar con Mónica el estado de la contratación de Simetrik para definir el alcance tecnológico." },
          { owner: "Paula", texto: "investigar con Fernando qué información falta para completar el entendimiento de las conciliaciones Dropi-Billions-Cobre." },
          { owner: "Fernando", texto: "transferir toda la documentación y contexto técnico del proyecto." },
          { owner: "Fernando", texto: "coordinar con Billions la conexión técnica final del frente Dropi-Billions." },
          { owner: "Paula + Juan Camilo", texto: "actualizar el estado real del proyecto en Jira ('Automatización de Conciliaciones'), dejando constancia de cada frente." },
          { owner: "Paula", texto: "definir con Laura Mejía si los pagos internacionales están dentro del alcance del proyecto." },
        ],
      },
      {
        titulo: "🇻🇪 Botón flotante — Dropi Venezuela",
        color: "#0EA5E9",
        blocks: [{ type: "p", text: "Fecha tentativa de salida confirmada con Marlon: 29 y 30 de agosto. Ya se puede ir gestionando con María el botón." }],
      },
    ],
  },
  {
    id: "2026-06-12",
    fecha: "12 junio 2026",
    fechaISO: "2026-06-12",
    foco: "Urgencia regulatoria T&C, Sumsub popup, facturación Argentina y mini proyectos",
    temas: [
      {
        titulo: "🚨 Alerta regulatoria de la semana",
        color: "#EF4444",
        blocks: [
          { type: "p", text: "Ecuador tiene requerimiento del SRI con fecha límite 18 de junio. Chile lleva 6 meses de incumplimiento normativo. T&C pasa a prioridad máxima junto con Sumsub — ambos avanzan con plan provisional (User Pilot) y plan definitivo (desarrollo TI) en paralelo." },
        ],
      },
      {
        titulo: "📜 T&C y Política de Privacidad — Ecuador y Chile",
        badge: "⚠️ Fecha límite 18 jun",
        color: "#EF4444",
        blocks: [
          { type: "p", text: "Chile ya tiene popup activo vía User Pilot: 49.000 veces mostrado, 47.000 usuarios que aceptaron. Ecuador no tiene User Pilot instalado — hay que implementarlo desde cero. Se acordó solución en dos velocidades." },
          { type: "p", text: "Plan provisional (urgente): User Pilot para Chile y Ecuador esta semana. Legal aceptó el riesgo de que los datos queden en base externa ante la urgencia del SRI. La aceptación se registra con clic en 'Aceptar' — válido bajo ley de mensajes de datos. MFA obligatorio ya activo refuerza la identificación del usuario." },
          { type: "p", text: "Estructura del nuevo popup acordada: un solo flujo nuevo en User Pilot (no modificar el existente) con dos links separados — T&C y Política de Privacidad. Un solo clic de aceptación es válido para ambos documentos. Todos los usuarios, incluidos los que ya aceptaron la primera versión, verán el nuevo popup. El correo de notificación también lo gestiona Laura desde User Pilot." },
          { type: "p", text: "Alcance: prioridad esta semana Ecuador y Chile. Resto de países: semana del 16 de junio." },
          { type: "callout", tone: "danger", label: "Bloqueante activo", text: "Los links de las landing de T&C y Política de Privacidad no existen para Ecuador y otros países — todos redirigen a Colombia. Legal debe solicitar su creación a Juan Peña (webmaster) hoy." },
        ],
        acciones: [
          { owner: "Andrés (Legal)", texto: "enviar hoy correo a Juan Peña / Grow Marketing solicitando creación de landings de T&C y Política de Privacidad para Ecuador y Chile con URLs independientes por país." },
          { owner: "Andrés (Legal)", texto: "una vez tenga los links, enviarlos a Laura Torres con especificaciones del popup (copy y links por país y documento)." },
          { owner: "Andrés (Legal)", texto: "semana del 16 junio, enviar segundo correo a Laura con links del resto de países para despliegue global." },
          { owner: "Juan Camilo", texto: "escribir hoy a Luisa para definir el flujo correcto de publicación de landings — ¿directamente con Juan Peña o escala a TI?" },
          { owner: "Paula", texto: "escribir hoy a José para que TI confirme si la actualización de links internos de la plataforma (módulo facturación + pantalla de registro) va por soporte o requiere desarrollo." },
          { owner: "Laura Torres", texto: "una vez reciba los links de Legal, montar el popup nuevo en User Pilot para Ecuador y Chile esta semana. Preparar correo de notificación a usuarios." },
        ],
      },
      {
        titulo: "🪪 Sumsub — Sesión de activación de flujos",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "El popup de Guatemala y Panamá usa flujos de ColocaPayments (que usa Sumsub), no flujos propios de Dropi. Para replicarlo en Chile, Ecuador y Argentina, se necesita crear flujos propios de Dropi en Sumsub — lo cual requiere una sesión técnica con el equipo de Sumsub. Esta sesión es el punto de activación: de ahí salen los links de KYC y KYB para montar los popups por país." },
          { type: "callout", tone: "info", label: "📌 Lo que debe pasar antes de la sesión de Sumsub (12 junio)", text: "Legal, Financiero y Antifraude deben llegar con los datos requeridos por país (KYC persona natural y KYB persona jurídica) ya definidos y alineados entre las tres áreas. Próximo weekly: Producto presenta propuesta de diseño del flujo KYC/KYB a Legal, Financiero y Antifraude para validación y ajustes." },
        ],
        acciones: [
          { owner: "Jonatan", texto: "coordinar sesión con Sumsub para el 11 junio por Google Chat. Objetivo: configurar flujos propios de Dropi y obtener links para popups por país." },
          { owner: "Legal + Financiero + Antifraude", texto: "llegar a la sesión de Sumsub con los datos requeridos por país (KYC y KYB) ya definidos." },
          { owner: "Paula + Diseño", texto: "presentar propuesta visual del flujo KYC/KYB en el próximo weekly para validación de las tres áreas." },
          { owner: "Equipo", texto: "una vez salgan los links de Sumsub, coordinar con Producto el montaje de popups para Chile, Ecuador y Argentina." },
        ],
      },
      {
        titulo: "✅ Update — Reunión con Sumsub realizada (11 junio)",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Sumsub enviará los formatos para diligenciar la matriz de riesgos, los flujos de validación y las reglas por cada uno. El proceso se llevará a cabo desde el área admin de Sumsub. Se definió Telegram como canal de comunicación directa con el equipo de Sumsub." },
          { type: "callout", tone: "info", label: "📌 Lo que sigue tras la reunión", text: "Diligenciar la matriz de riesgos y los flujos de validación con los formatos que enviará Sumsub. Legal, Financiero y Admin deben alinear los datos requeridos por país (KYC persona natural y KYB persona jurídica) para completar los formatos." },
        ],
      },
      {
        titulo: "🧾 Facturación Argentina — Desarrollo inicia esta semana",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "José confirmó que la arquitectura está lista y el desarrollo inicia esta semana (martes o miércoles). Una vez arranque, dará una fecha estimada de entrega. Desde Producto ya se coordina el plan de lanzamiento: campaña de expectativa, cuenta regresiva y coordinación con Marketing." },
          { type: "p", text: "Intercom Venezuela: siguiente proyecto rápido. Se ejecuta con el mismo proceso que Intercom Costa Rica, coordinado con Marlon el cual indica que hay un bloqueo con la fluctuación de la moneda y no han dado fecha de solución. Por tanto no hay fecha de lanzamiento establecido, una vez Marlon sepa algo, nos comunica." },
        ],
        acciones: [
          { owner: "José", texto: "iniciar desarrollo esta semana y comunicar fecha estimada de entrega al grupo." },
          { owner: "Paula + Marlon + Juan Camilo", texto: "agendar reunión para definir canal de soporte de Argentina en Intercom (tutorial o manual)." },
          { owner: "Michel", texto: "continuar preparación del plan de lanzamiento — campaña de expectativa y coordinación con Marketing." },
        ],
      },
    ],
  },
  {
    id: "2026-06-04",
    fecha: "4 junio 2026",
    fechaISO: "2026-06-04",
    foco: "Validación de identidad Sumsub, facturación Argentina, conciliaciones y mini proyectos",
    temas: [
      {
        titulo: "🪪 Sumsub — Diseño de flujo unificado y Plan B activo",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Propuesta de producto alineada con Legal y Financiero: unificar los dos formularios actuales (datos personales + facturación) en uno solo. El usuario indica desde el inicio si es persona natural o jurídica → el sistema lanza KYC o KYB en Sumsub → los datos validados se precargan automáticamente en Dropi. Colombia tiene flujo diferencial: persona natural sigue con Truora, persona jurídica (KYB) va a Sumsub. Este punto se revisó con José el 4 de junio." },
          {
            type: "list",
            label: "📌 Decisiones clave de la semana:",
            items: [
              "Cada modificación de datos de facturación implica una nueva validación en Sumsub (costo adicional). La frecuencia de cambios permitidos debe ser una regla de negocio acordada entre Legal, Financiero y Producto.",
              "Usuarios existentes sin validar (Chile, Ecuador, Argentina, Perú, Guatemala) no pueden revalidarse masivamente sin base legal — requieren aceptación de T&C y política de privacidad vigente por país.",
              "Priorización de validaciones: NO validar masivamente desde el inicio. Priorizar por riesgo: usuarios con quejas de estafas, proveedores con fraudes, montos altos en wallet.",
              "Migración Truora → Sumsub confirmada: usuarios ya validados en Truora no necesitan revalidarse. Sumsub puede recibir archivo plano con datos históricos.",
            ],
          },
          { type: "p", text: "Plan B — Popup User Pilot (activar esta semana): alerta no bloqueante que invita al usuario a validarse en Sumsub. Si acepta, lo lleva al Web SDK de Sumsub. Si lo cierra, continúa normal. Solución de front en ~2 días sin desarrollo de TI. Ya probado y funcionando en Guatemala." },
          { type: "p", text: "Plan B-2 — Sumsub como backoffice manual: Financiero y compliance cargan manualmente datos de usuarios en Sumsub para obtener validación y consultar listas internacionales de actividad ilícita. Permite tomar acción manual (bloqueo, baja) antes de que salga la integración técnica." },
        ],
        acciones: [
          { owner: "Paula", texto: "reunirse hoy (4 junio) con José para revisar los 4 flujos del proyecto y el formulario unificado desde la perspectiva técnica." },
          { owner: "Paula", texto: "reunirse esta semana con el equipo de diseño para mostrar la propuesta y avanzar a nivel visual." },
          { owner: "Paula", texto: "exportar en PDF el flujo propuesto KYC/KYB y compartirlo con Jonatan, Lina y Andrés Herrera para aportes antes del siguiente weekly." },
          { owner: "Paula", texto: "mantenerse en contacto con Camilo (Sumsub) para confirmar parametrización de campos por API." },
          { owner: "Juan Camilo", texto: "liderar levantamiento del proceso operativo para usuarios existentes sin validar — reunirse con Legal y Financiero, definir criterios de priorización y construir el flujo paso a paso. Definir criterios de a qué usuarios mostrárselo y pasar instrucciones a la persona de User Pilot." },
          { owner: "Jonatan + Andrés Alcedo + Lina", texto: "revisar flujo compartido por Paula, definir módulos que se activan por tipo de usuario, qué campos se parametrizan y cuáles activarán nueva validación al modificarse. Compartir resultado a Paula lo antes posible." },
          { owner: "Jonatan", texto: "avanzar en paralelo con políticas de privacidad de Guatemala, Chile, Argentina y Ecuador — sin política vigente no hay base legal para validar." },
          { owner: "Marlon + GrowOps", texto: "definir proceso operativo Plan B-2 — criterios de riesgo para validación manual en Sumsub. Coordinar con Andrés Herrera el flujo de acción cuando un usuario aparece en listas ilícitas." },
        ],
      },
      {
        titulo: "🧾 Facturación Argentina — Handoff a TI completado",
        badge: "Desarrollo",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Handoff al equipo de TI completado el lunes 2 de junio. A la espera de confirmación de José o algún desarrollador sobre la fecha de inicio. Michel Pino se encuentra preparando el plan de lanzamiento y pasos a seguir del proyecto." },
        ],
        acciones: [
          { owner: "José", texto: "confirmar fecha de inicio de desarrollo del módulo de Argentina y comunicar al grupo." },
          { owner: "Michel", texto: "continuar preparación del lanzamiento y pasos a seguir del proyecto." },
        ],
      },
      {
        titulo: "🔄 Conciliaciones — Simetric + TI (Fernando)",
        badge: "Definición",
        color: "#8B5CF6",
        blocks: [
          { type: "p", text: "Simetric se incorpora para conciliar retiros y recargas a nivel de aplicativos. Los bancos nacionales siguen siendo gestionados directamente por TI (Fernando). José retoma el 4 de junio la contextualización del proyecto con Fernando para reportar el estado al grupo." },
        ],
        acciones: [{ owner: "José", texto: "retomar con Fernando el estado del proyecto de conciliaciones y reportar avance al grupo de Back Office hoy 4 junio." }],
      },
      {
        titulo: "💳 Confío Pagos — México (SPEI)",
        badge: "Definición",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Reunión movida al viernes 6 de junio. Deben estar presentes Financiero (Lina) y Antifraude (Andrés Herrera) para alinear los bloqueos de integración. Los T&C de Confío ya existen — tropicalizarlos a México es un ajuste puntual, no un bloqueante." },
        ],
        acciones: [{ owner: "Juan Camilo (Growth ops)", texto: "coordinar asistencia de Lina y Andrés Herrera para la reunión del viernes 6 de junio con Víctor (Confío)." }],
      },
      {
        titulo: "🔑 CAS — TIUI México y STARKEN Chile",
        badge: "✅ Lanzamiento formal esta semana",
        color: "#10B981",
        blocks: [{ type: "p", text: "Llevan una semana en producción. Esta semana se hizo el lanzamiento formal con comunicación en redes sociales para empezar a recibir más casos y completar la capacitación de operarios." }],
      },
    ],
  },
  {
    id: "2026-05-28",
    fecha: "28 mayo 2026",
    fechaISO: "2026-05-28",
    foco: "Sumsub en producción, informes de facturación, CAS, MFA y Confío",
    temas: [
      {
        titulo: "🔑 CAS — TIUI México y STARKEN Chile",
        badge: "✅ En producción",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Habilitación completada el martes 26 de mayo. Hellen inició el proceso de creación de usuarios para informar a las transportadoras. Comunicación oficial programada para el 2 de junio." },
        ],
        acciones: [
          { owner: "Hellen", texto: "continuar proceso de creación de usuarios para las transportadoras." },
          { owner: "Laura Torres", texto: "preparar comunicación de lanzamiento para salir el 2 de junio." },
        ],
      },
      {
        titulo: "🔐 MFA Obligatorio",
        badge: "✅ En producción",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Flujo de MFA obligatorio desplegado en producción para todos los usuarios. El switch que lo activaba de forma opcional fue removido. Video tutorial listo, pendiente de ajustes por parte del equipo de Marketing." },
        ],
        acciones: [{ owner: "Marketing", texto: "realizar ajustes al video tutorial del MFA para publicación." }],
      },
      {
        titulo: "🪪 Sumsub KYC/KYB/AML — Negociación cerrada, inicio de ejecución",
        badge: "✅ Contrato firmado",
        color: "#10B981",
        blocks: [
          { type: "p", text: "Jonatan confirmó que el ciclo de negociación con Sumsub cerró esta semana. Se contrató una bolsa tipo sombrilla que incluye KYC, KYB, Background Check y AML, acordada según las necesidades y proyección de crecimiento de Dropi. José confirmó que no tiene objeciones técnicas y está listo para arrancar la integración en cuanto estén definidos la épica y el flujo." },
          { type: "callout", tone: "warning", label: "🚨 Plan B activo — Popup inmediato mientras avanza integración técnica", text: "Chile, Ecuador y Argentina no pueden esperar la integración completa (puede tomar meses). Esta semana Marlon define el plan de despliegue de popup replicando el modelo de Guatemala, donde ya funciona en menos de 2 días vía User Pilot. Además, los datos de facturación ya recogidos (Ecuador, Chile) se llevarán a Sumsub como backoffice manual para validar usuarios antes del lanzamiento técnico." },
          { type: "p", text: "Transición Truora → Sumsub: Truora seguirá activa en Colombia durante todo este año (contrato renovado). Sumsub cubre los nuevos países y la expansión. Migración de usuarios ya validados en Truora a Sumsub confirmada como posible — sin reprocesos para el usuario." },
          { type: "p", text: "Formulario unificado: no es factible precargar datos personales en facturación por particularidades tributarias por país. Se propone un formulario unificado que detecte automáticamente si el usuario es persona natural o jurídica y ejecute KYC o KYB en el mismo paso. Riesgo: usuarios que ponen datos de terceros en facturación — el flujo debe contemplarlo." },
          { type: "p", text: "⚠️ Chile urgente: carteras rojas y fraudes activos. 📅 Reunión con Truora (Elisa): viernes 29 de mayo, 2 p.m. 📅 Reunión con Jonatan (compliance): 28 de mayo." },
        ],
        acciones: [
          { owner: "Marlon", texto: "definir esta semana el plan de despliegue del popup de Sumsub para Chile (y países críticos), replicando modelo Guatemala." },
          { owner: "Marlon", texto: "convocar mesas operativas para llevar datos de facturación de Ecuador y Chile a Sumsub como backoffice manual. Incluir a Andrés Herrera en esas mesas (antifraude)." },
          { owner: "Paula", texto: "enviar a Jonatan hoy el documento con preguntas de reglas de negocio para la reunión del 28 de mayo." },
          { owner: "Paula", texto: "agendar reunión con José Giraldo para revisar API de Sumsub (qué se envía/recibe) y planear la experiencia de usuario." },
          { owner: "Jonatan", texto: "acceder hoy al demo de Sumsub, explorar flujos y llegar con respuestas preparadas a la reunión del 28 de mayo con Paula." },
          { owner: "José", texto: "reunirse con Paula esta semana para revisión técnica de la API de Sumsub. Una vez listos los flujos, organizar el equipo de TI para iniciar integración formal." },
          { owner: "Paula", texto: "agregar a Andrés Herrera al grupo de Back Office en Google Chat e invitarlo a las mesas operativas de Sumsub." },
        ],
      },
      {
        titulo: "📊 Informes de facturación — Ecuador y Chile",
        badge: "Desbloqueado",
        color: "#10B981",
        blocks: [
          { type: "p", text: "El reporte de facturación que descarga Financiero para emitir facturas en Ecuador y Chile estaba incompleto — le faltan columnas de datos de facturación (teléfono, dirección), Fulfillment y comisión. El desarrollo ya estaba hecho por Stiven López, pero fue devuelto para adaptarse a la nueva arquitectura de reportes (Fluent). No estaba perdido, estaba en cola. John Dairo escaló directamente a Stiven en la reunión del 26 de mayo." },
          { type: "p", text: "Canal correcto confirmado: Financiero debe usar Soporte TI (no Dropi Score) para reportar errores o ajustes en reportes existentes. Las solicitudes de Dropi Score para este tema quedan cerradas." },
        ],
        acciones: [
          { owner: "John Dairo + Stiven", texto: "definir prioridad y dar fecha estimada de entrega a Financiero el 27 de mayo." },
          { owner: "Nataly / Lina", texto: "montar caso puntual en Soporte TI para las columnas faltantes (valor que no aparece). TI lo unificará con la tarea de Stiven." },
          { owner: "John Dairo", texto: "agendar sesión con Marlon y GrowOps para dar visibilidad del tracking de solicitudes internas (estado, cumplimiento, métricas)." },
        ],
      },
      {
        titulo: "🇲🇽 Deshabilitación módulo de facturación — México",
        color: "#0EA5E9",
        blocks: [{ type: "p", text: "Épica pasada a TI, ya quedó deshabilitado el día de hoy jueves 28 de mayo. México queda fuera del alcance del ajuste de informes de Ecuador y Chile." }],
      },
      {
        titulo: "💳 Confío Pagos — México (SPEI)",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Bloqueado por negociación comercial con Cobre — no es un problema legal. Los T&C de Confío ya existen y tropicalizarlos a México es un ajuste puntual. Se propone que Confío tenga un flujo de interacción formal con Dropi (mesas independientes) y pase por Dropi Score como cualquier proveedor de la red." },
        ],
        acciones: [{ owner: "Legal (Andrés) y Growth", texto: "coordinar mesa directa con Víctor (Confío) para verificar estado de negociación con Cobre y requisitos concretos para México." }],
      },
      {
        titulo: "🔄 Conciliación Confío / Proyecto Flujo del Dinero",
        color: "#8B5CF6",
        blocks: [
          { type: "p", text: "Andrés Herrera alertó que hoy no existe forma de conciliar lo que llega de Confío con lo registrado en plataforma y banco. Este problema se conecta directamente con el proyecto Flujo del Dinero, que busca automatizar conciliaciones y eliminar la manualidad en recargas. José tiene conocimiento parcial del estado del proyecto." },
        ],
        acciones: [{ owner: "José", texto: "confirmar con Fernando el estado del proyecto Flujo del Dinero y reportar al grupo de Back Office." }],
      },
      {
        titulo: "⚡ Mini proyectos en paralelo",
        color: "#0EA5E9",
        blocks: [
          {
            type: "list",
            label: "Tres frentes avanzando de forma ágil directamente con TI, sin bloqueos:",
            items: [
              "CAS transportadoras México y Chile: gestionados directamente con TI, ya saliendo.",
              "Errores en informes de facturación Ecuador y Chile: revisados en mesa con TI el 26 de mayo, ya en manos de Soporte TI para corrección.",
              "Deshabilitación módulo facturación México: épica pasada a TI, ya en producción.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2026-05-21",
    fecha: "21 mayo 2026",
    fechaISO: "2026-05-21",
    foco: "Validación de identidad KYC/KYB, facturación Latam, CAS y módulos operativos",
    temas: [
      {
        titulo: "🪪 Integración Sumsub — Avance y definición de flujos",
        badge: "Definición",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Semana de avances importantes en exploración. Producto accedió al demo de Sumsub y revisó flujos con María. Se documentó el mapeo en Figma. TI (José) recibió APIs y documentación — en revisión técnica, con cuello de botella por disponibilidad de Mauricio (desarrollador asignado)." },
          {
            type: "list",
            label: "Posible repriorización por país — Legal confirmó que la iba a revisar y compartir nuevamente:",
            items: [
              "#1 Colombia — KYB (personas jurídicas) para retiros y facturación",
              "#2 Guatemala — KYC y KYB para retiros (subió a máxima urgencia — riesgo de cierre de cuentas bancarias)",
              "#3 Argentina — en ajustes finales con Michel (regresó de vacaciones); pendiente evaluar vs. Guatemala",
            ],
          },
          { type: "p", text: "Se identificaron 4 flujos del proyecto: (1) Validación inicial KYC al registrarse, (2) Datos de facturación, (3) Edición de datos personales, (4) Validación en retiros (cuenta bancaria debe coincidir con representante legal)." },
          { type: "callout", tone: "info", label: "Propuesta clave acordada", text: "Anclar los datos de facturación desde la validación de identidad inicial para evitar doble formulario. Legal apoyó la viabilidad legal. Pendiente validación con equipo de Financiero." },
          { type: "callout", tone: "warning", label: "Problema detectado en retiros", text: "Hoy Dropi NO valida si la cuenta bancaria registrada corresponde a la persona que hace el retiro, ni si es natural o jurídica. Esto es lo que Legal exige corregir." },
          { type: "p", text: "Escenarios críticos pendientes de definir: ¿qué ve el usuario si interrumpe la validación? ¿Qué se bloquea si falla? ¿Cuántos reintentos se permiten? ¿Cómo maneja Sumsub un usuario colombiano operando en Argentina con correo diferente?" },
          { type: "p", text: "Aprendizaje Truora aplicable: no comprometer fechas hasta tener el flujo completo validado por Legal, TI, Producto y Diseño." },
        ],
        acciones: [
          { owner: "Paula", texto: "comunicar a María que el proyecto requiere más tiempo de análisis — gestionar expectativas y no comprometer fechas." },
          { owner: "Paula", texto: "compartir link de Coloca Payments con Juan Camilo para validar que Sumsub funciona en iOS." },
          { owner: "Paula + TI (José)", texto: "gestionar activamente viabilidad técnica de integración. Sin ese input no se distribuye trabajo de diseño ni se definen fechas." },
          { owner: "Legal", texto: "actualizar matriz de priorización con Guatemala como prioridad alta y enviarla. Paula / María revisan." },
          { owner: "Marlon", texto: "socializar con Financiero la propuesta de anclar datos de facturación desde la validación inicial." },
          { owner: "Paola Angulo", texto: "compartir flujos de Truora usados en implementación anterior para no partir de cero." },
          { owner: "Kevin D. Paternina", texto: "continuar rediseño de login y registro (look & feel) sin involucrarse aún en flujos de validación multipaís." },
          { owner: "Luisa, José, María, Marlon", texto: "reunión 21 mayo para evaluar carga Dropi Score y liberar a José del 10-20% de carga." },
          { owner: "José Giraldo", texto: "reportar viabilidad técnica Sumsub en el chat — sin esperar reunión semanal." },
          { owner: "Paula", texto: "mapear flujos completos de validación (happy path + alternos) antes de comprometer fechas." },
          { owner: "Paula", texto: "dar contexto a Michel sobre estado del proyecto — compartir grabaciones." },
        ],
      },
      {
        titulo: "🧾 Datos de Facturación — Argentina",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Michel regresó de vacaciones. Proyecto en ajustes finales de diseño. Con la repriorización de Guatemala, queda pendiente decidir si Argentina continúa o si los recursos se redirigen. Decisión debe tomarse esta semana antes de que Michel entregue los ajustes finales." },
        ],
        acciones: [{ owner: "Paula / Michel", texto: "continuar ajustes finales del módulo. Confirmar con Legal y María si Argentina sigue o cede recursos a Guatemala." }],
      },
      {
        titulo: "🇲🇽 Inhabilitar módulo de facturación — México + ajuste de bloqueos",
        color: "#0EA5E9",
        blocks: [
          { type: "p", text: "Épica creada y lista para handoff con TI. Ya se había acordado la mejor forma de proceder: crear la épica para que TI cree sus propias tareas. Pendiente socializar con Financiero." },
        ],
        acciones: [{ owner: "Paula", texto: "hacer handoff de la épica con TI y socializar con Financiero." }],
      },
      {
        titulo: "🔑 Activar transportadoras CAS — TIUI México y STARKEN Chile",
        badge: "Desarrollo",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Épica e historias de lanzamiento creadas y amarradas al proyecto en Dropi Score. Pendiente hacer handoff con TI para iniciar desarrollo." },
        ],
        acciones: [{ owner: "Paula", texto: "hacer handoff con TI para activar transportadoras CAS en Chile y México." }],
      },
    ],
  },
  {
    id: "2026-05-15",
    fecha: "15 mayo 2026",
    fechaISO: "2026-05-15",
    foco: "Validación de identidad, facturación Latam, conciliaciones y seguridad",
    asistentes: "Paula · Michel · Juan Camilo · Marlon · José Giraldo",
    temas: [
      {
        titulo: "🗺️ Presentación de Roadmap Backoffice — Priorización",
        color: "#0EA5E9",
        blocks: [
          { type: "p", text: "Se presentó el roadmap de la célula (heredado de Harry) con 7 proyectos activos priorizados por Dropi Score. Los proyectos con score 99 son de mayor urgencia." },
          { type: "p", text: "Proyectos activos: Automatización de recargas multipaís, Automatización de conciliaciones, Validación de identidad, Sistemas de T&C, Datos de facturación Latam, Prevención de saldos negativos y CAS." },
          { type: "p", text: "Se acordó que varios proyectos pueden correr en paralelo, pero Validación de Identidad recibe la mayor concentración de recursos de producto y TI." },
          {
            type: "list",
            label: "Notas de la sesión:",
            items: [
              "Cambio clave: Eduardo Pachón instruyó que toda coordinación con TI sea directamente con José Giraldo, quien reemplaza a Fernando como referente técnico de la célula.",
              "Se definió cuál es la prioridad máxima del equipo para enfocar la fuerza del sprint.",
            ],
          },
        ],
        acciones: [
          { owner: "Marlon + Legal", texto: "construir matriz de urgencia por país (tipo de validación necesaria y riesgo legal si no se actúa). Datos de cuántos usuarios se están validando KYC y KYB en los países donde se hace." },
        ],
      },
      {
        titulo: "🪪 Evaluación Sumsub vs. Truora",
        badge: "Definición",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Legal argumentó que tanto la automatización de recargas (USDT) como la facturación electrónica exigen KYC/KYB mínimos — la validación de identidad es el puente que los conecta. Posición acordada: usar Truora para personas naturales (infraestructura ya montada) y evaluar Sumsub para personas jurídicas y países no cubiertos." },
          { type: "p", text: "Situación por país: Guatemala: riesgo de cierre de cuentas bancarias. Ecuador: validación manual no efectiva (usuarios suben fotos irrelevantes). Argentina: operación sin legalización de ventas históricas." },
          { type: "callout", tone: "warning", label: "⚠️ Truora", text: "40% de validaciones manuales (~3.000/mes) — problema crítico que Sumsub resolvería." },
        ],
        acciones: [
          { owner: "Sumsub", texto: "habilitar cuentas Sandbox para Paula y José Giraldo esta semana." },
          { owner: "Sumsub (Fernando)", texto: "compartir documentación de API y SDK con José Giraldo para revisión técnica." },
          { owner: "José Giraldo", texto: "revisar documentación técnica e iniciar exploración del sandbox esta semana." },
          { owner: "Paula", texto: "explorar sandbox de Sumsub desde producto — validar flujos KYC y KYB para Argentina, Ecuador, Chile y México." },
          { owner: "Legal (Andrés/Jonatan)", texto: "solicitar a Sumsub matriz de capacidades por país. Atención especial: Argentina y Brasil." },
          { owner: "Legal + Sumsub", texto: "agendar sesión dedicada de KYB y reunión de seguimiento contractual (POC y bolsa de verificaciones)." },
          { owner: "José Giraldo + Fernando (Sumsub)", texto: "definir arquitectura de cuenta (clave única con workflows por país vs. subcuentas separadas)." },
        ],
      },
      {
        titulo: "🧾 Datos de Facturación — Argentina",
        badge: "Desarrollo",
        color: "#F59E0B",
        blocks: [
          { type: "p", text: "Proyecto comparte necesidad de KYC/KYB — los avances de Sumsub lo benefician directamente. Continúa el diseño del módulo con las reglas de bloqueo ya definidas (bloquear transferencias entre wallets y retiros; NO bloquear recargas ni creación de cuentas bancarias)." },
        ],
        acciones: [{ owner: "Paula / Michel", texto: "continuar diseño del módulo de Argentina. Una vez listo, pasar a desarrollo para despliegue sin bloqueo activo (Fase 1)." }],
      },
      {
        titulo: "🔄 Automatización de Conciliaciones",
        badge: "Definición",
        color: "#8B5CF6",
        blocks: [{ type: "p", text: "Puede avanzar en paralelo con menor fuerza mientras se resuelve la prioridad de validación de identidad." }],
        acciones: [{ owner: "José Giraldo", texto: "retomar con el equipo de DropiPay para avanzar en paralelo." }],
      },
      {
        titulo: "🔑 CAS — Permisos usuario hijo y nuevas transportadoras",
        badge: "✅ Error resuelto - Producción",
        color: "#10B981",
        blocks: [
          { type: "p", text: "El error de permisos del usuario hijo quedó solucionado y fue comprobado entre Soporte TI y el usuario que lo reportó." },
          { type: "p", text: "Nuevos frentes: Hellen gestionará la habilitación del CAS con Soporte TI para transportadoras TIUI México y STARKEN Chile." },
        ],
        acciones: [
          { owner: "Hellen", texto: "montar solicitud a Soporte TI para habilitar CAS a TIUI México y STARKEN Chile." },
          { owner: "Laura Torres", texto: "preparar comunicación de habilitación de transportadoras para el siguiente sprint." },
        ],
      },
      {
        titulo: "🔐 MFA Obligatorio",
        color: "#6366F1",
        blocks: [
          { type: "p", text: "Laura Torres ya montó el flujo de la campaña de expectativa de UserPilot para todos los países. Se continúa con la fecha del 20 de mayo para que todos los usuarios lo tengan obligatorio; comunicaciones está trabajando en la actualización del material anterior para tener los manuales, tutoriales, etc." },
        ],
      },
    ],
  },
];
