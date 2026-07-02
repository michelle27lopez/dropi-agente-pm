-- ═══════════════════════════════════════════════════════════════
-- SEED v2: Campañas con flujo simplificado (8 nodos)
-- Nodos: base · type · eligibility · calendar · invite · submission · showcase · handoff
-- Ejecutar DESPUÉS de 009_campaigns_reset.sql
-- ═══════════════════════════════════════════════════════════════

DO $seed$
DECLARE
  c1 UUID;
  c2 UUID;
  pid CONSTANT UUID := 'd64b428a-3c99-412f-8100-53e07bd20ed8';
BEGIN

-- ── CAMPAÑA 1: Amor y Amistad 2026 ──────────────────────────────

INSERT INTO campaigns (project_id, name, status, current_node)
VALUES (pid, 'Amor y Amistad 2026', 'in_progress', 8)
RETURNING id INTO c1;

INSERT INTO campaign_nodes (campaign_id, node_index, node_key, completed, data) VALUES

-- Nodo 0: Ficha base
(c1, 0, 'base', true, '{
  "name": "Amor y Amistad 2026",
  "short_description": "Vitrina curada de Dropi para el Día del Amor y la Amistad en Colombia. Validar si una campaña de temporada genera participación de suppliers y adopción de dropshippers a través de productos de regalo.",
  "commercial_event": "Día del Amor y la Amistad — 19 de septiembre de 2026 (tercer sábado de septiembre, Colombia)",
  "country": "Colombia",
  "responsible": "Supplier Success",
  "objective": "Aumentar órdenes",
  "hypothesis": "Si Dropi lanza una vitrina curada con productos de regalo para el Día del Amor y la Amistad, los dropshippers explorarán y tomarán más productos que en el catálogo general, porque el contexto comercial reduce la fricción de selección.",
  "expected_result": "Mínimo 20 suppliers participantes, 80+ productos aprobados, 40+ dropshippers que visitan la vitrina, 25+ órdenes generadas durante la campaña. Señal secundaria: al menos 5 productos quietos que se activan."
}'::jsonb),

-- Nodo 1: Tipo y mecánica
(c1, 1, 'type', true, '{
  "campaign_type": "Temporada",
  "requires_discount": "Opcional — el supplier decide",
  "supplier_motivator": "Mayor visibilidad",
  "notes": "Campaña piloto del experimento lean de Dinámicas de Catálogo. El foco es validar participación e intención antes de construir funcionalidad formal. Priorizar suppliers con productos de regalo: accesorios, bisutería, cuidado personal, tecnología portátil, hogar y detalles."
}'::jsonb),

-- Nodo 2: Segmento y elegibilidad
(c1, 2, 'eligibility', true, '{
  "universe": "Suppliers + productos",
  "supplier_type": "Verificado||Premium",
  "categories_theme": "Accesorios y bisutería, cuidado personal y belleza, tecnología portátil (audífonos, cargadores), hogar y decoración, detalles y regalos (velas, kits, sets), moda (bufandas, bolsos, carteras). Excluir: productos de uso exclusivo industrial, alimentos perecederos, productos sin relación con regalos o celebración.",
  "eligibility_criteria": "Suppliers verificados o premium en Colombia, con al menos un producto activo y público, stock mínimo de 300 unidades, ficha de producto completa (nombre descriptivo, imágenes de calidad, precio definido). El producto debe ser coherente con la temática de regalo o celebración del Día del Amor y la Amistad.",
  "min_stock": "300",
  "keyword_marco": "AmorYAmistad2026",
  "max_products_per_supplier": "5",
  "min_discount": "",
  "segment_size": "25–40 suppliers / 80–150 productos",
  "segment_responsible": "Supplier Success"
}'::jsonb),

-- Nodo 3: Calendario operativo
(c1, 3, 'calendar', true, '{
  "date_convocation_start": "15/jun/2026",
  "date_submission_end": "30/jun/2026",
  "date_showcase_publish": "21/ago/2026",
  "date_campaign_start": "24/ago/2026",
  "date_campaign_end": "21/sep/2026",
  "date_review_close": "10/jul/2026",
  "date_assets_delivery": "28/jul/2026",
  "date_dropshipper_comms": "24/ago/2026",
  "calendar_notes": "La campaña debe estar activa al menos 4 semanas antes del 19 de septiembre para que los dropshippers tengan tiempo de publicar y pautar. El marco de campaña debe estar listo antes del 10 de julio para incluirlo en el instructivo que se envía a los suppliers aprobados."
}'::jsonb),

-- Nodo 4: Convocatoria supplier
(c1, 4, 'invite', true, '{
  "invite_type": "Comercial manual",
  "channels": "Comercial directo||WhatsApp||GHL",
  "send_responsible": "Comercial",
  "message_template": "Hola [nombre del supplier] 👋\n\nEn Dropi estamos preparando una campaña especial para el Día del Amor y la Amistad (19 de septiembre) y queremos incluir tus productos.\n\n🎁 ¿Qué es? Una vitrina curada donde los dropshippers encontrarán los mejores productos de regalo — seleccionados por Dropi.\n\n✅ ¿Qué ganas? Mayor visibilidad frente a cientos de dropshippers activos en Colombia.\n\n📦 ¿Qué necesitas? Postular hasta 5 productos relacionados con regalos o celebración, con stock mínimo de 300 unidades y precio competitivo.\n\n📅 Fecha límite: 30 de junio de 2026.\n\n¿Te interesa participar? Respóndeme aquí o llena el formulario: [link]",
  "submission_link": "Por definir — formulario Google Form / Airtable (en construcción)",
  "supplier_list": "Base de suppliers verificados y premium en Colombia — segmento filtrado por Supplier Success con productos en categorías de regalo. Fuente: sheet maestro actualizado al 12 de junio de 2026. Estimado: 60–80 suppliers a contactar para lograr 25–40 participantes."
}'::jsonb),

