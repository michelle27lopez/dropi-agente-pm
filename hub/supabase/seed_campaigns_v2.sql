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

-- ── CAMPAÑA 1: Dropicup Mundial 2026 ──────────────────────────

INSERT INTO campaigns (project_id, name, status, current_node)
VALUES (pid, 'Dropicup Mundial 2026', 'in_progress', 8)
RETURNING id INTO c1;

INSERT INTO campaign_nodes (campaign_id, node_index, node_key, completed, data) VALUES

-- Nodo 0: Ficha base
(c1, 0, 'base', true, '{
  "name": "Dropicup Mundial 2026",
  "short_description": "Campaña de temporada para agrupar productos relacionados con el mundial y validar si una vitrina curada aumenta la adopción de dropshippers.",
  "commercial_event": "Mundial de Clubes 2026",
  "country": "Colombia||México",
  "responsible": "Supplier Success",
  "objective": "Aumentar órdenes",
  "hypothesis": "Si Dropi crea una campaña curada del mundial, los suppliers postularán por mayor visibilidad y los dropshippers tendrán mayor intención de explorar esos productos, generando órdenes incrementales.",
  "expected_result": "Mínimo 20 suppliers participantes, 60+ productos aprobados, clics en vitrina de al menos 100 dropshippers, señal inicial de 30+ órdenes en la primera semana."
}'::jsonb),

-- Nodo 1: Tipo y mecánica
(c1, 1, 'type', true, '{
  "campaign_type": "Temporada",
  "requires_discount": "Opcional — el supplier decide",
  "has_expiration": "Sí",
  "supplier_motivator": "Mayor visibilidad",
  "notes": "Campaña inspirada en el Mundial de Clubes 2026. Incluye productos de diferentes categorías siempre que la relación con la temática sea clara. Descuento opcional pero recomendado para mayor visibilidad."
}'::jsonb),

