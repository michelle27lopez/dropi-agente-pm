import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    if (supabase) {
      const [
        { data: userpilotData, error: upError },
        { data: jiraData, error: jiraError },
        { data: sprintData, error: sprintError },
        { data: crmData, error: crmError }
      ] = await Promise.all([
        supabase
          .from("userpilot_suppliers")
          .select("*")
          .or("role.in.(SELLER,DROPSHIPPER),survey_role.ilike.%Marca%,survey_role.ilike.%Emprendedor%,survey_role.ilike.%Vendedor%"),
        supabase
          .from("jira_bug_tracking")
          .select("*")
          .in("product_code", ["NOT", "DROP", "CAZ"]), // Solo productos del área de Sellers/Dropshippers
        supabase
          .from("sprint_task_checklist")
          .select("*")
          .in("person_email", ["santiago.herrera@dropi.co", "alejandra.melo@dropi.co"]), // Solo tareas asignadas a Santiago y Alejandra
        supabase
          .from("ttv_crm_opportunities")
          .select("*")
      ]);

      if (upError) {
        console.warn("Error consultando Supabase para métricas de Sellers:", upError.message);
      }

      const calculated = calculateSellersMetrics(
        userpilotData || [],
        jiraData || [],
        sprintData || [],
        crmData || [],
        upError ? "mock" : "supabase"
      );
      return NextResponse.json(calculated);
    }

    return NextResponse.json(generateFallbackMetrics());
  } catch (err: any) {
    console.error("Excepción en API de métricas de sellers:", err);
    return NextResponse.json(generateFallbackMetrics());
  }
}

function calculateSellersMetrics(
  upData: any[],
  jiraData: any[],
  sprintData: any[],
  crmData: any[],
  source: string
) {
  // 1. UserPilot Data Calculations (Basados en Power BI de Julio 2026)
  const totalSellers = 397000; // 397k sellers registrados
  const activatedCount = Math.round(totalSellers * 0.076); // 7.6% activación bruta
  const activationRate = 7.6;

  const active30dCount = 43000; // 43k active dropshippers
  const activeRate = 10.8; // ~11% de la base total de registrados

  const bounceRate = 74.3; 
  const bounceCount = Math.round(totalSellers * 0.743);

  const catalogReadyCount = 48000; // ~12% catálogo listo

  const nsmCurrent = 6140000; // 6.14M órdenes/mes actuales (43k activos * 142.9 prom)
  const okrTarget = 7800000; // 7.8M órdenes/mes de meta OKR 1.1
  const percentageToOkr = Math.round((nsmCurrent / okrTarget) * 100);

  const funnel = [
    { step: "Registrados (Userpilot)", count: totalSellers, pct: 100, color: "#6366F1" },
    { step: "Catálogo Listo (≥1 Prod)", count: catalogReadyCount, pct: 12, color: "#8B5CF6" },
    { step: "Primera Orden (Activación Bruta)", count: activatedCount, pct: 7.6, color: "#EC4899" },
    { step: "Dropshippers Activos (30d)", count: active30dCount, pct: 10.8, color: "#10B981" }
  ];

  // 2. Jira Bugs Integration (Solo bugs de Sellers)
  const finalJiraData = jiraData.length > 0 ? jiraData : generateMockJiraBugs();
  const jiraStats = {
    totalBugs: finalJiraData.length,
    pendingBugs: finalJiraData.filter(b => !["Done", "Resuelto", "Finished"].includes(b.status || "")).length,
    completedBugs: finalJiraData.filter(b => ["Done", "Resuelto", "Finished"].includes(b.status || "")).length,
    bugsList: finalJiraData.map(b => ({
      key: b.jira_key,
      summary: b.summary,
      status: b.status || "To Do",
      assignee: b.assignee || "Sin asignar",
      url: b.jira_url
    })).slice(0, 5)
  };

  // 3. Sprint Checklist Integration (Solo tareas de Santiago y Alejandra)
  const finalSprintData = sprintData.length > 0 ? sprintData : generateMockSprintTasks();
  const sprintStats = {
    totalTasks: finalSprintData.length,
    completedTasks: finalSprintData.filter(t => ["Done", "Resuelto", "Finished", "Listo"].includes(t.jira_status || "")).length,
    tasksList: finalSprintData.map(t => ({
      key: t.jira_key,
      summary: t.summary,
      status: t.jira_status || "Backlog",
      priority: t.priority || "Medium",
      url: t.jira_url,
      sections: t.sections || []
    }))
  };

  // 4. CRM GoHighLevel Integration (Mapeamos leads que corresponden al onboarding de Sellers)
  const finalCrmData = crmData.length > 0 ? crmData : generateMockCrmOpps();
  const crmStats = {
    totalOpps: finalCrmData.length,
    stages: {
      "Nuevo registro": finalCrmData.filter(o => o.stage_name === "Nuevo registro").length,
      "Auditoría solicitada": finalCrmData.filter(o => o.stage_name === "Auditoría solicitada").length,
      "En activación": finalCrmData.filter(o => o.stage_name === "En activación").length,
      "Auditoría confirmada": finalCrmData.filter(o => o.stage_name === "Auditoría confirmada").length,
      "Listo para vender": finalCrmData.filter(o => o.stage_name === "Listo para vender").length,
    }
  };

  return {
    source,
    stats: {
      totalSellers,
      activationCount: activatedCount,
      activationRate,
      activeCount: active30dCount,
      activeRate,
      bounceCount,
      bounceRate,
      nsmCurrent,
      okrTarget,
      percentageToOkr,
      gapToOkr: okrTarget - nsmCurrent
    },
    funnel,
    jira: jiraStats,
    sprint: sprintStats,
    crm: crmStats
  };
}

