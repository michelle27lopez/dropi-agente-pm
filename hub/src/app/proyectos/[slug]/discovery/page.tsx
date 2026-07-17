"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Project metadata map to resolve human-readable names from slugs
const PROJECT_NAMES: Record<string, string> = {
  "celula": "Célula",
  "dinamicas-catalogo": "Dinámicas de Catálogo",
  "time-to-value": "Time to Value",
  "categorizacion": "Categorización y Enriquecimiento",
  "indicadores": "Indicadores · Postulaciones",
  "negociaciones": "Negociaciones Proveedor-Líder",
  "negociaciones-dropshipper": "Negociaciones Proveedor-Dropshipper",
  "caza-productos": "Caza Productos",
  "combos": "Combos Dropshipper",
  "descuentos": "Descuentos en Catálogo",
  "dropi-activa": "Dropi Activa · ACT-001",
  "gali-demo": "Gali Copilot",
  "pulso-demo": "Dropi Pulso",
};

export default function DiscoveryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const [projectName, setProjectName] = useState("Proyecto");

  useEffect(() => {
    if (slug && PROJECT_NAMES[slug]) {
      setProjectName(PROJECT_NAMES[slug]);
    } else if (slug) {
      // Capitalize slug if not found in list
      const formatted = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setProjectName(formatted);
    }
  }, [slug]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#F8F9FA",
      }}
    >
      {/* Sleek integrated header matching Darwin brand guidelines */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          height: "56px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Back button */}
          <button
            onClick={() => router.push(`/proyectos/${slug}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4B5563",
              fontSize: "13px",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <span style={{ fontSize: "16px" }}>←</span> Volver al Proyecto
          </button>

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "#E5E7EB" }} />

          {/* Project context title */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#6B7280" }}>Proyecto:</span>
            <strong style={{ fontSize: "14px", color: "#111827", fontWeight: 600 }}>
              {projectName}
            </strong>
          </div>
        </div>

        {/* Brand Lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              background: "#FFF3E0",
              color: "#F77F00",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #FFE0B2",
            }}
          >
            LENTE DE PRODUCTO B=MAP
          </span>
          <img
            src="/darwin-logo.png"
            alt="Darwin"
            width={24}
            height={24}
            style={{ borderRadius: 6 }}
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </header>

      {/* Embedded Product Lens Workspace */}
      <div style={{ flex: 1, width: "100%", height: "calc(100vh - 56px)", overflow: "hidden" }}>
        <iframe
          src={`/product-lens/index.html?projectId=${encodeURIComponent(slug)}`}
          title={`Product Lens discovery for ${projectName}`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
