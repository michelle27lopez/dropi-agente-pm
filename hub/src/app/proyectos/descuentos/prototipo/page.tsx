"use client";

import { useEffect, useState } from "react";
import {
  C, FONT_UI, FONT_HEAD, PRODUCTS, Product, Discount, DiscountType, DEFAULT_DISCOUNTS,
  loadStoredDiscounts, saveStoredDiscounts, money, computeFinalPrice, isLive,
  endedByVolume, endedByDate, emptyDiscount, ProductImg, CrearOrdenModal,
  AppShell, ProductosSidebar, Input, Label, RealSwitch, PrimaryButton, GhostButton,
  IconExport, IconPencil, IconCart, IconHeart,
  IconLock, IconStar, BANNER_IMG, SUPPLIER_LOGOS,
} from "./shared";

// ═══════════════════════════════════════════════════════════════════════════
export default function DescuentosPrototipoPage() {
  const [tab, setTab] = useState<"proveedor" | "dropshipper">("proveedor");
  const [step, setStep] = useState<"list" | "edit">("list");
  const [selectedId, setSelectedId] = useState("p1");
  const [discounts, setDiscounts] = useState<Record<string, Discount>>(DEFAULT_DISCOUNTS);
  const [savedFlash, setSavedFlash] = useState(false);

  // Cargar estado guardado (si el proveedor ya lo configuró en otra pestaña)
  useEffect(() => {
    setDiscounts(loadStoredDiscounts());
  }, []);
  // Persistir para que la pestaña de detalle del dropshipper lo vea
  useEffect(() => {
    saveStoredDiscounts(discounts);
  }, [discounts]);

  const updateDiscount = (id: string, patch: Partial<Discount>) =>
    setDiscounts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  return (
    <div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.borderLight}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <a href="/proyectos/descuentos" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", fontFamily: "-apple-system, sans-serif" }}>← Descuentos en Catálogo</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>Prototipo · réplica visual del producto real</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, background: "#F3F4F6", padding: 4, borderRadius: 10 }}>
          {[{ k: "proveedor", l: "🏭 Vista Proveedor" }, { k: "dropshipper", l: "🛒 Vista Dropshipper" }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as "proveedor" | "dropshipper")} style={{
              border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 7,
              background: tab === t.k ? "#fff" : "transparent", boxShadow: tab === t.k ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              fontSize: 12.5, fontWeight: 700, color: tab === t.k ? "var(--fg)" : "var(--muted)", fontFamily: "-apple-system, sans-serif",
            }}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {tab === "proveedor" ? (
        <AppShell activeIcon="search" sidebar={<ProductosSidebar variant="proveedor" />}>
          {step === "list" ? (
            <MisProductosTable
              discounts={discounts}
              onEdit={(id) => { setSelectedId(id); setStep("edit"); }}
            />
          ) : (
            <EditarProducto
              product={PRODUCTS.find((p) => p.id === selectedId)!}
              discount={discounts[selectedId]}
              onBack={() => setStep("list")}
              onSave={(draft) => {
                updateDiscount(selectedId, draft);
                setSavedFlash(true);
                setTimeout(() => setSavedFlash(false), 1800);
              }}
              saved={savedFlash}
            />
          )}
        </AppShell>
      ) : (
        <AppShell activeIcon="search" sidebar={<ProductosSidebar variant="dropshipper" />}>
          <CatalogoDropshipper discounts={discounts} />
        </AppShell>
      )}
    </div>
  );
}

function FilterCheckbox({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        border: checked ? "none" : `1.5px solid ${C.border}`, background: checked ? C.orange : "#fff",
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24"><path d="m4 12 5 5L20 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </span>
      <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>{label}</span>
    </button>
  );
}

