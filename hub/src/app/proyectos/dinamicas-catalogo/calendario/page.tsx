"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SavedNode, Milestone, parseMilestones, milestoneEndDate, milestoneStartDate } from "../planeacion/nodes";
import { Sidebar } from "../Sidebar";

type Campaign = { id: string; name: string };
type RealMilestone = Milestone & { campaignId: string; campaignName: string; start: Date; end: Date };

// Roadmap tentativo acordado el 24-jun-2026 con el equipo — mientras no exista una
// campaña real en Planeación para ese mes, se muestra acá como sugerencia de fecha.
const SUGERENCIAS = [
  { mes: "Septiembre 2026", campana: "Amor y Amistad · Semana del dropshipper", nota: "Pendiente confirmar. Posible evento físico en Bogotá (manejar con discreción)" },
  { mes: "Octubre 2026", campana: "Halloween · Precios de terror", nota: "" },
  { mes: "Noviembre 2026", campana: "Black Days · Black Friday", nota: "" },
  { mes: "Diciembre 2026", campana: "Extensión Black Friday", nota: "Hasta el 8–9 de dic. Diciembre es complejo para lanzar cosas nuevas" },
  { mes: "Enero 2027", campana: "Bienestar · Deporte · Fitness · Cuidado personal", nota: "" },
  { mes: "Febrero 2027", campana: "San Valentín", nota: "Tentativo" },
  { mes: "Marzo 2027", campana: "Día de la Mujer", nota: "Belleza · Moda · Bienestar" },
  { mes: "Abril 2027", campana: "Campaña mes crítico", nota: "Hogar + Semana Santa / Biblias" },
];

type MilestoneState = "hecho" | "hoy" | "proximo";
const STATE_COLOR: Record<MilestoneState, { text: string; solid: string; tint: string }> = {
  hecho: { text: "Hecho", solid: "#10B981", tint: "#ECFDF5" },
  hoy: { text: "Hoy", solid: "#F77F00", tint: "#FFF3E0" },
  proximo: { text: "Próximo", solid: "#3B82F6", tint: "#EFF6FF" },
};

function milestoneState(start: Date, end: Date, todayStart: Date): MilestoneState {
  if (todayStart.getTime() === start.getTime() || (todayStart >= start && todayStart <= end)) return "hoy";
  return end < todayStart ? "hecho" : "proximo";
}

const DAY_LABELS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Grilla de 6 semanas x 7 días (lunes a domingo) que cubre completo el mes de `monthDate`. */
function buildMonthGrid(monthDate: Date): Date[][] {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = lunes
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - firstWeekday);

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Asigna cada hito que se cruza con la semana a un "carril" (fila) sin solaparse, estilo Google/Notion. */
function layoutWeek(weekStart: Date, weekEnd: Date, milestones: RealMilestone[]): { milestone: RealMilestone; startCol: number; endCol: number; lane: number }[] {
  const inWeek = milestones
    .filter((m) => m.end >= weekStart && m.start <= weekEnd)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const lanes: Date[] = []; // última fecha ocupada por carril
  const placed: { milestone: RealMilestone; startCol: number; endCol: number; lane: number }[] = [];

  for (const m of inWeek) {
    const clampedStart = m.start < weekStart ? weekStart : m.start;
    const clampedEnd = m.end > weekEnd ? weekEnd : m.end;
    const startCol = Math.round((clampedStart.getTime() - weekStart.getTime()) / 86400000);
    const endCol = Math.round((clampedEnd.getTime() - weekStart.getTime()) / 86400000);

    let lane = lanes.findIndex((occupiedUntil) => occupiedUntil < clampedStart);
    if (lane === -1) { lane = lanes.length; lanes.push(clampedEnd); }
    else lanes[lane] = clampedEnd;

    placed.push({ milestone: m, startCol, endCol, lane });
  }
  return placed;
}

