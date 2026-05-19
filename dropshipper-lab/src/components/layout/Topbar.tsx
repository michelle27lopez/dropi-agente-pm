"use client";

import { useState } from "react";
import { Wallet, ChevronDown, Globe, Menu } from "lucide-react";

export function Topbar() {
  const [betaOn, setBetaOn] = useState(true);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-10">
      {/* Sidebar toggle (visible on mobile) */}
      <button className="md:hidden text-zinc-500 hover:text-zinc-800 transition-colors mr-1">
        <Menu className="w-5 h-5" />
      </button>

      {/* Membership label — plain text, no border box */}
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <span className="text-base">🤖</span>
        <span>Miembro De: <strong className="text-zinc-900">PRUEBAS PRODUCTO DROPI</strong></span>
      </div>

      <div className="flex-1" />

      {/* Language */}
      <button className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-2">
        <Globe className="w-4 h-4" />
        <span className="font-medium">Español</span>
      </button>

      {/* Wallet */}
      <div className="flex items-center gap-1.5 text-sm text-zinc-700 font-semibold px-2">
        <Wallet className="w-4 h-4 text-zinc-400" />
        <span>$ 276.456</span>
      </div>

      {/* Avatar */}
      <button className="flex items-center gap-1.5 group">
        <div className="w-8 h-8 rounded-full bg-dropi flex items-center justify-center text-white text-xs font-bold">
          ux
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
      </button>

      {/* BETA toggle */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-zinc-500 tracking-wide">BETA</span>
        <button
          onClick={() => setBetaOn((v) => !v)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            betaOn ? "bg-emerald-500" : "bg-zinc-300"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              betaOn ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </header>
  );
}
