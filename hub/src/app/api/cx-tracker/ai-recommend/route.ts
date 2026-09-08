import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireUser } from "@/lib/require-auth";

type BugStatus = "proceso" | "bloqueado" | "resuelto";
interface BugItem { id: string; tipo: string; desc: string; status: BugStatus }
interface Usuarios { perfil: string; perfilOtro: string; cantidad: string; notas: string }
interface MetricRow {
  fecha: string; objetivo: string; actividad: string; usuarios: Usuarios;
  adopcion: string; retencion: string; cesScore: string; csatScore: string;
  hallazgos: string; dolores: string; bugs: BugItem[]; proximosPasos: string;
}

const PHASE_LABEL: Record<"m1" | "m2" | "m3", string> = {
  m1: "M1 · Semanal", m2: "M2 · Quincenal", m3: "M3 · Mensual",
};

function formatRow(row: MetricRow, phase: "m1" | "m2" | "m3", i: number): string {
  const lines: string[] = [`### ${PHASE_LABEL[phase]} — revisión ${i + 1} (${row.fecha || "sin fecha"})`];
  if (row.objetivo) lines.push(`Objetivo: ${row.objetivo}`);
  if (row.actividad) lines.push(`Actividad evaluada: ${row.actividad}`);
  if (row.usuarios?.perfil || row.usuarios?.cantidad) {
    lines.push(`Usuarios: ${row.usuarios.perfil || "—"}${row.usuarios.cantidad ? ` (n=${row.usuarios.cantidad})` : ""}${row.usuarios.notas ? ` — ${row.usuarios.notas}` : ""}`);
  }
  const metricas = [
    row.adopcion && `Adopción ${row.adopcion}%`,
    row.retencion && `Retención ${row.retencion}%`,
    row.cesScore && `CES ${row.cesScore}/7`,
    row.csatScore && `CSAT ${row.csatScore}%`,
  ].filter(Boolean);
  if (metricas.length) lines.push(`Métricas: ${metricas.join(" · ")}`);
  if (row.hallazgos) lines.push(`Hallazgos: ${row.hallazgos}`);
  if (row.dolores) lines.push(`Dolores: ${row.dolores}`);
  if (row.bugs?.length) {
    lines.push(`Bugs: ${row.bugs.map((b) => `[${b.status}] ${b.tipo || "sin tipo"} — ${b.desc || "sin descripción"}`).join("; ")}`);
  }
  if (row.proximosPasos) lines.push(`Próximos pasos que ya se habían definido: ${row.proximosPasos}`);
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar OPENAI_API_KEY en el servidor." }, { status: 500 });
  }

  const body = await req.json();
  const { projectName, projectCode, m1, m2, m3 } = body as {
    projectName: string; projectCode: string;
    m1: MetricRow[]; m2: MetricRow[]; m3: MetricRow[];
  };

  const bloques: string[] = [];
  (m1 ?? []).forEach((r, i) => bloques.push(formatRow(r, "m1", i)));
  (m2 ?? []).forEach((r, i) => bloques.push(formatRow(r, "m2", i)));
  (m3 ?? []).forEach((r, i) => bloques.push(formatRow(r, "m3", i)));

  if (bloques.length === 0) {
    return NextResponse.json({ recommendation: "Aún no hay suficiente información registrada en M1/M2/M3 para generar una recomendación." });
  }

  const historial = bloques.join("\n\n");

  const systemPrompt = `Eres un analista senior de producto que acompaña a la célula Experience de Dropi (plataforma de dropshipping) en el seguimiento de CX de funcionalidades ya lanzadas.

Vas a leer TODO el historial de revisiones M1 (semanal), M2 (quincenal) y M3 (mensual) registradas hasta ahora para un proyecto — métricas (adopción, retención, CES, CSAT), hallazgos, dolores, bugs y los próximos pasos que ya se habían definido en revisiones anteriores. Tu trabajo es sintetizar qué se aprendió a lo largo de TODO ese historial (no solo la última revisión) y recomendar próximos pasos concretos para la siguiente revisión.

Reglas:
- Responde en español, tono directo de PM senior, sin relleno ni frases genéricas.
- Basa cada recomendación en evidencia concreta del historial — cita el dato o hallazgo que la sustenta.
- Si un bug o dolor aparece sin resolver en más de una revisión, señálalo explícitamente como recurrente/bloqueante y priorízalo.
- Si detectas una tendencia entre revisiones (una métrica que mejora o empeora, un hallazgo que se repite), dilo explícitamente.
- No inventes números que no estén en el historial — si falta un dato para una recomendación cuantitativa, dilo en vez de inventarlo.
- Formato de salida: 3 a 5 viñetas ("- "), la más urgente primero. Sin encabezados, sin explicar lo que hiciste, sin comillas envolventes.`;

  const userPrompt = `Proyecto: ${projectName}${projectCode ? ` (${projectCode})` : ""}

Historial completo de revisiones registradas:

${historial}

Con base en TODO este historial, ¿cuáles son los próximos pasos recomendados?`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const recommendation = completion.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ recommendation });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }
}
