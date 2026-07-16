"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { NodeKey, NodeData, parseMilestones, milestoneEndDate, isPlanningComplete } from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";

type Campaign = { id: string; name: string; status: string; current_node: number };
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };
const EXECUTION_NODE_INDEX = 9;
type SendEntry = {
  id: string;
  file_name: string;
  row_count: number;
  message: string;
  status: "sent" | "failed" | "not_configured";
  response_summary: string;
  created_at: string;
};
type SupplierRow = Record<string, string | number>;

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

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, alignItems: "start", padding: "6px 0" }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "#111827", lineHeight: 1.5 }}>
        {value?.trim() ? value : <span style={{ color: "#9ca3af" }}>—</span>}
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<SendEntry["status"], { text: string; color: string; bg: string }> = {
  sent: { text: "Enviado", color: "#10B981", bg: "#ECFDF5" },
  failed: { text: "Falló", color: "#EF4444", bg: "#FEF2F2" },
  not_configured: { text: "Webhook no configurado", color: "#F59E0B", bg: "#FFFBEB" },
};

type MilestoneState = "hecho" | "hoy" | "proximo" | "sin_fecha";
const MILESTONE_LABEL: Record<MilestoneState, { text: string; color: string; bg: string }> = {
  hecho: { text: "Hecho", color: "#10B981", bg: "#ECFDF5" },
  hoy: { text: "Hoy", color: "#F77F00", bg: "#FFF3E0" },
  proximo: { text: "Próximo", color: "#6B7280", bg: "#F8F9FA" },
  sin_fecha: { text: "Sin fecha", color: "#9CA3AF", bg: "#F8F9FA" },
};

function milestoneState(dateText: string): MilestoneState {
  const end = milestoneEndDate(dateText);
  if (!end) return "sin_fecha";
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (end.getTime() === todayStart.getTime()) return "hoy";
  return end < todayStart ? "hecho" : "proximo";
}

