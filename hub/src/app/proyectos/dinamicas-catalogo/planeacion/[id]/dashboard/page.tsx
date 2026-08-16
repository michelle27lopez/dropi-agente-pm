"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import {
  NODE_DEFINITIONS, NodeKey, NodeData, Field, SavedNode, isPlanningComplete, EXECUTION_NODE_INDEX,
  parseMilestones, MILESTONE_LABEL, milestoneState, parseMessages,
} from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";
import { Sidebar } from "../../../Sidebar";

type Campaign = { id: string; name: string; status: string };

const DECISION_IDX = NODE_DEFINITIONS.findIndex((n) => n.key === "decision");
const DECISION_DEF = NODE_DEFINITIONS[DECISION_IDX];
const RESULTADOS_IDX = NODE_DEFINITIONS.findIndex((n) => n.key === "resultados");

const ENRIQUE_DOC_URL = "https://claude.ai/code/artifact/9c320e5b-a72f-44ac-b8a4-3e8ab86bd72c";
const SUPPLIER_PREVIEW_TOKEN = "14kC0tM0fztALhbD8jrVNw";

const TOKENS = `
  :root {
    --dropi: #F77F00; --bg: #fff; --card: #fff; --border: #E5E7EB; --fg: #111827; --muted: #6B7280;
    --success: #10B981; --success-light: #ECFDF5; --info: #6366F1; --info-light: #EEF2FF;
    --warn: #F59E0B; --warn-light: #FFFBEB;
  }
`;

function chipList(value: string | undefined): string[] {
  return value ? value.split("||").filter(Boolean) : [];
}

function Chips({ value, color = "#F77F00" }: { value?: string; color?: string }) {
  const items = chipList(value);
  if (!items.length) return <span style={{ color: "var(--muted)", fontSize: 13 }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item, i) => (
        <span key={i} style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "start", padding: "5px 0" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
        {children ?? (value?.trim() ? value : <span style={{ color: "#9ca3af" }}>—</span>)}
      </div>
    </div>
  );
}

// Card de solo lectura para una sección de Planeación, con un link directo
// al paso correspondiente del wizard — así "ver" y "editar" quedan separados.
function SummaryCard({
  title, editHref, extra, children,
}: { title: string; editHref?: string; extra?: React.ReactNode; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {extra}
          {editHref && (
            <button
              onClick={() => router.push(editHref)}
              style={{ background: "none", border: "none", color: "var(--dropi)", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            >
              ✎ Editar
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function FieldInput({
  field, value, onChange, onAiSuggest, aiLoading, aiError,
}: {
  field: Field; value: string; onChange: (v: string) => void;
  onAiSuggest?: () => void; aiLoading?: boolean; aiError?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          {field.label}
          {field.required ? <span style={{ color: "#F77F00", marginLeft: 2 }}>*</span> : <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>(opcional)</span>}
        </label>
        {field.aiSuggest && onAiSuggest && (
          <button
            type="button"
            onClick={onAiSuggest}
            disabled={aiLoading}
            style={{
              display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
              color: "#6366F1", background: "#EEF2FF", border: "1px solid rgba(99,102,241,.25)",
              borderRadius: 999, padding: "4px 10px", cursor: aiLoading ? "default" : "pointer", fontFamily: "inherit",
            }}
          >
            <Wand2 size={12} strokeWidth={2.4} />
            {aiLoading ? "Generando..." : "Sugerir con IA"}
          </button>
        )}
      </div>
      {field.hint && <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5 }}>{field.hint}</p>}
      {aiError && <p style={{ fontSize: 12, color: "#EF4444", margin: "0 0 8px" }}>{aiError}</p>}

      {field.type === "textarea" && (
        <textarea
          value={value}
          placeholder={field.placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
        />
      )}
      {field.type === "select" && field.optionDescriptions && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {field.options?.map((opt) => {
            const isSel = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                style={{
                  textAlign: "left", border: isSel ? "1px solid #F77F00" : "1px solid #e5e7eb",
                  background: isSel ? "#FFF3E0" : "#fff", borderRadius: 8, padding: "10px 12px",
                  cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: isSel ? "#F77F00" : "#111827" }}>{opt}</span>
                {field.optionDescriptions?.[opt] && <span style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.45 }}>{field.optionDescriptions[opt]}</span>}
              </button>
            );
          })}
        </div>
      )}
      {field.type === "select" && !field.optionDescriptions && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, fontFamily: "inherit", background: "#fff" }}
        >
          <option value="">Seleccionar...</option>
          {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}
    </div>
  );
}

