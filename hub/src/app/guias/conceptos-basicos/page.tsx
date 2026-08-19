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

function Tree({ lines }: { lines: { text: string; dim?: boolean }[] }) {
  return (
    <div style={{
      marginTop: 10, border: "1px solid var(--border)", borderRadius: 10,
      background: "var(--bg)", padding: "14px 18px", fontFamily: "ui-monospace, Menlo, Consolas, monospace",
      fontSize: 12.5, overflowX: "auto",
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "pre", color: l.dim ? "var(--muted)" : "var(--fg)", lineHeight: 1.7 }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}

export default function ConceptosBasicosPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)",
          padding: "20px 32px", display: "flex", flexDirection: "column", gap: 10,
        }}>
          <Breadcrumb items={[{ label: "Guías", href: "/guias" }, { label: "Conceptos básicos" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                🧭 Conceptos básicos
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Ramas, carpetas del repo y cómo se arranca a trabajar en cualquier proyecto del equipo.
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>
            Este documento cubre lo de base: qué es una rama de git y cómo se usan bien, cómo está organizado
            el repositorio en tu computador, y cómo se empieza a trabajar en un proyecto nuevo. Para el paso a
            paso detallado de instalar y correr el hub, ve a{" "}
            <a href="/guias/como-unirte-a-darwin" style={{ color: "var(--dropi)" }}>Cómo unirte a Darwin</a>.
          </p>

          <SectionTitle icon="🌿">Qué es una rama y por qué existen</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            <Code>main</Code> es la versión oficial del código — lo que está en producción, lo que ve todo el
            mundo. Una <strong>rama</strong> es una copia de trabajo donde alguien hace cambios sin tocar
            todavía esa versión oficial. Cuando termina, abre un <strong>Pull Request (PR)</strong> — literalmente
            &quot;¿puedes revisar esto y unirlo (merge) a main?&quot; — y una vez aprobado, esos cambios pasan a ser
            parte de lo oficial.
          </p>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            La razón de existir de las ramas es que dos personas puedan trabajar al mismo tiempo sin pisarse:
            si todos editaran <Code>main</Code> directamente, el código de una persona podría romper el de otra
            sin que nadie lo revisara antes.
          </p>

          <Callout tone="info" icon="🔀">
            No hace falta &quot;una rama por proyecto&quot;. En este repo conviven dos patrones y ambos son válidos:
            una <strong>rama personal continua</strong> (ej. <Code>design/mis-cambios-acumulados</Code>,{" "}
            <Code>jaime/cambios-pendientes</Code>) que se reutiliza para varias tareas seguidas de la misma
            persona, y una <strong>rama chica por tarea puntual</strong> (ej. <Code>fix/cyberdays-cierre-seleccion-14ago</Code>)
            para un cambio aislado que se quiere revisar y mergear rápido sin arrastrar nada más.
          </Callout>

          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginTop: 14 }}>
            El flujo típico, en comandos:
          </p>
          <Term lines={[
            { text: "# crear tu rama a partir de main", kind: "cmt" },
            { text: "git checkout -b tu-nombre/tu-tarea", kind: "prompt" },
            { text: "# ... haces cambios ...", kind: "cmt" },
            { text: "git add ." , kind: "prompt" },
            { text: 'git commit -m "descripción corta del cambio"', kind: "prompt" },
            { text: "git push -u origin tu-nombre/tu-tarea", kind: "prompt" },
            { text: "# luego abres el PR hacia main desde GitHub", kind: "cmt" },
          ]} />

          <Callout tone="warn" icon="🧹">
            Si tu rama personal acumula muchos archivos sin relación entre sí, no hace falta subir todo junto:
            se puede abrir un PR que solo incluya los archivos de la tarea que ya terminaste, y dejar el resto
            pendiente en la misma rama para el próximo PR. Así lo revisa quien aprueba sin ruido de cosas a medias.
          </Callout>

          <SectionTitle icon="🗂️">Cómo están organizadas las carpetas</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            <Code>dropi-agente-pm</Code> es un solo repositorio, pero adentro conviven varios espacios de
            trabajo distintos. No es una carpeta por persona al azar: cada una tiene un propósito fijo.
          </p>
          <Tree lines={[
            { text: "dropi-agente-pm/" },
            { text: "├── hub/              → Darwin. La app compartida (dashboards, guías, sprint, bugs...)", dim: true },
            { text: "│                      Todas las células construyen ahí, cada quien en su propia carpeta", dim: true },
            { text: "│                      dentro de hub/src/app/proyectos/<tu-proyecto>/" },
            { text: "│" },
            { text: "├── dropshipper-lab/  → workspace del agente de la célula Seller Success", dim: true },
            { text: "├── supplier-lab/     → workspace del agente de la célula Supplier Success", dim: true },
            { text: "├── logistica-lab/    → workspace del agente de la célula Logistic Success", dim: true },
            { text: "├── agente-delivery/  → workspace del agente de Kate (Brands / Data_Brands)", dim: true },
            { text: "├── metrics-lab/      → workspace del agente de métricas", dim: true },
            { text: "│                      cada *-lab/ tiene su propio CLAUDE.md con las reglas de ESE agente", dim: true },
            { text: "│" },
            { text: "├── research-brain/   → research compartido entre células (formato unificado)", dim: true },
            { text: "├── memory/           → memoria persistente de los agentes Claude (no se edita a mano)", dim: true },
            { text: "└── scratch/          → borradores personales, nunca es la fuente de verdad de nada", dim: true },
          ]} />
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            La diferencia clave: <strong>hub/</strong> es donde vive el producto que todos usan (Darwin). Las
            carpetas <Code>*-lab/</Code> y <Code>agente-delivery/</Code> son el espacio de trabajo del agente de
            IA de cada célula — ahí vive el contexto, las reglas y los documentos con los que ese agente
            responde. Si tu trabajo es de producto/analista dentro de tu célula, probablemente trabajas ahí. Si
            estás construyendo un dashboard o página visible para el equipo, trabajas en <Code>hub/</Code>.
          </p>

          <Callout tone="danger" icon="⛔">
            Los archivos dentro de las carpetas de otra persona (su <Code>*-lab/</Code>, su <Code>Documentos/</Code>,
            su <Code>.env.local</Code>) no se borran ni se sobreescriben sin preguntar — pueden ser trabajo en
            curso que no has visto todavía.
          </Callout>

          <SectionTitle icon="🚀">Cómo empezar a trabajar en un proyecto</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            El orden es el mismo sin importar en qué carpeta vayas a trabajar:
          </p>
          <ol style={{ fontSize: 14, color: "var(--muted)", lineHeight: 2, paddingLeft: 20 }}>
            <li>Clona el repo (una sola vez) y crea tu rama a partir de <Code>main</Code> actualizado.</li>
            <li>Ubica dónde vive tu tarea: ¿es una página/dashboard nuevo del hub → <Code>hub/src/app/proyectos/</Code>?
              ¿o es trabajo con tu agente de célula → tu <Code>*-lab/</Code> o <Code>agente-delivery/</Code>?</li>
            <li>Trabaja y confirma en commits pequeños y descriptivos, no en uno gigante al final.</li>
            <li>Sube tu rama y abre el PR contra <Code>main</Code>. Si tocaste <Code>hub/</Code>, Vercel genera
              automáticamente una URL de preview para revisar antes de aprobar.</li>
            <li>Una vez aprobado (o si tu cambio no toca el núcleo compartido, ver la guía de Darwin), se mergea.</li>
          </ol>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            Para el detalle exacto de instalar dependencias, configurar <Code>.env.local</Code> y correr el hub
            en tu máquina, la guía completa es{" "}
            <a href="/guias/como-unirte-a-darwin" style={{ color: "var(--dropi)" }}>Cómo unirte a Darwin</a>.
          </p>

          <SectionTitle icon="🛰️">Qué es Antigravity</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
            Antigravity es un IDE agéntico de Google — una herramienta de la misma familia que Claude Code o
            Cursor, donde un agente de IA puede leer y escribir código directamente en tu editor. No es una
            herramienta oficial ni compartida del equipo: hoy solo aparece referenciada en las rutas locales de
            Santiago, en documentos donde guarda contexto de sus propios agentes (por ejemplo el manual del
            agente de Discovery).
          </p>
          <Callout tone="info" icon="ℹ️">
            Si alguien del equipo quiere usar Antigravity (o cualquier otro editor con IA) para trabajar en su
            propia carpeta, es una elección personal de herramienta de trabajo — no cambia el flujo de git,
            ramas y PRs descrito arriba, que es el mismo sin importar con qué editor se escribió el código.
          </Callout>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
