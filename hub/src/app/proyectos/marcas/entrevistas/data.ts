// Data curada a mano a partir de los transcripts en
// agente-delivery/Documentos/Entrevistas/ + cruce con dim_marcas.csv y
// fact_marcas.csv (corte 28-jul-2026). Mantenimiento manual: cada vez que
// llegue una entrevista nueva, se procesa el .docx y se agrega una entrada
// aquí siguiendo la misma forma.

export type OrdenMensual = {
  periodo: string; // "2026-01"
  propias: number;
  externas: number;
  tipoActivoChurn: string;
  noDocumentado?: boolean;
};

export type Contacto = {
  userId: number | null;
  email: string | null;
  telefono: string | null;
  comercialId: number | null;
  enPortafolioMarcas: boolean | null; // null = no se pudo identificar la cuenta
  categoriaComportamiento: string | null;
  comportamientoAlgoritmico: string | null;
  comunidad: string | null;
  nota?: string; // ambigüedad, cuenta secundaria, no encontrado, etc.
};

export type Entrevista = {
  id: string;
  entrevistado: string;
  marca: string;
  fechaEntrevista: string;
  archivoFuente: string;
  perfilOperativo: string; // resumen de si es 100% marca, híbrido, etc.
  contacto: Contacto;
  ordenes2026: OrdenMensual[];
  picoHistorico: { periodo: string; propias: number } | null;
  tendencia: string;
  dolores: string[];
  insights: string[];
  oportunidadesRetencion: string[];
  bauCompetitivo: string;
  bauOperativo: string[];
};

