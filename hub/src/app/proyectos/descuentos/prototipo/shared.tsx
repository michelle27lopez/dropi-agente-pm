"use client";

import { Inter, IBM_Plex_Sans } from "next/font/google";
import { useState } from "react";

export const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
export const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex" });

// ─── Tokens reales tomados de Figma (Productos v2.0) ──────────────────────────
export const C = {
  orange: "#FF6102",
  orangeLight: "#FFE0CC",
  blue: "#0092C6",
  info: "#50A5F1",
  infoBg: "#EEF6FE",
  infoBorder: "#AFD6F9",
  success: "#34C38F",
  successBg: "#E8F8F2",
  danger: "#F1556C",
  dangerBg: "#FDEEF0",
  dangerBorder: "#F8C6D0",
  warning: "#F1B44C",
  textHeader: "#495057",
  textMuted: "#69738C",
  textDisabled: "#999999",
  border: "#CED4DA",
  borderLight: "#E2E4E9",
  bgGray: "#F5F6F8",
  bgGraySide: "#F0F4F9",
  gray700: "#32394D",
};

export const FONT_UI = "var(--font-plex)";
export const FONT_HEAD = "var(--font-inter)";

// ─── Imágenes: las mismas fotos y el mismo banner del mock real de Figma ─────
// Descargadas del archivo "Productos v2.0" y alojadas en /public/dropi-catalog
// para no depender de la URL temporal de Figma (expira a los 7 días).
export const BANNER_IMG = "/dropi-catalog/banner.png";
export const SUPPLIER_LOGOS = {
  suppli: "/dropi-catalog/supplier-suppli.png",
  adma: "/dropi-catalog/supplier-adma.png",
  shopipauta: "/dropi-catalog/supplier-shopipauta.png",
};

export type DiscountType = "percent" | "fixed";

export type Discount = {
  active: boolean;
  type: DiscountType;
  value: number;
  endDate: string;
  endVolume: string;
  soldUnits: number;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  image: string;
  providerPrice: number; // "Precio proveedor" — lo que paga el dropshipper
  suggestedPrice: number; // "Precio sugerido"
  supplier: string;
  category: string;
  stock: number;
  city: string;
  typeBadge?: "Variable" | "Combo";
  tier?: "Exclusivo" | "Premium" | "Verificado";
  private?: boolean;
};

