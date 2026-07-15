"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Campaign = { id: string; name: string; status: string; current_node: number; created_at: string };
type NodeData = Record<string, string>;
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };
type Condition = { field: string; operator: string; value?: string };

// ── Helpers ────────────────────────────────────────────────────
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
        <span key={i} style={{
          background: `${color}15`, color,
          border: `1px solid ${color}30`,
          borderRadius: 20, padding: "3px 10px",
          fontSize: 12, fontWeight: 600,
        }}>{item}</span>
      ))}
    </div>
  );
}

function parseConditions(jsonStr: string | undefined): Condition[] {
  if (!jsonStr) return [];
  try { return JSON.parse(jsonStr) ?? []; } catch { return []; }
}

function Conditions({ value, logic }: { value?: string; logic: "AND" | "OR" }) {
  const conditions = parseConditions(value);
  if (!conditions.length) return <span style={{ color: "#9ca3af", fontSize: 13 }}>Sin condiciones definidas.</span>;
  const logicColor = logic === "AND" ? "#1d4ed8" : "#7c3aed";
  const logicBg = logic === "AND" ? "#eff6ff" : "#f5f3ff";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {conditions.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0
            ? <span style={{ fontSize: 10, fontWeight: 700, color: logicColor, background: logicBg, padding: "2px 7px", borderRadius: 6, flexShrink: 0, minWidth: 36, textAlign: "center" as const }}>{logic}</span>
            : <span style={{ minWidth: 36, flexShrink: 0 }} />
          }
          <div style={{ flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 12px", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>{c.field}</span>
            <span style={{ color: logicColor, fontWeight: 700 }}>{c.operator}</span>
            {c.value && c.value !== c.operator && <span style={{ color: "#111827" }}>{c.value}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "6px 16px", alignItems: "flex-start", paddingBottom: 10, borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", paddingTop: 2, lineHeight: 1.5 }}>{label}</span>
      <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.6 }}>
        {children ?? (value ? <span>{value}</span> : <span style={{ color: "#9ca3af" }}>—</span>)}
      </div>
    </div>
  );
}

