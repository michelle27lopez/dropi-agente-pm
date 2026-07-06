// TTV dynamic dashboard metrics api endpoint
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  // 1. Fetch metadata tables
  const [monthlyRes, segmentsRes, monthlySegmentsRes, pipelineRes, timeRes, weeklyRes] = await Promise.all([
    supabase.from("ttv_monthly_data").select("*").order("month_number"),
    supabase.from("ttv_segments_6m").select("*").order("sort_order"),
    supabase.from("ttv_monthly_segments").select("*").order("month_number").order("sort_order"),
    supabase.from("ttv_pipeline_metrics").select("*").order("sort_order"),
    supabase.from("ttv_time_metrics").select("*").order("scope"),
    supabase.from("ttv_weekly_data").select("*").order("month_number").order("week_number"),
  ]);

  // 2. Fetch live data for cohort calculations
  const filterDateUP = '2026-06-30T14:00:00-05:00';
  const filterDateCRM = '2026-06-30T19:00:00.000Z'; // 19:00 UTC = 14:00 COT

  const [upSuppliersRes, crmOppsRes] = await Promise.all([
    supabase.from("ttv_userpilot_cohort").select("*").gte("signed_up", filterDateUP),
    supabase.from("ttv_crm_opportunities").select("*").gte("date_created", filterDateCRM),
  ]);

  const upSuppliers = upSuppliersRes.data || [];
  const crmOpps = crmOppsRes.data || [];

  // Group calculations by month and week
  const startDate = new Date(filterDateUP);

  function getWeekAndMonth(dateStr: string | null) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const diffTime = date.getTime() - startDate.getTime();
    if (diffTime < 0) return null;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const absWeek = Math.floor(diffDays / 7) + 1; // absolute week index (1-24)
    const month = Math.floor((absWeek - 1) / 4) + 1;
    const week = ((absWeek - 1) % 4) + 1;
    return { month, week };
  }

  // Audited stages list
  const auditedStages = [
    'auditoria confirmada',
    'Auditoría confirmada',
    'Auditoría Rechazada',
    'Auditoría rechazada',
    'Aprobado con pendientes',
    'listo para vender',
    'Listo para vender',
    'Primera Orden generada',
    'Enfrio/no apto',
    'Enfrío/no apto'
  ];

  // Ready stages list
  const readyStages = [
    'listo para vender',
    'Listo para vender',
    'Primera Orden generada'
  ];

  // Initialize weekly real metrics map
  // key: "month_week"
  const weeklyReal: Record<string, { contactos: number; auditados: number; listos: number }> = {};
  for (let m = 1; m <= 6; m++) {
    for (let w = 1; w <= 4; w++) {
      weeklyReal[`${m}_${w}`] = { contactos: 0, auditados: 0, listos: 0 };
    }
  }

  // Count CRM opportunities into cohort weeks
  crmOpps.forEach(opp => {
    const wm = getWeekAndMonth(opp.date_created);
    if (wm && wm.month <= 6) {
      const key = `${wm.month}_${wm.week}`;
      weeklyReal[key].contactos++;
      
      const normalizedStage = (opp.stage_name || '').toLowerCase().trim();
      const isAudited = auditedStages.some(s => s.toLowerCase() === normalizedStage);
      const isReady = readyStages.some(s => s.toLowerCase() === normalizedStage);

      if (isAudited) {
        weeklyReal[key].auditados++;
      }
      if (isReady) {
        weeklyReal[key].listos++;
      }
    }
  });

  // Calculate monthly reals based on weekly reals
  const monthlyReal: Record<number, { contactos: number; auditados: number; listos: number }> = {};
  for (let m = 1; m <= 6; m++) {
    monthlyReal[m] = { contactos: 0, auditados: 0, listos: 0 };
    for (let w = 1; w <= 4; w++) {
      const key = `${m}_${w}`;
      monthlyReal[m].contactos += weeklyReal[key].contactos;
      monthlyReal[m].auditados += weeklyReal[key].auditados;
      monthlyReal[m].listos += weeklyReal[key].listos;
    }
  }

  // Map to tables
  const mappedWeekly = (weeklyRes.data || []).map(w => {
    const key = `${w.month_number}_${w.week_number}`;
    const real = weeklyReal[key] || { contactos: 0, auditados: 0, listos: 0 };
    return {
      ...w,
      contactos_real: real.contactos || null,
      auditados_real: real.auditados || null,
      listos_real: real.listos || null,
    };
  });

  const mappedMonthly = (monthlyRes.data || []).map(m => {
    const real = monthlyReal[m.month_number] || { contactos: 0, auditados: 0, listos: 0 };
    return {
      ...m,
      contactos_real: real.contactos || null,
      auditados_real: real.auditados || null,
      listos_real: real.listos || null,
    };
  });

  // 3. Fetch master suppliers for community mapping
  const emails = [
    ...upSuppliers.map(s => s.email),
    ...crmOpps.map(o => o.email)
  ].filter(Boolean);

  const { data: masterSuppliersRes } = await supabase
    .from("userpilot_suppliers")
    .select("user_id, email, belong_to_community, referred_by")
    .in("email", emails);

  const masterSuppliers = masterSuppliersRes || [];
  const masterMap = new Map(masterSuppliers.map(s => [(s.email || '').toLowerCase().trim(), s]));

  // Calculate dynamic segment monthly and 6m reals
  const segmentMonthlyReal: Record<string, { contactos: number; auditados: number; listos: number }> = {};
  
  crmOpps.forEach(opp => {
    const wm = getWeekAndMonth(opp.date_created);
    const segKey = opp.segment_key || 'pequenos';
    if (wm && wm.month <= 6) {
      const key = `${wm.month}_${segKey}`;
      if (!segmentMonthlyReal[key]) {
        segmentMonthlyReal[key] = { contactos: 0, auditados: 0, listos: 0 };
      }
      segmentMonthlyReal[key].contactos++;
      
      const normalizedStage = (opp.stage_name || '').toLowerCase().trim();
      const isAudited = auditedStages.some(s => s.toLowerCase() === normalizedStage);
      const isReady = readyStages.some(s => s.toLowerCase() === normalizedStage);

      if (isAudited) {
        segmentMonthlyReal[key].auditados++;
      }
      if (isReady) {
        segmentMonthlyReal[key].listos++;
      }
    }
  });

  const mappedMonthlySegments = (monthlySegmentsRes.data || []).map(ms => {
    const key = `${ms.month_number}_${ms.segment_key}`;
    const real = segmentMonthlyReal[key] || { contactos: 0, auditados: 0, listos: 0 };
    return {
      ...ms,
      contactos_real: real.contactos || null,
      auditados_real: real.auditados || null,
      listos_real: real.listos || null,
    };
  });

  const segment6mReal: Record<string, { contactos: number; auditados: number; listos: number }> = {};
  (segmentsRes.data || []).forEach(s => {
    segment6mReal[s.segment_key] = { contactos: 0, auditados: 0, listos: 0 };
  });

  mappedMonthlySegments.forEach(ms => {
    if (segment6mReal[ms.segment_key]) {
      segment6mReal[ms.segment_key].contactos += (ms.contactos_real || 0);
      segment6mReal[ms.segment_key].auditados += (ms.auditados_real || 0);
      segment6mReal[ms.segment_key].listos += (ms.listos_real || 0);
    }
  });

  const mappedSegments6m = (segmentsRes.data || []).map(s => {
    const real = segment6mReal[s.segment_key] || { contactos: 0, auditados: 0, listos: 0 };
    return {
      ...s,
      contactos_real: real.contactos || null,
      auditados_real: real.auditados || null,
      listos_real: real.listos || null,
    };
  });

  // Match individuals for detail view
  const crmMap = new Map(crmOpps.map(o => [(o.email || '').toLowerCase().trim(), o]));
  const upMap = new Map(upSuppliers.map(s => [(s.email || '').toLowerCase().trim(), s]));

  const matched: any[] = [];
  const brecha: any[] = [];
  const manual: any[] = [];

  let comunidadCount = 0;
  let huerfanoCount = 0;

  upSuppliers.forEach(s => {
    const email = (s.email || '').toLowerCase().trim();
    const masterInfo = masterMap.get(email);
    const belongToCommunity = masterInfo?.belong_to_community || null;

    if (belongToCommunity && belongToCommunity !== '-' && belongToCommunity !== '') {
      comunidadCount++;
    } else {
      huerfanoCount++;
    }

    if (crmMap.has(email)) {
      const crmOpp = crmMap.get(email);
      matched.push({
        user_id: s.user_id,
        name: s.name,
        email: s.email,
        phone_up: s.phone,
        phone_crm: crmOpp.phone,
        stage_name: crmOpp.stage_name,
        date_created: crmOpp.date_created,
        signed_up: s.signed_up,
        belong_to_community: belongToCommunity,
        segment_key: s.segment_key || 'pequenos'
      });
    } else {
      brecha.push({
        user_id: s.user_id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        country: s.country,
        signed_up: s.signed_up,
        belong_to_community: belongToCommunity,
        segment_key: s.segment_key || 'pequenos'
      });
    }
  });

  crmOpps.forEach(o => {
    const email = (o.email || '').toLowerCase().trim();
    if (!upMap.has(email)) {
      manual.push({
        opportunity_name: o.opportunity_name,
        email: o.email,
        phone: o.phone,
        stage_name: o.stage_name,
        date_created: o.date_created,
        segment_key: o.segment_key || 'pequenos'
      });
    }
  });

  return NextResponse.json({
    monthly: mappedMonthly,
    segments6m: mappedSegments6m,
    monthlySegments: mappedMonthlySegments,
    pipelineMetrics: pipelineRes.data ?? [],
    timeMetrics: timeRes.data ?? [],
    weeklyData: mappedWeekly,
    liveCruce: {
      matched,
      brecha,
      manual,
      totalUserpilot: upSuppliers.length,
      totalCrm: crmOpps.length,
      comunidadCount,
      huerfanoCount
    }
  });
}

const ALLOWED_TABLES = [
  "ttv_monthly_data",
  "ttv_segments_6m",
  "ttv_monthly_segments",
  "ttv_pipeline_metrics",
  "ttv_time_metrics",
  "ttv_weekly_data",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

export async function PATCH(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const body = await req.json();
  const { table, id, updates } = body as { table: AllowedTable; id: string; updates: Record<string, unknown> };

  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const { error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

