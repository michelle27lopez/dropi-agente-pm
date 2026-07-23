"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";

type ProjectDetails = {
  id: string;
  name: string;
  project_code: string | null;
  status: string | null;
  summary: string | null;
  celulas?: {
    nombre: string;
    slug: string;
  } | null;
};

type Cycle = {
  id: string;
  title: string;
  estado: "activo" | "cerrado";
  fase_actual: string;
  brief?: {
    causa?: "M" | "A" | "P" | "";
    subPerfil?: string;
    target?: string;
    hipotesis?: string;
    experimento?: string;
    indicadores?: string;
  };
  risks?: { id: string; text: string; resolved: boolean }[];
  metrics?: { label: string; value: string; color: string }[];
};

type Decision = {
  id: string;
  tipo: string;
  texto: string;
  fecha: string;
  actor: string | null;
};

export default function ProjectDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [docsOpen, setDocsOpen] = useState(true);
  const [briefOpen, setBriefOpen] = useState(true);

  // --- MÓDULO DE NOTIFICACIONES (PRM-1305) ---
  const [sellersPilot, setSellersPilot] = useState([
    { id: 1, name: "Andrés (Katz Supply)", phone: "+57 301 234 5678", pendingOrders: 14, status: "confirmado_rapido", comment: "No sabía que las tenía pendientes." },
    { id: 2, name: "Manuela (Black Swan)", phone: "+57 312 987 6543", pendingOrders: 9, status: "confirmado_rapido", comment: "Alerta oportuna, validó modelo mental." },
    { id: 3, name: "Carlos Ecom", phone: "+57 320 456 7890", pendingOrders: 5, status: "falla_habilidad", comment: "Falla de pasarela de pago en checkout." },
    { id: 4, name: "María Clara", phone: "+57 315 888 9900", pendingOrders: 8, status: "pendiente", comment: "Envío hace 1 hora, revisando." },
    { id: 5, name: "Juan Distribuidor", phone: "+57 310 111 2222", pendingOrders: 12, status: "sin_enviar", comment: "" },
    { id: 6, name: "Diego Importaciones", phone: "+57 311 333 4444", pendingOrders: 6, status: "sin_enviar", comment: "" },
    { id: 7, name: "Sandra Shop", phone: "+57 318 555 6666", pendingOrders: 15, status: "sin_enviar", comment: "" },
  ]);
  const [selectedSellerMsg, setSelectedSellerMsg] = useState<any>(null);

  // --- PAGE PILOT LANDINGS (PRM-1238) ---
  const [selectedAngle, setSelectedAngle] = useState("funcional");
  const [qaSwitches, setQaSwitches] = useState({
    redirection: true,
    refunds: false,
    speed: true,
    variantImport: false,
  });
  const [generationState, setGenerationState] = useState("idle"); // idle | generating | live
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  // --- DROPIFY 2.X REARQUITECTURA (PRM-1239) ---
  const [shopifyBlocked, setShopifyBlocked] = useState(true);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "[15:52:00] INICIO: Cola de sincronización Dropify 2.X activa.",
    "[15:52:04] SYNC: Sincronizando producto WooCommerce SKU-4829... Éxito.",
    "[15:52:08] SYNC: Sincronizando variante Tienda Nube SKU-9831... En cola.",
    "[15:52:12] BLOCK: Intento de sync Shopify SKU-1102... ERROR: Recurso pasarela compartido bloqueado (Diego en otra tarea)."
  ]);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/proyectos/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el proyecto.");
        }
        const data = await res.json();
        setProject(data.project);
        setCycles(data.cycles || []);
        setDecisions(data.decisions || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Cron-like logger simulation for Dropify 2.X
  useEffect(() => {
    if (slug.toUpperCase() !== "PRM-1239" || generationState === "generating") return;
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const skus = ["SKU-3829", "SKU-1049", "SKU-9901", "SKU-2041", "SKU-5830"];
      const randomSku = skus[Math.floor(Math.random() * skus.length)];
      if (shopifyBlocked) {
        setSyncLogs(prev => [
          ...prev.slice(-8),
          `[${time}] BLOCK: Sync Shopify para ${randomSku} en espera - Recurso compartido bloqueado (Diego).`,
          `[${time}] SYNC: Sincronizando producto WooCommerce ${randomSku}... Éxito.`
        ]);
      } else {
        setSyncLogs(prev => [
          ...prev.slice(-8),
          `[${time}] SYNC: Sincronizando variante Shopify ${randomSku}... Éxito (Recurso Diego Liberado).`,
          `[${time}] SYNC: Sincronizando producto WooCommerce ${randomSku}... Éxito.`
        ]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [slug, shopifyBlocked, generationState]);

  if (loading) {
    return (
      <main style={{ padding: 48, background: "var(--card)", minHeight: "100vh" }}>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando detalles del proyecto…</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main style={{ padding: 48, background: "var(--card)", minHeight: "100vh" }}>
        <p style={{ fontSize: 13, color: "#DC2626" }}>Error: {error || "Proyecto no encontrado."}</p>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, marginTop: 12 }}>
          Volver al Inicio
        </button>
      </main>
    );
  }

  const cellName = project.celulas?.nombre ?? "Célula";
  const cellSlug = project.celulas?.slug ?? "";
  const code = project.project_code || "PRJ";
  
  // Find active or latest cycle
  const activeCycle = cycles.find((c) => c.estado === "activo") || cycles[0];
  const brief = activeCycle?.brief;

  const CAUSA_LABELS = {
    M: "🧠 M · Modelo Mental (Causa Cognitiva)",
    A: "📈 A · Adopción (Causa Operativa)",
    P: "⚡ P · Performance (Causa de Habilitación)",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title={project.name}
        subtitle={`Proyecto ${code} · ${cellName}`}
        currentSlug={cellSlug}
      />

      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: "40px 24px", boxSizing: "border-box" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 13 }}>
          <a
            href={cellSlug ? `/celula/${cellSlug}` : "/"}
            onClick={(e) => {
              e.preventDefault();
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(cellSlug ? `/celula/${cellSlug}` : "/");
              }
            }}
            style={{ color: "var(--muted)", textDecoration: "none" }}
          >
            ← Volver
          </a>
        </div>

        {/* Project Metadata Card */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "var(--dropi-light)", color: "var(--dropi)", padding: "3px 9px", borderRadius: 20 }}>
              {code}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#10B981", padding: "3px 9px", borderRadius: 20 }}>
              {project.status === "in_progress" ? "En Progreso" : project.status || "Activo"}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, margin: 0 }}>
            {project.summary || "Sin resumen registrado."}
          </p>
        </div>

        {/* Dynamic Metric Cards Grid */}
        {activeCycle?.metrics && activeCycle.metrics.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {activeCycle.metrics.map((m: any) => (
              <div
                key={m.label}
                style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "var(--muted)",
                  textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10,
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em",
                  color: "var(--fg)", lineHeight: 1,
                }}>
                  {m.value}
                </div>
                <div style={{
                  marginTop: 12, height: 4, background: "#F3F4F6",
                  borderRadius: 999, overflow: "hidden",
                }}>
                  <div style={{ height: "100%", width: "100%", background: m.color || "var(--dropi)", borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recursos Accordion */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 32, overflow: "hidden" }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left", borderBottom: docsOpen ? "1px solid var(--border)" : "none"
            }}
          >
            <span style={{ fontSize: 16 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>
              Recursos del proyecto
            </span>
            <span style={{ fontSize: 16, color: "var(--muted)", transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              ⌄
            </span>
          </button>

          {docsOpen && (
            <div style={{ padding: "20px" }}>
              {/* Product Lens Section */}
              {activeCycle ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--fg)" }}>
                      Lente de Producto B=MAP (Fase actual: {activeCycle.fase_actual})
                    </h3>
                    <button
                      onClick={() => router.push(`/proyectos/${slug}/discovery`)}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                        border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer"
                      }}
                    >
                      💬 Reabrir Chat de Discovery
                    </button>
                  </div>

                  {/* Brief View */}
                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: "1px solid #E2E8F0", paddingBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                        BRIEF DE INTERVENCIÓN ACTIVO
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Causa B=MAP</strong>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                          {brief?.causa ? CAUSA_LABELS[brief.causa] || brief.causa : "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Sub-Perfil Conductual</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)" }}>
                          {brief?.subPerfil || "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Público Objetivo (Target)</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)" }}>
                          {brief?.target || "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Hipótesis / Reto</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)", whiteSpace: "pre-line" }}>
                          {brief?.hipotesis || "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Experimento de Validación</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)", whiteSpace: "pre-line" }}>
                          {brief?.experimento || "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Métricas / Indicadores</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)", whiteSpace: "pre-line" }}>
                          {brief?.indicadores || "No especificado aún por el discovery."}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Decisions Ledger */}
                  {decisions.length > 0 && (
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>
                        Registro de Decisiones (Ledger)
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {decisions.map((dec) => (
                          <div key={dec.id} style={{ background: "#F1F5F9", borderRadius: 8, padding: 12, borderLeft: "4px solid #64748B" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 4 }}>
                              <strong>Decisión · {dec.tipo.toUpperCase()}</strong>
                              <span>{new Date(dec.fecha).toLocaleDateString()}</span>
                            </div>
                            <p style={{ fontSize: 12, color: "var(--fg)", margin: 0, lineHeight: 1.4 }}>
                              {dec.texto}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>🔭</span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px 0", color: "var(--fg)" }}>
                    Lente B=MAP no iniciado
                  </h4>
                  <p style={{ fontSize: 12, color: "var(--muted)", maxWidth: 400, margin: "0 auto 16px auto", lineHeight: 1.4 }}>
                    Este proyecto aún no cuenta con un ciclo de discovery para perfilar sus causas conductuales e hipótesis.
                  </p>
                  <button
                    onClick={() => router.push(`/proyectos/${slug}/discovery`)}
                    style={{
                      fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                      border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer"
                    }}
                  >
                    🚀 Iniciar Lente de Producto B=MAP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CONSOLAS OPERATIVAS INTERACTIVAS PARA EL PM */}
        {(() => {
          const normSlug = slug.toUpperCase();
          
          if (normSlug === "PRM-1305") {
            const contactedSellers = sellersPilot.filter(s => s.status !== "sin_enviar");
            const contactedCount = contactedSellers.length;
            const confirmedQuickCount = sellersPilot.filter(s => s.status === "confirmado_rapido").length;
            const quickConversionRate = contactedCount > 0 ? Math.round((confirmedQuickCount / contactedCount) * 100) : 0;
            const recoveredOrders = sellersPilot
              .filter(s => ["confirmado_rapido", "confirmado_lento"].includes(s.status))
              .reduce((sum, s) => sum + s.pendingOrders, 0);
            const abilityBlockers = sellersPilot.filter(s => s.status === "falla_habilidad").length;

            return (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32, boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⚡</span> Consola Operativa del Experimento (Notificaciones Concierge)
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "#FEF3C7", color: "#D97706", padding: "3px 9px", borderRadius: 20 }}>
                    Fase 1: Concierge Activa
                  </span>
                </div>
                
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>
                  <strong>Metodología de Validación:</strong> Envío de copy proactivo directo vía WhatsApp a sellers con órdenes en estado "Pendiente" por más de 24 horas. Esta consola te permite gestionar la muestra de 20 sellers del piloto y registrar sus respuestas cualitativas para validar el modelo.
                </p>

                {/* Micro Metrics Dashboard */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Tasa Respuesta Rápida</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: quickConversionRate >= 60 ? "#10B981" : "var(--fg)", marginTop: 6 }}>
                      {quickConversionRate}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Meta del Experimento: ≥60%</div>
                  </div>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Órdenes Recuperadas</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--dropi)", marginTop: 6 }}>
                      {recoveredOrders} uds
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Confirmadas en el piloto</div>
                  </div>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Avance de la Muestra</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginTop: 6 }}>
                      {contactedCount} / 20
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Sellers contactados</div>
                  </div>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Fallas de Habilidad (Ability)</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: abilityBlockers > 0 ? "#EF4444" : "var(--fg)", marginTop: 6 }}>
                      {abilityBlockers}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Reportan problemas de pasarela</div>
                  </div>
                </div>

                {/* Message Copy Preview Panel */}
                <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Plantilla de Mensaje para Envío (Copy)</span>
                    <button 
                      onClick={() => {
                        const defaultMsg = "Hola [Nombre], te escribe el equipo de Dropi. Notamos que tienes órdenes pendientes de confirmación...";
                        navigator.clipboard.writeText(defaultMsg);
                        alert("Plantilla genérica copiada al portapapeles.");
                      }}
                      style={{ background: "none", border: "none", color: "var(--dropi)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                    >
                      Copiar Plantilla
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--fg)", margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>
                    {selectedSellerMsg ? (
                      `"Hola ${selectedSellerMsg.name.split(" ")[0]}, te escribe el equipo de Dropi. Notamos que tienes ${selectedSellerMsg.pendingOrders} órdenes pendientes de confirmación desde hace más de 24 horas. Para evitar que el sistema las cancele y pierdas esas ventas, por favor ingresa a tu panel y confírmalas lo antes posible. Puedes revisarlas directamente aquí: https://dropi.co/orders/pending"`
                    ) : (
                      "Haz clic en \"Preparar Mensaje\" en la tabla inferior para previsualizar el copy personalizado para el seller."
                    )}
                  </p>
                </div>

                {/* Sellers Tracker Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
                        <th style={{ fontSize: 11, padding: "8px 12px", color: "var(--muted)", textTransform: "uppercase" }}>Seller / Tienda</th>
                        <th style={{ fontSize: 11, padding: "8px 12px", color: "var(--muted)", textTransform: "uppercase" }}>Órdenes Pendientes</th>
                        <th style={{ fontSize: 11, padding: "8px 12px", color: "var(--muted)", textTransform: "uppercase" }}>WhatsApp</th>
                        <th style={{ fontSize: 11, padding: "8px 12px", color: "var(--muted)", textTransform: "uppercase" }}>Estado del Pilot</th>
                        <th style={{ fontSize: 11, padding: "8px 12px", color: "var(--muted)", textTransform: "uppercase" }}>Feedback / Notas</th>
                        <th style={{ fontSize: 11, padding: "8px 12px", color: "var(--muted)", textTransform: "uppercase" }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellersPilot.map(s => (
                        <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ fontSize: 13, padding: "12px", fontWeight: 650, color: "var(--fg)" }}>{s.name}</td>
                          <td style={{ fontSize: 13, padding: "12px", color: "var(--fg)" }}>{s.pendingOrders} uds</td>
                          <td style={{ fontSize: 12, padding: "12px", color: "var(--muted)" }}>{s.phone}</td>
                          <td style={{ fontSize: 12, padding: "12px" }}>
                            <select
                              value={s.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                setSellersPilot(prev => prev.map(item => item.id === s.id ? { ...item, status: newStatus } : item));
                              }}
                              style={{
                                padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)",
                                fontSize: 12, fontWeight: 600, background: "#fff", cursor: "pointer"
                              }}
                            >
                              <option value="sin_enviar">Sin enviar</option>
                              <option value="pendiente">Alerta Enviada</option>
                              <option value="confirmado_rapido">Confirmó en &lt; 2h ✅</option>
                              <option value="confirmado_lento">Confirmó en &gt; 2h</option>
                              <option value="falla_habilidad">Falla de Capacidad ⚠️</option>
                              <option value="sin_respuesta">No respondió</option>
                            </select>
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            <input
                              type="text"
                              value={s.comment}
                              placeholder="Ej: Problema de billetera..."
                              onChange={(e) => {
                                const newComment = e.target.value;
                                setSellersPilot(prev => prev.map(item => item.id === s.id ? { ...item, comment: newComment } : item));
                              }}
                              style={{
                                width: "100%", padding: "4px 8px", borderRadius: 6,
                                border: "1px solid var(--border)", fontSize: 12, color: "var(--fg)"
                              }}
                            />
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            <button
                              onClick={() => {
                                setSellersPilot(prev => prev.map(item => item.id === s.id && item.status === "sin_enviar" ? { ...item, status: "pendiente" } : item));
                                setSelectedSellerMsg(s);
                              }}
                              style={{
                                padding: "4px 10px", background: "var(--dropi)", color: "#fff",
                                border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer"
                              }}
                            >
                              Preparar Mensaje
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (normSlug === "PRM-1238") {
            const simulatedCvr = (
              1.2 +
              (qaSwitches.redirection ? 0.8 : 0) +
              (qaSwitches.refunds ? 0.5 : 0) +
              (qaSwitches.speed ? 0.4 : 0) +
              (qaSwitches.variantImport ? 0.7 : 0)
            ).toFixed(1);

            const simulatedTtv = (
              8.0 -
              (qaSwitches.variantImport ? 4.5 : 0) -
              (qaSwitches.speed ? 1.5 : 0) -
              (qaSwitches.redirection ? 0.5 : 0)
            ).toFixed(1);

            const handleSimulateGen = () => {
              if (generationState !== "idle") return;
              setGenerationState("generating");
              setGenerationLogs([
                "Iniciando flujo Page Pilot MCP para categoría 'Suplementos Dietarios'...",
              ]);
              setTimeout(() => {
                setGenerationLogs(prev => [...prev, "Extrayendo catálogo de variantes de Dropi (Proteínas, Colágeno)..."]);
              }, 1000);
              setTimeout(() => {
                setGenerationLogs(prev => [...prev, "Generando ángulos de venta vía IA (Ángulo seleccionado: " + selectedAngle.toUpperCase() + ")..."]);
              }, 2000);
              setTimeout(() => {
                setGenerationLogs(prev => [...prev, "Maquetando landing page y enlazando pasarela de redirección..."]);
              }, 3000);
              setTimeout(() => {
                setGenerationLogs(prev => [...prev, "Generación exitosa. Desplegando en CDN de Dropi..."]);
                setGenerationState("live");
              }, 4000);
            };

            return (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32, boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⚡</span> Simulador de Impacto CVR & TTV (Page Pilot MCP)
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "#DCFCE7", color: "#166534", padding: "3px 9px", borderRadius: 20 }}>
                    Fase 4: Listos para Producción
                  </span>
                </div>

                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>
                  Esta herramienta simula la generación automatizada de Landings con Inteligencia Artificial. Ajusta los parámetros de optimización para ver el impacto estimado en la tasa de conversión (CVR) y en la velocidad de la primera venta (Time to Value en días) de tus vendedores.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                  {/* Parameter controls */}
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginTop: 0, marginBottom: 16 }}>
                      Configuración y Ajustes de Producto
                    </h4>
                    
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Ángulo de Venta de IA
                      </label>
                      <select 
                        value={selectedAngle}
                        onChange={(e) => setSelectedAngle(e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", fontSize: 13, color: "var(--fg)" }}
                      >
                        <option value="funcional">Funcional: Dolor / Problema</option>
                        <option value="emocional">Emocional: Estilo de Vida y Salud</option>
                        <option value="combos">Promocional: Descuentos y Kits</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>
                        Ajustes de Calidad (Validación PM)
                      </label>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input 
                          type="checkbox" 
                          id="redirection" 
                          checked={qaSwitches.redirection}
                          onChange={(e) => setQaSwitches(prev => ({ ...prev, redirection: e.target.checked }))}
                        />
                        <label htmlFor="redirection" style={{ fontSize: 12, color: "var(--fg)", fontWeight: 550 }}>
                          Evitar Fuga en Redirección (+0.8% CVR)
                        </label>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input 
                          type="checkbox" 
                          id="refunds" 
                          checked={qaSwitches.refunds}
                          onChange={(e) => setQaSwitches(prev => ({ ...prev, refunds: e.target.checked }))}
                        />
                        <label htmlFor="refunds" style={{ fontSize: 12, color: "var(--fg)", fontWeight: 550 }}>
                          Integrar Reembolso Automático (+0.5% CVR)
                        </label>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input 
                          type="checkbox" 
                          id="speed" 
                          checked={qaSwitches.speed}
                          onChange={(e) => setQaSwitches(prev => ({ ...prev, speed: e.target.checked }))}
                        />
                        <label htmlFor="speed" style={{ fontSize: 12, color: "var(--fg)", fontWeight: 550 }}>
                          Compresión Media / Carga rápida (+0.4% CVR)
                        </label>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input 
                          type="checkbox" 
                          id="variantImport" 
                          checked={qaSwitches.variantImport}
                          onChange={(e) => setQaSwitches(prev => ({ ...prev, variantImport: e.target.checked }))}
                        />
                        <label htmlFor="variantImport" style={{ fontSize: 12, color: "var(--fg)", fontWeight: 550 }}>
                          Importación Rápida de Variantes (10s vs 2m)
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateGen}
                      disabled={generationState === "generating"}
                      style={{
                        width: "100%", marginTop: 20, padding: "10px 16px",
                        background: generationState === "generating" ? "var(--muted)" : "var(--dropi)",
                        color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                        cursor: generationState === "generating" ? "not-allowed" : "pointer"
                      }}
                    >
                      {generationState === "idle" ? "🚀 Generar Landing Page" : generationState === "generating" ? "Generando..." : "Regenerar Landing"}
                    </button>
                  </div>

                  {/* Telemetry Output */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Live Indicators */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ background: "#F0FDF4", border: "1px solid #DCFCE7", borderRadius: 12, padding: 16, textAlign: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Tasa de Conversión (CVR)</span>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#166534", marginTop: 4 }}>{simulatedCvr}%</div>
                        <span style={{ fontSize: 11, color: "#3F6212" }}>Promedio del Seller</span>
                      </div>
                      <div style={{ background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: 12, padding: 16, textAlign: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#1E40AF", textTransform: "uppercase" }}>Time to Value (TTV)</span>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#1E40AF", marginTop: 4 }}>{simulatedTtv} días</div>
                        <span style={{ fontSize: 11, color: "#1E3A8A" }}>Hasta primera orden</span>
                      </div>
                    </div>

                    {/* Console Logger */}
                    <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, flex: 1, display: "flex", flexDirection: "column", minHeight: 150 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                        <span>Logs de Page Pilot MCP</span>
                        <span style={{ color: "#10B981" }}>● Conectado</span>
                      </div>
                      <div style={{ flex: 1, fontFamily: "monospace", fontSize: 11, color: "#34D399", overflowY: "auto", lineHeight: 1.5 }}>
                        {generationLogs.length > 0 ? (
                          generationLogs.map((l, idx) => (
                            <div key={idx} style={{ marginBottom: 4 }}>{l}</div>
                          ))
                        ) : (
                          <div style={{ color: "#64748B" }}>Consola inactiva. Configura los parámetros y haz clic en Generar.</div>
                        )}
                        {generationState === "live" && (
                          <div style={{ marginTop: 8, padding: "8px", background: "rgba(16,185,129,0.1)", border: "1px solid #10B981", borderRadius: 6, color: "#10B981" }}>
                            🎉 <strong>Landing publicada:</strong> <a href="https://dropi.co/lp/salud-suplementos-test" target="_blank" rel="noopener noreferrer" style={{ color: "#34D399", textDecoration: "underline" }}>dropi.co/lp/salud-suplementos-test</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (normSlug === "PRM-1239") {
            return (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32, boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⚡</span> Terminal de Sincronización y Recursos de Canal (Dropify 2.X)
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 800, background: shopifyBlocked ? "#FEE2E2" : "#DCFCE7", color: shopifyBlocked ? "#991B1B" : "#166534", padding: "3px 9px", borderRadius: 20 }}>
                    {shopifyBlocked ? "Shopify Bloqueado" : "Canales Operativos"}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>
                  <strong>Estado de la Rearquitectura:</strong> Monitorea en vivo el flujo de la cola de sincronización de variantes e inventario. Utiliza el botón PM para simular la asignación del recurso de desarrollo (Diego) y liberar los bloqueos técnicos de la integración de Shopify.
                </p>

                {shopifyBlocked && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FEE2E2", borderRadius: 10, padding: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <strong style={{ fontSize: 13, color: "#991B1B", display: "block" }}>⚠️ Bloqueante de Recurso (Diego)</strong>
                      <span style={{ fontSize: 12, color: "#7F1D1D" }}>Las sincronizaciones de Shopify fallan porque el recurso de backend (Diego) está asignado a otra tarea compartida. Libera el recurso para activar Shopify.</span>
                    </div>
                    <button
                      onClick={() => {
                        setShopifyBlocked(false);
                        setSyncLogs(prev => [
                          ...prev,
                          `[${new Date().toLocaleTimeString()}] INFO: Alejandra Melo reasignó temporalmente a Diego a Dropify 2.X.`,
                          `[${new Date().toLocaleTimeString()}] INFO: Cola de Shopify liberada. Iniciando reprocesamiento de SKUs.`
                        ]);
                      }}
                      style={{
                        padding: "8px 14px", background: "#EF4444", color: "#fff",
                        border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      Liberar Diego (Coordinación PM)
                    </button>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>Shopify (Fase 1)</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: shopifyBlocked ? "#FEE2E2" : "#DCFCE7", color: shopifyBlocked ? "#991B1B" : "#166534" }}>
                        {shopifyBlocked ? "Bloqueado QA" : "En Pruebas QA"}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, margin: 0 }}>Sincronización de variantes complejas y webhook.</p>
                  </div>

                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>WooCommerce (Fase 2.1)</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#DBEAFE", color: "#1E40AF" }}>
                        En Desarrollo
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, margin: 0 }}>Lanzamiento de Beta previsto para el 4 de agosto con Alejandra.</p>
                  </div>

                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>Tienda Nube (Fase 2.2)</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#F3F4F6", color: "var(--muted)" }}>
                        Backlog S2
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, margin: 0 }}>Integración programada tras estabilizar WooCommerce.</p>
                  </div>
                </div>

                {/* Dark terminal */}
                <div style={{ background: "#0F172A", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: 12 }}>
                    <span>Log de Cola de Sincronización en Tiempo Real</span>
                    <span style={{ color: shopifyBlocked ? "#EF4444" : "#10B981" }}>
                      {shopifyBlocked ? "⚠️ Error en canal Shopify" : "🟢 Sincronizando activamente"}
                    </span>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "#38BDF8", display: "flex", flexDirection: "column", gap: 6, minHeight: 180 }}>
                    {syncLogs.map((log, index) => {
                      let color = "#38BDF8";
                      if (log.includes("BLOCK") || log.includes("ERROR")) color = "#F87171";
                      if (log.includes("INFO") || log.includes("Liberado")) color = "#34D399";
                      return (
                        <div key={index} style={{ color }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}
      </div>
    </main>
  );
}
