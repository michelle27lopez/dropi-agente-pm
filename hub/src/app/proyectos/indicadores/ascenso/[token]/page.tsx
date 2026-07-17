"use client";

import { use, useEffect, useState } from "react";

const ACCENT = "#6366F1";
const ACCENT_BG = "#EEF2FF";

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
  padding: 28, boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
};

const BENEFICIOS: Record<string, string[]> = {
  Verificado: [
    "Aprobación automática de productos",
    "Acceso a Caza Productos",
    "Banner destacado en catálogo",
  ],
  Premium: [
    "Visita comercial personalizada",
    "Presencia en lives de Dropi",
    "Relacionamiento con comunidades",
  ],
};

const MOTIVOS_RECHAZO = [
  "No quiero comprometerme con tiempos de despacho/garantía menores",
  "No tengo capacidad operativa para sostener el volumen",
  "No conocía los beneficios, necesito más información antes de decidir",
  "No es el momento adecuado para mi negocio",
  "Prefiero mantenerme en mi nivel actual",
  "Otro",
];

type Oferta = {
  token: string;
  supplier_name: string;
  nivel_actual: string;
  nivel_objetivo: string;
  ordenes_movilizadas_90d: number | null;
  umbral_objetivo: number;
  estado: "enviada" | "aceptada" | "rechazada";
  motivo_rechazo: string | null;
};

export default function AscensoOfertaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showRechazo, setShowRechazo] = useState(false);
  const [motivo, setMotivo] = useState(MOTIVOS_RECHAZO[0]);
  const [motivoOtro, setMotivoOtro] = useState("");

  useEffect(() => {
    fetch(`/api/proyectos/ascenso-ofertas/${token}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setOferta)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function responder(accepted: boolean) {
    setSubmitting(true);
    const motivoFinal = motivo === "Otro" ? motivoOtro : motivo;
    try {
      const res = await fetch(`/api/proyectos/ascenso-ofertas/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted, motivo: accepted ? undefined : motivoFinal }),
      });
      const data = await res.json();
      if (res.ok) setOferta(data.oferta);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <Wrapper><div style={{ ...card, textAlign: "center", color: "#888" }}>Cargando tu oferta…</div></Wrapper>;
  }
  if (error || !oferta) {
    return <Wrapper><div style={{ ...card, textAlign: "center", color: "#EF4444" }}>No encontramos esta oferta. El link puede haber expirado.</div></Wrapper>;
  }

  const beneficios = BENEFICIOS[oferta.nivel_objetivo] ?? [];

  if (oferta.estado === "aceptada") {
    return (
      <Wrapper>
        <div style={{ ...card, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 8 }}>¡Listo, {oferta.supplier_name}!</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>
            Confirmaste tu ascenso a <strong style={{ color: "#10B981" }}>{oferta.nivel_objetivo}</strong>. Nuestro equipo ya está actualizando tu cuenta — vas a ver los nuevos beneficios reflejados muy pronto.
          </div>
        </div>
      </Wrapper>
    );
  }

  if (oferta.estado === "rechazada") {
    return (
      <Wrapper>
        <div style={{ ...card, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👍</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 8 }}>Gracias por tu respuesta</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>
            Quedas en <strong>{oferta.nivel_actual}</strong> por ahora. Cuando quieras avanzar, la oferta va a seguir disponible en tu tablero de desempeño.
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div style={card}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: ACCENT_BG, color: ACCENT, borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 700, marginBottom: 16 }}>
          🎯 ASCENSO DETECTADO
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 8 }}>
          Hola {oferta.supplier_name}
        </div>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>
          Nuestro sistema detectó que cumples con lo básico para ascender de <strong>{oferta.nivel_actual}</strong> a <strong style={{ color: ACCENT }}>{oferta.nivel_objetivo}</strong> y obtener nuevos beneficios.
        </div>

        {oferta.ordenes_movilizadas_90d != null && (
          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#333" }}>
            <strong>{oferta.ordenes_movilizadas_90d.toLocaleString("es-CO")}</strong> órdenes movilizadas en los últimos 90 días · umbral: {oferta.umbral_objetivo.toLocaleString("es-CO")}
          </div>
        )}

        <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Beneficios de {oferta.nivel_objetivo}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {beneficios.map(b => (
            <div key={b} style={{ display: "flex", gap: 8, fontSize: 14, color: "#111" }}>
              <span style={{ color: "#10B981" }}>✓</span>{b}
            </div>
          ))}
        </div>

        {!showRechazo ? (
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => responder(true)}
              disabled={submitting}
              style={{ flex: 1, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
            >
              ✓ Aceptar ascenso
            </button>
            <button
              onClick={() => setShowRechazo(true)}
              disabled={submitting}
              style={{ flex: 1, background: "#F3F4F6", color: "#555", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              No, gracias
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 8 }}>¿Cuál es el motivo?</div>
            <select
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, marginBottom: 10 }}
            >
              {MOTIVOS_RECHAZO.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {motivo === "Otro" && (
              <textarea
                value={motivoOtro}
                onChange={e => setMotivoOtro(e.target.value)}
                placeholder="Cuéntanos brevemente…"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, marginBottom: 10, minHeight: 60 }}
              />
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => responder(false)}
                disabled={submitting || (motivo === "Otro" && !motivoOtro.trim())}
                style={{ flex: 1, background: "#EF4444", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Confirmar rechazo
              </button>
              <button
                onClick={() => setShowRechazo(false)}
                style={{ flex: 1, background: "#F3F4F6", color: "#555", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>{children}</div>
    </main>
  );
}
