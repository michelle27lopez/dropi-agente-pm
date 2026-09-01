"use client";
import { useState } from "react";
import { TIERS } from "../mock/tiers";

const LEAD: Record<number, string> = {
  0: "El primer paso es conocer y entender.",
  1: "Experimenta, encuentra tus productos ganadores y comprueba que los ingresos son reales.",
  2: "Replica lo que funciona y convierte tus ventas en una operación sostenible.",
  3: "Cero miedo, cero improvisación: tu tienda ya es un motor de ventas predecible.",
  4: "Dominas el mercado, generas tu propia demanda y transformas Dropi en tu gran empresa.",
  5: "La cima del e-commerce: inspiras al mercado y lideras la industria.",
};

const HERO_IMG: Record<number, string> = {
  0: "/leyendas/heroes/bienvenido.png",
  1: "/leyendas/heroes/explorador.png",
  2: "/leyendas/heroes/master.png",
  3: "/leyendas/heroes/experto.png",
  4: "/leyendas/heroes/sabio-vip.png",
  5: "/leyendas/heroes/leyenda.png",
};

export default function TierExplorer() {
  const [tierIdx, setTierIdx] = useState(1);
  const [subIdx, setSubIdx] = useState(0);
  const tier = TIERS[tierIdx];
  const sub = tier.subLevels[Math.min(subIdx, tier.subLevels.length - 1)];
  const displayBadge = sub.badgeUrl ?? HERO_IMG[tierIdx];

  function selectTier(i: number) {
    setTierIdx(i);
    setSubIdx(0);
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ border: "1px solid rgba(234,234,234,0.12)", background: "linear-gradient(180deg,#141414 0%,#0c0c0c 100%)" }}
    >
      <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2 md:items-center">
        {/* Badge display */}
        <div className="flex min-h-[240px] items-center justify-center">
          <img
            src={displayBadge}
            alt={tier.name}
            className="max-h-[320px] w-auto object-contain"
            style={{ filter: "drop-shadow(0 30px 60px rgba(255,72,0,0.5))" }}
          />
        </div>

        {/* Detail */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#FF8500" }}>
              {tier.eyebrow}
            </span>
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg,#FF8500,rgba(255,133,0,0))" }} />
          </div>
          <h3 className="text-[clamp(32px,4.5vw,54px)] font-bold uppercase leading-[0.95] tracking-[-0.03em]">
            {tier.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold" style={{ color: "#FF8500" }}>
            {tier.maxOrders === null
              ? `${tier.minOrders.toLocaleString("es-CO")}+ órdenes/mes`
              : `${tier.minOrders.toLocaleString("es-CO")}–${tier.maxOrders.toLocaleString("es-CO")} órdenes/mes`}
          </div>
          <p className="max-w-md text-[17px] font-bold leading-snug text-[#EAEAEA]">{LEAD[tierIdx]}</p>

          {/* Sub-level rail */}
          <div className="flex flex-wrap gap-2">
            {tier.subLevels.map((s, i) => (
              <button
                key={s.code}
                onClick={() => setSubIdx(i)}
                className="flex min-w-[100px] flex-col items-center gap-2 px-3 py-2.5 transition-all"
                style={{
                  background: "rgba(234,234,234,0.03)",
                  border: `1px solid ${subIdx === i ? "#FF8500" : "rgba(234,234,234,0.14)"}`,
                }}
              >
                {s.badgeUrl ? (
                  <img src={s.badgeUrl} alt={s.label} className="h-[44px] w-auto object-contain" />
                ) : (
                  <span
                    className="flex h-[44px] w-[44px] items-center justify-center font-mono text-[8px] uppercase tracking-[0.1em]"
                    style={{ border: "1px dashed rgba(255,72,0,0.55)", color: "#FF4800" }}
                  >
                    Falta
                  </span>
                )}
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#EAEAEA]">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tier rail */}
      <div
        className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-6"
        style={{ borderTop: "1px solid rgba(234,234,234,0.1)", background: "rgba(9,9,9,0.6)" }}
      >
        {TIERS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => selectTier(i)}
            className="flex flex-col items-center gap-2 py-2 transition-opacity"
            style={{ opacity: tierIdx === i ? 1 : 0.45 }}
          >
            <img src={HERO_IMG[i]} alt={t.name} className="h-[44px] w-auto object-contain" style={{ objectFit: "contain" }} />
            <span className="text-center text-[10px] font-bold uppercase tracking-[0.1em]">{t.name}</span>
            <span className="block h-[2px] w-full" style={{ background: tierIdx === i ? "#FF8500" : "transparent" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