-- Nodo 5: Postulación
(c1, 5, 'submission', true, '{
  "submission_channel": "Google Form",
  "form_link": "Por definir — en construcción",
  "submission_responsible": "Supplier Success",
  "supplier_required_fields": "Nombre del supplier||ID del supplier||País||Contacto (WhatsApp / correo)||Comercial responsable",
  "product_required_fields": "Nombre del producto||ID del producto||Link en Dropi||Categoría||Estado (activo/inactivo)||Público o privado",
  "commercial_required_fields": "Precio actual||Precio de campaña||Stock disponible||Vigencia del precio especial",
  "submission_notes": "El supplier debe confirmar que el producto tiene stock mínimo de 300 unidades disponibles durante toda la campaña (hasta el 21 de septiembre). Si ofrece precio especial, debe indicar si el descuento es sobre el precio proveedor o sobre el precio sugerido. Máximo 5 productos por supplier."
}'::jsonb),

-- Nodo 6: Vitrina
(c1, 6, 'showcase', true, '{
  "showcase_type": "Categoría temporal en Dropi",
  "showcase_name": "Amor y Amistad 2026 — Regalos para quienes más quieres",
  "showcase_description": "Productos seleccionados por Dropi para el Día del Amor y la Amistad. Encuentra detalles, accesorios y regalos que tus clientes van a amar.",
  "product_visible_info": "Imagen||Nombre del producto||Supplier||Precio actual||Precio de campaña||Stock disponible||Badge de campaña||CTA",
  "cta_main": "Ver producto",
  "distribution_channels": "Banner Userpilot||GHL||WhatsApp",
  "validity_display": "Válido hasta el 21 de septiembre de 2026 · Productos seleccionados por Dropi",
  "showcase_link": "Por definir — categoría beta en construcción",
  "publication_responsible": "Producto"
}'::jsonb),

-- Nodo 7: Handoff final
(c1, 7, 'handoff', true, '{
  "schedule": "Semana 1–2 (15–30 jun): Segmentación de suppliers y convocatoria por comerciales\nSemana 3–4 (1–10 jul): Recepción de postulaciones y curaduría\nSemana 5–7 (11–28 jul): Notificación de aprobados y entrega de marco de campaña\nSemana 8–9 (1–14 ago): Suppliers aplican marco y palabra clave a sus productos\nSemana 10 (15–21 ago): Publicación de categoría temporal y banner Userpilot\nSemana 11–14 (24 ago–21 sep): Campaña activa — seguimiento, medición y soporte\nSemana 15 (22–25 sep): Cierre y consolidación de resultados",
  "area_responsibilities": "Supplier Success: segmentar, convocar, revisar postulaciones, curar y aprobar productos\nComercial: contactar suppliers, hacer seguimiento, registrar postulaciones\nMarketing / Diseño: crear banner Userpilot, marco de producto y piezas de comunicación\nProducto: crear categoría temporal, configurar banner en Userpilot\nGrowth: comunicar la campaña a dropshippers, medir clics y adopción\nLíder de campaña: coordination general y decisiones de priorización",
  "risks": "1. Bajo volumen de postulaciones — mitigar con seguimiento proactivo del comercial\n2. Productos postulados fuera de temática — mitigar con criterios claros en el formulario\n3. Marco no aplicado correctamente por el supplier — mitigar con instructivo detallado y validación antes de publicar\n4. Categoría temporal sin desarrollo disponible — alternativa: vitrina en Sheet curado + envío GHL\n5. Descuento prometido no operativo en plataforma — operar manualmente con precio de campaña en la descripción",
  "metrics": "Supplier: invitados / respondieron / postularon / aprobados / con marco aplicado\nProducto: productos aprobados / rechazados / con palabra clave / con marco\nDropshipper: impactados por banner / clics en vitrina / productos vistos / productos tomados\nNegocio: órdenes generadas / GMV / productos con primera orden / productos quietos activados\nOperativo: cancelaciones / novedades / quiebres de stock durante campaña",
  "handoff_link": "Por definir — Google Doc en construcción",
  "validation_status": "Borrador — pendiente de revisión interna"
}'::jsonb);


-- ── CAMPAÑA 2: Día del Padre 2026 ─────────────────────────────

INSERT INTO campaigns (project_id, name, status, current_node)
VALUES (pid, 'Día del Padre 2026', 'in_progress', 1)
RETURNING id INTO c2;

INSERT INTO campaign_nodes (campaign_id, node_index, node_key, completed, data) VALUES

-- Nodo 0: Ficha base
(c2, 0, 'base', true, '{
  "name": "Día del Padre 2026",
  "short_description": "Campaña de temporada para dar mayor visibilidad a productos de carácter masculino durante la semana del Día del Padre.",
  "commercial_event": "Día del Padre — 20 de junio",
  "country": "Colombia||México||Chile||Argentina||Perú||Venezuela||Costa Rica||Panamá||Paraguay",
  "responsible": "Supplier Success",
  "objective": "Aumentar órdenes",
  "hypothesis": "Si Dropi crea una vitrina curada de Día del Padre con productos coherentes con la temática de regalo masculino, los dropshippers tendrán mayor intención de explorar y vender esos productos, generando órdenes incrementales durante la semana del evento.",
  "expected_result": "Mínimo 20 suppliers participantes, 80+ productos aprobados, 30+ órdenes incrementales en la semana del Día del Padre."
}'::jsonb);

END $seed$;
