import Link from "next/link";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import HubFooter from "@/components/HubFooter";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export const dynamic = "force-dynamic";

type PocRow = {
  id: string;
  name: string;
  project_code: string | null;
  summary: string | null;
  celula_owner_id: string | null;
};

type Celula = { id: string; nombre: string; slug: string };

export default async function DirectorioPocsPage({
  searchParams,
}: {
  searchParams: Promise<{ celula?: string; q?: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { celula, q } = await searchParams;

  const [{ data: pocsData, error: pocsError }, { data: celulasData }] = await Promise.all([
    supabase!.from("projects").select("id, name, project_code, summary, celula_owner_id").eq("type", "POC"),
    supabase!.from("celulas").select("id, nombre, slug").order("nombre"),
  ]);

  const celulas = (celulasData ?? []) as Celula[];
  const celulaPorId = new Map(celulas.map((c) => [c.id, c]));
  let pocs = (pocsData ?? []) as PocRow[];

  if (celula) {
    const celulaSeleccionada = celulas.find((c) => c.slug === celula);
    pocs = pocs.filter((p) => p.celula_owner_id === celulaSeleccionada?.id);
  }
  if (q) {
    const needle = q.toLowerCase();
    pocs = pocs.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.summary ?? "").toLowerCase().includes(needle)
    );
  }

  pocs.sort((a, b) => a.name.localeCompare(b.name));

  // Cuántos POC hay por célula, sobre el total sin filtrar — para los chips.
  const totalPorCelula = new Map<string, number>();
  for (const p of (pocsData ?? []) as PocRow[]) {
    if (!p.celula_owner_id) continue;
    totalPorCelula.set(p.celula_owner_id, (totalPorCelula.get(p.celula_owner_id) ?? 0) + 1);
  }
  const celulasConPocs = celulas.filter((c) => totalPorCelula.get(c.id));

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="gnav-page" style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "Directorio de POCs" }]} />

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginTop: 12 }}>
          🧪 Directorio de POCs
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, maxWidth: 640 }}>
          Todas las pruebas de concepto del ecosistema Dropi, de todas las células, en un solo lugar.
        </p>

        <form action="/proyectos/directorio-pocs" method="get" style={{ marginTop: 28, maxWidth: 420 }}>
          {celula ? <input type="hidden" name="celula" value={celula} /> : null}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--gray-400)", pointerEvents: "none", fontSize: 15,
              }}
            >
              🔍
            </span>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre o descripción…"
              style={{
                width: "100%", height: 40, borderRadius: 10, border: "1px solid var(--border)",
                background: "var(--card)", color: "var(--fg)", fontSize: 13,
                padding: "0 14px 0 36px", fontFamily: "inherit", outline: "none",
              }}
            />
          </div>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 28px" }}>
          <Link
            href={q ? `/proyectos/directorio-pocs?q=${encodeURIComponent(q)}` : "/proyectos/directorio-pocs"}
            style={{
              fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 999,
              border: `1px solid ${!celula ? "var(--dropi)" : "var(--border)"}`,
              background: !celula ? "var(--dropi-light)" : "var(--card)",
              color: !celula ? "var(--dropi)" : "var(--muted)",
            }}
          >
            Todas ({(pocsData ?? []).length})
          </Link>
          {celulasConPocs.map((c) => {
            const params = new URLSearchParams();
            params.set("celula", c.slug);
            if (q) params.set("q", q);
            const activa = celula === c.slug;
            return (
              <Link
                key={c.id}
                href={`/proyectos/directorio-pocs?${params.toString()}`}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 999,
                  border: `1px solid ${activa ? "var(--dropi)" : "var(--border)"}`,
                  background: activa ? "var(--dropi-light)" : "var(--card)",
                  color: activa ? "var(--dropi)" : "var(--muted)",
                }}
              >
                {c.nombre} ({totalPorCelula.get(c.id)})
              </Link>
            );
          })}
        </div>

        {pocsError ? (
          <p style={{ fontSize: 13, color: "var(--danger)" }}>
            No se pudo leer la tabla de proyectos: {pocsError.message}
          </p>
        ) : pocs.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Sin resultados para este filtro.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {pocs.map((p) => {
              const slug = p.project_code ? p.project_code.toLowerCase() : p.id;
              const celulaNombre = p.celula_owner_id ? celulaPorId.get(p.celula_owner_id)?.nombre : undefined;
              return (
                <Link
                  key={p.id}
                  href={`/proyectos/directorio-pocs/${slug}`}
                  style={{
                    display: "block", padding: "18px 18px", borderRadius: 14,
                    border: "1px solid var(--border)", background: "var(--card)",
                    textDecoration: "none", transition: "border-color .15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {p.project_code ?? "Sin código"}
                    </span>
                    {celulaNombre && (
                      <span
                        style={{
                          fontSize: 11, fontWeight: 600, color: "var(--info)", background: "var(--info-tint)",
                          padding: "2px 8px", borderRadius: 999,
                        }}
                      >
                        {celulaNombre}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: "8px 0 6px" }}>
                    {p.name}
                  </h2>
                  <p
                    style={{
                      fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: 0,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}
                  >
                    {p.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <HubFooter />
    </main>
  );
}
