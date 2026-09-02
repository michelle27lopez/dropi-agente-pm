import HubFooter from "@/components/HubFooter";

function Phase({ label }: { label: string }) {
  return (
    <p style={{
      fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      color: "var(--dropi)", marginTop: 48, marginBottom: 20,
    }}>
      {label}
    </p>
  );
}

function Who({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.03em",
      textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, marginBottom: 10,
      background: "var(--dropi-light)", color: "var(--dropi)",
    }}>
      {children}
    </span>
  );
}

function Step({ n, who, title, children }: { n: number; who: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "40px 1fr", gap: 20,
      padding: "26px 0", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)",
        background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 15, color: "var(--fg)", flex: "none",
      }}>
        {n}
      </div>
      <div>
        <Who>{who}</Who>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", margin: "2px 0 8px" }}>{title}</h3>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}

function Term({ lines }: { lines: { text: string; kind?: "prompt" | "cmt" }[] }) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)",
      boxShadow: "0 8px 24px -12px rgba(0,0,0,0.25)",
    }}>
      <div style={{ display: "flex", gap: 6, padding: "9px 12px", background: "#1c1d28", borderBottom: "1px solid #2c2d3a" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#4b4c5c" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#4b4c5c" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#4b4c5c" }} />
        <span style={{ marginLeft: 6, fontSize: 11, color: "#6b6d80", alignSelf: "center" }}>Terminal</span>
      </div>
      <div style={{
        background: "#14151f", padding: "14px 16px", fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        fontSize: 13, overflowX: "auto",
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{ whiteSpace: "pre", color: l.kind === "cmt" ? "#6b6d80" : "#d6d9e6" }}>
            {l.kind === "prompt" ? <span style={{ color: "#ff9d5c" }}>$ </span> : null}
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// Distinto de <Term>: esto no es un comando de shell, es texto para pegar
// en el chat de Claude Code. La cabecera y el color lo dejan claro a simple vista.
function PromptBox({ children }: { children: string }) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)",
      boxShadow: "0 8px 24px -12px rgba(0,0,0,0.25)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", background: "var(--dropi)", }}>
        <span style={{ fontSize: 13 }}>💬</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
          Chat de Claude Code — no es un comando de terminal
        </span>
      </div>
      <pre style={{
        background: "#14151f", color: "#d6d9e6", padding: "16px 18px", margin: 0,
        fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 12.5,
        lineHeight: 1.6, whiteSpace: "pre-wrap", overflowX: "auto",
      }}>
        {children}
      </pre>
    </div>
  );
}

