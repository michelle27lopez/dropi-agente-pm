import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORY_LABELS: Record<string, string> = {
  ropa: "Ropa y accesorios",
  tech: "Tecnología",
  cosméticos: "Cosméticos y cuidado",
  cosmeticos: "Cosméticos y cuidado",
  hogar: "Hogar y decoración",
};

const CATEGORY_PRODUCTS: Record<string, string> = {
  ropa: "blusas de lino, camisetas premium y accesorios de moda",
  tech: "audífonos inalámbricos, cargadores y accesorios para celular",
  cosmeticos: "cremas hidratantes, sérum facial y productos naturales de cuidado",
  cosméticos: "cremas hidratantes, sérum facial y productos naturales de cuidado",
  hogar: "lámparas decorativas LED, organizadores y accesorios para el hogar",
};

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { matchId, userRole } = await req.json();
  // userRole = who the human IS. AI plays the opposite.
  const aiRole = userRole === "supplier" ? "dropshipper" : "supplier";

  // Get match for category
  const { data: match } = await supabase
    .from("activa_demo_matches")
    .select("category")
    .eq("id", matchId)
    .single();

  if (!match) return NextResponse.json({ error: "match not found" }, { status: 404 });

  const catLabel = CATEGORY_LABELS[match.category] ?? match.category;
  const catProducts = CATEGORY_PRODUCTS[match.category] ?? "productos variados";

  // Get last 10 messages for context
  const { data: messages } = await supabase
    .from("activa_demo_messages")
    .select("sender_role, content")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true })
    .limit(10);

  const history = messages ?? [];

  const systemPrompt = aiRole === "dropshipper"
    ? `Eres un dropshipper activo en Dropi Colombia. Llevas 8 meses vendiendo online y buscas nuevos proveedores de ${catLabel} (${catProducts}).
Eres directo, emprendedor y práctico. Haces preguntas concretas sobre precio, stock, tiempo de despacho y márgenes.
Responde en español informal colombiano, máximo 2-3 líneas. No uses tu nombre ni digas que eres IA.
Muestra interés genuino. Si te dan precios, negocia un poco. Si hablan de productos, pide más detalles.`
    : `Eres un proveedor activo en Dropi Colombia. Vendes ${catProducts} y tienes stock disponible.
Despachas en 48 horas desde Cali. Llevas 2 años en el negocio y conoces bien el mercado.
Eres amable, propositivo y abierto a negociar. Cuando pregunten por precios, da rangos concretos.
Responde en español informal colombiano, máximo 2-3 líneas. No uses tu nombre ni digas que eres IA.
Muestra entusiasmo por trabajar juntos y ofrece condiciones especiales para primeros pedidos.`;

  // Map history to OpenAI format
  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = history.map((m) => ({
    role: m.sender_role === userRole ? "user" : "assistant",
    content: m.content,
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...openaiMessages],
      max_tokens: 120,
      temperature: 0.85,
    });

    const aiContent = completion.choices[0]?.message?.content ?? "Cuéntame más, estoy interesado.";

    // Save AI message
    const { data: saved } = await supabase
      .from("activa_demo_messages")
      .insert({ match_id: matchId, sender_role: "ai", content: aiContent })
      .select()
      .single();

    return NextResponse.json({ ok: true, message: saved });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