export default function CalendarioPage() {
  const router = useRouter();
  const [milestones, setMilestones] = useState<RealMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    fetch("/api/campaigns-planeacion")
      .then((r) => r.json())
      .then(async (d) => {
        const list: Campaign[] = Array.isArray(d) ? d : [];
        const perCampaign = await Promise.all(list.map(async (c) => {
          try {
            const nodes: SavedNode[] = await fetch(`/api/campaigns-planeacion/${c.id}/nodes`).then((r) => r.json());
            const calendario = (Array.isArray(nodes) ? nodes : []).find((n) => n.node_key === "calendario")?.data;
            return parseMilestones(calendario?.milestones)
              .map((m) => {
                const start = milestoneStartDate(m.date);
                const end = milestoneEndDate(m.date);
                if (!start || !end) return null;
                return { ...m, campaignId: c.id, campaignName: c.name, start, end };
              })
              .filter((m): m is RealMilestone => m !== null);
          } catch {
            return [];
          }
        }));
        setMilestones(perCampaign.flat());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const weeks = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const today = startOfDay(new Date());
  const monthLabel = `${MONTH_LABELS[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  const goMonth = (delta: number) => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 32px 80px" }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Calendario</h1>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Hitos reales de las campañas en Planeación, más el roadmap tentativo de fechas especiales para las que aún no tienen campaña creada.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)" }}>{monthLabel}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button onClick={() => setViewMonth(startOfDay(new Date()))} style={{
                fontSize: 12.5, fontWeight: 600, color: "var(--muted)", background: "none",
                border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", marginRight: 6,
              }}>
                Hoy
              </button>
              <button onClick={() => goMonth(-1)} aria-label="Mes anterior" style={{
                display: "flex", background: "none", border: "1px solid var(--border)", borderRadius: 8,
                padding: 6, cursor: "pointer", color: "var(--muted)",
              }}>
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => goMonth(1)} aria-label="Mes siguiente" style={{
                display: "flex", background: "none", border: "1px solid var(--border)", borderRadius: 8,
                padding: 6, cursor: "pointer", color: "var(--muted)",
              }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando...</p>
          ) : (
            <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "var(--bg, #F8F9FA)" }}>
                {DAY_LABELS.map((d) => (
                  <div key={d} style={{ padding: "8px 10px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    {d}
                  </div>
                ))}
              </div>
              {weeks.map((week, wi) => {
                const weekStart = week[0];
                const weekEnd = week[6];
                const placedEvents = layoutWeek(weekStart, weekEnd, milestones);
                const laneCount = Math.max(1, ...placedEvents.map((p) => p.lane + 1));
                const rowHeight = 26 + laneCount * 22;

                return (
                  <div key={wi} style={{
                    position: "relative", display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                    borderTop: "1px solid #F3F4F6", minHeight: rowHeight,
                  }}>
                    {week.map((day, di) => {
                      const inMonth = day.getMonth() === viewMonth.getMonth();
                      const isToday = day.getTime() === today.getTime();
                      return (
                        <div key={di} style={{
                          borderLeft: di > 0 ? "1px solid #F3F4F6" : "none",
                          padding: "5px 8px", minHeight: rowHeight,
                        }}>
                          <span style={{
                            fontSize: 11.5, fontWeight: isToday ? 800 : 600,
                            color: isToday ? "#fff" : inMonth ? "var(--fg)" : "#D1D5DB",
                            background: isToday ? "var(--dropi)" : "transparent",
                            borderRadius: 999, padding: isToday ? "1px 7px" : 0,
                          }}>
                            {day.getDate()}
                          </span>
                        </div>
                      );
                    })}

                    <div style={{ position: "absolute", top: 26, left: 0, right: 0 }}>
                      {placedEvents.map(({ milestone, startCol, endCol, lane }) => {
                        const state = milestoneState(milestone.start, milestone.end, today);
                        const color = STATE_COLOR[state];
                        return (
                          <button
                            key={`${milestone.campaignId}-${milestone.label}-${startCol}`}
                            onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${milestone.campaignId}/dashboard`)}
                            title={`${milestone.campaignName} · ${milestone.label}${milestone.notes ? ` — ${milestone.notes}` : ""}`}
                            style={{
                              position: "absolute",
                              top: lane * 22, height: 19,
                              left: `${(startCol / 7) * 100}%`,
                              width: `${((endCol - startCol + 1) / 7) * 100}%`,
                              background: color.tint, borderLeft: `3px solid ${color.solid}`,
                              borderRadius: 5, padding: "0 7px", margin: "0 3px",
                              fontSize: 11, fontWeight: 600, color: "var(--fg)",
                              textAlign: "left", cursor: "pointer", overflow: "hidden",
                              whiteSpace: "nowrap", textOverflow: "ellipsis",
                              display: "flex", alignItems: "center",
                              boxSizing: "content-box",
                            }}
                          >
                            <span style={{ color: "var(--muted)", fontWeight: 700, marginRight: 4 }}>{milestone.campaignName}</span>
                            {milestone.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && milestones.length === 0 && (
            <div style={{ background: "#fff", border: "2px dashed var(--border)", borderRadius: 14, padding: "32px 24px", textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Ninguna campaña tiene hitos cargados todavía en su nodo Calendario.</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 16, marginBottom: 32, fontSize: 12, color: "var(--muted)" }}>
            {(Object.keys(STATE_COLOR) as MilestoneState[]).map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: STATE_COLOR[s].solid, display: "inline-block" }} />
                {STATE_COLOR[s].text}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
            Sugerencias de campañas futuras
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Roadmap tentativo acordado el 24 de junio de 2026 · sin campaña creada todavía.
          </p>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {SUGERENCIAS.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "140px 1fr",
                borderBottom: i < SUGERENCIAS.length - 1 ? "1px solid #F3F4F6" : "none",
              }}>
                <div style={{ padding: "14px 16px", borderRight: "1px solid #F3F4F6", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
                  {c.mes}
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", marginBottom: c.nota ? 3 : 0 }}>{c.campana}</div>
                  {c.nota && <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.nota}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
