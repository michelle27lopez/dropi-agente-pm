import Link from "next/link";
// Layout propio de esta pantalla. Los primitivos viven en ui.css (cargado en el
// layout de la sección); aquí solo va lo que es exclusivo de la home.
import "./_styles/home.css";
import {
  indicadores,
  perdidas,
  northStar,
  spotlight,
  proyectosQueAportanA,
  repartoPorObjetivo,
  saludDe,
  type Perdida,
  type Proyecto,
} from "@/app/proyectos/logistica/_lib/data";
import { Card, Pill, Stat, Bar, PageHeader, SectionTitle } from "@/app/proyectos/logistica/_components/ui";

// NIVEL 1 de la escalera (ley: logistica-lab/metodologia/tablero-diseno.md §6).
// La pregunta que responde esta pantalla es UNA: ¿vamos bien?
//
// Qué cambió y por qué:
//
// · Antes la cabecera ponía CUATRO métricas del mismo tamaño una al lado de
//   otra —meta, baseline, brecha, meta Q3—. El número que manda perdía la pelea
//   contra tres números de contexto. Ahora la tasa de entrega es el único
//   número en tamaño display; el resto es contexto subordinado.
//
// · Antes las 2 perdidas eran dos cards sueltas con una descripción, sin conexión
//   con nada. Ahora son las RAMAS DEL ÁRBOL: de cada una cuelgan las
//   iniciativas que la atacan, con su salud y un clic directo a la ficha. Es lo
//   que convierte el objetivo en algo navegable en vez de decorativo.
//
// · Se retiró el tag "Weekly Producto 3 jul": llevaba más de un mes sin
//   actualizarse y una fecha vieja en la cabecera desacredita todo lo de abajo.
//   Ahora la única fecha visible es la del insight, que sí viene con su dato.
//
// Lo que NO se muestra aquí, a propósito: fases, tickets, links, prosa de
// proyecto. Todo eso vive un nivel más abajo (mapa) o dos (ficha).

const HREF = "/proyectos/logistica";

export default function Home() {
  const reparto = repartoPorObjetivo();

  return (
    <main className="page">
      <PageHeader
        title="Indicadores de la orden"
        subtitle="Dos cosas mandan: que la orden se movilice y que se entregue. Dropi cobra cuando entrega."
      />

      {/* ── El número que manda ──────────────────────────────────────────────
          Único elemento con acento de marca de toda la pantalla (Regla del
          Acento Único). Si algo más pide naranja, uno de los dos baja. */}
      <Card tone="brand">
        <div className="obj">
          <div className="obj__main">
            <Stat
              size="lg"
              label="KR2.1 · Tasa de entrega sobre órdenes creadas"
              value={northStar.baselineCO}
              tone="risk"
              aside={<Pill tone="risk">brecha {northStar.brecha}</Pill>}
            />
            <Bar
              value={62.5}
              meta={70}
              tone="risk"
              label={`Tasa de entrega ${northStar.baselineCO}, meta ${northStar.metaEntrega}`}
            />
            <p className="obj__pie">
              Meta <b>{northStar.metaEntrega}</b> · compromiso del trimestre <b>{northStar.metaQ3}</b>
            </p>
          </div>
          <div className="obj__desglose">
            <p className="obj__formula">
              Las órdenes que no se entregan se pierden en dos sitios:
            </p>
            <div className="obj__sumandos">
              {perdidas.map((f) => (
                <span key={f.n} className="obj__sumando">
                  <b>{f.valor}</b> {f.nombre.toLowerCase()}
                </span>
              ))}
            </div>
            <p className="obj__fuente">
              Fuente: árbol objetivo v2 · 28-jun · <code>estrategia/arbol-okr-objetivo.md</code>
            </p>
          </div>
        </div>
      </Card>

      {/* ── La noticia de la semana ──────────────────────────────────────── */}
      <SectionTitle hint="Lo más reciente que cambió lo que sabemos.">
        Insight de la semana
      </SectionTitle>
      <Card>
        <div className="insight">
          <Stat size="lg" label={spotlight.cifraLabel} value={spotlight.cifra} tone="warn" />
          <div className="insight__cuerpo">
            <h3>{spotlight.titulo}</h3>
            <p className="u-prose">{spotlight.lectura}</p>
            <p className="insight__accion">
              <b>Siguiente paso:</b> {spotlight.accion}
            </p>
            <div className="u-row">
              <Link href={spotlight.linkHref} className="u-link">
                {spotlight.linkTexto}
              </Link>
              <span className="insight__fuente">{spotlight.fecha}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── El árbol: cada perdida con las iniciativas que la atacan ─────────── */}
      <SectionTitle hint="Las dos cosas que hay que mover para llegar al 70%. De cada una cuelga lo que se está haciendo hoy.">
        Movilización y devolución
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "340px" }}>
        {perdidas.map((f) => (
          <RamaPerdida key={f.n} perdida={f} />
        ))}
      </div>

      {/* ── Los otros dos indicadores ────────────────────────────────────── */}
      <SectionTitle hint="Contexto del número de arriba. Ninguno de los dos es la meta.">
        Los otros indicadores
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "300px" }}>
        {indicadores
          .filter((k) => k.nombre !== "Órdenes entregadas")
          .map((k) => (
            <Card key={k.nombre}>
              <Stat
                label={k.nombre}
                value={k.valorLabel}
                tone={k.tono === "bueno" ? "ok" : k.tono === "alerta" ? "warn" : "risk"}
                aside={<Pill tone={k.tono === "bueno" ? "ok" : "warn"}>{k.delta}</Pill>}
                hint={k.lectura}
              />
            </Card>
          ))}
      </div>

      {/* ── El hallazgo incómodo ─────────────────────────────────────────────
          No es un widget de relleno: mientras `sinDeclarar` sea alto, este es
          el dato más importante de la pantalla. Trabajo real que nadie ha
          atado al KR que la célula dice estar persiguiendo. */}
      <SectionTitle hint="El árbol objetivo establece que una iniciativa no entra si no mueve movilización o devolución.">
        Alineación del portafolio con el objetivo
      </SectionTitle>
      <Card tone={reparto.sinDeclarar > 0 ? "warn" : "neutral"}>
        <p className="u-prose">
          {reparto.sinDeclarar > 0 ? (
            <>
              <b>
                {reparto.sinDeclarar} de {reparto.total} iniciativas no declaran si mueven movilización o devolución.
              </b>{" "}
              Conectarlas —o decidir que no cuelgan de KR2.1— es una conversación del Cell Board, no
              un hueco del tablero.
            </>
          ) : (
            <>
              <b>
                Las {reparto.total} iniciativas declaran a qué aportan.
              </b>{" "}
              {reparto.movilizacion + reparto.devolucion} atacan directamente movilización o devolución,{" "}
              {reparto.habilitador} instrumentan y {reparto.fueraDelCentro} cuelgan de otro KR. Eso
              es lo que hay que sostener: el día que aparezca una sin declarar, vuelve a salir aquí.
            </>
          )}
        </p>
        <div className="u-row" style={{ marginTop: 12 }}>
          <Pill tone="risk">{reparto.movilizacion} · Movilización</Pill>
          <Pill tone="risk">{reparto.devolucion} · Devolución</Pill>
          <Pill tone="info">{reparto.habilitador} · Habilitadores</Pill>
          <Pill>{reparto.fueraDelCentro} · Fuera del centro</Pill>
          {reparto.sinDeclarar > 0 && <Pill tone="warn">{reparto.sinDeclarar} · Sin definir</Pill>}
        </div>
      </Card>

      {/* ── Bajar de nivel ───────────────────────────────────────────────── */}
      <SectionTitle>Ver en detalle</SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "240px" }}>
        <Acceso href={`${HREF}/mapa`} titulo="Mapa de la orden" desc="Dónde se rompe y quién lo está atacando." />
        <Acceso href={`${HREF}/iniciativas`} titulo="Iniciativas" desc="Qué empujamos y qué está atascado." />
        <Acceso href={`${HREF}/experimentos`} titulo="Experimentos" desc="Qué estamos probando y qué decide." />
        <Acceso href={`${HREF}/updates`} titulo="Updates" desc="Qué pasó esta semana." />
        <Acceso href={`${HREF}/info-logistica`} titulo="Info logística" desc="Funnel, tiempos, carriers y fuentes." />
        <Acceso href={`${HREF}/pendientes`} titulo="Pendientes" desc="Lo que sigue, por prioridad." />
      </div>
    </main>
  );
}

