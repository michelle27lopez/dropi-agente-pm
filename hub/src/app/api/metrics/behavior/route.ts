import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "ALL";

  try {
    if (supabase) {
      let allData: any[] = [];
      let from = 0;
      const limit = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from("userpilot_suppliers")
          .select("*")
          .range(from, from + limit - 1);

        if (country !== "ALL") {
          if (country === "CO") query = query.ilike("country", "Colombia");
          else if (country === "MX") query = query.or("country.ilike.Mexico,country.ilike.México");
          else if (country === "EC") query = query.ilike("country", "Ecuador");
        }

        const { data, error } = await query;
        if (error) {
          console.warn("Supabase query error for behavior paginated, using mock fallback:", error.message);
          hasMore = false;
          break;
        }

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          if (data.length < limit) {
            hasMore = false;
          } else {
            from += limit;
          }
        } else {
          hasMore = false;
        }
      }

      if (allData.length > 0) {
        return NextResponse.json(analyzeSuppliers(allData, country, "supabase"));
      }
    }

    // Fallback: Generar simulación realista de 90 días
    return NextResponse.json(generateMockBehaviorData(country));
  } catch (err: any) {
    console.error("Excepción en API de comportamiento:", err);
    return NextResponse.json(generateMockBehaviorData(country));
  }
}

