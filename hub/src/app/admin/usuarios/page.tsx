"use client";

import { useEffect, useMemo, useState } from "react";
import HubFooter from "@/components/HubFooter";

const APPS = ["darwin", "inidiana"] as const;
type AppName = (typeof APPS)[number];

const APP_COLOR: Record<string, string> = {
  darwin: "#7C3AED",
  inidiana: "#F77F00",
};

type FilaAcceso = { email: string; app_name: string; created_at: string };
type UsuarioAgrupado = { email: string; apps: string[] };

function Badge({ label, color, onRemove }: { label: string; color: string; onRemove?: () => void }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: color + "18",
      border: `1px solid ${color}33`,
      borderRadius: 6, padding: "2px 6px 2px 8px",
      whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          title={`Quitar acceso a ${label}`}
          style={{
            border: "none", background: "none", cursor: "pointer",
            color, fontSize: 13, lineHeight: 1, padding: 0,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default function UsuariosAccesoPage() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [filas, setFilas] = useState<FilaAcceso[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [appsForm, setAppsForm] = useState<Set<AppName>>(new Set());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);

  function cargar() {
    fetch("/api/admin/user-access")
      .then((res) => res.json())
      .then((data) => setFilas(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setIsSuperAdmin(!!data?.profile?.is_super_admin))
      .finally(() => setCheckedAuth(true));
    cargar();
  }, []);

  const usuarios: UsuarioAgrupado[] = useMemo(() => {
    const porEmail = new Map<string, Set<string>>();
    for (const f of filas) {
      if (!porEmail.has(f.email)) porEmail.set(f.email, new Set());
      porEmail.get(f.email)!.add(f.app_name);
    }
    return [...porEmail.entries()]
      .map(([email, apps]) => ({ email, apps: [...apps] }))
      .sort((a, b) => a.email.localeCompare(b.email));
  }, [filas]);

  function toggleAppForm(app: AppName) {
    setAppsForm((prev) => {
      const next = new Set(prev);
      if (next.has(app)) next.delete(app); else next.add(app);
      return next;
    });
  }

  function editarUsuario(u: UsuarioAgrupado) {
    setEditando(u.email);
    setEmail(u.email);
    setAppsForm(new Set(u.apps.filter((a): a is AppName => (APPS as readonly string[]).includes(a))));
    setFormError(null);
    setFormOk(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicion() {
    setEditando(null);
    setEmail("");
    setAppsForm(new Set());
    setFormError(null);
    setFormOk(null);
  }

  async function guardarAcceso(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setFormOk(null);

    const res = await fetch("/api/admin/user-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), apps: [...appsForm] }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setFormError(data.error ?? "Error al guardar el acceso");
      return;
    }
    const mensaje = appsForm.size > 0 ? `Acceso guardado para ${email}` : `Se quitaron todos los accesos de ${email}`;
    setEditando(null);
    setEmail("");
    setAppsForm(new Set());
    setFormOk(mensaje);
    cargar();
  }

  async function revocarTodo(u: UsuarioAgrupado) {
    if (!confirm(`¿Revocar TODO el acceso de ${u.email}? Perderá acceso a: ${u.apps.join(", ")}`)) return;
    setFilas((prev) => prev.filter((f) => f.email !== u.email));
    const res = await fetch("/api/admin/user-access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: u.email }),
    });
    if (!res.ok) cargar(); // revertir recargando si falló
  }

  async function quitarUnaApp(u: UsuarioAgrupado, app: string) {
    setFilas((prev) => prev.filter((f) => !(f.email === u.email && f.app_name === app)));
    const res = await fetch("/api/admin/user-access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: u.email, app_name: app }),
    });
    if (!res.ok) cargar();
  }

  if (checkedAuth && !isSuperAdmin) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>No autorizado.</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              Darwin · Accesos entre apps
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Quién puede entrar a Darwin, Inidiana, y lo que venga después. Solo super admin.
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 24, marginBottom: 32,
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
              {editando ? `✏️ Editando acceso de ${editando}` : "➕ Otorgar acceso"}
            </h2>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              Marca a qué apps entra este correo. Desmarcar y guardar quita el acceso a esa app.
            </p>
            <form onSubmit={guardarAcceso} style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--muted)" }}>Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  disabled={!!editando}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="persona@dropi.co"
                  style={{
                    padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8,
                    fontSize: 13, background: editando ? "var(--border)" : "var(--bg)", color: "var(--fg)",
                    minWidth: 220,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 14 }}>
                {APPS.map((app) => (
                  <label key={app} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--fg)", cursor: "pointer" }}>
                    <input type="checkbox" checked={appsForm.has(app)} onChange={() => toggleAppForm(app)} />
                    {app}
                  </label>
                ))}
              </div>

              <button type="submit" disabled={saving} style={{
                padding: "8px 16px", background: "var(--dropi)", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}>
                {saving ? "Guardando…" : "Guardar acceso"}
              </button>

              {editando && (
                <button type="button" onClick={cancelarEdicion} style={{
                  padding: "8px 16px", background: "none", color: "var(--muted)",
                  border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>
                  Cancelar
                </button>
              )}
            </form>
            {formError && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 10 }}>{formError}</p>}
            {formOk && <p style={{ fontSize: 12, color: "#16A34A", marginTop: 10 }}>{formOk}</p>}
          </div>

          {loading && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}
          {!loading && usuarios.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Nadie tiene acceso registrado todavía.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {usuarios.map((u) => (
              <div key={u.email} style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12,
                padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{u.email}</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {u.apps.map((app) => (
                      <Badge key={app} label={app} color={APP_COLOR[app] ?? "#6B7280"} onRemove={() => quitarUnaApp(u, app)} />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => editarUsuario(u)} style={{
                    fontSize: 12, fontWeight: 600, color: "#6366F1",
                    background: "none", border: "none", cursor: "pointer",
                  }}>
                    Editar
                  </button>
                  <button onClick={() => revocarTodo(u)} style={{
                    fontSize: 12, fontWeight: 600, color: "#DC2626",
                    background: "none", border: "none", cursor: "pointer",
                  }}>
                    Revocar todo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
