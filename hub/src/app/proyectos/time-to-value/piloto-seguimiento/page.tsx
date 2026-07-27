"use client";

import { useCallback, useEffect, useState } from "react";

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4, marginBottom: 16,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13, verticalAlign: "top",
};

// ─── Etapas de seguimiento ──────────────────────────────────────────────────────
const ETAPAS: Record<string, { label: string; color: string; bg: string }> = {
  activado: { label: "Activado (automático)", color: "#3B82F6", bg: "#EFF6FF" },
  contactado: { label: "Contactado", color: "#8B5CF6", bg: "#F5F3FF" },
  bodega: { label: "Bodega creada", color: "#F59E0B", bg: "#FFFBEB" },
  producto: { label: "Producto publicado", color: "#F59E0B", bg: "#FFFBEB" },
  venta: { label: "Primera venta 🎉", color: "#10B981", bg: "#ECFDF5" },
  sin_respuesta: { label: "Sin respuesta", color: "#9CA3AF", bg: "#F3F4F6" },
};

const META_PILOTO = 10;

type PilotoRow = {
  id: string;
  email: string;
  nombre: string | null;
  telefono: string | null;
  etapa: string;
  notas: string | null;
};

// ─── Plantillas de conversación — copiar y pegar ───────────────────────────────
const PLANTILLAS = [
  {
    grupo: "1. Primer contacto y activación",
    items: [
      { titulo: "Mensaje de activación", texto: "¡Hola [nombre]! 👋 Soy [tu nombre], de Dropi. Tengo buenas noticias: ya tienes acceso para publicar tus productos y empezar a vender — no necesitas esperar más. Nuestro equipo está terminando de revisar tu perfil en paralelo, así que ya puedes ir publicando. Te voy a acompañar personalmente hasta que logres tu primera venta. ¿Tienes 5 minutos para contarme de tu negocio?" },
    ],
  },
  {
    grupo: "2. Discovery — entender el negocio",
    items: [
      { titulo: "Qué vende", texto: "Cuéntame, ¿a qué se dedica tu negocio? Qué vendes, qué servicios ofreces, quiénes son tus clientes hoy — entre más detalle, mejor te puedo ayudar." },
      { titulo: "Catálogo", texto: "¿Cuántos productos tienes listos para publicar hoy mismo? Y cuéntame, ¿ya tienes fotos, o necesitas una mano con eso?" },
      { titulo: "Despacho", texto: "Cuando te llega un pedido, ¿cómo lo despachas hoy — tú mismo, con una transportadora, o prefieres que Dropi te ayude con eso?" },
      { titulo: "Canales de venta", texto: "¿Hoy ya vendes por algún lado — redes propias, tienda en línea, otros dropshippers — o Dropi sería tu primer canal de venta?" },
    ],
  },
  {
    grupo: "3. Ayuda práctica",
    items: [
      { titulo: "Ayuda con bodega", texto: "Vamos a dejar tu bodega lista — te tomo 5 minutos ayudándote paso a paso. ¿Tienes un momento ahora o prefieres que te mande el link para hacerlo tú y yo te acompaño por acá si te trabas?" },
      { titulo: "Ayuda con publicar producto", texto: "Perfecto, ahora publiquemos tu primer producto. Mándame una foto, el nombre, y qué precio quieres ponerle — yo te ayudo a dejarlo bien armado." },
      { titulo: "Feedback de foto/descripción", texto: "Esta foto está un poco [oscura/borrosa/falta ángulo] — ¿tienes otra? Con buena luz y fondo limpio se vende muchísimo mejor. Te muestro un ejemplo si quieres." },
    ],
  },
  {
    grupo: "4. Seguimiento si no avanza",
    items: [
      { titulo: "No respondió (24-48h)", texto: "Hola [nombre] 👋 ¿Alcanzaste a ver mi mensaje? Sigo por acá para ayudarte a dejar tu primer producto publicado, no toma más de 10 minutos." },
      { titulo: "Se quedó a medias en bodega (2-3 días)", texto: "¿Seguimos con tu bodega? Es rapidísimo y de ahí ya puedes empezar a publicar. Te ayudo ahora mismo si quieres." },
      { titulo: "Publicó pero no ha vendido (7+ días)", texto: "¿Cómo va tu primer producto? ¿Necesitas que revisemos el precio, la descripción, o las fotos? A veces un ajuste pequeño hace la diferencia." },
      { titulo: "Reactivación (silencio largo)", texto: "Hola [nombre], no quiero dejar de acompañarte — ¿sigues interesado en activar tu venta en Dropi? Cualquier duda o si algo no te dejó avanzar, cuéntame y lo resolvemos juntos." },
    ],
  },
  {
    grupo: "5. Celebración y cierre",
    items: [
      { titulo: "Primera venta 🎉", texto: "¡[nombre], felicidades por tu primera venta en Dropi! 🎉 Este es solo el comienzo — sigo acá si necesitas algo para la siguiente." },
      { titulo: "Cierre de acompañamiento", texto: "Ya quedaste andando con tu primera venta — increíble. De aquí en adelante cualquier duda me escribes, y seguimos viendo cómo escalar tu catálogo." },
    ],
  },
];

