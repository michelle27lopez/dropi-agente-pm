import { NextResponse } from "next/server";
import OpenAI from "openai";
import { requireUser } from "@/lib/require-auth";

const PROFILES: Record<string, string> = {
  novato_offline: `
Eres "El Novato Offline": proveedor con baja madurez digital.
- Nunca has vendido en linea. Llegas recomendado por un conocido.
- No sabes que es "stock minimo", "SKU" ni "garantias de plataforma".
- Tu instinto es llenar solo el nombre del producto y hacer clic en Guardar inmediatamente.
- Si ves mas de 2 errores al mismo tiempo, te frustras y abandonas.
- En un wizard paso a paso, sigues instrucciones si son simples y de una en una.`,

  experto_impaciente: `
Eres "El Experto Impaciente": proveedor con alta madurez digital.
- Has vendido en Mercado Libre y Shopify. Conoces los campos tipicos.
- Quieres completar el formulario en menos de 1 minuto.
- En pestanas libres navegas todas rapido y guardas sin problema.
- En un wizard secuencial te frustras porque te obliga a dar mas clics de los necesarios,
  aunque lo terminas con friccion baja.`,
};

const VARIANTS: Record<string, string> = {
  a_tabs: `
VARIANTE A — Pestanas de navegacion libre (flujo actual):
- El proveedor ve 4 pestanas: General, Stock, Imagenes, Garantias.
- Puede navegar entre ellas en cualquier orden.
- Al hacer clic en "Guardar" sin completar todo, recibe TODOS los errores al mismo tiempo:
  "Minimo 100 unidades", "Faltan 3 imagenes", "Garantias obligatorias sin marcar".`,

  b_wizard: `
VARIANTE B — Wizard secuencial con bloqueos:
- El proveedor avanza paso a paso: Bodega -> General -> Stock -> Imagenes -> Garantias.
- Cada paso valida UNA sola regla antes de avanzar.
- Si no cumple, ve un solo mensaje claro y especifico.
- No puede saltarse pasos.`,
};

const SYSTEM_PROMPT = `Eres un agente de simulacion UX. Tu trabajo es actuar como un tester sintetico que intenta
completar el flujo de alta de proveedor (supplier onboarding) en la plataforma Dropi.

Simula el comportamiento REAL de ese perfil: sus pensamientos, acciones, errores y resultado final.
Se especifico y realista, no generico.

Devuelve UNICAMENTE un JSON valido con esta estructura, sin texto adicional:
{
  "result": "success" | "dropoff",
  "logs": [
    { "type": "thought" | "action" | "error" | "success", "text": "..." }
  ]
}

Reglas:
- Entre 6 y 10 entradas de log.
- "thought": lo que el usuario piensa (primera persona, entre comillas).
- "action": lo que el usuario hace (tercera persona).
- "error": error del sistema o frustracion del usuario.
- "success": mensaje final si completo el flujo.
- "dropoff" solo si el usuario abandona completamente.
- El novato abandona ante errores multiples. El experto siempre termina.`;

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const body = await request.json();
    const { profile, variant } = body;

    const profileDesc = PROFILES[profile];
    const variantDesc = VARIANTS[variant];

    if (!profileDesc || !variantDesc) {
      return NextResponse.json({ status: "error", message: "Perfil o variante invalidos" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Perfil del tester:
${profileDesc}

Flujo de UI:
${variantDesc}

Simula la sesion completa de este tester intentando crear su primer producto en Dropi.`,
        },
      ],
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const parsed = JSON.parse(raw);

    if (!parsed.result || !Array.isArray(parsed.logs)) {
      return NextResponse.json({ status: "error", message: "Respuesta del LLM con formato invalido" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", result: parsed.result, logs: parsed.logs });

  } catch (error) {
    console.error("[simulate/llm]", error);
    return NextResponse.json({ status: "error", message: "Error en el motor LLM" }, { status: 500 });
  }
}
