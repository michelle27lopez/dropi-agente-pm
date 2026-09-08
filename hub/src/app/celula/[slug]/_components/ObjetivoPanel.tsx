"use client";

import { useState, type CSSProperties } from "react";

// Panel "Célula" del home: misión / visión / NSM / foco del trimestre. Antes
// era estático ("Pendiente de definir", con un caso especial hardcodeado para
// logística). Ahora es dato editable en `celulas` (059_darwin_celula_objetivos.sql),
// lo edita el lead de la célula o super admin vía PATCH /api/celulas/[slug].

export type Objetivo = {
  mision: string | null;
  vision: string | null;
  nsm: string | null;
  foco_trimestre: string | null;
  enlace_direccionamiento: string | null;
};

const CAMPOS: { key: keyof Objetivo; label: string; placeholder: string; multiline: boolean }[] = [
  { key: "mision", label: "Misión", placeholder: "De qué es dueña la célula, en una frase.", multiline: true },
  { key: "vision", label: "Visión", placeholder: "A dónde quiere llevar su territorio de producto.", multiline: true },
  { key: "nsm", label: "NSM", placeholder: "Métrica norte y su meta (ej. Tasa de entrega ≥ 70%).", multiline: false },
  { key: "foco_trimestre", label: "Foco del trimestre", placeholder: "En qué está puesta la energía este período.", multiline: true },
  { key: "enlace_direccionamiento", label: "Enlace al direccionamiento", placeholder: "https://…", multiline: false },
];

const inputStyle: CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border)",
  fontSize: 12.5, boxSizing: "border-box", fontFamily: "inherit", background: "#fff", color: "var(--fg)",
};

export default function ObjetivoPanel({
  slug,
  objetivo,
  editable,
  onSaved,
}: {
  slug: string;
  objetivo: Objetivo;
  editable: boolean;
  onSaved: (next: Objetivo) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Objetivo>(objetivo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vacio = !objetivo.mision && !objetivo.vision && !objetivo.nsm && !objetivo.foco_trimestre;

  async function guardar() {
    setSaving(true);
    setError(null);
    const payload: Partial<Objetivo> = {};
    for (const { key } of CAMPOS) {
      const v = (form[key] ?? "").trim();
      if (v !== (objetivo[key] ?? "")) payload[key] = v === "" ? null : v;
    }
    if (Object.keys(payload).length === 0) {
      setEditing(false);
      setSaving(false);
      return;
    }
    const res = await fetch(`/api/celulas/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setSaving(false);
    if (!res || !res.ok) {
      const d = res ? await res.json().catch(() => null) : null;
      setError(d?.error ?? "No se pudo guardar.");
      return;
    }
    const data = await res.json();
    onSaved({
      mision: data.mision ?? null,
      vision: data.vision ?? null,
      nsm: data.nsm ?? null,
      foco_trimestre: data.foco_trimestre ?? null,
      enlace_direccionamiento: data.enlace_direccionamiento ?? null,
    });
    setEditing(false);
  }

  return (
    <div className="midia-panel" style={{ marginBottom: 32 }}>
      <div className="midia-panel-header">
        <div className="midia-panel-header-left">
          <span className="midia-panel-label">Célula</span>
        </div>
        {editable && !editing && (
          <button
            onClick={() => { setForm(objetivo); setError(null); setEditing(true); }}
            style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {vacio ? "Definir" : "Editar"}
          </button>
        )}
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CAMPOS.map(({ key, label, placeholder, multiline }) => (
              <label key={key} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{label}</span>
                {multiline ? (
                  <textarea
                    value={form[key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                ) : (
                  <input
                    value={form[key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                )}
              </label>
            ))}
            {error && <p style={{ fontSize: 12, color: "#DC2626", margin: 0 }}>{error}</p>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                style={{ fontSize: 12, fontWeight: 600, fontFamily: "inherit", padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--fg)", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={saving}
                style={{ fontSize: 12, fontWeight: 700, fontFamily: "inherit", padding: "6px 12px", borderRadius: 8, border: "none", background: "var(--dropi)", color: "#fff", cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        ) : vacio ? (
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
            Misión / Visión — <em>Pendiente de definir</em>.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {objetivo.mision && (
              <p style={{ fontSize: 13, color: "var(--fg)", margin: 0, lineHeight: 1.5 }}>{objetivo.mision}</p>
            )}
            {(objetivo.nsm || objetivo.foco_trimestre) && (
              <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                {objetivo.nsm && <><strong style={{ color: "var(--fg)" }}>NSM ·</strong> {objetivo.nsm}<br /></>}
                {objetivo.foco_trimestre && <><strong style={{ color: "var(--fg)" }}>Foco ·</strong> {objetivo.foco_trimestre}</>}
              </p>
            )}
            {objetivo.vision && (
              <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: "var(--fg)" }}>Visión ·</strong> {objetivo.vision}
              </p>
            )}
            {objetivo.enlace_direccionamiento && (
              <a href={objetivo.enlace_direccionamiento} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--muted)" }}>
                Direccionamiento ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
