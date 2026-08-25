"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Rss,
  Flag,
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
// Usuarios se elimina. Guías baja al pie del sidebar (ver footer).
// Delivery se suma después (2026-08-25, Jaime) como 2do módulo, debajo de
// Mi día — visibilidad cross-célula de prioridades, pedida explícitamente.
//
// Proyectos/Data/Following son por célula (2026-08-17, Jaime): apuntan a
// `/celula/${celulaActiva}/...` en vez de una ruta plana, para que el
// switcher de célula (GlobalTopBar) y el sidebar cuenten la misma historia
// — cambiar de célula ahí cambia lo que ves acá también. `celulaActiva` sale
// del propio pathname si ya estás dentro de `/celula/[slug]/...`; si estás
// en una página global (Mi día, Configuración) cae a tu propia célula.
function buildPrimaryItems(celulaActiva: string | null): NavItem[] {
  const c = celulaActiva ?? "";
  return [
    { key: "mi-dia", label: "Mi día", href: c ? `/celula/${c}` : "/", icon: Home },
    // Cross-célula (todas ven todas), a diferencia de Proyectos/Data/Following
    // que son por célula — por eso no cuelga de /celula/[slug].
    { key: "delivery", label: "Delivery", href: "/delivery", icon: Flag },
    { key: "proyectos", label: "Proyectos", href: c ? `/celula/${c}/proyectos` : "/proyectos", icon: FolderKanban },
    { key: "data", label: "Data", href: c ? `/celula/${c}/data` : "/data-solicitada", icon: Database },
    { key: "updates", label: "Updates", href: c ? `/celula/${c}/updates` : "/", icon: Rss },
    { key: "metricas", label: "Following", href: c ? `/celula/${c}/following` : "/metricas", icon: BarChart3 },
    { key: "calendario", label: "Calendario", href: "/calendario", icon: Calendar },
    { key: "celulas", label: "Células", href: "/celulas", icon: Network },
    { key: "integraciones", label: "Integraciones", href: "/integraciones", icon: Webhook },
    { key: "configuracion", label: "Configuración", href: "/ajustes", icon: Settings },
  ];
}

// Notas se queda visible fuera de los 6 módulos core, pero marcada "para mí"
// — es la única sección que se queda privada incluso cuando el resto del
// equipo vea este diseño.
const NOTAS_ITEM: NavItem = { key: "notas", label: "Notas", href: "/notas", icon: FileText, tag: "Para mí" };

const GUIAS_ITEM: NavItem = { key: "guias", label: "Guías", href: "/guias", icon: GraduationCap };

// "Mi día" apunta a /celula/[slug] a secas (2026-08-17) — el mismo prefijo
// del que cuelgan Proyectos/Data/Updates/Following. Sin match exacto, ese
// link quedaba "activo" en las cuatro páginas hijas a la vez.
function isActive(pathname: string, href: string, exact = false) {
  if (href === "/" || exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ item, collapsed, active }: { item: NavItem; collapsed: boolean; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
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
    </Link>
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
  const [ownCelulaSlug, setOwnCelulaSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setOwnCelulaSlug(data?.profile?.celulas?.slug ?? null))
      .catch(() => setOwnCelulaSlug(null));
  }, []);

  const celulaEnRuta = pathname.match(/^\/celula\/([^/]+)/)?.[1] ?? null;
  const celulaActiva = celulaEnRuta ?? ownCelulaSlug;
  const primaryItems = buildPrimaryItems(celulaActiva);

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
            {primaryItems.map((item) => (
              <NavLink key={item.key} item={item} collapsed={collapsed} active={isActive(pathname, item.href, item.key === "mi-dia")} />
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
