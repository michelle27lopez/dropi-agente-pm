import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCRMLevel4Metrics, CRMLevel4Day } from "@/lib/crm-db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "ALL";
  const daysVal = searchParams.get("days") || "30";
  const days = parseInt(daysVal, 10) || 30;

  // Calcular la fecha inicial
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  const startDateStr = startDate.toISOString().split("T")[0];

  let crmSource: "postgres" | "mock" = "mock";
  let crmData: Record<string, Partial<CRMLevel4Day>> = {};

  // 1. Intentar consultar el CRM PostgreSQL para el Nivel 4
  try {
    if (process.env.CRM_PG_HOST) {
      crmData = await getCRMLevel4Metrics(country, startDateStr);
      crmSource = "postgres";
      console.log(`[CRM] Cargados datos reales de Nivel 4 desde PostgreSQL para ${country}`);
    }
  } catch (err: any) {
    console.warn("[CRM] Falló la consulta a PostgreSQL, usando fallback mock:", err.message);
    crmSource = "mock";
  }

  // 2. Cargar historial base (de Supabase o Mock)
  let source: "supabase" | "mock" = "mock";
  let history: Record<string, any>[] = [];

  try {
    let supabaseSuccess = false;
    let data: any[] | null = null;

    if (supabase) {
      const { data: sbData, error } = await supabase
        .from("pm_supplier_metrics")
        .select("*")
        .eq("country", country)
        .gte("metric_date", startDateStr)
        .order("metric_date", { ascending: true });

      if (!error && sbData && sbData.length > 0) {
        data = sbData;
        supabaseSuccess = true;
      }
    }

    if (supabaseSuccess && data) {
      source = "supabase";
      const dateMap: Record<string, any> = {};

      data.forEach((row) => {
        const { metric_date, metric_key, value_num } = row;
        if (!dateMap[metric_date]) {
          dateMap[metric_date] = { date: metric_date };
        }
        dateMap[metric_date][metric_key] = Number(value_num);
      });

      const sortedDates = Object.keys(dateMap).sort();
      sortedDates.forEach((date) => {
        history.push(dateMap[date]);
      });
    } else {
      source = "mock";
      history = buildMockHistory(country, days);
    }
  } catch (err: any) {
    console.error("Excepción al cargar historial base:", err);
    source = "mock";
    history = buildMockHistory(country, days);
  }

  // 3. Fusionar datos del CRM PostgreSQL para Nivel 4
  history.forEach((entry) => {
    const date = entry.date;
    if (crmSource === "postgres") {
      const realDay = crmData[date] || {};
      
      // Si no hay datos cargados de Userpilot en Supabase, cae en CRM count
      if (entry.new_registrations === undefined || entry.new_registrations === 0) {
        entry.new_registrations = realDay.new_registrations ?? 0;
      }
      entry.ascension_applications = realDay.ascension_applications ?? 0;
      entry.ascenso_verificado = realDay.ascenso_verificado ?? 0;
      entry.ascenso_premium = realDay.ascenso_premium ?? 0;
      entry.aprobacion_visibilidad = realDay.aprobacion_visibilidad ?? 0;
      entry.audit_tat = realDay.audit_tat ?? 0;
    }
  });

  // 4. Calcular el resumen agregado sobre todo el período (Suma para volúmenes, Promedio para tasas)
  const summary: Record<string, any> = {};
  const numDays = history.length;

  if (numDays > 0) {
    const sums: Record<string, number> = {};
    const keys = Object.keys(history[0]).filter((k) => k !== "date");

    keys.forEach((k) => {
      sums[k] = 0;
    });

    history.forEach((day) => {
      keys.forEach((k) => {
        sums[k] += day[k] || 0;
      });
    });

    // Definición de métricas de la pirámide
    const metricConfig: Record<string, { level: number; name: string; unit: string; type: "sum" | "avg" }> = {
      gmv: { level: 1, name: "GMV", unit: "USD", type: "sum" },
      orders: { level: 1, name: "Volumen de Órdenes", unit: "órdenes", type: "sum" },
      activation_rate: { level: 2, name: "Tasa de Activación", unit: "%", type: "avg" },
      active_suppliers_a15: { level: 2, name: "Proveedores Activos (A15)", unit: "proveedores", type: "avg" },
      active_suppliers_a30: { level: 2, name: "Proveedores Activos (A30)", unit: "proveedores", type: "avg" },
      aov: { level: 2, name: "Ticket Promedio (AOV)", unit: "USD", type: "avg" },
      catalog_health: { level: 2, name: "Salud del Catálogo", unit: "%", type: "avg" },
      time_to_first_sale: { level: 3, name: "Time to First Sale", unit: "días", type: "avg" },
      checklist_completion_rate: { level: 3, name: "% Completion Checklist", unit: "%", type: "avg" },
      negotiation_conversion_rate: { level: 3, name: "Conversión de Negociaciones", unit: "%", type: "avg" },
      external_sync_rate: { level: 3, name: "% Sincronización Externa", unit: "%", type: "avg" },
      new_registrations: { level: 4, name: "Nuevos Registros", unit: "proveedores", type: "sum" },
      ascension_applications: { level: 4, name: "Postulaciones Ascenso (Total)", unit: "postulaciones", type: "sum" },
      ascenso_verificado: { level: 4, name: "Postulaciones Verificado", unit: "postulaciones", type: "sum" },
      ascenso_premium: { level: 4, name: "Postulaciones Premium", unit: "postulaciones", type: "sum" },
      aprobacion_visibilidad: { level: 4, name: "Aprobación Visibilidad", unit: "postulaciones", type: "sum" },
      audit_tat: { level: 4, name: "TAT de Auditoría", unit: "horas", type: "avg" },
    };

    Object.keys(metricConfig).forEach((k) => {
      const config = metricConfig[k];
      let value_num = 0;
      if (config.type === "sum") {
        value_num = Math.round(sums[k]);
      } else {
        value_num = Math.round((sums[k] / numDays) * 10) / 10;
      }

      let value_display = "";
      if (config.unit === "USD") {
        value_display = `$${value_num.toLocaleString("es-CO")}`;
      } else if (config.unit === "%") {
        value_display = `${value_num}%`;
      } else if (config.unit === "días") {
        value_display = `${value_num} días`;
      } else if (config.unit === "horas") {
        value_display = `${value_num}h`;
      } else {
        value_display = value_num.toLocaleString("es-CO");
      }

      // Determinar procedencia / procedencia real de la información
      let sourceLabel = "";
      if (k === "new_registrations") {
        // Si tenemos datos en Supabase y el valor es mayor a 0, provienen de Userpilot
        const hasSupabaseVal = history.some(d => d.new_registrations > 0 && source === "supabase");
        sourceLabel = hasSupabaseVal ? "Userpilot Live" : (crmSource === "postgres" ? "Live CRM" : "Simulación");
      } else if (k === "ascension_applications" || k === "audit_tat") {
        sourceLabel = crmSource === "postgres" ? "Live CRM" : "Simulación";
      } else {
        sourceLabel = source === "supabase" ? "Supabase Live" : "Simulación";
      }

      let trend: "up" | "down" | "stable" = "stable";
      if (config.type === "sum") {
        // En suma, comparamos si la segunda mitad del período es mayor o menor
        const half = Math.floor(numDays / 2);
        if (half > 0) {
          const sum1 = history.slice(0, half).reduce((acc, curr) => acc + (curr[k] || 0), 0);
          const sum2 = history.slice(half).reduce((acc, curr) => acc + (curr[k] || 0), 0);
          trend = sum2 > sum1 ? "up" : (sum2 < sum1 ? "down" : "stable");
        }
      } else {
        // En promedio, evaluamos si la tendencia sube o baja
        const half = Math.floor(numDays / 2);
        if (half > 0) {
          const avg1 = history.slice(0, half).reduce((acc, curr) => acc + (curr[k] || 0), 0) / half;
          const avg2 = history.slice(half).reduce((acc, curr) => acc + (curr[k] || 0), 0) / (numDays - half);
          trend = avg2 > avg1 ? "up" : (avg2 < avg1 ? "down" : "stable");
        }
      }

      let health: "good" | "warning" | "critical" | "neutral" = "neutral";
      if (k === "time_to_first_sale" || k === "audit_tat") {
        health = value_num < (k === "audit_tat" ? 24 : 7) ? "good" : "warning";
      } else if (config.unit === "%") {
        health = value_num > 60 ? "good" : "warning";
      } else if (k === "gmv" || k === "orders" || k === "new_registrations" || k === "ascenso_verificado" || k === "ascenso_premium" || k === "aprobacion_visibilidad" || k === "ascension_applications") {
        health = value_num > 0 ? "good" : "neutral";
      }

      summary[k] = {
        value_num,
        value_display,
        trend,
        trend_value: sourceLabel,
        health,
        level: config.level,
        name: config.name,
        unit: config.unit,
      };
    });
  }

  return NextResponse.json({
    source,
    crmSource,
    country,
    days,
    summary,
    history,
  });
}

