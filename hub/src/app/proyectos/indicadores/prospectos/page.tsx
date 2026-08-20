"use client";

import "primeicons/primeicons.css";
import { useEffect, useMemo, useState } from "react";

// ─── Tokens reales · dropi-prototypes/src/styles/_variables-new.scss ──────────
// Leídos del SCSS que gobierna las páginas "new" reales (catálogo, descuentos,
// sidebar-new) — no del JSON de ds-registry, que quedó desactualizado frente
// a la implementación real (radios, focus-color y paleta no coinciden).
const DS = {
  primary50: "#FEF8F1", primary100: "#FDE8D0", primary300: "#F8B76D",
  primary400: "#F6A855", primary500: "#FF6102", primary600: "#D98432",
  gray50: "#F7F8FA", gray100: "#EEF0F4", gray200: "#C3C9D9", gray300: "#A3ABBF",
  gray400: "#858EA6", gray500: "#69738C", gray600: "#475066", gray700: "#333B4D",
  white: "#FFFFFF",
  success100: "#C3EDDF", success500: "#0ABB87", success700: "#077E5B",
  warning100: "#FCECC8", warning500: "#F1B44C", warning800: "#7D5D26",
  error100: "#FCD4D4", error500: "#F46A6B", error700: "#AA4849",
  info100: "#CBE2F9", info500: "#50A5F1",
  radius1: "4px", radius2: "8px", radius3: "12px", radius4: "24px", radius5: "32px",
  shadowSmall: "0 8px 12px 0 rgba(0, 0, 0, 0.04)",
  shadowMedium: "0.5px 4px 8px rgba(0, 0, 0, 0.08)",
  font: "'Inter', sans-serif",
};

const card: React.CSSProperties = {
  background: DS.white, border: `1px solid ${DS.gray100}`, borderRadius: DS.radius3, padding: 20,
};
const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: DS.gray700, marginBottom: 4 };
const sectionSub: React.CSSProperties = { fontSize: 14, color: DS.gray500, lineHeight: 1.5 };
// Pastilla sólida de color + texto blanco — patrón real de la tabla de
// Productos v2.0 (Figma node 10196:104642, componente "Tag"), no el tinte
// suave que usábamos antes.
const tag = (color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 5, borderRadius: DS.radius5,
  padding: "4px 8px", fontSize: 12, fontWeight: 500, color: DS.white, background: color, whiteSpace: "nowrap",
});
// Header y celdas: fondo blanco (no gris), texto gris-700 Bold 12 en header y
// gris-600 Regular 14 en celdas — igual que "Column-Table"/"Cell 1" reales.
const thStyle: React.CSSProperties = {
  color: DS.gray700, background: DS.white, fontSize: 12, fontWeight: 700,
  padding: "16px 12px", borderBottom: `1px solid ${DS.gray100}`, textAlign: "left",
};
const tdStyle: React.CSSProperties = { padding: "12px", borderBottom: `1px solid ${DS.gray100}`, fontSize: 14, color: DS.gray600 };
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };
const inputStyle: React.CSSProperties = {
  height: 40, fontSize: 14, color: DS.gray700, background: DS.white,
  border: `1px solid ${DS.gray200}`, borderRadius: DS.radius3, padding: "0 12px",
};
const btnPrimary = (disabled: boolean): React.CSSProperties => ({
  height: 40, fontSize: 14, fontWeight: 700, borderRadius: DS.radius3, padding: "0 18px",
  display: "inline-flex", alignItems: "center", gap: 8,
  background: disabled ? DS.gray100 : DS.primary500, color: disabled ? DS.gray400 : DS.white,
  border: "none", cursor: disabled ? "not-allowed" : "pointer",
});
const btnSecondary = (disabled: boolean): React.CSSProperties => ({
  height: 40, fontSize: 14, fontWeight: 600, borderRadius: DS.radius3, padding: "0 16px",
  display: "inline-flex", alignItems: "center", gap: 8,
  background: "transparent", color: disabled ? DS.gray300 : DS.primary500,
  border: `1px solid ${disabled ? DS.gray200 : DS.primary500}`, cursor: disabled ? "not-allowed" : "pointer",
});
const btnTertiary = (disabled: boolean): React.CSSProperties => ({
  fontSize: 13, fontWeight: 600, background: "transparent", border: "none",
  display: "inline-flex", alignItems: "center", gap: 6,
  color: disabled ? DS.gray300 : DS.gray500, cursor: disabled ? "not-allowed" : "pointer", padding: "6px 4px",
});
// Icon-button de fila: ícono plano gris-600, sin círculo de fondo — el mismo
// patrón que la columna "Acciones" real (Figma node 10196:104758, Cell 7:
// iconos outline 24px en fila, sin chip de color detrás de cada uno).
const btnIcon = (disabled: boolean): React.CSSProperties => ({
  width: 28, height: 28, border: "none", background: "transparent",
  color: disabled ? DS.gray300 : DS.gray600,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: disabled ? "not-allowed" : "pointer", fontSize: 18, flexShrink: 0,
});

type Prospecto = {
  id: string; nombre: string; email: string; nivelActual: string; nivelObjetivo: string;
  ordenesMovilizadas90d: number | null; umbralObjetivo: number; pctUmbral: number;
  despachosPct: number | null; garantiasGestionPct: number | null;
};
type Perdido = {
  id: string; nombre: string; nivelObjetivo: string;
  ordenesMovilizadas90d: number | null; umbralObjetivo: number; pctUmbral: number; perdidoEn: string | null;
};
type Dataset = { generadoEn: string; fuente: string; total: number; prospectos: Prospecto[]; perdidos: Perdido[] };
type Oferta = {
  token: string; supplier_id: number; supplier_name: string; nivel_objetivo: string;
  estado: "pendiente_envio" | "enviada" | "aceptada" | "rechazada";
  motivo_rechazo: string | null; enviada_at?: string; respondida_at?: string;
};

