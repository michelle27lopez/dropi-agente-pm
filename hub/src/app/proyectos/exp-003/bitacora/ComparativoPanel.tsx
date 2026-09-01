"use client";

import {
  Alert,
  BarGroup,
  CO,
  Conclusion,
  CountryTag,
  Legend,
  MetricBar,
  Note,
  PY,
  Section,
  StatTable,
  TwoCol,
} from "./ui";
import {
  COMPARATIVO_SUMMARY,
  EVENT_X,
  EVENTS_VS_USERS,
  FAV_CONTACT_PCT,
  FILTER_PCT,
  REVERSION_FUNNEL,
  REVERSION_SERIES,
} from "./data";

export default function ComparativoPanel() {
  return (
    <>
      <Legend>
        Mira también Semanas → Línea base para Paraguay contra la semana previa al lanzamiento (5–12 jun).
      </Legend>

      <Section
        title="Volumen y quién busca (personas)"
        sub="Cada país se escala a su propio máximo. Colombia y Paraguay no son comparables en volumen absoluto (~14–20×)."
      >
        <TwoCol>
          <div>
            <CountryTag country="co" />
            <BarGroup title="Catálogo">
              <MetricBar label="S1" value="24.045" pct={93.5} color="#93C5FD" />
              <MetricBar label="S2" value="24.547" pct={95.4} color={CO} />
              <MetricBar label="S3" value="25.718" pct={100} color="#1D4ED8" />
              <MetricBar label="S4" value="25.441 ↓" pct={98.9} color="#1E3A8A" />
            </BarGroup>
            <BarGroup title="Búsqueda escrita">
              <MetricBar label="S1" value="16.490" pct={93.5} color="#93C5FD" />
              <MetricBar label="S2" value="16.925" pct={95.9} color={CO} />
              <MetricBar label="S3" value="17.637" pct={100} color="#1D4ED8" />
              <MetricBar label="S4" value="17.441" pct={98.9} color="#1E3A8A" />
            </BarGroup>
          </div>
          <div>
            <CountryTag country="py" />
            <BarGroup title="Catálogo">
              <MetricBar label="S1" value="1.696" pct={72.8} color="#FF9E5E" />
              <MetricBar label="S2" value="1.822" pct={78.2} color={PY} />
              <MetricBar label="S3" value="2.330 ↑" pct={100} color="#c2410c" />
              <MetricBar label="S4" value="2.122 ↓" pct={91.1} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="Búsqueda escrita">
              <MetricBar label="S1" value="962" pct={74.5} color="#FF9E5E" />
              <MetricBar label="S2" value="1.055" pct={81.6} color={PY} />
              <MetricBar label="S3" value="1.265" pct={98} color="#c2410c" />
              <MetricBar label="S4" value="1.291" pct={100} color="#7c2d12" />
            </BarGroup>
          </div>
        </TwoCol>
        <Conclusion>
          Primera semana en que ningún país crece: Colombia plano (−1,1%) y Paraguay cae en catálogo (−8,9%), pero sube en
          búsqueda (+2,1%) y en % que busca (54,3%→60,8%). La caída parece tráfico sin intención de buscar.
        </Conclusion>
      </Section>

      <Section title="Adopción por modo — % de quienes buscan escribiendo">
        <TwoCol>
          <div>
            <CountryTag country="co" />
            <BarGroup title="Clásica (default)">
              <MetricBar label="S1" value="79,8%" pct={79.8} color="#93C5FD" />
              <MetricBar label="S2" value="79,4%" pct={79.4} color={CO} />
              <MetricBar label="S3" value="80,6%" pct={80.6} color="#1D4ED8" />
              <MetricBar label="S4" value="80,4%" pct={80.4} color="#1E3A8A" />
            </BarGroup>
            <BarGroup title="IA">
              <MetricBar label="S1" value="10,5%" pct={10.5} color="#93C5FD" />
              <MetricBar label="S2" value="10,9%" pct={10.9} color={CO} />
              <MetricBar label="S3" value="10,4%" pct={10.4} color="#1D4ED8" />
              <MetricBar label="S4" value="10,5%" pct={10.5} color="#1E3A8A" />
            </BarGroup>
            <BarGroup title="ID">
              <MetricBar label="S1" value="9,7%" pct={9.7} color="#93C5FD" />
              <MetricBar label="S2" value="9,8%" pct={9.8} color={CO} />
              <MetricBar label="S3" value="8,9%" pct={8.9} color="#1D4ED8" />
              <MetricBar label="S4" value="9,1%" pct={9.1} color="#1E3A8A" />
            </BarGroup>
          </div>
          <div>
            <CountryTag country="py" />
            <BarGroup title="IA (default)">
              <MetricBar label="S1" value="98,8%" pct={98.8} color="#FF9E5E" />
              <MetricBar label="S2" value="99,3%" pct={99.3} color={PY} />
              <MetricBar label="S3" value="99,2%" pct={99.2} color="#c2410c" />
              <MetricBar label="S4" value="99,1%" pct={99.1} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="Clásica (reversión manual)">
              <MetricBar label="S1" value="1,0%" pct={1.0} color="#FF9E5E" />
              <MetricBar label="S2" value="0,4%" pct={0.4} color={PY} />
              <MetricBar label="S3" value="0,7%" pct={0.7} color="#c2410c" />
              <MetricBar label="S4" value="0,9% ↑" pct={0.9} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="ID">
              <MetricBar label="S1" value="0,2%" pct={0.5} color="#FF9E5E" />
              <MetricBar label="S2" value="0,3%" pct={0.5} color={PY} />
              <MetricBar label="S3" value="0,1%" pct={0.5} color="#c2410c" />
              <MetricBar label="S4" value="0%" pct={0.5} color="#7c2d12" />
            </BarGroup>
          </div>
        </TwoCol>
        <Conclusion tone="green">
          Distribución estable las cuatro semanas. Lo que llama la atención: la reversión a Clásica en Paraguay ya subió
          dos semanas (0,4%→0,7%→0,9%, de 4 a 12 personas).
        </Conclusion>
      </Section>

      <Section
        title="Del catálogo a la orden"
        sub="El camino mide generación de órdenes y contacto al cliente. El dibujo de 5 pasos es el mismo; el paso 4 no mide lo mismo. Colombia = primer pedido. Paraguay = escribir al cliente. Por eso Paraguay «cierra» más: no es que genere más órdenes."
      >
        <BarGroup title="Abrió el detalle del producto">
          <MetricBar label="CO S1" value="17,96%" pct={51.6} color="#93C5FD" />
          <MetricBar label="CO S2" value="17,92%" pct={51.5} color={CO} />
          <MetricBar label="CO S3" value="18,42%" pct={52.9} color="#1D4ED8" />
          <MetricBar label="CO S4" value="18,37%" pct={52.8} color="#1E3A8A" />
          <MetricBar label="PY S1" value="34,81%" pct={100} color="#FF9E5E" />
          <MetricBar label="PY S2" value="34,06%" pct={97.8} color={PY} />
          <MetricBar label="PY S3" value="30,43% ↓" pct={87.4} color="#c2410c" />
          <MetricBar label="PY S4" value="29,97%" pct={86.1} color="#7c2d12" />
        </BarGroup>
        <BarGroup title="Hizo algo — Colombia: primer pedido · Paraguay: escribió al cliente">
          <MetricBar label="CO S1" value="2,19%" pct={28.5} color="#93C5FD" />
          <MetricBar label="CO S2" value="2,31%" pct={30.1} color={CO} />
          <MetricBar label="CO S3" value="2,12%" pct={27.6} color="#1D4ED8" />
          <MetricBar label="CO S4" value="2,08%" pct={27.1} color="#1E3A8A" />
          <MetricBar label="PY S1" value="7,26%" pct={94.5} color="#FF9E5E" />
          <MetricBar label="PY S2" value="7,68%" pct={100} color={PY} />
          <MetricBar label="PY S3" value="5,89% ↓" pct={76.7} color="#c2410c" />
          <MetricBar label="PY S4" value="5,72%" pct={74.5} color="#7c2d12" />
        </BarGroup>
        <BarGroup title="Llegó al final — Colombia: entrega · Paraguay: pedido manual">
          <MetricBar label="CO S1" value="1,67%" pct={25.5} color="#93C5FD" />
          <MetricBar label="CO S2" value="1,73%" pct={26.5} color={CO} />
          <MetricBar label="CO S3" value="1,60%" pct={24.5} color="#1D4ED8" />
          <MetricBar label="CO S4" value="1,42% ↓" pct={21.7} color="#1E3A8A" />
          <MetricBar label="PY S1" value="4,99%" pct={76.3} color="#FF9E5E" />
          <MetricBar label="PY S2" value="6,54%" pct={100} color={PY} />
          <MetricBar label="PY S3" value="4,93% ↓" pct={75.4} color="#c2410c" />
          <MetricBar label="PY S4" value="4,38% ↓" pct={67} color="#7c2d12" />
        </BarGroup>
        <Conclusion>
          Misma foto, métricas distintas en el cierre. Paraguay se debilitó en S3 (ola de gente nueva) y en S4 la caída es menor (5,72% y 4,38%). Colombia plano en detalle (≈18%) y baja un poco al final (1,60%→1,42%). No leas «PY genera más órdenes»: ahí el paso 4 es un mensaje.
        </Conclusion>
      </Section>

      <Section title="Retención < mes 1 por modo — S1 → S4">
        <TwoCol>
          <div>
            <CountryTag country="co" />
            <BarGroup title="Búsqueda escrita">
              <MetricBar label="S1" value="72,0%" pct={72} color="#93C5FD" />
              <MetricBar label="S2" value="77,5%" pct={77.5} color={CO} />
              <MetricBar label="S3" value="75,1%" pct={75.1} color="#1D4ED8" />
              <MetricBar label="S4" value="76,5% ↑" pct={76.5} color="#1E3A8A" />
            </BarGroup>
            <BarGroup title="Imagen">
              <MetricBar label="S1" value="47,6%" pct={47.6} color="#93C5FD" />
              <MetricBar label="S2" value="56,3%" pct={56.3} color={CO} />
              <MetricBar label="S3" value="53,9%" pct={53.9} color="#1D4ED8" />
              <MetricBar label="S4" value="54,6%" pct={54.6} color="#1E3A8A" />
            </BarGroup>
            <BarGroup title="Clásica vs IA">
              <MetricBar label="Clásica S4" value="82,4%" pct={82.4} color={CO} />
              <MetricBar label="IA S4" value="53,2%" pct={53.2} color="#1D4ED8" />
              <MetricBar label="ID S4" value="51,0%" pct={51} color="#93C5FD" />
            </BarGroup>
          </div>
          <div>
            <CountryTag country="py" />
            <BarGroup title="Búsqueda escrita">
              <MetricBar label="S1" value="57,3%" pct={57.3} color="#FF9E5E" />
              <MetricBar label="S2" value="64,3%" pct={64.3} color={PY} />
              <MetricBar label="S3" value="64,7%" pct={64.7} color="#c2410c" />
              <MetricBar label="S4" value="64,4%" pct={64.4} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="Imagen">
              <MetricBar label="S1" value="34,5%" pct={34.5} color="#FF9E5E" />
              <MetricBar label="S2" value="33,3%" pct={33.3} color={PY} />
              <MetricBar label="S3" value="34,1%" pct={34.1} color="#c2410c" />
              <MetricBar label="S4" value="39,1% ↑" pct={39.1} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="IA (default, base robusta)">
              <MetricBar label="S1" value="57,9%" pct={57.9} color="#FF9E5E" />
              <MetricBar label="S2" value="64,7%" pct={64.7} color={PY} />
              <MetricBar label="S3" value="64,8%" pct={64.8} color="#c2410c" />
              <MetricBar label="S4" value="64,9%" pct={64.9} color="#7c2d12" />
            </BarGroup>
          </div>
        </TwoCol>
        <Conclusion tone="green">
          Colombia se recupera en S4. Clásica sigue siendo, cuatro semanas, el modo que mejor retiene ahí (82,4% vs IA
          53,2%). En Paraguay, imagen da su salto más fuerte (+5 puntos) la misma semana que el catálogo cayó. IA ~65%
          estable. Clásica e ID en PY no tienen base suficiente (0–12 personas).
        </Conclusion>
      </Section>

      <Section title="La métrica a vigilar: reversión a Clásica en Paraguay">
        <p style={{ fontSize: "var(--fs-body)", color: "var(--fg)", lineHeight: "var(--lh-body)", marginBottom: 12 }}>
          Es el % de quienes, teniendo IA por defecto, vuelven a mano al buscador Clásico. Nadie cambia de modo por
          accidente. El plan fijó <strong>30%</strong> como línea roja (el borde derecho de la pista).
        </p>
        <Legend>% sobre quienes buscan escribiendo. Cada barra está a escala del umbral de alarma (30% = 100% de la pista).</Legend>
        {REVERSION_SERIES.map((r) => (
          <MetricBar key={r.week} label={r.week} value={`${r.pct} (${r.n})`} pct={r.bar} color={PY} />
        ))}
        <Conclusion>
          Muy lejos del 30% — 12 personas de 1.291. Pero ya son dos semanas subiendo (0,4%→0,7%→0,9%). Si sube una tercera
          en S5, investigar. Si se estabiliza, se lee como ruido de muestra chica.
        </Conclusion>
        <BarGroup title="Misma idea, medida sobre todo el catálogo (no solo quien busca)">
          {REVERSION_FUNNEL.map((r) => (
            <MetricBar key={r.week} label={r.week} value={r.pct} pct={r.bar} color={PY} />
          ))}
        </BarGroup>
      </Section>

      <Section title="Favoritos y contacto al cliente — S3 y S4 (cifras corregidas)">
        <Note>{FAV_CONTACT_PCT.note}</Note>
        <StatTable
          headers={FAV_CONTACT_PCT.headers}
          rows={FAV_CONTACT_PCT.rows.map((r) => ({ cells: r }))}
        />
        <TwoCol>
          <div>
            <CountryTag country="co" />
            <BarGroup title="Favoritos · % del catálogo">
              <MetricBar label="S3" value="35,3%" pct={35.3} color="#1D4ED8" />
              <MetricBar label="S4" value="35,1%" pct={35.1} color="#1E3A8A" />
            </BarGroup>
            <BarGroup title="Escriben al cliente · % del catálogo">
              <MetricBar label="S3" value="44,1%" pct={44.1} color="#1D4ED8" />
              <MetricBar label="S4" value="44,1%" pct={44.1} color="#1E3A8A" />
            </BarGroup>
          </div>
          <div>
            <CountryTag country="py" />
            <BarGroup title="Favoritos · % del catálogo">
              <MetricBar label="S3" value="43,6%" pct={43.6} color="#c2410c" />
              <MetricBar label="S4" value="48,2%" pct={48.2} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="Escriben al cliente · % del catálogo">
              <MetricBar label="S3" value="54,8%" pct={54.8} color="#c2410c" />
              <MetricBar label="S4" value="58,6%" pct={58.6} color="#7c2d12" />
            </BarGroup>
          </div>
        </TwoCol>
        <Conclusion tone="green">{FAV_CONTACT_PCT.conclusion}</Conclusion>
      </Section>

      <Section title="Quién cambia de modo — personas y %">
        <Legend>{FILTER_PCT.note}</Legend>
        <StatTable
          headers={FILTER_PCT.headers}
          rows={FILTER_PCT.rows.map((r) => ({ cells: r }))}
        />
        <div style={{ marginTop: 16 }}>
          <StatTable
            headers={FILTER_PCT.seriesHeaders}
            rows={FILTER_PCT.series.map((r) => ({ cells: r }))}
          />
        </div>
        <TwoCol>
          <div>
            <CountryTag country="co" />
            <BarGroup title="Imagen · % de quienes buscan">
              <MetricBar label="S1" value="16,3%" pct={16.3} color="#93C5FD" />
              <MetricBar label="S2" value="16,7%" pct={16.7} color={CO} />
              <MetricBar label="S3" value="16,3%" pct={16.3} color="#1D4ED8" />
              <MetricBar label="S4" value="16,4%" pct={16.4} color="#1E3A8A" />
            </BarGroup>
          </div>
          <div>
            <CountryTag country="py" />
            <BarGroup title="Imagen · % de quienes buscan">
              <MetricBar label="S1" value="9,0%" pct={9} color="#FF9E5E" />
              <MetricBar label="S2" value="8,5%" pct={8.5} color={PY} />
              <MetricBar label="S3" value="9,7%" pct={9.7} color="#c2410c" />
              <MetricBar label="S4" value="10,3%" pct={10.3} color="#7c2d12" />
            </BarGroup>
            <BarGroup title="Clásica · % de quienes buscan (reversión)">
              <MetricBar label="S1" value="1,0%" pct={1} color="#FF9E5E" />
              <MetricBar label="S2" value="0,4%" pct={0.4} color={PY} />
              <MetricBar label="S3" value="0,7%" pct={0.7} color="#c2410c" />
              <MetricBar label="S4" value="0,9%" pct={0.9} color="#7c2d12" />
            </BarGroup>
          </div>
        </TwoCol>
        <Conclusion>
          133 en Paraguay suena poco; es 10,3% de quienes buscan y 6,3% del catálogo — y sube las 4 semanas. En Colombia la foto es estable: ~16% de quienes buscan usan imagen. Las 12 personas que vuelven a Clásica en PY son 0,9% de quienes buscan (0,6% del catálogo), no un éxodo.
        </Conclusion>
      </Section>

      <Section title="Limpieza de la barra (evento X)">
        <Alert tone="amber" title="S3 y S4 no trajeron este evento">
          {EVENT_X.note}
        </Alert>
        <StatTable
          headers={EVENT_X.headers}
          rows={EVENT_X.rows.map((r) => ({
            cells: r,
            flag: r[0].includes("CO") ? "red" : undefined,
          }))}
        />
        <BarGroup title="Paraguay: % de quienes buscan que limpiaron al menos una vez">
          <MetricBar label="S1" value="12,9%" pct={12.9} color="#FF9E5E" />
          <MetricBar label="S2" value="15,2%" pct={15.2} color={PY} />
        </BarGroup>
        <Conclusion>
          En Paraguay, 1 de cada 8 buscadores limpió la barra en S1 (12,9%) y 1 de cada 7 en S2 (15,2%). Colombia en 0 no es realista a ese volumen: es un hueco de tracking. Hasta que vuelva el dato en el corte semanal, no se puede decir si la limpieza subió o bajó.
        </Conclusion>
      </Section>

      <Section title="Eventos (clics) vs. personas — solo S1 y S2">
        <Alert tone="amber" title="S3 y S4 no trajeron este desglose">
          {EVENTS_VS_USERS.note}
        </Alert>
        <StatTable
          headers={EVENTS_VS_USERS.co.headers}
          rows={EVENTS_VS_USERS.co.rows.map((r) => ({
            cells: r,
            flag: r[0].includes("limpieza") ? "red" : undefined,
          }))}
        />
        <div style={{ marginTop: 12 }}>
          <StatTable
            headers={EVENTS_VS_USERS.py.headers}
            rows={EVENTS_VS_USERS.py.rows.map((r) => ({ cells: r }))}
          />
        </div>
        <Note>{EVENTS_VS_USERS.reading}</Note>
        <Conclusion tone="red" label="Dato llamativo a confirmar">
          La búsqueda por imagen en Paraguay registra exactamente 148 eventos en S1 y en S2, mientras las personas sí
          suben (87→90). Es posible pero inusual: confirmar que no sea un valor congelado.
        </Conclusion>
      </Section>

      <Section title="Tabla resumen S1 → S4">
        <StatTable
          headers={COMPARATIVO_SUMMARY.headers}
          rows={COMPARATIVO_SUMMARY.rows.map((r) => ({ cells: r }))}
        />
        <Note>{COMPARATIVO_SUMMARY.note}</Note>
      </Section>
    </>
  );
}
