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
  type: string | null;
  parent_project_id: string | null;
  estado_interno: string | null;
  vpv: number | null;
  prototype_url: string | null;
  celulas?: {
    nombre: string;
    slug: string;
  } | null;
};

type ProjectRef = { id: string; name: string; project_code: string | null; estado_interno?: string | null };

const ESTADOS_DISCOVERY = ["Research", "Ideación", "Concepción de experimento"];
const ESTADOS_POC = ["Seguimiento", "En definición", "En priorización"];

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
  const [parentProject, setParentProject] = useState<ProjectRef | null>(null);
  const [children, setChildren] = useState<ProjectRef[]>([]);
  const [discoveryOptions, setDiscoveryOptions] = useState<ProjectRef[]>([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [linkingParent, setLinkingParent] = useState(false);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPocForm, setShowPocForm] = useState(false);
  const [pocName, setPocName] = useState("");
  const [pocSummary, setPocSummary] = useState("");
  const [pocSubmitting, setPocSubmitting] = useState(false);

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
        setParentProject(data.parent || null);
        setChildren(data.children || []);
        setDiscoveryOptions(data.discoveryOptions || []);
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

  async function handleEstadoChange(estado: string) {
    const res = await fetch(`/api/proyectos/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: estado }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProject(updated);
  }

  async function handleVpvChange(vpv: number | null) {
    const res = await fetch(`/api/proyectos/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vpv }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProject(updated);
  }

  async function handleVincularPadre() {
    if (!selectedParentId) return;
    setLinkingParent(true);
    const res = await fetch(`/api/proyectos/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parent_project_id: selectedParentId }),
    });
    setLinkingParent(false);
    if (!res.ok) return;
    const elegido = discoveryOptions.find((d) => d.id === selectedParentId);
    if (elegido) setParentProject(elegido);
    setDiscoveryOptions([]);
  }

  async function handleCrearPoc(e: React.FormEvent) {
    e.preventDefault();
    if (!pocName.trim() || !pocSummary.trim()) return;
    setPocSubmitting(true);
    const res = await fetch(`/api/proyectos/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: pocName.trim(), summary: pocSummary.trim() }),
    });
    setPocSubmitting(false);
    if (!res.ok) return;
    const created = await res.json();
    setChildren((prev) => [...prev, created]);
    setShowPocForm(false);
    setPocName("");
    setPocSummary("");
  }

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
  
  // Find active or latest cycle with behavioral fallback for all Sellers projects
  let activeCycle = cycles.find((c) => c.estado === "activo") || cycles[0];
  
  if (!activeCycle) {
    const FALLBACK_CYCLES: Record<string, any> = {
      "PROD-SEC-BEST": {
        id: "cycle-prod-sec-best",
        title: "Enrutamiento de Respaldo (Second Best)",
        estado: "activo",
        fase_actual: "F1.5",
        brief: {
          causa: "A",
          target: "Sellers activos con órdenes bloqueadas por quiebres de inventario.",
          hipotesis: "Si habilitamos un canal de redirección rápida y preventivo en catálogo (Second Best), los sellers salvarán sus ventas sin incurrir en cancelación manual.",
          subPerfil: "Sellers con ventas recurrentes",
          experimento: "Simular desvíos automáticos en un grupo control de 10 sellers Pareto.",
          indicadores: "GMV salvado, tasa de desvíos automáticos exitosos."
        }
      },
      "PRM-1305": {
        id: "cycle-prm-1305",
        title: "Módulo de Notificaciones (WhatsApp)",
        estado: "activo",
        fase_actual: "F2",
        brief: {
          causa: "M",
          target: "Sellers con órdenes pendientes por más de 24 horas.",
          hipotesis: "Si notificamos vía WhatsApp con QuickActions para rescatar novedades, los sellers reaccionarán en minutos sin fricción de login.",
          subPerfil: "Sellers en operación diaria",
          experimento: "Enviar alertas in-channel de WhatsApp con botones a 15 sellers del piloto.",
          indicadores: "Tasa de confirmación rápida, reducción de tickets en soporte."
        }
      },
      "PROD-MUESTRA": {
        id: "cycle-prod-muestra",
        title: "Reducción del Miedo Logístico (Muestra propia)",
        estado: "activo",
        fase_actual: "F0",
        brief: {
          causa: "M",
          target: "Dropshippers registrados con 0 ventas reales.",
          hipotesis: "Si facilitamos la compra de su propia muestra en 1-Clic, el dropshipper validará el canal físico y perderá el miedo logístico.",
          subPerfil: "Sellers huérfanos con 0 órdenes",
          experimento: "Desplegar el checkout simplificado en catálogo para compra de muestra propia.",
          indicadores: "Tasa de conversión de muestras a órdenes reales."
        }
      },
      "PROD-WRAPPED": {
        id: "cycle-prod-wrapped",
        title: "Reactivación Inter-Campaña (Dropi Wrapped)",
        estado: "activo",
        fase_actual: "F4",
        brief: {
          causa: "M",
          target: "Dropshippers activos que caen en inactividad entre campaigns.",
          hipotesis: "Si entregamos una retrospectiva interactiva y gamificada (Wrapped) de sus percentiles y racha de ventas, activaremos la aversión a la pérdida (Loss Aversion) y estimularemos el retorno al catálogo.",
          subPerfil: "Sellers maduros inactivos",
          experimento: "Enviar el Wrapped personalizado en formato PDF/Imagen a una cohorte de 30 sellers inactivos.",
          indicadores: "Tasa de retorno in-app, tasa de importación de productos."
        }
      },
      "PROD-BUDDY": {
        id: "cycle-prod-buddy",
        title: "Descubrimiento Asistido (Lovable Buddy)",
        estado: "activo",
        fase_actual: "F3",
        brief: {
          causa: "M",
          target: "Sellers recién registrados sin 1ª orden.",
          hipotesis: "Si implementamos un recomendador interactivo e inteligente (Lovable Buddy), reduciremos el miedo a elegir mal y aceleraremos su primera orden.",
          subPerfil: "Sellers huérfanos sin 1ª orden",
          experimento: "Dar acceso al Buddy a 100 sellers nuevos y medir CTR en productos.",
          indicadores: "CTR, tasa de guardado e incremento de primera orden."
        }
      },
      "PROD-PILOT": {
        id: "cycle-prod-pilot",
        title: "Onboarding Guiado Segmentado (User Pilot)",
        estado: "activo",
        fase_actual: "F2",
        brief: {
          causa: "A",
          target: "Dropshippers huérfanos sin comunidad que abandonan en el onboarding.",
          hipotesis: "Si segmentamos el onboarding usando UserPilot basado en su nivel de conciencia comercial, aumentaremos la habilidad percibida (A) y la adopción de features clave.",
          subPerfil: "Vendedores huérfanos en su primer viaje (0-14 días)",
          experimento: "Implementar 3 tours guiados específicos según nivel de experiencia.",
          indicadores: "Reducción de bounce rate e incremento de activación."
        }
      },
      "PROD-ACADEMY": {
        id: "cycle-prod-academy",
        title: "Educación Guiada 'Tu primera venta en 7 días'",
        estado: "activo",
        fase_actual: "F3",
        brief: {
          causa: "M",
          target: "Sellers registrados sin conocimiento de pauta publicitaria ni finanzas básicas.",
          hipotesis: "Si articulamos cursos cortos prácticos vinculados directamente al CRM in-app, incentivaremos la creación rápida de la primera campaña publicitaria.",
          subPerfil: "Rebuscadores digitales sin experiencia",
          experimento: "Trackear visualización de videos y conversión a orden.",
          indicadores: "Tasa de finalización, conversión a primera orden."
        }
      },
      "STID-6598": {
        id: "cycle-stid-6598",
        title: "Estabilización de Integración Tienda Nube",
        estado: "activo",
        fase_actual: "F4",
        brief: {
          causa: "A",
          target: "Sellers con Tienda Nube que sufren por errores de sincronización.",
          hipotesis: "Si resolvemos las 6 fallas críticas (variables, fletes, direcciones), eliminaremos la fricción técnica y estabilizaremos el flujo operativo de despachos.",
          subPerfil: "Sellers con integración Tienda Nube",
          experimento: "Pruebas de Order Bump en portal de partners de Tienda Nube con 5 comercios.",
          indicadores: "Tasa de éxito en sincronización de webhooks."
        }
      },
      "PROD-HELP": {
        id: "cycle-prod-help",
        title: "Autogestión de Dudas SAC (Centro de Ayuda)",
        estado: "activo",
        fase_actual: "F1",
        brief: {
          causa: "A",
          target: "Sellers con dudas logísticas recurrentes que colapsan soporte.",
          hipotesis: "Si exponemos buscador de FAQs y buscador flotante interactivo, resolverán dudas autónomamente en < 5 minutos sin tickets.",
          subPerfil: "Sellers activos con incidencias de fletes o novedades",
          experimento: "Widget flotante con buscador unificado en el dashboard.",
          indicadores: "Tasa de autogestión, tickets por seller activo."
        }
      },
      "PROD-1478": {
        id: "cycle-prod-1478",
        title: "Experimento de Activación Neta (Time-to-Value)",
        estado: "activo",
        fase_actual: "F2",
        brief: {
          causa: "M",
          target: "Sellers nuevos con 1ª orden creada que se enfrían en el tramo de entrega.",
          hipotesis: "Si guiamos al seller paso a paso por WhatsApp/In-app en el tramo de entrega, reduciremos cancelaciones de órdenes COD y bajaremos el TTV Neto.",
          subPerfil: "Sellers registrados con 1ª orden creada",
          experimento: "Piloto de alertas y soporte en 3 pasos clave por WhatsApp.",
          indicadores: "Brecha de días registro-entrega, conversión neta."
        }
      },
      "PROD-1546": {
        id: "cycle-prod-1546",
        title: "Simplificación de Checkout (Huella Digital 3.0)",
        estado: "activo",
        fase_actual: "F2",
        brief: {
          causa: "A",
          target: "Sellers que abandonan al registrarse por exceso de campos requeridos.",
          hipotesis: "Si posponemos la configuración bancaria compleja hasta después de la primera venta, incrementaremos la tasa de registro exitoso en 20%.",
          subPerfil: "Sellers iniciando en la plataforma",
          experimento: "Onboarding en 2 pasos (nombre e importación) vs onboarding tradicional.",
          indicadores: "Conversión de registro, tasa de configuración."
        }
      },
      "PROD-1729": {
        id: "cycle-prod-1729",
        title: "Carga Masiva de Órdenes Compuestas (Torre Logística)",
        estado: "activo",
        fase_actual: "F1",
        brief: {
          causa: "A",
          target: "Sellers de alto volumen que gastan horas en despacho manual.",
          hipotesis: "Si habilitamos carga masiva de órdenes compuestas y Torre Logística para evidencias físicas, reduciremos tickets de SAC y optimizaremos tiempos de despacho.",
          subPerfil: "Sellers de alto volumen",
          experimento: "Excel compuesto con validadores de macros internos probado con 3 dropshippers.",
          indicadores: "Tiempo de despacho, tickets asociados a carga."
        }
      },
      "PROD-1665": {
        id: "cycle-prod-1665",
        title: "Capa 1.5 - Hábito Post-Venta (Fidelización)",
        estado: "activo",
        fase_actual: "F1",
        brief: {
          causa: "M",
          target: "Sellers con 1ª entrega que no continúan vendiendo.",
          hipotesis: "Si incentivamos el chequeo de stock y actualización de catálogo en las siguientes 48 horas de su primera entrega, estimularemos el hábito comercial y la recurrencia.",
          subPerfil: "Sellers con primera orden entregada con éxito",
          experimento: "Prompt in-app de felicitaciones con 3 tareas guiadas post-venta.",
          indicadores: "Conversión a 2ª orden, retención a 30 días."
        }
      },
      "PROD-1666": {
        id: "cycle-prod-1666",
        title: "Diagnóstico de Churn y Palancas de Rescate",
        estado: "activo",
        fase_actual: "F1",
        brief: {
          causa: "M",
          target: "Sellers con inactividad de 5 a 7 días comerciales tras pérdidas logísticas.",
          hipotesis: "Si implementamos un flujo de rescate basado en diagnóstico de fletes y soporte prioritized, reactivaremos el 15% de sellers dormidos.",
          subPerfil: "Comercios Pareto inactivos",
          experimento: "Llamadas y alertas manuales de rescate estructuradas a muestra de 30 comercios.",
          indicadores: "Tasa de reactivación, supervivencia posterior."
        }
      }
    };

    let norm = slug.toUpperCase();
    if (project.type === "POC" && parentProject?.project_code) {
      norm = parentProject.project_code.toUpperCase();
    }
    if (FALLBACK_CYCLES[norm]) {
      activeCycle = FALLBACK_CYCLES[norm];
    } else {
      const codeNorm = code.toUpperCase();
      if (FALLBACK_CYCLES[codeNorm]) {
        activeCycle = FALLBACK_CYCLES[codeNorm];
      }
    }
  }

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

          {project.prototype_url && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <strong style={{ fontSize: 12.5, display: "block", color: "var(--fg)" }}>🧪 Validación de Concepto (Mock)</strong>
                <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Prototipo interactivo diseñado para este experimento</span>
              </div>
              <a
                href={project.prototype_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12.5, fontWeight: 750, color: "#fff", background: "var(--dropi)",
                  border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6
                }}
              >
                Ver Mock de Validación <span style={{ fontSize: 11 }}>➔</span>
              </a>
            </div>
          )}
        </div>

        {/* Estado interno · Jerarquía Discovery ↔ POC · VPV */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32 }}>
          {parentProject && (
            <div style={{ marginBottom: 16, fontSize: 12.5, color: "var(--muted)" }}>
              Viene de:{" "}
              <a
                href={`/proyectos/${parentProject.project_code ? parentProject.project_code.toLowerCase() : parentProject.id}`}
                style={{ color: "var(--dropi)", fontWeight: 600, textDecoration: "none" }}
              >
                {parentProject.name}
              </a>
            </div>
          )}

          {!parentProject && project.type === "POC" && discoveryOptions.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <label style={{ fontSize: 12.5, color: "var(--muted)" }}>Vincular a proyecto padre:</label>
              <select
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                style={{ fontSize: 13, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--fg)" }}
              >
                <option value="">Elige un Discovery project…</option>
                {discoveryOptions.map((d) => (
                  <option key={d.id} value={d.id}>{d.project_code ? `${d.project_code} · ${d.name}` : d.name}</option>
                ))}
              </select>
              <button
                onClick={handleVincularPadre}
                disabled={!selectedParentId || linkingParent}
                style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: selectedParentId ? "pointer" : "default" }}
              >
                {linkingParent ? "Vinculando…" : "Vincular"}
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: children.length > 0 || project.type !== "POC" ? 20 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Estado interno
              </label>
              <select
                value={project.estado_interno ?? ""}
                onChange={(e) => handleEstadoChange(e.target.value)}
                style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--fg)" }}
              >
                <option value="" disabled>Sin definir</option>
                {(project.type === "POC" ? ESTADOS_POC : ESTADOS_DISCOVERY).map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {project.type === "POC" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  VPV · Valor Potencial Validado
                </label>
                <input
                  type="number"
                  defaultValue={project.vpv ?? ""}
                  onBlur={(e) => handleVpvChange(e.target.value === "" ? null : Number(e.target.value))}
                  placeholder="Sin definir"
                  style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--fg)" }}
                />
              </div>
            )}
          </div>

          {project.type !== "POC" && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                POCs de este proyecto
              </div>
              {children.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {children.map((c) => (
                    <a
                      key={c.id}
                      href={`/proyectos/${c.project_code ? c.project_code.toLowerCase() : c.id}`}
                      style={{ fontSize: 12, fontWeight: 700, color: "#F77F00", background: "#FFF7ED", padding: "4px 10px", borderRadius: 999, textDecoration: "none" }}
                    >
                      🧪 {c.name}
                    </a>
                  ))}
                </div>
              )}

              {showPocForm ? (
                <form onSubmit={handleCrearPoc} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420 }}>
                  <input
                    value={pocName}
                    onChange={(e) => setPocName(e.target.value)}
                    placeholder="Nombre del POC"
                    required
                    style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--fg)" }}
                  />
                  <textarea
                    value={pocSummary}
                    onChange={(e) => setPocSummary(e.target.value)}
                    placeholder="De qué se trata"
                    required
                    rows={2}
                    style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", color: "var(--fg)", resize: "vertical" }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="submit"
                      disabled={pocSubmitting}
                      style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "#F77F00", border: "none", borderRadius: 8, padding: "8px 14px", cursor: pocSubmitting ? "default" : "pointer" }}
                    >
                      {pocSubmitting ? "Creando…" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPocForm(false)}
                      style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowPocForm(true)}
                  style={{ fontSize: 12, fontWeight: 700, color: "#F77F00", background: "none", border: "1px dashed #F77F00", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}
                >
                  + Crear POC
                </button>
              )}
            </div>
          )}
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

                  {/* Brief View - Operationalizing discovery.md Playbook */}
                  {(() => {
                    const normSlug = slug.toUpperCase();
                    
                    // Comprehensive behavioral briefs for each core active project (Sellers cell)
                    const BEHAVIORAL_BRIEFS: Record<string, any> = {
                      "PRM-1305": {
                        nivelCognitivo: "Receptor Dormido / Explorador Temprano",
                        frictionEliminate: "Evita tener que entrar a app.dropi.co, iniciar sesión y buscar la orden para solucionar novedades manuales.",
                        frictionPreserve: "La validación por bot del interés del cliente final antes de alertar al dropshipper (para no fletar retornos perdidos).",
                        frictionInvest: "Configurar un saldo mínimo de Wallet para auto-despacho y definir sus transportadoras favoritas.",
                        hookTrigger: "Alerta push/WhatsApp con sonido directo en el celular del seller.",
                        hookAction: "Tocar un único botón de QuickAction (ej: [Autorizar Reintento]) desde su chat de WhatsApp.",
                        hookReward: "Venta salvada al instante, utilidad neta ($29.200 COP) acreditada directamente a su Wallet.",
                        hookInvestment: "Fondeo y retención de ganancias en su Wallet para financiar fletes automáticos de próximas ventas.",
                        sdtAutonomy: "El dropshipper retiene el control total para decidir si autoriza el reintento o retorna en 1 solo toque.",
                        sdtMastery: "Autogestión rápida del flete, disminuyendo la dependencia del canal técnico de soporte y SAC.",
                        sdtRelatedness: "Siente al bot de operaciones de Dropi como su propio asistente logístico de confianza.",
                        supuestoRiesgoso: "Los dropshippers confiarán en la transaccionalidad in-channel (WhatsApp) para aprobar movimientos de dinero y fletes de foma segura.",
                        testBarato: "Piloto Concierge: Envío manual de alertas simuladas a 15 sellers estrella midiendo velocidad de respuesta y conversión.",
                        costoEquivocacion: "Bajo. Si el seller no responde en WhatsApp en 24h, el flujo se devuelve al canal tradicional web sin alterar fletes.",
                      },
                      "PROD-MUESTRA": {
                        nivelCognitivo: "Receptor Dormido / Empleado Aspirante",
                        frictionEliminate: "Quita el formulario gigante de 15 campos (dirección, teléfono, cotización) que obligaba al seller a re-escribir sus propios datos de envío en cada prueba.",
                        frictionPreserve: "Configurar por primera vez su dirección física y método de pago por defecto (crea seguridad y ownership logístico).",
                        frictionInvest: "Establecer la dirección de muestra como definitiva y guardar la Wallet/PSE preferido.",
                        hookTrigger: "Toast de éxito al importar un producto: '¿Deseas pedir una muestra física de este artículo a costo de proveedor en 1-Clic?'",
                        hookAction: "Clic en el botón de QuickAction 'Solicitar Muestra' en catálogo.",
                        hookReward: "Recibir el producto a precio proveedor en la puerta de su casa para evaluar la calidad física y empaque.",
                        hookInvestment: "Dejar su calificación y opinión del proveedor en el catálogo de Dropi para la comunidad.",
                        sdtAutonomy: "Libertad absoluta para validar la calidad de su stock antes de invertir capital en pautas de Facebook Ads.",
                        sdtMastery: "Comprensión del journey de entrega y flete de cara a su comprador final.",
                        sdtRelatedness: "Mayor confianza en la veracidad física de los productos del proveedor Fabio.",
                        supuestoRiesgoso: "El dropshipper huérfano está dispuesto a gastar el dinero de su flete y producto solo para verificar la calidad física antes de pautar.",
                        testBarato: "Test de guerrilla interactivo con 5 dropshippers nuevos en su primer día para evaluar el CTR del prompt en catálogo.",
                        costoEquivocacion: "Trivial. El flete de muestra es autofinanciado por el seller, no representa riesgo financiero para la plataforma.",
                      },
                      "PROD-SEC-BEST": {
                        nivelCognitivo: "Explorador Activo / Master",
                        frictionEliminate: "Evita tener que buscar manualmente en el catálogo proveedores idénticos con stock y cotizar fletes alternativos ante un quiebre de inventario.",
                        frictionPreserve: "Revisar y comparar las utilidades netas ajustadas (absorber sobrecosto) en el prompt de emergencia antes de re-enrutar.",
                        frictionInvest: "Configurar reglas preventivas en catálogo (ej: autorizar sobrecosto de hasta $4.000 COP automáticamente).",
                        hookTrigger: "Banner rojo de urgencia en el listado de órdenes: 'Falta de Stock en Bogotá para la Orden #12511073'.",
                        hookAction: "Hacer clic en 'Desviar y Salvar Venta' seleccionando la bodega de respaldo sugerida.",
                        hookReward: "GMV y venta del cliente final salvados, manteniendo la reputación del comercio intacta.",
                        hookInvestment: "Activar el switch de 'Auto-redirección' para el producto afectado en catálogo.",
                        sdtAutonomy: "El seller decide si absorbe el sobrecosto de la bodega de respaldo o prefiere cancelar la orden del comprador.",
                        sdtMastery: "Control del inventario distribuido a nivel nacional sin retrasos manuales.",
                        sdtRelatedness: "El cliente final recibe su paquete sin saber que hubo un quiebre de stock del proveedor original.",
                        supuestoRiesgoso: "Los dropshippers prefieren sacrificar una parte de su margen de utilidad neto con tal de no perder la venta y proteger su marca.",
                        testBarato: "Prueba de guerrilla con prototipo interactivo con 5 comercios del Pareto analizando su aceptación al sobrecosto en caliente.",
                        costoEquivocacion: "Bajo. Si el seller prefiere no redirigir, la orden simplemente se marca en estado de cancelación por falta de stock.",
                      },
                      "PROD-WRAPPED": {
                        nivelCognitivo: "Explorador Activo / Master",
                        frictionEliminate: "Fricción de sentarse a calcular su rentabilidad histórica de forma manual.",
                        frictionPreserve: "Analizar su propio progreso comercial en comparación con la comunidad (Relatedness).",
                        frictionInvest: "Definir metas de ventas y racha deseada para el próximo ciclo/mes.",
                        hookTrigger: "Mensaje push/email con el título 'Mira lo que lograste en Dropi este mes'.",
                        hookAction: "Hacer clic y explorar el Wrapped interactivo.",
                        hookReward: "Recompensa social y de estatus (pertenecer al top 10% de vendedores del país).",
                        hookInvestment: "Compartir su Wrapped en redes y programar su siguiente meta de ventas.",
                        sdtAutonomy: "Decide qué metas de crecimiento activar en su catálogo.",
                        sdtMastery: "Visualización objetiva de su evolución y habilidades de e-commerce.",
                        sdtRelatedness: "Comparativa comunitaria en percentiles sin revelar datos privados.",
                        supuestoRiesgoso: "El dropshipper inactivo responde positivamente a estímulos emocionales y de estatus (Wrapped) reactivando sus campañas comerciales.",
                        testBarato: "Envío concierge manual por WhatsApp de las retrospectivas Wrapped.",
                        costoEquivocacion: "Bajo. El seller sigue inactivo sin perjuicio operativo.",
                      },
                      "PROD-BUDDY": {
                        nivelCognitivo: "Receptor Dormido / Principiante",
                        frictionEliminate: "Búsqueda infinita en un catálogo plano sin filtros de rentabilidad.",
                        frictionPreserve: "Seleccionar las categorías comerciales de su interés.",
                        frictionInvest: "Guardar productos recomendados en su lista de favoritos.",
                        hookTrigger: "Alerta in-app: 'Tengo 3 productos ganadores listos para ti hoy'.",
                        hookAction: "Interactuar con el Buddy y deslizar productos.",
                        hookReward: "Descubrir un producto con margen > 40% verificado.",
                        hookInvestment: "Importar el producto a su tienda con 1 clic.",
                        sdtAutonomy: "Siente control de elegir entre recomendaciones personalizadas.",
                        sdtMastery: "Desarrolla el criterio de selección de productos viables.",
                        sdtRelatedness: "Asistente inteligente que lo acompaña en su primer día.",
                        supuestoRiesgoso: "Los sellers nuevos confían en la sugerencia del recomendador de IA para iniciar sus primeras pautas.",
                        testBarato: "Guerrilla test con 5 usuarios nuevos analizando usabilidad del prototipo Lovable.",
                        costoEquivocacion: "Medio. Si la recomendación falla, el seller pierde presupuesto de pauta.",
                      },
                      "PROD-PILOT": {
                        nivelCognitivo: "Receptor Dormido / Explorador Temprano",
                        frictionEliminate: "Popups invasivos no relacionados con su nivel de conocimiento.",
                        frictionPreserve: "Responder la encuesta inicial de 3 preguntas de segmentación.",
                        frictionInvest: "Configurar su primera integración (Shopify/Woo).",
                        hookTrigger: "Mensaje de bienvenida interactivo al iniciar sesión.",
                        hookAction: "Completar los pasos del tour guiado (TTV bruto).",
                        hookReward: "Badge visual y acceso a catálogo Premium.",
                        hookInvestment: "Vincular su tienda oficial a Dropi.",
                        sdtAutonomy: "Elegir su propia ruta de aprendizaje (rápida o detallada).",
                        sdtMastery: "Sensación de control sobre la configuración de la tienda.",
                        sdtRelatedness: "Sentirse parte de un ecosistema que lo guía paso a paso.",
                        supuestoRiesgoso: "Los usuarios inactivos completan tours autoguiados de más de 3 pasos sin abandonar el flujo.",
                        testBarato: "Piloto de cohorte en UserPilot y análisis de embudo de retención.",
                        costoEquivocacion: "Bajo. El usuario vuelve al onboarding estándar.",
                      },
                      "PROD-ACADEMY": {
                        nivelCognitivo: "Receptor Dormido / Principiante",
                        frictionEliminate: "Cursos externos de 40 horas en plataformas de terceros.",
                        frictionPreserve: "Realizar micro-quizzes de validación de pauta.",
                        frictionInvest: "Configurar su primera campaña publicitaria real usando el copy aprendido.",
                        hookTrigger: "Notificación: 'Tu primera venta en 7 días está a 1 video de distancia'.",
                        hookAction: "Ver un video de 3 minutos sobre pauta COD.",
                        hookReward: "Copy y segmentación listos para copiar y pegar en Facebook Ads.",
                        hookInvestment: "Lanzar la primera campaña de pauta.",
                        sdtAutonomy: "Aprender a su propio ritmo sin presión externa.",
                        sdtMastery: "Habilidad de pauta publicitaria desarrollada.",
                        sdtRelatedness: "Mentoría virtual integrada.",
                        supuestoRiesgoso: "Los sellers terminan los videos si están incrustados directamente en el dashboard del catálogo.",
                        testBarato: "Análisis de retención del reproductor con 30 usuarios beta.",
                        costoEquivocacion: "Bajo. Costo de producción de videos.",
                      },
                      "STID-6598": {
                        nivelCognitivo: "Explorador Temprano / Activo",
                        frictionEliminate: "Corregir manualmente fletes, direcciones y tallas de órdenes en Dropi.",
                        frictionPreserve: "Mapear una única vez las ciudades del checkout.",
                        frictionInvest: "Establecer reglas de sincronización automática de stock.",
                        hookTrigger: "Notificación: 'Orden de Tienda Nube sincronizada sin errores'.",
                        hookAction: "Revisar y despachar la orden en 1 clic.",
                        hookReward: "Despacho completado con transportadora homologada.",
                        hookInvestment: "Dejar la integración activa para sincronizaciones automáticas en segundo plano.",
                        sdtAutonomy: "Control total del inventario de Tienda Nube sincronizado.",
                        sdtMastery: "Despreocupación de la consistencia de inventario.",
                        sdtRelatedness: "Integración fluida de canales de venta.",
                        supuestoRiesgoso: "Los errores de sincronización se deben a la discrepancia de nombres de ciudades de Tienda Nube contra bases de transportadoras.",
                        testBarato: "Prueba en sandbox con 5 tiendas reales del Pareto.",
                        costoEquivocacion: "Alto. Errores de sincronización causan cancelaciones de pedidos reales.",
                      },
                      "PROD-HELP": {
                        nivelCognitivo: "Explorador Temprano",
                        frictionEliminate: "Hacer cola de espera de 30 minutos en chat de soporte de SAC.",
                        frictionPreserve: "Escribir la pregunta con palabras clave claras.",
                        frictionInvest: "Calificar la utilidad del artículo del Centro de Ayuda.",
                        hookTrigger: "Buscador flotante con aviso: '¿Dudas de fletes o Wallet? Encuentra la respuesta en 30 segundos'.",
                        hookAction: "Escribir su duda en el buscador.",
                        hookReward: "Solución exacta con captura de pantalla paso a paso.",
                        hookInvestment: "Seguir los pasos del tutorial de autogestión.",
                        sdtAutonomy: "Resolver dudas de forma autónoma sin depender de soporte.",
                        sdtMastery: "Comprender los reglamentos logísticos y financieros del ecosistema.",
                        sdtRelatedness: "Dropi le provee autosuficiencia y control.",
                        supuestoRiesgoso: "Los sellers prefieren buscar la solución si el widget de FAQ está visible a menos de un clic de distancia.",
                        testBarato: "Fake door (widget sin backend) midiendo clics en home.",
                        costoEquivocacion: "Bajo. Clics fantasmas sin perjuicio.",
                      },
                      "PROD-1478": {
                        nivelCognitivo: "Receptor Dormido / Explorador Temprano",
                        frictionEliminate: "Seguimiento manual de la guía en el portal de la paquetera.",
                        frictionPreserve: "Alertar al comprador final del despacho de su pedido.",
                        frictionInvest: "Asegurar el reintento de entrega con soporte.",
                        hookTrigger: "Mensaje de felicitación: 'Tu primer pedido está en camino a Cali. Conoce el estado aquí'.",
                        hookAction: "Monitorear el mapa de entrega interactivo.",
                        hookReward: "Notificación de entrega exitosa y Wallet con saldo verde.",
                        hookInvestment: "Importar su segundo producto para vender.",
                        sdtAutonomy: "Seguimiento activo del flete con información simplificada.",
                        sdtMastery: "Aprender cómo funciona el ciclo logístico COD.",
                        sdtRelatedness: "Sentir que Dropi cuida su primera venta.",
                        supuestoRiesgoso: "Guiar al dropshipper en el tramo de la primera entrega reduce la deserción del vendedor.",
                        testBarato: "Piloto con cohorte manual de WhatsApp vs grupo de control.",
                        costoEquivocacion: "Bajo. Alertas manuales temporales.",
                      },
                      "PROD-1546": {
                        nivelCognitivo: "Receptor Dormido",
                        frictionEliminate: "Subir documentos KYC e ingresar cuenta bancaria en el primer minuto.",
                        frictionPreserve: "Escribir el nombre deseado de su tienda virtual.",
                        frictionInvest: "Completar el registro inicial de datos de contacto.",
                        hookTrigger: "Prompt: 'Crea tu tienda en 30 segundos. Solo necesitamos tu nombre comercial'.",
                        hookAction: "Completar los 2 campos obligatorios.",
                        hookReward: "Acceso inmediato al catálogo completo de Dropi.",
                        hookInvestment: "Importar el primer producto.",
                        sdtAutonomy: "Decidir cuándo configurar su información financiera.",
                        sdtMastery: "Inicio rápido sin barreras administrativas.",
                        sdtRelatedness: "Confianza inicial en la plataforma.",
                        supuestoRiesgoso: "Los usuarios están más dispuestos a dar datos KYC una vez que han visto saldo acumulado en su wallet.",
                        testBarato: "Test A/B con cohorte beta.",
                        costoEquivocacion: "Medio. Riesgo de acumular saldos sin cuentas vinculadas.",
                      },
                      "PROD-1729": {
                        nivelCognitivo: "Explorador Activo",
                        frictionEliminate: "Escribir manual de órdenes con productos y variantes múltiples.",
                        frictionPreserve: "Corregir las filas inválidas en el validador de Excel in-app.",
                        frictionInvest: "Guardar el mapeo de transportadoras favoritas en Excel.",
                        hookTrigger: "Mensaje: '150 órdenes cargadas con éxito en 3 segundos'.",
                        hookAction: "Hacer clic en 'Autorizar despacho masivo'.",
                        hookReward: "150 guías autogeneradas y listas para imprimir.",
                        hookInvestment: "Descargar reporte consolidado de fletes.",
                        sdtAutonomy: "Gestión masiva independiente de su bodega y pedidos.",
                        sdtMastery: "Eficiencia operativa a gran escala.",
                        sdtRelatedness: "Conexión directa con transportadoras en masa.",
                        supuestoRiesgoso: "Los comercios Pareto adoptan el Excel compuesto si el validador in-app les muestra exactamente dónde están los errores.",
                        testBarato: "Prueba cualitativa con 3 dropshippers del Pareto.",
                        costoEquivocacion: "Bajo. El seller vuelve a carga individual tradicional.",
                      },
                      "PROD-1665": {
                        nivelCognitivo: "Explorador Temprano",
                        frictionEliminate: "Buscar manualmente si su producto estrella sigue con stock en bodega.",
                        frictionPreserve: "Revisar las métricas de rentabilidad consolidada de su primera entrega.",
                        frictionInvest: "Establecer alertas de umbral mínimo de inventario.",
                        hookTrigger: "Mensaje: '¡Felicidades por tu primera entrega! Tu utilidad neta de $32.000 está en tu Wallet. Asegura tu inventario para mañana'.",
                        hookAction: "Clic en 'Verificar inventario de stock'.",
                        hookReward: "Recompensa de información y seguridad operativa.",
                        hookInvestment: "Activar el aviso de stockout preventivo.",
                        sdtAutonomy: "Gestión anticipada de su catálogo.",
                        sdtMastery: "Transición de vendedor de fin de semana a negocio recurrente.",
                        sdtRelatedness: "Confianza de stock asegurada.",
                        supuestoRiesgoso: "Hacer un chequeo de stock en las primeras 48h de la primera entrega acelera un 30% la creación de la segunda orden.",
                        testBarato: "Aviso in-app piloto con cohorte experimental.",
                        costoEquivocacion: "Bajo. El usuario ignora el prompt.",
                      },
                      "PROD-1666": {
                        nivelCognitivo: "Explorador Temprano / Activo",
                        frictionEliminate: "Reclamar fletes perdidos mediante chats infinitos con soporte.",
                        frictionPreserve: "Explicar el motivo de su pausa operativa al AM.",
                        frictionInvest: "Realizar un taller de optimización de entrega.",
                        hookTrigger: "Llamada del Account Manager ofreciendo auditoría de fletes gratuita.",
                        hookAction: "Revisar sus órdenes canceladas con el especialista.",
                        hookReward: "Ajuste y compensación de Wallet por errores logísticos.",
                        hookInvestment: "Volver a pautar productos del catálogo de confianza.",
                        sdtAutonomy: "Soporte dedicado para re-estructurar su negocio.",
                        sdtMastery: "Habilidad para reducir devoluciones en sus despachos.",
                        sdtRelatedness: "Siente respaldo comercial directo de Dropi.",
                        supuestoRiesgoso: "Los sellers inactivos vuelven a vender si se resuelven sus reclamos de fletes acumulados.",
                        testBarato: "Piloto con 30 usuarios inactivos.",
                        costoEquivocacion: "Medio. Costo en HH de las ejecutivas de soporte.",
                      }
                    };

                    const behaviorBrief = BEHAVIORAL_BRIEFS[normSlug] || {};

                    return (
                      <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 24, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.01)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #E2E8F0", paddingBottom: 10 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#475569", letterSpacing: "0.06em" }}>
                            FICHA METODOLÓGICA DE PRODUCT DISCOVERY (B=MAP)
                          </span>
                        </div>

                        {/* Secciones del Brief Conductual */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          
                          {/* 1. Diagnóstico Base */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                              <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Causa B=MAP</strong>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                                {brief?.causa ? CAUSA_LABELS[brief.causa] || brief.causa : "No especificado"}
                              </span>
                            </div>
                            <div>
                              <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Nivel Cognitivo (Eugene Schwartz)</strong>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                                {behaviorBrief.nivelCognitivo || "No especificado"}
                              </span>
                            </div>
                          </div>

                          <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 12 }}>
                            <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Público Objetivo (Target) & Sub-Perfil</strong>
                            <span style={{ fontSize: 13, color: "var(--fg)" }}>
                              {brief?.target ? `${brief.target} (${brief?.subPerfil || "General"})` : "No especificado"}
                            </span>
                          </div>

                          <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 12 }}>
                            <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Hipótesis de Intervención</strong>
                            <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.4, display: "block" }}>
                              {brief?.hipotesis || "No especificado"}
                            </span>
                          </div>

                          {/* 2. El Trilema de la Fricción */}
                          {behaviorBrief.frictionEliminate && (
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 4 }}>
                              <strong style={{ fontSize: 11, color: "var(--orange-primary)", textTransform: "uppercase", display: "block", marginBottom: 8, fontWeight: 800 }}>El Trilema de la Fricción</strong>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#fff", borderRadius: 8, padding: 12, border: "1px solid var(--border)" }}>
                                <div>
                                  <strong style={{ fontSize: 11, color: "#EF4444", display: "block" }}>❌ Fricción a Eliminar (Fricción Cognitiva)</strong>
                                  <span style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.4 }}>{behaviorBrief.frictionEliminate}</span>
                                </div>
                                <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 8, marginTop: 4 }}>
                                  <strong style={{ fontSize: 11, color: "#3B82F6", display: "block" }}>✓ Fricción a Preservar (Dificultad Deseable)</strong>
                                  <span style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.4 }}>{behaviorBrief.frictionPreserve}</span>
                                </div>
                                <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 8, marginTop: 4 }}>
                                  <strong style={{ fontSize: 11, color: "#10B981", display: "block" }}>⚙️ Fricción de Inversión (Investment Loop)</strong>
                                  <span style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.4 }}>{behaviorBrief.frictionInvest}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3. El Loop de Hábito (Hook) */}
                          {behaviorBrief.hookTrigger && (
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                              <strong style={{ fontSize: 11, color: "var(--orange-primary)", textTransform: "uppercase", display: "block", marginBottom: 8, fontWeight: 800 }}>Loop de Hábito (Hook de Eyal)</strong>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div style={{ background: "#fff", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                                  <strong style={{ fontSize: 10.5, color: "var(--muted)", display: "block" }}>1. Trigger (Disparador)</strong>
                                  <span style={{ fontSize: 12, color: "var(--fg)" }}>{behaviorBrief.hookTrigger}</span>
                                </div>
                                <div style={{ background: "#fff", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                                  <strong style={{ fontSize: 10.5, color: "var(--muted)", display: "block" }}>2. Action (Acción)</strong>
                                  <span style={{ fontSize: 12, color: "var(--fg)" }}>{behaviorBrief.hookAction}</span>
                                </div>
                                <div style={{ background: "#fff", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                                  <strong style={{ fontSize: 10.5, color: "var(--muted)", display: "block" }}>3. Variable Reward (Recompensa)</strong>
                                  <span style={{ fontSize: 12, color: "var(--fg)" }}>{behaviorBrief.hookReward}</span>
                                </div>
                                <div style={{ background: "#fff", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                                  <strong style={{ fontSize: 10.5, color: "var(--muted)", display: "block" }}>4. Investment (Inversión)</strong>
                                  <span style={{ fontSize: 12, color: "var(--fg)" }}>{behaviorBrief.hookInvestment}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. Autoevaluación SDT */}
                          {behaviorBrief.sdtAutonomy && (
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                              <strong style={{ fontSize: 11, color: "var(--orange-primary)", textTransform: "uppercase", display: "block", marginBottom: 8, fontWeight: 800 }}>Autoevaluación de Motivación Intrínseca (SDT)</strong>
                              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--fg)", background: "#fff", borderRadius: 8, padding: 12, border: "1px solid var(--border)" }}>
                                <div><strong>🙋 Autonomía:</strong> {behaviorBrief.sdtAutonomy}</div>
                                <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 6, marginTop: 4 }}><strong>🏆 Maestría (Mastery):</strong> {behaviorBrief.sdtMastery}</div>
                                <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 6, marginTop: 4 }}><strong>🤝 Relación (Relatedness):</strong> {behaviorBrief.sdtRelatedness}</div>
                              </div>
                            </div>
                          )}

                          {/* 5. Escalera de Validación */}
                          {behaviorBrief.supuestoRiesgoso && (
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                              <strong style={{ fontSize: 11, color: "var(--orange-primary)", textTransform: "uppercase", display: "block", marginBottom: 8, fontWeight: 800 }}>Escalera de Validación & Supuesto Riesgoso</strong>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#fff5f5", borderRadius: 8, padding: 12, border: "1px solid #fed7d7" }}>
                                <div>
                                  <strong style={{ fontSize: 11, color: "#c53030", display: "block" }}>🔥 Supuesto más Riesgoso</strong>
                                  <span style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.4 }}>{behaviorBrief.supuestoRiesgoso}</span>
                                </div>
                                <div style={{ borderTop: "1px dashed #fed7d7", paddingTop: 8, marginTop: 4 }}>
                                  <strong style={{ fontSize: 11, color: "#9b2c2c", display: "block" }}>⚙️ Test de Validación más Barato</strong>
                                  <span style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.4 }}>{behaviorBrief.testBarato}</span>
                                </div>
                                <div style={{ borderTop: "1px dashed #fed7d7", paddingTop: 8, marginTop: 4 }}>
                                  <strong style={{ fontSize: 11, color: "#9b2c2c", display: "block" }}>⚠️ Costo de Estar Equivocados (Downside)</strong>
                                  <span style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.4 }}>{behaviorBrief.costoEquivocacion}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 6. Experimento & Indicadores */}
                          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                            <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Definición del Experimento</strong>
                            <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.4, display: "block" }}>
                              {brief?.experimento || "No especificado"}
                            </span>
                          </div>

                          <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: 12 }}>
                            <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Indicadores de Éxito</strong>
                            <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.4, display: "block" }}>
                              {brief?.indicadores || "No especificado"}
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
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
