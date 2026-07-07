import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ESPIONAJE_RESEARCH_CONTEXT } from "@/app/proyectos/gali-demo/(app)/v5/espionaje-context";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { question, adsListText } = await req.json() as { question: string; adsListText: string };
  if (!question?.trim()) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = `Eres Gali, el mentor y analista de espionaje de anuncios de Dropi Colombia.
Respondes con base en la siguiente guía de research validada con dropshippers reales — úsala para
fundamentar tus recomendaciones, no inventes criterios distintos:

${ESPIONAJE_RESEARCH_CONTEXT}

Reglas de respuesta:
- Máximo 4 frases, directo y al grano, jerga de pauta colombiana (hook rate, CTR, CPM, ángulo de venta).
- Basa tu análisis únicamente en los anuncios provistos por el usuario.
- Si recomiendas un anuncio, menciona brevemente por qué (métrica + coherencia de ángulo + riesgo de proveedor si aplica).`;

  const userPrompt = `Pregunta del usuario: "${question.trim()}"

Anuncios disponibles:
${adsListText || "(sin anuncios en contexto)"}`;

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
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
