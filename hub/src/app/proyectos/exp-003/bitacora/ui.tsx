"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Info } from "lucide-react";
import "./bitacora.css";

export type Tone = "green" | "blue" | "red" | "amber" | "muted";

export const TONES: Record<Tone, { fg: string; bg: string; border: string }> = {
  green: { fg: "var(--success)", bg: "var(--success-tint)", border: "var(--success)" },
  blue: { fg: "var(--info)", bg: "var(--info-tint)", border: "var(--info)" },
  red: { fg: "var(--danger)", bg: "var(--danger-tint)", border: "var(--danger)" },
  amber: { fg: "#B45309", bg: "var(--warning-tint)", border: "var(--warning)" },
  muted: { fg: "var(--muted)", bg: "#FAFBFC", border: "var(--border)" },
};

export const CO = "var(--info)";
export const PY = "var(--dropi)";

export const card: CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: 20,
  marginBottom: 16,
};

export const sectionTitle: CSSProperties = {
  fontSize: "var(--fs-title)",
  fontWeight: 700,
  color: "var(--fg)",
  marginBottom: 4,
  lineHeight: "var(--lh-title)",
};

export const sectionSub: CSSProperties = {
  fontSize: "var(--fs-body)",
  color: "var(--muted)",
  lineHeight: "var(--lh-body)",
  marginBottom: 12,
};

const thStyle: CSSProperties = {
  color: "var(--muted)",
  background: "#FAFBFC",
  fontSize: "var(--fs-label)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontWeight: 700,
  padding: "8px 10px",
  borderBottom: "1px solid var(--border)",
  textAlign: "left",
};

const tdStyle: CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid var(--border)",
  fontSize: "var(--fs-body)",
  lineHeight: "var(--lh-body)",
  color: "var(--fg)",
};

export function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: "var(--fs-label)",
        fontWeight: 700,
        color: t.fg,
        background: t.bg,
        whiteSpace: "nowrap",
        minHeight: 28,
      }}
    >
      {children}
    </span>
  );
}

export function CountryTag({ country }: { country: "co" | "py" }) {
  const isCo = country === "co";
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "var(--fs-label)",
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 10,
        marginBottom: 8,
        color: isCo ? CO : PY,
        background: isCo ? "var(--info-tint)" : "var(--dropi-light)",
      }}
    >
      {isCo ? "Colombia" : "Paraguay"}
    </span>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...card, ...style }}>{children}</div>;
}

export function Section({ title, sub, children }: { title: string; sub?: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <div style={sectionTitle}>{title}</div>
      {sub && <div style={sectionSub}>{sub}</div>}
      {children}
    </Card>
  );
}

