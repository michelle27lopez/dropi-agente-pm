"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Map, BookOpen, Layers, FlaskConical,
  CalendarDays, GanttChartSquare, ListTodo, Truck, FolderKanban, Flame,
} from "lucide-react";

// Navegación del tablero de logística.
//
// Sigue el patrón que ya usa Suppliers en `proyectos/dinamicas-catalogo/Sidebar.tsx`:
// segunda capa neutra para el panel, tokens del hub (--border/--muted/--fg/--dropi),
// activo en naranja-tint. Nada de gradientes ni color pesado en estados inactivos.

const BASE = "/proyectos/logistica";

const SECCIONES = [
  { href: BASE, label: "Indicadores", icon: Activity, exact: true },
  { href: `${BASE}/mapa`, label: "Mapa de la orden", icon: Map },
  { href: `${BASE}/info-logistica`, label: "Info logística", icon: BookOpen },
  { href: `${BASE}/normalizacion-estados`, label: "Normalización de estados", icon: Layers },
  { href: `${BASE}/recolecciones`, label: "Recolecciones", icon: Truck },
  { href: `${BASE}/same-day`, label: "Same Day · demanda", icon: Flame },
  { href: `${BASE}/experimentos`, label: "Experimentos", icon: FlaskConical },
  { href: `${BASE}/updates`, label: "Updates", icon: CalendarDays },
  { href: `${BASE}/cronograma`, label: "Cronograma", icon: GanttChartSquare },
  { href: `${BASE}/pendientes`, label: "Pendientes", icon: ListTodo },
];

export default function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid var(--border)",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        padding: "20px 14px",
      }}
    >
      <Link
        href="/celula/logistica"
        style={{
          fontSize: 12.5,
          color: "var(--muted)",
          textDecoration: "none",
          marginBottom: 4,
          padding: "0 8px",
        }}
      >
        ← Célula Logística
      </Link>
      <Link
        href="/"
        style={{
          fontSize: 12.5,
          color: "var(--muted)",
          textDecoration: "none",
          marginBottom: 18,
          padding: "0 8px",
        }}
      >
        ← Dropi PM Tools
      </Link>

      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "var(--fg)",
          padding: "0 8px",
          marginBottom: 18,
          lineHeight: 1.3,
        }}
      >
        Tablero · Logística
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SECCIONES.map((s) => {
          const activo = s.exact ? pathname === s.href : pathname.startsWith(s.href);
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: activo ? "var(--dropi-tint, #FFF3E0)" : "transparent",
                color: activo ? "var(--dropi)" : "var(--muted)",
                borderRadius: 8,
                padding: "9px 10px",
                fontSize: 13,
                fontWeight: activo ? 700 : 600,
                textDecoration: "none",
                transition: "background 160ms ease, color 160ms ease",
              }}
            >
              <Icon size={16} strokeWidth={activo ? 2.4 : 2} />
              {s.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 18,
          fontSize: 11.5,
          color: "var(--muted)",
          padding: "18px 8px 0",
        }}
      >
        Logistic Success · Dropi
      </div>
    </aside>
  );
}
