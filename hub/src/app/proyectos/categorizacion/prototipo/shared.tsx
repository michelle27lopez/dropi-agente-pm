"use client";

import { useState } from "react";

// ─── Tokens del design system del hub (DESIGN.md) ─────────────────────────
// Sigue la estructura real de filtros/navegación del catálogo de Dropi
// (Figma "Re-arquitectura · UI Oficial 2.0", node 9269-98827), pero expresada
// con la paleta y tipografía consolidadas de este repo — no los hex exactos
// de la app de Dropi. Un solo acento naranja por vista, tipografía de sistema,
// cuatro colores de estado, radios de esquina en 4 pasos (8/12/20/pill).
function tint(hex: string, alpha = 0.12) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const RAW = { orange: "#F77F00", success: "#10B981", warning: "#F59E0B", danger: "#EF4444", info: "#3B82F6" };

export const C = {
  orange: RAW.orange,
  orangeLight: "#FFF3E0", // dropi-orange-tint (DESIGN.md)
  success: RAW.success, successBg: tint(RAW.success),
  warning: RAW.warning, warningBg: tint(RAW.warning),
  danger: RAW.danger, dangerBg: tint(RAW.danger), dangerBorder: tint(RAW.danger, 0.35),
  info: RAW.info, infoBg: tint(RAW.info), infoBorder: tint(RAW.info, 0.35),
  textHeader: "#111827", // neutral-ink
  textMuted: "#6B7280", // neutral-muted
  textDisabled: "#6B7280",
  border: "#E5E7EB", // neutral-border
  borderLight: "#E5E7EB",
  bgGray: "#F8F9FA", // neutral-bg
  bgGraySide: "#F8F9FA",
  gray600: "#111827",
  gray700: "#111827",
};

// DESIGN.md: "una sola familia tipográfica... nunca mezclar dos sans-serif".
export const FONT_UI = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_HEAD = FONT_UI;
export const RADIUS = { sm: 8, md: 12, lg: 20, pill: 999 };

// Reutiliza las mismas fotos/banner/logos que el prototipo de Descuentos —
// son los mismos assets reales descargados del Figma "Productos v2.0",
// alojados en /public/dropi-catalog para no depender de URLs temporales.
const IMG = (n: number) => `/dropi-catalog/p${n}.png`;
export const BANNER_IMG = "/dropi-catalog/banner.png";
export const SUPPLIERS = [
  { name: "Suppli", logo: "/dropi-catalog/supplier-suppli.png", verified: false },
  { name: "ADMA", logo: "/dropi-catalog/supplier-adma.png", verified: true },
  { name: "Shopi Pauta", logo: "/dropi-catalog/supplier-shopipauta.png", verified: true },
];

export const money = (n: number) => "$ " + Math.round(n).toLocaleString("es-CO");

// ═══════════════════════════════════════════════════════════════════════════
// Taxonomía — misma jerarquía unificada L1→L4 usada en CAT-001
// (hub/src/app/proyectos/categorizacion/page.tsx · DROPI_MAPPING_DICT)
// ═══════════════════════════════════════════════════════════════════════════
export type CategoryNode = {
  id: string;
  name: string;
  children?: CategoryNode[];
};

