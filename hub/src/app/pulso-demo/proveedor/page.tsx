"use client";
import { useEffect, useState } from "react";

type Stats = {
  accepted: number;
  total: number;
  totalCommitted: number;
  breakdown: { units: number; count: number }[];
  session: { triggered_at: string } | null;
  acceptedAt: { name: string; at: string; units: number | null }[];
};

type Product = {
  name: string;
  category: string;
  price_cost: number;
  price_suggested: number;
  margin_pct: number;
  stock: number;
  supplier_name: string;
  supplier_city: string;
  image_url: string;
};

type SupplierPhase = "idle" | "proposal" | "accepted";

export default function ProveedorPortalPage() {
  const [stats, setStats] = useState<Stats>({ accepted: 0, total: 0, totalCommitted: 0, breakdown: [], session: null, acceptedAt: [] });
  const [product, setProduct] = useState<Product | null>(null);
  const [phase, setPhase] = useState<SupplierPhase>("idle");
  const [supplierAccepted, setSupplierAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetch("/api/pulso-demo/product").then((r) => r.json()).then((p) => {
      if (p && !p.error) setProduct(p);
    });
  }, []);

  useEffect(() => {
    const poll = async () => {
      const s: Stats = await fetch("/api/pulso-demo/stats").then((r) => r.json());
      if (!s) return;
      setStats(s);
      if (s.session && s.accepted >= 1) setPhase("proposal");
      if (!s.session) setPhase("idle");
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, []);

  const profit = product ? product.price_suggested - product.price_cost : 0;
  // Usar unidades realmente comprometidas por los dropshippers
  const projectedOrders = stats.totalCommitted > 0 ? stats.totalCommitted : stats.accepted * 12;
  const supplierDiscount = product ? Math.round(product.price_cost * 0.08) : 0;
  const netPerUnit = product ? product.price_cost - supplierDiscount : 0;
  const totalNet = netPerUnit * projectedOrders;
  const daysAgo = stats.session
    ? Math.round((Date.now() - new Date(stats.session.triggered_at).getTime()) / 1000)
    : 0;

  // ─── IDLE ───
  if (phase === "idle") {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏭</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>{product?.supplier_name ?? "Portal de Proveedor"}</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Esperando actividad del Pulso...</div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#10B981",
              animation: "pulse 2s infinite",
            }} />
            <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
            <span style={{ fontSize: 12, color: "#888" }}>Sistema activo</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACCEPTED ───
  if (supplierAccepted) {
    return (
      <div style={{ minHeight: "100vh", background: "#F0FDF4" }}>
        <PortalHeader product={product} />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{
            background: "#fff", border: "2px solid #10B981",
            borderRadius: 16, padding: "32px", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 8 }}>
              ¡Condiciones aceptadas!
            </div>
            <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
              La campaña está activa. Dropi coordina los detalles logísticos.
              Los dropshippers ya tienen acceso al producto con las condiciones acordadas.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { label: "Dropshippers activos", value: stats.accepted.toString(), color: "#F77F00" },
                { label: "Órdenes proyectadas", value: projectedOrders.toLocaleString("es-CO"), color: "#1A1A1A" },
                { label: "Ingreso estimado", value: `$${(totalNet / 1000000).toFixed(1)}M`, color: "#10B981" },
              ].map((k) => (
                <div key={k.label} style={{ background: "#F8F9FA", borderRadius: 10, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PROPOSAL ───
  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      <PortalHeader product={product} />

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Alerta principal */}
        <div style={{
          background: "#fff8e1", border: "2px solid #F77F00",
          borderRadius: 14, padding: "20px 24px", marginBottom: 28,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>⚡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>
              Dropi Pulso detectó demanda para tus productos
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
              El sistema identificó una señal en <strong>{product?.category}</strong> y ya notificó
              a dropshippers seleccionados. <strong>{stats.accepted} confirmaron</strong> en los últimos{" "}
              {daysAgo < 120 ? `${daysAgo} segundos` : "minutos"}.
              El sistema propone las condiciones a continuación.
            </div>
          </div>
        </div>

        {/* Producto */}
        {product && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {product.image_url && (
                <img src={product.image_url} alt={product.name}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{product.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{product.category} · {product.supplier_city}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Stock disponible: {product.stock.toLocaleString("es-CO")} unidades</div>
              </div>
            </div>
          </div>
        )}

        {/* Contador en vivo */}
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 14, padding: "20px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
            Señal de demanda confirmada — en tiempo real
          </div>

          {/* Dos métricas grandes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#FFF8F0", borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#F77F00", lineHeight: 1 }}>
                {stats.accepted}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>dropshippers confirmaron</div>
              <div style={{ fontSize: 11, color: "#ccc", marginTop: 2 }}>
                de {stats.total} notificados · {daysAgo < 120 ? `hace ${daysAgo}s` : "hace unos min"}
              </div>
            </div>
            <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#10B981", lineHeight: 1 }}>
                {stats.totalCommitted > 0 ? stats.totalCommitted.toLocaleString("es-CO") : "—"}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>unidades comprometidas</div>
              <div style={{ fontSize: 11, color: "#ccc", marginTop: 2 }}>demanda declarada total</div>
            </div>
          </div>

          {/* Breakdown por cantidad */}
          {stats.breakdown.length > 0 && (
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>Distribución del compromiso</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {stats.breakdown.map((b) => (
                  <div key={b.units} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 12, color: "#666", width: 80 }}>{b.units === 500 ? "500+" : b.units} und</div>
                    <div style={{ flex: 1, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", background: "#F77F00", borderRadius: 99,
                        width: `${(b.count / stats.accepted) * 100}%`,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", width: 30, textAlign: "right" }}>
                      ×{b.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden", marginTop: 14 }}>
            <div style={{
              height: "100%", background: "#F77F00", borderRadius: 99,
              width: stats.total > 0 ? `${(stats.accepted / stats.total) * 100}%` : "0%",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Propuesta de condiciones */}
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 14, padding: "20px", marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>
            Propuesta del sistema — Condiciones de campaña
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <tbody>
              {[
                { label: "Duración de la campaña", value: "15 días", note: "" },
                { label: "Tu precio actual por unidad", value: `$${product?.price_cost.toLocaleString("es-CO") ?? "—"}`, note: "" },
                { label: "Descuento propuesto (tú asumes)", value: `$${supplierDiscount.toLocaleString("es-CO")} / unidad (8%)`, note: "Para que el dropshipper tenga margen atractivo" },
                { label: "Tu ingreso neto por unidad", value: `$${netPerUnit.toLocaleString("es-CO")}`, note: "" },
                { label: "Órdenes proyectadas", value: `${projectedOrders.toLocaleString("es-CO")} órdenes`, note: `Con ${stats.accepted} dropshippers confirmados · est. 12 órd/DS` },
                { label: "Tu ingreso total estimado", value: `$${totalNet.toLocaleString("es-CO")} COP`, note: "Neto descontado el 8%" },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 0", color: "#666", width: "50%" }}>{row.label}</td>
                  <td style={{ padding: "10px 0" }}>
                    <div style={{ fontWeight: 700, color: "#1A1A1A" }}>{row.value}</div>
                    {row.note && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{row.note}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones de acción */}
        <div style={{ display: "grid", gap: 12 }}>
          <button
            onClick={async () => {
              setAccepting(true);
              try {
                await fetch("/api/pulso-demo/supplier-accept", { method: "POST" });
              } finally {
                setAccepting(false);
                setSupplierAccepted(true);
              }
            }}
            disabled={accepting}
            style={{
              background: accepting ? "#E5E7EB" : "linear-gradient(135deg, #F77F00, #E65C00)",
              border: "none", borderRadius: 14, padding: "18px",
              color: accepting ? "#aaa" : "#fff", fontSize: 16, fontWeight: 800,
              cursor: accepting ? "default" : "pointer",
              boxShadow: accepting ? "none" : "0 8px 24px rgba(247,127,0,0.3)",
            }}
          >
            {accepting ? "Procesando..." : "✓ Acepto las condiciones"}
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              disabled
              title="Próximamente"
              style={{
                background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 14, padding: "14px", color: "#C4C4C4",
                fontSize: 13, fontWeight: 600, cursor: "not-allowed",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}
            >
              <span>Negociar condiciones</span>
              <span style={{ fontSize: 10, background: "#E5E7EB", color: "#aaa", borderRadius: 99, padding: "2px 8px" }}>Próximamente</span>
            </button>
            <button style={{
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 14, padding: "14px", color: "#888",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              Ver detalles completos
            </button>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 20 }}>
          Dropi Pulso · Motor de matching automático · Las condiciones son negociables
        </div>
      </div>
    </div>
  );
}

function PortalHeader({ product }: { product: Product | null }) {
  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid #E5E7EB",
      padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
          alt="Dropi" style={{ height: 24, width: "auto" }}
        />
        <div style={{ width: 1, height: 14, background: "#E5E7EB" }} />
        <div style={{ fontSize: 12, color: "#888" }}>Portal de Proveedor</div>
      </div>
      <div style={{ fontSize: 12, color: "#888" }}>
        {product?.supplier_name ?? ""} · {product?.supplier_city ?? ""}
      </div>
    </div>
  );
}
