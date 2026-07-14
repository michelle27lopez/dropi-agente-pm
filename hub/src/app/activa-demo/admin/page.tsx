"use client";
import { useEffect, useState, useRef } from "react";

type Attendee = { id: string; name: string; role: string; category: string; token: string; match_id: string | null; whatsapp: string | null };
type Stats = { suppliers: number; dropshippers: number; total: number; matched: number; activated: boolean };

const CATEGORY_LABELS: Record<string, string> = { ropa: "👗 Ropa", tech: "📱 Tech", cosmeticos: "✨ Cosméticos", hogar: "🏠 Hogar" };

export default function ActivaAdmin() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", role: "supplier", category: "ropa" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = async () => {
    const [a, s] = await Promise.all([
      fetch("/api/activa-demo/attendees").then(r => r.json()),
      fetch("/api/activa-demo/stats").then(r => r.json()),
    ]);
    if (Array.isArray(a)) setAttendees(a);
    if (s) setStats(s);
  };

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const addManual = async () => {
    if (!form.name.trim()) return;
    await fetch("/api/activa-demo/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(f => ({ ...f, name: "", whatsapp: "" }));
    load();
  };

  const remove = async (id: string) => {
    await fetch("/api/activa-demo/attendees", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const trigger = async () => {
    setTriggering(true);
    setTriggerResult(null);
    try {
      const res = await fetch("/api/activa-demo/trigger", { method: "POST" });
      const data = await res.json();
      setTriggerResult(data.ok ? `✅ ${data.matches} matches creados · ${data.notified} mensajes enviados` : `❌ ${data.error}`);
      load();
    } finally { setTriggering(false); }
  };

  const reset = async () => {
    if (!confirm("¿Resetear todo el demo? Se borran asistentes, matches y mensajes.")) return;
    setResetting(true);
    await fetch("/api/activa-demo/reset", { method: "POST" });
    setTriggerResult(null);
    load();
    setResetting(false);
  };

  const BASE = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#111", color: "#fff", padding: "14px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#7C3AED" }}>DROPI ACTIVA</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Admin · Solo Jaime</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>{stats?.suppliers ?? 0} P</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#F77F00" }}>{stats?.dropshippers ?? 0} D</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: stats?.activated ? "#10B981" : "#F59E0B" }}>
            {stats?.activated ? "⚡ ACTIVO" : "⏸ EN ESPERA"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Activar */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 12 }}>⚡ Control del demo</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={trigger} disabled={triggering || stats?.activated}
              style={{ background: triggering || stats?.activated ? "#E5E7EB" : "#7C3AED", color: triggering || stats?.activated ? "#aaa" : "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 800, cursor: triggering || stats?.activated ? "default" : "pointer" }}>
              {triggering ? "Activando..." : stats?.activated ? "✅ Ya activado" : "⚡ Activar Dropi Activa"}
            </button>
            <button onClick={reset} disabled={resetting}
              style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {resetting ? "Reseteando..." : "🗑 Reset demo"}
            </button>
            <a href="/activa-demo/dashboard" target="_blank" style={{ background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              📺 Dashboard sala →
            </a>
          </div>
          {triggerResult && (
            <div style={{ marginTop: 12, background: triggerResult.startsWith("✅") ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${triggerResult.startsWith("✅") ? "#BBF7D0" : "#FECACA"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: triggerResult.startsWith("✅") ? "#166534" : "#DC2626" }}>
              {triggerResult}
            </div>
          )}
        </div>

        {/* QR links */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 12 }}>📱 Links QR para sala</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "🏭 Registro Proveedor", url: "/activa-demo/registro/supplier", color: "#7C3AED" },
              { label: "🛒 Registro Dropshipper", url: "/activa-demo/registro/dropshipper", color: "#F77F00" },
            ].map(l => (
              <a key={l.url} href={l.url} target="_blank" style={{ fontSize: 12, fontWeight: 700, color: l.color, background: `${l.color}10`, border: `1px solid ${l.color}30`, borderRadius: 8, padding: "8px 14px", textDecoration: "none" }}>
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Add manual */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 12 }}>➕ Agregar asistente manual</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <input placeholder="Nombre" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#111", outline: "none", minWidth: 160 }} />
            <input placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#111", outline: "none", minWidth: 140 }} />
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#111", outline: "none" }}>
              <option value="supplier">Proveedor</option>
              <option value="dropshipper">Dropshipper</option>
            </select>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#111", outline: "none" }}>
              <option value="ropa">Ropa</option>
              <option value="tech">Tech</option>
              <option value="cosmeticos">Cosméticos</option>
              <option value="hogar">Hogar</option>
            </select>
            <button onClick={addManual} disabled={!form.name.trim()}
              style={{ background: form.name.trim() ? "#111" : "#E5E7EB", color: form.name.trim() ? "#fff" : "#aaa", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Agregar
            </button>
          </div>
        </div>

        {/* Attendees list */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E7EB", fontSize: 13, fontWeight: 700, color: "#111" }}>
            Asistentes ({attendees.length})
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Nombre", "Rol", "Categoría", "WhatsApp", "Match", "Portal"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E5E7EB" }}>{h}</th>
                  ))}
                  <th style={{ padding: "10px 16px", borderBottom: "1px solid #E5E7EB" }} />
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 600, color: "#111" }}>{a.name}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: a.role === "supplier" ? "#7C3AED" : "#F77F00", background: a.role === "supplier" ? "#F5F3FF" : "#FFF8F0", padding: "2px 8px", borderRadius: 99 }}>
                        {a.role === "supplier" ? "Proveedor" : "Dropshipper"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", color: "#555" }}>{CATEGORY_LABELS[a.category] ?? a.category}</td>
                    <td style={{ padding: "10px 16px", color: "#555", fontSize: 12 }}>{a.whatsapp ?? "—"}</td>
                    <td style={{ padding: "10px 16px" }}>
                      {a.match_id
                        ? <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "#F0FDF4", padding: "2px 8px", borderRadius: 99 }}>✓ Conectado</span>
                        : <span style={{ fontSize: 11, color: "#9CA3AF" }}>Pendiente</span>}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <a href={`${BASE}/activa-demo/${a.role === "supplier" ? "s" : "d"}/${a.token}`} target="_blank"
                        style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", textDecoration: "none" }}>Ver →</a>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <button onClick={() => remove(a.id)} style={{ fontSize: 11, color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>✕</button>
                    </td>
                  </tr>
                ))}
                {attendees.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "20px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>Sin asistentes aún</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
