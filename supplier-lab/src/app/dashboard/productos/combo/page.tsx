"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X, Search, Package, AlertTriangle, Plus, ChevronLeft, ChevronRight,
  ShoppingCart, Trash2, ChevronDown, Bold, Italic, List, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Upload, Star, Check,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const fmt = (n: number) => `$ ${n.toLocaleString("es-CO")}`;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComboProduct {
  id: number;
  name: string;
  category: string;
  costPrice: number;
  suggestedPrice: number;
  stock: number;
  isVariable: boolean;
  colors?: string[];
  warehouses: string[];
  image: string | null;
}

interface SelectedProduct {
  product: ComboProduct;
  quantity: number;
}

interface VariantRow {
  id: string;
  components: { productName: string; quantity: number; color?: string }[];
  price: number;
  suggestedPrice: number;
  stock: number;
  enabled: boolean;
}

interface Resource {
  title: string;
  url: string;
}

// ─── Datos mock fiel a Dropi ──────────────────────────────────────────────────

const CATALOG: ComboProduct[] = [
  {
    id: 2026631,
    name: "Adaptador USB",
    category: "Tecnología",
    costPrice: 20000,
    suggestedPrice: 20000,
    stock: 100,
    isVariable: false,
    warehouses: ["Bodega Principal Pruebas"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop",
  },
  {
    id: 2088171,
    name: "Bateria Portatil Solar",
    category: "Tecnología",
    costPrice: 65000,
    suggestedPrice: 65000,
    stock: 73,
    isVariable: true,
    colors: ["Negro", "Verde"],
    warehouses: ["Bodega Principal Pruebas"],
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&auto=format&fit=crop",
  },
  {
    id: 1956001,
    name: "Kit Cocina Esencial",
    category: "Hogar",
    costPrice: 38000,
    suggestedPrice: 79000,
    stock: 150,
    isVariable: false,
    warehouses: ["Bodega Principal Pruebas"],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&auto=format&fit=crop",
  },
  {
    id: 1956002,
    name: "Sartén Antiadherente 28cm",
    category: "Hogar",
    costPrice: 45000,
    suggestedPrice: 95000,
    stock: 98,
    isVariable: true,
    colors: ["Rojo", "Negro"],
    warehouses: ["Bodega Bogotá"],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&auto=format&fit=crop",
  },
  {
    id: 1956003,
    name: "Gorra Snapback",
    category: "Moda",
    costPrice: 18000,
    suggestedPrice: 42000,
    stock: 145,
    isVariable: true,
    colors: ["Negro", "Blanco", "Azul"],
    warehouses: ["Bodega Principal Pruebas"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&auto=format&fit=crop",
  },
  {
    id: 1956004,
    name: "Cinturón de Cuero Genuino",
    category: "Moda",
    costPrice: 25000,
    suggestedPrice: 55000,
    stock: 93,
    isVariable: false,
    warehouses: ["Bodega Bogotá"],
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=300&auto=format&fit=crop",
  },
];

const DEFAULT_WARRANTIES = [
  { type: "Producto incompleto", days: 10, description: "Si el pedido llega con productos faltantes, se gestionará el reenvío de los artículos pendientes." },
  { type: "Mal funcionamiento", days: 10, description: "Si el producto presenta fallas de fábrica o deja de funcionar correctamente, se gestionará el cambio o devolución dentro del plazo establecido." },
  { type: "Producto roto", days: 10, description: "Si el producto llega dañado o roto durante el envío, se gestionará el cambio o devolución." },
  { type: "Producto diferente", days: 10, description: "Si el cliente recibe un producto distinto al solicitado, se gestionará el cambio solo si no ha sido usado." },
];

const STEPS = [
  { id: 1, label: "Productos del combo" },
  { id: 2, label: "Precios" },
  { id: 3, label: "General" },
  { id: 4, label: "Imágenes" },
  { id: 5, label: "Garantías" },
  { id: 6, label: "Videos Dropi App" },
  { id: 7, label: "Productos privados" },
  { id: 8, label: "Recursos adicionales" },
];

const CATEGORIES = ["Bisutería", "Hogar", "Tecnología", "Moda", "Mascotas", "Deportes", "Belleza", "General"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildVariantRows(selected: SelectedProduct[]): VariantRow[] {
  if (selected.length === 0) return [];

  // Expand each selected product into its variants
  const productOptions: { productName: string; quantity: number; color?: string; stock: number; cost: number; suggested: number }[][] =
    selected.map((s) => {
      if (s.product.isVariable && s.product.colors && s.product.colors.length > 0) {
        return s.product.colors.map((color) => ({
          productName: s.product.name,
          quantity: s.quantity,
          color,
          stock: Math.floor(s.product.stock / s.product.colors!.length),
          cost: s.product.costPrice,
          suggested: s.product.suggestedPrice,
        }));
      }
      return [{
        productName: s.product.name,
        quantity: s.quantity,
        stock: s.product.stock,
        cost: s.product.costPrice,
        suggested: s.product.suggestedPrice,
      }];
    });

  // Cartesian product
  const cartesian = (arrays: (typeof productOptions)[0][]): (typeof productOptions)[0][0][][] => {
    if (arrays.length === 0) return [[]];
    const [first, ...rest] = arrays;
    const restCombinations = cartesian(rest);
    return first.flatMap((item) => restCombinations.map((combo) => [item, ...combo]));
  };

  const combinations = cartesian(productOptions);

  return combinations.map((combo, idx) => {
    const totalCost = combo.reduce((sum, c) => sum + c.cost * c.quantity, 0);
    const totalSuggested = combo.reduce((sum, c) => sum + c.suggested * c.quantity, 0);
    const minStock = Math.min(...combo.map((c) => c.stock));
    return {
      id: String(idx),
      components: combo.map((c) => ({ productName: c.productName, quantity: c.quantity, color: c.color })),
      price: totalCost,
      suggestedPrice: totalSuggested,
      stock: minStock,
      enabled: true,
    };
  });
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function WarrantyAccordion({ type, days, description }: { type: string; days: number; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-4 px-5 text-[14px] text-zinc-700 font-medium hover:bg-zinc-50 transition-colors text-left"
      >
        <ChevronDown size={16} className={`text-zinc-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        {type} · {days} días
      </button>
      {open && <p className="px-5 pb-4 pt-0 text-[13px] text-zinc-500 pl-[44px]">{description}</p>}
    </div>
  );
}

function RichTextBar() {
  return (
    <div className="flex items-center gap-0.5 border-b border-zinc-200 px-2 py-1.5 bg-white flex-wrap">
      {[Bold, Italic].map((Icon, i) => (
        <button key={i} className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600" type="button"><Icon size={14} /></button>
      ))}
      <div className="w-px h-4 bg-zinc-200 mx-1" />
      {[List].map((Icon, i) => (
        <button key={i} className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600" type="button"><Icon size={14} /></button>
      ))}
      <button className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600 text-xs font-bold" type="button">≡</button>
      <div className="w-px h-4 bg-zinc-200 mx-1" />
      {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
        <button key={i} className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600" type="button"><Icon size={14} /></button>
      ))}
      <div className="w-px h-4 bg-zinc-200 mx-1" />
      <button className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600" type="button"><LinkIcon size={14} /></button>
      <div className="w-px h-4 bg-zinc-200 mx-1" />
      {[Undo, Redo].map((Icon, i) => (
        <button key={i} className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600" type="button"><Icon size={14} /></button>
      ))}
    </div>
  );
}

function ComboPreviewSidebar({ name, category, images, primaryImg, selected }: {
  name: string;
  category: string;
  images: string[];
  primaryImg: number;
  selected: SelectedProduct[];
}) {
  const totalCost = selected.reduce((sum, s) => sum + s.product.costPrice * s.quantity, 0);
  const totalSuggested = selected.reduce((sum, s) => sum + s.product.suggestedPrice * s.quantity, 0);
  const minStock = selected.length > 0 ? Math.min(...selected.map((s) => s.product.stock)) : 0;
  const warehouses = selected.length > 0 ? [...new Set(selected.flatMap((s) => s.product.warehouses))] : [];
  const coverImg = images[primaryImg] ?? null;

  return (
    <div className="w-[220px] shrink-0 border-l border-zinc-100 bg-white p-4 overflow-y-auto">
      <div className="rounded-xl border border-zinc-200 overflow-hidden">
        <div className="relative h-40 bg-zinc-100 flex items-center justify-center">
          {coverImg ? (
            <img src={coverImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-zinc-300">
              <Package size={32} />
              <span className="text-[10px]">Producto sin imagen</span>
            </div>
          )}
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Combo</span>
          {minStock > 0 && (
            <span className="absolute top-2 right-2 text-[10px] font-bold text-[#ff7b00]">Stock: {minStock}</span>
          )}
        </div>
        <div className="p-3">
          {category && <p className="text-[10px] text-zinc-400 mb-0.5">{category}</p>}
          <p className="font-bold text-zinc-800 text-sm mb-1 leading-tight">{name || "Nombre Combo"}</p>
          <p className="text-[11px] text-zinc-400 mb-1">Proveedor: <span className="text-[#ff7b00]">Proveedor Paola</span></p>
          <div className="flex justify-between text-[11px] mb-2">
            <div>
              <p className="text-zinc-400">Precio proveedor</p>
              <p className="font-bold text-zinc-700">{fmt(totalCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400">Precio sugerido</p>
              <p className="font-bold text-zinc-800">{fmt(totalSuggested)}</p>
            </div>
          </div>
          {warehouses.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-500 font-medium mb-1">Disponible en las bodegas:</p>
              <div className="flex flex-wrap gap-1">
                {warehouses.map((w, i) => (
                  <span key={i} className="text-[9px] bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-600 font-medium">{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ComboCreatePage() {
  const router = useRouter();

  // Navigation
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 1
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<SelectedProduct[]>([]);
  const [drawerPage, setDrawerPage] = useState(0);
  const SLOTS = 5;

  // Step 2
  const [variantRows, setVariantRows] = useState<VariantRow[]>([]);
  const [priceSearch, setPriceSearch] = useState("");

  // Step 3
  const [comboName, setComboName] = useState("");
  const [useShipName, setUseShipName] = useState(false);
  const [shipName, setShipName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

  // Step 4
  const [images, setImages] = useState<string[]>([]);
  const [primaryImg, setPrimaryImg] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Step 6
  const [videoDescription, setVideoDescription] = useState("");
  const [videoName, setVideoName] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Step 8
  const [resources, setResources] = useState<Resource[]>([]);
  const [addingResource, setAddingResource] = useState(false);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResUrl, setNewResUrl] = useState("");

  const totalUnits = selected.reduce((acc, s) => acc + s.quantity, 0);
  const needsMoreProducts = totalUnits < 2;

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter((p) => p.name.toLowerCase().includes(q) || String(p.id).includes(q));
  }, [searchQuery]);

  const filteredVariants = useMemo(() => {
    const q = priceSearch.toLowerCase();
    if (!q) return variantRows;
    return variantRows.filter((r) =>
      r.components.some((c) => c.productName.toLowerCase().includes(q) || (c.color ?? "").toLowerCase().includes(q))
    );
  }, [variantRows, priceSearch]);

  const handleAddToSelection = (product: ComboProduct) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.product.id === product.id);
      if (existing) return prev.map((s) => s.product.id === product.id ? { ...s, quantity: s.quantity + 1 } : s);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleConfirmDrawer = () => {
    setIsDrawerOpen(false);
    trackEvent("combo_products_added", { count: totalUnits });
  };

  const handleGoToStep = (step: number) => {
    if (step === 2 && variantRows.length === 0) {
      setVariantRows(buildVariantRows(selected));
    }
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep < STEPS.length) handleGoToStep(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep((s) => s - 1);
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoName(file.name);
    e.target.value = "";
  };

  const handleSaveResource = () => {
    if (!newResTitle.trim() || !newResUrl.trim()) return;
    setResources((prev) => [...prev, { title: newResTitle.trim(), url: newResUrl.trim() }]);
    setNewResTitle("");
    setNewResUrl("");
    setAddingResource(false);
  };

  const canNext =
    activeStep === 1 ? !needsMoreProducts :
    activeStep === 3 ? comboName.trim().length > 0 :
    activeStep === 4 ? images.length >= 3 :
    true;

  const showSidebar = activeStep >= 2;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">

      {/* ── Header ── */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 shrink-0">
        <h1 className="text-xl font-bold text-zinc-800">Crear combo</h1>
        <button onClick={() => router.push("/dashboard/productos")} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <div className="w-56 bg-white border-r border-zinc-100 py-8 px-5 flex flex-col gap-0 shrink-0 overflow-y-auto">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isDone = activeStep > step.id;
            return (
              <div key={step.id} className="flex items-start gap-3 relative">
                {idx < STEPS.length - 1 && (
                  <div className={`absolute left-[13px] top-[26px] w-[2px] h-[calc(100%-6px)] transition-colors ${isDone ? "bg-[#ff7b00]" : "bg-zinc-200"}`} />
                )}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 border-2 transition-colors ${
                  isActive ? "bg-[#ff7b00] border-[#ff7b00] text-white"
                  : isDone ? "bg-[#fff0e0] border-[#ff7b00] text-[#ff7b00]"
                  : "bg-white border-zinc-300 text-zinc-400"
                }`}>
                  {step.id}
                </div>
                <button
                  onClick={() => step.id === 2 ? handleGoToStep(2) : setActiveStep(step.id)}
                  className={`text-sm pb-7 text-left leading-tight transition-colors ${isActive ? "font-bold text-zinc-800" : "font-medium text-zinc-400 hover:text-zinc-600"}`}
                >
                  {step.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Área central + sidebar preview ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Contenido principal ── */}
          <div className="flex-1 overflow-y-auto bg-white">

            {/* PASO 1: Productos del combo */}
            {activeStep === 1 && (
              <div className="p-8 max-w-4xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-zinc-800">Productos del combo</h2>
                  <button onClick={() => setIsDrawerOpen(true)} className="text-[#ff7b00] hover:text-[#e06c00] font-semibold text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Agregar producto
                  </button>
                </div>
                <p className="text-sm text-zinc-500 mb-6">
                  Para crear un combo, agrega al menos 2 artículos (pueden ser el mismo producto) y asegúrate de que todos compartan la misma bodega.
                </p>

                <div className="flex flex-col gap-3">
                  {selected.length === 0 ? (
                    <>
                      <EmptySlot onClick={() => setIsDrawerOpen(true)} />
                      <EmptySlot onClick={() => setIsDrawerOpen(true)} />
                    </>
                  ) : (
                    <>
                      {selected.map((s) => (
                        <ProductCard
                          key={s.product.id}
                          item={s}
                          onRemove={() => setSelected((prev) => prev.filter((p) => p.product.id !== s.product.id))}
                          onIncrement={() => setSelected((prev) => prev.map((p) => p.product.id === s.product.id ? { ...p, quantity: p.quantity + 1 } : p))}
                          onDecrement={() => setSelected((prev) => prev.map((p) => p.product.id === s.product.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))}
                        />
                      ))}
                      <button onClick={() => setIsDrawerOpen(true)} className="text-[#ff7b00] hover:text-[#e06c00] text-sm font-semibold flex items-center gap-1 pt-1">
                        <Plus className="w-4 h-4" /> Agregar producto
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* PASO 2: Precios y existencias */}
            {activeStep === 2 && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-zinc-800 mb-1">Precios y existencias</h2>
                <p className="text-sm text-zinc-500 mb-5">Define los precios y las existencias para cada combinación de este combo.</p>

                {/* Search */}
                <div className="relative mb-4 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    value={priceSearch}
                    onChange={(e) => setPriceSearch(e.target.value)}
                    placeholder="Buscar variante"
                    className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-[#ff7b00]"
                  />
                </div>

                {/* Table header */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[2fr_1fr_1fr_80px_60px] bg-zinc-50 border-b border-zinc-200 px-4 py-2.5 text-[12px] font-bold text-zinc-500">
                    <span>Combo</span>
                    <span>Precio</span>
                    <span>Precio sugerido</span>
                    <span>Existencias</span>
                    <span>Estado</span>
                  </div>

                  {filteredVariants.length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-400">No hay variantes que coincidan.</div>
                  ) : (
                    filteredVariants.map((row) => (
                      <div key={row.id} className="border-b border-zinc-100 last:border-0">
                        {/* Main row */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_80px_60px] items-center px-4 py-3">
                          <span className="text-sm text-zinc-400">—</span>
                          <span className="text-sm font-bold text-zinc-700">{fmt(row.price)}</span>
                          <div>
                            <input
                              type="text"
                              value={fmt(row.suggestedPrice).replace("$ ", "")}
                              onChange={(e) => {
                                const val = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
                                setVariantRows((prev) => prev.map((r) => r.id === row.id ? { ...r, suggestedPrice: val } : r));
                              }}
                              className="w-32 border border-zinc-200 rounded-lg px-2 py-1 text-sm font-bold text-zinc-800 focus:outline-none focus:border-[#ff7b00]"
                            />
                          </div>
                          <span className="text-sm font-bold text-emerald-500">{row.stock}</span>
                          <button
                            onClick={() => setVariantRows((prev) => prev.map((r) => r.id === row.id ? { ...r, enabled: !r.enabled } : r))}
                            className={`w-10 h-5 rounded-full transition-colors relative ${row.enabled ? "bg-[#ff7b00]" : "bg-zinc-200"}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${row.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                          </button>
                        </div>
                        {/* Component sub-rows */}
                        {row.components.map((c, ci) => (
                          <div key={ci} className="px-4 pb-2 text-[12px] text-zinc-500">
                            {c.productName} — Cantidad: {c.quantity}
                            {c.color && <span className="ml-1">· Color: {c.color}</span>}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PASO 3: General */}
            {activeStep === 3 && (
              <div className="p-8 max-w-2xl">
                <div className="mb-5">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">Nombre del combo</label>
                  <input
                    value={comboName}
                    onChange={(e) => setComboName(e.target.value)}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7b00]"
                  />
                </div>

                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useShipName}
                    onChange={(e) => setUseShipName(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 accent-[#ff7b00]"
                  />
                  <span className="text-sm text-zinc-600">Crear un nombre diferente para la guía de envío</span>
                </label>

                {useShipName && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Nombre en guía de envío</label>
                    <input
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7b00]"
                    />
                  </div>
                )}

                <p className="text-sm font-bold text-zinc-700 mb-3">Elige cómo quieres publicar tu combo:</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { value: "public" as const, title: "Público", desc: "Disponible para todos los dropshippers en el catálogo." },
                    { value: "private" as const, title: "Privado", desc: "Solo tú podrás ver y vender este combo." },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setVisibility(opt.value)}
                      className={`flex items-start gap-3 border-2 rounded-xl p-4 text-left transition-colors ${visibility === opt.value ? "border-[#ff7b00] bg-[#fff7f0]" : "border-zinc-200 hover:border-zinc-300"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${visibility === opt.value ? "border-[#ff7b00]" : "border-zinc-300"}`}>
                        {visibility === opt.value && <div className="w-2 h-2 bg-[#ff7b00] rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{opt.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Categoría</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7b00] bg-white pr-8 text-zinc-700"
                      >
                        <option value="">Selecciona la categoría</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">SKU</label>
                    <input
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7b00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">Descripción Dropi web</label>
                  <p className="text-xs text-zinc-400 mb-2">Indica qué es el producto, cómo funciona y cuáles son sus principales características.</p>
                  <div className="border border-zinc-200 rounded-lg overflow-hidden">
                    <RichTextBar />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2.5 text-sm text-zinc-700 focus:outline-none resize-none"
                    />
                    <div className="px-3 pb-2 text-right text-[11px] text-zinc-400">{description.length}/300</div>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4: Imágenes */}
            {activeStep === 4 && (
              <div className="p-8 max-w-2xl">
                <h2 className="text-xl font-bold text-zinc-800 mb-1">Imágenes del producto</h2>
                <p className="text-sm text-zinc-500 mb-4">Sube mínimo 3 imágenes que muestren tu producto desde todos los ángulos.</p>

                {images.length < 3 && (
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-5 text-sm text-orange-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Debes subir al menos 3 imágenes.
                  </div>
                )}

                {images.length > 0 ? (
                  <div className="flex gap-3 flex-wrap mb-4">
                    {images.map((src, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-zinc-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setPrimaryImg(i)}
                          className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${primaryImg === i ? "bg-[#ff7b00]" : "bg-white/80 hover:bg-white"}`}
                        >
                          <Star size={10} className={primaryImg === i ? "text-white fill-white" : "text-zinc-400"} />
                        </button>
                        <button
                          onClick={() => {
                            setImages((prev) => prev.filter((_, idx) => idx !== i));
                            if (primaryImg >= images.length - 1) setPrimaryImg(0);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
                        >
                          <X size={10} className="text-zinc-600" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-200 hover:border-[#ff7b00] flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#ff7b00] transition-colors"
                    >
                      <Plus size={18} />
                      <span className="text-[10px] font-medium">Agregar</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center py-10 gap-3 cursor-pointer hover:border-[#ff7b00] transition-colors mb-4"
                  >
                    <Upload className="w-8 h-8 text-zinc-300" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-600">Suelta o sube una imagen aquí</p>
                      <p className="text-xs text-zinc-400 mt-1">Formatos admitidos: JPG, JPEG, PNG, GIF, WEBP</p>
                      <p className="text-xs text-zinc-400">Tamaño máximo: 10MB</p>
                    </div>
                    <button className="px-5 py-2 bg-[#ff7b00] text-white text-sm font-bold rounded-lg hover:bg-[#e06c00] transition-colors">
                      Seleccionar imagen
                    </button>
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}

            {/* PASO 5: Garantías */}
            {activeStep === 5 && (
              <div className="p-8 max-w-2xl">
                <h2 className="text-xl font-bold text-zinc-800 mb-1">Garantías</h2>
                <p className="text-sm text-zinc-500 mb-6">Las garantías del combo se heredan de los productos que lo componen. No se pueden modificar desde aquí.</p>

                <div className="flex flex-col gap-4">
                  {selected.map((s) => (
                    <div key={s.product.id} className="border border-zinc-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 p-4 border-b border-zinc-100">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 shrink-0 overflow-hidden">
                          {s.product.image
                            ? <img src={s.product.image} className="w-full h-full object-cover" alt="" />
                            : <Package className="w-5 h-5 text-zinc-300 m-2.5" />
                          }
                        </div>
                        <div>
                          <span className="text-[11px] bg-zinc-100 text-zinc-500 rounded px-2 py-0.5 font-mono mr-2">ID: {s.product.id}</span>
                          <span className="text-sm font-bold text-zinc-800">{s.product.name}</span>
                        </div>
                      </div>
                      {DEFAULT_WARRANTIES.map((w, i) => (
                        <WarrantyAccordion key={i} type={w.type} days={w.days} description={w.description} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 6: Videos Dropi App */}
            {activeStep === 6 && (
              <div className="p-8 max-w-2xl">
                <h2 className="text-xl font-bold text-zinc-800 mb-1">Videos Dropi App</h2>
                <p className="text-sm text-zinc-500 mb-5">Sube 1 video que muestre tu producto desde todos los ángulos.</p>

                {videoName ? (
                  <div className="flex items-center justify-between border border-zinc-200 rounded-xl p-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                        <Upload className="w-5 h-5 text-zinc-400" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700 truncate max-w-xs">{videoName}</span>
                    </div>
                    <button onClick={() => setVideoName(null)} className="text-zinc-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center py-10 gap-3 cursor-pointer hover:border-[#ff7b00] transition-colors mb-5"
                  >
                    <Upload className="w-8 h-8 text-zinc-300" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-600">Suelta o sube un video aquí</p>
                      <p className="text-xs text-zinc-400 mt-1">Formatos admitidos: MP4, MOV</p>
                      <p className="text-xs text-zinc-400">Tamaño máximo: 250MB</p>
                    </div>
                    <button className="px-5 py-2 bg-[#ff7b00] text-white text-sm font-bold rounded-lg hover:bg-[#e06c00] transition-colors">
                      Seleccionar video
                    </button>
                  </div>
                )}

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime"
                  className="hidden"
                  onChange={handleVideoUpload}
                />

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">Descripción para la Dropi App</label>
                  <p className="text-xs text-zinc-400 mb-2">Indica qué es el producto, cómo funciona y cuáles son sus principales características.</p>
                  <div className="border border-zinc-200 rounded-lg overflow-hidden">
                    <RichTextBar />
                    <textarea
                      value={videoDescription}
                      onChange={(e) => { if (e.target.value.length <= 200) setVideoDescription(e.target.value); }}
                      rows={4}
                      className="w-full px-3 py-2.5 text-sm text-zinc-700 focus:outline-none resize-none"
                    />
                    <div className="px-3 pb-2 text-right text-[11px] text-zinc-400">{videoDescription.length}/200</div>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 7: Productos privados */}
            {activeStep === 7 && (
              <div className="p-8 max-w-2xl">
                <h2 className="text-xl font-bold text-zinc-800 mb-1">Productos privados</h2>
                <p className="text-sm text-zinc-500 mb-6">Asigna este combo de forma privada a dropshippers específicos.</p>
                <div className="p-6 border border-zinc-200 rounded-xl text-center text-sm text-zinc-400 flex flex-col items-center gap-2">
                  <Package className="w-8 h-8 text-zinc-300" />
                  Este combo es público. Para asignar dropshippers privados, cambia la visibilidad a <span className="font-bold text-zinc-600">Privado</span> en el paso General.
                </div>
              </div>
            )}

            {/* PASO 8: Recursos adicionales */}
            {activeStep === 8 && (
              <div className="p-8 max-w-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-800">Recursos adicionales</h2>
                    <p className="text-sm text-zinc-500">Comparte materiales que ayuden a los dropshippers a vender mejor tu producto.</p>
                  </div>
                  <button
                    onClick={() => setAddingResource(true)}
                    className="text-[#ff7b00] font-semibold text-sm flex items-center gap-1 hover:text-[#e06c00] transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Agregar recurso
                  </button>
                </div>

                {addingResource && (
                  <div className="border border-zinc-200 rounded-xl p-5 mt-5 mb-4 bg-zinc-50">
                    <div className="mb-3">
                      <label className="block text-sm font-bold text-zinc-700 mb-1.5">Título</label>
                      <input
                        value={newResTitle}
                        onChange={(e) => setNewResTitle(e.target.value)}
                        placeholder="Ingresa el título"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7b00] bg-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-zinc-700 mb-1.5">Link</label>
                      <input
                        value={newResUrl}
                        onChange={(e) => setNewResUrl(e.target.value)}
                        placeholder="Ingresa el link"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff7b00] bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setAddingResource(false); setNewResTitle(""); setNewResUrl(""); }} className="px-5 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors">
                        Cancelar
                      </button>
                      <button onClick={handleSaveResource} className="px-5 py-2 bg-[#ff7b00] text-white text-sm font-bold rounded-xl hover:bg-[#e06c00] transition-colors">
                        Guardar
                      </button>
                    </div>
                  </div>
                )}

                {resources.length === 0 && !addingResource ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-3">
                    <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center">
                      <Package className="w-7 h-7 text-zinc-300" />
                    </div>
                    <p className="text-sm">Aún no has agregado recursos</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    {resources.map((r, i) => (
                      <div key={i} className="flex items-center justify-between border border-zinc-200 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-zinc-800">{r.title}</p>
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-[#ff7b00] hover:underline truncate max-w-xs block">{r.url}</a>
                        </div>
                        <button onClick={() => setResources((prev) => prev.filter((_, idx) => idx !== i))} className="text-zinc-300 hover:text-red-400 ml-3 shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar preview (pasos 2-8) ── */}
          {showSidebar && (
            <ComboPreviewSidebar
              name={comboName}
              category={category}
              images={images}
              primaryImg={primaryImg}
              selected={selected}
            />
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="h-16 border-t border-zinc-200 bg-white flex items-center justify-end px-8 shrink-0 gap-3">
        {activeStep > 1 && (
          <button onClick={handleBack} className="px-5 py-2.5 text-sm font-bold text-[#ff7b00] hover:text-[#e06c00] transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
        )}
        <button
          disabled={!canNext}
          onClick={activeStep === STEPS.length ? () => { trackEvent("combo_created", {}); setShowSuccessModal(true); } : handleNext}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-sm ${
            canNext ? "bg-[#ff7b00] hover:bg-[#e06c00]" : "bg-[#ffb366] cursor-not-allowed"
          }`}
        >
          {activeStep === STEPS.length ? "Crear combo" : "Siguiente"}
        </button>
      </div>

      {/* ── Drawer backdrop ── */}
      {isDrawerOpen && <div className="fixed inset-0 bg-zinc-900/40 z-[60]" onClick={() => setIsDrawerOpen(false)} />}

      {/* ── Drawer: Agregar productos ── */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-[680px] bg-white shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 shrink-0">
          <h3 className="text-lg font-bold text-zinc-800">Agregar productos</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos por nombre o ID"
                className="pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-[#ff7b00] w-72"
              />
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-[160px]">
          {filteredCatalog.length === 0 ? (
            <div className="text-center text-zinc-400 py-16 text-sm">No se encontraron productos.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCatalog.map((product) => {
                const sel = selected.find((s) => s.product.id === product.id);
                return (
                  <CatalogCard
                    key={product.id}
                    product={product}
                    selectedQty={sel?.quantity ?? 0}
                    onAdd={() => handleAddToSelection(product)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-zinc-700 shrink-0 mr-1">Productos agregados ({totalUnits})</span>
            <button onClick={() => setDrawerPage((p) => Math.max(0, p - 1))} disabled={drawerPage === 0} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: SLOTS }).map((_, i) => {
              const item = selected[drawerPage * SLOTS + i];
              return (
                <div key={i} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center overflow-hidden shrink-0 ${item ? "border-[#ff7b00]" : "border-zinc-200 border-dashed"}`}>
                  {item ? (
                    item.product.image ? <img src={item.product.image} className="w-full h-full object-cover" alt="" /> : <Package className="w-5 h-5 text-[#ff7b00]" />
                  ) : (
                    <Package className="w-5 h-5 text-zinc-300" />
                  )}
                </div>
              );
            })}
            <button onClick={() => setDrawerPage((p) => p + 1)} disabled={(drawerPage + 1) * SLOTS >= selected.length} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3 border border-[#ff7b00] text-[#ff7b00] rounded-xl font-bold text-sm hover:bg-[#fff7f0] transition-colors">
              Cancelar
            </button>
            <button onClick={handleConfirmDrawer} disabled={totalUnits < 1} className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors ${totalUnits < 1 ? "bg-[#ffb366] cursor-not-allowed" : "bg-[#ff7b00] hover:bg-[#e06c00]"}`}>
              Agregar {totalUnits > 0 ? `(${totalUnits})` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal éxito ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="relative w-24 h-24 mx-auto mb-5">
              <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" fill="#ff7b00" />
                <ellipse cx="27" cy="38" rx="10" ry="11" fill="white" />
                <ellipse cx="53" cy="38" rx="10" ry="11" fill="white" />
                <circle cx="29" cy="39" r="6" fill="#1a1a1a" />
                <circle cx="55" cy="39" r="6" fill="#1a1a1a" />
                <circle cx="31" cy="36" r="2" fill="white" />
                <circle cx="57" cy="36" r="2" fill="white" />
                <path d="M 28 56 Q 40 64 52 56" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="62" cy="18" r="11" fill="#ff7b00" stroke="white" strokeWidth="2" />
                <path d="M 56 18 L 60 22 L 68 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-800 mb-2">Combo creado correctamente</h2>
            <p className="text-sm text-zinc-500 mb-6">Tu combo fue guardado. Podrás verlo en tu listado de productos.</p>
            <button
              onClick={() => router.push("/dashboard/productos?combo_created=1")}
              className="w-full py-3 bg-[#ff7b00] hover:bg-[#e06c00] text-white font-bold rounded-xl text-sm transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function EmptySlot({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 border border-zinc-200 rounded-xl p-5 bg-white hover:border-[#ff7b00] transition-colors cursor-pointer"
    >
      <div className="w-16 h-16 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
        <Package className="w-7 h-7 text-zinc-300" />
      </div>
      <span className="text-[#ff7b00] font-semibold text-sm flex items-center gap-1">
        <Plus className="w-4 h-4" /> Agregar producto
      </span>
    </div>
  );
}

function ProductCard({ item, onRemove, onIncrement, onDecrement }: {
  item: SelectedProduct;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const { product, quantity } = item;
  return (
    <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden">
      <div className="flex items-start gap-4 p-5">
        {/* Image */}
        <div className="w-20 h-20 bg-zinc-100 rounded-lg shrink-0 overflow-hidden">
          {product.image
            ? <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
            : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-zinc-300" /></div>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] bg-zinc-100 text-zinc-500 rounded px-2 py-0.5 font-mono">ID: {product.id}</span>
            {product.isVariable && (
              <span className="text-[11px] bg-[#ff7b00] text-white rounded-full px-2 py-0.5 font-bold">Variable</span>
            )}
          </div>
          <p className="font-bold text-zinc-800 text-sm mb-1">{product.name}</p>
          <div className="flex gap-4 text-[12px] text-zinc-500 mb-1">
            <span>Precio proveedor <span className="font-bold text-zinc-700">{fmt(product.costPrice)}</span></span>
            <span>Precio sugerido <span className="font-bold text-zinc-700">{fmt(product.suggestedPrice)}</span></span>
          </div>
          <p className="text-[12px] text-zinc-500 mb-1">
            Disponible en:{" "}
            {product.warehouses.map((w, i) => (
              <span key={i} className="inline-block bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 mr-1">{w}</span>
            ))}
          </p>
          <p className="text-[12px]">
            Stock: <span className="font-bold text-[#ff7b00]">{product.stock}</span>
            {product.isVariable && product.colors && (
              <span className="text-zinc-400 ml-2">Color: {product.colors.join(", ")}</span>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button onClick={onRemove} className="text-zinc-300 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden mt-2">
            <button onClick={onDecrement} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 border-r border-zinc-200 text-lg font-bold">−</button>
            <span className="w-9 text-center text-sm font-bold text-zinc-800">{quantity}</span>
            <button onClick={onIncrement} className="w-8 h-8 flex items-center justify-center text-[#ff7b00] hover:bg-[#fff7f0] border-l border-zinc-200 text-lg font-bold">+</button>
          </div>
        </div>
      </div>

      {/* Eliminar footer */}
      <div className="border-t border-zinc-100 px-5 py-2.5 flex justify-end">
        <button onClick={onRemove} className="flex items-center gap-1 text-[12px] text-zinc-500 hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Eliminar
        </button>
      </div>
    </div>
  );
}

function CatalogCard({ product, selectedQty, onAdd }: {
  product: ComboProduct;
  selectedQty: number;
  onAdd: () => void;
}) {
  const isAgotado = product.stock === 0;
  return (
    <div className={`bg-white border rounded-2xl flex flex-col overflow-hidden transition-shadow hover:shadow-md ${selectedQty > 0 ? "border-[#ff7b00] ring-1 ring-[#ff7b00]" : "border-zinc-200"}`}>
      <div className="relative h-36 bg-zinc-100 shrink-0">
        {product.image
          ? <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-zinc-300"><Package className="w-10 h-10" /><span className="text-xs">Sin imagen</span></div>
        }
        {product.isVariable && (
          <span className="absolute top-2 left-2 bg-[#ff7b00] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Variable</span>
        )}
        {isAgotado && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Agotado</span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-zinc-400 mb-0.5">{product.category}</p>
        <p className="font-bold text-zinc-800 text-[13px] mb-1 leading-snug line-clamp-2">{product.name}</p>
        <div className="flex justify-between text-[11px] mb-3">
          <div><p className="text-zinc-400">Precio proveedor:</p><p className="font-bold text-zinc-700">{fmt(product.costPrice)}</p></div>
          <div className="text-right"><p className="text-zinc-400">Precio sugerido</p><p className="font-bold text-zinc-700">{fmt(product.suggestedPrice)}</p></div>
        </div>
        <button
          onClick={onAdd}
          disabled={isAgotado}
          className={`w-full py-1.5 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors ${isAgotado ? "text-zinc-300 cursor-not-allowed" : "text-[#ff7b00] hover:text-[#e06c00]"}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {selectedQty > 0 ? `Agregar (${selectedQty})` : "Agregar"}
        </button>
      </div>
    </div>
  );
}
