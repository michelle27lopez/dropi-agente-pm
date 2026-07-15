"use client";

import { useEffect, useMemo, useState } from "react";

// ─── Shared styles (consistentes con /proyectos/indicadores) ─────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13,
};
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };
const selectStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "var(--fg)", background: "var(--card)",
  border: "1px solid var(--border)", borderRadius: 8, padding: "7px 10px",
};

const ACCENT = "#6366F1";
const ACCENT_BG = "#EEF2FF";

type Prospecto = {
  id: string;
  nombre: string;
  email: string;
  nivelActual: string;
  nivelObjetivo: string;
  ordenesMovilizadas90d: number | null;
  umbralObjetivo: number;
  pctUmbral: number;
  despachosPct: number | null;
  despachoTiempoH: number | null;
  garantiasRecibidas90d: number | null;
  garantiasGestionPct: number | null;
  garantiasTiempoH: number | null;
};

type Dataset = {
  generadoEn: string;
  fuente: string;
  total: number;
  prospectos: Prospecto[];
};

type Oferta = {
  token: string;
  supplier_id: number;
  estado: "enviada" | "aceptada" | "rechazada";
  motivo_rechazo: string | null;
};

const OFERTA_COLOR: Record<string, [string, string]> = {
  "enviada": ["#F59E0B", "#FFFBEB"],
  "aceptada": ["#10B981", "#ECFDF5"],
  "rechazada": ["#9CA3AF", "#F3F4F6"],
};
const OFERTA_LABEL: Record<string, string> = {
  "enviada": "Enviada · esperando",
  "aceptada": "Aceptó ascenso",
  "rechazada": "Rechazó",
};

function estadoDe(pct: number): "Cumple" | "En camino" | "Lejano" {
  if (pct >= 1) return "Cumple";
  if (pct >= 0.5) return "En camino";
  return "Lejano";
}

const ESTADO_COLOR: Record<string, [string, string]> = {
  "Cumple": ["#10B981", "#ECFDF5"],
  "En camino": ["#F59E0B", "#FFFBEB"],
  "Lejano": ["#9CA3AF", "#F3F4F6"],
};

const PAGE_SIZE = 50;

