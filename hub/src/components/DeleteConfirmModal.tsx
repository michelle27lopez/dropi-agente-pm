"use client";

import { useState } from "react";

// Confirmación de borrado físico de un proyecto: hay que escribir "ELIMINAR"
// exacto para habilitar el botón. Si el proyecto todavía tiene POC/Delivery/
// Following asociados, la API responde 409 (bloqueo real de Postgres por la
// FK sin CASCADE en parent_project_id/related_poc_id/related_delivery_id —
// ver migraciones 036/039/043) y el mensaje se muestra acá tal cual, sin
// riesgo de dejar huérfanos. Compartido entre /proyectos y /proyectos/[slug].
export function DeleteConfirmModal({
  nombre,
  codigo,
  childCount,
  onCancel,
  onConfirm,
}: {
  nombre: string;
  codigo: string | null;
  childCount: number;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canDelete = text === "ELIMINAR";

  async function handleConfirm() {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (e: any) {
      setError(e.message ?? "No se pudo eliminar.");
      setDeleting(false);
    }
  }

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
          maxWidth: 420, width: "100%", padding: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)", margin: "0 0 8px" }}>
          Eliminar proyecto
        </h3>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.5 }}>
          Vas a eliminar permanentemente <strong>{nombre}</strong> ({codigo ?? "sin código"}).
          Esta acción no se puede deshacer.
        </p>
        {childCount > 0 && (
          <p style={{ fontSize: 12, color: "#D97706", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 10px", margin: "0 0 12px" }}>
            Tiene {childCount} POC/Delivery Proyecto asociados — Postgres va a rechazar el borrado hasta que se eliminen o desvinculen primero.
          </p>
        )}
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 6px" }}>
          Escribe <strong>ELIMINAR</strong> para confirmar:
        </p>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
            fontSize: 13, marginBottom: 12, boxSizing: "border-box", fontFamily: "inherit",
          }}
        />
        {error && (
          <p style={{ fontSize: 12, color: "#DC2626", margin: "0 0 12px" }}>{error}</p>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canDelete || deleting}
            onClick={handleConfirm}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8, border: "none",
              background: canDelete ? "#DC2626" : "var(--gray-200)", color: canDelete ? "#fff" : "var(--muted)",
              cursor: canDelete && !deleting ? "pointer" : "not-allowed",
            }}
          >
            {deleting ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
