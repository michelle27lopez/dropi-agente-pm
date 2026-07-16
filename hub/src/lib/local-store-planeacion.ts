import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

// Modo local temporal: mientras Michelle no tenga permiso para crear tablas
// en su Supabase, este archivo guarda las campañas de Planeación en disco
// (gitignored). Las rutas de /api/campaigns-planeacion/* intentan Supabase
// primero y caen aquí automáticamente si la tabla no existe todavía — no
// requiere ningún cambio de código cuando la migración 016 finalmente corra.

const STORE_PATH = path.join(process.cwd(), ".local-data", "campaigns-planeacion.json");

type Campaign = {
  id: string;
  name: string;
  status: "draft" | "in_progress" | "completed";
  current_node: number;
  created_at: string;
  updated_at: string;
};

type CampaignNode = {
  id: string;
  campaign_id: string;
  node_index: number;
  node_key: string;
  data: Record<string, string>;
  completed: boolean;
  updated_at: string;
};

type CampaignSend = {
  id: string;
  campaign_id: string;
  file_name: string;
  row_count: number;
  message: string;
  status: "sent" | "failed" | "not_configured";
  response_summary: string;
  created_at: string;
};

type Store = { campaigns: Campaign[]; nodes: CampaignNode[]; sends?: CampaignSend[] };

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return { campaigns: [], nodes: [], sends: [], ...parsed };
  } catch {
    return { campaigns: [], nodes: [], sends: [] };
  }
}

async function writeStore(store: Store) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function localListCampaigns(): Promise<Campaign[]> {
  const store = await readStore();
  return [...store.campaigns].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function localGetCampaign(id: string): Promise<Campaign | null> {
  const store = await readStore();
  return store.campaigns.find((c) => c.id === id) ?? null;
}

export async function localCreateCampaign(name: string): Promise<Campaign> {
  const store = await readStore();
  const now = new Date().toISOString();
  const campaign: Campaign = { id: randomUUID(), name, status: "draft", current_node: 0, created_at: now, updated_at: now };
  store.campaigns.push(campaign);
  await writeStore(store);
  return campaign;
}

export async function localUpdateCampaign(id: string, patch: Partial<Campaign>): Promise<Campaign | null> {
  const store = await readStore();
  const idx = store.campaigns.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  store.campaigns[idx] = { ...store.campaigns[idx], ...patch, updated_at: new Date().toISOString() };
  await writeStore(store);
  return store.campaigns[idx];
}

export async function localListNodes(campaignId: string): Promise<CampaignNode[]> {
  const store = await readStore();
  return store.nodes.filter((n) => n.campaign_id === campaignId).sort((a, b) => a.node_index - b.node_index);
}

export async function localUpsertNode(
  campaignId: string,
  body: { node_index: number; node_key: string; data: Record<string, string>; completed?: boolean }
): Promise<CampaignNode> {
  const store = await readStore();
  const idx = store.nodes.findIndex((n) => n.campaign_id === campaignId && n.node_index === body.node_index);
  const now = new Date().toISOString();
  if (idx >= 0) {
    store.nodes[idx] = { ...store.nodes[idx], data: body.data, completed: body.completed ?? true, updated_at: now };
    await writeStore(store);
    return store.nodes[idx];
  }
  const node: CampaignNode = {
    id: randomUUID(),
    campaign_id: campaignId,
    node_index: body.node_index,
    node_key: body.node_key,
    data: body.data,
    completed: body.completed ?? true,
    updated_at: now,
  };
  store.nodes.push(node);
  await writeStore(store);
  return node;
}

export async function localListSends(campaignId: string): Promise<CampaignSend[]> {
  const store = await readStore();
  return (store.sends ?? []).filter((s) => s.campaign_id === campaignId).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function localAddSend(
  campaignId: string,
  entry: Omit<CampaignSend, "id" | "campaign_id" | "created_at">
): Promise<CampaignSend> {
  const store = await readStore();
  const send: CampaignSend = { id: randomUUID(), campaign_id: campaignId, created_at: new Date().toISOString(), ...entry };
  store.sends = [...(store.sends ?? []), send];
  await writeStore(store);
  return send;
}
