import type { WeeklySnapshot } from "./types";

export const snapshot: WeeklySnapshot = {
  week: "Semana 18–25 ago 2026",
  subtitle:
    "Weekly Células Brands | Seller PL-PO-PM · Emprendedores Plus entra en cierre: Producto entrega y la definición de valor/monetización pasa a Comercial y Lucho · Botánica queda como único candidato de piloto · Perfil de Marcas posterga fin de desarrollo a 15-sep pero mantiene beta el 29-sep · Combos mantiene 8-sep, con riesgo alto de perder a Facundo",
  heroBadge: "Weekly Brands · Semana 25 ago",
  heroTitle:
    "Emprendedores Plus entra en cierre — Producto entrega y Comercial + Lucho toman la definición de valor y monetización\n+ Se desbloquean las pruebas con el contrato propio de Dropi; Botánica es el único candidato de piloto\n+ Perfil de Marcas corre fin de desarrollo a 15-sep (beta 29-sep se mantiene) · Combos mantiene 8-sep con riesgo alto de perder a Facundo",
  heroStrip: [
    { label: "Emprendedores Plus", value: "🟢 En cierre", sub: "Producto entrega; valor y monetización pasan a Comercial + Lucho" },
    { label: "Piloto Emp. Plus", value: "Botánica", sub: "Único candidato; Laura Sánchez ya habló con la clienta" },
    { label: "Contrato de pruebas", value: "Dropi propio", sub: "Se desbloquean pruebas sin depender de usuarios externos" },
    { label: "Perfil de Marcas · Fin dev", value: "15-sep", sub: "Postergado desde 8-sep" },
    { label: "Perfil de Marcas · Beta", value: "29-sep", sub: "Se mantiene · 20 usuarios en 5 segmentos escalonados" },
    { label: "Combos · Producción", value: "8-sep", sub: "Se mantiene · habilitador: conexión Dropify (Shopify)" }
  ],
  insights: [
    {
      id: "ins-2026-08-25-01",
      titulo: "Emprendedores Plus entra en cierre: Producto entrega y la definición de valor/monetización pasa a Comercial y Lucho",
      descripcion:
        "En la mesa de trabajo del viernes 21 de agosto con Comercial, Producto y Laura Sánchez se concluyó que Producto cierra y entrega el proyecto. La definición de valor y el modelo de monetización pasan a Comercial y a Lucho. La célula de Brands no asume la comercialización del perfil.",
      proyecto: "EMP-PLUS",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Alto"
    },
    {
      id: "ins-2026-08-25-02",
      titulo: "Se desbloquean las pruebas de Emprendedores Plus con el contrato propio de Dropi",
      descripcion:
        "Ya no se depende de conseguir usuarios externos con contrato de transportadora: las pruebas se ejecutan con el contrato propio de Dropi. José Giraldo entrega credenciales a Francisco Velandia y Kate para que Francisco ejecute las pruebas y deje la herramienta funcional.",
      proyecto: "EMP-PLUS",
      tipo: "Hallazgo",
      tipoColor: "#94A3B8",
      impacto: "Medio"
    },
    {
      id: "ins-2026-08-25-03",
      titulo: "Botánica queda como único candidato de piloto de Emprendedores Plus",
      descripcion:
        "Comercial confirma que no tiene usuarios para traspasar. Zona Fit y Naty London no ven valor en el feature. Botánica queda como único candidato: Laura Sánchez ya habló con la clienta y está dispuesta a volver a Dropi. El feature se ofrece gratis durante la prueba, no se monetiza aún.",
      proyecto: "EMP-PLUS",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    },
    {
      id: "ins-2026-08-25-04",
      titulo: "Perfil de Marcas posterga fin de desarrollo a 15-sep pero mantiene la beta el 29-sep",
      descripcion:
        "Fin de desarrollo se corre de 8 a 15 de septiembre; entrega a QA/Producto el 16 de septiembre. La beta de Fase 1 (público controlado, 20 usuarios en 5 segmentos escalonados) se mantiene el 29 de septiembre. La fecha de producción / full release aún no está definida: depende de la validación de las Fases 1 y 2. Sin novedades técnicas de José Giraldo esta semana.",
      proyecto: "PRM-1331",
      tipo: "Riesgo",
      tipoColor: "#D97706",
      impacto: "Medio"
    },
    {
      id: "ins-2026-08-25-05",
      titulo: "El scope de migración de Perfil de Marcas queda dimensionado: 4.892 usuarios totalmente marca, +2.450 viables",
      descripcion:
        "Scope: 4.892 usuarios \"Totalmente Marca\" con órdenes propias; más de 2.450 viables para migración (>50%). Timeline global de 1.5 meses de Fase 1 a Fase 2; posteriormente se liberaría al público nuevo en Fase 3.",
      proyecto: "PRM-1331",
      tipo: "Hallazgo",
      tipoColor: "#94A3B8",
      impacto: "Alto"
    },
    {
      id: "ins-2026-08-25-06",
      titulo: "Dropi Academy para Perfil de Marcas es solo redireccionamiento, sin desarrollo nuevo de estructura",
      descripcion:
        "En reunión con Esteban se confirmó que ya existe un curso de Marcas; se pidieron los insumos para redireccionar el contenido, con entrega comprometida de hoy a mañana. El alcance es solo redireccionamiento sobre el mismo esqueleto. El canal definido para solicitudes de alcance con Tecnología es el correo electrónico. Marketing ya tiene claro que debe preparar el contenido de la nueva página de inicio de Marcas en WordPress; pendiente que Francisco Velandia entregue y socialice el tango y el video.",
      proyecto: "PRM-1331",
      tipo: "Decisión",
      tipoColor: "#D97706",
      impacto: "Bajo"
    },
    {
      id: "ins-2026-08-25-07",
      titulo: "Combos mantiene el 8-sep, con la conexión a Dropify (Shopify) como único habilitador pendiente",
      descripcion:
        "La funcionalidad de Combos ya opera. El habilitador para la salida es la conexión con Dropify (Shopify). Se notificó al equipo comercial que los tiempos de entrega están sujetos a la capacidad de Tecnología; Comercial evalúa planes temporales por si un incumplimiento de fecha impacta el compromiso con el cliente. El ownership de la contención comercial es del área comercial, no de Producto.",
      proyecto: "COM-001",
      tipo: "Hallazgo",
      tipoColor: "#94A3B8",
      impacto: "Medio"
    },
    {
      id: "ins-2026-08-25-08",
      titulo: "Riesgo alto de pérdida del cliente Facundo en Combos",
      descripcion:
        "Facundo ya inició su temporada y reporta pérdidas. El objetivo es no perderlo, pero el ownership de la contención comercial es del área comercial. José Giraldo debe reportar a Kate cualquier novedad que afecte la fecha del 8 de septiembre.",
      proyecto: "COM-001",
      tipo: "Riesgo",
      tipoColor: "#DC2626",
      impacto: "Alto"
    }
  ],
  oportunidades: [
    {
      code: "EMP-PLUS",
      name: "Emprendedores Plus · Cierre y handover a Comercial",
      status: "🟢 En cierre · Producto entrega; valor y monetización pasan a Comercial + Lucho",
      statusColor: "#16A34A",
      color: "#16A34A",
      mueve: "Cerrar y entregar el programa Emprendedor Plus dejando la herramienta funcional y probada; la definición de valor y monetización la asume Comercial",
      hipotesis: "Con el contrato propio de Dropi para pruebas ya no hace falta un usuario externo con contrato de transportadora para validar la herramienta — la validación de negocio (valor y cobro) es responsabilidad de Comercial y Lucho, no de Producto",
      gmv: "Sin fecha de beta/producción formal (proyecto heredado). Feature gratis durante la prueba, no se monetiza aún. Riesgo: sin modelo de monetización definido, sacar el feature solo suma órdenes sin retorno claro",
      avance:
        "En la mesa de trabajo del viernes 21 de agosto (Comercial, Producto y Laura Sánchez) se concluyó que Producto cierra y entrega el proyecto, y la definición de valor y monetización pasa a Comercial y a Lucho. Se desbloquean las pruebas con el contrato propio de Dropi, así que ya no se depende de conseguir usuarios externos. Comercial confirma que no tiene usuarios para traspasar; Zona Fit y Naty London no ven valor en el feature. Botánica queda como único candidato de piloto: Laura Sánchez ya habló con la clienta y está dispuesta a volver a Dropi. El feature se ofrece gratis durante la prueba. La célula de Brands no asume la comercialización del perfil.",
      next:
        "Laura Sánchez gestiona la habilitación del contrato Dropi para pruebas y lleva al comité con Lucho la discusión de monetización y recuperación de inversión. José Giraldo entrega credenciales a Francisco Velandia y Kate. Francisco Velandia ejecuta las pruebas y deja la herramienta funcional, y hace el acercamiento a Botánica una vez finalicen las pruebas internas — el piloto debe ser acotado, sin compromiso y sobre una porción mínima de la operación de la clienta. María Ossa y Kate cierran el handover formal desde Producto.",
      badge: "🟢 Handover a Comercial en curso",
      badgeColor: "#16A34A",
      metricas: {
        base: [
          { label: "Contrato de pruebas", value: "Dropi propio", sub: "Ya no se depende de usuarios externos" },
          { label: "Candidatos de piloto", value: "1", sub: "Botánica (Zona Fit y Naty London descartadas)" }
        ],
        meta: [
          { label: "Monetización", value: "Sin definir", sub: "Pasa a Comercial + Lucho; feature gratis durante la prueba" },
          { label: "Cierre desde Producto", value: "En curso", sub: "Handover formal María Ossa + Kate" }
        ],
        seguimiento: [
          { label: "Credenciales a Francisco/Kate", value: "Pendiente", sub: "Las entrega José Giraldo" },
          { label: "Acercamiento a Botánica", value: "Tras pruebas internas", sub: "Piloto acotado, sin compromiso, porción mínima de la operación" }
        ]
      }
    },
    {
      code: "PRM-1331",
      name: "Perfil de Marcas",
      status: "🔄 En desarrollo — fin de desarrollo postergado, beta se mantiene",
      statusColor: "#6366F1",
      color: "#6366F1",
      mueve: "Perfil dedicado de Marcas, separado de Proveedor → resuelve la deuda técnica del rol compartido",
      hipotesis: "Migrar primero a usuarios existentes \"totalmente marca\" (con órdenes propias) en fases escalonadas reduce el riesgo frente a abrir de una a todo el público",
      gmv: "Fin de desarrollo 15-sep (postergado desde 8-sep) · Entrega QA/Producto 16-sep · Beta Fase 1 (público controlado) 29-sep · Producción / full release sin definir (depende de la validación de Fases 1 y 2)",
      avance:
        "Fin de desarrollo se corre de 8 a 15 de septiembre; entrega a QA/Producto el 16 de septiembre. La beta de Fase 1 (público controlado, 20 usuarios en 5 segmentos escalonados) se mantiene el 29 de septiembre. Sin novedades técnicas de José Giraldo esta semana: el proceso y las fechas de beta se mantienen. Scope: 4.892 usuarios \"Totalmente Marca\" con órdenes propias; más de 2.450 viables para migración (>50%). Timeline global de 1.5 meses de Fase 1 a Fase 2; luego se liberaría al público nuevo en Fase 3. Marketing ya tiene claro que debe preparar el contenido de la nueva página de inicio de Marcas en WordPress; pendiente que Francisco Velandia entregue y socialice el tango y el video. En Dropi Academy, reunión con Esteban: ya existe un curso de Marcas y se pidieron los insumos para redireccionar el contenido (entrega comprometida de hoy a mañana). El alcance de Academy es solo redireccionamiento sobre el mismo esqueleto, sin desarrollo nuevo de estructura. El canal definido para solicitudes de alcance con Tecnología es el correo electrónico.",
      next:
        "Francisco Velandia recibe los insumos de Esteban, los envía por correo a Tecnología (José Giraldo) con el detalle de los redireccionamientos y los documenta en la HU; además entrega y socializa el tango y el video con Marketing. José Giraldo coordina la ejecución con el equipo una vez reciba el correo.",
      badge: "🟡 Fin de desarrollo corrido 7 días (8-sep → 15-sep)",
      badgeColor: "#D97706",
      metricas: {
        base: [
          { label: "Fin de desarrollo", value: "15-sep-2026", sub: "Postergado desde 8-sep" },
          { label: "Scope migración", value: "4.892 usuarios", sub: "\"Totalmente Marca\" con órdenes propias; +2.450 viables (>50%)" }
        ],
        meta: [
          { label: "Entrega QA/Producto", value: "16-sep-2026", sub: "" },
          { label: "Beta Fase 1", value: "29-sep-2026", sub: "Se mantiene · 20 usuarios en 5 segmentos escalonados" },
          { label: "Producción / full release", value: "Sin definir", sub: "Depende de la validación de Fases 1 y 2" }
        ],
        seguimiento: [
          { label: "Novedades técnicas", value: "Sin novedades", sub: "José Giraldo — proceso y fechas de beta se mantienen" },
          { label: "Dropi Academy", value: "Solo redireccionamiento", sub: "Insumos de Esteban comprometidos de hoy a mañana; sin desarrollo nuevo" },
          { label: "Contenido Marketing (WordPress)", value: "Pendiente", sub: "Francisco entrega y socializa el tango y el video" },
          { label: "Canal con Tecnología", value: "Correo electrónico", sub: "Definido para solicitudes de alcance" }
        ]
      }
    },
    {
      code: "COM-001",
      name: "Combos (Proveedores — seguimiento desde Marcas)",
      status: "🟡 En desarrollo — fecha 8-sep se mantiene, habilitador pendiente",
      statusColor: "#D97706",
      color: "#D97706",
      mueve: "Sacar Combos a producción el 8 de septiembre sin perder a los clientes que ya lo están esperando",
      hipotesis: "La funcionalidad de Combos ya opera; el único habilitador crítico para la salida es la conexión con Dropify (Shopify)",
      gmv: "Fecha de producción 8-sep, se mantiene. Habilitador: conexión con Dropify (Shopify). Los tiempos de entrega están sujetos a la capacidad de Tecnología",
      avance:
        "La funcionalidad de Combos ya opera. El habilitador para la salida es la conexión con Dropify (Shopify). Se notificó al equipo comercial que los tiempos de entrega están sujetos a la capacidad de Tecnología; Comercial está evaluando planes temporales por si un incumplimiento en fecha impacta el compromiso con el cliente. El objetivo es no perder al cliente, pero el ownership de la contención comercial es del área comercial, no de Producto. Riesgo alto de pérdida del cliente Facundo: su temporada ya inició y reporta pérdidas.",
      next:
        "José Giraldo reporta a Kate cualquier novedad que afecte la fecha del 8 de septiembre. Comercial (Juan Camilo Reina, Mayra Ramírez, Vanessa Garay, Carol Cortés, Jaime Guevara) evalúa planes temporales de contención con los clientes en riesgo.",
      badge: "🔴 Riesgo alto de pérdida del cliente Facundo",
      badgeColor: "#DC2626",
      metricas: {
        base: [
          { label: "Funcionalidad Combos", value: "Ya opera", sub: "Falta solo el habilitador de conexión" },
          { label: "Habilitador pendiente", value: "Dropify (Shopify)", sub: "Conexión requerida para la salida" }
        ],
        meta: [
          { label: "Fecha producción", value: "8-sep-2026", sub: "Se mantiene" },
          { label: "Tiempos de entrega", value: "Según capacidad de TI", sub: "Comercial evalúa planes temporales" }
        ],
        seguimiento: [
          { label: "Cliente Facundo", value: "Riesgo alto", sub: "Temporada iniciada, reporta pérdidas" },
          { label: "Contención comercial", value: "Ownership de Comercial", sub: "No de Producto" }
        ]
      }
    }
  ],
  dolores: [
    {
      frente: "Emprendedores Plus — Sin modelo de monetización definido",
      tag: "🟡 Riesgo de negocio",
      tagColor: "#D97706",
      salio:
        "Producto cierra y entrega, pero la definición de valor y monetización pasa a Comercial y Lucho y aún no existe modelo de cobro. El feature se ofrece gratis durante la prueba",
      ruta:
        "Laura Sánchez lleva al comité con Lucho la discusión de monetización y recuperación de inversión; la célula de Brands no asume la comercialización del perfil",
      rutaColor: "#D97706",
      metrica: "0 modelo de monetización definido al cierre desde Producto",
      decision: "Producto entrega la herramienta funcional; valor y monetización quedan en cancha de Comercial + Lucho"
    },
    {
      frente: "Emprendedores Plus — Un único candidato de piloto con historia previa frágil",
      tag: "🔴 Riesgo de piloto",
      tagColor: "#DC2626",
      salio:
        "Comercial no tiene usuarios para traspasar; Zona Fit y Naty London no ven valor. Botánica queda como único candidato y ya tuvo experiencias previas con Dropi — un tercer fallo la pierde",
      ruta:
        "El piloto con Botánica debe ser acotado, sin compromiso y sobre una porción mínima de su operación; el acercamiento lo hace Francisco Velandia solo tras finalizar las pruebas internas",
      rutaColor: "#DC2626",
      metrica: "1 candidato de piloto; tolerancia a fallo: 0",
      decision: "Piloto acotado con Botánica tras validar internamente la herramienta con el contrato propio de Dropi"
    },
    {
      frente: "Perfil de Marcas — Fin de desarrollo postergado y dependencias externas abiertas",
      tag: "🟡 Riesgo de cronograma",
      tagColor: "#D97706",
      salio:
        "Fin de desarrollo se corrió de 8 a 15 de septiembre. Quedan abiertas dependencias externas: insumos de Esteban para Dropi Academy y contenido de Marketing para la página de inicio en WordPress",
      ruta:
        "Beta 29-sep se mantiene. Francisco Velandia recibe los insumos de Esteban y los envía por correo a Tecnología con el detalle de redireccionamientos + los documenta en la HU; entrega y socializa el tango y el video con Marketing",
      rutaColor: "#D97706",
      metrica: "Fin de desarrollo corrido 7 días (8-sep → 15-sep); producción / full release sin definir",
      decision: "Canal definido para solicitudes de alcance con Tecnología: correo electrónico. Academy = solo redireccionamiento, sin desarrollo nuevo"
    },
    {
      frente: "Combos — Riesgo de perder a Facundo y dependencia de la capacidad de Tecnología",
      tag: "🔴 Riesgo de cliente",
      tagColor: "#DC2626",
      salio:
        "Facundo ya inició temporada y reporta pérdidas. La salida del 8-sep depende de la conexión con Dropify (Shopify) y los tiempos están sujetos a la capacidad de Tecnología",
      ruta:
        "José Giraldo reporta a Kate cualquier novedad que afecte el 8-sep; Comercial evalúa planes temporales de contención. El ownership de la contención comercial es de Comercial, no de Producto",
      rutaColor: "#DC2626",
      metrica: "1 cliente en riesgo alto de pérdida (Facundo)",
      decision: "Fecha 8-sep se mantiene; contención comercial es responsabilidad del área comercial"
    }
  ],
  resumen:
    "Reunión con Francisco Velandia, José Giraldo, Juan Sebastián Maldonado y Kate. <strong>Emprendedores Plus</strong> entra en cierre: en la mesa de trabajo del viernes 21 de agosto (Comercial, Producto y Laura Sánchez) se concluyó que Producto cierra y entrega el proyecto, y la definición de valor y monetización pasa a Comercial y a Lucho — la célula de Brands no asume la comercialización del perfil. Se desbloquean las pruebas con el contrato propio de Dropi, así que ya no se depende de usuarios externos. Comercial no tiene usuarios para traspasar y Zona Fit y Naty London no ven valor; <strong>Botánica queda como único candidato de piloto</strong> (Laura Sánchez ya habló con la clienta), con el feature gratis durante la prueba. Riesgo: Botánica ya tuvo experiencias previas con Dropi y un tercer fallo la pierde — el piloto debe ser acotado y sobre una porción mínima de su operación. En <strong>Perfil de Marcas</strong>, el fin de desarrollo se corre de 8 a 15 de septiembre (entrega a QA/Producto el 16), pero la beta de Fase 1 se mantiene el 29 de septiembre con 20 usuarios en 5 segmentos escalonados; la fecha de producción / full release sigue sin definir. Scope de migración: 4.892 usuarios \"Totalmente Marca\", más de 2.450 viables (>50%), con timeline global de 1.5 meses de Fase 1 a Fase 2. Dropi Academy será solo redireccionamiento sobre el mismo esqueleto (insumos de Esteban comprometidos de hoy a mañana) y el canal con Tecnología queda definido como correo electrónico. En <strong>Combos</strong> (seguimiento desde Marcas), la fecha del 8 de septiembre se mantiene y el único habilitador pendiente es la conexión con Dropify (Shopify); hay <strong>riesgo alto de perder al cliente Facundo</strong>, que ya inició temporada y reporta pérdidas — la contención comercial es responsabilidad del área comercial, no de Producto.",
  proximosPasos: [
    {
      titulo: "Semana del 18–25 ago 2026",
      color: "#DC2626",
      items: [
        "Laura Sánchez: gestionar la habilitación del contrato Dropi para las pruebas de Emprendedores Plus.",
        "José Giraldo: entregar credenciales a Francisco Velandia y Kate para las pruebas de Emprendedores Plus.",
        "Francisco Velandia: ejecutar las pruebas de Emprendedores Plus y dejar la herramienta funcional.",
        "Francisco Velandia: recibir los insumos de Esteban (Dropi Academy), enviarlos por correo a Tecnología (José Giraldo) con el detalle de los redireccionamientos y documentarlos en la HU.",
        "Francisco Velandia: entregar y socializar el tango y el video con Marketing para la nueva página de inicio de Marcas en WordPress.",
        "José Giraldo: coordinar la ejecución de los redireccionamientos de Academy con el equipo una vez reciba el correo.",
        "José Giraldo: reportar a Kate cualquier novedad que afecte la fecha del 8 de septiembre de Combos."
      ]
    },
    {
      titulo: "Próximos pasos críticos (por prioridad)",
      color: "#6366F1",
      items: [
        "1. Francisco Velandia → realizar el acercamiento a Botánica una vez finalicen las pruebas internas de Emprendedores Plus (piloto acotado, sin compromiso, porción mínima de la operación).",
        "2. Laura Sánchez → llevar al comité con Lucho la discusión de monetización y recuperación de inversión de Emprendedores Plus.",
        "3. María Ossa y Kate → handover y cierre formal de Emprendedores Plus desde Producto.",
        "4. Combos → asegurar la conexión con Dropify (Shopify) para la salida a producción del 8 de septiembre."
      ]
    }
  ]
};
