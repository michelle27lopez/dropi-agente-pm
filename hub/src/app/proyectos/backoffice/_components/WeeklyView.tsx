"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WeeklyBackoffice, Block } from "../_lib/data";

const ACCENT = "#6366F1";

const CALLOUT_STYLE: Record<string, { bg: string; border: string; label: string; text: string }> = {
  danger: { bg: "#FEF2F2", border: "#FCA5A5", label: "#991B1B", text: "#7F1D1D" },
  warning: { bg: "#FFFBEB", border: "#FDE68A", label: "#92400E", text: "#78350F" },
  info: { bg: "#EFF6FF", border: "#93C5FD", label: "#1E40AF", text: "#1E3A8A" },
};

function BlockView({ block }: { block: Block }) {
  if (block.type === "p") {
    return <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.65, margin: "0 0 12px 0" }}>{block.text}</p>;
  }
  if (block.type === "callout") {
    const s = CALLOUT_STYLE[block.tone];
    return (
      <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: s.label, marginBottom: 4 }}>{block.label}</div>
        <p style={{ fontSize: 12.5, color: s.text, lineHeight: 1.6, margin: 0 }}>{block.text}</p>
      </div>
    );
  }
  // list
  return (
    <div style={{ marginBottom: 12 }}>
      {block.label && (
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{block.label}</div>
      )}
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {block.items.map((item, i) => (
          <li key={i} style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6, marginBottom: 4 }}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TemaCard({ tema }: { tema: WeeklyBackoffice["temas"][number] }) {
  return (
    <div style={{ borderLeft: `4px solid ${tema.color}`, background: "#fff", border: "1px solid #E2E8F0", borderLeftWidth: 4, borderLeftColor: tema.color, borderRadius: "0 12px 12px 0", padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14.5, fontWeight: 800, color: "#0F172A" }}>{tema.titulo}</span>
        {tema.badge && (
          <span style={{ fontSize: 11, fontWeight: 700, color: tema.color, background: `${tema.color}15`, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
            {tema.badge}
          </span>
        )}
      </div>

      {tema.blocks.map((b, i) => <BlockView key={i} block={b} />)}

      {tema.acciones && tema.acciones.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #E2E8F0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#64748B", marginBottom: 8 }}>
            Compromisos
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {tema.acciones.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5 }}>
                <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: ACCENT, background: "#EEF2FF", borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" }}>
                  {a.owner}
                </span>
                <span style={{ color: "#334155", lineHeight: 1.5 }}>{a.texto}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeekAccordion({ week, isOpen, onToggle }: { week: WeeklyBackoffice; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: "#fff", border: `2px solid ${isOpen ? ACCENT : "#E2E8F0"}`, borderRadius: 16, marginBottom: 16, overflow: "hidden", boxShadow: isOpen ? "0 4px 20px rgba(99,102,241,0.08)" : "none", transition: "border-color 0.15s" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", background: isOpen ? "linear-gradient(90deg,#EEF2FF 0%,#FAF5FF 100%)" : "#ffffff", border: "none", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, background: "#fff", padding: "4px 10px", borderRadius: 8, border: "1px solid #C7D2FE", whiteSpace: "nowrap" }}>
            📅 {week.fecha}
          </span>
          <span style={{ fontSize: 13.5, color: "#334155" }}>{week.foco}</span>
          {week.asistentes && (
            <span style={{ fontSize: 11.5, color: "#94A3B8" }}>👥 {week.asistentes}</span>
          )}
        </div>
        {isOpen ? <ChevronUp size={20} color={ACCENT} /> : <ChevronDown size={20} color="#94A3B8" />}
      </button>

      {isOpen && (
        <div style={{ padding: 22, background: "#FAFAFA", borderTop: "1px solid #E0E7FF" }}>
          {week.temas.map((tema, i) => <TemaCard key={i} tema={tema} />)}
        </div>
      )}
    </div>
  );
}

export default function WeeklyBackofficeView({ weeklies }: { weeklies: WeeklyBackoffice[] }) {
  const [openId, setOpenId] = useState<string | null>(weeklies[0]?.id ?? null);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>
          Célula Backoffice
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Weekly · Actualización de Proyectos</h1>
        <p style={{ fontSize: 13.5, color: "#64748B", marginTop: 6 }}>
          Registro histórico semanal, separado por acordeones por fecha — más reciente arriba.
        </p>
      </div>

      {weeklies.length === 0 && (
        <p style={{ fontSize: 13, color: "#64748B" }}>Aún no hay weeklies registrados.</p>
      )}

      {weeklies.map((week) => (
        <WeekAccordion
          key={week.id}
          week={week}
          isOpen={openId === week.id}
          onToggle={() => setOpenId(openId === week.id ? null : week.id)}
        />
      ))}
    </div>
  );
}