// Mismos 8 productos, mismas fotos, mismos badges y mismos precios ($62.000 /
// $120.000 para todos) que el catálogo real de "Productos v2.0" en Figma.
export const PRODUCTS: Product[] = [
  { id: "p1", sku: "2014761", name: "Organizador de closet-OR84", image: "/dropi-catalog/p1.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Hogar", stock: 126, city: "Bogotá", typeBadge: "Variable", tier: "Exclusivo" },
  { id: "p2", sku: "2014762", name: "Y68 Reloj Inteligente Gps Pulso Cardiaco", image: "/dropi-catalog/p2.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Tecnología", stock: 996, city: "Bogotá", typeBadge: "Variable", tier: "Premium", private: true },
  { id: "p3", sku: "2014763", name: "Crispetera De Silicona Para Microonda", image: "/dropi-catalog/p3.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Cocina", stock: 9, city: "Bogotá", typeBadge: "Combo", tier: "Verificado" },
  { id: "p4", sku: "2014764", name: "Adidas Suela Liviana Rosado Dama", image: "/dropi-catalog/p4.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Moda", stock: 0, city: "Bogotá", typeBadge: "Variable", tier: "Exclusivo", private: true },
  { id: "p5", sku: "2014765", name: "Organizador de cocina", image: "/dropi-catalog/p5.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Cocina", stock: 96, city: "Bogotá", tier: "Premium" },
  { id: "p6", sku: "2014766", name: "Zapatera Closet De 9 Niveles Armable", image: "/dropi-catalog/p6.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Hogar", stock: 96, city: "Bogotá", typeBadge: "Variable" },
  { id: "p7", sku: "2014767", name: "Ropa deportiva de 2 piezas para mujer", image: "/dropi-catalog/p7.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Ropa deportiva", stock: 96, city: "Bogotá", typeBadge: "Variable" },
  { id: "p8", sku: "2014768", name: "Maleta Multifuncional", image: "/dropi-catalog/p8.png", providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", category: "Moda", stock: 96, city: "Bogotá", typeBadge: "Combo" },
];

export const SUPPLIER_META: Record<string, { verified: boolean; performance: string; desc: string; segments: [number, number, number]; despacho: string }> = {
  "Tienda Proveedor": { verified: true, performance: "Estable", desc: "Buen rendimiento, con oportunidades para mejorar.", segments: [20, 50, 30], despacho: "2 Horas" },
};

export const DESCRIPTIONS: Record<string, { text: string; specs: string[] }> = {
  p1: {
    text: "Organizador plegable para closet, ideal para maximizar espacio de almacenamiento de ropa y accesorios.",
    specs: ["Material resistente plegable", "Fácil de armar sin herramientas", "Colores disponibles: variados", "Ideal para closets pequeños"],
  },
  p2: {
    text: "Reloj inteligente con GPS y monitor de pulso cardíaco, pantalla a color y correa intercambiable.",
    specs: ["Monitor de pulso cardíaco", "GPS integrado", "Pantalla táctil a color", "Batería de larga duración"],
  },
  p3: {
    text: "Crispetera de silicona apta para microondas, prepara palomitas caseras sin aceite en minutos.",
    specs: ["Apta para microondas", "Silicona libre de BPA", "Fácil de limpiar", "Tapa con agarradera"],
  },
  p4: {
    text: "Zapatilla deportiva suela liviana, diseño rosado para dama, cómoda para uso diario.",
    specs: ["Suela liviana antideslizante", "Material transpirable", "Tallas disponibles: 35 a 40", "Color: rosado"],
  },
  p5: {
    text: "Organizador de cocina para fregadero, escurridor de platos con múltiples compartimentos.",
    specs: ["Estructura en acero inoxidable", "Incluye bandeja escurridora", "Fácil instalación", "Ahorra espacio en la cocina"],
  },
  p6: {
    text: "Zapatera armable de 9 niveles para closet, capacidad para múltiples pares de zapatos.",
    specs: ["9 niveles de almacenamiento", "Armable sin herramientas", "Estructura resistente", "Ideal para entradas o closets"],
  },
  p7: {
    text: "Conjunto deportivo de 2 piezas para mujer, tela suave con buena compresión, varios colores disponibles.",
    specs: ["Tela elástica de compresión", "Disponible en varios colores", "Tallas: S a XL", "Ideal para gym o uso casual"],
  },
  p8: {
    text: "Maleta multifuncional de viaje, diseño minimalista con múltiples compartimentos.",
    specs: ["Material resistente al agua", "Múltiples compartimentos", "Correa ajustable", "Ideal para viajes cortos"],
  },
};

export const CHANNELS = ["Dropi", "Shopify", "WooCommerce", "Tienda Nube", "CAS", "ECOM Scanner"];
export const CARRIERS = [
  { name: "Veloces", color: "#F06292", price: 11000 },
  { name: "Envía", color: "#4DB6AC", price: 12500 },
  { name: "Domina", color: "#7986CB", price: 9800 },
  { name: "Coordinadora", color: "#4FC3F7", price: 13200 },
  { name: "Interrápidisimo", color: "#9575CD", price: 10500 },
  { name: "Servientrega", color: "#81C784", price: 14000 },
  { name: "TCC", color: "#E57373", price: 12000 },
];

export const money = (n: number) => "$ " + Math.round(n).toLocaleString("es-CO");

export function computeFinalPrice(base: number, d: Discount): number {
  if (!d.active) return base;
  if (d.type === "percent") return Math.round(base * (1 - Math.min(Math.max(d.value, 0), 100) / 100));
  return Math.max(base - d.value, 0);
}
export function endedByVolume(d: Discount): boolean {
  const limit = Number(d.endVolume);
  return d.active && !!d.endVolume && limit > 0 && d.soldUnits >= limit;
}
export function endedByDate(d: Discount): boolean {
  if (!d.active || !d.endDate) return false;
  const end = new Date(d.endDate);
  return !isNaN(end.getTime()) && end.getTime() < Date.now();
}
export function isLive(d: Discount) {
  return d.active && !endedByVolume(d) && !endedByDate(d);
}

export const emptyDiscount: Discount = { active: false, type: "percent", value: 20, endDate: "", endVolume: "", soldUnits: 0 };

export const DEFAULT_DISCOUNTS: Record<string, Discount> = {
  p1: { active: true, type: "percent", value: 25, endDate: "2026-08-20", endVolume: "50", soldUnits: 31 },
  p2: { ...emptyDiscount },
  p3: { active: true, type: "fixed", value: 8000, endDate: "", endVolume: "30", soldUnits: 30 },
  p4: { ...emptyDiscount },
  p5: { ...emptyDiscount },
  p6: { ...emptyDiscount },
  p7: { ...emptyDiscount },
  p8: { ...emptyDiscount },
};

// ─── Estado compartido entre pestañas (catálogo ↔ detalle) vía localStorage ──
const STORAGE_KEY = "descuentos-prototipo-discounts";
export function loadStoredDiscounts(): Record<string, Discount> {
  if (typeof window === "undefined") return DEFAULT_DISCOUNTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DISCOUNTS;
    return { ...DEFAULT_DISCOUNTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DISCOUNTS;
  }
}
export function saveStoredDiscounts(discounts: Record<string, Discount>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(discounts));
}

