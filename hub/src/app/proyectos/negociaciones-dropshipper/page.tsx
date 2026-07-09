"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";
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

const F = "https://www.figma.com/design/CVwTDY4ByRakZ1472CiZ4P/Negociaciones-2.0?node-id=";

const CREAR_PROVEEDOR_STEPS: Step[] = [
  {
    n: 1,
    title: "Entra al módulo de Negociaciones",
    img: "/tango/cn01_home_click_productos.png",
    w: 1280, h: 883,
    desc: "En el menú lateral, pasa el cursor sobre Productos y haz clic en Negociaciones (marcada con la etiqueta Nuevo).",
    highlight: { x: 5, y: 31, w: 15, h: 4 },
    figmaUrl: `${F}4678-115535`,
  },
  {
    n: 2,
    title: "Haz clic en «Crear negociación»",
    img: "/tango/cn02_sin_negociaciones.png",
    w: 1280, h: 883,
    desc: 'Se abre el módulo Negociaciones vacío, con el banner de bienvenida. Haz clic en el botón naranja "Crear negociación" en la esquina superior derecha para iniciar el flujo.',
    highlight: { x: 82, y: 10.4, w: 15.5, h: 4 },
    figmaUrl: `${F}4678-114424`,
  },
  {
    n: 3,
    title: "Paso 1 — Empieza la negociación",
    img: "/tango/cn03_modal_paso1_inicio.png",
    w: 1280, h: 992,
    desc: 'Se abre el modal de creación en pantalla completa, con las tres etapas del flujo (Empieza una negociación, Detalles, Resumen). Elige con quién vas a negociar: Líder de Comunidad, o Dropshipper — la opción nueva para negociar directo con un dropshipper individual.',
    highlight: { x: 52, y: 41, w: 35.5, h: 9.6 },
    figmaUrl: `${F}4672-253427`,
  },
  {
    n: 4,
    title: "Selecciona «Dropshipper»",
    img: "/tango/cn04_seleccionar_dropshipper.png",
    w: 1280, h: 992,
    desc: 'Al elegir Dropshipper aparece el campo "Correo del dropshipper". Escribe el correo de la contraparte en ese input.',
    highlight: { x: 12.5, y: 55.5, w: 35.8, h: 4.3 },
    figmaUrl: `${F}4682-330986`,
  },
  {
    n: 5,
    title: "Escribe el correo y busca al dropshipper",
    img: "/tango/cn05_correo_dropshipper.png",
    w: 1280, h: 992,
    desc: "Con el correo escrito (ej. jaimeguevara@gmail.com), haz clic en el botón de flecha naranja para buscar al dropshipper.",
    highlight: { x: 45.2, y: 55.5, w: 3.1, h: 4.3 },
    figmaUrl: `${F}4682-331226`,
  },
  {
    n: 6,
    title: "El dropshipper aparece — elige el alcance",
    img: "/tango/cn06_seleccionar_alcance.png",
    w: 1280, h: 992,
    desc: 'Si el correo existe, se muestra el nombre del dropshipper (ej. Jaime Guevara). Ahora elige el alcance de productos: Productos específicos (para elegir solo algunos) o Catálogo completo.',
    highlight: { x: 12.5, y: 74.4, w: 35.5, h: 7.7 },
    figmaUrl: `${F}4683-379225`,
  },
  {
    n: 7,
    title: "Regla: bloqueo si la comunidad del dropshipper ya tiene negociación",
    img: "/tango/cn07b_bloqueo_comunidad.png",
    w: 1280, h: 1086,
    desc: 'Antes de seguir, el sistema valida si el dropshipper pertenece a una comunidad con la que ya tienes una negociación de líder de comunidad — esas negociaciones tienen prioridad. Si esa negociación es de Catálogo completo, aparece esta alerta ("Ya tienes una negociación de catálogo completo con la comunidad Ossa...") y las dos opciones de alcance quedan deshabilitadas: no puedes crear una negociación individual con él. Si en cambio la negociación de la comunidad es de Productos específicos, sí puedes continuar y crear la negociación individual (también de productos específicos) — pero los productos que ya cubre la negociación de la comunidad quedan bloqueados para este dropshipper; solo puedes negociarle los que no se solapan.',
    warning: true,
    figmaUrl: `${F}6105-276476`,
  },
  {
    n: 8,
    title: "Acepta los términos y condiciones",
    img: "/tango/cn07_aceptar_tyc.png",
    w: 1280, h: 992,
    desc: 'Marca la casilla "Acepto que leí los términos y condiciones" — es obligatoria para avanzar. El botón Siguiente solo queda habilitado después de aceptarla.',
    highlight: { x: 12.5, y: 86.2, w: 20.6, h: 2.2 },
    figmaUrl: `${F}4683-332364`,
  },
  {
    n: 9,
    title: "Paso 2 — Agrega productos",
    img: "/tango/cn08_agregar_productos.png",
    w: 1280, h: 992,
    desc: 'En el Paso 2 (Detalles de la negociación), haz clic en "Agregar productos" para abrir el catálogo. Ahí puedes filtrar por Rango de precio o Categorías, o usar "Seleccionar todos" para elegir más rápido.',
    figmaUrl: `${F}4683-332354`,
  },
  {
    n: 10,
    title: 'Selecciona productos y haz clic en «Agregar»',
    img: "/tango/cn09_click_agregar.png",
    w: 1280, h: 992,
    desc: 'Marca los productos que quieras incluir (aquí 2 de 321) — se van sumando en la barra inferior "Productos agregados". Cuando termines, haz clic en el botón naranja "Agregar" para confirmarlos y volver a Detalles de la negociación.',
    highlight: { x: 71, y: 92.5, w: 26.6, h: 4.5 },
    figmaUrl: `${F}4683-332359`,
  },
  {
    n: 11,
    title: "Elige el tipo de comisión",
    img: "/tango/cn10_tipo_comision.png",
    w: 1280, h: 992,
    desc: 'De vuelta en Detalles de la negociación, ya tienes los 5 productos agregados a la tabla. Además de "Agregar productos" (lo que acabas de hacer), está el botón "Carga masiva" para subir muchos productos a la vez desde un excel, en vez de agregarlos uno por uno. Ahora elige el tipo de comisión: Porcentual o Fija.',
    highlight: { x: 12.5, y: 37.6, w: 36.6, h: 8.5 },
    figmaUrl: `${F}4683-332380`,
  },
  {
    n: 12,
    title: "Ingresa el valor y aplícalo a todos los productos",
    img: "/tango/cn11_valor_comision.png",
    w: 1280, h: 992,
    desc: 'Escribe el porcentaje (ej. 10%) y haz clic en la flecha naranja para aplicarlo. El valor se refleja de inmediato en la columna Comisión de los 5 productos de la tabla.',
    highlight: { x: 44.4, y: 40.2, w: 3.5, h: 4.4 },
    figmaUrl: `${F}4683-332391`,
  },
  {
    n: 13,
    title: "Si personalizas una fila y vuelves a aplicar, te avisa",
    img: "/tango/cn12_modificar_comision.png",
    w: 1280, h: 992,
    desc: 'Si ya modificaste manualmente la comisión de un producto (aquí 15%) e intentas aplicar de nuevo el valor general, aparece esta advertencia: "Tienes productos con comisiones personalizadas, al continuar se modificará la comisión de todos los productos". Evita sobrescribir cambios sin querer.',
    warning: true,
    highlight: { x: 51, y: 62.1, w: 14.1, h: 4.2 },
    figmaUrl: `${F}4683-332398`,
  },
  {
    n: 14,
    title: "Paso 3 — Revisa el resumen",
    img: "/tango/cn13_resumen.png",
    w: 1280, h: 992,
    desc: "El resumen muestra la contraparte (Jaime Guevara), el tipo y monto de comisión (Porcentual, 10%) y los 5 productos involucrados con su comisión ya aplicada. Haz clic en Continuar para avanzar al envío.",
    highlight: { x: 79.8, y: 92.5, w: 17.7, h: 4.5 },
    figmaUrl: `${F}4683-332420`,
  },
  {
    n: 15,
    title: "Envía la negociación",
    img: "/tango/cn14_enviar.png",
    w: 1280, h: 992,
    desc: 'Al hacer clic en Continuar se abre este modal: advierte que una vez el dropshipper apruebe, podrás agregar o quitar productos pero ya no podrás modificar las comisiones. Puedes dejar un comentario opcional (máx. 200 caracteres) y hacer clic en "Enviar".',
    warning: true,
    highlight: { x: 50.6, y: 65.3, w: 14.5, h: 4.8 },
    figmaUrl: `${F}4683-332428`,
  },
  {
    n: 16,
    title: "Negociación enviada — queda pendiente de aprobación",
    img: "/tango/cn15_negociacion_creada.png",
    w: 1300, h: 1012,
    desc: 'Vuelves a la lista de Negociaciones con el toast de confirmación "Enviaste la negociación a Jaime Guevara". La negociación queda en estado Pendiente hasta que el dropshipper la apruebe o la rechace — desde aquí también puedes Cancelar, Editar o Ver detalles.',
    figmaUrl: `${F}6108-339627`,
  },
];

