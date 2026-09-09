"use client";

import { useEffect, useState } from "react";

// Tablero pedido por Laura 2026-09-07: ver el Following de TODAS las
// células en un solo lugar, con CES + estándares de éxito/fracaso por
// proyecto, más las dos métricas transversales de Dropi (NPS general,
// CSAT de experiencias CORE). Vive específicamente en la home de Following
// de Product team — el resto de células siguen viendo el estado vacío de
// FollowingContent (este panel no les pertenece, es el consolidado).

type Metricas = {
  project_id: string;
  ces_score: number | null;
  ces_meta: string | null;
  estandar_exito: string | null;
  estandar_fracaso: string | null;
  notas: string | null;
  updated_at: string;
} | null;

type Linaje = { tipo: "POC" | "Delivery"; name: string; project_code: string | null } | null;

type Item = {
  id: string;
  name: string;
  project_code: string | null;
  celula: { id: string; nombre: string; slug: string } | null;
  metricas: Metricas;
  linaje: Linaje;
};

// Real, sourced de /proveedores/satisfaccion (UserPilot, corte 19-ago-2026).
// No existe un NPS global único de Dropi — cada país tiene su propia
// instancia de UserPilot, sin blend entre ellas. Mostrar eso tal cual en
// vez de inventar un promedio que nadie ha calculado.
const NPS_PLATAFORMA = [
  { pais: "Colombia", score: 57, n: "37.918", color: "var(--t-success, #0ABB87)" },
  { pais: "Ecuador", score: 56, n: "3.354", color: "var(--t-success, #0ABB87)" },
  { pais: "México", score: 48, n: "1.498", color: "var(--t-warning, #F1B44C)" },
];

function ordinaCelulas(items: Item[]) {
  const grupos = new Map<string, { nombre: string; items: Item[] }>();
  for (const it of items) {
    const key = it.celula?.slug ?? "sin-celula";
    if (!grupos.has(key)) grupos.set(key, { nombre: it.celula?.nombre ?? "Sin célula", items: [] });
    grupos.get(key)!.items.push(it);
  }
  return [...grupos.entries()].sort((a, b) => a[1].nombre.localeCompare(b[1].nombre));
}

