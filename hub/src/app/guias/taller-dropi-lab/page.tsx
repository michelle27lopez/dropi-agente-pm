import HubFooter from "@/components/HubFooter";
import Breadcrumb from "@/components/Breadcrumb";

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 18, fontWeight: 700, color: "var(--fg)", marginTop: 48, marginBottom: 12,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      {children}
    </h2>
  );
}

function Phase({ label }: { label: string }) {
  return (
    <p style={{
      fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      color: "var(--dropi)", marginTop: 56, marginBottom: 6,
    }}>
      {label}
    </p>
  );
}

function Callout({ tone, icon, children }: { tone: "danger" | "warn" | "good" | "info"; icon: string; children: React.ReactNode }) {
  const colors = {
    danger: { bg: "#FEF2F2", border: "#FECACA", fg: "#DC2626" },
    warn: { bg: "#FFF7ED", border: "#FED7AA", fg: "#C2410C" },
    good: { bg: "#F0FDF4", border: "#BBF7D0", fg: "#15803D" },
    info: { bg: "var(--dropi-light)", border: "var(--dropi)", fg: "var(--dropi)" },
  }[tone];
  return (
    <div style={{
      display: "flex", gap: 10, padding: "13px 15px", borderRadius: 10, marginTop: 14,
      background: colors.bg, border: `1px solid ${colors.border}`,
    }}>
      <span style={{ fontSize: 15, lineHeight: 1.5 }}>{icon}</span>
      <p style={{ margin: 0, fontSize: 13.5, color: colors.fg, lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
      padding: "2px 6px", fontSize: 12.5, color: "var(--fg)",
    }}>
      {children}
    </code>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{children}</p>;
}

/** Tarjeta que enfrenta algo que ya conocen de Figma con su nombre en git. */
function Analogia({
  palabra, figma, git, ojo,
}: { palabra: string; figma: string; git: string; ojo?: string }) {
  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)",
      overflow: "hidden", marginTop: 14,
    }}>
      <div style={{
        padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg)",
        display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{palabra}</span>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}>
        <div style={{ padding: "16px 18px", borderRight: "1px solid var(--border)" }}>
          <p style={{
            margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
            textTransform: "uppercase", color: "var(--muted)",
          }}>
            Esto ya lo sabes hacer
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--fg)", lineHeight: 1.6 }}>{figma}</p>
        </div>
        <div style={{ padding: "16px 18px", background: "var(--dropi-light)" }}>
          <p style={{
            margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
            textTransform: "uppercase", color: "var(--dropi)",
          }}>
            Aquí se llama así
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--fg)", lineHeight: 1.6 }}>{git}</p>
        </div>
      </div>
      {ojo ? (
        <div style={{
          padding: "11px 18px", borderTop: "1px solid var(--border)", background: "var(--bg)",
          fontSize: 13, color: "var(--muted)", lineHeight: 1.6,
        }}>
          <strong style={{ color: "var(--fg)" }}>Ojo:</strong> {ojo}
        </div>
      ) : null}
    </div>
  );
}

function Paso({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "40px 1fr", gap: 18,
      padding: "22px 0", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)",
        background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 15, color: "var(--fg)", flex: "none",
      }}>
        {n}
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", margin: "8px 0 6px" }}>{title}</h3>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}

/** Lo que se le escribe a Claude Code, en español, no comandos. */
function Frase({ dices, pasa }: { dices: string; pasa: string }) {
  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)",
      padding: "16px 18px", marginTop: 12,
    }}>
      <p style={{
        margin: 0, fontSize: 15, color: "var(--fg)", lineHeight: 1.6, fontWeight: 600,
      }}>
        <span style={{ color: "var(--dropi)" }}>“</span>{dices}<span style={{ color: "var(--dropi)" }}>”</span>
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
        {pasa}
      </p>
    </div>
  );
}

