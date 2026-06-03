export type NodeKey =
  | "campaign" | "type" | "segment" | "rules" | "invite"
  | "submission" | "showcase" | "handoff"
  | "measure" | "decision";

type FieldType = "text" | "textarea" | "select" | "multiselect" | "date" | "dates_group" | "static" | "condition_builder";

interface SubField { key: string; label: string }
interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  optionDescriptions?: Record<string, string>;
  subfields?: SubField[];
  value?: string;
  conditionLogic?: "AND" | "OR";
  ranked?: boolean;
}

interface NodeDefinition {
  key: NodeKey;
  title: string;
  icon: string;
  description: string;
  fields: Field[];
}

export const NODE_DEFINITIONS: NodeDefinition[] = [
  // ── Nodo 1: Nueva campaña ──────────────────────────────────
  {
    key: "campaign",
    title: "Nueva campaña",
    icon: "➕",
    description:
      "Punto de partida del experimento. Define la identidad, intención comercial, alcance inicial y responsable. No define segmentos, reglas ni canales todavía.",
    fields: [
      {
        key: "name",
        label: "Nombre de la campaña",
        type: "text",
        required: true,
        placeholder: "ej. Dropicup Mundial, Black Week, Remates de Stock...",
      },
      {
        key: "short_description",
        label: "Descripción corta",
        type: "textarea",
        required: true,
        placeholder: "Explica en una frase qué busca esta campaña.",
        hint: "ej. Campaña para agrupar productos relacionados con el mundial y validar si una vitrina curada aumenta la adopción de dropshippers.",
      },
      {
        key: "objective",
        label: "Objetivo principal",
        type: "multiselect",
        required: true,
        options: [
          "Aumentar órdenes",
          "Generar GMV",
          "Activar productos quietos",
          "Dar visibilidad a suppliers",
          "Ayudar a suppliers a salir de stock",
          "Validar interés de dropshippers",
          "Activar suppliers nuevos",
          "Validar una categoría específica",
          "Validar productos con descuento",
        ],
      },
      {
        key: "experiment_type",
        label: "Tipo de experimento",
        type: "multiselect",
        required: true,
        options: [
          "Campaña manual",
          "Vitrina manual",
          "Categoría temporal beta",
          "Campaña vía comunicación comercial",
          "Campaña vía GHL",
          "Campaña vía Userpilot",
          "Campaña vía WhatsApp",
          "Campaña mixta",
        ],
      },
      {
        key: "country",
        label: "País o mercado",
        type: "multiselect",
        required: true,
        options: ["Colombia", "México", "Chile", "Ecuador"],
      },
      {
        key: "dates",
        label: "Fechas base",
        type: "dates_group",
        required: true,
        subfields: [
          { key: "date_convocation_start", label: "Inicio convocatoria supplier" },
          { key: "date_submission_end", label: "Cierre postulación supplier" },
          { key: "date_publish", label: "Publicación para dropshippers" },
          { key: "date_end", label: "Cierre de campaña" },
        ],
      },
      {
        key: "responsible",
        label: "Responsable de la campaña",
        type: "select",
        required: true,
        options: [
          "Producto",
          "Growth",
          "Comercial",
          "Supplier Success",
          "Comunicaciones",
        ],
      },
      {
        key: "status_initial",
        label: "Estado inicial",
        type: "static",
        value: "Borrador",
      },
      {
        key: "hypothesis",
        label: "Hipótesis asociada",
        type: "textarea",
        required: true,
        placeholder: "¿Qué queremos validar con esta campaña?",
        hint: "ej. Si Dropi crea una campaña curada del mundial, los suppliers postularán por mayor visibilidad y los dropshippers tendrán mayor intención de explorar esos productos.",
      },
      {
        key: "expected_result",
        label: "Resultado esperado",
        type: "textarea",
        required: true,
        placeholder: "¿Qué esperamos lograr al finalizar la campaña?",
        hint: "ej. Validar si una campaña manual genera participación supplier, adopción dropshipper y señales iniciales de órdenes o GMV.",
      },
    ],
  },

  // ── Nodo 2: Tipo de campaña ────────────────────────────────
  {
    key: "type",
    title: "Tipo de campaña",
    icon: "🏷️",
    description: "Define la mecánica comercial que va a probarse y qué comportamiento se quiere activar en suppliers y dropshippers.",
    fields: [
      {
        key: "campaign_type",
        label: "Tipo de dinámica",
        type: "select",
        required: true,
        options: [
          "Campaña de temporada",
          "Campaña de remate",
          "Campaña de visibilidad",
          "Campaña por categoría",
          "Campaña de productos quietos",
          "Campaña para suppliers nuevos",
          "Campaña de alto margen",
          "Campaña de combos",
          "Campaña por proveedor destacado",
          "Campaña mixta",
        ],
        optionDescriptions: {
          "Campaña de temporada": "Alrededor de una fecha comercial (Mundial, Black Week, Navidad, Día de la Madre…). Mueve órdenes y GMV con contexto claro para pautar. El descuento es opcional.",
          "Campaña de remate": "Para salir de stock quieto o inventario acumulado. El supplier necesita bajar precio o hacer un precio especial. Requiere descuento o precio de campaña.",
          "Campaña de visibilidad": "El beneficio principal es la exposición en una vitrina curada por Dropi, no el descuento. Valida si el supplier participa solo por visibilidad.",
          "Campaña por categoría": "Agrupa productos por vertical temática (hogar, belleza, tecnología, mascotas…). Facilita al dropshipper encontrar productos con una intención clara de venta.",
          "Campaña de productos quietos": "Enfocada en productos publicados sin órdenes en 30/60/90 días o con stock alto y baja rotación. Objetivo: pasar de 'publicado' a 'activado'.",
          "Campaña para suppliers nuevos": "Acelera el Time to Value de suppliers recién activados. Les da visibilidad inicial para conseguir primeras órdenes sin esperar adopción orgánica.",
          "Campaña de alto margen": "Agrupa productos atractivos por rentabilidad para el dropshipper. Ideal para dropshippers que quieren escalar pauta con buena promesa económica.",
          "Campaña de combos": "Productos agrupados para aumentar ticket y rotación. Puede ser un combo sugerido por el supplier o armado por Dropi. Descuento opcional.",
          "Campaña por proveedor destacado": "Visibilidad al catálogo completo o una selección de un supplier específico. Útil para impulsar suppliers estratégicos o con buen cumplimiento.",
          "Campaña mixta": "Combina varias lógicas en una misma dinámica (ej: Dropicup puede ser temporada + visibilidad + remate + productos para pauta al mismo tiempo).",
        },
      },
      {
        key: "requires_discount",
        label: "¿Requiere descuento?",
        type: "select",
        required: true,
        options: [
          "Sí — descuento obligatorio",
          "Sí — descuento opcional",
          "No requiere descuento",
          "Depende del producto",
          "Depende del supplier",
        ],
      },
      {
        key: "requires_campaign_price",
        label: "¿Requiere precio de campaña?",
        type: "select",
        required: true,
        hint: "Aplica principalmente a remates, Black Week, descuento temporal, productos quietos y combos con descuento.",
        options: ["Sí", "No", "Opcional"],
      },
      {
        key: "has_expiration",
        label: "¿Tiene fecha de expiración?",
        type: "select",
        required: true,
        hint: "Para el MVP se recomienda que todas las campañas tengan fecha de cierre.",
        options: ["Sí", "No"],
      },
      {
        key: "supplier_motivator",
        label: "Motivador principal del supplier",
        type: "select",
        required: true,
        options: [
          "Mayor visibilidad",
          "Salir de stock",
          "Vender más volumen",
          "Activar producto nuevo",
          "Mover producto quieto",
          "Conseguir primeras órdenes",
          "Ganar adopción de dropshippers",
          "Destacar su catálogo",
          "Mejorar rotación",
        ],
      },
      {
        key: "what_to_move",
        label: "¿Qué se quiere mover?",
        type: "multiselect",
        required: true,
        options: [
          "Órdenes",
          "GMV",
          "Unidades",
          "Productos quietos",
          "Suppliers nuevos",
          "Categoría específica",
          "Productos con alto stock",
          "Productos con descuento",
          "Productos con primera venta pendiente",
          "Catálogos de suppliers estratégicos",
        ],
      },
      {
        key: "commercial_rules",
        label: "Reglas comerciales base",
        type: "textarea",
        required: true,
        placeholder: "Describe las reglas que aplican a esta mecánica...",
        hint: "ej. Mínimo 10 unidades de stock, precio de campaña al menos 10% menor, categoría alineada al tipo seleccionado.",
      },
      {
        key: "notes",
        label: "Notas adicionales",
        type: "textarea",
        placeholder: "Observaciones relevantes para la célula...",
      },
    ],
  },

  // ── Nodo 3: Segmentación ───────────────────────────────────
  {
    key: "segment",
    title: "Segmentación",
    icon: "👥",
    description: "Define a qué suppliers y productos se les habilitará la campaña usando condiciones obligatorias, opcionales y exclusiones. No es una lista manual — es una query en lenguaje natural.",
    fields: [
      {
        key: "universe",
        label: "Universo base",
        type: "select",
        required: true,
        hint: "Recomendación MVP: Suppliers + productos — no basta saber qué supplier participa; también hay que saber si tiene productos que aplican.",
        options: [
          "Suppliers + productos",
          "Solo suppliers",
          "Solo productos",
          "Categorías",
          "País / mercado",
          "Base comercial manual",
          "Campaña anterior",
          "Lista cargada en Sheet",
        ],
      },
      {
        key: "mandatory_conditions",
        label: "Condiciones obligatorias",
        type: "condition_builder",
        required: true,
        hint: "Todas deben cumplirse. Se conectan con AND.",
        conditionLogic: "AND",
      },
      {
        key: "optional_conditions",
        label: "Condiciones opcionales",
        type: "condition_builder",
        hint: "Permiten incluir casos por oportunidad aunque no sean el segmento principal. Se conectan con OR.",
        conditionLogic: "OR",
      },
      {
        key: "exclusions",
        label: "Exclusiones",
        type: "condition_builder",
        required: true,
        hint: "Casos que quedan fuera sin excepción. Se conectan con OR.",
        conditionLogic: "OR",
      },
      {
        key: "segment_size",
        label: "Tamaño esperado del segmento",
        type: "text",
        required: true,
        placeholder: "ej. 20 suppliers / 100 productos",
        hint: "Recomendación MVP: 20–50 suppliers o 50–150 productos para que el experimento sea manejable.",
      },
      {
        key: "data_source",
        label: "Fuente de datos",
        type: "multiselect",
        required: true,
        options: [
          "Comercial",
          "CRM / GHL",
          "Userpilot",
          "Base de productos",
          "Reporte de stock",
          "Reporte de órdenes",
          "Reporte de productos sin venta",
          "Reporte de alto stock",
          "Sheet manual",
          "Recomendación Supplier Success",
          "Data de campañas anteriores",
        ],
      },
      {
        key: "segment_responsible",
        label: "Responsable de segmentación",
        type: "select",
        required: true,
        options: [
          "Producto",
          "Comercial",
          "Supplier Success",
          "Growth",
          "Data",
          "Operación",
          "Líder de campaña",
        ],
      },
      {
        key: "segment_notes",
        label: "Notas y contexto del segmento",
        type: "textarea",
        placeholder: "Cualquier contexto relevante: por qué se eligió este segmento, restricciones conocidas, datos faltantes...",
      },
    ],
  },

  // ── Nodo 4: Reglas de participación ───────────────────────
  {
    key: "rules",
    title: "Reglas de participación",
    icon: "📏",
    description: "Define las condiciones mínimas que debe cumplir un supplier o producto para entrar a la campaña. Protege la experiencia del dropshipper y evita dar visibilidad a productos con problemas operativos.",
    fields: [
      {
        key: "mandatory_rules",
        label: "Reglas obligatorias",
        type: "condition_builder",
        required: true,
        hint: "Sin estas reglas el producto o supplier no puede entrar a la campaña. Se aplican con AND.",
        conditionLogic: "AND",
      },
      {
        key: "recommended_rules",
        label: "Reglas recomendadas",
        type: "condition_builder",
        hint: "No bloquean, pero ayudan a priorizar productos dentro de la campaña.",
        conditionLogic: "AND",
      },
      {
        key: "exclusion_rules",
        label: "Reglas excluyentes",
        type: "condition_builder",
        required: true,
        hint: "Si se cumple cualquiera de estas, el producto queda fuera automáticamente.",
        conditionLogic: "OR",
      },
      {
        key: "threshold_stock",
        label: "Stock mínimo requerido (unidades)",
        type: "text",
        required: true,
        placeholder: "ej. 20",
      },
      {
        key: "threshold_discount",
        label: "Descuento mínimo (%) — si aplica",
        type: "text",
        placeholder: "ej. 10% — dejar vacío si no aplica",
      },
      {
        key: "threshold_margin",
        label: "Margen mínimo (%) — si aplica",
        type: "text",
        placeholder: "ej. 25% — dejar vacío si no aplica",
      },
      {
        key: "threshold_max_products",
        label: "Máx. productos por supplier",
        type: "text",
        placeholder: "ej. 5 productos por supplier",
      },
      {
        key: "requires_price_validity",
        label: "¿Requiere vigencia de precio de campaña?",
        type: "select",
        required: true,
        options: ["Sí — obligatorio definir fecha de vigencia", "No — el precio no tiene fecha de expiración", "Depende del tipo de campaña"],
      },
      {
        key: "campaign_specific_rules",
        label: "Reglas específicas de esta campaña",
        type: "textarea",
        placeholder: "ej. Para Dropicup Mundial: el producto debe relacionarse con fútbol, fans, decoración, ropa o tecnología para ver partidos.",
        hint: "Condiciones únicas de esta campaña que no aplican de forma genérica a todas.",
      },
      {
        key: "eligibility_criteria",
        label: "Criterios de elegibilidad",
        type: "textarea",
        required: true,
        placeholder: "Describe cómo se clasificará cada producto:\n\nElegible → cumple todas las reglas obligatorias\nRequiere ajuste → cumple las principales pero falta algo (ej. imagen)\nNo elegible → incumple una regla bloqueante\nPendiente de validación → requiere revisión manual\nAprobado por excepción → no cumple todo pero se aprueba con justificación",
      },
    ],
  },

  // ── Nodo 5: Convocatoria ───────────────────────────────────
  {
    key: "invite",
    title: "Convocatoria supplier",
    icon: "📣",
    description: "Define cómo se entera el supplier de la campaña y cómo se le lleva a postular productos. Valida la hipótesis central: si Dropi ofrece visibilidad u oportunidad de remate, ¿los suppliers muestran intención de participar?",
    fields: [
      {
        key: "invite_type",
        label: "Tipo de convocatoria",
        type: "select",
        required: true,
        optionDescriptions: {
          "Abierta": "Se comunica a un grupo amplio de suppliers que cumplen reglas básicas. Aplica para remates, Black Week, temporadas grandes o categorías amplias.",
          "Segmentada": "Solo se comunica a suppliers que cumplen una condición específica. Aplica para Dropicup, belleza, tecnología, mascotas o categorías acotadas.",
          "Por invitación": "Mensaje personalizado para suppliers seleccionados: 'Tu catálogo fue seleccionado para participar en…'. Aplica para suppliers estratégicos, premium o con alto potencial.",
          "Comercial manual": "El comercial contacta directamente a suppliers seleccionados. Recomendado para el MVP porque obtiene respuesta más rápida.",
          "Mixta": "Combina invitación directa para suppliers estratégicos con convocatoria abierta al resto del segmento.",
        },
        options: ["Abierta", "Segmentada", "Por invitación", "Comercial manual", "Mixta"],
      },
      {
        key: "channels",
        label: "Canales de comunicación",
        type: "multiselect",
        required: true,
        hint: "El primero que selecciones será el canal principal; los siguientes quedan como secundarios.",
        ranked: true,
        options: ["Comercial directo", "WhatsApp", "GHL", "Email", "Userpilot", "Modal in-app", "Banner in-app", "Llamada", "Comunidad / grupo"],
      },
      {
        key: "message_motivators",
        label: "Motivadores del mensaje",
        type: "multiselect",
        required: true,
        hint: "El primero que selecciones será el motivador principal; los siguientes complementan el mensaje.",
        ranked: true,
        options: ["Mayor visibilidad", "Salir de stock", "Vender más volumen", "Activar producto nuevo", "Conseguir primeras órdenes"],
      },
      {
        key: "message_template",
        label: "Mensaje base de convocatoria",
        type: "textarea",
        required: true,
        placeholder: "Escribe el mensaje que recibirá el supplier...",
        hint: "Debe incluir: nombre de campaña · beneficio para el supplier · qué productos puede postular · si aplica descuento · fecha límite · CTA claro.",
      },
      {
        key: "cta",
        label: "Call to action (CTA)",
        type: "select",
        required: true,
        options: ["Postular productos", "Confirmar participación", "Ver campaña", "Completar formulario", "Enviar productos", "Hablar con comercial", "Ver reglas de participación"],
      },
      {
        key: "submission_link",
        label: "Link de postulación",
        type: "text",
        required: true,
        placeholder: "https:// — Google Form, Airtable, GHL, Sheet o contacto comercial",
      },
      {
        key: "submission_deadline",
        label: "Fecha límite de postulación",
        type: "date",
        required: true,
      },
      {
        key: "send_responsible",
        label: "Responsable del envío",
        type: "select",
        required: true,
        options: ["Comercial", "Growth", "Comunicaciones", "Supplier Success", "Producto", "Líder de campaña"],
      },
      {
        key: "supplier_list",
        label: "Lista de suppliers a convocar",
        type: "textarea",
        required: true,
        placeholder: "Pega aquí la lista de suppliers candidatos (puede venir del Nodo 3 — Segmentación) o describe la fuente: 'Sheet maestro de segmentación del 2026-06-XX'.",
      },
      {
        key: "invite_status",
        label: "Estado de la convocatoria",
        type: "select",
        required: true,
        options: ["Pendiente de enviar", "Enviada", "En seguimiento", "Con respuestas parciales", "Completada"],
      },
    ],
  },

  // ── Nodo 6: Postulación ────────────────────────────────────
  {
    key: "submission",
    title: "Postulación de productos",
    icon: "📝",
    description: "El supplier registra los productos que quiere incluir en la campaña y las condiciones comerciales asociadas. Para el MVP se usa un formulario externo — este nodo configura ese proceso.",
    fields: [
      {
        key: "submission_channel",
        label: "Herramienta de captura de postulaciones",
        type: "select",
        required: true,
        optionDescriptions: {
          "Google Form": "Rápido de crear y fácil de compartir. Las respuestas van directo a un Sheet. Recomendado para el MVP.",
          "Airtable Form": "Mejor estructura y vista de base de datos. Útil si ya usan Airtable para gestión de campaña.",
          "Tally": "Alternativa ligera a Typeform. Buena experiencia de usuario y fácil de configurar.",
          "Sheet diligenciado por comercial": "El comercial llena el sheet en nombre del supplier. Más control pero más trabajo manual.",
          "Formulario GHL": "Si los suppliers ya están en el flujo de GHL. Integrado con el CRM.",
          "Formulario interno Supplier Success": "Proceso manual gestionado directamente por el equipo.",
        },
        options: ["Google Form", "Airtable Form", "Tally", "Sheet diligenciado por comercial", "Formulario GHL", "Formulario interno Supplier Success"],
      },
      {
        key: "form_link",
        label: "Link del formulario de postulación",
        type: "text",
        required: true,
        placeholder: "https:// — link que recibirá el supplier o el comercial",
      },
      {
        key: "supplier_required_fields",
        label: "Datos del supplier requeridos",
        type: "multiselect",
        required: true,
        hint: "Información mínima del supplier para identificarlo en la postulación.",
        options: ["Nombre del supplier", "ID del supplier", "País", "Contacto (WhatsApp / correo)", "Comercial responsable", "Estado del supplier"],
      },
      {
        key: "product_required_fields",
        label: "Datos del producto requeridos",
        type: "multiselect",
        required: true,
        hint: "Información mínima del producto para poder validarlo en Dropi.",
        options: ["Nombre del producto", "ID del producto", "Link del producto en Dropi", "Categoría", "Estado del producto (activo/inactivo)", "Tipo (simple o variable)", "Público o privado"],
      },
      {
        key: "commercial_required_fields",
        label: "Datos comerciales requeridos",
        type: "multiselect",
        required: true,
        hint: "Información comercial para evaluar si el producto puede entrar a la campaña.",
        options: ["Precio actual", "Precio de campaña", "Descuento ofrecido (%)", "Stock disponible", "Stock habilitado para campaña", "Vigencia del precio especial", "Margen estimado", "Cupo máximo para campaña"],
      },
      {
        key: "motivator_field",
        label: "¿Capturar motivación del supplier?",
        type: "select",
        required: true,
        hint: "Campo clave para el aprendizaje del experimento: entender por qué el supplier quiere participar.",
        options: ["Sí — campo obligatorio", "Sí — campo opcional", "No"],
      },
      {
        key: "required_confirmations",
        label: "Confirmaciones requeridas al supplier",
        type: "multiselect",
        hint: "Validaciones mínimas que el supplier debe aceptar antes de completar la postulación.",
        options: [
          "Confirma que el producto tiene stock disponible",
          "Confirma que el precio registrado es válido para la campaña",
          "Acepta que Dropi revisará y puede aprobar o rechazar el producto",
          "Confirma capacidad de despacho durante la campaña",
          "Confirma vigencia del precio si hay descuento",
        ],
      },
      {
        key: "submission_responsible",
        label: "Responsable de gestionar las postulaciones",
        type: "select",
        required: true,
        options: ["Supplier Success", "Comercial", "Producto", "Growth", "Operación", "Líder de campaña"],
      },
      {
        key: "submission_notes",
        label: "Instrucciones para el supplier o el comercial",
        type: "textarea",
        placeholder: "¿Qué debe saber el supplier antes de postular? ¿Qué debe hacer el comercial al registrar un producto?",
      },
    ],
  },

  // ── Nodo 7: Vitrina ────────────────────────────────────────
  {
    key: "showcase",
    title: "Construir vitrina",
    icon: "🛍️",
    description: "Define cómo se presentarán al dropshipper los productos de la campaña. La campaña solo tiene valor si el dropshipper percibe una oportunidad clara.",
    fields: [
      {
        key: "showcase_type",
        label: "Tipo de vitrina",
        type: "select",
        required: true,
        optionDescriptions: {
          "Landing manual": "Página sencilla con productos agrupados. Cards con imagen, precio, stock, supplier y CTA. Buena experiencia, algo más de esfuerzo de construcción.",
          "Categoría temporal beta": "Crear una categoría temporal dentro del catálogo actual. Permite simular el módulo sin construirlo. Mide si la categoría atrae uso orgánico.",
          "Sheet curado": "Vista compartida con comerciales o dropshippers. MVP rápido. Debe tener: producto, imagen/link, supplier, precio, stock, descuento y CTA.",
          "Airtable view": "Alternativa más visual a Sheet. Útil si ya gestionan la campaña en Airtable.",
          "Documento handoff comercial": "Documento para que comercial o Growth comuniquen los productos directamente. Más manual pero valida rápido.",
          "Campaña GHL / WhatsApp": "Mensaje con productos destacados enviado a dropshippers segmentados. Ej: 'Estos son los 20 productos del Dropicup'.",
          "Mixta": "Combina dos o más formatos. Ej: categoría temporal + envío por GHL.",
        },
        options: ["Landing manual", "Categoría temporal beta", "Sheet curado", "Airtable view", "Documento handoff comercial", "Campaña GHL / WhatsApp", "Mixta"],
      },
      {
        key: "showcase_name",
        label: "Nombre visible para el dropshipper",
        type: "text",
        required: true,
        placeholder: "ej. Dropicup Mundial · Remates de Stock · Belleza de Temporada",
      },
      {
        key: "showcase_description",
        label: "Descripción visible",
        type: "textarea",
        required: true,
        placeholder: "Una frase clara que explica la oportunidad.\n\nej. Productos seleccionados por Dropi para vender durante la temporada del mundial.",
      },
      {
        key: "product_source",
        label: "Fuente de los productos incluidos",
        type: "select",
        required: true,
        options: ["Sheet maestro de campaña", "Airtable view", "Categoría temporal en Dropi", "Lista manual", "Lista de productos aprobados del Nodo anterior"],
      },
      {
        key: "product_groupings",
        label: "Agrupaciones internas",
        type: "multiselect",
        hint: "Cómo se organizarán los productos dentro de la vitrina. Evita presentar una lista plana.",
        options: ["Destacados", "Alto margen", "Remates / descuento", "Por categoría", "Por supplier", "Por stock alto", "Terminan pronto", "Nuevos", "Productos para pauta"],
      },
      {
        key: "badges",
        label: "Badges o señales visuales",
        type: "multiselect",
        hint: "Máximo 2–3 badges por producto para no saturar.",
        options: ["Seleccionado por Dropi", "Precio especial", "Remate", "Alto stock", "Alto margen", "Producto de temporada", "Nuevo", "Últimas unidades", "Supplier verificado", "Despacho rápido", "Termina pronto", "Campaña activa"],
      },
      {
        key: "product_visible_info",
        label: "Información visible por producto",
        type: "multiselect",
        required: true,
        hint: "Mínimo: imagen, nombre, supplier, precio, stock, CTA.",
        options: ["Imagen", "Nombre del producto", "Supplier", "Categoría", "Precio actual", "Precio de campaña", "Descuento (%)", "Stock disponible", "Vigencia", "Badge", "CTA"],
      },
      {
        key: "cta_main",
        label: "CTA principal",
        type: "select",
        required: true,
        optionDescriptions: {
          "Ver producto": "Lleva al dropshipper a la ficha del producto en Dropi. Recomendado para el MVP.",
          "Tomar producto": "Agrega directamente el producto al catálogo del dropshipper si la plataforma lo permite.",
          "Agregar a mi tienda": "Similar a tomar producto. Depende de lo que permita la plataforma hoy.",
          "Copiar producto": "El dropshipper copia la ficha para su tienda propia.",
          "Contactar supplier": "Dirige al dropshipper a contactar directamente al supplier. Útil para campañas de relación.",
          "Ver catálogo del supplier": "Lleva a todo el catálogo del supplier, no solo al producto.",
        },
        options: ["Ver producto", "Tomar producto", "Agregar a mi tienda", "Copiar producto", "Contactar supplier", "Ver catálogo del supplier"],
      },
      {
        key: "distribution_channels",
        label: "Canal de distribución al dropshipper",
        type: "multiselect",
        required: true,
        ranked: true,
        hint: "El primero que selecciones será el canal principal de difusión.",
        options: ["GHL", "WhatsApp", "Userpilot", "Email", "Comunidad / grupo", "Comercial", "Banner in-app", "Modal in-app", "Link compartible"],
      },
      {
        key: "validity_display",
        label: "Vigencia visible para el dropshipper",
        type: "text",
        required: true,
        placeholder: "ej. Termina en 7 días · Vigente hasta el 30 de junio · Precio especial por tiempo limitado",
      },
      {
        key: "showcase_link",
        label: "Link o documento de la vitrina",
        type: "text",
        placeholder: "https:// — landing, sheet, categoría en Dropi o documento compartido",
      },
      {
        key: "publication_responsible",
        label: "Responsable de publicación",
        type: "select",
        required: true,
        options: ["Producto", "Growth", "Comercial", "Comunicaciones", "Supplier Success", "Diseño"],
      },
    ],
  },

  // ── Nodo 8: Handoff ────────────────────────────────────────
  {
    key: "handoff",
    title: "Documento handoff",
    icon: "📄",
    description:
      'En este MVP "publicar" significa dejar un documento operativo para que la célula ejecute la campaña manualmente. No es una pantalla productiva.',
    fields: [
      {
        key: "handoff_format",
        label: "Formato del handoff",
        type: "select",
        required: true,
        options: ["Google Doc", "Notion", "HTML", "Sheet maestro", "Documento compartido"],
      },
      {
        key: "handoff_link",
        label: "Link del documento",
        type: "text",
        placeholder: "https://...",
      },
      {
        key: "handoff_audience",
        label: "Equipos que deben recibir el handoff",
        type: "textarea",
        required: true,
        placeholder: "Producto, Growth, Comercial, Supplier Success, Diseño...",
      },
      {
        key: "schedule",
        label: "Cronograma y responsables",
        type: "textarea",
        required: true,
        placeholder: "¿Quién hace qué y cuándo?",
      },
    ],
  },

  // ── Nodo 9: Medición ───────────────────────────────────────
  {
    key: "measure",
    title: "Medición del piloto",
    icon: "📊",
    description: "¿Qué se midió? ¿Hubo intención supplier, adopción dropshipper y señales comerciales?",
    fields: [
      {
        key: "supplier_metrics",
        label: "Métricas de supplier",
        type: "textarea",
        required: true,
        placeholder: "Invitados, respuestas, postulaciones, productos aprobados...",
      },
      {
        key: "dropshipper_metrics",
        label: "Métricas de dropshipper",
        type: "textarea",
        required: true,
        placeholder: "Impactados, clics, visitas, productos consultados o agregados...",
      },
      {
        key: "business_metrics",
        label: "Métricas de negocio",
        type: "textarea",
        required: true,
        placeholder: "Órdenes, GMV, unidades, productos quietos activados...",
      },
      {
        key: "learnings",
        label: "Aprendizajes clave",
        type: "textarea",
        placeholder: "¿Qué funcionó? ¿Qué no? ¿Qué sorprendió?",
      },
    ],
  },

  // ── Nodo 10: Decisión ──────────────────────────────────────
  {
    key: "decision",
    title: "Decisión final",
    icon: "🔀",
    description: "¿La dinámica justifica desarrollo, iteración o pausa?",
    fields: [
      {
        key: "decision",
        label: "Decisión de la célula",
        type: "select",
        required: true,
        options: [
          "Construir — hay tracción, priorizar desarrollo",
          "Iterar — hay señal pero falta ajustar",
          "Pausar — no hay señal suficiente",
        ],
      },
      {
        key: "rationale",
        label: "Justificación",
        type: "textarea",
        required: true,
        placeholder: "¿Por qué se tomó esta decisión? ¿Qué datos la respaldan?",
      },
      {
        key: "next_step",
        label: "Siguiente paso",
        type: "textarea",
        required: true,
        placeholder: "¿Qué viene después? Nueva iteración, backlog de desarrollo, nuevo experimento...",
      },
      {
        key: "executive_recommendation",
        label: "Recomendación ejecutiva",
        type: "textarea",
        placeholder: "Resumen en 2-3 líneas para presentar a stakeholders.",
      },
    ],
  },
];
