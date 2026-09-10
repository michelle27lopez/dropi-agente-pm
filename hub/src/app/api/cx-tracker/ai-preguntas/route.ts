import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireUser } from "@/lib/require-auth";

// Sugiere preguntas de encuesta CES/CSAT adaptadas al objetivo de una revisión
// del CX Tracker — mismo patrón que ai-suggest (campaigns-planeacion) y
// ai-recommend (cx-tracker): gpt-4o-mini, prompt acotado a un único campo,
// sin inventar datos que el usuario no dio (2026-09-07, pedido de Diana).

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar OPENAI_API_KEY en el servidor." }, { status: 500 });
  }

  const body = await req.json();
  const { objetivo, proyecto, actividad } = body as { objetivo: string; proyecto?: string; actividad?: string };

  if (!objetivo || !objetivo.trim()) {
    return NextResponse.json({ error: "Escribe primero el objetivo de la revisión." }, { status: 400 });
  }

  const systemPrompt = `Eres un investigador de UX que ayuda a la célula Design Ops de Dropi (plataforma de dropshipping) a redactar encuestas de CES y CSAT adaptadas al objetivo de una revisión de seguimiento de producto.

Dado el objetivo de la revisión (qué se busca validar con los usuarios), propone:
1. Una pregunta de CES (Customer Effort Score) — escala 1 a 7, formato "¿Qué tan fácil/difícil fue [acción específica del objetivo]?", donde 7 es "muy fácil".
2. Una pregunta de CSAT (Customer Satisfaction) — escala 1 a 5 estrellas, formato "¿Qué tan satisfecho/a quedaste con [aspecto específico del objetivo]?", donde 4 y 5 cuentan como satisfechos.
3. El momento/punto de contacto ideal para enviar la encuesta (ej. "inmediatamente después de completar la acción", "24h después de la entrega").

Reglas:
- Responde en español, las preguntas deben mencionar la acción o funcionalidad concreta del objetivo, no genéricas ("¿qué tan fácil fue usar el producto?" es genérica y está prohibida si el objetivo da algo más específico).
- No inventes detalles del producto que no estén en el objetivo — si el objetivo es vago, la pregunta puede ser más general, pero nunca agregues funcionalidades no mencionadas.
- Responde ÚNICAMENTE en este formato JSON, sin texto adicional ni markdown: {"ces": "...", "csat": "...", "momento": "..."}`;

  const userPrompt = `Objetivo de la revisión${proyecto ? ` (proyecto: ${proyecto})` : ""}: ${objetivo}${actividad ? `\nActividad/tarea evaluada: ${actividad}` : ""}`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const raw = completion.choices[0]?.message?.content?.trim() || "{}";
    const parsed = JSON.parse(raw);
    return NextResponse.json({
      ces: parsed.ces ?? "",
      csat: parsed.csat ?? "",
      momento: parsed.momento ?? "",
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }
}
