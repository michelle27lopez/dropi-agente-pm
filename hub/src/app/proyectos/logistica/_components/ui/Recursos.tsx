import { Compass, FileText, FlaskConical, FolderOpen, MonitorSmartphone, PenTool, Ticket } from "lucide-react";
import type { LinkRef, LinkTipo } from "../../_lib/data";
import Card from "./Card";
import Pill from "./Pill";

// Recursos de investigación y documentación de una iniciativa.
//
// Es la sección "Recursos del proyecto" de dinámicas-catálogo y la de
// "Recursos de Investigación y Documentación" de categorización (Suppliers):
// un grid de cards, cada una con icono, título, el tipo de recurso como badge
// y una línea de qué es. Allá son JSX repetido a mano; acá salen de
// `linksDe(p)`, que ya es la lista de todo lo que existe de una iniciativa.
//
// La card que FALTA se dibuja punteada y sin enlace ("Sin evidencia
// documentada", como el `Vacio` de proveedores/): un recurso que debería
// existir y no existe es un hallazgo, igual que una celda vacía en la tabla.
//
// Iconos lucide y no emoji: es el lenguaje que ya usa el tablero (Sidebar,
// Llenar Jira). Las cinco páginas de Suppliers usan emoji; se replica el
// diseño, no el emoji.

export const GRUPO_LINK: Record<LinkTipo, string> = {
  jira: "Jira",
  figma: "Figma",
  prototipo: "Prototipos",
  poc: "Prototipos",
  doc: "Documentación",
  drive: "Documentación",
  tablero: "En este tablero",
};

const ICONO: Record<LinkTipo, typeof FileText> = {
  jira: Ticket,
  figma: PenTool,
  prototipo: MonitorSmartphone,
  poc: FlaskConical,
  doc: FileText,
  drive: FolderOpen,
  tablero: Compass,
};

/** Orden de los grupos: primero lo navegable, después la evidencia. */
const ORDEN = ["En este tablero", "Prototipos", "Jira", "Figma", "Documentación"];

type Props = {
  links: LinkRef[];
  /** Una columna: para el panel lateral. */
  compact?: boolean;
};

export default function Recursos({ links, compact }: Props) {
  const grupos = new Map<string, LinkRef[]>();
  for (const l of links) {
    const g = GRUPO_LINK[l.tipo];
    grupos.set(g, [...(grupos.get(g) ?? []), l]);
  }
  const ordenados = [...grupos.entries()].sort(([a], [b]) => ORDEN.indexOf(a) - ORDEN.indexOf(b));

  if (ordenados.length === 0) {
    return <p className="u-recursos__vacio">Sin recursos registrados. Que no exista ninguno es el dato.</p>;
  }

  return (
    <div className="u-recursos" data-compact={compact || undefined}>
      {ordenados.map(([grupo, items]) => (
        <section key={grupo} className="u-recursos__grupo">
          <h3 className="u-recursos__titulo">{grupo}</h3>
          <div className="u-recursos__grid">
            {items.map((l) => {
              const Icono = ICONO[l.tipo];
              const externo = l.href.startsWith("http");
              const cuerpo = (
                <span className="u-recurso">
                  <Icono className="u-recurso__icono" size={18} strokeWidth={1.75} aria-hidden />
                  <span className="u-recurso__texto">
                    <span className="u-recurso__label">{l.label}</span>
                    <span className="u-row" style={{ gap: 6 }}>
                      <Pill>{l.falta ? "Sin evidencia documentada" : grupo}</Pill>
                      {!l.falta && externo && <span className="u-recurso__ext">↗</span>}
                    </span>
                  </span>
                </span>
              );
              return l.falta ? (
                <Card key={l.label} className="u-recurso--falta" title="Debería existir y no está registrado">
                  {cuerpo}
                </Card>
              ) : (
                <Card key={l.href + l.label} href={l.href}>
                  {cuerpo}
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
