"use client";

import { useEffect, useState } from "react";
import GlobalNav from "./GlobalNav";

// Shell del nav global de Darwin: arranca colapsado a rail de iconos en
// tablet/laptop chico (<1024px), expandido en desktop. En mobile (<768px)
// se vuelve drawer con overlay. Solo se monta para el email gateado en
// layout.tsx — ver [[project_darwin_pd_dashboard]].
export default function GlobalNavShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) setCollapsed(true);
  }, []);

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
