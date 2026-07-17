/**
 * Modelo de planeación de campañas — versión "experimento lean" (Track A).
 *
 * Este modelo es independiente del wizard original en `../[id]/nodes.ts` (de Jaime).
 * No lo reemplaza ni lo modifica — es una propuesta paralela, pensada específicamente
 * para la fase de experimento: planear y documentar la campaña desde el hub mientras
 * la ejecución sigue siendo manual (WhatsApp, Sheets, comercial).
 *
 * Si el experimento valida y se decide construir la campaña como feature real dentro
 * de Dropi (admin crea la campaña en plataforma, dashboard mide en vivo), ese es un
 * modelo distinto — deliberadamente no se diseña aquí. Por eso no hay condition builder
 * ni nada que asuma filtrado automático: quien opera esto sigue siendo una persona.
 *
 * Dos fases:
 *  - Planeación (nodos 1-7): se llena ANTES de lanzar la campaña.
 *  - Cierre (nodos 8-9): se llena DESPUÉS de que la campaña corrió. Resultados es
 *    manual a propósito — en la versión plataforma ese nodo lo reemplaza un dashboard.
 */

export type NodeKey =
  | "identidad" | "mecanica" | "elegibilidad" | "calendario"
  | "convocatoria" | "vitrina" | "handoff"
  | "resultados" | "decision";

export type Phase = "planeacion" | "cierre";

export type FieldType = "text" | "number" | "textarea" | "select" | "multiselect" | "milestones";
export type NodeData = Record<string, string>;

/** Un hito operativo del calendario: nombre, fecha (texto libre) y notas de qué pasa en ese paso. Serializado como JSON dentro de un campo tipo "milestones". */
export type Milestone = { label: string; date: string; notes?: string };

