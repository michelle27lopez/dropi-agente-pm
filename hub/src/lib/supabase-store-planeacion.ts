import { campaignsSupabase as supabase } from "@/lib/supabase-campaigns";
import {
  SUPPLIER_STATUS_ORDER,
  type SupplierStatus,
  type EligibleEntry,
  type EligibleProduct,
  type ReadyChecklistKey,
  type ReadyChecklist,
  type CampaignFeedback,
  type ProductOrderEntry,
} from "@/lib/local-store-planeacion";

// Contraparte en Supabase (tablas campaign_planeacion_suppliers /
// campaign_planeacion_eligible, ver hub/supabase/029_...sql) de
// local-store-planeacion.ts. Cada función espeja una función local con el
// mismo nombre sin el prefijo `local` — las rutas intentan esta primero y
// caen a la local si `supabase` es null o la tabla todavía no existe.

type SupplierRow = {
  id: string;
  campaign_id: string;
  identifier: string;
  data: Record<string, string | number>;
  status: SupplierStatus;
  note: string | null;
  contacts: { label: string; sent_at: string }[];
  created_at: string;
  updated_at: string;
};

type CampaignSupplier = Omit<SupplierRow, "note"> & { note?: string };

function fromSupplierRow(row: SupplierRow): CampaignSupplier {
  return { ...row, note: row.note ?? undefined };
}

type EligibleRow = {
  token: string;
  campaign_id: string;
  supplier_id: string;
  supplier_name: string;
  products: EligibleProduct[];
  selected_product_ids: (string | number)[] | null;
  submitted_at: string | null;
  selection_updated_at: string | null;
  approved_at: string | null;
  ready_checklist: ReadyChecklist | null;
  feedback: CampaignFeedback | null;
  view_count: number | null;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  meet_click_count: number | null;
  meet_first_clicked_at: string | null;
  meet_last_clicked_at: string | null;
  meet_attended: boolean | null;
  meet_attended_marked_at: string | null;
  meet_rsvp_click_count: number | null;
  meet_rsvp_first_clicked_at: string | null;
  meet_rsvp_last_clicked_at: string | null;
  updated_at: string;
};

function fromEligibleRow(row: EligibleRow): EligibleEntry {
  return {
    token: row.token,
    campaign_id: row.campaign_id,
    supplier_id: row.supplier_id,
    supplier_name: row.supplier_name,
    products: row.products,
    selectedProductIds: row.selected_product_ids ?? undefined,
    submitted_at: row.submitted_at,
    selection_updated_at: row.selection_updated_at,
    approved_at: row.approved_at,
    readyChecklist: row.ready_checklist ?? undefined,
    feedback: row.feedback ?? undefined,
    view_count: row.view_count ?? 0,
    first_viewed_at: row.first_viewed_at,
    last_viewed_at: row.last_viewed_at,
    meet_click_count: row.meet_click_count ?? 0,
    meet_first_clicked_at: row.meet_first_clicked_at,
    meet_last_clicked_at: row.meet_last_clicked_at,
    meet_attended: row.meet_attended ?? false,
    meet_attended_marked_at: row.meet_attended_marked_at,
    meet_rsvp_click_count: row.meet_rsvp_click_count ?? 0,
    meet_rsvp_first_clicked_at: row.meet_rsvp_first_clicked_at,
    meet_rsvp_last_clicked_at: row.meet_rsvp_last_clicked_at,
    updated_at: row.updated_at,
  };
}

type ProductOrderRow = {
  id: string;
  campaign_id: string;
  product_id: string;
  product_name: string | null;
  orders_count: number;
  source: "manual" | "import";
  updated_at: string;
};

function fromProductOrderRow(row: ProductOrderRow): ProductOrderEntry {
  return {
    campaign_id: row.campaign_id,
    product_id: row.product_id,
    product_name: row.product_name ?? undefined,
    orders_count: row.orders_count,
    source: row.source,
    updated_at: row.updated_at,
  };
}

// ─── Suppliers ───────────────────────────────────────────────────────────

export async function supabaseListSuppliers(campaignId: string): Promise<CampaignSupplier[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_suppliers")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("identifier");
  if (error) return null;
  return (data as SupplierRow[]).map(fromSupplierRow);
}