const OFERTA_COLOR: Record<string, string> = {
  "pendiente_envio": DS.gray400,
  "enviada": DS.warning500,
  "aceptada": DS.success500,
  "rechazada": DS.error500,
};
const OFERTA_LABEL: Record<string, string> = {
  "pendiente_envio": "Sin avisar todavía",
  "enviada": "Avisado · esperando",
  "aceptada": "Aceptó",
  "rechazada": "Rechazó",
};

function estadoDe(pct: number): "Listo" | "En camino" | "Lejano" {
  if (pct >= 1) return "Listo";
  if (pct >= 0.5) return "En camino";
  return "Lejano";
}
const ESTADO_COLOR: Record<string, string> = {
  "Listo": DS.success500,
  "En camino": DS.warning500,
  "Lejano": DS.gray400,
};

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const a = partes[0]?.[0] ?? "?";
  const b = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (a + b).toUpperCase();
}

const PAGE_SIZE = 50;
type Nivel = "Verificado" | "Premium";
type Seccion = "resumen" | Nivel | "historial";

const NIVEL_CONFIG: Record<Nivel, { titulo: string; icon: string; explicacion: string }> = {
  Verificado: { titulo: "Rumbo a Verificado", icon: "pi-verified", explicacion: "Estos proveedores ya cumplen lo necesario para subir de Activo a Verificado." },
  Premium: { titulo: "Rumbo a Premium", icon: "pi-star-fill", explicacion: "Estos proveedores ya cumplen lo necesario para subir de Verificado a Premium." },
};
// Insignias reales del producto (assets entregados por Michelle 29/07/2026,
// ver referencia de uso real en el perfil de proveedor de Dropi).
const BADGE_IMG: Record<Nivel, string> = { Verificado: "/badges/verificado.png", Premium: "/badges/premium.png" };

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.min(pct, 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 96 }}>
      <div style={{ height: 6, background: DS.gray100, borderRadius: DS.radius4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: "100%", background: color, borderRadius: DS.radius4, transform: `scaleX(${clamped})`, transformOrigin: "left", transition: "transform 0.4s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{(pct * 100).toFixed(0)}%</span>
    </div>
  );
}

// Tooltip propio (no `title` nativo: aparece con retraso variable del navegador
// y es poco confiable). Se abre al instante al pasar el mouse.
function HoverTip({ text, children, style }: { text: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", cursor: "help", ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: DS.gray700, color: DS.white, fontSize: 12, fontWeight: 500, lineHeight: 1.4,
          padding: "8px 10px", borderRadius: DS.radius2, width: 210, textAlign: "left",
          boxShadow: DS.shadowMedium, zIndex: 20, pointerEvents: "none",
        }}>
          {text}
          <span style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: `5px solid ${DS.gray700}`,
          }} />
        </span>
      )}
    </span>
  );
}

