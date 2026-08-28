import type { Metadata } from "next";
import "./_styles/tablero.css";
// Badges, enlaces y ficha de proyecto. Van aparte porque un merge (40842ed) ya
// las borró una vez de tablero.css — ver la cabecera de registro.css.
import "./_styles/registro.css";
// Primitivos (u-card, u-table, u-stat, u-bar…). Van de últimas porque son el
// sistema al que converge todo lo anterior: si una regla vieja de tablero.css
// choca con un primitivo, gana el primitivo. Ver logistica-lab/metodologia/tablero-diseno.md.
import "./_styles/ui.css";
import Sidebar from "./_components/Sidebar";

// Layout de la sección de Logistic Success dentro del hub.
//
// Estructura sidebar + main, el mismo patrón que ya usa Suppliers en
// `proyectos/dinamicas-catalogo`. La navegación del tablero vive en el panel
// lateral (segunda capa neutra) en vez de una barra superior propia, para que
// el chrome no compita con el de Darwin al entrar desde /celula/logistica.
//
// Los estilos del tablero quedan aislados bajo `.log-root` (ver _styles/tablero.css).

export const metadata: Metadata = {
  title: "Tablero · Logística — Dropi",
  description: "Proyectos, indicadores y updates de Logistic Success.",
};

export default function LogisticaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="log-root" style={{ display: "flex", alignItems: "flex-start", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
