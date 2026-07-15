"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ACCENT = "#8B5CF6";
const ACCENT_TINT = "#F5F3FF";

type Carpeta = { id: string; nombre: string };
type Nota = {
  id: string;
  titulo: string;
  contenido: string;
  carpeta_id: string | null;
  updated_at: string;
};

type Filtro = "todas" | "sin_carpeta" | string;

export default function NotasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nuevaCarpeta, setNuevaCarpeta] = useState(false);
  const [nombreCarpeta, setNombreCarpeta] = useState("");
  const [editingCarpetaId, setEditingCarpetaId] = useState<string | null>(null);
  const [editingCarpetaNombre, setEditingCarpetaNombre] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [carpetasRes, notasRes] = await Promise.all([
      fetch("/api/notas/carpetas"),
      fetch("/api/notas"),
    ]);
    if (carpetasRes.status === 401 || notasRes.status === 401) {
      router.push("/login");
      return;
    }
    const carpetasData = await carpetasRes.json();
    const notasData = await notasRes.json();
    setCarpetas(Array.isArray(carpetasData) ? carpetasData : []);
    setNotas(Array.isArray(notasData) ? notasData : []);
    setLoading(false);
  }

  const notasFiltradas = useMemo(() => {
    if (filtro === "todas") return notas;
    if (filtro === "sin_carpeta") return notas.filter((n) => !n.carpeta_id);
    return notas.filter((n) => n.carpeta_id === filtro);
  }, [notas, filtro]);

  const selected = useMemo(
    () => notas.find((n) => n.id === selectedId) ?? null,
    [notas, selectedId]
  );

  async function handleCrearCarpeta(e: React.FormEvent) {
    e.preventDefault();
    if (!nombreCarpeta.trim()) return;
    const res = await fetch("/api/notas/carpetas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombreCarpeta.trim() }),
    });
    if (res.ok) {
      const carpeta = await res.json();
      setCarpetas((prev) => [...prev, carpeta].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setFiltro(carpeta.id);
    }
    setNombreCarpeta("");
    setNuevaCarpeta(false);
  }

  async function handleRenombrarCarpeta(id: string) {
    if (!editingCarpetaNombre.trim()) {
      setEditingCarpetaId(null);
      return;
    }
    const res = await fetch(`/api/notas/carpetas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: editingCarpetaNombre.trim() }),
    });
    if (res.ok) {
      const carpeta = await res.json();
      setCarpetas((prev) => prev.map((c) => (c.id === id ? carpeta : c)));
    }
    setEditingCarpetaId(null);
  }

  async function handleEliminarCarpeta(id: string) {
    if (!confirm("¿Eliminar esta carpeta? Las notas dentro quedarán sin carpeta.")) return;
    const res = await fetch(`/api/notas/carpetas/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCarpetas((prev) => prev.filter((c) => c.id !== id));
      setNotas((prev) => prev.map((n) => (n.carpeta_id === id ? { ...n, carpeta_id: null } : n)));
      if (filtro === id) setFiltro("todas");
    }
  }

  async function handleNuevaNota() {
    const carpeta_id = filtro === "todas" || filtro === "sin_carpeta" ? null : filtro;
    const res = await fetch("/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carpeta_id }),
    });
    if (res.ok) {
      const nota = await res.json();
      setNotas((prev) => [nota, ...prev]);
      setSelectedId(nota.id);
    }
  }

  async function handleEliminarNota(id: string) {
    if (!confirm("¿Eliminar esta nota?")) return;
    const res = await fetch(`/api/notas/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotas((prev) => prev.filter((n) => n.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  function updateLocalNota(id: string, patch: Partial<Nota>) {
    setNotas((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  function scheduleSave(id: string, patch: Partial<Nota>) {
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const res = await fetch(`/api/notas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const nota = await res.json();
        setNotas((prev) =>
          prev.map((n) => (n.id === id ? nota : n)).sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        );
      }
      setSaveState("saved");
    }, 500);
  }

  function handleTituloChange(value: string) {
    if (!selected) return;
    updateLocalNota(selected.id, { titulo: value });
    scheduleSave(selected.id, { titulo: value });
  }

  function handleContenidoChange(value: string) {
    if (!selected) return;
    updateLocalNota(selected.id, { contenido: value });
    scheduleSave(selected.id, { contenido: value });
  }

  function nombreCarpetaDe(id: string | null) {
    if (!id) return null;
    return carpetas.find((c) => c.id === id)?.nombre ?? null;
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando…</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "16px 24px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <a href="/" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Hub</a>
        <span style={{ color: "var(--border)" }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: ACCENT,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>📝</div>
          <div>
            <h1 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>Mis notas</h1>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>Privadas — solo tú las ves</p>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Columna: carpetas */}
        <aside style={{
          width: 220, borderRight: "1px solid var(--border)", background: "#fff",
          padding: 16, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto",
        }}>
          <FiltroItem
            label="📄 Todas las notas"
            active={filtro === "todas"}
            onClick={() => setFiltro("todas")}
          />
          <FiltroItem
            label="🗂️ Sin carpeta"
            active={filtro === "sin_carpeta"}
            onClick={() => setFiltro("sin_carpeta")}
          />

          <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />

          {carpetas.map((c) => (
            <div key={c.id} style={{ position: "relative" }} className="notas-carpeta-row">
              {editingCarpetaId === c.id ? (
                <input
                  autoFocus
                  value={editingCarpetaNombre}
                  onChange={(e) => setEditingCarpetaNombre(e.target.value)}
                  onBlur={() => handleRenombrarCarpeta(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenombrarCarpeta(c.id);
                    if (e.key === "Escape") setEditingCarpetaId(null);
                  }}
                  style={{
                    width: "100%", fontSize: 13, padding: "7px 10px",
                    border: `1px solid ${ACCENT}`, borderRadius: 8, outline: "none",
                  }}
                />
              ) : (
                <FiltroItem
                  label={`📁 ${c.nombre}`}
                  active={filtro === c.id}
                  onClick={() => setFiltro(c.id)}
                  onDoubleClick={() => {
                    setEditingCarpetaId(c.id);
                    setEditingCarpetaNombre(c.nombre);
                  }}
                  onDelete={() => handleEliminarCarpeta(c.id)}
                />
              )}
            </div>
          ))}

          {nuevaCarpeta ? (
            <form onSubmit={handleCrearCarpeta}>
              <input
                autoFocus
                placeholder="Nombre de la carpeta"
                value={nombreCarpeta}
                onChange={(e) => setNombreCarpeta(e.target.value)}
                onBlur={() => { if (!nombreCarpeta.trim()) setNuevaCarpeta(false); }}
                onKeyDown={(e) => { if (e.key === "Escape") setNuevaCarpeta(false); }}
                style={{
                  width: "100%", fontSize: 13, padding: "7px 10px",
                  border: `1px solid ${ACCENT}`, borderRadius: 8, outline: "none",
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setNuevaCarpeta(true)}
              style={{
                fontSize: 12, fontWeight: 600, color: ACCENT,
                background: "transparent", border: "none", textAlign: "left",
                padding: "7px 10px", cursor: "pointer", marginTop: 4,
              }}
            >
              + Nueva carpeta
            </button>
          )}
        </aside>

        {/* Columna: lista de notas */}
        <section style={{
          width: 300, borderRight: "1px solid var(--border)", background: "var(--bg)",
          display: "flex", flexDirection: "column", minHeight: 0,
        }}>
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
            <button
              onClick={handleNuevaNota}
              style={{
                width: "100%", fontSize: 13, fontWeight: 700, color: "#fff",
                background: ACCENT, border: "none", borderRadius: 8, padding: "9px 14px",
                cursor: "pointer",
              }}
            >
              + Nueva nota
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {notasFiltradas.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 13, padding: 20, textAlign: "center" }}>
                No hay notas aquí todavía.
              </p>
            ) : (
              notasFiltradas.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    background: selectedId === n.id ? ACCENT_TINT : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <p style={{
                    fontSize: 13, fontWeight: 600, color: "var(--fg)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {n.titulo || "Sin título"}
                  </p>
                  <p style={{
                    fontSize: 12, color: "var(--muted)", marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {n.contenido?.trim() ? n.contenido.trim() : "Nota vacía"}
                  </p>
                  {filtro === "todas" && nombreCarpetaDe(n.carpeta_id) && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: ACCENT,
                      background: ACCENT_TINT, borderRadius: 6, padding: "1px 6px",
                      marginTop: 4, display: "inline-block",
                    }}>
                      {nombreCarpetaDe(n.carpeta_id)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Columna: editor */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", minHeight: 0 }}>
          {!selected ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Selecciona o crea una nota.</p>
            </div>
          ) : (
            <>
              <div style={{
                padding: "16px 24px", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <input
                  value={selected.titulo}
                  onChange={(e) => handleTituloChange(e.target.value)}
                  placeholder="Sin título"
                  style={{
                    flex: 1, fontSize: 18, fontWeight: 700, color: "var(--fg)",
                    border: "none", outline: "none",
                  }}
                />
                <select
                  value={selected.carpeta_id ?? ""}
                  onChange={(e) => {
                    const carpeta_id = e.target.value || null;
                    updateLocalNota(selected.id, { carpeta_id });
                    scheduleSave(selected.id, { carpeta_id });
                  }}
                  style={{
                    fontSize: 12, color: "var(--muted)", border: "1px solid var(--border)",
                    borderRadius: 6, padding: "5px 8px", background: "#fff",
                  }}
                >
                  <option value="">Sin carpeta</option>
                  {carpetas.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 46 }}>
                  {saveState === "saving" ? "Guardando…" : saveState === "saved" ? "Guardado" : ""}
                </span>
                <button
                  onClick={() => handleEliminarNota(selected.id)}
                  style={{
                    fontSize: 12, color: "#EF4444", background: "transparent",
                    border: "none", cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
              <textarea
                value={selected.contenido}
                onChange={(e) => handleContenidoChange(e.target.value)}
                placeholder="Escribe aquí…"
                style={{
                  flex: 1, padding: "20px 24px", fontSize: 14, color: "var(--fg)",
                  border: "none", outline: "none", resize: "none", lineHeight: 1.6,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function FiltroItem({
  label, active, onClick, onDoubleClick, onDelete,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? ACCENT : "var(--fg)",
        background: active ? ACCENT_TINT : "transparent",
        borderRadius: 8, padding: "7px 10px", cursor: "pointer",
        userSelect: "none",
      }}
      className="notas-filtro-item"
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="notas-filtro-delete"
          style={{
            fontSize: 11, color: "var(--muted)", background: "transparent",
            border: "none", cursor: "pointer", padding: "0 2px", opacity: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