// ─── Iconos mínimos (línea, currentColor) ─────────────────────────────────────
const icon = (children: React.ReactNode, size = 20) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const IconHome = () => icon(<path d="M3 11.5 12 4l9 7.5M5 10v9h5v-6h4v6h5v-9" />);
export const IconSearch = () => icon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
export const IconCart = () => icon(<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.6 12.2a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21 7H6" /></>);
export const IconBox = () => icon(<><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v9l9 5 9-5V8" /><path d="M12 13v9" /></>);
export const IconChart = () => icon(<><path d="M4 20V10M12 20V4M20 20v-7" /></>);
export const IconMegaphone = () => icon(<><path d="M3 11v3a1 1 0 0 0 1 1h2l2 5h2l-1-5h2l9 4V6l-9 4H6a1 1 0 0 0-1 1Z" /></>);
export const IconHeart = () => icon(<path d="M12 20s-7-4.35-9.3-8.6C1.2 8.2 3 5 6.3 5c2 0 3.4 1.1 4.2 2.3.3.5.6.9 1.5.9s1.2-.4 1.5-.9C14.3 6.1 15.7 5 17.7 5 21 5 22.8 8.2 21.3 11.4 19 15.65 12 20 12 20Z" />, 17);
export const IconLock = () => icon(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></>, 14);
export const IconStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.9 7.1.6-5.4 4.7 1.7 7.1L12 17.6l-6.3 3.7 1.7-7.1L2 9.5l7.1-.6L12 2Z" /></svg>
);
export const IconChevronDown = () => icon(<path d="m6 9 6 6 6-6" />, 16);
export const IconCheckFilled = () => (
  <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill={C.success} /><path d="m7 12.5 3.2 3.2L17 9" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const IconCircleOutline = () => (
  <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="none" stroke={C.border} strokeWidth="1.6" /></svg>
);
export const IconPencil = () => icon(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>, 16);
export const IconExport = () => icon(<><path d="M12 3v12M7 9l5-5 5 5" /><path d="M5 21h14" /></>, 16);
export const IconShare = () => icon(<><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.3 10.7 7.4-4.2M8.3 13.3l7.4 4.2" /></>, 15);
export const IconClose = () => icon(<path d="M6 6l12 12M18 6 6 18" />, 18);
export const IconTruck = () => icon(<><rect x="1" y="7" width="13" height="9" rx="1.5" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="6" cy="18.5" r="1.6" /><circle cx="16.5" cy="18.5" r="1.6" /></>, 18);
export const IconExternal = () => icon(<><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M8 6H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" /></>, 15);
export const IconLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo.png" alt="Dropi" width={28} height={28} style={{ display: "block" }} />
    <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19, color: C.orange }}>dropi</span>
  </div>
);

// ─── Piezas reutilizables de UI (según design system real) ───────────────────
// Anillo de foco visible: los inputs nativos van con outline:none, así que el
// wrapper necesita su propio indicador de :focus-within para no dejar la
// navegación por teclado sin ninguna señal visual.
export function FocusRingStyle() {
  return (
    <style>{`
      .dsc-focus-ring:focus-within, .dsc-focus-ring:focus-visible {
        box-shadow: 0 0 0 3px rgba(255,97,2,.25);
        border-color: ${C.orange};
      }
    `}</style>
  );
}
export function Input({ value, onChange, placeholder, type = "text" }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="dsc-focus-ring" style={{ border: `1px solid ${C.border}`, borderRadius: 4, height: 38, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px" }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", outline: "none", width: "100%", fontSize: 14, color: C.textHeader, fontFamily: FONT_UI, background: "transparent" }}
      />
    </div>
  );
}
export function StaticField({ value }: { value: string }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 4, height: 38, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px" }}>
      <span style={{ fontSize: 13.5, color: C.textHeader, fontFamily: FONT_UI, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 14, color: C.textHeader, marginBottom: 8 }}>{children}</p>;
}
export function RealSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ border: "none", cursor: "pointer", background: on ? C.orange : "#C3C9D9", width: 40, height: 21, borderRadius: 12, position: "relative", flexShrink: 0, padding: 0 }}>
      <span style={{ position: "absolute", top: 2, left: on ? 20 : 3, width: 17, height: 17, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
    </button>
  );
}
export function PrimaryButton({ children, onClick, color = C.success, disabled = false }: { children: React.ReactNode; onClick?: () => void; color?: string; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      background: disabled ? "#FBD9BC" : color, color: "#fff", border: "none", borderRadius: 4, height: 38,
      padding: "0 16px", fontFamily: FONT_UI, fontWeight: 500, fontSize: 14, cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
    }}>
      {children}
    </button>
  );
}
export function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: "#fff", color: C.textHeader, border: `1px solid ${C.border}`, borderRadius: 4, height: 38,
      padding: "0 14px", fontFamily: FONT_UI, fontWeight: 500, fontSize: 13, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      {children}
    </button>
  );
}
export function ProductImg({ product, size, radius = 8 }: { product: Product; size: number; radius?: number }) {
  return (
    <img
      src={product.image}
      alt={product.name}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", flexShrink: 0, background: C.bgGray }}
    />
  );
}
export function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted }}>{label}</span>
      <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textHeader }}>{value}</span>
    </div>
  );
}

