"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { NodeKey, NodeData, parseMilestones, isPlanningComplete, CampaignMessage, parseMessages } from "../../nodes";
import { renderMessageTemplate, extractTemplateKeys } from "@/lib/message-template";
import { PhaseTabs } from "../../PhaseTabs";
import { Sidebar } from "../../../Sidebar";

type Campaign = { id: string; name: string; status: string; current_node: number };
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };
const EXECUTION_NODE_INDEX = 9;
type SendEntry = {
  id: string;
  file_name: string;
  row_count: number;
  message: string;
  message_label?: string | null;
  status: "sent" | "failed" | "not_configured";
  response_summary: string;
  created_at: string;
};
type SupplierRow = Record<string, string | number>;
type MessageFile = { fileName: string; rows: SupplierRow[]; columns: string[]; idColumn: string; parseError: string };
const EMPTY_FILE: MessageFile = { fileName: "", rows: [], columns: [], idColumn: "", parseError: "" };

type SupplierStatus = "contactado" | "respondio" | "aplico" | "activo";
type SupplierContact = { label: string; sent_at: string };
type TrackedSupplier = {
  id: string;
  identifier: string;
  data: SupplierRow;
  status: SupplierStatus;
  note?: string;
  contacts?: SupplierContact[];
  updated_at: string;
};

type EligibleLite = {
  token: string; supplier_id: string | number; supplier_name: string; product_count: number;
  submitted_at: string | null; approved_at: string | null; view_count: number; last_viewed_at: string | null;
};

// El Excel de convocatoria trae "ID proveedor" como número — al pasar por
// XLSX/JSON un entero se vuelve float ("3242.0"), así que hay que pelarlo
// para poder cruzarlo con el identifier de seguimiento (texto, "3242").
function normalizeSupplierId(v: string | number): string {
  return String(v).trim().replace(/\.0$/, "");
}

// Busca una columna de teléfono/WhatsApp dentro de los datos crudos del
// Excel (nombre de columna no está fijo, varía por convocatoria) y arma un
// número apto para wa.me — asume Colombia (57) si vienen los 10 dígitos
// locales sin indicativo, que es el caso de todos los Excels vistos hasta hoy.
function supplierPhone(s: TrackedSupplier): string | null {
  const key = Object.keys(s.data).find((k) => /whatsapp|tel[eé]fono/i.test(k));
  if (!key) return null;
  const digits = String(s.data[key] ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return digits.length === 10 ? `57${digits}` : digits;
}

const SUPPLIER_STATUS_ORDER: SupplierStatus[] = ["contactado", "respondio", "aplico", "activo"];
const SUPPLIER_STATUS_LABEL: Record<SupplierStatus, { text: string; color: string; bg: string }> = {
  contactado: { text: "Contactado", color: "#6B7280", bg: "#F8F9FA" },
  respondio: { text: "Respondió", color: "#3B82F6", bg: "#EFF6FF" },
  aplico: { text: "Aplicó", color: "#F59E0B", bg: "#FFFBEB" },
  activo: { text: "Activó", color: "#10B981", bg: "#ECFDF5" },
};

function guessIdColumn(columns: string[]): string {
  // Orden de preferencia: un ID de proveedor explícito > nombre de proveedor
  // explícito > email de proveedor > cualquier columna "nombre" genérica
  // (que en un Excel de productos suele ser el nombre del producto, no del
  // proveedor — por eso va de último).
  const patterns = [
    /^(id|supplier_id|proveedor_id)$/i,
    /id.*proveedor|proveedor.*id|supplier.*id/i,
    /nombre.*proveedor|proveedor.*nombre|supplier.*name/i,
    /email.*proveedor|proveedor.*email|correo.*proveedor/i,
    /(nombre|proveedor|supplier|tienda|email|correo)/i,
  ];
  for (const p of patterns) {
    const match = columns.find((c) => p.test(c.trim()));
    if (match) return match;
  }
  return columns[0] ?? "";
}

// El identificador de seguimiento suele ser un ID numérico (para no duplicar
// entre envíos) — buscamos un campo con nombre legible dentro de `data` para
// mostrar en vez del ID pelado.
function supplierLabel(s: TrackedSupplier): string {
  const keys = Object.keys(s.data);
  // Prioriza una columna "nombre" explícita — si buscáramos "proveedor" sin
  // más, una columna "ID proveedor" (casi siempre la primera) ganaría antes
  // de llegar a la que de verdad tiene el nombre legible.
  const nameKey = keys.find((k) => /nombre|supplier.*name/i.test(k)) ?? keys.find((k) => /proveedor|tienda/i.test(k) && !/^id\b/i.test(k));
  const name = nameKey ? String(s.data[nameKey] ?? "").trim() : "";
  return name || s.identifier;
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12.5, color: "#6b7280", margin: "3px 0 0" }}>{subtitle}</p>}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 22px" }}>
        {children}
      </div>
    </div>
  );
}