export const CATEGORY_TREE: CategoryNode[] = [
  {
    id: "tecnologia", name: "Tecnología y Electrónica", children: [
      { id: "tec-general", name: "Tecnología General", children: [
        { id: "tec-general-componentes", name: "Componentes y Accesorios", children: [
          { id: "tec-general-componentes-cables", name: "Cables y Adaptadores de Datos" },
        ] },
      ] },
      { id: "tec-gadgets", name: "Gadgets y Novedades", children: [
        { id: "tec-gadgets-dispositivos", name: "Dispositivos Inteligentes", children: [
          { id: "tec-gadgets-dispositivos-smartwatch", name: "Smartwatches y Pulseras Inteligentes" },
        ] },
      ] },
      { id: "tec-videojuegos", name: "Videojuegos y Consolas", children: [
        { id: "tec-videojuegos-accesorios", name: "Accesorios de Consolas", children: [
          { id: "tec-videojuegos-accesorios-controles", name: "Controles y Joysticks" },
        ] },
      ] },
    ],
  },
  {
    id: "hogar", name: "Hogar y Decoración", children: [
      { id: "hogar-cocina", name: "Cocina y Utensilios", children: [
        { id: "hogar-cocina-coccion", name: "Cocción y Preparación", children: [
          { id: "hogar-cocina-coccion-utensilios", name: "Utensilios de Cocina (Cucharas, Espátulas)" },
        ] },
        { id: "hogar-cocina-electro", name: "Electrodomésticos de Cocina", children: [
          { id: "hogar-cocina-electro-licuadoras", name: "Licuadoras y Batidoras" },
        ] },
      ] },
      { id: "hogar-decoracion", name: "Decoración y Diseño", children: [
        { id: "hogar-decoracion-adornos", name: "Adornos de Hogar", children: [
          { id: "hogar-decoracion-adornos-mesa", name: "Adornos de Mesa y Pared" },
        ] },
      ] },
      { id: "hogar-jardin", name: "Jardín y Exteriores", children: [
        { id: "hogar-jardin-cuidado", name: "Cuidado de Jardín", children: [
          { id: "hogar-jardin-cuidado-herramientas", name: "Herramientas de Jardinería" },
        ] },
      ] },
    ],
  },
  {
    id: "moda", name: "Moda y Calzado", children: [
      { id: "moda-bisuteria", name: "Bisutería, Joyas y Relojes", children: [
        { id: "moda-bisuteria-b", name: "Bisutería", children: [
          { id: "moda-bisuteria-b-fantasia", name: "Bisutería de Acero y Fantasía" },
          { id: "moda-bisuteria-b-cadenas", name: "Cadenas, Pulseras y Aretes" },
        ] },
      ] },
      { id: "moda-bolsos", name: "Bolsos, Morrales y Accesorios", children: [
        { id: "moda-bolsos-carteras", name: "Carteras y Bolsos", children: [
          { id: "moda-bolsos-carteras-dama", name: "Carteras de Dama y Crossbody" },
        ] },
      ] },
      { id: "moda-calzado", name: "Calzado y Zapatos", children: [
        { id: "moda-calzado-casual", name: "Calzado Casual", children: [
          { id: "moda-calzado-casual-mocasines", name: "Zapatos Casuales y Mocasines" },
        ] },
        { id: "moda-calzado-botas", name: "Botas y Botines", children: [
          { id: "moda-calzado-botas-b", name: "Botas y Botines" },
        ] },
      ] },
    ],
  },
  {
    id: "deportes", name: "Deportes y Outdoor", children: [
      { id: "deportes-camping", name: "Camping y Pesca", children: [
        { id: "deportes-camping-equip", name: "Equipamiento de Camping", children: [
          { id: "deportes-camping-equip-linternas", name: "Linternas de Cabeza y Camping" },
        ] },
      ] },
      { id: "deportes-fitness", name: "Equipos Fitness y Gimnasio", children: [
        { id: "deportes-fitness-casa", name: "Entrenamiento en Casa", children: [
          { id: "deportes-fitness-casa-bandas", name: "Bandas de Resistencia" },
        ] },
      ] },
    ],
  },
  {
    id: "belleza", name: "Belleza y Cuidado Personal", children: [
      { id: "belleza-capilar", name: "Cuidado Capilar", children: [
        { id: "belleza-capilar-prod", name: "Productos para el Cabello", children: [
          { id: "belleza-capilar-prod-tratamientos", name: "Tratamientos y Aceites Capilares" },
        ] },
      ] },
      { id: "belleza-maquillaje", name: "Maquillaje y Cosméticos", children: [
        { id: "belleza-maquillaje-rostro", name: "Maquillaje Rostro/Ojos", children: [
          { id: "belleza-maquillaje-rostro-r", name: "Maquillaje de Ojos y Rostro" },
        ] },
      ] },
    ],
  },
  {
    id: "mascotas", name: "Mascotas", children: [
      { id: "mascotas-general", name: "Mascotas General", children: [
        { id: "mascotas-general-accesorios", name: "Accesorios de Mascota", children: [
          { id: "mascotas-general-accesorios-paseo", name: "Accesorios de Paseo y Arnés" },
        ] },
      ] },
    ],
  },
];

