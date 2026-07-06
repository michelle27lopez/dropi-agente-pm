"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  C, FONT_UI, PRODUCTS, Discount, DEFAULT_DISCOUNTS, loadStoredDiscounts,
  isLive, emptyDiscount, AppShell, ProductosSidebar, ProductDetail, CrearOrdenModal,
} from "../../shared";

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [discounts, setDiscounts] = useState<Record<string, Discount>>(DEFAULT_DISCOUNTS);
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    setDiscounts(loadStoredDiscounts());
  }, []);

  const product = PRODUCTS.find((p) => p.id === id);
  const discount = (id && discounts[id]) || emptyDiscount;

  if (!product) {
    return (
      <AppShell activeIcon="search" sidebar={<ProductosSidebar variant="dropshipper" />}>
        <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.textMuted }}>Producto no encontrado en el prototipo.</p>
      </AppShell>
    );
  }

  return (
    <AppShell activeIcon="search" sidebar={<ProductosSidebar variant="dropshipper" />}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>
        <span>Productos</span><span>›</span><span>Proveedores</span><span>›</span><span>{product.supplier}</span><span>›</span>
        <span style={{ color: C.gray700 }}>{product.name}</span>
      </div>
      <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 14 }}>
        Esta pestaña lee el descuento configurado por el proveedor (se sincroniza automáticamente si lo cambias en la otra pestaña y recargas).
      </p>
      <ProductDetail
        product={product}
        discount={discount}
        live={isLive(discount)}
        onOrder={() => setOrderOpen(true)}
      />
      {orderOpen && (
        <CrearOrdenModal product={product} discount={discount} onClose={() => setOrderOpen(false)} />
      )}
    </AppShell>
  );
}
