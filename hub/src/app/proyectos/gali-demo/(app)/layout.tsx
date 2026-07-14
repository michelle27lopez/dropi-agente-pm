"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, ShoppingCart, Archive, BarChart3, CircleDollarSign, Megaphone,
  Puzzle, BookOpen, Settings, User, LayoutGrid, Boxes, ChevronsLeft,
} from "lucide-react";
import "./dropi-shell.scss";

const RAIL_ICONS = [Search, ShoppingCart, Archive, BarChart3, CircleDollarSign, Megaphone];
const RAIL_ICONS_BOTTOM = [Puzzle, BookOpen, Settings];

export default function GaliDemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProyectos = pathname?.startsWith("/proyectos/gali-demo/proyectos") || pathname?.startsWith("/proyectos/gali-demo/v5");
  const isHoy = pathname === "/proyectos/gali-demo";

  return (
    <div className="dropi-shell">
      <aside className="dropi-shell__rail">
        {RAIL_ICONS.map((Icon, i) => (
          <div key={i} className="dropi-shell__rail-icon"><Icon size={18} /></div>
        ))}
        <div className="dropi-shell__rail-divider"></div>
        {RAIL_ICONS_BOTTOM.map((Icon, i) => (
          <div key={i} className="dropi-shell__rail-icon"><Icon size={18} /></div>
        ))}
      </aside>

      <nav className="dropi-shell__nav">
        <div className="dropi-shell__topbar">
          <span className="dropi-shell__galeria-btn">
            <LayoutGrid size={13} /> Galería
          </span>
          <span className="dropi-shell__logo">🐶 dropi</span>
          <span className="dropi-shell__version-badge">Gali 6</span>
        </div>

        <div className="dropi-shell__header-row">
          <span className="dropi-shell__header-title">Gali 6</span>
          <ChevronsLeft size={14} className="dropi-shell__collapse-icon" />
        </div>

        <div className="dropi-shell__section">
          <User size={15} className="dropi-shell__section-icon" />
          Mi Negocio
        </div>
        <div className="dropi-shell__subitems">
          <span className={`dropi-shell__item ${isHoy ? "dropi-shell__item--active" : ""}`}>Hoy</span>
          <span className="dropi-shell__item">Señales</span>
          <span className="dropi-shell__item">Impacto</span>
          <span className="dropi-shell__item">Mi Contexto</span>
        </div>

        <Link
          href="/proyectos/gali-demo/proyectos"
          className={`dropi-shell__top-item dropi-shell__top-item--clickable ${isProyectos ? "dropi-shell__top-item--active" : ""}`}
        >
          <Boxes size={15} className="dropi-shell__section-icon" />
          Proyectos
        </Link>

        <div className="dropi-shell__section">
          <LayoutGrid size={15} className="dropi-shell__section-icon" />
          Centro de Gali
        </div>
        <div className="dropi-shell__subitems">
          <span className="dropi-shell__item">Agentes</span>
          <span className="dropi-shell__item">Skills</span>
        </div>

        <div className="dropi-shell__divider"></div>
        <span className="dropi-shell__plain-item">Marketplace</span>
        <span className="dropi-shell__plain-item">Conexiones</span>
        <span className="dropi-shell__plain-item">Academy</span>
      </nav>

      <main className="dropi-shell__main">{children}</main>
    </div>
  );
}
