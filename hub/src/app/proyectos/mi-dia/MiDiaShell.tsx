"use client";

import { useEffect, useState } from "react";
import { greeting } from "./utils";
import RetomandoCard from "./RetomandoCard";
import HoyPanel from "./HoyPanel";
import KpiPreviewPanel from "./KpiPreviewPanel";
import SprintPanel from "./SprintPanel";
import QuickLinksFooter from "./QuickLinksFooter";

// Jerarquía repensada 2026-08-07 (feedback directo de Michelle sobre cómo
// usa esto realmente, ver [[project_darwin_pd_dashboard]]):
// 1) fila hero: Retomando + Hoy — "¿qué hago ahora mismo?", lo que revisa
//    apenas abre el home.
// 2) banda de KPI a ancho completo — más importante que la navegación, se
//    saca de la franja angosta de 300px para poder mostrar más.
// 3) Sprint actual (fusiona lo que antes eran "Foco de hoy" + "Sprint
//    actual" por separado — eran redundantes: el foco YA es lo que está en
//    curso en el sprint) a ancho completo — stats arriba, tareas del sprint
//    con progreso/estado/links debajo.
// 4) accesos rápidos al fondo, como links de texto — uso ocasional
//    (1-2x/semana), no compite por atención con lo diario.
export default function MiDiaShell() {
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setNombre(data?.profile?.nombre?.split(" ")[0] ?? null))
      .catch(() => setNombre(null));
  }, []);

  return (
    <div className="midia-content">
      <div className="midia-greeting">
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>
          Hola{nombre ? ` ${nombre}` : ""}
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{greeting()}</p>
      </div>

      <div className="midia-hero-row">
        <RetomandoCard />
        <HoyPanel />
      </div>

      <KpiPreviewPanel />

      <SprintPanel />

      <QuickLinksFooter />
    </div>
  );
}