export async function supabaseUpsertSuppliers(
  campaignId: string,
  rows: { identifier: string; data: Record<string, string | number> }[],
  messageLabel?: string | null
): Promise<CampaignSupplier[] | null> {
  if (!supabase) return null;
  const now = new Date().toISOString();

  for (const row of rows) {
    if (!row.identifier?.trim()) continue;
    const { data: existing, error: fetchError } = await supabase
      .from("campaign_planeacion_suppliers")
      .select("*")
      .eq("campaign_id", campaignId)
      .eq("identifier", row.identifier)
      .maybeSingle();
    if (fetchError) return null;

    const newContact = messageLabel ? [{ label: messageLabel, sent_at: now }] : [];
    if (existing) {
      const { error } = await supabase
        .from("campaign_planeacion_suppliers")
        .update({ data: row.data, contacts: [...(existing.contacts ?? []), ...newContact], updated_at: now })
        .eq("id", existing.id);
      if (error) return null;
    } else {
      const { error } = await supabase.from("campaign_planeacion_suppliers").insert({
        campaign_id: campaignId,
        identifier: row.identifier,
        data: row.data,
        status: "contactado",
        contacts: newContact,
      });
      if (error) return null;
    }
  }

  return supabaseListSuppliers(campaignId);
}

export async function supabaseUpdateSupplierStatus(
  campaignId: string,
  supplierId: string,
  status: SupplierStatus
): Promise<CampaignSupplier | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_suppliers")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", supplierId)
    .eq("campaign_id", campaignId)
    .select()
    .single();
  if (error) return null;
  return fromSupplierRow(data as SupplierRow);
}

export async function supabaseUpdateSupplierNote(
  campaignId: string,
  supplierId: string,
  note: string
): Promise<CampaignSupplier | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_suppliers")
    .update({ note, updated_at: new Date().toISOString() })
    .eq("id", supplierId)
    .eq("campaign_id", campaignId)
    .select()
    .single();
  if (error) return null;
  return fromSupplierRow(data as SupplierRow);
}

export async function supabaseApplySupplierEvent(
  campaignId: string,
  identifier: string,
  status: SupplierStatus
): Promise<CampaignSupplier | null> {
  if (!supabase) return null;
  const now = new Date().toISOString();
  const { data: existing, error: fetchError } = await supabase
    .from("campaign_planeacion_suppliers")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("identifier", identifier)
    .maybeSingle();
  if (fetchError) return null;

  if (existing) {
    if (SUPPLIER_STATUS_ORDER.indexOf(status) <= SUPPLIER_STATUS_ORDER.indexOf(existing.status)) {
      return fromSupplierRow(existing as SupplierRow);
    }
    const { data, error } = await supabase
      .from("campaign_planeacion_suppliers")
      .update({ status, updated_at: now })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return null;
    return fromSupplierRow(data as SupplierRow);
  }

  const { data, error } = await supabase
    .from("campaign_planeacion_suppliers")
    .insert({ campaign_id: campaignId, identifier, data: {}, status })
    .select()
    .single();
  if (error) return null;
  return fromSupplierRow(data as SupplierRow);
}

// ─── Productos elegibles ─────────────────────────────────────────────────

export async function supabaseListEligibleProducts(campaignId: string): Promise<EligibleEntry[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("supplier_name");
  if (error) return null;
  return (data as EligibleRow[]).map(fromEligibleRow);
}

export async function supabaseGetEligibleByToken(campaignId: string, token: string): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  return fromEligibleRow(data as EligibleRow);
}

// Para el link corto /c/[token]: el token ya es único globalmente (generado
// random por proveedor), así que no hace falta el campaign_id para
// encontrarlo — solo se usa para resolver a qué campaña redirigir.
export async function supabaseGetEligibleByTokenOnly(token: string): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  return fromEligibleRow(data as EligibleRow);
}

export async function supabaseSetEligibleSelection(
  campaignId: string,
  token: string,
  productIds: (string | number)[]
): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const prev = await supabaseGetEligibleByToken(campaignId, token);
  if (!prev) return null;
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({
      selected_product_ids: productIds,
      submitted_at: prev.submitted_at ?? now,
      selection_updated_at: prev.submitted_at ? now : null,
    })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

export async function supabaseApproveEligible(campaignId: string, token: string): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const entry = await supabaseGetEligibleByToken(campaignId, token);
  if (!entry) return null;
  if (!entry.submitted_at) return entry;
  if (entry.approved_at) return entry;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({ approved_at: new Date().toISOString() })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

// Invalida el link actual de un proveedor y le asigna uno nuevo — `newToken`
// lo genera el endpoint (mismo formato en Supabase y local).
export async function supabaseResetEligibleToken(
  campaignId: string,
  oldToken: string,
  newToken: string
): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({ token: newToken, updated_at: new Date().toISOString() })
    .eq("campaign_id", campaignId)
    .eq("token", oldToken)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

export async function supabaseApproveAllEligible(campaignId: string): Promise<number | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({ approved_at: new Date().toISOString() })
    .eq("campaign_id", campaignId)
    .not("submitted_at", "is", null)
    .is("approved_at", null)
    .select("token");
  if (error) return null;
  return (data ?? []).length;
}