function NivelSection({
  titulo, sub, color, bg, prospectos, umbral, ofertas, sendingId, onEnviarOferta,
}: {
  titulo: string;
  sub: string;
  color: string;
  bg: string;
  prospectos: Prospecto[];
  umbral: number;
  ofertas: Record<string, Oferta>;
  sendingId: string | null;
  onEnviarOferta: (p: Prospecto) => void;
}) {
  const [estadoFiltro, setEstadoFiltro] = useState<"Cumple" | "En camino" | "Todos">("Cumple");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const cumpleCount = useMemo(() => prospectos.filter(p => p.pctUmbral >= 1).length, [prospectos]);
  const enCaminoCount = useMemo(() => prospectos.filter(p => p.pctUmbral >= 0.5 && p.pctUmbral < 1).length, [prospectos]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prospectos.filter(p => {
      const estado = estadoDe(p.pctUmbral);
      if (estadoFiltro === "Cumple" && estado !== "Cumple") return false;
      if (estadoFiltro === "En camino" && estado !== "En camino") return false;
      if (q && !p.nombre.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prospectos, estadoFiltro, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ ...sectionTitle, color }}>{titulo}</div>
          <div style={sectionSub}>{sub}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: bg, borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 84 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>{cumpleCount.toLocaleString("es-CO")}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color, opacity: 0.8 }}>Cumplen</div>
          </div>
          <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 84 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{enCaminoCount.toLocaleString("es-CO")}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B", opacity: 0.8 }}>En camino</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{filtered.length.toLocaleString("es-CO")} proveedores · ordenado por % del umbral (órdenes movilizadas 90d / {umbral.toLocaleString("es-CO")})</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nombre o email…"
            style={{ ...selectStyle, minWidth: 220 }}
          />
          <select value={estadoFiltro} onChange={e => { setEstadoFiltro(e.target.value as typeof estadoFiltro); setPage(1); }} style={selectStyle}>
            <option value="Cumple">Estado: Cumplen umbral</option>
            <option value="En camino">Estado: En camino (50–99%)</option>
            <option value="Todos">Estado: Todos (incluye lejanos)</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Proveedor</th>
              <th style={thR}>Órdenes mov. 90d</th>
              <th style={thR}>Umbral</th>
              <th style={thR}>% umbral</th>
              <th style={thR}>Despachos %</th>
              <th style={thR}>Garantías gestión %</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Oferta de ascenso</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p, i) => {
              const estado = estadoDe(p.pctUmbral);
              const [ec, eb] = ESTADO_COLOR[estado];
              const oferta = ofertas[p.id];
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {p.nombre}
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>{p.email}</div>
                  </td>
                  <td style={{ ...tdR, fontWeight: 700 }}>{p.ordenesMovilizadas90d?.toLocaleString("es-CO") ?? "—"}</td>
                  <td style={tdR}>{p.umbralObjetivo.toLocaleString("es-CO")}</td>
                  <td style={{ ...tdR, fontWeight: 800, color: ec }}>{(p.pctUmbral * 100).toFixed(1)}%</td>
                  <td style={tdR}>{p.despachosPct != null ? `${(p.despachosPct * 100).toFixed(1)}%` : "—"}</td>
                  <td style={tdR}>{p.garantiasGestionPct != null ? `${(p.garantiasGestionPct * 100).toFixed(1)}%` : "—"}</td>
                  <td style={tdStyle}><span style={tag(ec, eb)}>{estado}</span></td>
                  <td style={tdStyle}>
                    {oferta ? (
                      <span style={tag(...OFERTA_COLOR[oferta.estado])} title={oferta.motivo_rechazo ?? undefined}>
                        {OFERTA_LABEL[oferta.estado]}
                      </span>
                    ) : estado === "Cumple" ? (
                      <button
                        onClick={() => onEnviarOferta(p)}
                        disabled={sendingId === p.id}
                        style={{ ...selectStyle, background: ACCENT, color: "#fff", border: "none", cursor: sendingId === p.id ? "wait" : "pointer", opacity: sendingId === p.id ? 0.6 : 1 }}
                      >
                        {sendingId === p.id ? "Enviando…" : "Enviar oferta →"}
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "var(--muted)", padding: "24px 12px" }}>
                  Sin resultados para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Página {page} de {totalPages}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...selectStyle, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1 }}
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ ...selectStyle, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1 }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProspectosAscensoPage() {
  const [data, setData] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ofertas, setOfertas] = useState<Record<string, Oferta>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/proyectos/prospectos-ascenso")
      .then(r => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((d: Dataset) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    fetch("/api/proyectos/ascenso-ofertas")
      .then(r => r.ok ? r.json() : [])
      .then((rows: Oferta[]) => {
        const map: Record<string, Oferta> = {};
        rows.forEach(o => { map[String(o.supplier_id)] = o; });
        setOfertas(map);
      })
      .catch(() => null);
  }, []);

  async function handleEnviarOferta(p: Prospecto) {
    setSendingId(p.id);
    setSentNotice(null);
    try {
      const res = await fetch("/api/proyectos/ascenso-ofertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: p.id,
          supplierName: p.nombre,
          email: p.email,
          nivelActual: p.nivelActual,
          nivelObjetivo: p.nivelObjetivo,
          ordenesMovilizadas90d: p.ordenesMovilizadas90d,
          umbralObjetivo: p.umbralObjetivo,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setOfertas(prev => ({ ...prev, [p.id]: json.oferta }));
        setSentNotice(`Oferta enviada (modo prueba → ${json.testRecipients?.email} / WhatsApp ${json.testRecipients?.whatsapp})`);
      } else {
        setSentNotice(`Error: ${json.error}`);
      }
    } finally {
      setSendingId(null);
    }
  }

  const aVerificado = useMemo(() => data?.prospectos.filter(p => p.nivelObjetivo === "Verificado") ?? [], [data]);
  const aPremium = useMemo(() => data?.prospectos.filter(p => p.nivelObjetivo === "Premium") ?? [], [data]);

  const resumen = useMemo(() => {
    if (!data) return null;
    const cumple = (arr: Prospecto[]) => arr.filter(p => p.pctUmbral >= 1).length;
    const enCamino = (arr: Prospecto[]) => arr.filter(p => p.pctUmbral >= 0.5 && p.pctUmbral < 1).length;
    return {
      evaluados: data.total,
      totalCumple: cumple(aVerificado) + cumple(aPremium),
      totalEnCamino: enCamino(aVerificado) + enCamino(aPremium),
      aVerificadoCumple: cumple(aVerificado),
      aVerificadoEnCamino: enCamino(aVerificado),
      aPremiumCumple: cumple(aPremium),
      aPremiumEnCamino: enCamino(aPremium),
    };
  }, [data, aVerificado, aPremium]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <a href="/proyectos/indicadores" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          Indicadores · Postulaciones
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Prospectos de Ascenso</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag(ACCENT, ACCENT_BG)}>IND-001</span>
          <span style={tag("#10B981", "#ECFDF5")}>Data real · panel_suppliers</span>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title block */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Prospectos de Ascenso · Activo → Verificado → Premium
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Quién está en el umbral o ya cumple para pasar de nivel, según órdenes movilizadas (90 días).
            {data ? ` Fuente: ${data.fuente} · extraído ${data.generadoEn}.` : ""}
          </p>
        </div>

        {loading && (
          <div style={{ ...card, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Cargando data de proveedores…</div>
        )}
        {error && (
          <div style={{ ...card, textAlign: "center", color: "#EF4444", fontSize: 13 }}>
            No se pudo cargar la data de /api/proyectos/prospectos-ascenso (¿ya corriste la migración y el seed?)
          </div>
        )}

        {sentNotice && (
          <div style={{ background: sentNotice.startsWith("Error") ? "#FEF2F2" : "#ECFDF5", border: `1px solid ${sentNotice.startsWith("Error") ? "#FECACA" : "#A7F3D0"}`, borderRadius: 10, padding: "10px 16px", fontSize: 12, color: sentNotice.startsWith("Error") ? "#7F1D1D" : "#065F46" }}>
            {sentNotice}
          </div>
        )}

        {resumen && (
          <>
            {/* Nota de criterios pendientes */}
            <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "12px 16px", border: "1px solid #FED7AA", fontSize: 12, color: "#9A3412", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>📋</span>
              <div>
                <strong>Solo criterio de órdenes movilizadas.</strong> El panel de origen aún no trae uso de EcomScanner ni frecuencia de manifiestos por proveedor — no se está midiendo eso por ahora. El ranking usa órdenes movilizadas/90d contra el umbral de cada nivel (3.000 → Verificado · 20.000 → Premium), con despachos y garantías como referencia complementaria.
              </div>
            </div>

            {/* Datos globales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              <div style={{ ...card, borderTop: "3px solid var(--fg)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>Operativos evaluados</div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1 }}>{resumen.evaluados.toLocaleString("es-CO")}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Activo + Verificado, con actividad real en 90d</div>
              </div>
              <div style={{ ...card, borderTop: "3px solid #10B981" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>Cumplen umbral (global)</div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "#10B981", lineHeight: 1 }}>{resumen.totalCumple.toLocaleString("es-CO")}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{resumen.aVerificadoCumple.toLocaleString("es-CO")} → Verificado · {resumen.aPremiumCumple.toLocaleString("es-CO")} → Premium</div>
              </div>
              <div style={{ ...card, borderTop: "3px solid #F59E0B" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>En camino · 50–99% (global)</div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "#F59E0B", lineHeight: 1 }}>{resumen.totalEnCamino.toLocaleString("es-CO")}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{resumen.aVerificadoEnCamino.toLocaleString("es-CO")} → Verificado · {resumen.aPremiumEnCamino.toLocaleString("es-CO")} → Premium</div>
              </div>
            </div>

            {/* Tabla 1: Activo → Verificado */}
            <NivelSection
              titulo="Rumbo a Verificado"
              sub={`Activo → Verificado · umbral 3.000 órdenes movilizadas/90d · ${aVerificado.length.toLocaleString("es-CO")} evaluados`}
              color="#3B82F6"
              bg="#EFF6FF"
              prospectos={aVerificado}
              umbral={3000}
              ofertas={ofertas}
              sendingId={sendingId}
              onEnviarOferta={handleEnviarOferta}
            />

            {/* Tabla 2: Verificado → Premium */}
            <NivelSection
              titulo="Rumbo a Premium"
              sub={`Verificado → Premium · umbral 20.000 órdenes movilizadas/90d · ${aPremium.length.toLocaleString("es-CO")} evaluados`}
              color={ACCENT}
              bg={ACCENT_BG}
              prospectos={aPremium}
              umbral={20000}
              ofertas={ofertas}
              sendingId={sendingId}
              onEnviarOferta={handleEnviarOferta}
            />

            {/* Nota Premium → Exclusivo */}
            <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 16px", border: "1px solid #DDD6FE", fontSize: 12, color: "#5B21B6", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
              <div>
                <strong>Premium → Exclusivo no tiene tabla de prospectos.</strong> Los requisitos operativos son idénticos a Premium; el paso a Exclusivo depende del compromiso de exclusividad con Dropi, no de un umbral de órdenes medible en esta data.
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
