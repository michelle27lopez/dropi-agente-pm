import Link from "next/link";
import {
  proyectos,
  linksDe,
  type TipoIniciativa,
  type Proyecto,
} from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

export const metadata = { title: "Registro de iniciativas · Tablero Logística" };

// Orden de lectura: primero lo que ya se puede tomar, al final lo que todavía
// no existe. Un backlog arriba engaña sobre cuánto trabajo hay realmente vivo.
const DOC_LABEL: Record<NonNullable<Proyecto["doc"]>, string> = {
  completo: "spec completo ✅",
  parcial: "spec parcial 🟡",
  ninguno: "sin documentar ❌",
};

const ORDEN: { tipo: TipoIniciativa; titulo: string; nota: string }[] = [
  { tipo: "Lanzamiento", titulo: "Lanzamientos", nota: "Ya construido. Se acompaña, no se descubre." },
  { tipo: "Proyecto", titulo: "Proyectos", nota: "Alcance definido. Van a desarrollo (o ya están)." },
  { tipo: "Experimento", titulo: "Experimentos", nota: "Se valida la palanca antes de comprometer desarrollo. El handoff a TI es condicional al resultado." },
  { tipo: "Oportunidad", titulo: "Oportunidades", nota: "Hay evidencia de que ahí hay valor, pero todavía no hay alcance." },
  { tipo: "Idea", titulo: "Ideas · backlog", nota: "Sin discovery propio todavía. Están para no perderlas, no para trabajarlas." },
];

function Fila({ p }: { p: Proyecto }) {
  const links = linksDe(p);
  const faltantes = links.filter((l) => l.falta || !l.href).length;
  return (
    <div className="ini">
      <div className="ini-head">
        <Link href={`/proyectos/logistica/proyecto/${p.slug}`} className="ini-nombre">
          {p.destacado ? "⭐ " : ""}
          {p.nombre}
        </Link>
        <span className="badge b-phase">{p.fase}</span>
        <span className={`badge b-handoff h-${p.handoff.replace(/\s/g, "-")}`}>{p.handoff}</span>
        {p.codigo ? (
          <span className="badge b-code">{p.codigo}</span>
        ) : (
          <span className="badge b-warn">sin registrar en Darwin</span>
        )}
      </div>
      <p className="ini-desc">{p.descripcion}</p>
      {(p.jira || p.doc) && (
        <p className="ini-jira">
          {p.jira && (
            <span className={p.jira.startsWith("⚠️") ? "ini-desalineado" : undefined}>
              <b>Jira:</b> {p.jira}
            </span>
          )}
          {p.doc && <span><b>Doc:</b> {DOC_LABEL[p.doc]}</span>}
        </p>
      )}
      {p.bloqueo && <p className="ini-bloqueo">⛔ {p.bloqueo}</p>}
      <LinkList links={links} />
      {faltantes > 0 && (
        <p className="ini-faltan">
          {faltantes} {faltantes === 1 ? "enlace pendiente" : "enlaces pendientes"} de conectar.
        </p>
      )}
    </div>
  );
}

export default function IniciativasPage() {
  const sinCodigo = proyectos.filter((p) => !p.codigo).length;
  const sinLink = proyectos.filter((p) => linksDe(p).some((l) => l.falta || !l.href)).length;
  // El hallazgo del mapa de los 3 ejes, como contador vivo en vez de párrafo en
  // un .md que nadie abre: cuántas iniciativas tienen Jira desalineado.
  const desalineadas = proyectos.filter((p) => p.jira?.startsWith("⚠️")).length;
  const sinDoc = proyectos.filter((p) => p.doc === "ninguno").length;

  return (
    <main className="page">
      <section className="wk-hero">
        <span className="tag">Registro único · Logística</span>
        <h1>Todas las iniciativas, en un solo lugar</h1>
        <p className="wk-foco">
          Tres ejes explícitos —<b> qué es</b> (tipo), <b>dónde va</b> (fase) y{" "}
          <b>si TI puede tomarlo</b> (handoff)— más lo que la bloquea. Es la misma taxonomía que usa
          Darwin en Supabase (<code>projects.type / status / handoff_status</code>), para que el
          tablero y <Link href="/celula/logistica">/celula/logistica</Link> no se contradigan.
        </p>
      </section>

      <div className="ini-alert">
        <span className="cr-alert-ico">🔗</span>
        <div>
          <strong>Qué falta para que todo sea alcanzable desde todo lado</strong>
          <p>
            <b>{desalineadas}</b> iniciativas tienen el estado de Jira desalineado con cómo se
            trabajan · <b>{sinDoc}</b> no tienen spec en el repo · <b>{sinCodigo}</b> no están
            registradas en Darwin (sin código LOG-XXX) · <b>{sinLink}</b> tienen enlaces
            pendientes de conectar.
          </p>
          <p>
            Los huecos se muestran a propósito: un <em>falta link</em> visible es un pendiente;
            un hueco invisible es una mentira. Estados de Jira verificados uno por uno el
            22-jul (<code>logistica-lab/estrategia/mapa-proyectos-3-ejes.md</code>).
          </p>
        </div>
      </div>

      {ORDEN.map(({ tipo, titulo, nota }) => {
        const items = proyectos.filter((p) => p.tipo === tipo);
        if (items.length === 0) return null;
        return (
          <section key={tipo}>
            <div className="eyebrow">
              {titulo} · {items.length}
            </div>
            <p className="ini-nota">{nota}</p>
            <div className="ini-list">
              {items.map((p) => (
                <Fila key={p.slug} p={p} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
