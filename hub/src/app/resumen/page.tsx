"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// ─────────────────────────────────────────────────────────────────────────────
// Resumen ejecutivo cross-célula. Todo sale de /api/resumen (BD en vivo):
// objetivo/enfoque de cada célula + estado real de sus proyectos + últimos
// updates + bloqueadores + próximos hitos. Cero contenido hardcodeado.
// ─────────────────────────────────────────────────────────────────────────────

type Hito = {
  code: string | null;
  name: string;
  label: string;
  fecha: string | null;
  dias: number;
  confirmada: boolean;
};

type Bloqueador = {
  code: string | null;
  name: string;
  prioridad: string | null;
  estado: string | null;
  motivo: string;
};

type UpdatePreview = { week_date: string; title: string; preview: string };

type CelulaResumen = {
  id: string;
  nombre: string;
  slug: string;
  lead: string | null;
  area: string | null;
  objetivo: {
    mision: string | null;
    vision: string | null;
    nsm: string | null;
    foco_trimestre: string | null;
    enlace_direccionamiento: string | null;
  };
  proyectos_total: number;
  etapas: { discovery: number; poc: number; delivery: number; following: number };
  salud: {
    semaforo: "verde" | "ambar" | "rojo";
    p0_sin_fecha: number;
    estancados: number;
    dias_ultimo_update: number | null;
  };
  bloqueadores: Bloqueador[];
  ultimo_weekly: UpdatePreview | null;
  ultimo_cell_board: UpdatePreview | null;
  proximos_hitos: Hito[];
};

const SEMAFORO: Record<CelulaResumen["salud"]["semaforo"], { color: string; label: string }> = {
  verde: { color: "#22C55E", label: "En marcha" },
  ambar: { color: "#F59E0B", label: "Con fricción" },
  rojo: { color: "#DC2626", label: "Atención" },
};

const ETAPA_META: { key: keyof CelulaResumen["etapas"]; label: string; color: string }[] = [
  { key: "discovery", label: "Discovery", color: "#7C3AED" },
  { key: "poc", label: "POC", color: "#0EA5E9" },
  { key: "delivery", label: "Delivery", color: "#F77F00" },
  { key: "following", label: "Following", color: "#22C55E" },
];

const PRIORIDAD_COLOR: Record<string, string> = {
  P0: "#DC2626", P1: "#EA580C", P2: "#D97706", P3: "#2563EB", P4: "#6B7280",
};

function fmtFecha(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

function Semaforo({ estado }: { estado: CelulaResumen["salud"]["semaforo"] }) {
  const s = SEMAFORO[estado];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: s.color }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color }} />
      {s.label}
    </span>
  );
}

function UpdateBlock({ titulo, update }: { titulo: string; update: UpdatePreview | null }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 4px" }}>
        {titulo}
      </p>
      {update ? (
        <>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", margin: 0, lineHeight: 1.4 }}>
            {update.title} <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>· {update.week_date}</span>
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0", lineHeight: 1.5 }}>{update.preview}</p>
        </>
      ) : (
        <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic", margin: 0 }}>Sin registro.</p>
      )}
    </div>
  );
}