export default function FollowingBoardTransversal() {
  const [items, setItems] = useState<Item[]>([]);
  const [migracionPendiente, setMigracionPendiente] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/following-metricas")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? []);
        setMigracionPendiente(!!data.migracionPendiente);
      })
      .finally(() => setCargando(false));
  }, []);

  async function guardar(projectId: string, campo: "ces_score" | "estandar_exito" | "estandar_fracaso", valor: string) {
    const body: Record<string, unknown> = { project_id: projectId };
    body[campo] = campo === "ces_score" ? (valor.trim() === "" ? null : Number(valor)) : (valor.trim() === "" ? null : valor);

    const res = await fetch("/api/following-metricas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return;
    const actualizado = await res.json();
    setItems((prev) => prev.map((it) => (it.id === projectId ? { ...it, metricas: actualizado } : it)));
  }

  const grupos = ordinaCelulas(items);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 760, lineHeight: 1.6, marginBottom: 28 }}>
        Consolidado de todo lo que está en fase Following (post-lanzamiento, midiendo si funcionó) en las
        distintas células, más las dos métricas de experiencia que son de Dropi como plataforma, no de un
        proyecto puntual. El campo de POC casi no se usa en la base — por eso cada proyecto muestra su
        linaje real tal cual existe hoy (🔗 POC, 🔗 Delivery, o sin marca si no hay rastro registrado),
        para que cada célula lo confirme caso por caso en vez de asumirlo.
      </p>

      <h2 style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 14 }}>
        Métricas transversales de Dropi
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 960, marginBottom: 36 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 22 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>🌎 NPS general de Dropi</p>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
            No hay un número global único todavía — cada país tiene su propia instancia de UserPilot, sin
            blend entre ellas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {NPS_PLATAFORMA.map((r) => (
              <div key={r.pais} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 12, color: "var(--fg)" }}>{r.pais}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  <strong style={{ fontSize: 16, color: r.color }}>{r.score}</strong> · n={r.n}
                </span>
              </div>
            ))}
          </div>
          <a href="/proveedores/satisfaccion" style={{ display: "inline-block", marginTop: 14, fontSize: 11, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
            Ver detalle completo (UserPilot, corte 19-ago-2026) →
          </a>
        </div>

        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: 22 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>🎯 CSAT · experiencias CORE de Dropi</p>
          <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
            Sin catálogo unificado todavía: hoy cada proyecto mide CSAT/CES a su manera y con nombres
            inconsistentes, y no existe una fórmula para convertirlo en un % agregado (gap confirmado por
            Diana Aldana en comité TARS, 28-ago-2026). Este es exactamente el trabajo que Laura está
            liderando ahora mismo.
          </p>
          <a
            href="https://claude.ai/code/artifact/08922bdf-12de-4356-bf3f-539ee8c3698e"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-block", marginTop: 12, fontSize: 11, fontWeight: 700, color: "#92400E", textDecoration: "none" }}
          >
            Ver Laboratorio CES (en progreso) →
          </a>
        </div>
      </div>

      {migracionPendiente && (
        <div style={{
          background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px",
          fontSize: 12, color: "#92400E", marginBottom: 20,
        }}>
          ⚠️ Falta correr la migración <code>061_following_metricas.sql</code> en Supabase — los campos de
          CES y estándares se ven pero todavía no se pueden editar.
        </div>
      )}

      <h2 style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 14 }}>
        Proyectos en Following, por célula {!cargando && `(${items.length})`}
      </h2>

      {cargando && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

      {!cargando && grupos.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Ninguna célula tiene proyectos en Following todavía.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {grupos.map(([slug, grupo]) => (
          <div key={slug}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{grupo.nombre}</span>
              <span style={{ fontSize: 11, color: "var(--muted)", background: "var(--bg)", padding: "2px 8px", borderRadius: 999 }}>
                {grupo.items.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {grupo.items.map((it) => (
                <FilaProyecto key={it.id} item={it} soloLectura={migracionPendiente} onGuardar={guardar} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilaProyecto({
  item, soloLectura, onGuardar,
}: {
  item: Item;
  soloLectura: boolean;
  onGuardar: (projectId: string, campo: "ces_score" | "estandar_exito" | "estandar_fracaso", valor: string) => void;
}) {
  const [ces, setCes] = useState(item.metricas?.ces_score != null ? String(item.metricas.ces_score) : "");
  const [exito, setExito] = useState(item.metricas?.estandar_exito ?? "");
  const [fracaso, setFracaso] = useState(item.metricas?.estandar_fracaso ?? "");

  const inputStyle: React.CSSProperties = {
    width: "100%", fontSize: 12, padding: "6px 8px", borderRadius: 8,
    border: "1px solid var(--border)", background: soloLectura ? "var(--bg)" : "var(--card)", color: "var(--fg)",
  };

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16,
      display: "grid", gridTemplateColumns: "220px 90px 1fr 1fr", gap: 14, alignItems: "start",
    }}>
      <div>
        <a href={`/proyectos/${(item.project_code ?? item.id).toLowerCase()}`} style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", textDecoration: "none" }}>
          {item.name}
        </a>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{item.project_code ?? "—"}</div>
        {item.linaje ? (
          <div
            title={`Trazado a ${item.linaje.tipo} · ${item.linaje.project_code ?? ""} ${item.linaje.name}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6,
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
              background: item.linaje.tipo === "POC" ? "var(--dropi-light)" : "#EFF6FF",
              color: item.linaje.tipo === "POC" ? "var(--dropi)" : "#1D4ED8",
            }}
          >
            🔗 {item.linaje.tipo} · {item.linaje.project_code ?? item.linaje.name}
          </div>
        ) : (
          <div style={{ fontSize: 10, color: "var(--faint, #9CA3AF)", marginTop: 6, fontStyle: "italic" }}>
            sin linaje registrado
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>CES</div>
        <input
          type="number" min={1} max={5} placeholder="—"
          value={ces} disabled={soloLectura}
          onChange={(e) => setCes(e.target.value)}
          onBlur={() => onGuardar(item.id, "ces_score", ces)}
          style={inputStyle}
        />
      </div>

      <div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>Estándar de éxito</div>
        <input
          type="text" placeholder="Sin definir"
          value={exito} disabled={soloLectura}
          onChange={(e) => setExito(e.target.value)}
          onBlur={() => onGuardar(item.id, "estandar_exito", exito)}
          style={inputStyle}
        />
      </div>

      <div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>Estándar de fracaso</div>
        <input
          type="text" placeholder="Sin definir"
          value={fracaso} disabled={soloLectura}
          onChange={(e) => setFracaso(e.target.value)}
          onBlur={() => onGuardar(item.id, "estandar_fracaso", fracaso)}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