// ─── VISTA PROVEEDOR · paso 1: tabla real "Mis productos" ─────────────────────
function MisProductosTable({ discounts, onEdit }: { discounts: Record<string, Discount>; onEdit: (id: string) => void }) {
  const [privados, setPrivados] = useState(true);
  const [noAprobados, setNoAprobados] = useState(true);
  const [aprobados, setAprobados] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  const th: React.CSSProperties = { textAlign: "left", fontFamily: FONT_UI, fontWeight: 600, fontSize: 13, color: C.gray700, padding: "12px 10px", borderBottom: `1px solid ${C.borderLight}` };
  const td: React.CSSProperties = { padding: "14px 10px", borderBottom: `1px solid ${C.borderLight}`, fontFamily: FONT_UI, fontSize: 13.5, color: C.textHeader, verticalAlign: "middle" };

  const rows = onlyDiscount ? PRODUCTS.filter((p) => isLive(discounts[p.id])) : PRODUCTS;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 24, color: C.gray700 }}>Mis productos</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <GhostButton><IconExport />Exportar</GhostButton>
          <PrimaryButton color={C.orange}>+ Agregar</PrimaryButton>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
        <FilterCheckbox label="Privados y no privados" checked={privados} onToggle={() => setPrivados((v) => !v)} />
        <FilterCheckbox label="No aprobados" checked={noAprobados} onToggle={() => setNoAprobados((v) => !v)} />
        <FilterCheckbox label="Aprobados y no aprobados" checked={aprobados} onToggle={() => setAprobados((v) => !v)} />
        <FilterCheckbox label="Con descuento activo" checked={onlyDiscount} onToggle={() => setOnlyDiscount((v) => !v)} />
      </div>

      <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${C.borderLight}`, marginBottom: 16 }}>
        {["Activos", "Archivados"].map((t, i) => (
          <div key={t} style={{
            fontFamily: FONT_UI, fontSize: 14, fontWeight: 600, color: i === 0 ? C.orange : C.textMuted,
            paddingBottom: 10, borderBottom: i === 0 ? `2px solid ${C.orange}` : "none",
          }}>{t}</div>
        ))}
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.borderLight}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}></th>
              <th style={th}>ID</th>
              <th style={th}>Nombre</th>
              <th style={th}>Tipo</th>
              <th style={th}>Existencia</th>
              <th style={th}>Precio</th>
              <th style={th}>Precio sugerido</th>
              <th style={th}>Descuento</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ ...td, textAlign: "center", color: C.textMuted, padding: "32px 10px" }}>
                  Ningún producto tiene un descuento activo en este momento.
                </td>
              </tr>
            ) : rows.map((p) => {
              const d = discounts[p.id];
              const live = isLive(d);
              return (
                <tr key={p.id}>
                  <td style={{ ...td, width: 60 }}>
                    <ProductImg product={p} size={40} radius={6} />
                  </td>
                  <td style={td}>{p.sku}</td>
                  <td style={{ ...td, fontWeight: 600, color: C.gray700 }}>{p.name}</td>
                  <td style={td}>{p.typeBadge === "Combo" ? "COMBO" : "SIMPLE"}</td>
                  <td style={td}>{p.stock}</td>
                  <td style={td}>{live ? (
                    <span>
                      <span style={{ textDecoration: "line-through", color: C.textDisabled, marginRight: 6, fontSize: 12 }}>{money(p.providerPrice)}</span>
                      <span style={{ color: C.success, fontWeight: 700 }}>{money(computeFinalPrice(p.providerPrice, d))}</span>
                    </span>
                  ) : money(p.providerPrice)}</td>
                  <td style={td}>{money(p.suggestedPrice)}</td>
                  <td style={td}>
                    {d.active ? (
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
                        background: live ? C.successBg : C.dangerBg, color: live ? C.success : C.danger,
                      }}>
                        {live ? "Activo" : "Finalizado"}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: C.textDisabled }}>—</span>
                    )}
                  </td>
                  <td style={td}>
                    <button onClick={() => onEdit(p.id)} title="Editar producto" style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4 }}>
                      <IconPencil />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 10, fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Haz clic en ✎ para entrar a editar el producto y activar/ajustar su descuento.</p>
    </div>
  );
}

// ─── VISTA PROVEEDOR · paso 2: "Editar producto" con pestaña Descuento ───────
function EditarProducto({
  product, discount, onBack, onSave, saved,
}: {
  product: Product; discount: Discount;
  onBack: () => void; onSave: (draft: Discount) => void; saved: boolean;
}) {
  const [draft, setDraft] = useState<Discount>(discount);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(discount);

  const finalPrice = computeFinalPrice(product.providerPrice, draft);
  const savings = product.providerPrice - finalPrice;
  const isEnded = endedByVolume(draft) || endedByDate(draft);
  const noEndCondition = draft.active && !draft.endDate && !draft.endVolume;

  const tabs = ["General", "Existencias", "Imagen del producto", "Recursos adicionales", "Productos privados", "Garantías"];

  const handleBack = () => {
    if (isDirty) setShowUnsavedModal(true);
    else onBack();
  };

  return (
    <div>
      {showUnsavedModal && (
        <UnsavedChangesModal onCancel={() => setShowUnsavedModal(false)} onDiscard={onBack} />
      )}
      <button onClick={handleBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontFamily: FONT_UI, fontSize: 13, marginBottom: 12, padding: 0 }}>
        ← Volver a Mis productos
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <ProductImg product={product} size={52} radius={8} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{product.supplier} · SKU {product.sku}</div>
          <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: C.gray700 }}>Editar producto — {product.name}</h1>
        </div>
        <PrimaryButton onClick={() => onSave(draft)} disabled={!isDirty}>💾 {saved && !isDirty ? "Guardado" : "Guardar"}</PrimaryButton>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {/* Tabs izquierda */}
        <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {tabs.map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", height: 38, padding: "0 8px", borderRadius: 4, color: C.textHeader, fontFamily: FONT_UI, fontSize: 14 }}>
              {t}
            </div>
          ))}
          <div style={{
            display: "flex", alignItems: "center", height: 38, padding: "0 8px",
            borderRadius: 4, background: C.blue, color: "#fff", fontFamily: FONT_UI, fontSize: 14, fontWeight: 600,
          }}>
            Descuento
          </div>
        </div>

        {/* Contenido pestaña Descuento */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 15, color: C.gray700 }}>Descuento en catálogo</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 600, color: !draft.active ? C.textMuted : isEnded ? C.textMuted : C.orange }}>
                {!draft.active ? "Inactivo" : isEnded ? "Finalizado" : "Activo"}
              </span>
              <RealSwitch on={draft.active} onToggle={() => setDraft((prev) => ({ ...prev, active: !prev.active }))} />
            </div>
          </div>

          {!draft.active ? (
            <div style={{ padding: "36px 20px", textAlign: "center", background: C.bgGray, borderRadius: 8, border: `1px dashed ${C.border}` }}>
              <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>Este producto no tiene descuento activo. Actívalo con el switch de arriba.</p>
            </div>
          ) : (
            <>
              {isEnded && (
                <div style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontFamily: FONT_UI, fontSize: 13, color: "#8C2F3D" }}>
                  ⏹ Este descuento ya finalizó automáticamente — {endedByVolume(draft) ? "se alcanzó el límite de unidades" : "se venció la fecha límite"}. El proveedor puede editar las condiciones y reactivarlo con el switch de arriba.
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <Label>Tipo de descuento</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["percent", "fixed"] as DiscountType[]).map((t) => (
                      <button key={t} onClick={() => setDraft((prev) => ({ ...prev, type: t, value: t === "percent" ? Math.min(prev.value, 100) : Math.min(prev.value, product.providerPrice) }))} style={{
                        flex: 1, height: 38, borderRadius: 4, cursor: "pointer", fontFamily: FONT_UI, fontSize: 13, fontWeight: 600,
                        border: draft.type === t ? `1.5px solid ${C.blue}` : `1px solid ${C.border}`,
                        background: draft.type === t ? C.infoBg : "#fff", color: draft.type === t ? C.blue : C.textHeader,
                      }}>
                        {t === "percent" ? "% Porcentaje" : "$ Valor fijo"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{draft.type === "percent" ? "Porcentaje de descuento" : "Valor a descontar (COP)"}</Label>
                  <Input
                    value={draft.value}
                    onChange={(v) => {
                      const max = draft.type === "percent" ? 100 : product.providerPrice;
                      const clamped = Math.min(Math.max(Number(v) || 0, 0), max);
                      setDraft((prev) => ({ ...prev, value: clamped }));
                    }}
                    placeholder={draft.type === "percent" ? "ej. 25" : "ej. 8000"}
                    type="number"
                  />
                  <p style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                    {draft.type === "percent" ? "Máximo 100%." : `Máximo ${money(product.providerPrice)} (el precio del producto).`}
                  </p>
                </div>
              </div>

              <Label>Condiciones de finalización automática <span style={{ fontWeight: 400, color: C.textMuted }}>(gana la primera que se cumpla)</span></Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 8 }}>
                <div><p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Fecha fin</p><Input type="date" value={draft.endDate} onChange={(v) => setDraft((prev) => ({ ...prev, endDate: v }))} /></div>
                <div>
                  <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Límite de unidades</p>
                  <Input type="number" value={draft.endVolume} onChange={(v) => setDraft((prev) => ({ ...prev, endVolume: v }))} placeholder="ej. 50" />
                  {!!draft.endVolume && Number(draft.endVolume) > 0 && (() => {
                    const limit = Number(draft.endVolume);
                    const pct = Math.min(100, (draft.soldUnits / limit) * 100);
                    const barColor = pct >= 100 ? C.textMuted : pct >= 70 ? C.warning : C.info;
                    return (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 6, borderRadius: 999, background: C.bgGray, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999 }} />
                        </div>
                        <p style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                          {draft.soldUnits} / {limit} unidades vendidas
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {noEndCondition && (
                <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.info, marginBottom: 20 }}>
                  ℹ️ Sin fecha ni límite de unidades — este descuento permanecerá activo hasta que lo desactives manualmente.
                </p>
              )}

              <div style={{ background: C.infoBg, border: `1px solid ${C.infoBorder}`, borderRadius: 8, padding: "12px 16px", marginTop: noEndCondition ? 0 : 16, marginBottom: 24 }}>
                <p style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 600, color: C.textHeader, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Así lo verá el dropshipper</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textDisabled, textDecoration: "line-through" }}>{money(product.providerPrice)}</span>
                  <span style={{ fontFamily: FONT_UI, fontSize: 22, fontWeight: 700, color: isEnded ? C.gray700 : C.success }}>{money(isEnded ? product.providerPrice : finalPrice)}</span>
                  {!isEnded && (
                    <span style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 700, background: C.dangerBg, color: C.danger, padding: "2px 8px", borderRadius: 999 }}>
                      -{draft.type === "percent" ? `${draft.value}%` : money(savings)}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UnsavedChangesModal({ onCancel, onDiscard }: { onCancel: () => void; onDiscard: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,18,25,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 24, width: 360, boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }}>
        <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 16, color: C.gray700, marginBottom: 8 }}>Cambios sin guardar</h3>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.5 }}>
          Editaste el descuento de este producto pero no le diste clic a &quot;Guardar&quot;. Si sales ahora, se pierden los cambios.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <GhostButton onClick={onCancel}>Seguir editando</GhostButton>
          <PrimaryButton color={C.danger} onClick={onDiscard}>Salir sin guardar</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─── VISTA DROPSHIPPER · Catálogo de productos (con precio antes/ahora) ──────
function CatalogoDropshipper({ discounts }: { discounts: Record<string, Discount> }) {
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [orderProductId, setOrderProductId] = useState<string | null>(null);

  const withStatus = PRODUCTS.map((p) => ({ product: p, discount: discounts[p.id] ?? emptyDiscount, live: isLive(discounts[p.id] ?? emptyDiscount) }));
  const visible = onlyDiscount ? withStatus.filter((x) => x.live) : withStatus;
  const orderTarget = orderProductId ? withStatus.find((x) => x.product.id === orderProductId) : null;

  const openDetail = (id: string) => {
    window.open(`/proyectos/descuentos/prototipo/producto/${id}`, "_blank", "noopener,noreferrer");
  };

  const TIER_BG: Record<string, string> = {
    Exclusivo: "linear-gradient(90deg, #0E111A, #FF6102)",
    Premium: "linear-gradient(90deg, #FFC10D, #FF6102)",
    Verificado: "#FFC10D",
  };
  const TYPE_BG: Record<string, string> = { Variable: "#F49A3D", Combo: "#50A5F1" };
  const SUPPLIERS = [
    { name: "Suppli", logo: SUPPLIER_LOGOS.suppli, insignia: false },
    { name: "ADMA", logo: SUPPLIER_LOGOS.adma, insignia: true },
    { name: "Shopi Pauta", logo: SUPPLIER_LOGOS.shopipauta, insignia: true },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>
        <span>🏠</span><span>›</span><span>Productos</span><span>›</span><span>Catálogo</span><span>›</span><span style={{ color: C.gray700 }}>Productos</span>
      </div>

      {/* Banner IA — misma imagen del mock real */}
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
        <img src={BANNER_IMG} alt="La IA de dropi lo encuentra" style={{ width: "100%", height: "auto", display: "block" }} />
        <button style={{
          position: "absolute", top: 12, right: 14, width: 24, height: 24, borderRadius: "50%",
          background: "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        }}>✕</button>
      </div>

      {/* Proveedores */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, color: C.gray700 }}>Proveedores</span>
          <span style={{ fontFamily: FONT_UI, fontSize: 14, fontWeight: 500, color: C.info, cursor: "pointer" }}>Ver todos</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 16, flex: 1, overflowX: "auto" }}>
            {SUPPLIERS.map((s) => (
              <div key={s.name} style={{
                border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 12, display: "flex", gap: 12,
                alignItems: "center", minWidth: 290, flex: 1, height: 94, boxSizing: "border-box",
              }}>
                <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
                  <img src={s.logo} alt={s.name} style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover" }} />
                  {s.insignia && (
                    <span style={{
                      position: "absolute", top: -4, right: -4, width: 22, height: 22, borderRadius: "50%",
                      background: "#FFC10D", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                    }}><IconStar /></span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, color: C.gray700, marginBottom: 2 }}>{s.name}</p>
                  <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.gray700, marginBottom: 2 }}>545 productos</p>
                  <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Moda, Deporte, Hogar, Salud, Belleza, Tecnol...</p>
                </div>
              </div>
            ))}
          </div>
          <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted, flexShrink: 0 }}>›</span>
        </div>
      </div>

      <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: C.gray700, marginBottom: 14 }}>Catálogo de productos</h2>

      {/* Toggles + búsqueda */}
      <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>❤️ Favoritos</span>
          <RealSwitch on={false} onToggle={() => {}} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>🔒 Privados</span>
          <RealSwitch on={false} onToggle={() => {}} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>🛒 Con ordenes</span>
          <RealSwitch on={false} onToggle={() => {}} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.orangeLight, padding: "6px 12px", borderRadius: 999 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.orange, fontWeight: 700 }}>🏷️ Con descuento</span>
          <RealSwitch on={onlyDiscount} onToggle={() => setOnlyDiscount((v) => !v)} />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}><Input value="" onChange={() => {}} placeholder="Buscar" /></div>
        <GhostButton>📷 Buscar por imagen</GhostButton>
      </div>

      {/* Fila de filtros dropdown (decorativa) */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ minWidth: 180 }}>
          <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Tipo de proveedor</p>
          <Input value="Proveedor ⌄" onChange={() => {}} />
        </div>
        <div style={{ minWidth: 200 }}>
          <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Rango de precio proveedor</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Input value="0" onChange={() => {}} /><span style={{ color: C.textMuted }}>—</span><Input value="0" onChange={() => {}} />
          </div>
        </div>
        <div style={{ minWidth: 150 }}><p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Stock</p><Input value="Cantidad ⌄" onChange={() => {}} /></div>
        <div style={{ minWidth: 150 }}><p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Categorías</p><Input value="Categorías ⌄" onChange={() => {}} /></div>
        <div style={{ minWidth: 150 }}><p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textHeader, marginBottom: 6 }}>Ciudad</p><Input value="Ciudad ⌄" onChange={() => {}} /></div>
        <PrimaryButton color={C.orange}>⚙ Aplicar filtros</PrimaryButton>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>
          <strong>{visible.length}</strong> productos {onlyDiscount && "con descuento"} · clic en una tarjeta abre el detalle en pestaña nueva
        </p>
        <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textHeader }}>Ordenar por: <strong>Aleatorio</strong> ⌄</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(216px, 1fr))", gap: 18 }}>
        {visible.map(({ product: p, discount: d, live }) => (
          <div key={p.id} onClick={() => openDetail(p.id)} style={{
            textAlign: "left", cursor: "pointer", background: "#fff", padding: 4,
            border: `1px solid ${C.borderLight}`, borderRadius: 12, overflow: "hidden",
          }}>
            {/* Imagen + badges */}
            <div style={{ position: "relative", height: 214, borderRadius: 12, overflow: "hidden" }}>
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", background: C.bgGray }}
              />
              {(p.typeBadge || p.private) && (
                <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 6, alignItems: "center" }}>
                  {p.typeBadge && (
                    <span style={{
                      fontFamily: FONT_UI, fontSize: 12, fontWeight: 500, color: "#fff", padding: "4px 8px", borderRadius: 999,
                      background: TYPE_BG[p.typeBadge],
                    }}>{p.typeBadge}</span>
                  )}
                  {p.private && (
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <IconLock />
                    </span>
                  )}
                </div>
              )}
              {live && (
                <span style={{
                  position: "absolute", top: 8, right: 52, fontFamily: FONT_UI, fontSize: 10, fontWeight: 800, color: "#fff",
                  background: C.danger, padding: "3px 8px", borderRadius: 999,
                }}>
                  {d.type === "percent" ? `-${d.value}%` : `-${money(d.value)}`}
                </span>
              )}
              <button
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute", bottom: 5, right: 6, width: 40, height: 40, borderRadius: 12,
                  background: "#fff", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.textHeader, cursor: "pointer",
                }}
              ><IconHeart /></button>
              {p.tier && (
                <span style={{
                  position: "absolute", bottom: -9, left: 2, display: "flex", alignItems: "center", gap: 4,
                  fontFamily: FONT_UI, fontSize: 10, fontWeight: 700, color: "#fff", background: TIER_BG[p.tier], padding: "3px 10px 3px 8px", borderRadius: 999,
                }}>
                  <IconStar />{p.tier}
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: "12px 8px 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>{p.category}</span>
                <span style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>Stock: <strong style={{ color: p.stock > 0 ? "#0ABB87" : C.danger, fontWeight: 500 }}>{p.stock}</strong></span>
              </div>
              <p style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 16, color: C.gray700, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</p>
              <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
                Proveedor: <span style={{ color: C.info }}>{p.supplier}</span>
              </p>
              <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                <div>
                  <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 2 }}>Precio proveedor</p>
                  {live ? (
                    <>
                      <p style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textDisabled, textDecoration: "line-through" }}>{money(p.providerPrice)}</p>
                      <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.success }}>{money(computeFinalPrice(p.providerPrice, d))}</p>
                    </>
                  ) : (
                    <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.gray700 }}>{money(p.providerPrice)}</p>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 2 }}>Precio sugerido</p>
                  <p style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 14, color: C.gray700 }}>{money(p.suggestedPrice)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setOrderProductId(p.id); }}
              style={{
                width: "100%", height: 40, border: "none", borderTop: `1px solid ${C.borderLight}`, background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                fontFamily: FONT_UI, fontSize: 14, fontWeight: 700, color: C.orange,
              }}
            >
              <IconCart />Enviar a cliente
            </button>
          </div>
        ))}
      </div>

      {orderTarget && (
        <CrearOrdenModal
          product={orderTarget.product}
          discount={orderTarget.discount}
          onClose={() => setOrderProductId(null)}
        />
      )}
    </div>
  );
}
