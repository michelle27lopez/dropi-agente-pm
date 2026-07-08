"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  C, FONT_UI, RADIUS, PRODUCTS, Product, CATEGORY_TREE, CategoryNode, SUPPLIERS, BANNER_IMG,
  SUPPLIER_LAB_URL,
  money, findNode, pathToNode, descendantIds, countProductsIn, categoryNamesFor,
  AppShell, Input, GhostButton, PrimaryButton, RealSwitch,
  IconHeart, IconChevronDown, IconLock, IconCart, IconCamera, IconCheck, IconClose,
} from "./shared";

export default function CategorizacionPrototipoPage() {
  const [tab, setTab] = useState<"proveedor" | "dropshipper">("dropshipper");

  return (
    <div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/proyectos/categorizacion" style={{ fontSize: 13, color: C.textMuted, textDecoration: "none", fontFamily: FONT_UI }}>← Categorización y Enriquecimiento</a>
        <span style={{ color: C.border }}>/</span>
        <span style={{ fontSize: 13, color: C.textHeader, fontWeight: 600, fontFamily: FONT_UI }}>Prototipo · catálogo por taxonomía unificada</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, background: "#F3F4F6", padding: 4, borderRadius: 10 }}>
          {[{ k: "proveedor", l: "🏭 Vista Proveedor" }, { k: "dropshipper", l: "🛒 Vista Dropshipper" }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as "proveedor" | "dropshipper")} style={{
              border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 7,
              background: tab === t.k ? "#fff" : "transparent", boxShadow: tab === t.k ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              fontSize: 12.5, fontWeight: 700, color: tab === t.k ? C.textHeader : C.textMuted, fontFamily: FONT_UI,
            }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {tab === "proveedor" ? (
        <iframe
          src={SUPPLIER_LAB_URL}
          title="Piloto · Categorización con IA (supplier-lab)"
          style={{ width: "100%", height: "calc(100vh - 53px)", border: "none", display: "block" }}
        />
      ) : (
        <Suspense fallback={null}>
          <CatalogoDropshipperCategorias />
        </Suspense>
      )}
    </div>
  );
}

// ─── Sidebar de categorías — patrón universal de marketplace (Amazon,
// MercadoLibre, AliExpress): árbol siempre visible en columna izquierda,
// solo la rama activa se expande, el resto queda colapsado como lista corta.
// Cada nivel es clicable y muestra el agregado de productos de su subárbol —
// nunca un callejón sin salida, la grilla de la derecha siempre tiene algo. ─
function CategorySidebar({ categoryId, onSelect }: { categoryId: string | null; onSelect: (id: string | null) => void }) {
  const activePath = categoryId ? pathToNode(categoryId) ?? [] : [];
  const activePathIds = new Set(activePath.map((n) => n.id));

  return (
    <aside style={{ width: 232, flexShrink: 0, position: "sticky", top: 16, alignSelf: "flex-start" }}>
      <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 14, color: C.textHeader, marginBottom: 8, padding: "0 8px" }}>Categorías</p>
      <SidebarRow label="Todas las categorías" count={PRODUCTS.length} active={!categoryId} bold={!categoryId} depth={0} onClick={() => onSelect(null)} />
      {CATEGORY_TREE.map((n) => (
        <SidebarBranch key={n.id} node={n} depth={0} categoryId={categoryId} activePathIds={activePathIds} onSelect={onSelect} />
      ))}
    </aside>
  );
}
function SidebarBranch({
  node, depth, categoryId, activePathIds, onSelect,
}: { node: CategoryNode; depth: number; categoryId: string | null; activePathIds: Set<string>; onSelect: (id: string) => void }) {
  const isActive = categoryId === node.id;
  const isOnPath = activePathIds.has(node.id);
  const showChildren = isOnPath && !!node.children?.length;
  return (
    <div>
      <SidebarRow label={node.name} count={countProductsIn(node)} active={isActive} bold={isOnPath} depth={depth} onClick={() => onSelect(node.id)} />
      {showChildren && node.children!.map((c) => (
        <SidebarBranch key={c.id} node={c} depth={depth + 1} categoryId={categoryId} activePathIds={activePathIds} onSelect={onSelect} />
      ))}
    </div>
  );
}
function SidebarRow({
  label, count, active, bold, depth, onClick,
}: { label: string; count: number; active: boolean; bold: boolean; depth: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer", height: 32,
        padding: `0 8px 0 ${8 + depth * 14}px`, borderRadius: RADIUS.sm,
        background: active ? C.infoBg : "transparent",
      }}
    >
      <span style={{
        fontFamily: FONT_UI, fontSize: depth === 0 ? 13 : 12.5, color: active ? C.info : bold ? C.textHeader : C.textMuted,
        fontWeight: active || bold ? 600 : 400, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{count}</span>
    </div>
  );
}

