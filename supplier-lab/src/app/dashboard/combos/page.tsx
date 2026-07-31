"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertTriangle,
  X,
  Heart,
  Crown,
  Star,
  Check,
  Image as ImageIcon,
  Store,
  Warehouse,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  Calendar,
  FileText,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Warranty {
  type: string;
  days: number;
  description: string;
}

interface Provider {
  id?: number;
  name: string;
  products?: number;
  categories?: string;
  image?: string;
  icon: "crown" | "star" | "check" | null;
  rating: string;
  description: string;
  dispatch: string;
  type?: string;
  city?: string;
  isFavorite?: boolean;
}

interface CatalogProduct {
  id: number;
  name: string;
  cost: number;
  suggestedPrice: number;
  hasVariables: boolean;
  stock: number;
  category: string;
  attributes: string;
  warehouses: string[];
  warranties?: Warranty[];
  image: string;
  quantity?: number;
  deleted?: boolean;
}

interface ComboWarning {
  type: "error" | "warning";
  text: string;
}

type VariantEntry = { productId?: number; productName: string; attributes: Record<string, string> };

interface RichData {
  comboName: string;
  comboDescription: string;
  comboImages: string[];
  selectedProducts: CatalogProduct[];
  comboVariants: VariantEntry[][];
  selectedProvider: Provider | null;
  selectedWarehouse: { name: string; city: string };
  minStock: number;
  totalCost: number;
  totalSuggested: number;
  warning?: ComboWarning;
}

interface Combo {
  id: number;
  title: string;
  productsCount: number;
  stock: number;
  description: string;
  provider: string;
  warehouse: string;
  cost: number;
  suggestedPrice: number;
  status: "Activo" | "Inactivo";
  image: string;
  warning?: ComboWarning;
  richData?: RichData;
}

// ─── WarrantyAccordion ────────────────────────────────────────────────────────

function WarrantyAccordion({ title, days, description }: { title: string; days: number; description: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-4 px-5 text-[14px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
      >
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        {title} · {days} días
      </button>
      {isOpen && <div className="px-5 pb-4 pt-1 text-[13px] text-slate-600 pl-[44px]">{description}</div>}
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText, confirmColorClass }: {
  isOpen: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
  confirmText: string; confirmColorClass: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-[#1e3a5f] mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-bold text-white rounded-xl transition-colors ${confirmColorClass}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ComboCard ────────────────────────────────────────────────────────────────

function ComboCard({ combo, onClick, onEditClick, onDeleteClick }: {
  combo: Combo;
  onClick: () => void;
  onEditClick: (c: Combo) => void;
  onDeleteClick: (c: Combo) => void;
}) {
  const { title, productsCount, stock, description, provider, warehouse, cost, suggestedPrice, status, image, warning, richData } = combo;
  const isVariable = (richData?.comboVariants?.length ?? 0) > 0;
  const warehousesList = warehouse ? warehouse.split(",").map((w) => w.trim()) : [];

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer group">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Combo"; }} />
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase shadow-sm ${status === "Activo" ? "bg-emerald-500" : "bg-red-500"}`}>{status}</div>
          {isVariable && <div className="bg-[#ff7b00] px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase shadow-sm">Variable</div>}
        </div>
        {status === "Inactivo" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-[2px] p-4 text-center z-20">
            <div className={`p-2 rounded-full mb-2 shadow-lg ${warning?.type === "error" ? "bg-rose-500" : "bg-orange-500"}`}>
              <AlertTriangle className="text-white" size={20} />
            </div>
            <span className="text-white font-bold text-[13px] leading-tight drop-shadow-md">{warning?.type === "error" ? "Producto Eliminado" : "Agotado (Sin Stock)"}</span>
            {warning?.text && <span className="text-white/90 text-[10px] mt-1.5 line-clamp-3 leading-snug font-medium">{warning.text}</span>}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] text-slate-400 font-medium">{productsCount} productos</span>
          <span className="text-[11px] font-bold">Stock: <span className={stock <= 5 ? "text-rose-500" : "text-emerald-500"}>{stock}</span></span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight group-hover:text-orange-500 transition-colors">{title}</h3>
        <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">{description}</p>
        <div className="space-y-2 mb-4 text-[11px] mt-auto">
          <p className="text-slate-500">Proveedor: <span className="text-orange-500 font-medium">{provider}</span></p>
          <div className="text-slate-500 flex flex-col gap-1.5">
            <span>Bodegas:</span>
            <div className="flex flex-wrap gap-1">
              {warehousesList.map((w, i) => (
                <span key={i} className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold text-[9px]">
                  <Warehouse size={8} /> {w}
                </span>
              ))}
            </div>
          </div>
        </div>
        {warning && (
          <div className={`mb-4 px-2.5 py-2 rounded-lg text-[10px] flex items-start gap-1.5 ${warning.type === "error" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}>
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span className="font-medium line-clamp-2">{warning.text}</span>
          </div>
        )}
        <div className="flex justify-between items-end border-t border-slate-50 pt-3">
          <div><p className="text-[10px] text-slate-400">Costo combo</p><p className="font-bold text-slate-800 text-sm">${cost.toLocaleString()}</p></div>
          <div className="text-right"><p className="text-[10px] text-slate-400">Precio sugerido</p><p className="font-bold text-orange-500 text-sm">${suggestedPrice.toLocaleString()}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-slate-100 bg-white relative z-10">
        <button onClick={(e) => { e.stopPropagation(); onEditClick(combo); }} className="flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-orange-500 hover:bg-orange-50 transition-colors">
          <Edit2 size={12} /> Editar
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDeleteClick(combo); }} className="flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-rose-500 hover:bg-rose-50 border-l border-slate-100 transition-colors">
          <Trash2 size={12} /> Eliminar
        </button>
      </div>
    </div>
  );
}

// ─── ComboPreviewUI ───────────────────────────────────────────────────────────

