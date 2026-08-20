import type { Item } from "@/components/HomeSections";
import type { Proyecto } from "@/components/ProjectCard";

// Home/Proyectos curados de Suppliers: solo estos proyectos reales de la
// tabla `projects` tienen accesos directos con estilo propio — color/icon
// no existen en la tabla, así que se mantienen aquí por código. El resto
// vive en /celula/suppliers sin curar.
export const PROJECT_STYLE: Record<string, { url: string; color: string; icon: string }> = {
  "CELL-001": { url: "/proyectos/celula", color: "#0891B2", icon: "🧬" },
  "DCA-001": { url: "/proyectos/dinamicas-catalogo", color: "#0EA5E9", icon: "🗂️" },
  "TTV-001": { url: "/proyectos/time-to-value", color: "#F77F00", icon: "⚡" },
  "CAT-001": { url: "/proyectos/categorizacion", color: "#7C3AED", icon: "🏷️" },
  "IND-001": { url: "/proyectos/indicadores", color: "#6366F1", icon: "📈" },
  "NEG-001": { url: "/proyectos/negociaciones", color: "#0D9488", icon: "🤝" },
  "NEG-002": { url: "/proyectos/negociaciones-dropshipper", color: "#F77F00", icon: "🤝" },
  "CAZ-001": { url: "/proyectos/caza-productos", color: "#EC4899", icon: "🔍" },
  "COM-002": { url: "/proyectos/combos", color: "#F77F00", icon: "📦" },
  "DESC-001": { url: "/proyectos/descuentos", color: "#F59E0B", icon: "🏷️" },
  "PULSO-001": { url: "/proyectos/pulso-demo", color: "#F77F00", icon: "⚡" },
  "PUL-001": { url: "/proyectos/pulso-demo", color: "#EC4899", icon: "🔭" },
  "GALI-001": { url: "/proyectos/gali-demo", color: "#FF6102", icon: "🦊" },
  "ACT-001": { url: "/proyectos/dropi-activa", color: "#7C3AED", icon: "🚀" },
  "ESP-001": { url: "/proyectos/espionaje", color: "#10B981", icon: "🕵️" },
  "DOC-001": { url: "/proveedores", color: "#FF6102", icon: "🧭" },
};

const TYPE_ICON: Record<string, string> = {
  Idea: "💡", Oportunidad: "🔭", POC: "🧪", Proyecto: "🚀",
  "Delivery Proyecto": "🚚", Following: "📡",
};
const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

// Todo proyecto real de `projects` entra a la tabla — los 15 curados en
// PROJECT_STYLE se ven con su ícono/color/URL propios; el resto usa un
// estilo genérico derivado de `type`/`handoff_status`, mismo criterio que ya
// usa la home de célula sin curar.
//
// El click de la fila SIEMPRE va a la ficha interna (/proyectos/[slug]), no
// directo a `prototype_url` — varios proyectos no curados tienen ese campo
// mal guardado (sin "/" inicial, apuntando a una carpeta que no existe en
// public/), lo que producía un 404 real al clickear. La ficha interna ya
// muestra el link al prototipo si es válido, además del estado "sin
// contenido" cuando no hay nada creado — ver [[project_darwin_pd_dashboard]].
export function proyectoToItem(p: Proyecto): Item {
  const style = p.project_code ? PROJECT_STYLE[p.project_code] : undefined;
  return {
    key: p.id,
    name: p.name,
    description: truncate(p.summary ?? "Sin descripción aún.", 160),
    url: style?.url ?? `/proyectos/${p.project_code ? p.project_code.toLowerCase() : p.id}`,
    tag: p.project_code ?? p.handoff_status ?? "Sin código",
    color: style?.color ?? (p.handoff_status && HANDOFF_COLOR[p.handoff_status]) ?? "#94A3B8",
    icon: style?.icon ?? (p.type && TYPE_ICON[p.type]) ?? "📁",
  };
}
