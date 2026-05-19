"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShieldCheck,
  Users,
  Box,
  Settings,
  Calendar,
  Megaphone,
  BarChart2,
  FileText,
  CreditCard,
  Clock,
  ChevronDown,
  GraduationCap,
  Truck,
  ScanLine,
  Menu,
  Sparkles,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
  badge?: "Beta" | "Nuevo";
  hasSubmenu?: boolean;
};

const menuItems: NavItem[] = [
  { name: "Inicio",              icon: Home,            href: "/inicio" },
  { name: "Dashboard",           icon: LayoutDashboard, href: "#",        badge: "Beta" },
  { name: "Productos",           icon: Package,         href: "/productos", badge: "Nuevo" },
  { name: "Contenido IA",        icon: Sparkles,        href: "/productos/v2", badge: "Nuevo" },
  { name: "Mis Pedidos",         icon: ShoppingCart,    href: "#",        hasSubmenu: true },
  { name: "Mis Garantías",       icon: ShieldCheck,     href: "#",        hasSubmenu: true },
  { name: "Clientes",            icon: Users,           href: "#" },
  { name: "Mis Integraciones",   icon: Box,             href: "#" },
  { name: "Historial de Cartera",icon: Clock,           href: "#" },
  { name: "Mis usuarios",        icon: Users,           href: "#" },
  { name: "Mis Referidos",       icon: Users,           href: "#" },
  { name: "Configuraciones",     icon: Settings,        href: "#",        badge: "Nuevo" },
  { name: "Calendario",          icon: Calendar,        href: "#" },
  { name: "Marketing",           icon: Megaphone,       href: "#",        hasSubmenu: true },
  { name: "ROAX",                icon: BarChart2,       href: "#",        badge: "Nuevo" },
  { name: "Reportes",            icon: BarChart2,       href: "#",        badge: "Nuevo" },
  { name: "Facturas",            icon: FileText,        href: "#",        hasSubmenu: true },
  { name: "Transportadora",      icon: Truck,           href: "#",        hasSubmenu: true },
  { name: "Dropi Card",          icon: CreditCard,      href: "#",        badge: "Nuevo" },
  { name: "CAS",                 icon: Megaphone,       href: "#",        hasSubmenu: true },
  { name: "EcomScanner",         icon: ScanLine,        href: "#",        badge: "Beta" },
  { name: "Academy",             icon: GraduationCap,   href: "#",        badge: "Nuevo" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white border-r border-zinc-200 h-screen flex flex-col sticky top-0 overflow-hidden hidden md:flex">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-zinc-100 flex-shrink-0">
        <img
          src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png"
          alt="Dropi"
          className="h-8 object-contain"
        />
        <button className="ml-auto text-zinc-400 hover:text-zinc-600 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.href && item.href !== "#";
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-orange-50 text-dropi font-medium"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-dropi" : "text-zinc-400"}`}
              />
              <span className="flex-1 leading-none">{item.name}</span>

              {item.badge === "Beta" && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-wide uppercase">
                  Beta
                </span>
              )}
              {item.badge === "Nuevo" && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-wide uppercase">
                  Nuevo
                </span>
              )}
              {item.hasSubmenu && (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
