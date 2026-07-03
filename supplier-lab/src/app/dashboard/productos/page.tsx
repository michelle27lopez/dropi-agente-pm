"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Download, FileSpreadsheet, X, Check, CheckSquare,
  Square, ChevronLeft, ChevronRight, Package, Info, Share, Save,
  Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, CircleDot, Circle, Trash, AlertTriangle, Bot, ChevronDown, User, ShoppingCart, FileText, Trash2, File
} from "lucide-react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { ProductCreateWizard } from "@/components/ProductCreateWizard";
import { CategoryPickerIA, type CategoriaSeleccionada } from "@/components/CategoryPickerIA";

type ViewMode = "list" | "select_type" | "create_form";

// ─── Mock product list (fiel a Dropi) ─────────────────────────────────────────

const MOCK_PRODUCTS = [
  { id: 2088171, name: "Bateria Portatil Solar",      type: "VARIABLE", stock: 73,  cost: 65000,  suggested: 85000,  date: "18/02", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=80&auto=format&fit=crop", approved: true,  private: false },
  { id: 2088170, name: "Cable Red Ethernet 5 Metros", type: "SIMPLE",   stock: 150, cost: 15000,  suggested: 20000,  date: "18/02", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&auto=format&fit=crop", approved: true,  private: false },
  { id: 2149593, name: "Combo simple",                type: "COMBO",    stock: 100, cost: 35000,  suggested: 40000,  date: "12/05", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&auto=format&fit=crop", approved: false, private: false },
  { id: 2010716, name: "usb c",                       type: "SIMPLE",   stock: 0,   cost: 2000,   suggested: 20000,  date: "28/11", image: null, approved: false, private: false },
  { id: 2151807, name: "como prueba jaime",           type: "COMBO",    stock: 73,  cost: 85000,  suggested: 85000,  date: "15/05", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=80&auto=format&fit=crop", approved: false, private: false },
  { id: 2151821, name: "combo simple 47 stock",       type: "COMBO",    stock: 47,  cost: 19000,  suggested: 25000,  date: "15/05", image: null, approved: false, private: false },
  { id: 2137638, name: "prueba",                      type: "VARIABLE", stock: 12,  cost: 10000,  suggested: 15000,  date: "24/04", image: null, approved: false, private: false },
  { id: 2026631, name: "adaptador usb",               type: "SIMPLE",   stock: 100, cost: 20000,  suggested: 20000,  date: "22/12", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&auto=format&fit=crop", approved: true,  private: false },
  { id: 2147540, name: "Prueba combo",                type: "COMBO",    stock: 6,   cost: 85001,  suggested: 125001, date: "08/05", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&auto=format&fit=crop", approved: false, private: false },
  { id: 2147551, name: "123 Prueba",                  type: "COMBO",    stock: 24,  cost: 139001, suggested: 139001, date: "08/05", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=80&auto=format&fit=crop", approved: false, private: false },
  { id: 2023144, name: "proyector 4k",                type: "SIMPLE",   stock: 0,   cost: 20000,  suggested: 30000,  date: "05/03", image: null, approved: false, private: false },
];

const TYPE_STYLE: Record<string, string> = {
  SIMPLE:   "text-zinc-500",
  VARIABLE: "text-amber-600 font-semibold",
  COMBO:    "text-blue-600 font-semibold",
};

export default function ProductosPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [productAdded, setProductAdded] = useState(false);
  const [isWizard, setIsWizard] = useState(false);
  const [comboCreatedToast, setComboCreatedToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setIsWizard(searchParams.get("variant") === "wizard");
      if (searchParams.get("open") === "create") {
        setViewMode("create_form");
      }
      if (searchParams.get("combo_created") === "1") {
        setComboCreatedToast(true);
        window.history.replaceState({}, "", "/dashboard/productos");
        setTimeout(() => setComboCreatedToast(false), 5000);
      }
    }
  }, []);

  const handleOpenSelectType = () => {
    trackEvent('product_add_clicked');
    setViewMode("select_type");
  };

  const handleSelectNewProduct = () => {
    trackEvent('product_type_selected', { type: 'nuevo' });
    trackEvent('product_creation_started');
    setViewMode("create_form");
  };

  const handleSelectCombo = () => {
    trackEvent('product_type_selected', { type: 'combo' });
    router.push('/dashboard/productos/combo');
  };

  const handleCloseSelectType = () => {
    setViewMode("list");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  const handleProductSaved = () => {
    setProductAdded(true);
    setViewMode("list");
  };

  if (viewMode === "create_form") {
    if (isWizard) {
      return <ProductCreateWizard onBack={handleBackToList} onSaveSuccess={handleProductSaved} />;
    }
    return <ProductCreateForm onBack={handleBackToList} onSaveSuccess={handleProductSaved} />;
  }

  return (
    <div className="flex flex-col gap-6 pb-24 relative">
      <h1 className="text-2xl font-bold text-zinc-800">Productos</h1>

      {/* Overlay "Añadir producto" — fixed para cubrir toda la ventana */}
      {viewMode === "select_type" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-800">Añadir producto</h2>
                <p className="text-sm text-zinc-500 mt-1">Selecciona el tipo de producto</p>
              </div>
              <button onClick={handleCloseSelectType} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-4 bg-zinc-50/50">
              <button
                onClick={handleSelectNewProduct}
                className="w-full bg-white border border-zinc-200 hover:border-[#0ea5e9] hover:bg-sky-50 rounded-xl p-7 flex flex-col items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md group"
              >
                <Package className="w-12 h-12 text-[#0ea5e9] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-[#0ea5e9] text-lg">Nuevo Producto</span>
              </button>
              <button
                onClick={handleSelectCombo}
                className="w-full bg-white border border-zinc-200 hover:border-[#ff7b00] hover:bg-[#fff7f0] rounded-xl p-7 flex flex-col items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md group"
              >
                <svg className="w-12 h-12 text-[#ff7b00] group-hover:scale-110 transition-transform" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="22" width="14" height="14" rx="2"/>
                  <rect x="26" y="22" width="14" height="14" rx="2"/>
                  <rect x="17" y="10" width="14" height="14" rx="2"/>
                </svg>
                <span className="font-bold text-[#ff7b00] text-lg">Combo de productos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col relative">

        {/* Superior Toolbar: Buscador y Filtros Checkbox */}
        <div className="p-4 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="relative w-full max-w-xs flex-shrink-0">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full px-4 py-2 bg-zinc-100 border-transparent rounded-md text-sm focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all placeholder:text-zinc-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <CheckboxFilter label="Productos privados" checked={false} />
            <CheckboxFilter label="Privados y no Privados" checked={true} />
            <CheckboxFilter label="Productos aprobados" checked={false} />
            <CheckboxFilter label="Productos no aprobados" checked={false} />
            <CheckboxFilter label="Aprobados y no aprobados" checked={true} />
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center gap-2">
          <ActionButton onClick={handleOpenSelectType} icon={Plus} label="Agregar" color="bg-[#0ea5e9] hover:bg-sky-600" />
          <ActionButton icon={FileSpreadsheet} label="Descargar en Excel" color="bg-emerald-500 hover:bg-emerald-600" />
          <ActionButton icon={FileSpreadsheet} label="Descargar variaciones en Excel" color="bg-emerald-500 hover:bg-emerald-600" />
          <ActionButton icon={FileSpreadsheet} label="Carga masiva" color="bg-[#f59e0b] hover:bg-amber-600" />
          <ActionButton icon={FileSpreadsheet} label="Actualización Masiva" color="bg-[#f59e0b] hover:bg-amber-600" />
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-zinc-100">
          <button className="px-6 py-3 text-sm font-semibold text-[#0ea5e9] border-b-2 border-[#0ea5e9]">
            Activos
          </button>
          <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors">
            Archivados
          </button>
        </div>

        {/* Secondary Toolbar (Bodega select & actions) */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <select className="w-full sm:w-64 px-3 py-2 border border-zinc-200 rounded-md text-sm text-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white">
            <option>Bodega</option>
          </select>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-sky-300 hover:bg-sky-400 text-white rounded-md text-sm font-medium transition-colors">
              Aplicar garantías
            </button>
            <button className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-md text-sm font-medium transition-colors">
              Archivar Producto
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {/* Añadimos w-max al interior para forzar el scroll horizontal si hay muchas columnas */}
          <div className="min-w-max">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-white text-zinc-700 font-bold border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <div className="w-4 h-4 border border-zinc-300 rounded bg-white"></div>
                  </th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Precio sugerido</th>
                  <th className="px-4 py-3">Creado</th>
                  <th className="px-4 py-3">Bodega</th>
                  <th className="px-4 py-3">Aprobado</th>
                  <th className="px-4 py-3">Privado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {/* Fila del producto/combo recién creado */}
                {(productAdded || comboCreatedToast) && (
                  <tr className="hover:bg-zinc-50 border-b border-zinc-100 bg-orange-50/40 transition-colors">
                    <td className="px-4 py-4"><div className="w-4 h-4 border border-zinc-300 rounded bg-white" /></td>
                    <td className="px-4 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=80&auto=format&fit=crop" alt="" className="w-10 h-10 object-cover rounded-md" />
                        {comboCreatedToast ? "2151900" : "2147232"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{comboCreatedToast ? "Mi nuevo combo" : "jabon"}</td>
                    <td className={`px-4 py-4 ${comboCreatedToast ? TYPE_STYLE["COMBO"] : TYPE_STYLE["SIMPLE"]}`}>{comboCreatedToast ? "COMBO" : "SIMPLE"}</td>
                    <td className="px-4 py-4 text-zinc-600">100</td>
                    <td className="px-4 py-4 text-zinc-600">$ 20.000</td>
                    <td className="px-4 py-4 text-zinc-600">$ 25.000</td>
                    <td className="px-4 py-4 text-zinc-400 text-xs">15/05/2026</td>
                    <td className="px-4 py-4 text-zinc-500 text-xs">Bodega Principal Pruebas</td>
                    <td className="px-4 py-4"><span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NO</span></td>
                    <td className="px-4 py-4"><span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NO</span></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-sky-500 hover:text-sky-600"><User className="w-4 h-4" /></button>
                        <button className="text-emerald-500 hover:text-emerald-600"><ShoppingCart className="w-4 h-4" /></button>
                        <button className="text-amber-500 hover:text-amber-600"><FileText className="w-4 h-4" /></button>
                        <button className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        <button className="text-sky-500 hover:text-sky-600"><File className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )}
                {/* Lista mock de productos */}
                {MOCK_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 border-b border-zinc-100 transition-colors">
                    <td className="px-4 py-4"><div className="w-4 h-4 border border-zinc-300 rounded bg-white" /></td>
                    <td className="px-4 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        {p.image
                          ? <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-md shrink-0" />
                          : <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-zinc-300" /></div>
                        }
                        {p.id}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{p.name}</td>
                    <td className={`px-4 py-4 ${TYPE_STYLE[p.type]}`}>{p.type}</td>
                    <td className={`px-4 py-4 font-medium ${p.stock === 0 ? "text-red-500" : "text-zinc-600"}`}>{p.stock}</td>
                    <td className="px-4 py-4 text-zinc-600">$ {p.cost.toLocaleString("es-CO")}</td>
                    <td className="px-4 py-4 text-zinc-600">$ {p.suggested.toLocaleString("es-CO")}</td>
                    <td className="px-4 py-4 text-zinc-400 text-xs">{p.date}</td>
                    <td className="px-4 py-4 text-zinc-500 text-xs">Bodega Principal Pruebas</td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.approved ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                        {p.approved ? "SI" : "NO"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NO</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-sky-500 hover:text-sky-600"><User className="w-4 h-4" /></button>
                        <button className="text-emerald-500 hover:text-emerald-600"><ShoppingCart className="w-4 h-4" /></button>
                        <button className="text-amber-500 hover:text-amber-600"><FileText className="w-4 h-4" /></button>
                        <button className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        <button className="text-sky-500 hover:text-sky-600"><File className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Mostrar</span>
              <select className="border border-zinc-200 rounded px-2 py-1 text-zinc-700 outline-none">
                <option>10</option>
              </select>
            </div>
            <div>
              <p>Mostrando {MOCK_PRODUCTS.length + (productAdded || comboCreatedToast ? 1 : 0)} de {MOCK_PRODUCTS.length + (productAdded || comboCreatedToast ? 1 : 0)} productos.</p>
              <p>Página 1 de 1.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 bg-sky-400 text-white rounded text-sm font-medium opacity-70 cursor-not-allowed">
              Anterior
            </button>
            <button className="px-4 py-1.5 bg-sky-400 text-white rounded text-sm font-medium opacity-70 cursor-not-allowed">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Flotante */}
      {viewMode === "list" && !productAdded && <VideoOnboardingModal />}

      {/* Toast combo creado */}
      {comboCreatedToast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-xs animate-in slide-in-from-right duration-300">
          <div className="relative shrink-0">
            <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" fill="#ff7b00" />
              <ellipse cx="13" cy="19" rx="5" ry="6" fill="white" />
              <ellipse cx="27" cy="19" rx="5" ry="6" fill="white" />
              <circle cx="14" cy="20" r="3" fill="#1a1a1a" />
              <circle cx="28" cy="20" r="3" fill="#1a1a1a" />
              <circle cx="15" cy="18" r="1" fill="white" />
              <circle cx="29" cy="18" r="1" fill="white" />
            </svg>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <Check size={10} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-800">¡Combo creado!</p>
            <p className="text-xs text-zinc-500 mt-0.5">Los cambios se aplicaron correctamente.</p>
          </div>
          <button onClick={() => setComboCreatedToast(false)} className="text-zinc-400 hover:text-zinc-600 shrink-0 mt-0.5">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Componente: Formulario Extendido de Creación de Producto
// ----------------------------------------------------------------------
function ProductCreateForm({ onBack, onSaveSuccess }: { onBack: () => void, onSaveSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState("General");

  // Estados para validación
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [imagesCount, setImagesCount] = useState(0);

  // Nombre del producto (controlado para alimentar la categorización con IA) y categoría seleccionada
  const [nombreProducto, setNombreProducto] = useState("jabon");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaSeleccionada | null>(null);

  // Estados para Garantías
  const [garantiaIncompleta, setGarantiaIncompleta] = useState(false);
  const [garantiaMalFuncionamiento, setGarantiaMalFuncionamiento] = useState(false);
  const [garantiaRoto, setGarantiaRoto] = useState(false);
  const [garantiaDiferente, setGarantiaDiferente] = useState(false);

  // Estados para Modales de Éxito
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Estado del Modal de Alerta de Validación
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    title: string;
    message: string;
    iconType: "error" | "warning";
  }>({
    show: false,
    title: "",
    message: "",
    iconType: "warning"
  });

  const menuItems = [
    "General", "Stock", "Imagen del producto", "Recursos Adicionales", 
    "Productos privados", "Garantias"
  ];

  const handleSaveAttempt = () => {
    trackEvent('product_save_attempted');
    
    // 1. Validación de Stock
    const currentStock = typeof stockQuantity === "number" ? stockQuantity : 0;
    if (currentStock < 100) {
      trackEvent('product_save_validation_failed', { reason: 'stock_low' });
      setAlertConfig({
        show: true,
        title: "Faltan datos por completar",
        message: "Al menos una bodega debe tener un mínimo de 100 unidades",
        iconType: "error"
      });
      return;
    }

    // 2. Validación de Imágenes
    if (imagesCount < 3) {
      trackEvent('product_save_validation_failed', { reason: 'images_low' });
      setAlertConfig({
        show: true,
        title: "Advertencia",
        message: "Los productos que no son privados, deben tener al menos tres imágenes",
        iconType: "warning"
      });
      return;
    }

    // 3. Validación de Garantías
    if (!garantiaIncompleta || !garantiaMalFuncionamiento || !garantiaRoto) {
      trackEvent('product_save_validation_failed', { reason: 'warranties_missing' });
      setAlertConfig({
        show: true,
        title: "Advertencia",
        message: "Las siguientes garantías son obligatorias: Orden incompleta, Mal funcionamiento y Producto roto",
        iconType: "warning"
      });
      return;
    }

    // Si todo pasa, abrimos el primer modal de confirmación
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    setShowVerifyModal(true);
  };

  const handleVerifyStart = () => {
    trackEvent('product_saved');
    trackEvent('survey_started');
    window.open("https://link.dropi.co/widget/survey/RHwFslXWbg01teWQk04b", "_blank");
    onSaveSuccess();
  };

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in duration-300 relative">
      <h1 className="text-2xl font-bold text-zinc-800">Crear Producto</h1>

      {/* Modal de Validación Condicional */}
      {alertConfig.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-[440px] p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 relative">
            {/* Simulación del Robot Dropi de Error */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Bot className="w-10 h-10" />
              </div>
              {alertConfig.iconType === "error" ? (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-orange-500 stroke-[3]" />
                </div>
              ) : (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-500 text-2xl font-black">!</span>
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-zinc-800 mb-2">{alertConfig.title}</h3>
            <p className="text-sm text-zinc-500 mb-8 max-w-[300px]">
              {alertConfig.message}
            </p>

            <button 
              onClick={() => setAlertConfig({ ...alertConfig, show: false })}
              className="w-full bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-transform hover:scale-[1.02]"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Modal: ¿Todo listo? */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 relative">
            <div className="mb-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Bot className="w-12 h-12" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-zinc-800 mb-4">¿Todo listo?</h3>
            <p className="text-[15px] text-zinc-600 mb-8 px-4 leading-relaxed">
              Asegúrate de que las medidas del producto sean correctas, así te aseguramos que el costo de envío sea exacto, evitando cobros adicionales por refacturación en el futuro
            </p>

            <div className="flex items-center gap-4 w-full">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmSave}
                className="flex-1 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors border-2 border-[#f08c3e] hover:border-[#e67e22]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Verificar operación */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-zinc-800 mb-6">Verificar operación</h3>
              <p className="text-[15px] text-zinc-700 mb-6 leading-relaxed">
                Antes de publicar tu primer producto en el catálogo público, queremos conocerte y acompañarte para que tengas todo listo como proveedor Dropi.<br/><br/>
                Por eso, realizaremos una verificación de tu operación donde te solicitaremos:
              </p>

              <ul className="list-disc pl-5 space-y-2 mb-6 text-[15px] text-zinc-700 font-medium">
                <li>Datos y documentos de la empresa</li>
                <li>Procesos administrativos y financieros</li>
                <li>Equipo operativo</li>
                <li>Canales de venta</li>
                <li>Agendar la reunión de auditoría</li>
              </ul>

              <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl mb-8">
                <p className="text-sm text-sky-800 text-center font-medium">
                  Completar esta información nos ayudará a validar tu operación más rápido.
                </p>
              </div>

              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 bg-white border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleVerifyStart}
                  className="flex-1 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors border-2 border-[#f08c3e] hover:border-[#e67e22]"
                >
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-zinc-100 p-4 shrink-0">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item 
                    ? "bg-[#0ea5e9] text-white" 
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 lg:p-8 relative">
          
          {/* Header Action Buttons */}
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <button className="text-zinc-400 hover:text-zinc-600">
              <Share className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSaveAttempt}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>

          <div className="max-w-3xl pt-8">
            
            {/* --- TAB: GENERAL --- */}
            {activeTab === "General" && (
              <div className="space-y-8 animate-in fade-in">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">Nombre del producto</label>
                  <input
                    type="text"
                    value={nombreProducto}
                    onChange={(e) => setNombreProducto(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
                  />
                </div>

                {/* Checkbox Nombre diferente */}
                <label className="flex items-center gap-3 cursor-pointer group w-max">
                  <div className="w-5 h-5 border border-zinc-300 rounded flex items-center justify-center bg-white group-hover:border-orange-400 transition-colors" />
                  <span className="text-sm text-zinc-700">Crear un nombre diferente para la guía de envío</span>
                </label>

                {/* Privacidad Radios */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-zinc-700">Elige cómo quieres publicar tu producto:</label>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-0.5">
                        <CircleDot className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-800">Público:</div>
                        <div className="text-sm text-zinc-500">Disponible para todos los dropshippers en el catálogo.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-0.5">
                        <Circle className="w-5 h-5 text-zinc-300 group-hover:text-zinc-400" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-800">Privado:</div>
                        <div className="text-sm text-zinc-500">Solo tú podrás ver y vender este producto.</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Medidas */}
                <div className="space-y-4 pt-2">
                  <label className="text-sm font-semibold text-zinc-700 block">Medidas del producto:</label>
                  <p className="text-sm text-zinc-600">
                    Para calcular el valor del envío, tenemos en cuenta el peso real y el peso volumétrico del producto. Este se calcula con la fórmula: <span className="font-bold">largo × ancho × alto.</span>
                  </p>
                  
                  <div className="bg-sky-50 border border-sky-100 rounded-md p-4 flex gap-3 text-sky-800">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">Asegúrate de ingresar medidas reales y precisas para evitar refacturaciones en el valor del flete.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-semibold text-zinc-600">Peso</label>
                      <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                      <span className="absolute right-3 top-7 text-xs text-zinc-400">g</span>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-semibold text-zinc-600">Longitud</label>
                      <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                      <span className="absolute right-3 top-7 text-xs text-zinc-400">cm</span>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-semibold text-zinc-600">Ancho</label>
                      <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                      <span className="absolute right-3 top-7 text-xs text-zinc-400">cm</span>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-semibold text-zinc-600">Alto</label>
                      <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                      <span className="absolute right-3 top-7 text-xs text-zinc-400">cm</span>
                    </div>
                  </div>
                </div>

                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">Precio <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">?</span></label>
                    <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">Precio sugerido <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">?</span></label>
                    <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                </div>

                {/* Tipo y Categoría */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Tipo</label>
                    <select className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400 bg-white text-zinc-700">
                      <option>SIMPLE</option>
                    </select>
                  </div>
                  <CategoryPickerIA
                    productName={nombreProducto}
                    value={categoriaSeleccionada}
                    onChange={setCategoriaSeleccionada}
                  />
                </div>

                {/* SKU */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">SKU <span className="font-normal text-zinc-400">(Opcional)</span> <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">?</span></label>
                  <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                </div>

                {/* Descripción (Rich Text Mockup) */}
                <div className="space-y-1.5 pb-8">
                  <label className="text-sm font-semibold text-zinc-700 flex items-center gap-1">Descripción <span className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">?</span></label>
                  <p className="text-sm text-zinc-600 mb-2">
                    Indica qué es el producto, cómo funciona y cuáles son sus principales características. Mínimo 200 caracteres.
                  </p>
                  
                  <div className="border border-zinc-200 rounded-md overflow-hidden">
                    {/* Editor Toolbar */}
                    <div className="bg-zinc-50 border-b border-zinc-200 p-2 flex items-center gap-1">
                      <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><Bold className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><Italic className="w-4 h-4" /></button>
                      <div className="w-px h-5 bg-zinc-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><List className="w-4 h-4" /></button>
                      <div className="w-px h-5 bg-zinc-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><AlignLeft className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><AlignCenter className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><AlignRight className="w-4 h-4" /></button>
                    </div>
                    {/* Editor Area */}
                    <textarea 
                      rows={6}
                      placeholder="Enter description here..."
                      className="w-full p-4 resize-none focus:outline-none text-sm text-zinc-700"
                    ></textarea>
                  </div>
                </div>

              </div>
            )}

            {/* --- TAB: STOCK --- */}
            {activeTab === "Stock" && (
              <div className="animate-in fade-in">
                <table className="w-full text-sm mt-8 border border-zinc-200 rounded-lg overflow-hidden block">
                  <thead className="bg-white text-zinc-700 font-bold border-b border-zinc-200 block w-full">
                    <tr className="flex w-full">
                      <th className="py-4 px-6 flex-1 text-center">Bodega</th>
                      <th className="py-4 px-6 flex-1 text-center flex items-center justify-center gap-1">
                        Stock <Info className="w-3.5 h-3.5 text-zinc-400" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-50/50 block w-full">
                    <tr className="flex w-full items-center">
                      <td className="py-8 px-6 flex-1 text-center text-zinc-600">
                        bodega 1(Kra 56 # 7 oeste 96 Casa C1)
                      </td>
                      <td className="py-8 px-6 flex-1 flex flex-col items-center">
                        <input 
                          type="number" 
                          value={stockQuantity} 
                          onChange={e => setStockQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="Stock" 
                          className="w-32 px-4 py-2.5 border border-zinc-200 rounded-md text-center focus:outline-none focus:border-orange-400 bg-white shadow-sm"
                        />
                        <p className="text-[11px] text-zinc-500 mt-3 text-center max-w-[200px]">
                          Producto público: Al menos una bodega debe tener un mínimo de 100 unidades.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* --- TAB: IMÁGENES --- */}
            {activeTab === "Imagen del producto" && (
              <div className="animate-in fade-in">
                <h3 className="font-bold text-lg text-zinc-800">Imágenes del producto</h3>
                <p className="text-sm text-zinc-600 mb-8 mt-1">Sube mínimo 3 imágenes que muestren tu producto desde todos los ángulos.</p>
                
                <button 
                  onClick={() => setImagesCount(c => c + 1)} 
                  className="w-full border border-dashed border-emerald-400 bg-emerald-50/50 text-emerald-600 rounded-xl py-12 flex flex-col items-center justify-center font-bold transition-all hover:bg-emerald-50 hover:shadow-sm"
                >
                  <span className="tracking-wide">AGREGAR UNA IMAGEN</span>
                  <span className="text-xs text-zinc-500 font-normal mt-3">Formatos admitidos: JPG, JPEG, PNG, GIF, WEBP Tamaño máximo: 10MB</span>
                </button>
                
                {imagesCount > 0 && (
                  <div className="flex flex-wrap gap-8 mt-10 justify-center">
                    {Array.from({length: imagesCount}).map((_, i) => (
                      <div key={i} className="relative w-40 h-40 bg-zinc-100 rounded-lg shadow-sm border border-zinc-200 flex items-center justify-center overflow-visible">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center rounded-lg opacity-80" />
                        
                        <button 
                          onClick={() => setImagesCount(c => c - 1)} 
                          className="absolute -bottom-4 bg-red-400 text-white p-2 rounded hover:bg-red-500 transition-colors shadow-sm z-10"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- TAB: RECURSOS ADICIONALES --- */}
            {activeTab === "Recursos Adicionales" && (
              <div className="animate-in fade-in pt-4">
                <div className="bg-[#fff7d1] border border-[#fde68a] text-[#854d0e] px-6 py-4 rounded-md shadow-sm flex items-center gap-2">
                  <p className="text-[14px] font-medium">Para crear recursos adicionales, por favor guarda el producto primero.</p>
                </div>
              </div>
            )}

            {/* --- TAB: PRODUCTOS PRIVADOS --- */}
            {activeTab === "Productos privados" && (
              <div className="animate-in fade-in">
                <div className="mb-6 flex items-center gap-2">
                  <h3 className="font-bold text-lg text-zinc-800">Productos privados</h3>
                  <span className="inline-block bg-[#0ea5e9] text-white text-[10px] font-bold px-2 py-0.5 rounded">stock : null</span>
                </div>
                
                <table className="w-full text-sm mt-4 border-t border-b border-zinc-200">
                  <thead className="bg-zinc-50 text-zinc-700 font-bold">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold w-[60%]">Correo</th>
                      <th className="py-3 px-4 text-left font-bold">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 align-top">
                        <input 
                          type="email" 
                          className="w-full px-4 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400"
                        />
                      </td>
                      <td className="py-4 px-4 align-top">
                        <input 
                          type="number" 
                          defaultValue="0"
                          className="w-full px-4 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* --- TAB: GARANTÍAS --- */}
            {activeTab === "Garantias" && (
              <div className="animate-in fade-in max-w-2xl">
                <h3 className="font-bold text-lg text-zinc-800 mb-6">Garantías</h3>
                <h4 className="font-bold text-sm text-zinc-800 mb-4">Garantías por defecto</h4>

                <div className="space-y-6">
                  {/* Item 1 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <div className="w-5 h-5 bg-[#0ea5e9] rounded flex items-center justify-center text-white" onClick={() => setGarantiaIncompleta(!garantiaIncompleta)}>
                        {garantiaIncompleta && <CheckSquare className="w-4 h-4" />}
                        {!garantiaIncompleta && <Square className="w-4 h-4 text-white/50" />}
                      </div>
                      <span className="text-sm font-medium text-zinc-700">Orden incompleta</span>
                    </label>
                    <div className="flex gap-4">
                      <input type="text" defaultValue="DIAS" className="w-1/3 px-4 py-2 border border-zinc-200 rounded-md bg-zinc-50 text-zinc-500 text-sm focus:outline-none" readOnly />
                      <input type="number" defaultValue="10" className="flex-1 px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <input type="text" placeholder="Observaciones" className="w-full px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                  </div>

                  {/* Item 2 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <div className="w-5 h-5 bg-[#0ea5e9] rounded flex items-center justify-center text-white" onClick={() => setGarantiaMalFuncionamiento(!garantiaMalFuncionamiento)}>
                        {garantiaMalFuncionamiento && <CheckSquare className="w-4 h-4" />}
                        {!garantiaMalFuncionamiento && <Square className="w-4 h-4 text-white/50" />}
                      </div>
                      <span className="text-sm font-medium text-zinc-700">Mal funcionamiento</span>
                    </label>
                    <div className="flex gap-4">
                      <input type="text" defaultValue="DIAS" className="w-1/3 px-4 py-2 border border-zinc-200 rounded-md bg-zinc-50 text-zinc-500 text-sm focus:outline-none" readOnly />
                      <input type="number" defaultValue="10" className="flex-1 px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <input type="text" placeholder="Observaciones" className="w-full px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                  </div>

                  {/* Item 3 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <div className="w-5 h-5 bg-[#0ea5e9] rounded flex items-center justify-center text-white" onClick={() => setGarantiaRoto(!garantiaRoto)}>
                        {garantiaRoto && <CheckSquare className="w-4 h-4" />}
                        {!garantiaRoto && <Square className="w-4 h-4 text-white/50" />}
                      </div>
                      <span className="text-sm font-medium text-zinc-700">Producto roto</span>
                    </label>
                    <div className="flex gap-4">
                      <input type="text" defaultValue="DIAS" className="w-1/3 px-4 py-2 border border-zinc-200 rounded-md bg-zinc-50 text-zinc-500 text-sm focus:outline-none" readOnly />
                      <input type="number" defaultValue="10" className="flex-1 px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <input type="text" placeholder="Observaciones" className="w-full px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                  </div>

                  {/* Item 4 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <div className="w-5 h-5 bg-[#0ea5e9] rounded flex items-center justify-center text-white" onClick={() => setGarantiaDiferente(!garantiaDiferente)}>
                        {garantiaDiferente && <CheckSquare className="w-4 h-4" />}
                        {!garantiaDiferente && <Square className="w-4 h-4 text-white/50" />}
                      </div>
                      <span className="text-sm font-medium text-zinc-700">Orden diferente</span>
                    </label>
                    <div className="flex gap-4">
                      <div className="w-1/3 relative">
                        <select className="w-full px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400 appearance-none bg-white text-zinc-700">
                          <option>DIAS</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                      <input type="number" defaultValue="10" className="flex-1 px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <input type="text" placeholder="Descripción" className="w-full px-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400" />
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


// --- Helpers ---

function CheckboxFilter({ label, checked }: { label: string, checked: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      {checked ? (
        <div className="w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center text-white flex-shrink-0">
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
      ) : (
        <div className="w-4 h-4 border border-zinc-300 rounded-sm bg-white group-hover:border-orange-400 flex-shrink-0 transition-colors" />
      )}
      <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{label}</span>
    </label>
  );
}

function ActionButton({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-white rounded-md text-sm font-medium transition-colors ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// ----------------------------------------------------------------------
// Componente: Modal de Video de Onboarding
// ----------------------------------------------------------------------
function VideoOnboardingModal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      trackEvent('products_view_opened');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClose = () => {
    trackEvent('product_video_modal_closed');
    setIsVisible(false);
  };

  const handleAction = () => {
    trackEvent('product_mass_upload_clicked');
    setIsVisible(false);
  };

  return (
    <div className="fixed right-6 bottom-24 z-50 w-[380px] bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200 animate-in slide-in-from-right-8 duration-500">
      {/* Botón de cierre absoluto */}
      <button 
        onClick={handleClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Contenedor del Iframe */}
      <div className="relative w-full pt-[56.25%] bg-zinc-900">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/D78m0v4p1k0?autoplay=0&controls=1&rel=0" 
          title="Carga masiva de productos Dropi"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      {/* Contenido textual inferior */}
      <div className="p-6 text-center space-y-4">
        <h3 className="font-bold text-zinc-800 text-lg">Carga masiva de productos</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Sube catálogos complejos (tallas, colores y variaciones) en minutos. Mira el video y sigue los pasos para evitar errores en la importación.
        </p>
        <button 
          onClick={handleAction}
          className="w-full mt-2 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
        >
          Cargar productos
        </button>
      </div>
    </div>
  );
}
