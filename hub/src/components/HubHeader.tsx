"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type CelulaLink = { nombre: string; slug: string };

type Profile = {
  nombre: string | null;
  email: string | null;
  is_super_admin: boolean;
  is_stakeholder?: boolean;
  celulas?: { slug: string; ve_hub_completo: boolean } | null;
};

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hub-link"
      style={{
        fontSize: 12, fontWeight: 700,
        color: "var(--fg)",
        borderRadius: 8,
        padding: "6px 14px",
        textDecoration: "none",
        display: "flex", alignItems: "center", gap: 6,
      }}
    >
      {children}
    </a>
  );
}

export default function HubHeader({
  title,
  subtitle,
  currentSlug,
}: {
  title: string;
  subtitle: string;
  currentSlug: string;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [otrasCelulas, setOtrasCelulas] = useState<CelulaLink[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        const p: Profile | null = data?.profile ?? null;
        setProfile(p);
        setLoaded(true);
        const fullAccess = p?.is_super_admin || p?.is_stakeholder || !!p?.celulas?.ve_hub_completo;
        if (fullAccess) {
          fetch("/api/celulas")
            .then((r) => r.json())
            .then((celulas) => {
              if (Array.isArray(celulas)) {
                setOtrasCelulas(celulas.map((c) => ({ nombre: c.nombre, slug: c.slug })));
              }
            });
        }
      })
      .catch(() => setLoaded(true));
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.removeItem("darwin-home-routed");
    router.push("/login");
    router.refresh();
  }

  const fullAccess = !!(profile?.is_super_admin || profile?.is_stakeholder || profile?.celulas?.ve_hub_completo);
  const isSuperAdmin = !!profile?.is_super_admin;

  return (
    <header style={{
      background: "#fff", borderBottom: "1px solid var(--border)",
      padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
        {fullAccess ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
            >
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 6 }}>
                  {title} <span style={{ fontSize: 11, color: "var(--muted)" }}>▾</span>
                </h1>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{subtitle}</p>
              </div>
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 8,
                background: "#fff", border: "1px solid var(--border)", borderRadius: 10,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: 200, zIndex: 10, overflow: "hidden",
              }}>
                {(profile?.is_super_admin || profile?.is_stakeholder) && (
                  <a
                    href="/resumen"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", padding: "10px 14px", fontSize: 13,
                      color: "var(--fg)", textDecoration: "none",
                      background: currentSlug === "resumen" ? "var(--bg)" : "transparent",
                      fontWeight: currentSlug === "resumen" ? 700 : 500,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    📊 Resumen ejecutivo
                  </a>
                )}
                {otrasCelulas.map((c) => (
                  <a
                    key={c.slug}
                    href={`/celula/${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", padding: "10px 14px", fontSize: 13,
                      color: "var(--fg)", textDecoration: "none",
                      background: c.slug === currentSlug ? "var(--bg)" : "transparent",
                      fontWeight: c.slug === currentSlug ? 700 : 500,
                    }}
                  >
                    🏠 {c.nombre}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>{title}</h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{subtitle}</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isSuperAdmin && (
          <>
            <HeaderLink href="/iniciativas">📥 Iniciativas</HeaderLink>
            <HeaderLink href="/data-solicitada">📊 Data solicitada</HeaderLink>
            <HeaderLink href="/metricas">📈 Métricas</HeaderLink>
            <HeaderLink href="/celulas">🧬 Células</HeaderLink>
            <HeaderLink href="/admin/usuarios">🔐 Accesos</HeaderLink>
            <HeaderLink href="/pruebas-usuarios">🧪 Pruebas con Usuarios</HeaderLink>
            <HeaderLink href="/notas">📝 Mis notas</HeaderLink>
          </>
        )}
        {loaded && profile && (
          <>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
              {profile.nombre ? `Hola, ${profile.nombre.split(" ")[0]}` : "Hola"}
            </span>
            <button
              onClick={handleLogout}
              className="hub-link"
              style={{
                fontSize: 12, fontWeight: 600,
                color: "var(--muted)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Salir
            </button>
          </>
        )}
      </div>
    </header>
  );
}