-- Nodo 2: Segmento y elegibilidad
(c1, 2, 'eligibility', true, '{
  "universe": "Suppliers + productos",
  "supplier_type": "Verificado",
  "categories_theme": "Fútbol, fans, decoración deportiva, ropa deportiva, tecnología para ver partidos, accesorios de deporte.",
  "mandatory_conditions": "[{\"field\":\"Supplier: Verificado\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Supplier: Tiene productos activos\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Activo\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Stock\",\"operator\":\"≥\",\"value\":\"20\"},{\"field\":\"Producto: Tiene imagen\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "optional_conditions": "[{\"field\":\"Supplier: Recomendado por comercial\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Órdenes últimos 30 días\",\"operator\":\"≥\",\"value\":\"5\"}]",
  "exclusions": "[{\"field\":\"Supplier: Alerta operativa crítica\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Operativo: Cancelaciones recientes (%)\",\"operator\":\">\",\"value\":\"20\"},{\"field\":\"Producto: Fuera de categoría\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "min_stock": "20",
  "public_products_only": "Sí — solo productos públicos",
  "keyword_marco": "Dropicup",
  "max_products_per_supplier": "5 productos por supplier",
  "min_discount": "",
  "segment_size": "30–50 suppliers / 100–150 productos",
  "data_source": "Recomendación Supplier Success||Comercial||Base de productos Dropi",
  "segment_responsible": "Supplier Success"
}'::jsonb),

-- Nodo 3: Calendario operativo
(c1, 3, 'calendar', true, '{
  "date_convocation_start": "2026-06-05",
  "date_submission_end": "2026-06-12",
  "date_review_close": "2026-06-13",
  "date_assets_delivery": "2026-06-13",
  "date_showcase_publish": "2026-06-14",
  "date_dropshipper_comms": "2026-06-14",
  "date_campaign_start": "2026-06-14",
  "date_campaign_end": "2026-07-15",
  "calendar_notes": "Campaña ya en marcha. Fechas ajustadas sobre la marcha al ser la primera campaña piloto."
}'::jsonb),

-- Nodo 4: Convocatoria supplier
(c1, 4, 'invite', true, '{
  "invite_type": "Segmentada",
  "channels": "Comercial directo||WhatsApp||GHL",
  "message_template": "Hola [nombre] 👋\n\nTe queremos invitar a participar en Dropicup Mundial, la campaña especial de Dropi para la temporada del Mundial de Clubes 2026.\n\nSeleccionamos tu catálogo porque tienes productos que los dropshippers van a estar buscando. Es gratis participar — solo postula tus mejores productos antes del 12 de junio.\n\nLos productos seleccionados aparecerán en la vitrina especial de Dropicup 🏆 con mayor visibilidad ante miles de dropshippers.\n\n👉 Postula aquí: [link]",
  "cta": "Postular productos",
  "submission_link": "https://forms.gle/dropicup2026",
  "send_responsible": "Comercial",
  "supplier_list": "Sheet maestro de segmentación Dropicup — 2026-06-03. 40 suppliers Colombia identificados con productos relacionados con temática deportiva.",
  "invite_status": "Pendiente de enviar"
}'::jsonb),

-- Nodo 5: Postulación
(c1, 5, 'submission', true, '{
  "submission_channel": "Google Form",
  "form_link": "https://forms.gle/dropicup2026",
  "supplier_required_fields": "Nombre del supplier||ID del supplier||País||Contacto (WhatsApp / correo)||Comercial responsable",
  "product_required_fields": "Nombre del producto||ID del producto||Link del producto en Dropi||Categoría||Estado (activo/inactivo)||Público o privado",
  "commercial_required_fields": "Precio actual||Precio de campaña||Descuento ofrecido (%)||Stock disponible||Vigencia del precio especial",
  "required_confirmations": "Confirma que el producto tiene stock disponible||Confirma que el precio registrado es válido para la campaña||Acepta que Dropi puede aprobar o rechazar el producto||Confirma capacidad de despacho durante la campaña",
  "submission_responsible": "Supplier Success",
  "submission_notes": "El producto debe tener relación visible con la temática del mundial. Los comerciales pueden llenar el formulario en nombre del supplier."
}'::jsonb),

-- Nodo 6: Vitrina
(c1, 6, 'showcase', true, '{
  "showcase_type": "Categoría temporal beta",
  "showcase_name": "Dropicup Mundial 🏆",
  "showcase_description": "Productos seleccionados por Dropi para vender durante la temporada del Mundial de Clubes 2026. Todo para que tus clientes disfruten el mundial.",
  "product_source": "Lista de productos aprobados del nodo anterior",
  "product_groupings": "Destacados||Por categoría||Productos para pauta",
  "badges": "Seleccionado por Dropi||Producto de temporada||Campaña activa",
  "product_visible_info": "Imagen||Nombre del producto||Supplier||Precio actual||Precio de campaña||Descuento (%)||Stock disponible||Badge||CTA",
  "cta_main": "Ver producto",
  "distribution_channels": "GHL||WhatsApp||Userpilot",
  "validity_display": "Campaña activa hasta el 15 de julio de 2026",
  "showcase_link": "",
  "publication_responsible": "Producto"
}'::jsonb),

-- Nodo 7: Handoff final
(c1, 7, 'handoff', true, '{
  "handoff_format": "Google Doc",
  "handoff_link": "",
  "handoff_audience": "Producto||Growth||Comercial||Supplier Success||Comunicaciones",
  "schedule": "Semana 1 (5-12 jun): Segmentación y contacto supplier\nSemana 2 (12-14 jun): Cierre postulaciones y curaduría\nSemana 3 (14-21 jun): Publicar vitrina y activar dropshippers\nSemanas 4-6 (21 jun - 15 jul): Seguimiento activo y medición",
  "area_responsibilities": "Comercial: segmentar y convocar suppliers, llenar formularios en su nombre\nSupplier Success: revisar postulaciones y aprobar productos\nProducto: publicar vitrina y reportar resultados\nGrowth: comunicar a dropshippers y medir clics",
  "risks": "Sin funcionalidad de descuento en plataforma — operar manualmente si el supplier ofrece precio especial.\nSi no hay curaduría estricta, pueden entrar productos sin relación con el mundial (aprendizaje de Dropicop anterior).",
  "metrics": "Supplier: invitados: 40 / respondieron: — / postularon: — / aprobados: —\nDropshipper: impactados GHL: — / clics vitrina: — / productos tomados: —\nNegocio: órdenes: — / GMV: — / productos quietos activados: —",
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
