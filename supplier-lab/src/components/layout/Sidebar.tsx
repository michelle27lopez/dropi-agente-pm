"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Users,
  Box,
  Settings,
  Calendar,
  Megaphone,
  BarChart2,
  FileText,
  CreditCard,
  Clock,
  Menu,
  ChevronDown,
  GraduationCap,
  Network,
  Layers,
  Activity
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: "Inicio", icon: Home, href: "/dashboard" },
    { name: "Dashboard", icon: LayoutDashboard, href: "#" },
    { name: "Productos", icon: Package, hasSubmenu: true, href: "/dashboard/productos" },
    { name: "Órdenes", icon: ShoppingCart, hasSubmenu: true, href: "#" },
    { name: "Mis Garantías", icon: ShieldCheck, hasSubmenu: true, href: "#" },
    { name: "Logistic", icon: Truck, hasSubmenu: true, href: "#" },
    { name: "Clientes", icon: Users, href: "#" },
    { name: "Mis Integraciones", icon: Box, href: "#" },
    { name: "Historial de Cartera", icon: Clock, href: "#" },
    { name: "Mis usuarios", icon: Users, hasSubmenu: true, href: "#" },
    { name: "Mis Referidos", icon: Users, href: "#" },
    { name: "Bodegas", icon: Box, href: "/dashboard/bodegas" },
    { name: "Configuraciones", icon: Settings, badge: "Nuevo", href: "#" },
    { name: "Calendario", icon: Calendar, href: "#" },
    { name: "Marketing", icon: Megaphone, hasSubmenu: true, href: "#" },
    { name: "Reportes", icon: BarChart2, hasSubmenu: true, href: "#" },
    { name: "Facturas", icon: FileText, hasSubmenu: true, href: "#" },
    { name: "Transportadora", icon: Truck, hasSubmenu: true, href: "#" },
    { name: "Dropi Card", icon: CreditCard, badge: "Nuevo", href: "#" },
    { name: "Roax", icon: Clock, badge: "Nuevo", href: "#" },
    { name: "CAS", icon: Megaphone, hasSubmenu: true, href: "#" },
    { name: "Academy", icon: GraduationCap, badge: "Nuevo", href: "#" },
    { name: "Combos", icon: Layers, href: "/dashboard/combos", badge: "Nuevo" },
    { name: "Supplier Graph", icon: Network, href: "/supplier-graph" },
    { name: "Catálogo Graph", icon: Activity, href: "/supplier-graph/catalogo", badge: "Nuevo" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-zinc-200 h-screen flex flex-col hidden md:flex sticky top-0 overflow-hidden">
      {/* Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 flex-shrink-0">
        <img 
          src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png" 
          alt="Dropi Logo" 
          className="h-8 object-contain"
        />
        <button className="ml-auto text-zinc-400 hover:text-zinc-600">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === item.href 
                ? "bg-orange-50 text-orange-600 font-medium" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <item.icon className={`w-5 h-5 ${pathname === item.href ? "text-orange-500" : "text-zinc-400"}`} />
            <span className="flex-1">{item.name}</span>
            
            {item.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">
                {item.badge}
              </span>
            )}
            
            {item.hasSubmenu && (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}