export default function CampaignDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<NodeData>({});
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [aiLoading, setAiLoading] = useState<Set<string>>(new Set());
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, n]) => {
      setCampaign(camp);
      const list: SavedNode[] = Array.isArray(n) ? n : [];
      setNodes(list);
      setDecision(list.find((x) => x.node_index === DECISION_IDX)?.data ?? {});
      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); }, []);

  const getDecisionMissing = useCallback((data: NodeData) => {
    let missing = 0;
    DECISION_DEF.sections.forEach((sec) => sec.fields.forEach((f) => {
      if (!f.required) return;
      if (f.hidden && f.hidden({ decision: data })) return;
      const v = data[f.key];
      if (!v || (typeof v === "string" && v.trim() === "")) missing++;
    }));
    return missing;
  }, []);

  const saveDecision = useCallback(async (data: NodeData) => {
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null; }
    setSaving(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_index: DECISION_IDX, node_key: "decision", data, completed: getDecisionMissing(data) === 0 }),
      });
    } finally {
      setSaving(false);
    }
  }, [id, getDecisionMissing]);

  const handleDecisionChange = (key: string, value: string) => {
    setDecision((prev) => {
      const next = { ...prev, [key]: value };
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => { saveDecision(next); }, 900);
      return next;
    });
  };

  const handleDecisionAiSuggest = async (field: Field) => {
    const existing = decision[field.key] || "";
    if (existing.trim() && !window.confirm("Esto va a reemplazar lo que ya escribiste en este campo. ¿Continuar?")) return;
    setAiLoading((prev) => new Set(prev).add(field.key));
    setAiErrors((prev) => { const next = { ...prev }; delete next[field.key]; return next; });
    try {
      const allData: Partial<Record<NodeKey, NodeData>> = {};
      NODE_DEFINITIONS.forEach((n) => { allData[n.key] = nodes.find((x) => x.node_key === n.key)?.data ?? {}; });
      allData.decision = decision;
      const res = await fetch("/api/campaigns-planeacion/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nodeKey: "decision", fieldKey: field.key, fieldLabel: field.label, hint: field.hint, placeholder: field.placeholder, allData }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar la sugerencia.");
      handleDecisionChange(field.key, json.suggestion);
    } catch (err) {
      setAiErrors((prev) => ({ ...prev, [field.key]: err instanceof Error ? err.message : "Error desconocido" }));
    } finally {
      setAiLoading((prev) => { const next = new Set(prev); next.delete(field.key); return next; });
    }
  };

  const handleCerrar = async () => {
    await saveDecision(decision);
    if (getDecisionMissing(decision) > 0) { setShowValidation(true); return; }
    setClosing(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      setCampaign((prev) => (prev ? { ...prev, status: "completed" } : prev));
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>Cargando dashboard...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const elegibilidad = nd("elegibilidad");
  const calendario = nd("calendario");
  const convocatoria = nd("convocatoria");
  const vitrina = nd("vitrina");
  const handoff = nd("handoff");
  const resultados = nd("resultados");
  const resultadosDone = Object.keys(resultados).length > 0 && nodes.find((x) => x.node_index === RESULTADOS_IDX)?.completed === true;

  const milestones = parseMilestones(calendario.milestones);
  const supplierMessages = parseMessages(convocatoria.messages);
  const dropshipperMessages = parseMessages(vitrina.messages);
  const supplierMessagesDone = supplierMessages.filter((m) => m.body.trim()).length;
  const dropshipperMessagesDone = dropshipperMessages.filter((m) => m.body.trim()).length;

  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";
  const decisionMissing = getDecisionMissing(decision);

  const base = `/proyectos/dinamicas-catalogo/planeacion/${id}`;
  const editHref = (key: NodeKey) => `${base}?node=${key}`;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: TOKENS }} />
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)", padding: "0 32px", height: 52,
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{campaign.name}</span>
        {saving && <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>Guardando…</span>}
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", margin: 0 }}>{identidad.name || campaign.name}</h1>
          <button
            onClick={() => router.push(base)}
            style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "var(--fg)", cursor: "pointer", flexShrink: 0 }}
          >
            ✎ Editar
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <a
            href={ENRIQUE_DOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12.5, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}
          >
            📄 Plantillas WhatsApp (Claude) →
          </a>
          <a
            href={`${base}/elegibles/${SUPPLIER_PREVIEW_TOKEN}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12.5, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}
          >
            🔗 Vista proveedor · prueba →
          </a>
        </div>

        <div style={{ marginBottom: 24 }}>
          <PhaseTabs
            campaignId={id}
            active="resumen"
            planningComplete={planningComplete}
            isActive={isActive}
            resultadosDone={resultadosDone}
          />
        </div>

        {identidad.expected_result && (
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 0 20px", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--fg)" }}>Meta:</strong> {identidad.expected_result}
          </p>
        )}

        {!planningComplete && (
          <div style={{ background: "var(--warn-light)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#92400e" }}>La planeación todavía no está completa — lo que ves abajo puede tener huecos.</span>
            <button onClick={() => router.push(base)} style={{ background: "var(--dropi)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
              Continuar planeación →
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SummaryCard title="Identidad y objetivo" editHref={editHref("identidad")}>
            <Row label="Objetivo"><Chips value={identidad.objective} /></Row>
            <Row label="País"><Chips value={identidad.country} color="#6366F1" /></Row>
            <Row label="Responsable" value={identidad.responsible} />
            <Row label="Hipótesis" value={identidad.hypothesis} />
          </SummaryCard>

          <SummaryCard title="Elegibilidad" editHref={editHref("elegibilidad")}>
            <Row label="Tipo de supplier"><Chips value={elegibilidad.supplier_type} color="#0EA5E9" /></Row>
            <Row label="Stock mínimo" value={elegibilidad.min_stock} />
            <Row label="Descuento" value={elegibilidad.min_discount || "No requiere"} />
            <Row label="Categorías" value={elegibilidad.categories_scope === "Todas las categorías" ? "Todas" : elegibilidad.categories_theme} />
          </SummaryCard>
        </div>

        <SummaryCard title="Calendario" editHref={editHref("calendario")}>
          {milestones.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Sin hitos todavía.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {milestones.map((m, i) => {
                const st = MILESTONE_LABEL[milestoneState(m.date)];
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr auto", gap: 12, alignItems: "start", borderBottom: i < milestones.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>{m.date || "Sin fecha"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{m.label}</div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      {st.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SummaryCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SummaryCard
            title="Convocatoria y postulación"
            editHref={editHref("convocatoria")}
            extra={
              <a
                href={ENRIQUE_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
              >
                Plantillas para Enrique →
              </a>
            }
          >
            <Row label="Tipo" value={convocatoria.invite_type} />
            <Row label="Canales"><Chips value={convocatoria.channels} color="#F59E0B" /></Row>
            <Row label="Mensajes">
              {supplierMessages.length === 0 ? (
                <span style={{ color: "#9ca3af" }}>Sin mensajes definidos</span>
              ) : (
                <span>{supplierMessagesDone} de {supplierMessages.length} redactados</span>
              )}
            </Row>
          </SummaryCard>

          <SummaryCard title="Vitrina" editHref={editHref("vitrina")}>
            <Row label="Nombre" value={vitrina.showcase_name} />
            <Row label="Tipo" value={vitrina.showcase_type} />
            <Row label="CTA" value={vitrina.cta_main} />
            <Row label="Mensajes">
              {dropshipperMessages.length === 0 ? (
                <span style={{ color: "#9ca3af" }}>Sin mensajes definidos</span>
              ) : (
                <span>{dropshipperMessagesDone} de {dropshipperMessages.length} redactados</span>
              )}
            </Row>
          </SummaryCard>
        </div>

        <SummaryCard
          title="Handoff operativo"
          editHref={editHref("handoff")}
          extra={
            <button
              onClick={() => router.push(`${base}/handoff`)}
              style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            >
              Ver documento completo →
            </button>
          }
        >
          <Row label="Cronograma" value={handoff.schedule} />
          <Row label="Responsables" value={handoff.area_responsibilities} />
        </SummaryCard>

        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "8px 0 20px" }}>
          Los números agregados de la campaña (órdenes, GMV, embudos) viven en la tab <strong>Métricas</strong>. El seguimiento por proveedor (clics, Meet, productos, órdenes) vive en <strong>Seguimiento</strong>.
        </p>

        <div style={{ marginTop: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--fg)", margin: "0 0 4px" }}>Decisión</h3>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 10px" }}>Con los resultados reales en mano: ¿escalamos, iteramos o pausamos?</p>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 22px" }}>
            {campaign.status === "completed" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px", marginBottom: 16, fontSize: 12.5, color: "#374151", fontWeight: 600 }}>
                ✓ Campaña cerrada
              </div>
            )}
            {showValidation && decisionMissing > 0 && (
              <div style={{ background: "var(--warn-light)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: 0 }}>
                  Faltan {decisionMissing} campo{decisionMissing > 1 ? "s" : ""} obligatorio{decisionMissing > 1 ? "s" : ""} para cerrar la campaña.
                </p>
              </div>
            )}
            {DECISION_DEF.sections.map((sec) => {
              const visibleFields = sec.fields.filter((f) => !(f.hidden && f.hidden({ decision })));
              return (
                <div key={sec.key}>
                  {visibleFields.map((f) => (
                    <FieldInput
                      key={f.key}
                      field={f}
                      value={decision[f.key] || ""}
                      onChange={(v) => handleDecisionChange(f.key, v)}
                      onAiSuggest={f.aiSuggest ? () => handleDecisionAiSuggest(f) : undefined}
                      aiLoading={aiLoading.has(f.key)}
                      aiError={aiErrors[f.key]}
                    />
                  ))}
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={handleCerrar}
                disabled={closing}
                style={{ background: "var(--dropi)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: closing ? "default" : "pointer" }}
              >
                {closing ? "Cerrando..." : "✓ Cerrar campaña"}
              </button>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
