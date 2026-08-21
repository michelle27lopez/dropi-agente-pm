"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { TIERS } from "../mock/tiers";
import type { Tier, UserLevelSummary } from "../types";

type View = "closed" | "form" | "otp" | "wrapped" | "session";

const TIER_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  0: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  1: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  2: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  3: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  4: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  5: { bg: "bg-orange-50", text: "text-[#FF6102]", border: "border-orange-200" },
  6: { bg: "bg-[#FF6102]", text: "text-white", border: "border-orange-400" },
};

function subLevelFor(tier: Tier, orders: number) {
  return (
    tier.subLevels.find(
      (s) => orders >= s.minOrders && (s.maxOrders === null || orders <= s.maxOrders)
    ) ?? tier.subLevels[tier.subLevels.length - 1]
  );
}

function levelPct(tier: Tier, orders: number) {
  if (tier.maxOrders === null) return 100;
  const range = tier.maxOrders - tier.minOrders + 1;
  return Math.min(100, Math.round(((orders - tier.minOrders + 1) / range) * 100));
}

function BadgePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 p-1">
      <span className="text-center text-[8px] font-bold uppercase leading-tight text-red-400">
        🎨 {label}
        <br />
        pendiente
      </span>
    </div>
  );
}

export default function NivelExperience({ variant = "pill" }: { variant?: "pill" | "nav" }) {
  const [view, setView] = useState<View>("closed");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [user, setUser] = useState<UserLevelSummary | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const tier = useMemo(
    () => TIERS[user?.currentTierId ?? 0],
    [user]
  );
  const tierColors = TIER_COLORS[user?.currentTierId ?? 0];

  async function requestOtp(e?: React.FormEvent) {
    e?.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/nivel/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Error generando el código");
      await res.json();
    } catch {
      setError("No pudimos enviar el código. Intenta de nuevo.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setOtp(["", "", "", "", "", ""]);
    setResendIn(30);
    setView("otp");
    setTimeout(() => inputsRef.current[0]?.focus(), 200);
  }

  function handleOtpChange(i: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    const next = [...otp];
    let focus = i;
    if (digits.length > 1) {
      for (let k = 0; k + i < 6; k++) next[i + k] = digits[k] ?? "";
      focus = Math.min(5, i + digits.length - 1);
    } else {
      next[i] = digits;
      if (digits && i < 5) focus = i + 1;
    }
    setOtp(next);
    inputsRef.current[focus]?.focus();
    if (next.join("").length === 6) verify(next.join(""));
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  async function verify(code: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/nivel/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Código incorrecto. Revísalo e intenta de nuevo.");
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        setLoading(false);
        return;
      }
      const data: UserLevelSummary = await res.json();
      setUser(data);
      setError("");
      setLoading(false);
      setView("wrapped");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  function open() {
    if (user) setView("session");
    else setView("form");
  }

  function close() {
    setView("closed");
  }

  if (view === "closed") {
    const label = user ? `Mi nivel: ${TIERS[user.currentTierId].name}` : "Consultar mi nivel";
    if (variant === "nav") {
      return (
        <button
          id="btn-consultar-nivel"
          onClick={open}
          className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-[#0b0b0b] transition-all hover:!bg-[#FF4800] hover:-translate-y-[3px] hover:tracking-[0.16em] hover:shadow-[0_14px_34px_-14px_rgba(255,133,0,0.9)] active:translate-y-0 active:scale-[0.97]"
          style={{
            background: "#FF8500",
            padding: "11px 20px",
            clipPath:
              "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
            transition: "background .3s ease, transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s ease, letter-spacing .3s ease",
          }}
        >
          {user ? "Mi nivel" : "Consulta tu nivel"}
        </button>
      );
    }
    return (
      <button
        id="btn-consultar-nivel"
        onClick={open}
        className="group relative overflow-hidden rounded-xl bg-[#FF6102] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:bg-[#e55600] hover:shadow-lg active:scale-95"
      >
        <span className="relative z-10">{label}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* Header color bar */}
        <div className={`h-1.5 w-full ${tierColors?.bg ?? "bg-[#FF6102]"}`} />

        <div className="p-6">
          {/* Close button */}
          <button
            onClick={close}
            id="btn-cerrar-nivel"
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.7 3.3a1 1 0 0 0-1.4 0L8 6.6 4.7 3.3a1 1 0 0 0-1.4 1.4L6.6 8 3.3 11.3a1 1 0 1 0 1.4 1.4L8 9.4l3.3 3.3a1 1 0 0 0 1.4-1.4L9.4 8l3.3-3.3a1 1 0 0 0 0-1.4z" />
            </svg>
          </button>

          {/* ── FORM ── */}
          {view === "form" && (
            <form onSubmit={requestOtp} className="flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF6102]">
                  Leyendas Dropi
                </span>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">Consulta tu nivel</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ingresa tu correo y te enviamos un código de verificación.
                </p>
              </div>
              <div>
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="tucorreo@dropi.co"
                  autoFocus
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF6102] focus:outline-none focus:ring-2 focus:ring-[#FF6102]/10 transition-all"
                />
                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
              </div>
              <button
                id="btn-enviar-otp"
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#FF6102] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#e55600] disabled:opacity-60 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando código…
                  </span>
                ) : (
                  "Consultar mi nivel"
                )}
              </button>
            </form>
          )}

          {/* ── OTP ── */}
          {view === "otp" && (
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF6102]">
                  Verificación
                </span>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">Revisa tu correo</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enviamos un código de 6 dígitos a{" "}
                  <span className="font-semibold text-gray-700">{email}</span>.
                </p>
              </div>
              <div className="flex gap-2">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={6}
                    disabled={loading}
                    className="h-14 flex-1 rounded-xl border border-gray-200 text-center text-xl font-bold text-gray-900 focus:border-[#FF6102] focus:outline-none focus:ring-2 focus:ring-[#FF6102]/10 disabled:bg-gray-50 disabled:text-gray-400 transition-all"
                  />
                ))}
              </div>
              {loading && (
                <div className="flex items-center justify-center gap-2 py-1 text-sm text-gray-400">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando…
                </div>
              )}
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  id="btn-reenviar-otp"
                  disabled={resendIn > 0 || loading}
                  onClick={() => requestOtp()}
                  className="text-xs font-semibold text-[#FF6102] disabled:text-gray-400 transition-colors hover:underline"
                >
                  {resendIn > 0 ? `Reenviar en ${resendIn}s` : "Reenviar código"}
                </button>
                <button
                  onClick={() => setView("form")}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cambiar correo
                </button>
              </div>
            </div>
          )}

          {/* ── WRAPPED ── */}
          {view === "wrapped" && user && (
            <WrappedReveal
              user={user}
              tier={tier}
              tierColors={tierColors}
              onContinue={() => setView("session")}
            />
          )}

          {/* ── SESSION ── */}
          {view === "session" && user && (
            <SessionSummary
              user={user}
              tier={tier}
              tierColors={tierColors}
              onReplay={() => setView("wrapped")}
              onClose={close}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function WrappedReveal({
  user,
  tier,
  tierColors,
  onContinue,
}: {
  user: UserLevelSummary;
  tier: Tier;
  tierColors: { bg: string; text: string; border: string };
  onContinue: () => void;
}) {
  const sub = subLevelFor(tier, user.ordersThisMonth);

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6102]">
          Tu nivel este mes es
        </span>
        <h2
          className="text-5xl font-extrabold uppercase tracking-tight"
          style={{ color: tier.id === 6 ? "#FF6102" : "#111827" }}
        >
          {tier.name}
        </h2>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${tierColors.bg} ${tierColors.text}`}>
          {tier.eyebrow} · {sub.label}
        </span>
      </div>

      {/* Badge grande */}
      <div className="flex h-28 w-28 items-center justify-center">
        {sub.badgeUrl ? (
          <img src={sub.badgeUrl} alt={tier.name} className="h-full w-full object-contain drop-shadow-md" />
        ) : (
          <BadgePlaceholder label="Medalla" />
        )}
      </div>

      <div className="w-full rounded-xl border border-gray-100 bg-gray-50 py-4">
        <div className="text-3xl font-extrabold text-gray-900">
          {user.ordersThisMonth.toLocaleString("es-CO")}
        </div>
        <div className="text-xs font-medium text-gray-400">órdenes entregadas este mes</div>
        {user.growthPct > 0 && (
          <div className="mt-1 text-xs font-semibold text-emerald-500">
            ↑ {user.growthPct}% vs. mes anterior
          </div>
        )}
      </div>

      <button
        id="btn-ver-resumen"
        onClick={onContinue}
        className="w-full rounded-xl bg-[#FF6102] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#e55600] active:scale-95"
      >
        Ver mi resumen completo
      </button>
    </div>
  );
}

function SessionSummary({
  user,
  tier,
  tierColors,
  onReplay,
  onClose,
}: {
  user: UserLevelSummary;
  tier: Tier;
  tierColors: { bg: string; text: string; border: string };
  onReplay: () => void;
  onClose: () => void;
}) {
  const sub = subLevelFor(tier, user.ordersThisMonth);
  const pct = levelPct(tier, user.ordersThisMonth);

  return (
    <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
      {/* User header */}
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-black ${tierColors.bg} ${tierColors.text}`}>
          {user.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold capitalize text-gray-900">{user.displayName}</h2>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${tierColors.bg} ${tierColors.text}`}>
            {tier.name} · {sub.label}
          </span>
        </div>
        {sub.badgeUrl ? (
          <img src={sub.badgeUrl} alt={tier.name} className="h-14 w-14 object-contain" />
        ) : (
          <div className="h-14 w-14 flex-shrink-0">
            <BadgePlaceholder label="Medalla" />
          </div>
        )}
      </div>

      {/* Progreso */}
      <div className="rounded-xl border border-gray-100 p-4">
        <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
          <span className="uppercase tracking-wider">Progreso del nivel</span>
          <span className="font-bold text-[#FF6102]">{pct}%</span>
        </div>
        <div className="flex gap-1">
          {tier.subLevels.map((s) => {
            const done = s.maxOrders !== null && user.ordersThisMonth > s.maxOrders;
            const active = s.code === sub.code;
            return (
              <div key={s.code} className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#FF6102] transition-all duration-700"
                  style={{
                    width: done ? "100%" : active ? `${pct}%` : "0%",
                    opacity: done ? 0.4 : 1,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>{tier.minOrders.toLocaleString()} órdenes</span>
          <span>{tier.maxOrders ? tier.maxOrders.toLocaleString() : "∞"} órdenes</span>
        </div>
      </div>

      {/* Histórico */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Últimos 3 meses
        </div>
        {user.months.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
            Aún no tenemos histórico de tus últimos meses.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {user.months.map((m) => {
              const mTier = TIERS[m.tierId];
              const mSub = mTier?.subLevels.find((s) => s.code === m.subLevelCode);
              const mColors = TIER_COLORS[m.tierId];
              return (
                <div key={m.isoDate} className="rounded-xl border border-gray-100 p-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    {m.monthLabel}
                  </div>
                  <div className="mx-auto my-2 h-10 w-10">
                    {mSub?.badgeUrl ? (
                      <img src={mSub.badgeUrl} className="h-full w-full object-contain" alt="" />
                    ) : (
                      <BadgePlaceholder label="" />
                    )}
                  </div>
                  <div className={`text-xs font-bold ${mColors?.text ?? "text-gray-700"}`}>
                    {mTier?.name}
                  </div>
                  <div className="mt-0.5 text-[10px] text-gray-400">
                    {m.ordersDelivered.toLocaleString("es-CO")} ords.
                  </div>
                  {m.leveledUp && (
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                      ↑ Subió
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Puntos */}
      <div id="points-teaser" className="rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Puntos y canje
          </span>
          <span className="rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-[10px] font-bold uppercase text-gray-400">
            Próximamente
          </span>
        </div>
        <div className="mt-2 text-3xl font-bold text-gray-200">
          {user.points.toLocaleString("es-CO")}
        </div>
        <div className="mt-1 text-xs text-gray-400">puntos acumulados</div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2">
        <button
          id="btn-replay-wrapped"
          onClick={onReplay}
          className="w-full rounded-xl bg-[#FF6102] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#e55600] active:scale-95"
        >
          Ver mi Wrapped
        </button>
        <button
          id="btn-cerrar-sesion"
          onClick={onClose}
          className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-95"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
