"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/proyectos/logistica/_styles/mapa.css";
import {
  etapas,
  proyectos,
  saludDe,
  motivoSalud,
  APORTA_GLOSA,
  type Etapa,
  type Proyecto,
  type AportaA,
} from "@/app/proyectos/logistica/_lib/data";
import { Pill, PageHeader } from "@/app/proyectos/logistica/_components/ui";

// MAPA DE LA ORDEN — nivel 2 de la escalera.
// Responde: ¿DÓNDE SE ROMPE Y QUIÉN LO ESTÁ ATACANDO?
//
// Es un diagrama de carriles, NO un editor de nodos: nada se arrastra, no hay
// canvas libre ni zoom. La cadena de la orden son seis etapas fijas que no
// cambian nunca; montar un lienzo editable para algo que nadie va a editar
// costaría mucho y encima quitaría el orden de lectura, que aquí es el dato.
//
// TRES CORRECCIONES SOBRE EL MOCKUP QUE ORIGINÓ ESTA PANTALLA
//
// 1. EL COLOR DEL NODO ES SALUD, NO FASE. En el mockup las doce píldoras de
//    Discovery/Research/Definición/Diseño eran todas azules: el color no
//    informaba nada y los nodos se veían idénticos. La fase es una categoría
//    —un proyecto puede llevar cuatro meses en Discovery y estar sano—; la
//    salud es un estado que pide acción.
//
// 2. NO HAY LÍNEAS QUE UNAN TARJETAS CONTIGUAS. En el mockup conectaban nodos
//    vecinos en orden de lectura e insinuaban dependencias inexistentes
//    (LOG-004 no alimenta a LOG-001). Una línea que no representa una relación
//    real es peor que ninguna: se lee como información y es ruido.
//
//    Lo que SÍ es una relación real: una iniciativa que toca varias etapas.
//    Esa se muestra apareciendo en cada etapa que toca, y al pasar el ratón
//    por cualquiera de sus apariciones se resaltan todas a la vez. Se prefiere
//    el resaltado a dibujar líneas SVG porque unas líneas correctas exigen
//    medir posiciones del DOM y rehacerlas en cada resize; el resaltado
//    comunica la misma relación y no se rompe en móvil ni al reflow.
//
// 3. EL DETALLE NO VA AL PIE. Clic en un nodo → ficha. En el mockup, pinchar
//    un nodo del carril 4 obligaba a bajar hasta el fondo de la pantalla y
//    perder de vista el nodo que se estaba mirando.

type Filtro = { id: string; label: string; test: (p: Proyecto) => boolean; tone?: "risk" | "warn" | "info" };

const FILTROS: Filtro[] = [
  { id: "movilizacion", label: "Movilización", tone: "info", test: (p) => p.aportaA === "Movilización" },
  { id: "devolucion", label: "Devolución", tone: "info", test: (p) => p.aportaA === "Devolución" },
  { id: "bloqueadas", label: "Bloqueadas", tone: "risk", test: (p) => !!p.bloqueo },
  { id: "sin-owner", label: "Sin responsable", tone: "warn", test: (p) => !p.owner },
];

function tonoAporta(a: AportaA) {
  if (a === "Movilización" || a === "Devolución") return "risk" as const;
  if (a === "Habilitador") return "info" as const;
  if (a === "Sin definir") return "warn" as const;
  return "neutral" as const;
}

/** Las etapas que toca un proyecto: la principal más las declaradas como relacionadas. */
function etapasDe(p: Proyecto): string[] {
  const extra = (p.etapasRelacionadas ?? []).map((r) => r.etapa);
  return [...new Set([p.etapa, ...extra])];
}

export default function MapaOrden() {
  const [filtro, setFiltro] = useState<string | null>(null);
  const [resaltado, setResaltado] = useState<string | null>(null);

  const activo = FILTROS.find((f) => f.id === filtro);
  const visibles = activo ? proyectos.filter(activo.test) : proyectos;

  return (
    <main className="page mapa-page">
      <PageHeader
        title="Mapa de la orden"
        subtitle="Dónde se rompe la orden y quién lo está atacando. Cada carril es una etapa; cada tarjeta, una iniciativa."
      />

      <div className="mapa-filtros">
        <span className="mapa-filtros__label">Ver solo</span>
        {FILTROS.map((f) => {
          const n = proyectos.filter(f.test).length;
          const on = filtro === f.id;
          return (
            <button
              key={f.id}
              type="button"
              className="mapa-filtro"
              data-tone={f.tone ?? "neutral"}
              aria-pressed={on}
              disabled={n === 0}
              onClick={() => setFiltro(on ? null : f.id)}
            >
              <b>{n}</b> {f.label}
            </button>
          );
        })}
        {activo && (
          <button type="button" className="mapa-limpiar" onClick={() => setFiltro(null)}>
            Ver todas
          </button>
        )}
      </div>

      <p className="mapa-leyenda">
        <span className="u-salud" data-salud="risk" /> Bloqueada
        <span className="u-salud" data-salud="warn" /> Información incompleta
        <span className="u-salud" data-salud="ok" /> En avance
      </p>

      <div className="mapa-carriles">
        {etapas.map((e) => (
          <Carril
            key={e.n}
            etapa={e}
            proyectos={visibles.filter((p) => etapasDe(p).includes(e.nombre))}
            resaltado={resaltado}
            onResaltar={setResaltado}
          />
        ))}
      </div>
    </main>
  );
}

