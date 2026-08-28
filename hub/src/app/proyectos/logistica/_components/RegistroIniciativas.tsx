"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/proyectos/logistica/_styles/iniciativas.css";
import {
  proyectos,
  linksDe,
  saludDe,
  motivoSalud,
  APORTA_GLOSA,
  type Proyecto,
  type AportaA,
} from "@/app/proyectos/logistica/_lib/data";
import {
  Table,
  Pill,
  Disclosure,
  PageHeader,
  type Column,
} from "@/app/proyectos/logistica/_components/ui";

// El registro de las 16 iniciativas — NIVEL 2 de la escalera, capa densa.
// Responde una pregunta: ¿QUÉ EMPUJAMOS Y QUÉ ESTÁ ATASCADO?
//
// POR QUÉ TABLA Y NO TARJETAS
// La versión anterior apilaba 16 bloques altos: nombre, descripción de dos
// líneas, línea de Jira, bloqueo, y una fila de hasta siete pastillas naranjas
// de enlaces. Comparar dos iniciativas obligaba a hacer scroll entre ellas y a
// leer prosa; ver cuáles estaban sin dueño era imposible porque el dueño no
// existía como dato.
//
// Una tabla sirve para comparar N cosas sobre los mismos ejes, y su superpoder
// es que UNA CELDA VACÍA ES UN HALLAZGO: la columna "Quién lo lleva" con trece
// guiones dice más de la salud de la célula que cualquier párrafo.
//
// DECISIONES QUE VIENEN CON ELLA
//
// · Los enlaces SALEN de aquí. Cuatro a siete por fila × 16 filas era un muro
//   naranja que competía con el nombre. Viven en la ficha, a un clic.
//
// · "Qué lo detiene" y "Próximo paso" se funden en una columna. Son la misma
//   pregunta —¿qué falta para que avance?— y en un proyecto bloqueado el
//   próximo paso ES desbloquearlo. Así cada fila tiene UNA celda accionable.
//
// · Se retiran las secciones por tipo. Agrupar 16 filas en cinco bloques de
//   una a diez rompe justo lo que la tabla aporta: poder compararlas todas de
//   una pasada. El tipo pasa a ser filtro, y la nota editorial de cada tipo
//   ("Lanzamientos: ya construido, se acompaña, no se descubre") se conserva
//   en el plegable de abajo.
//
// · El orden por defecto es POR SALUD, no alfabético ni por tipo: lo bloqueado
//   arriba. Si la primera pregunta del Cell Board es "¿qué está atascado?", la
//   respuesta tiene que estar en la primera fila, no repartida por la lista.

const ORDEN_SALUD = { risk: 0, warn: 1, ok: 2 } as const;

type Filtro = {
  id: string;
  label: string;
  test: (p: Proyecto) => boolean;
  tone?: "risk" | "warn" | "info";
};

// Los filtros van en DOS grupos porque responden dos preguntas distintas, y
// mezclarlos era un error de categoría: "Bloqueadas" habla del TRABAJO,
// "Jira desalineado" habla de la HIGIENE DEL REGISTRO. Puestos en la misma
// fila parecían siete lentes equivalentes sobre el portafolio, y no lo son:
// los de higiene no son una lente, son una lista de tareas para el PM.
//
// Cada filtro es un predicado, así que el mismo objeto cuenta y filtra: no hay
// manera de que el número del chip y la lista se desincronicen.
const FILTROS: Filtro[] = [
  { id: "bloqueadas", label: "Bloqueadas", tone: "risk", test: (p) => !!p.bloqueo },
  { id: "sin-owner", label: "Sin responsable", tone: "warn", test: (p) => !p.owner },
  { id: "movilizacion", label: "Movilización", tone: "info", test: (p) => p.aportaA === "Movilización" },
  { id: "devolucion", label: "Devolución", tone: "info", test: (p) => p.aportaA === "Devolución" },
  { id: "sin-declarar", label: "Sin objetivo definido", tone: "warn", test: (p) => p.aportaA === "Sin definir" },
];

// Higiene: cosas que hay que ARREGLAR, no lentes con las que mirar. Un contador
// que lleva semanas en 4 dejó de ser un indicador y es decoración.
const HIGIENE: Filtro[] = [
  { id: "jira", label: "con Jira desalineado", tone: "warn", test: (p) => !!p.jira?.startsWith("⚠️") },
  { id: "links", label: "con enlaces por conectar", test: (p) => linksDe(p).some((l) => l.falta || !l.href) },
];

