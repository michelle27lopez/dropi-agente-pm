import type { Metadata } from "next";
import "./_styles/tablero.css";
import Header from "./_components/Header";

// Layout de la sección de Logistic Success dentro del hub.
//
// El tablero venía de un Next propio con su RootLayout, su login y su
// middleware de Supabase. Aquí no hacen falta: el hub ya autentica antes de
// llegar a esta ruta. Lo único que se conserva es la navegación interna del
// tablero y su hoja de estilos, aislada bajo `.log-root` para que los ~370
// selectores del tablero no toquen el resto del hub (ver _styles/tablero.css).

export const metadata: Metadata = {
  title: "Tablero PM · Logística — Dropi",
  description: "Proyectos, indicadores y updates de Logistic Success.",
};

export default function LogisticaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="log-root">
      <Header />
      {children}
      <div className="footer">Dropi · Logistic Success · 2026</div>
    </div>
  );
}