/** Una rama del árbol: la perdida y las iniciativas que cuelgan de ella. */
function RamaPerdida({ perdida }: { perdida: Perdida }) {
  const palancas = proyectosQueAportanA(perdida.aportaA);
  const tono = perdida.tono === "malo" ? "risk" : "warn";

  return (
    <Card tone={tono}>
      <Stat
        label={perdida.nombre}
        value={perdida.valor}
        tone={tono}
        aside={perdida.ticket ? <Pill code>{perdida.ticket}</Pill> : undefined}
      />
      <p className="rama__tamano">{perdida.ordenes}</p>
      <div style={{ margin: "10px 0 12px" }}>
        <Bar value={perdida.barra} tone={tono} label={`${perdida.nombre} ${perdida.valor}`} />
      </div>
      <p className="u-prose" style={{ color: "var(--muted)" }}>
        {perdida.desc}
      </p>

      <div className="rama__palancas">
        <span className="rama__titulo">
          {palancas.length > 0
            ? `${palancas.length} ${palancas.length === 1 ? "iniciativa la ataca" : "iniciativas la atacan"}`
            : "Sin iniciativas asignadas"}
        </span>
        {palancas.map((p) => (
          <Palanca key={p.slug} proyecto={p} />
        ))}
      </div>
    </Card>
  );
}

/** Fila de iniciativa dentro de una rama. Toda la fila es el destino: un solo clic, un solo sitio. */
function Palanca({ proyecto }: { proyecto: Proyecto }) {
  const salud = saludDe(proyecto);
  const motivo = proyecto.bloqueo
    ? `Bloqueado: ${proyecto.bloqueo}`
    : salud === "ok"
      ? "Entregado"
      : "Sin bloqueo declarado";

  return (
    <Link href={`${HREF}/proyecto/${proyecto.slug}`} className="palanca">
      <span className="palanca__salud" data-salud={salud} title={motivo} aria-label={motivo} />
      <span className="palanca__nombre">{proyecto.nombre}</span>
      {proyecto.codigo && <span className="palanca__codigo">{proyecto.codigo}</span>}
    </Link>
  );
}

function Acceso({ href, titulo, desc }: { href: string; titulo: string; desc: string }) {
  return (
    <Card href={href}>
      <h3 className="acceso__titulo">{titulo}</h3>
      <p className="acceso__desc">{desc}</p>
    </Card>
  );
}
