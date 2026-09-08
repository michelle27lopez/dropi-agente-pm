"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Users } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { MI_DIA_OWNER_EMAIL } from "@/lib/sprint-access";

type CelulaLink = { nombre: string; slug: string };

type Profile = {
  nombre: string | null;
  email: string | null;
  is_super_admin: boolean;
  is_stakeholder?: boolean;
  celulas?: { slug: string; ve_hub_completo: boolean } | null;
};

// Topbar global de Darwin (rediseño Figma, 2026-08-04): usuario + logout y
// selector de célula viven arriba, al lado del avatar — el sidebar
// (GlobalNav) queda solo con navegación. Reemplaza el bloque de perfil que
// antes vivía al fondo del sidebar y el dropdown de célula de HubHeader
// (que sigue existiendo para el resto del equipo, no gated a Michelle).
export default function GlobalTopBar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [otrasCelulas, setOtrasCelulas] = useState<CelulaLink[]>([]);
  const [celulaMenuOpen, setCelulaMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const celulaMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  // Título de contexto (2026-08-17, Jaime): sin esto no había ninguna señal
  // de en qué célula estás parado — HubHeader (que sí mostraba el nombre)
  // dejó de renderizarse en cuanto el sidebar se volvió global.
  const [celulaTitulo, setCelulaTitulo] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (celulaMenuRef.current && !celulaMenuRef.current.contains(e.target as Node)) {
        setCelulaMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        const p: Profile | null = data?.profile ?? null;
        setProfile(p);
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
      });
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setCelulaTitulo("Mi día");
      return;
    }
    const slug = pathname.match(/^\/celula\/([^/]+)/)?.[1];
    if (!slug) {
      setCelulaTitulo(null);
      return;
    }
    const cacheado = otrasCelulas.find((c) => c.slug === slug);
    if (cacheado) {
      setCelulaTitulo(cacheado.nombre);
      return;
    }
    fetch(`/api/celulas/${slug}`)
      .then((res) => res.json())
      .then((data) => setCelulaTitulo(data?.nombre ?? null))
      .catch(() => setCelulaTitulo(null));
  }, [pathname, otrasCelulas]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.removeItem("darwin-home-routed");
    router.push("/login");
    router.refresh();
  }

  const fullAccess = !!(profile?.is_super_admin || profile?.is_stakeholder || profile?.celulas?.ve_hub_completo);
  const esMichelle = profile?.email?.toLowerCase() === MI_DIA_OWNER_EMAIL;
  const inicial = (profile?.nombre?.trim()?.[0] || profile?.email?.[0] || "?").toUpperCase();

  return (
    <div className="gnav-topbar">
      {celulaTitulo && (
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{celulaTitulo}</span>
      )}
      <div className="gnav-topbar__spacer" />
      <div className="gnav-topbar__actions">
        {fullAccess && otrasCelulas.length > 0 && (
          <div ref={celulaMenuRef} className="gnav-topbar__menu-anchor">
            <button
              type="button"
              className="gnav-topbar__pill"
              onClick={() => setCelulaMenuOpen((v) => !v)}
            >
              <Users size={14} strokeWidth={2} />
              Célula
              <ChevronDown size={14} strokeWidth={2} />
            </button>
            {celulaMenuOpen && (
              <div className="gnav-topbar__dropdown">
                {(profile?.is_super_admin || profile?.is_stakeholder) && (
                  <>
                    <Link href="/resumen" className="gnav-topbar__dropdown-item" onClick={() => setCelulaMenuOpen(false)}>
                      Resumen ejecutivo
                    </Link>
                    <Link href="/roadmap" className="gnav-topbar__dropdown-item" onClick={() => setCelulaMenuOpen(false)}>
                      Roadmap
                    </Link>
                  </>
                )}
                {otrasCelulas.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/celula/${c.slug}`}
                    className="gnav-topbar__dropdown-item"
                    onClick={() => setCelulaMenuOpen(false)}
                  >
                    {c.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {profile && (
          <div ref={userMenuRef} className="gnav-topbar__menu-anchor">
            <button
              type="button"
              className="gnav-topbar__user"
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              {esMichelle ? (
                <img
                  src="/michelle-avatar.png"
                  alt={profile.nombre || "Perfil"}
                  width={28}
                  height={28}
                  className="gnav-topbar__avatar"
                />
              ) : (
                <span
                  className="gnav-topbar__avatar"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--dropi-light)", color: "var(--dropi)",
                    fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {inicial}
                </span>
              )}
              <span className="gnav-topbar__user-name">{profile.nombre ? profile.nombre.split(" ")[0] : "Perfil"}</span>
              <ChevronDown size={14} strokeWidth={2} />
            </button>
            {userMenuOpen && (
              <div className="gnav-topbar__dropdown gnav-topbar__dropdown--right">
                <div className="gnav-topbar__dropdown-header">
                  <p className="gnav-topbar__dropdown-name">{profile.nombre || "Perfil"}</p>
                  {esMichelle && <p className="gnav-topbar__dropdown-role">Product Designer</p>}
                </div>
                <button type="button" className="gnav-topbar__dropdown-item gnav-topbar__dropdown-item--danger" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