// Contraparte de localRegisterEligibleView — solo se llama desde el GET real
// de la página pública. Fetch-then-write (no hay incremento atómico simple
// vía supabase-js sin una función RPC dedicada) — aceptable para este
// volumen de tráfico, no es una métrica que requiera precisión bajo carrera.
export async function supabaseRegisterEligibleView(campaignId: string, token: string): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const prev = await supabaseGetEligibleByToken(campaignId, token);
  if (!prev) return null;
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({
      view_count: (prev.view_count ?? 0) + 1,
      first_viewed_at: prev.first_viewed_at ?? now,
      last_viewed_at: now,
    })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

export async function supabaseSetChecklistItem(
  campaignId: string,
  token: string,
  key: ReadyChecklistKey,
  value: boolean
): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const prev = await supabaseGetEligibleByToken(campaignId, token);
  if (!prev) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({ ready_checklist: { ...prev.readyChecklist, [key]: value } })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

export async function supabaseSetFeedback(
  campaignId: string,
  token: string,
  rating: number,
  comment: string | undefined
): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({ feedback: { rating, comment, submitted_at: new Date().toISOString() } })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

// Registra un clic en el link del Meet — señal automática (público, sin
// login), no confirma asistencia real. Ver supabaseSetMeetAttendance para
// la confirmación manual del comercial.
export async function supabaseRegisterMeetClick(campaignId: string, token: string): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const prev = await supabaseGetEligibleByToken(campaignId, token);
  if (!prev) return null;
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({
      meet_click_count: (prev.meet_click_count ?? 0) + 1,
      meet_first_clicked_at: prev.meet_first_clicked_at ?? now,
      meet_last_clicked_at: now,
    })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

// Registra un clic en el botón "Agendarme" del mensaje de WhatsApp — llega
// vía /c/[token]?meet=1 (ver hub/src/app/c/[token]/page.tsx), que redirige
// directo a Google Calendar sin pasar por el panel. Contador separado de
// supabaseRegisterMeetClick (ese es del botón de adentro del panel) para
// poder comparar clics por canal.
export async function supabaseRegisterMeetRsvpClick(campaignId: string, token: string): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const prev = await supabaseGetEligibleByToken(campaignId, token);
  if (!prev) return null;
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({
      meet_rsvp_click_count: (prev.meet_rsvp_click_count ?? 0) + 1,
      meet_rsvp_first_clicked_at: prev.meet_rsvp_first_clicked_at ?? now,
      meet_rsvp_last_clicked_at: now,
    })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

export async function supabaseSetMeetAttendance(
  campaignId: string,
  token: string,
  attended: boolean
): Promise<EligibleEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_eligible")
    .update({ meet_attended: attended, meet_attended_marked_at: new Date().toISOString() })
    .eq("campaign_id", campaignId)
    .eq("token", token)
    .select()
    .single();
  if (error) return null;
  return fromEligibleRow(data as EligibleRow);
}

// ─── Órdenes por producto ────────────────────────────────────────────────

export async function supabaseListProductOrders(campaignId: string): Promise<ProductOrderEntry[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_product_orders")
    .select("*")
    .eq("campaign_id", campaignId);
  if (error) return null;
  return (data as ProductOrderRow[]).map(fromProductOrderRow);
}

export async function supabaseUpsertProductOrder(
  campaignId: string,
  productId: string,
  productName: string | undefined,
  ordersCount: number,
  source: "manual" | "import"
): Promise<ProductOrderEntry | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("campaign_planeacion_product_orders")
    .upsert(
      { campaign_id: campaignId, product_id: productId, product_name: productName ?? null, orders_count: ordersCount, source, updated_at: new Date().toISOString() },
      { onConflict: "campaign_id,product_id" }
    )
    .select()
    .single();
  if (error) return null;
  return fromProductOrderRow(data as ProductOrderRow);
}

// Import de CSV: reemplaza en bloque las órdenes de los productos que vienen
// en el archivo (upsert fila por fila) — un CSV parcial no borra los que no
// aparecen en él.
export async function supabaseImportProductOrders(
  campaignId: string,
  rows: { productId: string; productName?: string; ordersCount: number }[]
): Promise<ProductOrderEntry[] | null> {
  if (!supabase) return null;
  const now = new Date().toISOString();
  const payload = rows
    .filter((r) => r.productId?.trim())
    .map((r) => ({ campaign_id: campaignId, product_id: r.productId, product_name: r.productName ?? null, orders_count: r.ordersCount, source: "import" as const, updated_at: now }));
  if (payload.length === 0) return supabaseListProductOrders(campaignId);
  const { error } = await supabase
    .from("campaign_planeacion_product_orders")
    .upsert(payload, { onConflict: "campaign_id,product_id" });
  if (error) return null;
  return supabaseListProductOrders(campaignId);
}