const TODOS = [...FILTROS, ...HIGIENE];

// Escalas ordinales para ordenar por columna. Sin esto, ordenar por "Fase"
// saldría alfabético —Backlog, Beta, Definición…— que no significa nada.
const ORDEN_FASE = ["Backlog", "Research", "Discovery", "Definición", "Diseño", "Listo para handoff", "En desarrollo", "Beta", "Lanzado"];
const ORDEN_HANDOFF = ["No aplica", "Pendiente", "Listo para handoff", "Handoff hecho"];
const ORDEN_ATACA: AportaA[] = ["Movilización", "Devolución", "Habilitador", "Fuera del centro", "Sin definir"];

function valorDeOrden(p: Proyecto, key: string): string | number {
  switch (key) {
    case "nombre": return p.nombre.toLowerCase();
    case "ataca": return ORDEN_ATACA.indexOf(p.aportaA);
    case "fase": return ORDEN_FASE.indexOf(p.fase);
    case "handoff": return ORDEN_HANDOFF.indexOf(p.handoff);
    // Sin dueño va al final en ascendente: el hueco importa, pero no encabeza.
    case "owner": return p.owner?.toLowerCase() ?? "￿";
    default: return 0;
  }
}

function tonoAporta(a: AportaA) {
  if (a === "Movilización" || a === "Devolución") return "risk" as const;
  if (a === "Habilitador") return "info" as const;
  if (a === "Sin definir") return "warn" as const;
  return "neutral" as const;
}