const agenda: { hora: string; que: string; detalle: string; quien: string }[] = [
  {
    hora: "0:00 – 0:10",
    que: "Abrimos y miramos el Lab vacío",
    detalle: "Vemos el link en vivo antes de tocar nada. Hoy está vacío, en dos horas va a tener 17 pantallas.",
    quien: "Michelle",
  },
  {
    hora: "0:10 – 0:40",
    que: "La teoría",
    detalle: "Las palabras raras traducidas a Figma. Jaime muestra el repo, Supabase y Vercel. Cerramos haciendo la vuelta completa en vivo, de principio a fin, para que la vean una vez antes de hacerla.",
    quien: "Michelle y Jaime",
  },
  {
    hora: "0:40 – 0:50",
    que: "Cada quien arranca",
    detalle: "Creas tu repositorio, lo clonas y pegas el prompt de arranque. Nadie construye todavía a mano.",
    quien: "Todos",
  },
  {
    hora: "0:50 – 1:35",
    que: "Construir",
    detalle: "Los 45 minutos de verdad: instalar, correr el SQL en tu Supabase, ver tu directorio corriendo en local, y ajustar con Claude Code. Michelle y Jaime van entrando a las salas de quien se atore.",
    quien: "Todos",
  },
  {
    hora: "1:35 – 1:45",
    que: "Publicar",
    detalle: "Cada quien corre npx vercel y guarda su link. Es el momento donde más gente se atora, así que se deja tiempo aparte.",
    quien: "Todos",
  },
  {
    hora: "1:45 – 2:00",
    que: "Ronda de demos",
    detalle: "Cada quien comparte su link y muestra en 1 minuto su directorio funcionando, con datos reales adentro. Cerramos viendo diecinueve versiones distintas de la misma idea.",
    quien: "Todos",
  },
];