export function parseMilestones(value: string | undefined): Milestone[] {
  if (!value || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const SPANISH_MONTHS: Record<string, number> = {
  ene: 0, enero: 0, feb: 1, febrero: 1, mar: 2, marzo: 2, abr: 3, abril: 3,
  may: 4, mayo: 4, jun: 5, junio: 5, jul: 6, julio: 6, ago: 7, agosto: 7,
  sep: 8, sept: 8, septiembre: 8, oct: 9, octubre: 9, nov: 10, noviembre: 10,
  dic: 11, diciembre: 11,
};

/**
 * Fecha "de referencia" de un hito para calcular su estado (pasado/hoy/futuro).
 * Si la fecha es un rango (ej. "31/jul-3/ago/2026"), toma el ÚLTIMO día/mes
 * que aparece en el texto — el fin del rango es lo que importa para saber
 * si el hito ya se completó.
 */
export function milestoneEndDate(dateText: string | undefined): Date | null {
  if (!dateText) return null;
  const yearMatch = dateText.match(/(\d{4})/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[1], 10);
  const tokens = [...dateText.matchAll(/(\d{1,2})\s*\/\s*([a-zA-Zé]+)/g)];
  if (tokens.length === 0) return null;
  const last = tokens[tokens.length - 1];
  const day = parseInt(last[1], 10);
  const monthKey = last[2].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const month = SPANISH_MONTHS[monthKey];
  if (month === undefined) return null;
  return new Date(year, month, day);
}

/**
 * Fecha de INICIO de un hito — el primer día/mes que aparece en el texto.
 * Para hitos de un solo día, coincide con milestoneEndDate(). Para rangos
 * (ej. "31/jul-3/ago/2026"), es el inicio del rango — usado para dibujar
 * el hito como una barra en el calendario visual.
 */
export function milestoneStartDate(dateText: string | undefined): Date | null {
  if (!dateText) return null;
  const yearMatch = dateText.match(/(\d{4})/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[1], 10);
  const tokens = [...dateText.matchAll(/(\d{1,2})\s*\/\s*([a-zA-Zé]+)/g)];
  if (tokens.length === 0) return null;
  const first = tokens[0];
  const day = parseInt(first[1], 10);
  const monthKey = first[2].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const month = SPANISH_MONTHS[monthKey];
  if (month === undefined) return null;
  return new Date(year, month, day);
}

export type NodeIconKey =
  | "sparkles" | "tag" | "check-circle-2" | "calendar"
  | "megaphone" | "store" | "file-check-2"
  | "bar-chart-3" | "git-branch";

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
  /** Muestra el botón "Sugerir con IA". Solo para texto a redactar — nunca para métricas u otros datos reales/factuales. */
  aiSuggest?: boolean;
}

export interface SectionDefinition {
  key: string;
  title: string;
  subtitle: string;
  fields: Field[];
}

export interface NodeDefinition {
  key: NodeKey;
  phase: Phase;
  title: string;
  icon: NodeIconKey;
  description: string;
  /** Nota visible al usuario, para dejar explícito el carácter temporal/manual de un nodo (ej. Resultados). */
  phaseNote?: string;
  sections: SectionDefinition[];
}

export const NODE_DEFINITIONS: NodeDefinition[] = [
  // ══════════════════════════════════════════════════════════════
  // FASE 1 — PLANEACIÓN
  // ══════════════════════════════════════════════════════════════

  // ── Nodo 1: Identidad y objetivo ────────────────────────────────
  {
    key: "identidad",
    phase: "planeacion",
    title: "Identidad y objetivo",
    icon: "sparkles",
    description: "Qué es esta campaña, para qué existe y qué número confirmaría que funcionó. Este es el único lugar donde se define el resultado esperado — no se vuelve a preguntar más adelante.",
    sections: [
      {
        key: "identidad",
        title: "Identidad",
        subtitle: "Nombre, descripción y evento comercial",
        fields: [
          {
            key: "name", label: "Nombre de la campaña", type: "text", required: true,
            placeholder: "ej. Cyber Days · Día del Padre · Remates de Junio",
          },
          {
            key: "short_description", label: "Descripción corta", type: "textarea", required: true,
            placeholder: "¿Qué busca esta campaña en una frase?",
            hint: "ej. Validar si dar visibilidad a productos quietos aumenta su rotación.",
            aiSuggest: true,
          },
          {
            key: "commercial_event", label: "Fecha comercial o evento", type: "text", required: true,
            placeholder: "ej. Cyber Days · Black Friday · sin fecha específica",
          },
        ],
      },
      {
        key: "alcance",
        title: "Alcance",
        subtitle: "Países y responsable",
        fields: [
          {
            key: "country", label: "Países donde aplica", type: "multiselect", required: true,
            options: ["Colombia", "México", "Chile", "Argentina", "Perú", "Venezuela", "Costa Rica", "Panamá", "Paraguay", "Ecuador", "Bolivia"],
          },
          {
            key: "responsible", label: "Responsable general", type: "select", required: true,
            options: ["Producto", "Growth", "Comercial", "Supplier Success", "Comunicaciones"],
          },
        ],
      },
      {
        key: "objetivo",
        title: "Objetivo, hipótesis y meta",
        subtitle: "Qué se quiere lograr y con qué número se valida",
        fields: [
          {
            key: "objective", label: "Objetivo de la campaña", type: "select", required: true,
            hint: "Una campaña, un objetivo. Si necesitas varios, es otra campaña.",
            options: [
              "Aumentar órdenes", "Generar GMV", "Activar productos quietos",
              "Dar visibilidad a suppliers", "Ayudar a suppliers a salir de stock",
              "Activar suppliers nuevos", "Validar una categoría específica",
              "Validar descuentos como palanca",
            ],
            optionDescriptions: {
              "Aumentar órdenes": "Campañas masivas de temporada. Miden si la vitrina genera más órdenes.",
              "Generar GMV": "El foco es el valor monetario total. Útil para campañas de alto ticket.",
              "Activar productos quietos": "Productos sin órdenes en 2/4/8 semanas. Objetivo: pasar de publicado a con orden.",
              "Dar visibilidad a suppliers": "El beneficio es la exposición. Valida si la visibilidad sola genera participación.",
              "Ayudar a suppliers a salir de stock": "Remates. El supplier tiene inventario acumulado y necesita moverlo.",
              "Activar suppliers nuevos": "Primera visibilidad a suppliers recién activados.",
              "Validar una categoría específica": "Campañas por vertical. Miden si hay demanda diferenciada.",
              "Validar descuentos como palanca": "¿Un descuento real genera adopción diferencial?",
            },
          },
          {
            key: "hypothesis", label: "Hipótesis", type: "textarea", required: true,
            placeholder: "Si [acción], entonces [resultado esperado], porque [razón].",
            aiSuggest: true,
          },
          {
            key: "expected_result", label: "Resultado esperado (la meta a validar)", type: "textarea", required: true,
            placeholder: "ej. 20+ suppliers, 100+ productos aprobados, 25+ órdenes en la primera semana.",
            hint: "Sé específico con números — en el Cierre vas a comparar el resultado real contra esto.",
            aiSuggest: true,
          },
        ],
      },
    ],
  },

  // ── Nodo 2: Mecánica ─────────────────────────────────────────────
  {
    key: "mecanica",
    phase: "planeacion",
    title: "Mecánica",
    icon: "tag",
    description: "Define si la campaña maneja descuento y cuál es el motivador principal del supplier. El tipo de dinámica ya quedó definido en el Objetivo del nodo anterior — no se vuelve a preguntar aquí.",
    sections: [
      {
        key: "tipo",
        title: "Descuento",
        subtitle: "¿La campaña maneja descuento?",
        fields: [
          {
            key: "requires_discount", label: "¿Requiere descuento?", type: "select", required: true,
            hint: "No hay descuento automático en plataforma todavía. Si aplica, se opera manualmente.",
            options: ["No requiere descuento", "Opcional — el supplier decide", "Obligatorio — sin descuento no entra"],
          },
        ],
      },
      {
        key: "motivador",
        title: "Motivador del supplier",
        subtitle: "Ángulo para el mensaje de convocatoria",
        fields: [
          {
            key: "supplier_motivator", label: "Motivador principal", type: "select", required: true,
            options: ["Mayor visibilidad", "Vender más volumen", "Salir de stock acumulado", "Activar producto nuevo", "Conseguir primeras órdenes", "Mejorar rotación"],
          },
          {
            key: "notes", label: "Notas adicionales", type: "textarea",
            placeholder: "Contexto relevante para la célula sobre esta mecánica...",
            aiSuggest: true,
          },
        ],
      },
    ],
  },

  // ── Nodo 3: Elegibilidad ─────────────────────────────────────────
  {
    key: "elegibilidad",
    phase: "planeacion",
    title: "Elegibilidad",
    icon: "check-circle-2",
    description: "Quién puede entrar — qué suppliers y qué productos aplican. Todo en un solo lugar estructurado, sin repetir el mismo criterio en dos campos distintos.",
    sections: [
      {
        key: "universo",
        title: "Universo y perfil",
        subtitle: "Base y tipo de supplier esperado",
        fields: [
          {
            key: "universe", label: "Universo base", type: "select", required: true,
            options: ["Suppliers + productos", "Solo suppliers", "Solo productos", "Base comercial manual", "Lista cargada en Sheet"],
          },
          {
            key: "supplier_type", label: "Tipo de supplier", type: "multiselect", required: true,
            options: ["Verificado", "Premium", "Exclusivo", "Todos los verificados"],
          },
          {
            key: "categories_scope", label: "¿Aplica a todas las categorías?", type: "select", required: true,
            options: ["Todas las categorías", "Categorías específicas"],
          },
          {
            key: "categories_theme", label: "Categorías o temática esperada", type: "textarea", required: true,
            placeholder: "ej. Tecnología, moda masculina, cuidado personal, accesorios, hogar.",
            hint: "Protege la vitrina de productos fuera de contexto.",
            aiSuggest: true,
            hidden: (allData) => allData.elegibilidad?.categories_scope !== "Categorías específicas",
          },
        ],
      },
      {
        key: "parametros",
        title: "Parámetros",
        subtitle: "Criterios mínimos de participación",
        fields: [
          {
            key: "min_stock", label: "Stock mínimo requerido (unidades)", type: "text", required: true,
            placeholder: "ej. 300",
          },
          {
            key: "max_products_per_supplier", label: "Máximo de productos por supplier", type: "text",
            placeholder: "ej. 5 — deja vacío si no aplica límite",
          },
          {
            key: "min_discount", label: "Descuento mínimo (%) — si aplica", type: "text",
            placeholder: "ej. 15%",
            hidden: (allData) => allData.mecanica?.requires_discount === "No requiere descuento",
          },
          {
            key: "keyword_marco", label: "Palabra clave o marco de campaña", type: "text",
            placeholder: "ej. CyberDays2026",
            hint: "Los suppliers aprobados agregan esta palabra al título del producto. Filtra la vitrina sin desarrollo.",
          },
          {
            key: "eligibility_notes", label: "Notas o excepciones", type: "textarea",
            placeholder: "Solo excepciones que los campos de arriba no cubran — no repitas stock, tipo ni categorías.",
            hint: "Opcional.",
            aiSuggest: true,
          },
        ],
      },
    ],
  },

  // ── Nodo 4: Calendario ───────────────────────────────────────────
  {
    key: "calendario",
    phase: "planeacion",
    title: "Calendario",
    icon: "calendar",
    description: "Cuándo ocurre cada hito operativo, desde la convocatoria hasta el cierre. Cada hito es un paso con su propia fecha y qué pasa en ese momento.",
    sections: [
      {
        key: "fechas",
        title: "Hitos del calendario",
        subtitle: "En orden cronológico, con la acción de cada uno",
        fields: [
          {
            key: "milestones", label: "Hitos", type: "milestones", required: true,
            hint: "Un hito por paso operativo (pieza de difusión, forms, curaduría, publicación...). La fecha puede ser un día o un rango.",
          },
          { key: "calendar_notes", label: "Notas sobre el calendario", type: "textarea", placeholder: "Restricciones, dependencias de diseño, semanas sin disponibilidad...", aiSuggest: true },
        ],
      },
    ],
  },

  // ── Nodo 5: Convocatoria y postulación ────────────────────────────
  {
    key: "convocatoria",
    phase: "planeacion",
    title: "Convocatoria y postulación",
    icon: "megaphone",
    description: "Cómo se entera el supplier, cómo postula y cómo llegan sus productos a la campaña. Antes eran dos pasos separados — se unen porque es la misma conversación con el supplier vista de principio a fin.",
    sections: [
      {
        key: "convocatoria",
        title: "Convocatoria",
        subtitle: "Cómo se contacta al supplier",
        fields: [
          {
            key: "invite_type", label: "Tipo de convocatoria", type: "select", required: true,
            options: ["Abierta", "Segmentada", "Por invitación directa", "Comercial manual", "Mixta"],
            optionDescriptions: {
              "Abierta": "A todos los suppliers que cumplen las reglas.",
              "Segmentada": "Solo a suppliers que cumplen una condición específica.",
              "Por invitación directa": "Mensaje personalizado para suppliers estratégicos o premium.",
              "Comercial manual": "El comercial contacta directamente. Más control. Recomendado para el experimento.",
              "Mixta": "Invitación directa para estratégicos + convocatoria abierta al resto.",
            },
          },
          {
            key: "channels", label: "Canales de comunicación", type: "multiselect", required: true, ranked: true,
            hint: "El primero que selecciones será el canal principal.",
            options: ["Comercial directo", "WhatsApp", "GHL", "Email", "Userpilot", "Modal in-app", "Banner in-app", "Llamada", "Comunidad / grupo"],
          },
        ],
      },
      {
        key: "postulacion",
        title: "Postulación",
        subtitle: "Cómo responde el supplier y qué productos entran",
        fields: [
          {
            key: "submission_mechanism", label: "Mecanismo de postulación", type: "select", required: true,
            options: ["Botón de intención (WhatsApp/CRM)", "Google Form", "Sheet diligenciado por comercial", "Selección interna por Supplier Success", "Tally"],
            optionDescriptions: {
              "Botón de intención (WhatsApp/CRM)": "El supplier confirma con un clic que quiere participar; el detalle se resuelve por contacto directo. Menos fricción, recomendado para el experimento.",
              "Google Form": "Rápido de crear. Respuestas van a Sheet.",
              "Sheet diligenciado por comercial": "El comercial registra en nombre del supplier.",
              "Selección interna por Supplier Success": "El equipo selecciona sin postulación abierta.",
              "Tally": "Alternativa ligera. Buena UX para el supplier.",
            },
          },
          {
            key: "submission_link", label: "Link o mecanismo de postulación", type: "text",
            placeholder: "https:// — deja 'Por definir' si aún no existe",
          },
          {
            key: "submission_responsible", label: "Responsable de gestionar postulaciones", type: "select", required: true,
            options: ["Supplier Success", "Comercial", "Producto", "Growth", "Líder de campaña"],
          },
          {
            key: "submission_notes", label: "Qué datos adicionales necesitas capturar", type: "textarea",
            placeholder: "Solo lo que Dropi no tiene ya en el sistema del supplier/producto.",
            hint: "No repitas nombre, ID o país del supplier — eso ya existe en Dropi.",
            aiSuggest: true,
          },
        ],
      },
    ],
  },

  // ── Nodo 6: Vitrina ──────────────────────────────────────────────
  {
    key: "vitrina",
    phase: "planeacion",
    title: "Vitrina",
    icon: "store",
    description: "Cómo se presentan los productos al dropshipper y cómo llegan a verlos.",
    sections: [
      {
        key: "formato",
        title: "Formato",
        subtitle: "Tipo, nombre y descripción visible",
        fields: [
          {
            key: "showcase_type", label: "Tipo de vitrina", type: "select", required: true,
            options: ["Categoría temporal en Dropi", "Banner Userpilot + filtro", "GHL / WhatsApp", "Sheet curado", "Landing manual", "Mixta"],
            optionDescriptions: {
              "Categoría temporal en Dropi": "Categoría creada temporalmente en el catálogo. Sin desarrollo.",
              "Banner Userpilot + filtro": "Banner in-app que filtra el catálogo por la palabra clave de campaña.",
              "GHL / WhatsApp": "Mensaje con lista de productos enviado directo a dropshippers segmentados.",
              "Sheet curado": "Vista compartida con links de productos. El más rápido de armar.",
              "Landing manual": "Página con cards de productos. Mejor experiencia, más esfuerzo.",
              "Mixta": "Combina dos formatos.",
            },
          },
          { key: "showcase_name", label: "Nombre visible para el dropshipper", type: "text", required: true, placeholder: "ej. Cyber Days 2026" },
          { key: "showcase_description", label: "Descripción visible", type: "textarea", required: true, placeholder: "Una frase que explica la oportunidad al dropshipper.", aiSuggest: true },
        ],
      },
      {
        key: "contenido",
        title: "Contenido y distribución",
        subtitle: "Qué ve el dropshipper y por dónde le llega",
        fields: [
          {
            key: "cta_main", label: "CTA principal", type: "select", required: true,
            options: ["Ver producto", "Tomar producto", "Agregar a mi tienda", "Ver catálogo del supplier"],
          },
          {
            key: "badges", label: "Badges o señales visuales", type: "multiselect",
            hint: "Máximo 2-3 por producto.",
            options: ["Seleccionado por Dropi", "Precio especial", "Remate", "Producto de temporada", "Alto stock", "Nuevo", "Últimas unidades", "Termina pronto"],
          },
          {
            key: "distribution_channels", label: "Canales al dropshipper", type: "multiselect", required: true, ranked: true,
            hint: "El primero que selecciones será el canal principal.",
            options: ["Banner Userpilot", "GHL", "WhatsApp", "Email", "Comunidad / grupo", "Comercial", "Modal in-app", "Link compartible"],
          },
          {
            key: "publication_responsible", label: "Responsable de publicación", type: "select", required: true,
            options: ["Producto", "Growth", "Comercial", "Comunicaciones", "Supplier Success", "Diseño"],
          },
        ],
      },
    ],
  },

  // ── Nodo 7: Handoff operativo ────────────────────────────────────
  {
    key: "handoff",
    phase: "planeacion",
    title: "Handoff operativo",
    icon: "file-check-2",
    description: "El documento para que cada área ejecute. Solo logística — cronograma y responsables. Métricas y decisión viven en el Cierre, después de que la campaña corra.",
    sections: [
      {
        key: "ejecucion",
        title: "Plan de ejecución",
        subtitle: "Cronograma, responsables y riesgos",
        fields: [
          {
            key: "schedule", label: "Cronograma resumido", type: "textarea", required: true,
            placeholder: "Semana 1 — Convocatoria\nSemana 2 — Postulación y curaduría\nSemana 3 — Vitrina y activación\nSemanas 4+ — Campaña activa",
            aiSuggest: true,
          },
          {
            key: "area_responsibilities", label: "Responsables por área", type: "textarea", required: true,
            placeholder: "Comercial: convocar suppliers\nSupplier Success: curar postulaciones\nProducto: publicar vitrina\nGrowth: comunicar a dropshippers",
            aiSuggest: true,
          },
          { key: "risks", label: "Riesgos identificados", type: "textarea", placeholder: "ej. Sin mecanismo de postulación definido — vitrina puede quedar vacía.", aiSuggest: true },
        ],
      },
      {
        key: "documento",
        title: "Formato del documento",
        subtitle: "Cómo se entrega y a quién",
        fields: [
          {
            key: "handoff_format", label: "Formato del handoff", type: "select", required: true,
            options: ["Google Doc", "Sheet maestro", "Notion", "PDF", "Este mismo hub"],
          },
          {
            key: "handoff_audience", label: "Audiencia del handoff", type: "multiselect", required: true,
            options: ["Producto", "Growth", "Comercial", "Supplier Success", "Comunicaciones", "Diseño", "Stakeholder de aprobación"],
          },
          { key: "handoff_link", label: "Link del documento", type: "text", placeholder: "https:// — puede dejarse vacío hasta generarlo" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // FASE 2 — CIERRE (después de que la campaña corrió)
  // ══════════════════════════════════════════════════════════════

  // ── Nodo 8: Resultados ───────────────────────────────────────────
  {
    key: "resultados",
    phase: "cierre",
    title: "Resultados",
    icon: "bar-chart-3",
    description: "Qué pasó de verdad, comparado contra lo que esperabas al planear.",
    phaseNote: "Manual por ahora — alguien va y trae estos números a mano. Si esto se construye en la plataforma, este nodo lo reemplaza un dashboard en vivo.",
    sections: [
      {
        key: "metricas",
        title: "Métricas — Supplier",
        subtitle: "Embudo de participación",
        fields: [
          { key: "suppliers_invited", label: "Invitados", type: "number", required: true, placeholder: "ej. 60" },
          { key: "suppliers_applied", label: "Postularon", type: "number", required: true, placeholder: "ej. 28" },
          { key: "suppliers_approved", label: "Aprobados", type: "number", required: true, placeholder: "ej. 22" },
          { key: "suppliers_with_frame", label: "Con marco aplicado", type: "number", placeholder: "ej. 20" },
        ],
      },
      {
        key: "metricas_dropshipper",
        title: "Métricas — Dropshipper",
        subtitle: "Alcance y actividad en la vitrina",
        fields: [
          { key: "dropshippers_impacted", label: "Impactados", type: "number", required: true, placeholder: "ej. 250" },
          { key: "banner_clicks", label: "Clics en vitrina/banner", type: "number", placeholder: "ej. 90" },
          { key: "products_viewed", label: "Productos vistos", type: "number", placeholder: "ej. 340" },
          { key: "products_taken", label: "Productos tomados", type: "number", required: true, placeholder: "ej. 150" },
        ],
      },
      {
        key: "metricas_negocio",
        title: "Métricas — Negocio",
        subtitle: "Impacto comercial",
        fields: [
          { key: "orders_generated", label: "Órdenes generadas", type: "number", required: true, placeholder: "ej. 45" },
          { key: "gmv_generated", label: "GMV generado ($)", type: "number", required: true, placeholder: "ej. 3200000" },
          { key: "products_first_order", label: "Productos con primera orden", type: "number", placeholder: "ej. 18" },
          { key: "products_reactivated", label: "Productos quietos activados", type: "number", placeholder: "ej. 30" },
          { key: "suppliers_with_sales", label: "Suppliers con al menos una venta", type: "number", placeholder: "ej. 15" },
        ],
      },
      {
        key: "analisis",
        title: "Análisis",
        subtitle: "Contra lo esperado, y qué aprendimos",
        fields: [
          {
            key: "vs_expected", label: "Resultado real vs. esperado", type: "textarea", required: true,
            hint: "Compáralo directamente contra lo que escribiste en 'Resultado esperado' al planear.",
            aiSuggest: true,
          },
          { key: "learnings", label: "Aprendizajes", type: "textarea", required: true, placeholder: "¿Qué sorprendió? ¿Qué no funcionó como se pensaba?", aiSuggest: true },
          { key: "results_source", label: "Fuente de estos números", type: "text", placeholder: "ej. Reporte manual BI del 20/ago, pedido a Miguel" },
        ],
      },
    ],
  },

  // ── Nodo 9: Decisión ─────────────────────────────────────────────
  {
    key: "decision",
    phase: "cierre",
    title: "Decisión",
    icon: "git-branch",
    description: "Con los resultados reales en mano: ¿escalamos, iteramos o pausamos?",
    sections: [
      {
        key: "ruta",
        title: "Ruta",
        subtitle: "La decisión y por qué",
        fields: [
          {
            key: "decision", label: "Decisión", type: "select", required: true,
            options: ["Escalar y construir en la plataforma", "Iterar — probar otra variante", "Pausar o pivotar"],
            optionDescriptions: {
              "Escalar y construir en la plataforma": "Los resultados validan la hipótesis. Es momento de levantar el PRD para Track B.",
              "Iterar — probar otra variante": "Hay señal, pero algo del segmento, incentivo o vitrina necesita ajuste antes de invertir en desarrollo.",
              "Pausar o pivotar": "La señal no fue suficiente para justificar seguir por esta vía.",
            },
          },
          { key: "decision_rationale", label: "Justificación", type: "textarea", required: true, aiSuggest: true },
          {
            key: "next_experiment", label: "Siguiente experimento", type: "textarea",
            placeholder: "¿Qué probarías distinto la próxima vez?",
            hidden: (allData) => allData.decision?.decision === "Escalar y construir en la plataforma",
            aiSuggest: true,
          },
          {
            key: "dev_requirements", label: "Qué necesitaría el desarrollo", type: "textarea",
            placeholder: "Reglas a automatizar, datos requeridos, integraciones, qué del proceso manual debe volverse sistema.",
            hint: "Este es el insumo directo para el PRD de Track B.",
            hidden: (allData) => allData.decision?.decision !== "Escalar y construir en la plataforma",
            aiSuggest: true,
          },
          {
            key: "decision_responsible", label: "Responsable de la decisión", type: "select", required: true,
            options: ["Producto", "Líder de campaña", "Comité / Stakeholder de aprobación"],
          },
        ],
      },
    ],
  },
];

export const PLANNING_NODES = NODE_DEFINITIONS.filter((n) => n.phase === "planeacion");
export const CLOSING_NODES = NODE_DEFINITIONS.filter((n) => n.phase === "cierre");

/** ¿Están todos los campos requeridos de la fase de planeación llenos? Usa node_key, no índice — sirve tanto en el wizard como en Ejecución. */
export function isPlanningComplete(savedNodes: { node_key: string; data: NodeData }[]): boolean {
  const byKey = new Map(savedNodes.map((n) => [n.node_key, n.data]));
  return PLANNING_NODES.every((node) => {
    const data = byKey.get(node.key) ?? {};
    const allData: Partial<Record<NodeKey, NodeData>> = {};
    NODE_DEFINITIONS.forEach((n) => { allData[n.key] = byKey.get(n.key) ?? {}; });
    return node.sections.every((sec) =>
      sec.fields.every((f) => {
        if (!f.required) return true;
        if (f.hidden && f.hidden(allData)) return true;
        const v = data[f.key];
        return !!v && v.trim() !== "";
      })
    );
  });
}

// ── Estado de ejecución/cierre de una campaña — compartido entre /planeacion y el panel raíz de Dinámicas de Catálogo ──

export type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };
export const EXECUTION_NODE_INDEX = 9;

export type CampaignPhase = "planeacion" | "lista" | "activa" | "cierre" | "cerrada";
export type CampaignExtra = { phase: CampaignPhase; nextMilestone: Milestone | null };

export const PHASE_LABEL: Record<CampaignPhase, { text: string; color: string; bg: string }> = {
  planeacion: { text: "En planeación", color: "#6B7280", bg: "#F3F4F6" },
  lista: { text: "Lista para iniciar", color: "#F77F00", bg: "#FFF3E0" },
  activa: { text: "Campaña activa", color: "#10B981", bg: "#ECFDF5" },
  cierre: { text: "En cierre", color: "#6366F1", bg: "#EEF2FF" },
  cerrada: { text: "Cerrada", color: "#374151", bg: "#F3F4F6" },
};

export function computeCampaignExtra(nodes: SavedNode[]): CampaignExtra {
  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";
  const decisionNode = nodes.find((n) => n.node_key === "decision");
  const decisionDone = !!decisionNode?.data?.decision;
  const closingStarted = CLOSING_NODES.some((cn) => {
    const data = nodes.find((n) => n.node_key === cn.key)?.data;
    return data && Object.keys(data).length > 0;
  });

  let phase: CampaignPhase = "planeacion";
  if (decisionDone) phase = "cerrada";
  else if (closingStarted) phase = "cierre";
  else if (isActive) phase = "activa";
  else if (planningComplete) phase = "lista";

  const calendario = nodes.find((n) => n.node_key === "calendario")?.data;
  const milestones = parseMilestones(calendario?.milestones);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const nextMilestone = milestones.find((m) => {
    const end = milestoneEndDate(m.date);
    return end && end >= todayStart;
  }) ?? null;

  return { phase, nextMilestone };
}