function mensajeActivacion(nombre: string | null) {
  const saludo = nombre ? `¡Hola ${nombre.split(" ")[0]}!` : "¡Hola!";
  return `${saludo} 👋 Soy de Dropi. Tengo buenas noticias: ya tienes acceso para publicar tus productos y empezar a vender — no necesitas esperar más. Nuestro equipo está terminando de revisar tu perfil en paralelo, así que ya puedes ir publicando. Te voy a acompañar personalmente hasta que logres tu primera venta. ¿Tienes 5 minutos para contarme de tu negocio?`;
}

function waLink(telefono: string | null, nombre: string | null) {
  const digits = (telefono || "").replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("57") ? digits : `57${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(mensajeActivacion(nombre))}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      style={{
        border: "none", cursor: "pointer", flexShrink: 0,
        fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 6,
        color: copied ? "#065F46" : "var(--dropi)",
        background: copied ? "#ECFDF5" : "var(--dropi-light)",
        transition: "all 0.15s",
      }}
    >
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
  );
}

function EtapaSelect({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const et = ETAPAS[value] || ETAPAS.activado;
  return (
    <select
      value={value}
      onChange={e => onSave(e.target.value)}
      style={{
        border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
        padding: "4px 8px", borderRadius: 999, color: et.color, background: et.bg,
        outline: "none", appearance: "none",
      }}
    >
      {Object.entries(ETAPAS).map(([key, e]) => (
        <option key={key} value={key}>{e.label}</option>
      ))}
    </select>
  );
}

function NotaCell({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => { setV(value); }, [value]);
  return (
    <textarea
      value={v}
      onChange={e => setV(e.target.value)}
      onBlur={() => { if (v !== value) onSave(v); }}
      placeholder="Escribe la nota mientras hablas con él/ella..."
      rows={2}
      style={{
        width: "100%", minWidth: 180, border: "1px dashed var(--border)", borderRadius: 6,
        padding: "6px 8px", fontSize: 12.5, background: "#FBFCFF", color: "var(--fg)",
        outline: "none", fontFamily: "inherit", resize: "vertical",
      }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--dropi)")}
      onBlurCapture={e => (e.currentTarget.style.borderColor = "var(--border)")}
    />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PilotoSeguimientoTtvPage() {
  const [rows, setRows] = useState<PilotoRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/ttv")
      .then(r => r.json())
      .then(d => { setRows(d.pilotoFase0 || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onUpdate = useCallback(async (id: string, updates: Record<string, unknown>) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    await fetch("/api/ttv", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "ttv_piloto_fase0", id, updates }),
    });
  }, []);

  const conVenta = rows.filter(s => s.etapa === "venta").length;
  const conProducto = rows.filter(s => s.etapa === "producto" || s.etapa === "venta").length;
  const conContacto = rows.filter(s => s.etapa !== "activado").length;

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/proyectos/time-to-value" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Time to Value
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Seguimiento del Piloto</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>TTV-001</span>
          <span style={tag("#8B5CF6", "#F5F3FF")}>🎯 Fase 0 — 300+ pedidos/mes</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {loading ? (
          <div style={{ ...card, textAlign: "center", color: "var(--muted)" }}>Cargando...</div>
        ) : rows.length === 0 ? (
          <div style={{ ...card, border: "1px solid #FDE68A", background: "#FFFBEB" }}>
            <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
              <strong>Sin datos todavía.</strong> Falta correr la migración <code>037_ttv_piloto_fase0.sql</code> en
              Supabase y sembrar los 10 proveedores del piloto — avísame cuando la migración esté aplicada y los cargo.
            </div>
          </div>
        ) : (
          <>
            {/* Resumen */}
            <div style={{
              ...card,
              background: "linear-gradient(135deg, var(--dropi) 0%, #FF8A2B 100%)",
              color: "#fff", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", width: 300, height: 300, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)", right: -120, top: -100, pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
                  Seguimiento en vivo · Fase 0
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 8 }}>
                  {rows.length} de {META_PILOTO} — acompañamiento uno a uno hasta la primera venta
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", maxWidth: 680, lineHeight: 1.55 }}>
                  Ya activados automáticamente. Jaime/Michelle los contactan directo con el botón de WhatsApp de
                  cada fila, y las notas se guardan al instante mientras van hablando.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 500, marginTop: 16 }}>
                  {[
                    { v: `${conContacto}/${rows.length}`, l: "Contactados" },
                    { v: `${conProducto}/${rows.length}`, l: "Con producto publicado" },
                    { v: `${conVenta}/${rows.length}`, l: "Primera venta" },
                  ].map(({ v, l }) => (
                    <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>{v}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Listado */}
            <div style={card}>
              <div style={sectionTitle}>Proveedores del piloto</div>
              <div style={sectionSub}>Etapa y notas se guardan al instante — colabora en vivo con quien más esté hablando con ellos.</div>
              <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Nombre</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Teléfono</th>
                      <th style={thStyle}>Etapa</th>
                      <th style={thStyle}>Notas</th>
                      <th style={{ ...thStyle, textAlign: "center" }}>WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((s, i) => {
                      const link = waLink(s.telefono, s.nombre);
                      return (
                        <tr key={s.id} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                          <td style={{ ...tdStyle, fontWeight: 600, color: "var(--fg)" }}>{s.nombre || "—"}</td>
                          <td style={{ ...tdStyle, color: "var(--muted)" }}>{s.email}</td>
                          <td style={{ ...tdStyle, color: "var(--muted)", whiteSpace: "nowrap" }}>{s.telefono || "—"}</td>
                          <td style={tdStyle}>
                            <EtapaSelect value={s.etapa} onSave={v => onUpdate(s.id, { etapa: v })} />
                          </td>
                          <td style={{ ...tdStyle, minWidth: 200 }}>
                            <NotaCell value={s.notas || ""} onSave={v => onUpdate(s.id, { notas: v })} />
                          </td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {link ? (
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                  background: "#25D366", color: "#fff", textDecoration: "none",
                                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                💬 Escribir
                              </a>
                            ) : (
                              <span style={{ fontSize: 11, color: "var(--muted)" }}>Sin teléfono</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leyenda de etapas */}
            <div style={{ ...card, background: "#F8FAFC" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Etapas de seguimiento
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.values(ETAPAS).map(et => (
                  <span key={et.label} style={tag(et.color, et.bg)}>{et.label}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Plantillas de conversación */}
        <div style={card}>
          <div style={sectionTitle}>Plantillas de conversación — copiar y pegar</div>
          <div style={sectionSub}>
            Reemplaza lo que está entre [corchetes] antes de enviar. Organizadas por momento de la conversación.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PLANTILLAS.map(g => (
              <div key={g.grupo}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--dropi)", marginBottom: 10 }}>
                  {g.grupo}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {g.items.map(item => (
                    <div key={item.titulo} style={{
                      background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10,
                      padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                          {item.titulo}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{item.texto}</div>
                      </div>
                      <CopyButton text={item.texto} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
