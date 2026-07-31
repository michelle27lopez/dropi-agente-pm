"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  Lock,
  ShoppingCart,
  ImageIcon,
  ChevronRight,
  ChevronDown,
  Star,
  Check,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────

const providers = [
  { id: 1, name: "Jp Distribuidora",  count: 88,   cats: "Aseo, Belleza, Bisuter...", initials: "JP",   bg: "bg-zinc-900",    text: "text-yellow-400 font-black text-sm" },
  { id: 2, name: "Dts Importadores",  count: 2208, cats: "Aseo, Bebé, Belleza, ...",  initials: "DTS",  bg: "bg-slate-800",   text: "text-white font-black text-xs" },
  { id: 3, name: "Full Kbellos",      count: 313,  cats: "Aseo, Belleza, Bienes...",  initials: "K",    bg: "bg-amber-700",   text: "text-white font-black text-2xl" },
  { id: 4, name: "Enhorabuena",       count: 22,   cats: "Belleza, Bienestar, Cu...", initials: "EHB!", bg: "bg-violet-800",  text: "text-white font-black text-[10px]" },
  { id: 5, name: "Ghora Master",      count: 156,  cats: "Tecnología, Hogar, ...",    initials: "GM",   bg: "bg-blue-800",    text: "text-white font-black text-sm" },
];

type Badge = "Variable" | "Premium" | "Verificado" | null;

interface Product {
  id: number;
  name: string;
  provider: string;
  category: string | null;
  stock: number;
  precioProveedor: number;
  precioSugerido: number | null;
  badge: Badge;
  extraLabel?: string;
  bg: string;
  imgUrl: string;
}

