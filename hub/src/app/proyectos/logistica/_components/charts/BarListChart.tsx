import type { BarDatum } from "@/app/proyectos/logistica/_lib/info-logistica-data";

function fmt(value: number, suffix?: string) {
  if (suffix === "%") return `${value.toFixed(1).replace(".", ",")}%`;
  return value >= 1000 ? value.toLocaleString("es-CO") : value.toString();
}

export default function BarListChart({
  data,
  max,
  suffix,
  scroll,
}: {
  data: BarDatum[];
  max?: number;
  suffix?: string;
  scroll?: boolean;
}) {
  const top = max ?? Math.max(...data.map((d) => d.value));
  return (
    <div className={`bar-list-chart${scroll ? " scroll" : ""}`}>
      {data.map((d) => (
        <div key={d.label} className="bar-list-row" title={`${d.label}: ${fmt(d.value, suffix)}${d.detail ? ` · ${d.detail}` : ""}`}>
          <div className="bar-list-meta">
            <strong>{d.label}</strong>
            {d.detail && <span>{d.detail}</span>}
          </div>
          <div className="bar-list-track">
            <i style={{ width: `${Math.min(100, (d.value / top) * 100)}%`, background: d.color ?? "var(--indigo)" }} />
          </div>
          <span className="bar-list-value">{fmt(d.value, suffix)}</span>
        </div>
      ))}
    </div>
  );
}
