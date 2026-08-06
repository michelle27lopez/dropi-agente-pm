"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Los updates de la célula de Backoffice — mismo patrón que UpdatesLogistica:
// el Weekly (dropi-agente-pm/hub/Weekly_Backoffice/*.txt, transcrito a
// proyectos/backoffice/_lib/data.ts) va como UNA tarjeta que enlaza a
// /proyectos/backoffice/updates, donde se ve separado por acordeones por
// fecha. Los `celula_updates` reales (tabla Supabase) se suman aparte, tal
// como hace logística con `extra`.
// ─────────────────────────────────────────────────────────────────────────────

import { weeklyBackoffice } from "@/app/proyectos/backoffice/_lib/data";
import { Section, type Item } from "@/components/HomeSections";

const RUTA_WEEKLY = "/proyectos/backoffice/updates";

function truncar(texto: string, max: number) {
  return texto.length > max ? texto.slice(0, max - 1).trimEnd() + "…" : texto;
}

export default function UpdatesBackoffice({
  extra = [],
  onItemClick,
}: {
  /** Updates de `celula_updates` (Supabase) para esta célula. */
  extra?: Item[];
  onItemClick?: (item: Item) => void;
}) {
  const ultima = weeklyBackoffice[0];
  const items: Item[] = ultima
    ? [
        {
          key: "weekly-backoffice",
          name: `Weekly Backoffice · ${weeklyBackoffice.length} semana${weeklyBackoffice.length === 1 ? "" : "s"}`,
          description: `${ultima.fecha} — ${truncar(ultima.foco, 130)}`,
          url: RUTA_WEEKLY,
          tag: ultima.fechaISO,
          color: "#6366F1",
          icon: "📅",
        },
      ]
    : [];

  const todos = [...extra, ...items];

  return (
    <>
      <Section title="Updates" items={todos} ctaLabel="Ver weekly →" onItemClick={onItemClick} />
      {todos.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
      )}
    </>
  );
}
