"use client";

import {
  Alert,
  BarGroup,
  CO,
  Conclusion,
  CoPyTable,
  CountryTag,
  Disclosure,
  FunnelBars,
  Legend,
  MetricBar,
  Note,
  PY,
  Section,
  StatTable,
  TwoCol,
} from "./ui";
import {
  LINEA_BASE,
  QUERY_GLOSSARY,
  S4_COUNTRIES,
  S4_ORDERS,
  S4_QUERIES,
  WEEKS,
  type WeekData,
} from "./data";

function ModeBars({ w }: { w: WeekData }) {
  return (
    <TwoCol>
      <div>
        <CountryTag country="co" />
        <BarGroup title="% de quienes buscan escribiendo">
          {w.modo.map((m) => (
            <MetricBar key={`co-${m.mode}`} label={m.mode} value={`${m.coPct}%`} pct={m.coPct} color={CO} />
          ))}
        </BarGroup>
      </div>
      <div>
        <CountryTag country="py" />
        <BarGroup title="% de quienes buscan escribiendo">
          {[...w.modo].sort((a, b) => b.pyPct - a.pyPct).map((m) => (
            <MetricBar key={`py-${m.mode}`} label={m.mode} value={`${m.pyPct}%`} pct={Math.max(m.pyPct, 0.5)} color={PY} />
          ))}
        </BarGroup>
      </div>
    </TwoCol>
  );
}

function WeekBody({ w }: { w: WeekData }) {
  const open = w.defaultOpen;
  return (
    <>
      {w.alert && (
        <Alert tone={w.alert.tone} title={w.alert.title}>
          {w.alert.body}
        </Alert>
      )}

      <Section title="Base de la semana" sub={w.baseNote}>
        <CoPyTable rows={w.base} />
      </Section>

      <Section
        title="Adopción por modo de búsqueda escrita (estimada)"
        sub="Personas, no clics. Clásica en Colombia e IA en Paraguay son derivadas (total escrita menos los otros modos), porque el default no genera evento propio."
      >
        <CoPyTable
          rows={w.modo.map((m) => ({ label: m.mode, co: m.co, py: m.py }))}
        />
        <div style={{ marginTop: 12 }}>
          <ModeBars w={w} />
        </div>
        <Note>{w.modoNote}</Note>
        <Conclusion tone={w.conclusionTone} label={w.conclusionLabel}>
          {w.conclusion}
        </Conclusion>
      </Section>

      <Disclosure title="Búsqueda por imagen" defaultOpen={open}>
        <CoPyTable rows={w.imagen} />
        <div style={{ marginTop: 12 }}>
          <BarGroup title="% de quienes ya buscan escribiendo">
            <MetricBar label="Colombia" value={w.imagen[1].co} pct={parseFloat(w.imagen[1].co.replace(",", "."))} color={CO} />
            <MetricBar label="Paraguay" value={w.imagen[1].py} pct={parseFloat(w.imagen[1].py.replace(",", "."))} color={PY} />
          </BarGroup>
        </div>
        {w.imagenNote && <Note>{w.imagenNote}</Note>}
      </Disclosure>

      <Disclosure
        title={w.id === "s4" ? "Favoritos y contacto al cliente — cifras corregidas" : "Activación después de buscar"}
        defaultOpen={open}
      >
        {w.activacion.note && <Legend>{w.activacion.note}</Legend>}
        <CoPyTable rows={w.activacion.rows} />
        {w.activacion.banner && (
          <div style={{ marginTop: 12 }}>
            <Alert tone={w.activacion.banner.tone} title={w.activacion.banner.title}>
              {w.activacion.banner.body}
            </Alert>
          </div>
        )}
        {w.activacion.conclusion && (
          <Conclusion tone={w.activacion.conclusion.tone} label={w.activacion.conclusion.label}>
            {w.activacion.conclusion.body}
          </Conclusion>
        )}
      </Disclosure>

      <Disclosure title="Limpieza de búsqueda (evento X)" defaultOpen={open}>
        {w.limpieza.rows ? <CoPyTable rows={w.limpieza.rows} /> : null}
        <Note>{w.limpieza.note}</Note>
      </Disclosure>

      <Disclosure title="Del catálogo a la orden" defaultOpen={open}>
        <Legend>Todos los números son personas, no clics. «Hizo algo» es generación de órdenes o contacto: en Colombia el tablero cuenta el primer pedido; en Paraguay, escribir al cliente.</Legend>
        <TwoCol>
          <FunnelBars country="co" base={w.funnel.coBase} steps={w.funnel.co} color={CO} />
          <FunnelBars country="py" base={w.funnel.pyBase} steps={w.funnel.py} color={PY} />
        </TwoCol>
        {w.funnel.detail && (
          <div style={{ marginTop: 12 }}>
            <CoPyTable rows={w.funnel.detail} />
          </div>
        )}
        {w.funnel.note && <Note>{w.funnel.note}</Note>}
        {w.funnel.conclusion && (
          <Conclusion tone={w.funnel.conclusion.tone}>{w.funnel.conclusion.body}</Conclusion>
        )}
      </Disclosure>

      <Disclosure title="Retención (cohorte de la semana, solo < mes 1)" defaultOpen={open}>
        <Legend>
          El % es quién repitió la acción antes de un mes. El número entre paréntesis es la base de personas de esa semana.
        </Legend>
        <CoPyTable rows={w.retencion.rows} />
        <Conclusion tone={w.retencion.conclusionTone}>{w.retencion.conclusion}</Conclusion>
      </Disclosure>

      {w.id === "s4" && <S4Extras />}
    </>
  );
}

