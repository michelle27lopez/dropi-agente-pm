"use client";

import { SectionCard, H1, H2, P, Fuente, Vacio, Callout, Tabla, Td, Tag } from "../_components/ui";

const NO_DOC = "No documentado";

// ── Blueprint general · las 5 macro-etapas ya inventariadas en Funcionalidades
// (supplier-success-graph-v4.json), leídas aquí desde la perspectiva de servicio.
const ETAPAS = [
  { key: "entrar", nombre: "Entrar y quedar operativo", color: "var(--info)" },
  { key: "catalogo", nombre: "Construir catálogo", color: "var(--dropi)" },
  { key: "vender", nombre: "Vender y negociar", color: "#8B5CF6" },
  { key: "operar", nombre: "Operar el día a día", color: "var(--success)" },
  { key: "crecer", nombre: "Crecer", color: "var(--warning)" },
];

const FILAS: { dimension: string; valores: string[] }[] = [
  {
    dimension: "Qué hace el proveedor",
    valores: [
      "Registro, diagnóstico inicial, completar datos, crear bodega, validación externa",
      "Crear/editar producto, cargar imágenes, configurar garantías, actualizar stock, crear combo, publicar",
      "Negociar descuentos con dropshippers, proponer y aprobar combos",
      "Gestionar órdenes, generar guías, despachar, resolver novedades",
      "Medir su desempeño, escalar de nivel",
    ],
  },
  {
    dimension: "Quién más interviene",
    valores: [
      "GoHighLevel automatiza la bienvenida; quién revisa la validación externa no está documentado",
      "Sistema automático de 3 validaciones duras (stock ≥100, ≥3 imágenes, 3 garantías)",
      "El dropshipper, como contraparte directa — sin comercial de Dropi documentado en esta etapa",
      "La transportadora; soporte (CAS) solo si el proveedor abre un caso",
      "Kevin Castro (comercial), solo para el descenso y de forma manual; quién audita el ascenso no está documentado",
    ],
  },
  {
    dimension: "Sistema principal",
    valores: ["GoHighLevel + Supabase", "Plataforma Dropi", "Plataforma Dropi (Negociaciones / Combos)", "Plataforma Dropi + Ecom Scanner", "Panel de ascensos (Supabase)"],
  },
  {
    dimension: "Canal de contacto",
    valores: ["WhatsApp (bienvenida) + correo", NO_DOC + " — sin canal humano registrado", NO_DOC + " — sin canal humano registrado", "In-app + WhatsApp (Chatea Pro, confirmación de pedido)", NO_DOC],
  },
  {
    dimension: "Bandera roja conocida",
    valores: [
      "«Datos de la empresa» pierde gente sin causa registrada; pasa a «En frío» si no responde al seguimiento hacia el día 20",
      NO_DOC,
      NO_DOC,
      NO_DOC + " — el CAS mide esfuerzo puntual, no es una señal de riesgo formal",
      NO_DOC + " — el descenso se detecta después de ocurrido, no antes",
    ],
  },
  {
    dimension: "Experiencia medida (CSAT/CES)",
    valores: [
      "Sin medición directa; solo activación bruta/neta como proxy",
      "Sin medición",
      "CES de Caza Productos (proyecto de pipeline aparte, no cubre Negociaciones ni Combos)",
      "CES de CAS (qué tan fácil fue tomar un caso de soporte)",
      "Sin medición",
    ],
  },
];

