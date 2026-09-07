import HubFooter from "@/components/HubFooter";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginTop: 40, marginBottom: 12 }}>
      {children}
    </h2>
  );
}

function Callout({ tone, children }: { tone: "pending" | "info" | "danger"; children: React.ReactNode }) {
  const bg = tone === "pending" ? "#FFF6E5" : tone === "danger" ? "#FEF2F2" : "var(--dropi-light)";
  const border = tone === "pending" ? "#F0C766" : tone === "danger" ? "#FCA5A5" : "var(--dropi)";
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 10,
      padding: "12px 16px", fontSize: 13, color: "var(--fg)", lineHeight: 1.6, marginTop: 12, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
      padding: "2px 6px", fontSize: 12.5, color: "var(--fg)",
      fontFamily: "ui-monospace, Menlo, Consolas, monospace",
    }}>
      {children}
    </code>
  );
}

function Bloque({ children }: { children: React.ReactNode }) {
  return (
    <pre style={{
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
      padding: 16, fontSize: 12.5, lineHeight: 1.7, color: "var(--fg)",
      overflowX: "auto", fontFamily: "ui-monospace, Menlo, Consolas, monospace", margin: "12px 0",
    }}>
      {children}
    </pre>
  );
}

const conceptos = [
  {
    termino: "Rama (branch)",
    corto: "Tu copia privada del proyecto.",
    largo: "Trabajas en tu rama sin afectar a nadie. Nada de lo que hagas ahí se ve en la web hasta que la mezcles con main.",
  },
  {
    termino: "main",
    corto: "La versión oficial y publicada.",
    largo: "Lo que está en main es lo que el equipo ve en Darwin. Por eso nadie trabaja directamente sobre main.",
  },
  {
    termino: "Commit",
    corto: "Guardar un avance con nombre.",
    largo: "Es un punto de guardado con una descripción. Puedes hacer muchos commits en tu rama antes de mostrarle nada a nadie.",
  },
  {
    termino: "Push",
    corto: "Subir tu rama a GitHub.",
    largo: "Hasta que no haces push, tu trabajo solo existe en tu computador. Si se daña el equipo, se perdió.",
  },
  {
    termino: "PR (Pull Request)",
    corto: "Pedir que tu trabajo entre a main.",
    largo: "Es una solicitud: «revisen esto y, si está bien, métanlo a la versión oficial». Muestra exactamente qué líneas cambiaste. Es el lugar donde se comenta y se discute.",
  },
  {
    termino: "Merge",
    corto: "Aceptar el PR y mezclarlo con main.",
    largo: "El momento en que tu trabajo deja de ser tuyo y pasa a ser del equipo. Después del merge, Vercel publica solo: en 1–2 minutos está en la web.",
  },
  {
    termino: "Conflicto",
    corto: "Dos personas cambiaron la misma línea.",
    largo: "Git no adivina cuál gana y te pide que elijas. Se evita casi siempre trabajando cada quien en su propia carpeta.",
  },
];

const zonas = [
  { zona: "libre", ruta: "hub/src/app/proyectos/<tu-poc>/", regla: "Creas, editas y mergeas tú. Nadie más toca esto." },
  { zona: "libre", ruta: "hub/src/app/api/<tu-poc>/", regla: "Igual, salvo admin/, celulas/ y me/." },
  { zona: "jaime", ruta: "hub/supabase/", regla: "Toda migración SQL. Cambia la base de TODOS." },
  { zona: "jaime", ruta: "hub/src/lib/ · login/ · auth/ · proxy.ts", regla: "Autenticación y núcleo compartido." },
  { zona: "jaime", ruta: "layout.tsx · page.tsx · celula/ · celulas/", regla: "Home y plantilla que ven todas las células." },
  { zona: "jaime", ruta: "package.json · next.config.ts · .env.example", regla: "Build y despliegue. Romper esto tumba Darwin." },
  { zona: "jaime", ruta: "supplier-lab/ · dropshipper-lab/ · metrics-lab/ · agente-delivery/ · research-brain/", regla: "Carpetas de trabajo de otras personas." },
];