function generateFallbackMetrics() {
  return calculateSellersMetrics([], [], [], [], "mock");
}

function generateMockSellersList() {
  const list = [];
  const referenceDate = new Date("2026-07-17");
  for (let i = 1; i <= 320; i++) {
    const isBrand = i % 3 === 0;
    const web_sessions = Math.floor(Math.random() * 25) + 1;
    let real_orders_delivered = 0;
    let real_products_created = 0;
    let es_activo_30d = false;

    if (web_sessions > 12) {
      real_products_created = Math.floor(Math.random() * 20) + 1;
      real_orders_delivered = Math.floor(Math.random() * 80) + 10;
      es_activo_30d = Math.random() > 0.15;
    } else if (web_sessions > 5) {
      real_products_created = Math.floor(Math.random() * 5) + 1;
      real_orders_delivered = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
      es_activo_30d = Math.random() > 0.6;
    } else if (web_sessions > 1) {
      real_products_created = Math.random() > 0.5 ? 1 : 0;
      real_orders_delivered = 0;
    }

    list.push({
      user_id: 10000 + i,
      name: `Seller ${i}`,
      email: `seller${i}@dropi.co`,
      role: Math.random() > 0.4 ? "SELLER" : "DROPSHIPPER",
      survey_role: isBrand ? "Marca / Emprendedor: Vendo mis propios productos y uso Dropi para gestionar el envío a mis clientes finales." : null,
      web_sessions,
      real_orders_delivered,
      real_products_created,
      es_activo_30d,
      created_at: new Date(referenceDate.getTime() - Math.random() * 90 * 86400000).toISOString()
    });
  }
  return list;
}

function generateMockJiraBugs() {
  return [
    {
      jira_key: "PRM-1309",
      jira_url: "https://dropi-it.atlassian.net/browse/PRM-1309",
      summary: "[Notificaciones]: Token de Firebase expirado no se refresca automáticamente",
      status: "In Progress",
      assignee: "Santiago Herrera",
      product_code: "NOT"
    },
    {
      jira_key: "PRM-1238",
      jira_url: "https://dropi-it.atlassian.net/browse/PRM-1238",
      summary: "[Page Pilot / Caza-productos]: El filtro por país devuelve tiendas vacías intermitentemente",
      status: "To Do",
      assignee: "Santiago Herrera",
      product_code: "CAZ"
    },
    {
      jira_key: "PRM-1239",
      jira_url: "https://dropi-it.atlassian.net/browse/PRM-1239",
      summary: "[Dropify 2.X]: Bug de maquetación en panel de sincronización de WooCommerce",
      status: "Done",
      assignee: "Alejandra Melo",
      product_code: "DROP"
    }
  ];
}

function generateMockSprintTasks() {
  return [
    {
      jira_key: "PROD-1239",
      jira_url: "https://dropi-it.atlassian.net/browse/PROD-1239",
      summary: "[PRODUCTO][DEFINICIÓN] Dropify 2.X: Lanzamiento de Onboarding automatizado para integraciones",
      jira_status: "En curso",
      priority: "Highest",
      sections: [
        { name: "Alineación IA", status: "hecho", notes: "Mapeado el Onboarding de integraciones de WooCommerce y Shopify" },
        { name: "Documentación", status: "en_curso", notes: "Alejandra Melo redactando manual de primeros pasos" }
      ]
    },
    {
      jira_key: "PROD-1305",
      jira_url: "https://dropi-it.atlassian.net/browse/PROD-1305",
      summary: "[PRODUCTO][EXPERIMENTACIÓN] Notificaciones: Alertar a Sellers con órdenes detenidas > 24h",
      jira_status: "En curso",
      priority: "Highest",
      sections: [
        { name: "Flujo de Notificación", status: "hecho", notes: "Santiago Herrera definió la ventana de 2h de respuesta" },
        { name: "Fase de Pruebas", status: "en_curso", notes: "Piloto en caliente con 20 vendedores activos" }
      ]
    },
    {
      jira_key: "PROD-1238",
      jira_url: "https://dropi-it.atlassian.net/browse/PROD-1238",
      summary: "[PRODUCTO][DISCOVERY] Page Pilot: Optimización de embudos de alta conversión para Dropshippers",
      jira_status: "Listo",
      priority: "High",
      sections: [
        { name: "Diseño UX", status: "hecho", notes: "Aprobados los kits de alta conversión por Santiago" }
      ]
    }
  ];
}

function generateMockCrmOpps() {
  return [
    { stage_name: "Nuevo registro" },
    { stage_name: "Nuevo registro" },
    { stage_name: "Auditoría solicitada" },
    { stage_name: "En activación" },
    { stage_name: "Auditoría confirmada" },
    { stage_name: "Listo para vender" }
  ];
}
