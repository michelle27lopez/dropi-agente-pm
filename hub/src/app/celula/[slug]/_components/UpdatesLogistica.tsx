"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Los updates de la célula de Logística.
//
// Por qué existe: /celula/logistica mostraba "Aún no hay updates registrados"
// aunque la célula lleva semanas publicando weekly. Eran dos vacíos sumados:
//
//   1. `celula_updates` no tiene fila para logística. La tabla tiene un
//      UNIQUE global sobre `week_date` (010_celula_updates.sql), así que la
//      semana que ya ocupó otra célula bloquea a las demás.
//   2. El registro de /weekly (app/weekly/data/index.ts) solo mapea semanas de
//      `suppliers` y `brands`. Logística no aparece, así que `SEMANAS.filter`
//      tampoco devolvía nada.
//
// Pero el weekly de logística SÍ existe: son las entradas de `weeklies` en el
// tablero (proyectos/logistica/_lib/data.ts), que se publican en
// /proyectos/logistica/updates. Esto las trae a la célula.
//
// 28-ago — de una fila a las siete semanas. Antes iba UNA tarjeta ("Weekly
// Producto · N semanas") porque no existía forma de enlazar a una semana
// concreta: todas habrían apuntado al mismo sitio. Con `?semana=<id>` en
// WeeklyView eso se acabó, así que cada semana es su propia tarjeta y se abre
// donde corresponde.
//
// Y deja de usar <Section> del hub: esa fila gris está pensada para listas
// homogéneas (proyectos, documentos) y aquí aplana lo único que importa —qué
// pasó cada semana y cómo van los indicadores—. Se usa el kit del tablero, que
// es el mismo lenguaje visual al que se llega al hacer clic. Los tres CSS son
// los mismos que carga el layout de /proyectos/logistica, en el mismo orden;
// todo está bajo `.log-root`, así que no se escapa a las demás células.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import "@/app/proyectos/logistica/_styles/tokens.css";
import "@/app/proyectos/logistica/_styles/registro.css";
import "@/app/proyectos/logistica/_styles/ui.css";
import { weeklies, type Weekly } from "@/app/proyectos/logistica/_lib/data";
import { partir } from "@/app/proyectos/logistica/_lib/format";
import {
  Card,
  KpiCard,
  Narrativa,
  Pill,
  SectionTitle,
  type Tone,
} from "@/app/proyectos/logistica/_components/ui";
import { Section, type Item } from "@/components/HomeSections";

const RUTA_WEEKLY = "/proyectos/logistica/updates";
const RUTA_INSIGHTS = "/proyectos/logistica/insights";

const TONO: Record<"bueno" | "alerta" | "malo", Tone> = { bueno: "ok", alerta: "warn", malo: "risk" };

function hrefDe(w: Weekly) {
  return `${RUTA_WEEKLY}?semana=${w.id}`;
}

/** Una semana en la lista: cuándo fue, qué concluyó y qué trae dentro. */
function SemanaCard({ w, actual }: { w: Weekly; actual: boolean }) {
  const [titulo] = partir(w.foco);
  return (
    <Card href={hrefDe(w)} tone={actual ? "brand" : "neutral"}>
      <div className="u-row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="u-card__title">{w.semana}</span>
        <span className="u-link">Abrir →</span>
      </div>
      <span className="u-celda__sub">{w.fecha}</span>
      <p className="u-card__body u-clamp">{titulo}</p>
      {/* Los títulos de sección con su conteo dicen de qué trató la semana sin
          que nadie tenga que abrirla. Es lo que en el registro de cellboards
          son los "temas". */}
      <div className="u-row" style={{ marginTop: 10, gap: 6 }}>
        {actual && <Pill tone="warn">✦ Esta semana</Pill>}
        {w.secciones.map((s) => (
          <Pill key={s.titulo}>
            {s.titulo} · {s.proyectos.length}
          </Pill>
        ))}
      </div>
    </Card>
  );
}

export default function UpdatesLogistica({
  extra = [],
  onItemClick,
}: {
  /** Updates de `celula_updates`, si algún día logística consigue una fila. */
  extra?: Item[];
  onItemClick?: (item: Item) => void;
}) {
  // `weeklies` ya viene de la más reciente a la más antigua (lo documenta
  // data.ts), así que no se reordena: el orden es una decisión de quien escribe.
  const [ultima, ...anteriores] = weeklies;

  if (!ultima) {
    return (
      <>
        <Section title="Updates" items={extra} ctaLabel="Ver →" onItemClick={onItemClick} />
        {extra.length === 0 && <p className="u-vacio">Aún no hay updates registrados.</p>}
      </>
    );
  }

  const [titulo, detalle] = partir(ultima.foco);

  return (
    <div className="log-root">
      {/* Lo último, con sus cifras: el motivo por el que alguien entra aquí es
          saber cómo vamos, y eso estaba a dos clics. */}
      <div className="u-row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <div className="u-row">
          <Pill tone="warn">✦ Esta semana</Pill>
          <span className="u-celda__sub">{ultima.fecha}</span>
        </div>
        <Link className="u-link" href={hrefDe(ultima)}>
          Ver el weekly completo →
        </Link>
      </div>

      <Narrativa eyebrow={ultima.semana} titulo={titulo}>
        {detalle && <p>{detalle}</p>}
      </Narrativa>

      <div className="u-grid" style={{ ["--u-min" as string]: "240px", marginTop: 12 }}>
        {ultima.indicadores.map((k) => {
          const tone = TONO[k.tono];
          return (
            <KpiCard
              key={k.nombre}
              label={k.nombre}
              value={k.valor}
              meta={k.meta}
              tone={tone}
              delta={{ text: k.estado, trend: k.trend, tone }}
              hint={k.nota}
            />
          );
        })}
      </div>

      {anteriores.length > 0 && (
        <>
          <SectionTitle hint="Cada semana abre en su propia entrada del weekly. No se borran: el histórico es el argumento.">
            {`Semanas anteriores · ${anteriores.length}`}
          </SectionTitle>
          <div className="u-grid" style={{ ["--u-min" as string]: "300px" }}>
            {anteriores.map((w) => (
              <SemanaCard key={w.id} w={w} actual={false} />
            ))}
          </div>
        </>
      )}

      <p className="u-fuente">
        {weeklies.length} semanas publicadas ·{" "}
        <Link className="u-link" href={RUTA_WEEKLY}>
          Weekly Product
        </Link>{" "}
        ·{" "}
        <Link className="u-link" href={RUTA_INSIGHTS}>
          Insights de la célula
        </Link>
      </p>

      {/* Si algún día `celula_updates` tiene filas de logística, se listan
          debajo con el componente compartido — son otro formato, no weeklies. */}
      {extra.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Section title="Otros updates" items={extra} ctaLabel="Ver →" onItemClick={onItemClick} />
        </div>
      )}
    </div>
  );
}
