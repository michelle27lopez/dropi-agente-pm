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

function Browser({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 10, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", background: "var(--card)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border)" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border)" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border)" }} />
        </div>
        <div style={{
          fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: "var(--muted)",
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", flex: 1,
        }}>
          {url}
        </div>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
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

export default function GuiaOnboardingPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)",
          padding: "20px 32px", display: "flex", alignItems: "center", gap: 12,
        }}>
          <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              Cómo unirte a Darwin
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              <a href="/guias" style={{ color: "var(--muted)" }}>Guías</a> · Onboarding de nueva célula
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>
            El hub interno donde cada célula construye su propio dashboard sobre una misma base de datos
            y un mismo despliegue. Esta guía cubre exactamente lo que necesitas hacer, en orden, para pasar
            de &quot;no tengo nada instalado&quot; a &quot;tengo mi propia página corriendo en preview&quot;.
          </p>

          <Phase label="Fase 1 · Acceso" />

          <Step n={1} who="Lo hace Jaime" title="Te agrega como colaboradora del repo">
            Desde GitHub → Settings → Collaborators. Sin esto no puedes clonar nada. Es un paso de 30 segundos,
            pero tiene que pasar primero.
          </Step>

          <Step n={2} who="Lo haces tú" title="Clona el repositorio">
            Una sola vez. Todo el hub — el tuyo, el de Sellers, el de Suppliers — vive en el mismo repo.
            <Term lines={[
              { text: "git clone https://github.com/jaimeguevara-dropi/dropi-agente-pm.git", kind: "prompt" },
              { text: "cd dropi-agente-pm/hub", kind: "prompt" },
            ]} />
          </Step>

          <Step n={3} who="Lo haces tú" title="Instala las dependencias">
            Node ya debe estar instalado en tu máquina. Puede tardar un par de minutos la primera vez.
            <Term lines={[{ text: "npm install", kind: "prompt" }]} />
          </Step>

          <Phase label="Fase 2 · Configuración" />

          <Step n={4} who="Lo haces tú" title="Crea tu archivo .env.local">
            Copia la plantilla y pídele a Jaime los dos valores marcados abajo — son públicos por diseño,
            te los puede pasar por Slack sin problema.
            <Term lines={[
              { text: "cp .env.example .env.local", kind: "prompt" },
              { text: "# abre .env.local y llena estas dos líneas:", kind: "cmt" },
              { text: "NEXT_PUBLIC_SUPABASE_URL=" },
              { text: "NEXT_PUBLIC_SUPABASE_ANON_KEY=" },
            ]} />
            <Callout tone="danger" icon="⛔">
              <strong>Nunca pidas ni copies</strong> SUPABASE_SERVICE_KEY de otro .env.local. Tiene acceso
              total a toda la base — borrar, editar o leer cualquier dato de cualquier célula. Si algo que
              construyes la necesita, avísale a Jaime y él la agrega solo en el servidor, nunca en tu máquina.
            </Callout>
          </Step>

          <Step n={5} who="Lo haces tú" title="Corre el hub en tu máquina">
            Queda disponible en tu propio localhost — nadie más lo ve, solo tú.
            <Term lines={[
              { text: "npm run dev", kind: "prompt" },
              { text: "▲ listo en http://localhost:3004", kind: "cmt" },
            ]} />
          </Step>

          <Step n={6} who="Lo haces tú" title="Inicia sesión con tu cuenta real">
            Es la misma cuenta de producción — al entrar caes automáticamente en tu propia home de célula,
            nunca en la de otra.
            <Browser url="localhost:3004/login">
              <div style={{ maxWidth: 220, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ height: 28, borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)" }} />
                <div style={{ height: 28, borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)" }} />
                <div style={{ height: 30, borderRadius: 6, background: "var(--dropi)", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                  Entrar
                </div>
              </div>
            </Browser>
            <p style={{ marginTop: 14, marginBottom: 0 }}>Te redirige directo a tu home:</p>
            <Browser url="localhost:3004/celula/brands">
              <p style={{ fontWeight: 700, color: "var(--fg)", fontSize: 14, margin: "0 0 10px" }}>Brands</p>
              <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", background: "var(--bg)" }}>
                Aún no hay proyectos cargados para esta célula.
              </div>
            </Browser>
          </Step>

          <Phase label="Fase 3 · Construir" />

          <Step n={7} who="Lo haces tú" title="Crea tu propia rama">
            Nunca se trabaja directo sobre main — cada quien en la suya.
            <Term lines={[{ text: "git checkout -b kate/mi-primer-dashboard", kind: "prompt" }]} />
          </Step>

          <Step n={8} who="Lo haces tú" title="Construye dentro de tu propia carpeta">
            Tu espacio libre es <code>hub/src/app/proyectos/&lt;tu-proyecto&gt;/</code>. Ahí puedes vibecodear lo que quieras.
            <Callout tone="warn" icon="🧭">
              <strong>Un solo límite:</strong> <code>hub/src/app/celula/</code> es la plantilla compartida de
              todas las homes — cualquier cambio ahí pasa por revisión de Jaime (está protegida en CODEOWNERS).
              Todo lo demás en tu carpeta de proyecto es tuyo.
            </Callout>
          </Step>

          <Step n={9} who="Lo haces tú" title="Sube tu rama y abre un PR">
            Vercel genera automáticamente una URL de preview de tu PR — puedes ver tu avance en vivo sin
            tocar producción.
            <Term lines={[
              { text: "git add .", kind: "prompt" },
              { text: 'git commit -m "feat(brands): mi primer dashboard"', kind: "prompt" },
              { text: "git push -u origin kate/mi-primer-dashboard", kind: "prompt" },
            ]} />
          </Step>

          <Step n={10} who="Lo haces tú" title="Mergea cuando esté lista">
            Como tu carpeta no toca el núcleo, no necesitas aprobación de Jaime para mergear a main — solo
            que exista el PR.
            <Callout tone="good" icon="✓">
              En cuanto mergea, Vercel despliega tu página a producción automáticamente. Ya está viva en Darwin.
            </Callout>
          </Step>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginTop: 48, marginBottom: 4 }}>
            Referencia rápida — qué compartir y qué no
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 0, marginBottom: 16 }}>
            Todo lo que necesitas saber sobre las variables de entorno, en una tabla.
          </p>
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["Variable", "¿Se comparte?", "Para qué sirve"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["NEXT_PUBLIC_SUPABASE_URL", "Sí", "Dirección del proyecto de Supabase. Es pública.", true],
                  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Sí", "Key pública del cliente. Sin RLS no serviría de nada — Darwin ya la tiene cerrada.", true],
                  ["SUPABASE_SERVICE_KEY", "Nunca", "Acceso total a la base, sin restricciones. Solo vive en Vercel.", false],
                  ["OPENAI_API_KEY", "Nunca", "Facturación directa a la cuenta de Dropi.", false],
                  ["SMTP_ / EVOLUTION_API_", "Nunca", "Envían correo y WhatsApp reales — no son de prueba.", false],
                ].map(([v, share, desc, ok]) => (
                  <tr key={v as string}>
                    <td style={{ padding: "10px 14px", fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>{v}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: ok ? "#15803D" : "#DC2626", borderBottom: "1px solid var(--border)" }}>{share}</td>
                    <td style={{ padding: "10px 14px", color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
