"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GlobalNav from "./GlobalNav";
import { useIsEmbedded } from "@/lib/use-is-embedded";

// Rutas públicas de solo pantalla completa (las ve un proveedor real, sin
// login, con su propio look oscuro) — el shell del hub no debe envolverlas
// aunque quien esté logueada sea del equipo (ej. usando ?vista= para QA).
const FULLSCREEN_PATH_PATTERNS = [/\/elegibles\/[^/]+$/, /^\/c\/[^/]+$/];

// Shell del nav global de Darwin: arranca colapsado a rail de iconos en
// tablet/laptop chico (<1024px), expandido en desktop. En mobile (<768px)
// se vuelve drawer con overlay. Solo se monta para el email gateado en
// layout.tsx — ver [[project_darwin_pd_dashboard]].
export default function GlobalNavShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const embedded = useIsEmbedded();
  const pathname = usePathname();
  const isFullscreenRoute = FULLSCREEN_PATH_PATTERNS.some((re) => re.test(pathname));

  useEffect(() => {
    if (window.innerWidth < 1024) setCollapsed(true);
  }, []);

  // Dentro del <iframe> de /metricas, el root layout se vuelve a montar y
  // duplicaría este mismo nav dentro del que ya trae /metricas por fuera.
  if (embedded || isFullscreenRoute) return <>{children}</>;

  return (
    <div className="gnav-shell">
      <GlobalNav
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="gnav-content">
        <button
          type="button"
          className="gnav-mobile-trigger"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        {children}
      </div>
    </div>
  );
}
