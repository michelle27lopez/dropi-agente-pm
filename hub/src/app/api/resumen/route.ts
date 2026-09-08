import { NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";
import { previewUpdateContent } from "@/lib/update-preview";

// ─────────────────────────────────────────────────────────────────────────────
// Resumen ejecutivo cross-célula, armado EN VIVO desde la BD (nada de texto
// hardcodeado — /resumen antes traía los "Delivery Risks" de un objeto fijo
// de julio 2026). Una fila por célula: objetivo/enfoque + estado real de sus
// proyectos + últimos updates + bloqueadores + próximos hitos.
//
// Acceso: super admin, stakeholder (Head de Producto, CEO, CPO) o quien
// tenga ve_hub_completo — mismo criterio de "fullAccess" del HubHeader.
// ─────────────────────────────────────────────────────────────────────────────

const DIAS_ESTANCADO = 21;
const HORIZONTE_HITOS_DIAS = 60;

// estado_interno que ya no cuenta como trabajo en curso.
const ESTADOS_INACTIVOS = new Set(["Cerrado"]);

type ProjectRow = {
  id: string;
  name: string;
  project_code: string | null;
  type: string | null;
  estado_interno: string | null;
  prioridad: string | null;
  celula_owner_id: string | null;
  updated_at: string | null;
  fecha_handoff: string | null;
  fecha_inicio_dev: string | null;
  fecha_entrega_qa: string | null;
  fecha_salida_produccion: string | null;
  fecha_objetivo_experimento: string | null;
  fecha_objetivo_decision: string | null;
  fechas_discovery_confirmadas: boolean | null;
};

type UpdateRow = {
  celula_id: string | null;
  week_date: string;
  title: string;
  content: string;
  tipo: string | null;
};

function etapaDe(type: string | null): "discovery" | "poc" | "delivery" | "following" {
  if (type === "POC") return "poc";
  if (type === "Delivery Proyecto") return "delivery";
  if (type === "Following") return "following";
  return "discovery";
}

function diasDesde(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function diasHasta(iso: string | null): number | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const hoy = new Date();
  const t = new Date(y, m - 1, d).getTime() - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime();
  return Math.round(t / 86_400_000);
}

export async function GET() {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin, is_stakeholder, celulas(ve_hub_completo)")
    .eq("id", user.id)
    .maybeSingle();

  // `celulas` viene de un join a-uno; según el caso Supabase lo entrega como
  // objeto o como array de un elemento — se normaliza a boolean.
  const celulasRel = profile?.celulas as unknown;
  const veHub = Array.isArray(celulasRel)
    ? (celulasRel[0] as { ve_hub_completo?: boolean } | undefined)?.ve_hub_completo
    : (celulasRel as { ve_hub_completo?: boolean } | null | undefined)?.ve_hub_completo;
  const permitido = !!(profile?.is_super_admin || profile?.is_stakeholder || veHub);
  if (!permitido) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const [{ data: celulas, error: celErr }, { data: projects, error: projErr }, { data: updates, error: updErr }] =
    await Promise.all([
      supabase
        .from("celulas")
        .select("id, nombre, slug, lead, area, mision, vision, nsm, foco_trimestre, enlace_direccionamiento")
        .order("nombre", { ascending: true }),
      supabase
        .from("projects")
        .select(
          "id, name, project_code, type, estado_interno, prioridad, celula_owner_id, updated_at, fecha_handoff, fecha_inicio_dev, fecha_entrega_qa, fecha_salida_produccion, fecha_objetivo_experimento, fecha_objetivo_decision, fechas_discovery_confirmadas",
        ),
      supabase
        .from("celula_updates")
        .select("celula_id, week_date, title, content, tipo")
        .order("week_date", { ascending: false }),
    ]);

  if (celErr) return NextResponse.json({ error: celErr.message }, { status: 500 });
  if (projErr) return NextResponse.json({ error: projErr.message }, { status: 500 });
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  const projRows = (projects ?? []) as ProjectRow[];
  const updRows = (updates ?? []) as UpdateRow[];

  const resultado = (celulas ?? []).map((c) => {
    const propios = projRows.filter((p) => p.celula_owner_id === c.id);
    const vivos = propios.filter((p) => !ESTADOS_INACTIVOS.has(p.estado_interno ?? ""));

    const etapas = { discovery: 0, poc: 0, delivery: 0, following: 0 };
    for (const p of vivos) etapas[etapaDe(p.type)] += 1;

    // Bloqueadores: Delivery Proyectos urgentes (P0/P1) que todavía no
    // tienen fecha de salida a producción — normalmente por falta de slot
    // de TI. El motivo distingue "sin handoff" (TI ni lo ha recibido) de
    // "sin fecha de salida" (lo tiene pero sin compromiso de entrega).
    const bloqueadores = vivos
      .filter(
        (p) =>
          p.type === "Delivery Proyecto" &&
          (p.prioridad === "P0" || p.prioridad === "P1") &&
          !p.fecha_salida_produccion &&
          !["Activo", "Cerrado"].includes(p.estado_interno ?? ""),
      )
      .sort((a, b) => (a.prioridad ?? "P9").localeCompare(b.prioridad ?? "P9"))
      .slice(0, 6)
      .map((p) => ({
        code: p.project_code,
        name: p.name,
        prioridad: p.prioridad,
        estado: p.estado_interno,
        motivo: !p.fecha_handoff ? "Sin fecha de handoff a TI" : "Sin fecha de salida a producción",
      }));

    const estancados = vivos.filter((p) => {
      const d = diasDesde(p.updated_at);
      return d !== null && d > DIAS_ESTANCADO && !["Producción"].includes(p.estado_interno ?? "");
    }).length;

    const p0SinFecha = bloqueadores.filter((b) => b.prioridad === "P0").length;

    const misUpdates = updRows.filter((u) => u.celula_id === c.id);
    const ultimoWeekly = misUpdates.find((u) => u.tipo === "weekly");
    const ultimoCellBoard = misUpdates.find((u) => u.tipo === "cell_board");
    const diasUltimoUpdate = misUpdates.length > 0 ? diasDesde(misUpdates[0].week_date) : null;

    // Próximos hitos: cualquier fecha (delivery o discovery) que caiga en
    // los próximos 60 días. Cada una con su etiqueta y si es confirmada.
    const HITO_DEFS: { campo: keyof ProjectRow; label: string; confirmadaSi: (p: ProjectRow) => boolean }[] = [
      { campo: "fecha_handoff", label: "Handoff a TI", confirmadaSi: () => true },
      { campo: "fecha_entrega_qa", label: "Entrega a QA", confirmadaSi: () => true },
      { campo: "fecha_salida_produccion", label: "Salida a producción", confirmadaSi: () => true },
      { campo: "fecha_objetivo_experimento", label: "Experimento (discovery)", confirmadaSi: (p) => !!p.fechas_discovery_confirmadas },
      { campo: "fecha_objetivo_decision", label: "Decisión (discovery)", confirmadaSi: (p) => !!p.fechas_discovery_confirmadas },
    ];
    const proximosHitos = vivos
      .flatMap((p) =>
        HITO_DEFS.map((def) => {
          const fecha = p[def.campo] as string | null;
          const dh = diasHasta(fecha);
          if (dh === null || dh < 0 || dh > HORIZONTE_HITOS_DIAS) return null;
          return {
            code: p.project_code,
            name: p.name,
            label: def.label,
            fecha,
            dias: dh,
            confirmada: def.confirmadaSi(p),
          };
        }),
      )
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => a.dias - b.dias)
      .slice(0, 8);

    let semaforo: "verde" | "ambar" | "rojo" = "verde";
    if (p0SinFecha > 0 || diasUltimoUpdate === null || (diasUltimoUpdate ?? 0) > DIAS_ESTANCADO) {
      semaforo = "rojo";
    } else if (estancados > 0 || bloqueadores.length > 0 || (diasUltimoUpdate ?? 0) > 10) {
      semaforo = "ambar";
    }

    return {
      id: c.id,
      nombre: c.nombre,
      slug: c.slug,
      lead: c.lead,
      area: c.area,
      objetivo: {
        mision: c.mision ?? null,
        vision: c.vision ?? null,
        nsm: c.nsm ?? null,
        foco_trimestre: c.foco_trimestre ?? null,
        enlace_direccionamiento: c.enlace_direccionamiento ?? null,
      },
      proyectos_total: vivos.length,
      etapas,
      salud: {
        semaforo,
        p0_sin_fecha: p0SinFecha,
        estancados,
        dias_ultimo_update: diasUltimoUpdate,
      },
      bloqueadores,
      ultimo_weekly: ultimoWeekly
        ? { week_date: ultimoWeekly.week_date, title: ultimoWeekly.title, preview: previewUpdateContent(ultimoWeekly.content) }
        : null,
      ultimo_cell_board: ultimoCellBoard
        ? { week_date: ultimoCellBoard.week_date, title: ultimoCellBoard.title, preview: previewUpdateContent(ultimoCellBoard.content) }
        : null,
      proximos_hitos: proximosHitos,
    };
  });

  return NextResponse.json(resultado);
}
