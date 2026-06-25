"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  name: string;
  category: string;
  price_suggested: number;
  price_cost: number;
  supplier_name: string;
  image_url: string;
};

type Section = {
  id: string;
  icon: string;
  title: string;
  color: string;
  colorBg: string;
  items: { label: string; size: string; format: string }[];
};

const KIT_SECTIONS: Section[] = [
  {
    id: "graphics",
    icon: "📸",
    title: "Gráficos del producto",
    color: "#7C3AED",
    colorBg: "#F5F3FF",
    items: [
      { label: "Foto principal fondo blanco", size: "2.4 MB", format: "PNG" },
      { label: "Pack lifestyle (5 fotos)", size: "8.1 MB", format: "ZIP" },
      { label: "Story Instagram (9:16)", size: "1.8 MB", format: "PNG" },
      { label: "Banner cuadrado 1:1", size: "1.2 MB", format: "PNG" },
    ],
  },
  {
    id: "copy",
    icon: "✍️",
    title: "Copies y textos",
    color: "#0891B2",
    colorBg: "#ECFEFF",
    items: [
      { label: "Copy para WhatsApp (3 versiones)", size: "12 KB", format: "PDF" },
      { label: "Caption para Instagram", size: "8 KB", format: "PDF" },
      { label: "Script TikTok (30 seg)", size: "15 KB", format: "PDF" },
      { label: "Bullets de beneficios", size: "6 KB", format: "PDF" },
    ],
  },
  {
    id: "video",
    icon: "🎥",
    title: "Brief de video",
    color: "#DC2626",
    colorBg: "#FEF2F2",
    items: [
      { label: "Brief completo de producción", size: "340 KB", format: "PDF" },
      { label: "Ángulos sugeridos (3 conceptos)", size: "280 KB", format: "PDF" },
      { label: "Referencia de video ganador", size: "24 MB", format: "MP4" },
    ],
  },
  {
    id: "brief",
    icon: "📋",
    title: "Brief de campaña",
    color: "#059669",
    colorBg: "#F0FDF4",
    items: [
      { label: "Brief completo de la campaña", size: "520 KB", format: "PDF" },
      { label: "Preguntas frecuentes y objeciones", size: "180 KB", format: "PDF" },
      { label: "Precio sugerido y márgenes", size: "95 KB", format: "PDF" },
    ],
  },
];

export default function KitPage() {
  const { token } = useParams<{ token: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [attendeeName, setAttendeeName] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>("graphics");

  useEffect(() => {
    fetch("/api/pulso-demo/product").then((r) => r.json()).then((p) => {
      if (p && !p.error) setProduct(p);
    });
    // Get attendee name from token via stats endpoint approach
    if (token) {
      fetch(`/api/pulso-demo/attendees`)
        .then((r) => r.json())
        .then((list) => {
          if (Array.isArray(list)) {
            const found = list.find((a: { token: string; name: string }) => a.token === token);
            if (found) setAttendeeName(found.name.split(" ")[0]);
          }
        })
        .catch(() => null);
    }
  }, [token]);

  const margin = product
    ? Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested)
    : 0;
  const profit = product ? (product.price_suggested - product.price_cost).toLocaleString("es-CO") : "0";

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      {/* Hero header */}
      <div style={{
        background: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)",
        padding: "28px 24px 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <img
            src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
            alt="Dropi"
            style={{ height: 22, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.9, marginBottom: 24 }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{
              background: "#4ade80", borderRadius: 99, padding: "4px 10px",
              fontSize: 11, fontWeight: 800, color: "#052e16", letterSpacing: "1px",
            }}>
              ✅ CAMPAÑA CONFIRMADA
            </div>
          </div>

          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>
            {attendeeName ? `Tu kit está listo,\n${attendeeName} 🎉` : "Tu kit de campaña 🎉"}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
            El proveedor aceptó las condiciones. Aquí están todos los materiales para lanzar tu campaña de{" "}
            <strong style={{ color: "#F77F00" }}>{product?.name ?? "producto"}</strong>.
          </div>

          {product && (
            <div style={{ display: "flex", gap: 20, paddingBottom: 24 }}>
              {[
                { label: "Margen", value: `${margin}%`, color: "#F77F00" },
                { label: "Ganancia/unidad", value: `$${profit}`, color: "#fff" },
                { label: "Campaña", value: "15 días", color: "#4ade80" },
              ].map((k) => (
                <div key={k.label}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{k.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product preview strip */}
      {product?.image_url && (
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 24px", display: "flex", gap: 14, alignItems: "center" }}>
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{product.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{product.category} · {product.supplier_name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Kit sections */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
          Materiales de la campaña
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {KIT_SECTIONS.map((section) => (
            <div key={section.id} style={{
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 14, overflow: "hidden",
            }}>
              <button
                onClick={() => setExpanded(expanded === section.id ? null : section.id)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
                  textAlign: "left",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: section.colorBg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                  {section.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{section.title}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{section.items.length} archivos</div>
                </div>
                <div style={{
                  width: 28, height: 28, background: expanded === section.id ? section.colorBg : "#F3F4F6",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: expanded === section.id ? section.color : "#888",
                  transition: "all 0.2s",
                }}>
                  {expanded === section.id ? "▲" : "▼"}
                </div>
              </button>

              {expanded === section.id && (
                <div style={{ borderTop: "1px solid #F3F4F6", padding: "4px 0 12px" }}>
                  {section.items.map((item, i) => (
                    <div key={i} style={{
                      padding: "10px 20px", display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{
                        width: 36, height: 36, background: section.colorBg, borderRadius: 8,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800, color: section.color,
                        flexShrink: 0,
                      }}>
                        {item.format}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{item.size}</div>
                      </div>
                      <button style={{
                        background: section.colorBg, border: `1px solid ${section.color}22`,
                        borderRadius: 8, padding: "6px 12px",
                        fontSize: 12, fontWeight: 700, color: section.color, cursor: "pointer",
                      }}>
                        ↓ Descargar
                      </button>
                    </div>
                  ))}
                  <div style={{ padding: "8px 20px 0" }}>
                    <button style={{
                      width: "100%", background: section.color, border: "none", borderRadius: 10,
                      padding: "12px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>
                      Descargar todo · {section.title}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download all */}
        <div style={{
          marginTop: 24, background: "linear-gradient(135deg, #F77F00, #E65C00)",
          borderRadius: 16, padding: "20px 24px", textAlign: "center",
          boxShadow: "0 8px 24px rgba(247,127,0,0.25)",
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
            📦 Descargar kit completo
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>
            Todos los materiales en un solo ZIP
          </div>
          <button style={{
            background: "#fff", border: "none", borderRadius: 10, padding: "12px 24px",
            fontSize: 14, fontWeight: 800, color: "#F77F00", cursor: "pointer",
          }}>
            Descargar todo (ZIP · 38 MB)
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#ccc" }}>
          Dropi Pulso · Motor de matching de catálogo
        </div>
      </div>
    </div>
  );
}
