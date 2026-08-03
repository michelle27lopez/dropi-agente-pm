"use client";

import HomeDashboard from "./HomeDashboard";
import HoyPanel from "./HoyPanel";
import SprintStatsPanel from "./SprintStatsPanel";

// La navegación (proyectos, updates, búsqueda) vive ahora en el GlobalNav
// de layout.tsx raíz — este shell solo compone el contenido de "mi día":
// dashboard principal + franja lateral persistente (Hoy, Sprint actual).
// Ver [[project_darwin_pd_dashboard]].
export default function MiDiaShell() {
  return (
    <div className="midia-content">
      <div className="midia-layout">
        <HomeDashboard />
        <div className="midia-rail">
          <HoyPanel />
          <SprintStatsPanel />
        </div>
      </div>
    </div>
  );
}
