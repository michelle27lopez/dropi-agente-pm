// PR-M1 · Contexto total. Ensambla el "system" del chat por capas
import { CAUSA_LABEL, subPerfilLabel, transitionLabel } from "./doctrina";
import { getContextDocuments } from "./contextStore";

const causeLabel = (c: any) => (c ? (CAUSA_LABEL[c as keyof typeof CAUSA_LABEL] ?? c) : "sin causa");

export function patternDigest(patterns: any[] = []): string {
  if (!patterns.length) {
    return "Aún no hay patrones aprendidos. Se destilan al cerrar ciclos en F5.";
  }
  return patterns.map((p) => {
    const tipo = p.tipo === "anti_patron" ? "ANTI-PATRÓN" : "PATRÓN";
    const sub = p.sub_perfil ? subPerfilLabel(p.sub_perfil) : "sin sub-perfil";
    const trans = p.transicion ? ` · ${transitionLabel(p.transicion)}` : "";
    const delta = p.delta_metrica ? ` (${p.delta_metrica})` : "";
    const usos = p.veces_reutilizado ? ` · usado ${p.veces_reutilizado}×` : "";
    const learn = p.aprendizaje ? `: ${p.aprendizaje}` : "";
    return `- [${tipo}] ${causeLabel(p.causa)} · ${sub}${trans} — "${p.nombre ?? "sin nombre"}"${learn}${delta}${usos}`;
  }).join("\n");
}

export function decisionsDigest(decisions: any[] = [], limit = 30): string {
  if (!decisions.length) return "Aún no hay decisiones ni aprendizajes registrados.";
  return decisions.slice(-limit).reverse().map((d) => {
    const fecha = d.fecha ? String(d.fecha).slice(0, 10) : "";
    const causa = d.causa ? ` · ${causeLabel(d.causa)}` : "";
    const sub = d.sub_perfil ? ` · ${subPerfilLabel(d.sub_perfil)}` : "";
    return `- (${fecha}) [${d.tipo ?? "aprendizaje"}]${causa}${sub}: ${d.texto ?? ""}`;
  }).join("\n");
}

export function cyclesIndex(cycles: any[] = [], activeId: string | null = null): string {
  const others = cycles.filter((c) => c.id !== activeId);
  if (!others.length) return "No hay otros ciclos registrados.";
  return others.map((c) => {
    const fase = c.fase_actual ?? c.activePhase ?? "F0";
    const estado = c.estado ?? "activo";
    const decision = c.resultado_cierre ? ` → ${c.resultado_cierre}` : "";
    return `- "${c.title ?? "sin título"}" · ${fase} · ${causeLabel(c.causa)} · ${estado}${decision}`;
  }).join("\n");
}

export function activeCycleBlock(cycle: any): string | null {
  if (!cycle) return null;
  return JSON.stringify({
    fase: cycle.fase_actual ?? cycle.activePhase,
    sub_perfil: cycle.sub_perfil,
    transicion: cycle.transicion,
    causa: cycle.causa,
    causa_source: cycle.causa_source,
    brief: cycle.brief,
    riesgos: cycle.risks,
    estado: cycle.estado,
  }, null, 2);
}

function tableToText(table: any): string {
  if (!table?.columns?.length) return "";
  const head = table.columns.join(" | ");
  const rows = (table.rows ?? []).map((r: any) => r.join(" | ")).join("\n");
  return `${head}\n${rows}`;
}

export async function businessContextBlock(): Promise<string> {
  const { documents } = await getContextDocuments();
  return documents.map((d) => {
    const table = d.table ? `\n${tableToText(d.table)}` : "";
    return `### ${d.title}\n${d.content}${table}`;
  }).join("\n\n");
}

export interface PromptBlock {
  type: string;
  text: string;
  cache_control?: {
    type: string;
  };
}

export async function assembleSystemContext({
  systemPrompt,
  cycle,
  patterns = [],
  cycles = [],
  decisions = [],
  businessContext,
}: {
  systemPrompt?: string;
  cycle?: any;
  patterns?: any[];
  cycles?: any[];
  decisions?: any[];
  businessContext?: string;
} = {}): Promise<PromptBlock[]> {
  let negocio = businessContext;
  if (negocio === undefined) {
    try { negocio = await businessContextBlock(); } catch { negocio = ""; }
  }

  const blocks: PromptBlock[] = [{ type: "text", text: systemPrompt ?? "" }];
  if (negocio) {
    blocks.push({ type: "text", text: `## CONTEXTO DE NEGOCIO (Dropi)\n${negocio}`, cache_control: { type: "ephemeral" } });
  } else {
    blocks[0].cache_control = { type: "ephemeral" };
  }

  const memoria = [
    `## MEMORIA DEL EQUIPO — PATRONES Y ANTI-PATRONES\nAntes de proponer una intervención, revisa si ya existe un patrón (o anti-patrón) aplicable a este sub-perfil/causa y díselo al usuario.\n${patternDigest(patterns)}`,
    `## DECISIONES Y APRENDIZAJES\n${decisionsDigest(decisions)}`,
    `## OTROS CICLOS (portafolio)\n${cyclesIndex(cycles, cycle?.id)}`,
  ];
  const active = activeCycleBlock(cycle);
  if (active) memoria.push(`## CICLO ACTIVO\n${active}`);
  blocks.push({ type: "text", text: memoria.join("\n\n") });

  return blocks;
}
