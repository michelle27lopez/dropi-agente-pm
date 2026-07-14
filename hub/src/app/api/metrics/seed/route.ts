import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase client is not configured. Check your env variables." },
      { status: 500 }
    );
  }

  try {
    const countries = ["CO", "MX", "EC", "ALL"];
    const dates: string[] = [];

    // Generar fechas para los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }

    const records: any[] = [];

    dates.forEach((dateStr) => {
      // El día de la semana influye en el volumen (fines de semana más bajos)
      const dateObj = new Date(dateStr);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const dayFactor = isWeekend ? 0.75 : 1.05;

      countries.forEach((country) => {
        // Factor de escala por país
        let scale = 1.0;
        if (country === "CO") scale = 1.2;
        else if (country === "MX") scale = 0.9;
        else if (country === "EC") scale = 0.6;
        else if (country === "ALL") scale = 2.7; // Suma/Promedio aproximado

        // Tendencia creciente a lo largo del tiempo
        const dayIndex = dates.indexOf(dateStr);
        const trendFactor = 1 + (dayIndex / 29) * 0.15; // +15% de crecimiento en 30 días

        const finalFactor = scale * dayFactor * trendFactor;

        // --- NIVEL 1: NEGOCIO & IMPACTO ---
        const gmv = Math.round(15000 * finalFactor);
        const orders = Math.round(620 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 1,
          metric_key: "gmv",
          metric_name: "GMV",
          value_num: gmv,
          value_display: `$${gmv.toLocaleString("es-CO")}`,
          unit: "USD",
          trend: "up",
          trend_value: "+12%",
          health: "good",
        });

        records.push({
          metric_date: dateStr,
          country,
          metric_level: 1,
          metric_key: "orders",
          metric_name: "Volumen de Órdenes",
          value_num: orders,
          value_display: orders.toLocaleString("es-CO"),
          unit: "órdenes",
          trend: "up",
          trend_value: "+8%",
          health: "good",
        });

        // --- NIVEL 2: ADOPCIÓN & VALOR ---
        const actRate = Math.round((55 + (dayIndex / 29) * 12 + Math.random() * 5) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 2,
          metric_key: "activation_rate",
          metric_name: "Tasa de Activación",
          value_num: actRate,
          value_display: `${actRate}%`,
          unit: "%",
          trend: "up",
          trend_value: "+5.4pp",
          health: actRate > 60 ? "good" : "warning",
        });

        const activeA15 = Math.round(110 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 2,
          metric_key: "active_suppliers_a15",
          metric_name: "Proveedores Activos (A15)",
          value_num: activeA15,
          value_display: activeA15.toLocaleString("es-CO"),
          unit: "proveedores",
          trend: "up",
          trend_value: "+15%",
          health: "good",
        });

        const activeA30 = Math.round(175 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 2,
          metric_key: "active_suppliers_a30",
          metric_name: "Proveedores Activos (A30)",
          value_num: activeA30,
          value_display: activeA30.toLocaleString("es-CO"),
          unit: "proveedores",
          trend: "up",
          trend_value: "+11%",
          health: "good",
        });

        const aov = Math.round((24.2 + (Math.random() - 0.5) * 1.5) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 2,
          metric_key: "aov",
          metric_name: "Ticket Promedio (AOV)",
          value_num: aov,
          value_display: `$${aov.toFixed(1)}`,
          unit: "USD",
          trend: "stable",
          trend_value: "→ estable",
          health: "neutral",
        });

        const catHealth = Math.round((68 + (dayIndex / 29) * 8 + Math.random() * 4) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 2,
          metric_key: "catalog_health",
          metric_name: "Salud del Catálogo",
          value_num: catHealth,
          value_display: `${catHealth}%`,
          unit: "%",
          trend: "up",
          trend_value: "+2pp",
          health: "good",
        });

        // --- NIVEL 3: EFICIENCIA & EMBUDOS ---
        const ttv = Math.round((8.5 - (dayIndex / 29) * 2.2 + (Math.random() - 0.5) * 1) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 3,
          metric_key: "time_to_first_sale",
          metric_name: "Time to First Sale",
          value_num: ttv,
          value_display: `${ttv} días`,
          unit: "días",
          trend: "down", // en TTV bajar es bueno!
          trend_value: "-1.8 días",
          health: ttv < 7 ? "good" : "warning",
        });

        const checklistComp = Math.round((62 + (dayIndex / 29) * 14 + Math.random() * 3) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 3,
          metric_key: "checklist_completion_rate",
          metric_name: "% Completion Checklist",
          value_num: checklistComp,
          value_display: `${checklistComp}%`,
          unit: "%",
          trend: "up",
          trend_value: "+6pp",
          health: "good",
        });

        const negConv = Math.round((48 + (Math.random() - 0.5) * 6) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 3,
          metric_key: "negotiation_conversion_rate",
          metric_name: "Conversión de Negociaciones",
          value_num: negConv,
          value_display: `${negConv}%`,
          unit: "%",
          trend: "stable",
          trend_value: "→ estable",
          health: "neutral",
        });

        const extSync = Math.round((35 + (dayIndex / 29) * 8 + Math.random() * 2) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 3,
          metric_key: "external_sync_rate",
          metric_name: "% Sincronización Externa",
          value_num: extSync,
          value_display: `${extSync}%`,
          unit: "%",
          trend: "up",
          trend_value: "+4pp",
          health: "good",
        });

        // --- NIVEL 4: ENTRADAS & GESTIÓN ---
        const newReg = Math.round(28 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 4,
          metric_key: "new_registrations",
          metric_name: "Nuevos Registros",
          value_num: newReg,
          value_display: newReg.toLocaleString("es-CO"),
          unit: "proveedores",
          trend: "up",
          trend_value: "+14%",
          health: "good",
        });

        const appAsc = Math.round(6 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 4,
          metric_key: "ascension_applications",
          metric_name: "Postulaciones Ascenso (Total)",
          value_num: appAsc,
          value_display: appAsc.toLocaleString("es-CO"),
          unit: "postulaciones",
          trend: "up",
          trend_value: "+20%",
          health: "good",
        });

        const ascVer = Math.round(4 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 4,
          metric_key: "ascenso_verificado",
          metric_name: "Postulaciones Verificado",
          value_num: ascVer,
          value_display: ascVer.toLocaleString("es-CO"),
          unit: "postulaciones",
          trend: "up",
          trend_value: "+18%",
          health: "good",
        });

        const ascPrem = Math.round(2 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 4,
          metric_key: "ascenso_premium",
          metric_name: "Postulaciones Premium",
          value_num: ascPrem,
          value_display: ascPrem.toLocaleString("es-CO"),
          unit: "postulaciones",
          trend: "up",
          trend_value: "+25%",
          health: "good",
        });

        const aprVis = Math.round(15 * finalFactor);
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 4,
          metric_key: "aprobacion_visibilidad",
          metric_name: "Aprobación Visibilidad",
          value_num: aprVis,
          value_display: aprVis.toLocaleString("es-CO"),
          unit: "postulaciones",
          trend: "up",
          trend_value: "+15%",
          health: "good",
        });

        const tat = Math.round((26 - (dayIndex / 29) * 8 + (Math.random() - 0.5) * 4) * 10) / 10;
        records.push({
          metric_date: dateStr,
          country,
          metric_level: 4,
          metric_key: "audit_tat",
          metric_name: "TAT de Auditoría",
          value_num: tat,
          value_display: `${tat}h`,
          unit: "horas",
          trend: "down", // bajar TAT es positivo!
          trend_value: "-6.2h",
          health: tat < 24 ? "good" : "warning",
        });
      });
    });

    console.log(`Intentando sembrar ${records.length} registros en Supabase...`);

    // Haremos inserts en lotes pequeños para evitar límites de tamaño del payload
    const batchSize = 100;
    let seededCount = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { error } = await supabase
        .from("pm_supplier_metrics")
        .upsert(batch, { onConflict: "metric_date,country,metric_key" });

      if (error) {
        console.error("Error sembrando lote:", error);
        return NextResponse.json(
          {
            error: "Error insertando datos en Supabase. ¿Ya ejecutaste el script SQL de migración?",
            details: error,
          },
          { status: 500 }
        );
      }
      seededCount += batch.length;
    }

    return NextResponse.json({
      success: true,
      message: `¡Se sembraron exitosamente ${seededCount} registros históricos en Supabase!`,
    });
  } catch (err: any) {
    console.error("Excepción durante el sembrado:", err);
    return NextResponse.json(
      { error: "Excepción interna del servidor", details: err?.message || err },
      { status: 500 }
    );
  }
}
