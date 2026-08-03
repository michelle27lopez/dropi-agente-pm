"use client";

import { useEffect, useState } from "react";
import { Sun } from "lucide-react";

type Meeting = {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  join_url: string | null;
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Bogota" }).format(new Date(iso));
}

function durationMinutes(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

function MeetingRow({ meeting, primary }: { meeting: Meeting; primary: boolean }) {
  const mins = durationMinutes(meeting.start_time, meeting.end_time);
  return (
    <div className="midia-row" style={{ alignItems: "center" }}>
      <div className="midia-row-body">
        <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 2px", fontVariantNumeric: "tabular-nums" }}>{formatTime(meeting.start_time)}</p>
        <p className="midia-row-title" style={{ margin: 0 }}>{meeting.title}</p>
        <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>{mins} min</p>
      </div>
      {primary && meeting.join_url && (
        <a href={meeting.join_url} target="_blank" rel="noreferrer" className="midia-btn-primary" style={{ padding: "7px 12px", fontSize: 12 }}>
          Entrar
        </a>
      )}
    </div>
  );
}

// Reuniones de hoy, sincronizadas por conversación en la tabla
// `today_meetings` (no hay integración en vivo con Google Calendar en el
// hub) — ver [[project_darwin_pd_dashboard]] y api/meetings/route.ts.
export default function HoyPanel() {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);

  useEffect(() => {
    fetch("/api/meetings")
      .then((res) => res.json())
      .then((data) => setMeetings(data.meetings ?? []))
      .catch(() => setMeetings([]));
  }, []);

  if (meetings === null) return null;

  const now = Date.now();
  const upcoming = meetings
    .filter((m) => new Date(m.end_time).getTime() > now)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const proxima = upcoming[0] ?? null;
  const masTarde = upcoming.slice(1);

  return (
    <div className="midia-panel" style={{ animationDelay: "0ms" }}>
      <div className="midia-panel-header">
        <div className="midia-panel-header-left">
          <span className="midia-panel-icon">
            <Sun size={14} />
          </span>
          <span className="midia-panel-label">Hoy</span>
        </div>
      </div>
      {meetings.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 20px 16px" }}>Sin reuniones agendadas para hoy.</p>
      ) : !proxima ? (
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 20px 16px" }}>No tienes más reuniones hoy.</p>
      ) : (
        <div>
          <MeetingRow meeting={proxima} primary />
          {masTarde.map((m) => (
            <MeetingRow key={m.id} meeting={m} primary={false} />
          ))}
        </div>
      )}
    </div>
  );
}
