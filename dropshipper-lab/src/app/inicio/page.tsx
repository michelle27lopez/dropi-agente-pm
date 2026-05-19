import {
  Megaphone,
  Box,
  ChevronRight,
  Fingerprint,
  Wifi,
  MessageCircle,
  AlertCircle,
  Laptop,
} from "lucide-react";

const featuredSuppliers = [
  { name: "JP Distribuciones" },
  { name: "One Tech" },
  { name: "Color Home" },
  { name: "Ghora Master" },
];

export default function InicioPage() {
  return (
    <div className="relative min-h-full">
      {/* Warning banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <p className="text-sm text-amber-800 flex-1">
          Completa los datos personales y luego realiza la validación.
        </p>
        <button className="bg-dropi text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0 whitespace-nowrap">
          Completar datos
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Greeting */}
        <h1 className="text-2xl font-bold text-zinc-900">¡Hola, ux!</h1>

        {/* Row 1: Mega Live (left) + Dropi Cup (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

          {/* Mega Live card */}
          <div className="rounded-xl overflow-hidden relative min-h-[390px] flex flex-col bg-gradient-to-br from-sky-50 via-blue-100 to-blue-200">
            {/* Silhouette photo area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Background gradient layer behind the "people" area */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-100/60 to-blue-300/40" />

              {/* Mock person silhouettes using CSS shapes */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-1 px-4 pb-0">
                {[48, 60, 72, 60, 56, 68, 52, 64, 58].map((h, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-zinc-700/60 to-zinc-400/30 rounded-t-full flex-shrink-0"
                    style={{ width: 28, height: h }}
                  />
                ))}
              </div>

              {/* Title overlay */}
              <div className="absolute top-5 left-5 right-5">
                <p className="text-xs font-black tracking-widest text-zinc-700 uppercase mb-1">
                  Mega Live
                </p>
                <h2 className="text-4xl font-black leading-none text-blue-600 tracking-tight">
                  CHATEA<br />PRO
                </h2>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="bg-blue-600/90 backdrop-blur-sm px-5 py-4 space-y-2">
              <p className="text-xs text-blue-100 font-medium">
                Automatiza, vende y escala tu ecommerce en{" "}
                <strong className="text-white">solo 3 días</strong> con Chatea Pro
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-white bg-blue-500/60 rounded-full px-3 py-1 whitespace-nowrap">
                  🗓 2, 3, 4 DE JUNIO · 7PM COL
                </span>
                <button className="bg-white text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap">
                  Regístrate aquí
                </button>
              </div>
            </div>
          </div>

          {/* Dropi Cup announcement card */}
          <div className="rounded-xl bg-white border border-zinc-200 p-5 flex gap-4">
            <div className="w-14 h-14 rounded-full bg-dropi flex items-center justify-center flex-shrink-0 shadow-sm">
              <Megaphone className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed">
              ¡Demuestra lo que sabes hacer vendiendo!{" "}
              <strong className="text-zinc-900">🏆 Dropi Cup</strong> ya tiene
              inscripciones abiertas. Compite contra los mejores de LATAM por
              más de <strong>$50.000 USD</strong> en premios. Inscríbete antes
              del 31 de mayo en{" "}
              <span className="text-dropi font-semibold">dropicup.com</span>
            </p>
          </div>
        </div>

        {/* Row 2: Nueva actualización */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900">Nueva actualización</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Orange feature card (laptop mockup) */}
            <div className="rounded-xl overflow-hidden relative min-h-[220px] bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700 flex items-end">
              {/* Mock laptop screen UI */}
              <div className="absolute top-5 right-4 w-36 h-24 bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                <div className="h-4 bg-white/20 border-b border-white/20 flex items-center px-2 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <div className="flex-1 h-1 bg-white/30 rounded ml-1" />
                </div>
                <div className="p-2 space-y-1">
                  {[80, 60, 90, 50, 70].map((w, i) => (
                    <div key={i} className="h-1.5 bg-white/30 rounded" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
              {/* Laptop base */}
              <div className="absolute top-28 right-2 w-40 h-2 bg-white/10 rounded-full" />

              <div className="relative px-5 py-5">
                <p className="text-[10px] font-bold tracking-widest text-orange-200 uppercase mb-1">
                  Actualización Huella Digital
                </p>
                <h3 className="text-xl font-black text-white leading-tight">
                  MENOS DEVOLUCIONES,<br />MÁS CONTROL
                </h3>
              </div>
            </div>

            {/* Feature description card */}
            <div className="rounded-xl bg-white border border-zinc-200 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                  ¿Lanzas pedidos sin saber si recibirán?
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Con <strong className="text-zinc-800">Huella Digital de Dropi</strong>,
                  puedes ver el historial real de cada comprador antes de crear una
                  orden: entregas, devoluciones y nivel de riesgo según su comportamiento.
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Todo está integrado directamente en la plataforma, para que tomes
                  decisiones con información clara desde un solo lugar.
                </p>
              </div>
              <button className="mt-5 self-start border border-dropi text-dropi text-sm font-semibold px-5 py-2 rounded-lg hover:bg-dropi-muted transition-colors">
                Ver cómo usar
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Proveedores destacados */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900">
            Proveedores destacados de la semana
          </h2>
          <div className="space-y-2">
            {featuredSuppliers.map((supplier) => (
              <div
                key={supplier.name}
                className="bg-white border border-zinc-200 rounded-xl px-4 py-3.5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-dropi flex items-center justify-center flex-shrink-0">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <span className="flex-1 text-sm font-semibold text-zinc-800">
                  {supplier.name}
                </span>
                <button className="border border-dropi text-dropi text-sm font-semibold px-5 py-1.5 rounded-lg hover:bg-dropi-muted transition-colors">
                  Contactar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs text-zinc-400 pb-20">
          <span>2026 © Dropi</span>
          <span>Creado con ❤️</span>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
        <button className="w-12 h-12 rounded-full bg-dropi text-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center">
          <Fingerprint className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 rounded-full bg-dropi text-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center">
          <Wifi className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 rounded-full bg-dropi text-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
