"use client";

import { useMemo, useState } from "react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const MESES_ABREV = [
  "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic",
];

const selectStyle: React.CSSProperties = {
  fontSize: 13,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--fg)",
  cursor: "pointer",
};

function formatRango(start: Date, end: Date) {
  const dia = (d: Date) => d.getDate();
  const mesInicio = MESES_ABREV[start.getMonth()];
  const mesFin = MESES_ABREV[end.getMonth()];
  if (start.getMonth() === end.getMonth()) {
    return `${dia(start)} al ${dia(end)} de ${mesInicio}`;
  }
  return `${dia(start)} ${mesInicio} al ${dia(end)} ${mesFin}`;
}

// Semanas laborales (lunes a viernes) reales según el calendario, ancladas
// a los lunes que caen dentro del mes/año seleccionado.
function getSemanasLaborales(year: number, monthIndex: number) {
  const semanas: { start: Date; end: Date }[] = [];
  const cursor = new Date(year, monthIndex, 1);
  while (cursor.getMonth() === monthIndex) {
    if (cursor.getDay() === 1) {
      const start = new Date(cursor);
      const end = new Date(cursor);
      end.setDate(end.getDate() + 4);
      semanas.push({ start, end });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return semanas;
}

// Índice de la semana laboral vigente: la última que ya empezó respecto a
// hoy, para que el selector abra siempre en la semana que se está reportando.
function getSemanaVigente(semanas: { start: Date; end: Date }[], today: Date) {
  for (let i = semanas.length - 1; i >= 0; i--) {
    if (semanas[i].start <= today) return i;
  }
  return 0;
}

export default function WeeklySelector() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const semanas = useMemo(() => getSemanasLaborales(year, monthIndex), [year, monthIndex]);
  const [semanaIdx, setSemanaIdx] = useState(() => getSemanaVigente(getSemanasLaborales(year, monthIndex), now));

  function handleMonthChange(nuevoMes: number) {
    setMonthIndex(nuevoMes);
    setSemanaIdx(0);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
        Semana del
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <select value={monthIndex} onChange={(e) => handleMonthChange(Number(e.target.value))} style={{ ...selectStyle, flex: 1.4 }}>
          {MESES.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select value={semanaIdx} onChange={(e) => setSemanaIdx(Number(e.target.value))} style={{ ...selectStyle, flex: 1.6 }}>
          {semanas.map((s, i) => (
            <option key={i} value={i}>{formatRango(s.start, s.end)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
