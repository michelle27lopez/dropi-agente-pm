"use client";

import { SectionCard, H1, H2, H3, P, Fuente, Vacio, Callout, Tabla, Td, Tag, KPI, KPIRow, Barra } from "../_components/ui";

// ── NPS · UserPilot, encuesta id 1 por workspace
const NPS = [
  { quien: "Proveedores de Colombia", score: 48, n: 3679, prom: "67,79%", pas: "12,20%", det: "20,01%", color: "var(--warning)" },
  { quien: "Toda la plataforma · Colombia", score: 57, n: 37918, prom: "71,70%", pas: "13,42%", det: "14,88%", color: "var(--success)" },
  { quien: "Toda la plataforma · Ecuador", score: 56, n: 3354, prom: "71,02%", pas: "13,80%", det: "15,18%", color: "var(--success)" },
  { quien: "Toda la plataforma · México", score: 48, n: 1498, prom: "66,69%", pas: "15,02%", det: "18,29%", color: "var(--warning)" },
];

const NPS_MES = [
  { mes: "Junio 2026", score: 44, n: 695 },
  { mes: "Julio 2026", score: 47, n: 611 },
  { mes: "Agosto 2026 (al día 19)", score: 48, n: 188 },
];

// ── Marco NPS vs CSAT vs CES · CustomerGauge
const MARCO_METRICAS = [
  {
    metrica: "NPS",
    mide: "Lealtad general hacia Dropi",
    pregunta: "¿Qué tan probable es que nos recomiende? (0–10)",
    formula: "% Promotores − % Detractores",
    predice: "Retención y crecimiento a largo plazo",
  },
  {
    metrica: "CSAT",
    mide: "Satisfacción con una interacción puntual",
    pregunta: "¿Qué tan satisfecho quedó con [X]?",
    formula: "% de respuestas top-2 sobre el total",
    predice: "Débil: sirve para cerrar el ciclo de un caso, no para anticipar churn",
  },
  {
    metrica: "CES",
    mide: "Facilidad para resolver algo",
    pregunta: "¿Qué tan fácil fue resolver tu problema?",
    formula: "Promedio de las respuestas",
    predice: "Moderada: mucho esfuerzo percibido correlaciona con abandono",
  },
];

// ── CSAT donde el proveedor evalúa su propia experiencia
const CAS_CASO = [
  { label: "1 · Muy difícil", n: 18, pct: 50.0 },
  { label: "2", n: 2, pct: 5.56 },
  { label: "3", n: 5, pct: 13.89 },
  { label: "4", n: 4, pct: 11.11 },
  { label: "5 · Muy fácil", n: 7, pct: 19.44 },
];

const CES_OFERTA = [
  { label: "1 · Muy difícil", n: 4, pct: 23.53 },
  { label: "2", n: 0, pct: 0 },
  { label: "3", n: 1, pct: 5.88 },
  { label: "4", n: 2, pct: 11.76 },
  { label: "5 · Muy fácil", n: 10, pct: 58.82 },
];

// ── CSAT donde el dropshipper evalúa al proveedor
const UTILIDAD = [
  { label: "1 · Nada útil", n: 109, pct: 6.07 },
  { label: "2", n: 54, pct: 3.01 },
  { label: "3", n: 132, pct: 7.35 },
  { label: "4", n: 342, pct: 19.04 },
  { label: "5 · Muy útil", n: 1159, pct: 64.53 },
];

const FALTA_INFO = [
  { label: "Más detalle sobre tiempos de despacho", n: 46, pct: 29.3 },
  { label: "Otro (respuesta abierta)", n: 34, pct: 21.66 },
  { label: "Opiniones de otros dropshippers", n: 27, pct: 17.2 },
  { label: "Más información sobre entregas y devoluciones", n: 20, pct: 12.74 },
  { label: "Calidad de atención postventa", n: 17, pct: 10.83 },
  { label: "No me hizo falta información", n: 8, pct: 5.1 },
  { label: "Comparación con proveedores similares", n: 5, pct: 3.18 },
];