function S4Extras() {
  return (
    <>
      <Section
        title="Qué está buscando la gente (análisis nuevo en S4)"
        sub="Por primera vez se miraron las bases crudas: palabras, cuántas veces se refina y si esa consulta fue la última de la sesión."
      >
        {QUERY_GLOSSARY.map((g) => (
          <div key={g.term} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: "var(--fs-body)", fontWeight: 700 }}>{g.term}. </span>
            <span style={{ fontSize: "var(--fs-body)", color: "var(--muted)", lineHeight: "var(--lh-body)" }}>
              {g.def}
            </span>
          </div>
        ))}
        <StatTable
          headers={["", "Colombia — IA", "Colombia — Clásica", "Paraguay — IA"]}
          rows={S4_QUERIES.rows.map((r) => ({
            cells: [r.label, r.iaCo, r.clasicaCo, r.iaPy],
            flag: r.label.startsWith("%") ? "red" : undefined,
          }))}
        />
        <TwoCol>
          <div>
            <CountryTag country="co" />
            <div style={{ fontSize: "var(--fs-label)", fontWeight: 700, marginBottom: 4 }}>Términos más buscados con IA</div>
            <Note>{S4_QUERIES.termsIaCo}</Note>
          </div>
          <div>
            <CountryTag country="co" />
            <div style={{ fontSize: "var(--fs-label)", fontWeight: 700, marginBottom: 4 }}>Términos más buscados con Clásica</div>
            <Note>{S4_QUERIES.termsClasicaCo}</Note>
          </div>
        </TwoCol>
        <TwoCol>
          <div>
            <CountryTag country="py" />
            <div style={{ fontSize: "var(--fs-label)", fontWeight: 700, marginBottom: 4 }}>Términos IA esta semana</div>
            <Note>{S4_QUERIES.termsIaPy}</Note>
          </div>
          <div>
            <CountryTag country="py" />
            <div style={{ fontSize: "var(--fs-label)", fontWeight: 700, marginBottom: 4 }}>Histórico Clásica (todo el período)</div>
            <Note>{S4_QUERIES.termsClasicaPyHist}</Note>
          </div>
        </TwoCol>
        <Conclusion tone="green" label="Colombia">
          {S4_QUERIES.conclusionCo}
        </Conclusion>
        <Conclusion tone="blue" label="Paraguay">
          {S4_QUERIES.conclusionPy}
        </Conclusion>
      </Section>

      <Section
        title="¿Las búsquedas se están traduciendo en órdenes?"
        sub="Total diario por país, sin desglose por modo. Se excluyeron 23 y 24 jul de los promedios por rezago de datos."
      >
        <StatTable
          headers={["", "Antes (PY)", "Semana 3", "Semana 4"]}
          rows={S4_ORDERS.rows.map((r) => ({ cells: [r.label, r.before, r.s3, r.s4] }))}
        />
        <Conclusion tone="red">{S4_ORDERS.conclusion}</Conclusion>
      </Section>

      <Section
        title="Otros países donde Clásica también es el default"
        sub="Ecuador, Chile y México miden Clásica, IA e ID como eventos independientes (no como modo real derivado). Comparación de proporciones, no de absolutos."
      >
        <StatTable
          headers={["País", "Clásica", "IA", "ID", "Veces que eligen IA más que ID"]}
          rows={S4_COUNTRIES.rows.map((r) => ({
            cells: [r.pais, r.clasica, r.ia, r.id, r.ratio],
          }))}
        />
        <BarGroup title="Adopción de IA (elegida a propósito)">
          <MetricBar label="Colombia" value="10,5%" pct={10.5} color={CO} />
          <MetricBar label="Ecuador" value="21,3%" pct={21.3} color="#8e44ad" />
          <MetricBar label="Chile" value="26,4%" pct={26.4} color="#16a085" />
          <MetricBar label="México" value="23,4%" pct={23.4} color="#d4a017" />
        </BarGroup>
        <Conclusion tone="red">{S4_COUNTRIES.conclusion}</Conclusion>
      </Section>
    </>
  );
}