const DROPSHIPPER_STEPS: Step[] = [
  {
    n: 1,
    title: "Entra al módulo de Negociaciones",
    img: "/tango/ds01_home.png",
    w: 1280, h: 883,
    desc: "Desde el rol Dropshipper, el flujo para responder negociaciones es exactamente el mismo que usaría un líder de comunidad. Desde el Home, ve a Productos > Negociaciones para ver las ofertas que te han enviado los proveedores.",
    figmaUrl: `${F}6041-296529`,
  },
  {
    n: 2,
    title: "Revisa tus negociaciones recibidas",
    img: "/tango/ds02_lista_negociaciones.png",
    w: 1280, h: 883,
    desc: 'En Negociaciones ves todas las ofertas recibidas, con Proveedor, Productos, Comisión y Desempeño. Las que están Pendiente muestran la fecha límite para responder y las opciones Rechazar, Aprobar y Ver detalles; las Rechazadas y Aprobadas solo permiten Cancelar o Ver detalles.',
    highlight: { x: 73.4, y: 55.8, w: 21.9, h: 2.3 },
    figmaUrl: `${F}6041-297932`,
  },
  {
    n: 3,
    title: "Revisa el detalle completo de la negociación",
    img: "/tango/ds05_detalle.png",
    w: 1280, h: 992,
    desc: 'Al hacer clic en "Ver detalles" se abre este modal con toda la información: contraparte, alcance (tipo de negociación), tipo y monto de comisión, fecha, comentario del proveedor, el desempeño de los últimos 90 días y la lista completa de productos incluidos. Desde aquí también puedes Rechazar o Aprobar directamente.',
    highlight: { x: 74.1, y: 80.6, w: 17.8, h: 4.3 },
    figmaUrl: `${F}3571-230879`,
  },
  {
    n: 4,
    title: "Haz clic en «Aprobar»",
    img: "/tango/ds03_confirmar_aprobar.png",
    w: 1280, h: 992,
    desc: 'Al hacer clic en Aprobar aparece esta confirmación: "¿Seguro que deseas aprobar la negociación?" — te recuerda que puedes cancelarla más adelante si es necesario, y que aprobar equivale a aceptar los términos y condiciones. Haz clic en Aprobar para confirmar.',
    highlight: { x: 51, y: 59, w: 14.1, h: 4.4 },
    figmaUrl: `${F}3571-231102`,
  },
  {
    n: 5,
    title: "Alternativa: rechazar la negociación",
    img: "/tango/ds04_modal.png",
    w: 1280, h: 992,
    desc: 'Si en cambio haces clic en Rechazar, se muestra esta advertencia: "Al rechazar la negociación no podrás revertir esta acción". Puedes dejar un comentario opcional para el proveedor antes de confirmar con "Rechazar". Rechazar es distinto de Cancelar: al rechazar, el proveedor recibe la notificación y puede modificar y reenviar una nueva propuesta.',
    warning: true,
    highlight: { x: 50.6, y: 62.5, w: 14.5, h: 4.4 },
    figmaUrl: `${F}3571-231106`,
  },
  {
    n: 6,
    title: "Consulta el historial de la negociación",
    img: "/tango/ds06_detalle2.png",
    w: 1280, h: 992,
    desc: "Desde el mismo modal de Detalles, la pestaña Historial muestra todas las actividades de la negociación en orden: quién la creó, editó, aprobó o rechazó, con fecha, usuario, productos y comisión de cada momento.",
    highlight: { x: 18, y: 18.1, w: 13.3, h: 3 },
    figmaUrl: `${F}3571-231086`,
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

export default function NegociacionesDropshipperPage() {
  const isEmbedded = useIsEmbedded();
  const [tab, setTab] = useState<"proveedor" | "dropshipper">("proveedor");
  const [active, setActive] = useState(0);

  const steps = tab === "proveedor" ? CREAR_PROVEEDOR_STEPS : DROPSHIPPER_STEPS;
  const current = steps[active];

  function switchTab(t: "proveedor" | "dropshipper") {
    setTab(t);
    setActive(0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--card)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      {!isEmbedded && (
      <div style={{
        borderBottom: "1px solid var(--border)", background: "var(--card)",
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ color: DROPI, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>← Hub</a>
        <div style={{ width: 1, height: 16, background: "var(--border)" }} />
        <span style={{ fontSize: 13, color: "var(--muted)" }}>Proyectos</span>
        <div style={{ width: 1, height: 16, background: "var(--border)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Negociaciones Proveedor–Dropshipper — Guía de flujo</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <span style={{
            background: DROPI_LIGHT, color: DROPI,
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
          }}>
            NEG-002
          </span>
          <span style={{
            background: "#F0FDF4", color: "#15803D",
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
          }}>
            Wireframes
          </span>
        </div>
      </div>
      )}

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 260, flexShrink: 0, background: "var(--card)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {(["proveedor", "dropshipper"] as const).map(t => (
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
                {t === "proveedor" ? "Crear — Proveedor" : "Aprobar — Dropshipper"}
              </button>
            ))}
          </div>

          <div style={{ padding: "10px 16px 6px", fontSize: 11, color: "var(--muted)" }}>
            {tab === "proveedor"
              ? "Productos específicos + Comisión Porcentual"
              : "Igual al flujo de Líder de Comunidad"}
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
