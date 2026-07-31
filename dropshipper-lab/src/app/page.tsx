"use client";

import {
  Megaphone,
  Box,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Wifi,
  MessageCircle,
} from "lucide-react";

const featuredSuppliers = [
  { name: "JP Distribuciones" },
  { name: "One Tech" },
  { name: "Color Home" },
  { name: "Ghora Master" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-full">
      {/* Warning banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <p className="text-sm text-amber-800 flex-1">
          Completa los datos personales y luego realiza la validación.
        </p>
        <button className="bg-dropi text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0">
          Completar datos
        </button>
      </div>

      <div className="px-5 py-5 space-y-0">
        {/* Greeting */}
        <h1 className="text-xl font-bold text-zinc-900 mb-4">¡Hola, ux!</h1>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr_3fr] gap-4 items-start">

          {/* ── COL 1: Banner carousel ── */}
          <div className="relative rounded-xl overflow-hidden min-h-[500px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col select-none">
            {/* Crowd/stadium background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3a8a44_0%,_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#7c3aed33_0%,_transparent_50%)]" />
            {/* Spotlight rays */}
            <div className="absolute top-0 left-1/4 w-1 h-64 bg-gradient-to-b from-blue-300/30 to-transparent rotate-12 origin-top" />
            <div className="absolute top-0 left-1/2 w-1 h-80 bg-gradient-to-b from-purple-300/20 to-transparent -rotate-6 origin-top" />
            <div className="absolute top-0 right-1/4 w-1 h-56 bg-gradient-to-b from-blue-200/20 to-transparent rotate-3 origin-top" />

            {/* Stars */}
            <div className="absolute top-[45%] left-6 flex gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-yellow-400 text-xs">★</span>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col h-full min-h-[500px]">
              {/* Top branding */}
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded bg-dropi flex items-center justify-center">
                    <span className="text-white text-[8px] font-black">D</span>
                  </div>
                  <span className="text-[11px] font-black tracking-widest text-dropi uppercase">
                    DROPI CUP
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 tracking-wide ml-7">by dropi</p>
              </div>

              {/* Main tagline */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-1">
                  Menos carritos abandonados,
                </p>
                <h2 className="text-5xl font-black text-white leading-[0.9] tracking-tight">
                  COMPE-<br/>TENCIA<br/>REAL
                </h2>
              </div>

              {/* Spacer / silhouette area */}
              <div className="flex-1 flex items-end justify-center my-4">
                {/* Person silhouette via CSS */}
                <div className="relative w-48 h-44">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-36 bg-gradient-to-t from-yellow-500/80 via-yellow-400/60 to-transparent rounded-t-[60px]" />
                  <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-zinc-700/60" />
                  {/* Arms */}
                  <div className="absolute bottom-20 left-1/4 w-14 h-4 bg-yellow-500/60 rounded-full rotate-12" />
                  <div className="absolute bottom-20 right-1/4 w-14 h-4 bg-yellow-500/60 rounded-full -rotate-12" />
                </div>
              </div>

              {/* Bottom text */}
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  Prepara tu tienda,
                </p>
                <p className="text-lg font-black text-white leading-tight">
                  EL MAYOR RETO<br/>DEL ECOMMERCE
                </p>
              </div>
            </div>

            {/* Carousel arrows */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-20">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-20">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* ── COL 2: Center content ── */}
          <div className="space-y-4">
            {/* Dropi Cup announcement card */}
            <div className="rounded-xl bg-white border border-zinc-200 p-4 flex gap-3">
              <div className="w-12 h-12 rounded-full bg-dropi flex items-center justify-center flex-shrink-0 shadow-sm">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <p className="text-[13px] text-zinc-700 leading-relaxed">
                ¡Demuestra lo que sabes hacer vendiendo!{" "}
                <strong className="text-zinc-900">🏆 Dropi Cup</strong> ya tiene
                inscripciones abiertas. Compite contra los mejores de LATAM por
                más de <strong>$50.000 USD</strong> en premios. Inscríbete antes
                del 31 de mayo en{" "}
                <span className="text-dropi font-semibold">dropicup.com</span>
              </p>
            </div>

            {/* Nueva actualización heading */}
            <h2 className="text-base font-bold text-zinc-900 pt-1">
              Nueva actualización
            </h2>

            {/* Orange feature card */}
            <div className="rounded-xl overflow-hidden relative min-h-[180px] bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700 flex items-end">
              {/* Mock laptop */}
              <div className="absolute top-4 right-3 w-32 h-20 bg-white/10 rounded-lg border border-white/20 overflow-hidden shadow-inner">
                <div className="h-3.5 bg-white/20 border-b border-white/20 flex items-center px-2 gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <div className="flex-1 h-1 bg-white/30 rounded ml-1" />
                </div>
                <div className="p-2 space-y-1">
                  <div className="h-1.5 bg-emerald-400/60 rounded w-3/4" />
                  <div className="h-1.5 bg-white/30 rounded w-full" />
                  <div className="h-1.5 bg-white/30 rounded w-5/6" />
                  <div className="h-1.5 bg-white/20 rounded w-2/3" />
                  <div className="h-1.5 bg-dropi/60 rounded w-4/5" />
                </div>
              </div>
              {/* Laptop base */}
              <div className="absolute top-24 right-1 w-36 h-1.5 bg-white/10 rounded-full" />

              <div className="relative p-4">
                <p className="text-[9px] font-bold tracking-widest text-orange-200 uppercase mb-0.5">
                  Actualización Huella Digital
                </p>
                <h3 className="text-lg font-black text-white leading-tight">
                  MENOS DEVOLUCIONES,<br />MÁS CONTROL
                </h3>
              </div>
            </div>

            {/* Feature description (plain text, no card) */}
            <div className="space-y-2">
              <h3 className="text-[15px] font-bold text-zinc-900">
                ¿Lanzas pedidos sin saber si recibirán?
              </h3>
              <p className="text-[13px] text-zinc-600 leading-relaxed">
                Con <strong className="text-zinc-800">Huella Digital de Dropi</strong>,
                puedes ver el historial real de cada comprador antes de crear una
                orden: entregas, devoluciones y nivel de riesgo según su comportamiento.
              </p>
              <p className="text-[13px] text-zinc-600 leading-relaxed">
                Todo está integrado directamente en la plataforma, para que tomes
                decisiones con información clara desde un solo lugar.
              </p>
              <button className="border border-dropi text-dropi text-sm font-semibold px-5 py-2 rounded-lg hover:bg-dropi-muted transition-colors mt-1">
                Ver cómo usar
              </button>
            </div>
          </div>

          {/* ── COL 3: Proveedores destacados ── */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">
              Proveedores destacados de la semana
            </h2>
            <div className="space-y-2">
              {featuredSuppliers.map((supplier) => (
                <div
                  key={supplier.name}
                  className="bg-white border border-zinc-200 rounded-xl px-3 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-dropi flex items-center justify-center flex-shrink-0">
                    <Box className="w-4 h-4 text-white" />
                  </div>
                  <span className="flex-1 text-[13px] font-semibold text-zinc-800 leading-tight">
                    {supplier.name}
                  </span>
                  <button className="border border-dropi text-dropi text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-dropi-muted transition-colors whitespace-nowrap">
                    Contactar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-200 text-xs text-zinc-400 pb-16">
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