export default function BlueprintPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Mapa de servicio del uso completo de la plataforma, no solo del onboarding">
          Blueprint general
        </H1>

        <P>
          El único blueprint detallado que existe hoy es el de <a href="/guias/proveedores/onboarding" style={{ color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>Onboarding</a>,
          en 10 pasos con evidencia real paso a paso. Este es el intento de extenderlo a todo el ciclo de
          vida, usando como columnas las 5 macro-etapas ya inventariadas en Funcionalidades. La mayoría de
          las filas nuevas que pediste — banderas rojas, canales, quién interviene — están marcadas como no
          documentadas donde de verdad no hay evidencia. No se rellenan para que se vea completo.
        </P>

        <Callout icon="🧭" color="var(--warning)">
          Léelo como un mapa de qué investigar, no como un blueprint terminado. De las 5 etapas posteriores
          al registro, solo Onboarding tiene experiencia medida y banderas rojas reales. El resto de la vida
          del proveedor en la plataforma —construir catálogo, negociar, operar, crecer— no tiene ninguna
          señal de riesgo ni medición de experiencia documentada todavía.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Las 5 etapas</H2>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {ETAPAS.map((e) => (
            <Tag key={e.key} color={e.color}>{e.nombre}</Tag>
          ))}
        </div>

        <Tabla min={1200} head={["", ...ETAPAS.map((e) => e.nombre)]}>
          {FILAS.map((f) => (
            <tr key={f.dimension}>
              <Td bold>{f.dimension}</Td>
              {f.valores.map((v, i) => (
                <Td key={ETAPAS[i].key} color={v.startsWith(NO_DOC) ? "var(--danger)" : undefined}>
                  {v}
                </Td>
              ))}
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="Etapas: supplier-success-graph-v4.json (mismo inventario de Funcionalidades). Filas nuevas: síntesis propia sobre hub/src/app/proveedores/onboarding, /perfil, /satisfaccion y /herramientas — sin research nuevo levantado para este blueprint"
          corte="ago-2026"
        />
      </SectionCard>

      <SectionCard>
        <H2>Dónde entra comercial</H2>
        <P>
          Lo único con timing documentado es el onboarding: seguimiento comercial automatizado en los días
          0, 3, 7, 14 y 20 vía GoHighLevel/WhatsApp, y si no hay respuesta el proveedor pasa a «En frío». Los
          comerciales reales del vertical Proveedores son <strong>Emerson Días</strong> y <strong>Kevin
          Castro</strong> — no Carol Cortés, Vanessa ni Mayra Ramírez, que son comercial del vertical Marcas
          y no deben mezclarse aquí.
        </P>
        <P>
          Fuera de ese seguimiento inicial y del descenso manual que ejecuta Kevin Castro, no hay ningún otro
          punto del ciclo de vida con criterio escrito de cuándo interviene comercial. El propio blueprint de
          onboarding ya lo dice de forma textual: no hay nada escrito sobre quién toma a un proveedor recién
          registrado ni bajo qué criterio, más allá de la secuencia automatizada.
        </P>
        <Fuente origen="hub/src/app/proveedores/onboarding · pipeline GoHighLevel de 11 etapas y sección «Lo que sigue sin saberse»; hub/src/app/proveedores/perfil · proceso de descenso" corte="ago-2026" />
      </SectionCard>

      <SectionCard>
        <H2>Lo que sigue sin saberse</H2>

        <Vacio
          pregunta="¿Existen banderas rojas o señales tempranas de riesgo para el proveedor?"
          dueno="Sin dueño asignado"
          detalle="No existen formalizadas. Solo hay proxies sueltos: pasar a «En frío» en el pipeline de onboarding, y los motivos de descenso de nivel (que se evalúan después de que el proveedor ya incumplió, no antes). El vertical Marcas sí tiene señales de riesgo tipo Pareto 360/RB-005 — no aplican aquí, son de otro rol y otro equipo comercial."
        />

        <Vacio
          pregunta="¿Qué experiencia tiene el proveedor construyendo catálogo, negociando y operando el día a día?"
          dueno="Michelle López (UX)"
          detalle="Las únicas mediciones de esfuerzo/satisfacción que existen (CAS y Caza Productos, ver Satisfacción) cubren dos momentos puntuales. Construir catálogo, negociar con dropshippers y operar despachos no tienen ninguna encuesta ni entrevista asociada."
        />

        <Vacio
          pregunta="¿Qué canales usa Dropi para hablar con el proveedor fuera del onboarding y de Chatea Pro?"
          dueno="Sin dueño asignado"
          detalle="Confirmados solo WhatsApp e in-app. No hay evidencia de llamada telefónica o email como canal formal continuo del ciclo de vida — puede que exista y no esté documentado, o puede que simplemente no exista."
        />
      </SectionCard>
    </>
  );
}
