"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MoreVertical, Search, Trash2 } from "lucide-react";
import HubFooter from "@/components/HubFooter";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ModoLecturaBanner } from "@/components/ModoLecturaBanner";
import { type Item, matchesQuery } from "@/components/HomeSections";
import { proyectoToItem } from "@/lib/curated-projects";
import { ESTADOS_DISCOVERY, ESTADOS_POC, ESTADOS_DELIVERY, type Proyecto } from "@/components/ProjectCard";
import { type Fase, faseDe, FASE_LABEL, FASE_COLOR } from "@/lib/fase";

type MapaEtapas = import("../_lib/logistica-etapas").MapaEtapas;

// Estados válidos de `estado_interno` según `type` — mismo mapeo que usa
// ProjectCard y el endpoint /api/proyectos/[slug].
function estadosValidosPara(type: string | null) {
  if (type === "POC") return ESTADOS_POC;
  if (type === "Delivery Proyecto") return ESTADOS_DELIVERY;
  return ESTADOS_DISCOVERY;
}

// Landing de Proyectos por célula (2026-08-17, Jaime): antes vivía en
// /proyectos a secas, siempre resuelto a la célula del usuario logueado —
// eso rompía el switcher de célula (GlobalTopBar), que cambiaba de home pero
// el sidebar seguía mostrando Suppliers. Ahora la célula sale de la URL, así
// el switcher y el sidebar cuentan la misma historia. `/proyectos` (plano)
// queda como redirect a la célula propia — ver ese archivo.
//
// Tabs de fase: Discovery/POC/Delivery/Following/Todos según
// [[project_nomenclatura_fases]]. Usa el mecanismo REAL que Jaime ya
// construyó en Darwin (migraciones 036 + 039) — `type` ubica cada fase
// (Following incluido, es un `type` real de la tabla, no depende de Jira), y
// `estado_interno` es el sub-estado editable a mano (mismo selector que ya
// existe en ProjectCard).
//
// Preview: sigue gateada a isMiDiaOwner en el layout — no se globaliza a
// todas las células hasta aprobación explícita.
const FASES: { value: Fase | "todas"; label: string }[] = [
  { value: "discovery", label: "Discovery" },
  { value: "poc", label: "POC" },
  { value: "delivery", label: "Delivery" },
  { value: "following", label: "Following" },
  { value: "todas", label: "Todos" },
];

// Varios prototipos por proyecto se guardan en `prototype_url` separados por
// coma o salto de línea — sin migración nueva mientras se decide si esto
// necesita su propia columna. Si solo hay uno, se abre directo; si hay más,
// se despliega un dropdown. Se descarta cualquier valor que no empiece con
// "/" o "http" — varios proyectos viejos quedaron con rutas relativas mal
// guardadas (sin "/" inicial, apuntando a una carpeta que no existe en
// public/) que producían un 404 real al clickear.
function parsePrototypeUrls(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
    .map((u) => u.trim())
    .filter((u) => u.startsWith("/") || u.startsWith("http"));
}