const INVENTARIO = [
  { id: "55", nombre: "[Evergreen] [CSAT] Indicadores de Proveedores", responde: "Dropshipper", sobre: "El proveedor", estado: "Publicada", n: "1.796", resultado: "4,33 / 5", color: "var(--info)" },
  { id: "61", nombre: "[Evergreen] [CSAT] CAS Caso abierto Proveedor", responde: "Proveedor", sobre: "Su propia experiencia", estado: "Publicada", n: "36", resultado: "2,44 / 5", color: "var(--success)" },
  { id: "62", nombre: "[Evergreen] [CSAT] CAS Cierre Proveedor", responde: "Proveedor", sobre: "Su propia experiencia", estado: "Publicada, sin una sola vista", n: "0", resultado: "—", color: "var(--danger)" },
  { id: "43", nombre: "(CES) Proveedores · Caza Productos", responde: "Proveedor", sobre: "Su propia experiencia", estado: "No publicada", n: "17", resultado: "3,82 / 5", color: "var(--warning)" },
  { id: "32", nombre: "[Evergreen] Clasificación Proveedores y Marcas", responde: "Proveedor", sobre: "Perfilamiento, no satisfacción", estado: "Publicada", n: "7.678", resultado: "—", color: "var(--muted)" },
  { id: "41", nombre: "[Evergreen] Comunidades · Clasificación Marcas y proveedores", responde: "Proveedor", sobre: "Perfilamiento, no satisfacción", estado: "Publicada", n: "—", resultado: "—", color: "var(--muted)" },
];

