"use client";

import { useEffect, useMemo, useState } from "react";

type BugRow = {
  id: string;
  jira_key: string;
  jira_url: string;
  summary: string;
  label_type: string | null;
  product_code: string | null;
  status: string | null;
  assignee: string | null;
  parent_epic_key: string | null;
  reported_by: string | null;
  created_at: string;
};

const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13, verticalAlign: "top",
};
const pill = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});
const neutralPill: React.CSSProperties = pill("var(--muted)", "#F3F4F6");
const inputStyle: React.CSSProperties = {
  border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)",
  borderRadius: 8, padding: "9px 12px", fontSize: 13,
};

// Jira solo tiene 3 statusCategory reales — "new" (To Do), "indeterminate" (In
// Progress), "done" (Done) — el mismo gris/azul/verde que se ve en Jira mismo.
// Mapeamos el texto libre de `status` a esas 3, pero con los tonos de nuestra
// paleta (DESIGN.md) en vez de copiar el hex exacto de Jira.
function statusStyle(status: string | null): React.CSSProperties {
  const s = (status ?? "").toLowerCase();
  if (/(resuelt|cerrad|hecho|complet|done)/.test(s)) return pill("var(--success)", "var(--success-tint)");
  if (/(progreso|revisi[oó]n|curso|review|doing)/.test(s)) return pill("var(--info)", "var(--info-tint)");
  return pill("var(--fg)", "#F3F4F6"); // "new" / To Do / backlog — default
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

// Texto plano pensado para pegar directo en un update semanal (Slack, doc) —
// no una tabla Markdown, que no renderiza en la mayoría de esos destinos.
function buildSummaryText(rowsToExport: BugRow[]): string {
  const today = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const count = rowsToExport.length;
  const header = `Seguimiento de Bugs · Jira PROD — ${today} (${count} bug${count === 1 ? "" : "s"})`;
  const lines = rowsToExport.map((r) => {
    const epic = r.parent_epic_key ? ` · Épica: ${r.parent_epic_key}` : "";
    return `• ${r.jira_key} — ${r.summary}\n   Estado: ${r.status ?? "—"} · Asignado: ${r.assignee ?? "sin asignar"}${epic}`;
  });
  return [header, "", ...lines].join("\n");
}

const ALL = "__all__";

export default function BugsPage() {
  const [rows, setRows] = useState<BugRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [productFilter, setProductFilter] = useState(ALL);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/jira-bug-tracking")
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) { setError(data.error); return; }
        setRows(data);
      })
      .catch((e) => setError(String(e)));
  }, []);

  const statuses = useMemo(
    () => Array.from(new Set((rows ?? []).map((r) => r.status).filter(Boolean))) as string[],
    [rows]
  );
  const products = useMemo(
    () => Array.from(new Set((rows ?? []).map((r) => r.product_code).filter(Boolean))) as string[],
    [rows]
  );

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== ALL && r.status !== statusFilter) return false;
      if (productFilter !== ALL && r.product_code !== productFilter) return false;
      if (!q) return true;
      return (
        r.jira_key.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        (r.product_code ?? "").toLowerCase().includes(q) ||
        (r.assignee ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter, productFilter]);

  async function handleCopy() {
    await navigator.clipboard.writeText(buildSummaryText(filteredRows));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Seguimiento de Bugs</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
            🐞 Seguimiento de Bugs
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, maxWidth: "70ch" }}>
            HUs de bug publicadas en Jira (proyecto PROD). Solo lectura — el estado se edita en Jira,
            acá se refleja para que cualquiera del equipo lo consulte sin entrar.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            className="hub-search"
            style={{ ...inputStyle, flex: "1 1 260px", minWidth: 200 }}
            placeholder="Buscar por key, resumen, producto o asignado…"
            aria-label="Buscar bugs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="hub-search"
            style={{ ...inputStyle, minWidth: 160 }}
            aria-label="Filtrar por estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value={ALL}>Todos los estados</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="hub-search"
            style={{ ...inputStyle, minWidth: 140 }}
            aria-label="Filtrar por producto"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value={ALL}>Todos los productos</option>
            {products.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            onClick={handleCopy}
            disabled={filteredRows.length === 0}
            className="hub-link"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginLeft: "auto", borderRadius: 8, padding: "9px 14px",
              fontSize: 12, fontWeight: 700, color: copied ? "var(--success)" : "var(--fg)",
              cursor: filteredRows.length === 0 ? "not-allowed" : "pointer",
              opacity: filteredRows.length === 0 ? 0.5 : 1,
            }}
            title="Copia un resumen en texto plano, listo para pegar en un update semanal"
          >
            {copied ? "✓ Copiado" : "📋 Copiar resumen"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "-8px 0 16px" }}>
          &quot;Copiar resumen&quot; incluye solo los bugs visibles con los filtros de arriba — pégalo directo en tu update semanal.
        </p>

        <div style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 12,
          overflow: "hidden",
        }}>
          {error && (
            <div style={{ padding: 20, fontSize: 13, color: "var(--danger)" }}>
              Error cargando datos: {error}
            </div>
          )}

          {!error && rows === null && (
            <div style={{ padding: 20, fontSize: 13, color: "var(--muted)" }}>Cargando…</div>
          )}

          {!error && rows !== null && rows.length === 0 && (
            <div style={{ padding: 20, fontSize: 13, color: "var(--muted)" }}>
              Todavía no hay bugs registrados.
            </div>
          )}

          {!error && rows !== null && rows.length > 0 && filteredRows.length === 0 && (
            <div style={{ padding: 20, fontSize: 13, color: "var(--muted)" }}>
              Ningún bug coincide con ese filtro.
            </div>
          )}

          {!error && filteredRows.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Key</th>
                    <th style={thStyle}>Resumen</th>
                    <th style={thStyle}>Producto</th>
                    <th style={thStyle}>Épica</th>
                    <th style={thStyle}>Estado</th>
                    <th style={thStyle}>Asignado</th>
                    <th style={thStyle}>Reportado por</th>
                    <th style={thStyle}>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="bug-row">
                      <td style={tdStyle}>
                        <a
                          href={row.jira_url}
                          target="_blank"
                          rel="noreferrer"
                          title={`Abrir ${row.jira_key} en Jira`}
                          className="bug-key-link"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            color: "var(--info)", fontWeight: 700,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {row.jira_key}
                          <span aria-hidden="true" style={{ fontSize: 11 }}>↗</span>
                        </a>
                      </td>
                      <td style={{ ...tdStyle, maxWidth: 340 }}>{row.summary}</td>
                      <td style={tdStyle}>
                        {row.product_code && <span style={neutralPill}>{row.product_code}</span>}
                        {row.label_type && (
                          <span style={{ ...neutralPill, marginLeft: 6 }}>{row.label_type}</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {row.parent_epic_key ? (
                          <a
                            href={`https://dropi-it.atlassian.net/browse/${row.parent_epic_key}`}
                            target="_blank"
                            rel="noreferrer"
                            title={`Abrir épica ${row.parent_epic_key} en Jira`}
                            className="bug-key-link"
                            style={{ color: "var(--muted)", fontWeight: 600 }}
                          >
                            {row.parent_epic_key}
                          </a>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {row.status ? <span style={statusStyle(row.status)}>{row.status}</span> : "—"}
                      </td>
                      <td style={tdStyle}>{row.assignee ?? "—"}</td>
                      <td style={tdStyle}>{row.reported_by ?? "—"}</td>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "var(--muted)" }}>
                        {formatDate(row.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
