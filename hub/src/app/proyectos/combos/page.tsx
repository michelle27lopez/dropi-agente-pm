"use client";

import { useState } from "react";
import Image from "next/image";

const DROPI = "#F77F00";
const DROPI_LIGHT = "#FFF3E0";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CREAR_STEPS = [
  {
    n: 1,
    title: "Accede a Mis combos",
    img: "/tango/step01_empty_activos.png",
    w: 1280, h: 883,
    desc: "En el menú lateral, ve a Productos > Mis combos. Si todavía no tienes combos creados, verás la pantalla vacía con el banner de bienvenida.",
  },
  {
    n: 2,
    title: "Haz clic en «Crear combo»",
    img: "/tango/step01_empty_activos.png",
    w: 1280, h: 883,
    desc: "Haz clic en el botón naranja "Crear combo" en la esquina superior derecha para iniciar el asistente de creación.",
  },
  {
    n: 3,
    title: "Paso 1 — Elegir proveedor",
    img: "/tango/ep01_elegir_proveedor_main.png",
    w: 1280, h: 992,
    desc: "Se abre el asistente en el Paso 1: Elegir proveedor. Ves todos tus proveedores disponibles. Puedes buscar por nombre o activar el toggle Favoritos para ver solo los que tienes marcados.",
  },
  {
    n: 4,
    title: "(Opcional) Filtrar proveedores",
    img: "/tango/ep02_elegir_proveedor_filtros.png",
    w: 1280, h: 992,
    desc: "Usa los filtros de Tipo de proveedor, Ciudad y Categoría para acotar la búsqueda. Haz clic en la flecha naranja para aplicar.",
    optional: true,
  },
  {
    n: 5,
    title: "Selecciona un proveedor",
    img: "/tango/ed01_editar_elegir.png",
    w: 1163, h: 1400,
    desc: "Haz clic en el proveedor que quieres usar. Queda seleccionado con borde naranja y el panel derecho muestra un preview del combo. Todos los productos del combo deben ser del mismo proveedor.",
  },
  {
    n: 6,
    title: "Haz clic en «Siguiente»",
    img: "/tango/ep01_elegir_proveedor_main.png",
    w: 1280, h: 992,
    desc: "Confirma tu elección haciendo clic en "Siguiente" en la esquina inferior derecha.",
  },
  {
    n: 7,
    title: "Paso 2 — Agregar productos",
    img: "/tango/ap02_modal_producto.png",
    w: 1280, h: 992,
    desc: "Estás en el Paso 2: Agregar productos. Ves los slots vacíos del combo. Necesitas al menos 2 artículos. Haz clic en "+ Agregar producto" para abrir el catálogo del proveedor.",
  },
  {
    n: 8,
    title: "Selecciona productos del catálogo",
    img: "/tango/ap01_agregar_productos_main.png",
    w: 1296, h: 1024,
    desc: "Se abre el catálogo con los productos del proveedor. Cada tarjeta muestra categoría, stock, precio proveedor y precio sugerido. Haz clic en "+ Agregar" en cada producto que quieras incluir.",
  },
  {
    n: 9,
    title: "Confirma la selección",
    img: "/tango/ap01_agregar_productos_main.png",
    w: 1296, h: 1024,
    desc: "En la barra inferior verás las miniaturas de los productos seleccionados. Cuando termines, haz clic en "Agregar" para confirmarlos.",
  },
  {
    n: 10,
    title: "Paso 3 — Personalizar combo",
    img: "/tango/pc01_personalizar_main.png",
    w: 1280, h: 992,
    desc: "Ingresa el nombre del combo (obligatorio), una descripción (opcional) e imágenes (opcional). El panel derecho muestra el resumen con costo total y precio sugerido calculados automáticamente.",
  },
  {
    n: 11,
    title: "Haz clic en «Guardar»",
    img: "/tango/pc01_personalizar_main.png",
    w: 1280, h: 992,
    desc: "Cuando hayas completado el nombre del combo, haz clic en "Guardar".",
  },
  {
    n: 12,
    title: "El sistema guarda tu combo",
    img: "/tango/gc01_guardar_main.png",
    w: 1280, h: 992,
    desc: "Aparece un modal de carga "Guardando combo... ¡En un abrir y cerrar de ojos estará listo!"",
  },
  {
    n: 13,
    title: "¡Combo creado con éxito!",
    img: "/tango/gc02_guardar_exito.png",
    w: 1280, h: 992,
    desc: "Vuelves automáticamente a Mis combos, donde tu nuevo combo aparece con el badge "Activo". Un mensaje de confirmación aparece en la esquina superior derecha.",
  },
];

