"use client";

import { useState, type FormEvent } from "react";

export type Proyecto = {
  id: string; name: string; project_code: string | null;
  status: string | null; type: string | null; handoff_status: string | null;
  summary: string | null; business_area: string | null; prototype_url: string | null;
  parent_project_id: string | null; estado_interno: string | null; vpv: number | null;
};

export const ESTADOS_DISCOVERY = ["Research", "Ideación", "Concepción de experimento"];
export const ESTADOS_POC = ["Seguimiento", "En definición", "En priorización"];

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};
const TYPE_ICON: Record<string, string> = {
  Idea: "💡", Oportunidad: "🔭", POC: "🧪", Proyecto: "🚀",
};

function truncate(text: string | undefined | null, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

export function projectUrl(p: Proyecto) {
  return `/proyectos/${p.project_code ? p.project_code.toLowerCase() : p.id}`;
}

export function ProjectCard({
  project, dark, canCreate, pocs, onEstadoChange, onVpvChange, onCrearPoc,
  urlOverride, colorOverride, iconOverride,
}: {
  project: Proyecto;
  dark: boolean;
  canCreate: boolean;
  pocs: Proyecto[];
  onEstadoChange: (id: string, estado: string) => void;
  onVpvChange: (id: string, vpv: number | null) => void;
  onCrearPoc: (parent: Proyecto, name: string, summary: string) => Promise<void>;
  // Los homes "curados" (ej. la raíz de Suppliers) ya tenían su propia
  // url/color/icon por código de proyecto antes de este componente — se
  // respetan aquí para no perder esa curaduría visual.
  urlOverride?: string;
  colorOverride?: string;
  iconOverride?: string;
}) {
  const [showPocForm, setShowPocForm] = useState(false);
  const [pocName, setPocName] = useState("");
  const [pocSummary, setPocSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tag = project.project_code ?? project.handoff_status ?? "Sin código";
  const color = colorOverride ?? (project.handoff_status && HANDOFF_COLOR[project.handoff_status]) ?? "#94A3B8";
  const icon = iconOverride ?? (project.type && TYPE_ICON[project.type]) ?? "📁";
  const url = urlOverride ?? projectUrl(project);
  const isPoc = project.type === "POC";
  const estados = isPoc ? ESTADOS_POC : ESTADOS_DISCOVERY;

  const fg = dark ? "#fff" : "var(--fg)";
  const muted = dark ? "rgba(255,255,255,0.45)" : "var(--muted)";
  const cardBorder = dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid var(--border)";
  const inputBg = dark ? "#0c1020" : "#fff";
  const inputBorder = dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid var(--border)";

  async function submitPoc(e: FormEvent) {
    e.preventDefault();
    if (!pocName.trim() || !pocSummary.trim()) return;
    setSubmitting(true);
    await onCrearPoc(project, pocName.trim(), pocSummary.trim());
    setSubmitting(false);
    setShowPocForm(false);
    setPocName("");
    setPocSummary("");
  }

  return (
    <div
      className={dark ? "glass-card" : undefined}
      style={{
        background: dark ? undefined : "var(--card)",
        border: dark ? undefined : cardBorder,
        borderRadius: 12, padding: 20,
        display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12,
      }}
    >
      <a href={url} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 800, background: `${color}${dark ? "25" : "18"}`, color, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
            {tag}
          </span>
          <span style={{ fontSize: 14 }}>{icon}</span>
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: fg, marginBottom: 6 }}>{project.name}</h4>
        <p style={{ fontSize: 12, color: muted, lineHeight: 1.5, marginBottom: 0 }}>
          {truncate(project.summary ?? project.business_area ?? "Sin descripción aún.", 160)}
        </p>
      </a>

      {canCreate && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase" }}>Estado interno</label>
          <select
            value={project.estado_interno ?? ""}
            onChange={(e) => onEstadoChange(project.id, e.target.value)}
            style={{ fontSize: 12, padding: "6px 8px", borderRadius: 6, border: inputBorder, background: inputBg, color: fg }}
          >
            <option value="" disabled>Sin definir</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      )}

      {isPoc && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", whiteSpace: "nowrap" }}>VPV</label>
          {canCreate ? (
            <input
              type="number"
              defaultValue={project.vpv ?? ""}
              onBlur={(e) => onVpvChange(project.id, e.target.value === "" ? null : Number(e.target.value))}
              placeholder="Valor Potencial Validado"
              style={{ fontSize: 12, padding: "6px 8px", borderRadius: 6, border: inputBorder, background: inputBg, color: fg, width: "100%" }}
            />
          ) : (
            <span style={{ fontSize: 12, color: fg, fontWeight: 700 }}>{project.vpv ?? "—"}</span>
          )}
        </div>
      )}

      {!isPoc && pocs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {pocs.map((p) => (
            <a
              key={p.id}
              href={projectUrl(p)}
              style={{ fontSize: 11, fontWeight: 700, color: "#F77F00", background: dark ? "rgba(247,127,0,0.12)" : "#FFF7ED", padding: "3px 8px", borderRadius: 999, textDecoration: "none" }}
            >
              🧪 {p.name}
            </a>
          ))}
        </div>
      )}

      {!isPoc && canCreate && (
        showPocForm ? (
          <form onSubmit={submitPoc} style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: cardBorder, paddingTop: 10 }}>
            <input
              value={pocName}
              onChange={(e) => setPocName(e.target.value)}
              placeholder="Nombre del POC"
              required
              style={{ fontSize: 12, padding: "6px 8px", borderRadius: 6, border: inputBorder, background: inputBg, color: fg }}
            />
            <textarea
              value={pocSummary}
              onChange={(e) => setPocSummary(e.target.value)}
              placeholder="De qué se trata"
              required
              rows={2}
              style={{ fontSize: 12, padding: "6px 8px", borderRadius: 6, border: inputBorder, background: inputBg, color: fg, resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#F77F00", border: "none", borderRadius: 6, padding: "6px 10px", cursor: submitting ? "default" : "pointer" }}
              >
                {submitting ? "Creando…" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => setShowPocForm(false)}
                style={{ fontSize: 11, fontWeight: 700, color: muted, background: "none", border: inputBorder, borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowPocForm(true)}
            style={{ fontSize: 11, fontWeight: 700, color: "#F77F00", background: "none", border: `1px dashed ${dark ? "rgba(247,127,0,0.4)" : "#F77F00"}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", alignSelf: "flex-start" }}
          >
            + Crear POC
          </button>
        )
      )}
    </div>
  );
}
