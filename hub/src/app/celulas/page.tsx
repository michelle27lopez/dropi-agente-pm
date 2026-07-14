"use client";

import { useEffect, useState } from "react";
import HubFooter from "@/components/HubFooter";

type Miembro = {
  id: string;
  email: string;
  nombre: string | null;
  is_super_admin: boolean;
};

type Proyecto = {
  id: string;
  name: string;
  project_code: string | null;
  status: string | null;
  type: string | null;
  handoff_status: string | null;
};

type Celula = {
  id: string;
  nombre: string;
  slug: string;
  lead: string | null;
  area: string | null;
  ve_hub_completo: boolean;
  miembros: Miembro[];
  proyectos: Proyecto[];
};

const TYPE_COLOR: Record<string, string> = {
  Idea: "#94A3B8",
  Oportunidad: "#0EA5E9",
  POC: "#7C3AED",
  Proyecto: "#1A6B52",
};

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B",
  "Listo para handoff": "#0EA5E9",
  "Handoff hecho": "#22C55E",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: color + "18",
      border: `1px solid ${color}33`,
      borderRadius: 6, padding: "2px 8px",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

export default function CelulasPage() {
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [celulaId, setCelulaId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);

  function loadCelulas() {
    fetch("/api/celulas")
      .then((res) => res.json())
      .then((data) => setCelulas(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCelulas();
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setIsSuperAdmin(!!data?.profile?.is_super_admin));
  }, []);

  async function handleCreatePerson(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setFormOk(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nombre: nombre || null, celula_id: celulaId }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setFormError(data.error ?? "Error al crear la cuenta");
      return;
    }
    setFormOk(`Cuenta creada para ${email}`);
    setEmail(""); setPassword(""); setNombre(""); setCelulaId("");
    loadCelulas();
  }

  async function toggleVeHubCompleto(celula: Celula) {
    setCelulas((prev) => prev.map((c) => c.id === celula.id ? { ...c, ve_hub_completo: !c.ve_hub_completo } : c));
    const res = await fetch(`/api/celulas/${celula.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ve_hub_completo: !celula.ve_hub_completo }),
    });
    if (!res.ok) {
      // revertir si falló (ej. no autorizado)
      setCelulas((prev) => prev.map((c) => c.id === celula.id ? { ...c, ve_hub_completo: celula.ve_hub_completo } : c));
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "0", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <img
          src="/darwin-logo.png"
          alt="Darwin"
          width={36}
          height={36}
          style={{ display: "block", borderRadius: 8 }}
        />
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
            Darwin · Células
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            Directorio de células, personas y proyectos. Vista de solo lectura.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {isSuperAdmin && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 24, marginBottom: 32,
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
              ➕ Agregar persona
            </h2>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              Solo visible para super admin. Crea la cuenta y la asigna a una célula.
            </p>
            <form onSubmit={handleCreatePerson} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)" }}>Nombre</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan Diego"
                  style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "var(--bg)", color: "var(--fg)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)" }}>Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="persona@dropi.co"
                  style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "var(--bg)", color: "var(--fg)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)" }}>Clave inicial</label>
                <input required type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="mín. 8 caracteres"
                  style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "var(--bg)", color: "var(--fg)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)" }}>Célula</label>
                <select required value={celulaId} onChange={(e) => setCelulaId(e.target.value)}
                  style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "var(--bg)", color: "var(--fg)" }}>
                  <option value="">Seleccionar…</option>
                  {celulas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving} style={{
                padding: "8px 16px", background: "var(--dropi)", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}>
                {saving ? "Creando…" : "Crear cuenta"}
              </button>
            </form>
            {formError && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 10 }}>{formError}</p>}
            {formOk && <p style={{ fontSize: 12, color: "#16A34A", marginTop: 10 }}>{formOk}</p>}
          </div>
        )}

        {loading && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>
        )}

        {!loading && celulas.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Aún no hay células registradas.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {celulas.map((celula) => (
            <div key={celula.id} style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{celula.nombre}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {celula.lead && (
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Lead: {celula.lead}</span>
                  )}
                  <a href={`/celula/${celula.slug}`} style={{ fontSize: 12, fontWeight: 600, color: "#6366F1", textDecoration: "none" }}>
                    Ir a su home →
                  </a>
                </div>
              </div>
              {celula.area && (
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{celula.area}</p>
              )}

              {isSuperAdmin && (
                <label style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
                  fontSize: 12, color: "var(--muted)", cursor: "pointer", width: "fit-content",
                }}>
                  <input
                    type="checkbox"
                    checked={celula.ve_hub_completo}
                    onChange={() => toggleVeHubCompleto(celula)}
                  />
                  {celula.ve_hub_completo
                    ? "Ve todo el hub (puede navegar a las demás células)"
                    : "Solo ve su propia home"}
                </label>
              )}

              {/* Miembros */}
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Personas ({celula.miembros.length})
              </p>
              {celula.miembros.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Nadie registrado aún.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {celula.miembros.map((m) => (
                    <span key={m.id} style={{
                      fontSize: 12, color: "var(--fg)",
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: 8, padding: "4px 10px",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {m.nombre ?? m.email}
                      {m.is_super_admin && <Badge label="super admin" color="#7C3AED" />}
                    </span>
                  ))}
                </div>
              )}

              {/* Proyectos */}
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Proyectos ({celula.proyectos.length})
              </p>
              {celula.proyectos.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Sin proyectos asignados aún.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {celula.proyectos.map((p) => (
                    <div key={p.id} style={{
                      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                      fontSize: 13, color: "var(--fg)",
                      padding: "8px 12px",
                      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
                    }}>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                      {p.project_code && <span style={{ color: "var(--muted)" }}>{p.project_code}</span>}
                      {p.type && <Badge label={p.type} color={TYPE_COLOR[p.type] ?? "#94A3B8"} />}
                      {p.handoff_status && (
                        <Badge label={p.handoff_status} color={HANDOFF_COLOR[p.handoff_status] ?? "#94A3B8"} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
      <HubFooter />
    </main>
  );
}
