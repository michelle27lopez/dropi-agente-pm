// Ejemplo REGISTRADO — este es el que se muestra en vivo el día del taller.
// Toda la info de las superficies y el link de hallazgos ya vive en Darwin
// (/proyectos/pulso-demo); esta ficha no inventa nada nuevo, solo la
// reorganiza. Esa es justo la idea que se explica en la teoría: usar lo que
// ya está documentado en Darwin para armar tu propia ficha.
import Link from "next/link";
import type { PocDetailProps } from "./types";

const EN_VIVO = [
  { href: "https://beta-pulso.vercel.app/", label: "Dropi Pulso · Beta", desc: "El sitio en vivo, fuera de Darwin", external: true },
  { href: "/pulso-demo/dashboard", label: "Dashboard · Pantalla grande", desc: "QR → Ready → Live counter", external: true },
  { href: "/pulso-demo/proveedor", label: "Portal del Proveedor", desc: "Demanda en vivo y condiciones", external: true },
];

const DOCUMENTADO = [
  { href: "/proyectos/pulso-demo", label: "Home del proyecto", desc: "Accesos a las 6 superficies del demo", external: false },
  { href: "/proyectos/pulso-demo/research", label: "Research · RB-005", desc: "La investigación detrás del POC", external: false },
  { href: "/proyectos/pulso-demo/hallazgos", label: "Hallazgos", desc: "Lo que se validó en campo", external: false },
  { href: "/dropi-pulso-presentacion.html", label: "Presentación · Stakeholders", desc: "Deck usado para socializarlo", external: true },
];

export default function PulsoDetalle({ poc }: PocDetailProps) {
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #FFF3E0 0%, var(--card) 60%)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", textTransform: "uppercase" }}>
          {poc.project_code}
        </span>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: "8px 0 12px" }}>
          ⚡ {poc.name}
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, maxWidth: 560 }}>{poc.summary}</p>
        {poc.celulaNombre && (
          <span
            style={{
              display: "inline-block", marginTop: 14, fontSize: 12, fontWeight: 600,
              color: "var(--info)", background: "var(--info-tint)", padding: "3px 10px", borderRadius: 999,
            }}
          >
            {poc.celulaNombre}
          </span>
        )}
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "24px 0 10px" }}>
        En vivo
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {EN_VIVO.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target={s.external ? "_blank" : undefined}
            rel={s.external ? "noreferrer" : undefined}
            style={{
              display: "block", padding: "14px 16px", borderRadius: 12,
              border: "1px solid var(--dropi)", background: "var(--dropi-light)", textDecoration: "none",
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{s.label} →</p>
            <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--muted)" }}>{s.desc}</p>
          </a>
        ))}
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "24px 0 10px" }}>
        Ya documentado en Darwin
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {DOCUMENTADO.map((s) =>
          s.external ? (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block", padding: "14px 16px", borderRadius: 12,
                border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none",
              }}
            >
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{s.label} →</p>
              <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--muted)" }}>{s.desc}</p>
            </a>
          ) : (
            <Link
              key={s.href}
              href={s.href}
              style={{
                display: "block", padding: "14px 16px", borderRadius: 12,
                border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none",
              }}
            >
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{s.label} →</p>
              <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--muted)" }}>{s.desc}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
