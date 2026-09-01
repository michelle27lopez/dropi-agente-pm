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
  /** Nombre del hito/mensaje que se envió (ver CampaignMessage en nodes.ts) — solo para mostrarlo en el historial, no afecta el envío. */
  message_label?: string | null;
  status: "sent" | "failed" | "not_configured";
  response_summary: string;
  created_at: string;
};

export type SupplierStatus = "contactado" | "respondio" | "aplico" | "activo";
export const SUPPLIER_STATUS_ORDER: SupplierStatus[] = ["contactado", "respondio", "aplico", "activo"];

/**
 * Token del proveedor de pruebas de Cyber Days. No es un proveedor real: se
 * excluye de los contadores del panel y de los dos CSV (el de selecciones y,
 * sobre todo, el de links — ese se usa para la convocatoria y no debe llevar
 * el link de QA a nadie).
 */
export const QA_ELIGIBLE_TOKEN = "qa-cyberdays";

type SupplierContact = { label: string; sent_at: string };

type CampaignSupplier = {
  id: string;
  campaign_id: string;
  identifier: string;
  data: Record<string, string | number>;
  status: SupplierStatus;
  /** Nota rápida de seguimiento, escrita a mano por quien gestiona la campaña. */
  note?: string;
  /** Qué mensajes se le enviaron y cuándo — se acumula, un envío nunca borra el anterior. */
  contacts?: SupplierContact[];
  created_at: string;
  updated_at: string;
};

// `image` es opcional a propósito: hoy la data no trae foto, pero Michelle
// confirmó que el export product_id → image_url sí va a llegar. Cuando
// llegue, se rellena este campo y la página lo muestra sin cambio de código
// (mientras tanto cae al ícono por categoría).
export type EligibleProduct = { id: string | number; name: string; category?: string; stock?: number; image?: string };

// Checklist de preparación una vez aprobados los productos (fase "fotos"):
// nombre y categoría se marcan en Dropi, la foto va a dos lugares (edición
// del producto + Canva). Es autorreporte del proveedor, no algo que el
// sistema pueda verificar — igual que "Revisa que estén en buen estado" en
// la fase de selección, no fingimos una validación que no existe.
export type ReadyChecklistKey = "nombre" | "categoria" | "fotoDropi" | "fotoCanva";
export type ReadyChecklist = Partial<Record<ReadyChecklistKey, boolean>>;

// Feedback opcional del proveedor al cerrar la campaña ("ayúdanos a
// mejorar") — rating 1-5 obligatorio, comentario libre opcional. Se guarda
// una sola vez por proveedor (la pantalla de cierre no deja reenviar).
export type CampaignFeedback = { rating: number; comment?: string; submitted_at: string };

/**
 * Lista de productos elegibles por proveedor — la página pública de
 * "productos elegibles" la busca por `token` (no por ID de proveedor, para
 * que un proveedor no pueda ver la lista de otro cambiando el número en la
 * URL). El token es opaco, generado al armar el Excel agrupado.
 */
export type EligibleEntry = {
  token: string;
  campaign_id: string;
  supplier_id: string;
  supplier_name: string;
  products: EligibleProduct[];
  /** IDs que el proveedor eligió postular (hasta 10) — reemplaza al formulario de Google. */
  selectedProductIds?: (string | number)[];
  submitted_at?: string | null;
  /**
   * Última vez que el proveedor editó su selección DESPUÉS de la postulación
   * original — la selección es editable hasta que cierra la ventana. Null si
   * nunca la ajustó; `submitted_at` conserva siempre la fecha del primer envío.
   */
  selection_updated_at?: string | null;
  /**
   * Momento en que el equipo aprobó la curaduría de este proveedor — evento
   * real disparado desde el panel interno, no una fecha del calendario. La
   * página pública solo muestra "aprobado" y desbloquea la fase de fotos
   * cuando esto existe; es también el momento del WhatsApp masivo.
   */
  approved_at?: string | null;
  readyChecklist?: ReadyChecklist;
  feedback?: CampaignFeedback;
  /** Veces que se cargó la página pública de este proveedor (GET real, no los
   * fetches internos de otros endpoints al leer la misma fila). */
  view_count?: number;
  first_viewed_at?: string | null;
  last_viewed_at?: string | null;
  /** Clics registrados en el link del Meet de la campaña (señal automática,
   * no confirma asistencia real — ver meet_attended). */
  meet_click_count?: number;
  meet_first_clicked_at?: string | null;
  meet_last_clicked_at?: string | null;
  /** Confirmación manual del comercial de que el proveedor sí asistió al Meet. */
  meet_attended?: boolean;
  meet_attended_marked_at?: string | null;
  /** Clics en el botón "Agendarme" del mensaje de WhatsApp (vía /c/[token]?meet=1),
   * separado de meet_click_count porque ese es del botón de adentro del panel —
   * se quiere saber cuántos vinieron de cada canal. */
  meet_rsvp_click_count?: number;
  meet_rsvp_first_clicked_at?: string | null;
  meet_rsvp_last_clicked_at?: string | null;
  updated_at: string;
};