function ComboPreviewUI({ data }: { data: RichData }) {
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(true);
  const { comboName, comboDescription, comboImages = [], selectedProducts = [], comboVariants = [], selectedProvider, selectedWarehouse, minStock, totalCost, totalSuggested, warning } = data;
  const warehousesList = selectedWarehouse?.name && selectedWarehouse.name !== "Sin asignar" ? selectedWarehouse.name.split(",").map((w) => w.trim()) : [];

  return (
    <div className="w-full max-w-[1000px] mx-auto py-8 px-4 lg:px-8 bg-transparent min-h-full animate-in fade-in duration-300">
      <div className="text-[11px] text-slate-500 mb-6 flex items-center gap-2">
        <Home size={12} className="text-slate-400" /><ChevronRight size={12} className="text-slate-300" />
        <span>Productos</span><ChevronRight size={12} className="text-slate-300" />
        <span>Combos</span><ChevronRight size={12} className="text-slate-300" />
        <span className="text-slate-700 font-medium">{comboName || "Combo sin título"}</span>
      </div>

      {warning && (
        <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 border shadow-sm ${warning.type === "error" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[14px]">{warning.type === "error" ? "Acción requerida: Producto eliminado" : "Acción requerida: Producto sin stock"}</h4>
            <p className="text-[13px] font-medium opacity-90">{warning.text}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden mb-4">
            <img src={comboImages[0] || selectedProducts[0]?.image || "https://via.placeholder.com/600"} className="w-full h-full object-cover" alt="Combo" />
          </div>
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
            {(comboImages.length > 0 ? comboImages : selectedProducts.map((p) => p.image)).map((img, i) => (
              <div key={i} className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 ${i === 0 ? "border-orange-500" : "border-transparent"}`}>
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
              </div>
            ))}
          </div>

          <h4 className="font-bold text-[#1e3a5f] text-[15px] mb-4">Productos incluidos</h4>
          <div className="space-y-4">
            {selectedProducts.map((p, index) => {
              const isDeleted = p.deleted;
              const isOutOfStock = p.stock === 0 && !isDeleted;
              return (
                <div key={p.id || index} className={`flex gap-4 border rounded-2xl p-3 shadow-sm ${isDeleted ? "border-rose-300 bg-rose-50/80" : isOutOfStock ? "border-orange-300 bg-orange-50/80" : "border-slate-100 bg-white"}`}>
                  <div className="w-16 h-16 rounded-xl bg-slate-50 shrink-0 overflow-hidden relative">
                    <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                    {(isDeleted || isOutOfStock) && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                        <span className={`text-[10px] font-bold rotate-[-15deg] ${isDeleted ? "text-rose-600" : "text-orange-600"}`}>{isDeleted ? "Eliminado" : "Agotado"}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h5 className={`font-bold text-[13px] truncate mb-1.5 ${isDeleted ? "text-rose-700 line-through" : "text-slate-800"}`}>{p.name}</h5>
                    {!isDeleted && (
                      <div className="flex gap-4">
                        <div><p className="text-[10px] text-slate-400">Precio proveedor</p><p className="text-[12px] font-bold text-slate-800">${(p.cost || 0).toLocaleString()}</p></div>
                        <div><p className="text-[10px] text-slate-400">Precio sugerido</p><p className="text-[12px] font-bold text-slate-800">${(p.suggestedPrice || 0).toLocaleString()}</p></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[11px] px-2 py-0.5 rounded-md font-medium shadow-sm">ID: 243878</span>
            <span className="bg-blue-500 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-sm">Combo</span>
          </div>
          <h1 className="text-[26px] font-black text-[#1e3a5f] leading-tight mb-3">{comboName || "Combo: Título del combo aquí"}</h1>

          <div className="space-y-3 mb-8 text-[13px] text-slate-600">
            <p>Tipo de producto: <span className="font-medium text-slate-800">{comboVariants.length > 0 ? "Combo variable" : "Combo simple"}</span></p>
            <div className="flex items-start gap-2">
              <span className="pt-0.5">Bodegas disponibles:</span>
              <div className="flex flex-wrap gap-1.5">
                {warehousesList.length > 0 ? warehousesList.map((w, idx) => (
                  <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><Warehouse size={10} /> {w}</span>
                )) : <span className="font-medium text-slate-800">Sin asignar</span>}
              </div>
            </div>
          </div>

          {comboVariants.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8 bg-white shadow-sm">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsVariantsExpanded(!isVariantsExpanded)}>
                <span className="font-bold text-[14px] text-[#1e3a5f]">Stock por variantes ({comboVariants.length} en total)</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isVariantsExpanded ? "rotate-180" : ""}`} />
              </div>
              {isVariantsExpanded && (
                <div className="max-h-[420px] overflow-y-auto bg-white">
                  {comboVariants.map((variantArr, idx) => (
                    <div key={idx} className="border-b border-slate-100 p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 items-center">
                        <span className="border border-slate-200 px-2 py-1 rounded text-[11px] text-slate-600 bg-white shadow-sm font-medium w-fit">ID: {18512 + idx}</span>
                        <div className="text-[#00a896] font-bold text-[13px]">{minStock}</div>
                        <div className="text-[14px] text-slate-700">${totalCost.toLocaleString()}</div>
                        <div className="text-[14px] text-slate-700 font-medium">${totalSuggested.toLocaleString()}</div>
                      </div>
                      <div className="space-y-2.5 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                        {variantArr.map((v, j) => (
                          <div key={j} className="flex flex-col sm:flex-row sm:items-center justify-between text-[12px] gap-1">
                            <span className="text-slate-500">{v.productName}</span>
                            <span className="font-medium text-slate-700 text-right">{Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(", ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mb-8">
            <span className="text-[14px] text-slate-600">Stock: <span className="font-bold text-[#00a896] text-[16px]">{minStock}</span></span>
            <span className="bg-[#e6f7f5] text-[#00a896] border border-[#b2e5df] text-[11px] px-2.5 py-0.5 rounded-full font-bold">Stock promedio 60</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button className="bg-[#ff9f65] hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-[13px]">Enviar al cliente</button>
            <button className="border border-orange-300 text-orange-500 font-bold py-3 px-6 rounded-xl hover:bg-orange-50 transition-colors shadow-sm text-[13px]">Solicitar muestra</button>
          </div>

          {selectedProvider && (
            <div className="border border-slate-200 rounded-2xl p-5 mb-10 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white border-4 border-yellow-100">
                    {selectedProvider.icon === "crown" && <Crown size={20} />}
                    {selectedProvider.icon === "star" && <Star size={20} fill="white" />}
                    {selectedProvider.icon === "check" && <Check size={20} strokeWidth={3} />}
                    {!selectedProvider.icon && <Store size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] text-[15px]">{selectedProvider.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1"><Check size={10} className="text-emerald-500" strokeWidth={3} /> Verificado</p>
                  </div>
                </div>
                <button className="border border-slate-200 rounded-lg px-4 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <FileText size={14} /> Contactar
                </button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                <p className="text-[13px] text-slate-600 mb-2"><span className="font-bold text-slate-800">{selectedProvider.rating}:</span> {selectedProvider.description}</p>
                <div className="flex h-1.5 rounded-full overflow-hidden gap-1">
                  <div className="bg-emerald-400 w-1/3"></div><div className="bg-yellow-400 w-1/3"></div><div className="bg-slate-200 w-1/3"></div>
                </div>
              </div>
              <div className="flex items-center text-[12px]">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={14} className="text-orange-400" /> Despacho promedio: <span className="font-bold text-slate-700">{selectedProvider.dispatch}</span></span>
              </div>
            </div>
          )}

          {comboDescription && (
            <div className="mb-6">
              <h4 className="pb-3 border-b-2 border-orange-500 font-bold text-slate-800 text-[14px] inline-block mb-4">Descripción</h4>
              <div className="text-[13px] text-slate-600 leading-relaxed pb-10 whitespace-pre-wrap">{comboDescription}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CreateGarantiaModal ──────────────────────────────────────────────────────

function CreateGarantiaModal({ isOpen, onClose, availableProducts = [] }: {
  isOpen: boolean; onClose: () => void;
  availableProducts?: Array<{ id: number; name: string; qty: number }>;
}) {
  const [contactNumber, setContactNumber] = useState("");
  const [items, setItems] = useState([{ id: Date.now(), productId: "", quantity: 1, warrantyType: "", returnType: "devolucion", description: "" }]);

  useEffect(() => {
    if (isOpen) {
      setContactNumber("");
      setItems([{ id: Date.now(), productId: "", quantity: 1, warrantyType: "", returnType: "devolucion", description: "" }]);
    }
  }, [isOpen]);

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] z-[100] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Crear garantía</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-slate-600 mb-1.5">Número de contacto</label>
            <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
          </div>
          {items.map((item) => {
            const maxQty = availableProducts.find((p) => String(p.id) === String(item.productId))?.qty ?? 1;
            return (
              <div key={item.id} className="border border-slate-200 bg-white rounded-lg p-5 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-600 mb-1.5">Producto</label>
                    <select value={item.productId} onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">Seleccione un producto</option>
                      {availableProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-600 mb-1.5">Tipo de garantía</label>
                    <select value={item.warrantyType} onChange={(e) => updateItem(item.id, "warrantyType", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">Seleccione motivo</option>
                      <option value="Orden incompleta">Orden incompleta</option>
                      <option value="Mal funcionamiento">Mal funcionamiento</option>
                      <option value="Producto roto">Producto roto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-600 mb-1.5">Cantidad</label>
                    <input type="number" min={1} max={maxQty} value={item.quantity}
                      onChange={(e) => { let v = parseInt(e.target.value, 10); if (isNaN(v) || v < 1) v = 1; if (v > maxQty) v = maxQty; updateItem(item.id, "quantity", v); }}
                      disabled={!item.productId}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 disabled:bg-slate-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-slate-600 mb-1.5">Descripción</label>
                    <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Describe el problema..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-4 bg-white rounded-b-lg">
          <button onClick={onClose} className="text-[14px] font-medium text-slate-600 hover:underline">Cerrar</button>
          <button onClick={() => { alert("Garantía solicitada"); onClose(); }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-[14px] transition-colors">Aceptar</button>
        </div>
      </div>
    </div>
  );
}

// ─── CreateComboModal ─────────────────────────────────────────────────────────

const CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: 101, name: "Set utensilios cocina 6 pzas", cost: 38000, suggestedPrice: 79000, hasVariables: false, stock: 150, category: "Hogar", attributes: "", warehouses: ["Bodega Principal", "Bodega Sur"], image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400", warranties: [{ type: "Producto incompleto", days: 10, description: "Garantía por defecto para orden incompleta" }, { type: "Mal funcionamiento", days: 10, description: "Garantía por mal funcionamiento de fábrica" }] },
  { id: 102, name: "Sartén antiadherente 28cm", cost: 45000, suggestedPrice: 95000, hasVariables: true, stock: 98, category: "Hogar", attributes: "Color: Rojo, Negro, Menta", warehouses: ["Bodega Principal"], image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400", warranties: [{ type: "Mal funcionamiento", days: 15, description: "Garantía en caso de pérdida prematura de adherencia" }, { type: "Producto roto", days: 5, description: "Garantía por daños en el envío" }] },
  { id: 103, name: "Cafetera prensa francesa 600ml", cost: 42000, suggestedPrice: 89000, hasVariables: true, stock: 14, category: "Hogar", attributes: "Color: Cobre, Acero inox, Negro", warehouses: ["Bodega Sur", "Bodega Centro"], image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400", warranties: [{ type: "Producto roto", days: 10, description: "Garantía si el cristal llega roto" }] },
  { id: 104, name: "Gorra snapback ajustable", cost: 18000, suggestedPrice: 42000, hasVariables: true, stock: 145, category: "Moda", attributes: "Color: Negro, Gris, Azul", warehouses: ["Bodega Sur"], image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", warranties: [{ type: "Producto diferente", days: 10, description: "Si el producto no es el solicitado" }] },
  { id: 105, name: "Jean slim fit clásico", cost: 58000, suggestedPrice: 119000, hasVariables: true, stock: 8, category: "Moda", attributes: "Color: Azul oscuro | Talla: 30, 32", warehouses: ["Bodega Centro", "Bodega Principal"], image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400", warranties: [{ type: "Mal funcionamiento", days: 30, description: "Defectos en cierres o costuras" }] },
  { id: 106, name: "Cinturón de cuero genuino", cost: 25000, suggestedPrice: 55000, hasVariables: false, stock: 93, category: "Moda", attributes: "", warehouses: ["Bodega Principal"], image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400", warranties: [{ type: "Producto roto", days: 15, description: "Garantía si la hebilla llega defectuosa" }] },
];

const PROVIDERS: Provider[] = [
  { id: 1, name: "America Imports", products: 48, categories: "Tecnología, Hogar, Accesorios", image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=150", icon: "crown", rating: "Estable", description: "Buen rendimiento", dispatch: "2 Horas", type: "premium", city: "bogota", isFavorite: true },
  { id: 2, name: "Gold Stone", products: 32, categories: "Moda, Hogar", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150", icon: "star", rating: "Excelente", description: "Vendedor destacado", dispatch: "1 Hora", type: "verificado", city: "medellin", isFavorite: false },
  { id: 3, name: "CarBlock", products: 21, categories: "Auto", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=150", icon: "check", rating: "Estable", description: "Envíos regulares", dispatch: "4 Horas", type: "exclusivo", city: "cali", isFavorite: true },
  { id: 4, name: "Inspiranova", products: 65, categories: "Hogar", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150", icon: null, rating: "Bueno", description: "Ventas recurrentes", dispatch: "12 Horas", type: "no_verificado", city: "barranquilla", isFavorite: false },
  { id: 5, name: "TechNova", products: 120, categories: "Tecnología", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150", icon: "crown", rating: "Excelente", description: "Líder en tecnología", dispatch: "24 Horas", type: "premium", city: "bogota", isFavorite: true },
  { id: 6, name: "Fashion Store", products: 85, categories: "Moda, Accesorios", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=150", icon: "star", rating: "Estable", description: "Gran variedad de prendas", dispatch: "2 Horas", type: "verificado", city: "medellin", isFavorite: false },
];

function CreateComboModal({ isOpen, onClose, onAddCombo, onEditCombo, editCombo }: {
  isOpen: boolean; onClose: () => void;
  onAddCombo: (c: Combo) => void;
  onEditCombo: (c: Combo) => void;
  editCombo: Combo | null;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<CatalogProduct[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [comboName, setComboName] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [comboImages, setComboImages] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);

  useEffect(() => {
    if (isOpen && editCombo?.richData) {
      setCurrentStep(2);
      setSelectedProvider(editCombo.richData.selectedProvider);
      setSelectedProducts(editCombo.richData.selectedProducts || []);
      setComboName(editCombo.richData.comboName || "");
      setComboDescription(editCombo.richData.comboDescription || "");
      setComboImages(editCombo.richData.comboImages || []);
    } else if (isOpen && !editCombo) {
      setCurrentStep(1); setSelectedProvider(null); setSelectedProducts([]);
      setComboName(""); setComboDescription(""); setComboImages([]);
    }
  }, [isOpen, editCombo]);

  const filteredProviders = useMemo(() => PROVIDERS.filter((p) => {
    if (filterFavorite && !p.isFavorite) return false;
    if (filterType && p.type !== filterType) return false;
    return true;
  }), [filterFavorite, filterType]);

  const comboVariants: VariantEntry[][] = useMemo(() => {
    const variableProds = selectedProducts.filter((p) => p.hasVariables);
    if (variableProds.length === 0) return [];
    const productVariantsList = variableProds.map((p) => {
      if (!p.attributes) return [{ productId: p.id, productName: p.name, attributes: {} }];
      const parts = p.attributes.split("|").map((s) => s.trim());
      const keys: string[] = []; const valuesList: string[][] = [];
      parts.forEach((part) => { const [key, valStr] = part.split(":").map((s) => s.trim()); if (key && valStr) { keys.push(key); valuesList.push(valStr.split(",").map((s) => s.trim())); } });
      if (keys.length === 0) return [{ productId: p.id, productName: p.name, attributes: {} }];
      let combos: Record<string, string>[] = [{}];
      for (let i = 0; i < keys.length; i++) { const newCombos: Record<string, string>[] = []; for (const combo of combos) { for (const val of valuesList[i]) { newCombos.push({ ...combo, [keys[i]]: val }); } } combos = newCombos; }
      return combos.map((attrObj) => ({ productId: p.id, productName: p.name, attributes: attrObj }));
    });
    let variants: VariantEntry[][] = [[]];
    for (const variantsList of productVariantsList) { const newCombos: VariantEntry[][] = []; for (const combo of variants) { for (const variant of variantsList) { newCombos.push([...combo, variant]); } } variants = newCombos; }
    return variants;
  }, [selectedProducts]);

  if (!isOpen) return null;

  const getIntersection = (products: CatalogProduct[]): string[] => {
    if (products.length === 0) return [];
    let intersection = [...products[0].warehouses];
    for (let i = 1; i < products.length; i++) { intersection = intersection.filter((w) => products[i].warehouses.includes(w)); }
    return intersection;
  };

  const totalItems = selectedProducts.reduce((acc, p) => acc + (p.quantity || 1), 0);
  const variableItems = selectedProducts.filter((p) => p.hasVariables).reduce((acc, p) => acc + (p.quantity || 1), 0);
  const totalCost = selectedProducts.reduce((acc, p) => acc + p.cost * (p.quantity || 1), 0);
  const totalSuggested = selectedProducts.reduce((acc, p) => acc + p.suggestedPrice * (p.quantity || 1), 0);
  const minStock = selectedProducts.length > 0 ? Math.min(...selectedProducts.map((p) => p.stock)) : 0;
  const currentWarehouses = getIntersection(selectedProducts);

  const displayedProducts = CATALOG_PRODUCTS.filter((p) => {
    if (currentWarehouses.length === 0) return true;
    return p.warehouses.some((w) => currentWarehouses.includes(w));
  });

  const triggerSkeletonIfNeeded = (oldArr: CatalogProduct[], newArr: CatalogProduct[]) => {
    const oldW = getIntersection(oldArr); const newW = getIntersection(newArr);
    if (oldW.join(",") !== newW.join(",")) { setIsLoadingProducts(true); setTimeout(() => setIsLoadingProducts(false), 500); }
  };

  const handleAddProduct = (product: CatalogProduct) => {
    if (totalItems >= 5) { setAlertMsg("Máximo 5 productos por combo."); return; }
    if (product.hasVariables && variableItems >= 2) { setAlertMsg("Máximo 2 productos con variables."); return; }
    const newSelection = [...selectedProducts, { ...product, quantity: 1 }];
    triggerSkeletonIfNeeded(selectedProducts, newSelection);
    setSelectedProducts(newSelection);
  };

  const handleUpdateQuantity = (product: CatalogProduct, delta: number) => {
    if (delta > 0 && totalItems >= 5) { setAlertMsg("Máximo 5 productos."); return; }
    setSelectedProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + delta } : p));
  };

  const handleRemoveProduct = (productId: number) => {
    const newSelection = selectedProducts.filter((p) => p.id !== productId);
    triggerSkeletonIfNeeded(selectedProducts, newSelection);
    setSelectedProducts(newSelection);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, 3 - comboImages.length).map((file) => URL.createObjectURL(file));
    setComboImages((prev) => [...prev, ...newImages]);
  };

  const handleClose = () => {
    setCurrentStep(1); setSelectedProvider(null); setSelectedProducts([]);
    setComboName(""); setComboDescription(""); setComboImages([]);
    setIsDrawerOpen(false); setAlertMsg(null); setFilterType(""); setFilterFavorite(false);
    onClose();
  };

  const previewData: RichData = {
    comboName, comboDescription, comboImages, selectedProducts, comboVariants,
    selectedProvider, selectedWarehouse: { name: currentWarehouses.join(", ") || "Sin asignar", city: "" },
    minStock, totalCost, totalSuggested,
  };

  const buildComboObj = (id: number, status: "Activo" | "Inactivo" = "Activo"): Combo => ({
    id, title: comboName, description: comboDescription, productsCount: selectedProducts.length,
    stock: minStock, provider: selectedProvider?.name || "", warehouse: currentWarehouses.join(", "),
    cost: totalCost, suggestedPrice: totalSuggested, status,
    image: comboImages[0] || selectedProducts[0]?.image || "",
    richData: previewData,
  });

  const STEPS = ["Elegir proveedor", "Agregar productos", "Personalizar combo", "Garantías", "Previsualizar"];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
        <h2 className="text-lg font-bold text-[#1e3a5f]">{editCombo ? "Editar combo" : "Crear combo"}</h2>
        <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Step sidebar */}
        <div className="w-64 bg-white border-r border-slate-100 p-8 flex flex-col gap-6 shrink-0 overflow-y-auto">
          {STEPS.map((label, idx) => {
            const step = idx + 1;
            const done = currentStep > step; const active = currentStep === step;
            return (
              <div key={step} className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${done ? "bg-emerald-500 text-white" : active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {done ? <Check size={14} strokeWidth={3} /> : step}
                </div>
                <span className={`text-sm ${active || done ? "font-bold text-slate-800" : "font-medium text-slate-500"}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className={`flex-1 overflow-y-auto bg-slate-50/30 ${currentStep === 5 ? "p-0 bg-white" : "p-8"}`}>

          {/* Step 1: Provider */}
          {currentStep === 1 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-medium text-[#1e3a5f] mb-2">Seleccionar proveedor</h3>
              <p className="text-[13px] text-slate-500 mb-6">Todos los productos del combo deben pertenecer al mismo proveedor.</p>

              <div className="border border-slate-200 rounded-xl p-4 mb-6 bg-white shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Heart size={16} className={`stroke-[2.5] ${filterFavorite ? "text-[#ff7b00] fill-[#ff7b00]" : "text-slate-400"}`} />
                  <span className={`text-[13px] font-medium ${filterFavorite ? "text-[#ff7b00]" : "text-slate-700"}`}>Favoritos</span>
                  <div onClick={() => setFilterFavorite(!filterFavorite)} className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${filterFavorite ? "bg-[#ff7b00]" : "bg-slate-200"}`}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${filterFavorite ? "left-[18px]" : "left-0.5"}`}></div>
                  </div>
                </div>
                <div className="relative">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-[13px] text-slate-600 focus:outline-none focus:border-[#ff7b00] bg-white cursor-pointer">
                    <option value="">Tipo de proveedor</option>
                    <option value="verificado">Verificados</option>
                    <option value="premium">Premium</option>
                    <option value="exclusivo">Exclusivos</option>
                    <option value="no_verificado">No verificados</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} onClick={() => setSelectedProvider(provider)}
                    className={`w-[180px] border rounded-xl p-4 flex flex-col items-center relative cursor-pointer transition-colors shadow-sm bg-white ${selectedProvider?.name === provider.name ? "border-[#ff7b00] bg-orange-50/20 ring-1 ring-[#ff7b00]" : "border-slate-200 hover:border-orange-300"}`}>
                    {provider.icon === "crown" && <div className="absolute top-2 left-2 w-5 h-5 bg-black rounded-full flex items-center justify-center"><Crown size={10} className="text-white" /></div>}
                    {provider.icon === "star" && <div className="absolute top-2 left-2 w-5 h-5 bg-[#ff7b00] rounded-full flex items-center justify-center"><Star size={10} className="text-white" fill="white" /></div>}
                    {provider.icon === "check" && <div className="absolute top-2 left-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></div>}
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                      <img src={provider.image} className="w-full h-full object-cover" alt={provider.name} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-[13px] text-center leading-tight">{provider.name}</h4>
                    <p className="text-[11px] font-medium text-slate-500">{provider.products} Productos</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Products */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-medium text-[#1e3a5f]">Productos del combo</h3>
                <button onClick={() => setIsDrawerOpen(true)} className="text-[#ff7b00] hover:text-[#e06c00] font-bold flex items-center gap-2 text-[14px] transition-colors">
                  <Plus size={18} strokeWidth={2.5} /> Agregar producto
                </button>
              </div>
              <p className="text-[13px] text-slate-500 mb-6">Agrega entre 2 y 5 productos. Máximo 2 con variantes. Deben compartir bodega.</p>
              {alertMsg && <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl text-[13px] text-orange-700 font-medium flex items-center justify-between"><span>{alertMsg}</span><button onClick={() => setAlertMsg(null)}><X size={16} /></button></div>}
              {selectedProducts.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center bg-slate-50/50">
                  <p className="text-[13px] text-slate-500">Aún no has agregado productos.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product) => {
                    const isDeleted = product.deleted; const isOutOfStock = product.stock === 0 && !isDeleted;
                    const qty = product.quantity || 1;
                    return (
                      <div key={product.id} className={`flex border-2 rounded-2xl overflow-hidden relative flex-row items-stretch ${isDeleted ? "border-rose-400 bg-rose-50/30" : isOutOfStock ? "border-orange-400 bg-orange-50/30" : "border-slate-100 bg-white"}`}>
                        <div className="w-40 shrink-0 border-r border-slate-100 bg-slate-50 flex items-stretch">
                          <img src={product.image} alt={product.name} className="w-full object-cover" />
                        </div>
                        <div className="p-5 flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-[16px] truncate pr-8">{product.name}</h4>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-full px-1 py-1 bg-white shadow-sm shrink-0">
                              <button onClick={() => handleUpdateQuantity(product, -1)} disabled={qty <= 1}
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${qty <= 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100"}`}>-</button>
                              <span className="font-bold text-[14px] w-4 text-center text-slate-800">{qty}</span>
                              <button onClick={() => handleUpdateQuantity(product, 1)} className="w-7 h-7 rounded-full flex items-center justify-center text-[#ff7b00] hover:bg-orange-50 border border-orange-200 transition-colors">+</button>
                            </div>
                          </div>
                          <div className="flex gap-6 mb-2">
                            <div><p className="text-[11px] text-slate-400">Precio proveedor</p><p className="font-bold text-slate-800">${product.cost.toLocaleString()}</p></div>
                            <div><p className="text-[11px] text-slate-400">Stock</p><p className="font-bold text-[#00a896]">{product.stock}</p></div>
                          </div>
                          <button onClick={() => handleRemoveProduct(product.id)} className="absolute bottom-4 right-4 flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors text-[12px] font-medium">
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customize */}
          {currentStep === 3 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-medium text-[#1e3a5f] mb-2">Personalizar combo</h3>
              <p className="text-[13px] text-slate-500 mb-6">Ingresa los detalles finales de tu combo.</p>
              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="mb-5">
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Nombre del combo</label>
                  <input type="text" value={comboName} onChange={(e) => setComboName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="Ej: Kit Hogar Perfecto" />
                </div>
                <div className="mb-5">
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Descripción comercial</label>
                  <textarea value={comboDescription} onChange={(e) => setComboDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 min-h-[100px] resize-y"
                    placeholder="Describe los beneficios de este combo..." />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[13px] font-bold text-slate-700">Imágenes del combo</label>
                    <span className="text-[11px] text-slate-500">{comboImages.length}/3 agregadas</span>
                  </div>
                  <div className="flex gap-4">
                    {comboImages.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm group bg-slate-50 shrink-0">
                        <img src={img} className="w-full h-full object-cover" alt={`Combo ${idx + 1}`} />
                        <button onClick={() => setComboImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {comboImages.length < 3 && (
                      <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all shrink-0">
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-[10px] font-medium">Agregar</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Warranties */}
          {currentStep === 4 && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Garantías</h3>
              <p className="text-[13px] text-slate-500 mb-6">Las garantías se heredan de cada producto. No se pueden modificar aquí.</p>
              <div className="space-y-4">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center gap-4 p-4 border-b border-slate-100">
                      <div className="w-14 h-14 rounded bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-700">{product.name}</h4>
                    </div>
                    <div className="flex flex-col">
                      {product.warranties && product.warranties.length > 0
                        ? product.warranties.map((w, i) => <WarrantyAccordion key={i} title={w.type} days={w.days} description={w.description} />)
                        : <div className="p-4 text-sm text-slate-500">Sin garantías configuradas.</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {currentStep === 5 && <ComboPreviewUI data={previewData} />}
        </div>

        {/* Right summary panel */}
        {currentStep < 5 && (
          <div className="w-[280px] bg-[#f8fafc] border-l border-slate-200 p-6 flex flex-col shrink-0">
            <span className="text-[11px] font-bold text-slate-500 tracking-wide mb-4">RESUMEN</span>
            <div className="bg-slate-100/80 rounded-2xl h-36 mb-4 flex items-center justify-center border border-slate-200 border-dashed overflow-hidden shadow-sm">
              {comboImages.length > 0
                ? <img src={comboImages[0]} className="w-full h-full object-cover rounded-2xl" alt="Combo" />
                : <ImageIcon size={36} className="text-slate-300 stroke-[1.5]" />
              }
            </div>
            <h4 className="font-bold text-[#1e3a5f] text-[15px] mb-1">{comboName || "Nombre del combo"}</h4>
            <p className="text-[12px] text-slate-400 mb-3">{selectedProducts.length} productos • {totalItems} unidades</p>
            {selectedProducts.length > 0 && <div className="font-bold text-[#ff7b00] text-[18px] mb-5">${totalSuggested.toLocaleString()}</div>}
            <div className="flex flex-col border border-slate-200 rounded-2xl bg-white shadow-sm mb-3">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2"><Store size={14} className="text-orange-400" /><span className="text-[12px] text-slate-500">Proveedor</span></div>
                <span className={`text-[12px] ${selectedProvider ? "font-bold text-[#1e3a5f]" : "text-slate-300"}`}>{selectedProvider ? selectedProvider.name : "--"}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2"><Warehouse size={14} className="text-orange-400" /><span className="text-[12px] text-slate-500">Bodegas</span></div>
                <span className={`text-[12px] ${currentWarehouses.length > 0 ? "font-bold text-[#1e3a5f]" : "text-slate-300"}`}>{currentWarehouses.length > 0 ? currentWarehouses.join(", ") : "Sin asignar"}</span>
              </div>
            </div>
            <div className="flex flex-col border border-slate-200 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100"><span className="text-[12px] text-slate-500">Costo total</span><span className="text-[13px] font-bold text-[#1e3a5f]">${totalCost.toLocaleString()}</span></div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100"><span className="text-[12px] text-slate-500">Precio sugerido</span><span className="text-[13px] font-bold text-[#ff7b00]">${totalSuggested.toLocaleString()}</span></div>
              <div className="flex items-center justify-between px-4 py-3"><span className="text-[12px] text-slate-500">Stock combo</span><span className="text-[13px] font-bold text-[#00a896]">{minStock} uds.</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="h-20 border-t border-slate-200 bg-white flex items-center justify-end px-6 shrink-0 z-40">
        <div className="flex gap-3">
          {currentStep === 1
            ? <button onClick={handleClose} className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">Cancelar</button>
            : <button onClick={() => setCurrentStep((prev) => prev - 1)} className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">Atrás</button>
          }
          <button
            disabled={(currentStep === 1 && !selectedProvider) || (currentStep === 2 && selectedProducts.length < 2) || (currentStep === 3 && (!comboName.trim() || !comboDescription.trim() || comboImages.length === 0))}
            onClick={() => {
              if (currentStep === 1 && selectedProvider) { setCurrentStep(2); if (selectedProducts.length === 0) setIsDrawerOpen(true); }
              else if (currentStep === 2 && selectedProducts.length >= 2) setCurrentStep(3);
              else if (currentStep === 3 && comboName.trim() && comboDescription.trim() && comboImages.length > 0) setCurrentStep(4);
              else if (currentStep === 4) setCurrentStep(5);
              else if (currentStep === 5) { editCombo ? setIsConfirmEditOpen(true) : (onAddCombo(buildComboObj(Date.now())), handleClose()); }
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors text-white ${((currentStep === 1 && !selectedProvider) || (currentStep === 2 && selectedProducts.length < 2) || (currentStep === 3 && (!comboName.trim() || !comboDescription.trim() || comboImages.length === 0))) ? "bg-[#ff7b00] opacity-50 cursor-not-allowed" : "bg-[#ff7b00] hover:bg-[#e06c00]"}`}>
            {currentStep === 5 ? (editCombo ? "Guardar" : "Crear") : "Siguiente"}
          </button>
        </div>
      </div>

      {/* Confirm edit modal */}
      <ConfirmModal isOpen={isConfirmEditOpen} title="Guardar cambios"
        message={`¿Guardar los cambios en "${comboName}"?`}
        confirmText="Sí, guardar" confirmColorClass="bg-orange-500 hover:bg-orange-600"
        onCancel={() => setIsConfirmEditOpen(false)}
        onConfirm={() => { onEditCombo(buildComboObj(editCombo!.id, editCombo!.status)); setIsConfirmEditOpen(false); handleClose(); }} />

      {/* Product drawer backdrop */}
      {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-[55]" onClick={() => setIsDrawerOpen(false)} />}

      {/* Product drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-[720px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[60] transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0 bg-white">
          <h3 className="font-bold text-[#1e3a5f] text-lg">Agregar productos</h3>
          <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex gap-6 text-[12px] text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${totalItems >= 2 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>{totalItems >= 2 ? <Check size={12} strokeWidth={3} /> : "2"}</div>
            <span className={totalItems >= 2 ? "text-emerald-500 font-medium" : ""}>Mín. 2</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-2">
            <div className="px-2 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center text-[10px] font-bold">{totalItems}/5</div>
            <span>Máx. 5</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-2">
            <div className={`px-2 h-5 rounded-full flex items-center text-[10px] font-bold ${variableItems > 0 ? "bg-[#ff7b00] text-white" : "bg-slate-200 text-slate-500"}`}>{variableItems}/2</div>
            <span className={variableItems > 0 ? "text-[#ff7b00] font-medium" : ""}>Con variables</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 md:grid-cols-3 gap-4 content-start pb-[230px]">
          {isLoadingProducts
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[300px] bg-slate-200 rounded-2xl animate-pulse" />)
            : displayedProducts.map((product) => {
              const selectedData = selectedProducts.find((p) => p.id === product.id);
              const isSelected = !!selectedData;
              return (
                <div key={product.id} className={`bg-white border rounded-[16px] flex flex-col transition-shadow ${isSelected ? "border-[#ff7b00] ring-1 ring-[#ff7b00]" : "border-slate-200 hover:shadow-md"}`}>
                  <div className="relative h-[150px] bg-slate-100 rounded-t-[15px] overflow-hidden shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.hasVariables && <span className="absolute top-2 left-2 bg-[#ff7b00] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">Variable</span>}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{product.category}</span>
                      <span className="text-slate-500">Stock: <span className="text-emerald-500 font-bold">{product.stock}</span></span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-[14px] mb-3 leading-snug">{product.name}</h4>
                    <div className="flex justify-between items-end mb-3">
                      <div><span className="text-[10px] text-slate-400">Costo</span><p className="font-bold text-slate-800 text-[13px]">${product.cost.toLocaleString()}</p></div>
                      <div className="text-right"><span className="text-[10px] text-slate-400">Sugerido</span><p className="font-bold text-slate-800 text-[13px]">${product.suggestedPrice.toLocaleString()}</p></div>
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-2 h-[38px]">
                        <button onClick={() => handleRemoveProduct(product.id)} className="w-[38px] h-[38px] flex items-center justify-center text-slate-400 border border-slate-200 rounded-lg hover:bg-slate-50"><Trash2 size={16} /></button>
                        <div className="flex-1 h-[38px] flex items-center border border-slate-200 rounded-lg overflow-hidden">
                          <button onClick={() => handleUpdateQuantity(product, -1)} disabled={(selectedData?.quantity || 1) <= 1}
                            className={`w-9 h-full flex items-center justify-center border-r border-slate-200 ${(selectedData?.quantity || 1) <= 1 ? "text-slate-300 cursor-not-allowed bg-slate-50" : "text-slate-500 hover:bg-slate-50"}`}>-</button>
                          <div className="flex-1 flex items-center justify-center font-bold text-[14px] text-slate-800">{selectedData?.quantity || 1}</div>
                          <button onClick={() => handleUpdateQuantity(product, 1)} className="w-9 h-full flex items-center justify-center text-[#ff7b00] border-l border-slate-200 hover:bg-orange-50">+</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => handleAddProduct(product)} className="w-full py-1.5 flex items-center justify-center gap-2 text-[13px] font-bold text-[#ff7b00] hover:text-[#e06c00] transition-colors">
                        <ShoppingCart size={16} /> Agregar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          }
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-5 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] z-10">
          <p className="text-[13px] text-[#1e3a5f] font-bold mb-3">Productos ({totalItems}/5)</p>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={i}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all relative ${i < selectedProducts.length ? "border-[#ff7b00] p-[2px] bg-white shadow-sm" : "border-slate-200 border-dashed bg-slate-50/50"}`}>
                  {i < selectedProducts.length ? (
                    <><img src={selectedProducts[i].image} className="w-full h-full object-cover rounded-[8px]" alt="" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-[16px] h-[16px] bg-[#ff7b00] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white">{selectedProducts[i].quantity || 1}</div></>
                  ) : <Package size={18} className="text-slate-300 stroke-[1.5]" />}
                </div>
                {i < 4 && <span className="text-slate-200 font-bold">+</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3 border border-[#ff7b00] text-[#ff7b00] rounded-xl font-bold hover:bg-orange-50 transition-colors">Cancelar</button>
            <button onClick={() => setIsDrawerOpen(false)} disabled={totalItems < 2}
              className={`flex-1 py-3 text-white rounded-xl font-bold transition-colors ${totalItems < 2 ? "bg-[#ff7b00] opacity-50 cursor-not-allowed" : "bg-[#ff7b00] hover:bg-[#e06c00]"}`}>
              Agregar {totalItems > 0 && `(${totalItems})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

const INITIAL_COMBOS: Combo[] = [
  { id: 1, title: "Pack Hogar Esencial", productsCount: 2, stock: 14, description: "Productos de uso diario para tu cocina y hogar", provider: "America Imports", warehouse: "Bodega Principal, Bodega Sur", cost: 87000, suggestedPrice: 184000, status: "Activo", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400", richData: { comboName: "Pack Hogar Esencial", comboDescription: "Lleva este increíble pack con todo lo necesario para iniciar tu hogar.", comboImages: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400"], selectedProducts: [{ id: 102, name: "Sartén antiadherente 28cm", cost: 45000, suggestedPrice: 95000, hasVariables: true, stock: 98, category: "Hogar", attributes: "Color: Rojo, Negro, Menta", warehouses: ["Bodega Principal"], image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400", quantity: 1, warranties: [{ type: "Mal funcionamiento", days: 15, description: "Garantía en caso de pérdida prematura de adherencia" }] }, { id: 103, name: "Cafetera prensa francesa 600ml", cost: 42000, suggestedPrice: 89000, hasVariables: true, stock: 14, category: "Hogar", attributes: "Color: Cobre, Acero inox, Negro", warehouses: ["Bodega Principal", "Bodega Sur"], image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400", quantity: 1, warranties: [{ type: "Producto roto", days: 10, description: "Si el cristal llega roto" }] }], comboVariants: [[{ productName: "Sartén antiadherente", attributes: { Color: "Rojo" } }, { productName: "Cafetera prensa", attributes: { Color: "Cobre" } }]], selectedProvider: { name: "America Imports", icon: "crown", rating: "Estable", description: "Buen rendimiento", dispatch: "2 Horas" }, selectedWarehouse: { name: "Bodega Principal", city: "" }, minStock: 14, totalCost: 87000, totalSuggested: 184000 } },
  { id: 2, title: "Kit Básico Funcional", productsCount: 2, stock: 93, description: "Lo esencial para el día a día.", provider: "Inspiranova", warehouse: "Bodega Principal", cost: 63000, suggestedPrice: 134000, status: "Activo", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400", richData: { comboName: "Kit Básico Funcional", comboDescription: "La combinación perfecta de utilidad y estilo.", comboImages: ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400"], selectedProducts: [{ id: 101, name: "Set utensilios cocina 6 pzas", cost: 38000, suggestedPrice: 79000, hasVariables: false, stock: 150, category: "Hogar", attributes: "", warehouses: ["Bodega Principal", "Bodega Sur"], image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400", quantity: 1 }, { id: 106, name: "Cinturón de cuero genuino", cost: 25000, suggestedPrice: 55000, hasVariables: false, stock: 93, category: "Moda", attributes: "", warehouses: ["Bodega Principal"], image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400", quantity: 1 }], comboVariants: [], selectedProvider: { name: "Inspiranova", icon: null, rating: "Bueno", description: "Ventas recurrentes", dispatch: "12 Horas" }, selectedWarehouse: { name: "Bodega Principal", city: "" }, minStock: 93, totalCost: 63000, totalSuggested: 134000 } },
  { id: 3, title: "Kit Moda Urbana", productsCount: 2, stock: 0, description: "Look completo para el día a día.", provider: "Gold Stone", warehouse: "Bodega Sur", cost: 76000, suggestedPrice: 161000, status: "Inactivo", warning: { type: "warning", text: 'El producto "Jean slim fit clásico" se quedó sin stock.' }, image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400", richData: { comboName: "Kit Moda Urbana", comboDescription: "El outfit para conquistar la ciudad.", comboImages: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400"], selectedProducts: [{ id: 104, name: "Gorra snapback ajustable", cost: 18000, suggestedPrice: 42000, hasVariables: true, stock: 145, category: "Moda", attributes: "Color: Negro, Gris, Azul", warehouses: ["Bodega Sur"], image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", quantity: 1 }, { id: 105, name: "Jean slim fit clásico", cost: 58000, suggestedPrice: 119000, hasVariables: true, stock: 0, category: "Moda", attributes: "Color: Azul oscuro | Talla: 30, 32", warehouses: ["Bodega Centro", "Bodega Principal"], image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400", quantity: 1 }], comboVariants: [[{ productName: "Gorra snapback", attributes: { Color: "Negro" } }, { productName: "Jean slim fit", attributes: { Talla: "30" } }]], selectedProvider: { name: "Gold Stone", icon: "star", rating: "Excelente", description: "Vendedor destacado", dispatch: "1 Hora" }, selectedWarehouse: { name: "Bodega Sur", city: "" }, minStock: 0, totalCost: 76000, totalSuggested: 161000, warning: { type: "warning", text: 'El "Jean slim fit clásico" se quedó sin stock. Reemplázalo para activar el combo.' } } },
  { id: 4, title: "Pack Supervivencia Matutina", productsCount: 2, stock: 0, description: "Lo que necesitas para arrancar tus mañanas.", provider: "America Imports", warehouse: "Bodega Centro", cost: 42000, suggestedPrice: 89000, status: "Inactivo", warning: { type: "error", text: "Producto eliminado del proveedor." }, image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400", richData: { comboName: "Pack Supervivencia Matutina", comboDescription: "Despierta de la mejor manera.", comboImages: ["https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400"], selectedProducts: [{ id: 103, name: "Cafetera prensa francesa 600ml", cost: 42000, suggestedPrice: 89000, hasVariables: true, stock: 14, category: "Hogar", attributes: "Color: Cobre, Acero inox, Negro", warehouses: ["Bodega Sur", "Bodega Centro"], image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400", quantity: 1 }, { id: 999, name: "Termo de acero inoxidable", cost: 0, suggestedPrice: 0, hasVariables: false, stock: 0, category: "Hogar", attributes: "", warehouses: ["Bodega Centro"], image: "https://via.placeholder.com/400x300?text=Eliminado", quantity: 1, deleted: true }], comboVariants: [], selectedProvider: { name: "America Imports", icon: "crown", rating: "Estable", description: "Buen rendimiento", dispatch: "2 Horas" }, selectedWarehouse: { name: "Bodega Centro", city: "" }, minStock: 0, totalCost: 42000, totalSuggested: 89000, warning: { type: "error", text: '"Termo de acero inoxidable" fue eliminado del catálogo. Reemplázalo para volver a vender el combo.' } } },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CombosPage() {
  const [combosData, setCombosData] = useState<Combo[]>(INITIAL_COMBOS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingCombo, setViewingCombo] = useState<Combo | null>(null);
  const [comboToEdit, setComboToEdit] = useState<Combo | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; combo: Combo | null }>({ isOpen: false, combo: null });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [searchComboQuery, setSearchComboQuery] = useState("");
  const [appliedComboFilters, setAppliedComboFilters] = useState({ status: "", provider: "", query: "" });
  const [isGarantiaModalOpen, setIsGarantiaModalOpen] = useState(false);
  const [availableGarantiaProducts, setAvailableGarantiaProducts] = useState<Array<{ id: number; name: string; qty: number }>>([]);

  const uniqueProviders = [...new Set(combosData.map((c) => c.provider))];

  const filteredCombosData = combosData.filter((combo) => {
    if (appliedComboFilters.status && combo.status !== appliedComboFilters.status) return false;
    if (appliedComboFilters.provider && combo.provider !== appliedComboFilters.provider) return false;
    if (appliedComboFilters.query) {
      const q = appliedComboFilters.query.toLowerCase();
      if (!combo.title.toLowerCase().includes(q) && !combo.id.toString().includes(q)) return false;
    }
    return true;
  });

  const handleEditComboClick = (combo: Combo) => { setComboToEdit(combo); setIsCreateModalOpen(true); };
  const handleDeleteComboClick = (combo: Combo) => setConfirmDialog({ isOpen: true, combo });
  const executeDelete = () => { if (confirmDialog.combo) setCombosData(combosData.filter((c) => c.id !== confirmDialog.combo!.id)); setConfirmDialog({ isOpen: false, combo: null }); };

  if (viewingCombo) {
    return (
      <div className="-m-6">
        <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex items-center gap-4 shadow-sm">
          <button onClick={() => setViewingCombo(null)} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-[#1e3a5f]">Detalles del combo</h2>
        </div>
        {viewingCombo.richData
          ? <ComboPreviewUI data={viewingCombo.richData} />
          : <div className="p-12 text-center text-slate-500"><AlertTriangle size={48} className="mx-auto mb-4 text-orange-300" /><p>Este combo no tiene detalles avanzados.</p></div>
        }
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1 uppercase tracking-wider">
            <span>Productos</span><span>/</span><span className="text-slate-600">Combos</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mis combos</h1>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#ff7b00] hover:bg-[#e06c00] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-orange-200/50 self-start">
          <Plus size={20} /> Crear combo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 w-full">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 h-[38px] text-[13px] text-slate-600 focus:outline-none focus:border-[#ff7b00] bg-white cursor-pointer">
              <option value="">Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-2 h-[38px] text-[13px] text-slate-600 focus:outline-none focus:border-[#ff7b00] bg-white cursor-pointer">
              <option value="">Proveedor</option>
              {uniqueProviders.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => setAppliedComboFilters({ status: filterStatus, provider: filterProvider, query: searchComboQuery })}
            className="bg-[#ff7b00] hover:bg-[#e06c00] transition-colors text-white w-[38px] h-[38px] flex items-center justify-center rounded-lg shadow-sm">
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          {(appliedComboFilters.status || appliedComboFilters.provider || appliedComboFilters.query) && (
            <button onClick={() => { setFilterStatus(""); setFilterProvider(""); setSearchComboQuery(""); setAppliedComboFilters({ status: "", provider: "", query: "" }); }}
              className="text-[#ff7b00] text-[13px] font-bold hover:underline">Limpiar</button>
          )}
        </div>
        <div className="relative w-full lg:w-72 max-w-[250px]">
          <input type="text" value={searchComboQuery} onChange={(e) => setSearchComboQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setAppliedComboFilters((prev) => ({ ...prev, query: searchComboQuery })); }}
            placeholder="Buscar combo (Enter)..." className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2 h-[38px] text-[13px] text-slate-600 focus:outline-none focus:border-[#ff7b00] bg-white shadow-sm" />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>
      </div>

      {/* Grid */}
      {filteredCombosData.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center text-center bg-slate-50/50">
          <Search size={40} className="text-slate-300 mb-3" />
          <p className="text-[15px] font-bold text-slate-600 mb-1">No hay combos</p>
          <p className="text-[13px] text-slate-500">Crea tu primer combo o ajusta los filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCombosData.map((combo) => (
            <ComboCard key={combo.id} combo={combo} onClick={() => setViewingCombo(combo)}
              onEditClick={handleEditComboClick} onDeleteClick={handleDeleteComboClick} />
          ))}
        </div>
      )}

      {/* Modals */}
      <ConfirmModal isOpen={confirmDialog.isOpen} title="Eliminar combo"
        message={`¿Eliminar "${confirmDialog.combo?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar" confirmColorClass="bg-rose-500 hover:bg-rose-600"
        onCancel={() => setConfirmDialog({ isOpen: false, combo: null })}
        onConfirm={executeDelete} />

      <CreateComboModal isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setComboToEdit(null); }}
        onAddCombo={(c) => setCombosData([c, ...combosData])}
        onEditCombo={(c) => setCombosData(combosData.map((x) => (x.id === c.id ? c : x)))}
        editCombo={comboToEdit} />

      <CreateGarantiaModal isOpen={isGarantiaModalOpen} onClose={() => setIsGarantiaModalOpen(false)} availableProducts={availableGarantiaProducts} />
    </div>
  );
}
