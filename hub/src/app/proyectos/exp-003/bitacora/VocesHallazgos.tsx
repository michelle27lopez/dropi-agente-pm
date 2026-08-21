"use client";

import { Alert, Card, Conclusion, Note, Section, StatTable, Tag, TONES, card, type Tone } from "./ui";
import { FINDINGS, IA_COST, NEXT_STEPS, VOCES } from "./data";

export function VocesPanel() {
  return (
    <>
      <Card>
        <div style={{ fontSize: "var(--fs-title)", fontWeight: 700, marginBottom: 6 }}>
          Voces de quienes buscan en Dropi
        </div>
        <p style={{ fontSize: "var(--fs-body)", color: "var(--muted)", lineHeight: "var(--lh-body)", margin: 0 }}>
          Síntesis de entrevistas CSAT de búsqueda (Juan Camilo, Andrea, Mireya, Óscar, Johanny, Thomas, Alexander,
          César, Esteban, Laura). No es métrica: es evidencia cualitativa para leer los números. Fuente: Busquedahallazgos.
        </p>
      </Card>
      {VOCES.map((v) => (
        <div
          key={v.pattern}
          style={{
            ...card,
            borderLeft: "3px solid var(--info)",
            background: "var(--info-tint)",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
            <h4 style={{ fontSize: "var(--fs-body)", fontWeight: 700, margin: 0 }}>{v.pattern}</h4>
            <Tag tone="blue">Evidencia cualitativa</Tag>
          </div>
          <p style={{ fontSize: "var(--fs-body)", color: "var(--fg)", lineHeight: "var(--lh-body)", margin: 0 }}>
            {v.body}
          </p>
        </div>
      ))}
      <Note>
        Entrevistas en Paraguay (5–8 personas) siguen pendientes desde S2. Estas voces son sobre todo de Colombia y no
        sustituyen esa muestra.
      </Note>
    </>
  );
}

export function HallazgosPanel() {
  return (
    <>
      <div
        style={{
          background: "#1d1d1f",
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "var(--fs-label)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            padding: "3px 10px",
            borderRadius: 20,
            marginBottom: 8,
          }}
        >
          En una frase
        </span>
        <p style={{ fontSize: "var(--fs-body)", color: "#fff", lineHeight: "var(--lh-body)", margin: 0 }}>
          Paraguay usa la IA y se queda (~99% adopción, ~65% retención). Quien busca también guarda y escribe: ~79% y
          ~96% en Paraguay. Eso no prueba calidad de resultados (Dropi Cup: 70% cobertura, 21% relevancia). Se pausa la
          promoción de IA; el rumbo es un buscador unificado.
        </p>
      </div>
      {FINDINGS.map((g) => (
        <div key={g.group} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "var(--fs-title)", fontWeight: 800, color: "var(--fg)", marginBottom: 10 }}>
            {g.group}
          </div>
          {g.items.map((it) => (
            <div
              key={it.title}
              style={{
                ...card,
                borderLeft: `3px solid ${TONES[g.tone].fg}`,
                background: TONES[g.tone].bg,
              }}
            >
              <h4 style={{ fontSize: "var(--fs-body)", fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                {it.title}
              </h4>
              <p style={{ fontSize: "var(--fs-body)", color: "var(--fg)", lineHeight: "var(--lh-body)", margin: 0 }}>
                {it.body}
              </p>
            </div>
          ))}
        </div>
      ))}
      <Section title={IA_COST.title} sub={IA_COST.source}>
        <Alert tone="amber" title="No es el costo de cada búsqueda de usuario">
          {IA_COST.caveat}
        </Alert>
        <StatTable
          headers={IA_COST.headers}
          rows={IA_COST.rows.map((r) => ({
            cells: r,
            flag: r[0].startsWith("Total") ? "red" : undefined,
          }))}
        />
      </Section>
      <Conclusion>
        Decidido: no se promociona más la búsqueda con IA; sigue orgánica. Inmediato: encuesta en Paraguay (Laura y
        Catalina), diseño del buscador unificado (Diana) y arquitectura más robusta (José) antes de otros países.
      </Conclusion>
    </>
  );
}

const PRIORITY_TONE: Record<string, Tone> = { alta: "red", media: "blue", baja: "muted" };
const PRIORITY_LABEL: Record<string, string> = { alta: "Alta", media: "Media", baja: "Baja" };

export function SiguePanel() {
  return (
    <>
      <Alert tone="amber" title="Pausa en la promoción activa">
        No se sigue promocionando «Búsqueda con IA». La función opera de forma orgánica en Paraguay mientras se
        priorizan las optimizaciones técnicas.
      </Alert>
      <Alert tone="blue" title="Hacia un buscador unificado">
        A mediano y largo plazo: un solo buscador. La persona no elige entre IA, Clásica e imagen; la experiencia se
        unifica. Diana arranca el diseño de esa interfaz.
      </Alert>
      <Card>
        {NEXT_STEPS.map((s, i) => (
          <div
            key={s.title}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom: i < NEXT_STEPS.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "flex-start",
            }}
          >
            <Tag tone={PRIORITY_TONE[s.priority]}>{PRIORITY_LABEL[s.priority]}</Tag>
            <div>
              <h4 style={{ fontSize: "var(--fs-body)", fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>
                {s.title}
              </h4>
              <p style={{ fontSize: "var(--fs-body)", color: "var(--muted)", lineHeight: "var(--lh-body)", margin: 0 }}>
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
