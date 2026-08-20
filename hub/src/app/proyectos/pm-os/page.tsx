import { readdir, readFile } from "fs/promises";
import path from "path";

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) result[key] = value;
  }
  return result;
}

const STATUS_COLORS: Record<string, string> = {
  discovery: "#0EA5E9",
  definicion: "#7C3AED",
  desarrollo: "#F77F00",
  lanzamiento: "#10B981",
  pausado: "#6B7280",
};

async function getProjects() {
  const dir = path.join(
    process.cwd(),
    "..",
    "agente-delivery",
    "context",
    "projects"
  );
  try {
    const files = (await readdir(dir)).filter(
      (f) => f.endsWith(".md") && f !== "README.md"
    );
    return Promise.all(
      files.map(async (file) => {
        const content = await readFile(path.join(dir, file), "utf-8");
        const fm = parseFrontmatter(content);
        return {
          slug: file.replace(".md", ""),
          nombre: fm.nombre || file.replace(".md", ""),
          estado: fm.estado || "sin estado",
          equipo: fm.equipo || "",
          descripcion: fm.descripcion || "",
          color: fm.color || "#6B7280",
          icon: fm.icon || "📁",
        };
      })
    );
  } catch {
    return [];
  }
}

export default async function PMOSPage() {
  const projects = await getProjects();

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#0EA5E915",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            📋
          </div>
          <div>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--fg)",
                lineHeight: 1.2,
              }}
            >
              PM OS · Proyectos
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Katerine · Dropi · Brands · modo local
            </p>
          </div>
        </div>
        <a
          href="/celula/brands"
          style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}
        >
          ← Hub
        </a>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px" }}>
        {projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "var(--muted)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>📂</div>
            <p
              style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "var(--fg)" }}
            >
              Sin proyectos todavía
            </p>
            <p style={{ fontSize: 13 }}>
              Agrega archivos <code>.md</code> en{" "}
              <code>agente-delivery/context/projects/</code>
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {projects.map((p) => {
                const statusColor = STATUS_COLORS[p.estado] ?? "#6B7280";
                return (
                  <div
                    key={p.slug}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 24,
                      borderTop: `3px solid ${p.color}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: `${p.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                        }}
                      >
                        {p.icon}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: statusColor,
                          background: `${statusColor}15`,
                          padding: "3px 8px",
                          borderRadius: 20,
                          marginTop: 4,
                          textTransform: "capitalize",
                        }}
                      >
                        {p.estado}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--fg)",
                        marginBottom: 4,
                      }}
                    >
                      {p.nombre}
                    </h2>

                    {p.equipo && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          marginBottom: 8,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {p.equipo}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {p.descripcion || "Sin descripción"}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 48,
            textAlign: "center",
          }}
        >
          Fuente: <code>agente-delivery/context/projects/</code> · sin base de datos
        </p>
      </div>
    </main>
  );
}
