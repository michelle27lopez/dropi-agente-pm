"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sidebar } from "../Sidebar";

function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${accent ?? "var(--dropi)"}` }}>
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>{value}</div>
    </div>
  );
}

function Section({ label, title, desc, link, children }: { label: string; title: string; desc?: string; link?: { href: string; text: string }; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dropi)" }}>{label}</div>
        {link && (
          <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light, #FFF3E0)", border: "1px solid var(--dropi)", borderRadius: 20, padding: "3px 12px", textDecoration: "none", whiteSpace: "nowrap" }}>
            {link.text} ↗
          </a>
        )}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)", marginBottom: desc ? 6 : 16 }}>{title}</h2>
      {desc && <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7, marginBottom: 16, maxWidth: 640 }}>{desc}</p>}
      {children}
    </div>
  );
}

function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--dropi-light, #FFF3E0)", border: "1px solid var(--dropi)", borderRadius: 10, padding: "12px 16px", marginTop: 14, display: "flex", gap: 10 }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
      <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg)" }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid var(--border)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : undefined }}>
              {r.map((c, j) => (
                <td key={j} style={{ padding: "10px 16px", color: j === 0 ? "var(--fg)" : "var(--muted)", fontWeight: j === 0 ? 600 : 700 }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CATEGORIAS = [
  { categoria: "Bisutería", productos: 62 },
  { categoria: "Tecnología", productos: 19 },
  { categoria: "Moda", productos: 10 },
  { categoria: "Ropa Deportiva", productos: 8 },
  { categoria: "Belleza", productos: 7 },
  { categoria: "Cocina", productos: 5 },
  { categoria: "Otras (7)", productos: 12 },
];

const FUNNEL = [
  { paso: "Con link", proveedores: 78 },
  { paso: "Entraron", proveedores: 34 },
  { paso: "Postularon", proveedores: 11 },
  { paso: "Checklist ≥1", proveedores: 2 },
  { paso: "Checklist 5/5", proveedores: 1 },
];

const ENGAGEMENT = [
  { categoria: "Hogar", rate: 5.0 },
  { categoria: "Vaporizadores", rate: 3.5 },
  { categoria: "Cocina", rate: 2.8 },
  { categoria: "Deportes", rate: 2.33 },
  { categoria: "Moda", rate: 2.3 },
  { categoria: "Tecnología", rate: 1.95 },
  { categoria: "Ropa Deportiva", rate: 1.75 },
  { categoria: "Bisutería", rate: 1.21 },
  { categoria: "Belleza", rate: 1.0 },
];

const DROPI = "var(--dropi)";
const BLUE = "#0EA5E9";
const GREEN = "#10B981";

export default function HallazgosPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px" }}>
          <a href="/proyectos/dinamicas-catalogo" style={{ fontSize: 12.5, color: "var(--muted)", textDecoration: "none" }}>← Dashboard</a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0 6px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)" }}>Hallazgos Cyber Days</h1>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light, #FFF3E0)", border: "1px solid var(--dropi)", padding: "2px 8px", borderRadius: 20 }}>DCA-001</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 32, maxWidth: 680, lineHeight: 1.6 }}>
            Primera campaña de catálogo estancado (24 ago – 7 sep). Filtro de entrada: proveedores Verificados Premium/Exclusivo, stock &gt;500, sin órdenes en las 2 semanas previas. Cada proveedor filtrado recibió un link personalizado para seleccionar productos, descargar fotos con marco y armar su parte del catálogo en Canva; en Dropi debía además actualizar foto, categoría temporal, descuento y nombre.
          </p>

          <Section label="Catálogo publicado" title="Composición: 123 productos, 26 proveedores" desc="Concentración fuerte: GRAVIFLY solo aporta 48 productos (39% del catálogo); los siguientes 4 proveedores suman 34 más. Los otros 21 proveedores tienen 5 productos o menos." link={{ href: "https://cyberdays-catalogo.vercel.app/", text: "Abrir catálogo" }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={CATEGORIAS} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="categoria" width={100} tick={{ fontSize: 11.5, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v} productos`, ""]} />
                    <Bar dataKey="productos" fill={DROPI} radius={[0, 6, 6, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Insight>
              <strong>Buena idea de formato:</strong> a diferencia de los catálogos que ha armado comercial hasta ahora (~2 al mes, sin métricas nunca), este permite que el proveedor/dropshipper busque, filtre, dé clic y caiga directo en el producto real de Dropi, <strong>y todo ese recorrido se puede medir</strong> (vistas, clics, por categoría, por proveedor). Es la primera vez que un catálogo de campaña queda instrumentado de punta a punta.
            </Insight>
            <Insight>
              <strong>Problema de calidad de dato:</strong> varios productos aparecen con categoría inconsistente o mal asignada entre plataformas (mismo producto, categoría distinta según de dónde se lea). Esto le resta confianza a cualquier lectura por categoría, incluida la de este mismo resumen — antes de tomar decisiones sobre qué categoría "rinde más", vale la pena limpiar esa categorización de base.
            </Insight>
          </Section>

          <Section label="Lado oferta" title="Funnel del proveedor" desc="Fuente: Panel de campañas / Seguimiento. El proceso tenía 5 pasos de ejecución manual y casi nadie llegó al final.">
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={FUNNEL} margin={{ left: 0, right: 12, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="paso" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v} proveedores`, ""]} />
                    <Bar dataKey="proveedores" fill={BLUE} radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Insight>
              Solo 1 de 78 proveedores ejecutó el proceso completo tal como se diseñó. La caída más fuerte no es en entrar al link (44% sí entró), sino entre postular y ejecutar en Dropi (11 → 2 tocaron el checklist).
            </Insight>
          </Section>

          <Section label="Lado demanda" title="Catálogo público — en vivo (Pulso)" desc="El catálogo se publicó en el home el 27/8, así que la data de tráfico distribuido tiene apenas 1 día completo a la fecha de este corte." link={{ href: "https://beta-pulso.vercel.app/campanas/238f6948-af61-4309-a706-62c695f50328", text: "Abrir dashboard en Pulso" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              <StatCard label="Visitantes únicos" value="34" accent={BLUE} />
              <StatCard label="Total vistas" value="48" accent={BLUE} />
              <StatCard label="Total clics" value="205" accent={DROPI} />
              <StatCard label="Tasa de clic" value="35,3%" accent={GREEN} />
              <StatCard label="Productos con clic" value="89 / 123" accent="#8B5CF6" />
              <StatCard label="Proveedores con clic" value="16" accent="#06B6D4" />
            </div>
            <Insight>
              En su primer día completo en el home, el catálogo ya generó tráfico real: 1 de cada 3 visitantes que lo abrieron dio clic en al menos un producto. Es la primera vez que se puede afirmar algo así de un catálogo de campaña.
            </Insight>
          </Section>

          <Section label="Palanca" title="Engagement por categoría (clics por producto)" desc="Bisutería domina en volumen absoluto de clics, pero eso es porque tiene 62 productos compitiendo por atención. Normalizando por producto, categorías chicas rinden mucho más.">
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={ENGAGEMENT} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="categoria" width={110} tick={{ fontSize: 11.5, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v} clics/producto`, ""]} />
                    <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={14}>
                      {ENGAGEMENT.map((e, i) => (
                        <Cell key={i} fill={e.categoria === "Hogar" || e.categoria === "Vaporizadores" ? DROPI : "#D1D5DB"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Insight>
              <strong>Palanca a explorar:</strong> meter más productos en Hogar, Vaporizadores, Cocina, Deportes y Moda podría rendir más clics por esfuerzo que seguir metiendo Bisutería, cuyo volumen absoluto alto se explica por cantidad de productos y no por interés desproporcionado. (Ver el problema de categorización arriba antes de actuar sobre esto.)
            </Insight>
          </Section>

          <Section label="Cualitativo" title="Hallazgos de las 2 reuniones con proveedores">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Muchos productos preseleccionados por el filtro automático no servían para el proveedor (upsell, prueba, privados o sin foto); necesitó curación manual caso por caso.",
                "Ningún proveedor entró al Canva a armar su catálogo, así que el equipo terminó armando el catálogo público (cyberdays-catalogo.vercel.app) manualmente.",
                "La mayoría no subió la foto con marco a Dropi, así que el catálogo en Dropi no se ve brandeado como campaña.",
                "La categoría temporal \"Cyber Days\" sí fue fácil de adoptar (el paso más usado del checklist), pero cualquier producto puede ponérsela sin haber pasado por el filtro: no distingue participación avalada de auto-inclusión.",
                "Al proveedor le toca editar el producto con el descuento o crear uno nuevo con el descuento de la campaña, lo que vuelve a ensuciar el catálogo. Además, así no queda forma de mostrarle al dropshipper el precio antes y después, que es un factor motivador clave para que entienda el descuento que puede aprovechar.",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--dropi)", fontWeight: 700 }}>·</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section label="Pendiente" title="Preguntas abiertas">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Órdenes/GMV reales de la campaña: aún no se puede saber, se pedirá la data al finalizar la campaña.",
                "¿Cuántos de los 11 que postularon sí actualizaron el producto en Dropi aunque no marcaron el checklist?",
                "¿Ya se identificaron productos con la categoría \"Cyber Days\" puesta sin haber pasado por el filtro?",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>
                  <span style={{ color: "var(--dropi)", fontWeight: 700 }}>{i + 1}.</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
