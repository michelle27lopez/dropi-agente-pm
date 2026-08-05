import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase credentials missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Obtener Célula Sellers
  const { data: celula, error: celulaError } = await supabase
    .from("celulas")
    .select("id, slug")
    .eq("slug", "sellers")
    .maybeSingle();

  if (celulaError || !celula) {
    return NextResponse.json({ error: celulaError?.message || "Célula Sellers no encontrada" }, { status: 404 });
  }

  // 2. Obtener Proyectos Existentes
  const { data: proyectos, error: proyectosError } = await supabase
    .from("projects")
    .select("*")
    .eq("celula_owner_id", celula.id);

  if (proyectosError) {
    return NextResponse.json({ error: proyectosError.message }, { status: 500 });
  }

  // Mapa de proyectos por project_code o name
  const projectMap = new Map<string, any>();
  (proyectos || []).forEach((p) => {
    if (p.project_code) projectMap.set(p.project_code.toUpperCase(), p);
    projectMap.set(p.name.trim().toLowerCase(), p);
  });

  // Proyecto Padre para integraciones
  const dropifyParent = projectMap.get("PRM-1239") || projectMap.get("refactor dropify") || (proyectos || []).find((p) => p.name.includes("Dropify"));
  const pagePilotParent = projectMap.get("PRM-1238") || projectMap.get("page pilot") || (proyectos || []).find((p) => p.name.includes("Page Pilot"));

  // 3. Definición de los 5 Delivery Proyectos
  const deliveryItems = [
    {
      name: "Bugs Tienda Nube (V1)",
      project_code: "STID-6598",
      summary: "Resolver 6 errores de integración críticos (sincronización de variables talla/color, importación masiva, webhooks inestables y direcciones sin Barrio/Piso). Bloqueante: Falta de asignación de recurso dev en Jira por parte de ingeniería (Jose Giraldo).",
      type: "Delivery Proyecto",
      estado_interno: "en DEV",
      handoff_status: "Handoff hecho",
      parent_project_id: dropifyParent?.id || null,
      celula_owner_id: celula.id,
      status: "in_progress",
    },
    {
      name: "Tienda Nube V2 (Handoff)",
      project_code: "DROP-25311",
      summary: "Pre-handoff activo de la nueva versión V2. En aclaración técnica liderada por Alejandra Melo con Diego Pérez sobre la estructura del submenú y la carga de imágenes.",
      type: "Delivery Proyecto",
      estado_interno: "Pendiente Handoff",
      handoff_status: "Listo para handoff",
      parent_project_id: dropifyParent?.id || null,
      celula_owner_id: celula.id,
      status: "in_progress",
    },
    {
      name: "Page Pilot (Creación Landings)",
      project_code: "PRM-1238-DEL",
      summary: "Facilitar maquetación de landings para novatos. Handoff a QA realizado por PD. Persisten errores en generación de landings y no se aplicó el campo obligatorio de Ángulo de Venta.",
      type: "Delivery Proyecto",
      estado_interno: "En QA",
      handoff_status: "Handoff hecho",
      parent_project_id: pagePilotParent?.id || null,
      celula_owner_id: celula.id,
      status: "in_progress",
    },
    {
      name: "Dropify Shopify 2.0",
      project_code: "PROD-580",
      summary: "Re-arquitectura Built for Shopify y sync nativo. Pruebas PT2 en curso. Pendiente completar matriz de pruebas de fulfillment de combos con Alejandra Melo.",
      type: "Delivery Proyecto",
      estado_interno: "En QA",
      handoff_status: "Handoff hecho",
      parent_project_id: dropifyParent?.id || null,
      celula_owner_id: celula.id,
      status: "in_progress",
    },
    {
      name: "Dropify WooCommerce",
      project_code: "DROP-17355",
      summary: "Migración completa del plugin de WooCommerce a React para paridad con Shopify 2.0. En desarrollo activo por TI desde el 2 de julio (Fecha de entrega pautada: 4 de agosto).",
      type: "Delivery Proyecto",
      estado_interno: "en DEV",
      handoff_status: "Handoff hecho",
      parent_project_id: dropifyParent?.id || null,
      celula_owner_id: celula.id,
      status: "in_progress",
    },
  ];

  const results = [];

  for (const item of deliveryItems) {
    const existing = projectMap.get(item.project_code) || projectMap.get(item.name.toLowerCase());
    if (existing) {
      const { data: updated, error: updateError } = await supabase
        .from("projects")
        .update({
          name: item.name,
          summary: item.summary,
          type: item.type,
          estado_interno: item.estado_interno,
          handoff_status: item.handoff_status,
          parent_project_id: item.parent_project_id,
        })
        .eq("id", existing.id)
        .select()
        .single();
      results.push({ action: "updated", item: updated || updateError });
    } else {
      const { data: created, error: createError } = await supabase
        .from("projects")
        .insert(item)
        .select()
        .single();
      results.push({ action: "created", item: created || createError });
    }
  }

  return NextResponse.json({
    message: "Célula Sellers recategorizada con éxito",
    celula_id: celula.id,
    deliveries_processed: results.length,
    results,
  });
}
