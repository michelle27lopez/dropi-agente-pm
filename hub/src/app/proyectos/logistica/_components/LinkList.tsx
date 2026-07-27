import Link from "next/link";
import { LINK_ICONO, type LinkRef } from "@/app/proyectos/logistica/_lib/data";

// Lista de enlaces de una iniciativa (Jira, Figma, prototipo, doc, Drive).
//
// Los links con `falta: true` se pintan igual pero deshabilitados: la idea es
// que se VEA qué está sin conectar en vez de que el hueco pase desapercibido.
// Ese hueco es el pendiente — cuando llegue la URL, se rellena y ya queda
// enlazado desde todas las vistas que usan este componente.
export default function LinkList({ links, titulo }: { links: LinkRef[]; titulo?: string }) {
  if (links.length === 0) return null;
  return (
    <div className="lnks">
      {titulo && <b className="lnks-t">{titulo}</b>}
      <div className="lnks-row">
        {links.map((l) => {
          const contenido = (
            <>
              <span className="lnk-ic">{LINK_ICONO[l.tipo]}</span>
              {l.label}
            </>
          );
          if (l.falta || !l.href) {
            return (
              <span key={l.tipo + l.label} className="lnk lnk-falta" title="Falta la URL — pendiente de enlazar">
                {contenido}
                <em>falta link</em>
              </span>
            );
          }
          const externo = l.href.startsWith("http");
          return externo ? (
            <a key={l.tipo + l.label} href={l.href} target="_blank" rel="noreferrer" className="lnk">
              {contenido} ↗
            </a>
          ) : (
            <Link key={l.tipo + l.label} href={l.href} className="lnk">
              {contenido} →
            </Link>
          );
        })}
      </div>
    </div>
  );
}