function CelulaCard({ c }: { c: CelulaResumen }) {
  const [verBloqueadores, setVerBloqueadores] = useState(false);
  const bloq = verBloqueadores ? c.bloqueadores : c.bloqueadores.slice(0, 2);

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 20, background: "var(--card)", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Encabezado */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)", margin: 0 }}>{c.nombre}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Semaforo estado={c.salud.semaforo} />
            <Link href={`/celula/${c.slug}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
              Ver →
            </Link>
          </div>
        </div>
        {c.lead && <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>Lead: {c.lead}</p>}
      </div>

      {/* Objetivo / enfoque */}
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
        {c.objetivo.mision ? (
          <p style={{ fontSize: 12.5, color: "var(--fg)", margin: 0, lineHeight: 1.5 }}>{c.objetivo.mision}</p>
        ) : (
          <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic", margin: 0 }}>
            Misión sin definir — <Link href={`/celula/${c.slug}`} style={{ color: "var(--dropi)" }}>completar en la home</Link>.
          </p>
        )}
        {c.objetivo.nsm && (
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 0", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--fg)" }}>NSM ·</strong> {c.objetivo.nsm}
          </p>
        )}
        {c.objetivo.foco_trimestre && (
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--fg)" }}>Foco ·</strong> {c.objetivo.foco_trimestre}
          </p>
        )}
        {c.objetivo.enlace_direccionamiento && (
          <a href={c.objetivo.enlace_direccionamiento} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--muted)", display: "inline-block", marginTop: 6 }}>
            Direccionamiento ↗
          </a>
        )}
      </div>

      {/* Etapas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--fg)", background: "var(--bg)", borderRadius: 999, padding: "3px 9px" }}>
          {c.proyectos_total} proyecto{c.proyectos_total === 1 ? "" : "s"}
        </span>
        {ETAPA_META.map((e) => (
          <span key={e.key} style={{ fontSize: 11, fontWeight: 600, color: e.color, background: `${e.color}15`, borderRadius: 999, padding: "3px 9px" }}>
            {c.etapas[e.key]} · {e.label}
          </span>
        ))}
      </div>

      {/* Salud */}
      <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: "2px 12px" }}>
        <span>{c.salud.estancados} estancado{c.salud.estancados === 1 ? "" : "s"} (&gt;21d)</span>
        <span>·</span>
        <span>
          {c.salud.dias_ultimo_update === null
            ? "Sin updates registrados"
            : `Último update hace ${c.salud.dias_ultimo_update}d`}
        </span>
        {c.salud.p0_sin_fecha > 0 && (
          <>
            <span>·</span>
            <span style={{ color: "#DC2626", fontWeight: 700 }}>{c.salud.p0_sin_fecha} P0 sin fecha</span>
          </>
        )}
      </div>

      {/* Bloqueadores */}
      {c.bloqueadores.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>
            Bloqueadores de delivery
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {bloq.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, marginTop: 2, flexShrink: 0,
                  color: b.prioridad ? PRIORIDAD_COLOR[b.prioridad] : "var(--gray-400)",
                  border: `1px solid ${b.prioridad ? PRIORIDAD_COLOR[b.prioridad] : "var(--gray-300)"}`,
                  borderRadius: 999, padding: "0 5px",
                }}>
                  {b.prioridad ?? "—"}
                </span>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", margin: 0 }}>
                    {b.name} {b.code && <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>· {b.code}</span>}
                  </p>
                  <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "1px 0 0" }}>{b.motivo}</p>
                </div>
              </div>
            ))}
          </div>
          {c.bloqueadores.length > 2 && (
            <button
              onClick={() => setVerBloqueadores((v) => !v)}
              style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "var(--dropi)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {verBloqueadores ? "Ver menos" : `Ver más (+${c.bloqueadores.length - 2})`}
            </button>
          )}
        </div>
      )}

      {/* Últimos updates */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <UpdateBlock titulo="Último Cell Board" update={c.ultimo_cell_board} />
        <UpdateBlock titulo="Último Weekly" update={c.ultimo_weekly} />
      </div>

      {/* Próximos hitos */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 8px" }}>
          Próximos hitos (60 días)
        </p>
        {c.proximos_hitos.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic", margin: 0 }}>Nada en el horizonte.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {c.proximos_hitos.map((h, i) => (
              <div key={i} style={{ fontSize: 12, color: "var(--fg)", display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, minWidth: 52, color: "var(--muted)" }}>{fmtFecha(h.fecha)}</span>
                <span style={{ flex: 1 }}>
                  {h.label}: {h.name}
                  {h.code && <span style={{ color: "var(--gray-400)" }}> · {h.code}</span>}
                </span>
                {!h.confirmada && (
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "#B45309", background: "#FEF3C7", borderRadius: 999, padding: "0 6px" }}>
                    tentativa
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResumenPage() {
  const [celulas, setCelulas] = useState<CelulaResumen[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/resumen")
      .then(async (res) => {
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          throw new Error(d?.error ?? "No se pudo cargar el resumen.");
        }
        return res.json();
      })
      .then((data) => setCelulas(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: 0, background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <HubHeader title="Resumen ejecutivo" subtitle="Vista cross-célula · Darwin" currentSlug="resumen" />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
            Estado en vivo de cada célula: qué persigue, cómo van sus proyectos por etapa, sus últimos
            updates, los bloqueadores de delivery y los próximos hitos. Todo desde la BD.
          </p>

          {error && <p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p>}
          {!celulas && !error && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24, alignItems: "start" }}>
            {celulas?.map((c) => <CelulaCard key={c.id} c={c} />)}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