function Carril({
  etapa,
  proyectos: items,
  resaltado,
  onResaltar,
}: {
  etapa: Etapa;
  proyectos: Proyecto[];
  resaltado: string | null;
  onResaltar: (slug: string | null) => void;
}) {
  const bloqueadas = items.filter((p) => p.bloqueo).length;

  return (
    <section className="mapa-carril">
      <header className="mapa-carril__head">
        <div className="mapa-carril__titulo">
          <span className="mapa-carril__n">{etapa.n}</span>
          <h2>{etapa.nombre}</h2>
        </div>
        <p className="mapa-carril__sub">{etapa.sub}</p>
        {etapa.perdida && (
          <Pill tone={etapa.perdida.tono === "malo" ? "risk" : etapa.perdida.tono === "alerta" ? "warn" : "ok"}>
            {etapa.perdida.label}
          </Pill>
        )}
        {/* El conteo es lo que hace comparables las etapas de un vistazo. */}
        <p className="mapa-carril__conteo">
          {items.length === 0
            ? "Sin iniciativas asignadas"
            : `${items.length} ${items.length === 1 ? "iniciativa" : "iniciativas"}${
                bloqueadas > 0 ? ` · ${bloqueadas} bloqueada${bloqueadas > 1 ? "s" : ""}` : ""
              }`}
        </p>
      </header>

      <div className="mapa-carril__nodos">
        {items.map((p) => (
          <Nodo
            key={p.slug}
            proyecto={p}
            etapaActual={etapa.nombre}
            resaltado={resaltado === p.slug}
            atenuado={resaltado !== null && resaltado !== p.slug}
            onResaltar={onResaltar}
          />
        ))}
      </div>
    </section>
  );
}

function Nodo({
  proyecto: p,
  etapaActual,
  resaltado,
  atenuado,
  onResaltar,
}: {
  proyecto: Proyecto;
  etapaActual: string;
  resaltado: boolean;
  atenuado: boolean;
  onResaltar: (slug: string | null) => void;
}) {
  const salud = saludDe(p);
  const etapasTocadas = etapasDe(p);
  const transversal = etapasTocadas.length > 1;
  const esPrincipal = p.etapa === etapaActual;
  const rol = p.etapasRelacionadas?.find((r) => r.etapa === etapaActual)?.rol;
  const nombre = p.nombreCorto ?? p.nombre;

  const comun = {
    href: `/proyectos/logistica/proyecto/${p.slug}`,
    "data-resaltado": resaltado || undefined,
    "data-atenuado": atenuado || undefined,
    onMouseEnter: () => transversal && onResaltar(p.slug),
    onMouseLeave: () => transversal && onResaltar(null),
    onFocus: () => transversal && onResaltar(p.slug),
    onBlur: () => transversal && onResaltar(null),
  };

  // ── EL ECO ES UNA LÍNEA, NO UNA TARJETA ────────────────────────────────────
  // Vigía toca cinco etapas. Cuando cada aparición pesaba lo mismo que un nodo
  // principal —nombre a tres líneas, rol, código y "toca 5 etapas"— una sola
  // iniciativa ocupaba media pantalla y el mapa parecía el mapa de Vigía.
  //
  // El eco solo tiene que decir dos cosas: que esta iniciativa también pasa por
  // aquí, y qué papel juega. El resto ya está en su etapa principal.
  if (!esPrincipal) {
    return (
      <Link {...comun} className="mapa-eco" title={`${p.nombre} — ${rol ?? "también toca esta etapa"}`}>
        <span className="mapa-eco__nombre">{nombre}</span>
        <span className="mapa-eco__rol">{rol ?? "también toca esta etapa"}</span>
      </Link>
    );
  }

  return (
    <Link {...comun} className="mapa-nodo">
      <div className="mapa-nodo__head">
        <span className="u-salud" data-salud={salud} title={motivoSalud(p)} />
        <span className="mapa-nodo__nombre">
          {p.destacado && <span title="En foco">⭐ </span>}
          {nombre}
        </span>
      </div>

      <div className="mapa-nodo__meta">
        <Pill tone={tonoAporta(p.aportaA)} title={APORTA_GLOSA[p.aportaA]}>
          {p.aportaA}
        </Pill>
        <span className="mapa-nodo__fase">{p.fase}</span>
      </div>

      <div className="mapa-nodo__pie">
        {p.codigo && <span className="mapa-nodo__codigo">{p.codigo}</span>}
        {transversal && (
          <span className="mapa-nodo__transversal" title={etapasTocadas.join(" · ")}>
            toca {etapasTocadas.length} etapas
          </span>
        )}
      </div>
    </Link>
  );
}