export default function ProyectosPorCelulaPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fase, setFase] = useState<Fase | "todas">("todas");
  const [loading, setLoading] = useState(true);
  const [celulaId, setCelulaId] = useState<string | null>(null);
  const [celulaNombre, setCelulaNombre] = useState<string | null>(null);
  const [proyectosReales, setProyectosReales] = useState<Proyecto[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Proyecto | null>(null);
  // Alta de POC / Delivery Proyecto desde la tabla (menú "⋮" de cada fila
  // Discovery) — evita entrar a la ficha solo para colgar un hijo.
  const [crearTarget, setCrearTarget] = useState<{ parent: Proyecto; tipo: "POC" | "Delivery Proyecto" } | null>(null);
  // Modo lectura (2026-08-17, Jaime): mismo criterio que la home de célula —
  // ver la tabla de una célula que no es la tuya ya no deja editar/eliminar
  // sin distinción visual. "Editar de todos modos" es el escape hatch.
  const [ownCelulaId, setOwnCelulaId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [modoEdicionForzado, setModoEdicionForzado] = useState(false);
  // Filtro de etapa del viaje de la orden (2026-08-17, Jaime) — antes vivía
  // en el grid viejo de la home de Logística, ahora vive acá. Se pide con
  // import() dinámico porque arrastra ~1.500 líneas del tablero de
  // logística, que no debe entrar al bundle de las demás células.
  const [mapaEtapas, setMapaEtapas] = useState<MapaEtapas | null>(null);
  const [etapaFiltro, setEtapaFiltro] = useState<string | null>(null);
  const isLogistica = params.slug === "logistica";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/celulas/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setCelulaId(data?.id ?? null);
        setCelulaNombre(data?.nombre ?? null);
        if (Array.isArray(data?.proyectos)) setProyectosReales(data.proyectos);
        else setProyectosReales([]);
      })
      .finally(() => setLoading(false));

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setOwnCelulaId(data?.profile?.celula_id ?? null);
        setIsSuperAdmin(!!data?.profile?.is_super_admin);
      })
      .catch(() => {});

    setMapaEtapas(null);
    setEtapaFiltro(null);
    if (params.slug === "logistica") {
      import("../_lib/logistica-etapas")
        .then((m) => setMapaEtapas(m.mapaEtapas()))
        .catch((err) => console.error("Error cargando las etapas de logística:", err));
    }
  }, [params.slug]);

  const esCelulaPropia = !!ownCelulaId && ownCelulaId === celulaId;
  const canEditar = esCelulaPropia || modoEdicionForzado;

  // Iniciativas del tablero de logística sin ficha en Darwin todavía — se
  // comprueban las dos llaves de cada una (project_code o su ticket de Jira,
  // ver `codigoDarwin` en el tablero), porque tener `codigo` en data.ts no
  // prueba que exista la fila en Supabase.
  const codigosEnDarwin = new Set(
    proyectosReales.map((p) => p.project_code?.toUpperCase()).filter(Boolean) as string[],
  );
  const sinFichaDarwin = (mapaEtapas?.iniciativas ?? []).filter((i) => {
    const registrada = i.codigos.some((c) => codigosEnDarwin.has(c));
    return !registrada && (!etapaFiltro || i.etapa === etapaFiltro);
  });

  // Edición rápida tipo Jira: cambiar el estado desde la tabla, sin entrar
  // al proyecto — mismo PATCH que ya usa ProjectCard en el detalle.
  async function handleEstadoChange(id: string, estado: string) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: estado }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProyectosReales((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  // Eliminación física — se apoya en la FK sin CASCADE de parent_project_id/
  // related_poc_id/related_delivery_id: si el borrado falla por 23503, el
  // proyecto todavía tiene POC/Delivery/Following asociados.
  async function handleDeleteConfirm(proyecto: Proyecto) {
    const res = await fetch(`/api/proyectos/${proyecto.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "No se pudo eliminar el proyecto.");
    }
    setProyectosReales((prev) => prev.filter((p) => p.id !== proyecto.id));
    setDeleteTarget(null);
  }

  // Crea un POC o Delivery Proyecto colgando de un Discovery project sin
  // abrir su ficha — mismo POST /api/proyectos/[parentId] que usa ProjectCard
  // en el detalle. El hijo nuevo entra directo a la tabla que le toca (POC →
  // "Pruebas de concepto", Delivery → "Proyectos") y el conteo de "Asociados"
  // se recalcula solo desde `childCounts`.
  async function handleCrearHijo(
    parent: Proyecto,
    tipo: "POC" | "Delivery Proyecto",
    name: string,
    summary: string,
    relatedPocId: string | null,
  ) {
    const body =
      tipo === "POC"
        ? { name, summary }
        : { name, summary, type: "Delivery Proyecto", related_poc_id: relatedPocId };
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "No se pudo crear.");
    }
    const created = await res.json();
    setProyectosReales((prev) => [...prev, created]);
    setCrearTarget(null);
  }

  // POC hermanos (mismo Discovery padre) entre los que un Delivery Proyecto
  // nuevo puede elegir su `related_poc_id` opcional.
  const siblingPocs = crearTarget
    ? proyectosReales.filter((p) => p.type === "POC" && p.parent_project_id === crearTarget.parent.id)
    : [];

  const porFase = (p: Proyecto) => fase === "todas" || faseDe(p.type) === fase;
  // Fuera de logística `mapaEtapas` siempre es null, así que esto no filtra
  // nada para el resto de células.
  const pasaEtapa = (p: Proyecto) => {
    if (!etapaFiltro || !mapaEtapas) return true;
    const codigo = p.project_code?.toUpperCase();
    return !!codigo && mapaEtapas.etapaPorCodigo[codigo] === etapaFiltro;
  };

  function toRows(source: Proyecto[]) {
    return source
      .filter(porFase)
      .filter(pasaEtapa)
      .map((proyecto) => {
        const item = proyectoToItem(proyecto);
        // La ficha de un proyecto de logística vive en el tablero, no en
        // /proyectos/<código> — sin este override la fila enlaza a un 404.
        const codigo = proyecto.project_code?.toUpperCase();
        const slugTablero = codigo ? mapaEtapas?.slugPorCodigo[codigo] : undefined;
        return { proyecto, item: slugTablero ? { ...item, url: `/proyectos/logistica/proyecto/${slugTablero}` } : item };
      })
      .filter((row): row is { proyecto: Proyecto; item: Item } => row.item !== null)
      .filter((row) => matchesQuery(row.item, query));
  }

  const proyectos = toRows(proyectosReales.filter((p) => p.type !== "POC"));
  const poc = toRows(proyectosReales.filter((p) => p.type === "POC"));

  const hasResults = proyectos.length + poc.length > 0;

  // Cuántos POC/Delivery Proyecto cuelgan de cada Discovery project — sale
  // gratis del mismo fetch de la célula, sin llamada extra.
  const childCounts = new Map<string, { poc: number; delivery: number }>();
  for (const p of proyectosReales) {
    if (!p.parent_project_id) continue;
    const entry = childCounts.get(p.parent_project_id) ?? { poc: 0, delivery: 0 };
    if (p.type === "POC") entry.poc++;
    if (p.type === "Delivery Proyecto") entry.delivery++;
    childCounts.set(p.parent_project_id, entry);
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="gnav-page" style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>
          Proyectos {celulaNombre && <span style={{ color: "var(--muted)", fontWeight: 600 }}>· {celulaNombre}</span>}
        </h1>

        {!esCelulaPropia && isSuperAdmin && (
          <div style={{ marginTop: 20 }}>
            <ModoLecturaBanner activo={modoEdicionForzado} onToggle={() => setModoEdicionForzado((v) => !v)} />
          </div>
        )}

        <div className="proy-search-wrap" style={{ position: "relative", margin: "32px 0 20px" }}>
          <Search
            size={20}
            strokeWidth={1.8}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-500)", pointerEvents: "none" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyecto…"
            className="proy-search"
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {FASES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFase(f.value)}
              style={{
                fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                padding: "6px 14px", borderRadius: 999,
                border: `1px solid ${fase === f.value ? "var(--dropi)" : "var(--border)"}`,
                background: fase === f.value ? "var(--dropi-light)" : "var(--card)",
                color: fase === f.value ? "var(--dropi)" : "var(--muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtro por etapa del viaje de la orden — solo logística. */}
        {mapaEtapas && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: "0 0 10px" }}>
              Etapa del viaje de la orden
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ n: 0, nombre: "Todas", total: mapaEtapas.chips.reduce((acc, c) => acc + c.total, 0) }, ...mapaEtapas.chips].map((c) => {
                const activa = c.n === 0 ? etapaFiltro === null : etapaFiltro === c.nombre;
                return (
                  <button
                    key={c.nombre}
                    onClick={() => setEtapaFiltro(c.n === 0 ? null : c.nombre)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      padding: "6px 12px", borderRadius: 999,
                      color: activa ? "var(--dropi)" : "var(--fg)",
                      background: activa ? "var(--dropi-light)" : "var(--card)",
                      border: `1px solid ${activa ? "var(--dropi)" : "var(--border)"}`,
                    }}
                  >
                    {c.n > 0 && <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{c.n}</span>}
                    {c.nombre}
                    <span style={{ color: "var(--muted)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{c.total}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>
        )}

        {!loading && !hasResults && (
          <p style={{ fontSize: 13, color: "var(--muted)", padding: "24px 0", textAlign: "center" }}>
            Sin resultados{query ? ` para "${query}"` : ""}.
          </p>
        )}

        {proyectos.length > 0 && (
          <div style={{ marginBottom: poc.length ? 40 : 0 }}>
            <ProjectsTable
              title="Proyectos"
              rows={proyectos}
              router={router}
              onEstadoChange={handleEstadoChange}
              onDeleteClick={setDeleteTarget}
              onCrearHijo={(parent, tipo) => setCrearTarget({ parent, tipo })}
              childCounts={childCounts}
              canEditar={canEditar}
            />
          </div>
        )}
        {poc.length > 0 && (
          <ProjectsTable
            title="Pruebas de concepto"
            rows={poc}
            router={router}
            onEstadoChange={handleEstadoChange}
            onDeleteClick={setDeleteTarget}
            onCrearHijo={(parent, tipo) => setCrearTarget({ parent, tipo })}
            childCounts={childCounts}
            canEditar={canEditar}
          />
        )}

        {/* Iniciativas del tablero de logística que aún no tienen ficha en
            Darwin. Van como chips y no como fila: que falte la ficha es el
            dato, y una fila más lo escondería. */}
        {sinFichaDarwin.length > 0 && (
          <div style={{ marginTop: 32, border: "1px dashed var(--border)", borderRadius: 12, padding: "12px 14px", background: "var(--bg)" }}>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 8px", fontWeight: 500 }}>
              En el tablero · sin ficha en Darwin
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sinFichaDarwin.map((i) => (
                <Link
                  key={i.slug}
                  href={`/proyectos/logistica/proyecto/${i.slug}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 500, color: "var(--fg)", textDecoration: "none",
                    background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: 999, padding: "6px 12px",
                  }}
                >
                  <span style={{ color: "var(--warning)" }} aria-hidden="true">○</span>
                  {i.destacado && <span aria-hidden="true">⭐</span>}
                  {i.nombre}
                  {!etapaFiltro && <span style={{ color: "var(--muted)", fontSize: 11 }}>{i.etapa}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <HubFooter />

      {deleteTarget && (
        <DeleteConfirmModal
          nombre={deleteTarget.name}
          codigo={deleteTarget.project_code}
          childCount={(childCounts.get(deleteTarget.id)?.poc ?? 0) + (childCounts.get(deleteTarget.id)?.delivery ?? 0)}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteConfirm(deleteTarget)}
        />
      )}

      {crearTarget && (
        <CrearHijoModal
          parent={crearTarget.parent}
          tipo={crearTarget.tipo}
          siblingPocs={siblingPocs}
          onCancel={() => setCrearTarget(null)}
          onConfirm={(name, summary, relatedPocId) =>
            handleCrearHijo(crearTarget.parent, crearTarget.tipo, name, summary, relatedPocId)
          }
        />
      )}
    </main>
  );
}

