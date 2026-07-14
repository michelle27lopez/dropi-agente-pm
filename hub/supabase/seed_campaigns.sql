-- Seed: Dropicup Mundial 2026 + Remates de Stock Junio 2026
-- Pegar en Supabase > SQL Editor > New query > Run

DO $seed$
DECLARE
  c1 UUID;
  c2 UUID;
  pid CONSTANT UUID := 'd64b428a-3c99-412f-8100-53e07bd20ed8';
BEGIN

-- ── CAMPAÑA 1: Dropicup Mundial 2026 ──────────────────────────

INSERT INTO campaigns (project_id, name, status, current_node)
VALUES (pid, 'Dropicup Mundial 2026', 'in_progress', 10)
RETURNING id INTO c1;

INSERT INTO campaign_nodes (campaign_id, node_index, node_key, completed, data) VALUES

(c1, 0, 'campaign', true, '{
  "name": "Dropicup Mundial 2026",
  "short_description": "Campaña de temporada para agrupar productos relacionados con el mundial y validar si una vitrina curada aumenta la adopción de dropshippers.",
  "objective": "Generar GMV||Dar visibilidad a suppliers||Validar interés de dropshippers",
  "experiment_type": "Vitrina manual||Campaña vía GHL||Campaña vía WhatsApp",
  "country": "Colombia||México",
  "date_convocation_start": "2026-06-05",
  "date_submission_end": "2026-06-12",
  "date_publish": "2026-06-14",
  "date_end": "2026-07-15",
  "responsible": "Supplier Success",
  "hypothesis": "Si Dropi crea una campaña curada del mundial, los suppliers postularán por mayor visibilidad y los dropshippers tendrán mayor intención de explorar esos productos, generando órdenes incrementales.",
  "expected_result": "Mínimo 20 suppliers participantes, 60+ productos aprobados, clics en vitrina de al menos 100 dropshippers, y señal inicial de 30+ órdenes en la primera semana."
}'::jsonb),

(c1, 1, 'type', true, '{
  "campaign_type": "Campaña de temporada",
  "requires_discount": "Sí — descuento opcional",
  "requires_campaign_price": "Opcional",
  "has_expiration": "Sí",
  "supplier_motivator": "Mayor visibilidad",
  "what_to_move": "Órdenes||GMV||Productos quietos||Categoría específica",
  "commercial_rules": "Productos deben relacionarse con fútbol, fans, decoración, ropa deportiva o tecnología para ver partidos. Stock mínimo 20 unidades. Precio de campaña opcional pero recomendado para mayor visibilidad en vitrina.",
  "notes": "Campaña inspirada en el Mundial de Clubes 2026. Incluye productos de diferentes categorías siempre que la relación con la temática sea clara."
}'::jsonb),

(c1, 2, 'segment', true, '{
  "universe": "Suppliers + productos",
  "mandatory_conditions": "[{\"field\":\"Supplier: Verificado\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Supplier: Tiene productos activos\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Supplier: Tiene contacto válido\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Activo\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Stock\",\"operator\":\"≥\",\"value\":\"20\"}]",
  "optional_conditions": "[{\"field\":\"Supplier: Recomendado por comercial\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Órdenes últimos 30 días\",\"operator\":\"≥\",\"value\":\"5\"}]",
  "exclusions": "[{\"field\":\"Supplier: Alerta operativa crítica\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Operativo: Novedades críticas\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Operativo: Cancelaciones recientes (%)\",\"operator\":\">\",\"value\":\"20\"}]",
  "segment_size": "30–50 suppliers / 100–150 productos",
  "data_source": "Recomendación Supplier Success||Comercial||Reporte de productos sin venta||Base de productos",
  "segment_responsible": "Supplier Success",
  "segment_notes": "Priorizar suppliers en Colombia que ya tienen categorías relacionadas con hogar, tecnología y moda. Validar manualmente que los productos tengan relación visible con la temática del mundial."
}'::jsonb),

