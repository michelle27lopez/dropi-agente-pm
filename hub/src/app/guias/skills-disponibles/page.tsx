"use client";

import { useMemo, useState } from "react";
import HubFooter from "@/components/HubFooter";

type Skill = {
  slug: string;
  title: string;
  when: string;
};

type Category = {
  icon: string;
  label: string;
  note?: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    icon: "🧬",
    label: "Skills de Darwin (específicas de este repo)",
    note: "Solo funcionan dentro de dropi-agente-pm — dependen del Hub, Supabase o el Jira de este equipo.",
    skills: [
      { slug: "impeccable", title: "impeccable", when: "Diseñar, rediseñar, auditar o pulir cualquier interfaz frontend — desde un componente hasta un flujo completo. Cubre jerarquía visual, accesibilidad, copy, responsive, animación y sistemas de diseño reutilizables." },
      { slug: "sprint-checklist", title: "sprint-checklist", when: "Traer o crear el checklist de documentación de una tarea del sprint cuando cuentas avance, empiezas o terminas algo del preplanning." },
      { slug: "sprint-reuniones", title: "sprint-reuniones", when: "Calcular tus horas reales de reuniones del sprint y actualizar la tarea \"[PRODUCTO] Reuniones\" en Jira." },
      { slug: "sync-diario", title: "sync-diario", when: "Al empezar el día o antes de seguir trabajando, para traer al día tu rama local con lo último de main sin perder trabajo ni forzar push." },
      { slug: "bug-jira", title: "bug-jira", when: "Publicar un bug o hallazgo directo a Jira con el formato y campos correctos del proyecto PROD." },
      { slug: "ds-sync", title: "ds-sync", when: "Aplicar o actualizar el Design System real de Dropi (tokens de ds-registry) en un proyecto del hub o en un repo nuevo — trae los tokens en vivo, no una copia fija." },
    ],
  },
  {
    icon: "🎨",
    label: "Diseño visual & craft de UI",
    skills: [
      { slug: "craft", title: "craft", when: "Pulir un componente o pantalla ya construida — banea gradientes/glow genéricos y fuerza disciplina de spacing, tipografía, estados y elevación. Úsala para que algo deje de \"verse generado por IA\"." },
      { slug: "refactoring-ui", title: "refactoring-ui", when: "Mejorar jerarquía visual, contraste y detalles de una UI existente cuando algo se ve plano o desordenado." },
      { slug: "minimalist-ui", title: "minimalist-ui", when: "Diseñar interfaces limpias y con poco ruido visual, cuando el reto es \"quitar\", no \"agregar\"." },
      { slug: "web-typography", title: "web-typography", when: "Definir escalas tipográficas, pares de fuentes o jerarquía de texto para web." },
      { slug: "ios-hig-design", title: "ios-hig-design", when: "Diseñar para iOS siguiendo las Human Interface Guidelines de Apple." },
      { slug: "high-end-visual-design", title: "high-end-visual-design", when: "Cuando un diseño necesita sentirse \"premium\" — define fuentes, spacing, sombras y estructura de cards de agencia de alta gama." },
      { slug: "industrial-brutalist-ui", title: "industrial-brutalist-ui", when: "Explorar una dirección visual brutalista/industrial como alternativa estética deliberada." },
    ],
  },
  {
    icon: "✨",
    label: "Motion & microinteracciones",
    skills: [
      { slug: "ui-animation", title: "ui-animation", when: "Diseñar, revisar o depurar animaciones de UI: transiciones CSS, keyframes, springs, gestos, o para replicar la curva de animación de un video de referencia." },
      { slug: "web-animation-design", title: "web-animation-design", when: "Decidir qué easing, duración o tipo de animación usar para un elemento específico (hover, modal, drawer, entrada/salida)." },
      { slug: "microinteractions", title: "microinteractions", when: "Diseñar el detalle de trigger → regla → feedback de botones, toggles, loaders o validaciones — cuando la interfaz se siente \"muerta\" y necesita responder mejor." },
    ],
  },
  {
    icon: "🔍",
    label: "Research & Discovery",
    skills: [
      { slug: "ux-research-methods", title: "ux-research-methods", when: "No sabes qué método de investigación usar para una pregunta — te ayuda a elegir entre entrevistas, tests de usabilidad, encuestas, A/B, etc." },
      { slug: "mom-test", title: "mom-test", when: "Preparar preguntas de entrevista con usuarios que no induzcan respuestas complacientes." },
      { slug: "jobs-to-be-done", title: "jobs-to-be-done", when: "Entender por qué un usuario \"contrata\" tu producto — útil antes de definir una nueva feature o segmento." },
      { slug: "continuous-discovery", title: "continuous-discovery", when: "Montar un ritmo semanal de contacto con usuarios (opportunity solution tree, assumption mapping) conectado al roadmap." },
      { slug: "journey-mapping", title: "journey-mapping", when: "Mapear el recorrido completo de un usuario a través de un flujo o ciclo de vida." },
      { slug: "empathy-mapping", title: "empathy-mapping", when: "Sintetizar research cualitativo en lo que el usuario dice/piensa/hace/siente." },
      { slug: "ux-personas", title: "ux-personas", when: "Crear o revisar personas basadas en research real — nunca inventar citas o hallazgos de relleno." },
      { slug: "ux-storyboard", title: "ux-storyboard", when: "Ilustrar un escenario de uso paso a paso para comunicarlo a un equipo no técnico." },
      { slug: "design-sprint", title: "design-sprint", when: "Planear un sprint de diseño de 5 días con un equipo multidisciplinario." },
      { slug: "double-diamond", title: "double-diamond", when: "Estructurar un proceso de diseño completo en las 4 fases: descubrir, definir, desarrollar, entregar." },
    ],
  },
  {
    icon: "♿",
    label: "Auditoría & revisión UX",
    skills: [
      { slug: "accessibility", title: "accessibility", when: "Auditar un mockup o flujo contra WCAG 2.1 — contraste, teclado, lectores de pantalla, formularios accesibles." },
      { slug: "ux-heuristics", title: "ux-heuristics", when: "Evaluar usabilidad con los 10 heurísticos de Nielsen o las leyes de Krug — navegación confusa, formularios con baja conversión." },
      { slug: "cognitive-load-conversion", title: "cognitive-load-conversion", when: "Auditar por qué un flujo, formulario u onboarding no convierte, aunque no lo menciones explícitamente." },
      { slug: "cro-methodology", title: "cro-methodology", when: "Auditoría enfocada en conversión con metodología CRO." },
      { slug: "persuasive-ux", title: "persuasive-ux", when: "Mejorar engagement o completación de un flujo aplicando los 7 principios de Captology de BJ Fogg." },
      { slug: "general-design-review", title: "general-design-review", when: "Review compacto que combina varias skills de UX en una sola pasada — para cuando quieres una mirada general rápida en vez de un framework específico." },
    ],
  },
  {
    icon: "🤖",
    label: "Diseño de features con IA",
    note: "Para cualquier feature donde el producto usa IA — TTV, activación asistida, sugerencias, etc.",
    skills: [
      { slug: "ai-governors", title: "ai-governors", when: "Diseñar controles de human-in-the-loop: cómo mantener al usuario informado, en control y seguro cuando la IA actúa de forma autónoma." },
      { slug: "ai-identifiers", title: "ai-identifiers", when: "Definir cómo se ve, se llama y se comporta una feature de IA en el producto — color, ícono, nombre, personalidad." },
      { slug: "ai-inputs", title: "ai-inputs", when: "Diseñar cómo el usuario le da instrucciones a una feature de IA (prompt, botón de regenerar, acciones inline)." },
      { slug: "ai-trust-builders", title: "ai-trust-builders", when: "Hacer que una feature de IA se sienta confiable: disclaimers, consentimiento, disclosure, marcas de contenido generado." },
      { slug: "ai-tuners", title: "ai-tuners", when: "Diseñar los controles que dejan al usuario ajustar cómo la IA interpreta o genera algo (tono, filtros, modos, parámetros)." },
      { slug: "ai-wayfinders", title: "ai-wayfinders", when: "Ayudar al usuario a entender qué puede pedirle a la IA y por dónde empezar." },
    ],
  },
  {
    icon: "🧭",
    label: "Estrategia & priorización de producto",
    skills: [
      { slug: "lean-ux", title: "lean-ux", when: "Diseñar con ciclos rápidos de hipótesis → prototipo → validación, en vez de especificación completa por adelantado." },
      { slug: "lean-startup", title: "lean-startup", when: "Validar una idea de producto nueva con el mínimo esfuerzo antes de construirla completa." },
      { slug: "feature-prioritization", title: "feature-prioritization", when: "Decidir qué construir primero cuando hay varias features candidatas y recursos limitados." },
      { slug: "blue-ocean-strategy", title: "blue-ocean-strategy", when: "Explorar una propuesta de valor que no compita cabeza a cabeza con lo ya existente." },
      { slug: "obviously-awesome", title: "obviously-awesome", when: "Definir el posicionamiento de un producto o feature — a qué categoría pertenece y por qué gana." },
      { slug: "hooked-ux", title: "hooked-ux", when: "Diseñar loops de hábito (trigger → acción → recompensa → inversión) cuando los usuarios no vuelven solos." },
      { slug: "improve-retention", title: "improve-retention", when: "Reducir fricción para mejorar retención usando el modelo B=MAP (comportamiento = motivación + habilidad + prompt)." },
    ],
  },
  {
    icon: "✍️",
    label: "Copy & mensajes",
    skills: [
      { slug: "ux-writing", title: "ux-writing", when: "Escribir o revisar cualquier texto de interfaz: botones, errores, notificaciones, formularios, estados vacíos." },
      { slug: "storybrand-messaging", title: "storybrand-messaging", when: "Estructurar el mensaje de una landing, pitch o lanzamiento con el framework StoryBrand." },
    ],
  },
  {
    icon: "📊",
    label: "Data & artifacts",
    skills: [
      { slug: "dataviz", title: "dataviz", when: "Antes de crear cualquier chart, gráfico o dashboard — define paleta, tipo de gráfico y reglas de accesibilidad para que se vea como un sistema, no una serie de gráficos sueltos." },
      { slug: "artifact-design", title: "artifact-design", when: "Se carga automáticamente al publicar un Artifact — calibra cuánto esfuerzo de diseño amerita esa página." },
    ],
  },
];