const EDITAR_STEPS = [
  {
    n: 1,
    title: "Mis combos — lista de combos",
    img: "/tango/step03_con_combos_activos.png",
    w: 1280, h: 883,
    desc: "En Productos > Mis combos ves todos tus combos en tarjetas con imagen, productos, stock, proveedor y canales. Cada combo tiene opciones de Editar y Eliminar.",
  },
  {
    n: 2,
    title: "Haz clic en «Editar»",
    img: "/tango/step03_con_combos_activos.png",
    w: 1280, h: 883,
    desc: "Haz clic en "Editar" en la tarjeta del combo que quieres modificar.",
  },
  {
    n: 3,
    title: "Paso 1 — Proveedor actual seleccionado",
    img: "/tango/ed01_editar_elegir.png",
    w: 1163, h: 1400,
    desc: "Se abre el asistente de edición. El proveedor actual ya aparece seleccionado con borde naranja. Puedes mantenerlo o elegir otro.",
  },
  {
    n: 4,
    title: "⚠️ Cambiar de proveedor",
    img: "/tango/step_cambiar_proveedor_modal.png",
    w: 1400, h: 442,
    desc: "Si seleccionas un proveedor diferente, aparece una advertencia: "Cambiar de proveedor eliminará tus productos". Haz clic en "Cancelar" para mantener el actual, o en "Cambiar de proveedor" para confirmar (deberás seleccionar productos nuevamente).",
    warning: true,
  },
  {
    n: 5,
    title: "Paso 2 — Agregar o quitar productos",
    img: "/tango/ed02_editar_agregar.png",
    w: 1400, h: 731,
    desc: "Ves los productos que ya tenía el combo. Puedes agregar más haciendo clic en "+ Agregar producto" o eliminar los existentes con el ícono de papelera.",
  },
  {
    n: 6,
    title: "Paso 3 — Personalizar combo",
    img: "/tango/ed03_editar_personalizar.png",
    w: 1297, h: 1400,
    desc: "Ajusta nombre, descripción e imágenes. Los campos vienen pre-llenados con la información actual del combo.",
  },
  {
    n: 7,
    title: "Guardar cambios",
    img: "/tango/gc01_guardar_main.png",
    w: 1280, h: 992,
    desc: "Haz clic en "Guardar" para aplicar los cambios. Aparece el modal de carga mientras se procesan.",
  },
  {
    n: 8,
    title: "Cambios guardados",
    img: "/tango/gc02_guardar_exito.png",
    w: 1280, h: 992,
    desc: "Vuelves a Mis combos con la confirmación de que los cambios fueron guardados exitosamente.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Step({ step, active, onClick }: {
  step: typeof CREAR_STEPS[0] & { warning?: boolean; optional?: boolean };
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
              <Step key={i} step={s} active={i === active} onClick={() => setActive(i)} />
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
                  background: (current as typeof CREAR_STEPS[0] & { warning?: boolean }).warning ? "#FEF3C7" : DROPI,
                  color: (current as typeof CREAR_STEPS[0] & { warning?: boolean }).warning ? "#92400E" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {current.n}
                </span>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)" }}>
                  {current.title}
                </h1>
                {(current as typeof CREAR_STEPS[0] & { optional?: boolean }).optional && (
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
              background: (current as typeof CREAR_STEPS[0] & { warning?: boolean }).warning
                ? "#FFFBEB"
                : "#F9FAFB",
              border: "1px solid",
              borderColor: (current as typeof CREAR_STEPS[0] & { warning?: boolean }).warning
                ? "#FCD34D"
                : "var(--border)",
              borderRadius: 12, overflow: "hidden",
              padding: 16,
            }}>
              <Image
                src={current.img}
                alt={current.title}
                width={current.w}
                height={current.h}
                style={{
                  width: "100%", height: "auto",
                  borderRadius: 8,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                }}
                unoptimized
              />
            </div>

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
