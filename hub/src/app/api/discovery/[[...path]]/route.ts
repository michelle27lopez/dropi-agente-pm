import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";
import crypto from "node:crypto";
import { load, save, backendInfo } from "@/lib/product-lens/persistence";
import { getContextDocuments, updateContextDocument } from "@/lib/product-lens/contextStore";
import { assembleSystemContext } from "@/lib/product-lens/memory";
import { acceptRisk, getMissingGateRequirements, getGateRequirements, PHASES } from "@/lib/product-lens/phaseEngine";
import { looksLikeFeature, applyBriefUpdates, resolveRisk } from "@/lib/product-lens/cycleLogic";
import { TRANSITIONS, SUB_CAUSA, Phase, normalizeSubPerfil, normalizeTransition, normalizeCausa, normalizeSubCausa, patternTypeFromDecision, normalizeSesgo, normalizeTestElegido, FASE_LABEL } from "@/lib/product-lens/doctrina";

// Default stepper phases seed
const defaultPhases = (startPhase: Phase = "F0") => {
  const order = ["F0", "F1", "F2", "F3", "F4", "F5"] as const;
  const startIdx = order.indexOf(startPhase);
  return order.map((key, i) => ({
    key,
    label: FASE_LABEL[key],
    state: i === startIdx ? "active" : i < startIdx ? "done" : "todo",
    skipped: i < startIdx ? true : false,
    note: i < startIdx ? "salteado por inicio en Validar" : "",
  }));
};

// parseDurationMs converts duration strings to ms
function parseDurationMs(duracion: any): number | null {
  const raw = typeof duracion === "string" ? duracion : duracion?.value;
  if (typeof raw !== "string") return null;
  const m = raw.toLowerCase().match(/(\d+(?:[.,]\d+)?)\s*(dias?|d\b|semanas?|sem\b|horas?|h\b)?/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  const unit = m[2] ?? "d";
  const DAY = 24 * 60 * 60 * 1000;
  if (unit.startsWith("sem")) return n * 7 * DAY;
  if (unit.startsWith("h")) return n * 60 * 60 * 1000;
  return n * DAY;
}

// Helper to check user auth from Supabase and map their role to 'admin' or 'pm'
async function getCurrentUser() {
  if (!supabase) return { email: "local-pm@dropi.co", role: "admin" }; // Local fallback if Supabase not configured

  try {
    const authClient = await createServerSupabase();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_super_admin")
      .eq("id", user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email ?? "pm@dropi.co",
      role: profile?.is_super_admin ? "admin" : "pm",
    };
  } catch (err) {
    console.error("[Discovery API] Auth check failed, using fallback:", err);
    return null;
  }
}

// Global OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// OpenAI forced tool schema for brief extraction (Fase 1)
const BRIEF_EXTRACTION_TOOL = {
  type: "function" as const,
  function: {
    name: "update_brief",
    description: "Extrae campos del Intervention Brief a partir de la conversación de producto (metodología B=MAP). Devuelve SOLO los campos con evidencia clara; omite los demás.",
    parameters: {
      type: "object",
      properties: {
        behavior_statement: { type: "string", description: "Comportamiento objetivo: quién hace qué, cuándo, y no hace qué hoy." },
        transicion: { type: "string", enum: TRANSITIONS, description: "Transición cognitiva objetivo." },
        segmento_objetivo: { type: "string", description: "Segmento: cohorte conductual concreta (ej. 'sellers inactivos 30d')." },
        causa: { type: "string", enum: ["M", "A", "P"], description: "Causa B=MAP: M=Motivación, A=Ability, P=Prompt." },
        sub_causa: { 
          type: "string", 
          enum: [...SUB_CAUSA.M, ...SUB_CAUSA.A, ...SUB_CAUSA.P], 
          description: "Sub-causa opcional: M (motivacion/confianza/incentivo), A (claridad/capacidad/friccion), P (timing/visibilidad/ausencia)." 
        },
        evidencia_primaria: { type: "string", description: "Evidencia cuantitativa primaria del comportamiento." },
        segunda_fuente: { type: "string", description: "Segunda fuente de evidencia (triangulación)." },
        intervencion: { type: "string", description: "La intervención diseñada para atacar la causa confirmada (F2)." },
        hipotesis: { type: "string", description: "Hipótesis de intervención falsable." },
        senal_cuantitativa: { type: "string", description: "Métrica de éxito / señal cuantitativa objetivo." },
      },
    },
  },
};

// LLM extraction using OpenAI function calling
async function extractBriefUpdates(cycle: any, userMessage: string, reply: string) {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const context = JSON.stringify({
      fase: cycle.fase_actual ?? cycle.activePhase,
      brief_actual: cycle.brief ?? {},
      sub_perfil: cycle.sub_perfil,
      transicion: cycle.transicion,
      causa: cycle.causa,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un extractor de datos clínicos y precisos de producto. Extrae la información basada únicamente en el diálogo provisto."
        },
        {
          role: "user",
          content: `Contexto del ciclo:\n${context}\n\n` +
                   `Último turno de la conversación:\nUsuario: ${userMessage}\nAsistente: ${reply}\n\n` +
                   `Extrae los campos del brief que se puedan inferir con evidencia. No inventes campos.`
        }
      ],
      tools: [BRIEF_EXTRACTION_TOOL],
      tool_choice: { type: "function", function: { name: "update_brief" } },
      temperature: 0.1,
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0] as any;
    if (toolCall && toolCall.function) {
      return JSON.parse(toolCall.function.arguments);
    }
    return null;
  } catch (err: any) {
    console.warn("[Discovery API] Brief extraction failed:", err.message);
    return null;
  }
}