export default function SkillsDisponiblesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter(
          (s) =>
            s.slug.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            s.when.toLowerCase().includes(q) ||
            cat.label.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [query]);

  const totalMatches = filtered.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)",
          padding: "20px 32px", display: "flex", flexDirection: "column", gap: 10,
        }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                🧩 Directorio de Skills
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                <a href="/guias" style={{ color: "var(--muted)" }}>Guías</a> · Qué skills hay y cuándo usar cada una
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>
            Una skill se activa escribiendo <code>/nombre-de-la-skill</code> en el chat, o simplemente
            describiendo lo que necesitas — Claude la reconoce por contexto y la carga sola. Esta lista está
            curada para el trabajo de un PD en Darwin; no incluye skills internas de desarrollo de software
            (las que empiezan con <code>gsd-</code>) ni las de otros verticales (video, negociación, etc.).
          </p>

          <div style={{ position: "relative", marginTop: 24 }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 14, color: "var(--muted)", pointerEvents: "none",
            }}>
              🔎
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o para qué sirve… (ej. accesibilidad, jira, animación)"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "12px 14px 12px 38px",
                borderRadius: 10, border: "1px solid var(--border)",
                background: "var(--card)", color: "var(--fg)",
                fontSize: 14, outline: "none",
              }}
            />
          </div>
          {query.trim() && (
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, marginBottom: 0 }}>
              {totalMatches === 0
                ? "Sin resultados. Prueba con otra palabra."
                : `${totalMatches} skill${totalMatches === 1 ? "" : "s"} encontrada${totalMatches === 1 ? "" : "s"}.`}
            </p>
          )}

          <div style={{
            display: "flex", gap: 10, padding: "13px 15px", borderRadius: 10, marginTop: 20, marginBottom: 32,
            background: "#FFF7ED", border: "1px solid #FED7AA",
          }}>
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>🧭</span>
            <p style={{ margin: 0, fontSize: 13.5, color: "#C2410C", lineHeight: 1.6 }}>
              Este directorio se actualiza a mano. Si instalas o quitas una skill que el equipo debería
              conocer, avisa para actualizar esta página — no se sincroniza sola.
            </p>
          </div>

          {filtered.map((cat) => (
            <section key={cat.label} style={{ marginTop: 40 }}>
              <h2 style={{
                fontSize: 13, fontWeight: 700, letterSpacing: "0.03em",
                color: "var(--fg)", display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
              }}>
                <span style={{ fontSize: 16 }}>{cat.icon}</span> {cat.label}
              </h2>
              {cat.note && (
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 0, marginBottom: 14 }}>{cat.note}</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: cat.note ? 0 : 14 }}>
                {cat.skills.map((s) => (
                  <div
                    key={s.slug}
                    className="hub-card"
                    style={{
                      display: "flex", flexDirection: "column", gap: 4,
                      background: "var(--card)", border: "1px solid var(--border)",
                      borderRadius: 12, padding: "14px 16px",
                    }}
                  >
                    <code style={{
                      fontSize: 12.5, fontWeight: 700, color: "var(--dropi)",
                      fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                    }}>
                      /{s.slug}
                    </code>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{s.when}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginTop: 48 }}>
              No encontramos ninguna skill que coincida con &quot;{query}&quot;.
            </p>
          )}
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