export function Conclusion({
  tone = "blue",
  label = "Qué significa",
  children,
}: {
  tone?: Tone;
  label?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div
      style={{
        borderLeft: `4px solid ${t.fg}`,
        background: t.bg,
        borderRadius: "0 8px 8px 0",
        padding: "10px 12px",
        marginTop: 12,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: "var(--fs-label)",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: t.fg,
          marginBottom: 3,
        }}
      >
        {label}
      </span>
      <p style={{ fontSize: "var(--fs-body)", color: "var(--fg)", lineHeight: "var(--lh-body)", margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

const ALERT_ICON: Record<Tone, typeof AlertTriangle> = {
  red: AlertTriangle,
  amber: AlertTriangle,
  green: CheckCircle2,
  blue: Info,
  muted: Info,
};

export function Alert({
  tone,
  title,
  children,
}: {
  tone: Tone;
  title: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  const Icon = ALERT_ICON[tone];
  return (
    <div
      role={tone === "red" ? "alert" : "status"}
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 16,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <Icon size={18} aria-hidden color={t.fg} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <h4 style={{ fontSize: "var(--fs-body)", fontWeight: 700, color: t.fg, marginBottom: 4 }}>{title}</h4>
        <p style={{ fontSize: "var(--fs-body)", color: "var(--fg)", lineHeight: "var(--lh-body)", margin: 0 }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: "var(--fs-label)", color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

export function Legend({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: "var(--fs-label)",
        color: "var(--muted)",
        background: "#FAFBFC",
        borderRadius: 8,
        padding: "8px 10px",
        marginBottom: 10,
        lineHeight: 1.5,
      }}
    >
      {children}
    </p>
  );
}

export function StatTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: { cells: ReactNode[]; flag?: Tone }[];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fs-body)" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.cells.map((c, j) => (
                <td
                  key={j}
                  style={{
                    ...tdStyle,
                    fontWeight: j === 0 ? 500 : 400,
                    color: r.flag && j > 0 ? TONES[r.flag].fg : "var(--fg)",
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CoPyTable({
  rows,
}: {
  rows: { label: string; co: ReactNode; py: ReactNode; flag?: Tone }[];
}) {
  return (
    <StatTable
      headers={["", "Colombia", "Paraguay"]}
      rows={rows.map((r) => ({ cells: [r.label, r.co, r.py], flag: r.flag }))}
    />
  );
}

export function MetricBar({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  const width = Math.max(2, Math.min(100, pct));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <div
        style={{
          width: 72,
          fontSize: "var(--fs-label)",
          color: "var(--muted)",
          textAlign: "right",
          flexShrink: 0,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          background: "#F0F4F9",
          borderRadius: 4,
          height: 18,
          overflow: "hidden",
          minWidth: 24,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: color,
            borderRadius: 4,
            minWidth: 2,
          }}
        />
      </div>
      <div
        style={{
          width: 72,
          flexShrink: 0,
          fontSize: "var(--fs-label)",
          fontWeight: 700,
          color: "var(--fg)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function BarGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: title ? 10 : 0 }}>
      {title && (
        <div style={{ fontSize: "var(--fs-label)", fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export type FunnelStep = { label: string; n: string; pct: string; width: number };

export function FunnelBars({
  country,
  base,
  steps,
  color,
}: {
  country: "co" | "py";
  base: string;
  steps: FunnelStep[];
  color: string;
}) {
  return (
    <div>
      <CountryTag country={country} />
      <div style={{ fontSize: "var(--fs-label)", color: "var(--muted)", marginBottom: 8, marginTop: -4 }}>
        Base {base}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {steps.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 148,
                fontSize: "var(--fs-label)",
                fontWeight: 600,
                textAlign: "right",
                flexShrink: 0,
                lineHeight: 1.3,
                color: "var(--fg)",
              }}
            >
              {s.label}
            </div>
            <div
              style={{ flex: 1, background: "#F0F4F9", borderRadius: 5, height: 26, overflow: "hidden" }}
              aria-hidden
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(6, s.width)}%`,
                  background: color,
                  borderRadius: 5,
                }}
              />
            </div>
            <div
              style={{
                width: 56,
                flexShrink: 0,
                fontSize: "var(--fs-label)",
                fontWeight: 700,
                color: "var(--fg)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                fontSize: "var(--fs-label)",
                color: "var(--muted)",
                width: 56,
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.pct}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

export function Disclosure({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          minHeight: 44,
          textAlign: "left",
          color: "var(--fg)",
        }}
      >
        <span style={{ fontSize: "var(--fs-title)", fontWeight: 700 }}>{title}</span>
        <ChevronDown
          size={18}
          aria-hidden
          className="exp003-chevron"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--muted)",
          }}
        />
      </button>
      {open && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
    </div>
  );
}

export function KpiGrid({
  items,
}: {
  items: { val: string; lbl: string; trend?: string; tone?: Tone }[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {items.map((k) => (
        <div
          key={k.lbl}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "var(--fs-headline)",
              fontWeight: 800,
              color: "var(--fg)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: "var(--lh-headline)",
            }}
          >
            {k.val}
          </div>
          <div style={{ fontSize: "var(--fs-label)", color: "var(--muted)", marginTop: 4, lineHeight: 1.3 }}>
            {k.lbl}
          </div>
          {k.trend && (
            <div style={{ marginTop: 6 }}>
              <Tag tone={k.tone ?? "muted"}>{k.trend}</Tag>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
