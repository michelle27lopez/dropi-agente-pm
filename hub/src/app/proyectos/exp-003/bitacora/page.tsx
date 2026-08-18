"use client";

import { useState } from "react";

// Bitácora de EXP-003 "Búsqueda semántica" — curada a partir de los 4
// reportes semanales (26 jun–24 jul 2026) y la bitácora ya consolidada en
// /Documents/Claude/Projects/Búsqueda semántica/busqueda-semantica-co-py-bitacora.html.
// Se abre en pestaña nueva desde el botón "Ver Detalle del Proyecto" en /proyectos/exp-003.

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--border)",
  borderRadius: 14, padding: 20, marginBottom: 16,
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "8px 10px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 10px", borderBottom: "1px solid var(--border)", fontSize: 13,
};

const TONES = {
  green: { fg: "#0ABB87", bg: "#ECFDF5" },
  blue: { fg: "#3B82F6", bg: "#EFF6FF" },
  red: { fg: "#EF4444", bg: "#FEF2F2" },
} as const;
type Tone = keyof typeof TONES;

function Conclusion({ tone = "blue", label = "📌 Conclusión", children }: { tone?: Tone; label?: string; children: React.ReactNode }) {
  const t = TONES[tone];
  return (
    <div style={{ borderLeft: `4px solid ${t.fg}`, background: t.bg, borderRadius: "0 8px 8px 0", padding: "10px 12px", marginTop: 10 }}>
      <span style={{ display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: t.fg, marginBottom: 3 }}>{label}</span>
      <p style={{ fontSize: 12.5, color: "#3a3a3c", lineHeight: 1.55, margin: 0 }}>{children}</p>
    </div>
  );
}

function Alert({ tone, title, children }: { tone: Tone; title: string; children: React.ReactNode }) {
  const t = TONES[tone];
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.fg}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
      <h4 style={{ fontSize: 13, fontWeight: 700, color: t.fg, marginBottom: 4 }}>{title}</h4>
      <p style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.55, margin: 0 }}>{children}</p>
    </div>
  );
}

