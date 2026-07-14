export type NodeKey =
  | "base" | "type" | "eligibility" | "calendar"
  | "invite" | "submission" | "showcase" | "handoff";

export type FieldType = "text" | "textarea" | "select" | "multiselect";
export type NodeData = Record<string, string>;

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  optionDescriptions?: Record<string, string>;
  ranked?: boolean;
  /** Oculta el campo cuando devuelve true. Recibe los datos de TODOS los nodos, indexados por NodeKey. */
  hidden?: (allData: Partial<Record<NodeKey, NodeData>>) => boolean;
}

export interface SectionDefinition {
  key: string;
  title: string;
  subtitle: string;
  fields: Field[];
}

export type NodeIconKey =
  | "file-text" | "tag" | "check-circle-2" | "calendar"
  | "megaphone" | "clipboard-list" | "store" | "file-check-2";

export interface NodeDefinition {
  key: NodeKey;
  title: string;
  icon: NodeIconKey;
  description: string;
  sections: SectionDefinition[];
}

export const NODE_DEFINITIONS: NodeDefinition[] = [
  // ── Nodo 1: Ficha base ─────────────────────────────────────────
  {
    key: "base",
    title: "Ficha base",
    icon: "file-text",
    description: "Define la identidad de la campaña. Qué es, para qué existe y cuándo ocurre.",
    sections: [
      {
        key: "identidad",
        title: "Identidad",
        subtitle: "Nombre, descripción y evento comercial",
        fields: [
          {
            key: "name",
            label: "Nombre de la campaña",
            type: "text",
            required: true,
            placeholder: "ej. Día del Padre · Dropicup · Remates de Stock"
          },
          {
            key: "short_description",
            label: "Descripción corta",
            type: "textarea",
            required: true,
            placeholder: "¿Qué busca esta campaña en una frase?",
            hint: "ej. Validar si una vitrina curada de Día del Padre aumenta la adopción de dropshippers."
          },
          {
            key: "commercial_event",
            label: "Fecha comercial o evento",
            type: "text",
            required: true,
            placeholder: "ej. Día del Padre · Black Friday · Temporada escolar",
            hint: "Si no hay fecha comercial específica, describe el contexto."
          }
        ]
      },
      {
        key: "alcance",
        title: "Alcance",
        subtitle: "Países y responsable",
        fields: [
          {
            key: "country",
            label: "Países donde aplica",
            type: "multiselect",
            required: true,
            hint: "Valida que los países compartan el contexto comercial antes de seleccionar.",
            options: [
              "Colombia", "México", "Chile", "Argentina", "Perú",
              "Venezuela", "Costa Rica", "Panamá", "Paraguay", "Ecuador", "Bolivia"
            ]
          },
          {
            key: "responsible",
            label: "Responsable general",
            type: "select",
            required: true,
            options: ["Producto", "Growth", "Comercial", "Supplier Success", "Comunicaciones"]
          }
        ]
      },
      {
        key: "objetivo",
        title: "Objetivo e hipótesis",
        subtitle: "Qué se quiere lograr y cómo se medirá",
        fields: [
          {
            key: "objective",
            label: "Objetivo de la campaña",
            type: "select",
            required: true,
            hint: "Una campaña, un objetivo. Si necesitas varios, crea campañas separadas.",
            options: [
              "Aumentar órdenes", "Generar GMV", "Activar productos quietos",
              "Dar visibilidad a suppliers", "Ayudar a suppliers a salir de stock",
              "Activar suppliers nuevos", "Validar una categoría específica",
              "Validar descuentos como palanca"
            ],
            optionDescriptions: {
              "Aumentar órdenes": "Campañas masivas de temporada. Miden si la vitrina genera más órdenes.",
              "Generar GMV": "El foco es el valor monetario total. Útil para campañas de alto ticket.",
              "Activar productos quietos": "Productos sin órdenes en 30/60/90 días. Objetivo: pasar de publicado a con orden.",
              "Dar visibilidad a suppliers": "El beneficio es la exposición. Valida si la visibilidad sola genera participación.",
              "Ayudar a suppliers a salir de stock": "Remates. El supplier tiene inventario acumulado y necesita moverlo.",
              "Activar suppliers nuevos": "Primera visibilidad a suppliers recién activados.",
              "Validar una categoría específica": "Campañas por vertical. Miden si hay demanda diferenciada.",
              "Validar descuentos como palanca": "¿Un descuento real genera adopción diferencial?"
            }
          },
          {
            key: "hypothesis",
            label: "Hipótesis",
            type: "textarea",
            required: true,
            placeholder: "Si [acción], entonces [resultado esperado], porque [razón]."
          },
          {
            key: "expected_result",
            label: "Resultado esperado",
            type: "textarea",
            required: true,
            placeholder: "¿Qué números o señales confirmarían que la campaña funcionó?",
            hint: "ej. 20+ suppliers, 60+ productos aprobados, 30+ órdenes en la primera semana."
          }
        ]
      }
    ]
  },

  // ── Nodo 2: Tipo y mecánica ────────────────────────────────────
  {
    key: "type",
    title: "Tipo y mecánica",
    icon: "tag",
    description: "Clasifica la dinámica y define el motivador principal del supplier.",
    sections: [
      {
        key: "tipo_principal",
        title: "Tipo de dinámica",
        subtitle: "Categoría y mecánica de la campaña",
        fields: [
          {
            key: "campaign_type",
            label: "Tipo de dinámica",
            type: "select",
            required: true,
            options: [
              "Temporada", "Remate", "Visibilidad", "Por categoría",
              "Suppliers nuevos", "Alto margen", "Por proveedor destacado", "Mixta"
            ],
            optionDescriptions: {
              "Temporada": "Alrededor de una fecha comercial. Mueve órdenes con contexto claro para pautar.",
              "Remate": "Para salir de stock acumulado. El supplier hace un precio especial.",
              "Visibilidad": "El beneficio es la exposición en vitrina curada, sin descuento obligatorio.",
              "Por categoría": "Agrupa productos por vertical. Facilita al dropshipper encontrar productos con intención clara.",
              "Suppliers nuevos": "Acelera el TTV de suppliers recién activados dándoles primera visibilidad.",
              "Alto margen": "Agrupa productos atractivos por rentabilidad. Para dropshippers que escalan pauta.",
              "Por proveedor destacado": "Visibilidad al catálogo o selección de un supplier estratégico.",
              "Mixta": "Combina varias lógicas (ej. Dropicup = temporada + visibilidad + productos para pauta)."
            }
          },
          {
            key: "requires_discount",
            label: "¿Requiere descuento?",
            type: "select",
            required: true,
            hint: "Actualmente no hay descuento directo en plataforma. Si aplica, definir cómo se opera manualmente.",
            options: ["No requiere descuento", "Opcional — el supplier decide", "Obligatorio — sin descuento no entra"]
          }
        ]
      },
      {
        key: "motivador",
        title: "Motivador del supplier",
        subtitle: "Ángulo para el mensaje de convocatoria",
        fields: [
          {
            key: "supplier_motivator",
            label: "Motivador principal",
            type: "select",
            required: true,
            hint: "¿Qué le ofrece esta campaña al supplier? Define el ángulo del mensaje.",
            options: ["Mayor visibilidad", "Vender más volumen", "Salir de stock acumulado", "Activar producto nuevo", "Conseguir primeras órdenes", "Mejorar rotación"]
          },
          {
            key: "notes",
            label: "Notas adicionales",
            type: "textarea",
            placeholder: "Contexto relevante para la célula sobre esta mecánica..."
          }
        ]
      }
    ]
  },

  // ── Nodo 3: Segmento y elegibilidad ───────────────────────────
  {
    key: "eligibility",
    title: "Segmento y elegibilidad",
    icon: "check-circle-2",
    description: "Define quién puede entrar a la campaña — qué suppliers y qué productos aplican.",
    sections: [
      {
        key: "universo",
        title: "Universo y perfil",
        subtitle: "Base y tipo de supplier esperado",
        fields: [
          {
            key: "universe",
            label: "Universo base",
            type: "select",
            required: true,
            hint: "Recomendado: Suppliers + productos. No basta saber qué supplier — también si tiene productos que aplican.",
            options: ["Suppliers + productos", "Solo suppliers", "Solo productos", "Base comercial manual", "Lista cargada en Sheet"]
          },
          {
            key: "supplier_type",
            label: "Tipo de supplier",
            type: "multiselect",
            required: true,
            options: ["Verificado", "Premium", "Exclusivo", "Todos los verificados"]
          },
          {
            key: "categories_theme",
            label: "Categorías o temática esperada",
            type: "textarea",
            required: true,
            placeholder: "ej. Tecnología, moda masculina, cuidado personal, accesorios, hogar.",
            hint: "Define qué productos son coherentes con la campaña. Protege la vitrina de productos fuera de contexto."
          }
        ]
      },
      {
        key: "parametros",
        title: "Parámetros comerciales",
        subtitle: "Criterios mínimos de participación",
        fields: [
          {
            key: "min_stock",
            label: "Stock mínimo requerido (unidades)",
            type: "text",
            required: true,
            placeholder: "ej. 300",
            hint: "Para campañas masivas se sugiere mínimo 300 unidades."
          },
          {
            key: "keyword_marco",
            label: "Palabra clave o marco de campaña",
            type: "text",
            placeholder: "ej. DíadelPadre2026 · Dropicup · RematesJunio",
            hint: "Los suppliers aprobados agregan esta palabra al título del producto. Permite filtrar la vitrina sin desarrollo."
          },
          {
            key: "max_products_per_supplier",
            label: "Máximo de productos por supplier",
            type: "text",
            placeholder: "ej. 5",
            hint: "Limita la sobre-representación de un solo supplier en la vitrina."
          },
          {
            key: "min_discount",
            label: "Descuento mínimo (%) — si aplica",
            type: "text",
            placeholder: "ej. 15% — dejar vacío si no aplica",
            hidden: (allData) => allData.type?.requires_discount === "No requiere descuento"
          },
          {
            key: "eligibility_notes",
            label: "Notas o excepciones de elegibilidad",
            type: "textarea",
            placeholder: "Solo agrega excepciones o matices que los campos de arriba no cubran. No repitas stock, tipo de supplier ni categorías — ya quedaron definidos.",
            hint: "Opcional. Los campos estructurados de arriba ya son suficientes para filtrar; usa esto solo para casos especiales."
          },
          {
            key: "segment_responsible",
            label: "Responsable de segmentación",
            type: "select",
            required: true,
            options: ["Supplier Success", "Comercial", "Producto", "Growth", "Líder de campaña"]
          }
        ]
      }
    ]
  },

  // ── Nodo 4: Calendario operativo ──────────────────────────────
  {
    key: "calendar",
    title: "Calendario operativo",
    icon: "calendar",
    description: "Define cuándo ocurre cada fase. Planear hacia atrás desde el evento: el supplier necesita tiempo para postular, el dropshipper para pautar.",
    sections: [
      {
        key: "fechas",
        title: "Fechas clave",
        subtitle: "Desde la convocatoria hasta el cierre",
        fields: [
          {
            key: "date_convocation_start",
            label: "Inicio convocatoria supplier",
            type: "text",
            required: true,
            placeholder: "ej. 12/jun/2026"
          },
          {
            key: "date_submission_end",
            label: "Cierre postulación supplier",
            type: "text",
            required: true,
            placeholder: "ej. 20/jun/2026"
          },
          {
            key: "date_showcase_publish",
            label: "Publicación de vitrina",
            type: "text",
            required: true,
            placeholder: "ej. 25/jun/2026"
          },
          {
            key: "date_campaign_start",
            label: "Inicio visible de campaña",
            type: "text",
            required: true,
            placeholder: "ej. 26/jun/2026"
          },
          {
            key: "date_campaign_end",
            label: "Cierre de campaña",
            type: "text",
            required: true,
            placeholder: "ej. 10/jul/2026"
          },
          {
            key: "date_review_close",
            label: "Curaduría y aprobación",
            type: "text",
            placeholder: "ej. 22/jun/2026 (opcional)"
          },
          {
            key: "date_assets_delivery",
            label: "Entrega de insumos / marcos",
            type: "text",
            placeholder: "ej. 24/jun/2026 (opcional)"
          },
          {
            key: "date_dropshipper_comms",
            label: "Comunicación a dropshippers",
            type: "text",
            placeholder: "ej. 26/jun/2026 (opcional)"
          },
          {
            key: "calendar_notes",
            label: "Notas sobre el calendario",
            type: "textarea",
            placeholder: "Restricciones, semanas sin disponibilidad del equipo, dependencias de diseño..."
          }
        ]
      }
    ]
  },

  // ── Nodo 5: Convocatoria supplier ──────────────────────────────
  {
    key: "invite",
    title: "Convocatoria supplier",
    icon: "megaphone",
    description: "Define cómo se entera el supplier de la campaña y cómo se le lleva a postular.",
    sections: [
      {
        key: "convocatoria_tipo",
        title: "Tipo y canales",
        subtitle: "Cómo se contacta al supplier",
        fields: [
          {
            key: "invite_type",
            label: "Tipo de convocatoria",
            type: "select",
            required: true,
            options: ["Abierta", "Segmentada", "Por invitación directa", "Comercial manual", "Mixta"],
            optionDescriptions: {
              "Abierta": "A todos los suppliers que cumplen las reglas.",
              "Segmentada": "Solo a suppliers que cumplen una condición específica.",
              "Por invitación directa": "Mensaje personalizado para suppliers estratégicos o premium.",
              "Comercial manual": "El comercial contacta directamente. Más control. Recomendado para el MVP.",
              "Mixta": "Invitación directa para estratégicos + convocatoria abierta al resto."
            }
          },
          {
            key: "channels",
            label: "Canales de comunicación",
            type: "multiselect",
            required: true,
            ranked: true,
            hint: "El primero que selecciones será el canal principal.",
            options: ["Comercial directo", "WhatsApp", "GHL", "Email", "Userpilot", "Modal in-app", "Banner in-app", "Llamada", "Comunidad / grupo"]
          },
          {
            key: "send_responsible",
            label: "Responsable del envío",
            type: "select",
            required: true,
            options: ["Comercial", "Growth", "Comunicaciones", "Supplier Success", "Producto", "Líder de campaña"]
          }
        ]
      },
      {
        key: "mensaje",
        title: "Mensaje y postulación",
        subtitle: "Qué recibe el supplier y cómo responde",
        fields: [
          {
            key: "message_template",
            label: "Mensaje base de convocatoria",
            type: "textarea",
            required: true,
            placeholder: "Escribe el mensaje que recibirá el supplier...",
            hint: "Incluir: nombre de campaña · beneficio · qué productos puede postular · fecha límite · CTA."
          },
          {
            key: "submission_link",
            label: "Link o mecanismo de postulación",
            type: "text",
            required: true,
            placeholder: "https:// — Google Form, Sheet, GHL o contacto directo",
            hint: "Si no está definido, escribe 'Por definir — contacto con [nombre del comercial]'."
          },
          {
            key: "supplier_list",
            label: "Fuente de suppliers a convocar",
            type: "textarea",
            required: true,
            placeholder: "ej. Sheet maestro del 2026-06-12 — 28 suppliers Colombia con stock > 300 unidades."
          }
        ]
      }
    ]
  },

  // ── Nodo 6: Postulación ────────────────────────────────────────
  {
    key: "submission",
    title: "Postulación de productos",
    icon: "clipboard-list",
    description: "Define cómo entran los productos a la campaña y qué datos se capturan.",
    sections: [
      {
        key: "mecanismo",
        title: "Mecanismo de captura",
        subtitle: "Cómo y dónde postula el supplier",
        fields: [
          {
            key: "submission_channel",
            label: "Mecanismo de captura",
            type: "select",
            required: true,
            options: ["Google Form", "Airtable Form", "Sheet diligenciado por comercial", "Formulario GHL", "Selección interna por Supplier Success", "Tally"],
            optionDescriptions: {
              "Google Form": "Rápido de crear. Respuestas van a Sheet. Recomendado para MVP.",
              "Airtable Form": "Mejor estructura de base de datos.",
              "Sheet diligenciado por comercial": "El comercial registra en nombre del supplier.",
              "Formulario GHL": "Para suppliers que ya están en el pipeline de GHL.",
              "Selección interna por Supplier Success": "El equipo selecciona sin postulación abierta.",
              "Tally": "Alternativa ligera. Buena UX para el supplier."
            }
          },
          {
            key: "form_link",
            label: "Link del formulario",
            type: "text",
            required: true,
            placeholder: "https:// — link para el supplier o el comercial"
          },
          {
            key: "submission_responsible",
            label: "Responsable de gestionar postulaciones",
            type: "select",
            required: true,
            options: ["Supplier Success", "Comercial", "Producto", "Growth", "Líder de campaña"]
          }
        ]
      },
      {
        key: "datos",
        title: "Datos a capturar",
        subtitle: "Campos requeridos al supplier",
        fields: [
          {
            key: "supplier_required_fields",
            label: "Datos del supplier",
            type: "multiselect",
            required: true,
            options: ["Nombre del supplier", "ID del supplier", "País", "Contacto (WhatsApp / correo)", "Comercial responsable"]
          },
          {
            key: "product_required_fields",
            label: "Datos del producto",
            type: "multiselect",
            required: true,
            options: ["Nombre del producto", "ID del producto", "Link en Dropi", "Categoría", "Estado (activo/inactivo)", "Público o privado"]
          },
          {
            key: "commercial_required_fields",
            label: "Datos comerciales",
            type: "multiselect",
            required: true,
            options: ["Precio actual", "Precio de campaña", "Descuento ofrecido (%)", "Stock disponible", "Vigencia del precio especial"]
          },
          {
            key: "submission_notes",
            label: "Instrucciones para el supplier o el comercial",
            type: "textarea",
            placeholder: "¿Qué debe saber el supplier antes de postular?"
          }
        ]
      }
    ]
  },

  // ── Nodo 7: Vitrina ────────────────────────────────────────────
  {
    key: "showcase",
    title: "Vitrina para dropshippers",
    icon: "store",
    description: "Define cómo se presentan los productos al dropshipper y cómo llegan a verlos.",
    sections: [
      {
        key: "vitrina_tipo",
        title: "Tipo de vitrina",
        subtitle: "Formato, nombre y descripción visible",
        fields: [
          {
            key: "showcase_type",
            label: "Tipo de vitrina",
            type: "select",
            required: true,
            options: ["Categoría temporal en Dropi", "Banner Userpilot + filtro", "GHL / WhatsApp", "Sheet curado", "Landing manual", "Mixta"],
            optionDescriptions: {
              "Categoría temporal en Dropi": "Categoría creada temporalmente en el catálogo. El dropshipper la ve y filtra solo productos de campaña. MVP sin desarrollo.",
              "Banner Userpilot + filtro": "Banner in-app que al hacer clic filtra el catálogo por la palabra clave de campaña. Requiere coordinación con Growth.",
              "GHL / WhatsApp": "Mensaje con lista de productos enviado directamente a dropshippers segmentados.",
              "Sheet curado": "Vista compartida con links de productos. El más rápido de armar.",
              "Landing manual": "Página con cards de productos. Mejor experiencia, algo más de esfuerzo.",
              "Mixta": "Combina dos formatos (ej. categoría temporal + banner Userpilot)."
            }
          },
          {
            key: "showcase_name",
            label: "Nombre visible para el dropshipper",
            type: "text",
            required: true,
            placeholder: "ej. Día del Padre 2026 · Remates de Stock · Belleza de Temporada"
          },
          {
            key: "showcase_description",
            label: "Descripción visible",
            type: "textarea",
            required: true,
            placeholder: "Una frase que explica la oportunidad al dropshipper.",
            hint: "ej. Productos seleccionados por Dropi para el Día del Padre. Todo para que tus clientes encuentren el regalo perfecto."
          }
        ]
      },
      {
        key: "vitrina_contenido",
        title: "Contenido visible",
        subtitle: "Qué ve el dropshipper por producto",
        fields: [
          {
            key: "product_visible_info",
            label: "Información visible por producto",
            type: "multiselect",
            required: true,
            hint: "Mínimo recomendado: imagen, nombre, supplier, precio, stock y CTA.",
            options: ["Imagen", "Nombre del producto", "Supplier", "Categoría", "Precio actual", "Precio de campaña", "Descuento (%)", "Stock disponible", "Vigencia", "Badge de campaña", "CTA"]
          },
          {
            key: "cta_main",
            label: "CTA principal",
            type: "select",
            required: true,
            options: ["Ver producto", "Tomar producto", "Agregar a mi tienda", "Ver catálogo del supplier"],
            optionDescriptions: {
              "Ver producto": "Lleva a la ficha del producto en Dropi. Recomendado para MVP.",
              "Tomar producto": "Agrega directamente el producto al catálogo del dropshipper.",
              "Agregar a mi tienda": "Similar a tomar producto.",
              "Ver catálogo del supplier": "Lleva a todo el catálogo, no solo al producto."
            }
          }
        ]
      },
      {
        key: "vitrina_distribucion",
        title: "Distribución",
        subtitle: "Cómo y cuándo llega al dropshipper",
        fields: [
          {
            key: "distribution_channels",
            label: "Canales al dropshipper",
            type: "multiselect",
            required: true,
            ranked: true,
            hint: "El primero que selecciones será el canal principal.",
            options: ["Banner Userpilot", "GHL", "WhatsApp", "Email", "Comunidad / grupo", "Comercial", "Modal in-app", "Link compartible"]
          },
          {
            key: "validity_display",
            label: "Vigencia visible",
            type: "text",
            required: true,
            placeholder: "ej. Válido hasta el 20 de junio · Precio especial por tiempo limitado"
          },
          {
            key: "showcase_link",
            label: "Link de la vitrina",
            type: "text",
            placeholder: "https:// — puede dejarse vacío hasta publicar"
          },
          {
            key: "publication_responsible",
            label: "Responsable de publicación",
            type: "select",
            required: true,
            options: ["Producto", "Growth", "Comercial", "Comunicaciones", "Supplier Success", "Diseño"]
          }
        ]
      }
    ]
  },

  // ── Nodo 8: Handoff final ──────────────────────────────────────
  {
    key: "handoff",
    title: "Handoff final",
    icon: "file-check-2",
    description: "Consolida todo en el documento operativo para ejecutar y alinear a todas las áreas.",
    sections: [
      {
        key: "ejecucion",
        title: "Plan de ejecución",
        subtitle: "Cronograma y responsables por área",
        fields: [
          {
            key: "schedule",
            label: "Cronograma resumido",
            type: "textarea",
            required: true,
            placeholder: "Semana 1 — Segmentación y contacto supplier\nSemana 2 — Postulaciones y curaduría\nSemana 3 — Publicar vitrina y activar dropshippers\nSemanas 4+ — Seguimiento y medición"
          },
          {
            key: "area_responsibilities",
            label: "Responsables por área",
            type: "textarea",
            required: true,
            placeholder: "Comercial: segmentar y convocar suppliers\nGrowth: comunicar a dropshippers y medir\nSupplier Success: revisar postulaciones\nProducto: publicar vitrina y reportar"
          },
          {
            key: "risks",
            label: "Riesgos identificados",
            type: "textarea",
            placeholder: "ej. Sin mecanismo de postulación definido — vitrina puede quedar vacía."
          }
        ]
      },
      {
        key: "metricas_cierre",
        title: "Métricas y validación",
        subtitle: "Cómo se mide y quién aprueba",
        fields: [
          {
            key: "metrics",
            label: "Métricas de seguimiento",
            type: "textarea",
            required: true,
            placeholder: "Supplier: invitados / respondieron / postularon / aprobados\nDropshipper: impactados / clics vitrina / productos tomados\nNegocio: órdenes / GMV / productos activados"
          },
          {
            key: "handoff_link",
            label: "Link del documento de handoff",
            type: "text",
            placeholder: "https:// — puede dejarse vacío hasta generar el doc"
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
              "En ejecución"
            ]
          }
        ]
      }
    ]
  }
];