export const entrevistas: Entrevista[] = [
  {
    id: "blendit",
    entrevistado: "Nathalia Plaza (\"nathy\") + Ana María Guzmán + Erika Malagón",
    marca: "Blendit",
    fechaEntrevista: "23-jun-2026",
    archivoFuente: "Blendit & Dropi_ 2026_06_23 16_04 - Notas de Gemini.docx",
    perfilOperativo: "100% Marca — vende solo a sus propios clientes. 60% ventas vía Shopify, 40% WhatsApp (implementando Chatea Pro).",
    contacto: {
      userId: 260401,
      email: "blendit.nc@gmail.com",
      telefono: "3154044565",
      comercialId: 71445,
      enPortafolioMarcas: true,
      categoriaComportamiento: "Marcas corporativas",
      comportamientoAlgoritmico: "Evidente",
      comunidad: "COMUNIDAD ASTRA SCHOOL (604)",
    },
    ordenes2026: [
      { periodo: "2026-01", propias: 440, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-02", propias: 393, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-03", propias: 493, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-04", propias: 641, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-05", propias: 744, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-06", propias: 751, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-07", propias: 726, externas: 0, tipoActivoChurn: "Fiel" },
    ],
    picoHistorico: { periodo: "2026-06", propias: 751 },
    tendencia: "Crecimiento sostenido todo 2026 (440→751 propias/mes, +71%), pico histórico es el mes más reciente cerrado (jun-2026). Sin caídas relevantes — pequeña baja de 751→726 en jul (no cerrado).",
    dolores: [
      "Sincronización de guías Shopify↔Dropi inconsistente — obliga a descargar y reenviar guías manualmente al cliente.",
      "Novedades no se reportan automáticamente; se descubren cuando el cliente pregunta o en auditorías manuales.",
      "Deterioro del servicio de la transportadora Envía: devoluciones argumentando \"dirección no existe\" incluso con datos completos.",
      "Direcciones incompletas desde Shopify (falta apto/torre) generan devoluciones evitables.",
      "Facturación poco clara: cruzar ID de orden con factura requiere descargar y procesar archivos planos.",
    ],
    insights: [
      "El equipo dedica gran parte de su semana a responder manualmente consultas de seguimiento de guía — tarea que esperan que la plataforma resuelva.",
      "Su modelo de negocio busca relaciones de largo plazo con el cliente, distinto al modelo transaccional típico de dropshipping — por eso gestionan novedades/garantías directo por WhatsApp.",
      "Usan fulfillment externo (Súpli), con buena relación y apertura a mejorar procesos junto con Dropi.",
    ],
    oportunidadesRetencion: [
      "Automatizar notificación de estado de pedido al cliente final (prioridad #1 declarada por el usuario).",
      "Alertas de validación de direcciones incompletas antes de despachar.",
      "Visibilidad de facturación por ID de orden dentro de la plataforma (sin depender de archivos planos).",
      "Acompañar la funcionalidad de \"Garantías\" recién anunciada — ya mostraron interés explícito.",
    ],
    bauCompetitivo: "No se menciona competencia ni intención de migrar — la conversación es 100% sobre mejoras dentro de Dropi.",
    bauOperativo: [
      "Implementando Chatea Pro para automatizar creación de pedidos desde WhatsApp.",
      "Información financiera/wallet poco clara para análisis de costos mes a mes.",
      "Gestión de devoluciones y garantías depende de negociación manual vía WhatsApp con el cliente, no de un flujo dentro de Dropi.",
    ],
  },
  {
    id: "tienda-virtual1",
    entrevistado: "Jefrey Velasquez Muñoz",
    marca: "Tienda VIRTUAL1 (categoría bienestar)",
    fechaEntrevista: "23-jun-2026",
    archivoFuente: "Tienda VIRTUAL1 & DROPI_ 2026_06_23 16_29 - Notas de Gemini.docx",
    perfilOperativo: "Híbrido: nació como Marca despachando propio, evolucionó a Proveedor con red de Dropshippers propios (>2.000 órdenes/mes declaradas en la entrevista).",
    contacto: {
      userId: null,
      email: null,
      telefono: null,
      comercialId: null,
      enPortafolioMarcas: null,
      categoriaComportamiento: null,
      comportamientoAlgoritmico: null,
      comunidad: null,
      nota: "No identificado en dim_marcas.csv — se buscó por \"Jefrey/Jeffrey Velasquez Muñoz\" y variantes sin match exacto. Existe una comunidad llamada \"COMUNIDAD JEFRY VELASQUEZ\" (id 802) y un usuario \"Jefry Velasquez\" (45053... no, user_id 12193, sin apellido Muñoz, sin comercial asignado) que podría o no ser la misma persona — no se fuerza el cruce. Pedir a Kate el user_id exacto o el email de esta cuenta.",
    },
    ordenes2026: [],
    picoHistorico: null,
    tendencia: "No se pudo calcular — cuenta no identificada en fact_marcas.csv.",
    dolores: [
      "Imposibilidad de eliminar o bloquear bodegas inactivas — fragmenta el inventario cada vez que cambian de dirección física.",
      "Devoluciones se redistribuyen automáticamente a bodegas antiguas, generando un ciclo de inventario entrando y saliendo sin control.",
      "Falta de sincronización entre bodegas y Shopify: el sistema rechaza pedidos por \"falta de stock\" aunque haya disponibilidad en otra bodega. Solución temporal: inflar artificialmente el inventario base.",
      "Fallos esporádicos (2-3 veces/semana) en Chatea: da información incorrecta de producto al cliente final.",
      "Órdenes pendientes de confirmación de Dropshippers congelan stock por hasta 2 semanas.",
    ],
    insights: [
      "El Econ Scanner es valorado como herramienta esencial de control operativo.",
      "Mantiene lealtad exclusiva a Dropi pese a los desafíos — nunca ha evaluado migrar.",
      "Hacen seguimiento activo a los Dropshippers que venden su catálogo para proteger su reputación de marca (\"no vender humo\").",
    ],
    oportunidadesRetencion: [
      "Funcionalidad para bloquear/cerrar bodegas antes de eliminarlas.",
      "Reducir el tiempo de reserva de inventario en órdenes pendientes (de 2 semanas a 3-4 días).",
      "Corregir los errores de Chatea que dan información de producto incorrecta.",
      "Explorar transportadora propia de Dropi — el usuario cree que mejoraría tiempos y calidad de gestión de novedades.",
    ],
    bauCompetitivo: "No se menciona ninguna otra plataforma ni intención de migrar — la relación se describe explícitamente como \"muy positiva\" y sin considerar alternativas.",
    bauOperativo: [
      "Generación de guías y estados de pedido funcionan correctamente, sin fricción.",
      "Sin fricción contable relevante (apoyo de una socia + soporte previo de Dropi).",
      "Planea expandir a otras ciudades con bodegas propias, preferiblemente integradas con logística de Dropi.",
    ],
  },
  {
    id: "mateo-garzon",
    entrevistado: "Mateo Garzón (\"llevatelonline\")",
    marca: "llevatelonline",
    fechaEntrevista: "24-jun-2026",
    archivoFuente: "Testimonio Mateo Garzon - 2026_06_24 11_31 - Transcript.docx",
    perfilOperativo: "100% Marca — vende solo a sus propios clientes, con y sin recaudo. Shopify integrado vía Dropify. Usuario desde ~4 años (uno de los primeros en Colombia).",
    contacto: {
      userId: 45053,
      email: "mateogarzon50@gmail.com",
      telefono: "3212783270",
      comercialId: 21553,
      enPortafolioMarcas: true,
      categoriaComportamiento: "Emprendedores nativos",
      comportamientoAlgoritmico: "Evidente",
      comunidad: "COMUNIDAD IVAN CAICEDO (2)",
    },
    ordenes2026: [
      { periodo: "2026-01", propias: 191, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-02", propias: 216, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-03", propias: 406, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-04", propias: 278, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-05", propias: 225, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-06", propias: 172, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-07", propias: 130, externas: 0, tipoActivoChurn: "Fiel" },
    ],
    picoHistorico: { periodo: "2026-03", propias: 406 },
    tendencia: "Caída sostenida de 4 meses consecutivos tras el pico de marzo: 406→278→225→172→130 (-68% desde el pico). Señal de alerta pese a figurar como \"Fiel\" en cada mes — vale la pena cruzar con el equipo comercial.",
    dolores: [
      "Sin trazabilidad de número telefónico repetido entre pedidos — pide que la huella digital muestre el histórico de órdenes hechas con el mismo número, para detectar pedidos falsos.",
      "Sin evidencia geolocalizada/con fecha-hora de la entrega o del intento fallido — pide algo similar a apps de mensajería que registran ubicación, fecha y hora en la foto.",
      "Novedades reportadas sin distinguir si hubo intento real de entrega o simplemente saturación de la transportadora al final del día.",
      "Gestión de garantías/devoluciones por producto dañado es \"la parte más difícil\" — caso de una guía de $270.000 con producto roto dos veces seguidas, transportadora (Envía) no indemnizó.",
      "Reportes de facturación funcionales pero poco intuitivos — reporta que hace \"tremendos Excели\" para sacar sus costos mensuales.",
    ],
    insights: [
      "Usa la huella digital del cliente como filtro de confianza antes de despachar contraentrega.",
      "Prefiere meter menos pedidos y que se entreguen todos, a meter más y perder varios — filtra agresivamente direcciones dudosas contactando al cliente o dejando \"en portería\".",
      "Reenvía la guía manualmente al cliente (no automatizado) para tener más trazabilidad y decidir si vale la pena despachar.",
      "Trabaja simultáneamente con pago anticipado y contraentrega, y opera también como vendedor en Mercado Libre — dos operaciones separadas.",
      "Valora mucho la escalabilidad de operar en varios países (Guatemala, Costa Rica, México) desde una sola plataforma.",
    ],
    oportunidadesRetencion: [
      "Historial de número telefónico asociado a huella digital, para detección de fraude.",
      "Evidencia fotográfica con fecha/hora/ubicación en cada entrega o intento fallido.",
      "Diferenciar en el estado de la orden \"no se pudo entregar por saturación\" vs. \"cliente rechazó\" — evita reclamos injustos del cliente.",
      "Reporte financiero más intuitivo dentro de la plataforma (menos dependencia de Excel manual).",
    ],
    bauCompetitivo: "Dropi es la única plataforma de logística que ha usado — no se menciona ninguna otra ni intención de migrar.",
    bauOperativo: [
      "Wallet: valora que los pedidos pagados se descuenten automáticamente; menciona que antes solo se podía recargar una vez al día (\"terrible\"), ya corregido.",
      "Usa Confío para recargar wallet.",
      "Ha recibido contacto y ayuda puntual del equipo comercial en casos de guías con problemas (ej. Coordinadora) — no se siente solo en ese aspecto.",
    ],
  },
  {
    id: "maria-paula-arrechea",
    entrevistado: "María Paula Arrechea (+ \"Víctor Alarcón\" como co-operador; discrepancia de nombre con \"Ximena Diaz\" en asistentes, sin resolver)",
    marca: "Distribuidora Natural (nombre aproximado, confirmar con Kate)",
    fechaEntrevista: "09-jul-2026",
    archivoFuente: "Entrevistas Marcas (MARIA PAULA ARRECHEA) - 2026_07_09 15_20 - Transcript.docx",
    perfilOperativo: "100% Marca — despacha directo a sus clientes finales, \"yo no soy dropshipper\" (declarado explícitamente). Shopify → Dropi → Chatea Pro (bot WhatsApp).",
    contacto: {
      userId: 653912,
      email: "mariapaulaarrechea22@gmail.com",
      telefono: "3505080795",
      comercialId: 21553,
      enPortafolioMarcas: true,
      categoriaComportamiento: "Emprendedores nativos",
      comportamientoAlgoritmico: "Mayoritariamente supplier",
      comunidad: "BRANDS (410)",
      nota: "Coincide con el piloto de Retención Proactiva Escalando/Pre-Escalando (proyecto activo, confirmado 29-jul-2026) — misma cuenta.",
    },
    ordenes2026: [
      { periodo: "2026-01", propias: 1030, externas: 22, tipoActivoChurn: "Activo Viejo", noDocumentado: true },
      { periodo: "2026-02", propias: 1147, externas: 15, tipoActivoChurn: "Recurrente" },
      { periodo: "2026-03", propias: 1180, externas: 21, tipoActivoChurn: "Fiel" },
      { periodo: "2026-04", propias: 1701, externas: 2, tipoActivoChurn: "Fiel" },
      { periodo: "2026-05", propias: 3453, externas: 5, tipoActivoChurn: "Fiel" },
      { periodo: "2026-06", propias: 2981, externas: 3, tipoActivoChurn: "Fiel" },
      { periodo: "2026-07", propias: 2980, externas: 1, tipoActivoChurn: "Fiel" },
    ],
    picoHistorico: { periodo: "2026-05", propias: 3453 },
    tendencia: "Crecimiento explosivo ene→may (1.030→3.453, x3.3), luego estabiliza alto (~2.980/mes jun-jul). Sin señal de caída relevante en 2026.",
    dolores: [
      "Novedades/devoluciones excesivas: reporta hasta $17M COP/mes descontados; de 100 novedades gestionadas, solo ~3% se resuelve.",
      "Transportadoras marcan \"cliente ausente\" sin visitar realmente, sin cumplir los 3 intentos.",
      "Paquetes incompletos entregados (menos unidades de las empacadas) en al menos 2 ocasiones.",
      "Maltrato/grosería de transportadoras y domiciliarios hacia clientes.",
      "Soporte inefectivo — \"hablarle a Dropi es como hablarle a un niño pequeño\", el CAS solo redirige sin resolver.",
      "Incrementos de tarifa de Interrapidísimo sin aviso previo (18k→20.500→23.000+ en el mismo año).",
      "Logística inversa lenta (ejemplo: devolución Bogotá-Cali tardó ~1 semana).",
    ],
    insights: [
      "Nunca activan la \"garantía\" formal de Dropi — cuando algo falla, reenvían directo al cliente por su cuenta, sin dejar registro en la plataforma.",
      "Cancelan envíos propios en Cali y despachan ellos mismos para reducir pérdidas.",
      "Despachan en máx. 1-3 horas tras confirmación para no \"enfriar\" al cliente.",
      "Desconocían el servicio de Fulfillment/bodegas de Dropi hasta que se les explicó en la misma llamada.",
    ],
    oportunidadesRetencion: [
      "Comercial dedicado para cuenta de alto volumen (>3.000 órdenes/mes) — ya comprometido en la llamada.",
      "Explicar y activar Fulfillment en Bogotá (30-40% de su despacho va allá) para reducir tiempos/costos.",
      "Mejorar evidencia de intentos de entrega (como Coordinadora) para poder disputar novedades.",
      "Explicación proactiva de facturación electrónica (ansiedad legal genuina expresada por el usuario).",
    ],
    bauCompetitivo: "Recibieron oferta de ECOM (ayuda con novedades) y de Envía (manejo de cartera, pero paga a 15 días — no sirve para su flujo de caja). Sin intención activa de migrar, condicionado a que se resuelva el tema de novedades.",
    bauOperativo: [
      "Integración Shopify→Dropi→Chatea Pro funciona bien, aunque el bot a veces da respuestas erráticas revisadas manualmente.",
      "Dos cuentas Dropi relacionadas (ella y su hermana) tras ruptura de sociedad — sin comercial asignado hasta esta llamada.",
      "Facturación electrónica sin claridad, pendiente de que el comercial se las explique.",
    ],
  },
  {
    id: "santiago-lubo",
    entrevistado: "Santiago Lubo",
    marca: "Armonix Home (decoración — repisas flotantes)",
    fechaEntrevista: "28-jul-2026",
    archivoFuente: "Hablemos con Santiago Lubo - Marca - 2026_07_28 16_17 - Transcript.docx",
    perfilOperativo: "Marca con mercancía propia y contraentrega; menciona haber lanzado en algún momento una campaña hacia dropshipping — posible componente híbrido histórico no profundizado. Migró 100% desde EFI a Dropi hace ~1.5 años.",
    contacto: {
      userId: 431621,
      email: "armonixhome@gmail.com",
      telefono: "3192170575",
      comercialId: 21553,
      enPortafolioMarcas: true,
      categoriaComportamiento: "Emprendedores nativos",
      comportamientoAlgoritmico: "Evidente",
      comunidad: "COMUNIDAD DE MERCY PARDO (880)",
    },
    ordenes2026: [
      { periodo: "2026-01", propias: 578, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-02", propias: 414, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-03", propias: 480, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-04", propias: 422, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-05", propias: 448, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-06", propias: 244, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-07", propias: 284, externas: 0, tipoActivoChurn: "Fiel" },
    ],
    picoHistorico: { periodo: "2026-01", propias: 578 },
    tendencia: "Caída marcada desde el pico de enero: 578→244 en junio (-58%), coincide con el relato de la entrevista (migró volumen a SkyDrop por el bug de peso/guía desde may-jun). Leve recuperación en julio (284).",
    dolores: [
      "El peso/volumen del producto no se transmite correctamente a la guía en ninguna transportadora — causó que Interrapidísimo dejara de recogerle paquetes en su oficina de Santa Marta. Declarado como \"el dolor más grande\".",
      "Soporte inaccesible: WhatsApp, botón flotante y comunidad sin respuesta efectiva a sus mensajes.",
      "Dropi se cae en las mañanas al crear guías (dolor secundario, se resuelve rápido).",
      "CAS lento en casos complejos: caso de reembolso no resuelto (cliente pagó por link de transportadora, no recibió el paquete, no le devolvieron el dinero).",
    ],
    insights: [
      "Usa el historial de entregas/devoluciones del cliente en Dropi para decidir si exige anticipo — detectó un cliente con 50 órdenes y 49 devoluciones.",
      "Cobra anticipo (~$20.000 COP) a clientes de riesgo, lo que bajó notablemente sus devoluciones.",
      "Migró 100% a Dropi dejando EFI principalmente por esta herramienta antifraude y la facilidad de uso, no por gestión comercial.",
      "Mantenía relación informal con el encargado de la oficina de Interrapidísimo para que le siguiera recibiendo paquetes pese al problema de peso, hasta que sus superiores lo detectaron.",
    ],
    oportunidadesRetencion: [
      "Resolver el bug de transmisión de peso/volumen a la guía — literalmente la única razón de que divida operación con SkyDrop.",
      "Mejorar tiempos de respuesta de soporte (WhatsApp, botón flotante, comunidades, CAS).",
      "Página de tracking personalizable con marca propia y notificación automática por correo (funcionalidad que valora de SkyDrop).",
    ],
    bauCompetitivo: "EFI (2 años previos): robusta pero compleja, fallas de integración Shopify. SkyDrop (uso parcial actual): sí transmite peso/volumen, paga más flete y requiere pago anticipado, buen servicio al cliente que intenta captarlo 100% — no migra por dependencia de integraciones Shopify/Chatea Pro exclusivas de Dropi. Sin amenaza de migración total, condicionada a que se arregle el bug de peso. (Nota aparte: en la misma sesión, Miguel Perdomo compartió un benchmark propio — 99 Envíos, Coordinadora, Online, Masterop, Grupo EFI, Melon — señalando que Dropi carece de mensajería automática frente a esa competencia.)",
    bauOperativo: [
      "Pago rápido vía Envía (24h post-entrega); algo más lento con Interrapidísimo. Retiro semanal los miércoles.",
      "No necesita anticipar flete en Dropi (a diferencia de SkyDrop).",
      "Caso escalado en vivo durante la llamada: bodega ID 2322 (Santa Marta) — Juan Camilo confirmó que el peso/dimensión sí cumple el convenio (0-3kg); se agendó seguimiento para el día siguiente.",
    ],
  },
  {
    id: "yohana-quintero",
    entrevistado: "Yohana Esther Quintero (cuenta registrada bajo el nombre de su hija, \"Hillary\")",
    marca: "No mencionada explícitamente (fabricante de ropa/prendas)",
    fechaEntrevista: "27-jul-2026",
    archivoFuente: "Hablemos con Yohana Esther quintero - Marca - 2026_07_27 17_55 - Transcript.docx",
    perfilOperativo: "Híbrido: fabricante/Marca que desde marzo-2026 abrió su catálogo al dropshipping (recibe órdenes externas además de las propias).",
    contacto: {
      userId: null,
      email: null,
      telefono: null,
      comercialId: null,
      enPortafolioMarcas: null,
      categoriaComportamiento: null,
      comportamientoAlgoritmico: null,
      comunidad: null,
      nota: "No identificada en dim_marcas.csv — se buscó por \"Yohana/Johana Quintero\" e \"Hillary\" (alias declarado) sin match confiable. Pedir a Kate el user_id o email exacto de esta cuenta.",
    },
    ordenes2026: [],
    picoHistorico: null,
    tendencia: "No se pudo calcular — cuenta no identificada en fact_marcas.csv. La propia entrevistada declara un pico histórico de ~700 órdenes propias en dic-2023 y un pico 2026 de 168 pedidos en mayo — dato autoreportado, no verificado contra fact_marcas.",
    dolores: [
      "Transportadoras marcan \"no hubo quien recibiera\" sin evidencia real — pierde flete y cliente.",
      "CAS de Dropi no responde a los reclamos que escala sobre transportadoras.",
      "Estado de guía en Dropi no refleja el estado real — confía más en la plataforma de la transportadora.",
      "\"Cambiazo\" de paquetes grandes contraentrega (3 veces) — pierde el dinero completo; indemnización tarda ~2 meses + 15-30 días hábiles de reembolso, mientras el flete de devolución se cobra de inmediato.",
      "Retraso de hasta 3 días en visibilidad de guías generadas por dropshippers (su rol proveedor), con riesgo de indemnizar por exceder 48h.",
      "Botón flotante de soporte lento (5 horas a 2 días de espera).",
      "Envía y Coordinadora casi no tienen oficinas alternas de entrega (solo Interrapidísimo lo permite).",
    ],
    insights: [
      "Exige consignación anticipada según reglas propias: zonas de baja cobertura, zonas desconocidas o clientas con 2-3+ devoluciones históricas visibles en Dropi.",
      "Revisa guías manualmente cada día (~9am) directo en la plataforma de la transportadora, no en Dropi.",
      "Reenvía con otra transportadora (máx. 2 intentos) para no perder la clienta, aunque implique más costo en fletes.",
      "Graba en video la recepción de paquetes grandes como evidencia ante fraude.",
      "Se volvió proveedora/dropshipping de forma no planeada, por recomendación de una conocida.",
    ],
    oportunidadesRetencion: [
      "Verificación con evidencia de intentos reales de entrega, no solo el status declarado por la transportadora.",
      "Sincronización en tiempo real del estado de guía dentro de Dropi.",
      "Acelerar respuesta de CAS/botón flotante y resolución de casos de \"cambiazo\"/indemnización.",
      "Asignar comercial — es usuaria antigua (+4 años) y de alto volumen histórico sin gestión.",
      "Ofrecer proactivamente fulfillment (Bogotá/Medellín/Barranquilla/Cali) dado su foco geográfico.",
    ],
    bauCompetitivo: "Le recomendaron \"Eca\" y \"99 minutos\"; no las ha probado. Fuerte lealtad declarada: \"prefiero lo conocido que lo por conocer\". Sin amenaza de migración.",
    bauOperativo: [
      "Dinero retenido 2+ meses en indemnizaciones.",
      "Cuenta a nombre de la hija, pero pagos rechazados a esa cuenta obligan a cobrar a la suya propia.",
      "Demoras por dependencia de confirmación del dropshipper para generar guía en su rol de proveedor.",
      "Retiro de dinero en 24h valorado positivamente.",
    ],
  },
  {
    id: "yercy-shop",
    entrevistado: "Camilo Moreno",
    marca: "Yercy Shop",
    fechaEntrevista: "29-jul-2026",
    archivoFuente: "Producto _ Yercy shop  - 2026_07_29 08_59 - Transcript.docx",
    perfilOperativo: "Híbrido explícito y deliberado: opera 2 cuentas — perfil Proveedor Premium (bodega, productos propios públicos y privados) + perfil Dropshipper/tienda (autoventa + venta a clientes finales), \"se dropshipea a sí mismo\" desde su propia bodega y además permite que otros dropshippers vendan sus productos públicos.",
    contacto: {
      userId: 9825,
      email: "yercyshop@gmail.com",
      telefono: "3188146323",
      comercialId: 21553,
      enPortafolioMarcas: true,
      categoriaComportamiento: "Marcas Dropshippers",
      comportamientoAlgoritmico: "Marcas Dropshippers",
      comunidad: "LUXURY COMMUNITY-CAMILO MORENO (910)",
      nota: "Este user_id está en la lista de 9 cuentas del pivote actor_id del CLAUDE.md (opera como marca comprando como dropshipper) — coincide exactamente con el modelo \"se dropshipea a sí mismo\" descrito en la entrevista. Existe una 2ª cuenta relacionada, user_id 11248 (soporteyercyshop@gmail.com, sin comercial asignado, huérfana), con 0 órdenes en todo 2026 (tipo_activo_churn = Perdido) — parece ser una cuenta de soporte/legado inactiva, no la operativa.",
    },
    ordenes2026: [
      { periodo: "2026-01", propias: 11630, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-02", propias: 7654, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-03", propias: 6529, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-04", propias: 7125, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-05", propias: 11339, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-06", propias: 14111, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-07", propias: 13733, externas: 0, tipoActivoChurn: "Fiel" },
    ],
    picoHistorico: { periodo: "2025-06", propias: 16331 },
    tendencia: "Cuenta Escalando de altísimo volumen. Caída fuerte feb-abr 2026 (11.630→6.529, -44%) tras un enero fuerte, luego recuperación may-jul hasta 14.111 (jun). El pico histórico real fue jun-2025 (16.331), aún no recuperado en 2026.",
    dolores: [
      "Retiros lentos: hasta 2 días, con corte ~9am independiente del banco o monto.",
      "Los trabajadores ven la rentabilidad de cada venta al montar/editar la orden — \"se presta para conflicto interno\".",
      "Sin calendario/resumen de inventario (entradas y salidas por día/semana/mes) fácil de consultar.",
      "Errores aleatorios: notas de dirección que a veces no se guardan; órdenes que pasan a \"pendiente\" sin razón aparente.",
      "Incidente puntual de duplicación masiva de órdenes (60% de los pedidos duplicados/triplicados) sin comunicado oficial de Dropi.",
      "Alza repentina de tarifa de flete (Interrapidísimo, ~$2.000 COP) sin previo aviso — declara un impacto de ~$10M COP/mes.",
      "Políticas de devolución de la transportadora percibidas como cambiantes/desfavorables — dejó de disputar reclamos y asume ~10% de pérdida como costo fijo.",
    ],
    insights: [
      "El modelo de dos perfiles nació por orden contable (separar wallet \"tienda\" de wallet \"bodega\"), no por limitación técnica — comparten la misma bodega/inventario físico.",
      "Operar como proveedor premium con alto volumen da reputación/\"fuerza\" a la bodega, atrayendo más dropshippers.",
      "Segmenta accesos de trabajadores por perfil (bodega vs tienda) para controlar información cruzada.",
      "Prioriza \"novedades\" sobre devoluciones — una vez es devolución, \"ya se perdió\".",
      "Ya probó informalmente (vía un contacto interno de Dropi) alertas de inventario conectando un MCP de Dropi a Claude; la prueba no se mantuvo activa.",
    ],
    oportunidadesRetencion: [
      "Agilizar tiempos de retiro.",
      "Ocultar margen/ganancia en el perfil de trabajadores.",
      "Módulo de calendario de inventario (entradas/salidas, alertas de stock bajo) filtrable por tienda.",
      "Reporte automatizado semanal (recaudo, % entregado/devolución/procesamiento).",
      "Tabla de descuentos por volumen de fletes (fidelización).",
      "Diseñar el futuro \"perfil de marca\" unificando wallets para eliminar la necesidad de 2 cuentas — coincide directamente con el proyecto activo de Perfil Marca Independiente.",
    ],
    bauCompetitivo: "Menciona Master Shop y EFI como alternativas evaluadas por tarifas de flete más bajas; no ha migrado. Se declara \"team Dropi full\". Su comercial (Juan Camilo) le pide activamente compartir propuestas de la competencia para contraofertar — gestión activa de retención por precio.",
    bauOperativo: [
      "Retiros lentos; alzas de flete sin aviso (~$10M COP/mes de impacto declarado).",
      "Políticas de devolución desfavorables; wallet dividida en 2 perfiles.",
      "Falta de calendario de inventario; errores de sistema (notas, duplicación de órdenes); falta de filtro por tienda al gestionar pedidos.",
    ],
  },
  {
    id: "ingrid-pinzon",
    entrevistado: "Ingrid Pinzón + Juan Sebastián (equipo de la marca)",
    marca: "UBY Tienda Online (ubi.com.co)",
    fechaEntrevista: "28-jul-2026",
    archivoFuente: "_ Hablemos con Ingrid Pinzon - Marca - 2026_07_28 08_37 - Transcript.docx",
    perfilOperativo: "Marca con logística híbrida (mensajero propio en Bogotá/Sabana + Interrapidísimo directo para municipios sin cobertura Dropi + Dropi/SkyDrop para el resto). No le vende a dropshippers. Nicho: cámaras de seguridad.",
    contacto: {
      userId: 769528,
      email: "ingrid.pinzon.uby@gmail.com",
      telefono: "3114781229",
      comercialId: 21553,
      enPortafolioMarcas: true,
      categoriaComportamiento: "Emprendedores nativos",
      comportamientoAlgoritmico: "Evidente",
      comunidad: "BRANDS (410)",
      nota: "Ambigüedad de identidad: esta cuenta (769528, registrada 2026-01-19) coincide por email exacto con Ingrid, pero la entrevista declara \"registrados desde febrero 2024\" — no calza con esta fecha de registro. Existe una 2ª cuenta candidata, user_id 185353 (\"Trade24 Colombia\", email sebastianpinzon36@hotmail.com, coincide con el co-entrevistado Juan Sebastián), registrada 2024-03-20 — sí calza con \"febrero 2024\" (aprox.). Ambas están en el portafolio (comercial 21553, comunidad BRANDS), así que la conclusión de portafolio no cambia, pero las órdenes mensuales podrían corresponder a una, otra, o ambas cuentas operando en conjunto. Confirmar con Kate cuál es la cuenta operativa principal de UBY.",
    },
    ordenes2026: [
      { periodo: "2026-01", propias: 69, externas: 0, tipoActivoChurn: "Nuevo", noDocumentado: true },
      { periodo: "2026-02", propias: 3, externas: 0, tipoActivoChurn: "Recurrente" },
      { periodo: "2026-03", propias: 77, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-04", propias: 15, externas: 0, tipoActivoChurn: "Fiel" },
      { periodo: "2026-05", propias: 0, externas: 0, tipoActivoChurn: "En Riesgo" },
      { periodo: "2026-06", propias: 100, externas: 0, tipoActivoChurn: "Reactivado" },
      { periodo: "2026-07", propias: 1, externas: 0, tipoActivoChurn: "Recurrente" },
    ],
    picoHistorico: { periodo: "2026-06", propias: 100 },
    tendencia: "Muy volátil e inconsistente (cuenta 769528): 69→3→77→15→0→100→1. Mayo-2026 fue mes de churn total (0 propias, \"En Riesgo\"), reactivó en junio, y volvió a caer casi a cero en julio. Dado que esta cuenta parece reciente (registro ene-2026) y la ambigüedad de identidad señalada arriba, esta serie hay que leerla con cautela — puede no reflejar el volumen real de UBY si la operación corre principalmente por la otra cuenta candidata (185353).",
    dolores: [
      "Resolución lenta de novedades — respuesta al 4to o 5to día, cuando el cliente ya no quiere el pedido. Perciben trato preferente hacia Dropshipper/Proveedor.",
      "Novedades de Envía no le llegan al mensajero real — piden canal directo con el mensajero, no solo con un agente centralizado.",
      "Pérdida de paquetes de devolución (10-14 casos) — tuvieron que empezar a recibir devoluciones personalmente.",
      "Indemnización pendiente desde octubre 2025 sin resolver (caso puntual, tratado como contexto cualitativo, no como algo a resolver en esta entrevista).",
      "Devoluciones llegan dañadas (declaran ~80% de los pedidos devueltos llegan golpeados).",
      "Falta de filtro/verificación de vendedores en la plataforma — clientes confunden a Dropi con estafadores por el logo en la guía de vendedores no verificados.",
      "Comunidad actual (\"La estamos rompiendo Dropi\" o similar) cobra comisión (~$11-15M COP/mes en flete) sin dar soporte real.",
      "Desconocen cómo funciona el proceso de garantías — nunca lo han usado por falta de claridad.",
    ],
    insights: [
      "Llevan un control interno propio (\"la Biblia\"/\"el controller\") con semáforo rojo/amarillo/verde por pedido, más detallado que el dashboard de Dropi.",
      "Verifican doble tracking: estado en Dropi y directamente en la página de la transportadora.",
      "Construyeron confianza con mensajeros locales (rótulo propio, videollamadas, videos de empaque) para permitir apertura del paquete y reducir devoluciones.",
      "Decidieron NO integrar Shopify-Dropi automáticamente — prefieren revisar manualmente cada pedido para detectar direcciones dudosas o pedidos falsos de competencia.",
      "Volvieron a Dropi tras un período 100% en Skydrop, por automatización de notificaciones (ChateaPro), velocidad al generar guías en lote y transparencia de wallet/pagos.",
      "Miden recompra de clientes como KPI propio de fidelización.",
      "Negociación directa con Interrapidísimo (como empresa constituida) para zonas sin cobertura Dropi.",
    ],
    oportunidadesRetencion: [
      "Asignar un doliente/comercial dedicado para gestión de novedades (pedido explícito y repetido).",
      "Mecanismo de escalamiento directo hacia el mensajero/transportadora que tiene el paquete.",
      "Mejorar trazabilidad/resolución específica de novedades con Envía.",
      "Reasignarlos fuera de la comunidad actual hacia un comercial con mejor respuesta — acción que Kate toma como tarea en la llamada.",
      "Clarificar y explicar el flujo de garantías.",
      "Explorar filtros/verificación de vendedores para proteger la reputación de marca de Dropi.",
    ],
    bauCompetitivo: "Skydrop (uso paralelo): fuerte en resolución de novedades (<2h) y guía sin logo Dropi; débil en flujo de pago (solo jueves, recargo por adelanto). Interrapidísimo directo: mejor tarifa negociada, pero subió mucho de precio recientemente. MasterShop y Coordinadora mencionadas con poco uso real. Envía: citada explícitamente como mal servicio pese a ser la más económica — \"no nos interesa un flete barato, nos interesa un pedido entregado\". Migraron 100% a Skydrop en 2024/2025 y regresaron a Dropi por automatización y transparencia de pagos — decisión basada en trade-offs medidos, no lealtad ciega. Señal de riesgo: amenaza de migración condicionada a políticas internas de Dropi sobre el aviso de \"puede destapar el paquete\" en la guía.",
    bauOperativo: [
      "Facturación: \"un desorden terrible\" en 2024, mejoró desde 2do semestre 2025; ahora sí factura, IVA descontable para ellos como empresa.",
      "Comisión 4x1000 asumida y aceptada.",
      "Valoran poder retirar dinero cuando lo necesiten (vs. Skydrop, que solo desembolsa jueves con recargo por adelanto).",
      "Dropi no cubre el 100% de municipios (ej. La Loma-Cesar) — los obliga a usar Interrapidísimo directo.",
    ],
  },
];

// Patrones transversales — hipótesis a seguir observando (no loops
// confirmados: para eso se necesita ver el patrón repetirse en más de un
// periodo). Conteo sobre las 8 entrevistas procesadas a la fecha.
export const patronesTransversales = [
  {
    tema: "Gestión de novedades / transportadora (evidencia de intento de entrega, estados falsos, resolución lenta)",
    entrevistas: ["blendit", "maria-paula-arrechea", "santiago-lubo", "yohana-quintero", "ingrid-pinzon", "yercy-shop"],
    nota: "6 de 8 entrevistas lo mencionan como dolor explícito — el patrón más repetido de todo el corpus.",
  },
  {
    tema: "Soporte/CAS lento o inefectivo",
    entrevistas: ["blendit", "maria-paula-arrechea", "santiago-lubo", "yohana-quintero", "ingrid-pinzon"],
    nota: "5 de 8 — coincide con lo ya identificado en BAU Competitivo (tiempos de respuesta lentos).",
  },
  {
    tema: "Sin comercial asignado pese a volumen relevante (huérfanos operativos)",
    entrevistas: ["maria-paula-arrechea", "santiago-lubo", "yohana-quintero", "ingrid-pinzon"],
    nota: "4 de 8 — las 4 entrevistas más recientes (jul-2026) reportan no tener gestor comercial antes de esta llamada. Se resolvió en la propia entrevista en los casos donde el equipo de producto se comprometió a escalar.",
  },
  {
    tema: "Facturación / wallet / retiros poco claros o lentos",
    entrevistas: ["blendit", "mateo-garzon", "yercy-shop", "ingrid-pinzon"],
    nota: "4 de 8.",
  },
];
