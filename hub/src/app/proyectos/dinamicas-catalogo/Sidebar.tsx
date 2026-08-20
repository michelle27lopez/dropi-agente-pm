"use client";

import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Rows3, CalendarDays } from "lucide-react";

type Section = "dashboard" | "campanas" | "calendario";

const SECTIONS: { key: Section; label: string; href: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", href: "/proyectos/dinamicas-catalogo", icon: LayoutDashboard },
  { key: "campanas", label: "Panel de campañas", href: "/proyectos/dinamicas-catalogo/campanas", icon: Rows3 },
  { key: "calendario", label: "Calendario", href: "/proyectos/dinamicas-catalogo/calendario", icon: CalendarDays },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const active: Section = pathname?.startsWith("/proyectos/dinamicas-catalogo/campanas")
    || pathname?.startsWith("/proyectos/dinamicas-catalogo/planeacion")
    ? "campanas"
    : pathname?.startsWith("/proyectos/dinamicas-catalogo/calendario")
    ? "calendario"
    : "dashboard";

  return (
    <aside style={{
      width: 232, flexShrink: 0, background: "#fff", borderRight: "1px solid var(--border)",
      minHeight: "100vh", position: "sticky", top: 0, alignSelf: "flex-start",
      display: "flex", flexDirection: "column", padding: "20px 14px",
    }}>
      <a href="/proyectos" style={{ fontSize: 12.5, color: "var(--muted)", textDecoration: "none", marginBottom: 18, padding: "0 8px" }}>
        ← Proyectos
      </a>
      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg)", padding: "0 8px", marginBottom: 18 }}>
        Dinámicas de Catálogo
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SECTIONS.map((s) => {
          const isActive = s.key === active;
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => router.push(s.href)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: isActive ? "var(--dropi-tint, #FFF3E0)" : "transparent",
                color: isActive ? "var(--dropi)" : "var(--muted)",
                border: "none", borderRadius: 8, padding: "9px 10px",
                fontSize: 13, fontWeight: isActive ? 700 : 600,
                cursor: isActive ? "default" : "pointer",
                fontFamily: "inherit", textAlign: "left", width: "100%",
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {s.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
