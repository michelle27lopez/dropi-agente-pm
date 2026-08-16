"use client";

import { pruebasUsuarios } from "@/lib/pruebas-usuarios";

export default function PruebasUsuariosPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <a href="/" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Hub</a>
        <span style={{ color: "var(--border)" }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#0D9488",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🧪</div>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>Pruebas con Usuarios</h1>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>Links directos a cada prototipo, sin pasar por la página del proyecto</p>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {pruebasUsuarios.map((item, index) => (
            <a
              key={item.key}
              href={item.url}
              className="hub-card"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "24px",
                textDecoration: "none",
                display: "block",
                animationDelay: `${index * 60}ms`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="hub-card-icon" style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: item.color,
                  background: `${item.color}12`,
                  padding: "3px 8px", borderRadius: 999,
                  marginTop: 4,
                }}>
                  {item.tag}
                </span>
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                {item.name}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                {item.description}
              </p>
              <div className="hub-card-arrow" style={{ marginTop: 20, fontSize: 12, fontWeight: 600, color: "var(--dropi)" }}>
                Abrir prueba →
              </div>
            </a>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 48, textAlign: "center" }}>
          Dropi · Supplier Success · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