// ─── Helpers de árbol ─────────────────────────────────────────────────────
export function findNode(id: string, nodes: CategoryNode[] = CATEGORY_TREE): CategoryNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(id, n.children);
      if (found) return found;
    }
  }
  return null;
}

export function pathToNode(id: string, nodes: CategoryNode[] = CATEGORY_TREE, trail: CategoryNode[] = []): CategoryNode[] | null {
  for (const n of nodes) {
    const nextTrail = [...trail, n];
    if (n.id === id) return nextTrail;
    if (n.children) {
      const found = pathToNode(id, n.children, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

// Todos los ids descendientes de un nodo (incluido él mismo) — para filtrar.
export function descendantIds(node: CategoryNode): string[] {
  const ids = [node.id];
  node.children?.forEach((c) => ids.push(...descendantIds(c)));
  return ids;
}

// ═══════════════════════════════════════════════════════════════════════════
// Productos mock — cada uno mapeado a una categoría hoja real de la taxonomía
// ═══════════════════════════════════════════════════════════════════════════
export type Product = {
  id: string;
  sku: string;
  name: string;
  image: string;
  providerPrice: number;
  suggestedPrice: number;
  supplier: string;
  stock: number;
  categoryLeafId: string; // id de la hoja L4 en CATEGORY_TREE
};

export const PRODUCTS: Product[] = [
  { id: "c1", sku: "3010001", name: "Cable USB-C trenzado 2M carga rápida", image: IMG(2), providerPrice: 12000, suggestedPrice: 24000, supplier: "Tienda Proveedor", stock: 340, categoryLeafId: "tec-general-componentes-cables" },
  { id: "c2", sku: "3010002", name: "Y68 Reloj Inteligente GPS Pulso Cardiaco", image: IMG(2), providerPrice: 62000, suggestedPrice: 120000, supplier: "Tienda Proveedor", stock: 996, categoryLeafId: "tec-gadgets-dispositivos-smartwatch" },
  { id: "c3", sku: "3010003", name: "Control inalámbrico compatible multiplataforma", image: IMG(2), providerPrice: 45000, suggestedPrice: 85000, supplier: "Tienda Proveedor", stock: 58, categoryLeafId: "tec-videojuegos-accesorios-controles" },
  { id: "c4", sku: "3010004", name: "Set de utensilios de cocina x12", image: IMG(5), providerPrice: 38000, suggestedPrice: 72000, supplier: "Tienda Proveedor", stock: 120, categoryLeafId: "hogar-cocina-coccion-utensilios" },
  { id: "c5", sku: "3010005", name: "Licuadora portátil recargable USB", image: IMG(3), providerPrice: 42000, suggestedPrice: 79000, supplier: "Tienda Proveedor", stock: 64, categoryLeafId: "hogar-cocina-electro-licuadoras" },
  { id: "c6", sku: "3010006", name: "Set de adornos decorativos para mesa", image: IMG(1), providerPrice: 25000, suggestedPrice: 48000, supplier: "Tienda Proveedor", stock: 88, categoryLeafId: "hogar-decoracion-adornos-mesa" },
  { id: "c7", sku: "3010007", name: "Kit de herramientas de jardinería x5", image: IMG(6), providerPrice: 30000, suggestedPrice: 56000, supplier: "Tienda Proveedor", stock: 96, categoryLeafId: "hogar-jardin-cuidado-herramientas" },
  { id: "c8", sku: "3010008", name: "Set de bisutería acero dorado 6 piezas", image: IMG(8), providerPrice: 15000, suggestedPrice: 29000, supplier: "Tienda Proveedor", stock: 210, categoryLeafId: "moda-bisuteria-b-fantasia" },
  { id: "c9", sku: "3010009", name: "Cadena y pulsera acero quirúrgico", image: IMG(8), providerPrice: 12000, suggestedPrice: 24000, supplier: "Tienda Proveedor", stock: 175, categoryLeafId: "moda-bisuteria-b-cadenas" },
  { id: "c10", sku: "3010010", name: "Cartera crossbody de dama", image: IMG(4), providerPrice: 28000, suggestedPrice: 52000, supplier: "Tienda Proveedor", stock: 47, categoryLeafId: "moda-bolsos-carteras-dama" },
  { id: "c11", sku: "3010011", name: "Zapatos casuales tipo mocasín", image: IMG(4), providerPrice: 40000, suggestedPrice: 76000, supplier: "Tienda Proveedor", stock: 33, categoryLeafId: "moda-calzado-casual-mocasines" },
  { id: "c12", sku: "3010012", name: "Botas cortas de dama", image: IMG(4), providerPrice: 45000, suggestedPrice: 85000, supplier: "Tienda Proveedor", stock: 0, categoryLeafId: "moda-calzado-botas-b" },
  { id: "c13", sku: "3010013", name: "Linterna de cabeza recargable LED", image: IMG(6), providerPrice: 20000, suggestedPrice: 38000, supplier: "Tienda Proveedor", stock: 140, categoryLeafId: "deportes-camping-equip-linternas" },
  { id: "c14", sku: "3010014", name: "Set de bandas de resistencia x5", image: IMG(7), providerPrice: 22000, suggestedPrice: 40000, supplier: "Tienda Proveedor", stock: 260, categoryLeafId: "deportes-fitness-casa-bandas" },
  { id: "c15", sku: "3010015", name: "Tratamiento capilar aceite de argán", image: IMG(1), providerPrice: 18000, suggestedPrice: 34000, supplier: "Tienda Proveedor", stock: 190, categoryLeafId: "belleza-capilar-prod-tratamientos" },
  { id: "c16", sku: "3010016", name: "Paleta de maquillaje 12 tonos", image: IMG(1), providerPrice: 20000, suggestedPrice: 38000, supplier: "Tienda Proveedor", stock: 300, categoryLeafId: "belleza-maquillaje-rostro-r" },
  { id: "c17", sku: "3010017", name: "Arnés y correa para mascota reflectiva", image: IMG(6), providerPrice: 16000, suggestedPrice: 30000, supplier: "Tienda Proveedor", stock: 112, categoryLeafId: "mascotas-general-accesorios-paseo" },
];

export function categoryNamesFor(product: Product): string[] {
  const trail = pathToNode(product.categoryLeafId);
  return trail ? trail.map((n) => n.name) : [];
}

// Cuenta productos cuya hoja cae dentro del subárbol de `node` (incluido él mismo).
export function countProductsIn(node: CategoryNode): number {
  const ids = new Set(descendantIds(node));
  return PRODUCTS.filter((p) => ids.has(p.categoryLeafId)).length;
}

// ─── Iconos mínimos (línea, currentColor) ─────────────────────────────────
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
export const IconChevronDown = () => icon(<path d="m6 9 6 6 6-6" />, 16);
export const IconChevronRight = () => icon(<path d="m9 6 6 6-6 6" />, 14);
export const IconFolder = () => icon(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />, 16);
export const IconLock = () => icon(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></>, 15);
export const IconCamera = () => icon(<><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13.5" r="3.2" /></>, 16);
export const IconCheck = () => icon(<path d="M20 6 9 17l-5-5" />, 12);
export const IconClose = () => icon(<path d="M6 6l12 12M18 6 6 18" />, 16);
export const IconLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo.png" alt="Dropi" width={28} height={28} style={{ display: "block" }} />
    <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 19, color: C.orange }}>dropi</span>
  </div>
);

// ─── Piezas reutilizables de UI (DESIGN.md: input/button-primary/button-ghost) ─
const HOVER_LIFT = "0 1px 3px rgba(0,0,0,0.06)";

export function Input({ value, onChange, placeholder, type = "text" }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: RADIUS.sm, height: 38, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px" }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", outline: "none", width: "100%", fontSize: 13, color: C.textHeader, fontFamily: FONT_UI, background: "transparent" }}
      />
    </div>
  );
}
export function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: disabled ? C.orangeLight : hover ? "#DB7300" : C.orange,
        color: disabled ? C.orange : "#fff", border: "none", borderRadius: RADIUS.sm, height: 38,
        padding: "0 16px", fontFamily: FONT_UI, fontWeight: 600, fontSize: 13, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
        boxShadow: !disabled && hover ? HOVER_LIFT : "none",
      }}
    >
      {children}
    </button>
  );
}
export function GhostButton({ children, onClick, active = false }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? C.infoBg : "#fff", color: active ? C.info : C.textHeader,
        border: `1px solid ${active ? C.infoBorder : C.border}`, borderRadius: RADIUS.sm, height: 38,
        padding: "0 14px", fontFamily: FONT_UI, fontWeight: 500, fontSize: 13, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 6,
        boxShadow: hover ? HOVER_LIFT : "none",
      }}
    >
      {children}
    </button>
  );
}
// Switch decorativo (siempre "off" en este prototipo) para Favoritos/Privados/
// Con órdenes — mismo patrón no-funcional que el resto de selects del catálogo.
export function RealSwitch({ on = false, onToggle }: { on?: boolean; onToggle?: () => void }) {
  return (
    <button onClick={onToggle} style={{ border: "none", cursor: onToggle ? "pointer" : "default", background: on ? C.orange : C.border, width: 36, height: 20, borderRadius: RADIUS.pill, position: "relative", flexShrink: 0, padding: 0 }}>
      <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
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

// ─── Shell: Header + Rail + Sidebar ────────────────────────────────────────
// Nav activa: se marca por peso tipográfico (título vs. cuerpo + muted), no
// por color — DESIGN.md reserva el naranja sólido a un elemento por vista.
function RailIcon({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: RADIUS.sm, display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent", color: active ? C.textHeader : C.textMuted,
    }}>
      {children}
    </div>
  );
}
// URL real del piloto de Categorización con IA (Card 8 del panel de recursos
// de CAT-001) — se embebe como "Vista Proveedor" en vez de duplicar su
// formulario "Crear Producto" + CategoryPickerIA en este prototipo.
export const SUPPLIER_LAB_URL = "https://dropi-agente-pm.vercel.app/dashboard/productos";