// LLM summary generation for closed cycles (F5) using OpenAI
async function generateExecutiveSummary(cycle: any, closeMeta: any) {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const b = cycle.brief ?? {};
    const context = JSON.stringify({
      titulo: cycle.title,
      comportamiento: b.behavior_statement?.value ?? null,
      segmento: cycle.segmento_objetivo ?? null,
      sub_perfil: cycle.sub_perfil ?? null,
      causa: cycle.causa ?? null,
      evidencia: [b.evidencia_primaria?.value, b.segunda_fuente?.value].filter(Boolean),
      intervencion: b.intervencion?.value ?? null,
      hipotesis: b.hipotesis?.value ?? null,
      experimento: cycle.experiment ?? null,
      decision: closeMeta.decision,
      aprendizaje: closeMeta.learning,
      delta_metrica: closeMeta.delta,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Escribe un resumen ejecutivo de 4 a 6 frases para este ciclo de producto cerrado " +
                   "(metodología B=MAP), en español, dirigido a un stakeholder que no participó en el " +
                   "ciclo. Prosa corrida, sin bullets ni encabezados. Cubre: qué comportamiento se " +
                   "atacó y en quién, por qué no ocurría (causa), qué se probó, qué resultó y qué se " +
                   "decidió. No inventes datos que no estén en el contexto.\n\n" +
                   `Datos del ciclo:\n${context}`,
        }
      ],
      temperature: 0.5,
    });

    return completion.choices[0].message.content?.trim() || null;
  } catch (err: any) {
    console.warn("[Discovery API] Executive summary generation failed:", err.message);
    return null;
  }
}

