import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { query, deterministicResult, summaryStats } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API Key no configurada en el servidor. Verifica tu archivo .env.local" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const rawRecords = deterministicResult?.records || [];
    const slicedRecords = rawRecords.slice(0, 10);

    const systemPrompt = `Eres el Asistente Analítico de Datos del Hub de Dropi. Tu labor es responder la pregunta del usuario en español, basándote en la data estructurada y el resultado exacto pre-calculado por nuestro motor determinístico.

Información de la consulta actual:
- Pregunta del usuario: "${query}"
- Filtros aplicados por el motor: "${deterministicResult?.explanation || 'Ninguno'}"
- Conteo de registros que cumplen: ${deterministicResult?.count || 0}
- Proporción sobre el total: ${deterministicResult?.percentage || 0}%
- Registros específicos extraídos (Muestra de hasta 10 registros): ${JSON.stringify(slicedRecords)}

Estadísticas generales de la cohorte (últimos 90 días):
${JSON.stringify(summaryStats || {})}

Instrucciones de formato y tono:
1. Responde de forma muy natural, analítica, profesional y con un lenguaje fluido de negocios/dropshipping. Evita sonar monótono o repetitivo.
2. Explica brevemente qué filtros se aplicaron y el significado comercial del resultado (ej. "Hemos detectado un segmento de X proveedores en México...").
3. Si hay registros en el resultado, resalta los más importantes o haz una breve observación sobre su estado (ej. "Cristian Farias destaca con 📦10 productos creados...").
4. Aporta un pequeño insight comercial útil o recomendación accionable basado en el perfil (ej. "Se sugiere contactar prioritariamente a los que tienen cita pero catálogo vacío para brindar soporte en la carga de productos").
5. No inventes números o nombres que no estén explícitamente en la data provista. Sé relativamente conciso (máximo 2-3 párrafos cortos).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0].message?.content || "No pude generar una respuesta.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Error in OpenAI API route:", err);
    return NextResponse.json(
      { error: "Error procesando la solicitud con OpenAI: " + err.message },
      { status: 500 }
    );
  }
}
