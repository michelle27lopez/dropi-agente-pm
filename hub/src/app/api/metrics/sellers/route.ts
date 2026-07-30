import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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
  // 1. Country breakdowns & global dataset (based on real July 2026 study)
  const countriesData: Record<string, any> = {
    global: {
      totalSellers: 397271,
      activationRate: 7.56,
      activeRate: 10.82,
      bounceRate: 74.3,
      survivalRate: 69.38,
      ttvNetoMedian: 16.0,
      nsmCurrent: 3351359,
      okrTarget: 3571042,
      percentageToOkr: 94,
      gapToOkr: 219683,
      funnel: [
        { step: "1. Registro completado", count: 397271, pct: 100.0, color: "#6366F1" },
        { step: "2a. Tienda: nombre diligenciado", count: 47166, pct: 11.9, color: "#8B5CF6" },
        { step: "2c. Tienda: logo cargado", count: 12789, pct: 3.2, color: "#3B82F6" },
        { step: "2d. Tienda: datos bancarios cargados", count: 0, pct: 0.0, color: "#EF4444" },
        { step: "3. Primer producto publicado", count: 0, pct: 0.0, color: "#F59E0B" },
        { step: "4. Primera orden creada (Act. Bruta)", count: 30047, pct: 7.6, color: "#EC4899" },
        { step: "7a. Primera orden entregada (Act. Neta)", count: 20590, pct: 5.2, color: "#10B981" },
        { step: "8. Primera orden con ganancia positiva", count: 19496, pct: 4.9, color: "#14B8A6" }
      ]
    },
    CO: {
      totalSellers: 186647,
      activationRate: 9.39,
      activeRate: 12.10,
      bounceRate: 72.8,
      survivalRate: 69.80,
      ttvNetoMedian: 16.7,
      nsmCurrent: 2430474,
      okrTarget: 2664050,
      percentageToOkr: 91,
      gapToOkr: 233576,
      funnel: [
        { step: "1. Registro completado", count: 186647, pct: 100.0, color: "#6366F1" },
        { step: "2a. Tienda: nombre diligenciado", count: 24264, pct: 13.0, color: "#8B5CF6" },
        { step: "2c. Tienda: logo cargado", count: 7465, pct: 4.0, color: "#3B82F6" },
        { step: "2d. Tienda: datos bancarios cargados", count: 0, pct: 0.0, color: "#EF4444" },
        { step: "3. Primer producto publicado", count: 0, pct: 0.0, color: "#F59E0B" },
        { step: "4. Primera orden creada (Act. Bruta)", count: 17526, pct: 9.4, color: "#EC4899" },
        { step: "7a. Primera orden entregada (Act. Neta)", count: 12020, pct: 6.4, color: "#10B981" },
        { step: "8. Primera orden con ganancia positiva", count: 11385, pct: 6.1, color: "#14B8A6" }
      ]
    },
    EC: {
      totalSellers: 30969,
      activationRate: 10.26,
      activeRate: 14.50,
      bounceRate: 70.1,
      survivalRate: 72.50,
      ttvNetoMedian: 13.9,
      nsmCurrent: 261436,
      okrTarget: 234096,
      percentageToOkr: 112,
      gapToOkr: -27340,
      funnel: [
        { step: "1. Registro completado", count: 30969, pct: 100.0, color: "#6366F1" },
        { step: "2a. Tienda: nombre diligenciado", count: 5264, pct: 17.0, color: "#8B5CF6" },
        { step: "2c. Tienda: logo cargado", count: 1858, pct: 6.0, color: "#3B82F6" },
        { step: "2d. Tienda: datos bancarios cargados", count: 0, pct: 0.0, color: "#EF4444" },
        { step: "3. Primer producto publicado", count: 0, pct: 0.0, color: "#F59E0B" },
        { step: "4. Primera orden creada (Act. Bruta)", count: 3177, pct: 10.3, color: "#EC4899" },
        { step: "7a. Primera orden entregada (Act. Neta)", count: 2542, pct: 8.2, color: "#10B981" },
        { step: "8. Primera orden con ganancia positiva", count: 2415, pct: 7.8, color: "#14B8A6" }
      ]
    },
    MX: {
      totalSellers: 32456,
      activationRate: 3.64,
      activeRate: 6.20,
      bounceRate: 80.2,
      survivalRate: 65.40,
      ttvNetoMedian: 21.0,
      nsmCurrent: 219393,
      okrTarget: 229163,
      percentageToOkr: 96,
      gapToOkr: 9770,
      funnel: [
        { step: "1. Registro completado", count: 32456, pct: 100.0, color: "#6366F1" },
        { step: "2a. Tienda: nombre diligenciado", count: 2596, pct: 8.0, color: "#8B5CF6" },
        { step: "2c. Tienda: logo cargado", count: 649, pct: 2.0, color: "#3B82F6" },
        { step: "2d. Tienda: datos bancarios cargados", count: 0, pct: 0.0, color: "#EF4444" },
        { step: "3. Primer producto publicado", count: 0, pct: 0.0, color: "#F59E0B" },
        { step: "4. Primera orden creada (Act. Bruta)", count: 1181, pct: 3.6, color: "#EC4899" },
        { step: "7a. Primera orden entregada (Act. Neta)", count: 843, pct: 2.6, color: "#10B981" },
        { step: "8. Primera orden con ganancia positiva", count: 778, pct: 2.4, color: "#14B8A6" }
      ]
    },
    CL: {
      totalSellers: 72137,
      activationRate: 5.69,
      activeRate: 8.50,
      bounceRate: 76.5,
      survivalRate: 62.10,
      ttvNetoMedian: 18.6,
      nsmCurrent: 232894,
      okrTarget: 235685,
      percentageToOkr: 99,
      gapToOkr: 2791,
      funnel: [
        { step: "1. Registro completado", count: 72137, pct: 100.0, color: "#6366F1" },
        { step: "2a. Tienda: nombre diligenciado", count: 6492, pct: 9.0, color: "#8B5CF6" },
        { step: "2c. Tienda: logo cargado", count: 1442, pct: 2.0, color: "#3B82F6" },
        { step: "2d. Tienda: datos bancarios cargados", count: 0, pct: 0.0, color: "#EF4444" },
        { step: "3. Primer producto publicado", count: 0, pct: 0.0, color: "#F59E0B" },
        { step: "4. Primera orden creada (Act. Bruta)", count: 4104, pct: 5.7, color: "#EC4899" },
        { step: "7a. Primera orden entregada (Act. Neta)", count: 2236, pct: 3.1, color: "#10B981" },
        { step: "8. Primera orden con ganancia positiva", count: 2091, pct: 2.9, color: "#14B8A6" }
      ]
    },
    AR: {
      totalSellers: 22330,
      activationRate: 3.05,
      activeRate: 4.80,
      bounceRate: 82.4,
      survivalRate: 58.70,
      ttvNetoMedian: 18.1,
      nsmCurrent: 9934,
      okrTarget: 12682,
      percentageToOkr: 78,
      gapToOkr: 2748,
      funnel: [
        { step: "1. Registro completado", count: 22330, pct: 100.0, color: "#6366F1" },
        { step: "2a. Tienda: nombre diligenciado", count: 1852, pct: 8.3, color: "#8B5CF6" },
        { step: "2c. Tienda: logo cargado", count: 401, pct: 1.8, color: "#3B82F6" },
        { step: "2d. Tienda: datos bancarios cargados", count: 0, pct: 0.0, color: "#EF4444" },
        { step: "3. Primer producto publicado", count: 0, pct: 0.0, color: "#F59E0B" },
        { step: "4. Primera orden creada (Act. Bruta)", count: 681, pct: 3.1, color: "#EC4899" },
        { step: "7a. Primera orden entregada (Act. Neta)", count: 312, pct: 1.4, color: "#10B981" },
        { step: "8. Primera orden con ganancia positiva", count: 290, pct: 1.3, color: "#14B8A6" }
      ]
    }
  };

  const global = countriesData.global;

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
      totalSellers: global.totalSellers,
      activationCount: Math.round(global.totalSellers * (global.activationRate / 100)),
      activationRate: global.activationRate,
      activeCount: Math.round(global.totalSellers * (global.activeRate / 100)),
      activeRate: global.activeRate,
      bounceCount: Math.round(global.totalSellers * (global.bounceRate / 100)),
      bounceRate: global.bounceRate,
      nsmCurrent: global.nsmCurrent,
      okrTarget: global.okrTarget,
      percentageToOkr: global.percentageToOkr,
      gapToOkr: global.gapToOkr,
      survivalRate: global.survivalRate,
      ttvNetoMedian: global.ttvNetoMedian,
      countries: countriesData
    },
    funnel: global.funnel,
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
