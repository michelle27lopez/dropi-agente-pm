import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PROJECT_ID = "d64b428a-3c99-412f-8100-53e07bd20ed8"; // DCA-001

const CAMPAIGNS = [
  {
    name: "Amor y Amistad 2026",
    status: "in_progress",
    current_node: 8,
    nodes: [
      {
        node_index: 0, node_key: "base", completed: true,
        data: {
          name: "Amor y Amistad 2026",
          short_description: "Vitrina curada de Dropi para el Día del Amor y la Amistad en Colombia. Validar si una campaña de temporada genera participación de suppliers y adopción de dropshippers a través de productos de regalo.",
          commercial_event: "Día del Amor y la Amistad — 19 de septiembre de 2026 (tercer sábado de septiembre, Colombia)",
          country: "Colombia",
          responsible: "Supplier Success",
          objective: "Aumentar órdenes",
          hypothesis: "Si Dropi lanza una vitrina curada con productos de regalo para el Día del Amor y la Amistad, los dropshippers explorarán y tomarán más productos que en el catálogo general, porque el contexto comercial reduce la fricción de selección.",
          expected_result: "Mínimo 20 suppliers participantes, 80+ productos aprobados, 40+ dropshippers que visitan la vitrina, 25+ órdenes generadas durante la campaña. Señal secundaria: al menos 5 productos quietos que se activan.",
        }
      },
      {
        node_index: 1, node_key: "type", completed: true,
        data: {
          campaign_type: "Temporada",
          requires_discount: "Opcional — el supplier decide",
          supplier_motivator: "Mayor visibilidad",
          notes: "Campaña piloto del experimento lean de Dinámicas de Catálogo. El foco es validar participación e intención antes de construir funcionalidad formal. Priorizar suppliers con productos de regalo: accesorios, bisutería, cuidado personal, tecnología portátil, hogar y detalles.",
        }
      },
      {
        node_index: 2, node_key: "eligibility", completed: true,
        data: {
          universe: "Suppliers + productos",
          supplier_type: "Verificado||Premium",
          categories_theme: "Accesorios y bisutería, cuidado personal y belleza, tecnología portátil (audífonos, cargadores), hogar y decoración, detalles y regalos (velas, kits, sets), moda (bufandas, bolsos, carteras). Excluir: productos de uso exclusivo industrial, alimentos perecederos, productos sin relación con regalos o celebración.",
          eligibility_criteria: "Suppliers verificados o premium en Colombia, con al menos un producto activo y público, stock mínimo de 300 unidades, ficha de producto completa (nombre descriptivo, imágenes de calidad, precio definido). El producto debe ser coherente con la temática de regalo o celebración del Día del Amor y la Amistad.",
          min_stock: "300",
          keyword_marco: "AmorYAmistad2026",
          max_products_per_supplier: "5",
          min_discount: "",
          segment_size: "25–40 suppliers / 80–150 productos",
          segment_responsible: "Supplier Success",
        }
      },
      {
        node_index: 3, node_key: "calendar", completed: true,
        data: {
          date_convocation_start: "15/jun/2026",
          date_submission_end: "30/jun/2026",
          date_showcase_publish: "21/ago/2026",
          date_campaign_start: "24/ago/2026",
          date_campaign_end: "21/sep/2026",
          date_review_close: "10/jul/2026",
          date_assets_delivery: "28/jul/2026",
          date_dropshipper_comms: "24/ago/2026",
          calendar_notes: "La campaña debe estar activa al menos 4 semanas antes del 19 de septiembre para que los dropshippers tengan tiempo de publicar y pautar. El marco de campaña debe estar listo antes del 10 de julio para incluirlo en el instructivo que se envía a los suppliers aprobados.",
        }
      },
      {
        node_index: 4, node_key: "invite", completed: true,
        data: {
          invite_type: "Comercial manual",
          channels: "Comercial directo||WhatsApp||GHL",
          send_responsible: "Comercial",
          message_template: "Hola [nombre del supplier] 👋\n\nEn Dropi estamos preparando una campaña especial para el Día del Amor y la Amistad (19 de septiembre) y queremos incluir tus productos.\n\n🎁 ¿Qué es? Una vitrina curada donde los dropshippers encontrarán los mejores productos de regalo — seleccionados por Dropi.\n\n✅ ¿Qué ganas? Mayor visibilidad frente a cientos de dropshippers activos en Colombia.\n\n📦 ¿Qué necesitas? Postular hasta 5 productos relacionados con regalos o celebración, con stock mínimo de 300 unidades y precio competitivo.\n\n📅 Fecha límite: 30 de junio de 2026.\n\n¿Te interesa participar? Respóndeme aquí o llena el formulario: [link]",
          submission_link: "Por definir — formulario Google Form / Airtable (en construcción)",
          supplier_list: "Base de suppliers verificados y premium en Colombia — segmento filtrado por Supplier Success con productos en categorías de regalo. Fuente: sheet maestro actualizado al 12 de junio de 2026. Estimado: 60–80 suppliers a contactar para lograr 25–40 participantes.",
        }
      },
      {
        node_index: 5, node_key: "submission", completed: true,
        data: {
          submission_channel: "Google Form",
          form_link: "Por definir — en construcción",
          submission_responsible: "Supplier Success",
          supplier_required_fields: "Nombre del supplier||ID del supplier||País||Contacto (WhatsApp / correo)||Comercial responsable",
          product_required_fields: "Nombre del producto||ID del producto||Link en Dropi||Categoría||Estado (activo/inactivo)||Público o privado",
          commercial_required_fields: "Precio actual||Precio de campaña||Stock disponible||Vigencia del precio especial",
          submission_notes: "El supplier debe confirmar que el producto tiene stock mínimo de 300 unidades disponibles durante toda la campaña (hasta el 21 de septiembre). Si ofrece precio especial, debe indicar si el descuento es sobre el precio proveedor o sobre el precio sugerido. Máximo 5 productos por supplier.",
        }
      },
      {
        node_index: 6, node_key: "showcase", completed: true,
        data: {
          showcase_type: "Categoría temporal en Dropi",
          showcase_name: "Amor y Amistad 2026 — Regalos para quienes más quieres",
          showcase_description: "Productos seleccionados por Dropi para el Día del Amor y la Amistad. Encuentra detalles, accesorios y regalos que tus clientes van a amar.",
          product_visible_info: "Imagen||Nombre del producto||Supplier||Precio actual||Precio de campaña||Stock disponible||Badge de campaña||CTA",
          cta_main: "Ver producto",
          distribution_channels: "Banner Userpilot||GHL||WhatsApp",
          validity_display: "Válido hasta el 21 de septiembre de 2026 · Productos seleccionados por Dropi",
          showcase_link: "Por definir — categoría beta en construcción",
          publication_responsible: "Producto",
        }
      },
      {
        node_index: 7, node_key: "handoff", completed: true,
        data: {
          schedule: "Semana 1–2 (15–30 jun): Segmentación de suppliers y convocatoria por comerciales\nSemana 3–4 (1–10 jul): Recepción de postulaciones y curaduría\nSemana 5–7 (11–28 jul): Notificación de aprobados y entrega de marco de campaña\nSemana 8–9 (1–14 ago): Suppliers aplican marco y palabra clave a sus productos\nSemana 10 (15–21 ago): Publicación de categoría temporal y banner Userpilot\nSemana 11–14 (24 ago–21 sep): Campaña activa — seguimiento, medición y soporte\nSemana 15 (22–25 sep): Cierre y consolidación de resultados",
          area_responsibilities: "Supplier Success: segmentar, convocar, revisar postulaciones, curar y aprobar productos\nComercial: contactar suppliers, hacer seguimiento, registrar postulaciones\nMarketing / Diseño: crear banner Userpilot, marco de producto y piezas de comunicación\nProducto: crear categoría temporal, configurar banner en Userpilot\nGrowth: comunicar la campaña a dropshippers, medir clics y adopción\nLíder de campaña: coordinación general y decisiones de priorización",
          risks: "1. Bajo volumen de postulaciones — mitigar con seguimiento proactivo del comercial\n2. Productos postulados fuera de temática — mitigar con criterios claros en el formulario\n3. Marco no aplicado correctamente por el supplier — mitigar con instructivo detallado y validación antes de publicar\n4. Categoría temporal sin desarrollo disponible — alternativa: vitrina en Sheet curado + envío GHL\n5. Descuento prometido no operativo en plataforma — operar manualmente con precio de campaña en la descripción",
          metrics: "Supplier: invitados / respondieron / postularon / aprobados / con marco aplicado\nProducto: productos aprobados / rechazados / con palabra clave / con marco\nDropshipper: impactados por banner / clics en vitrina / productos vistos / productos tomados\nNegocio: órdenes generadas / GMV / productos con primera orden / productos quietos activados\nOperativo: cancelaciones / novedades / quiebres de stock durante campaña",
          handoff_link: "Por definir — Google Doc en construcción",
          validation_status: "Borrador — pendiente de revisión interna",
        }
      }
    ]
  },
  {
    name: "Dropicup Mundial 2026",
    status: "in_progress",
    current_node: 8,
    nodes: [
      {
        node_index: 0, node_key: "base", completed: true,
        data: {
          name: "Dropicup Mundial 2026",
          short_description: "Campaña de temporada para agrupar productos relacionados con el mundial y validar si una vitrina curada aumenta la adopción de dropshippers.",
          commercial_event: "Mundial de Clubes 2026",
          country: "Colombia||México",
          responsible: "Supplier Success",
          objective: "Aumentar órdenes",
          hypothesis: "Si Dropi crea una campaña curada del mundial, los suppliers postularán por mayor visibilidad y los dropshippers tendrán mayor intención de explorar esos productos, generando órdenes incrementales.",
          expected_result: "Mínimo 20 suppliers participantes, 60+ productos aprobados, clics en vitrina de al menos 100 dropshippers, señal inicial de 30+ órdenes en la primera semana."
        }
      },
      {
        node_index: 1, node_key: "type", completed: true,
        data: {
          campaign_type: "Temporada",
          requires_discount: "Opcional — el supplier decide",
          supplier_motivator: "Mayor visibilidad",
          notes: "Campaña inspirada en el Mundial de Clubes 2026. Incluye productos de diferentes categorías siempre que la relación con la temática sea clara. Descuento opcional pero recomendado para mayor visibilidad."
        }
      },
      {
        node_index: 2, node_key: "eligibility", completed: true,
        data: {
          universe: "Suppliers + productos",
          supplier_type: "Verificado",
          categories_theme: "Fútbol, fans, decoración deportiva, ropa deportiva, tecnología para ver partidos, accesorios de deporte.",
          eligibility_criteria: "Suppliers verificados o premium con stock mínimo de 20 unidades. Ficha completa con imagen, precio vigente y productos activos.",
          min_stock: "20",
          keyword_marco: "Dropicup",
          max_products_per_supplier: "5",
          min_discount: "",
          segment_size: "30–50 suppliers / 100–150 productos",
          segment_responsible: "Supplier Success"
        }
      },
      {
        node_index: 3, node_key: "calendar", completed: true,
        data: {
          date_convocation_start: "2026-06-05",
          date_submission_end: "2026-06-12",
          date_showcase_publish: "2026-06-14",
          date_campaign_start: "2026-06-14",
          date_campaign_end: "2026-07-15",
          date_review_close: "2026-06-13",
          date_assets_delivery: "2026-06-13",
          date_dropshipper_comms: "2026-06-14",
          calendar_notes: "Campaña ya en marcha. Fechas ajustadas sobre la marcha al ser la primera campaña piloto."
        }
      },
      {
        node_index: 4, node_key: "invite", completed: true,
        data: {
          invite_type: "Segmentada",
          channels: "Comercial directo||WhatsApp||GHL",
          send_responsible: "Comercial",
          message_template: "Hola [nombre] 👋\n\nTe queremos invitar a participar en Dropicup Mundial, la campaña especial de Dropi para la temporada del Mundial de Clubes 2026.\n\nSeleccionamos tu catálogo porque tienes productos que los dropshippers van a estar buscando. Es gratis participar — solo postula tus mejores productos antes del 12 de junio.\n\nLos productos seleccionados aparecerán en la vitrina especial de Dropicup 🏆 con mayor visibilidad ante miles de dropshippers.\n\n👉 Postula aquí: [link]",
          submission_link: "https://forms.gle/dropicup2026",
          supplier_list: "Sheet maestro de segmentación Dropicup — 2026-06-03. 40 suppliers Colombia identificados con productos relacionados con temática deportiva."
        }
      },
      {
        node_index: 5, node_key: "submission", completed: true,
        data: {
          submission_channel: "Google Form",
          form_link: "https://forms.gle/dropicup2026",
          submission_responsible: "Supplier Success",
          supplier_required_fields: "Nombre del supplier||ID del supplier||País||Contacto (WhatsApp / correo)||Comercial responsable",
          product_required_fields: "Nombre del producto||ID del producto||Link del producto en Dropi||Categoría||Estado (activo/inactivo)||Público o privado",
          commercial_required_fields: "Precio actual||Precio de campaña||Descuento ofrecido (%)||Stock disponible||Vigencia del precio especial",
          submission_notes: "El producto debe tener relación visible con la temática del mundial. Los comerciales pueden llenar el formulario en nombre del supplier."
        }
      },
      {
        node_index: 6, node_key: "showcase", completed: true,
        data: {
          showcase_type: "Categoría temporal en Dropi",
          showcase_name: "Dropicup Mundial 🏆",
          showcase_description: "Productos seleccionados por Dropi para vender durante la temporada del Mundial de Clubes 2026. Todo para que tus clientes disfruten el mundial.",
          product_visible_info: "Imagen||Nombre del producto||Supplier||Precio actual||Precio de campaña||Stock disponible||Badge de campaña||CTA",
          cta_main: "Ver producto",
          distribution_channels: "GHL||WhatsApp||Userpilot",
          validity_display: "Campaña activa hasta el 15 de julio de 2026",
          showcase_link: "",
          publication_responsible: "Producto"
        }
      },
      {
        node_index: 7, node_key: "handoff", completed: true,
        data: {
          schedule: "Semana 1 (5-12 jun): Convocatoria\nSemana 2 (12-14 jun): Curaduría\nSemana 3 (14-21 jun): Publicar vitrina\nSemanas 4-6 (21 jun - 15 jul): Medición",
          area_responsibilities: "Comercial: convocar y registrar\nSupplier Success: curar e indicar\nProducto: publicar vitrina\nGrowth: pauta y clics",
          risks: "Sin funcionalidad de descuento automático — operar de forma manual.",
          metrics: "Órdenes / GMV / Clics vitrina / Suppliers activos",
          handoff_link: "",
          validation_status: "Alineado con stakeholder — listo para ejecutar"
        }
      }
    ]
  },
  {
    name: "Día del Padre 2026",
    status: "in_progress",
    current_node: 1,
    nodes: [
      {
        node_index: 0, node_key: "base", completed: true,
        data: {
          name: "Día del Padre 2026",
          short_description: "Campaña de temporada para dar mayor visibilidad a productos de carácter masculino durante la semana del Día del Padre.",
          commercial_event: "Día del Padre — 20 de junio",
          country: "Colombia||México||Chile||Argentina||Perú||Venezuela||Costa Rica||Panamá||Paraguay",
          responsible: "Supplier Success",
          objective: "Aumentar órdenes",
          hypothesis: "Si Dropi crea una vitrina curada de Día del Padre con productos coherentes con la temática de regalo masculino, los dropshippers tendrán mayor intención de explorar y vender esos productos, generando órdenes incrementales durante la semana del evento.",
          expected_result: "Mínimo 20 suppliers participantes, 80+ productos aprobados, 30+ órdenes incrementales en la semana del Día del Padre."
        }
      }
    ]
  }
];

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No Supabase client" }, { status: 500 });

  const results: { campaign: string; id: string; nodes: number }[] = [];

  for (const camp of CAMPAIGNS) {
    // Insert campaign
    const { data: created, error: campErr } = await supabase
      .from("campaigns")
      .insert({
        project_id: PROJECT_ID,
        name: camp.name,
        status: camp.status,
        current_node: camp.current_node,
      })
      .select()
      .single();

    if (campErr || !created) {
      return NextResponse.json({ error: campErr?.message ?? "Failed to create campaign", campaign: camp.name }, { status: 500 });
    }

    // Insert nodes
    const nodeInserts = camp.nodes.map((n) => ({
      campaign_id: created.id,
      node_index: n.node_index,
      node_key: n.node_key,
      data: n.data,
      completed: n.completed,
    }));

    const { error: nodesErr } = await supabase.from("campaign_nodes").insert(nodeInserts);
    if (nodesErr) {
      return NextResponse.json({ error: nodesErr.message, campaign: camp.name }, { status: 500 });
    }

    results.push({ campaign: camp.name, id: created.id, nodes: nodeInserts.length });
  }

  return NextResponse.json({ ok: true, seeded: results });
}