// Log audit events to local storage
async function logAudit(actor: string, action: string, refId: string, metadata: any = {}) {
  try {
    const auditEvents = await load("audit_events");
    auditEvents.push({
      id: `audit-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      refId,
      metadata,
    });
    await save("audit_events", auditEvents);
  } catch (err: any) {
    console.warn("[Discovery API] Could not write audit log:", err.message);
  }
}

// Main Dynamic Route Handler
export async function GET(req: NextRequest, context: any) {
  const params = await context.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pathSegments = params.path ?? [];
  const root = pathSegments[0];

  // 1. GET /api/discovery/auth/me
  if (root === "auth" && pathSegments[1] === "me") {
    return NextResponse.json({
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
    });
  }

  // 2. GET /api/discovery/context
  if (root === "context" && pathSegments.length === 1) {
    try {
      const data = await getContextDocuments();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // 3. GET /api/discovery/cycles
  if (root === "cycles" && pathSegments.length === 1) {
    const projectId = req.nextUrl.searchParams.get("projectId") || req.nextUrl.searchParams.get("project_id");
    const list = await load("cycles");
    if (projectId) {
      // Filter cycles by associated project
      const filtered = list.filter((c: any) => c.project_id === projectId || c.projectId === projectId);
      return NextResponse.json(filtered);
    }
    return NextResponse.json(list);
  }

  // 4. GET /api/discovery/cycles/[id]/gate
  if (root === "cycles" && pathSegments[2] === "gate") {
    const id = pathSegments[1];
    const cyclesList = await load("cycles");
    const cycle = cyclesList.find((c) => c.id === id);
    if (!cycle) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const phase = req.nextUrl.searchParams.get("phase") || cycle.fase_actual || "F0";
    const missing = getMissingGateRequirements(cycle, phase as Phase);
    return NextResponse.json({
      phase,
      ok: missing.length === 0,
      missing,
      requirements: getGateRequirements(cycle, phase as Phase),
    });
  }

  // 5. GET /api/discovery/patterns
  if (root === "patterns") {
    const list = await load("patterns");
    return NextResponse.json(list);
  }

  // 6. GET /api/discovery/decisions
  if (root === "decisions") {
    const list = await load("decisions");
    return NextResponse.json(list);
  }

  // 7. GET /api/discovery/analytics
  if (root === "analytics" && pathSegments.length === 1) {
    const cyclesList = await load("cycles");
    const auditEvents = await load("audit_events");
    const patternsList = await load("patterns");
    const decisionsList = await load("decisions");

    const total = cyclesList.length;
    const closed = cyclesList.filter((c) => c.estado === "cerrado").length;
    const active = total - closed;

    const countEvents = (action: string) => auditEvents.filter((e) => e.action === action).length;

    const summary = {
      cycles: { total, active, closed },
      patterns: { total: patternsList.length, reusable: patternsList.filter((p) => p.tipo === "patron").length },
      decisions: { total: decisionsList.length },
      chat: { messages: countEvents("chat_message"), briefExtractions: countEvents("brief_extracted") },
    };

    return NextResponse.json({ summary });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function POST(req: NextRequest, context: any) {
  const params = await context.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pathSegments = params.path ?? [];
  const root = pathSegments[0];

  // 1. POST /api/discovery/auth/login (dummy)
  if (root === "auth" && pathSegments[1] === "login") {
    return NextResponse.json({ token: "darwin-integrated-token" });
  }

  // 2. POST /api/discovery/cycles
  if (root === "cycles" && pathSegments.length === 1) {
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: "title required" }, { status: 400 });

    const coldStart = body.fase_actual === "F3" && body.cold_start === true;
    let startPhase: Phase = "F0";
    if (coldStart) startPhase = "F3";
    else if (body.fase_actual && PHASES.includes(body.fase_actual as Phase)) startPhase = body.fase_actual as Phase;

    const featureFramed = !coldStart && looksLikeFeature(body.title);
    if (!body.force && featureFramed) {
      await logAudit(currentUser.email, "behavior_rejected", "new", { reason: "feature", title: body.title });
      return NextResponse.json({
        error: "Eso es una solución, no un comportamiento.",
        reason: "feature",
        hint: "Describe qué seller, haciendo qué, no está haciendo qué. Empieza por el comportamiento, no por la feature.",
      }, { status: 422 });
    }

    const now = new Date().toISOString();
    const pId = body.project_id || body.projectId || null;
    let cycle: any = {
      id: `cycle-${crypto.randomUUID()}`,
      project_id: pId,
      projectId: pId,
      title: body.title,
      sub_perfil: normalizeSubPerfil(body.sub_perfil),
      segmento_objetivo: body.segmento_objetivo ?? null,
      transicion: normalizeTransition(body.transicion),
      sub_causa: normalizeSubCausa(body.sub_causa, body.causa),
      causa: body.causa ?? null,
      causa_source: body.causa_source ?? null,
      sesgo: null,
      proxy_y_segunda_senal: null,
      fase_actual: startPhase,
      cold_start: coldStart,
      estado: "activo",
      resultado_cierre: null,
      risks: [],
      brief: body.brief ?? {},
      experiment: body.experiment ?? {},
      spec_conductual: null,
      cierre: null,
      messages: [],
      phases: body.phases ?? defaultPhases(startPhase),
      activePhase: startPhase,
      riskAccepted: false,
      createdAt: now,
      updatedAt: now,
      last_activity_at: now,
      createdBy: currentUser.id,
    };

    if (coldStart) {
      cycle = acceptRisk(cycle, "F3", "Ciclo cold-start: arrancó directo en F3 (Validar) sin diagnóstico previo (F0–F2). El supuesto a validar no viene de una causa B=MAP confirmada.", { id: currentUser.id, name: currentUser.email });
      cycle.riskAccepted = true;
      await logAudit(currentUser.email, "cycle_cold_started", cycle.id, { title: body.title });
    }

    if (featureFramed && body.force) {
      cycle = acceptRisk(cycle, "F0", "Ciclo creado con encuadre de feature (guardrail conducta-vs-feature anulado). El comportamiento a intervenir no quedó explícito de entrada.", { id: currentUser.id, name: currentUser.email });
      cycle.riskAccepted = true;
      await logAudit(currentUser.email, "behavior_override", cycle.id, { title: body.title });
    }

    const cyclesList = await load("cycles");
    cyclesList.push(cycle);
    await save("cycles", cyclesList);
    await logAudit(currentUser.email, "cycle_created", cycle.id);
    return NextResponse.json(cycle, { status: 201 });
  }

  // 3. POST /api/discovery/cycles/[id]/advance
  if (root === "cycles" && pathSegments[2] === "advance") {
    const id = pathSegments[1];
    const cyclesList = await load("cycles");
    const idx = cyclesList.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cycle = cyclesList[idx];
    if (cycle.estado && cycle.estado !== "activo") return NextResponse.json({ error: "Cycle is closed" }, { status: 409 });

    const body = await req.json();
    const current = cycle.fase_actual ?? "F0";
    const idxPhase = PHASES.indexOf(current);
    if (idxPhase < 0 || idxPhase >= PHASES.length - 1) return NextResponse.json({ error: "Cannot advance from this phase" }, { status: 400 });

    const next = PHASES[idxPhase + 1];
    const missing = getMissingGateRequirements(cycle, current);
    const withRisk = body.risk === true;

    if (missing.length && !withRisk) {
      return NextResponse.json({ error: "Gate not met", phase: current, missing }, { status: 422 });
    }

    const now = new Date().toISOString();
    let riskAccepted = cycle.riskAccepted ?? false;
    let updatedCycle = { ...cycle };

    if (missing.length && withRisk) {
      const riskText = body.riskText?.trim() || `Avance de ${current} con gate incompleto: ${missing.map((m) => m.message).join(" ")}`;
      updatedCycle = acceptRisk(updatedCycle, current, riskText, { id: currentUser.id, name: currentUser.email });
      riskAccepted = true;
    }

    const phases = (updatedCycle.phases ?? []).map((p: any) => {
      if (p.key === current) return { ...p, state: "done", skipped: missing.length > 0 && withRisk ? true : p.skipped, note: missing.length && withRisk ? "riesgo aceptado" : "completo" };
      if (p.key === next) return { ...p, state: "active" };
      return p;
    });

    updatedCycle.fase_actual = next;
    updatedCycle.activePhase = next;
    updatedCycle.phases = phases;
    updatedCycle.riskAccepted = riskAccepted;
    updatedCycle.updatedAt = now;
    updatedCycle.last_activity_at = now;

    if (next === "F4" && !updatedCycle.experiment?.started_at) {
      updatedCycle.experiment = { ...(updatedCycle.experiment ?? {}), started_at: now };
    }

    cyclesList[idx] = updatedCycle;
    await save("cycles", cyclesList);
    await logAudit(currentUser.email, "phase_advanced", id, { from: current, to: next, risk: missing.length > 0 && withRisk });
    return NextResponse.json(updatedCycle);
  }

  // 4. POST /api/discovery/cycles/[id]/risks/[riskId]/resolve
  if (root === "cycles" && pathSegments[2] === "risks" && pathSegments[4] === "resolve") {
    const id = pathSegments[1];
    const riskId = pathSegments[3];
    const cyclesList = await load("cycles");
    const idx = cyclesList.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cycle = cyclesList[idx];
    const res = resolveRisk(cycle, riskId, { id: currentUser.id, name: currentUser.email });
    if (!res.found) return NextResponse.json({ error: "Risk not found" }, { status: 404 });

    cyclesList[idx] = res.cycle;
    await save("cycles", cyclesList);
    await logAudit(currentUser.email, "risk_resolved", id, { riskId });
    return NextResponse.json(res.cycle);
  }

  // 5. POST /api/discovery/cycles/[id]/close
  if (root === "cycles" && pathSegments[2] === "close") {
    const id = pathSegments[1];
    const cyclesList = await load("cycles");
    const idx = cyclesList.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cycle = cyclesList[idx];
    if (cycle.estado && cycle.estado !== "activo") return NextResponse.json({ error: "Cycle is closed" }, { status: 409 });

    const body = await req.json();
    const decision = String(body.decision ?? body.resultado_cierre ?? "").trim() || null;
    
    if (decision === "iterar") {
      const now = new Date().toISOString();
      const phases = (cycle.phases ?? []).map((p: any) =>
        p.key === "F1" ? { ...p, state: "active", note: "iteración" } : { ...p, state: p.key === "F0" ? "done" : "todo" });
      const iterated = {
        ...cycle,
        fase_actual: "F1",
        activePhase: "F1",
        phases,
        iterated: true,
        iterationCount: (cycle.iterationCount ?? 1) + 1,
        riskAccepted: true,
        updatedAt: now,
        last_activity_at: now,
      };
      cyclesList[idx] = iterated;
      await save("cycles", cyclesList);

      const decisionsList = await load("decisions");
      const dec = {
        id: `dec-${crypto.randomUUID()}`,
        cycleId: id,
        fecha: now,
        tipo: "decision",
        causa: cycle.causa,
        sub_perfil: cycle.sub_perfil,
        texto: `Iterar (iteración ${iterated.iterationCount}) en "${cycle.title}": de vuelta a F1 para re-diagnosticar.`,
        actor: currentUser.email,
      };
      decisionsList.push(dec);
      await save("decisions", decisionsList);

      await logAudit(currentUser.email, "cycle_iterated", id, { iterationCount: iterated.iterationCount });
      return NextResponse.json({ cycle: iterated, iterated: true });
    }

    if (!body.learning?.trim() || !(body.patternName || body.pattern_name)?.trim()) {
      return NextResponse.json({ error: "learning and pattern_name required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    let updatedCycle = { ...cycle };

    // 2D - no-peeking
    let peeking = false;
    const currentPhase = updatedCycle.fase_actual ?? updatedCycle.activePhase;
    const durMs = parseDurationMs(updatedCycle.experiment?.duracion);
    const startedAt = updatedCycle.experiment?.started_at ? Date.parse(updatedCycle.experiment.started_at) : null;
    if (currentPhase === "F4" && durMs && startedAt && (Date.now() - startedAt) < durMs) {
      const elapsedD = Math.floor((Date.now() - startedAt) / 86400000);
      const totalD = Math.round(durMs / 86400000);
      peeking = true;
      updatedCycle = acceptRisk(updatedCycle, "F4", `Cierre temprano (peeking): experimento leído en el día ${elapsedD} de ${totalD} declarados. La decisión puede estar contaminada por ruido.`, { id: currentUser.id, name: currentUser.email });
      await logAudit(currentUser.email, "experiment_peeked", id, { elapsedDays: elapsedD, declaredDays: totalD });
    }

    // Cierre sin completar gates previos
    const skippedGates = ["F1", "F2", "F3", "F4"]
      .filter((ph) => getMissingGateRequirements(updatedCycle, ph as Phase).length > 0);
    if (skippedGates.length) {
      updatedCycle = acceptRisk(updatedCycle, "F5", `Cierre sin completar gates previos: ${skippedGates.join(", ")}. El patrón se destila de un recorrido incompleto.`, { id: currentUser.id, name: currentUser.email });
      await logAudit(currentUser.email, "cycle_closed_skipping_gates", id, { skipped: skippedGates });
    }

    const pType = patternTypeFromDecision(decision ?? "");
    let pattern: any = null;

    if (pType) {
      pattern = {
        id: `pat-${crypto.randomUUID()}`,
        tipo: pType,
        nombre: body.patternName || body.pattern_name || `Patrón de ${cycle.title}`,
        causa: cycle.causa,
        sub_perfil: (cycle.sub_perfil && String(cycle.sub_perfil).trim()) || "sin_clasificar",
        transicion: cycle.transicion,
        test_elegido: normalizeTestElegido(cycle.experiment?.test_elegido) ?? null,
        aprendizaje: body.learning.trim(),
        delta_metrica: body.delta?.trim() || null,
        evidencia: body.evidencia?.trim() || null,
        ciclo_origen_id: id,
        veces_reutilizado: 0,
        createdAt: now,
        createdBy: currentUser.id,
      };
      const patternsList = await load("patterns");
      patternsList.push(pattern);
      await save("patterns", patternsList);
      await logAudit(currentUser.email, "pattern_created", pattern.id, { cycleId: id });
    }

    const execSummary = await generateExecutiveSummary(updatedCycle, body);

    const closeObj = {
      closedAt: now,
      closedBy: { id: currentUser.id, name: currentUser.email },
      decision: decision ?? "[CONFIRMAR]",
      learning: body.learning.trim(),
      delta: body.delta?.trim() || null,
      metric_result: body.metric_result ?? null,
      actividad: body.actividad?.trim() || null,
      outcome: body.outcome?.trim() || null,
      churn_por_nivel: body.churn_por_nivel?.trim() || null,
      pattern_id: pattern?.id ?? null,
      summary: execSummary || "Sin resumen ejecutivo.",
    };

    const phases = (updatedCycle.phases ?? []).map((p: any) => 
      p.key === "F5" ? { ...p, state: "done", note: "completo" } : p.state === "active" ? { ...p, state: "done" } : p
    );

    updatedCycle = {
      ...updatedCycle,
      estado: "cerrado",
      fase_actual: "F5",
      activePhase: "F5",
      resultado_cierre: decision,
      cierre: closeObj,
      phases,
      updatedAt: now,
      last_activity_at: now,
    };

    cyclesList[idx] = updatedCycle;
    await save("cycles", cyclesList);

    // Write decision to durable ledger (durable log)
    const decisionsList = await load("decisions");
    const dec = {
      id: `dec-${crypto.randomUUID()}`,
      cycleId: id,
      fecha: now,
      tipo: "decision",
      causa: cycle.causa,
      sub_perfil: cycle.sub_perfil,
      texto: `${decision ? decision.toUpperCase() : "[CONFIRMAR]"} "${cycle.title}": ${body.learning.trim()}${body.delta?.trim() ? ` (${body.delta.trim()})` : ""}`,
      actor: currentUser.email,
    };
    decisionsList.push(dec);
    await save("decisions", decisionsList);

    await logAudit(currentUser.email, "cycle_closed", id, { decision: decision });
    return NextResponse.json({ cycle: updatedCycle, pattern, peeking });
  }

  // 6. POST /api/discovery/patterns
  if (root === "patterns" && pathSegments.length === 1) {
    const body = await req.json();
    const now = new Date().toISOString();
    const pattern = {
      id: `pat-${crypto.randomUUID()}`,
      tipo: body.tipo || "patron",
      nombre: body.nombre || "Nuevo Patrón",
      causa: body.causa || "M",
      sub_perfil: body.sub_perfil || "sin_clasificar",
      transicion: body.transicion || null,
      aprendizaje: body.aprendizaje || "",
      delta_metrica: body.delta_metrica || "",
      veces_reutilizado: 0,
      createdAt: now,
      createdBy: currentUser.id,
    };

    const patternsList = await load("patterns");
    patternsList.push(pattern);
    await save("patterns", patternsList);
    await logAudit(currentUser.email, "pattern_created", pattern.id);
    return NextResponse.json(pattern, { status: 201 });
  }

  // 7. POST /api/discovery/patterns/[id]/reuse
  if (root === "patterns" && pathSegments[2] === "reuse") {
    const patId = pathSegments[1];
    const patternsList = await load("patterns");
    const idx = patternsList.findIndex((p) => p.id === patId);
    if (idx === -1) return NextResponse.json({ error: "Pattern not found" }, { status: 404 });

    const pat = patternsList[idx];
    pat.veces_reutilizado = (pat.veces_reutilizado ?? 0) + 1;
    await save("patterns", patternsList);

    // Create a new cycle prefilled with the pattern's causa/sub_perfil
    const now = new Date().toISOString();
    const newCycle = {
      id: `cycle-${crypto.randomUUID()}`,
      title: `Intervención basada en: ${pat.nombre}`,
      causa: pat.causa,
      causa_source: "pm_confirmed", // Already validated by reusing pattern
      sub_perfil: pat.sub_perfil,
      transicion: pat.transicion,
      fase_actual: "F0",
      estado: "activo",
      risks: [],
      brief: {
        causa: { value: pat.causa, confirmed: true, source: "pattern_reuse" },
      },
      experiment: {},
      messages: [],
      phases: defaultPhases(),
      createdAt: now,
      updatedAt: now,
      last_activity_at: now,
      createdBy: currentUser.id,
    };

    const cyclesList = await load("cycles");
    cyclesList.push(newCycle);
    await save("cycles", cyclesList);
    await logAudit(currentUser.email, "pattern_reused", patId, { newCycleId: newCycle.id });
    return NextResponse.json({ pattern: pat, newCycle }, { status: 201 });
  }

  // 8. POST /api/discovery/decisions
  if (root === "decisions" && pathSegments.length === 1) {
    const body = await req.json();
    const now = new Date().toISOString();
    const dec = {
      id: `dec-${crypto.randomUUID()}`,
      cycleId: body.cycleId || null,
      fecha: now,
      tipo: body.tipo || "aprendizaje",
      causa: body.causa || null,
      sub_perfil: body.sub_perfil || null,
      texto: body.texto,
      actor: currentUser.email,
    };

    const decisionsList = await load("decisions");
    decisionsList.push(dec);
    await save("decisions", decisionsList);
    await logAudit(currentUser.email, "decision_recorded", dec.id);
    return NextResponse.json(dec, { status: 201 });
  }

  // 9. POST /api/discovery/chat
  if (root === "chat" && pathSegments.length === 1) {
    const body = await req.json();
    const { message, cycleId } = body;
    if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "[AI no configurada - agrega la API Key de OpenAI al .env.local] Recibí tu mensaje pero el asistente no tiene cerebro." });
    }

    const cyclesList = await load("cycles");
    const cycle = cycleId ? cyclesList.find((c) => c.id === cycleId) : null;

    // Load full system prompt
    let systemPrompt = "Eres un asistente de producto de Dropi.";
    try {
      const fs = require("fs/promises");
      const path = require("path");
      systemPrompt = await fs.readFile(path.join(process.cwd(), "00_Orquestador.md"), "utf8");
    } catch {}

    const patternsList = await load("patterns");
    const decisionsList = await load("decisions");

    const history = (cycle?.messages ?? []).slice(-20).map((m: any) => ({ role: m.role, content: m.content }));
    const systemBlocks = await assembleSystemContext({
      systemPrompt,
      cycle,
      patterns: patternsList,
      cycles: cyclesList,
      decisions: decisionsList,
    });
    
    // Concat system prompt blocks
    const fullSystemPrompt = systemBlocks.map((b) => b.text).join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: fullSystemPrompt },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content || "Sin respuesta del modelo.";

    // Persist chat turn and extract updates
    let extractionChanged: string[] = [];
    if (cycle) {
      const now = new Date().toISOString();
      cycle.messages = cycle.messages ?? [];
      cycle.messages.push({ id: `msg-${crypto.randomUUID()}`, role: "user", content: message, fase: cycle.fase_actual || "F0", created_at: now });
      cycle.messages.push({ id: `msg-${crypto.randomUUID()}`, role: "assistant", content: reply, fase: cycle.fase_actual || "F0", created_at: now });
      cycle.last_activity_at = now;

      // Extract brief updates from user message & assistant reply
      const updates = await extractBriefUpdates(cycle, message, reply);
      const applied = applyBriefUpdates(cycle, updates);
      
      const idx = cyclesList.findIndex((c) => c.id === cycleId);
      if (idx !== -1) {
        cyclesList[idx] = { ...applied.cycle, updatedAt: now };
        await save("cycles", cyclesList);
      }
      extractionChanged = applied.changed;
    }

    await logAudit(currentUser.email, "chat_message", cycleId || "global");
    if (extractionChanged.length) {
      await logAudit(currentUser.email, "brief_extracted", cycleId || "global", { fields: extractionChanged });
    }

    return NextResponse.json({ reply, changed: extractionChanged });
  }

  // 10. POST /api/discovery/chat/stream (SSE streaming)
  if (root === "chat" && pathSegments[1] === "stream") {
    const body = await req.json();
    const { message, cycleId } = body;
    if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    const cyclesList = await load("cycles");
    const cycle = cycleId ? cyclesList.find((c) => c.id === cycleId) : null;

    let systemPrompt = "Eres un asistente de producto de Dropi.";
    try {
      const fs = require("fs/promises");
      const path = require("path");
      systemPrompt = await fs.readFile(path.join(process.cwd(), "00_Orquestador.md"), "utf8");
    } catch {}

    const patternsList = await load("patterns");
    const decisionsList = await load("decisions");

    const history = (cycle?.messages ?? []).slice(-20).map((m: any) => ({ role: m.role, content: m.content }));
    const systemBlocks = await assembleSystemContext({
      systemPrompt,
      cycle,
      patterns: patternsList,
      cycles: cyclesList,
      decisions: decisionsList,
    });
    const fullSystemPrompt = systemBlocks.map((b) => b.text).join("\n\n");

    const encoder = new TextEncoder();
    
    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        if (!apiKey) {
          const reply = "[AI no configurada - agrega la API Key de OpenAI al .env.local] Recibí tu mensaje pero el asistente no tiene cerebro.";
          for (const word of reply.split(/(?<=\s)/)) {
            send("token", { t: word });
            await new Promise((r) => setTimeout(r, 20));
          }
          send("done", { ok: true, changed: [] });
          controller.close();
          return;
        }

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: fullSystemPrompt },
              ...history,
              { role: "user", content: message }
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
          });

          let reply = "";
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              reply += content;
              send("token", { t: content });
            }
          }

          let extractionChanged: string[] = [];
          if (cycle) {
            const now = new Date().toISOString();
            cycle.messages = cycle.messages ?? [];
            cycle.messages.push({ id: `msg-${crypto.randomUUID()}`, role: "user", content: message, fase: cycle.fase_actual || "F0", created_at: now });
            cycle.messages.push({ id: `msg-${crypto.randomUUID()}`, role: "assistant", content: reply, fase: cycle.fase_actual || "F0", created_at: now });
            cycle.last_activity_at = now;

            const updates = await extractBriefUpdates(cycle, message, reply);
            const applied = applyBriefUpdates(cycle, updates);
            
            const idx = cyclesList.findIndex((c) => c.id === cycleId);
            if (idx !== -1) {
              cyclesList[idx] = { ...applied.cycle, updatedAt: now };
              await save("cycles", cyclesList);
            }
            extractionChanged = applied.changed;
          }

          await logAudit(currentUser.email, "chat_message", cycleId || "global");
          if (extractionChanged.length) {
            await logAudit(currentUser.email, "brief_extracted", cycleId || "global", { fields: extractionChanged });
          }

          send("done", { ok: true, changed: extractionChanged });
          controller.close();
        } catch (err: any) {
          console.error("[Discovery SSE] Streaming error:", err);
          send("error", { error: "Stream error", detail: err.message });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function PATCH(req: NextRequest, context: any) {
  const params = await context.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pathSegments = params.path ?? [];
  const root = pathSegments[0];

  // 1. PATCH /api/discovery/context/[id]
  if (root === "context" && pathSegments.length === 2) {
    const id = decodeURIComponent(pathSegments[1]);
    const body = await req.json();
    try {
      const updated = await updateContextDocument(id, body, currentUser.role);
      await logAudit(currentUser.email, "context_updated", id);
      return NextResponse.json(updated);
    } catch (err: any) {
      const code = err.statusCode || 500;
      return NextResponse.json({ error: err.message }, { status: code });
    }
  }

  // 2. PATCH /api/discovery/cycles/[id]
  if (root === "cycles" && pathSegments.length === 2) {
    const id = pathSegments[1];
    const cyclesList = await load("cycles");
    const idx = cyclesList.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cycle = cyclesList[idx];
    if (cycle.estado && cycle.estado !== "activo") return NextResponse.json({ error: "Cycle is closed" }, { status: 409 });

    const body = await req.json();
    const now = new Date().toISOString();

    // Evitar avance directo de fase
    if ("fase_actual" in body || "activePhase" in body) {
      const requested = body.fase_actual ?? body.activePhase;
      const currentIdx = PHASES.indexOf(cycle.fase_actual ?? cycle.activePhase ?? "F0");
      const requestedIdx = PHASES.indexOf(requested);
      if (requestedIdx > currentIdx) {
        return NextResponse.json({ error: "No se puede avanzar de fase por PATCH directo — usa POST /api/cycles/:id/advance (aplica el gate)." }, { status: 422 });
      }
    }

    // Normalizadores
    if ("sub_perfil" in body) body.sub_perfil = normalizeSubPerfil(body.sub_perfil);
    if ("transicion" in body) body.transicion = normalizeTransition(body.transicion);
    if ("sub_causa" in body) body.sub_causa = normalizeSubCausa(body.sub_causa, body.causa ?? cycle.causa);

    // Use deepMerge for nested updates (journeys, brief, experiment)
    const merged = {
      ...cycle,
      title: body.title !== undefined ? body.title : cycle.title,
      sub_perfil: body.sub_perfil !== undefined ? body.sub_perfil : cycle.sub_perfil,
      transicion: body.transicion !== undefined ? body.transicion : cycle.transicion,
      causa: body.causa !== undefined ? normalizeCausa(body.causa) : cycle.causa,
      sub_causa: body.sub_causa !== undefined ? body.sub_causa : cycle.sub_causa,
      sesgo: body.sesgo !== undefined ? normalizeSesgo(body.sesgo) : cycle.sesgo,
      proxy_y_segunda_senal: body.proxy_y_segunda_senal !== undefined ? body.proxy_y_segunda_senal : cycle.proxy_y_segunda_senal,
      segmento_objetivo: body.segmento_objetivo !== undefined ? body.segmento_objetivo : cycle.segmento_objetivo,
      fase_actual: body.fase_actual !== undefined ? body.fase_actual : cycle.fase_actual,
      activePhase: body.activePhase !== undefined ? body.activePhase : cycle.activePhase,
      brief: body.brief !== undefined ? { ...(cycle.brief ?? {}), ...body.brief } : cycle.brief,
      experiment: body.experiment !== undefined ? { ...(cycle.experiment ?? {}), ...body.experiment } : cycle.experiment,
      spec_conductual: body.spec_conductual !== undefined ? (typeof body.spec_conductual === "object" ? { ...(cycle.spec_conductual ?? {}), ...body.spec_conductual } : body.spec_conductual) : cycle.spec_conductual,
      phases: body.phases !== undefined ? body.phases : cycle.phases,
      riskAccepted: body.riskAccepted !== undefined ? body.riskAccepted : cycle.riskAccepted,
      updatedAt: now,
      last_activity_at: now,
    };

    cyclesList[idx] = merged;
    await save("cycles", cyclesList);
    await logAudit(currentUser.email, "cycle_patched", id);
    return NextResponse.json(merged);
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}