function FakeSelect({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div style={{ flex: "1 1 140px", minWidth: 140 }}>
      <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>{label}</p>
      <div style={{
        border: `1px solid ${C.border}`, borderRadius: RADIUS.sm, height: 38, background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px",
      }}>
        <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>{placeholder}</span>
        <span style={{ color: C.textMuted, display: "flex" }}><IconChevronDown /></span>
      </div>
    </div>
  );
}

function CatalogoDropshipperCategorias() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat");

  const [categoryId, setCategoryId] = useState<string | null>(initialCat);
  const [search, setSearch] = useState("");
  const [bannerOpen, setBannerOpen] = useState(true);

  const selectedNode = categoryId ? findNode(categoryId) : null;
  const breadcrumbTrail = categoryId ? pathToNode(categoryId) ?? [] : [];

  const visible = useMemo(() => {
    let list = PRODUCTS;
    if (selectedNode) {
      const allowed = new Set(descendantIds(selectedNode));
      list = list.filter((p) => allowed.has(p.categoryLeafId));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [selectedNode, search]);

  const selectCategory = (id: string | null) => {
    setCategoryId(id);
    router.replace(id ? `/proyectos/categorizacion/prototipo?cat=${id}` : "/proyectos/categorizacion/prototipo", { scroll: false });
  };

  const openDetail = (id: string) => {
    window.open(`/proyectos/categorizacion/prototipo/producto/${id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <AppShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, flexWrap: "wrap" }}>
        <span>🏠</span><span>›</span>
        <span onClick={() => selectCategory(null)} style={{ cursor: "pointer" }}>Productos</span>
        {breadcrumbTrail.map((n, i) => (
          <span key={n.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>›</span>
            <span
              onClick={() => selectCategory(n.id)}
              style={{ cursor: "pointer", color: i === breadcrumbTrail.length - 1 ? C.textHeader : C.textMuted, fontWeight: i === breadcrumbTrail.length - 1 ? 600 : 400 }}
            >
              {n.name}
            </span>
          </span>
        ))}
      </div>

      {/* Banner IA — mismo asset del mock real */}
      {bannerOpen && (
        <div style={{ position: "relative", borderRadius: RADIUS.md, overflow: "hidden", marginBottom: 24 }}>
          <img src={BANNER_IMG} alt="La IA de dropi lo encuentra" style={{ width: "100%", height: "auto", display: "block" }} />
          <button
            onClick={() => setBannerOpen(false)}
            style={{
              position: "absolute", top: 12, right: 14, width: 24, height: 24, borderRadius: RADIUS.pill,
              background: "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          ><IconClose /></button>
        </div>
      )}

      {/* Proveedores */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 18, color: C.textHeader }}>Proveedores</span>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 500, color: C.info, cursor: "pointer" }}>Ver todos</span>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
          {SUPPLIERS.map((s) => (
            <div key={s.name} style={{
              border: `1px solid ${C.border}`, borderRadius: RADIUS.md, padding: 12, display: "flex", gap: 12,
              alignItems: "center", minWidth: 280, flex: 1,
            }}>
              <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
                <img src={s.logo} alt={s.name} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
                {s.verified && (
                  <span style={{
                    position: "absolute", top: -2, right: -2, width: 18, height: 18, borderRadius: "50%",
                    background: C.success, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "2px solid #fff",
                  }}><IconCheck /></span>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 15, color: C.textHeader, marginBottom: 2 }}>{s.name}</p>
                <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader, marginBottom: 2 }}>545 productos</p>
                <p style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Moda, Deporte, Hogar, Salud, Belleza...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 22, color: C.textHeader, marginBottom: 14 }}>Catálogo de productos</h2>

      {/* Toggles + búsqueda */}
      <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.textMuted, display: "flex" }}><IconHeart /></span>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>Favoritos</span>
          <RealSwitch />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.textMuted, display: "flex" }}><IconLock /></span>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>Privados</span>
          <RealSwitch />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.textMuted, display: "flex" }}><IconCart /></span>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>Con órdenes</span>
          <RealSwitch />
        </div>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <Input value={search} onChange={setSearch} placeholder="Buscar por nombre..." />
        </div>
        <GhostButton><IconCamera />Buscar por imagen</GhostButton>
      </div>

      {/* Fila de filtros — mismos campos del catálogo real; "Categorías" ahora vive en el sidebar */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap" }}>
        <FakeSelect label="Tipo de proveedor" placeholder="Proveedor" />
        <FakeSelect label="Stock" placeholder="Cantidad" />
        <FakeSelect label="Ciudad" placeholder="Ciudad" />
        <PrimaryButton>Aplicar filtros</PrimaryButton>
      </div>

      {/* Cuerpo: sidebar de categorías (patrón universal) + grilla de productos */}
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        <CategorySidebar categoryId={categoryId} onSelect={selectCategory} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>
              <strong>{visible.length}</strong> producto{visible.length === 1 ? "" : "s"} {selectedNode && <>en <strong>{selectedNode.name}</strong></>} · clic en una tarjeta abre el detalle en pestaña nueva
            </p>
          </div>

          {visible.length === 0 ? (
            <div style={{ border: `1px dashed ${C.border}`, borderRadius: RADIUS.md, padding: 40, textAlign: "center" }}>
              <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.textMuted }}>No hay productos en esta categoría con ese filtro.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => openDetail(p.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ProductCard({ product: p, onClick }: { product: Product; onClick: () => void }) {
  const names = categoryNamesFor(p);
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left", cursor: "pointer", background: "#fff", padding: 4,
        border: `1px solid ${C.border}`, borderRadius: RADIUS.md, overflow: "hidden",
        boxShadow: hover ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div style={{ position: "relative", height: 200, borderRadius: RADIUS.md, overflow: "hidden" }}>
        <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", background: C.bgGray }} />
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", bottom: 5, right: 6, width: 36, height: 36, borderRadius: RADIUS.sm,
            background: "#fff", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
            color: C.textHeader, cursor: "pointer",
          }}
        ><IconHeart /></button>
      </div>

      <div style={{ padding: "12px 8px 8px" }}>
        {/* Categoría por tipografía/layout, no por color — DESIGN.md */}
        <p style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 500, color: C.textMuted, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {names.slice(0, 2).join(" › ")}
        </p>
        <p style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 15, color: C.textHeader, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</p>
        <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
          Proveedor: {p.supplier} · Stock: <strong style={{ color: p.stock > 0 ? C.success : C.danger, fontWeight: 500 }}>{p.stock}</strong>
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <div>
            <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 2 }}>Precio proveedor</p>
            <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.textHeader }}>{money(p.providerPrice)}</p>
          </div>
          <div>
            <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 2 }}>Precio sugerido</p>
            <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.textHeader }}>{money(p.suggestedPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