const agenda = [
  { t: "0:00 – 0:15", bloque: "Cómo es el repo y dónde vive tu POC", formato: "Expositivo" },
  { t: "0:15 – 0:35", bloque: "Rama, PR y merge: el ciclo completo", formato: "Demo en pantalla" },
  { t: "0:35 – 0:55", bloque: "Práctica 1 — crea tu rama y tu carpeta", formato: "Manos a la obra" },
  { t: "0:55 – 1:10", bloque: "Migraciones SQL: qué son y cuándo se necesitan", formato: "Expositivo" },
  { t: "1:10 – 1:25", bloque: "Jira: Epic por fase y cómo se conecta con tu POC", formato: "Expositivo" },
  { t: "1:25 – 1:45", bloque: "Práctica 2 — abre tu PR y mergéalo", formato: "Manos a la obra" },
  { t: "1:45 – 2:00", bloque: "Reglas base, qué no tocar y a quién preguntar", formato: "Cierre" },
];

export default function TallerPocsPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <a href="/guias" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Guías</a>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flex: "none",
              background: "var(--dropi-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>
              🛠️
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Taller de POCs
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Cómo crear un POC en el repo sin romper nada — 2 horas, sin conocimientos técnicos previos
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32, width: "100%" }}>

          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Esta guía es el guion del taller y queda como referencia después. Al final deberías poder crear tu propio POC,
            publicarlo y saber exactamente qué puedes tocar y qué no. Si nunca has clonado el repo, empieza
            por <a href="/guias/como-unirte-a-darwin" style={{ color: "var(--dropi)" }}>Cómo unirte a Darwin</a>; si quieres ver qué POCs
            ya existen, mira el <a href="/guias/directorio-pocs" style={{ color: "var(--dropi)" }}>Directorio de POCs</a>.
          </p>

          <SectionTitle>1. Cómo es el repo (lo que casi nadie sabe)</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            El repositorio <Code>dropi-agente-pm</Code> no es una aplicación. Son <strong>cuatro</strong> aplicaciones distintas más
            varias carpetas de documentos, todas conviviendo en el mismo sitio.
          </p>
          <Bloque>{`dropi-agente-pm/
├── hub/                  ← Darwin. LA ÚNICA que se publica en la web.
│   └── src/app/proyectos/<tu-poc>/   ← aquí va tu POC
├── supplier-lab/         ← app aparte, solo corre en tu computador
├── dropshipper-lab/      ← app aparte, solo corre en tu computador
├── metrics-lab/          ← app aparte, solo corre en tu computador
├── logistica-lab/        ← solo documentos (Markdown)
├── growth-marketing-lab/ ← solo documentos
├── agente-delivery/      ← solo documentos
├── research-brain/       ← research compartido entre células
└── memory/               ← memoria de los agentes, no se edita a mano`}</Bloque>
          <Callout tone="info">
            <strong>La consecuencia práctica:</strong> si tu POC no está dentro de <Code>hub/</Code>, nadie del equipo lo va a ver.
            Los otros tres proyectos no se publican — solo corren localmente con <Code>next dev</Code>.
          </Callout>

          <SectionTitle>2. Dónde va tu POC</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Siempre en una carpeta propia dentro de <Code>hub/src/app/proyectos/</Code>. El nombre de la carpeta es la dirección
            web de tu POC.
          </p>
          <Bloque>{`hub/src/app/proyectos/mi-experimento/page.tsx
        ↓
darwin.../proyectos/mi-experimento`}</Bloque>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Esta es la <strong>zona libre</strong>: nadie tiene que aprobarte nada ahí. Es a propósito — la idea es que puedas
            experimentar rápido sin pedir permiso.
          </p>

          <SectionTitle>3. El vocabulario mínimo</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {conceptos.map((c) => (
              <div key={c.termino} style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 14, color: "var(--fg)" }}>{c.termino}</strong>
                  <span style={{ fontSize: 13, color: "var(--dropi)", fontWeight: 600 }}>{c.corto}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: "6px 0 0" }}>{c.largo}</p>
              </div>
            ))}
          </div>

          <SectionTitle>4. El ciclo completo, de principio a fin</SectionTitle>
          <Bloque>{`# 1. Traer lo último que hizo el equipo
git checkout main
git pull

# 2. Crear tu rama (tu-nombre/lo-que-haces)
git checkout -b kate/poc-encuesta-csat

# 3. Trabajar: creas hub/src/app/proyectos/poc-encuesta-csat/page.tsx
#    Ver el resultado en vivo:
cd hub && npm run dev        →  http://localhost:3004

# 4. Guardar y subir
git add .
git commit -m "feat(brands): POC de encuesta CSAT"
git push -u origin kate/poc-encuesta-csat

# 5. Abrir el PR desde GitHub y mergearlo
#    Vercel publica solo en 1–2 minutos.`}</Bloque>

          <SectionTitle>5. Qué es una migración SQL y cuándo la necesitas</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Los datos de Darwin no viven en el repositorio: viven en <strong>Supabase</strong>, una base de datos en la nube.
            El repositorio solo guarda las <em>instrucciones</em> para construir esa base. Cada instrucción es un archivo
            <Code>.sql</Code> en <Code>hub/supabase/</Code>, y se ejecutan en orden. Eso es una migración: un cambio de
            estructura, como crear una tabla nueva o agregarle una columna a una que ya existe.
          </p>
          <Callout tone="info">
            <strong>La regla, en una línea:</strong> si tu POC solo <em>muestra</em> pantallas, <strong>no</strong> necesitas migración.
            Si tu POC tiene que <em>guardar</em> algo que siga ahí mañana, <strong>sí</strong>.
          </Callout>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Tu POC…</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 190 }}>¿Migración?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Muestra un flujo o un prototipo navegable", "No"],
                  ["Muestra datos que ya existen en Supabase", "No"],
                  ["Tiene un formulario cuyas respuestas hay que conservar", "Sí"],
                  ["Guarda una configuración por usuario", "Sí"],
                  ["Solo guarda algo mientras la pestaña está abierta", "No"],
                ].map(([caso, resp]) => (
                  <tr key={caso} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{caso}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: resp === "Sí" ? "#B45309" : "#047857",
                      }}>
                        {resp === "Sí" ? "Sí — requiere aprobación" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout tone="pending">
            ⚠️ <strong>Una migración cambia la base de todo el mundo.</strong> No es reversible con un &laquo;deshacer&raquo;.
            Por eso <Code>hub/supabase/</Code> requiere aprobación de Jaime. Si crees que necesitas una, pregunta antes de escribirla.
          </Callout>

          <SectionTitle>6. Cómo se conecta con Jira</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            El repo guarda el <em>trabajo</em>; Jira guarda el <em>seguimiento</em>. Viven en{" "}
            <Code>dropi-it.atlassian.net</Code> y los proyectos en uso son PROD, PRM, TECH, GRO, EXP, FIN, BRA y BAC.
          </p>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20 }}>
            <li>Un <strong>Epic nuevo por cada fase</strong>: al pasar de Discovery a POC se crea otro Epic, no se renombra el anterior.</li>
            <li>El título lleva la fase adelante: <Code>[POC] Encuesta CSAT</Code>.</li>
            <li>Todos los Epics del mismo proyecto comparten <strong>etiqueta</strong>: <Code>proy-encuesta-csat</Code>.</li>
            <li>El detalle completo está en <a href="/guias/nomenclatura-fases" style={{ color: "var(--dropi)" }}>Nomenclatura de fases</a>.</li>
          </ul>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Para reportar un bug no hace falta abrir Jira a mano: existe la skill <Code>bug-jira</Code>, que lo publica con el
            formato correcto. Ver el <a href="/guias/skills-disponibles" style={{ color: "var(--dropi)" }}>Directorio de Skills</a>.
          </p>

          <SectionTitle>7. Alcance y restricciones: qué puedes tocar</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 150 }}>Zona</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Ruta</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Regla</th>
                </tr>
              </thead>
              <tbody>
                {zonas.map((z) => (
                  <tr key={z.ruta} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", verticalAlign: "top" }}>
                      <span style={{
                        fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap",
                        color: z.zona === "libre" ? "#047857" : "#B45309",
                        background: z.zona === "libre" ? "#ECFDF5" : "#FFF6E5",
                        border: `1px solid ${z.zona === "libre" ? "#A7F3D0" : "#F0C766"}`,
                        padding: "3px 9px", borderRadius: 999,
                      }}>
                        {z.zona === "libre" ? "Libre" : "Aprueba Jaime"}
                      </span>
                    </td>
                    <td style={{ padding: "10px", verticalAlign: "top" }}>
                      <span style={{ fontSize: 12, fontFamily: "ui-monospace, Menlo, Consolas, monospace", color: "var(--fg)" }}>
                        {z.ruta}
                      </span>
                    </td>
                    <td style={{ padding: "10px", color: "var(--muted)", verticalAlign: "top" }}>{z.regla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout tone="danger">
            🚨 <strong>Hoy esta tabla es un acuerdo de equipo, no un candado.</strong> La lista sale del archivo <Code>CODEOWNERS</Code>,
            pero la rama <Code>main</Code> todavía no tiene <em>branch protection</em> activada en GitHub — verificado contra la API,
            que responde 404. En la práctica eso significa que <strong>cualquiera puede mergear a main sin aprobación</strong>,
            incluida una migración. Respetar la tabla es responsabilidad de cada quien hasta que se active la protección.
          </Callout>

          <SectionTitle>8. Problemas conocidos (que te vas a encontrar)</SectionTitle>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20 }}>
            <li>
              <strong>El <Code>.env.example</Code> está incompleto.</strong> Solo trae <Code>EXA_API_KEY</Code>, pero necesitas
              además <Code>NEXT_PUBLIC_SUPABASE_URL</Code> y <Code>NEXT_PUBLIC_SUPABASE_ANON_KEY</Code>. Pídeselas a quien te
              dio acceso — no las inventes ni uses un Supabase personal.
            </li>
            <li>
              <strong>Los números de las migraciones ya chocan.</strong> Hay dos archivos <Code>016_</Code> y tres <Code>022_</Code>.
              Si vas a crear una, confirma el número con Jaime antes; no asumas que el siguiente libre es el correcto.
            </li>
            <li>
              <strong>Tu rama se desactualiza rápido.</strong> Si llevas días sin traer <Code>main</Code>, vas a tener conflictos.
              Usa la skill <Code>sync-diario</Code> al empezar el día.
            </li>
          </ul>

          <SectionTitle>9. Agenda del taller (2 horas)</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 110 }}>Tiempo</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Bloque</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 160 }}>Formato</th>
                </tr>
              </thead>
              <tbody>
                {agenda.map((a) => (
                  <tr key={a.t} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", verticalAlign: "top" }}>
                      <span style={{ fontSize: 12, fontFamily: "ui-monospace, Menlo, Consolas, monospace", color: "var(--muted)" }}>{a.t}</span>
                    </td>
                    <td style={{ padding: "10px", color: "var(--fg)", verticalAlign: "top", fontWeight: a.formato === "Manos a la obra" ? 700 : 400 }}>
                      {a.bloque}
                    </td>
                    <td style={{ padding: "10px", color: "var(--muted)", verticalAlign: "top" }}>{a.formato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>10. La práctica: rama sandbox</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            En el taller nadie toca <Code>main</Code>. Se trabaja contra una rama de práctica que se borra al final, así que
            no hay forma de romper nada ni de publicar algo por accidente.
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginTop: 12 }}>
            <strong>Antes del taller</strong>, quien facilita crea la rama sandbox:
          </p>
          <Bloque>{`git checkout main && git pull
git checkout -b taller/sandbox
git push -u origin taller/sandbox`}</Bloque>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginTop: 12 }}>
            <strong>Cada participante</strong>, durante el taller:
          </p>
          <Bloque>{`# 1. Tu rama sale de la sandbox, NO de main
git fetch origin
git checkout -b tu-nombre/practica-poc origin/taller/sandbox

# 2. Crea tu carpeta y una pantalla mínima
#    hub/src/app/proyectos/practica-tu-nombre/page.tsx

# 3. Guarda y sube
git add .
git commit -m "practica: POC de tu-nombre"
git push -u origin tu-nombre/practica-poc

# 4. En GitHub, abre el PR con base = taller/sandbox  (NO main)
#    Revísalo con alguien al lado y mergéalo.`}</Bloque>
          <Callout tone="pending">
            ⚠️ <strong>El paso 4 es el que hay que vigilar.</strong> GitHub propone <Code>main</Code> como destino por defecto.
            Hay que cambiarlo a <Code>taller/sandbox</Code> a mano en cada PR. Si alguien lo deja en main, ese PR sí llega a producción.
          </Callout>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginTop: 12 }}>
            <strong>Al terminar</strong>, quien facilita borra la sandbox y las ramas de práctica desde GitHub. Todo lo que se
            hizo en el taller desaparece: era para aprender el flujo, no para dejar código.
          </p>

          <SectionTitle>11. A quién preguntar</SectionTitle>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20 }}>
            <li><strong>«¿Puedo tocar esto?»</strong> → mira la tabla de zonas. Si dice &laquo;Aprueba Jaime&raquo;, pregunta antes de escribir.</li>
            <li><strong>«¿Necesito migración?»</strong> → si tu POC guarda algo que debe seguir mañana, sí. Ante la duda, pregunta.</li>
            <li><strong>«Se me dañó la rama»</strong> → no borres nada. Casi todo en git se recupera si no fuerzas un push.</li>
            <li><strong>«¿Esto ya existe?»</strong> → revisa el <a href="/guias/directorio-pocs" style={{ color: "var(--dropi)" }}>Directorio de POCs</a> antes de arrancar.</li>
          </ul>

        </div>
      </div>
      <HubFooter />
    </main>
  );
}
