"use client";

import { useState } from "react";
import Link from "next/link";
import {
  proyectos,
  linksDe,
  type TipoIniciativa,
  type Proyecto,
} from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

// El registro de las 16 iniciativas.
//
// Antes esta pantalla enterraba su propia lista: un hero negro cuyo cuerpo
// explicaba los nombres de columna de Supabase, más una caja con las cuatro
// métricas metidas dentro de una frase. Entre las dos, ~450px antes de ver una
// sola iniciativa, y luego tarjetas de 130px de alto.
//
// Ahora la cabecera son esas cuatro cifras convertidas en filtros —el dato pasa
// de adorno a herramienta— y la taxonomía vive en un <details> para quien la
// necesite. La lista arranca arriba y las filas son densas.

const DOC_LABEL: Record<NonNullable<Proyecto["doc"]>, string> = {
  completo: "spec completo",
  parcial: "spec parcial",
  ninguno: "sin documentar",
};

// Orden de lectura: primero lo que ya se puede tomar, al final lo que todavía
// no existe. Un backlog arriba engaña sobre cuánto trabajo hay realmente vivo.
const ORDEN: { tipo: TipoIniciativa; titulo: string; nota: string }[] = [
  { tipo: "Lanzamiento", titulo: "Lanzamientos", nota: "Ya construido. Se acompaña, no se descubre." },
  { tipo: "Proyecto", titulo: "Proyectos", nota: "Alcance definido. Van a desarrollo (o ya están)." },
  { tipo: "Experimento", titulo: "Experimentos", nota: "Se valida la palanca antes de comprometer desarrollo." },
  { tipo: "Oportunidad", titulo: "Oportunidades", nota: "Hay evidencia de valor, pero todavía no hay alcance." },
  { tipo: "Idea", titulo: "Ideas · backlog", nota: "Sin discovery propio. Están para no perderlas." },
];

// Los cuatro huecos del mapa de 3 ejes. Cada uno es un predicado, así que el
// mismo objeto sirve para contar y para filtrar — no hay forma de que el número
// y la lista se desincronicen.
const HUECOS = [
  { id: "jira", label: "Jira desalineado", test: (p: Proyecto) => !!p.jira?.startsWith("⚠️") },
  { id: "doc", label: "Sin spec en el repo", test: (p: Proyecto) => p.doc === "ninguno" },
  { id: "darwin", label: "Sin registrar en Darwin", test: (p: Proyecto) => !p.codigo },
  { id: "links", label: "Enlaces por conectar", test: (p: Proyecto) => linksDe(p).some((l) => l.falta || !l.href) },
] as const;

type HuecoId = (typeof HUECOS)[number]["id"];

function Fila({ p }: { p: Proyecto }) {
  const links = linksDe(p);
  const faltantes = links.filter((l) => l.falta || !l.href).length;

  return (
    <div className="ini">
      <div className="ini-head">
        <Link href={`/proyectos/logistica/proyecto/${p.slug}`} className="ini-nombre">
          {p.destacado ? "⭐ " : ""}
          {p.nombre}
        </Link>
        {/* `fase` es una categoría (9 valores) → neutra. `handoff` son los cuatro
            estados —¿TI ya puede tomarlo?— así que sí se gana el color. */}
        <span className="pill">{p.fase}</span>
        {p.fase !== p.handoff && (
          <span className={`pill h-${p.handoff.replace(/\s/g, "-")}`}>{p.handoff}</span>
        )}
        {p.codigo ? (
          <span className="pill is-code">{p.codigo}</span>
        ) : (
          <span className="pill is-warn">sin Darwin</span>
        )}
        {p.doc === "ninguno" && <span className="pill is-risk">sin documentar</span>}
      </div>

      <p className="ini-desc">{p.descripcion}</p>

      {(p.jira || p.doc) && (
        <p className="ini-jira">
          {p.jira && (
            <span className={p.jira.startsWith("⚠️") ? "ini-desalineado" : undefined}>
              <b>Jira:</b> {p.jira}
            </span>
          )}
          {p.doc && p.doc !== "ninguno" && (
            <span>
              <b>Doc:</b> {DOC_LABEL[p.doc]}
            </span>
          )}
        </p>
      )}

      {p.bloqueo && <p className="ini-bloqueo">⛔ {p.bloqueo}</p>}
      <LinkList links={links} />
      {faltantes > 0 && (
        <p className="ini-faltan">
          {faltantes} {faltantes === 1 ? "enlace pendiente" : "enlaces pendientes"} de conectar.
        </p>
      )}
    </div>
  );
}

export default function RegistroIniciativas() {
  const [filtro, setFiltro] = useState<HuecoId | null>(null);

  const activo = HUECOS.find((h) => h.id === filtro);
  const visibles = activo ? proyectos.filter(activo.test) : proyectos;

  return (
    <main className="page">
      <div className="reg-head">
        <h1 className="reg-titulo">
          Registro de iniciativas <span>· {proyectos.length}</span>
        </h1>

        {/* La taxonomía y la metodología no desaparecen: dejan de cobrar peaje a
            quien solo viene a mirar la lista. <details> nativo = accesible. */}
        <details className="reg-como">
          <summary>Cómo se lee este registro</summary>
          <div>
            <p>
              Tres ejes explícitos —<b>qué es</b> (tipo), <b>dónde va</b> (fase) y{" "}
              <b>si TI puede tomarlo</b> (handoff)— más lo que la bloquea. Darwin sigue
              siendo el portafolio compartido; este registro aporta narrativa y navegación
              específicas de Logística y se une por <code>codigo / project_code</code>. Las
              diferencias con <code>projects.type / status / handoff_status</code> son huecos
              por validar, no una fuente paralela. Ver{" "}
              <Link href="/celula/logistica">/celula/logistica</Link>.
            </p>
            <p>
              Los huecos se muestran a propósito: un <em>falta link</em> visible es un
              pendiente; un hueco invisible es una mentira. Estados de Jira verificados
              uno por uno el 22-jul (<code>logistica-lab/estrategia/mapa-proyectos-3-ejes.md</code>).
            </p>
          </div>
        </details>
      </div>

      {/* Los cuatro huecos como filtros. El número era el dato más valioso de la
          página y estaba dentro de una frase. */}
      <div className="reg-huecos">
        {HUECOS.map((h) => {
          const n = proyectos.filter(h.test).length;
          const on = filtro === h.id;
          return (
            <button
              key={h.id}
              type="button"
              className="reg-hueco nav-item"
              aria-pressed={on}
              onClick={() => setFiltro(on ? null : h.id)}
              disabled={n === 0}
            >
              <b>{n}</b>
              <span>{h.label}</span>
            </button>
          );
        })}
      </div>

      {activo && (
        <p className="reg-filtro-activo">
          Mostrando {visibles.length} de {proyectos.length} · {activo.label}
          <button type="button" className="torre-limpiar" onClick={() => setFiltro(null)}>
            Ver todas
          </button>
        </p>
      )}

      {ORDEN.map(({ tipo, titulo, nota }) => {
        const items = visibles.filter((p) => p.tipo === tipo);
        if (items.length === 0) return null;
        return (
          <section key={tipo}>
            <div className="eyebrow">
              {titulo} · {items.length}
            </div>
            {!activo && <p className="ini-nota">{nota}</p>}
            <div className="ini-list">
              {items.map((p) => (
                <Fila key={p.slug} p={p} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