// Helper para agrupar fechas por la semana del lunes
function getMondayStr(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para Lunes
  const monday = new Date(d.setDate(diff));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

// Analizar la data cargada de la DB
function analyzeSuppliers(data: any[], country: string, source: "supabase" | "mock") {
  const totalSuppliers = data.length;
  let totalSessions = 0;
  let verifiedCount = 0;
  let activatedCount = 0; // Tasa de activación: > 7 sesiones

  // Cohortes de sesión
  let session1 = 0;
  let session2_3 = 0;
  let session4_10 = 0;
  let session11_plus = 0;

  // Dispositivos y SO
  const devicesMap: Record<string, number> = {};
  const osMap: Record<string, number> = {};
  const countryMap: Record<string, number> = {};

  // Inactividad y Abandono
  // Snapshot baseline date
  const referenceDate = new Date("2026-05-25T10:30:00-05:00");

  let active = 0;       // 0-3 días inactivo
  let slightRisk = 0;   // 4-7 días inactivo
  let churnRisk = 0;    // 8-14 días inactivo (Regla: posibilidad de churn > 10d)
  let highRisk = 0;     // 15-30 días inactivo
  let confirmedChurn = 0; // 30+ días inactivo

  // Acumuladores para promedios de inactividad
  const tierSessions: Record<string, number[]> = { active: [], slightRisk: [], churnRisk: [], highRisk: [], confirmedChurn: [] };
  const tierLifespans: Record<string, number[]> = { active: [], slightRisk: [], churnRisk: [], highRisk: [], confirmedChurn: [] };

  // Cohortes de activación (Early Churn)
  let bounceCount = 0;
  let lowActivationCount = 0;
  let lateChurnCount = 0;
  let loyalActiveCount = 0;
  let otherBehaviorCount = 0;

  const riskList: any[] = [];

  // Acumuladores de encuesta
  let totalWithSurvey = 0;
  let roleSupplier = 0;
  let roleBrand = 0;
  let roleNone = 0;

  let volOver1000 = 0;
  let vol301to1000 = 0;
  let vol51to300 = 0;
  let volUnder50 = 0;
  let volNotSelling = 0;
  let volNotManaging = 0;
  let volUnspecified = 0;

  let srcComunidades = 0;
  let srcHuerfanos = 0;
  let srcNone = 0;

  let supplierComunidad = 0;
  let supplierHuerfano = 0;
  let brandComunidad = 0;
  let brandHuerfano = 0;

  data.forEach((row) => {
    const { signed_up, last_seen, web_sessions, country: cName, device_type, os, verified } = row;
    const sessions = web_sessions || 0;
    
    totalSessions += sessions;
    if (verified) verifiedCount++;

    // Tasa de activación: > 7 sesiones web
    if (sessions > 7) {
      activatedCount++;
    }

    // 1. Cohortes de sesión
    if (sessions <= 1) session1++;
    else if (sessions <= 3) session2_3++;
    else if (sessions <= 10) session4_10++;
    else session11_plus++;

    // 2. Dispositivos
    const dType = device_type || "Desconocido";
    devicesMap[dType] = (devicesMap[dType] || 0) + 1;

    // 3. Sistemas operativos
    const osName = os || "Otros";
    osMap[osName] = (osMap[osName] || 0) + 1;

    // 4. Países
    const normalizedCountry = cName || "Otros";
    countryMap[normalizedCountry] = (countryMap[normalizedCountry] || 0) + 1;

    // 5. Encuestas
    const sRole = row.survey_role;
    const sVolume = row.survey_volume || row.survey_brand_sales;
    const sSource = row.survey_source;

    if (sRole || sVolume || sSource) {
      totalWithSurvey++;

      if (sRole) {
        if (sRole.toLowerCase().includes("proveedor")) roleSupplier++;
        else if (sRole.toLowerCase().includes("marca")) roleBrand++;
        else roleNone++;
      } else {
        roleNone++;
      }

      if (sVolume) {
        if (sVolume.includes("Más de 1.000")) volOver1000++;
        else if (sVolume.includes("301 a 1.000")) vol301to1000++;
        else if (sVolume.includes("51 a 300")) vol51to300++;
        else if (sVolume.includes("Menos de 50")) volUnder50++;
        else if (sVolume.includes("Aún no vendo")) volNotSelling++;
        else if (sVolume.includes("Aún no gestiono")) volNotManaging++;
        else volUnspecified++;
      } else {
        volUnspecified++;
      }

      if (sSource === "comunidades") srcComunidades++;
      else if (sSource === "huerfanos") srcHuerfanos++;
      else srcNone++;

      const isSup = sRole && sRole.toLowerCase().includes("proveedor");
      const isBrd = sRole && sRole.toLowerCase().includes("marca");
      if (isSup && sSource === "comunidades") supplierComunidad++;
      else if (isSup && sSource === "huerfanos") supplierHuerfano++;
      else if (isBrd && sSource === "comunidades") brandComunidad++;
      else if (isBrd && sSource === "huerfanos") brandHuerfano++;
    }

    // 6. Inactividad, Churn & Lifespan
    const signUpDate = signed_up ? new Date(signed_up) : null;
    const lastSeenDate = last_seen ? new Date(last_seen) : null;

    if (signUpDate && lastSeenDate) {
      const daysSinceSignup = Math.floor((referenceDate.getTime() - signUpDate.getTime()) / 86400000);
      const daysSinceLastSeen = Math.floor((referenceDate.getTime() - lastSeenDate.getTime()) / 86400000);
      const lifespanDays = Math.floor((lastSeenDate.getTime() - signUpDate.getTime()) / 86400000);

      // Clasificación de inactividad
      let tierKey = "";
      if (daysSinceLastSeen <= 3) {
        active++;
        tierKey = "active";
      } else if (daysSinceLastSeen <= 7) {
        slightRisk++;
        tierKey = "slightRisk";
      } else if (daysSinceLastSeen <= 14) {
        churnRisk++;
        tierKey = "churnRisk";
      } else if (daysSinceLastSeen <= 30) {
        highRisk++;
        tierKey = "highRisk";
      } else {
        confirmedChurn++;
        tierKey = "confirmedChurn";
      }

      tierSessions[tierKey].push(sessions);
      tierLifespans[tierKey].push(lifespanDays);

      // Clasificación de activación temprana
      if (sessions === 1 && lifespanDays < 1) {
        bounceCount++;
      } else if (sessions >= 2 && sessions <= 3 && daysSinceLastSeen > 10) {
        lowActivationCount++;
      } else if (sessions >= 4 && daysSinceLastSeen > 10) {
        lateChurnCount++;
      } else if (sessions >= 4 && daysSinceLastSeen <= 7) {
        loyalActiveCount++;
      } else {
        otherBehaviorCount++;
      }

      // Registro para el Directorio de Recuperación (si tiene más de 7 días inactivo)
      if (daysSinceLastSeen > 7) {
        let status: "churned" | "dormant" | "critical" = "dormant";
        if (daysSinceLastSeen > 30) status = "churned";
        else if (daysSinceLastSeen > 14) status = "critical";

        // Determinar prioridad comercial en base a las respuestas de la encuesta
        const sRole = row.survey_role || "";
        const sVolume = row.survey_volume || "";
        const sBrand = row.survey_brand_sales || "";

        let priority: "high" | "medium" | "low" = "low";
        const isSupplier = sRole.toLowerCase().includes("proveedor");
        // Prioridad alta si mueven más de 50 pedidos/ventas al mes
        const isBigVolume = sVolume.includes("1.000") || sVolume.includes("301 a 1.000") || sVolume.includes("51 a 300") ||
                            sBrand.includes("1.000") || sBrand.includes("301 a 1.000") || sBrand.includes("51 a 300");

        if (isSupplier && isBigVolume) {
          priority = "high";
        } else if (isSupplier || isBigVolume || sRole !== "") {
          priority = "medium";
        }

        riskList.push({
          name: row.name || "Proveedor Anónimo",
          email: row.email || "-",
          phone: row.phone || "-",
          country: cName || "Desconocido",
          web_sessions: sessions,
          days_inactive: daysSinceLastSeen,
          signed_up: row.signed_up,
          status,
          priority,
          // Campos de la encuesta
          survey_role: row.survey_role || null,
          survey_stage: row.survey_stage || null,
          survey_volume: row.survey_volume || null,
          survey_purpose: row.survey_purpose || null,
          survey_brand_sales: row.survey_brand_sales || null,
          survey_shipping_pref: row.survey_shipping_pref || null,
          survey_sell_pref: row.survey_sell_pref || null,
          survey_source: row.survey_source || null,
        });
      }
    }
  });

  // Ordenar lista de riesgo (Alta prioridad comercial primero, luego días de inactividad)
  riskList.sort((a, b) => {
    const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const pA = priorityMap[a.priority] || 1;
    const pB = priorityMap[b.priority] || 1;
    if (pA !== pB) return pB - pA;
    return b.days_inactive - a.days_inactive;
  });

  // Helper para promedio
  const avg = (arr: number[]) => arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;

  // Formatear tabla de niveles de inactividad
  const churnTiers = [
    {
      key: "active",
      name: "Activos Recientes",
      range: "0-3 días inactivo",
      count: active,
      percentage: totalSuppliers > 0 ? Math.round((active / totalSuppliers) * 100) : 0,
      avgSessions: avg(tierSessions.active),
      avgLifespan: avg(tierLifespans.active),
      action: "Mantener engagement con novedades.",
      color: "#10B981",
    },
    {
      key: "slightRisk",
      name: "Riesgo Leve (Dormantes)",
      range: "4-7 días inactivo",
      count: slightRisk,
      percentage: totalSuppliers > 0 ? Math.round((slightRisk / totalSuppliers) * 100) : 0,
      avgSessions: avg(tierSessions.slightRisk),
      avgLifespan: avg(tierLifespans.slightRisk),
      action: "Notificación push o correo preventivo.",
      color: "#3B82F6",
    },
    {
      key: "churnRisk",
      name: "Riesgo de Churn (Inactivo >7d)",
      range: "8-14 días inactivo",
      count: churnRisk,
      percentage: totalSuppliers > 0 ? Math.round((churnRisk / totalSuppliers) * 100) : 0,
      avgSessions: avg(tierSessions.churnRisk),
      avgLifespan: avg(tierLifespans.churnRisk),
      action: "Contacto prioritario personalizado.",
      color: "#F59E0B",
    },
    {
      key: "highRisk",
      name: "Riesgo Crítico",
      range: "15-30 días inactivo",
      count: highRisk,
      percentage: totalSuppliers > 0 ? Math.round((highRisk / totalSuppliers) * 100) : 0,
      avgSessions: avg(tierSessions.highRisk),
      avgLifespan: avg(tierLifespans.highRisk),
      action: "Llamada directa / Soporte uno-a-uno.",
      color: "#EF4444",
    },
    {
      key: "confirmedChurn",
      name: "Abandono Confirmado",
      range: "30+ días inactivo",
      count: confirmedChurn,
      percentage: totalSuppliers > 0 ? Math.round((confirmedChurn / totalSuppliers) * 100) : 0,
      avgSessions: avg(tierSessions.confirmedChurn),
      avgLifespan: avg(tierLifespans.confirmedChurn),
      action: "Campaña de re-activación comercial.",
      color: "#7F1D1D",
    },
  ];

  // Agrupación de cohortes de activación
  const activationCohorts = [
    {
      key: "bounce",
      name: "Rebote (Bounce)",
      description: "Crearon cuenta, tuvieron 1 sesión y no regresaron",
      count: bounceCount,
      percentage: totalSuppliers > 0 ? Math.round((bounceCount / totalSuppliers) * 100) : 0,
      color: "#EF4444",
    },
    {
      key: "low_activation",
      name: "Baja Activación (Early Churn)",
      description: "Tuvieron 2-3 sesiones pero están inactivos hace >10 días",
      count: lowActivationCount,
      percentage: totalSuppliers > 0 ? Math.round((lowActivationCount / totalSuppliers) * 100) : 0,
      color: "#F59E0B",
    },
    {
      key: "late_churn",
      name: "Abandono de Activados",
      description: "Lograron >3 sesiones, pero están inactivos hace >10 días",
      count: lateChurnCount,
      percentage: totalSuppliers > 0 ? Math.round((lateChurnCount / totalSuppliers) * 100) : 0,
      color: "#EC4899",
    },
    {
      key: "loyal_active",
      name: "Frecuentes Activos",
      description: "Tienen >=4 sesiones y se conectaron en la última semana",
      count: loyalActiveCount,
      percentage: totalSuppliers > 0 ? Math.round((loyalActiveCount / totalSuppliers) * 100) : 0,
      color: "#10B981",
    },
    {
      key: "others",
      name: "Otros Comportamientos",
      description: "Otros estados intermedios de conexión",
      count: otherBehaviorCount,
      percentage: totalSuppliers > 0 ? Math.round((otherBehaviorCount / totalSuppliers) * 100) : 0,
      color: "#6B7280",
    },
  ];

  // Calcular matriz de cohortes semanales
  const weeklyCohortsMap: Record<string, any[]> = {};
  data.forEach((row) => {
    if (row.signed_up) {
      const week = getMondayStr(row.signed_up);
      if (!weeklyCohortsMap[week]) weeklyCohortsMap[week] = [];
      weeklyCohortsMap[week].push(row);
    }
  });

  const weeklyCohorts: any[] = [];
  const cohortWeeks = Object.keys(weeklyCohortsMap).sort();
  
  cohortWeeks.forEach((weekStart) => {
    const cohortUsers = weeklyCohortsMap[weekStart];
    const size = cohortUsers.length;
    
    const retention: (number | null)[] = [];
    for (let w = 0; w <= 12; w++) {
      const daysRequired = w * 7;
      let eligible = 0;
      let retained = 0;
      
      cohortUsers.forEach((u) => {
        const su = new Date(u.signed_up);
        const ls = new Date(u.last_seen);
        const ageInDays = Math.floor((referenceDate.getTime() - su.getTime()) / 86400000);
        const lifespanDays = Math.floor((ls.getTime() - su.getTime()) / 86400000);
        
        if (ageInDays >= daysRequired) {
          eligible++;
          if (lifespanDays >= daysRequired) {
            retained++;
          }
        }
      });
      
      retention.push(eligible > 0 ? Math.round((retained / eligible) * 100) : null);
    }
    
    weeklyCohorts.push({
      weekStart,
      size,
      retention,
    });
  });

  // Calcular promedios por antigüedad de registro
  const ageCohortsMap = {
    new: { name: "Nuevos (0-7d)", min: 0, max: 7, count: 0, totalSessions: 0, activeCount: 0 },
    recent: { name: "Recientes (8-30d)", min: 8, max: 30, count: 0, totalSessions: 0, activeCount: 0 },
    mature: { name: "Maduros (31-60d)", min: 31, max: 60, count: 0, totalSessions: 0, activeCount: 0 },
    established: { name: "Establecidos (61-90d)", min: 61, max: 90, count: 0, totalSessions: 0, activeCount: 0 },
  };

  data.forEach((row) => {
    if (!row.signed_up || !row.last_seen) return;
    const su = new Date(row.signed_up);
    const ls = new Date(row.last_seen);
    const daysSinceSignup = Math.floor((referenceDate.getTime() - su.getTime()) / 86400000);
    const daysSinceLastSeen = Math.floor((referenceDate.getTime() - ls.getTime()) / 86400000);
    const sessions = row.web_sessions || 0;

    let cohortKey: keyof typeof ageCohortsMap | null = null;
    if (daysSinceSignup <= 7) cohortKey = "new";
    else if (daysSinceSignup <= 30) cohortKey = "recent";
    else if (daysSinceSignup <= 60) cohortKey = "mature";
    else if (daysSinceSignup <= 90) cohortKey = "established";

    if (cohortKey) {
      const c = ageCohortsMap[cohortKey];
      c.count++;
      c.totalSessions += sessions;
      if (daysSinceLastSeen <= 7) {
        c.activeCount++;
      }
    }
  });

  const ageCohorts = Object.values(ageCohortsMap).map((c) => ({
    name: c.name,
    count: c.count,
    avgSessions: c.count > 0 ? Math.round((c.totalSessions / c.count) * 10) / 10 : 0,
    activeRate: c.count > 0 ? Math.round((c.activeCount / c.count) * 100) : 0,
  }));

  return {
    source,
    country,
    stats: {
      totalSuppliers,
      avgSessions: totalSuppliers > 0 ? Math.round((totalSessions / totalSuppliers) * 10) / 10 : 0,
      activeRate: totalSuppliers > 0 ? Math.round((activatedCount / totalSuppliers) * 100) : 0, // > 7 sesiones
      verifiedRate: totalSuppliers > 0 ? Math.round((verifiedCount / totalSuppliers) * 100) : 0,
      dormantCount: slightRisk + churnRisk,
      churnedCount: highRisk + confirmedChurn,
      churnRate: totalSuppliers > 0 ? Math.round(((highRisk + confirmedChurn) / totalSuppliers) * 100) : 0,
    },
    cohorts: [
      { name: "1 sesión", value: session1, color: "#EF4444" },
      { name: "2–3 sesiones", value: session2_3, color: "#F59E0B" },
      { name: "4–10 sesiones", value: session4_10, color: "#3B82F6" },
      { name: "11+ sesiones", value: session11_plus, color: "#10B981" },
    ],
    devices: Object.keys(devicesMap).map((k) => ({ name: k, value: devicesMap[k] })),
    operatingSystems: Object.keys(osMap).map((k) => ({ name: k, value: osMap[k] })),
    countries: Object.keys(countryMap).map((k) => ({ name: k, value: countryMap[k] })),
    churnTiers,
    activationCohorts,
    weeklyCohorts,
    ageCohorts,
    riskSuppliers: riskList.slice(0, 200),
    surveyStats: {
      totalWithSurvey,
      roles: [
        { name: "Proveedores Potenciales", value: roleSupplier, color: "#6366F1" },
        { name: "Marcas / Emprendedores", value: roleBrand, color: "#10B981" },
        { name: "No especificado / Otros", value: roleNone, color: "#94A3B8" }
      ],
      volumes: [
        { name: "Más de 1.000 al mes", value: volOver1000 },
        { name: "301 a 1.000 al mes", value: vol301to1000 },
        { name: "51 a 300 al mes", value: vol51to300 },
        { name: "Menos de 50 al mes", value: volUnder50 },
        { name: "Aún no vendo (Marcas)", value: volNotSelling },
        { name: "Aún no gestiono pedidos", value: volNotManaging },
        { name: "Sin datos (No completó)", value: volUnspecified }
      ],
      sources: [
        { name: "Comunidades", value: srcComunidades, color: "#8B5CF6" },
        { name: "Huérfanos", value: srcHuerfanos, color: "#F59E0B" },
        { name: "Orgánicos sin encuesta", value: srcNone, color: "#94A3B8" }
      ],
      crossSegments: {
        supplierComunidad,
        supplierHuerfano,
        brandComunidad,
        brandHuerfano
      }
    }
  };
}

// Simulación de datos de comportamiento en caso de no tener DB
function generateMockBehaviorData(country: string) {
  let baseCount = 500;
  if (country === "CO") baseCount = 350;
  else if (country === "MX") baseCount = 100;
  else if (country === "EC") baseCount = 50;

  const data: any[] = [];
  const referenceDate = new Date("2026-05-25T10:30:00-05:00");

  const devicesList = ["Desktop", "Mobile", "Tablet"];
  const osList = ["Windows", "iOS", "Android", "Mac", "Linux"];
  const countryList = country === "ALL" ? ["Colombia", "Mexico", "Ecuador"] : [country === "CO" ? "Colombia" : country === "MX" ? "Mexico" : "Ecuador"];

  for (let i = 0; i < baseCount; i++) {
    // Signup hace entre 0 y 90 días
    const signedUpDaysAgo = Math.floor(Math.random() * 90);
    const signedUp = new Date(referenceDate.getTime());
    signedUp.setDate(referenceDate.getDate() - signedUpDaysAgo);

    // Distribución del total de sesiones
    const rand = Math.random();
    let web_sessions = 1;
    if (rand > 0.3) web_sessions = Math.floor(Math.random() * 3) + 2; // 2-4
    if (rand > 0.6) web_sessions = Math.floor(Math.random() * 6) + 5; // 5-10
    if (rand > 0.85) web_sessions = Math.floor(Math.random() * 25) + 11; // 11+

    // Determinar última conexión
    const lastSeen = new Date(signedUp.getTime());
    if (web_sessions > 1) {
      let maxActiveDays = signedUpDaysAgo;
      if (web_sessions < 4 && Math.random() > 0.7) {
        maxActiveDays = Math.min(signedUpDaysAgo, Math.floor(Math.random() * 5));
      }
      const activeDays = Math.floor(Math.random() * (maxActiveDays + 1));
      lastSeen.setDate(signedUp.getDate() + activeDays);
    }

    const device = devicesList[Math.floor(Math.random() * devicesList.length)];
    const os = osList[Math.floor(Math.random() * osList.length)];
    const countryName = countryList[Math.floor(Math.random() * countryList.length)];

    // Generar encuestas mockeadas realistas para un subconjunto
    const mockRand = Math.random();
    let survey_role = null;
    let survey_volume = null;
    let survey_brand_sales = null;
    let survey_source = null;
    let survey_purpose = null;

    if (mockRand > 0.3) {
      survey_source = Math.random() > 0.5 ? "comunidades" : "huerfanos";
      if (Math.random() > 0.4) {
        survey_role = "Proveedor: Publico mis productos en el catálogo para que los dropshippers los vendan, y yo me encargo del despacho.";
        survey_volume = ["Menos de 50 al mes", "51 a 300 al mes", "301 a 1.000 al mes", "Más de 1.000 al mes"][Math.floor(Math.random() * 4)];
        survey_purpose = Math.random() > 0.5 ? "Quiero vender a través de dropshippers y por mis canales" : "Solo vender a través de dropshippers";
      } else {
        survey_role = "Marca / Emprendedor: Vendo mis propios productos y uso Dropi para gestionar el envío a mis clientes finales.";
        survey_brand_sales = ["Menos de 50 al mes", "51 a 300 al mes", "301 a 1.000 al mes", "Más de 1.000 al mes", "Aún no vendo"][Math.floor(Math.random() * 5)];
      }
    }

    data.push({
      user_id: `user_${i}`,
      name: `Bodega ${["Alfa", "Imperial", "Distribuciones", "Importaciones", "Sur", "Pacífico", "Ecom", "Global", "Express"][Math.floor(Math.random() * 9)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      email: `bodega_${i}@dropi.com`,
      phone: `300${Math.floor(Math.random() * 8999999) + 1000000}`,
      signed_up: signedUp.toISOString(),
      last_seen: lastSeen.toISOString(),
      web_sessions,
      country: countryName,
      device_type: device,
      os,
      verified: Math.random() > 0.7,
      // Encuestas mock
      survey_role,
      survey_volume,
      survey_brand_sales,
      survey_source,
      survey_purpose,
    });
  }

  return analyzeSuppliers(data, country, "mock");
}