function LineaBasePanel() {
  const lb = LINEA_BASE;
  return (
    <>
      <Alert tone="muted" title="Qué es esta vista">
        {lb.intro}
      </Alert>
      <Section title="Cuánta gente buscaba, antes y después">
        <StatTable
          headers={lb.volume.headers}
          rows={lb.volume.rows.map((r) => ({ cells: r, flag: r[0].includes("%") ? "red" : undefined }))}
        />
        <BarGroup title="% que busca, de los que entran al catálogo">
          {lb.volumeBars.map((b, i) => (
            <MetricBar
              key={b.label}
              label={b.label}
              value={b.value}
              pct={b.pct}
              color={i === 0 ? "var(--danger)" : i === 4 ? PY : "#FF9E5E"}
            />
          ))}
        </BarGroup>
        <Conclusion tone="green" label="Dato más contundente">
          {lb.volumeConclusion}
        </Conclusion>
      </Section>
      <Section title="Qué modo usaba la gente, antes y después">
        <Legend>Clásica e IA ya existían. Clásica era el default, igual que Colombia hoy. Casi nadie se cambiaba a IA.</Legend>
        <StatTable
          headers={lb.modes.headers}
          rows={lb.modes.rows.map((r) => ({ cells: r }))}
        />
        <Conclusion tone="green" label="Prueba del efecto default">
          {lb.modesConclusion}
        </Conclusion>
      </Section>
      <Section title="Interacción después de buscar — ya corregido">
        <Note>{lb.interactionNote}</Note>
        <StatTable
          headers={lb.interaction.headers}
          rows={lb.interaction.rows.map((r) => ({ cells: r }))}
        />
        <Alert tone="green" title="Bug de tracking confirmado y resuelto en S4">
          {lb.interactionConclusion}
        </Alert>
      </Section>
      <Section title="Retención — antes vs. después">
        <StatTable
          headers={lb.retencion.headers}
          rows={lb.retencion.rows.map((r) => ({ cells: r, flag: "red" }))}
        />
        <Conclusion tone="green">{lb.retencionConclusion}</Conclusion>
      </Section>
    </>
  );
}

export default function WeekPanel({ weekId }: { weekId: "linea-base" | "s1" | "s2" | "s3" | "s4" }) {
  if (weekId === "linea-base") return <LineaBasePanel />;
  const w = WEEKS[weekId];
  return (
    <>
      <div
        style={{
          display: "inline-block",
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: "var(--fs-label)",
          fontWeight: 600,
          marginBottom: 12,
          background: weekId === "s4" ? "var(--success-tint)" : "var(--info-tint)",
          color: weekId === "s4" ? "var(--success)" : "var(--info)",
        }}
      >
        {w.label}
      </div>
      <WeekBody w={w} />
    </>
  );
}
