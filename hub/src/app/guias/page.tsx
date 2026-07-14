import HubFooter from "@/components/HubFooter";

const guias = [
  {
    slug: "como-unirte-a-darwin",
    icon: "🧬",
    title: "Cómo unirte a Darwin",
    description: "Clonar el repo, configurar tu .env.local, correr el hub en local, entrar a tu home de célula y abrir tu primer PR.",
    tag: "Onboarding · Nueva célula",
  },
];

export default function GuiasIndexPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              📚 Guías
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Cómo se hacen las cosas en Darwin, paso a paso.
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {guias.map((g) => (
              <a
                key={g.slug}
                href={`/guias/${g.slug}`}
                className="hub-card"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: 20, textDecoration: "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flex: "none",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  {g.icon}
                </div>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "var(--dropi)",
                    background: "var(--dropi-light)", padding: "3px 8px", borderRadius: 999,
                  }}>
                    {g.tag}
                  </span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginTop: 8, marginBottom: 4 }}>
                    {g.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    {g.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
