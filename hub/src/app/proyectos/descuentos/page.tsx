"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";

const COLOR = "#F59E0B";

export default function DescuentosPage() {
  const isEmbedded = useIsEmbedded();
  const [docsOpen, setDocsOpen] = useState(true);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
        }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            ← Dropi PM Tools
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Descuentos en Catálogo</span>
        </header>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: `${COLOR}18`, color: COLOR,
              padding: "3px 9px", borderRadius: 20,
            }}>
              DESC-001
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#FEF3C7",
              color: "#92400E", padding: "3px 9px", borderRadius: 20,
            }}>
              E2E Documentado · Validación TI pendiente
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#EFF6FF",
              color: "#1D4ED8", padding: "3px 9px", borderRadius: 20,
            }}>
              Campañas DCA
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Descuentos en Catálogo · Precio Antes / Precio Ahora
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 680 }}>
            Feature transversal que muestra el precio original tachado y el precio de campaña en todo el ecosistema Dropi.
            Trigger inicial: <strong>Cyber Days (agosto 2026)</strong>. Funciona en Dropi nativo, Shopify, WooCommerce, Tienda Nube, CAS y ECOM Scanner.
          </p>
        </div>

        {/* Accordion Recursos */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
        }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "14px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>
              Recursos de Investigación y Documentación
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>
              DESC-001 · Descuentos en Catálogo
            </span>
            <span style={{
              fontSize: 16, color: "var(--muted)", transition: "transform 0.2s",
              display: "inline-block",
              transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}>
              ⌄
            </span>
          </button>

          {docsOpen && (
            <div style={{
              borderTop: "1px solid var(--border)", padding: "16px 20px",
              display: "flex", gap: 12, flexWrap: "wrap", background: "#FAFBFC",
            }}>
              {[
                {
                  href: "/desc001-precio-antes-ahora-e2e.html",
                  icon: "📋",
                  title: "Documentación E2E",
                  sub: "Kick-off · Discovery · Definición 3 fases · Following · Hand-off a TI",
                  badge: "E2E",
                  badgeColor: COLOR,
                  external: true,
                },
                {
                  href: "/proyectos/descuentos/prototipo",
                  icon: "🖱️",
                  title: "Prototipo interactivo",
                  sub: "Vista Proveedor (crear descuento) + Vista Dropshipper (precio antes/ahora)",
                  badge: "Fase 1",
                  badgeColor: "#10B981",
                  external: false,
                },
                {
                  href: "http://localhost:4200/new/productos/mis-productos/editar/DESC-003",
                  icon: "🚀",
                  title: "Prototipo Rapid Prototypes",
                  sub: "Tab \"Descuento\" en el flujo real de editar producto (requiere ng serve corriendo)",
                  badge: "Fase 1",
                  badgeColor: "#7C3AED",
                  external: true,
                },
              ].map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#fff", border: `1px solid var(--border)`,
                    borderTop: `3px solid ${card.badgeColor}`,
                    borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                    flex: "1 1 200px", minWidth: 220, maxWidth: 340,
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.09)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{card.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                        {card.title}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        background: `${card.badgeColor}18`, color: card.badgeColor,
                        padding: "1px 6px", borderRadius: 999,
                      }}>
                        {card.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{card.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: card.badgeColor, fontWeight: 700, flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Métricas clave */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Canales cubiertos", value: "6", sub: "Dropi · Shopify · WooC · TN · CAS · Scanner", color: COLOR },
            { label: "Fases definidas", value: "3", sub: "MVP → Filtros → Inteligencia", color: "#0EA5E9" },
            { label: "Trigger", value: "Ago 2026", sub: "Cyber Days como primer caso", color: "#10B981" },
            { label: "Riesgo crítico", value: "Wallet", sub: "Validación TI: 30-jun-2026", color: "#EF4444" },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "18px 20px",
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--muted)",
                textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
              }}>
                {c.label}
              </div>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em",
                color: c.color, lineHeight: 1, marginBottom: 6,
              }}>
                {c.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Fases */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, overflow: "hidden", marginBottom: 32,
        }}>
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid var(--border)",
            fontSize: 13, fontWeight: 700, color: "var(--fg)",
          }}>
            Fases del proyecto
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {[
              {
                fase: "Fase 1 — MVP",
                titulo: "Descuento básico como propiedad del producto",
                items: [
                  "El proveedor entra a cualquier producto suyo y activa un descuento",
                  "El sistema pregunta: ¿descuento por % o por valor fijo?",
                  "Se calcula y muestra el precio tachado al dropshipper",
                  "Aplica a cualquier producto — sin dependencia de campañas",
                  "El proveedor activa y desactiva el descuento manualmente",
                  "Finalización automática por fecha límite (fecha_fin_descuento)",
                  "Finalización automática por volumen de ventas (cantidad_limite_descuento)",
                  "Si ambas condicionadas: gana la primera que se cumpla",
                  "Actualización masiva vía Excel: descuento_activo / tipo / valor / fecha / volumen",
                  "Se sincroniza con Shopify, WooCommerce, Tienda Nube, CAS y ECOM Scanner",
                ],
                color: COLOR,
                estado: "En validación TI",
              },
              {
                fase: "Fase 2 — Exploración",
                titulo: "Filtros y badges en catálogo",
                items: [
                  "Badge de descuento en el listing del catálogo (no solo la ficha)",
                  "Filtro: 'Productos con descuento', 'Mayor descuento primero'",
                  "Notificación a dropshippers con productos importados en descuento",
                  "Dashboard básico de sincronización para admin de campaña",
                ],
                color: "#0EA5E9",
                estado: "Backlog",
              },
              {
                fase: "Fase 3 — Inteligencia",
                titulo: "Automatización y performance",
                items: [
                  "Reglas automáticas de descuento por condición (stock, días sin órdenes)",
                  "Historial automático de precios — elimina registro manual",
                  "Dashboard de performance: qué % de descuento genera más importaciones",
                  "Integración con Campaign Manager: mínimo de descuento por campaña",
                ],
                color: "#7C3AED",
                estado: "Largo plazo",
              },
            ].map((f, i) => (
              <div
                key={f.fase}
                style={{
                  padding: "20px",
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800,
                    background: `${f.color}18`, color: f.color,
                    padding: "2px 8px", borderRadius: 999,
                  }}>
                    {f.fase}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: "#9CA3AF",
                  }}>
                    {f.estado}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 10 }}>
                  {f.titulo}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {f.items.map((item) => (
                    <li key={item} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 5, lineHeight: 1.4 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bitácora de validación con proveedores */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, overflow: "hidden", marginBottom: 32,
        }}>
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid var(--border)",
            fontSize: 13, fontWeight: 700, color: "var(--fg)",
          }}>
            🗣️ Sesiones de validación con proveedores · 08/07/2026
          </div>
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, lineHeight: 1.5 }}>
              3 entrevistas moderadas sobre el prototipo (Vista Proveedor · crear descuento por % o valor fijo, con fecha fin o límite de unidades).
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Gisela · Gold Stone International</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  <li>Validó el set de reglas como completo — no pidió nada adicional.</li>
                  <li>Usaría más el valor fijo (ya tiene el precio pre-calculado).</li>
                  <li>La fecha fin automática le resuelve un problema real: hoy se le olvida revertir el precio manualmente y el descuento se queda activo por error.</li>
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Andrés · Katz Supply</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  <li>Reacción muy positiva a la vista "antes/ahora" tachada.</li>
                  <li>Riesgo señalado: sugirió poder subir el precio antes de aplicar el descuento para que se vea más grande — patrón de precio-ancla falso a prevenir con política de producto.</li>
                  <li>Propuso que el feature sea exclusivo para bodegas premium/verificadas.</li>
                  <li>Aparte (fuera de alcance de Descuentos): señaló que hay "bodegas falsas" (revendedores comprando por unidad) que distorsionan la comparación de precios en catálogo — pasar como hallazgo a verificación de proveedores.</li>
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Manuela · Black Swan Accesos</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  <li>Lo usaría por porcentaje, para productos que no se mueven en stock.</li>
                  <li><strong>Fin por stock remanente, no por unidades vendidas</strong>: necesita que el descuento pare cuando queden ej. 100 unidades (no cuando se vendan 400 de 500) — usan ese umbral para planificar el traslado de inventario entre su bodega secundaria (stock) y la principal (despacho).</li>
                  <li>Para productos descontinuados: sin límite, hasta agotar existencias.</li>
                  <li>Propuso descuentos exclusivos para dropshippers que ya tuvieron ventas previas con ellos (fidelización).</li>
                  <li>Hoy ya hace descuentos por volumen, pero por fuera: crea un producto privado duplicado con precio más bajo y comparte el stock solo con ese dropshipper.</li>
                </ul>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, padding: "10px 14px", background: "#FFFBEB", border: "1px solid var(--border)", borderRadius: 10 }}>
              El campo "límite de unidades" del prototipo es ambiguo: Manuela lo necesita como <strong>umbral de stock restante</strong> (parar cuando queden X unidades), no como <strong>cantidad vendida</strong> (parar tras vender X). Son lógicas inversas — definir cuál construir, o si deben coexistir como dos modos.
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div style={{
          background: `${COLOR}0d`, border: `1px solid ${COLOR}30`,
          borderRadius: 14, padding: "18px 20px", marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLOR, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Próximo paso crítico
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Validar con José Giraldo (TI) el impacto en la wallet — lunes 30-jun-2026
          </div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
            Si la wallet calcula comisiones sobre el campo de precio del producto, cambiar el precio durante la campaña puede afectar márgenes internos.
            Esta es la única pregunta que puede bloquear la Fase 1 antes de Cyber Days.
            Si TI confirma que no hay dependencia → crear épica en Jira + estimación de esfuerzo.
          </div>
        </div>

        <div style={{
          background: "#7C3AED0d", border: "1px solid #7C3AED30",
          borderRadius: 14, padding: "18px 20px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Próximo paso adicional · de sesión 08/07
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Definir política anti-manipulación de precio ancla antes de construir Fase 1
          </div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
            Un proveedor premium sugirió inflar el precio antes de aplicar el descuento para que se vea más grande visualmente.
            Evaluar validación contra histórico de precio o un piso mínimo de descuento antes de habilitar la Fase 1.
          </div>
        </div>

      </div>
    </main>
  );
}