/** Órdenes generadas por producto dentro de una campaña — cargado a mano o por CSV, no hay integración en vivo con órdenes reales de Dropi. */
export type ProductOrderEntry = {
  campaign_id: string;
  product_id: string;
  product_name?: string;
  orders_count: number;
  source: "manual" | "import";
  updated_at: string;
};

type Store = {
  campaigns: Campaign[]; nodes: CampaignNode[]; sends?: CampaignSend[]; suppliers?: CampaignSupplier[];
  eligibleProducts?: EligibleEntry[]; productOrders?: ProductOrderEntry[];
};

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return { campaigns: [], nodes: [], sends: [], suppliers: [], eligibleProducts: [], ...parsed };
  } catch {
    return { campaigns: [], nodes: [], sends: [], suppliers: [], eligibleProducts: [] };
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

export async function localListSuppliers(campaignId: string): Promise<CampaignSupplier[]> {
  const store = await readStore();
  return (store.suppliers ?? []).filter((s) => s.campaign_id === campaignId).sort((a, b) => a.identifier.localeCompare(b.identifier));
}

// Upsert por (campaign_id, identifier): un supplier que reaparece en un envío
// posterior no pierde el estado de seguimiento que ya tenía (nunca se
// "des-avanza" solo por volver a aparecer en un Excel). Si viene messageLabel,
// se agrega a `contacts` — así queda registro de qué se le mandó y cuándo,
// no solo su estado actual.
export async function localUpsertSuppliers(
  campaignId: string,
  rows: { identifier: string; data: Record<string, string | number> }[],
  messageLabel?: string | null
): Promise<CampaignSupplier[]> {
  const store = await readStore();
  const now = new Date().toISOString();
  store.suppliers = store.suppliers ?? [];
  for (const row of rows) {
    if (!row.identifier?.trim()) continue;
    const idx = store.suppliers.findIndex((s) => s.campaign_id === campaignId && s.identifier === row.identifier);
    const newContact: SupplierContact[] = messageLabel ? [{ label: messageLabel, sent_at: now }] : [];
    if (idx >= 0) {
      const existing = store.suppliers[idx];
      store.suppliers[idx] = { ...existing, data: row.data, contacts: [...(existing.contacts ?? []), ...newContact], updated_at: now };
    } else {
      store.suppliers.push({
        id: randomUUID(),
        campaign_id: campaignId,
        identifier: row.identifier,
        data: row.data,
        status: "contactado",
        contacts: newContact,
        created_at: now,
        updated_at: now,
      });
    }
  }
  await writeStore(store);
  return store.suppliers.filter((s) => s.campaign_id === campaignId);
}

export async function localUpdateSupplierStatus(
  campaignId: string,
  supplierId: string,
  status: SupplierStatus
): Promise<CampaignSupplier | null> {
  const store = await readStore();
  const idx = (store.suppliers ?? []).findIndex((s) => s.id === supplierId && s.campaign_id === campaignId);
  if (idx < 0 || !store.suppliers) return null;
  store.suppliers[idx] = { ...store.suppliers[idx], status, updated_at: new Date().toISOString() };
  await writeStore(store);
  return store.suppliers[idx];
}

export async function localUpdateSupplierNote(
  campaignId: string,
  supplierId: string,
  note: string
): Promise<CampaignSupplier | null> {
  const store = await readStore();
  const idx = (store.suppliers ?? []).findIndex((s) => s.id === supplierId && s.campaign_id === campaignId);
  if (idx < 0 || !store.suppliers) return null;
  store.suppliers[idx] = { ...store.suppliers[idx], note, updated_at: new Date().toISOString() };
  await writeStore(store);
  return store.suppliers[idx];
}

// A diferencia de localUpdateSupplierStatus (cambio manual explícito, se
// respeta siempre), este lo usa el webhook entrante del CRM — un evento
// repetido o fuera de orden (reintento, retraso de red) no debe hacer
// retroceder un estado que ya avanzó más.
export async function localApplySupplierEvent(
  campaignId: string,
  identifier: string,
  status: SupplierStatus
): Promise<CampaignSupplier> {
  const store = await readStore();
  const now = new Date().toISOString();
  store.suppliers = store.suppliers ?? [];
  const idx = store.suppliers.findIndex((s) => s.campaign_id === campaignId && s.identifier === identifier);

  if (idx >= 0) {
    const current = store.suppliers[idx];
    if (SUPPLIER_STATUS_ORDER.indexOf(status) > SUPPLIER_STATUS_ORDER.indexOf(current.status)) {
      store.suppliers[idx] = { ...current, status, updated_at: now };
      await writeStore(store);
    }
    return store.suppliers[idx];
  }

  const created: CampaignSupplier = {
    id: randomUUID(),
    campaign_id: campaignId,
    identifier,
    data: {},
    status,
    created_at: now,
    updated_at: now,
  };
  store.suppliers.push(created);
  await writeStore(store);
  return created;
}

// Reemplaza toda la lista de elegibles de la campaña — se re-arma completa
// cada vez que se regenera el Excel agrupado (nunca hay que hacer merge
// campo por campo, el token cambia si el archivo se vuelve a generar).
export async function localSeedEligibleProducts(
  campaignId: string,
  entries: Omit<EligibleEntry, "campaign_id" | "updated_at">[]
): Promise<void> {
  const store = await readStore();
  const now = new Date().toISOString();
  const others = (store.eligibleProducts ?? []).filter((e) => e.campaign_id !== campaignId);
  const fresh: EligibleEntry[] = entries.map((e) => ({ ...e, campaign_id: campaignId, updated_at: now }));
  store.eligibleProducts = [...others, ...fresh];
  await writeStore(store);
}

export async function localGetEligibleByToken(
  campaignId: string,
  token: string
): Promise<EligibleEntry | null> {
  const store = await readStore();
  return (store.eligibleProducts ?? []).find((e) => e.campaign_id === campaignId && e.token === token) ?? null;
}

// Contraparte de supabaseGetEligibleByTokenOnly: busca por token sin
// necesitar el campaign_id, para resolver el link corto /c/[token].
export async function localGetEligibleByTokenOnly(token: string): Promise<EligibleEntry | null> {
  const store = await readStore();
  return (store.eligibleProducts ?? []).find((e) => e.token === token) ?? null;
}

export async function localListEligibleProducts(campaignId: string): Promise<EligibleEntry[]> {
  const store = await readStore();
  return (store.eligibleProducts ?? [])
    .filter((e) => e.campaign_id === campaignId)
    .sort((a, b) => a.supplier_name.localeCompare(b.supplier_name));
}

// El proveedor postula desde su propia página pública (token), no desde un
// form aparte — reemplaza la selección completa cada vez que envía (no hace
// merge), así siempre refleja su elección más reciente. La selección es
// editable hasta el cierre de la ventana (eso lo valida el endpoint):
// el primer envío fija `submitted_at`, los siguientes solo mueven
// `selection_updated_at`.
export async function localSetEligibleSelection(
  campaignId: string,
  token: string,
  productIds: (string | number)[]
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  const prev = store.eligibleProducts[idx];
  store.eligibleProducts[idx] = {
    ...prev,
    selectedProductIds: productIds,
    submitted_at: prev.submitted_at ?? new Date().toISOString(),
    selection_updated_at: prev.submitted_at ? new Date().toISOString() : null,
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Aprueba la curaduría de un proveedor. Solo aplica si postuló (no tiene
// sentido aprobar a quien no envió selección) y es idempotente: aprobar dos
// veces no cambia la fecha original.
export async function localApproveEligible(
  campaignId: string,
  token: string
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  const entry = store.eligibleProducts[idx];
  if (!entry.submitted_at) return entry;
  if (!entry.approved_at) {
    store.eligibleProducts[idx] = { ...entry, approved_at: new Date().toISOString() };
    await writeStore(store);
  }
  return store.eligibleProducts[idx];
}

// Invalida el link actual de un proveedor y le asigna uno nuevo — para
// cuando un link se filtró o el proveedor lo perdió. `newToken` lo genera el
// endpoint (mismo formato en Supabase y local, no cada store por su cuenta).
export async function localResetEligibleToken(
  campaignId: string,
  oldToken: string,
  newToken: string
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === oldToken);
  if (idx < 0 || !store.eligibleProducts) return null;
  store.eligibleProducts[idx] = { ...store.eligibleProducts[idx], token: newToken, updated_at: new Date().toISOString() };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Devuelve la fila al estado inicial SIN cambiar el token — pensado para el
// proveedor de QA (token fijo `qa-cyberdays`), que se reusa una y otra vez.
// Distinto de localResetEligibleToken: ahí lo que cambia es el link; aquí el
// link es justamente lo único que se conserva, junto con el catálogo.
export async function localResetEligibleEstado(
  campaignId: string,
  token: string
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  const prev = store.eligibleProducts[idx];
  store.eligibleProducts[idx] = {
    campaign_id: prev.campaign_id,
    token: prev.token,
    supplier_id: prev.supplier_id,
    supplier_name: prev.supplier_name,
    products: prev.products,
    updated_at: new Date().toISOString(),
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Aprobación masiva: todos los que postularon y aún no están aprobados.
// Devuelve cuántos se aprobaron en esta pasada.
export async function localApproveAllEligible(campaignId: string): Promise<number> {
  const store = await readStore();
  const now = new Date().toISOString();
  let count = 0;
  store.eligibleProducts = (store.eligibleProducts ?? []).map((e) => {
    if (e.campaign_id !== campaignId || !e.submitted_at || e.approved_at) return e;
    count += 1;
    return { ...e, approved_at: now };
  });
  if (count > 0) await writeStore(store);
  return count;
}

// Registra una carga real de la página pública — se llama solo desde el GET
// de /elegibles/[token] (la página que ve el proveedor), nunca desde los
// fetches internos que hacen seleccion/checklist/aprobar al leer la misma fila.
export async function localRegisterEligibleView(campaignId: string, token: string): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  const now = new Date().toISOString();
  const prev = store.eligibleProducts[idx];
  store.eligibleProducts[idx] = {
    ...prev,
    view_count: (prev.view_count ?? 0) + 1,
    first_viewed_at: prev.first_viewed_at ?? now,
    last_viewed_at: now,
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Marca/desmarca un ítem del checklist de preparación — merge parcial, así
// tocar un ítem nunca borra el estado de los otros tres.
export async function localSetChecklistItem(
  campaignId: string,
  token: string,
  key: ReadyChecklistKey,
  value: boolean
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  store.eligibleProducts[idx] = {
    ...store.eligibleProducts[idx],
    readyChecklist: { ...store.eligibleProducts[idx].readyChecklist, [key]: value },
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Registra un clic en el link del Meet — señal automática, no confirma
// asistencia real (eso lo marca el comercial a mano con localSetMeetAttendance).
// Público a propósito: se llama desde la página del proveedor, sin login.
export async function localRegisterMeetClick(campaignId: string, token: string): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  const now = new Date().toISOString();
  const prev = store.eligibleProducts[idx];
  store.eligibleProducts[idx] = {
    ...prev,
    meet_click_count: (prev.meet_click_count ?? 0) + 1,
    meet_first_clicked_at: prev.meet_first_clicked_at ?? now,
    meet_last_clicked_at: now,
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Registra un clic en el botón "Agendarme" del mensaje de WhatsApp — llega
// vía /c/[token]?meet=1, que redirige directo a Google Calendar sin pasar
// por el panel. Contador separado de localRegisterMeetClick (ese es del
// botón de adentro del panel) para poder comparar clics por canal.
export async function localRegisterMeetRsvpClick(campaignId: string, token: string): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  const now = new Date().toISOString();
  const prev = store.eligibleProducts[idx];
  store.eligibleProducts[idx] = {
    ...prev,
    meet_rsvp_click_count: (prev.meet_rsvp_click_count ?? 0) + 1,
    meet_rsvp_first_clicked_at: prev.meet_rsvp_first_clicked_at ?? now,
    meet_rsvp_last_clicked_at: now,
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// Confirmación manual del comercial de que el proveedor sí asistió al Meet
// (detrás de login, ver require-auth en la ruta).
export async function localSetMeetAttendance(
  campaignId: string,
  token: string,
  attended: boolean
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  store.eligibleProducts[idx] = {
    ...store.eligibleProducts[idx],
    meet_attended: attended,
    meet_attended_marked_at: new Date().toISOString(),
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}

// ─── Órdenes por producto ────────────────────────────────────────────────

export async function localListProductOrders(campaignId: string): Promise<ProductOrderEntry[]> {
  const store = await readStore();
  return (store.productOrders ?? []).filter((p) => p.campaign_id === campaignId);
}

export async function localUpsertProductOrder(
  campaignId: string,
  productId: string,
  productName: string | undefined,
  ordersCount: number,
  source: "manual" | "import"
): Promise<ProductOrderEntry> {
  const store = await readStore();
  store.productOrders = store.productOrders ?? [];
  const now = new Date().toISOString();
  const idx = store.productOrders.findIndex((p) => p.campaign_id === campaignId && p.product_id === productId);
  const entry: ProductOrderEntry = { campaign_id: campaignId, product_id: productId, product_name: productName, orders_count: ordersCount, source, updated_at: now };
  if (idx >= 0) store.productOrders[idx] = entry;
  else store.productOrders.push(entry);
  await writeStore(store);
  return entry;
}

// Import de CSV: reemplaza en bloque las órdenes de los productos que vienen
// en el archivo (no borra los que no aparecen — un CSV parcial no debe hacer
// que el resto vuelva a cero).
export async function localImportProductOrders(
  campaignId: string,
  rows: { productId: string; productName?: string; ordersCount: number }[]
): Promise<ProductOrderEntry[]> {
  const store = await readStore();
  store.productOrders = store.productOrders ?? [];
  const now = new Date().toISOString();
  for (const row of rows) {
    if (!row.productId?.trim()) continue;
    const idx = store.productOrders.findIndex((p) => p.campaign_id === campaignId && p.product_id === row.productId);
    const entry: ProductOrderEntry = { campaign_id: campaignId, product_id: row.productId, product_name: row.productName, orders_count: row.ordersCount, source: "import", updated_at: now };
    if (idx >= 0) store.productOrders[idx] = entry;
    else store.productOrders.push(entry);
  }
  await writeStore(store);
  return store.productOrders.filter((p) => p.campaign_id === campaignId);
}

// Guarda el feedback de cierre ("ayúdanos a mejorar") — una sola vez por
// proveedor, sobrescribe si ya existía (el endpoint decide si permite reenvío).
export async function localSetFeedback(
  campaignId: string,
  token: string,
  rating: number,
  comment: string | undefined
): Promise<EligibleEntry | null> {
  const store = await readStore();
  const idx = (store.eligibleProducts ?? []).findIndex((e) => e.campaign_id === campaignId && e.token === token);
  if (idx < 0 || !store.eligibleProducts) return null;
  store.eligibleProducts[idx] = {
    ...store.eligibleProducts[idx],
    feedback: { rating, comment, submitted_at: new Date().toISOString() },
  };
  await writeStore(store);
  return store.eligibleProducts[idx];
}
