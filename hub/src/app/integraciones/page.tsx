"use client";

import { useEffect, useMemo, useState } from "react";

type Celula = { id: string; nombre: string };

type Webhook = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  celula_id: string | null;
  token_prefix: string;
  activo: boolean;
  creado_por: string | null;
  creado_en: string;
  token_rotado_en: string | null;
  ultima_entrega_en: string | null;
  entradas: number;
  entregas: number;
  ultima_ok: boolean | null;
};

type Entrega = {
  id: string;
  recibido_en: string;
  fuente: string;
  ok: boolean;
  registros_recibidos: number;
  registros_escritos: number;
  bytes: number;
  lote_id: string;
  mensaje: string | null;
};

type Entrada = {
  id: string;
  recibido_en: string;
  lote_id: string;
  lote_seq: number;
  payload: unknown;
  lote_meta: Record<string, unknown>;
};

const SIN_CELULA = "__sin__";

function badge(text: string, color: string, bg: string) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color, background: bg,
      border: `1px solid ${color}30`, padding: "2px 9px", borderRadius: 99, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function fecha(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

export default function IntegracionesPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  // Alta
  const [nombre, setNombre] = useState("");
  const [celulaId, setCelulaId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [creando, setCreando] = useState(false);

  // Token recién generado (se muestra una sola vez)
  const [tokenNuevo, setTokenNuevo] = useState<{ nombre: string; slug: string; token: string } | null>(null);

  // Panel de entradas por webhook
  const [abierto, setAbierto] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<{ entregas: Entrega[]; entradas: Entrada[] } | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => { setOrigin(window.location.origin); }, []);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/integraciones/webhooks");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error cargando");
      setWebhooks(data.webhooks ?? []);
      setCelulas(data.celulas ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setCreando(true);
    setError(null);
    try {
      const res = await fetch("/api/integraciones/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, celula_id: celulaId || null, descripcion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear");
      setTokenNuevo({ nombre: data.webhook.nombre, slug: data.webhook.slug, token: data.token });
      setNombre(""); setCelulaId(""); setDescripcion("");
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setCreando(false);
    }
  }

  async function regenerar(w: Webhook) {
    if (!confirm(`Regenerar el token de "${w.nombre}"? El token actual dejará de funcionar de inmediato.`)) return;
    const res = await fetch(`/api/integraciones/webhooks/${w.id}/token`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Error"); return; }
    setTokenNuevo({ nombre: w.nombre, slug: w.slug, token: data.token });
    await cargar();
  }

  async function toggleActivo(w: Webhook) {
    const res = await fetch(`/api/integraciones/webhooks/${w.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !w.activo }),
    });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    await cargar();
  }

  async function eliminar(w: Webhook) {
    if (!confirm(`Eliminar "${w.nombre}" y todo lo que ha recibido? No se puede deshacer.`)) return;
    const res = await fetch(`/api/integraciones/webhooks/${w.id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error"); return; }
    if (abierto === w.id) { setAbierto(null); setDetalle(null); }
    await cargar();
  }

  async function probar(w: Webhook) {
    const res = await fetch(`/api/integraciones/webhooks/${w.id}/prueba`, { method: "POST" });
    const data = await res.json();
    if (abierto === w.id) await verEntradas(w, true);
    await cargar();
    alert(data.ok
      ? `Prueba OK · ${data.registros_escritos} registros escritos`
      : `Prueba con problema: ${data.mensaje ?? JSON.stringify(data)}`);
  }

  async function verEntradas(w: Webhook, forzar = false) {
    if (abierto === w.id && !forzar) { setAbierto(null); setDetalle(null); return; }
    setAbierto(w.id);
    setCargandoDetalle(true);
    setDetalle(null);
    try {
      const res = await fetch(`/api/integraciones/webhooks/${w.id}/entradas`);
      const data = await res.json();
      setDetalle({ entregas: data.entregas ?? [], entradas: data.entradas ?? [] });
    } finally {
      setCargandoDetalle(false);
    }
  }

  const grupos = useMemo(() => {
    const porCelula = new Map<string, { nombre: string; items: Webhook[] }>();
    const nombreDe = (id: string | null) =>
      id ? (celulas.find((c) => c.id === id)?.nombre ?? "Célula desconocida") : "Sin célula";
    for (const w of webhooks) {
      const key = w.celula_id ?? SIN_CELULA;
      if (!porCelula.has(key)) porCelula.set(key, { nombre: nombreDe(w.celula_id), items: [] });
      porCelula.get(key)!.items.push(w);
    }
    return [...porCelula.entries()]
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => (a.key === SIN_CELULA ? 1 : b.key === SIN_CELULA ? -1 : a.nombre.localeCompare(b.nombre)));
  }, [webhooks, celulas]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Integraciones</span>
        </div>
      </header>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
            Integraciones · Webhooks entrantes
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Crea un webhook, copia el token y pásalo a quien va a enviarnos la data (p.ej. Miguel de Data).
            Cada uno queda en la carpeta de su célula y la data llega lista para que la célula la consuma.
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: 20, fontSize: 12, borderRadius: 10, padding: "10px 14px",
            background: "#FEF2F2", border: "1px solid #DC262630", color: "#DC2626",
          }}>{error}</div>
        )}

        {/* Alta */}
        <form onSubmit={crear} style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
          padding: "20px 22px", marginBottom: 28,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>
            Nueva integración
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 5 }}>
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ventas Marcas semanal"
                required
                style={inputStyle}
              />
            </label>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 5 }}>
              Célula
              <select value={celulaId} onChange={(e) => setCelulaId(e.target.value)} style={inputStyle}>
                <option value="">Sin célula</option>
                {celulas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
          </div>
          <label style={{ fontSize: 12, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
            Descripción (opcional)
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Qué manda, cada cuánto, en qué formato"
              style={inputStyle}
            />
          </label>
          <button type="submit" disabled={creando || !nombre.trim()} style={{
            fontSize: 12, fontWeight: 700, color: "#fff",
            background: creando || !nombre.trim() ? "#94A3B8" : "#111827",
            border: "none", borderRadius: 8, padding: "9px 18px", cursor: creando ? "default" : "pointer",
          }}>
            {creando ? "Creando…" : "Crear webhook"}
          </button>
        </form>

        {/* Grupos por célula */}
        {cargando ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</div>
        ) : webhooks.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Todavía no hay webhooks. Crea el primero arriba.</div>
        ) : (
          grupos.map((g) => (
            <section key={g.key} style={{ marginBottom: 30 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                color: "var(--muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8,
              }}>
                📁 {g.nombre}
                <span style={{ fontWeight: 500 }}>· {g.items.length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {g.items.map((w) => {
                  const url = `${origin}/api/webhooks/in/${w.slug}`;
                  return (
                    <div key={w.id} style={{
                      background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px",
                      opacity: w.activo ? 1 : 0.65,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>{w.nombre}</div>
                          {w.descripcion && (
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{w.descripcion}</div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          {w.activo ? badge("Activo", "#059669", "#F0FDF4") : badge("Inactivo", "#64748B", "#F1F5F9")}
                          {w.ultima_ok === true && badge("Última OK", "#059669", "#F0FDF4")}
                          {w.ultima_ok === false && badge("Última con fallo", "#DC2626", "#FEF2F2")}
                        </div>
                      </div>

                      <div
                        onClick={() => navigator.clipboard?.writeText(url)}
                        title="Clic para copiar"
                        style={{
                          fontSize: 12, color: "var(--fg)", background: "#F8FAFC", cursor: "pointer",
                          border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px",
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", marginBottom: 12,
                          wordBreak: "break-all",
                        }}
                      >
                        <div>POST {url}</div>
                        <div style={{ color: "var(--muted)" }}>Authorization: Bearer &lt;token · {w.token_prefix}…&gt;</div>
                      </div>

                      <div style={{ display: "flex", gap: 18, fontSize: 11, color: "var(--muted)", marginBottom: 12, flexWrap: "wrap" }}>
                        <span>Registros recibidos: <strong style={{ color: "var(--fg)" }}>{w.entradas.toLocaleString("es-CO")}</strong></span>
                        <span>Entregas: <strong style={{ color: "var(--fg)" }}>{w.entregas}</strong></span>
                        <span>Última entrega: {fecha(w.ultima_entrega_en)}</span>
                        {w.token_rotado_en && <span>Token rotado: {fecha(w.token_rotado_en)}</span>}
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button onClick={() => probar(w)} style={btnGhost}>Enviar prueba</button>
                        <button onClick={() => verEntradas(w)} style={btnGhost}>
                          {abierto === w.id ? "Ocultar entradas" : "Ver entradas"}
                        </button>
                        <button onClick={() => regenerar(w)} style={btnGhost}>Regenerar token</button>
                        <button onClick={() => toggleActivo(w)} style={btnGhost}>
                          {w.activo ? "Desactivar" : "Activar"}
                        </button>
                        <button onClick={() => eliminar(w)} style={{ ...btnGhost, color: "#DC2626", borderColor: "#DC262640" }}>
                          Eliminar
                        </button>
                      </div>

                      {abierto === w.id && (
                        <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                          {cargandoDetalle ? (
                            <div style={{ fontSize: 12, color: "var(--muted)" }}>Cargando…</div>
                          ) : !detalle ? null : (
                            <>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
                                Últimas entregas
                              </div>
                              {detalle.entregas.length === 0 ? (
                                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Nada recibido todavía.</div>
                              ) : (
                                <div style={{ overflowX: "auto", marginBottom: 16 }}>
                                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                    <thead>
                                      <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                                        <th style={th}>Recibido</th>
                                        <th style={th}>Fuente</th>
                                        <th style={th}>Recibidos</th>
                                        <th style={th}>Escritos</th>
                                        <th style={th}>Bytes</th>
                                        <th style={th}>Estado</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {detalle.entregas.map((e) => (
                                        <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                                          <td style={td}>{fecha(e.recibido_en)}</td>
                                          <td style={td}>{e.fuente === "prueba" ? badge("Prueba", "#6366F1", "#EEF2FF") : badge("Externo", "#0EA5E9", "#F0F9FF")}</td>
                                          <td style={td}>{e.registros_recibidos}</td>
                                          <td style={td}>{e.registros_escritos}</td>
                                          <td style={td}>{e.bytes.toLocaleString("es-CO")}</td>
                                          <td style={td}>{e.ok ? badge("OK", "#059669", "#F0FDF4") : badge(e.mensaje || "Fallo", "#DC2626", "#FEF2F2")}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
                                Últimos registros
                              </div>
                              {detalle.entradas.length === 0 ? (
                                <div style={{ fontSize: 12, color: "var(--muted)" }}>Sin registros.</div>
                              ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {detalle.entradas.slice(0, 20).map((row) => (
                                    <pre key={row.id} style={{
                                      margin: 0, fontSize: 11, background: "#0F172A", color: "#E2E8F0",
                                      borderRadius: 8, padding: "8px 10px", overflowX: "auto",
                                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    }}>
                                      {JSON.stringify(row.payload)}
                                    </pre>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Modal de token */}
      {tokenNuevo && (
        <div
          onClick={() => setTokenNuevo(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 16, padding: "26px 28px", maxWidth: 560, width: "100%",
          }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--fg)", marginBottom: 6 }}>
              Token de «{tokenNuevo.nombre}»
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>
              Cópialo ahora — <strong>no se vuelve a mostrar</strong>. Si se pierde, se regenera (y el anterior deja de servir).
            </p>

            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Token</div>
            <div
              onClick={() => navigator.clipboard?.writeText(tokenNuevo.token)}
              title="Clic para copiar"
              style={{
                fontSize: 13, background: "#F1F5F9", border: "1px solid var(--border)", borderRadius: 10,
                padding: "10px 12px", marginBottom: 14, cursor: "pointer", wordBreak: "break-all",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {tokenNuevo.token}
            </div>

            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Cómo enviarnos data</div>
            <pre style={{
              margin: 0, fontSize: 11, background: "#0F172A", color: "#E2E8F0", borderRadius: 10,
              padding: "12px 14px", overflowX: "auto",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}>{`curl -X POST ${origin}/api/webhooks/in/${tokenNuevo.slug} \\
  -H "Authorization: Bearer ${tokenNuevo.token}" \\
  -H "Content-Type: application/json" \\
  -d '{ "registros": [ { "id": 1 }, { "id": 2 } ] }'`}</pre>

            <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
              <button onClick={() => navigator.clipboard?.writeText(tokenNuevo.token)} style={btnGhost}>Copiar token</button>
              <button onClick={() => setTokenNuevo(null)} style={{
                fontSize: 12, fontWeight: 700, color: "#fff", background: "#111827",
                border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              }}>Listo</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  fontSize: 13, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8,
  color: "var(--fg)", background: "#fff", fontFamily: "inherit",
};

const btnGhost: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "var(--fg)", background: "#fff",
  border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", cursor: "pointer",
};

const th: React.CSSProperties = { padding: "6px 8px", fontWeight: 600 };
const td: React.CSSProperties = { padding: "6px 8px", color: "var(--fg)" };
