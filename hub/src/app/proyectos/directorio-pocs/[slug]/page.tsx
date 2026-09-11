import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import HubFooter from "@/components/HubFooter";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";
import { registry } from "../detalle/registry";

export const dynamic = "force-dynamic";

export default async function PocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const { slug } = await params;

  const { data: project } = await supabase!
    .from("projects")
    .select("id, name, project_code, summary, celula_owner_id")
    .eq("type", "POC")
    .ilike("project_code", slug)
    .maybeSingle();

  if (!project) return notFound();

  let celulaNombre: string | null = null;
  if (project.celula_owner_id) {
    const { data: celula } = await supabase!
      .from("celulas")
      .select("nombre")
      .eq("id", project.celula_owner_id)
      .maybeSingle();
    celulaNombre = celula?.nombre ?? null;
  }

  const poc = {
    id: project.id,
    name: project.name,
    project_code: project.project_code,
    summary: project.summary,
    celulaNombre,
  };

  const CustomDetail = project.project_code ? registry[project.project_code.toLowerCase()] : undefined;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="gnav-page" style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <Breadcrumb
          items={[
            { label: "Proyectos", href: "/proyectos" },
            { label: "Directorio de POCs", href: "/proyectos/directorio-pocs" },
            { label: poc.project_code ?? poc.name },
          ]}
        />

        <div style={{ marginTop: 20 }}>
          {CustomDetail ? (
            <CustomDetail poc={poc} />
          ) : (
            <div
              style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: 28,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", textTransform: "uppercase" }}>
                {poc.project_code ?? "Sin código"}
              </span>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--fg)", margin: "8px 0 12px" }}>
                {poc.name}
              </h1>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{poc.summary}</p>
              {poc.celulaNombre && (
                <p style={{ marginTop: 16, fontSize: 12, color: "var(--info)" }}>Célula: {poc.celulaNombre}</p>
              )}
              <p style={{ marginTop: 24, fontSize: 12.5, color: "var(--muted)" }}>
                Esta es la ficha genérica — todavía nadie propuso su propia versión en{" "}
                <code>detalle/{poc.project_code?.toLowerCase()}.tsx</code>.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/proyectos/directorio-pocs"
          style={{ display: "inline-block", marginTop: 20, fontSize: 13, color: "var(--dropi)" }}
        >
          ← Volver al directorio
        </Link>
      </div>
      <HubFooter />
    </main>
  );
}
