export type NodeKey =
  | "base" | "type" | "eligibility" | "calendar"
  | "invite" | "submission" | "showcase" | "handoff";

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

  // ── Nodo 1: Ficha base ─────────────────────────────────────────
  {
    key: "base",
    title: "Ficha base",
    icon: "➕",
    description:
      "Define la identidad de la campaña. Qué es, para qué existe y cuándo ocurre. Aquí se fija el objetivo único — no se vuelve a preguntar en los siguientes nodos.",
    fields: [
      {
        key: "name",
        label: "Nombre de la campaña",
        type: "text",
        required: true,
        placeholder: "ej. Día del Padre · Dropicup Mundial · Remates de Stock · Black Week",
      },
      {
        key: "short_description",
        label: "Descripción corta",
        type: "textarea",
        required: true,
        placeholder: "¿Qué busca esta campaña en una frase?",
        hint: "ej. Campaña para agrupar productos relacionados con regalos masculinos y validar si una vitrina curada aumenta la adopción de dropshippers.",
      },
      {
        key: "commercial_event",
        label: "Fecha comercial o evento",
        type: "text",
        required: true,
        placeholder: "ej. Día del Padre · Black Friday · Temporada escolar · Remate de fin de mes",
        hint: "Si no está asociada a una fecha comercial específica, describe el evento o contexto.",
      },
      {
        key: "country",
        label: "Países donde aplica",
        type: "multiselect",
        required: true,
        hint: "Validar que los países compartan la fecha o contexto comercial antes de seleccionar.",
        options: [
          "Colombia", "México", "Chile", "Argentina",
          "Perú", "Venezuela", "Costa Rica", "Panamá",
          "Paraguay", "Ecuador", "Bolivia",
        ],
      },
      {
        key: "responsible",
        label: "Responsable general de la campaña",
        type: "select",
        required: true,
        options: ["Producto", "Growth", "Comercial", "Supplier Success", "Comunicaciones"],
      },
      {
        key: "objective",
        label: "Objetivo único de la campaña",
        type: "select",
        required: true,
        hint: "Una campaña = un objetivo. No mezcles. Si necesitas varios objetivos, créa campañas separadas.",
        options: [
          "Aumentar órdenes",
          "Generar GMV",
          "Activar productos quietos",
          "Dar visibilidad a suppliers",
          "Ayudar a suppliers a salir de stock",
          "Activar suppliers nuevos",
          "Validar una categoría específica",
          "Validar descuentos como palanca",
        ],
        optionDescriptions: {
          "Aumentar órdenes": "Campañas masivas de temporada (Día de la Madre, Black Week, Día del Padre). Miden si la vitrina genera más órdenes en el período.",
          "Generar GMV": "Cuando el foco es el valor monetario total, no solo el volumen de órdenes. Útil para campañas de alto ticket.",
          "Activar productos quietos": "Productos publicados sin órdenes en 30/60/90 días. Objetivo: pasar de 'publicado' a 'con orden'.",
          "Dar visibilidad a suppliers": "El beneficio para el supplier es la exposición. No requiere descuento. Valida si la visibilidad sola genera participación.",
          "Ayudar a suppliers a salir de stock": "Remates. El supplier tiene inventario acumulado y necesita moverlo con precio especial.",
          "Activar suppliers nuevos": "Dar primera visibilidad a suppliers recién activados. Conecta con TTV-001.",
          "Validar una categoría específica": "Campañas por vertical: hogar, belleza, tecnología, mascotas. Miden si hay demanda diferenciada por categoría.",
          "Validar descuentos como palanca": "¿Un descuento real genera adopción diferencial vs productos sin descuento? Experimento controlado.",
        },
      },
      {
        key: "hypothesis",
        label: "Hipótesis",
        type: "textarea",
        required: true,
        placeholder: "Si [acción], entonces [resultado esperado], porque [razón].",
        hint: "ej. Si Dropi crea una vitrina curada de Día del Padre, los dropshippers tendrán mayor intención de explorar esos productos, generando órdenes incrementales.",
      },
      {
        key: "expected_result",
        label: "Resultado esperado",
        type: "textarea",
        required: true,
        placeholder: "¿Qué números o señales confirmarían que la campaña funcionó?",
        hint: "ej. Mínimo 20 suppliers participantes, 60+ productos aprobados, 30+ órdenes en la primera semana.",
      },
    ],
  },

  // ── Nodo 2: Tipo y mecánica ────────────────────────────────────
  {
    key: "type",
    title: "Tipo y mecánica",
    icon: "🏷️",
    description:
      "Clasifica la dinámica comercial y define si requiere descuento y cuál es el motivador principal para el supplier. No repite el objetivo — ese ya quedó en la ficha base.",
    fields: [
      {
        key: "campaign_type",
        label: "Tipo de dinámica",
        type: "select",
        required: true,
        options: [
          "Temporada",
          "Remate",
          "Visibilidad",
          "Por categoría",
          "Productos quietos",
          "Suppliers nuevos",
          "Alto margen",
          "Combos",
          "Por proveedor destacado",
          "Mixta",
        ],
        optionDescriptions: {
          "Temporada": "Alrededor de una fecha comercial (Black Week, Navidad, Día del Padre…). Mueve órdenes con contexto claro para pautar. Descuento opcional.",
          "Remate": "Para salir de stock acumulado. El supplier hace un precio especial. Requiere descuento real.",
          "Visibilidad": "El beneficio es la exposición en vitrina curada. Valida si el supplier participa solo por visibilidad, sin descuento.",
          "Por categoría": "Agrupa productos por vertical temática. Facilita al dropshipper encontrar productos con una intención de venta clara.",
          "Productos quietos": "Productos publicados sin órdenes en 30/60/90 días. Objetivo: activarlos.",
          "Suppliers nuevos": "Acelera el TTV de suppliers recién activados dándoles primera visibilidad.",
          "Alto margen": "Agrupa productos atractivos por rentabilidad. Para dropshippers que escalan pauta.",
          "Combos": "Productos agrupados para aumentar ticket. Puede ser combo sugerido por el supplier o armado por Dropi.",
          "Por proveedor destacado": "Visibilidad al catálogo completo o una selección de un supplier estratégico.",
          "Mixta": "Combina varias lógicas (ej. Dropicup = temporada + visibilidad + productos para pauta).",
        },
      },
      {
        key: "requires_discount",
        label: "¿Requiere descuento?",
        type: "select",
        required: true,
        hint: "Nota: actualmente no existe funcionalidad de descuento directo en plataforma. Para campañas con descuento, definir cómo se opera manualmente.",
        options: [
          "No requiere descuento",
          "Opcional — el supplier decide",
          "Obligatorio — sin descuento no entra",
          "Depende del producto",
        ],
      },
      {
        key: "has_expiration",
        label: "¿Tiene fecha de cierre?",
        type: "select",
        required: true,
        hint: "Se recomienda que todas las campañas tengan fecha de cierre. Las fechas exactas se definen en el nodo Calendario.",
        options: ["Sí", "No"],
      },
      {
        key: "supplier_motivator",
        label: "Motivador principal del supplier",
        type: "select",
        required: true,
        hint: "¿Qué le ofrece esta campaña al supplier? Define el ángulo del mensaje de convocatoria.",
        options: [
          "Vender más volumen",
          "Mayor visibilidad",
          "Salir de stock",
          "Activar producto nuevo",
          "Conseguir primeras órdenes",
          "Destacar su catálogo",
          "Mover producto quieto",
          "Mejorar rotación",
        ],
      },
      {
        key: "notes",
        label: "Notas adicionales",
        type: "textarea",
        placeholder: "Contexto relevante para la célula sobre esta mecánica...",
      },
    ],
  },

  // ── Nodo 3: Segmento y elegibilidad ───────────────────────────
  {
    key: "eligibility",
    title: "Segmento y elegibilidad",
    icon: "✅",
    description:
      "Define quién puede entrar a la campaña. Unifica segmentación y reglas de participación en un solo bloque. Aquí se responde: ¿qué suppliers y productos aplican?",
    fields: [
      {
        key: "universe",
        label: "Universo base",
        type: "select",
        required: true,
        hint: "Recomendación: Suppliers + productos — no basta saber qué supplier participa; también hay que saber si tiene productos que aplican.",
        options: [
          "Suppliers + productos",
          "Solo suppliers",
          "Solo productos",
          "Base comercial manual",
          "Lista cargada en Sheet",
        ],
      },
      {
        key: "supplier_type",
        label: "Tipo de supplier",
        type: "multiselect",
        required: true,
        options: ["Verificado", "Premium", "Exclusivo", "Todos los verificados"],
      },
      {
        key: "categories_theme",
        label: "Categorías o temática esperada",
        type: "textarea",
        required: true,
        placeholder: "ej. Tecnología, moda masculina, cuidado personal, accesorios, hogar, herramientas, deporte.",
        hint: "Para campañas de temporada: define qué tipo de productos son coherentes con la campaña. Protege la vitrina de productos fuera de contexto.",
      },
      {
        key: "mandatory_conditions",
        label: "Condiciones obligatorias",
        type: "condition_builder",
        required: true,
        hint: "Todas deben cumplirse. Un product o supplier que no las cumpla queda fuera automáticamente.",
        conditionLogic: "AND",
      },
      {
        key: "optional_conditions",
        label: "Condiciones opcionales",
        type: "condition_builder",
        hint: "Permiten incluir casos por oportunidad aunque no sean el segmento principal.",
        conditionLogic: "OR",
      },
      {
        key: "exclusions",
        label: "Exclusiones",
        type: "condition_builder",
        required: true,
        hint: "Si se cumple cualquiera de estas, el producto o supplier queda fuera sin excepción.",
        conditionLogic: "OR",
      },
      {
        key: "min_stock",
        label: "Stock mínimo requerido (unidades)",
        type: "text",
        required: true,
        placeholder: "ej. 300",
        hint: "Para campañas masivas se sugiere mínimo 300 unidades. Para campañas tácticas puede ser menor.",
      },
      {
        key: "public_products_only",
        label: "¿Solo productos públicos?",
        type: "select",
        required: true,
        hint: "Recomendado: Sí. Los productos privatizados no pueden ser movidos por dropshippers que no tengan acceso.",
        options: ["Sí — solo productos públicos", "No — incluir también privados", "Depende del supplier"],
      },
      {
        key: "keyword_marco",
        label: "Marco o palabra clave de la campaña",
        type: "text",
        placeholder: "ej. DíadelPadre2026 · Dropicup · RematesJunio",
        hint: "Al usar un marco o palabra clave en el título del producto, aparece cuando el dropshipper busca ese término. Aprendizaje de Dropicop.",
      },
      {
        key: "max_products_per_supplier",
        label: "Máximo de productos por supplier",
        type: "text",
        placeholder: "ej. 5 productos por supplier",
        hint: "Limita la sobre-representación de un solo supplier en la vitrina.",
      },
      {
        key: "min_discount",
        label: "Descuento mínimo (%) — si aplica",
        type: "text",
        placeholder: "ej. 15% — dejar vacío si no aplica",
      },
      {
        key: "segment_size",
        label: "Tamaño esperado del segmento",
        type: "text",
        required: true,
        placeholder: "ej. 20–40 suppliers / 100–150 productos",
        hint: "Para MVP: 20–50 suppliers o 50–150 productos. Segmentos más grandes son más difíciles de operar manualmente.",
      },
      {
        key: "data_source",
        label: "Fuente de datos para la segmentación",
        type: "multiselect",
        required: true,
        options: [
          "Recomendación Supplier Success",
          "Comercial",
          "Reporte de productos sin venta",
          "Reporte de alto stock",
          "Base de productos Dropi",
          "Sheet manual",
          "CRM / GHL",
          "Data de campañas anteriores",
        ],
      },
      {
        key: "segment_responsible",
        label: "Responsable de segmentación",
        type: "select",
        required: true,
        options: ["Supplier Success", "Comercial", "Producto", "Growth", "Líder de campaña"],
      },
    ],
  },

  // ── Nodo 4: Calendario operativo ──────────────────────────────
  {
    key: "calendar",
    title: "Calendario operativo",
    icon: "📅",
    description:
      "Define cuándo ocurre cada cosa. Las campañas fallan cuando se arman encima de la fecha. Planear hacia atrás desde el evento comercial: supplier necesita tiempo para postular, dropshipper necesita tiempo para pautar.",
    fields: [
      {
        key: "dates",
        label: "Fechas de la campaña",
        type: "dates_group",
        required: true,
        hint: "Regla para campañas masivas: convocatoria al supplier mínimo 3 semanas antes del evento. Dropshippers necesitan ~1 mes para pautar.",
        subfields: [
          { key: "date_convocation_start",  label: "Inicio convocatoria supplier" },
          { key: "date_submission_end",      label: "Cierre postulación supplier" },
          { key: "date_review_close",        label: "Curaduría y aprobación de productos" },
          { key: "date_assets_delivery",     label: "Entrega de insumos (piezas, marco, instructivo)" },
          { key: "date_showcase_publish",    label: "Publicación de vitrina" },
          { key: "date_dropshipper_comms",   label: "Comunicación a dropshippers" },
          { key: "date_campaign_start",      label: "Inicio visible de campaña" },
          { key: "date_campaign_end",        label: "Cierre de campaña" },
        ],
      },
      {
        key: "calendar_notes",
        label: "Notas sobre el calendario",
        type: "textarea",
        placeholder: "Restricciones, días de restricción, semanas sin disponibilidad del equipo...",
        hint: "ej. La semana del 10-jun Mich no está disponible. Las piezas dependen de que Diseño confirme disponibilidad.",
      },
    ],
  },

  // ── Nodo 5: Convocatoria supplier ──────────────────────────────
  {
    key: "invite",
    title: "Convocatoria supplier",
    icon: "📣",
    description:
      "Define cómo se entera el supplier de la campaña y cómo se le lleva a postular. No repite países, reglas ni segmento — esa información ya está definida.",
    fields: [
      {
        key: "invite_type",
        label: "Tipo de convocatoria",
        type: "select",
        required: true,
        options: ["Abierta", "Segmentada", "Por invitación", "Comercial manual", "Mixta"],
        optionDescriptions: {
          "Abierta": "A todos los suppliers que cumplen las reglas. Para remates, temporadas grandes o categorías amplias.",
          "Segmentada": "Solo a suppliers que cumplen una condición específica. Para campañas acotadas por categoría.",
          "Por invitación": "Mensaje personalizado: 'Tu catálogo fue seleccionado para...'. Para suppliers estratégicos o premium.",
          "Comercial manual": "El comercial contacta directamente. Más control, más trabajo. Recomendado para el MVP.",
          "Mixta": "Invitación directa para estratégicos + convocatoria abierta al resto del segmento.",
        },
      },
      {
        key: "channels",
        label: "Canales de comunicación",
        type: "multiselect",
        required: true,
        hint: "El primero que selecciones será el canal principal.",
        ranked: true,
        options: ["Comercial directo", "WhatsApp", "GHL", "Email", "Userpilot", "Modal in-app", "Banner in-app", "Llamada", "Comunidad / grupo"],
      },
      {
        key: "message_template",
        label: "Mensaje base de convocatoria",
        type: "textarea",
        required: true,
        placeholder: "Escribe el mensaje que recibirá el supplier...",
        hint: "Incluir: nombre de campaña · beneficio para el supplier · qué productos puede postular · fecha límite · CTA.",
      },
      {
        key: "cta",
        label: "Call to action (CTA)",
        type: "select",
        required: true,
        options: ["Postular productos", "Confirmar participación", "Completar formulario", "Hablar con comercial"],
      },
      {
        key: "submission_link",
        label: "Link o mecanismo de postulación",
        type: "text",
        required: true,
        placeholder: "https:// — Google Form, Sheet, GHL, Airtable o contacto comercial directo",
        hint: "Si aún no está definido el mecanismo, escribe 'Por definir — contacto con [nombre del comercial]'.",
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
        label: "Lista o fuente de suppliers a convocar",
        type: "textarea",
        required: true,
        placeholder: "ej. Sheet maestro del 2026-06-XX — 28 suppliers Colombia con stock > 300 unidades.",
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

  // ── Nodo 6: Postulación ────────────────────────────────────────
  {
    key: "submission",
    title: "Postulación de productos",
    icon: "📝",
    description:
      "Define cómo entran los productos a la campaña y qué datos se capturan. Puede ser el supplier quien postula o el equipo quien selecciona internamente.",
    fields: [
      {
        key: "submission_channel",
        label: "Mecanismo de captura",
        type: "select",
        required: true,
        options: [
          "Google Form",
          "Airtable Form",
          "Sheet diligenciado por comercial",
          "Formulario GHL",
          "Selección interna por Supplier Success",
          "Tally",
        ],
        optionDescriptions: {
          "Google Form": "Rápido de crear, fácil de compartir. Respuestas van a Sheet. Recomendado para MVP.",
          "Airtable Form": "Mejor estructura de base de datos. Útil si ya gestionan campañas en Airtable.",
          "Sheet diligenciado por comercial": "El comercial registra en nombre del supplier. Más control, más trabajo manual.",
          "Formulario GHL": "Para suppliers que ya están en el pipeline de GHL.",
          "Selección interna por Supplier Success": "El equipo selecciona productos sin postulación abierta al supplier.",
          "Tally": "Alternativa ligera a Typeform. Buena UX para el supplier.",
        },
      },
      {
        key: "form_link",
        label: "Link del formulario",
        type: "text",
        required: true,
        placeholder: "https:// — link para el supplier o el comercial",
      },
      {
        key: "supplier_required_fields",
        label: "Datos del supplier requeridos",
        type: "multiselect",
        required: true,
        options: ["Nombre del supplier", "ID del supplier", "País", "Contacto (WhatsApp / correo)", "Comercial responsable"],
      },
      {
        key: "product_required_fields",
        label: "Datos del producto requeridos",
        type: "multiselect",
        required: true,
        options: ["Nombre del producto", "ID del producto", "Link del producto en Dropi", "Categoría", "Estado (activo/inactivo)", "Público o privado"],
      },
      {
        key: "commercial_required_fields",
        label: "Datos comerciales requeridos",
        type: "multiselect",
        required: true,
        options: ["Precio actual", "Precio de campaña", "Descuento ofrecido (%)", "Stock disponible", "Vigencia del precio especial"],
      },
      {
        key: "required_confirmations",
        label: "Confirmaciones requeridas al supplier",
        type: "multiselect",
        options: [
          "Confirma que el producto tiene stock disponible",
          "Confirma que el precio registrado es válido para la campaña",
          "Acepta que Dropi puede aprobar o rechazar el producto",
          "Confirma capacidad de despacho durante la campaña",
          "Confirma vigencia del precio si hay descuento",
        ],
      },
      {
        key: "submission_responsible",
        label: "Responsable de gestionar las postulaciones",
        type: "select",
        required: true,
        options: ["Supplier Success", "Comercial", "Producto", "Growth", "Líder de campaña"],
      },
      {
        key: "submission_notes",
        label: "Instrucciones para el supplier o el comercial",
        type: "textarea",
        placeholder: "¿Qué debe saber el supplier antes de postular? ¿Qué debe hacer el comercial al registrar?",
      },
    ],
  },

  // ── Nodo 7: Vitrina ────────────────────────────────────────────
  {
    key: "showcase",
    title: "Vitrina para dropshippers",
    icon: "🛍️",
    description:
      "Define cómo se presentan los productos al dropshipper. La campaña solo tiene valor si el dropshipper percibe una oportunidad clara. Coherencia temática obligatoria.",
    fields: [
      {
        key: "showcase_type",
        label: "Tipo de vitrina",
        type: "select",
        required: true,
        options: [
          "Campaña GHL / WhatsApp",
          "Sheet curado",
          "Categoría temporal beta",
          "Landing manual",
          "Airtable view",
          "Documento handoff comercial",
          "Mixta",
        ],
        optionDescriptions: {
          "Campaña GHL / WhatsApp": "Mensaje con productos destacados enviado a dropshippers segmentados. Ej: 'Estos son los 20 productos del Día del Padre'.",
          "Sheet curado": "Vista compartida con links de productos. MVP rápido. Los dropshippers comparten Excels entre ellos.",
          "Categoría temporal beta": "Categoría temporal en el catálogo de Dropi. Simula el módulo sin construirlo.",
          "Landing manual": "Página con cards de productos. Mejor experiencia, algo más de esfuerzo.",
          "Airtable view": "Alternativa visual a Sheet si ya gestionan la campaña en Airtable.",
          "Documento handoff comercial": "El comercial o Growth comunica los productos directamente. Más manual.",
          "Mixta": "Combina dos formatos (ej. categoría temporal + envío GHL).",
        },
      },
      {
        key: "showcase_name",
        label: "Nombre visible para el dropshipper",
        type: "text",
        required: true,
        placeholder: "ej. Día del Padre 2026 · Remates de Stock · Belleza de Temporada",
      },
      {
        key: "showcase_description",
        label: "Descripción visible",
        type: "textarea",
        required: true,
        placeholder: "Una frase que explica la oportunidad al dropshipper.",
        hint: "ej. Productos seleccionados por Dropi para regalar este Día del Padre. Todo para que tus clientes encuentren el regalo perfecto.",
      },
      {
        key: "product_source",
        label: "Fuente de los productos incluidos",
        type: "select",
        required: true,
        options: [
          "Lista de productos aprobados del nodo anterior",
          "Sheet maestro de campaña",
          "Categoría temporal en Dropi",
          "Airtable view",
          "Lista manual",
        ],
      },
      {
        key: "product_groupings",
        label: "Agrupaciones internas",
        type: "multiselect",
        hint: "Evita presentar una lista plana. Agrupa por intención de compra o característica clave.",
        options: [
          "Destacados", "Por categoría", "Por supplier",
          "Alto margen", "Remates / descuento",
          "Alto stock", "Terminan pronto", "Nuevos", "Productos para pauta",
        ],
      },
      {
        key: "badges",
        label: "Badges o señales visuales",
        type: "multiselect",
        hint: "Máximo 2–3 badges por producto.",
        options: [
          "Seleccionado por Dropi", "Precio especial", "Remate",
          "Producto de temporada", "Alto stock", "Alto margen",
          "Nuevo", "Últimas unidades", "Termina pronto", "Campaña activa",
        ],
      },
      {
        key: "product_visible_info",
        label: "Información visible por producto",
        type: "multiselect",
        required: true,
        hint: "Mínimo: imagen, nombre, supplier, precio, stock y CTA.",
        options: ["Imagen", "Nombre del producto", "Supplier", "Categoría", "Precio actual", "Precio de campaña", "Descuento (%)", "Stock disponible", "Vigencia", "Badge", "CTA"],
      },
      {
        key: "cta_main",
        label: "CTA principal",
        type: "select",
        required: true,
        options: ["Ver producto", "Tomar producto", "Agregar a mi tienda", "Contactar supplier", "Ver catálogo del supplier"],
        optionDescriptions: {
          "Ver producto": "Lleva al dropshipper a la ficha del producto en Dropi. Recomendado para el MVP.",
          "Tomar producto": "Agrega directamente el producto al catálogo del dropshipper.",
          "Agregar a mi tienda": "Similar a tomar producto.",
          "Contactar supplier": "Para campañas de relación directa supplier-dropshipper.",
          "Ver catálogo del supplier": "Lleva a todo el catálogo, no solo al producto.",
        },
      },
      {
        key: "distribution_channels",
        label: "Canales de distribución al dropshipper",
        type: "multiselect",
        required: true,
        ranked: true,
        hint: "El primero que selecciones será el canal principal.",
        options: ["GHL", "WhatsApp", "Userpilot", "Email", "Comunidad / grupo", "Comercial", "Banner in-app", "Modal in-app", "Link compartible"],
      },
      {
        key: "validity_display",
        label: "Vigencia visible para el dropshipper",
        type: "text",
        required: true,
        placeholder: "ej. Válido hasta el 20 de junio · Precio especial por tiempo limitado",
      },
      {
        key: "showcase_link",
        label: "Link o documento de la vitrina",
        type: "text",
        placeholder: "https:// — landing, sheet, categoría en Dropi o documento compartido (puede dejarse vacío hasta publicar)",
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

  // ── Nodo 8: Handoff final ──────────────────────────────────────
  {
    key: "handoff",
    title: "Handoff final",
    icon: "📋",
    description:
      "Consolida todo en el documento operativo que permite ejecutar, validar y alinear a todas las áreas. No pide información nueva — resume lo que ya se definió.",
    fields: [
      {
        key: "handoff_format",
        label: "Formato del handoff",
        type: "select",
        required: true,
        options: ["Google Doc", "Sheet maestro", "Notion", "PDF", "Presentación"],
      },
      {
        key: "handoff_link",
        label: "Link del documento de handoff",
        type: "text",
        placeholder: "https:// — puede dejarse vacío hasta generar el doc",
      },
      {
        key: "handoff_audience",
        label: "Audiencia del handoff",
        type: "multiselect",
        required: true,
        options: ["Producto", "Growth", "Comercial", "Supplier Success", "Comunicaciones", "Diseño", "María Ossa", "Lucho"],
      },
      {
        key: "schedule",
        label: "Cronograma resumido de ejecución",
        type: "textarea",
        required: true,
        placeholder: "ej.\nSemana 1 — Segmentación y contacto supplier\nSemana 2 — Postulaciones y curaduría\nSemana 3 — Publicar vitrina y activar dropshippers\nSemanas 4+ — Seguimiento y medición",
        hint: "Derivar de las fechas del calendario. Describir qué hace cada área en cada etapa.",
      },
      {
        key: "area_responsibilities",
        label: "Responsables por área",
        type: "textarea",
        required: true,
        placeholder: "Comercial: segmentar y convocar suppliers\nGrowth: comunicar a dropshippers y medir clics\nSupplier Success: revisar postulaciones\nProducto: publicar vitrina y reportar resultados",
      },
      {
        key: "risks",
        label: "Riesgos identificados",
        type: "textarea",
        placeholder: "ej. Sin mecanismo de postulación definido — vitrina puede quedar vacía.\nDescuento no disponible en plataforma — operar manualmente.",
      },
      {
        key: "metrics",
        label: "Métricas de seguimiento",
        type: "textarea",
        required: true,
        placeholder: "Supplier: invitados / respondieron / postularon / aprobados\nDropshipper: impactados / clics vitrina / productos tomados\nNegocio: órdenes / GMV / productos activados",
      },
      {
        key: "validation_status",
        label: "Estado de validación",
        type: "select",
        required: true,
        hint: "Antes de ejecutar, alinear con María Ossa o Lucho según el alcance de la campaña.",
        options: [
          "Borrador — pendiente de revisión interna",
          "Revisado internamente — pendiente de alineación con stakeholder",
          "Alineado con stakeholder — listo para ejecutar",
          "En ejecución",
        ],
      },
    ],
  },

];
