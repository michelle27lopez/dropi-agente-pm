"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Send,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Wallet,
  Truck,
  RotateCcw,
  Building2,
  Info,
  MapPin,
  Phone,
  User,
  X,
  CreditCard,
} from "lucide-react";

export default function MuestrasPage() {
  const [dataSet, setDataSet] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [drawerState, setDrawerState] = useState<"blank" | "active" | "success">("blank");

  const [formData, setFormData] = useState({
    name: "Santiago",
    lastname: "Herrera Acosta",
    phone: "3001234567",
    dept: "Valle del Cauca",
    city: "Cali",
    address: "Calle 5 #23-45, Apto 402, Torre B",
    email: "santiago@dropi.co",
  });

  const handleSolicitarMuestra = () => {
    if (!dataSet) {
      setShowSetupModal(true);
    } else {
      setDrawerState("active");
    }
  };

  const handleSaveSetup = () => {
    setDataSet(true);
    setShowSetupModal(false);
    setDrawerState("active");
  };

  const handleConfirmOrder = () => {
    setDrawerState("success");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider">
            Experimento Pide tu Muestra (PROD-MUESTRA)
          </span>
          <h1 className="text-2xl font-extrabold mt-1">
            Solicitud de Muestra 1-Clic & Setup Único
          </h1>
          <p className="text-xs text-orange-100 mt-0.5">
            Reduciendo la fricción del dropshipper novato para comprar su primer producto y validar la logística in-situ.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold border border-white/20">
          Status: Prototipo Interactivo
        </div>
      </div>

      {/* Main Grid: Product detail + 1-Click Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Product Card */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <span>Todos los productos</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Bodega Bogotá</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-800 font-bold">Mini Cámara Wifi Robótica HD IP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Gallery */}
            <div className="flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 rounded-xl p-8 h-72">
              <img
                src="https://img.icons8.com/color/256/cctv-camera.png"
                alt="Mini Cámara"
                className="max-h-48 object-contain"
              />
            </div>

            {/* Info */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded">
                SKU: 9781974627127
              </span>
              <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">
                Mini Cámara Wifi Robótica HD IP
              </h2>
              <p className="text-xs text-zinc-500">
                Categoría: <strong>Tecnología</strong> · Tipo de producto: <strong>Simple</strong>
              </p>

              {/* Price card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-400 font-medium uppercase block">Precio Proveedor</span>
                  <span className="text-base font-extrabold text-dropi">$59.000 COP</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-medium uppercase block">Precio Sugerido</span>
                  <span className="text-base font-extrabold text-zinc-800">$65.800 COP</span>
                </div>
              </div>

              {/* Stock info */}
              <div className="text-xs space-y-1 text-zinc-600 border-y border-zinc-100 py-3">
                <p>Bodega origen: <strong className="text-zinc-900">BOGOTÁ CENTRAL</strong></p>
                <p>Stock físico real: <strong className="text-emerald-600">100 unidades privatizadas</strong></p>
                <p>Vendido por: <strong className="text-zinc-900">Hepa Tecnología</strong></p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button className="flex-1 bg-dropi text-white font-bold text-xs py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Enviar al Cliente
                </button>
                <button
                  onClick={handleSolicitarMuestra}
                  className="flex-1 bg-orange-50 border-2 border-dropi text-dropi font-bold text-xs py-3 px-4 rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" /> Solicitar Muestra 1-Clic
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Click Checkout Drawer */}
        <div className="bg-white border border-zinc-200 rounded-2xl flex flex-col justify-between shadow-xs overflow-hidden h-[540px]">
          <div className="bg-zinc-50 border-b border-zinc-200 px-5 py-3.5 flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-800">Solicitud de Muestra</span>
            <span className="text-[10px] font-extrabold text-dropi uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              1-Clic Activo
            </span>
          </div>

          {/* Drawer Body State: Blank */}
          {drawerState === "blank" && (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-3 text-zinc-400">
              <div className="w-14 h-14 rounded-full bg-orange-50 text-dropi flex items-center justify-center">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800">Resolución en 1 Clic</h3>
              <p className="text-xs text-zinc-500 max-w-xs">
                Haz clic en el botón <strong>"Solicitar Muestra 1-Clic"</strong> para probar la experiencia sin llenar formularios largos.
              </p>
            </div>
          )}

          {/* Drawer Body State: Active (Pre-populated) */}
          {drawerState === "active" && (
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
              <div className="space-y-3 text-xs">
                {/* Destination */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-dropi uppercase tracking-wider block">
                    Destinatario Predeterminado
                  </span>
                  <p className="font-bold text-zinc-900 text-sm">
                    {formData.name} {formData.lastname}
                  </p>
                  <p className="text-zinc-500">{formData.address}, {formData.city}, {formData.dept}</p>
                  <p className="text-zinc-400 text-[11px]">📞 +57 {formData.phone}</p>
                </div>

                {/* Carrier */}
                <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-dropi uppercase tracking-wider block">
                      Transportadora Optimizada
                    </span>
                    <span className="font-bold text-zinc-900">Coordinadora</span>
                    <span className="text-[11px] text-zinc-500 block">Entrega en 2 días hábiles</span>
                  </div>
                  <span className="font-bold text-emerald-600">$10.800 COP</span>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-1.5 text-zinc-600">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Desglose de Caja
                  </span>
                  <div className="flex justify-between">
                    <span>Muestra (Costo Proveedor):</span>
                    <strong className="text-zinc-900">$59.000 COP</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Flete de envío:</span>
                    <strong className="text-zinc-900">$10.800 COP</strong>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-extrabold text-zinc-900">
                    <span>Total a debitar:</span>
                    <span className="text-dropi">$69.800 COP</span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Wallet Sincronizada: Se debitará automáticamente.</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full bg-blue-600 text-white font-bold text-xs py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Wallet className="w-4 h-4" /> Confirmar y Despachar Muestra
              </button>
            </div>
          )}

          {/* Drawer Body State: Success */}
          {drawerState === "success" && (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-zinc-900">¡Muestra Solicitada!</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Descontado de tu Wallet. Guía Coordinadora creada automáticamente. No volveremos a solicitar tu dirección para muestras futuras.
                </p>
              </div>
              <button
                onClick={() => setDrawerState("blank")}
                className="w-full border border-dropi text-dropi font-bold text-xs py-2.5 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Simular Nuevamente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Seteo Único Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-zinc-200 overflow-hidden shadow-2xl space-y-4">
            <div className="bg-dropi text-white px-5 py-4 flex justify-between items-center">
              <span className="font-bold text-sm">Seteo Único: Dirección de Muestras</span>
              <button onClick={() => setShowSetupModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="text-zinc-500 leading-relaxed">
                Registra tu dirección única de muestras. Guardaremos este seteo predeterminado para que tus próximas solicitudes de muestras se procesen en un solo clic.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Nombres</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-dropi outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Apellidos</label>
                  <input
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-dropi outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Teléfono</label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-dropi outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Departamento</label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-dropi outline-none bg-white"
                  >
                    <option value="Valle del Cauca">Valle del Cauca</option>
                    <option value="Antioquia">Antioquia</option>
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Ciudad</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-dropi outline-none bg-white"
                  >
                    <option value="Cali">Cali</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Bogotá">Bogotá</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Dirección Completa</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-dropi outline-none"
                />
              </div>

              <button
                onClick={handleSaveSetup}
                className="w-full bg-dropi text-white font-bold text-xs py-3 rounded-xl hover:bg-orange-600 transition-colors mt-2"
              >
                Guardar y Habilitar 1-Clic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