function Section({ num, title, color, children }: { num: number | string; title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ background: `${color}0d`, borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: color, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</span>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function RaciRow({ frente, responsable, apoyo, entregable }: { frente: string; responsable: string; apoyo: string; entregable: string }) {
  return (
    <tr>
      <td style={{ padding: "9px 14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, fontWeight: 600, color: "#374151" }}>{frente}</td>
      <td style={{ padding: "9px 14px", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}><span style={{ background: "#FFF3E0", color: "#F77F00", border: "1px solid #F77F0030", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{responsable}</span></td>
      <td style={{ padding: "9px 14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#6b7280" }}>{apoyo}</td>
      <td style={{ padding: "9px 14px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#374151" }}>{entregable}</td>
    </tr>
  );
}

const PRINT_CSS = `
  @media print {
    .no-print { display: none !important; }
    body { background: #fff !important; }
    .handoff-doc { padding: 0 !important; max-width: 100% !important; }
    .handoff-header { display: none !important; }
  }
  @page { margin: 20mm; }
`;

// ── Page ───────────────────────────────────────────────────────
export default function HandoffPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns/${id}`).then(r => r.json()),
      fetch(`/api/campaigns/${id}/nodes`).then(r => r.json()),
    ]).then(([camp, savedNodes]) => {
      if (camp?.id) setCampaign(camp);
      if (Array.isArray(savedNodes)) setNodes(savedNodes);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>
        Cargando handoff...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>
        Campaña no encontrada.
      </div>
    );
  }

  const nd = (idx: number): NodeData => nodes.find(n => n.node_index === idx)?.data ?? {};
  const n1 = nd(0); // campaign
  const n2 = nd(1); // type
  const n3 = nd(2); // segment
  const n4 = nd(3); // rules
  const n5 = nd(4); // invite
  const n6 = nd(5); // submission
  const n7 = nd(6); // showcase
  const n9 = nd(8); // measure

  const today = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const completedCount = nodes.filter(n => n.completed).length;
  const allDone = completedCount >= 8;

  // RACI: assemble from responsible fields
  const raciRows = [
    { frente: "Campaña general", responsable: n1.responsible || "Producto", apoyo: "Growth", entregable: "Handoff final aprobado" },
    { frente: "Segmentación supplier", responsable: n3.segment_responsible || "Brands Success", apoyo: "Comercial", entregable: "Lista de suppliers contactados" },
    { frente: "Convocatoria supplier", responsable: n5.send_responsible || "Comercial", apoyo: "Comunicaciones", entregable: "Mensajes enviados" },
    { frente: "Gestión de postulaciones", responsable: n6.submission_responsible || "Brands Success", apoyo: n3.segment_responsible || "Comercial", entregable: "Productos aprobados / rechazados" },
    { frente: "Vitrina dropshipper", responsable: n7.publication_responsible || "Producto", apoyo: "Growth", entregable: "Vitrina publicada y link validado" },
    { frente: "Activación dropshippers", responsable: "Growth", apoyo: "Comunicaciones", entregable: "Comunicación enviada" },
    { frente: "Medición y reporte", responsable: "Producto / Data", apoyo: "Comercial", entregable: "Reporte de resultados" },
  ];

  // Checklist items: static + node-driven
  const checkItems = [
    { done: !!n1.name, label: "Campaña definida y aprobada" },
    { done: !!n2.campaign_type, label: "Tipo de campaña y mecánica definidos" },
    { done: !!(n3.mandatory_conditions && parseConditions(n3.mandatory_conditions).length > 0), label: "Segmento supplier definido con condiciones" },
    { done: !!(n4.mandatory_rules && parseConditions(n4.mandatory_rules).length > 0), label: "Reglas de participación definidas" },
    { done: !!n5.message_template, label: "Mensaje de convocatoria supplier listo" },
    { done: !!n5.submission_link, label: "Link de postulación configurado" },
    { done: !!n6.form_link, label: "Formulario de postulación listo" },
    { done: !!n7.showcase_name, label: "Vitrina definida con nombre y descripción" },
    { done: !!(n7.distribution_channels && chips(n7.distribution_channels).length > 0), label: "Canal de comunicación a dropshippers definido" },
    { done: !!n7.showcase_link, label: "Link de vitrina validado" },
    { done: !!n1.date_end, label: "Fecha de cierre de campaña definida" },
    { done: allDone, label: "Todos los nodos de definición completados" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Nav bar */}
      <header className="no-print handoff-header" style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => router.push(`/proyectos/dinamicas-catalogo/${id}`)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}
        >
          ← Wizard
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <button
          onClick={() => router.push("/proyectos/dinamicas-catalogo")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}
        >
          Campañas
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{campaign.name}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#F77F00", background: "#FFF3E0", padding: "2px 8px", borderRadius: 20 }}>
          Handoff
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{completedCount} / 10 nodos completados</span>
          <button
            onClick={() => window.print()}
            style={{
              background: "#F77F00", color: "#fff", border: "none",
              borderRadius: 9, padding: "8px 16px", fontWeight: 700,
              fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ↓ Descargar PDF
          </button>
        </div>
      </header>

      {/* Document */}
      <div className="handoff-doc" style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Cover */}
        <div style={{
          background: "linear-gradient(135deg, #F77F00 0%, #F7A800 100%)",
          borderRadius: 18, padding: "40px 40px 36px", marginBottom: 32, color: "#fff",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            Dropi · Brands Success · Handoff de Campaña
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2 }}>
            {n1.name || campaign.name}
          </h1>
          {n1.short_description && (
            <p style={{ fontSize: 14, opacity: 0.9, margin: "0 0 24px", lineHeight: 1.6, maxWidth: 600 }}>
              {n1.short_description}
            </p>
          )}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
            {[
              { label: "Tipo", value: n2.campaign_type || "—" },
              { label: "País", value: chips(n1.country).join(", ") || "—" },
              { label: "Responsable", value: n1.responsible || "—" },
              { label: "Cierre", value: n1.date_end || "—" },
              { label: "Generado", value: today },
            ].map(({ label, value }) => (
              <div key={label} style={{ fontSize: 13 }}>
                <div style={{ opacity: 0.7, fontWeight: 600, fontSize: 11, marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 1. Resumen ejecutivo */}
        <Section num={1} title="Resumen ejecutivo" color="#F77F00">
          <Row label="Nombre de campaña" value={n1.name || campaign.name} />
          <Row label="Tipo de campaña" value={n2.campaign_type} />
          <Row label="Objetivo principal">
            <Chips value={n1.objective} />
          </Row>
          <Row label="País / mercado">
            <Chips value={n1.country} color="#0EA5E9" />
          </Row>
          <Row label="Responsable general" value={n1.responsible} />
          <Row label="Estado" value={campaign.status === "completed" ? "Completada" : campaign.status === "in_progress" ? "En progreso" : "Borrador"} />
          <Row label="Inicio convocatoria" value={n1.date_convocation_start} />
          <Row label="Cierre postulación" value={n1.date_submission_end} />
          <Row label="Publicación vitrina" value={n1.date_publish} />
          <Row label="Cierre de campaña" value={n1.date_end} />
        </Section>

        {/* 2. Objetivo y criterio de éxito */}
        <Section num={2} title="Objetivo y criterio de éxito" color="#10B981">
          <Row label="Objetivos">
            <Chips value={n1.objective} color="#10B981" />
          </Row>
          <Row label="¿Qué se quiere mover?">
            <Chips value={n2.what_to_move} color="#10B981" />
          </Row>
          <Row label="Hipótesis" value={n1.hypothesis} />
          <Row label="Resultado esperado" value={n1.expected_result} />
          {n2.commercial_rules && (
            <Row label="Reglas comerciales base" value={n2.commercial_rules} />
          )}
          {n2.requires_discount && (
            <Row label="Descuento" value={n2.requires_discount} />
          )}
          {n2.requires_campaign_price && (
            <Row label="Precio de campaña" value={n2.requires_campaign_price} />
          )}
        </Section>

        {/* 3. Segmento supplier */}
        <Section num={3} title="Segmento supplier" color="#0EA5E9">
          <Row label="Universo base" value={n3.universe} />
          <Row label="Tamaño esperado" value={n1.expected_result} />
          <Row label="Responsable de segm." value={n3.segment_responsible} />
          <Row label="Fuentes de datos">
            <Chips value={n3.data_source} color="#0EA5E9" />
          </Row>
          <Row label="Condiciones obligatorias">
            <Conditions value={n3.mandatory_conditions} logic="AND" />
          </Row>
          {n3.optional_conditions && parseConditions(n3.optional_conditions).length > 0 && (
            <Row label="Condiciones opcionales">
              <Conditions value={n3.optional_conditions} logic="OR" />
            </Row>
          )}
          <Row label="Exclusiones">
            <Conditions value={n3.exclusions} logic="OR" />
          </Row>
          {n3.segment_notes && (
            <Row label="Notas del segmento" value={n3.segment_notes} />
          )}
          {n3.eligibility_notes && (
            <Row label="Notas o excepciones" value={n3.eligibility_notes} />
          )}
        </Section>

        {/* 4. Reglas de participación */}
        <Section num={4} title="Reglas de participación" color="#8B5CF6">
          <Row label="Reglas obligatorias">
            <Conditions value={n4.mandatory_rules} logic="AND" />
          </Row>
          {n4.recommended_rules && parseConditions(n4.recommended_rules).length > 0 && (
            <Row label="Reglas recomendadas">
              <Conditions value={n4.recommended_rules} logic="AND" />
            </Row>
          )}
          <Row label="Reglas excluyentes">
            <Conditions value={n4.exclusion_rules} logic="OR" />
          </Row>
          <Row label="Stock mínimo" value={n4.threshold_stock} />
          {n4.threshold_discount && <Row label="Descuento mínimo" value={n4.threshold_discount} />}
          {n4.threshold_margin && <Row label="Margen mínimo" value={n4.threshold_margin} />}
          {n4.threshold_max_products && <Row label="Máx. productos / supplier" value={n4.threshold_max_products} />}
          <Row label="Vigencia de precio" value={n4.requires_price_validity} />
          {n4.campaign_specific_rules && (
            <Row label="Reglas específicas de esta campaña" value={n4.campaign_specific_rules} />
          )}
        </Section>

        {/* 5. Convocatoria supplier */}
        <Section num={5} title="Convocatoria supplier" color="#F59E0B">
          <Row label="Tipo de convocatoria" value={n5.invite_type} />
          <Row label="Estado" value={n5.invite_status} />
          <Row label="Responsable de envío" value={n5.send_responsible} />
          <Row label="Fecha límite" value={n5.submission_deadline} />
          <Row label="Canales">
            <Chips value={n5.channels} color="#F59E0B" />
          </Row>
          <Row label="Motivadores del mensaje">
            <Chips value={n5.message_motivators} color="#F59E0B" />
          </Row>
          <Row label="CTA" value={n5.cta} />
          <Row label="Link de postulación">
            {n5.submission_link
              ? <a href={n5.submission_link} target="_blank" rel="noopener noreferrer" style={{ color: "#F77F00", textDecoration: "none", fontWeight: 600 }}>{n5.submission_link}</a>
              : <span style={{ color: "#9ca3af" }}>—</span>
            }
          </Row>
          {n5.message_template && (
            <Row label="Mensaje base de convocatoria">
              <div style={{ background: "#FFFBF0", border: "1px solid #F59E0B30", borderRadius: 9, padding: "12px 16px", fontSize: 13, color: "#111827", lineHeight: 1.7, whiteSpace: "pre-wrap" as const }}>
                {n5.message_template}
              </div>
            </Row>
          )}
          {n5.supplier_list && (
            <Row label="Lista de suppliers">
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                {n5.supplier_list}
              </div>
            </Row>
          )}
        </Section>

        {/* 6. Postulación de productos */}
        <Section num={6} title="Postulación de productos" color="#EC4899">
          <Row label="Herramienta" value={n6.submission_channel} />
          <Row label="Responsable" value={n6.submission_responsible} />
          <Row label="Link del formulario">
            {n6.form_link
              ? <a href={n6.form_link} target="_blank" rel="noopener noreferrer" style={{ color: "#EC4899", textDecoration: "none", fontWeight: 600 }}>{n6.form_link}</a>
              : <span style={{ color: "#9ca3af" }}>—</span>
            }
          </Row>
          <Row label="Datos del supplier requeridos">
            <Chips value={n6.supplier_required_fields} color="#EC4899" />
          </Row>
          <Row label="Datos del producto requeridos">
            <Chips value={n6.product_required_fields} color="#EC4899" />
          </Row>
          <Row label="Datos comerciales requeridos">
            <Chips value={n6.commercial_required_fields} color="#EC4899" />
          </Row>
          <Row label="Capturar motivación supplier" value={n6.motivator_field} />
          {n6.required_confirmations && chips(n6.required_confirmations).length > 0 && (
            <Row label="Confirmaciones requeridas">
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {chips(n6.required_confirmations).map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                    <span style={{ color: "#10B981", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#374151" }}>{c}</span>
                  </div>
                ))}
              </div>
            </Row>
          )}
          {n6.submission_notes && (
            <Row label="Instrucciones" value={n6.submission_notes} />
          )}
        </Section>

        {/* 7. Vitrina dropshipper */}
        <Section num={7} title="Vitrina dropshipper" color="#0EA5E9">
          <Row label="Tipo de vitrina" value={n7.showcase_type} />
          <Row label="Nombre visible" value={n7.showcase_name} />
          <Row label="Descripción visible" value={n7.showcase_description} />
          <Row label="Responsable de publicación" value={n7.publication_responsible} />
          <Row label="Vigencia visible" value={n7.validity_display} />
          <Row label="CTA principal" value={n7.cta_main} />
          <Row label="Fuente de productos" value={n7.product_source} />
          <Row label="Agrupaciones internas">
            <Chips value={n7.product_groupings} color="#0EA5E9" />
          </Row>
          <Row label="Badges">
            <Chips value={n7.badges} color="#6366F1" />
          </Row>
          <Row label="Info visible por producto">
            <Chips value={n7.product_visible_info} color="#0EA5E9" />
          </Row>
          {n7.showcase_link && (
            <Row label="Link de vitrina">
              <a href={n7.showcase_link} target="_blank" rel="noopener noreferrer" style={{ color: "#0EA5E9", textDecoration: "none", fontWeight: 600 }}>{n7.showcase_link}</a>
            </Row>
          )}
        </Section>

        {/* 8. Comunicación a dropshippers */}
        <Section num={8} title="Comunicación a dropshippers" color="#6366F1">
          <Row label="Canales de distribución">
            <Chips value={n7.distribution_channels} color="#6366F1" />
          </Row>
          <Row label="Segmento de dropshippers" value="Dropshippers activos en los países seleccionados de la campaña." />
          <Row label="Mensaje principal">
            <div style={{ background: "#F5F3FF", border: "1px solid #6366F130", borderRadius: 9, padding: "12px 16px", fontSize: 13, color: "#111827", lineHeight: 1.7 }}>
              {n7.showcase_name
                ? `"${n7.showcase_name}: ${n7.showcase_description || "Productos seleccionados por Dropi."}"`
                : <span style={{ color: "#9ca3af" }}>—</span>
              }
            </div>
          </Row>
          <Row label="CTA" value={n7.cta_main} />
          <Row label="Link a vitrina">
            {n7.showcase_link
              ? <a href={n7.showcase_link} target="_blank" rel="noopener noreferrer" style={{ color: "#6366F1", textDecoration: "none", fontWeight: 600 }}>{n7.showcase_link}</a>
              : <span style={{ color: "#9ca3af" }}>Pendiente de publicar.</span>
            }
          </Row>
          <Row label="Vigencia visible" value={n7.validity_display} />
        </Section>

        {/* 9. Roles y responsables (RACI) */}
        <Section num={9} title="Roles y responsables" color="#F77F00">
          <div style={{ overflowX: "auto" as const }}>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Frente", "Responsable", "Apoyo", "Entregable"].map(h => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raciRows.map((r, i) => <RaciRow key={i} {...r} />)}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 10. Métricas y seguimiento */}
        <Section num={10} title="Métricas y seguimiento" color="#10B981">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 4 }}>
            {[
              { label: "Métricas de supplier", value: n9.supplier_metrics, color: "#0EA5E9" },
              { label: "Métricas de dropshipper", value: n9.dropshipper_metrics, color: "#6366F1" },
              { label: "Métricas de negocio", value: n9.business_metrics, color: "#10B981" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#f9fafb", border: `1px solid ${color}20`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" as const }}>
                  {value || <span style={{ color: "#9ca3af" }}>Pendiente de completar al cierre.</span>}
                </div>
              </div>
            ))}
          </div>
          {n9.learnings && (
            <Row label="Aprendizajes clave" value={n9.learnings} />
          )}
        </Section>

        {/* 11. Riesgos y dependencias */}
        <Section num={11} title="Riesgos y dependencias" color="#EF4444">
          {[
            "No hay suficientes suppliers interesados en participar.",
            "Productos postulados sin stock real al momento de la campaña.",
            "Descuento o precio de campaña poco atractivo para el dropshipper.",
            "Vitrina difícil de consumir o con UX deficiente.",
            "No hay canal claro o efectivo hacia los dropshippers.",
            "No se puede medir si el dropshipper tomó o agregó el producto.",
            "Falta de validación de datos de productos (imágenes, ficha incompleta).",
            "Riesgo de saturar visualmente el catálogo si hay demasiados productos.",
          ].map((risk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ color: "#EF4444", fontWeight: 700, flexShrink: 0, fontSize: 14 }}>⚠</span>
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{risk}</span>
            </div>
          ))}
        </Section>

        {/* 12. Checklist final */}
        <Section num={12} title="Checklist final de publicación" color="#10B981">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checkItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 9, background: item.done ? "#F0FDF4" : "#f9fafb", border: `1px solid ${item.done ? "#10B98130" : "#e5e7eb"}` }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: item.done ? "#10B981" : "#e5e7eb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: item.done ? "#fff" : "#9ca3af", fontWeight: 700,
                }}>{item.done ? "✓" : ""}</span>
                <span style={{ fontSize: 13, color: item.done ? "#166534" : "#6b7280", fontWeight: item.done ? 600 : 400 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, padding: "12px 16px", borderRadius: 10, background: allDone ? "#ECFDF5" : "#FFF3E0", border: `1px solid ${allDone ? "#10B98130" : "#F77F0030"}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: allDone ? "#10B981" : "#F77F00" }}>
              {allDone
                ? "✓ Campaña lista para ejecutar."
                : `${checkItems.filter(c => c.done).length} de ${checkItems.length} ítems completados — revisa los pendientes antes de lanzar.`
              }
            </span>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ textAlign: "center" as const, fontSize: 12, color: "#9ca3af", marginTop: 40 }}>
          Dropi · Brands Success · Generado el {today}
        </div>
      </div>
    </>
  );
}
