"use client";

import { useParams, useRouter } from "next/navigation";
import {
  C, FONT_UI, RADIUS, PRODUCTS, Product,
  money, pathToNode, categoryNamesFor,
  AppShell, PrimaryButton, GhostButton,
  IconCart, IconHeart,
} from "../../shared";

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <AppShell>
        <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.textMuted }}>Producto no encontrado en el prototipo.</p>
      </AppShell>
    );
  }

  const trail = pathToNode(product.categoryLeafId) ?? [];
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.categoryLeafId === product.categoryLeafId);

  const goToCategory = (nodeId: string) => {
    router.push(`/proyectos/categorizacion/prototipo?cat=${nodeId}`);
  };

  return (
    <AppShell>
      {/* Breadcrumb completo de la taxonomía L1→L4 — cada nivel es clicable */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, flexWrap: "wrap" }}>
        <span onClick={() => router.push("/proyectos/categorizacion/prototipo")} style={{ cursor: "pointer" }}>Productos</span>
        {trail.map((n, i) => (
          <span key={n.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>›</span>
            <span
              onClick={() => goToCategory(n.id)}
              style={{ cursor: "pointer", color: i === trail.length - 1 ? C.textHeader : C.textMuted, fontWeight: i === trail.length - 1 ? 600 : 400 }}
            >
              {n.name}
            </span>
          </span>
        ))}
      </div>
      <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
        Así vería el dropshipper la clasificación completa (L1 → L4) de este producto en el catálogo — hoy en Dropi solo se muestra un nombre de categoría libre, sin jerarquía.
      </p>

      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: RADIUS.md, padding: 24 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ width: 320, flexShrink: 0 }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: RADIUS.sm, border: `1px solid ${C.border}` }} />
          </div>

          <div style={{ flex: "1 1 380px", minWidth: 320 }}>
            <span style={{ display: "inline-block", fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, border: `1px solid ${C.border}`, background: C.bgGray, padding: "3px 10px", borderRadius: RADIUS.sm, marginBottom: 10 }}>
              ID: {product.sku}
            </span>
            <h2 style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 22, color: C.textHeader, marginBottom: 10 }}>{product.name}</h2>

            {/* Chips de categoría completa — nivel activo en azul info, resto en gris neutro */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {trail.map((n, i) => (
                <span
                  key={n.id}
                  onClick={() => goToCategory(n.id)}
                  style={{
                    cursor: "pointer", fontFamily: FONT_UI, fontSize: 11.5, fontWeight: i === trail.length - 1 ? 700 : 500,
                    color: i === trail.length - 1 ? C.info : C.textMuted,
                    background: i === trail.length - 1 ? C.infoBg : C.bgGray,
                    padding: "3px 10px", borderRadius: RADIUS.pill,
                  }}
                >
                  {"L" + (i + 1)} · {n.name}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Precio del proveedor:</p>
                <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, color: C.textHeader }}>{money(product.providerPrice)}</p>
              </div>
              <div style={{ width: 1, height: 32, background: C.border }} />
              <div>
                <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Precio sugerido:</p>
                <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, color: C.textHeader }}>{money(product.suggestedPrice)}</p>
              </div>
              <div style={{ width: 1, height: 32, background: C.border }} />
              <div>
                <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Stock:</p>
                <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, color: product.stock > 0 ? C.success : C.danger }}>{product.stock}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}><PrimaryButton><IconCart />Enviar al cliente</PrimaryButton></div>
              <GhostButton><IconHeart />Favoritos</GhostButton>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, color: C.textHeader, marginBottom: 14 }}>
            Más productos en {trail[trail.length - 1]?.name}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
            {related.map((p) => (
              <MiniCard key={p.id} product={p} onClick={() => router.push(`/proyectos/categorizacion/prototipo/producto/${p.id}`)} />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function MiniCard({ product: p, onClick }: { product: Product; onClick: () => void }) {
  const names = categoryNamesFor(p);
  return (
    <div onClick={onClick} style={{ cursor: "pointer", border: `1px solid ${C.border}`, borderRadius: RADIUS.md, overflow: "hidden", background: "#fff" }}>
      <img src={p.image} alt={p.name} style={{ width: "100%", height: 120, objectFit: "cover", display: "block", background: C.bgGray }} />
      <div style={{ padding: 10 }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 10.5, color: C.textMuted, marginBottom: 4 }}>{names[0]}</p>
        <p style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 13, color: C.textHeader, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</p>
        <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 13, color: C.textHeader }}>{money(p.providerPrice)}</p>
      </div>
    </div>
  );
}