function Header() {
  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <a href="/proyectos/categorizacion" style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, textDecoration: "none" }}>← Categorización y Enriquecimiento</a>
      <span style={{ color: C.border }}>/</span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <IconLogo />
        <span style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 500, color: C.textMuted, letterSpacing: "0.04em" }}>PROTOTIPO</span>
      </div>
    </header>
  );
}
function Tag({ label, tone }: { label: string; tone: "orange" | "info" }) {
  const bg = tone === "orange" ? C.orangeLight : C.infoBg;
  const fg = tone === "orange" ? C.orange : C.info;
  return (
    <span style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, color: fg, background: bg, padding: "2px 8px", borderRadius: RADIUS.pill }}>
      {label}
    </span>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: FONT_UI }}>
      <Header />
      <div style={{ display: "flex", minHeight: "calc(100vh - 53px)" }}>
        <div style={{ width: 56, background: "#fff", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", flexShrink: 0 }}>
          <RailIcon><IconHome /></RailIcon>
          <RailIcon><IconChart /></RailIcon>
          <RailIcon active><IconSearch /></RailIcon>
          <RailIcon><IconCart /></RailIcon>
          <RailIcon><IconBox /></RailIcon>
          <RailIcon><IconMegaphone /></RailIcon>
        </div>
        <div style={{ width: 200, background: C.bgGraySide, flexShrink: 0, padding: "16px 8px", borderRight: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, color: C.textHeader, padding: "0 8px", marginBottom: 12 }}>Productos</p>
          <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 13, color: C.textHeader, padding: "0 8px", marginBottom: 6 }}>Catálogo</p>
          <div style={{ paddingLeft: 8, marginBottom: 8 }}>
            {[
              { label: "Productos", icon: <IconBox />, active: true },
              { label: "Proveedores", icon: <IconCart />, active: false },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 10, height: 32, padding: "0 8px", borderRadius: RADIUS.sm,
              }}>
                <span style={{ color: item.active ? C.textHeader : C.textMuted }}>{item.icon}</span>
                <span style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? C.textHeader : C.textMuted, flex: 1 }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 32, padding: "0 8px" }}>
            <span style={{ color: C.textMuted }}><IconMegaphone /></span>
            <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader, flex: 1 }}>Negociaciones</span>
            <Tag label="Nuevo" tone="orange" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 32, padding: "0 8px" }}>
            <span style={{ color: C.textMuted }}><IconSearch /></span>
            <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader, flex: 1 }}>Cazaproductos</span>
            <Tag label="Beta" tone="info" />
          </div>
        </div>
        <div style={{ flex: 1, padding: "16px 32px", minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
