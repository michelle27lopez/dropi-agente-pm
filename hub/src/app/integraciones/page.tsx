"use client";

import { useEffect, useState } from "react";

type LogRow = {
  id: string;
  recibido_en: string;
  fuente: "externo" | "test";
  ok: boolean;
  lote_numero: number | null;
  lote_total: number | null;
  recibidos: number;
  escritos: number;
  errores: string[];
  mensaje: string | null;
};

type Acuse = {
  ok: boolean;
  lote: number | null;
  recibidos: number;
  escritos: number;
  errores: string[];
};

function badge(text: string, color: string, bg: string) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color, background: bg,
      border: `1px solid ${color}30`, padding: "2px 9px", borderRadius: 99,
    }}>{text}</span>
  );
}

export default function IntegracionesPage() {
  const [configurado, setConfigurado] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [cargando, setCargando] = useState(true);
  const [probando, setProbando] = useState(false);
  const [resultadoPrueba, setResultadoPrueba] = useState<Acuse | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const res = await fetch("/api/integraciones/cuidado-de-campanas");
      const data = await res.json();
      setConfigurado(Boolean(data.configurado));
      setLogs(data.logs ?? []);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function probar() {
    setProbando(true);
    setResultadoPrueba(null);
    try {
      const res = await fetch("/api/integraciones/cuidado-de-campanas/test", { method: "POST" });
      const data = await res.json();
      setResultadoPrueba(data);
      await cargar();
    } finally {
      setProbando(false);
    }
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
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Integraciones</span>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 60px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
            Integraciones · Webhooks entrantes
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Webhooks que otros sistemas usan para enviarnos data. Cada uno documenta su contrato,
            expone su estado y se puede probar sin esperar a la entrega real.
          </p>
        </div>

        <div style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 14,
          padding: "22px 24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                Cuidado de campañas
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Ventas dropshipper × producto en CO — ventana móvil de 8 días, martes y jueves.
              </div>
            </div>
            {cargando
              ? badge("Cargando…", "#64748B", "#F1F5F9")
              : configurado
                ? badge("Activo", "#059669", "#F0FDF4")
                : badge("Falta CUIDADO_CAMPANAS_TOKEN", "#DC2626", "#FEF2F2")}
          </div>

          <div style={{
            fontSize: 12, color: "var(--fg)", background: "#F8FAFC",
            border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", marginBottom: 14,
          }}>
            <div>POST /api/webhooks/cuidado-de-campanas</div>
            <div>Authorization: Bearer &lt;CUIDADO_CAMPANAS_TOKEN&gt;</div>
            <div>Content-Type: application/json</div>
          </div>

          <ul style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, margin: "0 0 16px", paddingLeft: 18 }}>
            <li>Body: <code>{`{ ventana, lote, registros: [...] }`}</code> — 28 campos por registro, ver <code>doc hub/webhook_especificacion.md</code>.</li>
            <li>Idempotencia: upsert por <code>(fecha_corte, id_dropshipper, id_producto)</code> — reenviar el mismo lote sustituye, no duplica.</li>
            <li>Lotes de 500 registros, secuenciales. Un 200 sin <code>escritos</code> se trata como fallo, no como éxito.</li>
            <li>Variante <strong>A · completa</strong>: incluye nombre y correo de dropshipper y proveedor.</li>
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={probar}
              disabled={probando}
              style={{
                fontSize: 12, fontWeight: 700, color: "#fff", background: probando ? "#94A3B8" : "#111827",
                border: "none", borderRadius: 8, padding: "8px 16px", cursor: probando ? "default" : "pointer",
              }}
            >
              {probando ? "Enviando prueba…" : "Enviar prueba"}
            </button>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              Manda un lote sintético de 1 fila por el mismo camino que el pipeline real y muestra el acuse.
            </span>
          </div>

          {resultadoPrueba && (
            <div style={{
              marginTop: 14, fontSize: 12, borderRadius: 10, padding: "10px 14px",
              background: resultadoPrueba.ok ? "#F0FDF4" : "#FEF2F2",
              border: `1px solid ${resultadoPrueba.ok ? "#05966930" : "#DC262630"}`,
              color: resultadoPrueba.ok ? "#059669" : "#DC2626",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}>
              {JSON.stringify(resultadoPrueba)}
            </div>
          )}
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>
            Últimas entregas
          </div>
          {logs.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Todavía no ha llegado ninguna entrega.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                    <th style={{ padding: "6px 8px", fontWeight: 600 }}>Recibido</th>
                    <th style={{ padding: "6px 8px", fontWeight: 600 }}>Fuente</th>
                    <th style={{ padding: "6px 8px", fontWeight: 600 }}>Lote</th>
                    <th style={{ padding: "6px 8px", fontWeight: 600 }}>Recibidos</th>
                    <th style={{ padding: "6px 8px", fontWeight: 600 }}>Escritos</th>
                    <th style={{ padding: "6px 8px", fontWeight: 600 }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "6px 8px", color: "var(--fg)" }}>{new Date(log.recibido_en).toLocaleString("es-CO")}</td>
                      <td style={{ padding: "6px 8px" }}>{log.fuente === "test" ? badge("Prueba", "#6366F1", "#EEF2FF") : badge("Externo", "#0EA5E9", "#F0F9FF")}</td>
                      <td style={{ padding: "6px 8px", color: "var(--fg)" }}>{log.lote_numero ?? "—"}{log.lote_total ? ` / ${log.lote_total}` : ""}</td>
                      <td style={{ padding: "6px 8px", color: "var(--fg)" }}>{log.recibidos}</td>
                      <td style={{ padding: "6px 8px", color: "var(--fg)" }}>{log.escritos}</td>
                      <td style={{ padding: "6px 8px" }}>{log.ok ? badge("OK", "#059669", "#F0FDF4") : badge(log.mensaje || "Fallo", "#DC2626", "#FEF2F2")}</td>
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