// Función auxiliar para generar datos mock
function buildMockHistory(country: string, days: number): Record<string, any>[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates.map((dateStr, dayIndex) => {
    const dateObj = new Date(dateStr);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const dayFactor = isWeekend ? 0.75 : 1.05;

    let scale = 1.0;
    if (country === "CO") scale = 1.2;
    else if (country === "MX") scale = 0.9;
    else if (country === "EC") scale = 0.6;
    else if (country === "ALL") scale = 2.7;

    const finalFactor = scale * dayFactor * (1 + (dayIndex / (days > 1 ? days - 1 : 1)) * 0.15);

    return {
      date: dateStr,
      gmv: Math.round(15000 * finalFactor),
      orders: Math.round(620 * finalFactor),
      activation_rate: Math.round((55 + (dayIndex / (days > 1 ? days - 1 : 1)) * 12 + Math.random() * 5) * 10) / 10,
      active_suppliers_a15: Math.round(110 * finalFactor),
      active_suppliers_a30: Math.round(175 * finalFactor),
      aov: Math.round((24.2 + (Math.random() - 0.5) * 1.5) * 10) / 10,
      catalog_health: Math.round((68 + (dayIndex / (days > 1 ? days - 1 : 1)) * 8 + Math.random() * 4) * 10) / 10,
      time_to_first_sale: Math.round((8.5 - (dayIndex / (days > 1 ? days - 1 : 1)) * 2.2 + (Math.random() - 0.5) * 1) * 10) / 10,
      checklist_completion_rate: Math.round((62 + (dayIndex / (days > 1 ? days - 1 : 1)) * 14 + Math.random() * 3) * 10) / 10,
      negotiation_conversion_rate: Math.round((48 + (Math.random() - 0.5) * 6) * 10) / 10,
      external_sync_rate: Math.round((35 + (dayIndex / (days > 1 ? days - 1 : 1)) * 8 + Math.random() * 2) * 10) / 10,
      new_registrations: Math.round(28 * finalFactor),
      ascension_applications: Math.round(6 * finalFactor),
      ascenso_verificado: Math.round(4 * finalFactor),
      ascenso_premium: Math.round(2 * finalFactor),
      aprobacion_visibilidad: Math.round(15 * finalFactor),
      audit_tat: Math.round((26 - (dayIndex / (days > 1 ? days - 1 : 1)) * 8 + (Math.random() - 0.5) * 4) * 10) / 10,
    };
  });
}