export default function RegistroIniciativas() {
  const [filtro, setFiltro] = useState<string | null>(null);
  // `null` = orden por defecto (salud). Es el orden que responde la pregunta de
  // la pantalla; cualquier otro es una consulta puntual del lector.
  const [orden, setOrden] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const activo = TODOS.find((f) => f.id === filtro);
  const visibles = [...(activo ? proyectos.filter(activo.test) : proyectos)].sort((a, b) => {
    if (!orden) return ORDEN_SALUD[saludDe(a)] - ORDEN_SALUD[saludDe(b)];
    const va = valorDeOrden(a, orden.key);
    const vb = valorDeOrden(b, orden.key);
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return orden.dir === "desc" ? -cmp : cmp;
  });

  // Un clic ordena ascendente; el segundo invierte; el tercero vuelve al orden
  // por salud. Sin ese tercer paso no hay forma de recuperar el default.
  function alOrdenar(key: string) {
    setOrden((o) =>
      !o || o.key !== key ? { key, dir: "asc" } : o.dir === "asc" ? { key, dir: "desc" } : null
    );
  }

  const columnas: Column<Proyecto>[] = [
    {
      key: "nombre",
      header: "Iniciativa",
      width: "27%",
      sortable: true,
      render: (p) => (
        <Link href={`/proyectos/logistica/proyecto/${p.slug}`} className="ini-link">
          <span className="u-salud" data-salud={saludDe(p)} title={motivoSalud(p)} />
          <span>
            {p.destacado && <span title="En foco">⭐ </span>}
            {p.nombre}
            {p.codigo && <span className="ini-codigo">{p.codigo}</span>}
          </span>
        </Link>
      ),
    },
    {
      key: "ataca",
      header: "Aporta a",
      width: "11%",
      sortable: true,
      render: (p) => (
        <Pill tone={tonoAporta(p.aportaA)} title={APORTA_GLOSA[p.aportaA]}>
          {p.aportaA}
        </Pill>
      ),
    },
    { key: "fase", header: "Fase", width: "11%", sortable: true, render: (p) => p.fase },
    {
      key: "handoff",
      header: "Handoff",
      width: "12%",
      sortable: true,
      render: (p) => (
        <Pill
          tone={
            p.handoff === "Handoff hecho"
              ? "ok"
              : p.handoff === "Listo para handoff"
                ? "info"
                : p.handoff === "Pendiente"
                  ? "warn"
                  : "neutral"
          }
        >
          {p.handoff}
        </Pill>
      ),
    },
    // Sin `owner` la celda queda vacía y el primitivo la pinta "—". Es el
    // hallazgo más incómodo de esta tabla y por eso no se rellena.
    { key: "owner", header: "Responsable", width: "12%", sortable: true, render: (p) => p.owner },
    {
      key: "sigue",
      header: "Bloqueo o próximo paso",
      render: (p) =>
        p.bloqueo ? (
          <span className="ini-bloqueo-celda">{p.bloqueo}</span>
        ) : (
          p.proximoPaso
        ),
    },
  ];

  return (
    <main className="page">
      <PageHeader
        title="Iniciativas"
        subtitle="Qué estamos empujando y qué está atascado. Ordenadas por salud: lo bloqueado primero."
        aside={<Pill>{proyectos.length} en total</Pill>}
      />

      <div className="ini-filtros">
        <span className="ini-filtros__label">Ver solo</span>
        {FILTROS.map((f) => {
          const n = proyectos.filter(f.test).length;
          const on = filtro === f.id;
          return (
            <button
              key={f.id}
              type="button"
              className="ini-filtro"
              data-tone={f.tone ?? "neutral"}
              aria-pressed={on}
              disabled={n === 0}
              onClick={() => setFiltro(on ? null : f.id)}
            >
              <b>{n}</b> {f.label}
            </button>
          );
        })}
      </div>

      {/* Acuse de recibo del filtro. Sin esto, filtrar por "Sin dueño" pasa de
          16 a 13 filas y parece que no ocurrió nada: un filtro que no dice
          cuánto quitó se siente roto aunque funcione. */}
      <p className="ini-estado" aria-live="polite">
        {activo ? (
          <>
            Mostrando <b>{visibles.length}</b> de {proyectos.length} · {activo.label}
            <button type="button" className="ini-limpiar" onClick={() => setFiltro(null)}>
              Ver todas
            </button>
          </>
        ) : (
          <>
            Las {proyectos.length}, ordenadas por{" "}
            {orden ? (
              <>
                <b>{columnas.find((c) => c.key === orden.key)?.header.toLowerCase()}</b>
                <button type="button" className="ini-limpiar" onClick={() => setOrden(null)}>
                  Volver a orden por salud
                </button>
              </>
            ) : (
              <b>salud</b>
            )}
            . Clic en una cabecera para reordenar.
          </>
        )}
      </p>

      <Table
        columns={columnas}
        rows={visibles}
        getKey={(p) => p.slug}
        empty="Ninguna iniciativa cumple ese filtro."
        sortKey={orden?.key}
        sortDir={orden?.dir}
        onSort={alOrdenar}
      />

      {/* Higiene del registro: no son lentes sobre el portafolio, son tareas.
          Van aparte y en pequeño porque el día que estén en cero desaparecen —
          y ese es el objetivo, no tenerlas siempre ahí. */}
      <p className="ini-higiene">
        Higiene del registro:{" "}
        {HIGIENE.map((h, i) => {
          const n = proyectos.filter(h.test).length;
          const on = filtro === h.id;
          return (
            <span key={h.id}>
              {i > 0 && " · "}
              {n === 0 ? (
                <span className="ini-higiene__ok">0 {h.label}</span>
              ) : (
                <button
                  type="button"
                  className="ini-higiene__link"
                  aria-pressed={on}
                  onClick={() => setFiltro(on ? null : h.id)}
                >
                  {n} {h.label}
                </button>
              )}
            </span>
          );
        })}
      </p>

      <Disclosure summary="Cómo se lee este registro">
        <p>
          Cuatro ejes explícitos: <b>qué es</b> (tipo), <b>dónde va</b> (fase), <b>si TI puede
          tomarlo</b> (handoff) y <b>a qué perdida aporta</b> (ataca). El tipo ya no agrupa la tabla —
          agrupar 16 filas en cinco bloques impide compararlas— pero sigue significando lo mismo:
          los <b>Lanzamientos</b> ya están construidos y se acompañan, no se descubren; los{" "}
          <b>Proyectos</b> tienen alcance definido y van a desarrollo; los <b>Experimentos</b>{" "}
          validan la palanca antes de comprometer desarrollo; las <b>Oportunidades</b> tienen
          evidencia de valor pero todavía no alcance; y las <b>Ideas</b> están para no perderlas.
        </p>
        <p>
          Los huecos se muestran a propósito: un dato ausente se dibuja «—» porque un hueco
          invisible es una mentira. Una celda vacía en «Responsable» es una conversación
          pendiente, no un error de tablero.
        </p>
        <p>
          Darwin sigue siendo el portafolio compartido; este registro aporta narrativa y navegación
          de Logística y se une por <code>codigo / project_code</code>. Estados de Jira verificados
          uno por uno el 22-jul (<code>logistica-lab/estrategia/mapa-proyectos-3-ejes.md</code>). Ver{" "}
          <Link href="/celula/logistica">/celula/logistica</Link>.
        </p>
      </Disclosure>
    </main>
  );
}