function Callout({ tone, icon, children }: { tone: "danger" | "warn" | "good"; icon: string; children: React.ReactNode }) {
  const colors = {
    danger: { bg: "#FEF2F2", border: "#FECACA", fg: "#DC2626" },
    warn: { bg: "#FFF7ED", border: "#FED7AA", fg: "#C2410C" },
    good: { bg: "#F0FDF4", border: "#BBF7D0", fg: "#15803D" },
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

const PROMPT = `Voy a documentar el vertical {VERTICAL} dentro de Darwin (repo dropi-agente-pm,
carpeta hub/), siguiendo el mismo patrón que ya existe en
hub/src/app/proveedores/ (revísalo primero como referencia de estructura y
componentes).

Antes de traer cualquier dato, llama a list_workspaces del MCP de UserPilot y
confírmame a cuáles tienes acceso, para elegir el correcto para mi vertical/país.

Reglas:
- Usa el MCP de UserPilot para traer NPS, CSAT, CES y cualquier encuesta
  relevante del workspace real — nunca inventes cifras.
- Cada dato debe llevar su <Fuente origen="..." corte="..."> — encuesta/segmento
  exacto y fecha de corte.
- Si algo no tiene evidencia, no lo fuerces: repórtalo con el componente
  <Vacio pregunta="..." dueno="..." />.
- Reutiliza los componentes de hub/src/app/proveedores/_components/ui.tsx (o
  crea un _components/ui.tsx análogo dentro de mi carpeta de vertical si no
  existe uno compartido) — no inventes estilos nuevos.
- Antes de escribir cualquier interpretación (como "esto es CSAT pero mide otra
  cosa"), verifica la pregunta real de la encuesta contra su nombre, no asumas
  que coinciden.
- No inventes personas, arquetipos ni citas si no hay entrevistas reales
  documentadas — en ese caso, un perfil cuantitativo (reglas + conteos) está
  bien, pero debe quedar explícito que no es investigación cualitativa.

Estructura esperada: Resumen (con tabla de "estado de la evidencia" por tema) +
una página por tema (Perfil, Satisfacción, Funcionalidades, Onboarding,
Herramientas, o los que apliquen a mi vertical).`;

export default function GuiaUserpilotMcpPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)",
          padding: "20px 32px", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flex: "none",
            background: "var(--dropi-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>
            🔌
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              Documentar tu vertical con UserPilot + Claude Code
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              <a href="/guias" style={{ color: "var(--muted)" }}>Guías</a> · Cómo replicar la doc de un vertical (como <a href="/proveedores" style={{ color: "var(--muted)" }}>/proveedores</a>) para el tuyo
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>
            El vertical Proveedores ya tiene una base de conocimiento completa en Darwin (<code>/proveedores</code>),
            construida cruzando datos reales de UserPilot con Claude Code. Esta guía es el mismo camino para
            que cualquier otro vertical (Marcas, Seller, el que sea) arme la suya, con su propio UserPilot.
          </p>

          <Phase label="Fase 1 · Conectar UserPilot" />

          <Step n={1} who="Lo haces tú" title="Instala Claude Code y clona el repo">
            Si ya trabajas en Darwin, este paso ya está resuelto — cada persona tiene su propio usuario de
            Claude. Solo falta tener el repo clonado.
            <Term lines={[
              { text: "git clone https://github.com/jaimeguevara-dropi/dropi-agente-pm.git", kind: "prompt" },
              { text: "cd dropi-agente-pm", kind: "prompt" },
            ]} />
          </Step>

          <Step n={2} who="Lo haces tú" title="Registra el servidor MCP de UserPilot">
            Esto se ejecuta en una <strong>terminal</strong> — no en el chat del asistente. Es el comando que
            le dice a Claude Code que existe un servidor de UserPilot disponible.
            <Term lines={[
              { text: "claude mcp add --transport http userpilot https://mcp.userpilot.io/mcp", kind: "prompt" },
            ]} />
          </Step>

          <Step n={3} who="Lo haces tú" title="Inicia sesión con la cuenta compartida">
            Abre (o reinicia) Claude Code en esa carpeta. La primera vez que se use una herramienta de
            UserPilot, se abre el navegador pidiendo login.
            <Callout tone="warn" icon="🔑">
              Hoy solo existe <strong>una cuenta de UserPilot para todo el equipo</strong> (<code>dropidiseno@dropi.co</code>),
              y todos tienen esas credenciales. Úsalas ahí — no hace falta pedirle nada a nadie.
            </Callout>
            <Callout tone="danger" icon="⚠️">
              Como es una cuenta compartida, cualquiera que se conecte aparece en{" "}
              <code>run.userpilot.io/mcp/connections</code> bajo el mismo nombre ("Team Diseño"). No hay forma
              de revocar el acceso de una sola persona ahí — si algún día hace falta, tocaría rotar la
              contraseña compartida completa.
            </Callout>
          </Step>

          <Phase label="Fase 2 · Generar tu documentación" />

          <Step n={4} who="Lo haces tú" title="Revisa /proveedores como referencia">
            Antes de pedirle nada al agente, entra a <a href="/proveedores">/proveedores</a> en Darwin y mira
            cómo está armado: Resumen + una página por tema, todo citando su fuente y su fecha de corte, y los
            vacíos marcados como tal en vez de rellenados.
          </Step>

          <Step n={5} who="Lo haces tú" title="Pega este prompt en el chat de Claude Code">
            Reemplaza <code>{"{VERTICAL}"}</code> por el nombre real (Marcas, Seller...). Esto sí va en el
            chat, no en la terminal.
            <PromptBox>{PROMPT}</PromptBox>
          </Step>

          <Callout tone="good" icon="✓">
            El agente va a pedir primero la lista de workspaces a los que la cuenta tiene acceso (Colombia,
            México, Ecuador) y a elegir el correcto antes de traer cualquier dato — si no lo hace, pídeselo
            explícitamente.
          </Callout>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
