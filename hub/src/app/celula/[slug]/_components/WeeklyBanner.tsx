"use client";

import React from "react";

export default function WeeklyBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: 14,
        padding: "16px 22px",
        marginBottom: 24,
        border: "1px solid rgba(255, 107, 53, 0.3)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "linear-gradient(135deg, #ff6b35 0%, #e0531f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            boxShadow: "0 0 14px rgba(255, 107, 53, 0.4)",
            flexShrink: 0,
          }}
        >
          🚀
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 10 }}>
            Weekly Célula Seller Success
            <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(16,185,129,0.2)", color: "#10b981", padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(16,185,129,0.4)" }}>
              ● Miércoles 11:00 AM
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            Presentación interactiva de Delivery (P0/P1/P2/QA) y Discovery Iniciado
          </div>
        </div>
      </div>

      <a
        href="/proyectos/weekly-sellers"
        style={{
          background: "linear-gradient(135deg, #ff6b35 0%, #e0531f 100%)",
          color: "#ffffff",
          padding: "10px 18px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 800,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 4px 14px rgba(255, 107, 53, 0.35)",
          whiteSpace: "nowrap",
        }}
      >
        <span>Abrir Espacio Weekly</span>
        <span style={{ fontSize: 15 }}>→</span>
      </a>
    </div>
  );
}