export default function SatisfaccionPage() {
  return (
    <>
      <SectionCard>
        <H1 sub="Indicadores de experiencia del cliente">Satisfacción del proveedor</H1>

        <P>
          Sí hay medición de satisfacción del proveedor, y hasta ahora nadie la había mirado segmentada. El
          NPS de Dropi se puede filtrar por el segmento de proveedores de Colombia, y el resultado cambia la
          conversación.
        </P>

        <KPIRow>
          <KPI valor="48" label="NPS del proveedor" sub="Colombia · n=3.679" color="var(--warning)" />
          <KPI valor="57" label="NPS de la plataforma" sub="Colombia · n=37.918" color="var(--success)" />
          <KPI valor="20,01%" label="Detractores proveedor" sub="14,88% en la plataforma" color="var(--danger)" />
          <KPI valor="2,44 / 5" label="CSAT del proveedor en CAS" sub="La única medición de su propia experiencia · n=36" color="var(--danger)" />
        </KPIRow>

        <Callout icon="📉" color="var(--warning)">
          El proveedor está nueve puntos por debajo del promedio de la plataforma y tiene un tercio más de
          detractores. No es una caída puntual: es el nivel sostenido de los últimos tres meses.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Qué mide cada métrica</H2>
        <P>
          NPS, CSAT y CES no son intercambiables: cada una responde una pregunta distinta y predice cosas
          distintas. Tenerlo claro importa porque, como se ve más abajo, en Dropi ya hay una encuesta
          nombrada como una cosa que en realidad mide otra.
        </P>

        <Tabla head={["Métrica", "Qué mide", "Pregunta típica", "Fórmula", "Qué predice"]}>
          {MARCO_METRICAS.map((m) => (
            <tr key={m.metrica}>
              <Td bold>{m.metrica}</Td>
              <Td>{m.mide}</Td>
              <Td>{m.pregunta}</Td>
              <Td>{m.formula}</Td>
              <Td>{m.predice}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="CustomerGauge · blog «NPS vs CSAT vs CES» (customergauge.com/blog/nps-csat-ces)" />

        <Callout icon="⚠️" color="var(--warning)">
          La encuesta 61 se llama <em>[Evergreen] [CSAT] CAS Caso abierto Proveedor</em>, pero su pregunta
          real es «¿qué tan fácil fue encontrar y tomar este caso?» — eso es un CES, no un CSAT. El
          «2,44 / 5» del resumen mide qué tan fácil le resultó al proveedor tomar un caso puntual dentro del
          flujo CAS (comunicación dropshipper↔proveedor), no su satisfacción con el soporte en general ni con
          Dropi como plataforma. Es un motivo más por el que sigue sin existir una medición real de
          satisfacción relacional del proveedor (ver «Lo que sigue sin saberse», más abajo).
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>NPS</H2>

        <Tabla head={["Quién responde", "NPS", "Promotores", "Pasivos", "Detractores", "n"]}>
          {NPS.map((r) => (
            <tr key={r.quien}>
              <Td bold>{r.quien}</Td>
              <Td bold color={r.color}>{r.score}</Td>
              <Td>{r.prom}</Td>
              <Td>{r.pas}</Td>
              <Td>{r.det}</Td>
              <Td>{r.n.toLocaleString("es-CO")}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente
          origen="UserPilot · encuesta NPS, segmento «Proveedores CO» (id 67) para la fila de proveedores"
          corte="1-ene-2026 al 19-ago-2026 · la serie arranca el 11-mar-2026"
        />

        <H3>Cómo se movió en los últimos meses</H3>
        <Tabla head={["Mes", "NPS", "Respuestas"]}>
          {NPS_MES.map((m) => (
            <tr key={m.mes}>
              <Td bold>{m.mes}</Td>
              <Td bold color="var(--warning)">{m.score}</Td>
              <Td>{m.n}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="UserPilot · NPS con segmento Proveedores CO, consultado mes a mes" corte="19-ago-2026" />

        <Callout icon="🌎" color="var(--info)">
          Este corte solo existe en Colombia. Las instancias de UserPilot de México y Ecuador no tienen
          ningún segmento de proveedores configurado, así que su NPS general (48 y 56) mezcla a todos los
          usuarios y no dice nada del proveedor. Crear ese segmento en los dos workspaces es un trabajo de
          una tarde y desbloquea la comparación entre países.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Cuando el proveedor evalúa su propia experiencia</H2>
        <P>
          Solo hay dos mediciones donde el proveedor califica algo que él mismo hizo. Las dos son de
          esfuerzo, no de satisfacción general, y las dos tienen muestras chicas. Aun así, apuntan en la
          misma dirección.
        </P>

        <H3>Atender un caso de soporte · «¿Qué tan fácil fue encontrar y tomar este caso?»</H3>
        {CAS_CASO.map((r) => (
          <Barra key={r.label} label={r.label} pct={r.pct} valor={`${r.n} · ${r.pct}%`} color={r.label.startsWith("1") ? "var(--danger)" : "var(--info)"} />
        ))}
        <Fuente
          origen="UserPilot survey 61 · [Evergreen] [CSAT] CAS Caso abierto Proveedor · n=36 · promedio 2,44 sobre 5"
          corte="ene–ago 2026 · Colombia"
        />
        <Callout icon="🚨" color="var(--danger)">
          La mitad de los proveedores que respondieron marcó el peor valor posible. Cuando se les preguntó
          qué lo dificultó, las dos razones principales empatan: la cola de casos no era clara (25%) y
          faltaba información para decidir si tomarlo (25%). Después: no encontraron los casos nuevos y no
          recibieron alerta (16,67% cada una).
        </Callout>
        <Fuente origen="UserPilot survey 61 · «¿Qué dificultó tomar el caso?» · n=12" corte="ene–ago 2026" />

        <P>
          Esto es un touchpoint puntual del flujo CAS, no la relación completa del proveedor con Dropi. El
          detalle del sistema CAS (tracking, embudo de cierre, adopción por filtro) vive en{" "}
          <a href="/proyectos/cas-comunicacion" style={{ color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
            su propia bitácora UX
          </a>
          — CAS todavía no tiene entrada en Following.
        </P>

        <H3>Enviar una oferta en Caza Productos · «¿Qué tan fácil fue enviar tu oferta?»</H3>
        {CES_OFERTA.map((r) => (
          <Barra key={r.label} label={r.label} pct={r.pct} valor={`${r.n} · ${r.pct}%`} color={r.label.startsWith("1") ? "var(--danger)" : "var(--info)"} />
        ))}
        <Fuente
          origen="UserPilot survey 43 · (CES) Proveedores Caza Productos · n=17 · promedio 3,82 sobre 5"
          corte="ene–ago 2026 · la encuesta no está publicada, conserva respuestas históricas"
        />
        <P>
          La distribución está partida en dos: el 58,82% lo encontró muy fácil y el 23,53% lo encontró muy
          difícil, sin casi nadie en el medio. De los cinco que reportaron problemas, tres marcaron error y
          uno dijo que su oferta no se envió.
        </P>
        <P>
          Esto también es un touchpoint puntual, específico del flujo de ofertas. El resto de métricas de
          Caza Productos (no solo esta encuesta) está en{" "}
          <a href="/metricas?p=caza-productos" style={{ color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
            Following
          </a>
          .
        </P>
      </SectionCard>

      <SectionCard>
        <H2>Cuando el dropshipper evalúa al proveedor</H2>
        <P>
          Esta es la medición más grande que existe alrededor del proveedor, y no mide su experiencia: mide
          cómo lo perciben quienes le compran. Es útil, pero no es su CSAT.
        </P>

        <H3>«¿Qué tan útil fue la información del proveedor para tomar una decisión?»</H3>
        {UTILIDAD.map((r) => (
          <Barra key={r.label} label={r.label} pct={r.pct} valor={`${r.n.toLocaleString("es-CO")} · ${r.pct}%`} />
        ))}
        <Fuente
          origen="UserPilot survey 55 · [Evergreen] [CSAT] Indicadores de Proveedores · n=1.796 · promedio 4,33 sobre 5"
          corte="1-jun-2026 al 19-ago-2026 · Colombia"
        />

        <H3>Qué información le hizo falta al dropshipper para confiar</H3>
        {FALTA_INFO.map((r) => (
          <Barra key={r.label} label={r.label} pct={r.pct} valor={`${r.n} · ${r.pct}%`} color="var(--info)" />
        ))}
        <Fuente origen="UserPilot survey 55 · «¿Qué información te hizo falta para confiar más en este proveedor?» · n=157" corte="jun–ago 2026" />

        <P>
          Y cuando se les pregunta qué dato pesó más en su decisión, la respuesta es operativa antes que
          reputacional: cantidad de despachos 37,27%, calificación general del proveedor 24,54%,
          cumplimiento de entregas 22,55% y atención postventa 8,59%, sobre 652 respuestas.
        </P>
        <Fuente origen="UserPilot survey 55 · «¿Qué dato influyó más en tu decisión sobre este proveedor?» · n=652" corte="jun–ago 2026" />
      </SectionCard>

      <SectionCard>
        <H2>Inventario de encuestas que tocan al proveedor</H2>
        <P>
          Seis encuestas en el UserPilot de Colombia involucran al proveedor. Solo tres miden su experiencia,
          y una de esas tres lleva meses publicada sin que nadie la vea.
        </P>

        <Tabla min={980} head={["#", "Encuesta", "Quién responde", "Sobre qué", "Estado", "Respuestas", "Resultado"]}>
          {INVENTARIO.map((s) => (
            <tr key={s.id}>
              <Td bold>{s.id}</Td>
              <Td bold>{s.nombre}</Td>
              <Td><Tag color={s.responde === "Proveedor" ? "var(--dropi)" : "var(--info)"}>{s.responde}</Tag></Td>
              <Td>{s.sobre}</Td>
              <Td color={s.color}>{s.estado}</Td>
              <Td bold>{s.n}</Td>
              <Td bold>{s.resultado}</Td>
            </tr>
          ))}
        </Tabla>
        <Fuente origen="UserPilot · workspace Dropi Colombia, listado de encuestas y sus respuestas" corte="19-ago-2026" />

        <Callout icon="🔇" color="var(--danger)">
          La encuesta 62, que cierra el ciclo de soporte del proveedor, está publicada y registra cero
          vistas y cero respuestas. No es que a nadie le importe: es que no se le está mostrando a nadie.
          Revisar su disparador es la corrección más barata de esta sección.
        </Callout>
      </SectionCard>

      <SectionCard>
        <H2>Lo que sigue sin saberse</H2>

        <Vacio
          pregunta="¿Qué tan satisfecho está el proveedor con Dropi como plataforma, más allá del soporte?"
          dueno="Laura Contreras (admin de UserPilot) junto con la célula"
          detalle="Las dos mediciones donde el proveedor se pronuncia son de esfuerzo y están atadas a momentos muy puntuales: atender un caso de soporte y enviar una oferta. No existe una medición de su experiencia con el catálogo, el despacho, las garantías o el ascenso de nivel."
        />

        <Vacio
          pregunta="¿Por qué el NPS del proveedor está nueve puntos por debajo del de la plataforma?"
          dueno="Sin dueño asignado"
          detalle="Los comentarios abiertos del NPS existen en UserPilot y no se han leído por segmento. Es la vía más directa para pasar del número a la causa, y no requiere levantar ninguna investigación nueva."
        />

        <Vacio
          pregunta="¿Cuál es el NPS del proveedor en México y Ecuador?"
          dueno="Laura Contreras (admin de UserPilot)"
          detalle="No es que el dato no exista: es que falta crear el segmento de proveedores en esos dos workspaces. Hoy solo Colombia lo tiene."
        />
      </SectionCard>
    </>
  );
}