type ExecTabKey = "convocatoria" | "seguimiento";

function ExecTabs({
  active, onChange, sendsCount, suppliersCount,
}: { active: ExecTabKey; onChange: (t: ExecTabKey) => void; sendsCount: number; suppliersCount: number }) {
  const tabs: { key: ExecTabKey; label: string }[] = [
    { key: "convocatoria", label: sendsCount > 0 ? `Convocatoria (${sendsCount})` : "Convocatoria" },
    { key: "seguimiento", label: suppliersCount > 0 ? `Seguimiento (${suppliersCount})` : "Seguimiento" },
  ];
  return (
    <div style={{ display: "inline-flex", gap: 2, background: "#F8F9FA", borderRadius: 10, padding: 4, marginBottom: 22 }}>
      {tabs.map((t) => {
        const isActiveTab = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            style={{
              background: isActiveTab ? "#fff" : "transparent",
              border: isActiveTab ? "1px solid #e5e7eb" : "1px solid transparent",
              borderRadius: 7, padding: "7px 14px", fontSize: 13,
              fontWeight: isActiveTab ? 700 : 600,
              color: isActiveTab ? "#111827" : "#6b7280",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_LABEL: Record<SendEntry["status"], { text: string; color: string; bg: string }> = {
  sent: { text: "Enviado", color: "#10B981", bg: "#ECFDF5" },
  failed: { text: "Falló", color: "#EF4444", bg: "#FEF2F2" },
  not_configured: { text: "Webhook no configurado", color: "#F59E0B", bg: "#FFFBEB" },
};

export default function EjecucionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [sends, setSends] = useState<SendEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ExecTabKey>("convocatoria");

  // Cada mensaje tiene su propio Excel — la audiencia puede ser distinta por
  // mensaje (ej. "Instrucciones y reglas" solo va a los aprobados después de
  // curaduría, no a todos los invitados de la convocatoria inicial).
  const [messageFiles, setMessageFiles] = useState<Record<string, MessageFile>>({});
  const [starting, setStarting] = useState(false);

  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendResults, setSendResults] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; text: string }>>({});

  const [suppliers, setSuppliers] = useState<TrackedSupplier[]>([]);
  const [eligibles, setEligibles] = useState<EligibleLite[]>([]);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabInitialized = useRef(false);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/send-crm`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/suppliers`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/elegibles`).then((r) => r.json()),
    ]).then(([camp, n, s, sup, el]) => {
      setCampaign(camp);
      setNodes(Array.isArray(n) ? n : []);
      setSends(Array.isArray(s) ? s : []);
      setSuppliers(Array.isArray(sup) ? sup : []);
      setEligibles(Array.isArray(el) ? el : []);

      // Solo se lee el ?tab= de la URL en la carga inicial (deep-link
      // explícito desde otra pantalla) — sin eso, siempre aterriza en
      // Convocatoria. Las recargas después de iniciar/enviar no deben sacar
      // a la persona de donde está parada.
      if (!tabInitialized.current) {
        tabInitialized.current = true;
        const wantedTab = searchParams.get("tab") as ExecTabKey | null;
        if (wantedTab && ["convocatoria", "seguimiento"].includes(wantedTab)) {
          setTab(wantedTab);
        }
      }

      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const calendario = nd("calendario");
  const convocatoria = nd("convocatoria");
  const milestones = parseMilestones(calendario.milestones);
  const messages = parseMessages(convocatoria.messages);

  const eligibleByIdentifier = new Map(eligibles.map((e) => [normalizeSupplierId(e.supplier_id), e]));

  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";
  const startedAt = executionNode?.data?.started_at;
  const planningComplete = isPlanningComplete(nodes);
  const closingDone = !!nd("decision").decision;

  const handleStart = async () => {
    setStarting(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_index: EXECUTION_NODE_INDEX,
          node_key: "execution",
          data: { status: "active", started_at: new Date().toISOString() },
          completed: true,
        }),
      });
      load();
      setTab("convocatoria");
    } finally {
      setStarting(false);
    }
  };

  const handleFile = (msgId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<SupplierRow>(sheet, { defval: "" });
        if (!json.length) {
          setMessageFiles((prev) => ({ ...prev, [msgId]: { ...EMPTY_FILE, fileName: file.name, parseError: "El archivo no tiene filas de datos." } }));
          return;
        }
        const cols = Object.keys(json[0]);
        setMessageFiles((prev) => ({ ...prev, [msgId]: { fileName: file.name, rows: json, columns: cols, idColumn: guessIdColumn(cols), parseError: "" } }));
      } catch {
        setMessageFiles((prev) => ({ ...prev, [msgId]: { ...EMPTY_FILE, fileName: file.name, parseError: "No se pudo leer el archivo. ¿Es un Excel (.xlsx/.xls) o CSV válido?" } }));
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSend = async (msg: CampaignMessage) => {
    const mf = messageFiles[msg.id] ?? EMPTY_FILE;
    if (!mf.rows.length || !campaign || !msg.body.trim()) return;
    setSendingId(msg.id);
    try {
      const res = await fetch(`/api/campaigns-planeacion/${id}/send-crm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: mf.fileName, rows: mf.rows, message: msg.body, campaignName: campaign.name, messageLabel: msg.milestoneLabel }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSendResults((prev) => ({ ...prev, [msg.id]: { ok: false, text: json.error || "No se pudo enviar." } }));
      } else {
        setSendResults((prev) => ({ ...prev, [msg.id]: { ok: true, text: `Se enviaron ${mf.rows.length} proveedores al CRM.` } }));
      }
    } catch {
      setSendResults((prev) => ({ ...prev, [msg.id]: { ok: false, text: "Error de red al intentar enviar." } }));
    } finally {
      // El seguimiento se puebla con el intento de envío en sí (webhook
      // configurado o no) — el follow-up manual no depende de que el CRM
      // ya esté conectado.
      if (mf.idColumn) {
        await fetch(`/api/campaigns-planeacion/${id}/suppliers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rows: mf.rows.map((r) => ({ identifier: String(r[mf.idColumn] ?? "").trim(), data: r })),
            messageLabel: msg.label || msg.milestoneLabel || "Mensaje",
          }),
        });
      }
      setSendingId(null);
      load();
    }
  };

  // Sample de proveedor genérico para "Probar por WhatsApp" cuando todavía
  // no se ha cargado el Excel real — así la prueba no depende de tenerlo listo.
  const DUMMY_SAMPLE_ROW: SupplierRow = { "Nombre del proveedor": "Proveedor de ejemplo", "ID proveedor": "0000" };

  const handleTestWhatsapp = async (msg: CampaignMessage) => {
    if (!campaign || !msg.body.trim()) return;
    const mf = messageFiles[msg.id] ?? EMPTY_FILE;
    setTestingId(msg.id);
    try {
      const res = await fetch(`/api/campaigns-planeacion/${id}/test-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignName: campaign.name, message: msg.body, sampleRow: mf.rows[0] ?? DUMMY_SAMPLE_ROW }),
      });
      const json = await res.json();
      if (!res.ok) {
        setTestResults((prev) => ({ ...prev, [msg.id]: { ok: false, text: json.error || "No se pudo enviar la prueba." } }));
      } else {
        setTestResults((prev) => ({ ...prev, [msg.id]: { ok: true, text: "Prueba enviada a tu WhatsApp." } }));
      }
    } catch {
      setTestResults((prev) => ({ ...prev, [msg.id]: { ok: false, text: "Error de red al intentar enviar la prueba." } }));
    } finally {
      setTestingId(null);
    }
  };

  const handleStatusChange = async (supplierId: string, status: SupplierStatus) => {
    setStatusUpdating(supplierId);
    setSuppliers((prev) => prev.map((s) => (s.id === supplierId ? { ...s, status } : s)));
    try {
      await fetch(`/api/campaigns-planeacion/${id}/suppliers/${supplierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleNoteSave = async (supplierId: string, note: string) => {
    setSavingNoteId(supplierId);
    setSuppliers((prev) => prev.map((s) => (s.id === supplierId ? { ...s, note } : s)));
    try {
      await fetch(`/api/campaigns-planeacion/${id}/suppliers/${supplierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
    } finally {
      setSavingNoteId(null);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Cargando...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{campaign.name}</span>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 80px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{identidad.name || campaign.name}</h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Ejecución de la campaña: arranque, convocatoria a proveedores y seguimiento de respuestas.
          </p>
        </div>

        <div style={{ marginBottom: 22 }}>
          <PhaseTabs campaignId={id} active="ejecucion" planningComplete={planningComplete} isActive={isActive} closingDone={closingDone} />
        </div>

        {/* Estado de ejecución siempre visible — antes vivía en el tab
            Resumen (eliminado 18/07 a pedido de Michelle: sobraba), pero el
            arranque de la campaña no puede quedar escondido en un tab. */}
        {!isActive ? (
          <div style={{ background: "#FFF8F0", border: "1px solid #FCD9A8", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.5, margin: 0 }}>
              La campaña todavía no arrancó en el mundo real. Al iniciarla queda registrada la fecha de arranque y se habilita el envío de la convocatoria.
            </p>
            <button
              onClick={handleStart}
              disabled={starting}
              style={{ background: "#F77F00", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
            >
              {starting ? "Iniciando..." : "Iniciar campaña"}
            </button>
          </div>
        ) : (
          <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 14px" }}>
            Campaña activa desde el {startedAt ? new Date(startedAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : "—"}.
          </p>
        )}

        <ExecTabs active={tab} onChange={setTab} sendsCount={sends.length} suppliersCount={suppliers.length} />

        {tab === "convocatoria" && (
          !isActive ? (
            <Section title="Envío de convocatoria por CRM">
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Inicia la campaña con el botón de arriba para habilitar el envío.</p>
            </Section>
          ) : (
            <>
              <Section title="Mensajes de la campaña" subtitle="Cada mensaje tiene su propio Excel — la audiencia puede cambiar de un envío a otro (ej. todos los invitados vs. solo los aprobados después de curaduría)">
                {messages.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                    Todavía no hay mensajes definidos. Ve a Planeación → Convocatoria y postulación para redactarlos (se pre-llenan con los hitos del Calendario).
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {messages.map((m) => {
                      const linked = m.milestoneLabel ? milestones.find((ms) => ms.label === m.milestoneLabel) : null;
                      const isSending = sendingId === m.id;
                      const isTesting = testingId === m.id;
                      const mf = messageFiles[m.id] ?? EMPTY_FILE;
                      const canSend = mf.rows.length > 0 && !!m.body.trim();
                      const canTest = !!m.body.trim();
                      const templateKeys = extractTemplateKeys(m.body);
                      const previewRow = mf.rows[0] ?? DUMMY_SAMPLE_ROW;
                      const preview = m.body ? renderMessageTemplate(m.body, previewRow) : "";
                      return (
                        <div key={m.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                            {m.label || m.milestoneLabel || "Mensaje independiente"}
                            {linked && <span style={{ color: "#6b7280", fontWeight: 500 }}> · {linked.date || "sin fecha"}</span>}
                          </div>
                          <p style={{ fontSize: 13, color: m.body ? "#374151" : "#9ca3af", lineHeight: 1.55, whiteSpace: "pre-wrap", margin: "0 0 8px" }}>
                            {m.body || "(sin redactar todavía — ve a Planeación → Convocatoria y postulación)"}
                          </p>
                          {templateKeys.length > 0 && (
                            <div style={{ marginBottom: 10 }}>
                              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>
                                Usa {templateKeys.map((k) => `{{${k}}}`).join(", ")} — se reemplaza con la columna del Excel de este envío.
                                {!mf.rows.length && " Sube el Excel para ver si esa columna existe."}
                              </p>
                              <div style={{ background: "#F8F9FA", border: "1px dashed #d1d5db", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#374151", whiteSpace: "pre-wrap" }}>
                                <span style={{ fontWeight: 700, color: "#6b7280" }}>Vista previa{!mf.rows.length ? " (proveedor de ejemplo)" : ""}: </span>
                                {preview}
                              </div>
                            </div>
                          )}

                          <div style={{ background: "#F8F9FA", border: "1px dashed #d1d5db", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <label style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280" }}>Excel de este envío:</label>
                              <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(m.id, f); }}
                                style={{ fontSize: 12 }}
                              />
                              {mf.rows.length > 0 && (
                                <span style={{ fontSize: 11.5, color: "#6b7280" }}><strong>{mf.fileName}</strong>: {mf.rows.length} proveedores</span>
                              )}
                            </div>
                            {mf.parseError && <p style={{ color: "#EF4444", fontSize: 12, margin: "6px 0 0" }}>{mf.parseError}</p>}
                            {mf.rows.length > 0 && (
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                                <label style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 600 }}>Columna identificadora:</label>
                                <select
                                  value={mf.idColumn}
                                  onChange={(e) => setMessageFiles((prev) => ({ ...prev, [m.id]: { ...mf, idColumn: e.target.value } }))}
                                  style={{ fontSize: 11.5, padding: "4px 6px", border: "1px solid #e5e7eb", borderRadius: 6, fontFamily: "inherit" }}
                                >
                                  {mf.columns.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <span style={{ fontSize: 11, color: "#9ca3af" }}>evita duplicar el seguimiento si el proveedor reaparece en otro envío</span>
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <button
                              onClick={() => handleSend(m)}
                              disabled={!canSend || isSending}
                              style={{
                                background: canSend ? "#F77F00" : "#e5e7eb", color: canSend ? "#fff" : "#9ca3af",
                                border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700,
                                cursor: canSend ? "pointer" : "not-allowed",
                              }}
                            >
                              {isSending ? "Enviando..." : "Enviar al CRM"}
                            </button>
                            <button
                              onClick={() => handleTestWhatsapp(m)}
                              disabled={!canTest || isTesting}
                              title="Envía un único mensaje de prueba a tu WhatsApp — nunca a los proveedores."
                              style={{
                                background: "#fff", color: canTest ? "#111827" : "#9ca3af",
                                border: `1px solid ${canTest ? "#d1d5db" : "#e5e7eb"}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700,
                                cursor: canTest ? "pointer" : "not-allowed",
                              }}
                            >
                              {isTesting ? "Enviando prueba..." : "Probar por WhatsApp"}
                            </button>
                            {sendResults[m.id] && (
                              <span style={{ fontSize: 12.5, color: sendResults[m.id].ok ? "#10B981" : "#EF4444", fontWeight: 600 }}>{sendResults[m.id].text}</span>
                            )}
                            {testResults[m.id] && (
                              <span style={{ fontSize: 12.5, color: testResults[m.id].ok ? "#10B981" : "#EF4444", fontWeight: 600 }}>{testResults[m.id].text}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>

              <Section title="Historial de envíos">
                {sends.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Todavía no se ha intentado ningún envío.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sends.map((s) => {
                      const st = STATUS_LABEL[s.status];
                      return (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #f3f4f6", paddingBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                              {s.message_label ? `${s.message_label} · ` : ""}{s.file_name}: {s.row_count} proveedores
                            </div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{new Date(s.created_at).toLocaleString("es-CO")} · {s.response_summary}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                            {st.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>
            </>
          )
        )}

        {tab === "seguimiento" && (
          <Section title="Seguimiento de suppliers" subtitle="Estado de cada proveedor contactado, se actualiza a mano">
            {suppliers.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Todavía no hay proveedores contactados. Envía una convocatoria desde la pestaña Convocatoria para empezar el seguimiento.</p>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  {SUPPLIER_STATUS_ORDER.map((st) => {
                    const count = suppliers.filter((s) => s.status === st).length;
                    const label = SUPPLIER_STATUS_LABEL[st];
                    return (
                      <div key={st} style={{ display: "flex", alignItems: "center", gap: 8, background: label.bg, borderRadius: 10, padding: "8px 14px" }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: label.color }}>{count}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: label.color }}>{label.text}</span>
                      </div>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  placeholder="Buscar por nombre o ID..."
                  style={{ fontSize: 13, padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 14, width: 260, fontFamily: "inherit" }}
                />
                {(() => {
                  const q = supplierSearch.trim().toLowerCase();
                  const filtered = q
                    ? suppliers.filter((s) => supplierLabel(s).toLowerCase().includes(q) || s.identifier.toLowerCase().includes(q))
                    : suppliers;
                  if (filtered.length === 0) {
                    return <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Ningún proveedor coincide con "{supplierSearch}".</p>;
                  }
                  return (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left", padding: "6px 10px 6px 0", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>Proveedor</th>
                            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>Estado</th>
                            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>Mensajes enviados</th>
                            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>Nota</th>
                            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>Enlace</th>
                            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 12 }}>Actualizado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((s) => {
                            const contacts = s.contacts ?? [];
                            const noteValue = noteDrafts[s.id] ?? s.note ?? "";
                            const eligible = eligibleByIdentifier.get(normalizeSupplierId(s.identifier));
                            const token = eligible?.token;
                            const path = token ? `/proyectos/dinamicas-catalogo/planeacion/${id}/elegibles/${token}` : null;
                            const phone = supplierPhone(s);
                            return (
                              <tr key={s.id}>
                                <td style={{ padding: "8px 10px 8px 0", borderBottom: "1px solid #f3f4f6", color: "#111827", fontWeight: 600 }}>
                                  {supplierLabel(s)}
                                  {supplierLabel(s) !== s.identifier && (
                                    <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 11.5, marginLeft: 6 }}>#{s.identifier}</span>
                                  )}
                                </td>
                                <td style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6" }}>
                                  <select
                                    value={s.status}
                                    disabled={statusUpdating === s.id}
                                    onChange={(e) => handleStatusChange(s.id, e.target.value as SupplierStatus)}
                                    style={{
                                      fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 20, border: "none",
                                      color: SUPPLIER_STATUS_LABEL[s.status].color, background: SUPPLIER_STATUS_LABEL[s.status].bg,
                                      fontFamily: "inherit", cursor: "pointer",
                                    }}
                                  >
                                    {SUPPLIER_STATUS_ORDER.map((st) => (
                                      <option key={st} value={st}>{SUPPLIER_STATUS_LABEL[st].text}</option>
                                    ))}
                                  </select>
                                </td>
                                <td style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6" }}>
                                  {contacts.length === 0 ? (
                                    <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>
                                  ) : (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                      {contacts.map((c, i) => (
                                        <span
                                          key={i}
                                          title={new Date(c.sent_at).toLocaleString("es-CO")}
                                          style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#F8F9FA", border: "1px solid #e5e7eb", borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}
                                        >
                                          {c.label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6" }}>
                                  <input
                                    type="text"
                                    value={noteValue}
                                    placeholder="Agregar nota..."
                                    disabled={savingNoteId === s.id}
                                    onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [s.id]: e.target.value }))}
                                    onBlur={(e) => { if (e.target.value !== (s.note ?? "")) handleNoteSave(s.id, e.target.value); }}
                                    style={{ fontSize: 12, padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontFamily: "inherit", width: 180 }}
                                  />
                                </td>
                                <td style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6" }}>
                                  {path ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                      <div style={{ display: "flex", gap: 6 }}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}${path}`);
                                            setCopiedId(s.id);
                                            setTimeout(() => setCopiedId((prev) => (prev === s.id ? null : prev)), 1500);
                                          }}
                                          style={{
                                            fontSize: 11.5, fontWeight: 600, color: "#374151", background: "#fff",
                                            border: "1px solid #d1d5db", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit",
                                          }}
                                        >
                                          {copiedId === s.id ? "Copiado" : "Copiar enlace"}
                                        </button>
                                        {phone && (
                                          <a
                                            href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hola ${supplierLabel(s)}, aquí está tu enlace para elegir tus productos: ${window.location.origin}${path}`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                              fontSize: 11.5, fontWeight: 600, color: "#10B981", background: "#ECFDF5",
                                              border: "1px solid #A7F3D0", borderRadius: 6, padding: "4px 8px", textDecoration: "none", whiteSpace: "nowrap",
                                            }}
                                          >
                                            WhatsApp
                                          </a>
                                        )}
                                      </div>
                                      <span style={{ fontSize: 11, color: "#9ca3af" }} title={eligible?.last_viewed_at ? `Última visita: ${new Date(eligible.last_viewed_at).toLocaleString("es-CO")}` : "Todavía no ha entrado"}>
                                        {eligible && eligible.view_count > 0 ? `${eligible.view_count} visita${eligible.view_count === 1 ? "" : "s"}` : "Sin visitas"}
                                      </span>
                                    </div>
                                  ) : (
                                    <span style={{ color: "#9ca3af", fontSize: 12 }} title="Este proveedor no tiene productos elegibles cargados todavía">Sin enlace</span>
                                  )}
                                </td>
                                <td style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6", color: "#9ca3af", fontSize: 12 }}>
                                  {new Date(s.updated_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </>
            )}
          </Section>
        )}
      </div>
      </main>
    </div>
  );
}
