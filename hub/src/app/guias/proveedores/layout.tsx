"use client";

import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { useIsEmbedded } from "@/lib/use-is-embedded";

// Base de conocimiento del vertical Proveedores. Vive dentro de /guias y no
// en /proyectos porque no es un proyecto: es la referencia del vertical.
// El índice lateral está en el layout y no en cada página porque los cinco
// temas son rutas hermanas, no secciones de un mismo scroll.

const NAV: { href: string; icon: string; label: string; sub: string }[] = [
  { href: "/guias/proveedores",                 icon: "🧭", label: "Resumen",          sub: "Estado de la evidencia" },
  { href: "/guias/proveedores/perfil",          icon: "👤", label: "Perfil y segmentos", sub: "Quién es el proveedor" },
  { href: "/guias/proveedores/satisfaccion",    icon: "📊", label: "Satisfacción",     sub: "NPS, CSAT y CES" },
  { href: "/guias/proveedores/funcionalidades", icon: "🧱", label: "Funcionalidades",  sub: "Producción y pipeline" },
  { href: "/guias/proveedores/onboarding",      icon: "🛬", label: "Onboarding",       sub: "Blueprint de servicio" },
  { href: "/guias/proveedores/blueprint",       icon: "🗺️", label: "Blueprint general", sub: "Uso completo de la plataforma" },
  { href: "/guias/proveedores/herramientas",    icon: "🧰", label: "Herramientas",     sub: "Ecosistema de software" },
];

export default function ProveedoresLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmbedded = useIsEmbedded();
  const actual = NAV.find((n) => n.href === pathname);

  return (
    <div style={{ minHeight: "100vh", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      {!isEmbedded && (
        <header
          style={{
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 0",
            flexShrink: 0,
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
            <Breadcrumb
              items={[
                { label: "Guías", href: "/guias" },
                { label: "Proveedores", href: "/guias/proveedores" },
                { label: actual?.label ?? "Resumen" },
              ]}
            />
          </div>
        </header>
      )}

      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px var(--content-padding-x)",
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        <aside
          className="proveedores-nav"
          style={{ width: 224, flexShrink: 0, alignSelf: "flex-start", position: "sticky", top: 24 }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              marginBottom: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Vertical Proveedores
          </div>
          {NAV.map((item) => {
            const activo = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 10px",
                  marginBottom: 2,
                  borderRadius: 9,
                  textDecoration: "none",
                  background: activo ? "var(--dropi-light)" : "transparent",
                  borderLeft: activo ? "3px solid var(--dropi)" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                <span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: activo ? "var(--dropi)" : "#374151",
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ display: "block", fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}>
                    {item.sub}
                  </span>
                </span>
              </a>
            );
          })}
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .proveedores-nav { display: none; }
        }
      `}</style>
    </div>
  );
}