// ─── Shell: Header + Rail + Sidebar (misma apariencia en ambas vistas) ────────
function RailIcon({ active, label, children }: { active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="dsc-focus-ring"
      style={{
        width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? C.orange : "transparent", color: active ? "#fff" : "#9AA1B9", border: "none", cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
function Header() {
  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${C.borderLight}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <IconLogo />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 700, color: C.info, letterSpacing: "0.04em" }}>PROTOTIPO</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_UI, fontSize: 14, color: C.gray700 }}>
          <span>$ 2.717.360.700</span>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          🧑‍💼
        </div>
      </div>
    </header>
  );
}
export function AppShell({
  activeIcon, sidebar, children,
}: {
  activeIcon: "search" | "cart";
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }} className={`${inter.variable} ${plex.variable}`}>
      <FocusRingStyle />
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100vh - 53px)" }}>
        <div style={{ width: 56, background: "#fff", borderRight: `1px solid ${C.borderLight}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", flexShrink: 0 }}>
          <RailIcon label="Inicio"><IconHome /></RailIcon>
          <RailIcon label="Estadísticas"><IconChart /></RailIcon>
          <RailIcon label="Productos" active={activeIcon === "search"}><IconSearch /></RailIcon>
          <RailIcon label="Pedidos" active={activeIcon === "cart"}><IconCart /></RailIcon>
          <RailIcon label="Inventario"><IconBox /></RailIcon>
          <RailIcon label="Marketing"><IconMegaphone /></RailIcon>
        </div>
        <div style={{ width: 200, background: C.bgGraySide, flexShrink: 0, padding: "16px 8px" }}>
          {sidebar}
        </div>
        <div style={{ flex: 1, padding: "16px 32px", minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
export function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 12 }}>
      <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 14, color: C.gray700 }}>{children}</span>
      <span style={{ color: C.textMuted }}><IconChevronDown /></span>
    </div>
  );
}
export function SidebarItem({ label, activeIcon, active, badge }: { label: string; activeIcon: React.ReactNode; active?: boolean; badge?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, height: 35, padding: "0 8px", borderRadius: 8,
      background: active ? "#fff" : "transparent", marginBottom: 4,
    }}>
      <span style={{ color: active ? C.orange : C.textMuted }}>{activeIcon}</span>
      <span style={{ fontFamily: FONT_UI, fontSize: 13.5, fontWeight: active ? 600 : 400, color: active ? C.orange : C.gray700, flex: 1 }}>{label}</span>
      {badge && <span style={{ fontSize: 9, fontWeight: 700, color: C.info, background: "#E5F2FE", padding: "2px 6px", borderRadius: 999 }}>{badge}</span>}
    </div>
  );
}
export function ProductosSidebar({ variant }: { variant: "proveedor" | "dropshipper" }) {
  if (variant === "proveedor") {
    return (
      <>
        <SidebarHeading>Productos</SidebarHeading>
        <SidebarItem label="Mis productos" activeIcon={<IconBox />} active />
        <SidebarItem label="Negociaciones" activeIcon={<IconMegaphone />} />
        <SidebarItem label="Cazaproductos" activeIcon={<IconSearch />} />
      </>
    );
  }
  return (
    <>
      <SidebarHeading>Productos</SidebarHeading>
      <div style={{ marginLeft: 4, marginBottom: 4 }}>
        <SidebarItem label="Productos" activeIcon={<IconBox />} active />
        <SidebarItem label="Proveedores" activeIcon={<IconCart />} />
      </div>
      <SidebarItem label="Negociaciones" activeIcon={<IconMegaphone />} badge="Nuevo" />
      <SidebarItem label="Cazaproductos" activeIcon={<IconSearch />} badge="Beta" />
    </>
  );
}

// ─── Detalle de producto (dropshipper) ────────────────────────────────────────
export function ProductDetail({
  product, discount, live, onOrder,
}: { product: Product; discount: Discount; live: boolean; onOrder: () => void }) {
  const desc = DESCRIPTIONS[product.id];
  const meta = SUPPLIER_META[product.supplier];
  const finalPrice = computeFinalPrice(product.providerPrice, discount);
  const privateStock = Math.round(product.stock * 0.3);
  const [tab, setTab] = useState<"detalles" | "garantias" | "recursos">("detalles");

  return (
    <div style={{ background: "#fff", border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Imagen */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.borderLight}` }} />
        </div>

        {/* Info */}
        <div style={{ flex: "1 1 380px", minWidth: 320 }}>
          <span style={{ display: "inline-block", fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, border: `1px solid ${C.border}`, background: C.bgGray, padding: "3px 10px", borderRadius: 8, marginBottom: 10 }}>
            ID: {product.sku}
          </span>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: C.gray700, marginBottom: 4 }}>{product.name}</h2>
          <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, marginBottom: 8 }}>SKU: {product.sku}</p>
          <span style={{ display: "inline-block", fontFamily: FONT_UI, fontSize: 12, color: C.gray700, background: "#E6EAF2", padding: "3px 10px", borderRadius: 999, marginBottom: 16 }}>{product.category}</span>

          <p style={{ fontFamily: FONT_UI, fontSize: 13, color: "#475066", marginBottom: 8 }}>
            Tipo de producto: <strong style={{ fontWeight: 600 }}>{product.typeBadge ?? "Simple"}</strong>
          </p>
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Precio del proveedor:</p>
              {live ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textDisabled, textDecoration: "line-through" }}>{money(product.providerPrice)}</span>
                  <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, color: C.success }}>{money(finalPrice)}</span>
                </div>
              ) : (
                <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, color: C.gray700 }}>{money(product.providerPrice)}</p>
              )}
            </div>
            <div style={{ width: 1, height: 32, background: C.borderLight }} />
            <div>
              <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Precio sugerido:</p>
              <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 18, color: C.gray700 }}>{money(product.suggestedPrice)}</p>
            </div>
            {live && (
              <span style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 700, background: C.dangerBg, color: C.danger, padding: "3px 9px", borderRadius: 999 }}>
                -{discount.type === "percent" ? `${discount.value}%` : money(product.providerPrice - finalPrice)}
              </span>
            )}
          </div>

          <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Producto disponible en: <span style={{ color: "#475066" }}>{product.city}</span></p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontFamily: FONT_UI, fontSize: 14, color: "#475066" }}>Stock: <strong style={{ color: C.success }}>{product.stock}</strong></span>
            <span style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 600, background: C.successBg, color: C.success, padding: "3px 9px", borderRadius: 999 }}>Stock privado: {privateStock}</span>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 160px" }}><PrimaryButton color={C.orange} onClick={onOrder}><IconCart />Enviar al cliente</PrimaryButton></div>
            <div style={{ flex: "1 1 160px" }}><GhostButton>Solicitar muestra</GhostButton></div>
            <div style={{ flex: "1 1 160px" }}><GhostButton>Calculadora de flete</GhostButton></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button type="button" title="Exportar" aria-label="Exportar" className="dsc-focus-ring" style={{ width: 38, height: 38, border: `1px solid ${C.border}`, borderRadius: 4, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}><IconExport /></button>
            <button type="button" title="Agregar a favoritos" aria-label="Agregar a favoritos" className="dsc-focus-ring" style={{ width: 38, height: 38, border: `1px solid ${C.border}`, borderRadius: 4, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}><IconHeart /></button>
            <button type="button" title="Compartir" aria-label="Compartir" className="dsc-focus-ring" style={{ width: 38, height: 38, border: `1px solid ${C.border}`, borderRadius: 4, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}><IconShare /></button>
          </div>

          {/* Ficha proveedor */}
          {meta && (
            <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ height: 8, background: "linear-gradient(90deg, #FFC10D, #FF6102)" }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: `2px solid #fff`, boxShadow: `0 0 0 1px ${C.borderLight}` }}>
                      🏢
                    </div>
                    <div>
                      <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.gray700 }}>{product.supplier}{meta.verified && " ✓"}</p>
                      <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>{meta.verified ? "Verificado" : "Sin verificar"}</p>
                    </div>
                  </div>
                  <GhostButton>Contactar</GhostButton>
                </div>
                <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader, marginBottom: 8 }}><strong>{meta.performance}:</strong> {meta.desc}</p>
                <div style={{ display: "flex", gap: 12, height: 8, marginBottom: 12 }}>
                  <div style={{ flex: meta.segments[0], background: C.dangerBg, borderRadius: 21 }} />
                  <div style={{ flex: meta.segments[1], background: C.warning, borderRadius: 21 }} />
                  <div style={{ flex: meta.segments[2], background: C.successBg, borderRadius: 21 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>⏱ Tiempo promedio de despacho: <strong style={{ color: "#475066" }}>{meta.despacho}</strong></span>
                  <span style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 700, color: C.orange }}>Ver más ⌄</span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${C.borderLight}`, marginBottom: 16 }}>
            {[{ k: "detalles", l: "Detalles" }, { k: "garantias", l: "Garantías" }, { k: "recursos", l: "Recursos adicionales" }].map((t) => (
              <div key={t.k} onClick={() => setTab(t.k as typeof tab)} style={{
                cursor: "pointer", fontFamily: FONT_UI, fontWeight: 700, fontSize: 14,
                color: tab === t.k ? C.textHeader : "#858EA6", paddingBottom: 12,
                borderBottom: tab === t.k ? `2px solid ${C.orange}` : "none",
              }}>{t.l}</div>
            ))}
          </div>
          {tab === "detalles" && desc && (
            <div>
              <p style={{ fontFamily: FONT_UI, fontSize: 13.5, color: "#475066", lineHeight: 1.6, marginBottom: 10 }}>{desc.text}</p>
              <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 13.5, color: C.gray700, marginBottom: 6 }}>Especificaciones:</p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {desc.specs.map((s) => <li key={s} style={{ fontFamily: FONT_UI, fontSize: 13.5, color: "#475066", lineHeight: 1.7 }}>{s}</li>)}
              </ul>
            </div>
          )}
          {tab !== "detalles" && (
            <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>No hay información adicional configurada para esta pestaña en el prototipo.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Creación de orden manual ─────────────────────────────────────────
export function CrearOrdenModal({
  product, discount, onClose,
}: { product: Product; discount: Discount; onClose: () => void }) {
  const [ventaPrice, setVentaPrice] = useState(product.suggestedPrice);
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState(true);
  const [carrierType, setCarrierType] = useState<"con" | "sin">("con");
  const [carrier, setCarrier] = useState<string | null>(null);

  const providerUnit = computeFinalPrice(product.providerPrice, discount);
  const totalProveedor = providerUnit * cantidad;
  const totalVenta = ventaPrice * cantidad;
  const shipping = carrier ? CARRIERS.find((c) => c.name === carrier)!.price : null;
  const totalRecaudar = totalVenta + (shipping ?? 0);
  const comision = 0;
  const ganancias = shipping != null ? totalRecaudar - totalProveedor - shipping - comision : null;
  const live = isLive(discount);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,18,25,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} className={`${inter.variable} ${plex.variable}`}>
      <div style={{ background: "#fff", borderRadius: 12, width: "min(1180px, 96vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
          <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, color: C.gray700 }}>Creación de orden manual</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}><IconClose /></button>
        </div>

        <div style={{ display: "flex", gap: 20, padding: 24, overflowY: "auto", flex: 1, flexWrap: "wrap" }}>
          {/* Columna 1: cliente + producto */}
          <div style={{ flex: "1.5 0 0", minWidth: 340 }}>
            <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 15, color: C.gray700, marginBottom: 14 }}>Información del cliente:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <StaticField value="Alejandra" /><StaticField value="Melo" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, marginBottom: 10 }}>
              <StaticField value="🇨🇴 +57" /><StaticField value="3175754197" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <StaticField value="Valle ⌄" /><StaticField value="Palmira ⌄" />
            </div>
            <div style={{ marginBottom: 10 }}><StaticField value="Carrera 26 # 13 -11" /></div>
            <div style={{ marginBottom: 10 }}><StaticField value="alejandra.melo@gmail.com" /></div>
            <div style={{ marginBottom: 14 }}><StaticField value="Tienda Dropi 1 ⌄" /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <RealSwitch on={notas} onToggle={() => setNotas((v) => !v)} />
              <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>¿Desea agregar notas para el proveedor?</span>
            </div>
            {notas && <div style={{ marginBottom: 20 }}><Input value="" onChange={() => {}} placeholder="Nota" /></div>}

            <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 16 }}>
              <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 15, color: C.gray700, marginBottom: 14 }}>Seleccionar productos:</p>
              <div style={{ border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <ProductImg product={product} size={50} radius={8} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 13.5, color: C.gray700, marginBottom: 3 }}>{product.name}</p>
                    <p style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textMuted, marginBottom: 3 }}>ID: {product.sku} · Proveedor: {product.supplier}</p>
                    <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader }}>
                      Precio proveedor: {live ? (
                        <>
                          <span style={{ textDecoration: "line-through", color: C.textDisabled, marginRight: 6 }}>{money(product.providerPrice)}</span>
                          <strong style={{ color: C.success }}>{money(providerUnit)}</strong>
                        </>
                      ) : <strong>{money(product.providerPrice)}</strong>}
                    </p>
                  </div>
                </div>
                <div style={{ height: 1, background: C.borderLight, marginBottom: 12 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Precio de venta</p>
                    <Input type="number" value={ventaPrice} onChange={(v) => setVentaPrice(Number(v))} />
                    <p style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginTop: 4 }}>Precio sugerido: {money(product.suggestedPrice)}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Cantidad</p>
                    <Input type="number" value={cantidad} onChange={(v) => setCantidad(Math.max(1, Number(v)))} />
                    <p style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginTop: 4 }}>Stock: {product.stock}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: transportadora */}
          <div style={{ flex: "1 0 0", minWidth: 260, borderLeft: `1px solid ${C.borderLight}`, paddingLeft: 20 }}>
            <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 15, color: C.gray700, marginBottom: 14 }}>Seleccione una transportadora:</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {(["con", "sin"] as const).map((t) => (
                <button key={t} onClick={() => setCarrierType(t)} style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 8, height: 40, borderRadius: 6, cursor: "pointer",
                  border: carrierType === t ? `1.5px solid ${C.orange}` : `1px solid ${C.border}`,
                  background: carrierType === t ? "#FFF3EA" : "#fff", padding: "0 12px",
                  fontFamily: FONT_UI, fontSize: 13, fontWeight: 600, color: carrierType === t ? C.orange : C.textHeader,
                }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: carrierType === t ? `4.5px solid ${C.orange}` : `2px solid ${C.border}`, background: "#fff" }} />
                  {t === "con" ? "Con recaudo" : "Sin recaudo"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CARRIERS.map((c) => {
                const selected = carrier === c.name;
                return (
                  <button key={c.name} onClick={() => setCarrier(c.name)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 6, cursor: "pointer",
                    background: selected ? C.infoBg : "transparent", border: "none", textAlign: "left",
                  }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                      <IconTruck />
                    </span>
                    <span style={{ flex: 1, fontFamily: FONT_UI, fontSize: 13.5, color: C.textHeader, fontWeight: selected ? 700 : 400 }}>{c.name}</span>
                    <span style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 600, color: selected ? C.blue : C.textMuted }}>
                      {selected ? money(c.price) : "Calculando…"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna 3: resumen */}
          <div style={{ flex: "0.9 0 0", minWidth: 240, borderLeft: `1px solid ${C.borderLight}`, paddingLeft: 20 }}>
            <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 15, color: C.gray700, marginBottom: 14 }}>Resumen de la orden:</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textMuted, fontWeight: 700 }}>PRODUCTO</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textMuted, fontWeight: 700 }}>PRECIO DE VENTA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader, maxWidth: 140 }}>{product.name} ({cantidad})</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader, fontWeight: 600 }}>{money(totalVenta)}</span>
            </div>
            <div style={{ height: 1, background: C.borderLight, marginBottom: 14 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700, color: C.gray700 }}>Total a recaudar:</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700, color: C.gray700 }}>{money(totalRecaudar)}</span>
            </div>
            <Row label="Precio proveedor:" value={live ? <><s style={{ color: C.textDisabled, marginRight: 6 }}>{money(product.providerPrice * cantidad)}</s>{money(totalProveedor)}</> : money(totalProveedor)} />
            <Row label="Precio de envío:" value={shipping != null ? money(shipping) : "—"} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted }}>Comisión de la plataforma <span style={{ fontSize: 10, background: C.successBg, color: C.success, padding: "1px 6px", borderRadius: 999, marginLeft: 4 }}>Exento</span></span>
              <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted }}>{money(comision)}</span>
            </div>
            <div style={{ height: 1, background: C.borderLight, marginBottom: 10 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700, color: C.success }}>Ganancias:</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700, color: C.success }}>{ganancias != null ? money(ganancias) : "—"}</span>
            </div>
            {live && (
              <div style={{ marginTop: 14, background: C.successBg, border: `1px solid #B7E9D6`, borderRadius: 8, padding: "8px 10px", fontFamily: FONT_UI, fontSize: 11.5, color: C.success }}>
                🏷️ Descuento activo aplicado al precio proveedor — mejora la ganancia en {money(product.providerPrice - providerUnit)} por unidad.
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "16px 24px", borderTop: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton color={C.orange} disabled={!carrier} onClick={onClose}><IconCart />Enviar al cliente</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
