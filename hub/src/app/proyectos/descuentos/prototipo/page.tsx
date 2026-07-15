"use client";

import { useEffect, useState } from "react";
import {
  C, FONT_UI, FONT_HEAD, PRODUCTS, Product, Discount, DiscountType, DEFAULT_DISCOUNTS,
  loadStoredDiscounts, saveStoredDiscounts, money, computeFinalPrice, isLive, referencePrice,
  endedByVolume, endedByDate, notStartedYet, emptyDiscount, ProductImg, CrearOrdenModal,
  AppShell, ProductosSidebar, Input, Label, RealSwitch, PrimaryButton, GhostButton,
  IconExport, IconPencil,
  IconStar, BANNER_IMG, SUPPLIER_LOGOS,
  StepKey, Stepper, GeneralSection, ProductCard, Alert, RadioDot, MIN_DISCOUNT_PERCENT, MAX_DISCOUNT_PERCENT,
} from "./shared";

const BLANK_PRODUCT: Product = {
  id: "draft", sku: "", name: "Nuevo producto", image: PRODUCTS[0].image,
  providerPrice: 0, suggestedPrice: 0, supplier: "Mi tienda", category: "", stock: 0, city: "",
};

// ═══════════════════════════════════════════════════════════════════════════
export default function DescuentosPrototipoPage() {
  const [tab, setTab] = useState<"proveedor" | "dropshipper">("proveedor");
  const [step, setStep] = useState<"list" | "edit" | "create">("list");
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
              onCreate={() => setStep("create")}
            />
          ) : step === "create" ? (
            <EditarProducto
              product={BLANK_PRODUCT}
              discount={emptyDiscount}
              mode="create"
              onBack={() => setStep("list")}
              onSave={() => {}}
              saved={false}
            />
          ) : (
            <EditarProducto
              product={PRODUCTS.find((p) => p.id === selectedId)!}
              discount={discounts[selectedId]}
              mode="edit"
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
function MisProductosTable({ discounts, onEdit, onCreate }: { discounts: Record<string, Discount>; onEdit: (id: string) => void; onCreate: () => void }) {
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
          <PrimaryButton color={C.orange} onClick={onCreate}>+ Agregar</PrimaryButton>
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
                      <span style={{ textDecoration: "line-through", color: C.textDisabled, marginRight: 6, fontSize: 12 }}>{money(referencePrice(p))}</span>
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

// ─── VISTA PROVEEDOR · paso 2: "Crear/Editar producto" (Steps + General + Descuento) ─
function EditarProducto({
  product, discount, mode, onBack, onSave, saved,
}: {
  product: Product; discount: Discount; mode: "create" | "edit";
  onBack: () => void; onSave: (draft: Discount) => void; saved: boolean;
}) {
  const [draft, setDraft] = useState<Discount>(discount);
  const [valueInput, setValueInput] = useState(String(discount.value));
  const [activeStep, setActiveStep] = useState<StepKey>("general");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const isDirty = mode === "edit" && JSON.stringify(draft) !== JSON.stringify(discount);

  const isEnded = endedByVolume(draft) || endedByDate(draft);
  const isScheduled = !isEnded && notStartedYet(draft);
  const noEndCondition = draft.active && !draft.endDate && !draft.endVolume;
  const ref = referencePrice(product);
  const hasInflatedPrice = ref < product.providerPrice;
  // El % real que verá el dropshipper se calcula contra el precio de referencia
  // (el más bajo de los últimos 30 días), no contra el precio actual — así el
  // piso/techo de política no se puede esquivar subiendo el precio antes.
  const effectivePercent = ref > 0 ? ((ref - computeFinalPrice(product.providerPrice, draft)) / ref) * 100 : 0;
  const isBelowMin = draft.active && draft.value > 0 && effectivePercent < MIN_DISCOUNT_PERCENT;

  const maxForType = (type: DiscountType) =>
    type === "percent" ? MAX_DISCOUNT_PERCENT : Math.round(product.providerPrice * (MAX_DISCOUNT_PERCENT / 100));
  const fechaLarga = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const resumenVigencia = () => {
    const parts: string[] = [];
    if (draft.startDate) parts.push(`desde el ${fechaLarga(draft.startDate)}`);
    if (draft.endDate) parts.push(`hasta el ${fechaLarga(draft.endDate)}`);
    if (draft.endVolume && Number(draft.endVolume) > 0) parts.push(`o hasta agotar ${draft.endVolume} unidades`);
    if (parts.length === 0) return null;
    return `Activo ${parts.join(" ")}${parts.length > 1 ? " — lo que ocurra primero" : ""}.`;
  };

  const handleBack = () => {
    if (isDirty) setShowUnsavedModal(true);
    else onBack();
  };
  const handleGuardar = () => {
    if (mode === "create") { onBack(); return; }
    onSave(draft);
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
        {mode === "edit" && <ProductImg product={product} size={52} radius={8} />}
        <div style={{ flex: 1 }}>
          {mode === "edit" && (
            <div style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 4 }}>{product.supplier} · SKU {product.sku}</div>
          )}
          <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: C.gray700 }}>
            {mode === "create" ? "Crear producto" : `Editar producto — ${product.name}`}
          </h1>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        <Stepper active={activeStep} onSelect={setActiveStep} />

        <div style={{
          flex: 1, minWidth: 0, maxWidth: activeStep === "descuentos" && mode === "edit" ? 900 : 640,
          display: "flex", flexDirection: "column", gap: 24,
        }}>
          {activeStep === "general" && (
            <GeneralSection product={product} mode={mode} onGoToDiscount={() => setActiveStep("descuentos")} />
          )}

          {activeStep === "descuentos" && mode === "create" && (
            <div style={{ padding: "36px 20px", textAlign: "center", background: C.bgGray, borderRadius: 8, border: `1px dashed ${C.border}` }}>
              <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>Primero guarda el producto para poder configurar un descuento.</p>
            </div>
          )}

          {activeStep === "descuentos" && mode === "edit" && (
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 320 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 15, color: C.gray700 }}>Configura tu descuento</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 600, color: !draft.active ? C.textMuted : isEnded ? C.textMuted : isScheduled ? C.info : C.orange }}>
                      {!draft.active ? "Inactivo" : isEnded ? "Finalizado" : isScheduled ? "Programado" : "Activo"}
                    </span>
                    <RealSwitch on={draft.active} onToggle={() => setDraft((prev) => ({ ...prev, active: !prev.active }))} />
                  </div>
                </div>
                <ul style={{ margin: "0 0 20px", paddingLeft: 18, fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted, lineHeight: 1.7 }}>
                  <li>Aparece en la sección &quot;Con descuento&quot; del catálogo</li>
                  <li>Los dropshippers ven el precio tachado en la ficha del producto</li>
                </ul>

                {!draft.active ? (
                  <div style={{ padding: "36px 20px", textAlign: "center", background: C.bgGray, borderRadius: 8, border: `1px dashed ${C.border}` }}>
                    <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>Este producto no tiene descuento activo. Actívalo con el switch de arriba.</p>
                  </div>
                ) : (
                  <>
                    {isEnded && (
                      <div style={{ marginBottom: 20 }}>
                        <Alert variant="danger">
                          ⏹ Este descuento ya finalizó automáticamente — {endedByVolume(draft) ? "se alcanzó el límite de unidades" : "se venció la fecha límite"}. Puedes editar las condiciones y reactivarlo con el switch de arriba.
                        </Alert>
                      </div>
                    )}
                    {isScheduled && (
                      <div style={{ marginBottom: 20 }}>
                        <Alert>📅 Este descuento empieza el {fechaLarga(draft.startDate)} — no será visible en el catálogo hasta entonces.</Alert>
                      </div>
                    )}
                    {hasInflatedPrice && (
                      <div style={{ marginBottom: 20 }}>
                        <Alert>
                          🔒 Tu precio subió recientemente. Para evitar descuentos inflados, el dropshipper sigue viendo <strong>{money(ref)}</strong> como precio &quot;antes&quot; (el más bajo de los últimos 30 días) hasta que pasen 30 días desde el aumento.
                        </Alert>
                      </div>
                    )}

                    <div style={{ marginBottom: 20 }}>
                      <Label>Tipo de descuento</Label>
                      <div style={{ display: "flex", gap: 24 }}>
                        {(["percent", "fixed"] as DiscountType[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              const clamped = Math.min(draft.value, maxForType(t));
                              setDraft((prev) => ({ ...prev, type: t, value: clamped }));
                              setValueInput(String(clamped));
                            }}
                            className="dsc-focus-ring"
                            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <RadioDot selected={draft.type === t} />
                            <span style={{ fontFamily: FONT_UI, fontSize: 14, fontWeight: draft.type === t ? 600 : 400, color: draft.type === t ? C.gray700 : C.textHeader }}>
                              {t === "percent" ? "% Porcentaje" : "$ Valor fijo"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                      <div>
                        <Label>{draft.type === "percent" ? "Porcentaje de descuento" : "Valor a descontar (COP)"}</Label>
                        <Input
                          invalid={isBelowMin}
                          value={valueInput}
                          onChange={(v) => {
                            setValueInput(v);
                            if (v === "") { setDraft((prev) => ({ ...prev, value: 0 })); return; }
                            const num = Number(v);
                            if (isNaN(num)) return;
                            const clamped = Math.min(Math.max(num, 0), maxForType(draft.type));
                            setDraft((prev) => ({ ...prev, value: clamped }));
                          }}
                          onBlur={() => setValueInput(String(draft.value))}
                          placeholder={draft.type === "percent" ? "ej. 25" : "ej. 8000"}
                          type="number"
                        />
                        {isBelowMin ? (
                          <p style={{ fontFamily: FONT_UI, fontSize: 11, color: C.danger, marginTop: 4, fontWeight: 600 }}>
                            ⚠ Ofrece al menos un {MIN_DISCOUNT_PERCENT}% de descuento — por debajo de eso no cuenta como oferta real.
                          </p>
                        ) : (
                          <p style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                            {draft.type === "percent"
                              ? `Entre ${MIN_DISCOUNT_PERCENT}% y ${MAX_DISCOUNT_PERCENT}%.`
                              : `Entre ${money(Math.round(product.providerPrice * (MIN_DISCOUNT_PERCENT / 100)))} y ${money(Math.round(product.providerPrice * (MAX_DISCOUNT_PERCENT / 100)))} (equivalente a ${MIN_DISCOUNT_PERCENT}%–${MAX_DISCOUNT_PERCENT}% del precio).`}
                          </p>
                        )}
                      </div>
                    </div>

                    <Label>Vigencia y finalización automática <span style={{ fontWeight: 400, color: C.textMuted }}>(gana la primera condición que se cumpla)</span></Label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 8 }}>
                      <div><p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Fecha inicio</p><Input type="date" value={draft.startDate} onChange={(v) => setDraft((prev) => ({ ...prev, startDate: v }))} /></div>
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

                    {noEndCondition ? (
                      <div style={{ marginBottom: 16 }}>
                        <Alert>Sin fecha ni límite de unidades — este descuento permanecerá activo hasta que lo desactives manualmente.</Alert>
                      </div>
                    ) : (
                      resumenVigencia() && (
                        <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
                          {resumenVigencia()}
                        </p>
                      )
                    )}

                    <p style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textMuted }}>
                      🔗 Este descuento se sincroniza a Shopify, WooCommerce, Tienda Nube, CAS y ECOM Scanner.
                    </p>
                  </>
                )}
              </div>

              {/* Previsualización en vivo — misma tarjeta que ve el dropshipper en el catálogo */}
              <div style={{ width: 216, flexShrink: 0, position: "sticky", top: 16 }}>
                <p style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                  Así se verá en el catálogo
                </p>
                <ProductCard product={product} discount={draft} interactive={false} />
              </div>
            </div>
          )}

          {activeStep !== "general" && activeStep !== "descuentos" && (
            <div style={{ padding: "36px 20px", textAlign: "center", background: C.bgGray, borderRadius: 8, border: `1px dashed ${C.border}` }}>
              <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>Esta sección no está configurada en el prototipo.</p>
            </div>
          )}

          {/* Guardar / Cancelar — réplica del footer fijo de "General - default" */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 4 }}>
            <button onClick={handleBack} style={{
              height: 40, padding: "0 24px", borderRadius: 12, cursor: "pointer",
              border: `1px solid ${C.orange}`, background: "#fff", color: C.orange,
              fontFamily: FONT_UI, fontWeight: 700, fontSize: 14,
            }}>
              Cancelar
            </button>
            <button onClick={handleGuardar} disabled={mode === "edit" && (!isDirty || isBelowMin)} style={{
              height: 40, padding: "0 24px", borderRadius: 12, border: "none",
              background: mode === "edit" && (!isDirty || isBelowMin) ? "#FBD9BC" : C.orange, color: "#fff",
              fontFamily: FONT_UI, fontWeight: 700, fontSize: 14,
              cursor: mode === "edit" && (!isDirty || isBelowMin) ? "default" : "pointer",
            }}>
              {mode === "create" ? "Guardar" : saved && !isDirty ? "Guardado" : "Guardar"}
            </button>
          </div>
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
        {visible.map(({ product: p, discount: d }) => (
          <ProductCard
            key={p.id}
            product={p}
            discount={d}
            onClick={() => openDetail(p.id)}
            onOrder={() => setOrderProductId(p.id)}
          />
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