export default function TallerDropiLabPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)",
          padding: "20px 32px", display: "flex", flexDirection: "column", gap: 10,
        }}>
          <Breadcrumb items={[{ label: "Guías", href: "/guias" }, { label: "Taller Dropi Lab" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                🧪 Taller Dropi Lab
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Dos horas para entender git de verdad y construir algo entre todos.
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, marginBottom: 0, maxWidth: 760 }}>
            Este taller es para Product Designers y Product Managers que nunca han tocado un repositorio y que
            probablemente han asentido mil veces cuando alguien dijo &quot;te abro un PR&quot;. La primera hora
            traducimos todas esas palabras. La segunda, cada quien construye su propia versión completa de{" "}
            <strong style={{ color: "var(--fg)" }}>Directorio de POCs</strong>, un directorio de los experimentos
            reales del equipo, de punta a punta: su repo, su base de datos, su publicación en internet.
          </p>

          <Callout tone="info" icon="🎯">
            Al final de las dos horas cada quien va a tener su propio Directorio de POCs publicado en internet,
            con datos reales de Dropi adentro, habiendo pasado por el flujo completo: crear el repo, clonarlo,
            construir con Claude Code, hacer commit, hacer push y ver el resultado publicado. No es un ejercicio
            de mentira: cada versión queda viva y la puedes seguir usando.
          </Callout>

          {/* ────────────────────────────  ANTES  ──────────────────────────── */}

          <Phase label="Antes del taller" />
          <SectionTitle icon="✅">Lo que tiene que estar listo</SectionTitle>
          <P>
            Esto es lo único que puede arruinar el taller. Si alguien llega ese día sin nada instalado, se le
            va la primera hora en descargas mientras el resto avanza. Hay que resolverlo <strong>días antes</strong>,
            no el mismo día.
          </P>

          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7 }}>
            Hoy cada persona construye su propia versión completa del directorio: su propio repo, su propia
            base de datos, su propia publicación. Por eso lo que tiene que estar listo es tuyo, no un acceso
            que te dé alguien más.
          </p>

          <div style={{ marginTop: 8 }}>
            <Paso n={1} title="Tener cuenta propia en GitHub, Supabase y Vercel">
              Las tres, creadas y con la sesión iniciada antes del taller. Son gratis. Si esperas a crearlas
              en vivo, se te va media hora en confirmar el correo mientras el resto ya está construyendo.
            </Paso>
            <Paso n={2} title="Tener Claude Code instalado y funcionando">
              Es la herramienta con la que vas a construir. Tú le hablas en español y él escribe el código.
              No vas a escribir comandos a mano en ningún momento.
            </Paso>
            <Paso n={3} title="Probar el flujo completo una vez, aunque sea con un proyecto de prueba">
              Crear un repo vacío en GitHub, clonarlo, y correr <Code>npx vercel</Code> una vez para ver que
              tu cuenta de Vercel ya está conectada. El paso a paso general de instalación está en{" "}
              <a href="/guias/como-unirte-a-darwin" style={{ color: "var(--dropi)" }}>Cómo unirte a Darwin</a>.
            </Paso>
          </div>

          <Callout tone="warn" icon="🕐">
            Vamos a abrir una hora de soporte el día anterior para quien no logre completar el checklist. Es
            mejor perder veinte minutos ese día que perder una hora del taller.
          </Callout>

          <SectionTitle icon="🧰">Lo que Michelle deja listo el día anterior</SectionTitle>
          <P>
            Como cada quien arma su propia base, lo que se prepara antes no es una base compartida sino un
            atajo y una referencia: para que nadie pierda tiempo pensando qué pedir ni escribiendo datos
            inventados.
          </P>
          <ul style={{ fontSize: 14, color: "var(--muted)", lineHeight: 2, paddingLeft: 20 }}>
            <li>Un repo de referencia ya publicado y funcionando, para mostrarlo en vivo en la teoría.</li>
            <li>Un prompt de arranque ya probado, que cada quien pega en Claude Code para no empezar de cero.</li>
            <li>Una lista de POCs reales del ecosistema Dropi, lista para copiar como datos semilla.</li>
          </ul>

          <Callout tone="good" icon="📦">
            Ese último punto importa más de lo que parece. Con datos reales adentro, cada quien ve su pantalla
            llenarse desde el primer minuto. Sin datos, todos estarían construyendo a ciegas contra una
            pantalla vacía o inventando información que no existe.
          </Callout>

          {/* ────────────────────────────  TEORÍA  ──────────────────────────── */}

          <Phase label="Parte 1 · La teoría · 30 minutos" />
          <SectionTitle icon="🗣️">Las palabras raras, traducidas</SectionTitle>
          <P>
            Todo lo que vas a oír hoy ya lo haces en Figma. Solo tiene otro nombre. Esta es la tabla de
            traducción completa, y con estas ocho palabras entiendes el noventa por ciento de las conversaciones
            técnicas del equipo.
          </P>

          <Analogia
            palabra="El repositorio"
            figma="El archivo de Figma del equipo. Uno solo, compartido, donde vive todo el proyecto y todo el mundo entra."
            git="El repositorio, o repo. Es la carpeta del proyecto, pero con memoria: guarda cada cambio que alguien hizo y quién lo hizo."
            ojo="La versión oficial, la que ve todo el mundo, se llama main. Nadie trabaja directo sobre ella."
          />

          <Analogia
            palabra="La rama"
            figma="Duplicar una página para probar algo sin dañar lo que ya estaba aprobado."
            git="Crear una rama. Es tu copia privada del proyecto. Puedes romper lo que quieras ahí adentro, nadie más lo ve."
            ojo="Es la razón por la que diecinueve personas pueden trabajar el mismo día sin pisarse."
          />

          <Analogia
            palabra="El commit"
            figma="Guardar una versión con nombre en el historial, para poder volver a ella después."
            git="Hacer un commit. Le pones un nombre corto a lo que acabas de hacer y queda marcado en la historia del proyecto."
            ojo="Se hacen varios pequeños, no uno gigante al final. Cada uno es un punto al que puedes devolverte."
          />

          <Analogia
            palabra="El push"
            figma="Que el archivo se sincronice con la nube para que los demás puedan verlo."
            git="Hacer push. Subes tu rama a internet. Hasta ese momento tu trabajo solo existía en tu computador."
          />

          <Analogia
            palabra="El pull"
            figma="Abrir el archivo y que te bajen los cambios que otros hicieron mientras no estabas."
            git="Hacer pull. Te traes a tu computador lo que los demás ya subieron."
            ojo="Vale la pena hacerlo antes de empezar a trabajar, para no construir sobre una versión vieja."
          />

          <Analogia
            palabra="El Pull Request"
            figma="Mandar tu propuesta a revisión antes de que entre al archivo oficial."
            git="Abrir un PR. Es decir en voz alta: terminé esto, revísenlo antes de meterlo a la versión oficial."
            ojo="Todo el mundo dice PR, nadie dice Pull Request completo. Hoy tu repo es solo tuyo, así que vas a hacer push directo a tu main en vez de abrir un PR — pero el concepto es el mismo que vas a usar después en Darwin, donde sí hay más gente en el mismo repo."
          />

          <Analogia
            palabra="El merge"
            figma="Que tu propuesta quede aprobada y pase a ser parte del archivo principal."
            git="Hacer merge. Tu trabajo entra a main y ya es parte de lo oficial. Hoy, como tu repo es solo tuyo, mergear es simplemente hacer push a tu main — apenas lo haces, Vercel publica tu directorio."
          />

          <Analogia
            palabra="El conflicto"
            figma="Dos personas movieron la misma capa al mismo tiempo y hay que decidir cuál queda."
            git="Un conflicto. Pasa cuando dos ramas cambiaron exactamente la misma línea. No es un error ni algo que hiciste mal."
            ojo="Hoy no lo vas a vivir en vivo, porque cada quien trabaja en su propio repo. Es lo que te vas a topar el día que trabajes junto a alguien más en el mismo repositorio — como ya pasa en Darwin."
          />

          <SectionTitle icon="🗄️">Y las dos que no son de git</SectionTitle>

          <Analogia
            palabra="Supabase"
            figma="El lugar donde vive la información, aparte del diseño. Como si la lista de POCs viviera en un Sheet y la pantalla solo la mostrara."
            git="Supabase es la base de datos. Guarda los POCs, quién los creó y en qué van. Si borras la pantalla, los datos siguen ahí."
            ojo="Por eso una pantalla puede cambiar mil veces sin que se pierda un solo dato."
          />

          <Analogia
            palabra="Vercel"
            figma="El botón de compartir de Figma, pero para código: convierte lo que escribiste en un link que cualquiera puede abrir."
            git="Vercel publica la página en internet. Cada vez que alguien mergea, Vercel actualiza el sitio solo, en menos de un minuto."
            ojo="También le da un link temporal a cada PR, así puedes ver tu pantalla funcionando antes de que entre a lo oficial."
          />

          <Callout tone="info" icon="📖">
            Si quieres el detalle más técnico de ramas y de cómo está organizado el repositorio por dentro,
            está en <a href="/guias/conceptos-basicos" style={{ color: "var(--dropi)" }}>Conceptos básicos</a>.
            Esta guía es la versión corta para arrancar.
          </Callout>

          {/* ────────────────────────────  LA VUELTA  ──────────────────────────── */}

          <SectionTitle icon="🔄">La vuelta completa</SectionTitle>
          <P>
            Este es el recorrido entero de una idea, desde que está en tu cabeza hasta que está publicada.
            Como hoy tu repo es solo tuyo, el recorrido es más corto que el de Darwin: no hay rama, PR ni
            merge de por medio, vas directo a tu <Code>main</Code>. Lo vamos a hacer una vez en vivo antes de
            que ustedes lo hagan.
          </P>

          <div style={{ marginTop: 8 }}>
            <Paso n={1} title="Creas tu repositorio">
              Uno nuevo y vacío en tu cuenta de GitHub. Le pones un nombre, por ejemplo{" "}
              <Code>directorio-de-pocs-michelle</Code>.
            </Paso>
            <Paso n={2} title="Lo clonas a tu computador">
              Lo bajas a una carpeta vacía. Ahí es donde va a vivir tu proyecto mientras lo construyes.
            </Paso>
            <Paso n={3} title="Construyes">
              Le pegas el prompt de arranque a Claude Code, en español. Revisas cómo va quedando en tu
              computador, ajustas, vuelves a pedir. Aquí es donde se van los 50 minutos.
            </Paso>
            <Paso n={4} title="Guardas con nombre">
              Cada vez que algo queda funcionando, lo guardas con un nombre corto. Ese es el commit.
            </Paso>
            <Paso n={5} title="Lo subes">
              Haces push directo a tu <Code>main</Code>. Como el repo es solo tuyo, no hay que pedirle permiso
              a nadie para que entre.
            </Paso>
            <Paso n={6} title="Lo publicas">
              Corres <Code>npx vercel</Code>. En menos de un minuto tienes un link que cualquiera puede abrir,
              con tu directorio funcionando de verdad.
            </Paso>
          </div>

          {/* ────────────────────────────  FRASES  ──────────────────────────── */}

          <SectionTitle icon="💬">Lo que le dices a Claude Code</SectionTitle>
          <P>
            No vas a escribir un solo comando. Le hablas en español y él hace el resto. Estas cinco frases
            cubren todo el taller, y sirven igual el resto del año.
          </P>

          <Frase
            dices="Arma el proyecto usando el prompt de arranque que te voy a pegar"
            pasa="Con eso construye el Next.js, la conexión a Supabase y las pantallas base. Es tu punto de partida, luego le sigues pidiendo ajustes."
          />
          <Frase
            dices="Guarda lo que llevo con un nombre que describa el cambio"
            pasa="Hace el commit por ti y le pone un nombre entendible."
          />
          <Frase
            dices="Súbelo a mi repositorio en GitHub"
            pasa="Hace push directo a tu main. Como el repo es solo tuyo, no hace falta abrir un PR ni esperar revisión."
          />
          <Frase
            dices="Publícalo con Vercel"
            pasa="Corre el deploy y te devuelve el link. Ese link es lo que vas a compartir al final del taller."
          />
          <Frase
            dices="Me salió este error, ayúdame a resolverlo"
            pasa="Le pegas el mensaje de error tal cual salió. Es la frase que más vas a usar hoy, sin miedo."
          />

          {/* ────────────────────────────  MIEDOS  ──────────────────────────── */}

          <SectionTitle icon="😌">Lo que NO tienes que hacer</SectionTitle>
          <P>
            Esta sección existe porque la mayoría llega asustada. Nada de lo siguiente es requisito para el taller.
          </P>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12, marginTop: 14,
          }}>
            {[
              ["No tienes que saber programar", "Le describes lo que quieres en español. Tu trabajo es decidir qué debe mostrar la pantalla y cómo se debe ver, que es justo lo que ya sabes hacer."],
              ["No puedes romper nada", "Es tu propio proyecto. Si algo sale mal, en el peor de los casos borras la carpeta y vuelves a clonar tu repo. Nadie más se entera."],
              ["No tienes que memorizar comandos", "Las frases de arriba son suficientes. No hay examen."],
              ["No tienes que terminar perfecto", "Si tu directorio queda a medias, igual lo publicas así. El punto es que exista y que lo hayas hecho tú de principio a fin."],
              ["No tienes que pedir permiso", "Tu directorio es tuyo. Decides el orden, los textos, qué se ve primero. Nadie va a revisar tu criterio de diseño."],
              ["No estás compitiendo", "Nadie va a comparar tu versión con la de al lado. Al final cada quien muestra la suya, no hay una sola respuesta correcta."],
            ].map(([t, d]) => (
              <div key={t} style={{
                border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)",
                padding: "16px 18px",
              }}>
                <p style={{ margin: "0 0 6px", fontSize: 14.5, fontWeight: 700, color: "var(--fg)", lineHeight: 1.4 }}>
                  {t}
                </p>
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>

          {/* ────────────────────────────  AGENDA  ──────────────────────────── */}

          <Phase label="El día del taller" />
          <SectionTitle icon="🗓️">Cómo se reparten las dos horas</SectionTitle>

          <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflowX: "auto", marginTop: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 640 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["Hora", "Qué pasa", "Detalle", "Quién"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "11px 14px", fontSize: 11, textTransform: "uppercase",
                      letterSpacing: "0.04em", color: "var(--muted)", borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agenda.map((a) => (
                  <tr key={a.hora}>
                    <td style={{
                      padding: "13px 14px", fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                      fontSize: 12.5, color: "var(--dropi)", borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap", verticalAlign: "top", fontWeight: 600,
                    }}>
                      {a.hora}
                    </td>
                    <td style={{
                      padding: "13px 14px", fontWeight: 700, color: "var(--fg)",
                      borderBottom: "1px solid var(--border)", verticalAlign: "top",
                    }}>
                      {a.que}
                    </td>
                    <td style={{
                      padding: "13px 14px", color: "var(--muted)", lineHeight: 1.6,
                      borderBottom: "1px solid var(--border)", verticalAlign: "top",
                    }}>
                      {a.detalle}
                    </td>
                    <td style={{
                      padding: "13px 14px", color: "var(--muted)", borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap", verticalAlign: "top",
                    }}>
                      {a.quien}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout tone="good" icon="🎬">
            El momento importante es el de 1:45. Cada quien comparte su link de Vercel y muestra su propia
            versión funcionando. Ver diecinueve directorios distintos, todos con los mismos datos reales pero
            armados con criterio propio, es el punto del taller entero.
          </Callout>

          <Callout tone="warn" icon="⏱️">
            El bloque de publicar (1:35–1:45) está separado a propósito. Crear el proyecto en Vercel y conectar
            las variables de entorno es el paso donde más gente se atora la primera vez — mejor darle su
            propio espacio que dejarlo apretado al final.
          </Callout>

          {/* ────────────────────────────  SOS  ──────────────────────────── */}

          <SectionTitle icon="🆘">Si algo se rompe ese día</SectionTitle>
          <P>
            Se va a romper algo, siempre pasa. La regla es no quedarte callado veinte minutos peleando solo.
          </P>
          <ol style={{ fontSize: 14, color: "var(--muted)", lineHeight: 2, paddingLeft: 20 }}>
            <li>Cópiale el error a Claude Code y pídele que lo arregle. Nueve de cada diez veces se resuelve ahí.</li>
            <li>Si sigue, escribe en el chat de la llamada. Michelle o Jaime entran a tu sala.</li>
            <li>Si tu rama quedó enredada más allá de arreglo, se borra y se empieza de nuevo. Toma dos minutos y no afecta a nadie más.</li>
          </ol>

          <Callout tone="danger" icon="⛔">
            Lo único que sí es delicado: nunca pegues claves ni contraseñas en el chat de la llamada ni en un
            archivo del proyecto. Si algo que estás construyendo necesita una, avísale a Jaime y él la agrega
            donde corresponde.
          </Callout>

          <div style={{
            marginTop: 48, padding: "20px 22px", border: "1px solid var(--border)",
            borderRadius: 14, background: "var(--bg)",
          }}>
            <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--fg)" }}>Falta una cosa:</strong> a cada persona se le puede pedir
              que le dé énfasis a una vista distinta de su directorio (lista, detalle, filtros, búsqueda), para
              que en la ronda de demos se vea variedad y no diecinueve pantallas idénticas. Ese reparto se
              comparte aparte, porque depende de quién confirme asistencia.
            </p>
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
