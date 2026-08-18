"use client";

import { useEffect, useState } from "react";
import { Lightbulb, LayoutDashboard, Users, Zap } from "lucide-react";
import { isSprintAllowed } from "@/lib/sprint-access";

const QUICK_LINKS = [
  { key: "iniciativas", label: "Iniciativas", url: "/iniciativas", icon: Lightbulb, requiresSuppliers: false, requiresSprint: false },
  { key: "panorama", label: "Panorama", url: "/panorama", icon: LayoutDashboard, requiresSuppliers: true, requiresSprint: false },
  { key: "updates", label: "Updates · Célula", url: "/updates-celula", icon: Users, requiresSuppliers: false, requiresSprint: false },
  { key: "sprint", label: "Sprint", url: "/sprint", icon: Zap, requiresSuppliers: false, requiresSprint: true },
];

// Navegación ocasional (1-2 veces/semana), no algo que Michelle revisa a
// diario — por eso va al fondo de la página como links de texto, no como
// chips arriba compitiendo con Retomando/Hoy/KPIs — ver
// [[project_darwin_pd_dashboard]].
//
// Panorama es explícitamente de Supplier Success (kanban propio, sin
// parametrizar por célula) y Sprint solo existe para SPRINT_ALLOWED_EMAILS
// — para cualquier otra persona/célula esos dos links no aplican, así que
// se filtran en vez de llevar a una página que les va a negar el acceso.
export default function QuickLinksFooter() {
  const [esSuppliers, setEsSuppliers] = useState(false);
  const [sprintAllowed, setSprintAllowed] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setEsSuppliers(data?.profile?.celulas?.slug === "suppliers");
        setSprintAllowed(isSprintAllowed(data?.user?.email ?? data?.profile?.email ?? null));
      })
      .catch(() => {});
  }, []);

  const links = QUICK_LINKS.filter(
    (l) => (!l.requiresSuppliers || esSuppliers) && (!l.requiresSprint || sprintAllowed)
  );

  return (
    <div className="midia-quicklinks-footer">
      {links.map(({ key, label, url, icon: Icon }) => (
        <a key={key} href={url} className="midia-quicklink-text">
          <Icon size={13} />
          {label}
        </a>
      ))}
    </div>
  );
}
