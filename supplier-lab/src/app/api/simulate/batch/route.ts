import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import OpenAI from "openai";

const PROFILES: Record<string, string> = {
  novato_offline: `
Eres "El Novato Offline": proveedor con baja madurez digital.
- Nunca has vendido en linea. Llegas recomendado por un conocido.
- No sabes que es stock minimo, SKU ni garantias de plataforma.
- Tu instinto es llenar solo el nombre y hacer clic en Guardar inmediatamente.
- Si ves mas de 2 errores al mismo tiempo, te frustras y abandonas.
- En un wizard paso a paso, sigues instrucciones si son simples y de una en una.`,
  experto_impaciente: `
Eres "El Experto Impaciente": proveedor con alta madurez digital.
- Has vendido en Mercado Libre y Shopify. Conoces los campos tipicos.
- Quieres completar el formulario en menos de 1 minuto.
- En pestanas libres navegas todas rapido y guardas sin problema.
- En un wizard secuencial te frustras porque te obliga a dar mas clics, aunque terminas.`,
};

const VARIANTS: Record<string, string> = {
  a_tabs: `
VARIANTE A — Pestanas de navegacion libre (flujo actual):
- El proveedor ve 4 pestanas: General, Stock, Imagenes, Garantias.
- Puede navegar en cualquier orden.
- Al guardar sin completar todo, recibe TODOS los errores al mismo tiempo:
  "Minimo 100 unidades", "Faltan 3 imagenes", "Garantias obligatorias sin marcar".`,
  b_wizard: `
VARIANTE B — Wizard secuencial con bloqueos:
- El proveedor avanza: Bodega -> General -> Stock -> Imagenes -> Garantias.
- Cada paso valida UNA sola regla antes de avanzar.
- Si no cumple, ve un solo mensaje claro y especifico.
- No puede saltarse pasos.`,
};

const SYSTEM_PROMPT = `Eres un agente de simulacion UX. Actua como un tester sintetico intentando
completar el flujo de alta de proveedor (supplier onboarding) en la plataforma Dropi.

Simula el comportamiento REAL del perfil: pensamientos, acciones, errores y resultado final.
Se especifico y realista, no generico. Varia tus respuestas aunque el perfil sea el mismo.

Devuelve UNICAMENTE un JSON valido con esta estructura, sin texto adicional:
{
  "result": "success" | "dropoff",
  "logs": [
    { "type": "thought" | "action" | "error" | "success", "text": "..." }
  ]
}

Reglas:
- Entre 5 y 9 entradas de log.
- thought: lo que piensa el usuario (primera persona, entre comillas).
- action: lo que hace el usuario (tercera persona).
- error: error del sistema o frustracion.
- success: mensaje final si completo el flujo.
- dropoff solo si abandona completamente.
- El novato abandona ante errores multiples. El experto siempre termina.`;

async function runSingleAgent(profile: string, variant: string): Promise<{
  profile: string;
  result: "success" | "dropoff";
  logs: { type: string; text: string }[];
}> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Perfil del tester:\n${PROFILES[profile]}\n\nFlujo de UI:\n${VARIANTS[variant]}\n\nSimula la sesion completa de este tester intentando crear su primer producto en Dropi.`,
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw);

  return {
    profile,
    result: parsed.result ?? "dropoff",
    logs: Array.isArray(parsed.logs) ? parsed.logs : [],
  };
}

const STOCHASTIC_METRICS = {
  a_tabs: { bodegaStartProb: 0.355, bodegaCompleteProb: 0.68, productStartProb: 0.86, productCompleteProb: 0.402 },
  b_wizard: { bodegaStartProb: 0.355, bodegaCompleteProb: 0.68, productStartProb: 0.86, productCompleteProb: 0.75 },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variant = "a_tabs", engine = "determinist", totalUsers = 2212, novatoCount = 2, expertoCount = 2 } = body;

    if (engine === "llm") {
      const agentProfiles = [
        ...Array(Number(novatoCount)).fill("novato_offline"),
        ...Array(Number(expertoCount)).fill("experto_impaciente"),
      ];

      const results = await Promise.all(
        agentProfiles.map(async (profile, i) => {
          const res = await runSingleAgent(profile, variant);
          return { ...res, id: i };
        })
      );

      const total = results.length;
      const completed = results.filter((r) => r.result === "success").length;

      const funnelPayload = {
        variant_name: variant,
        total_users_started: total,
        step_bodega_started: total,
        step_bodega_completed: total,
        step_product_started: total,
        step_product_completed: completed,
        engine,
      };

      if (supabase) {
        const { error } = await supabase.from("lab_simulation_runs").insert([funnelPayload]);
        if (error) console.error("Supabase insert error:", error);
      }

      return NextResponse.json({ status: "success", data: { ...funnelPayload, agents: results } });
    }

    // Motor deterministico (estocastico)
    const key = variant === "b_wizard" ? "b_wizard" : "a_tabs";
    const rates = STOCHASTIC_METRICS[key];

    let step_bodega_started = 0, step_bodega_completed = 0;
    let step_product_started = 0, step_product_completed = 0;

    for (let i = 0; i < totalUsers; i++) {
      if (Math.random() <= rates.bodegaStartProb) {
        step_bodega_started++;
        if (Math.random() <= rates.bodegaCompleteProb) {
          step_bodega_completed++;
          if (Math.random() <= rates.productStartProb) {
            step_product_started++;
            if (Math.random() <= rates.productCompleteProb) step_product_completed++;
          }
        }
      }
    }

    const payload = { variant_name: variant, total_users_started: totalUsers, step_bodega_started, step_bodega_completed, step_product_started, step_product_completed, engine };

    if (supabase) {
      const { error } = await supabase.from("lab_simulation_runs").insert([payload]);
      if (error) console.error("Supabase insert error:", error);
    }

    return NextResponse.json({ status: "success", data: payload });

  } catch (error) {
    console.error("[batch]", error);
    return NextResponse.json({ status: "error", message: "Error in bulk simulation" }, { status: 500 });
  }
}