type Row = { proyecto: Proyecto; item: Item };

type RouterLike = { push: (href: string) => void };

function ProjectsTable({
  title,
  rows,
  router,
  onEstadoChange,
  onDeleteClick,
  onCrearHijo,
  childCounts,
  canEditar,
}: {
  title: string;
  rows: Row[];
  router: RouterLike;
  onEstadoChange: (id: string, estado: string) => void;
  onDeleteClick: (proyecto: Proyecto) => void;
  onCrearHijo: (parent: Proyecto, tipo: "POC" | "Delivery Proyecto") => void;
  childCounts: Map<string, { poc: number; delivery: number }>;
  canEditar: boolean;
}) {
  return (
    <div>
      {title !== "Proyectos" && (
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          {title}
        </p>
      )}
      <div className="proytable-wrap" style={{ overflowX: "auto" }}>
        <table className="proytable">
          <thead>
            <tr>
              <th style={{ width: 68 }}></th>
              <th>Proyecto</th>
              <th style={{ width: 110 }}>Código</th>
              <th style={{ width: 110 }}>Fase</th>
              <th style={{ width: 130 }}>Asociados</th>
              <th style={{ width: 160 }}>Estado</th>
              <th style={{ width: 150 }}>Prototipo</th>
              <th style={{ width: 32 }}></th>
              <th style={{ width: 32 }}></th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, proyecto }) => {
              const isExternal = item.url?.startsWith("http");
              const prototypeUrls = parsePrototypeUrls(proyecto.prototype_url);
              const fase = faseDe(proyecto.type);
              const counts = childCounts.get(proyecto.id);
              return (
                <tr
                  key={item.key}
                  onClick={() => {
                    if (!item.url) return;
                    if (isExternal) window.open(item.url, "_blank", "noopener,noreferrer");
                    else router.push(item.url);
                  }}
                >
                  <td>
                    <span className="proytable-icon">{item.icon}</span>
                  </td>
                  <td>
                    <a
                      href={item.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="proytable-name"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td>
                    <span className="proytable-code">{proyecto.project_code ?? "—"}</span>
                  </td>
                  <td>
                    <span className="proytable-badge" style={{ background: FASE_COLOR[fase] }}>
                      {FASE_LABEL[fase]}
                    </span>
                  </td>
                  <td>
                    {counts && (counts.poc > 0 || counts.delivery > 0) ? (
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>
                        {counts.poc > 0 && `${counts.poc} POC`}
                        {counts.poc > 0 && counts.delivery > 0 && " · "}
                        {counts.delivery > 0 && `${counts.delivery} Delivery`}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--gray-300)" }}>—</span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <EstadoEditor
                      proyecto={proyecto}
                      editable={canEditar}
                      onChange={(estado) => onEstadoChange(proyecto.id, estado)}
                    />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <PrototypeLinks urls={prototypeUrls} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {canEditar && fase === "discovery" && (
                      <RowActionsMenu
                        onCrearPoc={() => onCrearHijo(proyecto, "POC")}
                        onCrearDelivery={() => onCrearHijo(proyecto, "Delivery Proyecto")}
                      />
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {canEditar && (
                      <button
                        type="button"
                        onClick={() => onDeleteClick(proyecto)}
                        title="Eliminar proyecto"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: 28, height: 28, borderRadius: 8, border: "none",
                          background: "transparent", color: "var(--gray-400)", cursor: "pointer",
                        }}
                      >
                        <Trash2 size={15} strokeWidth={1.8} />
                      </button>
                    )}
                  </td>
                  <td className="proytable-arrow">→</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Edición rápida del estado interno directo desde la tabla, al estilo del
// status chip de Jira: se muestra como texto, al hacer click se vuelve un
// select con los estados válidos para el `type` de ese proyecto y guarda
// apenas se elige uno — sin salir de la tabla. La edición completa (type,
// vpv, related_poc_id) se queda dentro del proyecto, en ProjectCard.
function EstadoEditor({ proyecto, editable, onChange }: { proyecto: Proyecto; editable: boolean; onChange: (estado: string) => void }) {
  const [editing, setEditing] = useState(false);
  const estados = estadosValidosPara(proyecto.type);

  if (!editable) {
    return <span className="proytable-substate">{proyecto.estado_interno ?? "Sin definir"}</span>;
  }

  if (editing) {
    return (
      <select
        autoFocus
        defaultValue={proyecto.estado_interno ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        style={{
          marginTop: 4, fontSize: 11, fontFamily: "inherit", color: "var(--gray-600)",
          background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 6, padding: "2px 4px",
        }}
      >
        <option value="" disabled>Sin definir</option>
        {estados.map((estado) => (
          <option key={estado} value={estado}>{estado}</option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="proytable-substate proytable-substate--editable"
      title="Cambiar estado"
    >
      {proyecto.estado_interno ?? "Sin definir"}
    </button>
  );
}

// Link directo al prototipo desde la fila, sin entrar al proyecto. Con más
// de un prototipo se abre un dropdown en vez de intentar mostrarlos todos en
// línea. `stopPropagation` evita que el click dispare también el link de la
// fila (que lleva al detalle del proyecto).
function PrototypeLinks({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState(false);

  if (urls.length === 0) return null;

  if (urls.length === 1) {
    return (
      <a
        href={urls[0]}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Ver prototipo"
        style={{
          flexShrink: 0, fontSize: 12, fontWeight: 600, textDecoration: "none",
          color: "var(--dropi)", background: "var(--dropi-light)",
          padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4,
        }}
      >
        🔗 Prototipo
      </a>
    );
  }

  return (
    <div
      style={{ position: "relative", flexShrink: 0 }}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
          color: "var(--dropi)", background: "var(--dropi-light)", border: "none",
          padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4,
        }}
      >
        🔗 Prototipos ({urls.length}) {open ? "▴" : "▾"}
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 10,
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 180, overflow: "hidden",
          }}
        >
          {urls.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", fontSize: 12, color: "var(--fg)", textDecoration: "none",
                padding: "8px 12px", borderTop: i === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              Prototipo {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Menú "⋮" por fila para colgar un POC o un Delivery Proyecto de un Discovery
// project sin abrir su ficha. Solo se renderiza en filas Discovery y con
// permiso de edición; el POST igual exige ser miembro de la célula dueña.
function RowActionsMenu({ onCrearPoc, onCrearDelivery }: { onCrearPoc: () => void; onCrearDelivery: () => void }) {
  const [open, setOpen] = useState(false);

  const itemStyle: CSSProperties = {
    display: "flex", alignItems: "center", gap: 8, width: "100%",
    fontSize: 12, fontWeight: 600, fontFamily: "inherit", textAlign: "left",
    color: "var(--fg)", background: "none", border: "none", padding: "8px 12px", cursor: "pointer",
  };

  return (
    <div
      style={{ position: "relative" }}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Crear POC o Delivery Proyecto"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 8, border: "none",
          background: "transparent", color: "var(--gray-400)", cursor: "pointer",
        }}
      >
        <MoreVertical size={15} strokeWidth={1.8} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 20,
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 200, overflow: "hidden",
          }}
        >
          <button type="button" style={itemStyle} onClick={() => { setOpen(false); onCrearPoc(); }}>
            🧪 Crear POC
          </button>
          <button
            type="button"
            style={{ ...itemStyle, borderTop: "1px solid var(--border)" }}
            onClick={() => { setOpen(false); onCrearDelivery(); }}
          >
            🚚 Crear Delivery Proyecto
          </button>
        </div>
      )}
    </div>
  );
}

// Alta rápida de un POC / Delivery Proyecto desde la tabla. Reproduce los
// campos del formulario inline de ProjectCard (nombre + de qué se trata, y
// para Delivery el POC relacionado opcional entre los POC hermanos).
function CrearHijoModal({
  parent,
  tipo,
  siblingPocs,
  onCancel,
  onConfirm,
}: {
  parent: Proyecto;
  tipo: "POC" | "Delivery Proyecto";
  siblingPocs: Proyecto[];
  onCancel: () => void;
  onConfirm: (name: string, summary: string, relatedPocId: string | null) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [relatedPocId, setRelatedPocId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const puedeCrear = name.trim().length > 0 && summary.trim().length > 0;
  const acento = tipo === "POC" ? "#F77F00" : "#0EA5E9";

  async function handleConfirm() {
    setSaving(true);
    setError(null);
    try {
      await onConfirm(name.trim(), summary.trim(), relatedPocId || null);
    } catch (e: any) {
      setError(e.message ?? "No se pudo crear.");
      setSaving(false);
    }
  }

  const inputStyle: CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
    fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", background: "var(--card)", color: "var(--fg)",
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
          maxWidth: 440, width: "100%", padding: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)", margin: "0 0 4px" }}>
          {tipo === "POC" ? "Nuevo POC" : "Nuevo Delivery Proyecto"}
        </h3>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
          Cuelga de <strong>{parent.name}</strong>{parent.project_code ? ` (${parent.project_code})` : ""}.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tipo === "POC" ? "Nombre del POC" : "Nombre del Delivery Proyecto"}
            style={inputStyle}
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="De qué se trata"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          {tipo === "Delivery Proyecto" && siblingPocs.length > 0 && (
            <select value={relatedPocId} onChange={(e) => setRelatedPocId(e.target.value)} style={inputStyle}>
              <option value="">POC relacionado: ninguno</option>
              {siblingPocs.map((p) => (
                <option key={p.id} value={p.id}>POC relacionado: {p.name}</option>
              ))}
            </select>
          )}
        </div>
        {error && <p style={{ fontSize: 12, color: "#DC2626", margin: "12px 0 0" }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!puedeCrear || saving}
            onClick={handleConfirm}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8, border: "none",
              background: puedeCrear ? acento : "var(--gray-200)", color: puedeCrear ? "#fff" : "var(--muted)",
              cursor: puedeCrear && !saving ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Creando…" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
