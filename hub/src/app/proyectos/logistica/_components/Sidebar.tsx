"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Map, BookOpen, FlaskConical, ChevronRight,
  CalendarDays, GanttChartSquare, ListTodo, FolderKanban, ClipboardCheck,
} from "lucide-react";
import { etapas, proyectos } from "@/app/proyectos/logistica/_lib/data";

// Navegación del tablero de logística.
//
// UNA SOLA LISTA. Antes eran dos bloques —"Tablero" y "El viaje de la orden"—
// con dos lenguajes visuales distintos (iconos arriba, números abajo) y el
// concepto duplicado: "Mapa de la orden" vivía arriba y las etapas de ese mismo
// mapa, abajo. Ahora el mapa ES el contenedor: se despliega y adentro están sus
// etapas, y dentro de cada etapa sus iniciativas.
//
//   Mapa de la orden ⌄
//     2 Confirmación ● 3 ⌄
//        Autoconfirmación de órdenes
//
// Se abre sola la ruta hasta la página actual, así que en reposo el panel cabe
// entero sin scroll: lo que se ve es el contexto de dónde estás, no las 16
// iniciativas a la vez.
//
// Es el primer `aria-expanded` del repo; los ~10 plegables ad-hoc que ya
// existían no tienen ninguno.

const BASE = "/proyectos/logistica";

const SECCIONES = [
  { href: BASE, label: "Indicadores", icon: Activity, exact: true },
  // El mapa no lleva `icon` en la lista porque se renderiza aparte: es el único
  // ítem desplegable.
  { href: `${BASE}/iniciativas`, label: "Iniciativas", icon: FolderKanban },
  { href: `${BASE}/experimentos`, label: "Experimentos", icon: FlaskConical, exact: true },
  { href: `${BASE}/cronograma`, label: "Cronograma", icon: GanttChartSquare },
  { href: `${BASE}/pendientes`, label: "Pendientes", icon: ListTodo },
  // Va con Pendientes y no con Iniciativas porque es trabajo por hacer, no una
  // vista del portafolio: son los campos de Jira que la API no puede escribir.
  { href: `${BASE}/documentacion-jira`, label: "Llenar Jira", icon: ClipboardCheck },
  { href: `${BASE}/updates`, label: "Updates", icon: CalendarDays },
  { href: `${BASE}/info-logistica`, label: "Info logística", icon: BookOpen },
];

// Rutas que se llevan la ventana entera y por eso no muestran el panel.
//
// Son las que tienen su propia navegación adentro y compiten con la de acá: el
// mapa de recolecciones navega país → departamento → municipio, y el panel al
// lado le quita justo el ancho que necesita. Cada una de estas rutas debe
// ofrecer su propia vuelta al tablero, porque acá se queda sin ella.
const SIN_PANEL = [`${BASE}/recolecciones/mapa`];

const TONO: Record<string, string> = {
  malo: "var(--red)",
  alerta: "var(--amber)",
  bueno: "var(--green)",
};

/** La URL de una iniciativa: su pantalla propia si la tiene, si no su ficha. */
function destino(p: (typeof proyectos)[number]) {
  return p.vista ?? p.entregable ?? `${BASE}/proyecto/${p.slug}`;
}