(c1, 3, 'rules', true, '{
  "mandatory_rules": "[{\"field\":\"Producto: Activo\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Tiene imagen\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Stock\",\"operator\":\"≥\",\"value\":\"20\"},{\"field\":\"Producto: Tiene precio vigente\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "recommended_rules": "[{\"field\":\"Producto: Ficha completa\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Margen estimado (%)\",\"operator\":\"≥\",\"value\":\"25\"}]",
  "exclusion_rules": "[{\"field\":\"Operativo: Riesgo de devolución\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Fuera de categoría\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "threshold_stock": "20 unidades",
  "threshold_discount": "",
  "threshold_margin": "20%",
  "threshold_max_products": "5 productos por supplier",
  "requires_price_validity": "Sí — obligatorio definir fecha de vigencia",
  "campaign_specific_rules": "El producto debe relacionarse visiblemente con fútbol, fans, decoración, ropa deportiva o tecnología para ver partidos. Se excluyen productos sin relación temática con el mundial.",
  "eligibility_criteria": "Elegible → cumple reglas obligatorias + relación temática clara\nRequiere ajuste → falta imagen o ficha incompleta (corregible)\nNo elegible → producto inactivo, sin stock o sin relación temática\nPendiente de validación → requiere revisión manual del equipo\nAprobado por excepción → no cumple todo pero se aprueba con justificación del comercial"
}'::jsonb),

(c1, 4, 'invite', true, '{
  "invite_type": "Segmentada",
  "channels": "Comercial directo||WhatsApp||GHL",
  "message_motivators": "Mayor visibilidad||Vender más volumen",
  "message_template": "Hola [nombre] 👋\n\nTe queremos invitar a participar en Dropicup Mundial, la campaña especial de Dropi para la temporada del Mundial de Clubes 2026.\n\nSeleccionamos tu catálogo porque tienes productos que los dropshippers van a estar buscando. Es gratis participar — solo necesitas postular tus mejores productos antes del 12 de junio.\n\nLos productos seleccionados aparecerán en la vitrina especial de Dropicup 🏆 con mayor visibilidad ante miles de dropshippers.\n\n👉 Postula aquí: [link]",
  "cta": "Postular productos",
  "submission_link": "https://forms.gle/dropicup2026",
  "submission_deadline": "2026-06-12",
  "send_responsible": "Comercial",
  "supplier_list": "Sheet maestro de segmentación Dropicup — versión 2026-06-03. Columnas: ID supplier, Nombre, País, Comercial responsable, Estado de contacto.",
  "invite_status": "Pendiente de enviar"
}'::jsonb),

(c1, 5, 'submission', true, '{
  "submission_channel": "Google Form",
  "form_link": "https://forms.gle/dropicup2026",
  "supplier_required_fields": "Nombre del supplier||ID del supplier||País||Contacto (WhatsApp / correo)||Comercial responsable",
  "product_required_fields": "Nombre del producto||ID del producto||Link del producto en Dropi||Categoría||Estado del producto (activo/inactivo)",
  "commercial_required_fields": "Precio actual||Precio de campaña||Stock disponible||Vigencia del precio especial||Descuento ofrecido (%)",
  "motivator_field": "Sí — campo opcional",
  "required_confirmations": "Confirma que el producto tiene stock disponible||Confirma que el precio registrado es válido para la campaña||Acepta que Dropi revisará y puede aprobar o rechazar el producto||Confirma capacidad de despacho durante la campaña",
  "submission_responsible": "Supplier Success",
  "submission_notes": "Los comerciales pueden llenar el formulario en nombre del supplier si el proveedor no tiene acceso directo. Asegurarse de que el producto tenga relación con la temática del mundial antes de enviarlo."
}'::jsonb),

(c1, 6, 'showcase', true, '{
  "showcase_type": "Categoría temporal beta",
  "showcase_name": "Dropicup Mundial 🏆",
  "showcase_description": "Productos seleccionados por Dropi para vender durante la temporada del Mundial de Clubes 2026. Todo para que tus clientes disfruten el mundial.",
  "product_source": "Lista de productos aprobados del Nodo anterior",
  "product_groupings": "Destacados||Por categoría||Productos para pauta",
  "badges": "Seleccionado por Dropi||Producto de temporada||Campaña activa",
  "product_visible_info": "Imagen||Nombre del producto||Supplier||Precio actual||Precio de campaña||Descuento (%)||Stock disponible||Badge||CTA",
  "cta_main": "Ver producto",
  "distribution_channels": "GHL||WhatsApp||Userpilot",
  "validity_display": "Campaña activa hasta el 15 de julio de 2026",
  "showcase_link": "",
  "publication_responsible": "Producto"
}'::jsonb),

(c1, 7, 'handoff', true, '{
  "handoff_format": "Google Doc",
  "handoff_link": "",
  "handoff_audience": "Producto, Growth, Comercial, Supplier Success, Comunicaciones",
  "schedule": "Semana 1 (5-12 jun): Segmentación y contacto supplier\nSemana 2 (12-14 jun): Cierre postulaciones y curaduría de productos\nSemana 3 (14-21 jun): Publicación vitrina y activación dropshippers\nSemanas 4-6 (21 jun - 15 jul): Seguimiento activo y medición"
}'::jsonb),

(c1, 8, 'measure', true, '{
  "supplier_metrics": "Invitados: 40\nRespondieron: —\nPostularon: —\nProductos postulados: —\nAprobados: —\nRechazo por regla: —",
  "dropshipper_metrics": "Impactados (GHL): —\nClics en vitrina: —\nProductos consultados: —\nProductos tomados/agregados: —",
  "business_metrics": "Órdenes: —\nGMV: —\nProductos quietos activados: —\nSuppliers con primera venta en campaña: —",
  "learnings": "Pendiente de completar al cierre de la campaña (15 jul 2026)."
}'::jsonb),

(c1, 9, 'decision', true, '{
  "decision": "Iterar — hay señal pero falta ajustar",
  "rationale": "Pendiente de completar al cierre de la campaña.",
  "next_step": "Pendiente de completar.",
  "executive_recommendation": "Pendiente de completar."
}'::jsonb);


-- ── CAMPAÑA 2: Remates de Stock — Junio 2026 ──────────────────

INSERT INTO campaigns (project_id, name, status, current_node)
VALUES (pid, 'Remates de Stock — Junio 2026', 'in_progress', 10)
RETURNING id INTO c2;

INSERT INTO campaign_nodes (campaign_id, node_index, node_key, completed, data) VALUES

(c2, 0, 'campaign', true, '{
  "name": "Remates de Stock — Junio 2026",
  "short_description": "Campaña de remate para ayudar a suppliers a salir de inventario acumulado con descuento real, y validar si el precio de campaña genera adopción en dropshippers.",
  "objective": "Activar productos quietos||Ayudar a suppliers a salir de stock||Generar GMV||Validar productos con descuento",
  "experiment_type": "Campaña manual||Campaña vía WhatsApp||Campaña vía GHL",
  "country": "Colombia",
  "date_convocation_start": "2026-06-03",
  "date_submission_end": "2026-06-07",
  "date_publish": "2026-06-09",
  "date_end": "2026-06-30",
  "responsible": "Supplier Success",
  "hypothesis": "Si Dropi cura productos con descuento real de suppliers que necesitan salir de stock, los dropshippers tendrán mayor intención de tomar esos productos para pauta o venta directa, generando rotación de inventario quieto.",
  "expected_result": "Mínimo 15 suppliers participantes, 80+ productos de remate aprobados, descuentos mínimos del 15%, y señal de adopción en al menos 50 dropshippers en la primera semana."
}'::jsonb),

(c2, 1, 'type', true, '{
  "campaign_type": "Campaña de remate",
  "requires_discount": "Sí — descuento obligatorio",
  "requires_campaign_price": "Sí",
  "has_expiration": "Sí",
  "supplier_motivator": "Salir de stock",
  "what_to_move": "Productos quietos||Unidades||Productos con alto stock||Productos con primera venta pendiente",
  "commercial_rules": "Descuento mínimo obligatorio del 15% sobre el precio actual. Precio de campaña con vigencia definida hasta el 30 de junio. Stock mínimo de 30 unidades para garantizar disponibilidad durante toda la campaña.",
  "notes": "Se priorizan productos sin ventas en los últimos 60 días con stock mayor a 50 unidades. El objetivo del supplier es salir de inventario, no ganar margen."
}'::jsonb),

(c2, 2, 'segment', true, '{
  "universe": "Suppliers + productos",
  "mandatory_conditions": "[{\"field\":\"Supplier: Verificado\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Supplier: Tiene contacto válido\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Supplier: Buen cumplimiento\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Activo\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Stock\",\"operator\":\"≥\",\"value\":\"30\"},{\"field\":\"Producto: Órdenes últimos 60 días\",\"operator\":\"≤\",\"value\":\"5\"}]",
  "optional_conditions": "[{\"field\":\"Producto: Órdenes últimos 90 días\",\"operator\":\"≤\",\"value\":\"10\"},{\"field\":\"Producto: Baja rotación\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "exclusions": "[{\"field\":\"Supplier: Alerta operativa crítica\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Operativo: Cancelaciones recientes (%)\",\"operator\":\">\",\"value\":\"25\"},{\"field\":\"Operativo: Novedades críticas\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "segment_size": "15–30 suppliers / 80–120 productos",
  "data_source": "Reporte de productos sin venta||Reporte de alto stock||Recomendación Supplier Success||Sheet manual",
  "segment_responsible": "Supplier Success",
  "segment_notes": "Usar reporte de productos con stock > 30 unidades y 0 órdenes en 60 días. Cruzar con reporte de suppliers con inventario que llevan más de 45 días sin despacho. Priorizar Colombia."
}'::jsonb),

(c2, 3, 'rules', true, '{
  "mandatory_rules": "[{\"field\":\"Producto: Activo\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Tiene imagen\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Stock\",\"operator\":\"≥\",\"value\":\"30\"},{\"field\":\"Campaña: Descuento definido\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Campaña: Precio de campaña definido\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Campaña: Vigencia de precio\",\"operator\":\"es Sí\",\"value\":\"es Sí\"}]",
  "recommended_rules": "[{\"field\":\"Producto: Ficha completa\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Producto: Margen estimado (%)\",\"operator\":\"≥\",\"value\":\"20\"}]",
  "exclusion_rules": "[{\"field\":\"Operativo: Riesgo de devolución\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Operativo: Inconsistencias de inventario\",\"operator\":\"es Sí\",\"value\":\"es Sí\"},{\"field\":\"Campaña: Margen cumple mínimo\",\"operator\":\"es No\",\"value\":\"es No\"}]",
  "threshold_stock": "30 unidades",
  "threshold_discount": "15% mínimo sobre precio actual",
  "threshold_margin": "20%",
  "threshold_max_products": "8 productos por supplier",
  "requires_price_validity": "Sí — obligatorio definir fecha de vigencia",
  "campaign_specific_rules": "El descuento debe ser real y verificable: precio de campaña debe ser al menos 15% menor al precio vigente en la plataforma. Vigencia hasta el 30 de junio. El supplier no puede subir el precio base para simular un descuento mayor.",
  "eligibility_criteria": "Elegible → stock ≥ 30 + descuento ≥ 15% + precio de campaña + vigencia definida\nRequiere ajuste → falta imagen o ficha, corregible antes del 7 de junio\nNo elegible → descuento insuficiente, sin stock o producto inactivo\nPendiente → requiere confirmación de precio por parte del comercial\nAprobado por excepción → descuento < 15% pero supplier estratégico con justificación"
}'::jsonb),

(c2, 4, 'invite', true, '{
  "invite_type": "Segmentada",
  "channels": "Comercial directo||WhatsApp",
  "message_motivators": "Salir de stock||Vender más volumen",
  "message_template": "Hola [nombre] 👋\n\nVemos que tienes productos con stock acumulado que no han tenido movimiento en los últimos meses. Queremos ayudarte a sacarlos.\n\nEn Dropi estamos armando una campaña especial de Remates de Junio para darles visibilidad a esos productos con precio especial. Tú defines el descuento, nosotros ponemos la vitrina y los dropshippers.\n\n¿Te interesa participar? Tienes hasta el 7 de junio para postular.\n\n👉 Postula aquí: [link]",
  "cta": "Postular productos",
  "submission_link": "https://forms.gle/remates-junio-2026",
  "submission_deadline": "2026-06-07",
  "send_responsible": "Comercial",
  "supplier_list": "Reporte de productos quietos — stock > 30 unidades, 0 órdenes en 60 días. Extraído el 2026-06-02. 28 suppliers identificados en Colombia.",
  "invite_status": "Pendiente de enviar"
}'::jsonb),

(c2, 5, 'submission', true, '{
  "submission_channel": "Google Form",
  "form_link": "https://forms.gle/remates-junio-2026",
  "supplier_required_fields": "Nombre del supplier||ID del supplier||País||Contacto (WhatsApp / correo)||Comercial responsable||Estado del supplier",
  "product_required_fields": "Nombre del producto||ID del producto||Link del producto en Dropi||Categoría||Estado del producto (activo/inactivo)||Tipo (simple o variable)",
  "commercial_required_fields": "Precio actual||Precio de campaña||Descuento ofrecido (%)||Stock disponible||Stock habilitado para campaña||Vigencia del precio especial",
  "motivator_field": "Sí — campo obligatorio",
  "required_confirmations": "Confirma que el producto tiene stock disponible||Confirma que el precio registrado es válido para la campaña||Acepta que Dropi revisará y puede aprobar o rechazar el producto||Confirma vigencia del precio si hay descuento||Confirma capacidad de despacho durante la campaña",
  "submission_responsible": "Supplier Success",
  "submission_notes": "El campo de descuento es obligatorio. Si el comercial llena el form en nombre del supplier, debe confirmar el precio especial directamente con el proveedor antes de registrar. No aceptar productos con descuento < 15%."
}'::jsonb),

(c2, 6, 'showcase', true, '{
  "showcase_type": "Sheet curado",
  "showcase_name": "Remates de Stock — Junio 2026",
  "showcase_description": "Productos con descuento real seleccionados por Dropi. Precios especiales solo hasta el 30 de junio. Ideal para dropshippers que quieren vender con margen sin invertir en pauta.",
  "product_source": "Lista de productos aprobados del Nodo anterior",
  "product_groupings": "Remates / descuento||Alto stock||Terminan pronto||Por categoría",
  "badges": "Remate||Precio especial||Últimas unidades||Termina pronto",
  "product_visible_info": "Imagen||Nombre del producto||Supplier||Precio actual||Precio de campaña||Descuento (%)||Stock disponible||Vigencia||Badge||CTA",
  "cta_main": "Ver producto",
  "distribution_channels": "WhatsApp||GHL||Comunidad / grupo",
  "validity_display": "Precio especial vigente hasta el 30 de junio de 2026",
  "showcase_link": "",
  "publication_responsible": "Supplier Success"
}'::jsonb),

(c2, 7, 'handoff', true, '{
  "handoff_format": "Sheet maestro",
  "handoff_link": "",
  "handoff_audience": "Supplier Success, Comercial, Growth, Comunicaciones",
  "schedule": "3-7 jun: Segmentación, contacto y postulación\n7-9 jun: Curaduría y aprobación de productos\n9 jun: Publicación vitrina\n9-30 jun: Seguimiento y medición\n30 jun: Cierre y reporte"
}'::jsonb),

(c2, 8, 'measure', true, '{
  "supplier_metrics": "Invitados: 28\nRespondieron: —\nPostularon: —\nProductos postulados: —\nAprobados: —\nRechazo por descuento insuficiente: —",
  "dropshipper_metrics": "Impactados: —\nClics en vitrina: —\nProductos consultados: —\nProductos tomados o agregados: —",
  "business_metrics": "Órdenes: —\nGMV: —\nUnidades movidas: —\nProductos quietos activados: —\nDescuento promedio efectivo: —",
  "learnings": "Pendiente de completar al cierre (30 jun 2026). Métrica clave: ¿el descuento real genera adopción diferencial vs productos sin descuento?"
}'::jsonb),

(c2, 9, 'decision', true, '{
  "decision": "Iterar — hay señal pero falta ajustar",
  "rationale": "Pendiente de completar al cierre de la campaña.",
  "next_step": "Pendiente de completar.",
  "executive_recommendation": "Pendiente de completar."
}'::jsonb);

END $seed$;