export default function EjecucionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [sends, setSends] = useState<SendEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<SupplierRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [parseError, setParseError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [starting, setStarting] = useState(false);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/send-crm`).then((r) => r.json()),
    ]).then(([camp, n, s]) => {
      setCampaign(camp);
      setNodes(Array.isArray(n) ? n : []);
      setSends(Array.isArray(s) ? s : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const elegibilidad = nd("elegibilidad");
  const calendario = nd("calendario");
  const mecanica = nd("mecanica");
  const milestones = parseMilestones(calendario.milestones);

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
    } finally {
      setStarting(false);
    }
  };

  const handleFile = (file: File) => {
    setParseError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<SupplierRow>(sheet, { defval: "" });
        if (!json.length) {
          setParseError("El archivo no tiene filas de datos.");
          setRows([]);
          setColumns([]);
          return;
        }
        setRows(json);
        setColumns(Object.keys(json[0]));
      } catch {
        setParseError("No se pudo leer el archivo. ¿Es un Excel (.xlsx/.xls) o CSV válido?");
        setRows([]);
        setColumns([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSend = async () => {
    if (!rows.length || !campaign) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`/api/campaigns-planeacion/${id}/send-crm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, rows, message, campaignName: campaign.name }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSendResult({ ok: false, text: json.error || "No se pudo enviar." });
      } else {
        setSendResult({ ok: true, text: `Se enviaron ${rows.length} proveedores al CRM.` });
      }
    } catch {
      setSendResult({ ok: false, text: "Error de red al intentar enviar." });
    } finally {
      setSending(false);
      load();
    }
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Cargando...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
      }}>
        <a href="/" style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{campaign.name}</span>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 80px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Envío de convocatoria por CRM</h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Sube el Excel de proveedores que califican y envíalo al CRM para que dispare los mensajes. Mientras no tengas la URL del webhook, el envío queda registrado como pendiente.
          </p>
        </div>

        <div style={{ marginBottom: 22 }}>
          <PhaseTabs campaignId={id} active="ejecucion" planningComplete={planningComplete} isActive={isActive} closingDone={closingDone} />
        </div>

        <Section title="Recordatorio de la campaña" subtitle="Definido en el wizard de planeación">
          <Row label="Campaña" value={identidad.name} />
          <Row label="Evento comercial" value={identidad.commercial_event} />
          <Row label="Tipo de supplier elegible" value={elegibilidad.supplier_type?.split("||").filter(Boolean).join(", ")} />
          <Row label="Stock mínimo" value={elegibilidad.min_stock} />
          <Row label="Descuento mínimo" value={elegibilidad.min_discount} />
          <Row label="Palabra clave / marco" value={elegibilidad.keyword_marco} />
          <Row label="Motivador del supplier" value={mecanica.supplier_motivator} />
        </Section>

        <Section title="Estado de ejecución">
          {!isActive ? (
            <div>
              <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, margin: "0 0 14px" }}>
                La campaña todavía no arrancó en el mundo real. Al iniciarla queda registrada la fecha de arranque y se habilita el envío de la convocatoria.
              </p>
              <button
                onClick={handleStart}
                disabled={starting}
                style={{ background: "#F77F00", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
              >
                {starting ? "Iniciando..." : "Iniciar campaña"}
              </button>
            </div>
          ) : (
            <p style={{ fontSize: 13.5, color: "#111827", margin: 0 }}>
              Campaña activa desde el {startedAt ? new Date(startedAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) : "—"}.
            </p>
          )}
        </Section>

        {isActive && (
          <Section title="Próximos pasos" subtitle="Calculado a partir de los hitos del Calendario">
            {milestones.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>El nodo Calendario todavía no tiene hitos cargados.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {milestones.map((m, i) => {
                  const st = MILESTONE_LABEL[milestoneState(m.date)];
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr auto", gap: 14, alignItems: "start", borderBottom: i < milestones.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: 10 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#6b7280" }}>{m.date || "Sin fecha"}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{m.label}</div>
                        {m.notes && <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2, whiteSpace: "pre-wrap" }}>{m.notes}</div>}
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
        )}

        {!isActive ? (
          <Section title="Envío de convocatoria por CRM">
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Inicia la campaña arriba para habilitar el envío.</p>
          </Section>
        ) : (
          <>
            <Section title="Excel de proveedores que califican" subtitle="Se envía tal cual al CRM junto con el mensaje">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                style={{ fontSize: 13, marginBottom: 10 }}
              />
              {parseError && <p style={{ color: "#EF4444", fontSize: 12.5, margin: "6px 0" }}>{parseError}</p>}
              {rows.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 8 }}>
                    <strong>{fileName}</strong>: {rows.length} proveedores, columnas: {columns.join(", ")}
                  </p>
                  <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                    <table style={{ borderCollapse: "collapse", fontSize: 12, width: "100%" }}>
                      <thead>
                        <tr style={{ background: "#F8F9FA" }}>
                          {columns.map((c) => (
                            <th key={c} style={{ textAlign: "left", padding: "6px 10px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, 5).map((r, i) => (
                          <tr key={i}>
                            {columns.map((c) => (
                              <td key={c} style={{ padding: "6px 10px", borderBottom: "1px solid #f3f4f6", color: "#111827", whiteSpace: "nowrap" }}>{String(r[c] ?? "")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rows.length > 5 && <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 6 }}>Mostrando 5 de {rows.length} filas.</p>}
                </div>
              )}
            </Section>

            <Section title="Mensaje de convocatoria" subtitle="Lo que verá el proveedor">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ej. Tu tienda califica para Cyber Days. Activa tus productos quietos y gana visibilidad extra..."
                rows={4}
                style={{ width: "100%", fontSize: 13.5, fontFamily: "inherit", padding: 10, border: "1px solid #e5e7eb", borderRadius: 8, resize: "vertical" }}
              />
            </Section>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <button
                onClick={handleSend}
                disabled={!rows.length || sending}
                style={{
                  background: rows.length ? "#F77F00" : "#e5e7eb", color: rows.length ? "#fff" : "#9ca3af",
                  border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700,
                  cursor: rows.length ? "pointer" : "not-allowed",
                }}
              >
                {sending ? "Enviando..." : "Enviar convocatoria al CRM"}
              </button>
              {sendResult && (
                <span style={{ fontSize: 13, color: sendResult.ok ? "#10B981" : "#EF4444", fontWeight: 600 }}>
                  {sendResult.text}
                </span>
              )}
            </div>

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
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.file_name}: {s.row_count} proveedores</div>
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
        )}
      </div>
    </div>
  );
}