// ─── Sidebar · patrón real de sidebar-new (panel gris claro, item activo con
// fondo blanco + texto naranja — no círculo de color como el JSON viejo decía) ──
function Sidebar({
  seccion, onSeccion, listosVerificado, listosPremium, collapsed, onToggle,
}: {
  seccion: Seccion; onSeccion: (s: Seccion) => void;
  listosVerificado: number; listosPremium: number; collapsed: boolean; onToggle: () => void;
}) {
  const items: { id: Seccion; label: string; icon?: string; badge?: string; count?: number }[] = [
    { id: "resumen", label: "Resumen", icon: "pi-home" },
    { id: "Verificado", label: "Rumbo a Verificado", badge: BADGE_IMG.Verificado, count: listosVerificado },
    { id: "Premium", label: "Rumbo a Premium", badge: BADGE_IMG.Premium, count: listosPremium },
    { id: "historial", label: "Historial", icon: "pi-history" },
  ];

  return (
    <aside style={{
      width: collapsed ? 64 : 220, flexShrink: 0, background: DS.gray50,
      minHeight: "100vh", padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4,
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, padding: "0 8px", height: 20 }}>
        {!collapsed && <img src="/logoDropi.svg" alt="Dropi" style={{ height: 20 }} />}
        <button onClick={onToggle} aria-label="Colapsar menú" style={{ background: "none", border: "none", cursor: "pointer", color: DS.gray400, display: "flex" }}>
          <i className={`pi ${collapsed ? "pi-angle-double-right" : "pi-angle-double-left"}`} style={{ fontSize: 14 }} />
        </button>
      </div>

      {items.map(it => {
        const active = seccion === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onSeccion(it.id)}
            title={collapsed ? it.label : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 10, minHeight: 35,
              padding: "0 8px", borderRadius: DS.radius2, border: "none",
              background: active ? DS.white : "transparent",
              color: active ? DS.primary500 : DS.gray700,
              fontFamily: DS.font, fontWeight: active ? 500 : 400, fontSize: 14,
              cursor: "pointer", textAlign: "left", width: "100%",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            {it.badge ? (
              <img src={it.badge} alt="" style={{ width: 20, height: 20, flexShrink: 0, opacity: active ? 1 : 0.85 }} />
            ) : (
              <i className={`pi ${it.icon}`} style={{ fontSize: 18, flexShrink: 0, opacity: active ? 1 : 0.8 }} />
            )}
            {!collapsed && (
              <>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                {typeof it.count === "number" && it.count > 0 && (
                  <span style={{ minWidth: 16, height: 16, borderRadius: DS.radius4, background: DS.primary500, color: DS.white, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {it.count}
                  </span>
                )}
              </>
            )}
          </button>
        );
      })}

      <div style={{ marginTop: "auto", padding: "10px 8px 0" }}>
        {!collapsed && (
          <span style={{ ...tag(DS.gray400), background: DS.gray100, color: DS.gray600 }} title="Las notificaciones todavía no llegan a proveedores reales">
            <i className="pi pi-info-circle" style={{ fontSize: 11 }} /> Modo de pruebas
          </span>
        )}
      </div>
    </aside>
  );
}

function ProspectosTable({
  prospectos, ofertas, sendingId, onEnviarOferta,
}: {
  prospectos: Prospecto[]; ofertas: Record<string, Oferta>; sendingId: string | null;
  onEnviarOferta: (p: Prospecto) => void;
}) {
  const [estadoFiltro, setEstadoFiltro] = useState<"Listo" | "En camino" | "Todos">("Listo");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prospectos.filter(p => {
      const estado = estadoDe(p.pctUmbral);
      if (estadoFiltro === "Listo" && estado !== "Listo") return false;
      if (estadoFiltro === "En camino" && estado !== "En camino") return false;
      if (q && !p.nombre.toLowerCase().includes(q) && !p.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prospectos, estadoFiltro, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: DS.gray500, marginBottom: 6 }}>Estado ({filtered.length.toLocaleString("es-CO")})</div>
          <div style={{ display: "flex", gap: 8 }}>
            {([
              { value: "Listo", label: "Listos para avisar" },
              { value: "En camino", label: "En camino" },
              { value: "Todos", label: "Todos" },
            ] as const).map(opt => {
              const active = estadoFiltro === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { setEstadoFiltro(opt.value); setPage(1); }}
                  style={{
                    height: 36, padding: "0 16px", borderRadius: DS.radius5, fontSize: 13, fontWeight: 600,
                    border: `1px solid ${active ? DS.primary500 : DS.gray200}`,
                    background: active ? DS.primary500 : DS.white,
                    color: active ? DS.white : DS.gray600,
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <i className="pi pi-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: DS.gray400 }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nombre o email…" style={{ ...inputStyle, minWidth: 260, paddingLeft: 32 }} />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Proveedor</th>
              <th style={thR}>Órdenes 90d</th>
              <th style={thStyle}>Progreso</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Invitación</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => {
              const estado = estadoDe(p.pctUmbral);
              const ec = ESTADO_COLOR[estado];
              const oferta = ofertas[p.id];
              return (
                <tr key={p.id} style={{ background: DS.white }}>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: DS.radius3, background: DS.primary100, color: DS.primary600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {iniciales(p.nombre)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: DS.gray700 }}>{p.nombre}</div>
                        <div style={{ fontSize: 12, color: DS.gray400 }}>{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdR, fontWeight: 700, color: DS.gray700 }}>{p.ordenesMovilizadas90d?.toLocaleString("es-CO") ?? "—"}</td>
                  <td style={tdStyle}><ProgressBar pct={p.pctUmbral} color={ec} /></td>
                  <td style={tdStyle}><span style={tag(ec)}>{estado}</span></td>
                  <td style={tdStyle}>
                    {oferta ? <span style={tag(OFERTA_COLOR[oferta.estado])} title={oferta.motivo_rechazo ?? undefined}>{OFERTA_LABEL[oferta.estado]}</span> : <span style={{ fontSize: 12, color: DS.gray300 }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {!oferta && estado === "Listo" && (
                        <button onClick={() => onEnviarOferta(p)} disabled={sendingId === p.id} title="Avisar a este proveedor" style={btnIcon(sendingId === p.id)}>
                          <i className={`pi ${sendingId === p.id ? "pi-spin pi-spinner" : "pi-send"}`} />
                        </button>
                      )}
                      {oferta && (
                        <a href={`/proyectos/indicadores/ascenso/${oferta.token}`} target="_blank" rel="noreferrer" title="Ver lo que ve el proveedor" style={btnIcon(false)}>
                          <i className="pi pi-eye" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: DS.gray400, padding: "32px 12px", border: "none" }}>Sin resultados para estos filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: DS.gray500 }}>Página {page} de {totalPages}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={btnSecondary(page === 1)}>← Anterior</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={btnSecondary(page === totalPages)}>Siguiente →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel de nivel · un solo componente para Verificado y Premium (antes
// estaba duplicado entero en las dos secciones) ─────────────────────────────
function NivelPanel({
  nivel, prospectos, listos, enCamino, faltanAvisar, enColaNivel, ofertas, sendingId,
  avisando, onAvisarATodos, onEnviarOferta, avanzadoAbierto, onToggleAvanzado,
  totalEnColaGlobal, enviandoWebhook, previewWebhook, onPreviewWebhook, onConfirmarWebhook, onCancelarPreview,
}: {
  nivel: Nivel; prospectos: Prospecto[]; listos: number; enCamino: number;
  faltanAvisar: number; enColaNivel: number; ofertas: Record<string, Oferta>; sendingId: string | null;
  avisando: boolean; onAvisarATodos: () => void; onEnviarOferta: (p: Prospecto) => void;
  avanzadoAbierto: boolean; onToggleAvanzado: () => void;
  totalEnColaGlobal: number; enviandoWebhook: boolean;
  previewWebhook: { enCola: number; proveedores: { supplier_id: number; nombre: string }[] } | null;
  onPreviewWebhook: () => void; onConfirmarWebhook: () => void; onCancelarPreview: () => void;
}) {
  const cfg = NIVEL_CONFIG[nivel];
  const totalPorHacer = faltanAvisar + enColaNivel;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: DS.gray700, marginBottom: 4 }}>
            Rumbo a {nivel}
          </h1>
          <div style={sectionSub}>{cfg.explicacion}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <button onClick={onAvisarATodos} disabled={avisando || totalPorHacer === 0} style={btnPrimary(avisando || totalPorHacer === 0)}>
            <i className="pi pi-send" /> Avisar a los que faltan ({totalPorHacer})
          </button>
          {totalPorHacer === 0 && <span style={{ fontSize: 12, color: DS.gray400 }}>Ya se avisó a todos los que califican.</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Listos", value: listos, color: DS.success500, icon: "pi-check-circle" },
          { label: "En camino", value: enCamino, color: DS.warning500, icon: "pi-clock" },
          { label: "Evaluados", value: prospectos.length, color: DS.info500, icon: "pi-users" },
        ].map(k => (
          <div key={k.label} style={{ ...card, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <i className={`pi ${k.icon}`} style={{ color: k.color, fontSize: 16 }} />
              <span style={{ fontSize: 12, color: DS.gray500 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: DS.gray700 }}>{k.value.toLocaleString("es-CO")}</div>
          </div>
        ))}
      </div>

      <ProspectosTable prospectos={prospectos} ofertas={ofertas} sendingId={sendingId} onEnviarOferta={onEnviarOferta} />

      {nivel === "Premium" && (
        <div style={{ ...card, fontSize: 13, color: DS.gray500, display: "flex", gap: 10 }}>
          <i className="pi pi-info-circle" style={{ color: DS.primary500, flexShrink: 0, marginTop: 2 }} />
          <div><strong style={{ color: DS.gray700 }}>Premium → Exclusivo</strong> no tiene lista propia: los requisitos son los mismos que Premium, la diferencia es un compromiso de exclusividad con Dropi, no un número de órdenes.</div>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${DS.gray100}`, paddingTop: 12 }}>
        <button onClick={onToggleAvanzado} style={btnTertiary(false)}>
          <i className={`pi ${avanzadoAbierto ? "pi-chevron-up" : "pi-chevron-down"}`} /> Opciones avanzadas
        </button>
        {avanzadoAbierto && (
          <div style={{ ...card, marginTop: 10 }}>
            <div style={{ fontSize: 13, color: DS.gray500, marginBottom: 12 }}>
              Envío alternativo por webhook a n8n (Enrique, Growth) — un solo POST con toda la cola pendiente. Contrato aún sin confirmar, úsalo solo si sabes lo que hace.
            </div>
            <button onClick={onPreviewWebhook} disabled={enviandoWebhook || totalEnColaGlobal === 0} style={btnSecondary(enviandoWebhook || totalEnColaGlobal === 0)}>
              <i className="pi pi-eye" /> {enviandoWebhook ? "Consultando…" : `Ver vista previa (${totalEnColaGlobal} en cola total)`}
            </button>
            {previewWebhook && (
              <div style={{ marginTop: 12, background: DS.warning100, borderRadius: DS.radius2, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: DS.warning800, marginBottom: 8 }}>{previewWebhook.enCola} proveedores en un solo POST a pulso_suppliers (tipo &quot;ascenso&quot;)</div>
                <div style={{ fontSize: 12, color: DS.warning800, marginBottom: 10 }}>{previewWebhook.proveedores.slice(0, 8).map(p => p.nombre).join(", ")}{previewWebhook.proveedores.length > 8 ? ` y ${previewWebhook.proveedores.length - 8} más…` : ""}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={onConfirmarWebhook} disabled={enviandoWebhook} style={{ ...btnPrimary(false), background: DS.error500 }}><i className="pi pi-check" /> {enviandoWebhook ? "Enviando…" : "Confirmar envío real"}</button>
                  <button onClick={onCancelarPreview} style={btnSecondary(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type PreviewImportar = {
  archivo: string; fecha_extraccion: string; filas: number; verificado: number; premium: number;
  total_actual: number; delta: number; fecha_extraccion_anterior: string | null; ya_cargado_esta_fecha: boolean;
  nuevos_perdidos: number; nuevos_perdidos_nombres: string[]; a_eliminar: number;
};

export default function ProspectosAscensoPage() {
  const [data, setData] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ofertas, setOfertas] = useState<Record<string, Oferta>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [seccion, setSeccion] = useState<Seccion>("resumen");
  const [collapsed, setCollapsed] = useState(false);
  const [avisando, setAvisando] = useState<{ hechos: number; total: number } | null>(null);
  const [avanzadoAbierto, setAvanzadoAbierto] = useState(false);
  const [enviandoWebhook, setEnviandoWebhook] = useState(false);
  const [previewWebhook, setPreviewWebhook] = useState<{ enCola: number; proveedores: { supplier_id: number; nombre: string }[] } | null>(null);
  const [archivoCsv, setArchivoCsv] = useState<File | null>(null);
  const [importando, setImportando] = useState(false);
  const [previewImportar, setPreviewImportar] = useState<PreviewImportar | null>(null);
  const [errorImportar, setErrorImportar] = useState<string | null>(null);

  function recargarOfertas() {
    return fetch("/api/proyectos/ascenso-ofertas")
      .then(r => r.ok ? r.json() : [])
      .then((rows: Oferta[]) => {
        const map: Record<string, Oferta> = {};
        rows.forEach(o => { map[String(o.supplier_id)] = o; });
        setOfertas(map);
        return rows;
      })
      .catch(() => [] as Oferta[]);
  }

  useEffect(() => {
    fetch("/api/proyectos/prospectos-ascenso")
      .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then((d: Dataset) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    recargarOfertas();
  }, []);

  const aVerificado = useMemo(() => data?.prospectos.filter(p => p.nivelObjetivo === "Verificado") ?? [], [data]);
  const aPremium = useMemo(() => data?.prospectos.filter(p => p.nivelObjetivo === "Premium") ?? [], [data]);
  const listosVerificado = useMemo(() => aVerificado.filter(p => p.pctUmbral >= 1).length, [aVerificado]);
  const listosPremium = useMemo(() => aPremium.filter(p => p.pctUmbral >= 1).length, [aPremium]);
  const enCaminoVerificado = useMemo(() => aVerificado.filter(p => p.pctUmbral >= 0.5 && p.pctUmbral < 1).length, [aVerificado]);
  const enCaminoPremium = useMemo(() => aPremium.filter(p => p.pctUmbral >= 0.5 && p.pctUmbral < 1).length, [aPremium]);
  const faltanAvisarVerificado = aVerificado.filter(p => p.pctUmbral >= 1 && !ofertas[p.id]).length;
  const faltanAvisarPremium = aPremium.filter(p => p.pctUmbral >= 1 && !ofertas[p.id]).length;

  const ofertasArr = useMemo(() => Object.values(ofertas), [ofertas]);
  const pendientesEnCola = useMemo(() => {
    const rows = ofertasArr.filter(o => o.estado === "pendiente_envio");
    return { total: rows.length, Verificado: rows.filter(o => o.nivel_objetivo === "Verificado").length, Premium: rows.filter(o => o.nivel_objetivo === "Premium").length };
  }, [ofertasArr]);
  const totalAvisados = ofertasArr.length;
  const totalAceptaron = ofertasArr.filter(o => o.estado === "aceptada").length;
  const tasaAceptacion = totalAvisados > 0 ? totalAceptaron / totalAvisados : null;
  const actividadReciente = useMemo(
    () => ofertasArr
      .filter(o => o.estado === "aceptada" || o.estado === "rechazada")
      .sort((a, b) => (b.respondida_at ?? "").localeCompare(a.respondida_at ?? ""))
      .slice(0, 6),
    [ofertasArr]
  );

  async function handleAvisarATodos(nivel: Nivel) {
    setSentNotice(null);
    const faltanEncolar = nivel === "Verificado" ? faltanAvisarVerificado : faltanAvisarPremium;
    const yaEnCola = pendientesEnCola[nivel];
    const total = faltanEncolar + yaEnCola;
    if (total === 0) return;
    setAvisando({ hechos: 0, total });

    if (faltanEncolar > 0) {
      await fetch("/api/proyectos/ascenso-ofertas/batch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nivelObjetivo: nivel }) });
    }

    let hechos = 0;
    let guard = 0;
    while (guard < 200) {
      guard++;
      const res = await fetch("/api/proyectos/ascenso-ofertas/procesar-lote", { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setSentNotice(`Error: ${json.error}`); break; }
      hechos += json.procesados ?? 0;
      setAvisando({ hechos, total });
      const rows = await recargarOfertas();
      const quedanNivel = rows.filter((o: Oferta) => o.nivel_objetivo === nivel && o.estado === "pendiente_envio").length;
      if (quedanNivel === 0 || json.procesados === 0) break;
    }

    setAvisando(null);
    setSentNotice(`Se avisó a ${hechos} proveedores de ${nivel}.`);
  }

  async function handleEnviarOferta(p: Prospecto) {
    setSendingId(p.id);
    setSentNotice(null);
    try {
      const res = await fetch("/api/proyectos/ascenso-ofertas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId: p.id, supplierName: p.nombre, email: p.email, nivelActual: p.nivelActual, nivelObjetivo: p.nivelObjetivo, ordenesMovilizadas90d: p.ordenesMovilizadas90d, umbralObjetivo: p.umbralObjetivo }),
      });
      const json = await res.json();
      if (res.ok) { setOfertas(prev => ({ ...prev, [p.id]: json.oferta })); setSentNotice(`Aviso enviado a ${p.nombre}.`); }
      else setSentNotice(`Error: ${json.error}`);
    } finally {
      setSendingId(null);
    }
  }

  async function handlePreviewWebhook() {
    setEnviandoWebhook(true);
    try {
      const res = await fetch("/api/proyectos/ascenso-ofertas/enviar-webhook", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.dryRun) setPreviewWebhook({ enCola: json.enCola, proveedores: json.proveedores });
      else if (res.ok) setSentNotice(json.mensaje ?? "No hay nada pendiente en la cola.");
      else setSentNotice(`Error: ${json.error}`);
    } finally {
      setEnviandoWebhook(false);
    }
  }

  async function handleConfirmarWebhook() {
    setEnviandoWebhook(true);
    try {
      const res = await fetch("/api/proyectos/ascenso-ofertas/enviar-webhook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmar: true }) });
      const json = await res.json();
      setPreviewWebhook(null);
      if (res.ok) { await recargarOfertas(); setSentNotice(`Webhook confirmado: ${json.enviados} proveedores mandados a n8n.`); }
      else setSentNotice(`Error: ${json.error}`);
    } finally {
      setEnviandoWebhook(false);
    }
  }

  function recargarDataset() {
    setLoading(true);
    return fetch("/api/proyectos/prospectos-ascenso")
      .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then((d: Dataset) => { setData(d); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  async function handlePreviewImportar() {
    if (!archivoCsv) return;
    setImportando(true);
    setErrorImportar(null);
    try {
      const form = new FormData();
      form.append("archivo", archivoCsv);
      const res = await fetch("/api/proyectos/prospectos-ascenso/importar", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok && json.dryRun) setPreviewImportar(json);
      else setErrorImportar(json.error ?? "No se pudo leer el archivo.");
    } finally {
      setImportando(false);
    }
  }

  async function handleConfirmarImportar() {
    if (!archivoCsv) return;
    setImportando(true);
    setErrorImportar(null);
    try {
      const form = new FormData();
      form.append("archivo", archivoCsv);
      form.append("confirmar", "true");
      const res = await fetch("/api/proyectos/prospectos-ascenso/importar", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok) {
        setPreviewImportar(null);
        setArchivoCsv(null);
        setSentNotice(`Datos actualizados: ${json.filas} proveedores (fecha de extracción ${json.fecha_extraccion}).`);
        await recargarDataset();
      } else {
        setErrorImportar(json.error ?? "Error al guardar.");
      }
    } finally {
      setImportando(false);
    }
  }

  const historial = useMemo(() => [...ofertasArr].sort((a, b) => (b.enviada_at ?? "").localeCompare(a.enviada_at ?? "")), [ofertasArr]);

  return (
    <div style={{ minHeight: "100vh", background: DS.white, display: "flex", fontFamily: DS.font }}>
      <Sidebar seccion={seccion} onSeccion={setSeccion} listosVerificado={listosVerificado} listosPremium={listosPremium} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px", display: "flex", flexDirection: "column", gap: 20 }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div>
              <a href="/proyectos/indicadores" style={{ fontSize: 13, color: DS.gray400, textDecoration: "none" }}>← Indicadores · Postulaciones</a>
              {seccion === "resumen" && <h1 style={{ fontSize: 24, fontWeight: 700, color: DS.gray700, marginTop: 8 }}>Resumen</h1>}
              {seccion === "historial" && <h1 style={{ fontSize: 24, fontWeight: 700, color: DS.gray700, marginTop: 8 }}>Historial de invitaciones</h1>}
            </div>
            {seccion === "resumen" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginTop: 2 }}>
                <div style={{ fontSize: 11, color: DS.gray300, fontWeight: 600 }}>Vista previa (datos de prueba)</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["verificado", "premium"] as const).map(nivel => (
                    <div key={nivel} style={{ display: "flex", gap: 2 }}>
                      {(["pendiente", "aceptada"] as const).map(estado => (
                        <a
                          key={estado}
                          href={`/proyectos/indicadores/ascenso/preview-${nivel}-${estado}`}
                          target="_blank"
                          rel="noreferrer"
                          title={`Ver pantalla de ${nivel === "premium" ? "Premium" : "Verificado"} en estado "${estado}"`}
                          style={{ ...btnTertiary(false), textDecoration: "none" }}
                        >
                          {nivel === "premium" ? "Premium" : "Verificado"} · {estado === "aceptada" ? "Confirmado" : "Pendiente"}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loading && <div style={{ ...card, textAlign: "center", color: DS.gray400, fontSize: 14 }}>Cargando…</div>}
          {error && <div style={{ ...card, textAlign: "center", color: DS.error500, fontSize: 14 }}>No se pudo cargar la data. ¿Ya corriste la migración y el seed?</div>}

          {sentNotice && (
            <div style={{ background: sentNotice.startsWith("Error") ? DS.error100 : DS.success100, borderRadius: DS.radius2, padding: "10px 16px", fontSize: 13, color: sentNotice.startsWith("Error") ? DS.error700 : DS.success700, display: "flex", alignItems: "center", gap: 8 }}>
              <i className={`pi ${sentNotice.startsWith("Error") ? "pi-times-circle" : "pi-check-circle"}`} /> {sentNotice}
            </div>
          )}

          {avisando && (
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 600, color: DS.gray700, marginBottom: 10 }}>Avisando… {avisando.hechos} de {avisando.total}</div>
              <div style={{ height: 8, background: DS.gray100, borderRadius: DS.radius4, overflow: "hidden" }}>
                <div style={{ height: "100%", background: DS.primary500, borderRadius: DS.radius4, transform: `scaleX(${avisando.total > 0 ? avisando.hechos / avisando.total : 0})`, transformOrigin: "left", transition: "transform 0.4s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: DS.gray400, marginTop: 8 }}>Puede tardar unos minutos, no cierres esta página.</div>
            </div>
          )}

          {/* ─── Resumen: dashboard ─── */}
          {data && seccion === "resumen" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {[
                  { label: "Listos para avisar", value: listosVerificado + listosPremium, color: DS.success500, icon: "pi-check-circle" },
                  { label: "En camino", value: enCaminoVerificado + enCaminoPremium, color: DS.warning500, icon: "pi-clock" },
                  { label: "Ya avisados", value: totalAvisados, color: DS.info500, icon: "pi-send" },
                  { label: "Aceptaron", value: totalAceptaron, color: DS.primary500, icon: "pi-thumbs-up" },
                ].map(k => (
                  <div key={k.label} style={card}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <i className={`pi ${k.icon}`} style={{ color: k.color, fontSize: 16 }} />
                      <span style={{ fontSize: 12, color: DS.gray500 }}>{k.label}</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DS.gray700 }}>{k.value.toLocaleString("es-CO")}</div>
                  </div>
                ))}
                <div style={card}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <i className="pi pi-percentage" style={{ color: DS.gray700, fontSize: 16 }} />
                    <span style={{ fontSize: 12, color: DS.gray500 }}>Tasa de aceptación</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: DS.gray700 }}>
                    {tasaAceptacion != null ? `${(tasaAceptacion * 100).toFixed(0)}%` : "—"}
                  </div>
                </div>
              </div>

              <div style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ ...sectionTitle, marginBottom: 0 }}>Listos vs. en camino, por nivel</span>
                </div>
                <div style={{ ...sectionSub, fontSize: 12, marginBottom: 18 }}>
                  Umbral = órdenes movilizadas en los últimos 90 días vs. el umbral del nivel objetivo (3.000 → Verificado, 20.000 → Premium).
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {([
                    { n: "Verificado" as Nivel, listos: listosVerificado, enCamino: enCaminoVerificado },
                    { n: "Premium" as Nivel, listos: listosPremium, enCamino: enCaminoPremium },
                  ]).map(row => {
                    const total = row.listos + row.enCamino || 1;
                    const bars = [
                      { key: "listos", value: row.listos, color: DS.success500, textColor: DS.white, sufijo: "listos", tip: "Listos: ya superaron el 100% del umbral de órdenes movilizadas (90 días) de su nivel objetivo." },
                      { key: "enCamino", value: row.enCamino, color: DS.warning500, textColor: DS.gray700, sufijo: "en camino", tip: "En camino: están entre el 50% y el 99% del umbral de órdenes movilizadas (90 días) de su nivel objetivo." },
                    ];
                    const afuera = bars.filter(b => b.value > 0 && b.value / total < 0.08);
                    return (
                      <div key={row.n}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: DS.gray700, fontWeight: 600, marginBottom: 8 }}>
                          <span>{row.n}</span><span style={{ color: DS.gray500, fontWeight: 500 }}>{row.listos + row.enCamino} evaluados</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ display: "flex", flex: 1, height: 36, borderRadius: DS.radius2, overflow: "hidden", background: DS.gray100 }}>
                            {bars.filter(b => b.value > 0).map(b => (
                              <HoverTip key={b.key} text={b.tip} style={{ flex: `${b.value} 1 0%`, minWidth: 0 }}>
                                <div style={{ width: "100%", height: "100%", background: b.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {b.value / total >= 0.08 && (
                                    <span style={{ fontSize: 13, fontWeight: 700, color: b.textColor, whiteSpace: "nowrap" }}>{b.value} · {Math.round((b.value / total) * 100)}%</span>
                                  )}
                                </div>
                              </HoverTip>
                            ))}
                          </div>
                          {afuera.map(b => (
                            <span key={b.key} style={{ fontSize: 12, fontWeight: 600, color: DS.gray500, whiteSpace: "nowrap" }}>
                              {b.value} · {Math.round((b.value / total) * 100)}% {b.sufijo}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: DS.gray500, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${DS.gray100}` }}>
                  <HoverTip text="Ya superaron el 100% del umbral de órdenes movilizadas (90 días) de su nivel objetivo.">
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: DS.success500, marginRight: 5 }} />Listos <i className="pi pi-info-circle" style={{ fontSize: 10, marginLeft: 2 }} />
                  </HoverTip>
                  <HoverTip text="Están entre el 50% y el 99% del umbral de órdenes movilizadas (90 días) de su nivel objetivo.">
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: DS.warning500, marginRight: 5 }} />En camino <i className="pi pi-info-circle" style={{ fontSize: 10, marginLeft: 2 }} />
                  </HoverTip>
                </div>
              </div>

              <div style={card}>
                <div style={{ ...sectionTitle, marginBottom: 14 }}>Actividad reciente</div>
                {actividadReciente.length === 0 ? (
                  <div style={{ fontSize: 13, color: DS.gray400 }}>Todavía no hay respuestas de proveedores.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {actividadReciente.map((o, i) => (
                      <div key={o.token} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i === 0 ? "none" : `1px solid ${DS.gray100}` }}>
                        <div style={{ width: 32, height: 32, borderRadius: DS.radius3, background: DS.primary100, color: DS.primary600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {iniciales(o.supplier_name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: DS.gray700 }}>{o.supplier_name}</div>
                          <div style={{ fontSize: 12, color: DS.gray400 }}>{o.nivel_objetivo}</div>
                        </div>
                        <span style={tag(OFERTA_COLOR[o.estado])}>{OFERTA_LABEL[o.estado]}</span>
                        <span style={{ fontSize: 12, color: DS.gray400, minWidth: 90, textAlign: "right" }}>
                          {o.respondida_at ? new Date(o.respondida_at).toLocaleDateString("es-CO") : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(["Verificado", "Premium"] as Nivel[]).map(n => (
                  <button key={n} onClick={() => setSeccion(n)} style={{ ...card, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={BADGE_IMG[n]} alt="" style={{ width: 22, height: 22 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: DS.gray700 }}>{NIVEL_CONFIG[n].titulo}</span>
                    </div>
                    <i className="pi pi-arrow-right" style={{ color: DS.gray400, fontSize: 13 }} />
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 12, color: DS.gray400, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="pi pi-info-circle" /> Se compara el número de órdenes movilizadas de cada proveedor en los últimos 90 días contra el umbral del siguiente nivel (3.000 → Verificado, 20.000 → Premium). Data actualizada: {data.generadoEn}.
              </div>

              <div style={card}>
                <div style={{ ...sectionTitle, marginBottom: 4 }}>Actualizar datos</div>
                <div style={{ ...sectionSub, marginBottom: 14 }}>
                  Cada semana se sube el export <code>panel_suppliers_YYYYMMDD.csv</code> del panel de proveedores. Se puede reemplazar el archivo tantas veces como se quiera sin duplicar nada: primero se ve un preview, y solo se guarda al confirmar.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={e => { setArchivoCsv(e.target.files?.[0] ?? null); setPreviewImportar(null); setErrorImportar(null); }}
                    style={{ ...inputStyle, padding: "8px 12px", height: "auto" }}
                  />
                  <button onClick={handlePreviewImportar} disabled={!archivoCsv || importando} style={btnSecondary(!archivoCsv || importando)}>
                    <i className={`pi ${importando ? "pi-spin pi-spinner" : "pi-eye"}`} /> Ver preview
                  </button>
                </div>

                {errorImportar && (
                  <div style={{ marginTop: 12, background: DS.error100, color: DS.error700, borderRadius: DS.radius2, padding: "10px 14px", fontSize: 13 }}>
                    {errorImportar}
                  </div>
                )}

                {previewImportar && (
                  <div style={{ marginTop: 12, background: DS.warning100, borderRadius: DS.radius2, padding: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: DS.warning800, marginBottom: 6 }}>
                      {previewImportar.archivo} · fecha de extracción {previewImportar.fecha_extraccion}
                    </div>
                    <div style={{ fontSize: 12, color: DS.warning800, marginBottom: 4 }}>
                      {previewImportar.filas.toLocaleString("es-CO")} proveedores válidos ({previewImportar.verificado.toLocaleString("es-CO")} rumbo a Verificado, {previewImportar.premium.toLocaleString("es-CO")} rumbo a Premium) — actualmente hay {previewImportar.total_actual.toLocaleString("es-CO")} en la base ({previewImportar.delta >= 0 ? "+" : ""}{previewImportar.delta.toLocaleString("es-CO")}).
                    </div>
                    {previewImportar.ya_cargado_esta_fecha && (
                      <div style={{ fontSize: 12, color: DS.warning800, marginBottom: 4 }}>
                        Ya hay datos cargados con esta misma fecha de extracción — confirmar los reemplaza, no los duplica.
                      </div>
                    )}
                    {previewImportar.a_eliminar > 0 && (
                      <div style={{ fontSize: 12, color: DS.warning800, marginBottom: 4 }}>
                        {previewImportar.a_eliminar.toLocaleString("es-CO")} proveedores que ya no vienen en este archivo se eliminarán del panel (no calificaban o ya tenían oferta enviada).
                      </div>
                    )}
                    {previewImportar.nuevos_perdidos > 0 && (
                      <div style={{ fontSize: 12, color: DS.warning800, marginBottom: 4 }}>
                        {previewImportar.nuevos_perdidos.toLocaleString("es-CO")} estaban Listos y nadie les avisó a tiempo — se marcarán como &quot;se le pasó el momento&quot; en Historial, no se borran: {previewImportar.nuevos_perdidos_nombres.join(", ")}{previewImportar.nuevos_perdidos > previewImportar.nuevos_perdidos_nombres.length ? ` y ${previewImportar.nuevos_perdidos - previewImportar.nuevos_perdidos_nombres.length} más…` : ""}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={handleConfirmarImportar} disabled={importando} style={btnPrimary(importando)}>
                        <i className="pi pi-check" /> {importando ? "Guardando…" : "Confirmar y guardar"}
                      </button>
                      <button onClick={() => setPreviewImportar(null)} style={btnSecondary(false)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {data && (seccion === "Verificado" || seccion === "Premium") && (
            <NivelPanel
              nivel={seccion}
              prospectos={seccion === "Verificado" ? aVerificado : aPremium}
              listos={seccion === "Verificado" ? listosVerificado : listosPremium}
              enCamino={seccion === "Verificado" ? enCaminoVerificado : enCaminoPremium}
              faltanAvisar={seccion === "Verificado" ? faltanAvisarVerificado : faltanAvisarPremium}
              enColaNivel={pendientesEnCola[seccion]}
              ofertas={ofertas}
              sendingId={sendingId}
              avisando={!!avisando}
              onAvisarATodos={() => handleAvisarATodos(seccion)}
              onEnviarOferta={handleEnviarOferta}
              avanzadoAbierto={avanzadoAbierto}
              onToggleAvanzado={() => setAvanzadoAbierto(o => !o)}
              totalEnColaGlobal={pendientesEnCola.total}
              enviandoWebhook={enviandoWebhook}
              previewWebhook={previewWebhook}
              onPreviewWebhook={handlePreviewWebhook}
              onConfirmarWebhook={handleConfirmarWebhook}
              onCancelarPreview={() => setPreviewWebhook(null)}
            />
          )}

          {seccion === "historial" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={sectionSub}>Todas las invitaciones enviadas, en cualquier nivel.</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr><th style={thStyle}>Proveedor</th><th style={thStyle}>Nivel</th><th style={thStyle}>Estado</th><th style={thStyle}>Enviada</th><th style={thStyle}></th></tr></thead>
                  <tbody>
                    {historial.map((o) => (
                      <tr key={o.token} style={{ background: DS.white }}>
                        <td style={{ ...tdStyle, fontWeight: 600, color: DS.gray700 }}>{o.supplier_name}</td>
                        <td style={tdStyle}>{o.nivel_objetivo}</td>
                        <td style={tdStyle}><span style={tag(OFERTA_COLOR[o.estado])} title={o.motivo_rechazo ?? undefined}>{OFERTA_LABEL[o.estado]}</span></td>
                        <td style={tdStyle}>{o.enviada_at ? new Date(o.enviada_at).toLocaleDateString("es-CO") : "—"}</td>
                        <td style={tdStyle}>
                          <a href={`/proyectos/indicadores/ascenso/${o.token}`} target="_blank" rel="noreferrer" title="Ver lo que ve el proveedor" style={btnIcon(false)}>
                            <i className="pi pi-eye" />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {historial.length === 0 && (
                      <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: DS.gray400, padding: "32px 12px", border: "none" }}>Todavía no se ha avisado a nadie.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data && data.perdidos.length > 0 && (
                <>
                  <div style={{ ...sectionTitle, marginTop: 10, marginBottom: 0 }}>Se le pasó el momento</div>
                  <div style={sectionSub}>
                    Estaban Listos, nadie alcanzó a avisarles, y en una carga semanal posterior dejaron de cumplir el umbral. No se borraron para que quede registro — si vuelven a calificar, reaparecen solos en la lista de Listos.
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr><th style={thStyle}>Proveedor</th><th style={thStyle}>Nivel</th><th style={thR}>Últimas órdenes 90d</th><th style={thStyle}>Se le pasó el</th></tr></thead>
                      <tbody>
                        {data.perdidos.map((p) => (
                          <tr key={p.id} style={{ background: DS.white }}>
                            <td style={{ ...tdStyle, fontWeight: 600, color: DS.gray700 }}>{p.nombre}</td>
                            <td style={tdStyle}>{p.nivelObjetivo}</td>
                            <td style={tdR}>{p.ordenesMovilizadas90d?.toLocaleString("es-CO") ?? "—"}</td>
                            <td style={tdStyle}>{p.perdidoEn ? new Date(p.perdidoEn).toLocaleDateString("es-CO") : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
