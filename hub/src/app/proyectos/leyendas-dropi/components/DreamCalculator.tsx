"use client";
import { useState } from "react";
import { TIERS } from "../mock/tiers";

const MARGEN = 15000;

const DREAMS = [
  { label: "Un viaje al mar", sub: "7 días, dos personas, todo pago", cost: 4_500_000, months: 3 },
  { label: "Un celular nuevo", sub: "El equipo con el que trabajas mejor", cost: 3_200_000, months: 2 },
  { label: "Pagar mis deudas", sub: "Quedar en cero y respirar", cost: 15_000_000, months: 4 },
  { label: "Una moto 0 km", sub: "Movilidad propia para tu operación", cost: 8_900_000, months: 2 },
  { label: "Ser independiente", sub: "Seis meses de ingresos sin depender de un jefe", cost: 18_000_000, months: 6 },
  { label: "Un carro 0 km", sub: "Tu primer vehículo a tu nombre", cost: 75_000_000, months: 6 },
  { label: "Una maestría en Europa", sub: "Matrícula, tiquetes y sostenimiento", cost: 90_000_000, months: 5 },
  { label: "Mi casa propia", sub: "Cuota inicial y gastos de escritura", cost: 250_000_000, months: 6 },
  { label: "Mi propia bodega y equipo", sub: "Espacio, inventario y gente contratada", cost: 600_000_000, months: 5 },
  { label: "Mi empresa de e-commerce", sub: "Operación regional con marca propia", cost: 1_800_000_000, months: 5 },
] as const;

const TIER_MIN = [0, 1, 101, 1001, 2501, 5001, 20001];
function tierForOrders(o: number) {
  let k = 0;
  for (let j = 0; j < TIER_MIN.length; j++) if (o >= TIER_MIN[j]) k = j;
  return k;
}

const COP = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

export default function DreamCalculator() {
  const [dreamIdx, setDreamIdx] = useState<number | null>(null);

  const dream = dreamIdx !== null ? DREAMS[dreamIdx] : null;
  const result = dream
    ? (() => {
        const orders = Math.ceil(dream.cost / (MARGEN * dream.months));
        const tierId = tierForOrders(orders);
        return { orders, tierId, tierName: TIERS[tierId]?.name ?? "—" };
      })()
    : null;

  return (
    <div>
      <p className="mx-auto mb-6 max-w-lg text-center text-sm text-[#EAEAEA]/60">
        Toca un sueño y proyectamos el nivel al que llegarías con ese ritmo de ventas.
      </p>
      <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
        {DREAMS.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setDreamIdx(i)}
            className="rounded border px-3 py-2 text-[12px] font-bold transition-all"
            style={{
              borderColor: dreamIdx === i ? "#FF8500" : "rgba(234,234,234,0.15)",
              background: dreamIdx === i ? "rgba(255,133,0,0.12)" : "rgba(234,234,234,0.03)",
              color: dreamIdx === i ? "#FF8500" : "#EAEAEA",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {result && dream && (
        <div
          className="mx-auto mt-6 max-w-md rounded border p-5 text-center"
          style={{ borderColor: "rgba(255,133,0,0.3)", background: "rgba(255,133,0,0.06)" }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#FF8500]">
            {dream.label} · {COP(dream.cost)} en {dream.months} {dream.months === 1 ? "mes" : "meses"}
          </div>
          <div className="mt-2 text-2xl font-bold text-[#EAEAEA]">
            {result.orders.toLocaleString("es-CO")} órdenes/mes
          </div>
          <div className="mt-1 text-sm text-[#EAEAEA]/60">
            te ubican en nivel <span className="font-bold text-[#FF8500]">{result.tierName}</span>
          </div>
          <p className="mt-2 text-[11px] text-[#EAEAEA]/40">
            Proyección con margen de referencia {COP(MARGEN)}/orden — tu margen real puede variar.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#camino"
          className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#0b0b0b] transition-all hover:-translate-y-[3px] hover:tracking-[0.18em]"
          style={{
            background: "#FF8500",
            padding: "14px 28px",
            clipPath:
              "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
          }}
        >
          Ver mi camino
        </a>
        <a
          href="#como-funciona"
          className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#EAEAEA] transition-colors hover:text-[#FF8500]"
          style={{
            border: "1px solid rgba(234,234,234,0.25)",
            padding: "14px 28px",
          }}
        >
          Cómo funciona
        </a>
      </div>
    </div>
  );
}
