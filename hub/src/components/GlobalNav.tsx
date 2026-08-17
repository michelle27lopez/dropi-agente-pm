"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  FileText,
  Calendar,
  GraduationCap,
  Settings,
  Database,
  BarChart3,
  Network,
  Webhook,
} from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  tag?: string;
};

// Nav primario reducido a 6 módulos (rediseño privado de Michelle, 2026-08-03):
// Panorama, Sprint, Iniciativas y Updates se retiran de aquí porque pasan a
// ser accesos rápidos dentro de Mi día (pendiente esa pasada). Pruebas con
// Usuarios se elimina. Guías baja al pie del sidebar (ver footer). El
// listado completo de proyectos sigue viviendo en /proyectos, no en el menú.
const PRIMARY_ITEMS: NavItem[] = [
  { key: "mi-dia", label: "Mi día", href: "/", icon: Home },
  { key: "proyectos", label: "Proyectos", href: "/proyectos", icon: FolderKanban },
  { key: "data", label: "Data", href: "/data-solicitada", icon: Database },
  { key: "metricas", label: "Following", href: "/metricas", icon: BarChart3 },
  { key: "calendario", label: "Calendario", href: "/calendario", icon: Calendar },
  { key: "celulas", label: "Células", href: "/celulas", icon: Network },
  { key: "integraciones", label: "Integraciones", href: "/integraciones", icon: Webhook },
  { key: "configuracion", label: "Configuración", href: "/ajustes", icon: Settings },
];

// Notas se queda visible fuera de los 6 módulos core, pero marcada "para mí"
// — es la única sección que se queda privada incluso cuando el resto del
// equipo vea este diseño.
const NOTAS_ITEM: NavItem = { key: "notas", label: "Notas", href: "/notas", icon: FileText, tag: "Para mí" };

const GUIAS_ITEM: NavItem = { key: "guias", label: "Guías", href: "/guias", icon: GraduationCap };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ item, collapsed, active }: { item: NavItem; collapsed: boolean; active: boolean }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className={`gnav-nav-item ${active ? "gnav-nav-item--active" : ""}`}
      title={collapsed ? `${item.label}${item.tag ? ` · ${item.tag}` : ""}` : undefined}
    >
      <span className="gnav-nav-item__icon">
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="gnav-nav-item__label gnav-hide-on-collapse">{item.label}</span>
      {item.tag && (
        <span className="gnav-nav-item__tag gnav-hide-on-collapse">{item.tag}</span>
      )}
    </a>
  );
}

export default function GlobalNav({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`gnav-backdrop ${mobileOpen ? "gnav-backdrop--open" : ""}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={`gnav-sidebar ${collapsed ? "gnav-sidebar--collapsed" : ""} ${mobileOpen ? "gnav-sidebar--mobile-open" : ""}`}
      >
        <div className="gnav-brand">
          <span className="gnav-brand__mark">
            <img src="/darwin-logo.svg" alt="Darwin" width={48} height={48} className="gnav-brand__logo" />
            <span className="gnav-brand__name gnav-hide-on-collapse">Darwin</span>
          </span>
          <button type="button" className="gnav-mobile-close" onClick={onCloseMobile}>
            ✕
          </button>
          <button
            type="button"
            className="gnav-toggle gnav-hide-on-collapse"
            onClick={onToggleCollapse}
            aria-label="Colapsar menú"
          >
            ‹
          </button>
        </div>
        {collapsed && (
          <button
            type="button"
            className="gnav-toggle"
            onClick={onToggleCollapse}
            aria-label="Expandir menú"
            style={{ margin: "0 auto 12px" }}
          >
            ›
          </button>
        )}

        <nav className="gnav-section">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PRIMARY_ITEMS.map((item) => (
              <NavLink key={item.key} item={item} collapsed={collapsed} active={isActive(pathname, item.href)} />
            ))}
          </div>
        </nav>

        <div className="gnav-section">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <NavLink item={NOTAS_ITEM} collapsed={collapsed} active={isActive(pathname, NOTAS_ITEM.href)} />
          </div>
        </div>

        <div className="gnav-spacer" />

        <div className="gnav-section gnav-section--footer">
          <NavLink item={GUIAS_ITEM} collapsed={collapsed} active={isActive(pathname, GUIAS_ITEM.href)} />
        </div>
      </aside>
    </>
  );
}
