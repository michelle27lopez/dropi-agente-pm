"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  Home,
  LayoutDashboard,
  FolderKanban,
  Zap,
  FileText,
  Calendar,
  GraduationCap,
  Settings,
  Map,
  ClipboardList,
  Truck,
  Bug,
  Construction,
  Database,
  BarChart3,
  Inbox,
  FlaskConical,
  Webhook,
} from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

// Nav primario: fijo, no crece con la cantidad de proyectos —
// el listado completo de proyectos vive en /proyectos, no en el menú.
const PRIMARY_ITEMS: NavItem[] = [
  { key: "mi-dia", label: "Mi día", href: "/", icon: Home },
  { key: "panorama", label: "Panorama", href: "/panorama", icon: LayoutDashboard },
  { key: "proyectos", label: "Proyectos", href: "/proyectos", icon: FolderKanban },
  { key: "sprint", label: "Sprint", href: "/sprint", icon: Zap },
  { key: "notas", label: "Notas", href: "/notas", icon: FileText },
  { key: "calendario", label: "Calendario", href: "/calendario", icon: Calendar },
  { key: "data", label: "Data", href: "/data-solicitada", icon: Database },
  { key: "metricas", label: "Métricas", href: "/metricas", icon: BarChart3 },
  { key: "iniciativas", label: "Iniciativas", href: "/iniciativas", icon: Inbox },
  { key: "guias", label: "Guías", href: "/guias", icon: GraduationCap },
  { key: "pruebas-usuarios", label: "Pruebas con Usuarios", href: "/pruebas-usuarios", icon: FlaskConical },
  { key: "integraciones", label: "Integraciones", href: "/integraciones", icon: Webhook },
  { key: "configuracion", label: "Configuración", href: "/ajustes", icon: Settings },
];

// Updates: rama fija de reportería, no son proyectos y no se filtran.
// Mismos 5 destinos que ya vivían en el sidebar de mi-día.
const UPDATES_ITEMS: NavItem[] = [
  { key: "updates-roadmap", label: "Roadmap", href: "/roadmap-s2-2026", icon: Map },
  { key: "updates-cell-board", label: "Weekly Stakeholders", href: "/updates-celula", icon: ClipboardList },
  { key: "updates-weekly-ti", label: "Weekly TI", href: "/weekly", icon: Truck },
  { key: "updates-bugs", label: "Bugs", href: "/bugs", icon: Bug },
  { key: "updates-bloqueos", label: "Bloqueos/Dependencias", href: "/resumen", icon: Construction },
];

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
      title={collapsed ? item.label : undefined}
    >
      <span className="gnav-nav-item__icon">
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="gnav-nav-item__label gnav-hide-on-collapse">{item.label}</span>
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
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.removeItem("darwin-home-routed");
    router.push("/login");
    router.refresh();
  }

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
          <p className="gnav-section__title gnav-hide-on-collapse">Updates</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {UPDATES_ITEMS.map((item) => (
              <NavLink key={item.key} item={item} collapsed={collapsed} active={isActive(pathname, item.href)} />
            ))}
          </div>
        </div>

        <div className="gnav-spacer" />

        <div className="gnav-profile">
          <img
            src="/michelle-avatar.png"
            alt="Michelle"
            width={28}
            height={28}
            className="gnav-profile__avatar"
            style={{ objectFit: "cover" }}
          />
          <div className="gnav-profile__info gnav-hide-on-collapse">
            <p className="gnav-profile__name">Michelle</p>
            <p className="gnav-profile__role">Product Designer</p>
            <button type="button" className="gnav-profile__logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
