"use client";

import { useMemo, useState } from "react";

type SimOrder = {
  id: number;
  product: string;
  customer: string;
  city: string;
  fleteValue: number;
  huellaPct: number;
  huellaOrders: number;
  isRural: boolean;
  hasVariant: boolean;
  variantResolved: boolean;
  addressVerified: boolean;
};

const ORDERS: SimOrder[] = [
  { id: 160604, product: "Reloj Inteligente Tw8 Smartwatch", customer: "Olga Camacho", city: "Funza", fleteValue: 8000, huellaPct: 96, huellaOrders: 8, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160605, product: "Extractor de puntos negros", customer: "Carlos Mendoza", city: "Bogotá", fleteValue: 22000, huellaPct: 90, huellaOrders: 10, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160606, product: "Set de maquillaje 12 piezas", customer: "María Fernanda López", city: "Cali", fleteValue: 9000, huellaPct: 70, huellaOrders: 12, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160607, product: "Audífonos inalámbricos Pro", customer: "Andrea Gutiérrez", city: "Cartagena", fleteValue: 7000, huellaPct: 100, huellaOrders: 2, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160608, product: "Zapatillas deportivas", customer: "Juan Pablo Herrera", city: "Medellín", fleteValue: 10000, huellaPct: 94, huellaOrders: 15, isRural: false, hasVariant: true, variantResolved: false, addressVerified: true },
  { id: 160609, product: "Camiseta oversize", customer: "Laura Sánchez", city: "Bucaramanga", fleteValue: 6000, huellaPct: 98, huellaOrders: 9, isRural: false, hasVariant: true, variantResolved: true, addressVerified: true },
  { id: 160610, product: "Licuadora portátil", customer: "Diana Marcela Rojas", city: "Vereda El Roble", fleteValue: 8000, huellaPct: 92, huellaOrders: 7, isRural: true, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160611, product: "Cargador inalámbrico", customer: "Sebastián Ríos", city: "Pereira", fleteValue: 5000, huellaPct: 88, huellaOrders: 20, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160612, product: "Perfume árabe 100ml", customer: "Camila Duarte", city: "Barranquilla", fleteValue: 12000, huellaPct: 100, huellaOrders: 30, isRural: false, hasVariant: false, variantResolved: true, addressVerified: false },
  { id: 160613, product: "Termo Stanley 1L", customer: "Nicolás Peña", city: "Bogotá", fleteValue: 9500, huellaPct: 97, huellaOrders: 11, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160614, product: "Faja moldeadora", customer: "Valentina Mejía", city: "Ibagué", fleteValue: 14000, huellaPct: 91, huellaOrders: 6, isRural: false, hasVariant: true, variantResolved: true, addressVerified: true },
  { id: 160615, product: "Kit herramientas 40 pzs", customer: "Mateo Gómez", city: "Finca La Esperanza", fleteValue: 30000, huellaPct: 60, huellaOrders: 4, isRural: true, hasVariant: false, variantResolved: true, addressVerified: false },
  { id: 160616, product: "Labial mate x6", customer: "Isabela Torres", city: "Bogotá", fleteValue: 4000, huellaPct: 99, huellaOrders: 25, isRural: false, hasVariant: true, variantResolved: true, addressVerified: true },
  { id: 160617, product: "Reloj análogo clásico", customer: "Santiago Ruiz", city: "Manizales", fleteValue: 11000, huellaPct: 85, huellaOrders: 14, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160618, product: "Organizador de closet", customer: "Daniela Castro", city: "Neiva", fleteValue: 7500, huellaPct: 100, huellaOrders: 3, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
  { id: 160619, product: "Plancha de cabello", customer: "Felipe Moreno", city: "Cúcuta", fleteValue: 16000, huellaPct: 95, huellaOrders: 18, isRural: false, hasVariant: false, variantResolved: true, addressVerified: true },
];

function Switch({
  checked,
  onChange,
  disabled,
  size = "sm",
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "head";
  label?: string;
}) {
  return (
    <label className={`switch${size === "head" ? " switch--head" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track">
        <span className="switch-thumb" />
      </span>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
}

export default function AutoconfirmacionSim() {
  const [autoOn, setAutoOn] = useState(true);
  const [fleteOn, setFleteOn] = useState(true);
  const [fleteCap, setFleteCap] = useState(15000);
  const [huellaOn, setHuellaOn] = useState(true);
  const [huellaCut, setHuellaCut] = useState(90);
  const [huellaMinOrders, setHuellaMinOrders] = useState(3);
  const [autoVariantes, setAutoVariantes] = useState(false);
  const [direccionOn, setDireccionOn] = useState(true);
  const ruralGuard = true; // fijo — guardarraíl del Cell Board

  const results = useMemo(() => {
    const evaluate = (o: SimOrder): { order: SimOrder; verdict: "auto" | "manual"; reason: string } => {
      if (!autoOn) return { order: o, verdict: "manual", reason: "Autoconfirmación apagada" };
      if (ruralGuard && o.isRural) return { order: o, verdict: "manual", reason: "Zona rural (guardarraíl)" };
      if (fleteOn && o.fleteValue > fleteCap)
        return { order: o, verdict: "manual", reason: `Flete > $${fleteCap.toLocaleString("es-CO")}` };
      if (direccionOn && !o.addressVerified) return { order: o, verdict: "manual", reason: "Dirección sin verificar" };
      if (!autoVariantes && o.hasVariant && !o.variantResolved)
        return { order: o, verdict: "manual", reason: "Variante sin resolver" };
      if (huellaOn) {
        if (o.huellaOrders < huellaMinOrders)
          return { order: o, verdict: "manual", reason: `Muestra insuficiente (${o.huellaOrders} < ${huellaMinOrders})` };
        if (o.huellaPct < huellaCut)
          return { order: o, verdict: "manual", reason: `Huella ${o.huellaPct}% < ${huellaCut}%` };
      }
      return { order: o, verdict: "auto", reason: "Pasa todas las reglas" };
    };
    return ORDERS.map(evaluate).sort((a, b) =>
      a.verdict === b.verdict ? 0 : a.verdict === "auto" ? -1 : 1
    );
  }, [autoOn, fleteOn, fleteCap, huellaOn, huellaCut, huellaMinOrders, autoVariantes, direccionOn]);

  const autoCount = results.filter((r) => r.verdict === "auto").length;
  const manualCount = ORDERS.length - autoCount;
  const autoPct = Math.round((autoCount / ORDERS.length) * 100);

  return (
    <div className="sim-wrap">
      <section className="sim-col">
        <div className="sim-head-toggle">
          <h2 style={{ margin: 0 }}>Reglas que configuras</h2>
          <Switch checked={autoOn} onChange={setAutoOn} size="head" label={autoOn ? "Activa" : "Apagada"} />
        </div>

        <article className="rule">
          <div className="rule-head">
            <Switch checked={fleteOn} onChange={setFleteOn} disabled={!autoOn} />
            <div className="rule-text">
              <span className="rule-name">Tope de flete</span>
              <span className="rule-desc">Pedidos con flete por encima del tope van a manual.</span>
            </div>
          </div>
          {fleteOn && autoOn && (
            <div className="rule-control">
              <span className="ctrl-prefix">$</span>
              <input
                type="number"
                step={1000}
                min={0}
                value={fleteCap}
                onChange={(e) => setFleteCap(Number(e.target.value))}
              />
            </div>
          )}
        </article>

        <article className="rule">
          <div className="rule-head">
            <Switch checked={huellaOn} onChange={setHuellaOn} disabled={!autoOn} />
            <div className="rule-text">
              <span className="rule-name">Huella del comprador</span>
              <span className="rule-desc">% de entrega histórico del comprador, con muestra mínima confiable.</span>
            </div>
          </div>
          {huellaOn && autoOn && (
            <div className="rule-control rule-control--stack">
              <div className="ctrl-row">
                <label>Corte de entrega</label>
                <div className="ctrl-inline">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={1}
                    value={huellaCut}
                    onChange={(e) => setHuellaCut(Number(e.target.value))}
                  />
                  <span className="ctrl-val">≥ {huellaCut}%</span>
                </div>
              </div>
              <div className="ctrl-row">
                <label>Válida desde</label>
                <div className="ctrl-inline">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    step={1}
                    value={huellaMinOrders}
                    onChange={(e) => setHuellaMinOrders(Number(e.target.value))}
                  />
                  <span className="ctrl-val">órdenes entregadas</span>
                </div>
              </div>
              <p className="ctrl-hint">
                Menos de {huellaMinOrders} entregas = muestra no confiable → manual.
              </p>
            </div>
          )}
        </article>

        <article className="rule">
          <div className="rule-head">
            <Switch checked={autoVariantes} onChange={setAutoVariantes} disabled={!autoOn} />
            <div className="rule-text">
              <span className="rule-name">Autoconfirmar variantes sin resolver</span>
              <span className="rule-desc">Si está apagado, un producto con talla/color sin definir va a manual.</span>
            </div>
          </div>
        </article>

        <article className="rule">
          <div className="rule-head">
            <Switch checked={direccionOn} onChange={setDireccionOn} disabled={!autoOn} />
            <div className="rule-text">
              <span className="rule-name">Solo con dirección verificada</span>
              <span className="rule-desc">Direcciones sin verificar van a manual.</span>
            </div>
          </div>
        </article>

        <article className="rule rule--locked">
          <div className="rule-head">
            <span className="rule-lock">🔒</span>
            <div className="rule-text">
              <span className="rule-name">No autoconfirmar en zona rural</span>
              <span className="rule-desc">Guardarraíl fijo del Cell Board (veredas/fincas, alta devolución).</span>
            </div>
            <span className="rule-badge">Fijo</span>
          </div>
        </article>
      </section>

      <section className="sim-col">
        <h2>Resultado sobre tus {ORDERS.length} órdenes</h2>

        <div className="sim-summary">
          <div className="sim-big">
            <b>{autoCount}</b>
            <span>de {ORDERS.length}</span>
          </div>
          <p className="sim-summary-txt">
            se autoconfirmarían · <b>{manualCount}</b> quedan manuales
          </p>
          <div className="sim-bar">
            <span className="sim-bar-fill" style={{ width: `${autoPct}%` }} />
          </div>
        </div>

        <ul className="verdicts">
          {results.map((r) => (
            <li className="verdict" key={r.order.id}>
              <span className={`verdict-badge verdict-badge--${r.verdict}`}>
                {r.verdict === "auto" ? "✓ Auto" : "⏱ Manual"}
              </span>
              <div className="verdict-body">
                <span className="verdict-product">{r.order.product}</span>
                <span className="verdict-meta">
                  {r.order.customer} · {r.order.city} · ${r.order.fleteValue.toLocaleString("es-CO")} flete ·{" "}
                  {r.order.huellaPct}% ({r.order.huellaOrders} órd)
                </span>
              </div>
              <span className="verdict-reason">{r.reason}</span>
            </li>
          ))}
        </ul>

        <p className="sim-note">
          ℹ️ Simulación sobre data de ejemplo. El experimento real corre estas reglas sobre
          órdenes reales y mide tiempo de confirmación, % de entrega y devolución.
        </p>
      </section>
    </div>
  );
}
