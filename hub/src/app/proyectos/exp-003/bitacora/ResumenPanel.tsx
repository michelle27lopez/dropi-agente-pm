"use client";

import { ExternalLink } from "lucide-react";
import {
  Alert,
  BarGroup,
  CO,
  Card,
  Conclusion,
  Disclosure,
  FunnelBars,
  KpiGrid,
  Legend,
  MetricBar,
  Note,
  PY,
  Section,
  TONES,
  TwoCol,
} from "./ui";
import {
  BUGS,
  FUNNEL_S4,
  GLOSSARY,
  HOW_IT_WORKS,
  TANGO_URL,
  TIMELINE,
} from "./data";

export default function ResumenPanel() {
  return (
    <>
      <Alert tone="red" title="En Paraguay, 12 personas volvieron a Clásica (0,9%). Sube 2 semanas seguidas. Alarma: 30%.">
        0,4% → 0,7% → 0,9% (S2 → S3 → S4). Sigue lejos de la alarma, pero es la primera vez que la tendencia se sostiene dos semanas. Si sube una tercera vez en S5, investigar a fondo. Reversión = quienes, teniendo IA por defecto, eligen a mano el buscador Clásico.
      </Alert>

      <Alert tone="green" title="Uno de los dos agujeros de tracking se resolvió">
        Favoritos y escribir al cliente en Paraguay estuvieron en 0 / sin registrar en S1–S3. Con la corrección del pipeline: Paraguay 1.023 favoritos y 1.244 mensajes en S4 (S3 recalculado: 1.016 y 1.278). Colombia también estaba subcontado (~2.200 → ~8.940). Sigue pendiente el evento X de limpieza en Colombia.
      </Alert>

      <KpiGrid
        items={[
          { val: "1.291", lbl: "Personas que buscaron escribiendo en Paraguay (S4)", trend: "+2,1%", tone: "green" },
          { val: "17.441", lbl: "Personas que buscaron escribiendo en Colombia (S4)", trend: "−1,1%", tone: "red" },
          { val: "99,1%", lbl: "Adopción IA en Paraguay (es el default)", tone: "blue" },
          { val: "0,9%", lbl: "Reversión a Clásica en Paraguay", trend: "↑ 2ª semana seguida", tone: "red" },
        ]}
      />

      <Disclosure title="Cómo leer esta bitácora" defaultOpen>
        {GLOSSARY.map((g) => (
          <div
            key={g.term}
            style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}
          >
            <div style={{ fontSize: "var(--fs-body)", fontWeight: 700, marginBottom: 4 }}>{g.term}</div>
            <p style={{ fontSize: "var(--fs-body)", color: "var(--muted)", lineHeight: "var(--lh-body)", margin: 0 }}>
              {g.def}
            </p>
          </div>
        ))}
      </Disclosure>

      <Disclosure title="Cómo funciona el buscador (3 modos)">
        {HOW_IT_WORKS.map((m) => (
          <div key={m.mode} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: "var(--fs-body)", fontWeight: 700, marginBottom: 4 }}>{m.mode}</div>
            <p style={{ fontSize: "var(--fs-body)", color: "var(--muted)", lineHeight: "var(--lh-body)", margin: 0 }}>
              {m.body}
            </p>
          </div>
        ))}
        <a
          href={TANGO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            fontSize: "var(--fs-body)",
            fontWeight: 600,
            color: "var(--dropi)",
            minHeight: 44,
          }}
        >
          Recorrido completo del producto en Tango
          <ExternalLink size={14} aria-hidden />
        </a>
      </Disclosure>

      <Section title="Bugs y calidad de datos">
        {BUGS.map((b) => (
          <Alert key={b.title} tone={b.tone} title={b.title}>
            {b.body}
          </Alert>
        ))}
      </Section>

      <Section
        title="Del catálogo a la orden — foto más reciente (S4, 17–24 jul)"
        sub="Personas, no clics. El camino mide generación de órdenes y contacto al cliente."
      >
        <TwoCol>
          <FunnelBars country="co" base={FUNNEL_S4.coBase} steps={FUNNEL_S4.co} color={CO} />
          <FunnelBars country="py" base={FUNNEL_S4.pyBase} steps={FUNNEL_S4.py} color={PY} />
        </TwoCol>
        <Note>
          Qué es «hizo algo»: después de abrir el detalle, la persona guarda favorito, escribe al cliente o genera una orden.
          El tablero no cuenta lo mismo en cada país: Colombia = primer pedido (2,08%); Paraguay = escribir al cliente (5,72%).
          Por eso Paraguay «cierra» más: no es que genere más órdenes. El último paso: Colombia llega a entrega (1,42%); Paraguay, a pedido manual (4,38%).
        </Note>
        <Conclusion>
          Ambos casi estables vs. S3. Paraguay baja un poco el último paso por segunda semana (4,93%→4,38%) y parece frenar.
          No compares esos % como si fueran la misma acción.
        </Conclusion>
      </Section>

      <Section title="Comparación general — Colombia vs Paraguay (S4)">
        <Legend>Adopción por modo: % de quienes buscan escribiendo. Colombia = azul. Paraguay = naranja Dropi.</Legend>
        <TwoCol>
          <div>
            <BarGroup title="Clásica">
              <MetricBar label="Colombia" value="80,4%" pct={80.4} color={CO} />
              <MetricBar label="Paraguay" value="0,9%" pct={0.9} color={PY} />
            </BarGroup>
            <BarGroup title="IA">
              <MetricBar label="Colombia" value="10,5%" pct={10.5} color={CO} />
              <MetricBar label="Paraguay" value="99,1%" pct={99.1} color={PY} />
            </BarGroup>
            <BarGroup title="ID">
              <MetricBar label="Colombia" value="9,1%" pct={9.1} color={CO} />
              <MetricBar label="Paraguay" value="0%" pct={0.5} color={PY} />
            </BarGroup>
          </div>
          <div>
            <BarGroup title="Abrió detalle (S1 vs S4)">
              <MetricBar label="CO S1" value="17,96%" pct={51.6} color="#93C5FD" />
              <MetricBar label="CO S4" value="18,37%" pct={52.8} color={CO} />
              <MetricBar label="PY S1" value="34,81%" pct={100} color="#FF9E5E" />
              <MetricBar label="PY S4" value="29,97%" pct={86.1} color={PY} />
            </BarGroup>
            <BarGroup title="Hizo algo — CO pedido / PY mensaje">
              <MetricBar label="CO S1" value="2,19%" pct={28.5} color="#93C5FD" />
              <MetricBar label="CO S4" value="2,08%" pct={27.1} color={CO} />
              <MetricBar label="PY S1" value="7,26%" pct={94.5} color="#FF9E5E" />
              <MetricBar label="PY S4" value="5,72%" pct={74.5} color={PY} />
            </BarGroup>
          </div>
        </TwoCol>
        <Conclusion>
          En Colombia, Clásica (el default) concentra 80,4%. En Paraguay, ese rol lo cumple IA con 99,1% — estable las 4
          semanas. El camino a la orden en Paraguay se debilitó en S3 y se estabiliza en S4. El detalle está en Comparativo.
        </Conclusion>
      </Section>

      <Section title="Línea de tiempo — S1 → S4">
        <Note>Colombia (control, ~600 mil usuarios) vs. Paraguay (experimental, ~53.734). IA quedó como default en Paraguay el 17 jun 2026.</Note>
        {TIMELINE.map((t) => (
          <div
            key={t.date}
            style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: TONES[t.tone].fg,
                flexShrink: 0,
                marginTop: 5,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "var(--fs-label)",
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 2,
                }}
              >
                {t.date}
              </div>
              <div style={{ fontSize: "var(--fs-body)", color: "var(--fg)", lineHeight: "var(--lh-body)" }}>{t.text}</div>
            </div>
          </div>
        ))}
      </Section>

      <Card>
        <div style={{ fontSize: "var(--fs-title)", fontWeight: 700, marginBottom: 8 }}>Nota metodológica</div>
        <p style={{ fontSize: "var(--fs-body)", color: "var(--muted)", lineHeight: "var(--lh-body)", margin: 0 }}>
          Colombia (Clásica = default): Clásica real ≈ búsqueda escrita total − IA − ID. Paraguay (IA = default): IA real ≈
          búsqueda escrita total − Clásica − ID. Los volúmenes absolutos de CO y PY no son comparables (~14–17×); el
          análisis se centra en tasas y proporciones. Actualizado: 24 jul 2026.
        </p>
      </Card>
    </>
  );
}