function StatTable({ rows }: { rows: { label: string; co: string; py: string }[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={thStyle}></th>
          <th style={thStyle}>Colombia</th>
          <th style={thStyle}>Paraguay</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td style={tdStyle}>{r.label}</td>
            <td style={tdStyle}>{r.co}</td>
            <td style={tdStyle}>{r.py}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TABS = ["Resumen", "Semana 1 · 26 jun–3 jul", "Semana 2 · 3–10 jul", "Semana 3 · 10–17 jul", "Semana 4 · 17–24 jul", "Hallazgos", "Próximos pasos"];

const TIMELINE = [
  { date: "5–12 jun · Línea base", tone: "blue" as Tone, text: "Paraguay 100% con Clásica, todavía sin IA. Retención escrita 48.4%, por imagen 21.4%. Solo 6.4% de quienes entraban al catálogo usaban el buscador." },
  { date: "26 jun–3 jul · Semana 1", tone: "blue" as Tone, text: "Primer corte del MVP: IA por defecto en PY, Clásica por defecto en CO. Adopción invertida por diseño confirmada (Clásica 79.8% CO, IA 98.8% PY). Reversión a Clásica en PY: 1.0%." },
  { date: "3–10 jul · Semana 2", tone: "blue" as Tone, text: "Patrón estable (IA 99.3% PY). Reversión a Clásica baja a 0.4%. PY crece más rápido en catálogo/búsqueda (+7–10%) que CO (+2–3%), pero su activación cae (−3.1%)." },
  { date: "10–17 jul · Semana 3", tone: "red" as Tone, text: "PY pega un salto atípico (+27.9% catálogo). Su funnel se debilita por primera vez y la reversión a Clásica sube (0.4%→0.7%) — lejos aún del red flag de 30%." },
  { date: "17–24 jul · Semana 4", tone: "green" as Tone, text: "Se resuelve el bug de tracking de favoritos/enviar-a-cliente en PY (0 → cifras reales). Primera semana sin crecimiento en ningún país. Reversión a Clásica en PY sube 2ª semana seguida (0.7%→0.9%)." },
];

type Week = {
  id: string;
  label: string;
  alert?: { tone: Tone; title: string; body: string };
  base: { label: string; co: string; py: string }[];
  modo: { label: string; co: string; py: string }[];
  modoNote: string;
  conclusionTone: Tone;
  conclusionLabel?: string;
  conclusion: string;
};

const WEEKS: Week[] = [
  {
    id: "s1",
    label: "Semana 1 · 26 jun – 3 jul 2026",
    base: [
      { label: "Usuarios en catálogo", co: "24.045", py: "1.696" },
      { label: "Usuarios en búsqueda escrita", co: "16.490", py: "962" },
      { label: "Engagement (búsqueda/catálogo)", co: "68.6%", py: "56.7%" },
    ],
    modo: [
      { label: "Clásica", co: "13.151 (79.8%) — default", py: "10 (1.0%) — activo" },
      { label: "IA", co: "1.739 (10.5%) — activo", py: "950 (98.8%) — default" },
      { label: "ID", co: "1.600 (9.7%) — activo", py: "2 (0.2%) — activo" },
    ],
    modoNote: "En Colombia, 1 de cada 5 búsquedas activas fuera del default (20.2%) termina en IA o ID. En Paraguay, la reversión activa hacia Clásica es marginal (1.0% + 0.2% ID) — muy por debajo del red flag de 30%.",
    conclusionTone: "blue",
    conclusion: "Clásica en Colombia retiene mejor (79.2%) que IA (44.7%) o ID (42.3%) — esperable, es el modo más maduro y con la base más grande. En Paraguay, IA (950 usuarios, el default) retiene 57.9%, casi igual a la retención general de búsqueda escrita (57.3%). Clásica (10u) e ID (2u) en Paraguay tienen base demasiado chica para leer su 0%/50% como señal.",
  },
  {
    id: "s2",
    label: "Semana 2 · 3 – 10 jul 2026",
    base: [
      { label: "Usuarios en catálogo", co: "24.547", py: "1.822" },
      { label: "Usuarios en búsqueda escrita", co: "16.925", py: "1.055" },
      { label: "Engagement (búsqueda/catálogo)", co: "68.9%", py: "57.9%" },
    ],
    modo: [
      { label: "Clásica", co: "13.432 (79.4%) — default", py: "4 (0.4%) — activo" },
      { label: "IA", co: "1.840 (10.9%) — activo", py: "1.048 (99.3%) — default" },
      { label: "ID", co: "1.653 (9.8%) — activo", py: "3 (0.3%) — activo" },
    ],
    modoNote: "Se mantiene el patrón esperado: Clásica domina CO, IA domina PY. La reversión activa a Clásica en Paraguay bajó a 0.4% (4 usuarios) — sigue muy por debajo del red flag de 30%.",
    conclusionTone: "blue",
    conclusion: "En Colombia, Clásica retiene mejor (84.3%) que IA (52.2%) o ID (50.2%) — el modo default y más maduro fideliza más, igual que en S1. En Paraguay, IA (su default, 1.048 usuarios) sí tiene muestra suficiente y retiene sólido (64.7%, mejor que Colombia). Clásica (4u) e ID (3u) en Paraguay siguen sin base suficiente para leer su 0% como señal real.",
  },
  {
    id: "s3",
    label: "Semana 3 · 10 – 17 jul 2026",
    alert: {
      tone: "red",
      title: "📈 Semana atípica en Paraguay: salto de crecimiento fuerte",
      body: "Paraguay creció mucho más rápido que en semanas anteriores: +27.9% en catálogo y +19.9% en búsqueda escrita, muy por encima del +7–10% de S1→S2. Vale la pena confirmar si hubo una campaña o cambio en cómo llega la gente — varios de los movimientos de esta semana probablemente son efecto de esa ola de usuarios nuevos, no un cambio de tendencia real.",
    },
    base: [
      { label: "Usuarios en catálogo", co: "25.718", py: "2.330" },
      { label: "Usuarios en búsqueda escrita", co: "17.637", py: "1.265" },
      { label: "Engagement (búsqueda/catálogo)", co: "68.6%", py: "54.3%" },
    ],
    modo: [
      { label: "Clásica", co: "14.221 (80.6%) — default", py: "9 (0.7%) — activo" },
      { label: "IA", co: "1.842 (10.4%) — activo", py: "1.255 (99.2%) — default" },
      { label: "ID", co: "1.574 (8.9%) — activo", py: "1 (0.1%) — activo" },
    ],
    modoNote: "Tercera semana seguida sin casi ningún cambio. Lo único distinto: en Paraguay, la reversión manual a Clásica subió un poco (0.4%→0.7%, de 4 a 9 personas).",
    conclusionTone: "red",
    conclusion: "Primera semana en que el camino de compra de Paraguay empeora en vez de mejorar: Resultados→Detalle baja de 34.06% a 30.43%, y Flujo completo de 6.54% a 4.93%. Coincide justo con la semana de mayor entrada de gente nueva (+27.9% catálogo) — lo más probable es el efecto normal de usuarios nuevos que todavía no conocen bien la plataforma, no un problema nuevo del buscador.",
  },
  {
    id: "s4",
    label: "Semana 4 · 17 – 24 jul 2026",
    alert: {
      tone: "green",
      title: "✅ Se resolvió el bug de tracking de favoritos y contacto al cliente en Paraguay",
      body: "Después de tres semanas seguidas en 0 (favoritos) y sin registrar (enviar a cliente) en Paraguay, una corrección de pipeline que suma las dos variantes del evento reveló las cifras reales: Paraguay tiene 1.023 favoritos y 1.244 mensajes a cliente esta semana. Colombia también estaba subcontado: pasa de ~2.200 favoritos reportados en S1–S3 a 8.940 reales.",
    },
    base: [
      { label: "Usuarios en catálogo", co: "25.441 (−1.1%)", py: "2.122 (−8.9%) ⚠️ primera caída" },
      { label: "Usuarios en búsqueda escrita", co: "17.441 (−1.1%)", py: "1.291 (+2.1%)" },
      { label: "Engagement (búsqueda/catálogo)", co: "68.6% (=)", py: "60.8% (↑ desde 54.3%)" },
    ],
    modo: [
      { label: "Clásica", co: "14.026 (80.4%) — default", py: "12 (0.9%) — activo" },
      { label: "IA", co: "1.824 (10.5%) — activo", py: "1.279 (99.1%) — default" },
      { label: "ID", co: "1.591 (9.1%) — activo", py: "0 (0%) — activo" },
    ],
    modoNote: "Primera semana en que ningún país crece. Colombia se mantiene prácticamente igual. Paraguay cae en catálogo (−8.9%, primera caída desde el lanzamiento), pero la gente que efectivamente busca subió (54.3%→60.8%) — la caída se concentra en tráfico que entra sin intención de buscar, no en buscadores activos.",
    conclusionTone: "red",
    conclusionLabel: "📌 La métrica a vigilar",
    conclusion: "Cuarta semana seguida sin casi ningún cambio en adopción, como se esperaba. Lo único que sigue llamando la atención: la reversión manual a Clásica en Paraguay subió por segunda semana consecutiva (0.7%→0.9%, de 9 a 12 personas). Sigue siendo minúsculo y muy lejos del 30% de alarma, pero ya es una tendencia de dos semanas, no un salto aislado.",
  },
];

const FINDINGS: { group: string; tone: Tone; items: { title: string; body: string }[] }[] = [
  {
    group: "✅ Lo bueno",
    tone: "green",
    items: [
      {
        title: "Se resolvió el bug de tracking más preocupante del seguimiento",
        body: "Tras tres semanas con \"guardar favorito\" en cero en Paraguay, una corrección de pipeline reveló las cifras reales: 1.023 favoritos y 1.244 mensajes a cliente en S4. Colombia también estaba subcontado (~2.200 → 8.940 reales). Con la corrección, ambos países muestran 35–59% de su catálogo interactuando después de buscar — nivel sano, no la alarma que parecía.",
      },
      {
        title: "Primera evidencia directa de que la gente usa la IA para lo que se diseñó",
        body: "En Colombia, con IA la gente busca con frases largas y específicas casi como nombres de producto (\"blazer slim de caballero n105\"); con Clásica, palabras cortas y genéricas (\"trapero\"). Primera prueba concreta de que la IA se usa para encontrar productos específicos escribiendo de forma natural.",
      },
      {
        title: "La retención de Paraguay resiste tanto el crecimiento como la caída",
        body: "En S3, con una ola grande de usuarios nuevos (+27.9% catálogo), la retención no cayó como sería esperable. En S4, con el catálogo cayendo (−8.9%), la retención de búsqueda por imagen dio su salto más fuerte de la serie (+5 puntos). El producto no se diluye ni con más gente nueva ni con menos tráfico.",
      },
    ],
  },
  {
    group: "⚠️ Con cuidado — qué no podemos decir todavía",
    tone: "blue",
    items: [
      {
        title: "Más ráfagas de búsqueda con IA en Colombia: ¿exploración sana o fricción?",
        body: "Quien usa IA en Colombia refina más su búsqueda (1.99 consultas seguidas) que quien usa Clásica (1.34). Puede ser que encuentre más opciones para elegir (señal buena) o que no encuentre lo que quiere a la primera (señal de fricción). Sin CSAT/CES no se puede saber cuál — dato a seguir semana a semana.",
      },
      {
        title: "Más gente buscando en Paraguay todavía no se traduce en más pedidos",
        body: "La cantidad de gente que busca en Paraguay se multiplicó por 20 desde antes del lanzamiento (64→1.291), pero los pedidos casi no se movieron (1.284→1.301 creados/día). Adoptar la herramienta y que se traduzca en más ventas son dos pasos distintos: el primero ya se dio, el segundo todavía no se nota con claridad.",
      },
      {
        title: "Colombia adopta la IA bastante menos que sus mercados pares con el mismo default",
        body: "Ecuador, Chile y México también tienen Clásica como default. Ahí, quienes se salen del default eligen IA 3–4 veces más que ID, y su adopción de IA (21.3%–26.4%) es mucho más alta que la de Colombia (10.5%). Vale la pena entender qué hacen distinto esos mercados.",
      },
    ],
  },
  {
    group: "🔴 Lo que preocupa",
    tone: "red",
    items: [
      {
        title: "La reversión manual a Clásica en Paraguay ya lleva dos semanas subiendo seguidas",
        body: "0.4% (S2) → 0.7% (S3) → 0.9% (S4) — apenas 12 personas de 1.291, muy lejos del 30% de alarma. Pero es la primera vez que sube dos semanas consecutivas. Si sube una tercera semana seguida en S5, ahí sí valdría investigar más a fondo — es, según el equipo, el número más importante de todo el seguimiento.",
      },
      {
        title: "Nuevos problemas de calidad de datos en el análisis de consultas individuales",
        body: "El campo \"es_consulta_final\" en la base cruda de Clásica (Colombia) marca 100% verdadero en todos los casos — no tiene sentido y no se usó para conclusiones. Además esa base llegó cortada en el límite de filas de Excel antes de incluir un solo registro de Paraguay.",
      },
      {
        title: "El error 505 y la relevancia del motor de IA siguen sin resolverse",
        body: "El bug de scroll en búsqueda IA (Paraguay) no se pudo confirmar esta semana — sigue sin fecha de fix conocida. El motor de IA cubre 70% de los términos evaluados pero con solo 21% de Score Final de relevancia.",
      },
    ],
  },
];

const NEXT_STEPS: { priority: "alta" | "media" | "baja"; title: string; body: string }[] = [
  { priority: "alta", title: "Seguir de cerca la reversión manual a Clásica en Paraguay la próxima semana", body: "Ya lleva dos semanas subiendo (0.4%→0.7%→0.9%). Si sube por tercera semana en S5, investigar a fondo. Es el número más importante de todo el seguimiento." },
  { priority: "alta", title: "Pedir la base cruda de búsqueda Clásica sin límite de filas (CSV), filtrada CO y PY", body: "La de esta semana se cortó en el límite de Excel antes de incluir Paraguay — hoy no hay análisis de términos/ráfagas de Clásica en ese país." },
  { priority: "alta", title: "Averiguar qué generó la primera caída de catálogo en Paraguay (−8.9%)", body: "Confirmar si es puntual o el inicio de una tendencia. El % que efectivamente busca subió, así que la caída parece concentrarse en tráfico pasivo." },
  { priority: "media", title: "Revisar con el equipo de datos el campo \"es_consulta_final\"", body: "Marca 100% verdadero siempre — parece un error de cálculo. Confirmar causa antes de usarlo en análisis futuros." },
  { priority: "media", title: "Confirmar el estado real del error 505 (scroll en búsqueda IA, Paraguay)", body: "No se pudo verificar esta semana. Reportado desde S1, confirmado abierto hasta S3 — pedir confirmación explícita de estado y fecha de fix." },
  { priority: "media", title: "Pedir que la volumetría de órdenes venga desglosada por tipo de búsqueda", body: "Hoy solo da el total diario de pedidos por país, sin indicar si pasó por el buscador — clave para responder si el buscador ya genera más ventas en Paraguay." },
  { priority: "media", title: "Habilitar CSAT/CES en producto", body: "Pendiente desde S1. Ayudaría a interpretar si más ráfagas de búsqueda con IA en Colombia son exploración sana o fricción." },
  { priority: "media", title: "Investigar qué hacen distinto Ecuador, Chile y México para lograr mayor adopción de IA", body: "Los tres tienen Clásica como default igual que Colombia, pero adoptan más IA (21.3%–26.4% vs. 10.5%). Podría haber algo replicable." },
  { priority: "baja", title: "Agendar entrevistas cualitativas en Paraguay", body: "5–8 usuarios. Pendiente desde S2." },
  { priority: "baja", title: "Confirmar si el desglose de eventos vs. usuarios se sigue reportando", body: "Ni S3 ni S4 lo incluyeron como sí lo tuvieron S1 y S2 — confirmar con el equipo si el reporte cambió de formato." },
  { priority: "baja", title: "Pedir fecha de entrega para la notificación de optimización del motor de búsqueda", body: "Sin novedades varias semanas seguidas. Sin esta señal, catálogo prioriza a ciegas qué términos corregir primero." },
  { priority: "baja", title: "Mantener el corte semanal con la misma metodología", body: "Consolidar una serie de al menos 6–8 semanas antes de la revisión de hipótesis con el equipo, y correr la prueba T planificada cuando la muestra lo permita." },
];

const PRIORITY_TONE: Record<string, Tone> = { alta: "red", media: "blue", baja: "green" };
const PRIORITY_LABEL: Record<string, string> = { alta: "Alta", media: "Media", baja: "Baja" };

function PanelResumen() {
  return (
    <>
      <Alert tone="red" title="🔴 Métrica a vigilar: reversión manual a Clásica en Paraguay">
        0.4% → 0.7% → 0.9% (S2 → S3 → S4) — sube por segunda semana seguida. Sigue muy lejos del red flag de 30%,
        pero es la primera vez en el seguimiento que la tendencia se sostiene dos semanas. Si sube una tercera vez en S5, toca investigar a fondo.
      </Alert>

      <div style={card}>
        <div style={sectionTitle}>KPIs de la semana más reciente (S4, 17–24 jul)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 12 }}>
          {[
            { val: "1.291", lbl: "Usuarios búsqueda escrita PY", trend: "+2.1%", tone: "green" as Tone },
            { val: "17.441", lbl: "Usuarios búsqueda escrita CO", trend: "−1.1%", tone: "red" as Tone },
            { val: "99.1%", lbl: "Adopción IA en PY (default)", trend: "", tone: "blue" as Tone },
            { val: "0.9%", lbl: "Reversión a Clásica en PY", trend: "↑ 2ª semana seguida", tone: "red" as Tone },
          ].map((k) => (
            <div key={k.lbl} style={{ background: "#FAFBFC", border: "1px solid var(--border)", borderRadius: 10, padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)" }}>{k.val}</div>
              <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.3 }}>{k.lbl}</div>
              {k.trend && <span style={{ ...tag(TONES[k.tone].fg, TONES[k.tone].bg), marginTop: 4 }}>{k.trend}</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Línea de tiempo — S1 → S4</div>
        <div style={sectionSub}>Colombia (control, ~600K usuarios) vs. Paraguay (experimental, ~53.734 usuarios). IA quedó como default en Paraguay el 17 de junio de 2026.</div>
        <div>
          {TIMELINE.map((t) => (
            <div key={t.date} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TONES[t.tone].fg, flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>{t.date}</div>
                <div style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.55 }}>{t.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>Embudo de conversión — foto más reciente (S4)</div>
        <div style={sectionSub}>Usuarios únicos por paso, no eventos/clics.</div>
        <StatTable
          rows={[
            { label: "Catálogo → Buscó algo", co: "15.517 (100%)", py: "1.188 (100%)" },
            { label: "Búsqueda → Vio resultados", co: "7.824 (50.42%)", py: "744 (62.63%)" },
            { label: "Resultados → Abrió detalle", co: "2.851 (18.37%)", py: "356 (29.97%)" },
            { label: "Detalle → Acción (fav./pedido)", co: "322 (2.08%)", py: "68 (5.72%)" },
            { label: "Flujo completo (hasta pedido)", co: "221 (1.42%)", py: "52 (4.38%)" },
          ]}
        />
        <Conclusion>
          Ambos países prácticamente estables vs. S3, con una caída mínima y ya de dos semanas en el último paso de
          Paraguay (4.93%→4.38%) — parece estar estabilizándose. Paraguay sigue convirtiendo proporcionalmente
          mejor que Colombia en los pasos posteriores a &quot;ver resultados&quot;.
        </Conclusion>
      </div>
    </>
  );
}

function PanelWeek({ w }: { w: Week }) {
  return (
    <>
      {w.alert && <Alert tone={w.alert.tone} title={w.alert.title}>{w.alert.body}</Alert>}
      <div style={card}>
        <div style={sectionTitle}>Base de la semana</div>
        <StatTable rows={w.base} />
      </div>
      <div style={card}>
        <div style={sectionTitle}>Adopción por modo de búsqueda escrita (estimada)</div>
        <div style={sectionSub}>Usuarios únicos. Clásica en CO e IA en PY son valores derivados (el modo default no genera evento propio).</div>
        <StatTable rows={w.modo} />
        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>{w.modoNote}</p>
        <Conclusion tone={w.conclusionTone} label={w.conclusionLabel}>{w.conclusion}</Conclusion>
      </div>
    </>
  );
}

function PanelHallazgos() {
  return (
    <>
      <div style={{ ...card, background: "#1d1d1f" }}>
        <span style={{ ...tag("#fff", "rgba(255,255,255,0.15)"), marginBottom: 8 }}>En una frase</span>
        <p style={{ fontSize: 13.5, color: "#fff", lineHeight: 1.6, margin: 0 }}>
          Se resolvió el hallazgo más preocupante del seguimiento (favoritos/contacto al cliente en Paraguay era un
          bug de tracking, no un problema real) y hay evidencia directa de que la gente en Colombia usa la IA para
          lo que se diseñó. La única sombra: la reversión manual a Clásica en Paraguay ya lleva dos semanas subiendo seguidas.
        </p>
      </div>
      {FINDINGS.map((g) => (
        <div key={g.group} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--fg)", marginBottom: 10 }}>{g.group}</div>
          {g.items.map((it) => (
            <div key={it.title} style={{ ...card, borderLeft: `3px solid ${TONES[g.tone].fg}`, background: TONES[g.tone].bg }}>
              <h4 style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{it.title}</h4>
              <p style={{ fontSize: 12.5, color: "#3a3a3c", lineHeight: 1.55, margin: 0 }}>{it.body}</p>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function PanelProximosPasos() {
  return (
    <div style={card}>
      {NEXT_STEPS.map((s, i) => (
        <div key={s.title} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < NEXT_STEPS.length - 1 ? "1px solid var(--border)" : "none" }}>
          <span style={{ ...tag(TONES[PRIORITY_TONE[s.priority]].fg, TONES[PRIORITY_TONE[s.priority]].bg), flexShrink: 0, height: "fit-content" }}>
            {PRIORITY_LABEL[s.priority]}
          </span>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{s.title}</h4>
            <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Exp003BitacoraPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/proyectos/exp-003" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          &larr; EXP-003
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Bitácora</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
            Búsqueda Semántica — Bitácora CO vs PY
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
            Colombia (control) vs. Paraguay (experimental, IA por defecto desde el 17 jun 2026) · 4 semanas + línea base · Actualizado: 24/07/2026
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>99.1% adopción IA en PY</span>
          <span style={tag("#EF4444", "#FEF2F2")}>0.9% reversión a Clásica en PY (↑)</span>
          <span style={tag("#0ABB87", "#ECFDF5")}>Favoritos/contacto ya registran bien</span>
        </div>

        <div style={{
          display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)", overflowX: "auto",
        }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "10px 14px", fontSize: 12.5, fontWeight: activeTab === i ? 700 : 500,
                color: activeTab === i ? "var(--dropi)" : "var(--muted)",
                background: "transparent", border: "none", cursor: "pointer",
                borderBottom: activeTab === i ? "2px solid var(--dropi)" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 0 && <PanelResumen />}
        {activeTab === 1 && <PanelWeek w={WEEKS[0]} />}
        {activeTab === 2 && <PanelWeek w={WEEKS[1]} />}
        {activeTab === 3 && <PanelWeek w={WEEKS[2]} />}
        {activeTab === 4 && <PanelWeek w={WEEKS[3]} />}
        {activeTab === 5 && <PanelHallazgos />}
        {activeTab === 6 && <PanelProximosPasos />}
      </div>
    </div>
  );
}
