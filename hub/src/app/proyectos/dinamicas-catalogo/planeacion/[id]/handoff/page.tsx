"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NODE_DEFINITIONS, NodeKey, NodeData, parseMilestones } from "../../nodes";

type Campaign = { id: string; name: string; status: string; current_node: number };
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };

const PRINT_CSS = `
  @media print { .no-print { display: none !important; } body { background: #fff !important; } }
`;

function chips(value: string | undefined): string[] {
  if (!value) return [];
  return value.split("||").filter(Boolean);
}

function Chips({ value, color = "#F77F00" }: { value?: string; color?: string }) {
  const items = chips(value);
  if (!items.length) return <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item, i) => (
        <span key={i} style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({ num, title, color, children }: { num: number; title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${color}15`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
          {num}
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, alignItems: "start" }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#6b7280", paddingTop: 2 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "#111827", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
        {children ?? (value?.trim() ? value : <span style={{ color: "#9ca3af" }}>—</span>)}
      </div>
    </div>
  );
}

export default function PlaneacionHandoffPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, n]) => {
      setCampaign(camp);
      setNodes(Array.isArray(n) ? n : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Cargando handoff...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  // Por node_key, no por índice — así no se rompe si el orden de nodos cambia.
  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const mecanica = nd("mecanica");
  const elegibilidad = nd("elegibilidad");
  const calendario = nd("calendario");
  const milestones = parseMilestones(calendario.milestones);
  const lastMilestone = milestones[milestones.length - 1];
  const convocatoria = nd("convocatoria");
  const vitrina = nd("vitrina");
  const handoff = nd("handoff");
  const resultados = nd("resultados");
  const decision = nd("decision");

  const today = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const totalNodes = NODE_DEFINITIONS.length;
  const completedCount = nodes.filter((n) => n.completed).length;
  const hasResultados = Object.keys(resultados).length > 0;
  const hasDecision = Object.keys(decision).length > 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <header className="no-print" style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${id}`)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}>
          ← Wizard
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{campaign.name}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#F77F00", background: "#FFF3E0", padding: "2px 8px", borderRadius: 20 }}>Handoff</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{completedCount} / {totalNodes} nodos completados</span>
          <button onClick={() => window.print()} style={{ background: "#F77F00", color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            ↓ Descargar PDF
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ background: "linear-gradient(135deg, #F77F00 0%, #F7A800 100%)", borderRadius: 18, padding: "40px 40px 36px", marginBottom: 32, color: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Dropi · Experimento lean · Handoff de campaña
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2 }}>{identidad.name || campaign.name}</h1>
          {identidad.short_description && (
            <p style={{ fontSize: 14, opacity: 0.9, margin: "0 0 24px", lineHeight: 1.6, maxWidth: 600 }}>{identidad.short_description}</p>
          )}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Objetivo", value: identidad.objective || "—" },
              { label: "País", value: chips(identidad.country).join(", ") || "—" },
              { label: "Responsable", value: identidad.responsible || "—" },
              { label: "Cierre", value: lastMilestone?.date || "—" },
              { label: "Generado", value: today },
            ].map(({ label, value }) => (
              <div key={label} style={{ fontSize: 13 }}>
                <div style={{ opacity: 0.7, fontWeight: 600, fontSize: 11, marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <Section num={1} title="Objetivo y meta" color="#F77F00">
          <Row label="Objetivo"><Chips value={identidad.objective} /></Row>
          <Row label="Hipótesis" value={identidad.hypothesis} />
          <Row label="Resultado esperado" value={identidad.expected_result} />
          <Row label="¿Descuento?" value={mecanica.requires_discount} />
        </Section>

        <Section num={2} title="Elegibilidad" color="#0EA5E9">
          <Row label="Universo base" value={elegibilidad.universe} />
          <Row label="Tipo de supplier"><Chips value={elegibilidad.supplier_type} color="#0EA5E9" /></Row>
          <Row label="Categorías" value={elegibilidad.categories_scope === "Todas las categorías" ? "Todas las categorías" : elegibilidad.categories_theme} />
          <Row label="Stock mínimo" value={elegibilidad.min_stock} />
          {elegibilidad.min_discount && <Row label="Descuento mínimo" value={elegibilidad.min_discount} />}
          {elegibilidad.eligibility_notes && <Row label="Notas o excepciones" value={elegibilidad.eligibility_notes} />}
        </Section>

        <Section num={3} title="Calendario" color="#8B5CF6">
          {milestones.length === 0 ? (
            <Row label="Hitos" value="" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, alignItems: "start" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#8B5CF6" }}>{m.date || "Sin fecha"}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{m.label}</div>
                    {m.notes && <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2, whiteSpace: "pre-wrap" }}>{m.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {calendario.calendar_notes && <Row label="Notas" value={calendario.calendar_notes} />}
        </Section>

        <Section num={4} title="Convocatoria y postulación" color="#F59E0B">
          <Row label="Tipo de convocatoria" value={convocatoria.invite_type} />
          <Row label="Canales"><Chips value={convocatoria.channels} color="#F59E0B" /></Row>
          <Row label="Mecanismo de postulación" value={convocatoria.submission_mechanism} />
          <Row label="Link de postulación" value={convocatoria.submission_link} />
          {convocatoria.submission_notes && <Row label="Datos adicionales a capturar" value={convocatoria.submission_notes} />}
        </Section>

        <Section num={5} title="Vitrina" color="#10B981">
          <Row label="Tipo de vitrina" value={vitrina.showcase_type} />
          <Row label="Nombre visible" value={vitrina.showcase_name} />
          <Row label="Descripción" value={vitrina.showcase_description} />
          <Row label="CTA" value={vitrina.cta_main} />
          {vitrina.badges && <Row label="Badges"><Chips value={vitrina.badges} color="#10B981" /></Row>}
          <Row label="Canales de distribución"><Chips value={vitrina.distribution_channels} color="#10B981" /></Row>
          <Row label="Responsable de publicación" value={vitrina.publication_responsible} />
        </Section>

        <Section num={6} title="Plan de ejecución" color="#6366F1">
          <Row label="Cronograma" value={handoff.schedule} />
          <Row label="Responsables por área" value={handoff.area_responsibilities} />
          {handoff.risks && <Row label="Riesgos" value={handoff.risks} />}
          <Row label="Formato del documento" value={handoff.handoff_format} />
          <Row label="Audiencia"><Chips value={handoff.handoff_audience} color="#6366F1" /></Row>
        </Section>

        {hasResultados && (
          <Section num={7} title="Resultados (Cierre)" color="#F77F00">
            <Row label="Invitados → Postularon → Aprobados" value={`${resultados.suppliers_invited || "—"} → ${resultados.suppliers_applied || "—"} → ${resultados.suppliers_approved || "—"}`} />
            <Row label="Dropshippers impactados / productos tomados" value={`${resultados.dropshippers_impacted || "—"} / ${resultados.products_taken || "—"}`} />
            <Row label="Órdenes / GMV" value={`${resultados.orders_generated || "—"} / $${resultados.gmv_generated || "—"}`} />
            <Row label="Real vs. esperado" value={resultados.vs_expected} />
            <Row label="Aprendizajes" value={resultados.learnings} />
            <Row label="Dashboard">
              <a href={`/proyectos/dinamicas-catalogo/planeacion/${id}/dashboard`} style={{ color: "#F77F00", fontWeight: 600 }}>Ver dashboard de esta campaña →</a>
            </Row>
          </Section>
        )}

        {hasDecision && (
          <Section num={8} title="Decisión (Cierre)" color="#8B5CF6">
            <Row label="Decisión" value={decision.decision} />
            <Row label="Justificación" value={decision.decision_rationale} />
            {decision.dev_requirements && <Row label="Qué necesitaría el desarrollo" value={decision.dev_requirements} />}
            {decision.next_experiment && <Row label="Siguiente experimento" value={decision.next_experiment} />}
          </Section>
        )}

        <div style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 32 }}>
          Dropi · Herramienta de planeación DCA-001 · Generado el {today}
        </div>
      </div>
    </>
  );
}
