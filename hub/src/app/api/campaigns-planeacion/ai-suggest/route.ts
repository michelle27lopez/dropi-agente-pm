import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { NODE_DEFINITIONS, NodeKey, NodeData } from "@/app/proyectos/dinamicas-catalogo/planeacion/nodes";

function formatContext(allData: Partial<Record<NodeKey, NodeData>>, skipNode: NodeKey, skipField: string): string {
  const lines: string[] = [];
  for (const node of NODE_DEFINITIONS) {
    const data = allData[node.key];
    if (!data) continue;
    for (const section of node.sections) {
      for (const field of section.fields) {
        if (node.key === skipNode && field.key === skipField) continue;
        const val = data[field.key];
        if (!val || !val.trim()) continue;
        lines.push(`- ${field.label}: ${val.includes("||") ? val.split("||").filter(Boolean).join(", ") : val}`);
      }
    }
  }
  return lines.length ? lines.join("\n") : "(todavía no se ha llenado nada más)";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar OPENAI_API_KEY en el servidor." }, { status: 500 });
  }

  const body = await req.json();
  const { nodeKey, fieldKey, fieldLabel, hint, placeholder, allData } = body as {
    nodeKey: NodeKey;
    fieldKey: string;
    fieldLabel: string;
    hint?: string;
    placeholder?: string;
    allData: Partial<Record<NodeKey, NodeData>>;
  };

  const context = formatContext(allData ?? {}, nodeKey, fieldKey);

  const systemPrompt = `Eres un asistente que ayuda a un Product Manager de Dropi (plataforma de dropshipping que conecta proveedores/suppliers con dropshippers) a redactar campos de un documento de planeación de una "dinámica de catálogo" (campaña que agrupa suppliers/productos con un incentivo, ej. visibilidad, remate o descuento, para mover órdenes).

Vas a redactar SOLO el campo "${fieldLabel}" usando el contexto que ya se definió de esta campaña. Reglas:
- Responde en español, tono directo y concreto, sin relleno ni frases genéricas de marketing.
- Si el campo pide números de resultados reales medidos (ej. órdenes, GMV, suppliers que respondieron), y esos números NO aparecen ya en el contexto, no los inventes — en su lugar responde exactamente: "Necesito los números reales para redactar esto — agrégalos en Métricas reales primero."
- Si el campo es una meta o hipótesis (algo que se define ANTES de que la campaña corra), sí puedes proponer un número razonable, pero dejándolo claro como propuesta a validar, no como dato medido.
- Responde ÚNICAMENTE con el texto final del campo. Sin comillas, sin encabezados, sin explicar lo que hiciste.`;

  const userPrompt = `Contexto ya definido de esta campaña:
${context}

Campo a redactar: "${fieldLabel}"
${hint ? `Instrucción para este campo: ${hint}` : ""}
${placeholder ? `Ejemplo de formato esperado: ${placeholder}` : ""}`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 350,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const suggestion = completion.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ suggestion });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }
}