const products: Product[] = [
  { id: 1,  name: "Buzo Largo Dama Azul Bebe S",       provider: "MAYRO'S",           category: null,         stock: 997, precioProveedor: 21000, precioSugerido: 45000,  badge: "Premium",    bg: "from-sky-50 to-blue-100",       imgUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 2,  name: "Bota Jordan Six Orux",               provider: "LORAYNE'S BOUTIQUE",category: "Moda",        stock: 839, precioProveedor: 68000, precioSugerido: null,   badge: "Variable",   bg: "from-zinc-50 to-zinc-100",      imgUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 3,  name: "Aro De 33 Cm Corazon Tripode",       provider: "MARVIN",            category: "Tecnologia",  stock: 95,  precioProveedor: 55000, precioSugerido: 65000,  badge: null,         bg: "from-slate-50 to-slate-100",    imgUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 4,  name: "Duo Mayar Yara",                     provider: "FRAGANCE",          category: "Moda",        stock: 997, precioProveedor: 88000, precioSugerido: 88000,  badge: "Verificado", extraLabel: "1 PERFUMERO", bg: "from-rose-50 to-pink-100",  imgUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 5,  name: "Kemei Profesional Recortadora 100",  provider: "TECH MARKET",       category: "Belleza",     stock: 234, precioProveedor: 45000, precioSugerido: 89000,  badge: null,         bg: "from-zinc-100 to-zinc-200",     imgUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 6,  name: "Ultra Car Cleaner x2 Unidades",      provider: "AUTO CLEAN CO",     category: "Automóvil",   stock: 156, precioProveedor: 23000, precioSugerido: 49000,  badge: null,         bg: "from-gray-50 to-gray-100",      imgUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 7,  name: "Linterna Táctica LED 1500mAh",       provider: "DROPI TECH",        category: "Tecnologia",  stock: 412, precioProveedor: 18000, precioSugerido: 39000,  badge: null,         bg: "from-zinc-50 to-zinc-100",      imgUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format&q=80" },
  { id: 8,  name: "Kit Auto Supply Cuidado Premium",    provider: "AUTO SUPPLY",       category: "Automóvil",   stock: 88,  precioProveedor: 67000, precioSugerido: 120000, badge: "Premium",    bg: "from-emerald-50 to-green-100",  imgUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop&auto=format&q=80" },
];

function fmt(n: number) {
  return n.toLocaleString("es-CO");
}

// ─── Sub-components ───────────────────────────────────────

function ToggleFilter({
  on, onToggle, icon: Icon, label,
}: { on: boolean; onToggle: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-sm text-zinc-700 select-none"
    >
      <Icon className={`w-4 h-4 ${on ? "text-dropi" : "text-zinc-400"}`} />
      <span className={on ? "font-medium text-dropi" : ""}>{label}</span>
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ml-0.5 ${
          on ? "bg-dropi" : "bg-zinc-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function ProductCard({ p }: { p: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
      {/* ── Image area ── */}
      <div className={`relative aspect-square flex-shrink-0 overflow-hidden bg-gradient-to-br ${p.bg}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.imgUrl}
          alt={p.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        {p.badge === "Variable" && (
          <span className="absolute top-2 left-2 bg-dropi text-white text-[11px] font-bold px-3 py-1 rounded-full z-10">
            Variable
          </span>
        )}

        {p.extraLabel && (
          <div className="absolute top-2 right-10 bg-zinc-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
            {p.extraLabel}
          </div>
        )}

        {p.badge === "Premium" && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-dropi text-white text-[11px] font-bold px-3 py-1 rounded-full z-10">
            <Star className="w-3 h-3 fill-white" />
            Premium
          </div>
        )}

        {p.badge === "Verificado" && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-yellow-500 text-white text-[11px] font-bold px-3 py-1 rounded-full z-10">
            <Check className="w-3 h-3" />
            Verificado
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
          className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-zinc-400"}`} />
        </button>
      </div>

      {/* ── Info area ── */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-500">{p.category ?? ""}</span>
          <span className="text-xs font-semibold text-dropi">Stock {fmt(p.stock)}</span>
        </div>

        <h3 className="text-[13px] font-bold text-zinc-900 leading-snug line-clamp-2 mb-1">
          {p.name}
        </h3>

        <p className="text-[11px] text-zinc-400 mb-2">
          Provider: <span className="text-dropi font-semibold">{p.provider}</span>
        </p>

        <div className="mt-auto space-y-2.5">
          <div className="flex items-end gap-3">
            <div>
              <p className="text-[10px] text-zinc-400 leading-none mb-0.5">Precio proveedor:</p>
              <p className="text-xs text-zinc-500">$ {fmt(p.precioProveedor)}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 leading-none mb-0.5">Precio sugerido</p>
              {p.precioSugerido ? (
                <p className="text-sm font-bold text-zinc-900">$ {fmt(p.precioSugerido)}</p>
              ) : (
                <p className="text-sm font-bold text-zinc-900">Variable</p>
              )}
            </div>
          </div>

          {/* Primary CTA — Crear contenido IA */}
          <Link
            href={`/productos/v2/canvas/${p.id}`}
            className="w-full flex items-center justify-center gap-2 bg-dropi text-white text-sm font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Crear contenido IA
          </Link>

          {/* Secondary — Enviar a cliente */}
          <button className="w-full flex items-center justify-center gap-1.5 text-zinc-400 text-xs hover:text-zinc-600 transition-colors">
            <ShoppingCart className="w-3 h-3" />
            Enviar a cliente
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function ProductosV2Page() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [favoritos, setFavoritos] = useState(false);
  const [privado, setPrivado] = useState(false);
  const [ordenes, setOrdenes] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-full pb-20">
      {/* ── Feature announcement banner ── */}
      {bannerVisible && (
        <div className="px-5 pt-4">
          <div className="relative bg-gradient-to-r from-violet-700 via-orange-500 to-orange-400 rounded-xl overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-orange-300/30 to-transparent" />
            <div className="absolute right-8 top-2 bottom-2 w-24 bg-white/5 rounded-lg" />
            <div className="absolute right-36 top-3 bottom-3 w-16 bg-white/5 rounded-lg" />

            <div className="relative px-8 py-5 flex items-center gap-10">
              <div className="text-white flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">
                    Variante experimental
                  </span>
                </div>
                <h2 className="text-[22px] font-black leading-tight tracking-tight">
                  Crea contenido IA para<br />tus productos Dropi
                </h2>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm border border-white/50 rounded-full px-5 py-3 flex items-center gap-3 min-w-[280px]">
                  <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
                  <div className="w-px h-4 bg-white/60" />
                  <span className="text-white text-sm font-medium">
                    Guiones · Hooks · Videos con IA
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setBannerVisible(false)}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="px-5 py-5 space-y-5">
        {/* ── Providers carousel ── */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-bold text-zinc-900">Proveedores</span>
            <a href="#" className="text-sm text-dropi font-semibold hover:underline">
              Ver todos
            </a>
          </div>
          <div className="flex items-stretch gap-3">
            <div className="flex flex-1 gap-3 overflow-hidden">
              {providers.map((pv) => (
                <div
                  key={pv.id}
                  className="flex-shrink-0 w-[240px] bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full ${pv.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={pv.text}>{pv.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">{pv.name}</p>
                    <p className="text-xs text-zinc-500">{pv.count} Productos</p>
                    <p className="text-xs text-zinc-400 truncate">{pv.cats}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="flex-shrink-0 w-11 bg-white border border-zinc-200 rounded-xl flex items-center justify-center hover:shadow-md hover:bg-zinc-50 transition-all self-stretch">
              <ChevronRight className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* ── Catalog + Filters ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-zinc-900">Catálogo de productos</h1>
            <span className="flex items-center gap-1 bg-violet-100 text-violet-700 text-[11px] font-black px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> Contenido IA
            </span>
          </div>

          {/* Filter row 1 */}
          <div className="flex items-center gap-5 flex-wrap mb-3">
            <ToggleFilter on={favoritos} onToggle={() => setFavoritos((v) => !v)} icon={Heart}        label="Favoritos" />
            <ToggleFilter on={privado}   onToggle={() => setPrivado((v) => !v)}   icon={Lock}         label="Privado" />
            <ToggleFilter on={ordenes}   onToggle={() => setOrdenes((v) => !v)}   icon={ShoppingCart} label="Con ordenes" />

            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar"
                className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-dropi focus:border-dropi"
              />
            </div>

            <button className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap">
              <ImageIcon className="w-4 h-4 text-zinc-500" />
              Buscar por imagen
            </button>
          </div>

          {/* Filter row 2 */}
          <div className="flex items-end gap-2 overflow-x-auto pb-1">
            <div className="flex-shrink-0 space-y-1">
              <label className="text-xs text-zinc-600 font-medium block whitespace-nowrap">Tipo de proveedor:</label>
              <select className="border border-zinc-300 rounded-lg px-2.5 py-[7px] text-sm text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-dropi w-[120px]">
                <option>Proveedor</option>
                <option>Fabricante</option>
                <option>Importador</option>
              </select>
            </div>

            <div className="flex-shrink-0 space-y-1">
              <label className="text-xs text-zinc-600 font-medium block whitespace-nowrap">Rango precio proveedor:</label>
              <div className="flex items-center gap-1.5">
                <input defaultValue="0" className="w-16 border border-zinc-300 rounded-lg px-2.5 py-[7px] text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-dropi" />
                <span className="text-zinc-400 text-sm flex-shrink-0">—</span>
                <input defaultValue="1.000.000" className="w-24 border border-zinc-300 rounded-lg px-2.5 py-[7px] text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-dropi" />
              </div>
            </div>

            <div className="flex-shrink-0 space-y-1">
              <label className="text-xs text-zinc-600 font-medium block">Stock:</label>
              <select className="border border-zinc-300 rounded-lg px-2.5 py-[7px] text-sm text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-dropi w-[110px]">
                <option>Cantidad</option>
                <option>{">"}  0</option>
                <option>{">"} 10</option>
                <option>{">"} 100</option>
              </select>
            </div>

            <div className="flex-shrink-0 space-y-1">
              <label className="text-xs text-zinc-600 font-medium block">Categorías:</label>
              <select className="border border-zinc-300 rounded-lg px-2.5 py-[7px] text-sm text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-dropi w-[120px]">
                <option>Categorías</option>
                <option>Moda</option>
                <option>Tecnologia</option>
                <option>Belleza</option>
                <option>Hogar</option>
                <option>Automóvil</option>
              </select>
            </div>

            <div className="flex-shrink-0 space-y-1">
              <label className="text-xs text-zinc-600 font-medium block">Ciudad:</label>
              <select className="border border-zinc-300 rounded-lg px-2.5 py-[7px] text-sm text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-dropi w-[170px]">
                <option>Seleccione una ciudad</option>
                <option>Bogotá</option>
                <option>Medellín</option>
                <option>Cali</option>
                <option>Barranquilla</option>
              </select>
            </div>

            <button className="flex-shrink-0 flex items-center gap-2 bg-dropi text-white text-sm font-bold px-5 py-[9px] rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap ml-auto">
              <SlidersHorizontal className="w-4 h-4" />
              Aplicar filtro
            </button>
          </div>
        </div>

        {/* ── Sort + View bar ── */}
        <div className="flex items-center justify-end gap-4 border-t border-zinc-100 pt-3">
          <div className="flex items-center gap-1.5 text-sm text-zinc-700">
            <span>Ordenar por:</span>
            <button className="flex items-center gap-1 font-bold hover:text-dropi transition-colors">
              Aleatorio
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-sm text-zinc-500 mr-1">Vista:</span>
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "text-dropi bg-dropi-muted" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "text-dropi bg-dropi-muted" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "grid grid-cols-1 gap-3"}>
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
