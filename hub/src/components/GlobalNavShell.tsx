"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GlobalNav from "./GlobalNav";
import GlobalTopBar from "./GlobalTopBar";
import { useIsEmbedded } from "@/lib/use-is-embedded";

// Rutas públicas de solo pantalla completa (las ve un proveedor real, sin
// login, con su propio look oscuro) — el shell del hub no debe envolverlas
// aunque quien esté logueada sea del equipo (ej. usando ?vista= para QA).
const FULLSCREEN_PATH_PATTERNS = [/\/elegibles\/[^/]+$/, /^\/c\/[^/]+$/];

// Secciones que traen su propia navegación lateral. Ahí el nav global arranca
// colapsado a rail de iconos: dos paneles de ~230px apilados se comían 460px
// antes del contenido, y el tablero de logística pide `max-width: 1120px` que
// nunca alcanzaba. Colapsado son 288px y sí respira.
//
// Es solo el estado INICIAL: si la persona expande a mano, se queda expandida
// el resto de la sesión. No se re-colapsa en cada navegación — pelearle al
// usuario su propia decisión es peor que el ancho que se recupera.
const RUTAS_CON_NAV_PROPIA = [/^\/proyectos\/logistica/];

// Shell del nav global de Darwin: arranca colapsado a rail de iconos en
// tablet/laptop chico (<1024px), expandido en desktop. En mobile (<768px)
// se vuelve drawer con overlay. Solo se monta para el email gateado en
// layout.tsx — ver [[project_darwin_pd_dashboard]].
export default function GlobalNavShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Una vez que la persona toca el toggle, su decisión manda sobre la ruta.
  const [tocadoAMano, setTocadoAMano] = useState(false);
  const embedded = useIsEmbedded();
  const pathname = usePathname();
  const isFullscreenRoute = FULLSCREEN_PATH_PATTERNS.some((re) => re.test(pathname));

  useEffect(() => {
    if (window.innerWidth < 1024) setCollapsed(true);
  }, []);

  useEffect(() => {
    if (tocadoAMano) return;
    if (RUTAS_CON_NAV_PROPIA.some((re) => re.test(pathname))) setCollapsed(true);
  }, [pathname, tocadoAMano]);

  // Dentro del <iframe> de /metricas, el root layout se vuelve a montar y
  // duplicaría este mismo nav dentro del que ya trae /metricas por fuera.
  if (embedded || isFullscreenRoute) return <>{children}</>;

  return (
    <div className="gnav-shell">
      <GlobalNav
        collapsed={collapsed}
        onToggleCollapse={() => {
          setTocadoAMano(true);
          setCollapsed((v) => !v);
        }}
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
        <GlobalTopBar />
        {children}
      </div>
    </div>
  );
}
