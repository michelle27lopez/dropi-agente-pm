import { Home, ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

// Breadcrumb compartido (rediseño privado, 2026-08-04) — estilo tomado 1:1
// del Figma "Re-arquitectura UI Oficial 2.0" (node 9563:44639): ícono de
// casa + chevrones, último nivel en negrita, el resto en gris con link.
// Reemplaza el header "← Dropi PM Tools / [nombre]" que estaba hardcodeado
// en cada página de proyecto. Para páginas de proyecto real, el nivel de
// Fase se arma con FASE_LABEL de /proyectos (Discovery/POC/Delivery) — para
// páginas que no son un "proyecto" con `type` (guías, bugs, sprint, etc.)
// simplemente se omite ese nivel.
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/" className="breadcrumb-home" aria-label="Mi día">
        <Home size={12} strokeWidth={2} />
      </a>
      <ChevronRight size={16} strokeWidth={1.8} className="breadcrumb-chevron" />
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="breadcrumb-item">
            {item.href && !isLast ? (
              <a href={item.href} className="breadcrumb-link">{item.label}</a>
            ) : (
              <span className={isLast ? "breadcrumb-current" : "breadcrumb-link"}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={16} strokeWidth={1.8} className="breadcrumb-chevron" />}
          </span>
        );
      })}
    </nav>
  );
}
