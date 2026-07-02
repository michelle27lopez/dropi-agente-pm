"use client";

import { useState } from "react";
import Image from "next/image";

const DROPI = "#F77F00";
const DROPI_LIGHT = "#FFF3E0";

// ─── Types ────────────────────────────────────────────────────────────────────

type Highlight = { x: number; y: number; w: number; h: number }; // porcentajes (0–100)

type Step = {
  n: number;
  title: string;
  img: string;
  w: number;
  h: number;
  desc: string;
  optional?: boolean;
  warning?: boolean;
  highlight?: Highlight;
  figmaUrl?: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const F = "https://www.figma.com/design/Ssrh2jwCSL3u3KBwF7R9SV/Combos-Dropshipper-1.0?node-id=";

const CREAR_STEPS: Step[] = [
  {
    n: 1,
    title: "Accede a Mis combos",
    img: "/tango/step01_empty_activos.png",
    w: 1280, h: 883,
    desc: "En el menú lateral, ve a Productos > Mis combos. Si todavía no tienes combos creados, verás la pantalla vacía con el banner de bienvenida.",
    highlight: { x: 1, y: 16, w: 20, h: 14 },
    figmaUrl: `${F}6405-20327`,
  },
  {
    n: 2,
    title: "Haz clic en «Crear combo»",
    img: "/tango/step01_empty_activos.png",
    w: 1280, h: 883,
    desc: 'Haz clic en el botón naranja "Crear combo" en la esquina superior derecha para iniciar la creación del combo.',
    figmaUrl: `${F}6405-20327`,
  },
  {
    n: 3,
    title: "Paso 1 — Elegir proveedor",
    img: "/tango/ep01_elegir_proveedor_main.png",
    w: 1280, h: 992,
    desc: "Verás la lista de tus proveedores disponibles. Solo puedes seleccionar un proveedor por combo, ya que todos los productos deben pertenecer a la misma bodega del mismo proveedor — esto garantiza un solo envío y empaque. Puedes buscar por nombre o activar el toggle Favoritos.",
    figmaUrl: `${F}6407-21135`,
  },
  {
    n: 4,
    title: "(Opcional) Filtrar proveedores",
    img: "/tango/ep02_elegir_proveedor_filtros.png",
    w: 1280, h: 992,
    desc: "Usa los filtros de Tipo de proveedor, Ciudad y Categoría para acotar la búsqueda. Haz clic en la flecha naranja para aplicar.",
    optional: true,
    figmaUrl: `${F}6398-60982`,
  },
  {
    n: 5,
    title: "Selecciona el proveedor y haz clic en «Siguiente»",
    img: "/tango/ep03_elegir_proveedor_seleccionado.png",
    w: 1280, h: 992,
    desc: 'Haz clic en el proveedor que quieres usar. Queda seleccionado con borde naranja y el panel derecho muestra el preview del combo con el costo estimado. Cuando estés listo, haz clic en "Siguiente" en la esquina inferior derecha.',
    figmaUrl: `${F}6156-2423`,
  },
  {
    n: 6,
    title: "Paso 2 — Agregar productos",
    img: "/tango/ap01_agregar_productos_main.png",
    w: 1296, h: 1024,
    desc: 'Se abre el catálogo del proveedor. Cada tarjeta de producto muestra categoría, stock disponible, precio proveedor y precio sugerido. Necesitas mínimo 2 artículos para crear un combo (pueden ser el mismo producto repetido). Haz clic en "+ Agregar" en cada producto que quieras incluir.',
    figmaUrl: `${F}6178-6109`,
  },
  {
    n: 7,
    title: "Confirma los productos seleccionados",
    img: "/tango/ap03_agregar_miniaturas.png",
    w: 1296, h: 1024,
    desc: 'En la barra inferior verás las miniaturas de los productos que vas agregando. Cuando termines, haz clic en "Agregar" para confirmar la selección y volver al combo.',
    figmaUrl: `${F}6217-10578`,
  },
  {
    n: 8,
    title: "Revisa los productos del combo",
    img: "/tango/ap04_productos_agregados.png",
    w: 1280, h: 992,
    desc: 'Los productos seleccionados aparecen en el listado. Desde aquí puedes ajustar la cantidad de cada uno, volver a abrir el catálogo con "+ Agregar producto", o quitar productos con "Eliminar". En el panel derecho se muestra el resumen del combo: cantidad de productos agregados y las bodegas disponibles — solo aparecen las bodegas que tienen todos los productos del combo en común. Cuando estés listo, haz clic en "Siguiente".',
    figmaUrl: `${F}6218-11642`,
  },
  {
    n: 9,
    title: "Paso 3 — Personalizar combo",
    img: "/tango/pc02_personalizar_con_productos.png",
    w: 1280, h: 992,
    desc: "Ingresa el nombre del combo (obligatorio), una descripción (opcional) e imágenes (opcional). El panel derecho muestra el resumen de precios: el Costo Combo es la suma de los precios de proveedor de los productos incluidos, y el Precio sugerido es la suma de los precios sugeridos de esos mismos productos.",
    figmaUrl: `${F}6332-75392`,
  },
  {
    n: 10,
    title: "Haz clic en «Guardar»",
    img: "/tango/pc02_personalizar_con_productos.png",
    w: 1280, h: 992,
    desc: 'Cuando hayas completado el nombre del combo, haz clic en "Guardar".',
    figmaUrl: `${F}6332-75392`,
  },
  {
    n: 11,
    title: "El sistema guarda tu combo",
    img: "/tango/gc01_guardar_main.png",
    w: 1280, h: 992,
    desc: 'Aparece un modal de carga "Guardando combo... ¡En un abrir y cerrar de ojos estará listo!"',
    figmaUrl: `${F}6400-62336`,
  },
  {
    n: 12,
    title: "¡Combo creado con éxito!",
    img: "/tango/gc02_guardar_exito.png",
    w: 1280, h: 992,
    desc: 'Vuelves automáticamente a Mis combos, donde tu nuevo combo aparece con el badge "Activo". Un mensaje de confirmación aparece en la esquina superior derecha.',
    figmaUrl: `${F}6400-62607`,
  },
];

const EDITAR_STEPS: Step[] = [
  {
    n: 1,
    title: "Mis combos — lista de combos",
    img: "/tango/step03_con_combos_activos.png",
    w: 1280, h: 883,
    desc: 'En Productos > Mis combos ves todos tus combos en tarjetas con imagen, cantidad de productos, stock, proveedor y las bodegas en las que está disponible el combo. Cada combo tiene opciones de Editar y Eliminar.',
    figmaUrl: `${F}6329-63527`,
  },
  {
    n: 2,
    title: "Haz clic en «Editar»",
    img: "/tango/step03_con_combos_activos.png",
    w: 1280, h: 883,
    desc: 'Haz clic en "Editar" en la tarjeta del combo que quieres modificar.',
    figmaUrl: `${F}6329-63527`,
  },
  {
    n: 3,
    title: "El combo abre directo en Paso 3 — Personalizar",
    img: "/tango/ed04_editar_personalizar_directo.png",
    w: 1280, h: 992,
    desc: "Al editar un combo guardado, la pantalla se abre directamente en el Paso 3: Personalizar. Los campos ya vienen pre-llenados con el nombre, descripción e imágenes actuales. El panel derecho muestra el resumen con los productos, las bodegas disponibles y los precios. Modifica lo que necesites y haz clic en \"Guardar\".",
    figmaUrl: `${F}6401-64034`,
  },
  {
    n: 4,
    title: "⚠️ No puedes cambiar de proveedor",
    img: "/tango/ed05_proveedor_bloqueado_modal.png",
    w: 1280, h: 996,
    desc: 'Si navegas al Paso 1 (Elegir proveedor), aparece el aviso "No puedes cambiar de proveedor — este combo ya tiene productos agregados. Para elegir otro proveedor debes empezar un nuevo combo." Haz clic en "Cancelar" para volver a la edición actual.',
    warning: true,
    figmaUrl: `${F}6438-31444`,
  },
  {
    n: 5,
    title: "Paso 2 — Agregar o quitar productos",
    img: "/tango/ed06_editar_agregar_productos.png",
    w: 1280, h: 992,
    desc: 'Desde el Paso 2 ves los productos actuales del combo. Puedes ajustar cantidades, agregar más con "+ Agregar producto" o quitar productos con "Eliminar". El panel derecho actualiza el resumen en tiempo real.',
    figmaUrl: `${F}6401-63953`,
  },
  {
    n: 6,
    title: "Paso 2 — Confirmar producto agregado",
    img: "/tango/ed07_editar_personalizar.png",
    w: 1280, h: 992,
    desc: 'Al agregar un nuevo producto aparece el toast de confirmación. El panel derecho refleja los nuevos totales: cantidad de productos, bodegas y precios actualizados. Cuando termines, haz clic en "Guardar".',
    figmaUrl: `${F}6402-75117`,
  },
  {
    n: 7,
    title: "Guardar cambios",
    img: "/tango/gc01_guardar_main.png",
    w: 1280, h: 992,
    desc: 'Haz clic en "Guardar" para aplicar los cambios. Aparece el modal de carga mientras se procesan.',
    figmaUrl: `${F}6400-62336`,
  },
  {
    n: 8,
    title: "¡Cambios guardados!",
    img: "/tango/ed08_editar_exito.png",
    w: 1280, h: 992,
    desc: 'Vuelves a Mis combos con el toast "¡Listo! Guardaste tus cambios con éxito." El combo actualizado aparece en la lista.',
    figmaUrl: `${F}6401-64046`,
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StepButton({ step, active, onClick }: {
  step: Step;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
        background: active ? DROPI_LIGHT : "transparent",
        textAlign: "left",
        transition: "background 0.15s",
      }}
    >
      <span style={{
        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700,
        background: active ? DROPI : step.warning ? "#FEF3C7" : "#F3F4F6",
        color: active ? "#fff" : step.warning ? "#92400E" : "#6B7280",
      }}>
        {step.n}
      </span>
      <span style={{ fontSize: 12, color: active ? "#111827" : "#374151", lineHeight: 1.3 }}>
        {step.title}
        {step.optional && (
          <span style={{ marginLeft: 4, fontSize: 10, color: "#9CA3AF" }}>opcional</span>
        )}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CombosPage() {
  const [tab, setTab] = useState<"crear" | "editar">("crear");
  const [active, setActive] = useState(0);

  const steps = tab === "crear" ? CREAR_STEPS : EDITAR_STEPS;
  const current = steps[active];

  function switchTab(t: "crear" | "editar") {
    setTab(t);
    setActive(0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid var(--border)", background: "var(--card)",
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ color: DROPI, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>← Hub</a>
        <div style={{ width: 1, height: 16, background: "var(--border)" }} />
        <span style={{ fontSize: 13, color: "var(--muted)" }}>Proyectos</span>
        <div style={{ width: 1, height: 16, background: "var(--border)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Combos Dropshipper — Guía de flujo</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <span style={{
            background: DROPI_LIGHT, color: DROPI,
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
          }}>
            PROD-545
          </span>
          <span style={{
            background: "#F0FDF4", color: "#15803D",
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
          }}>
            Hand-off
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 240, flexShrink: 0, background: "var(--card)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {(["crear", "editar"] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1, padding: "12px 0", border: "none", cursor: "pointer", fontSize: 12,
                  fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? DROPI : "var(--muted)",
                  background: "transparent",
                  borderBottom: tab === t ? `2px solid ${DROPI}` : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {t === "crear" ? "Crear combo" : "Editar combo"}
              </button>
            ))}
          </div>

          {/* Steps list */}
          <div style={{ padding: "8px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
            {steps.map((s, i) => (
              <StepButton key={i} step={s} active={i === active} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>

            {/* Step header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: current.warning ? "#FEF3C7" : DROPI,
                  color: current.warning ? "#92400E" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {current.n}
                </span>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)" }}>
                  {current.title}
                </h1>
                {current.optional && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "#9CA3AF",
                    background: "#F3F4F6", padding: "2px 8px", borderRadius: 999,
                  }}>
                    OPCIONAL
                  </span>
                )}
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, maxWidth: 700 }}>
                {current.desc}
              </p>
            </div>

            {/* Screenshot */}
            <div style={{
              background: current.warning ? "#FFFBEB" : "#F9FAFB",
              border: "1px solid",
              borderColor: current.warning ? "#FCD34D" : "var(--border)",
              borderRadius: 12, overflow: "hidden",
              padding: 16,
            }}>
              <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                <Image
                  src={current.img}
                  alt={current.title}
                  width={current.w}
                  height={current.h}
                  style={{
                    width: "100%", height: "auto",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                    display: "block",
                  }}
                  unoptimized
                />
                {current.highlight && (
                  <div style={{
                    position: "absolute",
                    left: `${current.highlight.x}%`,
                    top: `${current.highlight.y}%`,
                    width: `${current.highlight.w}%`,
                    height: `${current.highlight.h}%`,
                    border: `3px solid ${DROPI}`,
                    borderRadius: 6,
                    background: "rgba(247, 127, 0, 0.15)",
                    pointerEvents: "none",
                    boxShadow: `0 0 0 2px rgba(247,127,0,0.3)`,
                  }} />
                )}
              </div>
            </div>

            {/* Figma link */}
            {current.figmaUrl && (
              <div style={{ marginTop: 10, textAlign: "right" }}>
                <a
                  href={current.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12, color: "#9B59B6", fontWeight: 600,
                    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5Z" fill="#1ABCFE"/>
                    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 1 1 0 47.5Z" fill="#0ACF83"/>
                    <path d="M19 0V19H28.5A9.5 9.5 0 0 0 19 0Z" fill="#FF7262"/>
                    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" fill="#F24E1E"/>
                    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" fill="#FF7262"/>
                  </svg>
                  Ver en Figma →
                </a>
              </div>
            )}

            {/* Navigation */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 20,
            }}>
              <button
                onClick={() => setActive(Math.max(0, active - 1))}
                disabled={active === 0}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "var(--card)", cursor: active === 0 ? "not-allowed" : "pointer",
                  fontSize: 13, color: active === 0 ? "var(--muted)" : "var(--fg)",
                  fontWeight: 500,
                }}
              >
                ← Anterior
              </button>

              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {active + 1} / {steps.length}
              </span>

              <button
                onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
                disabled={active === steps.length - 1}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none",
                  background: active === steps.length - 1 ? "#F3F4F6" : DROPI,
                  color: active === steps.length - 1 ? "var(--muted)" : "#fff",
                  cursor: active === steps.length - 1 ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600,
                }}
              >
                Siguiente →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
