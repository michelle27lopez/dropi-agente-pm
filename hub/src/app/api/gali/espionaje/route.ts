import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ESPIONAJE_RESEARCH_CONTEXT } from "@/app/proyectos/gali-demo/(app)/v5/espionaje-context";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

// Público a propósito (demo de Gali para dropshippers). Sin login, así que
// el único freno contra abuso de costo de OpenAI es este rate-limit por IP.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`gali-espionaje:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Demasiadas solicitudes, intenta de nuevo en un minuto" }, { status: 429 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { question, adsListText } = await req.json() as { question: string; adsListText: string };
  if (!question?.trim()) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  // Sin tope, el rate-limit de 10 req/min no acota el costo por minuto si
  // los prompts son enormes. Ver AGP-07/AGP-23.
  const boundedQuestion = question.trim().slice(0, 4000);
  const boundedAdsListText = (adsListText ?? "").slice(0, 4000);

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `Eres Gali, el mentor y analista de espionaje de anuncios de Dropi Colombia.
Respondes con base en la siguiente guía de research validada con dropshippers reales — úsala para
fundamentar tus recomendaciones, no inventes criterios distintos:

${ESPIONAJE_RESEARCH_CONTEXT}

Reglas de respuesta:
- Máximo 4 frases, directo y al grano, jerga de pauta colombiana (hook rate, CTR, CPM, ángulo de venta).
- Basa tu análisis únicamente en los anuncios provistos por el usuario.
- Si recomiendas un anuncio, menciona brevemente por qué (métrica + coherencia de ángulo + riesgo de proveedor si aplica).`;

  const userPrompt = `Pregunta del usuario: "${boundedQuestion}"

Anuncios disponibles:
${boundedAdsListText || "(sin anuncios en contexto)"}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = completion.choices[0].message?.content?.trim() ?? "";
    return NextResponse.json({ content });
  } catch (err: unknown) {
    console.error("[Gali Espionaje Error]:", err);
    return NextResponse.json(
      { error: "Error interno generando la respuesta" },
      { status: 500 }
    );
  }
}
