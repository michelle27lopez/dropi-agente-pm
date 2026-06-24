"use client";

import { useRouter } from "next/navigation";

const PRIMERA_CAMPANA = {
  nombre: "Cyber Days / Cyber Semana",
  fecha: "Finales de julio o inicio de agosto 2026",
  criterios: [
    "Proveedores verificados o premium",
    "Stock mayor a 500 unidades",
    "Sin movimiento en las últimas 2 semanas",
    "El descuento lo asume el proveedor",
  ],
  operacion: [
    "100% manual — experimento",
    "Se usa el mismo producto existente (no se crean productos nuevos)",
    "Asociar productos a una categoría temporal de campaña",
    "Marco visual en imagen del producto (diseñado por Marketing)",
    "Proveedor sube imagen en página de Dropi y descarga con el marco aplicado",
  ],
  pendiente: [
    "Data de productos que cumplen criterios",
    "Términos y condiciones de la campaña",
    "Comunicación con proveedores y dropshippers",
    "Imágenes, marcos y piezas con Marketing",
    "Cómo se mide la campaña",
    "Reunión siguiente: semana del 30-jun con avances",
  ],
};

const CALENDARIO = [
  { mes: "Agosto 2026", campana: "Cyber Days / Cyber Semana", nota: "Primera campaña ← activa", primera: true },
  { mes: "Septiembre 2026", campana: "Amor y Amistad · Semana del dropshipper", nota: "Pendiente confirmar. Posible evento físico en Bogotá (manejar con discreción)" },
  { mes: "Octubre 2026", campana: "Halloween · Precios de terror", nota: "" },
  { mes: "Noviembre 2026", campana: "Black Days · Black Friday", nota: "" },
  { mes: "Diciembre 2026", campana: "Extensión Black Friday", nota: "Hasta el 8–9 de dic. Diciembre es complejo para lanzar cosas nuevas" },
  { mes: "Enero 2027", campana: "Bienestar · Deporte · Fitness · Cuidado personal", nota: "" },
  { mes: "Febrero 2027", campana: "San Valentín", nota: "Tentativo" },
  { mes: "Marzo 2027", campana: "Día de la Mujer", nota: "Belleza · Moda · Bienestar" },
  { mes: "Abril 2027", campana: "Campaña mes crítico", nota: "Hogar + Semana Santa / Biblias" },
];

export default function ProximasCampanasPage() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg, #F7F7F7)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #E8E8E8",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={() => router.push("/proyectos/dinamicas-catalogo")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8A8A", fontSize: 13 }}
        >
          ← Dinámicas de Catálogo
        </button>
        <span style={{ color: "#E8E8E8" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Próximas campañas</span>
      </header>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
            Campañas definidas 2026–2027
          </h1>
          <p style={{ fontSize: 14, color: "#8A8A8A", lineHeight: 1.6 }}>
            Calendario tentativo acordado el 24 de junio de 2026. Regla: no más de una campaña por mes para evitar saturación y que Dropi siempre parezca en descuento.
          </p>
        </div>

        {/* Primera campaña — destacada */}
        <div style={{
          background: "#fff", border: "2px solid #F77F00",
          borderRadius: 14, padding: "24px", marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{
              background: "#F77F00", color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            }}>
              Primera campaña
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>
              {PRIMERA_CAMPANA.nombre}
            </span>
          </div>

          <div style={{ fontSize: 13, color: "#8A8A8A", marginBottom: 20 }}>
            📅 {PRIMERA_CAMPANA.fecha}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Criterios de productos
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {PRIMERA_CAMPANA.criterios.map((c, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#1A1A1A" }}>
                    <span style={{ color: "#F77F00", flexShrink: 0 }}>✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Operación (manual)
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {PRIMERA_CAMPANA.operacion.map((c, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#1A1A1A" }}>
                    <span style={{ color: "#8A8A8A", flexShrink: 0 }}>→</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: 20, background: "#FFF8F0", border: "1px solid rgba(247,127,0,0.2)",
            borderRadius: 10, padding: "12px 16px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              Pendiente para próxima reunión (sem. 30-jun)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PRIMERA_CAMPANA.pendiente.map((p, i) => (
                <span key={i} style={{
                  fontSize: 12, background: "#fff", border: "1px solid #E8E8E8",
                  borderRadius: 20, padding: "3px 10px", color: "#1A1A1A",
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>
          Calendario completo
        </div>

        <div style={{ background: "#fff", border: "1px solid #E8E8E8", borderRadius: 14, overflow: "hidden" }}>
          {CALENDARIO.map((c, i) => (
            <div
              key={i}
              style={{
                display: "grid", gridTemplateColumns: "140px 1fr",
                borderBottom: i < CALENDARIO.length - 1 ? "1px solid #F3F4F6" : "none",
                background: c.primera ? "#FFF8F0" : "#fff",
              }}
            >
              <div style={{
                padding: "14px 16px",
                borderRight: "1px solid #F3F4F6",
                fontSize: 12, fontWeight: 700,
                color: c.primera ? "#F77F00" : "#8A8A8A",
                display: "flex", alignItems: "flex-start",
              }}>
                {c.mes}
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: c.nota ? 3 : 0 }}>
                  {c.campana}
                  {c.primera && (
                    <span style={{
                      marginLeft: 8, fontSize: 10, fontWeight: 700,
                      background: "#F77F00", color: "#fff",
                      padding: "1px 7px", borderRadius: 20,
                    }}>
                      activa
                    </span>
                  )}
                </div>
                {c.nota && (
                  <div style={{ fontSize: 12, color: "#8A8A8A" }}>{c.nota}</div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
