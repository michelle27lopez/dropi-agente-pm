import { Lightbulb, LayoutDashboard, Users, Zap } from "lucide-react";

const QUICK_LINKS = [
  { label: "Iniciativas", url: "/iniciativas", icon: Lightbulb },
  { label: "Panorama", url: "/panorama", icon: LayoutDashboard },
  { label: "Updates · Célula", url: "/updates-celula", icon: Users },
  { label: "Sprint", url: "/sprint", icon: Zap },
];

// Navegación ocasional (1-2 veces/semana), no algo que Michelle revisa a
// diario — por eso va al fondo de la página como links de texto, no como
// chips arriba compitiendo con Retomando/Hoy/KPIs — ver
// [[project_darwin_pd_dashboard]].
export default function QuickLinksFooter() {
  return (
    <div className="midia-quicklinks-footer">
      {QUICK_LINKS.map(({ label, url, icon: Icon }) => (
        <a key={url} href={url} className="midia-quicklink-text">
          <Icon size={13} />
          {label}
        </a>
      ))}
    </div>
  );
}
