import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCRMAppointments } from "@/lib/crm-db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "ALL";
  const community = searchParams.get("community") || null;

  try {
    const appointments = await getCRMAppointments();

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
        if (community) {
          return NextResponse.json(analyzeCommunityDetails(allData, country, community, appointments));
        }
        return NextResponse.json(analyzeSuppliers(allData, country, "supabase", appointments));
      }
    }

    // Fallback: Generar simulación realista
    const mockData = generateMockSuppliersList(country);
    if (community) {
      return NextResponse.json(analyzeCommunityDetails(mockData, country, community, {}));
    }
    return NextResponse.json(analyzeSuppliers(mockData, country, "mock", {}));
  } catch (err: any) {
    console.error("Excepción en API de comportamiento:", err);
    const mockData = generateMockSuppliersList(country);
    if (community) {
      return NextResponse.json(analyzeCommunityDetails(mockData, country, community, {}));
    }
    return NextResponse.json(analyzeSuppliers(mockData, country, "mock", {}));
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
function analyzeSuppliers(
  data: any[],
  country: string,
  source: "supabase" | "mock",
  appointments: Record<string, any> = {}
) {
  const totalSuppliers = data.length;

  const supplierMap = new Map<string, any>();
  data.forEach((row) => {
    if (row.user_id) {
      supplierMap.set(String(row.user_id).trim(), row);
    }
  });

  const resolveCommunity = (row: any): string => {
    if (row.belong_to_community && row.belong_to_community.trim() !== "" && row.belong_to_community.trim() !== "-") {
      return row.belong_to_community.trim();
    }
    if (row.owner_of_community && row.owner_of_community.trim() !== "" && row.owner_of_community.trim() !== "-") {
      return row.owner_of_community.trim();
    }
    if (row.referred_by && row.referred_by.trim() !== "" && row.referred_by.trim() !== "-") {
      const referrerId = String(row.referred_by).trim();
      const referrer = supplierMap.get(referrerId);
      if (referrer) {
        if (referrer.owner_of_community && referrer.owner_of_community.trim() !== "" && referrer.owner_of_community.trim() !== "-") {
          return referrer.owner_of_community.trim();
        }
        if (referrer.belong_to_community && referrer.belong_to_community.trim() !== "" && referrer.belong_to_community.trim() !== "-") {
          return referrer.belong_to_community.trim();
        }
        if (referrer.name && referrer.name.trim() !== "") {
          return `Referido por ${referrer.name.trim()}`;
        }
      }
    }
    return "Orgánico / Sin comunidad";
  };

  const communityStats: Record<string, any> = {};
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
  const referenceDate = new Date("2026-05-25T10:30:00-05:00");

  let active = 0;       // 0-3 días inactivo
  let slightRisk = 0;   // 4-7 días inactivo
  let churnRisk = 0;    // 8-14 días inactivo
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

  // Churn de activación
  let churnActivacionA = 0; // Sin ninguna orden
  let churnActivacionB = 0; // 1–5 órdenes y ya no activo (es_activo_30d = false)

  // NUEVOS ACUMULADORES PARA ANÁLISIS DE VALIDACIÓN Y DESEMPEÑO
  let noTypeCount = 0;
  let noTypeWithOrderCount = 0; // Proveedores validados (sin tipo + al menos 1 orden)
  const noTypeSurveyRoles: Record<string, number> = {};
  const validatedList: any[] = [];

  // Correlación para proveedores sin tipo
  let withMeetingWithProducts = 0;
  let withMeetingNoProducts = 0;
  let noMeetingWithProducts = 0;
  let noMeetingNoProducts = 0;

  // Desempeño por nivel de proveedor
  const tierStatsMap: Record<string, { count: number; orders: number; products: number; activeCount: number }> = {
    "VERIFICADO": { count: 0, orders: 0, products: 0, activeCount: 0 },
    "PREMIUM": { count: 0, orders: 0, products: 0, activeCount: 0 },
    "PREMIUM EXCLUSIVO": { count: 0, orders: 0, products: 0, activeCount: 0 },
    "Sin Tipo": { count: 0, orders: 0, products: 0, activeCount: 0 },
  };

  data.forEach((row) => {
    const { signed_up, last_seen, web_sessions, country: cName, device_type, os, verified } = row;
    const sessions = web_sessions || 0;
    const signUpDate = signed_up ? new Date(signed_up) : null;
    const lastSeenDate = last_seen ? new Date(last_seen) : null;

    const community = resolveCommunity(row);

    // Cruce de citas CRM
    const emailKey = row.email ? String(row.email).trim().toLowerCase() : "";
    const phoneKey = row.phone ? String(row.phone).trim() : "";
    let has_appointment = !!row.has_appointment;
    let ultima_cita_confirmada = row.ultima_cita_confirmada || null;

    if (source === "supabase") {
      const appt = (emailKey && appointments[emailKey]) || (phoneKey && appointments[phoneKey]) || null;
      if (appt) {
        has_appointment = true;
        ultima_cita_confirmada = appt.ultima_cita_confirmada;
      }
    }

    const ordersDelivered = row.real_orders_delivered || 0;
    const productsCreated = row.real_products_created || 0;
    const isActive30d = !!row.es_activo_30d;

    // Churn de activación
    if (ordersDelivered === 0) {
      churnActivacionA++;
    } else if (ordersDelivered >= 1 && ordersDelivered <= 5 && !isActive30d) {
      churnActivacionB++;
    }
    const rawTipo = row.tipo_proveedor ? String(row.tipo_proveedor).trim().toUpperCase() : "";

    // Agrupar por nivel para estadísticas de desempeño
    const currentTier = (rawTipo === "VERIFICADO" || rawTipo === "PREMIUM" || rawTipo === "PREMIUM EXCLUSIVO") ? rawTipo : "Sin Tipo";

    // Calcular días inactivos y estado para el directorio de validación
    let days_inactive = 99;
    let status = "churned";
    if (lastSeenDate) {
      days_inactive = Math.max(0, Math.floor((referenceDate.getTime() - lastSeenDate.getTime()) / 86400000));
      if (days_inactive <= 7) status = "active";
      else if (days_inactive <= 14) status = "dormant";
      else if (days_inactive <= 30) status = "critical";
      else status = "churned";
    }

    // Calcular antigüedad del registro en días
    let daysSinceSignup = 999;
    if (signUpDate) {
      daysSinceSignup = Math.floor((referenceDate.getTime() - signUpDate.getTime()) / 86400000);
    }

    // Solo incluir en el análisis de validación y rendimiento si se registró hace <= 90 días
    if (daysSinceSignup <= 90) {
      const tStats = tierStatsMap[currentTier];
      tStats.count++;
      tStats.orders += ordersDelivered;
      tStats.products += productsCreated;
      if (isActive30d) tStats.activeCount++;

      // Lógica para proveedores "Sin Tipo" (Potenciales / Registros nuevos sin validar por Dropi)
      if (currentTier === "Sin Tipo") {
        noTypeCount++;
        
        // Definición de validación: tiene al menos 1 orden y no tiene tipo
        if (ordersDelivered >= 1) {
          noTypeWithOrderCount++;
          const sRole = row.survey_role || "No especificado";
          noTypeSurveyRoles[sRole] = (noTypeSurveyRoles[sRole] || 0) + 1;
        }

        // Correlación de Citas y Carga de Productos
        if (has_appointment) {
          if (productsCreated >= 1) withMeetingWithProducts++;
          else withMeetingNoProducts++;
        } else {
          if (productsCreated >= 1) noMeetingWithProducts++;
          else noMeetingNoProducts++;
        }
      }

      // Guardar en la lista para el directorio de control de validación (cohorte 90 días)
      validatedList.push({
        user_id: row.user_id,
        name: row.name || "Proveedor Anónimo",
        email: row.email || "-",
        phone: row.phone || "-",
        country: row.country || "Desconocido",
        real_orders_delivered: ordersDelivered,
        real_products_created: productsCreated,
        survey_role: row.survey_role || "No especificado",
        survey_volume: row.survey_volume || row.survey_brand_sales || "No especificado",
        survey_source: row.survey_source || "No especificado",
        resolved_community: community,
        has_appointment,
        ultima_cita_confirmada,
        tipo_proveedor: currentTier,
        days_inactive,
        status,
        signed_up: row.signed_up,
        web_sessions: sessions
      });
    }

    if (!communityStats[community]) {
      communityStats[community] = { 
        name: community, 
        count: 0, 
        active: 0, 
        verified: 0, 
        totalSessions: 0,
        billing: 0,
        suppliers: 0,
        surveyed: 0,
        highVolume: 0,
        bounces: 0,
        totalInactiveDays: 0,
        hasInactiveDaysCount: 0,
        totalLifespanDays: 0,
        hasLifespanCount: 0,
        totalTtvDays: 0,
        hasTtvCount: 0,
        realActiveCount: 0,
        totalRealOrders: 0,
        totalRealProducts: 0,
        hasProductCount: 0,
        hasOrderCount: 0
      };
    }
    const cStats = communityStats[community];
    cStats.count++;
    cStats.totalSessions += sessions;
    if (sessions > 7) {
      cStats.active++;
    }
    if (verified) {
      cStats.verified++;
    }
    if (row.billing_information) {
      cStats.billing++;
    }
    if (sessions === 1) {
      cStats.bounces++;
    }
    
    // Operational metrics:
    const ttv = row.dias_en_activarse;
    if (ttv !== null && ttv !== undefined && ttv >= 0) {
      cStats.totalTtvDays += ttv;
      cStats.hasTtvCount++;
    }
    if (isActive30d) {
      cStats.realActiveCount++;
    }
    cStats.totalRealOrders += ordersDelivered;
    cStats.totalRealProducts += productsCreated;
    if (productsCreated >= 1) {
      cStats.hasProductCount++;
    }
    if (ordersDelivered >= 1) {
      cStats.hasOrderCount++;
    }
    
    // Encuesta
    const sRole = row.survey_role;
    const sVolume = row.survey_volume || row.survey_brand_sales;
    const sSource = row.survey_source;
    if (sRole || sVolume || sSource) {
      cStats.surveyed++;
      if (sRole && sRole.toLowerCase().includes("proveedor")) {
        cStats.suppliers++;
      }
      if (sVolume) {
        const isBigVal = sVolume.includes("1.000") || sVolume.includes("301 a 1.000") || sVolume.includes("51 a 300");
        if (isBigVal) {
          cStats.highVolume++;
        }
      }
    }

    if (lastSeenDate) {
      const daysSinceLastSeen = Math.floor((referenceDate.getTime() - lastSeenDate.getTime()) / 86400000);
      cStats.totalInactiveDays += Math.max(0, daysSinceLastSeen);
      cStats.hasInactiveDaysCount++;
    }
    
    if (signUpDate && lastSeenDate) {
      const lifespanDays = Math.floor((lastSeenDate.getTime() - signUpDate.getTime()) / 86400000);
      cStats.totalLifespanDays += Math.max(0, lifespanDays);
      cStats.hasLifespanCount++;
    }
    
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
          // Campos de comunidad y referido
          referred_by: row.referred_by || null,
          belong_to_community: row.belong_to_community || null,
          owner_of_community: row.owner_of_community || null,
          resolved_community: community,
          // Nuevos campos operativos y de validación
          tipo_proveedor: row.tipo_proveedor || null,
          has_appointment,
          ultima_cita_confirmada,
          real_orders_delivered: ordersDelivered,
          real_products_created: productsCreated,
          real_dropshipper_clients: row.real_dropshipper_clients || 0,
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
      activationChurnRate: totalSuppliers > 0 ? Math.round(((churnActivacionA + churnActivacionB) / totalSuppliers) * 100) : 0,
      activationChurnCount: churnActivacionA + churnActivacionB,
      activationChurnA: churnActivacionA,
      activationChurnB: churnActivacionB,
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
    funnel: [
      { step: "Registrados (Userpilot)", count: totalSuppliers, pct: 100, color: "#6366F1" },
      { step: "Catálogo Listo (>=1 Prod)", count: data.filter((row) => (row.real_products_created || 0) >= 1).length, pct: totalSuppliers > 0 ? Math.round((data.filter((row) => (row.real_products_created || 0) >= 1).length / totalSuppliers) * 100) : 0, color: "#8B5CF6" },
      { step: "Primera Venta (>=1 Orden)", count: data.filter((row) => (row.real_orders_delivered || 0) >= 1).length, pct: totalSuppliers > 0 ? Math.round((data.filter((row) => (row.real_orders_delivered || 0) >= 1).length / totalSuppliers) * 100) : 0, color: "#EC4899" },
      { step: "Bodega Activa (30d)", count: data.filter((row) => row.es_activo_30d === true).length, pct: totalSuppliers > 0 ? Math.round((data.filter((row) => row.es_activo_30d === true).length / totalSuppliers) * 100) : 0, color: "#10B981" }
    ],
    communities: Object.values(communityStats)
      .sort((a, b) => b.count - a.count)
      .map((c) => ({
        name: c.name,
        count: c.count,
        activeCount: c.active,
        activeRate: c.count > 0 ? Math.round((c.active / c.count) * 100) : 0,
        verifiedRate: c.count > 0 ? Math.round((c.verified / c.count) * 100) : 0,
        avgSessions: c.count > 0 ? Math.round((c.totalSessions / c.count) * 10) / 10 : 0,
        billingRate: c.count > 0 ? Math.round((c.billing / c.count) * 100) : 0,
        supplierRate: c.surveyed > 0 ? Math.round((c.suppliers / c.surveyed) * 100) : 0,
        highVolumeRate: c.surveyed > 0 ? Math.round((c.highVolume / c.surveyed) * 100) : 0,
        bounceRate: c.count > 0 ? Math.round((c.bounces / c.count) * 100) : 0,
        avgInactiveDays: c.hasInactiveDaysCount > 0 ? Math.round(c.totalInactiveDays / c.hasInactiveDaysCount) : 0,
        avgLifespanDays: c.hasLifespanCount > 0 ? Math.round(c.totalLifespanDays / c.hasLifespanCount) : 0,
        avgTtvDays: c.hasTtvCount > 0 ? Math.round(c.totalTtvDays / c.hasTtvCount) : 0,
        realActiveRate: c.count > 0 ? Math.round((c.realActiveCount / c.count) * 100) : 0,
        totalRealOrders: c.totalRealOrders,
        totalRealProducts: c.totalRealProducts,
        hasProductRate: c.count > 0 ? Math.round((c.hasProductCount / c.count) * 100) : 0,
        hasOrderRate: c.count > 0 ? Math.round((c.hasOrderCount / c.count) * 100) : 0
      })),
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
    },
    validationStats: {
      noTypeCount,
      validatedCount: noTypeWithOrderCount,
      validatedPct: noTypeCount > 0 ? Math.round((noTypeWithOrderCount / noTypeCount) * 100) : 0,
      surveyBreakdown: Object.keys(noTypeSurveyRoles).map(name => ({
        name,
        value: noTypeSurveyRoles[name],
        color: name.includes("Proveedor") ? "#6366F1" : (name.includes("Marca") ? "#10B981" : "#94A3B8")
      })),
      validatedList: validatedList,
      correlation: {
        withMeetingWithProducts,
        withMeetingNoProducts,
        noMeetingWithProducts,
        noMeetingNoProducts
      }
    },
    tierPerformance: Object.keys(tierStatsMap).map(tier => {
      const ts = tierStatsMap[tier];
      return {
        tier,
        count: ts.count,
        avgOrders: ts.count > 0 ? Math.round((ts.orders / ts.count) * 10) / 10 : 0,
        avgProducts: ts.count > 0 ? Math.round((ts.products / ts.count) * 10) / 10 : 0,
        activeRate: ts.count > 0 ? Math.round((ts.activeCount / ts.count) * 100) : 0
      };
    })
  };
}

// Analizar detalles específicos de una comunidad
function analyzeCommunityDetails(
  data: any[],
  country: string,
  communityName: string,
  appointments: Record<string, any> = {}
) {
  const supplierMap = new Map<string, any>();
  data.forEach((row) => {
    if (row.user_id) {
      supplierMap.set(String(row.user_id).trim(), row);
    }
  });

  const resolveCommunity = (row: any): string => {
    if (row.belong_to_community && row.belong_to_community.trim() !== "" && row.belong_to_community.trim() !== "-") {
      return row.belong_to_community.trim();
    }
    if (row.owner_of_community && row.owner_of_community.trim() !== "" && row.owner_of_community.trim() !== "-") {
      return row.owner_of_community.trim();
    }
    if (row.referred_by && row.referred_by.trim() !== "" && row.referred_by.trim() !== "-") {
      const referrerId = String(row.referred_by).trim();
      const referrer = supplierMap.get(referrerId);
      if (referrer) {
        if (referrer.owner_of_community && referrer.owner_of_community.trim() !== "" && referrer.owner_of_community.trim() !== "-") {
          return referrer.owner_of_community.trim();
        }
        if (referrer.belong_to_community && referrer.belong_to_community.trim() !== "" && referrer.belong_to_community.trim() !== "-") {
          return referrer.belong_to_community.trim();
        }
        if (referrer.name && referrer.name.trim() !== "") {
          return `Referido por ${referrer.name.trim()}`;
        }
      }
    }
    return "Orgánico / Sin comunidad";
  };

  const communityRows: any[] = [];
  data.forEach((row) => {
    const resolved = resolveCommunity(row);
    if (resolved === communityName) {
      communityRows.push({ ...row, resolvedCommunity: resolved });
    }
  });

  const totalSuppliers = communityRows.length;
  let totalSessions = 0;
  let verifiedCount = 0;
  let activeCount = 0;
  let billingCount = 0;
  let bounceCount = 0;
  let totalInactiveDays = 0;
  let hasInactiveDaysCount = 0;
  let totalLifespanDays = 0;
  let hasLifespanCount = 0;
  
  // Operational metrics:
  let totalTtvDays = 0;
  let hasTtvCount = 0;
  let realActiveCount = 0;
  let totalRealOrders = 0;
  let totalRealProducts = 0;

  const referenceDate = new Date("2026-05-25T10:30:00-05:00");

  let volOver1000 = 0;
  let vol301to1000 = 0;
  let vol51to300 = 0;
  let volUnder50 = 0;
  let volNotSelling = 0;
  let volNotManaging = 0;
  let volUnspecified = 0;

  let roleSupplier = 0;
  let roleBrand = 0;
  let roleNone = 0;

  const suppliersList: any[] = [];

  communityRows.forEach((row) => {
    const { signed_up, last_seen, web_sessions, country: cName, verified, billing_information, name, email, phone } = row;
    const sessions = web_sessions || 0;
    totalSessions += sessions;
    if (verified) verifiedCount++;
    if (sessions > 7) activeCount++;
    if (billing_information) billingCount++;
    if (sessions === 1) bounceCount++;

    const ttv = row.dias_en_activarse;
    if (ttv !== null && ttv !== undefined && ttv >= 0) {
      totalTtvDays += ttv;
      hasTtvCount++;
    }
    if (row.es_activo_30d === true) {
      realActiveCount++;
    }
    totalRealOrders += (row.real_orders_delivered || 0);
    totalRealProducts += (row.real_products_created || 0);

    const lastSeenDate = last_seen ? new Date(last_seen) : null;
    const signUpDate = signed_up ? new Date(signed_up) : null;
    let daysInactive = 0;
    if (lastSeenDate) {
      daysInactive = Math.floor((referenceDate.getTime() - lastSeenDate.getTime()) / 86400000);
      totalInactiveDays += Math.max(0, daysInactive);
      hasInactiveDaysCount++;
    }
    if (signUpDate && lastSeenDate) {
      const lifespanDays = Math.floor((lastSeenDate.getTime() - signUpDate.getTime()) / 86400000);
      totalLifespanDays += Math.max(0, lifespanDays);
      hasLifespanCount++;
    }

    const sRole = row.survey_role;
    const sVolume = row.survey_volume || row.survey_brand_sales;

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

    const isSupplier = sRole && sRole.toLowerCase().includes("proveedor");
    const isBigVolume = sVolume && (sVolume.includes("1.000") || sVolume.includes("301 a 1.000") || sVolume.includes("51 a 300"));
    let potentialRating: "high" | "medium" | "low" = "low";
    if (isSupplier && isBigVolume) potentialRating = "high";
    else if (isSupplier || isBigVolume || sRole) potentialRating = "medium";

    let referrerName = "-";
    if (row.referred_by) {
      const ref = supplierMap.get(String(row.referred_by).trim());
      if (ref) {
        referrerName = ref.name || `ID ${row.referred_by}`;
      }
    }

    // Cruce de citas CRM para detalle de comunidad
    const emailKey = email ? String(email).trim().toLowerCase() : "";
    const phoneKey = phone ? String(phone).trim() : "";
    let has_appointment = !!row.has_appointment;
    let ultima_cita_confirmada = row.ultima_cita_confirmada || null;

    if (appointments) {
      const appt = (emailKey && appointments[emailKey]) || (phoneKey && appointments[phoneKey]) || null;
      if (appt) {
        has_appointment = true;
        ultima_cita_confirmada = appt.ultima_cita_confirmada;
      }
    }

    suppliersList.push({
      user_id: row.user_id,
      name: name || "Bodega Anónima",
      email: email || "-",
      phone: phone || "-",
      country: cName || "Desconocido",
      web_sessions: sessions,
      days_inactive: lastSeenDate ? Math.max(0, daysInactive) : 99,
      signed_up: signed_up,
      verified: !!verified,
      billing_information: !!billing_information,
      survey_role: sRole || null,
      survey_volume: sVolume || null,
      potentialRating,
      referrerName,
      // Operational metrics fields:
      fecha_activacion: row.fecha_activacion || null,
      dias_en_activarse: row.dias_en_activarse !== undefined ? row.dias_en_activarse : null,
      es_activo_30d: !!row.es_activo_30d,
      real_orders_delivered: row.real_orders_delivered || 0,
      real_products_created: row.real_products_created || 0,
      real_dropshipper_clients: row.real_dropshipper_clients || 0,
      // Nuevos campos de validación y tipo
      tipo_proveedor: row.tipo_proveedor || null,
      has_appointment,
      ultima_cita_confirmada,
    });
  });

  suppliersList.sort((a, b) => {
    const potMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const pA = potMap[a.potentialRating] || 1;
    const pB = potMap[b.potentialRating] || 1;
    if (pA !== pB) return pB - pA;
    return b.web_sessions - a.web_sessions;
  });

  const communityRegistered = totalSuppliers;
  const communityHasProduct = communityRows.filter((row) => (row.real_products_created || 0) >= 1).length;
  const communityHasOrder = communityRows.filter((row) => (row.real_orders_delivered || 0) >= 1).length;
  const communityActiveDropi = communityRows.filter((row) => row.es_activo_30d === true).length;

  return {
    communityName,
    funnel: [
      { step: "Registrados (Userpilot)", count: communityRegistered, pct: 100, color: "#6366F1" },
      { step: "Catálogo Listo (>=1 Prod)", count: communityHasProduct, pct: communityRegistered > 0 ? Math.round((communityHasProduct / communityRegistered) * 100) : 0, color: "#8B5CF6" },
      { step: "Primera Venta (>=1 Orden)", count: communityHasOrder, pct: communityRegistered > 0 ? Math.round((communityHasOrder / communityRegistered) * 100) : 0, color: "#EC4899" },
      { step: "Bodega Activa (30d)", count: communityActiveDropi, pct: communityRegistered > 0 ? Math.round((communityActiveDropi / communityRegistered) * 100) : 0, color: "#10B981" }
    ],
    stats: {
      totalSuppliers,
      activeRate: totalSuppliers > 0 ? Math.round((activeCount / totalSuppliers) * 100) : 0,
      verifiedRate: totalSuppliers > 0 ? Math.round((verifiedCount / totalSuppliers) * 100) : 0,
      billingRate: totalSuppliers > 0 ? Math.round((billingCount / totalSuppliers) * 100) : 0,
      bounceRate: totalSuppliers > 0 ? Math.round((bounceCount / totalSuppliers) * 100) : 0,
      avgSessions: totalSuppliers > 0 ? Math.round((totalSessions / totalSuppliers) * 10) / 10 : 0,
      avgInactiveDays: hasInactiveDaysCount > 0 ? Math.round(totalInactiveDays / hasInactiveDaysCount) : 0,
      avgLifespanDays: hasLifespanCount > 0 ? Math.round(totalLifespanDays / hasLifespanCount) : 0,
      avgTtvDays: hasTtvCount > 0 ? Math.round(totalTtvDays / hasTtvCount) : 0,
      realActiveRate: totalSuppliers > 0 ? Math.round((realActiveCount / totalSuppliers) * 100) : 0,
      totalRealOrders,
      totalRealProducts
    },
    volumes: [
      { name: "Más de 1.000 al mes", value: volOver1000 },
      { name: "301 a 1.000 al mes", value: vol301to1000 },
      { name: "51 a 300 al mes", value: vol51to300 },
      { name: "Menos de 50 al mes", value: volUnder50 },
      { name: "Aún no vendo (Marcas)", value: volNotSelling },
      { name: "Aún no gestiono pedidos", value: volNotManaging },
      { name: "Sin datos (No completó)", value: volUnspecified }
    ],
    roles: [
      { name: "Proveedores", value: roleSupplier, color: "#6366F1" },
      { name: "Marcas", value: roleBrand, color: "#10B981" },
      { name: "No especificado", value: roleNone, color: "#94A3B8" }
    ],
    suppliers: suppliersList
  };
}

// Generador de lista de mock proveedores raw
function generateMockSuppliersList(country: string): any[] {
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
    const signedUpDaysAgo = Math.floor(Math.random() * 90);
    const signedUp = new Date(referenceDate.getTime());
    signedUp.setDate(referenceDate.getDate() - signedUpDaysAgo);

    const rand = Math.random();
    let web_sessions = 1;
    if (rand > 0.3) web_sessions = Math.floor(Math.random() * 3) + 2;
    if (rand > 0.6) web_sessions = Math.floor(Math.random() * 6) + 5;
    if (rand > 0.85) web_sessions = Math.floor(Math.random() * 25) + 11;

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

    let belong_to_community = null;
    let owner_of_community = null;
    let referred_by = null;
    
    let dias_en_activarse = null;
    let es_activo_30d = false;
    let real_orders_delivered = 0;
    let real_products_created = 0;
    let real_dropshipper_clients = 0;

    // Generar tipo_proveedor para simulación
    let tipo_proveedor = null;
    const tierRand = Math.random();
    if (tierRand > 0.94) tipo_proveedor = "PREMIUM EXCLUSIVO";
    else if (tierRand > 0.82) tipo_proveedor = "PREMIUM";
    else if (tierRand > 0.55) tipo_proveedor = "VERIFICADO";

    // Generar citas agendadas CRM para simulación
    let has_appointment = Math.random() > 0.75;
    let ultima_cita_confirmada = null;
    if (has_appointment) {
      const apptDate = new Date(signedUp.getTime());
      apptDate.setDate(signedUp.getDate() + Math.floor(Math.random() * 7) + 1);
      ultima_cita_confirmada = apptDate.toISOString();
    }

    // Supposing 40% are matched/operational in mock
    if (Math.random() > 0.6) {
      dias_en_activarse = Math.floor(Math.random() * 30) + 1; // 1-30 days
      es_activo_30d = Math.random() > 0.4;
      real_orders_delivered = es_activo_30d ? Math.floor(Math.random() * 800) + 10 : Math.floor(Math.random() * 5);
      real_products_created = Math.floor(Math.random() * 150) + 2;
      real_dropshipper_clients = Math.floor(real_orders_delivered * 0.7) + 1;
    }

    if (Math.random() > 0.4) {
      const mockComs = [
        "COMUNIDAD IVAN CAICEDO",
        "GOCOMMER",
        "SEVENTY",
        "BRANDS",
        "ESTRELLAS",
        "ALEX ROJAS",
        "GGP PREMIUM",
        "RUN COMMERCE",
        "LOGÍSTICA PREMIUM",
        "FAMILIA ECOM"
      ];
      if (Math.random() > 0.6) {
        belong_to_community = mockComs[Math.floor(Math.random() * mockComs.length)];
      } else {
        owner_of_community = mockComs[Math.floor(Math.random() * mockComs.length)];
      }
    } else if (Math.random() > 0.3 && i > 0) {
      referred_by = `user_${Math.floor(Math.random() * i)}`;
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
      survey_role,
      survey_volume,
      survey_brand_sales,
      survey_source,
      survey_purpose,
      referred_by,
      belong_to_community,
      owner_of_community,
      dias_en_activarse,
      es_activo_30d,
      real_orders_delivered,
      real_products_created,
      real_dropshipper_clients,
      tipo_proveedor,
      has_appointment,
      ultima_cita_confirmada,
    });
  }

  return data;
}

// Simulación de datos de comportamiento en caso de no tener DB
function generateMockBehaviorData(country: string) {
  const data = generateMockSuppliersList(country);
  return analyzeSuppliers(data, country, "mock");
}
