"use client";

// Aviso de que estás viendo la home/proyectos de una célula que no es la
// tuya (vía el switcher de GlobalTopBar) — antes un super admin tenía los
// mismos poderes de edición ahí que en su propia célula, sin ninguna señal
// visual. "Editar de todos modos" es el escape hatch explícito para cuando
// de verdad hay que corregir algo de otra célula (2026-08-17, Jaime).
export function ModoLecturaBanner({ activo, onToggle }: { activo: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        background: activo ? "#FEF2F2" : "#EFF6FF",
        border: `1px solid ${activo ? "#FECACA" : "#BFDBFE"}`,
        borderRadius: 10, padding: "10px 16px", marginBottom: 24,
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 600, color: activo ? "#B91C1C" : "#1D4ED8" }}>
        {activo ? "⚠️ Editando esta célula aunque no es la tuya." : "👁️ Estás viendo esta célula en modo lectura — no es la tuya."}
      </span>
      <button
        type="button"
        onClick={onToggle}
        style={{
          fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
          padding: "6px 12px", borderRadius: 8, border: "none", whiteSpace: "nowrap",
          background: activo ? "#fff" : "#1D4ED8", color: activo ? "#B91C1C" : "#fff",
        }}
      >
        {activo ? "Volver a modo lectura" : "Editar de todos modos"}
      </button>
    </div>
  );
}