function activoPara(href: string, pathname: string) {
  // La ficha se compara exacta; una vista propia con `startsWith`, para que
  // /recolecciones siga marcado dentro de /recolecciones/mapa.
  return href.includes("/proyecto/") ? pathname === href : pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname() ?? "";

  const proyectoActivo = proyectos.find((p) => activoPara(destino(p), pathname));
  const etapaDeLaRuta = proyectoActivo?.etapa ?? null;
  const rutaEnElMapa = !!proyectoActivo || pathname.startsWith(`${BASE}/mapa`);

  const [mapa, setMapa] = useState<boolean | null>(null);
  const [etapasAbiertas, setEtapasAbiertas] = useState<Record<string, boolean>>({});

  if (SIN_PANEL.includes(pathname)) return null;

  // Sin interacción manda la ruta; en cuanto el usuario toca algo, su decisión
  // gana sobre el automático.
  const mapaAbierto = mapa ?? rutaEnElMapa;
  const etapaAbierta = (n: string) => etapasAbiertas[n] ?? n === etapaDeLaRuta;

  return (
    <aside style={ASIDE}>
      <Link href="/celula/logistica" style={VOLVER}>
        ← Célula Logística
      </Link>
      <Link href="/" style={{ ...VOLVER, marginBottom: 14 }}>
        ← Dropi PM Tools
      </Link>

      <div style={TITULO}>Tablero · Logística</div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ItemNav
          href={SECCIONES[0].href}
          label={SECCIONES[0].label}
          Icon={SECCIONES[0].icon}
          activo={pathname === SECCIONES[0].href}
        />

        {/* ── El mapa, desplegable ─────────────────────────────────────────── */}
        <button
          type="button"
          aria-expanded={mapaAbierto}
          onClick={() => setMapa(!mapaAbierto)}
          style={{
            ...FILA,
            ...(pathname.startsWith(`${BASE}/mapa`) ? ACTIVO : INACTIVO),
            width: "100%",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
          }}
          className="nav-item"
        >
          <Map size={15} strokeWidth={2} style={{ flex: "none" }} />
          <span style={{ flex: 1, minWidth: 0 }}>Mapa de la orden</span>
          <ChevronRight size={13} strokeWidth={2.2} className="nav-chevron" style={CHEVRON(mapaAbierto)} />
        </button>

        {mapaAbierto &&
          etapas.map((etapa) => {
            const suyas = proyectos.filter((p) => p.etapa === etapa.nombre);
            const abierta = etapaAbierta(etapa.nombre);
            const contieneActiva = etapa.nombre === etapaDeLaRuta;

            return (
              <div key={etapa.n}>
                <button
                  type="button"
                  aria-expanded={abierta}
                  onClick={() =>
                    setEtapasAbiertas((prev) => ({ ...prev, [etapa.nombre]: !abierta }))
                  }
                  style={{
                    ...FILA,
                    paddingLeft: 26,
                    fontWeight: contieneActiva ? 600 : 500,
                    color: contieneActiva ? "var(--fg)" : "var(--muted)",
                    background: "transparent",
                    width: "100%",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                  className="nav-item"
                >
                  <ChevronRight size={11} strokeWidth={2.2} className="nav-chevron" style={CHEVRON(abierta)} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: "var(--muted)", marginRight: 4 }}>{etapa.n}</span>
                    {etapa.nombre}
                  </span>
                  {/* La fuga era "fuga 1" en rojo y se leía como error. Un punto
                      del tono dice lo mismo sin gritar; el detalle va en title. */}
                  {etapa.fuga?.n && (
                    <span
                      title={`Fuga ${etapa.fuga.n} · ${etapa.fuga.label}`}
                      aria-label={`Fuga ${etapa.fuga.n}`}
                      style={{
                        width: 5,
                        height: 5,
                        flex: "none",
                        borderRadius: 999,
                        background: TONO[etapa.fuga.tono],
                      }}
                    />
                  )}
                  <span style={CONTEO}>{suyas.length}</span>
                </button>

                {abierta &&
                  suyas.map((p) => {
                    const href = destino(p);
                    const activo = activoPara(href, pathname);
                    return (
                      <Link
                        key={p.slug}
                        href={href}
                        title={p.nombre}
                        className="nav-item"
                        style={{
                          ...FILA,
                          display: "-webkit-box",
                          paddingLeft: 41,
                          fontWeight: activo ? 600 : 500,
                          lineHeight: 1.35,
                          ...(activo ? ACTIVO : INACTIVO),
                          // Dos líneas como techo: el nombre más largo tiene 53
                          // caracteres y llegaba a ocupar tres. El `title`
                          // conserva el nombre completo.
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.destacado && "⭐ "}
                        {p.nombre}
                      </Link>
                    );
                  })}
              </div>
            );
          })}

        {SECCIONES.slice(1).map((s) => (
          <ItemNav
            key={s.href}
            href={s.href}
            label={s.label}
            Icon={s.icon}
            activo={s.exact ? pathname === s.href : pathname.startsWith(s.href)}
          />
        ))}
      </nav>

      <div style={PIE}>Logistic Success · Dropi</div>
    </aside>
  );
}

function ItemNav({
  href, label, Icon, activo,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  activo: boolean;
}) {
  return (
    <Link href={href} className="nav-item" style={{ ...FILA, ...(activo ? ACTIVO : INACTIVO) }}>
      <Icon size={15} strokeWidth={activo ? 2.4 : 2} style={{ flex: "none" }} />
      {label}
    </Link>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────
// Compactos a propósito: la versión anterior gastaba el alto en padding de 8px,
// dos cabeceras de grupo y un título que envolvía a dos líneas, y el panel no
// cabía en pantalla.

const ASIDE: React.CSSProperties = {
  width: 226,
  flexShrink: 0,
  background: "#fff",
  borderRight: "1px solid var(--border)",
  minHeight: "100vh",
  maxHeight: "100vh",
  overflowY: "auto",
  position: "sticky",
  top: 0,
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  padding: "16px 10px",
};

// Todos los var() llevan respaldo en píxeles a propósito. `.log-root` fija
// `font: 15px` (tablero.css:52), así que un token que no resuelva no rompe:
// la declaración se descarta y el texto hereda 15px en silencio — que es
// exactamente lo que pasó cuando el dev server servía un globals.css viejo.
// Con el respaldo, lo peor que puede pasar es que se vea bien.

const VOLVER: React.CSSProperties = {
  fontSize: "var(--fs-label, 11px)",
  lineHeight: 1.5,
  color: "var(--muted)",
  textDecoration: "none",
  padding: "0 8px",
};

const TITULO: React.CSSProperties = {
  fontSize: "var(--fs-title, 16px)",
  fontWeight: 600,
  lineHeight: "var(--lh-title, 1.3)",
  color: "var(--fg)",
  padding: "0 8px",
  marginBottom: 12,
};

// Un solo tamaño para toda la navegación. La jerarquía la dan la sangría y el
// peso, no el cuerpo de letra: mezclar 13 y 11 hacía que los dos niveles se
// leyeran como dos componentes distintos en vez de como un árbol.
const FILA: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 7,
  padding: "6px 8px",
  fontSize: "var(--fs-label, 11px)",
  lineHeight: 1.4,
  textDecoration: "none",
};

// `--dropi-tint` no está definida en ninguna hoja del repo: el sidebar la usaba
// y siempre caía al fallback. `--dropi-light` sí existe y vale lo mismo.
const ACTIVO: React.CSSProperties = {
  background: "var(--dropi-light)",
  color: "var(--dropi)",
  fontWeight: 600,
};

const INACTIVO: React.CSSProperties = {
  background: "transparent",
  color: "var(--muted)",
  fontWeight: 500,
};

const CONTEO: React.CSSProperties = {
  flex: "none",
  fontSize: "var(--fs-label, 11px)",
  fontWeight: 600,
  color: "var(--muted)",
  fontVariantNumeric: "tabular-nums",
};

const PIE: React.CSSProperties = {
  marginTop: "auto",
  fontSize: "var(--fs-label, 11px)",
  color: "var(--muted)",
  padding: "16px 8px 0",
};

const CHEVRON = (abierto: boolean): React.CSSProperties => ({
  flex: "none",
  transform: abierto ? "rotate(90deg)" : "none",
});
